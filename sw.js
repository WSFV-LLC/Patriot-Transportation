const CACHE_NAME = 'patriot-v2';
const ASSETS = [
  '/Patriot-Transportation/',
  '/Patriot-Transportation/index.html',
  '/Patriot-Transportation/driver_dashboard.html',
  '/Patriot-Transportation/receipt.html',
  '/Patriot-Transportation/icon.png',
  '/Patriot-Transportation/icon-192.png',
  '/Patriot-Transportation/driver.png',
  '/Patriot-Transportation/van.jpg',
  '/Patriot-Transportation/telluride.jpg',
  '/Patriot-Transportation/skyline.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network first for Firebase and Google APIs, cache first for static assets
  const url = new URL(event.request.url);
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis') || url.hostname.includes('make.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
