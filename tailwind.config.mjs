/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        // Display — hero titles (fluid 36 → 60px)
        display: ['clamp(2.25rem, 1.55rem + 3.2vw, 3.75rem)', {
          lineHeight: '1.1',
          letterSpacing: '-0.025em',
          fontWeight: '700',
        }],
        // h1 — main page heading (fluid 30 → 40px)
        h1: ['clamp(1.875rem, 1.5rem + 1.9vw, 2.5rem)', {
          lineHeight: '1.15',
          letterSpacing: '-0.02em',
          fontWeight: '700',
        }],
        // h2 — section heading (fluid 24 → 30px)
        h2: ['clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', {
          lineHeight: '1.2',
          letterSpacing: '-0.015em',
          fontWeight: '700',
        }],
        // h3 — card / sub-section (fluid 20 → 24px)
        h3: ['clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)', {
          lineHeight: '1.3',
          fontWeight: '600',
        }],
        // h4 — minor heading (18 → 20px)
        h4: ['clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)', {
          lineHeight: '1.4',
          fontWeight: '600',
        }],
        // Stat number — KPI emphasis (fluid 40 → 64px)
        stat: ['clamp(2.5rem, 2rem + 2.5vw, 4rem)', {
          lineHeight: '1',
          letterSpacing: '-0.03em',
          fontWeight: '700',
        }],
        // Lead paragraph — intro / hero body
        lead: ['clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)', {
          lineHeight: '1.6',
        }],
        // Body — default paragraph
        body: ['1rem', { lineHeight: '1.65' }],
        // Caption — meta, footer body, small text
        caption: ['0.875rem', { lineHeight: '1.5' }],
        // Micro — fine print
        micro: ['0.75rem', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
