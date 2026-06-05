import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.date(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
    category: z.enum(['News', 'Technology', 'Education', 'Business', 'Press']).optional(),
    tags: z.array(z.string()).optional(),
    source_url: z.string().url().optional(),
    source_name: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
