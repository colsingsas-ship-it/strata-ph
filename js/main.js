document.documentElement.classList.add("js");

/* =========================
   NAVBAR SCROLL
   Cambia la navbar a negra cuando el usuario baja más de 5px
========================= */

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


/* =========================
   OBSERVER GLOBAL PARA ANIMACIONES
   Activa clases .is-visible cuando los elementos entran en pantalla
========================= */

function createRevealObserver(selector, options = {}) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: options.threshold || 0.18,
      rootMargin: options.rootMargin || "0px 0px -8% 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));
}

/* Sección 2 / The Studio: zoom de imagen */
createRevealObserver(".reveal-zoom", {
  threshold: 0.25
});

/* Sección 2.1 / The Team: imágenes suben */
createRevealObserver(".reveal-up", {
  threshold: 0.18
});

/* Sección 3.1 / Why Us: imagen entra desde izquierda */
createRevealObserver(".reveal-left", {
  threshold: 0.18
});

/* Sección 3.1 / Why Us: líneas internas */
createRevealObserver(".why-item", {
  threshold: 0.22
});


/* =========================
   SECCIÓN 2.2 - COUNTERS
   Animación de contadores cuando la sección entra en pantalla
========================= */

const counters = document.querySelectorAll(".counter");
const statsSection = document.getElementById("section-2-2");

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easedProgress * target);

    counter.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

if (statsSection && counters.length) {
  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        counters.forEach((counter) => animateCounter(counter));
        statsObserver.unobserve(statsSection);
      }
    },
    {
      threshold: 0.35
    }
  );

  statsObserver.observe(statsSection);
}


/* =========================
   SECCIÓN 4 - WORK SLIDER
   Slider de 8 imágenes.
   Se mueve un slide por clic.
   No tiene auto-scroll.
========================= */

const workSlider = document.getElementById("workSlider");
const workTrack = document.querySelector(".work-track");
const workCards = document.querySelectorAll(".work-card");
const workPrev = document.querySelector(".work-prev");
const workNext = document.querySelector(".work-next");

let currentWorkIndex = 0;

function getWorkStep() {
  if (!workCards.length || !workTrack) return 0;

  const cardWidth = workCards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(workTrack).gap) || 0;

  return cardWidth + gap;
}

function getMaxWorkIndex() {
  if (!workSlider || !workTrack || !workCards.length) return 0;

  const sliderWidth = workSlider.getBoundingClientRect().width;
  const trackWidth = workTrack.scrollWidth;
  const step = getWorkStep();

  if (!step) return 0;

  return Math.max(0, Math.ceil((trackWidth - sliderWidth) / step));
}

function updateWorkSlider() {
  if (!workTrack) return;

  const step = getWorkStep();
  const maxIndex = getMaxWorkIndex();

  currentWorkIndex = Math.max(0, Math.min(currentWorkIndex, maxIndex));

  workTrack.style.transform = `translateX(-${currentWorkIndex * step}px)`;
}

if (workPrev && workNext && workTrack) {
  workNext.addEventListener("click", () => {
    currentWorkIndex += 1;
    updateWorkSlider();
  });

  workPrev.addEventListener("click", () => {
    currentWorkIndex -= 1;
    updateWorkSlider();
  });

  window.addEventListener("resize", updateWorkSlider);
  updateWorkSlider();
}