# Round 2: Home and product pages (2026-10-26)

Figma: "Design 2027" → page **Round 2: Home + products** (`66:44`).

Built from the Figma "Home" frame (layout, header, logos, images) and the copy and section order of `website` (home, /embeds, /preview-api, /data-api, /publishers).

## What is on the page

| Row | Frames |
|---|---|
| y = 0 | Home A Paper pastel (`71:58`), Home B Color blocks (`74:523`), Home C Ink electric (`76:915`) |
| y = 7200 | Rich Media, Preview API, Data API, Publishers in theme A |
| y = 15000 | the same four, cloned, theme B |
| y = 22800 | the same four, cloned, theme C |
| x = −2300 | R2 Kit (`67:44`): Logo, R2 Button, R2 Chip, R2 Header, R2 Footer, R2 Product card, six scene components |

## Theme

Variable collection **R2 Theme** with three modes. Every fill, text colour, heading family/style/size is bound, so a frame switches direction by changing its mode.

| | A Paper pastel | B Color blocks | C Ink electric |
|---|---|---|---|
| Ground / ink | #f7f5f0 / #1c1b18 | #f6f2ea / #16140f | #f3f1ec / #111111 |
| Accent | cobalt #1f3fe0 | cobalt #1f3fe0 | electric indigo #3b2bff |
| Pop | peach #ff8a6b | tangerine #ff5b2e | lime #d4ff3f |
| Dark blocks | ink | cobalt | near-black |
| Products (rich / preview / data / pub) | pastels | saturated | lilac, ice, lime, apricot |
| Headings | Instrument Serif 84/52, italic emphasis | Fraunces 68/42, italic emphasis | Bricolage Grotesque Medium 66/40, colour emphasis |

## Product scenes (static, to animate later)

`Scene / One URL, four results`, `Rich Media embeds` (player, TikTok post, map), `Preview chat and doc`, `Data access` (page scan + access decisions), `Publisher console` (requests by agent, policy popover), `Terminal check`. Product pages add inline scenes: card themes (Rich), policy by path and before/after card (Publishers).

## Hero patterns (optional, light)

A dot grid fading in from the left; B scallop edge + dash field; C halftone wings. Product heroes: Rich dot grid, Preview ripples, Data halftone, Publisher line grid. CTA blocks use ripples (A, product pages), a pill field (B) and halftone (C).

## Round 3 (same day): original palette, 1240 content

Feedback: round 2 too colourful; prefer the original mockup's colours, pastel backgrounds and secondary accents allowed, contrast colour blocks allowed; content width 1240.

New "R2 Theme" modes: D White + blue (Instrument Serif, pink accent), E Blue contrast (Geist SemiBold, yellow accent, cobalt contrast blocks), F Ink + blue (Newsreader, soft pink accent, black contrast blocks). All share #fff ground, #f6f6f6 bands, #0a0a0a/#666 text, #0055ff accent, faint product tints, and the original white → #f6f6f6 → #eaeff8 hero gradient (D, F).

Frames at x ≥ 6400, 1440 wide with 100px gutters (1240 content), columns every 1600px: Homes D `85:3466` (A layout), E `85:4168` (B layout, black CTA), F `85:4852` (C layout); product pages in D (y 7200), E (y 15000), F (y 22800). Round 2 frames are untouched at 1320.
