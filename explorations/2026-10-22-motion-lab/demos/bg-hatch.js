/* bg-hatch · engraving cross-hatch: four line directions stack up as a drifting density field darkens, like a banknote or
   a woodcut. The pointer is a light that opens the hatching around it; the densest patches turn cobalt. WebGL2. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover; uniform float u_dpr;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2;
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1)); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  float d = smoothstep(0.25, 0.8, fbm(q*1.6 + vec2(u_time*0.04, -u_time*0.025)));
  d += 0.25*(uv.x*0.5 + (1.0-uv.y)*0.5) - 0.1;
  vec2 m = (gl_FragCoord.xy - u_mouse)/u_res.y; float d2 = dot(m,m);
  d = d*(1.0 - u_hover*0.95*exp(-d2*12.0)) + u_hover*0.25*exp(-d2*3.0)*(1.0 - exp(-d2*12.0));
  d = clamp(d, 0.0, 1.0);
  float sp = 7.0*u_dpr, th = 1.1*u_dpr; vec2 p = gl_FragCoord.xy;
  float ink = 0.0;
  ink = max(ink, step(mod(p.x + p.y, sp), th)*smoothstep(0.1, 0.28, d));
  ink = max(ink, step(mod(p.x - p.y, sp), th)*smoothstep(0.33, 0.5, d));
  ink = max(ink, step(mod(p.y, sp*0.8), th)*smoothstep(0.55, 0.7, d));
  float l4 = step(mod(p.x, sp*0.8), th);
  ink = max(ink, l4*smoothstep(0.74, 0.88, d));
  vec3 col = mix(u_c0, u_c1, ink*0.6);
  col = mix(col, u_c2, l4*smoothstep(0.86, 0.98, d)*0.9);
  o = vec4(col, 1.0);
}`;
  DEMOS.register('bg-hatch', {
    group: 'bg', title: 'Engraving hatch', overlay: '',
    blurb: 'Cross-hatching as a density field: 45°, −45°, horizontal and vertical line layers stack up where a drifting field darkens, the way an engraver builds tone. The pointer is a lamp that opens the hatching around it; the darkest patches switch to cobalt verticals. WebGL2, 7px line pitch.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS, { maxDpr: 2 }); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let hover = 0;
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize(); p.smooth(.1); hover += ((p.inside ? 1 : 0) - hover) * .06;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover); S.set.v2('u_mouse', p.sx * dpr, c.height - p.sy * dpr);
        S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.ink)); S.set.v3('u_c2', rgb(P.accent));
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
