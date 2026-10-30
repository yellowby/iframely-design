/* hero-shape · B01 base where the ink on the right periodically resolves into a shape: first a card with a play mark,
   then the chevron mark, then dissolves back into noise. Pure shader, no DOM on the right except a caption. */
(() => {
  const CSS = `.hsh-cap{position:absolute;left:0;right:0;bottom:4%;text-align:center;font:12px var(--mono);color:var(--accent);letter-spacing:.04em;opacity:0;transition:opacity .6s}`;
  DEMOS.register('hero-shape', {
    group: 'hero', title: 'B01 resolving into a card, then the mark',
    blurb: 'Noise becomes structure: every twelve seconds the ink on the right gathers into a card with a play mark, holds, dissolves, then gathers into the Iframely chevrons and dissolves again. Nothing is drawn on top; the shapes are signed-distance fields blended into the same dithered field, so the lamp and the drift keep working through them. A mono caption names what the ink has become.',
    mount(host, slot, ctx) {
      const { h } = DEMOS;
      if (!document.getElementById('css-hsh')) document.head.appendChild(h('style', { id: 'css-hsh' }, CSS));
      const cap = h('div', { class: 'hsh-cap' }); slot.appendChild(cap); let phase = '';
      const ss = x => x * x * (3 - 2 * x);
      const D = DEMOS.dither(host, { pointerEl: ctx.root, frame: (t, dt, st) => {
        const [sx, sy, W, H] = DEMOS.rectIn(slot, ctx.root); const T = DEMOS.reduced ? 4.5 : t % 12;
        const ramp = (a, b) => Math.min(1, Math.max(0, (T - a) / (b - a)));
        let shape = 1, mix = 0, name = '';
        if (T < 2.2) { shape = 1; mix = 0; }
        else if (T < 7) { shape = 1; mix = T < 3.4 ? ss(ramp(2.2, 3.4)) : T < 6 ? 1 : 1 - ss(ramp(6, 7)); name = T >= 3 && T < 6.3 ? 'card' : ''; }
        else if (T < 11.2) { shape = 2; mix = T < 8.2 ? ss(ramp(7, 8.2)) : T < 10.2 ? 1 : 1 - ss(ramp(10.2, 11.2)); name = T >= 7.8 && T < 10.5 ? 'mark' : ''; }
        st.shape = shape; st.shapeMix = mix;
        if (shape === 1) { const w = Math.min(W * .8, 480), hh = w * .62; st.rect = [sx + (W - w) / 2, sy + (H - hh) / 2 - 10, w, hh]; }
        else { const s = Math.min(W, H) * .6; st.rect = [sx + (W - s) / 2, sy + (H - s) / 2 - 10, s, s]; }
        if (name !== phase) { phase = name; cap.textContent = name === 'card' ? 'youtube.com/watch?v=dQw4w9WgXcQ  →  rich media · signed' : name === 'mark' ? 'one API for URLs' : ''; cap.style.opacity = name ? 1 : 0; }
      } });
      if (!D) return () => {};
      return () => D.destroy();
    },
  });
})();
