#!/usr/bin/env node
// scripts/generate-icons.mjs
//
// Generates the full project icon set from a single source PNG of the
// POSCAR Digital mark. Run once after dropping a new master at SOURCE,
// or re-run to refresh outputs.
//
// Outputs (under public/):
//   favicon.svg              SVG wrapper embedding the PNG (modern browsers)
//   favicon-16x16.png        legacy / browser tab
//   favicon-32x32.png        legacy / browser tab
//   favicon-48x48.png        legacy / Windows
//   apple-touch-icon.png     iOS home screen (180x180)
//   android-chrome-192.png   PWA / Android home screen
//   android-chrome-512.png   PWA / Android splash
//   og-image.png             social share preview (1200x630, brand bg)
//   site.webmanifest         PWA manifest pointing at the above
//
// Usage: npm run icons

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SOURCE = 'D:/Logo Poscar-01-icon-sm.png';
const OUT = 'public';
const BRAND = '#C1272D';

async function exists(path) {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(SOURCE))) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const src = await readFile(SOURCE);
const meta = await sharp(src).metadata();
console.log(`Source: ${meta.width}x${meta.height} ${meta.format}`);

// Helper — resize square to a given size, transparent padding to avoid stretch.
async function square(size) {
  return sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// 1) PNG icons at standard sizes
const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon-48x48.png': 48,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};
for (const [name, size] of Object.entries(sizes)) {
  const buf = await square(size);
  await writeFile(join(OUT, name), buf);
  console.log(`+ ${name} (${size}×${size}, ${buf.length} bytes)`);
}

// 2) favicon.svg — SVG that embeds the highest-quality PNG version as a
//    base64 image. Modern browsers happily render this.
const svgPng = await square(256);
const svgB64 = svgPng.toString('base64');
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <image href="data:image/png;base64,${svgB64}" width="256" height="256"/>
</svg>
`;
await writeFile(join(OUT, 'favicon.svg'), svgContent);
console.log(`+ favicon.svg (${svgContent.length} bytes)`);

// 3) og-image.png — 1200x630 brand-red background with the mark centered.
//    Used by Open Graph + Twitter cards for social shares.
const logoForOg = await sharp(src)
  .resize(440, 440, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const ogBg = await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: BRAND,
  },
})
  .composite([
    { input: logoForOg, gravity: 'center' },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(join(OUT, 'og-image.png'), ogBg);
console.log(`+ og-image.png (1200×630, ${ogBg.length} bytes)`);

// 4) site.webmanifest — minimal PWA manifest.
const manifest = {
  name: 'POSCAR Digital',
  short_name: 'POSCAR',
  description: 'Smart education, accounting, attendance, and ERP solutions in Cambodia.',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: BRAND,
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
};
await writeFile(join(OUT, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`+ site.webmanifest`);

console.log('');
console.log('Done. Reference these in the <head> via Base.astro link tags.');
