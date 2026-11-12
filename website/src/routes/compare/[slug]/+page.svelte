<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Table from '#lib/components/Table.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { competitors } from '#lib/data/compare.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const c = $derived(data.competitor);
	const product = $derived(c.kind === 'reader' ? 'Iframely Data API' : 'Iframely');
	const others = $derived(competitors.filter((o) => o.kind === c.kind && o.slug !== c.slug));
</script>

<PageMeta
	title="Iframely vs {c.name}: {c.kind === 'reader'
		? 'price, permissions and compliance'
		: 'price, providers and hosted embeds'} compared | Iframely"
	description="An honest comparison of {product} and {c.name}: what each is good at, prices read 2026-10, and when to choose which."
/>

<Hero
	eyebrow="Compare"
	title="{product} vs {c.name}"
	sub="{c.name}: {c.oneLine} Here is what each does well, what each costs, and when you should pick the other one."
>
	<Button href="#table">See the table</Button>
	<Button href={c.kind === 'reader' ? '/data-api' : '/embeds'} variant="secondary">About {product}</Button>
</Hero>

<Section eyebrow="Short answer" title="When to choose which">
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">{c.name} is good at</h3>
			<ul class="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-600">
				{#each c.theyAreGoodAt as t (t)}<li>{t}</li>{/each}
			</ul>
		</div>
		<div class="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
			<h3 class="font-semibold">Choose Iframely when</h3>
			<ul class="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-700">
				{#each c.chooseIframelyWhen as t (t)}<li>{t}</li>{/each}
			</ul>
		</div>
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">Choose {c.name} when</h3>
			<ul class="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-600">
				{#each c.chooseThemWhen as t (t)}<li>{t}</li>{/each}
			</ul>
		</div>
	</div>
</Section>

<Section id="table" tone="muted" eyebrow="Side by side" title="{product} and {c.name}, feature by feature">
	<Table head={['', product, c.name]} rows={c.rows} caption={c.priceNote} />
</Section>

<Section eyebrow="More comparisons" title="Other {c.kind === 'reader' ? 'readers' : 'preview APIs'}">
	<Cards
		cols={others.length >= 3 ? 3 : 2}
		items={others.map((o) => ({ title: `Iframely vs ${o.name}`, text: o.oneLine, href: `/compare/${o.slug}`, cta: 'Compare' }))}
	/>
</Section>

<Cta title="Try it on your own URLs" text="Free tier, no card. Run the same URLs through both and compare.">
	<Button href="#signup">Get an API key</Button>
	<Button href="/pricing" variant="invert">Pricing and calculator</Button>
</Cta>
