/* bg-contours · topographic contour lines of a drifting height field: minor lines in ink, every fourth in cobalt,
   uplands tinted pink. The pointer raises a hill, so the lines bunch and ring around it. WebGL2 with screen-space derivatives. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover; uniform float u_dpr;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3;
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1)); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  float hgt = fbm(q*1.3 + vec2(u_time*0.03, u_time*0.02)) + 0.35*fbm(q*3.1 - u_time*0.02);
  vec2 m = (gl_FragCoord.xy - u_mouse)/u_res.y; float d2 = dot(m,m);
  hgt += u_hover*0.55*exp(-d2*16.0);
  float lv = hgt*16.0;
  float fl = 0.5 - abs(fract(lv) - 0.5);
  float w = fwidth(lv);
  float line = 1.0 - smoothstep(0.0, w*1.5 + 0.012, fl);
  float idx = floor(lv + 0.5); float major = (mod(idx, 4.0) < 0.5) ? 1.0 : 0.0;
  vec3 col = u_c0;
  col = mix(col, u_c3, smoothstep(0.95, 1.35, hgt)*0.6);
  col = mix(col, u_c1, line*(1.0 - major)*0.3);
  col = mix(col, u_c2, line*major*0.9);
  float pd = length(gl_FragCoord.xy - u_mouse)/u_dpr; col = mix(col, u_c2, (1.0 - smoothstep(2.5, 4.0, pd))*u_hover);
  o = vec4(col, 1.0);
}`;
  DEMOS.register('bg-contours', {
    group: 'bg', title: 'Contour map', overlay: '',
    blurb: 'A survey map of a slowly drifting height field: contour lines every sixteenth of elevation, minor ones in ink, every fourth in cobalt, the uplands tinted pink. The pointer raises a hill, so the lines bunch and ring around the cursor and relax when it leaves. WebGL2 with screen-space derivatives for constant-width lines.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS, { maxDpr: 2 }); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let hover = 0;
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize(); p.smooth(.1); hover += ((p.inside ? 1 : 0) - hover) * .06;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover); S.set.v2('u_mouse', p.sx * dpr, c.height - p.sy * dpr);
        S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.ink)); S.set.v3('u_c2', rgb(P.accent)); S.set.v3('u_c3', rgb(P.pink));
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
