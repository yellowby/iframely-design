<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Table from '#lib/components/Table.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="Link previews for chat and collaboration apps | Iframely"
	description="Rich link previews and embeds for chat, docs and collaboration apps. One hit covers every request for a URL within the hour. 1,900 providers, SOC 2 Type II."
/>

<Hero
	eyebrow="Chat and collaboration apps"
	title="Link previews people trust, at chat volume"
	sub="When a link is pasted in a channel, a doc or a thread, show what it is: the title, the source, the image, a playable video or a post card. Iframely does it for 1,900 providers and keeps up as they change."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="/preview-api" variant="secondary">Preview API</Button>
	{#snippet aside()}
		<Placeholder label="Chat thread with a pasted YouTube link, an X post card and an article summary card" class="aspect-[4/3]" />
	{/snippet}
</Hero>

<Section eyebrow="The job" title="What a chat product needs from a link">
	<Cards
		items={[
			{ title: 'Fast, cached previews', text: 'The same link is rendered for everyone in the channel. One hit covers every request for a URL within the hour.' },
			{ title: 'Players, not just cards', text: 'YouTube, Spotify, TikTok, X and Instagram as playable embeds in a hosted iframe, so their scripts never touch your app.' },
			{ title: 'Safe by default', text: 'Hosted iframes isolate third-party code. Click-to-play and consent gates for EU workspaces.' },
			{ title: 'Honest about the fetch', text: 'Our Preview Agent tells publishers which app asked, so your previews are not mistaken for scraping.' },
			{ title: 'Typed entities', text: 'Products, events, people and repositories as structured fields, for cards you design yourself.' },
			{ title: 'Summaries with permission', text: 'Add the Data API in <code>assist</code> mode to summarise a link for the person who asked.' }
		]}
	/>
</Section>

<Section tone="muted" eyebrow="Which product" title="Start with the Preview API">
	<Table
		head={['Need', 'Product', 'Unit']}
		rows={[
			['Unfurl a link into a card or a player', 'Preview API or oEmbed API', 'Hits: one per URL per hour'],
			['Hosted embeds that update themselves', 'Hosted iframes and Content IDs', 'Hits'],
			['"Summarise this link" in your assistant', 'Data API, <code>assist</code> mode', 'Per read']
		]}
	/>
	<p class="mt-4 text-ink-600">
		A chat tool with 100,000 distinct links a month, each opened a few times within the hour, uses about 35,000 to 50,000
		hits: $49 to $124 a month.
	</p>
	<div class="mt-4"><Button href="/pricing" variant="quiet">Price your workload →</Button></div>
</Section>

<Section id="proof" eyebrow="Proof" title="Behind the previews in Notion, GitBook and Outline">
	<div class="grid grid-cols-3 gap-3 md:grid-cols-6">
		{#each Array(6) as _, i (i)}<Placeholder label="Customer logo" class="h-14" />{/each}
	</div>
	<p class="mt-6 text-ink-600">
		Notion and GitBook name Iframely in their own help pages. 6.5 billion requests a month, 99.99% uptime, SOC 2 Type II.
	</p>
</Section>

<Section tone="muted" eyebrow="Integrate" title="Where to start">
	<Cards
		cols={4}
		items={[
			{ title: 'Preview API docs', text: 'Endpoints, parameters, result codes.', href: '/docs' },
			{ title: 'React and React Native', text: 'Rendering embeds in components and WebViews.', href: '/integrations#frameworks' },
			{ title: 'Editors', text: 'Tiptap, Lexical, BlockNote and others.', href: '/integrations#editors' },
			{ title: 'Compare', text: 'Iframely against Microlink and Embedly.', href: '/compare' }
		]}
	/>
</Section>

<Cta title="Paste a link, see the preview" text="2,000 hits a month free, production use allowed on one brand.">
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="invert">Check a URL</Button>
</Cta>
