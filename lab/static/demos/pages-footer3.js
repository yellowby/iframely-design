/* G · Page content: footers, round 3 (2026-11-05, group 'pg'). Explorations of the logo at the bottom of G42: single
   colours, gradients and fades, patterns, and a few other ideas. Every floor is the new //iframely as one SVG <text>
   stretched to ten JetBrains Mono cells (600 × 100 units, baseline at 76), so fills, masks and patterns apply directly.
   DEMOS.footerFloor(I, id) is used by the gallery (G43) and by G42's Floor switch. Needs pages-footer.js (footerKit). */
(() => {
  const K = () => DEMOS.cvKit2, F = () => DEMOS.footerKit;
  const SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const H = (...a) => K().div(...a);
  let uid = 0;

  /* the word as SVG text; sl/wd are attribute strings for the two tspans */
  const word = (sl, wd, extra = '') => `<text x="0" y="76" font-family="JetBrains Mono, monospace" font-size="100" textLength="600" lengthAdjust="spacingAndGlyphs" ${extra}><tspan font-weight="800" ${sl}>//</tspan><tspan font-weight="700" ${wd}>iframely</tspan></text>`;
  const fill = c => `fill="${c}"`;
  const vgrad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}" gradientUnits="objectBoundingBox">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  /* a mask that fades the logo vertically (in user units, the letters run from y≈4 to y≈96) */
  const fadeMask = (id, from, to) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse"><stop offset="${from[0]}" stop-color="#fff" stop-opacity="${from[1]}"/><stop offset="${to[0]}" stop-color="#fff" stop-opacity="${to[1]}"/></linearGradient><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="-20" width="600" height="140"><rect x="0" y="-20" width="600" height="140" fill="url(#${id}g)"/></mask>`;

  const FLOORS = [
    ['brand', 'Blue //, ink word', 'single', I => word(fill(I.acc), fill(I.ink))],
    ['ink', 'All ink', 'single', I => word(fill(I.ink), fill(I.ink))],
    ['blue', 'All blue', 'single', I => word(fill(I.acc), fill(I.acc))],
    ['tone', 'Tone on tone', 'single', I => word(fill(I.dark ? '#1d1d1d' : '#ececec'), fill(I.dark ? '#1d1d1d' : '#ececec'))],
    ['outline', 'Hairline outline', 'single', I => word(`fill="none" stroke="${I.acc}" stroke-width=".7"`, `fill="none" stroke="${I.ink}" stroke-width=".7"`)],
    ['fadedown', 'Fades into the edge', 'fade', (I, u) => `<defs>${fadeMask(u, [.25, 1], [.92, 0])}</defs><g mask="url(#${u})">${word(fill(I.acc), fill(I.ink))}</g>`],
    ['fadeup', 'Rises out of the ground', 'fade', (I, u) => `<defs>${fadeMask(u, [.05, 0], [.7, 1])}</defs><g mask="url(#${u})">${word(fill(I.acc), fill(I.ink))}</g>`],
    ['sink', 'Blue sinking to the page', 'fade', (I, u) => `<defs>${vgrad(u, [[0, I.acc], [.95, I.bg]])}</defs>${word(fill(`url(#${u})`), fill(`url(#${u})`))}`],
    ['across', 'Blue to ink, across', 'fade', (I, u) => `<defs>${vgrad(u, [[0, I.acc], [.55, I.ink], [1, I.ink]], 1, 0)}</defs>${word(fill(`url(#${u})`), fill(`url(#${u})`))}`],
    ['ghost', 'Ghost with a crisp edge', 'fade', I => word(`fill="${I.ink}" fill-opacity=".05" stroke="${I.acc}" stroke-width=".5"`, `fill="${I.ink}" fill-opacity=".05" stroke="${I.ink}" stroke-opacity=".5" stroke-width=".5"`)],
    ['lines', 'Scan lines', 'pattern', (I, u) => `<defs><pattern id="${u}a" width="600" height="3.2" patternUnits="userSpaceOnUse"><rect width="600" height="1.6" fill="${I.acc}"/></pattern><pattern id="${u}b" width="600" height="3.2" patternUnits="userSpaceOnUse"><rect width="600" height="1.6" fill="${I.ink}"/></pattern></defs>${word(fill(`url(#${u}a)`), fill(`url(#${u}b)`))}`],
    ['dots', 'Halftone, fading', 'pattern', (I, u) => `<defs><pattern id="${u}a" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.05" fill="${I.acc}"/></pattern><pattern id="${u}b" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.05" fill="${I.ink}"/></pattern>${fadeMask(u, [.2, 1], [.95, .15])}</defs><g mask="url(#${u})">${word(fill(`url(#${u}a)`), fill(`url(#${u}b)`))}</g>`],
    /* small SVG text renders with holes in Chrome (in a <pattern> and under a text clipPath alike), so this floor is
       drawn on a canvas: rows of small //iframely, kept only inside the logo's letters, the slashes' part in blue.
       Returned as an <image> inside the same 600 × 100 viewBox. */
    ['typed', 'Written in itself', 'pattern', I => {
      const S = 4, cv = document.createElement('canvas'); cv.width = 600 * S; cv.height = 100 * S; const g = cv.getContext('2d');
      g.fillStyle = I.ink; g.font = `800 ${2.5 * S}px "JetBrains Mono", monospace`;
      for (let i = 0; i < 40; i++) g.fillText('//iframely'.repeat(42), -(i * 1.5 % 15) * S, (2.2 + i * 2.55) * S);
      const m = document.createElement('canvas'); m.width = cv.width; m.height = cv.height; const mg = m.getContext('2d');
      mg.font = `800 ${100 * S}px "JetBrains Mono", monospace`; mg.fillText('//', 0, 76 * S); const sw = mg.measureText('//').width;
      mg.font = `700 ${100 * S}px "JetBrains Mono", monospace`; mg.fillText('iframely', sw, 76 * S);
      g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0);
      g.globalCompositeOperation = 'source-atop'; g.fillStyle = I.acc; g.fillRect(0, 0, sw, 100 * S);
      return `<image href="${cv.toDataURL()}" x="0" y="0" width="600" height="100"/>`;
    }],
    ['split', 'Above and below the line', 'other', (I, u) => `<defs><clipPath id="${u}t"><rect x="-10" y="-30" width="620" height="78"/></clipPath><clipPath id="${u}b"><rect x="-10" y="48" width="620" height="80"/></clipPath></defs><g clip-path="url(#${u}t)">${word(fill(I.acc), fill(I.ink))}</g><g clip-path="url(#${u}b)">${word(fill(I.dark ? '#1d1d1d' : '#e6e6e6'), fill(I.dark ? '#1d1d1d' : '#e6e6e6'))}</g><line x1="-40" x2="640" y1="48" y2="48" stroke="${I.line}" stroke-width=".6"/>`],
    ['echo', 'Echo, stepping down', 'other', I => [12, 8, 4].map((d, i) => `<g transform="translate(0 ${d})" opacity="${[.18, .32, .55][i]}">${word(`fill="none" stroke="${I.acc}" stroke-width=".5"`, `fill="none" stroke="${I.ink}" stroke-width=".5"`)}</g>`).join('') + word(fill(I.acc), fill(I.ink))],
    ['extrude', 'Extruded', 'other', I => Array.from({ length: 7 }, (_, i) => `<g transform="translate(${(7 - i) * .9} ${(7 - i) * .9})">${word(fill(I.dark ? '#262626' : '#dcdcdc'), fill(I.dark ? '#262626' : '#dcdcdc'))}</g>`).join('') + word(fill(I.acc), fill(I.ink))],
    ['slices', 'Sliced and shifted', 'other', (I, u) => Array.from({ length: 6 }, (_, i) => `<defs><clipPath id="${u}${i}"><rect x="-20" y="${i * 17}" width="640" height="${i === 5 ? 40 : 17}"/></clipPath></defs><g clip-path="url(#${u}${i})" transform="translate(${[0, 6, -4, 10, -8, 3][i]} 0)">${word(fill(I.acc), fill(I.ink))}</g>`).join('')]
  ];
  const GROUPS = { single: 'Single colour', fade: 'Gradient and fade', pattern: 'Pattern', other: 'Other' };
  /* one floor as an SVG; height of the visible slice is set by the caller (the svg overflows below) */
  DEMOS.footerFloor = (I, id) => { const f = FLOORS.find(x => x[0] === id) || FLOORS[0], u = 'flr' + ++uid;
    return `<svg viewBox="0 0 600 100" style="display:block;width:100%;height:auto;overflow:visible" aria-hidden="true">${f[3](I, u)}</svg>`; };
  DEMOS.footerFloors = FLOORS.map(f => [f[0], f[1]]);
  /* G42 registered before this file loaded: give its Floor switch the full list */
  try { const g42 = DEMOS.get('pg-ft-tree-floor'), o = g42 && g42.def && g42.def.opts.find(x => x.key === 'mk'); if (o) o.values = DEMOS.footerFloors; } catch (e) {}

  /* ------------------------------------------------------------ G43 the floors, side by side */
  F().fcard('pg-ft-floors', 'Footer floors: the logo at the bottom, seventeen ways', 'The end of G42 (the copyright row and the //iframely logo cut by the bottom edge) repeated with different treatments, grouped as single colour, gradient and fade, pattern, and other ideas. Each floor is the same SVG text, so any of them can go into G42 through its Floor switch. Cut sets how much of the logo shows.', (I, s) => {
    const el = H(`background:${I.bg};padding:24px 0 8px;font-family:${SANS}`), cut = { half: 92, mid: 118, full: 200 }[s.cut];
    Object.entries(GROUPS).forEach(([g, gl]) => {
      if (s.only !== 'all' && s.only !== g) return;
      el.appendChild(H(`padding:28px 56px 6px;font:500 12px ${GMONO};letter-spacing:.04em;text-transform:uppercase;color:${I.mute}`, gl));
      FLOORS.filter(f => f[2] === g).forEach(f => el.appendChild(H('margin-top:14px', `<div style="padding:0 56px;display:flex;justify-content:space-between;font:400 12px ${GMONO};color:${I.mute}"><span style="color:${I.ink}">${f[1]}</span><span>${f[0]}</span></div><div style="margin:8px 0 0;box-shadow:inset 0 1px 0 ${I.line},inset 0 -1px 0 ${I.line}"><div style="padding:12px 56px;display:flex;justify-content:space-between;font:400 13px ${GMONO};color:${I.mute}"><span>© 2012–2026 Itteco Software Corp. Ottawa, Canada.</span><span>${F().SINCE}</span></div><div style="height:${cut}px;overflow:hidden;padding:0 40px">${DEMOS.footerFloor(I, f[0])}</div></div>`)));
    });
    return el;
  }, [{ key: 'only', label: 'Show', values: [['all', 'All'], ...Object.entries(GROUPS)] }, { key: 'cut', label: 'Cut', values: [['half', 'Half'], ['mid', 'As G42'], ['full', 'Whole']] }], { only: 'all', cut: 'mid' });
})();
