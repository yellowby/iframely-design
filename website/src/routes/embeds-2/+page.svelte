<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Button from '#lib/components/Button.svelte';
	import LogoWall from '#lib/components/LogoWall.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import ProviderWall from '#lib/components/ProviderWall.svelte';
	import EmbedWall from '#lib/components/EmbedWall.svelte';
	import CtaWindow from '#lib/components/CtaWindow.svelte';
	import CustomizeSheet from '#lib/components/CustomizeSheet.svelte';
	import DevCover, { type DevScene } from '#lib/components/DevCover.svelte';
	import { PANEL } from '#lib/card.ts';

	// Copy: the iframely-marketing demo site (demos/website, /embeds; plans/website/embeds-page-copy.md, draft 2, 2026-10-27).
	// "For your developers" cards: title, text, link, link label
	const developers = [
		['Already speak oEmbed?', 'Then your CMS or editor already speaks Iframely.', '/docs', 'API docs', 'oembed'],
		['Ready for your editor', 'A WordPress plugin and guides for CKEditor and TinyMCE, with Tiptap, Lexical and Editor.js adapters on the way.', '/integrations', 'Integrations', 'editor'],
		['Built on React, Vue or React Native?', 'One script to approve, instead of dozens.', '/docs', 'Docs', 'script'],
		['No back-end at all?', 'embed.js and our HTML template keep every embed current on their own.', '/docs/reference', 'embed.js', 'template']
	];
	// "Performance" cards: the same; two have no link (empty strings keep the scene in the fifth place)
	const performance = [
		['Click-to-play', 'A light cover stands in until someone presses play, saving around 500 KB on every YouTube video.', '/docs/click-to-play', 'Docs', 'play'],
		['Stays out of the way', 'Regular iframes hold up your page until they load. Ours load in the background, just before readers scroll to them.', '', '', 'lazy'],
		['Predictive height', 'Posts take their place on the page before they even load, so text stays where readers left it and your Core Web Vitals stay healthy.', '', '', 'height'],
		['One video at a time', 'A single setting keeps one player playing, and muted autoplay on scroll is there wherever providers allow it.', '/docs/autoplay', 'Docs', 'single']
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
		['One player API', 'It works the same across every provider: play on scroll, pause when a reply comes in, mute a busy thread.', '/docs/playerjs', 'Player API docs'],
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
	title={'Perfect embeds, <span class="text-rich">every time</span>'}
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
<section id="providers" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
	<!-- a tag without a number: the opener of the tour, where the hero's wall ends; the numbers start with the blocks
	     written for someone -->
	<p class="t-tag text-rich">Coverage</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Over 1,900 media providers, and growing</h2>
		<p class="t-body text-body">
			From YouTube and Spotify to Figma, Google Docs and Calendly, and the one you've never heard of. Every provider is
			prepared with care, and reviewed by hand all year round.
		</p>
	</div>
	<!-- the stickers are links to the providers' pages; the foot is reworded here ("chances are" is the logo wall's line) -->
	<div class="mt-14"><ProviderWall links tame foot="Whatever your users paste tomorrow, it probably works today." /></div>
</section>

