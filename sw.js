const CACHE_NAME = 'dreamhomes-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/listings.html',
    '/property.html',
    '/about.html',
    '/contact.html',
    '/style.css',
    '/js/main.js',
    '/js/config.js',
    '/js/api.js',
    '/js/ui.js',
    '/js/properties.js',
    '/js/contact.js',
    '/js/map.js',
    '/js/pages/listings.js',
    '/js/pages/property-details.js',
    '/images/favicon.png'
];

// Install: Cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch: Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    // Skip browser extensions and non-http/https
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('https://unpkg.com')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Update cache with new response
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            }).catch(err => {
                console.log('Fetch failed; returning cached response if available');
            });

            return cachedResponse || fetchPromise;
        })
    );
});
