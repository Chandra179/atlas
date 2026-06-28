// Remark plugin: transform GitBook-style {% embed url="..." %} blocks into
// HTML div nodes that the client-side script can render as embed cards.
//
// Syntax in source markdown:
//   {% embed url="https://github.com/owner/repo" %}
//
// GFM autolinks the URL before this plugin runs, so the paragraph contains
// a mix of text and link nodes. We reconstruct the original text to match.
import { visit } from 'unist-util-visit';

const EMBED_RE = /^\s*\{%\s*embed\s+url="([^"]+)"\s*%\}\s*$/;

/**
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function gitbookEmbed() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      // Reconstruct text content, including autolinked URLs
      const text = (node.children || [])
        .map((c) => {
          if (c.type === 'text') return c.value;
          if (c.type === 'link') return c.url;
          if (c.type === 'image') return c.url;
          return '';
        })
        .join('');

      const m = text.match(EMBED_RE);
      if (!m) return;
      const url = m[1];

      // Replace the paragraph with an HTML node
      parent.children[index] = {
        type: 'html',
        value: `<div class="embed-card-wrapper" data-embed-url="${url}"></div>`,
      };
    });
  };
}
