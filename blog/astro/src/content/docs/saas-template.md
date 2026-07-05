---
title: "SaaS Template"
aliases: []
created: "2026-06-13"
modified: "2026-07-05"
---

# SaaS Template

## Goal

\[One sentence. What are we building?]

## Non-goals

* \[What we're NOT doing]

## Numbers

* QPS: \_\_\_\_\_\_
* Storage: \_\_\_\_\_\_ / year
* Latency target: \_\_\_\_\_\_

## Constraints

\[Rules that limit complexity. Prevents over-engineering.]

* \[Constraint e.g., "Only handle statuses: PENDING, COMPLETED, FAILED"]
* \[Constraint e.g., "Single tenant. No isolation logic."]
* \[Constraint e.g., "Max 3 retries. No custom retry policies."]
* \[Constraint e.g., "No update or delete of submitted tasks."]

***

## Core Features

\[Features without which the app is useless. Must ship in MVP.]

#### Feature 1: \[Name]

**What it does:** \[One sentence.]

**Risks we tolerate:**

* \[Risk e.g., "No authentication on this endpoint"]
* \[Risk e.g., "Data loss if process crashes mid-write"]

**Trusted sources:**

* paper or articles or books

#### Feature 2: \[Name]

**What it does:** \[One sentence.]

**Risks we tolerate:**

* \[Risk]
* \[Risk]

**Trusted sources:**

* paper or articles or books

#### Feature 3: \[Name]

**What it does:** \[One sentence.]

**Risks we tolerate:**

* \[Risk]

**Trusted sources:**

* paper or articles or books

***

## Software Architecture

use modular monolith architecture

#### Core flow

\[Paragraphs. Use bullet lists when needed.]

#### Storage choice & why

\[What + reasoning.]

#### **Directory Structure**

```
cmd/example/main.go # entrypoint starts HTTP + gRPC
modules/ # domain modules
 example/ # example module
 config.go # module-specific config struct
 dependencies.go # wire deps, load own config
 http.go # HTTP handlers + route registration
middleware/ # shared: recovery, request ID, timeout, validation
config/ # YAML loader + config.yaml
```

#### **Module boundaries**

\[Package 1] Responsibility\
\[Package 2] Responsibility\
\[Package 3] Responsibility

#### **Dependencies**

programming language standard library, open source packages, sidecar pattern, etc.)

#### Abstraction Depth per Modules

* use interfaces for swappable implementation
* do not over abstract
* add why we abstract it (the functions) why the module export this function to be usable to outside world

***

## Core Feature Implementation Phase

#### Phase 1: \[Feature A]

\[First working feature.]

* \[Task]
* \[Task]
* Testing

**Checkpoint:** \[What works when this phase is done]

#### Phase 2: \[Feature B]

* \[Task]
* \[Task]
* Testing

**Checkpoint:** \[What works]

***

## Testing Strategy

tests should be done after each phase implementation, we should breakdown the system to be independent and testable without waiting the apps fully build

#### Unit Tests

**What:** Domain logic. Core functionalities

**Example:**

* "Task with status COMPLETED cannot transition to IN\_PROGRESS"
* "Priority comparison correctly orders high-priority before low-priority with same scheduled\_at"

#### Integration Tests

**What:** Database interactions. Broker interactions. The poll-and-claim loop with real PostgreSQL. End-to-end claim → dispatch → worker acknowledgment.

**Example:**

* "Two concurrent schedulers claiming from same PENDING pool: exactly N tasks claimed, no duplicates"
* "Visibility timeout cleanup resets IN\_PROGRESS tasks stuck longer than timeout"
* "Worker idempotency: submitting the same task\_id twice results in single execution"
* use test-container if applicable
