// Panel navigation: sidebar links, URL hash, and arrow keys.
const links  = [...document.querySelectorAll('.side a')];
const panels = [...document.querySelectorAll('.panel')];
const ids    = panels.map(p => p.id);

function show(id, push = true) {
  if (!ids.includes(id)) id = ids[0];
  panels.forEach(p => p.classList.toggle('active', p.id === id));
  links.forEach(a => a.classList.toggle('active', a.dataset.t === id));
  document.getElementById(id).scrollTop = 0;
  if (push && location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
}

links.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  show(a.dataset.t);
}));

document.addEventListener('keydown', e => {
  const cur = ids.indexOf(document.querySelector('.panel.active').id);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') show(ids[Math.min(cur + 1, ids.length - 1)]);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  show(ids[Math.max(cur - 1, 0)]);
});

window.addEventListener('hashchange', () => show(location.hash.slice(1), false));
show(location.hash.slice(1) || ids[0], false);
