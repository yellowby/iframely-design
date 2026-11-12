<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Code from '#lib/components/Code.svelte';
	import Tabs from '#lib/components/Tabs.svelte';
	import Table from '#lib/components/Table.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PricingBlock from '#lib/components/PricingBlock.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import {
		accessSample,
		blockedSample,
		dataApiCurl,
		dataApiNode,
		dataApiPython,
		mcpInstall
	} from '#lib/data/samples.ts';
</script>

<PageMeta
	title="Data API: readable content for any URL, with the publisher's permissions | Iframely"
	description="Metadata, entities, excerpts and Markdown full text for any URL, read for a declared purpose by a signed agent, with how the publisher's signals and settings were applied returned on every result."
/>

<Hero
	eyebrow="Data API"
	title="The web reader that can show its permissions"
	sub="Tell us why you are reading a URL. We read it once, as a signed and named agent, and return what the publisher allows for that purpose: metadata, links, entities, an excerpt, Markdown full text. With every result comes the <code>access</code> object, the record of why."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="secondary">Try a link</Button>
	{#snippet after()}
	{/snippet}
</Hero>

<Section
	id="modes"
	eyebrow="Declared purpose"
	title="Five processing modes, one per reason you read"
	intro="Every request carries a mode. Publishers set what each mode may receive; you get the content that matches. The optional <code>use</code> value says how you will use it."
>
	<Table
		head={['Mode', 'Who triggers it and who sees the result', 'Example', 'Agent']}
		rows={[
			['<code>assist</code>', 'Human → same human', 'A user asks your assistant to summarise a page they pasted', 'Processing Agent'],
			['<code>discover</code>', 'Human → other humans', 'A user shares a link that your platform shows in other people\'s feeds', 'Processing Agent'],
			['<code>search</code>', 'Machine → human', 'Your system indexes a page for later search results that link back', 'Processing Agent'],
			['<code>ai-input</code>', 'Human → machine', 'A live request grounds a model on a URL (RAG); nothing retained, nothing trained', 'Processing Agent'],
			['<code>ai-train</code>', 'Machine → machine', 'Building or improving a model; only where the publisher opts in', 'Training Agent']
		]}
	/>
	<div class="mt-6">
		<Table
			head={['use', 'Meaning']}
			rows={[
				['<code>immediate</code>', 'Shown or used once, in the moment, then discarded'],
				['<code>reference</code>', 'Quoted or summarised with a link back to the source'],
				['<code>full</code>', 'The full content is used or shown']
			]}
		/>
	</div>
	<p class="mt-4 text-sm text-ink-500">
		Previews are not a Data API mode: link previews use the Preview Agent and the <a
			class="text-brand-700 underline"
			href="/embeds">Preview API</a
		>. Misrepresenting a mode breaks the <a class="text-brand-700 underline" href="#automated-processing"
			>Automated Processing Terms</a
		>.
	</p>
</Section>

<Section
	tone="muted"
	id="access"
	eyebrow="The access object"
	title="Every result says what was allowed, and what decided it"
	intro="<code>requested</code> repeats your mode and use. <code>signals</code> lists what we found: robots.txt, page directives, Content Signals, llms.txt, publisher Markdown, licences such as RSL and Creative Commons. <code>decision</code> gives each content type a verdict and the signals that supported, promoted or blocked it."
>
	<div class="grid gap-6 lg:grid-cols-2">
		<div>
			<h3 class="mb-2 font-semibold">Allowed: a Creative Commons licence promotes full text</h3>
			<Code code={accessSample} label="assist · reference" />
		</div>
		<div>
			<h3 class="mb-2 font-semibold">Blocked: the publisher said no in the Console</h3>
			<Code code={blockedSample} label="fulltext decision" />
			<p class="mt-4 text-ink-600">
				One block always wins. A licence and publisher Markdown would have promoted full text; the publisher's explicit
				setting in the Publisher Console blocked it. You still get metadata and links, and you know exactly why the rest
				is missing.
			</p>
			<p class="mt-3 text-ink-600">
				Store the object next to the content. It is your audit trail when someone asks where a quote came from and
				whether you were allowed to use it.
			</p>
		</div>
	</div>
</Section>

<Section eyebrow="What you get" title="Structured, not scraped">
	<Cards
		cols={3}
		items={[
			{ title: 'meta', text: 'Title, description, author, site, date, canonical URL, language, thumbnail, licence.' },
			{ title: 'links', text: 'Thumbnails, icons, players and the media types Iframely knows for 1,900 providers.' },
			{ title: 'entities', text: 'schema.org entities from the page: articles, products, events, people, organisations, with <code>articleBody</code> where present.' },
			{ title: 'excerpt', text: 'A snippet, the heading outline, and hyperlinks with their <code>rel</code> values.' },
			{ title: 'fulltext', text: 'The article as clean Markdown, or the publisher\'s own Markdown when they serve it.' },
			{ title: 'access', text: 'The decision for each of the above, with the signals behind it.' }
		]}
	/>
	<p class="mt-6 text-ink-600">
		The Data API has a fixed shape. It is not a programmable scraper: no selectors, no browser scripts, no pagination
		through a site.
	</p>
</Section>

<Section tone="muted" eyebrow="Who it is for" title="Teams that have to answer for what their product reads">
	<Cards
		cols={2}
		items={[
			{
				tag: 'Grounding and RAG',
				title: 'An assistant that cites its sources',
				text: 'A user pastes three links and asks for a comparison. You read them in <code>ai-input</code>, get Markdown where allowed and excerpts where not, and show the source line under each claim.',
				href: '/for/agents',
				cta: 'AI agents and RAG'
			},
			{
				tag: 'User-requested fetch',
				title: 'When your own fetcher is blocked',
				text: 'Your assistant\'s fetcher meets bot walls. Iframely is a verified, publisher-allow-listed agent that reads the one URL the user asked about, under <code>assist</code>.',
				href: '/verification',
				cta: 'How we are verified'
			},
			{
				tag: 'Search and enrichment',
				title: 'An index that links back',
				text: 'Index pages under <code>search</code>, keep the excerpt and entities, and respect the publisher\'s snippet limits without writing a robots parser.',
				href: '/docs/data-api'
			},
			{
				tag: 'Compliance and legal',
				title: 'An answer for the review',
				text: 'Each read carries a declared purpose and a decision. The compliance report summarises reads by mode, what was blocked and by what.',
				href: '#trust',
				cta: 'Trust center'
			}
		]}
	/>
</Section>

<Section id="how-it-fetches" eyebrow="How it fetches" title="One URL, one signed request, a named customer">
	<Table
		head={['Agent', 'When', 'Reads', 'robots.txt']}
		rows={[
			[
				'Preview Agent',
				'A person shares a link in a customer\'s app',
				'Metadata only, never the page body',
				'Not consulted: a human asked for this one URL'
			],
			[
				'Processing Agent',
				'A Data API request in <code>assist</code>, <code>discover</code>, <code>search</code> or <code>ai-input</code>',
				'Metadata, links, entities, excerpt; full text only where allowed',
				'Obeyed per RFC 9309'
			],
			[
				'Training Agent',
				'A Data API request in <code>ai-train</code>',
				'Metadata and links; more only with explicit publisher permission',
				'Obeyed; silence is never permission'
			]
		]}
	/>
	<ul class="mt-6 grid gap-3 text-ink-700 md:grid-cols-2">
		<li>Every request signed with Web Bot Auth; keys in a public directory.</li>
		<li>The customer's identity and the declared mode travel with the request, so publishers know who is asking.</li>
		<li>No proxies, no residential IPs, no fingerprint rotation. Published IP ranges and reverse DNS.</li>
		<li>One URL per request. We do not crawl, follow links or map sites.</li>
	</ul>
	<div class="mt-6 flex flex-wrap gap-3">
		<Button href="/verification" variant="secondary">Verify our agents</Button>
		<Button href="/publishers" variant="secondary">What publishers control</Button>
	</div>
</Section>

<Section tone="muted" id="compare" eyebrow="Compared" title="Readers compete on price. This one also shows its permissions.">
	<Table
		head={['', 'Iframely Data API', 'Firecrawl', 'Jina Reader', 'Exa contents', 'Tavily extract']}
		rows={[
			['Price per 1,000 pages', '$1.00, $0.80 above 100K, $0.60 above 500K', '$0.83 (Standard, annual); $0.60 at Scale', 'Tokens; about $0.50 for a 10K-token page', '$1.00 per content type', 'About $1.50 at the Project plan'],
			['Free', '1,000 reads a month', '1,000 credits a month', '10M tokens once, non-commercial', '$10 credit a month', '1,000 credits a month'],
			['Declared purpose', 'Required', 'No', 'No', 'No', 'No'],
			['Publisher decision in the response', 'Yes', 'No', 'No', 'No', 'No'],
			['Signed requests', 'Web Bot Auth', 'Not documented', 'Not documented', 'Yes', 'Not documented'],
			['Crawls sites', 'No, by design', 'Yes', 'No', 'No', 'Yes']
		]}
		caption="Competitor prices from their pricing pages, read August to October 2026. Check before quoting."
	/>
	<p class="mt-4 text-ink-600">
		If price per page at 50,000 reads is all that matters, Exa and Firecrawl are cheaper. Choose Iframely when someone
		will ask what you were allowed to read, or when the same product also needs previews and embeds.
	</p>
	<div class="mt-4"><Button href="/compare" variant="quiet">Full comparisons →</Button></div>
</Section>

<Section id="pricing" eyebrow="Pricing" title="Per read, falling with volume">
	<div class="grid gap-4 md:grid-cols-4">
		{#each [
			['Free', '1,000 reads a month', 'No card'],
			['$1.00', 'per 1,000 reads to 100,000', 'Metered monthly'],
			['$0.80', 'per 1,000 to 500,000', ''],
			['$0.60', 'per 1,000 above 500,000', 'Annual commits available']
		] as [price, unit, small] (unit)}
			<div class="rounded-xl border border-ink-100 p-5">
				<p class="text-2xl font-semibold">{price}</p>
				<p class="mt-1 text-ink-600">{unit}</p>
				{#if small}<p class="mt-1 text-xs text-ink-400">{small}</p>{/if}
			</div>
		{/each}
	</div>
	<p class="mt-5 text-ink-600">
		Metadata-only unfurls cost half. Prepaid packs for agencies. Agents without an account can pay per read, about $0.01
		(coming). Enterprise adds the compliance report, an SLA and an EU endpoint.
	</p>
	<div class="mt-4"><Button href="/pricing#data-api" variant="secondary">Pricing and calculator</Button></div>
</Section>

<Section tone="muted" id="quick-start" eyebrow="Quick start" title="Your first read in one request">
	<div class="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
		<Tabs
			tabs={[
				{ label: 'curl', code: dataApiCurl },
				{ label: 'Node', code: dataApiNode },
				{ label: 'Python', code: dataApiPython },
				{ label: 'MCP (Claude Code)', code: mcpInstall.claudeCode }
			]}
		/>
		<ol class="list-decimal space-y-3 pl-5 text-ink-700">
			<li><a class="text-brand-700 underline" href="#signup">Create a free key</a>; it includes 1,000 reads a month.</li>
			<li>Pick the mode that matches why you read. Default it in settings or send <code>mode=</code> per request.</li>
			<li>Read <code>access.decision</code> before you use each part of the result.</li>
			<li>
				Prefer an agent? The <a class="text-brand-700 underline" href="/mcp">MCP server</a> exposes the same read as
				<code>iframely_read</code>. OpenAPI and SDKs are on the <a class="text-brand-700 underline" href="/for/agents"
					>agents page</a
				>.
			</li>
		</ol>
	</div>
</Section>

<Section narrow eyebrow="FAQ" title="Questions buyers ask">
	<Faq
		items={[
			{
				q: 'Does "allowed: true" mean I can use the content for anything?',
				a: 'No. It means the publisher\'s signals and settings permit that content type for the mode and use you declared. A different purpose needs a different request, and your own legal obligations still apply. Iframely is a technical intermediary and grants no rights.'
			},
			{
				q: 'Why does the Preview Agent not read robots.txt?',
				a: 'Because a person shared that one link and expects to see a preview, the same way a browser fetches a page you click. It reads metadata only, never the body. Every automated read goes through the Processing Agent, which obeys robots.txt.'
			},
			{
				q: 'What about training?',
				a: 'Training uses the Training Agent and the <code>ai-train</code> mode. Beyond metadata and links it needs the publisher\'s explicit permission; the absence of a restriction is never treated as consent.'
			},
			{
				q: 'What happens when content is blocked?',
				a: 'You still receive what is allowed, usually metadata and links, plus the decision that names what blocked the rest.'
			},
			{
				q: 'Can you crawl my list of sites?',
				a: 'No. The Data API reads one URL per request, the URLs you send. It does not follow links or map sites.'
			},
			{
				q: 'Do you keep the content?',
				a: 'Results are cached briefly to serve repeat requests; the access decision can change, so cache hints are shorter than for previews. Content read in <code>ai-input</code> must not be retained by you either.'
			},
			{
				q: 'Is there an EU endpoint?',
				a: 'On Enterprise, with a residency statement and a data-processing agreement.'
			}
		]}
	/>
</Section>

<PricingBlock />

<Cta title="Read your first URL" text="1,000 reads a month free. The access object comes with every one.">
	<Button href="#signup">Get an API key</Button>
	<Button href="/mcp" variant="invert">Install the MCP server</Button>
</Cta>
