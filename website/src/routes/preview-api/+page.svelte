<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Code from '#lib/components/Code.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PricingBlock from '#lib/components/PricingBlock.svelte';
	import Stats from '#lib/components/Stats.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Scene from '#lib/components/Scene.svelte';
	import CtaWindow from '#lib/components/CtaWindow.svelte';
	import { previewCurl, previewResponse } from '#lib/data/samples.ts';
</script>

<PageMeta
	title="Preview API: link previews, cards and metadata for any URL | Iframely"
	description="One API for link previews and cards on public URLs, across the formats publishers use. Rich media included by default, or metadata only."
/>

<Hero
	eyebrow="Preview API"
	product
	endpoint="iframe.ly/api/iframely"
	title="Link previews for every URL your users share"
	sub="Send a URL, get the title, source, author, thumbnails and a ready summary card, across the formats publishers use. Keep Rich Media on for players and embeds, or turn it off for metadata only."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="secondary">Try a link</Button>
	<!-- the home page's Preview API scene, under the copy, as the wall of embeds on /embeds -->
	{#snippet below()}<Scene scene="preview" class="min-h-[480px]" />{/snippet}
</Hero>

<!-- the call to action straight after the hero scene, as on /embeds (components/CtaWindow.svelte) -->
<div class="hero-cta wrap -mt-7 mb-10 md:-mt-13">
	<CtaWindow
		title="Start with one URL"
		buttons={[
			['Get an API key', '#signup'],
			['Try a link', '/try']
		]}
	/>
</div>

<Section eyebrow="What you get" title="One request, a usable preview for any public URL">
	<Cards
		items={[
			{
				title: 'Metadata',
				text: 'Title, description, site, author, dates and thumbnails, normalised across Open Graph, Twitter Cards, oEmbed and structured data.'
			},
			{
				title: 'Summary cards',
				text: 'A hosted card for any URL without a player, in light or dark, large or small. Or build your own from the data.'
			},
			{
				title: 'Rich Media, on or off',
				text: 'Players and embeds for 1,900 providers come in the same response. Turn them off when you only need metadata.',
				href: '/embeds',
				cta: 'About Rich Media'
			}
		]}
	/>
</Section>

<Section tone="muted" eyebrow="API" title="The same request shape for every URL">
	<div class="grid gap-10 lg:grid-cols-2">
		<div class="space-y-4 text-ink-700">
			<p>
				The Iframely API returns metadata, links and, where enabled, the embed HTML. The oEmbed API returns the same in
				the oEmbed format.
			</p>
			<p>Previews are cached: one hit covers every request for a URL within the hour, so a link shared in a busy channel costs once.</p>
			<div class="flex flex-wrap gap-3 pt-2">
				<Button href="/pricing" variant="secondary">Pricing</Button>
			</div>
		</div>
		<div class="space-y-3">
			<Code code={previewCurl} label="curl" />
			<Code code={previewResponse} label="Response (shortened)" />
		</div>
	</div>
</Section>

<Section id="proof" eyebrow="Proof" title="The previews behind the tools your users already know">
	<div class="grid gap-4 md:grid-cols-2">
		<blockquote class="rounded-xl border border-ink-100 p-6">
			<p class="text-ink-700">Atlassian's knowledge base says Jira Cloud depends on Iframely for the metadata behind Smart Links.</p>
			<footer class="mt-3 text-sm text-ink-500">
				Atlassian support ·
				<a href="https://support.atlassian.com/jira/kb/smart-links-for-confluence-server-in-jira-cloud/" class="text-brand-700">link</a>
			</footer>
		</blockquote>
		<blockquote class="rounded-xl border border-ink-100 p-6">
			<p class="text-ink-700">Notion and GitBook name Iframely in their own help pages as the service behind link previews and embeds.</p>
			<footer class="mt-3 text-sm text-ink-500">Notion and GitBook docs</footer>
		</blockquote>
	</div>
</Section>

<Section tone="muted" eyebrow="Who it's for" title="Built for products where people paste links">
	<Cards
		items={[
			{ title: 'Chat and collaboration apps', text: 'Previews at chat volume, cached per URL.', href: '/for/chat-apps', cta: 'Chat apps' },
			{ title: 'CMS and editors', text: 'Embeds that keep working in published posts.', href: '/for/cms', cta: 'CMS and editors' },
			{ title: 'AI agents', text: 'Add the Data API to read the page behind the preview.', href: '/data-api', cta: 'Data API' }
		]}
	/>
</Section>

<Section>
	<Stats
		items={[
			{ value: '2012', label: 'Serving since' },
			{ value: '6,000+', label: 'Products use Iframely' },
			{ value: '6.5B', label: 'Requests a month' },
			{ value: '99.99%', label: 'Uptime' }
		]}
	/>
</Section>

<PricingBlock />

<Cta title="Paste a link, see the preview" text="2,000 hits a month free. No card needed.">
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="invert">Check a URL</Button>
</Cta>
