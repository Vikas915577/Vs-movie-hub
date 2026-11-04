# VS Movie Hub — Phase 1

A mobile-first static website foundation for a box-office and movie-release tracker.

## Phase 1 scope

- VS Movie Hub branding and responsive homepage.
- Three movie lifecycle sections: **Now Running**, **Advance Booking**, and **Coming Soon**.
- Search and status filters.
- Individual movie detail modal layout.
- Dedicated About, Data Methodology, Contact and Privacy placeholder pages.
- Basic SEO metadata, Open Graph tags, WebSite structured data, favicon and web manifest.
- No frameworks, build step, paid API or backend required.

## Important: preview data only

The three movie cards in `assets/movies.js` are clearly marked demonstration records. They are **not real movie listings and contain no real box-office or booking figures**. Replace them with verified movie records in Phase 2. Every live collection figure should have a source, report date, collection basis (India Net / India Gross / Overseas / Worldwide), and a status such as reported or estimated.

## Preview locally

Open `index.html` in a browser. The site uses plain HTML, CSS and JavaScript. Google Fonts are optional; if unavailable, system fallback fonts are used.

## Publish with GitHub Pages

1. Create a new public repository named `vs-movie-hub` in the GitHub account you want to use.
2. Upload the **contents** of this folder to the repository root (not the containing folder itself).
3. In the repository, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Your project site URL will normally be `https://YOUR-USERNAME.github.io/vs-movie-hub/`.
6. Add the final URL to Google Search Console and submit a sitemap once the production domain and complete pages are ready.

Note: GitHub Pages is suitable for a static project/demo, not a monetized commercial website. Before displaying ads or using the site as a commercial business, move production hosting to a provider whose terms allow that use. Keep this repository as the source-code home if useful.

## Phase 2 data model

Each movie record should include:

- `id`, `slug`, `title`, `originalTitle` (optional)
- `status`: `coming-soon`, `advance-booking`, `now-running`, or `completed`
- `releaseDate`, `languages`, `genres`, `certification`, `runtime`
- `indiaNet`, `indiaGross`, `overseasGross`, `worldwideGross` (when available)
- `dayWiseCollections[]` with date, value, basis and report status
- `advanceBooking` with tickets, gross, shows, city/market and reporting timestamp (when sourced)
- `sources[]` with source name, URL, accessed/reported date and notes
- `lastUpdated`

## Before public launch

- Replace all demo records with source-verified titles and figures.
- Add a real contact address and complete privacy policy.
- Add a production sitemap with the final URL.
- Test mobile layout, keyboard navigation, broken links and page metadata.
- Do not copy competitor articles or copyrighted posters. Use licensed, permitted or original assets.
