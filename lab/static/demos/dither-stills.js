/* D · Dither stills (2026-11-05): the dither backgrounds and accents as static assets for Figma (group 'dts').
   Uses the renderer from demos/dither-set.js (DEMOS.ditherKit). Each card renders at the chosen export size (the
   preview is that render scaled down, so it matches the file) and exports per ground:
     Copy PNG / PNG  transparent ink layer (or with the ground filled in), at 1× or 2×
     Copy SVG / SVG  only for the square-cell methods (Bayer, blue noise, grain): one <path> per ink colour, cells
                     merged into horizontal runs, so Figma gets a few editable vectors instead of thousands of layers.
   Nothing animates: time and noise offsets come from the seed, so a seed number reproduces the same still. */
(() => {
  const { h } = DEMOS;
  const K = () => DEMOS.ditherKit;
  const SQUARE = { bayer: 1, ign: 1, grain: 1 };
  const SVGABLE = { bayer: 1, ign: 1, grain: 1, glyphs: 1 };
  const METHODS = ['bayer', 'glyphs']; /* the user's picks for static assets */
  const SEC2 = ['pink', 'violet']; /* second colours kept for stills (user, 2026-11-05) */
  /* glyph outlines in em units of a cell (width .62, height 1, y down), close to JetBrains Mono, matching the shader's
     atlas order: 1 . 2 : then / < > in regular (3-5), semibold (6-8), heavy (9-11); 12 = a solid cell (band edges) */
  const slash = w => [[[.135 - w / 2, .86], [.135 + w / 2, .86], [.485 + w / 2, .14], [.485 - w / 2, .14]]];
  const chevL = t => [[[.52, .19], [.08, .47], [.08, .53], [.52, .81], [.52, .81 - t], [.08 + 1.27 * t, .5], [.52, .19 + t]]];
  const flipX = polys => polys.map(poly => poly.map(([x, y]) => [.62 - x, y]));
  const GLYPH = {
    1: [[[.245, .655], [.375, .655], [.375, .785], [.245, .785]]],
    2: [[[.245, .315], [.375, .315], [.375, .445], [.245, .445]], [[.245, .655], [.375, .655], [.375, .785], [.245, .785]]],
    12: [[[0, 0], [.62, 0], [.62, 1], [0, 1]]],
  };
  [[.11, .1], [.15, .13], [.19, .16]].forEach(([w, t], i) => { GLYPH[3 + i * 3] = slash(w); GLYPH[4 + i * 3] = chevL(t); GLYPH[5 + i * 3] = flipX(chevL(t)); });
  const colArg = v => (Array.isArray(v) ? v : [v, 1]);
  const SIZES = { S: 1, M: 1.6, L: 2.6 };
  const GCELL = { S: 14, M: 20, L: 30 }; /* glyph cell heights for stills: large enough to read at 1:1 */

  const CSS = `
.dts-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.dts-grid.wide{grid-template-columns:1fr}
.dts-grid.c4{grid-template-columns:repeat(4,minmax(0,1fr))}
.dts-grid.c2{grid-template-columns:repeat(2,minmax(0,1fr))}
.dt-bar input.dts-in{height:28px;padding:0 10px;border-radius:7px;border:1px solid var(--hair);background:#fff;font:13px Geist,Inter,sans-serif;color:var(--ink);min-width:160px}
.dt-bar input.dts-in:focus{outline:none;border-color:#b9bec7}
.dts-pn{margin:0}
.dts-box{position:relative;border-radius:12px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(13,14,16,.07)}
.dts-box canvas{position:relative;z-index:1;display:block;width:100%;height:auto}
.dts-under{position:absolute;inset:8% 10% 0;border-radius:12px 12px 0 0;background:linear-gradient(135deg,#dfe8ff,#9fbaff 45%,#0055ff 80%,#ff3d8b)}
.dts-grid.zoom .dts-box{height:300px}.dts-grid.zoom .dts-box canvas{position:absolute;right:0;bottom:0;width:auto;max-width:none}
.dts-grid.zoom.mid .dts-box canvas{right:auto;bottom:auto;left:50%;top:50%;transform:translate(-50%,-50%)}
.dts-pn figcaption{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px;font:11px 'Geist Mono',ui-monospace,monospace;color:var(--mute)}
.dts-pn figcaption span{margin-right:auto}
.dts-pn figcaption button{height:26px;padding:0 9px;border-radius:6px;border:1px solid var(--hair);background:#fff;font:500 11px 'Geist Mono',ui-monospace,monospace;color:var(--ink);cursor:pointer}
.dts-pn figcaption button:hover{border-color:#b9bec7}
.dts-pn figcaption button:disabled{opacity:.4;cursor:not-allowed}
.dt-bar .seed{font:12px 'Geist Mono',ui-monospace,monospace;min-width:28px;text-align:center}
.dts-note{font:12px/1.5 Geist,Inter,sans-serif;color:var(--ink2)}
@container (max-width: 900px){ .dts-grid.c4{grid-template-columns:repeat(2,minmax(0,1fr))} }
@container (max-width: 760px){ .dts-grid,.dts-grid.c4,.dts-grid.c2{grid-template-columns:1fr} }`;
  let styled = false;
  const ensure = () => { K().ensure(); if (!styled) { styled = true; document.head.appendChild(h('style', null, CSS)); } };

  /* ------------------------------------------------------------ inks */
  const pick = (st, g) => {
    const k = K(), [a, b] = (k.SPARSE_M[st.method] ? k.SPARSE : k.TONES)[st.tone][g.k];
    const o = { a, b }; const c = st.sec !== 'none' && k.SEC[st.sec] ? k.SEC[st.sec].s : null;
    if (c) Object.assign(o, k.secInks(c, g, st)); return [o, c];
  };
  /* background: field spec + table inks; hue from the def or a noise field */
  const bgInks = (spec) => (st, g) => { const [o, c] = pick(st, g); return Object.assign({}, spec, o, c ? { hue: spec.hue || { mode: 'noise', p: [1.1, .45, .72, 0] } } : {}); };

  /* ------------------------------------------------------------ render + export */
  function render(def, st, g, scale) {
    const k = K(), [W, H] = st.size, w = Math.round(W * scale), hh = Math.round(H * scale);
    const c = document.createElement('canvas'); c.width = w; c.height = hh; const ctx = c.getContext('2d');
    const spec = def.spec(st, g); spec.method = spec.method || st.method;
    spec.cell = spec.method === 'glyphs' ? GCELL[st.cellSize] : (spec.cell || k.BASE[spec.method] * SIZES[st.cellSize]) * (spec.cellMul || 1);
    if (spec.square) spec.cell = Math.max(1, Math.round(spec.cell));
    const mask = spec.maskFn ? spec.maskFn(w, hh, spec) : null;
    k.R.paint(ctx, w, hh, spec, st.seed * 3.7, scale, [0, 0, 0], mask);
    return { c, spec };
  }
  const withGround = (c, g) => { const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; const x = o.getContext('2d'); x.fillStyle = g.bg; x.fillRect(0, 0, o.width, o.height); x.drawImage(c, 0, 0); return o; };
  const toBlob = c => new Promise(r => c.toBlob(r, 'image/png'));
  function download(blob, name) { const u = URL.createObjectURL(blob); const a = h('a', { href: u, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
  const flash = (btn, txt) => { const t0 = btn.dataset.t || (btn.dataset.t = btn.textContent); btn.textContent = txt; setTimeout(() => { btn.textContent = t0; }, 1400); };
  /* square cells → one path per colour; rows count from the bottom, as in the shader */
  function glyphSvg(def, st, g) {
    const { spec } = render(def, st, g, 1); const W = st.size[0], H = st.size[1];
    const c = document.createElement('canvas'); c.width = W; c.height = H; const sp = Object.assign({}, spec, { codes: true });
    const mask = sp.maskFn ? sp.maskFn(W, H, sp) : null; K().R.paint(c.getContext('2d'), W, H, sp, st.seed * 3.7, 1, [0, 0, 0], mask);
    const px = c.getContext('2d').getImageData(0, 0, W, H).data; const ch = spec.cell, cw = ch * .62; const paths = new Map(); let n = 0;
    const inks = { a: colArg(spec.a), b: colArg(spec.b || spec.a), c: colArg(spec.c || spec.a), d: colArg(spec.d || spec.b || spec.a) };
    const f = v => +v.toFixed(2);
    for (let j = 0; j * ch < H; j++) for (let i = 0; i * cw < W; i++) {
      const cx = Math.min(W - 1, Math.floor(i * cw + cw / 2)), cy = Math.min(H - 1, Math.max(0, Math.floor(H - (j + .5) * ch)));
      const o = (cy * W + cx) * 4, idx = Math.round(px[o] / 255 * 12), hs = px[o + 1] > 127; if (!GLYPH[idx]) continue;
      const ink = idx >= 9 && idx <= 11 ? (hs ? inks.d : inks.b) : (hs ? inks.c : inks.a); const key = ink[0] + '|' + ink[1];
      const x0 = i * cw, y0 = H - (j + 1) * ch; let d = '';
      for (const poly of GLYPH[idx]) d += 'M' + poly.map(([x, y]) => f(x0 + x * ch) + ' ' + f(y0 + y * ch)).join('L') + 'Z';
      (paths.get(key) || paths.set(key, []).get(key)).push(d); n++;
    }
    let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    if (st.ground) out += `<rect width="${W}" height="${H}" fill="${g.bg}"/>`;
    for (const [k3, d] of paths) { const [fill, op] = k3.split('|'); out += `<path fill="${fill}"${+op < 1 ? ` fill-opacity="${op}"` : ''} d="${d.join('')}"/>`; }
    return { svg: out + '</svg>', runs: n };
  }
  function svgOf(def, st, g) {
    if ((def.spec(st, g).method || st.method) === 'glyphs') return glyphSvg(def, st, g);
    const s = Object.assign({}, st); const { c, spec } = render(def, s, g, 1); const cs = spec.cell, W = c.width, H = c.height;
    const px = c.getContext('2d').getImageData(0, 0, W, H).data; const paths = new Map(); let runs = 0;
    const key = (i) => { const a = px[i + 3]; if (a < 100) return null; return '#' + [px[i], px[i + 1], px[i + 2]].map(v => v.toString(16).padStart(2, '0')).join('') + (a < 245 ? '|' + (a / 255).toFixed(2) : ''); };
    const rows = Math.ceil(H / cs), cols = Math.ceil(W / cs);
    for (let j = 0; j < rows; j++) {
      const y1 = H - j * cs, y0 = Math.max(0, y1 - cs), sy = Math.min(H - 1, Math.max(0, Math.floor((y0 + y1) / 2)));
      let run = null, rx = 0;
      const flush = (x) => { if (run) { const w = Math.min(W, x) - rx; (paths.get(run) || paths.set(run, []).get(run)).push(`M${rx} ${y0}h${w}v${y1 - y0}h${-w}z`); runs++; } };
      for (let i = 0; i <= cols; i++) {
        const k2 = i < cols ? key((sy * W + Math.min(W - 1, Math.floor(i * cs + cs / 2))) * 4) : null;
        if (k2 !== run) { flush(i * cs); run = k2; rx = i * cs; }
      }
    }
    let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    if (st.ground) out += `<rect width="${W}" height="${H}" fill="${g.bg}"/>`;
    for (const [k3, d] of paths) { const [fill, op] = k3.split('|'); out += `<path fill="${fill}"${op ? ` fill-opacity="${op}"` : ''} d="${d.join('')}"/>`; }
    return { svg: out + '</svg>', runs };
  }

  /* ------------------------------------------------------------ card */
  function still(name, title, blurb, def) {
    DEMOS.register(name, {
      group: 'dts', title, blurb,
      mount(stage) {
        ensure(); const k = K();
        const st = Object.assign({ zoom: 'auto', method: 'bayer', cellSize: 'S', tone: 'tint', sec: 'none', seed: 1, size: def.sizes[0][0], scale: 2, ground: false }, def.init);
        (def.opts || []).forEach(o => { if (st[o.key] == null) st[o.key] = o.input ? (o.value || '') : o.values[0][0]; });
        const root = h('div', { class: 'dt' }); stage.appendChild(root);
        const bar = h('div', { class: 'dt-bar' }); root.appendChild(bar);
        const seg = (label, key, opts, swatch) => {
          bar.appendChild(h('b', null, label));
          for (const [v, l] of opts) bar.appendChild(h('button', { class: st[key] === v ? 'on' : '', 'data-k': key, 'data-i': String(opts.findIndex(o => o[0] === v)), style: swatch ? '--c:' + (swatch(v) || 'transparent') : '', onclick: () => { st[key] = v; bar.querySelectorAll('[data-k="' + key + '"]').forEach(b => b.classList.toggle('on', +b.dataset.i === opts.findIndex(o => o[0] === v))); draw(); } }, swatch && swatch(v) ? h('i') : null, l));
        };
        if (!def.fixedMethod) seg('Method', 'method', Object.entries(k.MLABEL).filter(([m]) => (def.methods || METHODS).includes(m)));
        seg('Cell', 'cellSize', [['S', 'S'], ['M', 'M'], ['L', 'L']]);
        if (!def.noTone) seg('Tone', 'tone', [['tint', 'Tint'], ['grey', 'Grey'], ['accent', 'Accent']]);
        seg('2nd colour', 'sec', [['none', 'None'], ...SEC2.map(kk => [kk, k.SEC[kk].label])], v => k.SEC[v] && k.SEC[v].s);
        for (const o of def.opts || []) {
          if (!o.input) { seg(o.label, o.key, o.values); continue; }
          bar.appendChild(h('b', null, o.label)); /* free text, e.g. a headline for a text mask */
          bar.appendChild(h('input', { class: 'dts-in', value: st[o.key], placeholder: o.placeholder || '', spellcheck: 'false', oninput: e => { st[o.key] = e.target.value; draw(); } }));
        }
        seg('Size', 'size', def.sizes.map(([s, l]) => [s, l + ' ' + s[0] + '×' + s[1]]));
        seg('Export', 'scale', [[1, '1×'], [2, '2×']]);
        seg('Ground', 'ground', [[false, 'Transparent'], [true, 'Filled']]);
        seg('Preview', 'zoom', [['auto', 'Auto'], [false, 'Fit'], [true, '1:1 corner']]);
        bar.appendChild(h('b', null, 'Seed'));
        const sd = h('span', { class: 'seed' }, String(st.seed));
        const setSeed = v => { st.seed = v; sd.textContent = v; draw(); };
        bar.append(h('button', { onclick: () => setSeed(Math.max(0, st.seed - 1)) }, '‹'), sd, h('button', { onclick: () => setSeed(st.seed + 1) }, '›'), h('button', { onclick: () => setSeed(1 + Math.floor(Math.random() * 999)) }, 'Shuffle'));

        const grid = h('div', { class: 'dts-grid' + (def.wide ? ' wide' : '') + (def.mid ? ' mid' : '') + (def.cols ? ' c' + def.cols : '') }); root.appendChild(grid); /* mid: 1:1 preview crops the centre */
        const fname = (g, ext) => `iframely-dither-${def.short}-${g.k}-${def.tag ? def.tag(st) : st.method}${st.sec !== 'none' ? '-' + st.sec : ''}-s${st.seed}-${st.size[0]}x${st.size[1]}${ext === 'png' ? '@' + st.scale + 'x' : ''}.${ext}`;
        /* a card may bring its own renderer (def.render → canvas, def.svg → { svg, runs }), e.g. the type pass in dither-stills2.js */
        const paint = (g, scale) => (def.render ? def.render(st, g, scale) : render(def, st, g, scale).c);
        const vector = g => (def.svg ? def.svg(st, g) : svgOf(def, st, g));
        const cells = (def.grounds || k.GROUNDS).map(g => {
          const box = h('div', { class: 'dts-box', style: 'background:' + g.bg });
          const svgOK = () => (def.svg ? true : !!SVGABLE[def.spec(st, g).method || st.method]);
          const pngC = async () => { const c = paint(g, st.scale); return st.ground ? withGround(c, g) : c; };
          const bCopy = h('button', { onclick: async e => { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngC().then(toBlob) })]); flash(e.target, 'copied ✓'); } catch (err) { console.warn(err); flash(e.target, 'blocked: use PNG ↓'); } } }, 'Copy PNG');
          const bPng = h('button', { onclick: async () => download(await toBlob(await pngC()), fname(g, 'png')) }, 'PNG ↓');
          const bCopyS = h('button', { onclick: async e => { const { svg, runs } = vector(g); try { await navigator.clipboard.writeText(svg); flash(e.target, 'copied ✓ ' + runs + (def.svg ? ' layers' : ' runs')); } catch (err) { flash(e.target, 'blocked: use SVG ↓'); } } }, 'Copy SVG');
          const bSvg = h('button', { onclick: () => { const { svg } = vector(g); download(new Blob([svg], { type: 'image/svg+xml' }), fname(g, 'svg')); } }, 'SVG ↓');
          const cap = h('span', null, g.label);
          grid.appendChild(h('figure', { class: 'dts-pn' }, box, h('figcaption', null, cap, bCopy, bPng, bCopyS, bSvg)));
          return { g, box, cap, bCopyS, bSvg, svgOK };
        });
        const extra = def.after ? h('div', { class: 'dts-extra' }) : null; if (extra) root.appendChild(extra); /* def.after(st, el): a usage preview under the exports */
        root.appendChild(h('div', { class: 'dts-note' }, def.note || 'Copy PNG pastes straight into Figma. Copy SVG pastes as vectors, one path per ink: Bayer cells merged into horizontal runs, glyphs as drawn outlines of . : / < > (close to JetBrains Mono, not the font itself). Exports are the ink layer on a transparent ground unless Ground is set to Filled; 2× doubles the pixels, not the cell size.'));
        let raf = 0;
        function draw() {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            /* Auto: glyphs at real size (scaled down they read as dots), other methods fitted; wide strips always fit */
            grid.classList.toggle('zoom', st.zoom === 'auto' ? st.method === 'glyphs' && !def.wide : !!st.zoom);
            for (const cl of cells) {
              if (def.reground) { const r = def.reground(st, cl.g); if (r) { Object.assign(cl.g, r); cl.box.style.background = cl.g.bg; cl.cap.textContent = cl.g.label; } } /* a control may recolour a ground (product colour, tint) */
              const c = paint(cl.g, 1); cl.box.replaceChildren(...(def.under ? [cl.under || (cl.under = def.under(cl.g))] : []), c);
              const ok = cl.svgOK(); cl.bCopyS.disabled = cl.bSvg.disabled = !ok; cl.bSvg.title = ok ? '' : 'SVG needs Bayer or glyphs';
            }
            if (extra) def.after(st, extra);
          });
        }
        if (!k.R.init()) { root.appendChild(h('div', { class: 'fallback' }, 'WebGL2 is not available in this browser.')); return () => {}; }
        draw(); k.fontsReady.then(draw);
        return () => cancelAnimationFrame(raf);
      },
    });
  }

  const BG_SIZES = [[[1440, 800], 'Hero'], [[1200, 600], 'Section'], [[1200, 630], 'OG'], [[600, 400], 'Card'], [[800, 800], 'Square']];
  const bg = (name, short, title, blurb, spec, init) => still(name, title, blurb, { short, sizes: BG_SIZES, spec: bgInks(spec), init });

  bg('dts-corner', 'corner', 'Corner glow', 'Radial glow from the top-right corner, noise-broken. Seed moves the glow and the noise.',
    { field: 'radial', p: [1.02, 1.05, 1.15, 1.5], q: [.28, .25, 0, 0], two: .55, hue: { mode: 'linear', p: [-2.2, .5, .78, 0] } });
  bg('dts-grain', 'grain', 'Grain wash', 'Diagonal wash to the bottom right.',
    { field: 'linear', p: [-.6, .28, 1.08, 0], q: [.35, .15, 0, 0], two: .7, hue: { mode: 'linear', p: [-1.57, .42, .78, 0] } }, { method: 'glyphs' });
  bg('dts-clouds', 'clouds', 'Noise clouds', 'fbm clouds weighted to the right and bottom; every seed is a different sky.',
    { field: 'clouds', p: [1.6, .34, .78, .85], q: [0, .6, 0, 0], two: .62 }, { cellSize: 'M' });
  bg('dts-blobs', 'blobs', 'Soft blobs', 'Four metaballs; the seed sets where they sit.',
    { field: 'blobs', p: [.3, .38, 1.35, 0], q: [0, .6, 0, 0], two: .62 });
  bg('dts-arch', 'arch', 'Horizon arch', 'Glow from below the bottom edge with faint rings.',
    { field: 'arch', p: [.12, .22, 1.2, 26], q: [.1, .4, 0, 0], two: .7 }, { method: 'glyphs' });
  bg('dts-waves', 'waves', 'Waves', 'Diagonal bands bent by noise.',
    { field: 'bands', p: [.6, 9, .85, 0], q: [0, .5, 0, 0], two: .7 }, { cellSize: 'M', tone: 'grey' });
  bg('dts-shapes', 'shapes', 'Soft shapes', 'Circle, slash and half ring, each with a dithered gradient.',
    { field: 'shapes', p: [1, 0, 0, 0], q: [0, .5, 0, 0], two: .7 });
  bg('dts-glyphs', 'glyphs', '//:<> glyph field', 'The gradient written in . : / < > and a heavy / in the second ink.',
    { field: 'radial', p: [.98, .02, 1.45, 1.1], q: [.3, .3, 0, 0], two: .8 }, { method: 'glyphs' });

  /* ------------------------------------------------------------ accents */
  const acc = (name, short, title, blurb, def) => still(name, title, blurb, Object.assign({ short, mid: !/corner|dissolve|marker|band/.test(short) }, def, { spec: def.specFn ? def.specFn : bgInks(def.spec) }));
  acc('dts-slash', 'slash', 'The // mark', 'Two parallelograms with a dithered gradient, dense at the foot. With a second colour the top half turns.',
    { sizes: [[[800, 800], 'Square'], [[600, 800], 'Tall'], [[400, 400], 'Small']], spec: { field: 'slashes', p: [.5, .5, .4, .004], q: [0, 0, 0, .12], r: [1, 0, 0, 0], two: .45, cellMul: 1.5, hue: { mode: 'linear', p: [1.5708, .42, .62, 0] } } });
  acc('dts-chevrons', 'chevrons', '< > brackets', 'Brackets dissolving outwards from the middle, room for a card between them. With a second colour, > takes it.',
    { sizes: [[[1200, 600], 'Wide'], [[800, 400], 'Small']], spec: { field: 'chevrons', p: [.5, .5, .38, .004], q: [0, 0, 0, .15], r: [1, 0, 1.0, 0], two: .5, cellMul: 1.5, hue: { mode: 'linear', p: [0, .49, .51, 0] } } });
  acc('dts-orb', 'orb', 'Orb', 'Lit sphere with an orbit ring and dotted shadow. Seed moves the light.',
    { sizes: [[[800, 800], 'Square'], [[1000, 800], 'Wide']], spec: { field: 'sphere', p: [.5, .52, .26, 0], q: [0, 1, 0, 0], r: [.7, .1, 0, 0], two: .55, hue: { mode: 'linear', p: [-.75, .55, .72, 0] } } });
  /* product symbols in their own colours, masked from JetBrains Mono */
  acc('dts-symbols', 'symbol', 'Product symbols', 'A product symbol dithered in its colour over a faint cloud texture. Pick the product; the tone switch sets how much texture there is.',
    {
      sizes: [[[600, 400], 'Header'], [[400, 400], 'Square']], init: { tone: 'tint' },
      opts: [{ key: 'prod', label: 'Product', values: DEMOS.ditherKit ? DEMOS.ditherKit.PROD.map((p, i) => [i, p.name]) : [[0, 'Rich Media']] }],
      specFn: (st, g) => {
        const k = K(), pr = k.PROD[st.prod || 0], onBlue = g.k === 'blue';
        const c2 = st.sec !== 'none' && k.SEC[st.sec] ? k.SEC[st.sec].s : null; let box = [0, 1];
        const spec = { field: 'clouds', p: [2.2, .42, .9, .6], q: [0, .4, 0, 0], method: st.method, two: .55, gain: st.tone === 'grey' ? 0 : st.tone === 'accent' ? .75 : .5,
          a: onBlue ? k.mixHex(k.BLUE, '#ffffff', .3) : k.tint(pr.c, .78), b: onBlue ? '#ffffff' : pr.c, maskMode: 2, mg: 1, mgy: 1 };
        if (c2) Object.assign(spec, { c: spec.a, d: onBlue ? k.mixHex('#ffffff', c2, .45) : c2, hue: { mode: 'linear', p: [1.5708, .45, .6, 0] } });
        spec.maskFn = (w, hh, sp) => { const m = document.createElement('canvas'); m.width = w; m.height = hh; const x = m.getContext('2d'); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.font = `800 ${Math.round(hh * .62)}px "JetBrains Mono", monospace`; const y = hh * .74; x.fillText(pr.sym, w / 2, y); const mt = x.measureText(pr.sym); sp.mbox = [1 - (y + mt.actualBoundingBoxDescent) / hh, 1 - (y - mt.actualBoundingBoxAscent) / hh]; m._v = 1; return m; };
        return spec;
      },
    });
  /* transitions: ink is the "to" colour, the preview ground is the "from" colour */
  const TO = { blue: '#0055ff', grey: '#f6f6f6', white: '#ffffff' };
  acc('dts-band', 'band', 'Transition band', 'A strip that dithers one section colour into the next and fully covers at its bottom edge: place it at the seam. Each preview shows the "from" ground; pick the "to" colour. In glyphs the mono characters thicken row by row and the last row turns solid.',
    {
      sizes: [[[1440, 80], '1440'], [[1440, 120], 'Tall'], [[1440, 200], 'Glyph'], [[1200, 56], '1200']], wide: true, noTone: true, init: { cellSize: 'L' }, methods: ['bayer', 'glyphs'],
      opts: [{ key: 'to', label: 'To', values: [['blue', 'Blue'], ['grey', 'Grey'], ['white', 'White']] }],
      specFn: (st, g) => { const k = K(), c2 = st.sec !== 'none' && k.SEC[st.sec] ? k.SEC[st.sec].s : null, to = TO[st.to || 'blue'], gl = st.method === 'glyphs';
        return Object.assign({ field: 'linear', p: [-Math.PI / 2, gl ? -.1 : .02, .98, 0], q: [gl ? .1 : .25, .2, 0, 0], method: st.method, a: to, b: to, two: gl ? .7 : 1, solid: gl ? .95 : 2 }, c2 ? { c: c2, d: c2, hue: { mode: 'noise', p: [2.2, .55, .7, 0] } } : {}); },
    });
  acc('dts-marker', 'marker', 'Marker strip', 'A highlighter stroke, ragged and dissolving at both ends, to put behind a word.',
    { sizes: [[[600, 80], 'Long'], [[320, 64], 'Word']], init: { tone: 'tint' }, spec: { field: 'bar', p: [0, .55, 1.0, .72], q: [.35, .3, 0, 0], two: .78, hue: { mode: 'all' } } });
  acc('dts-cornerpiece', 'corner-piece', 'Corner piece', 'A dithered corner for a CTA card or a block, radiating from the bottom right.',
    { sizes: [[[800, 600], 'Card'], [[600, 600], 'Square']], init: { method: 'glyphs', cellSize: 'M' }, spec: { field: 'radial', p: [1.02, -.05, 1.0, 1.3], q: [.3, .35, 0, 0], two: .78 } });
  acc('dts-dissolve', 'dissolve', 'Dissolve overlay', 'A layer in the ground colour to lay over the bottom of a screenshot or card so it dissolves into the page. The export is only that layer (invisible on its own ground); the preview puts a sample image under it.',
    {
      sizes: [[[1200, 400], 'Wide'], [[800, 400], 'Medium']], noTone: true, init: { cellSize: 'M' }, methods: ['bayer', 'glyphs'],
      under: () => h('div', { class: 'dts-under' }),
      specFn: (st, g) => ({ field: 'linear', p: [-Math.PI / 2, .08, .9, 0], q: [.18, .25, 0, 0], method: st.method, a: g.bg, solid: st.method === 'glyphs' ? .9 : 2 }),
    });

  /* icons as masks, filled with the dither (glyphs by default): play, player, embed, JSON, link, card.
     Drawn in a unit box; text icons step out of the scale and draw in pixels (fractional font sizes are unreliable). */
  const monoText = (x, txt, size) => { const t = x.getTransform(), S = t.a; x.setTransform(1, 0, 0, 1, t.e, t.f); x.font = `800 ${Math.round(size * S)}px "JetBrains Mono", monospace`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, .5 * S, .53 * S); x.setTransform(t); };
  const ICONS = {
    play: x => { x.beginPath(); x.moveTo(.24, .08); x.lineTo(.9, .5); x.lineTo(.24, .92); x.closePath(); x.fill(); },
    player: x => {
      x.beginPath(); x.roundRect(0, .1, 1, .64, .08); x.fill();
      x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(.42, .27); x.lineTo(.64, .42); x.lineTo(.42, .57); x.closePath(); x.fill();
      x.globalCompositeOperation = 'source-over'; x.beginPath(); x.roundRect(0, .84, .46, .06, .03); x.fill();
      x.globalAlpha = .4; x.beginPath(); x.roundRect(.46, .84, .54, .06, .03); x.fill(); x.globalAlpha = 1;
    },
    embed: x => monoText(x, '</>', .5),
    json: x => monoText(x, '{ }', .62),
    link: x => {
      x.lineWidth = .11; x.translate(.5, .5); x.rotate(-Math.PI / 4);
      x.beginPath(); x.roundRect(-.5, -.17, .56, .34, .17); x.stroke(); x.beginPath(); x.roundRect(-.06, -.17, .56, .34, .17); x.stroke();
    },
    card: x => {
      x.lineWidth = .05; x.beginPath(); x.roundRect(.025, .06, .95, .88, .07); x.stroke();
      x.beginPath(); x.roundRect(.12, .16, .76, .38, .04); x.fill();
      x.globalAlpha = .65; x.fillRect(.12, .64, .56, .07); x.globalAlpha = .4; x.fillRect(.12, .77, .4, .06); x.globalAlpha = 1;
    },
  };
  acc('dts-icons', 'icon', 'Icons in glyphs', 'Product icons (play, player, embed, JSON, link, preview card) as masks filled with the dither, dense at the foot and dissolving upwards, over an optional cloud texture. Glyphs by default; Bayer for a pixel look.',
    {
      sizes: [[[600, 600], 'Square'], [[800, 600], 'Card'], [[400, 400], 'Small']], init: { method: 'glyphs', cellSize: 'S', tone: 'accent' },
      opts: [{ key: 'icon', label: 'Icon', values: Object.keys(ICONS).map(n => [n, n === 'json' ? 'JSON' : n[0].toUpperCase() + n.slice(1)]) }, { key: 'tex', label: 'Texture', values: [[false, 'Off'], [true, 'On']] }],
      specFn: (st, g) => {
        const [o, c] = pick(st, g);
        const spec = Object.assign({ field: 'clouds', p: [2.2, .42, .9, .6], q: [0, .4, 0, 0], method: st.method, two: .55, gain: st.tex ? .4 : 0, maskMode: 2, mg: 1, mgy: .55 }, o, c ? { hue: { mode: 'linear', p: [1.5708, .45, .62, 0] } } : {});
        spec.maskFn = (w, hh, sp) => {
          const m = document.createElement('canvas'); m.width = w; m.height = hh; const x = m.getContext('2d'); const S = Math.min(w, hh) * .62, x0 = (w - S) / 2, y0 = (hh - S) / 2;
          x.fillStyle = x.strokeStyle = '#fff'; x.save(); x.translate(x0, y0); x.scale(S, S); ICONS[st.icon](x); x.restore();
          sp.mbox = [1 - (y0 + S) / hh, 1 - y0 / hh]; m._v = 1; return m;
        };
        return spec;
      },
    });

  /* user picks, 2026-11-05 review (their F numbers were before the duplicate-name fix: F01 = corner piece, F15 = dissolve).
     Also picked: Bayer + glyphs as the methods, pink + violet as second colours. */
  const PICKS = { 'dts-cornerpiece': 'pick', 'dts-grain': 'pick', 'dts-clouds': 'pick', 'dts-glyphs': 'pick', 'dts-shapes': 'pick · more glyphs', 'dts-slash': 'pick · glyph/icon variant', 'dts-symbols': 'pick · glyph/icon variant', 'dts-band': 'pick · mono glyphs' };
  for (const [n, why] of Object.entries(PICKS)) { const d = DEMOS.get(n); if (d) d.pick = why; }

  /* shared with demos/dither-stills2.js (round 3: the type pass and the product sets) */
  DEMOS.stillsKit = { still, render, svgOf, pick, bgInks, download, toBlob, withGround, flash, colArg, ICONS, GLYPH, GCELL, SIZES, SEC2, METHODS, BG_SIZES };
})();
