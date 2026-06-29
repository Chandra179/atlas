---
title: "Knowledge Map"
description: "Complete analysis of topics mastered, foundation health, and future study roadmap across all domains"
tags: [meta, roadmap]
created: "2026-06-29"
---

# Knowledge Map

## Domain Overview

| Domain | Breadth Level | Depth | Files | Missing |
|--------|--------------|-------|-------|---------|
| **Database** | Full | Deep | 16 | — |
| **Economy** | Full | Moderate | 30 | Depth varies across subtopics |
| **Distributed Systems (etcd/Raft, Syncthing)** | Narrow | Deep | 2 | Other consensus protocols (Paxos, VSR, EPaxXos), gossip protocol, CRDTs |
| **System Design** | Narrow | Deep | 3 | Consistent hashing, ID generation (Snowflake), rate limiting, distributed cache, notification system, real-time chat, URL shortener, rate limiter design |
| **Math** | Broad | Deep (trig/lin alg) | 7 | Integral calculus, multivariable calculus, differential equations, probability/statistics, discrete math, numerical methods, information theory, optimization, proof techniques |
| **AI/ML** | Broad | Moderate | 9 | Transformer architecture, attention mechanism, training fundamentals, RLHF, prompt engineering |
| **RAG** | Narrow (one system) | Deep | 1 | Search engine internals, alternative retrieval strategies (ColBERT, late interaction) |
| **React** | Broad | Deep | 1 | Server Components hands-on, Next.js, state management libraries, testing |
| **Go** | Narrow | Deep goroutines, Shallow strings | 2 | Interfaces, errors, generics, testing, modules, HTTP/net, reflection, context, memory model, GC, profiling, embedding, structs/methods, type system, standard library |
| **Fundamentals** | Moderate | Deep | 8 | Operating systems, compilers/interpreters, data structures & algorithms, design patterns, testing strategies, CI/CD, containerization, security (beyond OAuth) |
| **Data Pipeline** | Narrow | Practitioner | 5 | Stream processing engines, CDC patterns beyond Debezium, data lakehouse (Iceberg, Delta Lake) |
| **Psychometric System** | Narrow | Architecture spec | 1 | — |
| **Distributed Systems Engineering** | Narrow | Moderate | 0 | distributed caching, lock service, coordination, leader election, failure detectors |

## Foundation Health

| Priority | Domain | Core/Foundation Status | Action |
|----------|--------|----------------------|--------|
| 1 | **Go** | ❌ Terrible — 2 files for primary language, no interfaces/errors/testing/http/context/GC/profiling | Build from scratch — this hurts daily work |
| 2 | **Fundamentals / CS** | ❌ Missing — no OS, no DSA, no compilers, no security, no CI/CD, no design patterns | Build universal gaps |
| 3 | **Distributed Systems** | ⚠️ Weak — only Raft and Syncthing. No Paxos, no consensus theory overview, no failure detectors, no distributed transaction protocols | Build foundation before advanced |
| 4 | **System Design** | ⚠️ Weak — 2 specialized topics only, missing building blocks (consistent hashing, rate limiting, ID gen, CDN, DNS) | Build fundamentals first |
| 5 | **Math** | ❌ Weak — calculus is one concept, no stats/probability, no discrete math, no proof techniques | Build core before advanced math |
| 6 | **AI/ML** | ⚠️ Partial — applied ML/LLM (infra, quantization, eval) but no transformer fundamentals, no training core | Foundation needed for ML-engineering roles |
| 7 | **Data Pipeline** | ✅ Good foundation — ingestion, idempotency, retrieval, infrastructure covered | Ready for Flink/Iceberg/streaming extensions |
| 8 | **RAG** | ✅ Good foundation — full pipeline top to bottom for one system | Ready for ColBERT, search internals |
| 9 | **Database** | ✅ Solid foundation — taxonomy, indexing, engines, MVCC, WAL, consensus, 8 engine deep dives | Ready for cloud-native, HTAP |
| 10 | **Economy** | ✅ Solid foundation — micro, macro, global, behavioral all structured | Ready for deeper individual files |
| 11 | **React** | ✅ Good foundation — model, lifecycle, hooks, concurrent, server components, error boundaries | Complete |
| 12 | **Psychometric** | ⚠️ Architecture spec only, no implementation | Low priority |

