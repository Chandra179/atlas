import rss from '@astrojs/rss';
import { buildNav, deriveTitle, entryIdToUrl } from '../lib/nav';
import { extractDescription } from '../lib/description';
import { getValidEntries } from '../lib/entries';
import { SITE_NAME, absoluteUrl, normalizePath } from '../lib/seo';

export async function GET(context) {
  const validEntries = await getValidEntries();

  const nav = buildNav(validEntries);
  const navUrls = new Set<string>();

  function collectUrls(section) {
    navUrls.add(section.url);
    if (section.pages) {
      for (const page of section.pages) {
        navUrls.add(page.url);
        if (page.pages) {
          for (const sub of page.pages) navUrls.add(sub.url);
        }
      }
    }
  }
  for (const section of nav) collectUrls(section);

  const baseDescription = 'Personal blog on software engineering, system design';

  const items = validEntries
    .filter((e) => {
      let url = entryIdToUrl(e.id);
      if (url === '/') return false;
      return navUrls.has(url);
    })
    .filter((e) => e.data.created)
    .filter((e) => !e.data.noindex)
    .sort((a, b) => new Date(b.data.created!).getTime() - new Date(a.data.created!).getTime())
    .map((e) => {
      const url = normalizePath(entryIdToUrl(e.id));
      const title = e.data.seoTitle || e.data.title || deriveTitle(e.id.split('/').pop()!, e.data.title);
      const desc = e.data.seoDescription || e.data.description || extractDescription(e.body || '') || `${title} — ${baseDescription}`;
      return {
        title,
        description: desc.substring(0, 300),
        link: absoluteUrl(url, context.site),
        pubDate: e.data.created!,
        author: e.data.author || 'Chandra179',
        customData: e.data.tags?.length ? e.data.tags.map((t) => `<category>${t}</category>`).join('') : '',
      };
    });

  return rss({
    title: SITE_NAME,
    description: baseDescription,
    site: context.site,
    trailingSlash: false,
    items,
    customData: `<language>en-us</language>`,
  });
}
