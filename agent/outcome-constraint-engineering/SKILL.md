---
name: outcome-constraint-engineering
description: Build and improve software by preserving user outcomes, invariants, and hard constraints while allowing implementation details to evolve. Use when defining requirements, planning a feature, refactoring, rewriting, replacing a dependency or architecture, or deciding whether a change is safe — whenever the specification must be kept distinct from the implementation.
---

# Outcome-Constraint Engineering

## Principle

Define the product by:

```text
USER OUTCOMES
+
INVARIANTS
+
HARD CONSTRAINTS
```

Treat the implementation between input and output as replaceable. The specification is stable. The implementation is evolutionary.
Architecture, algorithms, frameworks, models, storage systems, deployment topology, and internal approaches may change as long as required outcomes, invariants, and hard constraints remain satisfied.

A system is considered equivalent when it preserves:

1. required user outcomes
2. invariants
3. hard constraints

Everything else is eligible for replacement unless explicitly specified otherwise.

## Requirement Types

Classify requirements as:

- **Outcome** — what the user must be able to accomplish
- **Invariant** — what must remain true
- **Constraint** — a hard boundary that cannot be violated
- **Preference** — desirable but negotiable
- **Implementation** — an internal choice that may change
- **Fitness Function** — how an outcome, invariant, or constraint is verified

Example:

```text
p95 latency < 300 ms      -> constraint
must run offline          -> constraint
user can recover drafts   -> invariant
minimize infrastructure cost -> preference
use PostgreSQL            -> implementation/preference
use Redis                 -> implementation
use microservices         -> implementation unless explicitly required
use model X               -> implementation unless explicitly required
load test p95 latency     -> fitness function
```

## Precedence

When requirements conflict:

```text
1. Required outcomes must be preserved.
2. Invariants must remain true.
3. Hard constraints must not be violated.
4. Preferences may be traded off.
5. Implementation choices are expendable.
```

Do not silently weaken an outcome, invariant, or hard constraint in order to make an implementation work. If requirements conflict and cannot all be satisfied, surface the conflict explicitly.

## Workflow

Each step contributes to the Core Model at the end of this file.

### 1. Define the outcome

State what the user must achieve.

Prefer observable behavior:

```text
Given X input, the system must produce Y outcome.
```

Examples:

```text
Given a valid order,
the user must receive confirmation that the order was accepted.
```

```text
Given a previously saved draft,
the user must be able to recover it after restarting the application.
```

Do not define the product by its current implementation.

Prefer:

```text
The user can recover their draft.
```

over:

```text
Drafts are stored in PostgreSQL.
```

### 2. Define invariants

List what must remain true even if the implementation changes.

Examples:

- required output remains correct
- required actions are completed
- unsupported data is not invented
- persistent state is not corrupted
- user-visible behavior remains compatible where compatibility is required
- retries do not duplicate non-idempotent actions
- unauthorized users cannot access protected data
- failures leave the system in a defined state

Make invariants observable and testable where possible.

Prefer:

```text
If payment fails, the order must not be marked as paid.
```

over:

```text
Payment failures must be handled safely.
```

Prefer:

```text
For invalid input, persistent state must remain unchanged.
```

over:

```text
Invalid input should not cause problems.
```

### 3. Define hard constraints

Specify measurable boundaries where relevant.

```yaml
cpu:
memory:
latency:
throughput:
storage:
cost:
availability:
security:
privacy:
compatibility:
deployment:
data:
```

Examples:

```text
p95 latency <= 300 ms
memory <= 512 MB
monthly infrastructure cost <= $10,000
must operate without network connectivity
availability >= 99.95%
```

Unknown constraints must remain unknown rather than being invented.

Do not convert assumptions into constraints.

### 4. Define preferences

Preferences influence optimization but may be traded off.

Examples:

```text
prefer lower latency
prefer simpler architecture
prefer lower operating cost
prefer fewer dependencies
prefer easier maintenance
```

A preference is not a pass/fail requirement.

For example:

```text
p95 latency <= 300 ms
```

is a constraint.

But:

```text
minimize latency
```

is a preference or optimization objective.

### 5. Separate fixed from flexible

For every requirement or design decision, determine whether it belongs to the specification or the implementation, using the classification examples under Requirement Types.

Do not preserve existing architecture merely because it already exists.

Implementation decisions should become hard requirements only when there is an explicit reason.

### 6. Define fitness functions

Define how important outcomes, invariants, and constraints will be verified.

A fitness function is an objective check that determines whether a required property still holds as the implementation evolves.

