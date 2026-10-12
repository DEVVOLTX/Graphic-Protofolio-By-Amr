// AET Designs — vanilla JS: header, filters, reveal, lightbox
document.documentElement.classList.add('js');
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pieces = $$('.piece');

/* header turns solid after the hero + active link */
const bar = $('#top');
addEventListener('scroll', () => bar.classList.toggle('solid', scrollY > 60), {passive: true});
bar.classList.toggle('solid', scrollY > 60);
const navLinks = $$('.top nav a[href^="#"]');
const so = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), {rootMargin: '-45% 0px -50% 0px'});
$$('section[id]').forEach(s => so.observe(s));

/* counts (from the page itself) */
const count = k => pieces.filter(p => p.dataset.cat === k).length;
$('#c-all').textContent = pieces.length;
['logos', 'cars', 'clients'].forEach(k => { $('#c-' + k).textContent = count(k); });
$$('[data-count]').forEach(el => {
  const n = count(el.dataset.count);
  if (reduce) return void (el.textContent = n);
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; io.disconnect();
    let i = 0; const iv = setInterval(() => { el.textContent = ++i; if (i >= n) clearInterval(iv); }, 110);
  }); io.observe(el);
});

/* reveal on scroll (with a safety net so nothing stays hidden) */
const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), {threshold: .05});
pieces.forEach(p => ro.observe(p));
setTimeout(() => pieces.forEach(p => { if (p.getBoundingClientRect().top < innerHeight) p.classList.add('in'); }), 1200);

/* filters */
$$('.filters button').forEach(b => b.addEventListener('click', () => {
  $$('.filters button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
  pieces.forEach(p => {
    const show = b.dataset.f === 'all' || p.dataset.cat === b.dataset.f;
    p.hidden = !show;
    if (show) requestAnimationFrame(() => p.classList.add('in'));
  });
}));

/* lightbox (navigates only through what the current filter shows) */
const lb = $('#lb'), lbImg = $('img', lb), lbCap = $('figcaption', lb);
let list = [], idx = 0, opener = null;
const visible = () => pieces.filter(p => !p.hidden);
const render = () => {
  const p = list[idx], im = $('img', p);
  lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt;
  lbCap.textContent = p.dataset.title.toUpperCase();
};
const openLb = p => { list = visible(); idx = list.indexOf(p); opener = document.activeElement; render(); lb.hidden = false; document.body.classList.add('lb-open'); $('.lb-x', lb).focus(); };
const closeLb = () => { lb.hidden = true; document.body.classList.remove('lb-open'); opener && opener.focus(); };
const move = d => { idx = (idx + d + list.length) % list.length; render(); };
pieces.forEach(p => {
  p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-label', 'Open ' + p.dataset.title);
  p.addEventListener('click', () => openLb(p));
  p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(p); } });
});
lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-x')) closeLb(); });
$('.lb-prev', lb).addEventListener('click', () => move(-1));
$('.lb-next', lb).addEventListener('click', () => move(1));
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') move(1);
  if (e.key === 'ArrowLeft') move(-1);
});
let sx = 0;
lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive: true});
lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1); }, {passive: true});

/* copy email */
$('#copyEmail').addEventListener('click', async () => {
  const t = $('#toast');
  try { await navigator.clipboard.writeText('amrt6509@gmail.com'); t.textContent = 'EMAIL COPIED'; }
  catch (e) { t.textContent = 'amrt6509@gmail.com'; }
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2000);
});
