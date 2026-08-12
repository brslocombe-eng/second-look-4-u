const CACHE = 'second-look-4-u-v4';

async function appResponse(request) {
  const response = await fetch(request);
  if (!response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  let html = await response.text();
  html = html.replace('</style>', 'textarea.note{display:block !important;min-height:72px;resize:vertical;} .note-row{align-items:flex-start;} .voice{min-width:52px;} </style>');
  return new Response(html, {status: response.status, statusText: response.statusText, headers: response.headers});
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await appResponse(new Request('./index.html'));
    await cache.put('./index.html', response.clone());
    await cache.add('./manifest.webmanifest');
    await cache.add('./');
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/index.html') || url.pathname.endsWith('/second-look-4-u/')) {
    event.respondWith(caches.match('./index.html').then(cached => cached || appResponse(event.request)));
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
