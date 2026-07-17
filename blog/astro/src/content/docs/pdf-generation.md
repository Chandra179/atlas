---
title: "Pdf Generation"
modified: "2026-07-17"
---

# PDF Generation Service

## System Requirements & Constraints

**Core Metric:** The system must reliably process **1,000 PDFs per second** at peak load without dropping events or degrading upstream checkout performance.

### Functional Requirements

- **Trigger:** Asynchronous execution immediately after a successful payment event.
- **Output:** Generate a standardized single-page A4 document (text structured layout + a compressed company logo).
- **Delivery:** Deliver the PDF directly to the user's email inbox.
- **Public Access:** Provide a public view link within the email that remains accessible for exactly **7 days** before automatically expiring.

### Non-Functional Requirements

- **High Availability & Fault Tolerance:** Microservice failures must not result in data loss or duplicate PDF generation.
- **Scalability:** Independent scaling of ingestion, processing, and delivery tiers.
- **Stateless Processing:** Workers should require minimal dependencies and zero direct database connections.

## High-Level Architecture & End-to-End Pipeline

The system uses an **Event-Driven Architecture (EDA)** paired with the **Transactional Outbox Pattern** to decouple the heavy compute layer from the critical path of the payment checkout flow.

```mermaid
graph TD
    %% Subgraph 1: Ingestion
    subgraph Ingestion_Tier [1. Ingestion & Acid Consistency]
        direction TB
        Vendor[Payment Vendor Webhook] -->|Retry on 5xx| LB[Load Balancer]
        LB --> Ingestion[Ingestion Service]
        
        subgraph DB [Core Relational DB]
            direction LR
            Orders[("Orders Table<br/>Status: PAID")] 
            Outbox[("Outbox Table<br/>Event: PROCESS_PDF")]
        end
        
        Ingestion -->|Atomic Transaction| Orders
        Ingestion -->|Atomic Transaction| Outbox
    end

    %% Subgraph 2: Event Streaming
    subgraph Streaming_Tier [2. Guaranteed Domain-Isolated Queueing]
        direction TB
        Tailer[Transaction Log Tailer / CDC] -->|Read committed outbox logs| Outbox
        Tailer -->|Publish Payload &lt; 1MB| Broker{Message Broker}
        
        Broker -->|Invoice Data| InvQueue[invoice-queue]
        Broker -->|Order Data| OrdQueue[order-queue]
        Broker -->|3x Failures| DLQ[Dead Letter Queue]
    end

    %% Subgraph 3: Compute
    subgraph Compute_Tier [3. Stateless PDF Generation]
        direction TB
        InvQueue --> Workers[Autoscaling PDF Workers]
        OrdQueue --> Workers
        
        Workers -->|"HTML-to-PDF Engine, Render time &lt; 30ms"| Binary[Compressed PDF Binary]
    end

    %% Subgraph 4: Storage & Delivery
    subgraph Storage_Delivery [4. Storage & Email Dispatch]
        direction TB
        Binary -->|Stream Binary Async| S3[(Amazon S3 Bucket)]
        
        subgraph S3_Management [Object Lifecycle]
            S3 --> Prefixes["invoices/YYYY-MM-DD/id.pdf"]
            Prefixes --> TTL{7-Day Expire Policy}
            TTL -->|Hard Delete| Purge((Auto-Purge File))
        end
        
        Workers -->|Cryptographic Signing| SignedLink[7-Day S3 Presigned URL]
        SignedLink --> Notification[Notification Service]
        
        Notification -->|Check if S3 key exists| S3
        Notification -->|Inject Link to Email HTML| SES[Email Service Provider]
        SES -->|Async Delivery| User[End User Inbox]
    end

    %% Styling & Theme adjustments
    classDef storage fill:#d4ebf2,stroke:#333,stroke-width:1px;
    classDef queue fill:#fbe3e8,stroke:#333,stroke-width:1px;
    classDef logic fill:#e1f7d5,stroke:#333,stroke-width:1px;
    
    class DB,S3 storage;
    class InvQueue,OrdQueue,DLQ,Broker queue;
    class Ingestion,Workers,Notification,Tailer logic;
```

### 1. Payment Ingestion & Webhook Handling

The Payment Vendor sends a `payment_success` webhook. The Ingestion Service captures this, logs the transaction status as `PAID`, and writes a `PROCESS_PDF` task into an append-only database outbox table within a single local transaction.

### 2. Domain-Isolated Message Queueing

A transaction log tailer polls the outbox table and streams the full data payload (all text primitives + logo asset URLs) directly into domain-specific message queues (e.g., `invoice-queue`, `order-queue`).

### 3. Stateless PDF Generation

An autoscaling pool of stateless workers consumes messages from the queues. Workers read the raw data payload directly from the message (&lt;1mb), compile the layout using an HTML-to-PDF template engine, and output the compressed binary.

### 4. Object Storage Upload & Lifecycle Policy

