/* hero-globe · B03 Block shade as the base, with a very large ASCII globe cropped by the hero: the sphere is about 1.6× the
   viewport width with its centre off the bottom-right corner, so its upper-left quadrant fills the right half and turns
   slowly. On the surface, markers carry URLs: each appears with a ping, holds, slides along a great-circle arc to another
   spot, pings again, fades, and returns with the next URL from the pool. The globe is rendered inside the same shader
   (shape mode 4) with the ASCII ramp: lit sphere, noise continents, 20° graticule, bright rim. */
(() => {
  const CSS = `
.hg-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.hm{position:absolute;left:0;top:0;display:flex;align-items:center;gap:9px;transform:translate(-7px,-7px);transition:opacity .4s}
.hm i{width:14px;height:14px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--bg),0 0 0 4.5px var(--accent);flex:none;position:relative}
.hm i::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1.5px solid var(--accent);opacity:0}
.hm.ping i::after{animation:hmping 1s ease-out}
@keyframes hmping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(3);opacity:0}}
.hm span{font:12px var(--mono);color:var(--accent);background:var(--bg);padding:3px 8px;border-radius:4px;white-space:nowrap;border:1px solid rgba(31,63,224,.3)}
.hm.back{opacity:0}
.hg-cap{position:absolute;left:0;right:0;bottom:3%;text-align:center;font:12px var(--mono);color:var(--accent);letter-spacing:.04em;pointer-events:none}`;
  const URLS = ['youtube.com/watch?v=dQw4w9WgXcQ', 'notion.so/Team-wiki-Launch-plan', 'nytimes.com/2026/10/21/technology', 'open.spotify.com/track/4uLU6hMC', 'github.com/iframely/iframely', 'figma.com/file/VmgHd0uy7JfP', 'loom.com/share/9c1e02a4', 'x.com/iframely/status/1842', 'vimeo.com/148751763', 'substack.com/p/holding-the-web', 'tiktok.com/@nasa/video/7301', 'docs.google.com/document/d/1Xz'];
  const SPIN = .08;
  const toVec = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
  const fromVec = v => ({ lat: Math.asin(Math.max(-1, Math.min(1, v[1]))), lon: Math.atan2(v[2], v[0]) });
  const slerp = (A, B, t) => { const a = toVec(A.lat, A.lon), b = toVec(B.lat, B.lon); const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])); const om = Math.acos(d); if (om < 1e-4) return A; const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om); return fromVec([a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2]); };
  const ease = x => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  DEMOS.register('hero-globe', {
    group: 'hero', title: 'B03 blocks + a cropped ASCII globe with travelling URLs',
    blurb: 'B03 as the base and a globe far larger than the hero: its centre sits off the bottom-right corner, so the upper-left quadrant fills the right half and turns once every 80 seconds. The sphere is rendered by the same shader with the ASCII ramp (lit side sparse, continents dense, 20° graticule, bright rim) and the block field clears a thin halo around it. Three markers carry URLs on the surface: each appears with a ping, holds, slides along a great-circle arc to another point, pings, fades and returns with the next URL from a pool of twelve. The lamp works across the globe.',
    mount(host, slot, ctx) {
      const { h } = DEMOS;
      if (!document.getElementById('css-hg')) document.head.appendChild(h('style', { id: 'css-hg' }, CSS));
      const layer = h('div', { class: 'hg-layer' }); ctx.root.appendChild(layer);
      const geo = { cx: 0, cy: 0, R: 1, a: 0, w: 1, hh: 1 };
      const proj = (lat, lon) => { const [rx, ry, rz] = toVec(lat, lon); const ca = Math.cos(geo.a), sa = Math.sin(geo.a); const nx = rx * ca - rz * sa, nz = rx * sa + rz * ca; return { x: geo.cx + nx * geo.R, y: geo.cy - ry * geo.R, z: nz }; };
      const randomVisible = () => { for (let i = 0; i < 80; i++) { const lat = Math.random() * 2.2 - 1.1, lon = Math.random() * Math.PI * 2 - Math.PI; const p = proj(lat, lon); if (p.z > .3 && p.x > geo.w * .52 && p.x < geo.w - 150 && p.y > 60 && p.y < geo.hh - 70) return { lat, lon }; } return fromVec([-.5, .4, .77]); };
      let ui = Math.floor(Math.random() * URLS.length);
      const markers = [0, 1, 2].map(i => { const el = h('div', { class: 'hm back' }, h('i'), h('span')); layer.appendChild(el); return { el, state: 'idle', t0: .6 + i * 2.6, A: null, B: null, pos: null }; });
      const ping = m => { m.el.classList.remove('ping'); void m.el.offsetWidth; m.el.classList.add('ping'); };
      function step(m, t) {
        if (m.state === 'idle') { if (t < m.t0) return; m.A = randomVisible(); m.pos = m.A; m.el.lastChild.textContent = URLS[ui++ % URLS.length]; m.el.classList.remove('back'); ping(m); m.state = 'hold'; m.t0 = t; m.holds = 0; }
        else if (m.state === 'hold') { if (t - m.t0 > 1.7) { if (m.holds >= 1 && Math.random() < .5) { m.state = 'fade'; m.t0 = t; m.el.classList.add('back'); } else { m.B = randomVisible(); m.state = 'move'; m.t0 = t; } } }
        else if (m.state === 'move') { const p = Math.min(1, (t - m.t0) / 2.4); m.pos = slerp(m.A, m.B, ease(p)); if (p >= 1) { m.A = m.B; m.pos = m.A; ping(m); m.state = 'hold'; m.t0 = t; m.holds++; } }
        else if (m.state === 'fade') { if (t - m.t0 > .6) { m.state = 'idle'; m.t0 = t + .8 + Math.random() * 1.2; } }
        if (m.pos) { const p = proj(m.pos.lat, m.pos.lon); m.el.style.left = p.x.toFixed(1) + 'px'; m.el.style.top = p.y.toFixed(1) + 'px'; if (p.z < .08 && m.state !== 'fade' && m.state !== 'idle') m.el.classList.add('back'); }
      }
      const D = DEMOS.dither(host, { pointerEl: ctx.root, glyph: { ramp: ' ░▒▓█ .:+*oO#%@', font: '"JetBrains Mono", "Geist Mono", ui-monospace, Menlo, monospace', cw: 9, ch: 16, size: 15, mode: 2, field: [0, 5], globe: [5, 10] }, frame: (t, dt, st, env) => {
        geo.w = env.w; geo.hh = env.h; geo.R = Math.max(env.w * .8, env.h * 1.15); geo.cx = env.w * 1.15; geo.cy = env.h * .95; geo.a = (DEMOS.reduced ? 0 : t) * SPIN;
        st.shape = 4; st.shapeMix = 1; st.spin = SPIN; st.rect = [geo.cx - geo.R, geo.cy - geo.R, 2 * geo.R, 2 * geo.R];
        for (const m of markers) step(m, DEMOS.reduced ? 2 : t);
      } });
      if (!D) return () => {};
      return () => { layer.remove(); D.destroy(); };
    },
  });
})();
