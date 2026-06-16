---
name: grow-docs
description: >
  Analyze vault-wide documentation coverage, identify topic gaps, and plan
  content growth. Scans existing topics per domain, compares against canonical
  topic trees, and produces a prioritized growth roadmap. Chain with write-doc
  (create new files) and improve-doc (deepen existing ones).
  Use when user says "grow the docs", "what topics should I add", "audit coverage",
  "plan content", "find gaps", "brainstorm topics", or asks to expand the vault.
---

# Docs Strategy

Analyze the entire vault to understand what exists, what's missing, and what to write next. Produces a `docs/growth-plan.md` with a prioritized roadmap. Optionally generates topic briefs that feed directly into `write-doc` and `improve-doc`.

Requires: `../improve-doc/STYLES.md` pattern catalog for topic briefs.

## Workflow

### 1. Inventory

Scan the vault to discover what exists:

- Read `SUMMARY.md` — master topic index via Dataview
- List all top-level directories — these are the domains: `database/`, `math/`, `system-design/`, `golang/`, `ai/`, `economy/`, `fundamental/`
- Read each domain's `README.md` for curated coverage notes
- For each domain, enumerate files and extract frontmatter tags
- Note: files outside domain directories (e.g. `etcd-raft.md`, `syncthing.md`) — treat as cross-domain deep dives

### 2. Domain Analysis

For each domain, produce a per-file summary:

| File | Style | Depth | Tags | Prerequisites |
|---|---|---|---|---|
| `database/taxonomy.md` | Reference | Broad overview | database | none |
| `etcd-raft.md` | Deep Dive | Deep internals | distributed-systems, raft | database, networking |

**Depth categories:**
- **Seed** — <100 lines, definitions only
- **Overview** — breadth with minimal depth
- **Deep dive** — narrow, thorough internals
- **Reference** — lookup-oriented, tables

### 3. Gap Analysis

Compare each domain against its canonical topic tree (see below). Report three tiers:

1. **Missing** — topic doesn't exist at all
2. **Shallow** — exists but covers <50% of expected subtopics, or lacks depth for its audience
3. **Adequate** — good coverage, consider deepening or leaving

Include a **cross-domain dependency check**: does each topic have its prerequisites covered?

### 4. Present Findings

Show the user:

```
## Coverage Report

### database/
- ✅ taxonomy (reference, adequate)
- ⚠️ indexing (overview, shallow — missing B-tree internals, composite indexes)
- ❌ transactions (missing entirely)
- ❌ recovery (missing entirely)
- ❌ distributed transactions (missing)

### system-design/
- ✅ consistent-hashing (deep dive, adequate)
- ⚠️ rate-limiter (overview, shallow — missing token bucket vs sliding window tradeoffs)
- ❌ load-balancing (missing)
- ❌ CDN / edge caching (missing)
...

## Cross-Dependency Gaps
- database/transactions is prerequisite for database/concurrency — can't write concurrency well without it
- ai/ai-infra depends on system-design/load-balancing — which is missing

## Growth Recommendations (Priority Order)
Priority 1: database/transactions (unblocks database/concurrency)
Priority 2: system-design/load-balancing (unblocks ai/ai-infra deepening)
Priority 3: database/indexing deepen (B-tree internals, composite indexes)
...
```

Wait for user feedback: adjust priorities, add/remove topics, change scope.

### 5. Generate Growth Plan

On approval, write `docs/growth-plan.md` containing:

- **Status summary** — overview table from step 2
- **Priority roadmap** — ordered list with rationale
- **For each growth item**: topic, style recommendation (deep dive/reference/guide), audience, prerequisites (as vault links), estimated depth, suggested structural patterns from STYLES.md, cross-links to existing files
- **Chain links**: for each item, specify which skill to use: `write-doc` (new topic) or `improve-doc` (deepen existing)

### 6. (Optional) Generate Topic Briefs

For any item on the roadmap, produce a topic brief — a concise scope document the user can hand to `write-doc` or `improve-doc`:

```yaml
Topic: Database Transactions
Style: Narrative + Reference hybrid
Audience: Junior backend engineer, knows SQL basics
Prerequisites: [database/taxonomy.md, database/indexing.md]
Outline:
  1. What is a transaction? (narrative hook: the bank transfer problem)
  2. ACID properties — table with definition, guarantee, tradeoff
  3. Isolation levels — comparison table, anomalies each prevents
  4. Implementation sketch — undo log, redo log, MVCC
  5. When not to use transactions
  6. Key things to remember
Patterns: Problem Hook, Principle Table, Comparison Table, Key Things
Sources:
  - [^1] Kleppmann, "Designing Data-Intensive Applications" ch.7
  - [^2] PostgreSQL docs on MVCC
```

