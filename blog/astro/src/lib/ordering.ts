// Ported from blog/scripts/lib/config.js
// Name overrides for slugs that don't title-case nicely.

export const NAME_OVERRIDES: Record<string, string> = {
  'README':                 'Introduction',
  'introduction':           'Introduction',
  'batch-scheduler':        'Batch Scheduler',
  'flash-sale':             'Flash Sale',
  'nadir':                  'Nadir (RAG)',
  'psycho':                 'Psycho',
};

// Display order for root-level standalone pages (slugs).
export const ROOT_PAGE_ORDER = ['introduction', 'batch-scheduler', 'flash-sale', 'nadir', 'psycho'];

// Display order for category directories (slugs).
export const CATEGORY_ORDER = [];

// Files to exclude from the collection (not content pages).
// The glob loader lowercases filenames, so we include both cases.
export const IGNORE_FILES = new Set([
  'CLAUDE.md', 'claude.md',
  'books.md',
  'ROADMAP.md', 'roadmap.md',
  'rate-limit.md',
  'real-time-chat-discord.md',
  'notification-system.md',
  'distributed-cache.md',
  'etcd-raft.md',
  'syncthing.md',
  'saas-template.md',
  'knowledge-map.md',
  'README.md',
]);

// Specific entry ids to exclude (GitBook/Obsidian artifacts).
// The glob loader strips .md extension and lowercases all ids.
export const IGNORE_IDS = new Set([
  'economy/summary', // Obsidian dataview TOC, not content
  'readme', // root README.md stub, homepage is index.astro instead
  'fundamental', 'system-design', 'golang', 'math', 'ai', 'database', 'economy',
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
