import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://poscardigital.com',
  integrations: [tailwind()],
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
