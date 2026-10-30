/* hero-blocks-url · B03 Block shade as the base. Click anywhere: the field pools into solid blocks on the right, then the
   blocks turn into the letters of a random URL from a pool, and its metadata forms line by line underneath. After a while
   the letters crumble back into shading. The letters sit on the shader's own 9 × 16 character grid, so they read as
   cells of the field rather than text laid on top. */
(() => {
  const CSS = `
.hb-text{position:absolute;inset:0;pointer-events:none;font:15px/16px "JetBrains Mono","Geist Mono",ui-monospace,Menlo,monospace;letter-spacing:0}
.hb-line{position:absolute;display:flex;white-space:pre}
.hb-line span{display:inline-block;width:9px;height:16px;text-align:center;color:var(--accent)}
.hb-line span.on{background:var(--bg)}
.hb-line.meta span.on{color:var(--ink)}
.hb-line.dim span.on{color:var(--ink3)}
.hb-hint{position:absolute;right:16px;bottom:12px;font:11px var(--mono);color:var(--accent);background:rgba(247,245,240,.75);padding:3px 8px;border-radius:4px;transition:opacity .5s;pointer-events:none}`;
  const POOL = [
    { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', meta: ['Rick Astley – Never Gonna Give You Up', 'YouTube · video · 3:33 · 1.6B views', '→ rich media · 16:9 · signed · 140 ms'] },
    { url: 'https://notion.so/Team-wiki-Launch-plan-3f2a9c', meta: ['Team wiki · Launch plan', 'Notion · page · updated 2026-10-21', '→ app embed · responsive · signed · 131 ms'] },
    { url: 'https://nytimes.com/2026/10/21/technology/web-glue.html', meta: ['The Web Still Needs Glue', 'The New York Times · article · 6 min · paywall', '→ reader · preview only · 122 ms'] },
    { url: 'https://open.spotify.com/track/4uLU6hMCSMq3IYdVxeAzKV', meta: ['Flickermood – Forss', 'Spotify · track · 3:52', '→ player · 1:1 · signed · 67 ms'] },
    { url: 'https://github.com/iframely/iframely', meta: ['iframely/iframely', 'GitHub · repository · 1.9k stars · MIT', '→ link · card · 41 ms'] },
    { url: 'https://figma.com/file/VmgHd0uy7JfP/Design-2027', meta: ['Design 2027', 'Figma · file · 6 pages', '→ app embed · live · signed · 98 ms'] },
    { url: 'https://loom.com/share/9c1e02a4b7', meta: ['Onboarding walkthrough', 'Loom · video · 4:10', '→ rich media · 16:9 · 12 ms · cache hit'] },
  ];
  const CW = 9, CH = 16;
  DEMOS.register('hero-blocks-url', {
    group: 'hero', title: 'B03 blocks: a URL materialises on click',
    blurb: 'B03 Block shade as the base. Click anywhere: the field pools into solid blocks on the right, the blocks flip into the letters of a random URL from a pool of seven, and three lines of metadata (title, site and type, what Iframely returns and how fast) form underneath. After a few seconds the letters crumble back into ░ ▒ shading. Letters live on the shader’s own 9 × 16 grid, so they are cells of the field, not text on top. Runs by itself until the first click.',
    mount(host, slot, ctx) {
      const { h } = DEMOS;
      if (!document.getElementById('css-hb')) document.head.appendChild(h('style', { id: 'css-hb' }, CSS));
      const layer = h('div', { class: 'hb-text' }); const hint = h('div', { class: 'hb-hint' }, 'click anywhere for a URL'); ctx.root.append(layer, hint);
      let block = null, k = 0, kk = 0;
      const D = DEMOS.dither(host, { pointerEl: ctx.root, glyph: { ramp: ' ░▒▓█', font: '"JetBrains Mono", "Geist Mono", ui-monospace, Menlo, monospace', cw: CW, ch: CH, size: 15, mode: 2 }, frame: (t, dt, st) => {
        kk += (k - kk) * Math.min(1, dt * 4); if (block) { st.attr = [block.x + block.w / 2, block.y + block.h / 2]; st.attrR = Math.max(block.w, block.h) * .62; } st.attrK = kk;
      } });
      if (!D) return () => {};
      const tl = DEMOS.timeline(); let busy = false, touched = false, last = -1;
      const H = () => ctx.root.clientHeight;
      function mkLine(text, cls, col0, row) { const line = h('div', { class: 'hb-line ' + cls, style: 'left:' + col0 * CW + 'px;top:' + (H() - (row + 1) * CH) + 'px' }); for (const ch of text) line.appendChild(h('span', { 'data-ch': ch }, ch === ' ' ? ' ' : '█')); layer.appendChild(line); return line; }
      async function reveal(line, per) { for (const s of [...line.children]) { if (!tl.alive) return; s.textContent = s.dataset.ch; s.classList.add('on'); await tl.sleep(per); } }
      async function dissolve(line) { for (const s of [...line.children]) { setTimeout(() => { s.classList.remove('on'); s.textContent = '▓'; }, Math.random() * 300); setTimeout(() => { s.textContent = '░'; }, 300 + Math.random() * 300); } await tl.sleep(750); line.remove(); }
      async function show() {
        if (busy || !tl.alive) return; busy = true;
        let i; do { i = Math.floor(Math.random() * POOL.length); } while (i === last); last = i; const item = POOL[i];
        const [sx, sy, sw, sh] = DEMOS.rectIn(slot, ctx.root); const maxCols = Math.max(20, Math.floor((sw - 8) / CW));
        const fit = s => (s.length > maxCols ? s.slice(0, maxCols - 1) + '…' : s);
        const lines = [fit(item.url), '', ...item.meta.map(fit)];
        const width = Math.max(...lines.map(l => l.length)) * CW; const col0 = Math.max(0, Math.floor((sx + (sw - width) / 2) / CW));
        const topY = sy + (sh - lines.length * CH) / 2; const rowTop = Math.floor((H() - topY) / CH) - 1;
        block = { x: col0 * CW - 18, y: H() - (rowTop + 1) * CH - 18, w: width + 36, h: lines.length * CH + 36 }; k = 1.1;
        await tl.sleep(650); if (!tl.alive) return;
        const els = lines.map((txt, j) => (txt ? mkLine(txt, j === 0 ? 'url' : j === lines.length - 1 ? 'meta dim' : 'meta', col0, rowTop - j) : null));
        await reveal(els[0], 22); await tl.sleep(350);
        for (let j = 2; j < els.length; j++) { if (els[j]) reveal(els[j], 9); await tl.sleep(340); }
        await tl.sleep(4200); if (!tl.alive) return;
        k = 0; await Promise.all(els.filter(Boolean).map(dissolve)); block = null; busy = false;
      }
      const onClick = e => { if (e.target.closest('a,button,input')) return; touched = true; hint.style.opacity = 0; if (!busy) show(); };
      ctx.root.addEventListener('click', onClick); ctx.root.style.cursor = 'pointer';
      if (!DEMOS.reduced) (async () => { await tl.sleep(1600); while (tl.alive) { if (!touched && !busy) await show(); await tl.sleep(2400); } })();
      else show();
      return () => { tl.destroy(); ctx.root.removeEventListener('click', onClick); layer.remove(); hint.remove(); ctx.root.style.cursor = ''; D.destroy(); };
    },
  });
})();
