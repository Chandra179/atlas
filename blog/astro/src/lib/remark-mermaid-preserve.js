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
// rendered diagram's size on the web, e.g.:
//   ```mermaid width=60%
//   ```mermaid width=400px
// The <pre> is always wrapped in a <div class="mermaid-diagram"
// data-orientation="vertical|horizontal">: the orientation is read from the
// diagram's own `graph`/`flowchart` direction (TB/TD/BT vs LR/RL) and is used
// by the PDF worker (src/worker/index.ts) to size diagrams differently for
// print, independent of whatever `width=` was set for the web (rehype-mermaid
// swaps the <pre> for the rendered <svg> in place, leaving the wrapping div
// intact).
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

/** Detect vertical (TB/TD/BT) vs horizontal (LR/RL) from the diagram source. */
function detectOrientation(value) {
  const match = /^\s*(?:graph|flowchart)\s+(TB|TD|BT|LR|RL)\b/im.exec(value || '');
  const dir = match?.[1]?.toUpperCase();
  return dir === 'LR' || dir === 'RL' ? 'horizontal' : 'vertical';
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
      const orientation = detectOrientation(node.value);
      const pre = `<pre class="mermaid">${escapeHtml(cleaned)}</pre>`;
      const style = width ? ` style="max-width: ${width}"` : '';

      parent.children[index] = {
        type: 'html',
        value: `<div class="mermaid-diagram" data-orientation="${orientation}"${style}>${pre}</div>`,
      };
    });
  };
}
