/* pd-terminal · the check sequence from the terminal board, typed live: command, ticks, a cross, a braille spinner,
   a progress bar, then the result. Three URLs cycle; hover pauses. Plain DOM and timers, no library needed. */
(() => {
  const CSS = `
.tm{position:absolute;inset:0;background:var(--ink);border-radius:12px;padding:14px 18px 18px;color:var(--bg);font:12.5px/1.75 var(--mono);font-weight:var(--fl-mono-weight,400);overflow:hidden;display:flex;flex-direction:column}
.tm-bar{display:flex;gap:6px;align-items:center;margin-bottom:8px;font-size:11px;color:#8a857c}.tm-bar i{width:9px;height:9px;border-radius:50%;display:inline-block}
.tm-bar span{margin-left:auto}
.tm-body{white-space:pre;flex:1;min-height:0}
.tm .b{color:#7b93ff}.tm .g{color:#8fd3a8}.tm .r{color:#ff8a7a}.tm .y{color:#f2d58a}.tm .d{color:#8a857c}
.tm .cur{display:inline-block;width:7px;height:14px;background:#7b93ff;vertical-align:-2px;animation:blink 1s steps(2) infinite}
@container (max-width:760px){.tm{font-size:10px;line-height:1.7;padding:10px 12px 12px}}`;
  const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
  const RUNS = [
    { url: 'https://open.spotify.com/track/4uLU6hMC', steps: [['✓', 'fetched', '200 · 67 ms · text/html'], ['✓', 'oembed', 'https://open.spotify.com/oembed'], ['✓', 'open graph', 'title · description · image 640×640'], ['✓', 'twitter card', 'player'], ['✗', 'json-ld', 'not found']], render: 'rendering player', result: ['player · 1 : 1 · signed', 'hit (ttl 23h 14m)'] },
    { url: 'https://nytimes.com/2026/10/21/technology/web-glue.html', steps: [['✓', 'fetched', '200 · 212 ms · text/html'], ['✓', 'open graph', 'title · description · image 1200×630'], ['✓', 'json-ld', 'NewsArticle · author · datePublished'], ['✓', 'paywall', 'preview only, per publisher rule'], ['✗', 'oembed', 'not offered']], render: 'rendering reader', result: ['reader · 1,240 words · 6 min', 'miss → stored 24 h'] },
    { url: 'https://notion.so/Team-wiki-Launch-plan-3f2a9c', steps: [['✓', 'fetched', '200 · 131 ms · text/html'], ['✓', 'open graph', 'title · icon'], ['✓', 'app embed', 'allow-scripts · allow-same-origin'], ['✓', 'signed src', 'cdn.iframe.ly/n7x2…'], ['✗', 'twitter card', 'none']], render: 'rendering app', result: ['rich · responsive · signed', 'hit (ttl 2h 03m)'] },
  ];
  DEMOS.register('pd-terminal', {
    group: 'pd', title: 'Check a URL from the terminal',
    copy: { eyebrow: 'For automated systems', title: 'Know what a URL will do before you ship it', text: 'One command runs every parser Iframely has against a link and tells you what came back, what was missing and how it will render.', cta: 'npx iframely check' },
    blurb: 'T4 from the terminal board, live: the command types in, each check prints with a tick or a cross, a braille spinner runs while the progress bar fills, then the result. Three URLs cycle; hover to pause. Plain DOM with a cancellable timeline; no library needed for this one.',
    mount(stage) {
      const { h } = DEMOS;
      if (!document.getElementById('css-tm')) document.head.appendChild(h('style', { id: 'css-tm' }, CSS));
      const body = h('div', { class: 'tm-body' });
      stage.appendChild(h('div', { class: 'tm' }, h('div', { class: 'tm-bar' }, h('i', { style: 'background:var(--pink)' }), h('i', { style: 'background:var(--sand)' }), h('i', { style: 'background:var(--mint)' }), h('span', null, 'iframely — check — 80×24')), body));
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      const line = (...kids) => { const el = h('div', null, ...kids); body.appendChild(el); return el; };
      const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
      if (DEMOS.reduced) { const R = RUNS[0]; line(h('span', { class: 'b' }, '$ '), 'npx iframely check ' + R.url); line(''); R.steps.forEach(([m, k, v]) => line(h('span', { class: m === '✓' ? 'g' : 'r' }, '  ' + m + ' '), pad(k, 20), h('span', { class: 'd' }, v))); line(h('span', { class: 'g' }, '  ✓ '), pad(R.render.replace('rendering', 'rendered'), 20), h('span', { class: 'b' }, '████████████████████'), '  100%'); line(''); line(h('span', { class: 'd' }, '  result   '), R.result[0]); line(h('span', { class: 'd' }, '  cache    '), R.result[1]); return () => {}; }
      (async () => {
        let n = 0;
        while (tl.alive) {
          const R = RUNS[n++ % RUNS.length]; body.innerHTML = '';
          const cmd = line(h('span', { class: 'b' }, '$ '), h('span', null, ''), h('span', { class: 'cur' })); const txt = cmd.children[1];
          await tl.wait(500); for (const ch of 'npx iframely check ' + R.url) { if (!tl.alive) return; txt.textContent += ch; await tl.sleep(14 + Math.random() * 22); }
          await tl.wait(350); cmd.lastChild.remove(); line('');
          for (const [m, k, v] of R.steps) { line(h('span', { class: m === '✓' ? 'g' : 'r' }, '  ' + m + ' '), pad(k, 20), h('span', { class: 'd' }, v)); await tl.wait(160 + Math.random() * 220); }
          const sp = h('span', { class: 'b' }, '  ' + SPIN[0] + ' '), bar = h('span', null), pct = h('span', null, '   0%'); line(sp, pad(R.render, 20), bar, pct);
          const t0 = performance.now(), dur = 1400; let fr = 0;
          while (tl.alive) { const p = Math.min(1, (performance.now() - t0) / dur); const filled = Math.round(p * 20); bar.innerHTML = '<span class="b">' + '█'.repeat(filled) + '</span><span class="d">' + '░'.repeat(20 - filled) + '</span>'; pct.textContent = ('  ' + Math.round(p * 100) + '%').slice(-5); sp.textContent = '  ' + SPIN[fr++ % SPIN.length] + ' '; if (p >= 1) break; await tl.sleep(70); }
          sp.className = 'g'; sp.textContent = '  ✓ '; sp.nextSibling.textContent = pad(R.render.replace('rendering', 'rendered'), 20);
          await tl.wait(300); line(''); line(h('span', { class: 'd' }, '  result   '), R.result[0]); line(h('span', { class: 'd' }, '  cache    '), R.result[1]); line(''); line(h('span', { class: 'b' }, '$ '), h('span', { class: 'cur' }));
          await tl.wait(3000);
        }
      })();
      return () => tl.destroy();
    },
  });
})();
