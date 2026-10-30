/* Shared dither field for hero compositions. Same colours, noise and pointer lamp as B01 (demos/bg-dither.js), with:
   - optional glyph mode (opts.glyph = { ramp, font, cw, ch, size, mode }) that renders the field through a character atlas
     exactly like B02 to B04 (mode 1 ascii, 2 blocks, 3 braille), so a hero can run on the B03 block base;
   - hooks the compositions drive per frame through `st`: an ink attractor (positive pools ink, negative clears it),
     a shape the field resolves into (1 = card with play mark, 2 = chevron mark, 3 = window cut-out), and a pulse ring.
   DEMOS.dither(host, opts) returns { st, pulse(x, y), pointer, canvas, destroy }. */
(function () {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover; uniform float u_dpr;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3;
uniform vec2 u_attr; uniform float u_attrR; uniform float u_attrK;
uniform int u_shape; uniform vec4 u_rect; uniform float u_shapeMix;
uniform vec3 u_pulse; uniform float u_spin;
uniform sampler2D u_atlas; uniform float u_n; uniform vec2 u_cell; uniform int u_glyph; uniform vec2 u_fr; uniform vec2 u_gr;
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1)); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
float bayer(ivec2 p){ int x=p.x&7, y=p.y&7, v=0; for(int i=0;i<3;i++){ int xb=(x>>i)&1, yb=(y>>i)&1; v=v*4+((xb^yb)*2+yb); } return (float(v)+0.5)/64.0; }
float sdBox(vec2 p, vec2 b, float r){ vec2 d = abs(p)-b+vec2(r); return length(max(d,0.0)) + min(max(d.x,d.y),0.0) - r; }
float sdTri(vec2 p, float R){ float d1 = dot(p, vec2(0.866,0.5)) - 0.866*R; float d2 = dot(p, vec2(0.866,-0.5)) - 0.866*R; float d3 = -p.x - 0.5*R; return max(max(d1,d2),d3); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h); }
float sdMark(vec2 p, float s){ return min(min(sdSeg(p, vec2(-0.12*s,-0.28*s), vec2(-0.36*s,0.0)), sdSeg(p, vec2(-0.36*s,0.0), vec2(-0.12*s,0.28*s))), min(sdSeg(p, vec2(0.12*s,-0.28*s), vec2(0.36*s,0.0)), sdSeg(p, vec2(0.36*s,0.0), vec2(0.12*s,0.28*s)))) - 0.075*s; }
float ga(float x, vec2 local, vec2 range){ float idx = range.x + floor(clamp(x,0.0,1.0)*(range.y-0.001)); return texture(u_atlas, vec2((idx+local.x)/u_n, local.y)).a; }
void main(){
  float inG = 0.0, gv = 0.0, gLand = 0.0;
  vec2 pos = (u_glyph > 0) ? (floor(gl_FragCoord.xy/u_cell)+0.5)*u_cell : gl_FragCoord.xy;
  vec2 uv = pos/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  float n = fbm(q*1.5 + vec2(u_time*0.045, -u_time*0.03));
  float v = smoothstep(0.3, 0.8, n)*0.95 + 0.22*(uv.x*0.5 + (1.0-uv.y)*0.5) - 0.12;
  vec2 m = (pos - u_mouse)/u_res.y; float d2 = dot(m,m);
  v += u_hover*(0.75*exp(-d2*14.0) - 1.1*exp(-d2*70.0));
  if (u_attrK != 0.0) { vec2 da = (pos - u_attr)/u_attrR; v += u_attrK*exp(-dot(da,da)); }
  vec2 rc = u_rect.xy + u_rect.zw*0.5; vec2 p = pos - rc;
  if (u_shape == 1 && u_shapeMix > 0.0) {
    float d = sdBox(p, u_rect.zw*0.5, 22.0*u_dpr);
    float circ = length(p) - 0.17*u_rect.w; float tri = sdTri(p - vec2(0.012*u_rect.w, 0.0), 0.075*u_rect.w);
    float body = 1.0 - smoothstep(-1.0, 1.0, d); float hole = 1.0 - smoothstep(-1.0, 1.0, circ); float play = 1.0 - smoothstep(-1.0, 1.0, tri);
    float mk = max(body*(1.0-hole), play);
    float w = u_shapeMix*(1.0 - smoothstep(40.0*u_dpr, 220.0*u_dpr, max(d, 0.0)));
    v = mix(v, mk*0.95 + 0.06*n, w);
  } else if (u_shape == 2 && u_shapeMix > 0.0) {
    float d = sdMark(p, u_rect.w); float mk = 1.0 - smoothstep(-1.0, 1.0, d);
    float w = u_shapeMix*(1.0 - smoothstep(40.0*u_dpr, 220.0*u_dpr, max(d, 0.0)));
    v = mix(v, mk*0.95 + 0.06*n, w);
  } else if (u_shape == 3) {
    float d = sdBox(p, u_rect.zw*0.5, 8.0*u_dpr); float inside = 1.0 - smoothstep(-1.0, 1.0, d);
    v = mix(v*0.3, v + 0.12, inside);
  } else if (u_shape == 4) {
    float R = u_rect.w*0.5; vec2 pp = p/R; float r2 = dot(pp, pp);
    if (r2 < 1.0) {
      float z = sqrt(1.0 - r2); vec3 nrm = vec3(pp.x, pp.y, z);
      float a = u_time*u_spin, ca = cos(a), sa = sin(a);
      vec3 rn = vec3(nrm.x*ca + nrm.z*sa, nrm.y, -nrm.x*sa + nrm.z*ca);
      float lon = atan(rn.z, rn.x), lat = asin(clamp(rn.y, -1.0, 1.0));
      float land = smoothstep(0.5, 0.58, fbm(vec2(lon*1.4, lat*2.0) + 7.3));
      vec2 gd = abs(fract(vec2(lon, lat)/0.349) - 0.5); float grid = 1.0 - smoothstep(0.0, 0.06, min(0.5 - gd.x, 0.5 - gd.y));
      float light = clamp(dot(nrm, normalize(vec3(0.3, 0.55, 0.78))), 0.0, 1.0);
      float g = 0.14 + 0.5*(1.0 - light);
      g = mix(g, 0.7 + 0.3*(1.0 - light), land);
      g = max(g, grid*0.5);
      g = max(g, smoothstep(0.75, 1.0, r2)*0.9);
      inG = u_shapeMix; gv = g; gLand = land; v = mix(v, g, u_shapeMix);
    } else { float d = sqrt(r2) - 1.0; v = mix(v, v*0.3, u_shapeMix*(1.0 - smoothstep(0.0, 0.18, d))); }
  }
  float age = u_time - u_pulse.z;
  if (age > 0.0 && age < 2.5) { float dp = length(pos - u_pulse.xy)/u_res.y; float R = age*0.45; v += (1.0 - smoothstep(0.0, 0.03, abs(dp - R)))*(1.0 - age/2.5)*0.8; }
  vec3 col = u_c0;
  if (u_glyph == 0) {
    float cell = 3.0*u_dpr; float t = bayer(ivec2(floor(gl_FragCoord.xy/cell)));
    col = mix(col, u_c1, step(t, clamp(v, 0.0, 1.0))); col = mix(col, u_c2, step(t, clamp((v-0.6)*2.0, 0.0, 1.0)));
  } else {
    vec2 local = fract(gl_FragCoord.xy/u_cell); v = clamp(v, 0.0, 1.0);
    if (u_glyph == 2) { col = mix(col, u_c1, ga(v, local, u_fr)); col = mix(col, u_c2, ga((v-0.6)*2.5, local, u_fr)); }
    else { float a = ga(v, local, u_fr); vec3 g = (u_glyph == 1) ? mix(u_c3, u_c2, smoothstep(0.55, 0.9, v)) : mix(u_c2, u_c3, smoothstep(0.6, 1.0, v)); col = mix(col, g, a); }
    if (inG > 0.0) { float a = ga(gv, local, u_gr); vec3 cg = mix(u_c0, mix(u_c2, u_c3, gLand*0.8), a); col = mix(col, cg, inG); }
  }
  o = vec4(col, 1.0);
}`;
  DEMOS.dither = function (host, opts) {
    opts = opts || {};
    const { P, rgb, h } = DEMOS;
    const c = h('canvas', { class: 'fill' }); host.appendChild(c);
    let S; try { S = DEMOS.shader(c, FS, { maxDpr: opts.glyph ? 2 : 1.5 }); } catch (e) { console.error(e); }
    if (!S) { DEMOS.fallback(host); return null; }
    const gl = S.gl; const p = DEMOS.pointer(opts.pointerEl || host); let hover = 0, tNow = 0;
    const st = { attr: [0, 0], attrR: 1, attrK: 0, shape: 0, rect: [0, 0, 1, 1], shapeMix: 0, pulse: [0, 0, -100], spin: .28 };
    const G = opts.glyph; let tex = null, atlasDpr = 0, glyphs = [];
    if (G) {
      glyphs = [...G.ramp]; tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(S.u('u_atlas'), 0);
      if (document.fonts && document.fonts.load) document.fonts.load('16px ' + G.font).then(() => { atlasDpr = 0; }).catch(() => {});
    }
    function atlas(dpr) {
      const cw = Math.round(G.cw * dpr), ch = Math.round(G.ch * dpr);
      const a = document.createElement('canvas'); a.width = cw * glyphs.length; a.height = ch; const x = a.getContext('2d');
      x.fillStyle = '#fff'; x.font = Math.round(G.size * dpr) + 'px ' + G.font; x.textAlign = 'center'; x.textBaseline = 'middle';
      glyphs.forEach((g, i) => x.fillText(g, i * cw + cw / 2, ch / 2));
      gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, a); atlasDpr = dpr;
    }
    const L = DEMOS.loop(host, (t, dt) => {
      tNow = t; const dpr = S.resize(); p.smooth(.1); hover += ((p.inside ? 1 : 0) - hover) * .06;
      if (opts.frame) opts.frame(t, dt, st, { w: c.clientWidth, h: c.clientHeight, p, hover });
      const H = c.height;
      S.set.v2('u_res', c.width, H); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover); S.set.v2('u_mouse', p.sx * dpr, H - p.sy * dpr);
      S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.pink)); S.set.v3('u_c2', rgb(P.accent)); S.set.v3('u_c3', rgb(P.ink));
      S.set.v2('u_attr', st.attr[0] * dpr, H - st.attr[1] * dpr); S.set.f('u_attrR', Math.max(1, st.attrR * dpr)); S.set.f('u_attrK', st.attrK);
      gl.uniform1i(S.u('u_shape'), st.shape); const r = st.rect; gl.uniform4f(S.u('u_rect'), r[0] * dpr, H - (r[1] + r[3]) * dpr, r[2] * dpr, r[3] * dpr); S.set.f('u_shapeMix', st.shapeMix);
      S.set.v3('u_pulse', [st.pulse[0] * dpr, H - st.pulse[1] * dpr, st.pulse[2]]); S.set.f('u_spin', st.spin);
      if (G) { if (atlasDpr !== dpr) atlas(dpr); gl.uniform1i(S.u('u_glyph'), G.mode); S.set.f('u_n', glyphs.length); S.set.v2('u_cell', G.cw * dpr, G.ch * dpr); const fr = G.field || [0, glyphs.length], gr = G.globe || fr; S.set.v2('u_fr', fr[0], fr[1]); S.set.v2('u_gr', gr[0], gr[1]); }
      else { gl.uniform1i(S.u('u_glyph'), 0); S.set.f('u_n', 1); S.set.v2('u_cell', 1, 1); S.set.v2('u_fr', 0, 1); S.set.v2('u_gr', 0, 1); }
      S.draw();
    });
    return { st, pointer: p, canvas: c, pulse(x, y) { st.pulse = [x, y, tNow]; }, destroy() { L.destroy(); p.destroy(); if (tex) gl.deleteTexture(tex); S.destroy(); c.remove(); } };
  };
  /* rect of `el` relative to `root`, as [x, y, w, h] */
  DEMOS.rectIn = (el, root) => { const a = el.getBoundingClientRect(), b = root.getBoundingClientRect(); return [a.left - b.left, a.top - b.top, a.width, a.height]; };
})();
