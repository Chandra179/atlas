---
title: "Flash Sale"
aliases: [cache-stampede, thundering-herd, dog-piling, cache-miss-storm]
tags: [system-design, system-design/caching]
created: "2026-06-13"
modified: "2026-07-16"
---

	# Flash Sale System

This document outlines a realistic, battle-tested system design for managing high-concurrency product drops (flash sales) without crashing infrastructure or overselling inventory.

---

## The Problem & Goals

### Problem
Consider a high-profile "hype drop" (e.g., a limited-edition sneaker release or a highly discounted electronics sale). 100,000+ users land on a single product page and click "Buy Now" at the exact same second. 
### Goals
* **Strict Business Accuracy:** Never oversell the item. If we have 1,000 units, exactly 1,000 orders must be created.
* **System Resilience:** Prevent cascading failures. Under extreme load, the API must remain responsive and fail gracefully.
* **Low Latency:** Keep checkout response times (p99) under **50ms** for the user's initial interaction.

---

## System Constraints

### Traffic & Performance Targets
* **Peak Write Load:** 100,000 concurrent write attempts per second targeting a *single* product ID.
* **Latency Target:** Initial checkout response (HTTP 202 Accepted) returned in **< 30ms** (p99).
* **Database Persist Latency:** Actual database writes must catch up within **10 seconds** post-drop.
### Resource Constraints
* **Application Layer:** 10 stateless container instances (each allocated 2 vCPU, 4GB RAM).
  * *Target CPU Usage:* Max 70% under peak load to leave head-room for network I/O.
  * *Target Memory:* Max 60% (2.4GB) to prevent Out-Of-Memory (OOM) process restarts.
* **Cache Layer (Redis):** A single 3-node Redis cluster (1 Master, 2 Read Replicas). 
  * *Target CPU Usage:* Max 80% on the Master node. Since Redis is single-threaded, a single node's CPU is a hard wall.
* **Database Layer:** A single PostgreSQL master instance (8 vCPU, 32GB RAM). 
  * *Target Connection Pool:* Capped at 100 persistent connections to protect system memory.

---

## High-Level Design (HLD) & Trade-offs

We evaluate two architectural patterns to solve the hot-spot problem.

### Design Option 1: Single-Key Redis Decr + Asynchronous DB Queue

This design offloads write serialization from the disk-backed SQL database to an in-memory Redis instance.

```mermaid
sequenceDiagram
    autonumber
    actor Client as User Client
    participant App as App Node (Go)
    participant Redis as Redis (Single Key)
    participant MQ as Kafka Queue
    participant Worker as DB Batch Worker
    participant DB as PostgreSQL

    Client->>App: 1. POST /checkout (Submit Order)
    App->>Redis: 2. Run Lua Script (Check & DECR key)
    Note over Redis: Atomic evaluation on single thread
    Redis-->>App: 3. Return Success (New Stock Count)
    App->>MQ: 4. Publish "OrderCreated" Event
    App-->>Client: 5. Return HTTP 202 (Accepted)
    MQ->>Worker: 6. Consume events in batches (e.g., 100 msgs)
    Worker->>DB: 7. Batch INSERT orders (ON CONFLICT DO NOTHING)
```

#### How it Works
1. **Atomic In-Memory Decr:** The application runs a Lua script in Redis. Because Redis runs commands on a single thread, the Lua script safely checks if stock is available and decrements it atomically in a single operation.
2. **Decoupled Writes:** If Redis succeeds, the user has "reserved" their item. The app posts a message to a Kafka queue, returns an immediate **HTTP 202 (Accepted)**, and lets the client UI poll for the final order confirmation.
3. **Database Batching:** Background workers consume from Kafka and write to PostgreSQL in optimized batches of 100+ records, avoiding single-row lock contention.

#### Trade-offs

