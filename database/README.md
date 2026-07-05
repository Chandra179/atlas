---
title: Database
aliases: []
created: '2026-06-13'
tags:
  - database
---

# Database

Comprehensive reference on database internals: taxonomy, indexing, storage engines, core algorithms, transaction concurrency, scaling, and deep dives into distributed databases.

## Files

### Overview

* [taxonomy.md](taxonomy.md) Database type classification: SQL, NoSQL, Document, Key-Value, Wide-Column, Graph, Object, Time-Series, NewSQL
* [indexing.md](indexing.md) Index fundamentals, B+Tree structure, composite index rules, per-engine indexing (PostgreSQL, SQL Server, MongoDB, Cassandra, Redis)
* [storage-engines.md](storage-engines.md) B-Tree, LSM-Tree, Heap, and Columnar: the fundamental storage structures with comparison table, page layout, tree topology, search/insert algorithms, and practical implications (fill factor, bloat, PK choice, columnar advantages)
* [algorithms.md](algorithms.md) Cross-cutting algorithms: MVCC, Write-Ahead Log, Merkle Trees, Bloom Filters (with pseudocode)
* [concurrency-and-scaling.md](concurrency-and-scaling.md) Transactions, isolation, locking, replication, scaling, distributed transactions, distributed consensus (Raft, Paxos, VSR), gossip protocol, consistent hashing
* [specialized-databases.md](specialized-databases.md) Vector databases (pgvector, Pinecone, Milvus), Search engines (Elasticsearch), Embedded (SQLite, DuckDB), Streaming, Time-Series internals

### Deep Dives (per database)

* [deep-dives/postgresql.md](deep-dives/postgresql.md) Data model, heap storage, MVCC, WAL, indexes, query execution, replication, performance tuning
* [deep-dives/mysql-innodb.md](deep-dives/mysql-innodb.md) Clustered B+Tree, buffer pool, redo/undo logs, locking, MVCC, replication, query execution
* [deep-dives/sqlite.md](deep-dives/sqlite.md) Manifest typing, B-Tree file format, page types, VDBE bytecode, WAL/journal, concurrency
* [deep-dives/sql-server.md](deep-dives/sql-server.md) Page/extent architecture, B-Tree indexes, transaction log, buffer pool, query execution, replication
* [deep-dives/mongodb.md](deep-dives/mongodb.md) WiredTiger engine, document model, aggregation, indexes, replica sets, sharding, change streams
* [deep-dives/redis.md](deep-dives/redis.md) Data structures & encodings, persistence, replication, cluster, eviction, transactions
* [deep-dives/cassandra.md](deep-dives/cassandra.md) SSTable structure, compaction, bloom filters, read/write paths, gossip, repair, LWTs
* [deep-dives/spanner.md](deep-dives/spanner.md) TrueTime, data model, directory-based sharding, interleaved tables, indexes, Paxos, 2PC, F1 SQL

### Examples

* [examples/btree\_demo.bin](https://github.com/Chandra179/gitbook/blob/main/database/examples/btree_demo.bin) Sample B-Tree binary file (5-page, SQLite-like format) for hex inspection
* [examples/gen\_btree\_demo.py](https://github.com/Chandra179/gitbook/blob/main/database/examples/gen_btree_demo.py) Python generator for the above
