---
name: improve-doc
description: >
  Improve or rewrite existing markdown files using the 9-dimension quality system.
  Also supports audit-only mode that diagnoses quality and writes findings to
  docs/audits/ without rewriting. Analyzes style fit, audience, prerequisites,
  inconsistencies, gaps, structural patterns, scanability, concreteness, sequence,
  and storytelling. Rewrites with inline citations and structural patterns from
  the STYLES.md catalog.
  Use when user says "improve this file", "rewrite this", "upgrade this to a deep dive",
  "fix this doc", "add citations to this file", "audit this file", "review writing",
  "analyze quality", "check consistency", "improve narrative", or evaluates markdown docs.
---

# Improve Doc

Improve or audit an existing markdown file using the 9 dimensions and pattern catalog. Operates in two modes:

- **Improve mode** ("improve", "fix", "rewrite"): diagnose, present a rewrite plan, rewrite with citations.
- **Audit mode** ("audit", "review", "check", "analyze"): diagnose only, write a report to `docs/audits/`, ask if user wants to apply fixes.

Uses the [STYLES.md](STYLES.md) pattern catalog.

## Workflow

### Mode Detection

Check the user's phrasing:
- **Audit triggers**: "audit", "review", "analyze", "check", "evaluate" → audit mode (diagnose only).
- **Improve triggers**: "improve", "fix", "rewrite", "upgrade", "deepen" → improve mode (diagnose + rewrite).

If intent is ambiguous, ask: "Audit-only (diagnose and report) or improve (diagnose and rewrite)?"

### Audit Mode Workflow

1. **Read the file.** Read the full content. Note the file path, current style, and any metadata.

2. **Diagnose against the 9 dimensions.** Apply each dimension from the checklist below. Identify what works and what needs to change.

3. **Write the audit report.** Write findings to `docs/audits/<slug>.audit.md` using the audit report template below. Create `docs/audits/` if missing.

4. **Print summary.** Present to the user: file path, style verdict, top 3 issues found.

5. **Offer to fix.** Ask: "Apply these fixes?" If yes, proceed to improve mode workflow (skip the plan-approval step since user just approved the audit findings).

### Improve Mode Workflow

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

5. **On approval, rewrite applying the 9 dimensions.** Embed `[^n]` footnote markers for every external source. Use `^[inline footnote]` for brief asides. Pick 2–5 patterns from the [STYLES.md](STYLES.md) catalog.

6. **Append or update the References section.** Every `[^n]` must have exactly one definition. Every definition must be referenced in the body. No orphan footnotes.

7. **Write to path.** Overwrite the original file or write to a new path as specified.

8. **Print summary:** path, style shift (if any), citation delta (before → after), patterns changed.

## The 9 Dimensions

Apply these during diagnosis. For improve mode, also apply them as rewrite constraints. Each dimension checks a specific aspect.

### 1. Content Summary
One sentence. What is this teaching? To whom? Be specific.

### 2. Style Fit
Identify the current style and the recommended style. Use the four styles from [STYLES.md](STYLES.md): narrative, reference, deep dive, guide.

| Style | When to Use |
|-------|-------------|
| **Narrative** | Teaching a concept from scratch. Reader learns *with* the writer. |
| **Reference** | Encyclopedia, comparison, cheat sheet. Reader knows what they want. |
| **Deep Dive** | Explaining internals of a specific system. |
| **Guide** | Step-by-step instructions. How to accomplish X. |

### 3. Audience
Define exactly who the reader is. If the file targets "everyone", flag it. Flag audience shifts mid-file.

### 4. Prerequisites
Every prerequisite must be a markdown link `[text](path.md)`. Plain name-drops without hyperlinks count as gaps. If the file is self-contained, say so.

### 5. Consistency
- **Terminology**: use the same term for the same concept throughout.
- **Tone**: maintain a consistent register. Flag oscillations between academic and casual.
- **Depth**: introduce concepts before using their jargon.
- **Formatting**: consistent header levels, uniform bullet styles, valid links.

### 6. Gaps & Ambiguities
- Every term used must be defined on first use (or linked to a definition).
- Every claim with a number must cite a source.
- Remove hand-waving words ("obviously", "essentially", "just", "simply").
- For prescriptive content, add "when not to use" or tradeoffs.

