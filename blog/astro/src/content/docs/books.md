---
title: Books
modified: '2026-08-16'
---

# Books

## Low-Level Systems & Runtime Engineering

**Database & Storage Engine Engineers** (PostgreSQL, RocksDB, DuckDB, ClickHouse, MongoDB)
- **What they write:** B+ Trees, LSM Trees (Log-Structured Merge-trees), Skip Lists, Bloom Filters, and LRU/ARC eviction caches.
- **Why standard packages fail:** Standard libraries store data in RAM. Storage engines must design data structures that map cleanly onto 4 KB disk pages to minimize disk I/O and handle crash recovery.

**High-Frequency Trading (HFT) & Ultra-Low Latency Systems**
- **What they write:** Lock-free queues, Ring Buffers, intrusive linked lists, and custom cache-aligned flat arrays.
- **Why standard packages fail:** Standard data structures scatter memory across RAM, causing CPU cache misses (L1/L2/L3) and latency from memory allocations or garbage collection pauses. HFT structures are designed to fit directly inside CPU cache lines for sub-nanosecond lookups.

**Compiler, Tooling, & Language Runtime Engineers** (LLVM, GCC, V8, Turbopack, esbuild, Vite)
- **What they write:** Abstract Syntax Trees (ASTs), Directed Acyclic Graphs (DAGs for dependency resolution), Graph Coloring algorithms for CPU register allocation, and Tri-color Marking algorithms for garbage collectors.
- **Why standard packages fail:** Source code and execution states are inherently graph structures. Resolving circular dependencies, optimizing syntax, and managing dynamic memory require specialized graph traversals.

**Network Stack & Operating System Engineers** (Linux kernel, eBPF, Cloudflare/AWS networking infrastructure)
- **What they write:** Radix Trees / PATRICIA Tries for IP routing tables, Ring Buffers for packet queues, and Red-Black Trees for the Linux Completely Fair Scheduler.
- **Why standard packages fail:** Matching an IP address against millions of subnet CIDR blocks in nanoseconds requires fast prefix matching using custom Radix Tries, which standard hash maps cannot provide.

**Concurrency in Go Systems Engineers**
- **What they write:** CSP pipelines, worker pools, fan-in/fan-out batch processors, lock-free primitives via `sync/atomic`, non-blocking channel selectors, and cancellation trees via `context.Context`.
- **Why standard packages fail:** Traditional OS threading allocates ~1 MB per thread and incurs costly kernel context switches. Go's M:N runtime multiplexes thousands of lightweight goroutines (starting with 2 KB stacks) onto OS threads, requiring engineers to design lock-free sync, prevent leaks, and eliminate data races under high concurrency.

## Platform Engineering & Cloud Infrastructure

**Infrastructure as Code (IaC) & Automation**
- **Mechanism:** Provisioning infrastructure programmatically (Terraform, OpenTofu, Pulumi, AWS CDK) stored in Git repositories, reviewed via PRs, and deployed through CI/CD pipelines.
- **Why ClickOps Fails:** Manual GUI setups induce configuration drift across environments, lack git commit history for auditing/rollbacks, and fail during high-pressure disaster recovery.

**Cloud Networking & Zero-Trust Architecture**
- **Scope:** Managing traffic flow and access boundaries across microservices, hybrid networks, and external endpoints using VPC Peering, Transit Gateways, BGP routing, and VPN tunnels.
- **Focus:** Crafting least-privilege IAM policies and enforcing zero-trust boundaries without creating access bottlenecks.

**Container Orchestration & Internal Developer Platforms (IDP)**
- **Scope:** Building developer platforms on Kubernetes (EKS/GKE) using Helm, Service Meshes (Istio/Linkerd), and GitOps operators (ArgoCD, Flux).
- **Focus:** Abstracting raw cloud infrastructure so application teams can test, scale, and ship code autonomously without touching AWS/GCP consoles.

**Cost Engineering (FinOps)**
- **Scope:** Managing and optimizing infrastructure spending against per-second cloud billing models.
- **Focus:** Designing dynamic auto-scaling policies, leveraging Spot/Preemptible instances, minimizing cross-AZ egress charges, and migrating workloads to ARM-based processors (Graviton).

**Cloud Architecture Frameworks (AWS Well-Architected / GCP Architecture Framework)**
- **Integration:** Standardized architectural whitepapers that formalize operational excellence, security, reliability, performance efficiency, and cost optimization into actionable operational reviews.

