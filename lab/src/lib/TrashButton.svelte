<script lang="ts">
	import { trash, toTrash, restore } from './favs.svelte.ts';

	// Trash on a card: the card leaves its page and waits on /trash. On a trashed card (the trash page, full screen)
	// the same button restores it.
	let { name, small = false }: { name: string; small?: boolean } = $props();
	const on = $derived(trash.has(name));
</script>

<button
	type="button"
	class="trashbtn"
	class:on
	class:small
	title={on ? 'Restore from the trash' : 'Move to the trash'}
	aria-label={on ? 'Restore from the trash' : 'Move to the trash'}
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		if (on) restore(name);
		else toTrash(name);
	}}
>
	{#if on}
		<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v3h3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
		Restore
	{:else}
		<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2.5 4.5h11M6.5 4.5V3h3v1.5M4 4.5l.6 8.5h6.8l.6-8.5M6.7 7v3.5M9.3 7v3.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
		{small ? '' : 'Trash'}
	{/if}
</button>

<style>
	.trashbtn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 26px;
		padding: 0 10px;
		border-radius: 13px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink3);
		font: 500 12px var(--sans);
		cursor: pointer;
		white-space: nowrap;
	}
	.trashbtn:hover {
		border-color: #c9372c;
		color: #c9372c;
	}
	.trashbtn.on {
		color: var(--ink2);
	}
	.trashbtn.on:hover {
		border-color: var(--ink3);
		color: var(--ink);
	}
	.trashbtn.small {
		height: 22px;
		padding: 0 7px;
	}
</style>
