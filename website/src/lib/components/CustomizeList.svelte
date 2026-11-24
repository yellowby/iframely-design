<script lang="ts">
	// The "For editors and apps" block on /embeds, built as the block "For security teams" (components/SecurityQA.svelte):
	// the copy on the left, straight on the page, the working scene (components/OptionsDemo.svelte) on grey paper on
	// the right, as tall as the copy. No card. (The two sides were also tried the other way round, the scene on the left.)
	// (It was a white card: the copy on its left as a list of four headings parted by hairlines, one of them open, the
	// scene on its right. /embeds-3 has CustomizeSheet.svelte: a sheet with the scene on the left and all four texts
	// on the right, the three that are off dimmed.)
	// The copy is four headings, each with its text under it, all open at once. One is shown: its scene is on the
	// paper and it has a blue rule at its left, as the question shown in block 05. The rule fills from the top in TURN
	// seconds, then the next one is shown, round and round. It stands still while the pointer is over the block, while
	// the keyboard's focus is in it and while the block is out of view, and starts again after a click in the scene.
	// With reduced motion nothing takes turns.
	import { onMount } from 'svelte';
	import OptionsDemo from './OptionsDemo.svelte';
	import { parts } from '#lib/copy.ts';

	// items: heading, text (it may have links in it, written [as this](/docs/options)); the scene is the item's place
	// in the list
	let { items }: { items: string[][] } = $props();
	const TURN = 9;

	let active = $state(0);
	let run = $state(0); // goes up to start the rule again
	let box: HTMLDivElement;
	let seen = $state(false);
	onMount(() => {
		const io = new IntersectionObserver((es) => (seen = es[0].isIntersecting), { threshold: 0.35 });
		io.observe(box);
		return () => io.disconnect();
	});
	const pick = (i: number) => {
		active = i;
		run++;
	};
	// How the scenes change places (since 2026-11-24, as block 05's, components/SecurityQA.svelte): the window stands
	// still, with its bar's and its foot's hairlines, and only what is in its three parts changes, through white: the
	// old scene's fades out in OUT ms, then the new one's fades in (0.2s, the styles below). So the paper shows
	// `shown`, which follows `active` after the fade out.
	// (Before: the old window was gone at once and the new one came in whole, fading and rising 6px in 0.35s, as
	// OptionsDemo does by itself, and still does on /embeds-2 and /embeds-3.)
	const OUT = 120;
	let shown = $state(0);
	let out = $state(false);
	$effect(() => {
		if (active === shown) {
			out = false;
			return;
		}
		const next = active;
		const swap = () => {
			shown = next;
			out = false;
		};
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
		out = true;
		const t = setTimeout(swap, OUT);
		return () => clearTimeout(t);
	});
</script>

<div bind:this={box} class="box grid gap-x-16 gap-y-8 lg:grid-cols-2" class:idle={!seen} style="--turn:{TURN}s">
	<!-- the copy, under the block's heading: the rule of the one shown is on the heading's left edge -->
	<div class="self-start">
		{#each items as [name, body], i (name)}
			<!-- the whole item takes the click (but for a link in its text); the heading's button is the same switch for
			     the keyboard -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="item" class:on={i === active} onclick={(e) => i !== active && !(e.target as Element).closest('a') && pick(i)}>
				{#if i === active}
					{#key run}<span class="rule" aria-hidden="true"><span onanimationend={() => pick((active + 1) % items.length)}></span></span>{/key}
				{/if}
				<h3 class="text-[18px] leading-[1.35] font-medium text-fg">
					<button type="button" aria-pressed={i === active} onclick={(e) => (e.stopPropagation(), pick(i))}>{name}</button>
				</h3>
				<!-- (a text may have links in it, lib/copy.ts) -->
				<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">{#each parts(body) as [words, href], n (n)}{#if href}<a class="copy-link" {href}>{words}</a>{:else}{words}{/if}{/each}</p>
			</div>
		{/each}
	</div>

	<!-- The paper: beside the copy it is as tall as the copy, with its window in the middle; the window is one height
	     in every scene, and low enough (OptionsDemo's low) to fit in it, so nothing moves as the scenes take turns.
	     (The paper was as tall as its window, which was taller than the four texts.) As block 05's, it reaches 24px
	     (its padding) to the left of its column, so the window in it starts where the block's tagline starts,
	     above. Under lg it comes first, over the copy, as tall as its window: the scene stays in sight while the
	     texts are pressed. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scene max-lg:order-first lg:-ml-6" class:out onclick={() => run++}><OptionsDemo scene={shown} plain max={560} yt one unmarked low card /></div>
</div>

<style>
	/* a heading with its text: the whole of it is the switch. The one shown has a blue rule at its left. */
	.item {
		position: relative;
		padding: 16px 0 16px 24px;
	}
	.item:not(.on) {
		cursor: pointer;
	}
	/* Pointing at an item that is not the one shown: a grey bar at its left edge, where its blue rule would be; as
	   long as the rule, and as thin. (Grey, not white: the page is near white. It was at the right edge for a moment.) */
	.item::after {
		content: '';
		position: absolute;
		top: 12px;
		bottom: 12px;
		left: 0;
		width: 2px;
		background: rgb(0 0 0 / 0.07); /* (it was twice as dark: too much) */
		opacity: 0;
		transition: opacity 0.15s;
	}
	@media (hover: hover) {
		.item:not(.on):hover::after {
			opacity: 1;
		}
	}
	.item button {
		text-align: left;
		cursor: inherit;
		font: inherit;
	}
	.item button:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
		border-radius: 2px;
	}
	/* the rule: a faint blue track, filling with blue from the top while the item has its turn (as block 05's,
	   components/SecurityQA.svelte) */
	.rule {
		position: absolute;
		top: 12px;
		bottom: 12px;
		left: 0;
		width: 2px;
		background: color-mix(in srgb, var(--color-rich) 20%, transparent);
	}
	.rule span {
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
	.box.idle .rule span,
	.box:has(:focus-visible) .rule span {
		animation-play-state: paused;
	}
	@media (hover: hover) {
		.box:hover .rule span {
			animation-play-state: paused;
		}
	}
	/* A scene's change (see `shown`). The rules reach into components/OptionsDemo.svelte: its window does not come in
	   whole here; what is in the window's bar, its body and its foot fades out, then the next scene's fades in. */
	.scene :global(.win) {
		animation: none;
	}
	.scene :global(.win > * > *) {
		animation: scene-in 0.2s ease-out;
	}
	.scene.out :global(.win > * > *) {
		opacity: 0;
		transition: opacity 0.12s ease-in;
	}
	@keyframes scene-in {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rule span,
		.scene :global(.win > * > *) {
			animation: none;
		}
	}
</style>
