# Post-deployment SEO checklist

Run these checks after deploying the verified build. They require access to the relevant webmaster tools and are intentionally not automated here.

## Crawler discovery

- Submit `https://chan179.com/sitemap-index.xml` in Google Search Console.
- Submit the same sitemap in Bing Webmaster Tools if the site is registered there.
- Confirm `https://chan179.com/robots.txt` returns HTTP 200 and advertises the canonical sitemap.
- Confirm both `/sitemap-index.xml` and `/sitemap.xml` return valid XML.

## Indexing and structured data

- Inspect the homepage and each published article URL in Google Search Console.
- Request indexing only for pages that are ready and intentionally public.
- Run the homepage and one article through Google's Rich Results Test.
- Confirm the canonical URL is selected and no unexpected `noindex` directive is reported.
- Confirm Article/BlogPosting and BreadcrumbList data are detected without critical errors.

## Search appearance

- Check the title and description preview for the homepage and the three highest-priority articles.
- Check that social previews use the 1200×630 `og-image.png` asset.
- Review Search Console queries and pages after 2–4 weeks; do not infer ranking changes from a single manual search.

