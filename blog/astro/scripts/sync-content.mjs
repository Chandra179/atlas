import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const BLOG_DIR = path.join(ROOT, 'blog/astro/src/content/docs');

const ALLOWED_FILES = new Set([
  'introduction.md',
  'flash-sale.md',
  'swe-journey.md',
  'pdf-generation.md',
]);

const rootFiles = readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isFile() && e.name.endsWith('.md') && ALLOWED_FILES.has(e.name))
  .map(e => e.name);

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
let cleaned = 0;

for (const file of rootFiles) {
  const rootPath = path.join(ROOT, file);
  const blogPath = path.join(BLOG_DIR, file);

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

// Remove any .md files in blog dir that aren't in allowed list
const blogFiles = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md');

for (const entry of blogFiles) {
  if (!rootFiles.includes(entry.name)) {
    unlinkSync(path.join(BLOG_DIR, entry.name));
    console.log(`  ✗ removed: ${entry.name}`);
    cleaned++;
  }
}

// Remove subdirectories that shouldn't exist (we only want root-level allowed files)
// Include symlinks to directories
const blogDirs = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory() || e.isSymbolicLink());

for (const dir of blogDirs) {
  rmSync(path.join(BLOG_DIR, dir.name), { recursive: true, force: true });
  console.log(`  ✗ removed dir: ${dir.name}`);
  cleaned++;
}

console.log(`\nDone: ${synced} synced, ${cleaned} cleaned`);
