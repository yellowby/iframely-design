/* I12–I13 · product illustrations, next pass after feedback on I05 and I01.
   I12 windows in blue: the I05 Paper style (grid paper, windows with a solid offset shadow, ASCII pictures) with Iframely
       blue #0055ff as the one accent, plus its tints: blue offset shadow and title bar on the active window, pale blue
       shadows on the rest, ASCII art in three blue tones, a blue primary button. Same four features, 480 × 320.
   I13 one system, three takes: the I01 line-diagram style made consistent (one canvas 360 × 240, 2 px lines, the same
       frame / screen / node / tag / bar parts everywhere, a caption on one baseline, one accent per drawing) and drawn three
       ways per Rich Media feature: Diagram (nodes and wires), Interface (the UI it produces), Mark (one big glyph).
       Four themes, all in brand blue: Mono, Tint, Ink, Blue. Group 'ill', mount(stage). */
(() => {
  const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const copyBtn = (h, cls, markup) => {
    const btn = h('button', { class: cls, type: 'button' }, 'copy svg');
    btn.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(markup) : Promise.reject()).then(() => { btn.textContent = 'copied'; }, () => { btn.textContent = 'copy failed'; }); setTimeout(() => { btn.textContent = 'copy svg'; }, 1400); });
    return btn;
  };

  /* ================= I12 · windows in blue ================= */
  const W12 = (() => {
    const INK = '#0a0a0a', BL = '#0055ff', B50 = '#80aaff', B25 = '#bfd4ff', B12 = '#e0eaff', B06 = '#f0f5ff', MUT = '#7a7a7a';
    const svg = (inner, defs = '') => `<svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" font-family="${MONO}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
    const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 13}"${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.c || INK}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.st ? ` stroke="${o.st}" stroke-width="${o.sw || 1}"` : ''}>${s}</text>`;
    const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.r ? ` rx="${o.r}"` : ''} fill="${o.f || 'none'}"${o.s ? ` stroke="${o.s}" stroke-width="${o.sw || 1.5}"` : ''}/>`;
    const sp = (s, c = BL, w) => `<tspan fill="${c}"${w ? ` font-weight="${w}"` : ''}>${s}</tspan>`;
    const grid = id => `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#e4ebf8" stroke-width="1"/></pattern>`;
    const bg = id => R(0, 0, 480, 320, { f: '#fbfcfe' }) + `<rect width="480" height="320" fill="url(#${id})"/>`;
    /* a window: white body, ink outline, offset shadow (pale blue, or brand blue when active); the active one also gets a blue title bar */
    const win = (x, y, w, h, title, inner, o = {}) =>
      R(x + 6, y + 6, w, h, { f: o.on ? BL : B25 }) + R(x, y, w, h, { f: '#fff' })
      + (o.on ? R(x, y, w, 30, { f: BL }) : '') + R(x, y, w, h, { s: INK })
      + `<path d="M${x} ${y + 30}h${w}" stroke="${INK}" stroke-width="1"/>`
      + t(x + 12, y + 20, title, { c: o.on ? '#fff' : INK }) + t(x + w - 14, y + 20, '×', { s: 15, a: 'middle', c: o.on ? '#fff' : INK })
      + inner;
    const btn = (x, y, w, s) => R(x + 4, y + 4, w, 32, { f: INK }) + R(x, y, w, 32, { f: BL, s: INK }) + t(x + 14, y + 21, s, { c: '#fff', w: 700 });
    const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
    const cl = v => Math.max(0, Math.min(1, v));
    /* ASCII picture in three blue tones: each tone is its own text line with spaces elsewhere, so the columns stay aligned */
    const ascii = (x, y, cols, rows, f, o = {}) => {
      const ramp = ' .:-=+*#%@', tones = [B25, B50, BL], lh = o.lh || 9; let s = '';
      for (let r = 0; r < rows; r++) {
        const lines = ['', '', ''];
        for (let c = 0; c < cols; c++) {
          const v = cl(f(c / (cols - 1), r / (rows - 1)) + (hash(c, r) - .5) * .18), ch = ramp[Math.round(v * (ramp.length - 1))], k = v < .35 ? 0 : v < .7 ? 1 : 2;
          for (let i = 0; i < 3; i++) lines[i] += i === k ? ch : ' ';
        }
        lines.forEach((ln, i) => { if (ln.trim()) s += `<text x="${x}" y="${y + r * lh}" font-size="9" fill="${tones[i]}" xml:space="preserve" letter-spacing="1.2">${esc(ln)}</text>`; });
      }
      return s;
    };
    const poly = (pts, c) => `<polygon points="${pts.map(p => p.map(v => +v.toFixed(1)).join(',')).join(' ')}" fill="${c}"/>`;
    const slash2 = (cx, cy, h, c) => { const sw = h * .2, gap = h * .2, tilt = h * .36, x0 = cx - (sw * 2 + gap + tilt) / 2, q = x => [[x + tilt, cy - h / 2], [x + tilt + sw, cy - h / 2], [x + sw, cy + h / 2], [x, cy + h / 2]]; return poly(q(x0), c) + poly(q(x0 + sw + gap), c); };
    return {
      embed(id) {
        const play = (u, v) => { const x = (u - .5) * 1.6, y = (v - .5) * 1.2; const tri = x > -.35 && x < .45 && Math.abs(y) < (.45 - x) * .62; const ring = Math.abs(Math.hypot(x, y) - .62); return tri ? .95 : ring < .05 ? .55 : ring < .14 ? .22 : 0; };
        return svg(bg(id) + win(36, 36, 250, 230, 'player.html', ascii(52, 84, 34, 19, play))
          + win(258, 150, 190, 112, 'x7Kd2.id', t(272, 206, `src=${sp('//', BL, 800)}cdn.iframe.ly/`, { s: 11 }) + t(272, 244, 'x7Kd2', { s: 28, w: 700 }), { on: true })
          + btn(312, 52, 136, 'Copy embed ↗'), grid(id));
      },
      card(id) {
        const pic = (u, v) => { const sun = Math.hypot(u - .68, v - .32) < .16 ? .9 : 0; const hill = v > .62 + .14 * Math.sin(u * 7) ? .45 + .4 * v : 0; return Math.max(sun, hill, .1); };
        return svg(bg(id) + win(32, 44, 210, 236, 'card.preview', ascii(46, 90, 28, 11, pic) + t(46, 210, 'Kerala · Bonobo', { w: 700 }) + t(46, 230, 'open.spotify.com', { s: 11, c: MUT }) + R(46, 244, 150, 5, { f: B12, r: 2.5 }) + R(46, 256, 110, 5, { f: B12, r: 2.5 }))
          + win(262, 38, 186, 92, 'fetch', R(276, 84, 112, 14, { f: B12 }) + R(276, 84, 84, 14, { f: BL }) + t(396, 96, '75%', { s: 12 }) + t(276, 118, 'reading og:…', { s: 12, c: MUT }), { on: true })
          + win(270, 156, 178, 128, 'og.tags', ['og:title', 'og:image', 'og:site_name', 'og:audio'].map((k, i) => t(284, 206 + i * 20, `${sp('og:', BL, 700)}${k.slice(3)}`, { s: 12 })).join('')), grid(id));
      },
      modes(id) {
        const tok = (x, y, s, on) => { const w = s.length * 6.6 + 14; return on ? R(x, y - 13, w, 19, { f: BL, r: 3 }) + t(x + 7, y + 1, s, { s: 11, c: '#fff', w: 700 }) : R(x, y - 13, w, 19, { s: B50, sw: 1, r: 3 }) + t(x + 7, y + 1, s, { s: 11 }); };
        return svg(bg(id) + win(28, 36, 170, 248, '{}.glyph', R(42, 80, 142, 190, { f: B06 }) + t(113, 214, '{}', { s: 128, a: 'middle', c: 'none', st: BL, sw: 1.4 }))
          + win(220, 46, 230, 140, 'kerala.md', t(234, 100, '# Kerala', { s: 14, w: 800 }) + t(234, 124, '&gt; a quiet, looping single', { s: 11 }) + t(234, 146, `[${sp('Migration')}](…)`, { s: 11 }) + t(234, 168, '- Bonobo, 2017', { s: 11, c: MUT }))
          + win(220, 206, 230, 90, 'mode=', tok(234, 256, 'meta') + tok(282, 256, 'links') + tok(336, 256, 'entities') + tok(234, 282, 'excerpt') + tok(302, 282, 'fulltext', true), { on: true }), grid(id));
      },
      purpose(id) {
        return svg(bg(id) + win(26, 34, 214, 150, 'robots.txt', t(40, 86, 'User-agent: *', { s: 12 }) + t(40, 106, 'Allow: /', { s: 12 }) + t(40, 138, `${sp('Purpose:', BL, 700)} embed,`, { s: 12 }) + t(40, 156, '         preview, read', { s: 12 }), { on: true })
          + win(56, 206, 200, 84, 'llms.txt', t(70, 256, '# example.com', { s: 12, w: 700 }) + t(70, 274, '&gt; what we publish', { s: 11, c: MUT }))
          + win(272, 30, 176, 262, '//.glyph', R(286, 74, 148, 204, { f: B06 }) + slash2(360, 176, 170, BL)), grid(id));
      },
    };
  })();

  const FEAT = [
    ['embed', 'Hosted iframes', 'Rich Media', 'We wrap third-party embed code in our own iframe: isolated, sized before it loads, with a fallback.'],
    ['card', 'Summary cards', 'Preview API', 'A hosted card for any URL without a player, light or dark, large or small.'],
    ['modes', 'Five processing modes', 'Data API', 'meta, links, entities, excerpt, fulltext: one per reason you read.'],
    ['purpose', 'Every request declares a purpose', 'Publishers', 'Three agents, three reasons, one URL at a time. The Publisher Console shows who fetches and why.'],
  ];
  const CSS2 = `
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
  DEMOS.register('ill-style-windows-blue', {
    group: 'ill', title: 'Style: Windows in blue',
    blurb: 'I05 with Iframely blue as the one accent: the active window gets a blue title bar and a blue offset shadow, the rest pale blue shadows; ASCII pictures in three blue tones; a blue primary button. Grid paper and ink outlines stay neutral. Hover a card to copy its SVG.',
    mount(stage) {
      const { h } = DEMOS;
      if (!document.getElementById('css-ill2')) document.head.appendChild(h('style', { id: 'css-ill2' }, CSS2));
      stage.appendChild(h('div', { class: 'il2' }, h('div', { class: 'il2-grid' }, FEAT.map(([key, title, product, text]) => {
        const markup = W12[key]('wb-' + key);
        return h('div', { class: 'il2-card' }, copyBtn(h, 'il2-copy', markup), h('div', { class: 'il2-art', html: markup }), h('div', { class: 'pr' }, product), h('h4', null, title), h('p', null, text));
      }))));
    },
  });

  /* ================= I13 · one system, three takes ================= */
  /* palette slots, set per render: line, accent, accent mid, accent light, grey, muted, knockout (tile bg) */
  let K, B, B2, B3, G, M, W, SFX = '', TILE = false;
  /* parts: everything below is built from these, at these sizes */
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 13}"${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.c || K}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
  const sp = (s, c = B, w) => `<tspan fill="${c}"${w ? ` font-weight="${w}"` : ''}>${s}</tspan>`;
  const ln = (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.c || K}" stroke-width="${o.w || 2}"${o.da ? ` stroke-dasharray="${o.da}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
  const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.r ? ` rx="${o.r}"` : ''} fill="${o.f || 'none'}"${o.st ? ` stroke="${o.st}" stroke-width="${o.sw || 2}"` : ''}${o.da ? ` stroke-dasharray="${o.da}"` : ''}/>`;
  const svg = inner => `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" font-family="${MONO}">${TILE ? `<rect width="360" height="240" rx="16" fill="${W}"/>` : ''}${inner}</svg>`;
  const len = s => s.replace(/&\w+;/g, 'x').replace(/<[^>]+>/g, '').length;
  const cap = s => t(180, 220, s, { a: 'middle', s: 12, c: M });                                  /* caption: always here */
  const node = (x, y, on) => `<circle cx="${x}" cy="${y}" r="${on ? 7 : 5}" fill="${on ? B : K}"/>`;
  const frame = (x, y, w, h, o = {}) => rect(x, y, w, h, { r: 8, st: o.c || K, f: o.f || W, da: o.da });
  const tri = (cx, cy, s, c) => `<path d="M${cx - s * .4} ${cy - s * .5} L${cx + s * .55} ${cy} L${cx - s * .4} ${cy + s * .5} Z" fill="${c}"/>`;
  const screen = (x, y, w, h, o = {}) => frame(x, y, w, h, o) + (o.inner ? rect(x + 8, y + 8, w - 16, h - 16, { r: 4, st: B, sw: 1.5, da: '5 4' }) : '') + tri(x + w / 2, y + h / 2, Math.min(w, h) * .3, o.on ? B : K);
  const bars = (x, y, ws, o = {}) => ws.map((w, i) => rect(x, y + i * 12, w, 6, { r: 3, f: i === 0 && o.title ? K : G })).join('');
  const tag = (cx, cy, s, on) => { const w = len(s) * 7.8 + 22; return rect(cx - w / 2, cy - 12, w, 24, { r: 12, f: on ? B : W, st: on ? B : K, sw: 1.6 }) + t(cx, cy + 4.5, s, { a: 'middle', s: 12, c: on ? W : K, w: on ? 700 : 400 }); };
  const head = (x, y, dx, dy, c = K) => { const L = Math.hypot(dx, dy); dx /= L; dy /= L; const bx = x - dx * 11, by = y - dy * 11, px = -dy * 5.5, py = dx * 5.5; return `<path d="M${x} ${y} L${(bx + px).toFixed(1)} ${(by + py).toFixed(1)} L${(bx - px).toFixed(1)} ${(by - py).toFixed(1)} Z" fill="${c}"/>`; };
  const mark = (s, y = 136, size = 72) => t(180, y, s, { a: 'middle', s: size, w: 800, ls: -2 });
  const cursor = (x, y) => `<path d="M${x} ${y} l0 34 l8.5 -8.5 l6.5 14 l6.5 -3 l-6.5 -14 l11.5 0 z" fill="${K}" stroke="${W}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const measure = (x, y0, y1, label) => ln(`M${x} ${y0} V${y1}`, { c: B, w: 1.5 }) + ln(`M${x - 7} ${y0} H${x + 7} M${x - 7} ${y1} H${x + 7}`, { c: B, w: 1.5 }) + (label ? t(x + 14, (y0 + y1) / 2 + 5, label, { s: 14, w: 700, c: B }) : '');

  /* each feature, three takes: [Diagram, Interface, Mark] */
  const buildArt = () => ({
    hosted: [
      svg([['&lt;script&gt;', 64], ['oEmbed', 112], ['og:video', 160]].map(([s, y]) => tag(82, y, s) + ln(`M${82 + (len(s) * 7.8 + 22) / 2} ${y} C170 ${y} 160 112 206 112`, { w: 1.6 })).join('') + node(206, 112, true) + screen(224, 64, 104, 96, { on: true, inner: true }) + cap('third-party code, our iframe')),
      svg(frame(40, 24, 280, 172) + bars(58, 42, [150, 110], { title: true }) + screen(58, 78, 244, 100, { inner: true, on: true }) + tag(254, 78, 'iframe', true) + cap('isolated, sized, with a fallback')),
      svg(mark(`&lt;${sp('//')}&gt;`, 140, 84) + cap('one iframe for any provider')),
    ],
    ids: [
      svg(ln('M64 40 V176') + node(64, 40) + t(80, 45, 'youtube.com/watch?v=dQw4') + ln('M64 98 H104') + node(104, 98, true) + t(120, 103, `id ${sp('x7Kd2', B, 700)}`) +
        ln('M104 98 V140 H144') + node(144, 140) + t(160, 145, 'player.html') + ln('M64 176 H104') + node(104, 176) + t(120, 181, 'thumb.jpg') + cap('one URL, one ID, every asset')),
      svg(t(180, 44, 'cdn.iframe.ly/', { a: 'middle', s: 13, c: M }) + frame(70, 60, 220, 120) + t(90, 90, 'id', { s: 12, c: M }) + t(90, 140, 'x7Kd2', { s: 40, w: 800 }) + rect(90, 154, 148, 4, { f: B }) + node(266, 84, true) + cap('use it as the iframe source')),
      svg(t(180, 62, 'youtube.com/watch?v=dQw4…', { a: 'middle', s: 13, c: M }) + ln('M180 76 V92') + head(180, 100, 0, 1) + mark(sp('x7Kd2', B), 164, 64) + cap('short and permanent')),
    ],
    evergreen: [
      svg(screen(40, 48, 100, 64, { c: M, da: '5 4' }) + screen(220, 48, 100, 64, { on: true }) + ln('M90 150 H262') + head(270, 150, 1, 0) + node(90, 150) + node(270, 150, true) +
        ln('M90 112 V150 M270 112 V150', { w: 1.5, da: '2 4' }) + t(90, 182, '2012', { a: 'middle' }) + t(270, 182, '2026', { a: 'middle', w: 700, c: B }) + cap('refreshed every 24 h')),
      svg(ln('M106 66 A78 78 0 0 1 254 66') + head(258, 74, .45, .9) + ln('M254 146 A78 78 0 0 1 106 146') + head(102, 138, -.45, -.9) + screen(134, 76, 92, 60, { on: true }) + cap('thumbnails and players stay current')),
      svg(mark(`24${sp('h', B)}`, 146, 80) + ln('M118 64 A86 50 0 0 1 242 64') + head(248, 72, .6, .8) + cap('every 24 hours, without a redeploy')),
    ],
    click: [
      svg(ln('M60 110 H300') + [[60, 'cover', '12 KB'], [180, 'press', ''], [300, 'player', '1.4 MB']].map(([x, l, v], i) => node(x, 110, i === 2) + t(x, 142, l, { a: 'middle', w: i === 2 ? 700 : 400, c: i === 2 ? B : K }) + (v ? t(x, 86, v, { a: 'middle', s: 12, c: M }) : cursor(x - 2, 66))).join('') + cap('the player loads on press')),
      svg(frame(70, 32, 220, 152, { da: '6 5', c: B }) + `<circle cx="180" cy="108" r="30" fill="${W}" stroke="${K}" stroke-width="2"/>` + tri(182, 108, 26, K) + cursor(204, 128) + cap('a cover image first')),
      svg(mark(`${sp('0', B)} KB`, 140, 76) + cap('until the reader presses play')),
    ],
    consent: [
      svg(node(64, 112) + t(64, 90, 'reader', { a: 'middle' }) + ln('M64 112 H160') + rect(160, 76, 18, 72, { r: 4, f: B, st: B }) + t(169, 172, 'ask', { a: 'middle', s: 12, c: B, w: 700 }) + ln('M178 112 H210', { da: '3 5' }) + screen(216, 80, 104, 64) + cap('ask first, then load')),
      svg(screen(40, 24, 280, 172, { c: G }) + frame(84, 62, 192, 100) + t(102, 92, 'Load YouTube?', { w: 700 }) + bars(102, 104, [120]) + tag(140, 140, 'no') + tag(218, 140, 'allow', true) + cap('one parameter to turn on')),
      svg(`<defs><clipPath id="i3c${SFX}"><circle cx="146" cy="112" r="64"/></clipPath></defs><circle cx="146" cy="112" r="64" fill="${B3}"/><circle cx="214" cy="112" r="64" fill="${B3}"/><circle cx="214" cy="112" r="64" fill="${B2}" clip-path="url(#i3c${SFX})"/>` +
        `<circle cx="146" cy="112" r="64" fill="none" stroke="${W}" stroke-width="2"/><circle cx="214" cy="112" r="64" fill="none" stroke="${W}" stroke-width="2"/>` + tri(182, 112, 30, B) + cap('consent ∩ provider = play')),
    ],
    heights: [
      svg(screen(80, 40, 168, 96, { on: true }) + measure(272, 40, 136, '315') + ln('M80 160 H248', { c: B, w: 1.5 }) + ln('M80 153 V167 M248 153 V167', { c: B, w: 1.5 }) + t(164, 186, '560', { a: 'middle', s: 14, w: 700, c: B }) + cap('the aspect ratio, known up front')),
      svg(bars(60, 28, [190, 140]) + screen(60, 60, 200, 108, { on: true, da: '6 5' }) + bars(60, 182, [180]) + measure(288, 60, 168, '315') + cap('space reserved, no jump')),
      svg(measure(96, 56, 176) + mark(sp('315', K), 140, 80) + t(266, 140, 'px', { s: 20, c: M }) + cap('reserved before the embed loads')),
    ],
  });
  const SETS = [
    ['hosted', 'Hosted iframes', 'We wrap third-party embed code in our own iframe: isolated, sized before it loads, with a fallback.'],
    ['ids', 'Content IDs', 'A short, permanent ID per URL. Use it as the iframe source and old posts update themselves.'],
    ['evergreen', 'Evergreen refresh', 'Thumbnails expire, players move. Hosted embeds follow the change; copied code does not.'],
    ['click', 'Click-to-play', 'A cover image first; the player loads only when the reader presses play.'],
    ['consent', 'Consent gates', 'Ask before loading third-party media that sets cookies. One parameter to turn on.'],
    ['heights', 'Predicted heights', 'Space is reserved before the embed loads, so the page does not jump.'],
  ];
  const TAKES = ['Diagram', 'Interface', 'Mark'];
  const T = (bg, K, B, B2, B3, G, M) => ({ bg, K, B, B2, B3, G, M });
  const THEMES = {
    mono: { label: 'Mono', tile: false, c: T('#ffffff', '#0a0a0a', '#0055ff', '#99bbff', '#e0eaff', '#d6d6d6', '#6b6b6b') },
    tint: { label: 'Tint', tile: true, c: T('#eef3ff', '#0b1533', '#0055ff', '#8fb2ff', '#d3e1ff', '#c4d2ee', '#56648a') },
    ink: { label: 'Ink', tile: true, c: T('#0b1020', '#ffffff', '#4d88ff', '#2b4c99', '#18284d', '#3a4560', '#9aa3b8') },
    blue: { label: 'Blue', tile: true, c: T('#0055ff', '#0b1533', '#ffffff', '#99bbff', '#3a78ff', '#5c8dff', '#e0eaff') },
  };
  function art(key, take, theme) {
    /* theme: a key of THEMES, or a { id, tile, c } object (I15 passes its own hues) */
    const th = typeof theme === 'string' ? THEMES[theme] : theme, c = th.c;
    K = c.K; B = c.B; B2 = c.B2; B3 = c.B3; G = c.G; M = c.M; W = c.bg; TILE = th.tile; SFX = '-' + (th.id || theme) + take;
    return buildArt()[key][take];
  }
  DEMOS.ill3Art = art;
  DEMOS.ill3Css = () => CSS3;
  const KEY = 'ill3-theme'; let current = 'mono';
  try { current = localStorage.getItem(KEY) || current; } catch (e) {}
  if (!THEMES[current]) current = 'mono';
  const CSS3 = `
