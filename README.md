# VS Movie Hub — Phase 2

A static, mobile-first Indian and international box-office tracker. This release adds a real 20-title data snapshot, real external poster artwork, dedicated SEO-friendly movie pages, status-based sections, source links and explicit reporting notes.

## What is included

- 20 titles split into 7 Now Running, 3 Advance Booking, 4 Coming Soon and 6 2026 Box Office Highlights.
- Real poster images embedded from linked external image sources (not AI-generated substitutes).
- A dedicated static page for each movie under `movies/<slug>/index.html`.
- Source-labelled India Net, India Gross, advance gross/net, ticket counts and show counts only where available.
- Release-date reliability labels for upcoming films.
- Search and status filters; poster fallback if an external image fails.
- JSON movie data at `data/movies.json` and the JavaScript browser data file at `assets/movies.js`.
- Sitemap and robots.txt for the intended GitHub Pages URL.

## Important data notes

- Snapshot date: 4 November 2026 (India time). The running-film figures are live estimates from the linked tracker; some are updated during the day and may change at final reporting.
- Advance-booking values are ticketing data, not theatrical collections. Some sources count blocked seats; where provided, we display both the with-blocks and without-blocks basis.
- Upcoming dates from third-party release calendars are labelled reported and can change. Only a primary production-house listing is labelled official.
- Do not add a box-office collection to an unreleased movie.
- The listed yearly highlights use the source board's published totals through 3 November 2026.

## Real poster artwork and rights

Poster URLs are linked to the source or poster page in each movie record. Film posters, promotional images, titles and logos remain copyrighted/trademarked by their respective rights holders. A source credit is not the same as a licence. Obtain permission or an appropriate licence from the relevant rights holder before using poster assets in a commercial/monetised service. Replace any poster promptly if a rights holder requests it. Some external websites may block hotlinking or change their image URLs; the card falls back gracefully if an image fails.

## Local preview

Open `index.html` directly in a browser. The project uses plain HTML, CSS and JavaScript and does not require a build step or paid API. External poster images and Google Fonts need an internet connection.

## Publish with GitHub Pages

1. Upload the contents of this project to the root of `Vikas915577/Vs-movie-hub` on branch `main`.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. The intended site URL is `https://vikas915577.github.io/Vs-movie-hub/`.
5. Once Pages is live, open Google Search Console, add the site, verify ownership and submit `/sitemap.xml`.

GitHub Pages terms restrict commercial use/advertising as a business site. Keep this repo as source code and move the production site to commercial hosting that allows monetisation before adding AdSense or running ads.

## Updating a movie

Edit `data/movies.json` and `assets/movies.js` together. Keep these values in sync. For every new figure, record:

- a named source URL;
- an exact report/update timestamp;
- the collection or booking basis (India Net, India Gross, overseas, worldwide, advance gross/net);
- whether the value is live estimate, completed-day estimate or final reported figure;
- the matching detail page in `movies/<slug>/index.html`;
- the image source link for the poster.

Avoid copying article text or unlicensed image files from other sites. Prefer official poster sources or appropriately licensed images.

## Phase 3 suggestions

- Day-wise collection tables and charts for each running film.
- A year-wise ranking page with sortable columns.
- Movie comparison (same collection basis only).
- Admin-friendly update workflow / content JSON editor.
- City-wise booking trends where a source publishes them.
