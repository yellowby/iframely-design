<script lang="ts">
	import { goto } from '$app/navigation';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Section from '#lib/components/Section.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import { providers, categories } from '#lib/data/providers.ts';
	import { findProvider } from '#lib/generator.ts';

	let query = $state('');
	let category = $state<string | null>(null);
	let pasted = $state('');

	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return providers
			.filter((p) => !category || p.category === category)
			.filter(
				(p) =>
					!q ||
					[p.name, p.domain, p.category, ...(p.aliases ?? [])].some((s) => s.toLowerCase().includes(q))
			)
			.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
	});

	function checkUrl(e: SubmitEvent) {
		e.preventDefault();
		const p = findProvider(pasted);
		goto(p ? `/domains/${p.slug}` : `/try?url=${encodeURIComponent(pasted)}`);
	}

	const mediaLabel: Record<string, string> = { player: 'player', rich: 'rich', photo: 'photo', card: 'card' };
</script>

<PageMeta
	title="Supported providers: 1,900+ sites you can embed with Iframely"
	description="Search 1,900+ sites Iframely can embed: video, audio, social, maps, documents and more. See what each embed looks like and get the code."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-12 md:py-16">
		<h1 class="t-hero text-ink-950">Which sites can you embed?</h1>
		<p class="mt-4 max-w-2xl text-lg text-ink-600">
			1,900 sites, and any page with Open Graph tags as a card. Paste a link to check it, or search by name.
		</p>
		<form class="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row" onsubmit={checkUrl}>
			<label class="sr-only" for="hub-url">Paste any URL</label>
			<input
				id="hub-url"
				type="url"
				required
				bind:value={pasted}
				placeholder="Paste any URL, e.g. https://vimeo.com/1"
				class="min-w-0 flex-1 rounded-md border border-ink-200 bg-white px-3 py-2.5 focus:border-brand-500 focus:outline-none"
			/>
			<button class="rounded-md bg-fg px-5 py-2.5 font-medium text-white hover:bg-body">Check</button>
		</form>
		<p class="mt-2 text-xs text-ink-500">Known sites open their provider page; anything else opens in the embed code generator.</p>
	</div>
</section>

<section class="py-10">
	<div class="wrap">
		<label class="sr-only" for="hub-search">Search providers</label>
		<input
			id="hub-search"
			type="search"
			bind:value={query}
			placeholder="Search by name, domain or kind: twitter, podcast, docs…"
			class="w-full rounded-md border border-ink-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
		/>
		<div class="mt-4 flex flex-wrap gap-2 text-sm">
			<button
				type="button"
				onclick={() => (category = null)}
				class="rounded-full px-3 py-1 ring-1 {category === null ? 'bg-ink-900 text-white ring-ink-900' : 'ring-ink-200'}"
				>All</button
			>
			{#each categories as c (c)}
				<button
					type="button"
					onclick={() => (category = category === c ? null : c)}
					class="rounded-full px-3 py-1 ring-1 {category === c
						? 'bg-ink-900 text-white ring-ink-900'
						: 'text-ink-700 ring-ink-200 hover:ring-ink-400'}">{c}</button
				>
			{/each}
		</div>

		<p class="mt-6 text-sm text-ink-500">{results.length} of {providers.length} sample providers</p>
		<ul class="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each results as p (p.slug)}
				<li>
					<a
						href="/domains/{p.slug}"
						class="flex h-full gap-3 rounded-xl border border-ink-100 p-4 transition hover:border-brand-300"
					>
						<span class="grid size-10 shrink-0 place-items-center rounded-md border border-dashed border-ink-200 bg-ink-100 text-[10px] text-ink-400"
							>logo</span
						>
						<span class="min-w-0">
							<span class="block font-semibold text-ink-950">{p.name}</span>
							<span class="block text-xs text-ink-500">{p.domain} · {p.category}</span>
							<span class="mt-2 flex flex-wrap gap-1">
								{#each p.media as m (m)}<Badge>{mediaLabel[m]}</Badge>{/each}
								{#if p.native}<Badge tone="good">native code</Badge>{/if}
								{#if p.clickToPlay}<Badge tone="brand">click-to-play</Badge>{/if}
								{#if p.consent}<Badge tone="brand">consent gate</Badge>{/if}
							</span>
							<span class="mt-2 block text-xs text-ink-400">Support last changed {p.updated}</span>
						</span>
					</a>
				</li>
			{:else}
				<li class="text-ink-600 md:col-span-3">
					No match. Iframely still reads any page with Open Graph tags as a card:
					<a href="/try" class="text-brand-700 underline">paste the link in the generator</a>, or
					<a href="#suggest" class="text-brand-700 underline">suggest a provider</a>.
				</li>
			{/each}
		</ul>
	</div>
</section>

<Section tone="muted" title="Where embeds come from" intro="Four kinds of sources, all through the same API.">
	<Cards
		cols={4}
		items={[
			{ title: 'Known players', text: 'Sites with their own embed code or oEmbed: YouTube, Spotify, X. We add options, sizing and fixes.' },
			{ title: 'White-label platforms', text: 'Video and audio hosts that publishers run under their own domain, such as JW Player or Brightcove.' },
			{ title: 'Distributed platforms and shorteners', text: 'Mastodon servers, Substack, bit.ly and similar: one provider, thousands of domains.' },
			{ title: 'Direct files', text: 'Images, video, audio and PDFs linked directly, played in a hosted viewer.' }
		]}
	/>
	<div class="mt-8 flex flex-wrap gap-6 text-sm">
		<a href="/publishers" class="font-medium text-brand-700">Your site should embed better? Request a review →</a>
		<a href="#suggest" class="font-medium text-brand-700">Missing a site? Suggest a provider →</a>
		<a href="/docs/domains-widget" class="font-medium text-brand-700">Show this list in your app: domains widget →</a>
	</div>
</Section>
