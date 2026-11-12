/* I14 · one system, more accents: the I13 Tint take (360 × 240, same parts, caption baseline) with two or three colours
   next to Iframely blue. Each colour has one job in every drawing, so the set stays consistent:
     blue    Iframely: our iframe, the ID, the //, the chosen option
     source  the third party: provider code, the original URL, the cover, what is old
     signal  time, gates and measures: refresh, consent, reserved height
     media   play marks (only in the three-accent palette; otherwise blue)
   Palettes switch at the top right (localStorage 'ill4-pal'). Group 'ill', mount(stage). */
(() => {
  const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
  const K = '#0b1533', B = '#0055ff', B2 = '#8fb2ff', B3 = '#d3e1ff', G = '#c4d2ee', M = '#56648a', W = '#eef3ff';
  let I, I3, S, S3, P, SFX = '';
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 13}"${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.c || K}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
  const sp = (s, c = B, w) => `<tspan fill="${c}"${w ? ` font-weight="${w}"` : ''}>${s}</tspan>`;
  const ln = (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.c || K}" stroke-width="${o.w || 2}"${o.da ? ` stroke-dasharray="${o.da}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
  const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.r ? ` rx="${o.r}"` : ''} fill="${o.f || 'none'}"${o.st ? ` stroke="${o.st}" stroke-width="${o.sw || 2}"` : ''}${o.da ? ` stroke-dasharray="${o.da}"` : ''}/>`;
  const svg = inner => `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" font-family="${MONO}"><rect width="360" height="240" rx="16" fill="${W}"/>${inner}</svg>`;
  const len = s => s.replace(/&\w+;/g, 'x').replace(/<[^>]+>/g, '').length;
  const cap = s => t(180, 220, s, { a: 'middle', s: 12, c: M });
  const dot = (x, y, c = K, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const frame = (x, y, w, h, o = {}) => rect(x, y, w, h, { r: 8, st: o.c || K, f: o.f || W, da: o.da });
  const tri = (cx, cy, s, c) => `<path d="M${cx - s * .4} ${cy - s * .5} L${cx + s * .55} ${cy} L${cx - s * .4} ${cy + s * .5} Z" fill="${c}"/>`;
  const screen = (x, y, w, h, o = {}) => frame(x, y, w, h, o) + (o.inner ? rect(x + 8, y + 8, w - 16, h - 16, { r: 4, st: B, sw: 1.5, da: '5 4' }) : '') + tri(x + w / 2, y + h / 2, Math.min(w, h) * .3, o.pc || P);
  const bars = (x, y, ws, o = {}) => ws.map((w, i) => rect(x, y + i * 12, w, 6, { r: 3, f: i === 0 && o.title ? K : G })).join('');
  /* tag: outline (plain), tinted (a role colour + its light tint) or solid */
  const tag = (cx, cy, s, o = {}) => { const w = len(s) * 7.8 + 22; return rect(cx - w / 2, cy - 12, w, 24, { r: 12, f: o.solid || o.tint || W, st: o.solid || o.c || K, sw: 1.6 }) + t(cx, cy + 4.5, s, { a: 'middle', s: 12, c: o.solid ? '#fff' : K, w: o.solid ? 700 : 400 }); };
  const head = (x, y, dx, dy, c = K) => { const L = Math.hypot(dx, dy); dx /= L; dy /= L; const bx = x - dx * 11, by = y - dy * 11, px = -dy * 5.5, py = dx * 5.5; return `<path d="M${x} ${y} L${(bx + px).toFixed(1)} ${(by + py).toFixed(1)} L${(bx - px).toFixed(1)} ${(by - py).toFixed(1)} Z" fill="${c}"/>`; };
  const mark = (s, y = 136, size = 72) => t(180, y, s, { a: 'middle', s: size, w: 800, ls: -2 });
  const cursor = (x, y) => `<path d="M${x} ${y} l0 34 l8.5 -8.5 l6.5 14 l6.5 -3 l-6.5 -14 l11.5 0 z" fill="${K}" stroke="${W}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const measure = (x, y0, y1, label) => ln(`M${x} ${y0} V${y1}`, { c: S, w: 1.5 }) + ln(`M${x - 7} ${y0} H${x + 7} M${x - 7} ${y1} H${x + 7}`, { c: S, w: 1.5 }) + (label ? t(x + 14, (y0 + y1) / 2 + 5, label, { s: 14, w: 700, c: S }) : '');

  const buildArt = () => ({
    hosted: [
      svg([['&lt;script&gt;', 64], ['oEmbed', 112], ['og:video', 160]].map(([s, y]) => tag(82, y, s, { c: I, tint: I3 }) + ln(`M${82 + (len(s) * 7.8 + 22) / 2} ${y} C170 ${y} 160 112 206 112`, { w: 1.6, c: I })).join('') + dot(206, 112, B, 7) + screen(224, 64, 104, 96, { inner: true }) + cap('third-party code, our iframe')),
      svg(frame(40, 24, 280, 172) + bars(58, 42, [150, 110], { title: true }) + rect(58, 78, 244, 100, { r: 8, f: I3 }) + screen(58, 78, 244, 100, { inner: true, f: 'none' }) + tag(254, 78, 'iframe', { solid: B }) + cap('isolated, sized, with a fallback')),
      svg(mark(`${sp('&lt;', I)}${sp('//')}${sp('&gt;', I)}`, 140, 84) + cap('one iframe for any provider')),
    ],
    ids: [
      svg(ln('M64 40 V176') + dot(64, 40, I, 6) + t(80, 45, 'youtube.com/watch?v=dQw4', { c: I }) + ln('M64 98 H104') + dot(104, 98, B, 7) + t(120, 103, `id ${sp('x7Kd2', B, 700)}`) +
        ln('M104 98 V140 H144') + dot(144, 140) + t(160, 145, 'player.html') + ln('M64 176 H104') + dot(104, 176) + t(120, 181, 'thumb.jpg') + cap('one URL, one ID, every asset')),
      svg(t(180, 44, 'cdn.iframe.ly/', { a: 'middle', s: 13, c: M }) + frame(70, 60, 220, 120) + t(90, 90, 'id', { s: 12, c: M }) + t(90, 140, 'x7Kd2', { s: 40, w: 800 }) + rect(90, 154, 148, 4, { f: B }) + dot(266, 84, S, 6) + `<circle cx="266" cy="84" r="11" fill="none" stroke="${S}" stroke-width="1.5" opacity=".45"/>` + cap('use it as the iframe source')),
      svg(t(180, 62, 'youtube.com/watch?v=dQw4…', { a: 'middle', s: 13, c: I }) + ln('M180 76 V92') + head(180, 100, 0, 1) + mark(sp('x7Kd2', B), 164, 64) + cap('short and permanent')),
    ],
    evergreen: [
      svg(rect(40, 48, 100, 64, { r: 8, f: I3 }) + screen(40, 48, 100, 64, { c: I, da: '5 4', f: 'none', pc: I }) + screen(220, 48, 100, 64) + ln('M90 150 H262', { c: S }) + head(270, 150, 1, 0, S) + dot(90, 150, I, 6) + dot(270, 150, B, 7) +
        ln('M90 112 V150 M270 112 V150', { w: 1.5, da: '2 4' }) + t(90, 182, '2012', { a: 'middle', c: I }) + t(270, 182, '2026', { a: 'middle', w: 700, c: B }) + cap('refreshed every 24 h')),
      svg(ln('M106 66 A78 78 0 0 1 254 66', { c: S }) + head(258, 74, .45, .9, S) + ln('M254 146 A78 78 0 0 1 106 146', { c: S }) + head(102, 138, -.45, -.9, S) + screen(134, 76, 92, 60, { f: S3 }) + cap('thumbnails and players stay current')),
      svg(mark(`24${sp('h', B)}`, 146, 80) + ln('M118 64 A86 50 0 0 1 242 64', { c: S }) + head(248, 72, .6, .8, S) + cap('every 24 hours, without a redeploy')),
    ],
    click: [
      svg(ln('M60 110 H300') + [[60, 'cover', '12 KB', I], [180, 'press', '', K], [300, 'player', '1.4 MB', B]].map(([x, l, v, c], i) => dot(x, 110, c, i === 1 ? 5 : 7) + t(x, 142, l, { a: 'middle', w: i === 1 ? 400 : 700, c }) + (v ? t(x, 86, v, { a: 'middle', s: 12, c: S, w: 700 }) : cursor(x - 2, 66))).join('') + cap('the player loads on press')),
      svg(rect(70, 32, 220, 152, { r: 8, f: I3 }) + frame(70, 32, 220, 152, { da: '6 5', c: I, f: 'none' }) + `<circle cx="180" cy="108" r="30" fill="${W}" stroke="${K}" stroke-width="2"/>` + tri(182, 108, 26, P) + cursor(204, 128) + cap('a cover image first')),
      svg(mark(`${sp('0', S)} KB`, 140, 76) + rect(186, 158, 78, 4, { f: B }) + cap('until the reader presses play')),
    ],
    consent: [
      svg(dot(64, 112) + t(64, 90, 'reader', { a: 'middle' }) + ln('M64 112 H160') + rect(160, 76, 18, 72, { r: 4, f: S, st: S }) + t(169, 172, 'ask', { a: 'middle', s: 12, c: S, w: 700 }) + ln('M178 112 H210', { da: '3 5' }) + screen(216, 80, 104, 64) + cap('ask first, then load')),
      svg(rect(40, 24, 280, 172, { r: 8, f: I3 }) + screen(40, 24, 280, 172, { c: I, f: 'none', pc: I }) + frame(84, 62, 192, 100, { c: K }) + rect(84, 62, 6, 100, { f: S }) + t(102, 92, 'Load YouTube?', { w: 700 }) + bars(102, 104, [120]) + tag(140, 140, 'no') + tag(218, 140, 'allow', { solid: B }) + cap('one parameter to turn on')),
      svg(`<defs><clipPath id="i4c${SFX}"><circle cx="146" cy="112" r="64"/></clipPath></defs><circle cx="146" cy="112" r="64" fill="${S3}"/><circle cx="214" cy="112" r="64" fill="${I3}"/><circle cx="214" cy="112" r="64" fill="${B3}" clip-path="url(#i4c${SFX})"/>` +
        `<circle cx="146" cy="112" r="64" fill="none" stroke="${S}" stroke-width="1.5"/><circle cx="214" cy="112" r="64" fill="none" stroke="${I}" stroke-width="1.5"/>` + tri(182, 112, 30, P) + t(112, 116, 'consent', { a: 'middle', s: 11, c: S, w: 700 }) + t(250, 116, 'provider', { a: 'middle', s: 11, c: I, w: 700 }) + cap('consent ∩ provider = play')),
    ],
    heights: [
      svg(screen(80, 40, 168, 96) + measure(272, 40, 136, '315') + ln('M80 160 H248', { c: S, w: 1.5 }) + ln('M80 153 V167 M248 153 V167', { c: S, w: 1.5 }) + t(164, 186, '560', { a: 'middle', s: 14, w: 700, c: S }) + cap('the aspect ratio, known up front')),
      svg(bars(60, 28, [190, 140]) + rect(60, 60, 200, 108, { r: 8, f: S3 }) + screen(60, 60, 200, 108, { da: '6 5', f: 'none' }) + bars(60, 182, [180]) + measure(288, 60, 168, '315') + cap('space reserved, no jump')),
      svg(measure(96, 56, 176) + mark(`315`, 140, 80) + t(266, 140, 'px', { s: 20, c: S, w: 700 }) + rect(124, 158, 112, 4, { f: B }) + cap('reserved before the embed loads')),
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
  /* source, source tint, signal, signal tint, media */
  const PALS = {
    coral: { label: 'Coral + Mint', c: ['#ff5a36', '#ffd9cf', '#0f9f68', '#c8eedb', B] },
    violet: { label: 'Violet + Amber', c: ['#7048e8', '#ddd4ff', '#d98e00', '#ffe6a6', B] },
    pink: { label: 'Pink + Lime', c: ['#e0457b', '#fbd3e2', '#4f9a00', '#dbf1b4', B] },
    three: { label: 'Coral + Mint + Amber', c: ['#ff5a36', '#ffd9cf', '#0f9f68', '#c8eedb', '#f0a000'] },
  };
  function art(key, take, pal) {
    [I, I3, S, S3, P] = PALS[pal].c; SFX = '-' + pal + take;
    return buildArt()[key][take];
  }
  DEMOS.ill4Art = art;
  const KEY = 'ill4-pal'; let current = 'coral';
  try { current = localStorage.getItem(KEY) || current; } catch (e) {}
  if (!PALS[current]) current = 'coral';
  const CSS = `
.il3-legend{display:flex;gap:14px;flex-wrap:wrap}
.il3-legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:-1px}
`;
  DEMOS.register('ill-system-rich-accents', {
    group: 'ill', title: 'Rich Media · one system, more accents',
    blurb: 'I13 Tint with two or three colours next to Iframely blue, each with one job in every drawing: blue is Iframely (our iframe, the ID, the //, the chosen option), the source colour is the third party (provider code, the original URL, the cover, the old version), the signal colour is time, gates and measures. The three-accent palette also gives play marks their own media colour. Hover a drawing to copy its SVG.',
    mount(stage) {
      const { h } = DEMOS;
      if (!document.getElementById('css-ill4')) document.head.appendChild(h('style', { id: 'css-ill4' }, CSS));
      /* reuse the I13 layout styles (demos/ill3.js) */
      if (!document.getElementById('css-ill3')) document.head.appendChild(h('style', { id: 'css-ill3' }, DEMOS.ill3Css()));
      const body = h('div'), legend = h('span', { class: 'il3-legend' });
      const btns = Object.entries(PALS).map(([k, p]) => { const b = h('button', { type: 'button', 'data-k': k }, p.label); b.addEventListener('click', () => { current = k; try { localStorage.setItem(KEY, k); } catch (e) {} dispatchEvent(new CustomEvent('ill4-pal')); }); return b; });
      const copy = markup => { const btn = h('button', { class: 'il3-copy', type: 'button' }, 'copy svg'); btn.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(markup) : Promise.reject()).then(() => { btn.textContent = 'copied'; }, () => { btn.textContent = 'copy failed'; }); setTimeout(() => { btn.textContent = 'copy svg'; }, 1400); }); return btn; };
      const render = () => {
        btns.forEach(b => b.classList.toggle('on', b.dataset.k === current));
        const c = PALS[current].c, roles = [[B, 'iframely'], [c[0], 'source'], [c[2], 'signal']].concat(c[4] !== B ? [[c[4], 'media']] : []);
        legend.innerHTML = roles.map(([col, n]) => `<span><i style="background:${col}"></i>${n}</span>`).join('');
        body.replaceChildren(...SETS.map(([key, title, text]) => h('div', { class: 'il3-row' }, h('div', { class: 'il3-head' }, h('h4', null, title), h('p', null, text)),
          ...TAKES.map((tk, i) => { const markup = art(key, i, current); return h('div', { class: 'il3-cell' }, copy(markup), h('div', { html: markup }), h('div', { class: 'tk' }, tk)); }))));
      };
      render(); addEventListener('ill4-pal', render);
      stage.appendChild(h('div', { class: 'il3' }, h('div', { class: 'il3-bar' }, legend, h('div', null, ...btns)), body));
      return () => removeEventListener('ill4-pal', render);
    },
  });
})();
