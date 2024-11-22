import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: "kh",
    locales: [
      "kh", // Khmer
      "en"  // English
    ]
  }
});
