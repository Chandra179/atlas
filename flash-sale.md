---
title: "Flash Sale"
aliases: [cache-stampede, thundering-herd, dog-piling, cache-miss-storm]
tags: [system-design, system-design/caching]
created: "2026-06-13"
modified: "2026-07-13"
---

# Flash Sale: System Design

A flash sale is a short-duration event (typically 5 minutes) where a limited number of items are sold at a steep discount. Millions of concurrent users attempt to purchase the same product simultaneously. The system must handle a sudden burst from 0 to 1M+ requests/second without crashing, while guaranteeing every user sees accurate inventory counts.

---

## Requirements

### Functional Requirements

| ID | Requirement |
|----|-------------|
| FR1 | Users can browse flash-sale product details (name, price, image, description) |
| FR2 | Users can view real-time remaining inventory count |
| FR3 | Users can place an order to purchase the item |
| FR4 | System reserves inventory atomically on successful purchase |
| FR5 | System returns success/failure response to user within 200ms (P99) |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1 | Read latency (P99) | ≤ 200ms |
| NFR2 | Write latency (P99) | ≤ 100ms (reservation acknowledgment) |
| NFR3 | Read consistency | Inventory count reads reflect latest reservation |
| NFR4 | Availability | 99.99% during sale window |
| NFR5 | Database protection | Never exceed connection pool; no cascading failures |
| NFR6 | Stale data tolerance | ≤ 100ms staleness acceptable for product details; inventory must be fresh |

---

## Estimation

### Traffic Model

| Dimension | Value |
|-----------|-------|
| Concurrent users | 50M |
| Items on sale | 10,000 |
| Sale duration | 5 minutes (300s) |
| Peak traffic | 0 → 1M requests/second in <2s (single hot product) |
| Read:Write ratio | ~100:1 (reads dominate) |
| Purchase rate | ~33K writes/sec (10M purchases / 300s) |

### QPS Calculation

```
Peak read QPS  = 1,000,000 req/s (single hot key)
Peak write QPS = 33,000 req/s  (heavily skewed: 95% to 1–2 hot products)
Total QPS      ≈ 1.03M req/s
```

### Storage

| Data | Size |
|------|------|
| Product metadata (10K items × 500 bytes) | ~5 MB |
| Inventory counter (10K items × 8 bytes) | ~80 KB |
| Redis overhead (keys + TTL) | ~10 MB |
| **Total cache footprint** | **< 20 MB** |

### Bandwidth

- Read response: ~500 bytes (product + stock count)
- Write request: ~200 bytes
- Peak egress: 1M × 500B = **500 MB/s** (within single AZ capacity)

---

## High-Level Design

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌────────────┐
│   Client    │────►│  Load        │────►│  App Servers    │────►│  L1 Cache  │
│  (Mobile/   │     │  Balancer    │     │  (Stateless)    │     │ (sync.Map) │
│   Web)      │     │  (L4/L7)     │     │  N × processes  │     │  TTL: 1s   │
└─────────────┘     └──────────────┘     └─────────┬───────┘     └─────┬──────┘
                                                   │                   │
                                                   │ L1 miss           │ L1 hit
                                                   ▼                   │
                                          ┌─────────────────┐          │
                                          │  L2 Cache       │          │
                                          │  (Redis Cluster)│          │
                                          │  TTL: 5s        │          │
                                          └────────┬────────┘          │
                                                   │ L2 miss
                                                   ▼
                                          ┌─────────────────┐
                                          │  Primary DB     │
                                          │  (PostgreSQL)   │
                                          │  Async workers  │
                                          └─────────────────┘
```

### Components

| Component | Role | Scaling |
|-----------|------|---------|
| Load Balancer | Distribute traffic, SSL termination | Horizontal (active-active) |
| App Servers | Stateless request handling, L1 cache | Horizontal (50+ processes) |
| L1 Cache (sync.Map) | In-process, sub-μs latency, absorbs microburst | Per-process |
| L2 Cache (Redis) | Shared cache, inventory counters, 5s TTL | Cluster (3+ shards) |
| Message Queue | Order persistence (Kafka/SQS) | Partitioned by product_id |
| DB Workers | Batch-write orders to PostgreSQL | 10–20 workers |
| Primary DB | Source of truth for orders, not live inventory | Vertical (read replicas for non-sale) |

---

## Database Schema

```sql
-- Inventory counter lives in Redis (not in PostgreSQL)
-- PostgreSQL stores only durable order records

