/* hero-paste · B01 base + a live paste box on the right (D38 option 5). Pick a sample or type a URL and press Enter:
   a pulse rings out through the dither from the box, the preview card below re-renders, and the ink pools behind it. */
(() => {
  const CSS = `
.hp{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:12px}
.hp-bar{display:flex;align-items:center;gap:8px;height:48px;padding:0 8px 0 14px;font:13px var(--mono);flex:none}
.hp-bar .proto{color:var(--ink3)}.hp-bar input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:13px var(--mono);color:var(--ink)}
.hp-bar .btn{height:34px;padding:0 12px;font-size:13px}
.hp-chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font:11px var(--mono);color:var(--ink3)}
.hp-chips .chip{cursor:pointer;background:var(--surface);border:1px solid var(--line);transition:background .2s,color .2s}
.hp-chips .chip:hover{border-color:var(--ink3)}.hp-chips .chip.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.hp-res{padding:12px;display:flex;flex-direction:column;gap:8px;flex:none}
.hp-img{height:clamp(90px,24cqw,160px);border-radius:8px;display:grid;place-items:center}
.hp-t{font:600 14px var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hp-d{font:11px var(--sans);color:var(--ink3)}.hp-m{font:11px var(--mono);color:var(--accent)}`;
  const S = [
    { label: 'YouTube', url: 'youtube.com/watch?v=dQw4w9WgXcQ', title: 'Rick Astley – Never Gonna Give You Up', site: 'YouTube', tint: 'var(--pink)', meta: 'rich media · 16 : 9 · signed · 140 ms', play: true },
    { label: 'Notion', url: 'notion.so/Team-wiki-Launch-plan-3f2a9c', title: 'Team wiki · Launch plan', site: 'Notion', tint: 'var(--sky)', meta: 'app embed · responsive · signed · 131 ms' },
    { label: 'NYT', url: 'nytimes.com/2026/10/21/technology/web-glue.html', title: 'The Web Still Needs Glue', site: 'The New York Times', tint: 'var(--sand)', meta: 'reader · 6 min · preview only · 122 ms' },
  ];
  DEMOS.register('hero-paste', {
    group: 'hero', title: 'B01 + live paste box',
    blurb: 'The “check a URL” hero (D38 option 5) on the dither: a paste box with three sample chips and a result card. Choosing a sample or typing a URL and pressing Enter sends a pulse ring through the field from the box and re-renders the card with Motion; the ink pools behind the result. The live version would call the real API with a public key.',
    mount(host, slot, ctx) {
      const { h } = DEMOS; const { animate } = window.Motion;
      if (!document.getElementById('css-hp')) document.head.appendChild(h('style', { id: 'css-hp' }, CSS));
      let touched = false;
      const input = h('input', { value: S[0].url, spellcheck: 'false', 'aria-label': 'URL' }); const go = h('button', { class: 'btn primary' }, 'Check');
      const bar = h('div', { class: 'hp-bar m-card' }, h('span', { class: 'proto' }, 'https://'), input, go);
      const chips = S.map((s, i) => h('span', { class: 'chip', onclick: () => { touched = true; select(i); } }, s.label));
      const img = h('div', { class: 'hp-img' }), tt = h('div', { class: 'hp-t' }), dd = h('div', { class: 'hp-d' }), mm = h('div', { class: 'hp-m' });
      const res = h('div', { class: 'hp-res m-card' }, img, tt, dd, mm);
      slot.appendChild(h('div', { class: 'hp' }, bar, h('div', { class: 'hp-chips' }, 'try:', ...chips), res));
      const D = DEMOS.dither(host, { pointerEl: ctx.root, frame: (t, dt, st) => { const [x, y, w, hh] = DEMOS.rectIn(res, ctx.root); st.attr = [x + w * .5, y + hh * .5]; st.attrR = Math.max(w, hh) * .5; st.attrK = .55; } });
      if (!D) return () => {};
      const live = new Set(); const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      function show(s) {
        const [x, y, w, hh] = DEMOS.rectIn(bar, ctx.root); D.pulse(x + w * .5, y + hh * .5);
        img.style.background = s.tint; img.innerHTML = ''; img.append(s.play ? h('div', { class: 'm-play' }) : h('span', { style: 'font:11px var(--mono);color:var(--ink2)' }, '1200 × 630'));
        tt.textContent = s.title; dd.textContent = s.site + ' · ' + s.url.split('/')[0]; mm.textContent = s.meta;
        run(res, { opacity: [0, 1], y: [12, 0] }, { duration: .5, ease: [.2, .7, .2, 1] });
      }
      function select(i) { chips.forEach((c, k) => c.classList.toggle('on', k === i)); input.value = S[i].url; show(S[i]); }
      function custom() { touched = true; const v = input.value.trim().replace(/^https?:\/\//, ''); if (!v) return; const domain = v.split('/')[0]; chips.forEach(c => c.classList.remove('on')); show({ url: v, title: 'Preview of ' + domain, site: domain, tint: 'var(--lavender)', meta: 'demo build: no live request · the real box calls the API' }); }
      go.addEventListener('click', custom); input.addEventListener('keydown', e => { if (e.key === 'Enter') custom(); });
      select(0);
      const tl = DEMOS.timeline(DEMOS.hoverPause(slot));
      if (!DEMOS.reduced) (async () => { let i = 1; await tl.wait(3800); while (tl.alive && !touched) { select(i++ % S.length); await tl.wait(3800); } })();
      return () => { tl.destroy(); live.forEach(a => a.stop && a.stop()); D.destroy(); };
    },
  });
})();
