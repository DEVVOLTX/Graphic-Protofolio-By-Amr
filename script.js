// Wolf Brand - Tab System
const links = document.querySelectorAll('.side a[data-t]');
const panels = document.querySelectorAll('.panel');

function show(id){
  panels.forEach(p=>p.classList.toggle('active', p.id===id));
  links.forEach(a=>a.classList.toggle('active', a.dataset.t===id));
  history.replaceState(null,'','#'+id);
}

links.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const t = a.dataset.t;
    if(t) show(t);
  });
});

// Load from hash
const hash = location.hash.replace('#','');
if(hash && document.getElementById(hash)) show(hash);
else show('main');
