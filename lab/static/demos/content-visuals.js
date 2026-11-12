/* V · Content visuals (2026-11-05): new ways to show the website's content blocks (group 'cv', page #content, V01–V12).
   One card per block of website (src/routes: +page, embeds, preview-api, data-api, publishers), with its real copy
   (eyebrow, heading, intro, cards) and a visual that carries the block's argument where the prototype has a grey
   placeholder or a plain table. Visuals are live text in Geist Mono in the prototype palette (light or all black); values
   that are not in the copy (timings, request counts, sample metadata) are illustrative.
   Needs dither-sections.js (card), dither-sections3.js (player, receiptText, TFONT) and dither-sections4.js (grid, pre, inksOf). */
(() => {
  const X = () => DEMOS.sectionsKit, Z = () => DEMOS.sectionsKit3, V = () => DEMOS.sectionsKit4;
  const SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace", PAGE = '#fafafa'; /* website --color-page */
  const seg = (s, tone, wt, bg) => [s, tone || 'ink', wt || 400, bg], gap = g => ({ gap: g || .6 });
  const div = (css, html) => { const d = document.createElement('div'); if (css) d.style.cssText = css; if (html != null) d.innerHTML = html; return d; };
  const strip = h => h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const OPTS = [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] }, { key: 'acc2', label: 'Accent', values: [['product', 'Product colours'], ['blue', 'All blue'], ['none', 'None']] }, { key: 'tfont', label: 'Face', values: [['geist', 'Geist Mono'], ['fira', 'Fira Code']] }, X().OPT.page];
  const NOTE = 'Copy from website; the visual is live HTML text (Copy text / .txt export the block). Values not in the copy are illustrative.';
  function vcard(name, title, blurb, page, build) {
    X().card(name, title, blurb, { group: 'cv', short: name.replace('cv-', ''), init: { theme: 'light', acc2: 'product', tfont: 'geist' }, opts: OPTS, note: NOTE,
      items: st => [{ label: page + ' · ' + st.theme, dom: s => build(s, Object.assign(V().inksOf(s), s.theme === 'black' ? {} : { bg: PAGE, ground: PAGE })) }] });
  }
  /* the prototype's block: mono eyebrow in the page colour, Geist heading, intro / paragraphs, buttons; then the visual,
     beside the text (split) or under it (stack); optional cards under everything */
  function block(s, I, c, vis, layout) {
    const el = div(`background:${I.bg};color:${I.ink};padding:64px 56px 72px;font-family:${SANS}`); let text = '';
    const btn = ([t, on]) => `<span style="height:44px;padding:0 22px;display:inline-flex;align-items:center;font:500 15px ${SANS};${on ? `background:${I.ink};color:${I.bg}` : `box-shadow:inset 0 0 0 1px ${I.rule};color:${I.ink}`}">${t}</span>`;
    const code = h => h.replace(/<code>/g, `<code style="font:0.9em ${GMONO};color:${I.ink}">`);
    const head = `<div style="font:500 15px/1.3 ${GMONO};color:${I[c.tone] || I.acc};margin-bottom:18px">${c.eyebrow}</div>`
      + `<h${c.h1 ? 1 : 2} style="font:400 ${c.h1 ? 54 : 40}px/1.12 ${SANS};letter-spacing:-.025em;margin:0;color:${I.ink};max-width:${c.h1 ? 760 : 620}px;text-wrap:balance">${c.title}</h${c.h1 ? 1 : 2}>`
      + (c.tagline ? `<div style="font:400 14px ${GMONO};color:${I.mute};margin-top:14px">${c.tagline}</div>` : '');
    const body = (c.paras || []).map(p => `<p style="font:400 17px/1.6 ${SANS};color:${I.body};margin:0 0 14px;max-width:56ch">${code(p)}</p>`).join('') + (c.buttons ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:22px">${c.buttons.map(btn).join('')}</div>` : '');
    text += c.eyebrow + '\n' + strip(c.title) + '\n\n' + (c.paras || []).map(strip).join('\n\n') + '\n\n';
    if (layout === 'split') { const g = div('display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:56px;align-items:start'); g.append(div('', head + `<div style="margin-top:24px">${body}</div>`), vis.el); el.appendChild(g); }
    else { el.appendChild(div('display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;margin-bottom:44px', `<div>${head}</div><div style="padding-top:36px">${body}</div>`)); el.appendChild(vis.el); }
    text += vis.text + '\n';
    if (c.cards) {
      const g = div(`display:grid;grid-template-columns:repeat(${c.cards.length},minmax(0,1fr));gap:28px;margin-top:44px;padding-top:28px;box-shadow:inset 0 1px 0 ${I.rule}`);
      c.cards.forEach(([t, x, cta]) => { g.appendChild(div('', `<div style="font:600 15px/1.35 ${SANS};color:${I.ink}">${t}</div><p style="font:400 14px/1.55 ${SANS};color:${I.body};margin:8px 0 0">${code(x)}</p>${cta ? `<div style="font:500 14px ${SANS};color:${I.acc};margin-top:12px">${cta} →</div>` : ''}`)); text += t + '\n' + strip(x) + '\n\n'; });
      el.appendChild(g);
    }
    return { el, text };
  }
  DEMOS.cvKit = { block, div, strip, SANS, GMONO };
  const P = (rows, s, I, fs, css) => V().pre(rows, s, I, fs || 12, css);
  const shade = (c, r, k) => '█▓▒░ '[Math.min(4, Math.max(0, Math.floor((c + r * 1.4) / k)))];
  const tri = (G, x0, y0, w, h, tone) => { /* a half-block play triangle centred in a w × h cell box */
    const cx = x0 + Math.floor(w / 2) - 2, cy = h; for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) { const on = (yy) => { const dx = x0 + c - cx, dy = Math.abs(yy + .5 - cy); return dx >= 0 && dx <= 4 && dy <= (4 - dx) * .7 + .3; }; const a = on(r * 2), b = on(r * 2 + 1); if (a || b) G.put(x0 + c, y0 + r, a && b ? '█' : a ? '▀' : '▄', tone); } };

  /* ------------------------------------------------------------ V01 home hero: four lenses on one URL */
  vcard('cv-lenses', 'Home hero: one URL, four lenses', 'The hero’s claim (“We make URLs work inside other products”) drawn as one URL and the four things the products make of it, side by side: the player (Rich Media), the card (Preview API), the content with its permissions (Data API), and the publisher’s rules (Publisher Console). Each lens in its product colour, each captioned with the lead’s own verb.', 'home · hero', (s, I) => {
    const G = V().grid(105, 18), url = 'youtube.com/watch?v=dQw4w9WgXcQ', uw = url.length + 6, ux = Math.floor((105 - uw) / 2), mid = ux + Math.floor(uw / 2);
    G.box(ux, 0, uw, 3, 'ink'); G.text(ux + 3, 1, url, 'ink', 600);
    const L = [['rich', 'Rich Media', 'Embed rich media'], ['preview', 'Preview API', 'Show a preview'], ['data', 'Data API', 'Read the content'], ['pub', 'Publisher Console', 'Decide the rules']], X0 = [0, 27, 54, 81];
    G.put(mid, 3, '│', 'rule'); G.hl(12, 4, 82, 'rule'); G.put(12, 4, '┌', 'rule'); G.put(93, 4, '┐', 'rule'); G.put(39, 4, '┬', 'rule'); G.put(66, 4, '┬', 'rule'); G.put(mid, 4, '┴', 'rule');
    L.forEach(([k, name, cap], n) => { const x = X0[n]; G.put(x + 12, 5, '│', 'rule'); G.box(x, 6, 24, 10, k, name, k); G.text(x + Math.floor((24 - cap.length) / 2), 16, cap, 'mute'); });
    { const x = 2; G.text(x, 7, 'Never Gonna Give…', 'ink', 600); for (let r = 0; r < 5; r++) for (let c = 0; c < 20; c++) { const d = Math.hypot((c + .5 - 10) / 10, (r + .5 - 2.5) / 2.5); if (d > .8) G.put(x + c, 8 + r, d > 1.1 ? '▓' : d > .95 ? '▒' : '░', 'rich'); } tri(G, x, 8, 20, 5, 'ink'); G.text(x, 13, '━━━━━━━█', 'rich'); G.text(x + 8, 13, '────────────', 'rule'); G.text(x, 14, '▌▌ 1:12 / 3:34', 'ink', 600); }
    { const x = 29; for (let r = 0; r < 4; r++) for (let c = 0; c < 20; c++) G.put(x + c, 7 + r, shade(c, r, 5.5), 'preview'); G.text(x, 11, 'Rick Astley - Never', 'ink', 700); G.text(x, 12, 'Gonna Give You Up', 'ink', 700); G.text(x, 13, 'YouTube · 3:34', 'mute'); G.text(x, 14, '// youtube.com', 'preview', 600); }
    { const x = 56; G.text(x, 7, '# Never Gonna Give…', 'ink', 700); G.text(x, 8, 'Rick Astley · 2009', 'mute'); [['meta', 1], ['links', 1], ['entities', 1], ['excerpt', 1], ['fulltext', 0]].forEach(([k, a], i) => { G.text(x, 10 + i, k.padEnd(10), 'body'); G.text(x + 10, 10 + i, a ? 'allowed' : 'withheld', a ? 'data' : 'mute', a ? 600 : 400); }); }
    { const x = 83; G.text(x, 7, 'youtube.com/watch*', 'ink', 600); G.text(x, 8, 'verified · DNS', 'mute'); [['preview', 'allow'], ['assist', 'allow'], ['search', 'allow'], ['ai-input', 'allow'], ['ai-train', 'deny']].forEach(([k, v], i) => { G.text(x, 10 + i, k.padEnd(10), 'body'); G.text(x + 10, 10 + i, v, v === 'deny' ? 'pub' : 'ink', v === 'deny' ? 700 : 400); }); }
    return block(s, I, { eyebrow: 'iframely.com', h1: true, title: 'We make URLs work inside other products', paras: ['Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.'], buttons: [['Get API key', 1], ['Check URL']] }, P(G.rows(), s, I, 12));
  });

  /* ------------------------------------------------------------ V02 home trust: both sides of the URL */
  vcard('cv-trust', 'Home trust: both sides of the URL', 'The trust block (“Trusted on both sides of the URL”) as the diagram the heading implies: developers on one side, publishers and their bot managers on the other, Iframely between them, and the four reasons to trust it placed where they act, numbered [1]–[4] and footnoted by the four real cards under it.', 'home · trust', (s, I) => {
    const G = V().grid(104, 13);
    G.box(0, 2, 26, 8, 'ink', 'developers', 'ink'); ['Canva', 'Notion', 'Circle', ''].forEach((t, i) => G.text(2, 3 + i, t, 'ink', 500)); G.text(2, 7, '6,000+ products', 'mute'); G.text(2, 8, 'where people share URLs', 'mute');
    G.box(78, 2, 26, 8, 'ink', 'publishers', 'ink'); ['Cloudflare', 'AWS', 'DataDome'].forEach((t, i) => G.text(80, 3 + i, t, 'ink', 500)); G.text(80, 7, 'WSJ · Reuters', 'mute'); G.text(80, 8, 'robots.txt by name', 'mute');
    G.box(39, 3, 26, 6, 'acc'); G.text(41, 4, '//', 'acc', 800); G.text(43, 4, 'iframely', 'ink', 700); G.text(41, 5, 'one URL at a time', 'mute'); G.text(41, 6, '░▒▓██▓▒░', 'acc'); G.text(41, 7, 'signed · named · logged', 'mute');
    G.hl(26, 6, 13, 'rule'); G.put(25, 6, '├', 'ink'); G.put(39, 6, '┤', 'acc'); G.text(30, 6, '[3]', 'acc', 700);
    G.hl(65, 4, 13, 'rule'); G.put(64, 4, '├', 'acc'); G.put(78, 4, '┤', 'ink'); G.text(69, 4, '[1]', 'acc', 700);
    G.hl(65, 7, 13, 'rule'); G.put(64, 7, '├', 'acc'); G.put(78, 7, '┤', 'ink'); G.text(69, 7, '[2]', 'acc', 700);
    G.put(52, 8, '┬', 'acc'); G.vl(52, 9, 2, 'rule'); G.text(51, 11, '[4]', 'acc', 700); G.text(45, 12, 'SOC 2 · terms · status', 'mute');
    const TRUST = [['[1] Signed requests', 'Every request is signed with Web Bot Auth. Check our key directory and IP ranges.', 'Verify our agents'], ['[2] Allowed by publishers', 'Cloudflare and AWS verify our preview agent. DataDome customers authorize us 100% of the time.', 'How to allow Iframely'], ['[3] Trusted by developers', 'Canva, Notion and Circle point their users to Iframely in their own docs.', 'Read the quotes'], ['[4] Audited and transparent', 'SOC 2 Type II, Automated Processing Terms, a public Publisher Policy and uptime status.', 'Trust center']];
    return block(s, I, { eyebrow: '#trust', title: 'Trusted on both sides of the URL', paras: ['Connecting developers and publishers, one URL at a time.'], cards: TRUST }, P(G.rows(), s, I, 12));
  });

  /* ------------------------------------------------------------ V03 /embeds hero: a stack of embeds */
  vcard('cv-stack', 'Rich Media hero: a stack of embeds', 'The /embeds hero placeholder (“A video player, a post card and an article summary card, stacked”) drawn as exactly that: three embeds in characters, fanned like cards on a desk, the article summary at the back, a post in the middle, the YouTube player in front.', 'embeds · hero', (s, I) => {
    const W = 44, card = (rows) => { const G = V().grid(W, rows); G.box(0, 0, W, rows, 'rule'); return G; };
    const a = card(9); for (let r = 0; r < 7; r++) for (let c = 0; c < 11; c++) a.put(2 + c, 1 + r, shade(c, r, 4), 'rich'); a.text(15, 1, 'oEmbed', 'ink', 700); a.text(15, 2, 'Wikipedia', 'mute'); a.text(15, 4, 'oEmbed is a format for', 'body'); a.text(15, 5, 'allowing an embedded', 'body'); a.text(15, 6, 'representation of a URL…', 'body'); a.text(15, 7, '// en.wikipedia.org', 'rich', 600);
    const b = card(9); b.text(2, 1, '▐█▌', 'rich'); b.text(6, 1, 'Iframely', 'ink', 700); b.text(15, 1, '@iframely · 2h', 'mute'); b.text(2, 3, 'We make URLs work inside', 'ink'); b.text(2, 4, 'other products. 1,900', 'ink'); b.text(2, 5, 'providers, kept up to date.', 'ink'); b.text(2, 7, '12 replies · 48 reposts', 'mute'); b.text(31, 7, '// x.com', 'rich', 600);
    const c = Z().player(W, 'Never Gonna Give You Up'), I2 = Object.assign({}, I, { acc: I.rich }), bg = s.theme === 'black' ? '#0b0b0b' : '#ffffff';
    const parts = [P(a.rows(), s, I2, 12), P(b.rows(), s, I2, 12), P(c, s, I2, 12)], box = div('position:relative;height:430px');
    parts.forEach((p, n) => { p.el.style.cssText += `;position:absolute;left:${n * 46}px;top:${n * 92}px;background:${bg};box-shadow:0 18px 40px -24px rgba(0,0,0,${s.theme === 'black' ? .9 : .28})`; box.appendChild(p.el); });
    return block(s, I, { eyebrow: 'Rich Media', tone: 'rich', title: 'Link previews and embeds that keep working', tagline: 'Bringing URLs to life', paras: ['Send any URL, get a responsive embed, a summary card or clean oEmbed. 1,900 providers, hosted delivery, click-to-play and consent. When X, Meta or TikTok change their embeds, we change ours.'], buttons: [['Get an API key', 1], ['Try a link →']] }, { el: box, text: parts.map(p => p.text).join('\n') }, 'split');
  });

  /* ------------------------------------------------------------ V04 /embeds hosted: embeds ageing */
  vcard('cv-evergreen', 'Hosted iframes: embeds ageing over the years', 'The hosted-iframes block (“Embeds you host once and never touch again”) as a timeline of the same embed on the same page: copied embed code works, then its thumbnail expires, then the provider moves the player; the hosted iframe with its Content ID stays whole and gets refreshed. The three real cards (Hosted iframes, Content IDs, Evergreen refresh) sit under it.', 'embeds · hosted', (s, I) => {
    const G = V().grid(98, 12), Y = ['2019', '2021', '2023', '2026'], X0 = i => 26 + i * 18;
    Y.forEach((y, i) => G.text(X0(i) + 5, 0, y, 'mute', 600)); G.hl(26, 1, 72, 'rule');
    G.text(0, 3, 'copied embed code', 'ink', 600); G.text(0, 4, '<iframe src=…> pasted', 'mute'); G.text(0, 7, 'hosted iframe', 'ink', 600); G.text(0, 8, 'Content ID 7Fq2Kc', 'mute');
    const cell = (i, y, st) => { const x = X0(i), tone = st === 'gone' ? 'rule' : st === 'hosted' || st === 'new' ? 'rich' : 'ink'; G.box(x, y, 15, 3, tone);
      if (st === 'ok' || st === 'hosted') G.text(x + 2, y + 1, '▓▓▓▓▓▓▓ ok', st === 'ok' ? 'body' : 'rich');
      if (st === 'new') { G.text(x + 2, y + 1, '███████', 'rich'); G.text(x + 10, y + 1, 'new', 'rich', 700); }
      if (st === '404') { G.text(x + 2, y + 1, '░░░░░░░', 'rule'); G.text(x + 10, y + 1, '404', 'pub', 700); }
      if (st === 'gone') G.text(x + 2, y + 1, '·· moved ··', 'mute'); };
    ['ok', 'ok', '404', 'gone'].forEach((st, i) => cell(i, 2, st)); ['hosted', 'new', 'hosted', 'new'].forEach((st, i) => cell(i, 6, st));
    G.text(26, 10, '2023 the thumbnail URL expired · 2026 the provider moved its player', 'mute'); G.text(26, 11, 'the hosted iframe followed both changes; nobody edited the post', 'mute');
    return block(s, I, { eyebrow: 'Hosted iframes and Content IDs', tone: 'rich', title: 'Embeds you host once and never touch again', cards: [['Hosted iframes', 'We wrap third-party embed code in our own iframe: isolated from your page, sized before it loads, with a fallback when the provider fails.'], ['Content IDs', 'A short, permanent ID per URL. Refresh a whole archive in one batch call, or use the ID as the iframe source so old posts update themselves.'], ['Evergreen refresh', 'Thumbnails expire, players move, providers deprecate fields. Hosted embeds follow the change; copied embed code does not.']] }, P(G.rows(), s, I, 12));
  });

  /* ------------------------------------------------------------ V05 /embeds interactives: page weight and consent */
  vcard('cv-weight', 'Interactives: page weight and a consent gate', 'The interactives block (“Faster pages, fewer surprises for your readers”) made concrete: the page weight with and without click-to-play as two bars (the copy’s “about 500 KB you no longer load up front”), and the consent gate drawn as the dialog a reader would actually see. The four real cards follow.', 'embeds · interactives', (s, I) => {
    const G = V().grid(100, 14);
    G.text(0, 0, 'page weight before the reader presses play', 'mute');
    G.text(0, 2, 'without click-to-play', 'ink', 600); G.text(24, 2, '█'.repeat(50), 'rich'); G.text(75, 2, '~500 KB player', 'ink', 600); G.text(24, 3, 'the YouTube player, its scripts and styles, on load', 'mute');
    G.text(0, 5, 'with click-to-play', 'ink', 600); G.text(24, 5, '███▏', 'rich'); G.text(29, 5, 'cover image', 'ink', 600); G.text(24, 6, 'the player loads only when the reader presses play', 'mute');
    G.box(24, 8, 52, 6, 'rule', 'consent', 'mute'); G.text(26, 9, 'This video is from youtube.com, which may', 'body'); G.text(26, 10, 'set cookies. Load it?', 'body');
    G.text(26, 12, ' Load video ', 'ground', 600, 'ink'); G.text(40, 12, ' Always allow ', 'ink', 600, 'rule');
    return block(s, I, { eyebrow: 'Interactives', tone: 'rich', title: 'Faster pages, fewer surprises for your readers', cards: [['Click-to-play', 'Show a cover image, load the player only when the reader presses play. A YouTube player is about 500 KB you no longer load up front.', 'Docs'], ['Consent gates', 'Ask before loading third-party media that sets cookies. Required for many EU sites; one parameter to turn on.', 'Docs'], ['Autoplay, safely', 'Muted autoplay when the embed scrolls into view, following each browser’s rules.', 'Docs'], ['Playback events', 'One player.js event API across providers: play, pause, ended, time updates.', 'Docs']] }, P(G.rows(), s, I, 12));
  });

  /* ------------------------------------------------------------ V06 /preview-api what you get: four formats merge */
  vcard('cv-merge', 'Preview API: four formats, one preview', 'The “What you get” block (metadata normalised across Open Graph, Twitter Cards, oEmbed and structured data) as the merge it describes: one row per field, one column per format a page may use, the value Iframely picked highlighted and carried out to the normalised result. Where nothing offers a player, the result is a card. Sample values for github.com/itteco/iframely are illustrative.', 'preview-api · what you get', (s, I) => {
    const C = [13, 19, 19, 15, 17], hdr = ['field', 'Open Graph', 'Twitter Cards', 'oEmbed', 'JSON-LD'];
    const R = [['title', 'itteco/iframely', 'itteco/iframely', '—', 'iframely', 0, 'itteco/iframely'], ['description', 'The URL engine…', 'The URL engine…', '—', '—', 0, 'The URL engine…'], ['site', 'GitHub', '@github', '—', '—', 0, 'GitHub'], ['author', '—', '—', '—', 'itteco', 3, 'itteco'],
      ['thumbnail', '1200 × 600', 'summary_large', '—', '—', 0, '1200 × 600'], ['date', '—', '—', '—', '2026-10-30', 3, '2026-10-30'], ['player', '—', '—', '—', '—', -1, 'none: a card']];
    const pad = (t, w) => (t.length > w - 2 ? t.slice(0, w - 3) + '…' : t).padEnd(w);
    const rows = [{ segs: [...hdr.map((h, i) => seg(pad(h, C[i]), 'mute')), seg('    '), seg('meta (normalised)', 'preview', 600)] }, { segs: [seg('─'.repeat(C.reduce((a, b) => a + b) + 4 + 20), 'rule')], blk: true }];
    R.forEach(r => { const pick = r[5]; rows.push({ segs: [seg(pad(r[0], C[0]), 'ink', 600), ...[1, 2, 3, 4].map(i => seg(pad(r[i], C[i]), r[i] === '—' ? 'rule' : i - 1 === pick ? 'preview' : 'body', i - 1 === pick ? 600 : 400)), seg(pick < 0 ? ' ·· ' : '──> ', pick < 0 ? 'rule' : 'preview'), seg(r[6], pick < 0 ? 'mute' : 'ink', pick < 0 ? 400 : 700)] }, gap(.25)); });
    return block(s, I, { eyebrow: 'What you get', tone: 'preview', title: 'One request, a usable preview for any public URL', cards: [['Metadata', 'Title, description, site, author, dates and thumbnails, normalised across Open Graph, Twitter Cards, oEmbed and structured data.'], ['Summary cards', 'A hosted card for any URL without a player, in light or dark, large or small. Or build your own from the data.'], ['Rich Media, on or off', 'Players and embeds for 1,900 providers come in the same response. Turn them off when you only need metadata.', 'About Rich Media']] }, P(rows, s, I, 12));
  });

  /* ------------------------------------------------------------ V07 /preview-api API: an hour of cached requests */
  vcard('cv-hour', 'Preview API: one hit an hour', 'The caching sentence (“one hit covers every request for a URL within the hour, so a link shared in a busy channel costs once”) as two hours of a link’s life, one character a minute: every request a tick, the single billable hit a block at the first one. A busy hour of 47 requests and a quiet one of 12 both cost one hit. Request times are illustrative.', 'preview-api · api', (s, I) => {
    const G = V().grid(124, 9), hs = DEMOS.typeKit.hash, HOURS = [[0, '14:00', 47, 3], [64, '15:00', 12, 2]];
    HOURS.forEach(([x0, t, n, first]) => {
      G.text(x0, 0, t, 'mute'); G.text(x0 + 27, 0, t.replace(':00', ':30'), 'mute');
      for (let m = 0; m < 60; m++) G.put(x0 + m, 1, m % 15 === 0 ? '┬' : '─', 'rule');
      const mins = new Set([first]); let k = 0; while (mins.size < n && k < 999) { const m = first + Math.floor(Math.pow(hs(k, x0, 5), x0 ? 1 : 1.8) * (59 - first)); mins.add(m); k++; }
      for (const m of mins) { G.put(x0 + m, 2, '▏', 'ink'); G.put(x0 + m, 3, '▏', 'ink'); }
      G.hl(x0, 4, 60, 'rule'); G.put(x0 + first, 4, '█', 'preview'); G.text(x0 + first + 2, 4, ' hit ', 'preview', 700);
      G.text(x0, 6, `${n} requests`, 'ink', 600); G.text(x0 + `${n} requests`.length, 6, ' · 1 hit', 'preview', 700);
    });
    G.put(3, 5, '↑', 'mute'); G.text(0, 8, 'a link shared in #general at 14:03; the channel keeps opening it', 'mute');
    return block(s, I, { eyebrow: 'API', tone: 'preview', title: 'The same request shape for every URL', paras: ['The Iframely API returns metadata, links and, where enabled, the embed HTML. The oEmbed API returns the same in the oEmbed format.', 'Previews are cached: one hit covers every request for a URL within the hour, so a link shared in a busy channel costs once.'], buttons: [['Pricing']] }, P(G.rows(), s, I, 11));
  });

  /* ------------------------------------------------------------ V08 /data-api access: the decision board */
  const BOARD = {
    allowed: { h: 'Allowed: a Creative Commons licence promotes full text', p: ['Store the object next to the content. It is your audit trail when someone asks where a quote came from and whether you were allowed to use it.'],
      rows: [['meta', 'yes', 'supports', '·', '·', '·', 1], ['links', 'yes', 'supports', 'supports', '·', '·', 1], ['entities', 'no', 'promotes', '·', '·', '·', 1], ['excerpt', 'no', 'promotes', '·', '·', '·', 1], ['fulltext', 'no', 'promotes', '·', '·', '·', 1]] },
    blocked: { h: 'Blocked: the publisher said no in the Console', p: ['One block always wins. A licence and publisher Markdown would have promoted full text; the publisher’s explicit setting in the Publisher Console blocked it. You still get metadata and links, and you know exactly why the rest is missing.'],
      rows: [['meta', 'yes', 'supports', '·', '·', '·', 1], ['links', 'yes', 'supports', 'supports', '·', '·', 1], ['entities', 'no', 'promotes', '·', '·', '·', 1], ['excerpt', 'no', 'promotes', '·', '·', '·', 1], ['fulltext', 'no', 'promotes', '·', 'promotes', 'blocks', 0]] },
  };
  vcard('cv-board', 'Data API: the access decision as a board', 'The access-object block (“Every result says what was allowed, and what decided it”) as a board you can read across: one row per content type, one column per signal (Iframely’s default, the licence, page directives, publisher Markdown, the Console), each cell saying whether it supports, promotes or blocks, and the verdict at the end. Switch between the two real samples: allowed by a CC licence, or blocked by the publisher.', 'data-api · access', (s, I) => {
    const W = [11, 10, 12, 13, 12, 12], H = ['', 'default', 'license', 'directives', 'markdown', 'console'];
    const word = w => (w === 'blocks' ? seg(' blocks ', 'white', 700, 'pub') : w === 'promotes' ? seg('promotes', 'data', 700) : w === 'supports' ? seg('supports', 'body') : w === 'yes' ? seg('yes', 'ink', 600) : w === 'no' ? seg('no', 'mute') : seg('·', 'rule'));
    const draw = k => { const B = BOARD[k], rows = [{ segs: [seg('requested ', 'mute'), seg('assist · reference', 'ink', 600), seg('     signals ', 'mute'), seg('CC BY-SA 4.0 · robots.txt 200 · max-image-preview', 'body')] }, gap(.6),
      { segs: [...H.map((h, i) => seg(h.padEnd(W[i]), 'mute')), seg('verdict', 'mute')] }, { segs: [seg('─'.repeat(W.reduce((a, b) => a + b) + 10), 'rule')], blk: true }];
      B.rows.forEach(r => { const segs = [seg(r[0].padEnd(W[0]), 'ink', 600)]; for (let i = 1; i <= 5; i++) { const w = word(r[i]); segs.push(w, seg(' '.repeat(Math.max(1, W[i] - w[0].length)))); } segs.push(r[6] ? seg(' allowed ', 'white', 700, 'data') : seg(' denied ', 'white', 700, 'pub')); rows.push({ segs }, gap(.35)); });
      return rows; };
    const wrap = div(''), tabs = div(`display:flex;gap:0;margin-bottom:18px;font:500 13px ${GMONO}`), board = P(draw('allowed'), s, I, 13), note = div(`margin-top:22px;max-width:70ch;font:400 16px/1.6 ${SANS};color:${I.body}`);
    const set = k => { board.el.innerHTML = Z().receiptText(draw(k), 0, I).html; note.innerHTML = `<div style="font:600 16px ${SANS};color:${I.ink};margin-bottom:6px">${BOARD[k].h}</div>${BOARD[k].p.join(' ')}`; [...tabs.children].forEach(b => { const on = b.dataset.k === k; b.style.background = on ? I.ink : 'transparent'; b.style.color = on ? I.bg : I.ink; }); };
    [['allowed', 'Allowed · CC licence'], ['blocked', 'Blocked · publisher said no']].forEach(([k, l]) => { const b = document.createElement('button'); b.dataset.k = k; b.textContent = l; b.style.cssText = `height:34px;padding:0 14px;border:0;box-shadow:inset 0 0 0 1px ${I.ink};cursor:pointer;font:inherit`; b.onclick = () => set(k); tabs.appendChild(b); });
    wrap.append(tabs, board.el, note); set('allowed');
    const text = ['allowed', 'blocked'].map(k => BOARD[k].h + '\n' + Z().receiptText(draw(k), 0, I).text + '\n' + BOARD[k].p.join(' ')).join('\n\n');
    return block(s, I, { eyebrow: 'The access object', tone: 'data', title: 'Every result says what was allowed, and what decided it', paras: ['<code>requested</code> repeats your mode and use. <code>signals</code> lists what we found: robots.txt, page directives, Content Signals, llms.txt, publisher Markdown, licences such as RSL and Creative Commons. <code>decision</code> gives each content type a verdict and the signals that supported, promoted or blocked it.'] }, { el: wrap, text });
  });

  /* ------------------------------------------------------------ V09 /data-api pricing: a calculator */
  vcard('cv-pricing', 'Data API pricing: the staircase you can drag', 'The pricing block (“Per read, falling with volume”) as a staircase on a log scale (free, $1.00, $0.80, $0.60 per 1,000) with a slider for reads a month: the steps fill up to your volume and a receipt-style breakdown adds up the month. Tiers and prices are the page’s; the arithmetic (paid reads start after the free 1,000) is illustrative.', 'data-api · pricing', (s, I) => {
    const W = 64, lx = r => Math.round((Math.log10(r) - 3) / (Math.log10(2e6) - 3) * (W - 1)), TIERS = [['free', 0, 1e3, 0], ['$1.00', 1e3, 1e5, 1], ['$0.80', 1e5, 5e5, .8], ['$0.60', 5e5, 2e6, .6]];
    const fmt = n => n.toLocaleString('en-US'), usd = v => '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const draw = reads => {
      const rows = [], cut = lx(reads); let total = 0; const lines = [];
      TIERS.forEach(([lab, a, b, p]) => { const x0 = a ? lx(a) : 0, x1 = lx(b); let bar = ''; for (let x = 0; x < W; x++) bar += x >= x0 && x <= x1 ? (x <= cut ? '█' : '░') : ' ';
        rows.push({ segs: [seg(lab.padStart(6) + ' ┤', 'mute'), seg(bar, 'data')], blk: true });
        const n = Math.max(0, Math.min(reads, b) - a); if (n > 0) { const cost = n / 1000 * p; total += cost; lines.push([`${a ? 'to ' + fmt(b) : 'first 1,000'}${p ? ' · ' + lab + '/1K' : ''}`, p ? usd(cost) : 'free']); } });
      rows.push({ segs: [seg('        '), seg('1K'.padEnd(lx(1e4)), 'mute'), seg('10K'.padEnd(lx(1e5) - lx(1e4)), 'mute'), seg('100K'.padEnd(lx(5e5) - lx(1e5)), 'mute'), seg('500K'.padEnd(lx(2e6) - lx(5e5)), 'mute'), seg('2M', 'mute')] });
      rows.push({ segs: [seg(' '.repeat(8 + cut)), seg('↑ ' + fmt(reads) + ' reads', 'ink', 600)] }, gap(.8));
      const lead = (k, v, b) => ({ segs: [seg(k + ' ', 'body', b ? 700 : 400), seg('.'.repeat(Math.max(1, 46 - k.length - v.length)), 'rule'), seg(' ' + v, 'ink', b ? 700 : 500)] });
      lines.forEach(([k, v]) => rows.push(lead(k, v))); rows.push({ segs: [seg('─'.repeat(48), 'rule')], blk: true }, lead('a month', '≈ ' + usd(total), 1));
      return rows; };
    const out = P(draw(50000), s, I, 12), ctl = div(`display:flex;gap:14px;align-items:center;margin-bottom:20px;font:400 13px ${GMONO};color:${I.mute}`, `<span>reads a month</span><input type="range" min="0" max="1000" value="${Math.round((Math.log10(5e4) - 3) / (Math.log10(2e6) - 3) * 1000)}" style="width:300px;accent-color:${I.data}">`);
    ctl.querySelector('input').oninput = e => { const r = Math.round(Math.pow(10, 3 + e.target.value / 1000 * (Math.log10(2e6) - 3)) / 100) * 100; out.el.innerHTML = Z().receiptText(draw(Math.max(1000, r)), 0, I).html; };
    const wrap = div(''); wrap.append(ctl, out.el);
    return block(s, I, { eyebrow: 'Pricing', tone: 'data', title: 'Per read, falling with volume', paras: ['Free: 1,000 reads a month, no card. $1.00 per 1,000 reads to 100,000, $0.80 to 500,000, $0.60 above.', 'Metadata-only unfurls cost half. Prepaid packs for agencies. Enterprise adds the compliance report, an SLA and an EU endpoint.'], buttons: [['Pricing and calculator']] }, { el: wrap, text: Z().receiptText(draw(50000), 0, I).text });
  });

  /* ------------------------------------------------------------ V10 /publishers agents: what each agent reads */
  vcard('cv-anatomy', 'Publishers: what each agent reads of a page', 'The agents table (“Three agents, three reasons, one URL at a time”) as three drawings of the same page: its <head> with the preview tags and its <body>. Each agent’s reach is shaded: █ read, ▒ only with the publisher’s permission, ░ never read. Under each drawing the real when / robots.txt / user-agent lines from the table.', 'publishers · agents', (s, I) => {
    const A = [['Preview Agent', 'A person shares your link in a customer’s app', 'Not consulted: a human requested this one URL', 'Iframely/1.3.1', [1, 1, 1, 1], 'never'],
      ['Processing Agent', 'A customer’s system processes a URL for assist, discover, search or AI input', 'Obeyed, per RFC 9309', 'Iframely-Processing/1.3.1', [1, 1, 1, 1], 'excerpt'],
      ['Training Agent', 'A customer declares training or dataset use', 'Obeyed. No restriction is never read as permission.', 'Iframely-Training', [1, 1, 0, 0], 'permission']];
    const draw = ([, , , , head, body]) => { const G = V().grid(30, 17), TAGS = ['og:title', 'og:image', 'oembed', 'ld+json'];
      G.box(0, 0, 30, 17, 'rule'); G.text(2, 1, '<head>', 'mute'); TAGS.forEach((t, i) => { G.text(2, 2 + i, t.padEnd(10), 'body'); G.text(12, 2 + i, (head[i] ? '█' : '▒').repeat(15), head[i] ? 'pub' : 'mute'); });
      G.put(0, 6, '├', 'rule'); G.hl(1, 6, 28, 'rule'); G.put(29, 6, '┤', 'rule'); G.text(2, 7, '<body>', 'mute');
      for (let r = 0; r < 8; r++) { const words = [6, 9, 4, 7].map((w, i) => w - ((r + i) % 3)); let x = 2; for (const w of words) { if (x + w > 28) break; const read = body === 'excerpt' && r < 2, perm = body === 'permission' || (body === 'excerpt' && r >= 2); G.text(x, 8 + r, (read ? '█' : perm ? '▒' : '░').repeat(w), read ? 'pub' : perm ? 'mute' : 'rule'); x += w + 1; } }
      return G.rows(); };
    const g = div('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px'); let text = '';
    A.forEach(a => { const p = P(draw(a), s, I, 12), c = div(''); c.appendChild(p.el);
      c.appendChild(div(`margin-top:16px;font:400 14px/1.55 ${SANS};color:${I.body}`, `<div style="font:600 16px ${SANS};color:${I.ink};margin-bottom:6px">${a[0]}</div>${a[1]}.<div style="margin-top:10px;font:400 12px/1.5 ${GMONO};color:${I.mute}">robots.txt: ${a[2]}<br>user agent: <span style="color:${I.ink}">${a[3]}</span></div>`));
      g.appendChild(c); text += a[0] + '\n' + p.text + '\n' + a[1] + '\nrobots.txt: ' + a[2] + '\nuser agent: ' + a[3] + '\n\n'; });
    const legend = P([{ segs: [seg('█████', 'pub'), seg(' read   ', 'body'), seg('▒▒▒▒▒', 'mute'), seg(' only with your permission   ', 'body'), seg('░░░░░', 'rule'), seg(' never read', 'body')], blk: true }], s, I, 12, 'margin-top:28px');
    const wrap = div(''); wrap.append(g, legend.el);
    return block(s, I, { eyebrow: 'Who is fetching, and why', tone: 'pub', title: 'Three agents, three reasons, one URL at a time', paras: ['All three sign requests with Web Bot Auth, carry the customer’s identity in a <code>Forwarded</code> header, and never crawl.'] }, { el: wrap, text: text + legend.text });
  });

  /* ------------------------------------------------------------ V11 /publishers signals: the robots.txt generator */
  vcard('cv-robots', 'Publishers: the robots.txt generator, live', 'The signals block (“Say it once in your files. We read it on every request.”) with the prototype’s own generator logic: tick the uses you allow and the robots.txt block rewrites itself, the lines that just changed lit in the Console colour, comments muted and values highlighted like an editor. The ten signals Iframely honours sit above the ticks as chips.', 'publishers · signals', (s, I) => {
    const allow = { search: true, aiInput: true, aiTrain: false, reference: true, iframely: true }; let prev = [];
    const LABELS = [['search', 'Search indexes and results that link back'], ['aiInput', 'AI input: assistants answering a live question'], ['aiTrain', 'AI training'], ['reference', 'Limit use to reference: quote and link, not republish'], ['iframely', 'Add lines for Iframely’s agents']];
    const gen = () => { const yn = v => (v ? 'yes' : 'no'), L = ['# Generated by iframely.com/publishers', 'User-agent: *', `Content-Signal: search=${yn(allow.search)}, ai-input=${yn(allow.aiInput)}, ai-train=${yn(allow.aiTrain)}${allow.reference ? ', use=reference' : ''}`, 'Allow: /', ''];
      if (allow.iframely) L.push('# Iframely Processing Agent: assistants, discovery, search, AI input', 'User-agent: Iframely-Processing', allow.aiInput || allow.search ? 'Allow: /' : 'Disallow: /', '', '# Iframely Training Agent: training only with your opt-in', 'User-agent: Iframely-Training', allow.aiTrain ? 'Allow: /' : 'Disallow: /');
      return L; };
    const I2 = Object.assign({}, I, { hl: X().mix(I.bg, I.pub, s.theme === 'black' ? .22 : .1) });
    const rowsOf = (L, mark) => L.map((l, i) => { const bg = mark && l && prev[i] !== l ? 'hl' : undefined, pad = seg(' '.repeat(Math.max(0, 66 - l.length)), 'ink', 400, bg);
      if (l.startsWith('#')) return { segs: [seg(l, 'mute', 400, bg), pad] };
      const m = /^([\w-]+):\s?(.*)$/.exec(l); if (!m) return { segs: [seg(l || ' ', 'ink', 400, bg), pad] };
      const val = m[2].split(/(no|Disallow)/).length > 1 && /no\b|Disallow/.test(l) ? 'pub' : 'acc';
      return { segs: [seg(m[1] + ':', 'ink', 600, bg), seg(' ' + m[2], /Disallow/.test(m[1]) ? 'pub' : val, 400, bg), pad] }; });
    const code = P([], s, I2, 11, `padding:18px 20px;box-shadow:inset 0 0 0 1px ${I.rule}`);
    const redraw = () => { const L = gen(); code.el.innerHTML = Z().receiptText(rowsOf(L, true), 0, I2).html; prev = L; };
    const left = div(''), chips = div('display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px'), ticks = div(`display:grid;gap:10px;font:400 15px/1.4 ${SANS};color:${I.body}`);
    ['robots.txt (RFC 9309, with the 30-day unavailable rule)', 'meta robots and max-snippet', 'X-Robots-Tag', 'Content Signals: search, ai-input, ai-train, use=', 'RSL licences', 'Creative Commons licences', 'isAccessibleForFree', 'llms.txt', 'Markdown you serve to agents', 'JSON-LD articleBody'].forEach(t => chips.appendChild(div(`padding:6px 10px;font:400 12px ${GMONO};color:${I.body};box-shadow:inset 0 0 0 1px ${I.rule}`, t)));
    LABELS.forEach(([k, t]) => { const l = document.createElement('label'); l.style.cssText = 'display:flex;gap:10px;align-items:flex-start;cursor:pointer'; const c = document.createElement('input'); c.type = 'checkbox'; c.checked = allow[k]; c.style.accentColor = I.pub; c.onchange = () => { allow[k] = c.checked; redraw(); }; l.append(c, document.createTextNode(t)); ticks.appendChild(l); });
    left.append(div(`font:600 16px ${SANS};color:${I.ink};margin-bottom:12px`, 'Signals we honour'), chips, div(`font:600 16px ${SANS};color:${I.ink};margin-bottom:4px`, 'Generate your block'), div(`font:400 14px ${SANS};color:${I.mute};margin-bottom:14px`, 'Tick the uses you allow. Copy the result into robots.txt.'), ticks);
    prev = gen(); code.el.innerHTML = Z().receiptText(rowsOf(prev, false), 0, I2).html;
    const right = div(''); right.append(code.el, div(`margin-top:10px;font:400 12px ${SANS};color:${I.mute}`, 'Previews are not affected: the Preview Agent reads metadata only when a person shares your link.'));
    const g = div('display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:40px;align-items:start'); g.append(left, right);
    return block(s, I, { eyebrow: 'Signals we honour', tone: 'pub', title: 'Say it once in your files. We read it on every request.' }, { el: g, text: gen().join('\n') });
  });

  /* ------------------------------------------------------------ V12 /publishers better previews: the annotated card */
  vcard('cv-annotated', 'Publishers: a good card, annotated', 'The “Make your previews better” block (“A good card needs four tags and one image”) replacing its before/after placeholder: the bare link first, then the card it becomes, with each of the four tags and the image drawn out to the part of the card it fills, including the image size rule (1200 × 630, under 1 MB). The article is a mock on example-news.com.', 'publishers · better previews', (s, I) => {
    const G = V().grid(100, 21);
    G.text(0, 0, 'before', 'mute', 600); G.text(0, 1, 'https://example-news.com/articles/2026/11/rates', 'acc');
    G.text(0, 3, 'after', 'mute', 600); G.box(0, 4, 52, 16, 'rule');
    for (let r = 0; r < 7; r++) for (let c = 0; c < 48; c++) G.put(2 + c, 5 + r, shade(c, r, 12), 'pub');
    G.text(13, 8, ' 1200 × 630 · under 1 MB ', 'ink', 600, 'ground');
    G.text(2, 13, 'Rates hold as inflation cools', 'ink', 700); G.text(2, 14, 'The central bank kept rates on hold on Tuesday', 'body'); G.text(2, 15, 'as inflation cooled for a third month…', 'body'); G.text(2, 17, '// example-news.com', 'pub', 600); G.text(2, 18, 'Example News', 'mute');
    const ann = (y, tag, d, t) => { G.hl(52, y, 4, 'rule'); G.put(56, y, '·', 'rule'); G.text(58, y, tag, t || 'pub', 600); G.text(58 + tag.length + 2, y, d, 'mute'); };
    ann(6, 'og:image', '1200 × 630, under 1 MB'); ann(10, 'og:image:alt', '“Bank building at dusk”'); ann(13, 'og:title', 'the headline'); ann(15, 'og:description', 'one or two sentences'); ann(18, 'og:site_name', 'optional: your name on the card', 'mute');
    return block(s, I, { eyebrow: 'Make your previews better', tone: 'pub', title: 'A good card needs four tags and one image', paras: ['Title, description, a 1200 × 630 image under 1 MB, and the image’s alt text. Add oEmbed discovery or the Iframely publishing protocol and your player appears instead of a summary card.'], buttons: [['Webmaster checklist'], ['URL debugger']] }, P(G.rows(), s, I, 12));
  });
})();
