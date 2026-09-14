import { performance } from 'node:perf_hooks';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

const SITE_URL = (process.env.SITE_URL || 'https://chan179.com').replace(/\/+$/, '');
const SITE = new URL(SITE_URL);
const DIST = path.resolve(new URL('.', import.meta.url).pathname, '../dist');
const HTTP_SITE = new URL(SITE_URL);
HTTP_SITE.protocol = 'http:';
const fallbackRoutes = [
  '/',
  '/introduction',
  '/swe-journey',
  '/cache',
  '/nadir',
  '/ohara',
  '/uber-architecture',
  '/youtube-architecture',
];
const failures = [];
const timings = [];

function fail(message) { failures.push(message); }
function originUrl(pathname) { return new URL(pathname, SITE).href; }

async function fetchText(pathname, options = {}) {
  const url = originUrl(pathname);
  const started = performance.now();
  try {
    const response = await fetch(url, {
      redirect: options.redirect || 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    const text = await response.text();
    const elapsedMs = Math.round((performance.now() - started) * 100) / 100;
    timings.push({ pathname, elapsedMs, status: response.status });
    return { url, response, text, elapsedMs };
  } catch (error) {
    const elapsedMs = Math.round((performance.now() - started) * 100) / 100;
    timings.push({ pathname, elapsedMs, status: 'error' });
    fail(`${pathname}: request failed after ${elapsedMs} ms (${error.message})`);
    return null;
  }
}

function canonicalPath(value) {
  const url = new URL(value, SITE);
  return url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
}

function expectedDocument(pathname) {
  const file = pathname === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, pathname.slice(1), 'index.html');
  if (!existsSync(file)) return null;
  return parseHTML(readFileSync(file, 'utf8')).document;
}

function normalizedText(value) {
  return value?.replace(/\s+/g, ' ').trim() || '';
}

function assertHtml(pathname, result) {
  if (!result) return;
  const { response, text } = result;
  if (response.status !== 200) fail(`${pathname}: expected HTTP 200, got ${response.status}`);
  if (!response.headers.get('content-type')?.includes('text/html')) fail(`${pathname}: response is not HTML`);
  const { document } = parseHTML(text);
  if (document.querySelectorAll('title').length !== 1) fail(`${pathname}: expected exactly one title`);
  if (document.querySelectorAll('h1').length !== 1) fail(`${pathname}: expected exactly one H1`);
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canonical || canonicalPath(canonical) !== canonicalPath(pathname)) fail(`${pathname}: canonical does not match route`);
  if (!document.querySelector('title')?.textContent?.includes('Chandra179')) fail(`${pathname}: title does not contain Chandra179`);
  if (!document.body.textContent?.includes('Chandra179')) fail(`${pathname}: visible page content does not contain Chandra179`);
  if (pathname !== '/' && !document.querySelector('#content h1 ~ p, #content p')?.textContent?.trim()) fail(`${pathname}: article opening paragraph is missing`);

  const expected = expectedDocument(pathname);
  if (!expected) {
    fail(`${pathname}: local dist has no expected page for live comparison`);
    return;
  }
  const liveTitle = normalizedText(document.querySelector('title')?.textContent);
  const expectedTitle = normalizedText(expected.querySelector('title')?.textContent);
  if (liveTitle !== expectedTitle) fail(`${pathname}: live title is stale (expected "${expectedTitle}", got "${liveTitle}")`);
  const liveH1 = normalizedText(document.querySelector('h1')?.textContent);
  const expectedH1 = normalizedText(expected.querySelector('h1')?.textContent);
  if (liveH1 !== expectedH1) fail(`${pathname}: live H1 is stale (expected "${expectedH1}", got "${liveH1}")`);
  const liveDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const expectedDescription = expected.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  if (liveDescription !== expectedDescription) fail(`${pathname}: live description is stale`);
}

function assertEndpoint(pathname, result, contentType, marker) {
  if (!result) return;
  const { response, text } = result;
  if (response.status !== 200) fail(`${pathname}: expected HTTP 200, got ${response.status}`);
  if (contentType && !response.headers.get('content-type')?.includes(contentType)) fail(`${pathname}: unexpected content type ${response.headers.get('content-type') || '(missing)'}`);
  if (marker && !marker.test(text)) fail(`${pathname}: response does not look like the expected endpoint`);
  const cache = response.headers.get('cache-control') || '';
  if (!/max-age=300\b/.test(cache)) fail(`${pathname}: cache policy is not short-lived (got ${cache || '(missing)'})`);
}

console.log(`Checking live site: ${SITE.href}`);

const redirectResult = await fetch(HTTP_SITE.href, { redirect: 'manual', signal: AbortSignal.timeout(15_000) }).catch((error) => {
  fail(`http redirect: request failed (${error.message})`);
  return null;
});
if (redirectResult) {
  if (![301, 302, 303, 307, 308].includes(redirectResult.status)) fail(`http redirect: expected an HTTP redirect, got ${redirectResult.status}`);
  const location = redirectResult.headers.get('location') || '';
  if (!location.startsWith('https://')) fail(`http redirect: location is not HTTPS (${location || 'missing'})`);
}

const sitemapIndex = await fetchText('/sitemap-index.xml');
const sitemap = await fetchText('/sitemap.xml');
const robots = await fetchText('/robots.txt');
const rss = await fetchText('/rss.xml');
const llms = await fetchText('/llms.txt');

assertEndpoint('/robots.txt', robots, 'text/plain', /Sitemap:\s*https?:\/\//i);
assertEndpoint('/sitemap-index.xml', sitemapIndex, 'xml', /<sitemapindex|<urlset/i);
assertEndpoint('/sitemap.xml', sitemap, 'xml', /<urlset/i);
assertEndpoint('/rss.xml', rss, 'xml', /<rss|<feed/i);
assertEndpoint('/llms.txt', llms, 'text/plain', /^#\s+Chandra179/m);

let routes = fallbackRoutes;
if (sitemap?.response.status === 200) {
  const discovered = [...sitemap.text.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((pathname) => pathname === '/' || pathname.length > 1);
  if (discovered.length) routes = [...new Set(discovered)];
}

for (const route of routes) {
  const result = await fetchText(route);
  assertHtml(route, result);
}

if (sitemap?.response.status === 200) {
  for (const route of fallbackRoutes) {
    const listed = [...sitemap.text.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)]
      .some((match) => canonicalPath(match[1]) === route);
    if (!listed) fail(`sitemap.xml: expected published route ${route} is missing`);
  }
}

const maxTiming = timings.reduce((max, item) => Math.max(max, item.elapsedMs), 0);
console.log('Response timing (network + body read):');
for (const item of timings) console.log(`- ${item.pathname}: ${item.status} in ${item.elapsedMs} ms`);
console.log(`Maximum measured response time: ${maxTiming} ms`);
console.log('These timings are not Core Web Vitals; use Lighthouse/PageSpeed and Search Console for LCP, INP, and CLS.');

if (failures.length) {
  console.error(`Live checks failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Live checks passed.');
}
