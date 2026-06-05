import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://poscardigital.com',
  integrations: [tailwind()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "km"],
    routing: {
      prefixDefaultLocale: true,
      strategy: "prefix-always"
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
