const DESCRIPTION_MAX_LENGTH = 200;

/**
 * Extract a description from markdown body text (first prose paragraph).
 * Ports blog/scripts/lib/markdown.js:extractDescription
 */
export function extractDescription(body: string): string {
  if (!body) return '';

  const lines = body.split('\n');
  let inCodeBlock = false;
  let paragraph = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (/^#{1,6}\s/.test(trimmed)) continue;
    if (!trimmed || /^[-*_]{3,}$/.test(trimmed)) continue;
    if (/^\s*\{%\s*embed/.test(trimmed)) continue;

    paragraph += (paragraph ? ' ' : '') + trimmed;

    if (paragraph.length >= DESCRIPTION_MAX_LENGTH) break;
  }

  paragraph = paragraph
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/>\s+/gm, '')
    .replace(/\$\$?([^$]+)\$\$?/g, '$1');

  if (paragraph.length > DESCRIPTION_MAX_LENGTH) {
    paragraph = paragraph.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd() + '...';
  }

  return paragraph;
}