The worker streams the generated PDF binary directly to an Object Storage bucket (e.g., Amazon S3). The bucket is configured with a strict **7-day expiration lifecycle policy** to handle automatic data purging.

### 5. Cryptographic Link Tokenization & Email Delivery

The worker generates an **S3 Presigned URL** valid for 7 days. This URL is injected into the email template and passed to an asynchronous Notification Service to handle the final email dispatch.

## Component Deep Dive & Trade-offs

|**Component**|**Design Choice**|**Operational Advantage**|**Trade-off / Mitigation**|
|---|---|---|---|
|**Data Ingestion**|Payload-Driven Queue Messages|Eliminates database lookups; workers receive everything they need inside the message broker payload.|Slightly larger message size (~100 KB), easily handled by modern brokers like Kafka/RabbitMQ.|
|**Worker Processing**|Native HTML Engines + Idempotency Flags|Processing drops from 2s to &lt;30ms compared to heavy headless browsers. Database status flags prevent duplicate renders during retries.|HTML layouts must be strictly structured to ensure exact A4 page-boundary compilation.|
|**File Storage**|Standard Object Storage (S3)|Highly scalable, built-in high-availability, and native data purging via Lifecycle Policies.|Requires a structured naming convention (`/invoices/YYYY-MM-DD/id.pdf`) to optimize S3 partitioning.|
|**Link Security**|Stateless S3 Presigned URLs|Offloads 100% of download bandwidth and auth compute from our internal servers directly to the cloud provider.|Hard ceiling on expiration modification once the email is sent; links cannot easily be manually revoked early.|

## Failure Modes & Resiliency Strategy

- **Sudden Ingestion Crash:** If an ingestion instance dies mid-transaction, the payment vendor's native retry policy will hit a sibling instance via the Load Balancer. The system checks the database status flag to guarantee a task is never double-queued (idempotency).
- **Poison Pill Messages:** If a corrupted layout payload causes a worker thread to crash repeatedly, the message is automatically moved to a **Dead Letter Queue (DLQ)** after 3 failed retries to avoid blocking the main processing pipeline.
- **Email Delivery Failure:** If the third-party email provider experiences a network drop, the Notification Service retries the event. The worker first checks if the PDF file already exists in S3; if it does, it skips regeneration entirely and goes straight to generating the presigned link.

---

## Bottlenecks & Cost

### The S3 Write Tax

AWS S3 charges 0.005 USD per 1,000 PUT requests. At 1,000 PDFs/second, that is 86.4 million PUT requests a day.

(86,400,000 / 1,000) × 0.005 = 432 USD per day just in S3 write API calls. That is approximately 13,000 USD a month completely wasted on writing temporary 7-day invoices to disk.

Do not generate and store the PDF for S3 immediately. Instead, stream the lightweight HTML data primitives directly to the Email Service Provider (like SendGrid/SES) which compiles the email layout on their dime. The "7-day public link" in the email points to a lazy-loading API gateway. Only if a user actually clicks that public link do we dynamically compile the PDF in 30ms and stream it to them. Because less than 10% of users actually click the public link, you instantly slash your cloud storage and API bill by 90%.

### The CPU Autoscaling Trap

If your downstream Email Service Provider starts throttling your requests, your workers will stall while waiting for network I/O. Their CPU usage will actually drop to near zero because they are just waiting on sockets. Kubernetes will see low CPU and start killing your workers, making the queue backup even worse.

Scale the worker pods based on Queue Lag (Message Backlog), not CPU or memory. If the queue size grows, spin up pods instantly, regardless of what the CPU is doing.

### The Upstream Schema Drift Problem

At 1,000 requests/second, you aren't the only engineer touching the system. The checkout team, the localization team, and the marketing team are all modifying the upstream data structures. If a developer on the checkout team renames a database column from `invoice_amount` to `total_price`, your stateless PDF worker will instantly start spitting out broken or blank PDFs at a rate of 1,000 failed jobs per second.

Use a Schema Registry (like Confluent Schema Registry using Apache Avro or Protobuf) onto message broker. The queue payload is strictly typed and versioned. If an upstream team tries to deploy a breaking change to the payment payload, the CI/CD pipeline or the schema registry will reject the event at the broker gate, protecting your production rendering engine from human error.

---

## Improvement

### Dropping S3 to Save Cost ("Just use email storage")

Attach the PDF directly to the email so it's in their inbox forever. For the 7-day public link, we don't store anything

### Headless Browsers

At 1,000 requests/second, spinning up Chromium tabs (Puppeteer/Playwright) will crash your servers due to memory leaks. 

We are absolutely not using a headless browser like Puppeteer or Chromium at 1,000 requests/second. Managing browser contexts, tabs, and memory leaks at this scale is an operational nightmare. Instead, we are using a native, low-level binary compiled engine (like a Go-based PDF generator or a lightweight C++ HTML-to-PDF library). These don't boot up a browser; they parse HTML/CSS primitives directly into raw PDF byte streams in-memory, keeping CPU and memory usage flat.
