# VS Movie Hub — Phase 6 + Phase 7 release bundle

## What is included

### Phase 6 — browser-only engagement
- Device-only Watchlist saved in `localStorage`.
- Recently Viewed movie reports, also saved locally (last 8 titles).
- Share action uses Android/browser share sheet, with copy-link fallback.
- Header pill `LIVE · THIS PAGE IS OPEN` confirms the current page is open in this browser. It is **not** a count of all visitors and it does not claim other people are online.
- Watchlist page with clear controls and an optional install button when the browser supports the install prompt.

No backend, Supabase, account, API key, analytics service, or database is used by Phase 6.

### Phase 7 — final hardening
- Fixes the old manifest icon path (the old file pointed at a missing `assets/favicon.svg`).
- Adds PNG app icons at 192 and 512 pixels.
- Adds a root-scoped service worker and a clean offline fallback page.
- Pre-caches the main static pages, all 20 movie detail pages and core local assets.
- Uses network-first navigation with a cached-page/offline fallback. External poster images and Google Fonts still require internet on first load.

## Upload to GitHub (Android-friendly)

Upload/copy these files into the repository ROOT (same folder as `index.html`):

- `phase6.js`
- `phase6.css`
- `watchlist.html`
- `offline.html`
- `sw.js`
- `app-icon-192.png`
- `app-icon-512.png`
- `site.webmanifest` (replace the existing file)
- `MANIFEST-HEAD-SNIPPET.txt` (add manifest link to homepage head)

### Enable Phase 6 on the movie pages

Open the existing root `movies.js`. Keep all 20 movie records unchanged. Paste the complete contents of `MOVIES-JS-PHASE6-APPEND.txt` once at the very end, after its existing closing `];`.

The homepage, rankings, compare, release calendar and movie-detail pages already load `movies.js`; this enables Phase 6 there without replacing any page or data.

For static info pages (`about.html`, `contact.html`, `methodology.html`, `privacy.html` and optionally `404.html`) that do not load `movies.js`, add the one script line from `STATIC-PAGES-PHASE6-SNIPPET.txt` immediately before `</body>`. Add the manifest link from `MANIFEST-HEAD-SNIPPET.txt` inside the homepage `<head>`; the watchlist page already has it.

`watchlist.html` already loads the required scripts. Do not add a second Phase 6 loader to it.

## Important: no backend / no false viewer count

The Phase 5 Supabase files can remain in the repository, but leave them unused. Do **not** add `live-presence.js` to any page and do not paste the Phase 5 loader snippet into `movies.js`. Keep `live-config.js` empty. The local `LIVE` pill only says that the current page is open in this browser. An accurate site-wide number of concurrent visitors cannot be measured from a static browser-only page without a backend or external counting service.

## Privacy

Saved movies and recent views are stored only in the current browser's local storage. They are not uploaded and do not sync between browsers/devices. Add this wording to `privacy.html` before publishing:

> Watchlist and recently viewed: VS Movie Hub stores saved movie slugs and recently viewed movie slugs in local browser storage on your device. This information is not sent to a VS Movie Hub server or synced between devices. You can remove saved items or clear the recent list from the Watchlist page, or clear this site's browser storage in your browser settings.

## Testing checklist

1. Open homepage, save a movie and verify the Watchlist count increments.
2. Reload homepage; the saved state should remain.
3. Open a movie detail page; it should appear in Recently Viewed.
4. Open Watchlist; remove one movie and clear the recent list.
5. Tap Share on Android; it should open the native share sheet or copy the movie URL.
6. Install/refresh on HTTPS, visit the main pages once, then enable airplane mode and open a cached page.
7. Confirm a never-visited/un-cached URL falls back to `offline.html`.
8. Check at 360px and 390px mobile widths: header should not overflow and card actions should wrap.

## Deployment status

This is a prepared ZIP patch; it has not been pushed to GitHub. The GitHub write connector previously returned HTTP 403. The final live check is only complete after uploading these files and opening the deployed site. Do not treat a successful local QA as proof of production deployment.
