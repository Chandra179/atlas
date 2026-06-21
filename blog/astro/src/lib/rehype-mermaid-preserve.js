// Rehype plugin: extract mermaid code blocks before Shiki processes them.
// In Astro, rehype plugins run BEFORE Shiki syntax highlighting. At this point,
// code blocks are standard hast: <pre><code class="language-mermaid">source</code></pre>
// We replace them with <pre class="mermaid">source</pre> for client-side rendering.
import { visit } from 'unist-util-visit';

/**
 * @returns {import('unified').Transformer<import('hast').Root, import('hast').Root>}
 */
export function rehypeMermaidPreserve() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      // Look for <code class="language-mermaid"> inside <pre>
      if (node.tagName !== 'pre') return;
      const codeEl = (node.children || []).find(
        (c) => c.type === 'element' && c.tagName === 'code'
      );
      if (!codeEl) return;

      const classes = codeEl.properties?.className;
      if (!Array.isArray(classes)) return;
      if (!classes.includes('language-mermaid')) return;

      // Extract the raw text from the code element
      const rawText = extractText(codeEl);
      if (!rawText) return;

      // Replace the <pre> with a clean mermaid block
      parent.children[index] = {
        type: 'element',
        tagName: 'pre',
        properties: { className: ['mermaid'] },
        children: [
          {
            type: 'text',
            value: rawText,
          },
        ],
      };
    });
  };
}

/** Recursively extract plain text from a hast node. */
function extractText(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') {
    return (node.children || []).map(extractText).join('');
  }
  return '';
}
