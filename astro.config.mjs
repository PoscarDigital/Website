import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import imgDimensions from './src/integrations/img-dimensions.mjs';

export default defineConfig({
  site: 'https://poscardigital.com',
  integrations: [
    imgDimensions(),
    sitemap({
      // /en/ canonicalizes to / (same content), so list only the root.
      filter: (page) => page !== 'https://poscardigital.com/en/',
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', km: 'km-KH' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "km"],
    routing: {
      // Serve the default locale (en) without a prefix so "/" renders the
      // English homepage directly instead of redirecting to "/en/". Khmer
      // stays under "/km/". (Setting this to true makes Astro auto-generate
      // a "/" -> "/en/" redirect, which is what we're removing.)
      prefixDefaultLocale: false
    }
  },
  security: {
    // Emits a <meta http-equiv="content-security-policy"> on every page with
    // hashes for Astro's bundled/inline scripts and styles. GitHub Pages
    // can't send real headers, so this is the only CSP available; note that
    // frame-ancestors (anti-clickjacking) is ignored in <meta>.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://api.web3forms.com",
        "frame-src https://www.youtube-nocookie.com https://www.google.com",
        "form-action 'self' https://api.web3forms.com",
        "base-uri 'self'",
        "object-src 'none'",
      ],
    },
  },
  // No code blocks on the site; Shiki's inline styles would violate the CSP.
  markdown: { syntaxHighlight: false },
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // 'directory' so routes build to /path/index.html. GitHub Pages
    // (and most static hosts) serve directory-style URLs like /en/ by
    // looking for /en/index.html, not /en.html.
    format: 'directory'
  },
  server: {
    host: true
  }
});
