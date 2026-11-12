/* X · Dither sections, round 2 (2026-11-05): Iframely API responses as the dither (group 'dtx', X07–X12).
   The idea: the texture IS the data. A field still decides density, but where it is dense the cells write the real
   response (JSON keys and values, rel tags, provider domains, the request line), legible at the core and eroding into
   . and : at the edges, the way a URL resolves into data. JSON keys take a second ink, like a code editor.
   Responses are real Iframely results captured for the logo scenes (demos/logo15.js), with the API key and the iframe
   src shortened; the Data API sample follows the docs; the Publisher Console policy is an illustrative mock.
   Needs dither-sections.js (DEMOS.sectionsKit) and dither-stills2.js (DEMOS.typeKit). */
(() => {
  const X = () => DEMOS.sectionsKit, T = () => DEMOS.typeKit, K = () => DEMOS.ditherKit;
  const MONO = '"JetBrains Mono", ui-monospace, monospace', GEIST = 'Geist, Inter, sans-serif';
  const IFR = 'https://iframely.net/api/iframe?url=…';

  /* ------------------------------------------------------------ responses */
  const RESP = {
    video: { label: 'YouTube video', prod: 'rich', api: 'iframely', u: 'youtu.be/dQw4w9WgXcQ', q: '&iframe=1', ms: 212, site: 'youtube.com', title: 'Rick Astley - Never Gonna Give You Up (Official Video)', desc: 'Rick Astley · 2009 · 3:34', kind: 'video', lines: [
      '{', '  "meta": {', '    "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",', '    "site": "YouTube",', '    "medium": "video",', '    "duration": 214,',
      '    "canonical": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"', '  },', '  "links": {', '    "player": [{', '      "href": "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",',
      '      "media": { "aspect-ratio": 1.778 }', '    }]', '  },', '  "rel": ["player", "inline", "html5", "ssl", "hosted"],', `  "html": "<iframe src=\\"${IFR}\\" allowfullscreen></iframe>"`, '}'] },
    card: { label: 'GitHub card', prod: 'preview', api: 'iframely', u: 'github.com/itteco/iframely', q: '&card=small', ms: 131, site: 'github.com', title: 'itteco/iframely', desc: 'The URL engine behind Iframely. Self-hosted parsers that turn links into metadata, previews and embeds.', kind: 'link', lines: [
      '{', '  "meta": {', '    "title": "GitHub - itteco/iframely: The URL engine behind Iframely",', '    "description": "Self-hosted parsers that turn links into metadata, previews and embeds.",', '    "site": "GitHub",', '    "medium": "link",',
      '    "canonical": "https://github.com/itteco/iframely"', '  },', '  "links": {', '    "thumbnail": [{', '      "href": "https://opengraph.githubassets.com/73d156df/itteco/iframely",', '      "media": { "width": 1200, "height": 600 }', '    }]', '  },',
      '  "rel": ["summary", "card", "small", "inline", "html5", "ssl"],', `  "html": "<iframe src=\\"${IFR}&card=small\\"></iframe>"`, '}'] },
    audio: { label: 'SoundCloud track', prod: 'rich', api: 'iframely', u: 'soundcloud.com/bonobo/kerala', q: '&playerjs=1', ms: 247, site: 'soundcloud.com', title: 'Kerala by bonobo', desc: 'bonobo · SoundCloud', kind: 'audio', lines: [
      '{', '  "meta": {', '    "title": "Kerala by bonobo",', '    "author": "bonobo",', '    "site": "SoundCloud",', '    "medium": "audio"', '  },', '  "links": {', '    "thumbnail": [{', '      "href": "https://i1.sndcdn.com/artworks-nd5do3eR82sw-0-t500x500.jpg",',
      '      "media": { "width": 500, "height": 500 }', '    }]', '  },', '  "rel": ["player", "audio", "html5", "ssl", "hosted", "playerjs"],', `  "html": "<iframe src=\\"${IFR}&playerjs=1\\"></iframe>"`, '}'] },
    data: { label: 'Data API · Wikipedia', prod: 'data', api: 'data', u: 'en.wikipedia.org/wiki/Bonobo_(musician)', q: '&mode=assist', ms: 164, site: 'en.wikipedia.org', title: 'Bonobo (musician)', desc: 'Simon Charles Green, known by his stage name Bonobo, is an English musician, producer and DJ.', kind: 'doc', lines: [
      '{', '  "meta": { "title": "Bonobo (musician)", "site": "Wikipedia", "language": "en" },', '  "excerpt": "Simon Charles Green, known by his stage name Bonobo, is an English musician.",', '  "access": {',
      '    "requested": { "modes": ["assist"], "use": "reference" },', '    "signals": {', '      "license": { "common_name": "CC BY-SA 4.0" },', '      "robots.txt": { "status": 200 }', '    },',
      '    "decision": { "fulltext": { "allowed": true, "promoted_by": ["license"] } }', '  },', '  "fulltext": "# Bonobo (musician)\\n\\nSimon Charles Green, known by his stage name…"', '}'] },
    policy: { label: 'Console policy (mock)', prod: 'pub', api: 'console', u: 'example-news.com/articles/*', q: '', ms: 38, site: 'example-news.com', title: 'Example News · /articles/*', desc: 'Previews allowed. Data API: assist and reference only, excerpt 300 characters.', kind: 'link', lines: [
      '{', '  "domain": "example-news.com",', '  "path": "/articles/*",', '  "verified": { "dns": true, "since": "2026-09-14" },', '  "agents": {', '    "iframely-preview": { "allow": true },',
      '    "iframely-data": { "modes": ["assist"], "use": ["reference"] }', '  },', '  "policy": {', '    "excerpt": 300,', '    "fulltext": false,', '    "license": "© Example News"', '  },', '  "test": { "url": "/articles/2026/11/rates", "mode": "ai-input", "result": "denied" }', '}'] },
  };
  const PROD_RESP = { rich: 'video', preview: 'card', data: 'data', pub: 'policy' };
  const RESP_OPT = { key: 'resp', label: 'Response', values: Object.entries(RESP).map(([k, v]) => [k, v.label]) };
  const VOCAB = {
    keys: { label: 'Meta keys', words: ['"title"', '"author"', '"site"', '"medium"', '"duration"', '"canonical"', '"thumbnail"', '"player"', '"html"', '"href"', '"media"', '"aspect-ratio"', '"excerpt"', '"fulltext"', '"access"', '"license"', '"decision"', '"allowed"', '"rel"', '"date"', '"description"', '"language"'] },
    rel: { label: 'rel tags', words: ['player', 'inline', 'html5', 'ssl', 'hosted', 'playerjs', 'summary', 'card', 'small', 'audio', 'video', 'image', 'reader', 'app', 'autoplay', 'promo', 'thumbnail', 'icon', 'logo', 'file'] },
    domains: { label: 'Provider domains', words: ['youtube.com', 'vimeo.com', 'figma.com', 'spotify.com', 'soundcloud.com', 'github.com', 'maps.google.com', 'tiktok.com', 'instagram.com', 'x.com', 'codepen.io', 'loom.com', 'miro.com', 'docs.google.com', 'wikipedia.org', 'twitch.tv', 'dailymotion.com', 'bandcamp.com', 'giphy.com', 'reddit.com', 'flickr.com', 'canva.com'] },
    mixed: { label: 'Keys + values', words: null },
  };

  /* ------------------------------------------------------------ text → glyph sets */
  /* per character: k = key (a quoted string before a colon), s = string value, n = number / literal, p = punctuation */
  function classify(line) {
    const c = new Array(line.length).fill(' '); let i = 0;
    while (i < line.length) {
      const ch = line[i];
      if (ch === '"') { let j = i + 1; while (j < line.length && !(line[j] === '"' && line[j - 1] !== '\\')) j++; let k = j + 1; while (line[k] === ' ') k++; const key = line[k] === ':'; for (let m = i; m <= Math.min(j, line.length - 1); m++) c[m] = key ? 'k' : 's'; i = j + 1; }
      else { c[i] = ch === ' ' ? ' ' : /[0-9a-z.\-#©]/i.test(ch) ? 'n' : 'p'; i++; }
    }
    return c;
  }
  /* a set reading text from map(i, j) → [line, column]: below level 3 only . and : where the text has a character (so the haze
     keeps the text's shape), from 3 up the real character in 400 / 600 / 800 (heaviest in ink b) */
  function textSet(lines, map, cls) {
    const C = cls || lines.map(classify);
    const at = (i, j) => { const m = map(i, j); return m ? (lines[m[0]] || '')[m[1]] || ' ' : ' '; };
    const clsAt = (i, j) => { const m = map(i, j); return m ? (C[m[0]] || '')[m[1]] || ' ' : ' '; };
    const real = (wt, b) => ({ ch: (i, j) => at(i, j), wt, b: b ? 1 : 0 });
    const haze = c => ({ ch: (i, j) => (at(i, j) !== ' ' ? c : ' '), wt: 400 });
    return { lv: [null, haze('.'), haze(':'), real(400), real(600), real(800, 1)], at, clsAt };
  }
  /* the response tiled as blocks, each column of blocks shifted down so the repeats don't line up */
  const tileMap = (lines, ox, oy, maxW) => { const bw = Math.min(maxW || 84, Math.max(...lines.map(l => l.length))) + 4, n = lines.length;
    return (i, j) => { if (i < ox) return null; const bi = Math.floor((i - ox) / bw), ci = (i - ox) % bw; if (ci >= bw - 4) return null; return [(((j - oy + bi * 7) % n) + n) % n, ci]; }; };
  /* one long string, wrapped row by row */
  function streamSet(str, cls, cols, off) { const L = str.length; const lines = [str]; const map = (i, j) => [0, (j * cols + i + (off || 0)) % L]; return textSet(lines, map, [cls || classify(str)]); }
  const minify = lines => lines.map(l => l.trim()).join(' ');
  /* compact JSON: no whitespace outside strings, so a shape filled with it has no holes */
  const compact = lines => { const s = minify(lines); let out = '', inS = false; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === '"' && s[i - 1] !== '\\') inS = !inS; if (!inS && c === ' ') continue; out += c; } return out; };
  function vocabStream(key, seed, sep) { /* sep: what joins the words; '·' packs them tight for masks */
    if (key === 'mixed') { const s = sep ? compact(RESP.video.lines) + compact(RESP.card.lines) : minify(RESP.video.lines) + '  ' + minify(RESP.card.lines) + '  '; return { s, c: classify(s) }; }
    const w = VOCAB[key].words.slice(); for (let i = w.length - 1; i > 0; i--) { const j = Math.floor(T().hash(i, 7, seed) * (i + 1)); [w[i], w[j]] = [w[j], w[i]]; }
    const s = w.join(sep || '  ') + (sep || '  '), c = classify(s).map((x, i) => (x === ' ' ? ' ' : key === 'keys' ? 'k' : 's')); return { s, c };
  }
  /* JSON keys into the second ink pair (c/d), like a code editor */
  const keyTint = set => lay => { for (let k = 0; k < lay.lvl.length; k++) { const L = lay.lvl[k]; if (L < 3 || L === 6) continue; lay.hs[k] = set.clsAt(k % lay.cols, (k / lay.cols) | 0) === 'k' ? 1 : 0; } };
  /* inks: values in the ground's neutral, keys in the colour (or white on a colour ground) */
  function jsonInks(sc) {
    const m = X().mix;
    if (sc.dark && sc.acc === '#ffffff') return { a: m(sc.bg, '#ffffff', .4), b: m(sc.bg, '#ffffff', .7), c: m(sc.bg, '#ffffff', .85), d: '#ffffff' };
    if (sc.dark) return { a: m(sc.bg, '#ffffff', .26), b: m(sc.bg, '#ffffff', .62), c: m(sc.bg, sc.C, .85), d: sc.C };
    return { a: m(sc.bg, '#0d0e10', .2), b: m(sc.bg, '#0d0e10', .55), c: m(sc.bg, sc.C, .6), d: sc.C };
  }
  const jsonOp = (x, y, w, h, spec, set, sc, fs, seed, extra) => Object.assign(X().typeOp(x, y, w, h, [Object.assign({ spec, set }, extra || {})], jsonInks(sc), fs, seed), { post: keyTint(set) });
  /* a text or symbol as a mask; sets the glyph box (uv, y up) for the vertical gradient */
  const maskText = (txt, font, place) => (w, hh, sp) => {
    const m = document.createElement('canvas'); m.width = w; m.height = hh; const x = m.getContext('2d'); const P = place(w, hh);
    x.fillStyle = '#fff'; x.font = font(P.size); x.textAlign = P.align || 'left'; x.textBaseline = 'alphabetic'; x.fillText(txt, P.x, P.y);
    const mt = x.measureText(txt); sp.mbox = [1 - (P.y + mt.actualBoundingBoxDescent) / hh, 1 - (P.y - mt.actualBoundingBoxAscent) / hh]; m._v = 1; return m;
  };
  const textRows = (x, y, fs, rows) => ({ k: 'rows', x, y, w: 0, fs, cw: fs * T().ADV, lh: fs * T().LH, rows: rows.map(r => ({ chars: r.s.split(''), wt: r.wt || 400, it: false, col: r.col })), cursors: [] });

  const FIELDS = {
    foot: ['Under the body', { field: 'radial', p: [.78, -.12, .62, .7], q: [.3, 0, 0, 0], gain: 1.35 }],
    corner: ['Corner', { field: 'radial', p: [1.0, .0, 1.25, .8], q: [.3, 0, 0, 0], gain: 1.2 }],
    right: ['Right block', { field: 'radial', p: [.8, .48, .62, .7], q: [.35, 0, 0, 0], gain: 1.3 }],
    band: ['Right band', { field: 'linear', p: [0, .42, 1.0, 0], q: [.3, 0, 0, 0], gain: 1.15 }],
    clouds: ['Clouds', { field: 'clouds', p: [1.4, .3, .72, .9], q: [0, 0, 0, 0], gain: 1.2 }],
  };

  /* ------------------------------------------------------------ X07 the response is the texture */
  const { card, COPY, OPT, scheme } = X();
  const respCopy = st => COPY[(RESP[st.resp] || RESP.video).prod];
  const label = (st, extra) => (RESP[st.resp] || RESP.video).label + ' · ' + st.colour + ' · ' + st.ground + (extra ? ' · ' + extra : '');
  card('dtx-response', 'The response is the texture', 'Our take on the clusters and the rising field: where the field is dense, the cells write the actual Iframely response for a URL, legible at the core, thinning to . and : and then nothing at the edges; keys in the second ink. Pick the response (YouTube, GitHub card, SoundCloud, Data API, a Console policy); the copy follows its product.', {
    short: 'response', init: { ground: 'black', resp: 'video', fieldk: 'foot', fs: 13 },
    opts: [RESP_OPT, OPT.colour, OPT.ground, { key: 'fieldk', label: 'Field', values: Object.entries(FIELDS).map(([k, v]) => [k, v[0]]) }, { key: 'fs', label: 'Type', values: [[11, '11'], [13, '13'], [16, '16']] }, OPT.head, OPT.page],
    items: st => [{ copy: respCopy(st), scheme: scheme(st), label: label(st, st.fieldk), minH: 600, comp: (W, H, s, ctx) => {
      const sc = scheme(s), R = RESP[s.resp], fs = +s.fs, ops = [X().rect(0, 0, W, H, sc.bg)];
      ops.push(jsonOp(0, 0, W, H, FIELDS[s.fieldk][1], textSet(R.lines, tileMap(R.lines, 2, 1)), sc, fs, s.seed));
      if (ctx.head) ops.push(ctx.head); return { ops, below: 0 };
    } }],
  });

  /* ------------------------------------------------------------ X08 request line, response rising */
  card('dtx-request', 'Request at the foot, response rising', 'The terminal band reread as a call: the heavy bottom row is the request itself, a curl to the Iframely API with the status after it and a block cursor, and the response rises out of it, legible just above the line and dissolving upwards into dots. Bottom-right weighted so the copy keeps its corner.', {
    short: 'request', init: { ground: 'black', resp: 'video', spread: 'right' },
    opts: [RESP_OPT, OPT.colour, OPT.ground, { key: 'spread', label: 'Response', values: [['right', 'Bottom right'], ['full', 'Full width']] }, OPT.head, OPT.page],
    items: st => [{ copy: respCopy(st), scheme: scheme(st), label: label(st), minH: 640, extra: 15 * 1.25 * 2 + 8, comp: (W, H, s, ctx) => {
      const sc = scheme(s), R = RESP[s.resp], fs = 15, cw = fs * T().ADV, lh = fs * T().LH, m = X().mix, ops = [X().rect(0, 0, W, H, sc.bg)];
      const x0 = Math.round(56 / cw) * cw, cols = Math.floor((W - x0) / cw), yReq = H - lh * 1.5;
      const req = ('> curl "iframe.ly/api/' + R.api + '?url=' + R.u + R.q + '"').slice(0, cols - 14), stat = '200 · ' + R.ms + ' ms';
      /* the response sits under the request (indented past "> "), or in the right column; it rises from the line, legible
         for its last lines and thinning upwards */
      const n = R.lines.length, hJ = yReq - 4, rows = Math.floor(hJ / lh), ox = s.spread === 'right' && W >= 820 ? Math.round((W / 2 + 24) / cw) : Math.round(x0 / cw) + 2;
      const set = textSet(R.lines, (i, j) => (i < ox ? null : [(((j - (rows - n)) % n) + n) % n, i - ox]));
      const spec = { field: 'linear', p: [-Math.PI / 2, .3, 1.0, 0], q: [.25, 0, 0, 0], gain: 1.35 };
      ops.push(jsonOp(0, 0, W, rows * lh, spec, set, sc, fs, s.seed));
      ops.push(Object.assign(textRows(x0, yReq, fs, [{ s: req, wt: 800, col: sc.dark && sc.acc !== '#ffffff' ? sc.C : '#ffffff' }]), { cursors: [req.length + 1] }));
      if (!sc.dark) ops[ops.length - 1].rows[0].col = sc.C;
      const sx = req.length + 3; ops.push(textRows(x0 + sx * cw, yReq, fs, [{ s: stat, wt: 400, col: sc.dark ? m(sc.bg, '#ffffff', .6) : m(sc.bg, '#0d0e10', .6) }]));
      if (ctx.head) ops.push(ctx.head); return { ops, below: 0 };
    } }],
  });

  /* ------------------------------------------------------------ X09 symbols filled with their own response */
  const SYM = { rich: '//', preview: '<>', data: '{:}', pub: ':/' };
  const PCOL = () => Object.fromEntries(K().PROD.map(p => [p.k, p.c]));
  card('dtx-symbolresp', 'Symbols written in their own response', 'The product-symbols pick filled with data: // is written in a YouTube embed response, <> in a link-card response, {:} in a Data API access object and :/ in a Console policy, each in its product colour, keys in the strong ink, dense at the foot. Read close, each symbol is what its product returns.', {
    short: 'symbols', init: { pg: 'white', fs: 7, fill: 'grad' },
    opts: [{ key: 'pg', label: 'Ground', values: [['white', 'White'], ['tint', 'Tint'], ['colour', 'Colour'], ['black', 'Black']] }, { key: 'fs', label: 'Type', values: [[7, '7'], [9, '9'], [11, '11']] }, { key: 'fill', label: 'Fill', values: [['grad', 'Dense at the foot'], ['flat', 'Even']] }, OPT.page],
    items: st => [{ art: (W, s) => {
      const gap = 12, tw = (W - gap * 3) / 4, th = Math.round(tw * 1.2), ops = [], m = X().mix, PC = PCOL();
      ['rich', 'preview', 'data', 'pub'].forEach((p, n) => {
        const C = PC[p], R = RESP[PROD_RESP[p]], x = Math.round(n * (tw + gap)), w = Math.round(tw);
        const bg = { white: '#ffffff', tint: K().tint(C, .92), colour: C, black: X().BLACK }[s.pg], sc = s.pg === 'colour' ? { bg, acc: '#ffffff', dark: true, C } : s.pg === 'black' ? { bg, acc: C, dark: true, C } : { bg, acc: C, dark: false, C };
        ops.push(X().rect(x, 0, w, th, bg));
        const str = compact(R.lines), cols = Math.ceil(w / (s.fs * T().ADV)), set = streamSet(str, null, cols, n * 37);
        const spec = { field: 'clouds', p: [2.2, .42, .9, .6], q: [0, 0, 0, 0], gain: 0, maskMode: 2, mg: s.fill === 'flat' ? .8 : 1.3, mgy: s.fill === 'flat' ? 0 : 1 };
        const inks = sc.dark && sc.acc === '#ffffff' ? { a: m(bg, '#fff', .45), b: '#ffffff', c: m(bg, '#fff', .7), d: '#ffffff' } : { a: m(bg, C, .45), b: C, c: m(bg, sc.dark ? '#ffffff' : '#0d0e10', .7), d: sc.dark ? '#ffffff' : '#0d0e10' };
        ops.push(Object.assign(X().typeOp(x, 0, w, th, [{ spec, set, maskFn: maskText(SYM[p], u => `800 ${Math.round(u)}px ${MONO}`, (ww, hh) => ({ size: Math.min(hh * .66, ww * (SYM[p].length > 2 ? .5 : .72)), x: ww / 2, y: hh * .72, align: 'center' })) }], inks, s.fs, s.seed), { post: keyTint(set) }));
        ops.push({ k: 'text', x: x + 16, y: th - 16, s: SYM[p] + ' ' + X().PNAME[p], size: 12, wt: 500, fam: MONO, fill: sc.dark ? '#ffffff' : '#0d0e10' });
      });
      return { ops, H: th, below: 0 };
    }, scheme: scheme(st), label: 'four symbols · ' + st.pg }],
  });

  /* ------------------------------------------------------------ X10 vocabulary field */
  card('dtx-vocab', 'The vocabulary as a field', 'The rising field from the pink composition, written in the API’s own words instead of symbols: meta keys ("title", "thumbnail", "canonical"…), rel tags (player, html5, ssl…), provider domains (youtube.com, figma.com…), or keys and values together. Words stay whole where the field is dense and break into dots at the edges.', {
    short: 'vocab', init: { colour: 'pink', vocab: 'domains', fieldk: 'corner', fs: 13 },
    opts: [OPT.copy, { key: 'vocab', label: 'Words', values: Object.entries(VOCAB).map(([k, v]) => [k, v.label]) }, OPT.colour, OPT.ground, { key: 'fieldk', label: 'Field', values: Object.entries(FIELDS).map(([k, v]) => [k, v[0]]) }, { key: 'fs', label: 'Type', values: [[11, '11'], [13, '13'], [16, '16']] }, OPT.head, OPT.page],
    items: st => [{ copy: COPY[st.copy], scheme: scheme(st), label: X().PNAME[st.copy] + ' · ' + st.vocab + ' · ' + st.colour, comp: (W, H, s, ctx) => {
      const sc = scheme(s), fs = +s.fs, cols = Math.ceil(W / (fs * T().ADV)), v = vocabStream(s.vocab, s.seed), set = streamSet(v.s, v.c, cols, s.seed * 13);
      const ops = [X().rect(0, 0, W, H, sc.bg), jsonOp(0, 0, W, H, FIELDS[s.fieldk][1], set, sc, fs, s.seed)];
      if (ctx.head) ops.push(ctx.head); return { ops, below: 0 };
    } }],
  });

  /* ------------------------------------------------------------ X11 a card built from its own metadata */
  card('dtx-card', 'A card built from its metadata', 'The Preview API section with its visual made of type: a link card whose thumbnail is a glyph dither, whose title and description are the response’s own meta.title and meta.description, with the site line in the accent, over a faint haze of the JSON it came from. The card’s foot dissolves into the section in Bayer cells.', {
    short: 'card', init: { colour: 'violet', ground: 'colour', resp: 'card', haze: true, dissolve: true },
    opts: [RESP_OPT, OPT.colour, OPT.ground, { key: 'haze', label: 'JSON haze', values: [[true, 'On'], [false, 'Off']] }, { key: 'dissolve', label: 'Card foot', values: [[true, 'Dissolves'], [false, 'Square']] }, OPT.head, OPT.page],
    items: st => [{ copy: COPY.preview, scheme: scheme(st), label: label(st, 'card'), minH: 520, comp: (W, H, s, ctx) => {
      const sc = scheme(s), R = RESP[s.resp], m = X().mix, ops = [X().rect(0, 0, W, H, sc.bg)], fs = 14, cw = fs * T().ADV, lh = fs * T().LH;
      const narrow = W < 820, cx = narrow ? 28 : Math.round(W / 2 + 24), cwid = narrow ? W - 56 : Math.round(W / 2 - 80), y0 = narrow ? Math.round(H * .5) : 56;
      if (s.haze) ops.push(jsonOp(0, 0, W, H, { field: 'radial', p: [narrow ? .5 : .75, .5, .75, 1.2], q: [.35, 0, 0, 0], gain: .58 }, textSet(R.lines, tileMap(R.lines, 0, 3)), sc, 12, s.seed));
      const dark = sc.dark && sc.acc !== '#ffffff', cardBg = dark ? '#16171a' : '#ffffff', tx = dark ? '#ffffff' : '#0d0e10', pad = 16, iw = cwid - pad * 2, cols = Math.floor(iw / cw);
      const mc = document.createElement('canvas').getContext('2d'); mc.font = `700 ${fs}px ${MONO}`;
      const title = X().wrap(mc, R.title, iw).slice(0, 2), desc = X().wrap(mc, R.desc, iw).slice(0, 2);
      const textH = (title.length + desc.length + 1) * lh + 14, thH = Math.max(80, Math.min(Math.round(iw * 9 / 16), H - y0 - 40 - pad * 3 - textH)), cH = pad + thH + 12 + textH + pad, foot = s.dissolve ? 24 : 0;
      ops.push(X().rect(cx, y0, cwid, cH - foot, cardBg));
      if (foot) ops.push(X().bayerOp(cx, y0 + cH - foot, cwid, foot + 8, 6, cardBg, s.seed));
      const C = sc.dark && sc.acc === '#ffffff' ? sc.C : sc.C, thumbSc = { bg: cardBg, acc: C, dark, C };
      const tspec = R.kind === 'video' ? { field: 'radial', p: [.5, .5, .75, .7], q: [.5, 0, 0, 0], gain: 1.05 } : { field: 'clouds', p: [1.8, .25, .85, 0], q: [0, 0, 0, 0], gain: 1.1 };
      const tset = { lv: [null, { ch: '.', wt: 400 }, { ch: ':', wt: 400 }, { ch: ['/', '/', '<', '>'], wt: 400 }, { ch: ['/', '/', '<', '>'], wt: 600 }, { ch: ['/', '/', '<', '>'], wt: 800, b: 1 }] };
      const play = R.kind === 'video' ? (w, hh) => { const mk = document.createElement('canvas'); mk.width = w; mk.height = hh; const x = mk.getContext('2d'); x.fillStyle = '#fff'; const r = hh * .16; x.beginPath(); x.moveTo(w / 2 - r * .7, hh / 2 - r); x.lineTo(w / 2 + r, hh / 2); x.lineTo(w / 2 - r * .7, hh / 2 + r); x.closePath(); x.fill(); mk._v = 1; return mk; } : null;
      ops.push(X().typeOp(cx + pad, y0 + pad, iw, thH, [Object.assign({ spec: Object.assign(tspec, play ? { maskMode: 3 } : {}), set: tset }, play ? { maskFn: play } : {})], { a: m(cardBg, C, .4), b: C }, 10, s.seed));
      let y = y0 + pad + thH + 12;
      ops.push(textRows(cx + pad, y, fs, title.map(t => ({ s: t, wt: 700, col: tx })))); y += title.length * lh;
      ops.push(textRows(cx + pad, y, fs, desc.map(t => ({ s: t, wt: 400, col: m(cardBg, tx, .6) })))); y += desc.length * lh + 6;
      ops.push(textRows(cx + pad, y, fs, [{ s: ('// ' + R.site).slice(0, cols), wt: 500, col: C }]));
      if (ctx.head) ops.push(ctx.head); return { ops, below: 0 };
    } }],
  });

  /* ------------------------------------------------------------ X12 stats with data shadows (D17 × the vocabulary) */
  const STATS = [['1,900+', 'providers with maintained embeds', 'domains'], ['2012', 'the year the first URL went through', 'keys'], ['6,000+', 'products show previews through Iframely', 'rel']];
  card('dtx-stats', 'Stats with data shadows', 'D17, which the team liked, with the shadow written in data: 1,900+ casts a shadow of provider domains, 2012 of meta keys, 6,000+ of rel tags. Same offset and foot-heavy gradient as D17, glyphs from the real words.', {
    short: 'stats', init: { sground: 'grey', fs: 8, off: 12 },
    opts: [{ key: 'sground', label: 'Ground', values: [['white', 'White'], ['grey', 'Grey'], ['blue', 'Blue'], ['black', 'Black']] }, OPT.colour, { key: 'fs', label: 'Type', values: [[6, '6'], [8, '8'], [10, '10']] }, { key: 'off', label: 'Offset', values: [[6, '6'], [8, '8'], [12, '12']] }, OPT.page],
    items: st => [{ art: (W, s) => {
      const G = { white: '#ffffff', grey: '#f6f6f6', blue: X().BLUE, black: X().BLACK }[s.sground], dark = s.sground === 'blue' || s.sground === 'black', C = (X().COL[s.colour] || X().COL.blue)[1], m = X().mix;
      const ink = dark ? '#ffffff' : '#0d0e10', shade = s.sground === 'blue' ? '#ffffff' : C, pad = 48, colW = (W - pad * 2) / 3;
      const mc = document.createElement('canvas').getContext('2d'); mc.font = `600 100px ${GEIST}`; /* the widest numeral fits its column with room for the offset */
      const size = Math.min(120, Math.floor(100 * (colW - 40 - +s.off) / Math.max(...STATS.map(r => mc.measureText(r[0]).width)))), boxH = Math.round(size * 1.35), H = boxH + 120;
      const ops = [X().rect(0, 0, W, H, G)];
      STATS.forEach(([num, lab, voc], n) => {
        const x = Math.round(pad + n * colW), y = 36, base = Math.round(boxH * .86), cols = Math.ceil(colW / (s.fs * T().ADV)), v = vocabStream(voc, s.seed + n, '·'), set = streamSet(v.s, v.c, cols, n * 11);
        const spec = { field: 'flat', p: [0, 0, 0, 0], maskMode: 2, mg: 1.9, mgy: .6, maskOff: [+s.off, -s.off] }; /* words need more ink than Bayer to read as a shadow */
        ops.push(X().typeOp(x, y, Math.round(colW), boxH + 16, [{ spec, set, maskFn: maskText(num, u => `600 ${Math.round(u)}px ${GEIST}`, () => ({ size, x: 2, y: base })) }], { a: m(G, shade, .55), b: shade }, s.fs, s.seed));
        ops.push({ k: 'text', x: x + 2, y: y + base, s: num, size, wt: 600, fam: GEIST, fill: ink });
        ops.push({ k: 'text', x: x + 2, y: y + boxH + 40, s: lab, size: 15, wt: 400, fam: GEIST, fill: m(G, ink, .7) });
        ops.push({ k: 'text', x: x + 2, y: y + boxH + 64, s: '// shadow: ' + VOCAB[voc].label.toLowerCase(), size: 11, wt: 500, fam: MONO, fill: m(G, ink, .45) });
      });
      return { ops, H, below: 0 };
    }, scheme: scheme(st), label: 'stats · ' + st.sground }],
  });
  /* shared with demos/dither-sections3.js */
  DEMOS.sectionsKit2 = { RESP, PROD_RESP, RESP_OPT, VOCAB, SYM, FIELDS, classify, textSet, tileMap, streamSet, minify, compact, vocabStream, keyTint, jsonInks, jsonOp, maskText, textRows };
})();
