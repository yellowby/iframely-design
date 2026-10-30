/* L30–L31 · after L28 (pick): links in as text, data out as text, without the big //. The only mark is the small terminal
   // from L06: each URL is prefixed with [//], which spins as an ASCII spinner (/ - \ |) while the request runs and settles
   back into a blue // with the status and time. The response is real Iframely output (fetched 2026-10-27 for these URLs,
   long values cut, API key left out of the html), typed out fast.
   L30 logo-hero-response: one request at a time, in a random place, with its full response including fulltext.
   L31 logo-hero-requests: a live stream: several requests at once in free places, each with a compact response.
   Canvas 2D character field, noise after L21/L28. Uses the hero shell from demos/logo6.js. */
(() => {
  const K = DEMOS.logoKit, BLUE = '#0055ff', INK = '#0a0a0a', GREY = '#a3a3a3';
  const FONT = '"JetBrains Mono", ui-monospace, Menlo, monospace';
  const IFR = 'https://iframely.net/api/iframe?url=';
  const REQ = [
    { u: 'www.youtube.com/watch?v=dQw4w9WgXcQ', st: 200, ms: 212, full: [
      '{',
      '  "meta": {',
      '    "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",',
      '    "author": "Rick Astley",',
      '    "site": "YouTube",',
      '    "medium": "video",',
      '    "duration": 214,',
      '    "date": "2009-10-25T06:57:33.000Z",',
      '    "canonical": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"',
      '  },',
      '  "links": {',
      '    "player": [{ "href": "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0", "media": { "aspect-ratio": 1.778 } }],',
      '    "thumbnail": [{ "href": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", "media": { "width": 1280, "height": 720 } }]',
      '  },',
      '  "rel": ["player", "inline", "html5", "ssl", "hosted"],',
      `  "html": "<div style=\\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\\"><iframe src=\\"${IFR}https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ…"`,
      '}'],
      short: ['"title": "Rick Astley - Never Gonna Give You Up (Official Video)",', '"medium": "video", "duration": 214,', '"player": "https://www.youtube.com/embed/dQw4w9WgXcQ",', '"aspect-ratio": 1.778,', '"thumbnail": { "width": 1280, "height": 720 },', '"rel": ["player", "html5", "hosted"]'] },
    { u: 'en.wikipedia.org/wiki/Bonobo_(musician)', st: 200, ms: 164, full: [
      '{',
      '  "meta": {',
      '    "title": "Bonobo (musician)",',
      '    "site": "Wikipedia",',
      '    "medium": "article",',
      '    "language": "en",',
      '    "canonical": "https://en.wikipedia.org/wiki/Bonobo_(musician)"',
      '  },',
      '  "links": { "thumbnail": [{ "href": "https://thumb.wikimedia.org/…/960px-RF_2806_Bonobo.jpg", "media": { "width": 933, "height": 1200 } }] },',
      '  "rel": ["summary", "card", "small", "inline", "html5", "ssl", "hosted"],',
      '  "fulltext": "# Bonobo (musician)\\n\\n',
      '    Simon Charles Green, known by his stage name Bonobo, is an English',
      '    musician, producer, and DJ based in Los Angeles. He debuted with a',
      '    trip hop aesthetic and has since explored more upbeat approaches',
      '    as well as jazz and world music influences. …"',
      '}'],
      short: ['"title": "Bonobo (musician)",', '"medium": "article", "language": "en",', '"thumbnail": { "width": 933, "height": 1200 },', '"fulltext": "# Bonobo (musician)\\n\\nSimon Charles Green, known by his stage name Bonobo, is an English musician…",', '"rel": ["summary", "card", "hosted"]'] },
    { u: 'soundcloud.com/bonobo/kerala', st: 200, ms: 247, full: [
      '{',
      '  "meta": {',
      '    "title": "Kerala by bonobo",',
      '    "author": "bonobo",',
      '    "author_url": "https://soundcloud.com/bonobo",',
      '    "site": "SoundCloud",',
      '    "medium": "audio",',
      '    "description": "\'Kerala\' – the first single taken from Bonobo’s new album \'Migration\', released 13th January 2017 on Ninja Tune."',
      '  },',
      '  "links": { "thumbnail": [{ "href": "https://i1.sndcdn.com/artworks-nd5do3eR82sw-0-t500x500.jpg", "media": { "width": 500, "height": 500 } }] },',
      '  "rel": ["player", "audio", "inline", "html5", "ssl", "hosted", "encrypted-media"],',
      `  "html": "<iframe src=\\"${IFR}https%3A%2F%2Fsoundcloud.com%2Fbonobo%2Fkerala…"`,
      '}'],
      short: ['"title": "Kerala by bonobo",', '"medium": "audio", "site": "SoundCloud",', '"description": "\'Kerala\' – the first single taken from Bonobo’s new album…",', '"thumbnail": { "width": 500, "height": 500 },', '"rel": ["player", "audio", "hosted"]'] },
    { u: 'open.spotify.com/track/0rJvVQhE8YH8bUj8kfvJPN', st: 404, ms: 88, full: [
      '{',
      '  "status": 404,',
      '  "error": "Iframely could not fetch the given URL. The content is no longer available at the origin"',
      '}'],
      short: ['"status": 404,', '"error": "The content is no longer available at the origin"'] },
    { u: 'github.com/itteco/iframely', st: 200, ms: 131, full: [
      '{',
      '  "meta": {',
      '    "title": "GitHub - itteco/iframely: The URL engine behind Iframely. Self-hosted parsers that turn links into metadata, previews and embeds.",',
      '    "site": "GitHub",',
      '    "medium": "link",',
      '    "canonical": "https://github.com/itteco/iframely"',
      '  },',
      '  "links": { "thumbnail": [{ "href": "https://opengraph.githubassets.com/73d156df…/itteco/iframely", "media": { "width": 1200, "height": 600 } }] },',
      '  "rel": ["summary", "card", "inline", "html5", "ssl", "hosted"]',
      '}'],
      short: ['"title": "GitHub - itteco/iframely: The URL engine behind Iframely…",', '"medium": "link", "site": "GitHub",', '"thumbnail": { "width": 1200, "height": 600 },', '"rel": ["summary", "card", "hosted"]'] },
  ];
  const SCR = '!<>-_\\/[]{}=+*^?#%&$:;.';
  const SPIN = ['/', '-', '\\', '|'];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rch = () => SCR[Math.random() * SCR.length | 0];
  /* per-character colours for a JSON-ish line: keys blue, values ink, punctuation grey */
  function paint(s) {
    const col = new Array(s.length).fill(INK);
    if (/^\s+[A-Za-z]/.test(s)) return col; /* a wrapped line inside a string (fulltext) stays plain */
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '"') { let j = i + 1; while (j < s.length && !(s[j] === '"' && s[j - 1] !== '\\')) j++; let k = j + 1; while (s[k] === ' ') k++; const key = s[k] === ':'; for (let q = i; q <= j && q < s.length; q++) col[q] = key ? BLUE : INK; i = j; }
      else if ('{}[],:'.includes(ch)) col[i] = GREY;
    }
    return col;
  }
  /* JSON → JSON5: bare keys where they are identifiers, single-quoted strings, trailing commas, fulltext continued with \ */
  const isCont = l => /^\s+[A-Za-z]/.test(l);
  function toJSON5(lines) {
    const cont = lines.map(isCont); /* decided on the JSON, where every key is still quoted */
    const out = lines.map((l, i) => {
      let s = l.replace(/"((?:[^"\\]|\\.)*)"(\s*:)/g, (m, k, c) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`) + c);
      const odd = (s.match(/(^|[^\\])"/g) || []).length % 2;
      if (cont[i]) s = s.replace(/"$/, "'");
      else if (odd) s = s.replace(/: "/, ": '");
      return s.replace(/"((?:[^"\\]|\\.)*)"/g, (m, v) => `'${v.replace(/\\"/g, '"').replace(/'/g, "\\'")}'`);
    });
    const res = out.map((l, i) => {
      const nx = (out[i + 1] || '').trim(), tr = l.trim();
      if (cont[i + 1]) return l + ' \\';
      if ((nx.startsWith('}') || nx.startsWith(']')) && !/[,{[]$/.test(tr) && tr !== '{') return l + ',';
      return l;
    });
    res.cont = cont;
    return res;
  }
  /* greys only: keys mid grey, values ink, punctuation light, comments soft */
  const G5 = { key: '#707070', str: INK, pun: '#bcbcbc', com: '#a0a0a0' };
  function paint5(s, cont, P = G5) {
    const col = new Array(s.length).fill(P.str);
    if (cont) { if (s.endsWith(' \\')) col[s.length - 1] = P.pun; return col; }
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '/' && s[i + 1] === '/') { for (let q = i; q < s.length; q++) col[q] = P.com; break; }
      if (ch === "'") { let j = i + 1; while (j < s.length && !(s[j] === "'" && s[j - 1] !== '\\')) j++; let k = j + 1; while (s[k] === ' ') k++; const c = s[k] === ':' ? P.key : P.str; for (let q = i; q <= j && q < s.length; q++) col[q] = c; i = j; continue; }
      if (/[A-Za-z_$]/.test(ch)) { let j = i; while (j < s.length && /[\w$]/.test(s[j])) j++; let k = j; while (s[k] === ' ') k++; const c = s[k] === ':' ? P.key : P.str; for (let q = i; q < j; q++) col[q] = c; i = j - 1; continue; }
      if ('{}[],:\\'.includes(ch)) col[i] = P.pun;
    }
    return col;
  }

  function mount(stage, multi, five) {
    const SC = five ? '#c6c6c6' : '#9fb6e8', S0 = five ? 0 : 1; /* scramble colour; where the spinner sits in the head */
    const v = K.heroShell(stage); v.style.height = '92%';
    const cv = DEMOS.canvas2d(v); cv.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    const ctx = cv.ctx, RAMP = ' ..·:-=+*/', HASH = Float32Array.from({ length: 4099 }, rng(5));
    let W = 0, H = 0, fs = 12, cw = 7, chh = 18, cols = 0, rows = 0, ox = 0, oy = 0;
    const X = c => ox + c * cw, Y = r => oy + r * chh + chh / 2;
    let jobs = [], next = 0, seq = 0, R = rng(42);
    const resize = () => { const s = cv.resize(); W = s.w; H = s.h; fs = clamp(Math.round(W / 66), 10, 13); cw = fs * .6; chh = Math.round(fs * 1.55); cols = Math.floor(W / cw); rows = Math.floor(H / chh); ox = (W - cols * cw) / 2; oy = (H - rows * chh) / 2; jobs = []; next = 0; };
    /* a job: one request at (c, r). Timeline in seconds from t0: URL decodes, spinner runs, // settles, response types out, holds, dissolves. */
    const make = (t0, Q, c, r, lines, width) => {
      const url = 'https://' + Q.u, pre = five ? '// ' : '[//] ', head = pre + (url.length > width - pre.length ? url.slice(0, width - pre.length - 1) + '…' : url);
      const src = five ? toJSON5(lines) : lines, cont = src.cont || [], out = src.map(l => l.length > width ? l.slice(0, width - 1) + '…' : l);
      const tUrl = t0, tSpin = t0 + head.length * .006 + .08, tDone = tSpin + .22 + Q.ms / 600, tResp = tDone + .06;
      const tEnd = tResp + out.length * .028 + 2.8 + (multi ? 0 : out.length * .04);
      return { Q, c, r, head, out, cols: out.map((l, i) => five ? paint5(l, cont[i]) : paint(l)), w: Math.max(head.length + 14, ...out.map(l => l.length)), h: out.length + 2, tUrl, tSpin, tDone, tResp, tEnd };
    };
    const fits = (c, r, w, h) => c >= 1 && r >= 0 && c + w <= cols - 1 && r + h <= rows && !jobs.some(j => c < j.c + j.w + 2 && j.c < c + w + 2 && r < j.r + j.h + 1 && j.r < r + h + 1);
    const spawn = T => {
      const Q = REQ[seq++ % REQ.length];
      const width = multi ? Math.min(52, cols - 4) : Math.min(cols - 4, 92), lines = multi ? Q.short : Q.full;
      const est = Math.min(width, Math.max(...lines.map(l => l.length), Q.u.length + 22));
      for (let k = 0; k < 40; k++) { const h = lines.length + 2, c = 1 + Math.floor(R() * Math.max(1, cols - est - 2)), r = Math.floor(R() * Math.max(1, rows - h)); if (fits(c, r, est, h)) { jobs.push(make(T, Q, c, r, lines, width)); return true; } }
      return false;
    };
    const glyph = (ch, x, y, color, alpha, bold) => { ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.font = (bold ? '800 ' : '400 ') + fs + 'px ' + FONT; ctx.fillText(ch, x, y); };
    /* one character of a job: it decodes in at `at`, dissolves at `off` */
    const ch = (s, i, at, off, T, x, y, color, bold) => { if (T < at || T > off + .14) return; if (T < at + .07 || T > off) glyph(rch(), x, y, SC, 1); else glyph(s[i], x, y, color, 1, bold); };
    const frame = (time, still) => {
      const T = still ? 1e6 : time;
      if (!still) { jobs = jobs.filter(j => T < j.tEnd + .4); if (T >= next) { const ok = spawn(T); next = T + (multi ? (ok ? .9 + R() * .5 : .25) : (jobs.length ? Infinity : .15)); } if (!multi && !jobs.length && next === Infinity) next = T + .15; }
      /* rows the noise keeps clear: the request line once it starts, then each response line as it types in */
      for (const j of jobs) j.shown = T < j.tUrl || T > j.tEnd + .3 ? 0 : 1 + j.out.filter((_, li) => T >= j.tResp + li * .028 - .04).length;
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      /* background noise, kept clear around live jobs */
      ctx.font = '400 ' + fs + 'px ' + FONT; ctx.fillStyle = INK;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        let hit = false; for (const j of jobs) if (c >= j.c - 1 && c <= j.c + j.w && r >= j.r && r < j.r + j.shown) { hit = true; break; } if (hit) continue;
        const f = .5 + .5 * Math.sin(c * .11 + time * .4 + 1.7 * Math.sin(r * .13 + time * .2)) * Math.sin(r * .19 - time * .25 + 1.3 * Math.sin(c * .07 - time * .15));
        const hsh = HASH[(r * 131 + c) % HASH.length]; if (hsh > f * .85 - .1) continue;
        const k = Math.floor((f * .75 + hsh * .25) * RAMP.length); if (k <= 0) continue;
        const x = X(c), y = Y(r); let a = (.06 + .2 * f) * clamp(Math.min(x, W - x) / 48) * clamp(Math.min(y, H - y) / 36); if (a < .02) continue;
        ctx.globalAlpha = a; ctx.fillText(Math.random() < .004 ? rch() : RAMP[k], x, y);
      }
      for (const j of jobs) {
        const off = j.tEnd, y0 = Y(j.r), ok = j.Q.st < 400;
        /* faint band behind the request line */
        if (T > j.tUrl && T < off + .1) { ctx.globalAlpha = .9; ctx.fillStyle = five ? '#f2f2f2' : '#f0f5ff'; ctx.fillRect(X(j.c) - 4, y0 - chh / 2 + 2, Math.min(1, (T - j.tUrl) / .25) * j.head.length * cw + 8, chh - 4); }
        for (let i = 0; i < j.head.length; i++) {
          const x = X(j.c + i), at = j.tUrl + i * .006;
          if (i === S0 || i === S0 + 1) { /* the spinner, then the mark */
            if (T < j.tSpin || T > off + .14) continue;
            if (T < j.tDone) { const q = Math.floor((T - j.tSpin) / .055) + (i - S0); glyph(SPIN[q % 4], x, y0, five ? INK : BLUE, 1, true); }
            else glyph('/', x, y0, five ? INK : ok ? BLUE : '#d4380d', 1, true);
            continue;
          }
          ch(j.head, i, at, off + i * .002, T, x, y0, !five && (i === 0 || i === 3) ? GREY : INK, false);
        }
        if (T >= j.tDone && five) { const st = `${ok ? '✓' : '✕'} ${j.Q.st} · ${j.Q.ms} ms`, x0 = j.c + j.head.length + 2; for (let i = 0; i < st.length; i++) ch(st, i, j.tDone + i * .008, off, T, X(x0 + i), y0, i === 0 ? INK : '#8a8a8a', i === 0); }
        else if (T >= j.tDone) { const st = ` ${j.Q.st} · ${j.Q.ms} ms`, x0 = j.c + j.head.length + 1; for (let i = 0; i < st.length; i++) ch(st, i, j.tDone + i * .008, off, T, X(x0 + i), y0, i < 4 ? (ok ? '#13a35b' : '#d4380d') : '#8a8a8a', i < 4); }
        j.out.forEach((l, li) => { const y = Y(j.r + 1 + li), base = j.tResp + li * .028; for (let i = 0; i < l.length; i++) if (l[i] !== ' ') ch(l, i, base + i * .0025, off + li * .012, T, X(j.c + i), y, j.cols[li][i], false); });
      }
      ctx.globalAlpha = 1;
    };
    const ro = new ResizeObserver(resize); ro.observe(v); resize();
    if (DEMOS.reduced) { requestAnimationFrame(() => { resize(); spawn(0); if (multi) { spawn(0); spawn(0); } frame(0, true); }); return () => { ro.disconnect(); cv.destroy(); }; }
    let time = 0;
    const lp = DEMOS.loop(v, (t, dt) => { if (!stage.matches(':hover')) time += dt; frame(time, false); });
    stage._seek = s => { time = s; frame(time, false); }; /* for checking a moment by hand */
    return () => { lp.destroy(); ro.disconnect(); cv.destroy(); };
  }

  K.reqKit = { REQ, toJSON5, paint5, SPIN }; /* reused by demos/logo9.js */
  DEMOS.register('logo-hero-response', {
    group: 'logo', title: 'Hero: one request, the real response',
    blurb: 'L28 without the big //. A URL decodes somewhere in the field with the terminal [//] from L06 in front of it; the slashes spin as an ASCII spinner while the request runs, settle into a blue // with status and time, and the real Iframely response types out under it in about half a second, fulltext included. YouTube, Wikipedia, SoundCloud, a dead Spotify link (a real 404) and GitHub in turn.',
    mount: stage => mount(stage, false),
  });
  DEMOS.register('logo-hero-requests', {
    group: 'logo', title: 'Hero: a live stream of requests',
    blurb: 'The same, many at once: requests start in free places of the field every second or so, each with its own [//] spinner and a compact response, and fade out on their own. Reads as a busy API, fast.',
    mount: stage => mount(stage, true),
  });
  DEMOS.register('logo-hero-response5', {
    group: 'logo', title: 'Hero: one request, JSON5 in greys',
    blurb: 'L30 with the response written as JSON5 (bare keys, single quotes, trailing commas, fulltext continued across lines) in shades of grey only. The // in front of the URL has no brackets: it spins while the request runs and settles, then a ✓ (or ✕ on the dead link) with status and time.',
    mount: stage => mount(stage, false, true),
  });
  DEMOS.register('logo-hero-requests5', {
    group: 'logo', title: 'Hero: live requests, JSON5 in greys',
    blurb: 'L31 the same way: many requests at once, each a bare spinning // that settles with ✓ or ✕, compact JSON5 responses in greys.',
    mount: stage => mount(stage, true, true),
  });
})();
