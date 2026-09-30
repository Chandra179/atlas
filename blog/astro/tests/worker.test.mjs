import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseHTML } from 'linkedom';
import worker from '../src/worker/index.ts';

const html = '<html><head><script>window.alert("UI")</script></head><body><aside class="pdf-hide">Controls</aside><main><article><h1>Article</h1><img src="/assets/example.png"></article></main></body></html>';

function harness({ cached = null, render } = {}) {
  const pending = [];
  const renders = [];
  const writes = [];
  const env = {
    ASSETS: { fetch: async () => new Response(html) },
    PDF_CACHE: {
      get: async () => cached,
      put: async (...args) => { writes.push(args); },
    },
    BROWSER: { quickAction: async (_action, options) => {
      renders.push(options.html);
      if (render) return render();
      await new Promise((resolve) => setTimeout(resolve, 5));
      return new Response('%PDF-example');
    } },
  };
  return {
    env, renders, writes,
    ctx: { waitUntil: (promise) => pending.push(promise) },
    settled: () => Promise.all(pending),
  };
}

function pdfRequest(slug = 'introduction', origin = 'https://chan179.com') {
  return new Request(`${origin}/api/pdf?slug=${slug}&title=Introduction`);
}

test('documented HTTP localhost PDF requests reach the renderer', async () => {
  const h = harness();
  const response = await worker.fetch(pdfRequest('introduction', 'http://localhost:8787'), h.env, h.ctx);
  assert.equal(response.status, 200);
  assert.equal(h.renders.length, 1);
  await h.settled();
});

test('concurrent misses for the same PDF share one render and cache write', async () => {
  const h = harness();
  const responses = await Promise.all([
    worker.fetch(pdfRequest(), h.env, h.ctx),
    worker.fetch(pdfRequest(), h.env, h.ctx),
  ]);
  assert.deepEqual(responses.map((response) => response.status), [200, 200]);
  assert.equal(h.renders.length, 1);
  await h.settled();
  assert.equal(h.writes.length, 1);
  assert.equal(await responses[0].text(), await responses[1].text());
});

test('PDF HTML excludes scripts and controls while preserving article resources', async () => {
  const h = harness();
  await worker.fetch(pdfRequest(), h.env, h.ctx);
  const { document } = parseHTML(h.renders[0]);
  assert.equal(document.querySelector('script, .pdf-hide'), null);
  assert.equal(document.querySelector('h1').textContent, 'Article');
  assert.equal(document.querySelector('img').getAttribute('src'), 'https://chan179.com/assets/example.png');
  await h.settled();
});

test('cached PDFs avoid rendering and return a safe download filename', async () => {
  const h = harness({ cached: new TextEncoder().encode('%PDF-cached').buffer });
  const response = await worker.fetch(pdfRequest(), h.env, h.ctx);
  assert.equal(response.headers.get('X-PDF-Source'), 'kv-cache');
  assert.equal(response.headers.get('Content-Disposition'), 'attachment; filename="introduction.pdf"');
  assert.equal(h.renders.length, 0);
});

test('render failures release admission slots and keep provider errors private', async () => {
  const h = harness({ render: async () => new Response('provider diagnostic', { status: 500 }) });
  const first = await worker.fetch(pdfRequest(), h.env, h.ctx);
  const second = await worker.fetch(pdfRequest(), h.env, h.ctx);
  assert.equal(first.status, 502);
  assert.equal(second.status, 502);
  assert.equal(h.renders.length, 2);
  assert.doesNotMatch(await first.text(), /provider diagnostic/);
});
