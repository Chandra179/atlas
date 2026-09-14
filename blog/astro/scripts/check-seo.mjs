import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://chan179.com';
const failures = [];
const warnings = [];

function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function pagePath(file) {
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'/index.html'.length)}`;
  return `/${relative.replace(/\.html$/, '')}`;
}

function urlPath(value) {
  const url = new URL(value, SITE);
  return url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
}

function fileForUrl(value) {
  const pathname = urlPath(value);
  if (pathname === '/') return path.join(DIST, 'index.html');
  const relative = pathname.slice(1);
  const candidates = [
    path.join(DIST, relative),
    path.join(DIST, relative, 'index.html'),
    path.join(DIST, `${relative}.html`),
  ];
  return candidates.find(existsSync) || candidates[0];
}

function jsonLdNodes(document, page) {
  const nodes = [];
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(script.textContent || '');
      if (Array.isArray(parsed)) nodes.push(...parsed);
      else nodes.push(parsed);
    } catch (error) {
      fail(`${page}: invalid JSON-LD (${error.message})`);
    }
  }
  return nodes;
}

if (!existsSync(DIST)) fail('dist/ does not exist; run npm run build first');

if (existsSync(DIST)) {
  const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html') && !file.endsWith('404.html'));
  const indexablePages = new Set();

  for (const file of htmlFiles) {
    const page = pagePath(file);
    const { document } = parseHTML(readFileSync(file, 'utf8'));
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    if (/noindex/i.test(robots)) continue;
    indexablePages.add(page);

    if (document.querySelectorAll('title').length !== 1 || !document.querySelector('title')?.textContent?.trim()) {
      fail(`${page}: expected exactly one non-empty <title>`);
    }
    const descriptions = document.querySelectorAll('meta[name="description"]');
    const description = descriptions[0]?.getAttribute('content') || '';
    if (descriptions.length !== 1 || !description.trim()) fail(`${page}: expected exactly one non-empty meta description`);
    if (description.length < 40 || description.length > 180) warn(`${page}: description length is ${description.length}; review manually`);

    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length !== 1) fail(`${page}: expected exactly one canonical link`);
    else if (urlPath(canonicals[0].getAttribute('href') || '') !== page) fail(`${page}: canonical does not match page path`);

    if (document.querySelectorAll('h1').length !== 1) fail(`${page}: expected exactly one H1`);

    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogType = document.querySelector('meta[property="og:image:type"]')?.getAttribute('content');
    if (!ogImage || !existsSync(fileForUrl(ogImage))) fail(`${page}: OG image is missing from dist`);
    if (ogImage && ogType && path.extname(new URL(ogImage).pathname).toLowerCase() === '.png' && ogType !== 'image/png') {
      fail(`${page}: PNG OG image has incorrect MIME type ${ogType}`);
    }

    const jsonLd = jsonLdNodes(document, page);
    const article = jsonLd.find((node) => ['Article', 'BlogPosting'].includes(node?.['@type']));
    if (document.querySelector('meta[property="og:type"]')?.getAttribute('content') === 'article') {
      if (!article) fail(`${page}: article page is missing Article/BlogPosting JSON-LD`);
      for (const field of ['author', 'datePublished', 'dateModified', 'image', 'publisher']) {
        if (!article?.[field]) fail(`${page}: article JSON-LD is missing ${field}`);
      }
      if (!article?.publisher?.logo) fail(`${page}: article JSON-LD publisher is missing a logo`);
      if (!jsonLd.some((node) => node?.['@type'] === 'BreadcrumbList')) fail(`${page}: article is missing BreadcrumbList JSON-LD`);
    }

    for (const icon of document.querySelectorAll('link[rel="icon"]')) {
      const href = icon.getAttribute('href') || '';
      const type = icon.getAttribute('type') || '';
      if (type === 'image/svg+xml' && !href.toLowerCase().endsWith('.svg')) fail(`${page}: SVG favicon declaration points to a non-SVG asset`);
      if (type === 'image/png' && !href.toLowerCase().endsWith('.png')) fail(`${page}: PNG favicon declaration points to a non-PNG asset`);
    }
  }

  const sitemapFiles = ['sitemap-index.xml', 'sitemap.xml'];
  const sitemapPages = new Set();
  for (const sitemapFile of sitemapFiles) {
    const sitemapPath = path.join(DIST, sitemapFile);
    if (!existsSync(sitemapPath)) fail(`${sitemapFile}: missing from dist`);
    else {
      const xml = readFileSync(sitemapPath, 'utf8');
      for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const value = match[1];
        if (value !== `${SITE}/` && value.endsWith('/')) fail(`${sitemapFile}: non-root URL has trailing slash: ${value}`);
        sitemapPages.add(urlPath(value));
      }
    }
  }
  for (const page of indexablePages) if (!sitemapPages.has(page)) fail(`${page}: indexable page missing from sitemap`);

  const robotsPath = path.join(DIST, 'robots.txt');
  if (!existsSync(robotsPath)) fail('robots.txt: missing from dist');
  else if (!readFileSync(robotsPath, 'utf8').includes(`${SITE}/sitemap-index.xml`)) fail('robots.txt: canonical sitemap is not advertised');

  const rssPath = path.join(DIST, 'rss.xml');
  if (!existsSync(rssPath)) fail('rss.xml: missing from dist');
  else {
    const rss = readFileSync(rssPath, 'utf8');
    for (const match of rss.matchAll(/<link>(https:\/\/chan179\.com[^<]*)<\/link>/g)) {
      const value = match[1];
      if (value !== `${SITE}/` && value.endsWith('/')) fail(`rss.xml: non-root URL has trailing slash: ${value}`);
      if (!indexablePages.has(urlPath(value))) fail(`rss.xml: link is not an indexable page: ${value}`);
    }
  }

  const llmsPath = path.join(DIST, 'llms.txt');
  if (!existsSync(llmsPath)) fail('llms.txt: missing from dist');
  else {
    const llms = readFileSync(llmsPath, 'utf8');
    for (const match of llms.matchAll(/https:\/\/chan179\.com\/[^)\s]+/g)) {
      const value = match[0];
      if (value.endsWith('/')) fail(`llms.txt: non-root URL has trailing slash: ${value}`);
      if (!indexablePages.has(urlPath(value))) fail(`llms.txt: link is not an indexable page: ${value}`);
    }
  }

  const ogPath = path.join(DIST, 'og-image.png');
  if (!existsSync(ogPath)) fail('og-image.png: missing from dist');
  else if (readFileSync(ogPath).subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') fail('og-image.png: invalid PNG signature');
}

if (warnings.length) {
  console.warn(`SEO warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (failures.length) {
  console.error(`SEO checks failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('SEO checks passed.');
}
