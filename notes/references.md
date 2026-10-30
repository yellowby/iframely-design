# Reference sites: what they actually use

Extracted 2026-10-22 from each site's HTML and CSS (font-face declarations, colour tokens, most-used hex values). Fonts marked "paid" need a licence; "free" are open or Google Fonts.

| Site | Heading font | Body font | Mono | Background | Ink | Accent and pastels |
|---|---|---|---|---|---|---|
| exa.ai | ABC Arizona Flare (serif, Dinamo, paid); Reckless also loaded | ABC Diatype (paid); Aeonik, Suisse Intl | Geist Mono | cream `#faf9f7`, darker `#f0ece8` | `#111827`, `#181818` | brand blue `#1f40ed`, faint `#e7ebfd` / `#c6cfff`, teal `#20808d`, yellow `#fef3c7`, sky `#dbeafe`, purple `#ede9fe` |
| wisprflow.ai | EB Garamond (serif, free) | Figtree (free) | IBM Plex Mono, Monaspace Neon | pale yellow `#ffffeb`, `#fffdf9`, `#f5f4f0` | `#1a1a1a` | lavender `#f0d7ff`, sage `#e4e4d0`, deep green `#034f46`, coral `#ff6c4c`, violet `#886dc2` |
| slite.com | Garnett (sans, paid) | Roboto | Geist Mono | peach cream `#f9efe4`, `#f0e4d6` | `#1d1e20` | pink `#ffd2e1` / `#ffbda6`, sand `#ffe697`, sky `#7fd1fe`, blue `#176ae5` / `#0f57db` |
| tines.com | Reckless / Reckless Neue (serif, Displaay, paid) | Roobert (paid) | Roobert Mono | `#fcf9f5` | `#000` | purple `#8d75e6`, pink `#e269a4`, green `#25a871`, orange `#f47e3f`, teal `#04b9ad`, blue `#4e8fd0`; full 25 to 900 scales per hue |
| relume.ai | Relative (sans, paid) | Geist (free) | Geist Mono | `#f1f0ee`, `#e4e2df` | `#161616`, `#101010` | purple `#6248ff`, yellow `#ffb02e`, red `#ff4848`, orange `#ff7448`, magenta `#ff29f6` |
| calendly.com | Wulkan Text (serif, paid) | Calendly Sans, Geist | | linen `#fcfbf8`, `#f5f5f7` | navy `#071a31`, `#0c2d54` | blue `#1e5ea7`, lilac `#d4c2ff`, peach `#fedfda`, sky `#c1defe`, mint `#baf0ec`, salmon `#ffb4a6` |
| rulebase.co | ABC Arizona Flare Light (serif, paid); STK Bureau Serif | ABC Diatype, Inter, Hedvig Letters Sans | Geist Mono | warm grey `#efedeb`, cream `#f7f7f4`, card `#e8e5e3`, tile `#e4e1df`, border `#d9d7d5` | `#1e1e1e`, `#1a1716` | orange `#ff4f00` / `#d85210`, red `#cc3542`, green `#0d6220` |
| diabrowser.com | Exposure (variable serif, 205TF, paid) | ABC Oracle (paid) | ABC Favorit Mono | `#fbfaf6`, `#f8f8f8` | `#000` at 85% | red `#fa3d1d`, blue `#0358f7`, yellow `#ffb005`, pink `#fd02f5`, lilac `#e1e1fe`, "creamsicle" gradient `#fff1ac` to `#ff6f3c` |
| contentarchitecture.dev | Geist (sans, free) | Geist | Geist Mono | off-white `#f1eee7` | `#232323` | orange `#ff9100`, navy `#0000a8`, greys `#5b5a56` / `#cbcbcb` / `#dedede` |
| weaveos.com | Geist (free) | Geist | | `#f3f1eb`, `#eeecea` | `#1c1513` | rust `#e8552f`, brown `#54251f`, `#7e746d` |
| weav.com | STK Bureau Sans (paid), Inter Tight | Inter | Geist Mono, Fragment Mono | `#e7e7e2`; blue page `#2052eb` | `#262320` | blue `#2052eb`, pink `#fadbe5`, green `#bff3a5`, peach `#f7dbc3`, aqua `#a5f0f3`, orange `#ff5a15` |
| steep.app | Signifier (serif, Klim, paid) for display | Söhne (variable, Klim, paid) | system mono | near-white grey `#f7f7f8`, white `#fff` cards, `#ececec` lines | `#121212`, body `#4c4c4c`, `#888` muted | primary blue `#2f6fe5`, light blue `#e9f1fe` / `#d3e3fc`; pastel pairs light/dark per hue: purple `#f2edfc` / `#4d2f87`, green `#e6f4eb` / `#2b552c`, red `#f9eeeb` / `#753521`, yellow `#f8f5e2` / `#6f4e17`, peach `#fbe1d1` / `#5d2a1a`, navy `#194168` / `#174d80` |
| paper.design/mono | Paper Mono (custom) | Paper Mono | | `#f6f6f3`, card `#f1f1ee` | `#222` | blue `#4c94fc` / `#81acec`, pale `#cfdff5` |

