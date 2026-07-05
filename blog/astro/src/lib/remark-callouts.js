import { visit } from 'unist-util-visit';

const VALID_TYPES = ['note', 'warning', 'danger', 'tip'];

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function mdastToHtml(nodes) {
  return nodes.map((node) => {
    switch (node.type) {
      case 'paragraph':
        return `<p>${mdastToHtml(node.children)}</p>`;
      case 'text':
        return esc(node.value);
      case 'strong':
        return `<strong>${mdastToHtml(node.children)}</strong>`;
      case 'emphasis':
        return `<em>${mdastToHtml(node.children)}</em>`;
      case 'inlineCode':
        return `<code>${esc(node.value)}</code>`;
      case 'link':
        return `<a href="${esc(node.url)}">${mdastToHtml(node.children)}</a>`;
      case 'code':
        return `<pre><code>${esc(node.value)}</code></pre>`;
      case 'list':
        if (node.ordered) {
          return `<ol>${node.children.map((li) => `<li>${mdastToHtml(li.children)}</li>`).join('')}</ol>`;
        }
        return `<ul>${node.children.map((li) => `<li>${mdastToHtml(li.children)}</li>`).join('')}</ul>`;
      case 'delete':
        return `<del>${mdastToHtml(node.children)}</del>`;
      case 'thematicBreak':
        return '<hr>';
      default:
        return '';
    }
  }).join('');
}

export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (!VALID_TYPES.includes(node.name)) return;

      const type = node.name;
      const title = node.label || '';
      const bodyHtml = mdastToHtml(node.children);

      let html;
      if (title) {
        html = `<div class="callout callout--${type}"><p class="callout-title">${esc(title)}</p>${bodyHtml}</div>`;
      } else {
        html = `<div class="callout callout--${type}">${bodyHtml}</div>`;
      }

      parent.children[index] = {
        type: 'html',
        value: html,
      };
    });
  };
}