## Future Topics

### Database
- Cloud-native databases (Aurora, Neon, Serverless Postgres)
- HTAP (Hybrid Transactional/Analytical Processing) — TiDB, ClickHouse, SingleStore
- Replication topologies: multi-master, active-active, active-standby, quorum-based
- Snapshot isolation vs Serializable vs Linearizability comparison
- Optimistic vs Pessimistic concurrency control deep dive
- Database benchmarks — TPC-C, TPC-H, YCSB, how to read them
- Queue pattern in database — SKIP LOCKED, advisory locks, FOR UPDATE SKIP LOCKED
- Full-text search internals — inverted index, tokenizers, ranking (BM25, TF-IDF)
- Partitioning strategies — range, hash, list, composite, consistent hashing
- Zero-downtime schema migration patterns
- SQL anti-patterns
- Materialized view design and incremental refresh

### Distributed Systems
- Paxos (classic, multi-Paxos, Fast Paxos, Cheap Paxos)
- Viewstamped Replication (VSR)
- EPaxos (Egalitarian Paxos, no distinguished leader)
- Raft extensions: Raft Groups (multi-raft), Raft Joint Consensus, Cluster change
- CRDTs — state-based vs op-based, merge rules, real-world conflicts
- Gossip protocol — SWIM, phi-accrual failure detection, epidemic broadcast
- Distributed consensus without leader — PBFT, HotStuff (blockchain consensus)
- Total order broadcast vs primary-backup
- Distributed coordination — Chubby, ZooKeeper, etcd comparison
- Leader election algorithms — Bully, Ring, Paxos-based
- Membership protocols — SWIM, Serf, memberlist
- Distributed locks — lease-based, fencing tokens, ZooKeeper sequential znode
- Distributed transactions — 2PC, 3PC, Saga, TCC, Outbox pattern
- Linearizability vs Sequential consistency vs Causal consistency vs Eventual
- Clock skew handling — NTP, HLC, TrueTime, Lamport timestamp, Vector clock
- Distributed scheduling — Omega (Google), Kubernetes scheduler
- Conflict-free replicated data types (JSON, Map, Set, Counter, Register)
- Byzantine Fault Tolerance — PBFT, HotStuff, Tendermint
- Shard rebalancing — consistent hashing, virtual nodes, weighted sharding

### System Design
- Design a real-time chat system (WhatsApp, Messenger)
- Design a news feed (Facebook, Twitter timeline)
- Design a URL shortener (TinyURL, bit.ly)
- Design a payment system (Stripe, PayPal)
- Design a rate limiter (token bucket, sliding window, GCRA, distributed)
- Design a distributed cache (Memcached at Facebook, Redis Cluster, Twemproxy)
- Design a notification system (push, email, SMS, fan-out, unsub center)
- Design a video streaming platform (YouTube, Netflix CDN architecture)
- Design a ride-hailing system (Uber, Lyft — location matching, surge pricing)
- Design a key-value store (Dynamo, Redis cluster)
- Design a file storage system (Google Drive, Dropbox)
- Design a search engine (Google, Elasticsearch index design)
- Design a content delivery network (CDN at edge)
- Design a vote system (Reddit, Hacker News — hot/controversial ranking)
- Design a distributed logging system (ELK architecture, Loki, Datadog agent)
- Design a metrics monitoring system (Prometheus, Thanos, Grafana)
- Design a distributed tracing system (Dapper, Jaeger, OpenTelemetry)
- Design a workflow engine (Temporal, Airflow, Cadence)
- Design a feature flag system (LaunchDarkly, Flagsmith)
- Design an A/B testing platform
- Design a leaderboard system (real-time gaming, LiveOps)
- Design an inventory reservation system (e-commerce, flash sale, race condition)
- Design a calendar scheduling system (Google Calendar, meeting conflict)
- Design an API gateway (rate limiting, auth, routing, aggregation)
- Design a multiplayer game server (room management, state sync, tick rate)
- Design a comments system (tree vs flat, likes, moderation, spam detection)
- Design a proximity service (find nearby restaurants, geo-hashing, S2, QuadTree)
- Design a typeahead / autocomplete (prefix tree, edge N-grams, top-k fresh)
- Design a distributed counter (stock ticker, like counter, sharded atomic)
- Design a job scheduler (Cron at scale, distributed timer, time wheel)
- Design a data warehouse / OLAP system (Snowflake, Redshift, BigQuery)
- Design a time-series database (InfluxDB, Prometheus TSDB)
- Design an ETL pipeline (batch vs streaming, incremental, data quality)
- Design a feature store (Feast, Tecton — online/offline serving)
- Design a recommender system (collaborative filtering, matrix factorization, ALS)

