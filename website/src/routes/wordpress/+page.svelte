<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Table from '#lib/components/Table.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';

	// Pulled live from the wordpress.org plugins API in production; sample values here.
	const listing = [
		['Version', '1.2.0'],
		['Tested up to', 'WordPress 7.1'],
		['Requires', 'WordPress 5.8, PHP 7.4'],
		['Active installs', '2,000+'],
		['Rating', '4.6 (sample)']
	];
</script>

<PageMeta
	title="WordPress media embeds, cards and blocks | Iframely"
	description="Embed any URL in WordPress: 1,900 providers instead of core's 40, cards for any link, per-block options, consent prompts and embeds that update themselves."
/>

<Hero
	eyebrow="WordPress plugin"
	title="Iframely media blocks for WordPress"
	sub="Paste any URL into the block editor and get a responsive embed or a card. 1,900 providers, options per block, consent for EU visitors, and embeds that keep working when platforms change."
>
	<Button href="#install">Install the plugin</Button>
	<Button href="#signup" variant="secondary">Get a free API key</Button>
	{#snippet after()}
		<dl class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
			{#each listing as [k, v] (k)}
				<div><dt class="inline text-ink-500">{k}:</dt> <dd class="inline font-medium">{v}</dd></div>
			{/each}
		</dl>
	{/snippet}
	{#snippet aside()}
		<Placeholder label="40-second demo: paste a URL in Gutenberg, choose an option, publish" class="aspect-video" />
	{/snippet}
</Hero>

<Section eyebrow="Compared with core" title="What you get beyond WordPress's built-in embeds">
	<Table
		head={['', 'WordPress core embeds', 'Iframely plugin']}
		rows={[
			['Providers', 'About 40', '1,900'],
			['Links without an embed', 'Plain link', 'A card with title, image and site'],
			['Options', 'None', 'Per block: start time, theme, hide captions, card size'],
			['EU consent', 'Embeds load trackers immediately', 'Consent prompt before third-party scripts'],
			['When a platform changes', 'Embeds freeze or break', 'Embeds refresh themselves'],
			['Layout shift', 'Height jumps after load', 'Height predicted before load'],
			['Page speed', 'Players load on page load', 'Lazy-load and click-to-play']
		]}
	/>
</Section>

<Section id="install" tone="muted" eyebrow="Install" title="Four steps, five minutes">
	<ol class="grid gap-4 md:grid-cols-4">
		{#each [
			['Install', 'In wp-admin, Plugins → Add New, search "Iframely", install and activate.'],
			['Get a key', 'Create a free account and copy your API key.'],
			['Paste the key', 'Settings → Iframely, paste the key, save.'],
			['Paste a URL', 'In any post, paste a link. The Iframely block does the rest.']
		] as [t, d], i (t)}
			<li class="rounded-xl border border-ink-100 bg-white p-5">
				<p class="text-sm font-semibold text-brand-700">Step {i + 1}</p>
				<p class="mt-1 font-semibold">{t}</p>
				<p class="mt-2 text-[15px] text-ink-600">{d}</p>
			</li>
		{/each}
	</ol>
</Section>

<Section eyebrow="Pricing" title="What it costs for a blog">
	<div class="grid gap-6 md:grid-cols-3">
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">Free Starter</h3>
			<p class="mt-2 text-[15px] text-ink-600">2,000 hits a month: enough for a blog with a few hundred embeds read daily. Cards show a small "Powered by" icon.</p>
		</div>
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">Product, $49 a month</h3>
			<p class="mt-2 text-[15px] text-ink-600">25,000 hits, no icon, Content IDs so embeds survive if you ever cancel.</p>
		</div>
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">What is a hit?</h3>
			<p class="mt-2 text-[15px] text-ink-600">One hour in which an embed is viewed, however many readers it has in that hour.</p>
		</div>
	</div>
	<p class="mt-4 text-sm text-ink-600">Every paid plan starts with a free trial. <a href="/pricing#calculator" class="font-medium text-brand-700">Estimate your hits →</a></p>
</Section>

<Section tone="muted" narrow eyebrow="FAQ" title="Questions from WordPress users">
	<Faq
		items={[
			{ q: 'Is it GDPR-friendly for EU blogs?', a: 'Turn on consent prompts and third-party players load only after the visitor agrees. Hosted cards load no third-party scripts.' },
			{ q: 'How do I remove the "Powered by" icon?', a: 'Any paid plan removes it.' },
			{ q: 'Does it work with the Classic editor and shortcodes?', a: 'Yes. Pasted URLs in the Classic editor are embedded, and <code>[iframely]</code> shortcodes keep working.' },
			{ q: 'What about Elementor, Divi and Bricks?', a: 'Use the page builder\'s embed or shortcode widget with an Iframely shortcode. Native widgets are not available yet.' },
			{ q: 'Multisite?', a: 'Yes, with one key per site or one network-wide key.' },
			{ q: 'Does it work with caching plugins and my host?', a: 'Yes. Embed HTML is cached in post meta; the hosted iframes are served from our CDN.' },
			{ q: 'What happens to my embeds if a platform changes?', a: 'Hosted embeds are updated on our side; your posts do not change.' },
			{ q: 'What if I uninstall?', a: 'Links fall back to WordPress core embeds where core supports them, and to plain links otherwise.' }
		]}
	/>
</Section>

<Section eyebrow="More" title="Related">
	<ul class="grid gap-3 text-[15px] md:grid-cols-2">
		<li><a href="/docs" class="text-brand-700">WordPress guide in the docs</a></li>
		<li><a href="/help/youtube-start-time" class="text-brand-700">Start a YouTube embed at a specific time</a></li>
		<li><a href="/domains" class="text-brand-700">Which sites can you embed?</a></li>
		<li><a href="/try" class="text-brand-700">Just need one embed code? Use the free generator</a></li>
	</ul>
</Section>

<Cta title="Embed anything in WordPress" text="Free plugin, free key, 2,000 hits a month.">
	<Button href="#install">Install the plugin</Button>
	<Button href="#signup" variant="invert">Get a free API key</Button>
</Cta>
