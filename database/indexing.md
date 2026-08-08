---
title: "Indexing"
aliases: []
tags: [database, database/indexing]
created: "2026-06-13"
---

# Indexing

## Index Fundamentals

**Cardinality** refers to the number of unique values in a column relative to the total row count. It is the primary metric the query optimizer uses to decide whether to use an index.

- **High Cardinality** (e.g., `User_ID`, `Email`): Indexes are effective. The B+Tree can rapidly narrow millions of rows to a single match.
- **Low Cardinality** (e.g., `Gender`, `Status`): Indexes are often ignored. Querying for 90% of rows via an index means jumping back and forth (random I/O) slower than a full sequential table scan.

**Clustered vs Non-Clustered**: A clustered index stores the actual row data in the index leaf pages (table is the index). A non-clustered index stores pointers to the row data — either the row ID (heap) or the clustered key.

---

## Composite Index & Leftmost Prefix Rule

A Composite Index is a single index on multiple columns, ordered by the definition sequence (e.g., `CREATE INDEX idx ON T (A, B, C)`). The database sorts by A first, then by B within equal A values, then by C within equal A+B.

**Leftmost Prefix Rule**: The index can only be used if queries filter on columns starting from the left without skipping:

- `WHERE A = ?` uses index
- `WHERE A = ? AND B = ?` uses index
- `WHERE B = ?` does NOT use index (skipped A)
- `WHERE A = ? AND C = ?` uses A but cannot use C for filtering (skipped B)

Order columns by selectivity (most selective first) and align with query patterns.

---

## B+Tree Index

```mermaid
graph TD
 Root["Root Page<br/>key: 50"] --> I1["Internal Page<br/>10 | 30"]
 Root --> I2["Internal Page<br/>70 | 90"]
 I1 --> L1["Leaf: 1,5,8 → ptr"]
 I1 --> L2["Leaf: 12,18,25 → ptr"]
 I1 --> L3["Leaf: 32,40,48 → ptr"]
 I2 --> L4["Leaf: 55,62,68 → ptr"]
 I2 --> L5["Leaf: 72,80,88 → ptr"]
 I2 --> L6["Leaf: 95,99 → ptr"]
 L1 -.-> L2 -.-> L3 -.-> L4 -.-> L5 -.-> L6
```

The B+Tree is the dominant index structure in relational databases:

- **Internal nodes** store only keys (not data) to maximize fan-out — a single 16KB page can hold hundreds of keys.
- **Leaf nodes** store the actual row pointer — either the full row (clustered) or a pointer.
- **Leaf nodes are linked** — a linked list connects them left-to-right, enabling efficient range scans (`BETWEEN`, `>`).
- **Height is typically 3-4** for billions of rows. Every lookup is 3-4 I/O operations.

**Concrete example 1M rows with an index on an INT column (PostgreSQL, 8KB pages):**

PostgreSQL uses 8KB (8,192 bytes) per page. Headers and metadata reserve some space:

- Page header: 24 bytes
- Line pointer array: 4 bytes per entry
- Special space (B-Tree specific): 20 bytes

Available for data: ~8,148 bytes. An index entry has:

| Level | Entry contents | Size per entry | Max entries per page |
|---|---|---|---|---|
| Leaf | IndexTupleData (8B, incl. CTID) + INT key (4B) + line pointer (4B) = 20B | 20 bytes | 8,148 / 20 ≈ **407** |
| Internal | IndexTupleData (8B, incl. child ptr) + INT key (4B) + line pointer (4B) = 20B | 20 bytes | 8,148 / 20 ≈ **407** |

The actual usable count is slightly lower due to alignment and fillfactor (default 90%, leaves room for inserts without immediate page splits). So realistic **fan-out ≈ 366 for both leaves and internal pages**.

Building a B+Tree for 1M rows:

| Level | Fan-out | Pages needed for 1M rows |
| -------- | ----------------- | ----------------------------- |
| Leaf | 366 entries/page | 1,000,000 / 366 = 2,732 pages |
| Internal | 366 pointers/page | 2,732 / 366 ≈ 8 pages |
| Root | 366 pointers/page | 8 / 366 ≈ 1 page |

Total tree height = **3**. Every `WHERE id = ?` lookup reads exactly 3 pages — root, internal, leaf — regardless of which row is queried.

With larger keys (TEXT, UUID) the entries are bigger, fan-out drops, and the tree may need an extra level at the same row count. For example, a UUID (16 bytes) halves the fan-out.

```mermaid
graph TD
 Q["Query: WHERE id = 42"] --> Dec{Index on id?}
 Dec -->|No| FS["Full Heap Scan"]
 Dec -->|Yes| IX["B+Tree Index Lookup"]

 FS --> P1["Page 1<br/>skip..."]
 P1 --> P2["Page 2<br/>skip..."]
 P2 --> P3["⋯"]
 P3 --> P5000["Page 5000<br/>found! row data"]

 subgraph BTree["B+Tree (3 page reads)"]
 IX --> R["Root<br/>42 ≥ 30 → go right"]
 R --> I["Internal<br/>42 < 70 → go left"]
 I --> L["Leaf: id=42<br/>→ CTID (0,42)"]
 end

 L --> Heap["Heap Page 0<br/>row data"]
```

**SQL Server**: Supports both clustered and non-clustered indexes. In a clustered index, the leaf level is the data page. In a non-clustered index, the leaf contains either the clustered key (if the table has a clustered index) or a Row ID (RID, if the table is a heap). SQL Server also supports **included columns** — non-key columns stored at the leaf level to cover queries without touching the table.

### B-Tree Index File Layout

An index is stored as its own file on disk — a flat array of fixed-size blocks. The logical tree structure is encoded through block indices (page numbers):

```
PostgreSQL B-Tree index file (8KB blocks)

Index Type Contents
────── ───────── ─────────────────────────────────
[0] Meta Page 0 (metadata)
[1] Root sep=50 → children [2, 3]
[2] Internal sep=[10, 30] → children [4, 5]
[3] Internal sep=[70, 90] → children [6, 7]
[4] Leaf (1, (0,1)), (2, (0,2)), (3, (0,3)), ...
[5] Leaf (11, (1,1)), (12, (1,2)), ...
[6] Leaf (51, (2,1)), (52, (2,2)), ...
[7] Leaf (71, (3,1)), (72, (3,2)), ...
```

Each leaf stores `(key, CTID)` where `CTID = (heap_page, tuple_offset)` — the physical location of the row in the heap file.

**Logical tree:**

```
 [1] Root (sep=50)
 / \
 [2] Internal(10,30) [3] Internal(70,90)
 / \ / \
 [4]Leaf [5]Leaf [6]Leaf [7]Leaf
 (keys 1-9) (keys 11-29) (51-69) (71-99)
```

**Trace: read key=25**: Tree: `[1]` → sep 50 > 25 → go to `[2]` → sep 30 > 25 → go to `[5]` → scan leaf for key=25 → get CTID `(1,1)` → read heap file at page 1, slot 1. File offset for any block: `offset = index × page_size` (`block [5]` = `5 × 8192` = 40960).