### Math
- Calculus 1: chain rule, product rule, quotient rule, related rates, optimization
- Calculus 2: integration by substitution, by parts, trigonometric integrals, improper integrals
- Calculus 3: partial derivatives, gradient, curl, divergence, lagrange multipliers
- Probability: random variables, PDF/CDF, Bayes theorem, law of large numbers, CLT
- Statistics: hypothesis testing, p-values, confidence intervals, ANOVA, A/B testing
- Discrete Math: boolean algebra, counting, induction, recurrence relations, graph theory
- Information Theory: entropy, KL divergence, mutual information, cross-entropy
- Numerical Methods: floating-point precision, root-finding, numerical integration, iterative solvers
- Optimization: gradient descent variants, convex optimization, constraint solving, duality

### AI/ML
- Transformer architecture: attention mechanism, multi-head, positional encoding, GPT/LLaMA decoder
- Training: loss functions, optimizers (Adam, SGD), backprop, gradient clipping, warmup, LR schedule
- Fine-tuning: LoRA, QLoRA, PEFT, adapter tuning, instruction tuning
- RLHF: reward modeling, PPO, DPO, preference data
- Prompt engineering: chain-of-thought, few-shot, instruction following, structured output
- Evaluation beyond RAGAS: benchmarks (MMLU, HumanEval, GPQA), human eval
- Embeddings: word2vec, GloVe, BERT, Sentence-BERT, embedding quantization
- Retrieval models: ColBERT (late interaction), ColPali, Dense Passage Retrieval
- Model deployment: vLLM, TensorRT-LLM, ONNX, Triton Inference Server
- Multi-modal: vision transformers, CLIP, LLaVA, speech-to-text
- Agent architectures: ReAct, Plan-and-Solve, tool-use, reflection, memory
- Guardrails: content filtering, prompt injection detection, output validation
- LLM Ops: eval-driven development, regression test suites, canary deployment

### Go
- Interfaces: type assertion, type switch, empty interface, structural typing
- Error handling: sentinel errors, error types, error wrapping, errors.Is, errors.As
- Generics: constraints, type inference, when to use, comparison with interfaces
- Testing: table-driven tests, subtests, test helpers, golden files, fuzzing, benchmark comparison, mock interfaces
- Standard library: net/http, encoding/json, database/sql, context
- Memory model: happens-before, channel synchronization, atomic ordering, data race detection
- GC: GC cycle, STW, concurrent mark-sweep, GC tuning, allocation profiler
- Concurrency patterns: fan-out/fan-in, pipeline cancellation, graceful shutdown, rate limiting, singleflight
- Profiling: pprof, trace viewer, flame graph, continuous profiling
- Module system: go.mod, replace, workspace, version resolution, vendoring, proxy
- HTTP client: connection reuse, timeouts, retry middleware, connection pooling
- JSON: streaming unmarshal, omitempty, RawMessage, custom marshal/unmarshal

#### Go 1.18–1.26 Version Features

**Must know (daily work):**
- Generics (1.18) — type parameters, constraints, `~` tilde, `comparable`, `any`
- Workspaces (1.18) — `go.work` for multi-module development
- Loop var per-iteration (1.22) — no more closure bugs
- Range-over-int (1.22) — `for i := range 10 { ... }`
- Enhanced ServeMux routing (1.22) — `GET /items/{id}`, path params
- Iterators / range-over-func (1.23) — custom iterators, `slices`, `maps` packages
- Generic type aliases (1.24) — parameterized type aliases
- Swiss Table maps (1.24 default) — new map implementation
- `testing.B.Loop` (1.24) — benchmark standard
- `sync.WaitGroup.Go` (1.25) — convenience method
- Container-aware GOMAXPROCS (1.25) — respects k8s CPU limits
- `errors.AsType[T]()` (1.26) — generic errors.As
- `new(expr)` (1.26) — new with initial value
- `go fix` modernizers (1.26) — automated codebase upgrades

