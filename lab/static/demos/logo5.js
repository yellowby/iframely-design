/* logo-hero-prism (L22) and logo-hero-page (L23) · L21's idea (URLs in, results out) in our own form. Text left, visual right.
   A queue of URLs moves up one row per cycle; the active URL goes into a middle object and fans out along five curves into
   result cards. L22: the middle is a large // drawn like the mark. L23: no slashes; the URL loads as a small page that gets
   scanned, and each beam leaves from the part of the page its result comes from (head → meta, image → embed, title →
   preview, body → fulltext, footer → access). A members-only URL gets a preview and an access decision; the other beams
   stop short, dashed. DOM + one SVG overlay; uses DEMOS.logoKit (demos/logo.js). */
(() => {
  const K = DEMOS.logoKit, JB = K.JB;
  const CSS = `
.px{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.42fr);gap:3cqw;align-items:center;padding:0 4.5cqw;background:#fff}
.px-t{display:flex;flex-direction:column;gap:14px;min-width:0}
.px-t .eyebrow{font:500 12px ${JB};letter-spacing:.08em;text-transform:uppercase;color:var(--logo)}
.px-t h1{margin:0;font-family:var(--serif);font-weight:var(--fl-serif-weight,400);font-style:var(--fl-serif-style,normal);font-size:calc(clamp(26px,4.2cqw,58px) * var(--fl-serif-scale,1));line-height:var(--fl-serif-lh,1.02);letter-spacing:var(--fl-serif-tracking,-.01em);text-wrap:balance}
.px-t p{margin:0;color:#666;max-width:34ch;font-size:clamp(13px,1.3cqw,17px)}
.px-t .btns{margin-top:4px}.px-t .btn.primary{background:var(--logo)}
.px-c{position:relative;height:82%;min-height:300px}
.px-q{position:absolute;left:0;top:0;bottom:0;width:27%;overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 24%,#000 76%,transparent);mask-image:linear-gradient(transparent,#000 24%,#000 76%,transparent)}
.px-track{position:absolute;left:0;right:0;top:0;transition:transform .7s cubic-bezier(.6,0,.2,1)}
.px-row{height:30px;display:flex;align-items:center;gap:6px;font:400 clamp(10px,1.05cqw,12.5px) ${JB};color:#9a9a9a;white-space:nowrap;transition:color .4s,opacity .4s}
.px-row .u{overflow:hidden;text-overflow:ellipsis;min-width:0}
.px-row .sl{color:var(--logo);font-weight:800;opacity:.55}
.px-row.done{opacity:.45}.px-row.done::after{content:"✓";color:var(--logo);font-weight:700}.px-row.done.no::after{content:"–";color:#9a9a9a}
.px-row.on{color:#0a0a0a;font-weight:500}.px-row.on .sl{opacity:1}
.px-band{position:absolute;left:-6px;right:0;top:50%;height:30px;transform:translateY(-50%);border-radius:7px;background:#f2f6ff}
.px-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.px-svg .bm{fill:none;stroke:var(--logo);stroke-width:1.5}
.px-svg .bm.na{stroke:#c9c9c9;stroke-dasharray:3 4}
.px-svg .in{fill:none;stroke:#0a0a0a;stroke-width:1.5}
.px-svg .sl{fill:var(--logo);transition:fill .2s}
.px-svg.hit .sl{fill:#003fcc}
.px-svg .pk{fill:var(--logo)}
.px-svg .pg{fill:#fff;stroke:#0a0a0a;stroke-width:1.5}
.px-svg .rg{fill:#efefef;transition:fill .25s}.px-svg .rg.lit{fill:#cddcff}.px-svg .rg.no{fill:#f4f4f4}
.px-svg .ld{transition:opacity .35s}
.px-svg .scan{stroke:var(--logo);stroke-width:2}
.px-svg .lock{fill:none;stroke:#9a9a9a;stroke-width:1.5}
.px-cards{position:absolute;right:0;top:50%;transform:translateY(-50%);width:50%;display:flex;flex-direction:column;gap:9px}
.px-card{display:grid;grid-template-columns:5.4em 1fr;align-items:center;gap:10px;height:clamp(44px,5.2cqw,58px);padding:0 12px;border:1px solid #e6e6e6;border-radius:10px;background:#fff;transition:border-color .3s,box-shadow .3s}
.px-card .k{font:600 10px ${JB};letter-spacing:.06em;text-transform:uppercase;color:#9a9a9a;transition:color .3s}
.px-card.on{border-color:#cddcff;box-shadow:0 8px 24px -18px rgba(0,60,200,.45)}.px-card.on .k{color:var(--logo)}
.px-card.na.on{border-color:#e6e6e6;box-shadow:none}.px-card.na.on .k{color:#9a9a9a}
.px-card .b{min-width:0;display:flex;align-items:center;gap:10px;opacity:0;transform:translateX(-6px);transition:opacity .35s,transform .35s;font:400 clamp(11px,1.1cqw,13px) var(--sans);color:#222;white-space:nowrap;overflow:hidden}
.px-card.on .b{opacity:1;transform:none}
.px-card.na .b{color:#9a9a9a}
.px-card .b .m{font-family:${JB};font-size:.92em;overflow:hidden;text-overflow:ellipsis;min-width:0}.px-card .b .m i{font-style:normal;color:var(--logo)}
.px-card .b .d{color:#8a8a8a;font-size:.9em}
.px-card .b .t{overflow:hidden;text-overflow:ellipsis;min-width:0}
.px-th{width:clamp(38px,4.2cqw,56px);height:clamp(26px,2.9cqw,36px);border-radius:5px;flex:none;display:grid;place-items:center;overflow:hidden}
.px-th.video{background:#0a0a0a}.px-th.video::after{content:"";border-left:9px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent;margin-left:2px}
.px-th.read{background:linear-gradient(135deg,#d8e7ff,#e4e3fb)}
.px-th.audio{background:#fadbe5;display:flex;align-items:center;justify-content:center;gap:2px}.px-th.audio i{width:2px;background:#0a0a0a;border-radius:1px}
.px-th.map{background:#dcefe2;background-image:linear-gradient(#bfdcc8 1px,transparent 1px),linear-gradient(90deg,#bfdcc8 1px,transparent 1px);background-size:7px 7px}
.px-th.repo{background:#f3f3f3;border:1px solid #e2e2e2}
.px-fav{width:14px;height:14px;border-radius:4px;flex:none}
.px-ch{height:22px;padding:0 8px;border-radius:6px;display:inline-flex;align-items:center;font:500 11px ${JB};background:#e3ecff;color:var(--logo)}
.px-ch.no{background:#f1f1f1;color:#777}
.px-md{font-family:${JB};font-size:.92em;overflow:hidden;text-overflow:ellipsis;min-width:0}.px-md i{font-style:normal;color:var(--logo);font-weight:800}
@container (max-width:760px){.px{grid-template-columns:1fr;align-content:center;padding:16px}.px-t p,.px-t .btns{display:none}.px-c{height:330px}}
`;
  const URLS = [
    { u: 'youtube.com/watch?v=dQw4w9WgXcQ', e: ['video', 'player', '16:9 · signed'], p: ['Never Gonna Give You Up', 'youtube.com', '#ff3d3d'], m: '{ "author": "Rick Astley", "duration": 213 }', f: null, a: ['allowed', 'oEmbed'] },
    { u: 'nytimes.com/2026/10/21/technology/web-glue', e: ['read', 'reader', 'summary card'], p: ['The quiet software that holds the web together', 'nytimes.com', '#0a0a0a'], m: '{ "author": "K. Chen", "date": "2026-10-21" }', f: ['The quiet software…', '1,240 words'], a: ['preview only', 'paywall rule'] },
    { u: 'open.spotify.com/track/4uLU6hMC', e: ['audio', 'player', '152×80'], p: ['Kerala · Bonobo', 'open.spotify.com', '#1ed760'], m: '{ "album": "Migration", "duration": 253 }', f: null, a: ['allowed', 'oEmbed'] },
    { u: 'example.com/members/only/story', blocked: true, e: null, p: ['Members only', 'example.com', '#9a9a9a'], m: null, f: null, a: ['blocked', 'publisher rule'] },
    { u: 'maps.google.com/?q=50.4501,30.5234', e: ['map', 'map', '4:3 · interactive'], p: ['Kyiv', 'google.com/maps', '#34a853'], m: '{ "lat": 50.4501, "lng": 30.5234 }', f: null, a: ['allowed', 'robots.txt'] },
    { u: 'github.com/itteco/iframely', e: ['repo', 'card', 'summary, light'], p: ['itteco/iframely', 'github.com', '#0a0a0a'], m: '{ "type": "repository", "owner": "itteco" }', f: ['Iframely', 'README.md'], a: ['allowed', 'robots.txt'] },
  ];
  /* which cards a URL leaves empty */
  const na = (U, k) => k === 'embed' ? !U.e : k === 'meta' ? !U.m : k === 'fulltext' ? !U.f : false;
  /* page regions for L23, as fractions of the page box: [kind, top, height, width] */
  const REGIONS = [['meta', .04, .06, .9], ['embed', .15, .3, .9], ['preview', .51, .07, .72], ['fulltext', .63, .2, .9], ['access', .88, .05, .5]];

  function mountHero(stage, variant) {
    K.ensureCss(); if (!document.getElementById('css-logo5')) document.head.appendChild(DEMOS.h('style', { id: 'css-logo5' }, CSS));
    const { h } = DEMOS; const C = DEMOS.HERO; const NS = 'http://www.w3.org/2000/svg';
    const sv = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v); return el; };
    const PAGE = variant === 'page';
    const KINDS = PAGE ? REGIONS.map(r => r[0]) : ['embed', 'preview', 'meta', 'fulltext', 'access'];
    /* queue: four copies so it can scroll for a long time; it resets quietly when far down */
    const track = h('div', { class: 'px-track' }); const rows = [];
    for (let r = 0; r < 4; r++) URLS.forEach(U => { const el = h('div', { class: 'px-row' }, h('span', { class: 'u' }, 'https:', h('span', { class: 'sl' }, '//'), U.u)); rows.push(el); track.appendChild(el); });
    const q = h('div', { class: 'px-q' }, h('div', { class: 'px-band' }), track);
    const svg = sv('svg', { class: 'px-svg' });
    const cards = KINDS.map(k => { const b = h('div', { class: 'b' }); const el = h('div', { class: 'px-card' }, h('span', { class: 'k' }, k), b); return { el, b, k }; });
    const comp = h('div', { class: 'px-c' }, q, svg, h('div', { class: 'px-cards' }, cards.map(c => c.el)));
    stage.appendChild(h('div', { class: 'px' },
      h('div', { class: 'px-t' }, h('div', { class: 'eyebrow' }, C.eyebrow), h('h1', null, C.title), h('p', null, C.text), h('div', { class: 'btns' }, h('a', { class: 'btn primary', href: '#' }, C.cta), h('a', { class: 'btn secondary', href: '#' }, 'Check a URL'))),
      comp));

    const inPath = sv('path', { class: 'in', pathLength: 1 }), pk = sv('circle', { class: 'pk', r: 4, opacity: 0 }), beams = KINDS.map(() => sv('path', { class: 'bm', pathLength: 1 }));
    let slashes = [], page = null, regs = [], scan = null, lock = null, ld = null, P = null;
    svg.appendChild(inPath);
    if (PAGE) {
      page = sv('rect', { class: 'pg', rx: 6 }); ld = sv('g', { class: 'ld', opacity: 0 }); regs = REGIONS.map(() => sv('rect', { class: 'rg', rx: 2 })); scan = sv('line', { class: 'scan', opacity: 0 }); lock = sv('path', { class: 'lock', opacity: 0 });
      ld.append(...regs, lock); svg.append(page, ld, scan);
    } else { slashes = [sv('polygon', { class: 'sl' }), sv('polygon', { class: 'sl' })]; svg.append(...slashes); }
    svg.append(...beams, pk);

    const layout = () => {
      const r = comp.getBoundingClientRect(); const H = r.height, cy = H / 2;
      const qx = q.getBoundingClientRect().right - r.left + 6;
      const cr = cards.map(c => { const b = c.el.getBoundingClientRect(); return { x: b.left - r.left, y: b.top - r.top + b.height / 2 }; });
      const avail = cr[0].x - qx; let inX, starts;
      if (PAGE) {
        const pw = Math.min(avail * .36, 128), ph = pw * 1.36, px = qx + avail * .2, py = cy - ph / 2;
        P = { x: px, y: py, w: pw, h: ph };
        page.setAttribute('x', px); page.setAttribute('y', py); page.setAttribute('width', pw); page.setAttribute('height', ph);
        REGIONS.forEach(([, t, hh, w], i) => { regs[i].setAttribute('x', px + pw * .07); regs[i].setAttribute('y', py + ph * t); regs[i].setAttribute('width', pw * .86 * w / .9); regs[i].setAttribute('height', ph * hh); });
        const lx = px + pw / 2, ly = py + ph * .73; lock.setAttribute('d', `M${lx - 7} ${ly} h14 v11 h-14 Z M${lx - 4} ${ly} v-4 a4 4 0 0 1 8 0 v4`);
        scan.setAttribute('x1', px - 6); scan.setAttribute('x2', px + pw + 6);
        inX = px; starts = REGIONS.map(([, t, hh]) => ({ x: px + pw, y: py + ph * (t + hh / 2) }));
      } else {
        const sh = Math.min((cr[4].y - cr[0].y) * .6, avail * .42 / .96), sw = sh * .2, gap = sh * .2, tilt = sh * .36;
        const x0 = qx + avail * .3 - (sw * 2 + gap + tilt) / 2;
        const poly = x => `${x + tilt},${cy - sh / 2} ${x + tilt + sw},${cy - sh / 2} ${x + sw},${cy + sh / 2} ${x},${cy + sh / 2}`;
        slashes[0].setAttribute('points', poly(x0)); slashes[1].setAttribute('points', poly(x0 + sw + gap));
        inX = x0 + tilt / 2 + sw * .2; const outX = x0 + sw * 2 + gap + tilt / 2; starts = KINDS.map(() => ({ x: outX, y: cy }));
      }
      inPath.setAttribute('d', `M${qx} ${cy} H${inX}`);
      beams.forEach((p, i) => { const s = starts[i], tx = cr[i].x - 3, ty = cr[i].y, dx = (tx - s.x) * .5; p.setAttribute('d', `M${s.x} ${s.y} C${s.x + dx} ${s.y} ${tx - dx} ${ty} ${tx} ${ty}`); });
    };
    const ro = new ResizeObserver(layout); ro.observe(comp);
    let idx = URLS.length; /* start in the second copy so there are rows above */
    const placeQueue = (i, instant) => { if (instant) track.style.transition = 'none'; track.style.transform = `translateY(${q.clientHeight / 2 - (i + .5) * 30}px)`; if (instant) { void track.offsetWidth; track.style.transition = ''; } rows.forEach((el, k) => { el.classList.toggle('on', k === i); }); };
    const draw = (el, v) => { el.style.strokeDasharray = '1'; el.style.strokeDashoffset = String(1 - v); };
    const content = (U, k) => {
      if (k === 'embed') return U.e ? [h('span', { class: 'px-th ' + U.e[0] }, U.e[0] === 'audio' ? [5, 9, 6, 11, 7, 12, 5, 8].map(v => h('i', { style: 'height:' + v + 'px' })) : null), h('span', { class: 'm' }, U.e[1]), h('span', { class: 'd' }, U.e[2])] : [h('span', { class: 'm' }, '—'), h('span', { class: 'd' }, U.blocked ? 'not allowed' : 'no embed for this URL')];
      if (k === 'preview') return [h('span', { class: 'px-fav', style: 'background:' + U.p[2] }), h('span', { class: 't' }, U.p[0]), h('span', { class: 'd' }, U.p[1])];
      if (k === 'meta') return U.m ? [h('span', { class: 'm', html: U.m.replace(/"([a-z]+)":/g, '<i>"$1"</i>:') })] : [h('span', { class: 'm' }, '—'), h('span', { class: 'd' }, 'not allowed')];
      if (k === 'fulltext') return U.f ? [h('span', { class: 'px-md', html: '<i>#</i> ' + U.f[0] }), h('span', { class: 'd' }, U.f[1])] : [h('span', { class: 'm' }, '—'), h('span', { class: 'd' }, U.blocked ? 'not allowed' : 'no article body')];
      return [h('span', { class: 'px-ch' + (U.blocked ? ' no' : '') }, U.a[0]), h('span', { class: 'd' }, U.a[1])];
    };
    const fill = U => cards.forEach(c => { c.b.replaceChildren(...content(U, c.k)); c.el.classList.toggle('na', na(U, c.k)); c.el.classList.remove('on'); });
    const setBeams = U => beams.forEach((p, i) => p.classList.toggle('na', na(U, KINDS[i])));
    const pageState = (U, on) => { if (!PAGE) return; ld.setAttribute('opacity', on ? 1 : 0); regs.forEach((rg, i) => { rg.classList.remove('lit'); rg.classList.toggle('no', !!U.blocked && na(U, KINDS[i])); }); lock.setAttribute('opacity', U.blocked ? 1 : 0); };
    layout();
    if (DEMOS.reduced) { placeQueue(idx, true); const U = URLS[0]; fill(U); setBeams(U); pageState(U, true); draw(inPath, 1); beams.forEach(b => draw(b, 1)); cards.forEach(c => c.el.classList.add('on')); return () => ro.disconnect(); }
    placeQueue(idx, true); beams.forEach(b => draw(b, 0)); draw(inPath, 0);
    const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
    const fan = async (U, i) => { const short = na(U, KINDS[i]); await K.tween(tl, 650, v => draw(beams[i], short ? Math.min(v, .18) : v)); cards[i].el.classList.add('on'); };
    (async () => {
      await tl.wait(500);
      while (tl.alive) {
        const U = URLS[idx % URLS.length];
        layout(); fill(U); setBeams(U);
        /* the URL leaves the queue and travels to the middle */
        await K.tween(tl, 450, v => draw(inPath, v));
        pk.setAttribute('opacity', 1); const L = inPath.getTotalLength();
        await K.tween(tl, 420, v => { const p = inPath.getPointAtLength(L * v); pk.setAttribute('cx', p.x); pk.setAttribute('cy', p.y); });
        pk.setAttribute('opacity', 0);
        if (PAGE) {
          /* the page loads, a scan line reads it top to bottom, each region lights and sends its beam as the line passes */
          pageState(U, true); await tl.wait(350); scan.setAttribute('opacity', 1);
          const fired = new Set(), runs = [];
          await K.tween(tl, 1300, v => {
            const y = P.y + P.h * v; scan.setAttribute('y1', y); scan.setAttribute('y2', y);
            REGIONS.forEach(([, t, hh], i) => { if (!fired.has(i) && v >= t + hh / 2) { fired.add(i); if (!(U.blocked && na(U, KINDS[i]))) regs[i].classList.add('lit'); runs.push(fan(U, i)); } });
          }, t => t);
          scan.setAttribute('opacity', 0); await Promise.all(runs);
        } else {
          svg.classList.add('hit'); await tl.sleep(140); svg.classList.remove('hit');
          await Promise.all(beams.map((b, i) => (async () => { await tl.sleep(i * 90); await fan(U, i); })()));
        }
        rows[idx].classList.add('done'); rows[idx].classList.toggle('no', !!U.blocked);
        await tl.wait(2600);
        /* clear and move the queue up one row */
        cards.forEach(c => c.el.classList.remove('on'));
        if (PAGE) pageState(U, false);
        await K.tween(tl, 380, v => { draw(inPath, 1 - v); beams.forEach((b, i) => draw(b, (na(U, KINDS[i]) ? .18 : 1) * (1 - v))); });
        idx++; if (idx >= URLS.length * 3) { rows.forEach(el => el.classList.remove('done', 'no')); for (let k = 0; k < URLS.length; k++) rows[k].classList.add('done'); idx -= URLS.length; placeQueue(idx, true); }
        placeQueue(idx); await tl.wait(700);
      }
    })();
    return () => { tl.destroy(); ro.disconnect(); };
  }

  DEMOS.register('logo-hero-prism', {
    group: 'logo', title: 'Hero: one URL in, five results out, through //',
    blurb: 'L21\'s idea in our own form, text left and visual right. A queue of URLs moves up one row per cycle; the active one travels into a large // drawn like the mark, which fans it out along five curves into result cards: embed, preview, meta, fulltext, access. A members-only story gets a preview and an access decision; the other beams stop short, dashed. Hover pauses.',
    mount: stage => mountHero(stage, 'slashes'),
  });
  DEMOS.register('logo-hero-page', {
    group: 'logo', title: 'Hero: one URL in, the page is read, five results out',
    blurb: 'The same hero without the slashes. The URL loads as a small page; a scan line reads it top to bottom and each part lights up and sends a beam to its result as the line passes: head → meta, image → embed, title → preview, body → fulltext, footer → access. On the members-only story the body stays locked and those beams stop short.',
    mount: stage => mountHero(stage, 'page'),
  });
})();
