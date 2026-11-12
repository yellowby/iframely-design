<script lang="ts">
	import { onMount } from 'svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Scene from '#lib/components/Scene.svelte';
	import LogoWall from '#lib/components/LogoWall.svelte';
	import Pill from '#lib/components/Pill.svelte';
	import PricingBlock from '#lib/components/PricingBlock.svelte';
	import GlyphSection from '#lib/components/GlyphSection.svelte';
	import DitherHead from '#lib/components/DitherHead.svelte';
	import { ICONS, type IconName } from '#lib/data/icons.ts';
	import { CARD } from '#lib/card.ts';
	import { cards } from '#lib/tweaks.svelte.ts';

	const flush = $derived(cards.fit === 'flush');
	const solid = $derived(cards.cover === 'solid');
	import canva from '#lib/assets/marks/canva.svg';
	import notion from '#lib/assets/marks/notion.svg';
	import gitbook from '#lib/assets/marks/gitbook.svg';

	// Home01 (Figma "Design 2027", Wireframes, 2026-10-30): hero with the S41 scene, trust, the connecting heading, the
	// four products, each with its scene from the motion lab under it. Blocks, order and copy follow the frame; more blocks and the footer come in later steps.
	let cycle = $state(0);
	let hero = $state<HTMLDivElement>();

	// "one URL at a time" in the connecting heading fades slowly through the four product accents, holding on each.
	// Hovering a product card under it pulls the colour to that product's; leaving lets it ease back into the cycle,
	// which keeps running underneath. With reduced motion the cycle stays on blue; a hovered card still sets its colour.
	const ACCENTS = ['#0055ff', '#6a3bff', '#a52fd0', '#c81d77'].map((c) => {
		const n = parseInt(c.slice(1), 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	});
	const STEP = 4000; // ms per accent: a hold, then the fade to the next
	const FADE = 1600;
	let accent = $state<HTMLSpanElement>();
	let hovered = -1; // index of the hovered card

	onMount(() => {
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let raf = 0, pull = 0, to = ACCENTS[0], shown = '';
		const frame = (ms: number) => {
			raf = requestAnimationFrame(frame);
			const i = still ? 0 : Math.floor(ms / STEP) % 4, k = still ? 0 : Math.max(0, ((ms % STEP) - (STEP - FADE)) / FADE);
			const a = ACCENTS[i], b = ACCENTS[(i + 1) % 4];
			if (hovered >= 0) to = ACCENTS[hovered];
			pull += ((hovered >= 0 ? 1 : 0) - pull) * (still ? 1 : 0.1);
			if (pull < 0.004) pull = 0;
			const rgb = a.map((v, j) => Math.round(v + (b[j] - v) * k + (to[j] - (v + (b[j] - v) * k)) * pull));
			const css = `rgb(${rgb.join(' ')})`;
			if (css !== shown && accent) accent.style.color = shown = css;
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	});

	// path is the tag (Figma's text), href the product page it links to; the section's id is the path without the slash
	type Product = {
		path: string;
		href: string;
		scene?: 'rich' | 'preview' | 'data' | 'pub';
		color: string;
		title: string;
		text: string;
		note: string;
		marks?: { src: string; alt: string; w: number }[];
		buttons: [string, string][];
	};
	const PRODUCTS: Product[] = [
		{
			path: '/embeds',
			href: '/embeds',
			scene: 'rich',
			color: 'text-rich',
			title: 'Rich media from 1,900 providers, kept up to date',
			text: "Send a URL, get a responsive embed: video, audio, social posts, maps, documents and more. Fast, secure and beautiful, on all your users' devices. When a new provider is added or updated, you get it.",
			note: 'The embed engine behind Canva, Notion and GitBook.',
			marks: [
				{ src: canva, alt: 'Canva', w: 20 },
				{ src: notion, alt: 'Notion', w: 20 },
				{ src: gitbook, alt: 'GitBook', w: 22 }
			],
			buttons: [
				['Rich media', '/embeds'],
				['Supported providers', '/domains']
			]
		},
		{
			path: '/preview-api',
			href: '/preview-api',
			scene: 'preview',
			color: 'text-preview',
			title: 'A preview for every link your users share, from any site',
			text: 'Send any public URL, get the title, source, author, thumbnails and a ready summary card. Keep Rich Media on for players, or turn it off for metadata only.',
			note: 'The product behind link previews in Atlassian, Notion and GitBook.',
			buttons: [
				['Preview API', '/preview-api'],
				['Check URL', '/try']
			]
		},
		{
			path: '/data-api',
			href: '/data-api',
			scene: 'data',
			color: 'text-data',
			title: 'Machine-ready data processing: declared, signed and logged',
			text: "Declare why you're reading a URL. We fetch it with a signed, named agent, Content Signals, the license and Publisher Console settings, and return what fits both your purpose and the publisher's signals.",
			note: 'Iframely works with publishers, not around them.',
			buttons: [
				['Data API', '/data-api'],
				['Docs', '/docs']
			]
		},
		{
			path: '/console',
			href: '/publishers',
			scene: 'pub',
			color: 'text-pub',
			title: 'Control over your content, page by page and app by app',
			text: 'See which products fetch your pages and why. Set a processing policy and other rules for the whole domain, a path or an individual Iframely customer. Test any declared use on your own pages and see what each would receive.',
			note: 'Free read-only access by email. Full access after DNS verification.',
			buttons: [
				['Publisher Console', '/publishers'],
				['Docs', '/docs']
			]
		}
	];

	// The four product boxes under the connecting heading: audience tag (in the product colour), name and text, from the
	// iframely-marketing copy demo (demos/website, home). The whole box links to the product page; no link line inside.
	// The card is D14 from the motion lab: a cover with the product's icon (the one in the header's Product dropdown)
	// dithered in its colour (the last two fields), and the audience tag over it.
	const CONNECT: [string, string, string, string, string, string, keyof typeof TINT][] = [
		['For content platforms', 'text-rich', 'Rich Media', 'Embeds for over 1,900 providers and growing, through one API. Tracking provider changes since 2012.', '/embeds', '#0055ff', 'rich'],
		['For collaboration apps', 'text-preview', 'Preview API', 'Link previews and cards for public URLs, across the formats publishers use. One API to connect to.', '/preview-api', '#6a3bff', 'preview'],
		['For automated systems', 'text-data', 'Data API', 'Readable content, entities, Markdown and publisher permissions for automated processing.', '/data-api', '#a52fd0', 'data'],
		['For publishers', 'text-pub', 'Publisher Console', 'A free account to see who fetches your pages and set how they are used, per domain, path and app.', '/publishers', '#c81d77', 'pub']
	];

	// Product and trust cards use the site's card (lib/card.ts). The product cards set its hover colours: the product
	// colour (--m) and its tint (--t), the scene's (lib/scene/sec.js, PROD); the trust cards keep the grey default.
	const TINT = { rich: '#e8efff', preview: '#efeaff', data: '#f7ebfc', pub: '#fdecf5' };

	// Trust block: heading and cards from the iframely-marketing copy demo (demos/website, home), its logo row left out
	// (title, text, link, icon)
	const TRUST: [string, string, string, IconName][] = [
		['Built into apps you use', "Chances are, we've met. Iframely works behind the scenes in Canva, Notion, Circle and Atlassian.", '/embeds#proof', 'apps'],
		['Signed and verified', 'Web Bot Auth on every request. Verify Iframely like Cloudflare, AWS and DataDome already do.', '/verification', 'signed'],
		['Independently audited', 'SOC 2 Type II audits and pen tests, enterprise-ready security and privacy.', 'https://trust.iframely.com', 'audited'],
		['Support you can rely on', 'Every account comes with support, from the team that has looked after the web since 2012.', 'mailto:support@iframely.com', 'support']
	];
</script>

<PageMeta
	title="Iframely makes URLs work inside other products"
	description="Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content."
/>

<section class="wrap pt-20">
	<h1 class="t-hero max-w-[720px] text-balance text-fg">We make URLs work inside other products</h1>
	<p class="t-lead mt-4 max-w-[720px] text-mute">
		Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated
		systems. Decide how other apps use your own content.
	</p>
	<!-- the box is reserved at the scene's height for each of its layouts (it switches on its own width: four windows
	     in a row, two by two at 980px and under, one column at 560px and under), so nothing moves when it mounts -->
	<div bind:this={hero} class="@container mt-10">
		<Scene
			scene="home"
			class="min-h-[290px] @max-[980px]:min-h-[490px] @max-[560px]:min-h-[920px]"
			onCycle={() => cycle++}
		/>
	</div>
</section>

<section class="wrap mt-14">
	<p class="t-label mb-4 text-faint">Trusted by products where real people share URLs</p>
	<LogoWall step={cycle} lead={hero} />
</section>

<section class="wrap mt-28">
	<h2 class="t-h2 max-w-[540px] text-fg">Connecting developers and publishers, <span bind:this={accent} class="text-rich">one URL at a time</span></h2>
</section>

<section class="wrap mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	{#each CONNECT as [tag, color, title, text, href, hex, icon], i (title)}
		<a {href} onpointerenter={() => (hovered = i)} onpointerleave={() => (hovered = -1)} style="--m:{hex};--t:{TINT[icon]}" class="flex flex-col {CARD}">
			<!-- the cover is a tile set 8px inside the card; its tag and icon keep the body text's left edge (8 + 16 = 24px) -->
			<!-- radius 4: the card's 12 less the 8px inset, so the corners are concentric -->
			<!-- two switches from the Tweakpane panel (lib/tweaks.svelte.ts): flush runs the cover to the card's edges, its
			     tag and icon then 24px in; solid inverts it, the product colour as the ground with white tag and icon -->
			<div class="relative overflow-hidden {flush ? 'rounded-t-xl' : 'm-2 rounded-sm'}">
				<DitherHead color={hex} {icon} seed={i} invert={solid} pad={flush ? 24 : 16} />
				<!-- a glow in the cover's ground colour (12% of the product's, or the colour itself) keeps the line readable over the dither -->
				<p
					class="t-small absolute [font-family:var(--ff-heading)]! [text-shadow:0_0_2px_var(--g),0_0_4px_var(--g),0_0_8px_var(--g),0_0_12px_var(--g)] {flush
						? 'top-5 left-6'
						: 'top-3 left-4'} {solid ? 'text-white' : color}"
					style="--g:{solid ? hex : `color-mix(in srgb, ${hex} 12%, white)`}"
				>
					{tag}
				</p>
			</div>
			<div class="p-6 {flush ? 'pt-5' : 'pt-4'}">
				<h3 class="t-small text-[15px]! font-medium! text-fg">{title}</h3>
				<p class="t-small mt-1 text-body">{text}</p>
			</div>
		</a>
	{/each}
