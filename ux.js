/* Second Look 4 U - usability/flow layer */
(function(){
  const originalBuildSections = window.buildSections;
  function item(id,title,desc,redRule){ return {id,title,desc,redRule:!!redRule}; }

  window.buildSections = function(){
    const base=originalBuildSections(); const byName=n=>base.find(s=>s.name===n);
    const general=byName('1. General walk-around');
    const body=base.find(s=>s.name==='2. Bodywork'&&s.items.some(i=>i.id==='bodydry'));
    const panels=base.find(s=>s.name==='2. Bodywork'&&s.items.some(i=>i.id==='panel0'));
    const lights=byName('2. Bodywork — lights, glass & mirrors'); const wheels=byName('3. Wheels & tyres');
    const bonnet=byName('4. Under the bonnet & cold start'); const inside=byName('5. Inside the car');
    const test=byName('6. Test drive'); const exhaust=byName('6. Exhaust — after the drive'); const final=byName('7. Final Second Look');
    if(!general)return base;

    if(general.items){
      general.items=general.items.filter(i=>i.id!=='vin');
      if(!general.items.some(i=>i.id==='walkaroundFinding')) general.items.push(item('walkaroundFinding','Anything worth recording from the walk-around?','If you spot damage or anything that concerns you, record it now. Use Amber for something to discuss/negotiate and Red for a serious concern. Add a note if useful.'));
    }
    if(final) final.items=[
      item('v5c','V5C / paperwork','Check the V5C and available paperwork before making your final decision.'),
      item('vin','VIN / chassis number','Usually visible through the windscreen at the lower passenger-side corner of the dashboard. Check that it matches the VIN shown on the V5C.',true),
      item('servicehistory','Service history','Check any service history, service book or digital record that is available.'),
      item('invoices','Invoices / receipts','Ask to see relevant invoices or receipts if available.'),
      item('paperworkmatch','Does the paperwork support what you have been told?','Consider whether the history and paperwork fit with the seller’s description of the vehicle.'),
      item('challenge','Have you challenged anything you found?','If you found something you are not happy with, ask the seller about it before making your decision.')
    ];

    const driver=[],passenger=[],rear=[],front=[];
    if(panels) panels.items.forEach(x=>{const t=x.title;if(/^Driver /.test(t))driver.push(x);else if(/^Passenger /.test(t))passenger.push(x);else if(t==='Rear bumper'||t==='Boot / tailgate')rear.push(x);else if(t==='Front bumper')front.push(x);});
    const roof=panels&&panels.items.find(i=>i.title==='Roof');
    if(roof){driver.push(item('roof_driver','Roof — driver's side','While you are on the driver’s side, stand back and inspect the roof for dents, scratches, damage or anything unusual.'));passenger.push(item('roof_passenger','Roof — passenger side','While you are on the passenger’s side, stand back and inspect the roof for dents, scratches, damage or anything unusual.'));}
    if(panels)panels.items=[];
    const driverSection={name:"2. Bodywork — driver's side",items:driver}; const rearSection={name:'2. Bodywork — rear',items:rear};
    const passengerSection={name:"2. Bodywork — passenger side",items:passenger}; const frontSection={name:'2. Bodywork — front end',items:front};

    if(lights){
      const frontLight=lights.items.find(i=>i.id==='frontlights'),rearLight=lights.items.find(i=>i.id==='rearlights');
      if(frontLight){frontLight.title='Front lights — physical condition';frontLight.desc='From outside the vehicle, inspect the light units for cracks, damage, loose fittings, condensation or anything that looks out of place. Do not test the lights yet — we will check their operation later.';}
      if(rearLight){rearLight.title='Rear lights — physical condition';rearLight.desc='From outside the vehicle, inspect the light units for cracks, damage, loose fittings, condensation or anything that looks out of place. Do not test the lights yet — we will check their operation later.';}
    }
    if(bonnet){const cold=bonnet.items.find(i=>i.id==='coldstart');if(cold)cold.desc='Before starting the engine, confirm you are carrying out the cold-start check. Start the car from cold and listen carefully for abnormal noises, rough starting or anything unusual.';}
    if(test){test.items=test.items.filter(i=>i.id!=='transmission');const automatic=window.__secondLookTransmission==='automatic';test.items=test.items.filter(i=>automatic?i.id!=='clutch':!['autoDrive','autoReverse'].includes(i.id));}

    const ordered=[]; if(general)ordered.push(general); if(body)ordered.push(body); if(lights)ordered.push(lights); if(wheels)ordered.push(wheels);
    if(driverSection.items.length)ordered.push(driverSection); if(rearSection.items.length)ordered.push(rearSection); if(passengerSection.items.length)ordered.push(passengerSection); if(frontSection.items.length)ordered.push(frontSection); if(bonnet)ordered.push(bonnet);
    base.forEach(s=>{if(!s||ordered.includes(s))return;if(['1. General walk-around','2. Bodywork','2. Bodywork — lights, glass & mirrors','3. Wheels & tyres','4. Under the bonnet & cold start','5. Inside the car','6. Test drive','6. Exhaust — after the drive','7. Final Second Look'].includes(s.name))return;ordered.push(s);});
    if(inside)ordered.push(inside); if(test)ordered.push(test); if(exhaust)ordered.push(exhaust); if(final)ordered.push(final);
    return ordered.filter((s,i,a)=>s&&a.indexOf(s)===i);
  };

  function setupStart(){
    const app=document.getElementById('app');if(!app||screen!=='start')return;setStep('');document.getElementById('footer').classList.add('hidden');
    const options=Object.entries(vehicleTypes).map(([k,v])=>`<option value="${k}" ${vehicle.type===k?'selected':''}>${v.name}</option>`).join('');
    const convertible=vehicle.type&&vehicleTypes[vehicle.type]&&vehicleTypes[vehicle.type].convertible;
    app.innerHTML=`<div class="start-intro"><button class="back" id="homeBack">← Home</button><div class="small">GET READY</div><h1 class="do-not-start-title">Do Not Start Engine</h1></div><div class="card start-card"><div class="vehicle-prompt">Choose your vehicle</div><div class="select-wrap"><select id="vehicleType"><option value="">Choose vehicle</option>${options}</select></div><div class="field"><label>Transmission</label><select id="transmission"><option value="">Select transmission</option><option value="manual">Manual</option><option value="automatic">Automatic</option></select></div><div class="field"><label>Is the engine cold?</label><select id="engineCold"><option value="">Select yes or no</option><option value="yes">Yes</option><option value="no">No</option></select></div>${convertible?'':`<div class="field"><label>Panoramic glass roof fitted?</label><select id="pan"><option value="no">No</option><option value="yes">Yes</option></select></div><div class="field"><label>Tilt & slide sunroof fitted?</label><select id="sun"><option value="no">No</option><option value="yes">Yes</option></select></div>`}</div><div id="coldWarning" class="cold-warning hidden"><strong>Rebook the vehicle when cold</strong>You have missed the opportunity to check the vehicle from cold. Especially in cold weather, diesel engines can reveal noises that may disappear once the engine is warm. Rebook and check the vehicle when cold.</div><button class="btn primary start-button" id="startBtn" disabled>Start the check</button>`;
    const vt=document.getElementById('vehicleType'),trans=document.getElementById('transmission'),ec=document.getElementById('engineCold'),pan=document.getElementById('pan'),sun=document.getElementById('sun'),warning=document.getElementById('coldWarning'),btn=document.getElementById('startBtn');
    if(window.__secondLookTransmission)trans.value=window.__secondLookTransmission;if(window.__secondLookEngineCold!==undefined)ec.value=window.__secondLookEngineCold?'yes':'no';if(pan)pan.value=vehicle.panoramic?'yes':'no';if(sun)sun.value=vehicle.sunroof?'yes':'no';
    function refresh(){const valid=!!vt.value&&!!trans.value&&ec.value==='yes';warning.classList.toggle('hidden',ec.value!=='no');btn.disabled=!valid;}
    vt.onchange=()=>{vehicle.type=vt.value;vehicle.panoramic=false;vehicle.sunroof=false;window.__secondLookTransmission='';setupStart();};
    trans.onchange=()=>{window.__secondLookTransmission=trans.value;refresh();}; ec.onchange=()=>{window.__secondLookEngineCold=ec.value==='yes';refresh();};
    if(pan)pan.onchange=()=>vehicle.panoramic=pan.value==='yes';if(sun)sun.onchange=()=>vehicle.sunroof=sun.value==='yes';
    document.getElementById('homeBack').onclick=()=>{screen='launch';render();};
    btn.onclick=()=>{vehicle.type=vt.value;vehicle.panoramic=pan?pan.value==='yes':false;vehicle.sunroof=sun?sun.value==='yes':false;window.__secondLookTransmission=trans.value;window.__secondLookEngineCold=true;results=[{id:'transmission',note:trans.value,status:'na'}];sections=buildSections();sec=0;screen='inspect';render();};
    refresh();
  }
  window.start=function(){setupStart();};
  const originalRender=window.render;window.render=function(){originalRender();if(screen==='start')setupStart();};
  const originalInspect=window.inspect;window.inspect=function(){originalInspect();document.querySelectorAll('.note-row').forEach(row=>{const note=row.querySelector('.note');if(note&&!row.querySelector('.note-help')){const help=document.createElement('div');help.className='note-help';help.textContent='Optional note — tap the box to type, or use the microphone on your iPhone keyboard. When you finish dictating, tap the keyboard microphone again to stop.';row.parentNode.insertBefore(help,row);}});const next=document.getElementById('next');if(next&&sec===sections.length-1)next.textContent='Complete inspection →';};
  const originalResult=window.result;window.result=function(){originalResult();const app=document.getElementById('app');if(app&&!app.querySelector('.completion-banner')){const banner=document.createElement('div');banner.className='completion-banner';banner.innerHTML='<strong>INSPECTION COMPLETE</strong><span>You have finished the Second Look inspection. Review your findings below.</span>';app.insertBefore(banner,app.firstChild);}};
  if(screen==='start')setupStart();
})();
