# Design brief for the explorations

Draft 2026-10-21. A working list of what the explorations should answer, with the constraints we know. Items marked "proposed" are suggestions, not decisions.

## Directions from the team (2026-10-22)

Start from the current design mockup (the Figma "Home" frame, which is close to the live site) and use the text and blocks of the demo homepage. First round, in this order:

1. **New colour palette.** Off-white or pastel body background, with text, button and link colours adjusted to it. Keep the current logo and the examples. The blue in the logo symbol may be re-tinted to match each palette.
2. **Heading font.** Replace Martian Grotesk with a modern serif. Font purchases are an option.
3. **Pattern and accents.** Add a pattern and accent colours to the hero and some other blocks.

After this round: images, the hero visual, and the rest.

Reference sites and what is liked about each:

| Site | Liked for |
|---|---|
| https://exa.ai/ | heading font, clean, interactive animations |
| https://wisprflow.ai/ | heading font, colours |
| https://slite.com/ | colours |
| https://www.tines.com/ | colours and visuals |
| https://www.relume.ai/ | colours, mask on visuals |
| https://calendly.com/ | shapes, colours |
| https://rulebase.co/ | colours, some visuals |
| https://www.diabrowser.com/ | colours, heading font, visuals |
| https://www.contentarchitecture.dev/ | colours, visuals, animations |
| https://weaveos.com/ | colours, accents |
| https://weav.com/ | colours, shapes, masks, blue accent handled well |
| https://paper.design/mono | grid, interactive elements, blocks; the low contrast is not liked |
| https://steep.app/ | colours, backgrounds, noisy gradients, simple graphics in blocks (added 2026-10-22) |

Deliverable for the first round: palette and font candidates, plus a few block and accent explorations rendered with the demo homepage sections. See `notes/references.md` for what the reference sites actually use.

## Starting point

- Reference for what exists: the Figma "Home" frame (current site).
- Reference for content: the plan and the demo's homepage draft v2 (draft copy and structure only; the demo has no design, so nothing in it constrains layout, type or colour).
- Brand today: Martian Grotesk headings, Inter body, accent blue `#05f`, aubergine and fuchsia as secondary accents, light and dark themes, the "Iframely" wordmark with a blue mark.
- Canvas: the current design is 1320 wide with a 1184 content column; the demo uses a 1152 content column. Pick one and keep it.

## Candidate experiments (proposed)

1. **Hero visual, D38.** Mock the two strongest options side by side: (1) one URL with four stacked results in product order (embed, preview card, Data API response with `access`, Console setting), and (5) the live paste-a-URL box. Then (2) the cycling paste if time allows. Each in light and dark.
2. **Four product cards.** The row under the hero with the D39 labels. Try plain cards, cards with a small illustration per product, and a single band with four columns and no boxes.
3. **Data API block.** The JSON with `access` is the sentence no competitor can write. Explore a response panel that highlights the five `decision` lines, with the five content types aligned to them, as the demo's sample already does.
4. **Product section visuals.** Rich Media (three embeds), Preview API (chat and doc with cards), Publisher Console (table of agents and a policy editor). These are the placeholders in the demo.
5. **Trust row.** Four cards (Signed, Allowed, Trusted, Audited) plus the logo strip. Try badges on one line versus cards.
6. **Header.** Five groups with dropdowns that carry one-line notes per product, "Get an API key" as primary. Check it at 1024 and at phone width.
7. **Tokens first.** Define colour, type and spacing variables in the Figma file before building new frames: brand and ink scales (match the live site, not the demo's placeholder hue), font sizes for h1 to body, section spacing, radii. Light and dark modes.

## Constraints and facts to keep straight

- Numbers on the page: 1,900 providers, 6.5 billion requests a month, 99.99% uptime, SOC 2 Type II, since 2012, 6,000 products (publishers page). The Figma frame still shows 99.999% and 3.2 billions; use the plan's figures.
- Prices are under revision (D19); label them as sample.
- Customer names with public proof: Canva, Atlassian (Jira), Notion, Circle, GitBook. Mighty Networks was dropped (no public page). Logos need permission before launch.
- "Making URLs travel" is proposed for retirement; the tagline in the demo is "Holding the web together since 2012" (D4 open).
- Keep /try and /domains out of the main header (D6 open, proposed).

## Open questions for the team

- Which of the D38 hero options to mock first, and whether the hero should be animated.
- Keep Martian Grotesk and the `#05f` accent, or is the 2027 design allowed to move the brand?
- Dark mode: a requirement for the explorations or a later pass?
- Where explorations are reviewed: Figma pages in Design 2027, or HTML prototypes in this folder?
