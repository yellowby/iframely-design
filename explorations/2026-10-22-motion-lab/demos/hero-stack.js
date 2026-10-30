/* hero-stack · B01 base + the four results as a fanned card stack on the right. The ink pools behind the stack,
   the stack parallaxes with the pointer, the front card cycles (Motion springs), hover brings a card forward. */
(() => {
  const CSS = `
.hs-card{position:absolute;left:0;top:0;width:300px;height:230px;padding:12px;display:flex;flex-direction:column;gap:8px;overflow:hidden;cursor:default;transition:box-shadow .25s,border-color .25s}
.hs-card:hover{border-color:var(--accent);box-shadow:0 20px 40px -20px rgba(31,63,224,.45)}
.hs-card .label{display:flex;justify-content:space-between;white-space:nowrap}
.hs-player{flex:1;min-height:0;border-radius:8px;background:var(--ink);display:grid;place-items:center}
.hs-img{flex:1;min-height:0;border-radius:6px;display:grid;place-items:center;font:11px var(--mono);color:var(--ink2)}
.hs-t{font:600 13px var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hs-d{font:11px var(--sans);color:var(--ink3)}
.hs-json{font:11px/1.6 var(--mono);color:var(--ink2);white-space:pre;overflow:hidden}.hs-json b{color:var(--accent);font-weight:500}
.hs-rule{display:grid;grid-template-columns:auto 1fr;gap:3px 10px;font:11px/1.5 var(--mono)}.hs-rule span:nth-child(odd){color:var(--ink3)}.hs-rule span:nth-child(even){color:var(--accent)}`;
  const POS = [{ x: .17, y: .2, r: -2, s: 1 }, { x: .32, y: .05, r: 4, s: .96 }, { x: .02, y: .38, r: -6, s: .94 }, { x: .36, y: .42, r: 3, s: .9 }];
  DEMOS.register('hero-stack', {
    group: 'hero', title: 'B01 + four results stack',
    blurb: 'The D38 “one URL, four results” idea on the dither: Rich Media, Preview, Data and Publisher Console cards fanned on the right. The field pools its ink behind the stack so the paper cards pop, the whole stack parallaxes with the pointer, the front card cycles on a spring every few seconds, and hovering a card brings it forward.',
    mount(host, slot, ctx) {
      const { h } = DEMOS; const { animate } = window.Motion;
      if (!document.getElementById('css-hs')) document.head.appendChild(h('style', { id: 'css-hs' }, CSS));
      const D = DEMOS.dither(host, { pointerEl: ctx.root, frame: (t, dt, st, env) => {
        const [x, y, w, hh] = DEMOS.rectIn(slot, ctx.root); st.attr = [x + w * .5, y + hh * .52]; st.attrR = Math.max(w, hh) * .42; st.attrK = .6;
        const px = env.p.inside ? env.p.nx - .5 : 0, py = env.p.inside ? env.p.ny - .5 : 0;
        slot.style.transform = 'translate(' + (-px * 14).toFixed(1) + 'px,' + (-py * 10).toFixed(1) + 'px)';
      } });
      if (!D) return () => {};
      const cards = [
        h('div', { class: 'hs-card m-card' }, h('div', { class: 'label' }, h('span', null, 'Rich Media'), h('span', null, 'video')), h('div', { class: 'hs-player' }, h('div', { class: 'm-play' }))),
        h('div', { class: 'hs-card m-card' }, h('div', { class: 'label' }, h('span', null, 'Preview API'), h('span', null, 'card')), h('div', { class: 'hs-img', style: 'background:var(--pink)' }, '1200 × 630'), h('div', { class: 'hs-t' }, 'Rick Astley – Never Gonna Give You Up'), h('div', { class: 'hs-d' }, 'youtube.com · 3:33')),
        h('div', { class: 'hs-card m-card' }, h('div', { class: 'label' }, h('span', null, 'Data API'), h('span', null, 'json')), h('div', { class: 'hs-json', html: '{\n  <b>"type"</b>: "video",\n  <b>"duration"</b>: 213,\n  <b>"author"</b>: "Rick Astley",\n  <b>"site"</b>: "YouTube"\n}' })),
        h('div', { class: 'hs-card m-card' }, h('div', { class: 'label' }, h('span', null, 'Publisher Console'), h('span', null, 'rules')), h('div', { class: 'hs-rule' }, ...[['autoplay', 'off'], ['consent', 'EU only'], ['embeds', 'allowed'], ['cache', '24 h']].flatMap(([k, v]) => [h('span', null, k), h('span', null, v)]))),
      ];
      slot.append(...cards);
      let order = [0, 1, 2, 3]; const live = new Set(); const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      /* the fan lives in a 4:3 box centred in the slot, so tall or wide slots do not spread the cards */
      const place = instant => {
        const W0 = slot.clientWidth, H0 = slot.clientHeight; const W = Math.min(W0, H0 * 4 / 3, 640), H = W * .75; const ox = (W0 - W) / 2, oy = (H0 - H) / 2;
        order.forEach((ci, depth) => { const q = POS[depth], c = cards[ci]; c.style.width = Math.round(W * .62) + 'px'; c.style.height = Math.round(H * .56) + 'px'; c.style.zIndex = 10 - depth; run(c, { x: ox + q.x * W, y: oy + q.y * H, rotate: q.r, scale: q.s }, instant ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 22 }); });
      };
      place(true); const ro = new ResizeObserver(() => place(true)); ro.observe(slot);
      cards.forEach((c, i) => c.addEventListener('pointerenter', () => { if (order[0] !== i) { order = [i, ...order.filter(k => k !== i)]; place(false); } }));
      const tl = DEMOS.timeline(DEMOS.hoverPause(slot));
      if (!DEMOS.reduced) (async () => { await tl.wait(2800); while (tl.alive) { order = [order[1], order[2], order[3], order[0]]; place(false); await tl.wait(3200); } })();
      return () => { tl.destroy(); ro.disconnect(); live.forEach(a => a.stop && a.stop()); D.destroy(); };
    },
  });
})();
