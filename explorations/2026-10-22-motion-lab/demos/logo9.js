/* L34–L35 · Matrix-inspired L32/L33. Same real Iframely responses (JSON5, from demos/logo8.js), on a black panel with
   digital rain: columns of half-width katakana and digits fall in green, a bright glyph at the head of each.
   A request is rained in: a drop falls down each of its columns and the characters lock in where it passes, ragged,
   column by column. The // spins, settles white, then ✓ (green) or ✕ (red, the one red thing on screen) with status
   and time. The response is rained in the same way, about half a second for the whole block. When it is done, each
   column lets go: the characters fall, turn back into rain and fade.
   L34 logo-hero-matrix: one request at a time, full response. L35 logo-hero-matrix-stream: several at once, compact.
   The rain is a pure function of time (no state), so stage._seek(t) shows any moment. */
(() => {
  const K = DEMOS.logoKit, Q5 = K.reqKit;
  const FONT = '"JetBrains Mono", ui-monospace, Menlo, monospace';
  const BG = '#020704', RAIN = '#00c850', HEAD = '#d2ffdc', TXT = '#cfffdc', OK = '#3dff7e', ERR = '#ff4646';
  const PAL = { key: '#3ccf6c', str: TXT, pun: '#1f7040', com: '#2a8a4a' };
  const GL = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ012345789Z:.=*+-<>¦|';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const HASH = Float32Array.from({ length: 4099 }, rng(9)), hs = n => HASH[(n % 4099 + 4099) % 4099];
  const rgl = () => GL[Math.random() * GL.length | 0];
  /* the glyph in a cell of the rain: most cells change a few times a second, some stay put */
  const glyphAt = (c, r, t) => { const h = hs(c * 131 + r * 17), step = Math.floor(t * (h < .3 ? 0 : 1 + h * 5) + h * 10); return GL[Math.floor(hs(c * 7 + r * 29 + step * 13) * GL.length)]; };

  function mount(stage, multi) {
    const v = K.heroShell(stage); Object.assign(v.style, { height: '92%', background: BG, borderRadius: '14px', overflow: 'hidden' });
    const cv = DEMOS.canvas2d(v); cv.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    const ctx = cv.ctx;
    let W = 0, H = 0, fs = 12, cw = 7, chh = 18, cols = 0, rows = 0, ox = 0, oy = 0, occ = new Uint8Array(0);
    const X = c => ox + c * cw, Y = r => oy + r * chh + chh / 2;
    let jobs = [], next = 0, seq = 0, R = rng(42);
    const resize = () => { const s = cv.resize(); W = s.w; H = s.h; fs = clamp(Math.round(W / 66), 10, 13); cw = fs * .6; chh = Math.round(fs * 1.5); cols = Math.floor(W / cw); rows = Math.floor(H / chh); ox = (W - cols * cw) / 2; oy = (H - rows * chh) / 2; occ = new Uint8Array(cols * rows); jobs = []; next = 0; };
    const RATE = 34; /* rows per second a revealing drop falls through the response */
    /* a job: one request at (c, r). Each column i has its own delay d[i] (the ragged wipe) and its own release fall[i]. */
    const make = (t0, Q, c, r, width) => {
      const src = Q5.toJSON5(multi ? Q.short : Q.full), out = src.map(l => l.length > width ? l.slice(0, width - 1) + '…' : l);
      const url = 'https://' + Q.u, head = '// ' + (url.length > width - 3 ? url.slice(0, width - 4) + '…' : url);
      const w = Math.max(head.length + 17, ...out.map(l => l.length)), seed = Math.random() * 4000 | 0;
      const d = Array.from({ length: w }, (_, i) => hs(seed + i * 3) * .14), fall = Array.from({ length: w }, (_, i) => hs(seed + i * 5 + 1) * .55);
      const tSpin = t0 + .3, tDone = tSpin + .22 + Q.ms / 600, tResp = tDone + .05, tTyped = tResp + .09 + (out.length + 1) / RATE;
      const tEnd = tTyped + 2.6 + (multi ? 0 : out.length * .04);
      return { Q, c, r, head, out, cols: out.map((l, i) => Q5.paint5(l, src.cont[i], PAL)), w, h: out.length + 2, d, fall, t0, tSpin, tDone, tResp, tEnd, wl: Math.max(...out.map(l => l.length)) };
    };
    const fits = (c, r, w, h) => c >= 1 && r >= 1 && c + w <= cols - 1 && r + h <= rows - 1 && !jobs.some(j => c < j.c + j.w + 2 && j.c < c + w + 2 && r < j.r + j.h + 1 && j.r < r + h + 1);
    const spawn = T => {
      const Q = Q5.REQ[seq++ % Q5.REQ.length];
      const width = multi ? Math.min(50, cols - 4) : Math.min(cols - 4, 92), lines = multi ? Q.short : Q.full;
      const est = Math.max(Math.min(width, Math.max(...lines.map(l => l.length))), Math.min(width, Q.u.length + 11) + 17); /* the widest line, or the request line with its status */
      for (let k = 0; k < 40; k++) { const h = lines.length + 2, c = 1 + Math.floor(R() * Math.max(1, cols - est - 2)), r = 1 + Math.floor(R() * Math.max(1, rows - h - 1)); if (fits(c, r, est, h)) { jobs.push(make(T, Q, c, r, width)); return true; } }
      return false;
    };
    const glyph = (ch, x, y, color, alpha, bold) => { ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.font = (bold ? '800 ' : '400 ') + fs + 'px ' + FONT; ctx.fillText(ch, x, y); };
    /* one character of a job in column i (relative), row ri (absolute): locks in at tl, lets go at the column's release time */
    const cell = (j, i, ri, ch, tl, T, color, bold) => {
      const ci = j.c + i, s = T - tl, f = T - (j.tEnd + j.fall[i]); if (s < 0) return;
      if (f > 0) { /* falling back into rain */
        if (f > .9) return; const dy = 19 * f * f, g = f > .08 ? glyphAt(ci, ri + Math.floor(dy), T) : ch;
        glyph(g, X(ci), Y(ri) + dy * chh, f > .08 ? RAIN : color, 1 - f / .9, false); return;
      }
      if (s < .045) glyph(rgl(), X(ci), Y(ri), HEAD, 1, false);
      else glyph(ch, X(ci), Y(ri), s < .16 ? HEAD : color, 1, bold);
    };
    /* the bright head of a revealing drop at fractional row hy in column ci, with a short trail */
    const drop = (ci, hy, top, T) => { const hr = Math.floor(hy); for (let k = 0; k < 4; k++) { const r = hr - k; if (r < top) break; glyph(k ? glyphAt(ci, r, T) : rgl(), X(ci), Y(r), k ? RAIN : HEAD, k ? .5 - k * .12 : 1, !k); } };
    const frame = (time, still) => {
      const T = still ? 1e6 : time;
      if (!still) { jobs = jobs.filter(j => T < j.tEnd + 1.5); if (T >= next) { const ok = spawn(T); next = T + (multi ? (ok ? .9 + R() * .5 : .25) : (jobs.length ? Infinity : .25)); } if (!multi && !jobs.length && next === Infinity) next = T + .25; }
      /* cells the rain keeps clear: rows of a job from when the reveal reaches them until the job lets go */
      occ.fill(0);
      for (const j of jobs) {
        if (T < j.t0 + .06 || T > j.tEnd) continue;
        const n = 1 + j.out.filter((_, li) => T >= j.tResp + (li + 1) / RATE - .02).length;
        for (let r = j.r; r < Math.min(rows, j.r + n); r++) for (let c = Math.max(0, j.c - 1); c <= Math.min(cols - 1, j.c + j.w); c++) occ[r * cols + c] = 1;
      }
      ctx.globalAlpha = 1; ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      /* digital rain: up to two drops per column, each a bright head with a fading green tail */
      ctx.font = '400 ' + fs + 'px ' + FONT;
      for (let c = 0; c < cols; c++) for (let k = 0; k < 2; k++) {
        const b = c * 5 + k * 977; if (hs(b) < (k ? .4 : .1)) continue;
        const sp = 4 + 12 * hs(b + 1), L = 5 + Math.floor(18 * hs(b + 2)), cyc = rows + L + 6 + 30 * hs(b + 3), hr = Math.floor((time * sp + hs(b + 4) * cyc) % cyc);
        for (let dd = 0; dd <= L; dd++) {
          const r = hr - dd; if (r < 0) break; if (r >= rows || occ[r * cols + c]) continue;
          const y = Y(r), a = (dd ? .55 * Math.pow(1 - dd / (L + 1), 1.2) : .9) * clamp(Math.min(y, H - y) / 40);
          if (a < .02) continue; ctx.globalAlpha = a; ctx.fillStyle = dd ? RAIN : HEAD; ctx.fillText(glyphAt(c, r, time), X(c), y);
        }
      }
      for (const j of jobs) {
        const ok = j.Q.st < 400;
        /* the request line: a drop falls six rows down each column and locks the character in */
        for (let i = 0; i < j.head.length; i++) {
          const ts = j.t0 + j.d[i], tl = ts + .1, ci = j.c + i;
          if (T >= ts && T < tl) drop(ci, j.r - 6 + 60 * (T - ts), Math.max(0, j.r - 6), T);
          let ch = j.head[i], color = TXT, bold = false;
          if (i < 2) { bold = true; color = '#ffffff'; if (T >= j.tSpin && T < j.tDone) ch = Q5.SPIN[(Math.floor((T - j.tSpin) / .055) + i) % 4]; }
          cell(j, i, j.r, ch, tl, T, color, bold);
        }
        /* status after the URL */
        if (T >= j.tDone) { const st = `${ok ? '✓' : '✕'} ${j.Q.st} · ${j.Q.ms} ms`, x0 = j.head.length + 2; for (let i = 0; i < st.length; i++) cell(j, x0 + i, j.r, st[i], j.tDone + i * .008, T, i < 5 ? (ok ? OK : ERR) : PAL.key, i < 5); }
        /* the response: one drop per column falls from the request line through the block, locking characters as it passes */
        for (let i = 0; i < j.wl; i++) {
          const ts = j.tResp + j.d[i] * .6, hy = j.r + RATE * (T - ts);
          if (T >= ts && hy < j.r + 1 + j.out.length && T < j.tEnd) drop(j.c + i, hy, j.r + 1, T);
          j.out.forEach((l, li) => { if (i < l.length && l[i] !== ' ') cell(j, i, j.r + 1 + li, l[i], ts + (li + 1) / RATE, T, j.cols[li][i], false); });
        }
      }
      ctx.globalAlpha = 1;
    };
    const ro = new ResizeObserver(resize); ro.observe(v); resize();
    if (DEMOS.reduced) { requestAnimationFrame(() => { resize(); spawn(0); if (multi) { spawn(0); spawn(0); } frame(4, true); }); return () => { ro.disconnect(); cv.destroy(); }; }
    let time = 0;
    const lp = DEMOS.loop(v, (t, dt) => { if (!stage.matches(':hover')) time += dt; frame(time, false); });
    stage._seek = s => { time = s; frame(time, false); }; /* for checking a moment by hand */
    return () => { lp.destroy(); ro.disconnect(); cv.destroy(); };
  }

  DEMOS.register('logo-hero-matrix', {
    group: 'logo', title: 'Hero: one request, rained in',
    blurb: 'L32 after The Matrix: a black panel with green digital rain. The request is rained in, a drop down each column locking the characters where it passes; the // spins and settles white, then ✓ or a red ✕ with status and time; the JSON5 response rains in under it in about half a second. When it is done each column lets go and the text falls back into the rain.',
    mount: stage => mount(stage, false),
  });
  DEMOS.register('logo-hero-matrix-stream', {
    group: 'logo', title: 'Hero: live requests in the rain',
    blurb: 'L33 the same way: several requests at once in free places of the rain, each rained in with a compact JSON5 response and let go on its own.',
    mount: stage => mount(stage, true),
  });
})();