.il3{background:#fff;container-type:inline-size}
.il3-bar{display:flex;gap:4px;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px dashed #e2e2e2;font:500 11px 'JetBrains Mono',monospace;color:#888}
.il3-bar div{display:flex;gap:4px}
.il3-bar button{height:28px;padding:0 12px;border:1px solid #e2e2e2;border-radius:7px;background:#fff;font:500 11px 'JetBrains Mono',monospace;color:#666;cursor:pointer}
.il3-bar button.on{background:#0055ff;border-color:#0055ff;color:#fff}
.il3-row{display:grid;grid-template-columns:minmax(150px,1fr) repeat(3,1.4fr);border-bottom:1px dashed #e2e2e2}
.il3-head{padding:22px 18px 22px 16px}
.il3-head h4{margin:0 0 8px;font:800 clamp(14px,1.6cqw,18px)/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:-.01em}
.il3-head p{margin:0;font:400 12px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#555}
.il3-cell{position:relative;padding:18px 16px 14px;border-left:1px dashed #e2e2e2;min-width:0}
.il3-cell svg{display:block;width:100%;height:auto}
.il3-cell .tk{margin-top:8px;font:500 10px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#0055ff}
.il3-copy{position:absolute;right:8px;top:8px;z-index:1;height:24px;padding:0 8px;border:1px solid #e2e2e2;border-radius:6px;background:#fff;font:500 10px 'JetBrains Mono',monospace;color:#777;cursor:pointer;opacity:0;transition:opacity .2s}
.il3-cell:hover .il3-copy{opacity:1}
@container (max-width:820px){.il3-row{grid-template-columns:repeat(3,1fr)}.il3-head{grid-column:1/-1;padding-bottom:0}.il3-cell:nth-child(2){border-left:0}}
@container (max-width:520px){.il3-row{grid-template-columns:1fr}.il3-cell{border-left:0}}
`;
  DEMOS.register('ill-system-rich', {
    group: 'ill', title: 'Rich Media · one system, three takes',
    blurb: 'I01 made consistent: one 360 × 240 canvas, 2 px lines, the same parts everywhere (frame, screen with a play mark, node, tag, grey text bars, a blue measure), a caption on one baseline and one blue accent per drawing. Each feature is drawn three ways: Diagram, Interface, Mark. Themes Mono / Tint / Ink / Blue are all brand blue. Hover a drawing to copy its SVG.',
    mount(stage) {
      const { h } = DEMOS;
      if (!document.getElementById('css-ill3')) document.head.appendChild(h('style', { id: 'css-ill3' }, CSS3));
      const body = h('div'), btns = Object.entries(THEMES).map(([k, th]) => { const b = h('button', { type: 'button', 'data-k': k }, th.label); b.addEventListener('click', () => { current = k; try { localStorage.setItem(KEY, k); } catch (e) {} dispatchEvent(new CustomEvent('ill3-theme')); }); return b; });
      const render = () => {
        btns.forEach(b => b.classList.toggle('on', b.dataset.k === current));
        body.replaceChildren(...SETS.map(([key, title, text]) => h('div', { class: 'il3-row' }, h('div', { class: 'il3-head' }, h('h4', null, title), h('p', null, text)),
          ...TAKES.map((tk, i) => { const markup = art(key, i, current); return h('div', { class: 'il3-cell' }, copyBtn(h, 'il3-copy', markup), h('div', { html: markup }), h('div', { class: 'tk' }, tk)); }))));
      };
      render(); addEventListener('ill3-theme', render);
      stage.appendChild(h('div', { class: 'il3' }, h('div', { class: 'il3-bar' }, h('span', null, 'Diagram · Interface · Mark'), h('div', null, ...btns)), body));
      return () => removeEventListener('ill3-theme', render);
    },
  });
})();
