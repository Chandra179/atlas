---
title: "Kafka"
aliases: []
tags: [cs, cs/kafka]
created: "2026-06-13"
---

# Kafka

## Why Kafka Exists

You have 50 microservices. Orders need to reach inventory, billing, shipping, and analytics. With point-to-point HTTP, each service needs its own connection to every other service 200 connections. When one service is slow, failures cascade. You cannot replay messages after a crash. The more services you add, the more tangled the graph becomes.

Kafka decouples everything through a **distributed commit log**. Producers write messages to a topic. Consumers read from the topic independently, at their own pace. A consumer crash doesn't block the producer. Adding a new consumer doesn't require changing any existing service. The message is the contract, not the service.

Built for high throughput at scale: LinkedIn processes 7 trillion messages per day through Kafka.

## Cluster & Broker

A Kafka cluster is a group of **brokers** physical servers or containers providing high availability and scalability. A cluster has 1 or more brokers.

For every partition, one broker is elected as the **Partition Leader**. It handles all read and write requests for that partition. Other brokers act as **Partition Followers**, replicating the leader's data. If the leader fails, a follower automatically steps up to become the new leader.

## Topic & Partition

A **topic** is a logical category where you send and categorize data (e.g., `orders`, `payments`, `user-events`). Each topic must have at least 1 partition (configurable). Partitions are distributed across different brokers to allow multiple producers and consumers to work simultaneously.

The partition is the unit of parallelism in Kafka. More partitions = more throughput, but also more overhead.

## Log Segments

On disk, a partition is a directory. Each segment is a pair of files:

- `.log` raw message data, appended sequentially
- `.index` sparse offset-to-byte-offset mapping (one entry per ~4096 bytes)
- `.timeindex` timestamp-to-offset mapping

Segments are:

- **Rolled** when they hit `segment.bytes` (default 1 GB) or `segment.ms` (default 7 days)
- **Active segment** the one currently being written to
- **Older segments** immutable, read-only, candidates for compaction/deletion

Sequential I/O on the `.log` file makes Kafka fast writes are pure appends.

## Replication

### ISR (In-Sync Replicas)

A partition leader maintains a set of replicas that are "caught up" the ISR. A follower is in the ISR if it has fully replicated all messages up to the last committed offset. If a follower falls behind (replication lag > `replica.lag.time.max.ms`, default 30s), it is removed from ISR.

- `min.insync.replicas` minimum number of in-sync replicas required for the leader to accept writes
- If ISR size drops below this threshold, the broker rejects writes with `NotEnoughReplicasException`
- Tradeoff: higher value = stronger durability, lower availability (fewer brokers able to write)

### High Watermark (HW)

The offset up to which all ISR replicas have committed. Consumers can only read up to HW not the Log End Offset (LEO).

- When a leader receives a write, it advances LEO immediately but HW only advances once all in-sync followers have replicated the message.
- During leader failover, the new leader truncates to the HW of the old leader to guarantee consistency across replicas.
- Messages between HW and LEO are not visible to consumers they exist on the leader but aren't fully replicated yet.

### Controller Broker

Every cluster has one Controller broker. It manages partition leadership across the cluster:

- Monitors broker heartbeats (via ZK ephemeral nodes or KRaft quorum)
- Assigns partition leaders when a broker fails or a new partition is created
- Manages partition reassignments (e.g., adding replicas, migrating to new brokers)

If the Controller fails, a new one is elected automatically via ZooKeeper or the KRaft quorum.

### ZooKeeper / KRaft

Kafka uses a metadata store to track cluster state:

- **ZooKeeper** (legacy): Stores broker membership, topic configs, ACLs, quotas, and Controller election. Kafka ≤ 2.8 required ZK. Deprecated as of KIP-833, targeted for removal in Kafka 4.0.
- **KRaft** (Kafka Raft): Self-managed metadata quorum introduced in 2.8 (GA in 3.3+). No external dependency Kafka runs as a single binary with internal Raft-based consensus for metadata. Replaces ZK entirely. The Raft consensus mechanism is covered in detail in [etcd-raft.md](../etcd-raft.md).

## Producer

Each message contains a **Key** (optional, partition routing), **Value** (payload), **Headers** (optional metadata), **Timestamp**, and an **Offset** (assigned by the broker on write).

### Partition Routing

When a topic has multiple partitions, the producer decides where each message lands:

- **Key-based hash** same key always goes to the same partition. Enables ordering per key.
- **Round-robin** spreads messages evenly across partitions.
- **Custom partitioner** application-defined placement logic.

### Acks Levels

Controls how many replica acknowledgments the leader requires before responding:

