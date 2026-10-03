---
name: problem-definition
description: Turn discovery evidence or user context into a problem specification with affected users, evidence separated from assumptions, a measurable success signal, and explicit non-goals. Use before solution work when defining a problem, writing a problem statement, or preparing requirements or a PRD.
---

# Problem Definition

Consolidate what is known about a problem before designing a solution. Weak or assumed premises spread into every downstream artifact.

## Inputs

- Discovery evidence such as interview findings, hypotheses, or opportunity assessments from `/inspired-product-discovery`; or
- Direct user context when discovery has not been run.

If evidence is thin, state what is unknown and record assumptions. Never invent user quotes, observations, or data.

## Process

1. State the problem in users' words. Quote evidence when available; label paraphrases or interpretations as inference.
2. Identify affected users, how often the problem occurs, and their current workarounds.
3. Mark every load-bearing claim as exactly one of:

```text
EVIDENCE   observed in an interview, data, log, or reproduction
ASSUMPTION believed but not yet observed
```

4. Define a measurable, observable success signal.
5. List adjacent problems that are explicitly out of scope.
6. Write `docs/agents/problem-<slug>.md` using this template, then review it with the user:

```md
# Problem: <slug>

## Problem statement
<The problem in users' words.>

## Affected users
<Segments, frequency, and current workarounds.>

## Evidence
- [EVIDENCE] <claim — source>
- [ASSUMPTION] <claim — how it could be validated>

## Success signal
<Observable change indicating the problem is solved.>

## Non-goals
- <Adjacent problem explicitly out of scope.>
```

## Rules and handoffs

- Do not design solutions, name technologies, or sketch architecture. Solution specification starts at `/outcome-constraint-engineering`.
- Do not promote assumptions to facts. Hand off unresolved load-bearing assumptions explicitly; validate them first when possible.
- Prefer a few strong claims over a long, weak document.
- Upstream: `/inspired-product-discovery` supplies evidence. Downstream: `/outcome-constraint-engineering` defines outcomes, invariants, constraints, and fitness functions; `/to-prd` can reuse the problem statement.
