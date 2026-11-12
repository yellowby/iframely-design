<script lang="ts">
	// A grid of short cards: title, one or two sentences, optional link.
	let {
		items,
		cols = 3
	}: {
		items: { title: string; text: string; href?: string; cta?: string; tag?: string }[];
		cols?: 2 | 3 | 4;
	} = $props();
	const grid = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };
</script>

<div class="grid gap-4 {grid[cols]}">
	{#each items as item (item.title)}
		<svelte:element
			this={item.href ? 'a' : 'div'}
			href={item.href}
			class="flex flex-col rounded-xl border border-ink-100 bg-white p-5 text-ink-900 {item.href
				? 'transition hover:border-brand-300 hover:shadow-sm'
				: ''}"
		>
			{#if item.tag}<p class="mb-2 text-xs font-semibold tracking-wide text-brand-700 uppercase">{item.tag}</p>{/if}
			<h3 class="font-semibold text-ink-950">{item.title}</h3>
			<p class="mt-2 text-[15px] text-ink-600">{@html item.text}</p>
			{#if item.href}
				<span class="mt-auto pt-4 text-sm font-medium text-brand-700">{item.cta ?? 'Learn more'} →</span>
			{/if}
		</svelte:element>
	{/each}
</div>
