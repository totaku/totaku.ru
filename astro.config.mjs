import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';
export default defineConfig({
    site: 'https://totaku.ru',
    trailingSlash: 'ignore',
    prefetch: {
        prefetchAll: false,
        defaultStrategy: 'hover',
    },
    integrations: [
        sitemap(),
        mdx(),
        robotsTxt({
            policy: [
                {
                    userAgent: '*',
                    allow: '/',
                    disallow: ['/tags/', '/categories/'],
                },
            ],
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        shikiConfig: {
            themes: {
                dark: 'tokyo-night',
                light: 'github-light',
            },
            defaultColor: false,
            wrap: true,
        },
    },
});
