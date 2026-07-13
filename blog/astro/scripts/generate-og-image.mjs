import sharp from 'sharp';

const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="60" y="60" width="120" height="120" rx="24" fill="rgba(255,255,255,0.15)"/>
  <text x="120" y="140" font-family="Inter, sans-serif" font-size="64" font-weight="700" fill="white" text-anchor="middle">C</text>
  <text x="200" y="132" font-family="Inter, sans-serif" font-size="72" font-weight="700" fill="white">Chan179</text>
  <text x="60" y="520" font-family="Inter, sans-serif" font-size="36" fill="rgba(255,255,255,0.85)">
  </text>
  <text x="60" y="570" font-family="Inter, sans-serif" font-size="28" fill="rgba(255,255,255,0.55)">
    System Design · Programming
  </text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-image.png');

console.log('Generated public/og-image.png');

await sharp(Buffer.from(svg.replace(`width="${W}" height="${H}"`, 'width="100" height="100"')))
  .resize(32, 32)
  .png()
  .toFile('public/favicon.png');

console.log('Generated public/favicon.png');
