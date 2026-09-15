import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const BLOG_DIR = path.join(ROOT, 'blog/astro/src/content/docs');

const ALLOWED_FILES = new Set([
  'about/introduction.md',
  'swe/swe-journey.md',
  'system-design/uber-architecture.md',
  'system-design/youtube-architecture.md',
  'system-design/cache.md',
  'system-design/nadir.md',
  'system-design/ohara.md',
  'system-design/system-design-core.md',
]);

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

function parseFrontmatter(block) {
  if (!block) return {};
  try {
    return yaml.load(block) || {};
  } catch {
    return {};
  }
}

// Last real commit date for a root file, so `modified` reflects actual
// content changes instead of "whenever sync last ran". Untracked/new
// files (e.g. not yet committed) fall back to today.
function lastCommitDate(file) {
  try {
    const out = execFileSync(
      'git', ['log', '-1', '--format=%ad', '--date=short', '--', file],
      { cwd: ROOT, encoding: 'utf-8' }
    ).trim();
    if (out) return out;
  } catch {
    // not a git repo / git unavailable, fall through
  }
  return new Date().toISOString().slice(0, 10);
}

let synced = 0;
let cleaned = 0;

// Root Markdown is authoritative. The site collection flattens the published
// allow-list into src/content/docs so Astro can use clean one-segment routes.
for (const file of [...ALLOWED_FILES]) {
  const rootPath = path.join(ROOT, file);
  const destName = path.basename(file);
  const blogPath = path.join(BLOG_DIR, destName);

  if (!existsSync(rootPath)) {
    console.log(`  ! source not found: ${file}`);
    continue;
  }

  const rootContent = readFileSync(rootPath, 'utf-8');
  const rootBody = stripFrontmatter(rootContent);
  const rootFm = parseFrontmatter(extractFrontmatterBlock(rootContent));

  let blogFm = {};
  if (existsSync(blogPath)) {
    const blogContent = readFileSync(blogPath, 'utf-8');
    blogFm = parseFrontmatter(extractFrontmatterBlock(blogContent));
  }

  const merged = { ...blogFm, ...rootFm };
  if (!merged.title) merged.title = titleFromFilename(destName);
  merged.modified = lastCommitDate(file);

  const frontmatter = yaml.dump(merged).trim();
  const newContent = `---\n${frontmatter}\n---\n\n${rootBody}`;
  writeFileSync(blogPath, newContent);
  console.log(`  ✓ ${file} → ${destName}`);
  synced++;
}

// Remove generated Markdown files outside the published allow-list.
const allowedDestNames = new Set([...ALLOWED_FILES].map((file) => path.basename(file)));
const blogFiles = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md');

for (const entry of blogFiles) {
  if (!allowedDestNames.has(entry.name)) {
    unlinkSync(path.join(BLOG_DIR, entry.name));
    console.log(`  ✗ removed: ${entry.name}`);
    cleaned++;
  }
}

// Remove any subdirectories (we only want flat files)
const blogDirs = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory() || e.isSymbolicLink());

for (const dir of blogDirs) {
  rmSync(path.join(BLOG_DIR, dir.name), { recursive: true, force: true });
  console.log(`  ✗ removed dir: ${dir.name}`);
  cleaned++;
}

console.log(`\nDone: ${synced} synced, ${cleaned} cleaned`);
