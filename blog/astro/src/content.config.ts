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
    aliases: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    created: z.coerce.date().optional(),
    audience: z.string().optional(),
    style: z.string().optional(),
    prerequisites: z.array(z.string()).default([]),
  }),
});

export const collections = { docs };
