<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Button from '#lib/components/Button.svelte';
	import LogoWall from '#lib/components/LogoWall.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import ProviderWall from '#lib/components/ProviderWall.svelte';
	import EmbedWall from '#lib/components/EmbedWallHero.svelte';
	import CtaWindow from '#lib/components/CtaWindow.svelte';
	import CustomizeList from '#lib/components/CustomizeList.svelte';
	import ReadersFigure from '#lib/components/ReadersFigure.svelte';
	import UpkeepTimeline from '#lib/components/UpkeepTimeline.svelte';
	import SecurityQA from '#lib/components/SecurityQA.svelte';
	import PreviewsScene from '#lib/components/PreviewsScene.svelte';
	import AskStrip from '#lib/components/AskStrip.svelte';
	import EndpointHub from '#lib/components/EndpointHub.svelte';
	import DevCover, { type DevScene } from '#lib/components/DevCover.svelte';
	import { PANEL } from '#lib/card.ts';
	import { parts } from '#lib/copy.ts';

	// The Rich Media page. Its earlier iterations are kept beside it: /embeds-1 (the first page, at /embeds until
	// 2026-11-23), /embeds-2 and /embeds-3; this one was /embeds-4.
	// Copy: the iframely-marketing demo site (demos/website, /embeds; plans/website/embeds-page-copy.md, draft 2, 2026-10-27).
	// "For developers": three ways in, as heading and text: from your back-end, from your editor, from the page.
	// The links are in the copy, as in the blocks below: in square brackets with their address (lib/copy.ts).
	// (The titles are statements, as in the other blocks; they were questions: "Already speak oEmbed?", "Built on
	// React, Vue or React Native?", "No back-end at all?")
	// DRAFT wording, 2026-11-23. There were four, each with a scene (/embeds-3 has them). What changed, so that the
	// page says each thing once:
	//   "Speaks oEmbed" was "If your CMS or editor speaks oEmbed, it already speaks Iframely": the CMS and the editor
	//       are the second text's.
	//   "One script for React, Vue and React Native" ("One script to approve, instead of dozens.") and "Works without
	//       a back-end" ("embed.js and our HTML template keep every embed current on their own.") were both embed.js:
	//       one text now. "One script to approve" is block 05's third question (one domain to allow), and "keep every
	//       embed current" is block 04 ("Updates while you sleep").
	// Their order is the figure's, so that each text is under the part it is about: the editor under the links (they
	// come from it), oEmbed under the endpoint, embed.js under the embed it draws. (Since 2026-11-24; "Speaks oEmbed"
	// was the first before, and the three read as a row of their own.)
	// (Tried the same day and taken back: each text as a switch for the part of the figure over it, while the pointer
	// is on it. components/EndpointHub.svelte says what each did.)
	const developers = [
		// (no list of editors: it named CKEditor and TinyMCE, "with Tiptap, Lexical and Editor.js adapters on the way")
		['Ready for your editor', 'A [WordPress plugin](/wordpress) and [guides](/integrations) for the popular rich-text editors, with more adapters on the way.'],
		['Speaks oEmbed', 'Anything that [speaks oEmbed](/docs/oembed-api) already speaks Iframely: point it at our endpoint.'],
		// (no list of frameworks: it said "works in React, Vue and React Native"; and no "any", which we cannot promise.
		// Two lines at most at 1440px, as the other two: "single-page apps and frameworks" and "SPAs and JavaScript
		// frameworks" both made it three.)
		['One script, no back-end', '[embed.js](/docs/embedjs) works in SPAs and frameworks, and with our HTML template it needs no server of yours.']
	];
	// (a card's text is drawn with its links by the copy snippet in the markup below)
	// "Performance" cards: the same, with no link of their own (they were /docs/click-to-play and /docs/autoplay,
	// "Docs"; empty strings keep the scene in the fifth place). Three of the texts have a link to the docs in them,
	// in square brackets with its address (lib/copy.ts); "Predictive height" has none: no docs page is about it.
	const performance = [
		['Click-to-play', '[A light cover](/docs/click-to-play) stands in until someone presses play, saving around 500 KB on every YouTube video.', '', '', 'play'],
		['Stays out of the way', 'Regular iframes hold up your page until they load. Ours [load in the background](/docs/lazy-load), just before readers scroll to them.', '', '', 'lazy'],
		['Predictive height', 'Posts take their place on the page before they even load, so text stays where readers left it and your Core Web Vitals stay healthy.', '', '', 'height'],
		['One video at a time', 'A single setting keeps one player playing, and [muted autoplay on scroll](/docs/autoplay) is there wherever providers allow it.', '', '', 'single']
	];
	// "For your product team" sub-sections: heading, text, and the scene on top (components/DevCover.svelte)
	const upkeep = [
		['Updates while you sleep', 'When a provider changes its code, your embeds update in the background. Your oldest posts keep playing, and nobody files a ticket.', 'update'],
		['We follow every rebrand', 'When a provider rebrands or moves, we follow: mermaid.ai, ardsounds.de and dailymail.com, just this year.', 'rebrand'],
		// (the text's link, in square brackets with its address, is read by the timeline: components/UpkeepTimeline.svelte)
		['Yours to keep', 'With annual billing, [Content IDs](/docs/ids) carry on working even if you cancel or close your account, and our open-source engine runs on your own servers.', 'keep']
	];
	// "For editors and apps" rows: heading, text, link, link label. (The links are in the texts, as in block 01; the
	// last row has none.)
	const customize = [
		// (Shortened 2026-11-23. It was: "Start a video at the right moment, switch on captions, pick a theme, show the
		// whole thread. Your editors set each provider's own options right in the editor, or choose them on
		// iframely.com and paste the new link. Readers see the players they know, so they press play." Its three
		// examples are now the scene's three switches.)
		["Every provider's options, a click away", "Start a video at the right moment, switch on captions, pick a theme. Your editors set [each provider's own options](/docs/options) right in the editor, or on iframely.com.", '', ''],
		['One player API', 'It [works the same across every provider](/docs/playerjs): play on scroll, pause when a reply comes in, mute a busy thread.', '', ''],
		// (DRAFT, 2026-11-23. It was: 'Put your own play button on all of them and drop the "Powered by" on any paid
		// volume. On Enterprise, serve the iframes under your own name.' This block does not bring up the "Powered by"
		// line of the free plan: the pricing page does.)
		['Your name on it', 'Make every player look like part of your product, with your own play button on all of them. On Enterprise, serve the iframes [from your own domain](/docs/cdn).', '', ''],
		['Fine-tuned for you', 'Why spend weeks fine-tuning one provider? Our team can adjust it for you, quickly.', '', '']
	];
	// (block 06's three kinds of link are in components/PreviewsScene.svelte)
	// (the "For security teams" block's texts are in components/SecurityQA.svelte)
