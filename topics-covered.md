---
created: 2026-06-29
---

# Topics Covered (Per File)

## Database (14 files)
- `taxonomy.md` — relational, document, key-value, wide-column, time-series, graph, search, vector, NewSQL
- `indexing.md` — cardinality, clustered vs non-clustered, composite index & leftmost prefix, B+Tree, hash index, GiST, GIN, BRIN, SP-GiST, covering index, partial index, functional index
- `storage-engines.md` — B-Tree vs LSM-Tree vs Heap, pages, splitting/merging, LSM-Tree SSTables/MemTable/compaction
- `concurrency-and-scaling.md` — ACID, isolation levels, race conditions, SELECT FOR UPDATE, row-level locking, deadlock, MVCC summary, replication, sharding
- `algorithms.md` — MVCC (PostgreSQL, InnoDB, Cassandra), WAL (write-ahead log), consensus (Paxos, Raft), gossip protocol
- `specialized-databases.md` — vector databases (HNSW, IVF, DiskANN), time-series (InfluxDB, TimescaleDB, ClickHouse), graph (Neo4j, Dgraph), search (Elasticsearch)
- `deep-dives/postgresql.md` — heap storage, CTID, process-per-connection, VACUUM, HOT updates
- `deep-dives/mysql-innodb.md` — clustered B+Tree, buffer pool, change buffer, undo log, UUID PK fragmentation
- `deep-dives/mongodb.md` — BSON documents, aggregation pipeline, schema validation, embedded vs reference
- `deep-dives/redis.md` — single-threaded event loop, RDB/AOF persistence, data structures
- `deep-dives/cassandra.md` — LSM-Tree, last-write-wins, hinted handoff, compaction
- `deep-dives/spanner.md` — TrueTime, Paxos, global consistency, commit-wait
- `deep-dives/sqlite.md` — embedded B-Tree, WAL mode, manifest typing, single-writer
- `deep-dives/sql-server.md` — clustered vs heap, forwarding pointers, clustering key width

## Economy (30 files)
- `micro/supply-demand.md` — supply/demand curves, equilibrium, elasticity, surplus
- `micro/market-structures.md` — perfect competition, monopoly, oligopoly, monopolistic competition
- `micro/market-intervention.md` — price controls, taxes, subsidies, tariffs, quotas
- `micro/game-theory.md` — Nash equilibrium, prisoner's dilemma, mixed strategies, sequential games
- `micro/welfare-efficiency.md` — Pareto efficiency, Kaldor-Hicks, social welfare functions
- `micro/externalities.md` — positive/negative externalities, Pigouvian tax, Coase theorem, public goods
- `micro/production.md` — production functions, returns to scale, cost minimization, profit maximization
- `micro/labor-markets.md` — compensating differentials, human capital, efficiency wages
- `micro/frontiers.md` — mechanism design, matching theory, experimental economics
- `macro/gdp-cpi.md` — GDP calculation, CPI, GDP deflator, limitations
- `macro/unemployment.md` — frictional/structural/cyclical, NAIRU, Okun's law, Beveridge curve
- `macro/ad-as.md` — aggregate demand, SRAS vs LRAS, supply shocks
- `macro/monetary.md` — central bank tools, quantitative easing, forward guidance, transmission mechanism
- `macro/phillips-curve.md` — short-run tradeoff, long-run vertical, expectations-augmented
- `macro/open-economy.md` — exchange rate regimes, Mundell-Fleming, impossible trinity, PPP
- `macro/solow-growth.md` — production function, steady state, golden rule, convergence
- `macro/growth-finance.md` — endogenous growth, creative destruction, institutions
- `global/dollar-system.md` — Triffin dilemma, reserve currency, petrodollar, dedollarization
- `global/exchange-rates.md` — nominal vs real, Big Mac index, carry trade, interventions
- `global/capital-flows.md` — hot money vs FDI, push/pull factors, sudden stops
- `global/trade.md` — comparative advantage, Heckscher-Ohlin, gravity model, trade wars
- `global/supply-chain.md` — global value chains, reshoring, bullwhip effect, JIT vs JIC
- `global/sovereign-debt.md` — debt sustainability, defaults, IMF programs
- `global/shadow-banking.md` — money market funds, repo market, run risk
- `global/export-controls.md` — entity lists, sanctions, extraterritoriality
- `global/energy-geopolitics.md` — OPEC, LNG markets, critical minerals
- `global/climate-finance.md` — carbon pricing, green bonds, transition finance
- `global/digital-currency.md` — CBDCs, stablecoins, DeFi, cross-border payments
- `global/financial-crises.md` — Asian crisis, GFC 2008, European debt, COVID response
- `behavioral/behavioral-economics.md` — prospect theory, framing, hyperbolic discounting, nudge

