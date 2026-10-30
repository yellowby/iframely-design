<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Code from '#lib/components/Code.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Stats from '#lib/components/Stats.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import { previewCurl, previewResponse } from '#lib/data/samples.ts';
</script>

<PageMeta
	title="Rich Media: embeds for 1,900 providers, tracking changes since 2012 | Iframely"
	description="Send a URL, get a responsive embed or a summary card. 1,900 providers, hosted cards, click-to-play, consent gates and lazy loading, maintained as platforms change."
/>

<Hero
	eyebrow="Rich Media"
	title="Link previews and embeds that keep working"
	tagline="Bringing URLs to life"
	sub="Send any URL, get a responsive embed, a summary card or clean oEmbed. 1,900 providers, hosted delivery, click-to-play and consent. When X, Meta or TikTok change their embeds, we change ours."
>
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="quiet">Try a link →</Button>
	{#snippet after()}
	{/snippet}
	{#snippet aside()}
		<Placeholder label="A video player, a post card and an article summary card, stacked" class="aspect-[4/3]" />
	{/snippet}
</Hero>

<Section id="api" eyebrow="Preview API and oEmbed" title="One request, a usable result for any URL">
	<div class="grid gap-10 lg:grid-cols-2">
		<div class="space-y-4 text-ink-700">
			<p>
				The Iframely API returns the embed HTML, the media type, thumbnails, metadata and the aspect ratio for any URL.
				The oEmbed API returns the same in the oEmbed format your editor or CMS may already expect.
			</p>
			<p>
				Where a provider has an embed, you get the player. Where it does not, you get a summary card built from Open
				Graph, Twitter Cards and structured data. You are not billed for URLs that return nothing useful.
			</p>
			<ul class="space-y-1.5 text-[15px]">
				<li><b>Iframely API:</b> the full result with every link type and rel value</li>
				<li><b>oEmbed API:</b> drop-in for editors and CMSs that speak oEmbed</li>
				<li><b>embed.js:</b> one script for responsive sizing and lazy loading</li>
			</ul>
		</div>
		<div class="space-y-3">
			<Code code={previewCurl} label="curl" />
			<Code code={previewResponse} label="Response (shortened)" />
		</div>
	</div>
</Section>

<Section id="hosted" tone="muted" eyebrow="Hosted iframes and Content IDs" title="Embeds you host once and never touch again">
	<Cards
		items={[
			{
				title: 'Hosted iframes',
				text: 'We wrap third-party embed code in our own iframe: isolated from your page, sized before it loads, with a fallback when the provider fails.'
			},
			{
				title: 'Content IDs',
				text: 'A short, permanent ID per URL. Refresh a whole archive in one batch call, or use the ID as the iframe source so old posts update themselves.'
			},
			{
				title: 'Evergreen refresh',
				text: 'Thumbnails expire, players move, providers deprecate fields. Hosted embeds follow the change; copied embed code does not.'
			}
		]}
	/>
</Section>

<Section id="cards" eyebrow="Cards and themes" title="A clean card for every link without a player">
	<div class="grid gap-10 lg:grid-cols-2 lg:items-center">
		<div class="space-y-4 text-ink-700">
			<p>
				Articles, products, repositories, events: Iframely renders a summary card with title, image, site and author.
				Large or small, light, dark or following the system.
			</p>
			<p>Cards link to the source with a documented <code>utm_source</code>, so publishers see where the visit came from.</p>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<Placeholder label="Large card, light" class="aspect-[4/3]" />
			<Placeholder label="Large card, dark" class="aspect-[4/3]" />
			<Placeholder label="Small card" class="aspect-[4/2]" />
			<Placeholder label="Product card" class="aspect-[4/2]" />
		</div>
	</div>
</Section>

<Section id="interactives" tone="muted" eyebrow="Interactives" title="Faster pages, fewer surprises for your readers">
	<Cards
		cols={4}
		items={[
			{ title: 'Click-to-play', text: 'Show a cover image, load the player only when the reader presses play. A YouTube player is about 500 KB you no longer load up front.', href: '/docs/click-to-play', cta: 'Docs' },
			{ title: 'Consent gates', text: 'Ask before loading third-party media that sets cookies. Required for many EU sites; one parameter to turn on.', href: '/docs/consents', cta: 'Docs' },
			{ title: 'Autoplay, safely', text: 'Muted autoplay when the embed scrolls into view, following each browser\'s rules.', href: '/docs/autoplay', cta: 'Docs' },
			{ title: 'Playback events', text: 'One player.js event API across providers: play, pause, ended, time updates.', href: '/docs/playerjs', cta: 'Docs' }
		]}
	/>
</Section>

<Section id="delivery" eyebrow="Delivery" title="Lazy loading, predicted heights, your CDN">
	<div class="grid gap-6 md:grid-cols-3">
		<div>
			<h3 class="font-semibold">Lazy-load</h3>
			<p class="mt-2 text-ink-600">Embeds load as they approach the viewport. Heights are known in advance, so the page does not jump.</p>
		</div>
		<div>
			<h3 class="font-semibold">Script and CSS control</h3>
			<p class="mt-2 text-ink-600">Omit our script, switch inline styles to class names, or render in Shadow DOM.</p>
		</div>
		<div>
			<h3 class="font-semibold">Custom CDN</h3>
			<p class="mt-2 text-ink-600">Serve hosted iframes from your own domain and CDN on the Enterprise plan.</p>
		</div>
	</div>
</Section>

<Section id="customization" tone="muted" eyebrow="Customization and white-label" title="Your product's look, not ours">
	<div class="grid gap-6 md:grid-cols-2">
		<p class="text-ink-700">
			Per-use options let your users choose start times, themes and sizes in your editor. Remove the "Powered by" icon
			from paid plans, set default parameters in your account, and white-label the iframe domain.
		</p>
		<Placeholder label="Editor options form: start time, theme, size" class="aspect-[16/9]" />
	</div>
</Section>

<Section id="integrations" eyebrow="Editors and CMS" title="Drop into the editor you already use">
	<Cards
		cols={4}
		items={[
			{ title: 'WordPress', text: 'An embed block for 1,900 providers, with options and consent.', href: '/wordpress', cta: 'Plugin' },
			{ title: 'CKEditor 5 and TinyMCE', text: 'Media embed through the oEmbed endpoint, configuration in a few lines.', href: '/integrations', cta: 'Guides' },
			{ title: 'Tiptap, Lexical, Editor.js', text: 'Paste a URL, get an embed node. Adapters as they ship.', href: '/integrations', cta: 'Integrations' },
			{ title: 'React, Vue, React Native', text: 'Render embeds and cards in apps and WebViews.', href: '/docs', cta: 'Docs' }
		]}
	/>
</Section>

<Section id="providers" tone="muted" eyebrow="1,900 providers" title="Video, audio, social, maps, documents, code and more">
	<div class="grid grid-cols-4 gap-3 md:grid-cols-8">
		{#each Array(16) as _, i (i)}<Placeholder label="Provider logo" class="h-14" />{/each}
	</div>
	<div class="mt-6"><Button href="/domains" variant="secondary">See all supported providers</Button></div>
</Section>

<Section id="proof" eyebrow="Proof" title="The embeds inside the tools you already use">
	<div class="grid gap-4 md:grid-cols-2">
		<blockquote class="rounded-xl border border-ink-100 p-6">
			<p class="text-ink-700">Notion's help center tells its users that link previews and embeds come from Iframely, and lists the supported providers from our data.</p>
			<footer class="mt-3 text-sm text-ink-500">Notion help page · <a href="#notion" class="text-brand-700">link</a></footer>
		</blockquote>
		<blockquote class="rounded-xl border border-ink-100 p-6">
			<p class="text-ink-700">GitBook's documentation names Iframely as the service behind its embed blocks.</p>
			<footer class="mt-3 text-sm text-ink-500">GitBook docs · <a href="#gitbook" class="text-brand-700">link</a></footer>
		</blockquote>
	</div>
	<div class="mt-8 grid grid-cols-3 gap-3 md:grid-cols-6">
		{#each Array(6) as _, i (i)}<Placeholder label="Customer logo" class="h-14" />{/each}
	</div>
</Section>

<Section tone="muted" title="Questions" narrow>
	<Faq
		items={[
			{ q: 'Where did the features page go?', a: 'Everything on it is here, by section. The Data API and publisher controls have their own pages: <a href="/data-api">Data API</a> and <a href="/publishers">For publishers</a>.' },
			{ q: 'Do I need hosted iframes?', a: 'No. You can take the provider\'s native code from the API. Hosted iframes add isolation, predicted heights, click-to-play and consent, and they survive provider changes.' },
			{ q: 'What is a hit?', a: 'One hour of activity for one URL: all API calls and iframe views of that URL in the same hour count as one hit. See <a href="/pricing">pricing</a> for the full definition and a calculator.' },
			{ q: 'Can I self-host?', a: 'The open-source engine runs the oEmbed and Iframely endpoints on your servers. Hosted iframes, Content IDs and the Data API are cloud-only.' }
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

<Cta title="Paste a URL, ship an embed" text="2,000 hits a month free. No card needed.">
	<Button href="#signup">Get an API key</Button>
	<Button href="/try" variant="invert">Try a link</Button>
	<Button href="/pricing" variant="invert">Pricing</Button>
</Cta>
