// bridge.js: the physical move OUT of part 1's last frame INTO the Vilas spectacle (cfg.opening = "bridge").
// Shared by comp/index.html (amber lasers) and presets/locate-dancers/index.html (purple/blue/red + dancers).
// Ported from assets/bridge (the transitions Noah liked); the destination is no longer a demo website, it is the LIVE spectacle scene,
// rendered into an offscreen canvas every frame, so the wordmark and lasers are already moving while the move lands.
// u runs 0..1 over the move (0 .. cfg.tImp1). u = 0 is exactly part 1's last frame (no pop at the seam); u = 1 is exactly the scene.
// Types: zoom | iris | whip | shatter | doors | glitch   (cfg.bridge.type; see references/transitions.md for which story calls for which)
(() => {
  const W = 720, H = 1280, CX = 360;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const eo = (t) => 1 - Math.pow(1 - clamp(t), 3), eio = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  let g, I, T, SHARDS = null;
  function drawFit(img, s = 1, cx = CX, cy = H / 2, ox = 0, oy = 0, a = 1) {
    g.save(); g.globalAlpha *= a; g.translate(cx + ox, cy + oy); g.scale(s, s); g.translate(-cx, -cy); g.drawImage(img, 0, 0, W, H); g.restore();
  }
  function flashAt(u, u0, k = 9, max = 0.7, col = '255,250,240') { const d = u - u0; if (d < 0) return; const a = max * Math.exp(-d * k * 3); if (a > 0.01) { g.fillStyle = `rgba(${col},${a})`; g.fillRect(-60, -60, W + 120, H + 120); } }
  function blurDraw(img, off, L, vertical) {
    const N = L < 6 ? 1 : 16;
    for (let k = 0; k < N; k++) { const o = off + (N === 1 ? 0 : (k / (N - 1) - 0.5) * L); g.save(); g.globalAlpha = 1 / (k + 1); vertical ? g.drawImage(img, 0, o, W, H) : g.drawImage(img, o, 0, W, H); g.restore(); }
  }
  // dive at the focal point (a tunnel, a mouth, a hole, a light, a planet), radial blur, arrive inside the scene
  function zoom(u, b) {
    const fx = (b.focus || [0.5, 0.5])[0] * W, fy = (b.focus || [0.5, 0.5])[1] * H, a = clamp(u / 0.62), S = 1 + 9 * Math.pow(a, 2.4);
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    drawFit(I, S, fx, fy); for (let k = 1; k <= 7; k++) drawFit(I, S * (1 + 0.035 * k * a), fx, fy, 0, 0, 0.2);
    const q = clamp((u - 0.5) / 0.5);
    if (q > 0) { const S2 = 1 + 1.6 * (1 - eo(q)); drawFit(T, S2, fx, fy, 0, 0, eo(q)); for (let k = 1; k <= 5; k++) drawFit(T, S2 * (1 + 0.04 * k * (1 - q)), fx, fy, 0, 0, 0.18 * (1 - q)); }
    flashAt(u, 0.5, 6, 0.55);
  }
  // match-cut through a round shape (a hole, an eye, a wheel, a lens, a planet, a plate): push in, the circle opens like an iris onto the scene
  function iris(u, b) {
    const ci = b.circle || { cx: 0.5, cy: 0.5, r: 0.2 }, cx = ci.cx * W, cy = ci.cy * H, r0 = ci.r * W;
    const S = 1 + 0.5 * eio(clamp(u / 0.55)) + 0.3 * clamp((u - 0.55) / 0.45);
    drawFit(I, S, cx, cy);
    const diag = Math.hypot(W, H) * 1.1, pop = eo(u / 0.2), R = r0 * S * pop + Math.pow(clamp((u - 0.2) / 0.8), 2.2) * diag;
    g.fillStyle = `rgba(0,0,0,${0.35 * clamp(u / 0.4) * (1 - clamp((u - 0.7) / 0.3))})`; g.fillRect(-60, -60, W + 120, H + 120);
    const prog = eo(clamp((u - 0.1) / 0.9)), ox = (cx - CX) * (1 - prog), oy = (cy - H / 2) * (1 - prog), sT = 1 + 0.55 * (1 - prog);
    g.save(); g.beginPath(); g.arc(cx, cy, Math.max(0.01, R), 0, Math.PI * 2); g.clip(); drawFit(T, sT, CX, H / 2, ox, oy); g.restore();
    if (R < diag * 0.98) { g.save(); g.lineWidth = 3 + 5 * (1 - u); g.strokeStyle = 'rgba(255,248,235,0.95)'; g.shadowColor = 'rgba(255,230,200,0.9)'; g.shadowBlur = 24; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.restore(); }
  }
  // whip-pan in the direction the story is already moving (left/right: a throw, a race; up/down: a launch, a fall, a vault)
  function whip(u, b) {
    const dirn = b.dir || 'left', e = eio(u), vertical = dirn === 'up' || dirn === 'down', S = vertical ? H : W;
    const L = (vertical ? 300 : 260) * Math.sin(Math.PI * clamp(u)) + 4, D = e * S * 1.15, sign = (dirn === 'right' || dirn === 'down') ? 1 : -1;
    const tPos = sign > 0 ? -Math.max(0, S - D) : Math.max(0, S - D);
    blurDraw(T, tPos, L, vertical); blurDraw(I, sign * D, L, vertical);
    flashAt(u, 0.5, 4, 0.2);
  }
  // an impact: part 1 cracks, then breaks into shards that fly at the camera; the scene is behind it
  function buildShards(b) {
    const R = rng(5), cols = 6, rows = 10, cw = W / cols, rh = H / rows, ix = (b.impact || [0.5, 0.5])[0] * W, iy = (b.impact || [0.5, 0.5])[1] * H; SHARDS = [];
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const x0 = q * cw, y0 = r * rh, x1 = x0 + cw, y1 = y0 + rh;
      for (const pts of [[[x0, y0], [x1, y0], [x0, y1]], [[x1, y0], [x1, y1], [x0, y1]]]) {
        const cxs = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cys = (pts[0][1] + pts[1][1] + pts[2][1]) / 3, dx = cxs - ix, dy = cys - iy, d = Math.hypot(dx, dy) + 1;
        SHARDS.push({ pts, cx: cxs, cy: cys, dx: dx / d, dy: dy / d, v: (700 + R() * 900) / (1 + d / 700), w: (R() - 0.5) * 7, delay: d * 0.0007 + R() * 0.03 });
      }
    }
  }
  function shatter(u, b, dur) {
    const t = u * dur, ix = (b.impact || [0.5, 0.5])[0] * W, iy = (b.impact || [0.5, 0.5])[1] * H;
    if (t < 0.1) {
      drawFit(I); const k = clamp(t / 0.08), R = rng(9); g.save(); g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 2; g.shadowColor = '#fff'; g.shadowBlur = 12;
      for (let i = 0; i < 14; i++) { const an = R() * Math.PI * 2, len = (120 + R() * 360) * k; g.beginPath(); g.moveTo(ix, iy); g.lineTo(ix + Math.cos(an) * len, iy + Math.sin(an) * len); g.stroke(); } g.restore();
      return;
    }
    drawFit(T, 1 + 0.14 * (1 - eo(u)));
    g.fillStyle = `rgba(0,0,0,${0.5 * (1 - eo(u * 1.4))})`; g.fillRect(0, 0, W, H);
    for (const s of SHARDS) {
      const tau = Math.max(0, t - 0.1 - s.delay), px = s.dx * s.v * tau, py = s.dy * s.v * tau + 750 * tau * tau, rot = s.w * tau, sc = 1 + 0.9 * tau, a = clamp(1 - tau / (dur * 0.9 - 0.1));
      if (a <= 0.01) continue;
      g.save(); g.globalAlpha = a; g.translate(s.cx + px, s.cy + py); g.rotate(rot); g.scale(sc, sc); g.translate(-s.cx, -s.cy);
      g.beginPath(); g.moveTo(s.pts[0][0], s.pts[0][1]); g.lineTo(s.pts[1][0], s.pts[1][1]); g.lineTo(s.pts[2][0], s.pts[2][1]); g.closePath();
      g.clip(); g.drawImage(I, 0, 0, W, H); g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1.2; g.stroke(); g.restore();
    }
    flashAt(u, 0.1 / dur, 5, 0.35);
  }
  // elevator doors: part 1 splits down the middle and slides apart, light spills, the scene is inside
  function doors(u) {
    const hold = 0.14, e = eio(clamp((u - hold) / (1 - hold))), gap = e * (W / 2 + 14);
    drawFit(T, 1 + 0.07 * (1 - e));
    if (gap > 1) { const gr = g.createLinearGradient(CX - gap, 0, CX + gap, 0); gr.addColorStop(0, 'rgba(255,244,225,0)'); gr.addColorStop(0.5, `rgba(255,244,225,${0.5 * (1 - e)})`); gr.addColorStop(1, 'rgba(255,244,225,0)'); g.fillStyle = gr; g.fillRect(CX - gap, 0, gap * 2, H); }
    g.save(); g.translate(-gap, 0); g.beginPath(); g.rect(0, 0, CX, H); g.clip(); g.drawImage(I, 0, 0, W, H); g.restore();
    g.save(); g.translate(gap, 0); g.beginPath(); g.rect(CX, 0, W - CX, H); g.clip(); g.drawImage(I, 0, 0, W, H); g.restore();
  }
  // digital tear: RGB split + sliced bands on part 1, black flicker, the scene snaps in and settles (tech / signal / screen stories)
  let CH_I = null;
  function channels(img) {
    const out = [];
    for (const ch of [0, 1, 2]) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const q = cv.getContext('2d'); q.drawImage(img, 0, 0, W, H);
      const d = q.getImageData(0, 0, W, H); for (let i = 0; i < d.data.length; i += 4) for (let k = 0; k < 3; k++) if (k !== ch) d.data[i + k] = 0; q.putImageData(d, 0, 0); out.push(cv); }
    return out;
  }
  function glitch(u, b, dur, f) {
    const src = u < 0.55 ? 0 : 1, intensity = u < 0.55 ? clamp(u / 0.5) : 1 - clamp((u - 0.62) / 0.38), R = rng(f * 31 + 7), img = src ? T : I;
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    if (intensity < 0.02) { g.drawImage(img, 0, 0, W, H); return; }
    const chans = src ? channels(T) : CH_I, split = 22 * intensity * intensity;
    g.save(); g.globalCompositeOperation = 'lighter'; [-1, 0, 1].forEach((dx, i) => g.drawImage(chans[i], dx * split, 0, W, H)); g.restore();
    const n = Math.floor(4 + 18 * intensity), sf = img.width / W;   // last.png is 720 wide, the scene canvas 1080
    for (let k = 0; k < n; k++) { const yy = R() * H, hh = 6 + R() * 50 * intensity, dx = (R() - 0.5) * 220 * intensity; g.drawImage(img, 0, yy * sf, img.width, hh * sf, dx, yy, W, hh); }
    g.fillStyle = 'rgba(0,0,0,0.22)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1.4);
    if (u > 0.5 && u < 0.62 && Math.floor(f) % 3 === 0) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); }
  }
  window.BRIDGE = {
    async setup(cfg) {
      const b = cfg.bridge || {};
      I = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('missing ../in/last.png (part 1\'s last kept frame; scripts/prep_spectacle.sh writes it)')); im.src = '../in/last.png'; });
      if (b.type === 'shatter') buildShards(b);
      if (b.type === 'glitch') CH_I = channels(I);
      if (!['zoom', 'iris', 'whip', 'shatter', 'doors', 'glitch'].includes(b.type)) throw new Error('cfg.bridge.type must be zoom|iris|whip|shatter|doors|glitch');
    },
    // ctx: the main context (design units 720x1280 at 1.5x). scene: an offscreen 1080x1920 canvas holding the spectacle at this time.
    draw(ctx, u, f, scene, cfg) {
      g = ctx; T = scene; const b = cfg.bridge, dur = cfg.tImp1;
      if (u <= 0) { g.drawImage(I, 0, 0, W, H); return; }
      ({ zoom, iris, whip, doors })[b.type]?.(u, b);
      if (b.type === 'shatter') shatter(u, b, dur);
      if (b.type === 'glitch') glitch(u, b, dur, f);
    },
  };
})();
