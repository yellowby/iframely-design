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
	title="Embeds for CMSs, editors and site builders | Iframely"
	description="Paste a URL, get an embed that keeps working. Editor and CMS integrations for Tiptap, Lexical, CKEditor 5, WordPress and more, with per-embed options and consent."
/>

<Hero
	eyebrow="CMS, editors and site builders"
	title="Paste a URL, get an embed that keeps working"
	sub="Your users paste links into posts and pages. Iframely turns each into the right embed, lets the author set options per block, and keeps the published embed working when the provider changes its code."
>
	<Button href="/integrations">See integrations</Button>
	<Button href="/embeds" variant="secondary">Rich Media</Button>
	{#snippet aside()}
		<Placeholder label="Editor with a pasted URL turned into an embed block and its options panel" class="aspect-[4/3]" />
	{/snippet}
</Hero>

<Section eyebrow="Beyond core embeds" title="What a pasted URL turns into">
	<Table
		head={['', 'Typical built-in embeds', 'With Iframely']}
		rows={[
			['Providers', 'About 40 hard-coded', '1,900, maintained'],
			['Any other URL', 'A plain link', 'A summary card'],
			['Per-embed options', 'None', 'Start time, theme, hide media and more, chosen by the author'],
			['Privacy', 'Provider scripts load on page view', 'Click-to-play and consent prompts'],
			['After a provider changes', 'Embeds break until someone edits the post', 'Hosted embeds refresh themselves'],
			['Layout', 'Shifts as scripts load', 'Heights predicted before load']
		]}
	/>
</Section>

<Section tone="muted" eyebrow="How it fits" title="Thin adapters over one core">
	<Cards
		items={[
			{ title: 'In the editor', text: 'A hosted iframe previews the embed while the author writes, with no backend needed.' },
			{ title: 'On save', text: 'Your server calls the API with your key, or stores the oEmbed HTML.' },
			{ title: 'On the page', text: 'embed.js handles height, lazy load, theme and click-to-play.' }
		]}
	/>
	<p class="mt-6 text-ink-600">
		Each adapter is a small package over the same core, tested against every new version of its editor.
	</p>
</Section>

<Section eyebrow="Proof" title="Already in the tools your users know">
	<p class="max-w-3xl text-ink-700">
		CKEditor's own documentation points to Iframely for media embeds. The WordPress plugin serves 2,000+ sites. Outline,
		Notion and GitBook run Iframely server-side.
	</p>
	<div class="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
		{#each Array(6) as _, i (i)}<Placeholder label="Logo" class="h-14" />{/each}
	</div>
</Section>

<Section
	tone="muted"
	eyebrow="Integrate"
	title="Pick your stack"
	intro="One oEmbed endpoint for 1,900+ providers, including the many that don't publish oEmbed themselves. If your CMS or editor speaks oEmbed, it already speaks Iframely."
>
	<Cards
		cols={4}
		items={[
			{ title: 'Editors', text: 'Tiptap, Lexical, Editor.js, CKEditor 5, TinyMCE.', href: '/integrations#editors' },
			{ title: 'CMSs', text: 'WordPress, Drupal, Payload, Strapi, Statamic, Craft.', href: '/integrations#cms' },
			{ title: 'Hosted platforms', text: 'One snippet for Ghost, Squarespace, Webflow, Wix, Framer.', href: '/integrations#hosted' },
			{ title: 'WordPress plugin', text: 'Gutenberg block with options.', href: '/wordpress' }
		]}
	/>
</Section>

<Cta title="Give your authors 1,900 providers" text="Start free; most features are on every plan.">
	<Button href="#signup">Get an API key</Button>
	<Button href="/integrations" variant="invert">Integrations</Button>
</Cta>
