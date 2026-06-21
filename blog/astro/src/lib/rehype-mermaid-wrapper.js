import rehypeMermaid from 'rehype-mermaid';

function mermaidErrorFallback(ancestors, diagram) {
  const last = ancestors.at(-1);
  if (!last) return null;
  const parent = ancestors.at(-2);
  if (!parent) return null;
  const idx = parent.children.indexOf(last);
  if (idx === -1) return null;
  parent.children[idx] = {
    type: 'element',
    tagName: 'pre',
    properties: {},
    children: [{
      type: 'element',
      tagName: 'code',
      properties: { className: ['language-mermaid'] },
      children: [{ type: 'text', value: diagram }],
    }],
  };
}

export default function rehypeMermaidWrapper(options) {
  const inner = rehypeMermaid({
    ...options,
    errorFallback: () => {},
  });

  return async (tree, file) => {
    const errors = [];
    const origFileMessage = file.message.bind(file);
    file.message = (reason, ...args) => {
      const lastArg = args.at(-1);
      if (lastArg && lastArg.ancestors && lastArg.ruleId === 'rehype-mermaid') {
        errors.push({ reason, ancestors: lastArg.ancestors, ruleId: lastArg.ruleId });
        return;
      }
      return origFileMessage(reason, ...args);
    };

    await inner(tree, file);

    file.message = origFileMessage;

    for (const err of errors) {
      const diagramEl = err.ancestors?.at(-1);
      if (!diagramEl) continue;
      const diagram = diagramEl.children?.map(c => c.value || '').join('') || '';
      mermaidErrorFallback(err.ancestors, diagram);
    }
  };
}
