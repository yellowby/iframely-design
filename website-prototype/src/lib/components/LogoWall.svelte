<script lang="ts">
	import { untrack } from 'svelte';
	import atlassian from '#lib/assets/logos/atlassian.svg';
	import notion from '#lib/assets/logos/notion.svg';
	import canva from '#lib/assets/logos/canva.svg';
	import bloomberg from '#lib/assets/logos/bloomberg.svg';
	import linear from '#lib/assets/logos/linear.svg';
	import trello from '#lib/assets/logos/trello.svg';
	import nbsnews from '#lib/assets/logos/nbs-news.svg';
	import substack from '#lib/assets/logos/substack.svg';
	import gumroad from '#lib/assets/logos/gumroad.svg';
	import gitbook from '#lib/assets/logos/gitbook.svg';
	import vox from '#lib/assets/logos/vox.svg';
	import engadget from '#lib/assets/logos/engadget.svg';

	// Home01 trust block: six white cells on #f2f2f2, two sets of logos taking turns in them (as in lab S29/S41), and the
	// stats strip. Each time step goes up (the hero scene finished a URL) the shown logo leaves upward with a blur and
	// the other set rises in, 0.7s each and 110ms apart from left to right. Logos and sizes are the live site's
	// (publicly/src/lib/ui/logo-wall).
	let { step = 0, lead }: { step?: number; lead?: HTMLElement } = $props();

	// With the hero scene (lead) in view as well, the logos swap when it finishes a URL (step). A swap missed while the
	// wall was out of view plays as the wall scrolls in, and while only the wall is in view it keeps swapping on its own.
	const OWN_MS = 6000;
	let wall: HTMLDivElement;
	let seen = $state(false);
	let leadSeen = $state(false);
	let shown = $state(0);
	let pending = false;
	$effect(() => {
		const io = new IntersectionObserver(
			(es) => es.forEach((e) => (e.target === wall ? (seen = e.intersectionRatio >= 0.5) : (leadSeen = e.intersectionRatio >= 0.4))),
			{ threshold: [0, 0.4, 0.5, 1] }
		);
		io.observe(wall);
		if (lead) io.observe(lead);
		return () => io.disconnect();
	});
	let last = 0; // step starts at 0
	$effect(() => {
		if (step === last) return;
		last = step;
		if (seen && (leadSeen || !lead)) untrack(() => shown++);
		else pending = true;
	});
	$effect(() => {
		if (!seen) return;
		if (pending) {
			pending = false;
			untrack(() => shown++);
		}
		if (leadSeen || !lead) return;
		const id = setInterval(() => shown++, OWN_MS);
		return () => clearInterval(id);
	});

	type L = { title: string; src: string; w: number };
	const SETS: L[][] = [
		[
			{ title: 'Atlassian', src: atlassian, w: 113 },
			{ title: 'Notion', src: notion, w: 75 },
			{ title: 'Canva', src: canva, w: 71 },
			{ title: 'Bloomberg', src: bloomberg, w: 89 },
			{ title: 'Linear', src: linear, w: 81 },
			{ title: 'Trello', src: trello, w: 89 }
		],
		[
			{ title: 'NBC News', src: nbsnews, w: 122 },
			{ title: 'Substack', src: substack, w: 97 },
			{ title: 'Gumroad', src: gumroad, w: 107 },
			{ title: 'GitBook', src: gitbook, w: 90 },
			{ title: 'Vox', src: vox, w: 46 },
			{ title: 'Engadget', src: engadget, w: 88 }
		]
	];
	const cls = (k: number) => (shown === 0 ? (k === 0 ? 'on' : 'off') : k === shown % 2 ? 'in' : 'out');

	const STATS = [
		{ d: 'M2 8h3.33l2.34-5.33H8v10.66h.33L10.67 8H14', label: '6.5B requests a month' },
		{ d: 'M5 8l2 2 4-4M14.67 8A6.67 6.67 0 1 1 1.33 8a6.67 6.67 0 0 1 13.34 0Z', label: '99.99% uptime' },
		{ d: 'M8 1.67V10M8 1.33 13.33 4c0 4.44-1.33 8.44-5.33 10.67C4 12.44 2.67 8.44 2.67 4L8 1.33Z', label: 'SOC 2 Type II' }
	];
</script>

<div bind:this={wall} class="overflow-hidden rounded-[10px] bg-rule">
	<div class="grid grid-cols-3 gap-px p-px sm:grid-cols-6">
		{#each SETS[0] as _, i (i)}
			<div class="cell relative grid h-20 place-items-center overflow-hidden bg-white" style="--d:{i * 110}ms">
				{#each SETS as set, k (k)}
					<img src={set[i].src} alt={set[i].title} width={set[i].w} height="32" class={cls(k)} />
				{/each}
			</div>
		{/each}
	</div>
	<div class="t-small flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-4 text-faint">
		{#each STATS as s (s.label)}
			<span class="flex items-center gap-1.5"
				><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
					><path d={s.d} stroke="currentColor" stroke-width="1.5" stroke-linecap="square" /></svg
				>{s.label}</span
			>
		{/each}
	</div>
</div>

<style>
	.cell img {
		grid-area: 1 / 1;
		max-width: 80%;
		height: auto;
	}
	.off {
		opacity: 0;
	}
	.in {
		animation: logo-in .7s cubic-bezier(.2,.7,.2,1) var(--d) both;
	}
	.out {
		animation: logo-out .7s cubic-bezier(.4,0,.6,1) var(--d) both;
	}
	@keyframes logo-in {
		from {
			opacity: 0;
			transform: translateY(40px);
			filter: blur(4px);
		}
	}
	@keyframes logo-out {
		to {
			opacity: 0;
			transform: translateY(-40px);
			filter: blur(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.in,
		.out {
			animation-name: none;
		}
		.out {
			opacity: 0;
		}
	}
</style>
