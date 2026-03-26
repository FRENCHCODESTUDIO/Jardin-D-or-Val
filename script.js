/* ============================================================
   LES JARDINS D'OR VAL — Script centralisé
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── BURGER MENU ── */
  const burger   = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    function closeMenu() {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
    });
  }

  /* ── SCROLL NAV ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 60 ? 'rgba(26,31,27,0.99)' : '';
    }, { passive: true });
  }

  /* ── LIGHTBOX ── */
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <button id="lb-close" aria-label="Fermer">&times;</button>
    <button id="lb-prev" aria-label="Photo précédente">&#8592;</button>
    <button id="lb-next" aria-label="Photo suivante">&#8594;</button>
    <div id="lb-img-wrap"><img id="lb-img" src="" alt="" /></div>
    <div id="lb-caption"></div>
  `;
  document.body.appendChild(lb);

  let lbImages = [], lbIndex = 0;

  function openLightbox(idx) {
    lbIndex = idx;
    const img = lbImages[lbIndex];
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-img').alt = img.alt;
    document.getElementById('lb-caption').textContent = img.alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function collectLightboxImages() {
    lbImages = Array.from(document.querySelectorAll('[data-lightbox]'));
    lbImages.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(i));
    });
  }
  collectLightboxImages();

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; openLightbox(lbIndex); });
  document.getElementById('lb-next').addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbImages.length; openLightbox(lbIndex); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; openLightbox(lbIndex); }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; openLightbox(lbIndex); }
  });

  new MutationObserver(() => collectLightboxImages()).observe(document.body, { childList: true, subtree: true });

});

/* ── FORMULAIRE CONTACT ── */
window.goStep = function(targetStep) {
  const panels = document.querySelectorAll('.step-panel');
  const dots   = [document.getElementById('dot1'), document.getElementById('dot2'), document.getElementById('dot3')].filter(Boolean);
  panels.forEach((p, i) => p.classList.toggle('active', i + 1 === targetStep));
  dots.forEach((d, i) => {
    d.classList.toggle('active', i + 1 === targetStep);
    d.classList.toggle('done', i + 1 < targetStep);
    d.removeAttribute('aria-current');
    if (i + 1 === targetStep) d.setAttribute('aria-current', 'step');
  });
  const form = document.querySelector('.contact-form-wrap');
  if (form) window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
};

window.selectBudget = function(btn) {
  document.querySelectorAll('.budget-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
};

window.collectAndSubmit = function() {
  const errDiv = document.getElementById('form-error');
  if (errDiv) errDiv.style.display = 'none';
  const required = document.querySelectorAll('#step3 [required]');
  let ok = true, firstBad = null;
  required.forEach(inp => {
    if (!inp.value.trim()) { inp.classList.add('error'); inp.style.borderColor = '#c0392b'; ok = false; if (!firstBad) firstBad = inp; }
    else { inp.classList.remove('error'); inp.style.borderColor = ''; }
  });
  if (!ok) {
    if (errDiv) { errDiv.textContent = 'Merci de remplir tous les champs obligatoires (*).'; errDiv.style.display = 'block'; }
    if (firstBad) firstBad.focus();
    return false;
  }
  const services = Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value).join(', ');
  const hidS = document.getElementById('hidden-services'); if (hidS) hidS.value = services || 'Non précisé';
  const budgetBtn = document.querySelector('.budget-opt.selected');
  const hidB = document.getElementById('hidden-budget'); if (hidB) hidB.value = budgetBtn ? budgetBtn.dataset.value : 'Non précisé';
  return true;
};

/* ── FILTRES GALERIE ── */
window.filterGalerie = function(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('.galerie-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
};
