---
name: outcome-constraint-engineering
description: Define or change software requirements while preserving user outcomes, invariants, and hard constraints. Use when specifying a feature, planning a refactor or replacement, or deciding whether a change is safe; keep requirements distinct from implementation choices.
---

# Outcome-Constraint Engineering

Specify what the product must achieve and what must remain true. Treat implementation details as replaceable unless the user makes them a hard requirement.

## Requirement types

- **Outcome:** what a user must be able to accomplish.
- **Invariant:** a property that must remain true across valid operation or change.
- **Constraint:** a hard, bounded requirement such as latency, privacy, compatibility, cost, or deployment limits.
- **Preference:** a negotiable optimization objective, such as simpler operations or lower cost.
- **Implementation choice:** an internal approach that can change while requirements still hold.
- **Fitness function:** an objective check that provides evidence for an outcome, invariant, or constraint.

Classify each load-bearing statement. A technology or existing design is an implementation choice unless an explicit reason makes it a constraint. Keep unknown requirements unknown; do not turn assumptions or preferences into hard requirements.

## Precedence and change rule

Priority is: required outcomes, invariants, hard constraints, preferences, then implementation choices. The first three remain binding; if they conflict, identify the affected requirements and surface the tradeoff rather than silently weakening one. Preferences may be traded, and implementation choices remain flexible.

## Workflow

1. **Define the outcome.** Describe observable user behavior, preferably as “Given X, the user can do Y.” Do not define success by the current architecture.
2. **State invariants.** Make important properties observable, including failure behavior, data integrity, authorization, retries, and compatibility where relevant.
3. **Record constraints and preferences.** Use measurable limits where known. Specify data by required properties such as freshness, quality, access, privacy, and retention—not by its current storage technology unless that technology is explicitly required.
4. **Define fitness functions.** Give each important outcome, invariant, and constraint a check. Prefer automated checks; if automation is impractical, name the manual evidence needed. If no reliable check exists, keep the requirement unverified.
5. **Choose an implementation.** Find the simplest approach that satisfies all binding requirements, then optimize for relevant preferences.
6. **Evaluate changes.** Run the applicable fitness functions and record evidence. A plausible design or unmeasured property is not proof that a requirement is met.

Represent requirements in a form the verification workflow can consume:

```yaml
- id: checkout-001
  type: outcome # outcome | invariant | constraint
  statement: "A user with a valid cart can complete checkout."
  fitness_function: "Checkout end-to-end test"
```

Use one status per requirement when reporting verification:

- **VERIFIED:** the named check ran and passed; cite the evidence.
- **FAILED:** the check ran and did not pass; report the observed result.
- **UNVERIFIED:** no reliable check or evidence is available; do not guess.
- **NOT APPLICABLE:** the requirement does not apply to this change; explain why.

A failed outcome, invariant, or hard constraint blocks acceptance until the implementation or specification is explicitly changed. A preference tradeoff is not a requirement failure.

## Handoffs

- `/problem-definition` supplies the validated problem and success signal.
- `/to-prd` and `/to-issues` carry the specification into delivery.
- `/fitness-verification` executes the specified checks after implementation and reports evidence.
