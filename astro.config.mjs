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
    format: 'file'
  },
  server: {
    host: true
  }
});
