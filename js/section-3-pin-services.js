(function () {

  const section   = document.getElementById('section-3');
  const leftCol   = section ? section.querySelector('.services-pin-left') : null;
  const cards     = section ? section.querySelectorAll('.services-pin-card') : [];

  if (!section || !leftCol || !cards.length) return;

  let raf = null;

  function isDesktop() {
    return window.innerWidth > 1024;
  }

  function update() {
    if (!isDesktop()) {
      leftCol.style.transform = 'translateY(0px)';
      return;
    }

    const sectionRect  = section.getBoundingClientRect();
    const sectionTop   = sectionRect.top;        // negativo al scrollear

    // Fondo del ÚLTIMO servicio relativo al tope de la sección
    const lastCard     = cards[cards.length - 1];
    const lastCardRect = lastCard.getBoundingClientRect();

    // offsetTop del último card respecto al tope de la sección
    // = distancia desde el inicio de la sección hasta el fondo del último card
    const lastCardBottom = lastCardRect.bottom - sectionRect.top;

    const leftH  = leftCol.offsetHeight;

    /*
      El bloque izquierdo debe parar cuando su FONDO
      quede alineado con el FONDO del último servicio.
      maxY = posición Y que hace que leftCol.bottom === lastCard.bottom
    */
    const maxY   = lastCardBottom - leftH;

    const scrolled = -sectionTop;                // cuánto llevamos scrolleado
    const rawY     = Math.max(scrolled, 0);      // no empieza antes de entrar
    const clampY   = Math.min(rawY, Math.max(maxY, 0));

    leftCol.style.transform = `translateY(${clampY}px)`;
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => { update(); raf = null; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update,   { passive: true });
  update();

})();
