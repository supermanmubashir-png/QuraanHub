const V = 'quran-advance-v1', SHELL = 'qa-shell-' + V, DATA = 'qa-data-' + V, AUDIO = 'qa-audio-' + V;
const FILES = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => ![SHELL, DATA, AUDIO].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const put = (name, req, res) => { if (res && (res.ok || res.type === 'opaque')) caches.open(name).then(c => c.put(req, res.clone())); return res; };

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // Never touch AyahAI links or other unknown origins
  if (url.hostname.endsWith('github.io') && url.pathname.startsWith('/AyahAI')) return;

  // Audio: cache-first, store full file (ignores Range requests)
  if (url.hostname === 'cdn.islamic.network') {
    e.respondWith(caches.open(AUDIO).then(async c => {
      const hit = await c.match(url.href);
      if (hit) return hit;
      try {
        const res = await fetch(url.href);
        if (res.ok) c.put(url.href, res.clone());
        return res;
      } catch (err) { return fetch(req); }
    }));
    return;
  }

  // Quran data: network first, cache fallback
  if (url.hostname === 'api.alquran.cloud') {
    e.respondWith(fetch(req).then(r => put(DATA, req, r)).catch(() => caches.match(req)));
    return;
  }

  // Fonts: cache first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(h => h || fetch(req).then(r => put(DATA, req, r))));
    return;
  }

  // App shell: cache first
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(h => h || fetch(req).then(r => put(SHELL, req, r)))
        .catch(() => caches.match('./index.html'))
    );
  }
});
