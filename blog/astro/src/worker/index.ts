/// <reference types="@cloudflare/workers-types" />

interface Env {
  BROWSER: BrowserRun;
  PDF_CACHE: KVNamespace;
}

const ORIGIN = 'https://chan179.com';
const CACHE_TTL_SECONDS = 86400; // 24 hours
const RATE_LIMIT_RETRIES = 3;

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

async function generatePdf(env: Env, slug: string, attempt = 1): Promise<ArrayBuffer> {
  const pageUrl = `${ORIGIN}/${slug}?pdf=1`;

  const response = await env.BROWSER.quickAction('pdf', {
    url: pageUrl,
    pdfOptions: {
      format: 'a4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    },
    gotoOptions: {
      waitUntil: 'networkidle0',
      timeout: 30000,
    },
  });

  if (response.status === 429 && attempt < RATE_LIMIT_RETRIES) {
    const retryAfter = Math.max(1, parseInt(response.headers.get('Retry-After') || '2', 10));
    await sleep(retryAfter * 1000);
    return generatePdf(env, slug, attempt + 1);
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
    const cacheKey = `pdf:${slug}`;

    try {
      const cached = await env.PDF_CACHE.get(cacheKey, { type: 'arrayBuffer' });
      if (cached) {
        return new Response(cached, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${escapeHeaderValue(filename)}"`,
            'X-PDF-Source': 'kv-cache',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch (e) {
      console.error('KV cache read failed:', e);
    }

    let pdfBuffer: ArrayBuffer;
    try {
      pdfBuffer = await generatePdf(env, slug);
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
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
} satisfies ExportedHandler<Env>;
