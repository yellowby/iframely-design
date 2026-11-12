/* bg-ascii / bg-blocks / bg-braille · the dither gradient (B01) drawn with terminal characters.
   A glyph ramp is rendered once to a small canvas atlas; the WebGL2 shader quantises the same drifting noise field
   into a glyph index per cell and samples the atlas. Same pointer lamp as B01. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover; uniform float u_dpr;
uniform sampler2D u_atlas; uniform float u_n; uniform vec2 u_cell; uniform int u_mode;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3;
out vec4 o;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1)); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
float ga(float x, vec2 local){ float idx = floor(clamp(x,0.0,1.0)*(u_n-0.001)); return texture(u_atlas, vec2((idx+local.x)/u_n, local.y)).a; }
void main(){
  vec2 cell = floor(gl_FragCoord.xy/u_cell); vec2 cc = (cell+0.5)*u_cell; vec2 uv = cc/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  float n = fbm(q*1.5 + vec2(u_time*0.045, -u_time*0.03));
  float v = smoothstep(0.3, 0.8, n)*0.95 + 0.22*(uv.x*0.5 + (1.0-uv.y)*0.5) - 0.12;
  vec2 m = (cc - u_mouse)/u_res.y; float d2 = dot(m,m); float lamp = exp(-d2*14.0);
  v += u_hover*(0.75*lamp - 1.1*exp(-d2*70.0));
  v = clamp(v, 0.0, 1.0);
  vec2 local = fract(gl_FragCoord.xy/u_cell);
  vec3 col = u_c0;
  if (u_mode == 1) {
    col = mix(col, u_c3, ga(v, local));
    col = mix(col, u_c2, ga((v-0.6)*2.5, local));
  } else {
    float a = ga(v, local);
    vec3 glyph = (u_mode == 0) ? mix(u_c1, u_c2, smoothstep(0.55, 0.9, v)) : mix(u_c2, u_c1, smoothstep(0.6, 1.0, v));
    glyph = mix(glyph, u_c2, u_hover*lamp*0.6);
    col = mix(col, glyph, a);
  }
  o = vec4(col, 1.0);
}`;
  function make(name, title, blurb, opt) {
    DEMOS.register(name, {
      group: 'bg', title, blurb, overlay: '',
      mount(host) {
        const { P, rgb, h } = DEMOS;
        const c = h('canvas', { class: 'fill' }); host.appendChild(c);
        let S; try { S = DEMOS.shader(c, FS, { maxDpr: 2 }); } catch (e) { console.error(e); }
        if (!S) return DEMOS.fallback(host);
        const gl = S.gl; const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(S.u('u_atlas'), 0); gl.uniform1i(S.u('u_mode'), opt.mode);
        const glyphs = [...opt.ramp]; const N = glyphs.length; let atlasDpr = 0;
        function atlas(dpr) {
          const cw = Math.round(opt.cw * dpr), ch = Math.round(opt.ch * dpr);
          const a = document.createElement('canvas'); a.width = cw * N; a.height = ch; const x = a.getContext('2d');
          x.fillStyle = '#fff'; x.font = Math.round(opt.size * dpr) + 'px ' + opt.font; x.textAlign = 'center'; x.textBaseline = 'middle';
          glyphs.forEach((g, i) => x.fillText(g, i * cw + cw / 2, ch / 2));
          gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, a); atlasDpr = dpr;
        }
        if (document.fonts && document.fonts.load) document.fonts.load('16px ' + opt.font).then(() => { atlasDpr = 0; }).catch(() => {});
        const p = DEMOS.pointer(host); let hover = 0;
        const L = DEMOS.loop(host, t => {
          const dpr = S.resize(); if (atlasDpr !== dpr) atlas(dpr); p.smooth(.1); hover += ((p.inside ? 1 : 0) - hover) * .06;
          S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover);
          S.set.v2('u_mouse', p.sx * dpr, c.height - p.sy * dpr);
          S.set.v2('u_cell', Math.round(opt.cw * dpr), Math.round(opt.ch * dpr)); S.set.f('u_n', N);
          S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.ink)); S.set.v3('u_c2', rgb(P.accent)); S.set.v3('u_c3', rgb(opt.c3 || P.pink));
          S.draw();
        });
        return () => { L.destroy(); p.destroy(); gl.deleteTexture(tex); S.destroy(); c.remove(); };
      },
    });
  }
  const MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
  const JB = '"JetBrains Mono", "Geist Mono", ui-monospace, Menlo, Consolas, monospace';
  make('bg-ascii', 'ASCII dither', 'B01 drawn with terminal characters: the same drifting field, quantised into a ten-glyph ramp (space to @) from a Geist Mono atlas that the shader samples per 8 × 14 cell. Ink turns cobalt where the field is densest and under the pointer lamp, which clears the glyphs beneath it. WebGL2 plus a 176 × 28 glyph texture.', { ramp: ' .·:-=+*#%@', font: MONO, cw: 8, ch: 14, size: 13, mode: 0 });
  make('bg-blocks', 'Block shade', 'Terminal shading blocks (░ ▒ ▓ █) as the dither: a pink layer for the field and a cobalt layer for its densest part, exactly B01’s three tones but with a 9 × 16 character cell instead of a 3px one. Reads as a text-mode screen from the nineties, in the palette.', { ramp: ' ░▒▓█', font: JB, cw: 9, ch: 16, size: 15, mode: 1 });
  make('bg-braille', 'Braille field', 'Braille patterns as a dot-matrix ramp, one to eight dots per cell: cobalt dots that turn to ink where the field peaks. A printout from across the room, a dot grid up close; the pointer lamp lights it cobalt.', { ramp: '⠀⠁⠃⠇⡇⡧⡷⡿⣿', font: JB, cw: 8, ch: 14, size: 13, mode: 2 });
})();
