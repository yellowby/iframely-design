<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import CtaMark from '#lib/components/CtaMark.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Table from '#lib/components/Table.svelte';
	import {
		volumes,
		volumePrice,
		freeHits,
		paygPer1000,
		minVolume,
		enterpriseFrom,
		floorPer1000,
		customRate,
		customPrice,
		cheapestMonthly,
		usd,
		cents,
		rate,
		num
	} from '#lib/data/pricing.ts';

	// Content from the iframely-marketing demo site (demos/website, /pricing; plans/website/12-pricing-volumes.md), its
	// plan notes left out.
	// Annual billing: any number of hits a month.
	let custom = $state(75000);

	// Static examples: what typical setups pay on a monthly volume. Hits are worked out once here, not by the reader.
	const examples = [
		{ title: 'A chat tool', text: '20,000 links shared a month, each unfurled several times as people reply.', hits: 40000 },
		// About 30 hits per embed: hosted embeds read mostly in the first few days after publishing.
		{ title: 'A newsroom', text: '3,000 embeds a month in news articles, most read in the first few days.', hits: 90000 },
		{ title: 'An AI assistant', text: 'Users paste 50,000 links a month; each is read once through the Data API.', hits: 50000 }
	];

	// Feature matrix. A row with a single cell spans all four columns.
	const groups: { title: string; rows: { label: string; cells: string[] }[] }[] = [
		{
			title: 'Price and billing',
			rows: [
				{ label: 'Price', cells: ['$4 per 1,000 after 2,000 free', '$3.00 to $0.70 per 1,000, by volume', 'Any volume from 10,000; rate between the table rows', 'Above 2 million a month; toward $0.50 per 1,000'] },
				{ label: 'Billing', cells: ['Monthly, for what you used', 'Monthly, prepaid; overages monthly', 'Yearly, upfront; overages monthly', 'Contract and invoice'] },
				{ label: 'Unused hits', cells: ['—', 'Expire at the end of each month', 'Expire at the end of each month', 'By contract'] }
			]
		},
		{
			title: 'License and delivery',
			rows: [
				{ label: 'Domains', cells: ['One domain', 'Multiple brands', 'Multiple brands', 'Multiple brands'] },
				{ label: '"Powered by" icon on cards', cells: ['Shown', 'Removed', 'Removed', 'Removed'] },
				{ label: 'Content IDs: embeds that survive cancellation', cells: ['—', '—', '✓', '✓'] },
				{ label: 'Bring your own CDN, white label', cells: ['—', '—', '—', '✓'] }
			]
		},
		{
			title: 'Support',
			rows: [
				{ label: 'Chat support', cells: ['Off-peak hours', '✓', '✓', '✓'] },
				{ label: '99.9% uptime guarantee', cells: ['—', '✓', '✓', '✓'] },
				{ label: 'Custom parser requests', cells: ['—', '—', '✓', '✓'] },
				{ label: 'Priority change requests and a custom SLA', cells: ['—', '—', '—', '✓'] }
			]
		},
		{
			title: 'Features',
			rows: [{ label: 'Included everywhere', cells: ['1,900+ providers, URL metadata, the Data API, rich media embeds, cards and card design, hosted iframes, click-to-play, synchronized playback, friendly GIFs, user consent before third-party media, email support'] }]
		}
	];
	const matrix = groups.flatMap((g) => [
		[`<span class="text-xs uppercase tracking-wide text-ink-400">${g.title}</span>`, '', '', '', ''],
		...g.rows.map((r) => [r.label, ...r.cells])
	]);
</script>

