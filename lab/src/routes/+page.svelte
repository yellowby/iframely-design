<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pages, entry } from '#lib/lab.ts';

	// "/" opens the first page; old gallery links (/#content, /#pg-ft-tree-floor) land on the matching page and card.
	onMount(() => {
		const key = location.hash.slice(1);
		const p = pages().find((x) => x.id === key);
		const e = key ? entry(key) : undefined;
		goto(p ? `/${p.id}` : e ? `/${e.page.id}#${key}` : `/${pages()[0].id}`, { replaceState: true });
	});
</script>
