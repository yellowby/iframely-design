# Restyling the Figma Home frame

How the two variants on the "Explorations" page of Design 2027 were produced on 2026-10-22, so the same treatment can be applied to any palette and font combination, or to the legacy pages that keep their content.

File key `VmgHd0uy7JfPNckK470cHJ`. Page "Explorations" `8:44`. Frames:

| Frame | Node | Combination |
|---|---|---|
| Home — Paper + cobalt / Instrument Serif | `8:45` | Palette A, Instrument Serif Regular headings |
| Home — Butter + violet / EB Garamond | `12:86` | Palette C, EB Garamond Medium headings |

The original "Home" (`1:102`) on the "Public" page is untouched.

## What the restyle does

Everything runs as Plugin API scripts through the Figma MCP `use_figma` tool, on a clone of the Home frame.

1. **Colour mapping** over every visible node (fills and strokes):
   - Frame fills: white on page-sized frames (width 1000 or more) to `bg`; white on smaller frames to `surface`; `#f6f6f6`, `#f5f5f5`, `#ebebeb` to `bg2` (the header, page-wide, to `bg`); the hero's white-to-grey gradient to `bg`.
   - Text fills: `#000`, `#1f1f1f`, `#333`, `#3d3d3d` to `ink`; `#666` and black at 72 to 80% to `ink2`; black at 60% to `ink3`; `#05f` to `link`.
   - Vectors (icons, logos): `#05f` to `accent` (this re-tints the logo mark), `#666` to `ink2`, `#000` to `ink`. Provider and brand colours untouched.
   - `#05f` rectangles (the uptime bars) to `accent`; `#05f` at 8% tints to `accent` at 10%.
   - "Buttons / Button" instances: black fill to `accent`; black 12% fill to `surface` with a 1px `line` stroke.
   - Strokes: black at any opacity to `ink` at the same opacity; `#e0e0e0`, `#dbdbdb` to `line`.
   - Images, gradients inside the example panels and brand colours are left alone, so the examples keep their look.
2. **Bands** as absolute-positioned rectangles inserted at the back of "Frame 855": a peach tint behind the Rich experiences row, a mint tint behind the Publisher-aware row, and the `dark` colour behind the "Start with a URL" row, whose texts move to `onDark` / `onDark2` and whose buttons invert.
3. **Hero pattern**: the API rejects pattern paints, so the dot grid is one SVG path (a 2px circle every 18px over 1320 by 384) imported with `createNodeFromSvg`, placed absolute at the back of the hero, plus a rectangle with a radial gradient from the page colour (opaque at the centre) to transparent at the edges, so the text area stays clean and the dots frame the hero.
4. **Fonts**: Martian Grotesk at 16px and above becomes the serif at 1.15 times the size (24 to 28, then bumped to 32 for section headings; 48 to 55 for the hero), with -0.5% to -1.5% tracking and 108% line height. Martian Grotesk under 16px (nav, button labels, eyebrows) becomes Inter Regular / Medium / Semi Bold by weight. Martian Mono becomes Geist Mono. Whole-node `fontName` assignment works even though Martian Grotesk is not installed; range assignment does not, so mixed-size nodes get the whole-node swap.
5. **Variant B** is a clone of A with an exact colour-to-colour remap (A's token values to C's) and the serif swapped. The dark band is remapped by node name because `dark` and `ink` share a value in palette A.

## Token values used

| Token | A: Paper + cobalt | C: Butter + violet |
|---|---|---|
| bg | `#f7f5f0` | `#fffbe8` |
| bg2 | `#efece5` | `#f6f0d6` |
| surface | `#fffdf9` | `#fffdf4` |
| line | `#e3dfd6` | `#e7e0c2` |
| ink / ink2 / ink3 | `#1c1b18` / `#5b5750` / `#8a857c` | `#1a1a1a` / `#56544b` / `#878476` |
| accent / link | `#1f3fe0` / `#1a35c4` | `#5b47c9` / `#4b39b3` |
| dark / onDark / onDark2 | `#1c1b18` / `#f7f5f0` / `#b9b4a9` | `#0a4f46` / `#fffbe8` / `#a6cdc4` |
| peach band / mint band | `#f9ede3` / `#eaf2e9` | `#ffe5d2` / `#f0f0da` |

Linen + navy and Stone + rust values are in `README.md`; applying them is the same remap with those values.

## Known limits

- Fonts must exist in Figma. The Google serifs on the board all do; Martian Grotesk does not, which is why small Martian Grotesk text was moved to Inter rather than left as a missing font.
- The restyle keeps the current content and visuals. New blocks from the plan (four product cards, Data API block, trust row) are on the HTML board only.
- Section heights were not re-flowed; the serif at 108% line height fit every fixed text box (checked: no serif node has a fixed-size box).
