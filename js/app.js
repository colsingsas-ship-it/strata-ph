/* =========================
   STRATA PH — app.js
   Toda la lógica de la web en un solo archivo cacheado
========================= */

/* ── Ruta base de assets ── */
const ASSETS = '/assets';   /* ← cambiar si el dominio tiene subcarpeta */

/* ══════════════════════════════════════════════════
   1. NAVBAR SCROLL
══════════════════════════════════════════════════ */
const header = document.getElementById('siteHeader');
function handleScrollHeader() {
  if (!header) return;
  const scrolled = window.scrollY > 5;
  header.classList.toggle('is-scrolled', scrolled);
  header.classList.toggle('is-hero', !scrolled);
}
window.addEventListener('scroll', handleScrollHeader, { passive: true });
handleScrollHeader();

/* ══════════════════════════════════════════════════
   2. MENÚ HAMBURGUESA
══════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

function closeMobileNav() {
  hamburger?.classList.remove('is-open');
  mobileNav?.classList.remove('is-open');
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  hamburger.setAttribute('aria-expanded', open);
});

mobileLinks.forEach(a => a.addEventListener('click', closeMobileNav));

/* ══════════════════════════════════════════════════
   3. BACK TO TOP
══════════════════════════════════════════════════ */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════════════
   4. OBSERVERS DE ANIMACIÓN
══════════════════════════════════════════════════ */
function observe(selector, threshold, rootMargin) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: threshold || 0.12, rootMargin: rootMargin || '0px' });
  els.forEach(el => obs.observe(el));
}

observe('.reveal-zoom',  0.25);
observe('.reveal-up',   0.18);
observe('.reveal-left', 0.18);
observe('.why-item',    0.22);
observe('.reveal-service',      0.06);
observe('.reveal-curtain-left', 0.05);
observe('.reveal-fade-up',      0.10);

/* ══════════════════════════════════════════════════
   5. CONTADORES STATS
══════════════════════════════════════════════════ */
const counters    = document.querySelectorAll('.counter');
const statsSection = document.getElementById('section-2-2');
if (statsSection && counters.length) {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    counters.forEach(counter => {
      const target = Number(counter.dataset.target);
      const start  = performance.now();
      const dur    = 1600;
      (function update(now) {
        const p = Math.min((now - start) / dur, 1);
        counter.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      })(start);
    });
    statsSection._obs?.unobserve(statsSection);
  }, { threshold: 0.35 }).observe(statsSection);
}

/* ══════════════════════════════════════════════════
   6. SLIDER DE OBRAS
══════════════════════════════════════════════════ */
const workSlider = document.getElementById('workSlider');
const workTrack  = document.querySelector('.work-track');
const workCards  = document.querySelectorAll('.work-card');
const workPrev   = document.querySelector('.work-prev');
const workNext   = document.querySelector('.work-next');
const dotsEl     = document.getElementById('workDots');
const dots       = dotsEl ? Array.from(dotsEl.querySelectorAll('.work-dot')) : [];
let currentWork  = 0;

function getStep() {
  if (!workCards.length) return 0;
  return workCards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(workTrack).gap) || 0);
}
function getMax() {
  if (!workSlider || !workTrack) return 0;
  const step = getStep();
  return step ? Math.max(0, Math.ceil((workTrack.scrollWidth - workSlider.getBoundingClientRect().width) / step)) : 0;
}
function updateSlider() {
  if (!workTrack) return;
  currentWork = Math.max(0, Math.min(currentWork, getMax()));
  workTrack.style.transform = `translateX(-${currentWork * getStep()}px)`;
}
function syncDots() {
  const m = workTrack?.style.transform?.match(/translateX\(-?(\d+\.?\d*)px\)/);
  if (!m) return dots.forEach((d,i) => d.classList.toggle('is-active', i === 0));
  const step = getStep();
  const idx  = step > 0 ? Math.round(parseFloat(m[1]) / step) : 0;
  dots.forEach((d,i) => d.classList.toggle('is-active', i === idx));
}
if (workPrev && workNext && workTrack) {
  workNext.addEventListener('click', () => { currentWork++; updateSlider(); });
  workPrev.addEventListener('click', () => { currentWork--; updateSlider(); });
  window.addEventListener('resize', updateSlider);
  new MutationObserver(syncDots).observe(workTrack, { attributes: true, attributeFilter: ['style'] });
  updateSlider();
}

/* Touch swipe */
if (workSlider) {
  let tx = 0, ty = 0;
  workSlider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  workSlider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 40) return;
    dx < 0 ? workNext?.click() : workPrev?.click();
  }, { passive: true });
}

