(function(){
  function fix(){
    try{
      if(typeof S==='undefined'||!Array.isArray(S)) return;
      var inside=S.find(function(s){return s.name==='5. Inside the car';});
      if(!inside||!Array.isArray(inside.items)) return;
      inside.items.forEach(function(it){
        if(!it||!it[1]) return;
        if(/windows\s*&\s*switches/i.test(it[1])){
          it[1]='Windows & switches';
          if(/transmission|automatic|manual/i.test(it[2]||'')){
            it[2]='Operate the windows and switches throughout the vehicle. Check that they operate correctly, feel secure and show no obvious damage.';
          }
        }
      });
      if(typeof render==='function' && !window.__sl4uWindowsFixed){window.__sl4uWindowsFixed=true;render();}
    }catch(e){}
  }
  setInterval(fix,250);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
})();
