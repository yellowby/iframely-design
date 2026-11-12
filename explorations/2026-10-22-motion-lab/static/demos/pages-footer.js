/* G · Page content: footers (2026-11-05, group 'pg', page #pages). Fancier page footers for the website, after G15 (the
   path as a giant mark cut by the edge) and G18 (big type, a coloured plan box), and a set of footers the user shared
   (giant wordmarks, promo cards beside the links, big-type link lists on black, soft gradients, a dithered wordmark).
   Content from website-prototype: src/lib/data/nav.ts (footer columns, header Solutions), Footer.svelte (blurb, badges,
   copyright, Markdown line) and the //iframely logo from Header.svelte. Columns are regrouped per variant.
   Needs content-visuals2.js (cvKit2)and pages-cta.js (ctaKit). */
(() => {
  const K = () => DEMOS.cvKit2, X = () => DEMOS.sectionsKit, C = () => DEMOS.ctaKit;
  const HEAD = 'aeonik-fono, Geist, Inter, sans-serif', SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const H = (...a) => K().div(...a);

  /* ---- content (nav.ts footer + header Solutions, Footer.svelte) */
  const L = (label, href, col) => ({ label, href, col });
  const PRODUCTS = [L('Rich Media', '/embeds', 'rich'), L('Preview API', '/preview-api', 'preview'), L('Data API', '/data-api', 'data'), L('Publisher Console', '/publishers', 'pub')];
  const COLS = {
    products: ['Products', [...PRODUCTS, L('Integrations', '/integrations'), L('WordPress plugin', '/wordpress'), L('Pricing', '/pricing')]],
    solutions: ['Solutions', [L('AI agents and RAG', '/for/agents'), L('Chat and collaboration apps', '/for/chat-apps'), L('CMS, editors and site builders', '/for/cms'), L('Publishers and newsrooms', '/for/newsrooms')]],
    tools: ['Free tools', [L('Embed code generator', '/try'), L('URL debugger', '/tools/url-debugger'), L('All free tools', '/tools'), L('Supported providers', '/domains'), L('Domains widget', '/docs/domains-widget')]],
    devs: ['Developers', [L('Docs', '/docs'), L('For agents', '/for/agents'), L('MCP server', '/mcp'), L('Changelog and provider news', '/updates'), L('Verify our agents', '/verification'), L('Help center', '/help'), L('Status', '#status')]],
    company: ['Company', [L('About', '/about'), L('Careers', '/careers'), L('Compare', '/compare'), L('Trust center', '#trust'), L('Contact support', '/help#contact')]],
    legal: ['Legal', [L('Terms', '#terms'), L('Automated Processing Terms', '#automated-processing'), L('Privacy', '#privacy'), L('GDPR', '#gdpr')]]
  };
  const BLURB = 'Iframely connects products and publishers through rich media, previews and URL data.', SINCE = 'Holding the web together since 2012.';
  const BADGES = ['SOC 2 Type II', 'GDPR', '99.99% uptime'], COPY = '© 2012–2026 Itteco Software Corp. Ottawa, Canada.';
  /* The prototype's "Every page is also available as Markdown: llms.txt · pricing.md · OpenAPI" line is dropped from
     every footer (user, 2026-11-05): agents find llms.txt at the root, pricing.md belongs on /pricing, OpenAPI in Docs. */
  const MD = [];
  const TEXT = [BLURB, SINCE, ...Object.values(COLS).map(([t, it]) => t + ': ' + it.map(x => x.label).join(', ')), COPY].join('\n');

  /* ---- logo: the new //iframely, as in the prototype header (JetBrains Mono, "//" ExtraBold in blue, the word Bold) */
  const JBM = "'JetBrains Mono', ui-monospace, monospace";
  const logo = (h, slash, word) => `<span aria-label="Iframely" style="display:inline-block;font:700 ${Math.round(h * 20 / 24)}px/1.3 ${JBM};color:${word};white-space:nowrap"><b style="font-weight:800;color:${slash}">//</b>iframely</span>`;
  /* the giant version: an SVG <text> stretched to exactly ten mono cells (JetBrains Mono advance = .6 em), so it fills
     the width; fills may be gradients (pass defs), or outlines */
  const bigLogo = (slash, word, o = {}) => { const f = c => (o.stroke ? `fill="none" stroke="${c}" stroke-width="1.2"` : `fill="${c}"`);
    return `<svg viewBox="0 0 600 100" style="display:block;width:100%;height:auto;overflow:visible" aria-hidden="true">${o.defs || ''}<text x="0" y="76" font-family="JetBrains Mono, monospace" font-size="100" textLength="600" lengthAdjust="spacingAndGlyphs"><tspan font-weight="800" ${f(slash)}>//</tspan><tspan font-weight="700" ${f(word)}>iframely</tspan></text></svg>`; };

  /* ---- type */
  const lab = (c, t, mono) => `<div style="font:${mono ? `500 12px/1.3 ${GMONO};letter-spacing:.04em;text-transform:uppercase` : `500 14px/1.3 ${SANS}`};color:${c};margin-bottom:14px">${t}</div>`;
  const links = (I, items, o = {}) => `<div style="display:grid;gap:${o.gap || 9}px">${items.map(x => `<div style="display:flex;align-items:center;gap:8px;font:${o.big ? `400 ${o.big}px/1.25 ${SANS};letter-spacing:-.01em` : `400 14px/1.4 ${SANS}`};color:${o.c || I.body}">${o.dots && x.col ? `<i style="flex:none;width:7px;height:7px;border-radius:50%;background:${I[x.col]}"></i>` : ''}${x.label}</div>`).join('')}</div>`;
  const col = (I, key, o = {}) => { const [t, it] = COLS[key]; return `<div>${lab(o.lc || I.ink, t, o.mono)}${links(I, it, o)}</div>`; };
  const badges = (I, c) => `<div style="display:flex;flex-wrap:wrap;gap:6px">${BADGES.map(b => `<span style="font:400 12px ${SANS};padding:4px 8px;border-radius:5px;box-shadow:inset 0 0 0 1px ${c || I.line};color:${I.mute}">${b}</span>`).join('')}</div>`;
  /* where the Markdown line used to sit, the bottom row now carries the legal links */
  const mdLine = (I, c) => COLS.legal[1].map(x => `<span style="color:${c || 'inherit'}">${x.label}</span>`).join(' · ');
  const pill = (t, bg, fg, line) => `<span style="display:inline-flex;align-items:center;height:38px;padding:0 20px;border-radius:19px;font:500 15px ${SANS};white-space:nowrap;${bg ? `background:${bg};color:${fg}` : `box-shadow:inset 0 0 0 1px ${line};color:${fg}`}">${t}</span>`;

  const OPTS = [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] }];
  const NOTE = 'Links, blurb, badges and copyright from website-prototype nav.ts and Footer.svelte; Solutions from the header menu. Logo paths from Logo.svelte. Columns regrouped per variant; nothing new added except the plan facts in G27 (from the price list).';
  function fcard(name, title, blurb, build, opts = [], init = {}) {
    X().card(name, title, blurb, { group: 'pg', short: name.replace('pg-', ''), note: NOTE, opts: [...OPTS, ...opts],
      init: Object.assign({ theme: 'light', acc2: 'product' }, init),
      items: st => [{ label: 'footer · ' + st.theme, dom: s => { const I = K().ink(s), el = build(I, s); return { el: typeof el === 'string' ? H('', el) : el, text: TEXT }; } }] });
  }
  const MARK = { key: 'mark', label: 'Mark', values: [['brand', 'Blue //, ink word'], ['blue', 'All blue'], ['ink', 'All ink'], ['line', 'Outline']] };
  const marks = (I, m) => (m === 'blue' ? [I.acc, I.acc] : m === 'ink' ? [I.ink, I.ink] : m === 'line' ? [I.mute, I.mute] : [I.acc, I.ink]);

  /* ------------------------------------------------------------ G25 the logo as the floor */
  fcard('pg-ft-mark', 'Footer: the logo as the floor', 'The prototype footer tidied (blurb and badges left, five link columns, the copyright and Markdown line), standing on the real logo set across the whole width and cut by the bottom edge, as G15 does with the page path. The mark can be the brand pair, all blue, all ink or an outline.', (I, s) => {
    const [d, w] = marks(I, s.mark);
    return `<footer style="background:${I.bg};color:${I.ink};font-family:${SANS};overflow:hidden;box-shadow:inset 0 1px 0 ${I.line}"><div style="padding:72px 64px 0;display:grid;grid-template-columns:1.4fr repeat(5,1fr);gap:32px"><div>${logo(24, I.acc, I.ink)}<p style="font:400 14px/1.5 ${SANS};color:${I.body};margin:18px 0 6px;max-width:30ch">${BLURB}</p><p style="font:400 14px/1.5 ${SANS};color:${I.mute};margin:0 0 18px">${SINCE}</p>${badges(I)}</div>${['products', 'tools', 'devs', 'company', 'legal'].map(k => col(I, k)).join('')}</div>
      <div style="margin:64px 64px 0;padding:22px 0;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;gap:24px;font:400 13px ${SANS};color:${I.mute}"><span>${COPY}</span><span>${SINCE}</span></div>
      <div style="height:${s.cut === 'deep' ? 84 : 118}px;overflow:hidden;padding:0 40px"><div style="margin-top:10px">${bigLogo(d, w, { stroke: s.mark === 'line', chev: I.bg })}</div></div></footer>`;
  }, [MARK, { key: 'cut', label: 'Cut', values: [['half', 'Through the word'], ['deep', 'Deep']] }], { mark: 'brand', cut: 'half' });

  /* ------------------------------------------------------------ G26 big links on black */
  fcard('pg-ft-dark', 'Footer: big links on black', 'A black footer with the links set large (22 px), four columns regrouped as Products, Solutions, Developers and Company, product names marked with their colour, the two main buttons and the legal links small in mono at the right, and the logo whole at the bottom left in white.', (I, s) => {
    const fg = '#f2f2f2', mu = '#8a8a8a', bg = '#0b0b0b', J = Object.assign({}, I, { body: fg, ink: fg });
    const c4 = [['Products', [...PRODUCTS, L('Pricing', '/pricing')]], COLS.solutions, ['Developers', [L('Docs', '/docs'), L('MCP server', '/mcp'), L('URL debugger', '/tools/url-debugger'), L('Changelog', '/updates'), L('Status', '#status')]], ['Company', [L('About', '/about'), L('Careers', '/careers'), L('Compare', '/compare'), L('Trust center', '#trust'), L('Help center', '/help')]]];
    return `<footer style="background:${bg};color:${fg};font-family:${SANS};padding:72px 56px 48px;border-radius:${s.round === 'yes' ? 20 : 0}px"><div style="display:grid;grid-template-columns:1.1fr 1.45fr .9fr .9fr 190px;gap:28px">${c4.map(([t, it]) => `<div>${lab(mu, t, 1)}${links(J, it.map(x => (x.label === 'CMS, editors and site builders' ? L('CMS and site builders', x.href) : x)), { big: 21, gap: 8, dots: 1, c: fg })}</div>`).join('')}<div><div style="display:grid;gap:8px;justify-items:start">${pill('Get API key', fg, bg)}${pill('Check URL', null, fg, '#3a3a3a')}</div><div style="display:grid;gap:7px;margin-top:36px;font:500 11px/1.3 ${GMONO};letter-spacing:.05em;text-transform:uppercase;color:${mu}">${COLS.legal[1].map(x => x.label).map(x => `<span>${x}</span>`).join('')}</div></div></div>
      <div style="display:grid;grid-template-columns:1fr 210px;gap:28px;align-items:end;margin-top:88px"><div style="max-width:780px">${bigLogo(I.acc, fg)}</div><div style="font:500 11px/1.6 ${GMONO};letter-spacing:.05em;text-transform:uppercase;color:${mu}">${SINCE}<br>${COPY}</div></div></footer>`;
  }, [{ key: 'round', label: 'Corners', values: [['no', 'Square'], ['yes', 'Rounded']] }], { round: 'no' });

  /* ------------------------------------------------------------ G27 links with promo cards */
  fcard('pg-ft-cards', 'Footer: links with two cards beside them', 'Links on the left in four regrouped columns with small mono labels in blue; on the right two cards that carry the footer’s own messages: the free plan in the G18 coloured box and the publisher console in its pink.', (I, s) => {
    const pc = s.paint === 'page' ? I.rich : I.acc;
    const card1 = `<div style="background:${pc};color:#fff;border-radius:12px;padding:22px 22px 20px"><div style="font:400 15px ${SANS};opacity:.85">Start free</div><div style="display:flex;align-items:baseline;gap:3px;font:400 48px/1 ${HEAD};letter-spacing:-.035em;margin:12px 0 8px">$0<span style="font:400 15px ${SANS};letter-spacing:0;opacity:.75">/mo</span></div><div style="font:400 14px/1.45 ${SANS};opacity:.85">2,000 hits a month, then $4 per 1,000</div><div style="margin-top:16px">${pill('Get API key', '#fff', pc)}</div></div>`;
    const card2 = `<div style="border-radius:12px;padding:20px 22px;background:${K().mix(I.surf, I.pub, I.dark ? .18 : .08)}"><div style="font:500 14px ${GMONO};color:${I.pub}">/publishers</div><div style="font:400 20px/1.25 ${HEAD};letter-spacing:-.015em;color:${I.ink};margin:10px 0 6px">See who fetches your pages</div><div style="font:400 14px/1.45 ${SANS};color:${I.body}">Claim your domain in a few minutes. Free.</div><div style="font:500 14px ${SANS};color:${I.pub};margin-top:12px">Claim your domain, free →</div></div>`;
    return `<footer style="background:${I.bg};color:${I.ink};font-family:${SANS};padding:56px 56px 36px;box-shadow:inset 0 1px 0 ${I.line}"><div style="display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:56px"><div><div style="display:flex;justify-content:space-between;align-items:center">${logo(26, I.acc, I.ink)}${badges(I)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin-top:44px">${['products', 'solutions', 'devs', 'company'].map(k => col(I, k, { lc: I.acc, mono: 1 })).join('')}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin-top:36px">${col(I, 'tools', { lc: I.acc, mono: 1 })}<div style="grid-column:span 3;align-self:end;font:400 14px/1.5 ${SANS};color:${I.mute}">${BLURB} ${SINCE}</div></div></div><div style="display:grid;gap:12px;align-content:start">${card1}${card2}</div></div>
      <div style="margin-top:48px;padding-top:20px;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;font:400 13px ${SANS};color:${I.mute}"><span>${COPY}</span><span style="display:flex;gap:18px">${COLS.legal[1].map(x => `<span>${x.label}</span>`).join('')}</span></div></footer>`;
  }, [{ key: 'paint', label: 'Plan card', values: [['acc', 'Blue'], ['page', 'Rich Media colour']] }], { paint: 'acc' });

  /* ------------------------------------------------------------ G28 every link is a path */
  fcard('pg-ft-paths', 'Footer: every link is a path, the page’s path last', 'The site’s own idea (a URL is the product) applied to the footer: each link shown with its path in mono, product paths in their colours, and the footer ends on the current page’s path set huge and cut by the edge, exactly as G15. Switch the page to see each ending.', (I, s) => {
    const p = C().P.find(x => x.k === s.pg) || C().P[0], c = I[p.col], word = p.k === 'home' ? '/' : p.path;
    const row = x => `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:7px 0;box-shadow:inset 0 -1px 0 ${I.faint};font:400 14px ${SANS};color:${I.body}"><span>${x.label}</span><span style="font:400 12px ${GMONO};color:${x.col ? I[x.col] : I.mute}">${x.href.startsWith('#') ? '' : x.href}</span></div>`;
    return `<footer style="background:${I.bg};color:${I.ink};font-family:${SANS};overflow:hidden;box-shadow:inset 0 1px 0 ${I.line}"><div style="padding:64px 56px 0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px">${[['products', 'tools'], ['solutions', 'company'], ['devs'], ['legal']].map(ks => `<div style="display:grid;gap:30px;align-content:start">${ks.map(k => `<div>${lab(I.mute, COLS[k][0], 1)}${COLS[k][1].map(row).join('')}</div>`).join('')}${ks[0] === 'legal' ? `<div>${logo(24, I.acc, I.ink)}<p style="font:400 14px/1.5 ${SANS};color:${I.body};margin:16px 0 14px">${BLURB}</p>${badges(I)}</div>` : ''}</div>`).join('')}</div>
      <div style="margin:44px 56px 0;padding:18px 0;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;font:400 13px ${SANS};color:${I.mute}"><span>${COPY}</span><span>${SINCE}</span></div>
      <div style="height:${p.k === 'home' ? 260 : 210}px;overflow:hidden;padding:0 44px"><div style="font:500 ${p.k === 'home' ? 340 : Math.min(260, Math.round(1700 / word.length))}px/1 ${HEAD};letter-spacing:-.06em;color:${c};white-space:nowrap;margin-top:-.02em">${word}</div></div></footer>`;
  }, [{ key: 'pg', label: 'Page', values: [['home', 'Home'], ['rich', 'Rich Media'], ['preview', 'Preview API'], ['data', 'Data API'], ['pub', 'Publishers']] }], { pg: 'rich' });

  /* ------------------------------------------------------------ G29 a glow of the four products */
  fcard('pg-ft-glow', 'Footer: the four product colours as a glow', 'Links and copyright on a ground that turns, toward the bottom, into a soft glow of the four product colours, with the logo set huge and ghosted into it. Quiet at the top where the links are, loud at the very end.', (I, s) => {
    const g = `radial-gradient(60% 90% at 12% 100%, ${I.rich} 0%, transparent 70%), radial-gradient(50% 80% at 40% 100%, ${I.preview} 0%, transparent 70%), radial-gradient(50% 80% at 66% 100%, ${I.data} 0%, transparent 70%), radial-gradient(50% 90% at 92% 100%, ${I.pub} 0%, transparent 70%)`;
    const defs = `<defs><linearGradient id="ftg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${s.ghost === 'solid' ? 1 : .55}"/><stop offset="1" stop-color="#fff" stop-opacity="${s.ghost === 'solid' ? .9 : .05}"/></linearGradient></defs>`;
    return `<footer style="position:relative;overflow:hidden;background:${I.bg};color:${I.ink};font-family:${SANS}"><div style="position:absolute;left:-10%;right:-10%;bottom:0;height:62%;background:${g};opacity:${I.dark ? .75 : .55};filter:blur(30px)"></div><div style="position:relative;padding:72px 56px 0;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:28px"><div>${logo(24, I.acc, I.ink)}<p style="font:400 15px/1.5 ${SANS};color:${I.body};margin:18px 0 0;max-width:30ch">${BLURB}</p></div>${['products', 'solutions', 'devs', 'company'].map(k => col(I, k)).join('')}</div>
      <div style="position:relative;margin:56px 56px 0;display:flex;justify-content:space-between;font:400 13px ${SANS};color:${I.body}"><span>${COPY}</span><span style="display:flex;gap:16px">${COLS.legal[1].map(x => `<span style="text-decoration:underline;text-underline-offset:3px">${x.label}</span>`).join('')}</span></div>
      <div style="position:relative;height:132px;overflow:hidden;padding:0 30px;margin-top:20px"><div style="margin-top:6px">${bigLogo('url(#ftg)', 'url(#ftg)', { defs, chev: 'transparent' })}</div></div></footer>`;
  }, [{ key: 'ghost', label: 'Logo', values: [['ghost', 'Ghosted'], ['solid', 'Solid white']] }], { ghost: 'ghost' });

  /* ------------------------------------------------------------ G30 a dithered logo */
  fcard('pg-ft-dither', 'Footer: the logo in Bayer dots', 'The lab’s dither applied to the footer: the logo drawn into a canvas and printed as Bayer-ordered squares that thin out toward the top, so it fades up into the links instead of ending at a line. Square size and colour switchable; it is a still image, nothing moves.', (I, s) => {
    const el = H(`background:${I.bg};color:${I.ink};font-family:${SANS};box-shadow:inset 0 1px 0 ${I.line}`);
    el.innerHTML = `<div style="padding:64px 56px 0;display:grid;grid-template-columns:1.3fr repeat(5,1fr);gap:28px"><div>${logo(24, I.acc, I.ink)}<p style="font:400 14px/1.5 ${SANS};color:${I.body};margin:18px 0 6px">${BLURB}</p><p style="font:400 14px/1.5 ${SANS};color:${I.mute};margin:0 0 16px">${SINCE}</p>${badges(I)}</div>${['products', 'solutions', 'tools', 'devs', 'company'].map(k => col(I, k)).join('')}</div>`;
    const cv = document.createElement('canvas'), W = 1200, Hh = 300, cell = +s.cell; cv.style.cssText = 'display:block;width:100%;margin-top:20px'; cv.width = W * 2; cv.height = Hh * 2;
    const BY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], fs = Math.round((W - 60) / 6);
    /* two colours: the slashes in blue, the word in ink (or both one colour); redrawn once JetBrains Mono has loaded */
    const paint = () => {
      const m = document.createElement('canvas'); m.width = W; m.height = Hh; const g = m.getContext('2d'); g.textBaseline = 'alphabetic';
      g.font = `800 ${fs}px "JetBrains Mono"`; g.fillStyle = '#f00'; g.fillText('//', 30, 40 + fs * .76); const sw = g.measureText('//').width;
      g.font = `700 ${fs}px "JetBrains Mono"`; g.fillStyle = '#00f'; g.fillText('iframely', 30 + sw, 40 + fs * .76);
      const px = g.getImageData(0, 0, W, Hh).data, ctx = cv.getContext('2d'); ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, W, Hh);
      for (let y = 0, j = 0; y < Hh; y += cell, j++) for (let x = 0, i = 0; x < W; x += cell, i++) {
        const o = ((Math.min(Hh - 1, y + (cell >> 1))) * W + Math.min(W - 1, x + (cell >> 1))) * 4, a = px[o + 3] / 255, fade = Math.pow(y / Hh, .8);
        const v = a > .5 ? .12 + .88 * fade : 0; if (v <= (BY[(j % 4) * 4 + (i % 4)] + .5) / 16) continue;
        ctx.fillStyle = s.dc === 'ink' ? I.ink : s.dc === 'acc' ? I.acc : px[o] > px[o + 2] ? I.acc : I.ink; ctx.fillRect(x, y, cell - (cell > 4 ? 1 : 0), cell - (cell > 4 ? 1 : 0));
      }
    };
    paint(); if (document.fonts) Promise.all([document.fonts.load(`800 ${fs}px "JetBrains Mono"`), document.fonts.load(`700 ${fs}px "JetBrains Mono"`)]).then(paint, () => {});
    el.appendChild(cv); el.appendChild(H(`margin:0 56px;padding:18px 0 22px;display:flex;justify-content:space-between;font:400 13px ${SANS};color:${I.mute};box-shadow:inset 0 1px 0 ${I.line}`, `<span>${COPY}</span><span>${mdLine(I)}</span>`));
    return el;
  }, [{ key: 'cell', label: 'Squares', values: [[4, '4 px'], [6, '6 px'], [10, '10 px']] }, { key: 'dc', label: 'Colour', values: [['logo', 'As the logo'], ['acc', 'Blue'], ['ink', 'Ink']] }], { cell: 6, dc: 'logo' });

  /* ------------------------------------------------------------ G31 the CTA and the footer as one blue block */
  fcard('pg-ft-blue', 'Footer: the home promise and the footer as one blue block', 'The last screen of the site as one block in the brand blue: the home page’s own headline set big (G18 scale) with its two buttons, then the links in white, then the logo cut by the bottom edge. Replaces a separate closing CTA on every page.', (I, s) => {
    const bg = s.paint === 'ink' ? '#0a0a0a' : I.acc, fg = '#fff', mu = 'rgba(255,255,255,.7)', J = Object.assign({}, I, { body: mu });
    return `<footer style="background:${bg};color:${fg};font-family:${SANS};overflow:hidden;border-radius:${s.paint === 'ink' ? 0 : 0}px"><div style="padding:88px 56px 0;display:grid;grid-template-columns:1.3fr 1fr;gap:56px;align-items:end"><h2 style="font:500 72px/1 ${HEAD};letter-spacing:-.045em;margin:0;text-wrap:balance">We make URLs work inside other products</h2><div><p style="font:400 18px/1.5 ${SANS};color:${mu};margin:0 0 24px">Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.</p><div style="display:flex;gap:10px">${pill('Get API key', fg, bg)}${pill('Check URL', null, fg, 'rgba(255,255,255,.45)')}</div></div></div>
      <div style="margin:88px 56px 0;padding-top:36px;box-shadow:inset 0 1px 0 rgba(255,255,255,.25);display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px">${['products', 'solutions', 'devs', 'company', 'legal'].map(k => col(J, k, { lc: fg })).join('')}</div>
      <div style="margin:44px 56px 0;display:flex;justify-content:space-between;font:400 13px ${SANS};color:${mu}"><span>${COPY}</span><span>${SINCE}</span></div>
      <div style="height:124px;overflow:hidden;padding:0 40px;margin-top:28px"><div>${bigLogo(fg, fg, { chev: bg })}</div></div></footer>`;
  }, [{ key: 'paint', label: 'Ground', values: [['acc', 'Brand blue'], ['ink', 'Black']] }], { paint: 'acc' });
  DEMOS.footerKit = { COLS, PRODUCTS, L, BLURB, SINCE, BADGES, COPY, MD, TEXT, JBM, HEAD, logo, bigLogo, lab, links, col, badges, mdLine, pill, fcard };
})();
