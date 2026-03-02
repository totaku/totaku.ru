import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://totaku.ru',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    mdx(),
    robotsTxt(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