```go
import "github.com/twmb/franz-go/pkg/kgo"

// acks=0 Fire-and-forget. Highest throughput, lowest durability.
// Messages can be silently lost on leader crash.
client, _ := kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.RequiredAcks(kgo.NoLeaderAck()), // acks=0
)

// acks=1 Leader writes to its log and responds. Default.
// Good durability, but a leader crash before replication can lose data.
client, _ = kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.RequiredAcks(kgo.LeaderAck()), // acks=1
)

// acks=all Leader waits for all in-sync replicas to acknowledge.
// Strongest durability, highest latency.
client, _ = kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.RequiredAcks(kgo.AllISRAcks()), // acks=-1 / all
)
```

| Acks | Durability | Throughput (1 KB, 3 brokers) | Risk |
|---|---|---|---|
| 0 | None | ~1.5M msg/s | Silent data loss on leader crash |
| 1 | Single node | ~1M msg/s | Data loss if leader crashes before followers replicate |
| all | Strong | ~300K msg/s | Highest safety, 5× slower than acks=0 |

### Idempotent Producer

Guarantees exactly-once semantics for writes, ensuring retries won't create duplicates. Each producer gets a unique producer ID, and the broker deduplicates by (producer ID, sequence number).

```go
// Idempotent: retries won't create duplicates
client, _ = kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.IdempotentProducer(),
)
```

## Message Ordering

Within a partition, Kafka orders messages strictly by offset (FIFO). Across partitions, no ordering guarantee.

Ordering requires a single partition, which limits parallelism. If you need per-key ordering (e.g., user events), use key-based routing to land all messages for the same key in the same partition.

## Consumer

### Consumer Group

A consumer group identifies a set of consumers that share the partitions of a topic. If 3 consumers run on different servers with the same `group.id`, Kafka distributes the topic's partitions among them.

**Without consumer group (each instance gets ALL messages):**

```go
import "github.com/twmb/franz-go/pkg/kgo"

// Service Instance 1
client1, _ := kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.ConsumeTopics("orders"),
 // NO consumer group
)

// Service Instance 2
client2, _ := kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.ConsumeTopics("orders"),
 // NO consumer group
)

// Result: BOTH instances receive ALL messages from "orders" topic
// Message 1 → Instance 1 ✅
// Message 1 → Instance 2 ✅ (duplicate!)
// Message 2 → Instance 1 ✅
// Message 2 → Instance 2 ✅ (duplicate!)
```

**With consumer group (partitions are distributed):**

```go
// Service Instance 1
client1, _ := kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.ConsumeTopics("orders"),
 kgo.ConsumerGroup("order-processor-group"), // ← Same group
)

// Service Instance 2
client2, _ := kgo.NewClient(
 kgo.SeedBrokers(brokers...),
 kgo.ConsumeTopics("orders"),
 kgo.ConsumerGroup("order-processor-group"), // ← Same group
)

// Result: Kafka splits partitions between instances
// Instance 1 gets: Partition 0, Partition 1
// Instance 2 gets: Partition 2, Partition 3
// Each message goes to ONLY ONE instance ✅
```

### Consumer Offsets

Consumer offsets act as a bookmark. For example, if a topic has 10 messages and the consumer has committed up to offset 5:

```
Messages in Kafka topic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Consumer processes: 0, 1, 2, 3, 4
Consumer commits: offset 5 (meaning "I'm done up to 5")
Consumer crashes 💥

On restart:
- WITH commits: Starts from offset 5 → [5, 6, 7, 8, 9]
- WITHOUT commits: Starts from beginning → [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] (duplicates!)
```

### Consumer Lag

The difference between the latest partition offset and the consumer's committed offset a measure of how "behind" a consumer is.

- If you have 1 partition and 2 consumers in the same group, Kafka gives the partition to Consumer A and leaves Consumer B idle. A single partition is only ever assigned to one consumer at a time.

### Group Coordinator

Determined by:

$$Partition = | \text{Hash(group.id)} | \pmod{N}$$

A specific broker responsible for a consumer group:

- Tracks heartbeats from consumers to make sure they are still alive.
- Triggers a rebalance if a consumer joins or leaves.
- Stores the committed offsets for that group.

### Rebalancing

When a consumer joins or leaves a group, Kafka redistributes partitions across the remaining consumers. This is called a rebalance.

- **Eager rebalancing** (old protocol): All consumers stop consuming, revoke all partitions, then rejoin and get reassigned. A "stop-the-world" event no progress during rebalance.
- **Cooperative sticky rebalancing** (modern, Kafka ≥ 2.4): Consumers only revoke a subset of partitions, letting the rest continue processing. Fewer pauses, smoother transitions.

### Consumer Commit Strategies

- `enable.auto.commit=true` (default): Offsets auto-committed every `auto.commit.interval.ms` (default 5s). If the consumer crashes between processing and auto-commit, messages are reprocessed at-least-once semantics.
- Manual commit: Disable auto-commit, call `commitSync()` or `commitAsync()` explicitly.
 - `commitSync()` blocking, retries on failure. Call after processing each batch.
 - `commitAsync()` non-blocking, callback on failure. Higher throughput but no retry.

