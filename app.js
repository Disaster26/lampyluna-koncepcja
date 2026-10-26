(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  /* ---------- menu, szukaj, pasek dolny ---------- */
  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const o = menu.classList.toggle('otw');
    burger.setAttribute('aria-expanded', o);
    burger.setAttribute('aria-label', o ? 'Zamknij menu' : 'Otwórz menu');
    document.body.style.overflow = o ? 'hidden' : '';
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.classList.remove('otw'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; } });
  const szBtn = $('#szukajBtn'), szP = $('#szukajPasek');
  szBtn.addEventListener('click', () => {
    szP.hidden = !szP.hidden; szBtn.setAttribute('aria-expanded', !szP.hidden);
    if (!szP.hidden) szP.querySelector('input').focus();
  });
  const mob = $('#mob'), heroCta = $('#heroCta');
  if ('IntersectionObserver' in window) {
    // pasek pojawia sie po przewinieciu za przycisk w hero
    new IntersectionObserver(([e]) => {
      const pokaz = !e.isIntersecting && e.boundingClientRect.top < 0;
      mob.classList.toggle('widac', pokaz);
      mob.setAttribute('aria-hidden', !pokaz);
      mob.querySelectorAll('a').forEach(a => a.tabIndex = pokaz ? 0 : -1);
    }).observe(heroCta);
  }

  /* ---------- rzedy mebli i dekoracji: strzalki na komputerze ---------- */
  const strz = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  document.querySelectorAll('.dek-rzad').forEach(rz => {
    const tasma = rz.querySelector('.dek-tasma'), gl = rz.querySelector('.dek-rzad-gl');
    const ster = document.createElement('div');
    ster.className = 'ster';
    ster.innerHTML = `<button type="button" aria-label="Poprzednie produkty">${strz('M15 5l-7 7 7 7')}</button><button type="button" aria-label="Następne produkty">${strz('M9 5l7 7-7 7')}</button>`;
    gl.insertBefore(ster, gl.querySelector('.link'));
    const [wst, dal] = ster.querySelectorAll('button');
    const krok = () => tasma.clientWidth * 0.8;
    wst.addEventListener('click', () => tasma.scrollBy({ left: -krok(), behavior: 'smooth' }));
    dal.addEventListener('click', () => tasma.scrollBy({ left: krok(), behavior: 'smooth' }));
    const stan = () => {
      const max = tasma.scrollWidth - tasma.clientWidth - 2;
      wst.disabled = tasma.scrollLeft <= 2;
      dal.disabled = tasma.scrollLeft >= max;
      ster.hidden = max <= 0;
    };
    tasma.addEventListener('scroll', stan, { passive: true });
    window.addEventListener('resize', stan);
    stan();
  });
})();