-- Orders table (append-only, partitioned by product_id)
CREATE TABLE orders (
    order_id      BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    product_id    BIGINT NOT NULL,
    quantity      INT NOT NULL DEFAULT 1,
    status        VARCHAR(20) NOT NULL DEFAULT 'reserved',  -- reserved → confirmed
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at  TIMESTAMPTZ
) PARTITION BY HASH (product_id);

-- 64 partitions for write parallelism
CREATE TABLE orders_p0 PARTITION OF orders FOR VALUES WITH (MODULUS 64, REMAINDER 0);
-- ... create orders_p1 through orders_p63

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status = 'reserved';
```

---

## API Design

```protobuf
// Read path
GET /api/v1/flash-sale/products/{product_id}
Response: { product_id, name, price, image_url, stock_count, version }

// Write path (async reservation)
POST /api/v1/flash-sale/orders
Request:  { user_id, product_id, quantity }
Response: { order_id, status: "reserved", remaining_stock }

// Optional: poll for confirmation
GET /api/v1/flash-sale/orders/{order_id}
Response: { order_id, status: "confirmed" | "reserved" | "failed" }
```

---

## Deep Dive — Read Path (The Stampede Problem)

### The Core Problem

When the hot product's cache entry expires, **all 1M concurrent requests miss simultaneously**. Each issues its own `SELECT stock_count FROM inventory`, exhausting the DB connection pool within milliseconds. The DB slows down → cache rebuild takes seconds → more timeouts → more retries → positive feedback loop → cascading failure.

```
Client 1 ─┐
Client 2 ─┤   Cache MISS (TTL expired)
...       │   ──────────────────────►  1M parallel SELECTs ──► DB pool exhausted
Client N ─┘
```

### Strategy 1: Request Coalescing (singleflight)

Serialize cache recomputation so **only one request hits the DB** per key.

```go
import "golang.org/x/sync/singleflight"

var sf singleflight.Group

func fetchInventory(id string) (int, error) {
    v, err, _ := sf.Do(id, func() (any, error) {
        stock, err := queryDB(id)
        if err != nil { return nil, err }
        cache.Set("inventory:"+id, stock, 5*time.Second)
        return stock, nil
    })
    return v.(int), err
}
```

**Flow:**
1. First request acquires key-level lock, queries DB, writes to cache, releases lock
2. Subsequent requests block on lock, then read fresh cache value — **zero DB hits**

**Caveat:** Under 1M req/s, blocking N-1 goroutines ties up resources. In-process locking serializes throughput to one goroutine per key. **Solution: multi-tier cache.**

---

### Strategy 2: Multi-Tier Cache (L1 + L2)

Place a fast in-process L1 cache ahead of shared L2 (Redis). L1 absorbs the initial microburst.

```
Request → L1 (sync.Map, TTL 1s) → L2 (Redis, TTL 5s) → DB
```

| Layer | Latency | TTL | Capacity | Role |
|-------|---------|-----|----------|------|
| L1 (sync.Map) | < 1μs | 1s | ~100KB/process | Absorb microburst, deduplicate within process |
| L2 (Redis) | ~1ms | 5s | ~10MB total | Survive process restarts, shared across fleet |
| DB | ~5ms | — | — | Source of truth for non-sale data |

**Effect:** 1M req/s → 100K req/process → L1 deduplicates to ~1 actual L2 lookup per process. Combined with singleflight at L2→DB, **1M req/s translates to single-digit DB queries**.

```go
type Cache struct {
    l1 *sync.Map // key -> {value, expiry}
    l2 *redis.Client
}

