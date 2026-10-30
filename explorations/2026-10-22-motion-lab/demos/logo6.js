/* L24–L27 · more takes on L23 ("the page is read"). Text left, visual right; the URL is drawn as a small page with five
   parts, and each part is where one result comes from: head → meta, media → embed, title → preview, body → fulltext,
   footer → access.
   L24 logo-hero-annotate: a scan line reads the page and each part gets a callout, like the product illustrations.
   L25 logo-hero-lens: a view-source lens moves over the page; what it sees is typed into the JSON response.
   L26 logo-hero-layers: the page tilts and comes apart into its five layers, each labelled with its result.
   L27 logo-hero-deck: five very different pages, one after another, come out as the same card.
   DOM + CSS transitions, one SVG overlay where needed; uses DEMOS.logoKit (demos/logo.js). */
(() => {
  const K = DEMOS.logoKit, JB = K.JB, NS = 'http://www.w3.org/2000/svg';
  const CSS = `
.pz{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.42fr);gap:3cqw;align-items:center;padding:0 4.5cqw;background:#fff}
.pz-t{display:flex;flex-direction:column;gap:14px;min-width:0}
.pz-t .eyebrow{font:500 12px ${JB};letter-spacing:.08em;text-transform:uppercase;color:var(--logo)}
.pz-t h1{margin:0;font-family:var(--serif);font-weight:var(--fl-serif-weight,400);font-style:var(--fl-serif-style,normal);font-size:calc(clamp(26px,4.2cqw,58px) * var(--fl-serif-scale,1));line-height:var(--fl-serif-lh,1.02);letter-spacing:var(--fl-serif-tracking,-.01em);text-wrap:balance}
.pz-t p{margin:0;color:#666;max-width:34ch;font-size:clamp(13px,1.3cqw,17px)}
.pz-t .btns{margin-top:4px}.pz-t .btn.primary{background:var(--logo)}
.pz-v{position:relative;height:84%;min-height:300px}
.pz-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.pz-svg .ld{fill:none;stroke:#0a0a0a;stroke-width:1.2}
.pz-svg .dt{fill:#0a0a0a;transition:opacity .3s}
.pz-svg .bm{fill:none;stroke:var(--logo);stroke-width:1.5}

/* the page */
.pz-page{position:absolute;background:#fff;border:1.5px solid #0a0a0a;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:opacity .35s}
.pz-bar{flex:none;height:24px;border-bottom:1px solid #e6e6e6;display:flex;align-items:center;gap:4px;padding:0 9px;font:400 9.5px ${JB};color:#777;white-space:nowrap;overflow:hidden}
.pz-bar>i{width:6px;height:6px;border-radius:50%;background:#dedede;flex:none}.pz-bar>i:nth-child(3){margin-right:6px}
.pz-bar b{color:var(--logo);font-weight:800}
.pz-body{flex:1;display:flex;flex-direction:column;gap:8%;padding:7% 8%;min-height:0;justify-content:space-between}
.pz-page [data-r]{border-radius:3px;transition:background .3s,box-shadow .3s,outline-color .3s;outline:1.5px solid transparent;outline-offset:3px}
.pz-page [data-r].lit:not(.pz-media){background:#eaf0ff;box-shadow:0 0 0 4px #eaf0ff}.pz-page .pz-media.lit{outline-color:var(--logo)}
.pz-head{display:flex;align-items:center;gap:6px;font:600 10.5px var(--sans);white-space:nowrap}
.pz-head .fv{width:11px;height:11px;border-radius:3px;flex:none}
.pz-head .nv{margin-left:auto;display:flex;gap:4px}.pz-head .nv i{width:14px;height:3px;border-radius:2px;background:#e2e2e2}
.pz-media{aspect-ratio:16/9;border-radius:6px;display:grid;place-items:center;overflow:hidden;position:relative}
.m-video{background:#0a0a0a}.m-video::after{content:"";border-left:14px solid #fff;border-top:9px solid transparent;border-bottom:9px solid transparent;margin-left:3px}
.m-article{background:linear-gradient(135deg,#d8e7ff,#e9e3fb 60%,#fde4d4)}
.m-audio{background:#14231a;display:flex;align-items:center;justify-content:center;gap:3px}.m-audio i{width:3px;border-radius:2px;background:#1ed760}
.m-map{background:#dcefe2;background-image:linear-gradient(#bfdcc8 1px,transparent 1px),linear-gradient(90deg,#bfdcc8 1px,transparent 1px);background-size:11px 11px}.m-map::after{content:"";width:10px;height:10px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#ea4335;box-shadow:0 0 0 3px #fff}
.m-repo{background:#f6f8fa;border:1px solid #e3e6ea;display:flex;flex-direction:column;justify-content:center;gap:5px;padding:0 10%;place-items:initial}.m-repo i{height:4px;border-radius:2px;background:#d0d7de}.m-repo i:nth-child(2n){background:#b6c7f5}
.pz-tb .ti{font:600 12.5px/1.25 var(--sans);color:#0a0a0a;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pz-tb .by{margin-top:4px;font:400 9.5px ${JB};color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pz-ln i{display:block;height:4px;border-radius:2px;background:#e8e8e8}.pz-ln i+i{margin-top:6px}
.pz-ft{font:400 9px ${JB};color:#9a9a9a;border-top:1px dashed #e2e2e2;padding-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pz-scan{position:absolute;left:0;right:0;height:2px;background:var(--logo);opacity:0;transition:opacity .25s;pointer-events:none}
.pz-scan::before{content:"";position:absolute;left:0;right:0;bottom:2px;height:36px;background:linear-gradient(transparent,rgba(0,85,255,.08))}
/* themed pages (L27) */
.pz-page.themed.t-video{background:#0f0f0f;color:#fff}.themed.t-video .pz-bar{background:#181818;border-color:#262626;color:#999}.themed.t-video .pz-tb .ti{color:#fff}.themed.t-video .pz-ln i{background:#2a2a2a}.themed.t-video .pz-ft{border-color:#2a2a2a;color:#777}.themed.t-video .nv i{background:#333}
.pz-page.themed.t-article{background:#fbfaf7}.themed.t-article .pz-tb .ti{font:400 15px/1.15 var(--serif);-webkit-line-clamp:3}.themed.t-article .pz-head{font:700 12px var(--serif);justify-content:center}.themed.t-article .pz-head .fv,.themed.t-article .nv{display:none}
.pz-page.themed.t-audio{background:#121212;color:#fff}.themed.t-audio .pz-bar{background:#1b1b1b;border-color:#262626;color:#999}.themed.t-audio .pz-tb .ti{color:#fff;font-weight:800}.themed.t-audio .pz-ln i{background:#2a2a2a}.themed.t-audio .pz-ft{border-color:#2a2a2a;color:#777}.themed.t-audio .nv i{background:#333}.themed.t-audio .pz-media{border-radius:50%;aspect-ratio:1;width:56%;align-self:center}
.pz-page.themed.t-map .pz-media{aspect-ratio:4/3}.themed.t-map .pz-ln{display:none}
.pz-page.themed.t-repo{background:#f6f8fa}.themed.t-repo .pz-tb .ti{font:600 12px ${JB};color:#0969da}

/* L24 annotate */
.pz-note{position:absolute;left:66%;right:0;transform:translateY(-50%);display:flex;flex-direction:column;gap:3px;opacity:0;translate:-6px 0;transition:opacity .35s,translate .35s}
.pz-note.on{opacity:1;translate:0 0}
.pz-note .k{font:600 10px ${JB};letter-spacing:.08em;text-transform:uppercase;color:var(--logo)}
.pz-note .v{font:400 clamp(11px,1.1cqw,13px) ${JB};color:#0a0a0a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pz-note .v.no{color:#9a9a9a}

/* L25 lens */
.pz-src{position:absolute;inset:0;background:#0b0f1a;pointer-events:none}
.pz-src pre{position:absolute;margin:0;font:400 9px/1.45 ${JB};color:#c9d6ff;white-space:pre-wrap;word-break:break-all;overflow:hidden}
.pz-src pre b{color:#7fa6ff;font-weight:400}.pz-src pre u{text-decoration:none;color:#ffd37a}
.pz-lens{position:absolute;border:2px solid var(--logo);border-radius:50%;pointer-events:none;box-shadow:0 0 0 4px rgba(0,85,255,.12),0 10px 30px -10px rgba(0,40,140,.5);transition:opacity .3s}
.pz-lens::after{content:"view-source";position:absolute;left:50%;top:100%;transform:translate(-50%,6px);font:500 9px ${JB};color:var(--logo);background:#fff;padding:1px 5px;border-radius:4px;white-space:nowrap}
.pz-json{position:absolute;right:0;top:50%;transform:translateY(-50%);width:46%;border:1px solid #e6e6e6;border-radius:12px;background:#fff;box-shadow:0 18px 40px -30px rgba(0,30,90,.35);overflow:hidden}
.pz-json .hd{display:flex;gap:8px;align-items:center;height:30px;padding:0 12px;border-bottom:1px solid #eee;font:500 10px ${JB};color:#777}.pz-json .hd b{color:#0a0a0a;font-weight:600}.pz-json .hd .ok{width:7px;height:7px;border-radius:50%;background:#1fbf6b}
.pz-json .bd{padding:10px 12px 12px;min-height:12em;font:400 clamp(10px,1.02cqw,12px)/1.6 ${JB};color:#0a0a0a}
.pz-json .bd div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pz-json .bd .in{padding-left:1.4em}
.pz-json .bd i{font-style:normal;color:var(--logo)}.pz-json .bd s{text-decoration:none;color:#9a9a9a}
.pz-json .bd .new{background:#eaf0ff;border-radius:3px}

/* L26 layers */
.pz-scene{position:absolute;left:0;top:0;bottom:0;width:62%;perspective:2400px;display:grid;place-items:center}
.pz-stack{position:relative;transform-style:preserve-3d;transition:transform 1.1s cubic-bezier(.6,0,.2,1)}
.pz-stack.tilt{transform:rotateX(54deg) rotateZ(-34deg) scale(.66)}
.pz-stack .pz-page{inset:0;transform:translateZ(calc((var(--i) - 2.5) * var(--gap,0px)));transition:transform 1s cubic-bezier(.6,0,.2,1),opacity .35s;overflow:visible}
.pz-stack .pz-page.layer{background:transparent;border-color:transparent;transition:transform 1s cubic-bezier(.6,0,.2,1),opacity .35s,background .5s,border-color .5s}.pz-stack.apart .pz-page.layer{background:rgba(255,255,255,.6);border-color:#0a0a0a}.pz-stack .pz-page.layer .pz-bar{visibility:hidden}
.pz-stack.apart .pz-page.layer [data-r]:not(.pz-media){background:#fff;outline-color:#0a0a0a}
.pz-stack.apart .pz-page.layer .pz-media{outline-color:#0a0a0a}
.pz-stack.apart .pz-page.layer [data-r].lit{outline-color:var(--logo)}
.pz-lab{position:absolute;left:70%;right:0;transform:translateY(-50%);display:flex;flex-direction:column;gap:3px;opacity:0;translate:-6px 0;transition:opacity .35s,translate .35s}
.pz-lab .k{font:600 10px ${JB};color:var(--logo);text-transform:uppercase;letter-spacing:.08em}
.pz-lab .v{font:400 clamp(11px,1.1cqw,13px) ${JB};color:#0a0a0a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pz-lab.on{opacity:1;translate:0 0}

/* L27 deck */
.pz-deck{position:absolute;left:0;top:50%;width:46%;transform:translateY(-50%)}
.pz-deck .pz-page{left:0;top:0;width:100%;transition:transform .8s cubic-bezier(.6,0,.2,1),opacity .6s;box-shadow:0 14px 34px -24px rgba(0,0,0,.45);transform-origin:50% 100%}
.pz-out{position:absolute;right:0;top:50%;transform:translateY(-50%);width:44%;display:flex;flex-direction:column;gap:12px}
.pz-pc{border:1px solid #e6e6e6;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 18px 40px -30px rgba(0,30,90,.35)}
.pz-pc .pz-media{border-radius:0;transition:opacity .3s}
.pz-pc .pc-b{padding:10px 12px 12px;display:flex;flex-direction:column;gap:5px}
.pz-pc .pc-s{display:flex;align-items:center;gap:6px;font:400 10px ${JB};color:#888}.pz-pc .pc-s .fv{width:11px;height:11px;border-radius:3px}
.pz-pc .pc-t{font:600 clamp(12px,1.25cqw,15px)/1.25 var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pz-pc .pc-a{font:400 11px var(--sans);color:#777;display:flex;justify-content:space-between;gap:8px}
.pz-pc .pc-a .ch{height:18px;padding:0 6px;border-radius:5px;background:#e3ecff;color:var(--logo);font:500 10px ${JB};display:inline-flex;align-items:center}
.pz-pc .fade{transition:opacity .3s}.pz-pc.swap .fade{opacity:0}
.pz-kv{font:400 clamp(10px,1cqw,12px)/1.65 ${JB};padding:0 4px}
.pz-kv div{display:grid;grid-template-columns:6.5em 1fr;white-space:nowrap}.pz-kv i{font-style:normal;color:var(--logo)}.pz-kv span{overflow:hidden;text-overflow:ellipsis}
@container (max-width:760px){.pz{grid-template-columns:1fr;align-content:center;padding:16px}.pz-t p,.pz-t .btns{display:none}.pz-v{height:330px}}
`;
  const KINDS = ['meta', 'embed', 'preview', 'fulltext', 'access'];
  const SITES = [
    { k: 'video', host: 'youtube.com', path: '/watch?v=dQw4w9WgXcQ', site: 'YouTube', fav: '#ff3d3d', title: 'Never Gonna Give You Up (Official Video)', author: 'Rick Astley', by: 'Rick Astley · 4K remaster', lines: [.92, .7], foot: '© 2026 Google LLC · oEmbed', e: 'player · 16:9', ft: null, acc: ['allowed', 'oEmbed'], id: 'x7Kd2', srcE: '<meta property="og:video:url"\n  content="https://youtube.com/embed/dQw4">', srcA: '<link rel="alternate"\n  type="application/json+oembed">' },
    { k: 'article', host: 'nytimes.com', path: '/2026/10/21/technology/web-glue', site: 'The New York Times', fav: '#0a0a0a', title: 'The quiet software that holds the web together', author: 'K. Chen', by: 'By K. Chen · Oct 21, 2026', lines: [1, .96, .9, .98, .62], foot: 'Subscribers only beyond preview', e: 'summary card', ft: '1,240 words', acc: ['preview only', 'paywall rule'], id: 'q3Rt8', srcE: '<meta property="og:image"\n  content="…/web-glue-1200.jpg">', srcA: '<meta name="iframely"\n  content="preview">' },
    { k: 'audio', host: 'open.spotify.com', path: '/track/4uLU6hMC', site: 'Spotify', fav: '#1ed760', title: 'Kerala', author: 'Bonobo', by: 'Bonobo · Migration · 4:13', lines: [.8, .5], foot: '© 2017 Ninja Tune · oEmbed', e: 'player · 152×80', ft: null, acc: ['allowed', 'oEmbed'], id: 'b0N5k', srcE: '<meta property="og:audio"\n  content="…/preview/4uLU6hMC">', srcA: '<link rel="alternate"\n  type="application/json+oembed">' },
    { k: 'map', host: 'maps.google.com', path: '/?q=50.4501,30.5234', site: 'Google Maps', fav: '#34a853', title: 'Kyiv, Ukraine', author: 'Google Maps', by: '50.4501° N, 30.5234° E', lines: [.7, .4], foot: 'robots.txt: Allow /maps', e: 'map · 4:3', ft: null, acc: ['allowed', 'robots.txt'], id: 'm4Pq1', srcE: '<meta property="og:image"\n  content="…/staticmap?center=…">', srcA: 'User-agent: *\nAllow: /maps' },
    { k: 'repo', host: 'github.com', path: '/itteco/iframely', site: 'GitHub', fav: '#0a0a0a', title: 'itteco/iframely', author: 'itteco', by: 'itteco · Node.js · MIT', lines: [.96, .88, .74], foot: 'robots.txt: Allow /', e: 'summary card', ft: 'README.md', acc: ['allowed', 'robots.txt'], id: 'g1Th6', srcE: '<meta property="og:image"\n  content="…/opengraph/iframely">', srcA: 'User-agent: *\nAllow: /' },
  ];

  const h = (...a) => DEMOS.h(...a);
  const sv = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v); return el; };
  const draw = (el, v) => { el.style.strokeDasharray = '1'; el.style.strokeDashoffset = String(1 - v); };
  const rel = (el, box) => { const a = el.getBoundingClientRect(), b = box.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height, cx: a.left - b.left + a.width / 2, cy: a.top - b.top + a.height / 2 }; };
  const media = k => h('div', { class: 'pz-media m-' + k, 'data-r': 'embed' },
    k === 'audio' ? [6, 11, 8, 14, 9, 16, 7, 12, 6, 10].map(v => h('i', { style: 'height:' + v + 'px' })) : k === 'repo' ? [.9, .6, .8, .5, .7].map(w => h('i', { style: 'width:' + w * 100 + '%' })) : null);
  function page(S, themed) {
    return h('div', { class: 'pz-page t-' + S.k + (themed ? ' themed' : '') },
      h('div', { class: 'pz-bar' }, h('i'), h('i'), h('i'), 'https:', h('b', null, '//'), S.host + S.path),
      h('div', { class: 'pz-body' },
        h('div', { class: 'pz-head', 'data-r': 'meta' }, h('i', { class: 'fv', style: 'background:' + S.fav }), S.site, h('span', { class: 'nv' }, h('i'), h('i'), h('i'))),
        media(S.k),
        h('div', { class: 'pz-tb', 'data-r': 'preview' }, h('div', { class: 'ti' }, S.title), h('div', { class: 'by' }, S.by)),
        h('div', { class: 'pz-ln', 'data-r': 'fulltext' }, S.lines.map(w => h('i', { style: 'width:' + w * 100 + '%' }))),
        h('div', { class: 'pz-ft', 'data-r': 'access' }, S.foot)));
  }
  const regions = pg => KINDS.map(k => pg.querySelector(`[data-r="${k}"]`));
  function shell(stage) {
    K.ensureCss(); if (!document.getElementById('css-logo6')) document.head.appendChild(h('style', { id: 'css-logo6' }, CSS));
    const C = DEMOS.HERO, v = h('div', { class: 'pz-v' });
    stage.appendChild(h('div', { class: 'pz' },
      h('div', { class: 'pz-t' }, h('div', { class: 'eyebrow' }, C.eyebrow), h('h1', null, C.title), h('p', null, C.text), h('div', { class: 'btns' }, h('a', { class: 'btn primary', href: '#' }, C.cta), h('a', { class: 'btn secondary', href: '#' }, 'Check a URL'))),
      v));
    return v;
  }
  /* page box that fits a w × h area at a portrait ratio */
  const fitPage = (pg, x, w, H, ratio) => { const ph = Math.min(H * .94, w * ratio), pw = ph / ratio; Object.assign(pg.style, { left: x + (w - pw) / 2 + 'px', top: (H - ph) / 2 + 'px', width: pw + 'px', height: ph + 'px' }); };
  const scanDown = async (tl, pg, ms, onPass) => {
    const scan = h('div', { class: 'pz-scan' }); pg.appendChild(scan); await K.nextFrame(); scan.style.opacity = 1;
    const H = pg.clientHeight, rs = regions(pg).map(r => rel(r, pg)), fired = new Set();
    await K.tween(tl, ms, v => { const y = H * v; scan.style.top = y + 'px'; rs.forEach((r, i) => { if (!fired.has(i) && y >= r.cy) { fired.add(i); onPass(i); } }); }, t => t);
    scan.style.opacity = 0; setTimeout(() => scan.remove(), 300);
  };
  const ann = S => ({
    meta: S.site + ' · icon · canonical',
    embed: S.e,
    preview: '"' + S.title + '"',
    fulltext: S.ft ? S.ft + ' → .md' : 'none on this page',
    access: S.acc[0] + ' · ' + S.acc[1],
  });

  /* ---------- L24 annotate ---------- */
  function annotate(stage) {
    const v = shell(stage), svg = sv('svg', { class: 'pz-svg' });
    const notes = KINDS.map(k => { const val = h('div', { class: 'v' }); const el = h('div', { class: 'pz-note' }, h('div', { class: 'k' }, k), val); return { el, val }; });
    const leads = KINDS.map(() => sv('path', { class: 'ld', pathLength: 1 })), dots = KINDS.map(() => sv('circle', { class: 'dt', r: 2.6, opacity: 0 }));
    svg.append(...leads, ...dots); v.append(svg, ...notes.map(n => n.el));
    let pg = null, si = 0;
    const layout = () => {
      if (!pg) return; const W = v.clientWidth, H = v.clientHeight;
      fitPage(pg, 0, W * .56, H, 1.32);
      const rs = regions(pg).map(r => rel(r, v)); const ys = rs.map(r => r.cy);
      for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + 40);
      const over = ys[ys.length - 1] - (H - 16); if (over > 0) ys.forEach((_, i) => ys[i] -= over);
      const nx = W * .66 - 8;
      rs.forEach((r, i) => {
        notes[i].el.style.top = ys[i] + 'px'; const sx = r.x + r.w + 7, mx = (sx + nx) / 2;
        leads[i].setAttribute('d', `M${sx} ${r.cy} C${mx} ${r.cy} ${mx} ${ys[i]} ${nx} ${ys[i]}`); dots[i].setAttribute('cx', sx); dots[i].setAttribute('cy', r.cy);
      });
    };
    const ro = new ResizeObserver(layout); ro.observe(v);
    const set = S => { pg && pg.remove(); pg = page(S); v.insertBefore(pg, svg); const A = ann(S); notes.forEach((n, i) => { n.val.textContent = A[KINDS[i]]; n.val.classList.toggle('no', KINDS[i] === 'fulltext' && !S.ft); }); layout(); };
    set(SITES[0]);
    if (DEMOS.reduced) { regions(pg).forEach(r => r.classList.add('lit')); leads.forEach(l => draw(l, 1)); dots.forEach(d => d.setAttribute('opacity', 1)); notes.forEach(n => n.el.classList.add('on')); return () => ro.disconnect(); }
    leads.forEach(l => draw(l, 0));
    const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
    (async () => {
      await tl.wait(400);
      while (tl.alive) {
        const runs = [], rg = regions(pg);
        await scanDown(tl, pg, 1800, i => { rg[i].classList.add('lit'); dots[i].setAttribute('opacity', 1); runs.push(K.tween(tl, 420, t => draw(leads[i], t)).then(() => notes[i].el.classList.add('on'))); });
        await Promise.all(runs); await tl.wait(2800);
        notes.forEach(n => n.el.classList.remove('on')); rg.forEach(r => r.classList.remove('lit'));
        await K.tween(tl, 360, t => leads.forEach(l => draw(l, 1 - t))); dots.forEach(d => d.setAttribute('opacity', 0));
        pg.style.opacity = 0; await tl.wait(380);
        si++; set(SITES[si % SITES.length]); pg.style.opacity = 0; await K.nextFrame(); pg.style.opacity = 1; await tl.wait(500);
      }
    })();
    return () => { tl.destroy(); ro.disconnect(); };
  }

  /* ---------- L25 lens ---------- */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const srcHtml = s => esc(s).replace(/(&lt;\/?[a-z]+)/g, '<b>$1</b>').replace(/("[^"]*")/g, '<u>$1</u>');
  const SRC = S => ({
    meta: `<link rel="canonical"\n  href="https://${S.host}${S.path}">\n<meta property="og:site_name"\n  content="${S.site}">`,
    embed: S.srcE,
    preview: `<meta property="og:title"\n  content="${S.title}">\n<meta name="author" content="${S.author}">`,
    fulltext: S.ft ? `<article>\n  <h1>${S.title}</h1>\n  <p>…</p>` : `<div id="comments">\n  …\n</div>`,
    access: S.srcA,
  });
  const JSONL = S => ({
    meta: [['site', S.site], ['canonical', 'https://' + S.host + S.path]],
    embed: [['html', `<iframe src="//cdn.iframe.ly/${S.id}">`]],
    preview: [['title', S.title], ['author', S.author]],
    fulltext: [['fulltext', S.ft ? '# ' + S.title : null]],
    access: [['access', S.acc[0]]],
  });
  function lens(stage) {
    const v = shell(stage);
    const bd = h('div', { class: 'bd' }), hd = h('div', { class: 'hd' }, h('span', { class: 'ok' }), h('b', null, '200'), 'GET /api/iframely?url=…');
    const panel = h('div', { class: 'pz-json' }, hd, bd); v.appendChild(panel);
    let pg = null, src = null, ring = null, si = 0, R = 40, L = { x: -60, y: 30 };
    const place = () => { if (!pg) return; const W = v.clientWidth, H = v.clientHeight; fitPage(pg, 0, W * .5, H, 1.32); R = Math.max(40, pg.clientWidth * .26); ring.style.width = ring.style.height = R * 2 + 'px';
      /* each snippet sits centred on the lens's stop for its part, so it reads whole inside the circle */
      regions(pg).forEach((r, i) => { const s = stop(r), pre = src.children[i]; Object.assign(pre.style, { left: s.x - R * .8 + 'px', width: R * 1.6 + 'px', top: s.y - R * .55 + 'px', height: R * 1.1 + 'px', paddingTop: R * .25 + 'px' }); }); lensAt(L.x, L.y); };
    const stop = r => { const b = rel(r, pg); return { x: Math.min(b.cx, pg.clientWidth * .6), y: b.cy }; };
    const lensAt = (x, y) => { L = { x, y }; src.style.clipPath = `circle(${R}px at ${x}px ${y}px)`; ring.style.left = x - R + 'px'; ring.style.top = y - R + 'px'; };
    const set = S => {
      pg && pg.remove(); pg = page(S); const S2 = SRC(S);
      src = h('div', { class: 'pz-src' }, KINDS.map(k => h('pre', { html: srcHtml(S2[k]) }))); ring = h('div', { class: 'pz-lens' });
      pg.append(src, ring); v.insertBefore(pg, panel); hd.lastChild.textContent = 'GET ?url=' + S.host + S.path;
      bd.replaceChildren(h('div', null, '{')); L = { x: -R * 1.2, y: 20 }; place();
    };
    const ro = new ResizeObserver(place); ro.observe(v);
    const fmt = (k, val, last) => `<i>"${k}"</i>: ${val === null ? '<s>null</s>' : '"' + esc(val) + '"'}${last ? '' : ','}`;
    const typeLine = async (k, val, last) => {
      const plain = `"${k}": ${val === null ? 'null' : '"' + val + '"'}${last ? '' : ','}`, el = h('div', { class: 'in new' }); bd.appendChild(el);
      await K.tween(tl, Math.min(520, 14 * plain.length), t => { el.textContent = plain.slice(0, Math.round(plain.length * t)); }, t => t);
      el.innerHTML = fmt(k, val, last); setTimeout(() => el.classList.remove('new'), 900);
    };
    set(SITES[0]);
    let tl = null;
    if (DEMOS.reduced) { const J = JSONL(SITES[0]); KINDS.forEach((k, ki) => J[k].forEach(([a, b], j) => bd.appendChild(h('div', { class: 'in', html: fmt(a, b, ki === 4 && j === J[k].length - 1) })))); bd.appendChild(h('div', null, '}')); const r = stop(regions(pg)[2]); lensAt(r.x, r.y); return () => ro.disconnect(); }
    tl = DEMOS.timeline(DEMOS.hoverPause(stage));
    (async () => {
      await tl.wait(400);
      while (tl.alive) {
        const S = SITES[si % SITES.length], J = JSONL(S), rg = regions(pg);
        ring.style.opacity = 1;
        for (let i = 0; i < KINDS.length && tl.alive; i++) {
          const from = { ...L }, to = stop(rg[i]);
          await K.tween(tl, 620, t => lensAt(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t));
          rg[i].classList.add('lit');
          const rows = J[KINDS[i]]; for (let j = 0; j < rows.length; j++) await typeLine(rows[j][0], rows[j][1], i === KINDS.length - 1 && j === rows.length - 1);
          await tl.wait(260); rg[i].classList.remove('lit');
        }
        bd.appendChild(h('div', null, '}'));
        const from = { ...L }; await K.tween(tl, 600, t => lensAt(from.x + (pg.clientWidth + R * 1.4 - from.x) * t, from.y));
        await tl.wait(2600);
        pg.style.opacity = 0; bd.style.transition = 'opacity .35s'; bd.style.opacity = 0; await tl.wait(400);
        si++; set(SITES[si % SITES.length]); pg.style.opacity = 0; bd.style.opacity = 1; await K.nextFrame(); pg.style.opacity = 1; await tl.wait(500);
      }
    })();
    return () => { tl.destroy(); ro.disconnect(); };
  }

  /* ---------- L26 layers ---------- */
  function layers(stage) {
    /* sheet 0 is the page frame; sheets 1–5 each hold one part at its place. Spread along Z, they read as layers.
       Labels stay flat, outside the 3D, and join the measured position of each tilted part with a leader. */
    const v = shell(stage), scene = h('div', { class: 'pz-scene' }), stack = h('div', { class: 'pz-stack' }), svg = sv('svg', { class: 'pz-svg' }); scene.appendChild(stack);
    const labs = KINDS.map(k => { const val = h('div', { class: 'v' }); return { el: h('div', { class: 'pz-lab' }, h('div', { class: 'k' }, k), val), val }; });
    const leads = KINDS.map(() => sv('path', { class: 'ld', pathLength: 1 })), dots = KINDS.map(() => sv('circle', { class: 'dt', r: 2.6, opacity: 0 }));
    svg.append(...leads, ...dots); v.append(scene, svg, ...labs.map(l => l.el));
    let sheets = [], si = 0;
    const size = () => { const H = Math.min(v.clientHeight * .8, v.clientWidth * .56, 400), W = H / 1.32; stack.style.width = W + 'px'; stack.style.height = H + 'px'; stack.style.setProperty('--gap', H * .2 + 'px'); };
    const aim = () => {
      const W = v.clientWidth, H = v.clientHeight, lx = W * .7 - 8;
      const as = KINDS.map((_, i) => { const b = rel(regions(sheets[5 - i])[i], v); return { x: b.x + b.w, y: b.cy }; });
      const ys = KINDS.map((_, i) => H * (.16 + i * .17));
      as.forEach((a, i) => { labs[i].el.style.top = ys[i] + 'px'; const mx = (a.x + lx) / 2; leads[i].setAttribute('d', `M${a.x + 4} ${a.y} C${mx} ${a.y} ${mx} ${ys[i]} ${lx} ${ys[i]}`); dots[i].setAttribute('cx', a.x + 4); dots[i].setAttribute('cy', a.y); });
    };
    const set = S => {
      stack.replaceChildren(); const A = ann(S);
      sheets = [0, 1, 2, 3, 4, 5].map(i => { const pg = page(S); pg.style.setProperty('--i', i); regions(pg).forEach((r, j) => { if (i === 0 || j !== 5 - i) r.style.visibility = 'hidden'; }); if (i) pg.classList.add('layer'); stack.appendChild(pg); return pg; });
      labs.forEach((l, i) => l.val.textContent = A[KINDS[i]]);
      size();
    };
    const ro = new ResizeObserver(() => { size(); if (stack.classList.contains('apart')) aim(); }); ro.observe(v);
    set(SITES[0]);
    if (DEMOS.reduced) { stack.classList.add('tilt', 'apart'); requestAnimationFrame(() => { aim(); leads.forEach(l => draw(l, 1)); dots.forEach(d => d.setAttribute('opacity', 1)); labs.forEach(l => l.el.classList.add('on')); }); return () => ro.disconnect(); }
    leads.forEach(l => draw(l, 0));
    const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
    (async () => {
      await tl.wait(900);
      while (tl.alive) {
        stack.classList.add('tilt'); await tl.wait(1100);
        stack.classList.add('apart'); await tl.wait(1050); aim();
        for (let i = 0; i < 5 && tl.alive; i++) {
          const r = regions(sheets[5 - i])[i]; r.classList.add('lit'); dots[i].setAttribute('opacity', 1);
          K.tween(tl, 380, t => draw(leads[i], t)).then(() => labs[i].el.classList.add('on'));
          await tl.wait(240); r.classList.remove('lit');
        }
        await tl.wait(3000);
        labs.forEach(l => l.el.classList.remove('on')); await K.tween(tl, 320, t => leads.forEach(l => draw(l, 1 - t))); dots.forEach(d => d.setAttribute('opacity', 0));
        stack.classList.remove('apart'); await tl.wait(900);
        stack.classList.remove('tilt'); await tl.wait(1300);
        sheets.forEach(s => s.style.opacity = 0); await tl.wait(380);
        si++; set(SITES[si % SITES.length]); sheets.forEach(s => s.style.opacity = 0); await K.nextFrame(); sheets.forEach(s => s.style.opacity = 1); await tl.wait(900);
      }
    })();
    return () => { tl.destroy(); ro.disconnect(); };
  }

  /* ---------- L27 deck ---------- */
  const CH = 'abcdefghijklmnopqrstuvwxyz0123456789/._';
  function deck(stage) {
    const v = shell(stage), dk = h('div', { class: 'pz-deck' }), svg = sv('svg', { class: 'pz-svg' }), beam = sv('path', { class: 'bm', pathLength: 1 }); svg.appendChild(beam);
    const pages = SITES.map(S => page(S, true)); dk.append(...pages);
    const thumb = h('div'), fv = h('i', { class: 'fv' }), site = h('span'), ti = h('div', { class: 'pc-t fade' }), au = h('span'), ch = h('span', { class: 'ch' });
    const card = h('div', { class: 'pz-pc' }, thumb, h('div', { class: 'pc-b' }, h('div', { class: 'pc-s fade' }, fv, site), ti, h('div', { class: 'pc-a fade' }, au, ch)));
    const KV = ['type', 'title', 'author', 'site', 'html'], kvs = KV.map(() => h('span'));
    const out = h('div', { class: 'pz-out' }, card, h('div', { class: 'pz-kv' }, KV.map((k, i) => h('div', null, h('i', null, k), kvs[i]))));
    v.append(dk, svg, out);
    let order = SITES.map((_, i) => i);
    const place = () => order.forEach((p, j) => { const el = pages[p]; el.style.transform = `translate(${j * 5}%, ${-j * 4}%) rotate(${j ? (j % 2 ? 2.2 : -1.6) * Math.min(j, 2) : 0}deg) scale(${1 - j * .05})`; el.style.zIndex = 10 - j; el.style.opacity = j < 4 ? 1 : 0; });
    const size = () => { const W = v.clientWidth * .4, H = Math.min(v.clientHeight * .78, W * 1.32); dk.style.height = H + 'px'; pages.forEach(p => { p.style.height = H + 'px'; p.style.width = H / 1.32 + 'px'; });
      const a = rel(pages[order[0]], v), b = rel(card, v), sx = a.x + a.w + 6, tx = b.x - 6, mx = (sx + tx) / 2; beam.setAttribute('d', `M${sx} ${a.cy} C${mx} ${a.cy} ${mx} ${b.cy} ${tx} ${b.cy}`); };
    const vals = S => [S.k, S.title, S.author, S.host, `<iframe src="//cdn.iframe.ly/${S.id}">`];
    const fillCard = S => { thumb.replaceChildren(media(S.k)); fv.style.background = S.fav; site.textContent = S.host; ti.textContent = S.title; au.textContent = S.author; ch.textContent = S.k; };
    const ro = new ResizeObserver(size); ro.observe(v);
    place(); fillCard(SITES[0]); vals(SITES[0]).forEach((t, i) => kvs[i].textContent = t); size();
    if (DEMOS.reduced) return () => ro.disconnect();
    draw(beam, 0);
    const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
    const scramble = (el, text, ms) => K.tween(tl, ms, t => { const n = Math.floor(text.length * t); el.textContent = text.slice(0, n) + Array.from(text.slice(n, n + 8), () => CH[Math.random() * CH.length | 0]).join(''); }, t => t);
    (async () => {
      await tl.wait(700);
      while (tl.alive) {
        const S = SITES[order[0]], pg = pages[order[0]], rg = regions(pg);
        size(); await scanDown(tl, pg, 1200, i => { rg[i].classList.add('lit'); });
        await K.tween(tl, 450, t => draw(beam, t));
        card.classList.add('swap'); thumb.style.opacity = 0; await tl.wait(300);
        fillCard(S); card.classList.remove('swap'); thumb.style.opacity = 1;
        await Promise.all(vals(S).map((t, i) => tl.sleep(i * 70).then(() => scramble(kvs[i], t, 520))));
        await tl.wait(2200);
        rg.forEach(r => r.classList.remove('lit')); await K.tween(tl, 300, t => draw(beam, 1 - t));
        order.push(order.shift()); place(); await tl.wait(1000);
      }
    })();
    return () => { tl.destroy(); ro.disconnect(); };
  }

  K.heroShell = shell; /* reused by demos/logo7.js */
  DEMOS.register('logo-hero-annotate', {
    group: 'logo', title: 'Hero: the page, read and annotated',
    blurb: 'From L23, closer to the product illustrations: the URL is a real-looking page, a scan line reads it and each part gets a thin callout with what Iframely takes from it (meta, embed, preview, fulltext, access). Five sites in turn; a video page has no article body, a paywalled story gets preview only.',
    mount: annotate,
  });
  DEMOS.register('logo-hero-lens', {
    group: 'logo', title: 'Hero: a view-source lens, typed into JSON',
    blurb: 'A lens moves over the page and shows the markup under it (canonical, og:video, og:title, article, robots); as it stops on each part, that part is typed into the JSON response on the right. One request, one object, every time.',
    mount: lens,
  });
  DEMOS.register('logo-hero-layers', {
    group: 'logo', title: 'Hero: the page comes apart in layers',
    blurb: 'The page tilts into an isometric view and separates into its five layers; each layer is labelled with its result (meta, embed, preview, fulltext, access). Then it folds back and the next site loads.',
    mount: layers,
  });
  DEMOS.register('logo-hero-deck', {
    group: 'logo', title: 'Hero: five different pages, one card',
    blurb: 'A deck of very different pages (video, newspaper, music, map, code). The front one is read, and comes out on the right as the same card and the same keys every time. Then it goes to the back of the deck.',
    mount: deck,
  });
})();
