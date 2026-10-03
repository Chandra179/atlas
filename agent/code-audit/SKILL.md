---
name: code-audit
description: Systematically review existing code for correctness, reliability, architecture, performance, validation gaps, dead code, and simplification or reuse opportunities. Use when asked to audit, review, or assess code health; report evidence-backed findings without fixing them unless asked.
---

# Code Audit

Audit the implementation within the user's requested scope. Keep the review read-only: do not change project files or trigger actions with material side effects. Report findings and suggested fixes; make changes only if the user separately asks for them.

## Set the scope

For a full health audit, assess the relevant areas below and give a compact coverage note. For a targeted review, stay with the requested concern instead of expanding into an unrelated audit. Distinguish **no findings** from **not assessed** or **not applicable**. If the intended product behavior or end state is unclear and affects a conclusion, state the limitation instead of inventing requirements.

## Review the implementation

- **Correctness and reliability:** Trace important paths through callers, state changes, and error handling. Look for incorrect behavior, boundary cases, missing validation, inconsistent state, unsafe retries, race conditions, fragile assumptions, and deprecated APIs or dependencies.
- **Architecture and maintainability:** Examine module boundaries, separation of concerns, dependency direction, data and state ownership, API and persistence boundaries, concurrency, background work, external dependencies, deployment assumptions, observability, and extensibility. Relate architecture concerns to known product needs; prefer incremental improvements, and recommend a rewrite only when smaller changes cannot address a demonstrated problem.
- **Performance:** Identify credible bottlenecks in algorithms, queries, network and disk I/O, serialization, caching, memory or CPU use, startup/build time, rendering, latency, polling, or background work. Ground claims in code paths or available measurements; avoid speculative micro-optimizations.
- **Simplification and reuse:** Look for hand-rolled code that a standard-library call or simpler proven algorithm covers, deep nesting that guard clauses could flatten, and redundant checks for conditions that cannot occur. Prefer simpler established approaches when behavior is unchanged and they make the code easier to understand.
- **Dead or obsolete code:** Check references, call sites, configuration, feature flags, tests, documentation, and dependency use before claiming something is unused. Recommend removal only when supported behavior can be preserved; do not remove code during an audit.

Use source inspection and relevant read-only diagnostics to corroborate concerns. Treat suspicion as an open question, not a finding, unless you verify the code path and conditions. Do not imply runtime or performance behavior was measured when it was not.

## Report findings

Order findings by impact. For each finding include:

- **Location:** file and line reference.
- **Area:** correctness/reliability, architecture/maintainability, performance, simplification/reuse, or dead/obsolete code.
- **Issue and impact:** what happens, under which conditions, and why it matters, supported by code evidence.
- **Suggested fix:** a recommendation only; do not apply it during the audit.

If no confirmed issues are found, say so and briefly state what you reviewed and any material areas that remain unverified or out of scope. This audit can provide code-health evidence to `/fitness-verification` when an `/outcome-constraint-engineering` specification is in use.
