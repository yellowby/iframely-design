/* X · Dither sections, round 4 (2026-11-05): marketing sections drawn in text (group 'dtx', X23–X28).
   After the receipts (X21, X22): whole website blocks whose visuals are live, selectable text in Geist Mono (or Fira Code),
   in the website prototype's palette, light or all black: a how-it-works pipeline in box characters, stats with text
   charts, the four products as text windows, a comparison table in shaded cells, a changelog as a git graph, and a CTA
   with //iframely in half-block letters. Copy text / .txt export everything as plain characters.
   Only characters Geist Mono carries: box drawing and blocks (U+2500–259F), ASCII, ↑ ↓; no → ▶ ● ✓ (they fall back
   to wider glyphs and break alignment). Numbers and entries are mock. Needs dither-sections.js and dither-sections3.js. */
(() => {
  const X = () => DEMOS.sectionsKit, Z = () => DEMOS.sectionsKit3;
  const { card, OPT } = X();
  const SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace", /* single quotes: it goes into style="…" attributes */ JBM = '"JetBrains Mono", ui-monospace, monospace';
  const seg = (s, tone, wt, bg) => [s, tone || 'ink', wt || 400, bg];
  const gap = g => ({ gap: g || .6 });

  /* colours: website palette (via X21's THEME); acc is Iframely blue, each product keeps its colour */
  function inksOf(s) {
    const TH = Z().THEME[s.theme], PC = Z().PCOLS(), pc = k => (s.acc2 === 'none' ? TH.ink : s.acc2 === 'blue' ? X().BLUE : PC[k]), bg = s.theme === 'black' ? '#000000' : '#ffffff';
    return { bg, ink: TH.ink, body: TH.body, mute: TH.mute, rule: TH.rule, acc: s.acc2 === 'none' ? TH.ink : X().BLUE, rich: pc('rich'), preview: pc('preview'), data: pc('data'), pub: pc('pub'), white: '#ffffff', ground: bg };
  }
  /* a character grid: boxes, lines, arrows and text placed by cell, then read out as rows of segments */
  function grid(w, h) {
    const g = Array.from({ length: h }, () => Array.from({ length: w }, () => ({ ch: ' ', tone: 'ink', wt: 400 })));
    const G = {
      put(x, y, ch, tone, wt, bg) { if (y >= 0 && y < h && x >= 0 && x < w) g[y][x] = { ch, tone: tone || 'ink', wt: wt || 400, bg }; },
      text(x, y, s, tone, wt, bg) { [...s].forEach((c, i) => G.put(x + i, y, c, tone, wt, bg)); },
      hl(x, y, n, tone) { for (let i = 0; i < n; i++) G.put(x + i, y, '─', tone); },
      vl(x, y, n, tone) { for (let j = 0; j < n; j++) G.put(x, y + j, '│', tone); },
      arrow(x, y, n, tone) { G.hl(x, y, n - 1, tone); G.put(x + n - 1, y, '>', tone); },
      box(x, y, bw, bh, tone, title, ttone) {
        G.hl(x + 1, y, bw - 2, tone); G.hl(x + 1, y + bh - 1, bw - 2, tone); G.vl(x, y + 1, bh - 2, tone); G.vl(x + bw - 1, y + 1, bh - 2, tone);
        G.put(x, y, '┌', tone); G.put(x + bw - 1, y, '┐', tone); G.put(x, y + bh - 1, '└', tone); G.put(x + bw - 1, y + bh - 1, '┘', tone);
        if (title) G.text(x + 2, y, ' ' + title + ' ', ttone || 'ink', 600);
      },
      rows() { return g.map(r => { const segs = []; let cur = null; for (const c of r) { if (cur && cur[1] === c.tone && cur[2] === c.wt && cur[3] === c.bg) cur[0] += c.ch; else { cur = [c.ch, c.tone, c.wt, c.bg]; segs.push(cur); } } return { segs, blk: true }; }); },
    };
    return G;
  }
  /* rows → a live text block */
  function pre(rows, s, I, fs, css) {
    const F = Z().TFONT[s.tfont], r = Z().receiptText(rows, 0, I), d = document.createElement('div');
    d.style.cssText = `font:400 ${fs}px/${F.lh} ${F.fam};white-space:pre;font-variant-ligatures:none;font-feature-settings:'calt' 0,'liga' 0;overflow-x:auto;${css || ''}`;
    d.innerHTML = r.html; return { el: d, text: r.text.replace(/[ \t]+$/gm, '') };
  }
  /* a section: the prototype's copy block (mono path, Geist heading, square buttons, body) above the text visual */
  function section(s, copy, parts, css) {
    const I = inksOf(s), el = document.createElement('div'); let text = '';
    el.style.cssText = `background:${I.bg};color:${I.ink};padding:56px 56px 64px;font-family:${SANS};${css || ''}`;
    if (copy) {
      const c = document.createElement('div'); c.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;margin-bottom:44px';
      const b = (t, on) => `<span style="height:44px;padding:0 22px;display:inline-flex;align-items:center;font:500 15px ${SANS};${on ? `background:${I.ink};color:${I.bg}` : `box-shadow:inset 0 0 0 1px ${I.rule};color:${I.ink}`}">${t}</span>`;
      c.innerHTML = `<div><div style="font:500 15px/1.3 ${GMONO};color:${I.body};margin-bottom:16px">${copy.path}</div><h2 style="font:400 40px/1.15 ${SANS};letter-spacing:-.02em;margin:0 0 28px;color:${I.ink}">${copy.title}</h2><div style="display:flex;gap:10px">${b(copy.b1, 1)}${b(copy.b2)}</div></div>`
        + `<div style="padding-top:31px"><p style="font:400 17px/1.6 ${SANS};color:${I.body};margin:0;max-width:48ch">${copy.body}</p></div>`;
      el.appendChild(c); text += copy.path + '\n' + copy.title.replace(/<br>/g, ' ') + '\n\n' + copy.body + '\n\n';
    }
    for (const p of parts) { el.appendChild(p.el); text += p.text + '\n'; }
    return { el, text };
  }
  const COMMON = [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] }, { key: 'acc2', label: 'Accent', values: [['product', 'Product colours'], ['blue', 'All blue'], ['none', 'None']] }, { key: 'tfont', label: 'Face', values: [['geist', 'Geist Mono'], ['fira', 'Fira Code']] }, OPT.page];
  const NOTE = 'Live HTML text, not a picture: select it, or Copy text / .txt for the whole section as plain characters. Geist Mono at its block line height (1.3) so ░▒▓█ and box lines join; only characters the face carries.';
  const tcard = (name, title, blurb, label, build) => card(name, title, blurb, {
    short: name.replace('dtx-', ''), init: { theme: 'light', acc2: 'product', tfont: 'geist' }, opts: COMMON, note: NOTE,
    items: st => [{ label: label + ' · ' + st.theme + ' · ' + st.acc2, dom: s => build(s, inksOf(s)) }],
  });
  const fadeBar = (n, w) => (n <= 0 ? '' : n <= 3 ? '▓▒░'.slice(3 - n) : '█'.repeat(n - 3) + '▓▒░').padEnd(w);

  /* ------------------------------------------------------------ X23 how it works */
  tcard('dtx-t-pipeline', 'How it works, in box characters', 'The how-it-works block as a diagram typed in box characters: a request box, an arrow into //iframely (1,900+ parsers, a ░▒▓██▓▒░ core, cache and CDN), and a branch out to the four things it returns, each box in its product colour. The whole diagram is text: it reflows to nothing, copies into a README, and could be typed out live.', 'pipeline', (s, I) => {
    const G = grid(78, 12), OUT = [['rich', 'embed', '<iframe> · player · 16:9'], ['preview', 'card', 'title · image · // site'], ['data', 'data', 'markdown · entities'], ['pub', 'policy', 'allow · deny · excerpt']];
    G.box(0, 3, 21, 5, 'rule', 'request', 'mute'); G.text(2, 4, 'any URL', 'ink', 600); G.text(2, 5, 'youtu.be/dQw4w9…', 'mute'); G.text(2, 6, 'github.com/…', 'mute');
    G.arrow(21, 5, 4, 'acc');
    G.box(25, 2, 19, 7, 'acc'); G.text(27, 3, '//', 'acc', 800); G.text(29, 3, 'iframely', 'ink', 700); G.text(27, 4, '1,900+ parsers', 'mute'); G.text(27, 5, '░▒▓██▓▒░', 'acc'); G.text(27, 6, 'oEmbed · OG · LD', 'mute'); G.text(27, 7, 'cache · CDN', 'mute');
    G.hl(44, 5, 2, 'rule'); G.put(46, 1, '┌', 'rule'); G.vl(46, 2, 8, 'rule'); G.put(46, 4, '├', 'rule'); G.put(46, 5, '┤', 'rule'); G.put(46, 7, '├', 'rule'); G.put(46, 10, '└', 'rule');
    OUT.forEach(([k, t, d], n) => { const y = 1 + n * 3; G.arrow(47, y, 3, 'rule'); G.box(50, y - 1, 28, 3, k, t, k); G.text(52, y, d, 'body'); });
    const rows = [...G.rows(), gap(.8), { segs: [seg('one request · one response · cached for everyone after the first', 'mute')] }];
    return section(s, { path: '/how-it-works', title: 'One URL in,<br>the right thing out', body: 'Send Iframely any link. It is parsed by 1,900+ maintained providers, checked against what the publisher allows, and returned as an embed, a card, clean data or a policy decision, cached and served from a CDN.', b1: 'Get an API key', b2: 'Try a link' }, [pre(rows, s, I, 13)]);
  });

  /* ------------------------------------------------------------ X24 stats with text charts */
  tcard('dtx-t-stats', 'Stats with text charts', 'Three numbers, each with its evidence typed under it: 90 days of uptime as a row of bars whose height is the day’s uptime (the two short ones are incidents), the response-time distribution as a ▁▂▃ histogram with ↑ marks at p50 and p95, and the 1,900 providers by kind as bars that end in ▓▒░. Numbers are mock.', 'stats', (s, I) => {
    const W = 36, chart = (vals, n, tone) => Array.from({ length: n }, (_, r) => ({ segs: [seg(vals.map(v => { const e = Math.round(v * n * 8) - (n - 1 - r) * 8; return e >= 8 ? '█' : e <= 0 ? ' ' : String.fromCharCode(0x2580 + e); }).join(''), tone)], blk: true }));
    const up = Array.from({ length: W }, (_, i) => (i === 9 ? .62 : i === 23 ? .4 : .99)), at = (pos, str, tone) => [seg(' '.repeat(pos)), seg(str, tone)];
    const lat = Array.from({ length: W }, (_, i) => Math.exp(-Math.pow(Math.log(i + 2) - Math.log(10), 2) / .32) * .97 + .03);
    const CATS = [['video', 412], ['social', 318], ['docs', 236], ['music', 204], ['code', 143], ['maps', 61], ['other', 526]], mx = 526;
    const cells = [
      ['99.99%', 'uptime, last 90 days', [...chart(up, 2, 'acc'), { segs: [seg('90 days ago'), seg(' '.repeat(W - 16)), seg('today')].map(x => [x[0], 'mute', 400]) }, gap(.4), { segs: [seg('2 incidents · 41 min in total', 'mute')] }]],
      ['212 ms', 'median response, from the cache', [...chart(lat, 4, 'acc'), { segs: at(8, '↑', 'ink').concat(at(17, '↑', 'mute')) }, { segs: at(5, 'p50 212', 'ink').concat(at(8, 'p95 640', 'mute')) }]],
      ['1,900+', 'providers, each a maintained parser', CATS.map(([k, v]) => ({ segs: [seg(k.padEnd(7), 'body'), seg(fadeBar(Math.round(v / mx * 22), 23), 'acc'), seg(String(v).padStart(4), 'mute')], blk: true }))],
    ];
    const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px'; let text = '';
    for (const [num, lab, rows] of cells) {
      const c = document.createElement('div'), p = pre(rows, s, I, 12, 'margin-top:20px');
      c.innerHTML = `<div style="font:500 56px/1 ${SANS};letter-spacing:-.03em;color:${I.ink}">${num}</div><div style="font:400 15px/1.5 ${SANS};color:${I.body};margin-top:8px">${lab}</div>`; c.appendChild(p.el); g.appendChild(c);
      text += num + '  ' + lab + '\n' + p.text + '\n';
    }
    return section(s, { path: '/platform', title: 'Fast, steady,<br>and kept up by hand', body: 'Iframely has turned URLs into embeds since 2012. Every provider is a parser someone maintains, not a guess from meta tags, and answers come from a cache close to your users.', b1: 'Status page', b2: 'Read the docs' }, [{ el: g, text }]);
  });

  /* ------------------------------------------------------------ X25 the products as text windows */
  tcard('dtx-t-products', 'The four products as text windows', 'The products block as four windows of text, one per product in its colour: Rich Media a playing YouTube player, Preview API a link card with a shaded thumbnail, Data API a Markdown excerpt over its access rules, Publisher Console a policy table with chips. Same characters as the receipts, set larger.', 'products', (s, I) => {
    const C = 52, P = DEMOS.ditherKit.PROD, win = {};
    win.rich = [...Z().player(C, 'Never Gonna Give You Up'), gap(.4), { segs: [seg('rel ', 'mute'), seg('player · html5 · ssl', 'body'), seg('   aspect ', 'mute'), seg('16:9', 'body')] }];
    { const G = grid(C, 9); G.box(0, 0, C, 9, 'rule');
      for (let r = 0; r < 7; r++) for (let c = 0; c < 12; c++) G.put(2 + c, 1 + r, '█▓▒░ '[Math.min(4, Math.floor((c + r * 1.4) / 4.4))], 'acc');
      G.text(16, 1, 'itteco/iframely', 'ink', 700); G.text(16, 2, 'GitHub', 'mute'); G.text(16, 4, 'The URL engine behind Iframely:', 'body'); G.text(16, 5, 'links into previews and embeds.', 'body'); G.text(16, 7, '// github.com', 'acc', 600);
      win.preview = [...G.rows(), gap(.4), { segs: [seg('card ', 'mute'), seg('small', 'body'), seg('   thumbnail ', 'mute'), seg('1200 × 600', 'body')] }]; }
    const bar = (k, on, v) => ({ segs: [seg(k.padEnd(10), 'body'), seg(on ? '████████████████████████' : '░░░░░░░░░░░░░░░░░░░░░░░░', on ? 'acc' : 'rule'), seg(' ' + v, on ? 'ink' : 'mute', on ? 600 : 400)], blk: true });
    win.data = [{ segs: [seg('# Bonobo (musician)', 'ink', 700)] }, gap(.4), ...['Simon Charles Green, known by his stage name', 'Bonobo, is an English musician, producer and', 'DJ. His music mixes electronica with jazz…'].map(t => ({ segs: [seg(t, 'body')] })),
      gap(.4), { segs: [seg('── access ' + '─'.repeat(C - 10), 'rule')], blk: true }, bar('assist', 1, 'allowed'), gap(.25), bar('reference', 1, 'allowed'), gap(.25), bar('train', 0, 'denied'), gap(.25), { segs: [seg('licence CC BY-SA 4.0 · robots.txt 200', 'mute')] }];
    const pol = (p, a, rule, kind) => ({ segs: [seg(p.padEnd(15), 'body'), seg(a.padEnd(19), 'ink'), seg(' ' + rule + ' ', kind === 'allow' ? 'ground' : 'white', 600, kind === 'allow' ? 'ink' : 'acc')] });
    win.pub = [{ segs: [seg('path'.padEnd(15) + 'agent'.padEnd(19) + 'rule', 'mute')] }, { segs: [seg('─'.repeat(C), 'rule')], blk: true },
      pol('/articles/*', 'iframely-preview', 'allow', 'allow'), gap(.25), pol('/articles/*', 'iframely-data', 'assist · 300', 'mid'), gap(.25), pol('/*', 'unnamed-crawler', 'deny', 'deny'), gap(.25), pol('/premium/*', '*', 'deny', 'deny'),
      { segs: [seg('─'.repeat(C), 'rule')], blk: true }, { segs: [seg('example-news.com · verified by DNS · 2026-09-14', 'mute')] }];
    const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:44px 40px'; let text = '';
    for (const p of P) {
      const c = document.createElement('div'), I2 = Object.assign({}, I, { acc: I[p.k] }), t = pre(win[p.k], s, I2, 12);
      c.innerHTML = `<div style="font:600 13px/1.3 ${GMONO};color:${I[p.k]}">${p.sym} ${p.name}</div><div style="font:400 15px/1.5 ${SANS};color:${I.body};margin:4px 0 14px">${p.text}</div>`; c.appendChild(t.el); g.appendChild(c);
      text += p.sym + ' ' + p.name + '\n' + p.text + '\n\n' + t.text + '\n';
    }
    return section(s, { path: '/products', title: 'Four products,<br>one URL engine', body: 'Embed rich media, show previews of any link, read web content with its permissions attached, and decide how other apps use your own pages. All four start from the same URL.', b1: 'Get an API key', b2: 'Compare products' }, [{ el: g, text }]);
  });

  /* ------------------------------------------------------------ X26 comparison in shaded cells */
  tcard('dtx-t-compare', 'Comparison in shaded cells', 'The compare block as a typed table: Iframely against oEmbed alone and a scraper you build yourself, one row per capability, each cell a 9-character bar (█ full, ending in ▓▒░ when partial, ░ when missing) and a word. The Iframely column is in blue; everything else stays grey, so the table reads at a glance and still copies as text.', 'compare', (s, I) => {
    const F = [['1,900+ providers, maintained', 1, .3, 0], ['players that keep their aspect', 1, .5, .2], ['cards for any URL', 1, 0, .6], ['robots, licence, policy checks', 1, 0, .2], ['publisher permissions', 1, 0, 0], ['Markdown for AI agents', 1, 0, .5], ['cache, CDN, 99.99% uptime', 1, .3, 0]];
    const cell = (v, tone) => { const n = Math.round(v * 9), b = v >= 1 ? '█'.repeat(9) : n > 0 ? fadeBar(n, 0) : ''; return [seg(b, tone), seg('░'.repeat(9 - b.length), 'rule'), seg(' ' + (v >= 1 ? 'yes' : v > 0 ? 'some' : 'no').padEnd(5), v >= 1 ? 'ink' : 'mute', v >= 1 ? 600 : 400)]; };
    const rows = [{ segs: [seg(''.padEnd(32)), seg('//', 'acc', 800), seg('iframely'.padEnd(13), 'ink', 700), seg('oEmbed only'.padEnd(15), 'body', 600), seg('your scraper', 'body', 600)] }, { segs: [seg('─'.repeat(77), 'rule')], blk: true }];
    F.forEach(([f, a, b, c]) => { rows.push({ segs: [seg(f.padEnd(32), 'ink'), ...cell(a, 'acc'), ...cell(b, 'ink'), ...cell(c, 'ink')], blk: true }, gap(.3)); });
    rows.push({ segs: [seg('─'.repeat(77), 'rule')], blk: true }, { segs: [seg('oEmbed covers a few hundred providers; a scraper sees meta tags, not permissions', 'mute')] });
    return section(s, { path: '/compare', title: 'Why not just<br>scrape it yourself?', body: 'You can parse a page’s meta tags in an afternoon. Keeping 1,900 providers working, sizing players, and respecting what each publisher allows is the part that never ends.', b1: 'Get an API key', b2: 'See all features' }, [pre(rows, s, I, 13)]);
  });

  /* ------------------------------------------------------------ X27 changelog as a git graph */
  tcard('dtx-t-changelog', 'Changelog as a git graph', 'The updates block typed like git log --graph: a main line and a branch that merges back, each commit marked in its product colour, the date, the product as a chip and what changed. The newest entry ends in ░▒▓ new. Entries are mock.', 'changelog', (s, I) => {
    const NAME = { rich: 'Rich Media', preview: 'Preview API', data: 'Data API', pub: 'Publisher Console' };
    const E = [['2026-11-04', 'data', 'License signals in every response', 1], ['2026-10-28', 'pub', 'Rules per path and per customer'], ['2026-10-21', 'rich', 'bandcamp.com becomes provider 1,900'], ['2026-10-14', 'preview', 'Cards for PDF and Figma links'], ['2026-10-02', 'rich', 'Players keep their aspect on resize'], ['2026-09-18', 'data', 'Markdown full text, by licence']];
    const L = [['* ', 0], ['│ '], ['* ', 1], ['├─╮'], ['│ *', 2], ['│ │'], ['* │', 3], ['├─╯'], ['* ', 4], ['│ '], ['* ', 5]];
    const rows = L.map(([g, e]) => {
      const segs = [...g.padEnd(5)].map(ch => seg(ch, ch === '*' ? (e != null ? E[e][1] : 'rule') : 'rule', ch === '*' ? 800 : 400));
      if (e == null) return { segs, blk: true };
      const [d, k, t, isNew] = E[e]; segs.push(seg(d + '  ', 'mute'), seg((' ' + NAME[k] + ' ').padEnd(19), 'white', 600, k), seg('  ' + t, 'ink'));
      if (isNew) segs.push(seg('  ░▒▓ ', 'acc'), seg('new', 'acc', 700));
      return { segs, blk: true };
    });
    return section(s, { path: '/updates', title: 'What changed<br>this month', body: 'Every provider fix, new field and policy option, in the order it shipped. Branches are work that landed in parallel; each commit is coloured by the product it touched.', b1: 'All updates', b2: 'RSS feed' }, [pre(rows, s, I, 13)]);
  });

  /* ------------------------------------------------------------ X28 CTA with the logo in half blocks */
  function logoRows(size) { /* //iframely rasterised in JetBrains Mono 800 at 1 px per half block, '//' in the accent */
    const mc = document.createElement('canvas').getContext('2d'), font = `800 ${size}px ${JBM}`; mc.font = font;
    const w1 = mc.measureText(Z().ZW('//')).width, w = Math.ceil(w1 + mc.measureText(Z().ZW('iframely')).width) + 2, h = Math.ceil(size * .98) & ~1;
    const mask = (str, x0) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.setTransform(1, 0, 0, .6 / .65, 0, 0); x.font = font; x.fillStyle = '#000'; x.fillText(Z().ZW(str), x0, size * .86); const d = x.getImageData(0, 0, w, h).data; return (i, j) => d[(j * w + i) * 4 + 3] > 110; };
    const a = mask('//', 1), b = mask('iframely', 1 + w1), tone = (i, j) => (a(i, j) ? 'acc' : b(i, j) ? 'ink' : null), rows = [];
    for (let j = 0; j < h; j += 2) { const segs = []; for (let i = 0; i < w; i++) { const t = tone(i, j), u = tone(i, j + 1); segs.push(seg(t && u ? '█' : t ? '▀' : u ? '▄' : ' ', t || u || 'ink', 400)); } rows.push({ segs, blk: true }); }
    return rows;
  }
  tcard('dtx-t-cta', 'CTA with the logo in half blocks', 'The closing call to action, all type: //iframely set in half-block letters (JetBrains Mono ExtraBold rasterised one pixel per ▀/▄, // in blue), a prompt line with a block cursor waiting for a URL, the two buttons as inverted text, and a ░▒▓██▓▒░ mark under it.', 'cta', (s, I) => {
    const logo = pre(logoRows(22), s, I, 7, 'display:inline-block;text-align:left');
    const prompt = pre([{ segs: [seg('> ', 'acc', 700), seg('paste any URL', 'mute'), seg('  '), seg('█', 'acc')], blk: true }, gap(.8),
      { segs: [seg(' Get an API key ', 'ground', 600, 'ink'), seg('   '), seg(' Read the docs ', 'ink', 600, 'rule')] }, gap(.8), { segs: [seg('░▒▓██▓▒░', 'acc')], blk: true }], s, I, 16, 'display:inline-block;text-align:left;margin-top:28px');
    const wrap = document.createElement('div'); wrap.style.cssText = 'text-align:center';
    const lead = document.createElement('div'); lead.style.cssText = `font:400 18px/1.5 ${SANS};color:${I.body};margin:24px auto 0;max-width:46ch`; lead.textContent = 'One API for embeds, link previews, web data and publisher rules. Free to start.';
    wrap.append(logo.el, lead, document.createElement('br'), prompt.el);
    return section(s, null, [{ el: wrap, text: logo.text + '\n' + lead.textContent + '\n\n' + prompt.text }], 'padding:72px 56px 80px');
  });
  /* shared with demos/dither-sections5.js */
  DEMOS.sectionsKit4 = { inksOf, grid, pre, section, seg, gap, tcard, fadeBar, logoRows, SANS, GMONO };
})();
