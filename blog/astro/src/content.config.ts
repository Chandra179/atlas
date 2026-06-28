import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  loader: glob({
    base: './src/content/docs',
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    created: z.coerce.date().optional(),
    modified: z.coerce.date().optional(),
  }),
});

export const collections = { docs };
