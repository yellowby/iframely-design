<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Button from '#lib/components/Button.svelte';
	import LogoWall from '#lib/components/LogoWall.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import ProviderWall from '#lib/components/ProviderWall.svelte';
	import EmbedWall from '#lib/components/EmbedWallIcons.svelte';
	import CtaWindow from '#lib/components/CtaWindow.svelte';
	import CustomizeSheet from '#lib/components/CustomizeSheet.svelte';
	import OembedDemo from '#lib/components/OembedDemo.svelte';
	import SecurityDemo from '#lib/components/SecurityDemo.svelte';
	import DevCover, { type DevScene } from '#lib/components/DevCover.svelte';
	import { PANEL } from '#lib/card.ts';

	// Copy: the iframely-marketing demo site (demos/website, /embeds; plans/website/embeds-page-copy.md, draft 2, 2026-10-27).
	// "For your developers" cards: title, text, link, link label
	const developers = [
		// (the titles are statements, as in the other blocks; they were questions: "Already speak oEmbed?", "Built on
		// React, Vue or React Native?", "No back-end at all?")
		// (the cards have no links of their own: the block's two links, the docs and the integrations, are under its
		// heading. They were: /docs "API docs", /integrations "Integrations", /docs "Docs", /docs/reference "embed.js")
		['Speaks oEmbed', 'If your CMS or editor speaks oEmbed, it already speaks Iframely.', '', '', 'oembed'],
		['Ready for your editor', 'A WordPress plugin and guides for CKEditor and TinyMCE, with Tiptap, Lexical and Editor.js adapters on the way.', '', '', 'editor'],
		['One script for React, Vue and React Native', 'One script to approve, instead of dozens.', '', '', 'script'],
		['Works without a back-end', 'embed.js and our HTML template keep every embed current on their own.', '', '', 'template']
	];
	// "Performance" cards: the same, with no links (they were /docs/click-to-play and /docs/autoplay, "Docs"; empty
	// strings keep the scene in the fifth place)
	const performance = [
		['Click-to-play', 'A light cover stands in until someone presses play, saving around 500 KB on every YouTube video.', '', '', 'play'],
		['Stays out of the way', 'Regular iframes hold up your page until they load. Ours load in the background, just before readers scroll to them.', '', '', 'lazy'],
		['Predictive height', 'Posts take their place on the page before they even load, so text stays where readers left it and your Core Web Vitals stay healthy.', '', '', 'height'],
		['One video at a time', 'A single setting keeps one player playing, and muted autoplay on scroll is there wherever providers allow it.', '', '', 'single']
	];
	// "For your product team" sub-sections: heading, text, and the scene on top (components/DevCover.svelte)
	const upkeep = [
		['Updates while you sleep', 'When a provider changes its code, your embeds update in the background. Your oldest posts keep playing, and nobody files a ticket.', 'update'],
		['We follow every rebrand', 'When a provider rebrands or moves, we follow: mermaid.ai, ardsounds.de and dailymail.com, just this year.', 'rebrand'],
		['Yours to keep', 'With annual billing, Content IDs carry on working even if you cancel or close your account, and our open-source engine runs on your own servers.', 'keep']
	];
	// "For editors and apps" rows: heading, text, link, link label
	const customize = [
		["Every provider's options, a click away", "Start a video at the right moment, switch on captions, pick a theme, show the whole thread. Your editors set each provider's own options right in the editor, or choose them on iframely.com and paste the new link. Readers see the players they know, so they press play.", '', ''],
		['One player API', 'It works the same across every provider: play on scroll, pause when a reply comes in, mute a busy thread.', '', ''],
		['Your name on it', 'Put your own play button on all of them and drop the "Powered by" on any paid volume. On Enterprise, serve the iframes under your own name.', '', ''],
		['Fine-tuned for you', 'Why spend weeks fine-tuning one provider? Our team can adjust it for you, quickly.', '', '']
	];
	// The Preview API sheet's three cards: the kind of page, where it is from, one fact a card of that kind shows
	const previews = [
		['article', 'news site', '5 min read'],
		['product', 'shop', '$48'],
		['repository', 'code host', '★ 2.1k']
	];
	// "Privacy and security" cards, as the developers': title, text, link, link label (none yet), scene
	const security = [
		['Kept apart from your page', 'Every embed runs in our iframe, apart from your page and its code.', '', '', 'frame'],
		['Consent comes first', 'Readers give their consent before any third-party cookie loads.', '', '', 'consent'],
		['Independently audited', 'Iframely is SOC 2 Type II audited.', '', '', 'audit'],
		['Your domain, your CDN', 'On Enterprise, reader traffic can stay on your own domain: we serve everything from your CDN.', '', '', 'domain']
	];
