/* bg-grid · blueprint sheet with rulers. A dashed crosshair sticks to the pointer, a square snaps to the nearest grid
   intersection and leaves a fading trail of registration crosses; idle, the crosshair drifts on its own. Canvas 2D. */
(() => {
  const rr = (ctx, x, y, w, h, r) => { if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; } ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  DEMOS.register('bg-grid', {
    group: 'bg', title: 'Blueprint crosshair', overlay: '',
    copy: { text: 'Grid paper with rulers; the crosshair follows the pointer and snaps to the nearest intersection.' },
    blurb: 'The drawing-office sheet from the blueprint tiles, live: a 24px grid with major lines and numbered rulers, a dashed cobalt crosshair that sticks to the pointer with a coordinate pill, and a snap square that hops between intersections leaving fading registration crosses. Without a pointer it wanders on a slow Lissajous path. Canvas 2D.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host);
      let sx = 0, sy = 0, init = false; const trail = []; const G = 24;
      const L = DEMOS.loop(host, t => {
        const { w, h } = C.resize();
        const tx = p.inside ? p.x : w * (.5 + .36 * Math.sin(t * .37)), ty = p.inside ? p.y : h * (.5 + .3 * Math.cos(t * .29));
        if (!init) { sx = tx; sy = ty; init = true; } sx += (tx - sx) * .14; sy += (ty - sy) * .14;
        ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(28,27,24,.07)'; ctx.beginPath();
        for (let x = G; x < w; x += G) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, h); } for (let y = G; y < h; y += G) { ctx.moveTo(0, y + .5); ctx.lineTo(w, y + .5); } ctx.stroke();
        ctx.strokeStyle = 'rgba(28,27,24,.13)'; ctx.beginPath();
        for (let x = G * 5; x < w; x += G * 5) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, h); } for (let y = G * 5; y < h; y += G * 5) { ctx.moveTo(0, y + .5); ctx.lineTo(w, y + .5); } ctx.stroke();
        ctx.font = DEMOS.font('mono', 10); ctx.fillStyle = P.accent; ctx.strokeStyle = 'rgba(31,63,224,.55)'; ctx.textBaseline = 'top'; ctx.beginPath();
        for (let x = 0; x < w; x += G) { const major = x % (G * 5) === 0; ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, major ? 10 : 5); if (major && x) ctx.fillText(String(x), x + 3, 2); }
        for (let y = 0; y < h; y += G) { const major = y % (G * 5) === 0; ctx.moveTo(0, y + .5); ctx.lineTo(major ? 10 : 5, y + .5); if (major && y) ctx.fillText(String(y), 12, y + 2); }
        ctx.stroke();
        for (const [x, y] of [[w - 20, 20], [20, h - 20], [w - 20, h - 20]]) { ctx.beginPath(); ctx.moveTo(x - 7, y + .5); ctx.lineTo(x + 7, y + .5); ctx.moveTo(x + .5, y - 7); ctx.lineTo(x + .5, y + 7); ctx.stroke(); }
        const gx = Math.round(sx / G) * G, gy = Math.round(sy / G) * G; const last = trail[trail.length - 1];
        if (!last || last.x !== gx || last.y !== gy) { trail.push({ x: gx, y: gy, t }); if (trail.length > 12) trail.shift(); }
        for (const q of trail) { const a = Math.max(0, 1 - (t - q.t) / 1.8); if (a <= 0) continue; ctx.strokeStyle = 'rgba(31,63,224,' + (a * .8).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(q.x - 5, q.y + .5); ctx.lineTo(q.x + 5, q.y + .5); ctx.moveTo(q.x + .5, q.y - 5); ctx.lineTo(q.x + .5, q.y + 5); ctx.stroke(); }
        ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(31,63,224,.7)'; ctx.beginPath(); ctx.moveTo(0, sy + .5); ctx.lineTo(w, sy + .5); ctx.moveTo(sx + .5, 0); ctx.lineTo(sx + .5, h); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = P.accent; ctx.lineWidth = 1.5; ctx.strokeRect(gx - 6, gy - 6, 12, 12); ctx.lineWidth = 1;
        ctx.fillStyle = P.accent; ctx.fillRect(gx - 1, 0, 2, 10); ctx.fillRect(0, gy - 1, 10, 2);
        const label = 'x ' + Math.round(sx) + '  y ' + Math.round(sy) + '  ·  ' + Math.round(gx / G) + ',' + Math.round(gy / G);
        ctx.font = DEMOS.font('mono', 11); const tw = ctx.measureText(label).width + 16;
        let lx = sx + 14, ly = sy - 30; if (lx + tw > w - 8) lx = sx - 14 - tw; if (ly < 8) ly = sy + 14;
        ctx.fillStyle = P.accent; rr(ctx, lx, ly, tw, 20, 5); ctx.fill(); ctx.fillStyle = P.bg; ctx.textBaseline = 'middle'; ctx.fillText(label, lx + 8, ly + 10);
      });
      return () => { L.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
