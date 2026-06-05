#!/usr/bin/env node
// scripts/optimize-images.mjs
//
// Walk public/images/ and shrink PNG/JPG files that are over a size
// threshold. Resizes oversized images down to MAX_WIDTH, then re-encodes
// with sharp. Atomic (writes to a tmp file then renames). Skips SVG, GIF,
// WebP, and files that are already small.
//
// Usage:
//   npm run optimize              # optimize files over 500 KB
//   npm run optimize -- --dry-run # preview, don't write
//   npm run optimize -- --force   # ignore size threshold, optimize everything
//   npm run optimize -- --root=public/images/customers  # restrict to a subdir

import { readdir, stat, rename, rm } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const rootArg = args.find((a) => a.startsWith('--root='));
const ROOT = rootArg ? rootArg.slice('--root='.length) : 'public/images';

const SIZE_THRESHOLD = 500 * 1024; // 500 KB
const MAX_WIDTH = 2400;
const PNG_QUALITY = 80;
const JPG_QUALITY = 85;
const EXTS = new Set(['.png', '.jpg', '.jpeg']);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}

function bytesPretty(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

let totalBefore = 0;
let totalAfter = 0;
let touched = 0;
let skipped = 0;
let errors = 0;

console.log(`Scanning ${ROOT}${dryRun ? ' (dry run)' : ''}${force ? ' (force)' : ''}`);
console.log('');

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!EXTS.has(ext)) {
    skipped++;
    continue;
  }

  try {
    const { size: sizeBefore } = await stat(file);
    if (!force && sizeBefore < SIZE_THRESHOLD) {
      skipped++;
      continue;
    }

    const meta = await sharp(file).metadata();
    const targetWidth = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);

    let pipeline = sharp(file).resize({ width: targetWidth, withoutEnlargement: true });
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true });
    } else {
      pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });
    }

    if (dryRun) {
      const buf = await pipeline.toBuffer();
      const sizeAfter = buf.length;
      if (sizeAfter >= sizeBefore) {
        console.log(`SKIP ${file} — already optimal (${bytesPretty(sizeBefore)})`);
        skipped++;
        continue;
      }
      totalBefore += sizeBefore;
      totalAfter += sizeAfter;
      const savings = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);
      console.log(`[DRY] ${file}: ${bytesPretty(sizeBefore)} → ${bytesPretty(sizeAfter)} (-${savings}%)`);
      touched++;
      continue;
    }

    const tmp = `${file}.opt`;
    await pipeline.toFile(tmp);
    const { size: sizeAfter } = await stat(tmp);

    if (sizeAfter >= sizeBefore) {
      await rm(tmp).catch(() => {});
      console.log(`SKIP ${file} — already optimal (${bytesPretty(sizeBefore)})`);
      skipped++;
      continue;
    }

    await rename(tmp, file);
    totalBefore += sizeBefore;
    totalAfter += sizeAfter;
    const savings = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);
    console.log(`${file}: ${bytesPretty(sizeBefore)} → ${bytesPretty(sizeAfter)} (-${savings}%)`);
    touched++;
  } catch (err) {
    errors++;
    console.error(`ERROR ${file}: ${err.message}`);
  }
}

console.log('');
console.log(`Touched: ${touched}  Skipped: ${skipped}${errors ? `  Errors: ${errors}` : ''}`);
if (touched > 0) {
  const totalSavings = totalBefore - totalAfter;
  const savingsPct = ((1 - totalAfter / totalBefore) * 100).toFixed(0);
  console.log(`Total: ${bytesPretty(totalBefore)} → ${bytesPretty(totalAfter)} (saved ${bytesPretty(totalSavings)}, -${savingsPct}%)`);
}
