/* F · Dither stills, round 3 (2026-11-05): the picks taken into real type and into the four products (group 'dts', F18+).
   The type pass: the shader only supplies the field (spec.codes = 2 writes the raw value and the hue select per pixel);
   cells, Bayer thresholds and characters are done here with the real JetBrains Mono, so any glyph set can be used and
   the shader's twelve-glyph atlas is not a limit any more.
     PNG  characters from a sprite cache, one fillText per character, so the font's // <> :: ligatures never fire
     SVG  text: one <text> per row, weight and ink (solid cells merged into one path), so Figma gets editable text layers
          (JetBrains Mono must be installed there; switch its ligatures off)
   Needs demos/dither-set.js (DEMOS.ditherKit) and demos/dither-stills.js (DEMOS.stillsKit) loaded first. */
(() => {
  const { h } = DEMOS;
  const K = () => DEMOS.ditherKit, S = () => DEMOS.stillsKit;
  const BLUE = '#0055ff', MONO = '"JetBrains Mono", ui-monospace, monospace';
  const ADV = .6, LH = 1.25, BASE = .5 * LH + .3; /* JetBrains Mono advance (em), line height (em), baseline from the cell top (em) */
  const FS = { S: 12, M: 16, L: 24 }; /* font size per Cell switch */

  /* glyph sets: six levels, 0 = blank. ch is one character, or a list picked per column (alt) or per cell (hash); b = ink b */
  const L = (ch, wt, o) => Object.assign({ ch, wt: wt || 400 }, o || {});
  const SETS = {
    brand: { label: '//:<>', lv: [null, L('.'), L(':'), L(['/', '/', '<', '>']), L(['/', '/', '<', '>'], 600), L(['/', '/', '<', '>'], 800, { b: 1 })] },
    slash: { label: 'Slashes //', lv: [null, L('.'), L(':'), L('/'), L('/', 600), L('/', 800, { b: 1 })] },
    angle: { label: 'Brackets <>', lv: [null, L('.'), L(':'), L(['<', '>'], 400, { alt: 1 }), L(['<', '>'], 600, { alt: 1 }), L(['<', '>'], 800, { alt: 1, b: 1 })] },
    brace: { label: 'Braces {:}', lv: [null, L('.'), L(':'), L(['{', ':', '}'], 400, { alt: 1 }), L(['{', ':', '}'], 600, { alt: 1 }), L(['{', ':', '}'], 800, { alt: 1, b: 1 })] },
    colon: { label: 'Colon slash :/', lv: [null, L('.'), L(':'), L([':', '/'], 400, { alt: 1 }), L([':', '/'], 600, { alt: 1 }), L('/', 800, { b: 1 })] },
    url: { label: 'URL', lv: [null, L('.'), L(':'), L(['h', 't', 't', 'p', 's', ':', '/']), L('/', 600), L('/', 800, { b: 1 })] },
    ascii: { label: 'ASCII', lv: [null, L('.'), L(':'), L('='), L('+', 600), L('#', 800, { b: 1 })] },
    dots: { label: 'Dots', lv: [null, L('.'), L('.', 700), L(':'), L(':', 700), L(':', 800, { b: 1 })] },
  };
  const SETOPTS = Object.entries(SETS).map(([k, s]) => [k, s.label]);
  const OWN = { rich: 'slash', preview: 'angle', data: 'brace', pub: 'colon' }; /* each product writes in its own symbol */
  const WEIGHT = { key: 'weight', label: 'Weight', values: [['ramp', 'Ramp'], [400, 'Regular'], [700, 'Bold']] };

  const bayer = (x, y) => { x &= 7; y &= 7; let v = 0; for (let i = 0; i < 3; i++) { const xb = (x >> i) & 1, yb = (y >> i) & 1; v = v * 4 + ((xb ^ yb) * 2 + yb); } return (v + .5) / 64; };
  const hash = (i, j, s) => { const x = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return x - Math.floor(x); };
  /* ch: one character, a list (per column with alt, else per cell), or a function (i, j, seed) → character (text streams) */
  const charAt = (lv, i, j, seed) => (typeof lv.ch === 'function' ? lv.ch(i, j, seed) : typeof lv.ch === 'string' ? lv.ch : lv.alt ? lv.ch[i % lv.ch.length] : lv.ch[Math.floor(hash(i, j, seed) * lv.ch.length)]);

  /* ------------------------------------------------------------ field → cells */
  /* one shader pass per layer: the raw field value and the hue select at every cell centre */
  function sample(spec, W, H, t, cw, ch, maskFn) {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d');
    const sp = Object.assign({}, spec, { codes: 2, method: 'bayer', cell: 1 }); const mask = maskFn ? maskFn(W, H, sp) : null;
    K().R.paint(ctx, W, H, sp, t, 1, [0, 0, 0], mask);
    const px = ctx.getImageData(0, 0, W, H).data, cols = Math.ceil(W / cw), rows = Math.ceil(H / ch);
    const v = new Float32Array(cols * rows), hue = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) { const y = Math.min(H - 1, Math.floor((j + .5) * ch)); for (let i = 0; i < cols; i++) { const x = Math.min(W - 1, Math.floor((i + .5) * cw)), o = (y * W + x) * 4, n = j * cols + i; v[n] = px[o] / 255; hue[n] = px[o + 1] / 255; } }
    return { cols, rows, v, hue, hued: !!spec.hue, solid: spec.solid == null ? 2 : spec.solid };
  }
  /* layers → one cell grid: the strongest layer owns a cell, Bayer picks its level, the layer's set writes the character */
  function layout(layers, st, W, H, opts) {
    const fs = ((opts && opts.fs) || FS)[st.cellSize] || FS.S, cw = fs * ADV, ch = fs * LH, t = st.seed * 3.7; /* opts.fs: a card's own sizes per Cell switch */
    const smp = layers.map(l => sample(Object.assign({ seed: st.seed }, l.spec), W, H, t, cw, ch, l.maskFn));
    const { cols, rows } = smp[0], n = cols * rows, lvl = new Uint8Array(n), hs = new Uint8Array(n), who = new Uint8Array(n);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const k = j * cols + i; let best = 0, bv = -1; for (let m = 0; m < smp.length; m++) if (smp[m].v[k] > bv) { bv = smp[m].v[k]; best = m; }
      const s = smp[best]; who[k] = best; hs[k] = s.hued && s.hue[k] > bayer(i + 3, j + 5) ? 1 : 0;
      if (bv >= s.solid) { lvl[k] = 6; continue; }
      const lv = bv * 5, fl = Math.floor(lv); lvl[k] = Math.min(5, fl + (lv - fl >= bayer(i, j) ? 1 : 0));
    }
    if (opts && opts.lastSolid) for (let i = 0; i < cols; i++) lvl[(rows - 1) * cols + i] = 6;
    return { fs, cw, ch, cols, rows, lvl, hs, who, sets: layers.map(l => (typeof l.set === 'object' ? l.set : SETS[l.set] || SETS.brand)) }; /* a layer may bring its own set object */
  }
  const inkTable = inks => { const c = S().colArg; return { a: c(inks.a), b: c(inks.b || inks.a), c: c(inks.c || inks.a), d: c(inks.d || inks.b || inks.a) }; };
  const inkOf = (I, lv, hs) => (hs ? (lv.b ? I.d : I.c) : (lv.b ? I.b : I.a));

  /* ------------------------------------------------------------ cells → PNG */
  const sprites = new Map();
  const fontOK = () => (document.fonts ? document.fonts.check(`800 20px ${MONO}`) : true);
  function sprite(chr, wt, ink, fs, scale) {
    const key = [chr, wt, ink[0], ink[1], fs, scale, fontOK() ? 1 : 0].join('|'); let s = sprites.get(key); if (s) return s;
    const cw = Math.ceil(fs * ADV * scale) + 2, chh = Math.ceil(fs * LH * scale) + 2; s = document.createElement('canvas'); s.width = cw; s.height = chh;
    const x = s.getContext('2d'); x.font = `${wt} ${fs * scale}px ${MONO}`; x.fillStyle = ink[0]; x.globalAlpha = ink[1]; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillText(chr, cw / 2, 1 + BASE * fs * scale); sprites.set(key, s); return s;
  }
  function paintType(lay, inks, W, H, scale, seed, weight) {
    const c = document.createElement('canvas'); c.width = Math.round(W * scale); c.height = Math.round(H * scale); const x = c.getContext('2d');
    const { fs, cw, ch, cols, rows, lvl, hs, who, sets } = lay, I = inkTable(inks);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const k = j * cols + i, Lv = lvl[k]; if (!Lv) continue;
      if (Lv === 6) { const ink = hs[k] ? I.c : I.a, x0 = Math.round(i * cw * scale), y0 = Math.round(j * ch * scale); x.fillStyle = ink[0]; x.globalAlpha = ink[1]; x.fillRect(x0, y0, Math.round((i + 1) * cw * scale) - x0, Math.round((j + 1) * ch * scale) - y0); x.globalAlpha = 1; continue; }
      const lv = sets[who[k]].lv[Lv];
      x.drawImage(sprite(charAt(lv, i, j, seed), weight === 'ramp' ? lv.wt : weight, inkOf(I, lv, hs[k]), fs, scale), Math.round(i * cw * scale) - 1, Math.round(j * ch * scale) - 1);
    }
    return c;
  }

  /* ------------------------------------------------------------ cells → SVG text */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const f2 = v => +v.toFixed(2);
  const inkAttr = ink => `fill="${ink[0]}"${ink[1] < 1 ? ` fill-opacity="${ink[1]}"` : ''}`;
  function svgType(lay, inks, W, H, seed, weight, ground) {
    const { fs, cw, ch, cols, rows, lvl, hs, who, sets } = lay, I = inkTable(inks);
    let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="${fs}" style="font-variant-ligatures:none;font-feature-settings:'calt' 0,'liga' 0">`;
    if (ground) out += `<rect width="${W}" height="${H}" fill="${ground}"/>`;
    const rects = new Map(); let layers = 0;
    for (let j = 0; j < rows; j++) {
      const y = f2(j * ch + BASE * fs), y0 = f2(j * ch), hh = f2(Math.min(H, (j + 1) * ch) - j * ch), styles = new Map(); let run = null, rx = 0;
      const flush = i => { if (run) { const w = f2(Math.min(W, i * cw) - rx); (rects.get(run) || rects.set(run, []).get(run)).push(`M${f2(rx)} ${y0}h${w}v${hh}h${-w}z`); run = null; } };
      for (let i = 0; i <= cols; i++) {
        const k = j * cols + i, Lv = i < cols ? lvl[k] : 0;
        if (Lv === 6) { const key = inkAttr(hs[k] ? I.c : I.a); if (key !== run) { flush(i); run = key; rx = i * cw; } continue; }
        flush(i); if (!Lv) continue;
        const lv = sets[who[k]].lv[Lv], wt = weight === 'ramp' ? lv.wt : weight, ink = inkOf(I, lv, hs[k]), key = wt + '|' + inkAttr(ink);
        let s = styles.get(key); if (!s) styles.set(key, (s = { wt, ink, x0: i, chars: [] }));
        while (s.chars.length < i - s.x0) s.chars.push(' '); s.chars.push(charAt(lv, i, j, seed));
      }
      for (const s of styles.values()) { out += `<text x="${f2(s.x0 * cw)}" y="${y}" font-weight="${s.wt}" ${inkAttr(s.ink)} xml:space="preserve">${esc(s.chars.join(''))}</text>`; layers++; }
    }
    for (const [attr, d] of rects) { out += `<path ${attr} d="${d.join('')}"/>`; layers++; }
    return { svg: out + '</svg>', runs: layers };
  }

  /* ------------------------------------------------------------ inks and grounds */
  /* a colour's pair for the tone, mirroring the sparse tables of the glyph method; dark grounds take white mixes */
  const inksFor = (col, g, tone) => {
    const k = K(), dark = !!g.dark, gb = g.bg;
    if (tone === 'grey') return dark ? { a: k.mixHex(gb, '#000000', .18), b: k.mixHex(gb, '#000000', .34) } : { a: k.mixHex(gb, '#0d0e10', .14), b: k.mixHex(gb, '#0d0e10', .28) };
    if (tone === 'accent') return dark ? { a: k.mixHex(gb, '#ffffff', .36), b: '#ffffff' } : { a: k.mixHex(gb, col, .37), b: col };
    return dark ? { a: k.mixHex(gb, '#ffffff', .25), b: k.mixHex(gb, '#ffffff', .48) } : { a: k.mixHex(gb, col, .27), b: k.mixHex(gb, col, .5) };
  };
  /* inks for a card: the colour's pair, plus the second colour's pair and the hue field that places it */
  const inks = (st, g, col, hue) => {
    const k = K(), o = inksFor(col || BLUE, g, st.tone || 'tint'), c2 = st.sec !== 'none' && k.SEC[st.sec] ? k.SEC[st.sec].s : null;
    if (c2) Object.assign(o, k.secInks(c2, { k: g.dark ? 'blue' : g.k, bg: g.bg }, { method: 'glyphs', tone: st.tone || 'tint' }));
    return { inks: o, hue: c2 ? (hue || { mode: 'noise', p: [1.1, .45, .72, 0] }) : undefined };
  };
  const PGROUNDS = () => K().PROD.map(pr => ({ k: pr.k, pr, bg: '#ffffff', label: pr.name + ' · white', dark: false }));
  const PGOPT = { key: 'pg', label: 'Ground', values: [['white', 'White'], ['tint', 'Tint'], ['colour', 'Colour']] };
  const pground = (st, g) => { const pr = g.pr, m = st.pg || 'white'; return m === 'white' ? { bg: '#ffffff', label: pr.name + ' · white', dark: false } : m === 'tint' ? { bg: K().tint(pr.c, .92), label: pr.name + ' · tint', dark: false } : { bg: pr.c, label: pr.name + ' · ' + pr.c, dark: true }; };

  /* masks: a symbol or a line of text, fitted to the panel; sets sp.mbox (uv, y up) for the vertical gradient */
  function textMask(w, hh, sp, txt, fontOf, size, yk) {
    const m = document.createElement('canvas'); m.width = w; m.height = hh; const x = m.getContext('2d'); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    let px = hh * size; x.font = fontOf(px); const wd = x.measureText(txt).width; if (wd > w * .9) { px *= (w * .9) / wd; x.font = fontOf(px); }
    const mt = x.measureText(txt), y = yk != null ? hh * yk : hh / 2 + (mt.actualBoundingBoxAscent - mt.actualBoundingBoxDescent) / 2;
    x.fillText(txt, w / 2, y); sp.mbox = [1 - (y + mt.actualBoundingBoxDescent) / hh, 1 - (y - mt.actualBoundingBoxAscent) / hh]; m._v = 1; return m;
  }
  const monoFont = px => `800 ${Math.round(px)}px ${MONO}`;

  /* ------------------------------------------------------------ card builder */
  const TYPE_NOTE = 'Type pass: the field comes from the shader, the characters are real JetBrains Mono. Copy PNG pastes into Figma as an image. Copy SVG pastes as TEXT, one layer per row, weight and ink (solid cells as one path), so the glyphs stay editable: Figma needs JetBrains Mono installed, and its ligatures switched off (// <> :: are ligatures in that font). Exports are the ink layer on a transparent ground unless Ground is Filled; 2× doubles the pixels, not the cell.';
  function typeStill(name, title, blurb, def) {
    S().still(name, title, blurb, Object.assign({ fixedMethod: true, grounds: K().GROUNDS.map(g => Object.assign({}, g)), note: TYPE_NOTE, tag: st => 'type-' + (st.set || 'own') }, def, {
      init: Object.assign({ method: 'glyphs', cellSize: 'S' }, def.init || {}),
      spec: () => ({ method: 'glyphs' }),
      render(st, g, scale) { const t = def.type(st, g); return paintType(layout(t.layers, st, st.size[0], st.size[1], Object.assign({ fs: def.fs }, t.opts)), t.inks, st.size[0], st.size[1], scale, st.seed, st.weight || 'ramp'); },
      svg(st, g) { const t = def.type(st, g); return svgType(layout(t.layers, st, st.size[0], st.size[1], Object.assign({ fs: def.fs }, t.opts)), t.inks, st.size[0], st.size[1], st.seed, st.weight || 'ramp', st.ground ? g.bg : null); },
    }));
  }

  /* ------------------------------------------------------------ F18 type field */
  const FIELDS = {
    glow: { field: 'radial', p: [1.02, 1.05, 1.15, 1.5], q: [.28, .25, 0, 0], hue: { mode: 'linear', p: [-2.2, .5, .78, 0] } },
    rise: { field: 'radial', p: [.98, .02, 1.45, 1.1], q: [.3, .3, 0, 0] },
    corner: { field: 'radial', p: [1.02, -.05, 1.0, 1.3], q: [.3, .35, 0, 0] },
    clouds: { field: 'clouds', p: [1.6, .34, .78, .85], q: [0, .6, 0, 0] },
    wash: { field: 'linear', p: [-.6, .28, 1.08, 0], q: [.35, .15, 0, 0], hue: { mode: 'linear', p: [-1.57, .42, .78, 0] } },
  };
  const COL = { blue: ['Blue', BLUE], preview: ['Violet', K().PROD[1].c], data: ['Orchid', K().PROD[2].c], pub: ['Magenta', K().PROD[3].c], ink: ['Ink', '#0d0e10'] };
  typeStill('dts-type', 'Type field', 'The glyph-field, grain, clouds and corner-piece picks written in real JetBrains Mono instead of the shader atlas. Pick the field, the glyph set (//:<>, slashes, brackets, braces, :/, URL characters, ASCII, dots), the ink colour (blue or a product colour: the third ground takes that colour, Ink makes a dark poster) and whether the weight ramps with density. The SVG is editable text.', {
    short: 'type', sizes: S().BG_SIZES,
    opts: [{ key: 'fieldk', label: 'Field', values: [['rise', 'Rise BR'], ['glow', 'Glow TR'], ['corner', 'Corner'], ['clouds', 'Clouds'], ['wash', 'Wash']] }, { key: 'set', label: 'Glyphs', values: SETOPTS }, { key: 'colour', label: 'Colour', values: Object.entries(COL).map(([k, v]) => [k, v[0]]) }, WEIGHT],
    reground: (st, g) => (g.k === 'blue' ? (st.colour === 'blue' || !COL[st.colour] ? { bg: BLUE, label: 'blue #0055ff' } : { bg: COL[st.colour][1], label: COL[st.colour][0].toLowerCase() + ' ' + COL[st.colour][1] }) : null),
    tag: st => 'type-' + st.set + '-' + st.fieldk + (st.colour !== 'blue' ? '-' + st.colour : ''),
    type(st, g) { const f = FIELDS[st.fieldk] || FIELDS.rise, { inks: I, hue } = inks(st, g, COL[st.colour] ? COL[st.colour][1] : BLUE, f.hue); return { layers: [{ spec: Object.assign({}, f, { hue }), set: st.set }], inks: I }; },
  });

  /* ------------------------------------------------------------ F19 shapes in type */
  const SHAPE = ix => ({ field: 'shapes', p: [1, 0, 0, 0], q: [0, .5, 0, 0], r: [ix === 0 ? 1 : 0, ix === 1 ? 1 : 0, ix === 2 ? 1 : 0, 1] });
  const MIXES = { own: ['dots', 'slash', 'angle'], brand: ['brand', 'brand', 'brand'], code: ['brace', 'url', 'colon'], mono: ['slash', 'slash', 'slash'] };
  typeStill('dts-typeshapes', 'Shapes in type', 'The soft-shapes pick with the glyph variety it asked for: the circle, the slash and the half ring are rendered as three layers, each written in its own glyph set, so the three shapes read as three textures of the same family. Seed moves the shapes a little.', {
    short: 'typeshapes', sizes: S().BG_SIZES, init: { zoom: false }, /* the shapes only read as a whole: preview fitted */
    opts: [{ key: 'mix', label: 'Glyphs', values: [['own', 'Dots · slashes · brackets'], ['brand', '//:<> throughout'], ['code', 'Braces · URL · :/'], ['mono', 'Slashes only']] }, WEIGHT],
    tag: st => 'type-' + st.mix,
    type(st, g) { const { inks: I, hue } = inks(st, g, BLUE); return { layers: MIXES[st.mix].map((set, ix) => ({ spec: Object.assign(SHAPE(ix), { hue }), set })), inks: I }; },
  });

  /* ------------------------------------------------------------ F20 the marks in type */
  const MARKS = {
    slashes: { spec: { field: 'slashes', p: [.5, .5, .4, .004], q: [0, 0, 0, .12], r: [1, 0, 0, 0] }, set: 'slash', hue: { mode: 'linear', p: [1.5708, .42, .62, 0] } },
    chevrons: { spec: { field: 'chevrons', p: [.5, .5, .38, .004], q: [0, 0, 0, .15], r: [1, 0, 1.0, 0] }, set: 'angle', hue: { mode: 'linear', p: [0, .49, .51, 0] } },
  };
  typeStill('dts-typemark', '// and < > in type', 'The glyph variant of the // mark pick, and the < > brackets with it: the shape is filled with its own character, slashes made of slashes and brackets made of brackets, heavy where the shape is dense (the foot of //, the inner edges of < >) and thinning to dots and colons at the dissolving edge, with a scatter of dots around.', {
    short: 'typemark', mid: true, sizes: [[[800, 800], 'Square'], [[1200, 600], 'Wide'], [[600, 800], 'Tall']], init: { tone: 'accent', zoom: false },
    opts: [{ key: 'mark', label: 'Mark', values: [['slashes', '//'], ['chevrons', '< >']] }, { key: 'set', label: 'Glyphs', values: [['own', 'Own symbol'], ...SETOPTS] }, WEIGHT],
    tag: st => 'type-' + st.mark + '-' + st.set,
    type(st, g) {
      const m = MARKS[st.mark] || MARKS.slashes, { inks: I, hue } = inks(st, g, BLUE, m.hue), spec = Object.assign({}, m.spec, { hue });
      if (st.mark === 'chevrons') spec.r = [1, 0, .5 * st.size[0] / st.size[1], 0]; /* bracket spacing is in aspect units: a quarter of the width from the centre on any preset */
      return { layers: [{ spec, set: st.set === 'own' ? m.set : st.set }], inks: I };
    },
  });

  /* ------------------------------------------------------------ F21 product symbols in their own glyphs */
  typeStill('dts-typesymbols', 'Product symbols in their own glyphs', 'The glyph variant of the product-symbols pick: each symbol is written in its own characters and colour. // out of slashes, <> out of angle brackets, {:} out of braces and colons, :/ out of colons and slashes, dense at the foot and dissolving upwards, with an optional cloud texture around it. Ground: white, the product tint, or the product colour with white type.', {
    short: 'typesymbol', cols: 4, mid: true, grounds: PGROUNDS(), sizes: [[[600, 400], 'Header'], [[400, 400], 'Square'], [[800, 400], 'Wide']], init: { tone: 'accent' },
    opts: [PGOPT, { key: 'set', label: 'Glyphs', values: [['own', 'Own symbol'], ...SETOPTS] }, { key: 'tex', label: 'Texture', values: [[true, 'On'], [false, 'Off']] }, WEIGHT],
    reground: pground, tag: st => 'type-' + st.set + '-' + st.pg,
    type(st, g) {
      const pr = g.pr, { inks: I, hue } = inks(st, g, pr.c, { mode: 'linear', p: [1.5708, .45, .6, 0] });
      const spec = { field: 'clouds', p: [2.2, .42, .9, .6], q: [0, .4, 0, 0], gain: st.tex ? .45 : 0, maskMode: 2, mg: 1, mgy: 1, hue };
      return { layers: [{ spec, set: st.set === 'own' ? OWN[pr.k] : st.set, maskFn: (w, hh, sp) => textMask(w, hh, sp, pr.sym, monoFont, .62, .74) }], inks: I };
    },
  });

  /* ------------------------------------------------------------ F22 product icons (shader dither, Bayer or glyphs) */
  const ICONS = Object.assign({}, S().ICONS, {
    shield: x => {
      x.beginPath(); x.moveTo(.5, .05); x.lineTo(.9, .2); x.lineTo(.9, .5); x.bezierCurveTo(.9, .74, .72, .9, .5, .96); x.bezierCurveTo(.28, .9, .1, .74, .1, .5); x.lineTo(.1, .2); x.closePath(); x.fill();
      x.globalCompositeOperation = 'destination-out'; x.lineWidth = .09; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(.32, .5); x.lineTo(.45, .63); x.lineTo(.69, .38); x.stroke(); x.globalCompositeOperation = 'source-over';
    },
  });
  const PICON = { rich: 'player', preview: 'card', data: 'json', pub: 'shield' };
  S().still('dts-prodicons', 'Product icons', 'The icon variant of the product-symbols pick: a player for Rich Media, a link card for the Preview API, braces for the Data API and a shield for the Publisher Console, each dithered in its product colour, dense at the foot and dissolving upwards, over an optional cloud texture. Bayer or //:<> glyphs; on white, the product tint, or the product colour.', {
    short: 'prodicon', cols: 4, mid: true, grounds: PGROUNDS(), noTone: true, methods: ['bayer', 'glyphs'], init: { method: 'glyphs', cellSize: 'S' },
    sizes: [[[400, 400], 'Square'], [[600, 400], 'Card'], [[240, 240], 'Small']],
    opts: [PGOPT, { key: 'tex', label: 'Texture', values: [[false, 'Off'], [true, 'On']] }], reground: pground, tag: st => st.method + '-' + st.pg,
    spec(st, g) {
      const k = K(), pr = g.pr, dark = !!g.dark, c2 = st.sec !== 'none' && k.SEC[st.sec] ? k.SEC[st.sec].s : null;
      const spec = { field: 'clouds', p: [2.2, .42, .9, .6], q: [0, .4, 0, 0], method: st.method, two: .55, gain: st.tex ? .4 : 0, maskMode: 2, mg: 1, mgy: .55, a: dark ? k.mixHex(pr.c, '#ffffff', .4) : k.mixHex(g.bg, pr.c, .5), b: dark ? '#ffffff' : pr.c };
      if (c2) Object.assign(spec, { c: spec.a, d: dark ? k.mixHex('#ffffff', c2, .45) : c2, hue: { mode: 'linear', p: [1.5708, .45, .62, 0] } });
      spec.maskFn = (w, hh, sp) => {
        const m = document.createElement('canvas'); m.width = w; m.height = hh; const x = m.getContext('2d'), Sz = Math.min(w, hh) * .62, x0 = (w - Sz) / 2, y0 = (hh - Sz) / 2;
        x.fillStyle = x.strokeStyle = '#fff'; x.save(); x.translate(x0, y0); x.scale(Sz, Sz); ICONS[PICON[pr.k]](x); x.restore();
        sp.mbox = [1 - (y0 + Sz) / hh, 1 - y0 / hh]; m._v = 1; return m;
      };
      return spec;
    },
  });

  /* ------------------------------------------------------------ F23 type band */
  const TO = { blue: BLUE, grey: '#f6f6f6', white: '#ffffff' };
  typeStill('dts-typeband', 'Type band', 'The transition-band pick in real mono type: rows of a glyph set thicken from dots and colons to heavy characters as the band fills with the next section’s colour, and the last row is solid so it joins without a seam. Each preview shows the "from" ground; pick the colour it leads to and the glyph set.', {
    short: 'typeband', wide: true, noTone: true, sizes: [[[1440, 120], '1440'], [[1440, 200], 'Tall'], [[1200, 96], '1200']],
    opts: [{ key: 'to', label: 'To', values: [['blue', 'Blue'], ['grey', 'Grey'], ['white', 'White']] }, { key: 'set', label: 'Glyphs', values: SETOPTS }, WEIGHT],
    tag: st => 'type-' + st.set + '-to-' + st.to,
    type(st, g) {
      const k = K(), to = TO[st.to] || BLUE, c2 = st.sec !== 'none' && k.SEC[st.sec] ? k.SEC[st.sec].s : null;
      return { layers: [{ spec: { field: 'linear', p: [-Math.PI / 2, -.1, .95, 0], q: [.12, .2, 0, 0], solid: .93, hue: c2 ? { mode: 'noise', p: [2.2, .55, .7, 0] } : undefined }, set: st.set }], inks: Object.assign({ a: to, b: to }, c2 ? { c: c2, d: c2 } : {}), opts: { lastSolid: true } };
    },
  });

  /* ------------------------------------------------------------ F24 any text in type */
  const TFONTS = { geist: ['Geist 700', px => `700 ${Math.round(px)}px Geist, Inter, sans-serif`], mono: ['JetBrains Mono 800', monoFont], serif: ['Instrument Serif', px => `400 ${Math.round(px)}px "Instrument Serif", Georgia, serif`] };
  typeStill('dts-typetext', 'Any text in type', 'Type a headline, a stat or a word and get it written in dither type: the text is the mask, the glyph set fills it, dense at the foot or evenly, with Geist, JetBrains Mono or Instrument Serif as the letterform. For stat bands, section titles and OG images; a second colour splits the word.', {
    short: 'typetext', mid: true, sizes: [[[1200, 320], 'Line'], [[800, 320], 'Short'], [[1200, 630], 'OG']], init: { tone: 'accent', zoom: false }, fs: { S: 8, M: 11, L: 14 }, /* finer cells: a 190 px headline needs ~20 rows to read */
    opts: [{ key: 'text', label: 'Text', input: true, value: '1,900 providers', placeholder: 'Type a headline' }, { key: 'font', label: 'Font', values: Object.entries(TFONTS).map(([k, v]) => [k, v[0]]) }, { key: 'set', label: 'Glyphs', values: SETOPTS }, { key: 'fill', label: 'Fill', values: [['grad', 'Dense at the foot'], ['flat', 'Even']] }, { key: 'tex', label: 'Texture', values: [[false, 'Off'], [true, 'On']] }, WEIGHT],
    tag: st => 'type-' + st.set + '-' + st.font,
    type(st, g) {
      const { inks: I, hue } = inks(st, g, BLUE, { mode: 'linear', p: [0, .48, .52, 0] }), txt = (st.text || '').trim() || 'iframely', fontOf = (TFONTS[st.font] || TFONTS.geist)[1];
      const spec = { field: 'clouds', p: [2.2, .42, .9, .6], q: [0, .4, 0, 0], gain: st.tex ? .4 : 0, maskMode: 2, mg: st.fill === 'flat' ? .72 : 1.25, mgy: st.fill === 'flat' ? 0 : 1, hue }; /* mg 1.25: the gradient keeps the letter tops at colons, not dots */
      return { layers: [{ spec, set: st.set, maskFn: (w, hh, sp) => textMask(w, hh, sp, txt, fontOf, .6) }], inks: I };
    },
  });

  /* ------------------------------------------------------------ F25 shadow gradient (the D17 effect as a static tile) */
  /* A plain dither gradient the height of a line of type. Duplicate the text, offset it, and fill the copy with this tile
     (Figma: tile as an image fill or a layer masked by the text; CSS: background-clip: text), and the D17 stat shadow
     comes back without the shader. Bayer through the shader (SVG = cell runs), glyphs through the type pass (SVG = text). */
  const SH_RANGE = { strong: [.3, .95], soft: [.12, .75], full: [0, 1] };
  const SH_COL = { blue: ['Blue', BLUE], ink: ['Ink', '#0d0e10'], white: ['White', '#ffffff'], pink: ['Pink', '#ff3d8b'], violet: ['Violet', '#6a3bff'] };
  const SH_FS = { S: 6, M: 8, L: 11 }; /* glyph font sizes: cells 7.5 / 10 / 14 px, as D17's glyph row */
  const shSpec = st => {
    const [lo, hi] = SH_RANGE[st.range] || SH_RANGE.strong;
    if (st.dir === 'flat') return { field: 'flat', p: [(lo + hi) / 2, 0, 0, 0] };
    return { field: 'linear', p: [st.dir === 'down' ? Math.PI / 2 : -Math.PI / 2, 0, 1, 0], q: [st.noise ? .22 : 0, 0, 0, 0], gain: hi - lo, bias: lo };
  };
  const shCol = st => (SH_COL[st.ink] || SH_COL.blue)[1];
  const shBayer = st => ({ spec: () => Object.assign(shSpec(st), { method: 'bayer', a: shCol(st), b: shCol(st) }) });
  const shLay = st => layout([{ spec: shSpec(st), set: st.set }], st, st.size[0], st.size[1], { fs: SH_FS });
  const SH_SAMPLES = ['1,900+', '2012'];
  S().still('dts-shadow', 'Shadow gradient (D17 as a tile)', 'The D17 stat shadow as a static asset: a dither gradient the height of a line of type, dense at the foot. Duplicate the text, offset the copy a few pixels, and fill it with this tile (in Figma an image fill, or the tile masked by the text; in the browser background-clip: text), and the shadow is back with no shader. Bayer or real //:<> glyphs; the preview under the exports uses the white-ground PNG exactly that way, with the CSS to copy.', {
    short: 'shadow', mid: true, noTone: true, methods: ['bayer', 'glyphs'], init: { method: 'bayer', cellSize: 'S', zoom: false },
    sizes: [[[1200, 112], '88 px type'], [[1200, 160], '128 px type'], [[1200, 72], '56 px type'], [[2400, 240], 'Display 192 px']],
    opts: [{ key: 'ink', label: 'Ink', values: Object.entries(SH_COL).map(([k, v]) => [k, v[0]]) }, { key: 'dir', label: 'Gradient', values: [['up', 'Dense at the foot'], ['down', 'Dense at the top'], ['flat', 'Flat']] },
      { key: 'range', label: 'Range', values: [['strong', 'Strong .3–.95'], ['soft', 'Soft .1–.75'], ['full', 'Full 0–1']] }, { key: 'noise', label: 'Noise', values: [[false, 'Off'], [true, 'On']] },
      { key: 'set', label: 'Glyphs', values: SETOPTS }, { key: 'weight', label: 'Weight', values: [[800, 'Bold'], ['ramp', 'Ramp'], [400, 'Regular']] }, { key: 'use', label: 'Preview', values: [['shadow', 'Offset shadow'], ['fill', 'Texture fill']] }],
    tag: st => st.method + (st.method === 'glyphs' ? '-' + st.set : '') + '-' + st.ink + '-' + st.dir + '-' + st.range,
    spec: st => ({ method: st.method }),
    /* glyph tiles default to Bold: inside a letter stroke only a few cells survive the mask, thin glyphs read as nothing */
    render(st, g, scale) { return st.method === 'glyphs' ? paintType(shLay(st), { a: shCol(st), b: shCol(st) }, st.size[0], st.size[1], scale, st.seed, st.weight) : S().render(shBayer(st), st, g, scale).c; },
    svg(st, g) { if (st.method !== 'glyphs') return S().svgOf(shBayer(st), st, g); return svgType(shLay(st), { a: shCol(st), b: shCol(st) }, st.size[0], st.size[1], st.seed, st.weight, st.ground ? g.bg : null); },
    note: 'Exports are the tile only, transparent unless Ground is Filled. Bayer tiles repeat seamlessly sideways (widths are multiples of the 8×8 matrix); glyph tiles are random per cell, so make them as wide as the longest line. Use the 2× PNG and set its size back to 1× (Figma: scale the image to the layer; CSS: background-size in CSS pixels). Glyph SVG is editable text and needs JetBrains Mono with ligatures off.',
    after(st, el) {
      const [W, H] = st.size, c = this.render(st, { k: 'white', bg: '#ffffff' }, 2), url = c.toDataURL('image/png'), fs = Math.round(H * .8), off = Math.max(4, Math.round(fs / 12));
      const shadow = st.use === 'shadow', fill = `background-image:url(${url});background-size:${W}px ${H}px`;
      const nums = SH_SAMPLES.map(t => h('span', { class: 'dts-num', style: `font-size:${fs}px;line-height:${H}px` },
        h('span', { class: 'sh', style: fill + (shadow ? `;transform:translate(${off}px,${off}px)` : ';position:relative') }, t), shadow ? h('span', { class: 'fg' }, t) : null)); /* fill: the clipped copy is the only box, keep it in flow */
      const css = `.stat { position: relative; font: 600 ${fs}px/${H}px Geist, sans-serif; }\n.stat::before {            /* <div class="stat" data-n="1,900+">1,900+</div> */\n  content: attr(data-n);\n  position: absolute; inset: 0;\n  ${shadow ? `transform: translate(${off}px, ${off}px);\n  ` : ''}color: transparent;\n  background: url(iframely-dither-shadow.png) left bottom / ${W}px ${H}px repeat-x;\n  -webkit-background-clip: text; background-clip: text;\n}${shadow ? '\n.stat { isolation: isolate; } .stat::before { z-index: -1; }' : '\n.stat { color: transparent; }'}`;
      const copyBtn = h('button', { onclick: async e => { try { await navigator.clipboard.writeText(css); S().flash(e.target, 'copied ✓'); } catch (err) { S().flash(e.target, 'blocked'); } } }, 'Copy CSS');
      const figma = 'Figma: paste the PNG or SVG as a layer the size of the text box, duplicate the text, put the tile above the copy and use the copy as its mask (or set the PNG as the copy’s image fill, Tile, scale 50% for the 2× file), then nudge the masked group ' + (shadow ? off + ' px right and down, under the solid text.' : '0 px and hide the solid text.');
      if (!document.getElementById('dts-shadow-css')) document.head.appendChild(h('style', { id: 'dts-shadow-css' }, `.dts-extra{display:grid;gap:12px}.dts-use{display:flex;flex-wrap:wrap;gap:48px;align-items:flex-end;padding:28px 32px;border-radius:12px;box-shadow:inset 0 0 0 1px var(--hair);background:#fff;overflow:hidden}
.dts-num{position:relative;display:inline-block;font-family:Geist,Inter,sans-serif;font-weight:600;letter-spacing:-.04em;color:#0d0e10;white-space:nowrap}.dts-num .sh{position:absolute;left:0;top:0;color:transparent;-webkit-background-clip:text;background-clip:text;background-repeat:repeat-x;background-position:left bottom}.dts-num .fg{position:relative}
.dts-css{margin:0;padding:14px 16px;border-radius:10px;background:#f6f6f6;font:12px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#3b3f47;white-space:pre-wrap}.dts-extra .row{display:flex;gap:10px;align-items:center;font:12px/1.5 Geist,Inter,sans-serif;color:var(--ink2)}.dts-extra .row button{height:26px;padding:0 9px;border-radius:6px;border:1px solid var(--hair);background:#fff;font:500 11px 'Geist Mono',ui-monospace,monospace;cursor:pointer;flex:none}`));
      el.replaceChildren(h('div', { class: 'dts-use' }, ...nums), h('div', { class: 'row' }, copyBtn, h('span', null, figma)), h('pre', { class: 'dts-css' }, css));
    },
  });

  /* shared with demos/dither-sections.js */
  DEMOS.typeKit = { SETS, sample, layout, paintType, svgType, bayer, hash, MONO, ADV, LH, BASE };
})();
