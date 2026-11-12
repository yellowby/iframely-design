/* pd-one-url · "One URL in, four results out", scripted with Motion: a URL types itself, the API answers,
   and the four products fan in with a stagger. Hover a card to lift it; hovering the stage pauses the loop. */
(() => {
  const CSS = `
.ou{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px}
.ou-bar{height:44px;display:flex;align-items:center;gap:6px;padding:0 14px;font:13px var(--mono);flex:none;white-space:nowrap;overflow:hidden}
.ou-bar .proto{color:var(--ink3)}.ou-bar .url{min-width:0;overflow:hidden;text-overflow:ellipsis}.ou-bar .st{margin-left:auto;font-size:11px;color:var(--ink3);display:flex;align-items:center;gap:6px}
.ou-bar .st.busy::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);animation:oupulse .8s infinite}
@keyframes oupulse{50%{opacity:.15}}
.ou-grid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px}
.ou-card{padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0;opacity:0;transition:box-shadow .2s,border-color .2s;cursor:default;overflow:hidden}
.ou-card:hover{border-color:var(--accent);box-shadow:0 14px 30px -16px rgba(31,63,224,.4)}
.ou-card .label{display:flex;justify-content:space-between;white-space:nowrap}
.ou-card .label .go{opacity:0;transition:opacity .2s}.ou-card:hover .label .go{opacity:1}
.ou-player{flex:1;min-height:0;border-radius:8px;background:var(--ink);display:grid;place-items:center}
.ou-img{flex:1;min-height:0;border-radius:6px;display:grid;place-items:center;font:11px var(--mono);color:var(--ink2)}
.ou-t{font:600 13px var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ou-d{font:11px var(--sans);color:var(--ink3)}
.ou-json{font:11px/1.6 var(--mono);color:var(--ink2);white-space:pre;overflow:hidden}.ou-json b{color:var(--accent);font-weight:500}
.ou-rule{display:grid;grid-template-columns:auto 1fr;gap:3px 10px;font:11px/1.5 var(--mono)}.ou-rule span:nth-child(odd){color:var(--ink3)}.ou-rule span:nth-child(even){color:var(--accent)}
.ou-app{flex:1;min-height:0;display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:8px;background:var(--bg2)}
.ou-reader{flex:1;min-height:0;display:flex;flex-direction:column;gap:5px;padding:8px 10px;border-left:3px solid var(--sand)}
@container (max-width:760px){.ou-bar{font-size:11px;height:38px;padding:0 10px}.ou-card{padding:9px;gap:6px}.ou-json{font-size:10px}.ou-rule{font-size:10px}.ou-t{font-size:12px}}`;
  const DATA = [
    { url: 'youtube.com/watch?v=dQw4w9WgXcQ', site: 'YouTube', title: 'Rick Astley – Never Gonna Give You Up', kind: 'player', tint: 'pink', json: [['type', '"video"'], ['duration', '213'], ['author', '"Rick Astley"']], rule: [['autoplay', 'off'], ['consent', 'EU only'], ['embeds', 'allowed']], ms: 140 },
    { url: 'notion.so/Team-wiki-Launch-plan-3f2a9c', site: 'Notion', title: 'Team wiki · Launch plan', kind: 'app', tint: 'sky', json: [['type', '"rich"'], ['author', '"Alex M."'], ['updated', '"2026-10-21"']], rule: [['embeds', 'signed'], ['consent', 'none'], ['preview', 'card']], ms: 131 },
    { url: 'nytimes.com/2026/10/21/technology/web-glue.html', site: 'The New York Times', title: 'The Web Still Needs Glue', kind: 'reader', tint: 'sand', json: [['type', '"reader"'], ['published', '"2026-10-21"'], ['words', '1240']], rule: [['embeds', 'preview only'], ['paywall', 'respect'], ['consent', 'none']], ms: 122 },
  ];
  DEMOS.register('pd-one-url', {
    group: 'pd', title: 'One URL, four results',
    copy: { eyebrow: 'Rich Media · Preview API · Data API · Publisher Console', title: 'One URL in. Four results out.', text: 'Send any link to one endpoint and get back the richest embed the publisher allows, a preview card, structured data and the rules the publisher set.', cta: 'Get an API key' },
    blurb: 'The D38 hero candidate as a scripted scene: the URL types itself, the bar shows the round trip, then Rich Media, Preview, Data and Publisher Console cards fan in with a Motion stagger. Three sample URLs cycle; hovering the stage pauses, hovering a card lifts it. Built from the real card components, so copy and layout stay editable.',
    mount(stage) {
      const { h, P } = DEMOS; const { animate, stagger } = window.Motion;
      if (!document.getElementById('css-ou')) document.head.appendChild(h('style', { id: 'css-ou' }, CSS));
      const url = h('span', { class: 'url' }), caret = h('span', { class: 'caret' }), st = h('span', { class: 'st' });
      const bar = h('div', { class: 'ou-bar m-card' }, h('span', { class: 'proto' }, 'https://'), url, caret, st);
      const cards = ['Rich Media', 'Preview API', 'Data API', 'Publisher Console'].map(n => h('div', { class: 'ou-card m-card' }, h('div', { class: 'label' }, h('span', null, n), h('span', { class: 'go' }, '→'))));
      const grid = h('div', { class: 'ou-grid' }, ...cards);
      stage.appendChild(h('div', { class: 'ou' }, bar, grid));
      const bars = n => Array.from({ length: n }, (_, i) => h('div', { class: 'm-bar' + (i ? '' : ' dark'), style: 'width:' + (90 - i * 17) + '%' }));
      function fill(d) {
        const body = [
          d.kind === 'player' ? h('div', { class: 'ou-player' }, h('div', { class: 'm-play sm' })) : d.kind === 'app' ? h('div', { class: 'ou-app' }, ...bars(3)) : h('div', { class: 'ou-reader' }, ...bars(4)),
          [h('div', { class: 'ou-img', style: 'background:var(--' + d.tint + ')' }, '1200 × 630'), h('div', { class: 'ou-t' }, d.title), h('div', { class: 'ou-d' }, d.site)],
          h('div', { class: 'ou-json', html: '{\n' + d.json.map(([k, v]) => '  <b>"' + k + '"</b>: ' + v).join(',\n') + '\n}' }),
          h('div', { class: 'ou-rule' }, ...d.rule.flatMap(([k, v]) => [h('span', null, k), h('span', null, v)])),
        ];
        cards.forEach((c, i) => { while (c.children.length > 1) c.lastChild.remove(); c.append(...[body[i]].flat()); });
      }
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage)); const live = new Set();
      const run = (...a) => { const an = animate(...a); live.add(an); an.then(() => live.delete(an), () => {}); return an; };
      if (DEMOS.reduced) { const d = DATA[0]; url.textContent = d.url; st.textContent = d.ms + ' ms'; fill(d); cards.forEach(c => (c.style.opacity = 1)); return () => {}; }
      (async () => {
        let i = 0;
        while (tl.alive) {
          const d = DATA[i % DATA.length]; i++;
          url.textContent = ''; st.textContent = ''; st.classList.remove('busy'); caret.style.display = '';
          await tl.wait(500);
          for (const ch of d.url) { if (!tl.alive) return; url.textContent += ch; await tl.sleep(22 + Math.random() * 30); }
          await tl.wait(300); caret.style.display = 'none'; st.textContent = 'fetching'; st.classList.add('busy');
          await tl.wait(650); st.classList.remove('busy'); st.textContent = d.ms + ' ms · cached';
          fill(d);
          await run(cards, { opacity: [0, 1], y: [-18, 0], scale: [.96, 1] }, { duration: .6, delay: stagger(.11), ease: [.2, .7, .2, 1] });
          await tl.wait(3600);
          await run(cards, { opacity: 0, y: 10 }, { duration: .3, delay: stagger(.05), ease: 'easeIn' });
          await tl.wait(350);
        }
      })();
      return () => { tl.destroy(); live.forEach(a => a.stop && a.stop()); };
    },
  });
})();
