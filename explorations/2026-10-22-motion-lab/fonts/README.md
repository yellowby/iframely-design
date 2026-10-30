# Fonts for the motion lab

`local.js` declares self-hosted families for FontLab (`lib/fontlab.js`); every entry shows up in the Type panel.

- `fontshare/` — Erode, Sentient, Zodiak (variable, upright + italic) and Gambetta (static 300–700 + italics). Free under the ITF Free Font Licence; files downloaded from the Fontshare CDN on 2026-10-23.
- Licensed trials, copied 2026-10-23 from the foundry packages in `C:\web\publicly-design\fonts\` (the raw downloads stay there): `ABCArizonaFlare/` (Dinamo, 10 static OTF), `Reckless/` (Displaay, variable upright + italic, 1.1 MB), `TiemposHeadline/`, `TiemposFine/`, `Signifier/` (Klim test variables, 70 glyphs each), `PPEditorialNew/` (Pangram Pangram, 6 static OTF, free for personal use), `GTAlpina/`, `GTAlpinaFine/` (Grilli Type, Standard width, 10 static woff2 each). For design testing only; not published with the artifact, so the panel's Face note says FILES NOT FOUND there.
- Adding another licensed face: make a folder per family, drop the files in, and add an entry to `local.js` with `paid: true`. Static files list `weights: [...]` with one `files` row per weight and style; a variable file uses `range: [min, max]` and one row per style. Keep licensed files out of the published artifact unless the licence allows web embedding on claude.ai.

The same `local.js` exists in the website prototype (`src/lib/fontlab/local.js`, files under `static/fonts/`), with `dir` paths starting at `/fonts/`.
