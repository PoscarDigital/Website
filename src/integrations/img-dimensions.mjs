// Astro integration: after the build, give every local <img> in dist/*.html
// intrinsic width/height attributes (read from the file with sharp) so the
// browser reserves space before the image loads — no layout shift. Also adds
// decoding="async". Tailwind's preflight sets img { height: auto }, so the
// attributes only fix the aspect ratio; CSS classes still control size.
//
// Only touches <img> tags whose src starts with "/" and that don't already
// set width or height. Remote images are left alone.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

export default function imgDimensions() {
  return {
    name: 'img-dimensions',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const cache = new Map();
        const sizeOf = async (src) => {
          if (!cache.has(src)) {
            const file = join(root, decodeURIComponent(src.split(/[?#]/)[0]));
            cache.set(src, sharp(file).metadata().then(
              (m) => (m.width && m.height ? { width: m.width, height: m.height } : null),
              () => null,
            ));
          }
          return cache.get(src);
        };

        let tagged = 0;
        let missing = new Set();
        for await (const file of htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const tags = [...html.matchAll(/<img\b[^>]*>/g)];
          if (!tags.length) continue;
          let out = '';
          let last = 0;
          for (const m of tags) {
            let tag = m[0];
            const src = tag.match(/\ssrc="(\/[^"]+)"/)?.[1];
            if (src && !/\s(width|height)=/.test(tag)) {
              const size = await sizeOf(src);
              if (size) {
                const extra = ` width="${size.width}" height="${size.height}"` +
                  (/\sdecoding=/.test(tag) ? '' : ' decoding="async"');
                tag = tag.replace(/^<img\b/, `<img${extra}`);
                tagged++;
              } else {
                missing.add(src);
              }
            }
            out += html.slice(last, m.index) + tag;
            last = m.index + m[0].length;
          }
          out += html.slice(last);
          if (out !== html) await writeFile(file, out);
        }
        logger.info(`added dimensions to ${tagged} <img> tags`);
        if (missing.size) logger.warn(`images not found or unreadable: ${[...missing].join(', ')}`);
      },
    },
  };
}
