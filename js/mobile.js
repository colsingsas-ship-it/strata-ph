/* =========================
   MOBILE.JS — STRATA PH
   Preloader, hamburguesa, back-to-top,
   header móvil scroll, lang móvil
========================= */
(function () {

  /* ── PRELOADER ───────────────────────────────── */
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloaderBar');

  if (preloader && bar) {
    let progress = 0;
    const interval = setInterval(function () {
      const step = progress < 80 ? Math.random() * 12 + 4 : Math.random() * 2;
      progress = Math.min(progress + step, 95);
      bar.style.width = progress + '%';
    }, 120);

    function done() {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(function () {
        preloader.classList.add('is-done');
        setTimeout(function () { preloader.remove(); }, 600);
      }, 300);
    }

    if (document.readyState === 'complete') {
      done();
    } else {
      window.addEventListener('load', done);
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

      /* Header se vuelve negro sólido al abrir menú
         para que la X sea visible sobre cualquier fondo */
      if (mobileHeader) {
        mobileHeader.classList.toggle('menu-open', open);
      }
    });

    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (mobileHeader) mobileHeader.classList.remove('menu-open');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (mobileHeader) mobileHeader.classList.remove('menu-open');
      }
    });
  }

  /* ── LANG SWITCHER MÓVIL ─────────────────────── */
  const langBtnMobile      = document.getElementById('langCurrentMobile');
  const langSwitcherMobile = document.getElementById('langSwitcherMobile');

  if (langBtnMobile && langSwitcherMobile) {

    langBtnMobile.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = langSwitcherMobile.classList.toggle('is-open');
      langBtnMobile.setAttribute('aria-expanded', open);
    });

    /* Al elegir idioma: aplica cambio y cierra dropdown */
    langSwitcherMobile.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        const lang = opt.dataset.lang;

        /* Actualiza banderas en header móvil */
        langSwitcherMobile.querySelectorAll('.lang-flag').forEach(function (f) {
          f.style.display = f.dataset.lang === lang ? '' : 'none';
        });

        /* Activa opción seleccionada */
        langSwitcherMobile.querySelectorAll('.lang-option').forEach(function (o) {
          o.classList.toggle('is-active', o.dataset.lang === lang);
          o.setAttribute('aria-selected', o.dataset.lang === lang);
        });

        /* Dispara el mismo cambio en el switcher desktop
           para que el JS de traducción existente funcione */
        const desktopOpt = document.querySelector(
          '#langSwitcher .lang-option[data-lang="' + lang + '"]'
        );
        if (desktopOpt) desktopOpt.click();

        langSwitcherMobile.classList.remove('is-open');
        langBtnMobile.setAttribute('aria-expanded', 'false');
      });
    });

    /* Cierra al hacer clic fuera */
    document.addEventListener('click', function (e) {
      if (!langSwitcherMobile.contains(e.target)) {
        langSwitcherMobile.classList.remove('is-open');
        langBtnMobile.setAttribute('aria-expanded', 'false');
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
