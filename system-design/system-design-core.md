---
title: "System Design Core"
description: "The core system-design checklist: requirements scoping, capacity estimation, consistency models, caching, fan-out, and the fundamentals every design exercise builds on."
tags: [system-design]
created: 2026-09-05
---
# System Design Core
## Fundamentals

- **Requirements gathering / scoping**
- **Capacity estimation (RPS, storage, bandwidth, peak RPS)**
- **Consistency models (strong vs eventual, and applicability)**
- **Atomic operations vs locks (mutex)**
- **Fan-out (push vs pull, pub/sub) event**
- **Caching**
	- cold, warm cache
	- eviction
	- read / write sync async
- **Queues + asynchronous workers**
- **Reservation / hold pattern + TTL expiry, Backpressure race**
- **Idempotency in message processing**
    - **At-least-once delivery
    - Exactly once delivery
- **Fail-open vs fail-closed (rate limiter)** 
- **Tradeoffs CAP theorem**
- **SQL vs NoSQL decisions**
- **Saga pattern / compensating actions**
- **Transactional Outbox pattern**
- **Change Data Capture (CDC)**
- **Database partitioning / sharding (hash-based)**
- **Hot-partition / hot-key mitigation**
- **Cost-driven architecture decisions**
- **Autoscaling signal selection (queue lag vs CPU)**
- **Schema evolution / contract enforcement**
- **Security considerations (SSRF, TOCTOU, DNS rebinding)**
- **Dead Letter Queues (DLQ) / poison pill handling**
- **Staged escalation / grace-period design**
    - Reconciliation (soft-fail → hard-fail progression)
- **Source-of-truth arbitration (multi async sources)**

## Still Not Covered

- **Geospatial / proximity matching**
    - Why it matters:
        - Requires a different algorithmic toolkit (e.g., geohash, quadtree)
    - Where you'd hit it:
        - Ride-sharing
        - Delivery systems
- **Real-time bidirectional communication (WebSockets, pub/sub, long-polling)**
    - Why it matters:
        - Enables pushing live updates to connected clients
    - Where you'd hit it:
        - Chat applications
        - Live notifications
        - Live sports scores
- **Search / ranking / autocomplete**
    - Why it matters:
        - Involves inverted indexes, tries, and relevance scoring
    - Where you'd hit it:
        - Search engines
        - Autocomplete systems
        - Personalized feeds ("For You")
- **Two-sided matching under contention**
    - Why it matters:
        - Different contention model vs one-sided or merge-based systems
    - Where you'd hit it:
        - Ride-sharing dispatch (rider ↔ driver matching)
- **Multi-region / geo-distributed design**
    - Why it matters:
        - Required for global scalability, latency optimization, and fault tolerance
    - Where you'd hit it:
        - Any system scaling beyond a single region
- **Long-running multi-day workflow orchestration**
    - Why it matters:
        - Requires durable, multi-stage coordination across extended timeframes
    - Where you'd hit it:
        - Order fulfillment / shipping pipelines
        - Video encoding workflows
- **CDN edge delivery**
    - Why it matters:
        - Critical for low-latency content distribution at scale
    - Where you'd hit it:
        - Video streaming platforms
        - Image hosting services
- **Explicit CAP theorem articulation**
    - Why it matters:
        - Needed to formally justify tradeoffs between consistency, availability, and partition tolerance
    - Where you'd hit it:
        - Any distributed system deep-dive or technical interview scenario