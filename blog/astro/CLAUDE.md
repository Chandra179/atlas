# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # sync content, then start Astro dev server
npm run build       # sync content, build static site, index with pagefind
npm run preview     # preview the built dist/ site
npm run deploy       # build + pagefind index + `wrangler deploy` (builds static site AND deploys the Worker)
```

There is no test suite or linter configured in this repo.

For local development of the PDF worker (Browser Run Quick Actions require remote mode):
```bash
npx wrangler dev --remote
curl -o test.pdf "http://localhost:8787/api/pdf?slug=introduction&title=Introduction"
```

## Architecture

This is an Astro static blog (output: 'static') deployed to Cloudflare Workers, combining static assets with a small Worker for on-demand PDF generation.

### Content pipeline

- `scripts/sync-content.mjs` runs before every `dev`/`build`. It copies a fixed allow-list of `*.md` files from the monorepo root (`../../*.md`, e.g. `introduction.md`, `flash-sale.md`) into `src/content/docs/`, preserving/merging frontmatter and stamping a `modified` date. It also deletes anything in `src/content/docs/` not on the allow-list (including subdirectories) — so **content is authored at the repo root**, not directly under `src/content/docs/`, and edits to `src/content/docs/*.md` will be overwritten/removed on the next sync unless the file is added to `ALLOWED_FILES` in that script.
- `src/content.config.ts` defines the `docs` collection via a glob loader over `src/content/docs/**/*.md`.
- `src/lib/entries.ts` (`getValidEntries`) filters out ignored files/ids (see `src/lib/ordering.ts`: `IGNORE_FILES`, `IGNORE_IDS`) from the raw collection.
- `src/lib/ordering.ts` centralizes display-name overrides (`NAME_OVERRIDES`), root page ordering (`ROOT_PAGE_ORDER`), and category ordering (`CATEGORY_ORDER`).
- `src/lib/nav.ts` builds the full nav tree (`buildNav`) from valid entries, handling root-level standalone pages vs. directory-based categories/sub-folders, `README`-as-index-page collapsing, breadcrumbs (`buildBreadcrumb`), and flattened prev/next navigation (`flattenNav`, `getPrevNext`).
- `src/pages/[...slug].astro` is the single catch-all route: it generates a static path per content entry plus synthetic "index" pages for category folders that lack a `README`, then renders via `DocLayout`.

### Markdown/MDX processing (astro.config.mjs)

Custom remark/rehype plugins in `src/lib/` run in this pipeline order:
- remark: math → GitBook embeds → link rewriting → mermaid-preserve → directives → callouts
- rehype: raw HTML → katex → asset rewriting

These plugins port behavior from an earlier non-Astro build (`blog/scripts/lib/*.js` — see comments referencing "Ported from" / "gen-nav.js").

Mermaid diagrams are rendered **client-side**: `remark-mermaid-preserve.js` escapes each ` ```mermaid ` fence into a `<pre class="mermaid">` inside a `.mermaid-diagram` wrapper (no build-time SVG). `src/scripts/mermaid-viewer.js` (loaded in `DocLayout.astro`) lazily imports the mermaid runtime, renders the source in the browser, and wraps each diagram in a pan/zoom viewport (wheel zoom, drag pan, pinch, on-hover controls, fullscreen). It re-renders when the `.dark` class toggles. In pdf-mode (the worker stamps a `pdf-mode` class on `<html>`) it renders statically with the light theme and no viewport.

When writing mermaid diagrams in content:
- `<br>` in node labels is fine — it's escaped to literal text and mermaid interprets it client-side.
- Do not use all-uppercase words in labels.
- Keep node label text short — avoid long/wrapping text in a single node.

### PDF generation Worker

- `src/worker/index.ts` is the Cloudflare Worker entry (`wrangler.jsonc`: `main`), serving only `GET/POST /api/pdf?slug=...&title=...`. Everything else falls through to the static `ASSETS` binding.
- Flow: fetch the static page HTML via `env.ASSETS`, strip nav/sidebar/TOC/breadcrumbs with `linkedom` (`cleanHtmlForPdf`), rewrite relative URLs to absolute, then render via Cloudflare Browser Run `quickAction('pdf', ...)`, retrying on 429.
- Results are cached in the `PDF_CACHE` KV namespace for 24h (`CACHE_KEY_PREFIX = 'pdf:v3:'` — bump this prefix if the cleaning/rendering logic changes incompatibly, to avoid serving stale cached PDFs).
- See `README.md` for full details on KV namespace setup and Browser Run's daily free-tier limits.

### Styling

Tailwind v4 via `@tailwindcss/vite` (no separate config file — see `astro.config.mjs` vite plugins). Stylesheets are split by concern in `src/styles/`: `base.css`, `dark.css`, `global.css`, `landing.css`, `math.css`, `print.css` (used specifically for the PDF/print rendering path), `prose.css`.
