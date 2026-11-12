/* bg-teeth · the wave-teeth divider, animated: three rows of S-ramps slide in alternate directions between a cobalt field and pink.
   Teeth within reach of the pointer bulge and warm toward sand. Canvas 2D. */
(() => {
  const tooth = (ctx, kind, x, y, W, H, r) => {
    ctx.beginPath();
    if (kind === 'up') { ctx.moveTo(x, y + H); ctx.bezierCurveTo(x + W * .55, y + H, x + W * .45, y, x + W - r, y); ctx.quadraticCurveTo(x + W, y, x + W, y + r); ctx.lineTo(x + W, y + H); }
    else { ctx.moveTo(x + W, y); ctx.bezierCurveTo(x + W * .45, y, x + W * .55, y + H, x + r, y + H); ctx.quadraticCurveTo(x, y + H, x, y + H - r); ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fill();
  };
  DEMOS.register('bg-teeth', {
    group: 'bg', title: 'Wave teeth', overlay: 'top dark',
    copy: { title: 'Holding the web together since 2012', text: 'Flat two-colour geometry as a living edge between the hero and the next section.' },
    blurb: 'The bold-shape reference in motion: pink islands, a hanging cobalt row and a floating cobalt row scroll at three speeds in opposite directions. Teeth near the pointer grow by half their height and warm toward sand, then settle back. Canvas 2D paths, same geometry as the Figma tile.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host); let hover = 0;
      const L = DEMOS.loop(host, t => {
        const { w, h } = C.resize(); p.smooth(.12); hover += ((p.inside ? 1 : 0) - hover) * .08;
        const k = h / 420; const split = Math.round(h * .54); const TW = 112 * k, PW = 120 * k, TH = 56 * k, r = 12 * k;
        ctx.fillStyle = P.pink; ctx.fillRect(0, 0, w, h); ctx.fillStyle = P.accent; ctx.fillRect(0, 0, w, split);
        const rows = [
          { kind: 'up', base: split, color: P.pink, speed: 18, dir: 1, off: 0 },
          { kind: 'down', base: split, color: P.accent, speed: 13, dir: -1, off: 68 * k },
          { kind: 'down', base: split + TH, color: P.accent, speed: 22, dir: 1, off: 8 * k },
        ];
        for (const R of rows) {
          const scroll = (((t * R.speed * R.dir * k) % PW) + PW) % PW; const n = Math.ceil(w / PW) + 2;
          for (let i = -2; i < n; i++) {
            const x = i * PW + scroll + R.off; const cx = x + TW / 2; const d = (cx - p.sx) / (170 * k); const near = hover * Math.exp(-d * d);
            const H2 = TH * (1 + .55 * near);
            ctx.fillStyle = near > .02 ? DEMOS.mix(R.color, P.sand, Math.min(1, near * 1.2)) : R.color;
            if (R.kind === 'up') tooth(ctx, 'up', x, R.base - H2, TW, H2, r); else tooth(ctx, 'down', x, R.base, TW, H2, r);
          }
        }
      });
      return () => { L.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
