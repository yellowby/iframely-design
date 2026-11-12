/* bg-ripple · signal rings on a faint grid. Moving the pointer or pressing spawns rings; idle, the field spawns its own. WebGL2. */
(() => {
  const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover; uniform float u_dpr;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2;
uniform vec2 u_rp[8]; uniform float u_rt[8];
out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy/u_res; float asp = u_res.x/u_res.y; vec2 q = vec2(uv.x*asp, uv.y);
  float ink = 0.0;
  for (int i=0;i<8;i++){
    float age = u_time - u_rt[i]; if (age < 0.0 || age > 4.5) continue;
    vec2 c = vec2(u_rp[i].x*asp, u_rp[i].y); float d = length(q-c); float R = age*0.3; float w = 0.003 + 0.0018*age;
    float fade = pow(1.0-age/4.5, 1.6);
    float r1 = 1.0-smoothstep(0.0,w,abs(d-R)); float r2 = 1.0-smoothstep(0.0,w,abs(d-R*0.78)); float r3 = 1.0-smoothstep(0.0,w,abs(d-R*0.58));
    ink = max(ink, max(r1, max(r2*0.75, r3*0.5))*fade);
  }
  float cell = 24.0*u_dpr; vec2 gp = gl_FragCoord.xy/cell; vec2 gf = abs(fract(gp)-0.5); float gl = 0.5 - max(gf.x, gf.y);
  float grid = 1.0 - smoothstep(0.0, 1.2/cell, gl);
  vec3 col = mix(u_c0, u_c1, grid*0.08);
  col = mix(col, u_c2, ink);
  float pd = length(gl_FragCoord.xy - u_mouse)/u_dpr; col = mix(col, u_c2, (1.0-smoothstep(3.0,4.5,pd))*u_hover);
  o = vec4(col, 1.0);
}`;
  DEMOS.register('bg-ripple', {
    group: 'bg', title: 'Signal rings', overlay: '',
    blurb: 'Concentric cobalt rings expand from wherever the pointer moves or presses, fading over four seconds on a faint 24px grid; left alone, the field keeps sending its own pings. A “one request, many responses” metaphor. WebGL2.',
    mount(host) {
      const { P, rgb } = DEMOS;
      const c = DEMOS.h('canvas', { class: 'fill' }); host.appendChild(c);
      let S; try { S = DEMOS.shader(c, FS); } catch (e) { console.error(e); }
      if (!S) return DEMOS.fallback(host);
      const p = DEMOS.pointer(host); let hover = 0;
      const rp = new Float32Array(16), rt = new Float32Array(8).fill(-100); let ri = 0, lastSpawn = -10, lx = -1, ly = -1, lastMoved = 0, wasDown = false;
      const spawn = (x, y, t) => { rp[2 * ri] = x; rp[2 * ri + 1] = y; rt[ri] = t; ri = (ri + 1) % 8; lastSpawn = t; lx = x; ly = y; };
      const L = DEMOS.loop(host, t => {
        const dpr = S.resize(); p.smooth(.3); hover += ((p.inside ? 1 : 0) - hover) * .1;
        if (p.inside) {
          const nx = p.nx, ny = 1 - p.ny; const moved = p.moved !== lastMoved; lastMoved = p.moved;
          const far = Math.hypot(nx - lx, ny - ly) > .04;
          if (p.down && !wasDown) spawn(nx, ny, t); else if (moved && far && t - lastSpawn > .28) spawn(nx, ny, t);
        } else if (t - lastSpawn > 1.7) spawn(.15 + Math.random() * .7, .15 + Math.random() * .7, t);
        wasDown = p.down;
        S.set.v2('u_res', c.width, c.height); S.set.f('u_time', t); S.set.f('u_dpr', dpr); S.set.f('u_hover', hover);
        S.set.v2('u_mouse', p.sx * dpr, c.height - p.sy * dpr);
        S.set.v3('u_c0', rgb(P.bg)); S.set.v3('u_c1', rgb(P.ink)); S.set.v3('u_c2', rgb(P.accent));
        S.set.v2v('u_rp', rp); S.set.fv('u_rt', rt);
        S.draw();
      });
      return () => { L.destroy(); p.destroy(); S.destroy(); c.remove(); };
    },
  });
})();
