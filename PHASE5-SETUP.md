# VS Movie Hub — Phase 5: Live audience counter

## What this update adds

- A compact `LIVE · N viewing now` badge in the existing dark/gold header.
- The count is based on Supabase Realtime Presence, not a random number or a page-load counter.
- It is designed to run on the homepage, rankings, compare, release calendar and movie detail pages that already load `movies.js`.
- The About page can be enabled with one extra script tag.
- No database table or SQL migration is required: Presence keeps temporary connection state while the browser session is connected.
- When credentials are missing or the connection fails, the badge shows `setup needed` or `unavailable`, never a made-up count.

## 1. Create or select a dedicated Supabase project

Use a project reserved for VS Movie Hub. Do not reuse a backend for another app without confirming that it is intended for this site. The currently connected project named `Winter arc` is a separate app and should not be used here.

On the Supabase dashboard, open the project and copy:
- Project URL
- Publishable key (the browser-safe `sb_publishable_...` key)

Do not use a `service_role`, secret, or `sb_secret_...` key in the website. `live-config.js` is public because it is downloaded by every visitor.

## 2. Configure the project values

Open `live-config.js` and replace the empty strings:

```js
window.VS_LIVE_CONFIG = Object.freeze({
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  publishableKey: "sb_publishable_REPLACE_WITH_YOUR_KEY"
});
```

Save the file. No other project secret is needed by this feature.

## 3. Upload the three new files

Upload these files to the repository root (`Vs-movie-hub`, same folder as `index.html`):

- `live-config.js`
- `live-presence.js`
- `live-presence.css`

Do not put them inside a nested folder; the current site uses root-relative HTML pages.

## 4. Connect the common movie pages

Open the existing root-level `movies.js`. Do not delete or replace any of its 20 movie records. Paste the full contents of `MOVIES-JS-APPEND-SNIPPET.txt` once at the very end, after the existing `];`.

This loads the counter on pages that already use `movies.js` (homepage, rankings, compare, release calendar and movie detail pages).

## 5. Connect the About page

Open `about.html` and add the single line shown in `ABOUT-PAGE-APPEND-SNIPPET.txt` immediately before `</body>`.

For any other static information page that does not load `movies.js`, the same one-line module script can be added before `</body>`.

## 6. Verify

1. Open the live homepage in two separate browser tabs/devices.
2. Wait for the Realtime connection to subscribe.
3. Both tabs should show the same active session count (each tab counts as one browser session).
4. Close one tab; after the connection closes, the other tab should show the count decrease.
5. Test with mobile data and Wi-Fi. When the network is unavailable, the badge must show unavailable/offline, not a stale fabricated number.

## Important counting note

This is an active browser-session count, not a verified count of distinct human beings. Two tabs or two devices used by one person may count as two sessions. A public client can also be imitated by a determined visitor, so do not use this number for billing, identity, security, or audited analytics.

## Privacy note

Add the suggested disclosure from `PRIVACY-DISCLOSURE.txt` to `privacy.html` before public launch. The counter uses temporary Presence state and does not need a permanent visitor table.

## Technical references

- Supabase Presence guide: https://supabase.com/docs/guides/realtime/presence
- Supabase JavaScript client is pinned to 2.118.0 in the dynamic CDN import. Check the package changelog before upgrading.

## Deployment status

This is a prepared integration bundle. The GitHub connection currently rejects write operations with HTTP 403, so these changes have not been pushed to `main` and are not live yet. The counter also remains inactive until a VS Movie Hub Supabase Project URL and Publishable key are entered in `live-config.js`.
