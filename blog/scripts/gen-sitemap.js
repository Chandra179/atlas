#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SRC } = require('./lib/paths');
const { loadNavData } = require('./lib/nav-loader');

const DOMAIN = 'https://chan179.com';
const OUTPUT = path.join(SRC, 'sitemap.xml');

function url(loc, changefreq = 'monthly', priority = '0.7') {
    return `  <url>
    <loc>${DOMAIN}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function build() {
    const nav = loadNavData();
    const lines = [];
    let urlCount = 0;

    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    for (const item of nav) {
        if (item.standalone) {
            const isHome = item.slug === 'README';
            lines.push(url(`/${item.slug === 'README' ? '' : item.slug}`, isHome ? 'weekly' : 'monthly', isHome ? '1.0' : '0.8'));
            urlCount++;
        } else {
            lines.push(url(`/${item.slug}`, 'weekly', '0.8'));
            urlCount++;

            if (!item.pages) continue;

            for (const page of item.pages) {
                if (page.isFolder && page.pages) {
                    lines.push(url(`/${item.slug}/${page.slug}`, 'weekly', '0.7'));
                    urlCount++;

                    for (const subpage of page.pages) {
                        lines.push(url(`/${item.slug}/${page.slug}/${subpage.slug}`, 'monthly', '0.6'));
                        urlCount++;
                    }
                } else {
                    lines.push(url(`/${item.slug}/${page.slug}`, 'monthly', '0.7'));
                    urlCount++;
                }
            }
        }
    }

    lines.push('</urlset>');
    lines.push('');

    fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
    console.log(`sitemap.xml written (${urlCount} URLs)`);
}

build();
