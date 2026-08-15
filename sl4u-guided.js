(function(){
  'use strict';
  if(window.__sl4uGuidedV1)return;
  window.__sl4uGuidedV1=true;

  const HELP={
    dfw:['Driver front wing','The wing is the body panel between the front door and the front bumper, around the front wheel. Look for dents, scratches, paint damage or signs of repair.'],
    dsill:['Driver side sill','The sill is the long body panel running along the bottom of the car underneath the doors. Look along its length for dents, scrapes, corrosion or signs of repair.'],
    psill:['Passenger side sill','The sill is the long body panel running along the bottom of the car underneath the doors. Look along its length for dents, scrapes, corrosion or signs of repair.'],
    boot:['Boot / tailgate','This is the large panel you open to access the luggage area. On a hatchback it is usually called the tailgate; on a saloon it is the boot lid. Check the panel, edges, hinges, seal and operation.'],
    drq:['Driver rear quarter','The rear quarter is the body panel around the rear wheel, between the rear door and the rear bumper.'],
    prq:['Passenger rear quarter','The rear quarter is the body panel around the rear wheel, between the rear door and the passenger rear bumper.'],
    roofd:['Roof — driver side','Stand back and look across the roof surface from the driver side. Check for dents, scratches, chips, paint damage or signs of repair.'],
    roofp:['Roof — passenger side','Stand back and look across the roof surface from the passenger side. Check for dents, scratches, chips, paint damage or signs of repair.'],
    pfd:['Passenger front wing','The wing is the body panel between the front door and the front bumper, around the front wheel.'],
    pfw:['Passenger front wing','The wing is the body panel between the front door and the front bumper, around the front wheel.'],
    dfd:['Driver front door','The main body panel beside the driver. Check the panel, handle, trim and gaps around the door.'],
    drd:['Driver rear door','The rear passenger door on the driver side, if fitted. Check the panel, handle, trim and gaps around the door.'],
    prd:['Passenger rear door','The rear passenger door on the passenger side, if fitted. Check the panel, handle, trim and gaps around the door.'],
    mirrors:['Door mirrors','The mirror housings attached to the doors. Check the casing and glass for cracks, damage or looseness.'],
    rear:['Rear bumper','The bumper is the protective bodywork running across the back of the car. Check for scratches, dents, cracks or poor repairs.'],
    front:['Front bumper','The bumper is the protective bodywork running across the front of the car. Check for scratches, dents, cracks or poor repairs.']
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent=`
    .sl-guided{padding-bottom:18px}.sl-guided-count{font-size:12px;font-weight:900;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}.sl-guided h2{font-size:30px;line-height:1.08;margin:0 0 8px}.sl-guided .sl-info{display:inline-grid;place-items:center;width:27px;height:27px;margin-left:7px;border:1px solid var(--line);border-radius:50%;background:#15191e;color:var(--txt);font-weight:900;vertical-align:middle}.sl-guided .choices{margin-top:18px}.sl-guided .note-row{display:flex;gap:8px;margin-top:12px}.sl-guided .note{font-size:16px;min-height:78px}.sl-guided .continue{margin-top:12px}.sl-guided .continue[disabled]{opacity:.45}.sl-help{position:fixed;inset:0;background:rgba(0,0,0,.74);z-index:9999;display:flex;align-items:flex-end;padding:14px}.sl-help-card{width:100%;max-width:620px;margin:auto;background:#1b2026;border:1px solid var(--line);border-radius:18px;padding:18px;max-height:88vh;overflow:auto}.sl-help-card h2{font-size:25px}.sl-help-card p{color:var(--txt);line-height:1.5}.sl-car{width:100%;height:auto;margin:8px 0}.sl-car path{fill:#242b32;stroke:#9ca5b0;stroke-width:2}.sl-car circle{fill:#111418;stroke:#9ca5b0;stroke-width:3}.sl-car .hot{fill:rgba(230,162,60,.42);stroke:var(--gold);stroke-width:4}.sl-help-close{background:#252b32;color:var(--txt);border:1px solid var(--line);border-radius:12px;padding:13px 16px;font-weight:900;width:100%}.sl-report-actions{display:grid;gap:9px;margin-top:16px}.sl-report-actions button{width:100%}`;
  document.head.appendChild(style);

  function flat(){
    const out=[];
    for(let si=0;si<S.length;si++) for(let ii=0;ii<S[si].items.length;ii++) out.push({section:si,index:ii,item:S[si].items[ii]});
    return out;
  }
  function current(){
    const all=flat();
    if(typeof window.__sl4uItemIndex!=='number') window.__sl4uItemIndex=0;
    return {all,idx:window.__sl4uItemIndex,entry:all[window.__sl4uItemIndex]};
  }
  function carSvg(id){
    let hot='';
    const zones={dfw:'<path class="hot" d="M70 87 Q78 69 103 63 L125 42 L160 42 L160 72 L95 72 Z"/>',dsill:'<path class="hot" d="M96 102 L285 102 L280 118 L100 118 Z"/>',psill:'<path class="hot" d="M96 102 L285 102 L280 118 L100 118 Z"/>',boot:'<path class="hot" d="M285 56 L335 69 L342 101 L286 101 Z"/>',drq:'<path class="hot" d="M248 70 Q278 63 300 78 L303 103 L250 103 Z"/>',prq:'<path class="hot" d="M248 70 Q278 63 300 78 L303 103 L250 103 Z"/>',roofd:'<path class="hot" d="M124 38 L270 38 Q282 39 294 55 L111 55 Z"/>',roofp:'<path class="hot" d="M124 38 L270 38 Q282 39 294 55 L111 55 Z"/>',pfd:'<path class="hot" d="M155 62 L207 62 L207 103 L153 103 Z"/>',pfw:'<path class="hot" d="M72 78 Q82 64 108 62 L120 103 L72 103 Z"/>',dfd:'<path class="hot" d="M155 62 L207 62 L207 103 L153 103 Z"/>',drd:'<path class="hot" d="M207 62 L254 67 L254 103 L207 103 Z"/>',prd:'<path class="hot" d="M207 62 L254 67 L254 103 L207 103 Z"/>',mirrors:'<circle class="hot" cx="151" cy="60" r="9"/>',rear:'<path class="hot" d="M331 71 L348 79 L353 103 L329 103 Z"/>',front:'<path class="hot" d="M46 78 L73 70 L80 103 L45 103 Z"/>'};
    hot=zones[id]||'';
    return `<svg class="sl-car" viewBox="0 0 390 145" aria-label="Simple side view of a car"><path d="M35 103 L49 78 Q62 62 92 58 L114 38 Q122 28 144 28 L267 28 Q287 29 300 45 L320 61 Q343 65 357 79 L365 103 Z"/><circle cx="105" cy="104" r="23"/><circle cx="304" cy="104" r="23"/><path d="M116 39 L135 30 L182 30 L182 58 L106 58 Z" fill="#303840" stroke="#9ca5b0" stroke-width="2"/><path d="M188 30 L267 30 L292 58 L188 58 Z" fill="#303840" stroke="#9ca5b0" stroke-width="2"/>${hot}</svg>`;
  }
  function help(id){
    const h=HELP[id]; if(!h)return;
    const m=document.createElement('div');m.className='sl-help';m.innerHTML=`<div class="sl-help-card"><button class="back" id="sl-close">← Close</button><h2>${esc(h[0])}</h2>${carSvg(id)}<p>${esc(h[1])}</p><button class="sl-help-close" id="sl-got">Got it</button></div>`;
    document.body.appendChild(m);const close=()=>m.remove();m.querySelector('#sl-close').onclick=close;m.querySelector('#sl-got').onclick=close;m.onclick=e=>{if(e.target===m)close()};
  }
  function guidedInspect(){
    const c=current();
    if(!c.entry){screen='result';return render();}
    const [id,title,desc]=c.entry.item;const a=answers[id]||{};const pct=Math.round((c.idx/Math.max(1,c.all.length))*100);
    document.getElementById('top').style.display='flex';footer(false);step(`${c.idx+1} / ${c.all.length}`);
    document.getElementById('app').innerHTML=`<button class="back" id="sl-back">← Back</button><div class="sl-guided"><div class="sl-guided-count">${esc(S[c.entry.section].name)}</div><h2>${esc(title)}${HELP[id]?'<button class="sl-info" id="sl-info" aria-label="What is this?">i</button>':''}</h2><div class="progress"><div class="bar" style="width:${pct}%"></div></div><p class="sub">${esc(desc)}</p><div class="choices"><button class="choice ${a.status==='green'?'sel green':''}" data-s="green">GOOD</button><button class="choice ${a.status==='amber'?'sel amber':''}" data-s="amber">NEGOTIATE</button><button class="choice ${a.status==='red'?'sel red':''}" data-s="red">CONCERN</button></div><button class="choice ${a.status==='na'?'sel na':''}" data-s="na" style="width:100%;margin-top:7px">NOT CHECKED / UNSURE</button>${(a.status==='amber'||a.status==='red')?`<div class="note-row"><textarea class="note" id="sl-note" placeholder="Optional note — what did you find?">${esc(a.note||'')}</textarea></div><button class="btn primary continue" id="sl-continue">Continue →</button>`:''}</div>`;
    const advance=()=>{window.__sl4uItemIndex=c.idx+1;render();window.scrollTo({top:0,behavior:'instant'})};
    document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const st=b.dataset.s;save(id,st);if(st==='green'||st==='na')advance();else render()});
    const n=document.getElementById('sl-note');if(n)n.oninput=()=>save(id,null,n.value);
    const cont=document.getElementById('sl-continue');if(cont)cont.onclick=advance;
    const info=document.getElementById('sl-info');if(info)info.onclick=()=>help(id);
    document.getElementById('sl-back').onclick=()=>{if(c.idx===0){screen='setup';render()}else{window.__sl4uItemIndex=c.idx-1;render();window.scrollTo({top:0,behavior:'instant'})}};
  }
  const originalInspect=window.inspect;
  window.inspect=guidedInspect;
  const originalResult=window.result;
  window.result=function(){originalResult();const card=document.querySelector('.card');if(!card||document.getElementById('sl-report-actions'))return;const box=document.createElement('div');box.id='sl-report-actions';box.className='sl-report-actions';box.innerHTML='<button class="btn primary" id="sl-email">Email report</button><button class="btn secondary" id="sl-share">Share report</button><button class="btn secondary" id="sl-copy">Copy report</button>';card.appendChild(box);const report=()=>{const lines=['SECOND LOOK 4 U — INSPECTION REPORT','Challenge the car before you commit','',`Vehicle: ${V[vehicle.type]||'Not specified'}`,`Transmission: ${vehicle.trans||'Not specified'}`,''];let g=0,a=0,r=0,n=0;flat().forEach(e=>{const x=answers[e.item[0]];if(!x||!x.status){n++;return}if(x.status==='green')g++;if(x.status==='amber')a++;if(x.status==='red')r++});lines.push(`Good: ${g}`,`Negotiate: ${a}`,`Concern: ${r}`,`Not checked / unsure: ${n}`,'','FINDINGS');flat().forEach(e=>{const x=answers[e.item[0]];if(x&&(x.status==='amber'||x.status==='red')){lines.push(`${x.status==='red'?'CONCERN':'NEGOTIATE'}: ${e.item[1]}`);if(x.note)lines.push(`Note: ${x.note}`);lines.push('')}});return lines.join('\n')};const text=report();document.getElementById('sl-email').onclick=()=>location.href='mailto:?subject='+encodeURIComponent('Second Look 4 U report')+'&body='+encodeURIComponent(text);document.getElementById('sl-share').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'Second Look 4 U report',text})}catch(e){}}else document.getElementById('sl-copy').click()};document.getElementById('sl-copy').onclick=async()=>{try{await navigator.clipboard.writeText(text);document.getElementById('sl-copy').textContent='Report copied'}catch(e){document.getElementById('sl-copy').textContent='Copy unavailable'}}};
  window.__sl4uGuidedReady=true;
})();
