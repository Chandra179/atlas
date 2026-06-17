---
title: "RAG"
aliases: []
tags: [rag]
created: "2026-06-13"
---

# RAG

Documents flow through a RAG pipeline: ingest, chunk, embed, retrieve, generate, evaluate, test, monitor.

## Ingestion

Docling processes Markdown and produces clean Markdown output.

* Hash Tracking compares file SHAs so only new or modified files are processed.
* Modified files are deleted and re-ingested. Deterministic UUIDs prevent duplicate entries.
* Qdrant collections, distance metrics, and indices (Full-Text & Keyword) are auto-configured on startup.

`IngestService` reads every file, checks its SHA against the Qdrant index in a single paginated scroll, then dispatches changed files to 8 concurrent workers for pipeline processing — fetch, chunk, embed, store.

**Contextual Embedding:** Before embedding, each chunk is prefixed with `filePath > header\n` (Anthropic 2024). This anchors chunk semantics to document structure, improving dense retrieval accuracy without changing stored text.

***

## Chunking Strategies

Two chunking strategies are available:

1. **Recursive** — extracts sections by heading, then splits oversized sections by paragraph, then by sentence, preserving overlap between adjacent chunks.
2. **Sentence Window** — indexes at sentence granularity but stores a surrounding window as retrieval context

**Chunk sizes:** 128, 256, or 512 tokens (configurable). **Chunk overlap:** configurable.

***

## Embedding & Storage

The system uses both sparse and dense vectors for RRF fusion. Dimensions are configurable.

```yaml
embedder:
  provider: "ollama"
  model: "nomic-embed-text"
  ollama_addr: "http://localhost:11434"
  dimensions: 768
  
sparse_scorer:
  provider: "prithivida/Splade_PP_en_v1"
  addr: "http://localhost:5001"
```

Qdrant stores sparse and dense vectors alongside payload metadata. A typical payload:

```json
{
  "header": "1.3 Weighted A* Search",
  "window_text": "",
  "file_path": "week 3 informed search and heuristic function.md",
  "line_start": 122,
  "chunk_index": 2,
  "source_sha": "b2f71659eee1eb2a3a377ecc1327bd9ead16552ec6c8cc101f040d187e8b8e6d",
  "text": "finds a solution in [ C ∗ , WC ∗ ], but usually closer to C ∗ .\nTo modify A* algorithm to Weighted A*, just change line 14 in Algorithm 2 to Equation 3."
}
```

**Indexing**

* **Text indexing** — full-text index on the `text` field for BM25 hybrid search
* **Keyword indexing** — `file_path` payload field eliminates full-collection scans

***

## Retrieval

```
Query
  │
  ▼
Semantic Cache ──── hit (score ≥ threshold) ──► return cached result
  │ miss
  ▼
Query Transformation (HyDE) [Optional]
  └── LLM generates hypothetical doc → embed → avg vector
  │
  ▼
Hybrid Search
  ├── Dense: Qdrant ANN (nomic-embed-text vec)
  └── Sparse: SPLADE or TF fallback
        └── RRF fusion (k=60): score = Σ 1/(60 + rank)
  │
  ▼
Reranker
  └── cross-encoder/ms-marco-MiniLM-L-6-v2
  │
  ▼
Results: []{ file_path, header, line_start, score, text }
```

### Semantic Cache

Caches search results keyed by query embedding similarity. A query hitting the cache at score >= threshold returns the cached result directly, skipping embedder + store + reranker round-trips. Example vector:

```json
{
  "cached_at": "2026-04-26T15:23:38Z",
  "results_json": "{Variants\",\"LineStart\":327,\"ChunkIndex\":0,\"Vector\":null,\"SparseIndices\":null}",
  "query": "In Monte Carlo Tree Search, how do we calculate UCB?"
}
```

On a cache hit (top-1 score ≥ threshold), the cached result is returned immediately. On a miss, the full pipeline runs and the result is written to cache asynchronously.

