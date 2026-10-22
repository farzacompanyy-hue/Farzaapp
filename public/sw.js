const CACHE_NAME = 'wasla-cache-v3';
const CORE_PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json?v=3',
  '/apple-touch-icon.png?v=3',
  '/icon-192.png?v=3',
  '/icon-512.png?v=3',
];

// Install: precache the core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_PRECACHE_ASSETS);
    })
  );
  // Activate immediately without waiting for previous tabs to close
  self.skipWaiting();
});

// Activate: purge any legacy cache revisions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-First for Navigation, Stale-While-Revalidate for Assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle standard HTTP/HTTPS GET requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  // 1. Navigation requests (HTML documents) -> Network First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, cachedResponse will be returned
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for skip waiting messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
