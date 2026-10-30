# Home — fresh explorations (2026-10-26)

Figma "Design 2027" → page **Home — fresh explorations** (`89:63`). Started from scratch at the user's request: no earlier boards or round 2/3 pieces as inspiration. White or light-grey body, #0055ff accent, 1240 content in 1440 frames. The original Home mockup (`1:102`) is the only reference: its logo, customer logo strip, provider icons and media images are reused. Copy follows `website-prototype` home.

| Frame | Idea | Type |
|---|---|---|
| `90:50` 1 · URL-first | Hero is a URL field ("Check URL") over a live result panel with one tab per product; 2×2 product cards with mini UIs; four-step "how it works"; dark access panel for the Data API; console table for publishers; blue CTA with a URL field | Geist SemiBold + Inter |
| `92:102` 2 · Proof wall | Editorial left-aligned hero; a wall of real embeds (YouTube, Spotify, GitHub, TikTok, Figma, map, Vimeo, X) bleeding off both edges; spec table of the four products; four numbered chapters with visuals; serif quote band | Instrument Serif + Inter, light-grey body |
| `94:154` 3 · Two sides of the URL | Diagram: your product ↔ one URL ↔ the publisher; product-team cards; full blue publisher block with a policy table; numbers; trust 2×2; split CTA (building a product / publishing content) | Instrument Sans SemiBold + Inter |

Shared components on the page: `Logo` (`89:70`), `Footer` (`89:71`).

## Explorations 4–6: prototype structure, blobs and patterns

Feedback on 1–3: "good start". Next round: follow the prototype's text and structure, and try colour blobs or gradients in the hero and other blocks, plus some patterns.

All three follow the prototype home section by section: hero (tagline, h1 "Iframely makes URLs work *inside other products*", sub, Get an API key / Check a URL, hero stats), "Connecting developers and publishers, one URL at a time" with four product cards, then Rich Media, Preview API, Data API and Publisher Console (text on the left, visual on the right), Trust (four cards and logos), Pricing, CTA "Start with one URL", footer.

| Frame | Idea | Type |
|---|---|---|
| `98:206` 4 · Aurora (x 4800) | White hero with soft blurred blobs (blue, cyan, violet, pink) and a fading dot pattern; split hero with a stacked visual; product cards with corner glows; Data API on a gradient band with dots; blue gradient CTA with blobs | Geist SemiBold + Inter |
| `99:481` 5 · Sky (x 6400) | Centred hero on a pale-blue sky gradient with a fading 48px line grid and blobs; a glass panel shows one URL splitting into three results; product cards with a gradient top bar; deep navy-to-blue Data API band with concentric arcs; sky CTA with arcs | Hanken Grotesk SemiBold + Inter |
| `102:723` 6 · Prism (x 8000) | Light-grey body; large serif centred hero; four colour blobs behind a frosted-glass panel: one URL → four coloured beams → the four products; each feature sits in a rounded white card with its own blobs or hatch; ink Data API card with a plus grid and blobs; Trust over a plus grid; hatch in pricing cards; white CTA with a plus grid and four blobs | Instrument Serif (italic blue emphasis) + Inter |

Visual components shared by 4–6 (left of the frames, x ≈ −1700): `Visual / Hero stack` `97:206`, `Visual / Three embeds` `97:240`, `Visual / Chat and doc` `97:266`, `Visual / Data API response` `97:305`, `Visual / Publisher Console` `97:340`.

Blobs are ellipses with a layer blur (120–170) at 25–70% opacity. In code they map to blurred radial gradients or baked JPEGs. The patterns (dots, line grid, arcs, plus grid, hatch) are SVG vectors with a gradient or low-opacity stroke.

## Explorations 7–9: brutalism

Request: "continue with explorations. add some brutalism too". Same prototype text and structure as 4–6, same shared visual components.

| Frame | Idea | Type |
|---|---|---|
| `107:965` 7 · Concrete (x 9600) | Everything sits in one 1240 column of 2px-bordered cells with collapsed borders. Meta strip of stats, giant uppercase headline with a full blue slab for "inside other products ↘", black provider marquee, §-numbered section heads, outlined 01–04 product numbers with Data API inverted, table-style pricing, blue CTA with a URL input. Patterns: square dither (radial, linear), diagonal hatch, line grid. | Archivo Black + Archivo + Space Mono |
| `108:1240` 8 · Neo-brutal (x 11200) | Light-grey body, 2px outlines and hard 4–10px offset shadows on everything. Rotated blue sticker-block for "inside other products". Hard-edged outlined blobs (sky, lilac, mint, pink) instead of blurred ones. Starburst and circle stickers ("1,900 providers", "since 2012", "signed"). Visuals in window frames. Pastel product cards, blue Data API card, sky CTA. | Space Grotesk + Space Mono |
| `109:1515` 9 · Raw mono (x 12800) | Developer voice: `/routes` nav, `// meta` line, `$ iframely --help`, a headline ending in a cursor, `##` headings, `[ buttons ]`, `./slug` labelled boxes, `[x]` trust checklist, pricing as a JSON object, terminal-window CTA with a curl line. Patterns are ASCII-art fields (` .:-=+*#%@` ramp) in blue, or white on the blue Data API band. | JetBrains Mono only |

## Explorations 10–12

Request: "continue. gimme more". Same prototype text and structure, same shared visuals.

| Frame | Idea | Type |
|---|---|---|
| `112:1790` 10 · Swiss (x 14400) | White, a four-column grid (290 + 20 gutters) used for the header, labels and trust rows; 1px rules on top of every block; thin 120px section numerals in blue; geometric compositions behind each visual (blue circle with white rings, black quarter, grey square, blue half circle, stripes); product glyphs are circle / half / square / quarter; thin 160px prices; CTA with a ringed blue circle and an arrow. | Albert Sans (Thin, Light, SemiBold) |
| `113:2065` 11 · Blueprint (x 16000) | Pale blue grid paper (24/120px), registration marks and "FIG. 0x" captions per section; a Figma-style selection box with size label around the headline and a bezier "URL path" with handles; visuals framed by corner ticks with dimension lines and numbered callouts with dashed leaders; spec-sheet product cards with line icons; Data API and CTA on dark blueprint blue with white grid. | Mona Sans + Martian Mono |
| `114:2340` 12 · Bento (x 17600) | The home as a tile grid on light grey: hero tile with blobs and dots, a blue "6.5 billion" tile with a bar pattern, a "try it" URL tile, four stat tiles with different patterns; each product is a wide tile (text left, visual bleeding off the right edge) paired with a narrow fact tile (provider icon grid, Atlassian/Notion/GitBook, the four Data API steps, verified domains), alternating sides; trust, pricing and a calculator tile; blue CTA tile with blobs. | Funnel Display + Figtree |
