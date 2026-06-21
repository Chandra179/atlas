// Rehype plugin: rewrite relative image src URLs to absolute /assets/ paths.
// At the rehype (hast) level, both Markdown ![](...) and raw HTML <img> tags
// are unified as element nodes with tagName='img'. This catches both.
import { visit } from 'unist-util-visit';

/**
 * @param {unknown} options
 * @returns {import('unified').Transformer<import('hast').Root, import('hast').Root>}
 */
export function rehypeRewriteAssets(options) {
  return (tree, vfile) => {
    const path = vfile?.path || vfile?.history?.[0] || '';
    const fileDir = path ? path.replace(/[/\\][^/\\]+$/, '') : '';

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (!src || typeof src !== 'string') return;
      if (/^(https?:|data:)/.test(src)) return;
      if (src.startsWith('/')) return; // already absolute

      const resolved = resolveRelative(src, fileDir);
      node.properties.src = resolved.replace(/^.*\/assets\//, '/assets/');
    });
  };
}

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
