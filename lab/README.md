# Motion lab: shader backgrounds, hero compositions and product scenes

2026-10-22. Working demos for the motion questions raised after the graphic-treatment boards: backgrounds with shaders, animation and light pointer interaction; hero compositions on the chosen dither base; and paper.design-style product scenes to sit beside a heading and text block. Plain HTML and JavaScript, no build step, in the Paper + cobalt palette. Type defaults to Instrument Serif, Inter and Geist Mono (JetBrains Mono for terminal and block characters); the Type panel in the top-right corner switches the heading, base and mono faces (see "Type panel" below).

**Since 2026-11-06 the lab runs as a SvelteKit 3 app** (see "SvelteKit shell and picks" at the end): `npm install`, then `npm run dev` and open http://localhost:5192. The demo scripts, `lib/`, `fonts/` and the old `index.html` / `demo.html` now live in `static/`; paths below are relative to it.

Before that: open `index.html` directly (double-click; it works from `file://`) or serve the folder (`npx serve .`). The gallery has a sidebar with one page per group, so only the demos on the current page run: `#hero`, `#backgrounds`, `#scenes`, `#scenes-pastel`, `#logo`, `#wordmark`, `#dither`. A demo name in the hash (`index.html#hero-stack`) opens its page and scrolls to it. `demo.html#<name>` shows one demo full screen with prev/next links. Published copy: see the artifact link in the session recap.

## Layout

```
lib/demos.css      tokens, hero overlay, hero2 (text + slot), text + stage layout, shared mock parts
lib/demos.js       window.DEMOS: registry, pointer tracking, rAF loop that pauses off-screen, WebGL2 and Canvas 2D setup,
                   cancellable timeline, mount() with the three layouts (bg, hero, pd)
lib/dither.js      DEMOS.dither(): the B01 field as a reusable background with hooks (attractor, shape, window, pulse)
                   and an optional glyph mode that renders it through a character atlas (the B02 to B04 look)
lib/site.js        gallery shell: sidebar pages, hash routing, lazy mounting of the current page only
lib/motion-shim.js tiny stand-in for Motion when the CDN is unreachable (offline file://)
lib/fontlab.js     FontLab: font registry (Google Fonts, self-hosted Fontshare files, local files), loader, state as CSS variables, Tweakpane panel
fonts/local.js     self-hosted families (fonts/fontshare/*.woff2) and the slot for licensed files; see fonts/README.md
demos/hero-*.js    hero compositions: group:'hero', mount(host, slot, ctx) — host is the full-bleed background, slot the right half
demos/bg-*.js      backgrounds: group:'bg', mount(host)
demos/pd-*.js      product scenes: group:'pd', copy: { eyebrow, title, text, cta }, mount(stage)
demos/wordmark.js  wordmark techniques: group:'wm', mount(stage); static type studies with a font switcher per card
demos/dither-set.js dither set: group:'dt' (backgrounds) and 'dta' (accents), mount(stage); one shared WebGL2 context paints every canvas
demos/logo*.js     logo scenes: group:'logo', mount(stage) — stage is a plain white full-frame box (.lgs); logo.js exports DEMOS.logoKit
index.html         gallery (sidebar + pages)
demo.html          one demo full screen, chosen by the URL hash
```

Motion (motion.dev, formerly Motion One) is loaded from jsDelivr as a UMD global, `motion@12.23.12`, and used by the hero compositions and product scenes for sequencing, stagger, springs, numeric tweens and layout moves. The backgrounds use no library.

## Type panel (FontLab)