</script>

<PageMeta
	title="Rich Media: embeds for 1,900 providers, tracking changes since 2012 | Iframely"
	description="Perfect embeds, every time: 1,900 media providers through one API, fast, safe and kept up to date while you sleep. Free to start."
/>

<!-- No tag over the heading since 2026-11-24 (it was eyebrow="Rich Media", drawn as a measure line as on the other
     product pages and on /embeds-1..3: it repeated the measures of the wall under it). Tried in its place the same
     day and dropped: the plain blue tag, a leader line, a bracket down the copy's left side, and a small drawing
     mark before the name (Hero's tag="tick" | "corner" | "cross" | "slash", still in the panel's Hero tag for the
     other product pages).
     Tried and dropped later the same day: the tag set as the blocks' tags are ("01 Developers"), with the product's
     icon in the chip where they have the number. -->
<Hero
	product
	endpoint="iframe.ly/api/iframely"
	title="Perfect embeds, every time"
	sub="Send us a URL, get the embed code back. Today and tomorrow. Videos play, posts appear and maps move, the way people expect from the apps they love, wherever your users write, post and chat."
>
	<!-- The copy in one column, as on /embeds-1..3 and the other product pages: heading, text, buttons.
	     (For some hours of 2026-11-24 it was Hero's `split`: the heading and the buttons under it on the left, the
	     text on the right. It put the wall 100px higher, but the hero then looked like one more of the blocks'
	     heads under it, and the buttons came before the text.) -->
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="secondary">Try a link</Button>
	<!-- V15 from the motion lab: a wall of the kinds of embeds, under the copy. This page's own fork of it
	     (components/EmbedWallHero.svelte): it leaves to the blocks below what they say (/embeds-3 has the wall as
	     it was, components/EmbedWallIcons.svelte). -->
	{#snippet below()}<EmbedWall />{/snippet}
</Hero>

<!-- Our take on iframely.com's "Rich media people like and share": the home sections' two columns, then the
     providers as stickers on a sheet of grey paper (components/ProviderWall.svelte). No buttons under the heading:
     the link to the full list is the last sticker.
     (Until 2026-11-24 the paper was set in a white card, with a closing line in the card's foot, "Whatever your
     users paste tomorrow, it probably works today.": /embeds-3 has that.) -->
<div class="plainpaper">
<!-- The page's rhythm: 128px between any two blocks (each block's own 64px above and below). The hero ends with 80px
     of its own, so this first block has 48px above. -->
<section id="providers" class="wrap scroll-mt-[calc(var(--header-h)+24px)] pt-12 pb-16">
	<!-- no tag over this block (it was "Coverage", without a number): the heading opens it; the tags start with the
	     numbered blocks written for someone -->
	<div class="grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Over 1,900 media providers, and growing</h2>
		<p class="t-body text-tagline">
			From YouTube and Spotify to Figma, Google Docs and Calendly, and the one you've never heard of. Every provider is
			prepared with care, and reviewed by hand all year round.
		</p>
	</div>
	<!-- the stickers are links to the providers' pages; bare: the paper alone, with no card and no foot -->
	<div class="mt-14"><ProviderWall links tame bare /></div>
</section>

<!-- A card's text with its links (lib/copy.ts): plain words, and the taglines' link (.copy-link, routes/layout.css) -->
{#snippet copy(text: string)}{#each parts(text) as [words, href], n (n)}{#if href}<a class="copy-link" {href}>{words}</a>{:else}{words}{/if}{/each}{/snippet}

<!-- The link of a block, a card or a sheet: the home page's button (components/Pill.svelte): a 36px pill in the
     button type, black with white text, and no arrow -->
{#snippet pill(href: string, cta: string, cls = '', invert = false, ghost = false)}
	<!-- invert: a white pill, for a card on a dark or blue ground; ghost: the home page's outlined one, for a block's
	     second link -->
	<a
		{href}
		class="t-button inline-flex items-center rounded-full px-5 py-2 whitespace-nowrap transition-colors {ghost
			? 'text-body ring-1 ring-black/12 ring-inset hover:ring-black/40'
			: invert
				? 'bg-white text-fg hover:bg-white/85'
				: 'bg-fg text-white hover:bg-body'} {cls}">{cta}</a
	>
{/snippet}

<!-- One card of the card blocks, as the hero wall's windows (8px corners, hairline ring, soft shadow): the title, the
     text and the link on top, the cover under them. The cover is set 12px inside the card (DevCover's bare mode), its
     window two squares further in; the text lines up with that window, 36px in. The title is set as the window
     bars' neighbour: 18px medium; the text under it is grey, a step quieter. The link is the black pill lying on the
     cover, in its bottom-right corner. n: the paper's squares across, for a card narrower than half the page. -->
{#snippet flatCard(name: string, body: string, href: string, cta: string, scene: string, pattern: number, n?: number, ground?: string, whole = false)}
	<!-- ground: the whole card near-black ('dark') or blue: its text in white, its cover without the paper (DevCover),
	     so the scene's white window lies straight on the card's colour.
	     whole: the scene's window shown whole on its paper, not cut by the card's foot; the pill then sits at the top. -->
	<div
		class="relative flex flex-col overflow-hidden rounded-lg shadow-[0_0_0_1px_rgb(0_0_0/0.08)] {ground === 'dark'
			? 'bg-[#131316]'
			: ground === 'blue'
				? 'bg-rich'
				: 'bg-white'}"
	>
		<!-- every card's text has the same box: 36px in from the sides (where the scenes' windows start), 32px from the
		     top, 24px above the cover; text beside a scene, or under one, has 32px below -->
		<div class="order-first {ground || whole ? '' : 'grow'} px-9 pt-8 pb-6">
			<h3 class="text-[18px] leading-[1.35] font-medium {ground ? 'text-white' : 'text-fg'} {cta && (ground || whole) ? 'pr-20' : ''}">{name}</h3>
			<p class="t-small mt-1.5 max-w-[440px] text-[15px]! text-pretty {ground ? 'text-white/75' : 'text-mute'}">{@render copy(body)}</p>
		</div>
		<DevCover scene={scene as DevScene} bare {pattern} {n} {whole} ground={(ground || undefined) as 'dark' | 'blue' | undefined} />
		<!-- with a whole window the pill moves to the top, beside the title; on a coloured card it is white -->
		{#if cta}{@render pill(href, cta, `absolute ${ground || whole ? 'top-7 right-9' : 'right-6 bottom-6'}`, !!ground)}{/if}
	</div>
{/snippet}

<!-- A block laid out as the home page's product sections: the tag, then the heading on the left and the text (if any)
     on the right; under them four cards, two by two: text on top, a cover placeholder below. -->
{#snippet cardBlock(id: string, tag: string, title: string, text: string, cards: string[][], flat = false, num = '', grounds: string[] = [])}
	<section {id} class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
		<!-- num: the section's number before the tag, in a small light blue box (a sheet number) -->
		<p class="t-tag flex items-center gap-2.5 text-rich">
			{#if num}<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">{num}</span>{/if}{tag}
		</p>
		<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
			<h2 class="t-h2 text-fg">{title}</h2>
			{#if text}<p class="t-body text-tagline">{text}</p>{/if}
		</div>
		{#if flat}
			<!-- as the hero wall: the card has the wall's windows' box (8px corners, hairline ring, soft shadow), 28px from
			     the next. The title, text and link are on top; the cover is under them: the scene's window on light grey,
			     set in by 24px. -->
			<div class="mt-14 grid gap-4 md:grid-cols-2">
				{#each cards as [name, body, href, cta, scene], i (name)}
					{@render flatCard(name, body, href, cta, scene, i % 4, undefined, grounds[i])}
				{/each}
			</div>
		{:else}
		<div class="mt-16 grid gap-6 md:grid-cols-2">
			{#each cards as [name, body, href, cta, scene] (name)}
				<div class="flex flex-col overflow-hidden {PANEL}">
					<div class="grow p-8 pb-6">
						<!-- the card is not a link; its link is a small grey chip in the top-right corner, and the title keeps clear of it -->
						{#if cta}
							<a
								{href}
								class="absolute top-7 right-7 inline-flex items-center gap-1 rounded-full py-1 pr-2 pl-2.5 text-[12px] leading-none text-mute ring-1 ring-black/8 transition-colors ring-inset hover:text-fg hover:ring-black/25"
								>{cta}<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 1.5 7 5 3.5 8.5" /></svg></a
							>
						{/if}
						<h3 class="text-[20px] leading-[1.3] font-medium text-fg {cta ? 'pr-24' : ''}">{name}</h3>
						<p class="t-small mt-2 text-[15px]! text-body">{body}</p>
					</div>
					<!-- the cover, edge to edge at the foot of the card: a mini scene where the card has one, else a grey placeholder -->
					{#if scene}
						<DevCover scene={scene as DevScene} />
					{:else}
						<div class="aspect-[5/2] bg-[#f2f2f2]" aria-hidden="true"></div>
					{/if}
				</div>
			{/each}
		</div>
		{/if}
	</section>
{/snippet}

<!-- The blocks' tags are one word each since 2026-11-24: Developers, Customization, Experience, Upkeep, Security,
     Previews. (They named audiences: "For developers", "For editors and apps", "For readers", "For product teams",
     "For security teams", and "Link previews"; the comments below still call the blocks by those names.) -->
<!-- "For developers": the page's block head, then "connect once" as a drawing straight on the page
     (components/EndpointHub.svelte: five providers' links, lines from all of them into one endpoint, and the picked
     link's embed coming out of it), and under it three ways in, a third of the page each.
     (A sample, 2026-11-24. Before it: a scene that works, components/EndpointDemo.svelte, kept in its file: the
     request, then the embed, the provider's options and the embed code side by side.
     Tried and taken back the same day: one request with its answer's JSON in one window, a note beside each part
     of the answer leading to the blocks of this page made of it.) -->
<section id="developers" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">01</span>Developers
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<!-- no buttons under the heading, as blocks 03 to 06 (it had two pills: "API docs", /docs, and "Integrations",
		     /integrations) -->
		<h2 class="t-h2 text-fg">The embeds API you wish you built yourself</h2>
		<!-- (the block's link to the docs is in its tagline, as block 06's; a tagline's links are styled in routes/layout.css) -->
		<!-- (it began "Send a URL, get HTML back.": the hero says so, and the scene under it shows it) -->
		<p class="t-body text-tagline">Connect once, and every feature on this page comes through <a href="/docs">the same endpoint</a>.</p>
	</div>
	<!-- No cards, as blocks 03 to 06, and the shape of block 04: one figure across the page, the working scene on grey
	     paper, then the block's three texts under it as plain columns (04's own spacing).
	     (Before: a lead, "Speaks oEmbed", with its text beside the scene, and three more columns under it, each a small
	     scene on paper over its text: an editor, a Content-Security-Policy diff, post.html. /embeds-3 has the four as
	     white cards.) -->
	<div class="mt-14"><EndpointHub /></div>
	<div class="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-3">
		{#each developers as [name, body] (name)}
			<div>
				<h3 class="text-[18px] leading-[1.35] font-medium text-fg">{name}</h3>
				<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">{@render copy(body)}</p>
			</div>
		{/each}
	</div>
</section>

<!-- The order of the blocks: first what the product does (coverage, developers, editors and apps, performance), then
     why to trust it (product teams, the customers' logos, security). -->

<!-- "For your editors" and "For your app" as one block, with the page's block head. Under it two halves, no card
     (components/CustomizeList.svelte): on the left the copy as four headings with their texts, straight on the
     page, on the right a working scene on grey paper. Each text is a switch for its own scene, and they take turns
     on their own. (Block 05's layout.) -->
<section id="customization" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">02</span>Customization
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<!-- no buttons under the heading (it had two pills: "Docs", /docs, and "Player API", /docs/playerjs) -->
		<h2 class="t-h2 text-fg">Customize, fine-tune and white-label</h2>
		<p class="t-body text-tagline">
			Every part of Iframely is yours to adjust, through settings, query-string parameters and design editors.
		</p>
	</div>
	<div class="mt-14"><CustomizeList items={customize} /></div>
</section>

<!-- "Performance". The lead card (click-to-play) is as wide as the page: its text and link on the left, its scene's
     window on the right. It is white as every other card: the page has no black block. Under it the other three, a third of the page each. All four windows are whole, none cut by
     its card's foot. -->
<section id="performance" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">03</span>Experience
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Fast and beautiful, on every device</h2>
		<p class="t-body text-tagline">
			Embeds are often the heaviest thing on a page. Ours load late, hold their place and stay light until someone
			presses play.
		</p>
	</div>
	<!-- One annotated figure, not cards (components/ReadersFigure.svelte): a tall article window with the four texts in
	     the margins. (/embeds-3 has this block as a wide lead card, click-to-play, and three small cards under it.) -->
	<div class="mt-14"><ReadersFigure items={performance} /></div>
</section>

<!-- "For your product team": the page's block head (tag, heading on the left, the opening paragraph on the right), then
     the rest of the copy as three sub-sections on one sheet (the provider wall's box), side by side and parted by
     hairlines: a mini scene on drawing paper on top (DevCover's bare cover, 32 squares across), then a heading and a
     short text. The closing line is the sheet's foot, as on the provider wall. -->
<section id="upkeep" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">04</span>Upkeep
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Your embeds are in good hands</h2>
		<p class="t-body text-tagline">
			Every provider is different, and they all keep changing. We keep up, so your team can get it done and move on.
		</p>
	</div>
	<!-- A timeline, not cards (components/UpkeepTimeline.svelte): one line from 2012 to this year with what happened to
	     providers along it, its length ("14 years and counting") as a comment in its first event, for the old closing
	     line, then the three texts as plain columns. (/embeds-3 has this block as
	     one sheet of three columns, a drawn scene over each text.) The events are draft content, to be confirmed. -->
	<div class="mt-14">
		<UpkeepTimeline items={upkeep} />
	</div>
</section>

<!-- Who uses it: the site's trust block as on the home page and /pricing (components/LogoWall.svelte: the customers'
     logos taking turns, with the strip of figures at the sheet's foot), under this page's own label. Here the logos
     take turns on their own, and the strip begins with the year we started, "Serving since 2012" (since). No tag or
     heading: a strip between two blocks.
     (Until 2026-11-24 the wall had no strip here, and 16px under it stood a table of four figures with a small
     drawing each: since 2012, 6,000+ products, 6.5B requests, 99.99% uptime. /embeds-3 has that now.) -->
<section id="proof" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-label mb-4 text-faint">Chances are, we've already met</p>
	<LogoWall auto since />
</section>

<!-- "For security teams" as a security questionnaire already filled in (components/SecurityQA.svelte): four questions
     with their answers on the left, the evidence for the one pointed at on the right. (/embeds-3 has this block as a
     bento of four cards.) The wording is a draft. -->
<section id="security" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">05</span>Security
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Third-party media, without the third-party worries</h2>
		<!-- the original /embeds line: it sets up the questionnaire under it -->
		<p class="t-body text-tagline">
			Embeds bring other people's code to your page, so your security team will ask. Here are the short answers:
		</p>
	</div>
	<div class="mt-14"><SecurityQA /></div>
</section>
<!-- The way on to the Preview API, as the page's last numbered block (it was a sheet in two parts, unnumbered, after
     the figures). -->
<section id="previews" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<!-- Block 06, with a twist on the page's block head: two halves as block 05, but the text is all on the left (the
	     tag, the heading, the tagline under it with the block's link in it) and the right half is the cover
	     (components/PreviewsScene.svelte): the three cards on grey paper the block had as a sheet, not a window like
	     block 05's. The tag's wording is a draft. -->
	<div class="grid gap-x-16 gap-y-10 lg:grid-cols-2">
		<div class="flex flex-col items-start lg:pt-2">
			<p class="t-tag flex items-center gap-2.5 text-rich">
				<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">06</span>Previews
			</p>
			<h2 class="t-h2 mt-5 text-fg">Plus, previews for the rest of the web</h2>
			<p class="t-body mt-5 text-pretty text-tagline">
				News articles, product pages, repositories: the <a href="/preview-api">Preview API</a> turns links without a
				player into tidy cards, from the same request.
			</p>
			<!-- no button: the block's link is in its tagline (a tagline's links are styled in routes/layout.css). It was
			     a black "Preview API" pill under the tagline. -->
		</div>
		<!-- as block 05's cover: the paper starts 24px left of its column, so the first card's edge is on the column's -->
		<div class="lg:-ml-6"><PreviewsScene /></div>
	</div>
</section>

<!-- The page's closing call to action, before the footer: the blue window that sat under the hero wall
     (components/CtaWindow.svelte), with the heading and the tagline of the plain block it replaces. Not marked
     .hero-cta: the Tweakpane switch for the heroes' windows leaves it alone. -->
</div>
<!-- (squircle buttons were tried on this page, in this block and then everywhere: the pills stayed) -->
<div class="wrap mt-16 mb-16">
	<!-- without the window's bar (it had the hero's request, "GET iframe.ly/api/iframely?url=… 200 OK") -->
	<!-- the buttons under the tagline; at the block's right, level with them, the AI assistants to ask about Iframely
	     as icons alone (components/AskStrip.svelte). (The assistants were also tried as a framed strip: under the logo
	     wall, where it read as a question about the customers, and under this block, on no ground and on black.) -->
	<CtaWindow
		plain
		stack
		title="Start free, leave the upkeep to us"
		text="2,000 hits a month, no card needed. As you grow, Iframely still costs less than one developer looking after embeds in-house, and that job does need one."
		buttons={[
			['Get an API key', '#signup'],
			['Try a link', '/try']
		]}
	>
		{#snippet aside()}<AskStrip />{/snippet}
	</CtaWindow>
</div>

<style>
	/* the dotted drawing paper of the cards' covers (components/DevCover.svelte), as the ground of the Preview API cards */
	.dotted {
		background-color: #f4f4f5;
	}
	/* One ground under every scene of the page: a flat pale grey, as the hero wall has no paper at all. The scenes'
	   components draw squared, dotted, graph and crossed papers (for /embeds-2); here those marks are switched off. */
	.plainpaper :global(.paper),
	.plainpaper :global(.squared) {
		background-color: #f4f4f5 !important;
		background-image: none !important;
		box-shadow: none !important;
	}
</style>