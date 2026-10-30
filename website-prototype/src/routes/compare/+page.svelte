<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Table from '#lib/components/Table.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import Button from '#lib/components/Button.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { competitors } from '#lib/data/compare.ts';

	const readers = competitors.filter((c) => c.kind === 'reader');
	const previews = competitors.filter((c) => c.kind === 'preview');
	const toCard = (c: (typeof competitors)[number]) => ({
		title: `Iframely vs ${c.name}`,
		text: c.oneLine,
		href: `/compare/${c.slug}`,
		cta: 'Compare'
	});
</script>

<PageMeta
	title="Compare Iframely with Firecrawl, Jina, Exa, Tavily, Embedly and Microlink | Iframely"
	description="Honest comparisons: where Iframely costs more, where it costs less, and the permissions and embed features the others do not sell."
/>

<Hero
	eyebrow="Compare"
	title="Where we win, where we do not"
	sub="Side by side with the readers and the preview APIs people evaluate us against. Prices from their public pages, dated. If another vendor is the better fit for your job, the page says so."
/>

<Section eyebrow="Readers for AI and agents" title="Iframely Data API against content readers">
	<Cards items={readers.map(toCard)} cols={4} />
</Section>

<Section tone="muted" eyebrow="Preview and embed APIs" title="Iframely against link-preview APIs">
	<Cards items={previews.map(toCard)} cols={2} />
</Section>

<Section eyebrow="Totals" title="Monthly cost for a preview workload">
	<Table
		head={['Requests a month', 'Iframely', 'Embedly', 'Microlink']}
		rows={[
			['25,000', '$49', '$133', '$49'],
			['100,000', '$149', '$204', '$151'],
			['500,000', '$399', '$584', '$535'],
			['1,000,000', '$899', '$1,060', '$1,070']
		]}
		caption="Iframely counts hits: repeat requests for the same URL within the hour are free, so bursty workloads cost less than shown. Prices read 2026-10."
	/>
</Section>

<Cta title="Run your own numbers" text="The calculator prices the same workload in hits and in requests.">
	<Button href="/pricing">Pricing and calculator</Button>
</Cta>
