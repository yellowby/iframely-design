<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Code from '#lib/components/Code.svelte';
	import Tabs from '#lib/components/Tabs.svelte';
	import Table from '#lib/components/Table.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { mcpInstall } from '#lib/data/samples.ts';

	const tools = [
		{
			name: 'iframely_unfurl',
			title: 'Unfurl URL',
			keyless: true,
			text: 'Preview metadata for one URL: title, description, site, author, date, thumbnail, icon, media types, and product or stats fields when the page has them.'
		},
		{
			name: 'iframely_get_embed',
			title: 'Get embed code',
			keyless: true,
			text: 'Responsive embed HTML for one URL, with typed options: theme, click-to-play, consent, lazy load, max width. Falls back to a summary card when there is no player.'
		},
		{
			name: 'iframely_read',
			title: 'Read URL content',
			keyless: false,
			text: 'The Data API. Declare a mode and use; get the excerpt, entities and Markdown full text the publisher allows, with a one-line access summary.'
		},
		{
			name: 'iframely_unfurl_batch',
			title: 'Unfurl several URLs',
			keyless: false,
			text: 'Up to 25 URLs per call, concise output, per-URL errors that do not fail the batch.'
		}
	];

	const signature = `**Oembed – Wikipedia**  ·  en.wikipedia.org  ·  CC BY-SA 4.0

oEmbed is a format for allowing an embedded representation of a URL on third-party sites…

Publisher allows: meta, links, entities, excerpt, fulltext. Promoted by: license.`;
</script>

<PageMeta
	title="Iframely MCP server: link previews, embeds and readable URLs in Claude, ChatGPT, Cursor | Iframely"
	description="Add Iframely to any MCP client. Unfurl links, get embed code and read URL content with the publisher's permissions. Keyless tier for previews and embeds."
/>

<Hero
	eyebrow="MCP server"
	title="Give your agent links it can show and pages it may read"
	sub="The Iframely MCP server adds four tools to Claude, ChatGPT, Cursor, VS Code and any MCP client: unfurl a link, get embed code, read a page under a declared purpose, unfurl a batch. Previews and embeds work without a key."
