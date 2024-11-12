import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [vue(), tailwind()],
  i18n: {
    defaultLocale: "kh",
    locales: [
      "kh", // Khmer
      "en"  // English
    ]
  }
});
