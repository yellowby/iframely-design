<script lang="ts">
	import { page } from '$app/state';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';

	// Any docs URL not rebuilt in the demo: point to the live page or say it is planned.
	const path = $derived(page.url.pathname);
	const planned = $derived(path.startsWith('/docs/integrations/') || path === '/docs/guides' || path === '/docs/integrations');
</script>

<svelte:head><title>Docs page not in the demo</title></svelte:head>

<Section narrow eyebrow="Docs" title={planned ? 'Planned docs page' : 'Existing docs page'}>
	<p class="text-ink-700">
		{#if planned}
			<code>{path}</code> is part of the proposed docs architecture. It arrives with its integration or guide;
			until then the live docs say "coming" rather than linking a dead page.
		{:else}
			<code>{path}</code> exists on the live site and keeps its URL. This demo rebuilds only the docs index and one sample
			page in the new template.
		{/if}
	</p>
	<div class="mt-6 flex flex-wrap gap-3">
		{#if !planned}<Button href="https://iframely.com{path}">Open on iframely.com</Button>{/if}
		<Button href="/docs/data-api" variant="secondary">See the new page template</Button>
	</div>
</Section>
