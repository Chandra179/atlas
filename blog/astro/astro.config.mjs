import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { rewriteLinks } from './src/lib/remark-rewrite-links.js';
import { gitbookEmbed } from './src/lib/remark-gitbook-embed.js';
import { remarkMermaidPreserve } from './src/lib/remark-mermaid-preserve.js';
import { rehypeRewriteAssets } from './src/lib/rehype-rewrite-assets.js';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://chan179.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    alpinejs(),
    sitemap({
      lastmod: new Date(),
    }),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      wrap: true,
    },
    remarkPlugins: [
      remarkMath,
      [gitbookEmbed, {}],
      [rewriteLinks, {}],
      remarkMermaidPreserve,
    ],
    rehypePlugins: [
      [rehypeKatex, { throwOnError: false, strict: false }],
      rehypeRewriteAssets,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
