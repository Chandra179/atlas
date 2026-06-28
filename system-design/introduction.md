---
title: "System Design"
aliases: []
tags: [system-design]
created: "2026-06-13"
---

# System Design

Building and architecting distributed systems at scale. Every concept here is a response to a real failure in production someone built a system, it broke under load, and the pattern emerged.

## Core Design Principles

### Scalability

Handling growth without rewriting the system. Two approaches:

- **Vertical scaling**: buy a bigger machine. Simple, hits a ceiling fast. AWS's largest instance can't serve 100 million users.
- **Horizontal scaling**: add more machines. Complex now you have to coordinate them but unbounded. Netflix runs thousands of instances.
- The hard part isn't adding servers. It's that your database, your cache, and your message queue all need to scale too, and they scale differently.

### Reliability & Availability

A system that works today but fails tomorrow isn't reliable. A system that's down right now isn't available. The distinction matters because the fixes are different:

- **Redundancy**: if one server dies, another takes over. But redundancy alone isn't enough you need failover detection. A dead server in the pool silently dropping requests is worse than a server that's visibly down.
- **Uptime percentages**: 99.9% ("three nines") = ~8.7 hours of downtime per year. 99.99% = ~52 minutes. The jump from three to four nines often doubles the engineering effort.
- **Real example**: GitHub's 2018 outage a network partition split a MySQL cluster. The system detected failure but the failover mechanism itself had a bug. Availability requires testing the failure paths, not just the happy path.

### Performance

Speed and capacity are two different things:

- **Latency**: how fast one request completes. A user typing in a search box cares about latency.
- **Throughput**: how many requests the system handles per second. A payment processor during Black Friday cares about throughput.
- Optimizing one often helps the other caching reduces both latency and server load but they can conflict. Batching requests improves throughput at the cost of individual request latency.

### Fault Tolerance

Systems fail. The question is whether they fail gracefully:

- **Retry with backoff**: a downstream service times out. Retrying immediately just adds load to an already struggling service. Exponential backoff (1s → 2s → 4s → 8s) gives it room to recover.
- **Circuit breaker**: after N consecutive failures, stop trying and fail fast. Amazon's "Blast Radius" principle: a failing recommendation service shouldn't take down checkout.
- **Graceful degradation**: if the recommendation engine is down, show the top-10 list instead of an error page. Users tolerate reduced functionality more than they tolerate errors.

## Topics

- **Infrastructure** Kafka (high-throughput event streaming, LinkedIn processes 7 trillion messages/day), RabbitMQ (flexible routing, when you need per-message acknowledgements), event processing patterns (dead letter queues, exactly-once semantics, ordering guarantees).
- **Patterns** consistent hashing (add a cache node without invalidating everything), ID generation (Twitter Snowflake: 64-bit IDs, no coordination), cache stampede (expiring a hot key → 1000 servers all hit the DB simultaneously), rate limiting (token bucket smooth bursts, sliding window precise limits).
- **Systems** distributed cache (memcached at Facebook, Redis at Twitter), task scheduler (ensure a job runs exactly once, not zero times and not twice), notification system (APNs/FCM + WebSocket fallback, fan-out to millions), real-time chat (WebSocket state, message ordering, presence detection).

## Building Blocks

### Load Balancers

Distribute traffic across servers. Layer 4 (TCP) is fast but blind. Layer 7 (HTTP) can route `/checkout` to a bigger instance pool and `/static` to a CDN. **Example**: a single NGINX instance can handle ~10k concurrent connections. At scale, you need a tiered approach DNS → hardware LB → software LB → application.

### SQL vs NoSQL

Not a religious war. A decision tree:
- Need ACID transactions, complex joins, data integrity above all? → PostgreSQL, MySQL.
- Need flexible schema, rapid iteration, nested documents? → MongoDB.
- Need sub-millisecond latency, simple key-value? → Redis.
- Need massive write throughput, time-series? → Cassandra.
- **Example**: Uber started with PostgreSQL. When trip volume exploded, they moved hot data to Redis (driver locations, sub-ms updates) and kept trip history in schemaless document stores. Different data, different database.

### Caching

The fastest database query is the one you never make. **Example**: at Reddit, a popular post's comment count might be requested 100k times per minute. Cache it in Redis with a 1-second TTL and you've eliminated 99,999 database queries. The stale-1-second count is imperceptible to users.