Examples:

```text
p95 latency < 300 ms
-> production-like load test
```

```text
drafts survive application restart
-> restart recovery integration test
```

```text
services may not directly access another service's database
-> architecture test / static analysis
```

```text
monthly infrastructure cost <= $10,000
-> billing or cost-model check
```

```text
invalid requests must not mutate persistent state
-> integration test comparing state before and after request
```

Fitness functions may include:

- unit tests
- integration tests
- end-to-end tests
- property-based tests
- architecture tests
- static analysis
- benchmarks
- load tests
- security tests
- schema validation
- cost checks
- availability/SLO measurements
- data-quality checks
- manual verification where automation is impractical

Prefer automated fitness functions where practical.

If something cannot be automatically verified, define the available verification method explicitly.

If no reliable verification method exists, mark it as:

```text
UNVERIFIED
```

rather than assuming it is satisfied.

### 7. Choose the implementation

Find the simplest implementation that satisfies all required outcomes, invariants, and hard constraints.

Only after feasibility is established should the implementation be optimized according to preferences.

Optimize for relevant objectives such as:

- correctness
- simplicity
- latency
- CPU usage
- memory usage
- cost
- reliability
- maintainability
- operational complexity

Do not optimize attributes that are irrelevant to the actual requirements.

### 8. Verify

A change is valid only when the relevant fitness functions provide sufficient evidence that the specification is still satisfied.

Example:

```text
[ ] required user outcomes pass
[ ] invariants pass
[ ] CPU constraints pass
[ ] memory constraints pass
[ ] latency constraints pass
[ ] throughput constraints pass
[ ] cost constraints pass
[ ] availability requirements pass
[ ] security/privacy requirements pass
[ ] data requirements pass
[ ] compatibility requirements pass
```

For each requirement, record one of:

```text
VERIFIED
FAILED
UNVERIFIED
NOT APPLICABLE
```

Do not treat an unmeasured property as verified.

A failed hard constraint invalidates the implementation even if other metrics improve.

## Fitness Function Model

Where practical, represent important requirements explicitly:

```yaml
id: latency-001
type: constraint
statement: "p95 request latency must remain below 300 ms"
fitness_function: "load test using production-equivalent workload"
status: verified
evidence: "benchmark run 2026-10-02"
```

Example invariant:

```yaml
id: draft-001
type: invariant
statement: "saved drafts survive application restart"
fitness_function: "restart recovery integration test"
status: verified
```

Example outcome:

```yaml
id: checkout-001
type: outcome
statement: "a user with a valid cart can complete checkout"
fitness_function: "checkout end-to-end test"
status: verified
```

The relationship is:

```text
OUTCOME / INVARIANT / CONSTRAINT
                |
                v
        FITNESS FUNCTION
                |
                v
             EVIDENCE
```

A requirement without verification is an unverified requirement.

## Data

Define required data by its properties rather than by its current implementation.

Specify:

- source or source characteristics
- required fields
- freshness
- quality
- consistency
- permissions
- privacy
- retention
- provenance where relevant

Prefer:

```text
inventory data must be <= 60 seconds old
```

instead of:

```text
inventory must come from Redis
```

Prefer:

```text
customer records must be retrievable by customer ID
with p95 lookup latency <= 100 ms
```

instead of:

```text
customer records must be stored in PostgreSQL
```

unless PostgreSQL itself is a hard requirement.

A particular data store, cache, framework, vendor, model, or transport should normally remain an implementation detail.

## Change Rule

Implementation may change freely.

Outcomes, invariants, and hard constraints may not change implicitly.

If satisfying one requirement requires violating another:

1. identify the conflict
2. do not silently choose a tradeoff
3. mark the affected requirement as failed or unverified
4. require an explicit specification change before proceeding

## Core Model

```text
SPECIFICATION
|
+-- Outcomes
|     What users must be able to accomplish
|
+-- Invariants
|     What must remain true
|
+-- Hard Constraints
|     Boundaries that cannot be crossed
|
+-- Preferences
|     Negotiable optimization objectives
|
+-- Fitness Functions
      How requirements are verified
            |
            v
          Evidence

            v

        IMPLEMENTATION SPACE

architecture
algorithms
frameworks
models
databases
caches
deployment topology
protocols
internal APIs
vendors
infrastructure

            v

        OPTIMIZATION

Choose the simplest implementation that satisfies
the specification and optimize remaining preferences.
```

## Summary

```text
The specification defines what must survive change.
The implementation is allowed to evolve.
Do not confuse the current implementation with the product itself.
```
