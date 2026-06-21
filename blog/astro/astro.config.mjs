import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import astroExpressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { rewriteLinks } from './src/lib/remark-rewrite-links.js';
import { gitbookEmbed } from './src/lib/remark-gitbook-embed.js';
import { remarkMermaidPreserve } from './src/lib/remark-mermaid-preserve.js';
import { rehypeRewriteAssets } from './src/lib/rehype-rewrite-assets.js';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://chan179.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    astroExpressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => (theme.name === 'github-dark' ? '.dark' : false),
      defaultProps: {
        wrap: true,
      },
    }),
    alpinejs(),
    sitemap({
      lastmod: new Date(),
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      [gitbookEmbed, {}],
      [rewriteLinks, {}],
      remarkMermaidPreserve,
    ],
    rehypePlugins: [
      rehypeRaw,
      [rehypeMermaid, { strategy: 'pre-mermaid' }],
      [rehypeKatex, { throwOnError: false, strict: false }],
      rehypeRewriteAssets,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
