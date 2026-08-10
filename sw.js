const CACHE_NAME = 'patriot-v4';
const STATIC_ASSETS = [
  '/Patriot-Transportation/icon.png',
  '/Patriot-Transportation/icon-192.png',
  '/Patriot-Transportation/driver.png',
  '/Patriot-Transportation/van.jpg',
  '/Patriot-Transportation/telluride.jpg',
  '/Patriot-Transportation/skyline.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
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
  const url = new URL(event.request.url);
  
  // Always network-first for HTML files, Firebase, Google APIs, Make.com
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('make.com') ||
    event.request.destination === 'document' ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Cache-first for static assets (images, icons)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
