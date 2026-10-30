<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Section from '#lib/components/Section.svelte';
	import Table from '#lib/components/Table.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Button from '#lib/components/Button.svelte';

	// Sample report: the demo does not fetch. Any URL shows the same parsed page.
	const sampleUrl = 'https://www.example-news.com/2026/10/15/city-council-votes';
	let input = $state(sampleUrl);
	let checked = $state(sampleUrl);
	let tab = $state('Tags found');

	type Check = { rule: string; status: 'pass' | 'warn' | 'fail'; detail: string };

	const common: Check[] = [
		{ rule: 'Title length', status: 'pass', detail: '49 characters; under the 70 most apps show.' },
		{ rule: 'Image size', status: 'pass', detail: 'og:image is 1200 × 630, the 1.91:1 large-card shape.' },
		{ rule: 'Image file size', status: 'warn', detail: '1.4 MB. Some apps skip images over 1 MB; WhatsApp and iMessage may show no image.' },
		{ rule: 'og:image:alt', status: 'warn', detail: 'Missing. Screen readers in X, Bluesky and Mastodon read nothing for the image.' }
	];

	const platforms: Record<string, { card: string; checks: Check[] }> = {
		X: {
			card: 'Large image card: image, title, domain',
			checks: [
				{ rule: 'twitter:card', status: 'pass', detail: 'summary_large_image' },
				...common,
				{ rule: 'twitter:site', status: 'warn', detail: 'Missing. X will not credit your account on the card.' }
			]
		},
		Facebook: {
			card: 'Link card: image, domain, title, description',
			checks: [...common, { rule: 'og:type', status: 'pass', detail: 'article' }]
		},
		LinkedIn: {
			card: 'Link card: image, title, domain',
			checks: [...common, { rule: 'Image ratio', status: 'pass', detail: '1.91:1, no cropping.' }]
		},
		Slack: {
			card: 'Unfurl: site name, title, description, image; label and data rows when twitter:label1 is set',
			checks: [
				{ rule: 'oEmbed discovery', status: 'pass', detail: 'Found a JSON oEmbed link; Slack prefers it to Open Graph.' },
				...common.slice(0, 2)
			]
		},
		Discord: {
			card: 'Embed with a coloured bar from theme-color',
			checks: [...common.slice(0, 3), { rule: 'theme-color', status: 'warn', detail: 'Missing. Discord uses a grey bar.' }]
		},
		iMessage: {
			card: 'Rich link: large image, title, domain',
			checks: [common[0], common[2], { rule: 'Icon', status: 'pass', detail: 'apple-touch-icon 180 × 180 found.' }]
		},
		WhatsApp: {
			card: 'Small thumbnail, title, description, domain',
			checks: [common[0], common[2], { rule: 'Description', status: 'pass', detail: '142 characters.' }]
		},
		Bluesky: {
			card: 'External embed: image, title, description, domain',
			checks: [...common]
		}
	};

	const tabs = ['Tags found', ...Object.keys(platforms), 'Iframely view'];

	const og = [
		['og:title', 'City council votes to extend bike lanes downtown'],
		['og:description', 'The 9-2 vote adds 14 km of protected lanes by 2028. Business groups asked for a delivery-zone review…'],
		['og:image', 'https://www.example-news.com/img/council-1200x630.jpg'],
		['og:image:width / height', '1200 × 630'],
		['og:image:alt', '<em>not set</em>'],
		['og:type', 'article'],
		['og:site_name', 'Example News']
	];
	const tw = [
		['twitter:card', 'summary_large_image'],
		['twitter:title', '<em>falls back to og:title</em>'],
		['twitter:site', '<em>not set</em>']
	];
	const oembed = [
		['Discovery link', '&lt;link rel="alternate" type="application/json+oembed"&gt; found'],
		['type', 'rich'],
		['provider_name', 'Example News']
	];
	const jsonld = [
		['@type', 'NewsArticle'],
		['headline', 'City council votes to extend bike lanes downtown'],
		['datePublished', '2026-10-15T08:30:00Z'],
		['author', 'Sample Reporter'],
		['isAccessibleForFree', 'true']
	];

	const tone = { pass: 'good', warn: 'warn', fail: 'bad' } as const;

	const faq = [
		{
			q: 'Is this a replacement for the Twitter card validator?',
			a: 'Yes. X retired its card validator; this tool reads the same twitter: and og: tags and shows the card X builds from them.'
		},
		{
			q: 'Why does my link show no image?',
			a: 'The common causes: no og:image, an image under 200 px wide, a file over 1 MB, an image URL that needs cookies, or a robots rule that blocks the platform\'s fetcher. The checks above flag each one.'
		},
		{
			q: 'I changed my tags. Why does the old preview still show?',
			a: 'Each platform caches previews for days. Facebook and LinkedIn have their own refresh tools; Slack and X refresh on their own schedule. Publishers using Iframely can request a refresh in the Publisher Console (coming).'
		},
		{
			q: 'What happened to debug.iframely.com?',
			a: 'It moved here. Old links, including ones with <code>?uri=</code>, redirect with the URL filled in. The full Iframely report, with your account\'s settings and the <code>access</code> object, is in the dashboard\'s Check URL.'
		},
		{
			q: 'Do you store the URLs I check?',
			a: 'We fetch the page once to read its tags, as the Iframely Preview Agent. We do not keep the page content.'
		}
	];
</script>