### 7. Structural Patterns
Suggest 2–5 patterns from the [STYLES.md](STYLES.md) pattern catalog to add or replace. Each suggestion should be actionable with a line range and rationale.

### 8. Scan-ability & Concreteness
**Scan-ability:** can a reader skim in 30 seconds? Flag undifferentiated prose (>15 lines with no visual break).

**Concreteness:** what ratio of claims are anchored by numbers, examples, or specific scenarios? Flag when abstract claims dominate.

### 9. Sequence & Progression
Does the file build easy→hard? Flag when the first substantive section assumes knowledge the reader hasn't been given. Flag when specialist jargon appears before basic definitions.

## Storytelling Scorecard

Score 1–5 on each. Skip arc for reference-only files. Skip all five for templates.

| Dimension | What It Measures |
|---|---|
| Hook | Does the first paragraph make the reader want to continue? |
| Arc | Does the content follow a logical journey (problem → exploration → resolution)? |
| Concrete examples | Are abstract concepts grounded in real scenarios with numbers? |
| Section summaries | Does each dense section end with a reinforcing takeaway? |
| Closer | Does the file end with principles, key learnings, or next steps — or just stop? |

## Audit Report Template

Write the report to `docs/audits/<slug>.audit.md` using this exact structure. Derive slug from the filename (drop `.md`, append `.audit.md`). For duplicate names, prefix with parent directory name.

```markdown
# Writing Audit: `path/to/file.md`

## 1. Content Summary
[One sentence — what, to whom.]

## 2. Style Assessment
Current: [style]
Recommended: [style]
[Brief mismatch explanation if applicable, or "Correct fit."]

## 3. Audience
[Who is this for? Shift problems?]

## 4. Prerequisites
- [File or concept the reader should know first]
- [Or: Self-contained]

## 5. Inconsistencies
- [Line N: description]

## 6. Gaps & Ambiguities
- [Description. Quote the text.]

## 7. Structural Suggestions
- **[pattern name]**: [where to apply — line range] — [why it helps]

## 8. Scan-ability & Concreteness
Scan-ability: [assessment]
Concreteness: [assessment. Count concrete anchors vs. abstract claims.]

## 9. Sequence & Progression
[Does the file build easy→hard? Any hard-first flags?]

## Storytelling Quality

| Dimension | Score (1-5) | Notes |
|---|---|---|
| Hook | | |
| Arc | | |
| Concrete | | |
| Summaries | | |
| Closer | | |
```

## Cross-File Audit

When the user asks to audit the whole repo, run in audit mode per file plus write a summary index.

### Per-file audit
Write `docs/audits/<slug>.audit.md` for each target file using the audit report template above.

### Summary index
Write `docs/audits/README.md` with ranking:

```markdown
# Writing Audit Summary

**Strongest files (ready to publish):**
- `path/to/file.md` — why it works
- ...

**Needs attention (high impact fixes):**
- `path/to/file.md` — one-line reason
- ...

**Prerequisite chains (read these in order):**
- `A.md` → `B.md` → `C.md` — why they form a sequence
- **Sequence validation**: Confirm each chain builds easy→hard.
```

Rank by: whether a first-time reader would understand the topic after reading the file.

## Citation System

Use two forms:

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
Append at the end of every rewrite. Every `[^n]` must have exactly one definition. Every definition must be referenced in the body.

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

**Improve mode**: Write the improved file to the specified path. Overwrite the original unless a new path is given. Every rewrite must include:

- A **References section** at the bottom with all `[^n]` definitions
- The `[^n]` and `^[...]` footnote conventions from the Citation System

**Audit mode**: Write the report to `docs/audits/<slug>.audit.md` using the audit report template.

## What Not to Do

- Do not use citations without sources. Every `[^n]` must have a real URL.
- Do not leave `TODO`, `FIXME`, or placeholder text in the draft. If a detail is unknown, ask the user.
- Do not change factual claims or cross-links. Preserve the original's accurate content.
- Do not produce a wall of prose with no visual breaks.
- Do not rewrite without first presenting the diagnosis + plan to the user (improve mode step 4).
- Do not skip the offer-to-fix step in audit mode (audit mode step 5).
