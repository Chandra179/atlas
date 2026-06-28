// Rebuild relative .md links to clean root-relative paths.
// e.g. [Storage](./storage-engines.md) on /database/indexing.md -> /database/storage-engines
// e.g. [RAG](../rag.md) on /ai/embeddings.md -> /rag
// Anchors are preserved: (#section) -> (#section)
import { visit } from 'unist-util-visit';

/**
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function rewriteLinks() {
  return (tree, vfile) => {
    const path = vfile?.path || vfile?.history?.[0] || '';
    visit(tree, 'link', (node) => {
      const url = node.url;
      if (!url) return;
      // Skip external, absolute (http), mailto, and pure-anchor links
      if (/^(https?:|mailto:|tel:)/.test(url)) return;
      if (url.startsWith('#')) return;

      // Split off anchor
      const [rawPath, hash] = url.split('#');
      const cleanPath = rawPath
        .replace(/\.md$/i, '')
        .replace(/\.mdx$/i, '');
      // Resolve relative to the current file's directory
      const fileDir = path ? path.replace(/[/\\][^/\\]+$/, '') : '';
      const resolved = resolveRelative(cleanPath, fileDir);
      node.url = resolved + (hash ? `#${hash}` : '');
    });
    visit(tree, 'image', (node) => {
      const url = node.url;
      if (!url) return;
      if (/^(https?:|data:)/.test(url)) return;
      if (url.startsWith('/')) return; // already absolute
      // Resolve relative to /public
      const fileDir = path ? path.replace(/[/\\][^/\\]+$/, '') : '';
      const resolved = resolveRelative(node.url, fileDir);
      // Assets live in /public/assets, served at /assets
      node.url = resolved.replace(/^.*\/assets\//, '/assets/');
    });
    // Also handle raw HTML <img> tags (not Markdown ![](...) syntax)
    visit(tree, 'html', (node) => {
      if (!node.value || typeof node.value !== 'string') return;
      const fileDir = path ? path.replace(/[/\\][^/\\]+$/, '') : '';
      node.value = node.value.replace(/(<img\s+[^>]*src=")([^"]+)(")/gi, (match, prefix, src, suffix) => {
        if (/^(https?:|data:)/.test(src) || src.startsWith('/')) return match;
        const resolved = resolveRelative(src, fileDir);
        return prefix + resolved.replace(/^.*\/assets\//, '/assets/') + suffix;
      });
      // Also rewrite <a href="..."> in raw HTML
      node.value = node.value.replace(/(<a\s+[^>]*href=")([^"]+)(")/gi, (match, prefix, href, suffix) => {
        if (/^(https?:|mailto:|tel:|#)/.test(href) || href.startsWith('/')) return match;
        const [rawPath, hash] = href.split('#');
        const cleanPath = rawPath.replace(/\.md$/i, '').replace(/\.mdx$/i, '');
        const resolved = resolveRelative(cleanPath, fileDir);
        return prefix + resolved + (hash ? '#' + hash : '') + suffix;
      });
    });
  };
}

/**
 * Resolve a relative path against a directory.
 * Both inputs are POSIX-style (forward slashes).
 * @param {string} relPath - e.g. "../rag.md" or "./storage-engines.md"
 * @param {string} baseDir - e.g. "/abs/path/to/src/content/docs/ai"
 * @returns {string} root-relative path like "/rag" or "/database/storage-engines"
 */
function resolveRelative(relPath, baseDir) {
  if (!relPath) return '';
  if (relPath.startsWith('/')) return relPath;
  const segments = (baseDir + '/' + relPath).split('/');
  const out = [];
  for (const seg of segments) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { out.pop(); continue; }
    out.push(seg);
  }
  return '/' + out.join('/');
}
