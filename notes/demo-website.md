# Demo website

`C:\web\iframely-marketing\demos\website`, read 2026-10-21. A barebones prototype with draft ideas and no design: it exists to try copy, page structure and links. Every graphic is a labelled placeholder box; interactive results run on sample data with no calls to Iframely.

Treat it as a draft of content blocks, not as a reference for layout, type, colour or components. The tokens and components below are listed only so the explorations know what the prototype has and can replace all of it.

## Stack and running

SvelteKit 3, Svelte 5, Tailwind 4 with the typography plugin, adapter-static. `npm install` then `npm run dev` (http://localhost:5173); `npm run build` writes `build/`. A yellow demo bar toggles plan notes (status and open decisions per page); `/demo` lists every page with its plan file.

## Tokens (`src/routes/layout.css`)

- Fonts: Inter (sans), JetBrains Mono (mono). The live site uses **Martian Grotesk for headings and Inter for body** (`publicly/src/lib/styles/app.css`), so the demo's type is a placeholder.
- `brand` scale: oklch hue 265 (indigo-blue), steps 50, 100, 200, 300, 500, 600, 700, 800, 900. Primary button is brand-600, links brand-700. The live site's accent is `#05f` / `#005af0`, with aubergine `#480ca8` and fuchsia `#b5179e` as secondary accents, and `light-dark()` theming (dark mode exists on the live site).
- `ink` neutral scale: hue 265, steps 50 to 950. Body text ink-900 on white; muted bands ink-50; dark bands ink-950.
- Layout: content `max-w-6xl` (1152 px), side padding 16 / 24 px, sections `py-14` / `py-20`, header 64 px sticky with blur.
- Radii: cards `rounded-xl`, buttons `rounded-md`, hero box `rounded-2xl`.

## Components (`src/lib/components/`)

| Component | Props and notes |
|---|---|
| Hero | eyebrow, tagline, title (h1 4xl/5xl semibold tight), sub, children (buttons), `after` snippet (proof line, notes), `aside` snippet (right column, 1.1fr / 1fr). Gradient brand-50 to white. |
| HeroTry | The D38 stand-in: URL input and Check button, three example chips, tabs Embed / Preview / Data, sample output, "Full check" link to /try. |
| Section | id, eyebrow (uppercase brand-700), title (h2 2xl/3xl), intro, tone default / muted / dark, narrow. |
| Cards | items {tag, title, text, href, cta}, cols 2 / 3 / 4. Border ink-100, hover brand-300. |
| Button | variant primary / secondary / quiet / invert, size sm / md. |
| Code | dark block (ink-950) with label and Copy. |
| Cta | dark closing band (ink-950): title, text, buttons. |
| Stats | value and label grid, light or dark. |
| Badge | neutral / brand / good / warn / bad pills. |
| Placeholder | dashed box with an uppercase label, the marker for every missing visual. |
| Header | sticky; dropdowns with per-item notes; mobile menu. Data in `src/lib/data/nav.ts`. |
| Footer, Faq, Table, Tabs, Note, PageMeta, DocsSidebar, Generator | supporting blocks. |

Data files: `nav.ts` (header and footer), `decisions.ts` (the D-log), `providers.ts`, `samples.ts` (the `access` object copied from the live docs 2026-10-15, plus curl / Node / Python samples), `pricing.ts`, `compare.ts`, `updates.ts`.

## Pages and their sections

Routes: `/`, about, careers, compare and compare/[slug], data-api, demo, docs (plus data-api, reference, [...slug]), domains and domains/[provider], embeds, features, for/agents, for/chat-apps, for/cms, for/newsrooms, help (plus youtube-start-time), integrations, mcp, preview-api, pricing, publishers, tools (plus url-debugger), try, updates (plus meta-oembed-thumbnails), verification, wordpress.

Section headlines on the product pages (eyebrow, then title):

- **/data-api**: The web reader that can show its permissions; Declared purpose: Five processing modes; The access object: Every result says what was allowed; What you get: Structured, not scraped; Who it is for; How it fetches: One URL, one signed request; Compared; Pricing: Per read, falling with volume; Quick start; FAQ; call to action "Read your first URL".
- **/preview-api**: Link previews for every URL your users share; What you get; API: The same request shape for every URL; Proof; Who it's for; call to action "Paste a link, see the preview".
- **/embeds** (Rich Media): Link previews and embeds that keep working; Preview API and oEmbed; Hosted iframes and Content IDs; Cards and themes; Interactives; Delivery; Customization and white-label; Editors and CMS; 1,900 providers; Proof; Questions; call to action.
- **/publishers**: Your content, your rules, across 6,000 products; Three agents, three reasons; The Publisher Console, free; Signals we honour; Verify us; A good card needs four tags and one image; Traffic back and attribution; Every automated request declares a purpose; Proof and reach; Questions; call to action.
- **/pricing**: Plans by who you are; Data API per request; Calculator; Compare plans; Enterprise and custom; FAQ; call to action "Start free, in production".
- **/mcp**: Give your agent links it can show and pages it may read; Four read-only tools; The signature line; Install; Keys and limits; Acting on your behalf; FAQ.
- **/for/agents**: Ground your assistant on pages it is allowed to use; Your fetcher is being blocked; Agent-ready; Which mode for which job; Links your agent can show; FAQ.

## Visuals the demo leaves as placeholders (homepage)

1. Hero visual (D38), currently the HeroTry box.
2. Rich Media: three embeds, a video player, a social post, a map.
3. Preview API: a chat thread and a doc with link preview cards.
4. Publisher Console: requests by agent and customer, content policy by path.
5. Six customer logos in the trust section.


Update 2026-10-22: the demo was copied into this repo as `website-prototype/` (without node_modules, .svelte-kit and build). Work on that copy from now on; the original under iframely-marketing stays as it was.
