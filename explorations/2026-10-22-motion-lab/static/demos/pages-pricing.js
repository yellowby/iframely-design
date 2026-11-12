/* G · Page content: pricing (2026-11-05, group 'pg', page #pages). Explorations for the /pricing page with the new price
   list from iframely-marketing plans/website/12-pricing-volumes.md (decisions D41–D45) and its demo page
   (demos/website/src/routes/pricing, src/lib/data/pricing.ts): two plans, Free (2,000 hits a month, then pay as you go at
   $4 per 1,000) and a paid monthly volume commitment ($3.00 to $0.70 per 1,000, every hit at the volume's rate; annual
   billing for any volume between the rows), Enterprise above 2 million. Copy from the plan's "How it reads" section and the
   demo page; prices computed with the same rules as pricing.ts. The price box grows out of V21 (cv-calc).
   Needs content-visuals.js (block) and content-visuals2.js (DEMOS.cvKit2). */
(() => {
  const K = () => DEMOS.cvKit2, B = () => DEMOS.cvKit, X = () => DEMOS.sectionsKit;
  const SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const H = (...a) => K().div(...a);

  /* ---- the price list (pricing.ts) */
  const FREE = 2000, PAYG = 4, ENT = 2e6, FLOOR = .5;
  const VOL = [[1e4, 3], [2e4, 2.5], [5e4, 2], [1e5, 1.5], [2e5, 1.2], [5e5, .9], [1e6, .8], [2e6, .7]];
  const rateAt = v => { v = Math.min(Math.max(v, VOL[0][0]), ENT); for (let i = 1; i < VOL.length; i++) { const [a, ra] = VOL[i - 1], [b, rb] = VOL[i]; if (v <= b) return ra + (rb - ra) * (v - a) / (b - a); } return VOL[VOL.length - 1][1]; };
  const paid = u => Math.max(0, u - FREE), payg = u => paid(u) / 1000 * PAYG;
  const volCost = ([v, r], u) => Math.max(v, paid(u)) / 1000 * r;
  const best = u => VOL.reduce((b, v) => { const c = volCost(v, u); return c < b.c ? { v, c } : b; }, { v: null, c: payg(u) });
  const annual = u => { const n = Math.max(VOL[0][0], paid(u)); return n / 1000 * rateAt(n); };
  const num = n => Math.round(n).toLocaleString('en-US'), k = n => (n >= 1e6 ? n / 1e6 + 'M' : n / 1e3 + 'K');
  const money = n => (n >= 100 || n % 1 === 0 ? '$' + num(n) : '$' + n.toFixed(2)), rate = n => '$' + n.toFixed(2);
  const lg = (v, a, b) => (Math.log10(v) - Math.log10(a)) / (Math.log10(b) - Math.log10(a));

  const OPTS = [{ key: 'theme', label: 'Theme', values: [['light', 'Light'], ['black', 'All black']] }, X().OPT.page];
  const NOTE = 'Copy and prices from iframely-marketing plans/website/12-pricing-volumes.md (D41–D45; D42, the price list itself, is still proposed). Prices computed with the rules in its demo pricing.ts. Plan names Free and Paid are working names.';
  function card(name, title, blurb, build) {
    X().card(name, title, blurb, { group: 'pg', short: name.replace('pg-', ''), init: { theme: 'light', acc2: 'product' }, opts: OPTS, note: NOTE,
      items: st => [{ label: 'pricing · ' + st.theme, dom: s => build(s, K().ink(s)) }] });
  }
  const btn = (I, t, on) => `<span style="height:42px;padding:0 18px;display:inline-flex;align-items:center;font:500 14px ${SANS};${on ? `background:${I.ink};color:${I.bg}` : `box-shadow:inset 0 0 0 1px ${I.rule};color:${I.ink}`}">${t}</span>`;
  const li = (I, t, on = true) => `<div style="display:flex;gap:9px;align-items:flex-start;font:400 14px/1.45 ${SANS};color:${on ? I.body : I.mute}"><span style="flex:none;margin-top:2px">${on ? K().okI(I.acc) : `<span style="display:block;width:14px;height:14px;position:relative"><i style="position:absolute;left:2px;right:2px;top:6px;height:2px;background:${I.line}"></i></span>`}</span><span>${t}</span></div>`;
  const chipRow = (I, items, cur, on) => { const r = H('display:flex;gap:6px;flex-wrap:wrap'); items.forEach(([v, l]) => { const b = document.createElement('button'); b.textContent = l; b.dataset.v = v; b.style.cssText = `height:32px;padding:0 13px;border:0;border-radius:16px;cursor:pointer;font:500 13px ${SANS};box-shadow:inset 0 0 0 1px ${I.line}`; b.onclick = () => on(v); r.appendChild(b); }); r.set = v => [...r.children].forEach(b => { const a = String(v) === b.dataset.v; b.style.background = a ? I.ink : 'transparent'; b.style.color = a ? I.bg : I.ink; }); r.set(cur); return r; };
  const logSlider = (I, a, b, v, on) => { const s = document.createElement('input'); s.type = 'range'; s.min = 0; s.max = 1000; s.value = Math.round(lg(v, a, b) * 1000); s.style.cssText = `width:100%;accent-color:${I.acc}`; s.oninput = () => on(Math.round(Math.pow(10, Math.log10(a) + s.value / 1000 * (Math.log10(b) - Math.log10(a))) / 1000) * 1000); s.setV = x => (s.value = Math.round(lg(x, a, b) * 1000)); return s; };
  /* the V21 price box: the answer is the biggest thing */
  const bigPrice = (I, n, sub, line, sz) => `<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><span style="font:400 ${sz || 84}px/1 ${SANS};letter-spacing:-.04em;color:${I.ink}">${money(n)}</span><span style="font:400 17px ${SANS};color:${I.mute}">${sub}</span></div>${line ? `<div style="font:500 15px ${SANS};color:${I.acc};margin-top:12px">${line}</div>` : ''}`;
  const priceCopy = { title: 'Pricing', intro: 'Usage-based pricing for the Preview API, Rich Media and the Data API. One price list, 2,000 hits a month free on every account.' };
  const RESULTS = 'Errors are never billed, including pages that block us in robots.txt. Choose the embeds, cards or data you need; when a URL doesn’t have them, you can receive an error instead, and that isn’t billed either. Send us every link your users share, with no filtering on your side.';
  const ENTLINE = 'Above 2 million hits a month, contact us. Rates continue down toward $0.50 per 1,000.';

  /* ------------------------------------------------------------ G01 two plans, the paid one with the price box */
  card('pg-plans', 'Pricing: two plans, the paid one is a calculator', 'The new structure as two plans side by side. Free is a fixed card (2,000 hits a month on every account, then pay as you go at $4 per 1,000). Paid is the V21 price box: pick a monthly volume from the table, or switch to annual billing and drag to any volume, and the monthly price, the rate and the year’s total update. Enterprise and “you pay only for results” sit under both.', (s, I) => {
    const { panel, tabs, mix } = K();
    let bill = 'monthly', vol = 5e4;
    const box = H(''), chips = chipRow(I, VOL.map(([v]) => [v, k(v)]), vol, v => { vol = v; slider.setV(v); draw(); }), slider = logSlider(I, 1e4, 2e6, vol, v => { vol = v; draw(); });
    const ctl = H('display:grid;gap:12px;margin:18px 0 26px'), sw = tabs(I, [['monthly', 'Monthly volume'], ['annual', 'Annual billing, any volume']], b => { bill = b; if (b === 'monthly') { vol = VOL.reduce((p, [v]) => (Math.abs(Math.log(v / vol)) < Math.abs(Math.log(p / vol)) ? v : p), 1e4); } draw(); }); sw.set('monthly');
    const draw = () => { const r = bill === 'monthly' ? VOL.find(v => v[0] === vol)[1] : rateAt(vol), m = vol / 1000 * r;
      chips.style.display = bill === 'monthly' ? 'flex' : 'none'; slider.style.display = bill === 'annual' ? 'block' : 'none'; chips.set(vol);
      box.innerHTML = `<div style="font:500 14px ${SANS};color:${I.mute};margin-bottom:8px">${num(vol)} hits a month${bill === 'annual' ? ', any volume' : ''}</div>` + bigPrice(I, m, bill === 'monthly' ? 'a month, prepaid' : 'a month, billed yearly', `${rate(r)} per 1,000 hits · every hit at this rate, including hits above your volume`)
        + `<div style="font:400 14px ${SANS};color:${I.body};margin-top:8px">${bill === 'annual' ? `${money(m * 12)} a year, upfront. Overages monthly at the same rate.` : 'Change the volume at any time; the change is prorated.'}</div>`; };
    const free = H(`${panel(I, 16)}padding:28px;display:flex;flex-direction:column;gap:14px`, `<div style="font:600 13px ${GMONO};color:${I.mute}">FREE</div><div style="font:400 84px/1 ${SANS};letter-spacing:-.04em;color:${I.ink}">$0</div><div style="font:400 17px ${SANS};color:${I.mute};margin-top:-4px">2,000 hits a month, every account</div><div style="display:grid;gap:9px;margin-top:10px">${li(I, 'Then pay as you go: $4 per 1,000 hits, billed at the end of the month for what you used')}${li(I, 'The Preview API, Rich Media and the Data API')}${li(I, 'Cards show the “Powered by” icon')}${li(I, 'One domain')}${li(I, 'Chat support in off-peak hours')}</div><div style="margin-top:auto;padding-top:18px">${btn(I, 'Get an API key', 0)}</div>`);
    const paidC = H(`${panel(I, 16)}padding:28px;box-shadow:inset 0 0 0 2px ${I.acc};position:relative`);
    paidC.append(H(`font:600 13px ${GMONO};color:${I.acc}`, 'PAID · MONTHLY VOLUME'), ctl, box, H('display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:22px', li(I, 'No “Powered by” icon') + li(I, 'Multiple brands') + li(I, '99.9% uptime guarantee') + li(I, 'Chat support') + li(I, 'Content IDs, with annual billing') + li(I, 'Custom parser requests, with annual billing')), H('margin-top:22px', btn(I, 'Subscribe', 1)));
    ctl.append(sw, chips, slider);
    const g = H('display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.3fr);gap:16px;align-items:stretch'); g.append(free, paidC);
    const foot = H(`display:grid;grid-template-columns:1.3fr 1fr;gap:16px;margin-top:16px`, `<div style="padding:18px 20px;border-radius:14px;background:${mix(I.surf, I.acc, I.dark ? .14 : .06)}"><div style="font:600 15px ${SANS};color:${I.ink}">You pay only for results</div><div style="font:400 14px/1.55 ${SANS};color:${I.body};margin-top:6px">${RESULTS}</div></div><div style="padding:18px 20px;border-radius:14px;box-shadow:inset 0 0 0 1px ${I.line}"><div style="font:600 15px ${SANS};color:${I.ink}">Enterprise</div><div style="font:400 14px/1.55 ${SANS};color:${I.body};margin-top:6px">${ENTLINE}</div><div style="font:500 14px ${SANS};color:${I.acc};margin-top:8px">Contact sales →</div></div>`);
    const wrap = H(''); wrap.append(g, foot); draw();
    return B().block(s, I, { eyebrow: '/pricing', h1: true, title: priceCopy.title, paras: [priceCopy.intro] }, { el: wrap, text: 'Free: $0, 2,000 hits a month, then $4 per 1,000.\nPaid: monthly volume ' + VOL.map(([v, r]) => `${num(v)} at ${rate(r)}`).join(', ') + '.\n' + ENTLINE });
  });

  /* ------------------------------------------------------------ G02 which plan: one slider, both plans priced */
  card('pg-which', 'Pricing: one slider, both plans priced', 'One question for the reader (how many hits a month) and both plans priced at once: Free with pay as you go, the cheapest monthly volume, and annual billing at exactly that volume. The cheapest is the big number; the chart shows the three cost lines on a log scale with the crossover where a volume starts to pay off (about 9,500 hits, from the plan’s checks).', (s, I) => {
    const { panel, mix } = K();
    let u = 30000; const out = H(''), chart = H('margin-top:18px');
    const sl = logSlider(I, 500, 3e6, u, v => { u = Math.max(500, v || 500); draw(); });
    const W = 1000, Ht = 260, P = { l: 60, r: 20, t: 16, b: 34 }, X0 = 1e3, X1 = 3e6, YM = 2400;
    const xs = v => P.l + lg(v, X0, X1) * (W - P.l - P.r), ys = c => Ht - P.b - Math.log10(1 + c) / Math.log10(1 + YM) * (Ht - P.t - P.b);
    const line = f => { let d = ''; for (let i = 0; i <= 200; i++) { const v = X0 * Math.pow(X1 / X0, i / 200), c = f(v); if (c == null) continue; d += (d ? ' L' : 'M') + xs(v).toFixed(1) + ' ' + ys(c).toFixed(1); } return d; };
    const draw = () => { const pg = payg(u), b = best(u), an = paid(u) > ENT ? null : annual(u), ent = paid(u) > ENT;
      const opts = [['Free, pay as you go', pg, paid(u) ? `${num(paid(u))} paid hits at $4.00` : 'inside the free 2,000'], ['Monthly volume', b.v ? b.c : volCost(VOL[0], u), b.v ? `${num(b.v[0])} volume at ${rate(b.v[1])}` : `10,000 volume at $3.00`], ['Annual billing', an, an == null ? 'above 2 million: Enterprise' : `exactly ${num(Math.max(1e4, paid(u)))} a month at ${rate(rateAt(Math.max(1e4, paid(u))))}`]];
      const win = ent ? -1 : opts.reduce((w, o, i) => (o[1] != null && o[1] < opts[w][1] - .005 ? i : w), 0);
      out.innerHTML = `<div style="font:500 14px ${SANS};color:${I.mute};margin:22px 0 8px">${num(u)} hits a month</div>` + (ent ? bigPrice(I, 0, '', '').replace('$0', 'Contact us') + `<div style="font:500 15px ${SANS};color:${I.acc};margin-top:12px">${ENTLINE}</div>` : bigPrice(I, opts[win][1], 'a month on ' + opts[win][0].toLowerCase(), opts[win][2]))
        + `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px">${opts.map(([n, c, d], i) => `<div style="${panel(I, 12)}padding:14px 16px;${i === win ? `box-shadow:inset 0 0 0 2px ${I.acc}` : ''}"><div style="display:flex;justify-content:space-between;font:500 13px ${SANS};color:${I.mute}">${n}${i === win ? `<span style="color:${I.acc}">cheapest</span>` : ''}</div><div style="font:500 26px ${SANS};letter-spacing:-.02em;color:${c == null ? I.mute : I.ink};margin-top:6px">${c == null ? '—' : money(c)}</div><div style="font:400 12px ${SANS};color:${I.mute};margin-top:4px">${d}</div></div>`).join('')}</div>`;
      chart.innerHTML = `<svg viewBox="0 0 ${W} ${Ht}" style="width:100%;display:block;font-family:${SANS}">${[1e3, 1e4, 1e5, 1e6].map(v => `<line x1="${xs(v)}" x2="${xs(v)}" y1="${P.t}" y2="${Ht - P.b}" stroke="${I.faint}"/><text x="${xs(v)}" y="${Ht - 12}" text-anchor="middle" font-size="11" fill="${I.mute}">${k(v)}</text>`).join('')}${[0, 10, 100, 1000].map(c => `<text x="${P.l - 8}" y="${ys(c) + 4}" text-anchor="end" font-size="11" fill="${I.mute}">$${num(c)}</text>`).join('')}
        <path d="${line(payg)}" fill="none" stroke="${I.mute}" stroke-width="2" stroke-dasharray="5 4"/><path d="${line(v => best(v).c)}" fill="none" stroke="${I.ink}" stroke-width="2"/><path d="${line(v => (paid(v) > ENT || paid(v) < 1e4 ? null : annual(v)))}" fill="none" stroke="${I.acc}" stroke-width="2.5"/>
        <line x1="${xs(9500)}" x2="${xs(9500)}" y1="${P.t}" y2="${Ht - P.b}" stroke="${I.acc}" stroke-dasharray="2 4"/><text x="${xs(9500) + 6}" y="${P.t + 12}" font-size="11" fill="${I.acc}">a volume pays off from ~9,500</text>
        <line x1="${xs(Math.min(u, X1))}" x2="${xs(Math.min(u, X1))}" y1="${P.t}" y2="${Ht - P.b}" stroke="${I.ink}"/><circle cx="${xs(Math.min(u, X1))}" cy="${ys(ent ? 0 : opts[win][1])}" r="5" fill="${I.acc}"/></svg>
        <div style="display:flex;gap:18px;font:400 12px ${SANS};color:${I.mute};margin-top:6px"><span><i style="display:inline-block;width:18px;border-top:2px dashed ${I.mute};vertical-align:middle"></i> pay as you go</span><span><i style="display:inline-block;width:18px;border-top:2px solid ${I.ink};vertical-align:middle"></i> cheapest monthly volume</span><span><i style="display:inline-block;width:18px;border-top:2.5px solid ${I.acc};vertical-align:middle"></i> annual billing, exact volume</span></div>`; };
    const wrap = H(`${panel(I, 16)}padding:30px 34px`); wrap.append(H(`font:500 13px ${GMONO};color:${I.mute};margin-bottom:10px`, 'How many hits a month?'), sl, out, chart); draw();
    return B().block(s, I, { eyebrow: '/pricing', h1: true, title: priceCopy.title, paras: [priceCopy.intro, 'Pay as you go is cheaper than the 10,000 volume only below 9,500 hits a month.'] }, { el: wrap, text: 'payg vs monthly volume vs annual billing' });
  });

  /* ------------------------------------------------------------ G03 the staircase, with annual between the steps */
  card('pg-staircase', 'Pricing: the volume table as a staircase', 'The monthly volume table drawn as what it is, a rate that steps down as the prepaid volume grows (Free at $0 for the first 2,000, pay as you go at $4.00), with annual billing as the sloped line between the steps. Click a step to pick a monthly volume; drag anywhere to pick an annual volume. The price box follows.', (s, I) => {
    const { panel, mix } = K();
    const W = 1000, Ht = 340, P = { l: 56, r: 44, t: 24, b: 40 }, X0 = 1e3, X1 = 2e6, xs = v => P.l + lg(v, X0, X1) * (W - P.l - P.r), ys = r => Ht - P.b - r / 4.4 * (Ht - P.t - P.b);
    let sel = { kind: 'm', v: 1e5 }; const svgBox = H('position:relative;cursor:crosshair'), out = H('');
    const draw = () => { const r = sel.kind === 'm' ? VOL.find(x => x[0] === sel.v)[1] : rateAt(sel.v), m = sel.v / 1000 * r;
      let g = [0, 1, 2, 3, 4].map(r => `<line x1="${P.l}" x2="${W - P.r}" y1="${ys(r)}" y2="${ys(r)}" stroke="${I.faint}"/><text x="${P.l - 8}" y="${ys(r) + 4}" text-anchor="end" font-size="11" fill="${I.mute}">$${r}.00</text>`).join('');
      g += `<rect x="${xs(X0)}" y="${ys(0) - 3}" width="${xs(FREE) - xs(X0)}" height="6" rx="3" fill="${I.good}"/><text x="${xs(X0) + 4}" y="${ys(0) - 10}" font-size="11" fill="${I.good}">free 2,000</text>`;
      g += `<line x1="${xs(FREE)}" x2="${xs(1e4)}" y1="${ys(4)}" y2="${ys(4)}" stroke="${I.mute}" stroke-width="3" stroke-dasharray="6 4"/><text x="${xs(FREE) + 4}" y="${ys(4) - 8}" font-size="11" fill="${I.mute}">pay as you go $4.00</text>`;
      let an = ''; for (let i = 0; i <= 120; i++) { const v = 1e4 * Math.pow(200, i / 120); an += (i ? ' L' : 'M') + xs(v).toFixed(1) + ' ' + ys(rateAt(v)).toFixed(1); }
      g += `<path d="${an}" fill="none" stroke="${I.acc}" stroke-width="2" stroke-dasharray="1 0" opacity=".55"/>`;
      VOL.forEach(([v, r], i) => { const v2 = VOL[i + 1] ? VOL[i + 1][0] : X1, on = sel.kind === 'm' && sel.v === v; g += `<g data-v="${v}" style="cursor:pointer"><rect x="${xs(v)}" y="${ys(r) - 14}" width="${xs(v2) - xs(v)}" height="28" fill="transparent"/><line x1="${xs(v)}" x2="${xs(v2)}" y1="${ys(r)}" y2="${ys(r)}" stroke="${on ? I.acc : I.ink}" stroke-width="${on ? 5 : 3}"/>${VOL[i + 1] ? `<line x1="${xs(v2)}" x2="${xs(v2)}" y1="${ys(r)}" y2="${ys(VOL[i + 1][1])}" stroke="${I.line}" stroke-width="1.5"/>` : ''}<circle cx="${xs(v)}" cy="${ys(r)}" r="${on ? 6 : 4}" fill="${on ? I.acc : I.ink}"/><text x="${xs(v) + 4}" y="${ys(r) - 9}" font-size="11" font-weight="600" fill="${on ? I.acc : I.ink}">${rate(r)}</text></g>`; });
      [1e3, 1e4, 1e5, 1e6, 2e6].forEach(v => (g += `<text x="${xs(v)}" y="${Ht - 16}" text-anchor="middle" font-size="11" fill="${I.mute}">${k(v)}</text>`));
      if (sel.kind === 'a') g += `<line x1="${xs(sel.v)}" x2="${xs(sel.v)}" y1="${P.t}" y2="${Ht - P.b}" stroke="${I.acc}" stroke-dasharray="3 3"/><circle cx="${xs(sel.v)}" cy="${ys(r)}" r="6" fill="${I.surf}" stroke="${I.acc}" stroke-width="2.5"/>`;
      g += `<text x="${W - P.r}" y="${Ht - 2}" text-anchor="end" font-size="11" fill="${I.mute}">hits a month (log)</text>`;
      svgBox.innerHTML = `<svg viewBox="0 0 ${W} ${Ht}" style="width:100%;display:block;font-family:${SANS}">${g}</svg>`;
      svgBox.querySelectorAll('[data-v]').forEach(n => { n.onclick = e => { e.stopPropagation(); sel = { kind: 'm', v: +n.dataset.v }; draw(); }; });
      out.innerHTML = `<div style="font:500 14px ${SANS};color:${I.mute};margin-bottom:8px">${sel.kind === 'm' ? 'Monthly volume' : 'Annual billing'} · ${num(sel.v)} hits a month</div>` + bigPrice(I, m, sel.kind === 'm' ? 'a month' : `a month · ${money(m * 12)} a year`, `${rate(r)} per 1,000 hits`, 64); };
    let drag = false; const pick = e => { const b = svgBox.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * W; const t = (x - P.l) / (W - P.l - P.r); if (t < lg(1e4, X0, X1) || t > 1) return; sel = { kind: 'a', v: Math.round(Math.pow(10, Math.log10(X0) + t * (Math.log10(X1) - Math.log10(X0))) / 1000) * 1000 }; draw(); };
    svgBox.onpointerdown = e => { if (e.target.closest('[data-v]')) return; drag = true; pick(e); }; svgBox.onpointermove = e => drag && pick(e); svgBox.onpointerup = svgBox.onpointerleave = () => (drag = false);
    const g = H('display:grid;gap:22px'); g.append(svgBox, out); draw();
    const wrap = H(`${panel(I, 16)}padding:26px 30px`); wrap.append(g, H(`font:400 13px ${SANS};color:${I.mute};margin-top:12px`, 'Click a step for a monthly volume. Drag along the line for annual billing: the rate changes evenly between the rows.'));
    return B().block(s, I, { eyebrow: 'Monthly volumes', title: 'The more you prepay, the lower the rate', paras: ['2,000 hits a month are free. For more, subscribe to a monthly volume: the more hits you prepay, the lower the rate per 1,000. Every hit costs that rate, including hits above your volume.'] }, { el: wrap, text: VOL.map(([v, r]) => `${num(v)} hits · ${rate(r)} per 1,000 · ${money(v / 1000 * r)} a month`).join('\n') });
  });

  /* ------------------------------------------------------------ G04 a month on a commitment */
  card('pg-month', 'Pricing: a month on a commitment', 'What “usage commitment” means over one month, drawn as a bar: the free 2,000, the prepaid volume, and your usage running through it. Use less and the rest expires at the end of the month; use more and the extra hits continue at the same rate, billed with the next invoice. Pick a volume and drag the usage.', (s, I) => {
    const { panel, mix } = K();
    let vol = 5e4, use = 62000; const bar = H(''), out = H('');
    const chips = chipRow(I, VOL.slice(0, 6).map(([v]) => [v, k(v)]), vol, v => { vol = v; use = Math.round(v * 1.2); us.max = v * 2.5; us.value = use; draw(); });
    const us = document.createElement('input'); us.type = 'range'; us.min = 0; us.max = vol * 2.5; us.step = 500; us.value = use; us.style.cssText = `width:100%;accent-color:${I.acc}`; us.oninput = () => { use = +us.value; draw(); };
    const draw = () => { const r = VOL.find(x => x[0] === vol)[1], p = paid(use), over = Math.max(0, p - vol), unused = Math.max(0, vol - p), max = Math.max(FREE + vol, use) * 1.08, w = v => v / max * 100;
      const seg = (x, wd, css, lab) => `<div style="position:absolute;left:${x}%;width:${wd}%;top:0;bottom:0;${css}">${lab ? `<span style="position:absolute;left:8px;top:50%;transform:translateY(-50%);font:500 12px ${SANS};white-space:nowrap">${lab}</span>` : ''}</div>`;
      bar.innerHTML = `<div style="position:relative;height:56px;border-radius:10px;overflow:hidden;background:${I.faint}">${seg(0, w(FREE), `background:${mix(I.surf, I.good, .35)};color:${I.ink}`, w(FREE) > 7 ? 'free' : '')}${seg(w(FREE), w(vol), `background:${mix(I.surf, I.acc, .18)};box-shadow:inset 0 0 0 1.5px ${I.acc};color:${I.ink}`, `prepaid ${k(vol)}`)}${seg(0, w(Math.min(use, FREE + vol)), `background:repeating-linear-gradient(90deg, ${I.acc} 0 2px, transparent 2px 6px);opacity:.55`)}${over ? seg(w(FREE + vol), w(over), `background:${I.acc};color:#fff`, `+${num(over)}`) : ''}</div>
        <div style="position:relative;height:34px;margin-top:6px;font:400 12px ${SANS};color:${I.mute}"><span style="position:absolute;left:${w(use)}%;transform:translateX(-50%);white-space:nowrap;color:${I.ink};font-weight:600">▲ ${num(use)} used</span>${unused ? `<span style="position:absolute;right:${100 - w(FREE + vol)}%;top:16px;white-space:nowrap">${num(unused)} unused · expire at the end of the month</span>` : ''}</div>`;
      const pre = vol / 1000 * r, ex = over / 1000 * r;
      out.innerHTML = bigPrice(I, pre + ex, 'this month', `${rate(r)} per 1,000 hits · the same rate above your volume`, 72) + `<div style="display:grid;gap:6px;margin-top:18px;max-width:420px;font:400 14px ${SANS};color:${I.body}">${[['Prepaid volume', money(pre)], ['Hits above your volume', over ? `${num(over)} × ${rate(r)}/1K = ${money(ex)}` : '—'], ['Free hits', '2,000, not billed']].map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:16px;padding:6px 0;box-shadow:inset 0 -1px 0 ${I.faint}"><span>${a}</span><span style="color:${I.ink};font-family:${GMONO};font-size:13px">${b}</span></div>`).join('')}</div>`; };
    const wrap = H(`${panel(I, 16)}padding:28px 32px`), row = H('display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;margin:14px 0 26px');
    row.append(H(`font:500 13px ${GMONO};color:${I.mute}`, 'usage this month'), us);
    wrap.append(H(`font:500 13px ${GMONO};color:${I.mute};margin-bottom:10px`, 'monthly volume'), chips, row, bar, H('height:24px'), out); draw();
    return B().block(s, I, { eyebrow: 'Monthly volumes', title: 'The more you prepay, the lower the rate', paras: ['Volumes are on top of the 2,000 free hits. Hits above your volume cost your volume’s rate; you can change the volume at any time.', 'Unused hits expire at the end of each month.'] }, { el: wrap, text: 'free 2,000 + prepaid volume + hits above it at the same rate' });
  });

  /* ------------------------------------------------------------ G05 what counts as a hit, and what is not billed */
  card('pg-hits', 'Pricing: what counts as a hit, and what is not billed', 'The two hit rules and the “only results” rule as things you can watch: an hour of requests for two URLs on the Preview API collapsing into two hits, five Data API requests staying five hits, and a batch of six URLs where the error, the robots.txt block and the empty result (with “error instead” chosen) fall out of the bill. Feeds a small price line on the Free plan.', (s, I) => {
    const { panel, pill, okI, noI, mix, hs, live } = K();
    const lane = (title, sub, rows, hits) => `<div style="${panel(I, 14)}padding:18px 20px"><div style="font:600 15px ${SANS};color:${I.ink}">${title}</div><div style="font:400 13px/1.5 ${SANS};color:${I.mute};margin:4px 0 14px">${sub}</div>${rows}<div style="display:flex;justify-content:flex-end;margin-top:12px">${pill(I, hits, I.acc, 1)}</div></div>`;
    const hour = (u, n, sd) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:5px"><span style="font:400 12px ${GMONO};color:${I.body};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u}</span><span style="flex:none;font:500 11px ${SANS};color:${I.acc}">${n} requests · 1 hit</span></div><div style="position:relative;height:22px;border-radius:6px;background:${mix(I.surf, I.acc, .1)};box-shadow:inset 0 0 0 1px ${mix(I.surf, I.acc, .4)}">${Array.from({ length: n }, (_, i) => `<i style="position:absolute;left:${4 + hs(i, sd) * 92}%;top:5px;bottom:5px;width:2px;border-radius:1px;background:${I.acc}"></i>`).join('')}</div><div style="display:flex;justify-content:space-between;font:400 10px ${GMONO};color:${I.mute};margin-top:3px"><span>0 min</span><span>one hour</span></div></div>`;
    const reqs = Array.from({ length: 5 }, (_, i) => `<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:4px 0;font:400 12px ${GMONO};color:${I.body}">GET /data?url=…/article-${i + 1}<span style="color:${I.acc};font-family:${SANS};font-weight:600">1 hit</span></div>`).join('');
    const URLS = [['youtube.com/watch?v=dQw4w9WgXcQ', 'player', 1], ['github.com/itteco/iframely', 'card', 1], ['example.com/old-page', 'HTTP 404', 0], ['news-site.com/paywalled', 'blocked in robots.txt', 0], ['blog.example.org/post', 'no player; you chose “error instead”', 0], ['en.wikipedia.org/wiki/OEmbed', 'meta, excerpt', 1]];
    const res = H(`${panel(I, 14)}padding:18px 20px`); let n = 0;
    const draw = () => { res.innerHTML = `<div style="font:600 15px ${SANS};color:${I.ink}">You pay only for results</div><div style="font:400 13px/1.5 ${SANS};color:${I.mute};margin:4px 0 12px">Six links your users shared, sent as they came</div>` + URLS.map(([u, r, ok], i) => `<div style="display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;padding:7px 0;box-shadow:inset 0 -1px 0 ${I.faint};opacity:${i < n ? 1 : .25};transition:opacity .3s"><span>${ok ? okI(I.good) : noI(I.mute)}</span><span style="min-width:0"><span style="display:block;font:400 12px ${GMONO};color:${I.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u}</span><span style="font:400 11px ${SANS};color:${I.mute}">${r}</span></span><span style="font:600 12px ${SANS};color:${ok ? I.acc : I.mute}">${ok ? '1 hit' : 'not billed'}</span></div>`).join('') + `<div style="display:flex;justify-content:flex-end;margin-top:12px">${pill(I, `${URLS.slice(0, n).filter(x => x[2]).length} of ${Math.min(n, 6)} billed`, I.acc, 1)}</div>`; };
    const g = H('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:start', lane('Preview API and Rich Media', 'One hour of activity for one URL. Every API call and every view of a hosted embed for that URL in that hour counts once.', hour('youtube.com/watch?v=…', 12, 1) + hour('github.com/itteco/…', 3, 2), '2 hits this hour') + lane('Data API', 'One request for one URL. It compares directly with services that charge per page or per request.', reqs, '5 hits'));
    g.appendChild(res); n = DEMOS.reduced ? 6 : 0; draw(); live(g, () => { n = n > 9 ? 0 : n + 1; draw(); }, 700);
    return B().block(s, I, { eyebrow: 'What is a hit', title: 'One price list for every product', paras: ['Usage is counted in hits. Both kinds count against the same volume at the same rate.', RESULTS] }, { el: g, text: 'Preview API and Rich Media: one hit per URL-hour.\nData API: one hit per request.\n' + RESULTS });
  });

  /* ------------------------------------------------------------ G06 what changes when you subscribe */
  card('pg-compare', 'Pricing: what changes when you subscribe', 'The feature matrix reduced to the rows that differ between the two plans, with annual-only rows marked, and everything else in one shared base under both columns (“Features included everywhere”). Enterprise is a strip with its own list.', (s, I) => {
    const { panel, pill, mix } = K();
    const R = [['Price', 'Free for 2,000 hits a month, then $4 per 1,000', '$3.00 to $0.70 per 1,000, by volume'], ['Billing', 'Monthly, for what you used', 'Monthly, prepaid; or yearly, upfront. Overages monthly'], ['Unused hits', '—', 'Expire at the end of each month'], ['Domains', 'One domain', 'Multiple brands'], ['“Powered by” icon on cards', 'Shown', 'Removed'], ['Content IDs: embeds that survive cancellation', '—', 'With annual billing'], ['Chat support', 'Off-peak hours', '✓'], ['99.9% uptime guarantee', '—', '✓'], ['Custom parser requests', '—', 'With annual billing']];
    const cell = (t, paidCol) => (t === '✓' ? K().okI(I.acc) : t === '—' ? `<span style="color:${I.mute}">—</span>` : /^With annual/.test(t) ? pill(I, t, I.acc) : `<span style="color:${paidCol ? I.ink : I.body}">${t}</span>`);
    const FEAT = ['1,900+ providers', 'URL metadata', 'the Data API', 'rich media embeds', 'cards and card design', 'hosted iframes', 'click-to-play', 'synchronized playback', 'friendly GIFs', 'user consent before third-party media', 'email support'];
    const el = H('', `<div style="${panel(I, 16)}overflow:hidden"><div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;padding:18px 22px;font:600 15px ${SANS};color:${I.ink};box-shadow:inset 0 -1px 0 ${I.line}"><span></span><span>Free <span style="font-weight:400;color:${I.mute}">· pay as you go</span></span><span style="color:${I.acc}">Paid <span style="font-weight:400;color:${I.mute}">· monthly volume</span></span></div>`
      + R.map(([a, b, c], i) => `<div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;padding:12px 22px;align-items:center;font:400 14px/1.45 ${SANS};${i % 2 ? '' : `background:${I.well}`}"><span style="color:${I.body}">${a}</span><span>${cell(b)}</span><span>${cell(c, 1)}</span></div>`).join('')
      + `<div style="padding:18px 22px;box-shadow:inset 0 1px 0 ${I.line}"><div style="font:500 12px ${GMONO};color:${I.mute};margin-bottom:10px">INCLUDED EVERYWHERE</div><div style="display:flex;flex-wrap:wrap;gap:6px">${FEAT.map(f => `<span style="padding:5px 10px;border-radius:14px;background:${I.faint};font:400 13px ${SANS};color:${I.body}">${f}</span>`).join('')}</div></div></div>`
      + `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;margin-top:14px;padding:18px 22px;border-radius:16px;background:${I.ink};color:${I.bg}"><div style="font:600 16px ${SANS}">Enterprise</div><div style="font:400 13px/1.6 ${SANS};opacity:.85">${['SOC 2 Type II report', 'SLA with credits', 'White-label CDN', 'Data-processing agreement', 'Optional EU residency', 'Data API compliance report', 'Annual commit with true-up', 'Flat or hybrid fee'].join(' · ')}</div><div style="font:500 14px ${SANS};white-space:nowrap">Contact sales →</div></div>`);
    return B().block(s, I, { eyebrow: 'Compare', title: 'Two plans, and what changes when you subscribe', paras: ['Cards, hosted iframes and all interactives are on both plans. A subscription removes the “Powered by” icon and allows multiple brands.'] }, { el, text: R.map(r => r.join(' | ')).join('\n') + '\nIncluded everywhere: ' + FEAT.join(', ') });
  });

  /* ------------------------------------------------------------ G07 what typical setups pay */
  card('pg-setups', 'Pricing: what typical setups pay', 'The demo page’s three worked examples (a chat tool, a newsroom, an AI assistant) as three price boxes, each with the plan that fits, the monthly and annual price, and a small dial to change the setup’s size. Hit counts per setup are the demo’s estimates.', (s, I) => {
    const { panel, mix } = K();
    const EX = [['A chat tool', '20,000 links shared a month, each unfurled several times as people reply.', 40000, 'links shared', 2], ['A newsroom', '3,000 embeds a month in news articles, most read in the first few days.', 90000, 'embeds a month', 30], ['An AI assistant', 'Users paste 50,000 links a month; each is read once through the Data API.', 50000, 'links pasted', 1]];
    const el = H('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px');
    EX.forEach(([t, x, h0, unit, per]) => { const c = H(`${panel(I, 16)}padding:24px;display:flex;flex-direction:column`), out = H('margin-top:auto');
      let units = h0 / per; const sl = logSlider(I, 1e3 / per * 2 > 500 ? 500 : 500, 4e6 / per, units, v => { units = Math.max(100, v); draw(); });
      const draw = () => { const u = Math.round(units * per), b = best(u), an = paid(u) > ENT ? null : annual(u);
        out.innerHTML = `<div style="font:400 13px ${SANS};color:${I.mute};margin:14px 0 6px">${num(units)} ${unit} · about ${num(u)} hits</div>${paid(u) > ENT ? `<div style="font:400 40px ${SANS};letter-spacing:-.03em;color:${I.ink}">Contact us</div>` : bigPrice(I, b.c, 'a month', '', 52)}<div style="font:400 13px/1.5 ${SANS};color:${I.body};margin-top:8px">${b.v ? `${num(b.v[0])} volume at ${rate(b.v[1])}` : u <= FREE ? 'Inside the free 2,000' : 'Free plan, pay as you go'}${an != null && b.v ? `<br><span style="color:${I.acc}">${money(an)} a month on annual billing</span>` : ''}</div>`; };
      c.append(H(`font:600 17px ${SANS};color:${I.ink}`, t), H(`font:400 14px/1.5 ${SANS};color:${I.body};margin:6px 0 16px`, x), sl, out); draw(); el.appendChild(c); });
    return B().block(s, I, { eyebrow: 'Monthly volumes', title: 'What typical setups pay' }, { el, text: EX.map(e => `${e[0]}: ${e[1]} About ${num(e[2])} hits: ${money(best(e[2]).c)} a month.`).join('\n') });
  });

  /* ------------------------------------------------------------ G08 the page and its pricing.md */
  card('pg-md', 'Pricing: the page and its pricing.md, one switch', 'The plan says agents choose vendors from documentation, so the price list ships twice: as the page and as pricing.md. Here they are one block with a switch (For people / For agents): the two plans as cards, or the plan’s draft pricing.md in a code panel, headings lit.', (s, I) => {
    const { panel, tabs, mix } = K();
    const MD = `# Iframely pricing

> Machine-readable copy of https://iframely.com/pricing, which wins if the two differ. Currency: USD.
> Usage-based pricing for the Preview API, Rich Media and the Data API.

## What counts as a hit
Preview API and Rich Media: one hit per URL-hour (all requests and iframe views for a URL within one hour).
Data API: one hit per request.
Both count against the same volume at the same rate.

Not billed:
- Errors, including HTTP errors and robots.txt blocks.
- Results without the content you selected, if you choose to receive an error instead.

## Free
2,000 hits every month, for every account.

## Monthly volumes
Subscribe to a monthly volume and prepay it. Every hit, including hits above the volume, costs
the rate of the volume you chose.

| Monthly volume (hits) | Rate per 1,000 | Monthly price |
|---:|---:|---:|
${VOL.map(([v, r]) => `| ${num(v)} | ${rate(r)} | ${money(v / 1000 * r)} |`).join('\n')}

## Annual billing: any volume
Subscribe for a year to any number of hits a month from 10,000 to 2,000,000, paid upfront. The rate
changes linearly between the rows above.
Example: 75,000 hits a month → $1.75 per 1,000 → $131.25 a month.

## Pay as you go
No subscription: $4.00 per 1,000 hits after the free 2,000, billed monthly for what was used.

## Enterprise
Above 2,000,000 hits a month: contact sales. Indicative rates: about $0.60 per 1,000 at 5,000,000
and $0.50 at 10,000,000, which is the floor.`;
    const view = H('');
    const people = () => `<div style="display:grid;grid-template-columns:1fr 1.3fr;gap:14px"><div style="${panel(I, 16)}padding:24px"><div style="font:600 13px ${GMONO};color:${I.mute}">FREE</div><div style="font:400 64px/1 ${SANS};letter-spacing:-.04em;color:${I.ink};margin-top:12px">$0</div><div style="font:400 15px ${SANS};color:${I.mute};margin-top:8px">2,000 hits a month, then $4 per 1,000</div></div><div style="${panel(I, 16)}padding:24px;box-shadow:inset 0 0 0 2px ${I.acc}"><div style="font:600 13px ${GMONO};color:${I.acc}">PAID · MONTHLY VOLUME</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px">${VOL.map(([v, r]) => `<div><div style="font:500 20px ${SANS};letter-spacing:-.02em;color:${I.ink}">${money(v / 1000 * r)}</div><div style="font:400 12px ${SANS};color:${I.mute}">${k(v)} · ${rate(r)}</div></div>`).join('')}</div></div></div>`;
    const agents = () => `<pre style="margin:0;background:#0d0d0d;color:#cfcfcf;border-radius:14px;padding:22px 26px;font:400 12px/1.65 ${GMONO};white-space:pre-wrap;max-height:520px;overflow:auto">${MD.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/^(#{1,2} .*)$/gm, '<span style="color:#fff;font-weight:600">$1</span>').replace(/^(&gt; .*)$/gm, '<span style="color:#8a8a8a">$1</span>').replace(/^(\|.*)$/gm, '<span style="color:#9ec1ff">$1</span>')}</pre>`;
    const tb = tabs(I, [['people', 'For people'], ['agents', 'For agents · pricing.md']], k2 => { view.innerHTML = k2 === 'people' ? people() : agents(); }); tb.set('people'); view.innerHTML = people();
    const wrap = H(''); wrap.append(tb, H('height:16px'), view);
    return B().block(s, I, { eyebrow: '/pricing.md', title: 'This page is also available as pricing.md', paras: ['For agents and procurement tools: the same tables in Markdown, with the page as the source of truth.'] }, { el: wrap, text: MD });
  });
})();
