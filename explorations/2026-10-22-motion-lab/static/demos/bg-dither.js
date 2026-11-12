/* bg-dither · ordered (Bayer 8x8) dithering of a drifting noise field in three tones.
   The pointer carries a light: it clears the ink under the cursor and leaves a pink halo around it. WebGL2, no libraries. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover; uniform float u_dpr;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2;
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1)); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
float bayer(ivec2 p){ int x=p.x&7, y=p.y&7, v=0; for(int i=0;i<3;i++){ int xb=(x>>i)&1, yb=(y>>i)&1; v=v*4+((xb^yb)*2+yb); } return (float(v)+0.5)/64.0; }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  float n = fbm(q*1.5 + vec2(u_time*0.045, -u_time*0.03));
  float v = smoothstep(0.3, 0.8, n)*0.95 + 0.22*(uv.x*0.5 + (1.0-uv.y)*0.5) - 0.12;
  vec2 m = (gl_FragCoord.xy - u_mouse)/u_res.y; float d2 = dot(m,m);
  v += u_hover*(0.75*exp(-d2*14.0) - 1.1*exp(-d2*70.0));
  float cell = 3.0*u_dpr;
  float t = bayer(ivec2(floor(gl_FragCoord.xy/cell)));
  vec3 col = u_c0;
  col = mix(col, u_c1, step(t, clamp(v, 0.0, 1.0)));
  col = mix(col, u_c2, step(t, clamp((v-0.6)*2.0, 0.0, 1.0)));
  o = vec4(col, 1.0);
}`;
  DEMOS.register('bg-dither', {
    group: 'bg', title: 'Dither gradient', overlay: '',
    blurb: 'A slow noise field quantised with an 8×8 Bayer matrix into paper, pink and cobalt, so the gradient reads as print rather than screen. The pointer carries a light that clears the ink under it and leaves a pink halo. WebGL2 fragment shader, no libraries.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let hover = 0;
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize(); p.smooth(.1); hover += ((p.inside ? 1 : 0) - hover) * .06;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover);
        S.set.v2('u_mouse', p.sx * dpr, c.height - p.sy * dpr);
        S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.pink)); S.set.v3('u_c2', rgb(P.accent));
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
