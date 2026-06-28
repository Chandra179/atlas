import { getCollection } from 'astro:content';
import { IGNORE_FILES, IGNORE_IDS } from './ordering';

export async function getValidEntries() {
  const allEntries = await getCollection('docs');
  return allEntries.filter((e) => {
    const filename = e.id.split('/').pop() || '';
    const fnLower = filename.toLowerCase();
    return !IGNORE_FILES.has(filename) && !IGNORE_FILES.has(fnLower) && !IGNORE_IDS.has(e.id);
  });
}
