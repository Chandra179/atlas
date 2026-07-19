// Ported from blog/scripts/lib/config.js
// Name overrides for slugs that don't title-case nicely.

export const NAME_OVERRIDES: Record<string, string> = {
  'README':                 'About Me',
  'introduction':           'About Me',
  'flash-sale':             'Flash Sale', 
  'pdf-generation':         'PDF Generation',
  'browser-engine':         'Browser Engine',
  'reconcile-service':      'Reconciliation Service',
};

// Display order for root-level standalone pages (slugs).
export const ROOT_PAGE_ORDER = ['introduction', 'swe-journey', 'flash-sale', 'pdf-generation'];

// Display order for category directories (slugs).
export const CATEGORY_ORDER: string[] = [];

// Files to exclude from the collection (not content pages).
// The glob loader lowercases filenames, so we include both cases.
export const IGNORE_FILES = new Set([
  'CLAUDE.md', 'claude.md',
  'saas-template.md',
  'knowledge-map.md',
  'README.md',
]);

// Specific entry ids to exclude (GitBook/Obsidian artifacts).
// The glob loader strips .md extension and lowercases all ids.
export const IGNORE_IDS = new Set([
  'economy/summary',
  'readme',
]);

/**
 * Convert a slug to a display name, checking overrides first.
 */
export function toName(slug: string): string {
  if (NAME_OVERRIDES[slug]) return NAME_OVERRIDES[slug];
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
