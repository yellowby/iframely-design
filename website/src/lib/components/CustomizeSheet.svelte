<script lang="ts">
	// The sheet of the "For editors and apps" block on /embeds-2 (the provider wall's box), in two parts: on the left a
	// working scene (components/OptionsDemo.svelte), on the right the copy as rows parted by hairlines. A row is a
	// switch: the one that is on has its scene on the left, and a thin blue line down its left edge that fills in
	// TURN seconds; when it is full the next row takes over, round and round.
	// The line stands still while the pointer is over the sheet, while the keyboard's focus is in it and while the
	// sheet is out of view, and starts again from the top after a click in the scene. With reduced motion there is no
	// turn-taking: the line is just the mark of the row that is on.
	import { onMount } from 'svelte';
	import OptionsDemo from './OptionsDemo.svelte';

	// rows: heading, text, link, link label; the scene is the row's place in the list
	// flat: the sheet as a hairline outline, with no drop shadow (/embeds-3, where only the scenes' windows are raised)
	let { items, flat = false }: { items: string[][]; flat?: boolean } = $props();
	const TURN = 9;

	let active = $state(0);
	let run = $state(0); // goes up to start the line again
	let sheet: HTMLDivElement;
	let seen = $state(false);
	onMount(() => {
		const io = new IntersectionObserver((es) => (seen = es[0].isIntersecting), { threshold: 0.35 });
		io.observe(sheet);
		return () => io.disconnect();
	});
	const pick = (i: number) => {
		active = i;
		run++;
	};
</script>

<div
	bind:this={sheet}
	class="sheet rounded-lg bg-white {flat
		? 'shadow-[0_0_0_1px_rgb(0_0_0/0.08)]'
		: 'shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]'}"
	class:idle={!seen}
	style="--turn:{TURN}s"
>
	<div class="grid lg:grid-cols-[1.15fr_1fr]">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="p-3" onclick={() => run++}><OptionsDemo scene={active} plain={flat} /></div>
		<div class="divide-y divide-black/8 border-t border-black/8 lg:border-t-0 lg:border-l">
			{#each items as [name, body, href, cta], i (name)}
				<!-- the whole row takes the click; the heading's button is the same switch for the keyboard -->
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="row py-6 {flat ? 'px-9' : 'px-6 md:px-8'}" class:on={i === active} onclick={() => i !== active && pick(i)}>
					{#if i === active}
						{#key run}<span class="line" aria-hidden="true"><span onanimationend={() => pick((active + 1) % items.length)}></span></span>{/key}
					{/if}
					<h3 class="text-[18px] leading-[1.35] font-medium text-fg">
						<button type="button" aria-current={i === active ? 'true' : undefined} onclick={(e) => (e.stopPropagation(), pick(i))}>{name}</button>
					</h3>
					<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">
						{body}
						{#if cta}<a {href} class="font-medium whitespace-nowrap text-fg underline decoration-black/25 underline-offset-3 hover:decoration-black">{cta} →</a>{/if}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.row {
		position: relative;
		transition: background-color 0.25s;
	}
	/* the rows that are off are quieter, and say they can be pressed */
	.row:not(.on) {
		cursor: pointer;
	}
	.row:not(.on) > :global(*) {
		opacity: 0.55;
		transition: opacity 0.25s;
	}
	.row:not(.on):hover > :global(*) {
		opacity: 1;
	}
	.row.on {
		background: rgb(0 0 0 / 0.018);
	}
	.row:last-child {
		border-bottom-right-radius: 8px;
	}
	.row button {
		text-align: left;
		cursor: inherit;
		font: inherit;
	}
	.row button:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 3px;
		border-radius: 2px;
	}
	/* the line down the left edge of the row that is on, filling from the top */
	.line {
		position: absolute;
		inset: 0 auto 0 -1px;
		width: 2px;
		background: rgb(0 0 0 / 0.06);
	}
	.line span {
		display: block;
		height: 100%;
		background: var(--color-rich);
		transform-origin: top;
		animation: fill var(--turn) linear forwards;
	}
	@keyframes fill {
		from {
			transform: scaleY(0);
		}
	}
	.sheet.idle .line span,
	.sheet:has(:focus-visible) .line span {
		animation-play-state: paused;
	}
	@media (hover: hover) {
		.sheet:hover .line span {
			animation-play-state: paused;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.line span {
			animation: none;
		}
	}
</style>
