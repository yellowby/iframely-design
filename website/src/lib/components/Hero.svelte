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
		below,
		split = false,
		tag
	}: {
		/* this page's own style of the product tag, in place of the panel's default measure line (/embeds,
		   2026-11-24: the measure line says the same thing as the measures of the wall right under it). Any other
		   style picked in the panel wins.
		   (Tried and dropped the same day: 'chip', the product's icon in the small chip the blocks' tags have their
		   number in, "01 Developers", then the name.) */
		tag?: typeof look.tag;
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
		/* The copy in two halves from lg, as a section's head on the home page: the tag, the heading and the buttons
		   under it on the left, the text on the right, its top level with the heading's (/embeds, 2026-11-24: the copy
		   ran down the left with the right 40% of the hero empty, and the buttons were a row of their own over the
		   wall). For an hour the buttons were on the right, under the text: too far from the heading.
		   Without it, and under lg, the copy is one column: tag, heading, text, buttons. */
		split?: boolean;
	} = $props();

	// the page's own style stands while the panel is on its default, so the panel can still try the others here
	const kind = $derived(tag && look.tag === 'measure' ? tag : look.tag);
	// the small drawing marks before the name (the .mark styles below)
	const MARKS = ['tick', 'corner', 'cross', 'slash'];
</script>

<section>
	<div
		class="wrap grid gap-10 pt-20 {below ? 'pb-12' : 'pb-14 md:pb-20'} {aside
			? 'lg:grid-cols-[1.1fr_1fr] lg:items-center'
			: ''}"
	>
		<!-- split: a grid of two halves. The tag has the first row to itself, so the heading and the text start level in
		     the second; the buttons are under the heading, in the third, and the text is as tall as the two. The
		     markup keeps the one column's order (heading, text, buttons), which is the order under lg.
		     (Not split, the tag's wrapper below is display: contents, and the copy is as it was.) -->
		<!-- (split: 28px between the halves, as between the two columns of the /embeds wall under the copy, so the text
		     starts where the wall's right column does. It was 64px, the blocks' heads' gap: 18px off the wall.
		     The buttons are 24px under the heading; 32px in the one column.) -->
		<div class={split ? 'grid min-w-0 gap-x-7 lg:grid-cols-2' : 'max-w-3xl min-w-0'}>
			<div class={split ? 'lg:col-span-2 lg:row-start-1' : 'contents'}>
			{#if eyebrow}
				<!-- A product page's tag has variants, picked in the Tweakpane panel ("Hero tag", look.tag). The default is the
				     name drawn as the measures on the /embeds wall: a short blue line closed by a tick on each side. -->
				{#if product && kind === 'off'}
					<!-- no tag: the heading opens the page -->
				{:else if product && kind === 'badge'}
					<!-- the name in a light blue pill -->
					<p class="t-tag mb-5 inline-block rounded-full bg-blue/10 px-2.5 py-1.5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else if product && kind === 'endpoint' && endpoint}
					<!-- the product as its API call, set as the request bar of the oEmbed card on /embeds -->
					<p class="mb-5 flex items-center gap-2 font-mono text-[12px] leading-none text-fg">
						<span class="rounded-sm bg-blue/10 px-1.5 py-[3px] text-[11px] font-semibold text-blue">GET</span>
						<span>{endpoint}<span class="text-mute">?url=…</span></span>
					</p>
				{:else if product && kind === 'outline'}
					<!-- the name in a thin square-cornered frame, as a part label in a title block -->
					<p class="t-tag mb-5 w-fit border border-blue/45 px-2.5 py-1.5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else if product && MARKS.includes(kind)}
					<!-- the name after a small drawing mark that sits on the container's left edge: a tick and a short
					     line, a frame's corner, a registration cross, or a comment's two slashes -->
					<p class="t-tag mark {kind} mb-5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else if product && kind !== 'regular'}
					<p class="t-tag measure mb-5 text-[12px]! leading-none! text-blue">{eyebrow}</p>
				{:else}
					<p class="t-tag mb-4 text-blue">{eyebrow}</p>
				{/if}
			{/if}
			{#if tagline}
				<p class="t-label mb-3 text-faint">{tagline}</p>
			{/if}
			</div>
			<!-- (split: the text starts 8px under the heading's top, which puts the middle of its first line's capitals
			     level with the middle of the heading's. Tops level left the smaller text hanging high; on the
			     heading's baseline, 16px down, it was too low.) -->
			<h1 class="t-hero text-fg {split ? 'lg:col-start-1 lg:row-start-2' : ''}">{@html title}</h1>
			{#if sub}
				<p class="t-lead mt-4 max-w-[720px] text-pretty text-mute {split ? 'lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-2' : ''}">{@html sub}</p>
			{/if}
			{#if children}
				<div class="mt-8 flex flex-wrap items-center gap-3 {split ? 'lg:col-start-1 lg:row-start-3 lg:mt-6 lg:self-start' : ''}">{@render children()}</div>
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
	/* The marks: four small drawing marks before the name, each standing on the container's left edge, in the
	   measures' 1px line. Variations to pick from, 2026-11-24.
	   (Tried and dropped the same day: a line from the page's left edge through the margin to a dot before the name;
	   and a bracket, its top arm leading to the name and its upright running down the copy's left side in the gutter
	   to a foot at the buttons: too loud.) */
	.mark {
		position: relative;
		display: flex;
		width: fit-content;
		align-items: center;
	}
	.mark::before {
		content: '';
		flex: none;
		opacity: 0.45;
	}
	/* tick: the measure's left half, a tick on the edge and 28px of line, open on the right */
	.tick::before {
		width: 28px;
		height: 8px;
		margin-right: 8px;
		border-left: 1px solid;
		background: linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat;
	}
	/* corner: a frame's top left corner, 9px each way, on the container's edge, the name set into it as into a
	   crop mark (it sticks out 8px over the tag's line) */
	.corner {
		padding-left: 10px;
	}
	.corner::before {
		position: absolute;
		top: -8px;
		left: 0;
		width: 9px;
		height: 9px;
		border-top: 1px solid;
		border-left: 1px solid;
		opacity: 0.6;
	}
	/* cross: a registration cross, 9px, its middle on the container's edge */
	.cross::before {
		width: 9px;
		height: 9px;
		margin: 0 8px 0 -4.5px;
		opacity: 0.7;
		background:
			linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat,
			linear-gradient(currentColor, currentColor) center / 1px 100% no-repeat;
	}
	/* slash: the two slashes of a comment, and of the logo */
	.slash::before {
		content: '//';
		margin-right: 0.6em;
	}
</style>
