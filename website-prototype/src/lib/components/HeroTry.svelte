<script lang="ts">
	import Badge from './Badge.svelte';
	import { resolve } from '#lib/generator.ts';

	// Hero "paste a URL" box: one URL shown as an embed, a preview card and a
	// Data API response. Sample results from generator.ts; no calls to Iframely.
	const chips = [
		{ label: 'YouTube video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
		{ label: 'Spotify track', url: 'https://open.spotify.com/track/sample' },
		{ label: 'News article', url: 'https://www.example-news.com/2026/10/15/city-council-votes' }
	];
	const tabs = ['Embed', 'Preview', 'Data'] as const;

	let input = $state(chips[0].url);
	let url = $state(chips[0].url);
	let tab = $state<(typeof tabs)[number]>('Embed');

	const result = $derived(resolve(url));
	const host = $derived.by(() => {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	});
	const site = $derived(result.provider?.name ?? host);
	const data = $derived(`{
  "meta":     { "site": "${site}", "title": "…" },
  "excerpt":  "…",
  "fulltext": "…",
  "access": {
    "requested": { "modes": ["assist"] },
    "decision":  { "fulltext": { "allowed": true } }
  }
}`);

	function check(next: string) {
		input = next;
		url = next.trim();
	}
</script>

<div class="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
	<form
		class="flex flex-col gap-2 sm:flex-row"
		onsubmit={(e) => {
			e.preventDefault();
			check(input);
		}}
	>
		<label class="sr-only" for="hero-url">URL to check</label>
		<input
			id="hero-url"
			type="url"
			bind:value={input}
			placeholder="Paste any URL"
			class="min-w-0 flex-1 rounded-md border border-ink-200 px-3 py-2 text-[15px] focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
		/>
		<button type="submit" class="rounded-md bg-fg px-4 py-2 font-medium text-white hover:bg-body">Check</button>
	</form>

	<div class="mt-3 flex flex-wrap items-center gap-2 text-sm">
		<span class="text-ink-500">Try:</span>
		{#each chips as chip (chip.url)}
			<button
				type="button"
				onclick={() => check(chip.url)}
				class="rounded-full px-3 py-1 ring-1 {url === chip.url
					? 'bg-brand-50 text-brand-800 ring-brand-300'
					: 'text-ink-700 ring-ink-200 hover:ring-ink-400'}">{chip.label}</button
			>
		{/each}
	</div>

	<div class="mt-4 flex gap-1 border-b border-ink-100 text-sm" role="tablist">
		{#each tabs as t (t)}
			<button
				type="button"
				role="tab"
				aria-selected={tab === t}
				onclick={() => (tab = t)}
				class="-mb-px border-b-2 px-3 py-2 {tab === t
					? 'border-brand-600 font-medium text-ink-950'
					: 'border-transparent text-ink-500 hover:text-ink-800'}">{t}</button
			>
		{/each}
	</div>

	<div class="mt-4 min-h-56">
		{#if tab === 'Embed'}
			<div class="mb-2 flex flex-wrap items-center gap-2">
				<p class="text-sm font-medium text-ink-900">{result.line}</p>
				{#if result.kind === 'native'}<Badge tone="good">native code</Badge>{:else}<Badge tone="brand">hosted by Iframely</Badge>{/if}
			</div>
			<div class="flex aspect-video items-center justify-center rounded-md border-2 border-dashed border-ink-200 bg-ink-100">
				<span class="grid size-12 place-items-center rounded-full bg-ink-900/80 text-lg text-white">▶</span>
			</div>
		{:else if tab === 'Preview'}
			<div class="flex overflow-hidden rounded-lg border border-ink-200">
				<div class="w-28 shrink-0 bg-ink-200"></div>
				<div class="min-w-0 p-3">
					<p class="text-xs text-ink-500">{site}</p>
					<p class="mt-1 font-semibold text-ink-950">Sample title from {host}</p>
					<p class="mt-1 text-sm text-ink-600">The page's description, author and thumbnail, as a ready card.</p>
				</div>
			</div>
			<p class="mt-3 text-xs text-ink-500">Rich Media is included by default: the same request returns the player too.</p>
		{:else}
			<pre class="overflow-auto rounded-lg bg-ink-950 p-3 text-[12px] leading-relaxed text-ink-100"><code>{data}</code></pre>
		{/if}
	</div>

	<div class="mt-3 flex items-center justify-between gap-3 text-xs text-ink-500">
		<span>Sample results; the demo makes no calls to Iframely.</span>
		<a href="/try?url={encodeURIComponent(url)}" class="shrink-0 font-medium text-brand-700">Full check →</a>
	</div>
</div>