| Pros | Cons |
| :--- | :--- |
| **Simple Implementation:** Relies on standard Redis and Lua features. Very easy to maintain. | **Single-Threaded CPU Wall:** Because all writes hit *one* key (`inventory:product_42`), they must run on *one* Redis node. This limits maximum throughput to ~30k-50k operations/second. |
| **Excellent Latency:** In-memory operations return in <2ms, keeping application threads highly responsive. | **Eventual Consistency Lag:** Users must wait on a loading screen while background workers finish inserting their orders into the SQL DB. |

---

### Design Option 2: Inventory Sharding (Bucketing)

This design solves the Redis single-thread bottleneck by distributing the inventory of the hot item across multiple keys.

```mermaid
graph TD
    Client[Client Request] --> App[App Node]
    App -->|Random Hash/Round-Robin| B1[Redis Bucket 1: stock = 200]
    App -->|Random Hash/Round-Robin| B2[Redis Bucket 2: stock = 200]
    App -->|Random Hash/Round-Robin| B3[Redis Bucket 3: stock = 200]
    
    B1 -->|Success| MQ[Kafka Message Queue]
    B2 -->|Success| MQ
    B3 -->|Success| MQ
    
    MQ --> Worker[DB Batch Worker]
    Worker --> DB[(PostgreSQL)]
    
    style B1 fill:#f9f,stroke:#333,stroke-width:2px
    style B2 fill:#f9f,stroke:#333,stroke-width:2px
    style B3 fill:#f9f,stroke:#333,stroke-width:2px
```

#### How it Works
1. **Sharded Keys:** If we have 1,000 items in stock, we split them into 5 buckets of 200 items each (`product_42:bucket_1` to `product_42:bucket_5`). 
2. **Cluster Distribution:** These buckets are hashed to different slots across the Redis cluster, utilizing multiple Redis nodes and CPU cores.
3. **Smart Routing:** The app randomly routes checkout requests to one of these buckets. If Bucket 1 is empty but Bucket 2 still has stock, a fallback mechanism routes the request to another bucket.

#### Trade-offs of Design Option 2

| Pros | Cons |
| :--- | :--- |
| **Horizontal Scalability:** We are no longer bottlenecked by a single Redis node's CPU. We can easily scale to 100k+ operations/second by adding more buckets. | **High Complexity:** Managing empty-bucket routing, returning inventory on canceled orders, and maintaining overall stock views becomes significantly harder to implement. |
| **No Single Point of Failure:** If a single Redis node crashes, only a portion of the inventory is temporarily locked. | **Uneven Distribution:** Some users might see "Out of Stock" if their routed bucket is empty, even if other buckets still contain items (mitigated by retry/fallback algorithms). |

---

## Room for Scalability

### 1. Ingress Rate Limiting & Load Shedding
When traffic exceeds our designated constraints (e.g., more than 100,000 writes/sec), we must protect the system from crashing.
* **Implementation:** Deploy an API Gateway (like Kong or Envoy) configured with token-bucket rate limiting.
* **Action:** Instead of letting excessive traffic reach our app nodes, the gateway drops requests early, returning an immediate **HTTP 429 (Too Many Requests)**. This shields application memory and CPU from saturating.

### 2. Edge Caching & CDNs (L0 Cache)
We can offload almost 100% of read traffic (users refreshing the product page to see details and active/inactive status) away from our origin servers entirely.
* **Implementation:** Deploy a globally distributed Edge layer (like Cloudflare Workers or AWS CloudFront).
* **Action:** Cache static product details at the CDN edge. Use edge workers to dynamically change the buy button state (enabled/disabled) based on global flags, preventing invalid traffic from even reaching our load balancers.

### 3. Virtual Waiting Rooms (Queue-it)
For extreme-demand events, we can implement a traffic-smoothing gatekeeper.
* **Implementation:** Integrate a third-party waiting room platform.
* **Action:** Instead of letting 500,000 users hit our checkout endpoints at 12:00:00, the waiting room holds them in a FIFO queue on external servers. It lets users through to our checkout system in controlled batches (e.g., 5,000 users per second), transforming a traffic spike into a flat, predictable plateau.