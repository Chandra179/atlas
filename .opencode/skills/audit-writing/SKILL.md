---
name: audit-writing
description: >
  Audit markdown files in a knowledge base for writing quality. Analyzes content
  type, style fit, audience, prerequisites, inconsistencies, gaps, structural
  patterns, scanability, concreteness, and storytelling. Writes findings to
  WRITING-AUDIT.md at workspace root. Use when user says "audit this file",
  "review writing", "analyze quality", "check consistency", "improve narrative",
  or evaluates markdown docs.
---

# Audit Writing

Audit a markdown file across 8 dimensions. Write the report to `WRITING-AUDIT.md` at workspace root. Print a 3-line summary inline.

## Workflow

1. Read the target file fully.
2. Run all 8 dimensions. Skip any dimension marked N/A — some file types don't need them (templates skip storytelling, resumes skip prerequisites, reference tables skip arc).
3. Write the complete report to `WRITING-AUDIT.md` using the template below.
4. Print to the user: file path, style verdict, top 3 issues found.

## The 8 Dimensions

### 1. Content Summary
One sentence. What is this teaching? To whom? Be specific — "an explanation of relational database internals for engineers migrating from MySQL to PostgreSQL" not "about databases."

### 2. Style Fit
Identify the current style and the recommended style. Use the four general styles from [STYLES.md](STYLES.md): narrative, reference, deep dive, guide. Flag mismatches — a glossary when the content demands a narrative, a wall of prose when the content is lookup-oriented.

### 3. Audience
Who is the reader? Answer: beginner encountering the topic first time, experienced practitioner migrating from a known tool, someone who read prerequisite notes, or undefined. Flag when the file targets everyone (serves no one) or shifts audience mid-file (starts beginner-friendly then jumps to advanced without warning).

### 4. Prerequisites
What must the reader know before this file makes sense? If the file references another file in the vault, list it. If the file assumes external knowledge (e.g., "the reader knows what a B-Tree is"), state it. If the file is self-contained, say so. Flag missing prerequisites when a concept is used but never linked or defined.

### 5. Inconsistencies
Spot-check for:
- Terminology drift (same concept called two different things, or different concepts called the same thing)
- Tone shifts (academic → casual → engineering with no pattern)
- Depth jumps (basic definitions in one section, specialist jargon in the next with no bridge)
- Formatting breaks (inconsistent header levels, mixed bullet styles, broken links)
- Quote line numbers.

### 6. Gaps & Ambiguities
Flag:
- Terms used but never defined
- Claims with no evidence or numbers ("fast", "scalable", "reliable" without measurement)
- Hand-waving words ("obviously", "essentially", "just", "simply" masking complexity)
- Missing edge cases or counterexamples
- Missing "when not to use" for prescriptive content

### 7. Structural Suggestions
Suggest specific patterns to add, where, and why. Pull from the pattern catalog in [STYLES.md](STYLES.md). Each suggestion should be actionable: "Add a 'Key things' bullet list after lines 45–60 summarizing the replication flow." Not "needs more structure." Max 5 suggestions per file.

### 8. Scan-ability & Concreteness
Scan-ability: can a reader skim in 30 seconds and find what they need? Headers, tables, bold terms, bullet lists, diagrams, and "key things" boxes make scanning possible. Flag walls of undifferentiated prose (>15 lines of text with no visual break).

Concreteness: what ratio of claims are anchored by numbers, examples, or specific scenarios? "It scales well" is noise. "Cold start: 182s on H200" is signal. Flag when abstract claims dominate.

## Storytelling Scorecard
Score 1–5 on each. Skip arc for reference-only files. Skip all five for templates.

| Dimension | What It Measures |
|---|---|
| Hook | Does the first paragraph make the reader want to continue? |
| Arc | Does the content follow a logical journey (problem → exploration → resolution)? |
| Concrete examples | Are abstract concepts grounded in real scenarios with numbers? |
| Section summaries | Does each dense section end with a reinforcing takeaway? |
| Closer | Does the file end with principles, key learnings, or next steps — or just stop? |

## Report Template

Write the report to `WRITING-AUDIT.md` at the workspace root using this exact structure:

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

When the user asks to audit the whole repo, also add a **Ranking** section at the top of the report:

```markdown
## Overall Ranking

**Strongest files (ready to publish):**
- `path/to/file.md` — why it works
- ...

**Needs attention (high impact fixes):**
- `path/to/file.md` — one-line reason
- ...

**Prerequisite chains (read these in order):**
- `A.md` → `B.md` → `C.md` — why they form a sequence
```

Rank by: whether a first-time reader would understand the topic after reading the file.