**Should know (debugging/senior):**
- Profile-guided optimization / PGO (1.21 stable)
- `slices` and `maps` packages (1.21)
- `log/slog` (1.21) — structured logging
- Green Tea GC (1.26 default) — 10–40% GC overhead reduction
- Goroutine leak profile (1.26 experimental)
- Trace Flight Recorder (1.25)
- `testing/synctest` (1.25 stable) — virtual time for concurrency tests
- FIPS 140-3 mode (1.24)

**Nice to know (specialized):**
- Fuzzing (1.18)
- `weak` package (1.24)
- `runtime.AddCleanup` (1.24)
- `encoding/json/v2` (1.25 experimental)
- `simd/archsimd` (1.26 experimental)
- `crypto/mlkem` (1.24), `crypto/hpke` (1.26)
- `os.Root` (1.24)

### Economy

#### Microeconomics
- Supply & Demand: elasticity, consumer/producer surplus, market equilibrium, cobweb model
- Consumer theory: utility functions, indifference curves, budget constraint, income/substitution effects
- Market structures: perfect competition, monopoly, monopolistic competition, oligopoly
- Game theory: Nash equilibrium, mixed strategies, sequential games, auctions
- Welfare economics: Pareto efficiency, Kaldor-Hicks, social welfare functions
- Externalities: Pigouvian tax/subsidy, Coase theorem, public goods
- Market failures: adverse selection, moral hazard, principal-agent problem
- Labor economics: human capital, signaling, efficiency wages
- Behavioral economics: prospect theory, framing, hyperbolic discounting, nudge theory

#### Macroeconomics
- GDP, CPI, unemployment (frictional/structural/cyclical, NAIRU)
- AD-AS model, SRAS vs LRAS, sticky wages
- Monetary policy: central bank tools, quantitative easing, forward guidance
- Fiscal policy: multipliers, crowding out, Ricardian equivalence
- Phillips Curve: short-run trade-off, expectations-augmented, NAIRU
- Open economy: exchange rate regimes, Mundell-Fleming, impossible trinity, PPP
- Solow growth model, endogenous growth, creative destruction
- Financial crises: Minsky, bank runs, systemic risk, Basel III
- Business cycles: RBC theory, New Keynesian, DSGE models

#### Global Economy
- Dollar system: Triffin dilemma, reserve currency, dedollarization
- Exchange rates: real vs nominal, over/undervaluation, carry trade
- Capital flows: hot money vs FDI, sudden stops
- Trade: comparative advantage, Heckscher-Ohlin, gravity model, trade wars
- Supply chains: global value chains, reshoring, bullwhip effect
- Sovereign debt: sustainability, defaults, IMF programs
- Shadow banking: money market funds, repo market, run risk
- Energy geopolitics: OPEC, LNG, renewable transition, critical minerals
- Climate finance: carbon pricing, green bonds, transition finance
- Digital currency: CBDCs, stablecoins, DeFi, cross-border payments

### Networking
- DNS deep dive: anycast, DNSSEC, split-horizon, CNAME flattening, ECS
- TCP deep dive: congestion control (CUBIC, BBR), TFO, keepalive, window scaling, selective ACK
- TLS deep dive: 1.2 vs 1.3 handshake, cipher suites, session resumption, mTLS, CT
- HTTP/2: multiplexing, HPACK, server push, HoL blocking
- HTTP/3: QUIC, 0-RTT, connection migration, no HoL blocking
- NAT traversal: STUN, TURN, ICE, Trickle ICE
- Network security: DDoS mitigation, anycast absorption, BGP blackholing, WAF
- Load balancing: L4 vs L7, Maglev, Rendezvous hashing, jump hash
- Service mesh: Envoy, xDS protocol, Istio vs Linkerd vs Consul

