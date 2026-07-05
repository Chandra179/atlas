---
title: "Knowledge Map"
description: "Complete analysis of topics mastered, foundation health, and future study roadmap across all domains"
tags: [meta, roadmap]
created: "2026-06-29"
modified: "2026-07-05"
---

# Knowledge Map

| Domain | Breadth Level | Depth | Files | Missing |
|--------|--------------|-------|-------|---------|
| **Database** | Full | Deep | 14 | — |
| **Economy** | Full | Moderate | 30 | Depth varies across subtopics |
| **Distributed Systems (etcd/Raft, Syncthing)** | Narrow | Deep | 2 | Other consensus protocols (Paxos, VSR, EPaxXos), gossip protocol, CRDTs |
| **System Design** | Narrow | Deep | 3 | Consistent hashing, ID generation (Snowflake), rate limiting, distributed cache, notification system, real-time chat, URL shortener, rate limiter design |
| **Math** | Broad | Deep (trig/lin alg) | 6 | Integral calculus, multivariable calculus, differential equations, probability/statistics, discrete math, numerical methods, information theory, optimization, proof techniques |
| **AI/ML** | Broad | Moderate | 10 | Transformer architecture, attention mechanism, training fundamentals, RLHF, prompt engineering |
| **RAG** | Narrow (one system) | Deep | 1 | Search engine internals, alternative retrieval strategies (ColBERT, late interaction) |
| **React** | Broad | Deep | 1 | Server Components hands-on, Next.js, state management libraries, testing |
| **Go** | Narrow | Deep goroutines, Shallow strings | 2 | Interfaces, errors, generics, testing, modules, HTTP/net, reflection, context, memory model, GC, profiling, embedding, structs/methods, type system, standard library |
| **Backend Engineering** | Moderate | Deep | 7 | Operating systems, compilers/interpreters, data structures & algorithms, design patterns, testing strategies, CI/CD, containerization, security (beyond OAuth) |
| **Psychometric System** | Narrow | Architecture spec | 1 | — |
| **Lattice Work** | Placeholder | — | 0 | Charlie Munger mental models — no content yet |

# Foundation Health

| Priority | Domain | Core/Foundation Status | Action |
|----------|--------|----------------------|--------|
| 1 | **Go** | ❌ Terrible — 2 files for primary language, no interfaces/errors/testing/http/context/GC/profiling | Build from scratch — this hurts daily work |
| 2 | **Backend Engineering / CS** | ❌ Missing — no OS, no DSA, no compilers, no security, no CI/CD, no design patterns | Build universal gaps |
| 3 | **Distributed Systems** | ⚠️ Weak — only Raft and Syncthing. No Paxos, no consensus theory overview, no failure detectors, no distributed transaction protocols | Build foundation before advanced |
| 4 | **System Design** | ⚠️ Weak — 2 specialized topics only, missing building blocks (consistent hashing, rate limiting, ID gen, CDN, DNS) | Build fundamentals first |
| 5 | **Math** | ❌ Weak — calculus is one concept, no stats/probability, no discrete math, no proof techniques | Build core before advanced math |
| 6 | **AI/ML** | ⚠️ Partial — applied ML/LLM (infra, quantization, eval) but no transformer fundamentals, no training core | Foundation needed for ML-engineering roles |
| 7 | **RAG** | ✅ Good foundation — full pipeline top to bottom for one system | Ready for ColBERT, search internals |
| 8 | **Database** | ✅ Solid foundation — taxonomy, indexing, engines, MVCC, WAL, consensus, 8 engine deep dives | Ready for cloud-native, HTAP |
| 9 | **Economy** | ✅ Solid foundation — micro, macro, global, behavioral all structured | Ready for deeper individual files |
| 10 | **React** | ✅ Good foundation — model, lifecycle, hooks, concurrent, server components, error boundaries | Complete |
| 11 | **Psychometric** | ⚠️ Architecture spec only, no implementation | Low priority |

# Future Topics

## Database
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

## Distributed Systems
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

## System Design
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

