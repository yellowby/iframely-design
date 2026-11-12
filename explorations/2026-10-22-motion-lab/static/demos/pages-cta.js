/* G · Page content: closing CTAs (2026-11-05, group 'pg', page #pages). The band at the bottom of the five main pages
   (home, /embeds, /preview-api, /data-api, /publishers), one treatment per card with all five pages stacked so a treatment
   can be judged as a system. Copy from website-prototype: the Cta blocks at the end of each product page; home has no
   closing CTA yet, so it uses the band under its hero ("Connecting developers and publishers, one URL at a time").
   Code lines from website-prototype src/lib/data/samples.ts and the publishers FAQ. Needs content-visuals2.js (cvKit2). */
(() => {
  const K = () => DEMOS.cvKit2, X = () => DEMOS.sectionsKit;
  const SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const H = (...a) => K().div(...a);
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const P = [
    { k: 'home', path: '/', name: 'Home', col: 'acc', title: 'Connecting developers and publishers, ', tail: 'one URL at a time', text: '', btns: ['Get API key', 'Check URL'], step: 'Check URL', field: 'Paste any URL',
      code: ['# connect without a key for previews and embeds', 'claude mcp add --transport http iframely https://mcp.iframely.com/mcp'] },
    { k: 'rich', path: '/embeds', name: 'Rich Media', col: 'rich', title: 'Paste a URL, ship an embed', text: '2,000 hits a month free. No card needed.', btns: ['Get an API key', 'Try a link', 'Pricing'], step: 'Try a link', field: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      code: ['curl "https://iframe.ly/api/iframely?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ\\', '&api_key=$IFRAMELY_API_KEY"'] },
    { k: 'preview', path: '/preview-api', name: 'Preview API', col: 'preview', title: 'Paste a link, see the preview', text: '2,000 hits a month free. No card needed.', btns: ['Get an API key', 'Check a URL'], step: 'Check a URL', field: 'Paste any link',
      code: ['curl "https://iframe.ly/api/iframely?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ\\', '&api_key=$IFRAMELY_API_KEY"'] },
    { k: 'data', path: '/data-api', name: 'Data API', col: 'data', title: 'Read your first URL', text: '1,000 reads a month free. The access object comes with every one.', textNew: '2,000 hits a month free. The access object comes with every one.', btns: ['Get an API key', 'Install the MCP server'], step: 'Install the MCP server', field: 'https://en.wikipedia.org/wiki/Oembed',
      code: ['curl "https://iframe.ly/api/data?url=https://en.wikipedia.org/wiki/Oembed\\', '&mode=assist&use=reference&include=excerpt,entities,fulltext,access\\', '&api_key=$IFRAMELY_API_KEY"'] },
    { k: 'pub', path: '/publishers', name: 'Publishers', col: 'pub', title: 'See who fetches your pages', text: 'Claim your domain in a few minutes. Free.', btns: ['Claim your domain, free', 'Verify our agents', 'Check a URL'], step: 'Claim your domain, free', field: 'yourdomain.com',
      code: ['# block AI training, keep previews', 'User-agent: Iframely-Training', 'Disallow: /'] }
  ];
  const textOf = (p, s) => (s.free === 'new' && p.textNew ? p.textNew : p.text);
  const head = (I, p, sz, c) => `<h2 style="font:400 ${sz || 40}px/1.12 ${SANS};letter-spacing:-.025em;margin:0;color:${c || I.ink};text-wrap:balance">${p.title}${p.tail ? `<span style="color:${c ? 'inherit' : I.acc}">${p.tail}</span>` : ''}</h2>`;
  const b = (I, t, primary, o = {}) => `<span style="height:44px;padding:0 20px;display:inline-flex;align-items:center;gap:8px;border-radius:${o.sq ? 0 : 22}px;font:500 15px ${SANS};white-space:nowrap;${primary ? `background:${o.bg || I.ink};color:${o.fg || I.bg}` : `box-shadow:inset 0 0 0 1px ${o.line || I.rule};color:${o.fg2 || I.ink}`}">${t}</span>`;
  const btns = (I, p, o) => `<div style="display:flex;flex-wrap:wrap;gap:10px">${p.btns.map((t, i) => b(I, t, !i, o)).join('')}</div>`;
  const tag = (I, p, c) => `<div style="font:500 15px ${GMONO};color:${c || I[p.col]}">${p.path}</div>`;
  const sub = (I, p, s, c) => (textOf(p, s) ? `<p style="font:400 17px/1.6 ${SANS};color:${c || I.mute};margin:0;max-width:56ch">${textOf(p, s)}</p>` : '');

  const OPTS = [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] },
    { key: 'which', label: 'Pages', values: [['all', 'All five'], ...P.map(p => [p.k, p.name])] },
    { key: 'free', label: 'Data API free line', values: [['proto', 'As in prototype'], ['new', 'New price list']] }];
  const NOTE = 'Copy from the website-prototype Cta blocks (embeds, preview-api, data-api, publishers); home has no closing CTA, so it uses the band under its hero. The Data API line says 1,000 reads free; the new price list gives 2,000 hits on every account (switch “Data API free line”). Code from src/lib/data/samples.ts; the robots.txt lines follow the publishers FAQ.';
  function card(name, title, blurb, band, init) {
    X().card(name, title, blurb, { group: 'pg', short: name.replace('pg-', ''), init: Object.assign({ theme: 'light', acc2: 'product', which: 'all', free: 'proto' }, init), opts: OPTS, note: NOTE,
      items: st => [{ label: 'closing CTA · ' + st.which + ' · ' + st.theme, dom: s => {
        const I = K().ink(s), el = H(`background:${I.bg};color:${I.ink};padding:40px 40px 48px;font-family:${SANS};display:grid;gap:28px`);
        P.filter(p => s.which === 'all' || s.which === p.k).forEach(p => {
          const row = H(''); row.append(H(`font:500 12px ${GMONO};color:${I.mute};margin:0 0 10px 2px`, `${p.name} · ${p.path === '/' ? 'home' : p.path}`)); const v = band(I, p, s); row.append(typeof v === 'string' ? H('', v) : v); el.appendChild(row); });
        return { el, text: P.map(p => `${p.path}\n${p.title}${p.tail || ''}\n${textOf(p, s)}\n[${p.btns.join('] [')}]`).join('\n\n') };
      } }] });
  }

  /* ------------------------------------------------------------ G09 as built, plus the product colour */
  card('pg-cta-built', 'Closing CTA: as built, with the page’s colour', 'The prototype’s Cta block as it is (heading, one line, buttons on the page ground), with two small additions: the page path as a tag in the product colour, and a hairline above it so the band reads as the end of the page.', (I, p, s) =>
    `<div style="${K().panel(I, 16)}padding:56px 56px 60px;box-shadow:inset 0 3px 0 ${I[p.col]}, inset 0 0 0 1px ${I.line}">${tag(I, p)}<div style="margin:16px 0 14px;max-width:720px">${head(I, p)}</div>${sub(I, p, s)}<div style="margin-top:30px">${btns(I, p)}</div></div>`);

  /* ------------------------------------------------------------ G10 the home product layout, reused */
  card('pg-cta-split', 'Closing CTA: the home product layout, reused', 'The same two columns as the products on the home page (path tag, heading and buttons on the left, the line on the right), so the end of a product page repeats the block that sent the reader there.', (I, p, s) =>
    `<div style="padding:44px 4px 8px;box-shadow:inset 0 1px 0 ${I.line}">${tag(I, p)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;margin-top:20px"><div>${head(I, p)}<div style="margin-top:32px">${btns(I, p)}</div></div><div style="padding-top:6px">${sub(I, p, s, I.body) || `<p style="font:400 17px/1.6 ${SANS};color:${I.body};margin:0">Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.</p>`}</div></div></div>`);

  /* ------------------------------------------------------------ G11 a band in the product colour */
  card('pg-cta-colour', 'Closing CTA: a band in the product colour', 'Each page ends on its own colour: a full band in the product colour with white type and square buttons, home in black with the blue line. The four colours read as a set across the site.', (I, p, s) => {
    const c = p.k === 'home' ? (I.dark ? '#ffffff' : '#0a0a0a') : I[p.col], fg = p.k === 'home' && I.dark ? '#000' : '#fff';
    const t = p.tail ? `${p.title}<span style="color:${I.dark ? I.acc : '#7aa5ff'}">${p.tail}</span>` : p.title;
    return `<div style="background:${c};color:${fg};border-radius:16px;padding:64px 56px;display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:end"><div><div style="font:500 15px ${GMONO};opacity:.75">${p.path}</div><h2 style="font:400 48px/1.08 ${SANS};letter-spacing:-.03em;margin:16px 0 0;text-wrap:balance">${t}</h2></div><div>${textOf(p, s) ? `<p style="font:400 17px/1.6 ${SANS};margin:0 0 24px;opacity:.85">${textOf(p, s)}</p>` : ''}<div style="display:flex;flex-wrap:wrap;gap:10px">${p.btns.map((x, i) => b(I, x, !i, { sq: 1, bg: fg, fg: c, line: fg === '#fff' ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.4)', fg2: fg })).join('')}</div></div></div>`;
  });

  /* ------------------------------------------------------------ G12 the first step, in the band */
  card('pg-cta-step', 'Closing CTA: the first step, in the band', 'The secondary button turned into the thing it opens: a URL field for Check URL and Try a link, the MCP install line for the Data API, a domain field for publishers. The API key stays the primary button. The fields are editable mock-ups.', (I, p, s) => {
    const c = I[p.col], el = H(`${K().panel(I, 16)}padding:48px 52px;display:grid;grid-template-columns:1fr 1.05fr;gap:48px;align-items:center`);
    const left = H('', `${tag(I, p)}<div style="margin:14px 0 12px">${head(I, p, 36)}</div>${sub(I, p, s)}<div style="margin-top:22px">${b(I, p.k === 'pub' ? 'Verify our agents' : p.btns[0], p.k !== 'pub')}</div>`);
    let right;
    if (p.k === 'data') right = H(`border-radius:14px;background:#0d0d0d;padding:20px 22px;font:400 13px/1.7 ${GMONO};color:#d6d6d6`, `<div style="display:flex;justify-content:space-between;font:500 12px ${SANS};color:#8a8a8a;margin-bottom:10px"><span>${p.step}</span><span style="color:${c}">Copy</span></div><span style="color:${c}">$</span> claude mcp add --transport http iframely https://mcp.iframely.com/mcp \\<br>&nbsp;&nbsp;--header "Authorization: Bearer $IFRAMELY_API_KEY"`);
    else { right = H(`display:flex;gap:8px;padding:8px;border-radius:16px;background:${I.well};box-shadow:inset 0 0 0 1.5px ${c}`); const inp = document.createElement('input'); inp.placeholder = p.field; if (p.k === 'rich') inp.value = p.field; inp.style.cssText = `flex:1;min-width:0;border:0;outline:0;background:transparent;padding:0 12px;font:400 15px ${p.k === 'pub' || p.k === 'rich' ? GMONO : SANS};color:${I.ink}`; right.append(inp, H('', b(I, p.step, 1, { bg: c, fg: '#fff', sq: 0 }))); }
    el.append(left, right); return el;
  });

  /* ------------------------------------------------------------ G13 the first request */
  card('pg-cta-code', 'Closing CTA: the first request', 'For a developer audience the last thing on the page is the first call to make: the real sample request from the prototype (preview, Data API) or the hosted MCP server, and for publishers the robots.txt lines from their FAQ. The key is a variable, never a value.', (I, p, s) => {
    const c = I[p.col], lines = p.code.map(l => (l.startsWith('#') ? `<span style="color:#7a7a7a">${esc(l)}</span>` : esc(l).replace(/\$IFRAMELY_API_KEY/g, `<span style="color:${c === I.acc ? '#7aa5ff' : c}">$IFRAMELY_API_KEY</span>`))).join('<br>');
    return `<div style="display:grid;grid-template-columns:.9fr 1.1fr;gap:40px;align-items:center;padding:8px 4px"><div>${tag(I, p)}<div style="margin:14px 0 12px">${head(I, p, 36)}</div>${sub(I, p, s)}<div style="margin-top:24px">${btns(I, p)}</div></div><div style="border-radius:14px;background:#0d0d0d;overflow:hidden"><div style="display:flex;gap:6px;align-items:center;padding:12px 16px;box-shadow:inset 0 -1px 0 #222;font:500 12px ${GMONO};color:#8a8a8a">${['#ff5f57', '#febc2e', '#28c840'].map(x => `<i style="width:9px;height:9px;border-radius:50%;background:${x};opacity:.8"></i>`).join('')}<span style="margin-left:8px">${p.k === 'pub' ? 'robots.txt' : 'terminal'}</span><span style="margin-left:auto;color:${c === I.acc ? '#7aa5ff' : c}">Copy</span></div><div style="padding:18px 20px 22px;font:400 13px/1.75 ${GMONO};color:#d6d6d6;white-space:pre-wrap;word-break:break-all">${lines}</div></div></div>`;
  });

  /* ------------------------------------------------------------ G14 buttons as next steps */
  card('pg-cta-steps', 'Closing CTA: the buttons as next steps', 'The two or three buttons laid out as numbered steps, each a card with its label and where it goes. Same copy, but the band now reads as an order: key first, then the thing to try, then pricing or the proof.', (I, p, s) => {
    const DEST = { 'Get API key': '#signup', 'Get an API key': '#signup', 'Check URL': '/try', 'Check a URL': p.k === 'pub' ? '/tools/url-debugger' : '/try', 'Try a link': '/try', Pricing: '/pricing', 'Install the MCP server': '/mcp', 'Claim your domain, free': '#signup-publisher', 'Verify our agents': '/verification' };
    const c = I[p.col];
    return `<div style="padding:8px 4px">${tag(I, p)}<div style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:end;margin:14px 0 26px"><div>${head(I, p)}</div><div style="max-width:360px">${sub(I, p, s)}</div></div><div style="display:grid;grid-template-columns:repeat(${p.btns.length},minmax(0,1fr));gap:12px">${p.btns.map((t, i) => `<div style="${i ? K().panel(I, 14) : `background:${c};color:#fff;border-radius:14px;`}padding:20px 22px;display:flex;flex-direction:column;gap:22px;min-height:120px"><div style="display:flex;justify-content:space-between;font:500 13px ${GMONO};${i ? `color:${I.mute}` : 'opacity:.8'}"><span>0${i + 1}</span><span>${DEST[t] || ''}</span></div><div style="margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;font:500 19px ${SANS};${i ? `color:${I.ink}` : ''}">${t}<span>→</span></div></div>`).join('')}</div></div>`;
  });

  /* ------------------------------------------------------------ G15 the path as the mark */
  card('pg-cta-mark', 'Closing CTA: the path as the mark', 'The page path set huge in the product colour and cut by the band’s bottom edge (home gets //iframely), with the heading and buttons over it. The same tag that opens each product block on the home page closes the product page.', (I, p, s) => {
    const c = I[p.col], word = p.k === 'home' ? '//iframely' : p.path;
    return `<div style="position:relative;overflow:hidden;${K().panel(I, 16)}padding:52px 56px 0;min-height:400px"><div style="position:relative;z-index:1;display:grid;grid-template-columns:1.1fr 1fr;gap:40px"><div>${head(I, p, 40)}</div><div>${sub(I, p, s, I.body)}<div style="margin-top:22px">${btns(I, p)}</div></div></div><div style="position:absolute;left:44px;right:0;bottom:-.24em;font:500 ${Math.min(230, Math.round(1500 / word.length))}px/1 ${SANS};letter-spacing:-.06em;color:${c};white-space:nowrap;opacity:${I.dark ? .9 : 1}">${word}</div></div>`;
  });

  /* ------------------------------------------------------------ G16 both sides of the URL */
  card('pg-cta-sides', 'Closing CTA: both sides of the URL', 'Every page ends with its own action and a smaller one for the other side of the URL: developer pages offer publishers their console, the publishers page offers developers an API key, and home splits evenly. Copy is each page’s own CTA, reused.', (I, p, s) => {
    const dev = P[1], pub = P[4], side = (q, big) => `<div style="padding:${big ? '44px 44px 46px' : '32px 32px 34px'};${big ? K().panel(I, 16) : `border-radius:16px;background:${K().mix(I.surf, I[q.col], I.dark ? .16 : .07)};`}display:flex;flex-direction:column;gap:14px">${tag(I, q)}${head(I, q, big ? 36 : 26)}${sub(I, q, s)}<div style="margin-top:auto;padding-top:10px">${big ? btns(I, q) : b(I, q.btns[0] + ' →', 0)}</div></div>`;
    if (p.k === 'home') return `<div style="${K().panel(I, 16)}padding:36px 40px 40px"><div style="max-width:720px">${head(I, p, 36)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:28px">${side(dev, 0)}${side(pub, 0)}</div></div>`;
    return `<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:14px;align-items:stretch">${side(p, 1)}${side(p.k === 'pub' ? dev : pub, 0)}</div>`;
  });

  /* ------------------------------------------------------------ G17 what is free, drawn */
  card('pg-cta-free', 'Closing CTA: what is free, drawn', 'The free line under each heading made visible: a month’s meter at zero of 2,000 hits for the developer pages (or the Data API’s line, per the switch), and for publishers the two levels of free access from the home page note (read-only by email, full after DNS verification).', (I, p, s) => {
    const c = I[p.col], n = p.k === 'data' && s.free !== 'new' ? '1,000 reads' : '2,000 hits';
    const meter = p.k === 'pub' ? `<div style="display:grid;gap:10px">${[['Read-only access', 'by email', 1], ['Full access', 'after DNS verification', 1]].map(([a, x]) => `<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;background:${I.well}">${K().okI(c)}<span style="font:500 15px ${SANS};color:${I.ink}">${a}</span><span style="font:400 14px ${SANS};color:${I.mute}">${x}</span><span style="margin-left:auto;font:600 13px ${GMONO};color:${c}">FREE</span></div>`).join('')}</div>`
      : `<div><div style="display:flex;justify-content:space-between;font:500 13px ${GMONO};color:${I.mute};margin-bottom:10px"><span>this month</span><span>0 / ${n}</span></div><div style="height:14px;border-radius:7px;background:${I.faint};position:relative;overflow:hidden">${Array.from({ length: 19 }, (_, i) => `<i style="position:absolute;top:0;bottom:0;left:${(i + 1) * 5}%;width:1px;background:${I.surf}"></i>`).join('')}<i style="position:absolute;left:0;top:0;bottom:0;width:6px;border-radius:7px;background:${c}"></i></div><div style="display:flex;justify-content:space-between;font:400 13px ${SANS};color:${I.mute};margin-top:10px"><span>${p.k === 'home' ? 'Developers and publishers start free' : 'No card needed'}</span><span style="color:${c};font-weight:500">${n} free</span></div></div>`;
    return `<div style="${K().panel(I, 16)}padding:48px 52px;display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center"><div>${tag(I, p)}<div style="margin:14px 0 12px">${head(I, p, 36)}</div>${sub(I, p, s)}<div style="margin-top:24px">${btns(I, p)}</div></div>${meter}</div>`;
  });

  /* ------------------------------------------------------------ G18 pricing, just above the closing CTA */
  /* Layout after a user-supplied mock-up (big heading left; a white "free" box and a coloured "paid from" box stacked
     right; an enterprise line under them). Copy from G01 / 12-pricing-volumes.md; "from $30" is the 10,000 volume. */
  const pricingBlock = (I, s) => {
    const p = P.find(x => x.k === s.pg) || P[0], c = s.paint === 'page' ? I[p.col] : s.paint === 'ink' ? (I.dark ? '#ffffff' : '#0a0a0a') : I.acc;
    const onC = s.paint === 'ink' && I.dark ? '#000' : '#fff', soft = onC === '#fff' ? 'rgba(255,255,255,.82)' : 'rgba(0,0,0,.75)';
    const chk = (t, col, tc) => `<div style="display:flex;gap:10px;align-items:flex-start;font:400 15px/1.45 ${SANS};color:${tc}"><span style="flex:none;width:16px;height:16px;margin-top:2px;border-radius:50%;box-shadow:inset 0 0 0 1.3px ${col};display:inline-flex;align-items:center;justify-content:center"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.2 4.2l1.8 1.7 3.8-4" fill="none" stroke="${col}" stroke-width="1.3"/></svg></span>${t}</div>`;
    const big = (n, unit, col) => `<div style="display:flex;align-items:baseline;font:500 104px/1 ${SANS};letter-spacing:-.05em;color:${col}">${n}<span style="font-size:36px;letter-spacing:-.02em;margin-left:2px">${unit}</span></div>`;
    const box = (bg, fg, sub2, label, price, unit, foot, button, bbg, bfg, lead, items) => `<div style="background:${bg};${bg === I.surf ? `box-shadow:inset 0 0 0 1px ${I.line};` : ''}padding:40px 40px 40px;display:grid;grid-template-columns:1.05fr 1fr;gap:28px"><div style="display:flex;flex-direction:column"><div style="font:400 30px/1.1 ${SANS};letter-spacing:-.015em;color:${fg}">${label}</div><div style="margin-top:22px">${big(price, unit, fg)}</div>${foot ? `<div style="font:400 15px ${SANS};color:${sub2};margin-top:12px">${foot}</div>` : ''}<div style="margin-top:auto;padding-top:34px"><span style="height:44px;padding:0 20px;display:inline-flex;align-items:center;border-radius:6px;background:${bbg};color:${bfg};font:500 15px ${SANS}">${button}</span></div></div><div style="padding-top:6px;display:grid;gap:12px;align-content:start">${lead ? `<div style="font:400 15px/1.5 ${SANS};color:${sub2};margin-bottom:6px">${lead}</div>` : ''}${items}</div></div>`;
    const free = box(I.surf, I.ink, I.mute, 'Start free', '$0', '/mo', '2,000 hits a month, every account', 'Get an API key', I.ink, I.bg, 'Then pay as you go:',
      ['$4 per 1,000 hits, billed for what you used', 'The Preview API, Rich Media and the Data API', 'Cards show the “Powered by” icon', 'One domain'].map(t => chk(t, I.mute, I.body)).join(''));
    const paid = box(c, onC, soft, 'Monthly volumes from', '$30', '/mo', s.bill === 'annual' ? 'Any volume from 10,000 a month on annual billing' : '10,000 hits at $3.00 per 1,000, down to $0.70', 'Pricing', onC, c, 'The more hits you prepay, the lower the rate per 1,000. Every hit costs that rate, including hits above your volume.',
      ['No “Powered by” icon', 'Multiple brands', '99.9% uptime guarantee', 'Content IDs, with annual billing'].map(t => chk(t, onC, onC)).join(''));
    const el = H(`background:${I.bg};color:${I.ink};padding:64px 56px 72px;font-family:${SANS}`);
    el.innerHTML = `<div style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.25fr);gap:56px;align-items:start"><div><div style="font:500 15px ${GMONO};color:${c};margin-bottom:18px">/pricing</div><h2 style="font:500 68px/1 ${SANS};letter-spacing:-.045em;margin:0;color:${I.ink}">Usage&#8209;based<br>pricing</h2><p style="font:400 21px/1.4 ${SANS};color:${I.body};margin:28px 0 0;max-width:22ch">One price list, 2,000 hits a month free on every account.</p><p style="font:400 15px/1.6 ${SANS};color:${I.mute};margin:20px 0 0;max-width:40ch">You pay only for results: errors, including pages that block us in robots.txt, are never billed.</p></div><div style="display:grid;gap:20px">${free}${paid}<div style="font:400 18px ${SANS};color:${I.ink};margin-top:10px">Above 2 million hits a month? <span style="text-decoration:underline;text-underline-offset:4px">Contact sales</span> →</div></div></div>`;
    if (s.withcta === 'yes') { const r = H(`padding:0 56px 56px;background:${I.bg}`, `<div style="${K().panel(I, 16)}padding:48px 56px 52px">${tag(I, p)}<div style="margin:14px 0 12px;max-width:720px">${head(I, p)}</div>${sub(I, p, s)}<div style="margin-top:28px">${btns(I, p)}</div></div>`); const w = H(''); w.append(el, r); return { el: w, text: 'Usage-based pricing' }; }
    return { el, text: 'Usage-based pricing\nOne price list, 2,000 hits a month free on every account.\nStart free: $0/mo, 2,000 hits a month, then $4 per 1,000.\nMonthly volumes from $30/mo: 10,000 hits at $3.00 per 1,000, down to $0.70.\nAbove 2 million hits a month? Contact sales' };
  };
  X().card('pg-cta-pricing', 'Pricing block, just above the closing CTA', 'A short pricing block for the bottom of every product page, after the mock-up you shared: a big heading on the left, the two plans stacked on the right (Free in white, Paid “from $30/mo” in colour), and the Enterprise line under them. Copy from G01; $30 is the 10,000 volume. The Paid box colour can follow the page, and the page’s closing CTA can be shown under it.',
    { group: 'pg', short: 'cta-pricing', init: { theme: 'light', acc2: 'product', pg: 'rich', paint: 'acc', bill: 'monthly', withcta: 'yes', free: 'new' }, note: NOTE,
      opts: [OPTS[0], { key: 'pg', label: 'Page', values: P.map(p => [p.k, p.name]) }, { key: 'paint', label: 'Paid box', values: [['acc', 'Blue'], ['page', 'Page colour'], ['ink', 'Black']] }, { key: 'bill', label: 'Paid line', values: [['monthly', 'Monthly volumes'], ['annual', 'Annual, any volume']] }, { key: 'withcta', label: 'Closing CTA', values: [['yes', 'Shown below'], ['no', 'Hidden']] }],
      items: st => [{ label: 'pricing block · ' + st.pg + ' · ' + st.theme, dom: s => pricingBlock(K().ink(s), s) }] });
  DEMOS.ctaKit = { P, textOf, NOTE };
})();
