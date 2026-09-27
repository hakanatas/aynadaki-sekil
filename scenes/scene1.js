/* SAHNE 1 — AYNA (0–10 s)  Bir şekil ve bir simetri doğrusu.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /** rows of working at P; each [t0, t1, i, items, hot, tick, cross] */
  function rows(ctx, P, list, t, s, W) {
    const f = F();
    list.forEach(([t0, t1, i, items, hot, tick, cross]) => {
      const k = win(t, t0, t1); if (k <= 0) return;
      const y = P.y0 + i * P.dy;
      f.expr(ctx, items, P.x, y, s * 0.86, { alpha: k, halo: true, color: hot ? A.amber : undefined, w: W });
      if (tick) f.tick(ctx, P.x + tick, y - 6, seg(t, t0 + 0.4, t0 + 1.0), k);
      if (cross) f.crossInk(ctx, P.x + cross, y, 18, seg(t, t0 + 0.4, t0 + 1.2), k);
    });
  }

  const FIG = [[-6, 0], [-6, 5], [-3, 5], [-3, 4], [-5, 4], [-5, 3], [-4, 3], [-4, 2], [-5, 2], [-5, 0]];
  const refl = (P) => P.map(([x, y]) => [-x, y]);
  const shift = (P, d) => P.map(([x, y]) => [x + d, y]);
  const KEY = [['A', [-6, 5]], ['B', [-3, 5]], ['C', [-6, 0]]];
  const T1 = [[-7, 0], [-4, 0], [-7, 3]], T2 = refl(T1), HOUSE = [[1, 0], [5, 0], [5, 3], [3, 5], [1, 3]];

  function grid(ctx, G, a) {
    if (a <= 0) return;
    const U = (x, y) => [G.x + x * G.g, G.y - y * G.g];
    ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.12 * a})`; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let x = -8; x <= 8; x++) { const p = U(x, -1), q = U(x, 6); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
    for (let y = -1; y <= 6; y++) { const p = U(-8, y), q = U(8, y); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
    ctx.stroke();
  }
  function poly(ctx, G, P, a, k, seed, color, fill, dashed) {
    if (a <= 0 || k <= 0) return;
    const U = (p) => [G.x + p[0] * G.g, G.y - p[1] * G.g], Q = P.map(U);
    if (fill && k >= 1) { ctx.fillStyle = fill; ctx.beginPath(); Q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); }
    Q.forEach((p, i) => {
      const q = Q[(i + 1) % Q.length], kk = seg(k, i / Q.length, (i + 1) / Q.length); if (kk <= 0) return;
      if (dashed) { for (let j = 0; j < 6; j += 2) { const u0 = j / 6, u1 = Math.min(kk, (j + 1) / 6); if (u0 >= kk) break; Ink.path(ctx, [[lerp(p[0], q[0], u0), lerp(p[1], q[1], u0)], [lerp(p[0], q[0], u1), lerp(p[1], q[1], u1)]], { w: 3, alpha: a, seed: seed + i * 7 + j, taper: [0, 0], color }); } }
      else Ink.path(ctx, [p, [lerp(p[0], q[0], kk), lerp(p[1], q[1], kk)]], { w: 4.5, alpha: a, seed: seed + i, taper: [0.05, 0.05], color });
    });
  }
  function dash(ctx, G, p, q, a, k, seed, color) {
    if (a <= 0 || k <= 0) return;
    const U = (r) => [G.x + r[0] * G.g, G.y - r[1] * G.g], P = U(p), Q = U(q), n = 14;
    for (let j = 0; j < n; j += 2) { const u0 = j / n, u1 = Math.min(k, (j + 1) / n); if (u0 >= k) break; Ink.path(ctx, [[lerp(P[0], Q[0], u0), lerp(P[1], Q[1], u0)], [lerp(P[0], Q[0], u1), lerp(P[1], Q[1], u1)]], { w: 2.5, alpha: a, seed: seed + j, taper: [0, 0], color }); }
  }
  function dot(ctx, G, p, a, color, lab, s, dx = -18, dy = -22) {
    if (a <= 0) return;
    const x = G.x + p[0] * G.g, y = G.y - p[1] * G.g;
    ctx.fillStyle = color || `rgba(${LI.INK_RGB},${a})`; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill();
    if (lab) F().T(ctx, lab, x + dx, y + dy, { size: s * 0.6, alpha: a, halo: true, color: color ? A.amber : undefined });
  }
  function mirror(ctx, G, x, a, k, seed, color) {
    if (a <= 0 || k <= 0) return;
    const p = [G.x + x * G.g, G.y + 1.4 * G.g], q = [G.x + x * G.g, G.y - 6.4 * G.g];
    Ink.path(ctx, [p, [p[0], lerp(p[1], q[1], k)]], { w: 5, alpha: a, seed, taper: [0, 0], color: color || LI.INK_RGB });
  }
  function rightMark(ctx, G, x, y, a, seed) { if (a <= 0) return; const X = G.x + x * G.g, Y = G.y - y * G.g, r = 10; Ink.path(ctx, [[X, Y - r], [X + r, Y - r], [X + r, Y]], { w: 2.5, alpha: a, seed, taper: [0, 0] }); }
  function turn(ctx, G, c, dir, a, seed) {
    if (a <= 0) return;
    const X = G.x + c[0] * G.g, Y = G.y - c[1] * G.g, r = 26, P = [];
    for (let i = 0; i <= 16; i++) { const u = (-0.3 + i / 16 * 1.6) * Math.PI * dir; P.push([X + r * Math.cos(u), Y + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 3, alpha: a, seed, taper: [0, 0], color: LI.AMBER_RGB });
    const q = P[16], p = P[14], d = Math.atan2(q[1] - p[1], q[0] - p[0]);
    Ink.path(ctx, [[q[0] - 11 * Math.cos(d - 0.5), q[1] - 11 * Math.sin(d - 0.5)], q, [q[0] - 11 * Math.cos(d + 0.5), q[1] - 11 * Math.sin(d + 0.5)]], { w: 3, alpha: a, seed: seed + 1, taper: [0, 0], color: LI.AMBER_RGB });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Şeklin simetri doğrusuna göre görüntüsü nerede?'],
      [10.6, 27.8, 'Varsayım ve görüntüyü nokta nokta oluşturma'],
      [28.4, 45.8, 'Şekil ile görüntüsünü karşılaştıralım'],
      [46.4, 63.8, 'Şekil ile görüntüsü arasındaki ilişkiler'],
      [64.4, 79.8, 'Önermeyi kullanalım: simetrik mi, simetri doğrusu nerede?'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), f = F(), a = END(t), s = L.G.s, G = L.GRD, P = L.PN, V = env.V, WW = V ? 900 : 1000;
    const AMB = amber(1);
    grid(ctx, G, win(t, 4.6, 79.8) * a);
    // the figure and the mirror line (until 64)
    const fa = win(t, 4.8, 63.8) * a;
    mirror(ctx, G, 0, fa, seg(t, 4.8, 5.6), 9800);
    poly(ctx, G, FIG, fa, seg(t, 5.4, 7.0), 9810, undefined, `rgba(${LI.INK_RGB},${0.1 * fa})`);
    // 10–28: the guess (a slide), then point by point
    const gs = win(t, 12.4, 19.8) * a;
    poly(ctx, G, shift(FIG, 8), gs, seg(t, 12.6, 14.2), 9830, undefined, null, true);
    if (t > 16.0 && gs > 0) f.crossInk(ctx, G.x + 3.5 * G.g, G.y - 2.5 * G.g, 26, seg(t, 16.0, 16.8), gs);
    const pp = win(t, 18.4, 63.8) * a;
    KEY.forEach(([n, p], i) => {
      const k = seg(t, 18.6 + i * 1.4, 19.8 + i * 1.4);
      dot(ctx, G, p, pp * seg(t, 18.4, 18.8), null, n, s, p[0] === -3 ? 18 : -18);
      dash(ctx, G, p, [-p[0], p[1]], pp, k, 9850 + i * 20, LI.AMBER_RGB);
      dot(ctx, G, [-p[0], p[1]], pp * seg(k, 0.9, 1), AMB, n + '’', s, p[0] === -3 ? -18 : 18);
    });
    const im = win(t, 23.4, 63.8) * a;
    poly(ctx, G, refl(FIG), im, seg(t, 23.4, 25.4), 9900, LI.AMBER_RGB, amber(0.18 * im));
    // 28–46: compare
    const c = win(t, 29.0, 45.8) * a;
    if (c > 0) {
      const U = (x, y) => [G.x + x * G.g, G.y - y * G.g];
      f.T(ctx, '3', U(-4.5, 5)[0], U(-4.5, 5)[1] - 22, { size: s * 0.6, alpha: c * seg(t, 29.4, 29.8), color: A.amber, halo: true });
      f.T(ctx, '3', U(4.5, 5)[0], U(4.5, 5)[1] - 22, { size: s * 0.6, alpha: c * seg(t, 29.8, 30.2), color: A.amber, halo: true });
      f.T(ctx, '5', U(-6, 2.5)[0] - 22, U(-6, 2.5)[1], { size: s * 0.6, alpha: c * seg(t, 30.4, 30.8), color: A.amber, halo: true });
      f.T(ctx, '5', U(6, 2.5)[0] + 22, U(6, 2.5)[1], { size: s * 0.6, alpha: c * seg(t, 30.8, 31.2), color: A.amber, halo: true });
      turn(ctx, G, [-4.5, 2.5], 1, c * seg(t, 36.4, 37.0), 9920);
      turn(ctx, G, [4.5, 2.5], -1, c * seg(t, 37.2, 37.8), 9930);
    }
    rows(ctx, P, [[31.4, 45.8, 0, ['AB = A’B’ = 3 birim · AC = A’C’ = 5 birim · açılar aynı']]], t, s, WW);
    // 46–64: the joining segments are perpendicular and halved
    const r4 = win(t, 47.0, 63.8) * a;
    if (r4 > 0) KEY.forEach(([n, p], i) => {
      rightMark(ctx, G, 0, p[1], r4 * seg(t, 48.0 + i * 0.4, 48.4 + i * 0.4), 9950 + i);
      const U = (x, y) => [G.x + x * G.g, G.y - y * G.g], d = String(Math.abs(p[0]));
      if (i < 2) { f.T(ctx, d, U(p[0] / 2, p[1])[0], U(p[0] / 2, p[1])[1] + 20, { size: s * 0.55, alpha: r4 * seg(t, 50.0, 50.4), color: A.amber, halo: true }); f.T(ctx, d, U(-p[0] / 2, p[1])[0], U(-p[0] / 2, p[1])[1] + 20, { size: s * 0.55, alpha: r4 * seg(t, 50.0, 50.4), color: A.amber, halo: true }); }
    });
    rows(ctx, P, [[52.4, 63.8, 0, ['Birleştiren doğru parçaları simetri doğrusuna dik ve ondan ikiye bölünüyor']]], t, s, WW);
    // 64–72: two triangles: symmetric? 72–80: a house: where is its line?
    const q1 = win(t, 64.8, 71.6) * a;
    poly(ctx, G, T1, q1, seg(t, 65.0, 65.8), 9960, undefined, `rgba(${LI.INK_RGB},${0.1 * q1})`);
    poly(ctx, G, T2, q1, seg(t, 65.6, 66.4), 9970, undefined, `rgba(${LI.INK_RGB},${0.1 * q1})`);
    T1.forEach((p, i) => { dash(ctx, G, p, T2[i], q1, seg(t, 66.8 + i * 0.4, 67.4 + i * 0.4), 9980 + i * 20, LI.AMBER_RGB); dot(ctx, G, [0, p[1]], q1 * seg(t, 67.6 + i * 0.4, 68.0 + i * 0.4), AMB); });
    mirror(ctx, G, 0, q1, seg(t, 69.0, 70.0), 9990, LI.AMBER_RGB);
    const q2 = win(t, 72.0, 79.8) * a;
    poly(ctx, G, HOUSE, q2, seg(t, 72.2, 73.4), 10000, undefined, `rgba(${LI.INK_RGB},${0.1 * q2})`);
    dash(ctx, G, [1, 3], [5, 3], q2, seg(t, 73.8, 74.6), 10010, LI.AMBER_RGB);
    dot(ctx, G, [1, 3], q2 * seg(t, 73.6, 74.0), null); dot(ctx, G, [5, 3], q2 * seg(t, 73.6, 74.0), null); dot(ctx, G, [3, 3], q2 * seg(t, 74.6, 75.0), AMB);
    mirror(ctx, G, 3, q2, seg(t, 75.2, 76.2), 10020, LI.AMBER_RGB);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.4, 10.2, 'Şekil simetri doğrusunun solunda'], [11.4, 17.6, 'Varsayım: görüntü, şeklin sağa kaydırılmışı mı?'],
      [18.0, 27.8, 'Her köşeyi doğruya dik olarak karşıya, aynı uzaklığa taşı'], [29.4, 45.8, 'Kenar uzunlukları ve açılar aynı: şekil ile görüntüsü eş'],
      [47.4, 63.8, 'A, doğrudan 6 birim uzakta; A’ de 6 birim'], [65.0, 71.6, 'Eş iki üçgen: karşılıklı noktaları birleştir'],
      [72.4, 79.8, 'Simetrik bir şekil: karşılıklı iki noktayı birleştir, ortasından dik çiz']]);
    exprs(ctx, t, at(W, 1), [[16.0, 27.8, 'Kaydırınca F ters dönmüyor: varsayım tutmadı'], [36.4, 45.8, 'Ama dönüş yönü ters: biri saat yönünde, öteki tersine'],
      [52.4, 63.8, 'Her noktanın görüntüsü doğrunun öbür yanında, aynı uzaklıkta'], [68.0, 71.6, 'Orta noktalar bir doğru üzerinde ve bağlar ona dik: simetrik'],
      [76.4, 79.8, 'Bu doğru evin simetri doğrusu']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, 'Görüntü nasıl oluşur?', true], [24.6, 27.8, 'Görüntü, şeklin aynadaki hali', true],
      [41.0, 45.8, 'Yansımada şekil ve görüntüsü eştir, yönleri terstir', true],
      [57.4, 63.8, 'Simetri doğrusu, noktayı görüntüsüne bağlayan doğru parçasının orta dikmesidir', true],
      [77.0, 79.8, 'Önerme simetriyi sınamaya ve doğruyu çizmeye yarar', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Her noktayı doğruya dik, eşit uzaklığa taşı', 80.6], ['Şekil ile görüntüsü eş, yönü ters', 81.6], ['Birleştiren parçalar doğruya dik ve ortalanmış', 82.6], ['Simetri doğrusu: orta dikme!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A mirror', nameTr: 'Ayna', concept: 'A figure and a line', conceptTr: 'Şekil ve doğru', render });
})(window.LI = window.LI || {});
