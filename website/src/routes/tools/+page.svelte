<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Badge from '#lib/components/Badge.svelte';

	const tools = [
		{
			title: 'URL debugger',
			text: 'Check how X, Facebook, LinkedIn, Slack and others preview your link. Open Graph, Twitter Cards and oEmbed in one report.',
			href: '/tools/url-debugger',
			live: true
		},
		{
			title: 'Embed code generator',
			text: 'Paste a link from YouTube, X, Instagram and 1,900 other sites, get responsive embed code.',
			href: '/try',
			live: true
		},
		{
			title: 'Responsive iframe generator',
			text: 'Turn any iframe into one that keeps its shape on every screen. Width, height, aspect ratio, lazy loading.',
			live: false
		},
		{
			title: 'Link preview HTML generator',
			text: 'Paste a URL, get a static HTML card with title, image and description for emails, docs and sites.',
			live: false
		},
		{
			title: 'PDF embed',
			text: 'Show a PDF inline with a page viewer and a download link, no plugin.',
			live: false
		},
		{
			title: 'Google Drive embed',
			text: 'Embed Docs, Sheets, Slides and Drive files, with the sharing setting that makes them visible.',
			live: false
		}
	];
</script>

<PageMeta
	title="Free embed and link tools: debugger, iframe and preview generators"
	description="Free tools from Iframely: URL debugger, embed code generator, responsive iframe generator, link-preview HTML, PDF and Google Drive embeds. No sign-up."
/>

<Hero
	title="Free tools for links and embeds"
	sub="No sign-up, no key. Generic tools live here; embed code for a specific site is on that site's page, such as YouTube or X."
/>

<Section>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each tools as t (t.title)}
			<svelte:element
				this={t.href ? 'a' : 'div'}
				href={t.href}
				class="flex flex-col rounded-xl border border-ink-100 bg-white p-5 {t.href ? 'hover:border-brand-300' : 'opacity-80'}"
			>
				<div class="flex items-center justify-between gap-2">
					<h2 class="font-semibold text-ink-950">{t.title}</h2>
					{#if t.live}<Badge tone="good">available</Badge>{:else}<Badge>coming</Badge>{/if}
				</div>
				<p class="mt-2 text-[15px] text-ink-600">{t.text}</p>
				{#if t.href}<span class="mt-auto pt-4 text-sm font-medium text-brand-700">Open the tool →</span>{/if}
			</svelte:element>
		{/each}
	</div>
	<p class="mt-10 text-ink-600">
		Need embeds on every page of your site without copying code? <a href="/wordpress" class="text-brand-700 underline"
			>Use the WordPress plugin</a
		>
		or <a href="/embeds" class="text-brand-700 underline">the Embeds API</a>.
	</p>
</Section>
