/* logo-hero-relay (L21) · adapts the usehallmark.com "cobalt" hero (raw webhooks stream into a gate and leave as typed events)
   to Iframely: raw URLs stream in from the left with an ASCII density trail, pass through a gate drawn as the two slashes of
   the mark, and leave on the right as what Iframely made of them (player, meta, og:image, fulltext.md, entities, a blocked
   read). Canvas 2D for the field; the copy, curl box and legend are DOM. Uses DEMOS.logoKit (demos/logo.js). */
(() => {
  const K = DEMOS.logoKit, JB = K.JB;
  const CSS = `
.hx{position:absolute;inset:0;background:#f8fafd}
.hx canvas.fill{position:absolute;inset:0}
.hx-t{position:absolute;left:clamp(16px,6cqw,90px);top:50%;transform:translateY(-52%);width:min(46%,560px);display:flex;flex-direction:column;gap:clamp(12px,1.8cqw,22px);z-index:2}
.hx-t h1{margin:0;font:700 clamp(30px,5.4cqw,76px)/.98 var(--sans);letter-spacing:-.045em;color:#0d1321;text-wrap:balance}
.hx-t p{margin:0;font:400 clamp(14px,1.55cqw,21px)/1.45 var(--sans);color:#3b4252;max-width:30ch}
.hx-btns{display:flex;gap:10px;flex-wrap:wrap}
.hx-btns a{height:clamp(38px,3.6cqw,48px);padding:0 clamp(14px,1.6cqw,20px);border-radius:8px;display:inline-flex;align-items:center;font:500 clamp(13px,1.3cqw,16px) var(--sans);text-decoration:none;border:1px solid #d7dce5;background:#fff;color:#0d1321;box-shadow:0 2px 0 #d7dce5}
.hx-btns a.p{background:var(--logo);border-color:#0045d0;color:#fff;box-shadow:0 2px 0 #0039ad}
.hx-curl{display:flex;align-items:stretch;border:1px solid #d7dce5;border-radius:6px;background:#fff;overflow:hidden;max-width:100%}
.hx-curl code{flex:1;min-width:0;padding:10px 14px;font:400 clamp(11px,1.15cqw,14px)/1.4 ${JB};color:#1f2633;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hx-curl code .d{color:#8a93a3}.hx-curl code .sl{color:var(--logo);font-weight:800}
.hx-curl button{border:0;border-left:1px solid #d7dce5;background:#f3f5f9;padding:0 16px;font:500 13px var(--sans);color:#1f2633;cursor:pointer}
.hx-terms{font:400 13px var(--sans);color:#5b6475}
.hx-lg{position:absolute;right:clamp(12px,3cqw,40px);bottom:clamp(10px,2.4cqw,28px);display:flex;gap:clamp(10px,1.8cqw,22px);align-items:center;padding:8px 14px;border:1px solid #e1e5ec;border-radius:8px;background:rgba(255,255,255,.85);font:400 12px var(--sans);color:#1f2633;z-index:2}
.hx-lg code{font:500 12px ${JB};margin-right:6px}.hx-lg .raw{color:#8a93a3}.hx-lg .raw b{color:var(--logo)}.hx-lg .ok{color:var(--logo)}.hx-lg .no{color:#8a93a3}
@container (max-width:760px){.hx-t{width:auto;right:16px;top:auto;bottom:70px;transform:none}.hx-t p,.hx-curl,.hx-terms{display:none}.hx-lg{display:none}}
`;
  const ITEMS = [
    ['youtube.com/watch?v=dQw4w9WgXcQ', ['player', ' · 16:9 · signed'], 0],
    ['nytimes.com/2026/10/21/technology/web-glue', ['fulltext.md', ' · 1,240 words'], 0],
    ['open.spotify.com/track/4uLU6hMC', ['og:audio', ' · 152×80'], 0],
    ['github.com/itteco/iframely', ['meta', ' · title, author, icon'], 0],
    ['example.com/members/only/story', ['403', ' ┄┄ publisher rule'], 1],
    ['figma.com/design/VmgHd0uy7JfP', ['og:image', ' · 1200×630'], 0],
    ['maps.google.com/?q=50.4501,30.5234', ['map', ' · 4:3 · interactive'], 0],
    ['x.com/iframely/status/1849213', ['entities', ' · Person, SocialMediaPosting'], 0],
    ['bonobo.net/kerala', ['card', ' · summary, light'], 0],
  ];
  const RAMP = ' .:-=+*#%@', TAIL = '=-:.', NOISE = 'abcdefghijklmnopqrstuvwxyz0123456789:/?=&.';
  const INK = '#1f2633', DIM = '#8a93a3', BLUE = '#0055ff', LANE = '#9fb4dc';
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const vnoise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };

  DEMOS.register('logo-hero-relay', {
    group: 'logo', title: 'Hero: URLs in, results out (after Hallmark "cobalt")',
    blurb: 'Adapts the usehallmark.com cobalt hero. Raw URLs stream in from the left with an ASCII density trail (their own // in blue), squeeze into a gate drawn as the two slashes of the mark, and leave on the right as what Iframely made of them: a player, meta, og:image, fulltext.md, entities; a members-only story stops at the gate on a publisher rule. Copy, curl box and legend are DOM.',
    mount(stage) {
      K.ensureCss(); if (!document.getElementById('css-logo4')) document.head.appendChild(DEMOS.h('style', { id: 'css-logo4' }, CSS));
      const { h } = DEMOS;
      const wrap = h('div', { class: 'hx' }); stage.appendChild(wrap);
      const cv = DEMOS.canvas2d(wrap); const ctx = cv.ctx;
      const curl = 'curl "https://iframe.ly/api/iframely?url=https://youtu.be/dQw4w9WgXcQ"';
      const copy = h('button', { type: 'button' }, 'Copy');
      copy.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(curl) : Promise.reject()).then(() => { copy.textContent = 'Copied'; }, () => {}); setTimeout(() => { copy.textContent = 'Copy'; }, 1400); });
      const text = h('div', { class: 'hx-t' },
        h('h1', null, 'Links in, embeds and data out.'),
        h('p', null, 'Iframely reads every URL your users paste and returns a player, a preview, metadata or the full text.'),
        h('div', { class: 'hx-btns' }, h('a', { class: 'p', href: '#' }, 'Get an API key'), h('a', { href: '#' }, 'Check a URL')),
        h('div', { class: 'hx-curl' }, h('code', null, h('span', { class: 'd' }, '$ '), 'curl "https:', h('span', { class: 'sl' }, '//'), 'iframe.ly/api/iframely?url=https:', h('span', { class: 'sl' }, '//'), 'youtu.be/dQw4w9WgXcQ"'), copy),
        h('div', { class: 'hx-terms' }, 'Free to start. Pay per thousand reads after that.'));
      const legend = h('div', { class: 'hx-lg' }, h('span', null, h('code', { class: 'raw' }, 'https:', h('b', null, '//'), '…'), 'Raw URL'), h('span', null, h('code', { class: 'ok' }, 'meta'), 'Processed'), h('span', null, h('code', { class: 'no' }, '403 ┄┄'), 'Blocked by a rule'));
      wrap.append(text, legend);

      let G = null, staticLayer = null, queue = 0;
      const lanes = [];
      const FONT = '400 13px ' + JB, FONTB = '700 13px ' + JB;
      function layout() {
        const { w, h: H, dpr } = cv.resize();
        ctx.font = FONT; const cw = ctx.measureText('0').width;
        const narrow = w < 760, n = narrow ? 4 : 6;
        const top = H * (narrow ? .14 : .3), bot = H * (narrow ? .52 : .76), gap = (bot - top) / (n - 1);
        const GX = w * (narrow ? .5 : .6), tan = Math.tan(20 * Math.PI / 180), yMid = (top + bot) / 2, sgap = 16;
        const g1 = y => GX + (yMid - y) * tan, g2 = y => g1(y) + sgap;
        const textRight = narrow ? 0 : text.getBoundingClientRect().right - wrap.getBoundingClientRect().left;
        G = { w, H, dpr, cw, n, top, bot, gap, g1, g2, tan, textRight, labelX: y => g2(y) + (w - g2(y)) * (narrow ? .18 : .26) };
        while (lanes.length < n) lanes.push({ pk: null, label: null, next: performance.now() + lanes.length * 700 + Math.random() * 900 });
        lanes.length = n; lanes.forEach((L, i) => { L.y = top + i * gap; });
        /* static layer: faint density field on the left, dotted lanes on the right, the // gate with ticks, headers */
        staticLayer = document.createElement('canvas'); staticLayer.width = Math.round(w * dpr); staticLayer.height = Math.round(H * dpr);
        const s = staticLayer.getContext('2d'); s.setTransform(dpr, 0, 0, dpr, 0, 0); s.font = FONT; s.textBaseline = 'middle';
        const ch = 25;
        for (let y = ch / 2; y < H; y += ch) for (let x = 0; x < G.g1(y) - cw * 2; x += cw) {
          const v = vnoise(x / 160, y / 90) * .8 + vnoise(x / 40, y / 30) * .2; if (v < .5) continue;
          const k = Math.min(RAMP.length - 1, Math.floor((v - .5) * 2 * 7)); s.fillStyle = 'rgba(120,140,180,' + (.1 + (v - .5) * .5).toFixed(3) + ')'; s.fillText(RAMP[k], x, y);
        }
        for (const L of lanes) {
          const x0 = g2(L.y) + cw; for (let x = x0, i = 0; x < w - cw; x += cw, i++) { const v = vnoise(i / 9, L.y / 50); s.fillStyle = v > .62 ? 'rgba(80,110,190,.55)' : 'rgba(140,160,205,.35)'; s.fillText(v > .62 ? '⁞' : ':', x, L.y); }
        }
        s.strokeStyle = BLUE; s.lineWidth = 1.4; s.setLineDash([3, 3]);
        const yt = top - gap * .7, yb = bot + gap * .7;
        for (const g of [g1, g2]) { s.beginPath(); s.moveTo(g(yt), yt); s.lineTo(g(yb), yb); s.stroke(); }
        s.setLineDash([]); s.fillStyle = BLUE;
        for (const L of lanes) for (const g of [g1, g2]) { const x = g(L.y); s.fillRect(x - 4, L.y - .7, 8, 1.4); s.fillRect(x - .7, L.y - 4, 1.4, 8); }
        s.font = '800 15px ' + JB; s.textBaseline = 'alphabetic'; s.textAlign = 'center';
        const lx = g1(yt) + sgap / 2; s.fillStyle = BLUE; const wSl = s.measureText('//').width; s.font = '700 15px ' + JB; const wW = s.measureText('iframely').width;
        s.textAlign = 'left'; s.font = '800 15px ' + JB; s.fillText('//', lx - (wSl + wW) / 2, yt - 14); s.font = '700 15px ' + JB; s.fillStyle = INK; s.fillText('iframely', lx - (wSl + wW) / 2 + wSl, yt - 14);
        if (!narrow) { s.font = FONT; s.textAlign = 'right'; s.fillStyle = INK; s.fillText('your product →', w - cw * 2, yt - 14); }
      }
      const spawn = (L, now) => { const [u, out, blocked] = ITEMS[queue++ % ITEMS.length]; const url = 'https://' + u; L.pk = { url, out, blocked, x: Math.max(cw0(), G.textRight * .35) + url.length * G.cw * .2, v: 95 + Math.random() * 55 }; };
      const cw0 = () => G ? G.cw * 4 : 40;
      const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      let ro = new ResizeObserver(() => layout()); ro.observe(wrap);
      layout();
      const draw = (t, dt) => {
        if (!G) return; const now = performance.now();
        const { w, H, cw } = G; const { dpr } = cv.resize(); if (Math.round(w * dpr) !== staticLayer.width) layout();
        ctx.clearRect(0, 0, w, H); ctx.drawImage(staticLayer, 0, 0, w, H);
        ctx.textBaseline = 'middle';
        for (const L of lanes) {
          const y = L.y, g1 = G.g1(y), g2 = G.g2(y), lx = G.labelX(y);
          if (!L.pk && now > L.next) spawn(L, now);
          const P = L.pk;
          if (P) {
            P.x += P.v * (DEMOS.reduced ? 0 : dt);
            const n = P.url.length, x0 = P.x - (n - 1) * cw;
            const fade = x => .14 + .86 * smooth(G.textRight * .6, g1 - cw * 10, x);
            for (let k = 1; k <= 22; k++) { const x = x0 - k * cw; if (x > g1 - cw || x < 0) continue; ctx.font = FONT; ctx.fillStyle = 'rgba(90,120,190,' + ((1 - k / 22) * .55 * fade(x)).toFixed(3) + ')'; ctx.fillText(TAIL[Math.min(3, Math.floor(k / 6))], x, y); }
            for (let i = 0; i < n; i++) {
              const x = x0 + i * cw; if (x < -cw) continue; const c = P.url[i], sl = c === '/' && (P.url[i + 1] === '/' || P.url[i - 1] === '/') && i < 9;
              if (x < g1 - cw * 5) { ctx.font = sl ? FONTB : FONT; ctx.fillStyle = sl ? BLUE : INK; ctx.globalAlpha = fade(x); ctx.fillText(c, x, y); ctx.globalAlpha = 1; }
              else if (x < g2) { const d = Math.max(0, Math.min(1, (x - (g1 - cw * 5)) / (g2 - g1 + cw * 5))); ctx.font = FONTB; ctx.fillStyle = BLUE; ctx.fillText('%#@@'[Math.min(3, Math.floor(d * 4))] , x, y); }
              else if (P.blocked) { if (x < g2 + cw * 4) { ctx.font = FONT; ctx.fillStyle = DIM; ctx.fillText('┄', x, y); } }
              else if (x < lx - cw * 7) { ctx.font = FONTB; ctx.fillStyle = BLUE; ctx.fillText(':', x, y); }
            }
            const reach = P.blocked ? g2 + cw * 4 : lx - cw * 7;
            if (P.x > reach && (!L.label || L.label.pk !== P)) L.label = { pk: P, out: P.out, blocked: P.blocked, t0: now, die: Infinity };
            if (x0 > reach) { L.pk = null; L.next = now + 900 + Math.random() * 1600; if (L.label) L.label.die = now + 2600; }
          }
          const Lb = L.label;
          if (Lb) {
            if (L.pk && L.pk !== Lb.pk && Lb.die > now + 300) Lb.die = now + 300;
            if (now > Lb.die) { L.label = null; continue; }
            const age = now - Lb.t0, a = 1 - smooth(Lb.die - 500, Lb.die, now);
            ctx.globalAlpha = Math.max(0, a);
            const x = Lb.blocked ? g2 + cw * 5 : lx;
            if (!Lb.blocked) { ctx.strokeStyle = BLUE; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(lx - cw * 6.5, y); ctx.lineTo(lx - cw * .8, y); ctx.stroke(); }
            const [k1, k2] = Lb.out; const full = k1 + k2 + (Lb.blocked ? '' : '  ✓'); const res = Math.min(1, age / 380);
            let s = ''; for (let i = 0; i < full.length; i++) s += i < full.length * res ? full[i] : (full[i] === ' ' ? ' ' : NOISE[Math.floor(Math.random() * NOISE.length)]);
            ctx.fillStyle = '#f8fafd'; ctx.fillRect(x - 4, y - 11, s.length * cw + 8, 22);
            ctx.font = FONTB; ctx.fillStyle = Lb.blocked ? DIM : BLUE; ctx.fillText(s.slice(0, k1.length), x, y);
            ctx.font = FONT; ctx.fillStyle = Lb.blocked ? DIM : INK; ctx.fillText(s.slice(k1.length, k1.length + k2.length), x + k1.length * cw, y);
            if (!Lb.blocked) { ctx.fillStyle = BLUE; ctx.fillText(s.slice(k1.length + k2.length), x + (k1.length + k2.length) * cw, y); }
            ctx.globalAlpha = 1;
          }
        }
      };
      const lp = DEMOS.loop(wrap, draw);
      return () => { lp.destroy(); ro.disconnect(); cv.destroy(); };
    },
  });
})();
