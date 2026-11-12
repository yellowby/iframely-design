<script lang="ts">
	import Card from '#lib/Card.svelte';
	import PickButton from '#lib/PickButton.svelte';
	import { pages, entry, entriesOf } from '#lib/lab.ts';
	import { favs } from '#lib/favs.svelte.ts';

	// All picks in one place: a table grouped by page in gallery order (code, title, where it lives, when, a note),
	// picks whose demo no longer exists, and the picked cards themselves, live, under the table.
	document.title = 'Picks · Iframely Motion Lab';
	let previews = $state(true);
	let filter = $state('all');

	const groups = $derived(
		pages()
			.map((p) => ({ p, list: entriesOf(p).filter((e) => favs.has(e.d.name)) }))
			.filter((g) => g.list.length && (filter === 'all' || filter === g.p.id))
	);
	const lost = $derived(Object.entries(favs.items).filter(([k]) => !entry(k)));
	const when = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
</script>

<h1>Picks</h1>
<p class="intro">
	Every card you picked, with where it lives. Pick or unpick from any card (☆ Pick next to its title), here, or in full
	screen. {favs.where === 'file' ? 'Saved to favorites.json in the lab folder, so they can be read, diffed and committed.' : 'Saved in this browser only (the dev server is not running).'}
</p>

<div class="bar">
	<label>Page <select bind:value={filter}><option value="all">All pages</option>{#each pages().filter((p) => favs.count(p.id)) as p (p.id)}<option value={p.id}>{p.title} ({favs.count(p.id)})</option>{/each}</select></label>
	<label><input type="checkbox" bind:checked={previews} /> Show the cards</label>
	<span class="total">{favs.count()} picks</span>
</div>

{#if !favs.ready}
	<p class="intro">Loading…</p>
{:else if !favs.count()}
	<p class="intro">No picks yet.</p>
{:else}
	{#each groups as g (g.p.id)}
		<section class="grp">
			<h2><a href={`/${g.p.id}`}>{g.p.title}</a> <span>{g.list.length}</span></h2>
			<table>
				<tbody>
					{#each g.list as e (e.d.name)}
						<tr>
							<td class="code"><code>{e.code}</code></td>
							<td class="title"><a href={`/${g.p.id}#${e.d.name}`}>{e.d.title}</a><span class="name">{e.d.name}</span></td>
							<td class="note"><input value={favs.items[e.d.name]?.note ?? ''} placeholder="note" onchange={(ev) => favs.note(e.d.name, (ev.target as HTMLInputElement).value)} /></td>
							<td class="when">{when(favs.items[e.d.name].at)}</td>
							<td class="act"><a href={`/demo/${e.d.name}`} title="Open full screen">↗</a> <PickButton name={e.d.name} small /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/each}
	{#if lost.length && filter === 'all'}
		<section class="grp">
			<h2>No longer in the lab <span>{lost.length}</span></h2>
			<table>
				<tbody>
					{#each lost as [k, f] (k)}
						<tr><td class="code"><code>{f.code}</code></td><td class="title">{f.title}<span class="name">{k} · was on {f.page}</span></td><td class="note">{f.note ?? ''}</td><td class="when">{when(f.at)}</td><td class="act"><PickButton name={k} small /></td></tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}

	{#if previews}
		<div class="cards">
			{#each groups as g (g.p.id)}
				{#each g.list as e (e.d.name)}<Card {e} where />{/each}
			{/each}
		</div>
	{/if}
{/if}

<style>
	.bar { display: flex; flex-wrap: wrap; gap: 18px; align-items: center; margin: -8px 0 28px; font: 13px var(--sans); color: var(--ink2); }
	.bar select { margin-left: 6px; font: inherit; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); }
	.bar .total { margin-left: auto; font: 12px var(--mono); color: var(--ink3); }
	.grp { margin-bottom: 30px; }
	.grp h2 { font: 600 15px var(--sans); margin: 0 0 8px; display: flex; gap: 8px; align-items: baseline; }
	.grp h2 a { color: var(--ink); text-decoration: none; }
	.grp h2 a:hover { text-decoration: underline; }
	.grp h2 span { font: 12px var(--mono); color: #0055ff; }
	table { width: 100%; border-collapse: collapse; font: 13px var(--sans); }
	td { padding: 7px 8px; border-top: 1px solid var(--line); vertical-align: middle; }
	tr:last-child td { border-bottom: 1px solid var(--line); }
	.code { width: 46px; }
	.code code { font: 12px var(--mono); color: var(--accent); }
	.title a { color: var(--ink); text-decoration: none; }
	.title a:hover { text-decoration: underline; }
	.title .name { display: block; font: 11px var(--mono); color: var(--ink3); margin-top: 2px; }
	.note { width: 32%; }
	.note input { width: 100%; font: 12px var(--sans); padding: 4px 8px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--ink2); }
	.note input:hover, .note input:focus { border-color: var(--line); background: var(--surface); outline: none; }
	.when { width: 64px; font: 11px var(--mono); color: var(--ink3); white-space: nowrap; }
	.act { width: 74px; text-align: right; white-space: nowrap; }
	.act a { color: var(--link); text-decoration: none; margin-right: 6px; }
	.cards { margin-top: 44px; }
</style>
