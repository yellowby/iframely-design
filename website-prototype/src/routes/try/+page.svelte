<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Section from '#lib/components/Section.svelte';
	import Generator from '#lib/components/Generator.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Button from '#lib/components/Button.svelte';
	import { exampleChips } from '#lib/generator.ts';

	let gen: Generator | undefined = $state();

	onMount(() => {
		// shared results: /try?url=… (canonical stays /try)
		const shared = new URLSearchParams(window.location.search).get('url');
		if (shared) gen?.check(shared);
	});

	function onCheck(url: string) {
		replaceState(`?url=${encodeURIComponent(url)}`, {});
	}

	const faq = [
		{
			q: 'Is the embed code free?',
			a: 'Yes. Native code for YouTube, X, Instagram, TikTok, Spotify and the other platforms that publish it is free and needs no account. It is the platform\'s own code; we only add the options and make it responsive.'
		},
		{
			q: 'What is the difference between native and hosted code?',
			a: 'Native code loads straight from the platform. Hosted code is an Iframely embed: we build it for sites that publish no embed code (articles, maps, documents), keep it working when the site changes, and add lazy loading, click-to-play and consent. Hosted embeds need a free account.'
		},
		{
			q: 'How do I make an embed responsive?',
			a: 'Wrap the iframe in a box with a fixed aspect ratio, as the generated code does. For your own iframes, use the <a href="/tools">responsive iframe generator</a>.'
		},
		{
			q: 'How do I start a YouTube video at a set time?',
			a: 'Paste the video link, then fill in "Start at" in the YouTube options. The code gets a <code>start</code> parameter in seconds. More on the <a href="/domains/youtube">YouTube embed page</a>.'
		},
		{
			q: 'Does this work in WordPress, Notion or Webflow?',
			a: 'Paste the code into any HTML block. In WordPress, the <a href="/wordpress">Iframely plugin</a> does it for every link you paste. Notion and GitBook already use Iframely for their embeds.'
		},
		{
			q: 'Why does the embed not show on my site?',
			a: 'The usual causes: a content security policy that blocks the platform\'s script, a tracker blocker, or a regional block. Check the provider\'s page for known problems, or run the link through the <a href="/tools/url-debugger">URL debugger</a>.'
		}
	];
</script>

<PageMeta
	title="Embed code generator: paste a link, get responsive embed code"
	description="Free embed code generator. Paste a link from YouTube, X, Instagram, TikTok, Spotify and 1,900 other sites and get responsive embed code, no sign-up."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-12 md:py-16">
		<h1 class="t-hero text-ink-950">Embed code generator</h1>
		<p class="mt-4 max-w-2xl text-lg text-ink-600 md:text-xl">
			Works for 1,900 sites. Native code for the big platforms, no sign-up. Responsive by default.
		</p>
		<div class="mt-8">
			<Generator bind:this={gen} initialUrl={exampleChips[0].url} chips={exampleChips} {onCheck} />
		</div>
		<p class="mt-4 text-sm text-ink-500">
			Building an app? The API sandbox with JSON, options and the <code>access</code> object is in your
			<a href="#signin" class="text-brand-700 underline">dashboard's Check URL</a>.
		</p>
	</div>
</section>

<Section eyebrow="What you get" title="Native code or a hosted embed, and why it matters">
	<div class="grid gap-8 md:grid-cols-2">
		<div class="space-y-3 text-ink-700">
			<h3 class="font-semibold text-ink-950">Native code</h3>
			<p>
				The platform's own embed, the same code its share button gives you, with the options you picked and a
				responsive wrapper. It loads from the platform, it is free, and it is yours to paste anywhere.
			</p>
			<h3 class="pt-3 font-semibold text-ink-950">Hosted by Iframely</h3>
			<p>
				Many sites publish no embed code: news articles, maps, documents, product pages. Iframely builds a card or
				player for them and hosts it. Hosted embeds update when the source changes and survive platform rule changes.
				They need a free account, because we serve them for as long as your page lives.
			</p>
		</div>
		<div class="space-y-3 text-ink-700">
			<h3 class="font-semibold text-ink-950">Why embeds break</h3>
			<p>
				Platforms change their scripts, drop oEmbed fields and block regions. Meta removed thumbnails from its oEmbed
				in November 2025; X's script is blocked in some countries. Native code breaks when that happens; hosted
				embeds are fixed once, for everyone.
			</p>
			<h3 class="pt-3 font-semibold text-ink-950">Sizing and privacy</h3>
			<p>
				Every code is responsive: video keeps its 16:9 or 9:16 shape at any width. A YouTube player adds about 500
				KB and cookies on page load; use the privacy-enhanced option, or a hosted embed with click-to-play and a
				consent prompt for visitors in the EU.
			</p>
		</div>
	</div>
</Section>

<Section tone="muted" title="Embed code by site">
	<Cards
		cols={4}
		items={[
			{ title: 'YouTube', text: 'Start and end time, autoplay, Shorts, privacy-enhanced mode.', href: '/domains/youtube', cta: 'YouTube embed code' },
			{ title: 'X (Twitter)', text: 'Dark theme, hide the thread, do-not-track.', href: '/domains/x', cta: 'X embed code' },
			{ title: 'Instagram', text: 'Posts and reels, with or without the caption.', href: '/domains/instagram', cta: 'Instagram embed code' },
			{ title: 'All 1,900 sites', text: 'Search by name or category.', href: '/domains', cta: 'Supported providers' }
		]}
	/>
	<div class="mt-8 grid gap-4 md:grid-cols-3">
		<a href="/tools" class="rounded-xl border border-ink-100 bg-white p-5 hover:border-brand-300">
			<h3 class="font-semibold">Free tools</h3>
			<p class="mt-2 text-[15px] text-ink-600">Responsive iframe generator, link-preview HTML, PDF and Google Drive embeds.</p>
		</a>
		<a href="/wordpress" class="rounded-xl border border-ink-100 bg-white p-5 hover:border-brand-300">
			<h3 class="font-semibold">On WordPress?</h3>
			<p class="mt-2 text-[15px] text-ink-600">The Iframely plugin turns every pasted link into an embed, no code.</p>
		</a>
		<a href="/tools/url-debugger" class="rounded-xl border border-ink-100 bg-white p-5 hover:border-brand-300">
			<h3 class="font-semibold">Your own link looks wrong?</h3>
			<p class="mt-2 text-[15px] text-ink-600">Check how X, Facebook, Slack and others preview it with the URL debugger.</p>
		</a>
	</div>
</Section>

<Section narrow title="Questions">
	<Faq items={faq} />
	<div class="mt-8 flex flex-wrap gap-3">
		<Button href="#signup">Create a free account</Button>
		<Button href="/docs" variant="secondary">Developer docs</Button>
	</div>
</Section>
