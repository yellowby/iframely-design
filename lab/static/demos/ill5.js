/* I15 · one system, other hues: the I13 Tint drawings (demos/ill3.js, unchanged) with the whole palette moved to another
   primary hue: tile, lines, accent and tints all come from one colour, the way Tint does it with Iframely blue.
   "Mixed" gives each feature row its own hue, as a product page with coloured tiles would; the other buttons put every
   drawing in one hue. localStorage 'ill5-hue'. Group 'ill', mount(stage). */
(() => {
  const T = (bg, K, B, B2, B3, G, M) => ({ bg, K, B, B2, B3, G, M });
  /* tile, line, primary, primary mid, primary light, grey, muted: each from its own hue */
  const HUES = {
    blue: { label: 'Blue', c: T('#eef3ff', '#0b1533', '#0055ff', '#8fb2ff', '#d3e1ff', '#c4d2ee', '#56648a') }, /* = I13 Tint */
    violet: { label: 'Violet', c: T('#f1eeff', '#1a1338', '#6a3df5', '#b3a1ff', '#ded6ff', '#cfc6ef', '#625a85') },
    green: { label: 'Green', c: T('#eaf7f0', '#0d2419', '#0a9a5c', '#7fd3a9', '#c6ecd8', '#bcdccb', '#4f6d5e') },
    coral: { label: 'Coral', c: T('#fff0ea', '#2b140c', '#f2552c', '#ffab90', '#ffd8ca', '#efcdbf', '#7f5a4c') },
    amber: { label: 'Amber', c: T('#fff6dc', '#2a2008', '#c98500', '#f2c75a', '#fbe6a8', '#e8d9a9', '#6f6342') },
    pink: { label: 'Pink', c: T('#fdeef4', '#2e0f1e', '#d6336c', '#f59bbd', '#f9d3e2', '#ecc6d6', '#7a5466') },
    sky: { label: 'Sky', c: T('#e8f6fb', '#0b2230', '#0b8bc2', '#82cbe8', '#c7e9f6', '#bcdbe7', '#4d6a78') },
  };
  const ORDER = Object.keys(HUES).filter(k => k !== 'blue'); /* Mixed keeps to the other hues */
  const KEYS = [
    ['hosted', 'Hosted iframes', 'We wrap third-party embed code in our own iframe: isolated, sized before it loads, with a fallback.'],
    ['ids', 'Content IDs', 'A short, permanent ID per URL. Use it as the iframe source and old posts update themselves.'],
    ['evergreen', 'Evergreen refresh', 'Thumbnails expire, players move. Hosted embeds follow the change; copied code does not.'],
    ['click', 'Click-to-play', 'A cover image first; the player loads only when the reader presses play.'],
    ['consent', 'Consent gates', 'Ask before loading third-party media that sets cookies. One parameter to turn on.'],
    ['heights', 'Predicted heights', 'Space is reserved before the embed loads, so the page does not jump.'],
  ];
  const TAKES = ['Diagram', 'Interface', 'Mark'];
  const theme = id => ({ id: 'h-' + id, tile: true, c: HUES[id].c });
  const KEY = 'ill5-hue'; let current = 'mixed';
  try { current = localStorage.getItem(KEY) || current; } catch (e) {}
  if (current !== 'mixed' && !HUES[current]) current = 'mixed';

  DEMOS.register('ill-system-rich-hues', {
    group: 'ill', title: 'Rich Media · one system, other hues',
    blurb: 'The I13 Tint drawings with the whole palette in another primary colour instead of Iframely blue: tile, lines, accent and tints all from one hue (violet, green, coral, amber, pink, sky; Blue is I13 Tint for comparison). Mixed gives each feature its own hue. Same parts, sizes and caption baseline. Hover a drawing to copy its SVG.',
    mount(stage) {
      const { h } = DEMOS;
      if (!document.getElementById('css-ill3')) document.head.appendChild(h('style', { id: 'css-ill3' }, DEMOS.ill3Css()));
      const body = h('div');
      const btns = [['mixed', 'Mixed'], ...Object.keys(HUES).map(k => [k, HUES[k].label])].map(([k, label]) => {
        const b = h('button', { type: 'button', 'data-k': k }, label);
        if (k !== 'mixed') b.style.boxShadow = `inset 0 -3px 0 ${HUES[k].c.B}`;
        b.addEventListener('click', () => { current = k; try { localStorage.setItem(KEY, k); } catch (e) {} dispatchEvent(new CustomEvent('ill5-hue')); });
        return b;
      });
      const copy = markup => { const btn = h('button', { class: 'il3-copy', type: 'button' }, 'copy svg'); btn.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(markup) : Promise.reject()).then(() => { btn.textContent = 'copied'; }, () => { btn.textContent = 'copy failed'; }); setTimeout(() => { btn.textContent = 'copy svg'; }, 1400); }); return btn; };
      const render = () => {
        btns.forEach(b => b.classList.toggle('on', b.dataset.k === current));
        body.replaceChildren(...KEYS.map(([key, title, text], row) => {
          const hue = current === 'mixed' ? ORDER[row % ORDER.length] : current;
          return h('div', { class: 'il3-row' }, h('div', { class: 'il3-head' }, h('h4', null, title), h('p', null, text)),
            ...TAKES.map((tk, i) => { const markup = DEMOS.ill3Art(key, i, theme(hue)); const lab = h('div', { class: 'tk' }, tk); lab.style.color = HUES[hue].c.B; return h('div', { class: 'il3-cell' }, copy(markup), h('div', { html: markup }), lab); }));
        }));
      };
      render(); addEventListener('ill5-hue', render);
      stage.appendChild(h('div', { class: 'il3' }, h('div', { class: 'il3-bar' }, h('span', null, 'Diagram · Interface · Mark'), h('div', null, ...btns)), body));
      return () => removeEventListener('ill5-hue', render);
    },
  });
})();
