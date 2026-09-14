import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const width = 1200;
const height = 630;
const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/og-image.png');
const pixels = Buffer.alloc(width * height * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const offset = (y * width + x) * 4;
  pixels[offset] = r;
  pixels[offset + 1] = g;
  pixels[offset + 2] = b;
  pixels[offset + 3] = a;
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const t = x / width;
    const u = y / height;
    setPixel(
      x,
      y,
      Math.round(10 + 12 * t + 3 * u),
      Math.round(16 + 18 * t + 6 * u),
      Math.round(34 + 34 * t + 22 * u),
    );
  }
}

function line(x1, y1, x2, y2, color, thickness = 2) {
  const dx = Math.abs(x2 - x1);
  const sx = x1 < x2 ? 1 : -1;
  const dy = -Math.abs(y2 - y1);
  const sy = y1 < y2 ? 1 : -1;
  let error = dx + dy;
  let x = x1;
  let y = y1;
  while (true) {
    for (let ox = -thickness; ox <= thickness; ox++) {
      for (let oy = -thickness; oy <= thickness; oy++) setPixel(x + ox, y + oy, ...color);
    }
    if (x === x2 && y === y2) break;
    const twice = 2 * error;
    if (twice >= dy) { error += dy; x += sx; }
    if (twice <= dx) { error += dx; y += sy; }
  }
}

const nodes = [
  [930, 106], [1080, 190], [996, 324], [1135, 420], [916, 510], [1060, 558],
];
for (let i = 0; i < nodes.length - 1; i++) line(...nodes[i], ...nodes[i + 1], [67, 224, 184], 1);
line(930, 106, 996, 324, [129, 140, 248], 1);
line(1080, 190, 1135, 420, [129, 140, 248], 1);
line(996, 324, 916, 510, [129, 140, 248], 1);
for (const [x, y] of nodes) {
  for (let ox = -8; ox <= 8; ox++) for (let oy = -8; oy <= 8; oy++) {
    if (ox * ox + oy * oy <= 64) setPixel(x + ox, y + oy, 226, 232, 240);
  }
}

const glyphs = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
};

function text(value, x, y, scale, color) {
  let cursor = x;
  for (const character of value.toUpperCase()) {
    if (character === ' ') { cursor += scale * 4; continue; }
    if (character === '/') { cursor += scale * 2; continue; }
    const glyph = glyphs[character];
    if (!glyph) { cursor += scale * 6; continue; }
    glyph.forEach((row, rowIndex) => {
      [...row].forEach((on, columnIndex) => {
        if (on === '1') {
          for (let ox = 0; ox < scale; ox++) for (let oy = 0; oy < scale; oy++) {
            setPixel(cursor + columnIndex * scale + ox, y + rowIndex * scale + oy, ...color);
          }
        }
      });
    });
    cursor += scale * 6;
  }
}

text('CHANDRA179', 92, 172, 12, [241, 245, 249]);
text('GO / RUST / DISTRIBUTED SYSTEMS', 96, 322, 5, [167, 243, 208]);
text('DATA PIPELINES  /  FINTECH  /  WORKFLOW AUTOMATION', 96, 380, 3, [148, 163, 184]);

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  let value = 0xffffffff;
  for (const byte of Buffer.concat([typeBuffer, data])) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  }
  crc.writeUInt32BE((value ^ 0xffffffff) >>> 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

const scanlines = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y++) {
  scanlines[y * (width * 4 + 1)] = 0;
  pixels.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
}

const header = Buffer.alloc(13);
header.writeUInt32BE(width, 0);
header.writeUInt32BE(height, 4);
header[8] = 8;
header[9] = 6;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(scanlines)),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, png);
console.log(`Generated ${output} (${width}x${height})`);

