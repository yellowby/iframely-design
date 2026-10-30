<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Scene from '#lib/components/Scene.svelte';
	import LogoWall from '#lib/components/LogoWall.svelte';
	import Pill from '#lib/components/Pill.svelte';
	import canva from '#lib/assets/marks/canva.svg';
	import notion from '#lib/assets/marks/notion.svg';
	import gitbook from '#lib/assets/marks/gitbook.svg';

	// Home01 (Figma "Design 2027", Wireframes, 2026-10-30): hero with the S41 scene, trust, the connecting heading, the
	// four products, each with its scene from the motion lab under it. Blocks, order and copy follow the frame; more blocks and the footer come in later steps.
	let cycle = $state(0);
	let hero = $state<HTMLDivElement>();

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

	// Trust block: heading and cards from the iframely-marketing copy demo (demos/website, home), its logo row left out
	const TRUST: [string, string, string, string][] = [
		['Signed requests', 'Every request is signed with Web Bot Auth. Check our key directory and IP ranges.', '/verification', 'Verify our agents'],
		['Allowed by publishers', 'Cloudflare and AWS verify our preview agent. DataDome customers authorize us 100% of the time.', '/docs/allowlisting', 'How to allow Iframely'],
		['Trusted by developers', 'Canva, Notion and Circle point their users to Iframely in their own docs.', '/embeds#proof', 'Read the quotes'],
		['Audited and transparent', 'SOC 2 Type II, Automated Processing Terms, a public Publisher Policy and uptime status.', '#trust', 'Trust center']
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

<section class="wrap mt-28 flex flex-wrap items-center justify-between gap-8">
	<h2 class="t-h2 max-w-[540px] text-fg">Connecting developers and publishers, <span class="text-blue">one URL at a time</span></h2>
	<div class="flex gap-2">
		<Pill href="/try" variant="secondary">Check URL</Pill>
		<Pill href="#signup">Get API key</Pill>
	</div>
</section>

<div class="wrap mt-40 mb-40 flex flex-col gap-40">
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

<section id="trust" class="wrap mb-40 scroll-mt-[calc(var(--header-h)+24px)]">
	<h2 class="t-h2 text-fg">Trusted on both sides of the URL</h2>
	<div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each TRUST as [title, text, href, cta] (title)}
			<a {href} class="flex flex-col rounded-xl border border-black/8 p-6 transition-colors hover:border-black/25">
				<h3 class="t-note font-medium! text-fg">{title}</h3>
				<p class="t-small mt-2 text-body">{text}</p>
				<p class="t-small mt-auto pt-6 text-blue">{cta} →</p>
			</a>
		{/each}
	</div>
</section>
