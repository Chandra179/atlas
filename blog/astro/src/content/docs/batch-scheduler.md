---
title: "Batch Scheduler"
aliases: [distributed-task-scheduler, batch-job-processor]
tags: [system-design, system-design/scheduler]
created: "2026-06-13"
modified: "2026-07-13"
---

# Batch Scheduler: System Design

> A distributed batch scheduler runs background tasks at scale: sending emails, processing payments, generating reports, expiring subscriptions. At 50M tasks/day across 200 tenants with a 10K task/s overnight peak, naive polling (`WHERE scheduled_at <= NOW()`) collapses—concurrent schedulers hammer the database, tasks execute twice, high-priority floods starve low-priority work, and crashed workers leave tasks stuck forever. This design guarantees exactly-once claim, crash recovery, fair priority queuing, and tenant isolation using PostgreSQL `FOR UPDATE SKIP LOCKED`, a message broker, and optimistic locking.

---

## Requirements

### Functional Requirements

| ID | Requirement |
|----|-------------|
| FR1 | Producers enqueue tasks with type, payload, scheduled time, priority, max retries |
| FR2 | Schedulers claim pending tasks exactly once and dispatch to message broker |
| FR3 | Workers execute tasks, report success/failure, and acknowledge |
| FR4 | Failed tasks requeue with exponential backoff up to max retries |
| FR5 | Dead-letter queue captures tasks exceeding max retries |
| FR6 | Per-tenant isolation: one tenant's load cannot starve others |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1 | Scheduling precision | ≤ 5 seconds of `scheduled_at` |
| NFR2 | Claim throughput | 10,000 tasks/second peak |
| NFR3 | Exactly-once claim | Zero double-execution from scheduler |
| NFR4 | Crash recovery | Stuck `IN_PROGRESS` tasks recovered ≤ 30 seconds |
| NFR5 | Priority fairness | Low-priority tasks always make progress |
| NFR6 | Tenant isolation | No single tenant monopolizes workers |
| NFR7 | Storage | ~1 TB/year hot; 20 TB total with archive |

---

## Estimation

### Traffic Model

| Dimension | Value |
|-----------|-------|
| Tasks enqueued per day | 50M (mixed: payments, reports, emails, exports, expiry) |
| Peak dispatch rate | 10,000 tasks/second (overnight batch: 2:00–4:00 AM) |
| Tenants | 200, with per-tenant isolation |
| Avg task metadata | ~1 KB |
| Scheduling precision | Within 5 seconds acceptable |
| Task duration | 100ms–30 minutes (heterogeneous workers) |

### QPS Calculation

```
Average daily QPS = 50M / 86,400s ≈ 580 tasks/s
Peak dispatch QPS = 10,000 tasks/s (overnight window)
Broker publish QPS = 10,000 tasks/s (same as dispatch)
Worker execution QPS = 10,000 tasks/s (at peak concurrency)
```

### Storage

| Data | Size |
|------|------|
| Tasks table (90 days hot) | 50M/day × 90 × 1KB ≈ 4.5 TB |
| Processed tasks (30 days dedup) | 50M/day × 30 × 64B ≈ 96 GB |
| Indexes + overhead (est. 40%) | ~2 TB |
| **Hot storage (PostgreSQL)** | **~7 TB** |
| Cold archive (S3 / pg_tier) | 50M/day × 275 × 1KB ≈ 13.7 TB |
| **Total** | **~20 TB** |

### Connection Pool

| Pool | Connections | Notes |
|------|-------------|-------|
| Scheduler → PostgreSQL (pgbouncer) | 100 | 15 nodes × ~7 conn each |
| Workers → PostgreSQL (pgbouncer) | 200 | Batch status updates |
| Workers → Broker | 1,000 | Prefetch=10 × 100 workers |

---

## High-Level Design

