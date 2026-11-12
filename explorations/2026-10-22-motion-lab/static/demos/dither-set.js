/* D · Dither set (2026-11-05): soft backgrounds (group 'dt', D01–D10) and accent elements for marketing blocks
   (group 'dta', D11–D20) for the white / #f6f6f6 / #0055ff system, with the brand symbols // : < > as dither units.

   One WebGL2 context for the whole page (R below) renders a field × a dither method into a hidden canvas, and each
   visible 2D canvas copies its frame out of it, so twenty cards never hit the browser's context limit. Output is
   transparent where there is no ink: the ground colour is the element's CSS background, so the same pattern can sit on
   any block, button or section.

   Spec (per canvas, an object or a function (t, panel) → object):
     field   linear | radial | clouds | blobs | arch | bands | slashes | chevrons | sphere | shapes | flat | bar
     method  bayer | ign (blue-noise-like) | grain | halftone | lines (slash screen) | marks (/ and // strokes) | glyphs (. : / < > /)
     cell    CSS px of one dither cell (glyph and mark cells are taller than wide)
     p, q, r field params; q = [noise breakup, speed, pointer lamp, glow]
     a, b    ink colours ('#hex' or ['#hex', opacity]); b takes over above `two` (0..1, 1 = one ink)
     gain, bias, seed; mask (a canvas of the panel's size, alpha = shape) with maskMode 1 multiply / 2 max / 3 knockout,
     mg (mask strength), mgy (vertical gradient inside the mask box mbox [y0, y1] in uv), maskOff [x, y] CSS px. */
(() => {
  const { h } = DEMOS;
  const BLUE = '#0055ff', GREY = '#f6f6f6', INK = '#0d0e10';
  const PROD = [
    { k: 'rich', name: 'Rich Media', c: '#0055ff', sym: '//', text: 'Embed rich media from 1,900 providers.' },
    { k: 'preview', name: 'Preview API', c: '#6a3bff', sym: '<>', text: 'Show previews of any link your users share.' },
    { k: 'data', name: 'Data API', c: '#a52fd0', sym: '{:}', text: 'Read web content for your automated systems.' },
    { k: 'pub', name: 'Publisher Console', c: '#c81d77', sym: ':/', text: 'Decide how other apps use your own content.' },
  ];
  const hex = s => { const n = parseInt(s.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  const tint = (c, k) => { const a = hex(c); return '#' + a.map(v => Math.round((v + (1 - v) * k) * 255).toString(16).padStart(2, '0')).join(''); };

  const mixHex = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round((v + (B[i] - v) * k) * 255).toString(16).padStart(2, '0')).join(''); };

  /* optional second accent, page-wide (localStorage 'dt-sec2'): one saturated colour that sits with #0055ff; tints and
     on-blue inks are mixed from it, so every card derives its own pair. Pink is the default so the option is visible. */
  const SEC = { pink: { label: 'Pink', s: '#ff3d8b' }, red: { label: 'Red', s: '#ff4438' }, violet: { label: 'Violet', s: '#8a4dff' } };
  let sec2 = 'pink'; try { const v = localStorage.getItem('dt-sec2'); if (v === 'none' || SEC[v]) sec2 = v; } catch (e) {}
  const S2 = () => (sec2 === 'none' ? null : SEC[sec2].s);
  const LIVE = new Set(), BARS = new Set();
  function secSeg(bar) {
    bar.appendChild(h('b', null, '2nd colour'));
    for (const k of ['none', ...Object.keys(SEC)]) bar.appendChild(h('button', { class: (sec2 === k ? 'on' : ''), 'data-sec': k, style: '--c:' + (SEC[k] ? SEC[k].s : 'transparent'), onclick: () => setSec(k) }, SEC[k] ? h('i') : null, SEC[k] ? SEC[k].label : 'None'));
    BARS.add(bar);
  }
  function setSec(k) {
    sec2 = k; try { localStorage.setItem('dt-sec2', k); } catch (e) {}
    BARS.forEach(b => b.querySelectorAll('[data-sec]').forEach(x => x.classList.toggle('on', x.dataset.sec === k)));
    document.querySelectorAll('.dt').forEach(secVars);
    LIVE.forEach(L => { L.panels.forEach(p => { p.dirty = true; }); if (DEMOS.reduced || DEMOS.paused) L.panels.forEach(p => drawPanel(p, 0)); });
  }
  const secVars = r => { const c = S2(); r.style.setProperty('--sec', c || '#7ea4ff'); r.style.setProperty('--sec-t', c ? mixHex('#ffffff', c, .22) : '#b7cbff'); };
  /* wrap a spec: unchanged with no second colour, else merged with f(colour) */
  const w2 = (base, f) => (t, pn) => { const b = typeof base === 'function' ? base(t, pn) : base; const c = S2(); return c ? Object.assign({}, b, f(c)) : b; };

  /* ---------------------------------------------------------------- renderer */
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_dpr, u_time, u_cell, u_seed;
uniform int u_field, u_method, u_maskMode;
uniform vec4 u_p, u_q, u_r, u_a, u_b, u_c, u_d, u_hp;
uniform int u_hmode, u_codes;
uniform float u_solid;
uniform float u_two, u_gain, u_bias, u_mg, u_mgy;
uniform vec2 u_mbox, u_maskOff;
uniform vec3 u_mouse;
uniform sampler2D u_mask, u_atlas;
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1)); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
float bayer(vec2 c){ ivec2 p = ivec2(mod(c, 8.0)); int v=0; for(int i=0;i<3;i++){ int xb=(p.x>>i)&1, yb=(p.y>>i)&1; v=v*4+((xb^yb)*2+yb); } return (float(v)+0.5)/64.0; }
float ign(vec2 c){ return fract(52.9829189*fract(dot(c, vec2(0.06711056, 0.00583715)))); }
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.0))+min(max(d.x,d.y),0.0); }
float sdSlash(vec2 p, float hh, float hw, float k){ p.x -= k*p.y; return sdBox(p, vec2(hw, hh)); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float t=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*t); }
float fill(float sd, float soft){ return 1.0 - smoothstep(-soft, soft, sd); }

