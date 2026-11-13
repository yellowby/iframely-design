<script lang="ts">
	import type { Snippet } from 'svelte';

	// Closing call-to-action band used at the bottom of most pages: on the page ground, Home01 type. `signoff` is an optional last line.
	let {
		title,
		text,
		signoff,
		children
	}: { title: string; text?: string; signoff?: string; children: Snippet } = $props();
</script>

<section class="py-24 text-fg">
	<div class="wrap">
		<h2 class="t-h2 max-w-2xl">{title}</h2>
		{#if text}<p class="t-body mt-4 max-w-2xl text-mute">{text}</p>{/if}
		<div class="mt-8 flex flex-wrap gap-3">{@render children()}</div>
		{#if signoff}<p class="t-note mt-8 text-soft italic">{signoff}</p>{/if}
	</div>
</section>
