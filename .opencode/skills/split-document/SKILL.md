---
name: split-document
description: >
  Split an overly large or multi-topic markdown file into multiple focused files.
  Detects split points, creates new files, writes a landing page, and fixes
  cross-references. Use when user says "split this file", "break this file up",
  "this is too long", "refactor this into multiple files", or after an audit
  flags a file as oversized.
---

# Split Document

Split a markdown file into smaller focused files when it crosses size, scope, or audience boundaries. Preserve cross-reference integrity across the vault.

## When to Split

Trigger thresholds — if any apply, the file is a candidate:

| Trigger | Threshold |
|---|---|
| Line count | >3000 lines |
| H1 sections | ≥11 distinct topics (each H1 could be its own file) |
| Audience mixing | One section is beginner, another is advanced practitioner |
| Name sprawl | File name covers multiple subjects (e.g., `databases-and-caching.md`) |
| Audit flag | A prior audit's Structural Suggestions recommended splitting |

## Finding Split Points

### Primary heuristic — topic boundaries
Each H1 section that covers a self-contained concept is a split candidate. An H1 qualifies if answering "yes" to all three:
1. Could someone read this section without reading the others?
2. Does it have its own prerequisites distinct from the parent?
3. Does it have its own "key things" / takeaway distinct from the parent?

### Secondary heuristics
- **Concept independence**: sections that import their own terms never used elsewhere in the file
- **See-also clusters**: sections that link to a different set of external files
- **Depth cliff**: a section that suddenly assumes far more expertise — split into an advanced companion file

### Decision tree

| Situation | Action |
|---|---|
| One overly long file, single topic | Keep as-is, improve scan-ability instead |
| Multiple H1s on different topics | Split by H1, each becomes its own file |
| Mixed audience (beg + adv) | Split by tier: `topic.md` (beginner) + `topic-advanced.md` |
| Single topic but >3000 lines | Split by H2 or by concept phase (e.g., `raft-intro.md`, `raft-cluster.md`) |

## Workflow

1. **Analyze** — Read the file. Identify split points using the heuristics above.
2. **Plan** — List the new files and which content goes where. Show the user the plan before executing.
3. **Create** — Write each new file. Preserve original section structure. Add a "Prerequisites" line linking back to the landing page or sibling files. Add a "See also" line pointing to sibling files.
4. **Write landing page** — Replace the original file with an index that:
   - States what the original file covered
   - Links to each child file with a 1-sentence summary of what it covers
   - Shows the recommended reading order
5. **Update inbound links** — Search the vault for links to the original file. Update them to point to the specific child file or the landing page.
6. **Verify** — Run integrity checks (below). Print the list of files created and links updated.

## Naming Conventions

- **Child files**: `parent-specific.md` (e.g., `databases-replication.md`, `databases-indexing.md`)
- **Advanced tier**: `topic-advanced.md`
- **Landing page**: Keep the original filename (e.g., `databases.md` becomes the landing page)
- All kebab-case, no spaces or underscores
- Place child files in the same directory as the original unless the topic warrants a subdirectory

## Integrity Checks

After splitting, verify:

- [ ] Every child file has a backlink in the landing page
- [ ] Every child file has a "Prerequisites" line linking to sibling files or the landing page
- [ ] No orphan links exist anywhere in the vault pointing to old sections (grep for old section anchors)
- [ ] The landing page lists the files in a logical reading order
- [ ] Any file that linked to the original now links to the correct child or the landing page

## Templates

### Landing Page Template

Replace the original file with:

```markdown
# Original Topic

This topic is covered across several focused files:

| File | Covers | Read after |
|---|---|---|
| `parent-a.md` | [1-sentence summary] | — |
| `parent-b.md` | [1-sentence summary] | `parent-a.md` |

**Prerequisites:** [what the reader should know before any of these]
```

### Child File Header

Add at the top of each new file:

```markdown
> **Part of:** [Original Topic](landing-page.md)
> **Prerequisites:** [sibling files or external knowledge]
> **Next:** [next file in sequence or "—"]
```
