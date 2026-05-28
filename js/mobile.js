/* =========================
   MOBILE.JS
   Preloader + Hamburguesa + Back-to-top
========================= */

(function () {

  /* ── PRELOADER ───────────────────────────────── */
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloaderBar');

  if (preloader && bar) {
    let progress = 0;
    const interval = setInterval(function () {
      // Avanza rápido al 80%, luego espera a que cargue el resto
      const step = progress < 80 ? Math.random() * 12 + 4 : Math.random() * 2;
      progress = Math.min(progress + step, 95);
      bar.style.width = progress + '%';
    }, 120);

    function done() {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(function () {
        preloader.classList.add('is-done');
        // Limpia del DOM después de la transición
        setTimeout(function () {
          preloader.remove();
        }, 600);
      }, 300);
    }

    // Espera a que todo cargue
    if (document.readyState === 'complete') {
      done();
    } else {
      window.addEventListener('load', done);
      // Máximo 4s por si algún recurso falla
      setTimeout(done, 4000);
    }
  }

  /* ── HEADER MÓVIL SCROLL ────────────────────── */
  const mobileHeader = document.getElementById('siteHeaderMobile');
  if (mobileHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 5) {
        mobileHeader.classList.add('is-scrolled');
        mobileHeader.classList.remove('is-hero');
      } else {
        mobileHeader.classList.remove('is-scrolled');
        mobileHeader.classList.add('is-hero');
      }
    }, { passive: true });
  }

  /* ── HAMBURGUESA ─────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const open = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ── BACK TO TOP ─────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
