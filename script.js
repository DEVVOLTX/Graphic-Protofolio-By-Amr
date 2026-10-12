// ===============================
// SELECTORS - تجميع العناصر
// ===============================
const links = [...document.querySelectorAll('.side a[data-t]')]; // روابط القائمة
const panels = [...document.querySelectorAll('.panel')]; // كل الأقسام
const ids = panels.map(p => p.id); // ['main','about','logo'...]

// ===============================
// SHOW - دالة عرض قسم معين
// ===============================
function show(id, push = true){
  // لو ال id مش موجود، هات اخر قسم زاره المستخدم
  if(!ids.includes(id)) id = localStorage.getItem('lastPanel') || ids[0];

  // إظهار القسم المطلوب وإخفاء الباقي
  panels.forEach(p => p.classList.toggle('active', p.id === id));

  // تلوين اللينك النشط
  links.forEach(a => a.classList.toggle('active', a.dataset.t === id));

  // تصفير السكرول
  const el = document.getElementById(id);
  if(el) el.scrollTop = 0;

  // حفظ في الذاكرة
  localStorage.setItem('lastPanel', id);

  // تحديث الرابط #main #logo...
  if(push && location.hash!== '#'+id){
    history.replaceState(null,'','#'+id);
  }
}

// ===============================
// EVENTS - الأحداث
// ===============================
// 1- كليك على القائمة
links.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault(); // منع القفز الافتراضي
    show(a.dataset.t); // اعرض القسم
  });
});

// 2- تنقل بالكيبورد (أسهم)
document.addEventListener('keydown', e=>{
  const cur = ids.indexOf(document.querySelector('.panel.active').id);
  if(e.key==='ArrowDown'||e.key==='ArrowRight'){
    show(ids[Math.min(cur+1, ids.length-1)]); // التالي
  }
  if(e.key==='ArrowUp'||e.key==='ArrowLeft'){
    show(ids[Math.max(cur-1, 0)]); // السابق
  }
});

// 3- سحب في الموبايل
let startX = 0;
document.addEventListener('touchstart', e=> startX = e.touches[0].clientX, {passive:true});
document.addEventListener('touchend', e=>{
  const diff = e.changedTouches[0].clientX - startX;
  if(Math.abs(diff) < 60) return; // سحبة قصيرة = تجاهل
  const cur = ids.indexOf(document.querySelector('.panel.active').id);
  if(diff < 0) show(ids[Math.min(cur+1, ids.length-1)]); // شمال = التالي
  else show(ids[Math.max(cur-1, 0)]); // يمين = السابق
});

// ===============================
// INIT - التشغيل الأول
// ===============================
window.addEventListener('hashchange', ()=> show(location.hash.slice(1), false));
show(location.hash.slice(1) || ids[0], false); // اعرض القسم من الرابط
