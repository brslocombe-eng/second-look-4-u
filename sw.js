const CACHE = 'second-look-4-u-v9';

async function appResponse(request) {
  const response = await fetch(request);
  if (!response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  let html = await response.text();
  html = html.replace('</style>', 'textarea.note{display:block !important;min-height:72px;resize:vertical;} .note-row{align-items:flex-start;} .voice{min-width:52px;} body:has(.launch) .top{display:none;} body:has(.launch) .wrap{padding-bottom:0;} body:has(.launch) .launch{min-height:100vh;align-items:flex-start;padding-top:clamp(72px,12vh,120px);padding-bottom:48px;} body:has(.launch) .app-mark{margin-bottom:20px;} body:has(.launch) .launch-title{font-size:clamp(34px,9vw,43px);margin-bottom:14px;} body:has(.launch) .launch-sub{margin-bottom:24px;} </style>');
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
  const startScreenFix = `<script>
(function(){
  const originalStart = window.start;
  window.start = function(){
    originalStart();
    const intro = document.querySelector('.start-intro');
    const card = document.querySelector('.start-card');
    if(!intro || !card) return;
    const small = intro.querySelector('.small');
    if(small) small.textContent = 'GET READY';
    const selectWrap = card.querySelector('.select-wrap');
    if(selectWrap){
      const label = document.createElement('div');
      label.className = 'vehicle-prompt';
      label.textContent = 'Choose your vehicle';
      card.insertBefore(label, selectWrap);
    }
    const title = document.createElement('h1');
    title.className = 'do-not-start-title';
    title.textContent = 'Do Not Start Engine';
    const introEnd = intro.querySelector('.small');
    introEnd.insertAdjacentElement('afterend', title);
    const oldIntro = intro.querySelector('.small');
    if(oldIntro) oldIntro.remove();
  };
})();
</script>`;
  html = html.replace("render();if('serviceWorker' in navigator)", voiceFix + startScreenFix + "render();if('serviceWorker' in navigator)");
  html = html.replace('</style>', '.do-not-start-title{font-size:clamp(34px,9vw,43px);line-height:1.05;letter-spacing:-.035em;margin:18px 0 20px;color:var(--txt)}.vehicle-prompt{color:var(--muted);font-size:15px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;margin:2px 0 10px}</style>');
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
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
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
