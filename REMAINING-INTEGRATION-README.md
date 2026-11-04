# VS Movie Hub — Phase 6/7 integration repair

This patch closes the integration gap found after the latest upload.

## What was found

The Phase 6 assets had been uploaded, but the repository versions of `movies.js`, `index.html`, the movie detail pages, `about.html` and `privacy.html` had not been updated to load Phase 6. The previous integration snippets were uploaded as reference files only. `phase6.css` was not linked by `phase6.js` or the Watchlist page, so the Phase 6 controls could appear unstyled. Privacy copy was also still pending.

## Upload these files to the repository root

- `phase6-loader.js` (new file)
- `MOVIES-JS-PHASE6-APPEND.txt` (instruction/snippet only)
- `STATIC-PAGES-PHASE6-SNIPPET.txt` (instruction/snippet only)
- `WATCHLIST-PAGE-FIX.txt` (instruction only)
- `PRIVACY-APPEND.txt` (instruction/snippet only)

The existing `phase6.js`, `phase6.css`, `watchlist.html`, `offline.html`, `sw.js`, icons and `site.webmanifest` are already present in the repository from the previous upload. Do not overwrite those files with these .txt instructions.

## Apply four small edits

1. Append the contents of `MOVIES-JS-PHASE6-APPEND.txt` exactly once at the very end of the existing root `movies.js`, after its existing `];`. Do not remove any movie records.
2. Add `<script defer src="phase6-loader.js"></script>` just before `</body>` in `about.html`, `contact.html`, `methodology.html`, `privacy.html` and `404.html`.
3. In `watchlist.html`, replace its direct `phase6.js` script tag with `phase6-loader.js` as shown in `WATCHLIST-PAGE-FIX.txt`.
4. Add the paragraph in `PRIVACY-APPEND.txt` to the existing privacy panel.

No extra Phase 6 changes are required to `index.html`, `rankings.html`, `compare.html`, `release-calendar.html` or the 20 movie detail pages: those already load `movies.js`, and the append snippet will activate the shared loader on them.

## Important backend instruction

Do not integrate `live-presence.js` or the Phase 5 Supabase loader. Keep `live-config.js` empty. The UI must only say `LIVE · THIS PAGE IS OPEN` (or `OFFLINE · NO NETWORK`). It must not display a made-up site-wide viewer count. No backend is used.

## Smoke test after edits

- Homepage: header shows `LIVE · THIS PAGE IS OPEN`; each movie card has Save and Share actions.
- Save a film, reload, and confirm it is still saved. Watchlist count should remain.
- Open that film's detail page; it should appear in Recently Viewed.
- Watchlist: Remove, Clear Saved, Clear Recent and Share actions work.
- Android share sheet opens, or the URL copies as fallback.
- About, Contact, Methodology, Privacy and 404 load without JavaScript console errors.
- Open each important page online once; then try airplane mode. Cached pages should load, while never-cached pages should show offline fallback.

The previously uploaded `PHASE6-PHASE7-QA-REPORT.json` is a static QA report. It does not prove that these integrations were applied to production. Final production validation remains after this repair is uploaded.
