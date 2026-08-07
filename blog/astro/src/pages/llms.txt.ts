// llms.txt: a plain-text index of site content for LLM-based answer engines,
// following the https://llmstxt.org convention. Generated from the same
// content collection as sitemap-index.xml.ts and rss.xml.ts, so it can never
// drift out of sync with what's actually published.
import { buildNav, deriveTitle, entryIdToUrl } from '../lib/nav';
import { extractDescription } from '../lib/description';
import { getValidEntries } from '../lib/entries';

export async function GET({ site }: { site: URL | undefined }) {
  if (!site) return new Response(null, { status: 500 });

  const validEntries = await getValidEntries();

  const nav = buildNav(validEntries);
  const navUrls = new Set<string>();
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

  const entries = validEntries
    .filter((e) => !e.data.noindex)
    .filter((e) => navUrls.has(entryIdToUrl(e.id)))
    .sort((a, b) => {
      const aDate = a.data.created?.getTime() ?? 0;
      const bDate = b.data.created?.getTime() ?? 0;
      return bDate - aDate;
    });

  const lines: string[] = [];
  lines.push('# Chan179');
  lines.push('');
  lines.push('> Personal blog on software engineering, system design, and mathematics, written by Chandra179.');
  lines.push('');
  lines.push('## Articles');
  lines.push('');

  for (const entry of entries) {
    const slug = entry.id.split('/').pop()!;
    const title = entry.data.title || deriveTitle(slug, entry.data.title);
    const desc = entry.data.description || extractDescription(entry.body);
    const url = new URL(entryIdToUrl(entry.id), site).href;
    lines.push(desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`);
  }

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
