// JW Meetings App - ULTIMATE FIXED SW - 2026-10-02
// Change this version every time you update index.html
const CACHE_NAME = 'jw-meeting-v3-20261002';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

// Install - cache files
self.addEventListener('install', event => {
  self.skipWaiting(); // force new SW to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate - delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // take control of all pages immediately
  );
});

// Fetch - NETWORK FIRST (always get latest, fallback to cache if offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache the fresh response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If network fails (offline), use cache
        return caches.match(event.request);
      })
  );
});
