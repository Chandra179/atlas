import { buildNav, entryIdToUrl } from './nav';
import { getValidEntries } from './entries';

export async function buildSitemapXml(site: URL): Promise<string> {
  const validEntries = await getValidEntries();
  const nav = buildNav(validEntries);
  const navUrls = new Set<string>(['/']);
  const urlDates = new Map<string, Date>();

  function collect(section: any) {
    const sectionIsIndex = !section.standalone && !section.entryId;
    if (!sectionIsIndex) navUrls.add(section.url);
    if (section.pages) {
      for (const page of section.pages) {
        const pageIsIndex = page.isFolder && !page.entryId;
        if (!pageIsIndex) navUrls.add(page.url);
        if (page.pages) for (const sub of page.pages) navUrls.add(sub.url);
      }
    }
  }
  for (const section of nav) collect(section);

  for (const entry of validEntries) {
    if (entry.data.noindex) navUrls.delete(entryIdToUrl(entry.id));
  }

  for (const entry of validEntries) {
    const url = entryIdToUrl(entry.id);
    const date = entry.data.modified || entry.data.created;
    if (navUrls.has(url) && date) {
      const existing = urlDates.get(url);
      if (!existing || date > existing) urlDates.set(url, date);
    }
  }

  const urls: Array<{ loc: string; lastmod?: string }> = [];
  for (const url of navUrls) {
    const date = urlDates.get(url);
    urls.push({
      loc: new URL(url, site).href,
      ...(date && { lastmod: date.toISOString() }),
    });
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${getChangefreq(new URL(u.loc).pathname)}</changefreq>
    <priority>${getPriority(new URL(u.loc).pathname)}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}

