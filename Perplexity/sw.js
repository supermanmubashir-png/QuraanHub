const CACHE = "quran-advance-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept AyahAI or other cross-origin navigations.
  if (url.origin !== self.location.origin && url.hostname !== "api.alquran.cloud") return;

  // App shell: cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached ||
        fetch(request).then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        }).catch(() => caches.match("./index.html"))
      )
    );
    return;
  }

  // Quran API/data: network-first, cache fallback.
  event.respondWith(
    fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() =>
      caches.match(request).then(cached =>
        cached || new Response(JSON.stringify({ code: 0, status: "Offline", data: [] }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        })
      )
    )
  );
});
