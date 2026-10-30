/* Gallery shell: a sidebar with the pages and the demos on the current page, one page shown at a time.
   Pages are hash routes (#hero, #backgrounds, #scenes); a demo name in the hash (#hero-stack) opens its page and scrolls to it.
   Only the current page's demos are mounted, so the other groups cost nothing. */
(function () {
  const PAGES = [
    { id: 'picks', title: 'Section picks', groups: ['sec'], intro: 'One scene per slot on the site, each set in a mock of its section with the current copy from iframely-marketing/demos/website: the hero (a full-width band and a right-hand visual) and each product (a large scene under the copy, and a smaller one beside it). Geist, headings 32 / 120% / −2%, product badges from the Figma palette. S01 is P08 cut to a band; S02, S03, S05, S07 and S09 are new; the product side slots reuse the P08 windows. S11 and S12 are two takes on the home page section under the hero (“Connecting developers and publishers”) with the hub as its visual.' },
    { id: 'colour', title: 'Publisher colour', groups: ['pal'], intro: 'The developer products run in hue order, blue → violet → orchid (220°, 254°, 284°); the Publisher Console was green (154°), apart from them, and is magenta (328°) since 2026-10-30. Six candidates for its place, each a solid, a mid and a tint that pass 4.5:1 on white and on the tint: the old green, teal (all cool), magenta and raspberry (continuing the run), coral and amber (the warm side across). K01 compares them; K02 switches the colour in the S28 home top.' },
    { id: 'hero', title: 'Hero compositions', groups: ['hero'], intro: 'B01 Dither gradient as the base, kept as is: same colours, drift and pointer lamp. Each composition adds one thing to the right half and tells the field how to react to it: pool ink behind it, clear a pocket, resolve into a shape, show through a window, or turn its blocks into letters.' },
    { id: 'backgrounds', title: 'Backgrounds', groups: ['bg'], intro: 'Full-bleed textures under the hero copy, with light pointer interaction. They run only while on screen, cap the device pixel ratio, and render a still frame when the visitor prefers reduced motion.' },
    { id: 'scenes', title: 'Product scenes', groups: ['pd', 'pdw'], intro: 'Scripted, paper.design-style demos of what Iframely does, built from real DOM and sequenced with Motion. Text on the left, visualization on the right. Hovering a scene pauses it; some are interactive and only run their own script until you touch them.' },
    { id: 'scenes-pastel', title: 'Scenes on pastel', groups: ['pdp'], intro: 'The same seven scenes with the B06 pastel blobs behind the stage: each product gets its own colour trio (Rich Media pink, Preview sky, Data mint, Publisher sand), the cards stay on paper, and the eyebrow becomes a chip in the first pastel. The page itself stays on paper.' },
    { id: 'logo', title: 'Logo in motion', groups: ['logo'], intro: 'The final //iframely mark (JetBrains Mono, "//" ExtraBold in #0055ff, "iframely" Bold) in scenes and animations. One idea runs through all of them: the two slashes are the slashes of a URL. Some are header and loading-state ideas, some are hero or poster ideas.' },
    { id: 'illustrations', title: 'Product illustrations', groups: ['ill'], intro: 'Small static illustrations for the prototype product pages, after the line-diagram reference (mono labels, thin black lines, one accent) with Iframely blue as the accent. One set per product page, with that page’s feature titles and copy. Each card copies its SVG.' },
  ];
  const CODE = { hero: 'H', bg: 'B', pd: 'P', pdw: 'P', sec: 'S', pal: 'K', pdp: 'C', logo: 'L', ill: 'I' };
  const h = DEMOS.h; let unmounts = [], io = null;
  const nav = document.getElementById('nav'), main = document.getElementById('main');
  function resolve(hash) {
    const key = (hash || '').replace(/^#/, '');
    if (PAGES.some(p => p.id === key)) return [key, null];
    const d = DEMOS.get(key); if (d) { const pg = PAGES.find(p => p.groups.includes(d.group)); if (pg) return [pg.id, key]; }
    return [PAGES[0].id, null];
  }
  function render() {
    const [pid, demo] = resolve(location.hash); const page = PAGES.find(p => p.id === pid);
    nav.innerHTML = '';
    for (const p of PAGES) {
      nav.appendChild(h('a', { href: '#' + p.id, class: 'pg' + (p.id === pid ? ' on' : '') }, p.title));
      if (p.id === pid) { const sub = h('div', { class: 'sub' }); let i = 0; for (const g of p.groups) for (const d of DEMOS.list(g)) { i++; sub.appendChild(h('a', { href: '#' + d.name, class: d.name === demo ? 'on' : '' }, h('code', null, CODE[g] + String(i).padStart(2, '0')), d.title, d.pick ? h('span', { class: 'pk' + (d.pick === 'maybe' ? ' maybe' : '') }, d.pick === 'maybe' ? '?' : '★') : null)); } nav.appendChild(sub); }
    }
    unmounts.forEach(u => { try { u(); } catch (e) { console.warn(e); } }); unmounts = []; if (io) io.disconnect();
    main.innerHTML = ''; main.append(h('h1', null, page.title), h('p', { class: 'intro' }, page.intro));
    const cards = h('div', { class: 'cards' }); main.appendChild(cards); let i = 0;
    for (const g of page.groups) for (const d of DEMOS.list(g)) {
      i++; const frame = h('div', { class: 'frame g-' + ((d.alias && DEMOS.get(d.alias) && DEMOS.get(d.alias).group) || g), 'data-demo': d.name });
      cards.appendChild(h('article', { class: 'card', id: 'card-' + d.name },
        h('header', null, h('h3', null, h('code', null, CODE[g] + String(i).padStart(2, '0')), d.title, d.pick ? h('span', { class: 'pick' + (d.pick === 'maybe' ? ' maybe' : '') }, d.pick === 'maybe' ? 'maybe' : '★ ' + d.pick) : null), h('a', { href: 'demo.html#' + d.name }, 'open full screen ↗'), h('p', null, d.blurb)), frame));
    }
    io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); try { unmounts.push(DEMOS.mount(e.target, e.target.dataset.demo)); } catch (err) { console.error(err); e.target.appendChild(h('div', { class: 'fallback' }, 'failed: ' + err.message)); } } }, { rootMargin: '400px 0px' });
    cards.querySelectorAll('.frame').forEach(f => io.observe(f));
    document.title = page.title + ' · Iframely Motion Lab';
    if (demo) { const el = document.getElementById('card-' + demo); if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })); } else scrollTo(0, 0);
  }
  addEventListener('hashchange', render); render();
  const btn = document.getElementById('pause');
  btn.addEventListener('click', () => { DEMOS.setPaused(!DEMOS.paused); btn.textContent = DEMOS.paused ? 'Resume all' : 'Pause all'; });
  document.getElementById('note').textContent = (window.Motion && window.Motion.__shim ? 'Motion CDN unreachable, using the built-in shim' : 'Motion 12 loaded') + (DEMOS.reduced ? ' · reduced motion: still frames' : '');
})();
