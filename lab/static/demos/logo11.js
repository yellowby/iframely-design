/* L38–L39 · L36/L37 with the rain replaced by a cellular automaton. The whole hero background is a Life grid
   (B3/S23 on the character grid) with a short decay trail: live cells are dark glyphs (* or # by neighbours), dying cells
   fade through + : . in grey. Small random soups are dropped in now and then so it never settles. The text column stays
   quiet. A request grows instead of falling: a front spreads out from its //, pushing the automaton back and setting the
   characters as it passes (a CA glyph flickers first). The // spins and settles, then ✓ / ✕ with status and time; the
   JSON5 response grows out the same way. When it is done the text is handed to the automaton: from the // outwards each
   character becomes a live cell, and the block breaks up under the rules into ash, blinkers and the odd glider.
   L38 logo-hero-cells: one request at a time. L39 logo-hero-cells-stream: several at once, compact.
   The engine takes options (rule, grid, look, growth) and is shared as K.cellsHero with demos/logo12.js (L40+).
   The automaton steps at a fixed rate from a fixed seed, so stage._seek(t) replays the same moment. */
(() => {
  const K = DEMOS.logoKit, Q5 = K.reqKit;
  const FONT = '"JetBrains Mono", ui-monospace, Menlo, monospace';
  const INK = '#0a0a0a', GREY = '#9a9a9a', SC = '#c6c6c6', STAT = '#8a8a8a', BLUE = '#0055ff';
  /* marks: a live cell is drawn as the way it moves (away from its trail), an edge cell as the way its edge runs */
  const MOVE = ['>', '\\', '-', '/', '<', '\\', '-', '/'], RUN = ['-', '\\', '|', '/'];
  const GLIDER = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]; /* heading +x +y; mirrored for the other three diagonals */
  const DYING = ['+', '+', ':', ':', '.', '.'];
  const SPD = 1500, PRESS = .03; /* growth front in px per second; how far ahead of the front the automaton is pushed back */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  /* organic growth: shortest paths over a box with random cell costs (Dijkstra), from one or more seed cells, in px */
  function field(bw, bh, seeds, cw, chh, r) {
    const d = new Float64Array(bw * bh).fill(Infinity), wt = Float32Array.from({ length: bw * bh }, () => .4 + 2.4 * r() ** 3), hp = [];
    const push = (v, k) => { hp.push([v, k]); let i = hp.length - 1; while (i) { const p = (i - 1) >> 1; if (hp[p][0] <= v) break; [hp[p], hp[i]] = [hp[i], hp[p]]; i = p; } };
    const pop = () => { const top = hp[0], last = hp.pop(); if (hp.length) { hp[0] = last; let i = 0; for (;;) { const a = 2 * i + 1, b = a + 1; let m = i; if (a < hp.length && hp[a][0] < hp[m][0]) m = a; if (b < hp.length && hp[b][0] < hp[m][0]) m = b; if (m === i) break; [hp[m], hp[i]] = [hp[i], hp[m]]; i = m; } } return top; };
    for (const k of seeds) { d[k] = 0; push(0, k); }
    while (hp.length) {
      const [v, k] = pop(); if (v > d[k]) continue; const x = k % bw, y = k / bw | 0;
      for (const [dx, dy] of N8) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= bw || yy >= bh) continue; const kk = yy * bw + xx, nv = v + Math.hypot(dx * cw, dy * chh) * wt[kk]; if (nv < d[kk]) { d[kk] = nv; push(nv, kk); } }
    }
    return d;
  }
  /* defaults are L38: Life with a decay trail on the character grid, glyphs, a round growth front */
  const DEF = { B: [3], S: [2, 3], C: 7, pB: 1, GR: 9, fine: false, look: 'glyph', grow: 'radial', density: .16, soup: .7, soupW: 9, soupH: 5, soupP: .42, minLive: .035, speck: 0, speckR: 0, octo: false, marks: false, v2: false, status: false, okOnly: false, card: null, cardCols: 24, cardRows: 6, reqs: null, prompt: '// ', indent: '   ', done: null, bg: 1, gliders: 0, erode: 0, flick: ['*', '#'], live: (n) => n === 3 ? '#' : '*', alpha: .5 };

  function mount(stage, multi, opt) {
    const o = Object.assign({}, DEF, opt), Bs = new Uint8Array(9), Ss = new Uint8Array(9); o.B.forEach(n => Bs[n] = 1); o.S.forEach(n => Ss[n] = 1);
    const v = K.heroShell(stage), pz = v.parentElement, txt = pz.querySelector('.pz-t'); v.style.height = '92%';
    const bg = document.createElement('div'); bg.style.cssText = 'position:absolute;inset:0;background:#fff;overflow:hidden';
    stage.insertBefore(bg, pz); pz.style.background = 'transparent';
    const cv = DEMOS.canvas2d(bg); cv.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    const ctx = cv.ctx;
    let W = 0, H = 0, fs = 12, cw = 7, chh = 18, cols = 0, rows = 0, ox = 0, oy = 0;
    /* the automaton grid: the character grid itself, or (fine) square cells one character wide */
    let g = 7, gc = 0, gr = 0, gx = 0, gy = 0, quiet = new Float32Array(0), occ = new Uint8Array(0);
    let grid = new Uint8Array(0), buf = new Uint8Array(0), nb = new Uint8Array(0), gen = 0, sr = rng(7);
    let A = { c0: 0, c1: 0, r0: 0, r1: 0 };
    const X = c => ox + c * cw, Y = r => oy + r * chh + chh / 2;
    const CX = c => o.fine ? gx + (c + .5) * g : X(c) + cw / 2, CY = r => o.fine ? gy + (r + .5) * g : Y(r);
    let jobs = [], next = 0, seq = 0, R = rng(42);
    const rowsOf = Q => typeof o.cardRows === 'function' ? o.cardRows(Q) : o.cardRows; /* card height in rows, per request if a function */
    const colsOf = Q => typeof o.cardCols === 'function' ? o.cardCols(Q) : o.cardCols;
    const resetSim = () => { const N = gc * gr; grid = new Uint8Array(N); buf = new Uint8Array(N); nb = new Uint8Array(N); gen = 0; sr = rng(7); for (let k = 0; k < N; k++) if (quiet[k] > .5 && sr() < o.density) grid[k] = 1; };
    const resize = () => {
      const s = cv.resize(); if (s.w === W && s.h === H && gc) return; /* same size: keep the automaton and the requests */
      W = s.w; H = s.h; const b = bg.getBoundingClientRect(), vr = v.getBoundingClientRect(), tr = txt.getBoundingClientRect();
      fs = clamp(Math.round(vr.width / 66), 10, 13); cw = fs * .6; chh = Math.round(fs * 1.55); cols = Math.floor(W / cw); rows = Math.floor(H / chh); ox = (W - cols * cw) / 2; oy = (H - rows * chh) / 2;
      if (o.fine) { g = cw; gc = Math.floor(W / g); gr = Math.floor(H / g); gx = (W - gc * g) / 2; gy = (H - gr * g) / 2; } else { gc = cols; gr = rows; }
      A = { c0: Math.ceil((vr.left - b.left - ox) / cw), c1: Math.floor((vr.right - b.left - ox) / cw), r0: Math.ceil((vr.top - b.top - oy) / chh), r1: Math.floor((vr.bottom - b.top - oy) / chh) };
      quiet = new Float32Array(gc * gr); const L = tr.left - b.left, T = tr.top - b.top, Rr = tr.right - b.left, B = tr.bottom - b.top;
      for (let r = 0; r < gr; r++) for (let c = 0; c < gc; c++) { const x = CX(c), y = CY(r), dx = Math.max(L - 16 - x, 0, x - Rr - 16), dy = Math.max(T - 16 - y, 0, y - B - 16); quiet[r * gc + c] = clamp(Math.hypot(dx, dy) / 70); }
      occ = new Uint8Array(gc * gr); jobs = []; next = 0; resetSim();
    };
    /* the automaton cells under one character cell */
    const under = (c, r) => {
      if (!o.fine) return c >= 0 && c < gc && r >= 0 && r < gr ? [r * gc + c] : [];
      const x = Math.round((X(c) + cw / 2 - gx) / g - .5), y0 = Math.ceil((Y(r) - chh / 2 - gy) / g - .5), y1 = Math.floor((Y(r) + chh / 2 - gy) / g - .5), out = [];
      if (x >= 0 && x < gc) for (let y = Math.max(0, y0); y <= Math.min(gr - 1, y1); y++) out.push(y * gc + x);
      return out;
    };
    /* a job owns a box around its text (one cell of padding). Every box cell has: when the growth front reaches it (tl),
       when it is handed back (rel), the character it holds, if any, and the automaton cells under it. */
    const make = (t0, Q, c, r, width) => {
      /* v2: the response is indented three spaces so it lines up with the URL, and there is no status after the URL (the // turns into ✓ / ✕ instead) */
      const ind = o.v2 ? o.indent : '', lw = width - ind.length, ccols = o.card ? colsOf(Q) : 0;
      const src = Q5.toJSON5(multi ? Q.short : Q.full), out = src.map(l => ind + (l.length > lw ? l.slice(0, lw - 1) + '…' : l));
      /* the request line: prompt, then (v2 with a command) the command, the URL and its parameters */
      const P = o.v2 ? o.prompt : '// ', pre = Q.pre || '', url = 'https://' + Q.u, hmax = o.card ? width + 3 + ccols : width; /* the request line may run over the card column */
      let head = P + pre + url + (Q.post || ''); if (head.length > hmax) head = head.slice(0, hmax - 1) + '…';
      const u0 = P.length + pre.length, u1 = u0 + url.length;
      const st = o.v2 ? `${Q.st} · ${Q.ms} ms` : `${Q.st < 400 ? '✓' : '✕'} ${Q.st} · ${Q.ms} ms`, line0 = o.v2 && !o.status ? head : head + '  ' + st;
      /* card: a preview drawn to the right of the response, cardCols × cardRows cells, starting on the first response row */
      const cc0 = o.card ? Math.max(...out.map(l => l.length)) + 3 : 0, crows = o.card ? rowsOf(Q) : 0;
      const w = Math.max(line0.length, ...out.map(l => l.length), o.card ? cc0 + ccols : 0), h = Math.max(out.length, crows) + 1, bw = w + 2, bh = h + 2, N = bw * bh;
      const tSpin = t0 + .3, tDone = tSpin + .22 + Q.ms / 600, tResp = tDone + .05;
      const reach = Math.hypot(w * cw, h * chh) / SPD, tEnd = tResp + reach + 2.6 + (multi ? 0 : out.length * .04);
      const card = new Uint8Array(N), tl = new Float32Array(N), rel = new Float32Array(N), chs = new Array(N).fill(' '), col = new Array(N).fill(INK), bold = new Uint8Array(N), done = new Uint8Array(N), cells = new Array(N);
      const n = rng(Math.random() * 1e9 | 0), cols5 = out.map((l, i) => i === 0 && Q.cont0 ? [...l].map(() => STAT) : [...ind].map(() => INK).concat(Q5.paint5(l.slice(ind.length), src.cont[i]))); /* cont0: the first line continues the command, in grey */
      /* distances in px: a circle from the // (radial), or an uneven front from the // in and from three random points out (organic) */
      let din = null, dout = null;
      if (o.grow === 'organic') {
        const norm = d => { let m = 0; for (const x of d) m = Math.max(m, x); const s = reach * SPD * 1.15 / (m || 1); return d.map(x => x * s); };
        din = norm(field(bw, bh, [bw + 1], cw, chh, n)); dout = norm(field(bw, bh, [0, 1, 2].map(() => Math.floor(n() * N)), cw, chh, n));
      }
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
        const k = y * bw + x, i = x - 1, li = y - 1, rd = Math.hypot(Math.max(0, i) * cw, Math.max(0, li) * chh);
        tl[k] = (li <= 0 ? t0 : tResp) + (din ? din[k] : rd) / SPD + n() * .05; rel[k] = tEnd + (dout ? dout[k] : rd) / SPD + n() * .12;
        cells[k] = under(c + i, r + li);
        if (li === 0 && i >= 0 && i < line0.length) { chs[k] = line0[i]; if (i >= head.length + 2) { const q = i - head.length - 2; tl[k] = Math.max(tl[k], tDone + q * .008); col[k] = q || o.v2 ? STAT : INK; bold[k] = !q && !o.v2; } else { bold[k] = i < 2; if (o.v2 && i >= P.length) col[k] = i >= u0 && i < u1 ? BLUE : STAT; if (i < 2 && chs[k] === ' ') chs[k] = ' '; } } /* the mark slot is never a plain space: it spins */
        else if (o.card && li >= 1 && li <= crows && i >= cc0 && i < cc0 + ccols) { card[k] = 1; chs[k] = '#'; tl[k] += .08; }
        else if (li >= 1 && li <= out.length && i >= 0 && i < out[li - 1].length) { chs[k] = out[li - 1][i]; col[k] = cols5[li - 1][i]; }
      }
      let last = 0; for (const x of rel) last = Math.max(last, x);
      return { Q, ok: Q.st < 400, c, r, w, h, bw, bh, tl, rel, chs, col, bold, done, cells, card, cc0, crows, ccols, cardImg: null, t0, tSpin, tDone, tEnd, gone: last + .3 };
    };
    const fits = (c, r, w, h) => c >= A.c0 + 1 && r >= A.r0 + 1 && c + w + 1 <= A.c1 && r + h + 1 <= A.r1 && !jobs.some(j => c < j.c + j.w + 3 && j.c < c + w + 3 && r < j.r + j.h + 2 && j.r < r + h + 2);
    const spawn = T => {
      const all = o.reqs || Q5.REQ, list = o.okOnly ? all.filter(q => q.st < 400) : all, Q = list[seq++ % list.length], aw = A.c1 - A.c0 - 2, room = o.card ? aw - colsOf(Q) - 3 : aw;
      const width = multi ? Math.min(50, room) : Math.min(room, o.card ? 70 : 92), lines = multi ? Q.short : Q.full;
      const est = o.card ? Math.min(width, o.indent.length + Math.max(...lines.map(l => l.length))) + 3 + colsOf(Q) : o.v2 ? Math.min(width, Math.max(3 + Math.max(...lines.map(l => l.length)), Q.u.length + 11 + (o.status ? 16 : 0))) : Math.max(Math.min(width, Math.max(...lines.map(l => l.length))), Math.min(width, Q.u.length + 11) + 17), h = Math.max(lines.length, o.card ? rowsOf(Q) : 0) + 1;
      const e2 = o.v2 && o.card ? Math.max(est, Math.min(width + 3 + colsOf(Q), o.prompt.length + (Q.pre || '').length + Q.u.length + 8 + (Q.post || '').length) + (o.status ? 16 : 0)) : est; /* room for a long command line too */
      for (let k = 0; k < 40; k++) { const c = A.c0 + 1 + Math.floor(R() * Math.max(1, aw - e2)), r = A.r0 + 1 + Math.floor(R() * Math.max(1, A.r1 - A.r0 - h - 2)); if (fits(c, r, e2, h)) { jobs.push(make(T, Q, c, r, width)); return true; } }
      return false;
    };
    /* one generation of a Generations rule (B/S/C: state 1 is live, 2..C-1 decay), soups or single sparks to keep it going,
       and the jobs pushing the automaton back or handing their text to it */
    const step = () => {
      gen++; const Tg = gen / o.GR;
      for (let r = 0; r < gr; r++) for (let c = 0; c < gc; c++) {
        let n = 0, n4 = 0;
        for (let dy = -1; dy <= 1; dy++) { const rr = r + dy; if (rr < 0 || rr >= gr) continue; for (let dx = -1; dx <= 1; dx++) { const cc = c + dx; if ((dx || dy) && cc >= 0 && cc < gc && grid[rr * gc + cc] === 1) { n++; if (!dx || !dy) n4++; } } }
        const k = r * gc + c, s = grid[k], nB = o.octo && gen % 2 ? n4 : n; nb[k] = n; /* octo: births alternate 4 and 8 neighbours, so fronts spread as octagons, not squares */
        buf[k] = quiet[k] < .15 ? 0 : s === 1 ? (Ss[n] ? 1 : o.C > 2 ? 2 : 0) : s ? (s + 1 < o.C ? s + 1 : 0) : Bs[nB] && (o.pB >= 1 || sr() < o.pB) ? 1 : 0;
      }
      let live = 0; if (o.minLive) for (let k = 0; k < buf.length; k++) live += buf[k] === 1;
      for (let m = live < gc * gr * o.minLive ? 3 : sr() < o.soup ? 1 : 0; m > 0; m--) { const c0 = Math.floor(sr() * (gc - o.soupW)), r0 = Math.floor(sr() * (gr - o.soupH)); if (quiet[r0 * gc + c0] > .8) for (let y = 0; y < o.soupH; y++) for (let x = 0; x < o.soupW; x++) if (sr() < o.soupP) buf[(r0 + y) * gc + c0 + x] = 1; }
      for (let m = Math.floor(o.speck) + (sr() < o.speck % 1 ? 1 : 0); m > 0; m--) { const k = Math.floor(sr() * gc * gr), c0 = k % gc, r0 = k / gc | 0; if (quiet[k] > .8) for (let y = -o.speckR; y <= o.speckR; y++) for (let x = -o.speckR; x <= o.speckR; x++) if (x * x + y * y <= o.speckR * o.speckR + 1 && c0 + x >= 0 && c0 + x < gc && r0 + y >= 0 && r0 + y < gr) buf[(r0 + y) * gc + c0 + x] = 1; } /* a drop: one cell, or a small disc */
      /* gliders: small Life spaceships set off on a diagonal; erosion slowly clears the ash they leave when they crash */
      if (o.gliders && sr() < o.gliders) { const sx = sr() < .5 ? 1 : -1, sy = sr() < .5 ? 1 : -1, c0 = 2 + Math.floor(sr() * (gc - 6)), r0 = 2 + Math.floor(sr() * (gr - 6)); if (quiet[r0 * gc + c0] > .9) for (const [x, y] of GLIDER) buf[(r0 + (sy > 0 ? y : 2 - y)) * gc + c0 + (sx > 0 ? x : 2 - x)] = 1; }
      if (o.erode) for (let k = 0; k < buf.length; k++) if (buf[k] === 1 && sr() < o.erode) { /* only still cells (no trail next to them), so moving gliders are spared */
        const c = k % gc, r = k / gc | 0; let moving = false;
        for (const [dx, dy] of N8) { const cc = c + dx, rr = r + dy; if (cc >= 0 && rr >= 0 && cc < gc && rr < gr && buf[rr * gc + cc] === 2) { moving = true; break; } }
        if (!moving) { buf[k] = 2; for (const [dx, dy] of N8) { const cc = c + dx, rr = r + dy; if (cc >= 0 && rr >= 0 && cc < gc && rr < gr && buf[rr * gc + cc] === 1) buf[rr * gc + cc] = 2; } } /* the whole still piece, or Life rebuilds it */
      }
      for (const j of jobs) for (let k = 0; k < j.bw * j.bh; k++) {
        if (Tg >= j.tl[k] - PRESS && Tg < j.rel[k]) { for (const q of j.cells[k]) buf[q] = 0; }
        else if (Tg >= j.rel[k] && !j.done[k]) { j.done[k] = 1; if (j.chs[k] !== ' ') for (const q of j.cells[k]) buf[q] = 1; }
      }
      const t = grid; grid = buf; buf = t;
    };
    const glyph = (ch, x, y, color, alpha, b) => { ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.font = (b ? '800 ' : '400 ') + fs + 'px ' + FONT; ctx.fillText(ch, x, y); };
    /* the automaton, in one of three looks: glyphs, round dots, or only the edges of live regions */
    const at = (c, r) => c >= 0 && r >= 0 && c < gc && r < gr ? grid[r * gc + c] : 0;
    const move = (c, r) => { let x = 0, y = 0; for (const [dx, dy] of N8) if (at(c + dx, r + dy) === 2) { x -= dx; y -= dy; } return x || y ? MOVE[(Math.round(Math.atan2(y, x) / (Math.PI / 4)) + 8) % 8] : '/'; };
    const run = (c, r) => { let x = 0, y = 0; for (const [dx, dy] of N8) if (at(c + dx, r + dy) !== 1) { x += dx; y += dy; } return x || y ? RUN[(Math.round(Math.atan2(x, -y) / (Math.PI / 4)) + 8) % 4] : '/'; };
    const paintCA = () => {
      const gfs = o.fine ? Math.round(g * 1.3) : fs, gw = gfs * .6;
      ctx.font = '400 ' + gfs + 'px ' + FONT;
      for (let r = 0; r < gr; r++) for (let c = 0; c < gc; c++) {
        const k = r * gc + c, s = grid[k]; if (!s || occ[k]) continue;
        const y = CY(r), f = s === 1 ? 0 : (s - 2) / Math.max(1, o.C - 2);
        let a = (s === 1 ? o.alpha : .32 - .24 * f) * o.bg * quiet[k] * clamp(Math.min(y, H - y) / 40); if (a < .015) continue;
        if (o.look === 'edges') { if (s !== 1 || (c > 0 && grid[k - 1] === 1 && c < gc - 1 && grid[k + 1] === 1 && r > 0 && grid[k - gc] === 1 && r < gr - 1 && grid[k + gc] === 1)) continue; }
        ctx.globalAlpha = a; ctx.fillStyle = s === 1 ? INK : GREY;
        if (o.marks) { ctx.fillText(o.look === 'edges' ? run(c, r) : s === 1 ? move(c, r) : f < .5 ? ':' : '.', (o.fine ? CX(c) - gw / 2 : X(c)), y); continue; }
        if (o.look === 'glyph') ctx.fillText(s === 1 ? o.live(nb[k]) : DYING[Math.min(5, Math.floor(f * 6))], X(c), y);
        else { const rad = g * (s === 1 ? (o.look === 'edges' ? .17 : .24) : .19 - .1 * f); ctx.beginPath(); ctx.arc(CX(c), y, rad, 0, 6.2832); ctx.fill(); }
      }
    };
    const frame = (time, still) => {
      const T = still ? 1e6 : time;
      if (!still) { jobs = jobs.filter(j => T < j.gone); if (T >= next) { const ok = spawn(T); next = T + (multi ? (ok ? .9 + R() * .5 : .25) : (jobs.length ? Infinity : .25)); } if (!multi && !jobs.length && next === Infinity) next = T + .25; }
      const target = still ? 40 : Math.floor(time * o.GR); if (target < gen) resetSim();
      for (let s = 0; gen < target && s < 60; s++) step(); if (gen < target - 60) gen = target; /* never chase a long backlog */
      /* cells a job holds right now: the automaton is not drawn there */
      occ.fill(0);
      for (const j of jobs) for (let k = 0; k < j.bw * j.bh; k++) if (T >= j.tl[k] - PRESS && T < j.rel[k]) for (const q of j.cells[k]) occ[q] = 1;
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      paintCA();
      for (const j of jobs) for (let y = 1; y <= j.h; y++) for (let x = 1; x <= j.w; x++) {
        const k = y * j.bw + x, ch = j.chs[k]; if (ch === ' ' || T < j.tl[k] || T >= j.rel[k]) continue;
        const xx = X(j.c + x - 1), yy = Y(j.r + y - 1), s = T - j.tl[k];
        if (j.card[k]) { /* the card is drawn once off screen and shown cell by cell as the front reaches it */
          if (s < .07) { glyph(o.flick[s < .035 ? 0 : 1], xx, yy, SC, 1, false); continue; }
          const d = cv.c.width / W; if (!j.cardImg) j.cardImg = o.card(j.Q, j.ccols * cw, j.crows * chh, d);
          ctx.globalAlpha = 1; ctx.drawImage(j.cardImg, (x - 1 - j.cc0) * cw * d, (y - 2) * chh * d, cw * d + 1, chh * d + 1, xx, yy - chh / 2, cw + .4, chh + .4); continue;
        }
        if (s < .07) { glyph(o.flick[s < .035 ? 0 : 1], xx, yy, SC, 1, false); continue; }
        let gl = ch; if (y === 1 && x <= 2 && T >= j.tSpin && T < j.tDone) gl = Q5.SPIN[(Math.floor((T - j.tSpin) / .055) + x - 1) % 4];
        if (o.v2 && y === 1 && x <= 2 && T >= j.tDone) { gl = o.done ? o.done[x - 1] : x === 1 ? (j.ok ? '✓' : '✕') : ''; if (!gl || gl === ' ') continue; } /* the mark becomes the result */
        glyph(gl, xx, yy, j.col[k], 1, j.bold[k]);
      }
      ctx.globalAlpha = 1;
    };
    const ro = new ResizeObserver(resize); ro.observe(bg); resize();
    if (DEMOS.reduced) { requestAnimationFrame(() => { resize(); spawn(0); if (multi) { spawn(0); spawn(0); } frame(0, true); }); return () => { ro.disconnect(); cv.destroy(); }; }
    let time = 0;
    const lp = DEMOS.loop(bg, (t, dt) => { if (!stage.matches(':hover')) time += dt; frame(time, false); });
    stage._seek = s => { time = s; frame(time, false); }; /* for checking a moment by hand */
    return () => { lp.destroy(); ro.disconnect(); cv.destroy(); };
  }
  K.cellsHero = mount;

  DEMOS.register('logo-hero-cells', {
    group: 'logo', title: 'Hero: one request in a living grid',
    blurb: 'L36 with a cellular automaton instead of rain: the hero background is a Game of Life grid in greys with a short decay trail. The request grows out from its //, pushing the cells back; the // spins and settles, ✓ or ✕ with status and time; the JSON5 response grows out the same way. When it is done the text is handed to the automaton, character by character from the //, and breaks up under the rules.',
    mount: stage => mount(stage, false),
  });
  DEMOS.register('logo-hero-cells-stream', {
    group: 'logo', title: 'Hero: live requests in a living grid',
    blurb: 'L37 the same way: several requests at once, each growing out of the grid with a compact JSON5 response and dissolving back into it.',
    mount: stage => mount(stage, true),
  });
})();
