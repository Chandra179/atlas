---
title: "RAG"
aliases: []
tags: [rag]
created: "2026-06-13"
---

# RAG

Documents flow through a RAG pipeline in eight stages. Five are implemented (ingest, chunk, embed, retrieve, generate); three are scaffolded or unbuilt (evaluate, test, monitor). This note documents the `nadir` implementation as of `main` — config defaults, exact mechanics, and where the code has gaps.

> **Before reading:** `nadir` is a separate Go repo (github.com/Chandra179/nadir); this vault note documents it. Retrieval-quality concepts (recall@k, MRR, NDCG, faithfulness, LLM-as-judge) live in `ai/evaluation.md`.

## Ingestion

`IngestService.Run` lists markdown files, diffs their SHAs against the store in a single paginated scroll (`GetAllFileSHAs`, page size 1000), and dispatches changed files to 8 concurrent workers (`const ingestWorkers = 8`). Unchanged files are skipped; changed files are upserted in place by deterministic point ID.

Docling converts PDF to Markdown (`pdfs/raw` → `pdfs/converted`); the recursive chunker separately strips Docling's HTML-comment artifacts.

* **Deterministic IDs** — `chunkID(filePath, lineStart, chunkIndex)` = UUIDv5 (`uuid.NewSHA1` over a private namespace). Same input always maps to the same point, so upserts replace rather than duplicate.
* **Contextual embedding** — before embedding, each chunk is prefixed with `filePath > header\n` (Anthropic 2024). This anchors chunk semantics to document structure without altering stored text.
* **Qdrant collections** — auto-configured on startup: dense vectors with Cosine distance, a named sparse vector with IDF modifier, a full-text index on `text`, and a keyword index on `file_path`.

***

## Chunking

Two chunkers, selected by `chunker.provider`:

1. **Recursive** (`recursive`, default) — extracts sections by heading, then splits oversized sections by paragraph, then by sentence, then by word. Separators in order: `\n\n`, `\n`, `. `, ` `. A TOC heuristic drops chunks whose lines are mostly bare page numbers (threshold 0.6).
2. **Sentence Window** (`sentence-window`) — indexes at sentence granularity but stores a surrounding window (default 3 sentences before and after) as retrieval context.

**Chunk size is measured in UTF-8 runes, not tokens.** Default `chunk_size: 512`, `chunk_overlap: 64` (both any positive integer, unconstrained). The 4-chars/token estimate is applied only later, at generator prompt truncation.

***

## Embedding & Storage

`OllamaEmbedder` calls Ollama `/api/embed` with `nomic-embed-text` (768 dimensions). Sparse scoring has two providers: `tf` (zero-dependency fallback) and `splade` (calls the SPLADE sidecar, model `prithivida/Splade_PP_en_v1`).

```yaml
embedder:
  provider: "ollama"
  model: "nomic-embed-text"
  ollama_addr: "http://localhost:11434"
  dimensions: 768

sparse_scorer:
  provider: "splade"   # "tf" (zero deps) | "splade" (requires sidecar)
  addr: "http://localhost:5001"
```

Qdrant stores dense (and, when a sparse embedder is wired, sparse) vectors alongside payload metadata:

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

**Distance metric:** Cosine, exclusively (dense collection and semantic cache).

**Server-side vs client-side hybrid.** The store supports both, selected at query time:
* **Client-side (active)** — dense `Search` + BM25 `Scroll` + client SPLADE rescore + manual RRF. This is the only path wired in `server.go` today.
* **Server-side (exists, not wired)** — `QueryPoints` with dense+sparse prefetch legs and Qdrant-native `Fusion_RRF` in a single round-trip. Gated on `store.WithSparseEmbedder(...)`, which `server.go` never calls, so sparse vectors are never stored at ingest and this branch is unreachable in the current build.

***

## Retrieval

