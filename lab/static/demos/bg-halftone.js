/* bg-halftone · a 14px dot grid whose dot size follows a drifting noise field; dots swell and darken near the pointer. WebGL2. */
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
  float cell = 14.0*u_dpr; vec2 g = gl_FragCoord.xy/cell; vec2 cc = (floor(g)+0.5)*cell;
  vec2 uvc = cc/u_res; float asp = u_res.x/u_res.y;
  float n = fbm(vec2(uvc.x*asp, uvc.y)*2.0 + vec2(u_time*0.07, u_time*0.04));
  float r = 0.07 + 0.34*smoothstep(0.32, 0.78, n);
  vec2 dm = (cc - u_mouse)/u_res.y; float near = exp(-dot(dm,dm)*28.0)*u_hover;
  r = min(r + 0.26*near, 0.44);
  float d = length(fract(g)-0.5); float e = 0.7/cell;
  float a = 1.0 - smoothstep(r-e, r+e, d);
  vec3 ink = mix(u_c2, u_c1, near*0.75);
  o = vec4(mix(u_c0, ink, a), 1.0);
}`;
  DEMOS.register('bg-halftone', {
    group: 'bg', title: 'Halftone field', overlay: '',
    blurb: 'Cobalt halftone on paper: each dot in a 14px grid takes its radius from a slow noise field, so the texture breathes. Dots swell and turn to ink within reach of the pointer, like a lens over a print. WebGL2.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let hover = 0;
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize(); p.smooth(.12); hover += ((p.inside ? 1 : 0) - hover) * .07;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover);
        S.set.v2('u_mouse', p.sx * dpr, c.height - p.sy * dpr);
        S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.ink)); S.set.v3('u_c2', rgb(P.accent));
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
