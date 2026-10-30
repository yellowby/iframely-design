<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Header from '#lib/components/Header.svelte';
	import { typeCss } from '#lib/type/type.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	// The footer is rebuilt in a later step (Home01 has none yet)
	const typeStyle = `<style id="type-roles">${typeCss()}</style>`;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="robots" content="noindex" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap"
	/>
	{@html typeStyle}
</svelte:head>

<Header />
<main>
	{@render children()}
</main>