```
Query
  │
  ▼
Semantic Cache ──── hit (score ≥ threshold, generate=false) ──► return cached result
  │ miss
  ▼
Query Transformation (HyDE) [Optional]
  └── LLM generates hypothetical doc → embed → avg vector
  │
  ▼
Hybrid Search  (client-side, active)
  ├── Dense: Qdrant ANN (nomic-embed-text vec)
  └── Sparse: BM25 Scroll → SPLADE rescore
         └── RRF fusion (k=60): score = 1/(60+denseRnk) + 1/(60+bm25Rnk)
  │
  ▼
Reranker
  └── cross-encoder/ms-marco-MiniLM-L-6-v2 (sidecar :5002)
  │
  ▼
Results: []{ file_path, header, line_start, score, text }
```

### Semantic Cache

A dedicated Qdrant collection (`pkb_cache`) caches results keyed by query-embedding similarity. On a hit (top-1 cosine ≥ threshold) the cached result returns immediately, skipping embedder, store, and reranker. The cache hit path runs **only when `generate=false`** — generation requests always run the full pipeline. On a miss, the pipeline runs and the result is written to cache asynchronously.

```json
{
  "cached_at": "2026-04-26T15:23:38Z",
  "results_json": "{Variants\",\"LineStart\":327,\"ChunkIndex\":0,\"Vector\":null,\"SparseIndices\":null}",
  "query": "In Monte Carlo Tree Search, how do we calculate UCB?"
}
```

* **TTL** — default 24h; `0` disables expiry.
* **Threshold** (cosine):
  * `0.85–0.90`: high recall, allows paraphrased queries
  * `0.90–0.95`: balanced (default `0.90`)
  * `>0.95`: near-identical only

### Query Transformation (HyDE)

Given a query like "How do I install Python?", HyDE asks an LLM to write a hypothetical document answering it, embeds that document, and searches with the embedding — closer to the target than the raw query. Three variants exist (see §HyDE Variants). Ref: Gao et al., ACL 2023.

### Hybrid Search

Hybrid search fuses a dense leg and a sparse (BM25) leg. The client-side path fetches `topK × prefetch_mul` (default ×5) candidates per leg, rescores the sparse leg with the configured sparse scorer, then fuses via RRF (k=60). The server-side path (see Embedding & Storage) does the same in one Qdrant round-trip but is not currently wired.

### Payload Filtering

`HybridSearch` and `KeywordSearch` accept a `*SearchFilter` whose non-empty fields are ANDed:
* `file_path` — restrict to a specific file
* `header` — restrict to a specific section
* `source_sha` — restrict to a specific document version

Standalone dense `Search(ctx, vector, topK)` takes **no filter** — only the hybrid and keyword paths pre-filter. (The dense leg *inside* hybrid does apply the filter.)

### Reranking

A cross-encoder re-ranks candidates from vector search using the chunk's Window Text.
* **Oversampling** — the retrieval stage fetches `topK × candidate_mul` candidates (default `candidate_mul: 2`; code fallback 3) so the reranker has high-quality options. The store-level hybrid prefetch is separate: ×5 per leg.
* **Contextual scoring** — the Window Text (chunk plus surrounding context) is passed to the cross-encoder.
* **Final sorting** — candidates are re-scored by deep semantic relevance and sorted, promoting the best matches to the top for the LLM.

***

## Post-Retrieval Filtering

After reranking, an optional LLM chunk filter drops irrelevant results before generation. Ref: arxiv 2410.19572 (+10pp PopQA accuracy).

* Batches all retrieved chunks into one prompt; the model scores each 0–1.
* Drops chunks below the configurable threshold (default 0.5).
* Order of surviving chunks is preserved.
* On LLM error, falls through and returns all chunks rather than drop everything.

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
* **Lost in the Middle** ordering (Liu et al. 2023) — highest-scored chunk at position `[1]`, lowest in the middle, second-highest at the end. Reduces LLM degradation on long context.
* **Token budget** — chunks truncated at roughly 1 token ≈ 4 chars; default `max_context_tokens: 2800` (~70% of a 4k context window).
* **Citation** — the prompt instructs the model to cite inline as `[1]`, `[2]`, etc. This instruction lives in a single `user`-role message; no separate `system` message is sent.

