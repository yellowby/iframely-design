<script lang="ts">
	import Badge from '#lib/components/Badge.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { entries, type Stream } from '#lib/data/updates.ts';

	let stream = $state<'all' | Stream>('all');
	const shown = $derived(stream === 'all' ? entries : entries.filter((e) => e.stream === stream));
	const filters: ['all' | Stream, string][] = [
		['all', 'All'],
		['changelog', 'Changelog'],
		['provider', 'Provider news']
	];
</script>

<PageMeta
	title="Changelog and provider news | Iframely"
	description="Product and API changes, deprecations with dates, open-source releases, and what changed at YouTube, X, Meta, TikTok and other providers, with what to do about it."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
		<h1 class="t-hero">Changelog and provider news</h1>
		<p class="mt-3 text-lg text-ink-600">What changed in Iframely, and what changed at the platforms you embed, with what to do about it.</p>
		<div class="mt-5 flex flex-wrap gap-3 text-sm">
			<a href="#rss" class="rounded-md px-3 py-1.5 ring-1 ring-ink-200">RSS</a>
			<a href="#atom" class="rounded-md px-3 py-1.5 ring-1 ring-ink-200">Atom</a>
			<a href="#digest" class="rounded-md px-3 py-1.5 ring-1 ring-ink-200">Monthly email digest</a>
			<a href="#status" class="rounded-md px-3 py-1.5 text-ink-600">Incidents: status page →</a>
		</div>
	</div>
</section>

<div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
	<div class="mb-6 flex flex-wrap items-center gap-2">
		{#each filters as [id, label] (id)}
			<button
				type="button"
				onclick={() => (stream = id)}
				class="rounded-full px-4 py-1.5 text-sm {stream === id ? 'bg-ink-950 text-white' : 'ring-1 ring-ink-200 hover:ring-ink-400'}"
				>{label}</button
			>
		{/each}
		<span class="ml-auto text-sm text-ink-400">Archive: 2026 · 2025</span>
	</div>

	<ol class="divide-y divide-ink-100">
		{#each shown as e (e.date + e.title)}
			<li class="grid gap-2 py-5 sm:grid-cols-[7rem_1fr]">
				<time class="text-sm text-ink-500">{e.date}</time>
				<div>
					<div class="flex flex-wrap items-center gap-2">
						<Badge tone={e.stream === 'provider' ? 'warn' : 'brand'}>{e.stream === 'provider' ? 'Provider news' : 'Changelog'}</Badge>
						{#each e.tags as t (t)}<Badge tone={t === 'action required' ? 'bad' : 'neutral'}>{t}</Badge>{/each}
						{#if e.imported}<span class="text-xs text-ink-400">imported from GitHub</span>{/if}
					</div>
					<h2 class="mt-2 font-semibold">
						{#if e.href}<a href={e.href} class="hover:text-brand-700">{e.title}</a>{:else}{e.title}{/if}
					</h2>
					<p class="mt-1 text-[15px] text-ink-600">{e.summary}</p>
				</div>
			</li>
		{/each}
	</ol>

	<section id="digest" class="mt-12 rounded-xl border border-ink-100 bg-ink-50 p-6">
		<h2 class="text-lg font-semibold">One email a month</h2>
		<p class="mt-1 text-ink-600">Provider changes that affect your embeds, and what we shipped. Unsubscribe in one click.</p>
		<Placeholder label="Email field + Subscribe button" class="mt-4 h-14" />
	</section>
</div>
