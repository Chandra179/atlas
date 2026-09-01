import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';
import astroExpressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { rewriteLinks } from './src/lib/remark-rewrite-links.js';
import { remarkMermaidPreserve } from './src/lib/remark-mermaid-preserve.js';
import { remarkCallouts } from './src/lib/remark-callouts.js';
import { rehypeRewriteAssets } from './src/lib/rehype-rewrite-assets.js';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
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
        wrap: false,
      },
    }),
    alpinejs(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      [rewriteLinks, {}],
      remarkMermaidPreserve,
      remarkDirective,
      remarkCallouts,
    ],
    rehypePlugins: [
      rehypeRaw,
      [rehypeKatex, { throwOnError: false, strict: false }],
      rehypeRewriteAssets,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/dist/**', '**/.astro/**', '**/public/assets/**'],
      },
    },
  },
});
