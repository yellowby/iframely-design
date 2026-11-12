// @ts-nocheck
/* S · Section picks: one scene per slot on the site, set inside a mock of its section with the current copy from
   iframely-marketing/demos/website (home page for the hero and the side slots, each product page's hero for the large
   slots). Section type: Geist, headings 32 / 120% / −2%, product badges in the Figma "product badges" palette.
   Large slots run full width under the copy; side slots sit right of the copy. The side slots reuse the P08 windows
   (DEMOS.prodKit with one product); the hero band is P08 compact. Group 'sec', mount(stage). */
(() => {
  const { h } = DEMOS;
  const PROD = {
    rich: { name: 'Rich Media', main: '#0055ff', mid: '#8fb2ff', tint: '#e8efff' },
    /* 2026-10-29: in hue order for the developer products, blue → violet → orchid (220°, 254°, 284°), and magenta (328°)
       for the publisher side, continuing the run (2026-10-30; was green 154°).
       Main on tint passes 4.5:1 for each (orchid 4.7). */
    preview: { name: 'Preview API', main: '#6a3bff', mid: '#b8a3ff', tint: '#efeaff' },
    data: { name: 'Data API', main: '#a52fd0', mid: '#dba4ef', tint: '#f7ebfc' },
    pub: { name: 'Publisher Console', main: 'var(--pub-m,#c81d77)', mid: 'var(--pub-mid,#f193c3)', tint: 'var(--pub-t,#fdecf5)' }, /* CSS variables so the K page can try other colours; magenta by default since 2026-10-30 (was green #007a45) */
  };
  /* duotone icons, same as the Figma badges */
  const ICO = {
    rich: (a, b) => `<rect x="2" y="4" width="20" height="16" rx="4" fill="${b}"/><path d="M10 8.6v6.8l5.8-3.4z" fill="${a}"/>`,
    preview: (a, b) => `<rect x="2" y="4" width="20" height="16" rx="4" fill="${b}"/><rect x="5" y="7.5" width="6" height="6" rx="1.5" fill="${a}"/><rect x="13" y="8" width="6" height="2" rx="1" fill="${a}"/><rect x="13" y="11.5" width="4" height="2" rx="1" fill="${a}"/><rect x="5" y="15.5" width="12" height="2" rx="1" fill="${a}"/>`,
    data: (a, b) => `<circle cx="12" cy="12" r="10" fill="${b}"/><path d="M9.6 6.5c-1.6 0-2.3.7-2.3 2.2v1.6c0 1-.6 1.6-1.6 1.7 1 .1 1.6.7 1.6 1.7v1.6c0 1.5.7 2.2 2.3 2.2M14.4 6.5c1.6 0 2.3.7 2.3 2.2v1.6c0 1 .6 1.6 1.6 1.7-1 .1-1.6.7-1.6 1.7v1.6c0 1.5-.7 2.2-2.3 2.2" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    pub: (a, b) => `<rect x="2" y="4" width="20" height="16" rx="4" fill="${b}"/><rect x="6" y="12" width="2.6" height="5" rx="1.3" fill="${a}"/><rect x="10.7" y="9" width="2.6" height="8" rx="1.3" fill="${a}"/><rect x="15.4" y="6.5" width="2.6" height="10.5" rx="1.3" fill="${a}"/>`,
  };
  const icon = (k, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24">${ICO[k](PROD[k].main, PROD[k].mid).replace(/(fill|stroke)="(var\([^"]+\))"/g, 'style="$1:$2"')}</svg>`; /* var() only works as a style, not as an SVG attribute */
  const fav = k => { if (/^https?:/.test(k || '')) return `<img alt="" src="${k}">`; const I = (DEMOS.logoKit && DEMOS.logoKit.cardKit && DEMOS.logoKit.cardKit.ICON) || {}; return I[k] ? `<img alt="" src="${I[k].src}">` : `<img alt="" src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' rx='3.5' fill='#171717'/><text x='8' y='11.6' font-family='Arial' font-weight='700' font-size='10' fill='#fff' text-anchor='middle'>${(k || '?')[0].toUpperCase()}</text></svg>`)}">`; }; /* no favicon in the kit: a letter tile, as an img so it sizes like the others */
  const R = DEMOS.reduced;

  const CSS = `
.sx{--ink:#171717;--mut:#666666;--g:#939393;--g2:#bbbbbb;--line:#e7e7e7;--soft:#f7f7f7;--bl:#0055ff;font-family:Geist,Inter,ui-sans-serif,system-ui,sans-serif;color:var(--ink);background:#fff;padding:64px clamp(16px,4.5cqw,64px) 72px;container-type:inline-size}
.sx *{box-sizing:border-box}
.sx-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 11px 5px 7px;border-radius:8px;background:var(--t);color:var(--m);font-size:14px;font-weight:500}
.sx-badge svg{display:block}
.sx-eyebrow{font-size:14px;font-weight:500;color:var(--mut)}
.sx h1,.sx h2{font-family:inherit;font-style:normal;font-weight:400;margin:18px 0 0;text-wrap:balance}
.sx h2{font-size:32px;line-height:1.2;letter-spacing:-.02em;max-width:22ch}
.sx h1{font-size:clamp(40px,5.4cqw,66px);line-height:1.05;letter-spacing:-.035em;max-width:15ch}
.sx-sub{font-size:17px;line-height:1.55;color:var(--mut);margin:16px 0 0;max-width:54ch}
.sx-sub+.sx-sub{margin-top:10px}
.sx-sub code{font:15px 'Geist Mono',ui-monospace,monospace;color:var(--ink)}
.sx-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.sx-btn{display:inline-flex;align-items:center;height:42px;padding:0 18px;border-radius:10px;font-size:15px;font-weight:500;text-decoration:none}
.sx-btn.primary{background:var(--ink);color:#fff}
.sx-btn.secondary{border:1px solid var(--line);color:var(--ink);background:#fff}
.sx-btn.quiet{color:var(--ink);padding:0 6px}
.sx-meta{font-size:13px;color:var(--g);margin:22px 0 0}
.sx-side{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(32px,5cqw,72px);align-items:center}
.sx-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:56px;align-items:end;margin-bottom:48px}
.sx-head .sx-sub:first-child{margin-top:0}
.sx-slot{min-width:0;position:relative}
.mono{font-family:'Geist Mono','JetBrains Mono',ui-monospace,monospace}
.sx-fl{display:inline-grid;place-items:center;width:14px;height:14px;border-radius:4px;background:var(--ink);color:#fff;font:600 9px/1 Geist,sans-serif;font-style:normal}
/* P08 windows in the cool greys of this page */
.sx .ph{--ink:#171717;--i7:#666666;--i5:#939393;--i3:#d5d5d5;--i2:#e7e7e7;--i1:#f1f1f1;font-family:Geist,Inter,sans-serif}
.sx .ph-hub{background:#171717}
/* shared window chrome */
.sx-stage{background:var(--soft);border-radius:22px;padding:clamp(14px,3cqw,40px)}
.sx-win{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 1px 2px rgba(23,23,23,.04),0 12px 32px rgba(23,23,23,.06);overflow:hidden;min-width:0;display:flex;flex-direction:column}
.sx-bar{display:flex;align-items:center;gap:6px;padding:11px 14px;font-size:13px;border-bottom:1px solid var(--line);white-space:nowrap}
.sx-bar i{flex:none;width:10px;height:10px;border-radius:50%;background:var(--line)}
.sx-bar span{margin-left:10px;overflow:hidden;text-overflow:ellipsis}
.sx-bar .r{margin-left:auto;color:var(--g);font-size:12px;font-style:normal}
.sx-kv{display:grid;grid-template-columns:auto 1fr;gap:7px 18px;font:12.5px/1.45 'Geist Mono',ui-monospace,monospace}
.sx-kv dt{color:var(--g)}
.sx-kv dd{margin:0;color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sx-kv dt,.sx-kv dd{transition:opacity .35s}
.sx-kv .off{opacity:0}
.sx-caret{display:inline-block;width:2px;height:1.05em;background:var(--ink);vertical-align:-2px;margin-left:1px;animation:sx-blink 1s steps(1) infinite}
@keyframes sx-blink{50%{opacity:0}}
.sx-marq{display:flex;gap:10px;overflow:hidden;margin-top:22px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.sx-marq>div{display:flex;gap:10px;width:max-content;animation:sx-drift 70s linear infinite}
.sx-marq:hover>div{animation-play-state:paused}
.sx-marq span{height:34px;display:inline-flex;align-items:center;padding:0 14px;border:1px solid var(--line);border-radius:17px;background:#fff;font-size:14px;color:var(--mut);white-space:nowrap}
.sx-marq b{font-weight:500;color:var(--ink)}
.sx-marq span img{width:16px;height:16px;margin-right:8px;flex:none}
@keyframes sx-drift{to{transform:translateX(-50%)}}
/* rich media */
.rm{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(0,1fr);gap:20px;align-items:start}
.rm-doc{padding:30px clamp(18px,3.4cqw,44px) 34px;font-size:15px;line-height:1.6;color:var(--mut)}
.rm-doc h3{font-weight:600;font-size:24px;letter-spacing:-.02em;color:var(--ink);margin:0 0 10px}
.rm-doc p{margin:0 0 14px;max-width:60ch}
.rm-slot{position:relative;margin:4px 0 18px;transition:height .55s cubic-bezier(.3,.7,.2,1)}
.rm-url{font:14px 'Geist Mono',ui-monospace,monospace;color:var(--bl);white-space:nowrap;overflow:hidden;line-height:24px}
.rm-res{position:absolute;inset:0;border:1.5px dashed var(--g2);border-radius:12px;display:grid;place-items:center;font:12px 'Geist Mono',ui-monospace,monospace;color:var(--g);transition:opacity .35s}
.rm-emb{position:absolute;inset:0;border-radius:12px;overflow:hidden;opacity:0;transition:opacity .5s}
.rm-emb.on{opacity:1}
.rm-video{background:radial-gradient(circle at 72% 30%,#ffd28a 0 7%,transparent 7.5%),linear-gradient(180deg,#2c3e66 0%,#5a6f9c 58%,#162038 58.5%,#24304d 100%)}
.rm-video em{position:absolute;left:50%;top:50%;width:62px;height:62px;margin:-31px;border-radius:50%;background:rgba(255,255,255,.94);display:grid;place-items:center}
.rm-video em::after{content:"";border-left:18px solid var(--bl);border-top:11px solid transparent;border-bottom:11px solid transparent;margin-left:5px}
.rm-video .bar{position:absolute;left:14px;right:14px;bottom:12px;height:4px;border-radius:2px;background:rgba(255,255,255,.35)}
.rm-video .bar::before{content:"";position:absolute;inset:0 72% 0 0;background:#fff;border-radius:2px}
.rm-audio{background:#fff;border:1px solid var(--line);display:grid;grid-template-columns:96px 1fr;gap:16px;padding:14px}
.rm-audio .art{border-radius:8px;background:linear-gradient(135deg,#ffcf8a,#f2552c)}
.rm-audio .meta{min-width:0;display:flex;flex-direction:column;gap:8px;font-size:13px;color:var(--mut)}
.rm-audio .meta b{color:var(--ink);font-weight:600;font-size:15px}
.rm-wave{flex:1;display:flex;align-items:center;gap:2px}
.rm-wave u{flex:1;background:var(--g2);border-radius:2px}
.rm-wave u.p{background:var(--bl)}
.rm-post{background:#fff;border:1px solid var(--line);padding:16px 18px;display:grid;grid-template-columns:40px 1fr;gap:12px;font-size:14px;color:var(--ink);line-height:1.5}
.rm-post .av{width:40px;height:40px;border-radius:50%;background:#171717;display:grid;place-items:center;color:var(--bl);font:800 16px 'JetBrains Mono',monospace;letter-spacing:-.08em}
.rm-post small{color:var(--g);font-size:13px}
.rm-post p{margin:4px 0 10px}
.rm-post .img{height:92px;border-radius:10px;background:linear-gradient(120deg,#d3e1ff,#8fb2ff)}
.rm-map{background-color:#e9eef0;background-image:linear-gradient(90deg,transparent 46%,#fff 46% 50%,transparent 50%),linear-gradient(transparent 58%,#fff 58% 62%,transparent 62%),linear-gradient(32deg,transparent 38%,#d5e4d3 38% 64%,transparent 64%),linear-gradient(150deg,transparent 70%,#cfe0ee 70%)}
.rm-map em{position:absolute;left:61%;top:28%;width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--bl);box-shadow:0 4px 10px rgba(0,85,255,.35)}
.rm-cap{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--g);margin-top:-8px;margin-bottom:16px;min-height:18px;transition:opacity .4s}
.rm-cap img{width:14px;height:14px}
.rm-cap b{color:var(--ink);font-weight:500}
.rm-rail{padding:18px 18px 20px}
.rm-rail .sx-kv{grid-template-columns:72px 1fr}
.rm-code{margin-top:16px;padding:10px 12px;border-radius:9px;background:var(--soft);font:12px/1.5 'Geist Mono',ui-monospace,monospace;color:var(--g);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .4s}
.rm-code b{color:var(--bl);font-weight:600}
/* preview */
.pv{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) minmax(0,.85fr);gap:18px;align-items:stretch}
.pv-chat{padding:16px 16px 14px;display:flex;flex-direction:column;gap:14px;font-size:14px;flex:1}
.pv-m{display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px}
.pv-m .av{width:30px;height:30px;border-radius:8px}
.pv-m p{margin:0;line-height:1.45;color:var(--ink)}
.pv-m small{display:block;font-size:12px;color:var(--g);margin-bottom:1px}
.pv-m a{color:var(--bl);text-decoration:none;word-break:break-all}
.pv-old p{color:var(--mut)}
.pv-unf{margin-top:8px;border-left:3px solid var(--line);padding:2px 0 2px 11px;display:grid;grid-template-columns:minmax(0,1fr) 56px;gap:10px;font-size:13px;opacity:0;transform:translateY(6px);transition:opacity .45s,transform .45s}
.pv-unf.on,.pv-card.on{opacity:1;transform:none}
.pv-s{display:flex;align-items:center;gap:6px;color:var(--g);font-size:12px}
.pv-s img{width:13px;height:13px}
.pv-t{font-weight:600;color:var(--ink);margin:3px 0 2px}
.pv-d{color:var(--mut);font-size:12.5px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pv-unf .th{width:56px;height:56px;border-radius:8px}
.pv-new{opacity:0;transition:opacity .35s}.pv-new.on{opacity:1}
.pv-comp{margin-top:auto;border:1px solid var(--line);border-radius:10px;padding:9px 12px;color:var(--g);font-size:13px}
.pv-doc{padding:24px 26px;font-size:14px;line-height:1.6;color:var(--mut);flex:1}
.pv-doc h3{font-weight:600;font-size:20px;letter-spacing:-.015em;color:var(--ink);margin:0 0 8px}
.pv-doc p{margin:0 0 12px}
.pv-url{font:13px 'Geist Mono',ui-monospace,monospace;color:var(--bl);min-height:22px;white-space:nowrap;overflow:hidden}
.pv-card{border:1px solid var(--line);border-radius:12px;overflow:hidden;opacity:0;transform:translateY(8px);transition:opacity .5s,transform .5s;background:#fff}
.pv-card .img{aspect-ratio:2/1}
.pv-card .tx{padding:12px 14px 14px}
.pv-src{padding:16px 16px 18px;font-size:13px;flex:1;display:flex;flex-direction:column}
.pv-src h4{margin:0 0 12px;font-size:12px;font-weight:500;color:var(--g);text-transform:uppercase;letter-spacing:.06em}
.pv-row{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px dashed var(--line);color:var(--g2);transition:color .3s}
.pv-row i{flex:none;width:8px;height:8px;border-radius:50%;border:1.5px solid currentColor;transition:background .3s}
.pv-row span{margin-left:auto;font:11.5px 'Geist Mono',ui-monospace,monospace}
.pv-row.y{color:var(--ink)}.pv-row.y i{background:var(--ink);border-color:var(--ink)}.pv-row.y span{color:var(--g)}
.pv-row.n{color:var(--g)}
.pv-out{margin-top:auto;padding-top:14px;color:var(--mut);line-height:1.5;opacity:0;transition:opacity .4s}
.pv-out.on{opacity:1}
.pv-out b{color:var(--ink);font-weight:500}
/* data */
.da{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:18px;align-items:stretch}
.da-term{padding:18px 20px 20px;font:13px/1.7 'Geist Mono',ui-monospace,monospace;color:var(--ink);white-space:pre;overflow:hidden;min-height:440px;flex:1}
.da-term .g{color:var(--g)}.da-term .u{color:var(--bl)}.da-term .x{color:var(--g2)}
.da-acc{padding:18px 20px 20px;font-size:13px;flex:1}
.da-acc h4{margin:0 0 10px;font:500 11.5px 'Geist Mono',ui-monospace,monospace;color:var(--g);letter-spacing:.04em}
.da-acc h4:not(:first-child){margin-top:20px}
.da-req{font:12.5px 'Geist Mono',ui-monospace,monospace;color:var(--ink);min-height:18px}
.da-req span{color:var(--g)}
.da-sig,.da-dec{display:grid;grid-template-columns:118px minmax(0,1fr);gap:4px 12px;font:12.5px/1.75 'Geist Mono',ui-monospace,monospace}
.da-sig>*,.da-dec>*{opacity:0;transform:translateX(-4px);transition:opacity .3s,transform .3s}
.da-sig>.on,.da-dec>.on{opacity:1;transform:none}
.da-sig dt,.da-dec dt{color:var(--g)}
.da-sig dd,.da-dec dd{margin:0;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.da-sig dd.n{color:var(--g2)}
.da-dec dd::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ink);margin-right:8px;vertical-align:0}
.da-dec dd.no{color:var(--g)}
.da-dec dd.no::before{background:none;border:1.5px solid var(--g2);width:5px;height:5px}
.da-dec dd em{font-style:normal;color:var(--g)}
/* publisher console */
.pc{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.7fr) minmax(0,1fr);min-height:460px}
.pc>*{min-width:0;padding:18px 18px 20px}
.pc>*+*{border-left:1px solid var(--line)}
.pc h4{margin:0 0 12px;font-size:12px;font-weight:500;color:var(--g);text-transform:uppercase;letter-spacing:.06em}
.pc-ag{border:1px solid var(--line);border-radius:10px;padding:12px 13px;margin-bottom:10px}
.pc-ag div{display:flex;justify-content:space-between;align-items:baseline;font-size:13px}
.pc-ag b{font-weight:500}
.pc-ag s{text-decoration:none;font:600 20px Geist,sans-serif;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.pc-ag small{display:block;color:var(--g);font-size:12px;margin-top:3px}
.pc-ag u{display:block;height:5px;border-radius:3px;background:var(--line);margin-top:9px;overflow:hidden}
.pc-ag u::before{content:"";display:block;height:100%;width:var(--w);background:var(--c,var(--ink));border-radius:3px;transition:width .8s}
.pc-feed{font:12px/1 'Geist Mono',ui-monospace,monospace}
.pc-r{display:grid;grid-template-columns:62px 84px minmax(0,.9fr) minmax(0,1.3fr) 66px;gap:10px;align-items:center;height:34px;border-bottom:1px solid var(--line);color:var(--ink);white-space:nowrap}
.pc-r>*{overflow:hidden;text-overflow:ellipsis}
.pc-r.hd{color:var(--g);height:26px;font-size:11px}
.pc-r .t,.pc-r .p{color:var(--g)}
.pc-r .v{text-align:right}
.pc-r .v.ex{color:var(--g)}
.pc-r.new{animation:pc-in .5s ease-out}
.pc-r.hit{background:linear-gradient(90deg,rgba(0,85,255,.07),transparent)}
@keyframes pc-in{from{opacity:0;transform:translateY(-6px)}}
.pc-pol{display:flex;flex-direction:column;gap:10px}
.pc-p{border:1px solid var(--line);border-radius:10px;padding:11px 12px;font-size:13px;transition:border-color .4s,box-shadow .4s}
.pc-p.flash{border-color:var(--bl);box-shadow:0 0 0 3px rgba(0,85,255,.12)}
.pc-p code{font:12px 'Geist Mono',ui-monospace,monospace}
.pc-p div{display:flex;justify-content:space-between;align-items:center;margin-top:8px;color:var(--mut)}
.pc-sel{font:12px 'Geist Mono',ui-monospace,monospace;color:var(--ink);border:1px solid var(--line);border-radius:7px;padding:4px 8px}
.pc-note{margin-top:auto;font-size:12px;color:var(--g);line-height:1.5}
@container (max-width:1000px){.pv{grid-template-columns:1fr 1fr}.pv>.sx-win:last-child{grid-column:1/-1}.pc{grid-template-columns:1fr 1.6fr}.pc>.pc-c{display:none}}
@container (max-width:860px){.sx-side,.sx-head{grid-template-columns:1fr}.sx-head{gap:0}.rm,.da{grid-template-columns:1fr}}
@container (max-width:640px){.pv,.pc{grid-template-columns:1fr}.pc>*+*{border-left:0;border-top:1px solid var(--line)}}
@media (prefers-reduced-motion:reduce){.sx-marq>div,.sx-caret{animation:none}}
`;
  const ensure = () => {
    if (document.getElementById('css-sx')) return;
    document.head.append(h('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap' }), h('style', { id: 'css-sx' }, CSS));
  };

  /* the section mock-up: badge or eyebrow, heading, copy, buttons; returns the slot for the scene */
  function section(stage, o) {
    ensure();
    const P = o.prod && PROD[o.prod];
    const badge = P ? h('span', { class: 'sx-badge', style: `--m:${P.main};--t:${P.tint}`, html: icon(o.prod, 18) + P.name }) : o.eyebrow ? h('span', { class: 'sx-eyebrow' }, o.eyebrow) : null;
    const H = h(o.hero ? 'h1' : 'h2', { html: o.title });
    const subs = (Array.isArray(o.sub) ? o.sub : [o.sub]).map(s => h('p', { class: 'sx-sub', html: s }));
    const btns = o.btns && o.btns.length ? h('div', { class: 'sx-btns' }, ...o.btns.map(([t, v]) => h('a', { class: 'sx-btn ' + (v || 'primary'), href: '#' }, t))) : null;
    const meta = o.meta ? h('p', { class: 'sx-meta' }, o.meta) : null;
    const slot = h('div', { class: 'sx-slot' });
    const root = o.layout === 'large'
      ? h('section', { class: 'sx sx-large' }, h('div', { class: 'sx-head' }, h('div', null, badge, H), h('div', null, ...subs, btns, meta)), slot)
      : h('section', { class: 'sx' }, h('div', { class: 'sx-side' }, h('div', null, badge, H, ...subs, btns, meta), slot));
    stage.appendChild(root);
    return slot;
  }
  /* the site bands hold (.off) until a fair part of them is on screen: 40% of the band, or of the viewport for a band
     taller than it; once started they pause only when fully out of view */
  const inView = root => {
    root.classList.add('off');
    let started = false;
    const io = new IntersectionObserver(es => {
      for (const e of es) {
        if (started) { root.classList.toggle('off', !e.isIntersecting); continue; }
        const need = Math.min(e.boundingClientRect.height, innerHeight) * 0.4;
        if (e.isIntersecting && e.intersectionRect.height >= need) { started = true; root.classList.remove('off'); }
      }
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    io.observe(root);
    return io;
  };
  const win = (title, body, right, cls) => h('div', { class: 'sx-win ' + (cls || '') }, h('div', { class: 'sx-bar', html: `<i></i><i></i><i></i><span>${title}</span>${right ? `<em class="r">${right}</em>` : ''}` }), body);
  const runner = (el, fn) => { const tl = DEMOS.timeline(DEMOS.hoverPause(el)); const S = ms => R ? Promise.resolve() : tl.sleep(ms), W = ms => R ? Promise.resolve() : tl.wait(ms);
    (async () => { try { do { await fn(S, W, tl); } while (tl.alive && !R); } catch (e) { console.warn(e); } })(); return () => tl.destroy(); };
  const typeInto = async (el, s, S, ms = 26, wrap = x => x) => { for (let i = 1; i <= s.length; i++) { el.innerHTML = wrap(s.slice(0, i)) + '<span class="sx-caret"></span>'; await S(ms); } el.innerHTML = wrap(s); };

  /* ── S01 hero, large: copy on top, P08 as a short band ── */
  const HOME = {
    eyebrow: 'Holding the web together since 2012', title: 'Iframely makes URLs work inside other products',
    sub: 'Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.',
    btns: [['Get an API key'], ['Read the docs', 'secondary'], ['Check a URL →', 'quiet']], meta: '6.5 billion requests a month · 99.99% uptime · SOC 2 Type II',
  };
  DEMOS.register('sec-hero-large', {
    group: 'sec', title: 'Hero · large: one engine, four apps as a band',
    blurb: 'Pick for the full-width hero slot. P08 cut down to its top half: the // hub and the four product windows in one row, about 420 px tall, under the home page hero copy. The hub pings and one window updates every few seconds. Alternatives: L28 glyphs (full-bleed background rather than a band), H01 four results stack.',
    mount(stage) { const slot = section(stage, Object.assign({ layout: 'large', hero: true }, HOME)); return DEMOS.prodKit(slot, { compact: true, bare: true }); },
  });

  /* ── S02 hero, side: L53's idea in this page's style, one window, three kinds of call ── */
  const CALLS = [
    { cmd: 'embed', url: 'youtube.com/watch?v=dQw4w9WgXcQ', flags: '--iframe', ms: 96, res: `<div class="hs-res hs-play"><em></em><span>${'YouTube'} · player · 16:9</span></div>` },
    { cmd: 'preview', url: 'github.com/itteco/iframely', flags: '--card', ms: 140, res: `<div class="hs-res hs-card"><div><div class="pv-s">GITHUB</div><div class="pv-t">itteco/iframely</div><div class="pv-d">oEmbed proxy: one endpoint for embeds and previews of any URL.</div></div><i></i></div>` },
    { cmd: 'data', url: 'en.wikipedia.org/wiki/Kerala', flags: '--mode=assist', ms: 412, res: `<div class="hs-res hs-md"><b># Kerala</b><span>A state on the Malabar Coast of India,</span><span>formed in 1956 …</span><small>access · full text allowed · CC BY-SA</small></div>` },
  ];
  const HS_CSS = `
.hs{padding:18px 20px 22px;font:13px/1.7 'Geist Mono',ui-monospace,monospace;color:var(--ink);min-height:470px}
.hs-l{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hs-l .g{color:var(--g)}.hs-l .u{color:var(--bl)}
.hs-st{color:var(--g);padding-left:3ch}
.hs-res{margin:6px 0 16px 3ch;border:1px solid var(--line);border-radius:10px;opacity:0;transform:translateY(4px);transition:opacity .4s,transform .4s;font-family:Geist,Inter,sans-serif}
.hs-res.on{opacity:1;transform:none}
.hs-play{height:118px;border:0;background:linear-gradient(180deg,#2c3e66 0%,#5a6f9c 60%,#162038 60.5%);position:relative;overflow:hidden}
.hs-play em{position:absolute;left:50%;top:44%;width:40px;height:40px;margin:-20px;border-radius:50%;background:rgba(255,255,255,.94);display:grid;place-items:center}
.hs-play em::after{content:"";border-left:12px solid var(--bl);border-top:7px solid transparent;border-bottom:7px solid transparent;margin-left:3px}
.hs-play span{position:absolute;left:12px;bottom:8px;font:11.5px 'Geist Mono',monospace;color:rgba(255,255,255,.8)}
.hs-card{display:grid;grid-template-columns:1fr 64px;gap:12px;padding:12px 14px;font-size:13px}
.hs-card .pv-s{font:11px 'Geist Mono',monospace;letter-spacing:.04em}
.hs-card i{border-radius:8px;background:linear-gradient(135deg,#666666,#171717)}
.hs-md{padding:12px 14px;display:grid;gap:2px;font:12.5px/1.55 'Geist Mono',monospace;color:var(--g)}
.hs-md b{color:var(--ink);font-weight:500}
.hs-md small{margin-top:6px;font-size:11.5px;color:var(--g2)}
`;
  DEMOS.register('sec-hero-side', {
    group: 'sec', title: 'Hero · side: three calls in one window',
    blurb: 'New, after L53 (iframely CLI), rebuilt in this page’s style so it sits next to the Geist hero: one terminal window, three calls in turn (embed, preview, data), each typed, then its status in grey and the result as the product shows it (a player, a card, Markdown with its access line). The URL is the only blue; the > prompt becomes // when the call is done; responses are indented under the command. Clears and starts again. L53 itself (full-bleed, serif) stays the alternative.',
    mount(stage) {
      const slot = section(stage, Object.assign({ hero: true }, HOME, { btns: [['Get an API key'], ['Read the docs', 'secondary']] }));
      if (!document.getElementById('css-hs')) document.head.appendChild(h('style', { id: 'css-hs' }, HS_CSS));
      const body = h('div', { class: 'hs' });
      slot.appendChild(win('Iframely', body, 'iframely 2.0'));
      return runner(slot, async (S, W) => {
        body.innerHTML = '';
        for (const c of CALLS) {
          const line = h('div', { class: 'hs-l' }); body.appendChild(line);
          const parts = [['iframely ' + c.cmd + ' ', ''], [c.url, 'u'], [' ' + c.flags, '']], total = parts.reduce((m, [t]) => m + t.length, 0);
          const paint = (n, p) => { let left = n, s = `<span class="g">${p.padEnd(2)} </span>`; for (const [t, k] of parts) { const part = t.slice(0, Math.max(0, left)); left -= t.length; s += k ? `<span class="${k}">${part}</span>` : part; if (left < 0) break; } line.innerHTML = s + (n < total ? '<span class="sx-caret"></span>' : ''); };
          for (let i = 0; i <= total; i += 2) { paint(i, '>'); await S(22); }
          paint(total, '>'); await S(c.ms * 2);
          body.appendChild(h('div', { class: 'hs-st' }, `200 · ${c.ms} ms`));
          const res = h('div', { html: c.res }).firstChild; body.appendChild(res); await S(60); res.classList.add('on');
          paint(total, '//'); await W(1300);
        }
        await W(2600);
      });
    },
  });

  /* ── Rich Media ── */
  const bars = n => Array.from({ length: n }, (_, i) => `<u class="${i < n * .38 ? 'p' : ''}" style="height:${Math.round(20 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * .45)))}%"></u>`).join('');
  const EMB = [
    { url: 'youtube.com/watch?v=dQw4w9WgXcQ', fav: 'youtube', site: 'YouTube', type: 'player · video', ratio: 9 / 16, res: '16:9 · height reserved', html: 'x7Kd2?iframe=1&omit_script=1', inner: '<div class="rm-emb rm-video"><em></em><div class="bar"></div></div>' },
    { url: 'soundcloud.com/bonobo/kerala', fav: 'soundcloud', site: 'SoundCloud', type: 'player · audio', px: 124, res: '124 px · height reserved', html: 'q2Lm8?iframe=1&playerjs=1', inner: `<div class="rm-emb rm-audio"><div class="art"></div><div class="meta"><span>Bonobo</span><b>Kerala</b><div class="rm-wave">${bars(56)}</div></div></div>` },
    { url: 'x.com/iframely/status/1849203', fav: 'x', site: 'X', type: 'rich · post', px: 214, res: '≈ 214 px · predicted', html: 'Pt7wQ?iframe=1&consent=1', inner: '<div class="rm-emb rm-post"><div class="av">//</div><div><b>Iframely</b> <small>@iframely · 2h</small><p>Embeds for 1,900 providers, kept up to date since 2012.</p><div class="img"></div></div></div>' },
    { url: 'google.com/maps/place/Kochi', fav: 'maps', site: 'Google Maps', type: 'player · map', ratio: 1 / 2.2, res: '2.2:1 · height reserved', html: 'm9Rt3?iframe=1&lazy=1', inner: '<div class="rm-emb rm-map"><em></em></div>' },
  ];
  /* the marquee's providers with their icons: iframely.com/domains (strapi.iframely.net, 2026-10-30), Twitch and
     Mixcloud from the live site's repo (publicly/src/lib), inlined so the page makes no requests. Bluesky, CodePen,
     Typeform, Apple Podcasts and Prezi had no icon there and gave way to Reddit, Airtable, Notion, Apple Music, Google Drive. */
  const PROVIDERS = [
    ['YouTube', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='red' d='M31.33 8.498a4.007 4.007 0 0 0-2.828-2.829C26.007 5 16 5 16 5S5.993 5 3.498 5.67A4.007 4.007 0 0 0 .67 8.497C0 10.993 0 16.201 0 16.201s0 5.207.67 7.702a4.007 4.007 0 0 0 2.828 2.829C5.993 27.4 16 27.4 16 27.4s10.007 0 12.502-.67a4.007 4.007 0 0 0 2.829-2.828C32 21.408 32 16.2 32 16.2s-.003-5.208-.67-7.703Z'/%3E%3Cpath fill='%23fff' d='m12.797 21 8.313-4.799-8.313-4.8v9.6Z'/%3E%3C/svg%3E"],
    ['Vimeo', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%231AB7EA' d='M28.8 0H3.2A3.2 3.2 0 0 0 0 3.2v25.6A3.2 3.2 0 0 0 3.2 32h25.6a3.2 3.2 0 0 0 3.2-3.2V3.2A3.2 3.2 0 0 0 28.8 0Z'/%3E%3Cpath fill='%23fff' d='M26.925 10.627c-.104 2.25-1.674 5.333-4.717 9.245C19.064 23.957 16.403 26 14.229 26c-1.349 0-2.488-1.243-3.421-3.733-.621-2.28-1.243-4.563-1.867-6.843-.693-2.488-1.434-3.733-2.229-3.733-.173 0-.779.365-1.816 1.088l-1.088-1.4A295.481 295.481 0 0 0 7.181 8.37c1.523-1.315 2.667-2.006 3.427-2.078 1.8-.173 2.907 1.056 3.323 3.691.45 2.84.76 4.608.936 5.299.52 2.357 1.09 3.533 1.714 3.533.483 0 1.211-.765 2.182-2.293.968-1.528 1.485-2.691 1.557-3.491.139-1.32-.381-1.981-1.557-1.981-.555 0-1.126.128-1.712.378 1.136-3.722 3.309-5.53 6.512-5.426 2.376.069 3.496 1.61 3.36 4.621l.002.003Z'/%3E%3C/svg%3E"],
    ['Spotify', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%231ED760' d='M16 0C7.164 0 0 7.164 0 16c0 8.837 7.164 16 16 16 8.838 0 16-7.163 16-16 0-8.836-7.162-16-16-16Zm7.338 23.077a.997.997 0 0 1-1.372.33c-3.757-2.294-8.486-2.814-14.055-1.542a.998.998 0 0 1-.444-1.945c6.095-1.392 11.323-.793 15.54 1.785.47.288.62.902.33 1.372Zm1.958-4.357a1.248 1.248 0 0 1-1.715.411c-4.301-2.643-10.857-3.409-15.944-1.865a1.25 1.25 0 0 1-1.557-.83 1.25 1.25 0 0 1 .832-1.557c5.81-1.763 13.035-.909 17.974 2.126.586.361.771 1.13.41 1.715Zm.169-4.536c-5.157-3.063-13.665-3.345-18.589-1.85a1.496 1.496 0 1 1-.869-2.865c5.652-1.716 15.048-1.384 20.985 2.14a1.496 1.496 0 1 1-1.527 2.574Z'/%3E%3C/svg%3E"],
    ['SoundCloud', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23F50' fill-rule='evenodd' d='M31.997 18.07a4.48 4.48 0 0 1-4.535 4.23H16.558a.915.915 0 0 1-.905-.909V9.651a1 1 0 0 1 .603-.956S17.258 8 19.37 8a7.145 7.145 0 0 1 3.666 1.007 7.254 7.254 0 0 1 3.413 4.728 4.212 4.212 0 0 1 1.157-.158 4.365 4.365 0 0 1 4.391 4.494Zm-17.705-7.676c.33 3.982.568 7.613 0 11.582a.354.354 0 0 1-.704 0c-.529-3.935-.298-7.635 0-11.582a.353.353 0 0 1 .54-.339.354.354 0 0 1 .164.339ZM12.086 21.98a.37.37 0 0 1-.734 0 44.265 44.265 0 0 1 0-10.22.372.372 0 0 1 .739 0 39.77 39.77 0 0 1-.005 10.22Zm-2.21-10.566c.358 3.649.52 6.917-.004 10.557a.355.355 0 0 1-.709 0c-.508-3.593-.337-6.955 0-10.557a.357.357 0 0 1 .356-.319c.183 0 .337.137.356.32ZM7.66 21.984a.364.364 0 0 1-.721 0 37.382 37.382 0 0 1 0-9.542.366.366 0 1 1 .734 0 34.87 34.87 0 0 1-.013 9.543Zm-2.21-7.156c.558 2.475.306 4.66-.022 7.182a.346.346 0 0 1-.683 0c-.299-2.488-.546-4.724-.021-7.183a.363.363 0 0 1 .725.001Zm-2.207-.376c.512 2.535.346 4.682-.013 7.225-.042.376-.686.38-.72 0-.325-2.505-.479-4.716-.014-7.225a.376.376 0 0 1 .747 0Zm-2.227 1.23c.537 1.68.354 3.047-.022 4.77a.35.35 0 0 1-.696 0c-.324-1.69-.455-3.085-.029-4.77a.375.375 0 0 1 .747 0Z' clip-rule='evenodd'/%3E%3C/svg%3E"],
    ['TikTok', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23FF004F' d='M22.987 11.551a12.568 12.568 0 0 0 7.331 2.345V8.638a7.426 7.426 0 0 1-1.54-.16v4.138a12.57 12.57 0 0 1-7.33-2.345v10.73c0 5.368-4.354 9.719-9.724 9.719a9.68 9.68 0 0 1-5.413-1.644A9.697 9.697 0 0 0 13.263 32c5.37 0 9.725-4.351 9.725-9.719v-10.73Zm1.9-5.304a7.328 7.328 0 0 1-1.9-4.29V1.28h-1.459a7.36 7.36 0 0 0 3.359 4.967Zm-15.18 18.71a4.447 4.447 0 0 1 4.89-6.929v-5.375c-.51-.07-1.024-.1-1.539-.089v4.184a4.447 4.447 0 0 0-3.351 8.209Z'/%3E%3Cpath fill='%23000' d='M21.448 10.271a12.57 12.57 0 0 0 7.33 2.345V8.477a7.36 7.36 0 0 1-3.891-2.23 7.361 7.361 0 0 1-3.359-4.967h-3.832v21a4.447 4.447 0 0 1-7.989 2.677 4.445 4.445 0 0 1 2.001-8.417c.471 0 .925.074 1.35.209v-4.184c-5.276.109-9.519 4.417-9.519 9.716a9.683 9.683 0 0 0 2.772 6.795 9.682 9.682 0 0 0 5.413 1.644c5.37 0 9.724-4.351 9.724-9.719v-10.73Z'/%3E%3Cpath fill='%2300F2EA' d='M28.779 8.477V7.358a7.333 7.333 0 0 1-3.892-1.111 7.353 7.353 0 0 0 3.892 2.23Zm-7.25-7.197a7.483 7.483 0 0 1-.081-.604V0h-5.292v21.001a4.447 4.447 0 0 1-6.449 3.956 4.447 4.447 0 0 0 7.989-2.676V1.28h3.832Zm-8.47 11.285v-1.192a9.824 9.824 0 0 0-1.335-.09C6.354 11.283 2 15.633 2 21a9.708 9.708 0 0 0 4.311 8.075 9.683 9.683 0 0 1-2.771-6.795c0-5.299 4.242-9.607 9.518-9.716Z'/%3E%3C/svg%3E"],
    ['Instagram', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='url(%23a)' d='M16.008.242C9.428.242 7.504.25 7.13.28c-1.35.112-2.19.325-3.106.78a6.292 6.292 0 0 0-1.81 1.326C1.213 3.424.606 4.702.387 6.22.28 6.957.25 7.107.244 10.87c-.003 1.255 0 2.906 0 5.121 0 6.575.007 8.497.038 8.87.11 1.315.316 2.141.752 3.046a6.64 6.64 0 0 0 4.303 3.515c.65.167 1.367.26 2.288.303.39.017 4.369.029 8.35.029 3.98 0 7.96-.005 8.341-.024 1.067-.05 1.686-.134 2.371-.31a6.599 6.599 0 0 0 4.303-3.523c.428-.883.645-1.74.743-2.986.022-.271.03-4.6.03-8.924 0-4.323-.01-8.644-.03-8.916-.1-1.265-.317-2.116-.759-3.016a6.247 6.247 0 0 0-1.349-1.848C28.583 1.212 27.308.606 25.788.387c-.736-.107-.883-.138-4.65-.145h-5.13Z'/%3E%3Cpath fill='url(%23b)' d='M16.008.242C9.428.242 7.504.25 7.13.28c-1.35.112-2.19.325-3.106.78a6.292 6.292 0 0 0-1.81 1.326C1.213 3.424.606 4.702.387 6.22.28 6.957.25 7.107.244 10.87c-.003 1.255 0 2.906 0 5.121 0 6.575.007 8.497.038 8.87.11 1.315.316 2.141.752 3.046a6.64 6.64 0 0 0 4.303 3.515c.65.167 1.367.26 2.288.303.39.017 4.369.029 8.35.029 3.98 0 7.96-.005 8.341-.024 1.067-.05 1.686-.134 2.371-.31a6.599 6.599 0 0 0 4.303-3.523c.428-.883.645-1.74.743-2.986.022-.271.03-4.6.03-8.924 0-4.323-.01-8.644-.03-8.916-.1-1.265-.317-2.116-.759-3.016a6.247 6.247 0 0 0-1.349-1.848C28.583 1.212 27.308.606 25.788.387c-.736-.107-.883-.138-4.65-.145h-5.13Z'/%3E%3Cpath fill='%23fff' d='M16.001 4.364c-3.16 0-3.557.013-4.798.07-1.239.057-2.084.253-2.824.54a5.698 5.698 0 0 0-2.062 1.342 5.712 5.712 0 0 0-1.343 2.061c-.288.74-.485 1.586-.54 2.825-.056 1.24-.07 1.638-.07 4.798s.014 3.556.07 4.797c.057 1.239.253 2.084.54 2.824a5.702 5.702 0 0 0 1.343 2.061 5.697 5.697 0 0 0 2.06 1.344c.74.287 1.586.483 2.825.54 1.241.057 1.637.07 4.797.07 3.161 0 3.556-.013 4.798-.07 1.238-.057 2.085-.253 2.825-.54a5.693 5.693 0 0 0 2.06-1.344 5.712 5.712 0 0 0 1.343-2.06c.286-.74.483-1.587.54-2.825.057-1.241.071-1.637.071-4.797 0-3.16-.014-3.557-.07-4.798-.058-1.239-.255-2.084-.54-2.824a5.71 5.71 0 0 0-1.344-2.062 5.688 5.688 0 0 0-2.06-1.341c-.742-.288-1.588-.484-2.827-.541-1.241-.057-1.637-.07-4.798-.07h.004ZM14.957 6.46h1.044c3.107 0 3.475.01 4.702.067 1.135.051 1.75.241 2.16.4.544.211.93.463 1.338.87.407.408.66.796.87 1.339.16.41.35 1.025.401 2.16.056 1.226.068 1.595.068 4.7 0 3.106-.012 3.474-.068 4.701-.052 1.134-.241 1.75-.4 2.16-.211.543-.464.93-.871 1.337-.407.407-.794.66-1.338.87-.41.16-1.025.35-2.16.401-1.227.056-1.595.068-4.702.068s-3.475-.012-4.702-.068c-1.135-.052-1.75-.242-2.16-.401a3.604 3.604 0 0 1-1.339-.87 3.606 3.606 0 0 1-.87-1.338c-.16-.41-.35-1.026-.402-2.16-.055-1.227-.066-1.595-.066-4.703 0-3.107.01-3.473.066-4.7.052-1.135.242-1.75.401-2.16.211-.544.464-.932.871-1.339.407-.407.795-.66 1.338-.87.41-.16 1.026-.35 2.16-.402 1.074-.048 1.49-.063 3.66-.065v.003Zm7.255 1.932a1.396 1.396 0 1 0 0 2.793 1.396 1.396 0 0 0 0-2.794Zm-6.211 1.631a5.976 5.976 0 1 0 0 11.952 5.976 5.976 0 0 0 0-11.952Zm0 2.097a3.879 3.879 0 1 1 0 7.758 3.879 3.879 0 0 1 0-7.758Z'/%3E%3Cdefs%3E%3CradialGradient id='a' cx='0' cy='0' r='1' gradientTransform='matrix(0 -31.2312 29.0554 0 8.615 34.182)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FD5'/%3E%3Cstop offset='.1' stop-color='%23FD5'/%3E%3Cstop offset='.5' stop-color='%23FF543E'/%3E%3Cstop offset='1' stop-color='%23C837AB'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='0' cy='0' r='1' gradientTransform='rotate(78.678 -4.051 -1.817) scale(13.9606 57.5608)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%233771C8'/%3E%3Cstop offset='.128' stop-color='%233771C8'/%3E%3Cstop offset='1' stop-color='%2360F' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"],
    ['X', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M25.2 2h4.91L19.39 14.25 32 30.92h-9.87L14.4 20.81 5.55 30.92H.63L12.1 17.81 0 2h10.13l6.99 9.24L25.2 2Zm-1.72 25.99h2.72L8.65 4.78H5.73l17.75 23.21Z'/%3E%3C/svg%3E"],
    ['Reddit', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cg clip-path='url(%23a)'%3E%3Cpath fill='%23FF4500' d='M16 0C7.2 0 0 7.2 0 16c0 4.48 1.76 8.48 4.64 11.36l-2.72 2.72c-.64.64-.16 1.92.8 1.92H16c8.8 0 16-7.2 16-16S24.8 0 16 0Z'/%3E%3Cpath fill='url(%23b)' d='M6.88 19.2a3.68 3.68 0 1 0 0-7.36 3.68 3.68 0 0 0 0 7.36Z'/%3E%3Cpath fill='url(%23c)' d='M25.12 19.2a3.68 3.68 0 1 0 0-7.36 3.68 3.68 0 0 0 0 7.36Z'/%3E%3Cpath fill='url(%23d)' d='M16 26.72c5.92 0 10.72-3.582 10.72-8s-4.8-8-10.72-8c-5.92 0-10.72 3.582-10.72 8s4.8 8 10.72 8Z'/%3E%3Cpath fill='%23842123' d='M12.8 17.92c0 1.28-.96 1.92-2.08 1.92s-1.92-.64-1.76-2.08c.16-1.44.96-2.24 2.08-2.24s1.92.96 1.76 2.4ZM22.88 17.76c0 1.28-.8 2.08-1.76 2.08s-1.92-.64-1.92-1.92c0-1.28.8-2.4 1.76-2.4s1.92.8 1.92 2.24Z'/%3E%3Cpath fill='url(%23e)' d='M12.8 18.08c0 1.28-.96 1.76-1.92 1.76s-1.76-.64-1.6-1.92c0-1.28.96-2.08 1.92-2.08s1.76.96 1.6 2.24Z'/%3E%3Cpath fill='url(%23f)' d='M20.8 15.68c.96 0 1.76.8 1.92 2.08.16 1.28-.64 1.92-1.6 1.92-.96 0-1.76-.48-1.92-1.76-.16-1.12.64-2.24 1.6-2.24Z'/%3E%3Cpath fill='%23BBCFDA' d='M16 20.64c-1.28 0-2.56 0-3.84.16-.16 0-.32.16-.32.48.64 1.6 2.24 2.56 4 2.56 1.76 0 3.36-1.12 4-2.56 0-.16 0-.32-.32-.48-.96-.16-2.24-.16-3.52-.16Z'/%3E%3Cpath fill='%23fff' d='M16 20.96c-1.28 0-2.56 0-3.68.16-.16 0-.32.16-.32.48.64 1.6 2.24 2.72 4 2.72 1.76 0 3.36-1.12 4-2.72 0-.16 0-.32-.32-.48-1.12-.16-2.4-.16-3.68-.16Z'/%3E%3Cpath fill='url(%23g)' d='M16 20.8c-1.28 0-2.56 0-3.68.16-.16 0-.32.16-.32.48.64 1.6 2.24 2.56 4 2.56 1.76 0 3.36-1.12 4-2.56 0-.16 0-.32-.32-.48-1.12-.16-2.4-.16-3.68-.16Z'/%3E%3Cpath fill='url(%23h)' d='M21.92 9.6a2.72 2.72 0 1 0 0-5.44 2.72 2.72 0 0 0 0 5.44Z'/%3E%3Cpath fill='url(%23i)' d='M16 11.04c-.32 0-.64-.16-.64-.32 0-2.4 1.92-4.32 4.32-4.32.32 0 .64.32.64.64s-.32.64-.64.64a3.21 3.21 0 0 0-3.2 3.2s-.16.16-.48.16Z'/%3E%3Cpath fill='%23FF6101' d='M12.16 18.56c0 .48-.48.64-1.12.64-.64 0-1.12-.16-1.12-.64s.48-.96 1.12-.96c.64.16 1.12.48 1.12.96ZM22.24 18.56c0 .48-.48.64-1.12.64-.64 0-1.12-.16-1.12-.64s.48-.96 1.12-.96c.48.16 1.12.48 1.12.96Z'/%3E%3Cpath fill='%23FFC49C' d='M11.84 17.28a.48.48 0 1 0 0-.96.48.48 0 0 0 0 .96ZM21.6 17.28a.48.48 0 1 0 0-.96.48.48 0 0 0 0 .96Z'/%3E%3C/g%3E%3Cdefs%3E%3CradialGradient id='b' cx='0' cy='0' r='1' gradientTransform='matrix(7.48766 0 0 6.53179 7.142 13.445)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FEFFFF'/%3E%3Cstop offset='.4' stop-color='%23FEFFFF'/%3E%3Cstop offset='.51' stop-color='%23F9FCFC'/%3E%3Cstop offset='.62' stop-color='%23EDF3F5'/%3E%3Cstop offset='.7' stop-color='%23DEE9EC'/%3E%3Cstop offset='.72' stop-color='%23D8E4E8'/%3E%3Cstop offset='.76' stop-color='%23CCD8DF'/%3E%3Cstop offset='.8' stop-color='%23C8D5DD'/%3E%3Cstop offset='.83' stop-color='%23CCD6DE'/%3E%3Cstop offset='.85' stop-color='%23D8DBE2'/%3E%3Cstop offset='.88' stop-color='%23EDE3E9'/%3E%3Cstop offset='.9' stop-color='%23FFEBEF'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='0' cy='0' r='1' gradientTransform='matrix(-7.48766 0 0 -6.53179 28.126 13.445)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FEFFFF'/%3E%3Cstop offset='.4' stop-color='%23FEFFFF'/%3E%3Cstop offset='.51' stop-color='%23F9FCFC'/%3E%3Cstop offset='.62' stop-color='%23EDF3F5'/%3E%3Cstop offset='.7' stop-color='%23DEE9EC'/%3E%3Cstop offset='.72' stop-color='%23D8E4E8'/%3E%3Cstop offset='.76' stop-color='%23CCD8DF'/%3E%3Cstop offset='.8' stop-color='%23C8D5DD'/%3E%3Cstop offset='.83' stop-color='%23CCD6DE'/%3E%3Cstop offset='.85' stop-color='%23D8DBE2'/%3E%3Cstop offset='.88' stop-color='%23EDE3E9'/%3E%3Cstop offset='.9' stop-color='%23FFEBEF'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='0' cy='0' r='1' gradientTransform='matrix(22.5859 0 0 15.8582 16.293 12.397)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FEFFFF'/%3E%3Cstop offset='.4' stop-color='%23FEFFFF'/%3E%3Cstop offset='.51' stop-color='%23F9FCFC'/%3E%3Cstop offset='.62' stop-color='%23EDF3F5'/%3E%3Cstop offset='.7' stop-color='%23DEE9EC'/%3E%3Cstop offset='.72' stop-color='%23D8E4E8'/%3E%3Cstop offset='.76' stop-color='%23CCD8DF'/%3E%3Cstop offset='.8' stop-color='%23C8D5DD'/%3E%3Cstop offset='.83' stop-color='%23CCD6DE'/%3E%3Cstop offset='.85' stop-color='%23D8DBE2'/%3E%3Cstop offset='.88' stop-color='%23EDE3E9'/%3E%3Cstop offset='.9' stop-color='%23FFEBEF'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='0' cy='0' r='1' gradientTransform='matrix(1.88707 0 0 2.77038 11.274 18.871)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23F60'/%3E%3Cstop offset='.5' stop-color='%23FF4500'/%3E%3Cstop offset='.7' stop-color='%23FC4301'/%3E%3Cstop offset='.82' stop-color='%23F43F07'/%3E%3Cstop offset='.92' stop-color='%23E53812'/%3E%3Cstop offset='1' stop-color='%23D4301F'/%3E%3C/radialGradient%3E%3CradialGradient id='f' cx='0' cy='0' r='1' gradientTransform='matrix(-1.88707 0 0 -2.77038 21.095 18.872)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23F60'/%3E%3Cstop offset='.5' stop-color='%23FF4500'/%3E%3Cstop offset='.7' stop-color='%23FC4301'/%3E%3Cstop offset='.82' stop-color='%23F43F07'/%3E%3Cstop offset='.92' stop-color='%23E53812'/%3E%3Cstop offset='1' stop-color='%23D4301F'/%3E%3C/radialGradient%3E%3CradialGradient id='g' cx='0' cy='0' r='1' gradientTransform='matrix(6.654 0 0 4.38881 16.046 24.363)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23172E35'/%3E%3Cstop offset='.29' stop-color='%230E1C21'/%3E%3Cstop offset='.73' stop-color='%23030708'/%3E%3Cstop offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='h' cx='0' cy='0' r='1' gradientTransform='translate(21.914 4.263) scale(5.84093)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FEFFFF'/%3E%3Cstop offset='.4' stop-color='%23FEFFFF'/%3E%3Cstop offset='.51' stop-color='%23F9FCFC'/%3E%3Cstop offset='.62' stop-color='%23EDF3F5'/%3E%3Cstop offset='.7' stop-color='%23DEE9EC'/%3E%3Cstop offset='.72' stop-color='%23D8E4E8'/%3E%3Cstop offset='.76' stop-color='%23CCD8DF'/%3E%3Cstop offset='.8' stop-color='%23C8D5DD'/%3E%3Cstop offset='.83' stop-color='%23CCD6DE'/%3E%3Cstop offset='.85' stop-color='%23D8DBE2'/%3E%3Cstop offset='.88' stop-color='%23EDE3E9'/%3E%3Cstop offset='.9' stop-color='%23FFEBEF'/%3E%3C/radialGradient%3E%3CradialGradient id='i' cx='0' cy='0' r='1' gradientTransform='translate(19.48 10.63) scale(4.78753)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.48' stop-color='%237A9299'/%3E%3Cstop offset='.67' stop-color='%23172E35'/%3E%3Cstop offset='.75'/%3E%3Cstop offset='.82' stop-color='%23172E35'/%3E%3C/radialGradient%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h32v32H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E"],
    ['Figma', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%230ACF83' d='M10.335 32a5.335 5.335 0 0 0 5.334-5.333v-5.334h-5.334a5.335 5.335 0 0 0-5.333 5.334A5.335 5.335 0 0 0 10.335 32Z'/%3E%3Cpath fill='%23A259FF' d='M5.002 16a5.335 5.335 0 0 1 5.333-5.333h5.334v10.666h-5.334A5.335 5.335 0 0 1 5.002 16Z'/%3E%3Cpath fill='%23F24E1E' d='M5.002 5.333A5.335 5.335 0 0 1 10.335 0h5.334v10.667h-5.334a5.335 5.335 0 0 1-5.333-5.334Z'/%3E%3Cpath fill='%23FF7262' d='M15.669 0h5.333a5.335 5.335 0 0 1 5.334 5.333 5.335 5.335 0 0 1-5.334 5.334H15.67V0Z'/%3E%3Cpath fill='%231ABCFE' d='M26.335 16a5.335 5.335 0 0 1-5.333 5.333A5.335 5.335 0 0 1 15.67 16a5.335 5.335 0 0 1 5.333-5.333A5.335 5.335 0 0 1 26.336 16Z'/%3E%3C/svg%3E"],
    ['Google Docs', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%234285F4' d='M18.9 0H6.6C5.4 0 4.4 1 4.4 2.2v27.6c0 1.2 1 2.2 2.2 2.2h18.8c1.2 0 2.2-1 2.2-2.2V8.7l-5.1-3.6L18.9 0Z'/%3E%3Cpath fill='url(%23a)' d='m19.5 8.1 8.1 8.1V8.7l-8.1-.6Z'/%3E%3Cpath fill='%23F1F1F1' d='M10.2 23.3h11.6v-1.5H10.2v1.5Zm0 2.9h8.7v-1.5h-8.7v1.5Zm0-10.2v1.5h11.6V16H10.2Zm0 4.4h11.6v-1.5H10.2v1.5Z'/%3E%3Cpath fill='%23A1C2FA' d='M18.938.045v6.5c0 1.2 1 2.2 2.2 2.2h6.5l-8.7-8.7Z'/%3E%3Cpath fill='%23fff' fill-opacity='.2' d='M6.6 0C5.4 0 4.4 1 4.4 2.2v.2c0-1.2 1-2.2 2.2-2.2h12.3V0H6.6Z'/%3E%3Cpath fill='%231A237E' fill-opacity='.2' d='M25.4 31.8H6.6c-1.2 0-2.2-1-2.2-2.2v.2c0 1.2 1 2.2 2.2 2.2h18.8c1.2 0 2.2-1 2.2-2.2v-.2c0 1.2-1 2.2-2.2 2.2Z'/%3E%3Cpath fill='%231A237E' fill-opacity='.1' d='M21.1 8.7c-1.2 0-2.2-1-2.2-2.2v.2c0 1.2 1 2.2 2.2 2.2h6.5v-.2h-6.5Z'/%3E%3Cpath fill='url(%23b)' d='M18.9 0H6.6C5.4 0 4.4 1 4.4 2.2v27.6c0 1.2 1 2.2 2.2 2.2h18.8c1.2 0 2.2-1 2.2-2.2V8.7L18.9 0Z'/%3E%3Cdefs%3E%3CradialGradient id='b' cx='0' cy='0' r='1' gradientTransform='translate(5.163 .868) scale(37.3108)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff' stop-opacity='.1'/%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='a' x1='23.548' x2='23.548' y1='8.783' y2='16.177' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%231A237E' stop-opacity='.2'/%3E%3Cstop offset='1' stop-color='%231A237E' stop-opacity='.02'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"],
    ['Google Maps', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%234285F4' d='M16.166 6.888a4.27 4.27 0 0 1 4.278 4.278c0 1.04-.387 2.006-1.015 2.755 0 0 4.571-3.421 6.647-7.903A11.134 11.134 0 0 0 19.55.532L15.5 3.5l-2.62 4.91c.797-.918 1.957-1.522 3.286-1.522Z'/%3E%3Cpath fill='%23FBBC04' d='M16.166 15.42a4.27 4.27 0 0 1-4.278-4.278c0-1.04.363-2.006.991-2.731L8.5 12l-2.388 4.46c1.16 2.561 3.093 4.64 5.075 7.226L16.5 19.5l2.929-5.603a4.243 4.243 0 0 1-3.263 1.523Z'/%3E%3Cpath fill='%2334A853' d='M19.284 26.393c3.722-5.825 8.048-8.46 8.048-15.227 0-1.86-.459-3.601-1.256-5.148L11.187 23.686a44.567 44.567 0 0 1 1.91 2.73C15.369 29.923 14.74 32 16.19 32s.822-2.103 3.094-5.607Z'/%3E%3Cpath fill='%23EA4335' d='M7.61 3.988A11.154 11.154 0 0 0 5 11.142c0 2.103.41 3.795 1.112 5.317l6.767-8.048L11 5.5 7.61 3.988Z'/%3E%3Cpath fill='%231A73E8' d='M19.55.532A11.3 11.3 0 0 0 16.142 0C12.734 0 9.665 1.547 7.61 3.988l5.27 4.423L19.55.53Z'/%3E%3C/svg%3E"],
    ['Calendly', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23006BFF' d='M21.462 20.75c-1.013.902-2.279 2.024-4.573 2.024h-1.371c-1.66 0-3.17-.605-4.251-1.702C10.21 20 9.63 18.533 9.63 16.942v-1.883c0-1.592.58-3.06 1.637-4.131 1.08-1.097 2.59-1.701 4.25-1.701h1.372c2.297 0 3.56 1.121 4.573 2.023 1.052.93 1.96 1.742 4.38 1.742.369 0 .737-.03 1.102-.089l-.009-.021a8.328 8.328 0 0 0-.509-1.049l-1.617-2.81a8.322 8.322 0 0 0-3.042-3.05 8.292 8.292 0 0 0-4.155-1.116h-3.236a8.292 8.292 0 0 0-4.154 1.116 8.321 8.321 0 0 0-3.042 3.05l-1.618 2.81a8.353 8.353 0 0 0 0 8.334l1.618 2.81a8.321 8.321 0 0 0 3.042 3.05 8.291 8.291 0 0 0 4.154 1.116h3.236a8.292 8.292 0 0 0 4.155-1.117 8.322 8.322 0 0 0 3.042-3.05l1.617-2.805c.194-.337.364-.687.51-1.048l.008-.02a6.841 6.841 0 0 0-1.102-.094c-2.42 0-3.328.808-4.38 1.742'/%3E%3Cpath fill='%23006BFF' d='M16.89 10.933h-1.373c-2.526 0-4.186 1.81-4.186 4.126v1.882c0 2.317 1.66 4.126 4.187 4.126h1.371c3.682 0 3.393-3.764 8.953-3.764.526 0 1.052.048 1.57.145a8.346 8.346 0 0 0 0-2.896 8.554 8.554 0 0 1-1.57.145c-5.562 0-5.271-3.764-8.953-3.764Z'/%3E%3Cpath fill='%23006BFF' d='M30.606 18.823a7.74 7.74 0 0 0-3.193-1.376v.028a8.354 8.354 0 0 1-.464 1.622 6.069 6.069 0 0 1 2.64 1.09c0 .008-.005.017-.007.025a14.27 14.27 0 0 1-6.031 7.877 14.202 14.202 0 0 1-18.36-2.779A14.298 14.298 0 0 1 1.745 16c0-3.417 1.222-6.72 3.444-9.31a14.202 14.202 0 0 1 18.36-2.778 14.27 14.27 0 0 1 6.032 7.876c0 .008.004.018.007.025a6.056 6.056 0 0 1-2.64 1.09c.209.524.364 1.068.464 1.623v.026a7.738 7.738 0 0 0 3.193-1.375c.91-.676.734-1.44.596-1.891a15.994 15.994 0 0 0-6.757-8.833A15.918 15.918 0 0 0 13.578.18a15.943 15.943 0 0 0-9.716 5.384A16.027 16.027 0 0 0 0 16c0 3.83 1.37 7.534 3.862 10.437a15.943 15.943 0 0 0 9.716 5.384c3.777.571 7.633-.236 10.867-2.274a15.994 15.994 0 0 0 6.757-8.833c.138-.452.314-1.215-.596-1.89Z'/%3E%3Cpath fill='%230AE8F0' d='M26.944 12.902c-.365.061-.733.092-1.102.093-2.42 0-3.328-.807-4.38-1.742-1.013-.901-2.276-2.023-4.573-2.023h-1.371c-1.662 0-3.17.605-4.251 1.702-1.056 1.072-1.637 2.538-1.637 4.13v1.883c0 1.592.58 3.059 1.637 4.13 1.08 1.098 2.59 1.702 4.25 1.702h1.372c2.297 0 3.56-1.121 4.574-2.023 1.05-.93 1.958-1.742 4.378-1.742.37 0 .738.03 1.103.088.209-.523.364-1.067.463-1.622v-.027a8.553 8.553 0 0 0-1.57-.145c-5.562 0-5.27 3.766-8.952 3.766h-1.372c-2.527 0-4.187-1.81-4.187-4.127v-1.886c0-2.316 1.66-4.126 4.187-4.126h1.372c3.681 0 3.392 3.763 8.952 3.763.527.001 1.052-.047 1.57-.144v-.026c-.1-.555-.255-1.1-.463-1.624Z'/%3E%3Cpath fill='%230AE8F0' d='M26.944 12.902c-.365.061-.733.092-1.102.093-2.42 0-3.328-.807-4.38-1.742-1.013-.901-2.276-2.023-4.573-2.023h-1.371c-1.662 0-3.17.605-4.251 1.702-1.056 1.072-1.637 2.538-1.637 4.13v1.883c0 1.592.58 3.059 1.637 4.13 1.08 1.098 2.59 1.702 4.25 1.702h1.372c2.297 0 3.56-1.121 4.574-2.023 1.05-.93 1.958-1.742 4.378-1.742.37 0 .738.03 1.103.088.209-.523.364-1.067.463-1.622v-.027a8.553 8.553 0 0 0-1.57-.145c-5.562 0-5.27 3.766-8.952 3.766h-1.372c-2.527 0-4.187-1.81-4.187-4.127v-1.886c0-2.316 1.66-4.126 4.187-4.126h1.372c3.681 0 3.392 3.763 8.952 3.763.527.001 1.052-.047 1.57-.144v-.026c-.1-.555-.255-1.1-.463-1.624Z'/%3E%3C/svg%3E"],
    ['Loom', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23625DF5' d='M32 14.325h-9.748l8.442-4.874-1.674-2.902-8.443 4.875 4.873-8.443-2.9-1.674-4.875 8.44V0h-3.35v9.748L9.45 1.307 6.549 2.98l4.873 8.44-8.44-4.872-1.676 2.902 8.442 4.874H0v3.35h9.747l-8.44 4.875 1.673 2.902 8.443-4.875L6.55 29.02l2.9 1.674 4.876-8.441V32h3.35v-9.956l4.964 8.597 2.72-1.57-4.965-8.6 8.623 4.98 1.676-2.902-8.441-4.874h9.747l.001-3.35Zm-16 6.23a4.554 4.554 0 0 1-3.221-7.777 4.552 4.552 0 0 1 7.775 3.22A4.557 4.557 0 0 1 16 20.555Z'/%3E%3C/svg%3E"],
    ['Miro', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23FD3' d='M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8Z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M21.274 6.1H18.37l2.421 4.253L15.465 6.1H12.56l2.663 5.199L9.655 6.1H6.75l2.905 6.617L6.75 25.95h2.905l5.568-14.178L12.56 25.95h2.905l5.325-15.123-2.42 15.123h2.904L26.6 9.408 21.274 6.1Z' clip-rule='evenodd'/%3E%3C/svg%3E"],
    ['Airtable', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23FCB400' d='M14.29 3.338 2.358 8.275c-.664.274-.657 1.217.01 1.481l11.981 4.751a4.445 4.445 0 0 0 3.277 0l11.98-4.75a.8.8 0 0 0 .012-1.482l-11.93-4.937a4.446 4.446 0 0 0-3.4 0'/%3E%3Cpath fill='%2318BFFF' d='M17.052 17.101V28.97a.8.8 0 0 0 1.094.743l13.35-5.182a.799.799 0 0 0 .504-.743V11.92a.8.8 0 0 0-1.094-.743l-13.35 5.181a.8.8 0 0 0-.504.743Z'/%3E%3Cpath fill='%23F82B60' d='m13.934 17.714-3.962 1.913-.402.194-8.363 4.007c-.53.256-1.207-.13-1.207-.72V11.97c0-.213.11-.396.256-.535a.909.909 0 0 1 .202-.152c.2-.12.485-.152.727-.056l12.683 5.025c.644.256.695 1.16.066 1.463Z'/%3E%3Cpath fill='%23000' fill-opacity='.25' d='m13.934 17.714-3.962 1.913-9.716-8.193c.06-.06.128-.11.202-.152.2-.12.485-.152.727-.056l12.683 5.025c.644.256.695 1.16.066 1.463Z'/%3E%3C/svg%3E"],
    ['GitHub Gist', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%2324292F' fill-rule='evenodd' d='M16.013 0C7.158 0 0 7.211 0 16.132 0 23.263 4.587 29.3 10.95 31.436c.795.16 1.086-.347 1.086-.774 0-.374-.026-1.656-.026-2.992-4.454.962-5.382-1.923-5.382-1.923-.716-1.87-1.777-2.35-1.777-2.35-1.458-.988.107-.988.107-.988 1.617.107 2.465 1.656 2.465 1.656 1.432 2.457 3.739 1.763 4.666 1.335.133-1.041.557-1.763 1.008-2.163-3.553-.374-7.29-1.763-7.29-7.96 0-1.762.635-3.205 1.643-4.326-.16-.4-.716-2.057.159-4.274 0 0 1.352-.427 4.4 1.656a15.395 15.395 0 0 1 4.004-.534 15.4 15.4 0 0 1 4.003.534c3.05-2.083 4.402-1.656 4.402-1.656.875 2.217.317 3.873.158 4.274 1.035 1.121 1.644 2.564 1.644 4.326 0 6.197-3.738 7.559-7.317 7.96.583.507 1.087 1.469 1.087 2.991 0 2.163-.026 3.9-.026 4.434 0 .427.291.935 1.087.774C27.413 29.3 32 23.264 32 16.133 32.026 7.212 24.842 0 16.013 0Z' clip-rule='evenodd'/%3E%3C/svg%3E"],
    ['Notion', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23fff' d='M2.925 1.38 20.632.074c2.175-.187 2.733-.061 4.101.933l5.652 3.982c.932.685 1.243.871 1.243 1.617v21.837c0 1.369-.497 2.178-2.237 2.302L8.829 31.989c-1.305.062-1.927-.125-2.61-.996l-4.163-5.412C1.309 24.584 1 23.839 1 22.967V3.557c0-1.12.497-2.053 1.925-2.176Z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M20.632.073 2.925 1.381C1.497 1.504 1 2.438 1 3.556v19.411c0 .872.31 1.617 1.056 2.614l4.162 5.412c.684.871 1.306 1.058 2.611.996l20.562-1.245c1.739-.124 2.237-.933 2.237-2.302V6.605c0-.707-.28-.911-1.102-1.514l-5.793-4.085c-1.367-.994-1.926-1.12-4.101-.933ZM9.294 6.248c-1.679.113-2.06.138-3.013-.637L3.857 3.683c-.247-.25-.123-.561.498-.623l17.021-1.244c1.43-.125 2.174.373 2.733.808l2.92 2.115c.124.064.434.436.061.436L9.512 6.233l-.218.015ZM7.337 28.256V9.718c0-.81.248-1.183.993-1.246L28.52 7.29c.684-.062.994.373.994 1.182v18.414c0 .81-.125 1.495-1.243 1.556l-19.32 1.12c-1.118.062-1.614-.31-1.614-1.306Zm19.072-17.544c.123.56 0 1.12-.56 1.184l-.932.184v13.687c-.808.435-1.553.684-2.175.684-.994 0-1.242-.311-1.987-1.244l-6.09-9.58v9.269l1.927.436s0 1.12-1.554 1.12l-4.285.249c-.125-.25 0-.872.434-.995l1.12-.31V13.138l-1.554-.125c-.124-.56.186-1.369 1.056-1.432l4.598-.31 6.336 9.705v-8.585l-1.615-.186c-.125-.685.372-1.184.993-1.245l4.288-.25Z' clip-rule='evenodd'/%3E%3C/svg%3E"],
    ['Datawrapper', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M0 15.992v15.991h32l-.05-1.466-.05-1.449-14.492-.083-14.493-.083-.05-14.46L2.832 0H0v15.992Z'/%3E%3Cpath fill='%23000' d='M9.945 5.28c-.067.05-.117 4.365-.117 9.579v9.462h3.265c3.648 0 4.98-.2 6.63-1.033 1.982-1 3.665-3.298 4.098-5.614.283-1.516.216-4.964-.15-6.297-.8-3.098-3.032-5.247-6.13-5.946-.866-.2-2.066-.267-4.348-.267-1.732 0-3.198.05-3.248.117Zm7.58 2.999c1.848.716 2.814 2.199 3.164 4.848.15 1.215.15 1.915 0 3.148-.333 2.582-1.216 4.014-3.032 4.864-.8.367-1.132.433-2.665.433h-1.749l-.05-6.796-.033-6.78h1.832c1.316 0 2.032.083 2.532.283Z'/%3E%3C/svg%3E"],
    ['Flourish', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23C12226' d='M8.68 18.973c-.945.1-1.89.201-2.836.304l-4.795.524c-.191.021-.384.04-.574.067-.164.024-.244-.025-.268-.201a10.931 10.931 0 0 0-.194-1.07c-.048-.193.043-.232.185-.274.879-.26 1.757-.522 2.634-.786 1.657-.497 3.314-.996 4.971-1.496.053-.017.103-.044.205-.09-.431-.13-.815-.248-1.199-.363-2.167-.649-4.334-1.295-6.5-1.944-.326-.098-.328-.103-.27-.438.056-.323.126-.644.178-.968.023-.144.082-.179.225-.162 1.642.184 3.286.362 4.93.54 1.113.122 2.228.242 3.43.372l-.753-.61c-1.881-1.527-3.762-3.055-5.642-4.584-.302-.246-.297-.25-.076-.582.126-.189.248-.379.373-.567.192-.29.194-.292.492-.13 1.024.557 2.046 1.115 3.07 1.674L10.14 10.3c.057.031.118.055.234.109-.068-.147-.108-.245-.158-.339L6.547 3.22c-.182-.34-.224-.29.123-.516.247-.16.497-.316.737-.485.138-.098.213-.084.325.056 1.188 1.486 2.386 2.964 3.582 4.443l1.609 1.99c-.075-.742-.138-1.404-.207-2.065l-.511-4.865c-.043-.405-.087-.81-.127-1.216-.032-.317-.03-.32.295-.383.289-.057.58-.099.867-.163.212-.047.32.001.385.229.43 1.501.873 2.997 1.313 4.496.321 1.095.645 2.19.988 3.351.051-.112.082-.163.099-.218l2.29-7.427c.02-.064.053-.127.061-.193.03-.243.165-.285.381-.234.31.071.62.134.933.181.165.025.196.097.18.25-.122 1.103-.236 2.207-.352 3.31l-.51 4.9c.098-.096.16-.145.21-.206 1.648-2.016 3.295-4.034 4.942-6.052.243-.298.242-.3.548-.09.205.14.4.301.616.422.212.117.202.227.096.425-1.028 1.926-2.047 3.857-3.067 5.787-.247.468-.491.936-.703 1.445.274-.147.55-.293.823-.442 2.105-1.15 4.211-2.296 6.312-3.454.196-.109.305-.12.426.092.15.265.33.515.506.764.102.145.101.236-.051.357-.692.55-1.372 1.113-2.056 1.673l-4.207 3.439c-.043.034-.08.075-.177.164.746-.08 1.421-.15 2.097-.223l4.694-.512c.496-.054.994-.088 1.486-.164.223-.035.272.035.297.232.04.314.1.627.175.935.052.219.002.318-.228.384-1.208.344-2.409.705-3.613 1.061l-3.904 1.151c-.097.029-.193.061-.345.11.169.061.288.111.41.148 2.46.731 4.922 1.46 7.382 2.193.376.112.355.038.28.45-.054.29-.127.578-.152.87-.021.234-.125.273-.329.249-.9-.107-1.8-.205-2.7-.304l-5.2-.569c-.084-.008-.17-.001-.323-.001.392.326.734.615 1.08.899l5.265 4.295c.25.204.249.206.072.475-.162.245-.336.484-.484.738-.098.168-.188.166-.345.078-.83-.463-1.666-.915-2.5-1.37l-4.469-2.441c-.067-.037-.139-.067-.285-.137.183.352.33.637.479.919 1.116 2.111 2.227 4.224 3.355 6.328.123.23.083.33-.116.45-.232.141-.456.298-.67.466-.174.137-.277.097-.408-.067-.797-.987-1.602-1.967-2.406-2.949l-2.67-3.26c-.026-.032-.056-.061-.14-.15.058.583.107 1.093.16 1.603.172 1.655.347 3.312.52 4.967.056.53.1 1.06.171 1.587.03.212-.015.31-.236.34-.28.036-.557.097-.835.148-.32.059-.323.06-.416-.238-.376-1.21-.752-2.42-1.125-3.63l-1.207-3.923a.443.443 0 0 0-.128-.216c-.144.48-.29.959-.432 1.44-.616 2.094-1.23 4.19-1.845 6.284-.068.23-.216.324-.445.283-.301-.053-.6-.113-.903-.154-.186-.025-.243-.107-.222-.292.086-.754.16-1.509.239-2.264l.442-4.258.176-1.697c-.445.541-.841 1.015-1.228 1.495a1220.986 1220.986 0 0 0-3.914 4.874c-.142.179-.248.216-.436.07-.215-.165-.457-.293-.68-.448-.324-.224-.319-.13-.132-.487.394-.752.8-1.497 1.2-2.246l2.5-4.668c.041-.077.078-.156.145-.294-.14.064-.229.1-.312.144l-6.825 3.719c-.07.038-.137.094-.21.104-.068.01-.176-.008-.21-.055-.204-.285-.384-.586-.59-.87-.104-.144-.085-.226.049-.332.4-.314.79-.642 1.187-.962 1.714-1.392 3.429-2.782 5.145-4.17.034-.029.083-.039.125-.057l-.058-.091v-.003Z'/%3E%3C/svg%3E"],
    ['Apple Music', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='url(%23a)' fill-rule='evenodd' d='M32 10.01c0-.382 0-.765-.002-1.147a43.765 43.765 0 0 0-.014-.965c-.019-.702-.06-1.408-.185-2.102a7.098 7.098 0 0 0-.659-1.999A6.718 6.718 0 0 0 28.202.86 7.117 7.117 0 0 0 26.204.2c-.693-.124-1.4-.165-2.102-.184a43.694 43.694 0 0 0-.965-.014C22.755 0 22.372 0 21.99 0H10.01c-.382 0-.765 0-1.147.002-.322.002-.643.005-.965.014-.702.02-1.41.06-2.102.186A7.08 7.08 0 0 0 3.798.86 6.723 6.723 0 0 0 .86 3.798a7.1 7.1 0 0 0-.66 2c-.124.693-.165 1.4-.184 2.1-.009.322-.012.644-.014.966C0 9.245 0 9.628 0 10.01v11.98c0 .382 0 .764.002 1.146.002.322.005.644.014.965.019.702.06 1.408.185 2.102a7.1 7.1 0 0 0 .659 1.999 6.72 6.72 0 0 0 2.938 2.938c.64.325 1.294.531 1.998.658.693.125 1.4.166 2.102.185.322.009.643.013.965.014.382.003.765.002 1.147.002h11.98c.382 0 .764 0 1.146-.002.322-.001.644-.005.965-.014.702-.019 1.41-.06 2.103-.185a7.08 7.08 0 0 0 1.997-.658 6.724 6.724 0 0 0 2.939-2.938 7.1 7.1 0 0 0 .658-2c.125-.693.166-1.4.185-2.1.009-.322.013-.644.014-.966.003-.382.002-.764.002-1.147V10.01H32Z' clip-rule='evenodd'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M22.622 4.889c-.077.007-.764.129-.847.146l-9.511 1.919h-.004c-.248.053-.442.141-.592.267-.182.152-.282.367-.32.618a2.165 2.165 0 0 0-.022.322v11.904c0 .278-.022.548-.21.779-.189.23-.422.3-.695.354l-.621.126c-.786.158-1.297.265-1.76.445-.443.171-.774.39-1.038.667a2.506 2.506 0 0 0-.663 1.99 2.49 2.49 0 0 0 .789 1.584c.31.284.698.5 1.155.592.473.095.978.062 1.716-.087.393-.08.761-.203 1.111-.41.347-.205.644-.477.876-.81.233-.333.383-.704.466-1.098.085-.406.105-.773.105-1.178V12.694c0-.553.157-.698.603-.807 0 0 7.906-1.595 8.275-1.667.514-.098.757.048.757.588v7.048c0 .28-.003.562-.193.793-.188.23-.421.3-.694.355l-.621.125c-.786.158-1.297.266-1.76.445-.443.172-.775.39-1.039.668a2.521 2.521 0 0 0-.681 1.99c.062.594.348 1.163.808 1.583.31.285.697.494 1.154.587.474.095.979.061 1.717-.087a3.48 3.48 0 0 0 1.11-.405 2.79 2.79 0 0 0 .876-.81c.233-.333.383-.704.466-1.097.085-.407.089-.774.089-1.179V5.73c.002-.548-.287-.886-.802-.841Z' clip-rule='evenodd'/%3E%3Cdefs%3E%3ClinearGradient id='a' x1='16' x2='16' y1='31.876' y2='.69' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FA233B'/%3E%3Cstop offset='1' stop-color='%23FB5C74'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"],
    ['Twitch', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cpath d='m38.29 28.86-4 4H28l-3.43 3.43v-3.43h-5.14V16.29h18.86zM17.14 14 16 18.57v20.57h5.14V42H24l2.86-2.86h4.57L40.57 30V14z' fill='%236441a5' fill-rule='evenodd'/%3E%3Cpath d='M25.72 27.71H28v-6.85h-2.28zm6.28 0h2.29v-6.85H32z' fill='%236441a5' fill-rule='evenodd'/%3E%3C/svg%3E"],
    ['Canva', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%237D2AE7' d='M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z'/%3E%3Cpath fill='url(%23a)' d='M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z'/%3E%3Cpath fill='url(%23b)' d='M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z'/%3E%3Cpath fill='url(%23c)' d='M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z'/%3E%3Cpath fill='url(%23d)' d='M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z'/%3E%3Cpath fill='%23fff' d='M22.908 19.282c-.132 0-.249.112-.37.355-1.365 2.77-3.724 4.729-6.453 4.729-3.156 0-5.11-2.85-5.11-6.785 0-6.667 3.714-10.521 6.977-10.521 1.524 0 2.455.958 2.455 2.482 0 1.81-1.028 2.768-1.028 3.406 0 .287.179.46.532.46 1.42 0 3.086-1.631 3.086-3.936 0-2.234-1.945-3.876-5.207-3.876-5.392 0-10.184 4.998-10.184 11.915 0 5.354 3.057 8.892 7.774 8.892 5.007 0 7.902-4.982 7.902-6.599 0-.358-.183-.522-.374-.522Z'/%3E%3Cdefs%3E%3CradialGradient id='a' cx='0' cy='0' r='1' gradientTransform='rotate(-49.416 33.911 7.464) scale(24.7493)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%236420FF'/%3E%3Cstop offset='1' stop-color='%236420FF' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='0' cy='0' r='1' gradientTransform='rotate(54.703 .72 10.007) scale(27.9094)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2300C4CC'/%3E%3Cstop offset='1' stop-color='%2300C4CC' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='0' cy='0' r='1' gradientTransform='rotate(-45.195 37.162 6.756) scale(24.4497 11.2447)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%236420FF'/%3E%3Cstop offset='1' stop-color='%236420FF' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='0' cy='0' r='1' gradientTransform='rotate(66.52 3.256 12.132) scale(25.1934 42.2046)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2300C4CC' stop-opacity='.726'/%3E%3Cstop offset='0' stop-color='%2300C4CC'/%3E%3Cstop offset='1' stop-color='%2300C4CC' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"],
    ['Google Drive', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%230066DA' d='m2.42 26.504 1.41 2.438c.294.513.715.916 1.21 1.21l4.46-3.648.58-5.077L5 20l-5 1.427c0 .568.147 1.137.44 1.65l1.98 3.427Z'/%3E%3Cpath fill='%23EA4335' d='M26.96 30.151a3.327 3.327 0 0 0 1.21-1.21l.586-1.007 2.804-4.857a3.32 3.32 0 0 0 .44-1.65L27 20l-5.08 1.427L23.5 26.5l3.46 3.651Z'/%3E%3Cpath fill='%2300832D' d='M16 11.164 20 7.5l1.04-5.06A3.222 3.222 0 0 0 19.39 2h-6.78c-.587 0-1.155.165-1.65.44L12.5 7.5l3.5 3.664Z'/%3E%3Cpath fill='%2300AC47' d='M16 11.164 10.96 2.44a3.328 3.328 0 0 0-1.21 1.21L.44 19.777a3.32 3.32 0 0 0-.44 1.65h10.08L16 11.163Z'/%3E%3Cpath fill='%232684FC' d='M21.92 21.427H10.08l-5.04 8.724c.495.293 1.063.44 1.65.44h18.62c.587 0 1.155-.165 1.65-.44l-5.04-8.724Z'/%3E%3Cpath fill='%23FFBA00' d='M26.905 11.714 22.25 3.649a3.328 3.328 0 0 0-1.21-1.21L16 11.165l5.92 10.263h10.062a3.32 3.32 0 0 0-.44-1.65l-4.637-8.063Z'/%3E%3C/svg%3E"],
    ['Mixcloud', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%235000FF' fill-rule='evenodd' d='M27.02 29.36H32V2h-9.87l-5.49 26.09h-1.27L9.87 2H0v27.36h4.99V6.55l-.9-3.27h1.56l5.77 26.09h9.17l5.73-26.09h1.6l-.91 3.26v22.82h.01Z' clip-rule='evenodd'/%3E%3C/svg%3E"]
  ];
  const marquee = () => { const one = PROVIDERS.map(([p, src]) => `<span><img alt="" src="${src}">${p}</span>`).join(''); return h('div', { class: 'sx-marq', html: `<div><span><b>1,900 providers</b></span>${one}<span><b>1,900 providers</b></span>${one}</div>` }); };

  /* S03's stage on its own: the editor where the link becomes the embed, the response rail and the provider marquee.
     Mounted into slot; returns the stop function. */
  const richStage = slot => {
    const emb = h('div', { class: 'rm-slot' }), cap = h('div', { class: 'rm-cap' });
    const doc = h('div', { class: 'rm-doc' }, h('h3', null, 'Weekend in Kerala'), h('p', null, 'We took the night train down from Goa and woke up to rain on the backwaters. Here is the clip from the first morning:'), emb, cap, h('p', null, 'More from the houseboat, the spice market in Kochi and the long drive up to Munnar next week.'));
    const kv = h('dl', { class: 'sx-kv' }), code = h('div', { class: 'rm-code' });
    const rows = ['provider', 'type', 'height', 'refresh'];
    const set = (vals, n) => { kv.innerHTML = rows.map((k, i) => `<dt class="${i < n ? '' : 'off'}">${k}</dt><dd class="${i < n ? '' : 'off'}">${vals[i] || ''}</dd>`).join(''); };
    slot.appendChild(h('div', { class: 'sx-stage' }, h('div', { class: 'rm' }, win('Weekend in Kerala — Editor', doc, 'Draft'), win('Iframely response', h('div', { class: 'rm-rail' }, kv, code), '200 · 96 ms')), marquee()));
    let k = 0;
    return runner(slot, async (S, W) => {
      const e = EMB[k++ % EMB.length], w = emb.clientWidth || 600, H = e.px || Math.round(w * e.ratio);
      const vals = [e.site, e.type, e.res, 'evergreen · checked 2 h ago'];
      cap.style.opacity = 0; code.style.opacity = 0; set(vals, 0);
      emb.style.height = '24px'; emb.innerHTML = '<div class="rm-url"></div>';
      await S(400); await typeInto(emb.firstChild, 'https://' + e.url, S, 22); await W(450);
      set(vals, 2); emb.innerHTML = `<div class="rm-res">${e.res}</div>${e.inner}`; emb.style.height = H + 'px';
      await S(900); set(vals, 3);
      emb.querySelector('.rm-emb').classList.add('on'); emb.querySelector('.rm-res').style.opacity = 0;
      cap.innerHTML = `${fav(e.fav)}<b>${e.site}</b><span>· hosted by Iframely</span>`; cap.style.opacity = 1;
      code.innerHTML = `&lt;iframe src="//cdn.iframe.ly/${e.html}"&gt;`; code.style.opacity = 1;
      await S(500); set(vals, 4); await W(3000);
    });
  };
  DEMOS.register('sec-rich-large', {
    group: 'sec', title: 'Rich Media · large: a pasted link becomes the embed',
    blurb: 'New, after the open note on the /embeds hero ("a pasted link turning into a playing video, then a social post and a map"). A post in an editor: the link is pasted, the space is reserved at the right height (sized before load), then the hosted embed fades in. The rail shows the response. Four kinds in turn: video, audio, a post with a consent gate, a map. Providers drift below. Hover pauses.',
    mount(stage) {
      const slot = section(stage, { layout: 'large', prod: 'rich', title: 'Perfect embeds, every time', sub: 'Send us a URL, get the embed code back. Today and tomorrow. Videos play, posts appear and maps move, the way people expect from the apps they love, wherever your users write, post and chat.', btns: [['Get an API key'], ['Try a link', 'secondary']] });
      return richStage(slot);
    },
  });
  DEMOS.register('sec-rich-side', {
    group: 'sec', title: 'Rich Media · side: the P08 player window',
    blurb: 'The Rich Media window from P08 on its own, under the // hub: a hosted player cycling a video, a SoundCloud waveform and a map, with its iframe code. Home page Rich Media section copy.',
    mount(stage) { const slot = section(stage, { prod: 'rich', title: 'Rich media from 1,900 providers, kept up to date', sub: ['Send a URL, get a responsive embed: video, audio, social posts, maps, documents and more. Fast, secure and beautiful, on all your users’ devices.', 'When a new provider is added, you get it. When X, Meta or YouTube change their embed codes, we change ours.'], btns: [['More about Rich Media'], ['Supported media providers', 'secondary']] }); return DEMOS.prodKit(slot, { only: 0, bare: true }); },
  });

  /* ── Preview API ── */
  const LINKS = [
    { url: 'soundcloud.com/bonobo/kerala', who: 'Maya', say: 'this is the one for the intro', fav: 'soundcloud', site: 'SoundCloud', title: 'Kerala', desc: 'Bonobo · Migration · 2017. Stream on SoundCloud.', th: 'linear-gradient(135deg,#ffcf8a,#f2552c)', src: [['oEmbed', 'rich · audio'], ['Open Graph', 'title, image'], ['Twitter Cards', 'player'], ['JSON-LD', 'MusicRecording'], ['HTML', 'title']] },
    { url: 'github.com/itteco/iframely', who: 'Dev', say: 'the parser lives here', fav: 'github', site: 'GitHub', title: 'itteco/iframely', desc: 'oEmbed proxy: one endpoint for embeds and previews of any URL.', th: 'linear-gradient(135deg,#666666,#171717)', src: [['oEmbed', null], ['Open Graph', 'title, image'], ['Twitter Cards', 'summary'], ['JSON-LD', null], ['HTML', 'title, icon']] },
    { url: 'en.wikipedia.org/wiki/Kerala', who: 'Ana', say: 'background for the piece', fav: 'wikipedia', site: 'Wikipedia', title: 'Kerala', desc: 'A state on the Malabar Coast of India, formed in 1956 from Malayalam-speaking regions.', th: 'linear-gradient(135deg,#c6ecd8,#3c8d5a)', src: [['oEmbed', null], ['Open Graph', 'image'], ['Twitter Cards', null], ['JSON-LD', 'Article'], ['HTML', 'title, description']] },
  ];
  DEMOS.register('sec-preview-large', {
    group: 'sec', title: 'Preview API · large: one link, a chat and a doc',
    blurb: 'New, after the open note on the /preview-api hero ("a pasted link unfurling into a preview card in a chat thread and a doc"). The right panel checks what the page offers (oEmbed, Open Graph, Twitter Cards, JSON-LD, HTML) and every format feeds one result; then the same link unfurls as a compact card in the chat and a large card in the doc. Three links in turn. Hover pauses.',
    mount(stage) {
      const slot = section(stage, { layout: 'large', prod: 'preview', title: 'Every link, beautifully unfurled', sub: 'Iframely sees the web the same way X, Facebook and WordPress do. Send us a URL and get its title, images, author, rich media and a ready-made card back, for every link your users share in chats, docs and posts.', btns: [['Get an API key'], ['Check a URL', 'secondary']] });
      const neu = h('div', { class: 'pv-m pv-new' });
      const chat = h('div', { class: 'pv-chat' },
        h('div', { class: 'pv-m pv-old', html: '<div class="av" style="background:linear-gradient(135deg,#b8a3ff,#6a3bff)"></div><p><small>Jo</small>Draft for Thursday is in the doc. Links welcome.</p>' }),
        neu, h('div', { class: 'pv-comp' }, 'Message #design'));
      const url = h('div', { class: 'pv-url' }), card = h('div', { class: 'pv-card' });
      const doc = h('div', { class: 'pv-doc' }, h('h3', null, 'Thursday · draft'), h('p', null, 'Open on the coast, then the music. Sources so far:'), url, card);
      const rows = h('div'), out = h('div', { class: 'pv-out', html: '→ one result: <b>title, image, author, card</b>, the same shape for every URL.' });
      const src = h('div', { class: 'pv-src' }, h('h4', null, 'What the page offers'), rows, out);
      slot.appendChild(h('div', { class: 'sx-stage' }, h('div', { class: 'pv' }, win('# design', chat), win('Thursday · draft — Docs', doc), win('Iframely', src, '200 · 140 ms'))));
      let k = 0;
      return runner(slot, async (S, W) => {
        const L = LINKS[k++ % LINKS.length];
        neu.classList.remove('on'); card.classList.remove('on'); out.classList.remove('on'); card.innerHTML = ''; url.innerHTML = ''; url.style.display = '';
        rows.innerHTML = L.src.map(([n]) => `<div class="pv-row"><i></i>${n}<span></span></div>`).join('');
        await S(500);
        neu.innerHTML = `<div class="av" style="background:${L.th}"></div><div><p><small>${L.who}</small>${L.say} <a>${L.url}</a></p><div class="pv-unf"><div><div class="pv-s">${fav(L.fav)}${L.site}</div><div class="pv-t">${L.title}</div><div class="pv-d">${L.desc}</div></div><div class="th" style="background:${L.th}"></div></div></div>`;
        neu.classList.add('on'); await S(500);
        for (const [i, [, v]] of L.src.entries()) { const r = rows.children[i]; r.classList.add(v ? 'y' : 'n'); r.lastChild.textContent = v || 'none'; await S(240); }
        out.classList.add('on'); await S(300);
        neu.querySelector('.pv-unf').classList.add('on'); await S(500);
        await typeInto(url, 'https://' + L.url, S, 20); await S(300);
        url.innerHTML = ''; url.style.display = 'none'; /* the typed link becomes the card */
        card.innerHTML = `<div class="img" style="background:${L.th}"></div><div class="tx"><div class="pv-s">${fav(L.fav)}${L.site}</div><div class="pv-t">${L.title}</div><div class="pv-d">${L.desc}</div></div>`;
        card.classList.add('on'); await W(3400);
      });
    },
  });
  DEMOS.register('sec-preview-side', {
    group: 'sec', title: 'Preview API · side: the P08 chat window',
    blurb: 'The Preview API window from P08 on its own: a chat message whose link unfurls into a card, three samples in turn. Home page Preview API section copy.',
    mount(stage) { const slot = section(stage, { prod: 'preview', title: 'A preview for every link your users share', sub: ['Send any public URL, get the title, source, author, thumbnails and a ready summary card. Keep Rich Media on for players, or turn it off for metadata only.', 'The product behind link previews in Atlassian, Notion, GitBook and thousands of other apps.'], btns: [['More about the Preview API'], ['Check a URL', 'secondary']] }); return DEMOS.prodKit(slot, { only: 1, bare: true }); },
  });

  /* ── Data API: command left, the access object right ── */
  const REQ = [
    { url: 'en.wikipedia.org/wiki/Kerala', mode: 'assist', use: 'reference', ms: 412,
      sig: [['robots.txt', 'allows Iframely-Processing'], ['Content Signals', null], ['llms.txt', 'found'], ['licence', 'CC BY-SA 4.0'], ['Console', null]],
      dec: [['metadata', 'allowed'], ['entities', 'allowed'], ['excerpt', 'allowed'], ['full text', 'allowed <em>· promoted by CC BY-SA</em>']],
      out: ['# Kerala', '', '<span class="g">Kerala is a state on the Malabar Coast of</span>', '<span class="g">India, formed on 1 November 1956 from</span>', '<span class="g">Malayalam-speaking regions …</span>', '', '<span class="g">words  </span>1,840<span class="g">  · source linked</span>'] },
    { url: 'news.example.com/2026/10/budget', mode: 'ai-input', use: 'immediate', ms: 268,
      sig: [['robots.txt', 'allows Iframely-Processing'], ['Content Signals', 'ai-input=no'], ['llms.txt', null], ['licence', null], ['Console', '/2026/* excerpt only']],
      dec: [['metadata', 'allowed'], ['entities', 'allowed'], ['excerpt', 'allowed <em>· Console</em>'], ['full text', '-blocked <em>· Content Signals, Console</em>']],
      out: ['# Budget 2027: what changes for you', '', '<span class="g">The new budget raises the basic allowance</span>', '<span class="g">and changes how freelancers file …</span>', '', '<span class="x">full text withheld · see access.decision</span>'] },
  ];
  DEMOS.register('sec-data-large', {
    group: 'sec', title: 'Data API · large: the reader shows its permissions',
    blurb: 'New. A command declares its purpose (mode and use); the access panel fills in as the request runs: what was requested, each publisher signal found (robots.txt, Content Signals, llms.txt, licence, Publisher Console), then a verdict per content type with what decided it. The response arrives in the terminal in greys, indented under the command; the URL is the only blue; the > prompt becomes // when done. Two requests: a CC BY-SA article that promotes full text, and a news page where Content Signals and a Console rule block it. Only 200s. Hover pauses.',
    mount(stage) {
      const slot = section(stage, { layout: 'large', prod: 'data', title: 'The web reader that can show its permissions', sub: 'Tell us why you are reading a URL. We read it once, as a signed and named agent, and return what the publisher allows for that purpose: metadata, links, entities, an excerpt, Markdown full text. With every result comes the <code>access</code> object, the record of why.', btns: [['Get an API key, 2,000 hits a month free'], ['Quick start', 'secondary'], ['Docs →', 'quiet']] });
      const term = h('div', { class: 'da-term' });
      const req = h('div', { class: 'da-req' }), sig = h('dl', { class: 'da-sig' }), dec = h('dl', { class: 'da-dec' });
      const acc = h('div', { class: 'da-acc' }, h('h4', null, 'access.requested'), req, h('h4', null, 'access.signals'), sig, h('h4', null, 'access.decision'), dec);
      slot.appendChild(h('div', { class: 'sx-stage' }, h('div', { class: 'da' }, win('Data API', term), win('access', acc, 'Processing Agent · signed'))));
      let k = 0;
      return runner(slot, async (S, W) => {
        const q = REQ[k++ % REQ.length];
        const cmd = [['iframely data ', ''], [q.url, 'u'], [' \\', ''], ['\n   --mode=' + q.mode + ' --use=' + q.use, '']];
        /* the prompt is padded to the width of the // done mark, so the command and the response line up under it */
        const paint = (n, prompt, tail) => { let left = n, s = `<span class="g">${prompt.padEnd(2)} </span>`; for (const [t, c] of cmd) { const part = t.slice(0, Math.max(0, left)); left -= t.length; s += c ? `<span class="${c}">${part}</span>` : part; if (left < 0) break; } term.innerHTML = s + (tail || ''); };
        const total = cmd.reduce((m, [t]) => m + t.length, 0);
        req.innerHTML = ''; sig.innerHTML = q.sig.map(([a, b]) => `<dt>${a}</dt><dd class="${b ? '' : 'n'}">${b || 'none found'}</dd>`).join('');
        dec.innerHTML = q.dec.map(([a, b]) => `<dt>${a}</dt><dd class="${b[0] === '-' ? 'no' : ''}">${b.replace(/^-/, '')}</dd>`).join('');
        for (let i = 0; i <= total; i += 2) { paint(i, '>', '<span class="sx-caret"></span>'); await S(24); }
        paint(total, '>'); req.innerHTML = `mode <span>${q.mode}</span> · use <span>${q.use}</span>`; await S(400);
        for (let i = 0; i < sig.children.length; i += 2) { sig.children[i].classList.add('on'); sig.children[i + 1].classList.add('on'); await S(260); }
        await S(200);
        for (let i = 0; i < dec.children.length; i += 2) { dec.children[i].classList.add('on'); dec.children[i + 1].classList.add('on'); await S(240); }
        const head = `\n\n   <span class="g">200 · ${q.ms} ms</span>\n\n`;
        for (let n = 1; n <= q.out.length; n++) { paint(total, '>', head + q.out.slice(0, n).map(l => '   ' + l).join('\n')); await S(120); }
        paint(total, '//', head + q.out.map(l => '   ' + l).join('\n') + '\n\n<span class="g">></span> <span class="sx-caret"></span>');
        await W(4200);
      });
    },
  });
  DEMOS.register('sec-data-side', {
    group: 'sec', title: 'Data API · side: the P08 terminal',
    blurb: 'The Data API window from P08 on its own: iframely data reading a Wikipedia URL as Markdown, status and access summary in grey. Home page Data API section copy.',
    mount(stage) { const slot = section(stage, { prod: 'data', title: 'Machine-ready URL data processing: declared, signed and logged', sub: ['Declare why you’re reading a URL. We fetch it with a signed, named agent, check robots.txt, Content Signals, the licence and Publisher Console settings, and return what fits both your purpose and the publisher’s signals.', 'No brute force. The <code>access</code> object shows which publisher signals were found and how each was applied.'], btns: [['How the Data API works'], ['Free trial', 'secondary']] }); return DEMOS.prodKit(slot, { only: 2, bare: true }); },
  });

  /* ── Publisher Console: live requests by agent, a path policy that changes what they get ── */
  const APPS = ['Acme Chat', 'Notely', 'Briefly', 'Searchly', 'Deskmate', 'Linkboard'];
  const PATHS = ['/blog/kerala-guide', '/blog/monsoon-food', '/members/q3-report', '/news/budget-2027', '/blog/houseboats', '/recipes/appam'];
  DEMOS.register('sec-pub-large', {
    group: 'sec', title: 'Publisher Console · large: who fetches, and what they get',
    blurb: 'New. The Console for example.com: requests per agent on the left (Preview, Processing, Training), a live feed in the middle naming the customer app, the path and what it received, and the content policy by path on the right. Every few seconds the /blog/* policy flips between full text and excerpt, and the next Processing requests for /blog/ follow it. Customer names are made up. Hover pauses.',
    mount(stage) {
      const slot = section(stage, { layout: 'large', prod: 'pub', title: 'Your content, your rules, across 6,000 products', sub: 'Iframely renders previews and embeds for more than 6,000 products. Every request names the customer behind it, is signed, and reads one URL at a time. A free publisher account controls what each agent receives, per domain and path.', btns: [['Claim your domain, free'], ['Verify our agents', 'secondary'], ['Check a URL →', 'quiet']] });
      const AG = [['Preview Agent', 18240, 'metadata only, never the body', '#171717'], ['Processing Agent', 6412, 'assist · discover · search · ai-input', '#0055ff'], ['Training Agent', 312, 'metadata and links only', '#bbbbbb']];
      const ags = h('div', null, h('h4', null, 'Last 7 days'), ...AG.map(([n, v, s, c]) => h('div', { class: 'pc-ag', style: `--c:${c};--w:${Math.max(3, v / 182.4)}%`, html: `<div><b>${n}</b><s>${v.toLocaleString('en')}</s></div><small>${s}</small><u></u>` })));
      const feed = h('div', { class: 'pc-feed' }, h('div', { class: 'pc-r hd', html: '<span>time</span><span>agent</span><span>app</span><span>path</span><span class="v">got</span>' }));
      const polBlog = h('span', { class: 'pc-sel' }, 'full text');
      const pBlog = h('div', { class: 'pc-p' }, h('code', null, '/blog/*'), h('div', null, h('span', null, 'Processing'), polBlog));
      const pol = h('div', { class: 'pc-pol' }, h('h4', null, 'Content policy'), pBlog,
        h('div', { class: 'pc-p', html: '<code>/members/*</code><div><span>Processing</span><span class="pc-sel">excerpt</span></div>' }),
        h('div', { class: 'pc-p', html: '<code>/*</code><div><span>Training</span><span class="pc-sel">metadata</span></div>' }),
        h('p', { class: 'pc-note' }, 'Signed with Web Bot Auth. The customer’s name rides in the Forwarded header.'));
      slot.appendChild(h('div', { class: 'sx-stage' }, win('Publisher Console — example.com', h('div', { class: 'pc' }, h('div', { class: 'pc-c' }, ags), h('div', null, h('h4', null, 'Live requests'), feed), pol), 'Admin · DNS verified')));
      let blog = 'full text', t = 12 * 3600 + 4 * 60 + 11, n = 0;
      const clock = () => { const p = x => String(x).padStart(2, '0'); return `${p(Math.floor(t / 3600) % 24)}:${p(Math.floor(t / 60) % 60)}:${p(t % 60)}`; };
      const add = () => {
        t += 1 + Math.floor(Math.random() * 3); n++;
        const r = Math.random(), agent = r < .62 ? 'preview' : r < .95 ? 'processing' : 'training';
        const path = agent === 'processing' && n % 2 ? PATHS[[0, 1, 4][n % 3]] : PATHS[Math.floor(Math.random() * PATHS.length)];
        const got = agent === 'preview' ? 'metadata' : agent === 'training' ? 'metadata' : path.startsWith('/blog/') ? blog : path.startsWith('/members/') ? 'excerpt' : 'full text';
        const row = h('div', { class: 'pc-r new' + (agent === 'processing' && path.startsWith('/blog/') ? ' hit' : ''), html: `<span class="t">${clock()}</span><span>${agent}</span><span>${APPS[Math.floor(Math.random() * APPS.length)]}</span><span class="p">${path}</span><span class="v ${got === 'full text' ? '' : 'ex'}">${got === 'full text' ? 'full' : got}</span>` });
        feed.insertBefore(row, feed.children[1]); while (feed.children.length > 11) feed.lastChild.remove();
        const ag = ags.querySelectorAll('.pc-ag')[agent === 'preview' ? 0 : agent === 'processing' ? 1 : 2], s = ag.querySelector('s'); s.textContent = (+s.textContent.replace(/,/g, '') + 1).toLocaleString('en');
      };
      for (let i = 0; i < 10; i++) add();
      feed.querySelectorAll('.new').forEach(r => r.classList.remove('new'));
      let beat = 0;
      return runner(slot, async (S, W) => {
        await W(900); add();
        if (++beat % 8 === 0) { blog = blog === 'full text' ? 'excerpt' : 'full text'; polBlog.textContent = blog; pBlog.classList.add('flash'); await S(1200); pBlog.classList.remove('flash'); }
      });
    },
  });
  DEMOS.register('sec-pub-side', {
    group: 'sec', title: 'Publisher Console · side: the P08 console window',
    blurb: 'The Publisher Console window from P08 on its own: requests by agent for example.com and two path policies, one toggling. Home page Publisher Console section copy.',
    mount(stage) { const slot = section(stage, { prod: 'pub', title: 'See who reads your pages, and how your settings apply', sub: ['For your own web domains, see which products fetch your pages and why. Set a processing policy and other rules for the whole domain, a path or an individual Iframely customer.', 'Free. Read-only access with email verification, admin rights with DNS verification.'], btns: [['For publishers'], ['Claim your domain', 'secondary']] }); return DEMOS.prodKit(slot, { only: 3, bare: true }); },
  });

  /* ── S11 / S12 · the home page "Connecting developers and publishers" section with the hub as its visual.
     One URL at a time goes through all four windows; each product keeps its badge colour on its tag, link, wire and
     packet; the hub stays Iframely blue. S11: the windows are the tops of the four product cards. S12: developers'
     apps on the left, the publisher on the right, Iframely between; requests go in, the publisher's Console logs them,
     results come back. Group 'sec'. */
  const KEYS = ['rich', 'preview', 'data', 'pub'];
  const CARDS = {
    rich: ['For content platforms', 'Rich Media', 'Embeds for over 1,900 providers and growing, through one API. Tracking provider changes since 2012.', 'See providers'],
    preview: ['For collaboration apps', 'Preview API', 'Link previews and cards for public URLs, across the formats publishers use. One API to connect to.', 'See the Preview API'],
    data: ['For automated systems', 'Data API', 'Readable content, entities, Markdown and publisher permissions data for automated processing and logging.', 'See the Data API'],
    pub: ['For publishers', 'Publisher Console', 'A free account to see who fetches your pages, and to set how your content is used, per domain, path and app.', 'Claim your domain'],
  };
  const APP = { rich: 'Acme Docs', preview: 'Chatly', data: 'Briefly' }; /* made-up customer apps, one per developer product */
  const ONE = [
    { url: 'en.wikipedia.org/wiki/Kerala', domain: 'en.wikipedia.org', fav: 'wikipedia', site: 'Wikipedia', th: 'linear-gradient(135deg,#c6ecd8,#3c8d5a)',
      rich: { kind: 'sum', type: 'summary card', id: 'w4Kr1?card=small' }, preview: { who: 'Ana', say: 'background for the piece', title: 'Kerala', desc: 'A state on the Malabar Coast of India, formed in 1956.' },
      data: { ms: 412, h: '# Kerala', ex: 'A state on the Malabar Coast of India …', acc: 'full text · CC BY-SA' }, got: 'full text', pol: ['licence', 'CC BY-SA → full text'], week: [42.6, 11.3, 2.1] },
    { url: 'soundcloud.com/bonobo/kerala', domain: 'soundcloud.com', fav: 'soundcloud', site: 'SoundCloud', th: 'linear-gradient(135deg,#ffcf8a,#f2552c)',
      rich: { kind: 'audio', type: 'player · audio', id: 'q2Lm8?iframe=1' }, preview: { who: 'Maya', say: 'this is the one for the intro', title: 'Kerala', desc: 'Bonobo · Migration · 2017' },
      data: { ms: 236, h: '# Kerala — Bonobo', ex: 'Track · Migration (2017) · 4:42', acc: 'excerpt · Console rule' }, got: 'excerpt', pol: ['/*', 'Processing → excerpt'], week: [27.9, 4.8, 0.4] },
    { url: 'youtube.com/watch?v=Kx3pQ8vB2nE', domain: 'youtube.com', fav: 'youtube', site: 'YouTube', th: 'linear-gradient(180deg,#5a6f9c,#162038)',
      rich: { kind: 'video', type: 'player · 16:9', id: 'x7Kd2?iframe=1' }, preview: { who: 'Dev', say: 'the clip from the houseboat', title: 'Kerala backwaters by houseboat', desc: 'Slow Travels · 12:08' },
      data: { ms: 188, h: '# Kerala backwaters by houseboat', ex: 'Video · 12:08 · Slow Travels', acc: 'metadata, media links' }, got: 'metadata', pol: ['/watch', 'Processing → metadata'], week: [63.1, 8.2, 0.2] },
  ];
  const wave = n => Array.from({ length: n }, (_, i) => `<u class="${i < n * .4 ? 'p' : ''}" style="height:${Math.round(20 + 75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * .45)))}%"></u>`).join('');
  const BODY = {
    rich: s => `<div class="cx-pl cx-${s.rich.kind}" style="--th:${s.th}">${s.rich.kind === 'audio' ? `<div class="w">${wave(30)}</div>` : s.rich.kind === 'sum' ? `<div class="c"><b>${s.preview.title}</b><span>${s.preview.desc}</span></div>` : '<em></em>'}</div><div class="cx-mc"><div class="cx-meta">${fav(s.fav)}<b>${s.site}</b><span>· ${s.rich.type}</span></div><div class="cx-code">&lt;iframe src="//cdn.iframe.ly/${s.rich.id}"&gt;</div></div>`,
    preview: s => `<div class="cx-msg"><i class="av" style="background:${s.th}"></i><div><small>${s.preview.who}</small><p>${s.preview.say} <a>${s.url}</a></p><div class="cx-unf"><div><div class="s">${fav(s.fav)}${s.site}</div><b>${s.preview.title}</b><span>${s.preview.desc}</span></div><i style="background:${s.th}"></i></div></div></div>`,
    data: s => `<div class="cx-term"><div><span class="g">// </span>iframely data <span class="u">${s.url}</span></div><div class="g">   200 · ${s.data.ms} ms</div><div>   ${s.data.h}</div><div class="g">   ${s.data.ex}</div><div class="g">   access · ${s.data.acc}</div></div>`,
    pub: (s, n) => `<div class="cx-con"><div class="h"><b>${s.domain}</b><span>this URL · now</span></div>${[['preview', APP.rich, 'embed'], ['preview', APP.preview, 'card'], ['processing', APP.data, s.got]].slice(0, n == null ? 3 : n).map(([a, b, c]) => `<div class="r"><span>${a}</span><span>${b}</span><span class="v">${c}</span></div>`).join('')}<div class="pol"><code>${s.pol[0]}</code><span>${s.pol[1]}</span></div>` +
      /* the week for this domain, shown only where the Console window is tall (S12) */
      `<div class="ext"><div class="h"><b>Last 7 days</b><span>by agent</span></div>${[['Preview', s.week[0], '#171717'], ['Processing', s.week[1], '#0055ff'], ['Training', s.week[2], '#bbbbbb']].map(([a, v, c]) => `<div class="b"><span>${a}</span><u style="--w:${Math.max(2, v / s.week[0] * 100)}%;--c:${c}"></u><s>${v}k</s></div>`).join('')}<div class="sig">Every request signed (Web Bot Auth) and named in the Forwarded header.</div></div></div>`,
  };
  const CX_CSS = `
.cx-url{display:flex;justify-content:center;margin-bottom:24px}
.cx-url div{font:13px 'Geist Mono',ui-monospace,monospace;color:var(--g);border:1px solid var(--line);background:#fff;border-radius:20px;padding:7px 16px;min-width:min(440px,100%);max-width:100%;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx-url .u{color:var(--bl)}
.cx-top{position:relative}
.cx-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.cx-lines path{fill:none;stroke:#d5d5d5;stroke-width:1.5;stroke-dasharray:4 5;transition:stroke .5s}
.cx-hub{position:relative;z-index:1;width:84px;height:84px;border-radius:22px;background:#171717;display:grid;place-items:center;box-shadow:0 10px 30px rgba(23,23,23,.18);transition:box-shadow .4s;margin:0 auto}
.cx-hub b{font:800 38px/1 'JetBrains Mono',ui-monospace,monospace;color:var(--bl);letter-spacing:-.06em;transform:translateX(-2px)}
.cx-hub.ping{box-shadow:0 10px 30px rgba(23,23,23,.18),0 0 0 9px rgba(0,85,255,.14)}
.cx1 .cx-hub{margin-bottom:76px}
.cx-cards{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.cx-card{min-width:0}
.cx-card .sx-win,.cx-side .sx-win{transition:box-shadow .3s,border-color .3s}
.cx-card.hot .sx-win,.cx-w.hot{border-color:var(--m);box-shadow:0 0 0 3px var(--t),0 12px 32px rgba(23,23,23,.06)}
.cx-body{height:236px;padding:14px 16px 16px;display:flex;flex-direction:column;justify-content:flex-end;gap:9px;font-size:12.5px;transition:opacity .3s;min-width:0}
.cx-body.fade{opacity:.12}
.cx-copy{padding:18px 4px 0}
.cx-tag{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--m)}
.cx-tag svg{flex:none}
.cx-copy h3{font-weight:500;font-size:20px;letter-spacing:-.015em;margin:8px 0 6px;color:var(--ink)}
.cx-copy p{margin:0;font-size:15px;line-height:1.5;color:var(--mut)}
.cx-copy a{display:inline-block;margin-top:12px;font-size:15px;font-weight:500;color:var(--m);text-decoration:none}
.cx-pl{position:relative;aspect-ratio:16/9;border-radius:9px;overflow:hidden;flex:none}
.cx-video{background:radial-gradient(circle at 72% 30%,#ffd28a 0 7%,transparent 7.5%),linear-gradient(180deg,#2c3e66 0%,#5a6f9c 58%,#162038 58.5%)}
.cx-video em{position:absolute;left:50%;top:46%;width:36px;height:36px;margin:-18px;border-radius:50%;background:rgba(255,255,255,.94);display:grid;place-items:center}
.cx-video em::after{content:"";border-left:11px solid var(--bl);border-top:7px solid transparent;border-bottom:7px solid transparent;margin-left:3px}
.cx-audio{background:var(--soft);display:flex;align-items:center;padding:0 12px}
.cx-audio .w{flex:1;height:62%;display:flex;align-items:center;gap:2px}
.cx-audio u{flex:1;align-self:center;background:var(--g2);border-radius:2px}
.cx-audio u.p{background:var(--bl)}
.cx-sum{background:#fff;border:1px solid var(--line);display:grid;grid-template-columns:38% minmax(0,1fr)}
.cx-sum::before{content:"";background:var(--th)}
.cx-sum .c{padding:8px 10px;display:flex;flex-direction:column;gap:3px;min-width:0}
.cx-sum b{font-size:12.5px;font-weight:600}
.cx-sum span{font-size:11px;line-height:1.35;color:var(--mut);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.cx-mc{display:flex;flex-direction:column;gap:9px;min-width:0}
.cx-meta{display:flex;align-items:center;gap:6px;color:var(--g);white-space:nowrap;overflow:hidden}
.cx-meta img{width:13px;height:13px}
.cx-meta b{color:var(--ink);font-weight:500}
.cx-code{font:11px 'Geist Mono',ui-monospace,monospace;color:var(--g);background:var(--soft);border-radius:7px;padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx-code b{color:var(--bl)}
.cx-msg{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;line-height:1.4}
.cx-msg .av{width:24px;height:24px;border-radius:7px}
.cx-msg small{display:block;color:var(--g);font-size:11px}
.cx-msg p{margin:0;color:var(--ink)}
.cx-msg a{color:var(--bl);word-break:break-all}
.cx-unf{margin-top:7px;border-left:3px solid var(--line);padding:1px 0 1px 9px;display:grid;grid-template-columns:minmax(0,1fr) 42px;gap:8px}
.cx-unf .s{display:flex;align-items:center;gap:5px;color:var(--g);font-size:11px}
.cx-unf .s img{width:12px;height:12px}
.cx-unf b{display:block;font-weight:600;margin:2px 0 1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx-unf span{color:var(--mut);font-size:11px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cx-unf i{width:42px;height:42px;border-radius:7px}
.cx-term{font:11.5px/1.7 'Geist Mono',ui-monospace,monospace;color:var(--ink)}
.cx-term div{white-space:pre;overflow:hidden;text-overflow:ellipsis}
.cx-term .g{color:var(--g)}
.cx-term .u{color:var(--bl)}
.cx-con{display:flex;flex-direction:column;gap:2px}
.cx-con .h{display:flex;justify-content:space-between;gap:8px;color:var(--g);margin-bottom:6px}
.cx-con .h b{color:var(--ink);font-weight:600}
.cx-con .r{display:grid;grid-template-columns:76px minmax(0,1fr) auto;gap:8px;font:11px 'Geist Mono',ui-monospace,monospace;padding:7px 0;border-bottom:1px solid var(--line);animation:pc-in .45s ease-out}
.cx-con .r span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx-con .r span:first-child{color:var(--g)}
.cx-con .pol{display:flex;justify-content:space-between;gap:8px;padding-top:9px;color:var(--g)}
.cx-con .pol code{font:11px 'Geist Mono',ui-monospace,monospace;color:var(--ink)}
/* S12: developers | Iframely | publisher */
.cx-mid{display:grid;grid-template-columns:minmax(0,1.45fr) 150px minmax(0,1fr);align-items:stretch}
.cx-side{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1;min-width:0}
.cx-lab{font:500 12px 'Geist Mono',ui-monospace,monospace;color:var(--g);letter-spacing:.06em;text-transform:uppercase}
.cx-hubc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;position:relative;z-index:1}
.cx-hubc span{font:12px 'Geist Mono',ui-monospace,monospace;color:var(--g)}
.cx-side .sx-bar .r{font-size:11.5px}
.cx-row .cx-body{height:128px;justify-content:center}
.cx-row .cx-body.rich{display:grid;grid-template-columns:150px minmax(0,1fr);align-items:center;gap:14px}
.cx-pubw{flex:1}
.cx-pubw .cx-body{height:auto;flex:1;justify-content:flex-start;font-size:13px}
.cx-pubw .cx-con .r{font-size:12px;padding:10px 0}
.cx-con .ext{display:none}
.cx-pubw .cx-con .ext{display:flex;flex-direction:column;gap:10px;margin-top:22px;padding-top:16px;border-top:1px dashed var(--line)}
.cx-con .ext .b{display:grid;grid-template-columns:76px 1fr 44px;gap:10px;align-items:center;font:12px 'Geist Mono',ui-monospace,monospace;color:var(--g)}
.cx-con .ext u{height:7px;border-radius:4px;background:var(--soft);overflow:hidden}
.cx-con .ext u::before{content:"";display:block;height:100%;width:var(--w);background:var(--c);border-radius:4px}
.cx-con .ext s{text-decoration:none;text-align:right;color:var(--ink)}
.cx-con .ext .sig{font-size:12px;color:var(--g);line-height:1.5;margin-top:4px}
.cx-copyrow .cx-tag{font-size:12.5px;white-space:nowrap}
.cx-copyrow{display:grid;grid-template-columns:minmax(0,1.45fr) 150px minmax(0,1fr);margin-top:30px}
.cx-dev{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.cx-copyrow .cx-copy{padding-top:0}
.cx-copyrow .cx-copy h3{font-size:18px}
.cx-copyrow .cx-copy p{font-size:14px}
@container (max-width:980px){.cx-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.cx1 .cx-lines{display:none}.cx1 .cx-hub{margin-bottom:28px}}
@container (max-width:860px){.cx-mid,.cx-copyrow{grid-template-columns:1fr;gap:18px}.cx2 .cx-lines{display:none}.cx-dev{grid-template-columns:1fr}.cx-copyrow>div:nth-child(2){display:none}}
@container (max-width:560px){.cx-cards{grid-template-columns:1fr}}
`;
  const SECT = { title: 'Connecting developers and publishers, one URL at a time', sub: 'Connect once, and every feature comes through the same endpoint.' };
  const tagEl = k => h('div', { class: 'cx-tag', html: icon(k, 16) + CARDS[k][0] });
  const copyEl = k => h('div', { class: 'cx-copy', style: `--m:${PROD[k].main};--t:${PROD[k].tint}` }, tagEl(k), h('h3', null, CARDS[k][1]), h('p', null, CARDS[k][2]), h('a', { href: '#' }, CARDS[k][3] + ' →'));
  const NS = 'http://www.w3.org/2000/svg';
  /* a packet: a dot in the product colour runs along a wire, which takes the colour for a moment */
  const packet = (tl, path, dot, color, rev, ms = 950) => new Promise(res => {
    if (R || !path) return res();
    const L = path.getTotalLength(), t0 = performance.now(); dot.style.fill = color; path.style.stroke = color;
    const f = now => { if (!tl.alive) return res(); const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, p = path.getPointAtLength((rev ? 1 - e : e) * L);
      dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('opacity', k < .92 ? 1 : (1 - k) * 12);
      if (k < 1) requestAnimationFrame(f); else { dot.setAttribute('opacity', 0); setTimeout(() => { path.style.stroke = ''; }, 500); res(); } };
    requestAnimationFrame(f);
  });
  const typeUrl = async (pill, url, S) => { for (let i = 0; i <= url.length; i += 2) { pill.innerHTML = `one URL at a time · <span class="u">${url.slice(0, i)}</span><span class="sx-caret"></span>`; await S(18); } pill.innerHTML = `one URL at a time · <span class="u">${url}</span>`; };
  const swap = async (body, html, S) => { body.classList.add('fade'); await S(260); body.innerHTML = html; body.classList.remove('fade'); };
  const cxEnsure = () => { if (!document.getElementById('css-cx')) document.head.appendChild(h('style', { id: 'css-cx' }, CX_CSS)); };

  DEMOS.register('sec-connect-cards', {
    group: 'sec', title: 'Connecting section · the windows are the product cards',
    blurb: 'Suggestion 1 + 3 + 4 for the home page section under the hero. The hub band is the section’s visual and each window is the top of its product card (tag, name, text and link from the site). One URL at a time: it is typed above the hub, packets run down all four wires, and every window shows that same URL as its product handles it: a summary card, player or audio embed; a chat unfurl; the Data API read with its access line; the request arriving in the publisher’s Console with the policy that applied. Each product keeps its badge colour on the tag, the link, its wire and its packet; the hub stays Iframely blue. Hovering a card rings its window and pauses the cycle. With this section, the hero takes S02 so the hub is not shown twice.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); cxEnsure();
      const pill = h('div'); let s = ONE[0];
      const bodies = {}, cards = KEYS.map(k => { bodies[k] = h('div', { class: 'cx-body', html: BODY[k](s) });
        const c = h('div', { class: 'cx-card', style: `--m:${PROD[k].main};--t:${PROD[k].tint}` }, win(PROD[k].name, bodies[k]), copyEl(k));
        c.addEventListener('mouseenter', () => c.classList.add('hot')); c.addEventListener('mouseleave', () => c.classList.remove('hot')); return c; });
      pill.innerHTML = `one URL at a time · <span class="u">${s.url}</span>`;
      const hub = h('div', { class: 'cx-hub', html: '<b>//</b>' }), grid = h('div', { class: 'cx-cards' }, ...cards);
      const lines = document.createElementNS(NS, 'svg'); lines.setAttribute('class', 'cx-lines');
      const top = h('div', { class: 'cx-top' }, lines, hub, grid);
      slot.appendChild(h('div', { class: 'cx cx1' }, h('div', { class: 'cx-url' }, pill), top));
      const draw = () => {
        const tb = top.getBoundingClientRect(), hb = hub.getBoundingClientRect(), hx = hb.left + hb.width / 2 - tb.left, hy = hb.top + hb.height / 2 - tb.top, hw = hb.width / 2, R0 = 36;
        lines.setAttribute('viewBox', `0 0 ${tb.width} ${tb.height}`);
        const ds = cards.map(c => { const w = c.querySelector('.sx-win').getBoundingClientRect(), cx = w.left + w.width / 2 - tb.left, cy = w.top - tb.top, sg = Math.sign(cx - hx) || 1, x0 = hx + sg * hw, r = Math.max(0, Math.min(R0, Math.abs(cx - x0) - 2, cy - hy - 2));
          return `M${x0} ${hy}H${cx - sg * r}A${r} ${r} 0 0 ${sg > 0 ? 1 : 0} ${cx} ${hy + r}V${cy}`; });
        lines.innerHTML = ds.map(d => `<path d="${d}"/>`).join('') + ds.map(() => '<circle r="3.5" opacity="0"/>').join('');
      };
      const ro = new ResizeObserver(draw); ro.observe(top); draw();
      let n = 1;
      const stop = runner(slot, async (S, W, tl) => {
        await W(1800); s = ONE[n++ % ONE.length];
        await typeUrl(pill, s.url, S); await S(250);
        hub.classList.add('ping'); setTimeout(() => hub.classList.remove('ping'), 500);
        const P = lines.querySelectorAll('path'), D = lines.querySelectorAll('circle'), visible = getComputedStyle(lines).display !== 'none';
        await Promise.all(KEYS.map(async (k, i) => { await S(i * 130); if (visible) await packet(tl, P[i], D[i], PROD[k].main); await swap(bodies[k], BODY[k](s), S); }));
        await W(3000);
      });
      return () => { stop(); ro.disconnect(); };
    },
  });

  /* S13 · S11 without the hub and wires: the URL is a command line, right-aligned above the cards, and the four windows
     (no window dots) take it in turn from left to right. Prompt > while it runs, // when done, status in grey after it. */
  const CMD_CSS = `
.cx-cmd{display:flex;justify-content:flex-end;margin-bottom:20px;font:13.5px/1.6 'Geist Mono',ui-monospace,monospace;color:var(--g);white-space:pre;min-width:0}
.cx-cmd span{overflow:hidden;text-overflow:ellipsis}
.cx-cmd .u{color:var(--bl)}
.cx-cmd .st{color:var(--g)}
.sx-bar.nd span{margin-left:0}
.cx3 .cx-card.on .sx-win{border-color:var(--m);box-shadow:0 0 0 3px var(--t),0 12px 32px rgba(23,23,23,.06)}
`;
  const CARDS2 = ['sec-connect-cards2', { /* registered after S12 so the numbers stay put */
    group: 'sec', title: 'Connecting section · cards, the URL as a command',
    blurb: 'S11 iterated: no // hub, no wires and no "one URL at a time" label (the heading already says it). The URL is typed as a command, right-aligned above the cards: a > prompt while it runs, // when it is done, then 200 · ms in grey; the URL is the only blue. The four windows (no window dots) take the URL in turn from left to right, each ringed in its product colour while it updates. Hovering a card rings it and pauses the cycle.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); cxEnsure();
      if (!document.getElementById('css-cx3')) document.head.appendChild(h('style', { id: 'css-cx3' }, CMD_CSS));
      let s = ONE[0];
      const cmd = h('div', { class: 'cx-cmd' });
      const line = (url, n, prompt, st) => { cmd.innerHTML = `<span>${prompt.padEnd(2)} </span><span class="u">${url.slice(0, n)}</span>${n < url.length ? '<span class="sx-caret"></span>' : ''}${st ? `<span class="st">  ${st}</span>` : ''}`; };
      const ms = x => `200 · ${x.data.ms} ms`;
      line('https://' + s.url, 1e3, '//', ms(s));
      const bodies = {}, cards = KEYS.map(k => { bodies[k] = h('div', { class: 'cx-body', html: BODY[k](s) });
        const w = h('div', { class: 'sx-win' }, h('div', { class: 'sx-bar nd', html: `<span>${PROD[k].name}</span>` }), bodies[k]);
        const c = h('div', { class: 'cx-card', style: `--m:${PROD[k].main};--t:${PROD[k].tint}` }, w, copyEl(k));
        c.addEventListener('mouseenter', () => c.classList.add('hot')); c.addEventListener('mouseleave', () => c.classList.remove('hot')); return c; });
      slot.appendChild(h('div', { class: 'cx cx3' }, cmd, h('div', { class: 'cx-cards' }, ...cards)));
      let n = 1;
      return runner(slot, async (S, W) => {
        await W(1800); s = ONE[n++ % ONE.length]; const url = 'https://' + s.url;
        for (let i = 0; i <= url.length; i += 2) { line(url, i, '>'); await S(20); }
        line(url, url.length, '>'); await S(300);
        for (const [i, k] of KEYS.entries()) { cards[i].classList.add('on'); await swap(bodies[k], BODY[k](s), S); await S(220); cards[i].classList.remove('on'); }
        line(url, url.length, '//', ms(s));
        await W(3000);
      });
    },
  }];

  DEMOS.register('sec-connect-sides', {
    group: 'sec', title: 'Connecting section · developers, Iframely, publishers',
    blurb: 'Suggestion 2 (+ 3 and 4): the headline laid out literally. Developers’ apps on the left (made-up customers using Rich Media, the Preview API and the Data API), the publisher on the right (Publisher Console), Iframely between. One URL at a time: the three apps send it in, the hub pings, the request reaches the publisher and shows up in their Console naming each app and what it got under their policy, then the results come back and each app shows it. Product colours on wires, packets, tags and links; the hub stays blue. The four product cards sit under their side. Hover pauses.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); cxEnsure();
      const pill = h('div'); let s = ONE[0];
      const bodies = {}, wins = {};
      for (const k of KEYS) {
        bodies[k] = h('div', { class: 'cx-body' + (k === 'rich' ? ' rich' : ''), html: BODY[k](s) });
        wins[k] = win(PROD[k].name, bodies[k], k === 'pub' ? 'free account' : APP[k], 'cx-w' + (k === 'pub' ? ' cx-pubw' : ''));
        wins[k].style.cssText = `--m:${PROD[k].main};--t:${PROD[k].tint}`;
      }
      pill.innerHTML = `one URL at a time · <span class="u">${s.url}</span>`;
      const hub = h('div', { class: 'cx-hub', html: '<b>//</b>' });
      const left = h('div', { class: 'cx-side' }, h('div', { class: 'cx-lab' }, 'Developers · your app'), ...['rich', 'preview', 'data'].map(k => { const r = h('div', { class: 'cx-row' }, wins[k]); return r; }));
      const right = h('div', { class: 'cx-side' }, h('div', { class: 'cx-lab' }, 'Publishers · their site'), wins.pub);
      const lines = document.createElementNS(NS, 'svg'); lines.setAttribute('class', 'cx-lines');
      const mid = h('div', { class: 'cx-mid cx-top' }, lines, left, h('div', { class: 'cx-hubc' }, hub, h('span', null, 'Iframely')), right);
      const copy = h('div', { class: 'cx-copyrow' }, h('div', { class: 'cx-dev' }, ...['rich', 'preview', 'data'].map(copyEl)), h('div'), copyEl('pub'));
      slot.appendChild(h('div', { class: 'cx cx2' }, h('div', { class: 'cx-url' }, pill), mid, copy));
      const draw = () => {
        const tb = mid.getBoundingClientRect(), hb = hub.getBoundingClientRect(), hy = hb.top + hb.height / 2 - tb.top, hl = hb.left - tb.left, hr = hb.right - tb.left;
        lines.setAttribute('viewBox', `0 0 ${tb.width} ${tb.height}`);
        const ds = ['rich', 'preview', 'data'].map(k => { const w = wins[k].getBoundingClientRect(), x0 = w.right - tb.left, y0 = w.top + w.height / 2 - tb.top, dx = (hl - x0) / 2; return `M${x0} ${y0}C${x0 + dx} ${y0} ${hl - dx} ${hy} ${hl} ${hy}`; });
        const pw = wins.pub.getBoundingClientRect(), x1 = pw.left - tb.left, y1 = Math.min(Math.max(hy, pw.top - tb.top + 40), pw.bottom - tb.top - 40), dx = (x1 - hr) / 2;
        ds.push(`M${hr} ${hy}C${hr + dx} ${hy} ${x1 - dx} ${y1} ${x1} ${y1}`);
        lines.innerHTML = ds.map(d => `<path d="${d}"/>`).join('') + ds.map(() => '<circle r="3.5" opacity="0"/>').join('');
      };
      const ro = new ResizeObserver(draw); ro.observe(mid); draw();
      let n = 1;
      const stop = runner(slot, async (S, W, tl) => {
        await W(1800); s = ONE[n++ % ONE.length];
        await typeUrl(pill, s.url, S); await S(200);
        const P = lines.querySelectorAll('path'), D = lines.querySelectorAll('circle'), visible = getComputedStyle(lines).display !== 'none';
        const dev = ['rich', 'preview', 'data'];
        await Promise.all(dev.map(async (k, i) => { await S(i * 110); wins[k].classList.add('hot'); if (visible) await packet(tl, P[i], D[i], PROD[k].main); }));
        hub.classList.add('ping'); setTimeout(() => hub.classList.remove('ping'), 500);
        if (visible) await packet(tl, P[3], D[3], PROD.pub.main, false, 800);
        wins.pub.classList.add('hot'); await swap(bodies.pub, BODY.pub(s, 0), S);
        for (let r = 1; r <= 3; r++) { bodies.pub.innerHTML = BODY.pub(s, r); await S(380); }
        await S(300);
        await Promise.all(dev.map(async (k, i) => { await S(i * 110); if (visible) await packet(tl, P[i], D[i], PROD[k].main, true); await swap(bodies[k], BODY[k](s), S); }));
        await S(600); KEYS.forEach(k => wins[k].classList.remove('hot'));
        await W(2800);
      });
      return () => { stop(); ro.disconnect(); };
    },
  });

  DEMOS.register(...CARDS2);

  /* ── S14–S17 · own takes on S13: no hub, no wires, no window dots, the URL as a command ── */
  const X_CSS = `
.sx-win.bare{border-radius:12px}
.cx-wcmd{padding:10px 14px;border-bottom:1px solid var(--line);font:11.5px/1.5 'Geist Mono',ui-monospace,monospace;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx-wcmd .g{color:var(--g)}.cx-wcmd .u{color:var(--bl)}
.cx-rail{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-bottom:14px}
.cx-rail div{display:flex;flex-direction:column;gap:7px;font:11.5px 'Geist Mono',ui-monospace,monospace;color:var(--g)}
.cx-rail i{display:block;height:2px;border-radius:1px;background:var(--line);overflow:hidden}
.cx-rail i::before{content:"";display:block;height:100%;width:var(--f,0%);background:var(--m);transition:width var(--d,.5s) linear}
.cx-rail span{display:flex;justify-content:space-between;gap:8px}
.cx-rail b{font-weight:500;color:var(--ink)}
.sx-head .cx-cmd{justify-content:flex-start;margin:22px 0 0;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--soft)}
.cx-pick{display:flex;justify-content:flex-end;align-items:center;gap:14px;margin-bottom:20px;flex-wrap:wrap}
.cx-pick .cx-cmd{margin:0}
.cx-chips{display:flex;gap:6px}
.cx-chips button{font:500 12.5px Geist,Inter,sans-serif;color:var(--mut);background:#fff;border:1px solid var(--line);border-radius:16px;height:30px;padding:0 12px 0 9px;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.cx-chips button img{width:13px;height:13px}
.cx-chips button.on{color:var(--ink);border-color:var(--ink)}
`;
  const xEnsure = () => { cxEnsure(); if (!document.getElementById('css-cx3')) document.head.appendChild(h('style', { id: 'css-cx3' }, CMD_CSS)); if (!document.getElementById('css-cx4')) document.head.appendChild(h('style', { id: 'css-cx4' }, X_CSS)); };
  /* the right-aligned command line: > while running, // when done, then the status in grey */
  const cmdLine = (el, url, n, prompt, st) => { el.innerHTML = `<span>${prompt.padEnd(2)} </span><span class="u">${url.slice(0, n)}</span>${n < url.length ? '<span class="sx-caret"></span>' : ''}${st ? `<span class="st">  ${st}</span>` : ''}`; };
  const typeCmd = async (el, url, S) => { for (let i = 0; i <= url.length; i += 2) { cmdLine(el, url, i, '>'); await S(20); } cmdLine(el, url, url.length, '>'); };
  /* four cards; top: 'title' (a plain title bar), 'none', or an element per product from top(k) */
  const makeCards = (s, top, body = BODY, copy = copyEl) => {
    const bodies = {}, tops = {};
    const cards = KEYS.map(k => { bodies[k] = h('div', { class: 'cx-body', html: body[k](s) });
      tops[k] = top === 'title' ? h('div', { class: 'sx-bar nd', html: `<span>${PROD[k].name}</span>` }) : typeof top === 'function' ? top(k) : null;
      const c = h('div', { class: 'cx-card', style: `--m:${PROD[k].main};--t:${PROD[k].tint}` }, h('div', { class: 'sx-win bare' }, tops[k], bodies[k]), copy(k));
      c.addEventListener('mouseenter', () => c.classList.add('hot')); c.addEventListener('mouseleave', () => c.classList.remove('hot')); return c; });
    return { cards, bodies, tops, grid: h('div', { class: 'cx-cards' }, ...cards) };
  };
  const wave4 = async (C, s, S, body = BODY) => { for (const [i, k] of KEYS.entries()) { C.cards[i].classList.add('on'); await swap(C.bodies[k], body[k](s), S); await S(220); C.cards[i].classList.remove('on'); } };
  const msOf = x => `200 · ${x.data.ms} ms`;

  /* S14: each window gets its own command for the same URL, so the one endpoint shows as four uses */
  const VERB = { rich: s => ['iframely embed ', s.url, ''], preview: s => ['iframely preview ', s.url, ''], data: s => ['iframely data ', s.url, ' --mode=assist'], pub: s => ['iframely console ', s.domain, ''] };
  const BODY14 = Object.assign({}, BODY, { data: s => BODY.data(s).replace(/^<div class="cx-term"><div>.*?<\/div>/, '<div class="cx-term">') });
  DEMOS.register('sec-connect-verbs', {
    group: 'sec', title: 'Connecting section · one URL, four commands',
    blurb: 'Own take. No line above the cards: each window’s title bar is its command for the same URL (iframely embed, preview, data, and console for the publisher’s domain), typed left to right; the prompt turns into // when that window has its result. Shows "one endpoint, four uses" without a diagram. URL blue, everything else greys and ink.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); xEnsure();
      let s = ONE[0];
      const paint = (el, k, n, p) => { const [a, u, b] = VERB[k](s), t = a + u + b; let left = n; const cut = x => { const r = x.slice(0, Math.max(0, left)); left -= x.length; return r; };
        el.innerHTML = `<span class="g">${p.padEnd(2)} </span>${cut(a)}<span class="u">${cut(u)}</span>${cut(b)}${n < t.length ? '<span class="sx-caret"></span>' : ''}`; return t.length; };
      const C = makeCards(s, k => h('div', { class: 'cx-wcmd' }), BODY14);
      KEYS.forEach(k => paint(C.tops[k], k, 1e3, '//'));
      slot.appendChild(h('div', { class: 'cx cx3' }, C.grid));
      let n = 1;
      return runner(slot, async (S, W) => {
        await W(1800); s = ONE[n++ % ONE.length];
        for (const [i, k] of KEYS.entries()) {
          C.cards[i].classList.add('on'); const T = paint(C.tops[k], k, 0, '>');
          for (let j = 0; j <= T; j += 3) { paint(C.tops[k], k, j, '>'); await S(16); }
          await swap(C.bodies[k], BODY14[k](s), S); paint(C.tops[k], k, 1e3, '//'); await S(160); C.cards[i].classList.remove('on');
        }
        await W(3000);
      });
    },
  });

  /* S15: a thin rail above the cards fills column by column in each product colour, with what each step took */
  DEMOS.register('sec-connect-rail', {
    group: 'sec', pick: 'pick', title: 'Connecting section · command and a progress rail',
    blurb: 'Own take. The right-aligned command, then a hairline rail across the four columns that fills in each product’s colour as the URL reaches it, with the product name and what the step took (96 ms, 140 ms …) under it. The rail replaces the wires: it shows order and time instead of topology. Windows have no title bar at all; the rail labels name them.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); xEnsure();
      let s = ONE[0];
      const cmd = h('div', { class: 'cx-cmd' }); cmdLine(cmd, 'https://' + s.url, 1e3, '//', msOf(s));
      const T = { rich: () => '96 ms', preview: () => '140 ms', data: x => x.data.ms + ' ms', pub: () => 'logged' };
      const rail = KEYS.map(k => h('div', { style: `--m:${PROD[k].main};--f:100%` }, h('i'), h('span', { html: `<b>${PROD[k].name}</b><em style="font-style:normal">${T[k](s)}</em>` })));
      const C = makeCards(s, 'none');
      slot.appendChild(h('div', { class: 'cx cx3' }, cmd, h('div', { class: 'cx-rail' }, ...rail), C.grid));
      let n = 1;
      return runner(slot, async (S, W) => {
        await W(1800); s = ONE[n++ % ONE.length]; const url = 'https://' + s.url;
        rail.forEach(r => { r.style.setProperty('--d', '0s'); r.style.setProperty('--f', '0%'); r.querySelector('em').textContent = ''; });
        await typeCmd(cmd, url, S); await S(200);
        for (const [i, k] of KEYS.entries()) {
          const r = rail[i]; r.style.setProperty('--d', '.45s'); r.style.setProperty('--f', '100%'); C.cards[i].classList.add('on');
          await S(450); r.querySelector('em').textContent = T[k](s); await swap(C.bodies[k], BODY[k](s), S); await S(140); C.cards[i].classList.remove('on');
        }
        cmdLine(cmd, url, url.length, '//', msOf(s));
        await W(3000);
      });
    },
  });

  /* S16: the command moves into the section head, under the intro line, so copy and demo read as one sentence */
  DEMOS.register('sec-connect-head', {
    group: 'sec', title: 'Connecting section · the command under the intro',
    blurb: 'Own take. "Connect once, and every feature comes through the same endpoint." is followed directly by that endpoint in use: the command sits in a soft box under the intro, left-aligned with it, and the four cards below update left to right. Nothing between the heading and the cards, so the section is shorter. Plain title bars, no dots.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); xEnsure();
      let s = ONE[0];
      const cmd = h('div', { class: 'cx-cmd' }); cmdLine(cmd, 'https://' + s.url, 1e3, '//', msOf(s));
      const head = slot.parentElement.querySelector('.sx-head > div:last-child'); head.appendChild(cmd);
      const C = makeCards(s, 'title');
      slot.appendChild(h('div', { class: 'cx cx3' }, C.grid));
      let n = 1;
      return runner(slot, async (S, W) => {
        await W(1800); s = ONE[n++ % ONE.length]; const url = 'https://' + s.url;
        await typeCmd(cmd, url, S); await S(250); await wave4(C, s, S);
        cmdLine(cmd, url, url.length, '//', msOf(s)); await W(3000);
      });
    },
  });

  /* S17: the visitor picks the URL; it cycles on its own until the first click */
  DEMOS.register('sec-connect-pick', {
    group: 'sec', title: 'Connecting section · pick a URL',
    blurb: 'Own take, interactive. Next to the right-aligned command, three sample links as chips (Wikipedia, SoundCloud, YouTube). It cycles through them on its own; click a chip and it stops cycling and runs that URL through the four cards. A small step towards the /try page without leaving the home page.',
    mount(stage) {
      const slot = section(stage, Object.assign({ layout: 'large' }, SECT)); xEnsure();
      let s = ONE[0], manual = false, busy = false;
      const cmd = h('div', { class: 'cx-cmd' }); cmdLine(cmd, 'https://' + s.url, 1e3, '//', msOf(s));
      const chips = ONE.map((o, i) => h('button', { type: 'button', class: i ? '' : 'on', html: `${fav(o.fav)}${o.site}` }));
      const C = makeCards(s, 'title');
      slot.appendChild(h('div', { class: 'cx cx3' }, h('div', { class: 'cx-pick' }, h('div', { class: 'cx-chips' }, ...chips), cmd), C.grid));
      const play = async (o, S) => { if (busy) return; busy = true; s = o; chips.forEach((c, j) => c.classList.toggle('on', ONE[j] === o)); const url = 'https://' + o.url;
        await typeCmd(cmd, url, S); await S(250); await wave4(C, o, S); cmdLine(cmd, url, url.length, '//', msOf(o)); busy = false; };
      let n = 1, Sx = null;
      chips.forEach((c, i) => c.addEventListener('click', () => { manual = true; if (Sx) play(ONE[i], Sx); }));
      return runner(slot, async (S, W) => {
        Sx = S; await W(1800);
        if (manual) return;
        await play(ONE[n++ % ONE.length], S); await W(1800);
      });
    },
  });

  /* ── S18 / S19 · S15 with labels that say what each product made of the URL, instead of how long it took:
     Rich Media the media type, Preview API the metadata it found, Data API the declared mode and use, the Console the
     verdict the publisher's settings gave. Same order as ONE. ── */
  const SAYS = [
    { rich: 'summary card', preview: 'og · JSON-LD Article', data: 'assist · reference', pub: 'full text allowed' },
    { rich: 'audio player', preview: 'oEmbed · og · MusicRecording', data: 'search · reference', pub: 'excerpt only' },
    { rich: 'video player · 16:9', preview: 'oEmbed · og · VideoObject', data: 'ai-input · immediate', pub: 'metadata only' },
  ];
  const KEYWORD = { rich: 'type', preview: 'found', data: 'mode', pub: 'verdict' };
  const R_CSS = `
.cx-rail2 span{display:grid;grid-template-columns:auto 1fr;align-items:baseline;gap:6px 10px;min-width:0}
.cx-rail2 span b{white-space:nowrap}
.cx-rail2 span em{grid-column:1/-1;font-style:normal;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .3s}
.cx-rail2 span em.off{opacity:0}
.cx-cmd.left{justify-content:flex-start}
.cx-rail5 span{justify-content:flex-start}
.cx-rail5 span em{color:var(--mut)}
.cx-lean .cx-body{height:196px;justify-content:center}
.cx-lean .cx-term{font-size:12.5px}
.cx-lean .cx-term div{white-space:normal}
.cx-lean .cx-term{line-height:1.6}
.cx-lean .cx-term .md-h{margin-top:6px}
.cx-lean .cx-term div+div:not(.md-h){margin-top:2px}
.cx-rail4 span{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.cx-rail4 span em{color:var(--g);min-width:0}
.cx-rail3 span small{font:11px 'Geist Mono',ui-monospace,monospace;color:var(--g);justify-self:end}
.cx-rail3 span em{justify-self:start;max-width:100%;font:500 12.5px Geist,Inter,sans-serif;color:var(--m);background:var(--t);border-radius:6px;padding:3px 9px}
`;
  const railScene = (stage, chip, o = {}) => { /* o.inline: name left, value right on one line; o.left: command on the left; o.says: values */
    ensure(); const slot = o.slot || section(stage, Object.assign({ layout: 'large' }, SECT)); xEnsure(); /* o.slot: mount the band without the section head */
    if (!document.getElementById('css-cx5')) document.head.appendChild(h('style', { id: 'css-cx5' }, R_CSS));
    const SAMPLES = o.samples || ONE; let n0 = 0, s = SAMPLES[0];
    const cmd = h('div', { class: 'cx-cmd' }); cmdLine(cmd, 'https://' + s.url, 1e3, '//', msOf(s));
    const SY = o.says || SAYS;
    const label = (k, i) => o.valueOnly ? `<em>${SY[i][k]}</em>` : chip ? `<b>${PROD[k].name}</b><small>${KEYWORD[k]}</small><em>${SY[i][k]}</em>` : `<b>${PROD[k].name}</b><em>${SY[i][k]}</em>`;
    if (o.left) cmd.classList.add('left');
    const rail = KEYS.map(k => h('div', { style: `--m:${PROD[k].main};--t:${PROD[k].tint};--f:100%` }, h('i'), h('span', { html: label(k, 0) })));
    const BD = o.body || BODY, C = makeCards(s, 'none', BD, o.copy);
    const FX = o.fx || {}; /* o.fx: another progress display (S32–S37): cls on the root, and mount / reset / start / answer / end hooks */
    const railEl = h('div', { class: 'cx-rail cx-rail2' + (chip ? ' cx-rail3' : '') + (o.inline ? ' cx-rail4' : '') + (o.valueOnly ? ' cx-rail5' : '') }, ...rail);
    slot.appendChild(h('div', { class: 'cx cx3' + (o.body ? ' cx-lean' : '') + (o.top ? ' cx-ta' : '') + (FX.cls ? ' ' + FX.cls : '') }, cmd, railEl, C.grid));
    if (FX.mount) FX.mount(slot, railEl, rail, C.cards);
    return runner(slot, async (S, W) => {
      await W(1800); n0 = (n0 + 1) % SAMPLES.length; s = SAMPLES[n0]; const url = 'https://' + s.url;
      rail.forEach(r => { r.style.setProperty('--d', '0s'); r.style.setProperty('--f', '0%'); r.querySelector('em').classList.add('off'); });
      if (FX.reset) FX.reset(rail, C.cards);
      await typeCmd(cmd, url, S); await S(200);
      for (const [i, k] of KEYS.entries()) {
        const r = rail[i]; r.style.setProperty('--d', '.45s'); r.style.setProperty('--f', '100%'); C.cards[i].classList.add('on'); if (FX.start) FX.start(i, r, C.cards[i]);
        await S(450); r.querySelector('span').innerHTML = label(k, n0); if (FX.answer) FX.answer(i, r, C.cards[i]);
        if (o.update && o.update[k]) await o.update[k](C.bodies[k], s, S); else await swap(C.bodies[k], BD[k](s), S); await S(140); C.cards[i].classList.remove('on'); if (FX.end) FX.end(i, r, C.cards[i]);
      }
      cmdLine(cmd, url, url.length, '//', msOf(s));
      if (o.done) o.done(); /* o.done: called when the last window has its answer (S29 swaps the logos then) */
      await W(3000);
    });
  };
  DEMOS.register('sec-connect-rail-says', {
    group: 'sec', title: 'Connecting section · rail labels say what each product made of it',
    blurb: 'S15 with the new palette (Rich Media blue, Preview API orchid, Data API violet, Publisher Console green) and labels that carry meaning instead of milliseconds: the media type Rich Media returned (summary card, audio player, video player · 16:9), the metadata the Preview API found (oEmbed, og, the schema.org type), the mode and use the Data API declared (assist · reference, search · reference, ai-input · immediate) and the verdict the publisher’s settings gave (full text allowed, excerpt only, metadata only). Command right-aligned above the rail.',
    mount: stage => railScene(stage, false),
  });
  DEMOS.register('sec-connect-rail-chips', {
    group: 'sec', title: 'Connecting section · rail labels as keyed chips',
    blurb: 'The same as S18, with each value set as a chip in the product’s tint after a small key (type, found, mode, verdict), so the four columns read as one record of the URL. Slightly louder; the chips also echo the badges on the product sections further down.',
    mount: stage => railScene(stage, true),
  });
  /* S20: values short enough to sit on one line with the product name */
  const SAYS2 = [
    { rich: 'summary card', preview: 'og · Article', data: 'assist · reference', pub: 'full text allowed' },
    { rich: 'audio player', preview: 'oEmbed · MusicRecording', data: 'search · reference', pub: 'excerpt only' },
    { rich: 'video · 16:9', preview: 'oEmbed · VideoObject', data: 'ai-input · immediate', pub: 'metadata only' },
  ];
  DEMOS.register('sec-connect-rail-inline', {
    group: 'sec', title: 'Connecting section · rail values in line, command on the left',
    blurb: 'S19 iterated: the command on the left, palette in hue order (Rich Media blue, Preview API violet, Data API orchid, Publisher Console green), and no chips: each rail label is the product name on the left and the actual value on the right in grey mono, where S15 had the time (audio player · oEmbed · MusicRecording · search · reference · excerpt only).',
    mount: stage => railScene(stage, false, { inline: true, left: true, says: SAYS2 }),
  });
  /* S21: each window shows only what its product made. The URL and status live in the command line, the labels in the
     rail; no captions repeat them. */
  const pathOf = x => x.url.slice(x.url.indexOf('/'));
  /* Markdown under the title, as much as each URL's verdict allows: full text, an excerpt, metadata only */
  const MD = [
    ['Kerala is a state on the Malabar Coast of India, formed in 1956.', '## Geography', 'Backwaters, lagoons and 590 km of coast …'],
    ['Bonobo · Migration (2017) · Ninja Tune', 'A downtempo track built on layered vocal samples, harp and brass …'],
    ['- channel: Slow Travels', '- duration: 12:08', '- thumbnail: 1280 × 720', '- player: 16:9, embeddable'],
  ];
  const BODY21 = {
    rich: s => `<div class="cx-pl cx-${s.rich.kind}" style="--th:${s.th}">${s.rich.kind === 'audio' ? `<div class="w">${wave(30)}</div>` : s.rich.kind === 'sum' ? `<div class="c"><b>${s.preview.title}</b><span>${s.preview.desc}</span></div>` : '<em></em>'}</div><div class="cx-code">&lt;iframe src="//cdn.iframe.ly/${s.rich.id}"&gt;</div>`,
    preview: s => `<div class="cx-msg"><i class="av" style="background:${s.th}"></i><div><small>${s.preview.who}</small><p>${s.preview.say}</p><div class="cx-unf"><div><div class="s">${fav(s.fav)}${s.site}</div><b>${s.preview.title}</b><span>${s.preview.desc}</span></div><i style="background:${s.th}"></i></div></div></div>`,
    data: s => `<div class="cx-term"><div>${s.data.h}</div>${MD[ONE.indexOf(s)].map(l => l.startsWith('#') ? `<div class="md-h">${l}</div>` : `<div class="g">${l}</div>`).join('')}</div>`,
    pub: s => `<div class="cx-con"><div class="h"><b class="mono" style="font-weight:500">${pathOf(s)}</b><span>3 requests</span></div>${[['preview', APP.rich, 'embed'], ['preview', APP.preview, 'card'], ['processing', APP.data, s.got]].map(([a, b, c]) => `<div class="r"><span>${a}</span><span>${b}</span><span class="v">${c}</span></div>`).join('')}</div>`,
  };
  DEMOS.register('sec-connect-rail-lean', {
    group: 'sec', title: 'Connecting section · S20 with each fact said once',
    blurb: 'S20 with the repetition cut. The URL and 200 · ms appear only in the command line; the rail carries each product’s label (type, metadata found, mode, verdict). The windows show only output: Rich Media the player and its iframe line (no provider caption); Preview API the chat message without the link text, then the unfurled card, the only place the source is named; Data API just the Markdown (no command, status or access line); Publisher Console the page path and the three requests from the other three boxes (no policy line, the rail gives the verdict).',
    mount: stage => railScene(stage, false, { inline: true, left: true, says: SAYS2, body: BODY21 }),
  });
  /* S22: the product name appears once per column (the card heading); the rail carries only the value; each card
     links to its product page with the link text the home page uses for it */
  const PAGE = { rich: ['Explore embeds', '/embeds'], preview: ['Explore link previews', '/preview-api'], data: ['Explore URL data', '/data-api'], pub: ['Explore publisher controls', '/publishers'] }; /* say what is behind the link without repeating the heading */
  const copyEl22 = k => h('div', { class: 'cx-copy', style: `--m:${PROD[k].main};--t:${PROD[k].tint}` }, tagEl(k), h('h3', null, CARDS[k][1]), h('p', null, CARDS[k][2]), h('a', { href: PAGE[k][1] }, PAGE[k][0] + ' →'));
  DEMOS.register('sec-connect-rail-once', {
    group: 'sec', title: 'Connecting section · one name per column, links to the product pages',
    blurb: 'S21 with the product name said once per column: the rail above each window keeps only its value (audio player, oEmbed · MusicRecording, search · reference, excerpt only) and the card heading below names the product. Each link goes to that product’s page and says what is there without repeating the heading: Explore embeds (/embeds), Explore link previews (/preview-api), Explore URL data (/data-api), Explore publisher controls (/publishers).',
    mount: stage => railScene(stage, false, { inline: true, left: true, says: SAYS2, body: BODY21, valueOnly: true, copy: copyEl22 }),
  });
  /* S23: S21's structure with real media. Thumbnails, artwork and favicons are the ones Iframely returns for these URLs
     (fetched 2026-10-29); the YouTube sample is a real video, since the made-up Kerala one would not resolve. Box content
     sits at the top; the Data API box types its Markdown in (no caret) and fades out at the bottom. */
  const IMG = {
    wiki: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Boathouse_%287063399547%29.jpg/1280px-Boathouse_%287063399547%29.jpg',
    sc: 'https://i1.sndcdn.com/artworks-nd5do3eR82sw-0-t500x500.jpg',
    yt: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  };
  const YT_PLAY = '<svg class="yt" viewBox="0 0 68 48" aria-hidden="true"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/><path d="M45 24 27 14v20" fill="#fff"/></svg>';
  const ONE23 = [
    Object.assign({}, ONE[0], { img: IMG.wiki, pc: { rule: '/wiki/*', mode: 'Assist', allow: ['Meta', 'Links', 'Entities', 'Excerpt', 'Fulltext'], calls: 164, hits: 33, seed: 1 }, md: ['Kerala is a state on the Malabar Coast of southern India, formed on 1 November 1956.', '## Geography', 'A strip of coastal plains between the Western Ghats and the Laccadive Sea …'] }),
    Object.assign({}, ONE[1], { img: IMG.sc, pc: { rule: '/bonobo/*', mode: 'Search', allow: ['Meta', 'Links', 'Entities', 'Excerpt'], calls: 87, hits: 21, seed: 4 }, md: ['The first single from Migration, released 13 January 2017 on Ninja Tune.', 'Bonobo · Migration (2017) …'] }),
    Object.assign({}, ONE[2], { url: 'youtube.com/watch?v=dQw4w9WgXcQ', img: IMG.yt, pc: { rule: '/watch', mode: 'AI-Input', allow: ['Meta', 'Links'], calls: 412, hits: 96, seed: 7 },
      preview: { who: 'Dev', say: 'for the end credits', title: 'Rick Astley - Never Gonna Give You Up (Official Video)', desc: 'Rick Astley · 3:34' },
      data: Object.assign({}, ONE[2].data, { h: '# Never Gonna Give You Up' }),
      md: ['- channel: Rick Astley', '- published: 2009-10-25', '- duration: 3:34', '- thumbnail: 1280 × 720', '- player: 16:9, embeddable'] }),
    /* a refusal: a training request the publisher's Console says no to. The publisher is made up (example.com) so no
       real site is shown with a policy it never set; the photo is Wikimedia Commons' Munnar_Overview.jpg */
    { url: 'travel.example.com/kerala/munnar-tea-trail', domain: 'travel.example.com', fav: 'travel', site: 'Travel Weekly', th: 'linear-gradient(135deg,#c6ecd8,#3c8d5a)',
      img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/1280px-Munnar_Overview.jpg',
      rich: { kind: 'sum', type: 'summary card', id: 't8Mn2?card=small' }, preview: { who: 'Leo', say: 'weekend plan?', title: 'Munnar: a slow walk through the tea hills', desc: 'Three days on foot between estates, 1,600 m up in the Western Ghats.' },
      data: { ms: 198, h: '# No content returned' }, md: ['access.decision: denied', 'mode ai-train · use full', 'decided by the Publisher Console', 'for /kerala/*'],
      got: 'denied', pc: { rule: '/kerala/*', mode: 'AI-Train', allow: [], calls: 58, hits: 0, seed: 9 } },
  ];
  /* the SoundCloud widget as it embeds: artwork left; orange play button, artist and title; the cloud mark top right;
     a two-tone waveform (played part orange, with the lighter reflection under the baseline) and the duration */
  const scBars = n => Array.from({ length: n }, (_, i) => { const v = Math.round(28 + 66 * Math.abs(Math.sin(i * 1.3) * Math.cos(i * .37) + .25 * Math.sin(i * .21))); return `<u class="${i < n * .36 ? 'p' : ''}" style="--v:${Math.min(100, v)}%"></u>`; }).join('');
  const SC_CLOUD = '<svg class="cl" viewBox="0 0 32 14" aria-hidden="true"><path fill="#f50" d="M27.6 5.6a4.2 4.2 0 0 0-1.2.2A6.3 6.3 0 0 0 16 3.1v10.7h11.6a4.1 4.1 0 0 0 0-8.2zM14.5 4v9.8h.9V3.5l-.9.5zm-1.9 1.1v8.7h.9V4.8zm-1.8.3v8.4h.9V5.2zm-1.8.6v7.8H10V5.6zM7.2 6.9v6.9h.9V6.7zm-1.8.2v6.7h.9V7zm-1.8 1v5.7h.9V8zm-1.8.9v4.8h.9V8.8zM0 10.4v2.4c0 .5.3.9.8 1h.1V9.4a1.7 1.7 0 0 0-.9 1z"/></svg>';
  const SC_PLAYER = s => `<div class="cx-pl x-sc"><i class="art" style="background-image:url('${s.img}')"></i><div class="r"><div class="top"><b class="play"></b><div class="who"><small>bonobo</small><span>Kerala</span></div>${SC_CLOUD}</div><div class="wf"><div class="bars">${scBars(40)}</div><em>4:42</em></div></div></div>`;
  /* generated avatars for the chat (DiceBear "Notionists", CC0), one pastel background per person */
  const AV_BG = { Ana: 'c0aede', Maya: 'ffd5dc', Dev: 'b6e3f4', Leo: 'ffdfbf', Jo: 'ffe9a8' };
  const avatar = who => `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(who)}&backgroundColor=${AV_BG[who] || 'd1d4f9'}`;
  /* Publisher Console box: the domain first; its last hour (calls grey, hits blue, as on the app's Analytics page);
     then the access decision for this URL's mode, with a shield icon, and what went out: the five content types as
     layers that get deeper from metadata to full text, filled when sent, dashed when withheld */
  const TYPES = [['Meta', 6], ['Links', 8], ['Entities', 10], ['Excerpt', 12], ['Fulltext', 14]];
  const SHIELD = 'M8 1.4 13.6 3.4v4.3c0 3.2-2.4 5.7-5.6 6.9-3.2-1.2-5.6-3.7-5.6-6.9V3.4z';
  const DECIDE = {
    all: ['Allowed', `<svg viewBox="0 0 16 16"><path d="${SHIELD}" fill="#007a45"/><path d="m5.4 8.1 1.8 1.8 3.5-3.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`],
    part: ['Partly allowed', `<svg viewBox="0 0 16 16"><path d="${SHIELD}" fill="#e2f6ec" stroke="#007a45" stroke-width="1.3"/><path d="M5.4 8h5.2" stroke="#007a45" stroke-width="1.6" stroke-linecap="round"/></svg>`],
    none: ['Denied', `<svg viewBox="0 0 16 16"><path d="${SHIELD}" fill="#171717"/><path d="m6 6 4 4M10 6l-4 4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`],
  };
  const PC23 = s => { const p = s.pc, n = p.allow.length, d = DECIDE[n === 5 ? 'all' : n ? 'part' : 'none'];
    const bars = Array.from({ length: 30 }, (_, i) => { const c = 1 + Math.round(3 * Math.abs(Math.sin((i + p.seed) * 1.7) * Math.cos((i + p.seed) * .6))), hit = p.hits && (i * 7 + p.seed) % 3 === 0 ? Math.max(1, c - 1) : 0;
      return `<i style="--c:${c * 22}%;--h:${hit * 22}%"></i>`; }).join('') + `<i class="now" style="--c:88%;--h:${p.hits ? 66 : 0}%"></i>`;
    const out = n === 5 ? 'full text' : n ? `up to ${p.allow[n - 1].toLowerCase()}` : 'nothing sent';
    /* access first (rule, decision, layers), then the traffic chart under a dashed line (swapped 2026-10-30) */
    return `<div class="x-pc"><div class="h"><b>${s.domain}</b><span>last hour</span></div>`
      + `<div class="ru"><code>${p.rule}</code><span>${p.mode}</span></div>`
      + `<div class="dc ${n ? '' : 'no'}">${d[1]}<b>${d[0]}</b><span>${out}</span></div>`
      + `<div class="lv">${TYPES.map(([t, hgt]) => `<div class="${p.allow.includes(t) ? 'on' : ''}"><i style="height:${hgt}px"></i><span>${t}</span></div>`).join('')}</div>`
      + `<div class="cg"><div class="ch">${bars}</div><div class="st"><span><b>${p.calls}</b> calls</span><span><b>${p.hits}</b> hits</span></div></div></div>`; };
  const BODY23 = {
    rich: s => `${s.rich.kind === 'video' ? `<div class="cx-pl x-yt" style="background-image:url('${s.img}')">${YT_PLAY}</div>`
      : s.rich.kind === 'audio' ? SC_PLAYER(s)
      : `<div class="cx-pl x-sum"><i style="background-image:url('${s.img}')"></i><div class="c"><b>${s.preview.title}</b><span>${s.preview.desc}</span></div></div>`}<div class="cx-code">&lt;iframe src="//cdn.iframe.ly/${s.rich.id}"&gt;</div>`,
    preview: s => BODY21.preview(s).replace(/<i style="background:[^"]*"><\/i><\/div><\/div><\/div>$/, `<i style="background:center/cover url('${s.img}')"></i></div></div></div>`)
      .replace(/<i class="av" style="background:[^"]*"><\/i>/, `<img class="av" alt="" src="${avatar(s.preview.who)}">`),
    data: () => '<div class="cx-term"></div>',
    pub: s => PC23(s),
  };
  const X23_CSS = `
.cx-lean.cx-ta .cx-body{justify-content:flex-start}
.x-yt{background:#000 center/cover no-repeat;display:grid;place-items:center}
.x-yt .yt{width:52px;height:37px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.3))}
.x-sc{background:#fff;border:1px solid #e5e5e5;border-radius:4px;display:grid;grid-template-columns:34% minmax(0,1fr);font-family:'Interstate','Lucida Grande',Geist,Arial,sans-serif}
.x-sc .art{background:center/cover no-repeat}
.x-sc .r{min-width:0;display:flex;flex-direction:column;padding:7px 8px 6px 8px}
.x-sc .top{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:6px;align-items:start}
.x-sc .play{width:24px;height:24px;border-radius:50%;background:#f50;display:grid;place-items:center}
.x-sc .play::after{content:"";border-left:8px solid #fff;border-top:5px solid transparent;border-bottom:5px solid transparent;margin-left:2px}
.x-sc .who{min-width:0;line-height:1.15}
.x-sc .who small{display:block;font-size:9.5px;color:#999}
.x-sc .who span{display:block;font-size:11px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x-sc .cl{width:20px;height:9px;margin-top:2px}
.x-sc .wf{position:relative;flex:1;display:flex;align-items:flex-end;margin-top:6px}
.x-sc .bars{flex:1;height:100%;display:flex;gap:1px;align-items:stretch}
.x-sc .bars u{flex:1;position:relative;background:none}
.x-sc .bars u::before{content:"";position:absolute;left:0;right:0;bottom:30%;height:calc(var(--v) * .7);background:#ccc}
.x-sc .bars u::after{content:"";position:absolute;left:0;right:0;top:70%;height:calc(var(--v) * .3);background:#e5e5e5}
.x-sc .bars u.p::before{background:#f50}
.x-sc .bars u.p::after{background:#ffbf99}
.x-sc .wf em{position:absolute;right:0;bottom:calc(30% + 2px);font:9px/1 Geist,Arial,sans-serif;font-style:normal;color:#ccc;background:#111;padding:2px 3px}
.x-sum{background:#fff;border:1px solid var(--line);display:grid;grid-template-columns:42% minmax(0,1fr)}
.x-sum i{background:center/cover no-repeat}
.x-sum .c{padding:9px 10px;display:flex;flex-direction:column;gap:3px;min-width:0}
.x-sum b{font-size:12.5px;font-weight:600}
.x-sum span{font-size:11px;line-height:1.35;color:var(--mut);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.cx-ta .cx-term .md-h{margin-top:6px}
.x-pc{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--mut)}
.x-pc .h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.x-pc .h b{font-weight:600;color:var(--ink);font-size:13px}
.x-pc .h span{font-size:11px;color:var(--g)}
.x-pc .ch{height:24px;display:flex;align-items:flex-end;gap:2px;border-bottom:1px solid var(--line)}
.x-pc .ch i{flex:1;height:var(--c);background:#e7e7e7;position:relative}
.x-pc .ch i::after{content:"";position:absolute;left:0;right:0;bottom:0;height:var(--h);background:#0055ff}
.x-pc .ch i.now{background:#d5d5d5}
.x-pc .st{display:flex;gap:14px;font:11px 'Geist Mono',ui-monospace,monospace;color:var(--g)}
.x-pc .st b{font-weight:500;color:var(--ink)}
.x-pc .ru{display:flex;justify-content:space-between;align-items:baseline;margin-top:4px}
.x-pc .cg{display:flex;flex-direction:column;gap:6px;margin-top:4px;padding-top:10px;border-top:1px dashed var(--line)}
.x-pc .ru code{font:11.5px 'Geist Mono',ui-monospace,monospace;color:var(--ink)}
.x-pc .ru span{font-size:11.5px;color:var(--ink);font-weight:500}
.x-pc .dc{display:flex;align-items:center;gap:6px;white-space:nowrap;min-width:0}
.x-pc .dc svg{width:16px;height:16px;flex:none}
.x-pc .dc b{font-weight:600;color:var(--ink)}
.x-pc .dc span{color:var(--g);font-size:11.5px;overflow:hidden;text-overflow:ellipsis}
.x-pc .lv{display:flex;gap:4px;align-items:flex-end}
.x-pc .lv div{flex:1 1 auto;display:flex;flex-direction:column;gap:4px} /* each column as wide as its label */
.x-pc .lv i{display:block;border-radius:2px;border:1px dashed #d5d5d5;box-sizing:border-box}
.x-pc .lv .on i{background:var(--g2);border:0} /* layers sent, in a light neutral grey rather than the product colour (2026-10-30) */
.x-pc .lv span{font:10px Geist,Inter,sans-serif;letter-spacing:-.01em;color:var(--g2);white-space:nowrap}
.x-pc .lv .on span{color:var(--ink)}
.cx-ta img.av{width:28px;height:28px;border-radius:50%;display:block}
.cx-ta .cx-msg{grid-template-columns:28px minmax(0,1fr)}
.cx-ta .cx-body:has(.cx-term){overflow:hidden;-webkit-mask-image:linear-gradient(#000 62%,transparent 96%);mask-image:linear-gradient(#000 62%,transparent 96%)} /* long Markdown fades out at the bottom */
`;
  /* the Data API box types its response in, line by line, with a caret */
  const typeData = async (body, s, S) => {
    body.innerHTML = '<div class="cx-term"></div>'; const t = body.firstChild, lines = [s.data.h, ...s.md], done = [];
    const row = l => l.startsWith('#') ? `<div class="${l.startsWith('##') ? 'md-h' : ''}">${l}</div>` : `<div class="g">${l}</div>`;
    for (const l of lines) { for (let i = 0; i <= l.length; i += 3) { t.innerHTML = done.join('') + row(l.slice(0, i)); await S(14); } done.push(row(l)); }
    t.innerHTML = done.join('');
  };
  const SAYS23 = SAYS2.map((x, i) => i === 2 ? Object.assign({}, x, { rich: 'video · 16:9' }) : x).concat([{ rich: 'summary card', preview: 'og · Article', data: 'ai-train · full', pub: 'no access' }]);
  /* the S23 band (command, rail, four windows, card copy); extra.slot mounts it into a given element without the head */
  const band23 = (stage, extra = {}) => {
    if (!document.getElementById('css-x23')) document.head.appendChild(h('style', { id: 'css-x23' }, X23_CSS));
    const un = railScene(stage, false, Object.assign({ inline: true, left: true, says: SAYS23, body: BODY23, samples: ONE23, top: true, update: { data: typeData } }, extra));
    const first = (extra.slot || stage).querySelectorAll('.cx-body')[2]; if (first) { const l = [ONE23[0].data.h, ...ONE23[0].md]; first.firstChild.innerHTML = l.map(x => x.startsWith('#') ? `<div class="${x.startsWith('##') ? 'md-h' : ''}">${x}</div>` : `<div class="g">${x}</div>`).join(''); }
    return un;
  };
  DEMOS.register('sec-connect-rail-media', {
    group: 'sec', pick: 'pick', title: 'Connecting section · S21 with real media, typed Markdown',
    blurb: 'S21 kept as the structure. Real images: the Wikipedia article image in the summary card, the SoundCloud artwork beside the waveform, the YouTube thumbnail with YouTube’s own play button; the same images on the unfurled cards; favicons are the sites’ own. The YouTube sample is now a real video (Rick Astley), since the made-up Kerala one would not resolve. Box content is aligned to the top. The Data API box types its Markdown in, line by line, with a caret, and the amount follows the verdict (full text, excerpt, metadata list).',
    mount: stage => band23(stage),
  });

  /* ── S24–S27 · the home page top: the current hero (nav, heading, copy, two buttons), the trust logos and the S23
     band mixed in different orders, without S23's own section head. Logos are set as plain wordmarks in Geist, not
     the brands' artwork. ── */
  const LOGOS = [['Notion', 'n'], ['ATLASSIAN', 'at'], ['Canva', 'cv'], ['Bloomberg', 'bb'], ['Linear', 'ln'], ['Trello', 'tr'], ['NBC NEWS', 'nbc'], ['substack', 'sb'], ['Gumroad', 'gr'], ['GITBOOK', 'gb'], ['Vox', 'vx'], ['engadget', 'eg']];
  const HX_CSS = `
.hx{padding-top:36px}
.hx-nav{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:28px;height:84px;font-size:15px;color:var(--ink);white-space:nowrap}
.hx-nav .lg{font:800 21px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:-.03em;margin-right:18px;flex:none}
.hx-nav .lg em{font-style:normal;color:#0055ff;letter-spacing:-.12em;margin-right:3px}
.hx-nav .lg span{font-weight:700}
.hx-nav .it{display:inline-flex;align-items:center;gap:5px;line-height:1}
.hx-nav .it svg{width:10px;height:10px;color:var(--g);flex:none}
.hx-nav .sp{margin-left:auto}
.hx-nav .st{display:inline-flex;align-items:center;height:38px;background:var(--ink);color:#fff;border-radius:19px;padding:0 18px;margin-left:-8px}
@container (max-width:900px){.hx-nav{gap:20px}.hx-nav .opt{display:none}}
@container (max-width:620px){.hx-nav .it:not(.sp){display:none}.hx-nav .st{margin-left:0}}
.hx-hero{padding:72px 0 56px}
.sx.hx h1{font-family:Geist,Inter,ui-sans-serif,system-ui,sans-serif;font-style:normal;font-weight:400;font-size:clamp(44px,5cqw,64px);line-height:1.08;letter-spacing:-.035em;max-width:14ch;margin:0;text-wrap:balance}
.hx-sub{font-size:19px;line-height:1.55;color:var(--mut);max-width:56ch;margin:22px 0 0}
.hx-btns{display:flex;gap:12px;margin-top:32px;flex-wrap:wrap}
.hx-btns a{height:46px;display:inline-flex;align-items:center;padding:0 24px;border-radius:23px;font-size:16px;text-decoration:none;color:var(--ink);border:1px solid var(--line);background:#fff}
.hx-btns a.p{background:var(--ink);border-color:var(--ink);color:#fff}
.hx-two{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:56px;align-items:end}
.hx-two .hx-sub{margin-top:0}
.hx-tl{font-size:15px;color:var(--g);margin:0 0 18px}
.hx-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden}
.hx-grid div{height:74px;display:grid;place-items:center;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.hx-grid div:nth-child(6n){border-right:0}
.hx-grid div:nth-last-child(-n+6){border-bottom:0}
.hx-grid.one div{height:64px;border-bottom:0}
.hx-wm{font:600 21px Geist,Inter,sans-serif;color:#363636;letter-spacing:-.02em;white-space:nowrap}
.hx-wm.at,.hx-wm.gb,.hx-wm.nbc{font-size:16px;letter-spacing:.06em;font-weight:700}
.hx-wm.cv{font:italic 600 26px Georgia,serif;letter-spacing:-.02em}
.hx-wm.vx{font:italic 800 26px Georgia,serif}
.hx-wm.sb{font-weight:500;font-size:22px}
.hx-wm.eg{font-weight:400;font-size:21px}
.hx-wm.gr{font-weight:800;letter-spacing:.01em}
.hx-marq{display:flex;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.hx-marq>div{display:flex;align-items:center;gap:56px;width:max-content;padding-right:56px;animation:sx-drift 60s linear infinite}
.hx-marq:hover>div{animation-play-state:paused}
.hx-marq .hx-wm{font-size:18px;color:var(--mut)}
.hx-band{margin-top:8px}
.hx-gap{height:72px}
.cx-copy .hx-proof{margin:10px 0 0;padding-top:10px;border-top:1px dashed var(--line);font-size:13px;color:var(--g);line-height:1.45}
.cx-copy .hx-proof b{font-weight:500;color:var(--mut)}
.hx-field{display:flex;align-items:center;gap:10px;margin-top:32px;max-width:640px;border:1px solid var(--line);border-radius:28px;background:#fff;padding:5px 5px 5px 20px;box-shadow:0 1px 2px rgba(23,23,23,.04),0 10px 26px rgba(23,23,23,.05)}
.hx-field .cx-cmd{flex:1;margin:0;font-size:14.5px;min-width:0;overflow:hidden}
.hx-field a{flex:none;height:44px;display:inline-flex;align-items:center;padding:0 22px;border-radius:22px;background:var(--ink);color:#fff;font-size:15.5px;text-decoration:none}
.hx-field.clean .cx-cmd>span:first-child,.hx-field.clean .cx-cmd .st{display:none} /* S28: the URL only, no prompt or status */
.hx-band.bare{margin-top:44px}
.hx-band.bare .cx-cmd{font-size:14.5px;line-height:24px;min-height:24px;margin-bottom:16px} /* one line tall even while the URL is empty */
.hx-band.bare .cx-cmd>span:first-child,.hx-band.bare .cx-cmd .st{display:none}
.hx-car div{display:grid;overflow:hidden}
.hx-car div>span{grid-area:1/1;display:grid;place-items:center;opacity:0}
.hx-car div>span.cur{opacity:1}
.hx-car div>span.in{animation:hx-in .6s ease var(--d) both}
.hx-car div>span.out{animation:hx-out .6s ease var(--d) both}
@keyframes hx-in{0%{transform:translateY(40px);filter:blur(4px);opacity:0}100%{transform:none;filter:none;opacity:1}}
@keyframes hx-out{0%{transform:none;filter:none;opacity:1}100%{transform:translateY(-40px);filter:blur(4px);opacity:0}}
.cardy .cx-card{background:#f6f6f6;border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:border-color .3s,box-shadow .3s} /* S30: window and copy in one card */
.cardy .cx-card .sx-win{border:0;border-bottom:1px solid var(--line);border-radius:0;box-shadow:none}
.cardy .cx-card.on .sx-win,.cardy .cx-card.hot .sx-win{border-color:var(--line);box-shadow:none}
.cardy .cx-card.on,.cardy .cx-card.hot{border-color:var(--m);box-shadow:0 0 0 3px var(--t)}
.cardy .cx-copy{padding:16px 18px 20px}
.hx-trust{border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden}
.hx-trust .hx-grid{border:0;border-radius:0;border-bottom:1px solid var(--line)}
.hx-stats{display:flex;justify-content:center;flex-wrap:wrap;gap:10px 40px;padding:16px 20px;background:var(--soft);font-size:14px;color:var(--mut)}
.hx-stats span{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.hx-stats svg{width:17px;height:17px;color:#007a45;flex:none}
.hx-under{display:flex;gap:16px;align-items:center;margin-top:16px;font-size:14px;color:var(--g)}
.hx-under a{color:var(--ink);text-decoration:none;font-weight:500}
.cx-copy.hx-short p{margin-top:10px;font-size:14.5px}
.cx-copy.hx-short a{margin-top:10px;font-size:14.5px}
@media (prefers-reduced-motion:reduce){.hx-marq>div{animation:none}}
`;
  const HOME_SUB = DEMOS.HERO.text;
  const CHEV = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.75l3 3 3-3"/></svg>';
  const hxNav = () => h('div', { class: 'hx-nav', role: 'navigation', html: `<b class="lg"><em>//</em><span>iframely</span></b><span class="it">Products${CHEV}</span><span class="it">Resources${CHEV}</span><span class="it opt">Domains</span><span class="it opt">Pricing</span><span class="it sp">Log in</span><span class="st">Start free</span>` });
  const hxTitle = () => h('h1', null, 'Iframely makes URLs work inside other products');
  const hxSub = () => h('p', { class: 'hx-sub' }, HOME_SUB);
  const hxBtns = () => h('div', { class: 'hx-btns', html: '<a class="p" href="#">Get API key</a><a href="#">Check URL</a>' });
  const wm = ([t, c]) => `<span class="hx-wm ${c}">${t}</span>`;
  const hxGrid = (one) => h('div', { class: 'hx-grid' + (one ? ' one' : ''), html: (one ? LOGOS.slice(0, 6) : LOGOS).map(l => `<div>${wm(l)}</div>`).join('') });
  const hxMarq = () => { const one = LOGOS.map(wm).join(''); return h('div', { class: 'hx-marq', html: `<div>${one}</div><div>${one}</div>` }); };
  const hxShell = stage => { ensure(); if (!document.getElementById('css-hx')) document.head.appendChild(h('style', { id: 'css-hx' }, HX_CSS)); const root = h('section', { class: 'sx hx' }, hxNav()); stage.appendChild(root); return root; };
  const noCopy = () => null;

  DEMOS.register('sec-hero-stack', {
    group: 'sec', title: 'Home top · hero, then S23, then trust',
    blurb: 'The current hero kept as it is (nav, heading, copy, Get API key / Check URL), then the S23 band straight under it as the hero’s visual, without its own heading and intro, then the trust grid as today. The product cards under the windows double as the product overview, so the page needs no separate products section. Longest of the four.',
    mount(stage) {
      const root = hxShell(stage), band = h('div', { class: 'hx-band' });
      root.append(h('div', { class: 'hx-hero' }, hxTitle(), hxSub(), hxBtns()), band, h('div', { class: 'hx-gap' }), h('p', { class: 'hx-tl' }, 'Trusted by products where real people share URLs'), hxGrid());
      return band23(stage, { slot: band });
    },
  });
  DEMOS.register('sec-hero-trust-first', {
    group: 'sec', title: 'Home top · hero, logos, then the windows',
    blurb: 'Trust moves up into the hero as one drifting row of wordmarks under the buttons (hover pauses), and the S23 windows follow without the card copy: the rail names each product, so the four windows read as a product strip. The hero, its proof and the demo fit in about one and a half screens.',
    mount(stage) {
      const root = hxShell(stage), band = h('div', { class: 'hx-band' });
      root.append(h('div', { class: 'hx-hero' }, hxTitle(), hxSub(), hxBtns()), h('p', { class: 'hx-tl' }, 'Trusted by products where real people share URLs'), hxMarq(), h('div', { class: 'hx-gap' }), band);
      return band23(stage, { slot: band, copy: noCopy });
    },
  });
  /* S26: the proof goes where it is true: under each product, the customers the site already names for it */
  const PROOF = {
    rich: '<b>Canva</b> and thousands of other apps',
    preview: '<b>Atlassian, Notion, GitBook</b> and thousands more',
    data: '<b>SOC 2 Type II</b> · 99.99% uptime',
    pub: 'One policy for <b>6,000+ products</b>',
  };
  const copyProof = k => { const c = copyEl(k); c.insertBefore(h('p', { class: 'hx-proof', html: PROOF[k] }), c.querySelector('a')); return c; };
  DEMOS.register('sec-hero-proof', {
    group: 'sec', title: 'Home top · two-column hero, proof under each product',
    blurb: 'The heading and the copy side by side (shorter hero), the S23 band under it, and the trust split by product: under each card the customers the marketing site already names for it (Canva for Rich Media; Atlassian, Notion and GitBook for the Preview API) or the claim behind it (SOC 2, 6,000+ products). The full logo set stays as a single quiet row at the end.',
    mount(stage) {
      const root = hxShell(stage), band = h('div', { class: 'hx-band' });
      root.append(h('div', { class: 'hx-hero' }, h('div', { class: 'hx-two' }, hxTitle(), h('div', null, hxSub(), hxBtns()))), band, h('div', { class: 'hx-gap' }), h('p', { class: 'hx-tl' }, 'Trusted by products where real people share URLs'), hxGrid(true));
      return band23(stage, { slot: band, copy: copyProof });
    },
  });
  /* S28: the Publisher Console box builds itself in order instead of cross-fading: the last hour grows in, the counts run
     up, the rule that matched slides in and lights up, the shield stamps, the content layers fill one by one from Meta
     (withheld ones stay dashed and dim), then this very request lands in the newest bar and the calls count ticks +1 */
  const PCA_CSS = `
.x-pc.a .ch i{height:0;transition:height .5s cubic-bezier(.2,.8,.2,1) calc(var(--k) * 14ms)}
.x-pc.a .ch i::after{height:0;transition:height .4s ease-out calc(260ms + var(--k) * 14ms)}
.x-pc.a.g1 .ch i{height:var(--c)}
.x-pc.a.g1 .ch i::after{height:var(--h)}
.x-pc.a .ru,.x-pc.a .dc,.x-pc.a .lv span{opacity:0;transform:translateX(-6px);transition:opacity .22s,transform .28s cubic-bezier(.2,.8,.2,1)}
.x-pc.a.g2 .ru,.x-pc.a.g3 .dc,.x-pc.a.g4 .lv span{opacity:1;transform:none}
.x-pc.a .ru code{border-radius:4px;padding:1px 3px;margin:-1px -3px;transition:background .3s}
.x-pc.a.g2 .ru code{background:var(--pub-t,#fdecf5)}
.x-pc.a.g3 .ru code{background:transparent}
.x-pc.a .dc svg{transform:scale(.4) rotate(-12deg);opacity:0;transition:transform .32s cubic-bezier(.3,1.6,.5,1),opacity .15s}
.x-pc.a.g3 .dc svg{transform:none;opacity:1}
.x-pc.a .lv i{transform:scaleY(0);transform-origin:bottom;opacity:0;transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .15s}
.x-pc.a .lv div.in i{transform:none;opacity:1}
.x-pc.a .lv div:not(.on).in i{opacity:.7}
.x-pc.a .ch i.now.ping::after{animation:pca-ping .9s ease-out}
.x-pc.a .st b.tick{animation:pca-tick .6s ease-out}
@keyframes pca-ping{0%{box-shadow:0 0 0 0 rgba(0,85,255,.45)}100%{box-shadow:0 0 0 7px rgba(0,85,255,0)}}
@keyframes pca-tick{0%{color:#0055ff}100%{color:var(--ink)}}
@media (prefers-reduced-motion:reduce){.x-pc.a *{transition:none!important;animation:none!important}}
`;
  const animPC = async (body, s, S) => {
    if (!document.getElementById('css-pca')) document.head.appendChild(h('style', { id: 'css-pca' }, PCA_CSS));
    body.classList.add('fade'); await S(260); body.innerHTML = PC23(s);
    const x = body.firstChild, p = s.pc; x.classList.add('a'); x.querySelectorAll('.ch i').forEach((b, k) => b.style.setProperty('--k', k));
    const [cEl, hEl] = x.querySelectorAll('.st b'); cEl.textContent = hEl.textContent = '0';
    body.classList.remove('fade'); void x.offsetHeight; await S(60); /* commit the empty state so the bars transition */
    /* top to bottom, as laid out since 2026-10-30: rule, decision, layers, then the chart with its counts */
    x.classList.add('g2'); await S(220);
    x.classList.add('g3'); await S(200);
    x.classList.add('g4'); for (const col of x.querySelectorAll('.lv div')) { col.classList.add('in'); await S(45); }
    x.classList.add('g1');
    const t0 = performance.now(), run = async () => { for (;;) { const k = R ? 1 : Math.min(1, (performance.now() - t0) / 550), e = 1 - Math.pow(1 - k, 3);
      cEl.textContent = Math.round(p.calls * e); hEl.textContent = Math.round(p.hits * e); if (k >= 1) break; await S(30); } };
    await run(); if (R) return; /* the counts run while the bars grow */
    await S(260); const now = x.querySelector('.ch i.now'); now.classList.add('ping'); cEl.textContent = p.calls + 1; cEl.classList.add('tick');
    if (p.allow.length) { hEl.textContent = p.hits + 1; hEl.classList.add('tick'); now.style.setProperty('--h', '77%'); }
  };
  /* S27/S28: the command line moved into the hero as its URL field; copy: what goes under each window */
  /* S29: one row of six cells; the twelve logos in two sets of six take turns, after the sv-animations logo carousel
     (each logo leaves upward with a blur and the next rises in from below, 140 ms apart left to right, 600 ms each; the
     swap happens each time the band above finishes a URL). The cells and their borders stay put; hover pauses; reduced motion shows the first six. */
  const hxCarousel = () => h('div', { class: 'hx-grid one hx-car', html: LOGOS.slice(0, 6).map((l, i) => `<div style="--d:${i * 140}ms"><span class="cur">${wm(l)}</span><span>${wm(LOGOS[i + 6])}</span></div>`).join('') });
  const carouselSwap = el => { if (R) return;
    el.querySelectorAll(':scope>div').forEach(c => { const [a, b] = c.querySelectorAll(':scope>span'), cur = a.classList.contains('cur') ? a : b, nx = cur === a ? b : a;
      cur.classList.remove('cur', 'in'); cur.classList.add('out'); nx.classList.remove('out'); nx.classList.add('cur', 'in'); }); };
  /* o.stats: no line under the field; the stats move into the trust box as its bottom strip, with icons */
  const STATS = [
    ['<path d="M2 9h3l2-5 3 9 2-6 1 2h1" />', '6.5 billion requests a month'],
    ['<circle cx="8" cy="8" r="6"/><path d="m5.3 8.2 1.9 1.9 3.6-3.8"/>', '99.99% uptime'],
    [`<path d="${'M8 1.4 13.6 3.4v4.3c0 3.2-2.4 5.7-5.6 6.9-3.2-1.2-5.6-3.7-5.6-6.9V3.4z'}"/><path d="M6 8.2h4"/>`, 'SOC 2 Type II'],
  ];
  const hxStats = () => h('div', { class: 'hx-stats', html: STATS.map(([d, t]) => `<span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>${t}</span>`).join('') });
  const fieldHero = (stage, copy, more = {}, o = {}) => {
    const root = hxShell(stage), band = h('div', { class: 'hx-band' + (o.urlOnly ? ' bare' : '') }), field = o.urlOnly ? null : h('div', { class: 'hx-field' }); /* o.urlOnly: no field or button, the URL stays as a line over the windows */
    const under = o.stats ? null : h('div', { class: 'hx-under', html: '<a href="#">Get API key →</a><span>6.5 billion requests a month · 99.99% uptime · SOC 2 Type II</span>' });
    const logos = o.carousel ? hxCarousel() : hxGrid(true), trust = o.stats ? h('div', { class: 'hx-trust' }, logos, hxStats()) : logos;
    root.append(h('div', { class: 'hx-hero' }, hxTitle(), hxSub(), field, under), band, h('div', { class: 'hx-gap' }), h('p', { class: 'hx-tl' }, 'Trusted by products where real people share URLs'), trust);
    const un = band23(stage, Object.assign({ slot: band, copy }, o.carousel ? { done: () => carouselSwap(logos) } : {}, more));
    if (field) field.append(band.querySelector('.cx-cmd'), h('a', { href: '#' }, 'Check URL'));
    return un;
  };
  DEMOS.register('sec-hero-field', {
    group: 'sec', title: 'Home top · the command line is the hero’s Check URL field',
    blurb: 'The S23 command line moves into the hero as a URL field with the Check URL button inside it: the sample URLs type themselves in the field and the windows below answer, so the hero’s second call to action and the demo are one thing. Get API key stays as a text link under the field. The windows follow without card copy, then one row of six logos.',
    mount: stage => fieldHero(stage, noCopy),
  });
  /* S28: short copy under each window: the rail already names the product, so no heading; tag, one sentence, link */
  const SHORT = {
    rich: 'Embeds for over 1,900 providers, through one API.',
    preview: 'Link previews and cards for any public URL.',
    data: 'Content and permissions for automated systems.',
    pub: 'See who fetches your pages, and set how they are used.',
  };
  const copyShort = k => h('div', { class: 'cx-copy hx-short', style: `--m:${PROD[k].main};--t:${PROD[k].tint}` }, tagEl(k), h('p', null, SHORT[k]), h('a', { href: '#' }, CARDS[k][3] + ' →'));
  DEMOS.register('sec-hero-field-copy', {
    group: 'sec', pick: 'pick', title: 'Home top · S27 with short copy under each window',
    blurb: 'S27 with the product copy put back where the answer is: under each window, the audience tag, one sentence and the link to the product page. No product heading, since the rail above the window already names it. About 120px taller than S27; the hero, the demo and the four products still fit in about one and a half screens, and the copy and links are in the page for everyone (not revealed by the animation). The URL field shows the URL only (no prompt, status or time), with no line under it: the stats (6.5 billion requests a month, 99.99% uptime, SOC 2 Type II) sit with icons as the bottom strip of the trust box. The Publisher Console box builds itself: the last hour grows in, the counts run up, the matched rule slides in and lights green, the shield stamps, the content layers fill one by one, then this request lands in the newest bar and calls tick +1.',
    mount(stage) { const un = fieldHero(stage, copyShort, { update: { data: typeData, pub: animPC } }, { stats: true }); stage.querySelector('.hx-field').classList.add('clean'); return un; },
  });
  DEMOS.register('sec-hero-field-carousel', {
    group: 'sec', title: 'Home top · S28 with the twelve logos taking turns in one row',
    blurb: 'S28 with all twelve logos in the space of one row: two sets of six take turns in the same six cells, after the sv-animations logo carousel (each logo leaves upward with a blur and the next rises in, 140 ms apart from left to right). The swap is tied to the demo: it happens each time the four windows have answered a URL, so the logos change once per URL rather than on their own timer. The cell borders stay still, so only the wordmarks move; hovering the demo pauses both, and with reduced motion the first six stay.',
    mount(stage) { const un = fieldHero(stage, copyShort, { update: { data: typeData, pub: animPC } }, { stats: true, carousel: true }); stage.querySelector('.hx-field').classList.add('clean'); return un; },
  });
  DEMOS.register('sec-hero-field-cards', {
    group: 'sec', title: 'Home top · S29 with window and copy in one card',
    blurb: 'S29 with each product as one card: the window sits flush at the top of the card (no padding around it, a line under it) and the tag, sentence and link below it get the padding, on a slightly darker grey than the page. The active product outlines the whole card in its colour instead of just the window.',
    mount(stage) { const un = fieldHero(stage, copyShort, { update: { data: typeData, pub: animPC } }, { stats: true, carousel: true }); stage.querySelector('.hx-field').classList.add('clean'); stage.querySelector('.hx').classList.add('cardy'); return un; },
  });
  DEMOS.register('sec-hero-field-bare', {
    group: 'sec', title: 'Home top · S29 without the copy under the windows',
    blurb: 'S29 with the product copy dropped completely: no tag, sentence or link under the windows. The rail above each window names the product and its answer, so the four windows carry the section on their own and the logos follow sooner. Same URL field, Console animation and logo carousel.',
    mount(stage) { const un = fieldHero(stage, noCopy, { update: { data: typeData, pub: animPC } }, { stats: true, carousel: true }); stage.querySelector('.hx-field').classList.add('clean'); return un; },
  });
  /* ── S32–S37 · S31 with other ways to show progress than the line over each window. Each is an o.fx for railScene:
     a class on the band and hooks at reset (new URL), start (window i begins), answer (its label is in) and end. ── */
  const TICK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m2.5 6.3 2.3 2.3 4.7-5' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat`;
  const FX_CSS = `
@property --fxa{syntax:'<angle>';inherits:false;initial-value:0deg}
.fxq .cx-rail i{height:1px}
.fxq .cx-rail i::before{display:none}
.fxn .cx-rail i{visibility:hidden}
.fx1 .cx-rail b::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--g2);margin-right:8px;vertical-align:1px;transition:background .25s}
.fx1 .cx-rail .run b::before{background:var(--m);animation:fx-pulse .9s ease-in-out infinite}
.fx1 .cx-rail .done b::before{background:var(--m)}
@keyframes fx-pulse{0%,100%{box-shadow:0 0 0 0 var(--t);transform:scale(1)}50%{box-shadow:0 0 0 5px var(--t);transform:scale(1.15)}}
.fx2 .cx-rail b::before{content:"";display:inline-block;box-sizing:border-box;width:11px;height:11px;border-radius:50%;border:1.5px solid var(--line);margin-right:8px;vertical-align:-1px}
.fx2 .cx-rail .run b::before{border-top-color:var(--m);animation:fx-spin .7s linear infinite}
.fx2 .cx-rail .done b::before{border:0;background:var(--m);-webkit-mask:${TICK};mask:${TICK}}
@keyframes fx-spin{to{transform:rotate(360deg)}}
.fx3 .cx-rail em.off{opacity:1;visibility:hidden}
.fx3 .cx-rail .typing em{color:var(--m)}
.fx3 .cx-rail .typing em::after{content:"";display:inline-block;width:1.5px;height:12px;margin-left:2px;vertical-align:-2px;background:var(--m);animation:fx-blink 1s steps(1) infinite}
@keyframes fx-blink{50%{opacity:0}}
.fx4 .cx-rail i{display:none}
.fx4.cx3 .cx-card.on .sx-win{border-color:var(--line);box-shadow:0 1px 2px rgba(23,23,23,.04),0 12px 32px rgba(23,23,23,.06)}
.fx4 .sx-win{position:relative}
.fx4 .sx-win::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:conic-gradient(var(--m) var(--fxa),transparent 0);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .45s;pointer-events:none;z-index:2}
.fx4 .cx-card.trace .sx-win::after{opacity:1;animation:fx-trace .8s cubic-bezier(.4,0,.2,1) forwards}
@keyframes fx-trace{from{--fxa:0deg}to{--fxa:360deg}}
.fx5 .cx-rail{position:relative}
.fx5 .fx-line{position:absolute;left:0;right:0;top:0;height:2px;border-radius:1px;background:var(--line);overflow:hidden}
.fx5 .fx-line u{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--w,0%)) 0 0);transition:clip-path var(--d,.45s) var(--e,linear)}
.fx-tree{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}
.fx-tree path{fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.fx-tree .base{stroke:var(--line)}
.fx-tree .lit{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);transition:stroke-dashoffset .45s ease-out}
.fx-tree .lit.on{stroke-dashoffset:0}
@media (prefers-reduced-motion:reduce){.fx1 .cx-rail .run b::before,.fx2 .cx-rail .run b::before{animation:none}}
`;
  const fxCss = () => { if (!document.getElementById('css-fx')) document.head.appendChild(h('style', { id: 'css-fx' }, FX_CSS)); };
  const stateFx = cls => ({ cls, mount: (s, el, rail) => rail.forEach(r => r.classList.add('done')), reset: rail => rail.forEach(r => r.classList.remove('run', 'done')), start: (i, r) => r.classList.add('run'), answer: (i, r) => { r.classList.remove('run'); r.classList.add('done'); } });
  const FXS = {
    dot: stateFx('fxq fx1'),
    spin: stateFx('fxq fx2'),
    type: { cls: 'fxq fx3', answer(i, r) {
      const em = r.querySelector('em'); if (!em || R) return; const t = em.textContent; em.textContent = ''; r.classList.add('typing'); let n = 0;
      const id = setInterval(() => { n += 1; em.textContent = t.slice(0, n); if (n >= t.length) { clearInterval(id); setTimeout(() => r.classList.remove('typing'), 500); } }, 32);
    } },
    trace: { cls: 'fx4', start: (i, r, c) => c.classList.add('trace'), end: (i, r, c) => c.classList.remove('trace') },
    one: { cls: 'fxn fx5',
      stops: () => KEYS.map((k, i) => `${PROD[k].main} ${i * 25}% ${(i + 1) * 25}%`).join(','), /* hard stops: one colour per window */
      mount(slot, el) { const line = h('div', { class: 'fx-line' }, h('u', { style: `background:linear-gradient(90deg,${this.stops()});--w:100%` })); el.prepend(line); this.u = line.firstChild; },
      reset() { /* the full line fades out quickly, then is emptied out of sight; it never runs backwards */
        const u = this.u; clearTimeout(this.rt); u.style.transition = 'opacity .22s ease-out'; u.style.opacity = '0';
        this.rt = setTimeout(() => { u.style.transition = 'none'; u.style.setProperty('--w', '0%'); void u.offsetWidth; u.style.transition = ''; u.style.opacity = ''; }, 240);
      },
      start(i) { this.u.style.setProperty('--d', '.45s'); this.u.style.setProperty('--e', 'linear'); this.u.style.setProperty('--w', i === 3 ? '100%' : `calc(${(i + 1) * 25}% - 9px)`); } },
    tree: { cls: 'fxn fx6',
      mount(slot, el) {
        const root = slot.closest('.hx'), svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fx-tree'); root.style.position = 'relative'; root.appendChild(svg);
        this.on = [true, true, true, true]; this.lit = [];
        const draw = () => {
          const field = root.querySelector('.hx-field'); if (!field) return; const R0 = root.getBoundingClientRect(), F = field.getBoundingClientRect();
          svg.setAttribute('width', R0.width); svg.setAttribute('height', R0.height); svg.innerHTML = '';
          const x0 = F.left + F.width / 2 - R0.left, y0 = F.bottom - R0.top + 2, cols = [...el.children], top = cols[0].getBoundingClientRect().top - R0.top - 8, mid = (y0 + top) / 2, r = 8;
          this.lit = cols.map((c, i) => {
            const C = c.getBoundingClientRect(), x = C.left + C.width / 2 - R0.left, dir = Math.sign(x - x0) || 1;
            const d = Math.abs(x - x0) < 2 * r ? `M${x0} ${y0}V${top}` : `M${x0} ${y0}V${mid - r}Q${x0} ${mid} ${x0 + dir * r} ${mid}H${x - dir * r}Q${x} ${mid} ${x} ${mid + r}V${top}`;
            const base = document.createElementNS(NS, 'path'); base.setAttribute('d', d); base.setAttribute('class', 'base'); svg.appendChild(base);
            const lit = document.createElementNS(NS, 'path'); lit.setAttribute('d', d); lit.setAttribute('class', 'lit' + (this.on[i] ? ' on' : '')); lit.style.stroke = PROD[KEYS[i]].main; return lit;
          });
          this.lit.forEach(l => { svg.appendChild(l); l.style.setProperty('--len', l.getTotalLength() + 1); });
        };
        this.ro = new ResizeObserver(draw); this.ro.observe(root); requestAnimationFrame(draw);
      },
      reset() { this.on = [false, false, false, false]; this.lit.forEach(l => { l.style.transition = 'none'; l.classList.remove('on'); void l.getBoundingClientRect(); l.style.transition = ''; }); }, /* branches clear at once for the next URL */
      start(i) { this.on[i] = true; const l = this.lit[i]; if (!l) return; l.parentNode.appendChild(l); requestAnimationFrame(() => l.classList.add('on')); } },
  };
  FXS.grad = Object.assign({}, FXS.one, { stops: () => KEYS.map((k, i) => `${PROD[k].main} ${i * 25 + 12.5}%`).join(',') }); /* S38: each colour peaks over the middle of its window and blends into the next */
  /* S40: the URL's own // leads the line and the scheme is dropped, so it reads //soundcloud.com/… . While the URL types
     and the line crosses Rich Media, the two characters run L06's terminal spinner (/ - \ |, the second one frame ahead, 110 ms a
     frame); they settle back into // as the line reaches the end of the Rich Media column. Same mono, weight and blue as the URL. */
  const MARK_CSS = `
.hx-urlrow{display:flex;align-items:center;min-height:24px;margin-bottom:16px}
.hx-band.bare .hx-urlrow .cx-cmd{margin-bottom:0}
.hx-mark{flex:none;font:14.5px/24px 'Geist Mono',ui-monospace,monospace;color:var(--bl);white-space:pre}
`;
  const SCHEME = 'https://', SPIN = ['/', '-', '\\', '|'];
  FXS.mark = Object.assign({}, FXS.grad, {
    mount(slot, el) {
      FXS.grad.mount.call(this, slot, el);
      if (!document.getElementById('css-hxm')) document.head.appendChild(h('style', { id: 'css-hxm' }, MARK_CSS));
      const cmd = slot.querySelector('.cx-cmd'), mark = h('span', { class: 'hx-mark' }, '//');
      const row = h('div', { class: 'hx-urlrow' }); cmd.parentNode.insertBefore(row, cmd); row.append(mark, cmd); this.mark = mark;
      const strip = () => { const u = cmd.querySelector('.u'); if (!u) return; const t = u.textContent; const v = SCHEME.startsWith(t) ? '' : t.startsWith(SCHEME) ? t.slice(SCHEME.length) : t; if (v !== t) u.textContent = v; };
      this.mo = new MutationObserver(strip); this.mo.observe(cmd, { childList: true }); strip(); /* cmdLine rewrites the line on every typed step */
      this.stop = () => { clearInterval(this.iv); this.iv = 0; this.mark.textContent = '//'; };
    },
    reset() { FXS.grad.reset.call(this); if (R || this.iv) return; let q = 0; this.iv = setInterval(() => { if (this.mark.closest('.demo.off')) return; q++; this.mark.textContent = SPIN[q % 4] + SPIN[(q + 1) % 4]; }, 110); },
    answer(i) { if (i === 0) this.stop(); }, /* settles into // as the line reaches the end of the Rich Media column */
  });
  /* S41: the Preview API window as a real chat channel: a thread anchored to the bottom (older messages scroll up and
     fade out at the top) and a composer that names the channel. Each URL is typed into the composer with a line of text, sent, appears as
     the newest message with the link in blue, then unfurls: a shimmering skeleton first, then the card. */
  const CH_CSS = `
.cx-body:has(>.ch){padding:10px 12px 12px;justify-content:stretch}
.ch{display:flex;flex-direction:column;height:100%;min-height:0;gap:8px;font-size:12.5px}
.ch-h{flex:none;display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding-bottom:7px;border-bottom:1px solid var(--line);font-size:12px;font-weight:600;color:var(--ink)}
.ch-h span{font-size:11px;font-weight:400;color:var(--g)}
.ch-log{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 18px);mask-image:linear-gradient(transparent,#000 18px)}
.ch-m{flex:none;display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;transition:opacity .25s,transform .25s}
.ch-m.new,.ch .cx-unf.new{opacity:0;transform:translateY(6px)}
.ch-m img.av{width:24px;height:24px;border-radius:6px;display:block}
.ch-n{display:flex;align-items:baseline;gap:6px;line-height:1.2}
.ch-n b{font-size:12px;font-weight:600;color:var(--ink)}
.ch-n small{font-size:10.5px;color:var(--g)}
.ch-m p{margin:2px 0 0;line-height:1.4;color:var(--ink)}
.ch-m p a{display:block;color:var(--bl);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ch .cx-unf{margin-top:6px;grid-template-columns:minmax(0,1fr) 36px;transition:opacity .25s,transform .25s}
.ch .cx-unf span{-webkit-line-clamp:1}
.ch .cx-unf i{width:36px;height:36px}
.ch .cx-unf.sk u{display:block;height:7px;margin:4px 0;border-radius:4px;background:linear-gradient(90deg,#f0f0f0,#f9f9f9 50%,#f0f0f0) 0 0/200% 100%;animation:ch-sh 1s linear infinite}
.ch .cx-unf.sk i{background:#f0f0f0}
@keyframes ch-sh{to{background-position:-200% 0}}
.ch-in{flex:none;display:flex;align-items:center;gap:6px;height:30px;padding:0 5px 0 10px;border:1px solid var(--line);border-radius:8px;font-size:12px;color:var(--ink)}
.ch-in .t{flex:1;min-width:0;display:flex;justify-content:flex-end;overflow:hidden;white-space:pre}
.ch-in .t:empty::before{content:attr(data-ph);color:var(--g2);margin-right:auto}
.ch-in.typing .t::after{content:"";flex:none;width:1.5px;height:14px;margin-left:1px;align-self:center;background:var(--ink)}
.ch-in b{flex:none;width:20px;height:20px;border-radius:5px;display:grid;place-items:center;background:var(--soft);color:var(--g2);transition:background .2s,color .2s}
.ch-in b.on{background:var(--m);color:#fff}
.ch-in b svg{width:11px;height:11px}
@media (prefers-reduced-motion:reduce){.ch .cx-unf.sk u{animation:none}}
`;
  const SEND = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10V2.5M2.8 5.4 6 2.2l3.2 3.2"/></svg>';
  const chUnf = s => `<div class="cx-unf"><div><div class="s">${fav(s.fav)}${s.site}</div><b>${s.preview.title}</b><span>${s.preview.desc}</span></div><i style="background:center/cover url('${s.img}')"></i></div>`;
  const chSk = '<div class="cx-unf sk"><div><u style="width:38%"></u><u style="width:88%"></u><u style="width:64%"></u></div><i></i></div>';
  const chMsg = (who, time, text, s, card = '') => `<div class="ch-m"><img class="av" alt="" src="${avatar(who)}"><div><div class="ch-n"><b>${who}</b><small>${time}</small></div><p>${text}${s ? ` <a>${s.url}</a>` : ''}</p>${card}</div></div>`;
  const chTime = m => `10:${String(m % 60).padStart(2, '0')}`;
  const chCss = () => { if (!document.getElementById('css-ch')) document.head.appendChild(h('style', { id: 'css-ch' }, CH_CSS)); };
  const chatBody = s => chCss() || `<div class="ch"><div class="ch-log">${chMsg('Leo', chTime(41), 'collecting a few links here')}${chMsg(s.preview.who, chTime(43), s.preview.say, s, chUnf(s))}</div><div class="ch-in"><span class="t" data-ph="Message #general"></span><b>${SEND}</b></div></div>`;
  const animChat = async (body, s, S) => {
    if (!document.getElementById('css-ch')) document.head.appendChild(h('style', { id: 'css-ch' }, CH_CSS));
    if (!body.querySelector('.ch')) body.innerHTML = chatBody(s);
    const log = body.querySelector('.ch-log'), inp = body.querySelector('.ch-in'), t = inp.querySelector('.t'), btn = inp.querySelector('b');
    body.chMin = (body.chMin || 43) + 2; const text = `${s.preview.say} ${s.url}`;
    inp.classList.add('typing'); for (let i = 2; i < text.length + 2; i += 2) { t.textContent = text.slice(0, i); btn.classList.add('on'); await S(16); }
    await S(160); inp.classList.remove('typing'); t.textContent = ''; btn.classList.remove('on'); /* sent */
    const m = h('div', { html: chMsg(s.preview.who, chTime(body.chMin), s.preview.say, s) }).firstChild; m.classList.add('new'); log.appendChild(m);
    while (log.children.length > 3) log.firstChild.remove();
    void m.offsetHeight; m.classList.remove('new'); await S(280);
    const p = m.querySelector('p'); p.insertAdjacentHTML('afterend', chSk); await S(420);
    const card = h('div', { html: chUnf(s) }).firstChild; card.classList.add('new'); m.querySelector('.cx-unf.sk').replaceWith(card); void card.offsetHeight; card.classList.remove('new'); await S(260);
  };
  const fxScene = (key, o = {}, more = {}) => stage => { fxCss(); const fx = Object.assign({}, FXS[key]); const un = fieldHero(stage, noCopy, Object.assign({ update: { data: typeData, pub: animPC }, fx }, more), Object.assign({ stats: true, carousel: true }, o)); const f = stage.querySelector('.hx-field'); if (f) f.classList.add('clean'); return () => { if (fx.ro) fx.ro.disconnect(); if (fx.mo) fx.mo.disconnect(); if (fx.stop) fx.stop(); clearTimeout(fx.rt); if (un) un(); }; };
  [
    ['sec-fx-dot', 'a status dot before each name', 'S31 with the progress line replaced by a dot before each product name: grey while waiting, pulsing in the product colour while its window works, solid once it has answered. The rail keeps only a hairline.', 'dot'],
    ['sec-fx-spin', 'a spinner that turns into a tick', 'S31 with a small ring before each product name: it spins in the product colour while the window works and becomes a tick in that colour when the answer is in, the way a request reads in a terminal. Hairline rail, no bar.', 'spin'],
    ['sec-fx-type', 'the answer types itself in', 'S31 with no bar: the value on the right of each rail label (audio player, search · reference, excerpt only) types in letter by letter, in the product colour with a caret, as its window answers, the same way the URL types into the field. Hairline rail.', 'type'],
    ['sec-fx-trace', 'the window outline draws itself', 'S31 with the progress moved into the window: while it works, its outline traces around clockwise from the top in the product colour, then fades back to grey. No line in the rail, only the names, so the windows carry the progress.', 'trace'],
    ['sec-fx-one', 'one line through all four', 'S31 with one line across the whole band instead of four: it fills from left to right, taking each product’s colour as it reaches that window, and empties when the next URL starts. One request, four answers, in order.', 'one'],
    ['sec-fx-tree', 'a connector from the URL field', 'S31 with a line from the bottom of the URL field that branches to the four windows. Each branch draws in, in the product colour, as its window starts and stays lit until the next URL. The most literal of the six; it uses the space already between the field and the windows.', 'tree'],
    ['sec-fx-grad', 'one gradient line through all four', 'S36 with the line as one gradient instead of four blocks: blue, violet, orchid and magenta each peak over the middle of their window and blend into the next, so the fill changes colour smoothly as it moves across. Same timing: it reaches each window as that window starts and empties for the next URL.', 'grad'],
  ].forEach(([name, title, blurb, key]) => DEMOS.register(name, { group: 'sec', title: 'Home top · progress: ' + title, blurb, mount: fxScene(key) }));
  DEMOS.register('sec-fx-url', {
    group: 'sec', title: 'Home top · S38 with the URL as a plain line over the windows',
    blurb: 'S38 without the URL field and its Check URL button: the hero ends with its paragraph, and the sample URL types itself in as a plain blue line right above the gradient progress line and the four windows, so the URL and the product animation read as one thing. The hero has no button of its own now; Start free stays in the nav.',
    mount: fxScene('grad', { urlOnly: true }),
  });
  DEMOS.register('sec-fx-mark', {
    group: 'sec', title: 'Home top · S39 with the URL’s // as a terminal spinner',
    blurb: 'S39 with the scheme dropped so the line starts with the URL’s own //, in the same mono and blue as the rest of it. While the URL types and the line runs across the Rich Media column, those two characters run the L06 terminal spinner (/ - \\ |, the second a frame ahead); they settle back into // as the line reaches the end of that column.',
    mount: fxScene('mark', { urlOnly: true }),
  });
  DEMOS.register('sec-fx-chat', {
    group: 'sec', title: 'Home top · S40 with the Preview API window as a real chat',
    blurb: 'S40 with the Preview API window turned into a chat channel: a thread anchored to the bottom and a message box (Message #general). For each URL a line of text and the link type into the message box, the send button lights up in the Preview colour, the message is sent and appears as the newest one with the link in blue, older messages move up and fade out at the top, and the link unfurls: a shimmering placeholder first, then the card with the site’s icon, title, description and image.',
    mount(stage) { const un = fxScene('mark', { urlOnly: true }, { body: Object.assign({}, BODY23, { preview: chatBody }), update: { preview: animChat, data: typeData, pub: animPC } })(stage); return un; },
  });
  /* The S41 band on its own for the website prototype (website-prototype/src/lib/components/HomeScene.svelte): the URL
     line with the // spinner, the gradient progress line, the four windows (chat in Preview API) and no copy, mounted into
     host without the hero, nav or logos. onCycle runs when the last window has answered (the page swaps its logos then).
     The root carries .demo and goes .off out of view, so the scene holds off screen as it does in the lab. */
  const homeBand = (host, o = {}) => {
    ensure(); fxCss(); if (!document.getElementById('css-hx')) document.head.appendChild(h('style', { id: 'css-hx' }, HX_CSS));
    if (!document.getElementById('css-hxe')) document.head.appendChild(h('style', { id: 'css-hxe' }, '.sx.hx.hx-embed{padding:0;background:transparent}.hx-embed .hx-band.bare{margin-top:0}.hx-embed .cx-rail span em{display:none}')); /* the home hero's rail keeps the product names only, no value beside them ("video · 16:9") */
    const root = h('div', { class: 'demo sx hx hx-embed' }), band = h('div', { class: 'hx-band bare' }); root.appendChild(band); host.appendChild(root);
    const seen = inView(root);
    const fx = Object.assign({}, FXS.mark);
    const un = band23(root, { slot: band, copy: noCopy, fx, body: Object.assign({}, BODY23, { preview: chatBody }), update: { preview: animChat, data: typeData, pub: animPC }, done: o.onCycle });
    return () => { seen.disconnect(); if (fx.mo) fx.mo.disconnect(); if (fx.stop) fx.stop(); clearTimeout(fx.rt); if (un) un(); root.remove(); };
  };
  /* S03's stage for the website prototype's /embeds block: no section mock (the page has the copy), root .demo goes .off
     out of view so the timeline and the marquee hold off screen. */
  /* The website prototype's /embeds scene (richBand): S03's editor reworked. The post is written as you watch, the way
     the S41 chat takes messages: each line is typed, then a link on its own line, which turns into the hosted embed (its
     height reserved first); the post starts at the top and, once it is longer than the window, scrolls to keep the newest line in view; nothing is replaced. The second
     window is the URL's embed options as an editor shows them to its authors (the API's options object, docs/options):
     they fill in once the embed is in, then one is changed and the embed and its code follow. URLs and options are real
     (Iframely API, 2026-10-30), and none of them is used by S41: Blender Studio's Sprite Fright (2021) on YouTube (Start
     from: after the intro), the film's page on studio.blender.org (a summary card; no options for it), Forss' Flickermood on SoundCloud (the visual
     player, then the slimmer horizontal one). Since 2026-10-30 in the /data-api card's manner: one card on the page, no
     blue block; the editor keeps its title bar, the Embed options window is the grey sidebar (its content as it
     was), the providers drift below the card. The embed lands at once, no placeholder, and the post scrolls to it; the reserved size is the
     sidebar's foot note. */
  const optRow = (op, v, on) => {
    const off = on ? '' : ' off';
    if (op.type === 'check') return `<div class="ro-o${off}"><i class="cb${v ? ' on' : ''}"></i><span>${op.label}</span></div>`;
    if (op.type === 'text') return `<div class="ro-o ro-t${off}"><span>${op.label}</span><em class="${v ? '' : 'ph'}">${v || op.placeholder}</em></div>`;
    return `<div class="ro-o ro-t${off}"><span>${op.label}</span><em class="sel">${op.values[v]}</em></div>`; /* select */
  };
  const SC_V = s => `<div class="cx-pl x-scv" style="background-image:url('${s.img}')"><div class="top"><b class="play"></b><div class="who"><small>${s.by}</small><span>${s.title}</span></div></div>${SC_CLOUD}<div class="wf"><div class="bars">${scBars(64)}</div></div></div>`;
  const SC_H = s => `<div class="cx-pl x-sc"><i class="art" style="background-image:url('${s.img}')"></i><div class="r"><div class="top"><b class="play"></b><div class="who"><small>${s.by}</small><span>${s.title}</span></div>${SC_CLOUD}</div><div class="wf"><div class="bars">${scBars(48)}</div><em>4:31</em></div></div></div>`;
  const FILM = () => {
    const sc = { img: 'https://i1.sndcdn.com/artworks-000067273316-smsiqx-t500x500.jpg', by: 'Forss', title: 'Flickermood' };
    return [
      { say: 'The film. Start it after the intro:', url: 'youtube.com/watch?v=_cMxraX_5RE', fav: 'youtube', site: 'YouTube', ratio: 9 / 16, res: '16:9 · height reserved', id: 'b8Ln2',
        inner: `<div class="cx-pl x-yt" style="background-image:url('https://i.ytimg.com/vi/_cMxraX_5RE/maxresdefault.jpg')">${YT_PLAY}</div>`,
        opts: [{ type: 'text', label: 'Start from', placeholder: 'ex.: 11, 1m10s', value: '' }, { type: 'text', label: 'End on', placeholder: 'ex.: 11, 1m10s', value: '' }, { type: 'check', label: 'Closed captions', value: false }],
        tweak: { i: 0, to: '1m10s', q: '?_start=1m10s' } },
      { say: 'Background for the handout:', url: 'studio.blender.org/films/sprite-fright', fav: 'blender', site: 'Blender Studio', px: 150, res: '150 px · height reserved', id: 'k3Rb7',
        inner: `<div class="cx-pl x-sum"><i style="background-image:url('https://studio.blender.org/files/public/thumbnail/ce/83/ce833b1d7d5862f1c6e64f7d5b8b0fc9_m.webp')"></i><div class="c"><b>Sprite Fright</b><span>When a group of rowdy teenagers trek into an isolated forest, they discover peaceful mushroom creatures that turn out to be an unexpected force of nature.</span><small>studio.blender.org</small></div></div>`,
        opts: [] },
      { say: 'Music for the lobby while people come in:', url: 'soundcloud.com/forss/flickermood', fav: 'soundcloud', site: 'SoundCloud', px: 400, res: '400 px · height reserved', id: 't5Wq9',
        inner: SC_V(sc),
        opts: [{ type: 'check', label: 'Slimmer horizontal player', value: false }, { type: 'check', label: 'Hide timed comments', value: false }, { type: 'select', label: 'Adjust height', value: '400', values: { 0: 'Fit the artwork', 300: '300px', 400: '400px', 600: '600px' } }],
        tweak: { i: 0, to: true, q: '?_horizontal=true', px: 166, html: SC_H(sc) } },
    ];
  };
  const SXE_CSS = `
.sx.sx-embed{padding:0;background:transparent;align-self:start}
.sx-embed .sx-stage{background:none;padding:0;border-radius:0}
.sx-embed .sx-marq{margin-top:28px}
.dx.ex{grid-template-columns:minmax(0,1fr) 340px;height:560px;background:#fff;border:1px solid #e6e6e6;border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.03),0 12px 32px rgba(0,0,0,.04)}
.ex>.sx-win{border:0;border-radius:0;box-shadow:none;min-height:0}
.ex .sx-bar{border-bottom-color:#ededed}
.ex .ed{height:auto;flex:1;min-height:0}
.ex-side{background:#fafafa;border-left:1px solid #ededed;display:flex;flex-direction:column;min-width:0}
.ex-side .sx-bar{background:transparent}
.ex-side .rm-code{background:#fff;border:1px solid #ededed}
.ex-side .rm-rail{flex:1;min-height:0}
.ex-foot{padding:14px 18px;border-top:1px solid #ededed;font:12px/1.5 'Geist Mono',ui-monospace,monospace;color:var(--g);transition:opacity .4s}
.sx-embed .sx-marq>div{animation-duration:140s}
.sx-embed .rm>.sx-win:first-child{align-self:stretch}
.ed{height:500px;overflow:hidden;scroll-behavior:smooth}
.ed-in{padding:28px clamp(18px,3.4cqw,44px) 4px}
.ed h3{font-weight:600;font-size:24px;letter-spacing:-.02em;color:var(--ink);margin:0 0 8px}
.ed p{margin:0 0 14px;font-size:15px;line-height:1.6;color:var(--mut);max-width:60ch}
.ed p.say{color:var(--ink);margin:6px 0 10px}
.ed .rm-slot{margin:0 0 10px}
.ed .rm-cap{justify-content:space-between;margin:0 0 24px}
.ed .rm-cap .src{display:inline-flex;align-items:center;gap:8px}
.ed .rm-cap .hint{font-size:12px;color:var(--g)}
.ed-b{transition:opacity .3s,transform .3s}
.ed-b.new{opacity:0;transform:translateY(8px)}
.sx-embed .rm-emb>.cx-pl{position:absolute;inset:0;aspect-ratio:auto;border-radius:12px;overflow:hidden}
.sx-embed .x-yt .yt{width:68px;height:48px}
.sx-embed .x-sum{grid-template-columns:36% minmax(0,1fr)}
.sx-embed .x-sum .c{padding:16px 18px;gap:6px}
.sx-embed .x-sum b{font-size:16px}
.sx-embed .x-sum span{font-size:13.5px;-webkit-line-clamp:3}
.sx-embed .x-sum small{margin-top:auto;font-size:12px;color:var(--g)}
.x-scv{background:#333 center/cover no-repeat;border-radius:4px}
.x-scv .top{position:absolute;left:16px;top:16px;display:grid;grid-template-columns:48px auto;gap:12px;align-items:start}
.x-scv .play{width:48px;height:48px;border-radius:50%;background:#f50;display:grid;place-items:center}
.x-scv .play::after{content:"";border-left:15px solid #fff;border-top:9px solid transparent;border-bottom:9px solid transparent;margin-left:4px}
.x-scv .who small,.x-scv .who span{display:table;background:rgba(0,0,0,.82);color:#fff;padding:2px 7px;margin-bottom:5px;font-family:Geist,Arial,sans-serif}
.x-scv .who small{font-size:12px;color:#ccc}
.x-scv .who span{font-size:17px}
.x-scv .cl{position:absolute;right:16px;top:16px;width:44px;height:20px}
.x-scv .wf{position:absolute;left:16px;right:16px;bottom:18px;height:84px}
.x-scv .bars{height:100%;display:flex;gap:2px;align-items:stretch}
.x-scv .bars u{flex:1;position:relative}
.x-scv .bars u::before{content:"";position:absolute;left:0;right:0;bottom:30%;height:calc(var(--v) * .7);background:rgba(255,255,255,.85)}
.x-scv .bars u::after{content:"";position:absolute;left:0;right:0;top:70%;height:calc(var(--v) * .3);background:rgba(255,255,255,.4)}
.x-scv .bars u.p::before{background:#f50}
.x-scv .bars u.p::after{background:#ffbf99}
.sx-embed .x-sc{grid-template-columns:164px minmax(0,1fr)}
.sx-embed .x-sc .r{padding:12px 14px 12px 14px}
.sx-embed .x-sc .top{grid-template-columns:40px minmax(0,1fr) auto;gap:10px}
.sx-embed .x-sc .play{width:40px;height:40px}
.sx-embed .x-sc .play::after{border-left-width:12px;border-top-width:8px;border-bottom-width:8px;margin-left:3px}
.sx-embed .x-sc .who small{font-size:12px}
.sx-embed .x-sc .who span{font-size:16px}
.sx-embed .x-sc .cl{width:36px;height:16px}
.sx-embed .x-sc .wf{margin-top:12px}
.sx-embed .x-sc .wf em{font-size:11px}
.ro{display:flex;flex-direction:column;gap:10px;font-size:13.5px;color:var(--ink)}
.ro-o{display:flex;align-items:center;gap:10px;min-height:30px;transition:opacity .35s}
.ro-o.off{opacity:0}
.ro-o .cb{flex:none;width:16px;height:16px;border:1.5px solid var(--g2);border-radius:4px;position:relative;transition:background .2s,border-color .2s}
.ro-o .cb.on{background:var(--ink);border-color:var(--ink)}
.ro-o .cb.on::after{content:"";position:absolute;left:4px;top:1px;width:4px;height:8px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.ro-t{justify-content:space-between}
.ro-t em{font:13px 'Geist Mono',ui-monospace,monospace;font-style:normal;color:var(--ink);border:1px solid var(--line);border-radius:7px;padding:5px 9px;min-width:132px;background:#fff;white-space:nowrap}
.ro-t em.ph{color:var(--g2)}
.ro-t em.sel::after{content:"";display:inline-block;margin-left:10px;border-top:5px solid var(--g);border-left:4px solid transparent;border-right:4px solid transparent;vertical-align:middle}
.ro-none{margin:0;font-size:13.5px;color:var(--g);transition:opacity .35s}
.ro-none.off{opacity:0}
.sx-embed .rm-code b{color:var(--bl);font-weight:400}
`;
  const embedStage = slot => {
    const doc = h('div', { class: 'ed-in' }, h('div', { class: 'ed-b' }, h('h3', null, 'Friday screening'), h('p', null, 'Sprite Fright, 8 pm in the small room. Links go in as we find them.')));
    const ed = h('div', { class: 'ed' }, doc);
    /* the post is written from the top; once it runs past the window, the window follows the newest line */
    const follow = new ResizeObserver(() => { ed.scrollTop = ed.scrollHeight; }); follow.observe(doc);
    /* one card, as the /preview-api and /data-api ones: the editor keeps its app title bar, the embed options are the
       grey sidebar; the providers drift below the card, outside it */
    const form = h('div', { class: 'ro' }), code = h('div', { class: 'rm-code' });
    const bar = h('div', { class: 'sx-bar nd', html: '<span>Embed options</span><em class="r"> </em>' });
    const site = bar.querySelector('.r');
    const foot = h('div', { class: 'ex-foot' }); /* the reserved size, sized before load, as a note under the options */
    slot.appendChild(h('div', { class: 'sx-stage' }, h('div', { class: 'dx ex' }, win('Friday screening — Editor', ed, 'Draft'), h('div', { class: 'ex-side' }, bar, h('div', { class: 'rm-rail' }, form, code), foot)), marquee()));
    const opts = (e, n, changed) => {
      form.innerHTML = e.opts.length ? e.opts.map((op, i) => optRow(op, changed && i === e.tweak.i ? e.tweak.to : op.value, i < n)).join('')
        : `<p class="ro-none${n ? '' : ' off'}">No options for this URL</p>`;
    };
    const list = FILM();
    let k = 0;
    const stop = runner(slot, async (S, W) => {
      const e = list[k++ % list.length];
      const say = h('p', { class: 'say' }), emb = h('div', { class: 'rm-slot' }), cap = h('div', { class: 'rm-cap' });
      const b = h('div', { class: 'ed-b new' }, say, emb, cap);
      doc.appendChild(b);
      while (doc.children.length > 4) { /* drop the oldest block, out of sight above, without moving what is in view */
        const gone = doc.children[1].offsetTop - doc.children[0].offsetTop; doc.firstChild.remove();
        ed.style.scrollBehavior = 'auto'; ed.scrollTop -= gone; ed.style.scrollBehavior = '';
      }
      opts(e, 0); code.style.opacity = 0; cap.style.opacity = 0; site.textContent = ' '; foot.style.opacity = 0;
      emb.style.height = '0px';
      await S(30); b.classList.remove('new');
      await S(300); await typeInto(say, e.say, S, 24); say.innerHTML = e.say;
      emb.style.height = '24px'; emb.innerHTML = '<div class="rm-url"></div>';
      await S(250); await typeInto(emb.firstChild, 'https://' + e.url, S, 22); await W(450);
      /* the link becomes the embed at once, at its final height, and the post scrolls to it: no placeholder in the post,
         the reserved size goes to the sidebar's foot */
      const H = e.px || Math.round(emb.clientWidth * e.ratio);
      emb.style.transition = 'none'; emb.innerHTML = `<div class="rm-emb on">${e.inner}</div>`; emb.style.height = H + 'px';
      void emb.offsetHeight; emb.style.transition = ''; ed.scrollTop = ed.scrollHeight; /* .ed scrolls smoothly */
      foot.textContent = e.res; foot.style.opacity = 1;
      cap.innerHTML = `<span class="src">${fav(e.fav)}<b>${e.site}</b></span><span class="hint">Hosted by Iframely</span>`; /* the source on the left, the editor's note on the right */ cap.style.opacity = 1;
      site.textContent = e.site;
      code.innerHTML = `&lt;iframe src="//cdn.iframe.ly/${e.id}"&gt;`; code.style.opacity = 1;
      for (let n = 1; n <= Math.max(1, e.opts.length); n++) { await S(160); opts(e, n); }
      const t = e.tweak;
      if (t) {
        await W(1300);
        if (e.opts[t.i].type === 'text') { const em = form.children[t.i].querySelector('em'); em.classList.remove('ph'); await typeInto(em, t.to, S, 80); em.innerHTML = t.to; }
        else opts(e, e.opts.length, true);
        await S(350);
        if (t.html) { const m = emb.querySelector('.rm-emb'); m.style.opacity = 0; await S(250); m.innerHTML = t.html; emb.style.height = t.px + 'px'; m.style.opacity = ''; }
        code.innerHTML = `&lt;iframe src="//cdn.iframe.ly/${e.id}<b>${t.q}</b>"&gt;`;
      }
      await W(2800);
    });
    return () => { follow.disconnect(); stop(); };
  };
  const richBand = host => {
    ensure();
    if (!document.getElementById('css-x23')) document.head.appendChild(h('style', { id: 'css-x23' }, X23_CSS)); /* the real players */
    if (!document.getElementById('css-sxe')) document.head.appendChild(h('style', { id: 'css-sxe' }, SXE_CSS));
    if (!document.getElementById('css-sxb')) document.head.appendChild(h('style', { id: 'css-sxb' }, SXB_CSS)); /* the card and sidebar, as sceneBand's */
    const root = h('div', { class: 'demo sx sx-embed' }); host.appendChild(root);
    const seen = inView(root);
    const un = embedStage(root);
    return () => { seen.disconnect(); un(); root.remove(); };
  };
  /* The website prototype's /data-api scene: S07 reworked as one window without a title bar (white, a light rule and
     shadow, after a reference the user gave) with the terminal and the access object as its sidebar. While the request runs, the
     prompt runs the // terminal spinner (/ - \ |, as S40's URL line) and settles into // when the response is in. The
     window has a fixed height. access.requested (mode, use, agent) is there as soon as the request is sent; the response
     leads, and signals and the decision follow it as secondary detail, their text decoding out of terminal glyphs
     rather than fading in. The URLs are made-up publishers (example.com), not S07's; modes and
     use values are the real ones (docs/processing-modes). */
  const DREQ = [
    { url: 'guides.example.com/alps/tour-du-mont-blanc', mode: 'discover', use: 'reference', ms: 386,
      sig: [['robots.txt', 'allows the agent'], ['Content Signals', 'search=yes'], ['llms.txt', 'found'], ['licence', 'CC BY 4.0'], ['Console', null]],
      dec: [['metadata', 'allowed'], ['entities', 'allowed'], ['excerpt', 'allowed'], ['full text', 'allowed <em>· CC BY 4.0</em>']],
      out: ['# Tour du Mont Blanc in 11 days', '', '<span class="g">170 km around the massif through France,</span>', '<span class="g">Italy and Switzerland, hut to hut …</span>', '', '## Stages', '', '<span class="g">- </span>Les Houches → Les Contamines<span class="g">, 16 km</span>', '<span class="g">- </span>Les Contamines → Les Chapieux<span class="g">, 18 km</span>', '<span class="g">- </span>Les Chapieux → Rifugio Elisabetta<span class="g">, 15 km</span>'] },
    { url: 'news.example.com/2026/10/council-housing-vote', mode: 'ai-input', use: 'immediate', ms: 241,
      sig: [['robots.txt', 'allows the agent'], ['Content Signals', 'ai-input=no'], ['llms.txt', null], ['licence', null], ['Console', '/2026/* excerpt only']],
      dec: [['metadata', 'allowed'], ['entities', 'allowed'], ['excerpt', 'allowed <em>· Console</em>'], ['full text', '-blocked <em>· Content Signals, Console</em>']],
      out: ['# Council approves 2,400 new homes', '', '<span class="g">The vote ends a two-year fight over the</span>', '<span class="g">former rail yards north of the river …</span>', '', '## Key points', '', '<span class="g">- </span>2,400 homes<span class="g">, a third of them affordable</span>', '<span class="g">- </span>31 votes to 18<span class="g">, 4 abstentions</span>', '<span class="g">- </span>first residents<span class="g"> expected in 2029</span>'] },
    { url: 'shop.example.com/products/trail-runner-3', mode: 'search', use: 'reference', ms: 198,
      sig: [['robots.txt', 'allows the agent'], ['Content Signals', 'search=yes'], ['llms.txt', null], ['licence', null], ['Console', '/products/* metadata, entities']],
      dec: [['metadata', 'allowed'], ['entities', 'allowed <em>· Product, Offer</em>'], ['excerpt', '-blocked <em>· Console</em>'], ['full text', '-blocked <em>· Console</em>']],
      out: ['# Trail Runner 3', '', '<span class="g">Trail running shoe by Northpeak.</span>', '', '## Offer', '', '<span class="g">- </span>129.00 EUR<span class="g">, in stock</span>', '<span class="g">- </span>4.6<span class="g"> from 212 reviews</span>', '<span class="g">- </span>EU 38–47<span class="g">, 280 g</span>'] },
  ];
  /* decode: the text of el settles from left to right out of terminal glyphs, in ms (in place of a fade) */
  const GLYPH = '/\\|-_:.+*<>=#';
  const decode = (el, ms = 180) => {
    if (R) return;
    const nodes = []; const walk = n => { for (const c of n.childNodes) c.nodeType === 3 ? nodes.push([c, c.textContent]) : walk(c); }; walk(el);
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      for (const [n, f] of nodes) { const keep = Math.floor(f.length * k); n.textContent = f.slice(0, keep) + f.slice(keep).replace(/\S/g, () => GLYPH[Math.random() * GLYPH.length | 0]); }
      if (k < 1) requestAnimationFrame(step);
    };
    step();
  };
  const dataStage = slot => {
    const term = h('div', { class: 'da-term' });
    const req = h('dl', { class: 'da-sig' }), sig = h('dl', { class: 'da-sig' }), dec = h('dl', { class: 'da-dec' });
    const group = (t, el) => h('div', { class: 'dx-g' }, h('h4', null, t), el);
    const gReq = group('access.requested', req), gSig = group('access.signals', sig), gDec = group('access.decision', dec);
    slot.appendChild(h('div', { class: 'sx-stage' }, win('Data API', h('div', { class: 'dx' }, term, h('div', { class: 'dx-side' }, gReq, gSig, gDec)))));
    let k = 0, iv = 0, pr = '>';
    const spin = on => {
      clearInterval(iv); iv = 0; if (!on || R) return;
      let q = 0;
      iv = setInterval(() => { if (slot.closest('.demo.off')) return; q++; pr = SPIN[q % 4] + SPIN[(q + 1) % 4]; const p = term.querySelector('.pr'); if (p) p.textContent = pr; }, 110);
    };
    const show = g => { g.classList.add('on'); decode(g.querySelector('h4'), 160); };
    const row = (dl, i) => { const dt = dl.children[i], dd = dl.children[i + 1]; dt.classList.add('on'); dd.classList.add('on'); decode(dt); decode(dd); };
    const stop = runner(slot, async (S, W) => {
      const q = DREQ[k++ % DREQ.length];
      const cmd = [['iframely data ', ''], [q.url, 'u'], [' \\', ''], ['\n   --mode=' + q.mode + ' --use=' + q.use, '']];
      const total = cmd.reduce((m, [t]) => m + t.length, 0);
      /* the prompt is padded to the width of the // mark, so the command and the response line up under it */
      const paint = (n, tail) => { let left = n, s = `<span class="g pr">${pr.padEnd(2)}</span><span class="g"> </span>`; for (const [t, c] of cmd) { const part = t.slice(0, Math.max(0, left)); left -= t.length; s += c ? `<span class="${c}">${part}</span>` : part; if (left < 0) break; } term.innerHTML = s + (tail || ''); };
      [gReq, gSig, gDec].forEach(x => x.classList.remove('on'));
      req.innerHTML = [['mode', q.mode], ['use', q.use], ['agent', 'Processing · signed']].map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('');
      sig.innerHTML = q.sig.map(([a, b]) => `<dt>${a}</dt><dd class="${b ? '' : 'n'}">${b || 'none found'}</dd>`).join('');
      dec.innerHTML = q.dec.map(([a, b]) => `<dt>${a}</dt><dd class="${b[0] === '-' ? 'no' : ''}">${b.replace(/^-/, '')}</dd>`).join('');
      pr = '>';
      for (let i = 0; i <= total; i += 2) { paint(i, '<span class="sx-caret"></span>'); await S(24); }
      /* sent: what was requested is known at once, as it is, with no effect; the fetch itself is quick */
      spin(true); paint(total);
      gReq.classList.add('on'); for (const el of req.children) el.classList.add('on');
      await S(260);
      /* the data leads; the sidebar's signals and decision decode in after it, as the secondary detail */
      const head = '\n\n'; /* the markdown only: no status, timing or footer line */
      for (let n = 1; n <= q.out.length; n++) { paint(total, head + q.out.slice(0, n).map(l => '   ' + l).join('\n')); await S(40); }
      spin(false); pr = '//';
      paint(total, head + q.out.map(l => '   ' + l).join('\n') + '\n\n<span class="g">></span> <span class="sx-caret"></span>');
      await S(120); show(gSig);
      for (let i = 0; i < sig.children.length; i += 2) { row(sig, i); await S(50); }
      show(gDec);
      for (let i = 0; i < dec.children.length; i += 2) { row(dec, i); await S(50); }
      await W(4600);
    });
    return () => { clearInterval(iv); stop(); };
  };
  /* The website prototype's /preview-api scene: S05 reworked in dataStage's manner. One card on the page: the chat and the
     doc keep their app title bars, and Iframely's part is the grey sidebar. The fixed height, and the preview leads:
     preview.requested is there as the link is posted, the unfurl lands in the chat, and only then do the sources and
     the result decode in. */
  /* Real links for the site's /preview-api scene (Iframely API, 2026-10-30): title, description, site, cover and favicon
     as Iframely returns them; the sources as each page's own HTML has them (Open Graph, Twitter Cards, JSON-LD, title
     and icon; none of the three offers oEmbed). None of them is used by another scene. */
  const PLINKS = [
    { url: 'en.wikipedia.org/wiki/Bauhaus', who: 'Maya', say: 'good overview to start from', note: 'The school, 1919 to 1933:',
      fav: 'https://en.wikipedia.org/static/apple-touch/wikipedia.png', site: 'Wikipedia', title: 'Bauhaus',
      desc: 'The Staatliches Bauhaus, commonly known as the Bauhaus, was a German art school operational from 1919 to 1933 that combined crafts and the fine arts.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/6265_Dessau.JPG/1280px-6265_Dessau.JPG',
      src: [['oEmbed', null], ['Open Graph', 'title, image'], ['Twitter Cards', null], ['JSON-LD', 'Article'], ['HTML', 'title, icon']] },
    { url: 'tate.org.uk/art/art-terms/b/bauhaus', who: 'Ana', say: 'Tate’s take, shorter', note: 'A shorter definition, for the handout:',
      fav: 'https://www.tate.org.uk/favicon.ico', site: 'Tate', title: 'Bauhaus | Tate',
      desc: 'Tate glossary definition for Bauhaus: Revolutionary school of art, architecture and design established by the pioneer modern architect Walter Gropius at Weimar in Germany in 1919',
      img: 'https://media.tate.org.uk/aztate-prd-ew-dg-wgtail-st1-ctr-data/images/.width-600_CMlOsS6.jpg',
      src: [['oEmbed', null], ['Open Graph', 'title, image'], ['Twitter Cards', 'summary'], ['JSON-LD', null], ['HTML', 'title, icon']] },
    { url: 'github.com/rsms/inter', who: 'Dev', say: 'and the typeface for the slides', note: 'Slides are set in Inter:',
      fav: 'https://github.githubassets.com/favicons/favicon.svg', site: 'GitHub', title: 'GitHub - rsms/inter: The Inter font family',
      desc: 'The Inter font family. Contribute to rsms/inter development by creating an account on GitHub.',
      img: 'https://repository-images.githubusercontent.com/101033179/d7f411b3-ceac-4da4-8e97-0e792a9ff098',
      src: [['oEmbed', null], ['Open Graph', 'title, image'], ['Twitter Cards', 'summary_large_image'], ['JSON-LD', null], ['HTML', 'title, icon']] },
  ];
  const previewStage = slot => {
    /* the chat and the doc go on: each link is a new message and a new paragraph with its card; nothing is replaced. Both
       follow their newest line (smoothly), and the oldest entries go once out of sight above */
    const log = h('div', { class: 'pv-log' },
      h('div', { class: 'pv-m pv-old', html: `<div class="av" style='background-image:url("${avatar('Jo')}")'></div><p><small>Jo</small>Draft for the Bauhaus talk is in the doc. Links welcome.</p>` }));
    const chat = h('div', { class: 'pv-chat' }, log, h('div', { class: 'pv-comp' }, 'Message #design'));
    const docIn = h('div', { class: 'pv-doc' }, h('div', { class: 'pv-b' }, h('h3', null, 'Bauhaus talk · draft'), h('p', null, 'Start with the school, then the type it left behind. Sources so far:')));
    const docV = h('div', { class: 'pv-docv' }, docIn);
    const follow = new ResizeObserver(() => { log.scrollTop = log.scrollHeight; docV.scrollTop = docV.scrollHeight; });
    follow.observe(log); follow.observe(docIn); [...log.children].forEach(c => follow.observe(c));
    const trim = (box, inner, keep) => { /* drop the oldest entry, out of sight above, without moving what is in view */
      while (inner.children.length > keep) {
        const gone = inner.children[1].offsetTop - inner.children[0].offsetTop; inner.firstChild.remove();
        box.style.scrollBehavior = 'auto'; box.scrollTop -= gone; box.style.scrollBehavior = '';
      }
    };
    const req = h('dl', { class: 'da-sig' }), src = h('dl', { class: 'da-sig' }), res = h('dl', { class: 'da-sig' });
    const group = (t, el) => h('div', { class: 'dx-g' }, h('h4', null, t), el);
    const gReq = group('preview.requested', req), gSrc = group('preview.sources', src), gRes = group('preview.result', res);
    slot.appendChild(h('div', { class: 'sx-stage' }, h('div', { class: 'dx px' }, win('# design', chat), win('Bauhaus talk · draft — Docs', docV), h('div', { class: 'dx-side' }, gReq, gSrc, gRes))));
    const show = g => { g.classList.add('on'); decode(g.querySelector('h4'), 160); };
    const row = (dl, i) => { const dt = dl.children[i], dd = dl.children[i + 1]; dt.classList.add('on'); dd.classList.add('on'); decode(dt); decode(dd); };
    const dl = rows => rows.map(([a, b]) => `<dt>${a}</dt><dd class="${b ? '' : 'n'}">${b || 'none found'}</dd>`).join('');
    let k = 0;
    const stop = runner(slot, async (S, W) => {
      const L = PLINKS[k++ % PLINKS.length];
      [gReq, gSrc, gRes].forEach(x => x.classList.remove('on'));
      req.innerHTML = dl([['url', L.url]]);
      src.innerHTML = dl(L.src);
      res.innerHTML = dl([['title', L.title], ['site', L.site], ['image', 'Open Graph'], ['card', 'small, large']]);
      await S(500);
      const msg = h('div', { class: 'pv-m pv-new', html: `<div class="av" style='background-image:url("${avatar(L.who)}")'></div><div><p><small>${L.who}</small>${L.say} <a>${L.url}</a></p><div class="pv-unf"><div><div class="pv-s">${fav(L.fav)}${L.site}</div><div class="pv-t">${L.title}</div><div class="pv-d">${L.desc}</div></div><div class="th" style="background-image:url('${L.img}')"></div></div></div>` });
      log.appendChild(msg); follow.observe(msg); trim(log, log, 5);
      await S(30); msg.classList.add('on');
      gReq.classList.add('on'); for (const el of req.children) el.classList.add('on');
      await S(260);
      msg.querySelector('.pv-unf').classList.add('on');
      await S(160); show(gSrc);
      for (let i = 0; i < src.children.length; i += 2) { row(src, i); await S(50); }
      show(gRes);
      for (let i = 0; i < res.children.length; i += 2) { row(res, i); await S(50); }
      await S(700);
      /* the doc's author carries on: a line, then the link, which becomes its card */
      const note = h('p', { class: 'say' }), url = h('div', { class: 'pv-url' }), card = h('div', { class: 'pv-card' });
      const blk = h('div', { class: 'pv-b' }, note, url, card);
      docIn.appendChild(blk); trim(docV, docIn, 4);
      await typeInto(note, L.note, S, 22); note.innerHTML = L.note;
      await S(200); await typeInto(url, 'https://' + L.url, S, 20); await S(300);
      url.remove(); /* the typed link becomes the card */
      card.innerHTML = `<div class="img" style="background-image:url('${L.img}')"></div><div class="tx"><div class="pv-s">${fav(L.fav)}${L.site}</div><div class="pv-t">${L.title}</div><div class="pv-d">${L.desc}</div></div>`;
      card.classList.add('on'); await W(3800);
    });
    return () => { follow.disconnect(); stop(); };
  };
  /* S05, S07 and S09 for the website prototype's product blocks (/preview-api, /data-api, /console): the lab scene mounted
     as it is, its section copy (badge, heading, text, buttons) dropped since the page has its own, the stage in the
     product's colour with square corners, as richBand's is in Iframely blue; the Data API and S09's windows stand on
     the page itself, without the stage. For /data-api and /preview-api it is dataStage and previewStage above, S07 and S05 reworked, not the lab cards. The root carries .demo and goes .off out
     of view, so the scene holds off screen. */
  const SCENE_BAND = { preview: 'sec-preview-large', data: 'sec-data-large', pub: 'sec-pub-large' };
  const SXB_CSS = `
.sx-band>.sx.sx-large{padding:0;background:transparent}
.sx-band .sx-stage{background:var(--pm);border-radius:0}
.sx-band-data .sx-stage,.sx-band-preview .sx-stage,.sx-band-pub .sx-stage{background:none;padding:0}
.sx-band-data .sx-win,.sx-band-preview .px{border:1px solid #e6e6e6;border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.03),0 12px 32px rgba(0,0,0,.04)}
.dx.px{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) 340px;background:#fff}
.px>.sx-win{border:0;border-radius:0;box-shadow:none}
.px>.sx-win+.sx-win{border-left:1px solid #ededed}
.px .sx-bar{border-bottom-color:#ededed}
.px .pv-card .img{aspect-ratio:2.4/1}
.px .pv-unf .th,.px .pv-card .img{background:#f2f2f2 center/cover no-repeat}
.px .pv-s img{border-radius:3px}
.px .pv-m .av{background-size:cover}
.px .pv-chat{min-height:0}
.pv-log{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
.pv-log>*{flex:none}
.pv-docv{flex:1;min-height:0;overflow:hidden;scroll-behavior:smooth}
.px .pv-doc .pv-b+.pv-b{margin-top:4px}
.px .pv-doc p.say{color:var(--ink);margin:6px 0 8px}
.px .pv-doc .pv-card{margin-bottom:18px}
.sx-band-data .sx-bar{display:none}
.dx{display:grid;grid-template-columns:minmax(0,1fr) 340px;height:480px;overflow:hidden}
.dx .da-term{padding:26px 32px;min-height:0}
.dx-side{border-left:1px solid #ededed;background:#fafafa;padding:24px}
.dx-g{display:none}
.dx-g.on{display:block}
.dx-g.on+.dx-g.on{margin-top:20px;padding-top:18px;border-top:1px solid #ededed}
.dx .da-sig>*,.dx .da-dec>*{opacity:1;transform:none;transition:none}
.dx .da-sig>:not(.on),.dx .da-dec>:not(.on){visibility:hidden}
.dx-g h4{margin:0 0 12px;font:500 11px/1.4 Geist,Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a8a8a}
.dx .da-sig,.dx .da-dec{grid-template-columns:auto minmax(0,1fr);gap:2px 14px;font-size:12px;line-height:1.7}
.dx .da-sig dd,.dx .da-dec dd{white-space:normal;text-align:right}
@container (max-width:860px){.dx,.dx.px,.dx.ex{grid-template-columns:1fr;height:auto}.ex-side{border-left:0;border-top:1px solid #ededed}.dx-side{border-left:0;border-top:1px solid #ededed}.px>.sx-win+.sx-win{border-left:0;border-top:1px solid #ededed}}
`;
  const sceneBand = (host, o = {}) => {
    ensure();
    if (!document.getElementById('css-sxb')) document.head.appendChild(h('style', { id: 'css-sxb' }, SXB_CSS));
    const root = h('div', { class: `demo sx-band sx-band-${o.prod}`, style: `--pm:${PROD[o.prod].main}` }); host.appendChild(root);
    const seen = inView(root);
    const STAGE = { data: dataStage, preview: previewStage };
    const un = STAGE[o.prod] ? STAGE[o.prod](root.appendChild(h('div', { class: 'sx sx-large' }))) : DEMOS.get(SCENE_BAND[o.prod]).mount(root);
    const head = root.querySelector('.sx-head'); if (head) head.remove();
    return () => { seen.disconnect(); if (typeof un === 'function') un(); root.remove(); };
  };
  DEMOS.secKit = { PROD, KEYS, CARDS, icon, tagEl, ensure, xEnsure, homeBand, richBand, sceneBand }; /* for demos/pal.js and the website prototype */
})();
