# Add simplification & reuse checks to the code-audit skill

**Answer to your questions first:** Yes, all of these are worthwhile audit checks — they're classic code-health heuristics (hand-rolled stdlib replacements hide intent and miss edge cases; O(n²) nested scans where a map/sort exists; arrow-shaped nesting that early returns flatten; nil checks on values that can't be null). Notably, they partly restore things the original verbose skill had ("duplicated logic", "difficult-to-understand control flow") that got lost in your condensed draft. They group naturally into **one** new review area rather than three scattered rules.

**File to edit:** `agent/code-audit/SKILL.md` (your workspace draft). The installed copy at `~/.agents/skills/code-audit/SKILL.md` stays untouched — you manage installation.

## Changes (3 small edits, ~5 lines total)

**1. New review area** — insert after **Performance**, before **Dead or obsolete code**, matching the draft's condensed one-bullet style:

```markdown
- **Simplification and reuse:** hand-rolled implementations a standard library call or simpler proven algorithm already covers, deep nesting that early-return guard clauses would flatten, and redundant checks such as nil checks on values that cannot be null. Prefer the standard library or flatter control flow when behavior is unchanged; hand-rolled replacements of built-ins tend to hide intent and miss edge cases.
```

**2. Frontmatter description** — add the new area so the skill still triggers for "can this be simplified?" style requests:

> `description: Review existing code for correctness, reliability, architecture, performance, validation gaps, dead code, and simplification or reuse opportunities. Use when asked to audit, review, or assess code health; report evidence-backed findings without fixing them unless asked.`

**3. Output section** — the finding template lists valid Area tags; add the new one:

> `Area: correctness/reliability, architecture, performance, simplification/reuse, or dead code.`

## What stays the same

- The skill remains **read-only / report-first** ("do not change code unless explicitly asked") — these new checks produce findings with suggested fixes, same as the others.
- No changes to the other four review areas; the new bullet ends with the same "prefer X when behavior is unchanged" guard as Performance's "avoid speculative micro-optimization", so audits don't start nitpicking working code.

## Optional follow-up (not in this pass)

Per the skill-creator loop, test with a realistic prompt afterward, e.g. "audit `blog/astro/scripts/sync-content.mjs`" and see whether the new Simplification area surfaces real findings.