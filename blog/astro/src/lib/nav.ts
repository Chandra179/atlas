import type { CollectionEntry } from 'astro:content';
import { NAME_OVERRIDES, ROOT_PAGE_ORDER, CATEGORY_ORDER, IGNORE_FILES, IGNORE_IDS, toName } from './ordering';

export interface NavPage {
  name: string;
  slug: string;
  isFolder?: boolean;
  pages?: NavPage[];
  /** Collection entry id (e.g. "ai/ml.md") — used to render the page. */
  entryId?: string;
  /** URL path, e.g. "/ai/ml". */
  url: string;
  /** Frontmatter description (for landing cards / meta). */
  description?: string;
}

export interface NavSection {
  name: string;
  slug: string;
  standalone?: boolean;
  pages?: NavPage[];
  entryId?: string;
  url: string;
  description?: string;
}

/**
 * Convert a collection entry id (e.g. "ai/ml", "fundamental/readme") to a
 * URL path (e.g. "/ai/ml", "/fundamental").
 * The glob loader strips .md extensions and lowercases all ids.
 */
export function entryIdToUrl(id: string): string {
  let path = id;
  // readme at any level collapses to its parent directory.
  // "fundamental/readme" -> "fundamental"
  // "math/precalculus/readme" -> "math/precalculus"
  path = path.replace(/\/readme$/i, '');
  // Root-level "readme" -> "" (the homepage)
  if (path.toLowerCase() === 'readme') path = '';
  return '/' + path;
}

/**
 * Derive a display title for a page from its slug, checking frontmatter title first,
 * then NAME_OVERRIDES, then title-casing the slug.
 */
export function deriveTitle(slug: string, frontmatterTitle?: string): string {
  if (frontmatterTitle) return frontmatterTitle;
  if (NAME_OVERRIDES[slug]) return NAME_OVERRIDES[slug];
  return toName(slug);
}

/**
 * Build the full navigation tree from collection entries.
 * Mirrors the structure of the old scripts/gen-nav.js output.
 */
export function buildNav(entries: CollectionEntry<'docs'>[]): NavSection[] {
  // Filter out ignored files (case-insensitive check on filename) and specific ids
  const valid = entries.filter((e) => {
    const filename = e.id.split('/').pop() || '';
    const filenameLower = filename.toLowerCase();
    return !IGNORE_FILES.has(filename) && !IGNORE_FILES.has(filenameLower) && !IGNORE_IDS.has(e.id);
  });

  // Partition into root-level files (standalone) and directory entries.
  const rootFiles: CollectionEntry<'docs'>[] = [];
  const dirEntries: CollectionEntry<'docs'>[] = [];

  for (const entry of valid) {
    const parts = entry.id.split('/');
    if (parts.length === 1) {
      // Root-level .md file (e.g. "reactjs.md")
      rootFiles.push(entry);
    } else {
      // Inside a directory (e.g. "ai/ml.md", "math/README.md")
      dirEntries.push(entry);
    }
  }

  // Build root standalone sections, ordered by ROOT_PAGE_ORDER then alphabetical.
  const rootSlugs = rootFiles.map((e) => e.id);
  const orderedRootSlugs = [
    ...ROOT_PAGE_ORDER.filter((s) => rootSlugs.includes(s)),
    ...rootSlugs.filter((s) => !ROOT_PAGE_ORDER.includes(s)).sort(),
  ];

  const nav: NavSection[] = [];

  for (const slug of orderedRootSlugs) {
    const entry = rootFiles.find((e) => e.id === slug);
    if (!entry) continue;
    const url = entryIdToUrl(entry.id);
    nav.push({
      name: deriveTitle(slug, entry.data.title),
      slug,
      standalone: true,
      entryId: entry.id,
      url,
      description: entry.data.description,
    });
  }

  // Build category sections from directory entries.
  const categorySlugs = [...new Set(
    dirEntries.map((e) => e.id.split('/')[0])
  )].filter((s) => !IGNORE_FILES.has(s));

  const orderedCategorySlugs = [
    ...CATEGORY_ORDER.filter((s) => categorySlugs.includes(s)),
    ...categorySlugs
      .filter((s) => !CATEGORY_ORDER.includes(s))
      .sort(),
  ];

  for (const catSlug of orderedCategorySlugs) {
    const catEntries = dirEntries.filter((e) => e.id.split('/')[0] === catSlug);
    const readme = catEntries.find((e) => e.id === `${catSlug}/readme`);
    const pages = buildPages(catEntries, catSlug, 0);

    const section: NavSection = {
      name: deriveTitle(catSlug, readme?.data.title),
      slug: catSlug,
      entryId: readme?.id,
      url: readme ? entryIdToUrl(readme.id) : `/${catSlug}`,
      description: readme?.data.description,
      pages,
    };
    nav.push(section);
  }

  return nav;
}