**Usage:** `POST /search` with `"generate": true`. Response is `text/plain` with chunked transfer encoding (streaming).

```yaml
generator:
  enabled: true
  model: "gemma3:1b"
  max_context_tokens: 2800
```

***

## HyDE Variants

Three variants, all off by default (`hyde.enabled: false`):

**Standard HyDE** — generates N hypothetical documents in parallel, averages their L2-normalized embeddings, runs hybrid search with the averaged vector.

**Adaptive HyDE** — runs vanilla hybrid search first; fires HyDE only when top-1 cosine score < threshold (default 0.50). Skips LLM cost when dense retrieval is already confident. Ref: arxiv 2507.16754.

**Multi-HyDE** — cycles through 5 diverse prompt templates (factual passage, key facts, expert explanation, contextual definition, example-driven) round-robin per document. Maximizes embedding diversity. Ref: arxiv 2509.16369. Use with `num_docs >= 3`.

```yaml
hyde:
  enabled: false
  adaptive: true
  adaptive_thresh: 0.50
  multi_hyde: false
  model: "gemma3:1b"
  num_docs: 1
```

***

## Evaluate

> **Status: not implemented.**

No evaluation package exists in `nadir`. There is no retrieval-quality harness (recall@k, MRR, NDCG), no faithfulness/groundedness judge, no eval dataset loader, and no eval CLI. `.env.example` contains orphaned `EVAL_*` variables that `config.go` never reads, and `AGENTS.md`'s claim that "eval tests pull qdrant/qdrant:latest" is stale (no testcontainers dependency, no eval tests).

For the conceptual basis an evaluator would need — perplexity, BLEU/ROUGE/METEOR/BERTScore, LLM-as-judge, benchmarks — see `ai/evaluation.md`.

***

## Test

> **Status: minimal (unit tests only).**

* `make test` — `go test -short -count=1 ./...`
* `make test-all` — `go test -count=1 ./...`

Two test files cover two units:
* `internal/pkb/file_lister_local_test.go` — glob ignore-pattern matching.
* `internal/pkb/hyde_test.go` — HyDE vector ops (`averageVectors`, `l2Normalize`).

No chunker tests, no integration tests, no k6 load scripts (the `k6` repo topic is aspirational).

***

## Monitor

> **Status: scaffolded, broken on `main`.**

* `docker-compose.yml` defines `prometheus` and `node-exporter` but **not** `grafana` or `k6`.
* `scripts/dev-local.sh` runs `docker compose up ... grafana` — referencing a service the compose file does not define, so `make dev` errors on that line.
* The compose file mounts `./config/prometheus.yml` and `./config/recording_rules.yml`, but neither file exists in `config/` (only `config.go` and `config.yaml`); Prometheus would fail to start as committed.
* The Go app exposes **no `/metrics` endpoint** — only `POST /search`, `POST /ingest`, `GET /healthz`. OpenTelemetry metric SDK packages are indirect dependencies (via the logger) and unused for app metrics.

***

## Config Reference

Defaults from `config/config.yaml`; env overrides from `config/config.go:applyEnv`.

