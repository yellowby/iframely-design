/* bg-filings · iron filings: a grid of short ink strokes aligned to a slowly turning noise field. The pointer is a magnet:
   strokes within reach swing into circles around it and turn cobalt, then relax when it leaves. Canvas 2D, ~5,000 strokes. */
(() => {
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); const fx = x - xi, fy = y - yi; const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
  const lerpA = (a, b, k) => { let d = b - a; d = Math.atan2(Math.sin(d), Math.cos(d)); return a + d * k; };
  DEMOS.register('bg-filings', {
    group: 'bg', title: 'Iron filings', overlay: '',
    blurb: 'A 14px grid of short strokes, each aligned to a slowly turning noise field, like iron filings on paper. The pointer is a magnet: within reach the strokes swing into rings around it, brighten to cobalt and lengthen, then settle back into the field when it moves on. Canvas 2D, about five thousand strokes a frame in two paths.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host); let hover = 0;
      const G = 14, L = 9;
      const L2 = DEMOS.loop(host, t => {
        const { w, h } = C.resize(); p.smooth(.18); hover += ((p.inside ? 1 : 0) - hover) * .07;
        ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
        const cols = Math.ceil(w / G) + 1, rows = Math.ceil(h / G) + 1;
        const ink = new Path2D(), cob = new Path2D();
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const x = i * G + G / 2, y = j * G + G / 2;
          let a = noise(x * .0028 + t * .03, y * .0028 + 7.3) * Math.PI * 2 + noise(x * .011, y * .011 - t * .02) * 1.2;
          let k = 0, len = L;
          if (hover > .01) { const dx = x - p.sx, dy = y - p.sy, d = Math.hypot(dx, dy); if (d < 210) { k = Math.pow(1 - d / 210, 1.2) * hover; a = lerpA(a, Math.atan2(dy, dx) + Math.PI / 2, k); len = L + 5 * k; } }
          const cx = Math.cos(a) * len / 2, cy = Math.sin(a) * len / 2; const path = k > .3 ? cob : ink;
          path.moveTo(x - cx, y - cy); path.lineTo(x + cx, y + cy);
        }
        ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(28,27,24,.5)'; ctx.stroke(ink); ctx.strokeStyle = P.accent; ctx.lineWidth = 1.4; ctx.stroke(cob);
      });
      return () => { L2.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