```
┌──────────────┐     ┌──────────────────────┐     ┌────────────────┐     ┌─────────────┐     ┌─────────────┐
│  Producers   │────►│  Scheduler Cluster   │────►│  PostgreSQL    │     │   Broker    │────►│  Workers    │
│  (API/Svcs)  │     │  (poll + claim +     │     │  (partitioned  │     │  (priority  │     │  (idempotent│
└──────────────┘     │   dispatch)          │     │   tasks +      │     │   queues +  │     │   execution)│
                     └──────────────────────┘     │   leader elect)│     │   DLQ)      │     └─────────────┘
                            │                     └────────────────┘     └──────┬──────┘
                            │                                                  │
                            ▼                                                  ▼
                     ┌──────────────┐                                ┌─────────────────┐
                     │  Monitoring  │                                │  Reconciliation │
                     │  & Alerting  │                                │  (cleanup job)  │
                     └──────────────┘                                └─────────────────┘
```

### Components

| Component | Role | Scaling |
|-----------|------|---------|
| Producers | Enqueue tasks via HTTP/gRPC | Stateless, horizontal |
| Scheduler Cluster | Poll, claim, dispatch | 15 nodes; partition-assigned |
| PostgreSQL | Task storage, coordination, leader election | Range-partitioned by `scheduled_at`; hash `partition_key` for poll scaling |
| Broker (RabbitMQ/Kafka) | Priority queues, DLQ, retries | 3-node quorum cluster |
| Workers | Execute business logic | Per-tenant pools; horizontal |
| Reconciliation | Cleanup stuck tasks, archive partitions | Singleton leader |

---

## Database Schema

```sql
-- Core tasks table (range-partitioned by scheduled_at, hash-partitioned by partition_key)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING, IN_PROGRESS, COMPLETED, FAILED, DEAD_LETTERED
    priority INT NOT NULL DEFAULT 0,        -- Higher = more urgent
    scheduled_at TIMESTAMP NOT NULL,
    max_retries INT NOT NULL DEFAULT 3,
    retry_count INT NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,      -- Optimistic lock
    claimed_by VARCHAR(255),                -- Scheduler instance ID
    claimed_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    partition_key INT NOT NULL,             -- hash(task_id) % N
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (scheduled_at);

-- Monthly partitions (auto-managed by pg_partman)
CREATE TABLE tasks_2026_01 PARTITION OF tasks
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
-- pg_partman pre-creates next 3 months, archives >90 days

-- Composite index for efficient polling (partial: only PENDING)
CREATE INDEX idx_tasks_poll ON tasks (status, scheduled_at, priority DESC)
    WHERE status = 'PENDING';

-- Partition-aware poll index
CREATE INDEX idx_tasks_partition ON tasks (partition_key, status, scheduled_at)
    WHERE status = 'PENDING';

-- Deduplication table for worker idempotency
CREATE TABLE processed_tasks (
    task_id UUID PRIMARY KEY,
    worker_id VARCHAR(255),
    processed_at TIMESTAMP DEFAULT NOW(),
    ttl TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

-- Leader election for singleton operations
CREATE TABLE leader_election (
    role VARCHAR(100) PRIMARY KEY,          -- e.g., 'cleanup_leader'
    instance_id VARCHAR(255) NOT NULL,
    acquired_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);
```

### Versioning & Optimistic Locking

Every task row includes a `version` column (BIGINT, starts at 0). All claim operations use:

```sql
UPDATE tasks
SET status = 'IN_PROGRESS', version = version + 1,
    claimed_by = ?, claimed_at = NOW()
WHERE id = ? AND version = ? AND status = 'PENDING';
```

If `version` changed between read and update (another scheduler claimed it), zero rows affected — the update is a no-op, and the scheduler moves on. This is defense-in-depth alongside `FOR UPDATE SKIP LOCKED`.

### Advisory Locks (Leader Election)

For singleton operations (cleanup, partition maintenance), use PostgreSQL advisory locks:

```sql
-- Acquire cleanup leader lease
INSERT INTO leader_election (role, instance_id, expires_at)
VALUES ('cleanup_leader', ?, NOW() + INTERVAL '30 seconds')
ON CONFLICT (role) DO UPDATE
SET instance_id = ?, acquired_at = NOW(), expires_at = NOW() + INTERVAL '30 seconds'
WHERE leader_election.expires_at < NOW();
```

Leader renews lease every 10s. If leader crashes, lease expires in 30s → new leader elected automatically.

---

## API Design