## Math
- Calculus 1: chain rule, product rule, quotient rule, related rates, optimization
- Calculus 2: integration by substitution, by parts, trigonometric integrals, improper integrals
    - Calculus 3: partial derivatives, gradient, curl, divergence, lagrange multipliers
    - Probability: random variables, PDF/CDF, Bayes theorem, law of large numbers, CLT
    - Statistics: hypothesis testing, p-values, confidence intervals, ANOVA, A/B testing
    - Discrete Math: boolean algebra, counting, induction, recurrence relations, graph theory
    - Information Theory: entropy, KL divergence, mutual information, cross-entropy
    - Numerical Methods: floating-point precision, root-finding, numerical integration, iterative solvers
    - Optimization: gradient descent variants, convex optimization, constraint solving, duality

## AI/ML
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

## Go
- ~~Interfaces: type assertion, type switch, empty interface, structural typing, why they're not classes~~
- ~~Error handling: sentinel errors, error types, error wrapping (fmt.Errorf %w), errors.Is, errors.As~~
- ~~Testing: table-driven tests, subtests, test helpers, golden files, fuzzing, benchmark comparison (benchstat), mock interfaces~~
- Standard library: net/http (handler, middleware, ServeMux), encoding/json (streaming, decoder), database/sql (connection pool), context (deadline, cancellation tree, value carry)
- Memory model: happens-before, channel synchronization, atomic ordering, data race detection (race detector deep dive)
- ~~GC: GC cycle, STW, concurrent mark-sweep, GC tuning (GOGC, GOMEMLIMIT), allocation profiler~~
- Concurrency patterns beyond basics: fan-out/fan-in, pipeline cancellation, graceful shutdown with signal.NotifyContext, rate limiting with x/time/rate, singleflight
- Profiling: pprof (CPU, heap, goroutine, mutex, block), trace viewer, flame graph, continuous profiling (Pyroscope, Parca)
- Module system: go.mod, replace directive, workspace, version resolution, vendoring, proxy
- HTTP client: connection reuse, timeouts (Dialer, TLS, transport defaults), retry middleware, connection pooling
- JSON: streaming unmarshal (Decoder), omitempty edge cases, RawMessage, custom marshal/unmarshal

### Go 1.18–1.26 Version Features

**Must know (daily work):**
- Generics (1.18) — type parameters, constraints, `~` tilde, `comparable`, `any`
- Workspaces (1.18) — `go.work` for multi-module development
- Loop var per-iteration (1.22) — no more closure bugs, no need to shadow
- Range-over-int (1.22) — `for i := range 10 { ... }`
- Enhanced ServeMux routing (1.22) — `GET /items/{id}`, path params
- Iterators / range-over-func (1.23) — custom `func(yield func(K, V) bool)` iterators, `slices`, `maps` package support
- Generic type aliases (1.24) — type alias can now be parameterized
- Swiss Table maps (1.24 default) — new `map` implementation
- `testing.B.Loop` (1.24) — `for b.Loop() { ... }` benchmark standard
- `sync.WaitGroup.Go` (1.25) — `wg.Go(func() { ... })` convenience method
- Container-aware GOMAXPROCS (1.25) — respects k8s CPU limits
- `errors.AsType[T]()` (1.26) — generic `errors.As`
- `new(expr)` (1.26) — `new` with initial value
- `go fix` modernizers (1.26) — automated codebase upgrades

**Should know (debugging/senior):**
- Profile-guided optimization / PGO (1.20 experimental, 1.21 stable) — 2–14% perf gain in production
- Go toolchain management (1.21) — `go.mod` `toolchain` directive, automatic download
- `min`, `max`, `clear` builtins (1.21) — `clear(m)`, `clear(slice)`
- `slices` and `maps` packages (1.21) — `slices.Sort`, `slices.Compact`, `maps.Clone`, `maps.Keys`
- Structured routing with `Get("/path")`, `MethodNotAllowed` (1.22)
- `math/rand/v2` (1.22) — cleaner API, ChaCha8 source
- `log/slog` (1.21) — structured logging standard library
- RCU-like map implementation for `sync.Map` (1.24)
- `http.Server.Protocols` / `Transport.Protocols` (1.24) — HTTP/2 config
- Green Tea GC (1.26 default) — 10–40% GC overhead reduction
- Goroutine leak profile (1.26 experimental) — detect leaks via unreachable primitives
- Trace Flight Recorder (1.25) — ring-buffer execution traces for rare bugs
- `testing/synctest` (1.25 stable) — virtual time for concurrency tests
- FIPS 140-3 mode (1.24) — `GOFIPS140` + `fips140` GODEBUG

