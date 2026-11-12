<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import Card from '#lib/Card.svelte';
	import { pageById, entriesOf } from '#lib/lab.ts';

	const p = $derived(pageById(page.params.page ?? ''));
	const list = $derived(p ? entriesOf(p) : []);

	/* a card named in the hash stays at the top while the lazy cards above it mount and grow (2.5 s, or until the
	   reader scrolls), as in the old gallery */
	function pin(name: string) {
		const el = document.getElementById('card-' + name);
		if (!el) return;
		const t0 = performance.now();
		let live = true;
		const stop = () => {
			live = false;
			['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((e) => removeEventListener(e, stop));
		};
		['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((e) => addEventListener(e, stop, { passive: true }));
		const go = () => {
			if (!live) return;
			el.scrollIntoView({ block: 'start' });
			if (performance.now() - t0 < 2500) requestAnimationFrame(go);
			else stop();
		};
		requestAnimationFrame(go);
	}
	const follow = async () => {
		await tick();
		const h = location.hash.slice(1);
		if (h) pin(h);
		else scrollTo(0, 0);
	};
	onMount(() => {
		addEventListener('hashchange', follow);
		return () => removeEventListener('hashchange', follow);
	});
	$effect(() => {
		if (p) {
			document.title = p.title + ' · Iframely Motion Lab';
			follow();
		}
	});
</script>

{#if p}
	{#key p.id}
		<h1>{p.title}</h1>
		<p class="intro">{p.intro}</p>
		<div class="cards">
			{#each list as e (e.d.name)}<Card {e} />{/each}
		</div>
	{/key}
{:else}
	<h1>Not found</h1>
	<p class="intro">There is no lab page called “{page.params.page}”.</p>
{/if}
