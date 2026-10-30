<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Table from '#lib/components/Table.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { hitPlans, planCost, cheapestPlan, perRequestCost, usd, num } from '#lib/data/pricing.ts';

	let annual = $state(false);

	// Calculator inputs: what a buyer knows about their workload.
	let urls = $state(5000);
	let requestsPerUrl = $state(3);
	let viewsPerUrl = $state(40);
	let hoursPerDay = $state(4);
	let daysActive = $state(2);

	// A hit is one URL-hour of activity: all API calls and iframe views for a URL in one hour count once,
	// capped at 24 per URL per day. A URL cannot produce more hits than it has calls and views.
	const hitsPerUrl = $derived(
		Math.min(requestsPerUrl + viewsPerUrl, Math.min(hoursPerDay, 24) * Math.max(daysActive, 1))
	);
	const hits = $derived(Math.max(0, urls) * hitsPerUrl);
	const best = $derived(cheapestPlan(hits));
	const apiCalls = $derived(Math.max(0, urls) * requestsPerUrl);
	const perRequestMeta = $derived(perRequestCost(apiCalls, 0.5));

	function price(fee: number) {
		if (fee === 0) return { main: '$0', sub: 'free forever' };
		if (annual) return { main: usd((fee * 10) / 12), sub: `a month, billed ${usd(fee * 10)} a year` };
		return { main: usd(fee), sub: 'a month' };
	}

	function overageText(p: (typeof hitPlans)[number]) {
		return p.overage
			.map((t, i) =>
				t.upTo === Infinity
					? `${i ? 'then ' : ''}$${t.per1000.toFixed(2)} per 1,000`
					: `$${t.per1000.toFixed(2)} per 1,000 to ${num(t.upTo)}`
			)
			.join(', ');
	}

	const examples = [
		{
			title: 'A chat tool',
			text: '20,000 links shared a month. Each is unfurled when posted and again as people reply and scroll back: about 6 API calls in a burst over 2 hours on one day, no hosted iframes.',
			urls: 20000,
			req: 6,
			views: 0,
			hours: 2,
			days: 1
		},
		{
			title: 'A publisher archive',
			text: '2,000 new embeds a month in articles that are read for weeks. Each hosted iframe is viewed 300 times, spread over 8 hours a day for 30 days.',
			urls: 2000,
			req: 1,
			views: 300,
			hours: 8,
			days: 30
		}
	];

	function exampleHits(e: (typeof examples)[number]) {
		return e.urls * Math.min(e.req + e.views, Math.min(e.hours, 24) * e.days);
	}

	function load(e: (typeof examples)[number]) {
		urls = e.urls;
		requestsPerUrl = e.req;
		viewsPerUrl = e.views;
		hoursPerDay = e.hours;
		daysActive = e.days;
		document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<PageMeta
	title="Pricing: Data API per request, previews and embeds per hit | Iframely"
	description="Data API from $1.00 per 1,000 reads with 1,000 free a month. Preview and embed plans from $0, with 2,000 hits a month free. Calculator, annual billing and enterprise terms."
/>

<section class="border-b border-ink-100 bg-ink-50">
	<div class="wrap py-14 md:py-16">
		<h1 class="t-hero text-ink-950">Pricing</h1>
		<p class="mt-4 max-w-3xl text-lg text-ink-600">
			Pay per read when software processes URLs. Pay per hit when people see previews and embeds. Start free on both,
			in production.
		</p>
		<nav class="mt-6 flex flex-wrap gap-2 text-sm">
			<a href="#previews" class="rounded-full bg-white px-4 py-1.5 font-medium ring-1 ring-ink-200 hover:ring-brand-400"
				>Previews and embeds</a
			>
			<a href="#data-api" class="rounded-full bg-white px-4 py-1.5 font-medium ring-1 ring-ink-200 hover:ring-brand-400"
				>Data API for automated use</a
			>
			<a href="#calculator" class="rounded-full bg-white px-4 py-1.5 font-medium ring-1 ring-ink-200 hover:ring-brand-400"
				>Calculator</a
			>
		</nav>

		<div class="mt-8 grid gap-4 rounded-xl border border-brand-200 bg-white p-5 md:grid-cols-2">
			<div>
				<p class="text-sm font-semibold text-ink-950">What is a hit?</p>
				<p class="mt-1 text-[15px] text-ink-600">
					One hour of activity for one URL. Every API call and every hosted-iframe view of that URL in that hour counts
					once. A URL makes at most 24 hits a day. Typically 1 to 4 API calls or 5 to 15 iframe views make one hit.
				</p>
			</div>
			<div>
				<p class="text-sm font-semibold text-ink-950">What is a read?</p>
				<p class="mt-1 text-[15px] text-ink-600">
					One Data API request for one URL, in one declared processing mode. No hourly grouping: ten reads are ten
					reads. Whether failed fetches and blocked content are charged is still to be decided.
				</p>
			</div>
		</div>
	</div>
</section>

<Section id="previews" eyebrow="Previews and embeds" title="Plans by who you are">
	<div class="mb-6 flex items-center gap-3 text-sm">
		<span class={annual ? 'text-ink-500' : 'font-medium'}>Monthly</span>
		<button
			type="button"
			role="switch"
			aria-checked={annual}
			aria-label="Annual billing"
			onclick={() => (annual = !annual)}
			class="relative h-6 w-11 rounded-full transition {annual ? 'bg-fg' : 'bg-ink-300'}"
		>
			<span class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition {annual ? 'translate-x-5' : ''}"
			></span>
		</button>
		<span class={annual ? 'font-medium' : 'text-ink-500'}>Annual</span>
		<Badge tone="good">two months free</Badge>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each hitPlans as p (p.id)}
			{@const pr = price(p.fee)}
			<div class="flex flex-col rounded-xl border p-5 {p.id === 'product' ? 'border-brand-400 ring-1 ring-brand-200' : 'border-ink-100'}">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">{p.name}</h3>
					{#if p.formerly !== p.name}<span class="text-xs text-ink-400">was {p.formerly}</span>{/if}
				</div>
				<p class="mt-1 min-h-12 text-sm text-ink-600">{p.who}</p>
				<p class="mt-4 text-3xl font-semibold">{pr.main}</p>
				<p class="text-xs text-ink-500">{pr.sub}</p>
				<p class="mt-4 text-sm"><b>{num(p.included)}</b> hits a month included</p>
				<p class="mt-1 text-xs text-ink-500">Then {overageText(p)}</p>
				<ul class="mt-4 space-y-1.5 text-sm text-ink-700">
					{#each p.points as pt (pt)}<li class="flex gap-2"><span class="text-brand-600">✓</span>{pt}</li>{/each}
				</ul>
				<div class="mt-auto pt-5">
					<Button href="#signup" variant={p.id === 'product' ? 'primary' : 'secondary'} size="sm"
						>{p.fee === 0 ? 'Start free' : `Choose ${p.name}`}</Button
					>
				</div>
			</div>
		{/each}
	</div>
	<p class="mt-4 text-sm text-ink-600">
		Need prepaid hits for an agency or a seasonal launch? <a href="#packs" class="font-medium text-brand-700"
			>Prepaid packs</a
		> buy hits up front at a lower rate (terms to set).
	</p>
</Section>

<Section id="data-api" tone="muted" eyebrow="Data API for automated use" title="Per request, with the access decision included">
	<div class="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
		<Table
			head={['Unit', 'Free', 'Up to 100,000', '100,000 to 500,000', 'Above 500,000']}
			rows={[
				['Data API read, per 1,000<br><span class="text-xs font-normal text-ink-500">assist, discover, search, ai-input</span>', '1,000 a month', '$1.00', '$0.80', '$0.60'],
				['Metadata-only unfurl, per 1,000', 'in Starter hits', '$0.50', '$0.40', '$0.25'],
				['<code>ai-train</code>', '—', 'publisher opt-in only, by agreement', '', ''],
				['Agent-initiated payment, per read <span class="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">coming</span>', '—', '$0.01 per read, no account', '', '']
			]}
		/>
		<div class="space-y-4 text-ink-700">
			<p class="font-medium text-ink-950">What the money buys</p>
			<ul class="space-y-2 text-[15px]">
				<li>Markdown full text, entities and excerpt, where the publisher allows it</li>
				<li>The <code>access</code> decision with every result, for your audit log</li>
				<li>Requests signed with Web Bot Auth and allow-listed by named publishers</li>
				<li>1,900 providers and fourteen years of parser maintenance</li>
			</ul>
			<p class="text-sm text-ink-600">
				Prepaid packs for bursty workloads. Annual commits with true-up and the monthly compliance report on
				<a href="#enterprise" class="font-medium text-brand-700">Enterprise</a>.
			</p>
			<p class="text-sm text-ink-600">
				Against Firecrawl, Jina, Exa and Tavily: similar per-read price, and the only one that returns the publisher's
				permissions. <a href="/compare" class="font-medium text-brand-700">Compare readers →</a>
			</p>
		</div>
	</div>
</Section>

<Section id="calculator" eyebrow="Calculator" title="What will my workload cost?" intro="Enter what you know: URLs, calls and views. We turn them into hits and dollars.">
	<div class="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
		<form class="grid gap-4 sm:grid-cols-2" onsubmit={(e) => e.preventDefault()}>
			{#each [
				{ label: 'New URLs a month', get: () => urls, set: (v: number) => (urls = v), step: 100 },
				{ label: 'API calls per URL', get: () => requestsPerUrl, set: (v: number) => (requestsPerUrl = v), step: 1 },
				{ label: 'Hosted iframe views per URL', get: () => viewsPerUrl, set: (v: number) => (viewsPerUrl = v), step: 1 },
				{ label: 'Active hours a day per URL', get: () => hoursPerDay, set: (v: number) => (hoursPerDay = v), step: 1 },
				{ label: 'Days each URL stays active', get: () => daysActive, set: (v: number) => (daysActive = v), step: 1 }
			] as f (f.label)}
				<label class="text-sm">
					<span class="block font-medium text-ink-800">{f.label}</span>
					<input
						type="number"
						min="0"
						step={f.step}
						value={f.get()}
						oninput={(e) => f.set(Math.max(0, Number(e.currentTarget.value) || 0))}
						class="mt-1 w-full rounded-md border border-ink-200 px-3 py-2"
					/>
				</label>
			{/each}
			<p class="text-xs text-ink-500 sm:col-span-2">
				Hits per URL = the smaller of its calls plus views, or its active hours (max 24 a day) times its active days.
			</p>
		</form>

		<div class="grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border border-brand-300 bg-brand-50 p-5">
				<p class="text-sm text-ink-600">Hits a month</p>
				<p class="text-3xl font-semibold">{num(hits)}</p>
				<p class="mt-4 text-sm text-ink-600">Cheapest plan</p>
				<p class="text-xl font-semibold">{best.plan.name}: {usd(best.cost)}<span class="text-sm font-normal text-ink-500"> / month</span></p>
				<p class="mt-2 text-xs text-ink-500">
					{#each hitPlans as p (p.id)}{p.name} {usd(planCost(p, hits))}{p.id !== 'enterprise' ? ' · ' : ''}{/each}
				</p>
			</div>
			<div class="rounded-xl border border-ink-100 p-5">
				<p class="text-sm text-ink-600">Same workload, priced per request</p>
				<p class="text-3xl font-semibold">{num(apiCalls)}</p>
				<p class="text-xs text-ink-500">API calls a month</p>
				<p class="mt-4 text-xl font-semibold">{usd(perRequestMeta)}<span class="text-sm font-normal text-ink-500"> / month</span></p>
				<p class="mt-2 text-xs text-ink-500">
					At the metadata-only unfurl rate. Iframe views are not included: per-request pricing means you host the embed.
				</p>
			</div>
		</div>
	</div>

	<div class="mt-10 grid gap-4 md:grid-cols-2">
		{#each examples as e (e.title)}
			{@const h = exampleHits(e)}
			{@const b = cheapestPlan(h)}
			<div class="rounded-xl border border-ink-100 p-5">
				<h3 class="font-semibold">Worked example: {e.title}</h3>
				<p class="mt-2 text-[15px] text-ink-600">{e.text}</p>
				<p class="mt-3 text-sm">
					<b>{num(h)}</b> hits → {b.plan.name}, <b>{usd(b.cost)}</b> a month.
				</p>
				<button type="button" onclick={() => load(e)} class="mt-3 text-sm font-medium text-brand-700"
					>Load into the calculator →</button
				>
			</div>
		{/each}
	</div>
</Section>

<Section tone="muted" eyebrow="Compare plans" title="What differs between plans">
	<Table
		head={['', 'Starter', 'Product', 'Publisher', 'Enterprise']}
		rows={[
			['<span class="text-xs uppercase tracking-wide text-ink-400">Usage</span>', '', '', '', ''],
			['Brands', '1', '1', 'Multiple', 'Multiple'],
			['Production use', 'Yes', 'Yes', 'Yes', 'Yes'],
			['Rate limit', '10 requests/s', '50 requests/s', '50 requests/s', '50+ by quote'],
			['<span class="text-xs uppercase tracking-wide text-ink-400">Delivery</span>', '', '', '', ''],
			['"Powered by" icon on cards', 'Shown', 'Removed', 'Removed', 'Removed'],
			['Content IDs', '—', '✓', '✓', '✓'],
			['Caching delegation', '—', '—', '✓', '✓'],
			['White-label CDN, bring your own', '—', '—', '—', '✓'],
			['<span class="text-xs uppercase tracking-wide text-ink-400">Publisher features</span>', '', '', '', ''],
			['Compliance report for Data API reads', 'Summary', 'Summary', 'Monthly report', 'Monthly report and ledger'],
			['<span class="text-xs uppercase tracking-wide text-ink-400">Support</span>', '', '', '', ''],
			['Support', 'Help center', 'Email', 'Priority email', 'Priority, named contact']
		]}
	/>
	<p class="mt-4 text-sm text-ink-600">
		Everything else is included on every plan: all endpoints, 1,900 providers, cards, click-to-play, consent, lazy
		loading, options, the WordPress plugin. <a href="/embeds" class="font-medium text-brand-700">See all features →</a>
	</p>
</Section>

<Section id="enterprise" eyebrow="Enterprise and custom" title="Custom terms from $X a year">
	<div class="grid gap-8 lg:grid-cols-2">
		<div class="text-ink-700">
			<p>For platforms at volume, AI teams with legal review and anyone who needs it in writing.</p>
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
		Coming from Embedly? At 25,000 requests a month Iframely costs $49 against Embedly's $133; at 100,000, $149
		against $204; at 1 million, $899 against $1,060. Against Microlink and Peekalink the difference is the unit: hits
		group repeat requests, so URLs that are requested several times an hour cost less.
		<a href="/compare" class="font-medium text-brand-700">See the comparisons →</a>
	</p>
</Section>

<Section narrow eyebrow="FAQ" title="Questions about pricing">
	<Faq
		items={[
			{ q: 'What is a hit, exactly?', a: 'One hour of activity for one URL. All API calls and hosted-iframe views for that URL in the same hour count as one hit, with at most 24 hits per URL per day. Data API reads are counted per request instead.' },
			{ q: 'How are evergreen hosted embeds billed?', a: 'Each hour in which an embed is viewed is one hit, so an article read for months keeps counting. Publisher and Enterprise plans can delegate caching; ask us about a cap if you host a large archive.' },
			{ q: 'What counts as a Data API request?', a: 'One call to the Data API for one URL. Whether failed fetches, URLs blocked by robots.txt and content withheld by the publisher are charged is an open question in the plan. Metadata-only calls are charged at half the rate.' },
			{ q: 'Is AI use allowed?', a: 'Yes, through the Data API with a declared processing mode, under the <a href="#automated-processing">Automated Processing Terms</a>. The preview APIs are for showing links to people.' },
			{ q: 'What happens when I reach my limit?', a: 'Nothing breaks. Overage is billed at the end of the cycle, and a week before the invoice we email a projection and the plan that would cost less. Starter can be set to stop at the limit instead.' },
			{ q: 'What are the rate limits?', a: 'Listed per plan in the table above. Higher limits are available on Enterprise.' },
			{ q: 'Do you offer annual billing?', a: 'Yes: pay for ten months, get twelve. Prices are in USD.' },
			{ q: 'What if I cancel?', a: 'Your account drops to Starter. With Content IDs, hosted embeds keep working and can be exported, so your pages do not break.' },
			{ q: 'Is there a plan for people who just want an embed code?', a: 'Not yet. A no-code plan for site owners is planned; the free tools work without an account in the meantime.' }
		]}
	/>
	<p class="mt-6 text-sm text-ink-500">
		This page is also available as <a href="#pricing-md" class="underline">pricing.md</a> for agents and procurement tools.
	</p>
</Section>

<Cta title="Start free, in production" text="2,000 hits and 1,000 Data API reads a month, no card.">
	<Button href="#signup">Get an API key</Button>
	<Button href="#enterprise" variant="invert">Talk to us about Enterprise</Button>
</Cta>
