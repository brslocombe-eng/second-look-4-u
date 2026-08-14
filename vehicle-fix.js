(function(){
  function apply(){
    try{
      if(typeof S==='undefined'||!Array.isArray(S)) return;
      var isTwoDoor=typeof vehicle!=='undefined' && (vehicle.type==='sportHard'||vehicle.type==='sportCanvas');
      if(!isTwoDoor) return;
      var rear=S.find(function(x){return x.name==='2. Bodywork — rear';});
      if(rear){
        rear.items=rear.items.filter(function(i){return !/tailgate/i.test(i[1]||'');});
        rear.items=rear.items.filter(function(i){return !/rear door/i.test(i[1]||'');});
        var boot=rear.items.find(function(i){return /^Boot \/ tailgate$/i.test(i[1]||'');});
        if(boot) boot[1]='Boot';
      }
      ['2. Bodywork — driver\'s side','2. Bodywork — passenger side'].forEach(function(name){
        var sec=S.find(function(x){return x.name===name;});
        if(sec) sec.items=sec.items.filter(function(i){return !/rear door/i.test(i[1]||'');});
      });
      var roofSections=S.filter(function(x){return /roof/i.test(x.name);});
      if(roofSections.length===0){
        var driver=S.find(function(x){return x.name==="2. Bodywork — driver's side";});
        var passenger=S.find(function(x){return x.name==='2. Bodywork — passenger side';});
        var roofText='Physically inspect the roof all the way around. Check the roof surface, seals, frame and mechanism for damage, wear, corrosion, leaks or anything unusual. On a canvas convertible, inspect the fabric and folding mechanism. On a hardtop, inspect the roof panel and seals.';
        if(driver&&!driver.items.some(function(i){return i[0]==='roof_driver'})) driver.items.push(['roof_driver',isTwoDoor?'Roof — driver side':'Roof','While on the driver side, '+roofText]);
        if(passenger&&!passenger.items.some(function(i){return i[0]==='roof_passenger'})) passenger.items.push(['roof_passenger',isTwoDoor?'Roof — passenger side':'Roof','While on the passenger side, '+roofText]);
      }
      if(typeof render==='function'&&typeof screen!=='undefined'&&screen==='inspect') render();
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
  var tries=0;var timer=setInterval(function(){apply();hideConvertibleRoofOptions();if(++tries>40)clearInterval(timer);},250);
  document.addEventListener('change',hideConvertibleRoofOptions,true);
  if(typeof MutationObserver!=='undefined') new MutationObserver(function(){apply();hideConvertibleRoofOptions();}).observe(document.body,{childList:true,subtree:true});
})();