```protobuf
// Producer enqueues a task
POST /api/v1/tasks
Request:  { task_type, tenant_id, payload, scheduled_at, priority, max_retries }
Response: { task_id, status: "PENDING" }

// Query task status
GET /api/v1/tasks/{task_id}
Response: { task_id, task_type, tenant_id, status, scheduled_at, priority,
            retry_count, error_message, created_at, started_at, completed_at }

// Cancel a pending task (idempotent)
POST /api/v1/tasks/{task_id}/cancel
Response: { task_id, status: "CANCELLED" }

// Worker heartbeat (optional, for long-running tasks)
POST /api/v1/tasks/{task_id}/heartbeat
Request:  { worker_id, progress }
Response: { task_id, status }
```

---

## Deep Dive — Claim Loop

### Core Problem

Naive polling from N schedulers:

```sql
SELECT * FROM tasks WHERE status = 'PENDING' AND scheduled_at <= NOW() LIMIT 50;
-- All N nodes get same rows
UPDATE tasks SET status = 'IN_PROGRESS' WHERE id IN (...);
-- Most updates conflict → rollback → thundering herd
```

### Solution: `FOR UPDATE SKIP LOCKED` + Optimistic Locking

```go
func (s *Scheduler) pollAndClaim(ctx context.Context) error {
    // 1. Atomic poll + lock (skips rows locked by other schedulers)
    rows, err := s.db.QueryContext(ctx, `
        SELECT id, task_type, tenant_id, payload, priority, max_retries, version
        FROM tasks
        WHERE partition_key = ANY($1)
          AND status = 'PENDING' AND scheduled_at <= NOW()
        ORDER BY priority DESC, scheduled_at ASC
        LIMIT $2
        FOR UPDATE SKIP LOCKED
    `, pq.Array(s.partitions), s.batchSize)
    if err != nil { return fmt.Errorf("poll: %w", err) }
    defer rows.Close()

    for rows.Next() {
        var t Task
        if err := rows.Scan(&t.ID, &t.Type, &t.TenantID, &t.Payload, &t.Priority, &t.MaxRetries, &t.Version); err != nil {
            s.metrics.PollErrors.Inc()
            continue
        }

        // 2. Atomic claim with optimistic lock (defense-in-depth)
        result, err := s.db.ExecContext(ctx, `
            UPDATE tasks
            SET status = 'IN_PROGRESS', version = version + 1,
                claimed_by = $1, claimed_at = NOW()
            WHERE id = $2 AND version = $3 AND status = 'PENDING'
        `, s.instanceID, t.ID, t.Version)
        if err != nil { continue }

        n, _ := result.RowsAffected()
        if n == 0 {
            s.metrics.ClaimConflicts.Inc()  // Another scheduler got it
            continue
        }

        s.metrics.ClaimsSucceeded.Inc()
        if err := s.broker.Publish(ctx, t); err != nil {
            s.broker.Nack(ctx, t.ID)
        }
    }
    return rows.Err()
}
```

### Why This Works

| Mechanism | Guarantees |
|-----------|------------|
| `FOR UPDATE SKIP LOCKED` | Poll never blocks; each scheduler gets disjoint row set |
| Optimistic `version` check | Zero double-claim even if race slips through SKIP LOCKED |
| `partition_key` assignment | Linear horizontal scaling; zero cross-node contention |

### Partition-Based Polling (Scaling Beyond 50 Nodes)

- Each task assigned `partition_key = hash(task_id) % 64` on creation
- Each scheduler node owns a subset of partitions (static or dynamic)
- Poll query includes `WHERE partition_key IN (owned_partitions)`
- Nodes never touch same partitions → **zero lock contention** at any scale
- Dynamic reassignment on node failure via coordination table

---

## Deep Dive — Priority & Starvation Prevention

Tasks publish to broker with `priority` header. Broker routes to separate queues (high/medium/low). Without fairness, high-priority floods starve low-priority indefinitely.

### Prevention Mechanisms

| Mechanism | How It Works |
|-----------|--------------|
| **Weighted fair queuing** | Each priority queue gets minimum worker share. Even if high-priority overflows, 10% of workers reserved for low-priority. |
| **Aging** | Effective priority = `base_priority + floor(wait_time / aging_interval)`. A marketing email waiting 24h gets promoted to medium. Poll query sorts by effective priority. |
| **Per-tenant worker pools** | Dedicated low-priority workers never process high-priority. Low-priority always progresses (just slower). |
| **Priority inversion detection** | Monitor max wait time per priority. Alert if low-priority > 5min. |

