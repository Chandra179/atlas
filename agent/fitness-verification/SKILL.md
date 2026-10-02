---
name: fitness-verification
description: Verify delivered work against an outcome-constraint-engineering specification by executing its fitness functions and emitting an EVIDENCE report with VERIFIED, FAILED, UNVERIFIED, or NOT APPLICABLE per requirement. Use after implementing a feature, refactor, or fix whose requirements were specified as outcomes, invariants, constraints, and fitness functions — when the user asks whether the work meets the spec, is ready to ship, or actually delivers the intended outcomes.
---

# Fitness Verification

Execute the specification's own checks and report the evidence. The specification — outcomes, invariants, hard constraints, fitness functions — is owned by `/outcome-constraint-engineering`; this skill runs it after implementation and reports the result.

## Inputs

- The specification: requirement entries (`id`, `type`, `statement`, `fitness_function`) or the equivalent list.
- The implemented change to verify: branch, diff, or deployment.

If no specification with fitness functions exists, STOP. Help create one with `/outcome-constraint-engineering` first. Verifying without a spec degrades into a generic code review — that is `/code-audit`'s job.

## Process

1. Enumerate every requirement from the specification. None may be skipped; mark requirements that do not apply to this change as NOT APPLICABLE, with a reason.
2. For each fitness function: run it if it is executable (test, benchmark, static check, script, cost query). Otherwise locate the strongest available evidence and name what is missing.
3. Record exactly one status per requirement, backed by evidence:

```text
VERIFIED       check ran and passed — cite the run (command, date)
FAILED         check ran and did not pass — quote the observed value
UNVERIFIED     no reliable check exists — do not guess
NOT APPLICABLE requirement does not apply here — state why
```

4. Do not treat an unmeasured property as verified. A plausible implementation is not evidence.
5. Emit the report (template below) and recommend: ship, fix-first, or spec-change.

## Report

```md
# Fitness verification: <change>

| id | type | requirement | status | evidence |
|----|------|-------------|--------|----------|

## Conflicts
<Any requirement satisfiable only by weakening another — surfaced per the
OCE Change Rule, never silently traded.>

## Recommendation
<ship | fix-first | spec-change — with the shortest list of blockers.>
```

## Routing

- Code-health concerns outside the specification (bugs, races, dead code) → `/code-audit`
- A FAILED check that is a bug or regression → `/diagnose`
- A fitness function that should exist but does not → propose it as a test via `/tdd`
- A requirement that is wrong or outdated → explicit spec change via `/outcome-constraint-engineering`, never quiet reinterpretation

## Rules

- A FAILED outcome, invariant, or hard constraint blocks shipping, regardless of what improved.
- UNVERIFIED does not block, but must be listed — shipping with unverified requirements is the user's decision, not the agent's.
- Cite only evidence from runs performed or referenced during this verification; label stale results with their date.
