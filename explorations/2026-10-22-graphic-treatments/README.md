# Graphic treatments, terminal graphics, logo refresh

2026-10-22, same day as the palette round. The team shared three references and asked for more examples in that spirit: a mono marquee on a dark hero that decays into scattered letters with inverted blocks; a flat two-colour pattern of interlocking wave teeth (cobalt on pink); and the Paper Mono type specimen (outlined glyphs with bezier handles, a dotted halftone shadow, grid paper, metric labels 955 / 710 / 509 / 0 / −245 and 606 at every advance). Then: terminal-based graphics on another board, and logo proposals on a third.

Everything is on three new pages of the Figma file Design 2027 (`VmgHd0uy7JfPNckK470cHJ`), all editable vectors and real text, drawn in the Paper + cobalt palette from `../2026-10-22-palette-fonts/README.md`. Tiles are 720 × 420 with a title and a one-line use note under each.

## Page "Board: Graphic treatments" (`22:44`)

Three frames side by side.

| Frame | Node | Link |
|---|---|---|
| Type as texture | `22:45` | https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=22-45 |
| Bold shapes | `23:44` | https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=23-44 |
| Blueprints and specimens | `23:226` | https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=23-226 |

### Type as texture (Geist Mono)

| Tile | Node | What it is | Suggested use |
|---|---|---|---|
| A1 Marquee decay, dark | `22:52` | Product claims as a mono marquee on ink, rows fading, dissolving into scattered letters with inverted blocks where the paper begins; serif headline on the paper | Hero, dark CTA band |
| A2 Marquee decay, light | `22:224` | Same decay on paper with cobalt highlight blocks, rising from the bottom edge | Light hero |
| A3 Ticker band | `22:408` | FETCH · PARSE · RENDER · SIGN · DELIVER at 84px on cobalt: solid, outlined, pink rows, clipped | Divider, pricing teaser |
| A4 Word grid | `22:416` | Letter grid at 24% ink with product words found in it (cobalt and ink cells) | Data API, trust row |
| A5 Log stream | `22:525` | Request log with endpoints, status codes in cobalt, latency, result type, fading | For automated systems, status, docs |
| A6 ASCII dither | `22:548` | Sphere and floor shaded by character density, one text node; headline over the sparse side | Hero alternative, 404 |

The marquee copy is a list of claims (`ONE URL IN · FOUR RESULTS OUT · OEMBED RESOLVED · …`) rotated per row; the scattered letters are individual text nodes placed on a 9.1px column grid, so they can be thinned or recoloured by selection.

### Bold shapes (single SVG paths, accent on one pastel)

| Tile | Node | Pastel | Note |
|---|---|---|---|
| B1 Wave teeth | `23:52` | pink | Interlocking S-ramps: a row of pink islands in the cobalt field, a hanging cobalt row, a floating cobalt row; headline in the field. Closest to the reference |
| B2 Scallops | `23:84` | lavender | Scalloped edge, discs, half-discs |
| B3 Loops | `23:116` | mint | Three overlapping pill rings (cobalt, ink, cobalt) |
| B4 Slashes | `23:125` | sand | The two slashes of https:// at poster scale |
| B5 Quarter-circle quilt | `23:139` | peach | Random quarter circles on a 90px grid, some cells empty |
| B6 Zigzag | `23:168` | sky | Rounded zigzag edge plus a pink zigzag line |
| B7 Pills | `23:176` | paper | Rows of pills of random length, one per URL |
| B8 Four blocks | `23:212` | cobalt field | The four products as cascading pastel slabs with mono labels |

### Blueprints and specimens

| Tile | Node | What it is |
|---|---|---|
| C1 Bezier specimen | `23:234` | "iframely" in Geist Mono flattened to an outline with its real vertices (ink squares) and tangent handles (cobalt circles) read from the vector network; cobalt halftone shadow (dot grid masked by a flattened copy); 60px grid; 710/606 advance labels; note box |
| C2 Glyph sheet | `23:449` | "4 Formats" as cobalt outline glyphs with a solid 7px offset shadow between two ruled bands, metric lines 955 / 710 / 509 / 0 / −245 and 606 at each advance. The reference image, with our numbers |
| C3 Preview card blueprint | `23:508` | Link preview as a dimensioned plan: og:image, og:title, og:description, favicon leaders; 1200 × 630, radius, padding |
| C4 Request lifecycle | `23:553` | URL → fetch → parse → sign → embed on a timeline with timings, a "cached 24 h" bracket, sources per step |
| C5 Headline with halftone | `23:602` | Instrument Serif headline on a ruled sheet with a cobalt halftone shadow and registration crosses |
| C6 Window wireframe | `23:631` | Browser window as a selected object: handles, dimension pill, dashed embed slot, cursor |
| C7 Halftone sphere | `23:661` | Sphere shaded by dot size on a 14px grid, one path |
| C8 Embed anatomy | `23:671` | The iframe tag beside its dimensioned frame, attributes called out |

Halftone and offset shadows are made by cloning the text, flattening the clone, and using it as a mask over a dot-grid path (or filling it solid). The outline in C1 and C2 is the flattened text with no fill and a stroke, so the wording can only be changed by regenerating (recipe under "How they were made").

