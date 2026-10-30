/* logo-* · the final //iframely mark in motion (Figma "Logo 2" → frame "final": JetBrains Mono 24, "//" ExtraBold #0055ff,
   "iframely" Bold black). One idea runs through all of them: the two slashes are the slashes of a URL.
   Group 'logo', mount(stage). Plain DOM, CSS transitions and a small rAF tween; no library needed. */
(() => {
  const JB = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
  const CSS = `
.lgs{position:absolute;inset:0;overflow:hidden;background:#fff;color:#0a0a0a;--logo:#0055ff;--lg-ink:#0a0a0a;--lg-grey:#9a9a9a;--lg-line:#e6e6e6;--lg-bg2:#f6f6f6;container-type:inline-size}
.lg{font-family:${JB};font-weight:700;white-space:pre;line-height:1;letter-spacing:0}
.lg .sl{font-weight:800;color:var(--logo)}
.lg-cap{position:absolute;left:clamp(14px,3cqw,28px);bottom:clamp(12px,2.6cqw,24px);font:500 11px/1.4 ${JB};letter-spacing:.06em;text-transform:uppercase;color:var(--lg-grey);transition:opacity .3s}
.lg-cap b{color:var(--logo);font-weight:700}
.lg-caret{display:inline-block;width:.08em;min-width:2px;height:.95em;background:var(--logo);vertical-align:-.12em;margin-left:.04em;animation:blink 1s steps(2) infinite}

/* L01 address bar */
.ab{position:absolute;inset:0;display:grid;place-items:center}
.ab-row{font-size:clamp(26px,6.4cqw,88px);padding:.32em .62em;border-radius:.42em;border:3px solid var(--lg-line);background:#fff;box-shadow:0 4px 30px -12px rgba(0,0,0,.18);transform:scale(.42);transition:transform .9s cubic-bezier(.6,0,.2,1),border-color .6s,box-shadow .6s,background .6s;display:flex;align-items:baseline}
.ab-row span,.ab-row .sl{font-weight:400;color:#3a3a3a;transition:font-weight .7s,color .7s}
.ab-row .cx{display:inline-block;overflow:hidden;vertical-align:bottom;transition:max-width .75s cubic-bezier(.6,0,.2,1),opacity .45s}
.ab-row .ic{display:inline-block;width:.62em;height:.62em;margin-right:.45em;border-radius:50%;border:.09em solid #b9b9b9;align-self:center;transition:opacity .4s,width .7s,margin .7s}
.ab.logo .ab-row{transform:scale(1);border-color:transparent;box-shadow:none;background:transparent}
.ab.logo .ab-row span.sl{font-weight:800;color:var(--logo)}
.ab.logo .ab-row .host{font-weight:700;color:var(--lg-ink)}
.ab.logo .ab-row .ic{opacity:0;width:0;margin:0}
.ab .gone{opacity:0}

/* L02 reel */
.rl{position:absolute;inset:0;font-family:${JB};font-size:clamp(14px,2.5cqw,30px);-webkit-mask-image:linear-gradient(transparent,#000 28%,#000 72%,transparent);mask-image:linear-gradient(transparent,#000 28%,#000 72%,transparent)}
.rl-band{position:absolute;left:0;right:0;top:50%;height:1.8em;transform:translateY(-50%);background:#f3f6ff;border-top:1px solid #dfe7ff;border-bottom:1px solid #dfe7ff}
.rl-track{position:absolute;left:0;right:0;top:50%;will-change:transform}
.rl-row{display:grid;grid-template-columns:1fr auto 1fr;height:1.8em;align-items:center;color:#b4b4b4;white-space:pre;transition:color .35s,transform .45s cubic-bezier(.3,1.4,.5,1)}
.rl-row .l{text-align:right}.rl-row .r{overflow:hidden;text-overflow:ellipsis}
.rl-row .s{color:var(--logo);font-weight:800;opacity:.4;transition:opacity .35s}
.rl-row.hit{color:var(--lg-ink);font-weight:700;transform:scale(1.5)}
.rl-row.hit .s{opacity:1}

/* L03 scheme swap */
.ss{position:absolute;inset:0;display:grid;place-items:center}
.ss-c{position:relative;font-size:clamp(24px,5.4cqw,72px)}
.ss-pre,.ss-post{position:absolute;top:0;font-weight:400;color:#8f8f8f;white-space:pre}
.ss-pre{right:100%}.ss-post{left:100%}
.ss-post i{font-style:normal;color:var(--logo);font-weight:800}

/* L04 header path */
.hp{position:absolute;inset:0;display:flex;flex-direction:column}
.hp-head{display:flex;align-items:center;gap:clamp(12px,2.4cqw,28px);height:clamp(52px,6.4cqw,68px);padding:0 clamp(14px,2.6cqw,32px);border-bottom:1px solid var(--lg-line);flex:none}
.hp-logo{font-size:clamp(16px,1.9cqw,22px);cursor:pointer;flex:none}
.hp-logo .sl{display:inline-block;transition:transform .35s cubic-bezier(.3,1.6,.5,1)}
.hp-logo:hover .sl{transform:skewX(-12deg) translateX(-.06em)}
.hp-logo .p{font-weight:500;color:#5a5a5a}.hp-logo .p i{font-style:normal;color:var(--logo);font-weight:800}
.hp-nav{margin-left:auto;display:flex;gap:clamp(10px,2cqw,24px);font:500 14px var(--sans);color:#555}
.hp-nav a{color:inherit;text-decoration:none;padding:6px 2px;border-bottom:2px solid transparent;transition:color .2s,border-color .2s;white-space:nowrap}
.hp-nav a.on{color:var(--lg-ink);border-color:var(--logo)}
.hp-cta{height:36px;padding:0 14px;border-radius:8px;background:var(--logo);color:#fff;font:500 13px var(--sans);display:inline-flex;align-items:center;flex:none}
.hp-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:0 clamp(16px,6cqw,80px)}
.hp-url{font-size:clamp(12px,1.3cqw,15px);color:#9a9a9a}.hp-url .sl{font-weight:800}
.hp-h{font:600 clamp(24px,4.2cqw,52px)/1.05 var(--sans);letter-spacing:-.025em;max-width:16ch;transition:opacity .25s}
.hp-bars{display:flex;flex-direction:column;gap:8px}.hp-bars i{display:block;height:9px;border-radius:5px;background:var(--lg-bg2)}
.hp-cur{position:absolute;left:0;top:0;width:18px;height:18px;transition:transform .8s cubic-bezier(.5,0,.2,1),opacity .3s;pointer-events:none;z-index:3}
@container (max-width:820px){.hp-nav a:nth-child(n+4),.hp-cta{display:none}}

/* L05 slash windows */
.sw{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:clamp(6px,1.4cqw,20px)}
.sw-mark{position:relative;height:66%;aspect-ratio:.92;flex:none}
.sw-win{position:absolute;top:0;bottom:0;width:58%;overflow:hidden;background:var(--logo);clip-path:polygon(64% 0,100% 0,36% 100%,0 100%)}
.sw-win.b{left:42%}
.sw-strip{position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;gap:8px;padding:4px 0;animation:sw-up 18s linear infinite}
.sw-win.b .sw-strip{animation:sw-down 14s linear infinite}
.sw:hover .sw-strip{animation-play-state:paused}
@keyframes sw-up{to{transform:translateY(-50%)}}@keyframes sw-down{from{transform:translateY(-50%)}to{transform:translateY(0)}}
.sw-t{position:relative;aspect-ratio:1/.62;flex:none;overflow:hidden}
.sw-t.play{background:#0a0a0a}.sw-t.play::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-30%,-50%);border-left:22px solid #fff;border-top:14px solid transparent;border-bottom:14px solid transparent}
.sw-t.map{background:#dcefe2;background-image:linear-gradient(#bfdcc8 1px,transparent 1px),linear-gradient(90deg,#bfdcc8 1px,transparent 1px);background-size:18px 18px}.sw-t.map::after{content:"";position:absolute;left:52%;top:40%;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#ff5b4a}
.sw-t.wave{background:#fadbe5;display:flex;align-items:center;justify-content:center;gap:4px}.sw-t.wave i{width:5px;border-radius:3px;background:#0a0a0a}
.sw-t.card{background:#fff;padding:14% 30% 0 30%}.sw-t.card i{display:block;height:7px;border-radius:4px;background:#d9d9d9;margin-bottom:7px}.sw-t.card i:first-child{height:34%;background:#d8e7ff}
.sw-t.quote{background:#f6ebc8;font:800 64px/1 Georgia,serif;color:#0a0a0a;display:grid;place-items:center}
.sw-word{font-size:clamp(28px,10.5cqw,140px);align-self:center;margin-top:8%}

/* L06 spinner */
.sp{position:absolute;inset:0;display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:1fr 1fr;gap:clamp(10px,2cqw,22px);padding:clamp(16px,4cqw,48px) clamp(16px,4cqw,48px) clamp(44px,6cqw,64px)}
.sp-cell{position:relative;border:1px solid var(--lg-line);border-radius:14px;display:grid;place-items:center;background:#fff}
.sp-cell.big{grid-row:1/3}
.sp-cell .tag{position:absolute;left:12px;top:10px;font:500 10px ${JB};letter-spacing:.06em;text-transform:uppercase;color:var(--lg-grey)}
.sp .lg .sl i{display:inline-block;font-style:normal}
.sp-big{font-size:clamp(28px,5.4cqw,72px);text-align:center}
.sp-res{display:block;margin-top:.9em;font:400 12px ${JB};color:var(--lg-grey);height:1.2em;text-align:center;transition:opacity .3s}
.sp-term{width:86%;background:#0a0a0a;color:#f2f2f2;border-radius:10px;padding:14px 16px;font:400 clamp(11px,1.15cqw,14px)/1.7 ${JB};white-space:pre;overflow:hidden}
.sp-term .b{color:#7da4ff;font-weight:800}.sp-term .d{color:#8a8a8a}.sp-term .g{color:#8fd3a8}
.sp-fav{display:flex;align-items:center;gap:18px}
.sp-tile{width:64px;height:64px;border-radius:15px;background:var(--logo);color:#fff;display:grid;place-items:center;font-size:30px}
.sp-tile .sl{color:#fff}
.sp-tab{display:flex;align-items:center;gap:8px;height:34px;padding:0 14px 0 10px;border-radius:9px 9px 0 0;background:var(--lg-bg2);font:500 12px var(--sans);color:#333}
.sp-tab .lg{font-size:13px;width:18px;height:18px;border-radius:4px;background:var(--logo);display:grid;place-items:center;letter-spacing:-.12em}.sp-tab .lg .sl{color:#fff;font-size:10px}
@container (max-width:620px){.sp{grid-template-columns:1fr;grid-template-rows:1fr 1fr}.sp-cell.big{grid-row:auto}.sp-cell.fav{display:none}}

/* L07 code */
.cd{position:absolute;inset:clamp(16px,4cqw,48px) clamp(16px,6cqw,90px) clamp(44px,6cqw,64px);border:1px solid var(--lg-line);border-radius:14px;background:#fff;box-shadow:0 10px 40px -24px rgba(0,0,0,.3);overflow:hidden;display:flex;flex-direction:column}
.cd-bar{height:34px;flex:none;display:flex;align-items:center;gap:6px;padding:0 12px;border-bottom:1px solid var(--lg-line);background:#fbfbfb;font:500 11px ${JB};color:#8a8a8a}.cd-bar i{width:9px;height:9px;border-radius:50%;background:#e2e2e2}.cd-bar span{margin-left:8px}
.cd-body{flex:1;padding:16px 0;font:400 clamp(11px,1.45cqw,17px)/1.85 ${JB};white-space:pre;overflow:hidden}
.cd-ln{display:flex}.cd-ln .n{width:3.2em;text-align:right;padding-right:1.2em;color:#c4c4c4;flex:none}
.cd .kw{color:#a626a4}.cd .str{color:#2e7d4f}.cd .id{color:#0a0a0a}.cd .op{color:#7a7a7a}.cd .cm{color:#9a9a9a;font-style:italic}.cd .tag{color:#c0392b}.cd .at{color:#b26b00}
.cd .sl{color:var(--logo);font-weight:800;font-style:normal;transition:background .3s;border-radius:3px}
.cd .sl.ping{background:#e3ecff}
.cd-ln.final{font-size:2.4em;line-height:1.3;margin-top:.15em}.cd-ln.final .n{font-size:.42em;align-self:center}
.cd-ln.final .host{font-weight:700;color:var(--lg-ink)}
`;
  const ensureCss = () => { if (!document.getElementById('css-logo')) document.head.appendChild(DEMOS.h('style', { id: 'css-logo' }, CSS)); };
  const ease = { io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out: t => 1 - Math.pow(1 - t, 5) };
  function tween(tl, ms, fn, e) { e = e || ease.io; return new Promise(res => { let last = performance.now(), run = 0; const step = now => { if (!tl.alive) return res(); if (!(tl.off && tl.off())) run += now - last; last = now; const p = Math.min(1, run / ms); /* holds off screen */ fn(e(p)); p < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); }); }
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const caret = () => DEMOS.h('span', { class: 'lg-caret' });
  /* text with every "/" as a blue slash */
  const slashy = s => s.split(/(\/+)/).filter(Boolean).map(p => p[0] === '/' ? DEMOS.h('i', null, p) : p);
  /* shared with demos/logo2.js */
  DEMOS.logoKit = { JB, ensureCss, ease, tween, nextFrame, caret, slashy };

  DEMOS.register('logo-address', {
    group: 'logo', title: 'Address bar: the URL folds into the mark',
    blurb: 'A URL types into an address bar. The scheme and the .com fold away, the slashes turn blue, the weights rise from 400 to 700/800, and the bar lets go: what is left is //iframely. It reverses into the bar and goes again with a different path. Weight changes run on the JetBrains Mono variable axis.',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const S = { ic: h('span', { class: 'ic' }), scheme: h('span', { class: 'cx' }), sl: h('span', { class: 'sl' }), host: h('span', { class: 'host' }), tld: h('span', { class: 'cx' }), path: h('span', { class: 'cx' }) };
      const cur = caret();
      const row = h('div', { class: 'ab-row lg' }, S.ic, S.scheme, S.sl, S.host, S.tld, S.path, cur);
      const wrap = h('div', { class: 'ab' }, row); const cap = h('div', { class: 'lg-cap' });
      stage.append(wrap, cap);
      const PARTS = [['scheme', 'https:'], ['sl', '//'], ['host', 'iframely'], ['tld', '.com']];
      const PATHS = ['', '/try', '/docs/oembed', '/publishers', '/pricing'];
      const say = html => { cap.innerHTML = html; };
      if (DEMOS.reduced) { S.sl.textContent = '//'; S.host.textContent = 'iframely'; cur.remove(); wrap.classList.add('logo'); say('<b>//</b>iframely'); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const fold = el => { el.style.maxWidth = el.scrollWidth + 'px'; el.getBoundingClientRect(); el.style.maxWidth = '0px'; el.classList.add('gone'); };
      const unfold = el => { el.style.maxWidth = el.scrollWidth + 'px'; el.classList.remove('gone'); };
      (async () => {
        let n = 0;
        while (tl.alive) {
          const path = PATHS[n++ % PATHS.length];
          for (const k of ['scheme', 'sl', 'host', 'tld', 'path']) { S[k].textContent = ''; S[k].style.maxWidth = 'none'; S[k].classList.remove('gone'); }
          row.appendChild(cur); say('1 · a URL');
          await tl.wait(500);
          for (const [k, s] of [...PARTS, ['path', path]]) for (const ch of s) { if (!tl.alive) return; S[k].textContent += ch; await tl.sleep(45 + Math.random() * 45); }
          await tl.wait(800); cur.remove();
          say('2 · drop the scheme'); fold(S.scheme); await tl.wait(800);
          say('3 · drop the rest'); fold(S.tld); if (path) fold(S.path); await tl.wait(800);
          say('<b>//</b>iframely · the slashes stay'); wrap.classList.add('logo');
          await tl.wait(3200);
          say('… and back to a URL'); wrap.classList.remove('logo'); await tl.wait(500);
          unfold(S.scheme); unfold(S.tld); if (path) unfold(S.path); await tl.wait(1300);
          row.appendChild(cur);
          for (const k of ['path', 'tld', 'host', 'sl', 'scheme']) { S[k].style.maxWidth = 'none'; while (S[k].textContent) { if (!tl.alive) return; S[k].textContent = S[k].textContent.slice(0, -1); await tl.sleep(18); } }
          await tl.wait(300);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-reel', {
    group: 'logo', pick: 'pick', title: 'Slash reel: every URL lines up on //',
    blurb: 'A slot-machine reel of real-looking links, all aligned on their slashes, so the blue // forms one column down the middle. The reel spins and always lands on //iframely, which steps forward in the logo weights. A hero background or a loading state for "Check a URL".',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const URLS = [['', 'iframely'], ['https:', 'youtube.com/watch?v=dQw4w9WgXcQ'], ['https:', 'open.spotify.com/track/4uLU6hMC'], ['https:', 'nytimes.com/2026/10/21/technology'], ['https:', 'figma.com/design/VmgHd0uy7JfP'], ['https:', 'x.com/iframely/status/1849'], ['https:', 'github.com/itteco/iframely'], ['https:', 'maps.google.com/?q=50.45,30.52'], ['https:', 'notion.so/Team-wiki-3f2a9c'], ['http:', 'vimeo.com/76979871'], ['https:', 'tiktok.com/@nasa/video/7321'], ['https:', 'soundcloud.com/bonobo/kerala'], ['https:', 'docs.google.com/document/d/1x'], ['https:', 'reddit.com/r/webdev/comments/1g']];
      const L = URLS.length, REP = 8;
      const track = h('div', { class: 'rl-track' }); const rows = [];
      for (let r = 0; r < REP; r++) for (const [a, b] of URLS) { const el = h('div', { class: 'rl-row' }, h('span', { class: 'l' }, a), h('span', { class: 's' }, '//'), h('span', { class: 'r' }, b)); rows.push(el); track.appendChild(el); }
      const cap = h('div', { class: 'lg-cap' }, 'every link has the same two slashes');
      stage.append(h('div', { class: 'rl' }, h('div', { class: 'rl-band' }), track), cap);
      let p = L; const place = v => { track.style.transform = 'translateY(' + (-(v + .5) * 1.8) + 'em)'; };
      place(p); rows[p].classList.add('hit');
      if (DEMOS.reduced) return () => {};
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        while (tl.alive) {
          await tl.wait(2600); rows[p].classList.remove('hit'); cap.textContent = 'resolving…';
          const from = p, to = p + L * (1 + (Math.random() < .4 ? 1 : 0));
          await tween(tl, 2800, t => place(from + (to - from) * t), ease.out);
          p = to; if (p > L * (REP - 3)) { p -= L * (REP - 4); place(p); }
          rows[p].classList.add('hit'); cap.innerHTML = '<b>//</b>iframely';
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-scheme', {
    group: 'logo', pick: 'pick · header', title: 'Scheme swap: //iframely is already a URL',
    blurb: 'The mark stays put while a scheme types in before it and a path after it: https://iframely, //iframely/try, http://iframely/oembed. With nothing around it, //iframely is still a valid protocol-relative URL. Useful as the header logo on hover, or as a small hero.',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const pre = h('span', { class: 'ss-pre' }), post = h('span', { class: 'ss-post' }), cur = caret();
      const c = h('div', { class: 'ss-c lg' }, pre, h('span', { class: 'sl' }, '//'), 'iframely', post);
      const cap = h('div', { class: 'lg-cap' });
      stage.append(h('div', { class: 'ss' }, c), cap);
      const STATES = [['https:', '', 'https: + <b>//</b>iframely'], ['', '/try', 'paste any link at <b>//</b>iframely/try'], ['http:', '/oembed', 'one endpoint for every URL'], ['', '/docs', 'start with one URL'], ['', '', '<b>//</b>iframely alone is a valid, protocol-relative URL']];
      if (DEMOS.reduced) { cap.innerHTML = STATES[4][2]; return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const setPost = s => { post.replaceChildren(...slashy(s), cur); };
      const edit = async (el, from, to, set) => { let s = from; while (s && !to.startsWith(s)) { s = s.slice(0, -1); set(s); await tl.sleep(28); } while (s.length < to.length) { s = to.slice(0, s.length + 1); set(s); await tl.sleep(60 + Math.random() * 40); } };
      (async () => {
        let n = 0, P = '', Q = '';
        setPost('');
        while (tl.alive) {
          const [a, b, txt] = STATES[n++ % STATES.length];
          cap.style.opacity = 0;
          pre.appendChild(cur); await edit(pre, P, a, s => { pre.textContent = s; pre.appendChild(cur); }); P = a;
          await edit(post, Q, b, s => setPost(s)); Q = b;
          cap.innerHTML = txt; cap.style.opacity = 1;
          await tl.wait(b || a ? 2400 : 3400);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-header', {
    group: 'logo', pick: 'pick · header', title: 'Header: the logo is the current path',
    blurb: 'Site header idea. Hovering a nav item extends the logo into that page\'s path (//iframely/preview-api); every "/" in the path is blue, like the mark. Hovering the logo leans the slashes. A ghost cursor demos it until you move over the header yourself; click the logo to go home.',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const SECT = [['', '', 'Iframely makes URLs work inside other products'], ['Rich Media', '/embeds', 'Rich embeds for every URL'], ['Preview API', '/preview-api', 'Link previews that know the page'], ['Data API', '/data-api', 'Structured data from any link'], ['Publishers', '/publishers', 'Decide how your links travel'], ['Pricing', '/pricing', 'Pay per thousand reads'], ['Docs', '/docs', 'Start with one URL']];
      const pth = h('span', { class: 'p' });
      const logo = h('div', { class: 'hp-logo lg' }, h('span', { class: 'sl' }, '//'), 'iframely', pth);
      const nav = h('div', { class: 'hp-nav' }); const items = [];
      SECT.slice(1).forEach((s, i) => { const a = h('a', { href: '#', 'data-i': i + 1 }, s[0]); items.push(a); nav.appendChild(a); });
      const url = h('div', { class: 'hp-url lg' }), title = h('div', { class: 'hp-h' });
      const cursor = h('div', { class: 'hp-cur', html: '<svg viewBox="0 0 18 18" width="18" height="18"><path d="M2 1l13 7-6 1.6L6.4 16z" fill="#0a0a0a" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>' });
      stage.append(h('div', { class: 'hp' }, h('div', { class: 'hp-head' }, logo, nav, h('span', { class: 'hp-cta' }, 'Get an API key')), h('div', { class: 'hp-body' }, url, title, h('div', { class: 'hp-bars' }, h('i', { style: 'width:46%' }), h('i', { style: 'width:38%' }), h('i', { style: 'width:22%' })))), cursor);
      let cur = '', target = '', sel = 0;
      const render = () => { pth.replaceChildren(...slashy(cur)); url.replaceChildren('https:', h('span', { class: 'sl' }, '//'), 'iframely.com' + cur); };
      const go = i => { sel = i; target = SECT[i][1]; items.forEach((a, k) => a.classList.toggle('on', k + 1 === i)); title.style.opacity = 0; setTimeout(() => { title.textContent = SECT[sel][2]; title.style.opacity = 1; }, 220); };
      title.textContent = SECT[0][2]; render();
      const iv = setInterval(() => { if (cur === target || DEMOS.offscreen(stage)) return; if (!target.startsWith(cur)) cur = cur.slice(0, -1); else cur = target.slice(0, cur.length + 1); render(); }, 34);
      items.forEach((a, k) => { a.addEventListener('pointerenter', () => go(k + 1)); a.addEventListener('click', e => e.preventDefault()); });
      logo.addEventListener('click', () => go(0));
      if (DEMOS.reduced) { go(2); cur = target; render(); cursor.remove(); return () => clearInterval(iv); }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const aim = el => { const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(); cursor.style.transform = 'translate(' + (r.left - s.left + r.width * .55) + 'px,' + (r.top - s.top + r.height * .6) + 'px)'; };
      stage.addEventListener('pointerenter', () => { cursor.style.opacity = 0; });
      stage.addEventListener('pointerleave', () => { cursor.style.opacity = 1; });
      (async () => {
        const order = [2, 1, 3, 4, 0, 5, 6, 0];
        aim(logo); let n = 0;
        while (tl.alive) {
          const i = order[n++ % order.length]; const el = i ? items[i - 1] : logo;
          if (el.offsetParent === null) continue;
          aim(el); await tl.wait(850); if (!tl.alive) return; go(i); await tl.wait(1900);
        }
      })();
      return () => { tl.destroy(); clearInterval(iv); };
    },
  });

  DEMOS.register('logo-windows', {
    group: 'logo', title: 'Slash windows: what travels through the URL',
    blurb: 'The // drawn huge as two slanted windows in logo blue, with what a URL becomes scrolling through them: a player, a map, audio, a card, a quote. The two strips run in opposite directions. Poster or hero idea; hover pauses.',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const tile = k => k === 'wave' ? h('div', { class: 'sw-t wave' }, [10, 26, 18, 34, 22, 40, 16, 28, 12, 24, 30, 14].map(v => h('i', { style: 'height:' + v + 'px' }))) : k === 'card' ? h('div', { class: 'sw-t card' }, h('i'), h('i'), h('i', { style: 'width:70%' })) : k === 'quote' ? h('div', { class: 'sw-t quote' }, '“') : h('div', { class: 'sw-t ' + k });
      const strip = keys => { const s = h('div', { class: 'sw-strip' }); for (let r = 0; r < 2; r++) keys.forEach(k => s.appendChild(tile(k))); return s; };
      const A = ['play', 'map', 'wave', 'card', 'quote', 'play', 'card'], B = ['card', 'wave', 'play', 'quote', 'map', 'wave', 'play'];
      stage.append(h('div', { class: 'sw' }, h('div', { class: 'sw-mark' }, h('div', { class: 'sw-win a' }, strip(A)), h('div', { class: 'sw-win b' }, strip(B))), h('div', { class: 'sw-word lg' }, 'iframely')), h('div', { class: 'lg-cap' }, 'player · map · audio · card · quote, through the <b>//</b>'.replace(/<b>\/\/<\/b>/, '//')));
      stage.querySelector('.lg-cap').innerHTML = 'player · map · audio · card · quote, through the <b>//</b>';
      if (DEMOS.reduced) stage.querySelectorAll('.sw-strip').forEach(s => { s.style.animation = 'none'; });
      return () => {};
    },
  });

  DEMOS.register('logo-spinner', {
    group: 'logo', pick: 'pick · terminal + mark', title: 'Loading: the slashes are the spinner',
    blurb: 'A loading state built from the mark: while a URL resolves, the two slashes turn half a turn each, one after the other, and settle back into //. The same beat in a terminal as an ASCII spinner (/ - \\ |), and on a favicon tile and a browser tab.',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const sl = () => h('span', { class: 'sl' }, h('i', null, '/'), h('i', null, '/'));
      const bigSl = sl(), res = h('span', { class: 'sp-res' }, '');
      const tileSl = sl(), tabSl = sl();
      const t1 = h('span', { class: 'b' }, '//'), t2 = h('span', { class: 'd' }, 'fetching'), t3 = h('span', null, '');
      stage.append(h('div', { class: 'sp' },
        h('div', { class: 'sp-cell big' }, h('span', { class: 'tag' }, 'mark'), h('div', null, h('div', { class: 'sp-big lg' }, bigSl, 'iframely'), res)),
        h('div', { class: 'sp-cell' }, h('span', { class: 'tag' }, 'terminal'), h('div', { class: 'sp-term' }, h('div', null, h('span', { class: 'd' }, '$ '), 'iframely check youtu.be/dQw4w9'), h('div', null, '[', t1, '] ', t2, ' ', t3))),
        h('div', { class: 'sp-cell fav' }, h('span', { class: 'tag' }, 'favicon + tab'), h('div', { class: 'sp-fav' }, h('div', { class: 'sp-tile lg' }, tileSl), h('div', { class: 'sp-tab' }, h('span', { class: 'lg' }, tabSl), 'Check a URL · Iframely')))),
        h('div', { class: 'lg-cap' }, 'resolve → settle'));
      const slashes = [bigSl, tileSl, tabSl].map(s => [...s.children]);
      if (DEMOS.reduced) { res.textContent = '200 · 67 ms · player'; t1.textContent = '//'; t2.className = 'g'; t2.textContent = 'done'; return () => {}; }
      const FR = ['/', '-', '\\', '|'];
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const spin = async ms => {
        let last = performance.now(), t = 0;
        await new Promise(res2 => {
          const step = now => {
            if (!tl.alive) return res2(); if (!tl.off()) t += now - last; last = now; const done = t > ms; /* holds off screen */
            let settled = true;
            slashes.forEach(pair => pair.forEach((el, k) => { const local = Math.max(0, t - k * 140); let cyc = local / 520; if (done) { const end = Math.ceil((ms - k * 140) / 520); cyc = Math.min(cyc, end); if (cyc < end) settled = false; } else settled = false; const f = cyc % 1, whole = Math.floor(cyc); const a = (whole + ease.io(f)) * 180; el.style.transform = 'rotate(' + a + 'deg)'; }));
            const q = Math.floor(t / 110); t1.textContent = done ? '//' : FR[q % 4] + FR[(q + 1) % 4];
            if (done && settled) { slashes.flat().forEach(el => { el.style.transform = ''; }); return res2(); }
            requestAnimationFrame(step);
          }; requestAnimationFrame(step);
        });
      };
      (async () => {
        const RES = [['200 · 67 ms · player', 'player'], ['200 · 212 ms · reader', 'reader'], ['200 · 131 ms · app', 'app']]; let n = 0;
        while (tl.alive) {
          const [r, kind] = RES[n++ % RES.length];
          res.style.opacity = 0; t2.className = 'd'; t2.textContent = 'fetching'; t3.textContent = '';
          await spin(1700 + Math.random() * 600); if (!tl.alive) return;
          res.textContent = r; res.style.opacity = 1; t2.className = 'g'; t2.textContent = 'done'; t3.textContent = kind;
          await tl.wait(2400);
        }
      })();
      return () => tl.destroy();
    },
  });

  DEMOS.register('logo-code', {
    group: 'logo', title: 'Code: // in a URL, // in a comment',
    blurb: 'For developers the two slashes mean two things: the start of a URL and the start of a comment. A short snippet types itself with every // set in logo blue; the slashes ping in order, and the last line resolves into the mark.',
    mount(stage) {
      ensureCss(); const { h } = DEMOS;
      const LINES = [
        [['cm', '// any link a user pastes']],
        [['kw', 'const '], ['id', 'url'], ['op', ' = '], ['str', "'https:"], ['sl', '//'], ['str', "youtu.be/dQw4w9WgXcQ'"]],
        [],
        [['tag', '<iframe '], ['at', 'src'], ['op', '='], ['str', '"'], ['sl', '//'], ['str', 'cdn.iframe.ly/api/iframe?url={url}"'], ['tag', '>']],
        [['tag', '</iframe>'], ['cm', '  '], ['sl', '//'], ['cm', ' the link now plays inside your product']],
        [],
      ];
      const body = h('div', { class: 'cd-body' });
      stage.append(h('div', { class: 'cd' }, h('div', { class: 'cd-bar' }, h('i'), h('i'), h('i'), h('span', null, 'embed.js')), body), h('div', { class: 'lg-cap' }, 'two meanings, one mark'));
      const line = (n, cls) => { const el = h('div', { class: 'cd-ln' + (cls ? ' ' + cls : '') }, h('span', { class: 'n' }, n)); body.appendChild(el); return el; };
      const tok = (c, s) => h('span', { class: c }, s);
      const full = () => { body.innerHTML = ''; LINES.forEach((L, i) => { const el = line(i + 1); L.forEach(([c, s]) => el.appendChild(tok(c, s))); }); const f = line(LINES.length + 1, 'final'); f.append(tok('sl', '//'), tok('host', 'iframely')); };
      if (DEMOS.reduced) { full(); return () => {}; }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      (async () => {
        while (tl.alive) {
          body.innerHTML = ''; body.style.opacity = 1;
          for (let i = 0; i < LINES.length; i++) {
            const el = line(i + 1); const cur = caret(); el.appendChild(cur);
            for (const [c, s] of LINES[i]) { const t = tok(c, ''); el.insertBefore(t, cur); for (const ch of s) { if (!tl.alive) return; t.textContent += ch; await tl.sleep(c === 'sl' ? 90 : 18 + Math.random() * 26); } }
            await tl.wait(160); cur.remove();
          }
          for (const s of body.querySelectorAll('.sl')) { s.classList.add('ping'); await tl.wait(380); s.classList.remove('ping'); }
          const f = line(LINES.length + 1, 'final'); const a = tok('sl', ''), b = tok('host', ''), cur = caret(); f.append(a, b, cur);
          for (const ch of '//') { a.textContent += ch; await tl.sleep(120); }
          for (const ch of 'iframely') { b.textContent += ch; await tl.sleep(70); }
          await tl.wait(3200); cur.remove();
          await tween(tl, 400, t => { body.style.opacity = 1 - t; });
        }
      })();
      return () => tl.destroy();
    },
  });
})();
