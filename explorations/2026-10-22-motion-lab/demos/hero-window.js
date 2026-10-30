/* hero-window · B01 base + a blueprint browser window on the right whose content area is a cut-out:
   the dither runs at full strength inside the window and dims outside it, as if the field were the thing being rendered. */
(() => {
  const CSS = `
.hw{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.hw-win{position:relative;width:100%;aspect-ratio:16/10;max-height:100%;border:1.5px solid var(--ink);border-radius:10px}
.hw-top{height:34px;border-bottom:1px solid var(--ink);display:flex;align-items:center;gap:6px;padding:0 12px;background:rgba(247,245,240,.78);border-radius:9px 9px 0 0;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.hw-top i{width:9px;height:9px;border-radius:50%;border:1px solid var(--ink)}
.hw-url{margin-left:8px;flex:1;height:18px;border:1px solid rgba(28,27,24,.45);border-radius:9px;font:10px var(--mono);color:var(--ink2);display:flex;align-items:center;padding:0 8px;white-space:nowrap;overflow:hidden}
.hw-content{position:absolute;inset:34px 0 0 0}
.hw-play{position:absolute;left:50%;top:50%;width:68px;height:68px;margin:-34px 0 0 -34px}
.hw-sel{position:absolute;inset:-1px;border:1px solid var(--accent);border-radius:10px;pointer-events:none}
.hw-handle{position:absolute;width:8px;height:8px;background:var(--bg);border:1px solid var(--accent);margin:-4px 0 0 -4px}
.hw-dim{position:absolute;left:50%;bottom:-28px;transform:translateX(-50%);padding:2px 8px;border-radius:4px;background:var(--accent);color:#fff;font:10px var(--mono);white-space:nowrap}
.hw-lab{position:absolute;left:12px;bottom:10px;font:10px var(--mono);color:var(--accent);background:rgba(247,245,240,.7);padding:2px 6px;border-radius:4px}`;
  DEMOS.register('hero-window', {
    group: 'hero', title: 'B01 through a blueprint window',
    blurb: 'The drawing-office treatment from the blueprint tiles: a selected browser window with handles and a dimension pill sits on the right, and its content area is a cut-out in the shader. Inside the window the dither runs at full strength with an outlined play mark over it; outside it fades to a third. The lamp works through the glass. The window is DOM and resizes with the slot.',
    mount(host, slot, ctx) {
      const { h } = DEMOS;
      if (!document.getElementById('css-hw')) document.head.appendChild(h('style', { id: 'css-hw' }, CSS));
      const content = h('div', { class: 'hw-content' }, h('div', { class: 'hw-play', html: '<svg viewBox="0 0 68 68" width="68" height="68"><circle cx="34" cy="34" r="32" fill="rgba(247,245,240,.35)" stroke="#1f3fe0" stroke-width="1.5"/><path d="M27 20 L50 34 L27 48 Z" fill="none" stroke="#1f3fe0" stroke-width="1.5" stroke-linejoin="round"/></svg>' }), h('div', { class: 'hw-lab' }, 'rich media · 16 : 9 · signed src'));
      const dim = h('div', { class: 'hw-dim' });
      const win = h('div', { class: 'hw-win' }, h('div', { class: 'hw-top' }, h('i'), h('i'), h('i'), h('div', { class: 'hw-url' }, 'iframely.com/api/iframely?url=https://youtube.com/watch?v=dQw4w9WgXcQ')), content, h('div', { class: 'hw-sel' }),
        ...[[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]].map(([x, y]) => h('div', { class: 'hw-handle', style: 'left:' + x + '%;top:' + y + '%' })), dim);
      slot.appendChild(h('div', { class: 'hw' }, win));
      const D = DEMOS.dither(host, { pointerEl: ctx.root, frame: (t, dt, st) => { const r = DEMOS.rectIn(content, ctx.root); st.shape = 3; st.shapeMix = 1; st.rect = r; const txt = Math.round(win.clientWidth) + ' × ' + Math.round(win.clientHeight); if (dim.textContent !== txt) dim.textContent = txt; } });
      if (!D) return () => {};
      return () => D.destroy();
    },
  });
})();
