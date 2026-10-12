// =========================================
// SELECTORS - جمع العناصر
// =========================================
const links = [...document.querySelectorAll('.side a[data-t]')]; // لينكات القائمة
const panels = [...document.querySelectorAll('.panel')]; // كل الأقسام
const ids = panels.map(p => p.id); // اسماء الأقسام ['main','about',...]

// =========================================
// SHOW FUNCTION - عرض قسم معين
// =========================================
function show(id, push = true) {
  // لو ال id مش موجود، هات اخر قسم زرته من الذاكرة
  if (!ids.includes(id)) id = localStorage.getItem('lastPanel') || ids[0];

  // إظهار القسم المطلوب وإخفاء الباقي
  panels.forEach(p => p.classList.toggle('active', p.id === id));

  // تلوين اللينك النشط في القائمة
  links.forEach(a => a.classList.toggle('active', a.dataset.t === id));

  // تصفير السكرول فوق
  document.getElementById(id).scrollTop = 0;

  // حفظ اخر قسم في الذاكرة
  localStorage.setItem('lastPanel', id);

  // تحديث الرابط في المتصفح #main #about...
  if (push && location.hash!== '#' + id) {
    history.replaceState(null, '', '#' + id);
  }
}

// =========================================
// CLICK EVENTS - عند الضغط على القائمة
// =========================================
links.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault(); // منع القفز العادي
    show(a.dataset.t); // اعرض القسم
  });
});

// =========================================
// KEYBOARD NAVIGATION - التنقل بالأسهم
// =========================================
document.addEventListener('keydown', e => {
  const cur = ids.indexOf(document.querySelector('.panel.active').id);
  // سهم تحت / يمين = القسم التالي
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    show(ids[Math.min(cur + 1, ids.length - 1)]);
  }
  // سهم فوق / شمال = القسم السابق
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    show(ids[Math.max(cur - 1, 0)]);
  }
});

// =========================================
// SWIPE FOR MOBILE - سحب على الموبايل
// =========================================
let startX = 0;
document.addEventListener('touchstart', e => startX = e.touches[0].clientX);
document.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) < 60) return; // لو السحبة صغيرة تجاهلها
  const cur = ids.indexOf(document.querySelector('.panel.active').id);
  if (diff < 0) show(ids[Math.min(cur + 1, ids.length - 1)]); // سحب شمال = التالي
  else show(ids[Math.max(cur - 1, 0)]); // سحب يمين = السابق
});

// =========================================
// INIT - التشغيل الأول
// =========================================
window.addEventListener('hashchange', () => show(location.hash.slice(1), false));
show(location.hash.slice(1) || ids[0], false); // اعرض القسم من الرابط أو اول قسم
