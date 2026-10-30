# Figma file: Design 2027

Read 2026-10-21. File key `VmgHd0uy7JfPNckK470cHJ`. One page, **Public** (`0:1`). No libraries added to the file, no colour or type variables; three local styles only (effects "Light" and "Dramatic", one colour "done" #000000).

## Frame "Home" (`1:102`), 1320 x 3920

This is the current iframely.com homepage, not the proposed one. The content column is 1184 wide at x = 68.

| Node | Name in Figma | What it is | Height |
|---|---|---|---|
| `1:144` | Header | Logo (`1:155`), main nav (`1:161`: Features, For publishers, Domains, Pricing, Resources), right nav (`1:184`: Log in, Sign up) | 80 |
| `1:104` | Frame 347 | Hero: "Making URLs travel", subline "Iframely connects products and publishers through rich media, embeds, previews and URL data. Since 2012.", buttons Try it free and Check your URLs (`1:111`, `1:112`), badge row SOC 2 Type II, GDPR compliant, Publisher-aware | 384 |
| `1:190` | Frame 798 | "Trusted by products where real people share URLs" logo strip: Notion, Atlassian, Canva, Bloomberg, NBC News, Linear, Substack | 92 |
| `1:272` | Frame 854 | "Rich experiences / Bringing URLs to life" with a three-tile media collage (YouTube, TikTok, Spotify, Figma kit) | 240 |
| `1:386` | Frame 845 | "Consistency / One API to connect" with a Preview / Debug / Data mode code panel and a player card | 265 |
| `1:442` | Frame 834 | "Publisher-aware / A good web citizen" with a handshake panel (Iframely IPs, Web Bot Auth, robots.txt, Content signals, Open Graph, oEmbed, JSON-LD, Microdata, Markdown) | 268 |
| `1:512` | Frame 443 | Full-width grey band: "Rich media people like and share", provider icon grid, "Browse supported providers 1900+" | 393 |
| `1:723` | Frame 810 | "The web keeps moving. Your URLs are in good hands." with Uptime 99.999%, Requests/mo 3.2 billions, "Good robot" badges (AICPA SOC, GDPR, verified bot) | 241 |
| `1:1079` | Frame 790 | "Built for teams that handle URLs": Product teams, Publishers, Rich media providers, Automation workflows (Coming soon) | 282 |
| `1:1104` | Frame 792 | "Start with a URL" call to action, Try it free and Check your URLs | 248 |
| `1:1112` | Frame 767 | Footer: Product, Resources, Support, Company, Legal; theme toggle; "2026 Itteco Software Corp." | 386 |

Hidden layers: `1:103` Hero Bck (a 1280 x 341 vector), `1:134` Group 438, `1:143` Rectangle 412, `1:113` and `1:114` (a third hero button and a "Check your URLs" nav link), `1:145` logo-alt, `1:177` a second right nav.

## Components and icons used

Instances only; the main components are not in this file.

- `Buttons / Button` x 9 (hero, header, call to action).
- Icons: arrow-right x4; lock-01, plus-circle, sun-beams-long, moon, bot-01, check, library-video x2 each; shield-check, check-circle, user-check, eye-opened-01, eye-opened-slash, globe-01, chevron-down, sparkles, arrows-out-03, minus, plus, ai-spinner-01, brackets, users-02, monitor-02, Ribbon x1 each.

## Gaps against the plan

- Everything the plan adds is missing: the four product cards, the Data API block with the `access` object, the proof row, the agent-ready row, the pricing teaser, the new header (Products, Solutions, Developers, Pricing, Resources; "Get an API key").
- The stats band (`1:723`) is dropped from the homepage by D40; the "Built for teams" grid (`1:1079`) becomes the Solutions menu; the provider grid (`1:512`) moves to /embeds and /domains.
- "Making URLs travel" is proposed for retirement (D4, open).
- No tokens: colours, type and spacing are hard values. Any serious exploration should start by defining variables (see the design brief).

## Screenshot

A render of the Home frame from 2026-10-21 lives in the session scratchpad only; re-render with `get_screenshot` on `1:102` when needed.
