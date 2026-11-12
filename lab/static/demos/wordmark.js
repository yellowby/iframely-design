/* W · Wordmark techniques: ways to build a logo from the lowercase name "iframely" in a grotesk or a mono face, with "//"
   and (optionally) ":". Static type studies with a little hover, plus one Canvas card (W12) that rebuilds the mark out of
   its own symbols. Every card has a font switcher (mono and/or grotesk, all Google Fonts, loaded on first use) that sets
   --f on the card; tiles that need a specific face set their own. Group 'wm', mount(stage). */
(() => {
  const { h } = DEMOS;
  const BLUE = '#0055ff';

  const FONTS = {
    jb: { n: 'JetBrains Mono', k: 'mono', g: null },
    gm: { n: 'Geist Mono', k: 'mono', g: 'Geist+Mono:wght@100..900' },
    plex: { n: 'IBM Plex Mono', k: 'mono', g: 'IBM+Plex+Mono:wght@200;300;400;500;600;700' },
    space: { n: 'Space Mono', k: 'mono', g: 'Space+Mono:wght@400;700' },
    dm: { n: 'DM Mono', k: 'mono', g: 'DM+Mono:wght@300;400;500' },
    martian: { n: 'Martian Mono', k: 'mono', g: 'Martian+Mono:wght@100..800' },
    frag: { n: 'Fragment Mono', k: 'mono', g: 'Fragment+Mono' },
    it: { n: 'Inter Tight', k: 'grot', g: 'Inter+Tight:wght@100..900' },
    geist: { n: 'Geist', k: 'grot', g: 'Geist:wght@100..900' },
    sg: { n: 'Space Grotesk', k: 'grot', g: 'Space+Grotesk:wght@300..700' },
    sch: { n: 'Schibsted Grotesk', k: 'grot', g: 'Schibsted+Grotesk:wght@400..900' },
    host: { n: 'Host Grotesk', k: 'grot', g: 'Host+Grotesk:wght@300..800' },
    hanken: { n: 'Hanken Grotesk', k: 'grot', g: 'Hanken+Grotesk:wght@100..900' },
  };
  const stack = k => `"${FONTS[k].n}", ${FONTS[k].k === 'mono' ? 'ui-monospace, Menlo, monospace' : 'system-ui, sans-serif'}`;
  /* one stylesheet for every face on the page, added the first time a card mounts */
  let loaded = false;
  function loadFonts() {
    if (loaded) return; loaded = true;
    const fam = Object.values(FONTS).filter(f => f.g).map(f => 'family=' + f.g).concat('family=Doto:ROND,wght@0..100,100..900');
    document.head.appendChild(h('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?' + fam.join('&') + '&display=swap' }));
  }

  const CSS = `
.wm{--blue:${BLUE};--ink:#0d0e10;--mute:#8b909a;--hair:#e6e8ec;--f:${stack('jb')};padding:22px 22px 26px;background:#fff;color:var(--ink)}
.wm-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:18px}
.wm-bar b{font:500 11px 'Geist Mono',ui-monospace,monospace;color:var(--mute);text-transform:uppercase;letter-spacing:.06em;margin:0 4px 0 8px}
.wm-bar b:first-child{margin-left:0}
.wm-bar button{height:28px;padding:0 10px;border-radius:7px;border:1px solid var(--hair);background:#fff;font-size:13px;color:var(--ink);cursor:pointer}
.wm-bar button:hover{border-color:#b9bec7}
.wm-bar button.on{background:var(--ink);border-color:var(--ink);color:#fff}
.wm-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--min,270px),1fr));gap:12px}
.wm-t{border:1px solid var(--hair);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.wm-v{flex:1;min-height:150px;display:grid;place-items:center;padding:28px 18px;font-family:var(--f);font-size:var(--sz,40px);font-weight:700;line-height:1;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;position:relative}
.wm-in{position:relative;display:block;white-space:nowrap}
.wm-t.dk .wm-v{background:var(--ink);color:#fff}
.wm-t.bl .wm-v{background:var(--blue);color:#fff}
.wm-t.pa .wm-v{background:#f4f2ec}
.wm-c{padding:10px 12px 12px;border-top:1px solid var(--hair);font-size:12.5px;line-height:1.45;color:#5d626c}
.wm-c code{display:block;font:500 12px 'Geist Mono',ui-monospace,monospace;color:var(--ink);margin-bottom:2px}
.wm .s{color:var(--blue);font-weight:800}
.wm .w{font-weight:700}
.wm .g{color:var(--mute)}
.wm .l{font-weight:300}
.wm-t.bl .s{color:#0d0e10}
.wm-t.dk .s{color:#5c8dff}
/* W04 tittle: a dotless i with a mark where the dot was */
.wm .tt{position:relative;display:inline-block}
.wm .tt i{position:absolute;left:50%;bottom:.74em;transform:translateX(-50%);font-style:normal;color:var(--blue);font-weight:800}
.wm .tt i.sq{width:.2em;height:.2em;background:var(--blue);bottom:.8em}
/* W05 cut */
.wm .cut{position:relative;display:inline-block}
.wm .cut > span{display:block}
.wm .cut > span + span{position:absolute;inset:0}
.wm .cut > span{transition:transform .5s cubic-bezier(.3,1.4,.5,1)}
.wm .tall{font-size:1.75em;font-weight:200;color:var(--blue);vertical-align:-.17em;letter-spacing:-.08em;margin-right:.04em}
.wm .ovp{display:inline-block;margin-right:.08em}
.wm .ovp span{mix-blend-mode:multiply;font-weight:800}
.wm .ovp span:first-child{color:var(--blue)}
.wm .ovp span:last-child{color:#ff4f8b;margin-left:-.42em}
.wm .ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;font-size:5.2em;font-weight:800;color:#e3ebff;letter-spacing:-.1em;z-index:0}
.wm .fg{position:relative;z-index:1}
.wm .slide .sl{display:inline-block;transition:transform .45s cubic-bezier(.3,1.4,.5,1)}
.wm .slide .rest{display:inline-block;transition:transform .45s cubic-bezier(.3,1.4,.5,1)}
.wm .slide .path{display:inline-block;max-width:0;overflow:hidden;vertical-align:bottom;color:var(--mute);font-weight:400;transition:max-width .5s ease}
.wm-t:hover .slide .path{max-width:6em}
/* W06 icons */
.wm .ics{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;white-space:normal}
.wm .ic{width:64px;height:64px;border-radius:15px;display:grid;place-items:center;font-size:26px;font-weight:800;letter-spacing:-.06em;background:var(--blue);color:#fff}
.wm .ic.o{background:#fff;color:var(--blue);box-shadow:inset 0 0 0 2px var(--blue)}
.wm .ic.k{background:var(--ink)}
.wm .ic.k .s{color:#5c8dff}
.wm .ic.c{border-radius:50%}
.wm .ic.p{background:#eef3ff;color:var(--blue)}
.wm .lk{display:flex;align-items:center;gap:.35em}
.wm .lk .ic{width:1.3em;height:1.3em;border-radius:.3em;font-size:1em}
.wm .lk .ic.c{border-radius:50%}
.wm .lk .ic span{font-size:.62em}
/* W07 blocks */
.wm .blk{display:inline-block;background:var(--blue);color:#fff;padding:.08em .14em .1em;margin-right:.12em;font-weight:800;letter-spacing:-.06em}
.wm .pill{display:inline-flex;align-items:center;background:var(--blue);color:#fff;border-radius:999px;padding:.18em .5em .22em}
.wm .pill .s{color:#9fbcff}
.wm .knock{display:inline-block;background:var(--blue);padding:.08em .16em .1em;margin-right:.12em;font-weight:800;letter-spacing:-.06em;color:#fff;-webkit-text-stroke:0}
.wm .para{display:inline-block;width:1.2em;height:.92em;background:linear-gradient(115deg,transparent 0 22%,var(--blue) 22% 44%,transparent 44% 56%,var(--blue) 56% 78%,transparent 78%);margin-right:.06em;vertical-align:-.1em}
.wm .bar{display:inline-block;width:.16em;height:.92em;background:var(--blue);margin-right:.18em;vertical-align:-.1em}
/* W09 grid */
.wm .mg{display:grid;font-size:var(--gs,44px);line-height:1;letter-spacing:0;background-image:linear-gradient(var(--hair) 1px,transparent 1px),linear-gradient(90deg,var(--hair) 1px,transparent 1px);background-size:var(--cw) var(--ch);padding:0;border-right:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.wm .mg span{width:var(--cw);height:var(--ch);display:grid;place-items:center}
/* W10 terminal */
.wm .cur{display:inline-block;width:.6em;height:1.02em;background:var(--blue);vertical-align:-.16em;margin-left:.06em;animation:wmBlink 1.06s steps(1) infinite}
.wm .cur.u{height:.12em;vertical-align:-.14em}
.wm .bk{animation:wmBlink 1.06s steps(1) infinite}
@keyframes wmBlink{50%{opacity:0}}
.demo.off .wm .cur,.demo.off .wm .bk{animation-play-state:paused}
/* W11 link */
.wm .ul{text-decoration:underline;text-decoration-color:var(--blue);text-decoration-thickness:.09em;text-underline-offset:.16em}
.wm .sel{background:var(--blue);color:#fff;padding:0 .04em}
.wm .mk{background:linear-gradient(transparent 58%,#cfe0ff 58% 92%,transparent 92%)}
.wm .strike{color:#b4b8c0;font-weight:400;text-decoration:line-through;text-decoration-thickness:.07em}
.wm .dot{text-decoration:underline dotted var(--blue);text-decoration-thickness:.1em;text-underline-offset:.18em}
.wm .tab{display:flex;align-items:center;gap:.45em;font-size:15px;font-weight:500;letter-spacing:0;padding:9px 14px;border-radius:10px 10px 0 0;background:#f1f2f4;color:#3a3e45;font-family:Inter,system-ui,sans-serif}
.wm .tab .fv{width:16px;height:16px;border-radius:4px;background:var(--blue);color:#fff;font:800 9px/16px var(--f);text-align:center;letter-spacing:-.08em}
/* W12 */
.wm-t canvas{display:block;width:100%;height:100%}
.wm-v.cv{padding:16px;place-items:stretch}
.wm .doto{font-family:Doto,monospace;font-variation-settings:'ROND' var(--rond,0);letter-spacing:0}
/* W13 scale */
.wm .sc{display:flex;align-items:baseline;gap:28px;flex-wrap:wrap;justify-content:center;white-space:nowrap}
.wm .grow{display:inline-flex;align-items:baseline}
.wm .grow .rest{display:inline-block;max-width:0;overflow:hidden;vertical-align:bottom;transition:max-width .6s cubic-bezier(.4,0,0,1)}
.wm-t:hover .grow .rest{max-width:6em}
/* W14 grotesk */
.wm .mono{font-family:${stack('jb')};font-weight:800;letter-spacing:-.04em}
.wm .sup{font-size:.48em;vertical-align:.95em;margin-right:.04em;letter-spacing:-.06em}
.wm .sub{font-size:.48em;vertical-align:-.08em;margin-left:.04em;letter-spacing:-.06em}
.wm .tight{letter-spacing:-.045em}
`;
  let cssOn = false;
  const css = () => { if (cssOn) return; cssOn = true; document.head.appendChild(h('style', null, CSS)); };

  const wm = (o = {}) => `<span class="s${o.sl || ''}">//</span><span class="w${o.wd || ''}">iframely</span>`;

  /* card: a font bar (fonts: 'all' | 'mono' | 'grot' | null) and a grid of tiles {v, c, n, cls, style} */
  function card(stage, opt) {
    css(); loadFonts();
    const root = h('div', { class: 'wm' }); stage.appendChild(root);
    let cur = opt.def || (opt.fonts === 'grot' ? 'it' : 'jb');
    const setFont = k => { cur = k; root.style.setProperty('--f', stack(k)); bar && bar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); opt.onFont && opt.onFont(k, root); };
    let bar = null;
    if (opt.fonts) {
      bar = h('div', { class: 'wm-bar' });
      for (const kind of ['mono', 'grot']) {
        if (opt.fonts !== 'all' && opt.fonts !== kind) continue;
        bar.appendChild(h('b', null, kind === 'mono' ? 'Mono' : 'Grotesk'));
        for (const [k, f] of Object.entries(FONTS)) if (f.k === kind) bar.appendChild(h('button', { 'data-k': k, style: `font-family:${stack(k)}`, onclick: () => setFont(k) }, f.n));
      }
      root.appendChild(bar);
    }
    const grid = h('div', { class: 'wm-g', style: opt.min ? `--min:${opt.min}px` : '' });
    for (const t of opt.tiles) {
      const v = h('div', { class: 'wm-v' + (t.vcls ? ' ' + t.vcls : ''), style: (t.style || '') + (t.font ? `;font-family:${stack(t.font)}` : ''), html: t.vcls === 'cv' ? (t.v || '') : '<div class="wm-in">' + (t.v || '') + '</div>' });
      const tile = h('div', { class: 'wm-t ' + (t.cls || '') }, v, h('div', { class: 'wm-c' }, h('code', null, t.c), t.n || ''));
      if (t.span) tile.style.gridColumn = 'span ' + t.span;
      grid.appendChild(tile); t.el = v;
    }
    root.appendChild(grid);
    setFont(cur);
    return { root, tiles: opt.tiles };
  }
  const reg = (name, title, blurb, mount) => DEMOS.register(name, { group: 'wm', title, blurb, mount });

  /* W01 */
  reg('wm-specimen', 'Specimen: //iframely in thirteen faces', 'The same mark (slashes ExtraBold blue, word Bold) in every face on the page, mono first, grotesk after. Mono gives the slashes a full cell and an even rhythm; grotesk tightens the word and makes the slashes look borrowed, which is part of the joke.', stage => {
    card(stage, { fonts: null, min: 250, tiles: Object.keys(FONTS).map(k => ({ v: wm(), c: FONTS[k].n, n: FONTS[k].k === 'mono' ? 'Mono' : 'Grotesk', font: k, style: '--sz:38px' })) });
  });

  /* W02 */
  reg('wm-contrast', 'Weight and colour contrast', 'The cheapest system: the slashes and the word differ in one property only. Weight contrast works best in a variable mono; colour contrast is the current mark.', stage => {
    card(stage, { fonts: 'all', tiles: [
      { v: wm(), c: 'blue 800 / ink 700', n: 'The current final mark.' },
      { v: '<span class="s" style="font-weight:200">//</span><span class="w">iframely</span>', c: 'thin slashes', n: 'Slashes as hairlines: lighter, more like punctuation than a symbol.' },
      { v: '<span style="font-weight:800">//</span><span style="font-weight:300">iframely</span>', c: 'heavy // , light word', n: 'One colour; the weight does the work. Survives single-colour print.' },
      { v: '<span class="g" style="font-weight:400">//</span><span class="w">iframely</span>', c: 'comment grey', n: 'Syntax highlighting: // reads as a comment marker, the name as code.' },
      { v: '<span style="color:var(--blue)">//iframely</span>', c: 'all blue', n: 'One unit, nothing to separate. Strongest as a link colour.' },
      { v: wm(), c: 'on blue', n: 'Reversed: white word, ink slashes on the brand blue.', cls: 'bl' },
      { v: wm(), c: 'on ink', n: 'Dark surfaces: slashes shift to a lighter blue to keep their contrast.', cls: 'dk' },
      { v: '<span class="s" style="font-weight:800;font-style:italic">//</span><span class="w">iframely</span>', c: 'italic slashes', n: 'JetBrains Mono italic leans the slashes further, like motion.', font: 'jb' },
    ] });
  });

  /* W03 */
  reg('wm-syntax', 'Where the // and : sit', 'The same three symbols mean different things depending on position. Each tile is a real piece of syntax, so the mark can always be explained in one line.', stage => {
    card(stage, { fonts: 'all', tiles: [
      { v: wm(), c: '//iframely', n: 'Protocol-relative URL, and a code comment.' },
      { v: '<span class="s">://</span><span class="w">iframely</span>', c: '://iframely', n: 'The scheme separator: whatever comes before it, Iframely comes after.' },
      { v: '<span class="w">iframely</span><span class="s">://</span>', c: 'iframely://', n: 'An app’s own URL scheme, like a deep link. The name becomes the protocol.' },
      { v: '<span class="w">iframely</span><span class="s">:</span>', c: 'iframely:', n: 'A key waiting for its value (JSON, YAML): the API answers after the colon.' },
      { v: '<span class="w">iframe</span><span class="s">:</span><span class="w">ly</span>', c: 'iframe:ly', n: 'The colon splits the name into what it is built on (iframe) and the suffix. Nods to the iframe.ly domain.' },
      { v: '<span class="w">iframe</span><span class="s">//</span><span class="w">ly</span>', c: 'iframe//ly', n: 'Same split with the slashes, like a path joint.' },
      { v: '<span class="s">:</span><span class="w">iframely</span><span class="s">:</span>', c: ':iframely:', n: 'Emoji shortcode in Slack and GitHub: a mark that lives in chat.' },
      { v: '<span class="w">iframely</span><span class="s">::</span><span class="g" style="font-weight:400">embed</span>', c: 'iframely::embed', n: 'Namespace operator: the product names hang off the mark (::preview, ::data).' },
      { v: '<span class="s">/</span><span class="w">iframely</span>', c: '/iframely', n: 'A single slash: a path, a route. Quieter, loses the URL reference.' },
    ] });
  });

  /* W04 */
  reg('wm-glyph', 'Glyph swaps inside the word', 'The symbols replace or decorate letters the name already has: the l is a stem, the i has a dot. Small changes that only show at display size.', stage => {
    card(stage, { fonts: 'all', tiles: [
      { v: '<span class="w">iframe</span><span class="s">/</span><span class="w">y</span>', c: 'iframe/y', n: 'The l becomes a slash. Still reads as iframely; the slash is one of the //.' },
      { v: '<span class="w">iframe</span><span class="s">|</span><span class="w">y</span>', c: 'iframe|y', n: 'The l as a pipe: a Unix pipe, a text cursor. Upright, so less of a URL.' },
      { v: '<span class="w"><span class="tt">ı<i>/</i></span>framely</span>', c: 'slash for the dot', n: 'The dot of the i becomes a small blue slash, like an accent.' },
      { v: '<span class="w"><span class="tt">ı<i class="sq"></i></span>framely</span>', c: 'square tittle', n: 'The dot becomes a blue square: a pixel, a favicon in miniature.' },
      { v: '<span class="w"><span class="tt">ı<i>:</i></span>frame<span class="s">/</span>y</span>', c: 'colon + slash', n: 'Both at once: a colon over the i, a slash for the l. One step too many?' },
      { v: '<span class="s">/</span><span class="w">/framely</span>', c: '/ + /framely', n: 'The second slash doubles as the i stem (the i drops out). Needs the word in your head to read.', },
    ] });
  });

  /* W05 */
  function cut(text, cuts, o = {}) {
    const g = o.gap || 4, sk = o.sk || 5, dy = o.dy || .1;
    const pieces = []; const edges = [-50].concat(cuts, [150]);
    for (let i = 0; i < edges.length - 1; i++) {
      const a = edges[i] + (i ? g / 2 : 0), b = edges[i + 1] - (i < edges.length - 2 ? g / 2 : 0);
      const poly = `polygon(${a + sk}% 0, ${b + sk}% 0, ${b - sk}% 100%, ${a - sk}% 100%)`;
      pieces.push(`<span style="clip-path:${poly};transform:translateY(${(i * dy).toFixed(3)}em)" data-i="${i}">${text}</span>`);
    }
    return `<span class="cut" data-dy="${dy}">${pieces.join('')}</span>`;
  }
  reg('wm-cut', 'Cut, scale and overprint', 'The slashes as shapes rather than characters: a diagonal cut through the word (the gap is the slash), slashes taller than the type, two slashes printed over each other, a giant // behind. Hover the first two to pull the cut open; the last tile reveals a path.', stage => {
    const c = card(stage, { fonts: 'all', tiles: [
      { v: cut('<span class="w">iframely</span>', [46]), c: 'one cut', n: 'The word sliced once at the slash angle; the right half drops. The white gap is the /.' },
      { v: cut('<span class="w">iframely</span>', [13, 21], { gap: 3, dy: .07 }), c: 'two cuts = //', n: 'Two parallel cuts near the start: a negative // runs through the i.' },
      { v: '<span class="tall">//</span><span class="w">iframely</span>', c: 'tall slashes', n: 'Light slashes scaled to run from above the ascenders to below the descenders: a divider as much as a letter.' },
      { v: '<span class="ovp"><span>/</span><span>/</span></span><span class="w">iframely</span>', c: 'overprint', n: 'Two slashes in two inks, overlapped and multiplied like a riso print.' },
      { v: '<span class="ghost">//</span><span class="fg w">iframely</span>', c: 'giant // behind', n: 'The slashes as a background graphic, the name sits on them. A poster or social card system.' },
      { v: '<span class="slide"><span class="s">//</span><span class="w">iframely</span><span class="path">/embeds</span></span>', c: 'hover: path', n: 'Hover: the mark grows a path, the header idea from L04 in one tile.' },
    ] });
    /* hover opens the cuts */
    c.tiles.slice(0, 2).forEach(t => {
      const el = t.el.closest('.wm-t');
      const set = k => t.el.querySelectorAll('.cut > span').forEach(s => { const i = +s.dataset.i; s.style.transform = `translate(${(i * .05 * k).toFixed(3)}em, ${(i * +s.parentNode.dataset.dy * (k ? 2.6 : 1)).toFixed(3)}em)`; });
      el.addEventListener('pointerenter', () => set(1)); el.addEventListener('pointerleave', () => set(0));
    });
  });

  /* W06 */
  reg('wm-icons', 'Short forms: favicon and lockups', 'What the mark shrinks to when there is room for two characters. Mono keeps them centred in the cell; switch to a grotesk to see how its slashes sit.', stage => {
    const ic = (t, cls = '') => `<div><div class="ic ${cls}">${t}</div></div>`;
    card(stage, { fonts: 'all', min: 300, tiles: [
      { v: `<div class="ics">${ic('//')}${ic('//', 'c')}${ic('//', 'o')}${ic('<span class="s">//</span>', 'k')}${ic('//', 'p')}</div>`, c: '//', n: 'The slashes alone: square, round, outline, ink, tint.', span: 2 },
      { v: `<div class="ics">${ic('i/')}${ic('/i', 'k')}${ic('i:', 'o')}${ic(':/', 'p')}${ic('<span style="letter-spacing:-.02em">if</span>', 'c')}</div>`, c: 'i/ · /i · i: · :/ · if', n: 'Initial plus a symbol: carries more of the name, loses the instant “URL” read.', span: 2 },
      { v: '<span class="lk"><span class="ic"><span>//</span></span><span class="w">iframely</span></span>', c: 'tile + word', n: 'The current site logo’s structure (disc + wordmark) with the slashes as the tile.' },
      { v: '<span class="lk"><span class="ic c"><span>//</span></span><span class="w">iframely</span></span>', c: 'disc + word', n: 'Closest to the logo in production today: the blue disc stays, the glyph becomes //.' },
      { v: '<span class="lk"><span class="ic o"><span>i:</span></span><span class="w" style="font-weight:500">iframely</span></span>', c: 'outline + medium', n: 'Lighter lockup for product UI and docs headers.' },
    ] });
  });

  /* W07 */
  reg('wm-block', 'Blocks, pills and stripes', 'The slashes become a solid shape: a highlighted block, a pill, two parallelogram bars, or a single bar like a text cursor. Shapes scale better than glyphs and can be drawn at any weight.', stage => {
    card(stage, { fonts: 'all', tiles: [
      { v: '<span class="blk">//</span><span class="w">iframely</span>', c: 'highlight block', n: 'The slashes knocked out of a blue block, like a selected token.' },
      { v: '<span class="pill"><span class="s">//</span><span class="w">iframely</span></span>', c: 'pill', n: 'The whole mark as a chip or tag: it already looks like a link someone pasted.', style: '--sz:32px' },
      { v: '<span class="para"></span><span class="w">iframely</span>', c: 'drawn parallelograms', n: 'Two bars drawn, not typed: the stroke and angle can be tuned to any face.' },
      { v: '<span class="bar"></span><span class="w">iframely</span>', c: 'one bar', n: 'A single upright bar: a cursor, a text caret, the left edge of an embed.' },
      { v: '<span class="para" style="filter:none"></span><span class="w">iframely</span>', c: 'on ink', n: 'The same bars on a dark ground.', cls: 'dk' },
      { v: '<span class="blk" style="background:#0d0e10">//</span><span class="w">iframely</span>', c: 'on blue', n: 'Ink block on the brand blue.', cls: 'bl' },
    ] });
  });

  /* W08 */
  reg('wm-tags', 'Brackets and tags', 'The name already starts with “iframe”, an HTML tag. Wrap it in tag or bracket syntax and the slash moves to where HTML puts it.', stage => {
    const lt = '<span class="s">&lt;</span>', gt = '<span class="s">&gt;</span>';
    card(stage, { fonts: 'all', tiles: [
      { v: `${lt}<span class="w">iframely</span><span class="s">/</span>${gt}`, c: '<iframely/>', n: 'Self-closing tag: a component you drop in. The most “developer” of all.' },
      { v: `${lt}<span class="w">iframe</span><span class="s">/</span><span class="w">ly</span>${gt}`, c: '<iframe/ly>', n: 'The slash lands exactly between iframe and ly.' },
      { v: `${lt}<span class="s">/</span><span class="w">iframely</span>${gt}`, c: '</iframely>', n: 'A closing tag: the end of the embed, Iframely as the thing that wraps it.' },
      { v: '<span class="s">[//]</span><span class="w">iframely</span>', c: '[//]iframely', n: 'The resolved status from L16 terminal batch as the prefix.' },
      { v: '<span class="g" style="font-weight:400">[</span><span class="s">//</span><span class="w">iframely</span><span class="g" style="font-weight:400">]</span>', c: '[//iframely]', n: 'Square brackets as a frame: literally an iframe around the name.' },
      { v: '<span class="g" style="font-weight:300">{</span><span class="w">iframely</span><span class="s">:</span><span class="g" style="font-weight:300">}</span>', c: '{iframely:}', n: 'An object with one key: the JSON response before the value arrives.' },
    ] });
  });

  /* W09 */
  function mgrid(rows, o = {}) {
    const cols = Math.max(...rows.map(r => [...r].length));
    const cells = rows.map(r => [...r.padEnd(cols, ' ')].map(ch => `<span class="${ch === '/' || ch === ':' ? 's' : 'w'}">${ch === ' ' ? '' : ch}</span>`).join('')).join('');
    return `<div class="mg" style="grid-template-columns:repeat(${cols},var(--cw));--gs:${o.s || 44}px;--cw:${(o.s || 44) * .64}px;--ch:${(o.s || 44) * 1.18}px">${cells}</div>`;
  }
  reg('wm-grid', 'Mono grid stacks', 'Mono letters share one width, so the mark can be cut into rows and still line up as a block. //iframely is ten cells: 5 × 2, or 4 × 3 with the colons filling the gap. Only for mono faces.', stage => {
    card(stage, { fonts: 'mono', min: 220, tiles: [
      { v: mgrid(['//ifr', 'amely']), c: '5 × 2', n: 'Ten characters, two rows. The slashes sit in the top corner.' },
      { v: mgrid(['//if', 'rame', 'ly::']), c: '4 × 3 with ::', n: 'The colons fill the last two cells: a square block.' },
      { v: mgrid(['//', 'if', 'ra', 'me', 'ly']), c: '2 × 5', n: 'A narrow column for a vertical banner or a sidebar.' },
      { v: mgrid(['ifra', 'mely', '://']), c: 'word first', n: 'The URL scheme hangs below the name.' },
      { v: mgrid(['i:', '//']), c: '2 × 2 icon', n: 'A square monogram from the same grid.', style: '' },
    ] });
  });

  /* W10 */
  reg('wm-terminal', 'Prompt and cursor', 'The mark as something typed: a shell prompt, a path, a blinking cursor. Motion for free and a clear developer audience, but every variant says “CLI tool”.', stage => {
    card(stage, { fonts: 'mono', tiles: [
      { v: `${wm()}<span class="cur"></span>`, c: '//iframely█', n: 'Block cursor after the mark: the logo is always being typed.' },
      { v: `<span class="g" style="font-weight:400">$&nbsp;</span><span class="w">iframely</span><span class="cur u"></span>`, c: '$ iframely_', n: 'A command. Reads as the name of a CLI.' },
      { v: '<span class="g" style="font-weight:400">~</span><span class="s">/</span><span class="w">iframely</span>', c: '~/iframely', n: 'Home directory path: a place, not a command.' },
      { v: '<span class="w">iframely</span><span class="s bk">:</span>', c: 'iframely: (blinking)', n: 'The colon blinks like a clock or a waiting key.' },
      { v: `${wm()}<span class="cur"></span>`, c: 'on ink', n: 'The same in the terminal’s own colours.', cls: 'dk' },
      { v: '<span class="s">&gt;</span><span class="w">&nbsp;iframely</span><span class="s">://</span>', c: '> iframely://', n: 'Prompt + scheme: “go to”.' },
    ] });
  });

  /* W11 */
  reg('wm-link', 'Link states', 'The mark styled the way a browser styles a URL: underline, selection, highlighter. Uses what every reader already knows about links.', stage => {
    card(stage, { fonts: 'all', tiles: [
      { v: '<span class="ul"><span class="s">//</span><span class="w">iframely</span></span>', c: 'underlined', n: 'A link, offset underline in blue.' },
      { v: '<span class="s">//</span><span class="w sel">iframely</span>', c: 'selected', n: 'The name highlighted as if just selected to copy.' },
      { v: '<span class="s">//</span><span class="w mk">iframely</span>', c: 'marker', n: 'A highlighter band behind the word.' },
      { v: '<span class="strike">https:</span><span class="s">//</span><span class="w">iframely</span>', c: 'scheme struck out', n: 'The scheme crossed out: what remains is the mark.' },
      { v: '<span class="s">//</span><span class="w dot">iframely</span>', c: 'dotted', n: 'Dotted underline: the hover-card affordance (“there is a preview here”).' },
      { v: '<div class="tab"><span class="fv">//</span>iframely — embeds for any URL</div>', c: 'tab', n: 'The favicon in a browser tab, 16 px.', style: 'align-items:end;padding-bottom:0;background:#e4e6ea' },
    ] });
  });

  /* W12: rebuilt from symbols on a canvas */
  function symbols(canvas, fam, mode) {
    const box = canvas.parentNode.getBoundingClientRect(); const W = Math.max(200, box.width - 32), H = Math.max(100, box.height - 32);
    const dpr = Math.min(2, devicePixelRatio || 1); canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const cols = mode === 'ascii' ? 46 : mode === 'dots' ? 72 : 56;
    const off = document.createElement('canvas'); const ow = cols, fs = 100;
    const mctx = off.getContext('2d'); mctx.font = `800 ${fs}px ${fam}`; const tw = mctx.measureText('//iframely').width, sw = mctx.measureText('//').width;
    const cellW = W / cols, cellH = mode === 'ascii' ? cellW * 1.7 : cellW; const rows = Math.floor(H / cellH);
    /* sample at 4× per cell */
    const S = 4; off.width = cols * S; off.height = rows * S; const o = off.getContext('2d');
    const scale = (cols * S * .92) / tw; o.font = `800 ${fs * scale}px ${fam}`; o.textBaseline = 'middle'; o.fillStyle = '#000';
    const x0 = cols * S * .04; o.fillText('//iframely', x0, rows * S * .52);
    const data = o.getImageData(0, 0, off.width, off.height).data; const split = x0 + sw * scale;
    if (mode === 'ascii') ctx.font = `700 ${cellH * .82}px "JetBrains Mono", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      let a = 0; for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) a += data[((r * S + y) * off.width + c * S + x) * 4 + 3];
      a /= S * S * 255; const cx = (c + .5) * cellW, cy = (r + .5) * cellH, blue = c * S < split;
      if (mode === 'ascii') {
        const ch = a > .7 ? '/' : a > .4 ? ':' : a > .12 ? '.' : ''; if (!ch) { continue; }
        ctx.fillStyle = blue ? BLUE : '#0d0e10'; ctx.fillText(blue && ch !== '.' ? '/' : ch, cx, cy);
      } else if (mode === 'dots') {
        if (a < .05) continue; ctx.fillStyle = blue ? BLUE : '#0d0e10'; ctx.beginPath(); ctx.arc(cx, cy, Math.sqrt(a) * cellW * .56, 0, 6.283); ctx.fill();
      } else {
        if (a < .45) continue; ctx.fillStyle = blue ? BLUE : '#0d0e10'; ctx.fillRect(c * cellW + .6, r * cellH + .6, cellW - 1.2, cellH - 1.2);
      }
    }
  }
  reg('wm-symbols', 'Made of its own symbols', 'The mark resampled on a grid: drawn with / : . characters (slashes in the blue part), as halftone dots, as pixels, and set in Doto, a dot-matrix face. A texture system for heroes and social cards that is still the logo. Follows the font switcher.', stage => {
    let cvs = [], fk = 'jb', ready = false;
    const c = card(stage, { fonts: 'all', min: 340, tiles: [
      { v: '<canvas data-m="ascii"></canvas>', vcls: 'cv', c: 'ascii / : .', n: 'Dense cells are slashes, mid cells colons, edges dots.', style: 'min-height:190px' },
      { v: '<canvas data-m="dots"></canvas>', vcls: 'cv', c: 'halftone', n: 'Dot size follows coverage.', style: 'min-height:190px' },
      { v: '<canvas data-m="px"></canvas>', vcls: 'cv', c: 'pixels', n: 'Square cells at a coarse grid: an 8-bit version for tiny sizes and favicons.', style: 'min-height:190px' },
      { v: `<span class="doto" style="--rond:100;font-weight:900">${wm()}</span>`, c: 'Doto, round', n: 'Dot-matrix face (Google Fonts), round dots, Black.', style: '--sz:46px' },
      { v: `<span class="doto" style="--rond:0;font-weight:800">${wm()}</span>`, c: 'Doto, square', n: 'Same face with square dots.', style: '--sz:46px' },
      { v: `<span class="doto" style="--rond:100;font-weight:900">${wm()}</span>`, c: 'Doto on ink', n: 'An LED board.', cls: 'dk', style: '--sz:46px' },
    ], onFont: k => { draw(k); } });
    function draw(k) { if (k) fk = k; if (!ready) return; const fam = stack(fk); document.fonts.load(`800 40px ${fam}`).then(() => cvs.forEach(cv => symbols(cv, fam, cv.dataset.m))).catch(() => {}); }
    cvs = [...c.root.querySelectorAll('canvas')]; ready = true;
    const ro = new ResizeObserver(() => draw()); ro.observe(c.root); draw();
    return () => ro.disconnect();
  });

  /* W13 */
  reg('wm-scale', 'Scale steps and the expanding mark', 'One mark, three lengths: //iframely for headers, //if or i: as a middle step, // for favicons. Hover a tile: the short form types out to the full name, so the header can collapse on scroll.', stage => {
    const grow = (a, b) => `<span class="grow"><span class="s">${a}</span><span class="rest w">${b}</span></span>`;
    card(stage, { fonts: 'all', min: 320, tiles: [
      { v: '<div class="sc"><span style="font-size:48px">' + wm() + '</span><span style="font-size:28px">' + wm() + '</span><span style="font-size:16px">' + wm() + '</span></div>', c: '48 · 28 · 16 px', n: 'The full mark at three sizes: check that the slashes still separate at 16.', span: 2 },
      { v: '<div class="sc"><span style="font-size:40px">' + wm() + '</span><span style="font-size:40px"><span class="s">//</span><span class="w">if</span></span><span style="font-size:40px"><span class="s">//</span></span></div>', c: 'full → //if → //', n: 'Truncation, not a separate icon: each step is the start of the same string.', span: 2 },
      { v: grow('//', 'iframely'), c: 'hover: // → //iframely', n: 'Collapsed header logo that types itself out.' },
      { v: grow(':', 'iframely'), c: 'hover: : → :iframely', n: 'The colon as the smallest form: two dots.' },
      { v: '<span class="grow"><span class="w">i</span><span class="rest w">frame</span><span class="s">/</span><span class="w">y</span></span>', c: 'hover: i/y → iframe/y', n: 'The glyph-swap version (W04) folding to i/y.' },
    ] });
  });

  /* W14 */
  reg('wm-grotesk', 'Grotesk with borrowed slashes', 'In a grotesk the slashes can come from somewhere else: a mono, a smaller size, a drawn shape. Pairs the warmer word with the code reference. Switch the grotesk; the mono slashes stay JetBrains Mono.', stage => {
    card(stage, { fonts: 'grot', def: 'it', tiles: [
      { v: '<span class="s">//</span><span class="w tight">iframely</span>', c: 'grotesk, tight', n: 'Everything in the grotesk, tracking −4.5%. The cleanest; the slashes are the face’s own.' },
      { v: '<span class="s mono">//</span><span class="w tight">iframely</span>', c: 'mono // + grotesk word', n: 'Slashes from JetBrains Mono ExtraBold: wider, sturdier, clearly “code”.' },
      { v: '<span class="s sup">//</span><span class="w tight">iframely</span>', c: 'superscript //', n: 'Small slashes up at the cap height, like a footnote mark or a trademark.' },
      { v: '<span class="w tight">iframely</span><span class="s sub">//</span>', c: 'trailing subscript', n: 'After the word, at the baseline: a signature.' },
      { v: '<span class="para"></span><span class="w tight">iframely</span>', c: 'drawn // + grotesk', n: 'Parallelogram bars matched to the grotesk’s cap height.' },
      { v: '<span class="w tight" style="font-weight:800">iframely</span><span class="s" style="font-weight:900">:</span>', c: 'heavy word + colon', n: 'Black weight, a blue colon: the most compact, works without the slashes.' },
      { v: '<span class="w tight" style="font-weight:500">iframe</span><span class="s">/</span><span class="w tight" style="font-weight:500">y</span>', c: 'medium, l → /', n: 'W04 in a grotesk: the slash is closer in angle to the letters here.' },
      { v: '<span class="s" style="font-weight:300">//</span><span class="w tight" style="font-weight:600">iframely</span>', c: 'light //, semibold word', n: 'Quiet version for product UI.' },
    ] });
  });
})();
