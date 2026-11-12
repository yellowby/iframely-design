<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Stats from '#lib/components/Stats.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PricingBlock from '#lib/components/PricingBlock.svelte';
	import GlyphSection from '#lib/components/GlyphSection.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import ProviderWall from '#lib/components/ProviderWall.svelte';
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
	const security = [
		['Every embed runs in our iframe,', 'apart from your page and its code.'],
		['Readers give their consent', 'before any third-party cookie loads.'],
		['Iframely is SOC 2 Type II audited.', ''],
		['On Enterprise, reader traffic can stay on your own domain:', 'we serve everything from your CDN.']
	];
</script>

<PageMeta
	title="Rich Media: embeds for 1,900 providers, tracking changes since 2012 | Iframely"
	description="Perfect embeds, every time: 1,900 media providers through one API, fast, safe and kept up to date while you sleep. Free to start."
/>

<Hero
	eyebrow="Rich Media"
	title="Perfect embeds, every time"
	sub="Send us a URL, get the embed code back. Today and tomorrow. Videos play, posts appear and maps move, the way people expect from the apps they love, wherever your users write, post and chat."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="secondary">Try a link</Button>
</Hero>

<!-- Our take on iframely.com's "Rich media people like and share": the home sections' two columns, then a wall of
     provider logos sorted by kind of media (components/ProviderWall.svelte), then the link to the full list. -->
<section id="providers" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
	<p class="t-tag text-rich">1,900 providers</p>
	<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
		<h2 class="t-h2 text-fg">Over 1,900 media providers, and growing</h2>
		<div>
			<p class="t-body text-body">
				From YouTube and Spotify to Figma, Google Docs and Calendly, and the one you've never heard of. Every provider is
				prepared with care, and reviewed by hand all year round.
			</p>
			<p class="t-note mt-4 text-mute">Whatever your users paste tomorrow, chances are it already works today.</p>
		</div>
	</div>
	<div class="mt-16"><ProviderWall /></div>
	<div class="mt-10 flex justify-center">
		<a
			href="/domains"
			class="t-button inline-flex items-center gap-2.5 rounded-full bg-white py-2 pr-2 pl-5 text-fg ring-1 ring-black/12 transition-shadow ring-inset hover:ring-black/30"
		>
			Browse supported providers
			<span class="rounded-full bg-rich/10 px-2 py-1 text-[12px] leading-none text-rich">1,900+</span>
		</a>
	</div>
</section>

