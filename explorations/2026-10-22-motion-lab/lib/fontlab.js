/* FontLab · font switcher shared by the motion lab and the website prototype (same file in both; the lab copy is canonical).
   Runs as a classic script or as an ES-module side-effect import and sets globalThis.FontLab.
   - Registry of families per role (serif headings, sans base, mono) from Google Fonts, self-hosted files (Fontshare) or local files
     declared in a FONTLAB_LOCAL array before this script (fonts/local.js).
   - Loads a family on demand (one <link> or @font-face block per family) and writes the choice as CSS variables on <html>:
       --fl-serif --fl-serif-weight --fl-serif-style --fl-serif-scale --fl-serif-tracking --fl-serif-lh
       --fl-sans --fl-sans-weight  --fl-mono --fl-mono-weight
     plus host aliases (--serif/--sans/--mono in the lab, --font-display/--font-sans/--font-mono in the prototype),
     data-fl="1" and data-fl-apply="h1|h1-h2|h1-h3|off" (which heading levels take the serif; used by the prototype's CSS).
   - Remembers the choice in localStorage; URL query keys override it (serif, sw, si, ss, st, sans, bw, mono, mw, apply).
   - FontLab.pane(Pane, opts) builds the Tweakpane 4 panel; the host passes the Pane class (CDN module or npm). */
