/* VS Movie Hub · Phase 7 final hardening: static PWA offline cache. */
const CACHE_NAME = "vs-movie-hub-static-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./watchlist.html",
  "./offline.html",
  "./about.html",
  "./contact.html",
  "./methodology.html",
  "./privacy.html",
  "./rankings.html",
  "./compare.html",
  "./release-calendar.html",
  "./404.html",
  "./phase3.css",
  "./movies.js",
  "./phase3.js",
  "./movie-detail.js",
  "./phase4-seo.js",
  "./phase6.js",
  "./phase6.css",
  "./site.webmanifest",
  "./favicon.svg",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./movie-jailer-2.html",
  "./movie-aadarsha-kutumbam-house-no-47.html",
  "./movie-udta-teer.html",
  "./movie-drishyam-3-the-conclusion.html",
  "./movie-cult.html",
  "./movie-premada-oorali.html",
  "./movie-prahaar-the-ujjwal-nikam-story.html",
  "./movie-ramayana-rise-of-a-legend.html",
  "./movie-scene.html",
  "./movie-mookuthi-amman-2.html",
  "./movie-appa-kutty.html",
  "./movie-lakadbaggha-2-the-monkey-business.html",
  "./movie-moon-walk.html",
  "./movie-king.html",
  "./movie-dhurandhar-2-the-revenge.html",
  "./movie-spider-man-brand-new-day.html",
  "./movie-hanuman-ansh.html",
  "./movie-border-2.html",
  "./movie-toxic.html",
  "./movie-peddi.html"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("vs-movie-hub-") && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        const cached = await caches.match(request);
        if (cached) return cached;
        return (await caches.match("./offline.html")) || (await caches.match("./index.html"));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && url.origin === self.location.origin) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
