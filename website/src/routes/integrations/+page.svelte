<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Code from '#lib/components/Code.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';

	type Item = { name: string; text: string; status: 'available' | 'coming' | 'guide'; href: string };
	const groups: { id: string; title: string; intro: string; items: Item[] }[] = [
		{
			id: 'editors',
			title: 'Editors',
			intro: 'Paste a URL in the editor, get an embed block with per-block options.',
			items: [
				{ name: 'Tiptap', text: 'ProseMirror node with paste rule, options and a hosted preview. Also BlockNote and Milkdown.', status: 'coming', href: '/docs/integrations/tiptap' },
				{ name: 'Lexical', text: 'Embed node and config for Lexical, the engine behind Payload.', status: 'coming', href: '/docs/integrations/lexical' },
				{ name: 'Editor.js', text: 'A server endpoint for the Link Tool and an embed tool.', status: 'coming', href: '/docs/integrations/editorjs' },
				{ name: 'CKEditor 5', text: 'MediaEmbed provider config; CKEditor\'s own docs point here.', status: 'guide', href: '/docs/ckeditor' },
				{ name: 'TinyMCE', text: 'Media plugin resolver backed by Iframely.', status: 'coming', href: '/docs/integrations/tinymce' }
			]
		},
		{
			id: 'cms',
			title: 'CMSs',
			intro: 'Server-side plugins that keep your key private and cache results.',
			items: [
				{ name: 'WordPress', text: 'Gutenberg block, 1,900 providers, options, consent. 2,000+ installs.', status: 'available', href: '/wordpress' },
				{ name: 'Payload', text: 'Lexical field with Iframely embeds.', status: 'coming', href: '/docs/integrations/payload' },
				{ name: 'Drupal', text: 'oEmbed provider for Drupal media.', status: 'coming', href: '/docs/integrations/drupal' },
				{ name: 'Statamic', text: 'Community addon; adoption planned.', status: 'available', href: '/docs/integrations/statamic' },
				{ name: 'Strapi', text: 'Custom field plugin.', status: 'coming', href: '/docs/integrations/strapi' },
				{ name: 'Craft', text: 'Through Embedded Assets.', status: 'coming', href: '/docs/integrations/craft' }
			]
		},
		{
			id: 'frameworks',
			title: 'Frameworks',
			intro: 'Render embeds in your own components.',
			items: [
				{ name: 'React', text: 'Making X, Instagram and Facebook embeds work in React.', status: 'guide', href: '/docs/react' },
				{ name: 'React Native', text: 'WebView setup for YouTube, X and others, including error 153.', status: 'guide', href: '/docs/react-native' },
				{ name: 'Angular', text: 'Embeds in Angular templates.', status: 'guide', href: '/docs/angular' },
				{ name: 'Shadow DOM', text: 'Tweaks for third-party media inside shadow roots.', status: 'guide', href: '/docs/shadow-dom' },
				{ name: 'embed.js', text: '@iframely/embed.js on npm: height, lazy load, theme, click-to-play.', status: 'available', href: '/docs/embedjs' }
			]
		},
		{
			id: 'sdks',
			title: 'Agents, MCP and SDKs',
			intro: 'For agents and server code.',
			items: [
				{ name: 'MCP server', text: 'Hosted and npm, four tools, keyless previews.', status: 'available', href: '/mcp' },
				{ name: 'TypeScript SDK', text: 'Typed client for the Preview API and Data API.', status: 'coming', href: '/for/agents' },
				{ name: 'Python SDK', text: 'Typed client with the access object as a model.', status: 'coming', href: '/for/agents' },
				{ name: 'OpenAPI', text: 'One spec for both APIs.', status: 'coming', href: '/for/agents' },
				{ name: 'Node proxy', text: 'Keeps your key on the server and normalises results for editors.', status: 'coming', href: '/docs/integrations' }
			]
		}
	];

	const snippet = `<!-- Before </body> on Ghost, Squarespace, Webflow, Wix or Framer -->
<script async src="https://cdn.iframe.ly/embed.js?key=YOUR_KEY_MD5"><\/script>
<!-- Then any <a href="…" data-iframely-url> link becomes an embed -->`;

	const tones = { available: 'good', coming: 'warn', guide: 'neutral' } as const;
	const labels = { available: 'Available', coming: 'Coming', guide: 'Guide' };
</script>

<PageMeta
	title="Integrations: editors, CMSs, frameworks and MCP | Iframely"
	description="Iframely for Tiptap, Lexical, Editor.js, CKEditor 5, TinyMCE, WordPress, Drupal, Payload, React, React Native, hosted site builders and MCP clients."
/>

<Hero
	eyebrow="Integrations"
	title="Iframely where your users paste links"
	sub="Editors, CMSs, frameworks and agents. Each integration is a thin adapter over one shared core, so behaviour is the same everywhere and nothing goes stale when an editor ships a new version."
>
	<Button href="#editors">Editors</Button>
	<Button href="#cms" variant="secondary">CMSs</Button>
	<Button href="#sdks" variant="secondary">MCP and SDKs</Button>
	{#snippet after()}
	{/snippet}
</Hero>

{#each groups as g, i (g.id)}
	<Section id={g.id} tone={i % 2 ? 'muted' : 'default'} eyebrow={g.title} title={g.intro}>
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each g.items as item (item.name)}
				<a href={item.href} class="rounded-xl border border-ink-100 bg-white p-4 hover:border-brand-300">
					<div class="flex items-center justify-between gap-2">
						<h3 class="font-semibold">{item.name}</h3>
						<Badge tone={tones[item.status]}>{labels[item.status]}</Badge>
					</div>
					<p class="mt-2 text-sm text-ink-600">{item.text}</p>
				</a>
			{/each}
		</div>
	</Section>
{/each}

<Section id="hosted" eyebrow="Hosted platforms" title="One snippet for site builders without plugins">
	<div class="grid gap-8 lg:grid-cols-2 lg:items-center">
		<p class="text-ink-700">
			Ghost, Squarespace, Webflow, Wix and Framer have no plugin system for embeds, but all of them let you add a script.
			Add embed.js once with your origin-locked key, and links you mark become responsive embeds.
		</p>
		<Code code={snippet} label="HTML" />
	</div>
</Section>

<Cta title="Not on the list?" text="The oEmbed API works with anything that supports oEmbed providers.">
	<Button href="/docs">Read the docs</Button>
	<Button href="/help#contact" variant="invert">Ask for an integration</Button>
</Cta>
