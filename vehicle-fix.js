(function(){
  function type(){return typeof vehicle!=='undefined'?vehicle.type:'';}
  function isTwoDoor(){return type()==='sportHard'||type()==='sportCanvas';}
  function isThreeDoor(){return type()==='hatch3';}
  function isConvertible(){return type()==='sportCanvas';}
  function ensureBriefCheck(){
    if(typeof S==='undefined'||!Array.isArray(S)) return;
    var walk=S.find(function(x){return x.name==='1. General walk-around';});
    if(!walk||!Array.isArray(walk.items)) return;
    if(!walk.items.some(function(i){return i&&i[0]==='firstfinding';})) walk.items.push(['firstfinding','Anything worth recording?','If you spot damage or anything that concerns you during the initial walk-around, record it now. You are not expected to diagnose it.']);
  }
  function ensureConvertibleRoofOperation(){
    if(!isConvertible()||typeof S==='undefined'||!Array.isArray(S)) return;
    var driver=S.find(function(x){return x.name==="2. Bodywork — driver's side";});
    if(!driver||!Array.isArray(driver.items)) return;
    if(!driver.items.some(function(i){return i&&i[0]==='roof_operation';})) driver.items.push(['roof_operation','Convertible roof — operation','If safe to do so, operate the roof through its normal opening and closing cycle. Check that it moves smoothly, the mechanism and latches operate correctly, and there is no abnormal noise, hesitation, resistance, misalignment or obvious seal problem when closed.']);
  }
  function removeRearDoorItems(){
    if(!(isTwoDoor()||isThreeDoor())||typeof S==='undefined'||!Array.isArray(S)) return;
    S.forEach(function(sec){
      if(!sec||!Array.isArray(sec.items)) return;
      sec.items=sec.items.filter(function(i){var id=String(i&&i[0]||''),title=String(i&&i[1]||'');return id!=='drd'&&id!=='prd'&&!/rear\s+door/i.test(title);});
    });
  }
  function hideRenderedRearDoors(){
    try{if(!(isTwoDoor()||isThreeDoor()))return;document.querySelectorAll('.check').forEach(function(card){var id=card.getAttribute('data-id')||'',text=card.textContent||'';if(id==='drd'||id==='prd'||/rear\s+door/i.test(text))card.remove();});}catch(e){}
  }
  function patchVehicleMenu(){
    try{
      var vt=document.getElementById('vt');if(!vt)return;
      var desired={sportHard:'2-door sports car',sportCanvas:'2-door convertible',hatch3:'3-door hatch',saloon:'4-door saloon',hatch5:'5-door hatch or estate'};
      Array.from(vt.options).forEach(function(o){if(o.value==='estate')o.remove();});
      Array.from(vt.options).forEach(function(o){if(desired[o.value])o.textContent=desired[o.value];});
      if(vt.dataset.slMenuPatched)return;
      vt.dataset.slMenuPatched='1';
      vt.addEventListener('change',function(){setTimeout(function(){apply();hideRenderedRearDoors();},0);});
    }catch(e){}
  }
  function patchRender(){
    try{if(typeof render!=='function'||render.__sl4uPatched)return;var original=render;var wrapped=function(){var result=original.apply(this,arguments);try{patchVehicleMenu();ensureBriefCheck();ensureConvertibleRoofOperation();removeRearDoorItems();hideRenderedRearDoors();}catch(e){}return result;};wrapped.__sl4uPatched=true;window.render=wrapped;}catch(e){}
  }
  function apply(){
    try{
      if(typeof S==='undefined'||!Array.isArray(S))return;
      patchVehicleMenu();ensureBriefCheck();
      if(!(isTwoDoor()||isThreeDoor()))return;
      removeRearDoorItems();
      var rear=S.find(function(x){return x.name==='2. Bodywork — rear';});
      if(rear){
        if(isTwoDoor()||isThreeDoor()) rear.items=rear.items.filter(function(i){return !/tailgate/i.test(i[1]||'');});
        var boot=rear.items.find(function(i){return /^Boot \/ tailgate$/i.test(i[1]||'');});
        if(boot)boot[1]=isThreeDoor()?'Hatch':'Boot';
      }
      var driver=S.find(function(x){return x.name==="2. Bodywork — driver's side";}),passenger=S.find(function(x){return x.name==='2. Bodywork — passenger side';});
      var roofText='Get as close as possible to the roof and physically inspect the top surface. Check the roof condition for dents, scratches, chips, paint damage, corrosion or other damage.';
      if(driver&&!driver.items.some(function(i){return i[0]==='roof_driver'}))driver.items.push(['roof_driver','Roof — driver side',roofText]);
      if(passenger&&!passenger.items.some(function(i){return i[0]==='roof_passenger'}))passenger.items.push(['roof_passenger','Roof — passenger side',roofText]);
      ensureConvertibleRoofOperation();removeRearDoorItems();hideRenderedRearDoors();
    }catch(e){}
  }
  function hideConvertibleRoofOptions(){
    try{var vt=document.getElementById('vt'),pan=document.getElementById('pan'),sun=document.getElementById('sun');if(!vt||!pan||!sun)return;var convertible=vt.value==='sportCanvas',pf=pan.closest('.field'),sf=sun.closest('.field');if(pf)pf.style.display=convertible?'none':'';if(sf)sf.style.display=convertible?'none':'';if(convertible){pan.value='no';sun.value='no';}}catch(e){}
  }
  var tries=0;var timer=setInterval(function(){patchRender();patchVehicleMenu();apply();hideConvertibleRoofOptions();hideRenderedRearDoors();if(++tries>160)clearInterval(timer);},250);
  document.addEventListener('change',function(){patchRender();patchVehicleMenu();apply();hideConvertibleRoofOptions();hideRenderedRearDoors();},true);
  if(typeof MutationObserver!=='undefined')new MutationObserver(function(){patchRender();patchVehicleMenu();ensureBriefCheck();ensureConvertibleRoofOperation();removeRearDoorItems();hideRenderedRearDoors();hideConvertibleRoofOptions();}).observe(document.body,{childList:true,subtree:true});
})();
