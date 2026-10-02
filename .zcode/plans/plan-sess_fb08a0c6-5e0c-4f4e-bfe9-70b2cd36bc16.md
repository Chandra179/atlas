# Close the six-stage pipeline: 2 new thin skills + install OCE + inline wiring

Pattern established by your Oct 2 split: `agent/` is the authoring workspace, `~/.agents/skills/` is where skills are installed (`code-audit` is already in both, identical). The plan follows that pattern — author in `agent/`, install, wire handoffs inline. No orchestrator, no further splits.

## 1. Install the finished stage-3 skill (outcome-constraint-engineering)

`agent/outcome-constraint-engineering/SKILL.md` is complete but not installed. After step 4's small handoff edits are made to the authoring copy, copy the directory to `~/.agents/skills/outcome-constraint-engineering/`.

## 2. New skill: `agent/problem-definition/SKILL.md` (stage 2 gap)

~80 lines, house style (frontmatter `name` + trigger-rich `description`, imperative tone, <100 lines). Scope:
- **Consumes**: discovery evidence (hypotheses, interview findings, opportunity assessment from `/inspired-product-discovery`) or raw user context when discovery wasn't run.
- **Produces**: a durable problem-spec artifact in `docs/agents/` — problem in users' terms, affected segments, evidence vs. open assumptions, measurable success-signal placeholders, explicit non-goals.
- **Refuses** to design solutions (mirror of `to-prd`'s "do not interview" — this one does not solution), and gates the handoff on load-bearing assumptions being flagged, not silently assumed.
- **Names handoffs**: upstream `/inspired-product-discovery`, downstream `/outcome-constraint-engineering`.

## 3. New skill: `agent/fitness-verification/SKILL.md` (stage 6 gap)

Thin (~80 lines) deliberately — it reuses OCE's vocabulary instead of duplicating it:
- **Consumes**: the OCE specification (outcomes/invariants/constraints + fitness functions) and the implemented change.
- **Executes/maps** each fitness function and emits an EVIDENCE report using OCE's exact statuses (VERIFIED / FAILED / UNVERIFIED / NOT APPLICABLE) — "never treat unmeasured as verified."
- **Routes**: code-level health evidence → `/code-audit`; failure triage → `/diagnose`; missing checks → propose via `/tdd`.
- **Output**: verification report + explicit ship/iterate recommendation; a FAILED outcome/invariant/constraint blocks shipping.

## 4. Inline handoff wiring (small edits, no structural changes)

- `~/.agents/skills/inspired-product-discovery/SKILL.md`: end of Workflow 1 names `/problem-definition` as the delivery-pipeline handoff (fixes the portfolio's one broken seam — IPD currently says "hand off to the delivery pipeline" but names nothing).
- `agent/outcome-constraint-engineering/SKILL.md`: add upstream `/problem-definition` and downstream `/to-prd` + `/fitness-verification` references.
- `~/.agents/skills/to-prd/SKILL.md`: Problem Statement section consumes the problem-definition artifact; Implementation/Testing decisions carry OCE outcomes/invariants/constraints.
- `~/.agents/skills/code-audit/SKILL.md`: one line noting it serves as code-level evidence for `/fitness-verification` (kept in sync with `agent/code-audit/SKILL.md`).

## 5. Explicitly NOT doing

- No orchestrator/router skill (per your choice).
- No changes to solution-design (to-prd/grill-me/grill-with-docs/improve-codebase-architecture) or implementation (tdd/to-issues/triage) beyond the one-line wiring above.
- Nothing is published to the blog — `agent/` is outside the sync allow-list.

## Verification

- New/edited skills conform to `write-a-skill` conventions (description ≤1024 chars, <100-line bodies, `/slash-name` cross-references).
- `diff` installed copies against `agent/` authoring copies.
- Check trigger overlap of new descriptions against `inspired-product-discovery` and `code-audit` to avoid misfiring.

## Files touched

Create: `agent/problem-definition/SKILL.md`, `agent/fitness-verification/SKILL.md`. Edit: `agent/outcome-constraint-engineering/SKILL.md` + 3 installed SKILL.md files (+ `agent/code-audit/SKILL.md` sync). Install: copy 3 skill dirs into `~/.agents/skills/`.