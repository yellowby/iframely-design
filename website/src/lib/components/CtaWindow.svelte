<script lang="ts">
	import { cta, CTA_BG } from '#lib/tweaks.svelte.ts';

	// The call to action under the /embeds hero wall, drawn as one more of the wall's windows (EmbedWall.svelte), inverted:
	// the same 8px corners and 36px mono bar (a label on the left, a note in a lighter white on the right, a hairline
	// under it), on the brand blue instead of white; then the heading with the buttons to its right.
	// A plain panel: no noise and no dissolving edge (those belong to GlyphSection, the page's closing block).
	// The ground follows the Tweakpane panel's "Bottom CTA" colour, as GlyphSection does.
	// buttons: [label, href]; the first is the main one and sits last, at the right edge.
	let {
		title,
		verb,
		label,
		query,
		note,
		buttons
	}: { title: string; verb?: string; /* the bar's text; without it the window has no bar */ label?: string; query?: string; note?: string; buttons: [string, string][] } = $props();
	const BLUE = $derived(CTA_BG[cta.bg]);
</script>

<section class="relative overflow-hidden rounded-lg text-white" style:background={BLUE}>
	{#if label}<div class="flex h-9 items-center gap-2 border-b border-white/20 px-4 font-mono text-[12px] leading-none whitespace-nowrap">
		<!-- as a request, like the bar of the oEmbed card further down the page: the verb in a chip, the endpoint, the
		     URL being sent in a lighter white; on the right the answer's status behind a dot -->
		{#if verb}<span class="rounded-sm bg-white/15 px-1.5 py-[3px] text-[11px] font-semibold">{verb}</span>{/if}
		<span class="truncate">{label}{#if query}<span class="text-white/60">{query}</span>{/if}</span>
		{#if note}
			<span class="ml-auto flex items-center gap-1.5 pl-3 text-white/70"><i class="size-1.5 rounded-full bg-white"></i>{note}</span>
		{/if}
	</div>{/if}
	<!-- A little drawing on the left, behind the heading, in thin white lines as the wall's blue measures: a squared
	     grid that fades out towards the buttons, and construction arcs swung from the bottom-left corner. -->
	<div class="draft pointer-events-none absolute inset-y-0 left-0 w-[58%]" aria-hidden="true">
		<svg class="absolute bottom-0 left-0" width="260" height="260" viewBox="0 0 260 260" fill="none" stroke="#fff" stroke-width="1">
			<circle cx="0" cy="260" r="72" stroke-opacity=".28" />
			<circle cx="0" cy="260" r="132" stroke-opacity=".22" stroke-dasharray="2 5" />
			<circle cx="0" cy="260" r="192" stroke-opacity=".18" />
			<path d="M0 260L200 190M0 260L130 60" stroke-opacity=".18" />
		</svg>
	</div>
	<div class="relative flex flex-wrap items-center justify-between gap-x-12 gap-y-5 px-6 py-7 md:px-8 md:py-8">
		<h2 class="t-h2">{title}</h2>
		<div class="flex flex-row-reverse flex-wrap justify-end gap-4">
			{#each buttons as [text, to], i (text)}
				<a
					href={to}
					style:color={i ? undefined : BLUE}
					class="t-button inline-flex items-center rounded-full px-5 py-2 transition-colors {i
						? 'ring-1 ring-white/35 ring-inset hover:ring-white/70'
						: 'bg-white hover:bg-white/85'}">{text}</a
				>
			{/each}
		</div>
	</div>
</section>

<style>
	/* the grid: 24px squares counted from the block's left edge, fading to nothing on the right */
	.draft {
		--ln: rgb(255 255 255 / 0.14);
		background-image: linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px);
		background-size: 24px 24px;
		background-position: left -1px top -1px;
		mask-image: linear-gradient(to right, #000, transparent);
	}
</style>
