/* B06 Pastel blobs as a reusable backdrop: DEMOS.blobs(host, { colors, speed, grain, pointerEl, tether }).
   Six metaballs drift on Lissajous paths and blend over paper with a little grain; the first follows the pointer when
   `tether` is on. Used behind the product scenes at DPR 1, so it costs almost nothing. */
(function () {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_dpr; uniform vec3 u_c0; uniform float u_grain;
uniform vec2 u_b[6]; uniform vec3 u_bc[6]; uniform float u_br[6];
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  vec3 acc = u_c0; float ws = 1.0;
  for (int i=0;i<6;i++){ vec2 b = vec2(u_b[i].x*asp, u_b[i].y); vec2 d = q-b; float w = exp(-dot(d,d)/(u_br[i]*u_br[i]))*3.2; acc += u_bc[i]*w; ws += w; }
  vec3 col = acc/ws;
  col += (hash(floor(gl_FragCoord.xy/u_dpr) + fract(u_time*0.6)*41.0) - 0.5)*u_grain;
  o = vec4(col, 1.0);
}`;
  DEMOS.blobs = function (host, opts) {
    opts = opts || {};
    const { P, rgb, h } = DEMOS;
    const c = h('canvas', { class: 'fill' }); host.appendChild(c);
    let S; try { S = DEMOS.shader(c, FS, { maxDpr: opts.maxDpr || 1 }); } catch (e) { console.error(e); }
    if (!S) return null;
    const cols = opts.colors && opts.colors.length ? opts.colors : [P.pink, P.sky, P.mint, P.sand, P.lavender, P.peach];
    const six = Array.from({ length: 6 }, (_, i) => cols[i % cols.length]);
    const seed = opts.seed || 0; const speed = opts.speed == null ? 1 : opts.speed;
    const par = six.map((_, i) => ({ s1: (.11 + i * .037) * speed, s2: (.09 + i * .029) * speed, p1: i * 1.7 + seed, p2: i * 2.3 + seed * .7, r: [.3, .36, .3, .28, .32, .26][i] * (opts.radius || 1) }));
    const pos = new Float32Array(12), rad = new Float32Array(6), bc = new Float32Array(six.flatMap(rgb));
    const p = opts.tether ? DEMOS.pointer(opts.pointerEl || host) : null; let bx = .5, by = .5, hover = 0;
    const L = DEMOS.loop(host, t => {
      const dpr = S.resize();
      for (let i = 0; i < 6; i++) { const a = par[i]; pos[2 * i] = .5 + .42 * Math.sin(t * a.s1 + a.p1); pos[2 * i + 1] = .5 + .38 * Math.cos(t * a.s2 + a.p2); rad[i] = a.r; }
      if (p) { hover += ((p.inside ? 1 : 0) - hover) * .05; const tx = p.inside ? p.nx : pos[0], ty = p.inside ? 1 - p.ny : pos[1]; bx += (tx - bx) * .05; by += (ty - by) * .05; pos[0] = bx; pos[1] = by; rad[0] = par[0].r * (1 + .3 * hover); }
      S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.v3('u_c0', rgb(opts.paper || P.bg)); S.set.f('u_grain', opts.grain == null ? .04 : opts.grain);
      S.set.v2v('u_b', pos); S.set.v3v('u_bc', bc); S.set.fv('u_br', rad);
      S.draw();
    });
    return { canvas: c, destroy() { L.destroy(); if (p) p.destroy(); S.destroy(); c.remove(); } };
  };
})();
