<script lang="ts">
	import type { Snippet } from 'svelte';
	import { look } from '#lib/tweaks.svelte.ts';

	let {
		eyebrow,
		product = false,
		endpoint,
		title,
		sub,
		tagline,
		children,
		aside,
		after,
		below
	}: {
		eyebrow?: string;
		/* a product page: the eyebrow is drawn as a measure line, or the variant picked in the Tweakpane panel */
		product?: boolean;
		/* the product's API endpoint, without its query ("iframe.ly/api/iframely"), for the tag's Endpoint variant */
		endpoint?: string;
		title: string;
		sub?: string;
		tagline?: string;
		children?: Snippet;
		aside?: Snippet;
		after?: Snippet;
		/* a full-width visual under the copy (the /embeds wall of embeds) */
		below?: Snippet;
	} = $props();
</script>

<section>
	<div
		class="wrap grid gap-10 pt-20 {below ? 'pb-12' : 'pb-14 md:pb-20'} {aside
			? 'lg:grid-cols-[1.1fr_1fr] lg:items-center'
			: ''}"
	>
		<div class="max-w-3xl min-w-0">
			{#if eyebrow}
				<!-- A product page's tag has variants, picked in the Tweakpane panel ("Hero tag", look.tag). The default is the
				     name drawn as the measures on the /embeds wall: a short blue line closed by a tick on each side. -->
				{#if product && look.tag === 'off'}
					<!-- no tag: the heading opens the page -->
				{:else if product && look.tag === 'badge'}
					<!-- the name in a light blue pill -->
					<p class="t-tag mb-5 inline-block rounded-full bg-blue/10 px-2.5 py-1.5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else if product && look.tag === 'endpoint' && endpoint}
					<!-- the product as its API call, set as the request bar of the oEmbed card on /embeds -->
					<p class="mb-5 flex items-center gap-2 font-mono text-[12px] leading-none text-fg">
						<span class="rounded-sm bg-blue/10 px-1.5 py-[3px] text-[11px] font-semibold text-blue">GET</span>
						<span>{endpoint}<span class="text-mute">?url=…</span></span>
					</p>
				{:else if product && look.tag === 'outline'}
					<!-- the name in a thin square-cornered frame, as a part label in a title block -->
					<p class="t-tag mb-5 w-fit border border-blue/45 px-2.5 py-1.5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else if product && look.tag !== 'regular'}
					<p class="t-tag measure mb-5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else}
					<p class="t-tag mb-4 text-blue">{eyebrow}</p>
				{/if}
			{/if}
			{#if tagline}
				<p class="t-label mb-3 text-faint">{tagline}</p>
			{/if}
			<h1 class="t-hero text-fg">{@html title}</h1>
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
	{#if below}<div class="wrap pb-14 md:pb-20">{@render below()}</div>{/if}
</section>

<style>
	/* the same line as the wall's measures (EmbedWall.svelte): 1px, 45% blue, an 8px tick at each outer end */
	.measure {
		display: flex;
		width: fit-content;
		align-items: center;
		gap: 8px;
	}
	.measure::before,
	.measure::after {
		content: '';
		width: 28px;
		height: 8px;
		opacity: 0.45;
		background: linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat;
	}
	.measure::before {
		border-left: 1px solid;
	}
	.measure::after {
		border-right: 1px solid;
	}
</style>
