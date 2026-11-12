<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		size = 'md',
		children
	}: { href: string; variant?: 'primary' | 'secondary' | 'quiet' | 'invert'; size?: 'sm' | 'md'; children: Snippet } =
		$props();

	const styles = {
		primary: 'bg-fg text-white hover:bg-body',
		secondary: 'text-body ring-1 ring-black/12 ring-inset hover:ring-black/40',
		quiet: 'text-blue underline-offset-4 hover:underline px-0!',
		invert: 'bg-white text-fg hover:bg-rule'
	};
</script>

<a
	{href}
	class="t-button inline-flex items-center gap-1.5 rounded-full whitespace-nowrap transition-colors {size === 'sm'
		? 'px-3.5 py-1.5'
		: 'px-5 py-2'} {styles[variant]}">{@render children()}</a
>
