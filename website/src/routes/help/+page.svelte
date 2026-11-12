<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';

	const topics: { title: string; articles: string[] }[] = [
		{
			title: 'Account',
			articles: ['Create and switch accounts', 'Invite your team', 'API keys and allowed origins', 'Sign in as a publisher']
		},
		{
			title: 'Billing',
			articles: ['What a hit is, with examples', 'Change or cancel your plan', 'What happens to hosted embeds when you cancel', 'Invoices, tax and currency', 'Remove the "Powered by" icon']
		},
		{
			title: 'Dashboard',
			articles: ['Read your usage analytics', 'Check URL: see what the API returns', 'Rate limits by plan']
		},
		{
			title: 'Configuration',
			articles: ['Default parameters and per-use options', 'Consent and GDPR for your end users', 'Custom CDN and white label']
		},
		{
			title: 'Troubleshooting',
			articles: ['Data API result codes in plain words', 'A URL returns no embed', 'Embeds not showing on my site', 'Report a bug']
		}
	];

	const moved = [
		['How to add a YouTube start time to the embedded player', '/help/youtube-start-time', 'Guide, with the YouTube generator'],
		['How to change the width and height of an iframe', '/tools', 'Guide, with the responsive iframe generator'],
		['YouTube error 153 in Android WebView', '/domains/youtube', 'YouTube page, Known problems'],
		['How to deal with expiring images of TikTok and Instagram', '/domains/instagram', 'Instagram page, Known problems'],
		['Including post captions in Instagram embeds', '/domains/instagram', 'Instagram generator option']
	];
</script>

<PageMeta
	title="Help center | Iframely"
	description="Answers for Iframely customers: account, billing, dashboard, configuration and troubleshooting. Contact support with your account and article attached."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-12">
		<h1 class="t-hero">Help center</h1>
		<p class="mt-3 max-w-2xl text-lg text-ink-600">Answers for Iframely customers about your account, billing and integration.</p>
		<div class="mt-6 max-w-xl rounded-lg border border-ink-200 bg-white px-4 py-3 text-ink-400 shadow-sm">Search help and docs…</div>
		<p class="mt-3 text-sm text-ink-500">Building something new? <a href="/docs" class="underline">Start with the docs</a>.</p>
	</div>
</section>

<Section>
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each topics as t (t.title)}
			<div class="rounded-xl border border-ink-100 p-5">
				<h2 class="font-semibold">{t.title}</h2>
				<ul class="mt-3 space-y-1.5 text-[15px]">
					{#each t.articles as a (a)}<li><a href="#article" class="text-ink-700 hover:text-brand-700">{a}</a></li>{/each}
				</ul>
			</div>
		{/each}
	</div>
</Section>

<Section tone="muted" eyebrow="Moved" title="Looking for an embed how-to?" intro="These answers now live next to the tool that does the job. Old links redirect.">
	<ul class="divide-y divide-ink-100 rounded-xl border border-ink-100 bg-white">
		{#each moved as [title, href, where] (title)}
			<li class="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
				<a {href} class="font-medium text-ink-900 hover:text-brand-700">{title}</a>
				<span class="text-sm text-ink-500">{where} →</span>
			</li>
		{/each}
	</ul>
</Section>

<Section id="contact" title="Contact support" intro="Tell us what happened. We attach your account and the page you came from, so you don't have to.">
	<div class="grid gap-6 md:grid-cols-[1.4fr_1fr]">
		<Placeholder label="Form: topic, message, URL that fails (optional) · prefilled: account, plan, article you were reading" class="h-64" />
		<div class="space-y-3 text-[15px] text-ink-600">
			<p>Response times by plan: to add from the support policy.</p>
			<p>Security and press addresses: to add.</p>
			<p>Publishers asking about our agents: <a href="/verification" class="text-brand-700">verify our agents</a> first, then write to us.</p>
		</div>
	</div>
</Section>