| Section | Field | Default | Env override |
|---|---|---|---|
| `http` | `addr` | `:8080` | — |
| `knowledge_base` | `path` | `gitbook` | `NOTES_PATH` |
| `qdrant` | `addr` | `localhost:6334` | `QDRANT_ADDR` |
| `qdrant` | `collection` | `pkb_chunks` | `QDRANT_COLLECTION` |
| `qdrant` | `top_k` | `5` | — |
| `qdrant` | `prefetch_mul` | `5` | — |
| `embedder` | `model` | `nomic-embed-text` | — |
| `embedder` | `ollama_addr` | `http://localhost:11434` | `OLLAMA_ADDR` |
| `embedder` | `dimensions` | `768` | — |
| `embedder` | `api_key` | — | `EMBEDDER_API_KEY` |
| `chunker` | `provider` | `recursive` | — |
| `chunker` | `chunk_size` | `512` (runes) | — |
| `chunker` | `chunk_overlap` | `64` | — |
| `chunker` | `window_size` | `3` | — |
| `sparse_scorer` | `provider` | `splade` | — |
| `sparse_scorer` | `addr` | `http://localhost:5001` | `SPLADE_ADDR` |
| `reranker` | `enabled` | `true` | `RERANKER_ENABLED` |
| `reranker` | `addr` | `http://localhost:5002` | `RERANKER_ADDR` |
| `reranker` | `candidate_mul` | `2` | — |
| `hyde` | `enabled` | `false` | `HYDE_ENABLED` |
| `hyde` | `adaptive` | `true` | — |
| `hyde` | `adaptive_thresh` | `0.50` | — |
| `hyde` | `multi_hyde` | `false` | — |
| `hyde` | `model` | `gemma3:1b` | `HYDE_MODEL` |
| `hyde` | `num_docs` | `1` | — |
| `semantic_cache` | `enabled` | `true` | — |
| `semantic_cache` | `collection` | `pkb_cache` | — |
| `semantic_cache` | `threshold` | `0.90` | `SEMANTIC_CACHE_THRESHOLD` |
| `semantic_cache` | `ttl` | `24h` | — |
| `generator` | `enabled` | `true` | — |
| `generator` | `model` | `gemma3:1b` | — |
| `generator` | `max_context_tokens` | `2800` | — |
| `chunk_filter` | `enabled` | `false` | — |
| `chunk_filter` | `model` | `gemma3:1b` | — |
| `chunk_filter` | `threshold` | `0.5` | — |
| `middleware.logger` | `level` | `dev` | `LOGGER_LEVEL` |

`.env.example` also lists `EVAL_*` and `GRAFANA_*` variables that `config.go` does not read — dead entries.

***

## Known Gaps & Drift

1. **Server-side hybrid search is not wired.** `server.go` calls `store.WithSparseScorer(...)` (client-side SPLADE rescore) but never `store.WithSparseEmbedder(...)`. Sparse vectors are not stored at ingest, so `hybridSearchServer` (the `QueryPoints` + native RRF path) is unreachable in the current build. Only client-side hybrid is active.
2. **Modified files leave orphan chunks.** `IngestService.Run` upserts changed files by deterministic ID but never calls `DeleteByFile`. Because `chunkID` is derived from `filePath:lineStart:chunkIndex`, an edit that shifts a chunk's `line_start` produces a new point while the old point remains — stale chunks are not garbage-collected.
3. **`nadir`'s own agent docs are stale.** `AGENTS.md` and `CLAUDE.md` claim chunk IDs are "FNV hash of filePath+lineStart" (they are UUIDv5 including `chunk_index`) and that "prefetch topK×3" (it is ×5). `AGENTS.md`'s "eval tests pull qdrant/qdrant:latest" is also stale.
4. **Monitor infra is half-built.** See §Monitor — missing Prometheus config files, undefined Grafana service, no app metrics endpoint.

***

## References

* Gao et al., "Precise Zero-Shot Dense Retrieval without Relevance Labels," ACL 2023 — HyDE.
* arxiv 2507.16754 — Adaptive HyDE.
* arxiv 2509.16369 — Multi-HyDE.
* arxiv 2410.19572 — LLM chunk filter (+10pp PopQA).
* Liu et al., 2023 — "Lost in the Middle: How Language Models Use Long Contexts."
* Anthropic, 2024 — contextual embedding (`filePath > header` prefix).
