/* hero-terminal · B01 base + a terminal window on the right typing the real request and response.
   The field clears a paper pool behind the dark window so it sits on the page rather than in the ink. */
(() => {
  const CSS = `
.ht{position:absolute;inset:0;display:flex;align-items:center}
.ht-win{width:100%;max-height:100%;background:var(--ink);border-radius:12px;padding:14px 16px 16px;color:var(--bg);font:12px/1.7 var(--mono);font-weight:var(--fl-mono-weight,400);overflow:hidden;box-shadow:0 30px 60px -30px rgba(28,27,24,.55)}
.ht-bar{display:flex;gap:6px;align-items:center;margin-bottom:8px;font-size:11px;color:#8a857c}.ht-bar i{width:9px;height:9px;border-radius:50%;display:inline-block}.ht-bar span{margin-left:auto}
.ht-body{white-space:pre}.ht-body div{min-height:1.7em}
.ht .b{color:#7b93ff}.ht .k{color:#bcd3ff}.ht .s{color:#f2d58a}.ht .n{color:#f5b8cc}.ht .d{color:#8a857c}
.ht .cur{display:inline-block;width:7px;height:13px;background:#7b93ff;vertical-align:-2px;animation:blink 1s steps(2) infinite}
@container (max-width:760px){.ht-win{font-size:10px}}`;
  const LINES = [
    [['{']],
    [['  "meta": ', 'k'], ['{ '], ['"title": ', 'k'], ['"Rick Astley – Never Gonna Give You Up"', 's'], [',']],
    [['            '], ['"site": ', 'k'], ['"YouTube"', 's'], [', '], ['"duration": ', 'k'], ['213', 'n'], [' },']],
    [['  "links": ', 'k'], ['{ '], ['"player": ', 'k'], ['[{ '], ['"href": ', 'k'], ['"https://cdn.iframe.ly/abc123"', 's'], [',']],
    [['                         '], ['"rel": ', 'k'], ['["player", "ssl"]', 's'], [' }] },']],
    [['  "rel": ', 'k'], ['["player", "ssl"]', 's']],
    [['}']],
    [['→ 140 ms · cached 24 h · signed', 'd']],
  ];
  DEMOS.register('hero-terminal', {
    group: 'hero', title: 'B01 + terminal window',
    blurb: 'The developer reading of the hero: a curl request types itself and the real JSON answer prints line by line in a dark window on the right. The dither clears a pool of paper behind the window, so the cobalt field frames it instead of fighting it. Loops; hover pauses.',
    mount(host, slot, ctx) {
      const { h } = DEMOS;
      if (!document.getElementById('css-ht')) document.head.appendChild(h('style', { id: 'css-ht' }, CSS));
      const body = h('div', { class: 'ht-body' });
      const win = h('div', { class: 'ht-win' }, h('div', { class: 'ht-bar' }, h('i', { style: 'background:var(--pink)' }), h('i', { style: 'background:var(--sand)' }), h('i', { style: 'background:var(--mint)' }), h('span', null, 'iframely — curl — 80×24')), body);
      slot.appendChild(h('div', { class: 'ht' }, win));
      const D = DEMOS.dither(host, { pointerEl: ctx.root, frame: (t, dt, st) => { const [x, y, w, hh] = DEMOS.rectIn(win, ctx.root); st.attr = [x + w * .5, y + hh * .5]; st.attrR = Math.max(w, hh) * .62; st.attrK = -.7; } });
      if (!D) return () => {};
      const seg = ([s, cls]) => h('span', { class: cls || '' }, s);
      const line = (...kids) => { const el = h('div', null, ...kids); body.appendChild(el); return el; };
      const tl = DEMOS.timeline(DEMOS.hoverPause(slot));
      const CMD = 'curl "https://iframe.ly/api/iframely?url=youtube.com/watch?v=dQw4w9WgXcQ&key=•••"';
      if (DEMOS.reduced) { line(seg(['$ ', 'b']), seg([CMD])); LINES.forEach(L => line(...L.map(seg))); return () => D.destroy(); }
      (async () => {
        while (tl.alive) {
          body.innerHTML = ''; const cmd = line(seg(['$ ', 'b']), h('span'), h('span', { class: 'cur' })); const txt = cmd.children[1];
          await tl.wait(600); for (const ch of CMD) { if (!tl.alive) return; txt.textContent += ch; await tl.sleep(12 + Math.random() * 18); }
          await tl.wait(420); cmd.lastChild.remove();
          for (const L of LINES) { line(...L.map(seg)); await tl.wait(110 + Math.random() * 120); }
          line(seg(['$ ', 'b']), h('span', { class: 'cur' }));
          await tl.wait(4200);
        }
      })();
      return () => { tl.destroy(); D.destroy(); };
    },
  });
})();
