<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Section from '#lib/components/Section.svelte';
	import Generator from '#lib/components/Generator.svelte';
	import Code from '#lib/components/Code.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Button from '#lib/components/Button.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const p = $derived(data.provider);
	const tierA = $derived(p.tier === 'A');
	const tierC = $derived(p.tier === 'C');

	// Title pattern by tier
	const title = $derived(
		tierA ? `${p.name} embed code generator: responsive, free` : `${p.name} embeds with Iframely`
	);
	const h1 = $derived(tierC ? `Embed ${p.name} links` : `${p.name} embed code`);

	const tierNote = {
		A: 'Tier A (top 15 by clicks): full generator with provider options, hosted block, quirks, privacy, developers, FAQ.',
		B: 'Tier B (next ~85 with embed intent): preview, native code where it exists, no options panel, developer strip, FAQ.',
		C: 'Tier C (~700, generated from the data file): preview on paste, hosted embed behind the account, developer strip. No invented prose.'
	};

	const apiCall = $derived(`curl "https://iframe.ly/api/iframely?url=${encodeURIComponent(p.sampleUrl)}&api_key=$IFRAMELY_API_KEY"`);
	const json = $derived(`{
  "meta": { "site": "${p.name}", "title": "…", "medium": "${p.media[0] === 'player' ? 'video' : p.media[0]}" },
  "rel": ["${p.media[0]}"${p.native ? ', "html5"' : ''}${p.clickToPlay ? ', "click-to-play"' : ''}],
  "links": {
    "${p.media[0]}": [{ "href": "…", "type": "text/html", "media": { "aspect-ratio": 1.7778 } }],
    "thumbnail": [{ "href": "…", "media": { "width": 1280, "height": 720 } }]
  },
  "html": "<div style=\\"…responsive wrapper…\\"><iframe …></iframe></div>"
}`);

	const faq = $derived(
		[
			p.native
				? {
						q: `Is the ${p.name} embed code free?`,
						a: `Yes. It is ${p.name}'s own embed code, generated without an account. Use it under ${p.name}'s terms.`
					}
				: {
						q: `Does ${p.name} have its own embed code?`,
						a: `No. ${p.name} does not publish embed code, so Iframely builds a hosted ${p.media[0]} for it. Hosted embeds need a free account.`
					},
			{
				q: `How do I make a ${p.name} embed responsive?`,
				a:
					p.native && tierA
						? 'The generated code already is: it wraps the embed in a box that keeps its shape at any width.'
						: 'Hosted Iframely embeds are responsive by default and predict their height, so the page does not jump.'
			},
			...(p.options?.some((o) => o.key === 'start')
				? [
						{
							q: `How do I start a ${p.name} video at a set time?`,
							a: 'Fill in "Start at" in the options above. The code gets a <code>start</code> parameter in seconds; "End at" adds <code>end</code>. On a watch link, <code>?t=90</code> does the same.'
						}
					]
				: []),
			{
				q: `Why does my ${p.name} embed not show?`,
				a: p.quirks?.length
					? `See the known problems above. The most common is: ${p.quirks[0].title.toLowerCase()}.`
					: 'Check that the post is public, that your content security policy allows the provider\'s domain, and that no blocker removes its script. The <a href="/tools/url-debugger">URL debugger</a> shows what the link returns.'
			},
			{
				q: `Can I embed ${p.name} in WordPress?`,
				a: 'Yes. Paste the code into a Custom HTML block, or install the <a href="/wordpress">Iframely plugin</a> and paste the link.'
			}
		]
	);
</script>