**Nice to know (specialized):**
- Fuzzing (1.18) — `go test -fuzz`, `(*testing.F).Add`, `(*testing.F).Fuzz`
- Memory model revision (1.19) — sync.Pool, finalizer guarantees
- `comparable` constraint fixed (1.20) — allows `==` with proper NaN behavior
- Error wrapping multiple errors (1.20) — `fmt.Errorf("%w and %w", e1, e2)`
- `runtime/arena` (1.20 experimental, removed 1.22) — manual memory allocation
- `http.ResponseController` (1.20) — per-request deadline, flush
- `os.Cleanpath` (1.21) — path cleaning
- Reverse proxy `Rewrite` rule (1.20+) — safe Director alternative
- `net/http/w3c` (1.22) — W3C trace context
- Post-quantum TLS: X25519MLKEM768 (1.24), SecP256r1MLKEM768 (1.26 default)
- `crypto/mlkem` (1.24), `crypto/hpke` (1.26)
- `os.Root` (1.24) — chroot-like filesystem operations
- `weak` package (1.24) — weak pointers for canonicalization maps
- `runtime.AddCleanup` (1.24) — modern `SetFinalizer` replacement
- `runtime/trace.FlightRecorder` (1.25) — in-memory trace ring buffer
- `encoding/json/v2` (1.25 experimental) — 2x decode speed
- `runtime/secret` (1.26 experimental) — secure memory erasure
- `simd/archsimd` (1.26 experimental) — SIMD operations
- DWARF5 debug info (1.25) — smaller binaries, faster linking
- Self-referencing type params (1.26) — `type Adder[A Adder[A]] interface { Add(A) A }`
- `reflect` iterators for Fields/Methods (1.26) — range without allocation

## Economy

### Microeconomics (deepen existing)
- Supply & Demand: elasticity (price, income, cross), consumer/producer surplus, market equilibrium shifts, cobweb model
- Consumer theory: utility functions (Cobb-Douglas, Leontief, CES), indifference curves, budget constraint, income/substitution effects (Slutsky vs Hicks), revealed preference
- Market structures: perfect competition (price taker), monopoly (price maker, deadweight loss), monopolistic competition (product differentiation), oligopoly (Cournot, Bertrand, Stackelberg)
- Game theory: Nash equilibrium, mixed strategies, sequential games (subgame perfection), repeated games (Grim Trigger, Tit-for-Tat), signaling games, auctions (first-price, second-price/Vickrey, English, Dutch, all-pay)
- Welfare economics: first and second welfare theorems, Pareto efficiency, Kaldor-Hicks compensation, social welfare functions (Benthamite, Rawlsian, Nash)
- Externalities: positive/negative, Pigouvian tax/subsidy, Coase theorem, tradable permits, public goods (non-rival, non-excludable, free rider problem)
- Market failures: adverse selection (market for lemons), moral hazard, principal-agent problem, information asymmetry
- Labor economics: compensating differentials, human capital theory, signaling vs screening, efficiency wages, monopsony in labor
- Production theory: production functions (Cobb-Douglas, CES, Leontief), returns to scale, isoquants, isocost, cost minimization, profit maximization
- Behavioral economics: prospect theory (loss aversion, reference dependence), framing effects, hyperbolic discounting (present bias), nudge theory, mental accounting
- Frontiers: mechanism design, matching theory (Gale-Shapley, Roth), market design, experimental economics

