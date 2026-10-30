/* pd-formats · Preview API concept: the same URL as a link row, a card and a rich player. The parts (favicon, title,
   domain, description, image) move between layouts with Motion, FLIP-style. Click the tabs; it cycles by itself until you do. */
(() => {
  const CSS = `
.fm{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px}
.fm-tabs{display:flex;gap:6px;flex:none}
.fm-tab{height:30px;padding:0 12px;border-radius:8px;border:1px solid var(--line);background:var(--surface);font:500 12px var(--sans);color:var(--ink2);cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.fm-tab:hover{border-color:var(--ink3)}.fm-tab.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.fm-stage{position:relative;flex:1;min-height:0}
.fm-el{position:absolute;left:0;top:0;overflow:hidden;will-change:left,top,width,height}
.fm-frame{border-radius:12px}
.fm-fav{border-radius:50%;background:#e62117;display:grid;place-items:center}.fm-fav::after{content:"";border-left:7px solid #fff;border-top:4px solid transparent;border-bottom:4px solid transparent;margin-left:2px}
.fm-title{font:600 14px/1.3 var(--sans);white-space:nowrap;text-overflow:ellipsis}.fm-title.wrap{white-space:normal}
.fm-domain{font:11px var(--sans);color:var(--ink3);white-space:nowrap}
.fm-desc{font:12px/1.5 var(--sans);color:var(--ink2)}
.fm-img{border-radius:8px;background:var(--pink);display:grid;place-items:center}
.fm-dim{position:absolute;right:10px;bottom:8px;font:10px var(--mono);color:var(--accent);pointer-events:none}
@container (max-width:760px){.fm-title{font-size:13px}.fm-desc{font-size:11px}.fm-tab{height:26px;padding:0 10px;font-size:11px}}`;
  DEMOS.register('pd-formats', {
    group: 'pd', title: 'The same URL, three shapes',
    copy: { eyebrow: 'Preview API', title: 'One response, any shape your product needs', text: 'A link row in a sidebar, a card in a feed, a player in a post: the Preview API returns the parts, your layout decides the form.', cta: 'Explore the Preview API' },
    blurb: 'Three layouts of one response. The favicon, title, domain, description and image are the same five elements; switching tabs animates their position, size and opacity with Motion so the eye follows each part into its new place. Cycles automatically until you click a tab.',
    mount(stage) {
      const { h } = DEMOS; const { animate } = window.Motion;
      if (!document.getElementById('css-fm')) document.head.appendChild(h('style', { id: 'css-fm' }, CSS));
      const frame = h('div', { class: 'fm-el fm-frame m-card' }), fav = h('div', { class: 'fm-el fm-fav' }), title = h('div', { class: 'fm-el fm-title' }, 'Rick Astley – Never Gonna Give You Up (Official Video)'), domain = h('div', { class: 'fm-el fm-domain' }, 'youtube.com · 3:33'), desc = h('div', { class: 'fm-el fm-desc' }, 'The official video for “Never Gonna Give You Up” by Rick Astley. Taken from the album Whenever You Need Somebody, 1987.'), img = h('div', { class: 'fm-el fm-img' }, h('div', { class: 'm-play' })), dim = h('div', { class: 'fm-dim' });
      const st = h('div', { class: 'fm-stage' }, frame, img, fav, title, domain, desc, dim);
      const names = ['Link', 'Card', 'Rich']; let mode = 1, touched = false;
      const tabs = names.map((n, i) => h('button', { class: 'fm-tab', onclick: () => { touched = true; set(i); } }, n));
      stage.appendChild(h('div', { class: 'fm' }, h('div', { class: 'fm-tabs' }, ...tabs), st));
      const live = new Set(); const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      function layout(i) {
        const W = st.clientWidth, H = st.clientHeight, cy = H / 2;
        if (i === 0) return { frame: [0, cy - 30, W, 60, 1], fav: [16, cy - 10, 20, 20, 1], title: [48, cy - 19, W - 64, 20, 1], domain: [48, cy + 3, 220, 16, 1], desc: [48, cy + 20, W - 64, 40, 0], img: [W - 56, cy - 22, 40, 44, 0], dim: 'link · 56px' };
        if (i === 1) return { frame: [0, 10, W, H - 20, 1], img: [12, 22, Math.round(W * .36), H - 44, 1], fav: [Math.round(W * .36) + 28, H - 46, 18, 18, 1], title: [Math.round(W * .36) + 28, 30, W - Math.round(W * .36) - 44, 44, 1, true], desc: [Math.round(W * .36) + 28, 82, W - Math.round(W * .36) - 44, 72, 1], domain: [Math.round(W * .36) + 52, H - 45, 220, 16, 1], dim: 'card · 1 : 1 image' };
        return { frame: [0, 0, W, H, 1], img: [12, 12, W - 24, H - 92, 1], title: [12, H - 72, W - 24, 22, 1], fav: [12, H - 40, 18, 18, 1], domain: [36, H - 39, 220, 16, 1], desc: [12, H, W - 24, 40, 0], dim: 'rich · 16 : 9 player' };
      }
      const els = { frame, fav, title, domain, desc, img };
      function apply(i, instant) {
        const L = layout(i); mode = i; tabs.forEach((t, k) => t.classList.toggle('on', k === i)); dim.textContent = L.dim;
        for (const k in els) { const [x, y, w, hh, o, wrap] = L[k]; els[k].classList.toggle('wrap', !!wrap); run(els[k], { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', opacity: o }, { duration: instant ? 0 : .65, ease: [.3, .7, .2, 1] }); }
      }
      const set = i => apply(i, false);
      const ro = new ResizeObserver(() => apply(mode, true)); ro.observe(st);
      apply(1, true);
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      if (!DEMOS.reduced) (async () => { await tl.wait(2400); let i = 2; while (tl.alive && !touched) { set(i % 3); i++; await tl.wait(2800); } })();
      return () => { tl.destroy(); ro.disconnect(); live.forEach(a => a.stop && a.stop()); };
    },
  });
})();
