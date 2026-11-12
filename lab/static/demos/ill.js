/* ill-* · small product illustrations for the prototype's product pages, after a reference board (mono labels, thin black
   line diagrams, one accent) with the accent switched to Iframely blue. Static inline SVG, viewBox 360 × 240, so each one
   can be copied straight into a Svelte component (every card has a "copy svg" button). Titles and text are the feature
   copy from website/src/routes/{embeds,preview-api,data-api,publishers}. Group 'ill', mount(stage). */
(() => {
  /* palette slots, set per tile by paint(): line, accent, accent mid, accent light, placeholder grey, muted text, knockout (tile bg) */
  let K, B, B2, B3, G, M, W, SFX = '', TILE = false;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 15}"${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.c || K}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''}>${s}</text>`;
  const dot = (x, y, r = 6, c = K) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const ln = (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.c || K}" stroke-width="${o.w || 2}"${o.da ? ` stroke-dasharray="${o.da}"` : ''} stroke-linecap="${o.cap || 'butt'}" stroke-linejoin="round"/>`;
  const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.r ? ` rx="${o.r}"` : ''} fill="${o.f || 'none'}"${o.st ? ` stroke="${o.st}" stroke-width="${o.sw || 2}"` : ''}${o.da ? ` stroke-dasharray="${o.da}"` : ''}${o.clip ? ` clip-path="url(#${o.clip})"` : ''}/>`;
  const sp = (s, c = B, w) => `<tspan fill="${c}"${w ? ` font-weight="${w}"` : ''}>${s}</tspan>`;
  const svg = inner => `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" font-family="'JetBrains Mono', ui-monospace, Menlo, monospace">${TILE ? `<rect width="360" height="240" rx="16" fill="${W}"/>` : ''}${inner}</svg>`;
  /* arrowhead at (x,y) pointing along (dx,dy) */
  const head = (x, y, dx, dy, c = K) => { const L = Math.hypot(dx, dy); dx /= L; dy /= L; const bx = x - dx * 12, by = y - dy * 12, px = -dy * 6, py = dx * 6; return `<path d="M${x} ${y} L${(bx + px).toFixed(1)} ${(by + py).toFixed(1)} L${(bx - px).toFixed(1)} ${(by - py).toFixed(1)} Z" fill="${c}"/>`; };

  const buildArt = () => ({
    hosted: svg(
      t(180, 62, `src="${sp('//', B, 800)}cdn.iframe.ly/x7Kd2"`, { a: 'middle' }) + dot(180, 82, 5) + ln('M180 82 V110') +
      rect(90, 110, 180, 104, { r: 8, st: K }) + rect(100, 120, 160, 84, { r: 4, st: B, sw: 1.5, da: '5 4' }) +
      `<path d="M168 146 L196 162 L168 178 Z" fill="${B}"/>`),
    ids: svg(
      ln('M60 50 V190') + dot(60, 50) + t(74, 55, 'youtube.com/watch?v=dQw4') +
      ln('M60 108 H100') + dot(100, 108) + t(114, 113, `id ${sp('x7Kd2')}`) +
      ln('M100 108 V150 H138') + dot(138, 150) + t(152, 155, `player${sp('.html')}`) +
      ln('M60 190 H100') + dot(100, 190) + t(114, 195, `thumb${sp('.jpg')}`)),
    evergreen: svg(
      ln('M104.8 92.6 A80 80 0 0 1 255.2 92.6') + head(258.6, 102, .342, .94) +
      ln('M255.2 147.4 A80 80 0 0 1 104.8 147.4') + head(101.4, 138, -.342, -.94) +
      rect(146, 98, 68, 46, { r: 4, st: K }) + rect(152, 104, 56, 18, { f: B }) + rect(152, 128, 40, 4, { f: K }) + rect(152, 135, 26, 3, { f: G }) +
      t(50, 125, '2012', { s: 14 }) + t(272, 125, '2026', { s: 14, w: 700, c: B }) + t(180, 226, 'refreshed every 24 h', { a: 'middle', s: 12, c: M })),
    click: svg(
      rect(70, 40, 220, 136, { r: 8, st: B, sw: 1.5, da: '6 5' }) +
      `<circle cx="180" cy="108" r="30" fill="none" stroke="${K}" stroke-width="2"/><path d="M171 94 L195 108 L171 122 Z" fill="${K}"/>` +
      `<path d="M206 128 l0 36 l9 -9 l7 15 l7 -3 l-7 -15 l12 0 z" fill="${K}" stroke="${W}" stroke-width="1.5" stroke-linejoin="round"/>` +
      t(180, 214, `${sp('0 KB', B, 700)} until play`, { a: 'middle', s: 13, c: M })),
    consent: svg(
      `<defs><clipPath id="ill-c5${SFX}"><circle cx="145" cy="120" r="72"/></clipPath></defs>` +
      `<circle cx="145" cy="120" r="72" fill="${B3}"/><circle cx="215" cy="120" r="72" fill="${B3}"/><circle cx="215" cy="120" r="72" fill="${B2}" clip-path="url(#ill-c5${SFX})"/>` +
      `<circle cx="145" cy="120" r="72" fill="none" stroke="${W}" stroke-width="2"/><circle cx="215" cy="120" r="72" fill="none" stroke="${W}" stroke-width="2"/>` +
      t(108, 125, 'consent', { a: 'middle', s: 13 }) + t(252, 125, 'provider', { a: 'middle', s: 13 }) + t(180, 126, 'play', { a: 'middle', s: 17, w: 800 })),
    heights: svg(
      rect(60, 34, 180, 7, { r: 3, f: G }) + rect(60, 48, 136, 7, { r: 3, f: G }) +
      rect(60, 70, 200, 114, { r: 6, st: K }) + `<path d="M150 113 L174 127 L150 141 Z" fill="${B}"/>` +
      rect(60, 198, 190, 7, { r: 3, f: G }) + rect(60, 212, 120, 7, { r: 3, f: G }) +
      ln('M286 70 V184', { c: B, w: 1.5 }) + ln('M279 70 H293', { c: B, w: 1.5 }) + ln('M279 184 H293', { c: B, w: 1.5 }) + t(299, 132, '315', { s: 14, w: 700, c: B })),

    meta: svg(
      t(40, 102, 'Kerala', { s: 34, w: 800 }) + t(190, 102, 'Bonobo', { s: 34 }) +
      rect(40, 114, 122, 5, { f: B }) + rect(190, 114, 122, 5, { f: B }) +
      t(40, 138, 'title', { s: 13, c: B }) + t(190, 138, 'author', { s: 13, c: B }) +
      rect(40, 164, 52, 38, { r: 3, st: K }) + ln('M44 198 L60 180 L70 190 L78 182 L88 198') + dot(80, 173, 3.5, B) + t(104, 188, 'image 1200×630', { s: 13, c: M })),
    card: svg(
      `<defs><pattern id="ill-h8${SFX}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${B}" stroke-width="2"/></pattern><clipPath id="ill-k8${SFX}"><rect x="70" y="36" width="220" height="168" rx="10"/></clipPath></defs>` +
      rect(70, 36, 220, 82, { f: 'url(#ill-h8${SFX})', clip: 'ill-k8${SFX}' }) + rect(70, 36, 220, 168, { r: 10, st: K }) + ln('M70 118 H290') +
      rect(86, 132, 150, 10, { f: K }) + rect(86, 152, 180, 6, { r: 3, f: G }) + rect(86, 164, 130, 6, { r: 3, f: G }) +
      dot(92, 186, 5, B) + t(104, 190, 'nytimes.com', { s: 12, c: M })),
    toggle: svg(
      rect(150, 30, 60, 30, { r: 15, st: K }) + dot(195, 45, 10, B) + t(222, 50, 'rich', { s: 13 }) +
      ln('M180 60 V80 M100 80 H260 M100 80 V98 M260 80 V98') +
      rect(40, 98, 120, 92, { r: 8, st: K }) + rect(52, 110, 96, 36, { r: 3, f: B3 }) + rect(52, 156, 80, 6, { f: K }) + rect(52, 168, 56, 5, { f: G }) +
      rect(200, 98, 120, 92, { r: 8, f: K }) + `<path d="M250 130 L274 144 L250 158 Z" fill="${W}"/>` +
      t(100, 214, 'off', { a: 'middle', s: 13, c: M }) + t(260, 214, 'on', { a: 'middle', s: 13, c: B, w: 700 })),
    shape: svg(
      t(62, 140, '//', { s: 72, w: 800, c: B }) + t(162, 136, '=', { s: 56 }) + t(214, 140, '{}', { s: 72 }) +
      t(180, 200, 'any URL, one response shape', { a: 'middle', s: 12, c: M })),
    agents: svg(
      dot(70, 120, 11, B) + t(70, 96, 'agent', { a: 'middle', s: 13 }) + ln('M81 120 H180') + dot(130, 120, 4) +
      ln('M180 50 V190') + [['title', 50], ['excerpt', 97], ['citation', 143], ['access', 190]].map(([n, y]) => ln(`M180 ${y} H232`) + dot(180, y, 4) + dot(240, y, 9, B) + t(256, y + 5, n, { s: 13 })).join('')),
    chat: svg(
      ln('M70 40 H290 a14 14 0 0 1 14 14 V156 a14 14 0 0 1 -14 14 H112 L84 196 L90 170 H70 a14 14 0 0 1 -14 -14 V54 a14 14 0 0 1 14 -14 Z') +
      t(76, 66, `look ${sp('https://')}…`, { s: 13 }) +
      `<defs><clipPath id="ill-c12${SFX}"><rect x="76" y="80" width="212" height="74" rx="6"/></clipPath></defs>` + rect(76, 80, 74, 74, { f: B, clip: 'ill-c12${SFX}' }) + rect(76, 80, 212, 74, { r: 6, st: K, sw: 1.5 }) +
      rect(162, 96, 108, 7, { f: K }) + rect(162, 112, 90, 5, { f: G }) + rect(162, 124, 66, 5, { f: G }) + dot(166, 141, 3.5, B) + rect(174, 139, 50, 4, { f: G })),

    modes: svg(
      dot(70, 34) + t(84, 39, 'mode=', { s: 13, c: M }) + ln('M70 34 V204') +
      ['meta', 'links', 'entities', 'excerpt', 'fulltext'].map((n, i) => { const y = 70 + i * 33.5, on = i === 3; return ln(`M70 ${y} H104`) + dot(110, y, on ? 8 : 6, on ? B : K) + t(126, y + 5, n, { s: 15, w: on ? 800 : 400, c: on ? B : K }); }).join('')),
    metaList: svg(
      [['title', 150], ['author', 96], ['date', 70], ['canonical', 130], ['language', 40], ['licence', 84]].map(([k, w], i) => { const y = 50 + i * 30; return t(40, y + 5, k, { s: 13, c: B }) + ln(`M${48 + k.length * 7.8} ${y + 1} H170`, { c: G, w: 1.5, da: '2 4' }) + rect(178, y - 4, w, 8, { r: 4, f: i ? G : K }); }).join('')),
    entities: svg(
      t(40, 92, 'Bonobo released', { s: 24 }) + t(40, 164, 'Kerala in 2017.', { s: 24 }) +
      rect(40, 102, 86, 4, { f: B }) + t(40, 122, 'person', { s: 12, c: B }) +
      rect(40, 174, 86, 4, { f: B }) + t(40, 194, 'work', { s: 12, c: B }) +
      rect(184, 174, 58, 4, { f: B }) + t(184, 194, 'date', { s: 12, c: B })),
    links: svg(
      rect(40, 64, 72, 112, { r: 6, st: K }) + [80, 94, 108, 122, 136, 150].map((y, i) => rect(52, y, i === 2 ? 40 : 48, 5, { r: 2, f: i === 2 ? B : G })).join('') +
      [['wikipedia.org', 54], ['bonobo.net', 98], ['youtube.com', 142], ['nytimes.com', 186]].map(([n, y], i) => ln(`M112 120 C170 120 168 ${y} 222 ${y}`, { c: i === 1 ? B : K, w: i === 1 ? 2.5 : 1.5 }) + dot(228, y, 6, i === 1 ? B : K) + t(242, y + 5, n, { s: 13, c: i === 1 ? B : K, w: i === 1 ? 700 : 400 })).join('') +
      t(250, 120, 'rel="author"', { s: 10, c: B })),
    fulltext: svg(
      t(40, 62, `${sp('#')} Kerala`, { s: 22, w: 800 }) + rect(40, 84, 260, 6, { r: 3, f: G }) + rect(40, 98, 240, 6, { r: 3, f: G }) + rect(40, 112, 180, 6, { r: 3, f: G }) +
      t(40, 150, `${sp('&gt;')} a quiet, looping single`, { s: 14, c: M }) +
      t(40, 190, `${sp('[')}Migration${sp('](')}…${sp(')')}`, { s: 15 }) + t(320, 62, '.md', { a: 'end', s: 15, w: 800, c: B })),
    access: svg(
      `<path d="M70 36 H190 L220 66 V210 H70 Z" fill="${W}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>` + ln('M190 36 V66 H220') +
      [84, 98, 112, 126, 140, 154, 168].map((y, i) => rect(86, y, [110, 96, 118, 80, 104, 90, 60][i], 5, { r: 2, f: G })).join('') +
      `<g transform="rotate(-14 240 150)"><circle cx="240" cy="150" r="52" fill="${W}" fill-opacity=".9" stroke="${B}" stroke-width="3"/><circle cx="240" cy="150" r="44" fill="none" stroke="${B}" stroke-width="1.2"/>` +
      t(240, 148, 'ALLOWED', { a: 'middle', s: 13, w: 800, c: B }) + t(240, 166, 'robots.txt', { a: 'middle', s: 10, c: B }) + `</g>`),

    files: svg(
      ln('M56 44 V204') + dot(56, 44) + t(70, 49, 'example.com') +
      ln('M56 84 H96') + dot(96, 84) + t(110, 89, `robots${sp('.txt')}`) +
      ln('M56 124 H96') + dot(96, 124) + t(110, 129, '&lt;head&gt;') +
      ln('M96 124 V162 H134') + dot(134, 162) + t(148, 167, `og${sp(':image')}`) +
      ln('M56 204 H96') + dot(96, 204) + t(110, 209, `llms${sp('.txt')}`)),
    tags: svg(
      ['title', 'description', 'image', 'image:alt'].map((n, i) => rect(36, 46 + i * 40, 150, 28, { r: 6, st: K, sw: 1.6 }) + t(48, 65 + i * 40, `${sp('og:')}${n}`, { s: 13 })).join('') +
      t(208, 134, '+', { a: 'middle', s: 30 }) +
      rect(232, 84, 96, 74, { r: 6, f: B }) + `<path d="M240 150 L266 120 L282 136 L294 124 L320 150 Z" fill="${W}"/><circle cx="306" cy="102" r="7" fill="${W}"/>` +
      t(280, 182, '1200×630', { a: 'middle', s: 12, c: M })),
    purpose: svg(
      [['iframely-embed', 'embed', 62], ['iframely-preview', 'preview', 116], ['iframely-data', 'read', 170]].map(([a, p, y]) => t(150, y + 3, a, { a: 'end', s: 12 }) + dot(160, y, 4) + ln(`M160 ${y} C228 ${y} 228 120 286 120`, { w: 1.6 }) + t(150, y + 17, `purpose=${sp(p, B, 700)}`, { a: 'end', s: 10, c: M })).join('') +
      dot(296, 120, 11, B) + t(296, 152, 'one URL', { a: 'middle', s: 12 })),
    console: svg(
      t(40, 44, 'requests by agent · 7d', { s: 12, c: M }) +
      [['preview', 180, K, '18.2k'], ['embed', 132, K, '11.9k'], ['data', 92, B, '6.4k'], ['unknown', 36, G, '1.1k']].map(([n, w, c, v], i) => { const y = 78 + i * 40; return t(40, y + 5, n, { s: 13 }) + rect(118, y - 9, w, 18, { r: 3, f: c }) + t(126 + w, y + 5, v, { s: 12, c: M }); }).join('')),
  });

  const SETS = {
    'ill-rich': ['Rich Media', [
      ['hosted', 'Hosted iframes', 'We wrap third-party embed code in our own iframe: isolated, sized before it loads, with a fallback.'],
      ['ids', 'Content IDs', 'A short, permanent ID per URL. Use it as the iframe source and old posts update themselves.'],
      ['evergreen', 'Evergreen refresh', 'Thumbnails expire, players move. Hosted embeds follow the change; copied code does not.'],
      ['click', 'Click-to-play', 'A cover image first; the player loads only when the reader presses play.'],
      ['consent', 'Consent gates', 'Ask before loading third-party media that sets cookies. One parameter to turn on.'],
      ['heights', 'Predicted heights', 'Space is reserved before the embed loads, so the page does not jump.']]],
    'ill-preview': ['Preview API', [
      ['meta', 'Metadata', 'Title, description, site, author, dates and thumbnails, normalised across every source.'],
      ['card', 'Summary cards', 'A hosted card for any URL without a player, light or dark, large or small.'],
      ['toggle', 'Rich Media, on or off', 'Players for 1,900 providers in the same response. Turn them off when you only need metadata.'],
      ['shape', 'One request shape', 'One call and one JSON shape, whatever the link points at.'],
      ['chat', 'Chat and collaboration', 'Previews at chat volume, cached per URL.'],
      ['agents', 'AI agents', 'Add the Data API to read the page behind the preview.']]],
    'ill-data': ['Data API', [
      ['modes', 'Five processing modes', 'meta, links, entities, excerpt, fulltext: one per reason you read.'],
      ['metaList', 'meta', 'Title, description, author, site, date, canonical URL, language, licence.'],
      ['entities', 'entities', 'schema.org entities from the page: articles, products, events, people, organisations.'],
      ['links', 'excerpt', 'A snippet, the heading outline, and hyperlinks with their rel values.'],
      ['fulltext', 'fulltext', 'The article as clean Markdown.'],
      ['access', 'access', 'The decision for each of the above, with the signals behind it.']]],
    'ill-pub': ['Publishers', [
      ['files', 'Say it once in your files', 'robots.txt, meta tags and llms.txt. We read them on every request.'],
      ['tags', 'Four tags and one image', 'Title, description, a 1200 × 630 image under 1 MB, and its alt text.'],
      ['purpose', 'Every request declares a purpose', 'Three agents, three reasons, one URL at a time.'],
      ['console', 'Publisher Console', 'See who fetches your pages, and why. Free.']]],
  };

  /* themes: mono (the first pass), pastel tiles, solid tiles. Each tile: bg, line, accent, accent mid, accent light, grey, muted. */
  const T = (bg, K, B, B2, B3, G, M) => ({ bg, K, B, B2, B3, G, M });
  const THEMES = {
    mono: { label: 'Mono', tile: false, tiles: [T('#ffffff', '#0a0a0a', '#0055ff', '#9fbdff', '#dbe6ff', '#cfcfcf', '#6b6b6b')] },
    pastel: { label: 'Pastel', tile: true, tiles: [
      T('#eeeaff', '#17142e', '#5b3df5', '#b4a5ff', '#dcd4ff', '#c9c0f0', '#5d5878'),
      T('#e3f6ec', '#0f2419', '#0a8f5a', '#78d3a5', '#c2ecd5', '#b5dcc6', '#4d6b5b'),
      T('#ffece2', '#2a150c', '#f2551d', '#ffa983', '#ffd5c2', '#efcab8', '#7a5547'),
      T('#e5f0ff', '#0e1a33', '#0055ff', '#8db4ff', '#cadeff', '#bccfee', '#506080'),
      T('#fff4d1', '#2a2108', '#b07800', '#f4c542', '#fde8a6', '#e8d6a0', '#6f6240'),
      T('#fde8f1', '#2e0f1e', '#d63384', '#f597c3', '#f9cfe1', '#ebc3d4', '#7a5466')] },
    solid: { label: 'Solid', tile: true, tiles: [
      T('#0055ff', '#ffffff', '#d7ff3f', '#7aa2ff', '#2f72ff', '#6f9bff', '#cfdcff'),
      T('#111318', '#ffffff', '#7aa2ff', '#3d4a6b', '#232838', '#3a3f4c', '#9aa1b0'),
      T('#ff6b3d', '#1a0f0a', '#ffffff', '#ffb08f', '#ff8a5f', '#ffa07c', '#5a2a18'),
      T('#c9f25d', '#10160a', '#0055ff', '#9fd43a', '#b6e64a', '#a9d84a', '#3f5212'),
      T('#6b4dff', '#ffffff', '#ffd84d', '#a593ff', '#7d63ff', '#8f7bff', '#ddd5ff'),
      T('#12b886', '#062018', '#ffffff', '#7fe0c0', '#3fcf9f', '#5ad6ac', '#0b4a37')] },
  };
  /* render one illustration with one tile's colours */
  function art(key, theme, i) {
    const th = THEMES[theme], c = th.tiles[i % th.tiles.length];
    K = c.K; B = c.B; B2 = c.B2; B3 = c.B3; G = c.G; M = c.M; W = c.bg; TILE = th.tile; SFX = '-' + theme + i;
    return buildArt()[key];
  }
  const KEY = 'ill-theme'; let current = 'pastel';
  try { current = localStorage.getItem(KEY) || current; } catch (e) {}
  if (!THEMES[current]) current = 'pastel';

  const CSS = `
.ill{background:#fff;container-type:inline-size}
.ill-bar{display:flex;gap:4px;justify-content:flex-end;padding:10px 12px;border-bottom:1px dashed #e2e2e2}
.ill-bar button{height:28px;padding:0 12px;border:1px solid #e2e2e2;border-radius:7px;background:#fff;font:500 11px 'JetBrains Mono',monospace;color:#666;cursor:pointer}
.ill-bar button.on{background:#0a0a0a;border-color:#0a0a0a;color:#fff}
.ill-grid{display:grid;grid-template-columns:repeat(3,1fr)}
.ill-card{position:relative;padding:22px clamp(18px,2.6cqw,34px) 34px;border-left:1px dashed #e2e2e2;border-bottom:1px dashed #e2e2e2;min-width:0}
.ill-card:nth-child(3n+1){border-left:0}
.ill-card::after{content:"+";position:absolute;right:-5px;bottom:-10px;font:12px/1 'JetBrains Mono',monospace;color:#c4c4c4}
.ill-art svg{display:block;width:100%;height:auto}
.ill-card h4{margin:14px 0 8px;font:800 clamp(15px,1.7cqw,19px)/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:-.01em}
.ill-card p{margin:0;font:400 clamp(12px,1.3cqw,14px)/1.65 'JetBrains Mono',ui-monospace,monospace;color:#333;max-width:36ch}
.ill-copy{position:absolute;right:10px;top:10px;z-index:1;height:24px;padding:0 8px;border:1px solid #e2e2e2;border-radius:6px;background:#fff;font:500 10px 'JetBrains Mono',monospace;color:#777;cursor:pointer;opacity:0;transition:opacity .2s}
.ill-card:hover .ill-copy{opacity:1}
@container (max-width:760px){.ill-grid{grid-template-columns:repeat(2,1fr)}.ill-card:nth-child(3n+1){border-left:1px dashed #e2e2e2}.ill-card:nth-child(2n+1){border-left:0}}
@container (max-width:460px){.ill-grid{grid-template-columns:1fr}.ill-card{border-left:0!important}}
`;
  let setNo = 0;
  for (const [name, [product, items]] of Object.entries(SETS)) {
    const offset = setNo++ * 2; /* each page starts on a different tile colour */
    DEMOS.register(name, {
      group: 'ill', title: product + ' · ' + items.length + ' illustrations',
      blurb: 'Feature illustrations for the ' + product + ' page, with that page\'s feature titles and copy. Switch Mono / Pastel / Solid at the top right (the choice applies to every set); hover a card to copy its SVG in the current colours.',
      mount(stage) {
        const { h } = DEMOS;
        if (!document.getElementById('css-ill')) document.head.appendChild(h('style', { id: 'css-ill' }, CSS));
        const grid = h('div', { class: 'ill-grid' }), bar = h('div', { class: 'ill-bar' });
        const btns = Object.entries(THEMES).map(([k, th]) => { const b = h('button', { type: 'button', 'data-k': k }, th.label); b.addEventListener('click', () => { current = k; try { localStorage.setItem(KEY, k); } catch (e) {} dispatchEvent(new CustomEvent('ill-theme')); }); return b; });
        bar.append(...btns);
        const render = () => {
          btns.forEach(b => b.classList.toggle('on', b.dataset.k === current));
          grid.replaceChildren(...items.map(([key, title, text], i) => {
            const markup = art(key, current, i + offset);
            const btn = h('button', { class: 'ill-copy', type: 'button' }, 'copy svg');
            btn.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(markup) : Promise.reject()).then(() => { btn.textContent = 'copied'; }, () => { btn.textContent = 'copy failed'; }); setTimeout(() => { btn.textContent = 'copy svg'; }, 1400); });
            return h('div', { class: 'ill-card' }, btn, h('div', { class: 'ill-art', html: markup }), h('h4', null, title), h('p', null, text));
          }));
        };
        render(); addEventListener('ill-theme', render);
        stage.appendChild(h('div', { class: 'ill' }, bar, grid));
        return () => removeEventListener('ill-theme', render);
      },
    });
  }
  DEMOS.illArt = art;
})();
