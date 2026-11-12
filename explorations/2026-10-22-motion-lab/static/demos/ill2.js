/* ill-style-* · the same four product features drawn in five more styles, after reference images the user shared:
   windows (Paper: grid paper, mono windows with solid offset shadows, ASCII art), isometric desks (Palantir Foundry: hatched
   slabs, frontal monitors, dotted wire bundles into pills), orbits (Weave: loops through a hub, mono pills), soft UI
   (a product card on a lilac stage over a gradient) and outline bricks (isometric line bricks on soft cards).
   One card per product page: Hosted iframes, Summary cards, Five processing modes, Publisher Console / purpose.
   Static SVG, viewBox 480 × 320, each card copies its markup. Group 'ill', mount(stage). */
(() => {
  const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace", SANS = 'Inter, system-ui, sans-serif';
  const INK = '#0a0a0a', BLUE = '#0055ff';
  const svg = (inner, defs = '') => `<svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" font-family="${MONO}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 13}"${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.c || INK}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.f ? ` font-family="${o.f}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}${o.st ? ` stroke="${o.st}" stroke-width="${o.sw || 1}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''}>${s}</text>`;
  const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.r ? ` rx="${o.r}"` : ''} fill="${o.f || 'none'}"${o.s ? ` stroke="${o.s}" stroke-width="${o.sw || 1.5}"` : ''}${o.da ? ` stroke-dasharray="${o.da}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}/>`;
  const P = (d, o = {}) => `<path d="${d}" fill="${o.f || 'none'}"${o.s !== null ? ` stroke="${o.s || INK}" stroke-width="${o.w || 1.5}"` : ''}${o.da ? ` stroke-dasharray="${o.da}"` : ''} stroke-linecap="${o.cap || 'round'}" stroke-linejoin="round"${o.op ? ` opacity="${o.op}"` : ''}/>`;
  const C = (x, y, r, o = {}) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.f || INK}"${o.s ? ` stroke="${o.s}" stroke-width="${o.sw || 1.5}"` : ''}/>`;
  const poly = (pts, o = {}) => `<polygon points="${pts.map(p => p.map(v => +v.toFixed(1)).join(',')).join(' ')}" fill="${o.f || '#fff'}" stroke="${o.s || INK}" stroke-width="${o.w || 1.3}" stroke-linejoin="round"/>`;
  const slash2 = (cx, cy, h, c = BLUE) => { const sw = h * .2, gap = h * .2, tilt = h * .36, x0 = cx - (sw * 2 + gap + tilt) / 2, q = x => [[x + tilt, cy - h / 2], [x + tilt + sw, cy - h / 2], [x + sw, cy + h / 2], [x, cy + h / 2]]; return poly(q(x0), { f: c, s: c, w: .1 }) + poly(q(x0 + sw + gap), { f: c, s: c, w: .1 }); };
  /* tiny deterministic noise for the ASCII pictures */
  const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

  /* ---------------- A · windows (after Paper) ---------------- */
  const A = (() => {
    const SH = '#8fb3ef', LINE = '#7fa3e6';
    const bg = id => R(0, 0, 480, 320, { f: '#f4f7fd' }) + `<rect width="480" height="320" fill="url(#${id})"/>`;
    const grid = id => `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#d6e2f7" stroke-width="1"/></pattern>`;
    const win = (x, y, w, h, title, inner, o = {}) =>
      R(x + 5, y + 5, w, h, { f: o.dark ? INK : SH }) + R(x, y, w, h, { f: '#f7f7f4', s: o.dark ? INK : LINE, sw: o.dark ? 2 : 1.5 })
      + (o.dark ? R(x + 3, y + 3, w - 6, h - 6, { s: INK, sw: 1 }) : '')
      + (title ? P(`M${x} ${y + 30}h${w}`, { s: o.dark ? INK : '#c9d8f3', w: 1 }) + t(x + 12, y + 20, title, { s: 13 }) + (o.close === false ? '' : t(x + w - 14, y + 20, '×', { s: 15, a: 'middle' })) : '')
      + inner;
    const btn = (x, y, w, s) => R(x + 4, y + 4, w, 32, { f: SH }) + R(x, y, w, 32, { f: '#f7f7f4', s: LINE }) + t(x + 14, y + 21, s, { s: 13 });
    /* ASCII picture: f(u,v) → 0..1 density, drawn with a glyph ramp */
    const ascii = (x, y, cols, rows, f, o = {}) => { const ramp = o.ramp || ' .:-=+*#QG', cw = o.cw || 6.6, lh = o.lh || 9; let s = ''; for (let r = 0; r < rows; r++) { let line = ''; for (let c = 0; c < cols; c++) { const v = clamp01(f(c / (cols - 1), r / (rows - 1)) + (hash(c, r) - .5) * .18); line += ramp[Math.round(v * (ramp.length - 1))]; } s += `<text x="${x}" y="${y + r * lh}" font-size="${o.fs || 9}" fill="${o.c || INK}" xml:space="preserve" letter-spacing="${o.ls || 1.2}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`; } return s; };
    const clamp01 = v => Math.max(0, Math.min(1, v));
    return {
      embed(id) {
        const play = (u, v) => { const x = (u - .5) * 1.6, y = (v - .5) * 1.2; const inTri = x > -.35 && x < .45 && Math.abs(y) < (.45 - x) * .62; const ring = Math.abs(Math.hypot(x, y) - .62); return inTri ? .95 : ring < .05 ? .55 : 0; };
        return svg(bg(id) + win(36, 36, 250, 230, 'player.html', ascii(52, 84, 34, 19, play, { c: BLUE }))
          + win(258, 150, 190, 112, 'x7Kd2.id', t(272, 206, 'src=<tspan fill="' + BLUE + '" font-weight="800">//</tspan>cdn.iframe.ly/', { s: 11 }) + t(272, 244, 'x7Kd2', { s: 28, w: 700 }))
          + btn(312, 52, 136, 'Copy embed ↗'), grid(id));
      },
      card(id) {
        const pic = (u, v) => { const sun = Math.hypot(u - .68, v - .32) < .16 ? .9 : 0; const hill = v > .62 + .14 * Math.sin(u * 7) ? .55 + .3 * v : 0; return Math.max(sun, hill, .08); };
        return svg(bg(id) + win(32, 44, 210, 236, 'card.preview', ascii(46, 90, 28, 11, pic, { c: '#3f5f9f' }) + t(46, 210, 'Kerala · Bonobo', { s: 13, w: 700 }) + t(46, 230, 'open.spotify.com', { s: 11, c: '#7a7a7a' }) + R(46, 244, 150, 5, { f: '#dfe6f2', r: 2.5 }) + R(46, 256, 110, 5, { f: '#dfe6f2', r: 2.5 }))
          + win(262, 38, 186, 92, 'fetch', R(276, 84, 112, 14, { f: INK }) + t(396, 96, '100%', { s: 12 }) + t(276, 118, 'sent.', { s: 13 }), { dark: true })
          + win(270, 156, 178, 128, 'og.tags', ['og:title', 'og:image', 'og:site_name', 'og:audio'].map((k, i) => t(284, 206 + i * 20, `<tspan fill="${BLUE}">${k}</tspan>`, { s: 12 })).join('')), grid(id));
      },
      modes(id) {
        return svg(bg(id) + win(28, 36, 170, 248, '{}.glyph', t(113, 214, '{}', { s: 128, a: 'middle', c: 'none', st: INK, sw: 1.2, w: 300 }))
          + win(220, 50, 230, 140, 'kerala.md', t(234, 104, '# Kerala', { s: 14, w: 800 }) + t(234, 128, '&gt; a quiet, looping single', { s: 11 }) + t(234, 150, `[<tspan fill="${BLUE}">Migration</tspan>](…)`, { s: 11 }) + t(234, 172, '- Bonobo, 2017', { s: 11, c: '#7a7a7a' }))
          + win(238, 212, 212, 76, 'mode=', t(252, 262, `meta links entities excerpt <tspan fill="${BLUE}" font-weight="700">fulltext</tspan>`, { s: 9.5 })), grid(id));
      },
      purpose(id) {
        return svg(bg(id) + win(26, 34, 214, 150, 'robots.txt', t(40, 86, 'User-agent: *', { s: 12 }) + t(40, 106, 'Allow: /', { s: 12 }) + t(40, 138, `<tspan fill="${BLUE}">Purpose:</tspan> embed,`, { s: 12 }) + t(40, 156, '         preview, read', { s: 12 }))
          + win(56, 206, 200, 84, 'llms.txt', t(70, 256, '# example.com', { s: 12, w: 700 }) + t(70, 274, '&gt; what we publish', { s: 11, c: '#7a7a7a' }))
          + win(272, 30, 176, 262, '//.glyph', slash2(360, 170, 170, '#7ea6f0')), grid(id));
      },
    };
  })();

  /* ---------------- B · isometric desks (after Palantir Foundry) ---------------- */
  const B = (() => {
    const iso = (ox, oy) => (x, y, z) => [ox + (x - y) * .866, oy + (x + y) * .5 - z];
    const hatch = id => `<pattern id="${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="#8a8a8a" stroke-width="1"/></pattern>`;
    const slab = (ox, oy, W, D, T, id) => { const p = iso(ox, oy); return poly([p(0, D, T), p(W, D, T), p(W, D, 0), p(0, D, 0)], { f: `url(#${id})`, w: 1 }) + poly([p(W, 0, T), p(W, D, T), p(W, D, 0), p(W, 0, 0)], { f: `url(#${id})`, w: 1 }) + poly([p(0, 0, T), p(W, 0, T), p(W, D, T), p(0, D, T)], { w: 1.1 }); };
    const mon = (x, y, w, h, inner) => P(`M${x + w / 2} ${y + h}v9`, { w: 1.1 }) + R(x + w / 2 - 16, y + h + 9, 32, 3, { f: '#fff', s: INK, sw: 1 })
      + R(x, y, w, h, { f: '#fff', s: INK, sw: 1.1 }) + P(`M${x} ${y + 11}h${w}`, { w: .8 }) + t(x + w - 16, y + 8.5, '– ×', { s: 7 }) + R(x + 4, y + 3, 14, 2, { f: '#d0d0d0' }) + R(x + 4, y + 6.5, 10, 2, { f: '#d0d0d0' }) + inner;
    const pill = (x, y, s) => { const w = s.length * 7 + 18; return R(x - w / 2, y - 9, w, 18, { f: '#fff', s: INK, sw: 1, r: 9 }) + t(x, y + 3.5, s, { s: 9.5, a: 'middle', w: 500 }); };
    /* a bundle of dotted wires from the slab's two front bottom edges down to the pills */
    const wires = (p, W, D, pills) => { let s = ''; const N = 14; for (let i = 0; i < N; i++) { const k = i / (N - 1), a = k < .5 ? p(0 + W * 0, D * (1 - k * 2) * 0 + D, 0) : null; const [sx, sy] = k <= .5 ? p(W * k * 2 * .98 + 2, D, 0) : p(W, D * (1 - (k - .5) * 2) * .98, 0); const tg = pills[Math.min(pills.length - 1, Math.floor(k * pills.length))]; s += P(`M${sx.toFixed(1)} ${sy.toFixed(1)}C${sx.toFixed(1)} ${(sy + 40).toFixed(1)} ${tg[0]} ${tg[1] - 50} ${tg[0]} ${tg[1] - 10}`, { w: .9, da: '1.5 3.5' }) + C(sx, sy + 3, 1.6); } return s; };
    const head = (s, y = 34) => t(240, y, s, { s: 17, a: 'middle', ls: 2, w: 500 });
    const scene = (id, label, inner, pills) => { const ox = 212, oy = 112, W = 190, D = 100, p = iso(ox, oy); const pp = pills.map((s, i) => [Math.round(240 + (i - (pills.length - 1) / 2) * Math.min(86, 400 / pills.length)), 296, s]); return svg(R(0, 0, 480, 320, { f: '#f1f1f1' }) + head(label) + wires(p, W, D, pp) + slab(ox, oy, W, D, 9, id) + inner + pp.map(([x, y, s]) => pill(x, y, s)).join(''), hatch(id)); };
    const check = (x, y) => R(x, y, 16, 10, { f: '#cddcff', s: INK, sw: .8 }) + P(`M${x + 5} ${y + 5}l2.5 2.5 4-4`, { w: 1, s: BLUE });
    return {
      embed: id => scene(id, 'RICH MEDIA', mon(150, 70, 92, 66, R(156, 86, 80, 44, { f: INK }) + `<path d="M190 100l14 8-14 8z" fill="#fff"/>`) + mon(236, 86, 96, 70, check(244, 102) + t(266, 111, 'x7Kd2', { s: 9, w: 700 }) + R(244, 120, 80, 4, { f: '#e2e2e2' }) + R(244, 130, 60, 4, { f: '#e2e2e2' }) + R(244, 140, 70, 4, { f: '#e2e2e2' })), ['iframe', 'player', 'card', 'oEmbed']),
      card: id => scene(id, 'PREVIEW API', [0, 1, 2].map(i => mon(132 + i * 74, 76 + (i % 2) * 10, 66, 58, R(138 + i * 74, 92 + (i % 2) * 10, 22, 16, { f: i === 1 ? '#cddcff' : '#e6e6e6' }) + R(164 + i * 74, 93 + (i % 2) * 10, 32, 4, { f: INK }) + R(164 + i * 74, 101 + (i % 2) * 10, 24, 3, { f: '#bbb' }) + R(138 + i * 74, 114 + (i % 2) * 10, 54, 3, { f: '#e2e2e2' }) + (i === 1 ? check(176 + 74 - 74 + i * 74 - 0, 116 + 10) : ''))).join(''), ['API', 'API', 'API', 'API']),
      modes: id => scene(id, 'DATA API', mon(176, 62, 128, 84, R(232, 80, 18, 10, { f: '#cddcff', s: INK, sw: .8 }) + P('M241 90v8M196 98h90M196 98v8M226 98v8M256 98v8M286 98v8', { w: .8 }) + ['meta', 'links', 'ent', 'md'].map((s, i) => R(185 + i * 30, 106, 24, 10, { f: i === 3 ? '#cddcff' : '#fff', s: INK, sw: .8 }) + t(197 + i * 30, 113.5, s, { s: 5.5, a: 'middle' })).join('') + R(186, 124, 108, 3, { f: '#e2e2e2' }) + R(186, 132, 80, 3, { f: '#e2e2e2' })), ['meta', 'links', 'entities', 'excerpt', 'fulltext']),
      purpose: id => scene(id, 'PUBLISHERS', mon(150, 74, 100, 66, [26, 18, 11, 4].map((v, i) => R(160, 92 + i * 10, v * 2.6, 6, { f: i === 2 ? BLUE : i === 3 ? '#e2e2e2' : INK })).join('')) + mon(246, 84, 86, 70, t(254, 108, 'robots.txt', { s: 7.5, w: 700 }) + t(254, 122, 'Allow: /', { s: 7 }) + t(254, 134, 'Purpose:', { s: 7, c: BLUE }) + t(254, 145, 'embed, read', { s: 7 })), ['embed', 'preview', 'data']),
    };
  })();

  /* ---------------- C · orbits (after Weave) ---------------- */
  const Corb = (() => {
    const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
    const cx = 240, cy = 160;
    const pill = (x, y, s) => { const w = s.length * 7.8 + 30; return R(x - w / 2, y - 15, w, 30, { f: '#ebe8e3', s: '#d9d5cf', sw: 1, r: 15 }) + t(x, y + 4.5, s, { s: 12.5, a: 'middle', c: '#2e2e2e' }); };
    const scene = labels => {
      let s = R(0, 0, 480, 320, { f: '#f4f2ef' });
      const loops = [[46, 92], [118, 110], [186, 122]];
      for (const side of [-1, 1]) loops.forEach(([Rr, b], k) => {
        const segs = [[[cx, cy], [cx + side * Rr * .22, cy - b * 1.35], [cx + side * Rr, cy - b], [cx + side * Rr, cy]], [[cx + side * Rr, cy], [cx + side * Rr, cy + b], [cx + side * Rr * .22, cy + b * 1.35], [cx, cy]]];
        s += P(`M${cx} ${cy}` + segs.map(g => `C${g[1].join(' ')} ${g[2].join(' ')} ${g[3].join(' ')}`).join(''), { s: '#9c978f', w: .8 });
        segs.forEach((g, j) => [.18, .47, .76].forEach((u, q) => { if (hash(k * 3 + j + side, q) < .7) { const [x, y] = bez(...g, u); s += C(x.toFixed(1), y.toFixed(1), 1.8, { f: '#2a2a2a' }); } }));
      });
      /* spokes from the hub to the outer pills */
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sy]) => { s += P(`M${cx} ${cy}Q${cx + sx * 90} ${cy + sy * 40} ${cx + sx * 186} ${cy + sy * 62}`, { s: '#9c978f', w: .8 }); });
      s += C(cx, cy, 30, { f: '#efe9e6', s: '#d6cfc9', sw: 1 }) + slash2(cx, cy, 24);
      const pos = [[60, cy - 62], [60, cy + 62], [122, cy], [420, cy - 62], [420, cy + 62], [358, cy]];
      labels.forEach((l, i) => { s += pill(pos[i][0], pos[i][1], l); });
      return svg(s);
    };
    return {
      embed: () => scene(['youtube', 'tiktok', 'figma', 'iframe', 'card', 'player']),
      card: () => scene(['og:tags', 'oembed', 'html', 'title', 'image', 'site']),
      modes: () => scene(['page', 'pdf', 'video', 'meta', 'entities', 'fulltext']),
      purpose: () => scene(['embed-bot', 'data-bot', 'preview', 'robots', 'llms.txt', 'purpose']),
    };
  })();

  /* ---------------- D · soft UI (after the Notetaker card) ---------------- */
  const D = (() => {
    const defs = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b5fc8"/><stop offset=".35" stop-color="#9b80df"/><stop offset=".7" stop-color="#a9c2f3"/><stop offset="1" stop-color="#d6efe4"/></linearGradient><filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#3a2a80" flood-opacity=".12"/></filter>`;
    const bars = (x0, dir) => [52, 34, 70, 44, 58, 30].map((h, i) => R(x0 + dir * i * 17, 160 - h / 2, 12, h, { f: '#d6c8fb', r: 6 })).join('');
    const frame = (id, inner) => svg(`<rect width="480" height="320" fill="url(#${id})"/>` + R(22, 22, 436, 276, { f: '#fbfaf7', r: 22 }) + R(40, 40, 400, 240, { f: '#ebe5fb', r: 18 }) + bars(52, 1) + bars(416, -1) + `<g filter="url(#${id}s)">` + R(112, 64, 256, 192, { f: '#fff', r: 14 }) + '</g>' + inner, defs(id));
    const lines = (x, y, ws, bar = true) => (bar ? R(x, y - 4, 2.5, ws.length * 13 + 2, { f: '#b9a3f5', r: 1 }) : '') + ws.map((w, i) => C(x + 12, y + 3 + i * 13, 2, { f: '#d9d9de' }) + R(x + 20, y + i * 13, w, 6, { f: '#e9e9ee', r: 3 })).join('');
    const h = (x, y, s, o = {}) => t(x, y, s, Object.assign({ f: SANS, s: 12, w: 600, c: '#15172b' }, o));
    const badge = (x, y, n) => C(x, y, 7, { f: '#ece6fd' }) + t(x, y + 3, n, { f: SANS, s: 8, a: 'middle', c: '#7b5cf0', w: 600 });
    return {
      embed: id => frame(id, R(122, 74, 92, 82, { f: '#15151d', r: 9 }) + `<path d="M160 104l18 11-18 11z" fill="#fff"/>` + `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1ed760"/><stop offset="1" stop-color="#0d6b35"/></linearGradient></defs>` + R(122, 164, 92, 82, { f: `url(#${id}g)`, r: 9 }) + [5, 9, 6, 11, 7, 12, 5].map((v, i) => R(142 + i * 8, 205 - v * 1.4, 3, v * 2.8, { f: '#fff', r: 1.5 })).join('')
        + h(226, 92, 'Never Gonna Give You Up') + h(226, 112, 'Player', { s: 11, w: 500 }) + lines(226, 124, [104, 92, 110])
        + h(226, 186, 'Providers') + badge(292, 182, '1.9k') + lines(226, 200, [110, 96, 84])),
      card: id => frame(id, R(128, 78, 168, 30, { f: '#f1edff', r: 12 }) + t(142, 97, 'look https://nyti.ms/…', { s: 10, c: '#4a4a63' })
        + R(128, 118, 224, 120, { f: '#fff', s: '#e6e3f2', sw: 1, r: 12 }) + `<defs><linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8e7ff"/><stop offset=".6" stop-color="#e9e3fb"/><stop offset="1" stop-color="#fde4d4"/></linearGradient></defs>` + R(138, 128, 84, 100, { f: `url(#${id}c)`, r: 8 })
        + h(234, 150, 'The quiet software', { s: 11 }) + h(234, 165, 'that holds the web', { s: 11 }) + t(234, 184, 'nytimes.com', { f: SANS, s: 9.5, c: '#8a8aa0' }) + R(234, 198, 104, 5, { f: '#ececf2', r: 2.5 }) + R(234, 210, 80, 5, { f: '#ececf2', r: 2.5 })),
      modes: id => frame(id, h(128, 92, 'Kerala', { s: 15 }) + t(184, 92, 'bonobo.net', { f: SANS, s: 10, c: '#8a8aa0' }) + h(128, 120, 'Entities') + badge(186, 116, '4')
        + ['person', 'work', 'date', 'place'].map((s, i) => { const w = s.length * 6.5 + 18, x = 128 + [0, 60, 110, 156][i]; return R(x, 130, w, 20, { f: i === 1 ? '#ece6fd' : '#f4f4f7', r: 10 }) + t(x + w / 2, 143.5, s, { f: SANS, s: 10, a: 'middle', c: i === 1 ? '#6b4cf0' : '#4a4a63', w: 500 }); }).join('')
        + h(128, 176, 'Fulltext') + t(184, 176, '1,240 words · .md', { f: SANS, s: 10, c: '#8a8aa0' }) + lines(128, 190, [190, 176, 204, 150])),
      purpose: id => frame(id, h(128, 92, 'Publisher Console', { s: 14 }) + t(128, 110, 'requests by purpose · 7 days', { f: SANS, s: 10, c: '#8a8aa0' })
        + [['preview', 168, '#7b5cf0'], ['embed', 118, '#b39cf7'], ['data', 74, '#0055ff'], ['unknown', 22, '#dcdce4']].map(([k, w, c], i) => t(128, 138 + i * 26, k, { f: SANS, s: 10.5, c: '#4a4a63' }) + R(188, 129 + i * 26, w, 12, { f: c, r: 6 }) + t(196 + w, 139 + i * 26, ['18.2k', '11.9k', '6.4k', '1.1k'][i], { f: SANS, s: 9.5, c: '#8a8aa0' })).join('')),
    };
  })();

  /* ---------------- E · outline bricks (after the line-brick cards) ---------------- */
  const E = (() => {
    const S = 20; /* one stud */
    /* a brick whose corner sits at iso point (x, y, z) from origin O; decals are drawn in face-local coordinates */
    const brick = (O, x, y, z, nx, ny, hz, o = {}) => {
      const W = nx * S, Dd = ny * S, Hh = hz, p = (a, b, c) => [O[0] + (x + a - y - b) * .866, O[1] + (x + a + y + b) * .5 - z - c];
      let s = poly([p(0, Dd, Hh), p(W, Dd, Hh), p(W, Dd, 0), p(0, Dd, 0)]) + poly([p(W, 0, Hh), p(W, Dd, Hh), p(W, Dd, 0), p(W, 0, 0)]) + poly([p(0, 0, Hh), p(W, 0, Hh), p(W, Dd, Hh), p(0, Dd, Hh)]);
      const [lx, ly] = p(0, Dd, Hh); if (o.left) s += `<g transform="matrix(.866 .5 0 1 ${lx.toFixed(1)} ${ly.toFixed(1)})">${o.left(W, Hh)}</g>`;
      const [tx, ty] = p(0, 0, Hh); if (o.top) s += `<g transform="matrix(.866 .5 -.866 .5 ${tx.toFixed(1)} ${ty.toFixed(1)})">${o.top(W, Dd)}</g>`;
      if (o.studs !== false) { const st = []; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) st.push([i, j]); st.sort((m, n) => m[0] + m[1] - n[0] - n[1]).forEach(([i, j]) => { const [cx, cy] = p((i + .5) * S, (j + .5) * S, Hh), X = cx.toFixed(1), Y = cy.toFixed(1); s += `<ellipse cx="${X}" cy="${Y}" rx="6.4" ry="3.7" fill="#fff" stroke="${INK}" stroke-width="1.1"/>` + R(cx - 6.4, cy - 4.5, 12.8, 4.5, { f: '#fff' }) + P(`M${(cx - 6.4).toFixed(1)} ${Y}v-4.5M${(cx + 6.4).toFixed(1)} ${Y}v-4.5`, { w: 1.1 }) + `<ellipse cx="${X}" cy="${(cy - 4.5).toFixed(1)}" rx="6.4" ry="3.7" fill="#fff" stroke="${INK}" stroke-width="1.1"/>`; }); }
      return s;
    };
    /* drawn at 1.5× in a 320 × 213 local space */
    const card = (inner, tint) => svg(R(0, 0, 480, 320, { f: tint || '#f5f5f5', r: 24 }) + `<g transform="scale(1.5)">${inner}</g>`);
    const spark = (x, y) => P(`M${x} ${y - 7}v14M${x - 7} ${y}h14`, { w: .8 });
    const label = (s, c = INK, fs = 8.5) => (W, H) => t(W / 2, H / 2 + 3, s, { s: fs, a: 'middle', c, w: 600 });
    return {
      embed: () => { const O = [150, 62]; return card(brick(O, 40, -40, 0, 2, 2, 30, { left: (W, H) => `<path d="M${W / 2 - 5} ${H / 2 - 7}l12 7-12 7z" fill="${BLUE}"/>` }) + brick(O, -50, 20, 0, 2, 1, 14, { left: label('//', BLUE, 10) }) + brick(O, 20, 40, 0, 3, 2, 8) + spark(262, 150)); },
      card: () => { const O = [150, 58]; return card(brick(O, 0, 0, 0, 5, 4, 8) + brick(O, 20, 20, 8, 3, 2, 5, { studs: false, top: (W, Dd) => R(5, 5, 22, Dd - 10, { f: '#cddcff', s: INK, sw: 1 }) + R(32, 9, 22, 4, { f: INK }) + R(32, 17, 16, 3, { f: '#9a9a9a' }) + R(32, 27, 20, 3, { f: '#d0d0d0' }) }) + spark(268, 50), '#e3ecff'); },
      modes: () => { const O = [140, 96]; return card(brick(O, 0, 0, 0, 4, 2, 22, { studs: false, left: label('fulltext') }) + brick(O, 10, 0, 22, 3, 2, 20, { studs: false, left: label('entities') }) + brick(O, 20, 0, 42, 2, 2, 20, { left: label('meta', BLUE) }) + brick(O, 110, 10, 0, 1, 1, 14) + spark(60, 50)); },
      purpose: () => { const O = [120, 120]; let g = ''; [[3, 'preview'], [2, 'embed'], [1, 'data']].forEach(([n, s], k) => { for (let j = 0; j < n; j++) g += brick(O, k * 46, 0, j * 20, 2, 1, 20, { studs: j === n - 1, left: j === 0 ? label(s, s === 'data' ? BLUE : INK) : null }); }); return card(g + spark(268, 46)); },
    };
  })();

  /* ---------------- F · isometric desks, second pass: one drawing language, a different scene per card ---------------- */
  const F = (() => {
    const p = (O, x, y, z) => [O[0] + (x - y) * .866, O[1] + (x + y) * .5 - z];
    const hatch = id => `<pattern id="${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="#8a8a8a" stroke-width="1"/></pattern>`;
    /* a box: hatched sides, white top */
    const box = (O, x, y, z, W, D, H, id, top = '#fff') => { const q = (a, b, c) => p(O, x + a, y + b, z + c); return poly([q(0, D, H), q(W, D, H), q(W, D, 0), q(0, D, 0)], { f: `url(#${id})`, w: 1 }) + poly([q(W, 0, H), q(W, D, H), q(W, D, 0), q(W, 0, 0)], { f: `url(#${id})`, w: 1 }) + poly([q(0, 0, H), q(W, 0, H), q(W, D, H), q(0, D, H)], { f: top, w: 1.1 }); };
    const win = (x, y, w, h, inner = '', o = {}) => R(x, y, w, h, { f: '#fff', s: INK, sw: 1.1 }) + P(`M${x} ${y + 11}h${w}`, { w: .8 }) + t(x + w - 15, y + 8.5, '– ×', { s: 7 }) + (o.title ? t(x + 5, y + 8.5, o.title, { s: 6.5, c: '#777' }) : R(x + 4, y + 4, 14, 2, { f: '#d0d0d0' })) + inner;
    const lab = (x, y, s, a = 'middle') => t(x, y, s, { s: 12, a, ls: 2, w: 500 });
    const lines = (x, y, ws, c = '#e2e2e2') => ws.map((w, i) => R(x, y + i * 8, w, 3.5, { f: c })).join('');
    const check = (x, y, on = true) => R(x, y, 12, 9, { f: on ? '#cddcff' : '#fff', s: INK, sw: .8 }) + (on ? P(`M${x + 3.5} ${y + 4.5}l2.2 2.2 3.6-3.8`, { w: 1, s: BLUE }) : '');
    const wire = (a, b, bend = 40) => P(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}C${(a[0] + bend).toFixed(1)} ${a[1].toFixed(1)} ${(b[0] - bend).toFixed(1)} ${b[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`, { w: .9, da: '1.5 3.5' });
    /* the side strip, after Palantir's: black square with //, vertical caption */
    const strip = s => R(0, 0, 34, 320, { f: '#fff' }) + P('M34 0V320', { w: 1 }) + R(0, 0, 34, 34, { f: INK }) + slash2(17, 17, 14, '#fff') + t(0, 0, s, { s: 10.5, c: '#333', tr: 'translate(22 300) rotate(-90)' });
    const card = (id, cap, inner) => svg(R(0, 0, 480, 320, { f: '#f1f1f1' }) + strip(cap) + inner, hatch(id));
    return {
      embed: id => card(id, 'Iframely → Rich Media',
        win(84, 46, 250, 228, lines(100, 70, [150, 110, 130]) + `<rect x="100" y="104" width="196" height="110" fill="url(#${id})" opacity=".55"/>` + R(100, 104, 196, 110, { s: INK, sw: 1, da: '4 3' }) + lines(100, 228, [190, 160, 120]))
        + P('M182 58v20M208 50v22M234 58v18', { w: .9, da: '2 3' })
        + win(116, 88, 196, 112, R(120, 103, 188, 93, { f: INK }) + `<path d="M206 136l18 11-18 11z" fill="#fff"/>`, { title: 'cdn.iframe.ly/x7Kd2' })
        + P('M356 104v110M350 104h12M350 214h12', { w: 1 }) + t(368, 156, '16:9', { s: 10 }) + t(368, 170, '315 px', { s: 10, c: '#777' })
        + lab(452, 300, 'HOSTED IFRAME', 'end')),
      card: id => card(id, 'Iframely → Preview API',
        R(170, 32, 210, 26, { f: '#fff', s: INK, sw: 1.1 }) + t(182, 49, `https:<tspan fill="${BLUE}" font-weight="800">//</tspan>nyti.ms/3kQ…`, { s: 10.5 })
        + [[110, 112], [270, 104], [416, 112]].map(([x, y]) => wire([275, 58], [x, y], 0)).join('')
        + R(78, 112, 64, 124, { f: '#fff', s: INK, sw: 1.1, r: 9 }) + R(86, 128, 48, 30, { f: '#cddcff' }) + lines(86, 164, [44, 30]) + R(98, 226, 24, 3, { f: INK })
        + R(196, 104, 150, 92, { f: '#fff', s: INK, sw: 1.1 }) + R(206, 116, 52, 40, { f: '#e6e6e6' }) + R(266, 118, 64, 5, { f: INK }) + lines(266, 130, [56, 44]) + check(318, 176) + `<polygon points="180,196 362,196 380,214 162,214" fill="url(#${id})" stroke="${INK}" stroke-width="1"/>`
        + win(380, 112, 74, 124, R(386, 130, 50, 12, { f: '#eee', r: 6 }) + R(386, 150, 62, 50, { f: '#fff', s: INK, sw: .8 }) + R(390, 154, 54, 22, { f: '#cddcff' }) + lines(390, 182, [44, 30]))
        + lab(110, 262, 'APP') + lab(271, 262, 'CMS') + lab(417, 262, 'CHAT') + t(271, 300, 'one card, any surface', { s: 10, a: 'middle', c: '#777' })),
      modes: id => { const O = [130, 150], tags = ['meta', 'links', 'entities', 'excerpt', 'fulltext']; return card(id, 'Iframely → Data API',
        lab(452, 40, 'ONE URL, FIVE MODES', 'end')
        + tags.map((s, i) => { const y = 78 + i * 44; return [0, 1, 2].map(k => wire(p(O, 64, 8 + i * 11, 26 + k * 7), [336, y + 6 + k * 4], 70)).join(''); }).join('')
        + box(O, 0, 0, 0, 64, 64, 104, id) + `<g transform="matrix(.866 .5 -.866 .5 ${p(O, 0, 0, 104).map(v => v.toFixed(1)).join(' ')})">${slash2(32, 32, 26)}</g>`
        + tags.map((s, i) => { const y = 78 + i * 44; return R(336, y, 116, 22, { f: '#fff', s: INK, sw: 1 }) + check(344, y + 6, i === 4) + t(364, y + 15, s, { s: 10.5, w: i === 4 ? 700 : 400, c: i === 4 ? BLUE : INK }); }).join('')); },
      purpose: id => card(id, 'Iframely → Publishers',
        [['embed-bot', 70], ['preview-bot', 148], ['data-bot', 226]].map(([s, y], i) => win(56, y, 92, 50, t(64, y + 30, s, { s: 9.5, w: 600 }) + t(64, y + 42, 'purpose=' + ['embed', 'preview', 'read'][i], { s: 7.5, c: BLUE }))).join('')
        + wire([148, 95], [392, 112], 90) + wire([148, 173], [297, 180], 70) + wire([148, 251], [392, 250], 90)
        + R(300, 66, 16, 210, { f: `url(#${id})`, s: INK, sw: 1 }) + poly([[300, 66], [316, 66], [328, 58], [312, 58]], { w: 1 }) + poly([[316, 66], [328, 58], [328, 268], [316, 276]], { f: '#fff', w: 1 })
        + P('M392 112h40', { w: .9, da: '1.5 3.5' }) + check(436, 107) + P('M392 250h40', { w: .9, da: '1.5 3.5' }) + check(436, 245)
        + C(290, 180, 9, { f: '#fff', s: INK, sw: 1 }) + P('M286 176l8 8M294 176l-8 8', { w: 1.2 })
        + lab(330, 304, 'PUBLISHER RULES')),
    };
  })();

  /* ---------------- G · outline bricks, second pass: a different object per card ---------------- */
  const G = (() => {
    const S = 20, p = (O, x, y, z) => [O[0] + (x - y) * .866, O[1] + (x + y) * .5 - z];
    const brick = (O, x, y, z, nx, ny, hz, o = {}) => {
      const W = nx * S, Dd = ny * S, q = (a, b, c) => p(O, x + a, y + b, z + c);
      let s = poly([q(0, Dd, hz), q(W, Dd, hz), q(W, Dd, 0), q(0, Dd, 0)]) + poly([q(W, 0, hz), q(W, Dd, hz), q(W, Dd, 0), q(W, 0, 0)]) + poly([q(0, 0, hz), q(W, 0, hz), q(W, Dd, hz), q(0, Dd, hz)]);
      const [lx, ly] = q(0, Dd, hz); if (o.left) s += `<g transform="matrix(.866 .5 0 1 ${lx.toFixed(1)} ${ly.toFixed(1)})">${o.left(W, hz)}</g>`;
      const [tx, ty] = q(0, 0, hz); if (o.top) s += `<g transform="matrix(.866 .5 -.866 .5 ${tx.toFixed(1)} ${ty.toFixed(1)})">${o.top(W, Dd)}</g>`;
      if (o.studs !== false) { const st = []; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) st.push([i, j]); st.sort((m, n) => m[0] + m[1] - n[0] - n[1]).forEach(([i, j]) => { const [cx, cy] = q((i + .5) * S, (j + .5) * S, hz), X = cx.toFixed(1), Y = cy.toFixed(1); s += `<ellipse cx="${X}" cy="${Y}" rx="6.4" ry="3.7" fill="#fff" stroke="${INK}" stroke-width="1.1"/>` + R(cx - 6.4, cy - 4.5, 12.8, 4.5, { f: '#fff' }) + P(`M${(cx - 6.4).toFixed(1)} ${Y}v-4.5M${(cx + 6.4).toFixed(1)} ${Y}v-4.5`, { w: 1.1 }) + `<ellipse cx="${X}" cy="${(cy - 4.5).toFixed(1)}" rx="6.4" ry="3.7" fill="#fff" stroke="${INK}" stroke-width="1.1"/>`; }); }
      return s;
    };
    const shadow = (O, x, y, nx, ny) => { const [cx, cy] = p(O, x + nx * S / 2, y + ny * S / 2, 0); return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(nx + ny) * 9}" ry="${(nx + ny) * 4.4}" fill="#e2e2e2"/>`; };
    const card = (inner, tint) => svg(R(0, 0, 480, 320, { f: tint || '#f5f5f5', r: 24 }) + `<g transform="scale(1.5)">${inner}</g>`);
    const spark = (x, y) => P(`M${x} ${y - 7}v14M${x - 7} ${y}h14`, { w: .8 });
    const label = (s, c = INK, fs = 9) => (W, H) => t(W / 2, H / 2 + 3, s, { s: fs, a: 'middle', c, w: 700 });
    return {
      /* a brick-built screen on a plate, showing a player */
      embed: () => { const O = [140, 74]; return card(brick(O, 0, 0, 0, 5, 3, 8) + brick(O, 10, 10, 8, 4, 1, 64, { left: (W, H) => R(5, 6, W - 10, H - 12, { f: INK }) + `<path d="M${W / 2 - 6} ${H / 2 - 8}l14 8-14 8z" fill="#fff"/>` }) + brick(O, 78, 40, 8, 1, 1, 14) + brick(O, 10, 40, 8, 2, 1, 7) + spark(270, 44) + spark(52, 150)); },
      /* bricks floating above their shadows; one is a printed card tile */
      card: () => { const O = [150, 70]; return card(shadow(O, -40, 40, 3, 2) + shadow(O, 50, -10, 2, 1) + shadow(O, 60, 70, 1, 1)
        + brick(O, -40, 40, 46, 3, 2, 6, { studs: false, top: (W, Dd) => R(4, 4, 22, Dd - 8, { f: '#cddcff', s: INK, sw: 1 }) + R(31, 8, 22, 4, { f: INK }) + R(31, 16, 16, 3, { f: '#9a9a9a' }) + R(31, 26, 20, 3, { f: '#d0d0d0' }) })
        + brick(O, 50, -10, 70, 2, 1, 16, { left: label('//', BLUE, 11) }) + brick(O, 60, 70, 30, 1, 1, 14)
        + P('M54 64q-8 6-4 14M60 66q-4 6 0 12', { w: .8 }) + spark(272, 120)); },
      /* one brick, split into five lettered bricks */
      modes: () => { const O = [52, 58], tags = ['meta', 'links', 'entities', 'excerpt', 'fulltext']; let s = brick(O, 0, 0, 0, 2, 2, 24, { left: label('url') });
        const [ax, ay] = p(O, 40, 20, 24); s += P(`M${(ax + 4).toFixed(1)} ${(ay - 6).toFixed(1)}q24 -26 52 -6`, { w: .9, da: '2 3' });
        /* five bricks in a row along x, rising; each named above its studs */
        const L = ['M', 'L', 'E', 'X', 'F'];
        tags.forEach((k, i) => { const x = 86 + i * 30, hz = 12 + i * 6; s += brick(O, x, 0, 0, 1, 1, hz, { left: label(L[i], i === 4 ? BLUE : INK) }); });
        s += t(24, 202, tags.map((k, i) => `<tspan font-weight="700"${i === 4 ? ` fill="${BLUE}"` : ''}>${L[i]}</tspan> ${k}`).join('   '), { s: 7.5, c: '#555' });
        return card(s); },
      /* an outline rocket with a // porthole */
      purpose: () => card(`<g transform="translate(160 106) rotate(40)">`
        + P('M0 -84C14 -66 18 -40 18 -10V44H-18V-10C-18 -40 -14 -66 0 -84Z', { f: '#fff', w: 1.3 })
        + P('M-18 -10H18', { w: 1 }) + P('M-18 18L-40 44V58L-18 44', { f: '#fff', w: 1.3 }) + P('M18 18L40 44V58L18 44', { f: '#fff', w: 1.3 })
        + C(0, 12, 11, { f: '#fff', s: INK, sw: 1.3 }) + `<g transform="rotate(-40 0 12)">${slash2(0, 12, 12)}</g>`
        + P('M-10 44h20l-4 8h-12z', { f: '#fff', w: 1.2 }) + P('M-6 54c-6 10 2 14-2 24 8-6 6-12 8-16 2 6 8 8 4 18 8-8 6-18 0-26', { w: 1.1 }) + '</g>'
        + spark(250, 52) + spark(62, 60) + P('M74 150l-8 6M84 160l-10 8', { w: .8 }), '#e3ecff'),
    };
  })();

  const FEAT = [
    ['embed', 'Hosted iframes', 'Rich Media', 'We wrap third-party embed code in our own iframe: isolated, sized before it loads, with a fallback.'],
    ['card', 'Summary cards', 'Preview API', 'A hosted card for any URL without a player, light or dark, large or small.'],
    ['modes', 'Five processing modes', 'Data API', 'meta, links, entities, excerpt, fulltext: one per reason you read.'],
    ['purpose', 'Every request declares a purpose', 'Publishers', 'Three agents, three reasons, one URL at a time. The Publisher Console shows who fetches and why.'],
  ];
  const STYLES = [
    ['ill-style-windows', 'Windows', 'after the Paper site: grid paper, mono window cards with a solid offset shadow, ASCII pictures and a big glyph', A],
    ['ill-style-iso', 'Isometric desks', 'after Palantir Foundry: hatched isometric slabs, frontal monitors, dotted wire bundles into pills, wide uppercase labels', B],
    ['ill-style-orbits', 'Orbits', 'after Weave: thin loops with dots through a // hub, mono pill labels, warm paper', Corb],
    ['ill-style-soft', 'Soft UI', 'after the Notetaker card: a real product card on a lilac stage, sound-bar sides, gradient backdrop', D],
    ['ill-style-bricks', 'Outline bricks', 'after the outline-brick cards: isometric line bricks with studs and printed decals on soft rounded cards', E],
    ['ill-style-iso2', 'Isometric desks 2', 'in the I06 line language (hatching, frontal windows, dotted wires, uppercase labels, a side strip with the //) with a different scene per card: an iframe dropping into its slot, one URL to three surfaces, a server wired to five modes, bots meeting a publisher wall', F],
    ['ill-style-bricks2', 'Outline bricks 2', 'in the I09 brick style with a different object per card: a brick-built screen, bricks floating over their shadows, one brick split into five, a rocket with a // porthole', G],
  ];
  const CSS = `
.il2{background:#fff;container-type:inline-size}
.il2-grid{display:grid;grid-template-columns:repeat(2,1fr)}
.il2-card{position:relative;padding:22px clamp(18px,2.6cqw,34px) 30px;border-left:1px dashed #e2e2e2;border-bottom:1px dashed #e2e2e2;min-width:0}
.il2-card:nth-child(2n+1){border-left:0}
.il2-art svg{display:block;width:100%;height:auto;border-radius:12px}
.il2-card .pr{margin:14px 0 2px;font:500 10px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#0055ff}
.il2-card h4{margin:0 0 6px;font:800 clamp(15px,1.7cqw,19px)/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:-.01em}
.il2-card p{margin:0;font:400 clamp(12px,1.3cqw,14px)/1.65 'JetBrains Mono',ui-monospace,monospace;color:#333;max-width:44ch}
.il2-copy{position:absolute;right:10px;top:10px;z-index:1;height:24px;padding:0 8px;border:1px solid #e2e2e2;border-radius:6px;background:#fff;font:500 10px 'JetBrains Mono',monospace;color:#777;cursor:pointer;opacity:0;transition:opacity .2s}
.il2-card:hover .il2-copy{opacity:1}
@container (max-width:620px){.il2-grid{grid-template-columns:1fr}.il2-card{border-left:0}}
`;
  STYLES.forEach(([name, label, note, kit]) => {
    DEMOS.register(name, {
      group: 'ill', title: 'Style: ' + label,
      blurb: 'The four product features drawn ' + note + '. Same titles and copy as the Mono / Pastel / Solid sets; hover a card to copy its SVG.',
      mount(stage) {
        const { h } = DEMOS;
        if (!document.getElementById('css-ill2')) document.head.appendChild(h('style', { id: 'css-ill2' }, CSS));
        const grid = h('div', { class: 'il2-grid' }, FEAT.map(([key, title, product, text]) => {
          const markup = kit[key](name.slice(10) + '-' + key);
          const btn = h('button', { class: 'il2-copy', type: 'button' }, 'copy svg');
          btn.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(markup) : Promise.reject()).then(() => { btn.textContent = 'copied'; }, () => { btn.textContent = 'copy failed'; }); setTimeout(() => { btn.textContent = 'copy svg'; }, 1400); });
          return h('div', { class: 'il2-card' }, btn, h('div', { class: 'il2-art', html: markup }), h('div', { class: 'pr' }, product), h('h4', null, title), h('p', null, text));
        }));
        stage.appendChild(h('div', { class: 'il2' }, grid));
      },
    });
  });
})();
