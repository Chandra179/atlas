---
title: "Retrieval Strategy"
aliases: []
tags: [architecture, data-pipeline, retrieval]
created: "2026-06-28"
---

This document covers how the pipeline fetches relevant data in response to a query — hybrid search, reranking, and the evaluation loop. Use it to understand the trade-offs between speed, accuracy, and cost across query types.

## Metadata Filtering

Organize data by tags and topics. Chunking logic is strict:

- Check header levels for section hierarchy.
- Track section inheritance.
- Enforce text overlap boundaries between chunks.

## Configurable Embedding Space

The choice of embedding model determines the data points and vector space. The vector calculation algorithm itself should be configurable — not hardcoded to a single model.

## Hybrid Search

Combines sparse and dense vectors for robust retrieval:

| Leg | Method | Strength |
|-----|--------|----------|
| Dense | ANN (e.g., HNSW, IVF) | Semantic similarity |
| Sparse | BM25 or SPLADE | Keyword precision |

**RRF (Reciprocal Rank Fusion)** merges results: `score = 1/(k + dense_rank) + 1/(k + bm25_rank)`.

## Reranking

A cross-encoder re-ranks candidates for maximum context relevance:

- **Oversample**: fetch `topK × candidate_mul` candidates before reranking.
- **Score deeply**: cross-encoder scores each candidate against the query.
- **Emit top-K**: the final list is semantically tight.

## Evaluation Loop

Test systematically across query types:

| Query Type | Best Strategy |
|------------|---------------|
| Simple/keyword ("What is our policy on X?") | Vanilla vector search or pure BM25 — reranking adds latency |
| Complex/conceptual ("How does strategy X compare to Y?") | Hybrid search + reranking — forces disparate chunk correlation |

**Frameworks**: Ragas, TruLens for automated metrics (Context Precision, Context Recall, Faithfulness).
