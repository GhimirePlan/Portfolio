const CACHE_NAME = 'portfolio-cache-v2';

// Assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/sounds/jump.mp3',
  '/sounds/collision.mp3',
  '/sounds/point.mp3',
  '/favicon.jpg',
  // Fonts
  '/fonts/**/*',
  // Images and Icons
  '/images/**/*',
  // Critical CSS and JS
  '/_next/static/css/**/*',
  '/_next/static/chunks/**/*',
  // API routes that provide critical data
  '/api/**/*'
];

// Dynamic cache name for runtime caching
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// Cache duration in milliseconds (7 days)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name))
        );
      }),
      // Clean up expired items from dynamic cache
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.keys().then((keys) => {
          return Promise.all(
            keys.map((request) => {
              return cache.match(request).then((response) => {
                if (response) {
                  const date = new Date(response.headers.get('date'));
                  if (date.getTime() + CACHE_DURATION < Date.now()) {
                    return cache.delete(request);
                  }
                }
                return Promise.resolve();
              });
            })
          );
        });
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Network-first strategy for API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  if (
    event.request.destination === 'style' ||
    event.request.destination === 'script' ||
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    event.request.destination === 'audio'
  ) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            const clonedResponse = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
            return fetchResponse;
          });
        })
    );
    return;
  }

  // Network-first strategy with offline fallback for navigation requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const clonedResponse = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // If it's a navigation request, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
            return new Response('', {
              status: 408,
              statusText: 'Request timed out'
            });
          });
      })
  );
}); 