## Distributed Systems (2 files)
- `etcd-raft.md` — Raft consensus, leader election, WAL, MVCC store, log replication, progress tracking, pre-vote, quorum, linearizable reads, PageWriter, CRC chain
- `syncthing.md` — P2P file sync, mutual TLS, Device ID, block-level delta sync, version vectors, relay fallback, discovery (LAN/global), conflict resolution

## System Design (4 files)
- `introduction.md` — scalability, availability, latency vs throughput, fault tolerance, load balancing, SQL vs NoSQL, caching, CAP theorem, sharding, replication, DNS, CDNs, API design, observability
- `cache-stampede-flash-sale.md` — cache stampede, thundering herd, request coalescing (singleflight), probabilistic early expiration, multi-tier cache, pre-warming
- `distributed-task-scheduler-batch-job-processing.md` — distributed task scheduler, PostgreSQL FOR UPDATE SKIP LOCKED, time-based partitioning, visibility timeout, leader election, priority queues, backpressure, at-least-once with idempotency
- `saas-template.md` — modular monolith architecture, goal/non-goals, constraints, core features spec, directory structure, module boundaries, abstraction depth, implementation phases, testing strategy (unit + integration)

## Math (6 files)
- `precalculus/summary.md` — linear, quadratic, polynomial, rational, exponential, logarithmic, absolute value, piecewise functions, complex numbers, binomial theorem
- `trigonometry.md` — SOH CAH TOA, unit circle, radians, identities (Pythagorean, sum/difference, double/half-angle), Law of Sines, Law of Cosines, inverse trig
- `sequence-series-limit.md` — arithmetic/geometric sequences, infinite series, convergence, limits
- `calculus.md` — derivatives, power rule, rate of change, limit definition of derivative
- `linear-algebra.md` — vectors, dot product, cosine similarity, matrix multiplication, Gaussian elimination, LU/QR decomposition, SVD, rank/nullspace
- `summary.md` — trigonometry + algebra synthesis

## AI/ML (8 files)
- `neural-network-fundamentals.md` — perceptron, activation functions, loss functions, gradient descent, backpropagation, MLP, batch normalization, layer norm, bias-variance, training pipeline, optimizers (Adam, AdamW), scaling laws, RLHF, DPO, prompting (CoT, ToT, ReAct), frontier training, **embeddings** (training, models, similarity, dimensionality, Matryoshka, chunking), **evaluation** (perplexity, BLEU, ROUGE, BERTScore, LLM-as-judge, MT-Bench, Chatbot Arena, Elo, MMLU, HumanEval, SWE-bench, GSM8K, human eval)
- `ai-infra.md` — vLLM, continuous batching, PagedAttention, prefix caching, speculative decoding, tensor/pipeline/data/expert parallelism, TTFT/TPOT metrics, HuggingFace Hub
- `fine-tuning.md` — full fine-tuning, LoRA, QLoRA, prefix tuning, prompt tuning, IA3, dataset curation, catastrophic forgetting, Axolotl, Unsloth, TRL
- `inference-engines.md` — vLLM vs SGLang vs TensorRT-LLM vs TGI vs Ollama vs llama.cpp comparison, decision table
- `quantization.md` — PTQ vs QAT, AWQ, GPTQ, bitsandbytes (NF4), GGUF, FP8, groupsize, perplexity impact, vLLM quantization support
- `deepseek-v4-flash.md` — Transformer foundations, MLA (Multi-Head Latent Attention), KV compression, MoE with 256 experts, auxiliary-loss-free load balancing, MTP (Multi-Token Prediction), GRPO, FP8 training, synthetic data pipeline, test-time compute, DualPipe parallelism, FlashMLA, DeepGEMM, serving architecture, benchmarks
- `transformer-inference.md` — Transformer architecture (scaled dot-product attention, QKV projections, multi-head, layer flow, residuals, layer norm), autoregressive decoding, KV cache, BPE tokenization, softmax/temperature
- `modal-gemma4-h200.md` — Modal serverless, vLLM config, cold start anatomy, GPU memory snapshots, H200 deployment, CUDA graphs, cost model, API auth, rate limiting

## RAG (1 file)
- `rag.md` — ingestion (deterministic IDs, contextual embedding), chunking (recursive, sentence window), embedding (Ollama + nomic-embed-text, Qdrant), retrieval (hybrid search, semantic cache, reranking, RRF fusion), generator (Lost in the Middle, streaming), evaluation (Recall@k, MRR, NDCG, MAP, RAGAS), tests

## React (1 file)
- `reactjs.md` — declarative model, Virtual DOM, JSX, rendering lifecycle (render/commit), reconciliation, batching, Fiber architecture, useState, useReducer, useRef, useEffect, useLayoutEffect, Strict Mode, Context, React.memo, useMemo, useCallback, code splitting, virtualization, useTransition, useDeferredValue, Suspense, Server Components, Portals, flushSync, useEffectEvent, Error Boundaries