<!-- The link of a card or a sheet: a small black pill with an arrow -->
{#snippet pill(href: string, cta: string, cls = '')}
	<a
		{href}
		class="group t-small inline-flex items-center gap-1 rounded-full bg-fg py-1.5 pr-2.5 pl-3.5 font-medium text-white transition-colors hover:bg-body {cls}"
		>{cta}<svg class="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" /></svg></a
	>
{/snippet}

<!-- One card of the card blocks, as the hero wall's windows (8px corners, hairline ring, soft shadow): the title, the
     text and the link on top, the cover under them. The cover is set 12px inside the card (DevCover's bare mode), its
     window two squares further in; the text lines up with that window, 36px in. The title is set as the window
     bars' neighbour: 18px medium; the text under it is grey, a step quieter. The link is the black pill lying on the
     cover, in its bottom-right corner. n: the paper's squares across, for a card narrower than half the page. -->
{#snippet flatCard(name: string, body: string, href: string, cta: string, scene: string, pattern: number, n?: number)}
	<div class="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]">
		<div class="order-first grow px-9 pt-7 pb-6">
			<h3 class="text-[18px] leading-[1.35] font-medium text-fg">{name}</h3>
			<p class="t-small mt-1.5 max-w-[440px] text-[15px]! text-pretty text-mute">{body}</p>
		</div>
		<DevCover scene={scene as DevScene} bare {pattern} {n} />
		{#if cta}{@render pill(href, cta, 'absolute right-6 bottom-6')}{/if}
	</div>
{/snippet}

<!-- A block laid out as the home page's product sections: the tag, then the heading on the left and the text (if any)
     on the right; under them four cards, two by two: text on top, a cover placeholder below. -->
{#snippet cardBlock(id: string, tag: string, title: string, text: string, cards: string[][], flat = false, num = '')}
	<section {id} class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
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
					{@render flatCard(name, body, href, cta, scene, i % 4)}
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

{@render cardBlock(
	'developers',
	'For developers',
	'The embeds API you wish you built yourself',
	'Send a URL, get HTML back. Connect once, and every feature comes through the same endpoint.',
	developers,
	true,
	'01'
)}

<!-- "For your product team": the page's block head (tag, heading on the left, the opening paragraph on the right), then
     the rest of the copy as three sub-sections on one sheet (the provider wall's box), side by side and parted by
     hairlines: a mini scene on drawing paper on top (DevCover's bare cover, 32 squares across), then a heading and a
     short text. The closing line is the sheet's foot, as on the provider wall. -->
<section id="upkeep" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">02</span>For product teams
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Your embeds are in good hands</h2>
		<p class="t-body text-body">
			Embeds are an ever-growing long-tail challenge: every provider is different, and they all keep changing. We take
			care of the updates and the coverage, so your team can focus on your product, get it done and move on.
		</p>
	</div>
	<div class="mt-14 rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]">
		<div class="grid divide-y divide-black/8 md:grid-cols-3 md:divide-x md:divide-y-0">
			{#each upkeep as [name, body, scene], i (name)}
				<div class="flex flex-col pt-3">
					<DevCover scene={scene as DevScene} bare pattern={i} n={32} />
					<div class="px-6 pt-3 pb-7">
						<h3 class="text-[18px] leading-[1.35] font-medium text-fg">{name}</h3>
						<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">{body}</p>
					</div>
				</div>
			{/each}
		</div>
		<p class="t-small border-t border-black/8 px-6 py-5 text-center text-[15px]! text-mute md:px-9">
			We've seen plenty of providers come and go. Iframely is 15 years strong, and carrying on.
		</p>
	</div>
</section>

<!-- Who uses it: the site's trust block as on the home page and /pricing (components/LogoWall.svelte: the customers'
     logos taking turns, with the stats strip under them), under this page's own label. No tag or heading, and no
     padding of its own: a strip between two blocks, 96px from each (their own padding). It follows the product
     teams' "15 years strong" and its strip ends on SOC 2, the next block's subject. -->
<section id="proof" class="wrap scroll-mt-[calc(var(--header-h)+24px)]">
	<p class="t-label mb-4 text-faint">Chances are, we've already met</p>
	<LogoWall />
</section>

<!-- As the developers' block: the numbered tag, the heading and the text, then four cards two by two, each a title and
     a sentence over a mini scene on drawing paper. -->
{@render cardBlock(
	'security',
	'Privacy and security',
	'Third-party media, without the third-party worries',
	"Your security team will ask, so here's the short answer:",
	security,
	true,
	'03'
)}

{@render cardBlock('performance', 'Performance', 'Fast and beautiful, on every device', '', performance, true, '04')}

<!-- "For your editors" and "For your app" as one block, with the page's block head. Under it one sheet in two parts
     (components/CustomizeSheet.svelte): on the left a working scene, on the right the copy as four rows. Each row is a
     switch for its own scene, and they take turns on their own. -->
<section id="customization" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
	<p class="t-tag flex items-center gap-2.5 text-rich">
		<span class="rounded-sm bg-rich/10 px-1.5 py-1 text-[12px] leading-none">05</span>For editors and apps
	</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Customize, fine-tune and white-label</h2>
		<p class="t-body text-body">
			Every part of Iframely is yours to adjust, through settings, query-string parameters and design editors.
		</p>
	</div>
	<div class="mt-14"><CustomizeSheet items={customize} /></div>
</section>

<!-- The way on to the Preview API: not a numbered block but one sheet (the provider wall's box) in two parts, in the
     Preview API's violet. On the left the heading, the text and the link; on the right, on dotted paper,
     the three kinds of link the text names, each as the tidy card it becomes. -->
<section id="previews" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
	<div class="grid rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))] lg:grid-cols-[1fr_1.25fr]">
		<div class="flex flex-col items-start justify-center px-6 py-9 md:px-9">
			<h2 class="t-h2 text-[26px]! text-fg">Plus, previews for the rest of the web</h2>
			<p class="t-small mt-3 max-w-[440px] text-[15px]! text-pretty text-mute">
				News articles, product pages, repositories: the Preview API turns links without a player into tidy cards, from
				the same request.
			</p>
			<a
				href="/preview-api"
				class="group t-small mt-7 inline-flex items-center gap-1 rounded-full bg-fg py-1.5 pr-2.5 pl-3.5 font-medium text-white transition-colors hover:bg-body"
				>See the Preview API<svg class="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" /></svg></a
			>
		</div>
		<div class="p-3 pt-0 lg:pt-3 lg:pl-0" aria-hidden="true">
			<div class="dotted grid h-full grid-cols-3 items-center gap-3 rounded-md px-4 py-8 sm:gap-4 sm:px-7">
				{#each previews as [kind, host, extra] (kind)}
					<div class="overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]">
						<!-- the card's picture, with what kind of page it is -->
						<div class="relative aspect-[16/9] bg-preview/8">
							<span class="absolute top-2.5 left-3 font-mono text-[11px] leading-none text-preview">{kind}</span>
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
<div class="wrap mb-16">
	<CtaWindow
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
		background-color: #fafafa;
		background-image: radial-gradient(circle, rgb(0 0 0 / 0.1) 1px, transparent 1.5px);
		background-size: 12px 12px;
	}
</style>