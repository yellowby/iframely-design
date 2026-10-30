/* L36–L37 · L34/L35 (demos/logo9.js) in the L32/L33 style: white, greys only, JSON5, bare // spinner, ✓ / ✕. Digital rain
   covers the whole hero background (thinning out around the text column): columns of ASCII glyphs fall, a dark glyph at
   the head of each, a light grey tail. A request is rained in: a drop falls down each of its columns and the characters
   lock in where it passes, ragged, column by column. The // spins and settles, then ✓ or ✕ with status and time. The
   response is rained in the same way, about half a second for the whole block. When it is done, each column lets go:
   the characters fall, turn back into rain and fade.
   L36 logo-hero-matrix-light: one request at a time, full response. L37 logo-hero-matrix-light-stream: several at once, compact.
   Requests land in the visual half of the hero. The rain is a pure function of time, so stage._seek(t) shows any moment. */
(() => {
  const K = DEMOS.logoKit, Q5 = K.reqKit;
  const FONT = '"JetBrains Mono", ui-monospace, Menlo, monospace';
  const INK = '#0a0a0a', RAIN = '#9a9a9a', SC = '#c6c6c6', STAT = '#8a8a8a';
  const GL = '!<>-_\\/[]{}=+*^?#%&$:;.0123456789';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const HASH = Float32Array.from({ length: 4099 }, rng(9)), hs = n => HASH[(n % 4099 + 4099) % 4099];
  const rgl = () => GL[Math.random() * GL.length | 0];
  /* the glyph in a cell of the rain: most cells change a few times a second, some stay put */
  const glyphAt = (c, r, t) => { const h = hs(c * 131 + r * 17), step = Math.floor(t * (h < .3 ? 0 : 1 + h * 5) + h * 10); return GL[Math.floor(hs(c * 7 + r * 29 + step * 13) * GL.length)]; };

  function mount(stage, multi) {
    const v = K.heroShell(stage), pz = v.parentElement, txt = pz.querySelector('.pz-t'); v.style.height = '92%';
    /* the rain sits behind the whole hero: the shell goes transparent over a white layer that holds the canvas */
    const bg = document.createElement('div'); bg.style.cssText = 'position:absolute;inset:0;background:#fff;overflow:hidden';
    stage.insertBefore(bg, pz); pz.style.background = 'transparent';
    const cv = DEMOS.canvas2d(bg); cv.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    const ctx = cv.ctx;
    let W = 0, H = 0, fs = 12, cw = 7, chh = 18, cols = 0, rows = 0, ox = 0, oy = 0, occ = new Uint8Array(0), quiet = new Float32Array(0);
    let A = { c0: 0, c1: 0, r0: 0, r1: 0 }; /* the visual half, in cells: where requests land */
    const X = c => ox + c * cw, Y = r => oy + r * chh + chh / 2;
    let jobs = [], next = 0, seq = 0, R = rng(42);
    const resize = () => {
      const s = cv.resize(); W = s.w; H = s.h; const b = bg.getBoundingClientRect(), vr = v.getBoundingClientRect(), tr = txt.getBoundingClientRect();
      fs = clamp(Math.round(vr.width / 66), 10, 13); cw = fs * .6; chh = Math.round(fs * 1.55); cols = Math.floor(W / cw); rows = Math.floor(H / chh); ox = (W - cols * cw) / 2; oy = (H - rows * chh) / 2;
      A = { c0: Math.ceil((vr.left - b.left - ox) / cw), c1: Math.floor((vr.right - b.left - ox) / cw), r0: Math.ceil((vr.top - b.top - oy) / chh), r1: Math.floor((vr.bottom - b.top - oy) / chh) };
      /* how much rain each cell keeps: none over the text column, easing back in over 70px around it */
      quiet = new Float32Array(cols * rows); const L = tr.left - b.left, T = tr.top - b.top, Rr = tr.right - b.left, B = tr.bottom - b.top;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = X(c) + cw / 2, y = Y(r), dx = Math.max(L - 16 - x, 0, x - Rr - 16), dy = Math.max(T - 16 - y, 0, y - B - 16); quiet[r * cols + c] = clamp(Math.hypot(dx, dy) / 70); }
      occ = new Uint8Array(cols * rows); jobs = []; next = 0;
    };
    const RATE = 34; /* rows per second a revealing drop falls through the response */
    /* a job: one request at (c, r). Each column i has its own delay d[i] (the ragged wipe) and its own release fall[i]. */
    const make = (t0, Q, c, r, width) => {
      const src = Q5.toJSON5(multi ? Q.short : Q.full), out = src.map(l => l.length > width ? l.slice(0, width - 1) + '…' : l);
      const url = 'https://' + Q.u, head = '// ' + (url.length > width - 3 ? url.slice(0, width - 4) + '…' : url);
      const w = Math.max(head.length + 17, ...out.map(l => l.length)), seed = Math.random() * 4000 | 0;
      const d = Array.from({ length: w }, (_, i) => hs(seed + i * 3) * .14), fall = Array.from({ length: w }, (_, i) => hs(seed + i * 5 + 1) * .55);
      const tSpin = t0 + .3, tDone = tSpin + .22 + Q.ms / 600, tResp = tDone + .05, tTyped = tResp + .09 + (out.length + 1) / RATE;
      const tEnd = tTyped + 2.6 + (multi ? 0 : out.length * .04);
      return { Q, c, r, head, out, cols: out.map((l, i) => Q5.paint5(l, src.cont[i])), w, h: out.length + 2, d, fall, t0, tSpin, tDone, tResp, tEnd, wl: Math.max(...out.map(l => l.length)) };
    };
    const fits = (c, r, w, h) => c >= A.c0 && r >= A.r0 && c + w <= A.c1 && r + h <= A.r1 && !jobs.some(j => c < j.c + j.w + 2 && j.c < c + w + 2 && r < j.r + j.h + 1 && j.r < r + h + 1);
    const spawn = T => {
      const Q = Q5.REQ[seq++ % Q5.REQ.length], aw = A.c1 - A.c0;
      const width = multi ? Math.min(50, aw - 2) : Math.min(aw - 2, 92), lines = multi ? Q.short : Q.full;
      const est = Math.max(Math.min(width, Math.max(...lines.map(l => l.length))), Math.min(width, Q.u.length + 11) + 17); /* the widest line, or the request line with its status */
      for (let k = 0; k < 40; k++) { const h = lines.length + 2, c = A.c0 + Math.floor(R() * Math.max(1, aw - est)), r = A.r0 + Math.floor(R() * Math.max(1, A.r1 - A.r0 - h)); if (fits(c, r, est, h)) { jobs.push(make(T, Q, c, r, width)); return true; } }
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
      if (s < .045) glyph(rgl(), X(ci), Y(ri), SC, 1, false);
      else glyph(ch, X(ci), Y(ri), color, 1, bold);
    };
    /* the dark head of a revealing drop at fractional row hy in column ci, with a short grey trail */
    const drop = (ci, hy, top, T) => { const hr = Math.floor(hy); for (let k = 0; k < 4; k++) { const r = hr - k; if (r < top) break; glyph(k ? glyphAt(ci, r, T) : rgl(), X(ci), Y(r), k ? RAIN : INK, k ? .55 - k * .13 : 1, !k); } };
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
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      /* digital rain: up to two drops per column, each a dark head with a fading grey tail */
      ctx.font = '400 ' + fs + 'px ' + FONT;
      for (let c = 0; c < cols; c++) for (let k = 0; k < 2; k++) {
        const b = c * 5 + k * 977; if (hs(b) < (k ? .45 : .12)) continue;
        const sp = 4 + 12 * hs(b + 1), L = 5 + Math.floor(18 * hs(b + 2)), cyc = rows + L + 6 + 30 * hs(b + 3), hr = Math.floor((time * sp + hs(b + 4) * cyc) % cyc);
        for (let dd = 0; dd <= L; dd++) {
          const r = hr - dd; if (r < 0) break; if (r >= rows || occ[r * cols + c]) continue;
          const y = Y(r), a = (dd ? .26 * Math.pow(1 - dd / (L + 1), 1.2) : .5) * quiet[r * cols + c] * clamp(Math.min(y, H - y) / 40);
          if (a < .015) continue; ctx.globalAlpha = a; ctx.fillStyle = dd ? RAIN : INK; ctx.fillText(glyphAt(c, r, time), X(c), y);
        }
      }
      for (const j of jobs) {
        const ok = j.Q.st < 400;
        /* the request line: a drop falls six rows down each column and locks the character in */
        for (let i = 0; i < j.head.length; i++) {
          const ts = j.t0 + j.d[i], tl = ts + .1, ci = j.c + i;
          if (T >= ts && T < tl) drop(ci, j.r - 6 + 60 * (T - ts), Math.max(0, j.r - 6), T);
          let ch = j.head[i], bold = false;
          if (i < 2) { bold = true; if (T >= j.tSpin && T < j.tDone) ch = Q5.SPIN[(Math.floor((T - j.tSpin) / .055) + i) % 4]; }
          cell(j, i, j.r, ch, tl, T, INK, bold);
        }
        /* status after the URL */
        if (T >= j.tDone) { const st = `${ok ? '✓' : '✕'} ${j.Q.st} · ${j.Q.ms} ms`, x0 = j.head.length + 2; for (let i = 0; i < st.length; i++) cell(j, x0 + i, j.r, st[i], j.tDone + i * .008, T, i ? STAT : INK, !i); }
        /* the response: one drop per column falls from the request line through the block, locking characters as it passes */
        for (let i = 0; i < j.wl; i++) {
          const ts = j.tResp + j.d[i] * .6, hy = j.r + RATE * (T - ts);
          if (T >= ts && hy < j.r + 1 + j.out.length && T < j.tEnd) drop(j.c + i, hy, j.r + 1, T);
          j.out.forEach((l, li) => { if (i < l.length && l[i] !== ' ') cell(j, i, j.r + 1 + li, l[i], ts + (li + 1) / RATE, T, j.cols[li][i], false); });
        }
      }
      ctx.globalAlpha = 1;
    };
    const ro = new ResizeObserver(resize); ro.observe(bg); resize();
    if (DEMOS.reduced) { requestAnimationFrame(() => { resize(); spawn(0); if (multi) { spawn(0); spawn(0); } frame(4, true); }); return () => { ro.disconnect(); cv.destroy(); }; }
    let time = 0;
    const lp = DEMOS.loop(bg, (t, dt) => { if (!stage.matches(':hover')) time += dt; frame(time, false); });
    stage._seek = s => { time = s; frame(time, false); }; /* for checking a moment by hand */
    return () => { lp.destroy(); ro.disconnect(); cv.destroy(); };
  }

  DEMOS.register('logo-hero-matrix-light', {
    group: 'logo', title: 'Hero: rained in, greys on white',
    blurb: 'L34 in the L32 style, greys on white: digital rain across the whole hero, thinning out around the text. The request is rained in, a drop down each column locking the characters where it passes; the // spins and settles, then ✓ or ✕ with status and time; the JSON5 response rains in under it in about half a second. When it is done each column lets go and the text falls back into the rain.',
    mount: stage => mount(stage, false),
  });
  DEMOS.register('logo-hero-matrix-light-stream', {
    group: 'logo', title: 'Hero: live requests in grey rain',
    blurb: 'L35 in the L33 style: several requests at once in free places of the rain, each rained in with a compact JSON5 response and let go on its own.',
    mount: stage => mount(stage, true),
  });
})();
