<script lang="ts">
	import Tabs from '#lib/components/Tabs.svelte';
	import Code from '#lib/components/Code.svelte';
	import Table from '#lib/components/Table.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import DocsSidebar from '#lib/components/DocsSidebar.svelte';
	import { accessSample, blockedSample, dataApiCurl, dataApiNode, dataApiPython } from '#lib/data/samples.ts';

	let helpful = $state<null | boolean>(null);

	const toc = [
		['Quickstart', 'quickstart'],
		['Processing modes', 'modes'],
		['The access object', 'access'],
		['The three agents', 'agents'],
		['Compliance', 'compliance']
	];
</script>

<PageMeta
	title="Data API quickstart: read any URL with the publisher's permissions | Iframely docs"
	description="Send a URL and a processing mode, get Markdown, entities and an excerpt, with the access object explaining what the publisher allows."
/>

<div class="wrap grid gap-10 py-10 lg:grid-cols-[15rem_1fr_11rem]">
	<aside class="hidden lg:block"><div class="sticky top-24"><DocsSidebar current="Overview and quickstart" /></div></aside>

	<article class="min-w-0">
		<nav class="text-sm text-ink-500"><a href="/docs" class="hover:text-ink-900">Docs</a> / <a href="/docs/data-api" class="hover:text-ink-900">Data API</a> / Quickstart</nav>
		<div class="mt-3 flex flex-wrap items-start justify-between gap-3">
			<h1 class="t-hero">Data API quickstart</h1>
			<a href="#md" class="rounded-md px-3 py-1.5 text-sm ring-1 ring-ink-200 hover:ring-ink-400">View as Markdown</a>
		</div>
		<p class="mt-1 text-sm text-ink-500">Last updated 2026-10-15</p>
		<p class="mt-4 text-lg text-ink-700">
			Read a URL for a declared purpose. You get metadata, links, entities, an excerpt and Markdown full text where the
			publisher allows it, and an <code>access</code> object that says why.
		</p>

		<h2 id="quickstart" class="mt-10 scroll-mt-24 text-2xl font-display tracking-[-0.02em]">1. Send one request</h2>
		<p class="mt-2 text-ink-700"><code>url</code>, <code>mode</code> and <code>api_key</code> are required. <code>use</code> is optional and tells the publisher how you will use the content.</p>
		<div class="mt-4">
			<Tabs tabs={[{ label: 'curl', code: dataApiCurl }, { label: 'Node', code: dataApiNode }, { label: 'Python', code: dataApiPython }]} />
		</div>
		<a href="#sandbox" class="mt-3 inline-block text-sm font-medium text-brand-700">Open in sandbox with this URL →</a>

		<h2 id="modes" class="mt-10 scroll-mt-24 text-2xl font-display tracking-[-0.02em]">2. Pick the right mode</h2>
		<div class="mt-4">
			<Table
				head={['Mode', 'Who triggers it', 'Example']}
				rows={[
					['<code>assist</code>', 'A person, for themselves', 'Summarise this link for me'],
					['<code>discover</code>', 'A person, for others', 'A shared link enters a feed or recommendations'],
					['<code>search</code>', 'A system, for later queries', 'Indexing for an enterprise search'],
					['<code>ai-input</code>', 'A live request to a model', 'RAG grounding; not retained, not trained on'],
					['<code>ai-train</code>', 'A system, over time', 'Model training; publisher opt-in only']
				]}
			/>
		</div>
		<p class="mt-3 text-sm text-ink-600"><code>use</code>: <code>immediate</code>, <code>reference</code> (quote and link) or <code>full</code>. Misstating the mode breaks the <a href="#automated-processing" class="text-brand-700">Automated Processing Terms</a>.</p>

		<h2 id="access" class="mt-10 scroll-mt-24 text-2xl font-display tracking-[-0.02em]">3. Read the access object</h2>
		<p class="mt-2 text-ink-700">
			<code>requested</code> repeats your mode. <code>signals</code> lists what we found on the site. <code>decision</code> gives
			each content type an <code>allowed</code> value and the signals that supported, promoted or blocked it.
		</p>
		<div class="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
			<Code code={accessSample} label="Allowed: a CC BY-SA licence promotes full text" />
			<Code code={blockedSample} label="Blocked by the publisher's settings" />
		</div>
		<div class="mt-4 rounded-lg border-l-4 border-brand-500 bg-brand-50 p-4 text-sm text-ink-800">
			<b><code>allowed: true</code> does not mean any use is fine.</b> It means the content may be returned for the mode and
			use you declared. Your own obligations, and the licence, still apply.
		</div>

		<h2 id="agents" class="mt-10 scroll-mt-24 text-2xl font-display tracking-[-0.02em]">4. Who fetches</h2>
		<p class="mt-2 text-ink-700">
			Data API requests are fetched by the Processing Agent (or the Training Agent for <code>ai-train</code>), which obeys
			robots.txt, signs every request with Web Bot Auth and carries your account's name.
			<a href="/publishers#agents" class="text-brand-700">The three agents →</a>
		</p>

		<h2 id="compliance" class="mt-10 scroll-mt-24 text-2xl font-display tracking-[-0.02em]">5. Compliance</h2>
		<p class="mt-2 text-ink-700">
			Signals we honour: robots.txt (RFC 9309), meta robots and <code>X-Robots-Tag</code>, Content Signals, RSL and
			Creative Commons licences, llms.txt and publisher Markdown. Keep the <code>access</code> object in your logs; it is
			your record of what you were allowed to use.
		</p>

		<div class="mt-12 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6 text-sm">
			{#if helpful === null}
				<span class="text-ink-600">Was this page helpful?</span>
				<button type="button" onclick={() => (helpful = true)} class="rounded-md px-3 py-1 ring-1 ring-ink-200">Yes</button>
				<button type="button" onclick={() => (helpful = false)} class="rounded-md px-3 py-1 ring-1 ring-ink-200">No</button>
			{:else}
				<span class="text-ink-600">Thanks. {helpful ? '' : 'Tell us what was missing in the help center form.'}</span>
			{/if}
		</div>

		<div class="mt-8">
			<p class="text-sm font-semibold">Related</p>
			<ul class="mt-2 grid gap-2 text-sm sm:grid-cols-2">
				<li><a href="/pricing#data-api" class="text-brand-700">Data API pricing</a></li>
				<li><a href="/mcp" class="text-brand-700"><code>iframely_read</code> in the MCP server</a></li>
				<li><a href="/docs#guides" class="text-brand-700">Guide: ground an assistant on URLs</a></li>
				<li><a href="/verification" class="text-brand-700">Verify our agents</a></li>
			</ul>
		</div>
		<div class="mt-8 flex justify-between text-sm">
			<a href="/docs" class="text-ink-600">← Get started</a>
			<a href="#modes" class="text-ink-600">Processing modes →</a>
		</div>
	</article>

	<aside class="hidden text-sm lg:block">
		<div class="sticky top-24">
			<p class="mb-2 text-xs font-semibold tracking-wide text-ink-400 uppercase">On this page</p>
			{#each toc as [label, id] (id)}<a href="#{id}" class="block py-1 text-ink-600 hover:text-ink-950">{label}</a>{/each}
		</div>
	</aside>
</div>