>
	<Button href="#install">Install</Button>
	<Button href="#tools" variant="secondary">See the tools</Button>
	{#snippet aside()}
		<Tabs
			tabs={[
				{ label: 'Claude Code', code: mcpInstall.claudeCode },
				{ label: 'Local (npx)', code: mcpInstall.local },
				{ label: 'VS Code', code: mcpInstall.vscode }
			]}
		/>
	{/snippet}
</Hero>

<Section id="tools" eyebrow="Tools" title="Four read-only tools with typed inputs">
	<div class="grid gap-4 md:grid-cols-2">
		{#each tools as t (t.name)}
			<div class="rounded-xl border border-ink-100 p-5">
				<div class="flex flex-wrap items-center justify-between gap-2">
					<code class="text-sm">{t.name}</code>
					{#if t.keyless}<Badge tone="good">No key needed</Badge>{:else}<Badge tone="brand">Free key</Badge>{/if}
				</div>
				<h3 class="mt-3 font-semibold">{t.title}</h3>
				<p class="mt-2 text-[15px] text-ink-600">{t.text}</p>
			</div>
		{/each}
	</div>
	<p class="mt-6 text-ink-600">
		Every tool is marked read-only and idempotent. Results come as structured content and a short Markdown summary sized
		to stay well under 3,000 tokens; ask for <code>response_format: "full"</code> when you want the raw JSON.
	</p>
</Section>

<Section tone="muted" eyebrow="The signature line" title="Your agent, and the person reading the transcript, see why">
	<div class="grid gap-8 lg:grid-cols-2 lg:items-center">
		<Code code={signature} label="iframely_read · text block" />
		<div class="space-y-4 text-ink-700">
			<p>
				Every <code>iframely_read</code> result ends with one line: what the publisher allows, and what promoted or
				blocked the rest. When full text is withheld, the agent knows to quote the excerpt and link instead.
			</p>
			<p>
				Errors say what to do next: "robots.txt disallows this path for automated processing; try
				<code>iframely_unfurl</code> for preview metadata."
			</p>
			<Button href="/data-api#access" variant="quiet">About the access object →</Button>
		</div>
	</div>
</Section>

<Section id="install" eyebrow="Install" title="Remote or local, one line each">
	<div class="grid gap-6 lg:grid-cols-2">
		<div>
			<h3 class="mb-2 font-semibold">Hosted server</h3>
			<p class="mb-3 text-ink-600">
				<code>https://mcp.iframely.com/mcp</code>, streamable HTTP. Pass your key as a bearer header, or connect without
				one for previews and embeds.
			</p>
			<Code code={mcpInstall.claudeCode} label="Claude Code" />
		</div>
		<div>
			<h3 class="mb-2 font-semibold">npm package</h3>
			<p class="mb-3 text-ink-600">
				<code>@iframely/mcp</code> over stdio. Works with a self-hosted open-source Iframely for previews; the Data API is
				cloud only.
			</p>
			<Code code={mcpInstall.desktop} label="Claude Desktop · Cursor · Windsurf · JetBrains" />
		</div>
	</div>
	<p class="mt-6 text-sm text-ink-500">
		Coming to the official MCP registry, the Claude directory, the Cursor marketplace, Smithery and Glama.
	</p>
</Section>

<Section tone="muted" eyebrow="Keys and limits" title="Try it without an account">
	<Table
		head={['Access', 'Tools', 'Limits', 'Status']}
		rows={[
			['No key', '<code>iframely_unfurl</code>, <code>iframely_get_embed</code>', 'A daily allowance per client, a few calls a minute', '<b>Live</b>'],
			['Free key', 'All four, including the Data API', '2,000 hits and 1,000 reads a month', '<b>Live</b>'],
			['Sign in with OAuth', 'All four; no key in config files', 'Your plan', 'Coming']
		]}
	/>
	<p class="mt-4 text-ink-600">
		Every call is tagged with the client's name, so your dashboard shows MCP traffic by client and publishers see an
		<code>mcp</code> suffix in the user agent.
	</p>
</Section>

<Section id="acting" eyebrow="Acting on your behalf" title="What an agent may do in your account">
	<Table
		head={['Action', 'Who acts']}
		rows={[
			['Check whether a URL or feature is supported', 'The agent, no account'],
			['Read usage and estimate the cost of a feature', 'The agent, read-only'],
			['Create a free account, a project, scoped keys', 'The agent helps; you sign in and accept the terms'],
			['Upgrade, add a card, raise a spending cap', 'You, on a hosted page; the agent never sees card data'],
			['Rotate or revoke keys', 'The agent asks first and warns that production may break']
		]}
	/>
	<p class="mt-4 text-sm text-ink-500">
		Keys created by an agent are delivered to your environment, never echoed into chat, code or logs.
	</p>
</Section>

<Section tone="muted" narrow eyebrow="FAQ" title="Questions">
	<Faq
		items={[
			{
				q: 'Do I need an API key?',
				a: 'Not for unfurl and embed within the daily allowance. The Data API and batch tool need a free key.'
			},
			{
				q: 'Why do previews work without a key but reading does not?',
				a: 'A preview is metadata a person asked to see. Reading content is automated processing under the <a href="#automated-processing">Automated Processing Terms</a>, which needs an account that declares its purpose.'
			},
			{
				q: 'Does the MCP server cost more than the API?',
				a: 'No. Calls are billed exactly as the same API calls. See <a href="/pricing">pricing</a>.'
			},
			{
				q: 'Is there a CLI or skill file instead?',
				a: 'A SKILL.md for coding agents, OpenAPI and SDKs are on the <a href="/for/agents">agents page</a>; a CLI is coming, since MCP tool calls cost more tokens than a command line.'
			}
		]}
	/>
</Section>

<Cta title="Add Iframely to your agent" text="One line in Claude Code. No key needed to try previews and embeds.">
	<Button href="#install">Install</Button>
	<Button href="/for/agents" variant="invert">Everything for agents</Button>
</Cta>
