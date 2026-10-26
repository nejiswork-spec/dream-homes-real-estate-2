// Retire the service worker from the original site so returning visitors receive the React build.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.registration.unregister();
    await self.clients.claim();
  })());
});
