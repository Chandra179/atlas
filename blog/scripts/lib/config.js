const IGNORE = new Set([
    'node_modules', 'dist', 'src', 'scripts', '.git', '.gitbook',
    'CLAUDE.md', 'SUMMARY.md', 'diagrams', 'books.md', 'ROADMAP.md',
    'rate-limit.md', 'real-time-chat-discord.md',
    'notification-system.md', 'distributed-cache.md', 'stale-reports',
    'blog', 'assets', 'Templates', '.obsidian', '.opencode', 'docs'
]);

const NAME_OVERRIDES = {
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

const ROOT_PAGE_ORDER = ['README', 'p2p-chat', 'reactjs', 'etcd-raft'];
const CATEGORY_ORDER = ['fundamental', 'system-design', 'golang', 'math'];

module.exports = { IGNORE, NAME_OVERRIDES, ROOT_PAGE_ORDER, CATEGORY_ORDER };
