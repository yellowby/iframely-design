<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';

	const roles = [
		['DevOps and AWS', 'Run the infrastructure behind 6.5 billion requests a month: AWS, CDNs, observability, on-call you can live with.'],
		['JavaScript engineer', 'Work on the open-source parsing engine and the APIs: Node.js, provider integrations, the Data API.'],
		['SEO and Growth', 'Own the site\'s organic traffic: the generator, 820 provider pages, docs, and the measurement behind them.'],
		['Support', 'Answer developers and publishers in writing, turn repeated questions into docs, and feed bugs to engineering.']
	];
</script>

<PageMeta
	title="Careers at Iframely: remote-first, Ottawa, Canada"
	description="Open roles at Iframely in DevOps and AWS, JavaScript, SEO and Growth, and Support. Remote-first, asynchronous, headquartered in Ottawa."
/>

<Hero
	eyebrow="Careers"
	title="Help keep the web's links working"
	sub="A small team serving 6,000 products. Remote-first and asynchronous, headquartered in Ottawa, Canada."
>
	<Button href="#roles">Open roles</Button>
	<Button href="/about" variant="secondary">About Iframely</Button>
	{#snippet after()}{/snippet}
</Hero>

<Section id="roles" eyebrow="Open roles" title="Ottawa, Canada, or remote">
	<div class="divide-y divide-ink-100 rounded-xl border border-ink-100">
		{#each roles as [title, text] (title)}
			<div class="flex flex-wrap items-start justify-between gap-4 p-5">
				<div class="max-w-2xl">
					<h3 class="font-semibold">{title}</h3>
					<p class="mt-1 text-ink-600">{text}</p>
				</div>
				<Button href="#apply" variant="secondary" size="sm">Apply</Button>
			</div>
		{/each}
	</div>
</Section>

<Section tone="muted" eyebrow="How we work" title="Asynchronous, written, owned">
	<div class="grid gap-6 md:grid-cols-3">
		<div>
			<h3 class="font-semibold">Asynchronous</h3>
			<p class="mt-2 text-ink-600">Few meetings. Decisions are written down so anyone, in any time zone, can follow them.</p>
		</div>
		<div>
			<h3 class="font-semibold">You take the lead</h3>
			<p class="mt-2 text-ink-600">Small team, real ownership. You will run something end to end in your first months.</p>
		</div>
		<div>
			<h3 class="font-semibold">Long-running</h3>
			<p class="mt-2 text-ink-600">An independent company since 2012. We build for the next ten years, not the next round.</p>
		</div>
	</div>
</Section>

<Section id="apply" eyebrow="Apply" title="Send us a note" narrow>
	<p class="mb-6 text-ink-700">Tell us which role, what you have built, and a link we can read. We reply to every application within two weeks.</p>
	<Placeholder label="Application form: name, email, role, links, short note, CV upload" class="aspect-[16/9]" />
</Section>
