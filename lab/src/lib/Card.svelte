<script lang="ts">
	import { onMount } from 'svelte';
	import PickButton from './PickButton.svelte';
	import { frameGroup, type Entry } from './lab.ts';

	// One demo as a gallery card: code, title, pick, full-screen link, blurb, and the frame it mounts into when it comes
	// within 400px of the viewport (as the old gallery did), unmounted when the card goes away.
	let { e, where = false }: { e: Entry; where?: boolean } = $props();
	let frame: HTMLDivElement;

	onMount(() => {
		let un: (() => void) | undefined;
		const io = new IntersectionObserver(
			(es) => {
				if (!es.some((x) => x.isIntersecting)) return;
				io.disconnect();
				try {
					un = window.DEMOS.mount(frame, e.d.name);
				} catch (err: any) {
					console.error(err);
					frame.innerHTML = `<div class="fallback">failed: ${err.message}</div>`;
				}
			},
			{ rootMargin: '400px 0px' }
		);
		io.observe(frame);
		return () => {
			io.disconnect();
			try {
				un?.();
			} catch (err) {
				console.warn(err);
			}
		};
	});
</script>

<article class="card" id={'card-' + e.d.name}>
	<header>
		<h3>
			<code>{e.code}</code>{e.d.title}
			<PickButton name={e.d.name} />
		</h3>
		<span class="links">
			{#if where}<a href={`/${e.page.id}#${e.d.name}`}>in {e.page.title} →</a>{/if}
			<a href={`/demo/${e.d.name}`}>open full screen ↗</a>
		</span>
		<p>{e.d.blurb}</p>
	</header>
	<div class="frame g-{frameGroup(e)}" bind:this={frame}></div>
</article>