## What the set has in common

- **Background** is never pure white: warm off-whites between `#f1eee7` and `#fcfbf8`, or a pale tint (yellow at Wispr Flow, peach at Slite). Cards and muted bands sit one step darker or lighter than the page, not grey.
- **Ink** is a warm near-black (`#1a1a1a`, `#232323`, `#262320`, `#1a1716`) rather than pure black or cool grey.
- **One strong accent** carries buttons and links: a vivid blue (`#1f40ed`, `#2052eb`, `#0358f7`, `#1e5ea7`) or a hot orange (`#ff4f00`, `#e8552f`, `#ff9100`). Iframely's `#05f` sits in the first group.
- **Pastels** do the block work: lavender, sky, mint, peach and sand as section backgrounds, card fills, tag fills and masks. Tines and Slite carry full tonal scales per hue.
- **Serif display** at the sites liked for type: ABC Arizona Flare (Exa, Rulebase), Reckless (Tines), Exposure (Dia), Wulkan Text (Calendly), EB Garamond (Wispr Flow). All sit on a plain geometric or grotesque body face (Diatype, Roobert, Oracle, Figtree, Geist) and a mono for code.

## Serif candidates for Iframely headings

Paid, in the spirit of the references:

| Font | Foundry | Used by | Note |
|---|---|---|---|
| ABC Arizona Flare | Dinamo | exa.ai, rulebase.co | The face behind two liked sites. Light and Regular weights carry the look. |
| Reckless Neue | Displaay | tines.com, exa.ai | Softer, more editorial. Variable. |
| Exposure | 205TF | diabrowser.com | Variable "exposure" axis, from thin to inked. Distinctive. |
| Wulkan Text | | calendly.com | Calmer, text-oriented. |
| Tiempos Headline, Signifier | Klim | | Established editorial choices. |
| PP Editorial New | Pangram Pangram | | Close to Arizona's feel; free trial weights exist. |
| GT Alpina | Grilli Type | | Lively, many styles. |

Free, renderable in Figma and in browser prototypes today (Google Fonts unless noted):

| Font | Character | Closest paid reference |
|---|---|---|
| Instrument Serif | high contrast, condensed, very current | Arizona, Editorial New |
| Fraunces | soft, "wonky" optical axis, warm | Reckless |
| Newsreader | editorial, optical sizes, calm | Tiempos |
| EB Garamond | classic old-style, what Wispr Flow uses | Wulkan Text |
| DM Serif Display | high contrast, sharp | Signifier |
| Hedvig Letters Serif | compact, friendly | |
| Spectral, Source Serif 4, Literata | text serifs, safe | |
| Gambetta, Erode, Sentient, Zodiak (Fontshare, free licence) | modern, characterful; not on Google Fonts, need self-hosting | Arizona, Reckless |

## Patterns and visuals noted

- Masks over screenshots and illustrations (Relume, Weav): rounded or blob-shaped clipping with a pastel fill behind.
- Shapes as section furniture (Calendly, Weav): large rounded rectangles and pills in pastel, sometimes with a diagonal cut.
- Grid as a surface (Paper Mono): a visible dotted or dashed grid behind blocks, cards snapped to it. Liked, apart from the low contrast.
- Gradients used sparingly (Dia's creamsicle, Exa's faint brand tints) rather than as full backgrounds.
- Mono type as a secondary voice (Geist Mono almost everywhere) for labels, eyebrows and data.

- **Baked blurred-blob backgrounds (steep.app)**: the hero and section backgrounds are JPEGs (2900 × 1760 and 2000 × 2000) of three or four very soft radial colour blobs, lilac, coral, pale yellow, blue to violet, on a near-white ground, served through next/image at several widths. The grain comes from the compression and the softness from the blur, so there is no runtime shader; the effect is the same family as our B06 Pastel blobs, frozen. Cheap, deterministic, and it survives reduced-motion settings; the trade is that it cannot react to the pointer.
- **Chip pairs (steep.app)**: every pastel comes with a dark partner of the same hue (light purple with dark purple text, light green with dark green), so tags, badges and small cards stay readable without borders. Our palette has the pastels but not yet the dark partners; worth adding six.
- **Simple graphics in blocks (steep.app)**: feature blocks hold one flat SVG shape or icon on a pastel square, a product screenshot on white, or a chat-style card with a small portrait; nothing illustrative. Logos in a marquee strip.
