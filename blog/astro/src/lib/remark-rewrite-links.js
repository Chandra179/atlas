// Rebuild relative .md links to clean root-relative paths.
// e.g. [Storage](./storage-engines.md) on /database/indexing.md -> /database/storage-engines
// e.g. [RAG](../rag.md) on /ai/embeddings.md -> /rag
// Anchors are preserved: (#section) -> (#section)
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { visit } from 'unist-util-visit';

// The Astro content collection root. All .md URLs are resolved relative to this.
const CONTENT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/docs');

/**
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function rewriteLinks() {
  return (tree, vfile) => {
    const filePath = vfile?.path || vfile?.history?.[0] || '';
    const fileDir = filePath ? path.dirname(filePath) : '';
    // Directory of the current file expressed relative to the content collection root
    const relDir = fileDir ? toPosix(path.relative(CONTENT_ROOT, fileDir)) : '';

    visit(tree, 'link', (node) => {
      const url = node.url;
      if (!url) return;
      // Skip external, absolute (http), mailto, and pure-anchor links
      if (/^(https?:|mailto:|tel:)/.test(url)) return;
      if (url.startsWith('#')) return;

      const newUrl = resolveMdUrl(url, relDir);
      if (newUrl) node.url = newUrl;
    });
    visit(tree, 'image', (node) => {
      const url = node.url;
      if (!url) return;
      if (/^(https?:|data:)/.test(url)) return;
      if (url.startsWith('/')) return; // already absolute
      // Resolve relative to /public
      const resolved = resolveRelative(url, relDir);
      // Assets live in /public/assets, served at /assets
      node.url = resolved.replace(/^.*\/assets\//, '/assets/');
    });
    // Also handle raw HTML <img> tags (not Markdown ![](...) syntax)
    visit(tree, 'html', (node) => {
      if (!node.value || typeof node.value !== 'string') return;
      node.value = node.value.replace(/(<img\s+[^>]*src=")([^"]+)(")/gi, (match, prefix, src, suffix) => {
        if (/^(https?:|data:)/.test(src) || src.startsWith('/')) return match;
        const resolved = resolveRelative(src, relDir);
        return prefix + resolved.replace(/^.*\/assets\//, '/assets/') + suffix;
      });
      // Also rewrite <a href="..."> in raw HTML
      node.value = node.value.replace(/(<a\s+[^>]*href=")([^"]+)(")/gi, (match, prefix, href, suffix) => {
        if (/^(https?:|mailto:|tel:|#)/.test(href) || href.startsWith('/')) return match;
        const newUrl = resolveMdUrl(href, relDir);
        return newUrl ? prefix + newUrl + suffix : match;
      });
    });
  };
}

function resolveMdUrl(url, relDir) {
  // Split off anchor
  const hashIdx = url.indexOf('#');
  const rawPath = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  const hash = hashIdx >= 0 ? url.slice(hashIdx) : '';
  const cleanPath = rawPath
    .replace(/\.md$/i, '')
    .replace(/\.mdx$/i, '');
  const resolved = resolveRelative(cleanPath, relDir);
  // A trailing /README (case-insensitive) maps to the directory index,
  // e.g. /database/README -> /database
  const normalized = resolved.replace(/\/readme$/i, '') || '/';
  return normalized + hash;
}

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Resolve a relative path against a directory expressed relative to the content root.
 * @param {string} relPath - e.g. "../rag.md" or "./storage-engines.md"
 * @param {string} relDir - e.g. "database" or "ai"
 * @returns {string} root-relative path like "/rag" or "/database/storage-engines"
 */
function resolveRelative(relPath, relDir) {
  if (!relPath) return '';
  if (relPath.startsWith('/')) return relPath;
  const base = relDir || '';
  const combined = base ? `${base}/${relPath}` : relPath;
  const segments = combined.split('/');
  const out = [];
  for (const seg of segments) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { out.pop(); continue; }
    out.push(seg);
  }
  return '/' + out.join('/');
}
