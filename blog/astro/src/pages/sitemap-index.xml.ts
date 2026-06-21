import { getCollection } from 'astro:content';
import { buildNav, entryIdToUrl } from '../lib/nav';
import { IGNORE_FILES, IGNORE_IDS } from '../lib/ordering';

export async function GET({ site }) {
  if (!site) return new Response(null, { status: 500 });

  const allEntries = await getCollection('docs');
  const validEntries = allEntries.filter((e) => {
    const filename = e.id.split('/').pop() || '';
    const fnLower = filename.toLowerCase();
    return !IGNORE_FILES.has(filename) && !IGNORE_FILES.has(fnLower) && !IGNORE_IDS.has(e.id);
  });

  const nav = buildNav(validEntries);
  const navUrls = new Set<string>();
  const urlDates = new Map<string, Date>();

  function collect(section: any) {
    navUrls.add(section.url);
    if (section.pages) {
      for (const page of section.pages) {
        navUrls.add(page.url);
        if (page.pages) for (const sub of page.pages) navUrls.add(sub.url);
      }
    }
  }
  for (const section of nav) collect(section);

  for (const entry of validEntries) {
    const url = entryIdToUrl(entry.id);
    if (navUrls.has(url) && entry.data.created) {
      const existing = urlDates.get(url);
      if (!existing || entry.data.created > existing) {
        urlDates.set(url, entry.data.created);
      }
    }
  }

  const urls: Array<{ loc: string; lastmod: string }> = [];
  for (const url of navUrls) {
    const date = urlDates.get(url);
    urls.push({
      loc: new URL(url, site).href,
      lastmod: date ? date.toISOString() : new Date().toISOString(),
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