// @ts-nocheck
(function (root) {
  'use strict';
  if (root.FontLab) return;

  const GOOGLE = 'https://fonts.googleapis.com/css2?family=';
  const TAIL = { serif: ', Georgia, "Times New Roman", serif', sans: ', system-ui, -apple-system, "Segoe UI", sans-serif', mono: ', ui-monospace, Menlo, Consolas, monospace' };
  const g = (id, name, spec, o) => Object.assign({ id, name, role: 'serif', source: 'google', spec, stack: '"' + name + '"' + TAIL.serif, italic: true, scale: 1, tracking: -0.01, lh: 1.04, dw: 400 }, o);

  /* weights: static instances; range: variable axis. scale/tracking/lh: per-face defaults so headlines take the same space (from the round-1 board). */
  const FAMILIES = [
    g('instrument-serif', 'Instrument Serif', 'Instrument+Serif:ital@0;1', { weights: [400], lh: 1.02, note: 'High contrast, condensed. The round-1 pick.' }),
    g('fraunces', 'Fraunces', 'Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900', { range: [100, 900], tracking: -0.02, note: 'Soft, warm, optical sizes. Closest free Reckless.' }),
    g('newsreader', 'Newsreader', 'Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800', { range: [200, 800], scale: 1.04, tracking: -0.015, note: 'Editorial, optical sizes. Closest free Tiempos.' }),
    g('eb-garamond', 'EB Garamond', 'EB+Garamond:ital,wght@0,400..800;1,400..800', { range: [400, 800], scale: 1.07, note: 'Classic old-style; Wispr Flow uses it.' }),
    g('dm-serif-display', 'DM Serif Display', 'DM+Serif+Display:ital@0;1', { weights: [400], scale: 0.98, lh: 1.05, note: 'Sharp display face. Closest free Signifier.' }),
    g('cormorant-garamond', 'Cormorant Garamond', 'Cormorant+Garamond:ital,wght@0,300..700;1,300..700', { range: [300, 700], dw: 500, scale: 1.12, tracking: -0.005, lh: 1.02, note: 'Tall, elegant; needs weight 500 and up.' }),
    g('hedvig-letters-serif', 'Hedvig Letters Serif', 'Hedvig+Letters+Serif:opsz@12..24', { weights: [400], italic: false, scale: 0.98, tracking: -0.015, lh: 1.06, note: 'Compact, friendly.' }),
    g('young-serif', 'Young Serif', 'Young+Serif', { weights: [400], italic: false, scale: 0.93, tracking: -0.015, lh: 1.08, note: 'Chunky, warm.' }),
    g('source-serif-4', 'Source Serif 4', 'Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900', { range: [200, 900], tracking: -0.015, lh: 1.05, note: 'Text serif, safe; optical sizes.' }),
    g('literata', 'Literata', 'Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900', { range: [200, 900], scale: 0.98, tracking: -0.015, lh: 1.06, note: 'Text serif, safe; optical sizes.' }),
    g('crimson-pro', 'Crimson Pro', 'Crimson+Pro:ital,wght@0,200..900;1,200..900', { range: [200, 900], scale: 1.06, note: 'Old-style, light colour.' }),
    g('playfair-display', 'Playfair Display', 'Playfair+Display:ital,wght@0,400..900;1,400..900', { range: [400, 900], scale: 0.98, lh: 1.08, note: 'High contrast, transitional.' }),
    g('bodoni-moda', 'Bodoni Moda', 'Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900', { range: [400, 900], tracking: -0.005, lh: 1.06, note: 'Didone; optical sizes.' }),
    g('lora', 'Lora', 'Lora:ital,wght@0,400..700;1,400..700', { range: [400, 700], scale: 0.97, tracking: -0.015, lh: 1.06, note: 'Calligraphic roots, moderate contrast.' }),
    /* a sans in the headings list, so "serif" headings can be set in the section-picks face */
    g('geist-head', 'Geist', 'Geist:wght@100..900', { stack: 'Geist, Inter' + TAIL.sans, range: [100, 900], italic: false, scale: 0.9, tracking: -0.03, lh: 1.08, note: 'Sans headings, as in the section picks (Geist 400, −2 to −3.5%). No italics.' }),
    { id: 'inter', name: 'Inter', role: 'sans', source: 'google', spec: 'Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900', stack: 'Inter' + TAIL.sans, range: [100, 900], italic: true, note: 'The current body face. Inter 4 with optical sizes.' },
    { id: 'geist', name: 'Geist', role: 'sans', source: 'google', spec: 'Geist:wght@100..900', stack: 'Geist, Inter' + TAIL.sans, range: [100, 900], italic: false, note: 'The Vercel sans. No italics.' },
    { id: 'geist-mono', name: 'Geist Mono', role: 'mono', source: 'google', spec: 'Geist+Mono:wght@100..900', stack: '"Geist Mono", "JetBrains Mono"' + TAIL.mono, range: [100, 900], italic: false, note: 'No italics; no box-drawing glyphs (the terminal demos keep JetBrains Mono for those).' },
    { id: 'jetbrains-mono', name: 'JetBrains Mono', role: 'mono', source: 'google', spec: 'JetBrains+Mono:ital,wght@0,100..800;1,100..800', stack: '"JetBrains Mono", "Geist Mono"' + TAIL.mono, range: [100, 800], italic: true, note: 'Italics, box-drawing and block glyphs.' },
  ];

  const KEYS = ['serif', 'sw', 'si', 'ss', 'st', 'sans', 'bw', 'mono', 'mw', 'apply'];
  const APPLY = ['h1', 'h1-h2', 'h1-h3', 'off'];
  const DEFAULTS = { serif: 'instrument-serif', sw: 400, si: 0, ss: 1, st: -0.01, sans: 'inter', bw: 400, mono: 'geist-mono', mw: 400, apply: 'h1-h2' };
  let S = Object.assign({}, DEFAULTS);
  const cfg = { aliases: {}, storage: 'fontlab:v1', apply: true };
  let inited = false;
  const loaded = new Map(), avail = new Map(), listeners = new Set();

  const byId = id => FAMILIES.find(f => f.id === id);
  const families = role => FAMILIES.filter(f => f.role === role);
  const isVar = f => Array.isArray(f.range);
  function clampW(f, w) {
    w = +w || 400;
    if (isVar(f)) return Math.min(f.range[1], Math.max(f.range[0], w));
    return (f.weights || [400]).reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
  }
  const familyDefaults = f => ({ sw: clampW(f, f.dw || 400), ss: f.scale || 1, st: f.tracking == null ? -0.01 : f.tracking });

  function add(list) {
    for (const f of [].concat(list || [])) {
      if (!f || !f.id || !f.name || byId(f.id)) continue;
      const role = f.role || 'serif';
      FAMILIES.push(Object.assign({ role, source: 'local', italic: false, scale: 1, tracking: -0.01, lh: 1.04, dw: 400, stack: '"' + f.name + '"' + TAIL[role] }, f));
    }
  }

  function el(tag, attrs) { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
  /* Load one family: a stylesheet link (Google, Fontshare API) or generated @font-face rules (local files). Resolves when the faces are usable, best effort. */
  function load(id) {
    const f = byId(id); if (!f) return Promise.resolve(false);
    if (loaded.has(id)) return loaded.get(id);
    let ready = Promise.resolve();
    if (f.source === 'google' || f.source === 'fontshare') {
      const href = f.source === 'google' ? GOOGLE + f.spec + '&display=swap' : 'https://api.fontshare.com/v2/css?f[]=' + f.spec + '&display=swap';
      const link = el('link', { rel: 'stylesheet', href, 'data-fontlab': id });
      ready = new Promise(res => { link.onload = res; link.onerror = res; setTimeout(res, 6000); });
      document.head.appendChild(link);
    } else if (f.files && f.files.length) {
      const css = f.files.map(x => '@font-face{font-family:"' + f.name + '";src:url("' + (f.dir || '') + x.file + '") format("' + (x.format || 'woff2') + '");font-weight:' +
        (Array.isArray(x.weight) ? x.weight.join(' ') : (x.weight || 400)) + ';font-style:' + (x.style || 'normal') + ';font-display:swap}').join('\n');
      const st = el('style', { 'data-fontlab': id }); st.textContent = css; document.head.appendChild(st);
    }
    const p = ready.then(() => {
      if (!(document.fonts && document.fonts.load)) return;
      const w = clampW(f, 400);
      const reqs = [document.fonts.load(w + ' 24px "' + f.name + '"')];
      if (f.italic) reqs.push(document.fonts.load('italic ' + w + ' 24px "' + f.name + '"'));
      return Promise.all(reqs);
    }).then(() => true, () => false);
    p.then(ok => { avail.set(id, ok); });
    loaded.set(id, p); return p;
  }

  function stack(role) { const f = byId(S[role]); return f ? f.stack : ''; }
  function weight(role) { return role === 'serif' ? S.sw : role === 'sans' ? S.bw : S.mw; }

  function save() { try { localStorage.setItem(cfg.storage, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }
  function restore() {
    try { const j = JSON.parse(localStorage.getItem(cfg.storage) || 'null'); if (j && typeof j === 'object') for (const k of KEYS) if (k in j) S[k] = j[k]; } catch (e) { /* ignore */ }
  }
  function coerce(k, v) {
    if (k === 'si') return v === '1' || v === 'true' ? 1 : 0;
    if (k === 'sw' || k === 'ss' || k === 'st' || k === 'bw' || k === 'mw') { const n = parseFloat(v); return isNaN(n) ? DEFAULTS[k] : n; }
    return String(v);
  }
  function fromQuery() {
    let any = false;
    try {
      const q = new URLSearchParams(location.search);
      /* a family named in the URL brings its own weight, size and tracking defaults unless the URL sets them too */
      if (q.has('serif')) { const f = byId(q.get('serif')); if (f) Object.assign(S, familyDefaults(f)); }
      for (const k of KEYS) if (q.has(k)) { any = true; S[k] = coerce(k, q.get(k)); }
    } catch (e) { /* ignore */ }
    return any;
  }
  function validate() {
    for (const role of ['serif', 'sans', 'mono']) { const f = byId(S[role]); if (!f || f.role !== role) S[role] = DEFAULTS[role]; }
    const fs = byId(S.serif), fb = byId(S.sans), fm = byId(S.mono);
    S.sw = clampW(fs, S.sw); S.bw = clampW(fb, S.bw); S.mw = clampW(fm, S.mw);
    S.si = fs.italic && S.si ? 1 : 0;
    S.ss = Math.min(1.3, Math.max(0.8, +S.ss || 1)); S.st = Math.min(0.03, Math.max(-0.05, +S.st || 0));
    if (APPLY.indexOf(S.apply) < 0) S.apply = DEFAULTS.apply;
  }
  function link() {
    const u = new URL(location.href);
    for (const k of KEYS) { if (k === 'apply' && !cfg.apply) continue; u.searchParams.set(k, k === 'si' ? (S.si ? 1 : 0) : S[k]); }
    return u.href;
  }

  function apply() {
    const r = document.documentElement, set = (k, v) => r.style.setProperty(k, String(v));
    const fs = byId(S.serif), fb = byId(S.sans), fm = byId(S.mono);
    set('--fl-serif', fs.stack); set('--fl-serif-weight', S.sw); set('--fl-serif-style', S.si ? 'italic' : 'normal');
    set('--fl-serif-scale', S.ss); set('--fl-serif-tracking', S.st + 'em'); set('--fl-serif-lh', fs.lh || 1.04);
    set('--fl-sans', fb.stack); set('--fl-sans-weight', S.bw);
    set('--fl-mono', fm.stack); set('--fl-mono-weight', S.mw);
    for (const role in cfg.aliases) for (const a of [].concat(cfg.aliases[role])) set(a, 'var(--fl-' + role + ')');
    r.setAttribute('data-fl', '1'); r.setAttribute('data-fl-apply', cfg.apply ? S.apply : 'h1-h3');
    /* the face files load lazily as text renders; ask for the current heading weight/style explicitly so canvas text and document.fonts.check see it */
    const want = (S.si ? "italic " : "") + S.sw + " 24px \"" + fs.name + "\"";
    load(S.serif).then(() => { if (document.fonts && document.fonts.load) document.fonts.load(want).catch(() => {}); });
    load(S.sans); load(S.mono);
    save();
    const snap = Object.assign({}, S);
    listeners.forEach(fn => { try { fn(snap); } catch (e) { console.warn(e); } });
    try { root.dispatchEvent(new CustomEvent('fontlab:change', { detail: snap })); } catch (e) { /* ignore */ }
  }

  /* set({ serif: 'fraunces' }) resets weight, size and tracking to that face's defaults; set({ sw: 500 }) changes one value. */
  function set(patch) {
    patch = patch || {};
    const prev = Object.assign({}, S);
    Object.assign(S, patch);
    if (patch.serif && patch.serif !== prev.serif) { const f = byId(S.serif); if (f) Object.assign(S, familyDefaults(f)); }
    validate(); apply();
  }
  function reset() { S = Object.assign({}, DEFAULTS); validate(); apply(); }

  /* init({ aliases: { serif: '--serif', sans: '--sans', mono: '--mono' }, apply: false, defaults: {...}, storage: 'key' }) */
  function init(options) {
    Object.assign(cfg, options || {});
    if (cfg.defaults) Object.assign(DEFAULTS, cfg.defaults);
    add(root.FONTLAB_LOCAL);
    S = Object.assign({}, DEFAULTS); restore(); fromQuery(); validate(); inited = true; apply();
    return api;
  }

  const fmtTrack = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(3) + 'em';
  function summary() {
    const fs = byId(S.serif), fb = byId(S.sans), fm = byId(S.mono);
    return fs.name + ' ' + S.sw + (S.si ? ' italic' : '') + ' ×' + (+S.ss).toFixed(2) + ' ' + fmtTrack(+S.st) + '\n' + fb.name + ' ' + S.bw + ' · ' + fm.name + ' ' + S.mw;
  }
  function describe(f) {
    const src = f.source === 'google' ? 'Google Fonts' : f.source === 'fontshare' ? 'Fontshare' : f.paid ? 'Local files · licensed' : 'Local files · free licence';
    const w = isVar(f) ? 'variable ' + f.range[0] + '–' + f.range[1] : (f.weights || [400]).join(' / ');
    const missing = f.files && avail.get(f.id) === false ? '\nFILES NOT FOUND at ' + (f.dir || './') + ' (licensed files stay out of the published copy).' : '';
    return src + ' · ' + w + (f.italic ? ' · italic' : '') + (f.note ? '\n' + f.note : '') + missing;
  }
  function copyText(t) {
    const fallback = () => { try { const ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e) { return false; } };
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(() => true, fallback);
    return Promise.resolve(fallback());
  }

  /* Tweakpane 4 panel. opts: { container, title, expanded (first-visit default), apply (show the "serif on" list; defaults to cfg.apply), init (passed to init() when not done yet) }
     Without a container the pane floats; hosts place .fontlab-wrap absolutely in the top-right corner (demos.css, fontlab.css). */
  function pane(Pane, opts) {
    opts = opts || {};
    if (!inited) init(opts.init);
    /* opts.expanded is the first-visit default; the fold state is remembered per host afterwards */
    const foldKey = cfg.storage + ':expanded'; let expanded = opts.expanded !== false;
    try { const v = localStorage.getItem(foldKey); if (v != null) expanded = v === '1'; } catch (e) { /* ignore */ }
    const pn = new Pane({ title: opts.title || 'Type', expanded, container: opts.container });
    pn.on('fold', ev => { try { localStorage.setItem(foldKey, ev.expanded ? '1' : '0'); } catch (e) { /* ignore */ } });
    /* pane.element is the root view; without a container Tweakpane wraps it in a fixed .tp-dfwv, which hosts style as .fontlab-wrap */
    let holder = null;
    if (pn.element) {
      pn.element.classList.add('fontlab-pane');
      const wrap = pn.element.closest('.tp-dfwv');
      if (wrap) {
        wrap.classList.add('fontlab-wrap');
        /* a zero-height sticky holder as the first child of <body>: the pane sits absolutely in its top-right corner and keeps it while the page scrolls */
        holder = document.createElement('div'); holder.className = 'fontlab-holder';
        document.body.insertBefore(holder, document.body.firstChild); holder.appendChild(wrap);
      }
    }
    const showApply = opts.apply == null ? cfg.apply : opts.apply;
    const P = { serif: S.serif, sw: S.sw, si: !!S.si, ss: S.ss, st: S.st, sans: S.sans, bw: S.bw, mono: S.mono, mw: S.mw, apply: S.apply, face: '', set: '' };
    /* list options: free faces first, then licensed ones; when a role has both, the <select> gets two optgroups (Tweakpane keeps option order, so indices still match) */
    const ordered = role => families(role).slice().sort((a, b) => (a.paid ? 1 : 0) - (b.paid ? 1 : 0));
    const optionsFor = role => { const o = {}; for (const f of ordered(role)) o[f.name] = f.id; return o; };
    function groupSelect(binding, role) {
      const fams = ordered(role); if (!fams.some(f => f.paid) || !fams.some(f => !f.paid)) return binding;
      const sel = binding.element && binding.element.querySelector('select'); if (!sel || sel.options.length !== fams.length) return binding;
      const free = document.createElement('optgroup'); free.label = 'Free'; const paid = document.createElement('optgroup'); paid.label = 'Licensed (trial files)';
      Array.from(sel.options).forEach((opt, i) => (fams[i].paid ? paid : free).appendChild(opt));
      sel.append(free, paid); return binding;
    }

    const fh = pn.addFolder({ title: 'Headings' });
    groupSelect(fh.addBinding(P, 'serif', { label: 'Family', options: optionsFor('serif') }), 'serif');
    let wb = null, wbFamily = null;
    function weightBinding() {
      const f = byId(P.serif); if (wb && wbFamily === f.id) return;
      if (wb) wb.dispose(); wbFamily = f.id;
      const o = { label: 'Weight', index: 1, format: v => String(Math.round(v)) };
      let fixed = false;
      if (isVar(f)) Object.assign(o, { min: f.range[0], max: f.range[1], step: 10 });
      else if (f.weights && f.weights.length > 1) Object.assign(o, { min: f.weights[0], max: f.weights[f.weights.length - 1], step: f.weights[1] - f.weights[0] });
      else fixed = true;
      wb = fh.addBinding(P, 'sw', o); if (fixed) wb.disabled = true;
    }
    weightBinding();
    const ib = fh.addBinding(P, 'si', { label: 'Italic' });
    fh.addBinding(P, 'ss', { label: 'Size ×', min: 0.8, max: 1.3, step: 0.01 });
    fh.addBinding(P, 'st', { label: 'Tracking', min: -0.05, max: 0.03, step: 0.005, format: v => v.toFixed(3) + 'em' });
    if (showApply) fh.addBinding(P, 'apply', { label: 'Serif on', options: { 'h1 only': 'h1', 'h1 + h2': 'h1-h2', 'h1 to h3': 'h1-h3', 'off (sans)': 'off' } });
    const face = fh.addBinding(P, 'face', { label: 'Face', readonly: true, multiline: true, rows: 3 });

    const fb = pn.addFolder({ title: 'Base' });
    groupSelect(fb.addBinding(P, 'sans', { label: 'Family', options: optionsFor('sans') }), 'sans');
    fb.addBinding(P, 'bw', { label: 'Body weight', min: 300, max: 700, step: 10 });
    const fm = pn.addFolder({ title: 'Mono' });
    groupSelect(fm.addBinding(P, 'mono', { label: 'Family', options: optionsFor('mono') }), 'mono');
    fm.addBinding(P, 'mw', { label: 'Weight', min: 300, max: 700, step: 10 });

    const sum = pn.addBinding(P, 'set', { label: 'Set', readonly: true, multiline: true, rows: 2 });
    const copy = pn.addButton({ title: 'Copy link' });
    copy.on('click', () => copyText(link()).then(ok => { copy.title = ok ? 'Copied' : 'Copy failed'; setTimeout(() => { copy.title = 'Copy link'; }, 1400); }));
    pn.addButton({ title: 'Reset' }).on('click', () => { reset(); sync(); });

    let syncing = false;
    function sync() {
      syncing = true;
      Object.assign(P, { serif: S.serif, sw: S.sw, si: !!S.si, ss: S.ss, st: S.st, sans: S.sans, bw: S.bw, mono: S.mono, mw: S.mw, apply: S.apply });
      weightBinding(); ib.disabled = !byId(S.serif).italic;
      P.face = describe(byId(S.serif)); P.set = summary();
      pn.refresh(); syncing = false;
      /* local files report back after the load attempt; refresh the note then */
      const id = S.serif; load(id).then(() => { if (S.serif === id && P.face !== describe(byId(id))) { P.face = describe(byId(id)); pn.refresh(); } });
    }
    pn.on('change', ev => {
      if (syncing || ev.target === face || ev.target === sum) return;
      const patch = {};
      if (P.serif !== S.serif) patch.serif = P.serif; else { patch.sw = P.sw; patch.si = P.si ? 1 : 0; patch.ss = P.ss; patch.st = P.st; }
      patch.sans = P.sans; if (P.sans === S.sans) patch.bw = P.bw;
      patch.mono = P.mono; if (P.mono === S.mono) patch.mw = P.mw;
      if (showApply) patch.apply = P.apply;
      set(patch); sync();
    });
    const off = onChange(() => { if (!syncing) sync(); });
    const dispose = pn.dispose.bind(pn); pn.dispose = () => { off(); dispose(); if (holder) holder.remove(); };
    sync();
    return pn;
  }

  function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  const api = { FAMILIES, families, byId, get: () => Object.assign({}, S), set, reset, init, add, load, pane, link, stack, weight, summary, onChange, get inited() { return inited; } };
  root.FontLab = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
