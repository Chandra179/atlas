---
title: "Data Ingestion Pipeline"
aliases: []
tags: [architecture, data-pipeline, ingestion]
created: "2026-06-28"
---

This document covers how raw data moves from external sources into the pipeline — collection strategies, queue design, error handling, and durability guarantees. Use it to choose the right ingestion approach for your data sources and reliability requirements.

## Data Collection

The system extracts data from multiple sources — news, YouTube, APIs, audio, files, events — and stores raw data and metadata into a database.

## Cron Job & Batching

A configurable cron job runs every `n` minutes to pull data from the database. Supports:

- **One cron per instance** for simple workloads.
- **Multiple crons per single instance** for different topics or collections (e.g., Collection A, Collection B).

The cron batches data and passes lightweight messages `{ ID, flag }` into a priority queue. A downstream processor listens to this queue.

## CDC (Change Data Capture)

The cron-polling approach can be replaced with CDC to decouple ingestion. Using Debezium, Postgres WAL replication, or similar:

- The database stays lean — no recurring `SELECT` queries.
- The pipeline becomes truly event-driven: the moment new data hits the DB, it triggers a message in the queue.
- Kafka / Redpanda / RabbitMQ as the transport.

## Priority Queue

Messages are lightweight (ID + flag). The queue supports:

- Multiple priority levels for time-sensitive vs bulk data.
- Batching for efficient downstream processing.

## Error Handling

- **Retry mechanism** for failed tasks, with priority escalation.
- **Dead Letter Queue (DLQ)**: planned for messages that exhaust retries.
- **Future formats**: currently processes data into vector format; designed to accommodate Knowledge Graph or other formats later.

When a malformed record reaches the worker — a video whose API response lacks the expected fields — the worker retries with escalating priority. After three retries, the message moves to the DLQ for manual inspection. Without this, a single bad record blocks the queue for that partition, starving subsequent valid records.

## Message Durability

- Explicit acknowledgement (ack) only after successful processing.
- Backup via global remote replicas or Amazon S3.

When a worker crashes mid-processing, the message remains in the queue with no ack sent. Another worker picks it up once the visibility timeout expires. If the crash was caused by a transient infrastructure issue, the retry succeeds. If the same record repeatedly fails, it eventually lands in the DLQ rather than being lost entirely.