</script>

<PageMeta
	title="Rich Media: embeds for 1,900 providers, tracking changes since 2012 | Iframely"
	description="Perfect embeds, every time: 1,900 media providers through one API, fast, safe and kept up to date while you sleep. Free to start."
/>

<Hero
	eyebrow="Rich Media"
	product
	endpoint="iframe.ly/api/iframely"
	title="Perfect embeds, every time"
	sub="Send us a URL, get the embed code back. Today and tomorrow. Videos play, posts appear and maps move, the way people expect from the apps they love, wherever your users write, post and chat."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="secondary">Try a link</Button>
	<!-- V15 from the motion lab: a wall of the kinds of embeds, under the copy -->
	{#snippet below()}<EmbedWall />{/snippet}
</Hero>

<!-- Our take on iframely.com's "Rich media people like and share": the home sections' two columns, then the
     providers as one ruled sheet in the page's card box (components/ProviderWall.svelte). No buttons under the
     heading: the closing line and the link to the full list are in the sheet's foot. -->
<div class="plainpaper">
<!-- The page's rhythm: 128px between any two blocks (each block's own 64px above and below). The hero ends with 80px
     of its own, so this first block has 48px above. -->
<section id="providers" class="wrap scroll-mt-[calc(var(--header-h)+24px)] pt-12 pb-16">
	<!-- no tag over this block (it was "Coverage", without a number): the heading opens it; the tags start with the
	     numbered blocks written for someone -->
	<div class="grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Over 1,900 media providers, and growing</h2>
		<p class="t-body text-body">
			From YouTube and Spotify to Figma, Google Docs and Calendly, and the one you've never heard of. Every provider is
			prepared with care, and reviewed by hand all year round.
		</p>
	</div>
	<!-- the stickers are links to the providers' pages; the foot is reworded here ("chances are" is the logo wall's line) -->
	<div class="mt-14"><ProviderWall links tame flat foot="Whatever your users paste tomorrow, it probably works today." /></div>
</section>

