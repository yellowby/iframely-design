<script lang="ts">
	import '#lib/lab.css';
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { pages, pageById, entriesOf, allEntries, type Entry } from '#lib/lab.ts';
	import { favs, trash } from '#lib/favs.svelte.ts';

	// The gallery shell: pages in the sidebar (with their pick counts), the current page's cards under it, the
	// favourites page on top. Pause all, the motion note and the Type panel as in the old index.html.
	let { children } = $props();
	const cur = $derived(page.params.page ?? (page.url.pathname === '/favorites' ? 'favorites' : page.url.pathname === '/trash' ? 'trash' : ''));
	const curPage = $derived(pageById(cur));
	let hash = $state(location.hash.slice(1));
	/* goto() to a card on the same page changes the hash without a hashchange event; the router's state has it */
	$effect(() => {
		hash = page.url.hash.slice(1);
	});
	let paused = $state(false);

	/* sidebar sections: the current page's card list is open by default, the others closed; the chevron overrides that
	   per page (kept in localStorage). Opening a page clears a "closed" override, so its list shows again. */
	const NAV = 'motion-lab-nav-open';
	let navOpen = $state<Record<string, boolean>>(
		(() => {
			try {
				return JSON.parse(localStorage.getItem(NAV) || '{}') ?? {};
			} catch {
				return {};
			}
		})()
	);
	const saveNav = () => {
		try {
			localStorage.setItem(NAV, JSON.stringify(navOpen));
		} catch {}
	};
	const isOpen = (id: string) => navOpen[id] ?? id === cur;
	function toggleNav(id: string) {
		const next = !isOpen(id);
		if (next === (id === cur)) delete navOpen[id];
		else navOpen[id] = next;
		saveNav();
	}
	$effect(() => {
		const id = cur;
		untrack(() => {
			if (navOpen[id] === false) {
				delete navOpen[id];
				saveNav();
			}
		});
	});

	/* quick search over every card's code, title and name; "/" focuses, ↑ ↓ pick, Enter opens, Esc clears */
	let q = $state('');
	let sel = $state(0);
	let box: HTMLInputElement;
	const SHOWN = 80; /* results listed at most */
	const all = allEntries();
	const hits = $derived.by(() => {
		const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (!words.length) return [];
		return all.filter((e) => {
			if (trash.has(e.d.name)) return false; /* trashed cards are found on /trash only */
			const hay = `${e.code} ${e.d.title} ${e.d.name} ${e.page.title}`.toLowerCase();
			return words.every((w) => hay.includes(w));
		});
	});
	const open = (e: Entry) => {
		q = '';
		goto(`/${e.page.id}#${e.d.name}`);
	};
	function keys(ev: KeyboardEvent) {
		const last = Math.min(hits.length, SHOWN) - 1;
		if (ev.key === 'ArrowDown') sel = sel >= last ? 0 : sel + 1;
		else if (ev.key === 'ArrowUp') sel = sel <= 0 ? last : sel - 1;
		else if (ev.key === 'Home' && ev.ctrlKey) sel = 0;
		else if (ev.key === 'End' && ev.ctrlKey) sel = last;
		else if (ev.key === 'Enter' && hits[sel]) open(hits[sel]);
		else if (ev.key === 'Escape') (q = ''), box.blur();
		else return;
		ev.preventDefault();
	}
	/* keep the selected result in view while the arrows move through a list longer than the sidebar */
	let hitsEl = $state<HTMLElement>();
	$effect(() => {
		sel;
		q;
		hitsEl?.querySelector('a.on')?.scrollIntoView({ block: 'nearest' });
	});

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
			<div class="hits" id="search-hits" role="listbox" bind:this={hitsEl}>
				<div class="hits-n">{hits.length} {hits.length === 1 ? 'card' : 'cards'}{hits.length > SHOWN ? ` · first ${SHOWN} shown` : ''}</div>
				{#each hits.slice(0, SHOWN) as e, i (e.d.name)}
					<a
						href={`/${e.page.id}#${e.d.name}`}
						class:on={i === sel}
						role="option"
						aria-selected={i === sel}
						onmousemove={() => (sel = i)}
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
			<!-- Picks and Trash: the same 14px icon box and gap, so the icons and the labels line up in two columns -->
			<a href="/favorites" class="pg mark" class:on={cur === 'favorites'}
				><span class="lbl"
					><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.6l1.9 4.1 4.5.5-3.4 3 1 4.4L8 11.3l-4 2.3 1-4.4-3.4-3 4.5-.5z" fill="currentColor" /></svg
					>Picks</span
				> <span class="n">{favs.ready ? favs.count() : ''}</span></a
			>
			<a href="/trash" class="pg mark bin" class:on={cur === 'trash'}
				><span class="lbl"
					><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2.5 4.5h11M6.5 4.5V3h3v1.5M4 4.5l.6 8.5h6.8l.6-8.5M6.7 7v3.5M9.3 7v3.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg
					>Trash</span
				> <span class="n">{trash.ready ? trash.count() : ''}</span></a
			>
			{#each pages() as p (p.id)}
				<div class="pgrow">
					<a href={`/${p.id}`} class="pg" class:on={p.id === cur}>{p.title}{#if favs.count(p.id)}<span class="n">★ {favs.count(p.id)}</span>{/if}</a>
					<button
						class="tg"
						class:open={isOpen(p.id)}
						aria-expanded={isOpen(p.id)}
						aria-controls={`sub-${p.id}`}
						aria-label={`${isOpen(p.id) ? 'Collapse' : 'Expand'} ${p.title}`}
						title={isOpen(p.id) ? 'Collapse' : 'Expand'}
						onclick={() => toggleNav(p.id)}
						><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M3 1.5 6.5 5 3 8.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button
					>
				</div>
				{#if isOpen(p.id)}
					<div class="sub" id={`sub-${p.id}`}>
						{#each entriesOf(p).filter((e) => !trash.has(e.d.name)) as e (e.d.name)}
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
