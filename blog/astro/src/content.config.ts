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
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    summary: z.string().optional(),
    answerSummary: z.string().optional(),
    author: z.string().optional(),
    authorProfile: z.string().optional(),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
    })).default([]),
    created: z.coerce.date().optional(),
    modified: z.coerce.date().optional(),
    noindex: z.boolean().optional(),
    links: z.object({
      github: z.string().optional(),
      demo: z.string().optional(),
      documentation: z.string().optional(),
    }).default({}),
  }),
});

export const collections = { docs };