<PageMeta
	title="Pricing: usage-based, 2,000 hits a month free | Iframely"
	description="One price list for the Preview API, Rich Media and the Data API. 2,000 hits a month free, monthly volumes from $30, any volume on annual billing, and you pay only for results."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-14 md:py-16">
		<h1 class="t-hero text-ink-950">Pricing</h1>
		<p class="mt-4 max-w-3xl text-lg text-ink-600">
			Usage-based pricing for the Preview API, Rich Media and the Data API. One price list, 2,000 hits a month free on
			every account.
		</p>
		<nav class="mt-6 flex flex-wrap gap-2 text-sm">
			{#each [['#volumes', 'Monthly volumes'], ['#calculator', 'Annual billing'], ['#compare', 'Compare'], ['#enterprise', 'Enterprise']] as [href, label] (href)}
				<a {href} class="rounded-full bg-white px-4 py-1.5 font-medium ring-1 ring-ink-200 hover:ring-brand-400">{label}</a>
			{/each}
		</nav>

		<div class="mt-8 grid gap-4 rounded-xl border border-brand-200 bg-white p-5 md:grid-cols-2">
			<div>
				<p class="text-sm font-semibold text-ink-950">A hit for the Preview API and Rich Media</p>
				<p class="mt-1 text-[15px] text-ink-600">
					One hour of activity for one URL. Every API call and every view of a hosted embed for that URL in that hour
					counts once, so repeat requests within the hour cost nothing extra.
				</p>
			</div>
			<div id="data-api" class="scroll-mt-24">
				<p class="text-sm font-semibold text-ink-950">A hit for the Data API</p>
				<p class="mt-1 text-[15px] text-ink-600">
					One request for one URL. It compares directly with services that charge per page or per request.
				</p>
			</div>
		</div>
	</div>
</section>

<Section id="volumes" eyebrow="Monthly volumes" title="The more you prepay, the lower the rate">
	<p class="max-w-3xl text-lg text-ink-700">
		2,000 hits a month are free. For more, subscribe to a monthly volume: the more hits you prepay, the lower the rate
		per 1,000. Every hit costs that rate, including hits above your volume.
	</p>

	<div class="mt-8 overflow-x-auto rounded-lg border border-ink-100 bg-white">
		<table class="w-full min-w-[32rem] text-left text-sm">
			<thead class="border-b border-ink-100 bg-ink-50 text-ink-600">
				<tr>
					<th class="px-4 py-2.5 font-medium">Monthly volume</th>
					<th class="px-4 py-2.5 text-right font-medium">Rate per 1,000 hits</th>
					<th class="px-4 py-2.5 text-right font-medium">Monthly price</th>
					<th class="px-4 py-2.5"><span class="sr-only">Subscribe</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-ink-100">
				{#each volumes as v (v.hits)}
					<tr>
						<td class="px-4 py-3 font-medium text-ink-950">{num(v.hits)} hits</td>
						<td class="px-4 py-3 text-right tabular-nums text-ink-700">{rate(v.per1000)}</td>
						<td class="px-4 py-3 text-right text-base font-semibold tabular-nums text-ink-950">{usd(volumePrice(v))}</td>
						<td class="px-4 py-3 text-right"><Button href="#signup" variant="secondary" size="sm">Subscribe</Button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="mt-3 text-sm text-ink-500">
		Volumes are on top of the {num(freeHits)} free hits. Hits above your volume cost your volume's rate; you can change the
		volume at any time.
	</p>

	<div class="mt-10 grid gap-4 md:grid-cols-3">
		<div class="rounded-xl border border-brand-200 bg-brand-50/60 p-5">
			<p class="font-semibold text-ink-950">You pay only for results</p>
			<p class="mt-2 text-[15px] text-ink-700">
				Errors are never billed, including pages that block us in robots.txt. Choose the embeds, cards or data you need;
				when a URL doesn't have them, you can receive an error instead, and that isn't billed either. Send us every link
				your users share, with no filtering on your side.
			</p>
		</div>
		<div class="rounded-xl border border-ink-100 bg-white p-5">
			<p class="font-semibold text-ink-950">Annual billing</p>
			<p class="mt-2 text-[15px] text-ink-700">
				Subscribe for a year and choose any number of hits a month. The rate changes evenly between the rows above. Enter
				it in the calculator and subscribe.
			</p>
			<a href="#calculator" class="mt-3 inline-block text-sm font-medium text-brand-700">Open the calculator →</a>
		</div>
		<div class="rounded-xl border border-ink-100 bg-white p-5">
			<p class="font-semibold text-ink-950">No subscription?</p>
			<p class="mt-2 text-[15px] text-ink-700">
				Pay as you go at {usd(paygPer1000)} per 1,000 hits, billed at the end of the month for what you used. Cards
				show the "Powered by" icon, and the license covers one domain; any volume removes the icon.
			</p>
			<p class="mt-3 text-sm text-ink-600">
				Above {num(enterpriseFrom / 1_000_000)} million hits a month, <a href="#enterprise" class="font-medium text-brand-700"
					>contact us</a
				>. Rates continue down toward {rate(floorPer1000)} per 1,000.
			</p>
		</div>
	</div>

	<h3 class="mt-12 text-lg font-semibold text-ink-950">What typical setups pay</h3>
	<div class="mt-4 grid gap-4 md:grid-cols-3">
		{#each examples as e (e.title)}
			{@const m = cheapestMonthly(e.hits)}
			<div class="rounded-xl border border-ink-100 bg-white p-5">
				<p class="font-semibold text-ink-950">{e.title}</p>
				<p class="mt-1 text-[15px] text-ink-600">{e.text}</p>
				<p class="mt-3 text-2xl font-semibold tabular-nums">{usd(m.cost)} <span class="text-sm font-normal text-ink-500">a month</span></p>
				<p class="text-xs text-ink-500">About {num(e.hits)} hits{m.volume ? ` on the ${num(m.volume.hits)} volume` : ''}</p>
			</div>
		{/each}
	</div>
</Section>

<Section id="calculator" tone="muted" eyebrow="Annual billing" title="Choose any number of hits a month">
	<div class="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
		<div>
			<label class="block text-sm">
				<span class="block font-medium text-ink-800">Hits a month, on top of the {num(freeHits)} free</span>
				<input
					type="number"
					min={minVolume}
					max={enterpriseFrom}
					step="1000"
					value={custom}
					oninput={(e) => (custom = Math.max(0, Number(e.currentTarget.value) || 0))}
					class="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-lg"
				/>
			</label>
			<!-- Log scale, so 10,000 to 100,000 gets as much of the track as 200,000 to 2 million. -->
			<input
				type="range"
				min={Math.log10(minVolume)}
				max={Math.log10(enterpriseFrom)}
				step="0.001"
				value={Math.log10(Math.min(Math.max(custom, minVolume), enterpriseFrom))}
				oninput={(e) => (custom = Math.round(10 ** Number(e.currentTarget.value) / 1000) * 1000)}
				aria-label="Hits a month"
				class="mt-4 w-full accent-brand-600"
			/>
			<p class="mt-3 text-sm text-ink-600">
				Hits above your volume are billed monthly at the same rate. Unused hits expire at the end of each month.
			</p>
		</div>

		<div class="rounded-xl border border-brand-300 bg-white p-6">
			{#if custom < minVolume}
				<p class="text-lg font-semibold">Annual billing starts at {num(minVolume)} hits a month.</p>
				<p class="mt-2 text-ink-600">
					Below that, pay as you go at {usd(paygPer1000)} per 1,000: {num(custom)} hits cost {cents(
						(custom / 1000) * paygPer1000
					)} a month.
				</p>
			{:else if custom > enterpriseFrom}
				<p class="text-lg font-semibold">Above {num(enterpriseFrom)} hits a month, talk to us.</p>
				<p class="mt-2 text-ink-600">Rates continue down toward {rate(floorPer1000)} per 1,000.</p>
				<div class="mt-4"><Button href="#enterprise">Contact sales</Button></div>
			{:else}
				<p class="text-sm text-ink-600">Your rate</p>
				<p class="text-3xl font-semibold tabular-nums">{rate(customRate(custom))} <span class="text-base font-normal text-ink-500">per 1,000 hits</span></p>
				<p class="mt-4 text-sm text-ink-600">Monthly price</p>
				<p class="text-3xl font-semibold tabular-nums">{cents(customPrice(custom))}</p>
				<p class="text-sm text-ink-500">{cents(customPrice(custom) * 12)} a year, billed annually</p>
				<div class="mt-5"><Button href="#signup">Subscribe for a year</Button></div>
			{/if}
		</div>
	</div>
</Section>

<Section id="compare" tone="muted" eyebrow="Compare" title="Pay as you go, monthly volumes, annual billing and Enterprise">
	<Table head={['', 'Pay as you go', 'Monthly volumes', 'Annual billing', 'Enterprise']} rows={matrix} />
</Section>

<Section id="enterprise" eyebrow="Enterprise" title="Above 2 million hits, or terms in writing">
	<div class="grid gap-8 lg:grid-cols-2">
		<div class="text-ink-700">
			<p>
				For platforms at volume, AI teams with legal review and anyone who needs it in writing. Rates continue down toward
				{rate(floorPer1000)} per 1,000.
			</p>
			<ul class="mt-4 grid gap-2 text-[15px] sm:grid-cols-2">
				{#each ['SOC 2 Type II report', 'SLA with credits', 'White-label CDN', 'Data-processing agreement', 'Optional EU residency', 'Data API compliance report', 'Annual commit with true-up', 'Flat or hybrid fee'] as item (item)}
					<li class="flex gap-2"><span class="text-brand-600">✓</span>{item}</li>
				{/each}
			</ul>
		</div>
		<div>
			<Placeholder label="Short form: name, work email, company, monthly volume, products of interest, message" class="h-64" />
		</div>
	</div>
</Section>

<Section tone="muted" narrow>
	<div class="flex flex-wrap justify-center gap-3 text-sm">
		{#each ['SOC 2 Type II', 'GDPR', '99.99% uptime', 'Since 2012', '6.5B requests a month'] as b (b)}
			<span class="rounded-md border border-ink-200 bg-white px-3 py-1.5 font-medium">{b}</span>
		{/each}
	</div>
	<p class="mt-6 text-center text-ink-600">
		Coming from Embedly? At 25,000 requests a month Iframely costs {usd(cheapestMonthly(25000).cost)} against Embedly's $133;
		at 100,000, {usd(cheapestMonthly(100000).cost)} against $204; at 1 million, {usd(cheapestMonthly(1000000).cost)} against
		$1,060. Against Microlink and Peekalink the difference is the unit: preview hits group repeat requests, so URLs that are
		requested several times an hour cost less.
		<a href="/compare" class="font-medium text-brand-700">See the comparisons →</a>
	</p>
</Section>

<Section narrow eyebrow="FAQ" title="Questions about pricing">
	<Faq
		items={[
			{ q: 'What is a hit, exactly?', a: 'For the Preview API and Rich Media, one hour of activity for one URL: all API calls and hosted-embed views for that URL in the same hour count as one hit, with at most 24 hits per URL per day. For the Data API, one request for one URL. Both count against the same volume at the same rate.' },
			{ q: 'What is not billed?', a: 'Errors, including HTTP errors and pages that block us in robots.txt. You also choose which embeds, cards or Data API parts (meta, links, entities, excerpt, full text) you need; when a URL has none of them, you can ask for an error instead, and it is not billed.' },
			{ q: 'What happens when I use more than my volume?', a: 'Nothing breaks. Extra hits cost the rate of the volume you chose and are billed at the end of the month. If you keep going over, move to a bigger volume for a lower rate; the change is prorated.' },
			{ q: 'How does annual billing work?', a: 'Subscribe for a year and choose any number of hits a month from 10,000 to 2 million, not only the volumes in the table. The rate is between the two nearest rows. You pay for the year upfront; hits above your volume are billed monthly at the same rate, and unused hits expire at the end of each month.' },
			{ q: 'Can I change my volume?', a: 'Yes, up or down at any time. On monthly volumes the change is prorated on your next bill.' },
			{ q: 'How are evergreen hosted embeds billed?', a: 'Each hour in which an embed is viewed is one hit, so an article read for months keeps counting. If you host a large archive, talk to us.' },
			{ q: 'Is AI use allowed?', a: 'Yes, through the Data API with a declared processing mode, under the <a href="#automated-processing">Automated Processing Terms</a>. The Preview API is for showing links to people.' },
			{ q: 'Is there a rate limit?', a: 'Our terms set a fair-use allowance of 50 requests per second. It isn\'t a technical cap: only traffic that repeatedly goes above it needs an Enterprise agreement.' },
			{ q: 'What if I cancel?', a: 'Your account returns to pay as you go, with 2,000 free hits a month. Hosted embeds made with Content IDs keep working and can be exported, so your pages do not break.' },
			{ q: 'Is there a plan for people who just want an embed code?', a: 'Not yet. A no-code plan for site owners is planned; the free tools work without an account in the meantime.' }
		]}
	/>
	<p class="mt-6 text-sm text-ink-500">
		This page is also available as <a href="#pricing-md" class="underline">pricing.md</a> for agents and procurement tools.
	</p>
</Section>

<!-- The closing block that was on the home page (the logo panel), in place of this page's own CTA band -->
<div class="my-24"><CtaMark /></div>
