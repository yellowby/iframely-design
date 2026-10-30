/* logo-* second set (L08–L14): more scenes for the //iframely mark, same idea — the two slashes are the slashes of a URL.
   Uses DEMOS.logoKit from demos/logo.js (shared CSS tokens, tween, caret). */
(() => {
  const K = DEMOS.logoKit, JB = K.JB;
  const CSS = `
/* L08 unfurl */
.uf{position:absolute;inset:0;background:var(--lg-bg2);display:grid;place-items:center}
.uf-win{position:relative;width:min(560px,82%);background:#fff;border:1px solid var(--lg-line);border-radius:16px;padding:18px 20px 20px;box-shadow:0 14px 44px -26px rgba(0,0,0,.35);font:400 15px/1.5 var(--sans)}
.uf-msg{display:flex;gap:12px}.uf-av{width:34px;height:34px;border-radius:50%;background:#fadbe5;flex:none;display:grid;place-items:center;font:600 13px var(--sans)}
.uf-who{font-weight:600;font-size:14px}.uf-who span{font-weight:400;color:#9a9a9a;font-size:12px;margin-left:6px}
.uf-txt{min-height:1.5em;overflow-wrap:anywhere}.uf-url{font-family:${JB};font-size:.9em;color:#0a0a0a;text-decoration:underline;text-decoration-color:#cfcfcf;text-underline-offset:3px}
.uf-url .sl{font-weight:800;transition:color .3s}.uf-url.lit .sl{color:var(--logo)}
.uf-card{display:grid;grid-template-rows:0fr;transition:grid-template-rows .7s cubic-bezier(.6,0,.2,1),margin .7s;margin-top:0}
.uf-card.open{grid-template-rows:1fr;margin-top:12px}
.uf-card>div{overflow:hidden;min-height:0}
.uf-in{border:1px solid var(--lg-line);border-radius:12px;overflow:hidden}
.uf-th{aspect-ratio:16/7;display:grid;place-items:center;position:relative}
.uf-th.play{background:#0a0a0a}.uf-th.play::after{content:"";border-left:22px solid #fff;border-top:14px solid transparent;border-bottom:14px solid transparent;margin-left:6px}
.uf-th.read{background:linear-gradient(135deg,#d8e7ff,#e4e3fb)}
.uf-th.audio{background:#fadbe5;display:flex;align-items:center;justify-content:center;gap:4px}.uf-th.audio i{width:5px;border-radius:3px;background:#0a0a0a}
.uf-meta{padding:10px 14px 12px;display:flex;align-items:flex-end;gap:12px}
.uf-meta .t{font-weight:600;font-size:14px;line-height:1.3}.uf-meta .d{font-size:12px;color:#8a8a8a;margin-top:2px}
.uf-badge{margin-left:auto;font-size:12px;opacity:0;transition:opacity .2s;flex:none}.uf-badge.on{opacity:1}.uf-badge .w{color:#8a8a8a;font-weight:500}
.uf-fly{position:absolute;left:0;top:0;font-family:${JB};font-weight:800;color:var(--logo);pointer-events:none;transform-origin:0 0;z-index:3;white-space:pre}

/* L09 wipe */
.wp{position:absolute;inset:0}
.wp-sl{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:0 clamp(20px,8cqw,110px)}
.wp-sl.w{background:#fff}.wp-sl.g{background:#f3f6ff}.wp-sl.k{background:#0a0a0a;color:#fff}
.wp-sl .u{font-size:clamp(13px,1.6cqw,20px)}.wp-sl .u .p{font-weight:500;opacity:.55}.wp-sl .u .p i{font-style:normal;color:var(--logo);font-weight:800;opacity:1}
.wp-sl.k .lg .host{color:#fff}
.wp-sl h3{margin:0;font:600 clamp(30px,7cqw,96px)/1 var(--sans);letter-spacing:-.035em}
.wp-sl p{margin:0;max-width:38ch;color:#777;font-size:clamp(13px,1.5cqw,18px)}.wp-sl.k p{color:#9a9a9a}
.wp-bar{position:absolute;inset:0;background:var(--logo);pointer-events:none}

/* L11 split-flap */
.fl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(14px,3cqw,30px)}
.fl-row{display:flex;gap:clamp(3px,.5cqw,6px)}
.fl-c{position:relative;width:clamp(26px,6.6cqw,84px);aspect-ratio:.72;border-radius:clamp(4px,.7cqw,9px);background:#141414;color:#fff;display:grid;place-items:center;font:700 clamp(22px,5.4cqw,70px)/1 ${JB};overflow:hidden;box-shadow:inset 0 -2px 0 rgba(255,255,255,.04),0 6px 16px -10px rgba(0,0,0,.6)}
.fl-c::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:#000;opacity:.7}
.fl-c.sl{color:var(--logo);font-weight:800}
.fl-c.f span{animation:fl-f .07s ease-in}
@keyframes fl-f{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
.fl-sub{font:500 clamp(11px,1.3cqw,15px) ${JB};letter-spacing:.06em;text-transform:uppercase;color:#8a8a8a;height:1.4em}

/* L12 decode */
.dc{position:absolute;inset:0;display:grid;place-items:center}
.dc-line{font:700 clamp(18px,4.1cqw,56px)/1 ${JB};white-space:pre;color:#c9c9c9}
.dc-line span{display:inline-block;width:1ch;text-align:center;transition:color .25s}
.dc-line .k{color:#0a0a0a}.dc-line .u{color:#7a7a7a;font-weight:400}.dc-line .s{color:var(--logo);font-weight:800}

/* L13 intro stings */
.in{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--lg-line)}
.in-c{position:relative;background:#fff;display:grid;place-items:center;overflow:hidden}
.in-c .tag{position:absolute;left:12px;top:10px;font:500 10px ${JB};letter-spacing:.06em;text-transform:uppercase;color:var(--lg-grey)}
.in-c .lg{font-size:clamp(18px,3.4cqw,44px);display:flex;align-items:baseline}
.in-c .lg span{display:inline-block}
.in-a.go .sl{animation:in-skid .9s cubic-bezier(.2,.9,.2,1.15) both}
@keyframes in-skid{from{transform:translateX(-5em) skewX(-30deg);opacity:0}60%{transform:translateX(.15em) skewX(14deg);opacity:1}to{transform:none}}
.in-a .ch{opacity:0}.in-a.go .ch{animation:in-type .01s linear forwards}
@keyframes in-type{to{opacity:1}}
.in-b.go .ch,.in-b.go .s1,.in-b.go .s2{animation:in-drop .8s cubic-bezier(.3,1.5,.5,1) both}
@keyframes in-drop{from{transform:translateY(-3em);opacity:0}30%{opacity:1}to{transform:none}}
.in-b.go .s1,.in-b.go .s2{animation-name:in-lean;transform-origin:50% 100%}
@keyframes in-lean{from{transform:translateY(-3em) rotate(-60deg);opacity:0}40%{opacity:1}70%{transform:rotate(14deg)}to{transform:none}}
.in-c svg{width:1.2em;height:.95em;overflow:visible;transform:translateY(.11em)}
.in-c svg line{stroke:var(--logo);stroke-width:.14px;stroke-linecap:butt;stroke-dasharray:1.2;stroke-dashoffset:1.2}
.in-d.go svg line{animation:in-draw .45s cubic-bezier(.6,0,.2,1) forwards}.in-d.go svg line+line{animation-delay:.18s}
@keyframes in-draw{to{stroke-dashoffset:0}}
.in-d .w{display:inline-block;overflow:hidden}.in-d .w span{transform:translateY(110%)}
.in-d.go .w span{animation:in-up .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes in-up{to{transform:none}}
@container (max-width:620px){.in{grid-template-columns:1fr}}

/* L14 watching slashes */
.ey{position:absolute;inset:0;display:grid;place-items:center;cursor:crosshair}
.ey .lg{font-size:clamp(40px,11cqw,150px)}
.ey .sl i{display:inline-block;font-style:normal;transform-origin:50% 58%;transition:scale .12s}
.ey.blink .sl i{scale:1 .08}
.ey-dot{position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:var(--logo);transition:opacity .3s;pointer-events:none}
`;
  const ensure = () => { K.ensureCss(); if (!document.getElementById('css-logo2')) document.head.appendChild(DEMOS.h('style', { id: 'css-logo2' }, CSS)); };
  const reflow = el => { el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); };

  DEMOS.register('logo-unfurl', {
    group: 'logo', pick: 'pick · product scene', title: 'Unfurl: the slashes lift out of the link',
    blurb: 'A pasted link in a chat message. Its // light up, the preview card unfolds under the message, and the two slashes fly out of the URL into the card\'s corner as the "//iframely" credit. Three links cycle: a player, an article, a track.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const LINKS = [
        { pre: 'https:', rest: 'youtube.com/watch?v=dQw4w9', th: 'play', t: 'Never Gonna Give You Up (Official Video)', d: 'YouTube · 3:33' },
        { pre: 'https:', rest: 'nytimes.com/2026/10/21/technology/web-glue', th: 'read', t: 'The quiet software that holds the web together', d: 'The New York Times · 6 min read' },
        { pre: 'https:', rest: 'open.spotify.com/track/4uLU6hMC', th: 'audio', t: 'Kerala', d: 'Bonobo · Migration · 4:13' },
      ];
      const txt = h('div', { class: 'uf-txt' }), card = h('div', { class: 'uf-card' });
      const win = h('div', { class: 'uf-win' }, h('div', { class: 'uf-msg' }, h('div', { class: 'uf-av' }, 'A'), h('div', { style: 'min-width:0;flex:1' }, h('div', { class: 'uf-who' }, 'Alex', h('span', null, '10:42')), txt, card)));
      const cap = h('div', { class: 'lg-cap' });
      stage.append(h('div', { class: 'uf' }, win), cap);
      const build = L => {
        const sl = h('span', { class: 'sl' }, ''), pre = h('span', null, ''), rest = h('span', null, '');
        const url = h('span', { class: 'uf-url' }, pre, sl, rest);
        const lead = h('span', null, '');
        txt.replaceChildren(lead, url);
        const th = h('div', { class: 'uf-th ' + L.th }, L.th === 'audio' ? [12, 26, 18, 34, 22, 40, 16, 28, 12, 24, 30, 14, 20, 36, 18].map(v => h('i', { style: 'height:' + v + 'px' })) : null);
        const badge = h('span', { class: 'uf-badge lg' }, h('span', { class: 'sl' }, '//'), h('span', { class: 'w' }, 'iframely'));
        card.replaceChildren(h('div', null, h('div', { class: 'uf-in' }, th, h('div', { class: 'uf-meta' }, h('div', null, h('div', { class: 't' }, L.t), h('div', { class: 'd' }, L.d)), badge))));
        return { lead, pre, sl, rest, url, badge };
      };
      if (DEMOS.reduced) { const E = build(LINKS[0]); E.lead.textContent = 'have you seen this? '; E.pre.textContent = LINKS[0].pre; E.sl.textContent = '//'; E.rest.textContent = LINKS[0].rest; E.url.classList.add('lit'); card.classList.add('open'); E.badge.classList.add('on'); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        let n = 0;
        while (tl.alive) {
          const L = LINKS[n++ % LINKS.length]; card.classList.remove('open'); await tl.wait(500);
          const E = build(L); cap.textContent = 'a link is pasted';
          for (const [el, s] of [[E.lead, 'have you seen this? '], [E.pre, L.pre], [E.sl, '//'], [E.rest, L.rest]]) for (const ch of s) { if (!tl.alive) return; el.textContent += ch; await tl.sleep(el === E.lead ? 22 : 9); }
          await tl.wait(700); E.url.classList.add('lit'); cap.innerHTML = 'the <b>//</b> marks it as a URL';
          await tl.wait(700); card.classList.add('open'); cap.textContent = 'unfurl';
          await tl.wait(900);
          /* fly a copy of the slashes from the URL into the badge */
          const s = stage.getBoundingClientRect(), a = E.sl.getBoundingClientRect(), bEl = E.badge.firstChild, b = bEl.getBoundingClientRect();
          const fly = h('span', { class: 'uf-fly' }, '//'); fly.style.fontSize = getComputedStyle(E.sl).fontSize; stage.appendChild(fly);
          const k = parseFloat(getComputedStyle(bEl).fontSize) / parseFloat(fly.style.fontSize);
          E.sl.style.visibility = 'hidden';
          await K.tween(tl, 900, t => { const x = a.left - s.left + (b.left - a.left) * t, y = a.top - s.top + (b.top - a.top) * t - Math.sin(t * Math.PI) * 60; fly.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + (1 + (k - 1) * t) + ')'; });
          E.badge.classList.add('on'); fly.remove(); E.sl.style.visibility = ''; cap.innerHTML = 'via <b>//</b>iframely';
          await tl.wait(3000);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-wipe', {
    group: 'logo', title: 'Slash wipe: page transitions',
    blurb: 'A page transition drawn with the mark: two blue slashes sweep across at the logo\'s angle and the next page is revealed behind them, with its path in the logo style (//iframely/preview-api). For route changes or for stepping through the products in a hero.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const PAGES = [['w', '', 'URLs that work inside other products', 'Rich media, previews, data and rules for any link.'], ['g', '/embeds', 'Rich Media', 'Players, posts and maps that fit your product.'], ['k', '/preview-api', 'Preview API', 'A title, an image and a reason to click.'], ['w', '/data-api', 'Data API', 'Structured fields from any page, in one call.'], ['g', '/publishers', 'Publishers', 'Decide how your links travel.']];
      const slide = P => h('div', { class: 'wp-sl ' + P[0] }, h('div', { class: 'u lg' }, h('span', { class: 'sl' }, '//'), h('span', { class: 'host' }, 'iframely'), h('span', { class: 'p' }, K.slashy(P[1]))), h('h3', null, P[2]), h('p', null, P[3]));
      const wrap = h('div', { class: 'wp' }); const b1 = h('div', { class: 'wp-bar' }), b2 = h('div', { class: 'wp-bar' });
      stage.append(wrap, h('div', { class: 'lg-cap' }, 'route change'));
      let cur = slide(PAGES[0]); wrap.append(cur, b1, b2); b1.style.clipPath = b2.style.clipPath = 'polygon(0 0,0 0,0 0,0 0)';
      if (DEMOS.reduced) return () => {};
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const strip = (el, x, w, s, H) => { el.style.clipPath = `polygon(${x - w + s / 2}px 0,${x + s / 2}px 0,${x - s / 2}px ${H}px,${x - w - s / 2}px ${H}px)`; };
      (async () => {
        let n = 1;
        while (tl.alive) {
          await tl.wait(2400);
          const next = slide(PAGES[n++ % PAGES.length]); wrap.insertBefore(next, cur);
          const W = stage.clientWidth, H = stage.clientHeight, s = H * Math.tan(20 * Math.PI / 180), w = Math.max(40, W * .07), g = w * .45;
          const from = -s, to = W + s + 2 * w + g;
          await K.tween(tl, 1100, t => {
            const e = from + (to - from) * t;
            cur.style.clipPath = `polygon(${e + s / 2}px 0,${W + s}px 0,${W + s}px ${H}px,${e - s / 2}px ${H}px)`;
            strip(b1, e, w, s, H); strip(b2, e - w - g, w, s, H);
          }, t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
          cur.remove(); cur = next; b1.style.clipPath = b2.style.clipPath = 'polygon(0 0,0 0,0 0,0 0)';
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-field', {
    group: 'logo', pick: 'maybe', title: 'Slash field: a texture of //',
    blurb: 'A hero background made of the mark: a grid of short double strokes at the logo angle. A slow wave turns them; near the pointer they turn toward it, grow and go blue. The logo sits in a clear pocket in the middle.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const cv = DEMOS.canvas2d(stage); const p = DEMOS.pointer(stage);
      const logo = h('div', { class: 'lg', style: 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:clamp(28px,6cqw,80px);background:#fff;padding:.25em .4em;border-radius:.2em' }, h('span', { class: 'sl' }, '//'), 'iframely');
      stage.append(logo, h('div', { class: 'lg-cap' }, 'move the pointer'));
      const BASE = -70 * Math.PI / 180;
      const draw = t => {
        const { w, h: H } = cv.resize(), c = cv.ctx; c.clearRect(0, 0, w, H); p.smooth(.12);
        const step = Math.max(22, Math.min(34, w / 40)), lr = logo.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        const lx0 = lr.left - sr.left - 10, lx1 = lr.right - sr.left + 10, ly0 = lr.top - sr.top - 10, ly1 = lr.bottom - sr.top + 10;
        const px = p.inside ? p.sx : w * (.5 + .32 * Math.cos(t * .4)), py = p.inside ? p.sy : H * (.5 + .3 * Math.sin(t * .55));
        c.lineCap = 'butt';
        for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < w; x += step) {
          if (x > lx0 && x < lx1 && y > ly0 && y < ly1) continue;
          const dx = px - x, dy = py - y, d = Math.hypot(dx, dy), k = Math.max(0, 1 - d / 180);
          const wave = Math.sin(x * .012 + t * .7) * Math.cos(y * .015 - t * .5) * .35;
          let a = BASE + wave;
          if (k > 0) { let target = Math.atan2(dy, dx); let diff = target - a; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); if (diff > Math.PI / 2) diff -= Math.PI; if (diff < -Math.PI / 2) diff += Math.PI; a += diff * k; }
          const len = step * (.32 + .3 * k), ca = Math.cos(a), sa = Math.sin(a), off = step * .13, nx = -sa * off, ny = ca * off;
          c.strokeStyle = k > .05 ? DEMOS.mix('#d6d6d6', '#0055ff', Math.min(1, k * 1.6)) : '#dcdcdc'; c.lineWidth = 1.6 + k * 1.4;
          c.beginPath();
          for (const s of [-1, 1]) { const cx = x + nx * s, cy = y + ny * s; c.moveTo(cx - ca * len / 2, cy - sa * len / 2); c.lineTo(cx + ca * len / 2, cy + sa * len / 2); }
          c.stroke();
        }
      };
      const lp = DEMOS.loop(stage, draw);
      return () => { lp.destroy(); p.destroy(); cv.destroy(); };
    },
  });

  DEMOS.register('logo-flap', {
    group: 'logo', title: 'Split-flap: the slashes stay, the word flips',
    blurb: 'A departures board. The blue // never flip; the letters after them roll through the alphabet to the next destination: //embeds, //previews, //data, //rules, and back to //iframely. Could run small in the header or big in a "what Iframely does" block.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const WORDS = [['iframely', 'iframely'], ['embeds', 'rich media'], ['previews', 'preview api'], ['data', 'data api'], ['rules', 'publisher console']];
      const N = 8, AL = ' abcdefghijklmnopqrstuvwxyz';
      const row = h('div', { class: 'fl-row' }, h('div', { class: 'fl-c sl' }, '/'), h('div', { class: 'fl-c sl' }, '/'));
      const cells = []; for (let i = 0; i < N; i++) { const sp = h('span', null, ' '); const c = h('div', { class: 'fl-c' }, sp); cells.push({ c, sp, ch: ' ' }); row.appendChild(c); }
      const sub = h('div', { class: 'fl-sub' });
      stage.append(h('div', { class: 'fl' }, row, sub));
      const set = (cell, ch) => { cell.ch = ch; cell.sp.textContent = ch; cell.c.classList.remove('f'); void cell.c.offsetWidth; cell.c.classList.add('f'); };
      if (DEMOS.reduced) { [...'iframely'].forEach((ch, i) => set(cells[i], ch)); sub.textContent = 'iframely'; return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        let n = 0;
        while (tl.alive) {
          const [word, label] = WORDS[n++ % WORDS.length]; const target = word.padEnd(N, ' '); sub.textContent = '';
          let busy = true;
          while (busy && tl.alive) {
            busy = false;
            cells.forEach((cell, i) => { if (cell.ch !== target[i]) { busy = true; set(cell, AL[(AL.indexOf(cell.ch) + 1) % AL.length]); } });
            await tl.sleep(55);
          }
          sub.textContent = '//' + word + ' · ' + label;
          await tl.wait(2600);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-decode', {
    group: 'logo', pick: 'pick', title: 'Decode: URLs resolve around fixed slashes',
    blurb: 'Noise resolves left to right into a URL, holds, then everything except the slashes scrambles again and resolves into the next one. The // never move, so the column of slashes is the one constant; every fourth pass the line resolves into //iframely.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const COL = 6, N = 30;
      const LINES = [['https:', 'youtube.com/watch?v=dQw4w9W'], ['http:', 'vimeo.com/76979871'], ['https:', 'open.spotify.com/track/4u'], ['', 'iframely'], ['wss:', 'stream.example.com/live'], ['https:', 'maps.google.com/?q=kyiv'], ['ftp:', 'files.example.org/pub'], ['', 'iframely']];
      const NOISE = 'abcdefghijklmnopqrstuvwxyz0123456789?=&-_.░▒▓';
      const line = h('div', { class: 'dc-line' }); const spans = []; for (let i = 0; i < N; i++) { const s = h('span', null, ' '); spans.push(s); line.appendChild(s); }
      const cap = h('div', { class: 'lg-cap' });
      stage.append(h('div', { class: 'dc' }, line), cap);
      const textOf = ([a, b]) => (a.padStart(COL, ' ') + '//' + b).padEnd(N, ' ').slice(0, N);
      const paint = (str, locked, logo) => spans.forEach((s, i) => { const ch = str[i]; s.textContent = ch; s.className = (i === COL || i === COL + 1) ? 's' : locked[i] ? (logo ? 'k' : 'u') : ''; });
      if (DEMOS.reduced) { paint(textOf(LINES[3]), spans.map(() => true), true); cap.innerHTML = '<b>//</b>iframely'; return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const rnd = () => NOISE[Math.floor(Math.random() * NOISE.length)];
      (async () => {
        let n = 0;
        while (tl.alive) {
          const L = LINES[n++ % LINES.length], target = textOf(L), logo = !L[0];
          const lock = spans.map(() => false), at = spans.map((_, i) => 6 + i * 1.6 + Math.random() * 6);
          cap.innerHTML = logo ? 'resolving…' : 'resolving…';
          for (let f = 0; tl.alive; f++) {
            let all = true; const s = [];
            for (let i = 0; i < N; i++) { if (i === COL || i === COL + 1) { s.push('/'); lock[i] = true; continue; } if (!lock[i] && f >= at[i]) lock[i] = true; if (!lock[i]) all = false; s.push(lock[i] ? target[i] : (target[i] === ' ' && Math.random() < .5 ? ' ' : rnd())); }
            paint(s.join(''), lock, logo); if (all) break; await tl.sleep(38);
          }
          cap.innerHTML = logo ? '<b>//</b>iframely' : L[0] + '<b>//</b>' + L[1].split('/')[0];
          await tl.wait(logo ? 3000 : 1500);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-intro', {
    group: 'logo', title: 'Intro stings: three ways in',
    blurb: 'Three short entrances for page load or a video end card, looping side by side. Skid: the slashes slide in at an angle, overshoot and straighten, then the word types. Drop: letters fall in on a spring and the slashes tip over into place last. Draw: the slashes are drawn as strokes and the word rises out of a mask.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const word = cls => [...'iframely'].map((ch, i) => h('span', { class: cls, style: '--i:' + i }, ch));
      const a = h('div', { class: 'in-c in-a' }, h('span', { class: 'tag' }, 'skid'), h('div', { class: 'lg' }, h('span', { class: 'sl' }, '//'), word('ch')));
      a.querySelectorAll('.ch').forEach((s, i) => { s.style.animationDelay = (.75 + i * .06) + 's'; });
      const b = h('div', { class: 'in-c in-b' }, h('span', { class: 'tag' }, 'drop'), h('div', { class: 'lg' }, h('span', { class: 'sl s1' }, '/'), h('span', { class: 'sl s2' }, '/'), word('ch')));
      b.querySelectorAll('.ch').forEach((s, i) => { s.style.animationDelay = (i * .05) + 's'; }); b.querySelector('.s1').style.animationDelay = '.55s'; b.querySelector('.s2').style.animationDelay = '.68s';
      const svg = '<svg viewBox="0 0 1.2 .95"><line x1="0.47" y1="0" x2="0.15" y2="0.95" pathLength="1.2"/><line x1="1.07" y1="0" x2="0.75" y2="0.95" pathLength="1.2"/></svg>';
      const d = h('div', { class: 'in-c in-d' }, h('span', { class: 'tag' }, 'draw'), h('div', { class: 'lg' }, h('span', { html: svg }), h('span', { class: 'w' }, word('ch'))));
      d.querySelectorAll('.ch').forEach((s, i) => { s.style.animationDelay = (.5 + i * .04) + 's'; });
      stage.append(h('div', { class: 'in' }, a, b, d), h('div', { class: 'lg-cap' }, 'loops every 4 s'));
      const all = [a, b, d];
      if (DEMOS.reduced) { all.forEach(el => el.classList.add('go')); stage.querySelectorAll('*').forEach(el => { el.style.animationDuration = '0s'; el.style.animationDelay = '0s'; }); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => { while (tl.alive) { all.forEach(reflow); await tl.wait(4000); } })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-eyes', {
    group: 'logo', title: 'Watching slashes: the // lean toward the pointer',
    blurb: 'A playful one for a 404 page, an empty state or the footer: the two slashes lean toward the pointer, each from its own centre, and blink when you click. With no pointer over the stage they follow a wandering dot.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const s1 = h('i', null, '/'), s2 = h('i', null, '/');
      const box = h('div', { class: 'ey' }, h('div', { class: 'lg' }, h('span', { class: 'sl' }, s1, s2), 'iframely'));
      const dot = h('div', { class: 'ey-dot' });
      stage.append(box, dot, h('div', { class: 'lg-cap' }, 'move the pointer · click to blink'));
      const p = DEMOS.pointer(stage);
      const blink = () => { box.classList.add('blink'); setTimeout(() => box.classList.remove('blink'), 140); };
      stage.addEventListener('pointerdown', blink);
      const ang = [0, 0];
      const draw = t => {
        p.smooth(.15); const sr = stage.getBoundingClientRect();
        const tx = p.inside ? p.sx : sr.width * (.5 + .38 * Math.cos(t * .5)), ty = p.inside ? p.sy : sr.height * (.5 + .34 * Math.sin(t * .83));
        dot.style.opacity = p.inside ? 0 : 1; dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
        [s1, s2].forEach((el, k) => {
          const r = el.getBoundingClientRect(); const cx = r.left - sr.left + r.width / 2, cy = r.top - sr.top + r.height * .58;
          /* lean toward the pointer (bounded, so they read as slashes), and shift a little toward it vertically */
          const want = 16 * Math.tanh((tx - cx) / 300), lift = Math.tanh((ty - cy) / 220) * .07;
          ang[k] += (want - ang[k]) * .16; el.style.transform = 'translateY(' + lift + 'em) rotate(' + ang[k] + 'deg)';
        });
        if (!p.inside && Math.random() < .004) blink();
      };
      const lp = DEMOS.loop(stage, draw);
      return () => { lp.destroy(); p.destroy(); stage.removeEventListener('pointerdown', blink); };
    },
  });
})();
