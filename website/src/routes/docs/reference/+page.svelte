<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import DocsSidebar from '#lib/components/DocsSidebar.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
</script>

<PageMeta
	title="API reference: endpoints, parameters, result codes | Iframely docs"
	description="OpenAPI, the full parameter list, result codes, user-agent strings and IP ranges."
/>

<div class="wrap grid gap-10 py-10 lg:grid-cols-[15rem_1fr]">
	<aside class="hidden lg:block"><DocsSidebar current="OpenAPI" /></aside>
	<article>
		<nav class="text-sm text-ink-500"><a href="/docs">Docs</a> / Reference</nav>
		<h1 class="t-hero mt-3">API reference</h1>
		<p class="mt-4 text-lg text-ink-700">
			Every endpoint, parameter and result code, generated from the OpenAPI document. Download it at
			<code>/openapi.json</code> for your client generator or your coding agent.
		</p>
		<Placeholder label="Stub: reference pages are out of scope for the copy demo" class="mt-8 h-48" />
	</article>
</div>
