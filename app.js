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
})();
