# Motion lab: shader backgrounds, hero compositions and product scenes

2026-10-22. Working demos for the motion questions raised after the graphic-treatment boards: backgrounds with shaders, animation and light pointer interaction; hero compositions on the chosen dither base; and paper.design-style product scenes to sit beside a heading and text block. Plain HTML and JavaScript, no build step, in the Paper + cobalt palette. Type defaults to Instrument Serif, Inter and Geist Mono (JetBrains Mono for terminal and block characters); the Type panel in the top-right corner switches the heading, base and mono faces (see "Type panel" below).

Open `index.html` directly (double-click; it works from `file://`) or serve the folder (`npx serve .`). The gallery has a sidebar with one page per group, so only the demos on the current page run: `#hero`, `#backgrounds`, `#scenes`, `#scenes-pastel`, `#logo`. A demo name in the hash (`index.html#hero-stack`) opens its page and scrolls to it. `demo.html#<name>` shows one demo full screen with prev/next links. Published copy: see the artifact link in the session recap.

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

Licensed faces are added by dropping the files in `fonts/<Family>/` and adding an entry to `fonts/local.js` with `paid: true`; `fonts/README.md` has the format and the list of trials in place (Arizona Flare, Reckless, Tiempos Headline and Fine, Signifier, PP Editorial New, GT Alpina and Fine). Exposure (205TF) and Wulkan Text have no trial yet. The same `fontlab.js` and `local.js` live in the website prototype (`website-prototype/src/lib/fontlab/`), where the panel is a Svelte component on every page with one extra control, "Serif on" (h1 / h1 + h2 / h1 to h3 / off). The lab copy of `fontlab.js` is canonical; copy it over after changes.

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
