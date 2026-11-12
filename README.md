# publicly-design

Design explorations and experiments for the iframely.com redesign. Started 2026-10-21.

This folder holds notes and prototypes only. The site code, the plans and the demo live elsewhere (see the map below). Nothing here is deployed.

## Map

| Where | What |
|---|---|
| [Figma: Design 2027](https://www.figma.com/design/VmgHd0uy7JfPNckK470cHJ/Design-2027?node-id=0-1) | The design file. Page "Public" holds the current homepage as a reference frame; the other pages are exploration boards (see below). File key `VmgHd0uy7JfPNckK470cHJ`. |
| `C:\web\publicly` | The live iframely.com site (SvelteKit 5, pnpm). Source of the current fonts, colours and page templates. |
| `C:\web\iframely-marketing\plans\website\` | The website plan: one file per page question (01 to 11) and the decision log D1 to D40 in its README. |
| `C:\web\iframely-marketing\research\` | The research behind the plan. Start with `action-plan-overview.md`. |
| `website/` (in this repo) | Copy of the barebones SvelteKit prototype of the proposed site, taken from `C:\web\iframely-marketing\demos\website` on 2026-10-22 without `node_modules`, `.svelte-kit` and `build`. Draft copy and structure, no design yet; the place to apply the motion lab and the chosen palette. `npm install` then `npm run dev` (http://localhost:5173). |
| `C:\web\iframely-marketing\demos\website\` | The original of that prototype; treat the copy above as the working one from now on. |

## Notes

- [notes/figma-design-2027.md](notes/figma-design-2027.md): what is in the Figma file, with node ids.
- [notes/site-plan-digest.md](notes/site-plan-digest.md): the plan's products, navigation, homepage outline and the decisions that affect design.
- [notes/demo-website.md](notes/demo-website.md): the demo's stack, components, tokens and page outlines.
- [notes/design-brief.md](notes/design-brief.md): what the explorations need to answer, constraints, open questions, and the directions from the team.

## Explorations

- [explorations/2026-10-22-palette-fonts/](explorations/2026-10-22-palette-fonts/README.md): palettes, serif headings, hero and pattern switches (HTML board), two restyled Home frames and the palettes / patterns / shapes board in Figma.
- [explorations/2026-10-22-graphic-treatments/](explorations/2026-10-22-graphic-treatments/README.md): type-as-texture, bold two-colour shapes and blueprint/specimen tiles; the terminal-graphics board; the logo-refresh board. All in Figma, with node ids.
- [lab/](lab/README.md): working HTML demos. Seven shader and canvas backgrounds with pointer interaction, seven scripted product scenes (Motion) next to text blocks, and the Type panel (Tweakpane) that switches heading, base and mono faces, shared with the prototype. Open `index.html`.

## Conventions

- Explorations go in `explorations/<yyyy-mm-dd>-<topic>/` (HTML prototypes, exported images, a short readme) or on a new page in the Figma file. Keep the "Public" page as the untouched reference of the current site.
- Date every fact about the live site or the plan; both change.
- Copy comes from the plan and the demo, not from the current site, unless a decision says otherwise.
