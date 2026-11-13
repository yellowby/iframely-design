<script lang="ts">
	import Card from '#lib/Card.svelte';
	import TrashButton from '#lib/TrashButton.svelte';
	import { pages, entry, entriesOf } from '#lib/lab.ts';
	import { trash } from '#lib/favs.svelte.ts';

	// The trash: every card moved out of its page, grouped by page in gallery order (code, title, where it lived,
	// when), each with a Restore button, and the cards themselves on request. Nothing is deleted from the demo files.
	document.title = 'Trash · Iframely Motion Lab';
	let previews = $state(false);

	const groups = $derived(
		pages()
			.map((p) => ({ p, list: entriesOf(p).filter((e) => trash.has(e.d.name)) }))
			.filter((g) => g.list.length)
	);
	const lost = $derived(Object.entries(trash.items).filter(([k]) => !entry(k)));
	const when = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
</script>

<h1>Trash</h1>
<p class="intro">
	Cards you moved out of the way (Trash next to a card's title). They are hidden from their pages, the sidebar and the
	search, and keep their codes; the demo files are not touched. Restore puts a card back where it was.
	{trash.where === 'file' ? 'Saved to trash.json in the lab folder.' : 'Saved in this browser only (the dev server is not running).'}
</p>

<div class="bar">
	<label><input type="checkbox" bind:checked={previews} /> Show the cards</label>
	{#if trash.count()}<button type="button" onclick={() => trash.clear()}>Restore all</button>{/if}
	<span class="total">{trash.count()} in the trash</span>
</div>

{#if !trash.ready}
	<p class="intro">Loading…</p>
{:else if !trash.count()}
	<p class="intro">The trash is empty.</p>
{:else}
	{#each groups as g (g.p.id)}
		<section class="grp">
			<h2><a href={`/${g.p.id}`}>{g.p.title}</a> <span>{g.list.length}</span></h2>
			<table>
				<tbody>
					{#each g.list as e (e.d.name)}
						<tr>
							<td class="code"><code>{e.code}</code></td>
							<td class="title">{e.d.title}<span class="name">{e.d.name}</span></td>
							<td class="when">{when(trash.items[e.d.name].at)}</td>
							<td class="act"><a href={`/demo/${e.d.name}`} title="Open full screen">↗</a> <TrashButton name={e.d.name} small /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/each}
	{#if lost.length}
		<section class="grp">
			<h2>No longer in the lab <span>{lost.length}</span></h2>
			<table>
				<tbody>
					{#each lost as [k, f] (k)}
						<tr><td class="code"><code>{f.code}</code></td><td class="title">{f.title}<span class="name">{k} · was on {f.page}</span></td><td class="when">{when(f.at)}</td><td class="act"><TrashButton name={k} small /></td></tr>
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
	.bar button { height: 28px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); font: 500 12px var(--sans); color: var(--ink2); cursor: pointer; }
	.bar button:hover { border-color: var(--ink3); color: var(--ink); }
	.bar .total { margin-left: auto; font: 12px var(--mono); color: var(--ink3); }
	.grp { margin-bottom: 30px; }
	.grp h2 { font: 600 15px var(--sans); margin: 0 0 8px; display: flex; gap: 8px; align-items: baseline; }
	.grp h2 a { color: var(--ink); text-decoration: none; }
	.grp h2 a:hover { text-decoration: underline; }
	.grp h2 span { font: 12px var(--mono); color: var(--ink3); }
	table { width: 100%; border-collapse: collapse; font: 13px var(--sans); }
	td { padding: 7px 8px; border-top: 1px solid var(--line); vertical-align: middle; }
	tr:last-child td { border-bottom: 1px solid var(--line); }
	.code { width: 46px; }
	.code code { font: 12px var(--mono); color: var(--accent); }
	.title { color: var(--ink2); }
	.title .name { display: block; font: 11px var(--mono); color: var(--ink3); margin-top: 2px; }
	.when { width: 64px; font: 11px var(--mono); color: var(--ink3); white-space: nowrap; }
	.act { width: 130px; text-align: right; white-space: nowrap; }
	.act a { color: var(--link); text-decoration: none; margin-right: 6px; }
	.cards { margin-top: 44px; }
</style>
