// remark-directive claims every `:word` sequence in prose as an inline
// directive, so ratios and times like "N:1" or "10:30" lose their ":…",
// and directives no plugin handles render as nothing. Callouts have already
// claimed the container directives they own by the time this runs; anything
// still standing is almost certainly prose that happens to contain a colon,
// so put it back as literal text.
import { visit } from 'unist-util-visit';

function directiveText(node) {
  let value = `:${node.name}`;
  const label = node.label ?? (node.children || []).map((child) => child.value ?? '').join('');
  if (label) value += `[${label}]`;
  return { type: 'text', value };
}

/**
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function rescueDirectives() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (node.type === 'textDirective') {
        parent.children[index] = directiveText(node);
      } else if (node.type === 'leafDirective') {
        parent.children[index] = { type: 'paragraph', children: [directiveText(node)] };
      }
      // containerDirective is left alone: callouts owns the vault's `:::note`
      // etc., and rebuilding unknown multi-block containers as text is a
      // separate decision.
    });
  };
}
