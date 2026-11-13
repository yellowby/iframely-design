<script lang="ts">
	import { ICONS, type IconName } from '#lib/data/icons.ts';
	import { CARD, PANEL } from '#lib/card.ts';
	import Blueprint from './Blueprint.svelte';

	// Four cards, two by two (one column on a phone): the home page's "Your URLs are in good hands" and /embeds'
	// "Privacy and security". Each card is horizontal: on the left a square tile set 8px inside the card (as the home
	// product cards' covers; radius 4 keeps the corners concentric) with the icon over a very light grey blueprint
	// pattern, a different one per card (grid, target, section hatch, construction arcs); the text on the right. The
	// pattern fades out behind the icon.
	// An item is a link (the site's card, with its hover) when it has an href, else a plain panel.
	// Its text is a title over a line of text, or, without a title, one sentence whose opening words (lead) are bold.
	export type BlueprintItem = { icon: IconName; text: string; title?: string; lead?: string; href?: string };
	let { items }: { items: BlueprintItem[] } = $props();
</script>

{#snippet inner(it: BlueprintItem, i: number)}
	<div class="relative m-2 grid size-28 shrink-0 place-items-center overflow-hidden rounded-sm bg-[#f8f8f8] sm:size-36" aria-hidden="true">
		<div class="clear absolute inset-0"><Blueprint n={i} class="size-full" /></div>
		<svg class="relative text-fg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round">
			<path d={ICONS[it.icon]} />
		</svg>
	</div>
	<div class="py-4 pr-6 pl-3 sm:pl-4">
		{#if it.title}
			<h3 class="t-small text-[15px]! font-medium! text-fg">{it.title}</h3>
			<p class="t-small mt-1 text-body">{it.text}</p>
		{:else}
			<p class="t-small text-[15px]! text-body">{#if it.lead}<b class="font-medium text-fg">{it.lead}</b>{' '}{/if}{it.text}</p>
		{/if}
	</div>
{/snippet}

<div class="grid gap-4 md:grid-cols-2">
	{#each items as it, i (it.title ?? it.lead ?? it.text)}
		{#if it.href}
			<a href={it.href} class="flex items-center {CARD}">{@render inner(it, i)}</a>
		{:else}
			<div class="flex items-center {PANEL}">{@render inner(it, i)}</div>
		{/if}
	{/each}
</div>

<style>
	/* the blueprint clears a soft disc behind the icon, so the icon reads on plain ground */
	.clear {
		mask-image: radial-gradient(circle at center, transparent 0, transparent 15%, #000 42%);
	}
</style>