<!-- The link of a card or a sheet: a small black pill with an arrow -->
{#snippet pill(href: string, cta: string, cls = '', invert = false, ghost = false)}
	<!-- invert: a white pill, for a card on a dark or blue ground; ghost: an outlined one, for a block's second link -->
	<a
		{href}
		class="group t-small inline-flex items-center gap-1 rounded-full py-1.5 pr-2.5 pl-3.5 font-medium transition-colors {ghost
			? 'text-fg ring-1 ring-black/15 ring-inset hover:ring-black/40'
			: invert
				? 'bg-white text-fg hover:bg-white/85'
				: 'bg-fg text-white hover:bg-body'} {cls}"
		>{cta}<svg class="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" /></svg></a
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
			<p class="t-small mt-1.5 max-w-[440px] text-[15px]! text-pretty {ground ? 'text-white/75' : 'text-mute'}">{body}</p>
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
			{#if text}<p class="t-body text-body">{text}</p>{/if}
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

<!-- "For developers": the page's block head, then not two by two but one wide card over three. The wide one is the
     block's argument, "send a URL, get HTML back", as a scene that works (components/OembedDemo.svelte): its text
     and link on the left, the scene on the right. The other three are the card blocks' cards, a third of the page
     each. -->
<section id="developers" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">01</span>For developers
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<!-- the block's links are under its heading, a main one and a second: the cards have none -->
		<div>
			<h2 class="t-h2 text-fg">The embeds API you wish you built yourself</h2>
			<p class="mt-6 flex flex-wrap gap-2">{@render pill('/docs', 'API docs')}{@render pill('/integrations', 'Integrations', '', false, true)}</p>
		</div>
		<p class="t-body text-body">Send a URL, get HTML back. Connect once, and every feature comes through the same endpoint.</p>
	</div>
	<!-- the text column is as wide as one of the three cards below, without the gap -->
	<div class="mt-14 grid overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08)] lg:grid-cols-[calc((100%-2rem)/3)_minmax(0,1fr)]">
		<div class="flex flex-col items-start px-9 pt-8 pb-8">
			<h3 class="text-[22px] leading-[1.3] font-medium text-fg">{developers[0][0]}</h3>
			<p class="t-small mt-2 text-[15px]! text-pretty text-mute">{developers[0][1]}</p>
		</div>
		<div class="p-3 pt-0 lg:pt-3 lg:pl-0"><OembedDemo /></div>
	</div>
	<div class="mt-4 grid gap-4 md:grid-cols-3">
		{#each developers.slice(1) as [name, body, href, cta, scene], i (name)}
			{@render flatCard(name, body, href, cta, scene, i + 1, 32, undefined, true)}
		{/each}
	</div>
</section>

<!-- The order of the blocks: first what the product does (coverage, developers, editors and apps, performance), then
     why to trust it (product teams, the customers' logos, security). -->

<!-- "For your editors" and "For your app" as one block, with the page's block head. Under it one sheet in two parts
     (components/CustomizeSheet.svelte): on the left a working scene, on the right the copy as four rows. Each row is a
     switch for its own scene, and they take turns on their own. -->
<section id="customization" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">02</span>For editors and apps
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<div>
			<h2 class="t-h2 text-fg">Customize, fine-tune and white-label</h2>
			<p class="mt-6 flex flex-wrap gap-2">{@render pill('/docs', 'Docs')}{@render pill('/docs/playerjs', 'Player API', '', false, true)}</p>
		</div>
		<p class="t-body text-body">
			Every part of Iframely is yours to adjust, through settings, query-string parameters and design editors.
		</p>
	</div>
	<div class="mt-14"><CustomizeSheet items={customize} flat /></div>
</section>

<!-- "Performance". The lead card (click-to-play) is as wide as the page: its text and link on the left, its scene's
     window on the right. It is white as every other card: the page has no black block. Under it the other three, a third of the page each. All four windows are whole, none cut by
     its card's foot. -->
<section id="performance" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">03</span>For readers
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Fast and beautiful, on every device</h2>
		<p class="t-body text-body">
			Embeds are often the heaviest thing on a page. Ours load late, hold their place and stay light until someone
			presses play.
		</p>
	</div>
	<div class="mt-14 grid overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08)] lg:grid-cols-[0.8fr_1.5fr]">
		<div class="flex flex-col items-start px-9 pt-8 pb-8">
			<h3 class="text-[22px] leading-[1.3] font-medium text-fg">{performance[0][0]}</h3>
			<p class="t-small mt-2 text-[15px]! text-pretty text-mute">{performance[0][1]}</p>
		</div>
		<div class="flex flex-col pt-0 lg:pt-3"><DevCover scene="play" bare n={56} whole /></div>
	</div>
	<div class="mt-4 grid gap-4 md:grid-cols-3">
		{#each performance.slice(1) as [name, body, href, cta, scene], i (name)}
			{@render flatCard(name, body, href, cta, scene, i + 1, 32, undefined, true)}
		{/each}
	</div>
</section>

<!-- "For your product team": the page's block head (tag, heading on the left, the opening paragraph on the right), then
     the rest of the copy as three sub-sections on one sheet (the provider wall's box), side by side and parted by
     hairlines: a mini scene on drawing paper on top (DevCover's bare cover, 32 squares across), then a heading and a
     short text. The closing line is the sheet's foot, as on the provider wall. -->
<section id="upkeep" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">04</span>For product teams
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Your embeds are in good hands</h2>
		<p class="t-body text-body">
			Embeds are an ever-growing long-tail challenge: every provider is different, and they all keep changing. We take
			care of the updates and the coverage, so your team can focus on your product, get it done and move on.
		</p>
	</div>
	<div class="mt-14 rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08)]">
		<!-- each column is the cover over the text, and the three share two rows (a subgrid): the covers are one height,
		     whatever their scenes and however many lines the texts run to -->
		<div class="grid divide-y divide-black/8 md:grid-cols-3 md:grid-rows-[auto_auto] md:divide-x md:divide-y-0">
			{#each upkeep as [name, body, scene], i (name)}
				<div class="flex flex-col pt-3 md:row-span-2 md:grid md:grid-rows-subgrid">
					<DevCover scene={scene as DevScene} bare pattern={i} n={32} whole />
					<div class="px-9 pt-6 pb-8">
						<h3 class="text-[18px] leading-[1.35] font-medium text-fg">{name}</h3>
						<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">{body}</p>
					</div>
				</div>
			{/each}
		</div>
		<p class="t-small rounded-b-lg border-t border-black/8 bg-black/[0.025] px-9 py-5 text-center text-[15px]! text-mute">
			We've seen plenty of providers come and go. Iframely is 15 years strong, and carrying on.
		</p>
	</div>
</section>

<!-- Who uses it, as /embeds had it until 2026-11-24, moved here whole when /embeds went back to the wall with its own
     strip of figures: the customers' logos taking turns on their own (components/LogoWall.svelte, without its
     strip), and 16px under the wall the figures of the original /embeds page (its Stats block: since 2012, 6,000+
     products, 6.5B requests, 99.99%) as a table: one hairline frame with the cards' 8px corners and no ground, the
     figures its cells with hairlines between them (one row of four; two rows of two on a phone), a small drawing
     beside each.
     (This page had the plain wall with its strip here: <LogoWall />, following the product teams' "15 years strong",
     its strip ending on SOC 2, the next block's subject.) -->
<section id="proof" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-label mb-4 text-faint">Chances are, we've already met</p>
	<LogoWall stats={false} auto />
	<div id="figures" class="mt-4">
		<dl class="grid grid-cols-2 overflow-hidden rounded-lg ring-1 ring-black/8 ring-inset md:grid-cols-4">
			{#each [['2012', 'Serving since'], ['6,000+', 'Products use Iframely'], ['6.5B', 'Requests a month'], ['99.99%', 'Uptime']] as [value, label] (label)}
				<div class="flex min-w-0 flex-col-reverse border-black/8 p-5 max-md:even:border-l max-md:nth-[n+3]:border-t sm:px-6 md:not-first:border-l">
					<dt class="t-small mt-1.5 text-mute">{label}</dt>
					<!-- the figure at the left, its drawing at the right of the same line (the svg comes first in the markup) -->
					<!-- (the headings' type, smaller: 24px, not their 32px, and the label 14px) -->
					<dd class="t-h2 flex flex-row-reverse items-center justify-between gap-4 text-[24px]! text-fg">
						<!-- a small drawing over each figure, in grey with one blue mark: the years as ticks from 2012 to now, the
						     products as a field of dots, the requests as rising bars, the uptime as a status page's row of bars
						     with one grey among the blue -->
						<svg class="block min-w-0 shrink" width="119" height="22.4" viewBox="0 0 170 32" aria-hidden="true">
							{#if value === '2012'}
								<path d="M0 31.5h170" stroke="#000" stroke-opacity=".15" />
								{#each Array(15) as _, i (i)}
									<rect x={i * 12} y={i % 14 ? 20 : 6} width="1.5" height={i % 14 ? 12 : 26} fill={i % 14 ? '#000' : 'var(--color-rich)'} fill-opacity={i % 14 ? 0.2 : 1} />
								{/each}
							{:else if value === '6,000+'}
								{#each Array(45) as _, i (i)}
									<circle cx={2 + (i % 15) * 11.85} cy={4 + Math.floor(i / 15) * 12} r="2" fill={i === 44 ? 'var(--color-rich)' : '#000'} fill-opacity={i === 44 ? 1 : 0.16} />
								{/each}
							{:else if value === '6.5B'}
								{#each Array(15) as _, i (i)}
									{@const h = 5 + 27 * Math.pow(i / 14, 1.7)}
									<rect x={i * 12} y={32 - h} width="8" height={h} rx="1" fill={i === 14 ? 'var(--color-rich)' : '#000'} fill-opacity={i === 14 ? 1 : 0.12} />
								{/each}
							{:else}
								{#each Array(43) as _, i (i)}
									<rect x={i * 4} y="4" width="2" height="28" rx="1" fill={i === 30 ? '#000' : 'var(--color-rich)'} fill-opacity={i === 30 ? 0.2 : 0.45} />
								{/each}
							{/if}
						</svg>{value}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<!-- "Privacy and security" as a bento: the lead card (the iframe) takes the left half, two rows tall, with a working
     scene (components/SecurityDemo.svelte); on the right the consent card across the top, also working, and under it
     the two short facts side by side, a quarter of the page each, with DevCover's scenes. -->
<section id="security" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">05</span>For security teams
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Third-party media, without the third-party worries</h2>
		<p class="t-body text-body">
			Embeds bring other people's code to your page. Ours run apart from it, wait for consent and stand up to an
			audit.
		</p>
	</div>
	<!-- Four cards: the two working scenes, and the two short facts (the audit, your own domain) as two square cards
	     under the consent scene. A fact's picture is as small as it can be, drawn straight on the grey with no window:
	     a round SOC 2 seal; a CDN host taken out and yours put in. -->
	<div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each security as [name, body, , , scene], i (name)}
			<div
				class="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08)] {i === 0
					? 'md:col-span-2 lg:row-span-2'
					: i === 1
						? 'md:col-span-2'
						: ''}"
			>
				<div class="{i < 2 ? '' : 'grow'} px-9 pt-8 pb-6">
					<h3 class="{i === 0 ? 'text-[22px] leading-[1.3]' : 'text-[18px] leading-[1.35]'} font-medium text-fg">{name}</h3>
					<p class="t-small mt-1.5 max-w-[440px] text-[15px]! text-pretty text-mute">{body}</p>
				</div>
				{#if i < 2}
					<div class="grow p-3 pt-0"><SecurityDemo scene={scene as 'frame' | 'consent'} /></div>
				{:else}
					<div class="mx-3 mb-3 grid h-[112px] place-items-center rounded-md bg-[#f4f4f5]" aria-hidden="true">
						{#if scene === 'audit'}
							<!-- a seal, not the AICPA's own mark: a double ring with the report's name -->
							<svg width="72" height="72" viewBox="0 0 72 72" fill="none">
								<circle cx="36" cy="36" r="34.5" stroke="var(--color-rich)" stroke-width="1.5" />
								<circle cx="36" cy="36" r="29.5" stroke="var(--color-rich)" stroke-opacity=".3" />
								<text x="36" y="35" text-anchor="middle" font-family="var(--ff-mono), ui-monospace, monospace" font-size="13" font-weight="600" fill="var(--color-rich)">SOC 2</text>
								<text x="36" y="48" text-anchor="middle" font-family="var(--ff-mono), ui-monospace, monospace" font-size="8" letter-spacing=".08em" fill="var(--color-rich)">TYPE II</text>
							</svg>
						{:else}
							<p class="font-mono text-[12px] leading-[1.9]">
								<s class="block text-mute/70">− cdn.iframe.ly</s>
								<span class="block text-rich">+ media.your-app.com</span>
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<!-- The way on to the Preview API: not a numbered block but one sheet (the provider wall's box) in two parts, in the
     Preview API's violet. On the left the heading, the text and the link; on the right, on dotted paper,
     the three kinds of link the text names, each as the tidy card it becomes. -->
<section id="previews" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-16">
	<!-- built as the blocks' lead cards (the developers' one): the text column a third of the page wide, the title in
	     the cards' own 22px, the text under it, the link at the column's foot; the pictures in the page's greys -->
	<div class="grid overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08)] lg:grid-cols-[calc((100%-2rem)/3)_minmax(0,1fr)]">
		<div class="flex flex-col items-start px-9 pt-8 pb-8">
			<h2 class="text-[22px] leading-[1.3] font-medium text-fg">Plus, previews for the rest of the web</h2>
			<p class="t-small mt-2 text-[15px]! text-pretty text-mute">
				News articles, product pages, repositories: the Preview API turns links without a player into tidy cards, from
				the same request.
			</p>
			{@render pill('/preview-api', 'See the Preview API', 'mt-6 lg:mt-auto')}
		</div>
		<div class="p-3 pt-0 lg:pt-3 lg:pl-0" aria-hidden="true">
			<div class="dotted grid h-full grid-cols-3 items-center gap-3 rounded-md px-4 py-8 sm:gap-4 sm:px-7">
				{#each previews as [kind, host, extra] (kind)}
					<!-- the page's cards and sheets are flat (a hairline, no shadow); only the scenes' windows and these cards, the
					     objects lying on paper, are raised. Radii nest: card 8px, paper 6px, window 6px, blocks inside 4px. -->
					<div class="overflow-hidden rounded-md bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]">
						<!-- the card's picture, with what kind of page it is -->
						<div class="relative aspect-[16/9] bg-black/7">
							<span class="absolute top-2.5 left-3 font-mono text-[11px] leading-none text-mute">{kind}</span>
						</div>
						<div class="p-3">
							<div class="h-2 w-[88%] rounded-full bg-black/12"></div>
							<div class="mt-2 h-2 w-[60%] rounded-full bg-black/12"></div>
							<p class="mt-3.5 flex items-center justify-between gap-2 font-mono text-[11px] leading-none text-mute">
								<span class="truncate">{host}</span><span class="shrink-0 text-fg max-sm:hidden">{extra}</span>
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- The page's closing call to action, before the footer: the blue window that sat under the hero wall
     (components/CtaWindow.svelte), with the heading and the tagline of the plain block it replaces. Not marked
     .hero-cta: the Tweakpane switch for the heroes' windows leaves it alone. -->
</div>
<div class="wrap mt-16 mb-16">
	<CtaWindow
		plain
		title="Start free, leave the upkeep to us"
		text="2,000 hits a month, no card needed. As you grow, Iframely still costs less than one developer looking after embeds in-house, and that job does need one."
		buttons={[
			['Get an API key', '#signup'],
			['Try a link', '/try']
		]}
	/>
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