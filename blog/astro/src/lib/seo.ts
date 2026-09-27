export const SITE_NAME = 'Chandra179';
export const SITE_URL = 'https://chan179.com';
export const DEFAULT_OG_IMAGE = '/og-image.jpeg';
export const DEFAULT_OG_IMAGE_TYPE = 'image/jpeg';
export const OG_IMAGE_WIDTH = 1424;
export const OG_IMAGE_HEIGHT = 752;
export const DEFAULT_DESCRIPTION =
  'Engineering portfolio covering Go, Rust, distributed systems, data pipelines, fintech, and workflow automation.';

const AUTHOR_PROFILE_PATHS: Record<string, string> = {
  Chandra179: '/#author',
};

export function absoluteUrl(pathOrUrl: string, site: URL | string = SITE_URL): string {
  return new URL(pathOrUrl, site).href;
}

export function getAuthorProfileUrl(
  author = 'Chandra179',
  explicitProfile?: string,
  site: URL | string = SITE_URL,
): string {
  return absoluteUrl(explicitProfile || AUTHOR_PROFILE_PATHS[author] || '/#author', site);
}

export function getImageType(imageUrl: string): string {
  const path = new URL(imageUrl, SITE_URL).pathname.toLowerCase();
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.webp')) return 'image/webp';
  return DEFAULT_OG_IMAGE_TYPE;
}

export function normalizePath(path: string): string {
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
}

