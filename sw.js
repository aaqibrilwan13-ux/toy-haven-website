/* =========================================================
   TOY HAVEN — sw.js (Service Worker)
   A minimal cache-first service worker so the core pages
   and assets are available offline once visited.
   Registered from js/main.js — see the registerServiceWorker()
   function near the top of that file.
   ========================================================= */

const CACHE_NAME = 'toy-haven-cache-v3';

const CORE_ASSETS = [
  './',
  './index.html',
  './products.html',
  './cart.html',
  './checkout.html',
  './wishlist.html',
  './feedback.html',
  './css/style.css',
  './css/redesign.css',
  './css/layout.css',
  './js/main.js',
  './js/products.js',
  './js/cart.js',
  './js/checkout.js',
  './js/wishlist.js',
  './js/feedback.js',
  './manifest.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

/* Cache-first strategy: serve from cache, fall back to network,
   and cache new same-origin GET requests as they succeed. */
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request)
        .then(function (response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(function () {
          // Offline and not cached — fail gracefully.
          return cached;
        });
    })
  );
});
