<script lang="ts">
	import { AI } from '#lib/data/ask.ts';

	// "Ask about Iframely" as a row of icons with no text: each AI assistant a white squircle tile with its mark, its
	// name ("Ask ChatGPT") a tooltip. It stands at the right of /embeds's closing blue block. The links and the
	// question are lib/data/ask.ts. (It was a framed strip with a line of text and named tiles, under the logo wall and
	// then under the closing block.)
	// The tooltips are placed by CSS anchor positioning, as the timeline's are (components/UpkeepTimeline.svelte): each
	// tile names an anchor, and its tooltip sits centred over it.
</script>

<!-- a short title (white, for the blue block) and the tiles, on one line -->
<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
	<p class="t-small text-white/80">Ask AI about Iframely</p>
	<p class="flex gap-2">
		{#each AI as [name, href, mark], i (name)}
			<a {href} target="_blank" rel="noopener" class="tile" aria-label="Ask {name} about Iframely" style="anchor-name:--ask-{i}"
				><i style:--mark={`url("${mark}")`}></i></a
			><span class="tip" aria-hidden="true" style="position-anchor:--ask-{i}">Ask {name}</span>
		{/each}
	</p>
</div>

<style>
	/* A tile: 36px (the buttons' height), outlined as the block's second button is (a white hairline, no ground), its
	   mark white, so the main button stays the block's one solid white thing; a squircle where the browser can draw
	   one, rounded corners elsewhere. (The tiles were solid white with the marks in the providers' colours.) */
	.tile {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border: 1px solid rgb(255 255 255 / 0.35);
		border-radius: 10px;
		transition:
			border-color 0.15s,
			background-color 0.15s;
	}
	@supports (corner-shape: squircle) {
		.tile {
			border-radius: 15px;
			corner-shape: squircle;
		}
	}
	.tile:hover {
		border-color: rgb(255 255 255 / 0.7);
		background: rgb(255 255 255 / 0.1);
	}
	.tile:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}
	.tile i {
		width: 18px;
		height: 18px;
		background: #fff;
		mask: var(--mark) center / contain no-repeat;
	}
	/* The tooltip: over its tile, centred, and under it where that does not fit; on the page's top layer (fixed), so
	   the block's edge does not cut it. Not laid out while closed (see the timeline's note). */
	.tip {
		position: fixed;
		position-area: top;
		position-try-fallbacks: flip-block, top span-left, bottom span-left;
		z-index: 30;
		display: none;
		width: max-content;
		margin: 8px 0;
		padding: 6px 9px;
		border-radius: 6px;
		background: #fff;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / 0.1);
		font-size: 12px;
		line-height: 1.2;
		font-weight: 500;
		color: var(--color-fg);
		pointer-events: none;
		opacity: 0;
		transition:
			opacity 0.12s ease-out,
			display 0.12s allow-discrete;
	}
	.tile:hover + .tip,
	.tile:focus-visible + .tip {
		display: block;
		opacity: 1;
		@starting-style {
			opacity: 0;
		}
	}
	/* a browser without anchor positioning: no tooltip (the link keeps its spoken name) */
	@supports not (position-area: top) {
		.tip {
			display: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tip {
			transition: none;
		}
	}
</style>