/**
 * Recursively build page entries for a category directory.
 * depth 0 = top-level pages in the category (e.g. "ai/ml.md")
 * depth 1+ = nested folders (e.g. "math/precalculus/summary.md")
 */
function buildPages(
  entries: CollectionEntry<'docs'>[],
  categorySlug: string,
  depth: number,
  pathPrefix = '',
): NavPage[] {
  const pages: NavPage[] = [];

  // Group entries by their next path segment after the category + prefix.
  const prefix = pathPrefix ? `${categorySlug}/${pathPrefix}/` : `${categorySlug}/`;

  // Direct children: files at this level (not in subdirectories, not README)
  const directFiles = entries.filter((e) => {
    if (e.id === `${prefix}readme`) return false;
    const rest = e.id.slice(prefix.length);
    return rest && !rest.includes('/');
  });

  // Subdirectories: entries whose next segment is a directory
  const subdirSlugs = [...new Set(
    entries
      .filter((e) => {
        const rest = e.id.slice(prefix.length);
        return rest.includes('/');
      })
      .map((e) => e.id.slice(prefix.length).split('/')[0])
  )];

  // Add direct file pages (sorted by slug)
  for (const entry of directFiles.sort((a, b) => a.id.localeCompare(b.id))) {
    const slug = entry.id.split('/').pop()!;
    const url = entryIdToUrl(entry.id);
    pages.push({
      name: deriveTitle(slug, entry.data.title),
      slug,
      entryId: entry.id,
      url,
      description: entry.data.description,
    });
  }

  // Add subdirectory folders (only at depth 0, matching gen-nav.js:42)
  if (depth === 0) {
    for (const subSlug of subdirSlugs.sort()) {
      const subEntries = entries.filter((e) => e.id.startsWith(`${prefix}${subSlug}/`));
      if (subEntries.length === 0) continue;

      const readme = subEntries.find((e) => e.id === `${prefix}${subSlug}/readme`);
      const subPages = buildPages(subEntries, categorySlug, depth + 1, pathPrefix ? `${pathPrefix}/${subSlug}` : subSlug);

      pages.push({
        name: deriveTitle(subSlug, readme?.data.title),
        slug: subSlug,
        isFolder: true,
        pages: subPages,
        entryId: readme?.id,
        url: readme ? entryIdToUrl(readme.id) : `/${categorySlug}/${pathPrefix ? pathPrefix + '/' : ''}${subSlug}`,
        description: readme?.data.description,
      });
    }
  }

  // Sort: files first (alphabetical), then folders (alphabetical) — matching gen-nav.js which sorts files then dirs
  // Actually gen-nav.js sorts files and dirs separately, files first, then dirs. Let's replicate.
  const filePages = pages.filter((p) => !p.isFolder).sort((a, b) => a.slug.localeCompare(b.slug));
  const folderPages = pages.filter((p) => p.isFolder).sort((a, b) => a.slug.localeCompare(b.slug));

  return [...filePages, ...folderPages];
}

/**
 * Build a breadcrumb string for a given URL path.
 * e.g. "/math/precalculus/summary" -> "Math / Precalculus / Summary"
 */
export function buildBreadcrumb(nav: NavSection[], url: string): string {
  const path = url.replace(/^\//, '').replace(/\/$/, '');
  if (!path) return 'Home';

  const parts = path.split('/');
  const section = nav.find((s) => s.slug === parts[0]);
  if (!section) return path;

  const crumbs: string[] = [section.name];

  if (parts.length === 1) return crumbs.join(' / ');

  // Navigate into pages/folders
  let currentPages = section.pages;
  for (let i = 1; i < parts.length; i++) {
    const slug = parts[i];
    const item = currentPages?.find((p) => p.slug === slug);
    if (item) {
      crumbs.push(item.name);
      if (item.isFolder && item.pages) {
        currentPages = item.pages;
      }
    } else {
      crumbs.push(toName(slug));
    }
  }

  return crumbs.join(' / ');
}
