<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Tabs from '#lib/components/Tabs.svelte';
	import Code from '#lib/components/Code.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import DocsSidebar from '#lib/components/DocsSidebar.svelte';
	import { previewCurl, previewResponse } from '#lib/data/samples.ts';

	const node = `const res = await fetch("https://iframe.ly/api/iframely?" + new URLSearchParams({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  api_key: process.env.IFRAMELY_API_KEY,
}));
const { meta, html } = await res.json();`;

	const python = `import os, requests
r = requests.get("https://iframe.ly/api/iframely", params={
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "api_key": os.environ["IFRAMELY_API_KEY"],
})
print(r.json()["meta"]["title"])`;
</script>

<PageMeta
	title="Iframely documentation"
	description="Docs for the Preview API, Data API and embed.js: quickstarts, guides, integrations, publisher guides and reference. Every page is also available as Markdown."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-12">
		<h1 class="t-hero">Iframely documentation</h1>
		<p class="mt-3 max-w-2xl text-lg text-ink-600">Send a URL, get a preview, an embed or readable content. Start with what you are building.</p>
		<div class="mt-6 max-w-xl rounded-lg border border-ink-200 bg-white px-4 py-3 text-ink-400 shadow-sm">
			Search docs and help center… <kbd class="float-right text-xs">/</kbd>
		</div>
		<p class="mt-3 text-sm text-ink-500">
			Every page is available as Markdown: add <code>.md</code> to its URL. Index for agents:
			<a href="#llms" class="underline">llms.txt</a>. Coding-agent skill: <a href="#skill" class="underline">SKILL.md</a>.
		</p>
	</div>
</section>

<Section title="What are you building?">
	<Cards
		cols={4}
		items={[
			{ title: 'Show link previews in my app', text: 'Call the Iframely API with a URL; render the title, image and site, or the summary card.', href: '#quickstart', cta: 'Preview API quickstart' },
			{ title: 'Embed rich media', text: 'Get responsive embed HTML for 1,900 providers, or let embed.js do it on the page.', href: '/docs/reference', cta: 'Embeds and embed.js' },
			{ title: 'Read URLs for assistants and search', text: 'Declare a processing mode and get Markdown, entities and the publisher\'s access decision.', href: '/docs/data-api', cta: 'Data API quickstart' },
			{ title: 'Control how my site appears', text: 'See which agents fetch your pages, set a content policy, fix your cards.', href: '/publishers', cta: 'Publisher guides' }
		]}
	/>
</Section>

<Section id="quickstart" tone="muted" eyebrow="Quickstart" title="One request, one response">
	<div class="grid gap-6 lg:grid-cols-2">
		<div>
			<p class="mb-3 text-ink-700">Get a free key, then send any URL. The response has the metadata, the media links and ready-to-use HTML.</p>
			<Tabs tabs={[{ label: 'curl', code: previewCurl }, { label: 'Node', code: node }, { label: 'Python', code: python }]} />
			<a href="#sandbox" class="mt-3 inline-block text-sm font-medium text-brand-700">Open in sandbox →</a>
		</div>
		<Code code={previewResponse} label="200 OK · application/json" />
	</div>
</Section>

<Section eyebrow="Products" title="Three APIs on one engine">
	<Cards
		items={[
			{ title: 'Preview API', text: 'Iframely API and oEmbed API: metadata, players, cards and hosted iframes for any URL.', href: '/docs/reference', cta: 'Preview API docs' },
			{ title: 'Data API', text: 'Readable content for automated processing, with five processing modes and the <code>access</code> object.', href: '/docs/data-api', cta: 'Data API docs' },
			{ title: 'embed.js', text: 'Drop-in script that turns links into embeds, with lazy-load, click-to-play and consent.', href: '/docs/reference', cta: 'embed.js docs' }
		]}
	/>
</Section>

<Section tone="muted" eyebrow="Integrations" title="Already in your stack">
	<div class="flex flex-wrap gap-2">
		{#each ['WordPress', 'Tiptap', 'Lexical', 'Editor.js', 'CKEditor 5', 'TinyMCE', 'React', 'Next.js', 'Vue', 'React Native', 'MCP server', 'Ghost / Webflow snippet'] as i (i)}
			<a href="/integrations" class="rounded-md bg-white px-3 py-2 text-sm ring-1 ring-ink-200 hover:ring-brand-400">{i}</a>
		{/each}
	</div>
	<p class="mt-3 text-sm text-ink-500">Integrations still in development say "coming" rather than linking to old packages.</p>
</Section>

<Section id="guides" eyebrow="New structure" title="How the docs are organised">
	<div class="grid gap-8 md:grid-cols-[16rem_1fr]">
		<div class="rounded-xl border border-ink-100 p-4"><DocsSidebar /></div>
		<div class="space-y-4 text-ink-700">
			<p>Seven sections replace the three. Guides are task-based recipes with working code, configuration, error handling and a test.</p>
			<p>Retired with redirects: Instant Articles, AMP, CKEditor 4, Medium Insert, Meteor.</p>
			<h2 class="pt-4 text-xl text-ink-950 font-display tracking-[-0.02em]">How Iframely works</h2>
			<p>
				You send a URL. Iframely fetches it once, as a named and signed agent, reads oEmbed, Open Graph, Twitter Cards,
				structured data and its own parsers for 1,900 providers, and returns one unified JSON. Results are cached for
				you; repeat requests within an hour are one hit.
			</p>
		</div>
	</div>
</Section>
