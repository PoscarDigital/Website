<p align="center">
  <img src="public/og-image.png" alt="POSCAR Digital" width="600" />
</p>

# POSCAR Digital — Website

The marketing site for POSCAR Digital Co., Ltd. — built with Astro, deployed
to GitHub Pages at [poscardigital.com](https://poscardigital.com).

Bilingual: English (`/en/…`) and Khmer (`/km/…`).

---

## Stack

- **Astro 4.x** — static site generator. Output is plain HTML/CSS/JS in `dist/`.
- **Tailwind CSS** with a centralized type scale defined in `tailwind.config.mjs`
  (`text-display`, `text-h1`…`text-h4`, `text-stat`, `text-lead`, `text-body`,
  `text-caption`, `text-micro`).
- **TypeScript** for the page frontmatter and a few utilities.
- **Sharp** for build-time image work (favicons, optimizer).
- **Web3Forms** for contact + newsletter submissions (no server).
- **GitHub Actions** for build + deploy.

No runtime framework on the client — just small inline scripts where needed
(mobile nav toggle, blog search, YouTube embed transform, form submit).

---

## Local setup

Requires Node 20+.

```bash
git clone https://github.com/PoscarDigital/Website.git
cd Website
npm install
npm run dev          # http://localhost:4321/en/
```

Hot reload works for `.astro`, content, styles, and images.

---

## Project layout

```
.
├── astro.config.mjs           # site config (i18n, base, format, integrations)
├── tailwind.config.mjs        # type scale tokens + theme
├── package.json
├── public/                    # copied verbatim to dist/
│   ├── images/
│   │   ├── blog/              # per-post hero images
│   │   ├── brand/             # 01-Poscar.png, 02-WikiSchool.png, … 08-Amber.png
│   │   ├── customers/         # logo grid for the trust strip
│   │   ├── office/            # /about hero
│   │   └── …
│   ├── favicon.svg            # generated; see scripts/generate-icons.mjs
│   ├── og-image.png           # generated
│   ├── *.html                 # redirect stubs for legacy URLs
│   └── blog-index.json        # generated; gitignored
├── scripts/                   # build-time tools
│   ├── build-blog-index.mjs   # generates public/blog-index.json
│   ├── generate-press-posts.mjs
│   ├── generate-icons.mjs
│   └── optimize-images.mjs
└── src/
    ├── content/
    │   └── blog/              # one .md per post (Astro content collection)
    ├── i18n/
    │   ├── en.json            # UI strings (nav, footer, buttons)
    │   ├── km.json
    │   ├── content/
    │   │   ├── en.json        # page body copy (hero, about, contact, …)
    │   │   └── km.json
    │   ├── ui.ts
    │   └── utils.ts           # t(), getLangFromUrl(), getContentTranslations()
    ├── layouts/
    │   └── Base.astro         # <head>, global styles, .btn, .card-lift, .eyebrow
    ├── components/
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   ├── LanguagePicker.astro
    │   └── BlogPost.astro
    ├── pages/
    │   ├── [lang]/
    │   │   ├── index.astro
    │   │   ├── about.astro
    │   │   ├── contact.astro
    │   │   ├── solutions.astro
    │   │   ├── customers.astro
    │   │   ├── education-sms-solution.astro
    │   │   ├── accounting-erp-vithean.astro
    │   │   ├── attendance-solution.astro
    │   │   ├── … (one per product)
    │   │   ├── blog/[...slug].astro     # post detail
    │   │   └── blogs/[page].astro       # paginated listing + search
    │   ├── km/                          # legacy hardcoded km pages (privacy, toc)
    │   ├── index.astro                  # root redirect → /en/
    │   └── *.html (in public/)          # legacy redirect stubs
    ├── lib/
    │   └── forms.ts                     # Web3Forms key + feature flags
    ├── data/
    │   ├── customers.json
    │   ├── brands.json
    │   └── testimonial.json
    ├── types/
    └── scripts/                         # client-side JS (not the build tools)
        └── contact.js
```

---

## Adding a new blog / press article

There are two paths depending on whether you're adding **one** post by hand or
**many** from a spreadsheet.

### One post by hand

1. **Drop the hero image** into `public/images/blog/` if you have one. Name
   it to match the post slug for sanity, e.g. `2026-06-06-poscar-launch.png`.
   If the image is over 500 KB, run `npm run optimize` afterwards.
2. **Create the markdown file** in `src/content/blog/`. Use a slug of the
   form `YYYY-MM-DD-something.md`:

   ```markdown
   ---
   title: 'Your headline here'
   date: 2026-06-06
   author: 'POSCAR Digital'
   category: 'Press'         # 'Press' | 'News' | 'Technology' | 'Education' | 'Business'
   description: 'One or two sentences — shown as the lede subtitle and the listing card preview.'
   thumbnail: '/images/blog/2026-06-06-poscar-launch.png'
   source_name: 'Fresh News'                                       # optional
   source_url: 'https://freshnewsasia.com/index.php/…'             # optional
   tags: ['Wiki School', 'MoEYS']                                  # optional
   ---

   Your article body in Markdown. Plain paragraphs, **bold**, _italic_,
   [links](https://example.com), images, lists.

   > Block quotes get the red rail.

   ## Subheadings work normally
   ```
3. **That's it.** `npm run dev` shows the post live at
   `/en/blog/<slug>/` and `/km/blog/<slug>/`. The next `npm run build`
   regenerates `public/blog-index.json` and the post becomes searchable
   from the blog listing page.

### Frontmatter fields

Schema lives in `src/content/config.ts`. All fields except `title`, `date`,
and `author` are optional.

| Field | Type | What it does |
|---|---|---|
| `title` | string | Headline. Shown as `<h1>` on the post page and in the listing card |
| `date` | date | `YYYY-MM-DD`. Used for sort order and the byline |
| `author` | string | Byline credit. Usually `'POSCAR Digital'` |
| `category` | enum | `'Press'`, `'News'`, `'Technology'`, `'Education'`, `'Business'`. Pill on listing card + kicker on post page |
| `description` | string | Lede subtitle + listing card preview text |
| `thumbnail` | string | Path under `/images/…`. Brand logos (`/images/brand/…`) render in a padded white card; everything else renders as an editorial photo |
| `source_name` | string | Outlet name. Shown in byline + on the "Read on …" CTA card |
| `source_url` | string | Original article URL. Becomes the CTA button target |
| `tags` | string[] | Pills at the bottom of the post |

### YouTube source posts

If `source_url` is a YouTube link (any of `youtu.be/…`, `youtube.com/watch?v=…`,
`/embed/…`, or `/shorts/…`), the post detail page **replaces the hero photo
with a responsive video embed** automatically, and the CTA changes from
"Read on …" to "Watch on YouTube". The thumbnail is still used for the
listing card. No extra config needed — just set `source_url`.

YouTube links inside the body content are also transformed in-place into
inline embeds.

### Many posts from a spreadsheet

`scripts/generate-press-posts.mjs` carries an embedded list of press
coverage entries (originally parsed from `../website-data/link_news_Poscar.xlsx`).
To extend it:

1. Open `scripts/generate-press-posts.mjs`
2. Add new entries to the `entries` array — each one needs `{ no, serial, url, title, source }`
3. Run `npm run generate:press`
4. The script creates one stub `.md` per entry. Existing files aren't overwritten
   unless you pass `--force`.

Auto-detected based on the title keywords:
- **Thumbnail**: Wiki School / Wiki College / Wiki TV / Vithean / Bakan / Amber → matching brand logo. Otherwise the POSCAR mark.
- **Tags**: Wiki School, MoEYS, COVID-19, Partnership, etc.
- **Description**: one-line themed teaser

After running, edit each new `.md` to drop in a real summary if you have one,
or just leave the stub teaser.

---

## Other common tasks

### Updating page copy

UI strings (nav items, button labels, footer text):

- `src/i18n/en.json` and `src/i18n/km.json`
- Reference with `t('nav.solutions')` etc. in `.astro` files

Page body copy (hero text, about story, contact details, …):

- `src/i18n/content/en.json` and `src/i18n/content/km.json`
- Read with `await getContentTranslations(lang)` then dereference (e.g. `content.about.hero.title`)

### Customer logos / featured trust strip

`src/data/customers.json`. Each entry has `status` (1 = active) and `featured`
(true = appears in the homepage / solutions trust strip — first 8 featured
logos are pulled).

### Brand logos

`src/data/brands.json` controls the "Our Brands" grid on `/about`. Files live
at `/public/images/brand/`.

### Address / contact email

Address is in `src/i18n/content/en.json` + `km.json` (`contact.details.address.value`).
Email is `src/components/Footer.astro` (hardcoded) and various other places —
grep `info@poscardigital.com` to find all occurrences.

### Forms (contact + newsletter)

Both forms post to [Web3Forms](https://web3forms.com) (free, no server).

- `src/lib/forms.ts` — one place for everything:
  - `WEB3FORMS_KEY` — the public access key
  - `CONTACT_FORM_ENABLED` — toggle for the `/contact` form (default `false`)
  - `NEWSLETTER_FORM_ENABLED` — toggle for the homepage newsletter (default `false`)
- While a form is disabled, the page shows a "Please reach us directly" card
  with the email + phone links instead of the form.

### Legacy URL redirects

Each old URL is a stub HTML file in `public/` with a meta-refresh +
`<link rel="canonical">`. To add a new redirect, drop a similar stub at the
old path. See `public/contact-us/index.html` for the template.

### Image optimization

```bash
npm run optimize              # squashes anything over 500 KB
npm run optimize -- --dry-run # preview only
npm run optimize -- --force   # process everything regardless of size
```

Targets `public/images/`, resizes oversized files down to 2400px wide,
re-encodes PNG palette / JPEG mozjpeg. Atomic writes — only replaces the
source if optimization actually saved bytes.

### Favicons + icon set

Source PNG path is hardcoded near the top of `scripts/generate-icons.mjs`.
When the logo changes, drop a fresh master at that path then:

```bash
npm run icons
```

Generates `favicon.svg`, the 16/32/48/180/192/512 sizes, `og-image.png`,
and `site.webmanifest` into `public/`.

---

## Scripts reference

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server with hot reload |
| `npm run build` | Generate blog index, then full site build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Run `astro check` for type errors |
| `npm run build:index` | Regenerate just `public/blog-index.json` |
| `npm run generate:press` | Create stub `.md` files for press posts |
| `npm run optimize` | Optimize images in `public/images/` |
| `npm run icons` | Regenerate all favicons + og-image |

---

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run build` (which itself runs the blog-index prebuild + astro build)
3. Upload `dist/` as the Pages artifact
4. Publish

GitHub Pages serves at the custom domain `poscardigital.com` (configured via
the `public/CNAME` file). DNS at the registrar must be pointed at GitHub Pages
A records for the apex; CNAME on `www` to `poscardigital.github.io.`.

To roll back, revert the offending commit on `main` and push — the workflow
will deploy the previous state.

---

## Continuing the improvement

A few areas that are intentional WIP and natural next iterations:

### Translations

- New blog post bodies are written in their original language (mostly Khmer
  for press content). UI translations live in `src/i18n/`. When you add new
  UI strings, add both `en` and `km` — the `useTranslations` helper falls
  back to `defaultLang` ('en') for missing keys but the UI looks better
  with proper Khmer.
- Some short content keys still have English-only text. If you spot one,
  add the Khmer version to `src/i18n/content/km.json` at the same path.

### Blog search index growth

The search index lives in `public/blog-index.json` and ships as one file
fetched lazily on first interaction. Current size around 35 KB with ~35
posts. Once the archive grows past a few hundred posts:

- Chunk by year (`/blog-index-2024.json`, `/blog-index-2025.json`, …) and
  load only the chunk the search needs
- Or switch to MiniSearch / Pagefind for proper inverted-index search

### Press post bodies

The press posts in `src/content/blog/` are archival press coverage. Some
have full article bodies in Khmer, others just have a one-line teaser
generated by the script. Filling in the real article summaries (paraphrased
in your own words to stay clear of copyright) is an ongoing manual job and
not blocking anything.

### Forms

The Web3Forms free tier is unlimited, but if newsletter / contact volume
grows enough that you want filtering, deliverability, or analytics, the
single point of change is `src/lib/forms.ts`. Could swap to Mailchimp /
ConvertKit / a small Cloudflare Worker without touching pages.

### Accessibility

The site passes basic checks (focus rings, alt text, aria labels on the
mobile menu + iframes). Worth a Lighthouse pass after major redesigns —
focus on:
- Color contrast on the red-on-red-50 buttons and pills
- Keyboard navigation through the language picker and Solutions dropdown
- aria-live announcements on the blog search count

### Performance

Current state is healthy — most images are under 500 KB, the blog index is
small, no runtime framework. To watch for:
- Hero image sizes when adding new product pages
- Inlined CSS size (Tailwind purges, but very long class strings still add up)
- The `requestIdleCallback` blog index prefetch — adjust delay if it starts
  contending with above-the-fold rendering

### Testing

There are no tests today. For a marketing site this is normal but worth
considering:
- Lighthouse CI for a perf budget that fails the build
- A simple visual regression tool (Playwright + screenshot diffing) for
  critical pages

---

## Domain knowledge

POSCAR Digital's history is documented inline in the page copy. The key
products and dates also live in `content.about.story.timeline` (in
`src/i18n/content/en.json`) — update there if any milestone changes.

- 2017 — POSCAR Digital founded in Phnom Penh
- 2018 — WikiSchool launches (first product)
- 2019 — National high school exam scoring system under MoEYS
- 2020 — WikiTV during COVID-19
- 2021 — Vithean migrated to AWS
- 2023 — All major platforms cloud-native

---

## Conventions

- Commits: short subject (under 70 chars), longer body explaining the why.
  No need to credit reviewers / co-authors unless they did real work.
- Branching: small changes go straight to `main`. Bigger changes are
  worth a feature branch + PR for the audit trail.
- Don't push the generated `public/blog-index.json` — it's gitignored.
  `npm run prebuild` regenerates it for every build automatically.
- Be deliberate with `git add -A` — the repo has a few moving pieces
  (generated index, locally-excluded files) that can be swept in
  accidentally.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, commit
conventions, and PR guidelines.

## License

Source code and brand assets in this repository are © POSCAR Digital
Co., Ltd., all rights reserved. See [LICENSE](./LICENSE).

## Contact

For questions about the site or contributions, reach out at
[info@poscardigital.com](mailto:info@poscardigital.com).
