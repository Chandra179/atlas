---
title: "Nadir"
description: "Private document search with Qdrant and an optional language model."
tags: [system-design, llm, rag]
links:
  github: "https://github.com/Chandra179/nadir"
created: 2026-09-10
---

# Nadir

Nadir is a private document search app. It indexes documents and answers
questions from relevant passages.

Use it for:

- personal notes and study material;
- technical documentation;
- research papers and manuals;
- internal knowledge bases; and
- any text collection that needs document-grounded answers.

Nadir can run locally; documents and questions stay in your environment.

## How it works

```text
Documents → Index → Search → Grounded answer
Question  → Search
Follow-up question ← Conversation history ← Answer
```

### 1. Add documents

Nadir reads supported documents and splits them into passages. Each passage
keeps its source and position so answers can be traced back.

### 2. Ask a question

Nadir searches indexed passages for relevant information. Follow-up questions
can use earlier turns in the same conversation.

### 3. Review the answer

When enabled, Nadir generates an answer from the selected passages and shows
the supporting context. It streams the answer as it is generated.

## Main features

- **Private local search** — documents, queries, and answers can stay on your
  machine or network.
- **Semantic search** — finds passages with similar meaning, even with
  different wording.
- **Keyword search** — finds exact terms, names, numbers, and identifiers.
- **Hybrid retrieval** — combines semantic and keyword results for better
  coverage.
- **Optional reranking** — uses a stronger model to reorder the best matches.
- **Grounded answers** — answers from retrieved passages instead of only model
  memory.
- **Conversation history** — keeps sessions and allows follow-up questions.
- **In-place editing** — edit an earlier question and replace that turn and
  all later turns.
- **Semantic caching** — reuses results for similar questions.
- **Incremental indexing** — skips unchanged documents on later runs.
- **Optional enrichment** — adds contextual descriptions or hypothetical
  questions during indexing.
- **PDF support** — PDFs can be converted to searchable text when conversion
  support is enabled.

## Algorithms

### Chunking

Large documents are split at headings, paragraphs, and sentence boundaries.
Oversized sections are split into bounded pieces. This keeps passages focused
without losing document structure.

### Embeddings

An embedding model converts each passage and question into a vector. Similar
texts produce nearby vectors, enabling meaning-based search.

### BM25 keyword search

BM25 scores how well the exact words in a question match each passage. It is
especially useful for names, commands, product terms, formulas, and numbers.

### Reciprocal Rank Fusion

Semantic search and BM25 produce separate ranked lists. Reciprocal Rank Fusion
combines their positions instead of comparing incompatible scores. A passage
that ranks well in either list can contribute to the final result.

### Reranking

The first stage retrieves candidates quickly. An optional cross-encoder then
reads the question and each leading passage together to refine their order.

### Semantic cache

Nadir compares a new question with cached questions by vector similarity. If
the meaning is close enough, it reuses the previous retrieval result.

### Grounded generation

The selected passages and source context are placed in a prompt. The language
model answers from that material, reducing unsupported claims.

## Conversations and data management

Each conversation is an ordered list of question-and-answer turns. Editing a
turn removes it and everything after it, then runs the edited question against
the earlier conversation.

Chat history, indexed documents, and cached search results are separate types
of data. Deleting chats does not delete indexed documents. Resetting the
document index does not need to delete conversation history.

## What Nadir is designed for

Nadir is designed for private, document-grounded search on one machine or a
small local network. It prioritizes clear results, local data control, and
simple operation.

For a larger deployment, search and storage can scale separately. Live answer
streaming also needs a shared event backend so any app instance can deliver the
same conversation.
