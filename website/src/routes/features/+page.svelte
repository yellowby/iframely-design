<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Table from '#lib/components/Table.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="Features moved to Rich Media | Iframely"
	description="The features page now lives at /embeds."
/>

<Section narrow eyebrow="Redirect" title="This page moved to Rich Media">
	<p class="text-lg text-ink-700">
		On the live site, <code>/features</code> answers with a 301 to <code>/embeds</code>. Old anchors map to the new
		sections as below.
	</p>
	<div class="mt-6"><Button href="/embeds">Go to Rich Media</Button></div>
	<div class="mt-8">
		<Table
			head={['Old section on /features', 'New location']}
			rows={[
				['Mighty URL engine', '<a href="/embeds">/embeds</a>'],
				['Intelligent parsers', '<a href="/embeds#api">/embeds#api</a>'],
				['Simple API', '<a href="/embeds#api">/embeds#api</a>'],
				['1,900 providers', '<a href="/embeds#providers">/embeds#providers</a>'],
				['Interactives (cards, click-to-play, consent)', '<a href="/embeds#interactives">/embeds#interactives</a>, <a href="/embeds#cards">#cards</a>'],
				['Delivery', '<a href="/embeds#delivery">/embeds#delivery</a>'],
				['Customers', '<a href="/embeds#proof">/embeds#proof</a>'],
				['Stack guidance', '<a href="/embeds#integrations">/embeds#integrations</a>'],
				['Customization and white-label', '<a href="/embeds#customization">/embeds#customization</a>'],
				['Good digital citizen', '<a href="/publishers">/publishers</a> and <a href="/about">/about</a>']
			]}
		/>
	</div>
</Section>
