(function(){
  var cfg=window.__OFFER__||{products:{}};
  var hidden=document.getElementById('f-batterij');
  var note=document.getElementById('f-opm')||document.getElementById('form-field-opmerking');
  var lastAuto='';
  function expired(){return document.documentElement.getAttribute('data-offer')==='expired';}
  // gekozen batterij: verborgen veld + voorinvullen van de opmerking (alleen als de bezoeker daar zelf niets in typde)
  function choose(id){
    var p=cfg.products[id]; if(!p) return;
    if(hidden) hidden.value=id;
    if(note && (!note.value || note.value===lastAuto)){
      lastAuto=expired()?'':cfg.note.replace('{name}',p.name).replace('{price}',p.price);
      note.value=lastAuto;
      note.dispatchEvent(new Event('input',{bubbles:true}));
    }
  }
  function toForm(){
    var f=document.getElementById('formulier');
    if(f) f.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(function(){var n=document.getElementById('f-naam')||document.getElementById('form-field-naam');if(n)n.focus({preventScroll:true});},700);
  }
  document.querySelectorAll('[data-battery]').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();choose(a.getAttribute('data-battery'));toForm();});
  });
  // ?batterij=anker of ?batterij=alpha kiest de batterij vooraf
  try{var q=new URLSearchParams(location.search).get('batterij'); if(q) choose(q);}catch(e){}
  // postcodeveld in de hero: waarde meenemen naar het formulier en daarheen springen
  var pcForm=document.querySelector('[data-lp-pc]');
  if(pcForm) pcForm.addEventListener('submit',function(e){
    e.preventDefault();
    var v=(document.getElementById('lp-pc')||{}).value||'';
    var pc=document.getElementById('f-pc')||document.getElementById('form-field-postcode');
    if(pc && v && !pc.value){pc.value=v;pc.dispatchEvent(new Event('input',{bubbles:true}));}
    toForm();
  });
  var form=document.getElementById('lform');
  if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    // preview: er wordt niets verstuurd. Live verstuurt het Elementor-formulier en stuurt door naar /bedankt/.
    location.href=cfg.preview?'/bedankt/?test=1':'/bedankt/';
  });
})();
