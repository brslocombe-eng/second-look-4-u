const CACHE = 'second-look-4-u-v2';
const SAFE_AREA_FIX = `<style id="sl4u-safe-area-fix">
.top{padding-top:calc(16px + env(safe-area-inset-top));min-height:calc(56px + env(safe-area-inset-top));}
@supports (padding-top: max(0px, 0px)){.top{padding-top:max(16px,calc(16px + env(safe-area-inset-top)));}}
</style>`;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['./','./index.html','./manifest.webmanifest'])));
  self.skipWaiting();
});

self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(async response => {
        if (!response.ok) return response;
        const html = await response.text();
        const patched = html.replace('</style>', `${SAFE_AREA_FIX}</style>`);
        return new Response(patched, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
