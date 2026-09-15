---
title: System Design Core
description: >-
  A layered system design checklist for defining requirements, choosing basic
  building blocks, protecting correctness, coordinating work, scaling traffic,
  and handling failures.
tags:
  - system-design
created: 2026-09-05T00:00:00.000Z
modified: '2026-09-15'
---

# System Design Core

Use these levels in order. Each level answers a different design question. Each
topic appears once so the checklist stays clear during a design review or
interview.

## Level 0: Define the problem

Before choosing components, define the limits of the system.

- **Requirements and scope**: identify users, important flows, correctness
  needs, availability, latency, and what is out of scope.
- **Capacity estimate**: estimate average and peak requests per second, object
  size, storage growth, read and write volume, bandwidth, concurrent users, and
  retention time.
- **Cost limits**: identify which limit matters most: compute, memory, storage,
  bandwidth, operations, or third-party usage.

## Level 1: Compute, memory, storage, and network

These are the basic resources that every design places and connects.

| Resource | Role | Main tradeoff |
|---|---|---|
| **CPU and CPU cache** | Runs instructions and keeps frequently used data close to the core | Throughput versus power and heat |
| **Memory (RAM)** | Fast, temporary working state shared by processes | Capacity versus speed |
| **Storage (SSD or HDD)** | Keeps data after a process or machine stops | Durability and cost versus latency |
| **Network** | Moves data between processes and machines | Bandwidth versus latency |

## Level 2: State and correctness

Decide what must remain true when operations overlap, fail, or see different
versions of data.

- **Consistency**: choose strong, causal, or eventual consistency for each read
  path. Do not make every read strong by default.
- **Atomic changes and concurrency control**: use atomic operations, mutexes,
  database row locks, version checks, or another method to protect a critical
  section.
- **CAP tradeoff**: when a network partition occurs, make the choice between
  consistency and availability explicit for the affected operation.
- **Temporary state and recovery**: decide what may be lost from memory and how
  a node, database, or cache outage rebuilds state or falls back to durable
  storage.
- **Source of truth**: decide which system wins when multiple asynchronous
  systems report different values.

## Level 3: Data movement and work coordination

Choose how work moves through the system and how retries affect its result.

- **Synchronous and asynchronous work**: keep the user request small. Move slow
  or retryable work to queues and workers.
- **Push and pull fan-out**: push sends an update to each recipient. Pull lets
  each reader request updates when needed. Choose based on recipient count and
  delivery needs.
- **Delivery and safe retries**: at-least-once delivery may process a message
  more than once, so handlers must make repeated processing safe. An exactly-once
  result needs deduplication or transaction support.
- **Backpressure**: limit queues and concurrent work when producers are faster
  than consumers. Decide whether to delay, drop, or reject work.
- **Reservation or hold with expiry**: protect scarce inventory or capacity
  while handling expiry, cancellation, and races.
- **Transactional outbox**: save a state change and the event to publish in one
  local database transaction before sending the event.
- **Change Data Capture (CDC)**: create downstream events from committed data
  changes when the source database is authoritative.
- **Saga and compensating actions**: coordinate several local transactions when
  one global transaction is not available. Add an action that reverses each
  completed step when a later step fails.

## Level 4: Caching, distribution, and uneven load

Scale common paths while protecting the system from uneven traffic.

- **Cache lifecycle**: choose how reads and writes use the cache. Plan for
  empty caches, warmup, expiry, eviction, invalidation, and stale data.
- **Single-flight loading**: combine concurrent misses for the same key so one
  expensive load serves all waiting requests.
- **Routing and load distribution**: send requests across servers, databases,
  partitions, or regions using health, location, capacity, or a stable hash.
- **Partitioning and sharding**: choose a partition key and a rebalancing plan.
  Account for cross-partition queries, transactions, and data movement.
- **Hot key and hot partition handling**: copy, split, limit, or reshape access
  to a key or partition that receives much more traffic than others.
- **Celebrity problem**: treat a small number of extremely popular entities as
  a special caching and fan-out workload.
- **Autoscaling signals**: scale on queue delay, concurrent work, resource
  saturation, or latency that represents user pain, not CPU alone.

## Level 5: Failure handling, operations, and security

Define behavior when dependencies fail and when data or interfaces change.

- **Fail open or fail closed**: decide whether a dependency failure should
  favor availability or protection for each operation, such as rate limiting.
- **Dead-letter queues and poison messages**: isolate messages that keep
  failing, retain the reason, and provide a replay or repair path.
- **Staged escalation**: move from a soft failure to a hard failure through a
  grace period, reconciliation, or operator review.
- **Schema changes and contracts**: keep producers and consumers compatible
  during rolling deploys, backfills, and version changes.
- **Security boundaries**: check server-side request forgery, time-of-check and
  time-of-use races, DNS rebinding, untrusted input, and access permissions.

## Level 6: Specialized topics outside this core

These topics need separate algorithms or design concerns. They are not repeated
in the core checklist.

- **Geospatial and proximity matching**: geohash, quadtree, and spatial indexes
  for ride-sharing and delivery.
- **Real-time two-way communication**: WebSockets, pub/sub, and long polling
  for chat, live notifications, and live scores.
- **Search, ranking, and autocomplete**: inverted indexes, tries, relevance,
  and personalized retrieval.
- **Two-sided matching under contention**: dispatch and reservation when both
  sides compete for the same changing supply.
- **Multi-region systems**: placement, replication, failover, data residency,
  and cross-region latency.
- **Long-running workflow orchestration**: durable multi-stage coordination
  across hours or days, such as fulfillment or video processing.
- **CDN and edge delivery**: cache placement and invalidation for large-scale
  video, images, and static content.