/* ══════════════════════════════════════════════════
   7. NAV ACTIVA POR SECCIÓN
══════════════════════════════════════════════════ */
const SECTION_MAP = {
  'home': '#home', 'about': '#about',
  'section-2-1': '#about', 'section-2-2': '#about',
  'section-3': '#section-3', 'section-3-1': '#section-3',
  'section-4': '#section-4', 'section-5': '#section-4',
  'contacts': '#contacts'
};
const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');
function setActive(href) {
  navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === href));
}
const visible = {};
new IntersectionObserver((entries) => {
  entries.forEach(e => { visible[e.target.id] = e.intersectionRatio; });
  let bestId = null, bestRatio = 0;
  Object.entries(visible).forEach(([id, r]) => { if (r > bestRatio) { bestRatio = r; bestId = id; } });
  if (bestId && SECTION_MAP[bestId]) setActive(SECTION_MAP[bestId]);
}, {
  threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
  rootMargin: '-66px 0px 0px 0px'
}).observe && Object.keys(SECTION_MAP).forEach(id => {
  const el = document.getElementById(id);
  if (el) new IntersectionObserver((entries) => {
    entries.forEach(e => { visible[e.target.id] = e.intersectionRatio; });
    let best = null, br = 0;
    Object.entries(visible).forEach(([id, r]) => { if (r > br) { br = r; best = id; } });
    if (best && SECTION_MAP[best]) setActive(SECTION_MAP[best]);
  }, { threshold: Array.from({length:21},(_,i)=>i*0.05), rootMargin:'-66px 0px 0px 0px' }).observe(el);
});
setActive('#home');

/* ══════════════════════════════════════════════════
   8. CHAT FAB
══════════════════════════════════════════════════ */
const chatFab     = document.getElementById('chatFab');
const chatPanel   = document.getElementById('chatPanel');
const chatClose   = document.getElementById('chatClose');
const chatForm    = document.getElementById('chatForm');
const chatSuccess = document.getElementById('chatSuccess');

if (chatFab && chatPanel) {
  chatFab.addEventListener('click', () => {
    const open = chatPanel.classList.toggle('is-open');
    chatFab.classList.toggle('is-active', open);
    chatFab.setAttribute('aria-expanded', open);
    if (open) chatPanel.querySelector('input')?.focus();
  });
  chatClose?.addEventListener('click', () => {
    chatPanel.classList.remove('is-open');
    chatFab.classList.remove('is-active');
  });
  document.addEventListener('click', e => {
    if (!chatPanel.contains(e.target) && e.target !== chatFab) {
      chatPanel.classList.remove('is-open');
      chatFab.classList.remove('is-active');
    }
  });
  chatForm?.addEventListener('submit', e => {
    e.preventDefault();
    chatForm.hidden = true;
    if (chatSuccess) chatSuccess.hidden = false;
    setTimeout(() => {
      chatPanel.classList.remove('is-open');
      chatFab.classList.remove('is-active');
      setTimeout(() => { chatForm.hidden = false; if(chatSuccess) chatSuccess.hidden=true; chatForm.reset(); }, 500);
    }, 3000);
  });
}

/* ══════════════════════════════════════════════════
   9. VALIDACIÓN FORMULARIO CONTACTO
══════════════════════════════════════════════════ */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('blur',  () => input.classList.toggle('is-error', !input.validity.valid));
    input.addEventListener('input', () => { if (input.validity.valid) input.classList.remove('is-error'); });
  });
  contactForm.addEventListener('submit', e => {
    let err = false;
    inputs.forEach(input => { if (!input.validity.valid) { input.classList.add('is-error'); if (!err) { input.focus(); err = true; } } });
    if (err) e.preventDefault();
  });
}

