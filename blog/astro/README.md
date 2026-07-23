# Chan179 Astro Blog

## PDF download

PDFs are generated serverlessly with Cloudflare Browser Run (Quick Actions) and cached in KV.

- Worker route: `src/worker/index.ts`
- Print styles: `src/styles/print.css`
- Trigger: the "Download as PDF" button in `src/layouts/DocLayout.astro`

How it works: the Worker fetches the static page HTML via `env.ASSETS`, strips the navbar/sidebar/TOC/breadcrumbs with `linkedom`, then passes the cleaned HTML to Browser Run for PDF rendering.

### Local development

Browser Run Quick Actions require remote mode during local development:

```bash
npx wrangler dev --remote
```

Then visit a doc page and click the PDF button, or curl:

```bash
curl -o test.pdf "http://localhost:8787/api/pdf?slug=introduction&title=Introduction"
```

### KV namespace

The cache namespace was created with:

```bash
npx wrangler kv namespace create "PDF_CACHE"
```

The namespace ID is already in `wrangler.jsonc`. If you recreate it, replace `id` under `kv_namespaces`.

### Deployment

```bash
npm run deploy
```

This builds the static site, indexes search, and deploys the Worker + assets.

### Limits

On the Workers Free plan Browser Run gives 10 browser minutes per day. Each PDF takes a few seconds of browser time, so this covers hundreds of downloads per day. Generated PDFs are cached in KV for 24 hours, so repeat downloads do not consume browser time.
