// A true sitemap index pointing at the urlset, so tools that treat
// sitemap-index.xml specially (rather than following robots.txt) see the
// canonical structure. Generated from the same source as sitemap.xml, so
// the lastmod always reflects the newest published change.
import { collectSitemapUrls, sitemapResponse } from '../lib/sitemap';

export async function GET({ site }: { site: URL | undefined }) {
  if (!site) return new Response(null, { status: 500 });

  const urls = await collectSitemapUrls(site);
  const newest = urls
    .map((u) => u.lastmod)
    .filter((lastmod): lastmod is string => Boolean(lastmod))
    .sort()
    .at(-1);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${new URL('/sitemap.xml', site).href}</loc>${newest ? `\n    <lastmod>${newest}</lastmod>` : ''}
  </sitemap>
</sitemapindex>`;

  return sitemapResponse(xml);
}
