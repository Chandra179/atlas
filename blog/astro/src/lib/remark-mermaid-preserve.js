// Remark plugin: intercept mermaid code blocks at the mdast level (before
// hast conversion and before Shiki), replacing them with raw HTML nodes.
// This prevents Shiki from syntax-highlighting mermaid source code.
//
// At the mdast level, a fenced code block is:
//   { type: 'code', lang: 'mermaid', value: 'graph TD\n...' }
// We replace it with:
//   { type: 'html', value: '<div class="mermaid-diagram" ...><pre class="mermaid">graph TD\n...</pre></div>' }
//
// Rendering is fully client-side: src/scripts/mermaid-viewer.js reads the
// source back via pre.textContent and renders it in the browser with the
// mermaid runtime. Nothing is rendered at build time.
//
// The whole source is HTML-escaped (including any inline label markup like
// <br>) so it survives rehype-raw as literal text; the client reads the
// decoded textContent and mermaid itself interprets label markup.
//
// The fence's meta string supports an optional `width=` to cap the
// diagram's initial width on the web, e.g.:
//   ```mermaid width=60%
//   ```mermaid width=400px
// The wrapper's data-orientation ("vertical|horizontal") is read from the
// diagram's own `graph`/`flowchart` direction (TB/TD/BT vs LR/RL) and is
// used by the print CSS (src/styles/print.css) and the PDF worker
// (src/worker/index.ts) to size diagrams differently for print, independent
// of whatever `width=` was set for the web.
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

      const width = parseWidth(node.meta);
      const orientation = detectOrientation(node.value);
      const pre = `<pre class="mermaid">${escapeHtml(node.value || '')}</pre>`;
      const style = width ? ` style="max-width: ${width}"` : '';

      parent.children[index] = {
        type: 'html',
        value: `<div class="mermaid-diagram" data-orientation="${orientation}"${style}>${pre}</div>`,
      };
    });
  };
}
