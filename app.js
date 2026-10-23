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

  /* ---------- przymierzalnia: wnetrze w perspektywie rysowane na canvas ---------- */
  // Lampy to prawdziwe zdjecia produktow (wyciete z bialego tla). Realizm daje scena wokol nich:
  // kamera z perspektywa odczytana ze zdjecia, kabel i rozeta na suficie, skala zalezna od odleglosci,
  // cienie i swiatlo liczone dla podlogi, sufitu, scian i blatow.
  const F = 1.2;    // ogniskowa w jednostkach wysokosci kadru (ok. 64 st. w poziomie)
  const HS = 2.7;   // wysokosc pomieszczenia [m]

  // Swiatlo i podstawa lamp: b/bw = srodek i szerokosc podstawy (ulamki szer. zdjecia),
  // kat = polowa kata stozka (0 = swieci dookola), bok = swiatlo poza stozkiem, gora = w gore, moc, kol = barwa
  const SW = {
    bell: { kat: 62, bok: .4, gora: .25, moc: 1.1, roz: '#efede8' },
    multilite: { kat: 52, bok: .05, gora: 0, moc: 1.2, roz: '#b8955a' },
    ronde: { kat: 50, bok: .03, gora: 0, moc: 1.25, roz: '#5c666e', kab: '#3b4247' },
    chouchin: { kat: 0, bok: .45, gora: .06, moc: 1, kol: [1, .72, .46] },
    crystal: { kat: 0, bok: 1, gora: .8, moc: .85, roz: '#b8955a', kab: '#2b2724' },
    ktribe: { kat: 0, bok: .45, gora: .3, moc: .95 },
    discoco: { kat: 66, bok: .3, gora: .1, moc: 1.15, roz: '#c6a86b' },
    tolomeo: { b: .19, bw: .33, kat: 48, bok: .07, gora: 0, moc: .95 },
    gregg: { b: .52, bw: .74, kat: 0, bok: 1, gora: .75, moc: .9 },
    birdie: { b: .5, bw: .3, kat: 70, bok: .2, gora: .05, moc: .95 },
    ginger: { b: .7, bw: .36, kat: 72, bok: .06, gora: 0, moc: 1 },
    missk: { b: .49, bw: .6, kat: 0, bok: .55, gora: .8, moc: .85, kol: [1, .78, .52] },
    anglepoise: { b: .25, bw: .22, kat: 38, bok: .04, gora: 0, moc: .8 },
    gingers: { b: .7, bw: .38, kat: 72, bok: .06, gora: 0, moc: .85 }
  };
  const CIEPLE = [1, .8, .6]; // ok. 2700 K

  // Przykladowe wnetrza (pogladowe). Geometria odczytana ze zdjec, w ulamkach kadru:
  // h = linia horyzontu (wysokosc oka), xv = punkt zbiegu, sc/sp = linia sufitu i podlogi przy tylnej scianie,
  // sl/sr = narozniki tylnej sciany, okno = strona swiatla dziennego (-1 lewa, 1 prawa),
  // blaty = poziome powierzchnie {y: wysokosc w m, vd/vb: dalsza/blizsza krawedz, xl/xr}.
  // wis = nad ktorym blatem wisi lampa i na jakiej wysokosci jej dol, pod = punkt podstawy lampy podlogowej, sto = blat i x
  const WNETRZA = [
    { id: 'salon', nazwa: 'Salon', r: 1.5, h: .52, xv: .43, sc: .29, sp: .705, sl: .11, sr: .8, okno: -1,
      blaty: [{ y: .42, vd: .75, vb: .81, xl: .36, xr: .65 }], wis: { blat: 0, dol: 1.62 }, pod: { x: .2, v: .765 }, sto: { blat: 0, x: .58 }, start: 'bell' },
    { id: 'jadalnia', nazwa: 'Jadalnia', r: 1.5, h: .51, xv: .43, sc: .307, sp: .78, sl: .216, sr: .76, okno: 1,
      blaty: [{ y: .75, vd: .685, vb: .745, xl: .29, xr: .76 }], wis: { blat: 0, dol: 1.5 }, pod: { x: .84, v: .88 }, sto: { blat: 0, x: .45 }, start: 'multilite' },
    { id: 'sypialnia', nazwa: 'Sypialnia', r: 1.5, h: .47, xv: .55, sc: .13, sp: .75, sl: .093, sr: .935, okno: 1,
      blaty: [{ y: .55, vd: .627, vb: .648, xl: .115, xr: .28 }, { y: .55, vd: .627, vb: .648, xl: .75, xr: .925 }, { y: .6, vd: .625, vb: .72, xl: .25, xr: .83 }],
      wis: { blat: 2, dol: 1.95 }, pod: { x: .085, v: .83 }, sto: { blat: 1, x: .84 }, start: 'missk' },
    { id: 'kacik', nazwa: 'Kącik', r: 1.5, h: .5, xv: .52, sc: .115, sp: .765, sl: .225, sr: .97, okno: 1,
      blaty: [{ y: .55, vd: .652, vb: .668, xl: .47, xr: .585 }], wis: { blat: 0, dol: 1.45 }, pod: { x: .66, v: .79 }, sto: { blat: 0, x: .53 }, start: 'gregg' }
  ];
  // Wlasne zdjecie: typowa kamera na wysokosci oczu, bez scian bocznych
  const WLASNE = { id: 'wlasne', nazwa: 'Twoje zdjęcie', r: 1.5, h: .5, xv: .5, sc: .14, sp: .84, sl: null, sr: null, okno: -1,
    blaty: [], wis: { z: .72, dol: 1.75 }, pod: { x: .14, v: .9 }, sto: { x: .8, v: .78, y: .75 } };

  const zl = n => n.toLocaleString('pl-PL').replace(/ /g, ' ') + ' zł';
  const $ = s => document.querySelector(s);
  const byId = id => LAMPY.find(l => l.id === id);
  const clamp = (a, lo, hi) => Math.min(hi, Math.max(lo, a));
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sw = L => SW[L.id] || {};

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

  /* ---------- stan sceny ---------- */
  const scena = $('#scena'), cv = $('#scenaCanvas'), warstwyEl = $('#warstwy');
  const suwak = $('#wielkosc'), zwis = $('#zwis'), zwisBox = $('#zwisBox'), zwisWart = $('#zwisWart'), podp = $('#podpowiedz');
  const ctx = cv.getContext('2d');
  let wnetrze = WNETRZA[0], G = null; // G = geometria biezacego wnetrza
  let warstwy = []; // {uid, lamp, X, Z, Y, blat, drop, s, odb, el}
  let aktywna = null, uid = 0, zakladka = 'wiszaca', wlasneUrl = null;
  let noc = 0, nocCel = 0; // 0 dzien, 1 wieczor (plynne przejscie)
  const tlo = new Image();
  const obrazy = new Map();
  function obraz(id) {
    if (!obrazy.has(id)) { const i = new Image(); i.decoding = 'async'; i.onload = () => { sylwetki.delete(id); odswiez(); }; i.src = 'img/lampy/' + id + '.webp'; obrazy.set(id, i); }
    return obrazy.get(id);
  }
  const gotowy = i => i && i.complete && i.naturalWidth > 0;

  function geometria(wn) {
    const r = wn.r, uv = wn.xv * r, hc = HS * (wn.sp - wn.h) / (wn.sp - wn.sc), Z0 = F * HS / (wn.sp - wn.sc);
    const XL = wn.sl == null ? -1e6 : (wn.sl * r - uv) * Z0 / F, XR = wn.sr == null ? 1e6 : (wn.sr * r - uv) * Z0 / F;
    const blaty = wn.blaty.map(b => {
      const Zd = F * (hc - b.y) / (b.vd - wn.h), Zb = F * (hc - b.y) / (b.vb - wn.h), Zm = (Zd + Zb) / 2;
      return { y: b.y, Zd, Zb, Zm, X0: (b.xl * r - uv) * Zm / F, X1: (b.xr * r - uv) * Zm / F };
    });
    return { r, uv, h: wn.h, hc, Z0, XL, XR, blaty, okno: wn.okno, wlasne: wn.id === 'wlasne' };
  }
  // rzut punktu swiata (X w bok, Y w gore od podlogi, Z w glab) na kadr [u, v] w jednostkach wysokosci kadru
  const rzut = (X, Y, Z) => [G.uv + F * X / Z, G.h - F * (Y - G.hc) / Z];

  function wymiary(w) {
    const L = w.lamp, H = L.m * w.s, Wm = H * L.w / L.h;
    return { H, Wm };
  }
  // polozenie lampy na kadrze + punkt swiatla w swiecie
  function geo(w) {
    const L = w.lamp, S = sw(L), { H, Wm } = wymiary(w), sk = F / w.Z;
    const hp = H * sk, wp = Wm * sk, cu = G.uv + F * w.X / w.Z;
    const fx = w.odb ? 1 - L.sw[0] : L.sw[0];
    let top, left, ax, Yl;
    if (L.typ === 'wiszaca') {
      ax = w.odb ? 1 - L.k : L.k;
      const Ytop = HS - w.drop;
      top = G.h - F * (Ytop - G.hc) / w.Z;
      Yl = Ytop - L.sw[1] * H;
    } else {
      ax = w.odb ? 1 - (S.b ?? .5) : (S.b ?? .5);
      top = G.h + F * (G.hc - w.Y) / w.Z - hp;
      Yl = w.Y + (1 - L.sw[1]) * H;
    }
    left = cu - ax * wp;
    return { left, top, w: wp, h: hp, cu, H, Wm, ax, lu: left + fx * wp, lv: top + L.sw[1] * hp,
      swiat: [w.X + (fx - ax) * Wm, Yl, w.Z], sufit: G.h - F * (HS - G.hc) / w.Z, baza: top + hp };
  }

  /* ---------- tlo: kolor i jasnosc lokalna (do dopasowania lamp) ---------- */
  let tloMini = null, tloSr = [1, 1, 1];
  function analizaTla() {
    const c = document.createElement('canvas'); c.width = 24; c.height = 16;
    const x = c.getContext('2d', { willReadFrequently: true });
    rysujTlo(x, 24, 16);
    const d = x.getImageData(0, 0, 24, 16).data;
    let s = [0, 0, 0];
    for (let i = 0; i < d.length; i += 4) { s[0] += d[i]; s[1] += d[i + 1]; s[2] += d[i + 2]; }
    const n = d.length / 4; tloSr = s.map(v => v / n / 255); tloMini = d;
  }
  function jasnosc(u, v) {
    if (!tloMini) return 1;
    const i = clamp(Math.floor(u / G.r * 24), 0, 23), j = clamp(Math.floor(v * 16), 0, 15), p = (j * 24 + i) * 4;
    const l = (tloMini[p] * .3 + tloMini[p + 1] * .59 + tloMini[p + 2] * .11) / 255;
    const sr = tloSr[0] * .3 + tloSr[1] * .59 + tloSr[2] * .11;
    return clamp(Math.pow(l / sr, .35), .86, 1.04);
  }
  function rysujTlo(x, W, H) {
    if (!gotowy(tlo)) { x.fillStyle = '#ddd5cb'; x.fillRect(0, 0, W, H); return; }
    const nw = tlo.naturalWidth, nh = tlo.naturalHeight, r = W / H;
    let sx = 0, sy = 0, sww = nw, shh = nh;
    if (nw / nh > r) { sww = nh * r; sx = (nw - sww) / 2; } else { shh = nw / r; sy = (nh - shh) / 2; }
    x.drawImage(tlo, sx, sy, sww, shh, 0, 0, W, H);
  }

  /* ---------- mapa swiatla wieczorem: oswietlenie podlogi, sufitu, scian i blatow ---------- */
  const lmC = document.createElement('canvas'); const lmX = lmC.getContext('2d');
  let lmBrudna = true;
  function rozmyj(a, t, W, H, R) {
    const n = 2 * R + 1;
    for (let j = 0; j < H; j++) for (let c = 0; c < 3; c++) {
      let s = 0; const row = j * W;
      for (let i = -R; i <= R; i++) s += a[(row + clamp(i, 0, W - 1)) * 3 + c];
      for (let i = 0; i < W; i++) {
        t[(row + i) * 3 + c] = s / n;
        s += a[(row + Math.min(W - 1, i + R + 1)) * 3 + c] - a[(row + Math.max(0, i - R)) * 3 + c];
      }
    }
    for (let i = 0; i < W; i++) for (let c = 0; c < 3; c++) {
      let s = 0;
      for (let j = -R; j <= R; j++) s += t[(clamp(j, 0, H - 1) * W + i) * 3 + c];
      for (let j = 0; j < H; j++) {
        a[(j * W + i) * 3 + c] = s / n;
        s += t[(Math.min(H - 1, j + R + 1) * W + i) * 3 + c] - t[(Math.max(0, j - R) * W + i) * 3 + c];
      }
    }
  }
  // geometria promieni dla mapy swiatla liczona raz na wnetrze i rozdzielczosc
  let geoLM = null;
  function geometriaLM(LW, LH) {
    if (geoLM && geoLM.G === G && geoLM.LW === LW) return geoLM;
    const n = LW * LH, P = new Float32Array(n * 3), N = new Uint8Array(n);
    const { hc, Z0, XL, XR, blaty } = G;
    for (let j = 0; j < LH; j++) {
      const v = (j + .5) / LH, dy = -(v - G.h) / F;
      for (let i = 0; i < LW; i++) {
        const u = (i + .5) / LW * G.r, dx = (u - G.uv) / F;
        // promien z kamery (0, hc, 0) w kierunku (dx, dy, 1): najblizsza powierzchnia
        // N: 0 tylna sciana, 1 podloga/blat, 2 sufit, 3 lewa sciana, 4 prawa sciana
        let t = Z0, nn = 0;
        if (dy < 0) { const tf = hc / -dy; if (tf < t) { t = tf; nn = 1; } }
        else if (dy > 0) { const tc = (HS - hc) / dy; if (tc < t) { t = tc; nn = 2; } }
        if (dx < 0) { const tl = XL / dx; if (tl > 0 && tl < t) { t = tl; nn = 3; } }
        else if (dx > 0) { const tr = XR / dx; if (tr > 0 && tr < t) { t = tr; nn = 4; } }
        if (dy < 0) for (const b of blaty) {
          const tb = (hc - b.y) / -dy;
          if (tb < t && tb >= b.Zb && tb <= b.Zd) { const X = tb * dx; if (X >= b.X0 && X <= b.X1) { t = tb; nn = 1; } }
        }
        const p = j * LW + i;
        P[p * 3] = t * dx; P[p * 3 + 1] = hc + t * dy; P[p * 3 + 2] = t; N[p] = nn;
      }
    }
    geoLM = { G, LW, LH, P, N };
    return geoLM;
  }
  const NX = [0, 0, 0, 1, -1], NY = [0, 1, -1, 0, 0], NZ = [-1, 0, 0, 0, 0];
  function mapaSwiatla(LH) {
    const LW = Math.round(LH * G.r);
    if (lmC.width !== LW || lmC.height !== LH) { lmC.width = LW; lmC.height = LH; }
    const im = lmX.createImageData(LW, LH), d = im.data, n = LW * LH;
    if (!mapaSwiatla.f || mapaSwiatla.f.length !== n * 3) { mapaSwiatla.f = new Float32Array(n * 3); mapaSwiatla.t = new Float32Array(n * 3); }
    const fb = mapaSwiatla.f, tb = mapaSwiatla.t;
    const { P, N } = geometriaLM(LW, LH), blaty = G.blaty;
    fb.fill(0);
    for (const w of warstwy) {
      const g = geo(w), S = sw(w.lamp), kol = S.kol || CIEPLE, m = (S.moc || 1) * 2.6 * Math.pow(w.s, 1.3);
      const [Lx, Ly, Lz] = g.swiat, a = (S.kat || 0) * Math.PI / 180;
      const c1 = S.kat > 0 ? Math.cos(a + .22) : -.3, c2 = S.kat > 0 ? Math.cos(a - .1) : .7, bok = S.bok, gora = S.gora || 0;
      const cien = blaty.filter(b => Ly > b.y);
      const kr = kol[0] * m, kg = kol[1] * m, kb = kol[2] * m;
      for (let p = 0; p < n; p++) {
        const px = P[p * 3], py = P[p * 3 + 1], pz = P[p * 3 + 2], nn = N[p];
        const lx = Lx - px, ly = Ly - py, lz = Lz - pz, d2 = lx * lx + ly * ly + lz * lz, dl = Math.sqrt(d2);
        let E = 0;
        const ndl = (NX[nn] * lx + NY[nn] * ly + NZ[nn] * lz) / dl;
        if (ndl > 0) {
          const cd = ly / dl;
          let e = bok + (1 - bok) * sstep(c1, c2, cd);
          if (gora && cd < -.2) e += gora * sstep(.2, .9, -cd);
          E = ndl * e / (d2 + .08);
          // cien rzucany przez blaty (np. stol nad podloga)
          if (nn === 1 && py < .05) for (const b of cien) {
            const f = b.y / Ly, qx = px + lx * f, qz = pz + lz * f;
            const wn = Math.min(qz - b.Zb, b.Zd - qz, qx - b.X0, b.X1 - qx);
            if (wn > -.15) { E *= 1 - .8 * sstep(-.15, .15, wn); break; }
          }
        }
        E += .16 / (d2 + 2.5); // swiatlo odbite
        fb[p * 3] += E * kr; fb[p * 3 + 1] += E * kg; fb[p * 3 + 2] += E * kb;
      }
    }
    // rozmycie (miekkie przejscia miedzy powierzchniami, geometria wnetrza jest przyblizona)
    const R = LH > 100 ? 2 : 1;
    rozmyj(fb, tb, LW, LH, R); rozmyj(fb, tb, LW, LH, R);
    const amb = [.1, .105, .145];
    for (let p = 0, o = 0; p < n; p++, o += 3) {
      const q = p * 4;
      d[q] = 255 * (amb[0] + (1 - amb[0]) * (1 - Math.exp(-1.25 * fb[o])));
      d[q + 1] = 255 * (amb[1] + (1 - amb[1]) * (1 - Math.exp(-1.25 * fb[o + 1])));
      d[q + 2] = 255 * (amb[2] + (1 - amb[2]) * (1 - Math.exp(-1.25 * fb[o + 2])));
      d[q + 3] = 255;
    }
    lmX.putImageData(im, 0, 0);
    lmBrudna = false;
  }

  /* ---------- sylwetki (miekkie cienie) i bufory ---------- */
  const sylwetki = new Map();
  function sylwetka(L, wys) {
    const key = L.id + wys;
    if (!sylwetki.has(L.id)) sylwetki.set(L.id, {});
    const o = sylwetki.get(L.id);
    if (!o[wys]) {
      const im = obraz(L.id); if (!gotowy(im)) return null;
      const c = document.createElement('canvas'); c.height = wys; c.width = Math.max(2, Math.round(wys * L.w / L.h));
      const x = c.getContext('2d'); x.drawImage(im, 1, 1, c.width - 2, c.height - 2);
      x.globalCompositeOperation = 'source-in'; x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
      o[wys] = c;
    }
    return o[wys];
  }
  const bufory = [document.createElement('canvas'), document.createElement('canvas')];
  function bufor(i, w, h) {
    const c = bufory[i]; w = Math.max(1, Math.ceil(w)); h = Math.max(1, Math.ceil(h));
    if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
    const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, w, h);
    return [c, x];
  }
  const mieszaj = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const rgb = c => 'rgb(' + c.map(v => Math.round(clamp(v, 0, 1) * 255)).join(',') + ')';

  /* ---------- rysowanie sceny ---------- */
  function rysujScene(x, W, H, eksport) {
    const k = H; // px na jednostke wysokosci kadru
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    rysujTlo(x, W, H);
    const dzien = 1 - noc;
    const kolejka = warstwy.map(w => ({ w, g: geo(w) })).sort((a, b) => b.w.Z - a.w.Z); // dalsze najpierw

    // 1. cienie na powierzchniach
    for (const { w, g } of kolejka) {
      const L = w.lamp, S = sw(L);
      if (L.typ === 'wiszaca') {
        // dzien: miekki cien lampy na tylnej scianie (swiatlo z okna), slabnie z odlegloscia od sciany
        const t = G.Z0 - w.Z;
        const D = [-G.okno * .55, -.32, 1];
        const Xc = w.X + (.5 - g.ax) * g.Wm, Yc = HS - w.drop - g.H / 2;
        const SX = Xc + D[0] * t, SY = Yc + D[1] * t;
        const a = .2 * Math.exp(-t / 1.1) * dzien;
        if (a > .01 && SX > G.XL && SX < G.XR && SY - g.H / 2 > 0) {
          const [su, sv] = rzut(SX, SY, G.Z0), sh = g.H * F / G.Z0 * k, swp = sh * L.w / L.h;
          const s = sylwetka(L, t > .8 ? 7 : 11), pw = 1 + .25 * Math.min(2, t);
          if (s) {
            x.save(); x.globalAlpha = a;
            x.translate(su * k, sv * k); if (w.odb) x.scale(-1, 1);
            x.drawImage(s, -swp * pw / 2, -sh * pw / 2, swp * pw, sh * pw);
            x.restore();
          }
        }
      } else {
        // cien kontaktowy pod podstawa + miekki cien rzucany od okna (dzien) albo krotki wokol podstawy (wieczor)
        const bu = g.cu * k, bv = g.baza * k, rx = Math.max(3, (S.bw || .4) * g.w * .62 * k), ry = rx * clamp((g.baza - G.h) / F, .05, .6);
        x.save(); x.translate(bu, bv); x.scale(1, ry / rx);
        const gr = x.createRadialGradient(0, 0, 0, 0, 0, rx * 1.5);
        gr.addColorStop(0, 'rgba(25,18,12,' + (.42 + .2 * noc) + ')'); gr.addColorStop(.45, 'rgba(25,18,12,' + (.2 + .1 * noc) + ')'); gr.addColorStop(1, 'rgba(25,18,12,0)');
        x.fillStyle = gr; x.fillRect(-rx * 1.5, -rx * 1.5, rx * 3, rx * 3); x.restore();
        const s = sylwetka(L, 26);
        if (s && dzien > .01) {
          const dl = L.typ === 'stolowa' ? .55 : .8;
          const [tu, tv] = rzut(w.X - G.okno * dl * g.H, w.Y, w.Z + .45 * dl * g.H);
          const hp = g.h * k, wp = g.w * k;
          x.save(); x.globalAlpha = .2 * dzien;
          x.setTransform(1, 0, -(tu * k - bu) / hp, -(tv * k - bv) / hp, bu, bv);
          if (w.odb) { x.scale(-1, 1); }
          x.drawImage(s, -(w.odb ? 1 - g.ax : g.ax) * wp, -hp, wp, hp);
          x.restore();
        }
      }
    }
    // 2. kable i rozety na suficie
    for (const { w, g } of kolejka) {
      if (w.lamp.typ !== 'wiszaca') continue;
      const S = sw(w.lamp), cx = g.cu * k, y0 = g.sufit * k, y1 = g.top * k + 1, sk = F / w.Z * k;
      x.strokeStyle = S.kab || '#2b2926'; x.lineWidth = clamp(.007 * sk, .8, 4); x.lineCap = 'butt';
      x.beginPath(); x.moveTo(cx, Math.max(-2, y0)); x.lineTo(cx, y1); x.stroke();
      if (y0 > -10) {
        const rx = .062 * sk, sq = clamp((G.h - g.sufit) / F, .08, .9), ry = rx * sq, bh = .03 * sk;
        // delikatne zacienienie sufitu wokol rozety
        x.save(); x.translate(cx, y0); x.scale(1, sq);
        let gr = x.createRadialGradient(0, 0, 0, 0, 0, rx * 3.2);
        gr.addColorStop(0, 'rgba(40,32,24,.16)'); gr.addColorStop(1, 'rgba(40,32,24,0)');
        x.fillStyle = gr; x.fillRect(-rx * 3.2, -rx * 3.2, rx * 6.4, rx * 6.4); x.restore();
        const kol = S.roz || '#efede8';
        gr = x.createLinearGradient(cx - rx, 0, cx + rx, 0);
        gr.addColorStop(0, kol); gr.addColorStop(.35, '#fff'); gr.addColorStop(1, kol);
        x.fillStyle = gr;
        x.beginPath(); x.moveTo(cx - rx, y0); x.lineTo(cx - rx, y0 + bh); x.ellipse(cx, y0 + bh, rx, ry, 0, Math.PI, 0, true); x.lineTo(cx + rx, y0); x.closePath(); x.fill();
        x.fillStyle = 'rgba(0,0,0,.14)'; x.beginPath(); x.ellipse(cx, y0 + bh, rx, ry, 0, 0, Math.PI * 2); x.fill();
        x.fillStyle = kol; x.globalAlpha = .9; x.beginPath(); x.ellipse(cx, y0 + bh, rx * .97, ry * .97, 0, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1;
        x.fillStyle = 'rgba(0,0,0,.1)'; x.beginPath(); x.ellipse(cx, y0 + bh, rx * .97, ry * .97, 0, 0, Math.PI * 2); x.fill();
      }
    }
    // 3. wieczor: wnetrze oswietlone tylko lampami
    if (noc > 0) {
      if (lmBrudna) mapaSwiatla(ruch && !eksport ? 75 : (eksport || W > 1100 ? 150 : 120));
      x.globalCompositeOperation = 'multiply'; x.globalAlpha = noc;
      x.drawImage(lmC, 0, 0, W, H);
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    }
    // 4. lampy: kolory dopasowane do wnetrza, wieczorem ciemniejsza obudowa i swiecacy klosz
    for (const { w, g } of kolejka) {
      const L = w.lamp, im = obraz(L.id); if (!gotowy(im)) continue;
      const wp = g.w * k, hp = g.h * k, S = sw(L);
      const lok = jasnosc(g.cu, g.top + g.h / 2);
      const kDzien = mieszaj([1, 1, 1], tloSr.map(v => v / Math.max(...tloSr)), .22).map(v => v * lok);
      const kNoc = [.4, .36, .33];
      const kol = mieszaj(kDzien, kNoc, noc);
      const [c, cx2] = bufor(0, wp + 2, hp + 2);
      if (w.odb) { cx2.translate(wp, 0); cx2.scale(-1, 1); }
      cx2.drawImage(im, 0, 0, wp, hp);
      cx2.setTransform(1, 0, 0, 1, 0, 0);
      cx2.globalCompositeOperation = 'multiply'; cx2.fillStyle = rgb(kol); cx2.fillRect(0, 0, wp, hp);
      cx2.globalCompositeOperation = 'destination-in';
      if (w.odb) { cx2.translate(wp, 0); cx2.scale(-1, 1); }
      cx2.drawImage(im, 0, 0, wp, hp);
      x.drawImage(c, 0, 0, Math.ceil(wp), Math.ceil(hp), g.left * k, g.top * k, Math.ceil(wp), Math.ceil(hp));
      if (noc > 0) {
        // swiecaca czesc lampy (klosz, zarowka) w oryginalnej jasnosci
        const [c2, x2] = bufor(1, wp + 2, hp + 2);
        if (w.odb) { x2.translate(wp, 0); x2.scale(-1, 1); }
        x2.drawImage(im, 0, 0, wp, hp);
        x2.setTransform(1, 0, 0, 1, 0, 0);
        x2.globalCompositeOperation = 'destination-in';
        const ex = (g.lu - g.left) * k, ey = (g.lv - g.top) * k, re = Math.max(wp, hp) * (S.kat > 0 ? .3 : .75);
        const gr = x2.createRadialGradient(ex, ey, 0, ex, ey, re);
        gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.45, 'rgba(0,0,0,.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        x2.fillStyle = gr; x2.fillRect(0, 0, wp + 2, hp + 2);
        x.globalAlpha = noc; x.drawImage(c2, 0, 0, Math.ceil(wp), Math.ceil(hp), g.left * k, g.top * k, Math.ceil(wp), Math.ceil(hp));
        x.globalCompositeOperation = 'lighter'; x.globalAlpha = noc * .35;
        x.drawImage(c2, 0, 0, Math.ceil(wp), Math.ceil(hp), g.left * k, g.top * k, Math.ceil(wp), Math.ceil(hp));
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
      }
    }
    // 5. wieczor: poswiata wokol zrodla swiatla
    if (noc > 0) {
      x.globalCompositeOperation = 'screen';
      for (const { w, g } of kolejka) {
        const S = sw(w.lamp), kol = S.kol || CIEPLE, lu = g.lu * k, lv = g.lv * k;
        const rb = (Math.max(g.w, g.h) * (S.kat > 0 ? .7 : 1.15) + .03) * k, sila = S.kat > 0 ? .6 : 1;
        const c = (a, f) => 'rgba(' + Math.round(255 * kol[0]) + ',' + Math.round(255 * (kol[1] * .25 + .75 * f)) + ',' + Math.round(255 * (kol[2] * .5 + .5 * f * .8)) + ',' + a + ')';
        const gr = x.createRadialGradient(lu, lv, 0, lu, lv, rb);
        gr.addColorStop(0, c(.85 * noc * sila, .95)); gr.addColorStop(.12, c(.42 * noc * sila, .8)); gr.addColorStop(.4, c(.1 * noc * sila, .7)); gr.addColorStop(1, c(0, .7));
        x.fillStyle = gr; x.fillRect(lu - rb, lv - rb, rb * 2, rb * 2);
      }
      x.globalCompositeOperation = 'source-over';
    }
  }

  /* ---------- odswiezanie (na zadanie, raz na klatke) ---------- */
  let zaplan = false;
  function odswiez(swiatlo) {
    if (swiatlo !== false) lmBrudna = true;
    if (zaplan) return; zaplan = true;
    requestAnimationFrame(klatka);
  }
  let tPrzejscia = 0, czasKlatki = 0, ruch = false, ruchT = 0;
  // podczas przeciagania mapa swiatla w nizszej rozdzielczosci, po puszczeniu pelna jakosc
  function wRuchu() { ruch = true; clearTimeout(ruchT); ruchT = setTimeout(() => { ruch = false; odswiez(); }, 140); }
  function klatka(ts) {
    zaplan = false;
    if (noc !== nocCel) {
      if (!tPrzejscia) tPrzejscia = ts;
      const d = Math.min(1, (ts - tPrzejscia) / 450);
      noc = nocCel ? d : 1 - d;
      if (d >= 1) { noc = nocCel; tPrzejscia = 0; } else { zaplan = true; requestAnimationFrame(klatka); }
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(scena.clientWidth * dpr), H = Math.round(scena.clientHeight * dpr);
    if (!W || !H) return;
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const t0 = performance.now();
    rysujScene(ctx, W, H, false);
    czasKlatki = performance.now() - t0;
    uchwyty();
  }
  // przezroczyste uchwyty nad lampami: dotyk, klawiatura, ramka aktywnej
  function uchwyty() {
    const k = scena.clientHeight;
    warstwy.forEach(w => {
      const g = geo(w);
      Object.assign(w.el.style, { left: g.left * k + 'px', top: g.top * k + 'px', width: g.w * k + 'px', height: g.h * k + 'px' });
      w.el.classList.toggle('akt', w === aktywna);
    });
    cv.setAttribute('aria-label', 'Wnętrze z lampami: ' + (warstwy.map(w => w.lamp.marka + ' ' + w.lamp.nazwa).join(', ') || 'brak'));
  }

  /* ---------- ustawienie lamp w swiecie ---------- */
  function granice(w) {
    const pend = w.lamp.typ === 'wiszaca';
    const Zmax = pend ? G.Z0 - .35 : G.Z0 - .15, Zmin = pend ? 1.5 : 1.25;
    w.Z = clamp(w.Z, Zmin, Zmax);
    const m = pend ? .3 : .2;
    let X0 = G.XL + m, X1 = G.XR - m;
    if (G.wlasne || X0 < -50) { X0 = (-.02 - G.uv) * w.Z / F; X1 = (G.r + .02 - G.uv) * w.Z / F; }
    w.X = clamp(w.X, X0, X1);
    if (pend) w.drop = clamp(w.drop, .08, HS - .9 - wymiary(w).H);
    if (!pend && w.blat >= 0 && G.blaty[w.blat]) { const b = G.blaty[w.blat]; w.X = clamp(w.X, b.X0 + .06, b.X1 - .06); w.Z = clamp(w.Z, b.Zb + .05, b.Zd - .05); }
  }
  function domyslna(lamp, nr) {
    const wn = wnetrze, przes = [0, .22, -.22][nr] || 0;
    const w = { lamp, s: 1, odb: false, Y: 0, blat: -1, drop: .6, X: 0, Z: 3 };
    if (lamp.typ === 'wiszaca') {
      const b = G.blaty[wn.wis.blat];
      w.Z = b ? b.Zm : G.Z0 * (wn.wis.z || .55);
      w.X = b ? (b.X0 + b.X1) / 2 : (G.r / 2 - G.uv) * w.Z / F;
      w.drop = HS - wn.wis.dol - lamp.m;
    } else if (lamp.typ === 'podlogowa') {
      w.Z = F * G.hc / (wn.pod.v - G.h); w.X = (wn.pod.x * G.r - G.uv) * w.Z / F;
    } else {
      const b = G.blaty[wn.sto.blat];
      if (b) { w.blat = wn.sto.blat; w.Y = b.y; w.Z = b.Zm; w.X = (wn.sto.x * G.r - G.uv) * w.Z / F; }
      else { w.Y = wn.sto.y; w.Z = F * (G.hc - w.Y) / (wn.sto.v - G.h); w.X = (wn.sto.x * G.r - G.uv) * w.Z / F; }
    }
    w.X += przes * G.r * w.Z / F;
    granice(w);
    return w;
  }
  // przesuniecie po kadrze: punkt odniesienia lampy ma isc za palcem (gora/dol = dalej/blizej, z perspektywa)
  function przesun(w, st, du, dv) {
    const L = w.lamp;
    if (L.typ === 'wiszaca') {
      let e = HS - st.drop - wymiary(w).H / 2 - G.hc;
      if (Math.abs(e) < .35) e = e < 0 ? -.35 : .35;
      const inv = 1 / st.Z - dv / (F * e);
      w.Z = inv > 0 ? 1 / inv : 99;
    } else {
      const ut = G.uv + F * st.X / st.Z + du, vt = G.h + F * (G.hc - st.Y) / st.Z + dv;
      let blat = -1, Y = st.blat < 0 && !G.blaty.length ? st.Y : 0;
      if (L.typ === 'stolowa' && G.blaty.length && vt > G.h) {
        const kol = G.blaty.map((b, i) => [b, i]).sort((a, b) => b[0].y - a[0].y);
        for (const [b, i] of kol) {
          const Zc = F * (G.hc - b.y) / (vt - G.h), Xc = (ut - G.uv) * Zc / F;
          if (Zc >= b.Zb - .05 && Zc <= b.Zd + .05 && Xc >= b.X0 - .02 && Xc <= b.X1 + .02) { blat = i; Y = b.y; break; }
        }
      }
      if (L.typ === 'stolowa' && G.wlasne) Y = st.Y;
      w.blat = blat; w.Y = Y;
      const e = Math.max(.15, G.hc - Y);
      w.Z = vt - G.h > .003 ? F * e / (vt - G.h) : 99;
      if (blat >= 0) { const b = G.blaty[blat]; w.Z = clamp(w.Z, b.Zb, b.Zd); }
    }
    w.X = (F * st.X / st.Z + du) * w.Z / F;
    granice(w);
  }

  function utworz(lamp, poz) {
    const el = document.createElement('div');
    el.className = 'lampa';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', lamp.marka + ' ' + lamp.nazwa + '. Strzałki przesuwają, plus i minus zmieniają wielkość.');
    el.tabIndex = 0;
    const w = { uid: ++uid, ...poz, lamp, el };
    warstwyEl.append(el);
    obraz(lamp.id);
    podepnij(w);
    return w;
  }

  function aktywuj(w) {
    aktywna = w;
    if (w) {
      suwak.value = Math.round(w.s * 100);
      if (zakladka !== w.lamp.typ) pokazZakladke(w.lamp.typ);
    }
    pokazZwis();
    odswiez(false); odswiezPanel();
  }
  function pokazZwis() {
    const p = aktywna && aktywna.lamp.typ === 'wiszaca';
    zwisBox.hidden = !p;
    if (p) { zwis.value = Math.round(aktywna.drop * 100); zwisWart.textContent = Math.round(aktywna.drop * 100) + ' cm'; }
  }

  function dodaj(lamp) {
    if (warstwy.length >= 3) return;
    const w = utworz(lamp, domyslna(lamp, warstwy.length));
    warstwy.push(w); aktywuj(w); odswiez();
  }

  function wybierz(lamp) {
    if (!aktywna) return dodaj(lamp);
    if (aktywna.lamp.typ !== lamp.typ) {
      const nr = warstwy.indexOf(aktywna);
      Object.assign(aktywna, domyslna(lamp, nr), { lamp });
    } else {
      // ten sam typ: zostaje miejsce, wysokosc zawieszenia dolu lampy i skala
      if (lamp.typ === 'wiszaca') { const dol = HS - aktywna.drop - wymiary(aktywna).H; aktywna.lamp = lamp; aktywna.drop = HS - dol - wymiary(aktywna).H; }
      aktywna.lamp = lamp; granice(aktywna);
    }
    aktywna.el.setAttribute('aria-label', lamp.marka + ' ' + lamp.nazwa);
    obraz(lamp.id);
    aktywuj(aktywna); odswiez();
  }

  function usun(w) {
    w.el.remove();
    warstwy = warstwy.filter(x => x !== w);
    aktywuj(warstwy[warstwy.length - 1] || null); odswiez();
  }

  /* gesty: przeciaganie jednym palcem / mysza, szczypanie dwoma palcami, kolko myszy */
  function podepnij(w) {
    const el = w.el, pkt = new Map();
    let start = null;
    const stan = () => {
      const p = [...pkt.values()];
      if (p.length === 1) return { mx: p[0].x, my: p[0].y, d: 0 };
      return { mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2, d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) };
    };
    const zacznij = () => { start = { ...stan(), X: w.X, Z: w.Z, Y: w.Y, blat: w.blat, drop: w.drop, s: w.s, k: scena.clientHeight }; };
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
        w.s = clamp(start.s * s.d / start.d, .5, 2);
        suwak.value = Math.round(w.s * 100);
      }
      przesun(w, start, (s.mx - start.mx) / start.k, (s.my - start.my) / start.k);
      wRuchu();
      if (w.lamp.typ === 'wiszaca') pokazZwis();
      odswiez();
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
      const kl = { ArrowLeft: [-.08, 0], ArrowRight: [.08, 0], ArrowUp: [0, .15], ArrowDown: [0, -.15] }[e.key];
      if (kl) { e.preventDefault(); w.X += kl[0]; w.Z += kl[1]; granice(w); wRuchu(); odswiez(); }
      else if (e.key === '+' || e.key === '=') skaluj(w, 1.05);
      else if (e.key === '-') skaluj(w, 1 / 1.05);
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); usun(w); }
    });
    el.addEventListener('focus', () => { if (aktywna !== w) aktywuj(w); });
  }
  function skaluj(w, f) {
    const dol = HS - w.drop - wymiary(w).H;
    w.s = clamp(w.s * f, .5, 2);
    if (w.lamp.typ === 'wiszaca') w.drop = HS - dol - wymiary(w).H; // dol lampy zostaje na swojej wysokosci
    granice(w); suwak.value = Math.round(w.s * 100); pokazZwis(); wRuchu(); odswiez();
  }
  suwak.addEventListener('input', () => { if (aktywna) skaluj(aktywna, (suwak.value / 100) / aktywna.s); });
  zwis.addEventListener('input', () => {
    if (!aktywna || aktywna.lamp.typ !== 'wiszaca') return;
    aktywna.drop = zwis.value / 100; granice(aktywna);
    zwisWart.textContent = Math.round(aktywna.drop * 100) + ' cm';
    wRuchu(); odswiez();
  });
  $('#odbij').addEventListener('click', () => { if (aktywna) { aktywna.odb = !aktywna.odb; odswiez(); } });
  const wBtn = $('#wieczor');
  wBtn.addEventListener('click', () => {
    nocCel = nocCel ? 0 : 1;
    scena.classList.toggle('wieczor', !!nocCel);
    wBtn.setAttribute('aria-pressed', !!nocCel);
    tPrzejscia = 0; odswiez();
  });
  // klikniecie w puste tlo chowa ramke (czystszy podglad)
  cv.addEventListener('pointerdown', () => { scena.classList.add('bez-ramki'); });
  warstwyEl.addEventListener('pointerdown', e => { if (e.target.closest('.lampa')) scena.classList.remove('bez-ramki'); });

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
    wnetrze = wn; G = geometria(wn);
    wnEl.querySelectorAll('.wn').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === wn.id));
    wnEl.querySelector('.wgraj').classList.toggle('akt', wn.id === 'wlasne');
    tloMini = null;
    tlo.src = src || 'img/wnetrza/' + wn.id + '.webp';
    scena.style.aspectRatio = wn.r;
    // przestaw lampy na domyslne miejsca nowego wnetrza
    warstwy.forEach((w, i) => { const s = w.s, odb = w.odb; Object.assign(w, domyslna(w.lamp, i), { s, odb }); granice(w); });
    dopasujScene(); pokazZwis();
  }
  function dopasujScene() {
    const r = wnetrze.r;
    const maxH = window.innerHeight * (window.innerWidth <= 760 ? .62 : .74);
    scena.style.maxWidth = Math.round(maxH * r) + 'px';
    odswiez(false);
  }
  tlo.addEventListener('load', () => { analizaTla(); odswiez(); });
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


  /* zapis kadru do pliku: ta sama scena (swiatlo, cienie, perspektywa) w wyzszej rozdzielczosci */
  $('#zapisz').addEventListener('click', () => {
    const r = G.r, W = Math.round(Math.min(2000, Math.max(1600, scena.clientWidth * 2))), H = Math.round(W / r);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    lmBrudna = true; rysujScene(c.getContext('2d'), W, H, true); lmBrudna = true;
    c.toBlob(async blob => {
      if (!blob) return;
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
  if ('ResizeObserver' in window) new ResizeObserver(() => odswiez(false)).observe(scena);
  pokazZakladke('wiszaca');
  ustawWnetrze(wnetrze);
  dodaj(byId(wnetrze.start));
  // do testow: polozenie srodka lampy na scenie (px)
  const ekran = w => { const g = geo(w), k = scena.clientHeight; return { x: (g.left + g.w / 2) * k, y: (g.top + g.h / 2) * k }; };
  window.__luna = { warstwy: () => warstwy, LAMPY, dodaj, wybierz, byId, ekran, geo, G: () => G, czas: () => czasKlatki };
})();
