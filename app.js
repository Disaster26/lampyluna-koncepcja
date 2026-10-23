(() => {
  'use strict';
  const SKLEP = 'https://www.lampyluna.pl/';
  const MAIL = 'halina.rudkiewicz@o2.pl';

  // Prawdziwe produkty ze sklepu lampyluna.pl (ceny z kart produktow, 23.10.2026).
  // m = przyblizona wysokosc lampy w metrach (do domyslnej skali), sw = punkt swiatla (ulamek szer./wys. zdjecia), k = pozycja kabla
  const LAMPY = [
    { id: 'bell', typ: 'wiszaca', marka: 'Moooi', nazwa: 'Bell Lamp Small', cena: 3423, url: 'moooi-bell-lamps-s-suspension-lampa-wiszaca-kolory.html', w: 417, h: 408, k: .501, m: .42, sw: [.5, .45] },
    { id: 'multilite', typ: 'wiszaca', marka: 'Gubi', nazwa: 'Multi-Lite Pendant', cena: 4183, url: 'gubi-multi-lite-pendant-brass-base-lampa-wiszaca-kolory.html', w: 507, h: 467, k: .493, m: .42, sw: [.5, .74] },
    { id: 'ronde', typ: 'wiszaca', marka: 'Gubi', nazwa: 'Ronde Pendant', cena: 1835, url: 'gubi-ronde-pendant-lampa-wiszaca-kolory-wielkosci.html', w: 848, h: 661, k: .508, m: .32, sw: [.5, .97] },
    { id: 'chouchin', typ: 'wiszaca', marka: 'Foscarini', nazwa: 'Chouchin', cena: 2899, url: 'foscarini-chouchin-lampa-wiszaca-wielkosci-kolory.html', w: 252, h: 199, k: .5, m: .3, sw: [.5, .55] },
    { id: 'crystal', typ: 'wiszaca', marka: 'Lee Broom', nazwa: 'Crystal Bulb Pendant', cena: 1482, url: 'lee-broom-crystal-bulb-pendant-lampa-wiszaca-kolory.html', w: 342, h: 732, k: .5, m: .36, sw: [.5, .76] },
    { id: 'ktribe', typ: 'wiszaca', marka: 'FLOS', nazwa: 'KTribe Suspension', cena: 1555, url: 'flos-ktribe-s1-s2-s3-suspension-lampa-wiszaca-wielkosci-kolory.html', w: 182, h: 165, k: .495, m: .32, sw: [.5, .86] },
    { id: 'discoco', typ: 'wiszaca', marka: 'Marset', nazwa: 'Discoco 53', cena: 3812, url: 'discoco-53-lampa-wiszaca-kolory.html', w: 396, h: 316, k: .465, m: .42, sw: [.5, .62] },
    { id: 'tolomeo', typ: 'podlogowa', marka: 'Artemide', nazwa: 'Tolomeo Terra', cena: 2242, url: 'tolomeo-terra-lampa-podlogowa-kolory.html', w: 228, h: 405, m: 1.75, sw: [.88, .12] },
    { id: 'gregg', typ: 'podlogowa', marka: 'Foscarini', nazwa: 'Gregg, lampa podłogowa', cena: 2983, url: 'foscarini-gregg-lampa-podlogowa-wielkosci.html', w: 180, h: 677, m: 1.85, sw: [.5, .1] },
    { id: 'birdie', typ: 'podlogowa', marka: 'Foscarini', nazwa: 'Birdie, lampa podłogowa', cena: 1882, url: 'foscarini-birdie-lampa-podlogowa-kolory.html', w: 164, h: 883, m: 1.5, sw: [.5, .07] },
    { id: 'ginger', typ: 'podlogowa', marka: 'Marset', nazwa: 'Ginger P', cena: 4349, url: 'marset-ginger-p-lampa-podlogowa-kolory.html', w: 398, h: 589, m: 1.12, sw: [.62, .05] },
    { id: 'missk', typ: 'stolowa', marka: 'FLOS', nazwa: 'Miss K', cena: 1626, url: 'flos-miss-k-lampa-stolowa-kolory.html', w: 222, h: 422, m: .43, sw: [.5, .22] },
    { id: 'anglepoise', typ: 'stolowa', marka: 'Anglepoise', nazwa: 'Original 1227', cena: 1144, url: 'original-1227-kolorowa-lampa-biurkowa.html', w: 428, h: 461, m: .52, sw: [.13, .2] },
    { id: 'gingers', typ: 'stolowa', marka: 'Marset', nazwa: 'Ginger S', cena: 3068, url: 'marset-ginger-s-lampa-stolowa.html', w: 399, h: 358, m: .5, sw: [.66, .07] }
  ];
  const TYPY = { wiszaca: 'Wiszące', podlogowa: 'Podłogowe', stolowa: 'Stołowe' };

  // Przykladowe wnetrza (pogladowe). x,y w ulamkach sceny: wiszaca y = gora lampy, pozostale y = podstawa; m = ulamek wysokosci sceny na 1 metr
  const WNETRZA = [
    { id: 'salon', nazwa: 'Salon', r: 1.5, wiszaca: { x: .5, y: .14, m: .42 }, podlogowa: { x: .2, y: .765, m: .2 }, stolowa: { x: .6, y: .79, m: .24 }, start: 'bell' },
    { id: 'jadalnia', nazwa: 'Jadalnia', r: 1.5, wiszaca: { x: .58, y: .17, m: .42 }, podlogowa: { x: .135, y: .8, m: .19 }, stolowa: { x: .45, y: .695, m: .2 }, start: 'multilite' },
    { id: 'sypialnia', nazwa: 'Sypialnia', r: 1.5, wiszaca: { x: .17, y: .12, m: .4 }, podlogowa: { x: .085, y: .83, m: .25 }, stolowa: { x: .83, y: .648, m: .3 }, start: 'missk' },
    { id: 'kacik', nazwa: 'Kącik', r: 1.5, wiszaca: { x: .55, y: .1, m: .4 }, podlogowa: { x: .6, y: .8, m: .27 }, stolowa: { x: .535, y: .668, m: .28 }, start: 'gregg' }
  ];
  const WLASNE = { id: 'wlasne', nazwa: 'Twoje zdjęcie', r: 1.5, wiszaca: { x: .5, y: .1, m: .4 }, podlogowa: { x: .3, y: .86, m: .26 }, stolowa: { x: .62, y: .72, m: .26 } };

  const zl = n => n.toLocaleString('pl-PL').replace(/ /g, ' ') + ' zł';
  const $ = s => document.querySelector(s);
  const byId = id => LAMPY.find(l => l.id === id);

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
    // pasek pojawia sie po przewinieciu za przycisk w hero, ale chowa sie, gdy na ekranie jest przymierzalnia (nie zaslania narzedzi)
    let zaHero = false, wStudio = false;
    const ustaw = () => {
      const pokaz = zaHero && !wStudio;
      mob.classList.toggle('widac', pokaz);
      mob.setAttribute('aria-hidden', !pokaz);
      mob.querySelectorAll('a').forEach(a => a.tabIndex = pokaz ? 0 : -1);
    };
    new IntersectionObserver(([e]) => { zaHero = !e.isIntersecting && e.boundingClientRect.top < 0; ustaw(); }).observe(heroCta);
    new IntersectionObserver(([e]) => { wStudio = e.isIntersecting; ustaw(); }, { rootMargin: '-15% 0px -15% 0px' }).observe(document.querySelector('.studio'));
  }

  /* ---------- przymierzalnia ---------- */
  const scena = $('#scena'), tlo = $('#scenaTlo'), warstwyEl = $('#warstwy');
  const suwak = $('#wielkosc'), podp = $('#podpowiedz');
  let wnetrze = WNETRZA[0];
  let warstwy = []; // {uid, lamp, x (srodek), y (gora), h (ulamek wys. sceny), odb, el}
  let aktywna = null, uid = 0, zakladka = 'wiszaca', wieczor = false, wlasneUrl = null;

  function domyslna(lamp, przesun) {
    const a = wnetrze[lamp.typ];
    const h = Math.min(.85, lamp.m * a.m);
    const x = Math.min(.9, Math.max(.1, a.x + (przesun || 0)));
    const y = lamp.typ === 'wiszaca' ? a.y : a.y - h;
    return { x, y, h };
  }

  function utworz(lamp, poz) {
    const el = document.createElement('div');
    el.className = 'lampa';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', lamp.marka + ' ' + lamp.nazwa);
    el.tabIndex = 0;
    const img = new Image();
    img.src = 'img/lampy/' + lamp.id + '.webp';
    img.alt = ''; img.draggable = false;
    el.appendChild(img);
    const blask = document.createElement('div');
    blask.className = 'blask';
    const w = { uid: ++uid, lamp, ...poz, odb: false, el, blask };
    warstwyEl.append(blask, el);
    podepnij(w);
    return w;
  }

  function ustawLampe(w, lamp) {
    w.lamp = lamp;
    w.el.querySelector('img').src = 'img/lampy/' + lamp.id + '.webp';
    w.el.setAttribute('aria-label', lamp.marka + ' ' + lamp.nazwa);
  }

  function rysuj(w) {
    const S = scena.getBoundingClientRect();
    const L = w.lamp, hp = w.h * S.height, wp = hp * L.w / L.h;
    const left = w.x * S.width - wp / 2, top = w.y * S.height;
    Object.assign(w.el.style, { width: wp + 'px', height: hp + 'px', left: left + 'px', top: top + 'px' });
    w.el.classList.toggle('odb', w.odb);
    let kabel = w.el.querySelector('.kabel');
    if (L.typ === 'wiszaca') {
      if (!kabel) { kabel = document.createElement('i'); kabel.className = 'kabel'; w.el.prepend(kabel); }
      const kx = w.odb ? 1 - L.k : L.k;
      kabel.style.left = (kx * 100) + '%';
      kabel.style.height = Math.max(0, top + 2) + 'px';
    } else if (kabel) kabel.remove();
    const sx = w.odb ? 1 - L.sw[0] : L.sw[0];
    const r = Math.max(hp, wp) * 1.6 + S.height * .12;
    Object.assign(w.blask.style, { width: 2 * r + 'px', height: 2 * r + 'px', left: (left + sx * wp - r) + 'px', top: (top + L.sw[1] * hp - r) + 'px' });
    w.el.classList.toggle('akt', w === aktywna);
  }
  const rysujWszystko = () => warstwy.forEach(rysuj);

  function aktywuj(w) {
    aktywna = w;
    if (w) {
      suwak.value = (w.h * 100).toFixed(1);
      if (zakladka !== w.lamp.typ) pokazZakladke(w.lamp.typ);
    }
    rysujWszystko(); odswiezPanel();
  }

  function dodaj(lamp) {
    if (warstwy.length >= 3) return;
    const przes = [0, .22, -.22][warstwy.length] || 0;
    const w = utworz(lamp, domyslna(lamp, przes));
    warstwy.push(w); aktywuj(w);
  }

  function wybierz(lamp) {
    if (!aktywna) return dodaj(lamp);
    if (aktywna.lamp.typ !== lamp.typ) {
      const p = domyslna(lamp, warstwy.indexOf(aktywna) === 0 ? 0 : aktywna.x - wnetrze[lamp.typ].x);
      Object.assign(aktywna, p);
    } else {
      // ten sam typ: zachowaj miejsce i skale (proporcjonalnie do rzeczywistej wysokosci)
      const nowaH = Math.min(.85, aktywna.h * lamp.m / aktywna.lamp.m);
      if (lamp.typ !== 'wiszaca') aktywna.y = aktywna.y + aktywna.h - nowaH;
      aktywna.h = nowaH;
    }
    ustawLampe(aktywna, lamp);
    aktywuj(aktywna);
  }

  function usun(w) {
    w.el.remove(); w.blask.remove();
    warstwy = warstwy.filter(x => x !== w);
    aktywuj(warstwy[warstwy.length - 1] || null);
  }

  /* gesty: przeciaganie jednym palcem / mysza, szczypanie dwoma palcami, kolko myszy */
  function podepnij(w) {
    const el = w.el, pkt = new Map();
    let start = null;
    const stan = () => {
      const S = scena.getBoundingClientRect(), p = [...pkt.values()];
      if (p.length === 1) return { S, mx: p[0].x, my: p[0].y, d: 0 };
      return { S, mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2, d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) };
    };
    const zacznij = () => { const s = stan(); start = { ...s, x: w.x, y: w.y, h: w.h }; };
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      pkt.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (aktywna !== w) aktywuj(w);
      zacznij(); podp.classList.add('ukryj');
    });
    el.addEventListener('pointermove', e => {
      if (!pkt.has(e.pointerId) || !start) return;
      pkt.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const s = stan();
      if (pkt.size >= 2 && start.d > 0) {
        const f = s.d / start.d;
        const nh = Math.min(.95, Math.max(.05, start.h * f));
        // skaluj wokol srodka gestu
        const cy = (start.my - s.S.top) / s.S.height;
        w.h = nh;
        w.y = cy - (cy - start.y) * (nh / start.h) + (s.my - start.my) / s.S.height;
        w.x = start.x + (s.mx - start.mx) / s.S.width;
      } else {
        w.x = start.x + (s.mx - start.mx) / s.S.width;
        w.y = start.y + (s.my - start.my) / s.S.height;
      }
      ogranicz(w); suwak.value = (w.h * 100).toFixed(1); rysuj(w);
    });
    const koniec = e => { pkt.delete(e.pointerId); if (pkt.size) zacznij(); else start = null; };
    el.addEventListener('pointerup', koniec);
    el.addEventListener('pointercancel', koniec);
    el.addEventListener('wheel', e => {
      e.preventDefault();
      if (aktywna !== w) aktywuj(w);
      skaluj(w, e.deltaY < 0 ? 1.06 : 1 / 1.06);
    }, { passive: false });
    el.addEventListener('keydown', e => {
      const k = { ArrowLeft: [-.01, 0], ArrowRight: [.01, 0], ArrowUp: [0, -.01], ArrowDown: [0, .01] }[e.key];
      if (k) { e.preventDefault(); w.x += k[0]; w.y += k[1]; ogranicz(w); rysuj(w); }
      else if (e.key === '+' || e.key === '=') skaluj(w, 1.05);
      else if (e.key === '-') skaluj(w, 1 / 1.05);
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); usun(w); }
    });
    el.addEventListener('focus', () => { if (aktywna !== w) aktywuj(w); });
  }
  function ogranicz(w) {
    w.x = Math.min(1, Math.max(0, w.x));
    w.y = Math.min(.97, Math.max(-w.h + .03, w.y));
  }
  function skaluj(w, f) {
    const nh = Math.min(.95, Math.max(.05, w.h * f));
    if (w.lamp.typ !== 'wiszaca') w.y += w.h - nh; // podloga zostaje na miejscu
    w.h = nh; ogranicz(w); suwak.value = (w.h * 100).toFixed(1); rysuj(w);
  }
  suwak.addEventListener('input', () => {
    if (!aktywna) return;
    skaluj(aktywna, (suwak.value / 100) / aktywna.h);
  });
  $('#odbij').addEventListener('click', () => { if (aktywna) { aktywna.odb = !aktywna.odb; rysuj(aktywna); } });
  const wBtn = $('#wieczor');
  wBtn.addEventListener('click', () => {
    wieczor = !wieczor;
    scena.classList.toggle('wieczor', wieczor);
    wBtn.setAttribute('aria-pressed', wieczor);
  });
  // klikniecie w puste tlo odznacza ramke (lepszy podglad)
  scena.addEventListener('pointerdown', e => { if (e.target === scena || e.target === warstwyEl || e.target === tlo) { aktywna && aktywna.el.classList.remove('akt'); } });

  /* wnetrza */
  const wnEl = $('#wnetrza');
  WNETRZA.forEach(wn => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'wn'; b.dataset.id = wn.id;
    b.setAttribute('aria-pressed', wn === wnetrze);
    b.setAttribute('aria-label', 'Przykładowe wnętrze: ' + wn.nazwa);
    b.innerHTML = '<img src="img/wnetrza/' + wn.id + '-m.webp" alt="" loading="lazy">';
    b.addEventListener('click', () => ustawWnetrze(wn));
    wnEl.insertBefore(b, wnEl.querySelector('.wgraj'));
  });
  function ustawWnetrze(wn, src) {
    const stare = wnetrze;
    wnetrze = wn;
    wnEl.querySelectorAll('.wn').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === wn.id));
    wnEl.querySelector('.wgraj').classList.toggle('akt', wn.id === 'wlasne');
    tlo.src = src || 'img/wnetrza/' + wn.id + '.webp';
    scena.style.aspectRatio = wn.r;
    dopasujScene();
    // przestaw lampy na domyslne miejsca nowego wnetrza
    warstwy.forEach((w, i) => Object.assign(w, domyslna(w.lamp, [0, .22, -.22][i])));
    if (stare !== wn) rysujWszystko();
  }
  function dopasujScene() {
    const r = wnetrze.r;
    const maxH = window.innerHeight * (window.innerWidth <= 760 ? .62 : .74);
    scena.style.maxWidth = Math.round(maxH * r) + 'px';
    requestAnimationFrame(rysujWszystko);
  }
  $('#plik').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f || !/^image\//.test(f.type)) return;
    if (wlasneUrl) URL.revokeObjectURL(wlasneUrl);
    wlasneUrl = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      const r = Math.min(2.2, Math.max(.56, im.naturalWidth / im.naturalHeight));
      ustawWnetrze({ ...WLASNE, r }, wlasneUrl);
      podp.classList.remove('ukryj');
      scena.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    im.src = wlasneUrl;
  });
  tlo.addEventListener('load', rysujWszystko);

  /* lista lamp */
  const lampyEl = $('#lampy'), zakl = $('#zakladki');
  function pokazZakladke(typ) {
    zakladka = typ;
    zakl.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.typ === typ));
    lampyEl.innerHTML = '';
    LAMPY.filter(l => l.typ === typ).forEach(l => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'lp'; b.setAttribute('role', 'option'); b.dataset.id = l.id;
      b.setAttribute('aria-selected', !!(aktywna && aktywna.lamp === l));
      b.innerHTML = '<img src="img/lampy/' + l.id + '.webp" alt="" loading="lazy"><span>' + l.marka + '</span><span>' + l.nazwa.split(',')[0] + '</span>';
      b.title = l.marka + ' ' + l.nazwa + ', ' + zl(l.cena);
      b.addEventListener('click', () => { wybierz(l); podp.classList.add('ukryj'); });
      lampyEl.appendChild(b);
    });
  }
  zakl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pokazZakladke(b.dataset.typ); });

  /* panel wybranych */
  const listaEl = $('#warstwyLista'), aktEl = $('#aktywna'), zapytaj = $('#zapytaj'), kup = $('#kup');
  function odswiezPanel() {
    lampyEl.querySelectorAll('.lp').forEach(b => b.setAttribute('aria-selected', !!(aktywna && aktywna.lamp.id === b.dataset.id)));
    listaEl.innerHTML = '';
    warstwy.forEach(w => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ws';
      b.setAttribute('aria-pressed', w === aktywna);
      b.innerHTML = '<b>' + w.lamp.nazwa.split(',')[0] + '</b>';
      if (warstwy.length > 1) {
        const x = document.createElement('span');
        x.className = 'x'; x.textContent = '×'; x.setAttribute('role', 'button'); x.setAttribute('aria-label', 'Usuń ' + w.lamp.nazwa);
        x.addEventListener('click', ev => { ev.stopPropagation(); usun(w); });
        b.appendChild(x);
      }
      b.addEventListener('click', () => aktywuj(w));
      listaEl.appendChild(b);
    });
    if (warstwy.length < 3) {
      const d = document.createElement('button');
      d.type = 'button'; d.className = 'dodaj';
      d.textContent = warstwy.length ? '+ Porównaj z inną lampą' : '+ Dodaj lampę';
      d.addEventListener('click', () => {
        const typ = zakladka, uzyte = warstwy.map(w => w.lamp.id);
        const l = LAMPY.find(x => x.typ === typ && !uzyte.includes(x.id)) || LAMPY.find(x => !uzyte.includes(x.id));
        dodaj(l);
      });
      listaEl.appendChild(d);
    }
    const L = aktywna ? aktywna.lamp : null;
    if (!L) { aktEl.innerHTML = '<span class="marka">Wybierz lampę z listy powyżej</span>'; zapytaj.removeAttribute('href'); kup.removeAttribute('href'); return; }
    aktEl.innerHTML = '<span class="marka">' + L.marka + '</span><span class="nazwa">' + L.nazwa + '</span><span class="cena">' + zl(L.cena) + '</span>';
    kup.href = SKLEP + L.url;
    const lista = warstwy.map(w => '- ' + w.lamp.marka + ' ' + w.lamp.nazwa + ' (' + zl(w.lamp.cena) + '): ' + SKLEP + w.lamp.url).join('\n');
    const temat = warstwy.length > 1 ? 'Pytanie o lampy: ' + warstwy.map(w => w.lamp.marka + ' ' + w.lamp.nazwa.split(',')[0]).join(', ') : 'Pytanie o lampę ' + L.marka + ' ' + L.nazwa.split(',')[0];
    const tresc = 'Dzień dobry,\n\nprzymierzałem(-am) na stronie ' + (warstwy.length > 1 ? 'te lampy' : 'tę lampę') + ':\n' + lista +
      '\n\nProszę o informację o dostępności, kolorach, rozmiarach i czasie dostawy.\n\nPomieszczenie: \nWysokość sufitu: \n\nPozdrawiam';
    zapytaj.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(temat) + '&body=' + encodeURIComponent(tresc);
    zapytaj.textContent = warstwy.length > 1 ? 'Zapytaj o te lampy' : 'Zapytaj o tę lampę';
  }

  /* zapis kadru do pliku */
  $('#zapisz').addEventListener('click', async () => {
    const S = scena.getBoundingClientRect();
    const sk = Math.min(2, 1600 / S.width);
    const c = document.createElement('canvas');
    c.width = Math.round(S.width * sk); c.height = Math.round(S.height * sk);
    const x = c.getContext('2d');
    const nw = tlo.naturalWidth, nh = tlo.naturalHeight, r = c.width / c.height;
    let sx = 0, sy = 0, sw = nw, sh = nh;
    if (nw / nh > r) { sw = nh * r; sx = (nw - sw) / 2; } else { sh = nw / r; sy = (nh - sh) / 2; }
    x.drawImage(tlo, sx, sy, sw, sh, 0, 0, c.width, c.height);
    if (wieczor) { x.fillStyle = 'rgba(20,16,26,.66)'; x.fillRect(0, 0, c.width, c.height); }
    const imgs = await Promise.all(warstwy.map(w => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = w.el.querySelector('img').src; })));
    warstwy.forEach((w, i) => {
      const L = w.lamp, hp = w.h * c.height, wp = hp * L.w / L.h, left = w.x * c.width - wp / 2, top = w.y * c.height;
      if (L.typ === 'wiszaca') { const kx = left + (w.odb ? 1 - L.k : L.k) * wp; x.strokeStyle = '#3a3632'; x.lineWidth = 1.5 * sk; x.beginPath(); x.moveTo(kx, 0); x.lineTo(kx, top + 2); x.stroke(); }
      x.save();
      if (w.odb) { x.translate(left + wp, top); x.scale(-1, 1); x.drawImage(imgs[i], 0, 0, wp, hp); } else x.drawImage(imgs[i], left, top, wp, hp);
      x.restore();
      if (wieczor) {
        const gx = left + (w.odb ? 1 - L.sw[0] : L.sw[0]) * wp, gy = top + L.sw[1] * hp, rr = Math.max(hp, wp) * 1.6 + c.height * .12;
        const g = x.createRadialGradient(gx, gy, 0, gx, gy, rr);
        g.addColorStop(0, 'rgba(255,232,185,1)'); g.addColorStop(.12, 'rgba(255,200,125,.6)'); g.addColorStop(.34, 'rgba(255,176,96,.26)'); g.addColorStop(.52, 'rgba(255,160,80,.08)'); g.addColorStop(.7, 'rgba(255,160,80,0)');
        x.globalCompositeOperation = 'screen'; x.fillStyle = g; x.fillRect(gx - rr, gy - rr, rr * 2, rr * 2); x.globalCompositeOperation = 'source-over';
      }
    });
    c.toBlob(async blob => {
      const nazwa = 'lampa-u-mnie.jpg';
      try {
        const plik = new File([blob], nazwa, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [plik] }) && matchMedia('(pointer:coarse)').matches) { await navigator.share({ files: [plik], title: 'Lampa u mnie' }); return; }
      } catch (e) { if (e && e.name === 'AbortError') return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = nazwa;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, 'image/jpeg', .9);
  });

  /* start */
  window.addEventListener('resize', dopasujScene);
  pokazZakladke('wiszaca');
  ustawWnetrze(wnetrze);
  dodaj(byId(wnetrze.start));
  window.__luna = { warstwy: () => warstwy, LAMPY, dodaj, wybierz, byId };
})();
