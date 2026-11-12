<script lang="ts">
	import { onMount } from 'svelte';
	import { favs } from '#lib/favs.svelte.ts';

	let { children } = $props();
	onMount(() => favs.load());
</script>

{@render children()}
