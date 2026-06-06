# Contributing

Thanks for taking a look. This is the source for the POSCAR Digital marketing
site. Most major work goes through the maintainer team, but typo fixes,
content corrections, accessibility improvements, and performance tweaks from
outside are welcome.

## Before you start

- Read the [README](./README.md) for project layout, scripts, and common
  workflows (especially "Adding a new blog / press article").
- For anything larger than a small fix — new sections, layout changes,
  swapping out a library — open an issue first so we can align before you
  spend time on a PR that might not match the direction.

## Development workflow

1. Fork the repo (or branch from `main` if you have write access).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:4321/en/`. Hot reload covers content, styles,
   and Astro pages.
4. Make your change.
5. Verify the build:
   ```bash
   npm run build
   ```
   Should complete with no errors. 100+ pages built.
6. If you touched any TypeScript, also run:
   ```bash
   npm run check
   ```

## Commit messages

- **Subject line** under 70 characters, imperative mood ("Fix nav", not
  "Fixed nav" or "Fixes nav").
- Blank line after subject.
- **Body** explains *why* — the diff shows what.
- Wrap body at ~72 characters.
- No `Co-Authored-By:` trailers unless someone actually co-authored the
  work.

Example:

```
Show full image on blog post hero

The hero was forced to 16:10 with object-cover, which cropped tall
press photos and screenshots. Drop the forced aspect ratio, cap at
80vh so portrait images don't dominate the page.
```

## Pull requests

- Title matches the commit subject.
- Description: what changed, why, and a screenshot if the change is
  visual.
- One concern per PR if possible — easier to review and revert.
- Tag a maintainer (you'll know who) for review.

### What we won't merge

- Changes to `src/lib/forms.ts` that swap the Web3Forms key or expose a
  different inbox — coordinate first.
- Re-themed designs without prior discussion.
- Adding analytics SDKs. The site intentionally ships no client-side
  tracking.
- Adding runtime frameworks (React, Vue, Svelte, etc.). Astro static plus
  small inline scripts is the deliberate architecture.

## Code style

- **Astro / TypeScript** — follow patterns in nearby files. No ESLint
  config currently; match indentation and quote style with the file you're
  editing.
- **Tailwind** — use the type-scale tokens defined in
  `tailwind.config.mjs` (`text-h1`, `text-lead`, `text-body`, `text-caption`,
  etc.) rather than raw `text-2xl`-style classes. Reuse `.btn`, `.btn-primary`,
  `.btn-secondary`, `.btn-ghost`, `.card-lift`, `.eyebrow` from the global
  styles in `Base.astro`.
- **Brand color** is `#C1272D`. Don't introduce additional accent colors
  without discussion. Grays from Tailwind's default palette are fine.
- **Khmer typography** — the `:lang(km)` rules in `Base.astro` set a higher
  line-height so subscripts and superscripts don't clip. Don't override
  with a tight `leading-tight` on Khmer text.

## Adding new content

See the README's "Adding a new blog / press article" section for the full
walkthrough. The short version:

- Drop a `.md` into `src/content/blog/` with the right frontmatter
- (Optional) drop the hero image into `public/images/blog/`
- `npm run dev` to preview, `npm run build` to ship

## Questions

[info@poscardigital.com](mailto:info@poscardigital.com)
