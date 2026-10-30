/* Iframely motion lab · shared helpers.
   Classic script (no ES modules) so everything runs from file:// and inside an artifact.
   window.DEMOS: registry, pointer tracking, rAF loop with visibility pause, WebGL2 and Canvas 2D setup,
   a cancellable timeline for scripted product scenes, and the two layouts (hero overlay, text + stage). */
(function () {
  const P = { bg: '#f7f5f0', bg2: '#efece5', surface: '#fffdf9', line: '#e3dfd6', ink: '#1c1b18', ink2: '#5b5750', ink3: '#8a857c', accent: '#1f3fe0', link: '#1a35c4', accentSoft: '#7b93ff', pink: '#fadbe5', lavender: '#e4e3fb', sky: '#d8e7ff', mint: '#dcefe2', sand: '#f6ebc8', peach: '#fbe3d2' };
  const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return 'rgb(' + A.map((v, i) => Math.round((v + (B[i] - v) * t) * 255)).join(',') + ')'; };
  const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reg = new Map();
  const loops = new Set();
  let paused = false;

  /* Home page hero copy from iframely-marketing/demos/website (2026-10-29) */
  const HERO = { eyebrow: 'Holding the web together since 2012', title: 'Iframely makes URLs work inside other products', text: 'Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.', cta: 'Get an API key', cta2: 'Read the docs' };

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(String(k)));
    return el;
  }

  /* Canvas font string for a role, following FontLab when it is present: DEMOS.font('mono', 11) → '400 11px "Geist Mono", ...'. */
  const FONT_DEF = { serif: '"Instrument Serif", Georgia, serif', sans: 'Inter, system-ui, sans-serif', mono: '"Geist Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace' };
  function font(role, px) { const FL = window.FontLab; const on = FL && FL.inited; return (on ? FL.weight(role) : 400) + ' ' + px + 'px ' + ((on && FL.stack(role)) || FONT_DEF[role]); }

  function register(name, def) { reg.set(name, Object.assign({ name }, def)); }
  function list(group) { return [...reg.values()].filter(d => !group || d.group === group); }

  /* Pointer relative to an element. x,y in CSS px; nx,ny in 0..1; sx,sy smoothed (call p.smooth(k) each frame). */
  function pointer(el) {
    const p = { x: 0, y: 0, nx: .5, ny: .5, sx: 0, sy: 0, inside: false, down: false, moved: 0, lastMove: 0, w: 1, h: 1 };
    const upd = e => { const r = el.getBoundingClientRect(); p.w = r.width || 1; p.h = r.height || 1; p.x = e.clientX - r.left; p.y = e.clientY - r.top; p.nx = p.x / p.w; p.ny = p.y / p.h; p.inside = true; p.moved++; p.lastMove = performance.now(); };
    const enter = e => { upd(e); p.sx = p.x; p.sy = p.y; };
    const leave = () => { p.inside = false; p.down = false; };
    const down = e => { upd(e); p.down = true; };
    const up = () => { p.down = false; };
    el.addEventListener('pointerenter', enter); el.addEventListener('pointermove', upd); el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerdown', down); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    p.smooth = k => { p.sx += (p.x - p.sx) * k; p.sy += (p.y - p.sy) * k; };
    p.destroy = () => { el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', upd); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', down); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    return p;
  }

  /* rAF loop that only runs while the element is on screen and the tab is visible. Reduced motion: one frame. */
  function loop(el, fn) {
    let raf = 0, last = 0, running = false, visible = false, t = 0;
    const tick = now => { if (!running) return; const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; t += dt; try { fn(t, dt); } catch (e) { console.error(e); running = false; return; } raf = requestAnimationFrame(tick); };
    const ctl = {
      start() { if (running || !visible || document.hidden || paused) return; running = true; last = performance.now(); raf = requestAnimationFrame(tick); },
      stop() { running = false; cancelAnimationFrame(raf); },
      destroy() { ctl.stop(); io.disconnect(); document.removeEventListener('visibilitychange', vis); loops.delete(ctl); },
    };
    const io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); visible ? ctl.start() : ctl.stop(); }, { threshold: .02 });
    const vis = () => document.hidden ? ctl.stop() : ctl.start();
    if (reduced) { requestAnimationFrame(() => { try { fn(0, 0); } catch (e) { console.error(e); } }); return { start() {}, stop() {}, destroy() {} }; }
    io.observe(el); document.addEventListener('visibilitychange', vis); loops.add(ctl);
    return ctl;
  }

  /* WebGL2 full-screen fragment shader. */
  const VS = '#version 300 es\nvoid main(){ vec2 p = vec2(gl_VertexID==1 ? 3.0 : -1.0, gl_VertexID==2 ? 3.0 : -1.0); gl_Position = vec4(p, 0.0, 1.0); }';
  function shader(canvas, fs, opts) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const prog = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(s));
      gl.attachShader(prog, s);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog));
    gl.useProgram(prog); gl.bindVertexArray(gl.createVertexArray());
    const loc = {}; const u = n => (n in loc ? loc[n] : (loc[n] = gl.getUniformLocation(prog, n)));
    const maxDpr = (opts && opts.maxDpr) || 1.5;
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, maxDpr);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), hh = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== hh) { canvas.width = w; canvas.height = hh; gl.viewport(0, 0, w, hh); }
      return dpr;
    }
    return {
      gl, u, resize,
      set: { f: (n, v) => gl.uniform1f(u(n), v), v2: (n, a, b) => gl.uniform2f(u(n), a, b), v3: (n, c) => gl.uniform3f(u(n), c[0], c[1], c[2]), fv: (n, a) => gl.uniform1fv(u(n), a), v2v: (n, a) => gl.uniform2fv(u(n), a), v3v: (n, a) => gl.uniform3fv(u(n), a) },
      draw() { gl.drawArrays(gl.TRIANGLES, 0, 3); },
      destroy() { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); },
    };
  }

  /* Canvas 2D with DPR handling. */
  function canvas2d(host, opts) {
    const c = h('canvas', { class: 'fill' }); host.appendChild(c);
    const ctx = c.getContext('2d'); const maxDpr = (opts && opts.maxDpr) || 2;
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, maxDpr);
      const w = Math.max(1, Math.round(c.clientWidth * dpr)), hh = Math.max(1, Math.round(c.clientHeight * dpr));
      if (c.width !== w || c.height !== hh) { c.width = w; c.height = hh; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: c.clientWidth, h: c.clientHeight, dpr };
    }
    return { c, ctx, resize, destroy() { c.remove(); } };
  }

  /* Cancellable timeline for scripted scenes. wait() also idles while paused (hover or global pause). */
  /* Off screen: the demo's root is out of view (set by mount) or the tab is hidden. Every kind of motion holds while it is. */
  const offscreen = el => document.hidden || !!(el && el.closest && el.closest('.demo.off'));
  function timeline(isPaused) {
    let alive = true; const timers = new Set();
    const off = () => paused || !!(isPaused && isPaused.off && isPaused.off());
    const tick = ms => new Promise(r => { if (!alive) return; const id = setTimeout(() => { timers.delete(id); r(); }, ms); timers.add(id); });
    const sleep = async ms => { while (alive && off()) await tick(150); await tick(ms); while (alive && off()) await tick(150); }; /* a scene mounted off screen holds before its first step */ /* short steps (typing) hold off screen */
    const wait = async ms => { await tick(ms); while (alive && (paused || (isPaused && isPaused()))) await tick(120); }; /* pauses also hold on hover */
    return { sleep, wait, off, get alive() { return alive; }, destroy() { alive = false; timers.forEach(clearTimeout); timers.clear(); } };
  }
  const hoverPause = el => { const f = () => el.matches(':hover') || offscreen(el); f.off = () => offscreen(el); return f; };

  function fallback(host, msg) { host.appendChild(h('div', { class: 'fallback' }, msg || 'WebGL2 is not available in this browser.')); return () => {}; }

  /* Mount a demo into a container with its layout. Returns an unmount function. */
  function mount(container, name) {
    const def = reg.get(name); if (!def) throw new Error('unknown demo ' + name);
    if (def.alias) return mount(container, def.alias); /* a section pick that shows another demo as it is */
    container.innerHTML = '';
    const root = h('div', { class: 'demo demo-' + def.group + ' demo-' + name });
    container.appendChild(root);
    const seen = new IntersectionObserver(es => { for (const e of es) root.classList.toggle('off', !e.isIntersecting); }); seen.observe(root); /* .off pauses timelines, tweens and CSS animations */
    let un;
    if (def.group === 'bg') {
      const host = h('div', { class: 'bg-host', style: 'position:absolute;inset:0' }); root.appendChild(host);
      const c = Object.assign({}, HERO, def.copy || {});
      const ov = h('div', { class: 'hero ' + (def.overlay || '') },
        h('div', { class: 'eyebrow' }, c.eyebrow), h('h1', null, c.title), h('p', null, c.text),
        h('div', { class: 'btns' }, h('a', { class: 'btn primary', href: '#' }, c.cta), h('a', { class: 'btn secondary', href: '#' }, c.cta2)));
      root.appendChild(ov);
      un = def.mount(host, { root, overlay: ov });
    } else if (def.group === 'hero') {
      const host = h('div', { class: 'bg-host', style: 'position:absolute;inset:0' }); root.appendChild(host);
      const c = Object.assign({}, HERO, def.copy || {});
      const text = h('div', { class: 'text' }, h('div', { class: 'eyebrow' }, c.eyebrow), h('h1', null, c.title), h('p', null, c.text),
        h('div', { class: 'btns' }, h('a', { class: 'btn primary', href: '#' }, c.cta), h('a', { class: 'btn secondary', href: '#' }, c.cta2)));
      const slot = h('div', { class: 'slot' });
      root.appendChild(h('div', { class: 'hero2' }, text, slot));
      un = def.mount(host, slot, { root, text });
    } else if (def.group === 'ill' || def.group === 'pdw' || def.group === 'sec' || def.group === 'pal') { /* pdw: full-width product scenes with their own copy; sec: section picks; pal: palette trials */
      const stage = h('div', { class: 'ill-host' }); root.appendChild(stage);
      un = def.mount(stage, { root });
    } else if (def.group === 'logo') {
      const stage = h('div', { class: 'lgs' }); root.appendChild(stage);
      un = def.mount(stage, { root });
    } else {
      const c = def.copy; const pastel = def.pastel; /* e.g. ['pink','peach','lavender']: B06 blobs behind the stage, eyebrow as a chip */
      const eyebrow = h('div', { class: 'eyebrow' + (pastel ? ' chip' : ''), style: pastel ? '--pastel: var(--' + pastel[0] + ')' : '' }, c.eyebrow);
      const text = h('div', { class: 'text' }, eyebrow, h('h2', null, c.title), h('p', null, c.text), h('div', { class: 'btns' }, h('a', { class: 'btn primary', href: '#' }, c.cta)));
      const stage = h('div', { class: 'stage' + (pastel ? ' has-pastel' : '') });
      let inner = stage, blobs = null;
      if (pastel) {
        const bgEl = h('div', { class: 'pastel-bg' }); inner = h('div', { class: 'stage-in' }); stage.append(bgEl, inner);
        if (DEMOS.blobs) blobs = DEMOS.blobs(bgEl, { colors: pastel.map(k => P[k]), pointerEl: stage, tether: true, grain: .035, seed: (def.name.length % 7) * 1.3, speed: .8 });
      }
      root.appendChild(h('div', { class: 'pd' }, text, stage));
      un = def.mount(inner, { root, stage });
      const un0 = un; un = () => { if (un0) un0(); if (blobs) blobs.destroy(); };
    }
    return () => { seen.disconnect(); try { un && un(); } catch (e) { console.warn(e); } root.remove(); };
  }

  window.DEMOS = {
    P, rgb, mix, reduced, h, font, register, list, get: n => reg.get(n), pointer, loop, shader, canvas2d, timeline, hoverPause, offscreen, fallback, mount, HERO,
    setPaused(v) { paused = !!v; loops.forEach(l => paused ? l.stop() : l.start()); },
    get paused() { return paused; },
  };
})();
