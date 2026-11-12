/* X · Dither sections, round 5 (2026-11-05): more marketing blocks in text, now with motion and interaction (X29–X34).
     X29  hero: the API types itself (request typed, response streamed, the result rendered, four URLs in a loop)
     X30  a URL resolving into data: the dither erosion done in text, scrubbed with a slider or played
     X31  what Iframely does to a link, as a diff of a chat log
     X32  the provider index: a searchable, alphabetical list with a letter rail
     X33  the API as a man page
     X34  a year of parser fixes as a contribution heatmap
   Same palette, faces and Copy text / .txt export as X23–X28; numbers, fixes and API options are illustrative.
   Needs dither-sections2.js, dither-sections3.js and dither-sections4.js. */
(() => {
  const X = () => DEMOS.sectionsKit, Y = () => DEMOS.sectionsKit2, Z = () => DEMOS.sectionsKit3, V = () => DEMOS.sectionsKit4;
  const { seg, gap } = DEMOS.sectionsKit4, SANS = 'Geist, Inter, sans-serif', GMONO = "'Geist Mono', ui-monospace, monospace";
  const html = (rows, I) => Z().receiptText(rows, 0, I).html, txt = (rows, I) => Z().receiptText(rows, 0, I).text.replace(/[ \t]+$/gm, '');
  const live = (el, fn, ms) => { let miss = 0; const tick = () => { if (!el.isConnected) { if (++miss > 40) return; } else miss = 0; const d = fn(); setTimeout(tick, d == null ? ms : d); }; setTimeout(tick, ms); }; /* stops once the card is re-rendered */
  const btn = (I, t, on) => `<span style="height:44px;padding:0 22px;display:inline-flex;align-items:center;font:500 15px ${SANS};${on ? `background:${I.ink};color:${I.bg}` : `box-shadow:inset 0 0 0 1px ${I.rule};color:${I.ink}`}">${t}</span>`;
  const copyHTML = (I, c, big) => `<div style="font:500 15px/1.3 ${GMONO};color:${I.body};margin-bottom:16px">${c.path}</div><h2 style="font:400 ${big ? 52 : 40}px/1.1 ${SANS};letter-spacing:-.025em;margin:0 0 24px;color:${I.ink}">${c.title}</h2><p style="font:400 17px/1.6 ${SANS};color:${I.body};margin:0 0 28px;max-width:44ch">${c.body}</p><div style="display:flex;gap:10px">${btn(I, c.b1, 1)}${btn(I, c.b2)}</div>`;
  const plainCopy = c => c.path + '\n' + c.title.replace(/<br>/g, ' ') + '\n\n' + c.body + '\n\n';
  /* one JSON line as segments: keys in ink, strings in the accent, literals in body, punctuation muted */
  const jsonRow = (line, cols) => { const L = line.slice(0, cols), c = Y().classify(L), segs = []; let cur = null;
    for (let i = 0; i < L.length; i++) { const k = c[i], tone = k === 'k' ? 'ink' : k === 's' ? 'acc' : k === 'n' ? 'body' : 'mute', wt = k === 'k' ? 600 : 400; if (cur && cur[1] === tone && cur[2] === wt) cur[0] += L[i]; else { cur = [L[i], tone, wt]; segs.push(cur); } }
    return { segs }; };
  /* small renders of what each product returns, in characters */
  function cardRows(C, R) { const G = V().grid(C, 7); G.box(0, 0, C, 7, 'rule');
    for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) G.put(2 + c, 1 + r, '█▓▒░ '[Math.min(4, Math.floor((c + r * 1.4) / 3.6))], 'acc');
    G.text(14, 1, R.title.slice(0, C - 16), 'ink', 700); G.text(14, 2, R.site, 'mute'); G.text(14, 3, R.desc.slice(0, C - 16), 'body'); G.text(14, 5, '// ' + R.site, 'acc', 600); return G.rows(); }
  function mdRows(C) { const bar = (k, on, v) => ({ segs: [seg(k.padEnd(10), 'body'), seg((on ? '█' : '░').repeat(C - 20), on ? 'acc' : 'rule'), seg(' ' + v, on ? 'ink' : 'mute', on ? 600 : 400)], blk: true });
    return [{ segs: [seg('# Bonobo (musician)', 'ink', 700)] }, { segs: [seg('Simon Charles Green, known as Bonobo, is an', 'body')] }, { segs: [seg('English musician, producer and DJ…', 'body')] }, gap(.4), bar('assist', 1, 'allowed'), gap(.25), bar('train', 0, 'denied')]; }
  function polRows(C) { const pol = (p, a, rule, on) => ({ segs: [seg(p.padEnd(14), 'body'), seg(a.padEnd(19), 'ink'), seg(' ' + rule + ' ', on ? 'ground' : 'white', 600, on ? 'ink' : 'acc')] });
    return [{ segs: [seg('path'.padEnd(14) + 'agent'.padEnd(19) + 'rule', 'mute')] }, { segs: [seg('─'.repeat(C), 'rule')], blk: true }, pol('/articles/*', 'iframely-preview', 'allow', 1), gap(.25), pol('/articles/*', 'iframely-data', 'assist · 300'), gap(.25), pol('/*', 'unnamed-crawler', 'deny')]; }
  const RENDER = { video: C => Z().player(C, 'Never Gonna Give You Up'), card: C => cardRows(C, Y().RESP.card), data: C => mdRows(C), policy: C => polRows(C) };
  const PRODOF = { video: 'rich', card: 'preview', data: 'data', policy: 'pub' };

  /* ------------------------------------------------------------ X29 hero: the API types itself */
  V().tcard('dtx-t-hero', 'Hero: the API types itself', 'A hero whose visual is a live session: the request is typed into a window, the response streams in line by line (keys in ink, strings in the product colour), and what it means is drawn under it in characters: the YouTube player, the GitHub card, the Data API excerpt with its access bars, the Console policy. Four URLs in a loop; hover does not pause it, reduced motion shows the first result still.', 'hero', (s, I0) => {
    const C = 58, SEQ = ['video', 'card', 'data', 'policy'], frames = [];
    for (const k of SEQ) {
      const R = Y().RESP[k], I = Object.assign({}, I0, { acc: I0[PRODOF[k]] }), req = '> GET iframe.ly/api/' + R.api + '?url=' + R.u, lines = R.lines.slice(0, 15).map(l => jsonRow(l, C));
      const head = n => [{ segs: [seg(req.slice(0, n), 'ink', 600), seg('█', 'acc')], blk: true }];
      for (let n = 2; n <= req.length; n += 2) frames.push([head(n), I, 32]);
      const base = [{ segs: [seg(req, 'ink', 600)] }, { segs: [seg('200 OK · ' + R.ms + ' ms · ' + R.site, 'mute')] }, gap(.5)];
      frames.push([base, I, 260]);
      for (let n = 1; n <= lines.length; n++) frames.push([base.concat(lines.slice(0, n)), I, 55]);
      frames.push([base.concat(lines, [gap(.5), { segs: [seg('── rendered ' + '─'.repeat(C - 12), 'rule')], blk: true }, gap(.3)], RENDER[k](C)), I, 3200]);
    }
    const win = document.createElement('div'), bar = document.createElement('div'), body = V().pre([], s, I0, 12, 'padding:14px 18px 18px;min-height:' + Math.round(36 * 12 * Z().TFONT[s.tfont].lh) + 'px');
    win.style.cssText = `box-shadow:inset 0 0 0 1px ${I0.rule};background:${s.theme === 'black' ? '#0b0b0b' : '#ffffff'}`;
    bar.style.cssText = `display:flex;justify-content:space-between;padding:9px 18px;font:400 12px ${GMONO};color:${I0.mute};box-shadow:inset 0 -1px 0 ${I0.rule}`; bar.innerHTML = '<span>iframely.com/try</span><span>· · ·</span>';
    win.append(bar, body.el);
    let f = DEMOS.reduced ? frames.findIndex(x => x[2] === 3200) : 0; body.el.innerHTML = html(frames[f][0], frames[f][1]);
    if (!DEMOS.reduced) live(win, () => { f = (f + 1) % frames.length; body.el.innerHTML = html(frames[f][0], frames[f][1]); return frames[f][2]; }, 400);
    const copy = { path: '/', title: 'Send a URL.<br>Get it back,<br>understood.', body: 'Iframely reads any link the way the web’s big platforms do and returns what you need: a player, a card, clean data, or the publisher’s answer.', b1: 'Get an API key', b2: 'Try a link' };
    const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:48px;align-items:start';
    const left = document.createElement('div'); left.style.paddingTop = '24px'; left.innerHTML = copyHTML(I0, copy, true); g.append(left, win);
    const text = plainCopy(copy) + frames.filter(x => x[2] === 3200).map(x => txt(x[0], x[1])).join('\n\n');
    return V().section(s, null, [{ el: g, text }]);
  });

  /* ------------------------------------------------------------ X30 a URL resolving into data */
  V().tcard('dtx-t-resolve', 'A URL resolving into data', 'The idea under all the dither sections, done in text and made interactive: a YouTube URL and, under it, everything Iframely knows about it (the player, title, author and embed summary), set as characters. Drag the slider and each cell resolves in Bayer order, sweeping left to right: blank, then ., then :, then the real character. Play runs it back and forth.', 'resolve', (s, I) => {
    const C = 46, R = Y().RESP.video, L2 = (k, v) => ({ segs: [seg(k + ' ', 'body'), seg('.'.repeat(Math.max(1, C - k.length - v.length - 2)), 'rule'), seg(' ' + v, 'ink', 500)] });
    const target = [...Z().player(C, 'Never Gonna Give You Up'), gap(.4), { segs: [seg(R.title.slice(0, C), 'ink', 700)] }, { segs: [seg(R.desc, 'mute')] }, { segs: [seg('// youtube.com', 'acc', 600)] }, gap(.4),
      L2('type', 'player'), L2('rel', 'player · html5 · ssl'), L2('aspect', '16:9 · 1.778'), L2('duration', '3:34'), L2('html', '<iframe src="iframe.ly/…">')];
    const B = DEMOS.typeKit.bayer, cells = target.map(r => (r.gap ? null : r.segs.flatMap(([str, tone, wt, bg]) => [...str].map(ch => ({ ch, tone, wt, bg })))));
    const frame = v => cells.map((row, j) => {
      if (!row) return target[j];
      const segs = row.map((c, i) => { if (c.ch === ' ') return seg(' '); const e = v * 1.55 - (i / C) * .55, t = B(i, j); return e > t + .14 ? seg(c.ch, c.tone, c.wt, c.bg) : e > t ? seg(':', 'mute') : e > t - .16 ? seg('.', 'rule') : seg(' '); });
      return { segs, blk: true };
    });
    const url = V().pre([{ segs: [seg('youtu.be/dQw4w9WgXcQ', 'ink', 700)] }], s, I, 20, 'margin-bottom:14px'), out = V().pre(frame(.5), s, I, 12);
    const ctl = document.createElement('div'); ctl.style.cssText = `display:flex;gap:14px;align-items:center;margin-top:22px;font:400 13px ${GMONO};color:${I.mute}`;
    ctl.innerHTML = `<input type="range" min="0" max="100" value="50" style="width:260px;accent-color:${I.acc}"><button style="height:30px;padding:0 12px;border:0;box-shadow:inset 0 0 0 1px ${I.rule};background:none;color:${I.ink};font:500 12px ${GMONO};cursor:pointer">Play</button><span>resolved 50%</span>`;
    const [rng, play, lab] = ctl.children; let v = .5, dir = 1, on = !DEMOS.reduced; play.textContent = on ? 'Pause' : 'Play'; /* plays by itself unless reduced motion */
    const set = x => { v = Math.max(0, Math.min(1, x)); rng.value = Math.round(v * 100); lab.textContent = 'resolved ' + Math.round(v * 100) + '%'; out.el.innerHTML = html(frame(v), I); };
    rng.oninput = () => { on = false; play.textContent = 'Play'; set(rng.value / 100); };
    play.onclick = () => { on = !on; play.textContent = on ? 'Pause' : 'Play'; };
    live(ctl, () => { if (on) { if ((v >= 1 && dir > 0) || (v <= 0 && dir < 0)) dir = -dir; set(v + dir * .02); } return 60; }, 60);
    const copy = { path: '/preview-api', title: 'A link is a promise.<br>We keep it.', body: 'A URL on its own is a few dozen characters. Behind it is a player, a title, an author, a licence and a set of rules. Iframely resolves all of it, in one call.', b1: 'Get an API key', b2: 'Check a URL' };
    const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:48px;align-items:start';
    const left = document.createElement('div'); left.style.paddingTop = '24px'; left.innerHTML = copyHTML(I, copy); const right = document.createElement('div'); right.append(url.el, out.el, ctl); g.append(left, right);
    return V().section(s, null, [{ el: g, text: plainCopy(copy) + 'youtu.be/dQw4w9WgXcQ\n\n' + txt(target, I) }]);
  });

  /* ------------------------------------------------------------ X31 a link, before and after */
  V().tcard('dtx-t-diff', 'A link, before and after', 'What Iframely does to a link, shown as a diff of a chat log: each pasted URL is a removed line, and what replaces it is added, drawn in characters (a YouTube player, a GitHub card, a news card trimmed by the publisher’s policy). Removed lines on a faint magenta, added on a faint blue, with the - and + gutters in colour.', 'diff', (s, I0) => {
    const C = 66, m = X().mix, I = Object.assign({}, I0, { addbg: m(I0.bg, X().BLUE, s.theme === 'black' ? .16 : .07), delbg: m(I0.bg, I0.pub, s.theme === 'black' ? .16 : .07), addg: X().BLUE, delg: I0.pub });
    const width = r => r.segs.reduce((a, sg) => a + sg[0].length, 0);
    const del = t => ({ segs: [seg('- ', 'delg', 700, 'delbg'), seg(t.padEnd(C), 'body', 400, 'delbg')] });
    const add = r => ({ segs: [seg('+ ', 'addg', 700, 'addbg'), ...r.segs.map(([a, b, c, d]) => [a, b, c, d || 'addbg']), seg(' '.repeat(Math.max(0, C - width(r))), 'ink', 400, 'addbg')], blk: true });
    const hunk = t => ({ segs: [seg(('@@ ' + t + ' @@').padEnd(C + 2), 'mute')] });
    const news = { title: 'Rates hold as inflation cools', site: 'example-news.com', desc: 'The central bank kept rates on hold…' };
    const rows = [{ segs: [seg('chat/#general.txt', 'ink', 700), seg('  3 links · 3 previews', 'mute')] }, { segs: [seg('─'.repeat(C + 2), 'rule')], blk: true },
      hunk('10:42 · dana'), del('check this out https://youtu.be/dQw4w9WgXcQ'), add({ segs: [seg('check this out', 'ink')] }), ...Z().player(C - 2, 'Never Gonna Give You Up').map(add), gap(.6),
      hunk('10:47 · sam'), del('the parser we use: https://github.com/itteco/iframely'), add({ segs: [seg('the parser we use:', 'ink')] }), ...cardRows(C - 2, Y().RESP.card).map(add), gap(.6),
      hunk('11:03 · kim'), del('https://example-news.com/articles/2026/11/rates'), ...cardRows(C - 2, news).map(add), add({ segs: [seg(' excerpt 300 ', 'white', 600, 'pub'), seg('  full text withheld by the publisher', 'mute')] })];
    return V().section(s, { path: '/embeds', title: 'What Iframely<br>does to a link', body: 'People paste links. Your app should show what they point to: a player that plays, a card with the right title and image, and only as much text as the publisher allows.', b1: 'Get an API key', b2: 'See it in Slack' }, [V().pre(rows, s, I, 12)]);
  });

  /* ------------------------------------------------------------ X32 the provider index */
  const PROVIDERS = [['500px.com', 'image'], ['airtable.com', 'docs'], ['anchor.fm', 'audio'], ['audiomack.com', 'audio'], ['bandcamp.com', 'audio'], ['behance.net', 'design'], ['box.com', 'docs'], ['bsky.app', 'social'], ['calendly.com', 'app'], ['canva.com', 'design'], ['codepen.io', 'code'], ['codesandbox.io', 'code'],
    ['dailymotion.com', 'video'], ['docs.google.com', 'docs'], ['dribbble.com', 'design'], ['dropbox.com', 'docs'], ['eventbrite.com', 'app'], ['facebook.com', 'social'], ['figma.com', 'design'], ['flickr.com', 'image'], ['giphy.com', 'image'], ['gist.github.com', 'code'], ['github.com', 'code'], ['gitlab.com', 'code'],
    ['google.com/maps', 'maps'], ['gumroad.com', 'app'], ['imgur.com', 'image'], ['instagram.com', 'social'], ['issuu.com', 'docs'], ['jsfiddle.net', 'code'], ['kickstarter.com', 'app'], ['linkedin.com', 'social'], ['loom.com', 'video'], ['mapbox.com', 'maps'], ['mastodon.social', 'social'], ['medium.com', 'article'],
    ['miro.com', 'design'], ['mixcloud.com', 'audio'], ['notion.so', 'docs'], ['observablehq.com', 'code'], ['openstreetmap.org', 'maps'], ['pinterest.com', 'social'], ['podcasts.apple.com', 'audio'], ['reddit.com', 'social'], ['replit.com', 'code'], ['rumble.com', 'video'], ['scribd.com', 'docs'], ['slideshare.net', 'docs'],
    ['soundcloud.com', 'audio'], ['spotify.com', 'audio'], ['stackblitz.com', 'code'], ['streamable.com', 'video'], ['substack.com', 'article'], ['ted.com', 'video'], ['threads.net', 'social'], ['tiktok.com', 'video'], ['tumblr.com', 'social'], ['twitch.tv', 'video'], ['typeform.com', 'app'], ['unsplash.com', 'image'],
    ['vidyard.com', 'video'], ['vimeo.com', 'video'], ['wikipedia.org', 'article'], ['wistia.com', 'video'], ['x.com', 'social'], ['youtube.com', 'video']];
  V().tcard('dtx-t-index', 'The provider index', 'The provider wall as a book index you can search: an alphabetical list set in type with dot leaders to each provider’s kind, letter headings in blue, a letter rail (letters with providers are dark; click one to jump-filter) and a filter field that narrows the list as you type a domain or a kind. A sample of 66; the real list is 1,900+.', 'index', (s, I) => {
    const W = 34, entry = ([d, k]) => ({ segs: [seg(d + ' ', 'ink', 500), seg('.'.repeat(Math.max(1, W - d.length - k.length - 2)), 'rule'), seg(' ' + k, 'mute')] });
    const el = document.createElement('div'), top = document.createElement('div'), list = document.createElement('div'), F = Z().TFONT[s.tfont];
    top.style.cssText = `display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center;margin-bottom:22px;font:400 13px ${GMONO};color:${I.mute}`;
    const inp = document.createElement('input'); inp.placeholder = 'filter: a domain or a kind (video, code…)'; inp.spellcheck = false;
    inp.style.cssText = `width:340px;height:40px;padding:0 14px;border:0;box-shadow:inset 0 0 0 1px ${I.rule};background:${I.bg};color:${I.ink};font:400 14px ${GMONO};outline:none`;
    const rail = document.createElement('div'), count = document.createElement('span'), have = new Set(PROVIDERS.map(p => p[0][0].toUpperCase()));
    rail.style.cssText = 'display:flex;gap:7px;flex-wrap:wrap';
    for (const ch of '5ABCDEFGHIJKLMNOPQRSTUVWXYZ') { const b = document.createElement('span'); b.textContent = ch; b.style.cssText = `cursor:${have.has(ch) ? 'pointer' : 'default'};color:${have.has(ch) ? I.ink : I.rule};font-weight:${have.has(ch) ? 600 : 400}`; if (have.has(ch)) b.onclick = () => { inp.value = '^' + ch.toLowerCase(); draw(); }; rail.appendChild(b); }
    top.append(inp, rail, count);
    list.style.cssText = `columns:3;column-gap:40px;font:400 12.5px/${F.lh} ${F.fam};white-space:pre;font-variant-ligatures:none`;
    const draw = () => {
      const q = inp.value.trim().toLowerCase(), hit = PROVIDERS.filter(([d, k]) => !q || (q[0] === '^' ? d.startsWith(q.slice(1)) : d.includes(q) || k === q)), rows = []; let last = '';
      for (const p of hit) { const L = p[0][0].toUpperCase(); if (L !== last) { if (last) rows.push(gap(.5)); rows.push({ segs: [seg('── ' + L + ' ' + '─'.repeat(W - 5), 'acc', 600)], blk: true }); last = L; } rows.push(entry(p)); }
      list.innerHTML = rows.length ? html(rows, I) : `<span style="color:${I.mute}">nothing here yet: ask us to add it</span>`;
      count.textContent = `showing ${hit.length} of 1,900+`;
    };
    inp.oninput = draw; draw();
    el.append(top, list);
    const all = []; let last = ''; for (const p of PROVIDERS) { if (p[0][0] !== last) { all.push({ segs: [seg('── ' + p[0][0].toUpperCase(), 'acc')] }); last = p[0][0]; } all.push(entry(p)); }
    return V().section(s, { path: '/providers', title: '1,900 providers,<br>A to Z', body: 'Every provider is a parser someone maintains. Search for the sites your users link to; if one is missing, tell us and it usually ships within the week.', b1: 'Request a provider', b2: 'Full list' }, [{ el, text: txt(all, I) }]);
  });

  /* ------------------------------------------------------------ X33 the API as a man page */
  V().tcard('dtx-t-man', 'The API as a man page', 'A docs block for developers set as a Unix manual page: IFRAMELY(1) header and footer, NAME, SYNOPSIS, DESCRIPTION, OPTIONS with the parameter names in blue, HTTP STATUS, EXAMPLES and SEE ALSO, in Geist Mono at a fixed 76 columns. Parameters and statuses are illustrative; check them against the docs before using the block.', 'man', (s, I) => {
    const W = 76, sp = (a, b, c) => { const g = W - a.length - b.length - c.length, l = Math.floor(g / 2); return a + ' '.repeat(l) + b + ' '.repeat(g - l) + c; };
    const H = t => ({ segs: [seg(t, 'ink', 700)] }), P = (t, tone, wt) => ({ segs: [seg('       '), seg(t, tone || 'body', wt)] }), O = (k, d) => ({ segs: [seg('       '), seg(k.padEnd(16), 'acc', 600), seg(d, 'body')] });
    const rows = [{ segs: [seg(sp('IFRAMELY(1)', 'Iframely Manual', 'IFRAMELY(1)'), 'ink', 600)] }, gap(),
      H('NAME'), P('iframely - turn any URL into an embed, a card, data or a policy decision'), gap(.6),
      H('SYNOPSIS'), { segs: [seg('       GET ', 'mute'), seg('iframe.ly/api/iframely', 'ink', 600), seg('?url=', 'mute'), seg('URL', 'acc', 600), seg(' [&iframe=1] [&card=small]', 'body')] }, { segs: [seg('       GET ', 'mute'), seg('iframe.ly/api/data', 'ink', 600), seg('?url=', 'mute'), seg('URL', 'acc', 600), seg('&mode=assist [&use=reference]', 'body')] }, gap(.6),
      H('DESCRIPTION'), P('Reads URL the way the big platforms do, with 1,900+ maintained'), P('parsers, and returns meta, links by rel (player, thumbnail, app),'), P('and ready HTML. The Data API adds what the publisher allows for'), P('the declared mode and use.'), gap(.6),
      H('OPTIONS'), O('iframe=1', 'wrap the embed in a responsive Iframely player'), O('card=small', 'return a link card instead of the bare embed'), O('media=1', 'prefer the media player over a summary card'), O('maxwidth=N', 'fit players and images to N pixels'), O('omit_script=1', 'leave out the script; you load it once per page'), gap(.6),
      H('HTTP STATUS'), O('200', 'resolved'), O('403', 'the publisher does not allow this use'), O('404', 'the page does not exist'), O('417', 'nothing to embed; meta only'), gap(.6),
      H('EXAMPLES'), { segs: [seg('       $ ', 'mute'), seg('curl "iframe.ly/api/iframely?url=youtu.be/dQw4w9WgXcQ&iframe=1"', 'ink')] }, P('{ "meta": { "title": "Rick Astley - Never Gonna…", "medium": "video" }, …', 'mute'), gap(.6),
      H('SEE ALSO'), P('oembed(5), opengraph(5), robots.txt(5), iframely-console(8)'), gap(), { segs: [seg(sp('Iframely 2026.11', '2026-11-05', 'IFRAMELY(1)'), 'ink', 600)] }];
    const box = V().pre(rows, s, I, 13, `padding:28px 32px;box-shadow:inset 0 0 0 1px ${I.rule};display:inline-block`);
    return V().section(s, { path: '/docs', title: 'Documented like<br>the tools you trust', body: 'One endpoint, a handful of parameters and plain HTTP statuses. If you have read a man page, you already know how to read ours.', b1: 'Read the docs', b2: 'API reference' }, [box]);
  });

  /* ------------------------------------------------------------ X34 a year of parser fixes */
  V().tcard('dtx-t-heatmap', 'A year of parser fixes', 'Maintenance made visible: 53 weeks × 7 days of parser fixes as a contribution heatmap, each day two characters wide so the cells are square (·· none, then ░░ ▒▒ ▓▓ ██), month labels above and Mon / Wed / Fri at the side, a legend, the totals, and the latest fixes as commit lines with the provider in blue. Data is mock.', 'heatmap', (s, I) => {
    const hs = DEMOS.typeKit.hash, start = new Date(Date.UTC(2025, 10, 9)), MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], CH = ['··', '░░', '▒▒', '▓▓', '██'];
    let total = 0; const lv = (w, d) => { const we = d === 0 || d === 6, v = (we ? .12 : .5) + .45 * hs(w, d, 3) + w * .004 - (hs(w, d, 9) < .08 ? 1 : 0); const l = Math.max(0, Math.min(4, Math.floor(v * 4.2))); total += [0, 2, 5, 9, 14][l]; return l; };
    const monthRow = new Array(4 + 53 * 2).fill(' '); let pm = -1;
    for (let w = 0; w < 53; w++) { const dt = new Date(start.getTime() + w * 7 * 864e5), mo = dt.getUTCMonth(); if (mo !== pm) { [...MON[mo]].forEach((c, k) => { if (4 + w * 2 + k < monthRow.length) monthRow[4 + w * 2 + k] = c; }); pm = mo; } }
    const rows = [{ segs: [seg(monthRow.join(''), 'mute')] }];
    for (let d = 0; d < 7; d++) { const segs = [seg(({ 1: 'Mon', 3: 'Wed', 5: 'Fri' }[d] || '').padEnd(4), 'mute')]; for (let w = 0; w < 53; w++) { const l = w === 52 && d > 3 ? -1 : lv(w, d); segs.push(seg(l < 0 ? '  ' : CH[l], l > 0 ? 'acc' : 'rule')); } rows.push({ segs, blk: true }); }
    rows.push(gap(.6), { segs: [seg(`${total.toLocaleString('en-US')} parser fixes in the last year`, 'ink', 600), seg(' '.repeat(28)), seg('less ', 'mute'), ...CH.map((c, i) => seg(c + ' ', i ? 'acc' : 'rule')), seg('more', 'mute')], blk: true }, gap(.8));
    [['youtube.com', 'Shorts keep 9:16 inside the player'], ['x.com', 'quote posts unfurl with their media'], ['bandcamp.com', 'new provider, number 1,900'], ['figma.com', 'prototypes embed without the toolbar'], ['tiktok.com', 'photo carousels come back as cards']].forEach(([p, t], n) => {
      rows.push({ segs: [seg('2026-11-0' + (5 - n) + '  ', 'mute'), seg((n === 2 ? 'feat' : 'fix') + '(', 'body'), seg(p, 'acc', 600), seg(')', 'body'), seg(' '.repeat(Math.max(1, 14 - p.length)) + t, 'ink')] });
    });
    return V().section(s, { path: '/providers', title: 'Maintained by hand,<br>every day', body: 'Sites change their players, their markup and their rules all the time. Someone at Iframely notices, fixes the parser and ships it, most days of the year.', b1: 'Request a provider', b2: 'Changelog' }, [V().pre(rows, s, I, 11)]);
  });
})();
