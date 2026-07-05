import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const BLOG_DIR = path.join(ROOT, 'blog/astro/src/content/docs');

const FILES = [
  'etcd-raft.md',
  'introduction.md',
  'knowledge-map.md',
  'psycho.md',
  'rag.md',
  'reactjs.md',
  'saas-template.md',
  'syncthing.md',
];

function titleFromFilename(name) {
  return name
    .replace(/\.md$/, '')
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function stripFrontmatter(content) {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('---', 3);
  if (end === -1) return content;
  return content.slice(end + 3).trimStart();
}

function extractFrontmatterBlock(content) {
  if (!content.startsWith('---')) return '';
  const end = content.indexOf('---', 3);
  if (end === -1) return '';
  return content.slice(3, end).trim();
}

let synced = 0;
let skipped = 0;

for (const file of FILES) {
  const rootPath = path.join(ROOT, file);
  const blogPath = path.join(BLOG_DIR, file);

  if (!existsSync(rootPath)) {
    console.warn(`  ⚠  root file missing: ${file}`);
    skipped++;
    continue;
  }

  const rootContent = readFileSync(rootPath, 'utf-8');
  const rootBody = stripFrontmatter(rootContent);

  let frontmatter = `title: "${titleFromFilename(file)}"`;
  if (existsSync(blogPath)) {
    const blogContent = readFileSync(blogPath, 'utf-8');
    const blogFm = extractFrontmatterBlock(blogContent);
    if (blogFm) frontmatter = blogFm;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (frontmatter.includes('modified:')) {
    frontmatter = frontmatter.replace(/modified:\s*.*/, `modified: "${today}"`);
  } else {
    frontmatter += `\nmodified: "${today}"`;
  }

  const newContent = `---\n${frontmatter}\n---\n\n${rootBody}`;
  writeFileSync(blogPath, newContent);
  console.log(`  ✓ ${file}`);
  synced++;
}

console.log(`\nDone: ${synced} synced, ${skipped} skipped`);
