# VS Movie Hub — Phase 3 + Bug Fix (Flat Upload)

This patch fixes the repository state and preserves the Phase 3 feature set. All new movie-detail pages are flat root-level files so Android uploads do not need nested folders.

## Bugs found and fixed

- The root `index.html` had accidentally been replaced by the Ramayana detail page. This patch restores the real homepage.
- The previous sitemap/cards linked to `movies/<slug>/` pages, but the actual repository tree had no `movies/` directory. All 20 destinations returned missing-file routes.
- Nested asset paths made detail pages fragile when files were flattened during Android upload. This patch uses root-level movie pages and root-relative assets instead.
- Movie detail rendering now handles missing movie records and broken poster images safely.
- The sitemap now matches the real flat file URLs.

## Phase 3 retained

- Root home with 4 movie shelves, quick stats, search and filters.
- Sortable tracked India Net ranking.
- Compare up to 3 films on a consistent India Net basis.
- Release calendar with upcoming/released filters and date sorting.
- 20 individual movie detail pages with real poster URLs, source notes and SEO metadata.
- Daily collection charts remain hidden unless source-backed day-wise history exists.

## Upload (Android-friendly, no folders)

1. Extract this ZIP.
2. In `Vikas915577/Vs-movie-hub`, choose **Add file → Upload files**.
3. Select every file from the extracted folder and upload them to the repository **root**. All `movie-*.html` files must be at the same level as `index.html`.
4. Replace existing `index.html`, `phase3.js`, `movie-detail.js`, and `sitemap.xml` when asked.
5. Keep existing `movies.js`, `phase3.css`, `rankings.html`, `compare.html`, `release-calendar.html`, `favicon.svg`, `about.html`, `contact.html`, `methodology.html` and `privacy.html`.
6. Commit to `main`.

Do not upload the ZIP itself. Do not upload a folder named `vs-movie-hub-phase3-flat-fix` inside the repository. Upload the files inside that folder directly to root.

## Check after commit

- Homepage: `https://vikas915577.github.io/Vs-movie-hub/`
- Rankings: `/rankings.html`
- Compare: `/compare.html`
- Calendar: `/release-calendar.html`
- Example movie page: `/movie-jailer-2.html`

Figures are the existing static 4 November 2026 snapshot. They may be revised by sources. Poster URLs are externally hosted and poster usage rights remain with respective owners; source credit is not a commercial licence.