func (c *Cache) Get(key string) (any, error) {
    // L1 hit
    if v, ok := c.l1.Load(key); ok {
        return v, nil
    }
    // L1 miss — singleflight serializes L2/DB access per key
    v, err, _ := sf.Do(key, func() (any, error) {
        val, err := c.l2.Get(key).Result()
        if err == redis.Nil {
            val, err = queryDB(key) // cold start
        }
        if err == nil {
            c.l1.Store(key, val) // repopulate L1
        }
        return val, err
    })
    return v, err
}
```

---

### Strategy 3: Pre-Warming

For scheduled events, populate caches **before** traffic arrives.

```
Timeline:
T-120s : Background job → warm L2 with short TTL (10s)
T-30s  : Background job → refresh L1 + L2 with real TTL (5s)
T=0    : Flash sale starts → ALL requests hit L1 (zero misses)
T+X    : Probabilistic early expiry keeps cycle self-sustaining
```

- At T=0, every request hits L1 (primed). L1 serves in <1μs. **Zero L2 lookups, zero DB queries.**
- L1 TTL expires (~1s later) → first miss goes to L2 (still hot from pre-warm) → L1 repopulated.
- L2 TTL approaches expiry (~5s) → probabilistic refresh triggers before actual expiry. No miss storm.

**Failure recovery:** If warm jobs crash, first real request hits L1 miss → L2 miss → singleflight serializes **one** DB query. One ~100ms spike, then cache is hot.

---

### Strategy 4: Probabilistic Early Expiration (Stay-Ahead)

Refresh the cache **before** TTL expires so stale-but-valid value is never evicted.

```go
func shouldRefresh(ttl, remaining time.Duration) bool {
    // Probability grows linearly from 0 (just refreshed) to 1 (at expiry)
    return rand.Float64() < float64(ttl-remaining)/float64(ttl)
}
```

- Each request rolls a random check; "winner" refreshes early while cache serves stale data to others.
- **Zero miss storms. Flat latency.**
- **Caveat:** Works for weakly-consistent data (product details). For inventory where every read must show latest count, read directly from Redis counter (source of truth).

---

## Deep Dive — Write Path (Async Inventory Reservation)

### Why Not Synchronous DB Write?

> **Classic trap:** The synchronous `UPDATE inventory SET stock_count = stock_count - 1 WHERE product_id = $1` acquires a row-level exclusive lock on that single product row. PostgreSQL serializes to **~1,000–2,000 TPS per row**. With 20K+ concurrent writers on the hot sneaker, **18K+ connections queue on the lock**, hit `statement_timeout`, retry, and cascade. The DB connection pool exhausts instantly — even if the read path is perfectly shielded.

### The Senior Pivot: Shield the DB from the Write Path

Move inventory to Redis. Use a Lua script for atomic reservation. Queue the order. Batch-write to DB asynchronously.

```
┌─────────────┐     ┌──────────────────────┐     ┌──────────────┐     ┌──────────────┐
│  Client     │────►│  App Server           │────►│  Redis (Lua) │     │  Message     │
│  POST /order│     │  (validates request)  │     │  ATOMIC:     │────►│  Queue       │
└─────────────┘     └──────────────────────┘     │  if stock > 0 │     │  (Kafka/SQS) │
                         │   ~15ms               │    decr stock │     └──────┬───────┘
                         │                       └──────────────┘            │
                         ▼                                                    ▼
                  202 Accepted                                          ┌──────────────┐
                  { order_id, status: "reserved" }                      │  DB Worker   │
                                                                        │  Pool (10–20)│
                                                                        │  ──────────  │
                                                                        │  Batch INSERT│
                                                                        │  to PostgreSQL│
                                                                        └──────────────┘
```

### Redis Lua Script (Atomic Reserve)

```lua
-- KEYS[1] = inventory:{product_id}
-- ARGV[1] = quantity
local stock = tonumber(redis.call('GET', KEYS[1]))
if not stock then
    return -2  -- product not found
end
if stock < tonumber(ARGV[1]) then
    return -1  -- out of stock
