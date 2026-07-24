---
title: "Reconcile Service"
modified: "2026-07-24"
---

# Financial Reconciliation System

## Scope & Requirements

### Functional
- Ingest internal ledger data.
- Ingest external payment data (e.g., Stripe CSVs).
- Match transactions by ID.
- Flag and handle mismatches.
### Non-Functional
- **Scale:** 50 Million transactions per day.
- **Accuracy:** Strict financial consistency (no dropped data).
- **Latency:** Batch/offline processing (doesn't need to be real-time).

---

## Capacity Estimation (Back-of-the-Envelope Math)

- **Data Size:** Assume 1 record (internal ledger event or external CSV row) = 1 KB.
- **Daily Storage:**
  - Internal: 50,000,000 records × 1 KB = 50 GB / day.
  - External: 50,000,000 records × 1 KB = 50 GB / day.
  - Total Daily Raw Ingestion: 100 GB / day.
- **Throughput Rate (Flat Execution):** Spreading the 50M daily external transactions flatly across a controlled 24-hour ingestion window yields:
  $\approx 580 \text{ records/sec}$
  $\approx 580 \text{ KB/sec}$ inbound network bandwidth.
- **Memory Footprint:** At 580 records per second, the data volume is actually very low. A standard 16 GB RAM server gives us way more than enough breathing room to hold the transactions in memory while we match them, ensuring we never run out of memory.

---

## High-Level

### Core API & Event Endpoints

- `POST /v1/internal-events` -> Internal webhook pipeline to push transaction updates to the messaging layer via CDC (Change Data Capture).
- `SFTP Pull Event (Cron-triggered)` -> Batch job reads from `/settlements/stripe/YYYY-MM-DD.csv`.

### Database Schema

```sql
-- Operational DB (Protected via Outbox Pattern)
CREATE TABLE transaction_outbox (
    event_id UUID PRIMARY KEY,
    transaction_id VARCHAR(64) NOT NULL,
    amount DECIMAL(18, 4),
    currency VARCHAR(3),
    status VARCHAR(20),
    created_at TIMESTAMP
);

-- Reconciliation Staging & Audit DB
CREATE TABLE external_stripe_staging (
    stripe_tx_id VARCHAR(64) PRIMARY KEY,
    amount DECIMAL(18, 4),
    settled_at TIMESTAMP,
    raw_payload JSONB
);

CREATE TABLE discrepancy_ledger (
    audit_id UUID PRIMARY KEY,
    transaction_id VARCHAR(64),
    expected_amount DECIMAL(18, 4),
    actual_amount DECIMAL(18, 4),
    variance DECIMAL(18, 4),
    error_type VARCHAR(50), -- 'AMOUNT_MISMATCH', 'MISSING_EXTERNAL'
    resolved BOOLEAN DEFAULT FALSE
);
```

### System Architecture Map

```mermaid
flowchart TD
    %% Internal Pipeline
    A[Internal Checkout] --> B[Core DB + Outbox Table]
    B --> C[CDC / Debezium]
    C --> G[Partitioned Queue]

    %% External Pipeline
    D[Stripe SFTP Server] --> E[2:00 AM Cron Parser]
    E --> F[Document DB]
    F --> G

    %% Processing & Matching
    G --> H[10x Batch Workers]

    %% Output Sinks
    H --> I[Reconciled Table DB]
    H --> J[Discrepancy Ledger]
```

---
	
## Deep Dive: Core Bottlenecks

### Hash-Based Partitioning & Data Shuffling

```mermaid
flowchart TD
    %% Sources
    subgraph Data_Ingestion [1. Data Ingestion]
        A[Internal Ledger]
        B[Stripe CSV File]
    end

    %% Router
    A --> C
    B --> C
    C{Smart Router}

    %% Queues
    subgraph Partition_Queues [2. Sorting Piles]
        P0[Queue Partition 0]
        P1[Queue Partition 1]
        P_N[Queue Partition 9]
    end

    C -->|Hashes to 0| P0
    C -->|Hashes to 1| P1
    C -->|Hashes to 9| P_N

    %% Workers
    subgraph Worker_Nodes [3. Distributed Workers]
        W0[Worker 0]
        W1[Worker 1]
        WN[Worker 9]
    end

    P0 --> W0
    P1 --> W1
    P_N --> WN

    %% Worker Detail 
    subgraph In_Memory_Matching [4. Inside Worker 0's RAM]
        M1[Read Incoming Record] --> M2[Add to Search Map]
        M2 --> M3{Pair Found?}
        M3 -->|Yes| M4[Validate Amount]
        M4 --> M5[Erase from RAM]
    end

    W0 --> M1

    %% Target
    M5 --> DB[(Reconciled Database)]
    W1 --> DB
    WN --> DB
```

To reconcile millions of rows across distributed hardware without causing massive memory overhead or cross-worker chat network bottlenecks, we enforce strict Hash-Based Partitioning for distributing task to worker. 

The system collects our own data live all day then grabs Stripe's data once a night, and throws both into a smart sorting system that splits the heavy workload so multiple computers can share the job.

By setting the message key exclusively to the `transaction_id`, the message router runs an identical routing algorithm across both streams: `hash(transaction_id) % 10`. This guarantees that both the internal ledger event and the external Stripe record for any given ID are routed into the exact same partition queue. 

Distributed workers are assigned explicitly to individual partitions. When a worker reads its partition, it builds a in-memory hash map of the transactions it encounters. When it identifies the matching pair, it validates the amount, drops the pair from memory to keep RAM usage stable, and writes the success state to the database.

### Resiliency & The Exception Pipeline

In financial systems, dropping or blocking execution loops over data anomalies introduces extreme operational risk. Our architecture separates automated stream matching from human auditing loops to guarantee uninterrupted batch execution.

**The Missing Record Trap:** If an internal record exists but the Stripe record is absent, the matching worker marks it as `UNRECONCILED_PENDING`. The system applies a 24-hour grace period buffer to allow for processing delays or trailing bank webhooks. If the record remains missing after 48 hours, it is promoted to `RECONCILIATION_FAILURE` and routes to the `discrepancy_ledger`.

**The Amount Mismatch Bug:** If an internal event specifies a charge of $50 but Stripe reports only $45 was processed, the system considers the real-world cash movement (Stripe) as the ground truth. The matching worker flags this immediately as an application bug or telemetry fault. It bypasses any dangerous automated corrections or charge retries, writes the exact mismatch delta into the `discrepancy_ledger`, increments a Prometheus metric counter, and safely processes the next message.

## Scaling & Trade-offs

**Transactional Outbox Over Live Ingestion:** We explicitly chose to implement a transactional outbox table instead of having the core checkout service publish directly to the reconciliation queue. This trades minor write latency overhead in the core checkout service for data integrity, ensuring we never drop transaction telemetry during network blips or broker failures.

**Scheduled Processing Over Real-Time Joins:** Instead of utilizing a massive, expensive, real-time distributed cache to hold millions of un-reconciled transactions for hours while waiting for Stripe's file, we trade real-time visibility for operational safety. By scheduling the core matching pipeline around Stripe's batch schedule, we achieve flat, fully predictable compute costs and protect our nodes from out-of-memory cascading faults.
