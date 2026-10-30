/* bg-marquee · the type-as-texture hero, animated. Rows of mono claims scroll in alternate directions,
   fade, and decay into noise and inverted blocks where ink meets paper. The pointer is a reading lamp: words recover near it. Canvas 2D. */
(() => {
  const CLAIMS = ['ONE URL IN', 'FOUR RESULTS OUT', 'OEMBED RESOLVED', 'OPEN GRAPH PARSED', 'TWITTER CARDS READ', 'EMBEDS SIGNED', 'PUBLISHER RULES RESPECTED', 'CACHE WARM', 'WEBHOOKS ON CHANGE', '6.5 BILLION REQUESTS A MONTH', '99.99% UPTIME', 'SOC 2 TYPE II', 'HOLDING THE WEB TOGETHER SINCE 2012', 'PREVIEWS THAT KEEP THEIR SHAPE', 'DATA WHEN YOU NEED IT', 'NO IFRAME LEFT BEHIND'];
  const LINE = CLAIMS.join('  ·  ') + '  ·  '; const N = LINE.length;
  const NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·.:-/';
  const hash = (a, b, c) => { const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return s - Math.floor(s); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  DEMOS.register('bg-marquee', {
    group: 'bg', title: 'Marquee decay', overlay: 'bottom',
    copy: { title: 'Holding the web together since 2012', text: 'Every claim on the site, scrolling as texture until it dissolves into the paper.' },
    blurb: 'The dark-hero reference, live: rows of product claims in the chosen mono face scroll at different speeds, fade, then break into wrong letters and inverted blocks across the ink-to-paper edge. Move the pointer over the noise and the real words recover around it. Canvas 2D, about 2,000 glyphs a frame.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host, { maxDpr: 2 }); const ctx = C.ctx; const p = DEMOS.pointer(host); let hover = 0;
      if (document.fonts && document.fonts.load) document.fonts.load(DEMOS.font('mono', 13)).catch(() => {});
      const fs = 13, rowH = 24, colW = 9.2;
      const L = DEMOS.loop(host, t => {
        const { w, h } = C.resize(); p.smooth(.15); hover += ((p.inside ? 1 : 0) - hover) * .08;
        const split = Math.round(h * .56);
        ctx.fillStyle = P.ink; ctx.fillRect(0, 0, w, split); ctx.fillStyle = P.bg; ctx.fillRect(0, split, w, h - split);
        const g = ctx.createLinearGradient(0, split - 6, 0, split + 64); g.addColorStop(0, P.ink); g.addColorStop(1, 'rgba(28,27,24,0)'); ctx.fillStyle = g; ctx.fillRect(0, split - 6, w, 70);
        ctx.font = DEMOS.font('mono', fs); ctx.textBaseline = 'middle';
        if ('letterSpacing' in ctx) ctx.letterSpacing = (colW - 7.8).toFixed(2) + 'px';
        const rows = Math.ceil(h / rowH) + 1, cols = Math.ceil(w / colW) + 2;
        for (let r = 0; r < rows; r++) {
          const y = 12 + r * rowH; const dir = r % 2 ? 1 : -1; const speed = 10 + ((r * 7) % 17);
          const scroll = t * speed * dir; const shift = Math.floor(scroll / colW); const sub = scroll - shift * colW;
          let alive, noisy, inv, col, alpha;
          const f = clamp((y - (split - 190)) / 190, 0, 1);
          if (y < split) { alive = 1 - .62 * f; noisy = .85 * f; inv = .14 * f; col = P.bg; alpha = .13 + .2 * (1 - y / split) + .45 * f; }
          else { const f2 = clamp((y - split) / 200, 0, 1); alive = .42 * Math.pow(1 - f2, 1.6); noisy = .85; inv = .1; col = P.ink; alpha = .9; }
          if (y < split - 190) {
            ctx.globalAlpha = alpha; ctx.fillStyle = col; const start = ((-shift % N) + N) % N; let s = '';
            for (let c = 0; c < cols; c++) s += LINE[(start + c) % N];
            ctx.fillText(s, -colW + sub, y); continue;
          }
          for (let c = -1; c < cols; c++) {
            const x = c * colW + sub; const ch = LINE[(((c - shift) % N) + N) % N]; if (ch === ' ') continue;
            const dx = x - p.sx, dy = y - p.sy; const rev = hover * Math.exp(-(dx * dx + dy * dy) / 22500);
            const a2 = Math.max(alive, rev * .95), n2 = noisy * (1 - rev), i2 = inv * (1 - rev);
            const tb = Math.floor(t * 3 + hash(r, c, 1) * 3);
            const h1 = hash(r, c, tb), h2 = hash(r + 7, c + 3, tb), h3 = hash(r + 13, c + 5, tb);
            if (h1 > a2) continue;
            const glyph = h2 < n2 ? NOISE[Math.floor(h3 * NOISE.length)] : ch;
            if (h3 < i2) { ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillRect(x - 1, y - 10, colW + 1, 20); ctx.fillStyle = y < split ? P.ink : P.bg; ctx.fillText(glyph, x, y); }
            else { ctx.globalAlpha = Math.min(1, alpha + rev * .5); ctx.fillStyle = col; ctx.fillText(glyph, x, y); }
          }
        }
        ctx.globalAlpha = 1;
      });
      return () => { L.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
