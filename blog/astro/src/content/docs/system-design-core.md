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

- Check if the operation is CPU/Processor or GPU (matrix, neural network, etc..) heavy
- Choose strategy for in-memory read, write, invalidation
- Analyze network latency inbound/outbound and bandwith
- When choosing a data structure or storage, check the internal architecture whether its suitable for our problems or not, i.e, for faster key value access data we can use (in-memory) redis store

---

- Clarrify the requirements and scope, also the effort it takes for development, whether its worth doing or no based on impact of the  output
- estimate average and peak requests per second, object size, storage growth, read and write volume, bandwidth, concurrent users, and retention time.
- identify which cost limit matters most: compute, memory, storage, bandwidth, operations, or third-party usage.

---

- strong, causal, or eventual consistency 
- use atomic operations, mutexes, database row locks, version checks, etc.. for critical operation
- CAP tradeoff
- Temporary state and recovery: decide what may be lost from memory and how a node, database, or cache outage rebuilds state or falls back to durable storage.
- Source of truth

---

- Push and pull event
- at-least-once vs. exactly-once delivery
- Backpressure: limit queues and concurrent work when producers are faster
than consumers. Decide whether to delay, drop, or reject work.
- Reservation or hold with expiry: protect scarce inventory
- Transactional outbox
- Change Data Capture (CDC)

---

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
