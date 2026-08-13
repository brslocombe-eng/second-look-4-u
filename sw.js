const CACHE = 'second-look-4-u-v11';

async function appResponse(request) {
  const response = await fetch(request);
  if (!response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  let html = await response.text();
  html = html.replace('</style>', 'textarea.note{display:block !important;min-height:72px;resize:vertical;} .note-row{align-items:flex-start;} .voice{min-width:52px;} body:has(.launch) .top{display:none;} body:has(.launch) .wrap{padding-bottom:0;} body:has(.launch) .launch{min-height:100vh;align-items:flex-start;padding-top:clamp(72px,12vh,120px);padding-bottom:48px;} body:has(.launch) .app-mark{margin-bottom:20px;} body:has(.launch) .launch-title{font-size:clamp(34px,9vw,43px);margin-bottom:14px;} body:has(.launch) .launch-sub{margin-bottom:24px;} .do-not-start-title{font-size:clamp(34px,9vw,43px);line-height:1.05;letter-spacing:-.035em;margin:18px 0 20px;color:var(--txt)} .vehicle-prompt{color:var(--muted);font-size:15px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;margin:2px 0 10px} .cold-start-card{margin-top:14px;border:1px solid var(--line);border-radius:16px;padding:16px;background:var(--card)} .cold-start-card h3{margin:0 0 8px;color:var(--txt);font-size:17px;text-transform:none;letter-spacing:0} .cold-start-card p{margin:0 0 12px;color:var(--muted);font-size:13px;line-height:1.45} .cold-choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cold-choice{border:1px solid var(--line);border-radius:11px;padding:12px 8px;background:#15191e;color:var(--txt);font-weight:800}.cold-choice.sel{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset}.cold-warning{margin-top:12px;padding:12px;border-radius:11px;background:#2a1b18;border:1px solid var(--red);color:var(--txt);font-size:13px;line-height:1.45}.cold-warning strong{display:block;margin-bottom:4px;color:var(--red)}#next:disabled{opacity:.45;cursor:not-allowed}</style>');
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
  if(typeof originalStart !== 'function') return;
  window.start = function(){
    window.__secondLookEngineCold = false;
    originalStart();
    setTimeout(() => {
      const intro = document.querySelector('.start-intro');
      const card = document.querySelector('.start-card');
      if(!intro || !card) return;
      const old = intro.querySelector('.small');
      if(old) old.textContent = 'GET READY';
      const selectWrap = card.querySelector('.select-wrap');
      if(selectWrap && !card.querySelector('.vehicle-prompt')){
        const label = document.createElement('div');
        label.className = 'vehicle-prompt';
        label.textContent = 'Choose your vehicle';
        card.insertBefore(label, selectWrap);
      }
      if(!intro.querySelector('.do-not-start-title')){
        const title = document.createElement('h1');
        title.className = 'do-not-start-title';
        title.textContent = 'Do Not Start Engine';
        const small = intro.querySelector('.small');
        if(small) small.insertAdjacentElement('afterend', title);
      }
    },0);
  };
})();
</script>`;
  const coldStartFix = `<script>
(function(){
  function wireColdStart(){
    const card = document.querySelector('.start-card');
    const select = card && card.querySelector('.select-wrap select');
    const footerBtn = document.getElementById('next');
    if(!card || !select || !footerBtn) return false;
    if(!select.dataset.coldReset){
      select.dataset.coldReset='1';
      select.addEventListener('change', () => {
        window.__secondLookEngineCold = false;
        setTimeout(wireColdStart,0);
      });
    }
    let existing = card.querySelector('.cold-start-card');
    if(!existing){
      existing = document.createElement('div');
      existing.className = 'cold-start-card';
      existing.innerHTML = '<h3>Is the engine cold?</h3><p>The vehicle must be checked from cold. Do not allow the engine to be started before the inspection begins.</p><div class="cold-choice-grid"><button type="button" class="cold-choice" data-cold="yes">Yes — engine is cold</button><button type="button" class="cold-choice" data-cold="no">No — vehicle has been started</button></div><div class="cold-warning hidden" data-cold-warning><strong>Rebook the vehicle when cold</strong>You have missed the opportunity to check the vehicle from cold. Especially in cold weather, diesel engines can reveal noises that may disappear once the engine is warm. Rebook and check the vehicle when cold.</div>';
      card.appendChild(existing);
    }
    const choices = existing.querySelectorAll('[data-cold]');
    choices.forEach(btn => {
      if(btn.dataset.wired) return;
      btn.dataset.wired='1';
      btn.addEventListener('click', () => {
        choices.forEach(x => x.classList.remove('sel'));
        btn.classList.add('sel');
        const cold = btn.dataset.cold === 'yes';
        window.__secondLookEngineCold = cold;
        const warning = existing.querySelector('[data-cold-warning]');
        warning.classList.toggle('hidden', cold);
        footerBtn.disabled = !cold;
        if(!cold) footerBtn.textContent = 'Rebook vehicle when cold';
        else if(footerBtn.textContent === 'Rebook vehicle when cold') footerBtn.textContent = 'Start the check';
      });
    });
    footerBtn.disabled = window.__secondLookEngineCold !== true;
    return true;
  }
  const observer = new MutationObserver(() => wireColdStart());
  observer.observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(wireColdStart,50);
})();
</script>`;
  html = html.replace("render();if('serviceWorker' in navigator)", voiceFix + startScreenFix + coldStartFix + "render();if('serviceWorker' in navigator)");
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
