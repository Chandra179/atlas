import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';
import yaml from 'js-yaml';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://chan179.com';
const SITE_ORIGIN = new URL(SITE).origin;
const MAX_HTML_BYTES = 250_000;
const MAX_INITIAL_JS_BYTES = 300_000;
const MAX_INITIAL_CSS_BYTES = 250_000;
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

function normalizePath(value) {
  const pathname = new URL(value, SITE).pathname;
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

function internalPath(value) {
  try {
    const url = new URL(value, SITE);
    if (url.origin !== SITE_ORIGIN) return null;
    return normalizePath(url.href);
  } catch {
    return null;
  }
}

function fileForUrl(value) {
  const pathname = internalPath(value);
  if (!pathname) return null;
  if (pathname === '/') return path.join(DIST, 'index.html');
  const relative = pathname.slice(1);
  const candidates = [
    path.join(DIST, relative),
    path.join(DIST, relative, 'index.html'),
    path.join(DIST, `${relative}.html`),
  ];
  return candidates.find(existsSync) || null;
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

function localAssetBytes(document, selector, attribute) {
  const assets = new Set();
  for (const element of document.querySelectorAll(selector)) {
    const value = element.getAttribute(attribute);
    const file = value ? fileForUrl(value) : null;
    if (file) assets.add(file);
  }
  return [...assets].reduce((total, file) => total + statSync(file).size, 0);
}

function xmlLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function sourceFrontmatter(file) {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return yaml.load(match[1]) || {};
}

if (!existsSync(DIST)) fail('dist/ does not exist; run npm run build first');

if (existsSync(DIST)) {
  const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html') && !file.endsWith('404.html'));
  const pages = new Map();
  const noindexPages = new Set();
  const articlePages = new Set();

  for (const file of htmlFiles) {
    const page = pagePath(file);
    const { document } = parseHTML(readFileSync(file, 'utf8'));
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    const isNoindex = /noindex/i.test(robots);
    pages.set(page, { file, document, isNoindex });
    if (isNoindex) {
      noindexPages.add(page);
      continue;
    }

    const title = document.querySelector('title')?.textContent?.trim() || '';
    const descriptions = document.querySelectorAll('meta[name="description"]');
    const description = descriptions[0]?.getAttribute('content')?.trim() || '';
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    const canonical = canonicals[0]?.getAttribute('href') || '';
    const h1s = document.querySelectorAll('h1');
    const pageSize = statSync(file).size;
    const jsonLd = jsonLdNodes(document, page);
    const article = jsonLd.find((node) => ['Article', 'BlogPosting'].includes(node?.['@type']));
    const isArticle = document.querySelector('meta[property="og:type"]')?.getAttribute('content') === 'article';

    if (document.querySelectorAll('title').length !== 1 || !title) fail(`${page}: expected exactly one non-empty <title>`);
    if (descriptions.length !== 1 || !description) fail(`${page}: expected exactly one non-empty meta description`);
    if (description.length < 40 || description.length > 180) warn(`${page}: description length is ${description.length}; review manually`);
    if (title.length > 70) warn(`${page}: title length is ${title.length}; review manually`);
    if (canonicals.length !== 1) fail(`${page}: expected exactly one canonical link`);
    else if (internalPath(canonical) !== page) fail(`${page}: canonical does not match page path`);
    if (h1s.length !== 1 || !h1s[0]?.textContent?.trim()) fail(`${page}: expected exactly one non-empty H1`);
    if (document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') !== 'Chandra179') fail(`${page}: Open Graph site name is not Chandra179`);
    if (!title.includes('Chandra179') && page === '/') fail(`${page}: homepage title does not contain Chandra179`);
    if (pageSize > MAX_HTML_BYTES) fail(`${page}: initial HTML is ${pageSize} bytes; budget is ${MAX_HTML_BYTES}`);

    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogType = document.querySelector('meta[property="og:image:type"]')?.getAttribute('content');
    const ogFile = ogImage ? fileForUrl(ogImage) : null;
    if (!ogFile) fail(`${page}: OG image is missing from dist`);
    if (ogImage && ogType && path.extname(new URL(ogImage, SITE).pathname).toLowerCase() === '.png' && ogType !== 'image/png') fail(`${page}: PNG OG image has incorrect MIME type ${ogType}`);

    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon || !fileForUrl(favicon.getAttribute('href') || '')) fail(`${page}: favicon is missing from dist`);
    for (const icon of document.querySelectorAll('link[rel="icon"]')) {
      const href = icon.getAttribute('href') || '';
      const type = icon.getAttribute('type') || '';
      const extension = path.extname(new URL(href, SITE).pathname).toLowerCase();
      if (type === 'image/svg+xml' && extension !== '.svg') fail(`${page}: SVG favicon declaration points to a non-SVG asset`);
      if (type === 'image/png' && extension !== '.png') fail(`${page}: PNG favicon declaration points to a non-PNG asset`);
    }

    const initialJsBytes = localAssetBytes(document, 'script[src]', 'src');
    const initialCssBytes = localAssetBytes(document, 'link[rel="stylesheet"]', 'href');
    if (initialJsBytes > MAX_INITIAL_JS_BYTES) fail(`${page}: initial JavaScript is ${initialJsBytes} bytes; budget is ${MAX_INITIAL_JS_BYTES}`);
    if (initialCssBytes > MAX_INITIAL_CSS_BYTES) fail(`${page}: initial CSS is ${initialCssBytes} bytes; budget is ${MAX_INITIAL_CSS_BYTES}`);
    if (isArticle) {
      articlePages.add(page);
      if (!article) fail(`${page}: article page is missing Article/BlogPosting JSON-LD`);
      for (const field of ['author', 'datePublished', 'dateModified', 'image', 'publisher']) {
        if (!article?.[field]) fail(`${page}: article JSON-LD is missing ${field}`);
      }
      if (!article?.publisher?.logo) fail(`${page}: article JSON-LD publisher is missing a logo`);
      if (!jsonLd.some((node) => node?.['@type'] === 'BreadcrumbList')) fail(`${page}: article is missing BreadcrumbList JSON-LD`);
      const openingParagraph = document.querySelector('#content h1 ~ p, #content p');
      if (!openingParagraph?.textContent?.trim()) fail(`${page}: article is missing a meaningful opening paragraph`);
      if (article?.url && internalPath(article.url) !== page) fail(`${page}: article JSON-LD URL does not match canonical path`);
      if (article?.author?.url && !internalPath(article.author.url)) fail(`${page}: article author URL is not a valid internal profile URL`);
    }
  }

  const indexablePages = new Set([...pages].filter(([, value]) => !value.isNoindex).map(([page]) => page));
  const homepage = pages.get('/');
  if (!homepage || homepage.isNoindex) fail('homepage: missing or marked noindex');
  if (homepage) {
    const homepageLinks = new Set();
    for (const anchor of homepage.document.querySelectorAll('a[href]')) {
      const target = internalPath(anchor.getAttribute('href') || '');
      if (target) homepageLinks.add(target);
    }
    for (const articlePage of articlePages) if (!homepageLinks.has(articlePage)) fail(`homepage: article link ${articlePage} is not present in initial HTML`);

    const homepageNodes = jsonLdNodes(homepage.document, '/');
    const itemList = homepageNodes.find((node) => node?.['@type'] === 'CollectionPage')?.mainEntity;
    const itemUrls = new Set((itemList?.itemListElement || []).map((item) => internalPath(item?.url || item?.item?.url || '')).filter(Boolean));
    for (const articlePage of articlePages) if (!itemUrls.has(articlePage)) fail(`homepage ItemList: missing ${articlePage}`);
    for (const itemPage of itemUrls) if (!articlePages.has(itemPage)) fail(`homepage ItemList: non-article or non-indexable URL ${itemPage}`);
    for (const noindexPage of noindexPages) {
      if (homepageLinks.has(noindexPage)) fail(`homepage: noindex page ${noindexPage} is linked from initial HTML`);
      if (itemUrls.has(noindexPage)) fail(`homepage ItemList: noindex page ${noindexPage} is included`);
    }
  }

  const sitemapFiles = ['sitemap-index.xml', 'sitemap.xml'];
  const sitemapXml = new Map();
  for (const sitemapFile of sitemapFiles) {
    const sitemapPath = path.join(DIST, sitemapFile);
    if (!existsSync(sitemapPath)) fail(`${sitemapFile}: missing from dist`);
    else sitemapXml.set(sitemapFile, readFileSync(sitemapPath, 'utf8'));
  }
  const sitemapIndexLocations = sitemapXml.has('sitemap-index.xml') ? xmlLocations(sitemapXml.get('sitemap-index.xml')) : [];
  const sitemapIndexIsUrlset = sitemapXml.get('sitemap-index.xml')?.includes('<urlset') ?? false;
  const sitemapIndexIsIndex = sitemapXml.get('sitemap-index.xml')?.includes('<sitemapindex') ?? false;
  if (sitemapXml.has('sitemap-index.xml') && !sitemapIndexIsUrlset && !sitemapIndexIsIndex) fail('sitemap-index.xml: invalid sitemap document');
  if (sitemapIndexIsIndex && !sitemapIndexLocations.some((value) => normalizePath(value) === '/sitemap.xml')) fail('sitemap-index.xml: does not reference /sitemap.xml');
  const sitemapPages = new Set([
    ...(sitemapIndexIsUrlset ? sitemapIndexLocations.map(normalizePath) : []),
    ...(sitemapXml.has('sitemap.xml') ? xmlLocations(sitemapXml.get('sitemap.xml')).map(normalizePath) : []),
  ]);
  for (const page of indexablePages) if (!sitemapPages.has(page)) fail(`${page}: indexable page missing from sitemap.xml`);
  for (const page of noindexPages) if (sitemapPages.has(page)) fail(`${page}: noindex page is present in sitemap.xml`);
  for (const value of [...sitemapIndexLocations, ...xmlLocations(sitemapXml.get('sitemap.xml') || '')]) if (value !== `${SITE}/` && value.endsWith('/')) fail(`sitemap: non-root URL has trailing slash: ${value}`);

  const robotsPath = path.join(DIST, 'robots.txt');
  if (!existsSync(robotsPath)) fail('robots.txt: missing from dist');
  else if (!readFileSync(robotsPath, 'utf8').includes(`${SITE}/sitemap-index.xml`)) fail('robots.txt: canonical sitemap is not advertised');

  const rssPages = new Set();
  const rssPath = path.join(DIST, 'rss.xml');
  if (!existsSync(rssPath)) fail('rss.xml: missing from dist');
  else {
    const rss = readFileSync(rssPath, 'utf8');
    for (const match of rss.matchAll(/<(?:link|guid)(?:[^>]*)>(https:\/\/chan179\.com[^<]+)<\/(?:link|guid)>/g)) {
      const value = match[1];
      const page = normalizePath(value);
      rssPages.add(page);
      if (value !== `${SITE}/` && value.endsWith('/')) fail(`rss.xml: non-root URL has trailing slash: ${value}`);
      if (!indexablePages.has(page)) fail(`rss.xml: link is not an indexable page: ${value}`);
    }
    for (const articlePage of articlePages) if (!rssPages.has(articlePage)) fail(`${articlePage}: article missing from RSS`);
    for (const page of noindexPages) if (rssPages.has(page)) fail(`${page}: noindex page is present in RSS`);
  }

  const llmsPages = new Set();
  const llmsPath = path.join(DIST, 'llms.txt');
  if (!existsSync(llmsPath)) fail('llms.txt: missing from dist');
  else {
    const llms = readFileSync(llmsPath, 'utf8');
    for (const match of llms.matchAll(/https:\/\/chan179\.com\/[^)\s]+/g)) {
      const value = match[0];
      const page = normalizePath(value);
      llmsPages.add(page);
      if (value.endsWith('/')) fail(`llms.txt: non-root URL has trailing slash: ${value}`);
      if (!indexablePages.has(page)) fail(`llms.txt: link is not an indexable page: ${value}`);
    }
    for (const articlePage of articlePages) if (!llmsPages.has(articlePage)) fail(`${articlePage}: article missing from llms.txt`);
    for (const page of noindexPages) if (llmsPages.has(page)) fail(`${page}: noindex page is present in llms.txt`);

    const normalizedLlms = llms.replace(/\s+/g, ' ');
    const contentRoot = path.join(ROOT, 'src/content/docs');
    if (existsSync(contentRoot)) {
      for (const file of walk(contentRoot).filter((candidate) => candidate.endsWith('.md'))) {
        const frontmatter = sourceFrontmatter(file);
        const summary = typeof frontmatter.answerSummary === 'string'
          ? frontmatter.answerSummary.replace(/\s+/g, ' ').trim()
          : '';
        if (summary && !normalizedLlms.includes(summary)) {
          fail(`${path.relative(ROOT, file)}: answerSummary is missing from llms.txt`);
        }
      }
    }
  }

  for (const [page, { document, isNoindex }] of pages) {
    if (isNoindex) continue;
    for (const anchor of document.querySelectorAll('a[href]')) {
      const href = (anchor.getAttribute('href') || '').trim();
      if (!href || href.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
      if (/^https?:\/\//i.test(href) && !href.startsWith(SITE)) continue;
      if (internalPath(href) && !fileForUrl(href)) fail(`${page}: internal link does not resolve: ${href}`);
    }
  }

  const ogPath = path.join(DIST, 'og-image.png');
  if (!existsSync(ogPath)) fail('og-image.png: missing from dist');
  else if (readFileSync(ogPath).subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') fail('og-image.png: invalid PNG signature');
  const headersPath = path.join(DIST, '_headers');
  if (!existsSync(headersPath)) fail('_headers: missing from dist');
  else {
    const headers = readFileSync(headersPath, 'utf8');
    if (!headers.includes('max-age=0, must-revalidate')) fail('_headers: HTML is not configured for immediate revalidation');
    if (!headers.includes('max-age=300, stale-while-revalidate=600')) fail('_headers: machine-readable endpoints are not configured for short caching');
    if (headers.includes('max-age=21600')) fail('_headers: legacy six-hour HTML cache policy is still present');
  }
  for (const file of walk(DIST)) {
    if (!/\.(?:html|css|js|xml|txt|json)$/i.test(file)) continue;
    if (readFileSync(file, 'utf8').includes('og-image.svg')) fail(`${path.relative(DIST, file)}: legacy og-image.svg is still referenced`);
  }
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