float field(vec2 uv){
  float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y); float t = u_time*u_q.y; float v = 0.0;
  if (u_field==0){ vec2 d = vec2(cos(u_p.x), sin(u_p.x)); float s = dot(uv-0.5, d)+0.5; s += (fbm(q*3.0+vec2(t,-t)*0.5+u_seed)-0.5)*u_q.x; v = smoothstep(u_p.y, u_p.z, s); }
  else if (u_field==1){ vec2 c = vec2(u_p.x*asp, u_p.y) + vec2(sin(t*0.7), cos(t*0.53))*0.05; float d = length(q-c); d += (fbm(q*2.5+t*0.3+u_seed)-0.5)*u_q.x; v = 1.0 - smoothstep(0.0, u_p.z, d); v = pow(max(v,0.0), u_p.w); }
  else if (u_field==2){ float n = fbm(q*u_p.x + vec2(t*0.6, -t*0.4) + u_seed); v = smoothstep(u_p.y, u_p.z, n); v *= mix(1.0, smoothstep(-0.1, 1.0, uv.x*0.75+(1.0-uv.y)*0.35), u_p.w); }
  else if (u_field==3){ float s=0.0; for(int i=0;i<4;i++){ float fi=float(i); vec2 c = vec2((0.35+0.5*fract(fi*0.618+u_seed*0.1))*asp + 0.18*asp*sin(t*(0.3+0.11*fi)+fi*2.1), 0.5 + 0.32*cos(t*(0.27+0.07*fi)+fi*1.7)); float r = u_p.x*(0.75+0.4*fract(fi*0.37)); s += exp(-dot(q-c,q-c)/(r*r)); } v = smoothstep(u_p.y, u_p.z, s); }
  else if (u_field==4){ vec2 c = vec2(u_p.x*asp + 0.5*asp, -u_p.y); float d = length(q-c); v = 1.0 - smoothstep(u_p.z*0.15, u_p.z, d); if (u_p.w>0.0) v *= 0.72+0.28*cos(d*u_p.w - t*2.0); v += (fbm(q*3.0+t*0.2+u_seed)-0.5)*u_q.x; }
  else if (u_field==5){ vec2 d = vec2(cos(u_p.x), sin(u_p.x)); float s = dot(q, d); float w = sin(s*u_p.y + fbm(q*1.3+vec2(t*0.3,0.0)+u_seed)*3.5 + t*0.4); v = smoothstep(0.1, 1.0, 0.5+0.5*w); v *= mix(1.0, smoothstep(0.0, 1.0, uv.x*0.8+(1.0-uv.y)*0.4), u_p.z); }
  else if (u_field==6){ vec2 c = vec2(u_p.x*asp, u_p.y); float H = u_p.z, hw = H*0.17, k = 0.42, gap = H*0.62; vec2 p = q-c;
    float sd = min(sdSlash(p+vec2(gap*0.5,0.0), H, hw, k), sdSlash(p-vec2(gap*0.5,0.0), H, hw, k));
    float g = clamp(0.5 - p.y/(2.0*H), 0.0, 1.0); g = mix(1.0, 0.18+0.82*g, u_r.x); g *= mix(1.0, 0.75+0.25*sin(p.y/H*4.0 + t*2.5), u_r.y);
    v = fill(sd, u_p.w)*g + u_q.w*exp(-max(sd,0.0)/(H*0.12))*0.6*step(0.0,sd); }
  else if (u_field==7){ vec2 c = vec2(u_p.x*asp, u_p.y); float H = u_p.z, W = H*0.6, th = H*0.13, sp = u_r.z*0.5; vec2 p = q-c;
    float a = min(sdSeg(p, vec2(-sp, H), vec2(-sp-W, 0.0)), sdSeg(p, vec2(-sp-W,0.0), vec2(-sp,-H)));
    float b = min(sdSeg(p, vec2(sp, H), vec2(sp+W, 0.0)), sdSeg(p, vec2(sp+W,0.0), vec2(sp,-H)));
    float sd = min(a,b) - th; float g = 1.0 - clamp((abs(p.x) - sp + th)/(W+th*2.0), 0.0, 1.0);
    g = mix(1.0, 0.12+0.88*g, u_r.x); g *= mix(1.0, 0.78+0.22*sin(abs(p.x)/H*5.0 - t*2.0), u_r.y);
    v = fill(sd, u_p.w)*g + u_q.w*exp(-max(sd,0.0)/(H*0.1))*0.5*step(0.0,sd); }
  else if (u_field==8){ vec2 c = vec2(u_p.x*asp, u_p.y); float R = u_p.z; vec2 d = q-c; float r = length(d)/R;
    vec3 L = normalize(vec3(-0.55+0.35*sin(t*0.6), 0.55+0.15*cos(t*0.6), 0.65)); float body = 0.0;
    if (r < 1.0){ vec3 n = vec3(d/R, sqrt(1.0-r*r)); float lam = clamp(dot(n,L), 0.0, 1.0); body = mix(u_r.y, 1.0, pow(1.0-lam, 1.3)); body *= 1.0 - smoothstep(0.985, 1.0, r); }
    float sh = length((d - vec2(R*0.15, -R*1.22))/vec2(R*0.95, R*0.16)); float shadow = (1.0 - smoothstep(0.2, 1.0, sh))*0.35;
    float tl = -0.22; vec2 e = mat2(cos(tl), sin(tl), -sin(tl), cos(tl))*d;
    vec2 ab = vec2(1.75, 0.42); float l = length(e/ab); vec2 gr = e/(ab*ab)/max(l, 1e-4); float er = abs(l - R)/max(length(gr), 1e-4); float ring = 1.0 - smoothstep(R*0.012, R*0.026, er);
    if (e.y > 0.0 && r < 1.0) ring = 0.0;
    v = max(max(body, shadow*step(1.0,r)), ring*u_r.x); }
  else if (u_field==9){ vec2 c1 = vec2(0.8*asp + 0.03*sin(t*0.4), 0.62 + 0.03*cos(t*0.33)); float r1 = 0.46; float d1 = length(q-c1)-r1;
    float s1 = fill(d1, 0.004)*(0.22+0.78*clamp(0.5 - (q.y-c1.y)/(2.0*r1), 0.0, 1.0));
    vec2 p2 = q - vec2(0.16*asp, 0.2 + 0.02*sin(t*0.5)); float s2 = fill(sdSlash(p2, 0.32, 0.06, 0.42), 0.004)*(0.3+0.7*clamp(0.5-p2.y/0.64,0.0,1.0));
    vec2 p3 = q - vec2(0.52*asp, -0.05); float d3 = max(abs(length(p3) - 0.3) - 0.05, -p3.y); float s3 = fill(d3, 0.004)*0.55*(0.6+0.4*sin(atan(p3.y,p3.x)*3.0 - t));
    if (u_r.w > 0.5){ s1 *= u_r.x; s2 *= u_r.y; s3 *= u_r.z; } /* stills: isolate one shape per pass */
    v = max(s1, max(s2, s3))*u_p.x; }
  else if (u_field==10){ v = u_p.x; }
  else { float e = abs(uv.x-0.5)*2.0 + (fbm(q*4.0+u_seed+t*0.3)-0.5)*u_q.x; v = 1.0 - smoothstep(u_p.y, u_p.z, e); if (u_p.w < 1.0) v *= 1.0 - smoothstep(u_p.w, 1.0, abs(uv.y-0.5)*2.0); }
  return v;
}
float value(vec2 f){
  vec2 uv = f/u_res; float v = field(uv)*u_gain + u_bias;
  if (u_maskMode > 0){ vec2 mu = (f - u_maskOff*u_dpr)/u_res; float m = texture(u_mask, mu).a;
    float g = clamp((mu.y - u_mbox.x)/max(1e-3, u_mbox.y - u_mbox.x), 0.0, 1.0); float mm = m*u_mg*mix(1.0, 1.0 - 0.7*g, u_mgy);
    if (u_maskMode==1) v *= mm; else if (u_maskMode==2) v = max(v, mm); else v *= 1.0 - m; }
  vec2 md = (f - u_mouse.xy)/u_res.y; v += u_mouse.z*u_q.z*exp(-dot(md,md)*20.0);
  return clamp(v, 0.0, 1.0);
}
/* second colour: a hue field (noise / linear split / all) picks, per cell and through its own Bayer offset, inks c/d instead of a/b */
float hueField(vec2 uv){ float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y); float t = u_time*u_q.y;
  if (u_hmode==1) return smoothstep(u_hp.y, u_hp.z, fbm(q*u_hp.x + vec2(-t*0.35, t*0.25) + 31.7 + u_seed));
  if (u_hmode==2){ vec2 d = vec2(cos(u_hp.x), sin(u_hp.x)); return smoothstep(u_hp.y, u_hp.z, dot(uv-0.5, d)+0.5); }
  return 1.0; }
