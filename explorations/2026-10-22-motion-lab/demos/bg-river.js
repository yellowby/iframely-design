/* bg-river · a river of preview cards drifting across the page in three depths: paper cards with pastel image areas,
   players with a play mark, reader cards with text bars. Cards near the pointer slow down and lift. Canvas 2D. */
(() => {
  DEMOS.register('bg-river', {
    group: 'bg', title: 'Card river', overlay: '',
    blurb: 'Thirty-six preview cards drift across the page in three depths at three speeds: paper cards with a pastel image and title bars, dark players with a play mark, reader cards with text lines. Cards within reach of the pointer slow to a crawl, lift with a shadow and take a cobalt edge, so you can look at one. Canvas 2D.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host); let hover = 0;
      let cards = null; const tints = [P.pink, P.sky, P.mint, P.sand, P.lavender, P.peach];
      const init = (w, h) => { cards = []; for (let i = 0; i < 36; i++) { const lane = i % 3; const s = [.72, .86, 1][lane]; cards.push({ x: Math.random() * (w + 400) - 200, y: Math.random() * (h + 200) - 100, s, speed: 14 + lane * 9, kind: i % 5 === 1 ? 'player' : i % 5 === 3 ? 'reader' : 'img', tint: tints[i % tints.length], lift: 0, ph: Math.random() * 6.28 }); } cards.sort((a, b) => a.s - b.s); };
      const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
      const L = DEMOS.loop(host, (t, dt) => {
        const { w, h } = C.resize(); if (!cards) init(w, h); p.smooth(.2); hover += ((p.inside ? 1 : 0) - hover) * .07;
        ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
        for (const c of cards) {
          const cw = 150 * c.s, ch = 104 * c.s;
          const d = hover > .01 ? Math.hypot(c.x + cw / 2 - p.sx, c.y + ch / 2 - p.sy) : 1e9; const near = d < 190 ? (1 - d / 190) * hover : 0;
          c.lift += (near - c.lift) * .12;
          const v = c.speed * (1 - .85 * c.lift); c.x -= v * dt; c.y -= v * .16 * dt + Math.sin(t * .6 + c.ph) * 2 * dt;
          if (c.x < -cw - 40) { c.x = w + 40 + Math.random() * 200; c.y = Math.random() * h; } if (c.y < -ch - 40) c.y = h + 40;
          const sc = 1 + .05 * c.lift; const x = c.x - cw * (sc - 1) / 2, y = c.y - ch * (sc - 1) / 2, W = cw * sc, H = ch * sc; const r = 8 * c.s;
          ctx.fillStyle = 'rgba(28,27,24,' + (.05 + .12 * c.lift).toFixed(3) + ')'; rr(x + 2, y + 4 + 6 * c.lift, W, H, r); ctx.fill();
          ctx.fillStyle = c.kind === 'player' ? P.ink : P.surface; rr(x, y, W, H, r); ctx.fill();
          ctx.strokeStyle = c.lift > .2 ? P.accent : P.line; ctx.lineWidth = 1; ctx.stroke();
          const pad = 8 * c.s;
          if (c.kind === 'img') { ctx.fillStyle = c.tint; rr(x + pad, y + pad, W - 2 * pad, H * .5, 5 * c.s); ctx.fill(); ctx.fillStyle = '#d9d5cc'; rr(x + pad, y + H * .5 + pad * 1.8, (W - 2 * pad) * .8, 7 * c.s, 3); ctx.fill(); ctx.fillStyle = P.bg2; rr(x + pad, y + H * .5 + pad * 3.1, (W - 2 * pad) * .5, 6 * c.s, 3); ctx.fill(); }
          else if (c.kind === 'player') { ctx.fillStyle = P.bg; ctx.beginPath(); ctx.arc(x + W / 2, y + H / 2, 15 * c.s, 0, 6.2832); ctx.fill(); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(x + W / 2 - 4 * c.s, y + H / 2 - 7 * c.s); ctx.lineTo(x + W / 2 + 8 * c.s, y + H / 2); ctx.lineTo(x + W / 2 - 4 * c.s, y + H / 2 + 7 * c.s); ctx.closePath(); ctx.fill(); }
          else { ctx.fillStyle = c.tint; ctx.fillRect(x + pad, y + pad, 3 * c.s, H - 2 * pad); ctx.fillStyle = '#d9d5cc'; rr(x + pad * 2.2, y + pad, (W - pad * 3.2) * .9, 8 * c.s, 3); ctx.fill(); ctx.fillStyle = P.bg2; for (let k = 0; k < 4; k++) { rr(x + pad * 2.2, y + pad * 2.8 + k * 11 * c.s, (W - pad * 3.2) * [.95, .8, .9, .55][k], 5 * c.s, 2); ctx.fill(); } }
        }
      });
      return () => { L.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
