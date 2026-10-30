<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow,
		title,
		sub,
		tagline,
		children,
		aside,
		after
	}: {
		eyebrow?: string;
		title: string;
		sub?: string;
		tagline?: string;
		children?: Snippet;
		aside?: Snippet;
		after?: Snippet;
	} = $props();
</script>

<section>
	<div
		class="wrap grid gap-10 pt-20 pb-14 md:pb-20 {aside
			? 'lg:grid-cols-[1.1fr_1fr] lg:items-center'
			: ''}"
	>
		<div class="max-w-3xl min-w-0">
			{#if eyebrow}
				<p class="t-tag mb-4 text-blue">{eyebrow}</p>
			{/if}
			{#if tagline}
				<p class="t-label mb-3 text-faint">{tagline}</p>
			{/if}
			<h1 class="t-hero text-balance text-fg">{@html title}</h1>
			{#if sub}
				<p class="t-lead mt-4 max-w-[720px] text-pretty text-mute">{@html sub}</p>
			{/if}
			{#if children}
				<div class="mt-8 flex flex-wrap items-center gap-3">{@render children()}</div>
			{/if}
			{@render after?.()}
		</div>
		{#if aside}<div class="min-w-0">{@render aside()}</div>{/if}
	</div>
</section>
