/* L46–L49 · the cell hero (K.cellsHero, demos/logo11.js) with the text style asked for after L45, and backgrounds made of
   the mark's own characters, kept faint:
   - the URL is blue, everything else stays in greys; the // spins while the request runs and turns into ✓ (or ✕) when it
     is done, with no status code after the URL; the response is indented three spaces so it lines up with the URL;
   - live cells are drawn as / \ < > - by the way they move (away from their own trail), edges by the way they run;
     the cells that flicker as a request grows are / and >.
   L46 ripples: rings of > < / \ on the fine grid. L47 sparks: Brian's Brain tracers on the character grid (stream).
   L48 gliders: Life spaceships crossing on diagonals, as small / \ arrows; they crash into requests. L49 contours:
   Anneal islands traced with - / | \ (stream). */
(() => {
  const K = DEMOS.logoKit, M = (o, multi) => stage => K.cellsHero(stage, multi, Object.assign({ v2: true, marks: true, bg: .45, flick: ['/', '>'], grow: 'organic' }, o));
  const WAVE = [2, 3, 4, 5, 6, 7, 8];
  const V = [
    ['logo-hero-marks-ripples', 'Hero: ripples of slashes', false, { B: WAVE, S: [], C: 6, pB: .99, GR: 16, fine: true, density: 0, soup: 0, minLive: 0, speck: .3, speckR: 1 },
      'Faint rings spread from random drops, drawn with the mark’s own characters: > and < where a ring moves sideways, / and \\ on the diagonals, - up and down, a short : . trail behind. The URL is blue; its // spins and turns into ✓ (✕ for the dead link) when the response is in; the response is indented to line up with the URL. When it is let go the text sends out its own ring.'],
    ['logo-hero-marks-sparks-stream', 'Hero: requests among slash sparks', true, { B: [2], S: [], C: 3, density: .06, soup: .08, minLive: .008, alpha: .42 },
      'Brian’s Brain on the character grid, drawn as tracers: every spark is a / \\ < > or - pointing the way it flies. Several requests at once, same text style: blue URL, // → ✓, response aligned with the URL.'],
    ['logo-hero-marks-gliders', 'Hero: gliders crossing', false, { B: [3], S: [2, 3], C: 4, GR: 12, fine: true, density: 0, soup: 0, minLive: 0, gliders: .2, erode: .01, alpha: .6 },
      'Life with nothing in it but gliders: small spaceships set off on the diagonals now and then and cross the hero as faint / \\ arrows. They crash into a request or each other and leave a little ash (a still block shows as a tiny //), which clears in a few seconds; the released text breaks up into more of the same.'],
    ['logo-hero-marks-contours-stream', 'Hero: requests between contour lines', true, { B: [4, 6, 7, 8], S: [3, 5, 6, 7, 8], C: 2, GR: 5, fine: true, look: 'edges', density: .5, soup: 0, minLive: 0, alpha: .3 },
      'Anneal (B4678/S35678, a majority vote) settles into smooth islands that keep creeping; only their outlines are drawn, in - / | \\ by the way each edge runs, like a faint contour map. Requests cut holes in it; released text joins the shore. Several at once.'],
  ];
  for (const [id, title, multi, o, blurb] of V) DEMOS.register(id, { group: 'logo', title, blurb, mount: M(o, multi) });
})();
