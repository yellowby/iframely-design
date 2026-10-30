# Figma board: palettes, patterns, shapes

Built 2026-10-22 on the page "Board: Palettes, patterns, shapes" (`16:44`) in Design 2027. Three frames side by side, all editable vectors and text, no images.

| Frame | Node | Link |
|---|---|---|
| Palettes | `16:45` | https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=16-45 |
| Patterns | `17:44` | https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=17-44 |
| Shapes | `18:44` | https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=18-44 |

## Palettes (nine)

Each card has four groups of labelled swatches with hex values, then a preview strip on the page colour: serif headline and body in the two dark inks, primary and secondary buttons, a link, the five pastel chips, a dark block with its own text pair and inverted buttons, and a product card on the surface colour.

Dark text colours per palette: `ink`, `ink 2`, `ink 3` for text on light surfaces, and `dark` as the block colour with `on dark` and `on dark 2` for text on it.

| Palette | Page | Ink | Dark block | Accent | Direction |
|---|---|---|---|---|---|
| Paper + cobalt | `#f7f5f0` | `#1c1b18` | `#1c1b18` | `#1f3fe0` | Exa, Weav; closest to today |
| Linen + navy | `#fcfbf8` | `#0b1f3a` | `#0b1f3a` | `#1e5ea7` | Calendly, Paper Mono |
| Butter + violet | `#fffbe8` | `#1a1a1a` | `#0a4f46` | `#5b47c9` | Wispr Flow |
| Stone + rust | `#efedea` | `#1a1716` | `#2a1f1b` | `#e8552f` | Rulebase, Weave |
| Mist + forest | `#f3f6f7` | `#0f2a2e` | `#10322f` | `#1f6f5b` | cool, technical |
| Sand + electric | `#f6f1e7` | `#231f1a` | `#231f1a` | `#0040ff` | keeps the Iframely blue |
| Blush + plum | `#fcf3f0` | `#2a1b21` | `#3b1d33` | `#4f46e5` | Slite, Weav pink |
| Sage + charcoal | `#f2f4ee` | `#1e221c` | `#1f2a24` | `#2f6df6` | green-grey |
| Lavender + midnight | `#f5f3fb` | `#171433` | `#1c1740` | `#5b3df5` | Tines purple, softened |

The first four match the HTML board's palettes; the other five are new. Full values, including the muted band, surface, hairline, link and the five pastels, are on the cards.

## Patterns (fifteen)

360 by 220 tiles on the paper colour, each one vector path in ink at low opacity (accent for the halftone, sparkles and routes), so recolouring is one fill change. Dot grid 16, dot grid sparse 28, line grid 32, registration crosses 48, hatch 10, ledger rules 14, waves, ripples, halftone 14, node graph, circuit traces, sparkles, chevron flow, isometric grid, dashed routes. Captions suggest a section for each.

## Shapes (eighteen concept, six section)

260 by 200 tiles on the surface colour, ink outline with pastel fills from Paper + cobalt. Concept shapes: one URL four results, link, fetch loop, agent, signed, permission, decision, card stack, data object, preview card, pipeline, signal, sparkle, blob mask, network, window, paste, pulse. Section shapes: arch, quarter circle, pill, cut corner, half circle, squircle.

## How they were made

Plugin API scripts through the Figma MCP: auto-layout frames for the cards and grids, `createText` with Instrument Serif, Inter and Geist Mono, and `createNodeFromSvg` for every pattern and shape (the API rejects pattern paints, so textures are single paths). SVG gotcha: an element may carry one `stroke-width` only; a duplicate attribute makes the whole SVG fail to import.
