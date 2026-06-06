#!/usr/bin/env node
// scripts/build-blog-index.mjs
//
// Walks src/content/blog/*.md, pulls the searchable metadata out of each
// post's frontmatter (title, description, date, category, source_name,
// tags, thumbnail), and writes a sorted-newest-first JSON array to
// public/blog-index.json.
//
// Runs automatically as part of `npm run build` (see package.json).
// Can also be invoked on its own:
//
//   npm run build:index

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';

const SRC = 'src/content/blog';
const OUT = 'public/blog-index.json';

// Minimal YAML frontmatter parser — handles the shapes the generator and
// any hand-edited posts produce: quoted strings (single or double),
// inline arrays [a, b, c], dates, and plain barewords. Skips nested
// objects (none used by the blog schema).
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (/^\s/.test(line)) continue; // skip indented continuation lines
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if (!v) { data[key] = ''; continue; }
    if (v.startsWith("'") && v.endsWith("'")) {
      data[key] = v.slice(1, -1).replace(/''/g, "'");
      continue;
    }
    if (v.startsWith('"') && v.endsWith('"')) {
      data[key] = v.slice(1, -1).replace(/\\"/g, '"');
      continue;
    }
    if (v.startsWith('[') && v.endsWith(']')) {
      data[key] = v.slice(1, -1).split(',').map((s) => {
        const t = s.trim();
        if ((t.startsWith("'") && t.endsWith("'")) ||
            (t.startsWith('"') && t.endsWith('"'))) {
          return t.slice(1, -1).replace(/''/g, "'").replace(/\\"/g, '"');
        }
        return t;
      }).filter(Boolean);
      continue;
    }
    data[key] = v;
  }
  return data;
}

const files = (await readdir(SRC)).filter((f) => f.endsWith('.md'));

const posts = [];
let skipped = 0;
for (const f of files) {
  const raw = await readFile(join(SRC, f), 'utf8');
  const fm = parseFrontmatter(raw);
  if (!fm || !fm.title) { skipped++; continue; }
  posts.push({
    slug: basename(f, '.md'),
    title: fm.title,
    description: fm.description ?? '',
    date: fm.date ?? '',
    category: fm.category ?? '',
    source: fm.source_name ?? '',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    thumbnail: fm.thumbnail ?? '',
  });
}

// Newest first. Dates are YYYY-MM-DD strings; lexicographic sort works.
posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(posts, null, 2) + '\n');

console.log(`blog-index: wrote ${posts.length} posts to ${OUT}${skipped ? ` (skipped ${skipped} unparseable)` : ''}`);
