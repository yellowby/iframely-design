/* bg-tape · punched paper tape, second pass. Six strips of neutral tape stock lie across the page at slight angles and
   creep along their own length; each column is the ASCII code of one character of a URL, punched as dark holes, with the
   sprocket row between bits 3 and 4. Hover a strip and the column under the pointer is read back: the character, its hex
   and its bits. Canvas 2D, one hole path per strip. */
(() => {
  const TEXT = 'https://youtube.com/watch?v=dQw4w9WgXcQ  https://notion.so/Team-wiki-Launch-plan  https://nytimes.com/2026/10/21/technology/web-glue.html  https://open.spotify.com/track/4uLU6hMC  https://github.com/iframely/iframely  https://figma.com/file/VmgHd0uy7JfP  ';
  const N = TEXT.length;
  const STRIPS = [{ y: .1, a: -.09, s: 15, d: 1 }, { y: .28, a: .06, s: 11, d: -1 }, { y: .46, a: -.04, s: 18, d: 1 }, { y: .63, a: .08, s: 13, d: -1 }, { y: .8, a: -.06, s: 16, d: 1 }, { y: .97, a: .05, s: 12, d: -1 }];
  DEMOS.register('bg-tape', {
    group: 'bg', title: 'Paper tape', overlay: '',
    blurb: 'Six strips of punched paper tape lie across the page at slight angles and creep along their own length. Each column is the ASCII code of one character of a URL, punched as dark holes with the sprocket row between bits 3 and 4, on neutral tape stock. Hover a strip and the column under the pointer is read back: the character, its hex code and its bits, in cobalt. Canvas 2D.',
    mount(host) {
      const { P } = DEMOS; const C = DEMOS.canvas2d(host); const ctx = C.ctx; const p = DEMOS.pointer(host);
      const bandH = 70, pitch = 11, rowP = 7;
      const L = DEMOS.loop(host, t => {
        const { w, h } = C.resize();
        ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
        let decode = null;
        STRIPS.forEach((S, b) => {
          const cx = w / 2, cy = S.y * h; const len = Math.hypot(w, h) + 200;
          const scroll = t * S.s * S.d; const shift = Math.floor(scroll / pitch); const sub = scroll - shift * pitch;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(S.a);
          ctx.fillStyle = 'rgba(28,27,24,.06)'; ctx.fillRect(-len / 2 + 2, -bandH / 2 + 4, len, bandH);
          ctx.fillStyle = b % 2 ? P.bg2 : '#f3f0e8'; ctx.fillRect(-len / 2, -bandH / 2, len, bandH);
          ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.strokeRect(-len / 2 + .5, -bandH / 2 + .5, len - 1, bandH - 1);
          const cols = Math.ceil(len / pitch) + 2; const x0 = -len / 2;
          let lx = 1e9, ly = 1e9; if (p.inside) { const dx = p.x - cx, dy = p.y - cy; lx = dx * Math.cos(-S.a) - dy * Math.sin(-S.a); ly = dx * Math.sin(-S.a) + dy * Math.cos(-S.a); }
          const hovered = Math.abs(ly) < bandH / 2 && !decode;
          ctx.fillStyle = 'rgba(28,27,24,.72)'; ctx.beginPath();
          for (let i = -1; i < cols; i++) {
            const x = x0 + i * pitch + sub + pitch / 2; const code = TEXT.charCodeAt((((i - shift) % N) + N) % N);
            for (let k = 0; k < 8; k++) if (code >> (7 - k) & 1) { const y = -bandH / 2 + 8 + k * rowP + (k >= 4 ? 6 : 0); ctx.moveTo(x + 2.4, y); ctx.arc(x, y, 2.4, 0, 6.2832); }
            const sy = -bandH / 2 + 8 + 3 * rowP + 6.5; ctx.moveTo(x + 1.1, sy); ctx.arc(x, sy, 1.1, 0, 6.2832);
            if (hovered && Math.abs(x - lx) <= pitch / 2) decode = { x, code, S, cx, cy };
          }
          ctx.fill();
          if (decode && decode.S === S) { ctx.fillStyle = 'rgba(31,63,224,.16)'; ctx.fillRect(decode.x - pitch / 2, -bandH / 2, pitch, bandH); ctx.strokeStyle = P.accent; ctx.strokeRect(decode.x - pitch / 2 + .5, -bandH / 2 + .5, pitch - 1, bandH - 1); }
          ctx.restore();
        });
        if (decode) {
          const { x, code, S, cx, cy } = decode; const wx = cx + x * Math.cos(S.a) - (-bandH / 2 - 6) * Math.sin(S.a), wy = cy + x * Math.sin(S.a) + (-bandH / 2 - 6) * Math.cos(S.a);
          const ch = String.fromCharCode(code); const label = (ch === ' ' ? 'space' : ch) + '   0x' + code.toString(16).padStart(2, '0') + '   ' + code.toString(2).padStart(8, '0');
          ctx.font = DEMOS.font('mono', 11); const tw = ctx.measureText(label).width + 16; let lx = wx + 12; if (lx + tw > w - 8) lx = wx - 12 - tw; const ly = Math.max(8, wy - 24);
          ctx.fillStyle = P.accent; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(lx, ly, tw, 20, 5); else ctx.rect(lx, ly, tw, 20); ctx.fill();
          ctx.fillStyle = P.bg; ctx.textBaseline = 'middle'; ctx.fillText(label, lx + 8, ly + 10);
        }
      });
      return () => { L.destroy(); p.destroy(); C.destroy(); };
    },
  });
})();
