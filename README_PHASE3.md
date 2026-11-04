# VS Movie Hub — Phase 3 Patch

This is an upload patch for the existing `Vikas915577/Vs-movie-hub` repository. It restores a proper home page (the current root `index.html` was accidentally a single-film detail page), and adds rankings, comparisons, a release calendar and 20 static movie detail pages.

## Preserve existing files

Keep the existing `movies.js`, `styles.css`, `SOURCES.md`, `favicon.svg`, `about.html`, `contact.html`, `privacy.html`, and `methodology.html`. The new files in this patch use the existing `movies.js` data file. Do not delete it.

## What Phase 3 adds

- Root homepage with Now Running, Advance Booking, Coming Soon and 2026 Highlights sections; search and category filters.
- Sortable India Net leaderboard for tracked titles with numeric India Net data only.
- Compare up to three movies on India Net using a same-basis, source-labelled snapshot chart.
- Release calendar with upcoming/released filters and date sorting.
- Static detail pages for all 20 existing movie slugs.
- Per-film sources, snapshot notes and a clear notice that day-wise cumulative data is not available yet. No fabricated daily graph points.
- Updated sitemap.

## Upload from Android/GitHub

1. Download and extract this ZIP.
2. Open the repository: https://github.com/Vikas915577/Vs-movie-hub
3. Upload/replace the ZIP contents at the repository root. `index.html` must replace the old root file.
4. Keep the 20 folders under `movies/` exactly as shown.
5. Commit changes to `main`. GitHub Pages should deploy from `main / (root)`.
6. Check `https://vikas915577.github.io/Vs-movie-hub/` and the new pages.

## Important metric notes

- India Net is used for the leaderboard. India Gross, Worldwide Gross and advance booking are not mixed into it.
- Comparison is a snapshot comparison, not a matched-day comparison; films may be at different stages of their run.
- Daily collection charts are deliberately withheld until source-backed date-by-date totals are available.
- Poster images remain externally hosted and copyrighted by their rights holders. A source link is not a commercial licence.
