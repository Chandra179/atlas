// Remark plugin: intercept mermaid code blocks at the mdast level (before
// hast conversion and before Shiki), replacing them with raw HTML nodes.
// This prevents Shiki from syntax-highlighting mermaid source code.
//
// At the mdast level, a fenced code block is:
//   { type: 'code', lang: 'mermaid', value: 'graph TD\n...' }
// We replace it with:
//   { type: 'html', value: '<pre class="mermaid">graph TD\n...</pre>' }
//
// A <pre class="mermaid"> is used so rehype-mermaid can match it at the
// hast level and render it to an inline <svg> at build time.
//
// The fence's meta string supports an optional `width=` to cap the
// rendered diagram's size, e.g.:
//   ```mermaid width=60%
//   ```mermaid width=400px
// This wraps the <pre> in a <div class="mermaid-diagram"> with a
// `max-width` inline style (rehype-mermaid swaps the <pre> for the
// rendered <svg> in place, leaving the wrapping div intact).
import { visit } from 'unist-util-visit';

/** Escape HTML special characters in text. */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Extract a `width=` value (e.g. "60%" or "400px") from a fence meta string. */
function parseWidth(meta) {
  const match = /width\s*=\s*"?(\d+(?:%|px))"?/.exec(meta || '');
  return match ? match[1] : null;
}

/**
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function remarkMermaidPreserve() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (node.lang !== 'mermaid') return;

      const cleaned = (node.value || '').replace(/<(?!\/?br\s*\/?>)[^>]+>/g, '');
      const width = parseWidth(node.meta);
      const pre = `<pre class="mermaid">${escapeHtml(cleaned)}</pre>`;

      parent.children[index] = {
        type: 'html',
        value: width
          ? `<div class="mermaid-diagram" style="max-width: ${width}">${pre}</div>`
          : pre,
      };
    });
  };
}
