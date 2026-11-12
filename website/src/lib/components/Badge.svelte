<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone = 'neutral',
		children
	}: { tone?: 'neutral' | 'brand' | 'good' | 'warn' | 'bad'; children: Snippet } = $props();
	const tones = {
		neutral: 'bg-ink-100 text-ink-700',
		brand: 'bg-brand-100 text-brand-800',
		good: 'bg-emerald-100 text-emerald-800',
		warn: 'bg-amber-100 text-amber-800',
		bad: 'bg-rose-100 text-rose-800'
	};
</script>

<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap {tones[tone]}"
	>{@render children()}</span
>
