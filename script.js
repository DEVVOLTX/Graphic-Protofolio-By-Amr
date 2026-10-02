// ── NAV DOTS ──
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.nav-dot');

function scrollToSlide(i){
  slides[i].scrollIntoView({behavior:'smooth'});
}

const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const i = [...slides].indexOf(e.target);
      dots.forEach(d=>d.classList.remove('active'));
      if(dots[i]) dots[i].classList.add('active');
    }
  });
},{threshold:.5});

slides.forEach(s=>obs.observe(s));

// ── KEYBOARD NAV ──
document.addEventListener('keydown',e=>{
  const cur=[...slides].findIndex(s=>{
    const r=s.getBoundingClientRect();
    return r.top>=-50&&r.top<window.innerHeight/2;
  });
  if(e.key==='ArrowDown'&&cur<slides.length-1) scrollToSlide(cur+1);
  if(e.key==='ArrowUp'&&cur>0) scrollToSlide(cur-1);
});