Fonts switch at runtime. `lib/fontlab.js` keeps a registry of families per role, loads a family when it is chosen (one stylesheet link for Google Fonts, generated `@font-face` rules for files in `fonts/`) and writes the choice as CSS variables on `<html>`: `--serif`, `--sans`, `--mono` (the lab's aliases) plus `--fl-serif-weight`, `--fl-serif-style`, `--fl-serif-scale`, `--fl-serif-tracking`, `--fl-serif-lh`, `--fl-sans-weight` and `--fl-mono-weight`, which `demos.css` reads on headings, body text, eyebrows, labels and the terminal blocks. Canvas demos ask `DEMOS.font('mono', 11)` for a font string instead of hardcoding one (marquee, grid, tape and network labels); the glyph atlases (ASCII, blocks, braille, H06, H07) stay on JetBrains Mono for its block glyphs.

The panel is Tweakpane 4 (ESM from jsDelivr), absolutely positioned in the top-right corner, with its folded state remembered. Controls:

- Headings: family (the free serif candidates), weight (a slider over the variable axis or the static instances, disabled for single-weight faces), italic, size × and tracking (each face brings its own defaults from the round-1 board), and a "Face" note with source and axes.
- Base: Inter or Geist, body weight.
- Mono: Geist Mono or JetBrains Mono, weight.
- "Set" shows the combination to quote back. "Copy link" copies the page URL with the set in the query (`?serif=fraunces&sw=600&si=1&ss=1&st=-0.02&sans=geist&bw=450&mono=jetbrains-mono&mw=500`). "Reset" returns to Instrument Serif / Inter / Geist Mono.

The choice persists in `localStorage` (`fontlab:v1`) across pages and reloads; a URL with query keys overrides it. Variable fonts are used wherever they exist.

| Role | Families | Source |
|---|---|---|
| Headings | Instrument Serif, Fraunces, Newsreader, EB Garamond, DM Serif Display, Cormorant Garamond, Hedvig Letters Serif, Young Serif, Source Serif 4, Literata, Crimson Pro, Playfair Display, Bodoni Moda, Lora | Google Fonts |
| Headings | Erode, Sentient, Zodiak (variable, with italics), Gambetta (static 300–700, with italics) | Fontshare files self-hosted in `fonts/fontshare/` (ITF Free Font Licence) |
| Headings, licensed trials | ABC Arizona Flare (static 200–700), Reckless (variable), Tiempos Headline, Tiempos Fine, Signifier (Klim test variables, 70 glyphs), PP Editorial New (static 200/400/800), GT Alpina, GT Alpina Fine (static 250–700) | Foundry trial packages in `C:\web\publicly-design\fonts\`, copied to `fonts/<Family>/`; not published |
| Base | Inter (variable, optical sizes, italics), Geist (variable) | Google Fonts |
| Mono | Geist Mono (variable), JetBrains Mono (variable, italics) | Google Fonts |

Licensed faces are added by dropping the files in `fonts/<Family>/` and adding an entry to `fonts/local.js` with `paid: true`; `fonts/README.md` has the format and the list of trials in place (Arizona Flare, Reckless, Tiempos Headline and Fine, Signifier, PP Editorial New, GT Alpina and Fine). Exposure (205TF) and Wulkan Text have no trial yet. The same `fontlab.js` and `local.js` live in the website prototype (`website/src/lib/fontlab/`), where the panel is a Svelte component on every page with one extra control, "Serif on" (h1 / h1 + h2 / h1 to h3 / off). The lab copy of `fontlab.js` is canonical; copy it over after changes.

## Decisions so far (team, 2026-10-22)

- B01 Dither gradient is the base for the home page hero: paper, pink and cobalt, Bayer 8×8, the pointer lamp. Keep it as is.
- B03 Block shade has the same appeal in terminal characters; H06 builds on it.
- Text + visualization blocks: text on the left, visualization on the right, at every width. The two columns hold down to a 480px container; between 480 and 760px the stage turns square and each scene has a compact variant. Only phones stack.
- Product scenes are good for a first iteration; no changes requested yet.

## Hero compositions (`group: hero`, page `#hero`)

Same B01 field behind text on the left; each adds one thing to the right half and drives the field through `DEMOS.dither`'s hooks.

| Demo | Right side | How the field reacts |
|---|---|---|
| `hero-stack` Four results stack | Rich Media, Preview, Data, Publisher Console cards fanned; front card cycles on a Motion spring, hover brings one forward, the stack parallaxes with the pointer | Ink pools behind the stack (`attrK` +0.6) |
| `hero-shape` Resolving into a card, then the mark | Nothing drawn; a mono caption names the phase | Every 12 s the ink gathers into a card with a play mark (SDF), dissolves, gathers into the chevrons, dissolves |
| `hero-paste` Live paste box | URL input, three sample chips, result card; type a URL and press Enter | A pulse ring from the box, ink pools behind the result |
| `hero-terminal` Terminal window | curl request types itself, the JSON answer prints line by line | A paper pocket clears behind the dark window (`attrK` −0.7) |
| `hero-window` Blueprint window | Selected browser window with handles, dimension pill, outlined play mark | The content area is a cut-out: full strength inside, a third outside |
| `hero-globe` B03 blocks + cropped ASCII globe | A sphere about 1.6× the viewport width with its centre off the bottom-right corner, so its upper-left quadrant fills the right half and turns once every 80 s; rendered inside the shader (shape mode 4) with the ASCII ramp: lit side sparse, continents dense, 20° graticule, bright rim. Three markers carry URLs on the surface: appear with a ping, hold, slide along a great-circle arc to another point, ping, fade, return with the next URL | Combined atlas (`field: [0, 5]`, `globe: [5, 10]`), `st.spin`; the field clears a thin halo around the rim |
| `hero-blocks-url` B03 blocks, URL on click | Click anywhere: a random URL from a pool of seven forms out of the blocks on the shader's 9 × 16 grid, then title, site/type and the Iframely result line form beneath; crumbles back after a few seconds; runs by itself until the first click | Glyph mode (block ramp) plus an attractor that fills the text area with █ before the letters flip |

## Backgrounds (`group: bg`, page `#backgrounds`)

Each renders under the hero copy at full bleed, runs only while on screen (IntersectionObserver and the Page Visibility API), caps the device pixel ratio, and draws one still frame under `prefers-reduced-motion`.

| Demo | Technique | Interaction |
|---|---|---|
| `bg-dither` Dither gradient | WebGL2: value-noise fbm quantised with an 8×8 Bayer matrix into paper, pink and cobalt | The pointer is a light: clears the ink under it, pink halo around it |
| `bg-ascii` ASCII dither | WebGL2: the B01 field quantised into a ten-glyph ramp (space to @) from a Geist Mono atlas sampled per 8 × 14 cell | Same lamp; ink turns cobalt where dense |
| `bg-blocks` Block shade | Same shader, ramp ░ ▒ ▓ █ in a 9 × 16 cell, pink layer plus cobalt layer like B01 | Same lamp |
| `bg-braille` Braille field | Same shader, braille ramp (one to eight dots), cobalt dots turning to ink | Same lamp |
| `bg-halftone` Halftone field | WebGL2: 14px dot grid, radius from a drifting noise field | Dots swell and turn to ink near the pointer |
| `bg-blobs` Pastel blobs | WebGL2: six metaballs on Lissajous paths, paper grain | One blob is tethered to the pointer and grows while hovering |
| `bg-ripple` Signal rings | WebGL2: up to eight ring sets with age-based fade over a faint 24px grid | Moving or pressing spawns rings; idle, the field pings on its own |
| `bg-marquee` Marquee decay | Canvas 2D: the type-as-texture hero; rows scroll, decay into noise and inverted blocks across the ink-to-paper edge | The pointer is a reading lamp: real words recover around it |
| `bg-teeth` Wave teeth | Canvas 2D: three rows of S-ramps sliding in opposite directions | Teeth near the pointer bulge and warm toward sand |
| `bg-grid` Blueprint crosshair | Canvas 2D: 24px grid, major lines, numbered rulers, registration marks | Crosshair and coordinate pill stick to the pointer; a square snaps to the nearest intersection and leaves a fading trail |
| `bg-contours` Contour map | WebGL2: contour lines of a drifting height field (`fwidth` for constant width), minor in ink, every fourth cobalt, uplands pink | The pointer raises a hill; lines bunch and ring around it |
| `bg-hatch` Engraving hatch | WebGL2: four hatch directions stack as a density field darkens; densest patches cobalt | The pointer lamp opens the hatching around it |
| `bg-moire` Moiré screens | WebGL2: two 8px dot screens, ink and cobalt, rotated and scaled against each other | Pointer x turns the cobalt screen, y scales it |
| `bg-tape` Paper tape | Canvas 2D: six strips of neutral tape stock at slight angles, creeping along their length; each column the ASCII code of a URL character punched as dark holes, sprocket row. Second pass: the first had pastel full-width bands (colours and shape rejected, hover kept) | Hover a strip to decode the column under the pointer (char, hex, bits) |
| `bg-network` Node network · packets | Canvas 2D: 84 passive grey and rose nodes linked within reach; cobalt packets travel the edges, light nodes on arrival and hop on | The pointer gathers nodes, links to them, and the nearest node sends more |
| `bg-network-orbit` Node network · constellations | Same file: 72 nodes orbit five drifting centres, breathing; dashed cobalt handshakes between clusters | The nearest constellation leans toward the pointer |
| `bg-network-flow` Node network · current | Same file: nodes carried by a noise current with trails, random cobalt sparkles with rings | The pointer is a vortex that swirls nearby nodes |
| `bg-filings` Iron filings | Canvas 2D: ~5,000 short strokes aligned to a turning noise field | The pointer is a magnet; strokes ring it and turn cobalt |
| `bg-river` Card river | Canvas 2D: 36 preview cards (image, player, reader) drifting at three depths | Cards near the pointer slow, lift and take a cobalt edge |
| `bg-ridges` Ridgelines | Canvas 2D: 30 stacked lines lifted by noise into a profile, back-to-front occlusion, every fifth cobalt | The pointer raises a peak |

Dropped on 2026-10-22 at the team's request after review: Riso plates (multiplied pastel discs), Woven web (shaded threads), Domain cells (Voronoi). Files deleted; the ideas are recorded here only.

## Product scenes (`group: pd`, page `#scenes`)

Each is built from real DOM (the same mock parts the Figma tiles use), sits in a text + stage grid, pauses while hovered, and shows its end state under reduced motion.

Colour (team, 2026-10-22): the page stays on paper and the original scenes stay as they are. The B06 pastel blobs come in as a second set, page `#scenes-pastel`: `demos/pd-pastel.js` registers a copy of each scene (group `pdp`) with `pastel: ['pink', 'sky', …]`, and `mount()` puts `DEMOS.blobs` (`lib/blobs.js`, the B06 shader at DPR 1 with the pointer-tethered blob) behind the stage as a rounded colour panel, with the scene 18px inside it and the eyebrow rendered as a chip in the first pastel. Rich Media leans pink, Preview sky, Data mint, Publisher sand; the one-URL scene uses all six.

| Demo | What it shows | Motion use |
|---|---|---|
| `pd-one-url` One URL, four results | URL types itself, the bar reports the round trip, the four product cards fan in; three URLs cycle; cards lift on hover | `animate` with `stagger` in and out |
| `pd-camera` Camera over the product | The paper.design approach: a 1400 × 900 scene (doc with a pasted link, request in a terminal, rendered embed) and a camera animating x, y, scale with Paper's 1000 ms cubic-bezier(.4, 0, 0, 1); a named cursor leads | `animate` on the scene and cursor, line stagger |
| `pd-lifecycle` Request lifecycle | The C4 blueprint with a pulse along URL → fetch → parse → sign → embed, timings counting up, annotations, result chips; hover a step to pin its note | `animate` on the pulse, numeric tweens with `onUpdate`, chip stagger |
| `pd-publisher` Publisher rules | Four rule toggles and the embed they govern plus live rule JSON; auto-flips a rule until you click | `animate` for the JSON line flash; CSS transitions for states |
| `pd-extract` Field extraction | A scanline sweeps a page wireframe; fields light up and fly into the JSON panel | `animate` on the scan progress and the flying ghosts |
| `pd-formats` The same URL, three shapes | Link row, card and rich player made of the same five elements; FLIP-style moves between tabs | `animate` on left/top/width/height/opacity |
| `pd-terminal` Check a URL from the terminal | `npx iframely check` typed live with ticks, a cross, a spinner and a progress bar | none; timers only |

## Logo in motion (`group: logo`, page `#logo`, 2026-10-27)

The final mark from Figma "Logo 2" → frame "final" (`124:9702`): `//iframely` in JetBrains Mono, "//" ExtraBold #0055ff, "iframely" Bold black. The idea in every scene: the two slashes are the slashes of a URL. L01–L07 live in `demos/logo.js`, L08–L14 in `demos/logo2.js`, L15–L20 in `demos/logo3.js`, L21 in `demos/logo4.js`, L22–L23 in `demos/logo5.js`, L24–L27 in `demos/logo6.js`, L28–L29 in `demos/logo7.js`, L30–L33 in `demos/logo8.js`, L34–L35 in `demos/logo9.js`, L36–L37 in `demos/logo10.js`, L38–L39 in `demos/logo11.js` (the cell engine, `K.cellsHero`), L40–L45 in `demos/logo12.js` (its variants), L46–L49 in `demos/logo13.js`, L50–L51 in `demos/logo14.js`, L52–L53 in `demos/logo15.js` (all reuse `DEMOS.logoKit` from the first file); plain DOM, CSS transitions, a small rAF tween, one Canvas 2D field; JetBrains Mono now loads as the variable font (100–800, italics) so weights can animate.

| Demo | What it shows |
|---|---|
| `logo-address` L01 Address bar | `https://iframely.com/<path>` types into a bar; scheme, TLD and path fold away, slashes turn blue, weights rise 400 → 700/800, the bar lets go; reverses, next path |
| `logo-reel` L02 Slash reel | Slot-machine reel of links aligned on their `//` (one blue column); spins and lands on `//iframely` |
| `logo-scheme` L03 Scheme swap | The mark stays put; schemes type in before it, paths after (`https:`, `/try`, `http:` + `/oembed`); bare `//iframely` is a protocol-relative URL |
| `logo-header` L04 Header path | Header idea: hovering a nav item extends the logo to that path (`//iframely/preview-api`, every "/" blue); hovering the logo leans the slashes; ghost cursor until you hover |
| `logo-windows` L05 Slash windows | The `//` as two slanted blue windows with embeds (player, map, audio, card, quote) scrolling through in opposite directions, next to the word |
| `logo-spinner` L06 Loading | The slashes turn half a turn each while a URL resolves, then settle; same beat as an ASCII spinner in a terminal, on a favicon tile and a tab |
| `logo-code` L07 Code | `//` as URL and as comment: a snippet types with every `//` in logo blue, the slashes ping in order, the last line becomes the mark |
| `logo-unfurl` L08 Unfurl | A link in a chat message; its `//` light up, a preview card unfolds, and the slashes fly out of the URL into the card corner as the "//iframely" credit |
| `logo-wipe` L09 Slash wipe | Page transition: two blue slashes sweep across at the logo angle and reveal the next page (path shown in the logo style) |
| `logo-field` L10 Slash field | Canvas texture of short `//` strokes at the logo angle; a slow wave turns them, the pointer turns nearby ones toward it and blue; logo in a clear pocket |
| `logo-flap` L11 Split-flap | Departures board: the blue `//` never flip, the word rolls through the alphabet to //embeds, //previews, //data, //rules, //iframely |
| `logo-decode` L12 Decode | Noise resolves into URLs around a fixed `//` column; every fourth pass it resolves into //iframely |
| `logo-intro` L13 Intro stings | Three entrances side by side: skid (slashes slide in skewed, word types), drop (letters spring in, slashes tip over last), draw (SVG strokes, word rises from a mask) |
| `logo-eyes` L14 Watching slashes | The slashes lean (±16°) toward the pointer or a wandering dot and blink on click; 404 / empty-state idea |
| `logo-header2` L15 Header v2 | L03 + L04: the path follows the section in view (scroll-spy) and types itself; hovering the logo types `https:` … `.com` around it; the header condenses past the hero |
| `logo-term-batch` L16 Terminal batch | Eight links resolve in parallel, each with a two-slash spinner; resolved rows settle into a blue `[//]`, a failed one into `[--]`; the progress bar is drawn with slashes |
| `logo-loaders` L17 Loader kit | The mark spinner (pure CSS half turns) in a button, a URL field, a card skeleton, a slash-striped progress bar, a typing indicator and a favicon tab |
| `logo-hero-reel` L18 Hero: reel + decode | L02 + L12 in a hero, text left: noise rows aligned on `//` spin, the band row decodes into a URL and a chip says what Iframely made of it |
| `logo-unfurl-apps` L19 One link, three apps | L08 as a Preview API scene, text left: the same unfurl in a chat, a doc and a CMS, with the slashes flying into the credit |
| `logo-field-cta` L20 Field CTA | L10 as a white CTA block: a URL types in, Check sends a ring out that flips the marks; click anywhere for a ring |
| `logo-hero-relay` L21 Hero: URLs in, results out | Adapts the usehallmark.com "cobalt" hero: raw URLs stream in from the left with an ASCII density trail, squeeze through a gate drawn as two slanted slashes, and leave on the right as results (player, fulltext.md, og:audio, meta, og:image, map, entities); a members-only URL stops on a publisher rule |
| `logo-hero-prism` L22 Hero: through the // | Own take on L21, text left and visual right: a URL queue on the left feeds a packet into a // drawn as two blue parallelograms, which splits into five beams to result cards (embed, preview, meta, fulltext, access); a members-only URL gets short dashed beams |
| `logo-hero-page` L23 Hero: the page, scanned | Same layout without the slashes: the URL opens as a mini page, a scan line sweeps it and each region (meta, embed, preview, fulltext, access) lights up and sends a beam to its card; a blocked URL shows a lock |
| `logo-hero-annotate` L24 Hero: page read and annotated | L23 with a real-looking page (five sites in turn); a scan line reads it and each part gets a thin callout with what Iframely takes from it, in the product-illustration style |
| `logo-hero-lens` L25 Hero: view-source lens | A lens moves over the page showing the markup under it (canonical, og:video, og:title, article, robots); each stop is typed into the JSON response on the right |
| `logo-hero-layers` L26 Hero: page in layers | The page tilts to an isometric view and comes apart into five page-shaped layers (exploded diagram), each joined to a flat label; folds back, next site |
| `logo-hero-deck` L27 Hero: five pages, one card | A deck of very different pages (video, newspaper, music, map, code); the front one is read and comes out as the same card and the same keys every time |
| `logo-hero-glyphs` L28 Hero: text in, text out | Canvas character field: symbols drift in the background, three URLs decode out of the noise in random places, their characters fly into a vector //, the // turns half a turn, results decode out on the right as key/value lines, then everything dissolves |
| `logo-hero-ascii` L29 Hero: all on the grid | L28 where everything is a cell: the // is drawn in characters and scrambles while it turns, characters hop along the grid, denser L21-like noise |
| `logo-hero-response` L30 Hero: one request, real response | L28 without the big //: a URL decodes at a random place with L06's terminal [//] in front; it spins (/ - \ |) while the request runs, settles with status and time, and the real Iframely response (fetched 2026-10-27; long values cut, API key left out) types out fast, fulltext included. YouTube, Wikipedia, SoundCloud, a dead Spotify link (real 404), GitHub |
| `logo-hero-requests` L31 Hero: live stream of requests | Several requests at once in free places of the field, compact responses, each fades on its own |
| `logo-hero-response5` L32 Hero: JSON5 in greys | L30 with the response as JSON5 (bare keys, single quotes, trailing commas, fulltext continued with \) in greys only; bare // spinner, then ✓ (or ✕ on the 404) with status and time |
| `logo-hero-requests5` L33 Hero: live requests, JSON5 | L31 the same way |
| `logo-hero-matrix` L34 Hero: one request, rained in | L32 after The Matrix: black panel, green katakana rain; a drop down each column locks the request and then the JSON5 response in, ragged; white // spinner, green ✓ / red ✕; when done each column lets go and the text falls back into rain |
| `logo-hero-matrix-stream` L35 Hero: live requests in the rain | L33 the same way, several at once |
| `logo-hero-matrix-light` L36 Hero: rained in, greys on white | L34 in the L32 style: white, greys only, ASCII rain across the whole hero background (clearing around the text column); requests land in the visual half |
| `logo-hero-matrix-light-stream` L37 Hero: live requests in grey rain | L35 the same way |
| `logo-hero-cells` L38 Hero: one request in a living grid | L36 with a cellular automaton instead of rain: Game of Life (B3/S23) on the character grid across the hero, grey decay trail, random soups keep it going; requests grow out radially from the //, pushing cells back; when done the text is handed to the automaton character by character and breaks up under the rules |
| `logo-hero-cells-stream` L39 Hero: live requests in a living grid | L37 the same way |
| `logo-hero-cells-dots` L40 Hero: a living grid of dots | L38 on a fine square grid drawn as round dots, so Life shapes aren't stretched by the text rows |
| `logo-hero-sparks-stream` L41 Hero: requests among sparks | Brian's Brain (B2/S/3), restless sparks; organic (uneven) growth and release from a few points; stream |
| `logo-hero-ripples` L42 Hero: ripples | excitable medium on the fine grid (fires on 2+ firing neighbours, long rest): rings from random drops and from released text, cancel where they meet; threshold 2 keeps broken ends from turning into spirals |
| `logo-hero-islands-stream` L43 Hero: requests between islands | Day & Night (B3678/S34678) on the fine grid, shorelines only; requests cut holes, released text joins the shore; stream |
| `logo-hero-starwars` L44 Hero: one request in a crawling grid | Star Wars (B2/S345/4) on the character grid, organic growth |
| `logo-hero-ripples-type-stream` L45 Hero: ripples in type | L42 on the character grid with # + : . rings; each released response sends out its own wave; stream |
| `logo-hero-marks-ripples` L46 Hero: ripples of slashes | new text style (blue URL, // → ✓/✕ with no status after the URL, response indented 3 to line up with the URL); faint rings drawn as > < / \ - by the way they move |
| `logo-hero-marks-sparks-stream` L47 Hero: requests among slash sparks | same text style; Brian's Brain tracers on the character grid; stream |
| `logo-hero-marks-gliders` L48 Hero: gliders crossing | same text style; Life with only gliders crossing as faint / \ arrows; still ash (tiny //) erodes away |
| `logo-hero-marks-contours-stream` L49 Hero: requests between contour lines | same text style; Anneal islands traced as - / | \ contour lines; stream |
| `logo-hero-cards-stream` L50 Hero: requests with preview cards | after L47: status back after the URL in grey (200 · 212 ms; // still → ✓), good responses only, and a preview card next to each response with the site's real favicon (inlined data URIs): player for the video, waveform for the track, summary cards for the article and repo; cards grow in and dissolve with the text |
| `logo-hero-cards` L51 Hero: one request with its preview card | the same, one request at a time with the longer response |
| `logo-hero-calls` L52 Hero: curl calls, three kinds of result | after L51: each request is a curl call at a > prompt that follows the Iframely docs; rich media (iframe=1, omit_script / playerjs) → data + player, meta (card=small, media=0) → data + summary card, Data API (mode=assist / ai-input, use, include) → data + the Markdown rendered as a document; the prompt spins and becomes ● when done; long queries continue on the next line |
| `logo-hero-cli` L53 Hero: an iframely CLI, three kinds of result | the same six calls as an iframely CLI (embed … --iframe --omit-script, data … --mode assist --use reference); the prompt settles into the // mark |

All scenes pause while out of view or in a hidden tab: `DEMOS.loop` already did; `mount()` now marks an off-screen demo root `.off`, which holds `timeline` sleeps/waits, `tween`, the logo spinners, the few `setInterval`s and CSS animations.

Team picks so far (★ in the gallery): L28, L02, L03 and L04 (header), L06 terminal + mark, L08 (product scene), L12, L18, L19, L20; L10 maybe.

## Product illustrations (`group: ill`, page `#illustrations`, 2026-10-27)

Small static SVG illustrations for the prototype product pages, after a line-diagram reference board (mono labels, thin black lines, dots and trees, Venn tints, one accent) with Iframely blue #0055ff as the accent. `demos/ill.js` holds the SVG strings (`DEMOS.illArt`, viewBox 360 × 240, JetBrains Mono) and one demo per page with that page's feature titles and copy: Rich Media (hosted iframes, content IDs, evergreen refresh, click-to-play, consent gates, predicted heights), Preview API (metadata, summary cards, Rich Media on/off, one request shape, chat, AI agents), Data API (five modes, meta, entities, excerpt, fulltext, access), Publishers (files, four tags and one image, purpose, console). Each card has a "copy svg" button for pasting into a Svelte component. Colour themes: a Mono / Pastel / Solid switch above each set (applies to every set, remembered in localStorage `ill-theme`, default Pastel). Mono is the line drawing on white; Pastel puts each card on a rounded light tile (lilac, mint, peach, sky, butter, pink) with a deeper accent of the same hue; Solid uses saturated tiles (cobalt with lime, ink, tangerine, lime, violet, teal) with white or black lines to suit. Copy svg copies the current theme.

More styles in `demos/ill2.js` (I05–I11), the same four features (Hosted iframes, Summary cards, Five processing modes, Every request declares a purpose) at 480 × 320, after reference images: Windows (Paper: grid paper, mono windows with offset shadows, ASCII art), Isometric desks (Palantir Foundry: hatched slabs, frontal monitors, dotted wires into pills), Orbits (Weave), Soft UI (a product card on a lilac stage), Outline bricks. After feedback ("I06 like the style, don't repeat the slab and pills"; "I09 good style but all the same"): Isometric desks 2 (one scene per card with a Palantir-style side strip: iframe dropping into its slot, one URL to app/CMS/chat, a server wired to five mode tags, bots meeting a publisher wall) and Outline bricks 2 (a brick-built screen, floating bricks over shadows, one brick split into five, a rocket with a // porthole).

`demos/ill3.js` (I12–I13, after feedback "I05: use brand blue as the accent" and "I01: not bad, needs more consistency and variations"): **Windows in blue** (I05 with #0055ff as the one accent: blue title bar and solid blue offset shadow on the active window, pale blue shadows on the rest, ASCII pictures in three blue tones, a blue primary button; paper and outlines stay neutral) and **Rich Media · one system, three takes** (the I01 line style on fixed rules: 360 × 240, 2 px lines, shared parts (frame, screen with play mark, node, tag, grey bars, blue measure), a caption on one baseline, one accent per drawing; each of the six Rich Media features drawn as Diagram, Interface and Mark; themes Mono / Tint / Ink / Blue, all brand blue, remembered in `ill3-theme`; `DEMOS.ill3Art(key, take, theme)`).

`demos/ill4.js` (I14, after "I13 tinted is not bad, add 2-3 accent colours"): **Rich Media · one system, more accents**, the I13 Tint take with extra colours that each keep one job in every drawing: blue = Iframely (our iframe, the ID, the //, the chosen option), source = the third party (provider code, original URL, cover, old version), signal = time, gates and measures, and in the three-accent palette media = play marks. Palettes Coral + Mint, Violet + Amber, Pink + Lime, Coral + Mint + Amber (localStorage `ill4-pal`), legend in the bar; `DEMOS.ill4Art(key, take, palette)`.

`demos/ill5.js` (I15, the user meant a different primary colour for the whole image, not extra accents): **Rich Media · one system, other hues**, the I13 Tint drawings unchanged (rendered through `DEMOS.ill3Art`, which now also takes a `{ id, tile, c }` theme object) with tile, lines, accent and tints all taken from one other hue: Violet, Green, Coral, Amber, Pink, Sky, plus Blue (= I13 Tint) for comparison. Mixed (default) gives each feature row its own hue; localStorage `ill5-hue`.

## Product visualisations (`demos/prod.js`, 2026-10-28)

P08 `prod-hub` (group `pdw`, shown last on the Product scenes page at full width), after a reference with an app icon wired by dashed lines to four app windows: the // hub sends a packet down one wire every few seconds and that window updates. Rich Media cycles a hosted player (YouTube video, SoundCloud waveform, map) with its iframe code; Preview API is a chat link that unfurls into a card (three samples); Data API is a terminal typing `iframely data <url> --mode=fulltext --use=read` with the URL in blue and the response in greys, indented to the command; Publisher Console shows requests by agent and two path policies. Below: copy on the left, three rows of capability pills drifting on the right (hover pauses). Wires are measured from the layout (ResizeObserver) and hidden below 980 px, where the windows go 2-up. Static under reduced motion; holds off screen.

## Porting to the SvelteKit site

- A background is a `<canvas>` plus the `mount(host)` body in `onMount`, returning the unmount function from the effect. `DEMOS.shader`, `pointer`, `loop` and `DEMOS.dither` are about 250 lines and framework-free; copy them into `src/lib/motion/`.
- The hero is `DEMOS.dither` on a full-bleed canvas behind a two-column grid; the right column is whichever composition is chosen. The hooks (`st.attr`, `st.shape`, `st.rect`, `pulse()`) are the whole API.
- Product scenes are DOM-building functions; in Svelte, write the markup in the component and keep only the timeline and the `Motion.animate` calls. Install `motion` from npm instead of the CDN (`import { animate, stagger } from 'motion'`).
- Keep the rules the lab follows: start only when visible, stop on hidden tabs, DPR cap at 1.5 for shaders (2 for glyph modes), still frame under reduced motion, hover pauses loops, first frame meaningful without JavaScript (the hero copy is DOM, not canvas).

## Notes and gotchas

- Classic scripts, not ES modules, so `file://` works (Chrome blocks module scripts from `file://`). The one exception is the Type panel, which imports Tweakpane 4 (ESM only) from jsDelivr in a `type=module` script: cross-origin module imports work from `file://`, local ones do not.
- Google Fonts and jsDelivr (Motion, Tweakpane) need a network; without one the Google faces fall back (the Fontshare serifs in `fonts/` still load), the Type panel is skipped, and `motion-shim.js` provides `animate`/`stagger` on the Web Animations API.
- Motion sets `transform` itself when animating `x`, `y`, `scale`, `rotate`: never also set `transform` on the same element in CSS (the camera scene uses `transform-origin` only; the stack parallax is applied to the slot, not to the Motion-animated cards).
- Never reuse a layout class name as a group class (the gallery once gave frames the class `pd`, which is also the two-column layout, and the scenes stacked).
- Geist Mono has no box-drawing or block glyphs; the terminal, the block shade and the braille field use JetBrains Mono.
- In glyph mode the shader cell is `cw × ch` CSS px times the DPR as a float, so DOM text in the same font and size aligns to it (H06 relies on this: rows are counted from the bottom edge, like `gl_FragCoord`).
- Canvas text: `ctx.letterSpacing` (Chrome 99+) keeps whole-row and per-glyph drawing on the same column grid in the marquee.

## Section picks (`demos/sec.js`, 2026-10-29)

Page `#picks`, group `sec`, S01–S10: one scene per site slot, each set in a mock of its section with the current copy from `iframely-marketing/demos/website` (home page for the hero and the side slots, each product page's hero for the large slots). Geist, headings 32 / 120% / −2%, product badges from the Figma "Explorations · product badges" palette (Rich Media #0055ff, Preview API #6a3bff, Data API #007a45, Publisher Console #1c2333).

- S01 hero, large: P08 cut to a ~420 px band (`DEMOS.prodKit(slot, { compact: true, bare: true })`).
- S02 hero, side: new, L53's idea in this style: one terminal window, embed / preview / data calls in turn, each result shown as the product renders it.
- S03 Rich Media, large: new. A link pasted in an editor reserves its height, then the hosted embed fades in (video, audio, post, map); response rail; provider marquee. The stage is `richStage(slot)`; `DEMOS.secKit.richBand(host)` mounts it without the section mock (root `.demo.sx.sx-embed`, `.off` out of view) for the website prototype's /embeds block. richBand is now its own scene (`embedStage`): a post written as you watch (each line typed, then a link that turns into its hosted embed; written from the top, the window following the newest line once the post is longer than it), and an Embed options window with the URL's real options from the API (YouTube Start from typed as 1m10s; the film's page has none; SoundCloud's visual player switched to the slimmer horizontal one), the code line following. URLs are Blender Studio's Sprite Fright (2021) on YouTube, the film's studio.blender.org page and Forss' Flickermood on SoundCloud, none of them used by S41. Iframely-blue block, square corners. S03 itself is unchanged. `DEMOS.secKit.sceneBand(host, { prod })` mounts S05, S07 or S09 the same way for the prototype's /preview-api, /data-api and /console blocks: the lab scene as it is without its section copy, the stage in the product's colour, square corners (S09's window without a stage, on the page itself). For /preview-api it mounts `previewStage`, S05 reworked the same way: one card on the page, the chat and doc keeping their app title bars, Iframely's part a 340px grey sidebar (preview.requested as the link is posted, then the unfurl, then preview.sources and preview.result decoding in), a fixed 480px height; real links (Wikipedia and Tate on the Bauhaus, rsms/inter on GitHub) with their covers and favicons as Iframely returns them, and the sources each page's HTML really has; the chat and the doc go on from link to link (a new message, a new line and card), following the newest entry, nothing replaced. For /data-api it mounts `dataStage`, S07 reworked: one window without a title bar, the terminal and a 340px access sidebar on #fafafa, after a reference card (white, light rule and shadow); a fixed 480px height; the prompt runs the // spinner while the request runs (about a second); access.requested (mode, use, agent) appears as the request is sent; the response leads, and only then do signals and decision decode in out of terminal glyphs, as secondary detail; three made-up example.com requests (discover/reference with a CC BY licence, ai-input/immediate blocked by Content Signals and the Console, search/reference limited to metadata and entities). The provider marquee (2026-10-30) shows each provider's icon, inlined from iframely.com/domains and the live site's repo; Bluesky, CodePen, Typeform, Apple Podcasts and Prezi had no icon there and became Reddit, Airtable, Notion, Apple Music and Google Drive. Since 2026-10-30 the site scene is one card on the page in the /data-api manner: no blue block, the editor keeps its title bar, the Embed options window is a 340px grey sidebar (its content as before: the options, then the one changed, and the iframe code; its foot notes the size reserved before load, e.g. "16:9 · height reserved"); the embed lands at once in the post, with no placeholder, and the post scrolls smoothly to it; a fixed 560px height and the provider marquee below the card, outside it.
- S05 Preview API, large: new. What the page offers (oEmbed, OG, Twitter Cards, JSON-LD, HTML) → the same link unfurls in a chat and a doc.
- S07 Data API, large: new. A declared command; the access object (requested, signals, decision) fills in; a CC BY-SA article (full text promoted) and a news page (full text blocked by Content Signals and a Console rule).
- S09 Publisher Console, large: new. Requests by agent, a live feed by customer app and path, a path policy that flips and changes what the next requests get.
- S04/S06/S08/S10 product, side: the P08 window for that product alone under the hub (`DEMOS.prodKit(slot, { only: i, bare: true })`).

`lib/demos.js`: `DEMOS.HERO` now carries the home page hero copy; a def with `alias` mounts another demo as it is (not used at the moment).

S11 `sec-connect-cards` and S12 `sec-connect-sides` (2026-10-29): the home page section "Connecting developers and publishers, one URL at a time" with the hub as its visual, so the hero can take S02 and the hub is shown once. Both send one URL at a time through all four windows (Wikipedia → summary card / full text under CC BY-SA, SoundCloud → audio / excerpt by Console rule, YouTube → video / metadata), and use each product's badge colour on its tag, link, wire and packet; the hub stays blue. S11: the windows are the tops of the four product cards (site copy under each). S12: developers' apps (made-up Acme Docs, Chatly, Briefly) on the left, Iframely in the middle, the publisher's Console on the right; requests go in, the Console logs each app and what it got, results come back.

S13–S17 (2026-10-29), iterations on S11 without the hub, the wires and the "one URL at a time" label, with no window dots. S13 `sec-connect-cards2`: the URL as a right-aligned command (> while running, // when done, 200 · ms in grey), cards update left to right, ringed in their colour. Own takes: S14 `sec-connect-verbs` each window's title bar is its own command for the same URL (embed / preview / data / console); S15 `sec-connect-rail` a hairline rail fills column by column in product colours with each step's time, windows without title bars; S16 `sec-connect-head` the command sits under the intro line in the section head; S17 `sec-connect-pick` sample-link chips beside the command, cycling until the visitor clicks one.

S15 marked pick (2026-10-29). Palette change in `demos/sec.js` PROD, applied to every section pick: Rich Media #0055ff, Preview API orchid #a52fd0 (mid #dba4ef, tint #f7ebfc, 4.7:1 on tint), Data API violet #6a3bff, Publisher Console green #007a45. S18 `sec-connect-rail-says` / S19 `sec-connect-rail-chips`: S15 with rail labels that say what each product made of the URL instead of its time (Rich Media media type, Preview API metadata found, Data API mode · use, Console verdict); S19 sets them as keyed chips in the product tints.

S20 `sec-connect-rail-inline` (2026-10-29): S19 with the command on the left and each rail label as product name left, value right in grey mono (shorter values so they fit one line). Palette swapped to hue order for all section picks: Preview API violet #6a3bff, Data API orchid #a52fd0 (blue 220° → violet 254° → orchid 284°, green 154° for the publisher side).

S21 `sec-connect-rail-lean` (2026-10-29): S20 with each fact said once. URL and status only in the command line, labels only in the rail; windows show only output (player + iframe line; chat message without the link + card, the only place the source is named; Markdown only; page path + the three requests). Windows 196 px, content centred.

S22 `sec-connect-rail-once` (2026-10-29): S21 with the product name once per column (rail shows only the value, the card heading names the product) and links to the product pages that do not repeat the heading: Explore embeds (/embeds), Explore link previews (/preview-api), Explore URL data (/data-api), Explore publisher controls (/publishers). S21's Data API box shows more Markdown (full text / excerpt / metadata list per verdict).

S23 `sec-connect-rail-media` (2026-10-29): S21's structure with real media from Iframely (Wikipedia article image in the summary card and unfurl, SoundCloud artwork, YouTube maxres thumbnail with YouTube's play button; sites' own favicons), a SoundCloud widget mock (artwork, orange play button, artist/title, cloud mark, two-tone waveform with reflection, duration), box content aligned to the top, and the Data API Markdown typed in line by line. The YouTube sample is now a real video (dQw4w9WgXcQ); the made-up Kerala video and guessed Bonobo video ids 404 in Iframely. Images are hotlinked (i.ytimg.com, i1.sndcdn.com, thumb.wikimedia.org).

S23 update (2026-10-29): the Publisher Console box shows the domain, last-hour calls/hits, then the access decision with a shield icon (Allowed / Partly allowed / Denied, with mode and what went out) and the five content types as layers from Meta to Fulltext, filled green when sent, dashed when withheld. A fourth URL demonstrates a refusal: travel.example.com/kerala/munnar-tea-trail (made-up publisher, Wikimedia Commons photo Munnar_Overview.jpg), Data API ai-train · full, denied by the Console rule /kerala/*, no content returned. Missing favicons become an SVG letter tile.

S24–S27 home top (2026-10-29): the current hero (nav, "Iframely makes URLs work inside other products", the marketing sub, Get API key / Check URL), the trust logos and the S23 band (via `band23(stage, { slot })`, without its section head) in different orders. Logos are plain text wordmarks, not brand artwork; proof lines use only claims already on the marketing site.
- S24 `sec-hero-stack`: hero → S23 band with card copy → trust grid 6×2. The cards double as the product overview.
- S25 `sec-hero-trust-first`: hero → drifting logo row → band without card copy (rail names the products).
- S26 `sec-hero-proof`: two-column hero → band with a proof line per card (Canva; Atlassian, Notion, GitBook; SOC 2 · 99.99% uptime; 6,000+ products) → one row of logos.
- S27 `sec-hero-field`: the S23 command line becomes the hero's URL field with Check URL inside; Get API key as a text link plus the home-page stats line; band without copy; one row of logos.
- S28 `sec-hero-field-copy`: S27 with short copy under each window (audience tag, one sentence, link; no product heading since the rail names it). Built on `fieldHero(stage, copy)`, shared with S27.
  S28 also: the URL field shows the URL only (`.hx-field.clean` hides the prompt and the `200 · ms` status), and the Publisher Console box animates via `animPC` (bars grow, counts run up, rule slides in and flashes, shield stamps, layers fill one by one, then this request ticks calls +1 and pings the newest bar). S23 keeps the plain cross-fade.
  S28 trust: no line under the field; the stats (6.5 billion requests a month, 99.99% uptime, SOC 2 Type II) are the bottom strip of the trust box with green line icons (`fieldHero(…, { stats: true })`, `hxStats`). S27 keeps the line under the field.
- S28 marked ★ pick (2026-10-29).
- S29 `sec-hero-field-carousel`: S28 with the twelve logos in one row of six cells, two sets taking turns, after the sv-animations logo carousel (https://sv-animations.vercel.app/spell/logo-carousel: exit up 40px + blur 4px, enter from below, 600 ms, 140 ms stagger); the swap fires when the band finishes each URL (`railScene` `o.done`), not on a timer. Cell borders stay still; hover pauses; reduced motion keeps the first six. `hxCarousel` / `carouselSwap`, `fieldHero(…, { stats: true, carousel: true })`.
- S30 `sec-hero-field-cards`: S29 with each product as one card (`.cardy`): window flush at the top with a line under it, copy padded below on #f6f6f6 (neutral grey); the active product outlines the whole card.
- S31 `sec-hero-field-bare`: S29 with no copy under the windows (`noCopy`): the rail names each product, the logos follow right after the windows.
- S32–S37 (`sec-fx-dot`, `-spin`, `-type`, `-trace`, `-one`, `-tree`): S31 with other progress displays instead of the line over each window: a status dot, a spinner that becomes a tick, the rail value typing in, the window outline tracing itself (conic border, `@property --fxa`), one line across all four in the product colours, and a connector from the URL field branching to the windows (SVG, redrawn on resize). Built as `o.fx` hooks in `railScene` (cls, mount, reset, start, answer, end).
- S38 `sec-fx-grad`: S36 with the line as one smooth gradient (each product colour peaks over the middle of its window, at 12.5 / 37.5 / 62.5 / 87.5%), `FXS.grad` = `FXS.one` with other `stops`. S36 and S38–S40 reset with a quick fade (.22 s), then the line is emptied out of sight; it never runs backwards. Fill steps stay linear.
- S39 `sec-fx-url`: S38 with no URL field or Check URL button (`fieldHero` option `urlOnly`, band class `.bare`): the URL types in as a plain blue line 16 px above the progress line; the hero has no button, Start free stays in the nav.
- S40 `sec-fx-mark`: S39 with the scheme dropped so the line starts with the URL's own `//` (same Geist Mono, regular, URL blue; a MutationObserver strips `https://` from each typed step). From reset until the line reaches the end of the Rich Media column (`answer(0)`) those two characters run the L06 terminal spinner (`/ - \ |`, second one frame ahead, 110 ms per frame, no brackets), then settle back into `//`.
- S41 `sec-fx-chat`: S40 with the Preview API window as a chat (`chatBody` / `animChat`, CSS `css-ch`): thread anchored to the bottom with a top fade, composer "Message #general". Per URL: text + link type into the composer (send button turns Preview violet), the message is sent and slides in, older ones move up (max 3 kept), then a shimmer skeleton unfurls into the card (site icon, title, one-line description, 36 px image). Link on its own line with an ellipsis. `fxScene(key, o, more)` now takes overrides for band23 (`body`, `update`).
- Publisher Console layer bars (Meta … Fulltext) are light neutral grey (`--g2`) since 2026-10-30, not the product colour.
- Publisher Console window (`PC23`, all S scenes): access block (rule, decision, layers) on top, traffic chart and counts below a dashed line (swapped 2026-10-30); `animPC` now builds it top to bottom: rule → shield → layers → chart with count-up → ping.

## Publisher colour (`group: pal`, page `#colour`, `demos/pal.js`, 2026-10-29)

The developer products run blue → violet → orchid (220°, 254°, 284°); the Publisher Console's green (154°) sits apart. Six candidates, each a solid / mid / tint passing 4.5:1 on white and on the tint: green (before) `#007a45`, teal `#00768a`, **magenta `#c81d77` (chosen 2026-10-30, now the default)**, raspberry `#c81e52`, coral `#c7381a`, amber `#a65400`.

- K01 `pal-pub-sheet`: each candidate beside the three fixed colours: swatches, hue positions, badges, tags, contrast.
- K02 `pal-pub-home`: S28 with a switcher (localStorage `pal-pub`).
- How: `PROD.pub` in `sec.js` now reads `var(--pub-m)`, `var(--pub-mid)`, `var(--pub-t)` with magenta as fallback (green before 2026-10-30), so every S scene looks the same unless a wrapper sets them. The Console's layer bars and rule highlight follow the variable. The Allowed / Partly allowed shields and the stats icons stay green, as status colours. `icon()` moves `var()` fills into `style` (SVG attributes don't take `var()`). `DEMOS.secKit` exposes `PROD`, `KEYS`, `CARDS`, `icon`, `tagEl`, `ensure`, `xEnsure` for `pal.js`.

## Wordmark techniques (`group: wm`, page `#wordmark`, 2026-11-04)

`demos/wordmark.js`. Ways to build the logo from lowercase "iframely" in a grotesk or a mono face with `//` and, optionally, `:`. Static type studies with a little hover; each card has a font switcher (mono: JetBrains Mono, Geist Mono, IBM Plex Mono, Space Mono, DM Mono, Martian Mono, Fragment Mono; grotesk: Inter Tight, Geist, Space Grotesk, Schibsted Grotesk, Host Grotesk, Hanken Grotesk; plus Doto in W12), all Google Fonts loaded by one stylesheet on first mount.

| Demo | Technique |
|---|---|
| `wm-specimen` W01 | `//iframely` in all thirteen faces |
| `wm-contrast` W02 | Slashes vs word in one property: colour, weight, comment grey, italic, reversed |
| `wm-syntax` W03 | Position as syntax: `//iframely`, `://iframely`, `iframely://`, `iframely:`, `iframe:ly`, `iframe//ly`, `:iframely:`, `iframely::embed`, `/iframely` |
| `wm-glyph` W04 | Glyph swaps: `iframe/y` (l → /), `iframe\|y`, slash or square in place of the i dot, `/ + /framely` |
| `wm-cut` W05 | Diagonal cuts through the word (the gap is the slash; hover opens it), tall slashes, overprinted slashes, giant // behind, hover path |
| `wm-icons` W06 | Short forms `//`, `i/`, `/i`, `i:`, `:/`, `if` as tiles; tile and disc lockups |
| `wm-block` W07 | Highlight block, pill, drawn parallelograms, single bar |
| `wm-tags` W08 | `<iframely/>`, `<iframe/ly>`, `</iframely>`, `[//]iframely`, `[//iframely]`, `{iframely:}` |
| `wm-grid` W09 | Mono grid stacks: 5 × 2, 4 × 3 with `::`, 2 × 5, word first, 2 × 2 |
| `wm-terminal` W10 | Block cursor, `$ iframely_`, `~/iframely`, blinking colon, `> iframely://` |
| `wm-link` W11 | Underline, selection, marker, struck-out `https:`, dotted underline, browser tab |
| `wm-symbols` W12 | Canvas: the mark resampled into `/ : .` characters, halftone dots, pixels; Doto dot-matrix face |
| `wm-scale` W13 | Three sizes, truncation `//iframely → //if → //`, hover-to-expand short forms |
| `wm-grotesk` W14 | Grotesk word with mono, superscript, subscript or drawn slashes; heavy word + colon; light/semibold |

## Dither (`groups: dt, dta`, page `#dither`, 2026-11-05)

`demos/dither-set.js`. Dithering for the white / `#f6f6f6` / `#0055ff` system, using the brand symbols `//`, `:`, `<`, `>` as dither units where it fits. One WebGL2 context (`R` in the file) renders field × method into a hidden canvas and every visible 2D canvas copies its frame from it, so the page never hits the context limit. Output is transparent where there is no ink: the ground is the element's own CSS background, so a pattern can sit on a block, a button or a section edge. ~30 fps, only on screen, one still frame with reduced motion.

- Fields: `linear`, `radial`, `clouds` (fbm), `blobs` (metaballs), `arch`, `bands`, `slashes` (the // as two parallelograms), `chevrons` (< >), `sphere` (lit, with an orbit ring), `shapes` (circle + slash + half ring), `flat`, `bar` (marker); plus an optional text mask (multiply / max / knockout) with a vertical gradient inside the glyph box.
- Methods: `bayer` 8×8, `ign` (interleaved gradient noise, blue-noise-like), `grain`, `halftone` (45°), `lines` (line screen at the slash angle), `marks` (per cell: nothing → thin / → bold / → //), `glyphs` (ramp `  . : / < >` and a heavy `/` in the second ink).

| Demo | What |
|---|---|
| D01–D10 `dt-*` | Soft backgrounds, each on white, grey and blue with a sample text block; bar switches method, cell S/M/L, tone (Tint / Grey / Accent; glyphs, marks and lines take a stronger ink pair) and text. Corner glow, Grain wash, Noise clouds, Soft blobs, Horizon arch, Slash screen, Slash marks, //:<> glyph field, Waves, Soft shapes |
| D11 `dta-slash` | The // mark dithered beside a product block; tiles: halftone / glyphs / marks / lines |
| D12 `dta-chevrons` | < > behind a JSON card, dissolving outwards; tiles on blue (glyphs) and white (blue noise) |
| D13 `dta-orb` | Halftone sphere, orbit ring, provider pills riding it |
| D14 `dta-cards` | Product cards with the symbol (// <> {:} :/) dithered into the header in the product colour |
| D15 `dta-dissolve` | A window / card dissolving into the ground (dither layer in the ground colour) |
| D16 `dta-sections` | 56 px bands between white, blue and grey sections (Bayer 4 px, halftone, slash lines) |
| D17 `dta-stats` | Numerals with offset dither shadows (Bayer, lines, halftone) |
| D18 `dta-highlight` | Dithered marker and underline on white, grey, blue |
| D19 `dta-buttons` | Hover sweep in buttons, product chips with a dithered swatch, glyph-textured tags |
| D20 `dta-cta` | CTA cards with a glyph corner (blue) and slash-mark corner (grey) |

### Second colour (2026-11-05)

A page-wide "2nd colour" switch on `#dither` (None / Pink `#ff3d8b` / Red `#ff4438` / Violet `#8a4dff`; localStorage `dt-sec2`, default Pink). The shader has a third and fourth ink (`c`, `d`) and a hue field (`hue: { mode: 'noise' | 'linear' | 'all', p }`) that picks them per cell through its own Bayer offset, so the two colours mix as dither, never as a blend. Backgrounds mix the second pair from the ground at the same strength as the blue pair (`secInks`). Accents: // turns towards the top, > of < > takes it, the orb's shadow side, a sprinkle in the white→blue band, stat shadows, highlight markers, the top glyphs of the primary button sweep and the CTA corners. Product cards keep their product colours. Violet sits near the Preview API violet `#6a3bff`, and pink near the Publisher magenta, so check against the product palette before choosing.

## Dither stills (`group: dts`, page `#dither-stills`, 2026-11-05)

`demos/dither-stills.js`, static assets for Figma using `DEMOS.ditherKit` (exported by `dither-set.js`). Methods limited to the user's picks for stills: Bayer and //:<> glyphs. Each card renders at a real export size on white / grey / blue; the preview is that render (Fit, or "1:1 corner" to see real cell size). Controls: method, cell, tone, 2nd colour, size preset, export 1×/2×, ground transparent/filled, seed (reproducible; Shuffle). Exports per ground: Copy PNG (clipboard, pastes into Figma), PNG ↓, Copy SVG, SVG ↓. SVG: Bayer cells merged into horizontal runs, one `<path>` per ink (~1.5 MB for a 1440×800 cloud field); glyphs drawn as outlines of `. : / < >` and a heavy `/` (approximating JetBrains Mono), read back from a code pass of the shader (`codes: true` writes glyph index + hue select per pixel).

F01–F17: corner glow, grain wash, noise clouds, soft blobs, horizon arch, waves, soft shapes, glyph field; // mark, < > brackets, orb, product symbols (per product), transition band (Bayer, from-ground × to-colour), marker strip, corner piece, dissolve overlay (ink = ground colour, to lay over an image).

### Stills round 2 and picks (2026-11-05)

User picks (marked ★ on `#dither-stills`): Corner piece, Grain wash, Noise clouds, //:<> glyph field, Soft shapes (needs more glyph variety), The // mark and Product symbols (want glyph and icon variants), Transition band (want real mono glyphs). Methods: Bayer and glyphs. Second colours: pink and violet only (red dropped on stills). Their F numbers were taken before a fix: `dts-corner` was registered twice (background and accent), so the accent overwrote the background; their F01 = Corner piece and F15 = Dissolve overlay. The accent is now `dts-cornerpiece`.

Changes: the glyph atlas has 12 glyphs, `.` `:` then `/ < >` in regular, semibold and heavy; levels 3–5 pick `/` half the time and `<` or `>` otherwise (applies to the animated page too). Stills glyph cells are 14 / 20 / 30 px. Preview "Auto" shows glyph cards at 1:1, cropping the corner for backgrounds and the centre for centred assets. `solid` (shader `u_solid`) fills a cell completely above a threshold, so the glyph band ends in a solid edge. The dissolve preview has a sample image under it. New F17 `dts-icons`: play, player, embed `</>`, JSON `{ }`, link and card icons as masks filled with glyphs (Accent tone, texture off by default); exports as SVG outlines too.

### Stills round 3: type and products (2026-11-05)

`demos/dither-stills2.js`, F18–F24 on the same page and group, after the review of the picks: more glyph variety for Soft shapes, glyph and icon variants of the // mark and the product symbols, real mono glyphs in the band, and the four products as a set.

**Type pass.** The shader now only supplies the field: `spec.codes = 2` writes the raw field value and the hue select per pixel (`dither-set.js`, one extra line in `main()` and in `paint()`). `dither-stills2.js` samples that at the centre of a character grid (JetBrains Mono advance .6 em, line height 1.25 em, font size 12 / 16 / 24 px for Cell S / M / L; a card may bring its own sizes, `def.fs`), runs the 8×8 Bayer threshold per cell in JS (same ramp as the shader: six levels, blank . : then three weights, the heaviest in ink b; `solid` cells become rectangles) and writes the characters with the real font. Layers: several fields can share one grid (the strongest owns a cell), each with its own glyph set. Glyph sets: `//:<>` (the shader's mix), Slashes, Brackets `<>` (alternating by column, so rows read `<><><>`), Braces `{:}`, Colon slash `:/`, URL (`h t p s : /` at the middle level), ASCII (`. : = + #`), Dots. Each product has its own set (`OWN`: // slashes, <> brackets, {:} braces, :/ colon-slash). Weight: Ramp (400 → 600 → 800 with density), Regular or Bold. PNG: one sprite per character, weight, ink and scale, drawn per cell, so the font's ligatures (`//`, `<>`, `::` are ligatures in JetBrains Mono) never fire. SVG: text, one `<text>` per row, weight and ink, starting at the first glyph with `xml:space="preserve"` for the gaps, solid cells as one `<path>`; Figma gets editable text layers, which needs JetBrains Mono installed there and its ligatures switched off. Inks: `inksFor(colour, ground, tone)` mirrors the sparse tables (tint .27 / .5 of the colour on light grounds, white mixes on dark ones; accent ends in the full colour or white), plus the second colour through `secInks` and a hue field.

**`still()` additions** (`dither-stills.js`): `def.render(st, g, scale)` and `def.svg(st, g)` replace the shader paint and the vector export; `def.cols` (4-column grid for the product sets); free-text options (`opts: [{ input: true }]`); `def.reground(st, g)` recolours a ground from a control (product colour, tint, the Ink poster); `def.note`, `def.tag` (file names); OG 1200×630 in the background sizes; the kit is exported as `DEMOS.stillsKit`. Shader: the shapes field takes per-shape gains in `r` when `r.w > .5`, so the circle, slash and ring can be rendered as separate layers.

| Demo | What |
|---|---|
| F18 `dts-type` Type field | The glyph-field, grain, clouds and corner picks in real type: field (Rise BR = the glyph-field pick, Glow TR, Corner, Clouds, Wash), glyph set, colour (blue, the three other product colours, Ink; the third ground takes the colour, Ink gives a dark poster), weight |
| F19 `dts-typeshapes` Shapes in type | The soft-shapes pick as three layers in three sets: Dots · slashes · brackets, //:<> throughout, Braces · URL · :/, Slashes only. Preview starts fitted |
| F20 `dts-typemark` // and < > in type | The glyph variant of the // mark and the brackets: the shape filled with its own character, heavy at the foot or the inner edges, dots scattered around. Bracket spacing follows the aspect ratio (`r.z = .5·W/H`) so every preset keeps both brackets on the canvas |
| F21 `dts-typesymbols` Product symbols in their own glyphs | Four panels, one per product: // out of slashes, <> out of brackets, {:} out of braces and colons, :/ out of colons and slashes, in the product colour; ground white, tint or the colour (white type); optional cloud texture |
| F22 `dts-prodicons` Product icons | The icon variant, through the shader (Bayer or glyphs): player, link card, braces, shield, each in its product colour on white, tint or the colour |
| F23 `dts-typeband` Type band | The transition band in real type: rows thicken with density, the last row is forced solid (`lastSolid`), set and "to" colour switchable |
| F24 `dts-typetext` Any text in type | Free text as the mask (Geist 700, JetBrains Mono 800 or Instrument Serif), filled with a glyph set, dense at the foot (`mg` 1.25 keeps the tops at colons) or even; finer cells (8 / 11 / 14 px) so a 190 px headline reads; OG size for social images |

Gotchas: Google Fonts' JetBrains Mono subset has no block elements, so there is no `░▒▓█` set (they would fall back to another font and break the grid). The chevrons field places the brackets at `± r.z/2` in aspect units, so a fixed `r.z = 1` (F10's value for 2:1) pushes them off a square canvas. Preview Auto crops glyph cards at 1:1, which shows nothing useful for cards whose subject is the whole image (shapes, marks, text): those start on Fit. Checked headless with Playwright (`--use-gl=angle --use-angle=swiftshader`), including one SVG download per card.

### D17 glyphs, F25 shadow tile, sidebar fix (2026-11-05)

- **D17 `dta-stats`** has a second row with the shadow in //:<> glyphs (cells 6 / 8 / 11 px; mask strength 1.35 so heavy glyphs survive inside the strokes). User: "i really like D17".
- **F25 `dts-shadow`** (in `dither-stills2.js`): the D17 effect as a static tile, a dither gradient the height of a line of type (dense at the foot / top / flat; ranges .3–.95, .1–.75, 0–1; optional noise), Bayer through the shader or real glyphs through the type pass (Bold by default). Exports PNG/SVG like every still. Under the exports, a live preview applies the white-ground PNG to "1,900+" and "2012" with `background-clip: text` (offset shadow or texture fill), plus the CSS to copy and the Figma steps: duplicate the text, mask the tile with the copy (or use the PNG as a Tile image fill at 50% for 2×), nudge it under the solid text. Bayer tiles repeat seamlessly sideways. `still()` got `def.after(st, el)` for previews like this; `svgOf` is in `DEMOS.stillsKit`.
- **Sidebar**: clicking a demo on the current page no longer rebuilds and remounts the page; it marks the link and pins the card to the top for 2.5 s (or until the user scrolls), because cards above it mount lazily and grow and used to push it away. The last cards of a page stop where the page ends.

## Dither sections (`group: dtx`, page `#dither-sections`, 2026-11-05)

`demos/dither-sections.js`, after the user's Figma compositions of the Publisher Console block (glyph clusters + Bayer edge on blue, glyph field rising on pink, terminal band with block cursors on black, black | blue split) and a reference of pixel serif type inside crop marks over a fine dot grid. Live HTML copy (eyebrow path in JetBrains Mono, Geist 400 heading, square buttons, body right) over a canvas art layer built from ops: `rect`, `type` (the type pass, `DEMOS.typeKit` exported by `dither-stills2.js`), `bayer` (edge cells computed in JS from a shader-sampled field, top row solid), `rows` (terminal band: sparse dots, colons with glyphs, one heavy italic row with block cursors; drawn per character so ligatures never fire), `pix` (pixel type: text drawn at 1/p size, alpha thresholded, scaled up without smoothing). Exports per section: Copy PNG / PNG at 2×, SVG (type as JetBrains Mono text with ligatures off, Bayer cells and pixel type as merged runs). The Bayer edge hangs 40 px past the section into the page.

| Demo | What |
|---|---|
| X01 `dtx-clusters` | Glyph clusters top-right and on the left edge, dot patches, edge Bayer / type rows / none |
| X02 `dtx-rise` | One field rising from the bottom-right corner (pink by default) |
| X03 `dtx-terminal` | Clean ground, terminal band at the foot (3 or 6 rows, italic or upright heavy row, optional dot field above) |
| X04 `dtx-split` | Black left (dots in the colour, terminal band) and colour right (:/ field) |
| X05 `dtx-quote` | Pixel serif statement: editable text and accent line, Source Serif 4 / Instrument Serif / Geist / JetBrains Mono, 2 or 3 px pixels, crop marks, one-pixel dot grid in Bayer order, four grounds |
| X06 `dtx-products` | The four products as a set: Rich Media blue clusters + Bayer edge in //, Preview API violet rising <>, Data API black terminal band in orchid {:}, Publisher Console black | magenta split :/ (or all blue) |

Every single-section card switches the product copy, colour (blue, pink, violet, orchid, magenta), ground (colour with white marks; black, white or grey with marks in the colour), glyph set, heading (Geist or Pixel serif: the h2 is hidden and drawn into the art as pixel Source Serif 4), and the page colour around it.

### Sections round 2: the response is the texture (2026-11-05)

`demos/dither-sections2.js`, X07–X12. User: "add some iframely api response related glyphs/words/json to backgrounds and shapes; propose our own interpretations". The idea: the field still decides density, but dense cells write real API output, legible at the core and eroding to `.` and `:` (only where the text has a character, so the haze keeps the text's shape) and then nothing; JSON keys take the second ink pair like a code editor.

Mechanics: a glyph set's `ch` may now be a function `(i, j, seed) → char`, and a layer may pass a set object (`dither-stills2.js`). `textSet(lines, map)` reads text through a cell → [line, column] map: `tileMap` (response blocks tiled, each block column shifted 7 rows), bottom-aligned (rising from the request line), or `streamSet` (one string wrapped row by row; `compact()` drops whitespace outside strings so masked shapes have no holes). `keyTint` is a post-layout hook (`op.post(lay)`, new in `dither-sections.js`) that sets the hue-select bit for key characters. `classify()` tags characters as key / string / literal / punctuation. New op `text` (solid type, e.g. the stat numerals). `section()` accepts `item.art(W, st) → { ops, H }` for copy-less compositions. Kits: `DEMOS.sectionsKit`.

Data: real Iframely responses from the logo scenes (YouTube video, GitHub card, SoundCloud), a Data API access object after the docs, and an illustrative Publisher Console policy (mock, `example-news.com`). The iframe src is shortened, no API key.

| Demo | What |
|---|---|
| X07 `dtx-response` | The response tiled as the field, legible under the body copy (or corner / right block / band / clouds); copy follows the response's product |
| X08 `dtx-request` | Bottom row = the request (`> curl "iframe.ly/api/iframely?url=…"`, block cursor, `200 · 212 ms`); the response rises from it, legible for its last lines, in the right column or full width |
| X09 `dtx-symbolresp` | // { } <> :/ written in their own product's compact response, product colours, keys strong |
| X10 `dtx-vocab` | The rising field in the API's words: meta keys, rel tags, provider domains, or keys + values |
| X11 `dtx-card` | Preview API section whose visual is a link card in type: glyph-dither thumbnail (play knock-out for video), meta.title and description as text, `// site` in the accent, a faint JSON haze behind, the card foot dissolving in Bayer cells |
| X12 `dtx-stats` | D17 with data shadows: 1,900+ in provider domains, 2012 in meta keys, 6,000+ in rel tags (words joined by `·`) |

### Sections round 3: data in shapes and masks (2026-11-05)

`demos/dither-sections3.js`, X13–X18. User: "continue explorations. add new ideas with glyphs/text/data/shapes/masks". Round 2's helpers are exported as `DEMOS.sectionsKit2` (responses, `textSet`, `streamSet`, `compact`, `keyTint`, `jsonInks`, `maskText`…). Article, receipt and policy data are mocks on `example-news.com`.

| Demo | What |
|---|---|
| X13 `dtx-close` | The section closes like a response: closing staircases at its foot (`} ] }` stepping out like nested JSON, or `</a> </ul> </div>`), the indentation shown as `·` the way an editor shows whitespace, light to heavy towards the last row; the last `}` of each block drips past the edge in the section colour |
| X14 `dtx-urlmask` | The URL set huge (domain/ over the path) as a mask, filled with its own compact response in bold, keys in the second ink; request line with cursor above, status and byte count below; optional JSON haze around |
| X15 `dtx-skeleton` | Loading skeletons for a player, a link card and a track, where each bar is exactly as long as the real title / description / site (word gaps included) and is written in it; image blocks hold the JSON. Skeleton = dots and colons, Loaded = the text, Resolving sweeps across the card (levels set in a `post` hook from the cell's x) |
| X16 `dtx-redact` | One article as three agents get it under a policy: keys stay, withheld values are covered by redaction bars in 2 px Bayer cells, solid in the middle and dissolving at the ends (or patchy). Bars are pixel runs, not ▒▓█ glyphs: Google-Fonts JetBrains Mono has no block elements and the fallback glyphs overflow the line |
| X17 `dtx-weight` | A wall of words (domains, rel tags, keys, `·`-joined so no cell is empty) where the shape (product symbol, //iframely or 1,900+) is only a change of weight and ink: two layers on the same text stream, an even or left-fading field outside, a slightly blurred text mask inside |
| X18 `dtx-receipt` | A read printed as a receipt hanging out of the section (dot leaders, signals checked, what was received, JSON haze behind). Round 2: five receipts (Data API read, Console policy test, Preview unfurl, Rich Media statement, Console agents report) and everything on the paper is text: product symbol, thumbnail, column chart, bars, barcode, code square and torn foot in block characters. Print: Text or Pixels (the same characters as rectangles); Face: Geist Mono, Fira Code, JetBrains Mono (block rows fall back to Geist Mono) |
| X19 `dtx-redact-blocks` | X16 as pure text: redactions in block characters (bar ░▒▓██▓▒░, fade, mosaic, tape ▄) in Geist Mono or Fira Code at the face's block height, so redactions on consecutive lines join |
| X21 `dtx-receipts2` | X20 in the website prototype's style (page #fafafa, text #111 / #333 / #777, blue #0055ff, product colours, Geist Mono), light or all black, accents per product / all blue / none. No pictures: //iframely logo in type, ░▒▓██▓▒░ rules and marks, a sparkline + ░▒▓█ heat strip, a quota gauge, bars ending in ▓▒░, a box-drawn link card, inverted chips (DENIED, BY LICENSE), barcode, code square |
| X22 `dtx-receipts-text` | Rich Media prints the embed it returned instead of the statement: a 16:9 YouTube player in characters (box frame, ░▒▓ vignette in the accent, half-block play triangle, title over the frame, ━ progress with its head, ▌▌ 1:12 / 3:34 · CC HD [ ]), then title, author, site and the embed summary (type player, rel, aspect 16:9 · 1.778, duration, provider, iframe, autoplay, cache). Only characters Geist Mono has: ▶ and ⛶ fall back to wider glyphs and break the frame. Otherwise the X21 receipts as live HTML text (selectable; chips are spans with a background), at the face's block line height; Copy text / .txt give all four as plain characters. Uses the new `item.dom(st) → { el, text }` hook in `dither-sections.js` |
| X20 `dtx-receipts` | Four receipts on a rail, one per product in its colour: Rich Media statement with a column chart of embeds per day, Preview unfurl with a dithered thumbnail, Data API read with a code square, Console agents with bars |

### Sections round 4: marketing blocks typed in text (2026-11-05)

`demos/dither-sections4.js`, X23–X28, after the user liked the text receipts. Whole website blocks in the prototype's copy layout (mono path, Geist heading, square buttons, body) whose visuals are live HTML text (`item.dom`), light or all black, accents per product / all blue / none; Copy text and .txt export the section as plain characters. A small character `grid()` places boxes, lines, arrows and text by cell and reads them out as rows. Geist Mono on Google Fonts carries box drawing and blocks (U+2500–259F), ASCII and only ↑ ↓ among arrows: no → ▶ ● ✓ □, which fall back to wider glyphs and break alignment, so arrows are `──>`. Font stacks with double quotes must not go into `style="…"` attributes. Numbers and entries are mock.

| Demo | What |
|---|---|
| X23 `dtx-t-pipeline` | How it works: request box `──>` //iframely (1,900+ parsers, ░▒▓██▓▒░ core) branching `├──>` to embed / card / data / policy boxes in product colours |
| X24 `dtx-t-stats` | 99.99% / 212 ms / 1,900+ with text charts: 90-day uptime bars (height = uptime), ▁▂▃ latency histogram with ↑ p50 / p95, providers by kind as ▓▒░-ended bars |
| X25 `dtx-t-products` | The four products as text windows: playing YouTube player, link card with shaded thumbnail, Markdown excerpt over access bars, policy table with chips |
| X26 `dtx-t-compare` | Iframely vs oEmbed only vs your scraper: 9-character shaded cells (█ / ▓▒░ / ░) plus yes / some / no |
| X27 `dtx-t-changelog` | Updates as `git log --graph`: commits in product colours, product chips, a branch that merges back, `░▒▓ new` |
| X28 `dtx-t-cta` | //iframely in half-block letters, a prompt with a block cursor, the buttons as inverted text, a ░▒▓██▓▒░ mark |

### Sections round 5: text blocks with motion and interaction (2026-11-05)

`demos/dither-sections5.js`, X29–X34 ("explore new ideas"). Same palette, faces and text export as X23–X28 (`DEMOS.sectionsKit4`). Timers stop on their own once the card re-renders (`live()` checks `isConnected`); reduced motion shows still states. Numbers, fixes and API parameters are illustrative.

| Demo | What |
|---|---|
| X29 `dtx-t-hero` | Hero: a window where the request types itself, the JSON streams in (keys ink, strings in the product colour) and the result is drawn under `── rendered ──`: player, card, Markdown + access bars, policy; four URLs in a loop |
| X30 `dtx-t-resolve` | A URL resolving into data: the player + embed summary in characters, each cell resolving in Bayer order left to right (blank → . → : → the character) on a slider, or playing back and forth |
| X31 `dtx-t-diff` | What Iframely does to a link: a chat log as a diff, pasted URLs as removed lines, the player / cards drawn as added lines, a policy-trimmed news card with an `excerpt 300` chip |
| X32 `dtx-t-index` | Provider index: 66 sample providers A–Z with dot leaders to their kind, blue letter headings, a letter rail and a live filter field |
| X33 `dtx-t-man` | The API as `IFRAMELY(1)`: NAME, SYNOPSIS, DESCRIPTION, OPTIONS, HTTP STATUS, EXAMPLES, SEE ALSO |
| X34 `dtx-t-heatmap` | 53 weeks × 7 days of parser fixes in ·· ░░ ▒▒ ▓▓ ██ with month and weekday labels, legend, total, and the latest fixes as commit lines |

Block characters (U+2580–259F): Google Fonts' JetBrains Mono has none; Geist Mono and Fira Code ship them in a separate subset, so they are loaded with block text (`document.fonts.load(font, '█…')`). Measured full-block extents: Geist Mono 0.96 em above the baseline + 0.34 below (line height 1.3), Fira Code 0.90 + 0.30 (1.2); at those line heights rows of █ ▀ ▄ stack into solid areas. Half blocks give 1-bit pictures at two pixels per cell (one pixel = .6 × .65 em, drawings squashed by .923 to stay square); ▁…▇ make column charts, ▏…▉ bars. `rows` ops take `fam` and `base`; the canvas draws runs of block characters as one string with a hairline stroke so neighbours meet without seams (SVG keeps plain text). JetBrains Mono ligates `<>` and `//` on canvas, so symbols are drawn with zero-width non-joiners between characters.

## Content visuals (`group: cv`, page `#content`, `demos/content-visuals.js`, 2026-11-05)

One card per content block of website (home, /embeds, /preview-api, /data-api, /publishers), with that block's real eyebrow, heading, intro and cards. Each card adds a visual for the block's argument, often where the prototype has a grey placeholder or a plain table. Visuals are live HTML text in Geist Mono (Copy text / .txt), in the prototype palette with product colours, light or all black. Values not in the copy (timings, request counts, sample metadata, the example-news.com article) are illustrative.

| Card | Block | Visual |
|---|---|---|
| V01 `cv-lenses` | home hero | one YouTube URL branching into four lenses: player, card, content with permissions, publisher rules |
| V02 `cv-trust` | home trust | developers ↔ //iframely ↔ publishers, the four trust reasons placed on the diagram as [1]–[4] footnotes |
| V03 `cv-stack` | /embeds hero | the placeholder made real: article card, post and player stacked in characters |
| V04 `cv-evergreen` | /embeds hosted | 2019→2026 timeline: copied embed code goes 404 / moved, the hosted iframe with a Content ID stays fresh |
| V05 `cv-weight` | /embeds interactives | ~500 KB player vs cover image as bars, the consent gate as the dialog a reader sees |
| V06 `cv-merge` | /preview-api what you get | Open Graph / Twitter Cards / oEmbed / JSON-LD columns merging into normalised meta |
| V07 `cv-hour` | /preview-api API | two hours of requests, one tick a minute: 47 requests and 12 requests, one hit each |
| V08 `cv-board` | /data-api access object | content types × signals board with verdicts; tabs for the allowed (CC licence) and blocked (Console) samples |
| V09 `cv-pricing` | /data-api pricing | log-scale staircase of the real tiers with a reads-a-month slider and a dot-leader monthly total |
| V10 `cv-anatomy` | /publishers agents | one page drawn three times: what the Preview, Processing and Training agents read (█ read, ▒ with permission, ░ never) |
| V11 `cv-robots` | /publishers signals | the prototype's robots.txt generator, live, with changed lines highlighted |
| V12 `cv-annotated` | /publishers better previews | a bare link becomes a card, its four tags and image annotated to the parts they fill |

### Content visuals round 2: no characters (`demos/content-visuals2.js`, 2026-11-05)

User: "stop using ascii/glyph as a main idea, explore new variations". Same blocks and copy; the visuals are interface mock-ups (HTML/CSS), SVG diagrams and charts, and working controls, in Geist with the prototype palette and product colours. Gradients stand in for images. `DEMOS.cvKit.block` (from content-visuals.js) lays out the block.

| Card | Block | Visual |
|---|---|---|
| V13 `cv-switch` | home hero | the four lead sentences switch a stage: player, card, content with permissions, publisher toggles (auto-cycles) |
| V14 `cv-proof` | home trust | each trust claim opens its proof: signed headers, bot-manager verdicts, docs linking to Iframely, audit docs + uptime strip |
| V15 `cv-wall` | /embeds hero | a wall of embed interfaces: video, audio waveform, post, map, gist, slides, summary card |
| V16 `cv-years` | /embeds hosted | year slider 2019–2026 over the same post twice: copied embed breaks, hosted iframe counts refreshes |
| V17 `cv-waterfall` | /embeds interactives | network waterfall, embed code (502 KB) vs click-to-play (34 KB); press play to load the rest |
| V18 `cv-unfurl` | /preview-api what you get | a chat unfurl switched between Metadata, Summary card (large/small) and Rich Media |
| V19 `cv-cost` | /preview-api API | animated chart, 3 hours: cumulative requests vs billable hits (62 vs 3) |
| V20 `cv-layers` | /data-api access | content types as beams through signal layers (supports / promotes / blocks), allowed vs blocked sample |
| V21 `cv-calc` | /data-api pricing | big-number calculator: presets, metadata-only half price, effective price, tier split bar |
| V22 `cv-sequence` | /publishers agents | sequence diagrams per agent (app ↔ Iframely ↔ your site), arrows drawn in order |
| V23 `cv-console` | /publishers hero | the Console placeholder filled: requests by agent over 30 days, customer apps, hover a day |
| V24 `cv-policy` | /publishers control | real Live/Coming list beside a path × mode policy grid you can click through |
| V25 `cv-cardlab` | /publishers better previews | edit title / description / alt / image, preview in chat, feed and list, 4-of-4 checklist |

### Content visuals round 3: the blocks below the heroes (`demos/content-visuals3.js`, 2026-11-05)

User: "explore not only hero sections but also other blocks". Same approach as round 2 (UI, SVG, working controls; no character art), on the mid-page and closing blocks. Shared helpers come from `DEMOS.cvKit2` (content-visuals2.js). The 40-provider sample in `PROV` feeds both the index and the CTA's URL recogniser; check it against /domains before quoting.

| Card | Block | Visual |
|---|---|---|
| V26 `cv-products` | home products | the four product rows as one strip; the hovered column opens to text, buttons and a motif |
| V27 `cv-cards` | /embeds cards and themes | the four placeholders drawn (large light, large dark, small, product); hover shows the link with utm_source |
| V28 `cv-delivery` | /embeds delivery | a page scrolling itself: reserved boxes vs no heights, with embeds-loaded and layout-shift counters |
| V29 `cv-options` | /embeds customization | the editor options form wired to the player and its iframe code (start, theme, size, Powered by, white-label) |
| V30 `cv-paste` | /embeds editors and CMS | type, paste a URL, it becomes an embed node, in four editor chromes |
| V31 `cv-providers` | /embeds providers | filterable provider index (kind chips + search) instead of 16 grey logo boxes |
| V32 `cv-stats` | stats row | 2012 years filling, 6,000 dots, a live request counter at 6.5B/month, 0.01% downtime in minutes to scale (no heading; the page has none) |
| V33 `cv-docs` | proof | Atlassian, Notion, GitBook doc pages with the key sentence highlighted (the prototype's summaries, not quotes) |
| V34 `cv-faq` | /publishers FAQ | two-pane reader: filterable questions left, the answer large right |
| V35 `cv-cta` | /embeds CTA | the band holds a URL field that recognises the provider and says what the embed will be |
| V36 `cv-modes` | /data-api modes | triggers → audiences, one curve per mode; example + agent; the use values as a dial |
| V37 `cv-structured` | /data-api structured | the six parts of a result mapped onto regions of an article page |
| V38 `cv-compare` | /data-api compared | one row per reader: price bar with the table's wording, four permission marks; caption and honest paragraph kept |
| V39 `cv-verify` | /publishers verify | the Self-check working: headers in, four checks resolve, verdict; "Load a fake" borrows only the user agent |
| V40 `cv-purpose` | /publishers AI | the placeholder diagram running: request → agent by mode → your signals → decision back |
| V41 `cv-traffic` | /publishers traffic back | a card clicked in a chat ticks up the utm_source row in the publisher's analytics |

### Content visuals round 4: the remaining blocks (`demos/content-visuals4.js`, 2026-11-05)

V42 `cv-response` (embeds API: response JSON lines light the embed parts they produce; Iframely API / oEmbed / embed.js tabs), V43 `cv-pasted` (preview hero: one link resolving in a chat and a doc), V44 `cv-forwhom` (preview "who it's for" as three scenes), V45 `cv-read` (data-api hero: the read arriving part by part with its access reasons), V46 `cv-teams` (data-api "who it is for" as four product moments), V47 `cv-reach` (how it fetches: reach per agent + four principles), V48 `cv-quickstart` (real code tabs, Run streams a response, steps light up), V49 `cv-askus` (buyers' FAQ as a conversation), V50 `cv-ctas` (preview, data, publisher CTAs with a working first step), V51 `cv-logos` (home logo row as two moving rows of names; documented uses on hover), V52 `cv-pubproof` (publisher proof: stats, robots.txt finder with placeholder lines, help pages). All on the prototype page grey (#fafafa) in light theme, like V01–V41 now.

## Content visuals: Copy switch, Prototype or Humanized (`demos/content-human.js`, 2026-11-05)

User: "create a new page and recreate all visuals using humanizer skill; get the text from website proto and pass it through humanizer". First built as a separate page of cloned cards; the user then asked to combine them, so every `cv` card now has a Copy switch (state key `voice`, default Prototype) and Humanized shows the prototype copy was rewritten with the humanizer skill (staged contrasts like "Structured, not scraped" or "Cards link to your page, not to ours", forced triads, fragment lists, passive voice, slogan headings and sales phrasing → plain statements; facts, numbers and names unchanged). `COPY` holds 71 [prototype, humanized] pairs; strings without tells are not listed. The swap runs on the rendered DOM (deepest element or text node whose whole text matches, quotes/spaces normalised, `<code>` styling kept), a MutationObserver re-applies it after interactive redraws, and the .txt export gets the same replacements. `sectionsKit.card` now keeps `def` on the registry entry so pages can clone cards. Check: 70 of 71 strings occur on #content and with every card on Humanized none survive (the 71st appears only after the "Blocked" tab); switching back to Prototype restores the original.

## Page content: pricing (G01–G08, page `#pages`, group `pg`)

`demos/pages-pricing.js`. A new lab page for whole-page content, starting with /pricing. The copy and the price list come from iframely-marketing `plans/website/12-pricing-volumes.md` (D41–D45; D42 is still proposed) and its demo page (`demos/website/src/routes/pricing`). Prices are computed with the rules in the demo's `pricing.ts`: 2,000 free hits; pay as you go at $4 per 1,000; monthly volumes from 10K at $3.00 to 2M at $0.70, with every hit at the volume's rate; annual billing at any volume, linear between the rows; Enterprise above 2M. The plans are presented as two, Free and Paid (working names), and the cards build on the V21 big-number price box.

- G01 `pg-plans`: the two plans side by side. Paid is the calculator, with a monthly volume picker or annual billing at any volume. Under both: "You pay only for results" and Enterprise.
- G02 `pg-which`: one slider prices pay as you go, the cheapest monthly volume and annual billing together, and the cheapest becomes the big number. The cost chart marks the ~9,500-hit crossover.
- G03 `pg-staircase`: the volume table drawn as rate steps. Click a step for a monthly volume, or drag along the line for an annual volume.
- G04 `pg-month`: one month on a commitment. The bar shows the free hits, the prepaid volume, usage, unused hits expiring and hits above the volume.
- G05 `pg-hits`: the hit rules. URL-hours for the Preview API and Rich Media, requests for the Data API, and the "only results" rule shown as a batch of six links.
- G06 `pg-compare`: only the rows that differ between the plans, plus "included everywhere" chips and an Enterprise strip.
- G07 `pg-setups`: the demo's three worked examples (chat tool, newsroom, AI assistant), each with a size slider.
- G08 `pg-md`: the page and its pricing.md, with a "For people" / "For agents" switch.

The six sample URLs in G05 and the request ticks are illustrative.

## Page content: closing CTAs (G09–G17) and a pricing block (G18)

`demos/pages-cta.js`, same page and group. Each card shows one treatment of the bottom-of-page CTA for all five pages stacked (home, /embeds, /preview-api, /data-api, /publishers), and a Pages switch shows one page at a time. The copy is the prototype's Cta blocks. Home has no closing CTA, so it uses the band under its hero.

- G09 as built, plus the product colour
- G10 the home product layout, reused
- G11 a band in the product colour
- G12 the first step in the band (field or install line)
- G13 the first request (real samples.ts code)
- G14 the buttons as numbered steps
- G15 the path as a giant mark
- G16 both sides of the URL
- G17 what is free, drawn

The "Data API free line" switch swaps the prototype's "1,000 reads" for the new price list's 2,000 hits.

G18 `pg-cta-pricing` is a short pricing block that sits just above the closing CTA, laid out after a mock-up the user shared. The heading is on the left; on the right are a white "Start free $0/mo" box and a coloured "Monthly volumes from $30/mo" box, with an Enterprise line below. The copy comes from G01. Switches: page, Paid box colour (blue, page, black), monthly or annual line, and the closing CTA below.

## Pricing block, round 2 (G19–G24)

`demos/pages-price-block.js`, iterations on G18. The type follows website `type.ts`: heading 32, body 18, note 16, mono tag 16, buttons as 15 px pills, and cards with a 12 px radius and a hairline. Each plan shows only its name, price, one line and one button. Free is $0 with 2,000 hits then $4 per 1,000, Monthly volumes start from $30, and Enterprise is 2M+.

- G19 `pg-pb-three`: G18 in three columns (heading, Free, Paid) with an Enterprise line below
- G20 `pg-pb-plans3`: section heading over three equal plan cards
- G21 `pg-pb-pick`: G20 with volume chips on the paid card (10K, 50K, 100K, 1M)
- G22 `pg-pb-rules`: three columns on hairlines, no boxes
- G23 `pg-pb-strip`: a single-row strip
- G24 `pg-pb-merge`: the page's closing CTA with a three-line price list beside it

Switches: page, Paid plan colour (blue, page, black, outline), Price size (40, 56, 72) and the closing CTA below.

## Page content: footers (G25–G37)

`demos/pages-footer.js` and `demos/pages-footer2.js`, group `pg`. Content comes from website: the `nav.ts` footer columns, Solutions from the header, and the blurb, badges, copyright and Markdown line from `Footer.svelte`. Columns are regrouped per variant. The logo is the new `//iframely` from `Header.svelte`: JetBrains Mono, with `//` at 800 in blue and the word at 700. The giant versions are an SVG `<text>` stretched to ten mono cells.

Round 1, after G15, G18 and the user's reference footers:
- G25 the logo as the floor, cut by the edge
- G26 big links on black
- G27 links with three cards (free plan, publishers, Markdown)
- G28 every link with its path, ending on the page path (G15)
- G29 a glow of the four product colours with a ghosted logo
- G30 the logo in Bayer dots
- G31 the home promise and the footer as one blue block

Round 2, own interpretations:
- G32 the site map as a terminal tree
- G33 iframely.com's own preview card
- G34 the footer as an API response (JSON shape is a pun)
- G35 the logo's two slashes as the frame
- G36 provider names as a moving floor (names are a sample)
- G37 the footer printed as a receipt

### Footers: G32 on the light ground (G38–G42)

All five use one colour: ink and grey, with blue only on the prompt and the logo's `//`. Legal is its own group. Its `#anchor` links, plus Status and Trust center, are shown as the paths they would get (`#terms` → `/terms`). The tree branches are drawn in JetBrains Mono because Geist Mono has no box-drawing characters.

- G38 `pg-ft-tree-light`: a white panel
- G39 `pg-ft-tree-page`: printed on the page in two rows of three
- G40 `pg-ft-tree-chart`: one tree across the full width
- G41 `pg-ft-tree-live`: the prompt writes `open https://iframely.com/…` for the hovered row
- G42 `pg-ft-tree-floor`: the tree standing on the giant logo

The Hover switch has four modes: Selection (the row inverted), Arrow (→ in blue, the name in bold), Blue link (underlined, with ↵) and Cursor (a blue block after the name). Until the pointer enters, each card plays a slow demo that hovers one row after another.

Footers: the prototype's "Every page is also available as Markdown: llms.txt · pricing.md · OpenAPI" line is removed from every footer (G25–G42). Where a footer had no Legal column, its bottom row now carries the legal links; elsewhere it shows "Holding the web together since 2012." G27 has two cards instead of three.

### Footer floors (G43) and G42's Floor switch

`demos/pages-footer3.js`. G43 `pg-ft-floors` shows the bottom of G42 (the copyright row and the cut logo) with 17 treatments of the `//iframely` logo:
- **Single colour:** blue `//` with ink word, all ink, all blue, tone on tone, hairline outline
- **Gradient and fade:** fades into the edge, rises out of the ground, blue sinking to the page, blue to ink across, ghost with a crisp edge
- **Pattern:** scan lines, fading halftone, written in itself (rows of small `//iframely` drawn on a canvas, because small SVG text renders with holes)
- **Other:** above and below the line, echo, extruded, sliced and shifted

Switches: Show (group) and Cut (half, as G42, whole). `DEMOS.footerFloor(I, id)` draws any floor, and G42's Floor switch now lists all 17.

## SvelteKit shell and picks (2026-11-06)

The lab is now a SvelteKit 3 app (kit 3, Svelte 5 runes, Vite 8, adapter-static). The demos are unchanged classic scripts in `static/demos/`; SvelteKit only replaces the gallery shell.

```
npm install
npm run dev        # http://localhost:5192
npm run check      # svelte-check
```

Routes:

- `/<page>` is one sidebar page (`/pages`, `/logo`, `/content`…), and `/<page>#<demo>` scrolls to a card. Old `#page` and `#demo` hashes on `/` redirect there.
- `/demo/<name>` is one demo full screen, with prev and next across the whole lab (Alt ← / →) and its Pick button.
- `/favorites` (★ Picks in the sidebar) lists every pick grouped by page: code, title, where it lives, a note you can edit, the date, full-screen and unpick. Picks whose demo was removed are listed under "No longer in the lab". "Show the cards" renders the picked demos live under the table.
- `/index.html` and `/demo.html` are the old static gallery, still working.

Every card has a ☆ Pick button next to its title. Picks are written to `favorites.json` in this folder by the dev server (`src/routes/api/favorites/+server.ts`), so they can be read, diffed and committed. On first run the file is seeded from the `pick:` notes hard-coded in the demos. Without the dev server (a static build) picks fall back to localStorage.

Adding a demo: drop the file in `static/demos/` and add its name to `static/lib/manifest.js` (load order matters for kits: a file that uses `DEMOS.footerKit` comes after `pages-footer`). Pages and their codes still come from `PAGES` and `CODE` in `static/lib/site.js`.

```
src/app.html                    loads Motion, FontLab, demos.js and manifest.js before the app starts
src/lib/lab.ts                  pages, entries with codes (G01…), lookups
src/lib/favs.svelte.ts          picks store: load/seed, toggle, notes, save to the file and localStorage
src/lib/Card.svelte             one card; mounts its demo when it comes within 400px of the viewport
src/lib/PickButton.svelte       ☆ Pick / ★ Picked
src/routes/(shell)/             sidebar layout, /[page], /favorites
src/routes/demo/[name]/         full screen
static/lib/manifest.js          the demo files, in load order
```
