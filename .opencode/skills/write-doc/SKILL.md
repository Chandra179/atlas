---
name: write-doc
description: >
  Write markdown files following the same quality system used by audit-writing.
  Uses the style system (narrative/reference/deep dive/guide) and structural
  pattern catalog from audit-writing/STYLES.md. Produces full drafts with inline
  citations, a References table, and self-checks against all 9 dimensions.
  Use when user says "write a guide", "draft a doc", "create a reference",
  "write about X", "document Y", or asks for any new markdown content.
---

# Write Doc

Write a full markdown draft using the same 9 dimensions, style system, and pattern catalog that `audit-writing` checks for. Every draft includes inline citations (`[^n]` or `^[...]`) and a References table at the bottom. Write the draft to the specified file path (or derive one from the topic). Print a 3-line summary inline.

## Workflow

1. **Understand the request.** What topic? What style fits? Who is the reader? Ask if unclear.
2. **Determine style, audience, and prerequisites** using the 4 styles from [STYLES.md](../audit-writing/STYLES.md).
3. **Outline the draft** — pick structural patterns from the STYLES.md catalog based on style and audience.
4. **Write the full draft** — apply all 9 dimensions as generation constraints (see below). Embed `[^n]` footnote markers for every external source. Use `^[inline footnote]` for brief asides.
5. **Append a References section** — every `[^n]` must have a definition `[^n]: Description — [URL](...)`. Every definition must be referenced in the body. No orphan footnotes.
6. **Write to file.** Create parent directories if needed.
7. **Print summary:** file path, style chosen, key patterns used, citation count.

## The 9 Dimensions (as Generation Constraints)

Apply these while drafting, not after. Each dimension shapes how you write.

### 1. Content Summary
Before writing, decide: one sentence — what is this teaching? To whom? Be specific. This sentence governs every subsequent decision.

### 2. Style Fit
Pick one primary style from STYLES.md. Then choose a secondary hybrid style if beneficial (guide + narrative, reference + narrative). Do not blend incompatible styles (e.g., narrative hook on a pure reference table).

| Style | When to Use |
|-------|-------------|
| **Narrative** | Teaching a concept from scratch. Reader learns *with* the writer. |
| **Reference** | Encyclopedia, comparison, cheat sheet. Reader knows what they want. |
| **Deep Dive** | Explaining internals of a specific system. |
| **Guide** | Step-by-step instructions. How to accomplish X. |

### 3. Audience
Define exactly who the reader is: "beginner encountering X for the first time", "engineer familiar with Y but new to Z", "practitioner evaluating options". Never target "everyone". Never shift audience mid-file without warning.

### 4. Prerequisites
Every prerequisite must be a markdown link `[text](path.md)`. Plain name-drops without hyperlinks count as gaps. If the file is self-contained, say so.

- Link to related files in the vault.
- If the reader needs external knowledge (e.g., "knows what a B-Tree is"), say so in a prerequisites note.

### 5. Consistency (Self-Check During Drafting)
- **Terminology**: use the same term for the same concept throughout. Do not rename mid-file.
- **Tone**: maintain a consistent register (academic, engineering, casual). Do not oscillate.
- **Depth**: introduce concepts before using their jargon. No specialist terms without definition.
- **Formatting**: consistent header levels, uniform bullet styles, valid links.

### 6. Gaps (Fill Before You Finish)
- Every term used must be defined on first use (or linked to a definition).
- Every claim with a number must cite a source. "Cold start: 182s" needs `[^n]`.
- Avoid hand-waving words ("obviously", "essentially", "just", "simply") — if it is simple, explain why.
- For prescriptive content, include "when not to use" or tradeoffs.

### 7. Structural Suggestions (Pattern Selection)
Pick 2–5 patterns from the STYLES.md pattern catalog. Choose based on style and audience:

| Pattern | Best For |
|---------|----------|
| Problem Hook | Narrative, Guide |
| Question Hook | Deep Dive |
| Contrast Hook | Narrative, Reference |
| Result Hook | Guide |
| Chronological Walkthrough | Deep Dive |
| "Why X?" Sections | Narrative, Deep Dive |
| Concrete Example Anchors | All styles |
| Before/After Framing | Narrative, Guide |
| Metaphor Bridge | Narrative (risky — verify it holds) |
| "Key Things" Bullet Lists | Dense sections in any style |
| Principle Table | Deep Dive, Reference |
| Comparison Table | Reference, Guide |
| Decision Tree / "When to Use" | Guide, Reference |
| Key Learnings | Narrative, Deep Dive |
| Further Reading | All styles |
| Source Citations Table | Deep Dive |

### 8. Scan-ability & Concreteness
**Scan-ability:** break up prose every ~15 lines with a header, table, bullet list, bold term, or "Key things" box. Readers must be able to skim in 30 seconds and extract the main points.

**Concreteness:** every abstract claim must be followed by a specific anchor — a number, an example, a real scenario. "It scales well" → rewrite. "Cold start: 182s on H200" → keep.

### 9. Sequence & Progression
Build easy→hard. Do not front-load advanced concepts. Introduce jargon only after defining the concept it names. Check that the first substantive section does not assume knowledge the reader has not been given.

## Citation System

Use two forms, matching `ai/ai-infra.md`:

### Inline Footnotes
Use `^[text]` for brief clarifications or asides that do not need a URL reference. These appear as tooltip-style footnotes inline.

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
[^3]: Modal H200 pricing: [$0.001261/sec (~$4.54/hr)](https://modal.com/pricing).
```

### Rules
- Number `[^n]` sequentially in order of first appearance.
- Every body reference must have a definition. Every definition must be body-referenced. No orphans.
- Description must be specific enough to identify the source without clicking: "Modal cold start docs" not "docs".

## Output

Write the draft to `<path>` (user-specified or derived from topic). The structure is up to you — follow the chosen style's conventions. Every draft must include:

- A **References section** at the bottom with all `[^n]` definitions
- The `[^n]` and `^[...]` footnote conventions from the Citation System below

How you organize the body depends on the style, audience, and patterns selected. A narrative deep dive and a reference table will look nothing alike — that is the point.

## Cross-File Writing

When the user asks to write a family of related documents, write them as coordinated files:

- **Narrative** — `topic.md` (teaches the concept from scratch)
- **Guide** — `topic-guide.md` (step-by-step instructions)
- **Reference** — `topic-reference.md` (lookup table)

Write all files in one pass. Ensure prerequisites link between them (e.g., the Guide links to the Narrative). Reference links are not duplicated across files — each file maintains its own References section with only the sources it cites.

## What Not to Do

- Do not use citations without sources. Every `[^n]` must have a real URL.
- Do not leave `TODO`, `FIXME`, or placeholder text in the draft. If a detail is unknown, ask the user.
- Do not switch styles mid-file without a clear section boundary and a bridging sentence.
- Do not suggest a narrative hook for a reference table.
- Do not produce a wall of prose with no visual breaks.