<!-- A block laid out as the home page's product sections: the tag, then the heading on the left and the text (if any)
     on the right; under them four cards, two by two: text on top, a cover placeholder below. -->
{#snippet cardBlock(id: string, tag: string, title: string, text: string, cards: string[][])}
	<section {id} class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
		<p class="t-tag text-rich">{tag}</p>
		<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
			<h2 class="t-h2 text-fg">{title}</h2>
			{#if text}<p class="t-body text-body">{text}</p>{/if}
		</div>
		<div class="mt-16 grid gap-6 md:grid-cols-2">
			{#each cards as [name, body, href, cta, scene] (name)}
				<div class="flex flex-col overflow-hidden {PANEL}">
					<div class="grow p-6">
						<!-- the card is not a link; its link is a small grey chip in the top-right corner, and the title keeps clear of it -->
						{#if cta}
							<a
								{href}
								class="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full py-1 pr-2 pl-2.5 text-[12px] leading-none text-mute ring-1 ring-black/8 transition-colors ring-inset hover:text-fg hover:ring-black/25"
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
	</section>
{/snippet}

{@render cardBlock(
	'developers',
	'For your developers',
	'The embeds API you wish you built yourself',
	'Send a URL, get HTML back. Connect once, and every feature comes through the same endpoint:',
	developers
)}

<Section id="upkeep" eyebrow="For your product team" title="Your embeds are in good hands" narrow>
	<div class="space-y-5 text-ink-700">
		<p class="text-lg">
			Embeds are an ever-growing long-tail challenge: every provider is different, and they all keep changing. We take
			care of the updates and the coverage, so your team can focus on your product, get it done and move on.
		</p>
		<p>
			When a provider changes its code, your embeds update in the background, while you sleep. When it rebrands, we
			follow: mermaid.ai, ardsounds.de and dailymail.com, just this year. Your oldest posts keep playing, and nobody files
			a ticket.
		</p>
		<p>
			It's yours to keep, too. With annual billing, Content IDs carry on working even if you cancel or close your account,
			and our open-source engine runs on your own servers. We've seen plenty of providers come and go. Iframely is 15
			years strong, and carrying on.
		</p>
	</div>
</Section>

<Section
	id="security"
	tone="muted"
	eyebrow="Privacy and security"
	title="Third-party media, without the third-party worries"
	intro="Your security team will ask, so here's the short answer:"
>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each security as [lead, rest] (lead)}
			<div class="rounded-xl border border-ink-100 bg-white p-5 text-[15px] text-ink-700">
				<b class="text-ink-950">{lead}</b>
				{rest}
			</div>
		{/each}
	</div>
</Section>

{@render cardBlock('performance', 'Performance', 'Fast and beautiful, on every device', '', performance)}

<Section id="editors" tone="muted" eyebrow="For your editors" title="Every provider's options, a click away">
	<div class="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
		<div class="space-y-4 text-ink-700">
			<p class="text-lg">
				Start a video at the right moment, switch on captions, pick a theme, show the whole thread. Your editors set each
				provider's own options right in the editor, or choose them on iframely.com and paste the new link. Readers see the
				players they know, so they press play.
			</p>
			<p class="text-ink-500 italic">Not in your editor yet? Forward this page to your developers.</p>
		</div>
		<Placeholder label="Editor with a pasted YouTube link and its options: start time, captions, theme" class="aspect-[16/10]" />
	</div>
</Section>

<Section id="apps" eyebrow="For your app" title="Customize, fine-tune and white-label">
	<div class="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
		<Placeholder label="A chat thread with players wearing the app's own play button" class="aspect-[16/10]" />
		<div class="space-y-4 text-ink-700">
			<p class="text-lg">
				Every part of Iframely is yours to adjust, through settings, query-string parameters and design editors. One player
				API works the same across every provider: play on scroll, pause when a reply comes in, mute a busy thread.
			</p>
			<p>
				Put your own play button on all of them and drop the "Powered by" on any paid volume. On Enterprise, serve the
				iframes under your own name.
			</p>
			<p>Why spend weeks fine-tuning one provider? Our team can adjust it for you, quickly.</p>
			<div class="pt-2"><Button href="/docs/playerjs" variant="secondary">Player API docs</Button></div>
		</div>
	</div>
</Section>

<Section id="proof" tone="muted" eyebrow="In good company" title="Chances are, we've already met">
	<div class="grid gap-4 md:grid-cols-2">
		<blockquote class="rounded-xl border border-ink-100 bg-white p-6">
			<p class="text-lg text-ink-800">“Behind the scenes, Canva uses Iframely to embed media from thousands of different platforms.”</p>
			<footer class="mt-3 text-sm text-ink-500">Canva developer docs · <a href="https://www.canva.dev/docs/apps/embedding-rich-media/" class="text-brand-700">link</a></footer>
		</blockquote>
		<blockquote class="rounded-xl border border-ink-100 bg-white p-6">
			<p class="text-lg text-ink-800">“We support over 1,900 providers through Iframely.”</p>
			<footer class="mt-3 text-sm text-ink-500">Circle help center · <a href="https://help.circle.so/p/posts/post-spaces/embed-content-within-posts" class="text-brand-700">link</a></footer>
		</blockquote>
	</div>
	<div class="mt-8 grid grid-cols-3 gap-3 md:grid-cols-6">
		{#each Array(5) as _, i (i)}<Placeholder label="Customer logo" class="h-14" />{/each}
		<div class="flex h-14 items-center justify-center rounded-lg border-2 border-dashed border-brand-200 bg-white p-2 text-center text-xs font-medium text-brand-700">
			This spot is reserved for your app
		</div>
	</div>
	<p class="mt-8 max-w-3xl text-lg text-ink-700">
		Embed projects are a team sport, and we're happy to be part of yours, every step of the way, with support for every
		account.
	</p>
</Section>

<Section>
	<Stats
		items={[
			{ value: '2012', label: 'Serving since' },
			{ value: '6,000+', label: 'Products use Iframely' },
			{ value: '6.5B', label: 'Requests a month' },
			{ value: '99.99%', label: 'Uptime' }
		]}
	/>
</Section>

<Section id="previews" tone="muted">
	<div class="flex flex-col gap-6 rounded-2xl border border-ink-100 bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-semibold tracking-tight">Plus, previews for the rest of the web</h2>
			<p class="mt-2 text-ink-600">
				News articles, product pages, repositories: the Preview API turns links without a player into tidy cards, from
				the same request.
			</p>
		</div>
		<Button href="/preview-api" variant="secondary">See the Preview API</Button>
	</div>
</Section>

<!-- X01 from the motion lab (the home page's blue glyph block) with the lab's Rich Media copy -->
<div class="wrap mt-24">
	<GlyphSection
		title="Perfect embeds, every time"
		text="Send us a URL, get the embed code back. Today and tomorrow. Videos play, posts appear and maps move, the way people expect from the apps they love, wherever your users write, post and chat."
		note="1,900 providers through one API. Free to start."
		buttons={[
			['Get an API key', '#signup'],
			['Try a link', '/try']
		]}
	/>
</div>

<PricingBlock />

<Cta
	title="Start free. Leave the upkeep to us."
	text="2,000 hits a month, no card needed. As you grow, Iframely still costs less than one developer looking after embeds in-house, and that job does need one. Running at enterprise scale? Ask us for an Enterprise quote."
	signoff="Send us a URL, and may the web be with you."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="#contact" variant="invert">Ask for a quote</Button>
</Cta>

<!-- The hero's tagline, parked here in a block of its own until its place is decided -->
<section class="wrap py-24">
	<p class="t-h2 text-fg">Bringing URLs to life</p>
</section>