- **Redis / Memcached**: in-memory, sub-ms latency. Redis adds data structures (lists, sets, sorted sets) beyond simple key-value.
- **Cache invalidation**: the famously hard problem. Strategies: TTL (simple, eventually consistent), write-through (cache updated on every write, consistent but slow), write-behind (cache updated async, fast but can lose data).

### Message Queues

Decouple producers from consumers. A user uploads a video instead of processing it synchronously (user waits 30 seconds), you drop a message in a queue and return "processing." **Example**: Instagram uploads. The upload API accepts the file, queues a processing job, and returns immediately. The user sees a spinner, not a timeout.

### CAP Theorem

In a network partition, you can have Consistency (all nodes see the same data) or Availability (every request gets a response) not both. **Example**: a banking system during a network split. Choose Consistency (reject writes until partition heals no overdrafts but service is degraded) or Availability (accept writes on both sides, merge later 24/7 service but risk of conflicting balances). Most systems choose CP for financial data and AP for user profiles.

### Database Sharding

Split data across multiple databases by a shard key. **Example**: shard by `user_id % 1000` → 1000 shards. User 42's data lives on shard 42. The problem: queries that cross shards (all users in California) become expensive scatter-gather operations. Shard key choice is irreversible changing it requires migrating all data.

### Database Replication

Keep copies for redundancy. **Primary-replica**: writes go to primary, reads go to replicas. **Example**: YouTube's comments. The write volume is moderate, read volume is enormous. One primary handles writes, 10 replicas handle reads. Replication lag: a comment posted 200ms ago might not appear in a read replica yet. Your UX needs to handle that.

### DNS

More than just name resolution. DNS does routing, load balancing, and failover. **Example**: `api.example.com` resolves to different IPs based on geography (geo-DNS) and health (remove unhealthy IPs from DNS response). Tradeoff: DNS changes propagate slowly (TTL), so it's the slowest failover mechanism, not suitable for sub-second cutover.

### CDNs

Serve static content from edge locations close to users. **Example**: an image hosted on `cdn.example.com` is cached in 200+ edge locations. A user in Sydney fetches it from the Sydney edge in 10ms instead of from Virginia in 200ms. CDNs also absorb DDoS attacks a 1 Tbps attack on Cloudflare's 200+ edge locations is a Tuesday.

### Data Consistency Models

- **Strong consistency**: after a write, all subsequent reads see it. Costs latency (consensus required).
- **Eventual consistency**: after a write, reads eventually see it. Amazon DynamoDB default: replicas converge over time.
- **Real example**: a social media "like" count. Strong consistency (every like is immediately reflected) costs ~100ms per operation. Eventual consistency (like count updates within 5 seconds) costs ~5ms. For a like button, 5-second staleness is fine. For a bank balance, it's not.

### API Design

- **REST**: resource-oriented, stateless, cacheable. Good for CRUD, public APIs. Use cursor-based pagination for large datasets (stable under inserts), not offset-based (drifts when rows are added).
- **gRPC**: binary protocol, strongly typed contracts via protobuf. Good for internal service-to-service communication where latency matters.
- **Rate limiting**: protect your API from abuse. Token bucket (steady rate with burst tolerance), sliding window log (precise, expensive), fixed window (simple, burst at boundary).
- **Versioning**: never break a live API. Deploy v2 alongside v1, deprecate v1 with headers, remove when traffic reaches zero.

### Observability

You can't fix what you can't see. Three pillars:

- **Logging**: structured, searchable record of events. "User 42 completed checkout. Total: $53.00." ELK stack (Elasticsearch + Logstash + Kibana) or Grafana Loki.
- **Metrics**: numeric time-series data. "P99 latency for `/checkout`: 230ms." Prometheus + Grafana.
- **Tracing**: follows a single request across service boundaries. "`POST /orders` spent 12ms in auth service, 45ms in inventory service, 200ms in payment service." Jaeger, Zipkin, or OpenTelemetry.

**Example**: Stripe's observability. When a payment fails, the engineer traces the exact request through 15 microservices, sees the inventory service returned a 500 at timestamp X, and correlates it with a deployment 3 minutes earlier. Without tracing, that's a multi-hour investigation.
