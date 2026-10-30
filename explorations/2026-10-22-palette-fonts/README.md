# Palette, font and block explorations, round 1

2026-10-22. Answers the first three directions in `notes/design-brief.md`: off-white or pastel background with adjusted text, button and link colours; a modern serif for headings; patterns and accent colours on the hero and some blocks.

## The board

`board.html` is a single page that renders the demo homepage copy (all sections, from header to footer) from a token set and lets you switch, live:

- **Palette**: four candidates, below.
- **Heading font**: eight free serifs from Google Fonts, all available in Figma too. A lineup at the top shows the hero headline in every face at once.
- **Body font**: Inter (current), Figtree, Geist.
- **Hero treatment**: soft (page background with the pattern), pastel band, bold accent (the accent colour full-bleed, white text).
- **Pattern**: none, dots, grid, hatch, blobs. Applied to the hero and the two dark bands.

Published copy: https://claude.ai/artifact/QyNHrwSKWJrD6dFn8Uki5W (private until shared). The combination in use is written in the control bar so it can be quoted back ("Paper + cobalt / Instrument Serif / dots / soft").

The hero visual is a static "one URL, four results" stack (D38 option 1) drawn in CSS, so the hero has a shape to carry the pattern and accent. It is a stand-in, not the hero proposal. The Rich Media, Preview API and Publisher Console visuals are CSS mocks for the same reason.

## Palettes

Every palette keeps the logo and re-tints only the mark's blue to the palette's accent. Each defines: page `bg`, muted `bg2`, card `surface`, `line`, three ink steps, `accent` (buttons), `link`, `logo`, a `dark` band colour, and five pastels used on product chips, section tints and mocks.

| Palette | Direction | bg | ink | accent | dark band | pastels |
|---|---|---|---|---|---|---|
| Paper + cobalt | Exa, Weav. Closest to the current brand: warm paper, a cobalt that reads as the Iframely blue. | `#f7f5f0` | `#1c1b18` | `#1f3fe0` | `#1c1b18` | lavender `#e4e3fb`, sky `#d8e7ff`, peach `#fbe3d2`, mint `#dcefe2`, sand `#f6ebc8` |
| Linen + navy | Calendly, Paper Mono. Cooler, navy ink instead of black, a calmer blue. | `#fcfbf8` | `#0b1f3a` | `#1e5ea7` | `#0b1f3a` | lilac `#dccfff`, sky `#c8ddfd`, peach `#ffd9cf`, mint `#c4eee8`, sand `#f5e9c2` |
| Butter + violet | Wispr Flow. Pale yellow page, violet accent, deep green instead of black for the dark bands. The logo moves furthest from blue. | `#fffbe8` | `#1a1a1a` | `#5b47c9` | `#0a4f46` | lavender `#eedcff`, sky `#d8e6ff`, coral `#ffc9b6`, sage `#e1e5cb`, lemon `#fff0a6` |
| Stone + rust | Rulebase, Weave. Warm grey page, rust accent, brown dark band. Blue leaves the palette entirely. | `#efedea` | `#1a1716` | `#e8552f` | `#2a1f1b` | lilac `#e3dcef`, sky `#d6e2ee`, peach `#fbe0d0`, sage `#dfe3d6`, clay `#efd5c3` |

Contrast: every accent on its page background clears 4.5:1 for text except Stone + rust's `#e8552f`, which is 3.6:1 and is used for buttons (white text on rust is 3.9:1); links in that palette use the darker `#b53c1a`.

## Fonts

Free (on the board and in Figma): Instrument Serif, Fraunces, Newsreader, EB Garamond, DM Serif Display, Cormorant Garamond, Hedvig Letters Serif, Young Serif. Sizes are normalised per face so the headline occupies the same space.

Paid candidates that match the references, if the direction is confirmed: ABC Arizona Flare (Exa, Rulebase), Reckless Neue (Tines), Exposure (Dia), Tiempos Headline, PP Editorial New, GT Alpina. See `notes/references.md`.

## Figma

Two copies of the current Home frame sit side by side on the "Explorations" page of the Design 2027 file, each restyled with one combination and keeping the current content and example visuals, the way the legacy pages will:

- Home — Paper + cobalt / Instrument Serif: https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=8-45
- Home — Butter + violet / EB Garamond: https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=12-86

The original "Home" on the "Public" page is untouched. `figma-restyle.md` documents the mapping so any other palette and font pair can be applied the same way.

A second page, "Board: Palettes, patterns, shapes", holds nine palettes with their dark inks and preview strips, fifteen tileable patterns and twenty-four abstract shapes, all as editable vectors. See `figma-board.md`.
