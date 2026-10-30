/* pd-camera · the paper.design approach: a scripted camera (Motion animating x/y/scale on a scene) moves over real DOM:
   a document with a pasted link, the API request, the rendered embed. A collaborator cursor shows where to look. Hover pauses. */
(() => {
  const CSS = `
.cam{position:absolute;inset:0;overflow:hidden;border-radius:12px;background:var(--bg2);border:1px solid var(--line)}
.has-pastel .cam{background:transparent;border:0}
.cam-scene{position:absolute;left:0;top:0;width:1400px;height:900px;transform-origin:0 0}
.cam-doc{position:absolute;left:60px;top:80px;width:540px;height:440px;padding:32px;display:flex;flex-direction:column;gap:14px}
.cam-doc h3{font:400 30px/1.1 var(--serif);margin:0 0 6px;letter-spacing:-.01em}
.cam-link{align-self:flex-start;font:14px var(--mono);color:var(--link);text-decoration:underline;padding:6px 8px;border-radius:6px;transition:background .4s}
.cam-link.hi{background:var(--sky)}
.cam-req{position:absolute;left:700px;top:60px;width:640px;height:330px;background:var(--ink);border-radius:12px;padding:24px;color:var(--bg);font:13px/1.7 var(--mono);font-weight:var(--fl-mono-weight,400);white-space:pre;overflow:hidden}
.cam-req .ln{opacity:0}.cam-req .k{color:#bcd3ff}.cam-req .s{color:#f2d58a}.cam-req .p{color:#7b93ff}.cam-req .d{color:#8a857c}
.cam-embed{position:absolute;left:700px;top:440px;width:640px;height:400px;padding:16px;display:flex;flex-direction:column;gap:12px;opacity:0}
.cam-player{flex:1;background:var(--ink);border-radius:10px;display:grid;place-items:center}
.cam-row{display:flex;align-items:center;gap:10px;font:600 14px var(--sans)}.cam-row .d{font:12px var(--sans);color:var(--ink3);font-weight:400;margin-left:auto}
.cam-cursor{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none}
.cam-cursor svg{position:absolute;left:0;top:0}.cam-cursor span{position:absolute;left:16px;top:16px;padding:3px 8px;border-radius:6px;background:var(--accent);color:#fff;font:500 12px var(--mono);white-space:nowrap}`;
  DEMOS.register('pd-camera', {
    group: 'pd', title: 'Camera over the product',
    copy: { eyebrow: 'For collaboration apps', title: 'Links that become part of the page', text: 'Someone pastes a URL into a doc. Your app asks Iframely once, and the link comes back as a signed embed that renders in place.', cta: 'See it in the docs' },
    blurb: 'How paper.design builds its hero, applied to Iframely: the scene is real DOM (a document, the request in a terminal, the rendered embed) inside a 1400 × 900 canvas, and Motion animates a camera (x, y, scale with the 1000 ms cubic-bezier(.4, 0, 0, 1) that Paper uses) between overview, the pasted link, the request lines typing in and the embed appearing. A named cursor leads the eye. Hover to pause.',
    mount(stage) {
      const { h } = DEMOS; const { animate, stagger } = window.Motion;
      if (!document.getElementById('css-cam')) document.head.appendChild(h('style', { id: 'css-cam' }, CSS));
      const bar = (w, dark) => h('div', { class: 'm-bar' + (dark ? ' dark' : ''), style: 'width:' + w + '%' });
      const link = h('a', { class: 'cam-link', href: '#' }, 'https://youtube.com/watch?v=dQw4w9WgXcQ');
      const doc = h('div', { class: 'cam-doc m-card' }, h('h3', null, 'Launch notes'), bar(92, true), bar(74), bar(84), h('div', { style: 'height:6px' }), link, h('div', { style: 'height:6px' }), bar(88), bar(60));
      const lines = [
        ['$ GET /api/iframely?url=youtube.com/watch?v=dQw4w9WgXcQ', 'p'],
        ['{ "meta": { "title": "Rick Astley – Never Gonna Give You Up" },', 'k'],
        ['  "links": { "player": [{ "href": "cdn.iframe.ly/abc123",', 'k'],
        ['              "rel": ["player", "ssl"] }] },', 'k'],
        ['  "rel": ["player", "ssl"] }', 'k'],
        ['→ 140 ms · cached 24 h · signed', 'd'],
      ].map(([t, cls]) => h('div', { class: 'ln ' + cls }, t));
      const req = h('div', { class: 'cam-req' }, ...lines);
      const play = h('div', { class: 'm-play' });
      const embed = h('div', { class: 'cam-embed m-card' }, h('div', { class: 'cam-player' }, play), h('div', { class: 'cam-row' }, h('span', { class: 'chip pink' }, 'YouTube'), h('span', null, 'Rick Astley – Never Gonna Give You Up'), h('span', { class: 'd' }, '3:33 · signed embed')));
      const cursor = h('div', { class: 'cam-cursor', html: '<svg width="22" height="24" viewBox="0 0 22 24"><path d="M2 2 L2 19 L6.6 14.8 L9.8 22 L13 20.6 L9.9 13.6 L16 13.6 Z" fill="#1c1b18" stroke="#f7f5f0" stroke-width="1.5" stroke-linejoin="round"/></svg><span>iframely</span>' });
      const scene = h('div', { class: 'cam-scene' }, doc, req, embed, cursor);
      const cam = h('div', { class: 'cam' }, scene); stage.appendChild(cam);
      const REG = { all: [0, 0, 1400, 900], doc: [60, 80, 540, 440], req: [700, 60, 640, 330], embed: [700, 440, 640, 400] };
      let cur = 'all';
      const target = name => { const [rx, ry, rw, rh] = REG[name]; const vw = cam.clientWidth || 1, vh = cam.clientHeight || 1; const pad = name === 'all' ? .96 : .86; const s = Math.min(vw / rw, vh / rh) * pad; return { x: (vw - rw * s) / 2 - rx * s, y: (vh - rh * s) / 2 - ry * s, scale: s }; };
      const live = new Set(); const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      const tl = DEMOS.timeline(DEMOS.hoverPause(cam));
      /* Camera moves are fire-and-forget and the timeline waits on its own clock: awaiting a Motion animation that a resize
         re-position interrupts would never resolve and freeze the scene on the overview. */
      const go = (name, d) => { cur = name; const dur = d == null ? 1.1 : d; run(scene, target(name), { duration: dur, ease: [.4, 0, 0, 1] }); return tl.wait(dur * 1000 + 50); };
      const cursorTo = (x, y, d) => run(cursor, { x, y }, { duration: d == null ? .9 : d, ease: [.3, .7, .2, 1] });
      let lastW = cam.clientWidth, lastH = cam.clientHeight;
      const ro = new ResizeObserver(() => { const w = cam.clientWidth, hh = cam.clientHeight; if (Math.abs(w - lastW) < 2 && Math.abs(hh - lastH) < 2) return; lastW = w; lastH = hh; run(scene, target(cur), { duration: 0 }); }); ro.observe(cam);
      animate(scene, target('all'), { duration: 0 }); animate(cursor, { x: 640, y: 520 }, { duration: 0 });
      if (DEMOS.reduced) { link.classList.add('hi'); lines.forEach(l => (l.style.opacity = 1)); embed.style.opacity = 1; return () => ro.disconnect(); }
      (async () => {
        while (tl.alive) {
          await go('all'); await tl.wait(1500);
          cursorTo(230, 300); await tl.wait(500); link.classList.add('hi'); await go('doc'); await tl.wait(2000);
          cursorTo(760, 100); run(lines, { opacity: [0, 1], x: [-8, 0] }, { duration: .35, delay: stagger(.18, { startDelay: .7 }) }); await go('req'); await tl.wait(2600);
          run(embed, { opacity: [0, 1], scale: [.96, 1] }, { duration: .8, delay: .3, ease: 'easeOut' }); cursorTo(1020, 610, 1.4); await go('embed'); await tl.wait(2400);
          await go('all'); await tl.wait(1800);
          link.classList.remove('hi'); run(lines, { opacity: 0 }, { duration: .3 }); run(embed, { opacity: 0 }, { duration: .3 }); cursorTo(640, 520); await tl.wait(500);
        }
      })();
      return () => { tl.destroy(); ro.disconnect(); live.forEach(a => a.stop && a.stop()); };
    },
  });
})();
