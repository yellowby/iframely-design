/* X · Dither sections (2026-11-05): full marketing sections built from the stills, after the user's own Figma compositions
   (Publisher Console blocks: glyph clusters + a Bayer edge on blue, a glyph field rising on pink, a terminal band with
   block cursors on black, a black | blue split) and a reference of pixel serif type with crop marks and a fine dot grid.
   Group 'dtx', page #dither-sections. Copy is live HTML over a canvas "art" layer; the art (ground, glyphs, edges, pixel
   type) exports as PNG (2×) or SVG (type rows as text, Bayer cells and pixel type as merged runs).
   Needs dither-set.js (ditherKit), dither-stills.js (stillsKit) and dither-stills2.js (typeKit). */
(() => {
  const { h } = DEMOS;
  const K = () => DEMOS.ditherKit, S = () => DEMOS.stillsKit, T = () => DEMOS.typeKit;
  const BLUE = '#0055ff', BLACK = '#0a0a0b', MONO = '"JetBrains Mono", ui-monospace, monospace';
  const mix = (a, b, k) => K().mixHex(a, b, k);
  const COL = { blue: ['Blue', BLUE], pink: ['Pink', '#ff3d8b'], violet: ['Violet', '#6a3bff'], orchid: ['Orchid', '#a52fd0'], magenta: ['Magenta', '#c81d77'] };
  const COPY = {
    pub: { path: '/console', title: 'Control over your content,<br>page by page and app by app', body: 'See which products fetch your pages and why. Set a processing policy and other rules for the whole domain, a path or an individual Iframely customer. Test any declared use on your own pages and see what each would receive.', note: 'Free read-only access by email. Full access after DNS verification.', b1: 'Publishers Console', b2: 'Docs' },
    rich: { path: '/embeds', title: 'Perfect embeds,<br>every time', body: 'Send us a URL, get the embed code back. Today and tomorrow. Videos play, posts appear and maps move, the way people expect from the apps they love, wherever your users write, post and chat.', note: '1,900 providers through one API. Free to start.', b1: 'Get an API key', b2: 'Try a link' },
    preview: { path: '/preview-api', title: 'Every link,<br>beautifully unfurled', body: 'Iframely sees the web the same way X, Facebook and WordPress do. Send us a URL and get its title, images, author, rich media and a ready-made card back.', note: 'For every link your users share in chats, docs and posts.', b1: 'Get an API key', b2: 'Check a URL' },
    data: { path: '/data-api', title: 'The web reader that can<br>show its permissions', body: 'Tell us why you are reading a URL. We read it once, as a signed and named agent, and return what the publisher allows for that purpose: metadata, entities, an excerpt, Markdown full text.', note: '2,000 hits a month free.', b1: 'Get an API key', b2: 'Quick start' },
  };
  const PNAME = { pub: 'Publisher Console', rich: 'Rich Media', preview: 'Preview API', data: 'Data API' };
  const canvas = (w, hh) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(hh)); return c; };
  const hexOf = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

  /* ground scheme: colour ground with white marks, black or a light ground with marks in the colour */
  function scheme(st, ground) {
    const C = (COL[st.colour] || COL.blue)[1], gk = ground || st.ground || 'colour';
    if (gk === 'black') return { bg: BLACK, acc: C, dark: true, C, b1tx: BLACK };
    if (gk === 'white' || gk === 'grey') return { bg: gk === 'white' ? '#ffffff' : '#f6f6f6', acc: C, dark: false, C, b1tx: '#ffffff' };
    return { bg: C, acc: '#ffffff', dark: true, C, b1tx: C };
  }
  const inks2 = (sc, s1, s2) => ({ a: mix(sc.bg, sc.acc, s1), b: mix(sc.bg, sc.acc, s2) });

  /* ------------------------------------------------------------ ops: rect | type | bayer | rows | pix */
  const rect = (x, y, w, hh, fill) => ({ k: 'rect', x, y, w, h: hh, fill });
  const typeOp = (x, y, w, hh, layers, inks, fs, seed, weight) => ({ k: 'type', x, y, w, h: hh, layers, inks, fs, seed, weight: weight || 'ramp' });
  const layOf = op => { if (!op._lay) { op._lay = T().layout(op.layers, { cellSize: 'S', seed: op.seed }, Math.round(op.w), Math.round(op.h), { fs: { S: op.fs } }); if (op.post) op.post(op._lay); } return op._lay; }; /* post(lay): e.g. JSON keys into the second ink pair */
  /* Bayer edge: cells in `ink` where a vertical gradient (1 at the top of the band → 0 at its foot, noise-broken) beats the matrix;
     the top row is solid so it joins the ground above */
  const bayerOp = (x, y, w, hh, cell, ink, seed) => ({ k: 'bayer', x, y, w, h: hh, cell, ink, seed, spec: { field: 'linear', p: [Math.PI / 2, 0, 1, 0], q: [.22, 0, 0, 0] } });
  function cellsOf(op) {
    if (op._cells) return op._cells;
    const s = T().sample(Object.assign({ seed: op.seed }, op.spec), Math.round(op.w), Math.round(op.h), op.seed * 3.7, op.cell, op.cell, null), on = new Uint8Array(s.cols * s.rows);
    for (let j = 0; j < s.rows; j++) for (let i = 0; i < s.cols; i++) { const k = j * s.cols + i; on[k] = j === 0 || s.v[k] > T().bayer(i, j) ? 1 : 0; }
    return (op._cells = { cols: s.cols, rows: s.rows, on });
  }
  /* terminal band: rows from sparse dots to colons-and-glyphs to one heavy (optionally italic) row with block cursors */
  function rowsOp(x, yBottom, w, fs, n, set, ink, seed, italic, cursors) {
    const cw = fs * T().ADV, lh = fs * T().LH, cols = Math.floor(w / cw), SET = T().SETS[set] || T().SETS.brand, H = T().hash;
    const heavy = [].concat(SET.lv[5].ch), mid = [].concat(SET.lv[3].ch); const rows = [];
    let lastDot = -1; for (let r = 0; r < n - 1; r++) if ((n === 1 ? 1 : r / (n - 1)) < .34) lastDot = r;
    for (let r = 0; r < n; r++) {
      const t = n === 1 ? 1 : r / (n - 1), chars = [];
      if (r === n - 1) { for (let i = 0; i < cols; i++) chars.push(heavy[Math.floor(H(i, r, seed) * heavy.length)]); rows.push({ chars, wt: 800, it: italic, col: ink.heavy }); }
      else if (t < .34) { const sp = r === lastDot ? 2 : 4; for (let i = 0; i < cols; i++) chars.push(i % sp === 0 ? '.' : null); rows.push({ chars, wt: 400, it: false, col: ink.dot }); }
      else { for (let i = 0; i < cols; i++) chars.push(i % 2 === 0 ? ':' : (H(i, r, seed + 1) < .35 + .6 * t ? mid[Math.floor(H(i, r, seed + 2) * mid.length)] : ':')); rows.push({ chars, wt: 400, it: false, col: ink.mid }); }
    }
    const cur = []; for (let c = 0; c < cursors; c++) cur.push(Math.floor((.12 + .76 * H(c, 99, seed)) * cols));
    return { op: { k: 'rows', x, y: yBottom - n * lh, w, fs, cw, lh, rows, cursors: cur }, h: n * lh };
  }
  /* pixel type: text drawn at 1/p size and thresholded, so it scales up as hard pixels */
  function threshold(c, thr) { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height); for (let o = 3; o < d.data.length; o += 4) d.data[o] = d.data[o] >= (thr || 118) ? 255 : 0; x.putImageData(d, 0, 0); return c; }
  function wrap(x, text, maxW) { const out = []; let line = ''; for (const w of String(text).split(/\s+/).filter(Boolean)) { const t = line ? line + ' ' + w : w; if (line && x.measureText(t).width > maxW) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
  function pixLines(lines, font, fsU, lhU, wU) {
    const c = canvas(wU + 4, Math.ceil(lines.length * lhU) + 4), x = c.getContext('2d'); x.font = font(fsU); x.textBaseline = 'middle';
    lines.forEach((l, i) => { x.fillStyle = l.c; x.fillText(l.t, 1, Math.round(lhU * (i + .5)) + 1); });
    return threshold(c);
  }
  const PFONT = {
    serif: ['Source Serif 600', u => `600 ${u}px "Source Serif 4", Georgia, serif`],
    instrument: ['Instrument Serif', u => `400 ${u}px "Instrument Serif", Georgia, serif`],
    geist: ['Geist 500', u => `500 ${u}px Geist, Inter, sans-serif`],
    mono: ['JetBrains Mono 500', u => `500 ${u}px ${MONO}`],
  };

  /* ------------------------------------------------------------ paint + svg */
  function paintOps(ops, W, Ht, sc) {
    const c = canvas(W * sc, Ht * sc), x = c.getContext('2d'), R = Math.round;
    for (const op of ops) {
      if (op.k === 'rect') { x.fillStyle = op.fill; x.fillRect(R(op.x * sc), R(op.y * sc), R((op.x + op.w) * sc) - R(op.x * sc), R((op.y + op.h) * sc) - R(op.y * sc)); }
      else if (op.k === 'type') x.drawImage(T().paintType(layOf(op), op.inks, Math.round(op.w), Math.round(op.h), sc, op.seed, op.weight), R(op.x * sc), R(op.y * sc));
      else if (op.k === 'bayer') { const b = cellsOf(op); x.fillStyle = op.ink; for (let j = 0; j < b.rows; j++) for (let i = 0; i < b.cols; i++) if (b.on[j * b.cols + i]) { const x0 = R((op.x + i * op.cell) * sc), y0 = R((op.y + j * op.cell) * sc); x.fillRect(x0, y0, R((op.x + (i + 1) * op.cell) * sc) - x0, R((op.y + (j + 1) * op.cell) * sc) - y0); } }
      else if (op.k === 'rows') {
        x.textAlign = 'center'; x.textBaseline = 'alphabetic';
        op.rows.forEach((r, ri) => {
          x.font = `${r.it ? 'italic ' : ''}${r.wt} ${op.fs * sc}px ${op.fam || MONO}`; x.fillStyle = r.col; const yb = (op.y + ri * op.lh + (op.base || T().BASE) * op.fs) * sc; /* op.fam / op.base: another mono face (Geist Mono for block characters) */
          const cur = i => ri === op.rows.length - 1 && op.cursors.includes(i), blk = ch => ch && ch.charCodeAt(0) >= 0x2580 && ch.charCodeAt(0) <= 0x259f;
          for (let i = 0; i < r.chars.length;) {
            const ch = r.chars[i];
            if (blk(ch) && !cur(i)) { /* a run of block characters as one string (mono advance = cell), solid ones stroked a hair so neighbours meet without seams */
              let j = i, s = ''; while (j < r.chars.length && blk(r.chars[j]) && !cur(j)) s += r.chars[j++];
              x.textAlign = 'left'; x.fillText(s, (op.x + i * op.cw) * sc, yb); x.strokeStyle = r.col; x.lineWidth = .6 * sc; x.strokeText(s.replace(/[░▒▓]/g, ' '), (op.x + i * op.cw) * sc, yb); x.textAlign = 'center'; i = j; continue;
            }
            if (ch && !cur(i)) x.fillText(ch, (op.x + (i + .5) * op.cw) * sc, yb); i++;
          }
        });
        const last = op.rows[op.rows.length - 1]; x.fillStyle = last.col;
        for (const i of op.cursors) x.fillRect(R((op.x + i * op.cw) * sc), R((op.y + (op.rows.length - 1) * op.lh) * sc), R(op.cw * sc), R(op.lh * sc));
      } else if (op.k === 'text') { x.font = `${op.wt} ${op.size * sc}px ${op.fam}`; x.fillStyle = op.fill; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText(op.s, op.x * sc, op.y * sc); }
      else if (op.k === 'pix') { x.imageSmoothingEnabled = false; x.drawImage(op.unit, R(op.x * sc), R(op.y * sc), op.unit.width * op.p * sc, op.unit.height * op.p * sc); x.imageSmoothingEnabled = true; }
    }
    return c;
  }
  const f2 = v => +v.toFixed(2);
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function svgOps(ops, W, Ht) {
    let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${f2(W)}" height="${f2(Ht)}" viewBox="0 0 ${f2(W)} ${f2(Ht)}">`, n = 0;
    const LIGA = `style="font-variant-ligatures:none;font-feature-settings:'calt' 0,'liga' 0"`;
    for (const op of ops) {
      if (op.k === 'rect') out += `<rect x="${f2(op.x)}" y="${f2(op.y)}" width="${f2(op.w)}" height="${f2(op.h)}" fill="${op.fill}"/>`;
      else if (op.k === 'type') { const s = T().svgType(layOf(op), op.inks, Math.round(op.w), Math.round(op.h), op.seed, op.weight, null).svg; out += `<g transform="translate(${f2(op.x)} ${f2(op.y)})" font-family="JetBrains Mono, ui-monospace, monospace" font-size="${op.fs}" ${LIGA}>${s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`; }
      else if (op.k === 'bayer') { const b = cellsOf(op); let d = ''; for (let j = 0; j < b.rows; j++) { let i = 0; while (i < b.cols) { if (!b.on[j * b.cols + i]) { i++; continue; } const i0 = i; while (i < b.cols && b.on[j * b.cols + i]) i++; d += `M${f2(op.x + i0 * op.cell)} ${f2(op.y + j * op.cell)}h${f2((i - i0) * op.cell)}v${op.cell}h${f2(-(i - i0) * op.cell)}z`; } } out += `<path fill="${op.ink}" d="${d}"/>`; }
      else if (op.k === 'rows') {
        out += `<g font-family="${(op.fam || MONO).replace(/"/g, '')}" font-size="${op.fs}" ${LIGA}>`;
        op.rows.forEach((r, ri) => { const last = ri === op.rows.length - 1; const s = r.chars.map((ch, i) => (ch && !(last && op.cursors.includes(i)) ? ch : ' ')).join('').replace(/\s+$/, ''); out += `<text x="${f2(op.x)}" y="${f2(op.y + ri * op.lh + (op.base || T().BASE) * op.fs)}" font-weight="${r.wt}"${r.it ? ' font-style="italic"' : ''} fill="${r.col}" xml:space="preserve">${esc(s)}</text>`; n++; });
        const last = op.rows[op.rows.length - 1]; for (const i of op.cursors) out += `<rect x="${f2(op.x + i * op.cw)}" y="${f2(op.y + (op.rows.length - 1) * op.lh)}" width="${f2(op.cw)}" height="${f2(op.lh)}" fill="${last.col}"/>`;
        out += '</g>';
      } else if (op.k === 'text') out += `<text x="${f2(op.x)}" y="${f2(op.y)}" font-family="${op.fam.replace(/"/g, '')}" font-weight="${op.wt}" font-size="${op.size}" fill="${op.fill}">${esc(op.s)}</text>`;
      else if (op.k === 'pix') { /* runs of same-colour unit pixels */
        const u = op.unit, d = u.getContext('2d').getImageData(0, 0, u.width, u.height).data, paths = new Map();
        for (let j = 0; j < u.height; j++) { let i = 0; while (i < u.width) { const o = (j * u.width + i) * 4; if (!d[o + 3]) { i++; continue; } const key = hexOf(d[o], d[o + 1], d[o + 2]); const i0 = i; while (i < u.width) { const o2 = (j * u.width + i) * 4; if (!d[o2 + 3] || hexOf(d[o2], d[o2 + 1], d[o2 + 2]) !== key) break; i++; } (paths.get(key) || paths.set(key, []).get(key)).push(`M${f2(op.x + i0 * op.p)} ${f2(op.y + j * op.p)}h${f2((i - i0) * op.p)}v${op.p}h${f2(-(i - i0) * op.p)}z`); } }
        for (const [fill, ds] of paths) out += `<path fill="${fill}" d="${ds.join('')}"/>`;
      }
      n++;
    }
    return { svg: out + '</svg>', runs: n };
  }

  /* ------------------------------------------------------------ compositions: (W, H, st, ctx) → { ops, below } */
  const BAND = { up: 32, down: 40, cell: 8 };
  function edgeOps(ops, x, w, H, st, sc, seed) {
    if (st.edge === 'bayer') { ops.push(bayerOp(x, H - BAND.up, w, BAND.up + BAND.down, BAND.cell, sc.bg, seed)); return { cut: BAND.up, below: BAND.down }; }
    if (st.edge === 'rows') { const r = rowsOp(x, H, w, 22, st.rows || 3, st.set, { heavy: sc.acc, mid: mix(sc.bg, sc.acc, .8), dot: mix(sc.bg, sc.acc, .6) }, seed, st.italic !== false, 2); ops.push(r.op); return { cut: 0, below: 0, rowsH: r.h }; }
    return { cut: 0, below: 0 };
  }
  function headOp(ops, ctx) { if (ctx && ctx.head) ops.push(ctx.head); }
  const COMP = {
    /* image 1, top: glyph clusters at the top-right corner and the left edge, dot patches between, a dissolving edge */
    clusters(W, H, st, ctx) {
      const sc = scheme(st), ops = [], seed = st.seed; const tail = [];
      const e = edgeOps(tail, 0, W, H, st, sc, seed); ops.push(rect(0, 0, W, H - e.cut, sc.bg));
      const hh = H - e.cut - (e.rowsH || 0);
      ops.push(typeOp(0, 0, W, hh, [
        { spec: { field: 'radial', p: [1.0, 1.04, .62, 1.25], q: [.4, 0, 0, 0] }, set: st.set },
        { spec: { field: 'radial', p: [-.02, .4, .42, 1.3], q: [.45, 0, 0, 0] }, set: st.set },
        { spec: { field: 'clouds', p: [2.6, .5, .8, 0], q: [0, 0, 0, 0], gain: .5 }, set: 'dots' },
      ], inks2(sc, .3, .58), 20, seed));
      ops.push(...tail); headOp(ops, ctx); return { ops, below: e.below };
    },
    /* image 1, bottom: one field rising from the bottom-right corner, dots far out, glyphs at the corner */
    rise(W, H, st, ctx) {
      const sc = scheme(st), ops = [], tail = [], e = edgeOps(tail, 0, W, H, st, sc, st.seed);
      ops.push(rect(0, 0, W, H - e.cut, sc.bg));
      ops.push(typeOp(0, 0, W, H - e.cut - (e.rowsH || 0), [{ spec: { field: 'radial', p: [1.02, -.04, 1.55, 1.05], q: [.3, 0, 0, 0] }, set: st.set }], inks2(sc, .24, .52), 14, st.seed));
      ops.push(...tail); headOp(ops, ctx); return { ops, below: e.below };
    },
    /* image 2, top: a clean ground with the terminal band at its foot */
    terminal(W, H, st, ctx) {
      const sc = scheme(st), ops = [rect(0, 0, W, H, sc.bg)];
      const r = rowsOp(0, H, W, 22, st.rows || 3, st.set, { heavy: sc.acc, mid: mix(sc.bg, sc.acc, .8), dot: mix(sc.bg, sc.acc, .6) }, st.seed, st.italic !== false, st.cursors == null ? 2 : st.cursors);
      if (st.above === 'dots') ops.push(typeOp(0, 0, W, H - r.h, [{ spec: { field: 'linear', p: [-Math.PI / 2, .35, 1.15, 0], q: [.35, 0, 0, 0], gain: .55 }, set: 'dots' }], inks2(sc, .5, .7), 14, st.seed));
      ops.push(r.op); headOp(ops, ctx); return { ops, below: 0 };
    },
    /* image 2, bottom: black left half with dots in the colour and the terminal band, the colour on the right with a :/ field */
    split(W, H, st, ctx) {
      const L = scheme(st, 'black'), Rt = scheme(st, 'colour'), sx = Math.round(W / 2), ops = [rect(0, 0, sx, H, L.bg), rect(sx, 0, W - sx, H, Rt.bg)];
      const r = rowsOp(0, H, sx, 22, st.rows || 3, st.set === 'colon' ? 'brand' : st.set, { heavy: L.acc, mid: mix(L.bg, L.acc, .8), dot: mix(L.bg, L.acc, .6) }, st.seed, st.italic !== false, 1);
      ops.push(typeOp(0, 0, sx, H - r.h, [{ spec: { field: 'radial', p: [1.0, .02, 1.3, 1.0], q: [.3, 0, 0, 0], gain: .62 }, set: 'dots' }], inks2(L, .62, .8), 14, st.seed));
      ops.push(r.op);
      ops.push(typeOp(sx, 0, W - sx, H, [{ spec: { field: 'radial', p: [1.02, -.02, 1.45, 1.0], q: [.3, 0, 0, 0] }, set: st.set }], inks2(Rt, .26, .55), 14, st.seed + 1));
      headOp(ops, ctx); return { ops, below: 0 };
    },
  };

  /* image 3: a statement in pixel type inside crop marks, over a dot grid that thickens to the right */
  function quote(W, st) {
    const p = +st.px, fam = (PFONT[st.qfont] || PFONT.serif)[1], G = { white: '#ffffff', grey: '#f6f6f6', black: BLACK, blue: BLUE }[st.qground] || '#ffffff', dark = st.qground === 'black' || st.qground === 'blue';
    const ink = dark ? '#ffffff' : '#0d0e10', accent = { blue: BLUE, cyan: '#00d8ff', pink: '#ff3d8b', violet: '#6a3bff', white: '#ffffff' }[st.accent] || BLUE;
    const U = Math.floor(W / p), fsU = Math.round(+st.qsize / p), lhU = Math.round(fsU * 1.3), mc = canvas(4, 4).getContext('2d'); mc.font = fam(fsU);
    const maxU = Math.floor(U * .74), lines = wrap(mc, st.text, maxU).map(t => ({ t, c: ink })).concat(wrap(mc, st.acc, maxU).map(t => ({ t, c: accent })));
    const padU = Math.round(Math.max(72, W * .075) / p), V = lines.length * lhU + 2 * padU, H = V * p;
    const unit = canvas(U, V), x = unit.getContext('2d');
    const mU = Math.round(Math.min(W * .06, 64) / p), aU = Math.max(4, Math.round(18 / p)), mx = mU, my = Math.round(mU * .8);
    if (st.dots !== false) { /* dot grid: one unit dot per `pitch` units, Bayer-ordered by a field rising to the right */
      const pitch = +st.pitch, s = T().sample({ field: 'linear', p: [-.3, .22, 1.04, 0], q: [.4, 0, 0, 0], seed: st.seed }, W, H, st.seed * 3.7, pitch * p, pitch * p, null);
      x.fillStyle = dark ? mix(G, '#ffffff', .32) : mix(G, '#0d0e10', .24);
      for (let j = 0; j < s.rows; j++) for (let i = 0; i < s.cols; i++) { const ux = i * pitch + 1, uy = j * pitch + 1; if (ux < mx + 3 || ux > U - mx - 3 || uy < my + 3 || uy > V - my - 3) continue; if (s.v[j * s.cols + i] > T().bayer(i, j)) x.fillRect(ux, uy, 1, 1); }
    }
    x.fillStyle = ink; /* crop marks */
    for (const [cx, cy, sx, sy] of [[mx, my, 1, 1], [U - mx - 1, my, -1, 1], [mx, V - my - 1, 1, -1], [U - mx - 1, V - my - 1, -1, -1]]) { x.fillRect(sx > 0 ? cx : cx - aU + 1, cy, aU, 1); x.fillRect(cx, sy > 0 ? cy : cy - aU + 1, 1, aU); }
    const tc = pixLines(lines, fam, fsU, lhU, maxU + 4); x.drawImage(tc, Math.round(U * .12), padU - 2);
    return { ops: [rect(0, 0, W, H, G), { k: 'pix', x: 0, y: 0, unit, p }], H, below: 0 };
  }

  /* ------------------------------------------------------------ cards */
  const CSS = `
.xs{--hair:#e6e8ec;--mute:#8b909a;--ink2:#5b616e;font-family:Geist,Inter,system-ui,sans-serif;color:#0d0e10;background:#fff;padding:22px;display:grid;gap:18px}
.xs *{box-sizing:border-box}
.xs-stage{padding:36px 28px 44px;border-radius:12px;display:grid;gap:44px}
.xs-fig{margin:0;display:grid;gap:10px}
.xs-sec{position:relative}
.xs-sec>canvas{position:absolute;left:0;top:0;display:block;pointer-events:none}
.xs-copy{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;padding:52px 56px 64px;color:var(--tx)}
.xs-eb{font:400 15px/1.2 ${MONO};margin-bottom:16px}
.xs-copy h2{font:400 42px/1.14 Geist,Inter,sans-serif;letter-spacing:-.02em;margin:0 0 30px}
.xs-sec.pix .xs-copy h2{font-family:'Source Serif 4',Georgia,serif;font-weight:600;letter-spacing:-.01em;visibility:hidden}
.xs-btns{display:flex;flex-wrap:wrap;gap:10px}
.xs-b1,.xs-b2{height:46px;padding:0 24px;display:inline-flex;align-items:center;font:500 16px Geist,Inter,sans-serif}
.xs-b1{background:var(--b1bg);color:var(--b1tx)}.xs-b2{box-shadow:inset 0 0 0 1px var(--b2bd);color:var(--tx)}
.xs-r{padding-top:30px}.xs-r p{font:400 18px/1.6 Geist,Inter,sans-serif;margin:0 0 20px;max-width:48ch}.xs-r small{display:block;font:15px/1.5 Geist,Inter,sans-serif;opacity:.88}
.xs-cap{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font:11px 'Geist Mono',ui-monospace,monospace;color:var(--mute)}.xs-cap span{margin-right:auto}
.xs-cap button{height:26px;padding:0 9px;border-radius:6px;border:1px solid var(--hair);background:#fff;font:500 11px 'Geist Mono',ui-monospace,monospace;color:#0d0e10;cursor:pointer}
.xs-note{font:12px/1.5 Geist,Inter,sans-serif;color:var(--ink2)}
.xs .dt-bar input.xs-in{height:28px;padding:0 10px;border-radius:7px;border:1px solid var(--hair);background:#fff;font:13px Geist,Inter,sans-serif;min-width:220px}
@container (max-width: 820px){ .xs-copy{grid-template-columns:1fr;gap:8px;padding:36px 28px 48px} .xs-r{padding-top:0} .xs-copy h2{font-size:32px} }`;
  let styled = false;
  function ensure() {
    K().ensure(); if (styled) return; styled = true; document.head.appendChild(h('style', null, CSS));
    document.head.appendChild(h('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Geist+Mono:wght@100..900&family=Fira+Code:wght@300..700&display=swap' }));
  }
  /* Geist Mono and Fira Code ship the block elements (U+2580–259F) in their own subset, so load them with block text */
  const fontsReady = () => (document.fonts ? Promise.all(['600 40px "Source Serif 4"', '400 40px "Instrument Serif"', '800 italic 22px "JetBrains Mono"', '400 40px Geist', ['400 20px "Geist Mono"', 'a█▀▄░▁▏'], ['700 20px "Geist Mono"', 'a█'], ['400 20px "Fira Code"', 'a█▀▄░▁▏'], ['700 20px "Fira Code"', 'a█']].map(f => (Array.isArray(f) ? document.fonts.load(f[0], f[1]) : document.fonts.load(f)).catch(() => {}))) : Promise.resolve());

  const OPT = {
    colour: { key: 'colour', label: 'Colour', values: Object.entries(COL).map(([k, v]) => [k, v[0]]), swatch: v => COL[v] && COL[v][1] },
    ground: { key: 'ground', label: 'Ground', values: [['colour', 'Colour'], ['black', 'Black'], ['white', 'White'], ['grey', 'Grey']] },
    set: { key: 'set', label: 'Glyphs', values: [['brand', '//:<>'], ['slash', '//'], ['angle', '<>'], ['brace', '{:}'], ['colon', ':/'], ['url', 'URL'], ['ascii', 'ASCII']] },
    edge: { key: 'edge', label: 'Edge', values: [['bayer', 'Bayer'], ['rows', 'Type rows'], ['none', 'None']] },
    rows: { key: 'rows', label: 'Rows', values: [[3, '3'], [6, '6']] },
    italic: { key: 'italic', label: 'Heavy row', values: [[true, 'Italic'], [false, 'Upright']] },
    head: { key: 'heading', label: 'Heading', values: [['sans', 'Geist'], ['pixel', 'Pixel serif']] },
    copy: { key: 'copy', label: 'Copy', values: Object.entries(PNAME).map(([k, v]) => [k, v]) },
    page: { key: 'page', label: 'Page', values: [['#f6f6f6', 'Grey'], ['#ffffff', 'White']] },
  };

  /* a section: DOM copy + canvas art, sized to the copy; returns the export closure */
  function section(fig, item, st) {
    const sc = item.scheme, sec = h('div', { class: 'xs-sec' + (st.heading === 'pixel' ? ' pix' : ''), style: `--tx:${sc.dark ? '#ffffff' : '#0d0e10'};--b1bg:${sc.dark ? '#ffffff' : '#0d0e10'};--b1tx:${sc.b1tx};--b2bd:${sc.dark ? 'rgba(255,255,255,.32)' : 'rgba(13,14,16,.2)'}` });
    const cv = h('canvas'); sec.appendChild(cv);
    let copy = null;
    if (item.copy) { const c = item.copy; copy = h('div', { class: 'xs-copy' }, h('div', null, h('div', { class: 'xs-eb' }, c.path), h('h2', { html: c.title }), h('div', { class: 'xs-btns' }, h('span', { class: 'xs-b1' }, c.b1), h('span', { class: 'xs-b2' }, c.b2))), h('div', { class: 'xs-r' }, h('p', null, c.body), h('small', null, c.note))); sec.appendChild(copy); }
    fig.appendChild(sec);
    return () => {
      const W = sec.clientWidth; if (!W) return null;
      let res, H;
      if (item.quote || item.art) { res = item.art ? item.art(W, st) : quote(W, st); H = res.H; } /* art: a whole composition without HTML copy */
      else {
        H = Math.max(item.minH || 420, copy.offsetHeight + (item.extra || 0));
        let head = null;
        if (st.heading === 'pixel') { /* the h2 drawn as pixel serif in the art, at the hidden h2's place */
          const h2 = copy.querySelector('h2'), r = h2.getBoundingClientRect(), r0 = sec.getBoundingClientRect(), cs = getComputedStyle(h2), fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) || fs * 1.14, p = 2;
          const fam = PFONT.serif[1], fsU = Math.round(fs / p), mc = canvas(4, 4).getContext('2d'); mc.font = fam(fsU);
          const lines = item.copy.title.split(/<br\s*\/?>/).flatMap(t => wrap(mc, t, r.width / p)).map(t => ({ t, c: sc.dark ? '#ffffff' : '#0d0e10' }));
          head = { k: 'pix', x: r.left - r0.left - p, y: r.top - r0.top - p, unit: pixLines(lines, fam, fsU, lh / p, Math.ceil(r.width / p) + 8), p };
        }
        res = item.comp(W, H, st, { head });
      }
      sec.style.height = H + 'px'; sec.style.marginBottom = (res.below || 0) + 'px'; /* room for an edge that dissolves past the section */
      const dpr = Math.min(devicePixelRatio || 1, 2), Ht = H + (res.below || 0), c = paintOps(res.ops, W, Ht, dpr);
      cv.width = c.width; cv.height = c.height; cv.style.width = W + 'px'; cv.style.height = Ht + 'px'; cv.getContext('2d').drawImage(c, 0, 0);
      return { ops: res.ops, W, Ht };
    };
  }

  function card(name, title, blurb, def) {
    DEMOS.register(name, {
      group: def.group || 'dtx', title, blurb, def, /* def.group: other pages reuse the section card (content visuals: 'cv'); def kept so a page can clone cards (humanized copy: 'cvh') */
      mount(stage) {
        ensure();
        const st = Object.assign({ seed: 1, heading: 'sans', page: '#f6f6f6', copy: 'pub', set: 'brand', colour: 'blue', ground: 'colour', edge: 'none', rows: 3, italic: true }, def.init);
        const root = h('div', { class: 'xs' }); stage.appendChild(root);
        const bar = h('div', { class: 'dt-bar' }); root.appendChild(bar);
        for (const o of def.opts) {
          bar.appendChild(h('b', null, o.label));
          if (o.input) { bar.appendChild(h('input', { class: 'xs-in', value: st[o.key], spellcheck: 'false', oninput: e => { st[o.key] = e.target.value; draw(); } })); continue; }
          o.values.forEach(([v, l], i) => bar.appendChild(h('button', { class: st[o.key] === v ? 'on' : '', 'data-k': o.key, 'data-i': String(i), style: o.swatch ? '--c:' + o.swatch(v) : '', onclick: () => { st[o.key] = v; bar.querySelectorAll(`[data-k="${o.key}"]`).forEach(b => b.classList.toggle('on', +b.dataset.i === i)); draw(); } }, o.swatch ? h('i') : null, l)));
        }
        bar.appendChild(h('b', null, 'Seed'));
        const sd = h('span', { class: 'seed' }, String(st.seed)), setSeed = v => { st.seed = v; sd.textContent = v; draw(); };
        bar.append(h('button', { onclick: () => setSeed(Math.max(0, st.seed - 1)) }, '‹'), sd, h('button', { onclick: () => setSeed(st.seed + 1) }, '›'), h('button', { onclick: () => setSeed(1 + Math.floor(Math.random() * 999)) }, 'Shuffle'));
        const stg = h('div', { class: 'xs-stage' }); root.appendChild(stg);
        root.appendChild(h('div', { class: 'xs-note' }, def.note || 'The copy is live HTML; the exports are the art layer only (ground, glyphs, edges and, with Pixel serif on, the heading), at the section’s current width. PNG at 2×. SVG keeps type rows and glyph fields as JetBrains Mono text (ligatures off) and Bayer cells and pixel type as merged runs.'));
        let raf = 0, painters = [];
        function draw() {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            stg.style.background = st.page; stg.replaceChildren(); painters = [];
            for (const item of def.items(st)) {
              const fig = h('figure', { class: 'xs-fig' }); stg.appendChild(fig);
              if (item.dom) { /* live HTML text instead of a canvas: item.dom(st) → { el, text }; exports are the plain text */
                const d = item.dom(st); fig.appendChild(d.el); const slug = (item.label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                fig.appendChild(h('figcaption', { class: 'xs-cap' }, h('span', null, item.label || ''),
                  h('button', { onclick: async e => { try { await navigator.clipboard.writeText(d.text); S().flash(e.target, 'copied ✓'); } catch (err) { S().flash(e.target, 'blocked: use .txt ↓'); } } }, 'Copy text'),
                  h('button', { onclick: () => S().download(new Blob([d.text], { type: 'text/plain;charset=utf-8' }), `iframely-section-${def.short}-${slug}-s${st.seed}.txt`) }, '.txt ↓')));
                continue;
              }
              const paint = section(fig, item, st); let last = null;
              const slug = (item.label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              const fname = ext => `iframely-section-${def.short}-${slug}-s${st.seed}.${ext}`;
              const png = () => paintOps(last.ops, last.W, last.Ht, 2);
              const bCopy = h('button', { onclick: async e => { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': S().toBlob(png()) })]); S().flash(e.target, 'copied ✓'); } catch (err) { S().flash(e.target, 'blocked: use PNG ↓'); } } }, 'Copy PNG');
              const bPng = h('button', { onclick: async () => S().download(await S().toBlob(png()), fname('png')) }, 'PNG ↓');
              const bSvg = h('button', { onclick: () => S().download(new Blob([svgOps(last.ops, last.W, last.Ht).svg], { type: 'image/svg+xml' }), fname('svg')) }, 'SVG ↓');
              fig.appendChild(h('figcaption', { class: 'xs-cap' }, h('span', null, item.label || ''), bCopy, bPng, bSvg));
              painters.push(() => { last = paint(); });
            }
            painters.forEach(p => p());
          });
        }
        if (!K().R.init()) { root.appendChild(h('div', { class: 'fallback' }, 'WebGL2 is not available in this browser.')); return () => {}; }
        draw(); fontsReady().then(draw);
        let w0 = 0; const ro = new ResizeObserver(() => { const w = root.clientWidth; if (Math.abs(w - w0) > 2) { w0 = w; draw(); } }); ro.observe(root);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
      },
    });
  }
  const one = (comp, extra) => st => [{ comp: COMP[comp], copy: COPY[st.copy], scheme: comp === 'split' ? scheme(st, 'black') : scheme(st), label: PNAME[st.copy] + ' · ' + st.colour + ' · ' + (comp === 'split' ? 'black | ' + st.colour : st.ground), extra: extra ? extra(st) : 0 }];
  const rowsExtra = st => (st.edge === 'rows' ? (st.rows || 3) * 22 * 1.25 : 0);

  card('dtx-clusters', 'Glyph clusters, dissolving edge', 'After the first composition: glyph clusters in the top-right corner and down the left edge, faint dot patches between them, and the section dissolving into the page through a Bayer edge in 8 px cells (or ending in type rows). Colour ground with white marks, or black / white / grey with marks in the colour.', {
    short: 'clusters', init: { edge: 'bayer' }, opts: [OPT.copy, OPT.colour, OPT.ground, OPT.set, OPT.edge, OPT.head, OPT.page], items: one('clusters', rowsExtra),
  });
  card('dtx-rise', 'Field rising to the corner', 'After the pink composition: one glyph field rising from the bottom-right corner under the body copy, dots far out and //:<> at the corner, in white on the colour. Switch the set to put each product in its own symbol.', {
    short: 'rise', init: { colour: 'pink' }, opts: [OPT.copy, OPT.colour, OPT.ground, OPT.set, OPT.edge, OPT.head, OPT.page], items: one('rise', rowsExtra),
  });
  card('dtx-terminal', 'Terminal band with cursors', 'After the black composition: a clean ground and, at its foot, a band of type rows: sparse dots, colons with glyphs, and one heavy italic row with two block cursors, like the last lines of a terminal. Three or six rows; an optional dot field rising towards the band.', {
    short: 'terminal', init: { ground: 'black' }, extra: true,
    opts: [OPT.copy, OPT.colour, OPT.ground, OPT.set, OPT.rows, OPT.italic, { key: 'above', label: 'Above', values: [['clean', 'Clean'], ['dots', 'Dot field']] }, OPT.head, OPT.page],
    items: st => one('terminal', s => (s.rows || 3) * 22 * 1.25)(st),
  });
  card('dtx-split', 'Black | colour split', 'After the split composition: the heading on black, with dots in the colour gathering towards the seam and the terminal band under it; the body on the colour, over a :/ field rising to the corner.', {
    short: 'split', init: { set: 'colon' }, opts: [OPT.copy, OPT.colour, OPT.set, OPT.rows, OPT.italic, OPT.head, OPT.page], items: st => one('split', s => (s.rows || 3) * 22 * 1.25)(st),
  });
  card('dtx-quote', 'Pixel serif statement', 'After the third reference: a statement set in pixel type (the font drawn at 1/2 or 1/3 size and thresholded, then scaled up hard), inside crop marks, over a grid of one-pixel dots that thickens to the right in Bayer order. The last line takes the accent. Type your own text.', {
    short: 'quote', init: { px: 2, qsize: 34, qfont: 'serif', qground: 'white', accent: 'blue', pitch: 3, dots: true, text: 'Iframely renders previews and embeds for more than 6,000 products. See who fetches your pages and why, and set what each agent receives, per domain and path.', acc: 'Your content, your rules.' },
    opts: [{ key: 'text', label: 'Text', input: true }, { key: 'acc', label: 'Accent line', input: true }, { key: 'qfont', label: 'Font', values: Object.entries(PFONT).map(([k, v]) => [k, v[0]]) },
      { key: 'px', label: 'Pixel', values: [[2, '2 px'], [3, '3 px']] }, { key: 'qsize', label: 'Size', values: [[28, '28'], [34, '34'], [44, '44']] }, { key: 'accent', label: 'Accent', values: [['blue', 'Blue'], ['cyan', 'Cyan'], ['pink', 'Pink'], ['violet', 'Violet'], ['white', 'White']] },
      { key: 'qground', label: 'Ground', values: [['white', 'White'], ['grey', 'Grey'], ['black', 'Black'], ['blue', 'Blue']] }, { key: 'pitch', label: 'Dot pitch', values: [[3, '3'], [4, '4']] }, { key: 'dots', label: 'Dots', values: [[true, 'On'], [false, 'Off']] }, OPT.page],
    items: st => [{ quote: true, scheme: scheme(st, 'white'), label: 'statement · ' + st.qfont + ' · ' + st.qground }],
    note: 'Everything here is art: pixel text, crop marks and dots share one pixel grid, so the SVG is merged runs per colour and stays crisp at any scale. PNG at 2×.',
  });
  /* shared with demos/dither-sections2.js */
  DEMOS.sectionsKit = { card, COMP, COPY, PNAME, OPT, COL, BLACK, BLUE, scheme, inks2, rect, typeOp, rowsOp, bayerOp, pixLines, threshold, wrap, PFONT, mix };

  /* the four products as a set, one composition each, in their own colours and symbols */
  const SET4 = [
    { k: 'rich', comp: 'clusters', o: { colour: 'blue', set: 'slash', edge: 'bayer', ground: 'colour' } },
    { k: 'preview', comp: 'rise', o: { colour: 'violet', set: 'angle', edge: 'none', ground: 'colour' } },
    { k: 'data', comp: 'terminal', o: { colour: 'orchid', set: 'brace', ground: 'black' } },
    { k: 'pub', comp: 'split', o: { colour: 'magenta', set: 'colon' } },
  ];
  card('dtx-products', 'Four products, four sections', 'The product pages as one system: Rich Media in blue with // clusters and the Bayer edge, Preview API in violet with a <> field rising to the corner, Data API on black with a {:} terminal band in orchid, Publisher Console split black | magenta over a :/ field. Each in its own colour and symbol; the heading switch applies to all four.', {
    short: 'products', opts: [OPT.head, OPT.italic, { key: 'mono', label: 'Colours', values: [[false, 'Product'], [true, 'All blue']] }, OPT.page],
    items: st => SET4.map(p => { const s = Object.assign({}, st, p.o, st.mono ? { colour: 'blue' } : {}); return { comp: (W, H, _st, ctx) => COMP[p.comp](W, H, s, ctx), copy: COPY[p.k], scheme: p.comp === 'split' ? scheme(s, 'black') : scheme(s), label: PNAME[p.k] + ' · ' + p.comp, extra: p.comp === 'terminal' || p.comp === 'split' ? 3 * 22 * 1.25 : 0 }; }),
  });
})();
