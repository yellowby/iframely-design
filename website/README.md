# iframely.com prototype

The proposed public website as a SvelteKit prototype: structure, copy and links, with the Paper + cobalt colour tokens from the motion lab. Graphics are labelled placeholders, and every interactive result (/try, /domains, the URL debugger, the pricing calculator, the snippet generator) runs on sample data with no calls to Iframely.

Copied into `publicly-design` on 2026-10-22 from the marketing repo's copy demo, then stripped of its plan annotations (the amber notes bar, per-page plan status, decision ids and the /demo page map). The decision log stays in `C:\web\iframely-marketing\plans\website\README.md`.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in build/
```

SvelteKit 3, Svelte 5, Tailwind 4, adapter-static (every page is prerendered).

## Colour

`src/routes/layout.css` defines the tokens: paper `#f7f5f0` as the page (`ink-50`), warm ink `#1c1b18` for text (`ink-900`), cobalt `#1f3fe0` as the accent (`brand-600`) and `#1a35c4` for links (`brand-700`). `--color-white` is redefined as the card surface `#fffdf9`, so `bg-white` in the components sits on paper. Default sections are paper, muted sections one step darker (`ink-100`), dark sections ink. The six pastels (pink, lavender, sky, mint, sand, peach) are available as `bg-pink` and so on but not yet used. Source of truth: `../lab/static/lib/demos.css`.

## Type panel

Every page has a Tweakpane panel in the top-right corner (`src/lib/fontlab/FontPanel.svelte`, mounted in the root layout) to switch the heading serif, the base sans and the mono face, with weight, italic, size and tracking for headings and a "Serif on" switch (h1 / h1 + h2 / h1 to h3 / off; default h1 + h2). `fontlab.js` is the same file as the motion lab's `lib/fontlab.js` (the lab copy is canonical); `local.js` declares the self-hosted Fontshare serifs in `static/fonts/fontshare/`; `fontlab.css` applies the choice over the Tailwind utilities (`!important`, scoped by `data-fl-apply`; size uses `zoom`) and themes the pane. Choices persist in `localStorage` and can be shared as a URL (`/?serif=newsreader&sw=500&si=1&apply=h1-h3`; "Copy link" in the panel). Without the panel the site falls back to the CSS defaults: Inter, JetBrains Mono, and Instrument Serif as `--font-display`. Licensed trials (Arizona Flare, Reckless, Tiempos Headline and Fine, Signifier, PP Editorial New, GT Alpina and Fine) are in `static/fonts/<Family>/`, copied from the motion lab; to add another, drop the files there and add an entry to `local.js` with `paid: true`.

## Where things are

| Path | What |
|---|---|
| `src/lib/data/nav.ts` | header and footer navigation |
| `src/lib/data/providers.ts` | the provider data file behind /domains, sample records |
| `src/lib/data/samples.ts` | API samples; the `access` object is copied from the live docs, the endpoint URLs are illustrative |
| `src/lib/data/pricing.ts`, `compare.ts`, `updates.ts` | pricing, comparison and changelog data |
| `src/lib/components/` | shared blocks: Hero, Section, Cards, Code, Tabs, Table, Faq, Cta, Placeholder, PageMeta |
| `src/lib/fontlab/` | Type panel: FontLab core (copy of the lab's), local font registry, override CSS, Svelte mount |
| `src/routes/` | one folder per page |

Facts and numbers come from the plans and the research; where a fact was flagged as unverified (timeline dates, customer names, competitor prices), the page still says so in its copy.

## Next

Bring the motion lab in: the hero composition behind the home page hero, the chosen backgrounds, and the product scenes next to the product sections. The lab's helpers (`lib/demos.js`, `lib/dither.js`, `lib/blobs.js`) are framework-free and belong in `src/lib/motion/`.