### Per-Tenant Isolation

| Layer | Mechanism |
|-------|-----------|
| **Scheduler** | Partition assignment includes tenant affinity; one tenant's partitions never starve another's |
| **Broker** | Per-tenant queue depth limits; tenant exceeding quota gets publish rejection (HTTP 429) |
| **Workers** | Separate consumer pools per tenant; noisy tenant only affects their own pool |

---

## Deep Dive — Resilience

### Visibility Timeout & Cleanup Leader

```
Scheduler crashes after claim (status=IN_PROGRESS) but before broker publish
          │
          ▼
Task stuck IN_PROGRESS
          │
          ▼
Cleanup leader (singleton, elected via advisory lock) runs every 30s:
  SELECT * FROM tasks
  WHERE status = 'IN_PROGRESS'
    AND claimed_at < NOW() - INTERVAL '5 minutes'
  FOR UPDATE SKIP LOCKED;
  UPDATE ... SET status = 'PENDING', claimed_by = NULL, claimed_at = NULL
  WHERE id = ? AND version = ? AND status = 'IN_PROGRESS';
```

- Uses optimistic `version` to avoid racing with legitimate completion
- Only elected leader runs cleanup → no duplicate resets
- Max recovery window: 5min (visibility timeout) + 30s (poll interval) = **5.5 minutes**

### Graceful Shutdown (SIGTERM)

1. Stop polling immediately
2. Drain dispatch buffer: send claimed-but-undispatched tasks to broker (deadline: 10s)
3. Release remaining undispatched tasks back to `PENDING` via atomic update
4. Release advisory locks
5. Close DB connections and broker channels cleanly

### Failure Modes

| Failure | Probability | Impact | Mitigation |
|---------|-------------|--------|------------|
| Scheduler crashes mid-claim | Low–Med | Tasks stuck IN_PROGRESS ≤5.5min | Visibility timeout + singleton cleanup |
| Worker crashes before ACK | Med | Task redelivered | Idempotency key in `processed_tasks` prevents double-execution |
| PostgreSQL primary fails | Low | Scheduler stalls | Patroni failover + pgbouncer; <5s failover |
| Broker node failure | Low | No dispatch until recovery | Quorum queues (RabbitMQ 3.8+) across 3 nodes |
| Partition hotspot | Med | Some nodes overloaded | Monitor per-partition task count; trigger rebalance |
| DB connection pool exhaustion | Low–Med | Poll loop stalls | pgbouncer pooling; alert on connection wait time |
| Redis data loss (if used) | Low | Orphaned tasks in PostgreSQL | PostgreSQL is source of truth; cleanup recovers |

---

## Alternative Approaches

### 1. Redis Sorted Sets (Sub-ms Claim Latency)

```redis
# On task creation
ZADD tasks:pending <scheduled_at_timestamp> <task_id>

# Scheduler claims (atomic)
ZPOPMIN tasks:pending 1
```

| Pros | Cons |
|------|------|
| Sub-millisecond claim latency | Redis must have AOF (`appendfsync everysec`) + replicas |
| No database poll contention | Redis data loss → orphaned tasks in PostgreSQL (recovered by cleanup) |
| Natural ordering by score | Additional infrastructure to operate |

### 2. ZooKeeper (Strong Consistency Without DB Load)

- Tasks = ephemeral sequential znodes under `/tasks/pending/`
- Schedulers watch children; lowest sequence claims
- Leader election built-in

| Pros | Cons |
|------|------|
| CP coordination without database | ZooKeeper ensemble operational complexity |
| Sub-ms claim, no poll contention | Session timeouts can cause false leader failover |
| Natural fit for leader election | Overkill if you already run PostgreSQL |

### 3. Single Shared Poll Queue (Rejected)

- One `poll_queue` table; schedulers `DELETE ... RETURNING` with `FOR UPDATE SKIP LOCKED`
- Contention at 50+ nodes makes throughput collapse

