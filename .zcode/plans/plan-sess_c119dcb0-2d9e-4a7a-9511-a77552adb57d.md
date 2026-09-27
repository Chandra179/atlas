# SEO/AEO/GEO fix plan — blog/astro (author name pinned: Chandra179)

Baseline is already strong (canonicals, OG/Twitter, JSON-LD, RSS, llms.txt, AI-friendly robots.txt); this fixes the defects found. No visual changes to the site.

## 1. Adopt your `og-image.jpeg` (P0 — replaces the missing og-image.png)
Verified: `blog/astro/public/og-image.jpeg`, real JPEG, 1424×752.
- `src/lib/seo.ts`: `DEFAULT_OG_IMAGE` → `'/og-image.jpeg'`; remove the now-dead `Koala` entry from `AUTHOR_PROFILE_PATHS`.
- Update hardcoded 1200×630 to 1424×752 in: `SEO.astro` `ogImageWidth/Height` defaults, JSON-LD publisher logo in `index.astro` and `DocLayout.astro`.
- `scripts/check-seo.mjs`: dist check `og-image.png` + PNG signature → `og-image.jpeg` + JPEG signature (`ffd8ff`); extend the OG MIME rule to cover `.jpeg → image/jpeg`.
- Remove `scripts/generate-og-image.mjs` + the `generate:og` npm script (superseded by your committed image).

## 2. Author = Chandra179 everywhere (P0)
- Remove `author: "Koala"` and `authorProfile: "/about/introduction#author-koala"` from source vault files `swe/swe-journey.md` and `system-design/uber-architecture.md`; all posts fall back to the default `Chandra179`, whose `/#author` URL exists.
- Author name stays **Chandra179** (matches GitHub/X/site brand and all check:seo assertions); `chan179.com` remains the domain only.
- This fixes the dangling `/about/introduction` URL in BlogPosting JSON-LD, llms.txt, and RSS.

## 3. Text-extractor-safe homepage `x-data` (P1 — `src/pages/index.astro:198–231`)
Rewrite the two raw-`<` comparisons to `>`-form (`(start + this.projectPageSize) > idx`, `this.totalProjectPages >= p`). LLM/answer-engine scrapers using naive HTML→text converters currently mangle this into visible garbage (confirmed on the live site).

## 4. AEO frontmatter for the 3 thin docs (P1 — source vault files)
Add `seoTitle`, `seoDescription` (40–180 chars, direct-answer style), `answerSummary` (1–3 sentence extractable answer) to:
- `swe/fundamentals/os.md` (⚠️ has your uncommitted edits — frontmatter only, body untouched)
- `system-design/system-design-core.md`
- `business/business.md`
Not displayed visually — machine-facing only (llms.txt + JSON-LD `abstract`).

## 5. Technical polish (P2)
- `public/robots.txt`: add `Disallow: /api/pdf` to the `User-agent: *` group and to every named AI-bot group (named groups override `*`), protecting the ~10 min/day Browser Rendering quota.
- `src/pages/sitemap-index.xml.ts`: emit a true `<sitemapindex>` wrapping `/sitemap.xml` instead of duplicating the urlset.
- `public/_headers`: add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to `/*`.
- `src/layouts/DocLayout.astro` + `src/pages/[...slug].astro`: pass `answerSummary` through and emit as schema.org `abstract` on BlogPosting JSON-LD when present.

## Verification
- `cd blog/astro && npm run build && npm run check:seo` must pass.
- Grep dist: no raw `<` inside x-data attributes; author URL resolves; og:image points to `/og-image.jpeg` with correct MIME.
- Deploy (`npm run deploy`) + `npm run check:live` only after your explicit go-ahead.

## Deferred
Per-article OG images, visible TL;DR block (layout change), CSP, tag archives, RSS `atom:self`.