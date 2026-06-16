class ContentLoader {
    constructor(navigationData) {
        this.navigationData = navigationData;
        this.onContentLoaded = null;
        this.cache = new Map();
    }

    isPageFolder(category, pagePath) {
        const categoryData = this.navigationData.find(cat => cat.slug === category);
        if (!categoryData || !categoryData.pages) return false;

        // Split the path to handle nested folders (e.g., "precalculus" or "algebra/files")
        const parts = pagePath.split('/');
        let currentPages = categoryData.pages;

        for (let i = 0; i < parts.length; i++) {
            const slug = parts[i];
            const page = currentPages.find(p => p.slug === slug);
            
            if (!page) return false;
            
            // If this is the last part, check if it's a folder
            if (i === parts.length - 1) {
                return page.isFolder === true;
            }
            
            // If not the last part, move to nested pages
            if (page.pages) {
                currentPages = page.pages;
            } else {
                return false;
            }
        }

        return false;
    }

    // Rewrite relative <a href> and <img src> values in rendered HTML to clean root-relative paths.
    // e.g. href="summary#algebra" on page /math/ becomes href="/math/summary#algebra"
    rewriteLinks(html, category, page) {
        const basePath = page
            ? `/${category}/${page.substring(0, page.lastIndexOf('/') + 1)}`
            : `/${category}/`;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || /^https?:\/\//.test(href) || href.startsWith('mailto:')) return;
            const resolved = new URL(href, 'https://x' + basePath);
            const pathname = resolved.pathname.replace(/\.md$/, '');
            link.setAttribute('href', pathname + resolved.hash);
        });
        doc.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (!src || /^https?:\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) return;
            const resolved = new URL(src, 'https://x' + basePath);
            img.setAttribute('src', resolved.pathname);
        });
        return doc.body.innerHTML;
    }

    processFootnotes(markdown) {
        const lines = markdown.split('\n');
        const footnotes = new Map();
        let currentNum = null;
        let currentText = [];
        const defLineIndices = new Set();

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const defMatch = line.match(/^\[\^(\d+)\]:\s+(.*)/);

            if (defMatch) {
                if (currentNum !== null) {
                    footnotes.set(currentNum, currentText.join(' ').trim());
                }
                currentNum = defMatch[1];
                currentText = [defMatch[2]];
                defLineIndices.add(i);
            } else if (currentNum !== null && /^\s{2,}/.test(line) && line.trim() !== '') {
                currentText.push(line.trim());
                defLineIndices.add(i);
            } else {
                if (currentNum !== null) {
                    footnotes.set(currentNum, currentText.join(' ').trim());
                    currentNum = null;
                    currentText = [];
                }
            }
        }
        if (currentNum !== null) {
            footnotes.set(currentNum, currentText.join(' ').trim());
        }

        const filtered = lines.filter((_, i) => !defLineIndices.has(i));
        let processed = filtered.join('\n');

        processed = processed.replace(/\[\^(\d+)\]/g, (match, num) => {
            if (footnotes.has(num)) {
                return `<sup class="footnote-ref" id="fnref-${num}"><a href="#fn-${num}">[${num}]</a></sup>`;
            }
            return match;
        });

        return { markdown: processed, footnotes };
    }

    async loadContent(category, page, anchor) {
        try {
            const standaloneItem = this.navigationData.find(
                item => item.standalone && item.slug === category
            );

            let filePath;
            if (standaloneItem) {
                filePath = `/${category}.md`;
            } else if (!page) {
                filePath = `/${category}/README.md`;
            } else {
                const isFolder = this.isPageFolder(category, page);
                filePath = isFolder
                    ? `/${category}/${page}/README.md`
                    : `/${category}/${page}.md`;
            }

            let html;
            if (this.cache.has(filePath)) {
                html = this.cache.get(filePath);
            } else {
                const response = await fetch(filePath);
                let markdown;
                if (!response.ok) {
                    markdown = null;
                } else {
                    markdown = await response.text();
                    markdown = markdown.replace(/^---[\s\S]*?---\s*\n*/, '');
                    // SPA fallback: Cloudflare serves index.html for missing files
                    if (/^\s*<!DOCTYPE html/i.test(markdown) || /^\s*<html/i.test(markdown)) {
                        markdown = null;
                    }
                }

                if (markdown === null) {
                    if (page && !standaloneItem) {
                        // Folder or page not found — redirect to first child page if folder
                        const parts = page.split('/');
                        let currentPages = this.navigationData.find(cat => cat.slug === category)?.pages;
                        let folder = null;
                        for (const part of parts) {
                            folder = currentPages?.find(p => p.slug === part);
                            currentPages = folder?.pages;
                        }
                        if (folder?.pages?.length) {
                            const firstSlug = folder.pages[0].slug;
                            const newPath = `/${category}/${page}/${firstSlug}`;
                            history.replaceState(null, '', newPath);
                            return this.loadContent(category, `${page}/${firstSlug}`, anchor);
                        }
                        markdown = `# Page Not Found\n\nThe file \`${filePath}\` could not be loaded.`;
                    } else if (!page && !standaloneItem) {
                        const categoryData = this.navigationData.find(cat => cat.slug === category);
                        const categoryName = categoryData ? categoryData.name : category;
                        markdown = `# ${categoryName}\n\nREADME file not found for this category.`;
                    } else {
                        markdown = `# Page Not Found\n\nThe file \`${filePath}\` could not be loaded.`;
                    }
                }

                const contentOk = response.ok && markdown !== null;

                let footnotes = null;
                if (contentOk) {
                    const result = this.processFootnotes(markdown);
                    markdown = result.markdown;
                    footnotes = result.footnotes;
                }

                // Parse markdown and rewrite links
                html = this.rewriteLinks(marked.parse(markdown), category, page);

                // Magic Step: If a <p> exclusively contains display math, lift it out of the paragraph.
                // The library renders inline $$ as <span class="katex-display"> which already has display:block.
                html = html.replace(
                    /<p>\s*(<span class="katex-display">[\s\S]+?<\/span>)\s*<\/p>/g,
                    (_, spanHtml) => spanHtml
                );

                // Render footnotes at the bottom
                if (footnotes && footnotes.size > 0) {
                    const sortedNums = [...footnotes.keys()].sort((a, b) => parseInt(a) - parseInt(b));
                    let fhtml = '<hr class="footnotes-sep">\n<section class="footnotes">\n<ol class="footnotes-list">\n';
                    for (const num of sortedNums) {
                        let defHtml = marked.parse(footnotes.get(num));
                        defHtml = defHtml.replace(/^<p>/, '').replace(/<\/p>\n?$/, '');
                        fhtml += `<li id="fn-${num}" value="${num}">${defHtml} <a href="#fnref-${num}" class="footnote-backref" aria-label="Back to reference">↩</a></li>\n`;
                    }
                    fhtml += '</ol>\n</section>';
                    html += fhtml;
                }

                if (contentOk) {
                    this.cache.set(filePath, html);
                }
            }

            if (this.onContentLoaded) {
                this.onContentLoaded(html, anchor);
            }

            return html;

        } catch (error) {
            console.error('Error loading content:', error);
            const errorHtml = marked.parse(`# Error\n\nFailed to load content: ${error.message}`);

            if (this.onContentLoaded) {
                this.onContentLoaded(errorHtml, anchor);
            }

            return errorHtml;
        }
    }
}