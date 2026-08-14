(function(){
  function isTwoDoor(){
    return typeof vehicle!=='undefined' && (vehicle.type==='sportHard'||vehicle.type==='sportCanvas');
  }
  function ensureBriefCheck(){
    if(typeof S==='undefined'||!Array.isArray(S)) return;
    var walk=S.find(function(x){return x.name==='1. General walk-around';});
    if(!walk||!Array.isArray(walk.items)) return;
    if(!walk.items.some(function(i){return i&&i[0]==='firstfinding';})){
      walk.items.push(['firstfinding','Anything worth recording?','If you spot damage or anything that concerns you during the initial walk-around, record it now. You are not expected to diagnose it.']);
    }
  }
  function removeRearDoorItems(){
    if(!isTwoDoor()||typeof S==='undefined'||!Array.isArray(S)) return;
    S.forEach(function(sec){
      if(!sec||!Array.isArray(sec.items)) return;
      sec.items=sec.items.filter(function(i){
        var id=String(i&&i[0]||'');
        var title=String(i&&i[1]||'');
        return id!=='drd'&&id!=='prd'&&!/rear\s+door/i.test(title);
      });
    });
  }
  function apply(){
    try{
      if(typeof S==='undefined'||!Array.isArray(S)) return;
      ensureBriefCheck();
      if(!isTwoDoor()) return;
      removeRearDoorItems();
      var rear=S.find(function(x){return x.name==='2. Bodywork — rear';});
      if(rear){
        rear.items=rear.items.filter(function(i){return !/tailgate/i.test(i[1]||'');});
        var boot=rear.items.find(function(i){return /^Boot \/ tailgate$/i.test(i[1]||'');});
        if(boot) boot[1]='Boot';
      }
      var driver=S.find(function(x){return x.name==="2. Bodywork — driver's side";});
      var passenger=S.find(function(x){return x.name==='2. Bodywork — passenger side';});
      var roofText='Physically inspect the roof all the way around. Check the roof surface, seals, frame and mechanism for damage, wear, corrosion, leaks or anything unusual. On a canvas convertible, inspect the fabric and folding mechanism. On a hardtop, inspect the roof panel and seals.';
      if(driver&&!driver.items.some(function(i){return i[0]==='roof_driver'})) driver.items.push(['roof_driver','Roof — driver side','While on the driver side, '+roofText]);
      if(passenger&&!passenger.items.some(function(i){return i[0]==='roof_passenger'})) passenger.items.push(['roof_passenger','Roof — passenger side','While on the passenger side, '+roofText]);
      removeRearDoorItems();
      if(typeof render==='function'&&typeof screen!=='undefined'&&screen==='inspect') render();
      removeRearDoorItems();
      hideRenderedRearDoors();
    }catch(e){}
  }
  function hideRenderedRearDoors(){
    try{
      if(!isTwoDoor()) return;
      document.querySelectorAll('.check').forEach(function(card){
        var id=card.getAttribute('data-id')||'';
        var text=(card.textContent||'');
        if(id==='drd'||id==='prd'||/rear\s+door/i.test(text)) card.remove();
      });
    }catch(e){}
  }
  function hideConvertibleRoofOptions(){
    try{
      var vt=document.getElementById('vt'),pan=document.getElementById('pan'),sun=document.getElementById('sun');
      if(!vt||!pan||!sun)return;
      var convertible=vt.value==='sportCanvas';
      var panField=pan.closest('.field'),sunField=sun.closest('.field');
      if(panField)panField.style.display=convertible?'none':'';
      if(sunField)sunField.style.display=convertible?'none':'';
      if(convertible){pan.value='no';sun.value='no';}
    }catch(e){}
  }
  var tries=0;var timer=setInterval(function(){apply();hideConvertibleRoofOptions();hideRenderedRearDoors();if(++tries>120)clearInterval(timer);},250);
  document.addEventListener('change',function(){apply();hideConvertibleRoofOptions();hideRenderedRearDoors();},true);
  if(typeof MutationObserver!=='undefined') new MutationObserver(function(){ensureBriefCheck();hideRenderedRearDoors();hideConvertibleRoofOptions();}).observe(document.body,{childList:true,subtree:true});
})();