## Page "Board: Terminal graphics" (`25:44`)

Frame "Terminal graphics" `25:45`: https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=25-45

JetBrains Mono (it has box-drawing and block glyphs; Geist Mono does not reliably). Terminal palette on ink: paper text, dim `#8a857c`, blue `#7b93ff`, green `#8fd3a8`, red `#ff8a7a`, yellow `#f2d58a`, pink `#f5b8cc`, sky `#bcd3ff`. Each tile is one text node with range colours, so copy and colours are editable in place.

| Tile | Node | What it is | Suggested use |
|---|---|---|---|
| T1 curl window | `25:53` | Terminal window on paper: a curl request and the real JSON response (keys sky, strings sand, numbers pink) | Developer hero, Data API |
| T2 TUI preview | `25:65` | The product as a text UI: URL field, preview panel with shaded image slot and play mark, data panel, key hints | Dark hero, "Check a URL" |
| T3 Figlet wordmark | `25:71` | IFRAMELY in block characters with a stippled shadow, version line, prompt | About, changelog, 404 |
| T4 Check sequence | `25:79` | `npx iframely check <url>` as an install-style log: ticks, cross, spinner, progress bar, result | For automated systems; animates line by line |
| T5 Diff view | `25:85` | Unified diff: bare link removed (pink), signed iframe added (mint) | Rich Media, "what changes" |
| T6 Status dashboard | `25:103` | Box-drawn panels with block-element sparklines and a live log | Status page, trust row |
| T7 Man page | `25:109` | IFRAMELY(1): NAME, SYNOPSIS, DESCRIPTION, OPTIONS mapped to the four products | Docs landing, about |
| T8 URL rain | `25:115` | Columns of URL characters with bright heads over CRT scanlines, serif headline on a translucent band | Dark hero, CTA band |

## Page "Board: Logo refresh" (`25:169`)

Frame "Logo refresh" `25:170`: https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=25-170