### Macroeconomics (deepen existing)
- GDP: expenditure approach (C+I+G+NX), income approach, nominal vs real GDP, GDP deflator, limitations (GPI, HDI)
- CPI: basket of goods, Laspeyres index, substitution bias, chained CPI, PCE deflator (Fed preferred)
- Unemployment: frictional, structural, cyclical, natural rate (NAIRU), Okun's law, Beveridge curve
- AD-AS: aggregate demand (C+I+G+NX, wealth effect, interest rate effect, exchange rate effect), SRAS vs LRAS, sticky wages, supply shocks
- Monetary policy: central bank tools (policy rate, reserve requirements, open market operations), transmission mechanism, quantitative easing, forward guidance, interest on reserves (IORB, ON RRP)
- Fiscal policy: government spending multiplier, tax multiplier, crowding out, Ricardian equivalence, automatic stabilizers
- Phillips Curve: short-run trade-off, long-run vertical (natural rate), expectations-augmented, NAIRU, inflation dynamics
- Open economy: exchange rate regimes (fixed, floating, managed), Mundell-Fleming model, impossible trinity, purchasing power parity (absolute vs relative, why it fails), uncovered interest parity
- Solow growth model: production function Y=AK^α, steady state, golden rule, technology as residual (Solow residual), convergence (conditional vs unconditional)
- Growth finance: endogenous growth (Romer, Lucas), Schumpeterian creative destruction, institutions and growth (Acemoglu)
- Financial crises: Minsky moment, bank runs (Diamond-Dybvig), systemic risk, too-big-to-fail, Dodd-Frank, Basel III, macroprudential regulation
- Business cycles: real business cycle theory (technology shocks), New Keynesian (sticky prices/wages), DSGE models

### Global Economy (deepen existing)
- Dollar system: Triffin dilemma, reserve currency status, SWIFT, petrodollar, dollar standard vs Bretton Woods, dedollarization trends
- Exchange rates: nominal vs real (RER), overvaluation vs undervaluation (Big Mac index), carry trade, currency interventions
- Capital flows: hot money vs FDI, push vs pull factors, sudden stops, capital account liberalization, Tobin tax
- Trade: Ricardian comparative advantage, Heckscher-Ohlin, intra-industry trade (Krugman), gravity model, trade creation vs diversion (Viner), trade wars
- Supply chains: global value chains, GVC fragmentation, reshoring/nearshoring/friend-shoring, bullwhip effect, inventory optimization (JIT vs JIC)
- Sovereign debt: debt sustainability, odious debt, collective action clauses, sovereign defaults (Argentina, Greece, Sri Lanka), debt restructuring, IMF programs
- Shadow banking: money market funds, repo market, asset-backed commercial paper, credit intermediation outside traditional banking, run risk
- Export controls: entity lists, EAR vs ITAR, sanctions (primary vs secondary), extraterritoriality, deglobalization trends
- Energy geopolitics: OPEC, energy security, LNG markets, renewable transition, critical minerals (lithium, rare earths), energy as a weapon
- Climate finance: carbon pricing (ETS vs carbon tax), green bonds, climate risk disclosure, transition finance, Article 6 of Paris Agreement
- Digital currency: CBDCs (retail vs wholesale), stablecoins (fiat vs crypto-collateralized vs algorithmic), DeFi, cross-border payment systems (mBridge, UPI), regulatory landscape
- Financial crises (deepen): Asian crisis (1997), Global Financial Crisis (2008), European debt crisis (2011), COVID economic response — causes, responses, lessons

### Networking (deepen existing)
- DNS deep dive: resolution chain, anycast, DNSSEC, split-horizon, CNAME flattening, ECS (EDNS Client Subnet)
- TCP deep dive: congestion control algorithms (CUBIC, BBR, Reno), Nagle vs cork, TFO (TCP Fast Open), keepalive internals, window scaling, selective ACK
- TLS deep dive: 1.2 vs 1.3 handshake, cipher suites, session resumption (session ticket vs session ID), certificate chains, mTLS, CA trust model, CT (Certificate Transparency), HPKE (1.26)
- HTTP/2: multiplexing, HPACK, server push, stream priority, head-of-line blocking at transport layer
- HTTP/3: QUIC transport, 0-RTT, connection migration, no HoL blocking, how it differs from HTTP/2
- NAT traversal advanced: STUN (RFC 8489), TURN (RFC 8656), ICE (RFC 8445), Trickle ICE, ICE lite
- Network security: DDoS mitigation, anycast absorbtion, BGP blackholing, rate limiting at edge, WAF internals
- Load balancing: L4 vs L7, consistent hashing, Maglev (Google), Rendezvous hashing, chash-ring vs jump hash
- Service mesh networking: Envoy L7 proxy, sidecar, xDS protocol, EDS/CDS/RDS/LDS, Istio vs Linkerd vs Consul

