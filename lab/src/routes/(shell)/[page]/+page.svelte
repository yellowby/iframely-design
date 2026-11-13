<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import Card from '#lib/Card.svelte';
	import { pageById, entriesOf } from '#lib/lab.ts';
	import { trash } from '#lib/favs.svelte.ts';

	const p = $derived(pageById(page.params.page ?? ''));
	/* trashed cards leave the page (they keep their codes, so the rest are not renumbered) and wait on /trash */
	const everything = $derived(p ? entriesOf(p) : []);
	const list = $derived(everything.filter((e) => !trash.has(e.d.name)));
	const binned = $derived(everything.length - list.length);

	/* a card named in the hash stays at the top while the lazy cards above it mount and grow (2.5 s, or until the
	   reader scrolls), as in the old gallery */
	let unpin = () => {};
	function pin(name: string) {
		unpin(); /* one pin at a time: a second card must not fight the first for the scroll position */
		const el = document.getElementById('card-' + name);
		if (!el) return;
		const t0 = performance.now();
		let live = true;
		const stop = () => {
			live = false;
			['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((e) => removeEventListener(e, stop));
		};
		unpin = stop;
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
		else {
			unpin();
			scrollTo(0, 0);
		}
	};
	onMount(() => {
		addEventListener('hashchange', follow);
		return () => removeEventListener('hashchange', follow);
	});
	/* follow the page and the hash from the router's state: goto() to another card on the same page (search → Enter)
	   changes the hash without a hashchange event */
	$effect(() => {
		page.url.hash;
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
		{#if binned}<p class="binned"><a href="/trash">{binned} {binned === 1 ? 'card' : 'cards'} from this page in the trash →</a></p>{/if}
	{/key}
{:else}
	<h1>Not found</h1>
	<p class="intro">There is no lab page called “{page.params.page}”.</p>
{/if}

<style>
	.binned { margin: 40px 0 0; font: 12px var(--mono); }
	.binned a { color: var(--ink3); text-decoration: none; }
	.binned a:hover { color: var(--ink); text-decoration: underline; }
</style>
