// Ported from blog/scripts/lib/config.js
// Name overrides for slugs that don't title-case nicely.

export const NAME_OVERRIDES: Record<string, string> = {
  'README':                      'Introduction',
  'p2p-chat':                    'P2P Chat',
  'etcd-raft':                   'etcd & Raft',
  'fundamental':                 'Fundamentals',
  'e2e-production-rag':          'RAG',
  'golang':                      'Golang',
  'math':                        'Math',
  'reactjs':                     'ReactJS',
  'rabbitmq':                    'RabbitMQ',
  'ml':                          'ML',
  'system-design':               'System Design',
  'web-scraper':                 'Web Scraper',
  'precalculus':                 'Precalculus',
  'cpu':                         'CPU',
  'api-design-guidelines':       'API Best Practices',
  'oauth2-and-oidc':             'OAuth2 and OIDC',
  'sequence-series-limit':       'Sequence, Series, Limit',
  'linear-algebra':              'Linear Algebra',
  'clock-skew-and-time-sync':    'Clock Skew and Time Sync',
  'consistent-hashing':          'Consistent Hashing',
  'id-generator':                'ID Generator',
  'rate-limit':                  'Rate Limit',
  'distributed-task-scheduler':  'Distributed Task Scheduler',
  'distributed-cache':           'Distributed Cache',
  'notification-system':         'Notification System',
  'chunking-and-embedding':      'Chunking and Embedding',
  'garbage-collector':           'Garbage Collector',
};

// Display order for root-level standalone pages (slugs).
export const ROOT_PAGE_ORDER = ['README', 'introduction', 'rag', 'psycho', 'ai', 'reactjs', 'etcd-raft', 'syncthing'];

// Display order for category directories (slugs).
export const CATEGORY_ORDER = ['fundamental', 'system-design', 'golang', 'math', 'ai', 'database', 'economy'];

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
]);

// Specific entry ids to exclude (GitBook/Obsidian artifacts).
// The glob loader strips .md extension and lowercases all ids.
export const IGNORE_IDS = new Set([
  'economy/summary', // Obsidian dataview TOC, not content
  'readme', // root README.md stub, homepage is index.astro instead
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