end
redis.call('DECRBY', KEYS[1], ARGV[1])
return stock - tonumber(ARGV[1])  -- return remaining stock
```

```go
func reserveInventory(productID int64, qty int) (int, error) {
    script := redis.NewScript(`
        local stock = tonumber(redis.call('GET', KEYS[1]))
        if not stock then return -2 end
        if stock < tonumber(ARGV[1]) then return -1 end
        redis.call('DECRBY', KEYS[1], ARGV[1])
        return stock - tonumber(ARGV[1])
    `)
    
    result, err := script.Run(ctx, redisClient, []string{fmt.Sprintf("inventory:%d", productID)}, qty).Int()
    if err != nil { return 0, err }
    if result < 0 {
        if result == -1 { return 0, ErrOutOfStock }
        return 0, ErrProductNotFound
    }
    return result, nil
}
```

### Full Write Path Flow

```go
func placeOrder(userID, productID int64, qty int) (Order, error) {
    // 1. Atomic reservation in Redis (sub-ms)
    remaining, err := reserveInventory(productID, qty)
    if err != nil { return Order{}, err }

    // 2. Create order record with "reserved" status
    orderID := snowflake.NextID()
    order := Order{
        ID:        orderID,
        UserID:    userID,
        ProductID: productID,
        Qty:       qty,
        Status:    "reserved",
        Remaining: remaining,
    }

    // 3. Push to message queue (async, fire-and-forget)
    payload, _ := json.Marshal(order)
    if err := kafkaProducer.Publish("orders", productID, payload); err != nil {
        // Compensating action: restore inventory in Redis
        redisClient.IncrBy(ctx, fmt.Sprintf("inventory:%d", productID), qty)
        return Order{}, err
    }

    // 4. Return immediately (~20ms total)
    return order, nil
}
```

### Background Worker (DB Persistence)

```go
func orderWorker(consumer *kafka.Consumer, db *sql.DB) {
    for {
        msg, err := consumer.ReadMessage(ctx)
        if err != nil { continue }
        
        var order Order
        json.Unmarshal(msg.Value, &order)

        // Batch insert: collect 100 orders or wait 10ms
        batch = append(batch, order)
        if len(batch) >= 100 || time.Since(batchStart) > 10*time.Millisecond {
            tx, _ := db.Begin()
            for _, o := range batch {
                tx.Exec(`
                    INSERT INTO orders (order_id, user_id, product_id, quantity, status)
                    VALUES ($1, $2, $3, $4, 'confirmed')
                `, o.ID, o.UserID, o.ProductID, o.Qty)
            }
            tx.Commit()
            batch = nil
        }
    }
}
```

### Read-After-Write Consistency

| Scenario | Behavior |
|----------|----------|
| **GET /products/{id} after successful reservation** | Reads `stock_count` directly from Redis counter (source of truth) — reflects the decrement immediately |
| **GET /orders/{id}** | Returns `reserved` until worker confirms; client polls or uses WebSocket |
| **Worker crashes before DB write** | Order stays `reserved`; reconciliation job scans `reserved` orders older than 5min and re-queues |
| **Redis crashes mid-sale** | AOF persistence + replica failover (<1s). Inventory state recovered from AOF. |

### Why This Works

| Metric | Synchronous DB | Redis Lua + Queue |
|--------|----------------|-------------------|
| Peak write throughput (1 hot key) | ~2K/s (lock contention) | **100K+/s** (single-threaded Redis, no locks) |
| P99 write latency | >500ms (queueing) | **~20ms** |
| DB connection pool usage | Exhausted at 20K concurrent | **10–20 connections** (batch workers) |
| Durability | Immediate | Eventual (ms–s), reconciled |

---

## Resilience & Fail-Safes

| Failure Mode | Mitigation |
|--------------|------------|
| **Lock holder crashes / DB slow** | N/A — no DB lock in hot path |
| **Too many waiters on single key** | Redis Lua executes atomically; no waiters. Key-level capacity limit (e.g., 64) on L1 miss. |
| **DB connection pool exhausted** | Workers use tiny pool (10–20); queue absorbs burst. Circuit breaker on worker → pause consumption, not serving path. |
| **Redis (L2) unreachable** | Serve from L1 only (product details). **Inventory reads fail fast** — show "temporarily unavailable" rather than stale count. |
| **Kafka/SQS backlog** | Consumer lag alerting; scale workers horizontally (partition by product_id). |
| **Worker crashes before DB write** | Idempotent order_id (snowflake). Reconciliation job re-queues `reserved` orders >5min. |
| **L1 memory pressure** | LRU eviction; TTL cleanup. 10K hot keys × 50 processes = ~5MB — negligible. |
| **Process restart** | L2 survives; L1 repopulates from L2 on first request. |

---

## Alternative Approaches

### Single-Key Partitioning (When Redis Becomes Bottleneck)

If 1M req/s on one key exceeds Redis single-threaded capacity (~100–200K ops/s per shard):

```
inventory:42:shard-0
inventory:42:shard-1
...
inventory:42:shard-63
```

- **Writes:** increment random shard (or all shards for strong consistency)
- **Reads:** sum all shards at query time

| Aspect | Trade-off |
|--------|-----------|
| Pros | Scales read throughput arbitrarily |
| Cons | Stale reads (if not write-all); complex invalidation; write amplification; overselling risk for decrementing counter |

**Recommendation:** Use multi-tier + coalescing first. Partition only if Redis CPU saturates.

---

## Strategy Decision Matrix

| Strategy | Latency | DB Load | Complexity | Best For |
|----------|---------|---------|------------|----------|
| Request coalescing (singleflight) | +blocking | Low | Low | Moderate concurrency (<100K req/s) |
| Probabilistic early expiry | Low | Low | Medium | Weakly-consistent data, unpredictable traffic |
| Pre-warming + multi-tier cache | Low | None | High | **Scheduled events with known hot keys** |
| Single-key partitioning | Low | Varies | Very high | Extreme scale where Redis is bottleneck |
| **Redis Lua + async queue (write path)** | **~20ms** | **None** | **Medium** | **Flash sale write path — eliminates row-lock contention** |

**Production recommendation for flash sale:**
> **Pre-warming + Multi-tier cache + Request coalescing** for the read path. **Redis Lua atomic reserve + Kafka queue + batch DB workers** for the write path. Add **probabilistic early expiry** for self-sustaining refresh after the initial window. Avoid partitioning unless Redis itself is the bottleneck.

---

## Summary

| Requirement | How It's Met |
|-------------|--------------|
| **P99 ≤ 200ms (read)** | L1 cache serves in <1μs; L2 in ~1ms; singleflight prevents DB queueing |
| **P99 ≤ 100ms (write)** | Redis Lua executes in <1ms; queue publish ~5ms; total ~20ms |
| **DB never crashes** | Read path: single-digit DB queries. Write path: 10–20 worker connections, batch inserts. |
| **Read-after-write inventory consistency** | Redis counter is source of truth; `GET /products` reads directly from it |
| **No single point of failure** | L1→L2→Redis cluster→Kafka→workers; each tier horizontally scalable |
| **100ms staleness tolerance** | Product details via stay-ahead; inventory always fresh via Redis counter |

### Goroutine Pool Sizing

| Path | Workers | Rationale |
|------|---------|-----------|
| L1 lookup | 0 (non-blocking) | sync.Map read is lock-free |
| L2 → DB (singleflight) | 10–20 per process | Serializes per key; tiny pool suffices |
| Kafka consumer (DB workers) | 10–20 total | Batch inserts; partitioned by product_id |
| Total (50 processes) | ~1,000 goroutines | Well within Go runtime limits |

### Redis Memory Budget

| Item | Size |
|------|------|
| 10K product keys (metadata + stock counter) | ~500 KB |
| L1 overhead (50 processes × 100 KB) | ~5 MB |
| AOF buffer (write-heavy sale) | ~10–50 MB |
| **Total incremental** | **< 60 MB** |

---

## References

- [Vattani et al., *Techniques to Reduce Cache Stampedes*](https://couchbase.com/blog/cache-stampede-paper)
- `golang.org/x/sync/singleflight` — [Go Docs](https://pkg.go.dev/golang.org/x/sync/singleflight)
- *Probabilistic Early Expiration* — [AWS Architecture Blog](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
- *How to Approach a System Design Interview Question* — [System Design Primer](https://github.com/donnemartin/system-design-primer)
- *Redis Lua Scripting* — [Redis Docs](https://redis.io/docs/latest/develop/use/patterns/atomic-operations/)
- *Alibaba's Flash Sale Architecture* — [Architecture Paper](https://www.alibabacloud.com/blog/how-alibaba-handles-massive-traffic-during-singles-day_594843)