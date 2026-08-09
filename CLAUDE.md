# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Atlas is Chandra's personal knowledge base: root-level `*.md` files (e.g. `cache.md`, `routing-mechanism.md`, `uber-architecture.md`, `swe-journey.md`) are the authored content — system design write-ups, engineering notes, economics/math notes. Most of the repo (`economy/`, `math/`, `golang/`, `database/`, `backend-engineering/`, `.obsidian/`) is plain notes with no build step; it's edited as an Obsidian vault.

The one actual codebase is `blog/astro/` — an Astro static site that publishes a subset of the root markdown files. See `blog/astro/CLAUDE.md` for its architecture (content sync pipeline, remark/rehype plugins, the Cloudflare Worker PDF generator). Read that file before editing anything under `blog/astro/`.

## Commands

```bash
make build    # cd blog/astro && npm run build
make deploy   # cd blog/astro && npm run deploy
make git      # git add . && git commit -m "update" && git push  (from repo root)
make all      # build, deploy, git in sequence
```

For Astro-specific dev commands (`npm run dev`, `npm run preview`, local Worker testing), see `blog/astro/CLAUDE.md`.

## Editing content that appears on the blog

- Only files listed in `ALLOWED_FILES` in `blog/astro/scripts/sync-content.mjs` are published. Edit the root `*.md` file directly — the sync script copies it into `blog/astro/src/content/docs/` on every `dev`/`build` and deletes anything there that isn't on the allow-list.
- Adding a new page to the blog requires adding its filename to `ALLOWED_FILES` in that script.
- Note the `cache.md` / `blog/astro/src/content/docs/cache.md` pair (and similarly `routing-mechanism.md`): the root file is the source of truth; the copy under `src/content/docs/` is generated and should not be hand-edited.
