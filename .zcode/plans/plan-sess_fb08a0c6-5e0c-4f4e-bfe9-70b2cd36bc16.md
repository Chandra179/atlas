# Remove off-title content from business/business.md

Remove §4 "What changes, and how does it make money?" (AI / Finance / Commerce / Social commerce / Energy) so the article ends at "Tools combine into industries", matching the title's arc. The section is preserved — not deleted — as a new vault draft.

## Steps

1. **Create `business/business-trends.md`** — a new draft containing §4's content, lightly restructured for standalone reading: the bold-lead paragraphs (**AI changes existing software.**, etc.) become `##` sections, plus a one-paragraph intro. Frontmatter: title "What's Changing in Business, and Who Makes Money", tags, created 2026-10-02. It will **not** be added to `sync-content.mjs` `ALLOWED_FILES`, so it stays unpublished (Obsidian-readable, ready to publish later by adding it to the allow-list).
2. **Trim `business/business.md`** to §1–3 (keeping all edits from the earlier trim) and:
   - Add a one-sentence closing line after the subsector table that closes the arc ("...scarcity forces exchange, institutions solve the problems exchange creates, institutions become tools, and tools combine into industries — with software now running much of it."), since the article would otherwise end abruptly on a table.
   - Update the `description` frontmatter to drop "market trends" / "changes reshaping industries today" (now inaccurate). `seoDescription` and `answerSummary` already describe only §1–3 — untouched.
3. **Run `node blog/astro/scripts/sync-content.mjs`** to regenerate the blog copy and verify only the two `business.md` files change.

No commit. Result: business.md = 4 tables, all on-title; trends draft kept for future publishing.