The current logo (from the live site's `src/lib/components/logo/logo.svelte`): a 24px disc in `#0055ff` with a white glyph of two chevrons, each with one arm shortened so the pair reads as a broken ‹ ›, and a 79 × 16 custom wordmark with slab serifs on i, f, r and l. Each card changes one thing.

| Card | Node | Change | Why |
|---|---|---|---|
| L0 Current | `25:181` | Reference at 56px | |
| L1 Re-tint only | `25:191` | Disc to cobalt `#1f3fe0`, glyph to paper, wordmark to warm ink | Minimum change; sits on the off-white page |
| L2 Bare glyph + Geist | `25:201` | Drop the disc; chevrons alone, wordmark in Geist Medium, −2.5% tracking | Containers read as app icons; a bare glyph reads as a brand |
| L3 Monoline chevrons | `25:209` | Redraw as rounded monoline strokes (solid pair; broken pair kept as an option) | Consistent weight, survives 16px |
| L4 Serif wordmark | `25:219` | Bare glyph + Instrument Serif wordmark | Ties the logo to the new heading face |
| L5 Mono wordmark | `25:227` | Disc + Geist Mono Medium wordmark + cobalt block cursor | Developer-tool reading; docs, console, terminal direction |
| L6 Dot hook | `25:237` | Wordmark only, Geist SemiBold, the dot of the i as a cobalt disc; chevrons to the favicon | One gesture carries the colour |
| L7 Squircle and chip | `25:246` | Glyph on a cobalt squircle (app-icon contexts); ink glyph on a pink chip | Pastel system applied to the mark |
| L8 On ink | `25:258` | Paper disc, ink glyph, paper serif wordmark; light cobalt `#7b93ff` as the dark-surface accent | Cobalt disappears on ink |
| L9 Favicon sizes | `25:269` | Disc and bare glyph at 16 to 64 | Disc holds at 16; bare glyph needs L3 below 24 |
| H1 Header, serif lockup | `25:310` | 1160 × 72 header with L4 | |
| H2 Header, Geist lockup | `25:323` | Same with L2 | |

Recommendation: L2 or L4 for the site (bare cobalt glyph, wordmark in the body or heading face), L3's monoline redraw for the favicon and small sizes, L7's squircle only where an app icon is required. L1 if the team wants no visible change beyond colour.

Rule from the team (2026-10-22): every change to the logo is added as a new variant; existing cards are not edited. Later rows on the board:

| Card | Node | What |
|---|---|---|
| L10 Case, Geist | row `33:104` | Full unbroken chevrons with "iframely" and "Iframely" in Geist Medium; lowercase proposed |
| L11 Case, Instrument Serif | row `33:104` | The same pair in the heading serif |
| L12 Full chevrons, containers | `34:106` | The unbroken ‹ › glyph bare with the Geist wordmark, on the cobalt disc, on the squircle, in ink on a pink chip, in paper on ink |
| L13 Full chevrons, favicon sizes | `34:126` | Disc and bare at 16 to 64 |
| L14 Joined arms with an overlap shadow | `35:46` | The original four arms with the gaps closed: the short arm of each chevron extended under the long arm, a deep-blue-to-cobalt gradient where it emerges reads as a shadow; bare, disc, on ink, on pink |
| L15 Joined arms, detail | `35:75` | The same at 160px and on the squircle |
| L16 Crop marks with a dot | `37:46` | Two corner brackets framing a dot: the URL in its frame, the blueprint registration marks |
| L17 Brackets holding an embed | `37:71` | Square brackets with a filled block between them |
| L18 Chevrons with a dot | `37:97` | The current chevrons whole, with the URL as a dot between them |
| L19 The two slashes | `37:122` | The // of https:// |
| L20 Two frames, interlocked | `37:143` | Chain-linked rounded frames: holding the web together |
| L21 Aperture | `37:173` | A solid square with an offset window and a crescent of shadow |
| L22 One to four | `37:208` | A dot and three tiles: one URL, four results |
| L23 The stitch | `37:243` | A square held by a diagonal seam of stitches |
| L24 The arch | `37:278` | An arch over a dot |
| L25 Lineup at 24px | `37:303` | All nine plus the full chevrons at favicon size |
| L26 Joined arms, light overlap, detail | `38:46` | L15 with the fold lit instead of shadowed: the short arm fades to pale cobalt where it passes under |
| L27 Joined arms, light overlap, in use | `38:62` | Bare with the wordmark, on disc, on ink, on pink |
| L28 Four parallelograms, construction | `41:46` | Each arm a true parallelogram with vertical cuts; the arms of a chevron overlap in a triangle at the tip, which is a flat vertical edge. Exploded, solid union, hairline seams, two-tone |
| L29 Four parallelograms, light overlap, in use | `41:74` | The same with the lit fold, in a lockup, at 32/20/16, on disc, on ink |
| L30 ASCII candidates, Geist Mono | `44:46` | `://` `%` `&` `#` `{}` `«»` `*` `~` `->` as marks, with their URL meanings |
| L31 ASCII candidates, Instrument Serif | `44:69` | The same glyphs in the heading serif |
| L32 Four ASCII lockups | `44:93` | `://`, `%`, `#`, `«»` beside the wordmark |
| L33 Two built from glyph logic | `44:106` | A drawn percent (i-dot, slash, dot) and a drawn scheme separator (colon and two slashes at the chevron weight) |
| L34 Exploded, bolder arms | `45:46` | The L28 exploded construction (team: "close to what I meant") at arm weights 4.2, 5.0, 5.8 of 24; two-tone and single-colour fold |
| L35 Exploded, bold, in use | `45:84` | Weight 5.0: lockup, 32/20/16, disc, on ink, cobalt over pink |
| L36, L37 //iframely in mono fonts | `46:46`, `46:69` | The wordmark alone, slashes in cobalt, in 17 mono families Figma has (Geist Mono, JetBrains Mono, IBM Plex Mono, Martian Mono, Fira Code, Space Mono, Roboto Mono, Source Code Pro, DM Mono, Inconsolata, Red Hat Mono, Ubuntu Mono, Azeret Mono, Courier Prime, Overpass Mono, Spline Sans Mono, Chivo Mono); Commit Mono, Berkeley Mono and Noto Sans Mono are not installed |
| L38 //iframely, Geist Mono study | `46:91` | Regular, Medium, Bold; −4% and 0% tracking; with a space |
| L39 //iframely in use | `46:106` | Header bar, 18px, reversed on ink |
| L40 Exploded, connected, overlap shown | `47:46` | L34 corrected per the team: each arm's tip cut along the other arm's outer edge (no leftover slivers), the overlap drawn as a visible third tone; two-tone and one-hue at 150px, offsets 0.9 / 1.4 / 2.0 |
| L41 Exploded, connected, in use | `47:90` | Lockup, 32/20/16, disc, on ink, cobalt over pink with a plum overlap |

Similar-logo check (2026-10-22): the current mark sits in the family of generic "code" icons (angle brackets in a circle or badge, as in icon sets) and shares its blue-parallelogram construction with Flutter's mark; AMD, Chevron and Citroën own chevron pairs in other categories. No direct competitor uses a chevron-pair mark that we could find; Embedly's is not bracket-based (unverified). Implication: a full ‹ › without a distinctive detail collapses into the stock code icon, so keep the fold, the dot or the parallelogram seam.

Each alternative card (L16 to L24) shows the mark in a lockup with the Geist wordmark, at 32, 20 and 16px, and on an ink or pink chip.

## How they were made

Plugin API scripts via the Figma MCP. Text tiles: `createText` with range fills (`setRangeFills`) and range fonts for bold; box-drawing panels are generated by a `box(title, width, lines)` helper that pads lines so borders align. Shapes: `createNodeFromSvg` with a single `<path>` per tile. Specimens: `figma.flatten([textClone])` for outlines and masks; `vectorNetwork` for the bezier handle overlay.

Gotchas added this round: `resize()` on a text node sets `textAutoResize` to `NONE`, so set `HEIGHT` after resizing (captions were clipped until fixed); the mask must be the bottom child of its group; use JetBrains Mono for anything with `┌ ─ │ ▒ █ ▁▂▃`.
