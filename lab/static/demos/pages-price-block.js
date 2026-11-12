/* G · Page content: pricing block above the closing CTA, round 2 (2026-11-05, group 'pg'). Iterations on G18 after the
   user's notes: type closer to website (src/lib/type/type.ts: hero 40, h2 32, body 18, note 16, tag mono 16,
   button 15 in a pill; cards 12px radius with a hairline), three columns, and only the basic facts per plan (name,
   price, one line, one button). Copy from G01 / iframely-marketing 12-pricing-volumes.md. Needs pages-cta.js (ctaKit). */
(() => {
  const K = () => DEMOS.cvKit2, X = () => DEMOS.sectionsKit, C = () => DEMOS.ctaKit;
  const HEAD = "aeonik-fono, Geist, Inter, sans-serif", SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const H = (...a) => K().div(...a);
  const VOLS = [[1e4, 3], [5e4, 2], [1e5, 1.5], [1e6, .8]];
  const usd = n => '$' + Math.round(n).toLocaleString('en-US');

  /* prototype roles */
  const T = {
    tag: (c, t) => `<div style="font:500 16px/1.3 ${GMONO};color:${c}">${t}</div>`,
    h2: (I, t, c) => `<h2 style="font:400 32px/1.2 ${HEAD};letter-spacing:-.02em;margin:0;color:${c || I.ink};text-wrap:balance">${t}</h2>`,
    body: (c, t, css = '') => `<p style="font:400 18px/1.5 ${SANS};color:${c};margin:0;${css}">${t}</p>`,
    note: (c, t, css = '') => `<p style="font:400 16px/1.5 ${SANS};color:${c};margin:0;${css}">${t}</p>`,
    small: (c, t, css = '') => `<div style="font:400 14px/1.5 ${SANS};color:${c};${css}">${t}</div>`,
    pill: (t, bg, fg, line) => `<span style="display:inline-flex;align-items:center;height:38px;padding:0 20px;border-radius:19px;font:500 15px/1.33 ${SANS};white-space:nowrap;${bg ? `background:${bg};color:${fg}` : `box-shadow:inset 0 0 0 1px ${line};color:${fg}`}">${t}</span>`,
    link: (c, t) => `<span style="font:500 15px ${SANS};color:${c}">${t} →</span>`,
    price: (I, n, unit, sz, c) => `<div style="display:flex;align-items:baseline;gap:2px;font:400 ${sz}px/1 ${HEAD};letter-spacing:-.035em;color:${c || I.ink}">${n}${unit ? `<span style="font:400 ${Math.max(16, Math.round(sz * .32))}px ${SANS};letter-spacing:0;margin-left:3px;opacity:.75">${unit}</span>` : ''}</div>`
  };
  const PLANS = [
    { k: 'free', label: 'Start free', price: '$0', unit: '/mo', line: '2,000 hits a month, then $4 per 1,000', btn: 'Get an API key' },
    { k: 'paid', label: 'Monthly volumes', from: 'from', price: '$30', unit: '/mo', line: 'The more you prepay, the lower the rate', btn: 'Pricing' },
    { k: 'ent', label: 'Enterprise', price: '2M+', unit: 'hits/mo', line: 'Above 2 million hits a month', btn: 'Contact sales' }
  ];
  const FROM = `<span style="font:400 16px ${SANS};letter-spacing:0;margin-right:8px;opacity:.75">from</span>`;
  const INTRO = ['Usage-based pricing', 'One price list, 2,000 hits a month free on every account.'];

  /* colour of the paid plan, from the switch */
  const paint = (I, s) => { const p = C().P.find(x => x.k === s.pg) || C().P[0];
    if (s.paint === 'page') return { bg: I[p.col], fg: '#fff', soft: 'rgba(255,255,255,.8)', acc: I[p.col] };
    if (s.paint === 'ink') return I.dark ? { bg: '#fff', fg: '#000', soft: 'rgba(0,0,0,.65)', acc: I.acc } : { bg: '#0a0a0a', fg: '#fff', soft: 'rgba(255,255,255,.7)', acc: I.acc };
    if (s.paint === 'none') return { bg: null, fg: I.ink, soft: I.mute, acc: I.acc };
    return { bg: I.acc, fg: '#fff', soft: 'rgba(255,255,255,.8)', acc: I.acc }; };
  const cardCss = I => `border-radius:12px;background:${I.surf};box-shadow:inset 0 0 0 1px ${I.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'};`;
  /* one plan, basic facts only */
  const plan = (I, s, q, o = {}) => {
    const pt = paint(I, s), hot = q.k === 'paid' && pt.bg, fg = hot ? pt.fg : I.ink, soft = hot ? pt.soft : I.mute;
    const btn = q.k === 'free' ? T.pill(q.btn, I.ink, I.bg) : hot ? T.pill(q.btn, pt.fg, pt.bg) : T.pill(q.btn, null, I.ink, I.rule);
    return `<div style="${hot ? `background:${pt.bg};border-radius:12px;` : cardCss(I)}${q.k === 'paid' && !pt.bg ? `box-shadow:inset 0 0 0 1.5px ${pt.acc};` : ''}padding:${o.pad || '28px 28px 28px'};display:flex;flex-direction:column;min-height:${o.min || 300}px">
      <div style="font:400 18px/1.4 ${SANS};color:${fg}">${q.label}</div>
      <div style="margin-top:${o.gap || 28}px">${T.price(I, (q.from ? FROM : '') + q.price, q.unit, s.size, fg)}</div>
      ${T.note(soft, q.line, 'margin-top:14px')}
      <div style="margin-top:auto;padding-top:28px">${btn}</div></div>`;
  };
  /* the page's closing CTA in the prototype's Cta layout */
  const cta = (I, s) => { const p = C().P.find(x => x.k === s.pg) || C().P[0], t = C().textOf(p, s);
    return `<div style="padding:96px 0 24px;box-shadow:inset 0 1px 0 ${I.line}">${T.h2(I, p.title + (p.tail ? `<span style="color:${I.acc}">${p.tail}</span>` : ''))}${t ? T.body(I.mute, t, 'margin-top:16px;max-width:42rem') : ''}<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:32px">${p.btns.map((b, i) => (i ? T.pill(b, null, I.ink, I.rule) : T.pill(b, I.ink, I.bg))).join('')}</div></div>`; };

  const OPTS = [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] },
    { key: 'pg', label: 'Page', values: [['home', 'Home'], ['rich', 'Rich Media'], ['preview', 'Preview API'], ['data', 'Data API'], ['pub', 'Publishers']] },
    { key: 'paint', label: 'Paid plan', values: [['acc', 'Blue'], ['page', 'Page colour'], ['ink', 'Black'], ['none', 'Outline']] },
    { key: 'size', label: 'Price size', values: [[40, '40 · hero'], [56, '56'], [72, '72']] },
    { key: 'withcta', label: 'Closing CTA', values: [['yes', 'Shown below'], ['no', 'Hidden']] }];
  const NOTE = 'Plan facts from iframely-marketing 12-pricing-volumes.md (G01): 2,000 hits free then $4 per 1,000; monthly volumes from $30 (10,000 at $3.00); Enterprise above 2 million. Type from website type.ts; the heading face is Aeonik Fono in the prototype and falls back to Geist here. The plan labels and “2M+” are working copy.';
  const TEXT = 'Usage-based pricing\nOne price list, 2,000 hits a month free on every account.\n' + PLANS.map(q => `${q.label}: ${q.from ? 'from ' : ''}${q.price}${q.unit ? ' ' + q.unit : ''}. ${q.line}. [${q.btn}]`).join('\n');
  function pcard(name, title, blurb, build, init, noCta) {
    X().card(name, title, blurb, { group: 'pg', short: name.replace('pg-', ''), note: NOTE,
      init: Object.assign({ theme: 'light', acc2: 'product', pg: 'rich', paint: 'acc', size: 56, withcta: 'no', free: 'new' }, init),
      opts: noCta ? OPTS.filter(o => o.key !== 'withcta') : OPTS,
      items: st => [{ label: 'pricing block · ' + st.pg + ' · ' + st.theme, dom: s => {
        const I = K().ink(s); s.size = +s.size; const el = H(`background:${I.bg};color:${I.ink};padding:96px 64px ${s.withcta === 'yes' && !noCta ? 40 : 96}px;font-family:${SANS}`);
        const v = build(I, s); el.appendChild(typeof v === 'string' ? H('', v) : v); if (s.withcta === 'yes' && !noCta) el.appendChild(H('margin-top:96px', cta(I, s)));
        return { el, text: TEXT };
      } }] });
  }
  const ent = (I, c) => `<div style="font:400 16px/1.5 ${SANS};color:${I.body}">Above 2 million hits a month? <span style="color:${c || I.ink};text-decoration:underline;text-underline-offset:4px">Contact sales</span> →</div>`;

  /* ------------------------------------------------------------ G19 G18 in three columns, prototype type */
  pcard('pg-pb-three', 'Pricing block: G18 in three columns, prototype type', 'G18 rebuilt on the prototype’s type scale (32 px heading, 18 px body, 15 px pill buttons) and laid out in three columns: the heading and line, then Free, then Monthly volumes. Each plan shows only its name, price, one line and one button; Enterprise is the line under the plans.', (I, s) =>
    `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:stretch"><div style="padding-right:12px">${T.tag(I.acc, '/pricing')}<div style="margin:20px 0 16px">${T.h2(I, INTRO[0])}</div>${T.body(I.body, INTRO[1])}</div>${plan(I, s, PLANS[0])}${plan(I, s, PLANS[1])}<div></div><div style="grid-column:span 2;padding-top:8px">${ent(I)}</div></div>`);

  /* ------------------------------------------------------------ G20 three plans, heading above */
  pcard('pg-pb-plans3', 'Pricing block: three plans under a section heading', 'The prototype’s section pattern (path tag, heading on the left, line on the right) over three equal plan cards: Free, Monthly volumes and Enterprise. The paid plan carries the colour. The least text of the set.', (I, s) =>
    `${T.tag(I.acc, '/pricing')}<div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;margin:20px 0 40px">${T.h2(I, INTRO[0])}${T.body(I.body, INTRO[1])}</div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px">${PLANS.map(q => plan(I, s, q, { min: 280 })).join('')}</div>`);

  /* ------------------------------------------------------------ G21 three plans, the middle one picks a volume */
  pcard('pg-pb-pick', 'Pricing block: the paid plan picks a volume', 'G20 with one control: the paid card has four volume chips (10K, 50K, 100K, 1M), and its price and rate change with them. Still one line per plan; everything else is on /pricing.', (I, s) => {
    const el = H('', `${T.tag(I.acc, '/pricing')}<div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;margin:20px 0 40px">${T.h2(I, INTRO[0])}${T.body(I.body, INTRO[1])}</div>`);
    const g = H('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px'); let v = 0;
    const slot = H(''), pt = paint(I, s), hot = !!pt.bg, fg = hot ? pt.fg : I.ink, soft = hot ? pt.soft : I.mute;
    const draw = () => { const [n, r] = VOLS[v];
      slot.innerHTML = `<div style="${hot ? `background:${pt.bg};border-radius:12px;` : cardCss(I) + `box-shadow:inset 0 0 0 1.5px ${pt.acc};`}padding:28px;display:flex;flex-direction:column;min-height:280px"><div style="display:flex;flex-direction:column;align-items:flex-start;gap:12px"><span style="font:400 18px/1.4 ${SANS};color:${fg}">Monthly volumes</span><span style="display:flex;gap:4px">${VOLS.map(([x], i) => `<button data-i="${i}" style="height:26px;padding:0 9px;border:0;border-radius:13px;cursor:pointer;font:500 12px ${SANS};${i === v ? `background:${fg};color:${hot ? pt.bg : I.bg}` : `background:transparent;color:${fg};box-shadow:inset 0 0 0 1px ${hot ? 'rgba(255,255,255,.4)' : I.line}`}">${x >= 1e6 ? '1M' : x / 1e3 + 'K'}</button>`).join('')}</span></div><div style="margin-top:28px">${T.price(I, usd(n / 1000 * r), '/mo', s.size, fg)}</div>${T.note(soft, `${n.toLocaleString('en-US')} hits at $${r.toFixed(2)} per 1,000`, 'margin-top:14px')}<div style="margin-top:auto;padding-top:28px">${hot ? T.pill('Pricing', pt.fg, pt.bg) : T.pill('Pricing', null, I.ink, I.rule)}</div></div>`;
      slot.querySelectorAll('button').forEach(b => (b.onclick = () => { v = +b.dataset.i; draw(); })); };
    slot.style.display = 'grid'; draw(); g.append(H('display:grid', plan(I, s, PLANS[0], { min: 280 })), slot, H('display:grid', plan(I, s, PLANS[2], { min: 280 }))); el.appendChild(g); return el;
  });

  /* ------------------------------------------------------------ G22 no boxes, three columns on rules */
  pcard('pg-pb-rules', 'Pricing block: three columns on hairlines, no boxes', 'The plans without cards: a top rule, three columns divided by hairlines, big prices, a text link each. Reads like the stats rows on the prototype pages, so it can sit quietly just above the CTA.', (I, s) => {
    const pt = paint(I, s);
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;margin-bottom:48px"><div>${T.tag(I.acc, '/pricing')}<div style="margin-top:20px">${T.h2(I, INTRO[0])}</div></div>${T.body(I.body, INTRO[1], 'padding-top:42px')}</div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));box-shadow:inset 0 1px 0 ${I.ink}">${PLANS.map((q, i) => `<div style="padding:24px ${i < 2 ? 32 : 0}px 8px ${i ? 32 : 0}px;${i ? `box-shadow:inset 1px 0 0 ${I.line}` : ''}"><div style="font:400 16px ${SANS};color:${I.mute}">${q.label}</div><div style="margin:28px 0 14px">${T.price(I, (q.from ? FROM : '') + q.price, q.unit, s.size, q.k === 'paid' && s.paint !== 'none' ? (s.paint === 'ink' ? I.ink : pt.acc === I.acc ? I.acc : pt.bg) : I.ink)}</div>${T.note(I.body, q.line)}<div style="margin-top:20px">${T.link(q.k === 'free' ? I.ink : I.acc, q.btn)}</div></div>`).join('')}</div>`;
  }, { size: 72 });

  /* ------------------------------------------------------------ G23 one strip */
  pcard('pg-pb-strip', 'Pricing block: one strip', 'The shortest version: a single bordered row with the heading at the start, the three prices as compact cells and one Pricing button at the end. For pages where pricing is a reminder, not a section.', (I, s) => {
    const pt = paint(I, s);
    return `<div style="${cardCss(I)}display:grid;grid-template-columns:1.25fr repeat(3,1fr) auto;align-items:stretch;overflow:hidden"><div style="padding:28px 28px">${T.tag(I.acc, '/pricing')}<div style="font:400 24px/1.25 ${HEAD};letter-spacing:-.02em;margin-top:12px;color:${I.ink}">${INTRO[0]}</div>${T.small(I.mute, '2,000 hits a month free', 'margin-top:6px')}</div>${PLANS.map(q => { const hot = q.k === 'paid' && pt.bg; return `<div style="padding:28px 24px;${hot ? `background:${pt.bg};` : `box-shadow:inset 1px 0 0 ${I.line};`}display:flex;flex-direction:column;justify-content:space-between;gap:14px"><div style="font:400 15px ${SANS};color:${hot ? pt.soft : I.mute}">${q.label}</div>${T.price(I, (q.from ? '<span style="font-size:.45em;letter-spacing:0;margin-right:6px">from</span>' : '') + q.price, q.unit, Math.min(s.size, 48), hot ? pt.fg : I.ink)}</div>`; }).join('')}<div style="padding:28px;display:flex;align-items:center;box-shadow:inset 1px 0 0 ${I.line}">${T.pill('Pricing', I.ink, I.bg)}</div></div>`;
  }, { size: 40 });

  /* ------------------------------------------------------------ G24 pricing folded into the CTA */
  pcard('pg-pb-merge', 'Pricing block: folded into the closing CTA', 'One block instead of two: the page’s own closing CTA on the left (heading, line, buttons), and the three plans as a short price list on the right. The CTA keeps its words; the price list answers “what does it cost” in three lines.', (I, s) => {
    const p = C().P.find(x => x.k === s.pg) || C().P[0], t = C().textOf(p, s), pt = paint(I, s);
    const rows = PLANS.map(q => `<div style="display:grid;grid-template-columns:1fr auto;gap:16px;align-items:baseline;padding:20px 0;box-shadow:inset 0 -1px 0 ${I.line}"><div><div style="font:400 18px/1.4 ${SANS};color:${I.ink}">${q.label}</div>${T.small(I.mute, q.line, 'margin-top:2px')}</div><div style="text-align:right">${T.price(I, (q.from ? '<span style="font-size:.4em;letter-spacing:0;margin-right:6px;opacity:.7">from</span>' : '') + q.price, q.unit, Math.min(s.size, 40), q.k === 'paid' && s.paint !== 'none' && s.paint !== 'ink' ? pt.bg : I.ink)}</div></div>`).join('');
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start"><div>${T.tag(I[p.col], p.path)}<div style="margin:20px 0 16px">${T.h2(I, p.title + (p.tail ? `<span style="color:${I.acc}">${p.tail}</span>` : ''))}</div>${t ? T.body(I.mute, t) : ''}<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:32px">${p.btns.map((b, i) => (i ? T.pill(b, null, I.ink, I.rule) : T.pill(b, I.ink, I.bg))).join('')}</div></div><div><div style="box-shadow:inset 0 1px 0 ${I.ink}">${rows}</div><div style="margin-top:16px">${T.link(I.acc, 'Pricing')}</div></div></div>`;
  }, { size: 40 }, true);
})();
