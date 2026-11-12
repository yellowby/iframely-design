/* G · Page content: footers, round 2 (2026-11-05, group 'pg'). Our own interpretations: the footer told in the product's
   own terms (a URL, a preview card, an API response, a terminal), the "//" of the new logo as structure, the provider list
   as a moving floor, and the receipt from the X18–X22 rounds. Links and copy from the same sources as pages-footer.js
   (nav.ts, Footer.svelte, the home PageMeta); anything structural (tree, JSON shape, provider sample) is illustrative.
   Needs pages-footer.js (DEMOS.footerKit). */
(() => {
  const K = () => DEMOS.cvKit2, F = () => DEMOS.footerKit;
  const SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const H = (...a) => K().div(...a);
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const TITLE = 'Iframely makes URLs work inside other products';
  const DESC = 'Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.';
  const cols4 = () => { const C = F().COLS; return [C.products, C.solutions, C.devs, C.company]; };

  /* ------------------------------------------------------------ G32 the site map as a terminal tree */
  F().fcard('pg-ft-tree', 'Footer: the site map as a terminal tree', 'For a developer audience the footer is printed, not laid out: a black terminal panel where the site map comes back as a tree (folders for the groups, paths and names aligned), the legal line as the last output, and a prompt waiting with a blinking block cursor. Every line is selectable text.', (I, s) => {
    const C = F().COLS, fg = '#d6d6d6', mu = '#6f6f6f', grp = [C.products, C.solutions, C.tools, C.devs, C.company];
    const line = (pre, path, name, c) => `<div><span style="color:${mu}">${pre}</span><span style="color:${c || fg}">${path.padEnd(26, ' ')}</span><span style="color:${mu}">${name}</span></div>`;
    let rows = `<div style="color:#fff">iframely.com</div>`;
    grp.forEach(([t, it], gi) => { const last = gi === grp.length - 1; rows += `<div><span style="color:${mu}">${last ? '└── ' : '├── '}</span><span style="color:#fff;font-weight:600">${t.toLowerCase().replace(/ /g, '-')}/</span></div>`;
      it.filter(x => !x.href.startsWith('#')).forEach((x, i, a) => (rows += line((last ? '    ' : '│   ') + (i === a.length - 1 ? '└── ' : '├── '), x.href, x.label, x.col ? I[x.col] : null))); });
    const el = H(`background:#0b0b0b;color:${fg};font:400 13px/1.62 ${GMONO};padding:30px 40px 34px;white-space:pre`);
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;white-space:normal">${F().logo(24, I.acc, '#fff')}<span style="display:flex;gap:8px">${F().pill('Get API key', '#fff', '#000')}${F().pill('Check URL', null, '#fff', '#3a3a3a')}</span></div><div><span style="color:${I.acc}">~ $</span> tree iframely.com --links</div><div style="columns:2;column-gap:56px;margin-top:6px">${rows}</div><div style="margin-top:14px;color:${mu}">${F().COLS.legal[1].map(x => x.label.toLowerCase()).join(' · ')}</div><div style="color:${mu}">${esc(F().COPY)} ${F().SINCE}</div><div style="margin-top:14px"><span style="color:${I.acc}">~ $</span> <span class="ftcur" style="display:inline-block;width:.6em;height:1.15em;vertical-align:-.2em;background:${fg}"></span></div>`;
    if (!DEMOS.reduced) { const c = el.querySelector('.ftcur'); K().live(el, () => (c.style.opacity = c.style.opacity === '0' ? '1' : '0'), 530); }
    return el;
  });

  /* ------------------------------------------------------------ G33 the site's own preview card */
  F().fcard('pg-ft-unfurl', 'Footer: iframely.com, as Iframely previews it', 'The footer ends with the company describing itself the way it describes every other link: the site’s own preview card (title and description from the home page meta, the //iframely mark as the image), as it would unfurl in a chat. The links sit beside it in four plain columns.', (I, s) => {
    const card = `<div style="font:400 13px ${SANS};color:${I.mute};margin-bottom:10px">iframely.com, as Iframely previews it</div><div style="border-radius:12px;overflow:hidden;background:${I.surf};box-shadow:inset 0 0 0 1px ${I.line}"><div style="aspect-ratio:1.91/1;background:${I.dark ? '#0b0b0b' : '#f1f1f1'};display:flex;align-items:center;justify-content:center">${F().logo(56, I.acc, I.ink)}</div><div style="padding:14px 16px 16px;box-shadow:inset 0 1px 0 ${I.line}"><div style="display:flex;gap:6px;align-items:center;font:400 12px ${SANS};color:${I.mute}"><span style="font:800 11px ${F().JBM};color:${I.acc}">//</span>iframely.com</div><div style="font:600 15px/1.3 ${SANS};color:${I.ink};margin-top:6px">${TITLE}</div><div style="font:400 13px/1.45 ${SANS};color:${I.body};margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${DESC}</div></div></div>`;
    return `<footer style="background:${I.bg};color:${I.ink};font-family:${SANS};padding:64px 56px 32px;box-shadow:inset 0 1px 0 ${I.line}"><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) 340px;gap:28px">${cols4().map(([t, it]) => `<div>${F().lab(I.ink, t)}${F().links(I, it)}</div>`).join('')}<div>${card}</div></div><div style="margin-top:56px;padding-top:18px;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;align-items:center;font:400 13px ${SANS};color:${I.mute}">${F().logo(20, I.acc, I.ink)}<span>${F().COPY}</span><span style="display:flex;gap:16px">${F().COLS.legal[1].map(x => `<span>${x.label}</span>`).join('')}</span></div></footer>`;
  });

  /* ------------------------------------------------------------ G34 the footer as an API response */
  F().fcard('pg-ft-json', 'Footer: the footer as an API response', 'The site map returned in the shape of an Iframely response for iframely.com: meta with the home page title and description, links grouped by kind, each with href and title, product links in their colours. A Copy button and the request line above it; the visual is the response, the links are real. The JSON shape is a pun, not the API’s.', (I, s) => {
    const C = F().COLS, k = t => `<span style="color:#9ec1ff">"${t}"</span>`, v = t => `<span style="color:#e6e6e6">"${esc(t)}"</span>`, p = t => `<span style="color:#6f6f6f">${t}</span>`;
    const grp = [['products', C.products[1]], ['solutions', C.solutions[1]], ['developers', C.devs[1]], ['company', C.company[1]]];
    const json = `${p('{')}\n  ${k('meta')}${p(': {')}\n    ${k('title')}${p(':')} ${v(TITLE)}${p(',')}\n    ${k('site')}${p(':')} ${v('Iframely')}${p(',')}\n    ${k('since')}${p(':')} <span style="color:#f2c97d">2012</span>\n  ${p('},')}\n  ${k('links')}${p(': {')}\n` + grp.map(([g, it], gi) => `    ${k(g)}${p(': [')}\n` + it.filter(x => !x.href.startsWith('#')).map((x, i, a) => `      ${p('{')} ${k('href')}${p(':')} <span style="color:${x.col ? I[x.col] : '#e6e6e6'}">"${x.href}"</span>${p(',')} ${k('title')}${p(':')} ${v(x.label)} ${p('}')}${i < a.length - 1 ? p(',') : ''}`).join('\n') + `\n    ${p(']')}${gi < grp.length - 1 ? p(',') : ''}`).join('\n') + `\n  ${p('}')}\n${p('}')}`;
    return `<footer style="background:#0b0b0b;color:#e6e6e6;font-family:${SANS};padding:44px 48px 28px"><div style="display:grid;grid-template-columns:300px minmax(0,1fr);gap:48px"><div style="display:flex;flex-direction:column;gap:16px">${F().logo(26, I.acc, '#fff')}<p style="font:400 15px/1.55 ${SANS};color:#a0a0a0;margin:0">${F().BLURB}</p><div style="display:flex;gap:8px">${F().pill('Get API key', '#fff', '#000')}${F().pill('Docs', null, '#fff', '#3a3a3a')}</div><div style="margin-top:auto;font:400 12px/1.7 ${SANS};color:#7a7a7a">${F().BADGES.join(' · ')}<br>${F().COLS.legal[1].map(x => x.label).join(' · ')}<br>${F().COPY}</div></div><div style="border-radius:12px;background:#111;box-shadow:inset 0 0 0 1px #222;overflow:hidden"><div style="display:flex;justify-content:space-between;padding:12px 18px;box-shadow:inset 0 -1px 0 #222;font:400 12px ${GMONO};color:#8a8a8a"><span><span style="color:${I.acc}">GET</span> iframe.ly/api/iframely?url=<span style="color:#e6e6e6">iframely.com</span></span><span>200 · Copy</span></div><pre style="margin:0;padding:16px 18px;font:400 12px/1.6 ${GMONO};white-space:pre;overflow:hidden">${json}</pre></div></div></footer>`;
  });

  /* ------------------------------------------------------------ G35 the two slashes as the frame */
  F().fcard('pg-ft-slashes', 'Footer: the logo’s two slashes as the frame', 'The // from the new logo used as architecture: two blue slashes taller than the footer, cut top and bottom, standing on the left like a door, with the links stepping down the slope to their right. The rest of the footer is plain.', (I, s) => {
    const sl = s.slc === 'ink' ? I.ink : I.acc, fs = 560;
    return `<footer style="position:relative;overflow:hidden;background:${I.bg};color:${I.ink};font-family:${SANS};height:500px;box-shadow:inset 0 1px 0 ${I.line}"><div style="position:absolute;right:-70px;top:50%;transform:translateY(-52%);font:800 ${fs}px/1 ${F().JBM};letter-spacing:-.08em;color:${sl};white-space:nowrap">//</div>
      <div style="position:absolute;left:56px;right:470px;top:60px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px">${cols4().map(([t, it], i) => `<div style="padding-top:${(3 - i) * 0}px">${F().lab(I.ink, t)}${F().links(I, it, { dots: 1 })}</div>`).join('')}</div>
      <div style="position:absolute;left:56px;right:540px;bottom:30px;padding-top:18px;box-shadow:inset 0 1px 0 ${I.line};display:grid;grid-template-columns:auto 1fr;gap:6px 28px;align-items:center;font:400 13px ${SANS};color:${I.mute}">${F().logo(22, I.acc, I.ink)}<span style="text-align:right">${F().COPY}</span><span></span><span style="text-align:right">${F().mdLine(I)}</span></div></footer>`;
  }, [{ key: 'slc', label: 'Slashes', values: [['acc', 'Blue'], ['ink', 'Ink']] }], { slc: 'acc' });

  /* ------------------------------------------------------------ G36 the providers as a moving floor */
  F().fcard('pg-ft-providers', 'Footer: 1,900 providers as a moving floor', 'Under the links, the reason the company exists scrolls by: rows of provider names drifting in opposite directions, set large and faint, with “1,900 providers” and the //iframely mark sitting on top. Pauses on hover; still when reduced motion is on. The provider names are a sample.', (I, s) => {
    const PROV = ['YouTube', 'Vimeo', 'Spotify', 'SoundCloud', 'TikTok', 'Instagram', 'X', 'Figma', 'GitHub', 'Google Maps', 'Loom', 'Twitch', 'CodePen', 'Reddit', 'Giphy', 'Flickr', 'Pinterest', 'Dailymotion', 'Wistia', 'Miro', 'Canva', 'Notion', 'Bluesky', 'Mastodon', 'Apple Podcasts', 'Bandcamp'];
    const el = H(`background:${I.bg};color:${I.ink};font-family:${SANS};box-shadow:inset 0 1px 0 ${I.line};overflow:hidden`);
    el.innerHTML = `<style>@keyframes ftl{to{transform:translateX(-50%)}}@keyframes ftr{from{transform:translateX(-50%)}to{transform:translateX(0)}}.ftrow:hover{animation-play-state:paused}</style><div style="padding:64px 56px 0;display:grid;grid-template-columns:1.3fr repeat(4,1fr);gap:28px"><div>${F().logo(24, I.acc, I.ink)}<p style="font:400 14px/1.5 ${SANS};color:${I.body};margin:16px 0 14px">${F().BLURB}</p>${F().badges(I)}</div>${cols4().map(([t, it]) => `<div>${F().lab(I.ink, t)}${F().links(I, it)}</div>`).join('')}</div>`;
    const floor = H('position:relative;margin-top:56px;padding:18px 0 8px;box-shadow:inset 0 1px 0 ' + I.line);
    [0, 1, 2].forEach(r => { const names = PROV.slice(r * 7).concat(PROV.slice(0, r * 7)), txt = names.map(n => `<span style="margin-right:.7em">${n}</span><span style="margin-right:.7em;color:${I.acc};opacity:.6">//</span>`).join('');
      floor.appendChild(H(`white-space:nowrap;font:500 64px/1.12 ${SANS};letter-spacing:-.03em;color:${I.ink};opacity:${[.12, .2, .12][r]}`, `<div class="ftrow" style="display:inline-block;${DEMOS.reduced ? '' : `animation:${r % 2 ? 'ftr' : 'ftl'} ${70 + r * 18}s linear infinite`}">${txt}${txt}</div>`)); });
    floor.appendChild(H(`position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%);display:flex;justify-content:space-between;align-items:center;pointer-events:none`, `<div style="font:400 72px/1 ${F().HEAD};letter-spacing:-.04em;color:${I.ink};background:${I.bg};padding:4px 18px 10px 0">1,900 providers</div><div style="background:${I.bg};padding:10px 0 10px 18px">${F().pill('Supported providers', I.ink, I.bg)}</div>`));
    el.appendChild(floor); el.appendChild(H(`margin:0 56px;padding:16px 0 22px;display:flex;justify-content:space-between;font:400 13px ${SANS};color:${I.mute};box-shadow:inset 0 1px 0 ${I.line}`, `<span>${F().COPY} ${F().SINCE}</span><span>${F().COLS.legal[1].map(x => x.label).join(' · ')}</span>`));
    return el;
  });

  /* ------------------------------------------------------------ G37 the footer as a receipt */
  F().fcard('pg-ft-receipt', 'Footer: the footer printed as a receipt', 'The receipt from the X18–X22 rounds, now as the site’s last word: one long slip in Geist Mono on the page ground with torn edges, the links as line items with dotted leaders to their paths, the free allowance as the total, badges and copyright as the small print, a barcode at the end. Left of it, the two buttons and the blurb.', (I, s) => {
    const W = 50, C = F().COLS, dots = (a, b) => a + ' ' + '.'.repeat(Math.max(2, W - a.length - b.length - 2)) + ' ' + b;
    const sec = ([t, it]) => `<div style="margin-top:12px;font-weight:600;color:${I.ink}">${t.toUpperCase()}</div>` + it.filter(x => !x.href.startsWith('#')).map(x => `<div style="color:${x.col ? I[x.col] : I.body}">${esc(dots(x.label, x.href))}</div>`).join('');
    const rule = `<div style="color:${I.mute}">${'-'.repeat(W)}</div>`, bars = Array.from({ length: 64 }, (_, i) => `<i style="display:inline-block;width:${[1, 2, 1, 3][(i * 7 + (i >> 2)) % 4]}px;height:44px;margin-right:${[1, 2, 1][(i * 5) % 3]}px;background:${I.ink}"></i>`).join('');
    const tear = up => `<div style="height:10px;background:${I.surf};-webkit-mask:radial-gradient(circle at 6px ${up ? '0' : '10px'},transparent 5px,#000 5.5px) -6px 0/12px 10px repeat-x;mask:radial-gradient(circle at 6px ${up ? '0' : '10px'},transparent 5px,#000 5.5px) -6px 0/12px 10px repeat-x"></div>`;
    const slip = `<div style="width:${W * 7.8 + 56}px;filter:drop-shadow(0 1px 0 ${I.line})">${tear(1)}<div style="background:${I.surf};padding:22px 28px;font:400 13px/1.6 ${GMONO};white-space:pre;color:${I.body}"><div style="text-align:center">${F().logo(30, I.acc, I.ink)}</div><div style="text-align:center;color:${I.mute};margin-top:6px">iframely.com · footer</div>${rule}${[C.products, C.tools, C.devs, C.company].map(sec).join('')}${rule}<div style="display:flex;justify-content:space-between;font-weight:600;color:${I.ink}"><span>FREE, EVERY MONTH</span><span>2,000 hits</span></div><div style="display:flex;justify-content:space-between;color:${I.ink}"><span>TOTAL</span><span>$0.00</span></div>${rule}<div style="white-space:normal;text-align:center;color:${I.mute};font-size:12px">${F().BADGES.join(' · ')}<br>${F().COPY}<br>${F().SINCE}</div><div style="text-align:center;margin-top:14px;line-height:0">${bars}</div></div>${tear(0)}</div>`;
    return `<footer style="background:${I.bg};color:${I.ink};font-family:${SANS};padding:64px 56px;box-shadow:inset 0 1px 0 ${I.line};display:grid;grid-template-columns:minmax(0,1fr) auto;gap:56px;align-items:start"><div><h2 style="font:400 32px/1.2 ${F().HEAD};letter-spacing:-.02em;margin:0;color:${I.ink};max-width:14em">${TITLE}</h2><p style="font:400 18px/1.5 ${SANS};color:${I.body};margin:16px 0 28px;max-width:34em">${F().BLURB}</p><div style="display:flex;gap:10px">${F().pill('Get API key', I.ink, I.bg)}${F().pill('Check URL', null, I.ink, I.rule)}</div><div style="margin-top:40px;font:400 13px/1.8 ${SANS};color:${I.mute}">${F().COLS.legal[1].map(x => x.label).join(' · ')}</div></div>${slip}</footer>`;
  });

  /* ================================================================ G38–G42: G32 on the light ground, one colour.
     Ink and grey only; the brand blue is kept for the prompt and the logo's //, as the user asked (no product colours). */
  /* Legal is a group of its own (the user: "Legal section is a must"). The prototype links legal pages, Status and Trust
     center to #anchors; the tree shows them as the paths they would get (#terms → /terms). */
  const GROUPS = () => { const C = F().COLS; return [C.products, C.solutions, C.tools, C.devs, C.company, C.legal]; };
  /* Geist Mono has no box-drawing glyphs (the fallback rendered tinted); the branches are drawn in JetBrains Mono */
  const BOX = "'JetBrains Mono', 'Geist Mono', monospace";
  const clean = it => it.map(x => (x.href.startsWith('#') ? Object.assign({}, x, { href: '/' + x.href.slice(1) }) : x));
  /* one group as tree lines; pad = width of the path column in characters */
  const branch = (I, [t, it], last, pad, o = {}) => {
    const mu = o.mu || I.mute, rows = clean(it);
    let h = `<div><span style="color:${mu};font-family:${BOX}">${o.root === false ? '' : last ? '└── ' : '├── '}</span><span style="color:${I.ink};font-weight:600">${t.toLowerCase().replace(/ /g, '-')}/</span></div>`;
    rows.forEach((x, i) => (h += `<div class="ftrow2" data-href="${x.href}" style="${o.hover ? 'cursor:pointer;' : ''}"><span style="color:${mu};font-family:${BOX}">${o.root === false ? '' : last ? '    ' : '│   '}${i === rows.length - 1 ? '└── ' : '├── '}</span><span class="p" style="color:${I.ink}">${x.href.padEnd(pad, ' ')}</span><span class="n" style="color:${mu}">${x.label}</span></div>`));
    return h;
  };
  const prompt = (I, cmd, cur) => `<div><span style="color:${I.acc}">~ $</span> <span style="color:${I.ink}">${cmd}</span>${cur ? ` <span class="ftcur2" style="display:inline-block;width:.6em;height:1.15em;vertical-align:-.2em;background:${I.ink}"></span>` : ''}</div>`;
  const blink = el => { if (DEMOS.reduced) return; const c = el.querySelector('.ftcur2'); if (c) K().live(el, () => (c.style.opacity = c.style.opacity === '0' ? '1' : '0'), 530); };
  const LIGHT = [{ key: 'size', label: 'Type', values: [[13, '13 px'], [14, '14 px'], [15, '15 px']] },
    { key: 'hover', label: 'Hover', values: [['select', 'Selection'], ['arrow', 'Arrow'], ['link', 'Blue link'], ['cursor', 'Cursor']] }];
  /* link hover for the tree rows: a terminal selection (the row inverted), an arrow replacing the branch, the name turning
     into a blue underlined link with a return mark, or a block cursor after the name. Until the pointer comes in, the
     card plays a slow demo, hovering one row after another, so the state can be judged in a still view too. */
  function hov(el, I, s) {
    const rows = [...el.querySelectorAll('.ftrow2')]; if (!rows.length) return; const mode = s.hover || 'select';
    const on = r => { if (r._h) return; r._h = r.innerHTML; const sp = [...r.children], br = sp[0], lab = sp[sp.length - 1];
      if (mode === 'select') { r.style.background = I.ink; sp.forEach(x => (x.style.color = I.bg)); }
      else if (mode === 'arrow') { br.textContent = br.textContent.replace(/[├└]─+\s*$/, m => '→'.padEnd(m.length, ' ')); br.style.color = I.acc; lab.style.color = I.ink; lab.style.fontWeight = '600'; sp.forEach(x => x !== br && x !== lab && (x.style.color = I.ink)); }
      else if (mode === 'link') { lab.style.color = I.acc; lab.style.textDecoration = 'underline'; lab.style.textUnderlineOffset = '3px'; lab.insertAdjacentHTML('beforeend', `<span style="text-decoration:none;display:inline-block;margin-left:.5ch">↵</span>`); }
      else { lab.insertAdjacentHTML('beforeend', `<span style="display:inline-block;width:.6em;height:1.1em;margin-left:.4ch;vertical-align:-.18em;background:${I.acc}"></span>`); lab.style.color = I.ink; } };
    const off = r => { if (!r._h) return; r.innerHTML = r._h; r._h = null; r.style.background = ''; };
    rows.forEach(r => { r.style.cursor = 'pointer'; r.style.borderRadius = '2px'; r.onmouseenter = () => { rows.forEach(off); on(r); }; r.onmouseleave = () => off(r); });
    let inside = false, k = 0; el.addEventListener('mouseenter', () => { inside = true; rows.forEach(off); }); el.addEventListener('mouseleave', () => (inside = false));
    const step = () => { if (inside) return; rows.forEach(off); on(rows[(k = (k + 5) % rows.length)]); };
    if (DEMOS.reduced) on(rows[3]); else { step(); K().live(el, step, 1400); }
  }
  const legalLine = I => `<div style="color:${I.mute}">${esc(F().COPY)} ${F().SINCE}</div>`;

  /* ------------------------------------------------------------ G38 G32 as a light panel */
  F().fcard('pg-ft-tree-light', 'Footer: the terminal tree, light', 'G32 moved onto the light page: a white panel with a hairline, ink paths and grey names, no product colours. Blue is left only on the prompt and the logo’s //. The buttons sit in the panel’s header like a window title bar.', (I, s) => {
    const el = H(`background:${I.bg};padding:40px 40px 56px;min-width:0;overflow:hidden;font-family:${SANS}`), fs = +s.size, g = GROUPS();
    const panel = H(`background:${I.surf};box-shadow:inset 0 0 0 1px ${I.line};border-radius:12px;overflow:hidden`);
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;box-shadow:inset 0 -1px 0 ${I.line}">${F().logo(22, I.acc, I.ink)}<span style="display:flex;gap:8px">${F().pill('Get API key', I.ink, I.bg)}${F().pill('Check URL', null, I.ink, I.rule)}</span></div><div style="padding:24px 28px 26px;font:400 ${fs}px/1.65 ${GMONO};white-space:pre;color:${I.body}">${prompt(I, 'tree iframely.com --links')}<div style="columns:2;column-gap:56px;margin-top:6px"><div style="color:${I.ink}">iframely.com</div>${g.map((x, i) => branch(I, x, i === g.length - 1, 22)).join('')}</div><div style="margin-top:14px">${legalLine(I)}</div><div style="margin-top:14px">${prompt(I, '', 1)}</div></div>`;
    el.appendChild(panel); blink(el); hov(el, I, s); return el;
  }, LIGHT, { size: 13, hover: 'select' });

  /* ------------------------------------------------------------ G39 printed straight on the page */
  F().fcard('pg-ft-tree-page', 'Footer: the tree printed straight on the page', 'No panel, no window: the footer is just terminal output on the page ground, under a hairline. The command is the first line, the six groups (Legal included) run in two rows of three, each its own small tree of paths, and the logo closes the listing as the last line.', (I, s) => {
    const fs = +s.size, g = GROUPS(), el = H(`background:${I.bg};padding:56px 56px 48px;box-shadow:inset 0 1px 0 ${I.line};font:400 ${fs}px/1.7 ${GMONO};color:${I.body};white-space:pre`);
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;white-space:normal">${prompt(I, 'tree iframely.com --links')}<span style="display:flex;gap:8px;font-family:${SANS}">${F().pill('Get API key', I.ink, I.bg)}${F().pill('Check URL', null, I.ink, I.rule)}</span></div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px 32px;margin-top:28px">${g.map(x => `<div>${branch(I, x, true, 0, { root: false }).replace(/<span class="n"[^>]*>[^<]*<\/span>/g, '')}</div>`).join('')}</div><div style="margin-top:28px;padding-top:18px;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;align-items:baseline;white-space:normal">${F().logo(22, I.acc, I.ink)}<span style="color:${I.mute}">${esc(F().COPY)}</span><span style="color:${I.mute}">${F().SINCE}</span></div>`;
    hov(el, I, s); return el;
  }, LIGHT, { size: 13, hover: 'select' });

  /* ------------------------------------------------------------ G40 one tree, drawn as a chart */
  F().fcard('pg-ft-tree-chart', 'Footer: one tree, drawn across the width', 'The tree turned sideways: iframely.com at the top, box-drawing lines branching down to the five groups across the full width, and each group’s links hanging under it. Still all text, in one colour; it reads as a site map at a glance.', (I, s) => {
    const fs = +s.size, g = GROUPS(), cw = fs * .6, colW = 1088 / 5, el = H(`background:${I.bg};padding:56px 56px 48px;box-shadow:inset 0 1px 0 ${I.line};font:400 ${fs}px/1.7 ${GMONO};color:${I.body}`);
    const top = `<div style="position:relative;height:${fs * 3.4}px;white-space:pre">
      <div style="position:absolute;left:0;top:0;color:${I.ink}">${F().logo(Math.round(fs * 1.5), I.acc, I.ink)}</div>
      <div style="position:absolute;left:8px;top:${fs * 1.9}px;width:1px;height:${fs * .8}px;background:${I.mute}"></div>
      <div style="position:absolute;left:8px;right:calc(${100 / 6}% - 8px);top:${fs * 2.7}px;height:1px;background:${I.mute}"></div>
      ${g.map((_, i) => `<div style="position:absolute;left:calc(${(i * 100) / 6}% + 8px);top:${fs * 2.7}px;width:1px;height:${fs * .7}px;background:${I.mute}"></div>`).join('')}</div>`;
    el.innerHTML = top + `<div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));white-space:pre">${g.map(([t, it]) => `<div style="padding-right:16px"><div style="color:${I.ink};font-weight:600">${t.toLowerCase().replace(/ /g, '-')}/</div>${clean(it).map((x, i, a) => `<div class="ftrow2" style="display:grid;grid-template-columns:3ch 1fr"><span style="color:${I.mute};font-family:${BOX}">${i === a.length - 1 ? '└─' : '├─'}</span><span style="color:${I.ink};white-space:normal">${x.label}</span></div>`).join('')}</div>`).join('')}</div>
      <div style="margin-top:36px;padding-top:18px;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;color:${I.mute}"><span>${esc(F().COPY)}</span><span>${F().SINCE}</span></div>`;
    hov(el, I, s); return el;
  }, LIGHT, { size: 13, hover: 'select' });

  /* ------------------------------------------------------------ G41 the prompt follows the pointer */
  F().fcard('pg-ft-tree-live', 'Footer: the prompt follows the pointer', 'G38 with one interaction: hovering a line writes the matching command into the prompt (open https://iframely.com/embeds) and inverts the line like a terminal selection; clicking would go there. With nothing hovered the prompt waits with a blinking cursor.', (I, s) => {
    const fs = +s.size, g = GROUPS(), el = H(`background:${I.bg};padding:40px 40px 56px;min-width:0;overflow:hidden;font-family:${SANS}`);
    const panel = H(`background:${I.surf};box-shadow:inset 0 0 0 1px ${I.line};border-radius:12px;overflow:hidden;font:400 ${fs}px/1.65 ${GMONO};color:${I.body}`);
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;box-shadow:inset 0 -1px 0 ${I.line};font-family:${SANS}">${F().logo(22, I.acc, I.ink)}<span style="display:flex;gap:8px">${F().pill('Get API key', I.ink, I.bg)}${F().pill('Check URL', null, I.ink, I.rule)}</span></div><div style="padding:24px 28px 26px;white-space:pre">${prompt(I, 'tree iframely.com --links')}<div style="columns:2;column-gap:56px;margin-top:6px"><div style="color:${I.ink}">iframely.com</div>${g.map((x, i) => branch(I, x, i === g.length - 1, 22, { hover: 1 })).join('')}</div><div style="margin-top:14px">${legalLine(I)}</div><div class="pl" style="margin-top:14px"></div></div>`;
    const pl = panel.querySelector('.pl'), idle = () => { pl.innerHTML = prompt(I, '', 1); blink(panel); };
    panel.querySelectorAll('.ftrow2').forEach(r => { r.onmouseenter = () => { r.style.background = I.ink; r.querySelectorAll('span').forEach(x => (x.style.color = I.bg)); pl.innerHTML = prompt(I, `open https://iframely.com${r.dataset.href}`) ; };
      r.onmouseleave = () => { r.style.background = ''; r.querySelectorAll('span').forEach((x, i) => (x.style.color = i === 0 || x.classList.contains('n') ? I.mute : I.ink)); idle(); }; });
    idle(); el.appendChild(panel); return el;
  }, LIGHT, { size: 14 });

  /* ------------------------------------------------------------ G42 the tree standing on the logo */
  F().fcard('pg-ft-tree-floor', 'Footer: the tree standing on the logo', 'G39’s output on the light page with G25’s ending: after the listing, the //iframely logo set across the whole width and cut by the bottom edge, in ink with the blue slashes (or all ink). The loudest of the light versions.', (I, s) => {
    const fs = +s.size, g = GROUPS(), el = H(`background:${I.bg};box-shadow:inset 0 1px 0 ${I.line};overflow:hidden`);
    el.innerHTML = `<div style="padding:56px 56px 0;font:400 ${fs}px/1.7 ${GMONO};color:${I.body};white-space:pre"><div style="display:flex;justify-content:space-between;align-items:center;white-space:normal">${prompt(I, 'tree iframely.com --links')}<span style="display:flex;gap:8px;font-family:${SANS}">${F().pill('Get API key', I.ink, I.bg)}${F().pill('Check URL', null, I.ink, I.rule)}</span></div><div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:24px;margin-top:28px">${g.map(([t, it]) => `<div><div style="color:${I.ink};font-weight:600">${t.toLowerCase().replace(/ /g, '-')}/</div>${clean(it).map((x, i, a) => `<div class="ftrow2" style="display:grid;grid-template-columns:3ch 1fr"><span style="color:${I.mute};font-family:${BOX}">${i === a.length - 1 ? '└─' : '├─'}</span><span style="color:${I.ink};white-space:normal">${x.label}</span></div>`).join('')}</div>`).join('')}</div><div style="margin-top:28px;padding:14px 0;box-shadow:inset 0 1px 0 ${I.line};display:flex;justify-content:space-between;white-space:normal;color:${I.mute}"><span>${esc(F().COPY)}</span><span>${F().SINCE}</span></div></div><div style="height:118px;overflow:hidden;padding:0 40px;margin-top:8px">${DEMOS.footerFloor ? DEMOS.footerFloor(I, s.mk) : F().bigLogo(I.acc, I.ink)}</div>`;
    hov(el, I, s); return el;
  }, [...LIGHT, { key: 'mk', label: 'Floor', values: DEMOS.footerFloors || [['brand', 'Blue //'], ['ink', 'All ink']] }], { size: 13, mk: 'brand', hover: 'arrow' });
})();
