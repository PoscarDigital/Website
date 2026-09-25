import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.date(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
    category: z.enum(['News', 'Technology', 'Education', 'Business', 'Press']).optional(),
    tags: z.array(z.string()).optional(),
    source_url: z.url().optional(),
    source_name: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
