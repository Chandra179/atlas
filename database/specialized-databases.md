---
title: "Specialized Databases"
aliases: []
tags: [database, database/specialized]
created: "2026-06-13"
---

# Specialized Databases

## Vector Databases

Vector databases are optimized for storing and querying **embeddings** dense vector representations of data (text, images, audio). They enable **approximate nearest neighbor (ANN)** search for AI/ML applications.

### Core Algorithm: ANN Search

Exact nearest neighbor search is O(n*d) too slow for millions of vectors. ANN sacrifices a small amount of accuracy for massive speed gains:

| Algorithm | Type | Build Time | Search Time | Memory | Accuracy |
|---|---|---|---|---|---|
| **HNSW** | Hierarchical navigable small world graph | O(n log n) | O(log n) | O(n) | 95-99% |
| **IVF** | Inverted file index | O(n) | O(sqrt(n)) | O(n) | 90-95% |
| **IVF + PQ** | IVF with product quantization | O(n) | O(sqrt(n)) | Compressed | 85-95% |
| **DiskANN** | Vamana graph on disk | O(n log n) | O(log n) | 10GB/TB on disk | 95-99% |

**HNSW**: The most popular algorithm. Builds a multi-layer graph:
- Layer 0: All vectors (dense connections)
- Layer 1: Random subset (sparser)
- Higher layers: Progressively sparser
- Search traverses from top layer down, refining at each level

### Database Comparison

| Database | Algorithm | Cloud-Native | Features |
|---|---|---|---|
| **pgvector** (PostgreSQL extension) | IVFFlat, HNSW | Yes (via RDS) | SQL interface, ACID, 2000 dims max |
| **Pinecone** | Custom (HNSW-based) | Yes (SaaS) | Serverless, metadata filtering, namespaces |
| **Milvus** | HNSW, IVF, DiskANN | Yes (K8s) | Multi-modal, hybrid search, GPU acceleration |
| **Weaviate** | Custom (HNSW-based) | Yes (K8s) | GraphQL, hybrid search, modules |
| **Qdrant** | Custom (HNSW-based) | Yes (SaaS, self-hosted) | Payload filtering, snapshots |

**Use cases**: RAG (Retrieval-Augmented Generation), semantic search, recommendation systems, anomaly detection, image similarity.

### Key Metrics

| Metric | Description |
|---|---|
| **Recall** | Fraction of true nearest neighbors found |
| **QPS** | Queries per second |
| **Indexing time** | Time to build the index |
| **Memory usage** | RAM needed to serve queries |

## Search Engines

Search engines provide full-text search with relevance scoring, faceted aggregation, and near-real-time indexing.

### Inverted Index

The core data structure for full-text search:

```
Document 1: "the quick brown fox"
Document 2: "the lazy dog"
Document 3: "quick fox jumps"

Inverted Index:
brown → {1}
dog → {2}
fox → {1, 3}
jumps → {3}
lazy → {2}
quick → {1, 3}
the → {1, 2}
```

Behind the scenes: Term dictionary → posting list (document IDs + positions + offsets). Compressed using delta encoding, bit packing, and skip lists.

## Embedded Databases

Embedded databases run in-process with the application (no separate server). They sacrifice scalability for simplicity and speed.

## Streaming Databases

Streaming databases process **real-time data streams** with SQL semantics.

| Database | Model | Storage | Consistency |
|---|---|---|---|
| **Materialize** | SQL materialized views | Persistent (Kafka-backed) | Eventually consistent |
| **RisingWave** | SQL streaming, ETL | Object storage (S3) | Exactly-once |
| **ksqlDB** | Kafka-native streaming | Kafka topics | Exactly-once |

**Key concept**: A materialized view that is continuously updated as new data arrives, rather than recomputed on query.

## Time-Series Databases

While time-series is covered in the taxonomy, key implementation details:

| Database | Storage Engine | Compression | Query Language |
|---|---|---|---|
| **InfluxDB** | TSM (Time-Structured Merge Tree) | 10-100x (float64 → XOR, timestamps → delta-of-delta) | Flux, InfluxQL |
| **TimescaleDB** | PostgreSQL (hypertables) | Native compression (per chunk) | SQL |
| **VictoriaMetrics** | LSM with custom merge | 10-100x (integer delta, string dictionary) | PromQL, MetricsQL |

**InfluxDB TSM**: An LSM-tree variant optimized for time-series:
- WAL for recent writes
- MemTable (in-memory, sorted by time + tag)
- Flush to TSM files (compressed, read-only)
- Merge / compaction

**TimescaleDB hypertables**: Automatic partitioning by time into chunks. SQL interface with full PostgreSQL compatibility.

| Feature | InfluxDB | TimescaleDB | VictoriaMetrics |
|---|---|---|---|
| SQL? | No (Flux) | Yes (PostgreSQL) | No (PromQL) |
| Joins | Limited | Full SQL joins | None |
| High-availability | InfluxDB Clustered | Patroni, streaming rep | VictoriaMetrics cluster |
| Compression ratio | 10x-100x | 6x-10x | 10x-100x |