### Computing
- CPU architecture: superscalar, pipelining, branch prediction, out-of-order execution
- Memory hierarchy: cache lines, NUMA, cache coherence (MESI/MOESI), false sharing
- Virtual memory: page tables, huge pages, THP, swap, mmap, OOM killer
- Storage hardware: NVMe vs SATA, IOPS vs throughput, flash translation layer
- Bits & bytes: IEEE 754 floating-point, endianness, varint encoding
- Performance counters: perf, Linux PMC, CPI, cache miss rate

### Operating Systems
- Processes: PCB, fork/exec, copy-on-write, zombie/orphan processes
- Scheduler: CFS, vruntime, real-time scheduling, cgroups CPU shares
- File systems: inode, ext4 layout, journaling, XFS vs ext4 vs Btrfs, VFS
- I/O models: blocking, non-blocking, epoll, io_uring, kqueue, IOCP
- Signals: signal handling, SIGSEGV/SIGBUS, signalfd
- Namespaces & cgroups: pid/net/mnt/user, cgroup v1 vs v2, resource limits
- Kernel bypass: DPDK, XDP, eBPF internals
- eBPF: BPF verifier, maps, kprobes, tracepoints, bpftrace, observability
- Linux system programming: capabilities, seccomp-bpf, landlock, LSM, clone3

### Compilers
- Tokenizer / Lexer: regular languages, DFA/NFA, maximal munch
- Parser: recursive descent, operator precedence, Pratt parsing, AST
- Type checking: unification, Hindley-Milner, generics type inference
- SSA: static single assignment, phi functions, dominance frontiers
- Optimization: inlining, constant propagation, dead code elimination, escape analysis
- Code generation: register allocation, instruction selection, peephole optimization
- Go compiler: frontend (parse/typecheck), middle (SSA), backend (prog)
- Linker: symbol resolution, relocation, PLT/GOT, PIE

### Data Structures & Algorithms
- Arrays & slices: amortized growth, backing array lifecycle, GC pressure
- Linked lists: singly, doubly, XOR, skip list
- Trees: BST, AVL, Red-Black, B-Tree, segment tree, Fenwick tree
- Heaps: binary heap, Fibonacci heap, pairing heap
- Hash maps: closed/open addressing, Robin Hood, Swiss Table, Cuckoo, load factor
- Graphs: BFS/DFS, topological sort, Dijkstra, A*, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, max flow
- String algorithms: KMP, Boyer-Moore, Rabin-Karp, Trie, suffix array, Aho-Corasick
- Bit manipulation: popcount, bitsets, XOR tricks, submasks enumeration
- Amortized analysis: aggregate, accounting, potential methods

### Design Patterns
- Creational: singleton, factory, builder (rare in Go)
- Structural: adapter, bridge, composite, decorator, facade, proxy
- Behavioral: strategy, observer, iterator (1.23), command, chain of responsibility, state
- Go-specific: functional options, middleware, interface-based mocking, table-driven tests, pool, pipeline

### CI/CD
- GitHub Actions: workflow, matrix, reusable workflow, composite action, caching
- GitLab CI: stages, artifacts, rules, needs, parent-child pipelines
- ArgoCD: app-of-apps, sync waves, sync hooks, health checks
- Pipeline design: build → lint → test → security scan → build image → deploy
- Artifact management: container registry, SLSA provenance
- Semantic versioning, conventional commits, changelog automation
- Trunk-based vs GitFlow vs GitHub Flow
- Renovate/Dependabot: auto-PR for dependencies

### Containerization
- Docker: overlayfs layers, copy-on-write, image manifest, multi-stage builds
- OCI spec: image spec, runtime spec, distribution spec
- Linux primitives: cgroups v2, namespaces, seccomp, capabilities
- Container security: non-root, no-new-privileges, read-only rootfs
- Networking: bridge/host/overlay, storage driver overlay2

