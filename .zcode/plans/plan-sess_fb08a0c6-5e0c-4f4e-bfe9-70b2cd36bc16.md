# Moderate trim of business/business.md

Reduce table density (8 → 6 tables) and remove redundant content in the source file `business/business.md` (the `blog/astro/src/content/docs/business.md` copy is generated — never hand-edited). No frontmatter changes, so SEO fields stay untouched.

## Edits

1. **Merge Tables 2 + 3** in "Institutions become tools" into one three-column table: `Institution | Business tool | Software's role`. The current two tables restate the same trust/coordination/incentives items back-to-back. Fold the "Movement and logistics" row into the Coordination row; move "Information systems → Software is the product" out of the table into surrounding prose. Keep Table 1 (Problem → Institutions) in the scarcity section — it genuinely summarizes the four-question list.
2. **Purchase-steps table → numbered list**: the 5 sequential steps ("Find, Discover, Check out, Watch and buy, Share and attribute") read better as an ordered list than a table. Keep all step content, including the Taobao Live / TikTok Live note.
3. **Cut the duplicated hedge**: "not who pays or how the providers earn" appears near-verbatim in both the AI paragraph (line 96–97) and the Energy ending (line 186–187). Keep it once (AI paragraph), and give Energy a short closing sentence that ties back to the section's framing question ("what changes, who benefits, how the provider earns") instead of ending on a repeated non-answer.
4. **"Software is the product" once**: resolved by edit 1 — the §3 sentence "They often sell software as the product" becomes the single occurrence.
5. **Drop the "Social commerce" row** from the commerce trends table — the dedicated subsection later in the same section covers it in more depth. Normalize that table's whitespace-padded column formatting while editing it.

## Resulting table count

Kept: Problem→Institutions, merged Institution/Business tool/Software's role, How-software-fits→Industries, Subsector→Examples, Commerce trends, Energy trends. Removed: 2 (merged + steps).

## Regenerate & verify

- Run `node scripts/sync-content.mjs` in `blog/astro` (the sanctioned regeneration path) and diff `src/content/docs/business.md` to confirm only that file changed and the frontmatter merge looks right.
- Re-read the final source end-to-end for flow. No commit unless you ask.