### Computing (deepen existing)
- CPU architecture: superscalar, pipelining, branch prediction, out-of-order execution, speculative execution (Spectre/Meltdown context)
- Memory hierarchy: cache lines, associativity, prefetching, NUMA topology, TLB misses, cache coherence (MESI/MOESI), false sharing
- Virtual memory: page tables (multi-level), huge pages (2MB/1GB), THP, swap, mmap internals, OOM killer
- Storage hardware: NVMe vs SATA, IOPS vs throughput, flash translation layer, wear leveling, TRIM
- Bits & bytes: floating-point representation (IEEE 754), endianness, two's complement, base64/hex encoding, varint encoding (protobuf)
- Performance counter: perf, Linux PMC, CPI, cache miss rate, branch mispredict rate, stalled cycles

### OS (new)
- Processes: PCB, fork/exec, copy-on-write, zombie/orphan processes, process groups, sessions
- Scheduler: CFS, nice, vruntime, O(1) scheduler evolution, real-time scheduling (FIFO/RR/DL), cgroups CPU shares
- File systems: inode, dentry, ext4 layout (superblock, block group, inode table), journaling, XFS vs ext4 vs Btrfs, VFS
- I/O models: blocking, non-blocking, multiplexing (select/poll/epoll), async I/O (io_uring, kqueue, IOCP)
- Signals: signal handling, SIGSEGV/SIGBUS, signal safety, signalfd
- Namespaces & cgroups: pid/net/mnt/user namespaces, cgroup v1 vs v2, resource limits
- Kernel bypass: DPDK, XDP, eBPF internals
- eBPF: BPF verifier, maps, kprobes, tracepoints, bpftrace, observability with eBPF (Pixie, Cilium)
- Linux system programming: capabilities, seccomp-bpf, landlock, LSM, prctl, clone3

### Compilers (new)
- Tokenizer → Lexer: regular languages, DFA/NFA, maximal munch, Go scanner
- Parser: recursive descent, operator precedence, Pratt parsing, AST
- Type checking: unification, Hindley-Milner, subtyping, generics type inference
- SSA: static single assignment form, phi functions, dominance frontiers
- Optimization passes: inlining, constant propagation, dead code elimination, loop unrolling, escape analysis
- Code generation: register allocation (graph coloring, linear scan), instruction selection, peephole
- Go compiler: frontend (parse/typecheck), middle (SSA), backend (prog), gc/asm architecture
- Linker: symbol resolution, relocation, PLT/GOT, lazy binding, PIE

### Data Structures (new section)
- Arrays & slices: amortized growth, copy-on-write, backing array lifecycle, GC pressure
- Linked lists: singly, doubly, XOR, skip list (ScyllaDB uses this)
- Trees: BST, AVL (balanced), Red-Black (Linux scheduler, std::map), B-Tree (database), segment tree, Fenwick tree
- Heaps: binary heap, Fibonacci heap (Dijkstra optimization), pairing heap
- Hash maps: closed addressing, open addressing, Robin Hood, Swiss Table, Cuckoo, load factor, hash DoS
- Graphs: adjacency matrix vs list, BFS, DFS, topological sort, shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall, A*), minimum spanning tree (Kruskal, Prim), max flow (Ford-Fulkerson, Edmonds-Karp, Dinic)
- String algorithms: KMP, Boyer-Moore, Rabin-Karp, Z-algorithm, Trie, suffix array/Tree, Aho-Corasick
- Bit manipulation: popcount, leading/trailing zeros, bitsets, XOR tricks, submasks enumeration
- Amortized analysis: aggregate, accounting, potential methods

