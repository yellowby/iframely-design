/* pd-pastel · the seven product scenes again, each on a B06 pastel blob panel (lib/blobs.js) with the eyebrow as a
   matching chip. Registered as copies in group 'pdp' so the paper originals stay untouched. Load after the pd-*.js files. */
(() => {
  const PASTELS = {
    'pd-one-url': ['pink', 'sky', 'mint', 'sand', 'lavender', 'peach'],
    'pd-camera': ['sky', 'lavender', 'pink'],
    'pd-lifecycle': ['mint', 'sky', 'sand'],
    'pd-publisher': ['sand', 'peach', 'mint'],
    'pd-extract': ['mint', 'sky', 'lavender'],
    'pd-formats': ['pink', 'lavender', 'sky'],
    'pd-terminal': ['mint', 'sky', 'sand'],
  };
  for (const [base, pastel] of Object.entries(PASTELS)) {
    const d = DEMOS.get(base); if (!d) continue;
    DEMOS.register(base + '-pastel', Object.assign({}, d, { name: base + '-pastel', group: 'pdp', pastel, title: d.title + ' · on pastel', blurb: 'The same scene on a B06 pastel panel (' + pastel.slice(0, 3).join(', ') + '), the cards on paper, the eyebrow as a chip in the first pastel. ' + d.blurb }));
  }
})();
