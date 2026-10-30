<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		eyebrow,
		title,
		intro,
		tone = 'default',
		narrow = false,
		children
	}: {
		id?: string;
		eyebrow?: string;
		title?: string;
		intro?: string;
		tone?: 'default' | 'muted' | 'dark';
		narrow?: boolean;
		children?: Snippet;
	} = $props();

	const tones = {
		default: 'bg-ink-50',
		muted: 'bg-ink-50',
		dark: 'bg-ink-950 text-white'
	};
</script>

<section {id} class="{tones[tone]} scroll-mt-20 py-14 md:py-20">
	<div class="wrap {narrow ? 'max-w-[calc(768px+2*var(--gutter))]' : ''}">
		{#if eyebrow || title || intro}
			<header class="mb-8 max-w-3xl md:mb-10">
				{#if eyebrow}
					<p
						class="t-tag mb-4 {tone === 'dark' ? 'text-brand-300' : 'text-blue'}"
					>
						{eyebrow}
					</p>
				{/if}
				{#if title}
					<h2 class="t-h2 max-w-2xl text-balance">{@html title}</h2>
				{/if}
				{#if intro}
					<p class="t-body mt-4 max-w-[720px] {tone === 'dark' ? 'text-ink-300' : 'text-mute'}">{@html intro}</p>
				{/if}
			</header>
		{/if}
		{@render children?.()}
	</div>
</section>
