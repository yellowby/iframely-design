<script lang="ts">
	import { onMount } from 'svelte';
	import { favs, trash } from '#lib/favs.svelte.ts';

	let { children } = $props();
	onMount(() => {
		favs.load();
		trash.load();
	});
</script>

{@render children()}
