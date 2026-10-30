<script lang="ts">
	import type { Snippet } from 'svelte';

	// Home01 button: a 36px pill in the button type role. primary is #111 with white text, secondary a 1px grey outline (black at 12%, as in Figma), darker on hover with no fill.
	let { href, variant = 'primary', children }: { href: string; variant?: 'primary' | 'secondary'; children: Snippet } = $props();
</script>

<a
	{href}
	class="t-button inline-flex items-center rounded-full px-5 py-2 whitespace-nowrap transition-colors {variant === 'primary'
		? 'bg-fg text-white hover:bg-body'
		: 'text-body ring-1 ring-black/12 ring-inset hover:ring-black/40'}">{@render children()}</a
>
