import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS_DIR = path.resolve('../../assets');
const PUBLIC_ASSETS = path.resolve('public/assets');
const OPTIMIZED_DIR = path.resolve('public/assets/optimized');
const MANIFEST_PATH = path.resolve('public/assets/optimized-manifest.json');

const TARGET_WIDTHS = [400, 800, 1200, 2400];

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log(`Assets directory not found: ${ASSETS_DIR}, skipping optimization`);
    return;
  }

  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });

  const files = fs.readdirSync(ASSETS_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));
  console.log(`Found ${files.length} images to optimize`);

  const manifest = { images: {} };

  for (const file of files) {
    const srcPath = path.join(ASSETS_DIR, file);
    const baseName = file.replace(/\.(png|jpe?g)$/i, '');
    const ext = file.match(/\.(png|jpe?g)$/i)?.[0] || '.png';

    try {
      const metadata = await sharp(srcPath).metadata();
      const origWidth = metadata.width || 800;
      const origHeight = metadata.height || 600;

      const variants = {};
      const widthsToGenerate = TARGET_WIDTHS.filter((w) => w <= origWidth);

      for (const w of widthsToGenerate) {
        const outName = `${baseName}-${w}.webp`;
        const outPath = path.join(OPTIMIZED_DIR, outName);
        const h = Math.round((w / origWidth) * origHeight);

        await sharp(srcPath)
          .resize(w, h)
          .webp({ quality: 80 })
          .toFile(outPath);

        variants[String(w)] = {
          width: w,
          height: h,
          path: `/assets/optimized/${outName}`,
        };
      }

      manifest.images[file] = {
        width: origWidth,
        height: origHeight,
        variants,
      };

      console.log(`  ${file}: ${origWidth}x${origHeight} → ${widthsToGenerate.length} variants`);
    } catch (err) {
      console.error(`  Failed to process ${file}:`, err.message);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${MANIFEST_PATH}`);
}

main().catch(console.error);
