# VS Movie Hub — Phase 4 SEO and Google Search setup

## What changed

- Homepage now contains server-rendered links and movie summaries in the HTML. Search engines do not have to wait for JavaScript to discover the 20 movie reports.
- All 20 flat movie detail pages now contain their title, release date, language, source-linked figures, collection basis, poster credit and explanatory text in the initial HTML.
- Added canonical URLs, title/description metadata, Open Graph and Twitter preview tags, WebSite/Organization and Movie/BreadcrumbList JSON-LD.
- Rankings and release calendar contain static initial content; JavaScript still adds filtering and sorting.
- Added branded 1200×630 social share image, image fallback enhancement, descriptive 404 page, corrected sitemap and robots.txt.

## Publish

Upload/replace the files in this package at the repository root. Keep the existing `movies.js`, `phase3.js`, `phase3.css`, `movie-detail.js`, `favicon.svg` and informational pages. Replace `index.html`, `rankings.html`, `compare.html`, `release-calendar.html`, `sitemap.xml` and `robots.txt`; upload all `movie-*.html` pages, `og-image.png`, `404.html` and `phase4-seo.js`.

The current package includes all 20 `movie-<slug>.html` files as flat root files, matching the existing Phase 3 navigation pattern.

## Google Search Console — owner action required

1. Open https://search.google.com/search-console and choose **Add property**.
2. Add a **URL prefix** property: `https://vikas915577.github.io/Vs-movie-hub/`.
3. Choose HTML file verification. Download the exact Google-provided verification HTML file.
4. Upload that file unchanged to the repository root and open its URL to confirm it returns successfully. Then click **Verify** in Search Console. Do not rename the file or edit its contents.
5. In Search Console → Sitemaps, submit `sitemap.xml`.
6. Use URL Inspection on the homepage and a few movie URLs; use **Test live URL** and request indexing when appropriate.
7. Check Page indexing and Search results reports over time. Recheck after major data updates.

I have not inserted a fabricated Google verification token. Verification must be completed by the site owner from their own Search Console account.

## Important expectations

- Sitemap submission is a discovery hint, not a guarantee of crawling, indexing or ranking.
- Google asks for helpful, reliable, people-first content. Metadata and structured data do not compensate for thin or copied movie reports.
- Structured data must match visible page content. JSON-LD does not guarantee a rich result.
- Current source snapshots in the site data are dated 4 November 2026; refresh figures and release dates with named sources before treating them as current.
- Poster images remain hosted by third parties. A source link is not a commercial image licence.
- GitHub Pages is a static host; Search Console can verify it with the HTML file method. If you later monetize with ads, review GitHub Pages' commercial-use restrictions and move production hosting to a host that supports your business use.

## Google documentation

- Search Essentials: https://developers.google.com/search/docs/essentials
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Search Console setup: https://developers.google.com/search/docs/monitor-debug/search-console-start
