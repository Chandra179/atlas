/// <reference types="@cloudflare/workers-types" />
import { parseHTML } from 'linkedom';

interface Env {
  BROWSER: BrowserRun;
  PDF_CACHE: KVNamespace;
  ASSETS: Fetcher;
}

const CACHE_TTL_SECONDS = 86400; // 24 hours
const RATE_LIMIT_RETRIES = 3;
const CACHE_KEY_PREFIX = 'pdf:v5:';

async function hashHtml(html: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(html));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 200) return false;
  if (slug.startsWith('/') || slug.endsWith('/')) return false;
  if (/[.]{2,}/.test(slug)) return false;
  if (!/^[a-z0-9\-/]+$/.test(slug)) return false;
  return true;
}

function toFilename(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'document';
  return `${base}.pdf`;
}

function escapeHeaderValue(value: string): string {
  return value.replace(/"/g, '\\"');
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanHtmlForPdf(html: string, origin: string, slug: string): string {
  const { document } = parseHTML(html);

  // Remove UI chrome
  const selectors = [
    'header',
    'aside#sidebar',
    'aside#toc',
    '#search',
    'nav[aria-label="Breadcrumb"]',
    'nav[aria-label="Previous and next articles"]',
    '.pdf-hide',
    // Mobile menu overlay
    'div.fixed.top-16.inset-x-0.bottom-0',
    // Mobile header (hamburger/dark-mode buttons) — `.pdf-mode` CSS never
    // applies here since Browser Run renders the HTML string directly
    // rather than navigating to a `?pdf=1` URL, so it must be stripped here.
    '#mobile-header',
    // Skip-to-content accessibility link, irrelevant in a static PDF
    'a[href="#main-content"]',
  ];

  for (const selector of selectors) {
    for (const el of Array.from(document.querySelectorAll(selector))) {
      el.remove();
    }
  }

  // Reset main layout margins
  for (const main of Array.from(document.querySelectorAll('main'))) {
    const style = (main as HTMLElement).style;
    style.marginLeft = '0';
    style.marginRight = '0';
    style.paddingTop = '0';
  }

  // Cap mermaid diagram size for print: A4 pages are much narrower than the
  // web content column, so a width= sized for the web still dominates the
  // printed page. print.css has an @media print override for this, but
  // Browser Run doesn't appear to honor print media emulation, so force it
  // here directly instead of relying on that CSS taking effect.
  for (const el of Array.from(document.querySelectorAll('.mermaid-diagram'))) {
    const style = (el as HTMLElement).style;
    style.maxWidth = '55%';
    style.marginLeft = 'auto';
    style.marginRight = 'auto';
  }

  // Convert relative URLs to absolute so resources load when using html option
  for (const el of Array.from(document.querySelectorAll('[href^="/"], [src^="/"]'))) {
    const href = el.getAttribute('href');
    if (href) el.setAttribute('href', `${origin}${href}`);
    const src = el.getAttribute('src');
    if (src) el.setAttribute('src', `${origin}${src}`);
  }

  // Ensure a base tag exists for any other relative references
  let base = document.querySelector('base');
  if (!base) {
    base = document.createElement('base');
    base.setAttribute('href', `${origin}/${slug}/`);
    document.head.insertBefore(base, document.head.firstChild);
  }

  return document.toString();
}



async function generatePdf(env: Env, cleanedHtml: string, attempt = 1): Promise<ArrayBuffer> {
  const response = await env.BROWSER.quickAction('pdf', {
    html: cleanedHtml,
    pdfOptions: {
      format: 'a4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    },
  });

  if (response.status === 429 && attempt < RATE_LIMIT_RETRIES) {
    const retryAfter = Math.max(1, parseInt(response.headers.get('Retry-After') || '2', 10));
    await sleep(retryAfter * 1000);
    return generatePdf(env, cleanedHtml, attempt + 1);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    throw new Error(`Browser Run ${response.status}: ${text}`);
  }

  return response.arrayBuffer();
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/api/pdf') {
      return new Response('Not found', { status: 404 });
    }

    if (request.method !== 'GET' && request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const slug = url.searchParams.get('slug') || '';
    const title = url.searchParams.get('title')?.trim() || slug || 'document';

    if (!isValidSlug(slug)) {
      return new Response('Invalid slug', { status: 400 });
    }

    const filename = toFilename(title);

    const origin = url.origin;
    const assetUrl = new URL(`/${slug}?pdf=1`, origin);
    const assetRes = await env.ASSETS.fetch(assetUrl);
    if (!assetRes.ok) {
      return new Response(`Failed to fetch asset: ${assetRes.status}`, { status: 502 });
    }
    const html = await assetRes.text();
    const cleanedHtml = cleanHtmlForPdf(html, origin, slug);

    // Content-addressed: key includes a hash of the rendered page, so a
    // content change (i.e. a new deploy of that page) invalidates only
    // that page's cache entry, not the whole cache.
    const cacheKey = `${CACHE_KEY_PREFIX}${slug}:${await hashHtml(cleanedHtml)}`;

    try {
      const cached = await env.PDF_CACHE.get(cacheKey, { type: 'arrayBuffer' });
      if (cached) {
        return new Response(cached, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${escapeHeaderValue(filename)}"`,
            'X-PDF-Source': 'kv-cache',
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch (e) {
      console.error('KV cache read failed:', e);
    }

    let pdfBuffer: ArrayBuffer;
    try {
      pdfBuffer = await generatePdf(env, cleanedHtml);
    } catch (error: any) {
      console.error('Browser Run PDF generation failed:', error);
      return new Response(
        `PDF generation failed: ${error?.message || 'Unknown error'}`,
        { status: 502 }
      );
    }

    ctx.waitUntil(
      env.PDF_CACHE.put(cacheKey, pdfBuffer, { expirationTtl: CACHE_TTL_SECONDS }).catch((err) => {
        console.error('KV cache write failed:', err);
      })
    );

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${escapeHeaderValue(filename)}"`,
        'X-PDF-Source': 'generated',
        'Cache-Control': 'no-store',
      },
    });
  },
} satisfies ExportedHandler<Env>;