| Decision Matrix | PostgreSQL SKIP LOCKED | Redis Sorted Sets | ZooKeeper |
|-----------------|------------------------|-------------------|-----------|
| **Latency** | ~1–5ms | **<1ms** | <1ms |
| **Operational complexity** | **Low** (already have PG) | Medium | High |
| **Data loss risk** | None (PG is source of truth) | Low (with AOF) | None |
| **Scale ceiling** | 50+ nodes (with partitioning) | 100+ nodes | 100+ nodes |
| **When to choose** | **Default (95% of cases)** | Sub-ms required + Redis already run | Need CP without DB |

---

## Strategy Decision Matrix

| Decision | Chosen | Rejected Alternative | Why |
|----------|--------|---------------------|-----|
| Scheduler–Broker–Worker decoupling | **Async via broker** | Direct synchronous invocation | Durability, backpressure, priority queues, independent retries |
| Claim coordination | **PG `FOR UPDATE SKIP LOCKED` + version** | Pure ZooKeeper / Pure Redis | No extra infrastructure; SKIP LOCKED is purpose-built |
| Time partitioning | **Monthly range partitions (pg_partman)** | Hash partitioning at DB level | Poll queries hit recent partitions; auto-archive old |
| Poll scaling | **Hash `partition_key` per scheduler** | Single shared poll queue | Linear horizontal scaling; zero cross-node contention |
| Crash recovery | **Visibility timeout + singleton cleanup** | Per-task heartbeats | No N× heartbeat traffic; no false positives on network blips |
| Execution semantics | **At-least-once dispatch; exactly-once via worker idempotency** | Exactly-once in scheduler | Exactly-once requires 2PC across worker+scheduler (impossible) |
| Priority fairness | **Weighted fair queuing + aging + per-tenant pools** | Strict priority / Pure FIFO | Prevents starvation; supports tenant isolation |
| Partition management | **pg_partman (auto)** | Manual DDL scripts | Zero operator intervention; predictable retention |
| Coordination for singletons | **PG advisory locks + lease table** | ZooKeeper / etcd | Reuses PG; no extra cluster |

---

## Summary

| Requirement | How It's Met |
|-------------|--------------|
| **≤5s scheduling precision** | Poll interval 200ms–2s with jitter; broker dispatch adds 1–5s jitter |
| **10K tasks/s peak claim** | Partitioned poll + SKIP LOCKED → linear scaling to 50+ nodes |
| **Exactly-once claim** | SKIP LOCKED (disjoint rows) + optimistic `version` (defense-in-depth) |
| **Crash recovery ≤30s** | Visibility timeout (5min) + singleton cleanup (30s poll) + optimistic version check |
| **Low-priority progress** | Weighted fair queuing (10% reserved) + aging promotion + per-tenant pools |
| **Tenant isolation** | Partition affinity + per-tenant broker limits + dedicated worker pools |

### Goroutine Pool Sizing

| Component | Goroutines | Rationale |
|-----------|------------|-----------|
| Scheduler poll (15 nodes × 20) | 300 | One per partition + dispatcher |
| Broker publish (async) | 50 | Buffered channel; backpressure on full |
| Worker execution (100 × 10) | 1,000 | Prefetch=10; one goroutine per in-flight task |
| Cleanup leader | 1 | Singleton |
| **Total** | **~1,350** | Well within Go runtime limits |

### Storage Budget

| Item | Size |
|------|------|
| Tasks table (90 days hot) | ~4.5 TB |
| Processed tasks (30 days dedup) | ~96 GB |
| Indexes + overhead | ~2 TB |
| Cold archive (S3/pg_tier) | ~13.7 TB |
| **Total** | **~20 TB** |

---

## References

- [Casper: Distributed Batch Scheduler](https://github.com/Chandra179/casper) — Reference implementation
- `FOR UPDATE SKIP LOCKED` — [PostgreSQL Docs](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SKIP-LOCKED)
- `pg_partman` — [Partition Management](https://pgpartman.readthedocs.io/)
- Weighted Fair Queuing — [RFC 8960](https://datatracker.ietf.org/doc/html/rfc8960)
- Alibaba's Task Scheduling Architecture — [Architecture Paper](https://www.alibabacloud.com/blog/how-alibaba-handles-massive-task-scheduling_594843)