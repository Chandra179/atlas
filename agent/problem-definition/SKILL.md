---
name: problem-definition
description: Turn discovery evidence or raw context into a validated problem specification before any solution work. Produces a durable problem statement with affected users, evidence separated from assumptions, a measurable success signal, and explicit non-goals. Use when moving from an idea or discovery findings to defining the problem to solve, writing a problem statement, or preparing for requirements, constraints, or PRD work.
---

# Problem Definition

Consolidate what is known about a problem into a specification, before any solution work. Weak problem definitions propagate forward — every downstream artifact inherits their assumptions.

## Inputs

- Discovery evidence from `/inspired-product-discovery` (interview findings, hypotheses, opportunity assessments), or
- direct user context when discovery has not been run.

If the evidence is thin, say so and record what is assumed. Do not invent user statements, quotes, or data.

## Process

1. Restate the problem in the users' words. Quote evidence where it exists. Paraphrase only what has no quote, and mark it as inference.
2. Identify the affected users: who has the problem, how often, and what they do today. Current workarounds count as evidence of pain.
3. Separate evidence from assumption. Every load-bearing claim gets exactly one of:

```text
EVIDENCE   observed — interview, data, log, reproduction
ASSUMPTION believed but unobserved
```

4. Define the success signal: the observable change that would show the problem is solved. Keep it measurable — it is the raw material the outcome spec will harden into outcomes, invariants, and constraints.
5. List explicit non-goals: adjacent problems that will not be addressed, so scope debates end here instead of during design.
6. Write the artifact (template below) to `docs/agents/problem-<slug>.md` and review it with the user.

## Artifact

```md
# Problem: <slug>

## Problem statement
<The problem, in the users' words.>

## Affected users
<Segments, frequency, current workarounds.>

## Evidence
- [EVIDENCE] <claim — source>
- [ASSUMPTION] <claim — how it could be validated>

## Success signal
<Observable change that indicates the problem is solved.>

## Non-goals
- <Adjacent problem explicitly not addressed.>
```

## Rules

- Do NOT design solutions, name technologies, or sketch architecture. Solution work starts at `/outcome-constraint-engineering`.
- Do NOT convert assumptions into facts. An unvalidated load-bearing assumption blocks the handoff — either validate it or hand off with it flagged.
- Prefer fewer, stronger claims over a long weak document.

## Handoffs

- Upstream: `/inspired-product-discovery` supplies the evidence; this skill consolidates it into one artifact.
- Downstream: `/outcome-constraint-engineering` turns the success signal into outcomes, invariants, hard constraints, and fitness functions. `/to-prd` reuses the problem statement verbatim.