</section>

<div class="wrap mt-40 mb-16 flex flex-col gap-40">
	{#each PRODUCTS as p (p.path)}
		<section id={p.path.slice(1)} class="scroll-mt-[calc(var(--header-h)+24px)]">
			<a href={p.href} class="t-tag {p.color} hover:underline">{p.path}</a>
			<div class="mt-5 grid gap-x-16 gap-y-8 md:grid-cols-2">
				<div>
					<h2 class="t-h2 text-fg">{p.title}</h2>
					<div class="mt-8 flex flex-wrap gap-2">
						{#each p.buttons as [label, href], i (label)}
							<Pill {href} variant={i ? 'secondary' : 'primary'}>{label}</Pill>
						{/each}
					</div>
				</div>
				<div>
					<p class="t-body text-body">{p.text}</p>
					<div class="mt-[18px] flex items-center gap-3.5">
						{#if p.marks}
							<span class="flex shrink-0 items-center gap-2.5"
								>{#each p.marks as m (m.alt)}<img src={m.src} alt={m.alt} width={m.w} height="20" />{/each}</span
							>
						{/if}
						<p class="t-note text-soft">{p.note}</p>
					</div>
				</div>
			</div>
			{#if p.scene}
				<Scene scene={p.scene} class="mt-16 {p.scene === 'rich' ? 'min-h-[580px]' : ''}" />
			{/if}
		</section>
	{/each}
</div>

<PricingBlock />

<section id="trust" class="wrap mt-16 mb-28 scroll-mt-[calc(var(--header-h)+24px)]">
	<h2 class="t-h2 text-fg">Your URLs are in good hands</h2>
	<div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each TRUST as [title, text, href, icon] (title)}
			<a {href} class="flex flex-col p-6 {CARD}">
				<svg class="mb-5 text-fg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round" aria-hidden="true">
					<path d={ICONS[icon]} />
				</svg>
				<h3 class="t-small text-[15px]! font-medium! text-fg">{title}</h3>
				<p class="t-small mt-1 text-body">{text}</p>
			</a>
		{/each}
	</div>
</section>

<div class="wrap mb-24"><GlyphSection sub="Get a free key and try your first URL in a minute, or check a link without signing up." /></div>
