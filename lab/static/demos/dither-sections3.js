/* X · Dither sections, round 3 (2026-11-05): new section ideas with glyphs, text, data, shapes and masks (group 'dtx', X13–X18).
     X13  the section closes like a response: staircases of } ] } (or </div>) at its foot, dripping past the edge
     X14  the URL holds its response: the URL set huge as a mask, filled with its own JSON
     X15  skeletons written in data: loading skeletons whose bars are measured from the real response and fill with it as it resolves
     X16  redacted by policy: one page as three agents receive it, withheld values covered in block characters
     X17  a mask made of weight: a wall of words where the shape is only a change of weight and ink, never of presence
     X18  the access receipt: a Data API read (or a Console policy test) printed as a receipt hanging out of the section
   Article, receipt and policy data are illustrative mocks (example-news.com); the other responses come from dither-sections2.js.
   Needs dither-sections.js (sectionsKit), dither-sections2.js (sectionsKit2) and dither-stills2.js (typeKit). */
(() => {
  const X = () => DEMOS.sectionsKit, Y = () => DEMOS.sectionsKit2, T = () => DEMOS.typeKit;
  const MONO = '"JetBrains Mono", ui-monospace, monospace', GEIST = 'Geist, Inter, sans-serif', INK = '#0d0e10';
  const { card, COPY, OPT, scheme } = X();
  const m = (a, b, k) => X().mix(a, b, k);
  const ctx2d = () => document.createElement('canvas').getContext('2d');
  /* F: another mono face { fam, lh, base } (Geist Mono / Fira Code carry the block characters; JetBrains Mono from Google Fonts does not) */
  const rowsOp = (x, y, fs, rows, cursors, F) => ({ k: 'rows', x, y, w: 0, fs, cw: fs * T().ADV, lh: fs * (F ? F.lh : T().LH), fam: F && F.fam, base: F && F.base, rows: rows.map(r => ({ chars: Array.isArray(r.chars) ? r.chars : r.s.split(''), wt: r.wt || 400, it: false, col: r.col })), cursors: cursors || [] });
  /* line height = the face's full-block height, so rows of █ ▀ ▄ stack into solid areas (measured: Geist Mono 0.96 + 0.34 em, Fira Code 0.90 + 0.30 em) */
  const TFONT = {
    geist: { label: 'Geist Mono', fam: '"Geist Mono", ui-monospace, monospace', lh: 1.3, base: .96, blocks: true },
    fira: { label: 'Fira Code', fam: '"Fira Code", ui-monospace, monospace', lh: 1.2, base: .9, blocks: true },
    jbm: { label: 'JetBrains Mono', fam: null, lh: 1.25, base: null, blocks: false },
  };
  const FSOPT = (vals, label) => ({ key: 'fs', label: label || 'Type', values: vals.map(v => [v, String(v)]) });
  const bayerLv = (v, i, j) => { const lv = v * 5, fl = Math.floor(lv); return Math.max(0, Math.min(5, fl + (lv - fl >= T().bayer(i, j) ? 1 : 0))); };

  /* ------------------------------------------------------------ X13 the section closes like a response */
  const CLOSE = { json: ['}', ']', '}', '}', ']', '}', '}'], html: ['</a>', '</li>', '</ul>', '</nav>', '</div>', '</main>', '</body>'] };
  card('dtx-close', 'The section closes like a response', 'Our take on the dissolving edge: the section ends the way a response does. Its foot is a run of closing staircases, } ] } stepping out to the left like nested JSON (or </a> </ul> </div> like HTML), light at the top and heavy at the last row, every block at its own depth. Past the edge a few } drip onto the page in the section colour.', {
    short: 'close', init: { closer: 'json', depth: 5, drip: true },
    opts: [OPT.copy, OPT.colour, OPT.ground, { key: 'closer', label: 'Closes with', values: [['json', 'JSON } ] }'], ['html', 'HTML </div>'], ['mixed', 'Both']] }, { key: 'depth', label: 'Depth', values: [[3, '3'], [5, '5'], [7, '7']] }, { key: 'drip', label: 'Past the edge', values: [[true, 'Drips'], [false, 'Clean']] }, OPT.head, OPT.page],
    items: st => [{ copy: COPY[st.copy], scheme: scheme(st), label: X().PNAME[st.copy] + ' · ' + st.closer + ' · depth ' + st.depth, extra: st.depth * 16 * 1.25 + 16, comp: (W, H, s, ctx) => {
      const sc = scheme(s), fs = 16, cw = fs * T().ADV, lh = fs * T().LH, n = +s.depth, hs = T().hash, cols = Math.floor(W / cw), ops = [X().rect(0, 0, W, H, sc.bg)];
      const rows = Array.from({ length: n }, () => new Array(cols).fill(null)), starts = [];
      for (let i0 = 1, b = 0; i0 < cols; b++) {
        const html = s.closer === 'html' || (s.closer === 'mixed' && hs(b, 3, s.seed) < .4), list = (html ? CLOSE.html : CLOSE.json).slice(7 - n);
        const dn = hs(b, 1, s.seed) < .45 ? n - 1 - Math.floor(hs(b, 2, s.seed) * Math.min(2, n - 1)) : n; /* some blocks are shallower */
        for (let r = n - dn; r < n; r++) {
          const t = list[r] + (r < n - 1 && !html && hs(b, r + 9, s.seed) < .3 ? ',' : ''), c0 = i0 + (n - 1 - r) * 2;
          for (let k = 0; k < t.length; k++) if (c0 + k < cols) rows[r][c0 + k] = t[k];
        }
        starts.push(i0); i0 += (n - 1) * 2 + (html ? 8 : 3) + Math.floor(hs(b, 4, s.seed) * 3);
      }
      const y0 = H - n * lh - 4;
      /* the indentation itself, shown as an editor shows whitespace: · from each block's start up to its token */
      const ws = rows.map((row, r) => { const c = new Array(cols).fill(null); starts.forEach((i0, b) => { const end = (starts[b + 1] || cols); let tok = -1; for (let i = i0; i < end; i++) if (row[i]) { tok = i; break; } if (tok > i0) for (let i = i0; i < tok; i++) c[i] = '·'; }); return c; });
      ops.push(rowsOp(0, y0, fs, ws.map(chars => ({ chars, col: m(sc.bg, sc.acc, .3) }))));
      ops.push(rowsOp(0, y0, fs, rows.map((chars, r) => ({ chars, wt: r === n - 1 ? 800 : r >= n - 2 ? 600 : 400, col: m(sc.bg, sc.acc, .32 + .68 * (r + 1) / n) }))));
      let below = 0;
      if (s.drip) { /* the last } of each block keeps falling, in the section colour, onto the page */
        const d = [0, 1, 2].map(r => { const c = new Array(cols).fill(null); starts.forEach((i, b) => { if (i < cols && hs(b, 40 + r, s.seed) < [.75, .4, .18][r]) c[i] = r === 2 ? '.' : '}'; }); return c; });
        ops.push(rowsOp(0, H, fs, d.map((chars, r) => ({ chars, wt: r ? 400 : 800, col: sc.bg })))); below = Math.ceil(3 * lh);
      }
      if (ctx.head) ops.push(ctx.head); return { ops, below };
    } }],
  });

  /* ------------------------------------------------------------ X14 the URL holds its response */
  const UFONT = { mono: ['Mono 800', u => `800 ${Math.round(u)}px ${MONO}`], geist: ['Geist 700', u => `700 ${Math.round(u)}px ${GEIST}`], serif: ['Serif 600', u => `600 ${Math.round(u)}px "Source Serif 4", Georgia, serif`] };
  card('dtx-urlmask', 'The URL holds its response', 'A band where the URL itself is the shape: youtu.be/dQw4w9WgXcQ set huge as a mask and filled with the response it resolves to, compact JSON with the keys in the second ink, sparse at the top of the letters and dense at the baseline. The request runs above it with a cursor, the status below; around it a faint haze of the same data, or nothing.', {
    short: 'urlmask', init: { ground: 'black', resp: 'video', ufont: 'mono', fs: 6, fill: 'flat', haze: false },
    opts: [Y().RESP_OPT, OPT.colour, OPT.ground, { key: 'ufont', label: 'URL face', values: Object.entries(UFONT).map(([k, v]) => [k, v[0]]) }, { key: 'fill', label: 'Fill', values: [['grad', 'Dense at the baseline'], ['flat', 'Even']] }, { key: 'haze', label: 'Around', values: [[true, 'JSON haze'], [false, 'Clean']] }, FSOPT([6, 7, 9]), OPT.page],
    items: st => [{ art: (W, s) => {
      const sc = scheme(s), R = Y().RESP[s.resp], pad = 40, H = Math.round(Math.max(420, Math.min(600, W * .5))), F = UFONT[s.ufont][1], tx = sc.dark ? '#ffffff' : INK;
      const cut = R.u.indexOf('/') + 1, lines = [R.u.slice(0, cut), R.u.slice(cut)]; /* domain/ over the path, so the letters get big enough to read */
      const mc = ctx2d(); mc.font = F(100); const size = Math.min((H - 150) / 2 / .78, 100 * (W - pad * 2) / Math.max(...lines.map(l => mc.measureText(l).width)));
      const fs = +s.fs, json = Y().compact(R.lines), set = Y().streamSet(json, null, Math.ceil(W / (fs * T().ADV)), s.seed * 17), y1 = Math.round(76 + size * .76), y2 = Math.round(y1 + size * .82);
      const spec = { field: 'clouds', p: [1.6, .42, .86, 0], q: [0, 0, 0, 0], gain: s.haze ? .36 : 0, maskMode: 2, mg: s.fill === 'flat' ? .97 : 1.4, mgy: s.fill === 'flat' ? 0 : 1 };
      const maskFn = (w, hh, sp) => { const mk = document.createElement('canvas'); mk.width = w; mk.height = hh; const x = mk.getContext('2d'); x.fillStyle = '#fff'; x.font = F(size); x.fillText(lines[0], pad - size * .04, y1); x.fillText(lines[1], pad - size * .04, y2); sp.mbox = [1 - (y2 + 4) / hh, 1 - (y1 - size * .72) / hh]; mk._v = 1; return mk; };
      const inks = Object.assign(Y().jsonInks(sc), { a: m(sc.bg, sc.dark ? '#ffffff' : INK, s.haze ? .45 : .72) }); /* the letters need their 600 level bright, not hazy */
      const ops = [X().rect(0, 0, W, H, sc.bg), Object.assign(X().typeOp(0, 0, W, H, [{ spec, set, maskFn }], inks, fs, s.seed, 800), { post: Y().keyTint(set) })];
      const req = '> GET iframe.ly/api/' + R.api + '?url=' + R.u + R.q;
      ops.push(rowsOp(pad, pad - 8, 14, [{ s: req + '  ', wt: 600, col: tx }], [req.length + 1]));
      ops.push(rowsOp(pad, H - pad - 10, 13, [{ s: '200 OK · ' + R.ms + ' ms · ' + json.length + ' bytes · ' + R.site, col: m(sc.bg, tx, .6) }]));
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: Y().RESP[st.resp].label + ' · ' + st.ufont + ' · ' + st.ground }],
  });

  /* ------------------------------------------------------------ X15 skeletons written in data */
  const LOAD = { skel: () => .3, done: () => .76, sweep: ax => (ax < .28 ? .76 : ax > .78 ? .3 : .76 - (ax - .28) / .5 * .46) };
  const wrapChars = (s, n, max) => { const out = []; let line = ''; for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (line && t.length > n) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out.slice(0, max).map(l => l.slice(0, n)); };
  card('dtx-skeleton', 'Skeletons written in data', 'Loading skeletons for three embeds (a YouTube player, a GitHub link card, a SoundCloud track) where every grey bar is made of what will fill it. Bar lengths are measured from the real title, description and site, word gaps included; image blocks hold the compact JSON. Skeleton is dots and colons, Loaded is the text itself, Resolving sweeps from one to the other across the card.', {
    short: 'skeleton', init: { load: 'sweep', sground: 'grey', fs: 10 },
    opts: [{ key: 'load', label: 'State', values: [['skel', 'Skeleton'], ['sweep', 'Resolving'], ['done', 'Loaded']] }, { key: 'sground', label: 'Ground', values: [['grey', 'Grey'], ['white', 'White'], ['black', 'Black'], ['colour', 'Colour']] }, OPT.colour, FSOPT([8, 10, 12]), OPT.page],
    items: st => [{ art: (W, s) => {
      const C = (X().COL[s.colour] || X().COL.blue)[1], G = { grey: '#f6f6f6', white: '#ffffff', black: X().BLACK, colour: C }[s.sground], dark = s.sground === 'black';
      const tile = dark ? '#16171a' : s.sground === 'white' ? '#f6f6f6' : '#ffffff', tx = dark ? '#ffffff' : INK;
      const inks = { a: m(tile, tx, dark ? .38 : .34), b: tx, c: m(tile, C, dark ? .8 : .62), d: C };
      const fs = +s.fs, cw = fs * T().ADV, lh = fs * T().LH, out = 24, gap = 16, pad = 18, tw = (W - out * 2 - gap * 2) / 3, icols = Math.floor((tw - pad * 2) / cw);
      const kinds = [['video', 'video'], ['card', 'card'], ['audio', 'audio']], tiles = [];
      for (const [k, rk] of kinds) { /* elements in cells: { c, r, w, h, str | json, shape } */
        const R = Y().RESP[rk], json = Y().compact(R.lines), el = []; let r = 0;
        const bars = lines => lines.forEach(l => { el.push({ c: 0, r, w: l.length, h: 1, str: l }); r++; });
        if (k === 'video') { const th = Math.round(icols * cw * 9 / 16 / lh); el.push({ c: 0, r, w: icols, h: th, json, shape: 'play' }); r += th + 1; bars(wrapChars(R.title, icols, 2)); r++; bars(wrapChars(R.desc, icols, 1)); }
        if (k === 'card') { const th = Math.round(icols * cw / 1.91 / lh); el.push({ c: 0, r, w: icols, h: th, json }); r += th + 1; bars(['// ' + R.site]); r++; bars(wrapChars(R.title, icols, 2)); bars(wrapChars(R.desc, icols, 2)); }
        if (k === 'audio') { const a = Math.floor(icols * .4), ah = Math.round(a * cw / lh), rc = icols - a - 2; el.push({ c: 0, r: 0, w: a, h: ah, json });
          wrapChars(R.title, rc, 2).forEach((l, n) => el.push({ c: a + 2, r: n, w: l.length, h: 1, str: l })); el.push({ c: a + 2, r: 3, w: ('// ' + R.site).length, h: 1, str: '// ' + R.site });
          r = ah + 1; el.push({ c: 0, r, w: icols, h: 5, json: json.slice(200), shape: 'wave' }); r += 6; bars(wrapChars(R.desc, icols, 1)); }
        tiles.push({ k, R, el, rows: r });
      }
      const th = Math.ceil(Math.max(...tiles.map(t => t.rows)) * lh + pad * 2), H = th + out * 2, ops = [X().rect(0, 0, W, H, G)];
      tiles.forEach((t, n) => {
        const x0 = Math.round(out + n * (tw + gap)), ix = x0 + pad, iy = out + pad; ops.push(X().rect(x0, out, Math.round(tw), th, tile));
        t.el.forEach((e, q) => {
          const w = Math.ceil(e.w * cw), hh = Math.ceil(e.h * lh);
          if (e.shape !== 'wave') ops.push(X().rect(ix + e.c * cw - 2, iy + e.r * lh, w + 4, hh, m(tile, tx, dark ? .07 : .045))); /* the skeleton bar itself, faint */
          const set = e.str ? Y().textSet([e.str], (i, j) => (j === 0 && i < e.str.length ? [0, i] : null)) : Y().streamSet(e.json, null, e.w, q * 31 + n * 7);
          const maskFn = (mw, mh) => { const mk = document.createElement('canvas'); mk.width = mw; mk.height = mh; const x = mk.getContext('2d'); x.fillStyle = '#fff';
            if (e.shape === 'wave') { for (let i = 0; i < e.w; i += 2) { const bh = Math.max(1, Math.round((.25 + .75 * Math.abs(Math.sin(i * .37 + n) * T().hash(i, 5, s.seed))) * e.h)); x.fillRect(Math.floor(i * cw), Math.floor((e.h - bh) * lh), Math.ceil(cw), Math.ceil(bh * lh)); } }
            else { x.fillRect(0, 0, mw, mh); if (e.shape === 'play') { const rr = mh * .2; x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(mw / 2 - rr * .7, mh / 2 - rr); x.lineTo(mw / 2 + rr, mh / 2); x.lineTo(mw / 2 - rr * .7, mh / 2 + rr); x.closePath(); x.fill(); } }
            mk._v = 1; return mk; };
          const post = lay => { for (let k = 0; k < lay.lvl.length; k++) { if (!lay.lvl[k]) continue; const i = k % lay.cols, j = (k / lay.cols) | 0; if (i >= e.w || j >= e.h) { lay.lvl[k] = 0; continue; } lay.lvl[k] = Math.max(1, bayerLv(LOAD[s.load]((e.c + i) / icols), e.c + i, e.r + j)); } Y().keyTint(set)(lay); };
          ops.push(Object.assign(X().typeOp(ix + e.c * cw, iy + e.r * lh, w, hh, [{ spec: { field: 'flat', p: [0, 0, 0, 0], maskMode: 2, mg: 1, mgy: 0 }, set, maskFn }], inks, fs, s.seed), { post }));
        });
      });
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: 'three embeds · ' + st.load + ' · ' + st.sground }],
  });

  /* ------------------------------------------------------------ X16 redacted by policy */
  const ARTICLE = ['{', '  "meta": {', '    "title": "Rates hold as inflation cools",', '    "author": "Dana Reyes",', '    "date": "2026-11-04",', '    "site": "Example News"', '  },',
    '  "thumbnail": "example-news.com/img/rates.jpg",', '  "html": "<div class=\\"iframely-card\\">…",', '  "excerpt": "The central bank kept rates on…",', '  "entities": ["central bank", "inflation"],',
    '  "fulltext": "# Rates hold as inflation cools…",', '  "license": "© Example News"', '}'];
  const AGENTS = [
    { name: 'iframely-preview', mode: 'link card', verdict: 'allow', hide: ['excerpt', 'entities', 'fulltext'] },
    { name: 'iframely-data', mode: 'assist · reference', verdict: 'partial · excerpt 300', hide: ['html', 'fulltext'] },
    { name: 'unnamed-crawler', mode: 'ai-input', verdict: 'denied', hide: ['title', 'author', 'date', 'thumbnail', 'html', 'excerpt', 'entities', 'fulltext'] },
  ];
  /* a redaction bar in 2 px Bayer cells, exactly over the value's characters: solid in the middle and dissolving at both ends
     (fade), or a density per character (patchy); runs merged per pixel row */
  function ditherBar(ops, x, y, w, h, ink, dens, p) {
    const nx = Math.round(w / p), ny = Math.round(h / p), on = (i, j) => dens((i + .5) / nx) > T().bayer(i, j);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx;) { if (!on(i, j)) { i++; continue; } const i0 = i; while (i < nx && on(i, j)) i++; ops.push(X().rect(x + i0 * p, y + j * p, (i - i0) * p, p, ink)); }
  }
  const barDens = (style, L, cw, j, seed) => (style === 'shade' ? u => { const c = Math.floor(u * L); return .3 + .7 * T().hash(c, j, seed); } : u => Math.min(1, Math.min(u, 1 - u) * L / 1.8));
  card('dtx-redact', 'Redacted by policy', 'For the Publisher Console: one article as three agents receive it under a domain policy. The keys stay, so you can see what was asked for; the values each agent may not have are covered by redaction bars in 2 px Bayer cells, exactly the length of the hidden value, solid in the middle and dissolving at both ends (or patchy per character), in the product colour. Text stays text in the SVG; the bars are merged pixel runs. Policy and article are a mock on example-news.com.', {
    short: 'redact', init: { colour: 'magenta', pground: 'grey', rstyle: 'blocks', fs: 12 },
    opts: [OPT.colour, { key: 'pground', label: 'Ground', values: [['grey', 'Grey'], ['white', 'White'], ['black', 'Black']] }, { key: 'rstyle', label: 'Redaction', values: [['blocks', 'Fading bars'], ['shade', 'Patchy']] }, FSOPT([11, 12, 13]), OPT.page],
    items: st => [{ art: (W, s) => {
      const C = (X().COL[s.colour] || X().COL.blue)[1], dark = s.pground === 'black', G = { grey: '#f6f6f6', white: '#ffffff', black: X().BLACK }[s.pground], panel = dark ? '#16171a' : s.pground === 'white' ? '#f6f6f6' : '#ffffff', tx = dark ? '#ffffff' : INK;
      const fs = +s.fs, cw = fs * T().ADV, lh = fs * T().LH, out = 24, gap = 16, pad = 20, pw = (W - out * 2 - gap * 2) / 3, cols = Math.floor((pw - pad * 2) / cw);
      const ph = Math.ceil((ARTICLE.length + 3) * lh + pad * 2), H = ph + out * 2 + 36, ops = [X().rect(0, 0, W, H, G)], cls = ARTICLE.map(Y().classify);
      AGENTS.forEach((a, n) => {
        const x0 = Math.round(out + n * (pw + gap)), ix = x0 + pad, iy = out + pad; ops.push(X().rect(x0, out, Math.round(pw), ph, panel));
        const vc = a.verdict === 'denied' ? C : a.verdict === 'allow' ? m(panel, tx, .75) : m(panel, C, .8);
        ops.push(rowsOp(ix, iy, fs, [{ s: a.name.slice(0, cols), wt: 700, col: tx }, { s: (a.mode + ' → ' + a.verdict).slice(0, cols), wt: 500, col: vc }]));
        const keys = [], vals = [], spans = [];
        ARTICLE.forEach((line, j) => {
          const L = line.slice(0, cols), c = cls[j], kr = new Array(L.length).fill(null), vr = kr.slice(), rr = kr.slice();
          const km = /"([^"]+)":/.exec(L), hide = km && a.hide.includes(km[1]) && !/[{[]\s*$/.test(L);
          let v0 = -1, v1 = -1; if (hide) { v0 = L.indexOf(':', km.index) + 2; v1 = L.length - (L.endsWith(',') ? 1 : 0); }
          if (hide) spans.push([j, v0, v1]);
          for (let i = 0; i < L.length; i++) { if (hide && i >= v0 && i < v1) continue; if (c[i] === 'k') kr[i] = L[i]; else if (L[i] !== ' ') vr[i] = L[i]; }
          keys.push(kr); vals.push(vr);
        });
        const y = iy + lh * 3;
        ops.push(rowsOp(ix, y, fs, vals.map(chars => ({ chars, col: m(panel, tx, .55) }))));
        ops.push(rowsOp(ix, y, fs, keys.map(chars => ({ chars, wt: 600, col: tx }))));
        for (const [j, v0, v1] of spans) ditherBar(ops, Math.round(ix + v0 * cw), Math.round(y + j * lh + lh * .14), (v1 - v0) * cw, lh * .72, C, barDens(s.rstyle, v1 - v0, cw, j + n * 40, s.seed), 2);
      });
      ops.push({ k: 'text', x: out, y: H - out + 2, s: 'example-news.com/articles/2026/11/rates · one page, three agents, one policy (mock)', size: 12, wt: 400, fam: MONO, fill: m(G, tx, .5) });
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: 'three agents · ' + st.rstyle + ' · ' + st.pground }],
  });

  /* ------------------------------------------------------------ X17 a mask made of weight */
  const WSHAPE = { symbol: ['Product symbol', s => Y().SYM[s.copy], u => `800 ${Math.round(u)}px ${MONO}`], word: ['//iframely', () => '//iframely', u => `800 ${Math.round(u)}px ${MONO}`], num: ['1,900+', () => '1,900+', u => `600 ${Math.round(u)}px ${GEIST}`] };
  card('dtx-weight', 'A mask made of weight', 'The words never stop: the whole band is one stream of the API’s vocabulary, and the shape is drawn only by weight and ink, 400 in a quiet tint outside, 800 in white or the colour inside, with the Bayer order mixing 600 at the edge. No cell is empty inside or out, so the shape reads from a distance and the text from up close. Shapes: the product symbol (follows the copy switch), //iframely, or a stat.', {
    short: 'weight', init: { vocab: 'domains', mshape: 'symbol', around: 'even', fs: 10, copy: 'rich' },
    opts: [{ key: 'mshape', label: 'Shape', values: Object.entries(WSHAPE).map(([k, v]) => [k, v[0]]) }, OPT.copy, { key: 'vocab', label: 'Words', values: Object.entries(Y().VOCAB).map(([k, v]) => [k, v.label]) }, OPT.colour, OPT.ground, { key: 'around', label: 'Around', values: [['fade', 'Fades to the left'], ['even', 'Even']] }, FSOPT([10, 12, 14]), OPT.page],
    items: st => [{ art: (W, s) => {
      const sc = scheme(s), fs = +s.fs, H = Math.round(Math.max(360, Math.min(560, W * .44))), v = Y().vocabStream(s.vocab, s.seed, '·'), set = Y().streamSet(v.s, v.c, Math.ceil(W / (fs * T().ADV)), s.seed * 13);
      const [, txtOf, F] = WSHAPE[s.mshape], txt = txtOf(s), mc = ctx2d(); mc.font = F(100);
      const size = Math.min(H * .9, 100 * (s.mshape === 'symbol' ? W * .5 : W - 96) / mc.measureText(txt).width);
      const maskFn = (w, hh) => { const mk = document.createElement('canvas'); mk.width = w; mk.height = hh; const x = mk.getContext('2d'); x.filter = `blur(${Math.max(1.5, fs * .22)}px)`; x.fillStyle = '#fff'; x.font = F(size); x.textAlign = s.mshape === 'symbol' ? 'right' : 'center';
        const mt = x.measureText(txt), y = hh / 2 + (mt.actualBoundingBoxAscent - mt.actualBoundingBoxDescent) / 2; x.fillText(txt, s.mshape === 'symbol' ? w - 48 : w / 2, y); mk._v = 1; return mk; };
      const around = s.around === 'even' ? { field: 'flat', p: [.62, 0, 0, 0] } : { field: 'linear', p: [0, .02, .8, 0], q: [.25, 0, 0, 0], gain: .7 };
      const inks = sc.dark && sc.acc === '#ffffff' ? { a: m(sc.bg, '#ffffff', .2), b: '#ffffff', c: m(sc.bg, '#ffffff', .42), d: '#ffffff' } : sc.dark ? { a: m(sc.bg, '#ffffff', .15), b: sc.C, c: m(sc.bg, '#ffffff', .35), d: sc.C } : { a: m(sc.bg, INK, .13), b: sc.C, c: m(sc.bg, INK, .35), d: sc.C };
      const ops = [X().rect(0, 0, W, H, sc.bg), Object.assign(X().typeOp(0, 0, W, H, [{ spec: around, set }, { spec: { field: 'flat', p: [0, 0, 0, 0], maskMode: 2, mg: 1, mgy: 0 }, set, maskFn }], inks, fs, s.seed), s.vocab === 'mixed' ? { post: Y().keyTint(set) } : {})];
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: st.mshape + ' · ' + st.vocab + ' · ' + st.colour + ' · ' + st.ground }],
  });

  /* ------------------------------------------------------------ receipts: a thermal print in block characters
     Every picture on a receipt (the product symbol, a thumbnail, a chart, bars, a barcode, a code, the torn edge) is text:
     half blocks ▀ ▄ █ for 1-bit pictures, ▁…▇ for columns, ▏…▉ for bars, in Geist Mono or Fira Code, which carry the block
     range. Print: Pixels draws the same characters as their rectangles instead (shades as 2 px Bayer cells). */
  const isBlk = ch => { const c = ch.charCodeAt(0); return c >= 0x2580 && c <= 0x259f; };
  function blockRects(ops, x, y, cw, lh, chars, ink) {
    chars.forEach((ch, i) => {
      if (!ch || !isBlk(ch)) return; const c = ch.charCodeAt(0), x0 = x + i * cw; let r = null;
      if (c === 0x2588) r = [0, 0, 1, 1]; else if (c === 0x2580) r = [0, 0, 1, .5]; else if (c === 0x2584) r = [0, .5, 1, .5]; else if (c === 0x258c) r = [0, 0, .5, 1]; else if (c === 0x2590) r = [.5, 0, .5, 1];
      else if (c >= 0x2581 && c <= 0x2587) { const k = c - 0x2580; r = [0, 1 - k / 8, 1, k / 8]; } /* ▁…▇ lower eighths */
      else if (c >= 0x2589 && c <= 0x258f) { const k = 0x2590 - c; r = [0, 0, k / 8, 1]; } /* ▉…▏ left eighths */
      if (r) { ops.push(X().rect(x0 + r[0] * cw, y + r[1] * lh, r[2] * cw, r[3] * lh, ink)); return; }
      const dens = { 0x2591: .25, 0x2592: .5, 0x2593: .75 }[c]; if (!dens) return;
      const p = 2, nx = Math.round(cw / p), ny = Math.round(lh / p), gx = Math.round(x0 / p), gy = Math.round(y / p);
      for (let j = 0; j < ny; j++) for (let k = 0; k < nx; k++) if (dens > T().bayer(gx + k, gy + j)) ops.push(X().rect(x0 + k * p, y + j * p, p, p, ink));
    });
  }
  /* rows: { segs: [[text, tone, weight]], blk } or { gap }. Block rows in JetBrains Mono fall back to Geist Mono for that row. */
  const rowF = (r, F) => (r.blk && !F.blocks ? TFONT.geist : F);
  function printRows(ops, x, y, fs, F, rows, inks, pixel) {
    let yy = y; const cw = fs * T().ADV;
    for (const r of rows) {
      if (r.gap) { yy += fs * F.lh * r.gap; continue; }
      const RF = rowF(r, F), lh = fs * RF.lh, n = r.segs.reduce((a, sg) => a + sg[0].length, 0), groups = new Map(); let i = 0;
      for (const [s, tone, wt] of r.segs) { const key = tone + '|' + wt; if (!groups.has(key)) groups.set(key, new Array(n).fill(null)); const g = groups.get(key); for (let k = 0; k < s.length; k++) if (s[k] !== ' ') g[i + k] = s[k]; i += s.length; }
      for (const [key, chars] of groups) {
        const [tone, wt] = key.split('|'), ink = inks[tone] || inks.ink;
        if (pixel && chars.some(ch => ch && isBlk(ch))) { blockRects(ops, x, yy, cw, lh, chars, ink); const rest = chars.map(ch => (ch && !isBlk(ch) ? ch : null)); if (rest.some(Boolean)) ops.push(rowsOp(x, yy, fs, [{ chars: rest, wt: +wt, col: ink }], [], RF)); }
        else ops.push(rowsOp(x, yy, fs, [{ chars, wt: +wt, col: ink }], [], RF));
      }
      yy += lh;
    }
    return yy - y;
  }
  const rowsHeight = (rows, fs, F) => rows.reduce((a, r) => a + fs * (r.gap ? F.lh * r.gap : rowF(r, F).lh), 0);
  const seg = (s, tone, wt) => [s, tone || 'ink', wt || 400];
  const line = (s, tone, wt) => ({ segs: [seg(s, tone, wt)] });
  const ctrS = (s, cols) => ' '.repeat(Math.max(0, Math.floor((cols - s.length) / 2))) + s;
  const ctr = (s, cols, tone, wt) => line(ctrS(s.slice(0, cols), cols), tone, wt);
  const rule = (ch, cols) => line(ch.repeat(cols), 'mute');
  const lead = (k, v, cols, tone, wt) => ({ segs: [seg(k + ' ', 'ink', wt), seg('.'.repeat(Math.max(1, cols - k.length - v.length - 2)), 'mute'), seg(' ' + v, tone || 'ink', wt)] });
  const gapR = g => ({ gap: g || .6 });
  const wrapLine = (s, cols, tone, wt) => { const out = []; for (let i = 0; i < s.length; i += cols) out.push(line(s.slice(i, i + cols), tone, wt)); return out; };
  const centre = (rows, w, cols) => rows.map(r => ({ segs: [seg(' '.repeat(Math.max(0, Math.floor((cols - w) / 2))), 'ink')].concat(r.segs), blk: r.blk }));
  /* 1-bit pictures in half blocks: two pixels per cell; one pixel is .6 × .65 em, so drawings are squashed by .923 to stay square */
  const halfRows = (w, h, on, tone) => { const rows = []; for (let j = 0; j < h; j += 2) { let s = ''; for (let i = 0; i < w; i++) { const a = on(i, j), b = j + 1 < h && on(i, j + 1); s += a && b ? '█' : a ? '▀' : b ? '▄' : ' '; } rows.push({ segs: [seg(s, tone)], blk: true }); } return rows; };
  const raster = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.setTransform(1, 0, 0, .6 / .65, 0, 0); draw(x, w, h / (.6 / .65)); const d = x.getImageData(0, 0, w, h).data; return (i, j) => 1 - (d[(j * w + i) * 4] * .3 + d[(j * w + i) * 4 + 1] * .59 + d[(j * w + i) * 4 + 2] * .11) / 255; };
  const symbolArt = (sym, cols, tone) => { const h = 18, ink = raster(cols, h, (x, w, hh) => { x.fillStyle = '#000'; x.font = `800 ${Math.round(hh * .98)}px ${MONO}`; x.textAlign = 'center'; x.fillText(ZW(sym), w / 2, hh * .84); }); return halfRows(cols, h, (i, j) => ink(i, j) > .45, tone); };
  /* a link-card thumbnail, Bayer-dithered to 1 bit like a thermal printer */
  const ZW = s => s.split('').join('‌'); /* JetBrains Mono ligates <> and //; a zero-width non-joiner keeps the characters apart */
  const thumbArt = (cols, seed) => { const h = 2 * Math.round(cols * .6 / 1.91 / .65 / 2), ink = raster(cols, h, (x, w, hh) => { /* a card thumbnail: title bars and <> in solid black, a grey panel and avatar for the dither */
    x.fillStyle = '#c4c4c4'; x.fillRect(w * .58, 0, w * .42, hh); x.fillStyle = '#000'; x.fillRect(0, hh * .86, w, hh * .14);
    x.fillRect(w * .06, hh * .18, w * .4, hh * .12); x.fillRect(w * .06, hh * .38, w * .28, hh * .12); x.fillStyle = '#9a9a9a'; x.beginPath(); x.arc(w * .12, hh * .68, hh * .09, 0, 7); x.fill();
    x.fillStyle = '#000'; x.font = `800 ${Math.round(hh * .62)}px ${MONO}`; x.textAlign = 'center'; x.fillText(ZW('<>'), w * .79, hh * .63); });
    return halfRows(cols, h, (i, j) => ink(i, j) > T().bayer(i + 2, j + seed), 'ink'); };
  /* a code-like square (finder corners, timing line, hashed modules); decorative, not a real QR code */
  const qrArt = seed => { const N = 21, on = (x, y) => {
    for (const [cx, cy] of [[0, 0], [N - 7, 0], [0, N - 7]]) { const dx = x - cx, dy = y - cy; if (dx >= -1 && dy >= -1 && dx <= 7 && dy <= 7) { if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false; const d = Math.max(Math.abs(dx - 3), Math.abs(dy - 3)); return d === 3 || d <= 1; } }
    if (x === 6 || y === 6) return (x + y) % 2 === 0; return T().hash(x, y, seed) < .48; };
    return { rows: halfRows(N, N + 1, (x, y) => y < N && on(x, y), 'ink'), w: N }; };
  const barcode = (str, cols, n) => { let s = ''; for (let i = 0; s.length < cols - 2; i++) { const c = str.charCodeAt(i % str.length); s += '▌█▐▍▊▎'[c % 6]; if ((c >> 3) & 1) s += ' '; } s = ctrS(s.slice(0, cols - 2), cols); return Array.from({ length: n }, () => ({ segs: [seg(s, 'ink')], blk: true })); };
  const chart = (vals, n, cols, tone) => { const off = ' '.repeat(Math.max(0, Math.floor((cols - vals.length) / 2))); return Array.from({ length: n }, (_, r) => ({ segs: [seg(off + vals.map(v => { const e = Math.round(v * n * 8) - (n - 1 - r) * 8; return e >= 8 ? '█' : e <= 0 ? ' ' : String.fromCharCode(0x2580 + e); }).join(''), tone)], blk: true })); };
  const hbar = (v, mx, w) => { const e = Math.round(v / mx * w * 8); return '█'.repeat(Math.floor(e / 8)) + (e % 8 ? String.fromCharCode(0x2590 - (e % 8)) : ''); };
  /* the torn foot, in the paper's colour on the ground below it */
  const tear = (cols, seed) => [0, 1].map(r => { let s = ''; for (let i = 0; i < cols; i++) { const hh = T().hash(i, r + 70, seed); s += r === 0 ? (hh < .55 ? '█' : '▀') : (hh < .3 ? '▀' : ' '); } return { segs: [seg(s, 'paper')], blk: true }; });

  const RCPT = {
    data: { label: 'Data API read', copy: 'data', prod: 'data', resp: 'data', build: (cols, seed) => { const q = qrArt(seed); return [
      ...symbolArt('{:}', cols, 'acc'), gapR(.4), ctr('IFRAMELY · DATA API', cols, 'ink', 800), ctr('READ RECEIPT  #4F2A-91C', cols, 'ink', 500), rule('=', cols),
      ...wrapLine('GET en.wikipedia.org/wiki/Bonobo_(musician)', cols, 'ink', 600), line('2026-11-05 14:32:07 UTC', 'mute'), rule('-', cols),
      lead('agent', 'iframely-data/1.0', cols), lead('mode', 'assist', cols), lead('use', 'reference', cols), rule('-', cols),
      line('SIGNALS', 'ink', 700), lead('robots.txt', '200', cols), lead('license', 'CC BY-SA 4.0', cols), lead('publisher policy', 'none', cols), rule('-', cols),
      line('RECEIVED', 'ink', 700), lead('metadata', '✓', cols), lead('entities', '✓', cols), lead('excerpt', '✓', cols), lead('fulltext', '✓ by license', cols, 'acc', 700), rule('=', cols),
      lead('TOTAL', '1 hit · 164 ms', cols, 'ink', 800), gapR(), ...centre(q.rows, q.w, cols), gapR(.4), ctr('iframe.ly/r/4F2A91C', cols, 'mute'), gapR(), ctr('THANK YOU FOR ASKING FIRST', cols, 'acc', 700)]; } },
    policy: { label: 'Console policy test', copy: 'pub', prod: 'pub', resp: 'policy', build: cols => [
      ...symbolArt(':/', cols, 'acc'), gapR(.4), ctr('IFRAMELY · PUBLISHER CONSOLE', cols, 'ink', 800), ctr('POLICY TEST  /articles/*', cols, 'ink', 500), rule('=', cols),
      ...wrapLine('GET example-news.com/articles/2026/11/rates', cols, 'ink', 600), line('2026-11-05 14:32:07 UTC', 'mute'), rule('-', cols),
      lead('domain', 'verified · DNS', cols), lead('since', '2026-09-14', cols), rule('-', cols),
      line('RESULT', 'ink', 700), lead('preview card', '✓', cols), lead('excerpt', '✓ 300 ch', cols), lead('fulltext', '✕ withheld', cols, 'acc', 700), lead('ai-input', '✕ denied', cols, 'acc', 700), rule('=', cols),
      lead('RULES', '3 · 38 ms', cols, 'ink', 800), gapR(), ...barcode('example-news.com/articles/*', cols, 2), gapR(.4), ctr('YOUR CONTENT, YOUR RULES', cols, 'acc', 700)] },
    preview: { label: 'Preview unfurl', copy: 'preview', prod: 'preview', resp: 'card', build: (cols, seed) => { const R = Y().RESP.card; return [
      ...symbolArt('<>', cols, 'acc'), gapR(.4), ctr('IFRAMELY · PREVIEW API', cols, 'ink', 800), ctr('UNFURL  #77B0-3D1', cols, 'ink', 500), rule('=', cols),
      ...wrapLine('GET ' + R.u, cols, 'ink', 600), rule('-', cols), ...thumbArt(cols, seed), gapR(.5),
      ...wrapChars(R.title, cols, 2).map(l => line(l, 'ink', 700)), ...wrapChars(R.desc, cols, 3).map(l => line(l, 'mute')), line('// ' + R.site, 'acc', 600), rule('-', cols),
      lead('card', 'small', cols), lead('thumbnail', '1200 × 600', cols), lead('rel', 'summary · card', cols), rule('=', cols),
      lead('TOTAL', '1 hit · ' + R.ms + ' ms', cols, 'ink', 800), gapR(), ...barcode(R.u, cols, 2), gapR(.4), ctr('EVERY LINK, UNFURLED', cols, 'acc', 700)]; } },
    usage: { label: 'Rich Media statement', copy: 'rich', prod: 'rich', resp: 'video', build: (cols, seed) => { const days = Array.from({ length: Math.min(31, cols) }, (_, d) => Math.min(1, (d % 7 === 5 || d % 7 === 6 ? .36 : .62) + .26 * T().hash(d, 3, seed) + d * .005)); return [
      ...symbolArt('//', cols, 'acc'), gapR(.4), ctr('IFRAMELY · RICH MEDIA', cols, 'ink', 800), ctr('STATEMENT · OCTOBER 2026', cols, 'ink', 500), rule('=', cols),
      line('EMBEDS PER DAY', 'ink', 700), gapR(.3), ...chart(days, 5, cols, 'acc'), ctr('01' + ' '.repeat(days.length - 4) + '31', cols, 'mute'), rule('-', cols),
      lead('youtube.com', '31%', cols), lead('figma.com', '12%', cols), lead('x.com', '9%', cols), lead('providers', '312', cols), rule('-', cols),
      lead('plan', '50,000 hits', cols), lead('used', '96%', cols, 'acc', 700), rule('=', cols),
      lead('TOTAL', '48,210 hits', cols, 'ink', 800), gapR(), ...barcode('iframely.com/statement/2026-10', cols, 2), gapR(.4), ctr('PERFECT EMBEDS, EVERY TIME', cols, 'acc', 700)]; } },
    agents: { label: 'Console agents report', copy: 'pub', prod: 'pub', resp: 'policy', build: cols => { const A = [['iframely-preview', 12840, 'allow'], ['unnamed-crawler', 5120, 'denied'], ['iframely-data', 2310, 'assist'], ['feedfetcher', 940, 'allow']], bw = cols - 8;
      const rows = [...symbolArt(':/', cols, 'acc'), gapR(.4), ctr('IFRAMELY · PUBLISHER CONSOLE', cols, 'ink', 800), ctr('AGENTS · WEEK 45', cols, 'ink', 500), rule('=', cols), line('example-news.com', 'ink', 600), line('2026-11-02 → 2026-11-08', 'mute'), rule('-', cols)];
      A.forEach(([n, v, verdict]) => { const deny = verdict === 'denied'; rows.push({ segs: [seg(n, 'ink', 600), seg(' '.repeat(Math.max(1, cols - n.length - verdict.length)) + verdict, deny ? 'acc' : 'mute', deny ? 700 : 400)] }, { segs: [seg(hbar(v, A[0][1], bw), deny ? 'acc' : 'ink'), seg(' ' + v.toLocaleString('en-US'), 'mute')], blk: true }); });
      rows.push(rule('=', cols), lead('fetches', '21,210', cols, 'ink', 800), lead('denied', '5,120', cols, 'acc', 700), gapR(), ...barcode('example-news.com', cols, 2), gapR(.4), ctr('YOUR CONTENT, YOUR RULES', cols, 'acc', 700)); return rows; } },
  };
  const PRINT = { key: 'print', label: 'Print', values: [['text', 'Text'], ['pixel', 'Pixels']] };
  const FACE = { key: 'tfont', label: 'Face', values: Object.entries(TFONT).map(([k, v]) => [k, v.label]) };
  const pinks = (paper, C) => ({ ink: INK, mute: m(paper, INK, .5), acc: C, paper });
  const PCOLS = () => Object.fromEntries(DEMOS.ditherKit.PROD.map(p => [p.k, p.c]));

  /* ------------------------------------------------------------ X18 the access receipt */
  card('dtx-receipt', 'The access receipt', 'A read printed as a receipt that hangs out of the section: dot leaders for agent, mode and use, the signals checked and what was received. Round 2: everything on the paper is text. The product symbol on top, a link-card thumbnail, a month of embeds as a column chart, agents as bars, a barcode, a code square and the torn foot are block characters (▀ ▄ █, ▁…▇, ▏…▉) in Geist Mono or Fira Code, so the SVG is plain text. Print: Pixels draws the same characters as rectangles. Five receipts, one per product story; data is a mock.', {
    short: 'receipt', init: { colour: 'orchid', ground: 'colour', rcpt: 'data', print: 'text', tfont: 'geist' },
    opts: [{ key: 'rcpt', label: 'Receipt', values: Object.entries(RCPT).map(([k, v]) => [k, v.label]) }, PRINT, FACE, OPT.colour, OPT.ground, OPT.head, OPT.page],
    items: st => {
      const P = RCPT[st.rcpt], F = TFONT[st.tfont], fs = 13, pad = 20, est = rowsHeight(P.build(Math.floor((400 - pad * 2) / (fs * T().ADV)), st.seed), fs, F) + pad * 2;
      return [{ copy: COPY[P.copy], scheme: scheme(st), label: st.rcpt + ' receipt · ' + st.print + ' · ' + st.tfont + ' · ' + st.colour, extra: est - 40, comp: (W, H, s, ctx) => {
        const sc = scheme(s), cw = fs * T().ADV, paper = '#ffffff', ops = [X().rect(0, 0, W, H, sc.bg)], hang = 56, pixel = s.print === 'pixel';
        const narrow = W < 820, pcols = Math.floor((narrow ? W - 56 : Math.min(400, W / 2 - 80)) / cw), pw = pcols * cw, px = narrow ? 28 : Math.round(W / 2 + 24), cols = Math.floor((pw - pad * 2) / cw);
        const rows = P.build(cols, s.seed), rh = Math.ceil(rowsHeight(rows, fs, F) + pad * 2), py = Math.round(H + hang - rh), R = Y().RESP[P.resp];
        ops.push(Y().jsonOp(0, 0, W, H, { field: 'radial', p: [narrow ? .5 : .78, .1, .8, 1.1], q: [.35, 0, 0, 0], gain: .55 }, Y().textSet(R.lines, Y().tileMap(R.lines, 0, 2)), sc, 11, s.seed));
        const inks = pinks(paper, sc.C);
        ops.push(X().rect(px, py, pw, rh, paper)); printRows(ops, px + pad, py + pad, fs, F, rows, inks, pixel);
        const th = printRows(ops, px, py + rh, fs, F, tear(pcols, s.seed), inks, pixel);
        if (ctx.head) ops.push(ctx.head); return { ops, below: Math.ceil(hang + th) };
      } }];
    },
  });

  /* ------------------------------------------------------------ X19 redacted in block characters */
  const blockRedact = (style, L, j, seed) => Array.from({ length: L }, (_, i) => {
    const d = Math.min(i, L - 1 - i), t = L > 1 ? i / (L - 1) : 0, hh = T().hash(i, j, seed);
    if (style === 'bar') return d === 0 ? '░' : d === 1 ? '▒' : d === 2 ? '▓' : '█';
    if (style === 'fade') return ' ░▒▓█'[Math.max(0, Math.min(4, Math.floor((1 - t * .9) * 4 + hh * .9)))];
    if (style === 'tape') return '▄';
    return '░▒▓█'[Math.min(3, Math.floor(hh * 4))];
  }).join('');
  card('dtx-redact-blocks', 'Redacted in block characters', 'X16 as pure text: the withheld values are covered with block characters set in Geist Mono or Fira Code (both carry the block range), at the face’s own block height, so redactions on consecutive lines join into one solid shape. Styles: a bar that softens at both ends ░▒▓██▓▒░, a fade from solid to nothing, a mosaic, or a low tape ▄▄▄. Every mark is a character, so the SVG and a copy-paste keep it.', {
    short: 'redact-blocks', init: { colour: 'magenta', pground: 'grey', bstyle: 'bar', tfont: 'geist', fs: 12 },
    opts: [OPT.colour, { key: 'pground', label: 'Ground', values: [['grey', 'Grey'], ['white', 'White'], ['black', 'Black']] }, { key: 'bstyle', label: 'Redaction', values: [['bar', '░▒▓██▓▒░'], ['fade', '██▓▒░ fade'], ['mosaic', '▓░█▒ mosaic'], ['tape', '▄▄▄ tape']] }, { key: 'tfont', label: 'Face', values: [['geist', 'Geist Mono'], ['fira', 'Fira Code']] }, FSOPT([11, 12, 13]), OPT.page],
    items: st => [{ art: (W, s) => {
      const C = (X().COL[s.colour] || X().COL.blue)[1], dark = s.pground === 'black', G = { grey: '#f6f6f6', white: '#ffffff', black: X().BLACK }[s.pground], panel = dark ? '#16171a' : s.pground === 'white' ? '#f6f6f6' : '#ffffff', tx = dark ? '#ffffff' : INK;
      const F = TFONT[s.tfont], fs = +s.fs, cw = fs * T().ADV, out = 24, gap = 16, pad = 20, pw = (W - out * 2 - gap * 2) / 3, cols = Math.floor((pw - pad * 2) / cw), cls = ARTICLE.map(Y().classify);
      const inks = { ink: tx, mute: m(panel, tx, .55), acc: C };
      const panels = AGENTS.map((a, n) => {
        const rows = [line(a.name.slice(0, cols), 'ink', 700), line((a.mode + ' → ' + a.verdict).slice(0, cols), a.verdict === 'denied' ? 'acc' : 'mute', 500), gapR(1)];
        ARTICLE.forEach((ln, j) => {
          const L = ln.slice(0, cols), c = cls[j], km = /"([^"]+)":/.exec(L), hide = !!(km && a.hide.includes(km[1]) && !/[{[]\s*$/.test(L));
          const v0 = hide ? L.indexOf(':', km.index) + 2 : -1, v1 = hide ? L.length - (L.endsWith(',') ? 1 : 0) : -1, red = hide ? blockRedact(s.bstyle, v1 - v0, j + n * 40, s.seed) : '', segs = []; let cur = null;
          for (let i = 0; i < L.length; i++) { const r = hide && i >= v0 && i < v1, tone = r ? 'acc' : c[i] === 'k' ? 'ink' : 'mute', wt = !r && c[i] === 'k' ? 600 : 400, ch = r ? red[i - v0] : L[i];
            if (cur && cur[1] === tone && cur[2] === wt) cur[0] += ch; else { cur = [ch, tone, wt]; segs.push(cur); } }
          rows.push({ segs, blk: hide });
        });
        return rows;
      });
      const ph = Math.ceil(Math.max(...panels.map(r => rowsHeight(r, fs, F))) + pad * 2), H = ph + out * 2 + 36, ops = [X().rect(0, 0, W, H, G)];
      panels.forEach((rows, n) => { const x0 = Math.round(out + n * (pw + gap)); ops.push(X().rect(x0, out, Math.round(pw), ph, panel)); printRows(ops, x0 + pad, out + pad, fs, F, rows, inks, false); });
      ops.push({ k: 'text', x: out, y: H - out + 2, s: 'example-news.com/articles/2026/11/rates · one page, three agents, one policy (mock)', size: 12, wt: 400, fam: MONO, fill: m(G, tx, .5) });
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: 'three agents · ' + st.bstyle + ' · ' + st.tfont }],
  });

  /* ------------------------------------------------------------ X20 four receipts on a rail */
  card('dtx-receipts', 'Four receipts on a rail', 'The receipt as a system: one per product, clipped to a rail like order tickets, each in its product colour. Rich Media prints its month of embeds as a column chart, Preview API the link card it unfurled (a Bayer-dithered thumbnail in half blocks), Data API what it was allowed to read, Publisher Console which agents came and which were refused. All text in Geist Mono or Fira Code; Pixels draws the blocks as rectangles. Mock data.', {
    short: 'receipts', init: { print: 'text', tfont: 'geist', rground: 'grey', rcol: 'product' },
    opts: [PRINT, FACE, { key: 'rground', label: 'Ground', values: [['grey', 'Grey'], ['white', 'White'], ['black', 'Black'], ['blue', 'Blue']] }, { key: 'rcol', label: 'Accent', values: [['product', 'Product colours'], ['blue', 'All blue']] }, OPT.page],
    items: st => [{ art: (W, s) => {
      const F = TFONT[s.tfont], fs = 10, cw = fs * T().ADV, out = 28, gap = 20, pad = 14, G = { grey: '#f6f6f6', white: '#ffffff', black: X().BLACK, blue: X().BLUE }[s.rground], dark = s.rground === 'black' || s.rground === 'blue';
      const paper = s.rground === 'white' ? '#f3f1ea' : '#ffffff', pcols = Math.floor((W - out * 2 - gap * 3) / 4 / cw), pw = pcols * cw, cols = Math.floor((pw - pad * 2) / cw), PC = PCOLS();
      const list = ['usage', 'preview', 'data', 'agents'].map(k => { const rows = RCPT[k].build(cols, s.seed); return { k, rows, h: Math.ceil(rowsHeight(rows, fs, F) + pad * 2) }; });
      const railY = 26, top = railY + 10, H = Math.ceil(top + Math.max(...list.map(r => r.h)) + fs * 2.6 + 30), rail = s.rground === 'blue' ? '#ffffff' : dark ? '#3a3b3f' : INK;
      const ops = [X().rect(0, 0, W, H, G), X().rect(0, railY, W, 10, rail)], pixel = s.print === 'pixel';
      list.forEach((r, n) => {
        const px = Math.round(out + n * (pw + gap)), inks = pinks(paper, s.rcol === 'blue' ? X().BLUE : PC[RCPT[r.k].prod]);
        ops.push(X().rect(px, top, pw, r.h, paper)); printRows(ops, px + pad, top + pad, fs, F, r.rows, inks, pixel); printRows(ops, px, top + r.h, fs, F, tear(pcols, s.seed + n), inks, pixel);
        ops.push(X().rect(Math.round(px + pw / 2 - 20), railY - 5, 40, 22, s.rground === 'blue' ? '#c9d8ff' : dark ? '#6b6c70' : '#2a2b2f'));
      });
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: 'four receipts · ' + st.print + ' · ' + st.tfont + ' · ' + st.rground }],
  });

  /* ------------------------------------------------------------ X21 receipts in the prototype's style
     website palette (src/routes/layout.css): page #fafafa, text #111 / #333 / #666 / #777, rules #f2f2f2 (#ccc
     for type rules), blue #0055ff and one colour per product; mono = Geist Mono. No pictures: the //iframely logo in type,
     ░▒▓██▓▒░ dividers, a sparkline and a heat strip, shade-ended bars, a progress gauge, a box-drawn link card, inverted
     chips, a barcode and the code square. */
  const THEME = {
    light: { ground: '#fafafa', paper: '#ffffff', rail: '#111111', clip: '#333333', ink: '#111111', body: '#333333', mute: '#777777', rule: '#cccccc' },
    black: { ground: '#000000', paper: '#111111', rail: '#2a2a2a', clip: '#3d3d3d', ink: '#ffffff', body: '#d6d6d6', mute: '#8a8a8a', rule: '#3a3a3a' },
  };
  /* rows may scale (k, centred in `width`) or carry overlays (over: [[col, text, tone, wt]], e.g. text knocked out of a chip) */
  function printRows2(ops, x, y, fs, F, rows, inks, pixel, width) {
    let yy = y;
    for (const r of rows) {
      if (r.k) { const n = r.segs.reduce((a, sg) => a + sg[0].length, 0), f2 = fs * r.k; yy += printRows(ops, x + Math.round((width - n * f2 * T().ADV) / 2), yy, f2, F, [{ segs: r.segs }], inks, pixel); continue; }
      const h0 = printRows(ops, x, yy, fs, F, [r], inks, pixel);
      for (const [col, s, tone, wt] of r.over || []) ops.push(rowsOp(x + col * fs * T().ADV, yy, fs, [{ s, wt: wt || 700, col: inks[tone] }], [], rowF(r, F)));
      yy += h0;
    }
    return yy - y;
  }
  const rowsHeight2 = (rows, fs, F) => rows.reduce((a, r) => a + (r.k ? fs * r.k * F.lh : r.gap ? fs * F.lh * r.gap : fs * rowF(r, F).lh), 0);
  const logo = () => ({ segs: [seg('//', 'acc', 800), seg('iframely', 'ink', 700)], k: 1.7 });
  const shadeRule = (cols, tone) => ({ segs: [seg('░▒▓' + '█'.repeat(Math.max(0, cols - 6)) + '▓▒░', tone)], blk: true });
  const shadeMark = (cols, tone) => ({ segs: [seg(ctrS('░▒▓██▓▒░', cols), tone)], blk: true });
  const hair = (cols, ch) => ({ segs: [seg((ch || '─').repeat(cols), 'rule')], blk: true });
  const lead2 = (k, v, cols, tone, wt) => ({ segs: [seg(k + ' ', 'body', wt), seg('.'.repeat(Math.max(1, cols - k.length - v.length - 2)), 'rule'), seg(' ' + v, tone || 'ink', wt || 500)] });
  const head2 = (cols, a, b) => [logo(), gapR(.3), ctr(a, cols, 'ink', 600), ctr(b, cols, 'mute'), gapR(.5), shadeRule(cols, 'acc'), gapR(.4)];
  const foot2 = (cols, code, slogan) => [gapR(.5), ...barcode(code, cols, 2).map(r => ({ segs: r.segs.map(sg => [sg[0], 'ink', 400]), blk: true })), gapR(.4), ctr(slogan, cols, 'acc', 700), gapR(.3), shadeMark(cols, 'acc')];
  const chip = (cols, left, label, tone) => { const w = label.length + 2, c0 = cols - w; return { segs: [seg(left, 'ink', 600), seg(' '.repeat(Math.max(1, c0 - left.length))), seg('█'.repeat(w), tone)], blk: true, over: [[c0 + 1, label, 'paper', 700]] }; };
  const fadeBar = (v, mx, w) => { const n = Math.max(1, Math.round(v / mx * w)); return n <= 3 ? '▓▒░'.slice(3 - n) : '█'.repeat(n - 3) + '▓▒░'; };
  const spark = v => '▁▂▃▄▅▆▇█'[Math.min(7, Math.floor(v * 8))], heat = v => ' ░▒▓█'[Math.min(4, Math.floor(v * 5))];
  /* a 16:9 video player in characters: box frame, a ░▒▓ vignette in the accent, a half-block play triangle, a ━ progress
     line with its head, and a control row. 6 rows × (cols − 2) cells ≈ 16:9 for a .6 × 1.3 em cell. */
  const player = (cols, title) => {
    const iw = cols - 2, vr = 6, cx = Math.floor(iw / 2) - 2, cy = vr, tri = (x, y) => { const dx = x - cx, dy = Math.abs(y + .5 - cy); return dx >= 0 && dx <= 5 && dy <= (5 - dx) * .62 + .4; };
    const frame = (l, r) => ({ segs: [seg(l + '─'.repeat(iw) + r, 'rule')], blk: true }), side = segs => ({ segs: [seg('│', 'rule'), ...segs, seg('│', 'rule')], blk: true });
    const rows = [frame('┌', '┐')];
    for (let r = 0; r < vr; r++) {
      const segs = []; for (let i = 0; i < iw; i++) {
        const a = tri(i, r * 2), b = tri(i, r * 2 + 1); if (a || b) { segs.push(seg(a && b ? '█' : a ? '▀' : '▄', 'ink')); continue; }
        const d = Math.hypot((i + .5 - iw / 2) / (iw / 2), (r + .5 - vr / 2) / (vr / 2)); segs.push(seg(d > 1.12 ? '▓' : d > .86 ? '▒' : d > .58 ? '░' : ' ', 'acc'));
      }
      if (r === 0) { const t = (' ' + title).slice(0, iw - 2); t.split('').forEach((ch, k) => (segs[k] = seg(ch, 'ink', 600))); } /* the title over the top of the frame, as YouTube shows it */
      rows.push(side(segs));
    }
    const p = Math.round(iw * .34); rows.push(side([seg('━'.repeat(p - 1), 'acc'), seg('█', 'acc'), seg('─'.repeat(iw - p), 'rule')]));
    const left = ' ▌▌ 1:12 / 3:34', right = 'CC  HD  [ ] '; /* only characters Geist Mono has (▶ ⛶ fall back to wider glyphs and push the frame) */ rows.push(side([seg(left, 'ink', 600), seg(' '.repeat(Math.max(1, iw - left.length - right.length))), seg(right, 'mute')]));
    rows.push(frame('└', '┘'));
    return rows;
  };
  const RCPT2 = {
    embed: { prod: 'rich', build: cols => {
      const R = Y().RESP.video;
      return [...head2(cols, 'RICH MEDIA', 'EMBED · #9D41-0C7'),
        ...wrapLine('GET ' + R.u, cols, 'ink', 500), gapR(.4),
        ...player(cols, 'Never Gonna Give You Up'), gapR(.4),
        ...wrapChars(R.title, cols, 2).map(l => line(l, 'ink', 700)), line(R.desc, 'mute'), line('// youtube.com', 'acc', 600), hair(cols),
        lead2('type', 'player', cols), lead2('rel', 'player · html5 · ssl', cols), lead2('aspect', '16:9 · 1.778', cols), lead2('duration', '3:34', cols),
        lead2('provider', 'YouTube', cols), lead2('iframe', 'iframe.ly/api/iframe', cols), lead2('autoplay', 'off', cols), lead2('cache', 'hit', cols), hair(cols),
        lead2('TOTAL', '1 hit · ' + R.ms + ' ms', cols, 'ink', 700), ...foot2(cols, R.u, 'PERFECT EMBEDS, EVERY TIME')];
    } },
    usage: { prod: 'rich', build: (cols, seed) => {
      const days = Array.from({ length: Math.min(31, cols) }, (_, d) => Math.min(.99, (d % 7 === 5 || d % 7 === 6 ? .3 : .58) + .3 * T().hash(d, 3, seed) + d * .005)), off = ' '.repeat(Math.floor((cols - days.length) / 2)), gw = cols - 6, used = .96, fill = Math.round(used * gw);
      return [...head2(cols, 'RICH MEDIA', 'STATEMENT · OCTOBER 2026'),
        line('EMBEDS PER DAY', 'ink', 600), { segs: [seg(off + days.map(spark).join(''), 'acc')], blk: true }, { segs: [seg(off + days.map(heat).join(''), 'acc')], blk: true }, line(off + '01' + ' '.repeat(days.length - 4) + '31', 'mute'), gapR(.4), hair(cols),
        lead2('youtube.com', '31%', cols), lead2('figma.com', '12%', cols), lead2('x.com', '9%', cols), lead2('providers', '312', cols), hair(cols),
        line('PLAN 50,000 HITS', 'ink', 600), { segs: [seg('█'.repeat(Math.max(0, fill - 3)) + '▓▒░', 'acc'), seg('░'.repeat(Math.max(0, gw - fill)), 'rule'), seg(' 96%', 'ink', 700)], blk: true }, hair(cols),
        lead2('TOTAL', '48,210 hits', cols, 'ink', 700), ...foot2(cols, 'iframely.com/statement/2026-10', 'PERFECT EMBEDS, EVERY TIME')]; } },
    preview: { prod: 'preview', build: cols => {
      const R = Y().RESP.card, iw = cols - 4, box = (segs) => ({ segs: [seg('│ ', 'rule')].concat(segs, [seg(' '.repeat(Math.max(0, iw - segs.reduce((a, sg) => a + sg[0].length, 0))) + ' │', 'rule')]), blk: true }), t = s => s.slice(0, iw - 7);
      return [...head2(cols, 'PREVIEW API', 'UNFURL · #77B0-3D1'),
        ...wrapLine('GET ' + R.u, cols, 'ink', 500), gapR(.4),
        { segs: [seg('┌' + '─'.repeat(cols - 2) + '┐', 'rule')], blk: true },
        box([seg('▓▓▓▓▓', 'acc'), seg('  ' + t('itteco/iframely'), 'ink', 700)]), box([seg('▓▓▓▓▓', 'acc'), seg('  ' + t('The URL engine'), 'body')]), box([seg('▒▒▒▒▒', 'acc'), seg('  ' + t('behind Iframely.'), 'body')]), box([seg('░░░░░', 'acc'), seg('  ' + t('// github.com'), 'acc', 600)]),
        { segs: [seg('└' + '─'.repeat(cols - 2) + '┘', 'rule')], blk: true }, gapR(.4),
        lead2('card', 'small', cols), lead2('thumbnail', '1200 × 600', cols), lead2('rel', 'summary · card', cols), lead2('cache', 'hit', cols), hair(cols),
        lead2('TOTAL', '1 hit · ' + R.ms + ' ms', cols, 'ink', 700), ...foot2(cols, R.u, 'EVERY LINK, UNFURLED')]; } },
    data: { prod: 'data', build: (cols, seed) => { const q = qrArt(seed); return [...head2(cols, 'DATA API', 'READ RECEIPT · #4F2A-91C'),
        ...wrapLine('GET en.wikipedia.org/wiki/Bonobo_(musician)', cols, 'ink', 500), line('2026-11-05 14:32 UTC', 'mute'), gapR(.4), hair(cols),
        lead2('agent', 'iframely-data/1.0', cols), lead2('mode', 'assist', cols), lead2('use', 'reference', cols), hair(cols),
        line('SIGNALS', 'ink', 600), lead2('robots.txt', '200', cols), lead2('license', 'CC BY-SA 4.0', cols), lead2('policy', 'none', cols), hair(cols),
        line('RECEIVED', 'ink', 600), lead2('metadata', '✓', cols), lead2('excerpt', '✓', cols), chip(cols, 'fulltext', 'BY LICENSE', 'acc'), hair(cols),
        lead2('TOTAL', '1 hit · 164 ms', cols, 'ink', 700), gapR(.6), ...centre(q.rows.map(r => ({ segs: r.segs.map(sg => [sg[0], 'ink', 400]), blk: true })), q.w, cols), gapR(.3), ctr('iframe.ly/r/4F2A91C', cols, 'mute'), gapR(.4), ctr('THANK YOU FOR ASKING FIRST', cols, 'acc', 700), gapR(.3), shadeMark(cols, 'acc')]; } },
    agents: { prod: 'pub', build: cols => { const A = [['iframely-preview', 12840, 'allow'], ['unnamed-crawler', 5120, 'denied'], ['iframely-data', 2310, 'assist'], ['feedfetcher', 940, 'allow']], bw = cols - 8;
      const rows = [...head2(cols, 'PUBLISHER CONSOLE', 'AGENTS · WEEK 45'), line('example-news.com', 'ink', 500), line('2026-11-02 → 11-08', 'mute'), gapR(.4), hair(cols)];
      A.forEach(([n, v, verdict]) => { const deny = verdict === 'denied'; rows.push(deny ? chip(cols, n, 'DENIED', 'acc') : { segs: [seg(n, 'ink', 600), seg(' '.repeat(Math.max(1, cols - n.length - verdict.length)) + verdict, 'mute')] }, { segs: [seg(fadeBar(v, A[0][1], bw), deny ? 'acc' : 'ink'), seg(' ' + v.toLocaleString('en-US'), 'mute')], blk: true }, gapR(.25)); });
      rows.push(hair(cols), lead2('fetches', '21,210', cols, 'ink', 700), lead2('refused', '5,120', cols, 'acc', 700), ...foot2(cols, 'example-news.com', 'YOUR CONTENT, YOUR RULES')); return rows; } },
  };
  card('dtx-receipts2', 'Receipts in the prototype’s style', 'X20 taken into the website prototype: its palette (page #fafafa, text #111 / #333 / #777, blue #0055ff, one colour per product), Geist Mono, and no pictures. Each receipt opens with //iframely in type and a ░▒▓██▓▒░ rule in the product colour; the drawings are pseudographics: a sparkline and a ░▒▓█ heat strip of embeds per day, a quota gauge, bars that end in ▓▒░, a link card drawn in box characters, inverted chips (DENIED, BY LICENSE), a barcode and the code square. Light or all-black; accents per product, all blue, or none.', {
    short: 'receipts2', init: { theme: 'light', acc2: 'product', print: 'text', tfont: 'geist' },
    opts: [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] }, { key: 'acc2', label: 'Accent', values: [['product', 'Product colours'], ['blue', 'All blue'], ['none', 'None']] }, PRINT, FACE, OPT.page],
    items: st => [{ art: (W, s) => {
      const TH = THEME[s.theme], F = TFONT[s.tfont], fs = 10, cw = fs * T().ADV, out = 28, gap = 20, pad = 16, PC = PCOLS();
      const pcols = Math.floor((W - out * 2 - gap * 3) / 4 / cw), pw = pcols * cw, cols = Math.floor((pw - pad * 2) / cw);
      const list = ['usage', 'preview', 'data', 'agents'].map(k => { const rows = RCPT2[k].build(cols, s.seed); return { k, rows, h: Math.ceil(rowsHeight2(rows, fs, F) + pad * 2) }; });
      const railY = 26, top = railY + 10, H = Math.ceil(top + Math.max(...list.map(r => r.h)) + fs * 2.6 + 30), pixel = s.print === 'pixel';
      const ops = [X().rect(0, 0, W, H, TH.ground), X().rect(0, railY, W, 10, TH.rail)];
      list.forEach((r, n) => {
        const px = Math.round(out + n * (pw + gap)), acc = s.acc2 === 'none' ? TH.ink : s.acc2 === 'blue' ? X().BLUE : PC[RCPT2[r.k].prod];
        const inks = { ink: TH.ink, body: TH.body, mute: TH.mute, rule: TH.rule, acc, paper: TH.paper };
        ops.push(X().rect(px, top, pw, r.h, TH.paper)); printRows2(ops, px + pad, top + pad, fs, F, r.rows, inks, pixel, cols * cw); printRows(ops, px, top + r.h, fs, F, tear(pcols, s.seed + n), inks, pixel);
        ops.push(X().rect(Math.round(px + pw / 2 - 20), railY - 5, 40, 22, TH.clip));
      });
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: 'four receipts · ' + st.theme + ' · ' + st.acc2 + ' · ' + st.print }],
  });

  /* ------------------------------------------------------------ X22 the same receipts as plain text
     The X21 rows rendered as live HTML (<pre>-style lines of spans in Geist Mono or Fira Code at the face's block height),
     so the receipts are selectable, copyable text; chips are spans with a background. Copy text / .txt give the same
     characters without colour. */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function rowCells(r) { /* per character { ch, tone, wt, bg }; overlays turn the block run under them into a background */
    const c = []; for (const [s, tone, wt, bg] of r.segs) for (const ch of s) c.push({ ch, tone, wt, bg }); /* a seg may carry a background tone (chips) */
    for (const [col, s, tone, wt] of r.over || []) {
      let a = col, b = col; while (a > 0 && c[a - 1].ch === '█') a--; while (b < c.length && c[b].ch === '█') b++;
      const bg = c[col] ? c[col].tone : 'acc'; for (let i = a; i < b; i++) c[i] = { ch: ' ', tone, wt, bg }; [...s].forEach((ch, k) => { if (c[col + k]) c[col + k] = { ch, tone, wt: wt || 700, bg }; });
    }
    return c;
  }
  function receiptText(rows, cols, inks) { /* → { html, text } */
    let html = '', text = '';
    for (const r of rows) {
      if (r.gap) { if (r.gap >= .5) { html += '<div class="rl"> </div>'; text += '\n'; } else html += `<div style="height:${(r.gap * 1.3).toFixed(2)}em"></div>`; continue; }
      const c = rowCells(r), plain = c.map(x => x.ch).join('').replace(/\s+$/, ''); let spans = '', i = 0;
      while (i < c.length) { const k = c[i].tone + c[i].wt + c[i].bg; let s = ''; const x0 = c[i]; while (i < c.length && c[i].tone + c[i].wt + c[i].bg === k) s += c[i++].ch;
        spans += `<span style="color:${inks[x0.tone] || inks.ink};font-weight:${x0.wt || 400}${x0.bg ? ';background:' + inks[x0.bg] : ''}">${esc(s)}</span>`; }
      if (r.k) { html += `<div class="rl" style="font-size:${r.k}em;text-align:center">${spans}</div>`; text += ctrS(plain.trim(), cols) + '\n'; }
      else { html += `<div class="rl">${spans}</div>`; text += plain + '\n'; }
    }
    return { html, text };
  }
  card('dtx-receipts-text', 'Receipts as plain text', 'The X21 receipts reproduced as text, not graphics: every line is live HTML in Geist Mono (or Fira Code) at the face’s block height, so the ░▒▓██▓▒░ rules, sparkline, heat strip, gauge, bars, box-drawn card, barcode and code square stack cleanly and can be selected. Chips are spans with a background. Copy text and .txt give all four receipts as plain characters, ready for a README, a terminal, a docs page or an email.', {
    short: 'receipts-text', init: { theme: 'light', acc2: 'product', tfont: 'geist', tsize: 11 },
    opts: [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] }, { key: 'acc2', label: 'Accent', values: [['product', 'Product colours'], ['blue', 'All blue'], ['none', 'None']] }, { key: 'tfont', label: 'Face', values: [['geist', 'Geist Mono'], ['fira', 'Fira Code']] }, { key: 'tsize', label: 'Size', values: [[11, '11'], [12, '12'], [13, '13']] }, OPT.page],
    items: st => [{ label: 'four receipts · text · ' + st.theme + ' · ' + st.acc2, dom: s => {
      const TH = THEME[s.theme], F = TFONT[s.tfont], cols = 30, PC = PCOLS(), wrap = document.createElement('div'); let text = '';
      wrap.style.cssText = `background:${TH.ground};padding:26px 28px 34px;position:relative;overflow-x:auto`;
      const rail = document.createElement('div'); rail.style.cssText = `position:absolute;left:0;right:0;top:26px;height:10px;background:${TH.rail}`; wrap.appendChild(rail);
      const row = document.createElement('div'); row.style.cssText = `position:relative;display:flex;gap:20px;align-items:flex-start;padding-top:10px;font:400 ${s.tsize}px/${F.lh} ${F.fam};font-variant-ligatures:none;font-feature-settings:'calt' 0,'liga' 0;white-space:pre`; wrap.appendChild(row);
      ['embed', 'preview', 'data', 'agents'].forEach((k, n) => { /* Rich Media shows the embed it returned (X21 keeps the statement) */
        const acc = s.acc2 === 'none' ? TH.ink : s.acc2 === 'blue' ? X().BLUE : PC[RCPT2[k].prod], inks = { ink: TH.ink, body: TH.body, mute: TH.mute, rule: TH.rule, acc, paper: TH.paper };
        const r = receiptText(RCPT2[k].build(cols, s.seed), cols, inks), tr = receiptText(tear(cols + 4, s.seed + n), cols, inks);
        const col = document.createElement('div'); col.style.cssText = 'position:relative;flex:none';
        col.innerHTML = `<div style="position:absolute;left:50%;top:-15px;width:40px;height:22px;margin-left:-20px;background:${TH.clip}"></div><div style="background:${TH.paper};padding:1.3em 2ch">${r.html}</div><div>${tr.html}</div>`;
        row.appendChild(col); text += r.text + '\n\n';
      });
      return { el: wrap, text: text.replace(/\n+$/, '\n') };
    } }],
  });
  /* shared with demos/dither-sections4.js */
  DEMOS.sectionsKit3 = { THEME, TFONT, PCOLS, seg, line, gapR, hair, shadeRule, shadeMark, lead2, player, receiptText, ctrS, ZW, halfRows };
})();
