import { buildNav, entryIdToUrl } from '../lib/nav';
import { getValidEntries } from '../lib/entries';

export async function GET({ site }) {
  if (!site) return new Response(null, { status: 500 });

  const validEntries = await getValidEntries();

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

  const urls: Array<{ loc: string; lastmod?: string }> = [];
  for (const url of navUrls) {
    const date = urlDates.get(url);
    const entry: { loc: string; lastmod?: string } = {
      loc: new URL(url, site).href,
    };
    if (date) entry.lastmod = date.toISOString();
    urls.push(entry);
  }

  function getPriority(path: string): string {
    const depth = path.split('/').filter(Boolean).length;
    if (depth === 0) return '1.0';
    if (depth === 1) return '0.8';
    if (depth === 2) return '0.7';
    return '0.6';
  }

  function getChangefreq(path: string): string {
    const depth = path.split('/').filter(Boolean).length;
    if (depth === 0) return 'daily';
    if (depth <= 2) return 'weekly';
    return 'monthly';
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${getChangefreq(new URL(u.loc).pathname)}</changefreq>
    <priority>${getPriority(new URL(u.loc).pathname)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
