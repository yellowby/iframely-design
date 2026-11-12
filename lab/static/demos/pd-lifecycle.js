/* pd-lifecycle · the request lifecycle blueprint, animated: a pulse travels URL → fetch → parse → sign → embed,
   timings count up, annotations appear under the active step, result chips land at the end. Hover a step to pin its note. */
(() => {
  const CSS = `
.lc{position:absolute;inset:0;display:flex;flex-direction:column;gap:10px}
.lc-svg{position:relative;flex:1;min-height:0}.lc-svg svg{width:100%;height:100%;display:block}
.lc .box rect{fill:var(--surface);stroke:var(--ink);stroke-width:1.2;transition:fill .35s,stroke .35s}
.lc .box.on rect{fill:var(--sky);stroke:var(--accent)}
.lc .box text{font:13px var(--mono);fill:var(--ink)}
.lc .tm{font:10px var(--mono);fill:var(--accent)}
.lc .ann{font:10px var(--mono);fill:var(--accent);opacity:0;transition:opacity .35s}.lc .ann.on,.lc .ann.pin{opacity:1}
.lc .con{stroke:var(--ink3);stroke-width:1;stroke-dasharray:4 3;transition:stroke .3s}.lc .con.on{stroke:var(--accent)}
.lc .pulse{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(31,63,224,.18);opacity:0}
.lc-chips{display:flex;gap:8px;flex-wrap:wrap;min-height:24px}.lc-chips .chip{opacity:0}`;
  DEMOS.register('pd-lifecycle', {
    group: 'pd', title: 'Request lifecycle',
    copy: { eyebrow: 'For automated systems', title: 'What happens in 140 ms', text: 'Fetch, parse every source the page offers, sign the result and hand back something your product can render. Cached for a day, so the next call is free.', cta: 'Read the API reference' },
    blurb: 'The C4 blueprint tile with a pulse: Motion drives a cobalt dot along the connectors, counts each timing up from the previous one, lights the active box and fades in its sources; the four result chips land with a stagger. Hover a step to pin its annotation. SVG for the drawing, HTML for the dot and chips.',
    mount(stage) {
      const { h } = DEMOS; const { animate, stagger } = window.Motion;
      if (!document.getElementById('css-lc')) document.head.appendChild(h('style', { id: 'css-lc' }, CSS));
      const names = ['URL', 'fetch', 'parse', 'sign', 'embed'], times = [0, 84, 131, 133, 140], notes = ['https://…', 'HTML · oEmbed', 'OG · cards · JSON-LD', 'HMAC key', 'iframe · card'];
      const xs = [20, 145, 270, 395, 520]; let s = '<svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg">';
      s += '<defs><pattern id="lcdots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="1" fill="#1c1b18" fill-opacity=".14"/></pattern></defs><rect width="640" height="330" fill="url(#lcdots)"/>';
      s += '<path d="M40,50H600" stroke="#1f3fe0" stroke-opacity=".5"/>';
      xs.forEach((x, i) => {
        s += '<path d="M' + (x + 50) + ',46V54" stroke="#1f3fe0"/><text class="tm" x="' + (x + 50) + '" y="38" text-anchor="middle">0 ms</text>';
        if (i < 4) s += '<path class="con" data-i="' + i + '" d="M' + (x + 100) + ',158H' + (x + 125) + '"/>';
        s += '<g class="box" data-i="' + i + '"><rect x="' + x + '" y="130" width="100" height="56" rx="8"/><text x="' + (x + 50) + '" y="163" text-anchor="middle">' + names[i] + '</text></g>';
        s += '<text class="ann" data-i="' + i + '" x="' + (x + 50) + '" y="206" text-anchor="middle">' + notes[i] + '</text>';
      });
      s += '<path d="M145,112V104H495V112" stroke="#1f3fe0" fill="none"/><text class="tm" x="320" y="98" text-anchor="middle">cached 24 h</text>';
      s += '<text x="20" y="300" style="font:10px var(--mono);fill:#8a857c;letter-spacing:.3em">REQUEST LIFECYCLE · FIG. 1</text></svg>';
      const svgWrap = h('div', { class: 'lc-svg', html: s });
      const pulse = h('div', { class: 'pulse' }); svgWrap.appendChild(pulse);
      const chips = [['rich media', 'pink'], ['preview', 'sky'], ['data', 'mint'], ['publisher rule', 'sand']].map(([t, c]) => h('span', { class: 'chip ' + c }, t));
      stage.appendChild(h('div', { class: 'lc' }, svgWrap, h('div', { class: 'lc-chips' }, ...chips)));
      const boxes = [...svgWrap.querySelectorAll('.box')], anns = [...svgWrap.querySelectorAll('.ann')], cons = [...svgWrap.querySelectorAll('.con')], tms = [...svgWrap.querySelectorAll('.tm')].slice(0, 5);
      boxes.forEach((b, i) => { b.addEventListener('pointerenter', () => anns[i].classList.add('pin')); b.addEventListener('pointerleave', () => anns[i].classList.remove('pin')); });
      const pct = x => (x / 640 * 100) + '%', pcy = y => (y / 330 * 100) + '%';
      const live = new Set(); const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const reset = () => { boxes.forEach(b => b.classList.remove('on')); anns.forEach(a => a.classList.remove('on')); cons.forEach(c => c.classList.remove('on')); tms.forEach(t => (t.textContent = '0 ms')); chips.forEach(c => (c.style.opacity = 0)); pulse.style.opacity = 0; };
      if (DEMOS.reduced) { boxes.forEach(b => b.classList.add('on')); anns.forEach(a => a.classList.add('on')); cons.forEach(c => c.classList.add('on')); tms.forEach((t, i) => (t.textContent = times[i] + ' ms')); chips.forEach(c => (c.style.opacity = 1)); return () => {}; }
      (async () => {
        while (tl.alive) {
          reset(); await tl.wait(600);
          pulse.style.left = pct(70); pulse.style.top = pcy(158); run(pulse, { opacity: [0, 1] }, { duration: .25 });
          for (let i = 0; i < 5; i++) {
            boxes[i].classList.add('on'); anns[i].classList.add('on');
            if (i > 0) run(times[i - 1], times[i], { duration: .35, onUpdate: v => (tms[i].textContent = Math.round(v) + ' ms') });
            await tl.wait(i === 0 ? 500 : 700);
            if (i < 4) { cons[i].classList.add('on'); await run(pulse, { left: [pct(xs[i] + 100), pct(xs[i + 1])] }, { duration: .4, ease: 'easeInOut' }); pulse.style.left = pct(xs[i + 1] + 50); }
          }
          await run(chips, { opacity: [0, 1], y: [8, 0] }, { duration: .4, delay: stagger(.1), ease: 'easeOut' });
          await tl.wait(2200);
          await run(pulse, { opacity: 0 }, { duration: .3 });
        }
      })();
      return () => { tl.destroy(); live.forEach(a => a.stop && a.stop()); };
    },
  });
})();
