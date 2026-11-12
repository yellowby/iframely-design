/* P01 · one engine, four products: after a reference (an app icon wired by dashed lines to four app windows, a line of
   copy and rows of drifting capability pills). The // hub sends packets down to Rich Media (a hosted player cycling
   video / audio / map), Preview API (a chat link that unfurls into a card), Data API (a terminal reading a URL as
   Markdown, URL in blue, status in grey) and Publisher Console (requests by agent and a path policy). The products and
   copy are the four on the prototype home page. Static under reduced motion. Group 'ill', mount(stage). */
(() => {
  const BL = '#0055ff';
  const ICONS = {
    play: '<circle cx="8" cy="8" r="6.2"/><path d="M6.6 5.6 10.6 8l-4 2.4z" fill="currentColor" stroke="none"/>',
    refresh: '<path d="M13 6.5A5.2 5.2 0 0 0 3.4 5M3 9.5A5.2 5.2 0 0 0 12.6 11"/><path d="M3.2 2.6V5.3H5.9M12.8 13.4V10.7H10.1"/>',
    gate: '<rect x="2.5" y="3" width="11" height="10" rx="2"/><path d="M8 3v10M5.4 8h.01M10.6 8h.01"/>',
    ruler: '<path d="M8 2v12M5.6 2h4.8M5.6 14h4.8"/>',
    code: '<path d="m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5l3.5 3.5-3.5 3.5"/>',
    tag: '<path d="M2.5 2.5h5.3l5.7 5.7-5.3 5.3-5.7-5.7z"/><circle cx="5.5" cy="5.5" r=".9" fill="currentColor"/>',
    card: '<rect x="2" y="3" width="12" height="10" rx="2"/><path d="M2 8.5h12M4.5 10.8h4"/>',
    link: '<path d="M6.8 9.2a2.8 2.8 0 0 0 4 0l2-2a2.8 2.8 0 0 0-4-4l-.8.8M9.2 6.8a2.8 2.8 0 0 0-4 0l-2 2a2.8 2.8 0 0 0 4 4l.8-.8"/>',
    chat: '<path d="M2.5 3.5h11v7.5H7l-3 2.5V11H2.5z"/>',
    doc: '<path d="M3.5 1.8h6l3 3v9.4h-9z"/><path d="M9.5 1.8v3h3M5.5 8h5M5.5 10.6h3.5"/>',
    shield: '<path d="M8 1.8 13 3.6v4.2c0 3-2.2 5.2-5 6.4-2.8-1.2-5-3.4-5-6.4V3.6z"/>',
    key: '<circle cx="5.4" cy="10.6" r="2.8"/><path d="m7.4 8.6 6-6M11.4 4.6l1.6 1.6"/>',
    chart: '<path d="M2.5 13.5h11M4.5 11V7.5M8 11V4M11.5 11V8.8"/>',
  };
  const icon = k => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;
  const PILLS = [
    [['play', 'Embed a video'], ['refresh', 'Evergreen refresh'], ['gate', 'Consent gate'], ['ruler', 'Predicted height'], ['code', 'oEmbed endpoint'], ['play', 'Click-to-play'], ['tag', 'Content IDs']],
    [['card', 'Summary card'], ['link', 'Unfurl a link'], ['card', 'Light and dark cards'], ['tag', 'Title and thumbnails'], ['play', 'Rich Media on or off'], ['chat', 'Chat previews']],
    [['doc', 'Read as Markdown'], ['tag', 'Extract entities'], ['link', 'List media links'], ['shield', 'Check robots.txt'], ['key', 'Signed requests'], ['chart', 'See who fetches'], ['shield', 'Set a path policy'], ['doc', 'Test a declared use']],
  ];

  const CSS = `
.ph{--ink:#1c1b18;--i7:#5b5750;--i5:#8a857c;--i3:#cfc9bd;--i2:#e3dfd6;--i1:#efece5;background:#f7f5f0;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,'Segoe UI',sans-serif;padding:40px clamp(16px,3.5cqw,48px) 52px;container-type:inline-size;overflow:hidden}
.ph-top{position:relative}
.ph-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.ph-hub{position:relative;z-index:1;width:104px;height:104px;margin:0 auto 104px;border-radius:26px;background:#1c1b18;display:grid;place-items:center;box-shadow:0 10px 30px rgba(28,27,24,.18);transition:box-shadow .4s}
.ph-hub b{font:800 46px/1 'JetBrains Mono',ui-monospace,monospace;color:${BL};letter-spacing:-.06em;transform:translateX(-2px)}
.ph-hub.ping{box-shadow:0 10px 30px rgba(28,27,24,.18),0 0 0 8px rgba(0,85,255,.12)}
.ph-cards{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.ph-win{background:#fff;border:1px solid var(--i1);border-radius:14px;box-shadow:0 1px 2px rgba(28,27,24,.04),0 10px 28px rgba(28,27,24,.06);min-width:0;display:flex;flex-direction:column}
.ph-bar{display:flex;align-items:center;gap:6px;padding:12px 14px;font-size:13px;color:var(--ink)}
.ph-bar i{width:10px;height:10px;border-radius:50%;background:var(--i2)}
.ph-bar span{margin-left:12px}
.ph-bar .mono{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px}
.ph-body{position:relative;height:250px;padding:0 18px 18px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;font-size:12px}
/* rich media */
.ph-player{position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;background:#1c1b18}
.ph-player>div{position:absolute;inset:0;opacity:0;transition:opacity .5s}
.ph-player>div.on{opacity:1}
.ph-video{background:radial-gradient(circle at 70% 30%,#ffd28a 0 9%,transparent 10%),linear-gradient(180deg,#2c3e66 0%,#5a6f9c 55%,#1c1b18 56%,#2a2925 100%)}
.ph-video em{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center}
.ph-video em::after{content:"";border-left:13px solid ${BL};border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:4px}
.ph-audio{background:#f7f5f0;display:flex;align-items:center;gap:2px;padding:0 14px}
.ph-audio u{flex:1;background:var(--i3);border-radius:2px}
.ph-audio u.p{background:${BL}}
.ph-map{background-color:#eef0ea;background-image:linear-gradient(90deg,transparent 47%,#fff 47% 53%,transparent 53%),linear-gradient(transparent 60%,#fff 60% 65%,transparent 65%),linear-gradient(35deg,transparent 40%,#dfe6d6 40% 70%,transparent 70%)}
.ph-map em{position:absolute;left:58%;top:30%;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${BL}}
.ph-src{display:flex;align-items:center;gap:8px;color:var(--i7)}
.ph-src img{width:14px;height:14px}
.ph-src b{font-weight:500;color:var(--ink)}
.ph-code{font:11px/1.4 'JetBrains Mono',ui-monospace,monospace;color:var(--i5);background:#f7f5f0;border-radius:7px;padding:7px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ph-code b{color:${BL};font-weight:800}
/* preview */
.ph-msg p{min-width:0}
.ph-msg{display:grid;grid-template-columns:26px minmax(0,1fr);gap:9px;align-items:start}
.ph-av{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#ffb48a,#ff7a59)}
.ph-msg p{margin:0;line-height:1.45;color:var(--ink)}
.ph-msg p small{display:block;font-size:11px;color:var(--i5);margin-bottom:1px}
.ph-msg a{display:block;color:${BL};text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ph-unf{margin-top:6px;border-left:3px solid var(--i2);padding:2px 0 2px 9px;display:grid;grid-template-columns:1fr 46px;gap:8px;opacity:0;transform:translateY(6px);transition:opacity .45s,transform .45s}
.ph-unf.on{opacity:1;transform:none}
.ph-unf div{min-width:0}
.ph-unf .s{display:flex;align-items:center;gap:5px;color:var(--i5);font-size:11px}
.ph-unf .s img{width:12px;height:12px}
.ph-unf .t{font-weight:600;margin:2px 0 1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ph-unf .d{color:var(--i7);font-size:11px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ph-unf .th{width:46px;height:46px;border-radius:7px}
.ph-comp{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--i2);border-radius:10px;padding:8px 8px 8px 12px;color:var(--i5)}
.ph-comp b{width:24px;height:24px;border-radius:7px;background:${BL};display:grid;place-items:center}
.ph-comp b::after{content:"";width:8px;height:8px;border-left:2px solid #fff;border-top:2px solid #fff;transform:translateY(2px) rotate(45deg)}
/* terminal */
.ph-term{font:11.5px/1.65 'JetBrains Mono',ui-monospace,monospace;color:var(--ink);white-space:pre;overflow:hidden}
.ph-term .g{color:var(--i5)}
.ph-term .u{color:${BL}}
.ph-term .c{display:inline-block;width:7px;height:13px;background:var(--ink);vertical-align:-2px;animation:ph-blink 1s steps(1) infinite}
@keyframes ph-blink{50%{opacity:0}}
/* console */
.ph-con .h{display:flex;justify-content:space-between;color:var(--i5)}
.ph-con .h b{color:var(--ink);font-weight:600}
.ph-row{display:grid;grid-template-columns:52px 1fr 38px;gap:8px;align-items:center;color:var(--i7)}
.ph-row u{height:8px;border-radius:4px;background:var(--ink);transform-origin:left;transition:transform .9s cubic-bezier(.2,.7,.2,1)}
.ph-row u.b{background:${BL}}
.ph-row s{text-decoration:none;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.ph-pol{border-top:1px dashed var(--i2);padding-top:9px;display:grid;gap:7px}
.ph-pol div{display:flex;align-items:center;justify-content:space-between;gap:8px}
.ph-pol code{font:11px 'JetBrains Mono',ui-monospace,monospace;color:var(--ink)}
.ph-pol span{color:var(--i5);margin-left:auto}
.ph-tg{flex:none;width:26px;height:15px;border-radius:8px;background:var(--i3);position:relative;transition:background .3s}
.ph-tg::after{content:"";position:absolute;left:2px;top:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:transform .3s}
.ph-tg.on{background:${BL}}
.ph-tg.on::after{transform:translateX(11px)}
/* bottom */
.ph-low{display:grid;grid-template-columns:1fr 1.15fr;gap:40px;align-items:center;margin-top:64px}
.ph-low p{margin:0 0 24px;font-size:clamp(18px,2cqw,25px);line-height:1.4;letter-spacing:-.01em;max-width:30ch}
.ph-btn{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 22px;border:1.5px solid var(--ink);border-radius:23px;font-size:17px;color:var(--ink);text-decoration:none}
.ph-low>*{min-width:0}
.ph-pills{display:grid;gap:10px;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.ph-track{display:flex;gap:10px;width:max-content;animation:ph-drift var(--d,60s) linear infinite}
.ph-track.rev{animation-direction:reverse}
.ph-pills:hover .ph-track{animation-play-state:paused}
@keyframes ph-drift{to{transform:translateX(-50%)}}
.ph-pill{display:inline-flex;align-items:center;gap:9px;height:40px;padding:0 17px;border:1.5px solid var(--i3);border-radius:20px;font-size:15px;white-space:nowrap;background:#fff;color:var(--ink)}
.ph-pill svg{width:17px;height:17px;color:var(--i7)}
@container (max-width:980px){.ph-cards{grid-template-columns:repeat(2,1fr)}.ph-lines{display:none}.ph-hub{margin-bottom:28px}.ph-low{grid-template-columns:1fr}}
@container (max-width:540px){.ph-cards{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.ph-track{animation:none}.ph-term .c{animation:none}}
/* variants for the section picks (demos/sec.js) */
.ph.bare{background:transparent;padding:0}
.ph.bare .ph-code b{color:inherit;font-weight:inherit} /* no // highlight in the section picks */
.ph.compact .ph-hub{width:76px;height:76px;border-radius:20px;margin-bottom:64px}
.ph.compact .ph-hub b{font-size:34px}
.ph.compact .ph-body{height:214px}
.ph.single .ph-cards{grid-template-columns:1fr}
.ph.single .ph-lines{display:block}
.ph.single .ph-hub{width:76px;height:76px;border-radius:20px;margin-bottom:48px}
.ph.single .ph-hub b{font-size:34px}
.ph.single .ph-body{height:auto;min-height:300px;font-size:13px;padding:6px 22px 22px}
.ph.single .ph-term{font-size:13px}
.ph.single .ph-unf{grid-template-columns:1fr 64px}.ph.single .ph-unf .th{width:64px;height:64px}
`;

  /* rotating samples for the Preview API chat */
  const LINKS = [
    { url: 'soundcloud.com/bonobo/kerala', who: 'Maya', say: 'this is the one for the intro', fav: 'soundcloud', site: 'SoundCloud', title: 'Kerala', desc: 'Bonobo · Migration · 2017', th: 'linear-gradient(135deg,#ffcf8a,#f2552c)' },
    { url: 'github.com/itteco/iframely', who: 'Dev', say: 'the parser lives here', fav: 'github', site: 'GitHub', title: 'itteco/iframely', desc: 'oEmbed proxy: one endpoint for embeds and previews of any URL.', th: 'linear-gradient(135deg,#3d3a35,#1c1b18)' },
    { url: 'en.wikipedia.org/wiki/Kerala', who: 'Ana', say: 'background for the piece', fav: 'wikipedia', site: 'Wikipedia', title: 'Kerala', desc: 'A state on the Malabar Coast of India, formed in 1956.', th: 'linear-gradient(135deg,#bfe3c6,#3c8d5a)' },
  ];
  const TERM = [
    ['$ ', 'iframely data', '', ' \\'],
    ['  ', '', 'en.wikipedia.org/wiki/Kerala', ' \\'],
    ['  ', '--mode=fulltext --use=read', '', ''],
  ];

  /* opts: low (copy + pills below), compact (short band for a hero), only (0–3: one product window under the hub),
     bare (no paper background or padding, for use inside a section mock-up). DEMOS.prodKit(stage, opts) reuses it. */
  function build(stage, opts = {}) {
      const { h } = DEMOS;
      if (!document.getElementById('css-ph')) document.head.appendChild(h('style', { id: 'css-ph' }, CSS));
      const ICON = (DEMOS.logoKit && DEMOS.logoKit.cardKit && DEMOS.logoKit.cardKit.ICON) || {};
      const fav = k => ICON[k] ? `<img alt="" src="${ICON[k].src}">` : '';
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const win = (title, body, mono) => h('div', { class: 'ph-win' }, h('div', { class: 'ph-bar', html: `<i></i><i></i><i></i><span class="${mono ? 'mono' : ''}">${title}</span>` }), body);

      /* 1 · Rich Media */
      const bars = Array.from({ length: 34 }, (_, i) => `<u class="${i < 13 ? 'p' : ''}" style="height:${Math.round(18 + 62 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * .45)))}%"></u>`).join('');
      const kinds = [['ph-video', '<em></em>', 'youtube', 'YouTube', 'iframe=1&omit_script=1'], ['ph-audio', bars, 'soundcloud', 'SoundCloud', 'iframe=1&playerjs=1'], ['ph-map', '<em></em>', '', 'Google Maps', 'iframe=1&lazy=1']];
      const player = h('div', { class: 'ph-player', html: kinds.map(([c, inner], i) => `<div class="${c}${i ? '' : ' on'}">${inner}</div>`).join('') });
      const src = h('div', { class: 'ph-src' }), code = h('div', { class: 'ph-code' });
      let kind = 0;
      const showKind = () => { [...player.children].forEach((d, i) => d.classList.toggle('on', i === kind)); const k = kinds[kind]; src.innerHTML = `${fav(k[2])}<b>${k[3]}</b><span>· sized before load</span>`; code.innerHTML = `&lt;iframe src="<b>//</b>cdn.iframe.ly/x7Kd2?${k[4]}"&gt;`; };
      showKind();
      const rich = win('Rich Media', h('div', { class: 'ph-body' }, player, src, code));

      /* 2 · Preview API */
      const msg = h('div', { class: 'ph-msg' }), comp = h('div', { class: 'ph-comp', html: 'Message #design<b></b>' });
      let li = 0, unf;
      const showLink = () => { const L = LINKS[li]; msg.innerHTML = `<div class="ph-av"></div><p><small>${L.who}</small>${L.say} <a>${L.url}</a></p><div></div><div class="ph-unf"><div><div class="s">${fav(L.fav)}${L.site}</div><div class="t">${L.title}</div><div class="d">${L.desc}</div></div><div class="th" style="background:${L.th}"></div></div>`; unf = msg.querySelector('.ph-unf'); };
      showLink(); unf.classList.add('on');
      const prev = win('Preview API', h('div', { class: 'ph-body' }, msg, comp));

      /* 3 · Data API terminal: typed command, then the response in greys with the URL in blue */
      const term = h('div', { class: 'ph-term' });
      const OUT = [
        '<span class="g">  200 · 412 ms</span>',
        '<span class="g">  access </span>allowed <span class="g">· 3 signals</span>',
        '<span class="g">  words  </span>1,840',
        '',
        '  # Kerala',
        '<span class="g">  A state on the Malabar Coast</span>',
        '<span class="g">  of India, formed in 1956 …</span>',
      ];
      const full = TERM.map(([p, a, u, e]) => `<span class="g">${p}</span>${a}<span class="u">${u}</span>${e}`);
      const termAt = (chars, lines) => { /* chars typed of the command, lines of output shown */
        let left = chars, s = '';
        for (const [p, a, u, e] of TERM) { const t = a + u + e, n = Math.max(0, Math.min(t.length, left)); left -= n;
          const cut = (x, from) => x.slice(0, Math.max(0, Math.min(x.length, n - from)));
          s += `<span class="g">${p}</span>${cut(a, 0)}<span class="u">${cut(u, a.length)}</span>${cut(e, a.length + u.length)}` + (n < t.length ? '<span class="c"></span>\n' : '\n'); if (n < t.length) break; }
        if (chars >= TERM.reduce((m, r) => m + r[1].length + r[2].length + r[3].length, 0)) s = full.join('\n') + '\n' + OUT.slice(0, lines).join('\n') + (lines < OUT.length ? '' : '\n<span class="g">$ </span><span class="c"></span>');
        term.innerHTML = s;
      };
      const CMD = TERM.reduce((m, r) => m + r[1].length + r[2].length + r[3].length, 0);
      termAt(CMD, OUT.length);
      const data = opts.bare ? win('Data API', h('div', { class: 'ph-body' }, term)) : win('user — zsh', h('div', { class: 'ph-body' }, term), true); /* section picks name it like the other windows */

      /* 4 · Publisher Console */
      const ROWS = [['preview', 18.2, ''], ['embed', 11.9, ''], ['data', 6.4, 'b'], ['unknown', 1.1, '']];
      const con = h('div', { class: 'ph-body ph-con', html:
        `<div class="h"><b>example.com</b><span>last 7 days</span></div>` +
        ROWS.map(([n, v, c]) => `<div class="ph-row"><span>${n}</span><u class="${c}" style="transform:scaleX(${v / 18.2})"></u><s data-v="${v}">${v}k</s></div>`).join('') +
        `<div class="ph-pol"><div><code>/blog/*</code><span>read: full</span><i class="ph-tg on"></i></div><div><code>/members/*</code><span>read: excerpt</span><i class="ph-tg"></i></div></div>` });
      const pub = win('Publisher Console', con);

      const hub = h('div', { class: 'ph-hub', html: '<b>//</b>' });
      const idx = opts.only == null ? [0, 1, 2, 3] : [opts.only];
      const cards = h('div', { class: 'ph-cards' }, ...idx.map(i => [rich, prev, data, pub][i]));
      const NS = 'http://www.w3.org/2000/svg', lines = document.createElementNS(NS, 'svg'); lines.setAttribute('class', 'ph-lines');
      const top = h('div', { class: 'ph-top' }, lines, hub, cards);

      const pills = h('div', { class: 'ph-pills' }, ...PILLS.map((row, i) => { const one = row.map(([k, s]) => `<span class="ph-pill">${icon(k)}${s}</span>`).join(''); const t = h('div', { class: 'ph-track' + (i === 1 ? ' rev' : ''), html: one + one }); t.style.setProperty('--d', (52 + i * 14) + 's'); return t; }));
      const low = h('div', { class: 'ph-low' },
        h('div', null, h('p', null, 'One engine reads the URL. Four products put it to work: embeds for your editor, previews for your chat, clean data for your agents, and a console for the publisher on the other side.'), h('a', { class: 'ph-btn', href: '#', html: 'All products <span>›</span>' })),
        pills);
      stage.appendChild(h('div', { class: 'ph' + (opts.compact ? ' compact' : '') + (opts.only != null ? ' single' : '') + (opts.bare ? ' bare' : '') }, top, opts.low ? low : null));

      /* dashed wires from the hub's sides, round the corner, down to each window */
      let paths = [];
      const draw = () => {
        const tb = top.getBoundingClientRect(), hb = hub.getBoundingClientRect();
        const hx = hb.left + hb.width / 2 - tb.left, hy = hb.top + hb.height / 2 - tb.top, hw = hb.width / 2, R = 36;
        lines.setAttribute('viewBox', `0 0 ${tb.width} ${tb.height}`);
        paths = [...cards.children].map(c => { const cb = c.getBoundingClientRect(), cx = cb.left + cb.width / 2 - tb.left, cy = cb.top - tb.top, s = Math.sign(cx - hx), x0 = hx + s * hw, r = Math.min(R, Math.abs(cx - x0) - 2, (cy - hy) - 2);
          if (Math.abs(cx - hx) < hw) return `M${hx} ${hy + hb.height / 2}V${cy}`; /* one window straight below the hub */
          return `M${x0} ${hy}H${cx - s * r}A${r} ${r} 0 0 ${s > 0 ? 1 : 0} ${cx} ${hy + r}V${cy}`; });
        lines.innerHTML = paths.map(d => `<path d="${d}" fill="none" stroke="#cfc9bd" stroke-width="1.5" stroke-dasharray="4 5"/>`).join('') + paths.map(() => `<circle r="3.5" fill="${BL}" opacity="0"/>`).join('');
      };
      const ro = new ResizeObserver(draw); ro.observe(top); draw();

      /* motion: every few seconds the hub pings and a packet runs down one wire; when it lands, that window updates */
      const root = () => stage.closest('.demo');
      const actions = [
        () => { kind = (kind + 1) % kinds.length; showKind(); },
        () => { li = (li + 1) % LINKS.length; showLink(); setTimeout(() => unf && unf.classList.add('on'), 700); },
        () => { let c = 0, l = 0; const tick = setInterval(() => { if (c < CMD) { c = Math.min(CMD, c + 3); termAt(c, 0); } else if (l < OUT.length) termAt(c, ++l); else clearInterval(tick); }, 45); timers.push(tick); termAt(0, 0); },
        () => { con.querySelectorAll('.ph-row s').forEach(s => { const v = +s.dataset.v + Math.round(Math.random() * 3) / 10; s.dataset.v = v.toFixed(1); s.textContent = v.toFixed(1) + 'k'; }); const vs = [...con.querySelectorAll('.ph-row s')].map(s => +s.dataset.v), mx = Math.max(...vs); con.querySelectorAll('.ph-row u').forEach((u, i) => { u.style.transform = `scaleX(${vs[i] / mx})`; }); con.querySelectorAll('.ph-tg')[1].classList.toggle('on'); },
      ];
      const timers = []; let raf = 0, next = 0, run = null, turn = 0;
      const frame = now => {
        raf = requestAnimationFrame(frame);
        const r = root(); if (r && r.classList.contains('off')) return;
        if (!run && now > next) { run = { i: turn++ % idx.length, t0: now }; hub.classList.add('ping'); setTimeout(() => hub.classList.remove('ping'), 500); }
        if (run) {
          const el = lines.querySelectorAll('path')[run.i], dot = lines.querySelectorAll('circle')[run.i];
          if (!el || getComputedStyle(lines).display === 'none') { actions[idx[run.i]](); run = null; next = now + 2600; return; }
          const k = Math.min(1, (now - run.t0) / 1100), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, p = el.getPointAtLength(e * el.getTotalLength());
          dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('opacity', k < .9 ? 1 : (1 - k) * 10);
          if (k >= 1) { dot.setAttribute('opacity', 0); actions[idx[run.i]](); run = null; next = now + 1500; }
        }
      };
      if (!reduce) raf = requestAnimationFrame(frame);
      return () => { cancelAnimationFrame(raf); ro.disconnect(); timers.forEach(clearInterval); };
  }
  DEMOS.prodKit = build;

  DEMOS.register('prod-hub', {
    group: 'pdw', title: 'Products · one engine, four apps',
    blurb: 'After a reference with an app icon wired to four app windows: the // hub sends requests down dashed lines to Rich Media (a hosted player cycling video, audio and a map), Preview API (a chat link that unfurls into a card), Data API (a terminal reading a URL as Markdown) and Publisher Console (requests by agent, a path policy). Below, the line of copy on the left and three rows of capability pills drifting on the right; hover pauses them. Static under reduced motion.',
    mount: stage => build(stage, { low: true }),
  });
})();
