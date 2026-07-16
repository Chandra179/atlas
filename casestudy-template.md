# [System/Feature Name, e.g., Real-Time Chat System]

*A realistic, battle-tested system design for handling [specific high-scale challenge, e.g., massive group-chat message spikes] without crashing infrastructure or losing data.*

---

## The Problem & Goals

### Problem
[Describe a highly specific, painful bottleneck scenario that a standard architecture cannot handle. Use numbers to set the scale.]
*   **The Scenario:** [e.g., "A celebrity sends a message to a group chat with 100,000 active users at the exact same millisecond."]
*   **The Technical Failure:** [e.g., "Our WebSocket servers try to broadcast 100,000 payloads simultaneously, exhausting network sockets and spiking CPU to 100%."]

### Goals
*   **Goal 1 (Functional/Accuracy):** [What is the absolute business rule? e.g., "Messages must be delivered in strict chronological order."]
*   **Goal 2 (Operational/Resilience):** [How must it fail if it has to? e.g., "If delivery fails, we fail gracefully without crashing the WebSocket node."]
*   **Goal 3 (Performance):** [A realistic metric target. e.g., "In-room message delivery latency (p99) under 100ms."]

---

## System Constraints

*Note: Setting physical hardware boundaries forces realistic engineering choices instead of 'infinite cloud' magic.*

### Traffic & Performance Targets
*   **Peak Load:** [e.g., "50,000 incoming messages per second across all channels."]
*   **Latency Target:** [e.g., "Message write path completed in < 15ms (p99)."]
*   **System Lag Budget:** [e.g., "Downstream search indexes must catch up within 2 seconds."]

### Resource Constraints (Hardware/Infrastructure)
*   **Application/Socket Layer:** [e.g., "8 Go-based WebSocket instances (each 4 vCPU, 8GB RAM). Target CPU < 60%."]
*   **Cache/PubSub Layer:** [e.g., "A single Redis Cluster for pub/sub routing. Max CPU < 75% on any single shard."]
*   **Database Layer:** [e.g., "A MongoDB replica set (3 nodes, 16 vCPU, 64GB RAM each) for persistent chat history."]

---

## High-Level Design (HLD) & Trade-offs

*Evaluate two competing architectural options. Show that there is no 'perfect' solution, only trade-offs.*

### Design Option 1: [Option Name, e.g., Direct Pub/Sub Routing]

[Brief 2-3 sentence summary of how this straightforward option works.]

```mermaid
// Insert Sequence or Flow Diagram here
```

How it Works
Step 1: [User action...]

Step 2: [How the bottleneck is handled...]

Step 3: [How data is saved...]

| Pros | Cons |
|---|---|
| Simple to Build: [e.g., "Requires no extra queue infrastructure."] | Scalability Limit: [e.g., "Blocks connection threads under heavy fan-out spikes."] |
| Sub-Millisecond Delivery: [e.g., "No message queues in the path means instant delivery."] | Data Loss Risk: [e.g., "If a client disconnects during the spike, they lose the message entirely."] |

### Design Option 2: [Option Name, e.g., Buffered Queue with Pull-Based Sync]

[Brief 2-3 sentence summary of how this more advanced option solves the bottleneck.]

```mermaid
// Insert Sequence or Flow Diagram here
```

How it Works
Step 1: [User action...]

Step 2: [How the bottleneck is handled...]

Step 3: [How data is saved...]

Trade-offs

| Pros | Cons |
|---|---|
| Highly Resilient: [e.g., "Queues isolate the database from sudden spikes."] | Increased Complexity: [e.g., "Clients must now handle pulling and reconciling missed history."] |
| Zero Data Loss: [e.g., "Messages are safely persisted before delivery is attempted."] | Consistency Delay: [e.g., "Slightly higher latency (20-50ms) due to queue hop."] |

### Room for Scalability (Production Hardening)

What additional operational layers prevent catastrophic failure under extreme edge cases?

1. [Safeguard 1, e.g., Backpressure & Rate Limiting]
   *   **Implementation:** [How is it built?]
   *   **Action:** [e.g., "If a WebSocket node's memory exceeds 80%, we slow down incoming message reads from the socket to allow downstream databases to catch up."]

2. [Safeguard 2, e.g., Edge Load Balancing]
   *   **Implementation:** [How is it built?]
   *   **Action:** [e.g., "Use Geo-DNS to route chat traffic to the nearest regional data center, splitting the global load."]

3. [Safeguard 3, e.g., Degraded Mode / Graceful Degradation]
   *   **Implementation:** [How is it built?]
   *   **Action:** [e.g., "Under extreme system load, we disable typing indicators and read receipts to prioritize the delivery of raw message text."]