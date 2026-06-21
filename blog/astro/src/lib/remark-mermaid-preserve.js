// Remark plugin: intercept mermaid code blocks at the mdast level (before
// hast conversion and before Shiki), replacing them with raw HTML nodes.
// This prevents Shiki from syntax-highlighting mermaid source code.
//
// At the mdast level, a fenced code block is:
//   { type: 'code', lang: 'mermaid', value: 'graph TD\n...' }
// We replace it with:
//   { type: 'html', value: '<pre class="mermaid">graph TD\n...</pre>' }
import { visit } from 'unist-util-visit';

/** Escape HTML special characters in text. */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function remarkMermaidPreserve() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (node.lang !== 'mermaid') return;

      parent.children[index] = {
        type: 'html',
        value: `<pre class="mermaid">${escapeHtml(node.value || '')}</pre>`,
      };
    });
  };
}
