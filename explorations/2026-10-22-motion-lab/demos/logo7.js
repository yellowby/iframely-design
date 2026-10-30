/* L28–L29 · L23 as text only: links in as text, data out as text. One Canvas 2D character field to the right of the hero copy.
   A loose field of symbols drifts in the background (after L21). URLs decode out of the noise in random places, their
   characters are pulled into the // mark, the mark turns half a turn (a // turned 180° is the same //), and the results
   decode out on the right as key/value text. Then everything dissolves back into the noise and the next three URLs come.
   L28 logo-hero-glyphs: vector // in the middle, characters fly on smooth curves, sparse noise.
   L29 logo-hero-ascii: everything on the grid: the // itself is drawn in characters and turns cell by cell, flying
   characters snap to cells, denser noise. Uses DEMOS.loop / canvas2d and the hero shell from demos/logo6.js. */
(() => {
  const K = DEMOS.logoKit, BLUE = '#0055ff', INK = '#0a0a0a';
  const FONT = '"JetBrains Mono", ui-monospace, Menlo, monospace';
  const SETS = [
    [
      { u: 'youtube.com/watch?v=dQw4w9WgXcQ', host: 'youtube.com', d: [['type', 'video'], ['title', '"Never Gonna Give You Up"'], ['html', '<iframe src="//cdn.iframe.ly/x7Kd2">']] },
      { u: 'nytimes.com/2026/10/21/technology/web-glue', host: 'nytimes.com', d: [['type', 'article'], ['md', '# The quiet software that…'], ['access', 'preview only']] },
      { u: 'open.spotify.com/track/4uLU6hMC', host: 'open.spotify.com', d: [['type', 'audio'], ['title', '"Kerala" · Bonobo'], ['player', '152×80 · oEmbed']] },
    ],
    [
      { u: 'github.com/itteco/iframely', host: 'github.com', d: [['type', 'repo'], ['md', '# Iframely · README.md'], ['image', '1200×600']] },
      { u: 'example.com/members/only/story', host: 'example.com', d: [['title', '"Members only"'], ['access', 'blocked'], ['rule', 'publisher']] },
      { u: 'maps.google.com/?q=50.4501,30.5234', host: 'maps.google.com', d: [['type', 'map'], ['geo', '50.4501, 30.5234'], ['html', '<iframe … 4:3>']] },
    ],
  ];
  const SCR = '!<>-_\\/[]{}=+*^?#%&$:;.'; /* scramble glyphs */
  const CYC = 11.8; /* seconds per cycle */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rch = () => SCR[Math.random() * SCR.length | 0];

  function mount(stage, ascii) {
    const v = K.heroShell(stage); v.style.height = '92%';
    const cv = DEMOS.canvas2d(v); cv.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    const ctx = cv.ctx;
    const RAMP = ascii ? ' .,:;-=+*/\\|#' : ' ..·:-=+*/';
    const HASH = Float32Array.from({ length: 4099 }, rng(ascii ? 11 : 5));
    let W = 0, H = 0, fs = 12, cw = 7, chh = 18, cols = 0, rows = 0, ox = 0, oy = 0, cx = 0, cy = 0, MH = 100;
    let cycleN = -1, texts = [], hold = new Map();
    const X = c => ox + c * cw, Y = r => oy + r * chh + chh / 2;
    const resize = () => {
      const s = cv.resize(); W = s.w; H = s.h;
      fs = clamp(Math.round(W / 62), 11, 14); cw = fs * .6; chh = Math.round(fs * 1.6);
      cols = Math.floor(W / cw); rows = Math.floor(H / chh); ox = (W - cols * cw) / 2; oy = (H - rows * chh) / 2;
      cx = W * .46; cy = H * .5; MH = Math.min(H * .3, W * .2);
      cycleN = -1; /* rebuild the layout for the new grid */
    };
    /* text objects for one cycle: three URLs on the left, three result blocks on the right, placed at random */
    const build = n => {
      const R = rng(n * 9973 + 7), set = SETS[n % SETS.length]; texts = [];
      const leftCols = Math.floor(cols * .4), rightC = Math.ceil(cols * .64), avail = cols - rightC - 1;
      const top = 1, bandH = Math.max(5, Math.floor((rows - 2) / 3));
      set.forEach((U, k) => {
        const cap = Math.min(leftCols - 2, Math.max(18, Math.floor(leftCols * .78))); let s = 'https://' + U.u; if (s.length > cap) s = s.slice(0, cap - 1) + '…';
        const r = top + k * bandH + Math.floor(R() * Math.max(1, bandH - 1)), c = 1 + Math.floor(R() * Math.max(1, leftCols - s.length - 1));
        texts.push({ kind: 'url', s, c, r, tIn: .2 + k * .55, tPull: 2.5 + k * .28, slash: s.indexOf('//') });
      });
      const order = [0, 1, 2].sort(() => R() - .5); /* blocks land in shuffled bands */
      set.forEach((U, k) => {
        const lines = [U.host, ...U.d.map(([a, b]) => a.padEnd(7) + b)].map(l => l.length > avail ? l.slice(0, avail - 1) + '…' : l);
        const wmax = Math.max(...lines.map(l => l.length)), b = order[k];
        const r0 = top + b * bandH + Math.floor(R() * Math.max(1, bandH - lines.length)), c0 = rightC + Math.floor(R() * Math.max(1, avail - wmax));
        lines.forEach((s, l) => texts.push({ kind: l ? 'kv' : 'host', s, c: c0, r: r0 + l, tIn: 5.5 + k * .45 + l * .14, tOut: 10.2 + k * .12 }));
      });
    };
    /* where a moving glyph is at progress p along a curve from a to b; L29 snaps it to cells */
    const along = (ax, ay, bx, by, p, bend) => {
      const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, qx = mx - dy * bend, qy = my + dx * bend, u = 1 - p;
      let x = u * u * ax + 2 * u * p * qx + p * p * bx, y = u * u * ay + 2 * u * p * qy + p * p * by;
      if (ascii) { x = ox + Math.round((x - ox) / cw) * cw; y = oy + Math.round((y - oy - chh / 2) / chh) * chh + chh / 2; }
      return [x, y];
    };
    /* the // as two parallelograms, centred on (0,0) */
    const quads = () => { const sh = MH, sw = sh * .2, gap = sh * .2, tilt = sh * .36, tw = sw * 2 + gap + tilt, x0 = -tw / 2, q = x => [[x + tilt, -sh / 2], [x + tilt + sw, -sh / 2], [x + sw, sh / 2], [x, sh / 2]]; return [q(x0), q(x0 + sw + gap)]; };
    const inQuad = (px, py, q) => { for (let i = 0; i < 4; i++) { const [ax, ay] = q[i], [bx, by] = q[(i + 1) % 4]; if ((bx - ax) * (py - ay) - (by - ay) * (px - ax) < 0) return false; } return true; };
    const glyph = (ch, x, y, color, alpha, bold) => { ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.font = (bold ? '800 ' : '500 ') + fs + 'px ' + FONT; ctx.fillText(ch, x, y); };

    const frame = (time, still) => {
      const n = Math.floor(time / CYC), T = still ? 8.4 : time - n * CYC;
      if (n !== cycleN) { cycleN = n; build(n); hold.clear(); }
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      /* mark state */
      const rot = io(clamp((T - 4.1) / 1.4)) * Math.PI, swell = 1 + .08 * Math.sin(Math.PI * clamp((T - 2.9) / 1.6)), ring = clamp(Math.min((T - 3.7) / .4, (5.9 - T) / .4));
      /* rects the noise keeps clear */
      const clear = texts.filter(t => T > t.tIn - .15 && T < (t.kind === 'url' ? t.tPull + .9 : t.tOut + .5)).map(t => [t.c - 1, t.r, t.c + t.s.length, t.r]);
      /* background noise: a slow density field, faded at the edges and around the mark */
      ctx.font = '400 ' + fs + 'px ' + FONT; ctx.fillStyle = INK;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = X(c), y = Y(r);
        /* two warped waves give drifting patches; a fixed per-cell hash thins them into scattered glyphs */
        const f = .5 + .5 * Math.sin(c * .11 + time * .4 + 1.7 * Math.sin(r * .13 + time * .2)) * Math.sin(r * .19 - time * .25 + 1.3 * Math.sin(c * .07 - time * .15));
        const hsh = HASH[(r * 131 + c) % HASH.length];
        if (hsh > f * (ascii ? 1.15 : .85) - .1) continue;
        let a = (ascii ? .12 + .3 * f : .06 + .2 * f);
        const k = Math.floor((f * .75 + hsh * .25) * RAMP.length); if (k <= 0) continue;
        const d = Math.hypot(x - cx, y - cy); a *= clamp((d - MH * .55) / (MH * .5));
        a *= clamp(Math.min(x, W - x) / 48) * clamp(Math.min(y, H - y) / 36);
        if (a < .02) continue;
        let skip = false; for (const q of clear) if (c >= q[0] && c <= q[2] && r === q[1]) { skip = true; break; } if (skip) continue;
        ctx.globalAlpha = a; ctx.fillText(Math.random() < .004 ? rch() : RAMP[Math.min(k, RAMP.length - 1)], x, y);
      }
      /* texts */
      for (const t of texts) {
        const url = t.kind === 'url';
        if (url && T > t.tIn && T < t.tPull + .4) { const shown = clamp((T - t.tIn) / (t.s.length * .025 + .2)); ctx.globalAlpha = 1 - clamp((T - t.tPull) / .4); ctx.fillStyle = '#f0f5ff'; ctx.fillRect(X(t.c) - 4, Y(t.r) - chh / 2 + 2, t.s.length * cw * shown + 8, chh - 4); }
        for (let i = 0; i < t.s.length; i++) {
          const ch = t.s[i]; if (ch === ' ') continue;
          const x = X(t.c + i), y = Y(t.r);
          if (url) {
            const a = t.tIn + i * .025, ps = t.tPull + i * .014; if (T < a) continue;
            const col = i >= t.slash && i < t.slash + 2 ? BLUE : INK, bold = col === BLUE;
            if (!still && T >= ps) { const p = (T - ps) / .85; if (p < 1) { const [px, py] = along(x, y, cx, cy, io(p), .22); glyph(ch, px, py, BLUE, 1 - p * p, bold); } continue; }
            T < a + .22 ? glyph(rch(), x, y, '#9fb6e8', 1) : glyph(ch, x, y, col, 1, bold);
          } else {
            const at = t.tIn + i * .02, o = t.tOut + i * .01;
            if (T < at - .6 || T > o + .2) continue;
            if (T < at) { const p = (T - (at - .6)) / .6; const [px, py] = along(cx, cy, x, y, io(p), -.18); glyph(ch, px, py, BLUE, .25 + .75 * p); continue; }
            if (T < at + .2 || T > o) { glyph(rch(), x, y, '#9fb6e8', 1); continue; }
            const key = t.kind === 'kv' && i < 7, col = t.kind === 'host' ? '#9a9a9a' : key ? BLUE : INK;
            glyph(ch, x, y, col, 1, key);
          }
        }
      }
      /* the mark, drawn last so incoming glyphs disappear into it */
      const Q = quads();
      if (ascii) {
        const cs = Math.cos(-rot), sn = Math.sin(-rot), rad = MH * .8 * swell;
        for (let r = Math.floor((cy - rad - oy) / chh); r <= Math.ceil((cy + rad - oy) / chh); r++) for (let c = Math.floor((cx - rad - ox) / cw); c <= Math.ceil((cx + rad - ox) / cw); c++) {
          const px = (X(c) + cw / 2 - cx) / swell, py = (Y(r) - cy) / swell, qx = px * cs - py * sn, qy = px * sn + py * cs;
          if (inQuad(qx, qy, Q[0]) || inQuad(qx, qy, Q[1])) glyph(rot > .05 && rot < Math.PI - .05 ? SCR[(c * 7 + r * 3 + Math.floor(time * 12)) % SCR.length] : '/', X(c), Y(r), BLUE, 1, true);
        }
      } else {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(swell, swell); ctx.globalAlpha = 1; ctx.fillStyle = BLUE;
        for (const q of Q) { ctx.beginPath(); q.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
        ctx.restore();
      }
      if (ring > 0) for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + time * 1.6, rr = MH * (ascii ? .9 : .82); let x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .9; if (ascii) { x = ox + Math.round((x - ox) / cw) * cw; y = oy + Math.round((y - oy - chh / 2) / chh) * chh + chh / 2; } glyph(i % 4 ? '·' : '/', x, y, BLUE, ring * (.35 + .4 * (i % 2)), i % 4 === 0); }
      ctx.globalAlpha = 1;
    };
    const ro = new ResizeObserver(resize); ro.observe(v); resize();
    if (DEMOS.reduced) { requestAnimationFrame(() => { resize(); frame(0, true); }); return () => { ro.disconnect(); cv.destroy(); }; }
    let time = 0;
    const lp = DEMOS.loop(v, (t, dt) => { if (!stage.matches(':hover')) time += dt; frame(time, false); });
    stage._seek = s => { time = s; }; /* for checking a phase by hand */
    return () => { lp.destroy(); ro.disconnect(); cv.destroy(); };
  }

  DEMOS.register('logo-hero-glyphs', {
    group: 'logo', pick: 'pick', title: 'Hero: links in as text, data out as text',
    blurb: 'L23 in text only. Symbols drift in the background; three URLs decode out of the noise in random places, their characters are pulled into the //, the // turns half a turn, and the results decode out on the right as key/value lines. Then it all dissolves back into the noise. Hover pauses.',
    mount: stage => mount(stage, false),
  });
  DEMOS.register('logo-hero-ascii', {
    group: 'logo', title: 'Hero: the same, all on the character grid',
    blurb: 'The same story where everything is a cell: the // is drawn in characters and scrambles while it turns, the URL and data characters hop along the grid, and the background is denser, closer to L21.',
    mount: stage => mount(stage, true),
  });
})();
