// Rehype plugin: rewrite relative image src URLs to absolute /assets/ paths.
// At the rehype (hast) level, both Markdown ![](...) and raw HTML <img> tags
// are unified as element nodes with tagName='img'. This catches both.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';

const MANIFEST_PATH = path.resolve('public/assets/optimized-manifest.json');
const CONTENT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/docs');
const CONTENT_MAX_WIDTH = 768;

let _manifestCache = null;
function loadManifest() {
  if (_manifestCache !== null) return _manifestCache;
  try {
    _manifestCache = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {
    _manifestCache = { images: {} };
  }
  return _manifestCache;
}

/** @param {import('hast').Element} img */
function applyOptimizedSrc(img) {
  const src = img.properties?.src;
  if (!src || typeof src !== 'string') return;

  const match = src.match(/\/assets\/([^/]+\.(?:png|jpe?g))$/i);
  if (!match) return;

  const filename = match[1];
  const manifest = loadManifest();
  const opt = manifest.images?.[filename];
  if (!opt) return;

  if (img.properties.width == null && img.properties.height == null) {
    img.properties.width = String(opt.width);
    img.properties.height = String(opt.height);
  }

  const variants = opt.variants || {};
  const widths = Object.keys(variants).sort((a, b) => Number(a) - Number(b));
  if (widths.length > 0) {
    const srcsetParts = widths.map((w) => {
      const v = variants[w];
      return `${v.path} ${w}w`;
    });
    const srcset = srcsetParts.join(', ');
    img.properties.srcSet = img.properties.srcset || srcset;

    if (!img.properties.sizes) {
      img.properties.sizes = `(max-width: ${CONTENT_MAX_WIDTH}px) 100vw, ${CONTENT_MAX_WIDTH}px`;
    }
  }

  if (img.properties.decoding == null) {
    img.properties.decoding = 'async';
  }
}

/**
 * @returns {import('unified').Transformer<import('hast').Root, import('hast').Root>}
 */
export function rehypeRewriteAssets() {
  return (tree, vfile) => {
    const filePath = vfile?.path || vfile?.history?.[0] || '';
    const fileDir = filePath ? path.dirname(filePath) : '';
    const relDir = fileDir ? toPosix(path.relative(CONTENT_ROOT, fileDir)) : '';

    let isFirstImage = true;

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (!src || typeof src !== 'string') return;

      if (src.startsWith('/') || /^(https?:|data:)/.test(src)) {
        applyOptimizedSrc(node);
        applyLoading(node);
        return;
      }

      const resolved = resolveRelative(src, relDir);
      node.properties.src = resolved.replace(/^.*\/assets\//, '/assets/');
      applyOptimizedSrc(node);
      applyLoading(node);
    });

    function applyLoading(img) {
      if (img.properties.loading !== undefined) return;
      if (isFirstImage) {
        img.properties.loading = 'eager';
        img.properties.fetchpriority = 'high';
        isFirstImage = false;
      } else {
        img.properties.loading = 'lazy';
      }
    }
  };
}

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

function resolveRelative(relPath, relDir) {
  if (!relPath) return '';
  if (relPath.startsWith('/')) return relPath;
  const base = relDir || '';
  const combined = base ? `${base}/${relPath}` : relPath;
  const segments = combined.split('/');
  const out = [];
  for (const seg of segments) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { out.pop(); continue; }
    out.push(seg);
  }
  return '/' + out.join('/');
}
