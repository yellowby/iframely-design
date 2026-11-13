<script lang="ts">
	import Pill from './Pill.svelte';

	// Closing CTA after G15 in the motion lab (Page content, "the path as the mark"), its first block (home): a white panel
	// with the connecting heading on the left and the two buttons on the right, over the site logo (as in the header:
	// blue slashes, black word) set as wide as the panel and cut by its bottom edge. Heading and buttons in the site's
	// type roles.
</script>

<section class="wrap">
	<div class="mark-panel relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/8 ring-inset">
		<div class="relative z-1 grid gap-x-10 gap-y-7 px-7 pt-10 md:grid-cols-[1.1fr_1fr] md:px-14 md:pt-13">
			<h2 class="t-h2 max-w-[540px] text-fg">
				Connecting developers and publishers, <span data-accent-keep class="text-blue">one URL at a time</span>
			</h2>
			<div class="flex flex-wrap content-start gap-2 md:justify-end md:pt-1.5">
				<Pill href="#signup">Get API key</Pill>
				<Pill href="/try" variant="secondary">Check URL</Pill>
			</div>
		</div>
		<p class="mark" aria-hidden="true"><b>//</b>iframely</p>
	</div>
</section>

<style>
	.mark-panel {
		container-type: inline-size;
		--pad: 28px; /* the panel's side padding (px-7, md:px-14) */
		/* the logo is ten JetBrains Mono characters, .6em each: 6em wide, so this size fills the width between the paddings */
		--fs: calc((100cqw - 2 * var(--pad)) / 6);
		/* room for the part of the mark that shows, plus the gap above it */
		padding-bottom: calc(var(--fs) * 0.86 + 56px);
	}
	@media (min-width: 768px) {
		.mark-panel {
			--pad: 56px;
			min-height: 400px;
		}
	}
	.mark {
		position: absolute;
		left: var(--pad);
		bottom: -0.14em;
		/* the site logo, as in the header: JetBrains Mono 700, black, with the slashes in 800 and blue */
		font: 700 var(--fs) / 1 'JetBrains Mono', ui-monospace, monospace;
		white-space: nowrap;
		color: #000;
	}
	.mark b {
		font-weight: 800;
		color: var(--color-blue);
	}
</style>
