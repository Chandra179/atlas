import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { buildNav, deriveTitle, entryIdToUrl } from '../lib/nav';
import { extractDescription } from '../lib/description';
import { IGNORE_FILES, IGNORE_IDS } from '../lib/ordering';

export async function GET(context) {
  const allEntries = await getCollection('docs');
  const validEntries = allEntries.filter((e) => {
    const filename = e.id.split('/').pop() || '';
    const fnLower = filename.toLowerCase();
    return !IGNORE_FILES.has(filename) && !IGNORE_FILES.has(fnLower) && !IGNORE_IDS.has(e.id);
  });

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

  const baseDescription = 'Technical notes and learning resources on Math, Golang, System Design, ML, and more.';

  const items = validEntries
    .filter((e) => {
      let url = entryIdToUrl(e.id);
      if (url === '/') return false;
      return navUrls.has(url);
    })
    .filter((e) => e.data.created)
    .sort((a, b) => new Date(b.data.created!).getTime() - new Date(a.data.created!).getTime())
    .map((e) => {
      const url = entryIdToUrl(e.id);
      const title = e.data.title || deriveTitle(e.id.split('/').pop()!, e.data.title);
      const desc = e.data.description || extractDescription(e.body) || `${title} — ${baseDescription}`;
      return {
        title,
        description: desc.substring(0, 300),
        link: url,
        pubDate: e.data.created!,
        customData: e.data.tags?.length ? e.data.tags.map((t) => `<category>${t}</category>`).join('') : '',
      };
    });

  return rss({
    title: 'Chan179',
    description: baseDescription,
    site: context.site,
    items,
    customData: `<language>en-us</language>`,
  });
}
