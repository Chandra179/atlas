---
title: Ohara
description: Private document pipeline for search, relationships, and grounded answers.
tags:
  - system-design
  - llm
  - rag
links:
  github: https://github.com/Chandra179/ohara
created: 2026-09-11T00:00:00.000Z
modified: '2026-09-11'
---

# Ohara

Ohara is a private knowledge app. It extracts text and relationships from
documents, then lets you query the resulting knowledge base.

It targets personal collections on one computer. Local files and models are
the default; cloud models are opt-in.

## Capabilities

- Fetch web pages within robots rules and local-network limits.
- Remove boilerplate while keeping headings, lists, tables, and code.
- Reject content that is too short, paywalled, duplicated, low quality, or in an
  unsupported language.
- Split long documents into token-sized pieces.
- Search exact words, semantic meaning, and entity relationships together.
- Identify people, organizations, places, events, concepts, and products.
- Keep evidence for every extracted fact and answer citation.
- Retry temporary failures and recover after restarts.
- Inspect progress, usage, failed work, and maintenance state locally.

The interface includes overview, documents, queries, entity review, and
operations. Health, metrics, and query are connected; document, entity, and
lifecycle actions are still in progress.

## The architecture in one picture

```text
user
  │
  v
local interface
  │
  v
runtime / operators
  ├─ control: durable state
  ├─ pipeline: coordinates work
  ├─ fetch: network input
  └─ knowledge: vectors + graph
```

The control area tracks pending and completed work. The pipeline coordinates
work, the fetch engine handles network input, and the knowledge area stores a
rebuildable search and relationship index. The interface presents results and
operations without direct storage access.

Each area has one responsibility and uses small behavioral interfaces. Provider,
storage, and interface changes can therefore stay local.

## How a document becomes knowledge

1. **Fetch** — retrieve a page and record its final location, status, and
   validators for later recrawls.
2. **Clean** — extract the primary content, normalize it, and apply quality
   checks.
3. **Chunk** — split the content at headings and natural boundaries. Each piece
   carries a short heading breadcrumb.
4. **Embed** — convert each piece into a numeric representation of its meaning.
5. **Extract** — find typed entities and relationships, validate them, and keep
   the source piece as evidence.
6. **Index** — store word-search data, vectors, entity links, and fact edges.
7. **Answer** — retrieve the strongest evidence and optionally write a bounded
   answer with citations.

## Algorithms

### URL normalization and duplicate detection

URLs are normalized before registration: irrelevant fragments and common
tracking parameters are removed, casing is standardized, and query parameters
are made deterministic. This prevents duplicate registrations for the same page.

Clean content also receives a hash. Matching hashes let the system skip
downstream work.

### Content cleaning and quality checks

The cleaner prefers article content over navigation, ads, and boilerplate. It
preserves useful structure, removes unsafe embedded data, and normalizes Unicode
and whitespace.

Quality checks are normal decisions. A document can be rejected for insufficient
content, paywall markers, boilerplate-only content, or unsupported language.

### Token-aware chunking

Long content is first divided by headings. Oversized sections are split at
paragraphs, lines, and sentence boundaries, in that order. Tables and fenced
code remain whole. Small overlap between neighboring pieces helps preserve
meaning across a split.

The size limit uses the embedding model's tokenizer, including the heading
breadcrumb. This is more reliable than counting characters or spaces.

### Embeddings and vector search

An embedding is a list of numbers where nearby lists have similar meaning.
Ohara compares query and document embeddings with cosine similarity. The
current implementation scans the exact vector index for the target collection.

HNSW is a faster approximate index that may be added later. Its recall must be
measured against exact search first.

### Entity resolution

Entity matching is type-aware. An exact typed alias is preferred. If none
matches, names and embeddings are compared within the same type. Ambiguous
matches go to review instead of being merged silently. Merges are explicit and
auditable.

### GraphRAG retrieval

Ohara combines three kinds of evidence:

1. **Full-text search** finds exact words, names, identifiers, and phrases.
2. **Vector search** finds semantically similar passages.
3. **Graph search** finds passages that mention query entities and facts related
   to them.

The lists are combined with reciprocal-rank fusion, which favors results near
the top of several lists. A reranker may reorder the candidates; if it fails,
the fused order remains available.

The answer writer receives a bounded set of passages and labeled facts. An
answer is accepted only when it is non-empty and cites exact evidence IDs.
Otherwise the application returns ranked passages instead of an uncited answer.

## Reliability and privacy

Every stage has durable job state. Temporary failures use bounded retries and
backoff. Leases recover interrupted work. Idempotent writes prevent duplicate
knowledge during replays.

Durable control data is authoritative. Search vectors and graph data are derived
and can be rebuilt. Because the stores cannot share one transaction, recovery
uses an explicit order.

Fetched pages are untrusted data and are never executed as code. Network access
is restricted, and cloud language-model use is disabled by default.

## Current limitations

- The default vector search is exact, not HNSW-accelerated.
- The production query path uses a deterministic identity reranker baseline.
- The live interface covers health, metrics, and query; document, entity-review,
  and lifecycle data are next.
- Entity-resolution thresholds still need measurement on larger, ambiguous
  collections.
- Symspell correction, HyDE expansion, throughput dashboards, embedding
  migration, and cloud language-model providers are future work.