Write each brief inline in the growth plan, or to `docs/briefs/<topic-slug>.brief.md` if user wants separate files.

### Citation System (for Topic Briefs)

Topic briefs include a `Sources:` field listing external references. Each source follows `[^n]` notation matching `write-doc`'s citation system so the brief feeds directly into drafting:

```yaml
Sources:
  - [^1] Kleppmann, "Designing Data-Intensive Applications" ch.7
  - [^2] PostgreSQL docs on MVCC
```

Rules:
- Sources are optional in the brief but mandatory when the brief is handed to `write-doc` — every `[^n]` in the Outline must have a matching source.
- Number `[^n]` sequentially in order of first mention in the Outline.
- Descriptions must be specific enough to identify the source without clicking: "PostgreSQL docs on MVCC" not "docs".
- Sources carry forward verbatim into the draft's References section when `write-doc` produces the file.
- Inline footnotes `^[text]` (for brief clarifications without URLs) are not used in briefs — reserve them for the draft stage.

## Canonical Topic Trees

Use these as the reference for gap analysis. Every domain lists a "minimum viable" set of topics. If the vault covers extras beyond these, note them as strengths. If it's missing core items, flag them.

### database/
- **Fundamentals**: taxonomy, storage engines, indexing, query processing, concurrency control, recovery, security
- **Specific systems**: PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, Redis, Cassandra, Spanner, DuckDB, Snowflake
- **Advanced**: distributed transactions, replication, sharding, vector databases, NewSQL, HTAP, columnar storage, time-series databases
- **Also needed but cross-domain**: distributed-transactions (see system-design)

### system-design/
- **Core concepts**: CAP theorem, consistency models (strong, eventual, causal), consensus algorithms (Paxos, Raft, Zab)
- **Infrastructure patterns**: caching, rate limiting, load balancing, CDN / edge caching, message queues, pub/sub, service discovery, leader election, distributed coordination (ZooKeeper/etcd)
- **Building blocks (design examples)**: ID generator, URL shortener, distributed cache, task scheduler, event processing pipeline, order notification, rate limiter, chat system, file storage (S3-like), key-value store, metrics/monitoring system
- **Data infrastructure**: distributed transactions, replication strategies, sharding strategies, distributed query engine

### math/
- **Core**: precalculus, calculus (derivatives, integrals, series), linear algebra (vectors, matrices, eigenvalues), trigonometry, probability, statistics, discrete math, graph theory, information theory

### golang/
- **Core**: goroutines & channels, interfaces, error handling, generics, memory model, garbage collection, profiling & tracing, modules & dependency management, testing & benchmarking, concurrency patterns
- **Advanced**: unsafe package, cgo, compiler optimization, assembly

### ai/
- **Fundamentals**: ML taxonomy, training vs inference, model architectures (Transformer, CNN, RNN), loss functions, optimization
- **LLM-specific**: tokenization, attention mechanisms, fine-tuning, RLHF, quantization, prompting strategies, RAG, tool use, agents
- **Infrastructure**: AI infra (Modal/vLLM/GPUs), model serving, scaling inference, cold starts, batching

### economy/
- **Micro**: supply & demand, elasticity, market structures, game theory, externalities, public goods
- **Macro**: GDP, inflation, monetary policy, fiscal policy, unemployment, business cycles, international trade
- **Global finance**: exchange rates, balance of payments, capital markets, derivatives
- **Behavioral**: biases, heuristics, prospect theory, nudges
- **Systems**: stock exchanges, central banking, payment systems, DeFi

### fundamental/ (CS)
- computing basics, networking, operating systems, API design, software architecture, OAuth2 / auth, Kafka, testing strategies

## Output

Write `docs/growth-plan.md` with the full growth plan. Optionally write topic briefs to `docs/briefs/<topic-slug>.brief.md`.

## What Not to Do

- Do not invent topics unrelated to the vault's existing domains. Growth should feel like natural expansion, not scope creep.
- Do not skip the gap analysis step — presenting coverage data first anchors the conversation.
- Do not produce a plan without user approval on the findings.
- Do not overwrite `docs/growth-plan.md` on re-runs without warning — version it or check with the user.
- Do not list every possible topic in a domain — flag the highest-impact gaps only.
