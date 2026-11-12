<script lang="ts">
	import '#lib/lab.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { pages, pageById, entriesOf, allEntries, type Entry } from '#lib/lab.ts';
	import { favs } from '#lib/favs.svelte.ts';

	// The gallery shell: pages in the sidebar (with their pick counts), the current page's cards under it, the
	// favourites page on top. Pause all, the motion note and the Type panel as in the old index.html.
	let { children } = $props();
	const cur = $derived(page.params.page ?? (page.url.pathname === '/favorites' ? 'favorites' : ''));
	const curPage = $derived(pageById(cur));
	let hash = $state(location.hash.slice(1));
	let paused = $state(false);

	/* quick search over every card's code, title and name; "/" focuses, ↑ ↓ pick, Enter opens, Esc clears */
	let q = $state('');
	let sel = $state(0);
	let box: HTMLInputElement;
	const all = allEntries();
	const hits = $derived.by(() => {
		const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (!words.length) return [];
		return all.filter((e) => {
			const hay = `${e.code} ${e.d.title} ${e.d.name} ${e.page.title}`.toLowerCase();
			return words.every((w) => hay.includes(w));
		});
	});
	const open = (e: Entry) => {
		q = '';
		goto(`/${e.page.id}#${e.d.name}`);
	};
	function keys(ev: KeyboardEvent) {
		if (ev.key === 'ArrowDown') sel = Math.min(sel + 1, hits.length - 1);
		else if (ev.key === 'ArrowUp') sel = Math.max(sel - 1, 0);
		else if (ev.key === 'Enter' && hits[sel]) open(hits[sel]);
		else if (ev.key === 'Escape') (q = ''), box.blur();
		else return;
		ev.preventDefault();
	}

	onMount(() => {
		const on = () => (hash = location.hash.slice(1));
		addEventListener('hashchange', on);
		const slash = (ev: KeyboardEvent) => {
			const t = ev.target as HTMLElement;
			if (ev.key !== '/' || t.closest('input, textarea, select, [contenteditable]')) return;
			ev.preventDefault();
			box.focus();
		};
		addEventListener('keydown', slash);
		/* Type panel: Tweakpane 4 from jsDelivr, once per session (it adds its own floating element) */
		const TWEAKPANE = 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
		if (!(window as any).__typePane)
			import(/* @vite-ignore */ TWEAKPANE)
				.then(({ Pane }) => {
					(window as any).__typePane = true;
					window.FontLab.pane(Pane, { title: 'Type', expanded: false });
				})
				.catch((e) => console.warn('Type panel unavailable', e));
		return () => {
			removeEventListener('hashchange', on);
			removeEventListener('keydown', slash);
		};
	});
	const note = (window.Motion?.__shim ? 'Motion CDN unreachable, using the built-in shim' : 'Motion 12 loaded') + (window.DEMOS.reduced ? ' · reduced motion: still frames' : '');
</script>

<div class="lab">
	<aside class="side">
		<div class="brand"><div class="eyebrow">iframely.com redesign</div><div class="title">Motion lab</div><div class="date">2026-10-22 · SvelteKit</div></div>
		<div class="search">
			<input
				bind:this={box}
				bind:value={q}
				oninput={() => (sel = 0)}
				onkeydown={keys}
				type="search"
				placeholder="Search titles"
				aria-label="Search card titles"
				aria-controls="search-hits"
			/>
			<kbd>/</kbd>
		</div>
		{#if q.trim()}
			<div class="hits" id="search-hits" role="listbox">
				<div class="hits-n">{hits.length} {hits.length === 1 ? 'card' : 'cards'}</div>
				{#each hits.slice(0, 80) as e, i (e.d.name)}
					<a
						href={`/${e.page.id}#${e.d.name}`}
						class:on={i === sel}
						role="option"
						aria-selected={i === sel}
						onmouseenter={() => (sel = i)}
						onclick={(ev) => {
							ev.preventDefault();
							open(e);
						}}
						><code>{e.code}</code><span>{e.d.title}<small>{e.page.title}</small></span>{#if favs.has(e.d.name)}<span class="pk">★</span>{/if}</a
					>
				{:else}
					<div class="hits-none">Nothing matches.</div>
				{/each}
			</div>
		{/if}
		<nav aria-label="Pages" hidden={!!q.trim()}>
			<a href="/favorites" class="pg fav" class:on={cur === 'favorites'}>★ Picks <span class="n">{favs.ready ? favs.count() : ''}</span></a>
			{#each pages() as p (p.id)}
				<a href={`/${p.id}`} class="pg" class:on={p.id === cur}>{p.title}{#if favs.count(p.id)}<span class="n">★ {favs.count(p.id)}</span>{/if}</a>
				{#if curPage && p.id === curPage.id}
					<div class="sub">
						{#each entriesOf(p) as e (e.d.name)}
							<a href={`/${p.id}#${e.d.name}`} class:on={hash === e.d.name}><code>{e.code}</code>{e.d.title}{#if favs.has(e.d.name)}<span class="pk">★</span>{/if}</a>
						{/each}
					</div>
				{/if}
			{/each}
		</nav>
		<div class="side-foot">
			<button
				onclick={() => {
					paused = !paused;
					window.DEMOS.setPaused(paused);
				}}>{paused ? 'Resume all' : 'Pause all'}</button
			>
			<div>{note}</div>
			<div>
				Picks are saved to {favs.where === 'file' ? 'favorites.json in the lab folder' : 'this browser only'}. Hover a demo to pause its loop.
				<a href="/index.html">Old gallery ↗</a>
			</div>
		</div>
	</aside>
	<main class="main">{@render children()}</main>
</div>
