---
title: "Cache Stampede: Flash Sale Use Case"
aliases: []
tags: [system-design, system-design/caching]
created: "2026-06-13"
---

# Cache Stampede: Flash Sale Use Case

Also known as: **thundering herd problem**, **dog-piling**, **cache miss storm**.

This document explains how to prevent a cache stampede when a hot key expires under high concurrency. After reading, you should understand request coalescing, probabilistic early expiration, and pre-warming — and how to combine them for a flash-sale workload.

**Audience:** Backend engineers building high-traffic systems. Familiarity with cache read/write patterns assumed.

## Cache Miss Storm

When a hot cache key expires, all concurrent requests miss simultaneously and flood the database — causing contention, timeouts, and potentially cascading failure.

```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant C2 as Client 2..N
    participant Cache as Cache
    participant DB as Database
    Note over Cache: Hot key TTL expires
    C1->>Cache: GET /hot-key
    C2->>Cache: GET /hot-key
    Cache-->>C1: MISS
    Cache-->>C2: MISS
    C1->>DB: SELECT...
    C2->>DB: SELECT...
    Note over DB: 100k concurrent queries<br/>contention, timeouts<br/>cascading failure
```

## Mitigation Strategies

### Request Coalescing (Locking)

Request coalescing serializes recomputation so only one request hits the database:

```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant C2 as Client 2..N
    participant Cache as Cache
    participant DB as Database
    Note over Cache: Hot key TTL expires
    C1->>Cache: GET /hot-key
    C2->>Cache: GET /hot-key
    Cache-->>C1: MISS
    Cache-->>C2: MISS
    Note over C1: Acquires lock<br/>queries DB
    C1->>DB: SELECT...
    DB-->>C1: fresh data
    C1->>Cache: SET /hot-key
    Note over C1: Releases lock
    C2->>Cache: GET /hot-key
    Cache-->>C2: HIT
    Note over C2: Never hits DB
```

Let only one request recompute the cache value. All others wait on the result.

- A mutex (in-memory lock) guards cache recomputation for each key.
- The first request acquires the lock, queries the DB, and writes the fresh value to cache.
- Concurrent requests that fail to acquire the lock block until the lock is released, then read the freshly cached value — never hitting the DB.

```go
import "golang.org/x/sync/singleflight"

var sf singleflight.Group

func fetch(key string) (Value, error) {
    v, err, _ := sf.Do(key, func() (any, error) {
        val, err := queryDB(key)
        if err != nil {
            return nil, err
        }
        cache.Set(key, val, 5*time.Minute)
        return val, nil
    })
    return v.(Value), err
}
```

### Probabilistic Early Expiration (Stay-Ahead)

Instead of reacting to expiry, refresh the cache *before* the TTL runs out.

- As the TTL nears expiry, each request performs a random roll proportional to staleness: `rand() < (TTL - remaining_ttl) / TTL`. Probability starts at 0 after refresh and grows linearly to 1 at expiry.
- The "winner" refreshes the value early while the cache is still serving stale-but-valid data to everyone else.
- This eliminates cache miss storms entirely and keeps latency flat.

```go
func shouldRefresh(ttl, remaining time.Duration) bool {
    return rand.Float64() < float64(ttl-remaining)/float64(ttl)
}
```

### Multi-Tier Cache

Place a fast in-process L1 cache (e.g., `sync.Map` with TTL) ahead of shared L2 (Redis). L1 absorbs the micro-burst of concurrent misses before they reach L2, reducing 100k concurrent L2 misses to a handful per process. Each process still deduplicates at the goroutine level with request coalescing, making the system resilient to both L1 evictions and L2 failures.

### Pre-Warming Strategy

For scheduled high-traffic events (flash sales, live streams), populate the cache *before* the expected rush.

```mermaid
timeline
    title Flash Sale Pre-Warming
    T-120s : First warm pass : Populate cache with short TTL
    T-30s : Second warm pass : Refresh with real TTL
    T=0 : Flash sale starts : All cache hits
    T+X : Probabilistic refresh : Self-sustaining
```

- A background job warms the key 30–120 seconds early with a short TTL.
- A second pass just before the event refreshes with the real TTL.
- This turns the initial burst of cache misses into cache hits, buying time for the coalescing layer to stabilize.
- Works best combined with probabilistic early expiry — even if the warm window is missed, the first real request refreshes early before expiry.

### Resilience & Fail-Safe

- **Lock timeouts**: If the lock holder crashes or the DB is slow, release the lock after a timeout (e.g., 500 ms) so others can retry.
- **Key-level capacity limit**: Limit waiters per key (e.g., 64). When the queue is full, return the stale cached value with an `Age` header rather than blocking. This prevents OOM (out of memory) and gives the consumer visibility into freshness.

## References

> **Reference**: [Vattani et al., *Techniques to Reduce Cache Stampedes*](https://couchbase.com/blog/cache-stampede-paper)