### Design Patterns (new)
- Creational: singleton, factory, builder, prototype (rare in Go)
- Structural: adapter, bridge, composite, decorator, facade, flyweight, proxy (http.Handler is a decorator)
- Behavioral: strategy, observer, iterator (Go iterators 1.23), command, chain of responsibility (http middleware), state, template method, mediator, memento
- Go-specific: functional options, handler-as-middleware, interface-based mocking, table-driven tests, sync.Once as lazy init, pool pattern, fan-out/fan-in, pipeline
- When patterns apply in Go: most GoF patterns fight the language — interfaces + composition replace inheritance-heavy patterns

### CI/CD (new)
- GitHub Actions: workflow, job, step, matrix, reusable workflow, composite action, self-hosted runner, caching
- GitLab CI: .gitlab-ci.yml, stages, artifacts, rules, needs, parent-child pipelines
- ArgoCD: app-of-apps, sync waves, sync hooks, health checks, automated sync policy
- Pipeline design: build → lint → test → security scan → build image → push → deploy (canary/staging/prod)
- Artifact management: container registry, package registry (npm/GHCR/pypi), version pinning, provenance (SLSA)
- Semantic versioning: semver spec, pre-release, build metadata, breaking change detection
- Conventional commits: feat/fix/refactor/breaking, changelog generation, semantic release automation
- Trunk-based vs GitFlow vs GitHub Flow vs release branches
- Renovate/Dependabot: auto-PR for dependency updates, grouping, scheduling, security alerts

### Containerization (new)
- Docker: overlayfs layers, copy-on-write, union mount, image manifest, multi-stage builds, distroless images
- OCI spec: image spec, runtime spec, distribution spec — why it matters
- Linux primitives: cgroups v2 resource limits (cpu/memory/io/pid/pids), namespaces, pivot_root, seccomp, capabilities (CAP_NET_BIND_SERVICE)
- Container security: non-root user, no-new-privileges, read-only rootfs, drop all capabilities, seccomp profile, AppArmor/SELinux
- Performance: Docker networking (bridge/host/overlay), storage driver overlay2 vs devicemapper vs fuse-overlayfs

### Orchestration / K8s (new)
- Architecture: etcd, kube-apiserver, controller-manager, kube-scheduler, kubelet, kube-proxy, coredns
- Scheduler: predicates & priorities, scheduler framework (QueueSort/PreFilter/Filter/Score), pod scheduling context, node affinity, taints & tolerations
- Controller pattern: informer, lister, work queue, reconciler — every operator is this loop
- CRD + Operator: custom resource definition, controller-runtime, Kubebuilder, Operator SDK
- CNI: Calico (BGP), Cilium (eBPF), Flannel (VXLAN), network policies, service mesh integration
- CSI: csi-driver-host-path, ebs-csi, provisioner/attacher/mounter, volume lifecycle
- Networking: service (ClusterIP/NodePort/LoadBalancer), endpoint slice, kube-proxy iptables vs IPVS, DNS for pods
- Autoscaling: HPA (metrics-server, custom metrics, KEDA), VPA (recommender/updater/admission), cluster-autoscaler (CAAS/Karpenter)
- Pod lifecycle: init containers, postStart/preStop, readiness/liveness/startup probes, termination grace period, PodDisruptionBudget
- Admission webhooks: MutatingWebhookConfiguration, ValidatingWebhookConfiguration, common use (sidecar injection, policy enforcement)

### Security (new)
- OWASP Top 10: A01 Broken Access Control, A02 Crypto Failures, A03 Injection — understand each, not just the name
- TLS deep dive: 1.2 vs 1.3 handshake details, cipher suite negotiation, forward secrecy (ECDHE), certificate chains, mTLS, CRL vs OCSP vs Must-Staple, CT logs, CA ecosystem
- Secret management: HashiCorp Vault (kv, transit, dynamic secrets, auth methods), SOPS (GPG/AWS KMS/Azure Key Vault), sealed-secrets (K8s), external-secrets-operator
- Encryption: symmetric (AES-GCM, ChaCha20-Poly1305), asymmetric (RSA, ECDH, Ed25519), hashing (SHA-256, bcrypt, argon2, PBKDF2), post-quantum (ML-KEM, HPKE 1.26)
- SAST/DAST: Semgrep, Snyk, CodeQL, SonarQube for SAST; OWASP ZAP, Burp Suite for DAST
- Dependency scanning: Trivy (OS + library vulns), Dependabot, Snyk, renovate, CVE triage, SBOM (CycloneDX, SPDX)
- Supply chain security: SLSA levels, in-toto attestation, cosign (container signing), sigstore, binary provenance
- Runtime security: Falco (syscall monitoring), Seccomp profiles, AppArmor/SELinux, Capabilities
- Cloud security: IAM policies (least privilege), VPC design, security groups vs NACLs, KMS key hierarchy

