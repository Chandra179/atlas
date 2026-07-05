# RAG

Documents flow through a RAG pipeline in eight stages: ingest, chunk, embed, retrieve, generate, evaluate, test, monitor. Six are implemented; test coverage is minimal; monitor is scaffolded but broken.

## Architecture

```
POST /ingest → Ingest → Pipeline (chunk → embed → upsert)
POST /search → Search → [Semantic Cache] → Hybrid Search → Reranker → [Generator]
GET  /healthz → 200
```

## Ingestion

Walks source directories, skips unchanged files via SHA-256 dedup, dispatches changed files to concurrent workers. Upserts use deterministic chunk IDs (same input → same point ID, no duplicates).

Contextual embedding: each chunk is prefixed with its file path and heading before embedding, anchoring chunk semantics to document structure without altering stored text.

Qdrant collections are auto-configured with dense vectors (Cosine), sparse vectors (IDF), full-text index on text, and keyword index on file_path.

## Chunking

Two strategies selected by config:

1. **Recursive** — extracts by heading, then paragraph, then sentence, then word. TOC heuristic drops chunks that are mostly page numbers.
2. **Sentence Window** — indexes at sentence granularity with configurable surrounding context window.

## Embedding & Storage

Ollama embedder (`nomic-embed-text`, 768-d) via `/api/embed`. Qdrant stores dense + sparse vectors with payload metadata (header, file_path, line_start, text, source_sha).

## Retrieval

```
Query → Semantic Cache (hit → return cached)
  → Hybrid Search
    ├── Dense: Qdrant ANN
    └── Sparse: BM25 → SPLADE rescore
    └── RRF fusion
  → Cross-encoder Reranker
  → Results
```

**Semantic Cache:** dedicated Qdrant collection keyed by query embedding cosine similarity. Returns cached result on hit (generate=false only). Async write-back on miss.

**Hybrid Search:** fuses dense ANN and BM25 legs via RRF. Multi-fragment queries split on sentence boundaries, run per fragment, dedup, re-sort.

**Payload Filtering:** AND-based filter on file_path, header, source_sha.

**Reranker:** cross-encoder sidecar re-scores candidates using window text context.

## Generator

Streams grounded answers via Ollama `/api/chat`. Uses "Lost in the Middle" chunk ordering (best at ends, worst in middle). Token budget ~70% of context window. Inline citation as `[1]`, `[2]`, etc.

## Evaluate

Two modes driven by golden set YAML:

- **Retrieval eval** — scores ranked lists (Recall@k, Precision, MRR, MAP, NDCG) with bootstrap CIs.
- **RAG eval** — RAGAS metrics (Faithfulness, Answer Relevance, Context Precision, Context Recall) via Ollama judge.

Results saved as timestamped JSON to `results/`.

## Domain Packages

| Package | Role |
|---------|------|
| `chunker/` | Chunking strategies |
| `embedder/` | Embedding interface + Ollama implementation |
| `store/` | Vector store interface + Qdrant implementation |
| `ingest/` | File walking, dedup, processing pipeline |
| `search/` | Multi-fragment hybrid search + reranking |
| `generator/` | LLM prompt building + streaming |
| `reranker/` | Cross-encoder client |
| `cache/` | Semantic cache |

## Sidecars

- **reranker** (`:5002`) — cross-encoder re-scoring
- **docling** — PDF-to-markdown conversion

Both have their own Dockerfiles under `services/`.
