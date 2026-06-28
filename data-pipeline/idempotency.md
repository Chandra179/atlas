---
title: "Idempotency & State Machine"
aliases: []
tags: [architecture, data-pipeline, idempotency]
created: "2026-06-28"
---

## Problem

Message queues often deliver messages more than once (at-least-once delivery). Two workers can pull the same message simultaneously, leading to duplicate processing.

## Solution: Optimistic Locking with Version Tokens

Use a version integer alongside a state machine. Guarantees that even if a message is delivered twice, it is processed only once.

### Step 1: CDC Trigger & Queue Enqueue

A new record lands in the database. The `ingestion_status` row is initialized:

```json
{ raw_data_id: 101, status: 'PENDING', version: 1 }
```

The CDC event drops `{ raw_data_id: 101, version: 1 }` into the message queue.

### Step 2: Worker Claim (Optimistic Lock Check)

Before doing any heavy lifting, the worker attempts to claim the job atomically:

```sql
UPDATE ingestion_status
SET status = 'PROCESSING',
    version = version + 1
WHERE raw_data_id = 101
  AND version = 1;
```

- **Worker A** executes first. The database finds a match, updates `version` to 2, returns `Rows Affected: 1`. Worker A proceeds.
- **Worker B** executes a millisecond later. No row matches `version = 1` (it is now 2). Returns `Rows Affected: 0`. Worker B drops the task.

### Step 3: Final Status Update

Once processing succeeds, the worker marks completion:

```sql
UPDATE ingestion_status
SET status = 'COMPLETED',
    version = version + 1
WHERE raw_data_id = 101
  AND version = 2;
```

## Why This Works

- **Zero deadlocks**: single-row `UPDATE` executes in microseconds. No `SELECT ... FOR UPDATE`.
- **Idempotency guaranteed**: a stale re-delivered message 10 minutes later will find the version has moved on and be rejected.

## State Machine

```
PENDING ──► PROCESSING ──► COMPLETED
                │
                ▼
             FAILED ──► retry (optional DLQ)
```
