const CACHE = 'explanation-lab-shell-v3';
const SHELL = [
  '/', '/index.html', '/offline.html', '/manifest.webmanifest', '/favicon.svg',
  '/assets/hero-640.webp', '/assets/hero-1024.webp', '/assets/social-card.webp',
  '/assets/icon-192.png', '/assets/icon-512.png', '/assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]).then(() => self.clients.matchAll().then((clients) => clients.forEach((client) => client.postMessage({type: 'UPDATE_READY'})))));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
      return response;
    }).catch(async () => (await caches.match('/index.html')) || caches.match('/offline.html')));
    return;
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/build/') || url.pathname.endsWith('.svg')) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    })));
    return;
  }
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request)));
});
