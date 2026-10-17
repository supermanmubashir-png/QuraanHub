/* Quran Advance service worker — cache-first app shell, network-first Quran data. */
'use strict';
const SHELL_CACHE = 'quran-advance-shell-v1';
const DATA_CACHE = 'quran-advance-data-v1';
const FONT_CACHE = 'quran-advance-fonts-v1';
const AUDIO_CACHE = 'quran-advance-audio-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './sw.js'];
const API_HOSTS = new Set(['api.alquran.cloud', 'alquran.api.islamic.network']);
const AUDIO_HOST = 'cdn.islamic.network';
const GOOGLE_FONT_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.all(SHELL_FILES.map(async path => {
      try { await cache.add(new Request(path, {cache:'reload'})); }
      catch (error) { console.warn('Could not pre-cache shell file:', path, error); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, DATA_CACHE, FONT_CACHE, AUDIO_CACHE]);
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('quran-advance-') && !keep.has(name)).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > limit) {
    await Promise.all(keys.slice(0, keys.length - limit).map(key => cache.delete(key)));
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Do not intercept AyahAI navigation or other external links.
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate' || SHELL_FILES.some(path => url.pathname.endsWith(path.replace('./','/')))) {
      event.respondWith((async () => {
        const cache = await caches.open(SHELL_CACHE);
        const cached = await cache.match(request) || await cache.match('./index.html');
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response && response.ok) await cache.put(request, response.clone());
          return response;
        } catch {
          const shell = await cache.match('./index.html');
          if (shell) return shell;
          return new Response('Quran Advance is not cached yet. Connect to the internet once to load the app.', {status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
        }
      })());
    }
    return;
  }

  if (API_HOSTS.has(url.hostname) && url.pathname.startsWith('/v1/')) {
    event.respondWith((async () => {
      const cache = await caches.open(DATA_CACHE);
      try {
        const response = await fetch(request);
        if (response && response.ok && response.type !== 'opaque') await cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({code:503,status:'OFFLINE',message:'Quran data is not cached. Connect once to download it.'}), {status:503,headers:{'Content-Type':'application/json;charset=utf-8'}});
      }
    })());
    return;
  }

  if (url.hostname === AUDIO_HOST && url.pathname.includes('/quran/audio/')) {
    event.respondWith((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const cached = await cache.match(request, {ignoreVary:true});
      if (cached) return cached;
      try {
        const response = await fetch(request);
        // Keep only complete responses (plus opaque CDN responses); do not cache partial 206 ranges.
        if (response && (response.status === 200 || response.type === 'opaque')) {
          try { await cache.put(new Request(url.href), response.clone()); await trimCache(AUDIO_CACHE, 30); } catch (error) { console.warn('Audio cache skipped', error); }
        }
        return response;
      } catch {
        const fallback = await cache.match(new Request(url.href), {ignoreVary:true});
        if (fallback) return fallback;
        return new Response('Audio is not available offline yet.', {status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
      }
    })());
    return;
  }

  if (GOOGLE_FONT_HOSTS.has(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(FONT_CACHE);
      const cached = await cache.match(request);
      const network = fetch(request).then(response => {
        if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()).catch(()=>{});
        return response;
      });
      if (cached) { event.waitUntil(network.catch(()=>{})); return cached; }
      try { return await network; }
      catch { return new Response('', {status:504}); }
    })());
  }
});
