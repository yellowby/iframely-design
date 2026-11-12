/* K · Publisher colour: the developer products run in hue order, blue → violet → orchid (220°, 254°, 284°), and the
   Publisher Console's green (154°) sits apart from them. Candidates for its place, each with a solid, a mid (icon fill)
   and a tint (badge and chip ground); every solid passes 4.5:1 on its tint and on white. The section scenes read the
   colour from --pub-m / --pub-mid / --pub-t (demos/sec.js), so both cards set those on a wrapper. Group 'pal'. */
(() => {
  const { h } = DEMOS;
  const PUB = [
    { k: 'green', label: 'Green (before)', m: '#007a45', mid: '#7fd3aa', t: '#e2f6ec', note: 'The colour before 2026-10-30. Reads as “allowed” next to the Console’s shields, and as a second family beside three cool hues.' },
    { k: 'teal', label: 'Teal', m: '#00768a', mid: '#7ccbd6', t: '#e0f3f6', note: 'Moves the green 35° toward the blue so all four are cool. Publishers stay apart without a jump; the closest to the current feel.' },
    { k: 'magenta', label: 'Magenta (now)', m: '#c81d77', mid: '#f193c3', t: '#fdecf5', note: 'Continues the run: 220°, 254°, 284°, 328°, about one step further each time. The four read as one family, publishers at the warm end.' },
    { k: 'raspberry', label: 'Raspberry', m: '#c81e52', mid: '#f194ae', t: '#fdecf1', note: 'One step past magenta (342°): still in the family, more clearly its own colour. Close to red, so keep it off error states.' },
    { k: 'coral', label: 'Coral', m: '#c7381a', mid: '#f5a690', t: '#fdede8', note: 'The warm side across from the developer products (10°): the other side of the URL. Strongest separation; red-adjacent.' },
    { k: 'amber', label: 'Amber', m: '#a65400', mid: '#f2bb78', t: '#fdf2e4', note: 'Warm and calm (30°), far from every other hue and from red. Has to be dark to pass on white, so it reads brown in small text.' },
  ];
  const vars = c => `--pub-m:${c.m};--pub-mid:${c.mid};--pub-t:${c.t}`;
  const lum = x => { const c = [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return ((x + .05) / (y + .05)).toFixed(1); };
  const hue = x => { const [r, g, b] = [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b); if (!d) return 0; const v = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return Math.round((v * 60 + 360) % 360); };
  const FIXED = { rich: '#0055ff', preview: '#6a3bff', data: '#a52fd0' };
  const CSS = `
.kp{font-family:Geist,Inter,sans-serif;color:#0b1533;padding:72px 48px 48px;background:#fff}
.kp-row{display:grid;grid-template-columns:200px 1fr;gap:28px;padding:22px 0;border-top:1px solid #e3e7ef}
.kp-row:first-child{border-top:0;padding-top:0}
.kp-name{font-size:17px;font-weight:600;letter-spacing:-.01em}
.kp-name small{display:block;font:12px 'Geist Mono',ui-monospace,monospace;color:#8a93a8;margin-top:4px;font-weight:400}
.kp-note{font-size:13px;line-height:1.5;color:#5b6680;margin-top:10px}
.kp-main{display:grid;gap:16px;min-width:0}
.kp-sw{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.kp-sw div{border-radius:10px;height:64px;padding:9px 11px;display:flex;flex-direction:column;justify-content:space-between;color:#fff;font:500 12px 'Geist Mono',ui-monospace,monospace}
.kp-sw div span{opacity:.8;font-weight:400}
.kp-line{display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px}
.kp-wheel{position:relative;height:10px;border-radius:5px;background:linear-gradient(90deg,hsl(0 80% 55%),hsl(60 80% 55%),hsl(120 80% 45%),hsl(180 80% 45%),hsl(240 80% 60%),hsl(300 80% 55%),hsl(360 80% 55%));opacity:.25}
.kp-dots{position:relative;height:18px;margin-top:-14px}
.kp-dots i{position:absolute;top:0;width:18px;height:18px;margin-left:-9px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #e3e7ef}
.kp-cr{font:12px 'Geist Mono',ui-monospace,monospace;color:#8a93a8}
.kp-cr b{color:#0b1533;font-weight:500}
.kp-bar{display:flex;gap:6px;flex-wrap:wrap;margin:0 auto 18px;max-width:1200px;padding:0 4px}
.kp-bar button{font:500 13px Geist,Inter,sans-serif;padding:7px 12px 9px;border-radius:8px;border:1px solid #e3e7ef;background:#fff;color:#0b1533;cursor:pointer}
.kp-bar button.on{border-color:#0b1533}
.kp-ctx{padding-top:64px;background:#fff}
`;
  const css = () => { if (!document.getElementById('css-kp')) document.head.appendChild(h('style', { id: 'css-kp' }, CSS)); };

  DEMOS.register('pal-pub-sheet', {
    group: 'pal', title: 'Publisher colour · six candidates side by side',
    blurb: 'Each row puts one Publisher Console colour next to the three fixed developer colours: solids with hex and hue, where the four sit on the colour wheel, the badges and tags as the section scenes draw them, and the contrast of the solid on white and on its tint (4.5:1 is the floor). Magenta is the current colour (since 2026-10-30); green was the one before.',
    mount(stage) {
      const K = DEMOS.secKit; K.ensure(); K.xEnsure(); css();
      const rows = PUB.map(c => {
        const all = Object.assign({}, FIXED, { pub: c.m });
        return h('div', { class: 'kp-row', style: vars(c) },
          h('div', null, h('div', { class: 'kp-name' }, c.label, h('small', null, `${c.m} · ${hue(c.m)}°`)), h('p', { class: 'kp-note' }, c.note)),
          h('div', { class: 'kp-main' },
            h('div', { class: 'kp-sw', html: K.KEYS.map(k => `<div style="background:${all[k]}">${K.PROD[k].name}<span>${all[k]} · ${hue(all[k])}°</span></div>`).join('') }),
            h('div', null, h('div', { class: 'kp-wheel' }), h('div', { class: 'kp-dots', html: K.KEYS.map(k => `<i style="left:${hue(all[k]) / 3.6}%;background:${all[k]}"></i>`).join('') })),
            h('div', { class: 'kp-line', html: K.KEYS.map(k => `<span class="sx-badge" style="--m:${K.PROD[k].main};--t:${K.PROD[k].tint}">${K.icon(k, 18)}${K.PROD[k].name}</span>`).join('') }),
            h('div', { class: 'kp-line' }, ...K.KEYS.map(k => { const t = K.tagEl(k); t.style.cssText = `--m:${K.PROD[k].main}`; return t; })),
            h('div', { class: 'kp-cr', html: `on white <b>${ratio(c.m, '#ffffff')}</b> · on its tint <b>${ratio(c.m, c.t)}</b>` })));
      });
      stage.appendChild(h('div', { class: 'sx kp' }, ...rows));
    },
  });

  const KEY = 'pal-pub'; let cur = 'magenta';
  try { cur = localStorage.getItem(KEY) || cur; } catch (e) {}
  if (!PUB.some(c => c.k === cur)) cur = 'magenta';
  DEMOS.register('pal-pub-home', {
    group: 'pal', title: 'Publisher colour · in the S28 home top',
    blurb: 'S28 as it is, with the Publisher Console colour switched by the buttons: the rail line, the window outline while it answers, the layer bars and rule highlight in the Console window, the badge icon, tag and link under it. The Allowed shield and the stats icons stay green, since they mean “allowed” and “working” rather than the product.',
    mount(stage) {
      css(); const wrap = h('div', { class: 'kp-ctx' }), host = h('div');
      const btns = PUB.map(c => { const b = h('button', { type: 'button', 'data-k': c.k, style: `box-shadow:inset 0 -3px 0 ${c.m}` }, c.label); b.addEventListener('click', () => { cur = c.k; try { localStorage.setItem(KEY, cur); } catch (e) {} set(); }); return b; });
      const set = () => { const c = PUB.find(x => x.k === cur); wrap.style.cssText = vars(c); btns.forEach(b => b.classList.toggle('on', b.dataset.k === cur)); };
      wrap.append(h('div', { class: 'kp-bar' }, ...btns), host); stage.appendChild(wrap); set();
      return DEMOS.mount(host, 'sec-hero-field-copy');
    },
  });
})();
