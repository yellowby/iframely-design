/* bg-ridges · ridgelines: thirty stacked horizontal lines, each lifted by noise into a mountain profile on the right,
   front lines occluding the ones behind. The pointer raises a peak under it; every fifth line is cobalt. Canvas 2D. */
(() => {
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); const fx = x - xi, fy = y - yi; const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
  DEMOS.register('bg-ridges', {
    group: 'bg', title: 'Ridgelines', overlay: '',
    blurb: 'Thirty stacked lines, each lifted by noise into a mountain profile on the right half, drawn back to front with paper fills so the near ridges hide the far ones. The profile drifts like weather. The pointer raises a peak under it that spreads to the neighbouring lines; every fifth line is cobalt. Canvas 2D.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host); let hover = 0;
      const L = DEMOS.loop(host, t => {
        const { w, h } = C.resize(); p.smooth(.15); hover += ((p.inside ? 1 : 0) - hover) * .07;
        ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
        const N = Math.ceil(h / 24) + 2, gap = 24, step = 5; const cx = w * .64, cw = w * .3;
        for (let i = 0; i < N; i++) {
          const base = 30 + i * gap; ctx.beginPath(); ctx.moveTo(0, base);
          for (let x = 0; x <= w + step; x += step) {
            const u = (x - cx) / cw; const env = Math.exp(-u * u * 2.0);
            const n = noise(x * .005 + i * .13, t * .22 + i * .37) + .5 * noise(x * .018 + 3.1, i * .71 + t * .35);
            let y = base - Math.max(0, n - .42) * 150 * env;
            if (hover > .01) { const dx = x - p.sx, dy = base - p.sy; y -= hover * 80 * Math.exp(-(dx * dx) / 7200) * Math.exp(-(dy * dy) / 16000); }
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w + step, h + 10); ctx.lineTo(0, h + 10); ctx.closePath();
          ctx.fillStyle = P.bg; ctx.fill();
          ctx.strokeStyle = i % 5 === 2 ? P.accent : 'rgba(28,27,24,.55)'; ctx.lineWidth = i % 5 === 2 ? 1.4 : 1; ctx.stroke();
        }
      });
      return () => { L.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
