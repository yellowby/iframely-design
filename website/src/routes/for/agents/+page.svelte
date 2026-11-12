<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Code from '#lib/components/Code.svelte';
	import Table from '#lib/components/Table.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { dataApiNode } from '#lib/data/samples.ts';

	const surfaces: { name: string; text: string; href: string; live: boolean }[] = [
		{ name: 'MCP server', text: 'Hosted at mcp.iframely.com and as @iframely/mcp on npm.', href: '/mcp', live: true },
		{ name: 'Keyless trial', text: 'Unfurl and embed without an account, within a daily limit.', href: '/mcp#install', live: true },
		{ name: 'llms.txt', text: 'An index of every docs page; llms-full.txt in one file.', href: '#llms', live: true },
		{ name: 'Markdown docs', text: 'Append .md to any docs URL.', href: '/docs', live: true },
		{ name: 'OpenAPI', text: 'One spec for the Preview API and the Data API.', href: '#openapi', live: false },
		{ name: 'SDKs', text: 'TypeScript and Python, generated from the spec.', href: '/integrations#sdks', live: false },
		{ name: 'SKILL.md', text: 'Product choice, endpoints, keys, caching and the access rule for coding agents.', href: '#skill', live: false },
		{ name: 'agents.md', text: 'The setup guide written for agents and the developers who build them.', href: '#agents-md', live: false },
		{ name: 'pricing.md', text: 'Every price on one Markdown page, kept in step with /pricing.', href: '#pricing-md', live: false },
		{ name: 'Agent self-registration', text: 'An agent creates a free account for its user, with a hard spending cap.', href: '/mcp#acting', live: false },
		{ name: 'Agent payments', text: 'Pay per read, about $0.01, without an account, via MPP or x402.', href: '/pricing#data-api', live: false }
	];
</script>

<PageMeta
	title="Iframely for AI agents and RAG: read URLs you are allowed to use | Iframely"
	description="Ground assistants on URLs with the publisher's permissions attached. MCP server, keyless trial, llms.txt, OpenAPI, SDKs and SKILL.md in one place."
/>

<Hero
	eyebrow="AI agents and RAG"
	title="Ground your assistant on pages it is allowed to use"
	sub="Your users paste links and ask questions. Iframely reads each URL once as a verified agent, returns Markdown where the publisher allows it and an excerpt where not, and tells your code which is which."
>
	<Button href="/mcp">Install the MCP server</Button>
	<Button href="/data-api" variant="secondary">The Data API</Button>
	{#snippet aside()}
		<Code code={dataApiNode} label="Node · assist mode" />
	{/snippet}
</Hero>

<Section eyebrow="Why it matters now" title="Your fetcher is being blocked. A verified one is not.">
	<Cards
		cols={3}
		items={[
			{
				title: 'Bot walls are the default',
				text: 'CDNs now block unverified AI fetchers by default. Iframely signs every request with Web Bot Auth and is allow-listed by name in publishers\' robots.txt.'
			},
			{
				title: 'Regulators ask what you read',
				text: 'The EU AI Act, the UK CMA and EU courts all ask how content was obtained. The access object is a per-read answer.'
			},
			{
				title: 'Users want sources',
				text: 'A cited answer needs a title, site, author, date and link. Metadata is always allowed, so every claim can carry a source line.'
			}
		]}
	/>
</Section>

<Section tone="muted" eyebrow="Agent-ready" title="Everything an agent needs, in one place">
	<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
		{#each surfaces as s (s.name)}
			<a href={s.href} class="rounded-xl border border-ink-100 bg-white p-4 hover:border-brand-300">
				<div class="flex items-center justify-between gap-2">
					<h3 class="font-semibold">{s.name}</h3>
					{#if s.live}<Badge tone="good">Live</Badge>{:else}<Badge tone="warn">Coming</Badge>{/if}
				</div>
				<p class="mt-2 text-sm text-ink-600">{s.text}</p>
			</a>
		{/each}
	</div>
</Section>

<Section eyebrow="Patterns" title="Which mode for which job">
	<Table
		head={['You are building', 'Mode', 'What you usually get']}
		rows={[
			['A chat assistant answering about a pasted link', '<code>assist</code>', 'Excerpt and entities; full text where allowed'],
			['RAG over URLs fetched during a live request', '<code>ai-input</code>', 'Excerpt; full text where Content Signals or a licence allow AI input'],
			['A search index with snippets that link back', '<code>search</code>', 'Metadata, excerpt within <code>max-snippet</code>'],
			['A feed that shows links users submit', '<code>discover</code>', 'Metadata and excerpt'],
			['A training dataset', '<code>ai-train</code>', 'Metadata and links; more only where publishers opt in']
		]}
	/>
	<div class="mt-6 flex flex-wrap gap-3">
		<Button href="/docs/data-api" variant="secondary">Data API docs</Button>
		<Button href="/docs/guides" variant="secondary">Guide: ground an assistant on URLs</Button>
	</div>
</Section>

<Section tone="muted" eyebrow="Also for agents" title="Links your agent can show">
	<p class="max-w-3xl text-ink-700">
		Assistants render sources as bare links. <code>iframely_unfurl</code> gives a title, site, favicon and thumbnail
		for a citation card; <code>iframely_get_embed</code> gives a playable video or a post card when the user asks to
		see it. Both work without a key.
	</p>
</Section>

<Section narrow eyebrow="FAQ" title="Questions">
	<Faq
		items={[
			{
				q: 'Is this cheaper than Firecrawl or Exa?',
				a: 'Not at 25,000 to 250,000 reads. It costs a little more because each read carries the publisher\'s decision and comes from a verified agent. See <a href="/compare">the comparisons</a>.'
			},
			{
				q: 'Can an agent sign up by itself?',
				a: 'Coming: an agent can create a free account after its user signs in and accepts the terms, with scoped keys and a hard spending cap.'
			},
			{
				q: 'What does "allowed" let me do?',
				a: 'Use that content type for the mode you declared. It is not a licence. See <a href="/data-api#access">the access object</a>.'
			}
		]}
	/>
</Section>

<Cta title="Start with the MCP server" text="Previews and embeds without a key; the Data API with a free one.">
	<Button href="/mcp">Install</Button>
	<Button href="#signup" variant="invert">Get an API key</Button>
</Cta>
