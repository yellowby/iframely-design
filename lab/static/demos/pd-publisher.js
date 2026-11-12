/* pd-publisher · Publisher Console concept: four rules on the left, the embed on the right obeys them, the rule JSON updates.
   Fully interactive; until you touch it, it flips a rule every few seconds to show what changes. */
(() => {
  const CSS = `
.pub{position:absolute;inset:0;display:grid;grid-template-columns:minmax(150px,190px) 1fr;gap:12px}
.pub-panel{padding:12px;display:flex;flex-direction:column;gap:2px;min-width:0}
.pub-panel .label{margin-bottom:6px}
.tg{display:flex;align-items:center;justify-content:space-between;gap:8px;font:12px var(--sans);cursor:pointer;padding:8px 0;border-bottom:1px solid var(--line);user-select:none}
.tg:last-of-type{border-bottom:0}
.sw{width:30px;height:18px;border-radius:9px;background:#d9d5cc;position:relative;transition:background .25s;flex:none}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .25s cubic-bezier(.2,.7,.2,1)}
.sw.on{background:var(--accent)}.sw.on::after{transform:translateX(12px)}
.pub-json{font:11px/1.6 var(--mono);color:var(--ink2);white-space:pre;margin-top:auto;padding-top:10px}
.pub-json .ln{display:block;border-radius:4px;padding:0 4px;margin:0 -4px}.pub-json .k{color:var(--ink3)}.pub-json .v{color:var(--accent)}
.pub-right{display:flex;flex-direction:column;gap:8px;min-width:0}
.pub-ctx{font:11px var(--mono);color:var(--ink3);display:flex;gap:8px;align-items:center}
.pub-embed{position:relative;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0}
.pub-img{height:52%;min-height:0;border-radius:8px;background:var(--pink);display:grid;place-items:center;transition:height .45s cubic-bezier(.2,.7,.2,1),opacity .3s,margin .45s;position:relative;overflow:hidden}
.pub-embed.noimg .pub-img{height:0;opacity:0;margin-top:-8px}
.pub-eq{display:flex;gap:4px;align-items:flex-end;height:28px}.pub-eq i{display:block;width:5px;height:40%;background:var(--ink);border-radius:2px;animation:pubeq .9s ease-in-out infinite}
.pub-eq i:nth-child(2){animation-delay:.15s}.pub-eq i:nth-child(3){animation-delay:.3s}.pub-eq i:nth-child(4){animation-delay:.45s}
@keyframes pubeq{0%,100%{height:30%}50%{height:100%}}
@media (prefers-reduced-motion:reduce){.pub-eq i{animation:none;height:60%}}
.pub-consent{position:absolute;inset:0;background:rgba(247,245,240,.75);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font:12px var(--sans);color:var(--ink2);text-align:center;padding:12px;opacity:0;pointer-events:none;transition:opacity .3s}
.pub-embed.consent .pub-consent{opacity:1;pointer-events:auto}
.pub-consent .btn{height:30px;padding:0 12px;font-size:12px}
.pub-t{font:600 13px var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pub-d{font:11px var(--sans);color:var(--ink3)}
.pub-link{display:none;font:12px var(--mono);color:var(--link);text-decoration:underline;padding:8px 0}
.pub-embed.plain .pub-img,.pub-embed.plain .pub-t,.pub-embed.plain .pub-d{display:none}.pub-embed.plain .pub-link{display:block}
@container (max-width:760px){.pub{grid-template-columns:minmax(120px,136px) 1fr;gap:8px}.pub-panel{padding:9px}.tg{font-size:11px;padding:6px 0;gap:6px}.sw{width:26px;height:16px}.sw::after{width:12px;height:12px}.sw.on::after{transform:translateX(10px)}.pub-json{font-size:9.5px;line-height:1.5}.pub-ctx{font-size:10px}.pub-img{height:44%}.pub-t{font-size:12px}}`;
  DEMOS.register('pd-publisher', {
    group: 'pd', title: 'Publisher rules',
    copy: { eyebrow: 'For publishers', title: 'Your content, your rules, everywhere it travels', text: 'Decide once in the Publisher Console how your pages may be embedded, previewed and played, and every product on Iframely follows.', cta: 'Open the Publisher Console' },
    blurb: 'An interactive concept for the Publisher Console: four rules (autoplay, preview image, consent, allow in previews) and the embed they govern, drawn with real components so the consent overlay, equaliser and plain-link fallback are the actual states. The rule JSON flashes the key that changed (Motion). Until you click, a rule flips every few seconds.',
    mount(stage) {
      const { h } = DEMOS; const { animate } = window.Motion;
      if (!document.getElementById('css-pub')) document.head.appendChild(h('style', { id: 'css-pub' }, CSS));
      const state = { autoplay: false, image: true, consent: false, previews: true }; let accepted = false, touched = false;
      const sw = {}; const rows = [['autoplay', 'Allow autoplay'], ['image', 'Show preview image'], ['consent', 'Require consent (EU)'], ['previews', 'Allow in previews']].map(([k, l]) => { sw[k] = h('span', { class: 'sw' }); return h('div', { class: 'tg', onclick: () => { touched = true; toggle(k); } }, h('span', null, l), sw[k]); });
      const json = h('div', { class: 'pub-json' });
      const panel = h('div', { class: 'pub-panel m-card' }, h('div', { class: 'label' }, 'youtube.com · rules'), ...rows, json);
      const img = h('div', { class: 'pub-img' }); const consent = h('div', { class: 'pub-consent' }, h('span', null, 'Load content from YouTube?'), h('button', { class: 'btn primary', onclick: () => { touched = true; accepted = true; render(); } }, 'Load video'));
      const embed = h('div', { class: 'pub-embed m-card' }, img, consent, h('div', { class: 'pub-t' }, 'Rick Astley – Never Gonna Give You Up'), h('div', { class: 'pub-d' }, 'YouTube · 3:33'), h('a', { class: 'pub-link', href: '#' }, 'youtube.com/watch?v=dQw4w9WgXcQ ↗'));
      const right = h('div', { class: 'pub-right' }, h('div', { class: 'pub-ctx' }, h('span', { class: 'chip' }, 'chat app'), 'how the link renders for a user in Berlin'), embed);
      stage.appendChild(h('div', { class: 'pub' }, panel, right));
      const lines = {};
      function renderJson(changed) {
        const v = { autoplay: state.autoplay, preview_image: state.image, consent: state.consent ? '"eu"' : '"none"', embeds: state.previews ? '"allowed"' : '"link-only"' };
        json.innerHTML = ''; json.append(h('span', { class: 'ln' }, '{'));
        Object.entries(v).forEach(([k, val], i, arr) => { const ln = h('span', { class: 'ln' }, h('span', { class: 'k' }, '  "' + k + '"'), ': ', h('span', { class: 'v' }, String(val)), i < arr.length - 1 ? ',' : ''); lines[k] = ln; json.append(ln); });
        json.append(h('span', { class: 'ln' }, '}'));
        const map = { autoplay: 'autoplay', image: 'preview_image', consent: 'consent', previews: 'embeds' };
        if (changed && lines[map[changed]]) animate(lines[map[changed]], { backgroundColor: ['rgba(216,231,255,1)', 'rgba(216,231,255,0)'] }, { duration: 1.4, ease: 'easeOut' });
      }
      function render(changed) {
        for (const k in sw) sw[k].classList.toggle('on', state[k]);
        embed.classList.toggle('plain', !state.previews); embed.classList.toggle('noimg', !state.image); embed.classList.toggle('consent', state.consent && !accepted);
        img.innerHTML = ''; img.append(state.autoplay ? h('div', { class: 'pub-eq' }, h('i'), h('i'), h('i'), h('i')) : h('div', { class: 'm-play' }));
        renderJson(changed);
      }
      function toggle(k) { state[k] = !state[k]; if (k === 'consent') accepted = false; render(k); }
      render();
      const tl = DEMOS.timeline(DEMOS.hoverPause(stage));
      if (!DEMOS.reduced) (async () => { const order = ['autoplay', 'consent', 'image', 'previews', 'previews', 'image', 'consent', 'autoplay']; let i = 0; await tl.wait(1800); while (tl.alive && !touched) { toggle(order[i++ % order.length]); await tl.wait(2400); } })();
      return () => tl.destroy();
    },
  });
})();
