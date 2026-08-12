const CACHE = 'second-look-4-u-v5';

async function appResponse(request) {
  const response = await fetch(request);
  if (!response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  let html = await response.text();
  html = html.replace('</style>', 'textarea.note{display:block !important;min-height:72px;resize:vertical;} .note-row{align-items:flex-start;} .voice{min-width:52px;} </style>');
  const voiceFix = `<script>
function setupVoiceNotes(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  document.querySelectorAll('[data-voice]').forEach(btn => btn.onclick = () => {
    const id = btn.dataset.voice;
    const note = document.querySelector('[data-note="'+id+'"]');
    const status = document.querySelector('[data-voice-status="'+id+'"]');
    note.classList.add('show');
    note.focus();
    if (!SR) {
      status.textContent = 'Voice input is not available in this browser. Use the microphone on the iPhone keyboard.';
      return;
    }
    let r = results.find(z => z.id === id);
    if (!r) { r = {id}; results.push(r); }
    const base = note.value.trim();
    const rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = false;
    let finished = false;
    const finish = () => { if(finished)return; finished=true; btn.classList.remove('listening'); };
    btn.classList.add('listening');
    status.textContent = 'Listening… speak now';
    rec.onstart = () => { status.textContent = 'Listening… speak now'; };
    rec.onresult = e => {
      let finalText = '', interimText = '';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const t=e.results[i][0].transcript;
        if(e.results[i].isFinal) finalText += t;
        else interimText += t;
      }
      const shown = (base ? base+' ' : '') + (finalText || interimText);
      note.value = shown.trim();
      r.note = note.value;
      status.textContent = finalText ? 'Voice note added.' : 'Listening…';
    };
    rec.onerror = e => {
      const messages={not-allowed:'Microphone access was blocked. Check Safari microphone permission.',audio-capture:'No microphone was available.',network:'Speech recognition needs an internet connection.'};
      status.textContent = messages[e.error] || 'Voice input could not be used. Try again or use the keyboard microphone.';
      finish();
    };
    rec.onend = () => { finish(); if(status.textContent==='Listening…' || status.textContent==='Listening… speak now') status.textContent='Voice input ended.'; };
    try { rec.start(); } catch(e) { finish(); status.textContent='Voice input could not be started. Try again or use the keyboard microphone.'; }
  });
}
</script>`;
  html = html.replace("render();if('serviceWorker' in navigator)", voiceFix + "render();if('serviceWorker' in navigator)");
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
