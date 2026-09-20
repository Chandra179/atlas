# AGENTS.md

Personal knowledge base (Obsidian vault) + Astro static blog (`blog/astro`, deployed to Cloudflare Workers). No test suite, linter, or typecheck.

## Content ownership

- Author Markdown in root topic dirs (`about/`, `system-design/`, `swe/`, `math/`, `business/`). Never edit `blog/astro/src/content/docs/` — it is regenerated and non-allowlisted files are deleted.
- Publishing is an allow-list: `blog/astro/scripts/sync-content.mjs` `ALLOWED_FILES` (currently 7 files), flattened to basename. To publish a new page, add it there; sync runs automatically as `predev`/`prebuild`.
- Sync merges frontmatter and stamps `modified` from `git log`; untracked files fall back to today. Commit a file before trusting its `modified` date.
- Keep Markdown Obsidian-readable: relative image paths (`../assets/foo.png`), no hard `/assets/optimized/` links in source.

## Assets

- `assets/` is symlinked as `blog/astro/public/assets`. Reference source PNGs relatively; `remark-rewrite-links` + `rehype-rewrite-assets` rewrite to `/assets/...` and build `srcset` from `assets/optimized-manifest.json`.
- When adding/removing a PNG, keep `assets/optimized/*.webp` and `optimized-manifest.json` in sync — there is no generator script in the repo. Orphan PNGs/webp ship to production via `public/`.
- `trigonometry.png` (369px) intentionally has empty `variants` — below the smallest breakpoint, not an error.

## Commands (run in `blog/astro`)

- `npm run dev | build | preview | deploy` — `build`/`deploy` = `astro build && pagefind --site dist` (+ `wrangler deploy` for deploy).
- Focused checks: `npm run check:seo`, `npm run check:live`, `npm run generate:og`.
- PDF worker local dev requires remote mode: `npx wrangler dev --remote`, then `curl -o test.pdf "http://localhost:8787/api/pdf?slug=introduction&title=Introduction"`.
- Root `Makefile` exists (`build`, `deploy`, `git`) but `make git` blindly commits everything as `"update"` — use explicit `git add` instead.

## Blog architecture

- Route: `src/pages/[...slug].astro` (single catch-all) → `DocLayout`; collection defined in `src/content.config.ts` (glob over `src/content/docs`).
- Nav/filtering: `src/lib/ordering.ts` (`NAME_OVERRIDES`, `ROOT_PAGE_ORDER`, `IGNORE_FILES`/`IGNORE_IDS`), `src/lib/nav.ts`, `src/lib/entries.ts`. Glob loader lowercases names — match that casing in ignore lists.
- Markdown pipeline order matters (`astro.config.mjs`): remark `math → rewrite-links → directive → callouts`; rehype `raw → katex → rewrite-assets`. Ported from legacy `blog/scripts/lib/*` ("gen-nav") behavior.
- Styling: Tailwind v4 via Vite plugin (no config file); `src/styles/print.css` is the PDF path — keep screen styles out of it.
- PDF Worker (`src/worker/index.ts`, `wrangler.jsonc`): only `GET/POST /api/pdf`, everything else falls through to `ASSETS`. KV `PDF_CACHE` TTL 24h, key prefix `pdf:v12:` — bump on incompatible cleaner/render changes. Browser Run free tier ≈ 10 min/day.

## Conventions

- `blog/astro/CLAUDE.md` + `blog/astro/README.md` (KV setup, Browser Run limits) override this file on blog details.
- `.obsidian/workspace.json`, `.claude/`, `.agents/` are git-ignored and machine-local — never commit them.
- `trailingSlash: 'never'`, `site: 'https://chan179.com'`; vite watcher ignores `dist/`, `.astro/`, `public/assets/`.
