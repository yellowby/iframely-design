/* L52–L53 · after L51 (one request at a time, preview card, sparks), with the next round of asks:
   - every request is a command at a > prompt; the prompt spins while the request runs and becomes the done mark
     (L52 ●, L53 the // mark) instead of ✓; the URL is the only blue; status and time after the command, in grey;
   - the requests follow the Iframely docs and show three kinds of result:
       rich media  api/iframely … &iframe=1&omit_script=1 / &playerjs=1  → data + a player
       meta        api/iframely … &card=small / &media=0                → data + a summary card
       Data API    api/data … &mode=…&use=…&include=…                   → data + the Markdown rendered as a document
     (Data API calls always carry a processing mode: assist, ai-input …);
   - L52 writes them as curl calls (a long query continues on the next line, as in a terminal); L53 as an iframely CLI.
   Rich media and meta responses are real Iframely output (2026-10-27), cut short, with no API key in them; the Data API
   responses are mocked after the redesign docs (website docs/data-api), as that endpoint is new. */
(() => {
  const K = DEMOS.logoKit, C = K.cardKit;
  const IFR = 'https://iframely.net/api/iframe?url=…';
  /* each request: kind of result, endpoint and query, CLI form, and the response as JSON lines (JSON5 on screen) */
  const RQ = [
    { kind: 'video', fav: 'youtube', site: 'YouTube', u: 'youtu.be/dQw4w9WgXcQ', st: 200, ms: 212, api: 'iframely', q: '&iframe=1&omit_script=1', cli: 'embed', flags: '--iframe --omit-script',
      title: 'Never Gonna Give You Up', len: '3:34', full: [
      '{',
      '  "meta": {',
      '    "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",',
      '    "site": "YouTube",',
      '    "medium": "video",',
      '    "duration": 214,',
      '    "canonical": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"',
      '  },',
      '  "links": { "player": [{ "href": "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0", "media": { "aspect-ratio": 1.778 } }] },',
      '  "rel": ["player", "inline", "html5", "ssl", "hosted"],',
      `  "html": "<div style=\\"position: relative; padding-bottom: 56.25%;\\"><iframe src=\\"${IFR}\\" allowfullscreen></iframe></div>"`,
      '}'] },
    { kind: 'audio', fav: 'soundcloud', site: 'SoundCloud', u: 'soundcloud.com/bonobo/kerala', st: 200, ms: 247, api: 'iframely', q: '&iframe=1&playerjs=1', cli: 'embed', flags: '--iframe --playerjs',
      title: 'Kerala by bonobo', full: [
      '{',
      '  "meta": {',
      '    "title": "Kerala by bonobo",',
      '    "author": "bonobo",',
      '    "site": "SoundCloud",',
      '    "medium": "audio"',
      '  },',
      '  "links": { "thumbnail": [{ "href": "https://i1.sndcdn.com/artworks-nd5do3eR82sw-0-t500x500.jpg", "media": { "width": 500, "height": 500 } }] },',
      '  "rel": ["player", "audio", "html5", "ssl", "hosted", "playerjs"],',
      `  "html": "<iframe src=\\"${IFR}&playerjs=1\\" allow=\\"autoplay; encrypted-media\\"></iframe>"`,
      '}'] },
    { kind: 'small', fav: 'github', site: 'GitHub', u: 'github.com/itteco/iframely', st: 200, ms: 131, api: 'iframely', q: '&card=small', cli: 'embed', flags: '--card small',
      title: 'itteco/iframely', desc: 'The URL engine behind Iframely', full: [
      '{',
      '  "meta": {',
      '    "title": "GitHub - itteco/iframely: The URL engine behind Iframely. Self-hosted parsers that turn links into metadata, previews and embeds.",',
      '    "site": "GitHub",',
      '    "medium": "link",',
      '    "canonical": "https://github.com/itteco/iframely"',
      '  },',
      '  "links": { "thumbnail": [{ "href": "https://opengraph.githubassets.com/73d156df…/itteco/iframely", "media": { "width": 1200, "height": 600 } }] },',
      '  "rel": ["summary", "card", "small", "inline", "html5", "ssl", "hosted"],',
      `  "html": "<iframe src=\\"${IFR}&card=small\\" style=\\"height: 132px;\\"></iframe>"`,
      '}'] },
    { kind: 'doc', fav: 'wikipedia', site: 'Wikipedia', u: 'en.wikipedia.org/wiki/Bonobo_(musician)', st: 200, ms: 164, api: 'data', q: '&mode=assist&use=reference&include=excerpt,fulltext,access', cli: 'data', flags: '--mode assist --use reference',
      title: 'Bonobo (musician)', body: 'Simon Charles Green, known by his stage name Bonobo, is an English musician, producer, and DJ based in Los Angeles. He debuted with a trip hop aesthetic.', chips: ['assist · reference', 'CC BY-SA 4.0'], full: [
      '{',
      '  "meta": { "title": "Bonobo (musician)", "site": "Wikipedia", "language": "en" },',
      '  "excerpt": "Simon Charles Green, known by his stage name Bonobo, is an English musician, producer, and DJ.",',
      '  "access": {',
      '    "requested": { "modes": ["assist"], "use": "reference" },',
      '    "signals": { "license": { "common_name": "CC BY-SA 4.0" }, "robots.txt": { "status": 200 } },',
      '    "decision": { "fulltext": { "allowed": true, "promoted_by": ["license"] } }',
      '  },',
      '  "fulltext": "# Bonobo (musician)\\n\\n',
      '    Simon Charles Green, known by his stage name Bonobo, is an English',
      '    musician, producer, and DJ based in Los Angeles. …"',
      '}'] },
    { kind: 'summary', fav: 'youtube', site: 'YouTube', u: 'youtu.be/dQw4w9WgXcQ', st: 200, ms: 198, api: 'iframely', q: '&media=0', cli: 'embed', flags: '--media 0',
      title: 'Rick Astley - Never Gonna Give You Up', desc: 'Rick Astley · 2009', full: [
      '{',
      '  "meta": {',
      '    "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",',
      '    "author": "Rick Astley",',
      '    "site": "YouTube",',
      '    "date": "2009-10-25T06:57:33.000Z"',
      '  },',
      '  "links": { "thumbnail": [{ "href": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", "media": { "width": 1280, "height": 720 } }] },',
      '  "rel": ["summary", "card", "inline", "html5", "ssl", "hosted"],',
      `  "html": "<iframe src=\\"${IFR}&media=0\\" style=\\"height: 410px;\\"></iframe>"`,
      '}'] },
    { kind: 'doc', fav: 'github', site: 'GitHub', u: 'github.com/itteco/iframely', st: 200, ms: 176, api: 'data', q: '&mode=ai-input&use=immediate&include=fulltext,access', cli: 'data', flags: '--mode ai-input --use immediate',
      title: 'Iframely', body: 'Self-hosted parsers that turn links into metadata, previews and embeds.', code: 'npm install iframely', chips: ['ai-input · immediate', 'MIT'], full: [
      '{',
      '  "meta": { "title": "itteco/iframely", "site": "GitHub", "medium": "link" },',
      '  "access": {',
      '    "requested": { "modes": ["ai-input"], "use": "immediate" },',
      '    "signals": { "license": { "common_name": "MIT" } },',
      '    "decision": { "fulltext": { "allowed": true } }',
      '  },',
      '  "fulltext": "# Iframely\\n\\n',
      '    Self-hosted parsers that turn links into metadata, previews and',
      '    embeds. Install with npm install iframely …"',
      '}'] },
  ];
  const SIZE = { video: [24, 6], audio: [24, 5], small: [26, 4], summary: [24, 7], doc: [30, 8] };
  /* curl: the query continues on the next line when the line would be long; CLI: iframely <verb> <url> <flags> */
  const asCurl = Q => { const pre = 'curl iframe.ly/api/' + Q.api + '?url=', one = 2 + pre.length + 8 + Q.u.length + Q.q.length;
    return Object.assign({}, Q, { pre, post: one > 92 ? ' \\' : Q.q, full: one > 92 ? ['  ' + Q.q].concat(Q.full) : Q.full, short: Q.full, cont0: one > 92 }); };
  const asCli = Q => Object.assign({}, Q, { pre: 'iframely ' + Q.cli + ' ', post: ' ' + Q.flags, short: Q.full });

  /* the cards, in greys with thin lines; only the favicon has colour */
  const { FONT, INK, MID, LINE, FILL, ICON, hatch, play, clip } = C;
  const wrap = (c, s, w) => { const out = []; let line = ''; for (const word of s.split(' ')) { const t = line ? line + ' ' + word : word; if (c.measureText(t).width > w && line) { out.push(line); line = word; } else line = t; } if (line) out.push(line); return out; };
  function card(Q, w, h, d) {
    const cv = document.createElement('canvas'); cv.width = Math.ceil(w * d); cv.height = Math.ceil(h * d);
    const c = cv.getContext('2d'); c.scale(d, d);
    const x0 = 1.5, y0 = 3.5, W = w - 4, H = h - 8;
    c.fillStyle = '#fff'; c.strokeStyle = LINE; c.lineWidth = 1; c.beginPath(); c.roundRect(x0, y0, W, H, 6); c.fill(); c.stroke();
    const im = ICON[Q.fav]; if (im && im.complete && im.naturalWidth) c.drawImage(im, x0 + 8, y0 + 7, 12, 12);
    c.font = '400 10px ' + FONT; c.textBaseline = 'middle'; c.fillStyle = MID; c.fillText(Q.site, x0 + 26, y0 + 13.5);
    const bx = x0 + 8, by = y0 + 26, bw = W - 16, bh = H - 34;
    c.font = '500 10px ' + FONT; c.fillStyle = INK;
    if (Q.kind === 'video') {
      const vh = bh - 16; c.fillStyle = FILL; c.fillRect(bx, by, bw, vh); hatch(bx, by, bw, vh, c); play(bx + bw / 2, by + vh / 2, 11, c);
      c.font = '400 9px ' + FONT; const tw = c.measureText(Q.len).width + 6; c.fillStyle = '#e4e4e4'; c.fillRect(bx + bw - tw - 4, by + vh - 15, tw, 11); c.fillStyle = MID; c.fillText(Q.len, bx + bw - tw - 1, by + vh - 9.5);
      c.font = '500 10px ' + FONT; c.fillStyle = INK; c.fillText(clip(c, Q.title, bw), bx, by + vh + 9);
    } else if (Q.kind === 'audio') {
      const s = Math.min(bh, 46); c.fillStyle = FILL; c.fillRect(bx, by, s, s); hatch(bx, by, s, s, c);
      c.fillStyle = INK; c.fillText(clip(c, Q.title, bw - s - 10), bx + s + 10, by + 6); play(bx + s + 21, by + s - 11, 10, c);
      const wx = bx + s + 38, ww = bx + bw - wx; for (let i = 0, n = Math.floor(ww / 3); i < n; i++) { const a = .25 + .75 * Math.abs(Math.sin(i * .9) * Math.cos(i * .23)); c.fillStyle = i < n * .3 ? '#9a9a9a' : '#d6d6d6'; c.fillRect(wx + i * 3, by + s - 11 - a * 9, 2, a * 18); }
    } else if (Q.kind === 'small') { /* card=small: a thumbnail on the left, title and description */
      const s = Math.min(bh, 40); c.fillStyle = FILL; c.fillRect(bx, by, s * 1.6, s); hatch(bx, by, s * 1.6, s, c);
      const tx = bx + s * 1.6 + 10, tw = bw - s * 1.6 - 10; c.fillStyle = INK; c.fillText(clip(c, Q.title, tw), tx, by + 6);
      c.font = '400 9px ' + FONT; c.fillStyle = MID; wrap(c, Q.desc, tw).slice(0, 2).forEach((l, i) => c.fillText(l, tx, by + 20 + i * 11));
    } else if (Q.kind === 'summary') { /* media=0: the video as a summary card, image on top */
      const ih = Math.min(bh - 30, bw * .5); c.fillStyle = FILL; c.fillRect(bx, by, bw, ih); hatch(bx, by, bw, ih, c);
      c.fillStyle = INK; wrap(c, Q.title, bw).slice(0, 2).forEach((l, i) => c.fillText(l, bx, by + ih + 10 + i * 12));
      c.font = '400 9px ' + FONT; c.fillStyle = MID; c.fillText(Q.desc, bx, by + ih + 36);
    } else { /* Data API: the Markdown full text rendered as a small document, the mode and licence as chips */
      c.font = '600 13px ' + FONT; c.fillStyle = INK; c.fillText(clip(c, Q.title, bw), bx, by + 7);
      c.font = '400 9px ' + FONT; c.fillStyle = '#4a4a4a'; let y = by + 24; for (const l of wrap(c, Q.body, bw).slice(0, Q.code ? 2 : 4)) { c.fillText(l, bx, y); y += 12; }
      if (Q.code) { y += 2; c.fillStyle = FILL; c.fillRect(bx, y - 7, bw, 16); c.fillStyle = INK; c.fillText('$ ' + Q.code, bx + 6, y + 1); y += 18; }
      c.font = '400 8px ' + FONT; let cx = bx; for (const t of Q.chips) { const tw = c.measureText(t).width + 10; c.strokeStyle = LINE; c.beginPath(); c.roundRect(cx, by + bh - 14, tw, 14, 7); c.stroke(); c.fillStyle = MID; c.fillText(t, cx + 5, by + bh - 6.5); cx += tw + 5; }
    }
    return cv;
  }
  const BASE = { v2: true, status: true, okOnly: true, marks: true, bg: .45, flick: ['/', '>'], grow: 'organic', B: [2], S: [], C: 3, density: .06, soup: .08, minLive: .008, alpha: .42,
    prompt: '> ', indent: '  ', card, cardCols: Q => SIZE[Q.kind][0], cardRows: Q => SIZE[Q.kind][1] };
  DEMOS.register('logo-hero-calls', {
    group: 'logo', title: 'Hero: curl calls, three kinds of result',
    blurb: 'L51 as curl calls at a > prompt that follow the Iframely docs: rich media (iframe=1, omit_script / playerjs) come back as data plus a player, meta calls (card=small, media=0) as data plus a summary card, and Data API calls (always with a processing mode: assist, ai-input) as data plus the Markdown rendered as a document. The prompt spins while the call runs and becomes a ● when it is done; status and time follow in grey; only the URL is blue.',
    mount: stage => K.cellsHero(stage, false, Object.assign({}, BASE, { reqs: RQ.map(asCurl), done: '●' })),
  });
  DEMOS.register('logo-hero-cli', {
    group: 'logo', title: 'Hero: an iframely CLI, three kinds of result',
    blurb: 'The same six calls written for an iframely command line (iframely embed … --iframe --omit-script, iframely data … --mode assist --use reference), shorter to read. Here the prompt settles into the // mark when the call is done.',
    mount: stage => K.cellsHero(stage, false, Object.assign({}, BASE, { reqs: RQ.map(asCli), done: '//', prompt: '>  ', indent: '   ' })),
  });
})();
