import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      lastmod: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      keywords: z.string().optional(),
      description: z.string().optional(),
      featuredImage: image().optional(),
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      hiddenFromHomePage: z.boolean().default(false),
      toc: z.boolean().default(false),
    }),
});

export const collections = { posts };
