# Site plan digest (for design)

Distilled 2026-10-21 from `C:\web\iframely-marketing\plans\website\` (the README decision log and 01-site-structure.md). Facts about the live site in the plan were read 2026-10-15.

## Products and audiences (D37, D39)

Four products, in the order Iframely built them, from fewer to more data about a URL:

| Product | Route | Audience label (D39, decided 2026-10-17) | One line |
|---|---|---|---|
| Rich Media | /embeds | For content platforms | Embeds for 1,900 providers that keep working as platforms change |
| Preview API | /preview-api | For collaboration apps | Link previews, cards and metadata for any URL, rich media on or off |
| Data API | /data-api | For automated systems | Readable content and structured data for any URL, with the publisher's permissions attached |
| Publisher Console | /publishers | For publishers | See who fetches your pages and set what each app receives |

One shared plan covers Preview API and Rich Media. MCP lives under Developers. Cards (/cards) is a later page (D5).

## Who reads which page

Search sends consumers to /try (113,804 clicks in 16 months) and /domains/* (272,865). The homepage gets branded traffic (36,683) and 38% of sessions are direct. So the homepage can be rebuilt for evaluators, developers and agents without touching the pages that carry the SEO.

## Navigation (plan 01, Section 3; demo `nav.ts`)

Header: **Products** (Rich Media, Preview API, Data API, Publisher Console), **Solutions** (AI agents and RAG, Chat and collaboration apps, CMS and editors, Publishers and newsrooms), **Developers** (Docs, API reference, MCP server, SDKs and integrations, Changelog, URL debugger, Status, llms.txt), **Pricing**, **Resources** (Compare, Help center, About, Trust center). Header actions: Check a URL, Sign in, **Get an API key**.

Footer: Products, Free tools (generator, debugger, all tools, providers, widget), Developers, Company, Legal. The no-code funnel stays out of the header (D6, open).

## Homepage outline

The plan (01, Section 5) and the demo's draft v2 (`demos/website/src/routes/+page.svelte`) differ slightly. Both are drafts: the demo is a barebones prototype of ideas, not a decision, and the explorations may reorder, merge or drop blocks.

Demo v2 draft, top to bottom:

1. **Hero.** Tagline "Holding the web together since 2012" (D4). Title "Iframely makes URLs work inside other products". Sub: four sentences, one per product. Buttons: Get an API key, Read the docs, Check a URL. Proof line "6.5 billion requests a month, 99.99% uptime, SOC 2 Type II" (above or below the buttons still open, D40). Aside: a live "paste a URL" box with Embed / Preview / Data tabs as a stand-in for the hero visual (D38).
2. **Four product cards.** "Connecting developers and publishers, one URL at a time", labels from D39.
3. **Rich Media** (muted band). Copy plus a visual: three embeds, a video player, a social post, a map.
4. **Preview API.** Visual: a chat thread and a doc with link preview cards.
5. **Data API** (muted). "Machine-ready URL data processing: declared, signed and logged" with the shortened JSON response showing `access`.
6. **Publisher Console.** Visual: requests by agent and customer, content policy by path.
7. **Trusted on both sides of the URL** (muted). Four trust cards: Signed requests, Allowed by publishers, Trusted by developers, Audited and transparent. Six customer logos.
8. **Pricing teaser.** Two cards: Rich Media and Preview API ($0 to start, 2,000 hits free, from $49); Data API ($1.00 per 1,000 reads, 1,000 free). Prices under revision (D19).
9. **Dark call to action.** "Start with one URL".

Leaves the homepage: the "Built for teams" grid, the provider logo grid, the stats band (D40).

## Decisions that shape design

Decided:
- D39 audience labels (Set A, above).
- D40 stats band dropped from home; the same band closes the Rich Media and Preview API pages.

Open, and the ones a design exploration can inform:
- **D38 hero visual.** Options: (1) one URL, four results stacked in product order, static or animated, recommended; (2) the paste: a URL into a CMS, a chat and an agent, cycling; (3) both sides of the URL, publisher page / Iframely / product; (4) real screens from Notion, Canva, Jira, needs permission; (5) a live paste-a-URL box.
- **D1 / D2** product order in hero and nav; product naming ("Data API").
- **D4** brand line: "Holding the web together since 2012" replacing "Making URLs travel".
- **D5** Cards page timing. **D6** no-code funnel out of the header.
- **D19 to D23** pricing presentation (list, calculator, annual toggle, enterprise floor).
- Still open per D40: proof line above or below the hero buttons.

## Other pages with plans

02 About and Careers, 03 Debugger sunset, 04 Publishers (control-and-proof page), 05 Domains hub and provider template, 06 Try as the generator, 07 Pricing, 08 Docs, 09 Help, 10 WordPress, 11 Updates. All proposed, none decided as of 2026-10-19.
