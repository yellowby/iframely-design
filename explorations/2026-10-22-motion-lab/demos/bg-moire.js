/* bg-moire · two dot screens, ink and cobalt, slightly rotated and scaled against each other. The interference pattern
   breathes on its own; the pointer's x turns the cobalt screen and its y scales it, so the moiré follows the cursor. WebGL2. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_dpr; uniform float u_rot; uniform float u_scl;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2;
out vec4 o;
float dots(vec2 p, float sp, float r){ float d = length(fract(p/sp) - 0.5)*sp; return 1.0 - smoothstep(r - 0.7, r + 0.7, d); }
void main(){
  vec2 p = gl_FragCoord.xy - u_res*0.5;
  float sp = 9.0*u_dpr, r = 1.4*u_dpr;
  float a = dots(p, sp, r);
  mat2 R = mat2(cos(u_rot), -sin(u_rot), sin(u_rot), cos(u_rot));
  float b = dots(R*p*u_scl, sp, r);
  vec2 uv = gl_FragCoord.xy/u_res; float quiet = 1.0 - 0.55*smoothstep(0.62, 0.2, uv.x)*smoothstep(0.1, 0.4, uv.y)*smoothstep(0.95, 0.6, uv.y);
  vec3 col = u_c0; col = mix(col, u_c1, a*0.38*quiet); col = mix(col, u_c2, b*0.55*quiet);
  o = vec4(col, 1.0);
}`;
  DEMOS.register('bg-moire', {
    group: 'bg', title: 'Moiré screens', overlay: '',
    blurb: 'Two 8px dot screens, one ink and one cobalt, printed slightly out of register: a small rotation and a 1.5% scale difference produce the interference pattern a misaligned halftone would. It drifts on its own; moving the pointer left or right turns the cobalt screen, up or down scales it, so the moiré swims after the cursor. WebGL2, two texture-free dot lattices.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS, { maxDpr: 2 }); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let rot = .06, scl = 1.015;
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize();
        const tr = .06 + .035 * Math.sin(t * .22) + (p.inside ? (p.nx - .5) * .14 : 0), ts = 1.015 + (p.inside ? (p.ny - .5) * .035 : .008 * Math.sin(t * .17));
        rot += (tr - rot) * .05; scl += (ts - scl) * .05;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_rot', rot); S.set.f('u_scl', scl);
        S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.ink)); S.set.v3('u_c2', rgb(P.accent));
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
