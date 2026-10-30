// @ts-nocheck
/* Local font files for FontLab. Loaded before lib/fontlab.js; every entry becomes a family in the panel.
   - Free, self-hosted: the four Fontshare serifs from notes/references.md (ITF Free Font Licence, files from the Fontshare CDN, 2026-10-23).
   - Licensed trials (paid: true): copied on 2026-10-23 from the foundry packages the team downloaded into C:\web\publicly-design\fonts\
     (Dinamo, Displaay, Klim, Pangram Pangram, Grilli Type). For design testing only; not published with the artifact.
   Format: static files list weights: [...] with one files row per weight and style; a variable file uses range: [min, max] and one row per style.
   files[].format is the @font-face format() string (default woff2; 'opentype' for .otf). */
globalThis.FONTLAB_LOCAL = [
  { id: 'erode', name: 'Erode', role: 'serif', dir: 'fonts/fontshare/', range: [300, 700], italic: true, scale: 1.0, tracking: -0.01, lh: 1.05,
    note: 'Fontshare (ITF). Sturdy, contemporary.', files: [{ file: 'Erode-Variable.woff2', weight: [300, 700] }, { file: 'Erode-VariableItalic.woff2', weight: [300, 700], style: 'italic' }] },
  { id: 'sentient', name: 'Sentient', role: 'serif', dir: 'fonts/fontshare/', range: [200, 700], italic: true, scale: 1.02, tracking: -0.01, lh: 1.05,
    note: 'Fontshare (ITF). Soft, humanist, close to Reckless.', files: [{ file: 'Sentient-Variable.woff2', weight: [200, 700] }, { file: 'Sentient-VariableItalic.woff2', weight: [200, 700], style: 'italic' }] },
  { id: 'zodiak', name: 'Zodiak', role: 'serif', dir: 'fonts/fontshare/', range: [100, 900], italic: true, scale: 1.0, tracking: -0.015, lh: 1.04,
    note: 'Fontshare (ITF). Sharp, high contrast, close to Arizona.', files: [{ file: 'Zodiak-Variable.woff2', weight: [100, 900] }, { file: 'Zodiak-VariableItalic.woff2', weight: [100, 900], style: 'italic' }] },
  { id: 'gambetta', name: 'Gambetta', role: 'serif', dir: 'fonts/fontshare/', weights: [300, 400, 500, 600, 700], italic: true, scale: 1.0, tracking: -0.01, lh: 1.05,
    note: 'Fontshare (ITF). Static weights 300–700 with italics.',
    files: [
      { file: 'Gambetta-Light.woff2', weight: 300 }, { file: 'Gambetta-LightItalic.woff2', weight: 300, style: 'italic' },
      { file: 'Gambetta-Regular.woff2', weight: 400 }, { file: 'Gambetta-Italic.woff2', weight: 400, style: 'italic' },
      { file: 'Gambetta-Medium.woff2', weight: 500 }, { file: 'Gambetta-MediumItalic.woff2', weight: 500, style: 'italic' },
      { file: 'Gambetta-Semibold.woff2', weight: 600 }, { file: 'Gambetta-SemiboldItalic.woff2', weight: 600, style: 'italic' },
      { file: 'Gambetta-Bold.woff2', weight: 700 }, { file: 'Gambetta-BoldItalic.woff2', weight: 700, style: 'italic' },
    ] },

  /* Licensed trials */
  { id: 'arizona-flare', name: 'ABC Arizona Flare', role: 'serif', paid: true, dir: 'fonts/ABCArizonaFlare/', weights: [200, 300, 400, 500, 700], dw: 300, italic: true, scale: 1.0, tracking: -0.015, lh: 1.04,
    note: 'Dinamo trial (OTF). The face behind exa.ai and rulebase.co; Light and Regular carry the look. Mix, Sans, Serif, Text and the superfamily variable are in the download too.',
    files: [
      { file: 'ABCArizonaFlareTrial-Thin.otf', weight: 200, format: 'opentype' }, { file: 'ABCArizonaFlareTrial-ThinItalic.otf', weight: 200, style: 'italic', format: 'opentype' },
      { file: 'ABCArizonaFlareTrial-Light.otf', weight: 300, format: 'opentype' }, { file: 'ABCArizonaFlareTrial-LightItalic.otf', weight: 300, style: 'italic', format: 'opentype' },
      { file: 'ABCArizonaFlareTrial-Regular.otf', weight: 400, format: 'opentype' }, { file: 'ABCArizonaFlareTrial-RegularItalic.otf', weight: 400, style: 'italic', format: 'opentype' },
      { file: 'ABCArizonaFlareTrial-Medium.otf', weight: 500, format: 'opentype' }, { file: 'ABCArizonaFlareTrial-MediumItalic.otf', weight: 500, style: 'italic', format: 'opentype' },
      { file: 'ABCArizonaFlareTrial-Bold.otf', weight: 700, format: 'opentype' }, { file: 'ABCArizonaFlareTrial-BoldItalic.otf', weight: 700, style: 'italic', format: 'opentype' },
    ] },
  { id: 'reckless', name: 'Reckless', role: 'serif', paid: true, dir: 'fonts/Reckless/', range: [100, 900], italic: true, scale: 1.0, tracking: -0.015, lh: 1.04,
    note: 'Displaay trial, variable (tines.com). Width and contrast axes stay at their defaults: Standard width, XL optical size. The static S/M/XL cuts are in the download.',
    files: [{ file: 'RecklessCollectionVF-TRIAL.woff2', weight: [100, 900] }, { file: 'RecklessItalicCollectionVF-TRIAL.woff2', weight: [100, 900], style: 'italic' }] },
  { id: 'tiempos-headline', name: 'Tiempos Headline', role: 'serif', paid: true, dir: 'fonts/TiemposHeadline/', range: [300, 900], italic: true, scale: 1.0, tracking: -0.01, lh: 1.05,
    note: 'Klim test font, variable. Test fonts carry 70 glyphs (basic Latin letters and figures), so punctuation may fall back.',
    files: [{ file: 'test-tiempos-headline-vf-roman.woff2', weight: [300, 900] }, { file: 'test-tiempos-headline-vf-italic.woff2', weight: [300, 900], style: 'italic' }] },
  { id: 'tiempos-fine', name: 'Tiempos Fine', role: 'serif', paid: true, dir: 'fonts/TiemposFine/', range: [300, 900], italic: true, scale: 1.0, tracking: -0.01, lh: 1.05,
    note: 'Klim test font, variable. The high-contrast display cut of Tiempos. 70 glyphs in the test font.',
    files: [{ file: 'test-tiempos-fine-vf-roman.woff2', weight: [300, 900] }, { file: 'test-tiempos-fine-vf-italic.woff2', weight: [300, 900], style: 'italic' }] },
  { id: 'signifier', name: 'Signifier', role: 'serif', paid: true, dir: 'fonts/Signifier/', range: [100, 900], italic: true, scale: 0.98, tracking: -0.01, lh: 1.05,
    note: 'Klim test font, variable (steep.app display face). 70 glyphs in the test font.',
    files: [{ file: 'test-signifier-vf-roman.woff2', weight: [100, 900] }, { file: 'test-signifier-vf-italic.woff2', weight: [100, 900], style: 'italic' }] },
  { id: 'pp-editorial-new', name: 'PP Editorial New', role: 'serif', paid: true, dir: 'fonts/PPEditorialNew/', weights: [200, 400, 800], italic: true, scale: 1.0, tracking: -0.015, lh: 1.02,
    note: 'Pangram Pangram, free for personal use (EULA in the download). Close to Arizona; Ultralight 200, Regular 400, Ultrabold 800.',
    files: [
      { file: 'PPEditorialNew-Ultralight.otf', weight: 200, format: 'opentype' }, { file: 'PPEditorialNew-UltralightItalic.otf', weight: 200, style: 'italic', format: 'opentype' },
      { file: 'PPEditorialNew-Regular.otf', weight: 400, format: 'opentype' }, { file: 'PPEditorialNew-Italic.otf', weight: 400, style: 'italic', format: 'opentype' },
      { file: 'PPEditorialNew-Ultrabold.otf', weight: 800, format: 'opentype' }, { file: 'PPEditorialNew-UltraboldItalic.otf', weight: 800, style: 'italic', format: 'opentype' },
    ] },
  { id: 'gt-alpina', name: 'GT Alpina', role: 'serif', paid: true, dir: 'fonts/GTAlpina/', weights: [250, 300, 400, 500, 700], italic: true, scale: 1.0, tracking: -0.01, lh: 1.05,
    note: 'Grilli Type trial, Standard width. Condensed, Extended and Typewriter widths are in the download.',
    files: [
      { file: 'GT-Alpina-Standard-Thin-Trial.woff2', weight: 250 }, { file: 'GT-Alpina-Standard-Thin-Italic-Trial.woff2', weight: 250, style: 'italic' },
      { file: 'GT-Alpina-Standard-Light-Trial.woff2', weight: 300 }, { file: 'GT-Alpina-Standard-Light-Italic-Trial.woff2', weight: 300, style: 'italic' },
      { file: 'GT-Alpina-Standard-Regular-Trial.woff2', weight: 400 }, { file: 'GT-Alpina-Standard-Regular-Italic-Trial.woff2', weight: 400, style: 'italic' },
      { file: 'GT-Alpina-Standard-Medium-Trial.woff2', weight: 500 }, { file: 'GT-Alpina-Standard-Medium-Italic-Trial.woff2', weight: 500, style: 'italic' },
      { file: 'GT-Alpina-Standard-Bold-Trial.woff2', weight: 700 }, { file: 'GT-Alpina-Standard-Bold-Italic-Trial.woff2', weight: 700, style: 'italic' },
    ] },
  { id: 'gt-alpina-fine', name: 'GT Alpina Fine', role: 'serif', paid: true, dir: 'fonts/GTAlpinaFine/', weights: [250, 300, 400, 500, 700], italic: true, scale: 1.0, tracking: -0.01, lh: 1.05,
    note: 'Grilli Type trial. The high-contrast display cut of GT Alpina, Standard width.',
    files: [
      { file: 'GT-Alpina-Fine-Standard-Thin-Trial.woff2', weight: 250 }, { file: 'GT-Alpina-Fine-Standard-Thin-Italic-Trial.woff2', weight: 250, style: 'italic' },
      { file: 'GT-Alpina-Fine-Standard-Light-Trial.woff2', weight: 300 }, { file: 'GT-Alpina-Fine-Standard-Light-Italic-Trial.woff2', weight: 300, style: 'italic' },
      { file: 'GT-Alpina-Fine-Standard-Regular-Trial.woff2', weight: 400 }, { file: 'GT-Alpina-Fine-Standard-Regular-Italic-Trial.woff2', weight: 400, style: 'italic' },
      { file: 'GT-Alpina-Fine-Standard-Medium-Trial.woff2', weight: 500 }, { file: 'GT-Alpina-Fine-Standard-Medium-Italic-Trial.woff2', weight: 500, style: 'italic' },
      { file: 'GT-Alpina-Fine-Standard-Bold-Trial.woff2', weight: 700 }, { file: 'GT-Alpina-Fine-Standard-Bold-Italic-Trial.woff2', weight: 700, style: 'italic' },
    ] },
];
