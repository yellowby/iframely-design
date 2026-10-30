/* pd-extract · Data API concept: a scanline sweeps a page wireframe; each field it crosses lights up, is labelled,
   and a copy of its value flies into the JSON on the right (Motion). Hover an element to see its field name. */
(() => {
  const CSS = `
.ex{position:absolute;inset:0;display:grid;grid-template-columns:1.1fr 1fr;gap:12px}
.ex-page{position:relative;overflow:hidden;padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}
.ex-hdr{display:flex;gap:8px;align-items:center;margin-bottom:4px}.ex-hdr .m-bar{width:40px}.ex-hdr .m-bar.dark{width:60px}
.ex-el{position:relative;border-radius:6px;outline:1.5px solid transparent;outline-offset:3px;transition:outline-color .3s,background .3s}
.ex-el.hit,.ex-el:hover{outline-color:var(--accent);background:rgba(216,231,255,.45)}
.ex-lab{position:absolute;right:-3px;top:-14px;padding:1px 6px;border-radius:4px;background:var(--accent);color:#fff;font:10px var(--mono);opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap}
.ex-el.hit .ex-lab,.ex-el:hover .ex-lab{opacity:1}
.ex-h1{font:400 22px/1.1 var(--serif);letter-spacing:-.01em}.ex-by{font:11px var(--sans);color:var(--ink3)}
.ex-img{height:84px;border-radius:6px;background:var(--sand);display:grid;place-items:center;font:10px var(--mono);color:var(--ink2)}
.ex-p{font:12px/1.5 var(--sans);color:var(--ink2)}
.ex-scan{position:absolute;left:0;right:0;top:0;height:2px;background:var(--accent);box-shadow:0 0 12px 2px rgba(31,63,224,.35);opacity:0;pointer-events:none}
.ex-json{padding:14px;font:11px/1.9 var(--mono);color:var(--ink2);white-space:pre;overflow:hidden;min-width:0;background:var(--ink);color:var(--bg);border-radius:12px}
.ex-json .k{color:#bcd3ff}.ex-json .v{color:#8a857c;transition:color .3s}.ex-json .v.on{color:#f2d58a}
.ex-ghost{position:absolute;z-index:3;pointer-events:none;font:12px var(--sans);color:var(--ink);background:var(--sky);padding:2px 6px;border-radius:4px;white-space:nowrap;max-width:60%;overflow:hidden;text-overflow:ellipsis}
@container (max-width:760px){.ex{grid-template-columns:1fr;grid-template-rows:minmax(0,1.1fr) minmax(0,1fr)}.ex-json{font-size:10px;line-height:1.7;padding:10px 12px}.ex-h1{font-size:19px}.ex-img{height:56px}}`;
  DEMOS.register('pd-extract', {
    group: 'pd', title: 'Field extraction',
    copy: { eyebrow: 'Data API', title: 'Structured fields from any page', text: 'Title, author, image, description, date: Iframely reads every source the page offers, reconciles them and returns one clean object.', cta: 'See the Data API' },
    blurb: 'A scanline runs down a page wireframe; as it crosses the headline, byline, image and first paragraph, each gets an outline and a field label, and a copy of its value flies into the JSON panel (Motion animate on a ghost element). Hover any part of the page to see which field it feeds.',
    mount(stage) {
      const { h } = DEMOS; const { animate } = window.Motion;
      if (!document.getElementById('css-ex')) document.head.appendChild(h('style', { id: 'css-ex' }, CSS));
      const fields = [
        { key: 'title', el: h('div', { class: 'ex-el ex-h1' }, 'The Web Still Needs Glue', h('span', { class: 'ex-lab' }, 'og:title')), val: '"The Web Still Needs Glue"' },
        { key: 'author', el: h('div', { class: 'ex-el ex-by' }, 'By Ada Lin · 21 Oct 2026 · Technology', h('span', { class: 'ex-lab' }, 'author · published')), val: '"Ada Lin"', extra: ['published', '"2026-10-21"'] },
        { key: 'image', el: h('div', { class: 'ex-el ex-img' }, '1200 × 630', h('span', { class: 'ex-lab' }, 'og:image')), val: '"…/glue-1200x630.jpg"' },
        { key: 'description', el: h('div', { class: 'ex-el ex-p' }, 'Every product that accepts a link has to decide what to do with it. Most of them decide badly, and the web gets a little worse each time.', h('span', { class: 'ex-lab' }, 'og:description')), val: '"Every product that accepts a link…"' },
      ];
      const page = h('div', { class: 'ex-page m-card' }, h('div', { class: 'ex-hdr' }, h('div', { class: 'm-bar dark' }), h('div', { class: 'm-bar' }), h('div', { class: 'm-bar' })), ...fields.map(f => f.el), h('div', { class: 'm-bar', style: 'width:92%' }), h('div', { class: 'm-bar', style: 'width:70%' }));
      const scan = h('div', { class: 'ex-scan' }); page.appendChild(scan);
      const vals = {}; const keys = ['title', 'author', 'published', 'image', 'description', 'site'];
      const json = h('div', { class: 'ex-json' }, '{\n', ...keys.flatMap((k, i) => { vals[k] = h('span', { class: 'v' }, k === 'site' ? '"nytimes.com"' : '…'); return [h('span', { class: 'k' }, '  "' + k + '"'), ': ', vals[k], i < keys.length - 1 ? ',\n' : '\n']; }), '}');
      vals.site.classList.add('on');
      const root = h('div', { class: 'ex' }, page, json); stage.appendChild(root);
      const live = new Set(); const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const fly = (f) => {
        const rr = root.getBoundingClientRect(), a = f.el.getBoundingClientRect(), b = vals[f.key].getBoundingClientRect();
        const ghost = h('div', { class: 'ex-ghost', style: 'left:' + (a.left - rr.left) + 'px;top:' + (a.top - rr.top) + 'px' }, f.key === 'image' ? '1200 × 630' : f.el.firstChild.textContent); root.appendChild(ghost);
        run(ghost, { x: [0, b.left - a.left], y: [0, b.top - a.top], scale: [1, .75], opacity: [1, .6] }, { duration: .55, ease: [.3, .7, .2, 1] }).then(() => { ghost.remove(); vals[f.key].textContent = f.val; vals[f.key].classList.add('on'); if (f.extra) { vals[f.extra[0]].textContent = f.extra[1]; vals[f.extra[0]].classList.add('on'); } }, () => ghost.remove());
      };
      const reset = () => { fields.forEach(f => f.el.classList.remove('hit')); for (const k of keys) if (k !== 'site') { vals[k].textContent = '…'; vals[k].classList.remove('on'); } };
      if (DEMOS.reduced) { fields.forEach(f => { f.el.classList.add('hit'); vals[f.key].textContent = f.val; vals[f.key].classList.add('on'); if (f.extra) { vals[f.extra[0]].textContent = f.extra[1]; vals[f.extra[0]].classList.add('on'); } }); return () => {}; }
      (async () => {
        while (tl.alive) {
          reset(); await tl.wait(700); scan.style.opacity = 1; const done = new Set();
          await run(0, 1, { duration: 2.8, ease: 'linear', onUpdate: v => { const H = page.clientHeight; scan.style.top = (v * H) + 'px'; for (const f of fields) { if (done.has(f)) continue; const mid = f.el.offsetTop + f.el.offsetHeight / 2; if (v * H >= mid) { done.add(f); f.el.classList.add('hit'); fly(f); } } } });
          scan.style.opacity = 0; await tl.wait(2600);
        }
      })();
      return () => { tl.destroy(); live.forEach(a => a.stop && a.stop()); };
    },
  });
})();