void main(){
  vec2 gfc = gl_FragCoord.xy, gcell = floor(gl_FragCoord.xy); float gidx = 0.0;
  float cs = max(1.0, u_cell*u_dpr); vec2 f = gl_FragCoord.xy; float ca = 0.0, cb = 0.0; float k2 = 1.0/max(1e-3, 1.0-u_two);
  if (u_method <= 2){
    vec2 cell = floor(f/cs); gcell = cell; gfc = (cell+0.5)*cs; float v = value(gfc); float v2 = (v-u_two)*k2;
    float t = u_method==0 ? bayer(cell) : (u_method==1 ? ign(cell) : hash(cell+u_seed*7.0));
    ca = v > t ? 1.0 : 0.0; cb = (u_two < 1.0 && v2 > t) ? 1.0 : 0.0;
  } else if (u_method == 3){
    float an = 0.785398; mat2 Rm = mat2(cos(an), sin(an), -sin(an), cos(an));
    vec2 rf = Rm*f; vec2 cell = floor(rf/cs); vec2 lc = rf/cs - cell - 0.5; vec2 fc = transpose(Rm)*((cell+0.5)*cs); gcell = cell; gfc = fc;
    float v = value(fc); float v2 = (v-u_two)*k2; float aa = 1.0/cs; float d = length(lc);
    float r = sqrt(v)*0.75; ca = v > 0.01 ? 1.0 - smoothstep(r-aa, r+aa, d) : 0.0;
    float r2 = sqrt(clamp(v2,0.0,1.0))*0.75; cb = (u_two < 1.0 && v2 > 0.01) ? 1.0 - smoothstep(r2-aa, r2+aa, d) : 0.0;
  } else if (u_method == 4){
    vec2 n = normalize(vec2(1.0, -0.42)); float u = dot(f, n)/cs; gcell = floor(f/cs); float v = value(f); float v2 = (v-u_two)*k2;
    float d = abs(fract(u)-0.5); float aa = 0.8/cs;
    ca = v > 0.01 ? 1.0 - smoothstep(v*0.5-aa, v*0.5+aa, d) : 0.0;
    cb = (u_two < 1.0 && v2 > 0.01) ? 1.0 - smoothstep(v2*0.5-aa, v2*0.5+aa, d) : 0.0;
  } else if (u_method == 5){
    vec2 csz = vec2(cs, cs*1.6); vec2 cell = floor(f/csz); vec2 lc = f/csz - cell; gcell = cell; gfc = (cell+0.5)*csz; float v = value(gfc);
    float lv = v*3.0; float L = min(3.0, floor(lv) + step(bayer(cell), fract(lv)));
    float px = (lc.x-0.5) - 0.42*1.6*(lc.y-0.5); float aa = 1.0/cs; float ext = step(abs(lc.y-0.5), 0.36);
    float s = L > 2.5 ? min(abs(px+0.19), abs(px-0.19)) : abs(px); float w = L < 1.5 ? 0.075 : (L < 2.5 ? 0.13 : 0.085);
    ca = L > 0.5 ? (1.0 - smoothstep(w-aa, w+aa, s))*ext : 0.0; cb = L > 2.5 ? ca : 0.0;
  } else {
    vec2 csz = vec2(cs*0.62, cs); vec2 cell = floor(f/csz); vec2 lc = f/csz - cell; gcell = cell; gfc = (cell+0.5)*csz; float v = value(gfc);
    float lv = v*5.0; float L = min(5.0, floor(lv) + step(bayer(cell), fract(lv)));
    /* levels 3-5 pick / (half the time), < or > per cell, in regular, semibold, heavy */
    float hr = hash(cell+u_seed); float pk = hr < 0.5 ? 0.0 : (hr < 0.75 ? 1.0 : 2.0);
    float idx = L < 0.5 ? 0.0 : (L < 1.5 ? 1.0 : (L < 2.5 ? 2.0 : (L < 3.5 ? 3.0 + pk : (L < 4.5 ? 6.0 + pk : 9.0 + pk))));
    gidx = idx; float g = texture(u_atlas, vec2((idx + lc.x)/12.0, lc.y)).a; ca = g; cb = L > 4.5 ? g : 0.0;
    if (v >= u_solid){ ca = 1.0; cb = 0.0; gidx = 12.0; }
  }
  if (u_method <= 2 && value(gfc) >= u_solid){ ca = 1.0; cb = 0.0; }
  bool hs = u_hmode > 0 && hueField(gfc/u_res) > bayer(gcell + vec2(3.0, 5.0)); vec4 A = hs ? u_c : u_a, B = hs ? u_d : u_b;
  float aB = cb*B.a, aA = ca*A.a; vec3 col = aB > 0.0 ? B.rgb : A.rgb; float al = max(aA, aB);
  o = vec4(col*al, al);
  if (u_codes == 1) o = vec4(gidx/12.0, hs ? 1.0 : 0.0, 0.0, 1.0);
  else if (u_codes == 2) o = vec4(value(f), hueField(f/u_res), 0.0, 1.0); /* raw field + hue per pixel, for the stills type pass */
}`;
  const FIELD = { linear: 0, radial: 1, clouds: 2, blobs: 3, arch: 4, bands: 5, slashes: 6, chevrons: 7, sphere: 8, shapes: 9, flat: 10, bar: 11 };
  const HMODE = { noise: 1, linear: 2, all: 3 };
  const METHOD = { bayer: 0, ign: 1, grain: 2, halftone: 3, lines: 4, marks: 5, glyphs: 6 };

  const R = (() => {
    let cv, gl, prog, ok = null, empty, atlas; const loc = {}, cache = new WeakMap();
    const u = n => (n in loc ? loc[n] : (loc[n] = gl.getUniformLocation(prog, n)));
    function tex() { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; }
    /* glyph ramp: blank . : then / < > in regular, semibold and heavy (the heavy level is drawn in ink b) */
    function buildAtlas() {
      const W = 62, H = 100, G = [[' ', 500], ['.', 500], [':', 500], ['/', 400], ['<', 400], ['>', 400], ['/', 600], ['<', 600], ['>', 600], ['/', 800], ['<', 800], ['>', 800]];
      const c = document.createElement('canvas'); c.width = W * G.length; c.height = H; const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      G.forEach(([g, wt], i) => { x.font = wt + ' 84px "JetBrains Mono", ui-monospace, monospace'; x.fillText(g, i * W + W / 2, H * .53); });
      gl.bindTexture(gl.TEXTURE_2D, atlas); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    }
    function init() {
      if (ok !== null) return ok;
      cv = document.createElement('canvas'); cv.width = cv.height = 64;
      gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
      if (!gl) return (ok = false);
      prog = gl.createProgram();
      const VS = '#version 300 es\nvoid main(){ vec2 p = vec2(gl_VertexID==1 ? 3.0 : -1.0, gl_VertexID==2 ? 3.0 : -1.0); gl_Position = vec4(p, 0.0, 1.0); }';
      for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('dither shader: ' + gl.getShaderInfoLog(s)); return (ok = false); }
        gl.attachShader(prog, s);
      }
      gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return (ok = false); }
      gl.useProgram(prog); gl.bindVertexArray(gl.createVertexArray());
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      empty = tex(); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      atlas = tex(); buildAtlas(); fontsReady.then(buildAtlas);
      gl.uniform1i(u('u_mask'), 0); gl.uniform1i(u('u_atlas'), 1);
      return (ok = true);
    }
    const col = v => { if (!v) return [0, 0, 0, 0]; const [c, a] = Array.isArray(v) ? v : [v, 1]; return hex(c).concat(a); };
    function paint(ctx, w, hh, s, t, dpr, mouse, mask) {
      if (!init()) return false;
      if (cv.width < w || cv.height < hh) { cv.width = Math.max(cv.width, w); cv.height = Math.max(cv.height, hh); }
      gl.viewport(0, 0, w, hh);
      const p = s.p || [0, 0, 1, 1], q = s.q || [0, 0, 0, 0], r = s.r || [1, 0, 0, 0], A = col(s.a), B = col(s.b);
      gl.uniform2f(u('u_res'), w, hh); gl.uniform1f(u('u_dpr'), dpr); gl.uniform1f(u('u_time'), t); gl.uniform1f(u('u_cell'), s.cell || 2); gl.uniform1f(u('u_seed'), s.seed || 0);
      gl.uniform1i(u('u_field'), FIELD[s.field] || 0); gl.uniform1i(u('u_method'), METHOD[s.method] || 0); gl.uniform1i(u('u_maskMode'), mask ? (s.maskMode || 1) : 0);
      gl.uniform4f(u('u_p'), ...p); gl.uniform4f(u('u_q'), ...q); gl.uniform4f(u('u_r'), ...r); gl.uniform4f(u('u_a'), ...A); gl.uniform4f(u('u_b'), ...B);
      const H = s.hue && HMODE[s.hue.mode]; gl.uniform1i(u('u_hmode'), H || 0); gl.uniform1i(u('u_codes'), s.codes === 2 ? 2 : s.codes ? 1 : 0); gl.uniform1f(u('u_solid'), s.solid == null ? 2 : s.solid); gl.uniform4f(u('u_hp'), ...((s.hue && s.hue.p) || [1.1, .45, .72, 0])); gl.uniform4f(u('u_c'), ...col(s.c || s.a)); gl.uniform4f(u('u_d'), ...col(s.d || s.b));
      gl.uniform1f(u('u_two'), s.two == null ? 1 : s.two); gl.uniform1f(u('u_gain'), s.gain == null ? 1 : s.gain); gl.uniform1f(u('u_bias'), s.bias || 0);
      gl.uniform1f(u('u_mg'), s.mg == null ? 1 : s.mg); gl.uniform1f(u('u_mgy'), s.mgy || 0); gl.uniform2f(u('u_mbox'), ...(s.mbox || [0, 1])); gl.uniform2f(u('u_maskOff'), ...(s.maskOff || [0, 0]));
      gl.uniform3f(u('u_mouse'), ...mouse);
      gl.activeTexture(gl.TEXTURE0);
      if (mask) { let e = cache.get(mask); if (!e) cache.set(mask, (e = { t: tex(), v: -1 })); gl.bindTexture(gl.TEXTURE_2D, e.t); if (e.v !== mask._v) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask); e.v = mask._v; } }
      else gl.bindTexture(gl.TEXTURE_2D, empty);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      ctx.clearRect(0, 0, w, hh); ctx.drawImage(cv, 0, cv.height - hh, w, hh, 0, 0, w, hh);
      return true;
    }
    return { init, paint };
  })();

  /* ---------------------------------------------------------------- panels */
  let fontsReady = Promise.resolve(), styled = false;
  function ensure() {
    if (styled) return; styled = true;
    document.head.appendChild(h('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400..700&display=swap' }));
    document.head.appendChild(h('style', null, CSS));
    fontsReady = (document.fonts ? Promise.all(['400 40px "JetBrains Mono"', '500 40px "JetBrains Mono"', '600 40px "JetBrains Mono"', '800 40px "JetBrains Mono"', '600 40px Geist', '400 16px Geist'].map(f => document.fonts.load(f).catch(() => {}))) : Promise.resolve()).then(() => {});
  }
  /* a canvas filling `el` (position it with CSS), painted from spec */
  function mk(el, spec, opts) {
    const o = opts || {};
    const c = h('canvas', { class: 'dt-cv' + (o.cls ? ' ' + o.cls : '') }); if (o.before) el.insertBefore(c, el.firstChild); else el.appendChild(c);
    const pn = { el, c, ctx: c.getContext('2d'), spec, p: o.pointer ? DEMOS.pointer(o.pointerEl || el) : null, hover: 0, still: !!o.still, onResize: o.onResize, after: o.after, mask: null, drawn: false, dirty: true };
    if (o.onResize) fontsReady.then(() => { pn.force = true; });
    return pn;
  }
  function drawPanel(pn, t) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(pn.c.clientWidth * dpr), hh = Math.round(pn.c.clientHeight * dpr); if (!w || !hh) return;
    let changed = pn.force; if (pn.c.width !== w || pn.c.height !== hh) { pn.c.width = w; pn.c.height = hh; changed = true; }
    if (changed) { pn.force = false; pn.dirty = true; if (pn.onResize) pn.onResize(w, hh, dpr, pn); }
    const p = pn.p; let mouse = [0, 0, 0];
    if (p) { p.smooth(.18); pn.hover += ((p.inside ? 1 : 0) - pn.hover) * .12; if (pn.hover < .003) pn.hover = 0; mouse = [p.sx * dpr, hh - p.sy * dpr, pn.hover]; }
    if (pn.still && pn.drawn && !pn.dirty && !(p && (p.inside || pn.hover > 0))) return;
    const s = typeof pn.spec === 'function' ? pn.spec(t, pn) : pn.spec;
    if (!R.paint(pn.ctx, w, hh, s, t, dpr, mouse, s.mask === false ? null : pn.mask)) return;
    if (pn.after) pn.after(pn.ctx, w, hh, dpr, pn);
    pn.drawn = true; pn.dirty = false;
  }
  /* one loop per card at ~30 fps; only on screen (DEMOS.loop); reduced motion paints one frame and repaints on resize */
  function run(root, panels, onFrame) {
    if (!R.init()) { root.appendChild(h('div', { class: 'fallback' }, 'WebGL2 is not available in this browser.')); return () => {}; }
    let acc = 1, T = 0; const live = { panels }; LIVE.add(live); secVars(root);
    const L = DEMOS.loop(root, (t, dt) => { T = t; acc += dt; if (acc < 1 / 30) return; acc = 0; if (onFrame) onFrame(t); for (const pn of panels) drawPanel(pn, t); });
    const ro = new ResizeObserver(() => { panels.forEach(pn => { pn.dirty = true; }); if (DEMOS.reduced || DEMOS.paused) { if (onFrame) onFrame(T); panels.forEach(pn => drawPanel(pn, T)); } });
    panels.forEach(pn => ro.observe(pn.c));
    fontsReady.then(() => { if (DEMOS.reduced) panels.forEach(pn => drawPanel(pn, 0)); });
    return () => { L.destroy(); ro.disconnect(); LIVE.delete(live); BARS.forEach(b => { if (root.contains(b)) BARS.delete(b); }); panels.forEach(pn => pn.p && pn.p.destroy()); };
  }
  /* text into a mask canvas the size of the panel; returns the glyph box in uv (y up) for the mask gradient */
  function textMask(pn, w, hh, txt, font, x, y, align) {
    const m = pn.mask || (pn.mask = document.createElement('canvas')); m.width = w; m.height = hh;
    const c = m.getContext('2d'); c.clearRect(0, 0, w, hh); c.fillStyle = '#fff'; c.font = font; c.textAlign = align || 'left'; c.textBaseline = 'alphabetic'; c.fillText(txt, x, y);
    const mt = c.measureText(txt); m._v = (m._v || 0) + 1;
    return [1 - (y + mt.actualBoundingBoxDescent) / hh, 1 - (y - mt.actualBoundingBoxAscent) / hh];
  }

  const CSS = `
