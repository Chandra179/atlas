# Nadir

## What This Is

Nadir answers questions from a collection of local documents. You point it at a directory of markdown files, PDFs, or plain text. It ingests them, builds a search index, and answers questions in natural language. You interact through an HTTP API — POST a query, get back ranked passages or a generated answer with citations.

It is for teams who keep documentation in a repo. No cloud dependency, no data leaving your machine.

## Non-Goals

Nadir does not do real-time ingestion. It does not support multi-tenancy, authentication, access control, or distributed deployment. It cannot answer questions from images or audio. It assumes a single node with co-located services.

## Algorithms

**Contextual embedding.** Each chunk gets prefixed with its file path and heading before embedding. This anchors the vector in document structure without changing the stored text. The same chunk in a different context produces a different embedding.

**Hybrid search.** Two legs run in parallel. Dense search finds nearest neighbors by cosine similarity on 768-dimensional vectors. Sparse search runs BM25 over the full-text index, then rescales scores using SPLADE. Results fuse by Reciprocal Rank Fusion (RRF) — each candidate's rank from each leg gets a reciprocal score, summed across legs. This catches out-of-domain queries that a pure dense approach would miss.

**Multi-fragment queries.** Long queries split on sentence boundaries. Each fragment searches independently. Results deduplicate and re-sort. This avoids the dilution that comes from embedding a long, multi-topic query into a single vector.

**Lost in the Middle ordering.** When building a prompt for the generator, Nadir places the most relevant chunks at the start and end of the context window, and the least relevant in the middle. This follows the empirical finding that LLMs use information at both ends of their context window far better than information in the middle.

**Semantic cache.** Query embeddings check a dedicated Qdrant collection before search. A cosine similarity above a configurable threshold returns the cached answer directly. On a miss, the pipeline writes the result back asynchronously. The cache only activates when the client does not request generation.

## Architecture

### Pipeline

```
POST /ingest → walk → dedup → [concurrent workers: chunk → embed] → batch upsert
POST /search → embed → [cache?] → [multi-fragment: dense ∥ sparse] → RRF → [reranker?] → [→ generate?]
GET  /healthz → 200
```

### Ingestion Flow

The server walks configured source directories. Each file's SHA-256 hash is compared against stored hashes in Qdrant payloads. Unchanged files are skipped. Changed and new files enter a worker pool with configurable concurrency. Each worker picks a chunking strategy from config, slices the file, embeds every chunk via Ollama, and batch-upserts to Qdrant. Chunk IDs are deterministic — same file produces the same chunks and the same Qdrant point IDs — so upserts are idempotent.

### Search Flow

The client's query is embedded via Ollama. The semantic cache checks embedding cosine similarity against a threshold — on a hit (and no generate flag), cached results return immediately. On a miss, the query splits into sentence fragments if long. Each fragment runs dense ANN and BM25 search in Qdrant in parallel. Results from both legs fuse via RRF across all fragments. The top N candidates are re-scored by the cross-encoder reranker sidecar, if enabled and available. If generation is requested, chunks are reordered by the "lost in the middle" heuristic, placed into a system prompt within the token budget, and Ollama streams the answer token by token back to the client.

### Components

- **Go binary** — orchestrates everything. Serves HTTP, routes to pipeline stages, manages configuration.
- **Qdrant** — single vector database with two collections. The main collection stores dense vectors (768-d Cosine), sparse vectors (IDF), full-text index on chunk text, and keyword index on file path. The cache collection stores query embeddings and their response payloads.
- **Ollama** — dual role. Provides the embedding model (`nomic-embed-text`) during ingest and search, and the chat model for generation. Both configured independently; defaults to the same host.
- **Reranker sidecar** — optional Python service running a cross-encoder. The search pipeline skips it if unavailable.
- **Docling sidecar** — optional Python service for PDF-to-markdown conversion. Activated on PDF files during ingest.

### Config Wiring

A single YAML file selects the chunker type, Qdrant address, Ollama address, reranker address, collection name, cache threshold, and source paths. Environment variables override individual fields. No feature discovery — the binary connects to configured addresses or fails.

### Concurrency Model

Ingest uses a bounded worker pool. Multiple files are processed in parallel, but a single file is processed sequentially. Search is synchronous within a request. The dense and sparse legs run concurrently, then fuse synchronously. The generator streams; the HTTP response flushes each token as it arrives.

## Deployment

Single machine. Qdrant co-located. Ollama on localhost. Sidecars as containers. Configuration through a single YAML file with environment variable overrides. The `make dev` command starts everything and ingests configured source paths.

## Failure Modes

Each dependency degrades independently:

- **Qdrant down** — no ingest, no search. Hard failure.
- **Ollama down** — ingest fails (no embeddings). Search returns cached results only. Generation unavailable.
- **Reranker down** — search skips reranking and returns raw hybrid results. Graceful degradation.
- **Generator down** — search returns ranked passages without an answer. The client still gets useful results.

## Key Tradeoffs

**Sentence chunks vs fixed-size chunks.** Sentence chunks let the system cite exact passages. Fixed-size chunks are simpler but break in the middle of sentences, making citations imprecise. The tradeoff is complexity in chunking logic.

**Hybrid search vs pure dense.** Hybrid catches queries that use different vocabulary than the documents. Pure dense is faster and simpler but misses relevant results when terminology diverges. For out-of-domain queries, hybrid wins. For well-matched vocab, pure dense performs similarly at lower latency.

**Local LLM vs cloud API.** Local keeps data private and works offline. Cloud models are more capable but send data to a third party. Nadir chooses local by default — the design assumes sensitive documentation.

**Contextual prefix vs late interaction.** Prefixing the file path and heading into the embedding anchors meaning cheaply. Late-interaction models (ColBERT) can match more flexibly at search time, but require a different retrieval architecture and more memory.

## Glossary

- **Dense vector** — an embedding produced by a neural network. Measures semantic similarity by cosine distance.
- **Sparse vector** — a vector where most dimensions are zero. Represents term frequency statistics. Used for lexical matching.
- **RRF** — Reciprocal Rank Fusion. Combines ranked lists by giving each result a score of 1/(rank + k) per list, summed.
- **Cross-encoder** — a model that takes a query-document pair and outputs a relevance score. More accurate than bi-encoders but too slow to run on every document in the collection — used as a reranker on the top candidates.
- **Lost in the Middle** — the empirical observation that LLMs use information better when it appears at the start or end of the context window than in the middle.
- **RAGAS** — a framework for evaluating retrieval-augmented generation pipelines. Measures faithfulness, answer relevance, context precision, and context recall.