<PageMeta
	title="URL debugger: check how X, Facebook, Slack and others preview your link"
	description="Free URL debugger for Open Graph, Twitter Cards and oEmbed. See how X, Facebook, LinkedIn, Slack, Discord, iMessage, WhatsApp and Bluesky preview your link."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-12 md:py-16">
		<p class="mb-3 text-sm font-semibold tracking-wide text-brand-700 uppercase">Open Graph · Twitter Cards · oEmbed</p>
		<h1 class="t-hero text-ink-950">URL debugger</h1>
		<p class="mt-4 max-w-2xl text-lg text-ink-600">
			Check how other apps see your link. Paste a URL to see the tags we find and the preview each platform builds from
			them, with what to fix.
		</p>

		<form
			class="mt-8 flex flex-col gap-2 sm:flex-row"
			onsubmit={(e) => {
				e.preventDefault();
				checked = input.trim() || sampleUrl;
			}}
		>
			<label class="sr-only" for="dbg-url">URL to check</label>
			<input
				id="dbg-url"
				type="url"
				bind:value={input}
				class="min-w-0 flex-1 rounded-md border border-ink-200 bg-white px-3 py-2.5 focus:border-brand-500 focus:outline-none"
			/>
			<button class="rounded-md bg-fg px-5 py-2.5 font-medium text-white hover:bg-body">Debug</button>
		</form>
		<p class="mt-2 text-xs text-ink-500">No sign-up. 30 checks an hour per visitor. Demo: every URL shows a sample report.</p>
	</div>
</section>

<section class="py-10">
	<div class="wrap">
		<p class="text-sm text-ink-500">Report for <span class="font-mono text-ink-800">{checked}</span></p>
		<div class="mt-4 flex gap-1 overflow-x-auto border-b border-ink-100 text-sm" role="tablist">
			{#each tabs as t (t)}
				<button
					type="button"
					role="tab"
					aria-selected={tab === t}
					onclick={() => (tab = t)}
					class="shrink-0 border-b-2 px-3 py-2 {tab === t
						? 'border-brand-600 font-medium text-ink-950'
						: 'border-transparent text-ink-500 hover:text-ink-900'}">{t}</button
				>
			{/each}
		</div>

		<div class="pt-6">
			{#if tab === 'Tags found'}
				<div class="grid gap-6 lg:grid-cols-2">
					<div>
						<h2 class="mb-2 font-semibold">Open Graph</h2>
						<Table head={['Tag', 'Value']} rows={og} />
					</div>
					<div class="space-y-6">
						<div>
							<h2 class="mb-2 font-semibold">Twitter Cards</h2>
							<Table head={['Tag', 'Value']} rows={tw} />
						</div>
						<div>
							<h2 class="mb-2 font-semibold">oEmbed</h2>
							<Table head={['Field', 'Value']} rows={oembed} />
						</div>
					</div>
					<div class="lg:col-span-2">
						<h2 class="mb-2 font-semibold">Structured data (JSON-LD)</h2>
						<Table head={['Property', 'Value']} rows={jsonld} />
					</div>
				</div>
			{:else if tab === 'Iframely view'}
				<div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
					<div class="rounded-lg border-2 border-dashed border-ink-200 bg-ink-100 p-4">
						<div class="aspect-[16/7] rounded bg-ink-200"></div>
						<p class="mt-3 font-semibold">City council votes to extend bike lanes downtown</p>
						<p class="mt-1 text-sm text-ink-600">The 9-2 vote adds 14 km of protected lanes by 2028…</p>
						<p class="mt-2 text-xs text-ink-400">example-news.com · Sample Reporter · 15 Oct 2026</p>
					</div>
					<div class="space-y-3 text-ink-700">
						<p>
							This is the summary card Iframely builds for apps like Notion and GitBook: title, description, image,
							author and date, from the tags above.
						</p>
						<p class="text-sm">
							The full report, with your account's settings, the <code>access</code> object by processing mode, agent
							allow-listing diagnostics and a shareable permalink, is in the dashboard.
						</p>
						<Button href="#signin">Sign in for the full report</Button>
					</div>
				</div>
			{:else}
				{@const p = platforms[tab]}
				<div class="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
					<div>
						<div
							class="flex aspect-[16/10] items-center justify-center rounded-lg border-2 border-dashed border-ink-200 bg-ink-100 p-4 text-center text-xs font-medium tracking-wide text-ink-400 uppercase"
						>
							{tab} preview · {p.card}
						</div>
					</div>
					<ul class="divide-y divide-ink-100 rounded-lg border border-ink-100">
						{#each p.checks as c (c.rule)}
							<li class="flex items-start gap-3 p-3">
								<Badge tone={tone[c.status]}>{c.status}</Badge>
								<div>
									<p class="text-sm font-medium text-ink-950">{c.rule}</p>
									<p class="text-sm text-ink-600">{c.detail}</p>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</section>

<Section tone="muted" title="What the debugger checks">
	<div class="grid gap-6 text-ink-700 md:grid-cols-3">
		<p>
			<b class="text-ink-950">The tags.</b> Open Graph, Twitter Cards, oEmbed discovery and JSON-LD, exactly as a platform's
			fetcher reads them, with fallbacks shown where one tag stands in for another.
		</p>
		<p>
			<b class="text-ink-950">Each platform's rules.</b> Image sizes and ratios, file-size limits, title and description
			lengths, alt text, and the extra tags Slack and Discord use.
		</p>
		<p>
			<b class="text-ink-950">What to fix.</b> Every warning says what the platform will do and which tag changes it.
			Publishers can go further in the <a href="/publishers" class="text-brand-700 underline">Publisher Console</a>.
		</p>
	</div>
</Section>

<Section narrow title="Questions">
	<Faq items={faq} />
	<p class="mt-8 text-sm text-ink-600">
		Want an embed code rather than a check? Use the <a href="/try" class="text-brand-700 underline"
			>embed code generator</a
		>. Writing tags for the first time? Read the <a href="/docs" class="text-brand-700 underline">webmaster checklist</a>.
	</p>
</Section>