.dt{--blue:${BLUE};--ink:${INK};--ink2:#5b616e;--mute:#8b909a;--hair:#e6e8ec;--grey:${GREY};font-family:Geist,Inter,system-ui,sans-serif;color:var(--ink);background:#fff;padding:22px;display:grid;gap:18px}
.dt *{box-sizing:border-box}
.dt-cv{position:absolute;inset:0;width:100%;height:100%;display:block}
.dt-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.dt-bar b{font:500 11px 'Geist Mono',ui-monospace,monospace;color:var(--mute);text-transform:uppercase;letter-spacing:.06em;margin:0 4px 0 10px}
.dt-bar b:first-child{margin-left:0}
.dt-bar button{height:28px;padding:0 10px;border-radius:7px;border:1px solid var(--hair);background:#fff;font:13px Geist,Inter,sans-serif;color:var(--ink);cursor:pointer}
.dt-bar button:hover{border-color:#b9bec7}
.dt-bar button.on{background:var(--ink);border-color:var(--ink);color:#fff}
.dt-bar button i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:6px;background:var(--c)}
.dt-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.dt-pn{margin:0}
.dt-box{position:relative;aspect-ratio:5/4;border-radius:14px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(13,14,16,.07)}
.dt-box .dt-cv{z-index:0}
.dt-pn figcaption{font:11px 'Geist Mono',ui-monospace,monospace;color:var(--mute);margin-top:8px}
.dt-copy{position:absolute;z-index:1;left:22px;top:22px;max-width:62%;pointer-events:none}
.eb{font:500 11px/1.3 'JetBrains Mono',ui-monospace,monospace;color:var(--blue);letter-spacing:.01em}
.dt-copy h4{font:600 21px/1.12 Geist,Inter,sans-serif;letter-spacing:-.025em;margin:8px 0 6px}
.dt-copy p{font:13px/1.45 Geist,Inter,sans-serif;color:var(--ink2);margin:0}
.dt-copy .bt{display:inline-block;margin-top:12px;height:30px;line-height:30px;padding:0 12px;border-radius:8px;background:var(--ink);color:#fff;font:500 12px Geist,Inter,sans-serif}
.dt-pn.dark .dt-copy{color:#fff}.dt-pn.dark .eb{color:#c7d7ff}.dt-pn.dark .dt-copy p{color:rgba(255,255,255,.8)}.dt-pn.dark .bt{background:#fff;color:var(--blue)}
.dt.notext .dt-copy{display:none}
/* marketing blocks */
.dx{position:relative;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:44px;align-items:center;padding:48px;border-radius:22px;overflow:hidden}
.dx.white{background:#fff;box-shadow:inset 0 0 0 1px var(--hair)}.dx.grey{background:var(--grey)}.dx.blue{background:var(--blue);color:#fff}
.dx h2{font:600 34px/1.1 Geist,Inter,sans-serif;letter-spacing:-.03em;margin:12px 0 12px;text-wrap:balance}
.dx p{font:16px/1.55 Geist,Inter,sans-serif;color:var(--ink2);margin:0 0 22px;max-width:44ch}
.dx.blue .eb{color:#c7d7ff}.dx.blue p{color:rgba(255,255,255,.8)}
.btns{display:flex;flex-wrap:wrap;gap:10px}
.b1,.b2{position:relative;display:inline-flex;align-items:center;height:40px;padding:0 16px;border-radius:10px;font:500 14px Geist,Inter,sans-serif;text-decoration:none;overflow:hidden;isolation:isolate;cursor:pointer}
.b1{background:var(--blue);color:#fff}.b2{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1px var(--hair)}
.b1 .dt-cv,.b2 .dt-cv{z-index:-1}
.dx.blue .b1{background:#fff;color:var(--blue)}.dx.blue .b2{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.viz{position:relative;border-radius:16px}
.dt-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.dt-row.c2{grid-template-columns:repeat(2,minmax(0,1fr))}.dt-row.c3{grid-template-columns:repeat(3,minmax(0,1fr))}
.tile{margin:0}.tile .tbox{position:relative;aspect-ratio:4/3;border-radius:14px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(13,14,16,.07)}
.tile figcaption{font:11px 'Geist Mono',ui-monospace,monospace;color:var(--mute);margin-top:8px}
.code{position:absolute;z-index:1;left:50%;top:50%;transform:translate(-50%,-50%);width:min(56%,360px);padding:16px 18px;border-radius:12px;background:#fff;box-shadow:0 1px 0 rgba(13,14,16,.04),0 0 0 1px var(--hair),0 12px 32px -12px rgba(13,30,80,.18);font:12px/1.65 'JetBrains Mono',ui-monospace,monospace;color:#5b616e;white-space:pre;overflow:hidden}
.code i{font-style:normal;color:var(--blue)}.code u{text-decoration:none;color:var(--ink)}
.pill{position:absolute;z-index:1;transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px 0 8px;border-radius:13px;background:#fff;box-shadow:0 0 0 1px var(--hair),0 6px 16px -8px rgba(13,30,80,.25);font:500 11px 'JetBrains Mono',ui-monospace,monospace;color:var(--ink);white-space:nowrap;transition:opacity .25s}
.pill i{width:8px;height:8px;border-radius:2px;background:var(--c)}
.pc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.pc{border-radius:16px;overflow:hidden;background:#fff;box-shadow:inset 0 0 0 1px var(--hair)}
.pc-h{position:relative;aspect-ratio:16/11;background:var(--t2)}
.pc-b{padding:16px 18px 18px}.pc-b h3{font:600 17px/1.2 Geist,Inter,sans-serif;letter-spacing:-.015em;margin:0 0 6px}.pc-b p{font:14px/1.45 Geist,Inter,sans-serif;color:var(--ink2);margin:0 0 12px}.pc-b a{font:500 13px Geist,Inter,sans-serif;color:var(--c);text-decoration:none}
.win{position:absolute;inset:6% 4% 0 4%;border-radius:14px 14px 0 0;background:#fff;box-shadow:0 0 0 1px var(--hair),0 20px 40px -20px rgba(13,30,80,.22);overflow:hidden}
.win .tb{display:flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-bottom:1px solid var(--hair);font:11px 'JetBrains Mono',ui-monospace,monospace;color:var(--mute)}
.win .tb s{width:9px;height:9px;border-radius:50%;background:#e3e5ea;text-decoration:none}.win .tb span{margin-left:10px;padding:3px 10px;border-radius:6px;background:var(--grey)}
.win .md{margin:16px;aspect-ratio:16/8;border-radius:10px;background:linear-gradient(135deg,#dfe8ff,var(--sec-t) 60%,var(--sec));position:relative}
.win .md:after{content:'';position:absolute;left:50%;top:50%;width:0;height:0;transform:translate(-30%,-50%);border-left:18px solid #fff;border-top:11px solid transparent;border-bottom:11px solid transparent}
.win .ln{height:10px;border-radius:5px;background:#eceef2;margin:10px 16px}.win .ln.a{width:62%;height:14px;background:#d9dce3}.win .ln.b{width:84%}.win .ln.c{width:48%}
.erase{position:absolute;left:0;right:0;bottom:0;height:62%;z-index:2;pointer-events:none}
.ecard{position:absolute;inset:14% 12% -10% 12%;border-radius:12px;background:#fff;box-shadow:0 0 0 1px var(--hair);padding:14px}
.ecard .md{aspect-ratio:16/8;border-radius:8px;background:linear-gradient(135deg,#dfe8ff,var(--sec-t) 55%,var(--sec))}
.ecard .ln{height:9px;border-radius:5px;background:#e6e8ec;margin-top:10px}.ecard .ln.a{width:70%;height:12px;background:#d4d8e0}.ecard .ln.b{width:90%}
.secs{border-radius:22px;overflow:hidden;box-shadow:inset 0 0 0 1px var(--hair)}
.sec{position:relative;padding:34px 48px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.sec h3{font:600 26px/1.15 Geist,Inter,sans-serif;letter-spacing:-.025em;margin:6px 0 0}
.sec.blue{background:var(--blue);color:#fff}.sec.blue .eb{color:#c7d7ff}.sec.grey{background:var(--grey)}
.band{position:relative;height:56px}.band .lab{position:absolute;right:14px;top:50%;transform:translateY(-50%);z-index:1;font:11px 'Geist Mono',ui-monospace,monospace;padding:3px 8px;border-radius:6px;background:rgba(255,255,255,.85);color:var(--ink2)}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:8px}
.stat .sbox{position:relative;height:120px}.stat p{margin:6px 0 0;font:14px/1.4 Geist,Inter,sans-serif;color:var(--ink2)}.stat .eb{margin-top:10px;color:var(--mute)}
.hl-rows{display:grid;gap:12px}
.hl-row{padding:34px 40px;border-radius:20px}.hl-row.white{box-shadow:inset 0 0 0 1px var(--hair)}.hl-row.grey{background:var(--grey)}.hl-row.blue{background:var(--blue);color:#fff}
.hl-row h2{font:600 36px/1.15 Geist,Inter,sans-serif;letter-spacing:-.035em;margin:0;text-wrap:balance}
.hl{position:relative;isolation:isolate}
.hl .dt-cv{z-index:-1;inset:-.06em -.22em -.02em -.22em;width:calc(100% + .44em);height:calc(100% + .08em)}
.ul{position:relative}
.ul .dt-cv{top:auto;bottom:-.12em;height:.2em;inset-inline:-.1em;width:calc(100% + .2em)}
.brow{display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:30px 36px;border-radius:20px}
.brow.white{box-shadow:inset 0 0 0 1px var(--hair)}.brow.blue{background:var(--blue)}
.brow .b1,.brow .b2{height:44px;padding:0 20px;font-size:15px}
.brow.blue .b1{background:#fff;color:var(--blue)}.brow.blue .b2{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}
.chip{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px 0 34px;border-radius:9px;background:var(--t);font:500 13px Geist,Inter,sans-serif;color:var(--c)}
.chip .dt-cv{z-index:-1;width:46px;right:auto}.chip b{position:absolute;left:10px;font:800 12px 'JetBrains Mono',monospace}
.tag{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:6px;font:600 11px 'JetBrains Mono',monospace;color:#fff;background:var(--ink)}
.tag .dt-cv{z-index:-1}
.ctas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.cta{position:relative;min-height:300px;border-radius:22px;overflow:hidden;padding:36px 40px}
.cta.blue{background:var(--blue);color:#fff}.cta.grey{background:var(--grey)}
.cta .in{position:relative;z-index:1;max-width:330px}.cta h3{font:600 30px/1.1 Geist,Inter,sans-serif;letter-spacing:-.03em;margin:12px 0 10px}.cta p{font:15px/1.5 Geist,Inter,sans-serif;margin:0 0 20px;color:var(--ink2)}
.cta.blue p{color:rgba(255,255,255,.8)}.cta.blue .eb{color:#c7d7ff}.cta.blue .b1{background:#fff;color:var(--blue)}
.cta .dt-cv{z-index:0}
@container (max-width: 900px){ .pc-grid{grid-template-columns:repeat(2,minmax(0,1fr))} .dt-row{grid-template-columns:repeat(2,minmax(0,1fr))} }
@container (max-width: 760px){ .dt-grid,.stats,.ctas,.dt-row.c3{grid-template-columns:1fr} .dx{gap:28px;padding:32px} .hl-row h2{font-size:30px} }
@container (max-width: 600px){ .dx{grid-template-columns:1fr;padding:24px} .pc-grid,.dt-row,.dt-row.c2{grid-template-columns:1fr} .sec{padding:26px 24px} }
`;

  /* ---------------------------------------------------------------- D01–D10 soft backgrounds */
  const GROUNDS = [
    { k: 'white', label: 'white #ffffff', bg: '#ffffff' },
    { k: 'grey', label: 'very light grey #f6f6f6', bg: GREY },
    { k: 'blue', label: 'blue #0055ff', bg: BLUE, dark: true },
  ];
  /* inks per ground: [a, b]; b only shows above `two`. Tint = blue tints, Grey = neutral, Accent = a pale ink with brand blue (or white on blue) at the peaks */
  const TONES = {
    tint: { white: ['#e3ecff', '#c4d6ff'], grey: ['#e1e8f6', '#c3d3f3'], blue: ['#1764ff', '#3b7cff'] },
    grey: { white: ['#f0f1f3', '#dfe2e7'], grey: ['#e7e8eb', '#d7dae0'], blue: ['#004be2', '#0041c7'] },
    accent: { white: ['#d3e0ff', BLUE], grey: ['#cfdcfb', BLUE], blue: ['#2a70ff', '#ffffff'] },
  };
  /* glyphs, marks and lines cover only part of a cell, so they take a stronger pair to read at the same softness */
  const SPARSE = {
    tint: { white: ['#b9cdff', '#7fa5ff'], grey: ['#b6c8ef', '#7d9fe9'], blue: ['#3f7fff', '#7aa6ff'] },
    grey: { white: ['#dadde3', '#b9bec8'], grey: ['#d3d6dc', '#b3b8c2'], blue: ['#0a45d0', '#0036a8'] },
    accent: { white: ['#9fbaff', BLUE], grey: ['#a3bbf2', BLUE], blue: ['#5c94ff', '#ffffff'] },
  };
  const SPARSE_M = { glyphs: 1, marks: 1, lines: 1 };
  const BASE = { bayer: 2, ign: 2, grain: 1.5, halftone: 6, lines: 5, marks: 8, glyphs: 11 };
  const SIZES = { S: 1, M: 1.6, L: 2.6 };
  const MLABEL = { bayer: 'Bayer', ign: 'Blue noise', grain: 'Grain', halftone: 'Halftone', lines: 'Slash lines', marks: 'Slash marks', glyphs: '//:<> glyphs' };

  /* second-colour pair for a ground: as soft as the blue pair, stronger for sparse methods, full colour at the Accent peaks */
  function secInks(c, g, st) {
    const sp = SPARSE_M[st.method], gr = g.bg, onBlue = g.k === 'blue';
    if (st.tone === 'accent') return { c: mixHex(gr, c, onBlue ? .45 : (sp ? .4 : .22)), d: c };
    const k = onBlue ? (sp ? [.5, .75] : [.3, .48]) : (sp ? [.32, .55] : (st.tone === 'grey' ? [.08, .16] : [.13, .26]));
    return { c: mixHex(gr, c, k[0]), d: mixHex(gr, c, k[1]) };
  }
  function bg(name, title, blurb, spec, init) {
    DEMOS.register(name, {
      group: 'dt', title, blurb,
      mount(stage) {
        ensure();
        const st = Object.assign({ method: 'bayer', size: 'S', tone: 'tint', text: true }, init);
        const root = h('div', { class: 'dt' }); stage.appendChild(root);
        const bar = h('div', { class: 'dt-bar' }); root.appendChild(bar);
        const panels = [];
        const seg = (label, key, opts) => {
          bar.appendChild(h('b', null, label));
          for (const [v, l] of opts) bar.appendChild(h('button', { class: st[key] === v ? 'on' : '', 'data-k': key, 'data-v': String(v), onclick: e => {
            st[key] = key === 'text' ? v === true || v === 'true' : v; bar.querySelectorAll('[data-k="' + key + '"]').forEach(b => b.classList.toggle('on', b.dataset.v === String(v)));
            root.classList.toggle('notext', !st.text); panels.forEach(p => { p.dirty = true; });
          } }, l));
        };
        seg('Method', 'method', Object.entries(MLABEL));
        seg('Cell', 'size', [['S', 'S'], ['M', 'M'], ['L', 'L']]);
        seg('Tone', 'tone', [['tint', 'Tint'], ['grey', 'Grey'], ['accent', 'Accent']]);
        seg('Text', 'text', [[true, 'On'], [false, 'Off']]);
        secSeg(bar);
        const grid = h('div', { class: 'dt-grid' }); root.appendChild(grid);
        for (const g of GROUNDS) {
          const box = h('div', { class: 'dt-box', style: 'background:' + g.bg });
          box.appendChild(h('div', { class: 'dt-copy' }, h('div', { class: 'eb' }, '// Rich Media'), h('h4', null, 'Embed anything people paste'), h('p', null, 'Players, posts and docs from 1,900 providers, from one URL.'), h('span', { class: 'bt' }, 'Get an API key')));
          grid.appendChild(h('figure', { class: 'dt-pn' + (g.dark ? ' dark' : '') }, box, h('figcaption', null, g.label)));
          const pn = mk(box, () => { const [a, b] = (SPARSE_M[st.method] ? SPARSE : TONES)[st.tone][g.k]; const o = Object.assign({}, spec, { method: st.method, cell: BASE[st.method] * SIZES[st.size] * (spec.cellMul || 1), a, b }); const c2 = S2(); if (c2) Object.assign(o, secInks(c2, g, st), { hue: spec.hue || { mode: 'noise', p: [1.1, .45, .72, 0] } }); return o; }, { pointer: true, before: true, still: !(spec.q && spec.q[1]) });
          panels.push(pn);
        }
        return run(root, panels);
      },
    });
  }

  bg('dt-corner', 'Corner glow', 'A radial glow from the top-right corner, drifting a little, broken up with low-frequency noise and quantised with an 8×8 Bayer matrix. The softest option: two inks a step away from the ground.',
    { field: 'radial', p: [1.02, 1.05, 1.15, 1.5], q: [.28, .25, .45, 0], two: .55, hue: { mode: 'linear', p: [-2.2, .5, .78, 0] } }, { method: 'bayer' });
  bg('dt-grain', 'Grain wash', 'A diagonal wash towards the bottom right with blue-noise-like (interleaved gradient) thresholds: no visible grid, reads like a fine print grain. Works at cell S as a texture you only notice up close.',
    { field: 'linear', p: [-.6, .28, 1.08, 0], q: [.35, .15, .45, 0], two: .7, hue: { mode: 'linear', p: [-1.57, .42, .78, 0] } }, { method: 'ign' });
  bg('dt-clouds', 'Noise clouds', 'Drifting fbm clouds, weighted to the right and bottom so the text corner stays clean. Bayer at a medium cell gives the pixel look without getting loud.',
    { field: 'clouds', p: [1.6, .34, .78, .85], q: [0, .6, .45, 0], two: .62 }, { method: 'bayer', size: 'M' });
  bg('dt-blobs', 'Soft blobs', 'Four metaballs on slow Lissajous paths, so the shapes merge and part. The dithered edge replaces the usual blur of a blob background.',
    { field: 'blobs', p: [.3, .38, 1.35, 0], q: [0, .6, .45, 0], two: .62 }, { method: 'ign' });
  bg('dt-arch', 'Horizon arch', 'A glow rising from below the bottom edge, with faint concentric bands moving outwards. Halftone dots on a 45° screen; try Bayer or Slash lines.',
    { field: 'arch', p: [.12, .22, 1.2, 26], q: [.1, .4, .45, 0], two: .7 }, { method: 'halftone' });
  bg('dt-lines', 'Slash screen', 'A line screen at the angle of the logo slash: the lines thicken where the field is dense. The page reads as hatched with // at any size.',
    { field: 'linear', p: [-1.2, .3, 1.08, 0], q: [.35, .2, .45, 0], two: .72, hue: { mode: 'linear', p: [0, .55, .85, 0] } }, { method: 'lines' });
  bg('dt-marks', 'Slash marks', 'Each cell holds a mark from a short ramp, nothing → thin / → bold / → // (in the second ink). A texture of URL slashes; ordered dithering picks the level per cell.',
    { field: 'clouds', p: [1.3, .4, .8, .9], q: [0, .5, .45, 0], two: .8 }, { method: 'marks' });
  bg('dt-glyphs', '//:<> glyph field', 'Ordered dithering over a character ramp, blank . : / < > and a heavy / that takes the second ink: the gradient is written in the brand symbols. Radial from the bottom-right.',
    { field: 'radial', p: [.98, .02, 1.45, 1.1], q: [.3, .3, .5, 0], two: .8 }, { method: 'glyphs' });
  bg('dt-bands', 'Waves', 'Diagonal sine bands bent by noise, fading out towards the top-left. Big Bayer pixels make it read as a calm, almost woven texture.',
    { field: 'bands', p: [.6, 9, .85, 0], q: [0, .5, .45, 0], two: .7 }, { method: 'bayer', size: 'M', tone: 'grey' });
  bg('dt-shapes', 'Soft shapes', 'Flat geometry instead of noise: a big circle, one slash and a half ring, each filled with a dithered gradient that is denser at the bottom. The shapes drift a few pixels; the arch pulses.',
    { field: 'shapes', p: [1, 0, 0, 0], q: [0, .5, .3, 0], two: .7 }, { method: 'bayer' });

  /* ---------------------------------------------------------------- D11–D20 accent elements */
  const copy = (eb, title, text, b1, b2) => h('div', null, h('div', { class: 'eb' }, eb), h('h2', null, title), h('p', null, text),
    h('div', { class: 'btns' }, b1 ? h('a', { class: 'b1', href: '#', onclick: e => e.preventDefault() }, b1) : null, b2 ? h('a', { class: 'b2', href: '#', onclick: e => e.preventDefault() }, b2) : null));
  function acc(name, title, blurb, build) {
    DEMOS.register(name, { group: 'dta', title, blurb, mount(stage) { ensure(); const root = h('div', { class: 'dt' }); stage.appendChild(root); const bar = h('div', { class: 'dt-bar' }); secSeg(bar); root.appendChild(bar); const P = []; const onFrame = build(root, P); return run(root, P, onFrame); } });
  }
  const tile = (row, bgc, label) => { const b = h('div', { class: 'tbox', style: 'background:' + bgc }); row.appendChild(h('figure', { class: 'tile' }, b, h('figcaption', null, label))); return b; };

  /* shared with demos/dither-stills.js */
  DEMOS.ditherKit = { R, hex, mixHex, tint, BLUE, GREY, INK, PROD, SEC, GROUNDS, TONES, SPARSE, SPARSE_M, BASE, MLABEL, secInks, ensure, get fontsReady() { return fontsReady; } };

  acc('dta-slash', 'The // mark, dithered', 'The two logo slashes as a large accent beside a product block: parallelograms filled with a dithered gradient (dense at the foot, dissolving upwards) with a slow scan running through and a scatter of dots around the edges. Below, the same mark on other grounds and methods.', (root, P) => {
    const viz = h('div', { class: 'viz', style: 'aspect-ratio:6/5' });
    root.appendChild(h('div', { class: 'dx white' }, copy('// Rich Media', 'Embed anything people paste', 'Players, posts, maps and docs from 1,900 providers. One URL in, a responsive embed out.', 'Get an API key', 'See providers'), viz));
    P.push(mk(viz, w2({ field: 'slashes', p: [.5, .5, .4, .004], q: [0, 1, .5, .14], r: [1, 1, 0, 0], method: 'bayer', cell: 3, a: BLUE }, c => ({ c, hue: { mode: 'linear', p: [1.5708, .42, .62, 0] } })), { pointer: true }));
    const row = h('div', { class: 'dt-row' }); root.appendChild(row);
    const T = [[GREY, 'halftone on grey', { method: 'halftone', cell: 7, a: BLUE }], ['#fff', 'glyphs on white', { method: 'glyphs', cell: 10, a: '#8fb0ff', b: BLUE, two: .75 }], [BLUE, 'slash marks on blue', { method: 'marks', cell: 9, a: '#7fa8ff', b: '#fff', two: .7 }], ['#fff', 'slash lines on white', { method: 'lines', cell: 5, a: BLUE }]];
    for (const [bgc, label, m] of T) P.push(mk(tile(row, bgc, label), w2(Object.assign({ field: 'slashes', p: [.5, .5, .36, .004], q: [0, 1, .5, .12], r: [1, 1, 0, 0] }, m), c => ({ c: bgc === BLUE ? mixHex(BLUE, c, .6) : (m.method === 'glyphs' ? mixHex('#ffffff', c, .5) : c), d: bgc === BLUE ? mixHex('#ffffff', c, .25) : c, hue: { mode: 'linear', p: [0, .49, .51, 0] } })), { pointer: true }));
  });

  acc('dta-chevrons', '< > around a response', 'Angle brackets behind a code card, densest where they meet the card and dissolving outwards, so the card looks like it is being written between them. The second row puts it on blue (glyphs) and on white (blue noise).', (root, P) => {
    const viz = h('div', { class: 'viz', style: 'aspect-ratio:3/2' });
    viz.appendChild(h('div', { class: 'code', html: '{\n  <u>"url"</u>: <i>"https://youtu.be/…"</i>,\n  <u>"meta"</u>: {\n    <u>"title"</u>: "Launch keynote",\n    <u>"site"</u>: "YouTube"\n  },\n  <u>"html"</u>: "&lt;iframe …&gt;"\n}' }));
    root.appendChild(h('div', { class: 'dx grey' }, copy('<> Preview API', 'Previews of any link your users share', 'Title, image, player and site name for every URL, cached and ready to render.', 'Try a URL', 'Read the docs'), viz));
    const ch = { field: 'chevrons', p: [.5, .5, .4, .004], q: [0, 1, .5, .2], r: [1, 1, 1.0, 0] };
    const split = (pale, strong) => c => ({ c: pale(c), d: strong(c), hue: { mode: 'linear', p: [0, .49, .51, 0] } });
    P.push(mk(viz, w2(Object.assign({}, ch, { method: 'bayer', cell: 3, a: '#a9c1ff', b: BLUE, two: .55 }), split(c => mixHex(GREY, c, .4), c => c)), { pointer: true, before: true }));
    const row = h('div', { class: 'dt-row c2' }); root.appendChild(row);
    P.push(mk(tile(row, BLUE, 'glyphs on blue'), w2(Object.assign({}, ch, { p: [.5, .5, .33, .004], r: [1, 1, .55, 0], method: 'glyphs', cell: 11, a: '#a9c6ff', b: '#fff', two: .6 }), split(c => mixHex(BLUE, c, .7), c => mixHex('#ffffff', c, .3))), { pointer: true }));
    P.push(mk(tile(row, '#fff', 'blue noise on white'), w2(Object.assign({}, ch, { p: [.5, .5, .33, .004], r: [1, 1, .55, 0], method: 'ign', cell: 2, a: '#bcd0ff', b: BLUE, two: .6 }), split(c => mixHex('#ffffff', c, .3), c => c)), { pointer: true }));
  });

  acc('dta-orb', 'Orb with providers in orbit', 'A lit sphere in halftone with a dithered orbit ring and a soft dotted shadow; provider domains ride the ring and fade behind the sphere. A stat block or a hero side visual. The light moves slowly.', (root, P) => {
    const viz = h('div', { class: 'viz', style: 'aspect-ratio:11/10' });
    root.appendChild(h('div', { class: 'dx white' }, copy(':// 1,900+ providers', 'One API for every player, post and doc', 'YouTube, Figma, Spotify, Google Maps and the long tail behind them, kept working as their embed codes change.', 'Browse providers'), viz));
    const C = [.5, .52], RR = .26, TL = -.22;
    const pn = mk(viz, w2({ field: 'sphere', p: [C[0], C[1], RR, 0], q: [0, 1, .4, 0], r: [.7, .1, 0, 0], method: 'halftone', cell: 5, a: BLUE }, c => ({ c, hue: { mode: 'linear', p: [-.75, .55, .72, 0] } })), { pointer: true }); P.push(pn);
    const D = [['youtube.com', '#ff0033'], ['figma.com', '#a259ff'], ['spotify.com', '#1db954'], ['maps.google.com', '#34a853'], ['github.com', '#0d0e10'], ['vimeo.com', '#1ab7ea'], ['tiktok.com', '#fe2c55']];
    const pills = D.map(([d, c]) => { const el = h('span', { class: 'pill', style: '--c:' + c }, h('i'), d); viz.appendChild(el); return el; });
    return t => {
      const W = viz.clientWidth, H = viz.clientHeight, cx = C[0] * W, cy = H - C[1] * H, rx = 1.75 * RR * H, ry = .42 * RR * H;
      pills.forEach((el, i) => {
        const th = i / pills.length * Math.PI * 2 + t * .18 - 1.2, lx = rx * Math.cos(th), ly = ry * Math.sin(th);
        const wx = lx * Math.cos(TL) + ly * Math.sin(TL), wy = -lx * Math.sin(TL) + ly * Math.cos(TL);
        const x = cx + wx, y = cy - wy, behind = ly > 0 && Math.hypot(wx, wy) < RR * H;
        el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.opacity = behind ? .18 : 1; el.style.zIndex = ly > 0 ? 1 : 2;
      });
    };
  });

  acc('dta-cards', 'Product card headers', 'One card per product with its symbol (// <> {:} :/) dithered into the header in the product colour, over a faint cloud texture in its tint. The symbol is dense at the foot and dissolves upwards. Hover a header.', (root, P) => {
    const grid = h('div', { class: 'pc-grid' }); root.appendChild(grid);
    for (const pr of PROD) {
      const head = h('div', { class: 'pc-h' });
      grid.appendChild(h('div', { class: 'pc', style: `--c:${pr.c};--t2:${tint(pr.c, .955)}` }, head, h('div', { class: 'pc-b' }, h('h3', null, pr.name), h('p', null, pr.text), h('a', { href: '#', onclick: e => e.preventDefault() }, 'Learn more →'))));
      let box = [0, 1];
      P.push(mk(head, () => ({ field: 'clouds', p: [2.2, .42, .9, .6], q: [0, .4, .45, 0], method: 'bayer', cell: 2.5, a: tint(pr.c, .78), b: pr.c, two: .55, gain: .5, maskMode: 2, mg: 1, mgy: 1, mbox: box }), {
        pointer: true, onResize: (w, hh, dpr, pn) => { box = textMask(pn, w, hh, pr.sym, `800 ${Math.round(hh * .62)}px "JetBrains Mono", monospace`, w / 2, hh * .74, 'center'); },
      }));
    }
  });

  acc('dta-dissolve', 'Dissolving edges', 'A product window that dissolves into the block instead of being cropped or faded with an alpha gradient: a dither layer in the ground colour sits over its lower half. Below: blue noise on grey, and a card dissolving into a blue block.', (root, P) => {
    const viz = h('div', { class: 'viz', style: 'aspect-ratio:7/5' });
    viz.appendChild(h('div', { class: 'win' }, h('div', { class: 'tb' }, h('s'), h('s'), h('s'), h('span', null, 'iframely.com/try?url=youtu.be/…')), h('div', { class: 'md' }), h('div', { class: 'ln a' }), h('div', { class: 'ln b' }), h('div', { class: 'ln c' })));
    const er = h('div', { class: 'erase' }); viz.appendChild(er);
    root.appendChild(h('div', { class: 'dx white' }, copy('// Rich Media', 'Responsive players without the work', 'Iframely wraps each provider’s player so it scales with your layout and loads only when needed.', 'Get an API key'), viz));
    const fade = (a, method, cell) => ({ field: 'linear', p: [-Math.PI / 2, .08, .9, 0], q: [.18, .25, 0, 0], method, cell, a });
    P.push(mk(er, fade('#ffffff', 'bayer', 3)));
    const row = h('div', { class: 'dt-row c2' }); root.appendChild(row);
    for (const [bgc, label, method, cell] of [[GREY, 'blue noise, grey ground', 'ign', 2.5], [BLUE, 'halftone, blue ground', 'halftone', 7]]) {
      const b = tile(row, bgc, label); b.style.aspectRatio = '16/9';
      b.appendChild(h('div', { class: 'ecard' }, h('div', { class: 'md' }), h('div', { class: 'ln a' }), h('div', { class: 'ln b' })));
      const e = h('div', { class: 'erase', style: 'height:70%' }); b.appendChild(e); P.push(mk(e, fade(bgc, method, cell)));
    }
  });

  acc('dta-sections', 'Section transitions', 'Instead of a hard edge between a white, a blue and a grey section, a 56 px band dithers one into the other: Bayer in big cells, halftone dots that close up, and a slash screen. Each band fully covers at its far edge, so it joins without a seam.', (root, P) => {
    const wrap = h('div', { class: 'secs' }); root.appendChild(wrap);
    const sec = (cls, eb, title, btn) => h('div', { class: 'sec ' + cls }, h('div', null, h('div', { class: 'eb' }, eb), h('h3', null, title)), btn ? h('a', { class: 'b1', href: '#', onclick: e => e.preventDefault(), style: cls === 'blue' ? 'background:#fff;color:' + BLUE : '' }, btn) : null);
    const band = (from, to, method, cell, label) => { const b = h('div', { class: 'band', style: 'background:' + from }, h('span', { class: 'lab' }, label)); wrap.appendChild(b); P.push(mk(b, w2({ field: 'linear', p: [-Math.PI / 2, .02, .98, 0], q: [.25, .2, 0, 0], method, cell, a: to }, c => (to === BLUE ? { c, hue: { mode: 'noise', p: [2.2, .55, .7, 0] } } : {})), { before: true })); };
    wrap.appendChild(sec('white', '// for developers', 'One URL in, everything you need out'));
    band('#ffffff', BLUE, 'bayer', 4, 'white → blue · Bayer 4 px');
    wrap.appendChild(sec('blue', ':// ready when you are', 'Make URLs work in your product', 'Get an API key'));
    band(BLUE, GREY, 'halftone', 7, 'blue → grey · halftone');
    wrap.appendChild(sec('grey', '<> for publishers', 'Decide how other apps show your content'));
    band(GREY, '#ffffff', 'lines', 6, 'grey → white · slash lines');
    wrap.appendChild(sec('white', '// changelog', 'What’s new in Iframely'));
  });

  acc('dta-stats', 'Stats with dithered shadows', 'Big numerals with an offset shadow made of dither instead of a blur or a solid copy: Bayer, slash lines and halftone, each fading upwards inside the glyphs. Hover a number to push more ink into it.', (root, P) => {
    const st = h('div', { class: 'stats' });
    root.appendChild(h('div', { class: 'dx grey', style: 'grid-template-columns:1fr' }, h('div', null, h('div', { class: 'eb' }, ':// since 2012'), h('h2', { style: 'margin-bottom:0' }, 'Holding the web together since 2012')), st));
    /* row 2 (user, 2026-11-05: "add glyphs versions"): the same shadow written in //:<> glyphs at three cell sizes */
    const st2 = h('div', { class: 'stats' }); st.parentNode.appendChild(st2);
    const S = [['1,900+', 'providers with maintained embeds', 'bayer', 2.5], ['2012', 'the year the first URL went through', 'lines', 4], ['4', 'products on one API key', 'halftone', 4.5],
      ['1,900+', 'providers with maintained embeds', 'glyphs', 6, 'glyphs · 6 px'], ['2012', 'the year the first URL went through', 'glyphs', 8, 'glyphs · 8 px'], ['4', 'products on one API key', 'glyphs', 11, 'glyphs · 11 px']]; /* larger cells leave too few glyphs inside an 88 px stroke */
    for (const [num, lab, method, cell, tag] of S) {
      const sb = h('div', { class: 'sbox' }); (tag ? st2 : st).appendChild(h('div', { class: 'stat' }, sb, h('p', null, lab), h('div', { class: 'eb' }, tag || method)));
      let box = [0, 1], geo = null;
      /* glyphs cover little of a cell, so they get more mask strength (mg) to reach the heavier glyphs inside the strokes */
      P.push(mk(sb, w2(() => ({ field: 'flat', p: [0, 0, 0, 0], q: [0, 0, .5, 0], method, cell, a: BLUE, b: BLUE, two: method === 'glyphs' ? .8 : 1, maskMode: 2, mg: method === 'glyphs' ? 1.35 : .95, mgy: 1, mbox: box, maskOff: [7, -7] }), c => ({ c, d: c, hue: { mode: 'all' } })), {
        pointer: true, still: true,
        onResize: (w, hh, dpr, pn) => { geo = { f: `600 ${Math.round(88 * dpr)}px Geist, Inter, sans-serif`, x: 2 * dpr, y: hh - 18 * dpr }; box = textMask(pn, w, hh, num, geo.f, geo.x, geo.y); },
        after: (ctx) => { if (!geo) return; ctx.font = geo.f; ctx.fillStyle = INK; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.fillText(num, geo.x, geo.y); },
      }));
    }
  });

  acc('dta-highlight', 'Highlights and underlines', 'A dithered marker behind a key word, ragged and dissolving at both ends, and a dithered underline under a phrase. Shown on white, grey and blue. Hover the words.', (root, P) => {
    const rows = h('div', { class: 'hl-rows' }); root.appendChild(rows);
    const marker = (a, b) => ({ field: 'bar', p: [0, .55, 1.0, .72], q: [.35, .3, .4, 0], method: 'bayer', cell: 2.5, a, b, two: .78 });
    const under = (a) => ({ field: 'bar', p: [0, .35, 1.0, 1], q: [.4, .3, .4, 0], method: 'bayer', cell: 2, a });
    const R3 = [
      ['white', ['Iframely makes ', ['hl', 'URLs'], ' work inside ', ['ul', 'other products']], ['#cddcff', '#9db9ff'], BLUE],
      ['grey', ['Show ', ['hl', 'previews'], ' of any link your ', ['ul', 'users share']], ['#d2ddf7', '#a8c0f5'], BLUE],
      ['blue', ['Decide how other apps use ', ['hl', 'your content']], ['#3f7fff', '#6f9fff'], '#ffffff'],
    ];
    for (const [cls, parts, [a, b], ul] of R3) {
      const h2 = h('h2');
      for (const p of parts) {
        if (typeof p === 'string') { h2.append(p); continue; }
        const sp = h('span', { class: p[0] }, p[1]); h2.appendChild(sp);
        const ground = cls === 'blue' ? BLUE : cls === 'grey' ? GREY : '#ffffff';
        P.push(mk(sp, p[0] === 'hl' ? w2(marker(a, b), c => ({ c: mixHex(ground, c, cls === 'blue' ? .55 : .28), d: mixHex(ground, c, cls === 'blue' ? .75 : .5), hue: { mode: 'all' } })) : under(ul), { pointer: true, pointerEl: sp }));
      }
      rows.appendChild(h('div', { class: 'hl-row ' + cls }, h2));
    }
  });

  acc('dta-buttons', 'Buttons, chips and tags', 'Small UI accents. Buttons fill with a dither sweep on hover (glyphs in the primary, Bayer in the secondary); product chips carry a dithered swatch that fades into the tint; tags get a glyph texture.', (root, P) => {
    const sweep = (a, method, cell, b) => (t, pn) => { const s = pn.hover; return { field: 'linear', p: [Math.PI, 1.05 - s * 1.35, 1.35 - s * 1.35, 0], q: [.25, .5, 0, 0], method, cell, a, b, two: .85 }; };
    for (const cls of ['white', 'blue']) {
      const row = h('div', { class: 'brow ' + cls }); root.appendChild(row);
      const b1 = h('a', { class: 'b1', href: '#', onclick: e => e.preventDefault() }, 'Get an API key'), b2 = h('a', { class: 'b2', href: '#', onclick: e => e.preventDefault() }, 'Read the docs');
      row.append(b1, b2);
      P.push(mk(b1, w2(sweep(cls === 'blue' ? '#c9d8ff' : '#6f9dff', 'glyphs', 10, cls === 'blue' ? '#9fbaff' : '#ffffff'), c => ({ c: cls === 'blue' ? '#c9d8ff' : '#6f9dff', d: cls === 'blue' ? c : mixHex('#ffffff', c, .55), two: .7, hue: { mode: 'all' } })), { pointer: true, before: true }));
      P.push(mk(b2, sweep(cls === 'blue' ? '#2a70ff' : '#dfe8ff', 'bayer', 2.5), { pointer: true, before: true }));
      if (cls === 'white') for (const pr of PROD) {
        const c = h('span', { class: 'chip', style: `--c:${pr.c};--t:${tint(pr.c, .9)}` }, h('b', null, pr.sym), pr.name); row.appendChild(c);
        P.push(mk(c, { field: 'linear', p: [Math.PI, .25, 1.0, 0], q: [.3, .3, .5, 0], method: 'bayer', cell: 2, a: tint(pr.c, .55), b: pr.c, two: .7 }, { pointer: true, before: true }));
      } else for (const [txt, bgc] of [['// new', INK], [':// beta', '#003fcc'], ['<> API', '#002d99']]) {
        const tg = h('span', { class: 'tag', style: 'background:' + bgc }, txt); row.appendChild(tg);
        P.push(mk(tg, { field: 'linear', p: [Math.PI, .1, 1.3, 0], q: [.3, .6, .6, 0], method: 'glyphs', cell: 8, a: ['#ffffff', .22], b: ['#ffffff', .4], two: .9 }, { pointer: true, before: true }));
      }
    }
  });

  acc('dta-cta', 'CTA corners', 'Call-to-action cards with a dithered corner that the pointer can stir: //:<> glyphs radiating from the bottom-right of a blue card, and slash marks on a grey one.', (root, P) => {
    const wrap = h('div', { class: 'ctas' }); root.appendChild(wrap);
    const card = (cls, eb, title, text, btn) => { const c = h('div', { class: 'cta ' + cls }, h('div', { class: 'in' }, h('div', { class: 'eb' }, eb), h('h3', null, title), h('p', null, text), h('a', { class: 'b1', href: '#', onclick: e => e.preventDefault() }, btn))); wrap.appendChild(c); return c; };
    const c1 = card('blue', ':// get started', 'Try it with any link', 'Paste a URL and see what Iframely returns, then grab an API key.', 'Get an API key');
    P.push(mk(c1, { field: 'radial', p: [1.02, -.05, 1.0, 1.3], q: [.3, .35, .55, 0], method: 'glyphs', cell: 13, a: '#5a92ff', b: '#ffffff', two: .78 }, { pointer: true, before: true }));
    P[P.length - 1].spec = w2(P[P.length - 1].spec, c => ({ c: '#5a92ff', d: mixHex('#ffffff', c, .45), two: .7, hue: { mode: 'all' } }));
    const c2 = card('grey', '<> for publishers', 'Your content, your rules', 'Decide which apps can embed and preview your pages, and how.', 'Open the Console');
    P.push(mk(c2, { field: 'radial', p: [1.02, -.05, 1.0, 1.3], q: [.3, .35, .55, 0], method: 'marks', cell: 9, a: '#b3c8f7', b: BLUE, two: .75 }, { pointer: true, before: true }));
    P[P.length - 1].spec = w2(P[P.length - 1].spec, c => ({ c: '#b3c8f7', d: c, hue: { mode: 'all' } }));
  });
})();
