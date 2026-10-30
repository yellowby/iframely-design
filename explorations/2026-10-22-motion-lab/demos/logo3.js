/* logo-* third set (L15–L20), built on the team's picks from the first two: L02 reel, L03/L04 header path,
   L06 terminal + mark spinner, L08 unfurl as a product scene, L10 field, L12 decode. Uses DEMOS.logoKit (demos/logo.js). */
(() => {
  const K = DEMOS.logoKit, JB = K.JB;
  const FR = ['/', '-', '\\', '|'];
  const CSS = `
/* shared: the mark as a spinner (half turns look identical, so the loop is seamless) */
.lgs .spin i{display:inline-block;font-style:normal;animation:lg-rot .9s cubic-bezier(.65,0,.35,1) infinite}
.lgs .spin i+i{animation-delay:.12s}
@keyframes lg-rot{to{transform:rotate(180deg)}}

/* L15 header, scroll-aware */
.h2w{position:absolute;inset:0;display:flex;flex-direction:column}
.h2-head{position:relative;z-index:2;display:flex;align-items:center;gap:clamp(12px,2.4cqw,28px);height:68px;padding:0 clamp(14px,2.6cqw,32px);border-bottom:1px solid transparent;background:rgba(255,255,255,.94);transition:height .35s,border-color .35s;flex:none}
.h2w.cond .h2-head{height:50px;border-color:var(--lg-line)}
.h2-logo{font-size:22px;transition:font-size .35s;cursor:pointer;flex:none}
.h2w.cond .h2-logo{font-size:17px}
.h2-logo .pre,.h2-logo .tld{font-weight:400;color:#a3a3a3}
.h2-logo .p{font-weight:500;color:#5a5a5a}.h2-logo .p i{font-style:normal;color:var(--logo);font-weight:800}
.h2-logo .sl{display:inline-block;transition:transform .35s cubic-bezier(.3,1.6,.5,1)}
.h2-logo.hov .sl{transform:skewX(-12deg)}
.h2-nav{margin-left:auto;display:flex;gap:clamp(10px,2cqw,24px);font:500 14px var(--sans);color:#555}
.h2-nav a{color:inherit;text-decoration:none;padding:6px 2px;border-bottom:2px solid transparent;transition:color .2s,border-color .2s;white-space:nowrap;cursor:pointer}
.h2-nav a.on{color:var(--lg-ink);border-color:var(--logo)}
.h2-cta{height:34px;padding:0 14px;border-radius:8px;background:var(--logo);color:#fff;font:500 13px var(--sans);display:inline-flex;align-items:center;flex:none}
.h2-scroll{position:relative;flex:1;overflow-y:auto;scrollbar-width:thin}
.h2-sec{display:grid;grid-template-columns:1fr 1fr;gap:5cqw;align-items:center;padding:0 6cqw;height:clamp(230px,33cqw,470px);border-bottom:1px solid #f1f1f1}
.h2-sec .ey{font:500 11px ${JB};letter-spacing:.06em;text-transform:uppercase;color:var(--logo);margin-bottom:10px}
.h2-sec h3{margin:0 0 12px;font-family:var(--serif);font-weight:var(--fl-serif-weight,400);font-size:calc(clamp(24px,3.4cqw,46px) * var(--fl-serif-scale,1));line-height:1.04;letter-spacing:var(--fl-serif-tracking,-.01em);max-width:14ch}
.h2-sec.home h3{font-size:calc(clamp(28px,4.4cqw,60px) * var(--fl-serif-scale,1))}
.h2-sec .bars i{display:block;height:8px;border-radius:4px;background:var(--lg-bg2);margin-top:8px}
.h2-sec .vis{height:68%;border-radius:16px;background:var(--c)}
@container (max-width:820px){.h2-nav a:nth-child(n+4),.h2-cta{display:none}}

/* L16 terminal batch */
.tb{position:absolute;inset:0;background:#0b0b0c;color:#e8e8e8;font:400 clamp(10px,1.3cqw,15px)/1.8 ${JB};padding:12px clamp(14px,2.4cqw,26px) 16px;display:flex;flex-direction:column}
.tb-bar{display:flex;gap:6px;align-items:center;margin-bottom:10px;font-size:11px;color:#777}.tb-bar i{width:9px;height:9px;border-radius:50%;background:#2c2c2e}.tb-bar span{margin-left:auto}
.tb-body{white-space:pre;flex:1;min-height:0;overflow:hidden}
.tb .b{color:#6f9bff;font-weight:800}.tb .d{color:#777}.tb .g{color:#8fd3a8}.tb .r{color:#ff8a7a}.tb .w{color:#fff;font-weight:700}
.tb .cur{display:inline-block;width:.6em;height:1.1em;background:#6f9bff;vertical-align:-.2em;animation:blink 1s steps(2) infinite}

/* L17 loader kit */
.ld{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:1px;background:var(--lg-line)}
.ld-c{position:relative;background:#fff;display:grid;place-items:center;padding:28px 18px 18px;min-width:0}
.ld-c .tag{position:absolute;left:12px;top:10px;font:500 10px ${JB};letter-spacing:.06em;text-transform:uppercase;color:var(--lg-grey)}
.ld-btn{height:42px;min-width:170px;padding:0 18px;border-radius:10px;background:var(--logo);color:#fff;font:500 14px var(--sans);display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:background .3s}
.ld-btn .lg{font-size:16px}.ld-btn .sl{color:#fff}
.ld.done .ld-btn{background:#0a0a0a}
.ld-in{width:min(280px,92%);height:42px;border:1px solid var(--lg-line);border-radius:10px;display:flex;align-items:center;gap:8px;padding:0 10px 0 12px;font:400 13px ${JB};color:#333;background:#fff}
.ld-in .u{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ld-in .u .sl{font-weight:800}
.ld-in .st{font-size:14px;flex:none}
.ld-in .chip{height:24px;padding:0 8px;border-radius:6px;background:#e3ecff;color:var(--logo);font:500 11px ${JB};display:inline-flex;align-items:center}
.ld-card{width:min(260px,92%);border:1px solid var(--lg-line);border-radius:12px;overflow:hidden;position:relative}
.ld-card .th{aspect-ratio:16/8;background:var(--lg-bg2);display:grid;place-items:center;transition:background .4s}
.ld-card .th .lg{font-size:26px}
.ld.done .ld-card .th{background:#0a0a0a}
.ld.done .ld-card .th::after{content:"";border-left:18px solid #fff;border-top:11px solid transparent;border-bottom:11px solid transparent;margin-left:4px}
.ld-card .mt{padding:10px 12px 12px}.ld-card .mt i{display:block;height:8px;border-radius:4px;background:var(--lg-bg2);margin-top:6px;transition:background .4s}
.ld.done .ld-card .mt i{background:#d0d0d0}.ld.done .ld-card .mt i:first-child{background:#0a0a0a}
.ld-pb{width:min(280px,92%)}
.ld-pb .track{height:14px;border-radius:7px;background:var(--lg-bg2);overflow:hidden}
.ld-pb .fill{height:100%;width:0;border-radius:7px;background:repeating-linear-gradient(110deg,var(--logo) 0 5px,#4d84ff 5px 11px);background-size:200% 100%;animation:ld-pole 1.2s linear infinite}
@keyframes ld-pole{to{background-position:-24px 0}}
.ld-pb .row{display:flex;justify-content:space-between;margin-top:8px;font:500 11px ${JB};color:#777}
.ld-ty{font:400 15px var(--sans);color:#444;display:flex;align-items:baseline;gap:2px}
.ld-ty .dots{font:800 15px ${JB};color:var(--logo)}.ld-ty .dots i{font-style:normal;opacity:.15;animation:ld-dot 1.1s infinite}
.ld-ty .dots i:nth-child(2){animation-delay:.18s}.ld-ty .dots i:nth-child(3){animation-delay:.36s}
@keyframes ld-dot{30%{opacity:1}60%{opacity:.15}}
.ld-tab{display:flex;align-items:center;gap:9px;height:38px;padding:0 16px 0 10px;border-radius:10px 10px 0 0;background:var(--lg-bg2);font:500 13px var(--sans);color:#333;min-width:220px}
.ld-tab .fav{width:20px;height:20px;border-radius:5px;background:var(--logo);display:grid;place-items:center;flex:none}
.ld-tab .fav .lg{font-size:11px;letter-spacing:-.1em}.ld-tab .fav .sl{color:#fff}
@container (max-width:620px){.ld{grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr)}}

/* L18 reel + decode hero */
.rh{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:3cqw;align-items:center;padding:0 5cqw;background:linear-gradient(180deg,#fff,#f6f6f6 70%,#eaeff8)}
.rh-t{display:flex;flex-direction:column;gap:14px;min-width:0;position:relative;z-index:2}
.rh-t .eyebrow{font:500 12px ${JB};letter-spacing:.08em;text-transform:uppercase;color:var(--logo)}
.rh-t h1{margin:0;font-family:var(--serif);font-weight:var(--fl-serif-weight,400);font-style:var(--fl-serif-style,normal);font-size:calc(clamp(28px,4.4cqw,60px) * var(--fl-serif-scale,1));line-height:var(--fl-serif-lh,1.02);letter-spacing:var(--fl-serif-tracking,-.01em);max-width:13ch;text-wrap:balance}
.rh-t p{margin:0;color:#666;max-width:40ch;font-size:clamp(13px,1.35cqw,17px)}
.rh-t .btns{margin-top:4px}.rh-t .btn.primary{background:var(--logo)}
.rh-v{position:relative;height:88%;font-family:${JB};font-size:clamp(11px,1.45cqw,19px);-webkit-mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent);mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent)}
.rh-band{position:absolute;left:0;right:0;top:50%;height:1.9em;transform:translateY(-50%);background:#fff;border:1px solid #dfe7ff;border-radius:.5em;box-shadow:0 10px 30px -18px rgba(0,60,200,.35)}
.rh-track{position:absolute;left:0;right:0;top:50%;will-change:transform}
.rh-row{transition:opacity .3s;display:grid;grid-template-columns:5.5em auto 1fr;height:1.9em;align-items:center;color:#c2c2c2;white-space:pre;padding:0 .8em}
.rh-row .l{text-align:right}.rh-row .r{overflow:hidden}
.rh-row .s{color:var(--logo);font-weight:800;opacity:.35}
.rh-row.hit{color:#0a0a0a}.rh-row.hit .l{color:#8a8a8a}.rh-row.hit .s{opacity:1}.rh-row.us .r{font-weight:700}
.rh-chip{position:absolute;left:6.3em;top:calc(50% + 1.35em);display:flex;gap:.5em;align-items:center;font-size:.72em;opacity:0;transform:translateY(-4px);transition:opacity .3s,transform .3s}
.rh-chip.on{opacity:1;transform:none}
.rh-chip span{height:2em;padding:0 .8em;border-radius:.5em;display:inline-flex;align-items:center;background:#e3ecff;color:var(--logo);font-weight:500}
.rh-chip span+span{background:#fff;color:#666;border:1px solid var(--lg-line)}
@container (max-width:620px){.rh{grid-template-columns:1fr;align-content:center}.rh-v{height:200px}}

/* L19 unfurl in three apps */
.ua{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4cqw;align-items:center;padding:0 5cqw;background:#fff}
.ua-t{display:flex;flex-direction:column;gap:12px}
.ua-t .eyebrow{font:500 12px ${JB};letter-spacing:.08em;text-transform:uppercase;color:var(--logo)}
.ua-t h2{margin:0;font-family:var(--serif);font-weight:var(--fl-serif-weight,400);font-size:calc(clamp(24px,3.4cqw,46px) * var(--fl-serif-scale,1));line-height:1.04;letter-spacing:var(--fl-serif-tracking,-.01em);text-wrap:balance}
.ua-t p{margin:0;color:#666;max-width:38ch;font-size:clamp(13px,1.3cqw,16px)}
.ua-tabs{display:flex;gap:6px;margin-top:4px}.ua-tabs span{height:28px;padding:0 10px;border-radius:7px;border:1px solid var(--lg-line);display:inline-flex;align-items:center;font:500 12px ${JB};color:#888;transition:all .3s}
.ua-tabs span.on{background:#0a0a0a;border-color:#0a0a0a;color:#fff}
.ua-s{position:relative;height:84%;border-radius:18px;background:#f3f6ff;overflow:hidden}
.ua-app{position:absolute;inset:6% 7%;background:#fff;border:1px solid var(--lg-line);border-radius:14px;box-shadow:0 18px 50px -30px rgba(0,0,0,.4);display:flex;flex-direction:column;overflow:hidden;font:400 14px/1.5 var(--sans);transition:opacity .35s,transform .35s}
.ua-app.out{opacity:0;transform:translateY(10px)}
.ua-bar{height:32px;flex:none;display:flex;align-items:center;gap:6px;padding:0 12px;border-bottom:1px solid var(--lg-line);background:#fbfbfb;font:500 11px ${JB};color:#8a8a8a}.ua-bar i{width:8px;height:8px;border-radius:50%;background:#e2e2e2}.ua-bar span{margin-left:8px}
.ua-body{flex:1;padding:16px 18px;overflow:hidden;display:flex;flex-direction:column;gap:8px;min-height:0}
.ua-body.chat{justify-content:flex-end}.ua-body.chat .ua-in .th{aspect-ratio:16/6}
.ua-body .bar{height:8px;border-radius:4px;background:var(--lg-bg2)}
.ua-body h4{margin:0 0 4px;font:600 20px/1.2 var(--sans);letter-spacing:-.01em}
.ua-msg{display:flex;gap:10px}.ua-av{width:30px;height:30px;border-radius:50%;flex:none;display:grid;place-items:center;font:600 12px var(--sans)}
.ua-who{font-weight:600;font-size:13px}.ua-who span{font-weight:400;color:#9a9a9a;font-size:11px;margin-left:6px}
.ua-url{font-family:${JB};font-size:.88em;text-decoration:underline;text-decoration-color:#cfcfcf;text-underline-offset:3px;overflow-wrap:anywhere}
.ua-url .sl{font-weight:800;transition:color .3s}.ua-url.lit .sl{color:var(--logo)}
.ua-card{display:grid;grid-template-rows:0fr;transition:grid-template-rows .7s cubic-bezier(.6,0,.2,1)}.ua-card.open{grid-template-rows:1fr}.ua-card>div{overflow:hidden;min-height:0}
.ua-in{border:1px solid var(--lg-line);border-radius:10px;overflow:hidden;margin-top:6px}
.ua-in.row{display:flex}.ua-in.row .th{width:34%;aspect-ratio:auto}
.ua-in .th{aspect-ratio:16/7;display:grid;place-items:center}
.ua-in .th.play{background:#0a0a0a}.ua-in .th.play::after{content:"";border-left:18px solid #fff;border-top:11px solid transparent;border-bottom:11px solid transparent;margin-left:4px}
.ua-in .th.read{background:linear-gradient(135deg,#d8e7ff,#e4e3fb)}.ua-in .th.map{background:#dcefe2;background-image:linear-gradient(#bfdcc8 1px,transparent 1px),linear-gradient(90deg,#bfdcc8 1px,transparent 1px);background-size:16px 16px}
.ua-meta{padding:8px 12px 10px;display:flex;align-items:flex-end;gap:10px;flex:1;min-width:0}
.ua-meta .t{font-weight:600;font-size:13px;line-height:1.3}.ua-meta .d{font-size:11px;color:#8a8a8a}
.ua-badge{margin-left:auto;font-size:11px;opacity:0;transition:opacity .2s;flex:none}.ua-badge.on{opacity:1}.ua-badge .w{color:#8a8a8a;font-weight:500}
.ua-tool{display:flex;gap:6px;margin-bottom:4px}.ua-tool i{width:22px;height:22px;border-radius:5px;background:var(--lg-bg2)}
.ua-slash{font:500 12px ${JB};color:#9a9a9a}
.ua-fly{position:absolute;left:0;top:0;font-family:${JB};font-weight:800;color:var(--logo);pointer-events:none;transform-origin:0 0;z-index:5;white-space:pre}
@container (max-width:620px){.ua{grid-template-columns:1fr;align-content:center}.ua-s{height:300px}}

/* L20 field CTA */
.fc{position:absolute;inset:0;background:#fff}
.fc-in{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;padding:28px 36px;background:#fff;border-radius:20px;pointer-events:none}
.fc-in h2{margin:0;color:var(--lg-ink);font-family:var(--serif);font-weight:var(--fl-serif-weight,400);font-size:calc(clamp(28px,4.6cqw,64px) * var(--fl-serif-scale,1));line-height:1;letter-spacing:var(--fl-serif-tracking,-.01em)}
.fc-in p{margin:0;color:#666;font-size:clamp(13px,1.3cqw,16px)}
.fc-form{display:flex;gap:6px;padding:5px;border-radius:12px;background:#fff;border:1px solid var(--lg-line);box-shadow:0 10px 30px -18px rgba(0,0,0,.3);pointer-events:auto}
.fc-form .u{width:clamp(200px,26cqw,340px);height:40px;display:flex;align-items:center;padding:0 12px;font:400 14px ${JB};color:#333;white-space:nowrap;overflow:hidden;text-align:left}
.fc-form .u .sl{color:var(--logo);font-weight:800}.fc-form .u .ph{color:#a3a3a3}
.fc-form button{height:40px;padding:0 16px;border:0;border-radius:8px;background:var(--logo);color:#fff;font:500 14px var(--sans);cursor:pointer}
`;
  const ensure = () => { K.ensureCss(); if (!document.getElementById('css-logo3')) document.head.appendChild(DEMOS.h('style', { id: 'css-logo3' }, CSS)); };
  const spinner = () => DEMOS.h('span', { class: 'sl spin' }, DEMOS.h('i', null, '/'), DEMOS.h('i', null, '/'));
  /* a text slot that types/deletes toward a target string, rendered by fn */
  function stepper(render) { const s = { cur: '', target: '', render }; s.step = () => { if (s.cur === s.target) return; s.cur = s.target.startsWith(s.cur) ? s.target.slice(0, s.cur.length + 1) : s.cur.slice(0, -1); s.render(s.cur); }; return s; }

  DEMOS.register('logo-header2', {
    group: 'logo', title: 'Header v2: path follows the scroll, scheme on hover',
    blurb: 'L03 + L04 in one header. The path after //iframely follows the section in view as the page scrolls (scroll-spy) and types itself; nav clicks scroll there. Hovering the logo types the rest of the address around it (https: … .com) and leans the slashes. Past the hero the header condenses. Auto-scrolls until you hover; then scroll it yourself.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const S = [['', 'Home', 'Iframely makes URLs work inside other products', '#eef3ff'], ['/embeds', 'Rich Media', 'Rich embeds for every URL', '#fadbe5'], ['/preview-api', 'Preview API', 'Link previews that know the page', '#d8e7ff'], ['/data-api', 'Data API', 'Structured data from any link', '#dcefe2'], ['/publishers', 'Publishers', 'Decide how your links travel', '#f6ebc8'], ['/pricing', 'Pricing', 'Pay per thousand reads', '#efefef']];
      const pre = h('span', { class: 'pre' }), tld = h('span', { class: 'tld' }), pth = h('span', { class: 'p' });
      const logo = h('div', { class: 'h2-logo lg' }, pre, h('span', { class: 'sl' }, '//'), 'iframely', tld, pth);
      const nav = h('div', { class: 'h2-nav' }); const items = S.slice(1).map((s, i) => { const a = h('a', null, s[1]); nav.appendChild(a); return a; });
      const sc = h('div', { class: 'h2-scroll' });
      const secs = S.map((s, i) => { const el = h('section', { class: 'h2-sec' + (i ? '' : ' home'), style: '--c:' + s[3] }, h('div', null, h('div', { class: 'ey' }, i ? s[1] : 'Iframely · API for URLs'), h('h3', null, s[2]), h('div', { class: 'bars' }, h('i', { style: 'width:80%' }), h('i', { style: 'width:62%' }), h('i', { style: 'width:40%' }))), h('div', { class: 'vis' })); sc.appendChild(el); return el; });
      const wrap = h('div', { class: 'h2w' }, h('div', { class: 'h2-head' }, logo, nav, h('span', { class: 'h2-cta' }, 'Get an API key')), sc);
      stage.append(wrap);
      const P = stepper(v => pth.replaceChildren(...K.slashy(v))), A = stepper(v => { pre.textContent = v; }), B = stepper(v => { tld.textContent = v; });
      const iv = setInterval(() => { if (DEMOS.offscreen(stage)) return; P.step(); A.step(); B.step(); }, 32);
      const spy = () => { const y = sc.scrollTop + sc.clientHeight * .4; let k = 0; secs.forEach((el, i) => { if (el.offsetTop <= y) k = i; }); P.target = S[k][0]; items.forEach((a, i) => a.classList.toggle('on', i + 1 === k)); wrap.classList.toggle('cond', sc.scrollTop > 24); };
      sc.addEventListener('scroll', spy, { passive: true });
      const hover = on => { logo.classList.toggle('hov', on); A.target = on ? 'https:' : ''; B.target = on ? '.com' : ''; };
      logo.addEventListener('pointerenter', () => hover(true)); logo.addEventListener('pointerleave', () => hover(false));
      logo.addEventListener('click', () => sc.scrollTo({ top: 0, behavior: 'smooth' }));
      items.forEach((a, i) => a.addEventListener('click', () => sc.scrollTo({ top: secs[i + 1].offsetTop, behavior: 'smooth' })));
      if (DEMOS.reduced) { sc.scrollTop = secs[2].offsetTop; spy(); P.cur = P.target; P.render(P.cur); return () => clearInterval(iv); }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        let n = 0; const order = [1, 2, 3, 4, 5, 0];
        await tl.wait(1200);
        while (tl.alive) {
          const i = order[n++ % order.length]; const from = sc.scrollTop, to = secs[i].offsetTop;
          await K.tween(tl, 1000, t => { sc.scrollTop = from + (to - from) * t; });
          await tl.wait(1500);
          if (i === 2 || i === 0) { hover(true); await tl.wait(1800); hover(false); await tl.wait(600); }
        }
      })();
      return () => { tl.destroy(); clearInterval(iv); };
    },
  });

  DEMOS.register('logo-term-batch', {
    group: 'logo', title: 'Terminal batch: [//] for every resolved link',
    blurb: 'L06\'s terminal idea grown into a batch run. Eight links resolve in parallel, each with its own two-slash spinner; a resolved row settles into a blue [//], a failed one into a red [--]. The progress bar is drawn with slashes too. Works as a hero visual for developers or as the CLI\'s real output.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const ROWS = [['youtube.com/watch?v=dQw4w9WgXcQ', 'player · 16:9 · 67 ms'], ['open.spotify.com/track/4uLU6hMC', 'audio · 152×80 · 88 ms'], ['nytimes.com/2026/10/21/technology/web-glue', 'reader · 6 min · 212 ms'], ['figma.com/design/VmgHd0uy7JfPNckK470cHJ', 'app · responsive · 131 ms'], ['maps.google.com/?q=50.4501,30.5234', 'map · 4:3 · 74 ms'], ['x.com/iframely/status/1849213', 'post · 1 image · 96 ms'], ['example.com/old/deleted-page', null], ['github.com/itteco/iframely', 'card · 1200×600 · 58 ms']];
      const body = h('div', { class: 'tb-body' });
      stage.append(h('div', { class: 'tb' }, h('div', { class: 'tb-bar' }, h('i'), h('i'), h('i'), h('span', null, 'iframely — batch')), body));
      const line = (...k) => { const el = h('div', null, ...k); body.appendChild(el); return el; };
      const pad = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s + ' '.repeat(n - s.length);
      const W = stage.clientWidth < 700 ? 30 : 44, BAR = 24;
      const bar = (done, total) => { const k = Math.round(done / total * BAR); return [h('span', { class: 'd' }, '  ['), h('span', { class: 'b' }, '/'.repeat(k)), h('span', { class: 'd' }, '·'.repeat(BAR - k) + '] '), done + '/' + total]; };
      const finalRow = ([u, r]) => [h('span', { class: 'd' }, '  ['), r ? h('span', { class: 'b' }, '//') : h('span', { class: 'r' }, '--'), h('span', { class: 'd' }, '] '), pad(u, W), r ? h('span', { class: 'g' }, r) : h('span', { class: 'r' }, '410 · gone')];
      if (DEMOS.reduced) { line(h('span', { class: 'b' }, '$ '), 'iframely check --batch links.txt'); line(''); ROWS.forEach(R => line(...finalRow(R))); line(''); line(...bar(8, 8)); line(h('span', { class: 'd' }, '  7 resolved · 1 failed · 0.9 s')); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        while (tl.alive) {
          body.innerHTML = '';
          const cmd = line(h('span', { class: 'b' }, '$ '), h('span', null, ''), h('span', { class: 'cur' })); const txt = cmd.children[1];
          await tl.wait(500); for (const ch of 'iframely check --batch links.txt') { if (!tl.alive) return; txt.textContent += ch; await tl.sleep(26 + Math.random() * 30); }
          await tl.wait(300); cmd.lastChild.remove(); line('');
          const rows = ROWS.map((R, i) => { const sp = h('span', { class: 'b' }, '  '), st = h('span', { class: 'd' }, 'fetching'); const el = line(h('span', { class: 'd' }, '  ['), sp, h('span', { class: 'd' }, '] '), pad(R[0], W), st); return { R, el, sp, st, at: 500 + Math.random() * 2300 + i * 90, done: false, ph: i }; });
          line(''); const pb = line(...bar(0, 8));
          const t0 = performance.now(); let q = 0, done = 0;
          while (tl.alive && done < rows.length) {
            const t = performance.now() - t0; q++;
            for (const r of rows) {
              if (r.done) continue;
              if (t > r.at) { r.done = true; done++; r.el.replaceChildren(...finalRow(r.R)); continue; }
              const f = q + r.ph; r.sp.textContent = FR[f % 4] + FR[(f + 1) % 4];
              if (t > r.at - 400) r.st.textContent = 'parsing';
            }
            pb.replaceChildren(...bar(done, rows.length));
            await tl.sleep(90);
          }
          line(h('span', { class: 'd' }, '  7 resolved · 1 failed · ' + ((performance.now() - t0) / 1000).toFixed(1) + ' s'));
          line(''); line(h('span', { class: 'b' }, '$ '), h('span', { class: 'cur' }));
          await tl.wait(3600);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-loaders', {
    group: 'logo', title: 'Loader kit: the mark as every loading state',
    blurb: 'L06\'s spinning slashes as a small UI kit, all on one beat: a button, a URL field that ends in a type chip, a card skeleton, a progress bar striped at the slash angle, a typing indicator with three slashes for dots, and a favicon in a browser tab. Pure CSS spin (a half turn of a slash looks the same, so the loop is seamless).',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const cell = (tag, ...k) => h('div', { class: 'ld-c' }, h('span', { class: 'tag' }, tag), ...k);
      const btn = h('span', { class: 'ld-btn' }), inSt = h('span', { class: 'st' }), card = h('div', { class: 'ld-card' }, h('div', { class: 'th' }, h('span', { class: 'lg' })), h('div', { class: 'mt' }, h('i', { style: 'width:70%' }), h('i', { style: 'width:45%' })));
      const fill = h('div', { class: 'fill' }), pct = h('span', null, '0%'), pbl = h('span', null, 'resolving');
      const ty = h('div', { class: 'ld-ty' }), tab = h('div', { class: 'ld-tab' }), fav = h('span', { class: 'fav' }, h('span', { class: 'lg' })), tabT = h('span', null);
      tab.append(fav, tabT);
      const root = h('div', { class: 'ld' },
        cell('button', btn),
        cell('url field', h('div', { class: 'ld-in' }, h('span', { class: 'u' }, 'https:', h('span', { class: 'sl' }, '//'), 'youtu.be/dQw4w9WgXcQ'), inSt)),
        cell('card skeleton', card),
        cell('progress', h('div', { class: 'ld-pb' }, h('div', { class: 'track' }, fill), h('div', { class: 'row' }, pbl, pct))),
        cell('typing', ty),
        cell('tab', tab));
      stage.appendChild(root);
      const markEl = () => h('span', { class: 'sl' }, '//');
      const set = state => {
        const L = state === 'loading';
        root.classList.toggle('done', state === 'done');
        btn.replaceChildren(...(L ? [h('span', { class: 'lg' }, spinner()), 'Checking'] : state === 'done' ? ['✓ Player found'] : ['Check a URL']));
        inSt.replaceChildren(L ? h('span', { class: 'lg' }, spinner()) : state === 'done' ? h('span', { class: 'chip' }, 'player') : '');
        card.querySelector('.th .lg').replaceChildren(L ? spinner() : '');
        ty.replaceChildren(...(state === 'done' ? ['Read 1,240 words ', h('span', { class: 'lg' }, markEl())] : ['Iframely is reading the page', h('span', { class: 'dots' }, h('i', null, '/'), h('i', null, '/'), h('i', null, '/'))]));
        fav.firstChild.replaceChildren(L ? spinner() : markEl()); tabT.textContent = L ? 'Loading…' : 'Check a URL · Iframely';
        if (!L) { fill.style.width = state === 'done' ? '100%' : '0%'; pct.textContent = state === 'done' ? '100%' : '0%'; pbl.textContent = state === 'done' ? 'done' : 'idle'; }
      };
      if (DEMOS.reduced) { set('done'); return () => {}; }
      set('idle');
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        while (tl.alive) {
          set('idle'); await tl.wait(1200);
          set('loading'); pbl.textContent = 'resolving';
          await K.tween(tl, 2200, t => { fill.style.width = (t * 100) + '%'; pct.textContent = Math.round(t * 100) + '%'; }, t => t);
          set('done'); await tl.wait(2200);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-hero-reel', {
    group: 'logo', pick: 'pick · hero', title: 'Hero: reel + decode, landing on a result',
    blurb: 'L02 and L12 in a hero (text left, visual right). A reel of links aligned on the // column scrolls as unreadable noise; when it stops, the row in the band decodes into a real URL and a chip says what Iframely made of it. Every fourth stop decodes into //iframely.',
    mount(stage) {
      ensure(); const { h } = DEMOS; const C = DEMOS.HERO;
      const STOPS = [['https:', 'youtube.com/watch?v=dQw4w9', ['player', '16:9 · 67 ms']], ['https:', 'nytimes.com/2026/10/21/tech', ['article', 'reader · 6 min']], ['https:', 'maps.google.com/?q=kyiv', ['map', '4:3 · 74 ms']], ['', 'iframely', ['//iframely', 'makes URLs work']], ['https:', 'open.spotify.com/track/4uLU6', ['audio', '152×80 · 88 ms']], ['http:', 'figma.com/design/VmgHd0uy', ['app', 'responsive · signed']], ['https:', 'x.com/iframely/status/1849', ['post', '1 image · 96 ms']], ['', 'iframely', ['//iframely', 'makes URLs work']]];
      const NOISE = 'abcdefghijklmnopqrstuvwxyz0123456789-._?=&';
      const rnd = n => { let s = ''; for (let i = 0; i < n; i++) s += NOISE[Math.floor(Math.random() * NOISE.length)]; return s; };
      const ROWS = 64, track = h('div', { class: 'rh-track' }), rows = [];
      for (let i = 0; i < ROWS; i++) { const l = h('span', { class: 'l' }), r = h('span', { class: 'r' }); const el = h('div', { class: 'rh-row' }, l, h('span', { class: 's' }, '//'), r); rows.push({ el, l, r, ll: 3 + Math.floor(Math.random() * 3), rl: 12 + Math.floor(Math.random() * 16) }); track.appendChild(el); }
      const reroll = R => { R.l.textContent = rnd(R.ll) + ':'; R.r.textContent = rnd(R.rl); R.el.className = 'rh-row'; };
      rows.forEach(reroll);
      const chip = h('div', { class: 'rh-chip' });
      stage.appendChild(h('div', { class: 'rh' },
        h('div', { class: 'rh-t' }, h('div', { class: 'eyebrow' }, C.eyebrow), h('h1', null, C.title), h('p', null, C.text), h('div', { class: 'btns' }, h('a', { class: 'btn primary', href: '#' }, C.cta), h('a', { class: 'btn secondary', href: '#' }, 'Check a URL'))),
        h('div', { class: 'rh-v' }, h('div', { class: 'rh-band' }), track, chip)));
      let p = 8; const place = v => { track.style.transform = 'translateY(' + (-(v + .5) * 1.9) + 'em)'; };
      const showChip = c => chip.replaceChildren(h('span', null, c[0]), h('span', null, c[1]));
      const decode = async (R, [a, b, c], tl) => {
        const L = a, Rr = b; const steps = 14;
        for (let f = 0; f <= steps && tl.alive; f++) {
          const k = f / steps;
          const mix = (target, len) => { let s = ''; const n = Math.max(target.length, Math.round(len + (target.length - len) * k)); for (let i = 0; i < n; i++) s += i < target.length * k ? (target[i] || '') : (i < target.length ? NOISE[Math.floor(Math.random() * NOISE.length)] : (Math.random() < 1 - k ? NOISE[Math.floor(Math.random() * NOISE.length)] : '')); return s; };
          R.l.textContent = mix(L, R.ll + 1); R.r.textContent = mix(Rr, R.rl);
          await tl.sleep(45);
        }
        R.l.textContent = L; R.r.textContent = Rr; R.el.classList.add('hit'); if (!a) R.el.classList.add('us');
      };
      place(p);
      if (DEMOS.reduced) { const R = rows[p]; R.l.textContent = ''; R.r.textContent = 'iframely'; R.el.className = 'rh-row hit us'; showChip(STOPS[3][2]); chip.classList.add('on'); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const shimmer = setInterval(() => { if (DEMOS.paused || stage.matches(':hover') || DEMOS.offscreen(stage)) return; for (let k = 0; k < 6; k++) { const R = rows[Math.floor(Math.random() * ROWS)]; if (!R.el.classList.contains('hit')) reroll(R); } }, 90);
      (async () => {
        let n = 0;
        while (tl.alive) {
          const S = STOPS[n++ % STOPS.length];
          chip.classList.remove('on'); rows[p].el.classList.remove('hit', 'us'); reroll(rows[p]); rows[p + 1].el.style.opacity = '';
          const from = p, to = p + 6 + Math.floor(Math.random() * 4);
          await K.tween(tl, 1500, t => place(from + (to - from) * t), K.ease.out);
          p = to; await decode(rows[p], S, tl);
          showChip(S[2]); chip.classList.add('on'); rows[p + 1].el.style.opacity = 0;
          await tl.wait(S[0] ? 1900 : 2600);
          if (p > ROWS - 14) { chip.classList.remove('on'); rows[p].el.classList.remove('hit', 'us'); rows[p + 1].el.style.opacity = ''; rows.forEach(reroll); p = 8; place(p); }
        }
      })();
      return () => { tl.destroy(); clearInterval(shimmer); };
    },
  });

  DEMOS.register('logo-unfurl-apps', {
    group: 'logo', pick: 'pick · product scene', title: 'Product scene: one link, three apps',
    blurb: 'L08 grown into a Preview API scene (text left, visual right). The same move in a chat, a doc and a CMS: a link is pasted, its // light up, the preview unfolds in that app\'s own shape (card, bookmark row, player block), and the slashes fly into the corner as the credit.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const tabs = ['Chat', 'Docs', 'CMS'].map(t => h('span', null, t));
      const S = h('div', { class: 'ua-s' });
      stage.appendChild(h('div', { class: 'ua' },
        h('div', { class: 'ua-t' }, h('div', { class: 'eyebrow' }, 'Preview API · use case'), h('h2', null, 'Every pasted link arrives with its preview'), h('p', null, 'Chat, docs or a CMS: the same URL unfolds into the shape each app needs, from one API call.'), h('div', { class: 'ua-tabs' }, tabs)),
        S));
      const urlEls = (pre, rest) => { const sl = h('span', { class: 'sl' }, ''), a = h('span', null, ''), b = h('span', null, ''); return { url: h('span', { class: 'ua-url' }, a, sl, b), parts: [[a, pre], [sl, '//'], [b, rest]], sl }; };
      const badge = () => h('span', { class: 'ua-badge lg' }, h('span', { class: 'sl' }, '//'), h('span', { class: 'w' }, 'iframely'));
      const cardOf = (inner) => h('div', { class: 'ua-card' }, h('div', null, inner));
      const APPS = [
        () => { const U = urlEls('https:', 'youtube.com/watch?v=dQw4w9'); const b = badge(); const lead = h('span', null, ''); const card = cardOf(h('div', { class: 'ua-in' }, h('div', { class: 'th play' }), h('div', { class: 'ua-meta' }, h('div', null, h('div', { class: 't' }, 'Never Gonna Give You Up'), h('div', { class: 'd' }, 'YouTube · 3:33')), b)));
          const body = h('div', { class: 'ua-body chat' }, h('div', { class: 'ua-msg' }, h('div', { class: 'ua-av', style: 'background:#dcefe2' }, 'M'), h('div', null, h('div', { class: 'ua-who' }, 'Mia', h('span', null, '10:40')), 'standup in 5')), h('div', { class: 'ua-msg' }, h('div', { class: 'ua-av', style: 'background:#fadbe5' }, 'A'), h('div', { style: 'flex:1;min-width:0' }, h('div', { class: 'ua-who' }, 'Alex', h('span', null, '10:42')), h('div', null, lead, U.url), card)));
          return { title: '#design — Chat', body, lead: [lead, 'for the demo reel '], U, card, b }; },
        () => { const U = urlEls('https:', 'nytimes.com/2026/10/21/technology/web-glue'); const b = badge(); const card = cardOf(h('div', { class: 'ua-in row' }, h('div', { class: 'th read' }), h('div', { class: 'ua-meta' }, h('div', null, h('div', { class: 't' }, 'The quiet software that holds the web together'), h('div', { class: 'd' }, 'The New York Times · 6 min')), b)));
          const body = h('div', { class: 'ua-body' }, h('h4', null, 'Launch plan'), h('div', { class: 'bar', style: 'width:92%' }), h('div', { class: 'bar', style: 'width:78%' }), h('div', { class: 'bar', style: 'width:64%' }), h('div', { style: 'margin-top:6px' }, U.url), card, h('div', { class: 'bar', style: 'width:70%;margin-top:6px' }));
          return { title: 'Launch plan — Docs', body, U, card, b }; },
        () => { const U = urlEls('https:', 'maps.google.com/?q=50.4501,30.5234'); const b = badge(); const card = cardOf(h('div', { class: 'ua-in' }, h('div', { class: 'th map' }), h('div', { class: 'ua-meta' }, h('div', null, h('div', { class: 't' }, 'Kyiv'), h('div', { class: 'd' }, 'Google Maps · interactive')), b)));
          const body = h('div', { class: 'ua-body' }, h('div', { class: 'ua-tool' }, h('i'), h('i'), h('i'), h('i')), h('h4', null, 'Weekly picks: where we met'), h('div', { class: 'bar', style: 'width:88%' }), h('div', { class: 'bar', style: 'width:70%' }), h('div', { style: 'margin-top:6px' }, h('span', { class: 'ua-slash' }, '/embed '), U.url), card);
          return { title: 'Weekly picks — CMS', body, U, card, b }; },
      ];
      if (DEMOS.reduced) { const A = APPS[0](); S.appendChild(h('div', { class: 'ua-app' }, h('div', { class: 'ua-bar' }, h('i'), h('i'), h('i'), h('span', null, A.title)), A.body)); A.U.parts.forEach(([el, s]) => { el.textContent = s; }); A.lead[0].textContent = A.lead[1]; A.U.url.classList.add('lit'); A.card.classList.add('open'); A.b.classList.add('on'); tabs[0].classList.add('on'); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        let n = 0, prev = null;
        while (tl.alive) {
          const k = n++ % APPS.length, A = APPS[k](); tabs.forEach((t, i) => t.classList.toggle('on', i === k));
          if (prev) { prev.classList.add('out'); await tl.wait(350); prev.remove(); }
          const app = h('div', { class: 'ua-app out' }, h('div', { class: 'ua-bar' }, h('i'), h('i'), h('i'), h('span', null, A.title)), A.body); S.appendChild(app); prev = app;
          await K.nextFrame(); app.classList.remove('out'); await tl.wait(600);
          if (A.lead) for (const ch of A.lead[1]) { if (!tl.alive) return; A.lead[0].textContent += ch; await tl.sleep(24); }
          for (const [el, s] of A.U.parts) for (const ch of s) { if (!tl.alive) return; el.textContent += ch; await tl.sleep(8); }
          await tl.wait(600); A.U.url.classList.add('lit');
          await tl.wait(500); A.card.classList.add('open'); await tl.wait(900);
          const s = stage.getBoundingClientRect(), a = A.U.sl.getBoundingClientRect(), bEl = A.b.firstChild, b = bEl.getBoundingClientRect();
          const fly = h('span', { class: 'ua-fly' }, '//'); const fs = parseFloat(getComputedStyle(A.U.sl).fontSize); fly.style.fontSize = fs + 'px'; stage.appendChild(fly);
          const sc = parseFloat(getComputedStyle(bEl).fontSize) / fs; A.U.sl.style.visibility = 'hidden';
          await K.tween(tl, 850, t => { const x = a.left - s.left + (b.left - a.left) * t, y = a.top - s.top + (b.top - a.top) * t - Math.sin(t * Math.PI) * 50; fly.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + (1 + (sc - 1) * t) + ')'; });
          A.b.classList.add('on'); fly.remove(); A.U.sl.style.visibility = '';
          await tl.wait(2600);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-field-cta', {
    group: 'logo', pick: 'pick · CTA', title: 'Field CTA: a white block of //, ripples on check',
    blurb: 'L10 as a white CTA block. The // field is light grey; the pointer turns nearby marks blue. Pressing Check (or clicking anywhere) sends a ring out from that point that flips the marks as it passes. Without a pointer, a URL types into the field and the button presses itself.',
    mount(stage) {
      ensure(); const { h } = DEMOS;
      const cv = DEMOS.canvas2d(stage); const p = DEMOS.pointer(stage);
      const u = h('div', { class: 'u' }), btn = h('button', { type: 'button' }, 'Check');
      const box = h('div', { class: 'fc-in' }, h('h2', null, 'Start with one URL'), h('p', null, 'Paste a link and see what Iframely makes of it.'), h('div', { class: 'fc-form' }, u, btn));
      stage.prepend(h('div', { class: 'fc' })); stage.appendChild(box);
      const rings = []; const ring = (x, y) => rings.push({ x, y, t: performance.now() });
      const fromBtn = () => { const s = stage.getBoundingClientRect(), r = btn.getBoundingClientRect(); ring(r.left - s.left + r.width / 2, r.top - s.top + r.height / 2); };
      btn.addEventListener('click', e => { e.stopPropagation(); fromBtn(); });
      stage.addEventListener('pointerdown', e => { if (e.target === btn) return; const s = stage.getBoundingClientRect(); ring(e.clientX - s.left, e.clientY - s.top); });
      const setU = s => { if (!s) { u.replaceChildren(h('span', { class: 'ph' }, 'https://')); return; } const i = s.indexOf('//'); u.replaceChildren(...(i < 0 ? [s] : [s.slice(0, i), h('span', { class: 'sl' }, s.slice(i, i + 2)), s.slice(i + 2)])); };
      setU('');
      const BASE = -70 * Math.PI / 180;
      const draw = t => {
        const { w, h: H } = cv.resize(), c = cv.ctx; c.clearRect(0, 0, w, H); p.smooth(.12);
        const step = Math.max(22, Math.min(32, w / 42)), sr = stage.getBoundingClientRect(), br = box.getBoundingClientRect();
        const bx0 = br.left - sr.left, bx1 = br.right - sr.left, by0 = br.top - sr.top, by1 = br.bottom - sr.top;
        const now = performance.now(); for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t > 2600) rings.splice(i, 1);
        for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < w; x += step) {
          if (x > bx0 && x < bx1 && y > by0 && y < by1) continue;
          let a = BASE + Math.sin(x * .011 + t * .6) * Math.cos(y * .014 - t * .45) * .3, k = 0;
          if (p.inside) { const d = Math.hypot(p.sx - x, p.sy - y); k = Math.max(0, 1 - d / 170); }
          for (const r of rings) { const age = (now - r.t) / 1000, rad = age * 520, d = Math.hypot(r.x - x, r.y - y), band = Math.max(0, 1 - Math.abs(d - rad) / 60) * Math.max(0, 1 - age / 2.6); if (band > 0) { a += band * Math.PI; k = Math.max(k, band); } }
          const len = step * (.3 + .25 * k), ca = Math.cos(a), sa = Math.sin(a), off = step * .12, nx = -sa * off, ny = ca * off;
          c.strokeStyle = k > .04 ? DEMOS.mix('#d6d6d6', '#0055ff', Math.min(1, k * 1.5)) : '#dddddd'; c.lineWidth = 1.6 + k * 1.2;
          c.beginPath(); for (const s of [-1, 1]) { const cx = x + nx * s, cy = y + ny * s; c.moveTo(cx - ca * len / 2, cy - sa * len / 2); c.lineTo(cx + ca * len / 2, cy + sa * len / 2); } c.stroke();
        }
      };
      const lp = DEMOS.loop(stage, draw);
      if (DEMOS.reduced) { setU('https://youtu.be/dQw4w9WgXcQ'); return () => { lp.destroy(); p.destroy(); cv.destroy(); }; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        const URLS = ['https://youtu.be/dQw4w9WgXcQ', 'https://open.spotify.com/track/4uLU6hMC', 'https://nytimes.com/2026/10/21/tech'];
        let n = 0;
        while (tl.alive) {
          const U = URLS[n++ % URLS.length]; await tl.wait(900);
          for (let i = 1; i <= U.length; i++) { if (!tl.alive) return; setU(U.slice(0, i)); await tl.sleep(30 + Math.random() * 30); }
          await tl.wait(500); btn.style.transform = 'scale(.95)'; await tl.sleep(120); btn.style.transform = ''; fromBtn();
          await tl.wait(2600); setU('');
        }
      })();
      return () => { tl.destroy(); lp.destroy(); p.destroy(); cv.destroy(); };
    },
  });
})();
