<script lang="ts">
	// The seven-section docs architecture 
	let { current = '' }: { current?: string } = $props();

	const sections: { title: string; items: [string, string][] }[] = [
		{
			title: 'Get started',
			items: [
				['Quickstart: Preview API', '/docs#quickstart'],
				['Quickstart: Data API', '/docs/data-api'],
				['Quickstart: embed.js', '/docs#quickstart'],
				['API keys and origins', '/docs/reference'],
				['Rate limits and plans', '/pricing']
			]
		},
		{
			title: 'Preview API',
			items: [
				['Iframely API', '/docs/reference'],
				['oEmbed API', '/docs/reference'],
				['Cards and click-to-play', '/docs/reference'],
				['Consent and lazy-load', '/docs/reference'],
				['Content IDs', '/docs/reference']
			]
		},
		{
			title: 'Data API',
			items: [
				['Overview and quickstart', '/docs/data-api'],
				['Processing modes and use', '/docs/data-api#modes'],
				['The access object', '/docs/data-api#access'],
				['The three agents', '/docs/data-api#agents'],
				['Compliance', '/docs/data-api#compliance'],
				['Pricing and limits', '/pricing#data-api']
			]
		},
		{
			title: 'Integrations',
			items: [
				['Editors: Tiptap, Lexical, CKEditor 5', '/integrations'],
				['WordPress', '/wordpress'],
				['React, Next.js, Vue', '/integrations'],
				['MCP server and SDKs', '/mcp']
			]
		},
		{
			title: 'Guides',
			items: [
				['Rich previews in a React app', '/docs#guides'],
				['Paste-to-embed in an editor', '/docs#guides'],
				['Consent-compliant embeds in the EU', '/docs#guides'],
				['Ground an assistant on URLs', '/docs#guides'],
				['YouTube start and end time', '/help/youtube-start-time']
			]
		},
		{
			title: 'Publishers',
			items: [
				['The agents', '/publishers#agents'],
				['Allow-listing', '/verification'],
				['Content policy', '/publishers#control'],
				['Webmaster checklist', '/publishers']
			]
		},
		{
			title: 'Reference',
			items: [
				['OpenAPI', '/docs/reference'],
				['Parameters', '/docs/reference'],
				['Result codes', '/docs/reference'],
				['User agents and IP ranges', '/verification'],
				['Changelog', '/updates']
			]
		}
	];
</script>

<nav aria-label="Docs" class="text-sm">
	<div class="mb-4 rounded-md border border-ink-200 px-3 py-2 text-ink-400">Search docs and help… <kbd class="float-right text-xs">/</kbd></div>
	{#each sections as s (s.title)}
		<div class="mb-4">
			<p class="mb-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">{s.title}</p>
			<ul>
				{#each s.items as [label, href] (label)}
					<li>
						<a
							{href}
							class="block rounded px-2 py-1 {current === label
								? 'bg-brand-50 font-medium text-brand-800'
								: 'text-ink-700 hover:bg-ink-50'}">{label}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
