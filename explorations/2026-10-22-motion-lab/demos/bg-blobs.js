/* bg-blobs · six pastel metaballs with paper grain. Blob 0 follows the pointer with lag and grows while hovering. WebGL2. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_dpr; uniform vec3 u_c0;
uniform vec2 u_b[6]; uniform vec3 u_bc[6]; uniform float u_br[6];
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  vec3 acc = u_c0; float ws = 1.0;
  for (int i=0;i<6;i++){ vec2 b = vec2(u_b[i].x*asp, u_b[i].y); vec2 d = q-b; float w = exp(-dot(d,d)/(u_br[i]*u_br[i]))*3.2; acc += u_bc[i]*w; ws += w; }
  vec3 col = acc/ws;
  float g = hash(floor(gl_FragCoord.xy/u_dpr) + fract(u_time*0.6)*41.0) - 0.5;
  col += g*0.05;
  o = vec4(col, 1.0);
}`;
  DEMOS.register('bg-blobs', {
    group: 'bg', title: 'Pastel blobs', overlay: '',
    blurb: 'Six soft colour fields (pink, sky, mint, sand, lavender, peach) drift on Lissajous paths over paper, blended as metaballs and roughened with grain. One blob is tethered to the pointer and swells while you hover. WebGL2.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let hover = 0;
      const cols = [P.pink, P.sky, P.mint, P.sand, P.lavender, P.peach];
      const par = cols.map((_, i) => ({ s1: .11 + i * .037, s2: .09 + i * .029, p1: i * 1.7, p2: i * 2.3, r: [.24, .34, .28, .26, .3, .22][i] }));
      const pos = new Float32Array(12), rad = new Float32Array(6), bc = new Float32Array(cols.flatMap(rgb));
      let bx = .5, by = .5;
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize(); p.smooth(.08); hover += ((p.inside ? 1 : 0) - hover) * .05;
        for (let i = 1; i < 6; i++) { const a = par[i]; pos[2 * i] = .5 + .42 * Math.sin(t * a.s1 + a.p1); pos[2 * i + 1] = .5 + .38 * Math.cos(t * a.s2 + a.p2); rad[i] = a.r; }
        const tx = p.inside ? p.nx : .5 + .3 * Math.sin(t * .13), ty = p.inside ? 1 - p.ny : .5 + .3 * Math.cos(t * .17);
        bx += (tx - bx) * .06; by += (ty - by) * .06; pos[0] = bx; pos[1] = by; rad[0] = .2 + .12 * hover;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.v3('u_c0', rgb(P.bg));
        S.set.v2v('u_b', pos); S.set.v3v('u_bc', bc); S.set.fv('u_br', rad);
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
