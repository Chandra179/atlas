---
name: improve-doc
description: >
  Improve or rewrite existing markdown files using the 9-dimension quality system.
  Analyzes style fit, audience, gaps, scanability, and consistency, then rewrites
  with inline citations and structural patterns from the audit-writing style catalog.
  Use when user says "improve this file", "rewrite this", "upgrade this to a deep dive",
  "fix this doc", "add citations to this file", or asks to improve existing markdown docs.
---

# Improve Doc

Improve or rewrite an existing markdown file using the same 9 dimensions and pattern catalog that `audit-writing` checks for. Every rewrite includes a diagnosis phase, a plan presented to the user, inline citations (`[^n]` or `^[...]`), and a References table at the bottom. Write to the specified path (or overwrite the original). Print a 3-line summary inline.

Requires the audit-writing [STYLES.md](../audit-writing/STYLES.md) pattern catalog.

## Workflow

1. **Read the file.** Read the full content. Note the file path, current style, and any metadata.

2. **Diagnose against the 9 dimensions.** Apply each dimension from the checklist below. Identify what works and what needs to change.

3. **Decide what to change.** Based on the diagnosis:
   - **Style shift** — should this be narrative, reference, deep dive, or guide?
   - **Depth** — needs more concrete examples? More explanation of internals?
   - **Audience** — is the audience clear and consistent? Prerequisites listed?
   - **Scanability** — too much prose? Needs tables, bullet lists, headers?
   - **Citations** — missing `[^n]` markers for numerical claims? Missing References section?

4. **Present the diagnosis + rewrite plan to the user.** Show:
   - Current state: style, audience, key gaps found
   - Proposed changes: style shift (if any), patterns to add/remove, citation count target
   - File path for output
   - Wait for user approval before proceeding.

5. **On approval, rewrite applying the 9 dimensions.** Embed `[^n]` footnote markers for every external source. Use `^[inline footnote]` for brief asides. Pick 2–5 patterns from the [STYLES.md](../audit-writing/STYLES.md) catalog.

6. **Append or update the References section.** Every `[^n]` must have exactly one definition. Every definition must be referenced in the body. No orphan footnotes.

7. **Write to path.** Overwrite the original file or write to a new path as specified.

8. **Print summary:** path, style shift (if any), citation delta (before → after), patterns changed.

## The 9 Dimensions (as Rewrite Constraints)

Apply these during the rewrite, not after. Each dimension checks a specific aspect of the output.

### 1. Content Summary
Before rewriting, decide: one sentence — what is this teaching? To whom? Be specific. If the original had no clear audience, define one now.

### 2. Style Fit
Pick one primary style from [STYLES.md](../audit-writing/STYLES.md). Then choose a secondary hybrid style if beneficial. If the original mixed styles without structure, resolve the conflict.

| Style | When to Use |
|-------|-------------|
| **Narrative** | Teaching a concept from scratch. Reader learns *with* the writer. |
| **Reference** | Encyclopedia, comparison, cheat sheet. Reader knows what they want. |
| **Deep Dive** | Explaining internals of a specific system. |
| **Guide** | Step-by-step instructions. How to accomplish X. |

### 3. Audience
Define exactly who the reader is. If the original targeted "everyone", narrow it. Never shift audience mid-file without warning.

### 4. Prerequisites
Every prerequisite must be a markdown link `[text](path.md)`. Add links to related files in the vault. If the original had unlinked prerequisites, fix them.

### 5. Consistency
- **Terminology**: use the same term for the same concept throughout. Standardize if the original renamed concepts mid-file.
- **Tone**: maintain a consistent register. Flatten oscillations between academic and casual.
- **Depth**: introduce concepts before using their jargon. Add definitions for specialist terms the original used without explanation.
- **Formatting**: consistent header levels, uniform bullet styles, valid links.

### 6. Gaps (Fill During Rewrite)
- Every term used must be defined on first use (or linked to a definition).
- Every claim with a number must cite a source.
- Remove hand-waving words ("obviously", "essentially", "just", "simply").
- For prescriptive content, add "when not to use" or tradeoffs.

### 7. Structural Patterns
Pick 2–5 patterns from the [STYLES.md](../audit-writing/STYLES.md) pattern catalog to add or replace. If the original had no visible structure, add headers, tables, and scan breaks.

### 8. Scan-ability & Concreteness
- Break up prose every ~15 lines with a header, table, bullet list, bold term, or "Key things" box.
- Every abstract claim must be followed by a specific anchor — a number, an example, a real scenario.

### 9. Sequence & Progression
Build easy→hard. If the original front-loaded advanced concepts, reorder. Introduce jargon only after defining the concept it names.

## Citation System

Use two forms, matching `ai/ai-infra.md`:

### Inline Footnotes
Use `^[text]` for brief clarifications or asides that do not need a URL reference.

```markdown
Phase durations are not strictly additive — some phases overlap.^[See cold start docs for more detail.]
```

### Reference Footnotes
Use `[^n]` for every external source: documentation, pricing page, research paper, codebase reference, blog post.

```markdown
Modal Volumes [^4] are network-attached persistent storage.
```

### References Section
Append at the end of every draft. Every `[^n]` must have exactly one definition. Every definition must be referenced in the body.

```markdown
## References

[^1]: Modal `scaledown_window` docs — [cold start guide](https://modal.com/docs/guide/cold-start).
[^2]: Modal GPU Memory Snapshots — [guide](https://modal.com/docs/guide/memory-snapshots).
```

### Rules
- Number `[^n]` sequentially in order of first appearance.
- Every body reference must have a definition. Every definition must be body-referenced. No orphans.
- Description must be specific enough to identify the source without clicking: "Modal cold start docs" not "docs".

## Output

Write the improved file to the specified path. Overwrite the original unless a new path is given. Every rewrite must include:

- A **References section** at the bottom with all `[^n]` definitions
- The `[^n]` and `^[...]` footnote conventions from the Citation System below

## What Not to Do

- Do not use citations without sources. Every `[^n]` must have a real URL.
- Do not leave `TODO`, `FIXME`, or placeholder text in the draft. If a detail is unknown, ask the user.
- Do not change factual claims or cross-links. Preserve the original's accurate content.
- Do not produce a wall of prose with no visual breaks.
- Do not rewrite without first presenting the diagnosis + plan to the user (step 4).
