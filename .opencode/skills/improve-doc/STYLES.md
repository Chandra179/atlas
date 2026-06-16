# Structural Pattern Catalog

Structural patterns for vault documents. Use these in topic briefs to specify the shape of a doc.

## Narrative Patterns

### Problem Hook
Open a section with the motivation: "**Problem:** [concrete pain point]. [Consequence if unsolved]." Then present the solution. Use to anchor every major section in a real developer need.

### Story Arc
Organize as: problem → naive solution → failure → refined solution → tradeoffs. Good for deep dives on complex topics (transactions, consensus, query planning).

### Case Study
Anchor a concept in a real incident or benchmark. Good for distributed systems, performance, reliability patterns.

## Reference Patterns

### Principle Table
| Principle | Definition | Guarantee | Tradeoff |
|---|---|---|---|
| Consistency | Every read sees the latest write | Strong ordering | Higher latency |

### Comparison Table
| Dimension | Option A | Option B | When to pick A | When to pick B |
|---|---|---|---|---|

### Decision Matrix
Rows = solutions, columns = criteria (latency, complexity, durability). Cells = ratings or brief notes.

## Teaching Patterns

### Mental Model First
State the abstraction / mental model before the implementation. "Think of it as X." Then show the code.

### Step-by-Step Trace
Walk through a concrete execution trace line by line. Good for algorithms, state transitions, async flows.

### Common Pitfalls
List mistakes the audience is likely to make, with incorrect vs correct examples.

### Key Things to Remember
End each major section with 3-5 takeaways. Bullet list, one key insight per bullet.

## Structural Patterns

### Block Diagram
```
[Client] → [Load Balancer] → [App Server] → [Cache] → [DB]
```
Good for systems, architectures, data flow.

### Taxonomy Tree
```
Storage Engines
├── B-Tree (MySQL InnoDB, PostgreSQL)
│   └── Page structure, crash recovery
├── LSM-Tree (RocksDB, Cassandra)
│   └── Compaction strategies, bloom filters
└── Columnar (DuckDB, Snowflake)
    └── Vectorized execution, min-max skipping
```

### Algorithm Pseudocode
```
Input: two sorted arrays A, B
Output: merged sorted array
1. i = 0, j = 0
2. while i < len(A) and j < len(B):
3.   if A[i] < B[j]: append A[i]; i++
4.   else: append B[j]; j++
5. append remaining elements
```

### Annotated JSON
Annotate a data structure inline with comments explaining each field. Good for config files, protocol messages, Fiber nodes, request payloads.

## Style Definitions

| Style | Best for | Structure | Tone |
|---|---|---|---|
| **Narrative** | Newcomers, conceptual understanding | Problem hook → story → tradeoffs | Conversational, example-driven |
| **Reference** | Practitioners who already know the domain | Tables, lists, lookup-oriented | Dense, precise |
| **Deep Dive** | Engineers who need internals | Problem hook → implementation → tradeoffs → code | Detailed, assumes prerequisites |
| **Guide** | Task-oriented readers | Step-by-step, concrete examples | Instructional, prescriptive |
