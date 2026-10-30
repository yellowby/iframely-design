/* L40–L45 · more of L38/L39: the same hero (requests grow out of an automaton, then are handed back to it), with other
   rules, grids and looks. All use the engine K.cellsHero from demos/logo11.js; only the options differ.
   L40 dots      Life on a fine square grid drawn as round dots, so the shapes are not stretched by the text rows.
   L41 sparks    Brian's Brain (B2/S/3): every live cell fires once and rests; restless sparks. Organic growth. Stream.
   L42 ripples   an excitable medium (two firing neighbours excite, then a long rest): rings spread from random drops and
                 from the text when it is let go, and cancel where they meet. Organic growth.
   L43 islands   Day & Night (B3678/S34678) on the fine grid, only the shorelines drawn: slow islands that the requests
                 cut holes in and the released text joins. Organic growth. Stream.
   L44 star wars B2/S345/4: crawling, branching structure on the character grid. Organic growth.
   L45 ripples in type: the excitable medium on the character grid, rings of # with + : . behind them. Stream. */
(() => {
  const K = DEMOS.logoKit, M = (o, multi) => stage => K.cellsHero(stage, multi, o);
  const WAVE = [2, 3, 4, 5, 6, 7, 8]; /* excited by two or more: broken ends retract, so no spirals take over */
  const V = [
    ['logo-hero-cells-dots', 'Hero: a living grid of dots', false, { fine: true, look: 'dots', soupW: 12, soupH: 8 },
      'L38 on a finer grid: square cells one character wide, drawn as round dots, so Life keeps its proper shapes (gliders, blinkers, ponds) instead of being stretched by the text rows. The text is handed over as little columns of live cells.'],
    ['logo-hero-sparks-stream', 'Hero: requests among sparks', true, { B: [2], S: [], C: 3, density: .08, soup: .1, minLive: .01, grow: 'organic', live: () => '*' },
      "Brian's Brain: a cell fires when exactly two neighbours fire, then rests for a step. The background never settles, sparks run in all directions. Requests grow out along an uneven front instead of a circle, and come apart from a few points at once."],
    ['logo-hero-ripples', 'Hero: ripples', false, { B: WAVE, S: [], C: 9, pB: .99, GR: 16, fine: true, look: 'dots', density: 0, soup: 0, minLive: 0, speck: .3, speckR: 1, grow: 'organic' },
      'An excitable medium on the fine grid: a resting cell fires when two or more neighbours fire, then needs a long rest. Random drops send out rings like rain on a pond; rings cancel where they meet, are cut by the request and close up again, and when the text is let go it sends out its own wave. Two neighbours rather than one keeps the corners round and lets broken ends heal instead of curling into spirals that would fill the screen.'],
    ['logo-hero-islands-stream', 'Hero: requests between islands', true, { B: [3, 6, 7, 8], S: [3, 4, 6, 7, 8], C: 2, GR: 6, fine: true, look: 'edges', density: .5, soup: 0, minLive: 0, grow: 'organic', alpha: .45 },
      'Day & Night on the fine grid, drawing only the shorelines: slow islands that grow and shrink like a map. Requests cut holes in them; the text that is let go joins the nearest shore or melts away.'],
    ['logo-hero-starwars', 'Hero: one request in a crawling grid', false, { B: [2], S: [3, 4, 5], C: 4, GR: 10, density: .12, soup: .3, minLive: .02, grow: 'organic' },
      'Star Wars (B2/S345/4): branching, crawling structure with short trails, busier than Life. The request grows along an uneven front and is handed back from a few points at once.'],
    ['logo-hero-ripples-type-stream', 'Hero: ripples in type', true, { B: WAVE, S: [], C: 5, pB: .99, GR: 12, density: 0, soup: 0, minLive: 0, speck: .1, speckR: 1, alpha: .4, live: () => '#' },
      'L42 on the character grid: rings of # with + : . trailing behind, tall like the text rows; they cancel out where they meet. Several requests at once; each dissolves into its own set of rings.'],
  ];
  for (const [id, title, multi, o, blurb] of V) DEMOS.register(id, { group: 'logo', title, blurb, mount: M(o, multi) });
})();
