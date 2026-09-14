import { buildSitemapXml, sitemapResponse } from '../lib/sitemap';

// Compatibility endpoint for crawlers and tools that expect /sitemap.xml.
// The canonical URL remains /sitemap-index.xml and is advertised by robots.txt.
export async function GET({ site }: { site: URL | undefined }) {
  if (!site) return new Response(null, { status: 500 });
  return sitemapResponse(await buildSitemapXml(site));
}