### Kubernetes
- Architecture: etcd, apiserver, controller-manager, scheduler, kubelet, kube-proxy
- Scheduler: predicates & priorities, framework, node affinity, taints & tolerations
- Controller pattern: informer, lister, work queue, reconciler
- CRD + Operator: Kubebuilder, controller-runtime
- CNI: Calico (BGP), Cilium (eBPF), Flannel (VXLAN)
- CSI: provisioner/attacher/mounter, volume lifecycle
- Autoscaling: HPA, VPA, KEDA, cluster-autoscaler, Karpenter
- Pod lifecycle: init containers, probes, termination, PDB
- Admission webhooks: MutatingWebhookConfiguration, ValidatingWebhookConfiguration

### Security
- OWASP Top 10: broken access control, crypto failures, injection
- TLS: 1.2 vs 1.3, cipher suites, forward secrecy, mTLS, CRL vs OCSP vs Must-Staple, CT logs
- Secret management: Vault, SOPS, sealed-secrets, external-secrets-operator
- Encryption: AES-GCM, ChaCha20-Poly1305, RSA, ECDH, Ed25519, SHA-256, bcrypt, argon2, post-quantum (ML-KEM)
- SAST/DAST: Semgrep, CodeQL, ZAP, Burp Suite
- Dependency scanning: Trivy, Dependabot, Snyk, SBOM, CycloneDX
- Supply chain security: SLSA, in-toto, cosign, sigstore
- Runtime security: Falco, seccomp, AppArmor/SELinux, capabilities
- Cloud security: IAM, VPC design, security groups vs NACLs, KMS

### Observability
- OpenTelemetry: SDK architecture, context propagation, sampling strategies
- Metrics: counter, gauge, histogram, summary, exemplars, cardinality explosion
- Logging: structured vs unstructured, log levels, sampling, Loki, ELK
- Tracing: span, trace, context propagation, distributed debugging
- Continuous profiling: CPU, heap, goroutine, mutex, block profiles
- Alerting: PromQL, Alertmanager, SLO-based alerting, burn rate
- SLO/SLI: error budget, burn rate policies, multi-window approach

### Distributed Messaging (beyond Kafka)
- Apache Pulsar: segment-centric, BookKeeper, geo-replication
- Redpanda: Kafka-compatible, no JVM, raft-based
- NATS JetStream: key-value store, object store, super-cluster
- Message ordering: partition-scoped vs global ordering
- Exactly-once semantics: idempotent producer + transactional producer
- Dead letter queues: retry with backoff, DLQ routing, poison pill
- Schema registry: Avro/Protobuf/JSON Schema, compatibility rules, schema evolution

### Testing
- Unit vs Integration vs E2E — trade-offs
- Test doubles: mock, stub, fake, spy, dummy
- Deterministic simulation testing (FoundationDB, Jepsen, Maelstrom)
- Flaky test detection and mitigation
- Load testing: k6, vegeta, hey, wrk2 — saturate, spike, soak
- Chaos engineering: Litmus, Chaos Mesh, Gremlin
- Test coverage: statement, branch, mutation testing
- Golden file testing
- Property-based testing: quickcheck, rapid
- BDD: godog, Cucumber in Go

### Data Pipeline
- Stream processing: Apache Flink, Kafka Streams, Samza
- CDC patterns: Debezium (pgoutput, binlog, oplog), Maxwell
- Data lakehouse: Apache Iceberg, Delta Lake, Apache Hudi
- File formats: Parquet (columnar, RLE, dictionary encoding, predicate pushdown), ORC, Arrow
- Batch processing: Spark (shuffle, RDD, DAG scheduler, Catalyst optimizer, Tungsten)
- Data quality: Great Expectations, dbt, data contracts, schema registry
- Streaming SQL: Flink SQL, ksqlDB, RisingWave

### Architecture & Meta
- ADRs (Architecture Decision Records) — format, trade-off catalog
- Domain-Driven Design: bounded context, aggregate, event storming, ubiquitous language
- CQRS and Event Sourcing: read/write models, event store, projections
- API versioning strategies: URL, header, content negotiation, contract testing
- Backwards compatibility: additive changes, field deprecation, wire format
- Operational excellence: runbooks, SLI/SLO/SLA, error budget, on-call
- Evolutionary architecture: fitness functions, strangler fig pattern
- Cost engineering: cloud cost allocation, right-sizing, spot instances
- Risk assessment: blast radius, gradual rollout, feature flag gating
