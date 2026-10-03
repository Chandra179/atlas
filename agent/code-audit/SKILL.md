---
name: code-audit
description: Review existing code for correctness, reliability, architecture, performance, validation gaps, dead code, and simplification or reuse opportunities. Use when asked to audit, review, or assess code health; report evidence-backed findings without fixing them unless asked.
---

# Code Audit

Perform a read-only review of the current implementation. Report findings and suggested fixes; do not change code unless explicitly asked. Inspect each relevant area below and explain when an area does not apply.

## Review areas

- **Correctness and reliability:** incorrect behavior, edge cases, races, error handling, validation gaps, inconsistent state, and fragile patterns.
- **Architecture:** module boundaries, separation of concerns, dependency direction, data flow and ownership, APIs, persistence, concurrency, background work, external services, deployment assumptions, observability, and extensibility. Assess fit for the intended product; prefer incremental improvements and recommend a rewrite only when smaller changes cannot solve the problem.
- **Performance:** meaningful costs in algorithms, queries, network or disk I/O, serialization, caching, memory, CPU, startup/build time, latency, rendering, polling, or background work. Prefer measured issues; avoid speculative micro-optimization.
- **Simplification and reuse:** hand-rolled implementations a standard library call or simpler proven algorithm already covers, deep nesting that early-return guard clauses would flatten, and redundant checks such as nil checks on values that cannot be null. Prefer the standard library or flatter control flow when behavior is unchanged; hand-rolled replacements of built-ins tend to hide intent and miss edge cases.
- **Dead or obsolete code:** unused or unreachable code, replaced implementations, unsupported legacy paths, duplicate behavior, stale flags/configuration, unused dependencies, and outdated compatibility layers.

## Evidence and safety

- Verify each suspected issue against code or available evidence before reporting it. Separate confirmed findings from unknowns; do not present suspicion as fact.
- Recommend removal only when behavior can be preserved. If removal is requested, check related tests, configuration, documentation, comments, dependencies, and feature flags.
- Keep recommendations proportionate to demonstrated impact and the product's actual needs.

## Output

For each finding, include:

- File and line location.
- Area: correctness/reliability, architecture, performance, simplification/reuse, or dead code.
- What is wrong and why it matters.
- A suggested fix, clearly marked as a suggestion.

Order findings by severity. If no actionable issues are found, say so and note any review limits. This audit can supply code-health evidence to `/fitness-verification` when an `/outcome-constraint-engineering` specification is in use.