Process → commit = at-least-once. Commit → process = at-most-once (messages lost on crash).

## Performance

### Throughput

Add more partitions and use larger batches. Measured in MB/s or msg/s.

On a 3-broker cluster with 1 KB messages:
- `acks=0`: ~1.5M msg/s
- `acks=1`: ~1M msg/s
- `acks=all`: ~300K msg/s

LinkedIn processes 7 trillion messages per day through Kafka. At this scale, partition count is a first-order concern they run tens of thousands of partitions across thousands of brokers.

### Latency

Latency = (Producer Batching Time) + (Network Trip) + (Broker Disk Write) + (Consumer Processing Time).

The trade-off: reducing latency (making it "real-time") often requires lowering batch sizes, which reduces overall maximum throughput. At low throughput (<10K msg/s), end-to-end latency can be <10ms. At peak throughput, latency rises to 50–200ms depending on batch configuration.

### Bottlenecks

- **Producer Bottleneck**: The network or CPU can't keep up with the data your app is generating.
- **Partition Bottleneck**: A single partition is overwhelmed by too many messages (often caused by a "Hot Key"). The fix is either more partitions or key design changes.
- **Consumer Bottleneck**: The most common clog. Business logic (database writes, API calls) is slower than the incoming message rate. Requires scaling consumers or optimizing processing.

If your system hits a bottleneck, do not try to make a single thread faster. Increase throughput by adding more partitions and consumers to process data in parallel.

### The Cost of More Partitions

Adding partitions increases throughput but carries tradeoffs:

- More open file handles on each broker (each partition = a directory + 3 files)
- Longer controller failover time (the controller must reconcile more partition leaders)
- Higher end-to-end latency (producer connections distribute across more leaders)
- More memory for replica fetchers

Keep partition count to ~100 per broker unless you have a specific throughput requirement that justifies more.

## Retention & Compression

### Retention Policies

How Kafka decides which data to delete:

- **Delete** (default): Remove old segments based on time (`retention.ms`, default 7 days) or total size (`retention.bytes`, default infinite). Oldest segments are deleted first.
- **Compact**: Keep only the latest message for each key. Useful for keyed data (e.g., user profile changes) where you only care about the current state. Log compaction runs in the background on inactive segments.

### Compression

Producers can compress message batches before sending:

- Supported codecs: `gzip`, `snappy`, `lz4`, `zstd`
- Typical ratios on JSON payloads: gzip 5–10× reduction, snappy 2–4×, zstd 3–6×
- Benefits: smaller network transfer, less disk usage
- Cost: producer CPU for compression, consumer CPU for decompression
- Configurable on the producer side; Kafka stores and serves compressed batches as-is decompression only happens on the consumer

| Codec | Compression Ratio (JSON) | CPU Cost | Latency Impact |
|---|---|---|---|
| snappy | 2–4× | Low | Minimal |
| lz4 | 2–4× | Low | Minimal |
| zstd | 3–6× | Medium | Slight |
| gzip | 5–10× | High | Noticeable at high volume |

For most use cases, snappy offers the best balance of compression and speed. Use zstd when network bandwidth is the constraint. Use gzip only when storage costs dominate.

## Kafka vs. RabbitMQ vs. NATS

| Dimension | Kafka | RabbitMQ | NATS |
|---|---|---|---|
| Model | Distributed commit log | Message broker (AMQP) | Lightweight pub/sub |
| Throughput | 1M+ msg/s | 100K msg/s | 1M+ msg/s |
| Latency | 10–100ms | <1ms | <1ms |
| Message replay | Yes by offset | No (after ack, message is gone) | No |
| Ordering | Per-partition, strict | Per-queue, strict | Per-subject, best-effort |
| Routing | Topic-based partition routing | Complex exchanges, bindings | Subject-based with wildcards |
| Persistence | Durable, configurable retention | Durable, auto-delete on ack | Optional (JetStream) |
| Operational complexity | High (brokers, ZK/KRaft, rebalancing) | Medium | Low |

**Reach for Kafka when:** you need high throughput, message replay, strong ordering within a partition, or retention for batch processing.

**Reach for RabbitMQ when:** you need complex routing (topic exchanges, headers exchanges, direct queues), per-message acknowledgments, or low latency with moderate throughput.

**Reach for NATS when:** you need the simplest possible pub/sub, ultra-low latency (<1ms), or an embedded messaging layer within a Go service.

## Reference

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/) official configs, protocol, and design
- [KRaft (KIP-833)](https://cwiki.apache.org/confluence/display/KAFKA/KIP-833+Mark+KRaft+as+Production+Ready) self-managed metadata quorum
- [Confluent Documentation](https://docs.confluent.io/kafka/) practical guides and best practices
- "Kafka: The Definitive Guide" (O'Reilly) Neha Narkhede, Gwen Shapira, Todd Palino
- [franz-go](https://github.com/twmb/franz-go) Go client used in this document