* Set TTL
* Threshold:
  * `0.85–0.90`: high recall, allows paraphrased queries
  * `0.90–0.95`: balanced (default `0.90`)
  * `>0.95`: near-identical only

### Query Transformation (HyDE)

Given a query like "How do I install Python?", HyDE asks an LLM to write a hypothetical document answering it, embeds that document, and uses the embedding for search — closer to the target than the raw query. Three variants exist:

Ref: "Precise Zero-Shot Dense Retrieval without Relevance Labels" (Gao et al., ACL 2023).

### Hybrid Search

Hybrid search fetches dense and text-filtered candidates, reranks the sparse leg client-side, then fuses via RRF.

**Server-side**

Server-side hybrid search offloads the heavy lifting to Qdrant, reducing network latency and memory. A single round-trip executes both dense and sparse queries.

* Qdrant native RRF
* Dense search via vector similarity (Bi-Encoder)
* Sparse vector index (Inverted Index)
* Only final Top-K results sent to the app

**Client-side**

Client-side hybrid search gives full control over each stage — for instance, using BM25 search with a SPLADE scorer before fusing results. This adds latency and "noise" from extra data transfer and manual sorting, but allows fine-tuning relevance in niche domains.

### Payload Filtering

All search methods (Hybrid, Dense, and Keyword) support strict pre-filtering, guaranteeing that similarity scores are calculated only against relevant documents. Filters:

* `file_path` — restrict searches to a specific file
* `header` — restrict searches to a specific section or markdown header
* `source_sha` — restrict searches to a specific document version

### Reranking

A high-precision cross-encoder re-ranks the candidates from vector search.

* **Oversampling** — the retrieval stage fetches 10x the requested candidates so the reranker has enough high-quality options
* **Contextual Scoring** — the system passes the Window Text (chunk plus surrounding context) to a Cross-Encoder
* **Final Sorting** — candidates are re-scored by deep semantic relevance and sorted, promoting the best matches to the top for the LLM

***

## Post-Retrieval Filtering

After reranking, an optional LLM chunk filter drops irrelevant results before generation. Ref: arxiv 2410.19572 (+10pp PopQA accuracy).

* Batches all retrieved chunks into one prompt, asks model to score each 0–1
* Drops chunks below configurable threshold (default 0.5)
* Order of surviving chunks is preserved
* Falls through on LLM error (returns all chunks rather than drop everything)

```yaml
chunk_filter:
  enabled: false
  model: "gemma3:1b"
  threshold: 0.5
```

***

## Generator

`OllamaGenerator` streams an answer grounded in retrieved chunks via Ollama `/api/chat`.

**Prompt construction:**

* Chunks reordered using "Lost in the Middle" principle (Liu et al. 2023): highest-scored chunk at position \[1], lowest in middle, second-highest at end — reduces LLM degradation on long context
* Token budget enforced by truncating chunks (rough estimate: 1 token ≈ 4 chars, default 2800 tokens ≈ 70% of 4k context)
* System prompt requires citation inline as `[1]`, `[2]`, etc.

**Usage:** POST `/search` with `"generate": true`. Response is `text/plain` chunked transfer encoding (streaming).

```yaml
generator:
  enabled: true
  model: "phi4-mini:latest"
  max_context_tokens: 2800
```

***

## HyDE Variants

Three variants:

**Standard HyDE** — generates N hypothetical documents in parallel, averages their L2-normalized embeddings, runs hybrid search with averaged vector.

**Adaptive HyDE** — runs vanilla hybrid search first; fires HyDE only when top-1 cosine score < threshold (default 0.50). Ref: arxiv 2507.16754. Skip LLM cost when dense retrieval is already confident.

**Multi-HyDE** — cycles through 5 diverse prompt templates (factual passage, key facts, expert explanation, contextual definition, example-driven) round-robin per document generation. Maximizes embedding diversity. Ref: arxiv 2509.16369. Use with `num_docs >= 3` for benefit.

```yaml
hyde:
  enabled: true
  adaptive: true
  adaptive_thresh: 0.50
  multi_hyde: false
  model: "gemma3:1b"
  num_docs: 1
```
