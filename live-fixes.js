/* Second Look 4 U - live correction layer */
(function(){
  const frame=document.querySelector('iframe');
  if(!frame)return;
  function apply(){
    try{
      const w=frame.contentWindow,d=frame.contentDocument;
      if(!w||!d||!Array.isArray(w.S))return;
      const inside=w.S.find(s=>s.name==='5. Inside the car');
      if(inside){
        const win=inside.items.find(i=>i[0]==='windows');
        if(win) win[2]='Operate the driver window switch fully down and back up. Then repeat for the remaining window switches and controls. Check the switches and controls operate normally and are not loose, damaged or broken. This check is only about the windows and switches.';
      }
      const wheels=w.S.find(s=>s.name==='3. Wheels & tyres');
      if(wheels&&!wheels.items.some(i=>i[0]==='brakeDiscs')){
        wheels.items.push(['brakeDiscs','Brake discs — visible condition','If you can see the brake discs through the wheels, visually check them for excessive wear, heavy rust or obvious damage. You will not normally be able to assess the brake pads from outside. Do not diagnose faults.']);
      }
      ensureRoofChecks(w);
      if(!w.__sl4uLiveFixRender && typeof w.render==='function'){
        const original=w.render;
        w.render=function(){
          original.apply(this,arguments);
          setTimeout(function(){ensureRoofChecks(w);addNegotiationSummary();},0);
        };
        w.__sl4uLiveFixRender=true;
      }
      addNegotiationSummary();
    }catch(e){}
  }
  function selectedRoof(w){
    const v=w.vehicle||{};
    return {pan:!!v.pan,sun:!!v.sun};
  }
  function ensureRoofChecks(w){
    if(!w||!Array.isArray(w.S))return;
    const r=selectedRoof(w);
    const driver=w.S.find(s=>s.name==="2. Bodywork — driver's side");
    const passenger=w.S.find(s=>s.name==='2. Bodywork — passenger side');
    const inside=w.S.find(s=>s.name==='5. Inside the car');
    const add=(sec,item)=>{if(sec&&!sec.items.some(i=>i&&i[0]===item[0]))sec.items.push(item)};
    const glass=['roofGlass','Glass roof — condition','If the vehicle is fitted with a glass roof, physically inspect the glass from outside for cracks, chips, damage, excessive wear or other obvious defects.'];
    const tilt=['sunroofOperation','Tilt & slide glass sunroof — operation','Operate the tilt & slide glass sunroof through its normal opening, tilting and closing functions. Check that it moves smoothly, fully opens/closes and seats correctly, with no abnormal noise, hesitation or obvious damage.'];
    const blind=['sunroofBlind','Sunroof blind — operation','From inside the car, operate the electric sunroof blind. Check that it retracts fully and closes fully, operates smoothly and shows no obvious damage or abnormal noise.'];
    const panBlind=['panoramicBlind','Panoramic roof blind — operation','From inside the car, operate the electric sliding blind. Check that it retracts fully and closes fully, operates smoothly and shows no obvious damage or abnormal noise.'];
    if(r.sun){add(driver,glass);add(driver,tilt);add(inside,blind)}
    if(r.pan){add(driver,glass);add(passenger,glass);add(inside,panBlind)}
  }
  function addNegotiationSummary(){
    try{
      const w=frame.contentWindow,d=frame.contentDocument;
      if(!w||!d||!Array.isArray(w.S)||!w.answers)return;
      const section=w.S[w.section];
      const text=(d.body&&d.body.innerText)||'';
      const isFinal=!!section && (/final/i.test(section.name)||/to negotiate|negotiat/i.test(text)) && !/Do Not Start Engine/i.test(text);
      if(!isFinal)return;
      const items=[];
      w.S.forEach(s=>s.items.forEach(i=>{const a=w.answers[i[0]];if(a&&a.status==='amber')items.push({title:i[1],status:'Negotiate',note:a.note||''});else if(a&&a.status==='red')items.push({title:i[1],status:'Concern',note:a.note||''});}));
      if(!items.length)return;
      let box=d.getElementById('sl4u-negotiation-summary');
      if(!box){
        box=d.createElement('div');box.id='sl4u-negotiation-summary';box.className='completion-banner';
        const main=d.querySelector('.main')||d.body;main.insertBefore(box,main.firstChild);
      }
      box.innerHTML='<strong>WHAT YOU FOUND</strong><div>'+items.map(x=>'<div style="padding:7px 0;border-top:1px solid #303740"><b>'+esc(x.title)+'</b> — '+x.status+(x.note?' — '+esc(x.note):'')+'</div>').join('')+'</div>';
    }catch(e){}
  }
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  frame.addEventListener('load',()=>{setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,1000)});
  setInterval(apply,1000);
})();
