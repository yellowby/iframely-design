/* bg-network · three node-network variations. No product circles: nodes are passive grey or rose dots, and life comes
   from motion and events: packets travelling the edges (and lighting nodes as they arrive), constellations orbiting
   cluster centres and exchanging handshakes, or a slow current carrying nodes with trails and sparkles. Canvas 2D. */
(() => {
  const DOMAINS = ['youtube.com', 'notion.so', 'nytimes.com', 'spotify.com', 'github.com', 'figma.com', 'loom.com', 'x.com', 'vimeo.com', 'substack.com', 'tiktok.com', 'medium.com', 'soundcloud.com', 'twitch.tv', 'reddit.com', 'dropbox.com', 'canva.com', 'gitbook.com'];
  const GREY = [138, 133, 124], ROSE = [227, 156, 179], COBALT = [31, 63, 224];
  const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); const fx = x - xi, fy = y - yi; const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
  function label(ctx, x, y, text, P) { ctx.font = DEMOS.font('mono', 11); const tw = ctx.measureText(text).width + 14; ctx.fillStyle = P.accent; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x + 10, y - 10, tw, 20, 5); else ctx.rect(x + 10, y - 10, tw, 20); ctx.fill(); ctx.fillStyle = P.bg; ctx.textBaseline = 'middle'; ctx.fillText(text, x + 17, y); }
  function make(name, title, blurb, mode) {
    DEMOS.register(name, {
      group: 'bg', title, blurb, overlay: '',
      mount(host) {
        const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host);
        let nodes = null, centres = null, hover = 0; const packets = [], shakes = [];
        const init = (w, h) => {
          nodes = []; centres = [];
          if (mode === 'orbit') for (let k = 0; k < 5; k++) centres.push({ x: w * (.12 + .19 * k) + (k % 2 ? 0 : 40), y: h * (k % 2 ? .3 : .68), ph: k * 1.9 });
          for (let i = 0; i < (mode === 'orbit' ? 72 : 84); i++) {
            const n = { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * 12, vy: (Math.random() - .5) * 12, r: 1.8 + Math.random() * 1.7, rose: Math.random() < .3, flash: 0, dom: DOMAINS[i % DOMAINS.length], trail: [], ph: Math.random() * 6.28 };
            if (mode === 'orbit') { n.c = i % 5; n.or = 28 + Math.random() * 120; n.w = (Math.random() < .5 ? -1 : 1) * (.05 + Math.random() * .16); n.sq = .55 + Math.random() * .45; }
            nodes.push(n);
          }
        };
        let lastPacket = 0, lastShake = 0;
        const L = DEMOS.loop(host, (t, dt) => {
          const { w, h } = C.resize(); if (!nodes) init(w, h); hover += ((p.inside ? 1 : 0) - hover) * .08; p.smooth(.2);
          ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
          /* motion */
          if (mode === 'drift') for (const n of nodes) {
            if (p.inside) { const dx = p.x - n.x, dy = p.y - n.y, d = Math.hypot(dx, dy); if (d < 240 && d > 1) { const f = (1 - d / 240) * 26 * dt; n.vx += dx / d * f; n.vy += dy / d * f; } }
            n.vx *= .995; n.vy *= .995; n.x += n.vx * dt; n.y += n.vy * dt;
            if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; n.x = Math.max(0, Math.min(w, n.x)); n.y = Math.max(0, Math.min(h, n.y));
          }
          if (mode === 'orbit') {
            centres.forEach((c, k) => { const tx = w * (.12 + .19 * k) + 30 * Math.sin(t * .11 + c.ph), ty = h * (k % 2 ? .3 : .68) + 24 * Math.cos(t * .09 + c.ph); let gx = tx, gy = ty; if (p.inside) { const d = Math.hypot(p.x - tx, p.y - ty); if (d < 320) { const f = (1 - d / 320) * .45; gx += (p.x - tx) * f; gy += (p.y - ty) * f; } } c.x += (gx - c.x) * .04; c.y += (gy - c.y) * .04; });
            for (const n of nodes) { const c = centres[n.c]; const a = n.ph + t * n.w; n.x = c.x + Math.cos(a) * n.or; n.y = c.y + Math.sin(a) * n.or * n.sq; }
          }
          if (mode === 'flow') for (const n of nodes) {
            const ang = noise(n.x * .0035 + 3.1, n.y * .0035 + t * .04) * Math.PI * 4; let vx = Math.cos(ang) * 16, vy = Math.sin(ang) * 16;
            if (p.inside) { const dx = n.x - p.sx, dy = n.y - p.sy, d = Math.hypot(dx, dy); if (d < 220 && d > 1) { const f = (1 - d / 220) * 70; vx += -dy / d * f; vy += dx / d * f; vx -= dx / d * f * .15; vy -= dy / d * f * .15; } }
            n.x += vx * dt; n.y += vy * dt; if (n.x < -10) n.x = w + 10; if (n.x > w + 10) n.x = -10; if (n.y < -10) n.y = h + 10; if (n.y > h + 10) n.y = -10;
            n.trail.push([n.x, n.y]); if (n.trail.length > 14) n.trail.shift(); if (n.trail.length > 1) { const [px, py] = n.trail[n.trail.length - 2]; if (Math.hypot(px - n.x, py - n.y) > 60) n.trail = [[n.x, n.y]]; }
          }
          /* edges */
          const reach = mode === 'orbit' ? 96 : 118; const adj = nodes.map(() => []);
          ctx.lineWidth = 1;
          for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const a = nodes[i], b = nodes[j]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < reach) { adj[i].push(j); adj[j].push(i); ctx.strokeStyle = rgba(GREY, (1 - d / reach) * .32); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
          /* life */
          if (mode === 'drift') {
            const every = .34 / (1 + hover * 1.5);
            if (t - lastPacket > every) { lastPacket = t; let from = Math.floor(Math.random() * nodes.length); if (p.inside && Math.random() < .6) { let bd = 1e9; nodes.forEach((n, i) => { const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < bd) { bd = d; from = i; } }); } if (adj[from].length) packets.push({ a: from, b: adj[from][Math.floor(Math.random() * adj[from].length)], u: 0, hops: 0 }); }
            for (let k = packets.length - 1; k >= 0; k--) { const q = packets[k]; q.u += dt * 1.6; const A = nodes[q.a], B = nodes[q.b]; const x = A.x + (B.x - A.x) * q.u, y = A.y + (B.y - A.y) * q.u;
              ctx.strokeStyle = rgba(COBALT, .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(A.x + (B.x - A.x) * Math.max(0, q.u - .3), A.y + (B.y - A.y) * Math.max(0, q.u - .3)); ctx.lineTo(x, y); ctx.stroke(); ctx.lineWidth = 1;
              ctx.fillStyle = P.accent; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill();
              if (q.u >= 1) { B.flash = 1; packets.splice(k, 1); if (q.hops < 3 && Math.random() < .7 && adj[q.b].length) packets.push({ a: q.b, b: adj[q.b][Math.floor(Math.random() * adj[q.b].length)], u: 0, hops: q.hops + 1 }); } }
          }
          if (mode === 'orbit') {
            if (t - lastShake > 1.1) { lastShake = t; const a = Math.floor(Math.random() * nodes.length); let b = Math.floor(Math.random() * nodes.length); let tries = 0; while (nodes[b].c === nodes[a].c && tries++ < 10) b = Math.floor(Math.random() * nodes.length); shakes.push({ a, b, t0: t }); nodes[a].flash = 1; nodes[b].flash = 1; }
            for (let k = shakes.length - 1; k >= 0; k--) { const s = shakes[k]; const age = t - s.t0; if (age > 1.4) { shakes.splice(k, 1); continue; } const A = nodes[s.a], B = nodes[s.b]; ctx.strokeStyle = rgba(COBALT, (1 - age / 1.4) * .7); ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); ctx.setLineDash([]); }
          }
          if (mode === 'flow') {
            for (const n of nodes) { if (Math.random() < dt * .09) n.flash = 1; if (n.trail.length > 1) { const base = n.rose ? ROSE : GREY; ctx.beginPath(); ctx.moveTo(n.trail[0][0], n.trail[0][1]); for (let k = 1; k < n.trail.length; k++) ctx.lineTo(n.trail[k][0], n.trail[k][1]); ctx.strokeStyle = rgba(base, .28); ctx.stroke(); } }
          }
          /* pointer links and nearest */
          let near = null, nd = 1e9;
          if (hover > .02) for (const n of nodes) { const d = Math.hypot(n.x - p.sx, n.y - p.sy); if (d < 170 && mode !== 'flow') { ctx.strokeStyle = rgba(COBALT, (1 - d / 170) * .7 * hover); ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(n.x, n.y); ctx.stroke(); } if (d < nd) { nd = d; near = n; } }
          /* nodes */
          for (const n of nodes) {
            n.flash = Math.max(0, n.flash - dt * (mode === 'flow' ? .9 : 1.4));
            const base = n.rose ? ROSE : GREY; const col = mixc(base, COBALT, n.flash); const r = n.r * (mode === 'orbit' ? 1 + .25 * Math.sin(t * 1.3 + n.ph) : 1) + n.flash * 1.6;
            if (n.flash > .5 && mode !== 'drift') { ctx.strokeStyle = rgba(COBALT, (n.flash - .5) * 1.2); ctx.beginPath(); ctx.arc(n.x, n.y, r + 4 + (1 - n.flash) * 10, 0, 6.2832); ctx.stroke(); }
            ctx.fillStyle = rgba(col, n.rose ? .95 : .85); ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.2832); ctx.fill();
          }
          if (near && hover > .3 && nd < 120) { ctx.fillStyle = P.accent; ctx.beginPath(); ctx.arc(near.x, near.y, 4.5, 0, 6.2832); ctx.fill(); label(ctx, near.x, near.y, near.dom, P); }
        });
        return () => { L.destroy(); p.destroy(); C.destroy(); };
      },
    });
  }
  make('bg-network', 'Node network · packets', 'Eighty-four passive nodes, grey with a third in rose, drifting and linking within reach. Life is traffic: cobalt packets leave a node every third of a second, travel an edge with a short trail, light the node they reach and often hop on, up to three times. The pointer gathers nodes, links to them, and the nearest node becomes the busiest sender. Canvas 2D.', 'drift');
  make('bg-network-orbit', 'Node network · constellations', 'Seventy-two grey and rose nodes orbit five drifting centres on their own ellipses, breathing slightly, so the graph reads as constellations that turn. Every second or so two nodes in different clusters exchange a dashed cobalt handshake and flash. The nearest constellation leans toward the pointer. Canvas 2D.', 'orbit');
  make('bg-network-flow', 'Node network · current', 'Nodes carried by a slow noise current like plankton, each leaving a faint trail in its own grey or rose; edges form and dissolve as they pass. A node sparkles cobalt now and then with a ring. The pointer is a vortex: nodes within reach swirl around it and are drawn in. Canvas 2D.', 'flow');
})();