## Core Systems & Performance Reading List

**Observability Engineering: Achieving Production Excellence**
- **Author:** Charity Majors, Liz Fong-Jones, & George Miranda
- **What it covers:** Moving past traditional siloed metrics, logs, and traces into structured, high-cardinality, and high-dimensionality event data using OpenTelemetry and Service Level Objectives (SLOs).
- **Why read it:** Teaches how to debug non-deterministic microservice failures ("unknown-unknowns") in distributed systems.

**Systems Performance: Enterprise and the Cloud**
- **Author:** Brendan Gregg
- **What it covers:** Operating system behavior under extreme load, CPU instruction-per-cycle (IPC) analysis, memory bus locking, disk I/O bottlenecks, and profiling Linux kernels via eBPF and `perf`.
- **Why read it:** The definitive manual for top-down, systematic system profiling and bottleneck diagnosis.

**Operating Systems: Three Easy Pieces (OSTEP)**
- **Author:** Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau
- **What it covers:** Deep fundamentals of OS internals across virtualization (CPU/memory), concurrency (locks/threads), and persistence (file systems/journaling).
- **Why read it:** Establishes core mental models for process context switches, TLB management, and crash recovery.

**Algorithms for Modern Hardware**
- **Author:** Sergey Slotin
- **What it covers:** Bottom-up, hardware-aware code optimization leveraging SIMD vectorization (AVX-512), cache line prefetching, branch prediction, and bit manipulation.
- **Why read it:** Explains how to optimize algorithms beyond standard Big-O notation by designing for modern CPU pipeline mechanics.

**Programming Pearls**
- **Author:** Jon Bentley
- **What it covers:** Compact essays on algorithmic thinking, memory footprint reduction, performance tuning, and bit-level problem solving.
- **Why read it:** Cultivates resource-constrained engineering instincts when hardware limits are hard constraints.

**The Mythical Man-Month**
- **Author:** Fred Brooks
- **What it covers:** System architecture integrity, communication overhead, and Brooks' Law ("Adding manpower to a late software project makes it later").
- **Why read it:** Timeless principles on software project estimation and the organizational dynamics of building complex systems.

## Automated Testing & Quality Engineering Reading List

**Unit Testing Principles, Practices, and Patterns**
- **Author:** Vladimir Khorikov
- **What it covers:** Unit, integration, and end-to-end test design, test double strategies (mocks vs. stubs), test-driven development (TDD), and refactoring test suites for long-term maintainability.
- **Why read it:** Actionable guide for developer-led automated verification and building robust test suites without high maintenance overhead.

## Application Security & Cryptography Reading List

**Alice and Bob Learn Application Security**
- **Author:** Tanya Janca
- **What it covers:** OWASP Top 10 vulnerabilities, secure coding practices, authentication/authorization flaws, and integrating security controls into modern DevSecOps pipelines.
- **Why read it:** Modern, practical guide for developers to write secure code and prevent application-level vulnerabilities.

**Real-World Cryptography**
- **Author:** David Wong
- **What it covers:** Applied cryptographic primitives (AES, ECC, RSA), TLS 1.3, password hashing algorithms (Argon2), digital signatures, and real-world crypto implementation flaws.
- **Why read it:** Skips abstract mathematical proofs in favor of actionable patterns for implementing ciphers, key management, and encryption safely.

## Product Strategy & Execution Reading List

**Inspired: How to Create Tech Products Customers Love**
- **Author:** Marty Cagan
- **What it covers:** How top tech organizations operate using cross-functional Product Trios (Engineering, Product, Design) focused on business outcomes rather than output feature factories.
- **Why read it:** Primary reference for understanding product discovery, customer validation, and engineering's role in product strategy. *(Subsumes core concepts from Escaping the Build Trap and Continuous Discovery Habits).*

**Shape Up: Stop Cycling and Start Working Very Hard on the Right Things**
- **Author:** Ryan Singer (Basecamp)
- **What it covers:** A pragmatic alternative to traditional Scrum/Agile using 6-week cycles, "Shaping" work before building, and granting engineering teams full implementation autonomy.
- **Why read it:** Provides a structured, concrete framework for scoping projects, protecting engineering focus, and shipping high-value software without ticket micro-management.