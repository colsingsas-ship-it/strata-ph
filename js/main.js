/* =========================
   MAIN.JS — STRATA PH
   Observers, contadores, slider con touch
========================= */

document.documentElement.classList.add("js");

/* ══════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════ */
const header = document.getElementById("siteHeader");

function handleScrollHeader() {
  if (!header) return;
  if (window.scrollY > 5) {
    header.classList.add("is-scrolled");
    header.classList.remove("is-hero");
  } else {
    header.classList.remove("is-scrolled");
    header.classList.add("is-hero");
  }
}
window.addEventListener("scroll", handleScrollHeader, { passive: true });
handleScrollHeader();

/* ══════════════════════════════════════
   OBSERVERS DE ANIMACIÓN
   Sin unobserve — los efectos se repiten
   cada vez que el elemento entra en pantalla
══════════════════════════════════════ */
function createRevealObserver(selector, options = {}) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          /* Quita la clase al salir — permite que el efecto
             se repita cuando el usuario regrese a la sección */
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: options.threshold || 0.15,
      rootMargin: options.rootMargin || "0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* Sección 2 — zoom imagen */
createRevealObserver(".reveal-zoom", { threshold: 0.20 });

/* Sección 2.1 — team fotos suben */
createRevealObserver(".reveal-up", { threshold: 0.15 });

/* Sección 3.1 — imagen entra desde izquierda */
createRevealObserver(".reveal-left", { threshold: 0.15 });

/* Sección 3.1 — why-items con líneas */
createRevealObserver(".why-item", { threshold: 0.18 });

/* ══════════════════════════════════════
   CONTADORES STATS
══════════════════════════════════════ */
const counters    = document.querySelectorAll(".counter");
const statsSection = document.getElementById("section-2-2");
let countersRun   = false;

if (statsSection && counters.length) {
  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !countersRun) {
        countersRun = true;
        counters.forEach((counter) => {
          const target   = Number(counter.dataset.target);
          const duration = 1600;
          const startTime = performance.now();
          function update(now) {
            const p = Math.min((now - startTime) / duration, 1);
            counter.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(update);
            else counter.textContent = target;
          }
          requestAnimationFrame(update);
        });
      }
      if (!entry.isIntersecting) countersRun = false;
    },
    { threshold: 0.35 }
  );
  statsObserver.observe(statsSection);
}

/* ══════════════════════════════════════
   SLIDER DE OBRAS — con touch/swipe
══════════════════════════════════════ */
const workSlider = document.getElementById("workSlider");
const workTrack  = document.querySelector(".work-track");
const workCards  = document.querySelectorAll(".work-card");
const workPrev   = document.querySelector(".work-prev");
const workNext   = document.querySelector(".work-next");
const dotsWrap   = document.getElementById("workDots");

let currentIdx = 0;

function getStep() {
  if (!workCards.length) return 0;
  const gap = parseFloat(getComputedStyle(workTrack).gap) || 0;
  return workCards[0].getBoundingClientRect().width + gap;
}

function getMax() {
  if (!workSlider || !workTrack) return 0;
  const step = getStep();
  if (!step) return 0;
  return Math.max(0, Math.ceil(
    (workTrack.scrollWidth - workSlider.getBoundingClientRect().width) / step
  ));
}

function goTo(idx) {
  currentIdx = Math.max(0, Math.min(idx, getMax()));
  workTrack.style.transform = `translateX(-${currentIdx * getStep()}px)`;
  updateDots();
}

function updateDots() {
  if (!dotsWrap) return;
  dotsWrap.querySelectorAll(".work-dot").forEach((d, i) => {
    d.classList.toggle("is-active", i === currentIdx);
  });
}

if (workTrack && workPrev && workNext) {
  workNext.addEventListener("click", () => goTo(currentIdx + 1));
  workPrev.addEventListener("click", () => goTo(currentIdx - 1));
  window.addEventListener("resize", () => goTo(currentIdx));
  updateDots();
}

/* Touch / swipe en móvil */
if (workSlider) {
  let startX = 0, startY = 0, isDragging = false;

  workSlider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  workSlider.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    /* Solo activa si el movimiento es más horizontal que vertical
       y supera 40px de umbral */
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
    }
  }, { passive: true });

  workSlider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);
    /* Si el movimiento es predominantemente horizontal, previene scroll */
    if (dx > dy) e.preventDefault();
  }, { passive: false });
}