/* ══════════════════════════════════════════════════
   10. SELECTOR DE IDIOMA
══════════════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    'title': 'STRATA PH · Professional HOA Management',
    '.hero-eyebrow': 'Professional HOA Management · Colombia',
    '.hero-content h1': 'Your building deserves<br />management without secrets',
    '.hero-content .btn-primary': 'Request Management Audit →',
    '.feature:nth-child(1) h4': 'Transparent Management',
    '.feature:nth-child(1) p': "Every peso received and every expense executed, documented and available to the Board in real time. No surprises, no fine print.",
    '.feature:nth-child(2) h4': '24/7 Response',
    '.feature:nth-child(2) p': "Emergencies handled at any hour. Because a building's problems don't wait for the next business day.",
    '.feature:nth-child(3) h4': 'Protected Patrimony',
    '.feature:nth-child(3) p': "Rigorous management doesn't just sustain your property — it increases its value. That is our only success metric.",
    '.about-text .section-tag': 'Who We Are',
    '.about-text h2': 'We end opaque<br />management. For good.',
    '.about-text p': 'We are a team specialized in HOA management that understands the frustration of Boards of Directors: confusing reports, untraceable payments, unsupervised contractors. <strong>We operate differently</strong> — with auditable processes, technology and an unwavering commitment to transparency.',
    '.about-text .btn-primary': 'Request Personalized Proposal →',
    '.team-copy .section-tag': 'The Team',
    '.team-copy h2': 'Experts who respond.<br />Professionals who are accountable.',
    '.team-copy p': 'Our team combines expertise in real estate management, accounting and conflict resolution. We are not intermediaries — we are strategic allies of the Board of Directors.',
    '.team-copy .btn-primary': 'Meet the Team →',
    '.stats-eyebrow': 'The numbers back what we promise. Verify them yourself.',
    '.stats-content h2': 'Results your<br />Board can audit',
    '.stat-item:nth-child(1) p': 'Communities Managed',
    '.stat-item:nth-child(2) p': 'Satisfaction Index',
    '.stat-item:nth-child(3) p': 'Max Response Time',
    '.services-pin-left .section-tag': 'Our Services',
    '.services-pin-left h2': 'Real solutions for<br />your community',
    '.services-pin-left p': 'We design every process to eliminate the most common friction points: lack of information, reactive maintenance and unresolved conflicts.',
    '.services-pin-left .btn-primary': 'Request Management Audit →',
    '.services-pin-card:nth-child(1) h3': 'Bulletproof Financial Management',
    '.services-pin-card:nth-child(2) h3': 'Maintenance with Rigorous Oversight',
    '.services-pin-card:nth-child(3) h3': 'Community & Conflict Resolution',
    '.services-pin-card:nth-child(4) h3': 'Emergency Response 24/7',
    '.why-item:nth-child(1) h3': 'Total<br />Transparency',
    '.why-item:nth-child(2) h3': 'No Conflicts<br />of Interest',
    '.why-item:nth-child(3) h3': 'Applied<br />Technology',
    '.why-item:nth-child(4) h3': 'Permanent<br />Legal Backing',
    '.work-header .section-tag': 'Success Cases',
    '.work-header h2': 'Communities we transformed.<br />Boards that breathe easy.',
    '.purpose-content h2': 'Where management<br />becomes peace of mind',
    '.contact-header .section-tag': 'Contact',
    '.contact-header h2': "Let's talk about your building.<br />No cost, no commitment.",
    '.contact-form .form-button': 'Request Management Audit',
    '.footer-copy': 'STRATA PH · Professional HOA Management © 2026'
  }
};

const ORIGINALS = {};
let currentLang = localStorage.getItem('ph-lang') || 'es';

function captureOriginals() {
  Object.keys(TRANSLATIONS.en).forEach(sel => {
    if (sel === 'title') { ORIGINALS[sel] = document.title; return; }
    const el = document.querySelector(sel);
    if (el) ORIGINALS[sel] = el.innerHTML;
  });
}

function applyLang(lang) {
  const dict = lang === 'es' ? ORIGINALS : TRANSLATIONS.en;
  Object.entries(dict).forEach(([sel, val]) => {
    if (sel === 'title') { document.title = val; return; }
    const el = document.querySelector(sel);
    if (el) el.innerHTML = val;
  });
  const navL = { es:['Inicio','Quiénes Somos','Servicios','Casos de Éxito','Contacto','Blog'], en:['Home','Who We Are','Services','Success Cases','Contact','Blog'] };
  document.querySelectorAll('.main-nav a, .mobile-nav a[data-nav]').forEach((a,i) => { if(navL[lang][i]) a.textContent = navL[lang][i]; });
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  const pills = {
    es:['Cuentas Claras','Respuesta 24/7','Sin Letra Pequeña','Equipo Certificado','Cuentas Claras','Respuesta 24/7','Sin Letra Pequeña','Equipo Certificado','Reportes Mensuales','Proveedores Auditados','Mediación Experta','Valorización Real','Reportes Mensuales','Proveedores Auditados','Mediación Experta','Valorización Real'],
    en:['Clear Accounts','24/7 Response','No Fine Print','Certified Team','Clear Accounts','24/7 Response','No Fine Print','Certified Team','Monthly Reports','Audited Vendors','Expert Mediation','Real Value Growth','Monthly Reports','Audited Vendors','Expert Mediation','Real Value Growth']
  };
  document.querySelectorAll('.why-pills-track span').forEach((sp,i) => { if(pills[lang][i]) sp.textContent = pills[lang][i]; });
}

function updateLangUI(lang) {
  document.querySelectorAll('#langCurrent .lang-flag').forEach(f => { f.style.display = f.dataset.lang === lang ? '' : 'none'; });
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
    btn.setAttribute('aria-selected', btn.dataset.lang === lang);
  });
}

const langBtn      = document.getElementById('langCurrent');
const langDropdown = document.getElementById('langDropdown');
const langSwitcher = document.getElementById('langSwitcher');

langBtn?.addEventListener('click', () => {
  const open = langSwitcher.classList.toggle('is-open');
  langBtn.setAttribute('aria-expanded', open);
});
document.addEventListener('click', e => {
  if (langSwitcher && !langSwitcher.contains(e.target)) {
    langSwitcher.classList.remove('is-open');
    langBtn?.setAttribute('aria-expanded', false);
  }
});
document.querySelectorAll('.lang-option').forEach(opt => {
  opt.addEventListener('click', () => {
    currentLang = opt.dataset.lang;
    localStorage.setItem('ph-lang', currentLang);
    applyLang(currentLang);
    updateLangUI(currentLang);
    langSwitcher.classList.remove('is-open');
  });
});

captureOriginals();
if (currentLang !== 'es') applyLang(currentLang);
updateLangUI(currentLang);
