---
name: fitness-verification
description: Verify implemented work against an outcome-constraint-engineering specification by running its fitness functions and reporting evidence for every requirement. Use after a feature, refactor, or fix when asked whether it meets the spec or is ready to ship.
---

# Fitness Verification

Run the specification's checks and report evidence. `/outcome-constraint-engineering` owns the requirements; this skill verifies them after implementation. This is not a generic code review.

## Inputs and scope

- A specification with requirement entries (`id`, `type`, `statement`, `fitness_function`) or equivalent.
- The change to verify: a diff, branch, or deployment.

If no specification with fitness functions exists, stop and help create one with `/outcome-constraint-engineering`. Enumerate every requirement; do not skip any. Mark non-applicable requirements with a reason.

## Verification

1. Run each executable fitness function (for example, tests, benchmarks, static checks, scripts, or cost queries).
2. For non-executable checks, find the strongest available evidence and state what is missing.
3. Assign exactly one status to each requirement:

```text
VERIFIED       check passed; cite the run and date
FAILED         check ran and failed; report the observed result
UNVERIFIED     no reliable check or evidence exists
NOT APPLICABLE requirement does not apply; explain why
```

Never treat an unmeasured property as verified. Cite only evidence run or referenced for this verification, and date stale evidence.

## Report

```md
# Fitness verification: <change>

| id | type | requirement | status | evidence |
|----|------|-------------|--------|----------|

## Conflicts
<Requirements that cannot all be satisfied, surfaced under the OCE Change Rule.>

## Recommendation
<ship | fix-first | spec-change — list the shortest blockers>
```

A FAILED outcome, invariant, or hard constraint blocks shipping. UNVERIFIED requirements must be listed; whether to ship with them is the user's decision. Recommend `ship`, `fix-first`, or `spec-change` based on the evidence.

## Routing

- Code-health findings outside the specification → `/code-audit`.
- A failed check caused by a bug or regression → `/diagnose`.
- A missing fitness function → propose adding one via `/tdd`.
- An outdated or incorrect requirement → explicit change through `/outcome-constraint-engineering`; never reinterpret it silently.
