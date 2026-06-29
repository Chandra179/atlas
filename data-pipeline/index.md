---
title: "Data Pipeline Architecture"
aliases: []
tags: [architecture, data-pipeline, ingestion]
created: "2026-06-28"
---

# Data Pipeline Architecture

A universal data ingestion and processing pipeline. Not RAG-specific — the same patterns apply to any system that ingests raw data, processes it through a state machine, and serves it via search or inference.

## Pipeline Stages

```mermaid
flowchart TD
    S["Source Data<br/>(news, YouTube, APIs, audio, files, events)"] --> I["Ingestion<br/>(cron poll or CDC trigger — Debezium, WAL, Kafka)"]
    I --> Q["Priority Queue<br/>(lightweight messages {ID, flag})"]
    Q --> W["Worker<br/>(claim via optimistic lock → process → acknowledge)"]
    W --> VS["Vector Store<br/>(embeddings for semantic search)"]
    W --> KG["Knowledge Graph<br/>(future)"]
    W --> RD["Relational DB<br/>(structured records)"]
    VS --> R["Retrieval<br/>(hybrid search — dense + sparse → rerank)"]
    KG --> R
    RD --> R
    R --> CH["Cache hit → return cached result"]
    R --> CM["Cache miss → full pipeline → populate cache"]
    style S fill:#f0f0f0,stroke:#666
    style I fill:#e3f2fd,stroke:#1565c0
    style Q fill:#fff3e0,stroke:#e65100
    style W fill:#e8f5e9,stroke:#2e7d32
    style R fill:#f3e5f5,stroke:#6a1b9a
```

## System Constraints

- **Scale**: Monitor queue depth, processing time per request, traffic (req/s) vs CPU.
- **Durability**: Acknowledge/delete messages only after successful processing. Backup: global remote replicas or S3.
- **Idempotency**: Version-based optimistic locking prevents duplicate processing from at-least-once delivery.

## Files

| File | Domain |
|------|--------|
| [ingestion.md](./ingestion.md) | Data collection, cron vs CDC, priority queue, error handling, DLQ |
| [idempotency.md](./idempotency.md) | Optimistic locking, version-based state machine, worker claim flow |
| [retrieval.md](./retrieval.md) | Hybrid search, sparse/dense vectors, reranking, evaluation loop |
| [infrastructure.md](./infrastructure.md) | Semantic caching, billion-row scaling, partitioning, hot state offload |