### Observability (new)
- OpenTelemetry: SDK architecture (TracerProvider, SpanProcessor, Sampler, Exporter), context propagation (W3C traceparent), sampling strategies (head-based, tail-based, consistent probability)
- Metrics: counter, gauge, histogram, summary — when each, Prometheus exposition format, exemplars, cardinality explosion in metrics (label explosion, bucket saturation)
- Logging: structured vs unstructured, log levels, sampling, log aggregation (Loki, ELK), log volumes and cost
- Tracing: span, trace, parent-child relationship, trace context propagation, sampling, distributed trace debugging
- Continuous profiling: CPU, heap, goroutine, mutex, block profiles — always-on profiling (Pyroscope, Parca, Google profiler)
- Alerting: PromQL for alerts (rate, predict_linear, histogram_quantile), Alertmanager grouping/inhibition/silencing, SLO-based alerting (burn rate, multi-window, multi-burn-rate)
- SLO/SLI: error budget, burn rate policies, alert on burn rate (not absolute error), multi-window approach, Google CRE patterns

### Distributed Messaging (beyond Kafka)
- Apache Pulsar: segment-centric architecture, separate compute/storage (BookKeeper), geo-replication, topic compaction, function API
- Redpanda: Kafka-compatible, no JVM, no ZooKeeper, raft-based controller, faster for small clusters
- NATS: JetStream, at-least-once/exactly-once, key-value store, object store, super-cluster, leaf nodes — very different from Kafka
- Message ordering: partition-scoped ordering, global ordering (single partition — kills throughput), idempotent producers
- Exactly-once semantics: idempotent producer + transactional producer + idempotent consumer (Kafka EOS), idempotency key pattern
- Dead letter queues: retry with backoff, max retry threshold, DLQ routing, DLQ replay, poison pill detection
- Schema registry: Avro/Protobuf/JSON Schema compatibility rules (BACKWARD, FORWARD, FULL, NONE), schema evolution

## Testing
- Unit vs Integration vs E2E — when each, trade-offs
- Test doubles: mock, stub, fake, spy, dummy
- Deterministic simulation testing (FoundationDB style, Jepsen, Maelstrom)
- Flaky test detection and mitigation
- Load testing: k6, vegeta, hey, wrk2 — saturate, spike, soak
- Chaos engineering: Litmus, Chaos Mesh, Gremlin — inject latency, partition, OOM
- Test coverage: statement, branch, mutation testing
- CI integration: gate on coverage diff, race detector forced, lint as test
- Golden file testing — for large structured outputs
- Property-based testing — quickcheck, rapid (Go library)
- Behavior-driven testing — godog (Cucumber in Go)

## Architecture & Meta
- ADRs (Architecture Decision Records) — format, examples, trade-off catalog
- Domain-Driven Design: bounded context, aggregate, event storming, ubiquitous language
- CQRS and Event Sourcing: separate read/write models, event store, projections
- API versioning strategies: URL versioning, header versioning, content negotiation, contract testing
- Backwards compatibility: additive changes, field deprecation, wire format changes
- Operational excellence: runbooks, SLI/SLO/SLA, error budget policy, on-call rotation
- Evolutionary architecture: fitness functions, incremental change, strangler fig pattern
- Cost engineering: cloud cost allocation, right-sizing, reserved instances, spot instances
- Risk assessment: blast radius analysis, blast radius reduction, gradual rollout, feature flag gating