## Go (2 files)
- `goroutine.md` — GPM scheduler, work stealing, channels (hchan internals), select, closure capture, Mutex/RWMutex, WaitGroup, atomic, worker pool, errgroup, goroutine leak detection
- `strings.md` — string concatenation, strings.Builder, strings.Join, substring slicing, runes & UTF-8, strings package

## Fundamentals (7 files)
- `networking.md` — DNS resolution, TCP handshake, TLS, HTTP/1.1/2/3, caching, cookies/sessions/JWT, CORS, CDNs, load balancers, NAT (STUN/TURN/ICE)
- `computing.md` — CPU architecture, memory hierarchy, virtual memory, stack vs heap, VRAM vs RAM
- `kafka.md` — broker architecture, topics/partitions, log segments, ISR, replication, ZooKeeper vs KRaft, producer acks, consumer groups, rebalancing, retention, compression
- `rabbitmq.md` — AMQP 0-9-1, topology manager, dead-letter exchange, retry queues, consumer acknowledgements, publisher confirms
- `oauth2-and-oidc.md` — authorization code + PKCE, ID token validation, session management, token refresh, middleware, logout
- `api-design-guidelines.md` — data integrity, rate limiting, cursor pagination, idempotency keys, circuit breakers, RBAC/ABAC, HTTP semantics, versioning
- `software-architecture.md` — architecture characteristics, modularity, governance, fitness functions, fallacies of distributed computing

## Data Pipeline (5 files)
- `index.md` — pipeline architecture overview, constraints, stages
- `ingestion.md` — data collection, CDC (Debezium/WAL), priority queue, DLQ, retry
- `idempotency.md` — optimistic locking, state machine, worker claim flow, at-least-once, hot-spot keys
- `infrastructure.md` — semantic caching, hot state offload (Redis), horizontal partitioning, guaranteed queue partitioning
- `retrieval.md` — metadata filtering, hybrid search (dense + sparse + RRF), cross-encoder reranking, evaluation

## Psychometric System (1 file)
- `psycho.md` — architecture spec, Big Five (OCEAN), Regulatory Focus, Need for Cognition, LIWC dictionary, module boundaries (ingest/analyze/profile), SQLite storage, implementation phases

## Personal / Experience (1 file)
- `introduction.md` — work experience (BookCabin itinerary system, BFI finance multi-collateral loan, M+ payment integration), projects (Golang SDK, Golang template, RAG Nadir), tech stack (Golang, Temporal, SolidJS, Docker, GCP, Redis, RabbitMQ, Nats, Python, SqlServer, AWS)

# Lattice Work (Charlie Munger Mental Models) — Unexplored

Mental models from other disciplines not yet studied. To fill the latticework.

**Psychology / Cognitive Biases**
- Incentive super-response tendency, Pavlovian association, social proof, Kantian fairness, admiration/jealousy, reciprocation, influence-from-mere-association, love of precision, hate of uncertainty, consistency/commitment, deprivation-superreaction, B.F. Skinner operant conditioning, contrast-misreaction, stress-induced mental changes, availability/misweighing, anchoring, confirmation bias, overconfidence, Dunning-Kruger, hindsight bias, fundamental attribution error, curse of knowledge, planning fallacy, status quo bias, framing effect, sunk cost, hyperbolic discounting

**Business / Microeconomics**
- Porter's Five Forces, barriers to entry, switching costs, moats (brand, patent, network effect, cost, scale), pricing power, commoditization, competitive advantage period, value chain analysis, flywheel effect, survivorship bias in investing, circle of competence, margin of safety, Mr. Market allegory

**Physics & Engineering**
- Critical mass, tipping point, feedback loops (reinforcing vs balancing), leverage, breakpoints, redundancy, backup systems, margin of safety, inversion principle, multiplicative vs additive systems, all-twos-and-no-aces principle, man-with-a-hammer tendency

**Biology / Evolution**
- Natural selection, adaptation, extinction, Red Queen effect, competitive exclusion principle, niche specialization, punctuated equilibrium, replication (genes, memes), ecosystem dynamics, coevolution

**Mathematics / Statistics**
- Compound interest, regression to the mean, normal distribution vs power law (Pareto), law of large numbers, central limit theorem, Bayesian updating, base rates, sampling bias, multiplying by zero (catastrophic failure), independence vs dependence of events, permutation vs combination, expected value, asymmetric payoffs (Pascal's wager, ergodicity)

**History / Systems Thinking**
- Multi-disciplinary approach (avoid man-with-a-hammer), lollapalooza effects (multiple forces combining), inversion (solve backwards), first principles reasoning, second-order effects, emergent behavior, path dependence, lock-in, counterfactual reasoning
