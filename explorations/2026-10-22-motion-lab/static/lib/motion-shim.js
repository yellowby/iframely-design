/* Stand-in for Motion (motion.dev, formerly Motion One) when the CDN is unreachable, e.g. offline file://.
   Covers only the subset the product demos use: animate(el, keyframes, opts), animate(from, to, {onUpdate}),
   sequences, stagger(). Loaded after the CDN script; does nothing when Motion is present. */
(function () {
  if (window.Motion && window.Motion.animate) return;
  const px = v => (typeof v === 'number' ? v + 'px' : v);
  const TR = { x: v => 'translateX(' + px(v) + ')', y: v => 'translateY(' + px(v) + ')', scale: v => 'scale(' + v + ')', rotate: v => 'rotate(' + (typeof v === 'number' ? v + 'deg' : v) + ')' };
  const EASE = { easeOut: 'cubic-bezier(0,0,.58,1)', easeIn: 'cubic-bezier(.42,0,1,1)', easeInOut: 'cubic-bezier(.42,0,.58,1)', linear: 'linear' };
  const easing = e => (Array.isArray(e) ? 'cubic-bezier(' + e.join(',') + ')' : EASE[e] || 'cubic-bezier(.25,.1,.25,1)');
  const UNITLESS = /^(opacity|zIndex|flex|scale|lineHeight)$/;
  function frames(kf) {
    const keys = Object.keys(kf); const n = Math.max(1, ...keys.map(k => (Array.isArray(kf[k]) ? kf[k].length : 1)));
    const out = [];
    for (let i = 0; i < n; i++) {
      const f = {}, tr = [];
      for (const k of keys) { const arr = Array.isArray(kf[k]) ? kf[k] : [kf[k]]; const v = arr[Math.min(i, arr.length - 1)]; if (TR[k]) tr.push(TR[k](v)); else f[k] = typeof v === 'number' && !UNITLESS.test(k) ? v + 'px' : v; }
      if (tr.length) f.transform = tr.join(' ');
      out.push(f);
    }
    return out;
  }
  function one(el, kf, o, i) {
    const d = typeof o.delay === 'function' ? o.delay(i) : o.delay || 0;
    const a = el.animate(frames(kf), { duration: (o.duration == null ? .3 : o.duration) * 1000, delay: d * 1000, easing: easing(o.ease), fill: 'forwards', iterations: o.repeat === Infinity ? Infinity : (o.repeat || 0) + 1 });
    a.finished.then(() => { try { a.commitStyles(); a.cancel(); } catch (e) {} }).catch(() => {});
    return a;
  }
  function wrap(p, stop) { return { finished: p, then: (r, j) => p.then(r, j), stop, cancel: stop }; }
  function animate(target, kf, o) {
    o = o || {};
    if (typeof target === 'number') {
      const from = target, to = kf, dur = (o.duration == null ? .3 : o.duration) * 1000, t0 = performance.now(); let raf = 0;
      const p = new Promise(res => { const step = now => { const t = Math.min(1, (now - t0) / dur); const e = o.ease === 'linear' ? t : 1 - Math.pow(1 - t, 3); if (o.onUpdate) o.onUpdate(from + (to - from) * e); if (t < 1) raf = requestAnimationFrame(step); else res(); }; raf = requestAnimationFrame(step); });
      return wrap(p, () => cancelAnimationFrame(raf));
    }
    if (Array.isArray(target) && Array.isArray(target[0])) {
      let chain = Promise.resolve(); const subs = [];
      for (const [el, k, oo] of target) chain = chain.then(() => { const a = animate(el, k, oo); subs.push(a); return a.finished; });
      return wrap(chain, () => subs.forEach(a => a.stop()));
    }
    const els = typeof target === 'string' ? [...document.querySelectorAll(target)] : target instanceof Element ? [target] : [...target];
    const anims = els.map((el, i) => one(el, kf, o, i));
    return wrap(Promise.all(anims.map(a => a.finished.catch(() => {}))).then(() => {}), () => anims.forEach(a => a.cancel()));
  }
  const stagger = (step, opt) => i => ((opt && opt.startDelay) || 0) + i * (step == null ? .1 : step);
  window.Motion = { animate, stagger, __shim: true };
})();
