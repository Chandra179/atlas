---
title: "Infrastructure & Scaling"
aliases: []
tags: [architecture, data-pipeline, infrastructure, scaling]
created: "2026-06-28"
---

This document covers infrastructure patterns that let the pipeline scale to billions of rows — semantic caching, hot-state offload, partitioning, and lockless queue design. Use it to plan capacity and avoid the common bottlenecks at scale.

## Semantic Caching

Standard exact-string caching rarely works for AI — users phrase the same question a dozen different ways. Semantic caching solves this:

1. Generate an embedding for the incoming query.
2. Check a cache database (RedisVL, GPTCache) for a previous query with ≥95% cosine similarity.
3. On hit: serve the cached answer (drops latency from seconds to milliseconds, saves LLM token costs).
4. On miss: run the full pipeline and populate the cache.

**Guardrail**: define a strict distance threshold so the cache doesn't serve answers from unrelated topics.

## Scale: Billions of Rows

At billions of records, a single relational table tracking ingestion status causes two bottlenecks:

### RAM Bottleneck (Buffer Pool Eviction)

Indexes explode to hundreds of GB. When the index exceeds RAM, the database constantly swaps index pages from disk to memory (page thrashing), pegging RAM at 100%.

### CPU Bottleneck (Write Amplification)

Every status update (`PENDING → PROCESSING → COMPLETED`) writes to transaction logs, data pages, and indexes. Billions of operations pin CPU at 100%.

### Pattern 1: Hot State Offload to In-Memory Store

Move transient, high-velocity ingestion states out of the primary RDBMS into a distributed in-memory store (Redis, or a scalable NoSQL like DynamoDB/Cassandra/ScyllaDB).

- Active state lifecycle (`PENDING`, `PROCESSING`) lives in Redis via `SETNX` with TTL.
- Redis handles hundreds of thousands of ops/sec at sub-millisecond speeds.
- Once `COMPLETED`, write a single final batch status back to the primary DB (or let the cache expire).

### Pattern 2: Horizontal Table Partitioning

If the ingestion status must stay in SQL, use hash partitioning on `raw_data_id` (e.g., 64 or 128 partitions).

- Each `UPDATE` routes to a single small partition.
- That partition's index fits in RAM — no page thrashing.

### Pattern 3: Guaranteed Queue Partitioning (Lockless Consumer)

The best solution: design so workers never fight over the same row.

- Use a partitioned queue (Kafka, Kinesis). Route each `raw_data_id` to a specific partition.
- Assign exactly one worker thread per partition.
- The queue guarantees mutual exclusion — no database locking needed at all.

### Pattern Comparison

| Pattern | When to use | Trade-off |
|---------|-------------|-----------|
| Hot State Offload | High write velocity, transient states only | Eventual consistency on status; Redis adds operational complexity and persistence risk |
| Horizontal Partitioning | Must keep status in SQL, can't add Redis | Fixed partition count; repartitioning requires data migration |
| Lockless Queue Partitioning | Maximum throughput, already using Kafka | Tight coupling of queue partitioning to data model; partition count is fixed and must handle rebalancing |
