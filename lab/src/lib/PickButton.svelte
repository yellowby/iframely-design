<script lang="ts">
	import { favs } from './favs.svelte.ts';

	let { name, small = false }: { name: string; small?: boolean } = $props();
	const on = $derived(favs.has(name));
</script>

<button
	type="button"
	class="pickbtn"
	class:on
	class:small
	aria-pressed={on}
	title={on ? 'Remove from picks' : 'Add to picks'}
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		favs.toggle(name);
	}}>{on ? '★' : '☆'}{small ? '' : on ? ' Picked' : ' Pick'}</button
>

<style>
	.pickbtn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 26px;
		padding: 0 10px;
		border-radius: 13px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink2);
		font: 500 12px var(--sans);
		cursor: pointer;
		white-space: nowrap;
	}
	.pickbtn:hover {
		border-color: var(--ink3);
		color: var(--ink);
	}
	.pickbtn.on {
		background: #0055ff;
		border-color: #0055ff;
		color: #fff;
	}
	.pickbtn.small {
		height: 22px;
		padding: 0 7px;
	}
</style>