<PageMeta
	{title}
	description="{p.name}: {p.definition} Paste a link, preview it, get the embed code."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-10 md:py-14">
		<nav class="text-sm text-ink-500" aria-label="Breadcrumb">
			<a href="/domains" class="hover:text-ink-900">Supported providers</a>
			<span class="px-1">/</span>
			<span>{p.category}</span>
			<span class="px-1">/</span>
			<span class="text-ink-900">{p.name}</span>
		</nav>
		<div class="mt-4 flex items-start gap-4">
			<span
				class="hidden size-14 shrink-0 place-items-center rounded-lg border-2 border-dashed border-ink-200 bg-ink-100 text-[10px] text-ink-400 sm:grid"
				>logo</span
			>
			<div>
				<h1 class="t-hero text-ink-950">{h1}</h1>
				<p class="mt-2 max-w-2xl text-lg text-ink-600">{p.definition}</p>
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#if p.native}<Badge tone="good">native code</Badge>{:else}<Badge tone="brand">hosted by Iframely</Badge>{/if}
					{#if p.clickToPlay}<Badge>click-to-play</Badge>{/if}
					{#if p.consent}<Badge>consent gate</Badge>{/if}
				</div>
			</div>
		</div>

		{#if tierC}
			<p class="mt-4 max-w-2xl rounded-md bg-ink-50 p-3 text-sm text-ink-700">
				Looking for {p.name} itself? Go to <a href="https://{p.domain}" class="text-brand-700 underline">{p.domain}</a>.
				This page shows how {p.name} links look when embedded with Iframely.
			</p>
		{/if}

		<div class="mt-8">
			{#key p.slug}
				<Generator initialUrl={p.sampleUrl} showOptions={tierA} />
			{/key}
		</div>
		{#if tierC}
			<p class="mt-3 text-sm text-ink-500">See how links from this site render. The embed itself needs a free account.</p>
		{/if}
	</div>
</section>

{#if p.native && !tierC}
	<Section title="Hosted by Iframely" intro="The same {p.name} link as an Iframely embed: loads lazily, waits for a click or for consent, follows your site's dark mode, and keeps working when {p.name} changes its code.">
		<div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
			<Placeholder label="{p.name} hosted embed with consent prompt and click-to-play cover" class="aspect-video" />
			<div class="space-y-4 text-ink-700">
				<ul class="list-disc space-y-1.5 pl-5">
					<li>Nothing from {p.name} loads until the visitor clicks or consents</li>
					<li>Height predicted, so the page does not jump</li>
					<li>Fixed for everyone when {p.name} changes its embeds</li>
					<li>One code for {p.name} and 1,900 other sites</li>
				</ul>
				<Button href="#signup">Get this embed, free account</Button>
			</div>
		</div>
	</Section>
{/if}

{#if p.quirks?.length}
	<Section tone="muted" title="Known problems and fixes" intro="What breaks {p.name} embeds, and what to do. Dated, because providers change.">
		<div class="grid gap-4 md:grid-cols-2">
			{#each p.quirks as q (q.title)}
				<div class="rounded-xl border border-ink-100 bg-white p-5">
					<p class="text-xs text-ink-400">Since {q.date}</p>
					<h3 class="mt-1 font-semibold">{q.title}</h3>
					<p class="mt-2 text-[15px] text-ink-600">{q.text}</p>
				</div>
			{/each}
		</div>
	</Section>
{/if}

{#if tierA && p.privacy}
	<Section title="Privacy and consent" narrow>
		<p class="text-ink-700">{p.privacy}</p>
		<p class="mt-3 text-sm text-ink-500">
			Publishing in the EU? <a href="/embeds" class="text-brand-700 underline">Consent-gated embeds</a> ask before any
			third-party script runs.
		</p>
	</Section>
{/if}

<Section tone={p.quirks?.length ? 'default' : 'muted'} eyebrow="For developers" title="{p.name} through the Iframely API">
	<div class="grid gap-6 lg:grid-cols-2">
		<div class="min-w-0 space-y-4">
			<p class="text-ink-700">
				Send a {p.name} URL, get the embed HTML, the media type and the
				<code>rel</code> values ({p.media.join(', ')}), plus title, thumbnail and author. Provider options pass as
				<code>_</code>-prefixed parameters.
			</p>
			<Code code={apiCall} label="curl" />
			<div class="flex flex-wrap gap-3 text-sm">
				<a href="/docs" class="font-medium text-brand-700">Iframely API docs →</a>
				<a href="/embeds" class="font-medium text-brand-700">Rich Media →</a>
			</div>
		</div>
		<Code code={json} label="Response shape (abridged)" />
	</div>
</Section>

<Section tone="muted" narrow>
	<p class="text-ink-700">
		<b>Work at {p.name}?</b> Control how your links appear in 6,000 products and what agents may use.
		<a href="/publishers" class="text-brand-700 underline">Iframely for publishers →</a>
	</p>
</Section>

{#if !tierC}
	<Section title="{p.name} embed questions" narrow>
		<Faq items={faq} />
	</Section>
{/if}

<Section tone={tierC ? 'default' : 'muted'}>
	{#if data.related.length}
		<h2 class="text-xl font-display tracking-[-0.02em]">More {p.category.toLowerCase()} sites</h2>
		<ul class="mt-4 flex flex-wrap gap-2">
			{#each data.related as r (r.slug)}
				<li>
					<a href="/domains/{r.slug}" class="inline-block rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-ink-200 hover:ring-brand-300"
						>{r.name}</a
					>
				</li>
			{/each}
			<li>
				<a href="/domains" class="inline-block px-3 py-1.5 text-sm font-medium text-brand-700">All providers →</a>
			</li>
		</ul>
	{/if}
	<p class="mt-8 text-xs text-ink-400">
		{p.name} support last updated {p.updated}. Changes are listed in
		<a href="/updates" class="underline">provider news</a>.
	</p>
</Section>
