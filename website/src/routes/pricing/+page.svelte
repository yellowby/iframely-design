<script lang="ts">
	import Button from '#lib/components/Button.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { PANEL } from '#lib/card.ts';
	import LogoWall from '#lib/components/LogoWall.svelte';
	import {
		volumes,
		volumePrice,
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

	// Copy and blocks from the pricing page of the iframely-marketing demo site (its second variant: the volume picker
	// over three plan cards), set in this site's type roles, cards and colours. Numbers come from lib/data/pricing.ts.

	// The picker. The slider runs over ten stops: below 10,000, the eight monthly volumes, above 2 million.
	// Monthly billing snaps to a stop; annual billing takes any amount, so the slider moves freely between the stops
	// (evenly on a log scale between two volumes) and the amount can be typed.
	const STOPS = ['<10K', '10K', '20K', '50K', '100K', '200K', '500K', '1M', '2M', '2M+'];
	const LAST = STOPS.length - 1;
	let billing = $state<'monthly' | 'annual'>('monthly');
	let pos = $state(1);

	const hitsAt = (p: number) => {
		const i = Math.floor(p), f = p - i, a = volumes[i - 1].hits;
		return f ? Math.round((a * (volumes[i].hits / a) ** f) / 1000) * 1000 : a;
	};
	const posOf = (hits: number) => {
		if (hits < minVolume) return 0;
		if (hits > enterpriseFrom) return LAST;
		const i = Math.max(1, volumes.findIndex((v) => v.hits >= hits));
		const a = volumes[i - 1].hits, b = volumes[i].hits;
		return i + Math.log(hits / a) / Math.log(b / a);
	};

	const fit = $derived(pos < 1 ? 'payg' : pos > LAST - 1 ? 'ent' : 'vol');
	// the amount the cards are priced for: the picked one, or the nearest end of the price list
	const hits = $derived(hitsAt(Math.min(Math.max(pos, 1), LAST - 1)));
	const volume = $derived(volumes.find((v) => v.hits >= hits) ?? volumes[volumes.length - 1]);
	// annual billing with an amount inside the price list: the amount can be typed and is named under the thumb
	const free = $derived(billing === 'annual' && fit === 'vol');
	const picked = $derived(fit === 'payg' ? `Under ${num(minVolume)}` : fit === 'ent' ? `Above ${num(enterpriseFrom)}` : num(hits));

	function setBilling(b: 'monthly' | 'annual') {
		billing = b;
		if (b === 'monthly') pos = Math.round(pos);
	}

	const examples = [
		{ title: 'A chat tool', text: '20,000 links shared a month, each unfurled several times as people reply.', hits: 40000 },
		{ title: 'A newsroom', text: '3,000 embeds a month in news articles, most read in the first few days.', hits: 90000 },
		{ title: 'An AI assistant', text: 'Users paste 50,000 links a month; each is read once through the Data API.', hits: 50000 }
	];


	const results: [string, string][] = [
		['Errors are free', 'Errors are never billed, including pages that block us in robots.txt.'],
		['You decide what counts', "Pick the embeds, cards or data you need. If a URL doesn't have them, you receive an error, and that isn't billed either."],
		['No filtering on your side', 'Send us every link your users share, with no filtering on your side.'],
		['Nothing breaks when you go over', 'Extra hits cost the rate of the volume you chose and are billed at the end of the month.'],
		['Lower rates at higher volumes', `From ${rate(volumes[0].per1000)} per 1,000 at ${num(minVolume)} hits a month down to ${rate(volumes[volumes.length - 1].per1000)} at 2 million.`],
		['Change volume any time', 'Up or down. Monthly volumes are prorated on your next bill.']
	];

	// The comparison. A cell is '✓', '—' or [text, a second line]; `tip` is the note behind the row's name.
	type Cell = string | [string, string];
	const Y = '✓', N = '—';
	const all = (label: string) => ({ label, cells: [Y, Y, Y, Y] as Cell[] });
	const groups: { title: string; rows: { label: string; tip?: string; cells: Cell[] }[] }[] = [
		{
			title: 'Price and billing',
			rows: [
				{
					label: 'Price',
					cells: [
						['$4 per 1,000', 'After 2,000 free a month'],
						['$3.00 to $0.70 per 1,000', 'Lower at higher volumes'],
						['Any volume from 10,000', 'Priced between volumes'],
						['Down to $0.50 per 1,000', 'Above 2 million a month']
					]
				},
				{
					label: 'Billing',
					cells: [
						['Monthly', 'For what you used'],
						['Monthly, prepaid', 'Overages billed monthly'],
						['Yearly, upfront', 'Overages billed monthly'],
						['Contract', 'Paid by invoice']
					]
				},
				{
					label: 'Unused hits',
					tip: "A hit is one hour of activity for one URL in previews and embeds, or one Data API request. Hits you don't use in a month don't carry over.",
					cells: [N, 'Expire each month', 'Expire each month', 'By contract']
				}
			]
		},
		{
			title: 'License and delivery',
			rows: [
				{
					label: 'Domains',
					tip: 'One domain: one website or app in production. Multiple brands: several sites or customer brands on one account. Sites that share one content database count as one.',
					cells: ['One domain', 'Multiple brands', 'Multiple brands', 'Multiple brands']
				},
				{ label: '"Powered by" icon on cards', cells: ['Shown', 'Removed', 'Removed', 'Removed'] },
				{
					label: 'Content IDs',
					tip: "Permanent IDs for your hosted embeds. Embeds survive cancellation: they keep working, and can be exported, even after you cancel, so your pages don't break.",
					cells: [N, N, Y, Y]
				},
				{
					label: 'White label and CDN',
					tip: "Hosted embeds and interactives load from your own CDN and domain instead of iframely.net, so you control your users' privacy yourself.",
					cells: [N, N, N, Y]
				}
			]
		},
		{
			title: 'Support',
			rows: [
				{ label: 'Chat support', cells: ['Off-peak hours', Y, Y, Y] },
				{ label: '99.9% uptime guarantee', cells: [N, Y, Y, Y] },
				{
					label: 'Custom parser requests',
					tip: "Ask us to add or fix support for a site your users link to, when its previews or embeds don't come through as they should.",
					cells: [N, N, Y, Y]
				},
				{
					label: 'Custom SLA',
					tip: 'A service level agreement written into your contract, with priority change requests: your fixes and parser requests go first.',
					cells: [N, N, N, Y]
				}
			]
		},
		{
			title: 'Included in every plan',
			rows: ['1,900+ providers', 'URL metadata', 'The Data API', 'Rich media embeds', 'Cards and card design', 'Hosted iframes', 'Click-to-play', 'Synchronized playback', 'Friendly GIFs', 'Consent before third-party media', 'Email support'].map(all)
		}
	];
	const plans: [string, string, string][] = [
		['Pay as you go', 'Start free', '#signup'],
		['Monthly volume', 'Subscribe', '#signup'],
		['Annual volume', 'Subscribe', '#signup'],
		['Enterprise', 'Talk to us', '#enterprise']
	];

	const enterprise = ['SOC 2 Type II report', 'Data-processing agreement', 'Optional EU residency', 'Data API compliance report', 'SLA with credits', 'White-label CDN', 'Annual commit with true-up', 'Flat or hybrid fee'];

	// "What's a hit?": the same 25 requests over three hours, counted both ways
	const HOURS: [string, number][] = [['10 AM', 8], ['11 AM', 9], ['12 PM', 8]];

	const FIELD = 't-note mt-1.5 block w-full rounded-lg bg-white px-3.5 py-2.5 text-fg ring-1 ring-black/12 ring-inset placeholder:text-ink-400 focus:ring-blue focus:outline-none';
</script>

<PageMeta
	title="Pricing: usage-based, 2,000 hits a month free | Iframely"
	description="One price list for the Preview API, Rich Media and the Data API. 2,000 hits a month free, monthly volumes from $30, any volume on annual billing, and you pay only for results."
/>

{#snippet check()}
	<svg class="inline-block shrink-0 text-blue" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-label="Included"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>
{/snippet}

{#snippet features(items: string[])}
	<ul class="t-small mt-7 space-y-2 text-body">
		{#each items as item (item)}
			<li class="flex items-start gap-2.5"><span class="mt-1 flex">{@render check()}</span>{item}</li>
		{/each}
	</ul>
{/snippet}

{#snippet best(on: boolean)}
	{#if on}<span class="t-tag badge rounded-full bg-blue px-2.5 py-1.5 text-[12px]! leading-none! text-white">Best fit</span>{/if}
{/snippet}

<!-- Hero, the picker and the three plans -->
<section class="wrap pt-20">
	<div class="max-w-3xl">
		<h1 class="t-hero text-fg">The more you prepay, <span class="block text-blue">the lower the rate</span></h1>
		<p class="t-lead mt-4 max-w-[720px] text-pretty text-mute">
			Usage-based pricing for the Preview API, Rich Media and the Data API.
			<span class="sm:block">One price list, 2,000 hits a month free on every account.</span>
		</p>
	</div>

	<!-- billing: two radio buttons over the picker -->
	<fieldset class="mt-14 flex flex-wrap gap-x-7 gap-y-2">
		<legend class="sr-only">Billing</legend>
		{#each [['monthly', 'Monthly volume'], ['annual', 'Annual volume · any amount']] as const as [id, label] (id)}
			<label class="t-label flex cursor-pointer items-center gap-2 {billing === id ? 'font-medium text-fg' : 'text-mute hover:text-fg'}">
				<input type="radio" name="billing" checked={billing === id} onchange={() => setBilling(id)} class="size-[18px] accent-blue" />
				{label}
			</label>
		{/each}
	</fieldset>

	<!-- the picker: a grey panel with the question, a track in nine pieces (one between each two stops) and the stops
	     named under it, the picked one in a blue pill -->
	<div class="{PANEL} mt-5 px-7 pt-4 pb-6">
		<div class="flex min-h-10 flex-wrap items-center justify-between gap-x-8 gap-y-2">
			<!-- the amount as a sentence, its number in a pill; on annual billing the pill is a field to type any amount in -->
			<p class="t-body flex flex-wrap items-center gap-2 text-[17px]! leading-[1.2]! font-medium text-fg">
				I need
				{#if billing === 'annual' && fit === 'vol'}
					<label class="flex cursor-text items-center gap-1.5 rounded-full bg-white px-3 py-1 text-blue shadow-[0_0_0_4px_rgb(0_85_255/0.1)] ring-1 ring-blue ring-inset focus-within:ring-2">
						<input
							type="text"
							inputmode="numeric"
							style:width="{num(hits).length - 0.6}ch"
							value={num(hits)}
							onchange={(e) => (pos = posOf(Number(e.currentTarget.value.replace(/\D/g, '')) || 0))}
							onkeydown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
							aria-label="Hits a month, type any number"
							class="bg-transparent font-medium tabular-nums focus:outline-none"
						/>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.8 2.6l2.6 2.6-7.6 7.6-3.2.6.6-3.2z" /></svg>
					</label>
				{:else}
					<span class="rounded-full bg-blue/10 px-3 py-1 text-blue tabular-nums">{fit === 'payg' ? `under ${num(minVolume)}` : fit === 'ent' ? `${num(enterpriseFrom)}+` : num(hits)}</span>
				{/if}
				hits a month
			</p>
			<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
				<a href="#hit" class="t-small flex items-center gap-1.5 text-body underline decoration-ink-400 decoration-dotted underline-offset-4 hover:text-blue">
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 7.4v3.4M8 5.2v.1" /></svg>
					What's a hit?
				</a>
			</div>
		</div>
		<!-- the pieces and the names are inset by half a thumb, so each name sits under its stop -->
		<div class="relative mt-4 h-5">
			<div class="absolute inset-x-[10px] top-1/2 flex -translate-y-1/2 gap-1" aria-hidden="true">
				{#each { length: LAST } as _, i (i)}
					<span class="h-1 flex-1 overflow-hidden rounded-full bg-black/8"
						><i class="block h-full bg-brand-300" style:width="{Math.min(Math.max(pos - i, 0), 1) * 100}%"></i></span
					>
				{/each}
			</div>
			<input
				id="hits"
				type="range"
				min="0"
				max={LAST}
				step={billing === 'monthly' ? 1 : 0.01}
				bind:value={pos}
				aria-label="Hits a month"
				aria-valuetext="{picked} hits a month"
				class="slider absolute inset-0 w-full"
			/>
		</div>
		<div class="relative mx-[10px] mt-2.5 h-6" aria-hidden="true">
			<!-- on annual billing the picked amount is named in full under the thumb, over the stop names next to it -->
			{#each STOPS as s, i (s)}
				<button
					type="button"
					tabindex="-1"
					onclick={() => (pos = i)}
					style:left="{(i / LAST) * 100}%"
					class="t-small absolute -translate-x-1/2 cursor-pointer rounded-full px-2 leading-6! whitespace-nowrap {free
						? Math.abs(pos - i) < 0.55 ? 'opacity-0' : 'text-body hover:text-fg'
						: Math.round(pos) === i ? 'bg-blue font-medium text-white' : 'text-body hover:text-fg'} {i % 2 ? 'max-sm:hidden' : ''}">{s}</button
				>
			{/each}
			{#if free}
				<span style:left="{(pos / LAST) * 100}%" class="t-small absolute -translate-x-1/2 rounded-full bg-blue px-2 leading-6! font-medium whitespace-nowrap text-white tabular-nums">{num(hits)}</span>
			{/if}
		</div>
	</div>

	<div class="mt-5 grid gap-5 lg:grid-cols-3">
		<div class="{PANEL} flex flex-col p-7 {fit === 'payg' ? 'fit' : ''}">
			<div class="flex min-h-7 items-center justify-between gap-3">
				<h2 class="t-body font-medium text-fg">Pay as you go</h2>
				{@render best(fit === 'payg')}
			</div>
			<p class="t-small mt-1 text-mute">Free to start</p>
			<p class="price plan mt-6 text-fg">$0<span class="unit">/mo</span></p>
			<p class="t-label mt-4 border-t border-black/8 pt-4 text-body">{usd(paygPer1000)} per 1,000 after 2,000 free</p>
			<p class="t-small mt-1 text-mute">
				{#if fit === 'payg'}Under {num(minVolume)} hits cost less than {usd((minVolume / 1000) * paygPer1000)} a month.{:else}{num(hits)} hits would cost {usd((hits / 1000) * paygPer1000)} a month.{/if}
			</p>
			<div class="mt-7"><Button href="#signup" variant={fit === 'payg' ? 'primary' : 'secondary'}>Start free</Button></div>
			{@render features(['One domain', 'Iframely icon on cards', 'Chat support in off-peak hours', 'Errors are never billed'])}
		</div>

		<!-- the volume plan on the brand blue, Enterprise on black, both with white ink (.inv) -->
		<div class="{PANEL} inv flex flex-col bg-blue! p-7 {fit === 'vol' ? 'fit' : ''}">
			<div class="flex min-h-7 items-center justify-between gap-3">
				<h2 class="t-body font-medium text-fg">{billing === 'monthly' ? 'Monthly volume' : 'Annual volume'}</h2>
				{@render best(fit === 'vol')}
			</div>
			{#if billing === 'monthly'}
				<p class="t-small mt-1 text-mute">Billed monthly · {num(volume.hits)} hits</p>
				<p class="price plan mt-6 text-fg">{usd(volumePrice(volume))}<span class="unit">/mo</span></p>
				<p class="t-label mt-4 border-t border-black/8 pt-4 text-body">{rate(volume.per1000)} per 1,000 hits</p>
				<p class="t-small mt-1 text-mute">Extra hits at the same rate.</p>
				<div class="mt-7"><Button href="#signup" variant="invert">Subscribe monthly</Button></div>
			{:else}
				<p class="t-small mt-1 text-mute">Billed yearly · {num(hits)} hits a month</p>
				<p class="price plan mt-6 text-fg">{usd(customPrice(hits))}<span class="unit">/mo</span></p>
				<p class="t-label mt-4 border-t border-black/8 pt-4 text-body">{rate(customRate(hits))} per 1,000 hits</p>
				<p class="t-small mt-1 text-mute">{cents(customPrice(hits) * 12)} a year, paid upfront.</p>
				<div class="mt-7"><Button href="#signup" variant="invert">Subscribe for a year</Button></div>
			{/if}
			{@render features(['Multiple domains', 'No Iframely icon on cards', 'Chat support', '99.9% uptime guarantee'])}
		</div>

		<div class="{PANEL} inv flex flex-col bg-fg! p-7 {fit === 'ent' ? 'fit' : ''}">
			<div class="flex min-h-7 items-center justify-between gap-3">
				<h2 class="t-body font-medium text-fg">Enterprise</h2>
				{@render best(fit === 'ent')}
			</div>
			<p class="t-small mt-1 text-mute">Above 2 million hits</p>
			<p class="price plan mt-6 text-fg">Custom</p>
			<p class="t-label mt-4 border-t border-black/8 pt-4 text-body">Down to {rate(floorPer1000)} per 1,000 hits</p>
			<p class="t-small mt-1 text-mute">Signed contract, paid by invoice.</p>
			<div class="mt-7"><Button href="#enterprise" variant="invert">Talk to us</Button></div>
			{@render features(['White label', 'Bring your own CDN', 'Priority change requests', 'Custom SLA', 'Content IDs and custom parsers'])}
		</div>
	</div>
</section>

<!-- What's a hit? -->
<section id="hit" class="wrap scroll-mt-[calc(var(--header-h)+24px)] pt-24">
	<h2 class="t-h2 text-fg">What's a hit?</h2>
	<div class="mt-10 grid gap-5 md:grid-cols-2">
		{#each [['Preview API and Rich Media', 'One hit per URL per hour. Repeat API calls and embed views within that hour cost nothing extra.', true], ['Data API', 'One hit per request. Easy to compare with per-page or per-request pricing.', false]] as const as [title, text, hourly] (title)}
			<div class="{PANEL} flex flex-col overflow-hidden">
				<div class="grow p-8 pb-6">
					<h3 class="t-body font-medium text-fg">{title}</h3>
					<p class="t-note mt-2 max-w-[440px] text-mute">{text}</p>
				</div>
				<!-- three hours of requests for one URL: a bar is a request, a blue bar a billed hit -->
				<div class="bg-[#f2f2f2] px-8 py-7">
					<div class="grid grid-cols-3 gap-px">
						{#each HOURS as [hour, n] (hour)}
							<div class="border-l border-black/15 pl-3">
								<p class="font-mono text-[12px] leading-none text-mute">{hour}</p>
								<div class="mt-4 flex h-8 items-end gap-[3px]">
									{#each { length: n } as _, i (i)}
										<i class="h-full w-[5px] rounded-[1px] {!hourly || !i ? 'bg-blue' : 'bg-black/15'}"></i>
									{/each}
								</div>
							</div>
						{/each}
					</div>
					<p class="mt-6 flex items-baseline justify-between font-mono text-[12px] leading-none text-mute">
						<span>10 AM – 1 PM · 25 requests</span>
						<span>hits <b class="ml-1 text-[18px] font-medium text-blue">{hourly ? HOURS.length : 25}</b></span>
					</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- What typical setups pay -->
<section class="wrap pt-24">
	<h2 class="t-h2 text-fg">What typical setups pay</h2>
	<div class="mt-10 grid gap-5 md:grid-cols-3">
		{#each examples as e (e.title)}
			{@const m = cheapestMonthly(e.hits)}
			<div class="{PANEL} flex flex-col p-7">
				<h3 class="t-body font-medium text-fg">{e.title}</h3>
				<p class="t-note mt-2 text-mute">{e.text}</p>
				<p class="price mt-auto pt-8 text-fg" style:font-size="40px">{usd(m.cost)}<span class="unit">/mo</span></p>
				<p class="mt-3 font-mono text-[12px] text-mute">About {num(e.hits)} hits{m.volume ? ` on the ${num(m.volume.hits)} volume` : ''}</p>
			</div>
		{/each}
	</div>

	<!-- who relies on it, and the numbers -->
	<div class="mt-16">
		<p class="t-label mb-4 text-faint">Trusted by products where real people share URLs</p>
		<LogoWall />
	</div>
</section>

<!-- You pay only for results -->
<section class="wrap pt-24">
	<h2 class="t-h2 text-fg">You pay only for results</h2>
	<div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each results as [title, text], i (title)}
			<div class="{PANEL} flex flex-col p-7">
				<h3 class="t-body font-medium text-fg">{title}</h3>
				<p class="t-note mt-2 text-mute">{text}</p>
				{#if !i}
					<p class="mt-auto flex items-center gap-2.5 pt-6 font-mono text-[12px] leading-none whitespace-nowrap text-mute">
						<span class="truncate">example.com/old-page</span>
						<span class="rounded-sm bg-black/7 px-1.5 py-[3px] font-semibold text-body">404</span>
						<span class="ml-auto text-blue">Not billed</span>
					</p>
				{/if}
			</div>
		{/each}
	</div>
</section>

<!-- The comparison -->
<section id="compare" class="wrap scroll-mt-[calc(var(--header-h)+24px)] pt-24">
	<h2 class="t-h2 max-w-2xl text-fg">Pay as you go, monthly volumes, annual billing and Enterprise</h2>
	<div class="{PANEL} mt-10 overflow-x-auto">
		<table class="t-note w-full min-w-[52rem] border-collapse text-left">
			<thead>
				<tr class="border-b border-black/8">
					<th class="w-[26%] px-6 py-5"><span class="sr-only">Plan</span></th>
					{#each plans as [name], i (name)}
						<th class="t-body w-[18.5%] px-4 py-5 font-medium text-fg {i === 1 ? 'tint' : ''}">{name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each groups as g (g.title)}
					<tr>
						<th scope="colgroup" class="t-tag px-6 pt-8 pb-3 text-[12px]! text-blue">{g.title}</th>
						{#each plans as [name], i (name)}<td class={i === 1 ? 'tint' : ''}></td>{/each}
					</tr>
					{#each g.rows as r (r.label)}
						<tr class="border-t border-black/6 align-top">
							<th scope="row" class="px-6 py-3 font-normal text-body">
								{#if r.tip}
									<button type="button" class="tip">{r.label}<span role="tooltip">{r.tip}</span></button>
								{:else}{r.label}{/if}
							</th>
							{#each r.cells as c, i (i)}
								<td class="px-4 py-3 text-fg {i === 1 ? 'tint' : ''}">
									{#if c === Y}{@render check()}
									{:else if c === N}<span class="text-ink-300" aria-label="Not included">—</span>
									{:else if typeof c === 'string'}{c}
									{:else}{c[0]}<span class="t-small block text-mute">{c[1]}</span>{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/each}
				<tr class="border-t border-black/6">
					<td></td>
					{#each plans as [name, label, href], i (name)}
						<td class="px-4 py-6 {i === 1 ? 'tint' : ''}"><Button {href} size="sm" variant={i === 1 ? 'primary' : 'secondary'}>{label}</Button></td>
					{/each}
				</tr>
			</tbody>
		</table>
	</div>
</section>

<!-- Enterprise -->
<section id="enterprise" class="wrap scroll-mt-[calc(var(--header-h)+24px)] pt-24">
	<div class="grid gap-x-16 gap-y-10 rounded-xl bg-rule p-7 md:p-12 lg:grid-cols-2">
		<div>
			<p class="t-tag text-blue">Enterprise</p>
			<h2 class="t-h2 mt-5 text-fg">Above 2 million hits, or terms in writing</h2>
			<p class="t-body mt-4 max-w-[420px] text-body">For platforms at volume, AI teams with legal review and anyone who needs it in writing.</p>
			<div class="mt-9 border-t border-black/10 pt-8">
				<p class="price text-fg" style:font-size="40px">{rate(floorPer1000)}<span class="unit">/1,000 hits</span></p>
				<p class="t-note mt-3 text-mute">The lowest rate. Signed contract, paid by invoice.</p>
				<ul class="t-note mt-8 grid gap-x-8 gap-y-2.5 text-body sm:grid-cols-2">
					{#each enterprise as item (item)}
						<li class="flex items-start gap-2.5"><span class="mt-1 flex">{@render check()}</span>{item}</li>
					{/each}
				</ul>
			</div>
		</div>

		<form class="{PANEL} p-7" onsubmit={(e) => e.preventDefault()}>
			<h3 class="t-body font-medium text-fg">Get a real quote, not a sales deck</h3>
			<div class="mt-6 space-y-5">
				<label class="t-small block text-body">Work email<input type="email" name="email" required placeholder="you@company.com" class={FIELD} /></label>
				<label class="t-small block text-body">Company website<input type="text" name="website" placeholder="company.com" class={FIELD} /></label>
				<label class="t-small block text-body"
					>Hits a month
					<select name="hits" class={FIELD}>
						{#each ['2–10 million', '10–50 million', '50–200 million', '200 million+', 'Not sure yet'] as o (o)}<option>{o}</option>{/each}
					</select>
				</label>
				<label class="t-small block text-body"
					>What are you building? <span class="text-mute">optional</span>
					<textarea name="about" rows="3" placeholder="Link previews in a chat app, embeds across a news archive, page data for an AI agent…" class={FIELD}></textarea>
				</label>
			</div>
			<p class="prose-links mt-5 text-[12px] leading-[1.5] text-mute">
				By submitting this form you agree to our <a href="#privacy-policy" class="underline">privacy policy</a>. For more
				information on how your personal data will be processed, please read our
				<a href="#privacy-statement" class="underline">privacy statement</a>. We will not share your information with third
				parties.
			</p>
			<button type="submit" class="t-button mt-5 inline-flex cursor-pointer items-center rounded-full bg-fg px-5 py-2 text-white transition-colors hover:bg-body">Send</button>
		</form>
	</div>
</section>

<!-- FAQ -->
<section id="faq" class="wrap scroll-mt-[calc(var(--header-h)+24px)] py-24">
	<div class="grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.5fr]">
		<div>
			<h2 class="t-h2 text-fg">Frequently asked questions</h2>
			<p class="t-note mt-4 text-mute">
				This page is also available as <a href="#pricing-md" class="text-blue underline-offset-4 hover:underline">pricing.md</a> for agents and
				procurement tools.
			</p>
		</div>
		<Faq
			items={[
				{ q: 'What is a hit, exactly?', a: 'For the Preview API and Rich Media, one hour of activity for one URL: all API calls and hosted-embed views for that URL in the same hour count as one hit, with at most 24 hits per URL per day. For the Data API, one request for one URL. Both count against the same volume at the same rate.' },
				{ q: 'What is not billed?', a: 'Errors, including HTTP errors and pages that block us in robots.txt. You also choose which embeds, cards or Data API parts (meta, links, entities, excerpt, full text) you need; when a URL has none of them, you can ask for an error instead, and it is not billed.' },
				{ q: 'What happens when I use more than my volume?', a: 'Nothing breaks. Extra hits cost the rate of the volume you chose and are billed at the end of the month. If you keep going over, move to a bigger volume for a lower rate; the change is prorated.' },
				{ q: 'How does annual billing work?', a: 'Subscribe for a year and choose any number of hits a month from 10,000 to 2 million, not only the volumes in the table. The rate is between the two nearest rows. You pay for the year upfront; hits above your volume are billed monthly at the same rate, and unused hits expire at the end of each month.' },
				{ q: 'Can I change my volume?', a: 'Yes, up or down at any time. On monthly volumes the change is prorated on your next bill.' },
				{ q: 'How are evergreen hosted embeds billed?', a: 'Each hour in which an embed is viewed is one hit, so an article read for months keeps counting. If you host a large archive, talk to us.' },
				{ q: 'Is AI use allowed?', a: 'Yes, through the Data API with a declared processing mode, under the <a href="#automated-processing">Automated Processing Terms</a>. The Preview API is for showing links to people.' },
				{ q: 'Is there a rate limit?', a: "Our terms set a fair-use allowance of 50 requests per second. It isn't a technical cap: only traffic that repeatedly goes above it needs an Enterprise agreement." },
				{ q: 'What if I cancel?', a: 'Your account returns to pay as you go, with 2,000 free hits a month. Hosted embeds made with Content IDs keep working and can be exported, so your pages do not break.' },
				{ q: 'Is there a plan for people who just want an embed code?', a: 'Not yet. A no-code plan for site owners is planned; the free tools work without an account in the meantime.' }
			]}
		/>
	</div>
</section>


<style>
	/* the price figure, as in the home page's pricing block (PricingBlock.svelte) */
	.price {
		display: flex;
		align-items: baseline;
		font-family: var(--ff-heading);
		font-size: 56px;
		line-height: 1;
		letter-spacing: -0.035em;
	}
	.unit {
		margin-left: 4px;
		font-family: var(--ff-base);
		font-size: 18px;
		letter-spacing: 0;
		color: var(--color-mute);
	}

	/* in the plan cards the figure is smaller, with its unit at the same size in a lighter ink, over a hairline */
	.price.plan {
		font-size: 32px;
	}
	.price.plan .unit {
		margin-left: 2px;
		font-size: 28px;
		opacity: 0.6;
	}
	.inv :global(p.border-t) {
		border-color: rgb(255 255 255 / 0.2);
		color: #fff;
	}

	/* the plan that fits the picked amount: the card's border in blue with the hover ring of the site's cards */
	.fit {
		box-shadow: 0 0 0 3px rgb(0 85 255 / 0.12);
	}
	.fit::after {
		border-color: var(--color-blue);
	}

	/* a plan card on a colour: white ink, the second lines and the unit in a lighter white, a white badge */
	.inv :global(:is(h2, .price, li, svg)) {
		color: #fff;
	}
	.inv :global(:is(p:not(.price), .unit)) {
		color: rgb(255 255 255 / 0.75);
	}
	.inv :global(ul) {
		border-color: rgb(255 255 255 / 0.2);
	}
	.inv :global(.badge) {
		background: #fff;
		color: var(--color-fg);
	}
	.inv.fit {
		box-shadow: 0 0 0 3px rgb(0 85 255 / 0.25);
	}
	/* the blue card has no ring: the badge alone marks it */
	.inv.fit:global(.bg-blue\!) {
		box-shadow: none;
	}

	/* the comparison's Monthly column */
	.tint {
		background: rgb(0 85 255 / 0.04);
	}

	/* a row name with a note: dotted underline, the note in a small dark box under it on hover or focus */
	.tip {
		position: relative;
		cursor: help;
		text-align: left;
		text-decoration: underline dotted var(--color-ink-400);
		text-underline-offset: 4px;
	}
	.tip [role='tooltip'] {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		z-index: 2;
		width: 300px;
		padding: 10px 12px;
		border-radius: 8px;
		background: var(--color-fg);
		color: #fff;
		font-size: 13px;
		line-height: 1.45;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.15s;
	}
	.tip:hover [role='tooltip'],
	.tip:focus [role='tooltip'] {
		opacity: 1;
		visibility: visible;
	}

	/* the slider: the track is drawn by the pieces under it, so only the thumb shows: white, 20px, a blue ring */
	.slider {
		appearance: none;
		margin: 0;
		height: 20px;
		background: transparent;
		cursor: pointer;
	}
	.slider::-webkit-slider-runnable-track {
		height: 20px;
		background: transparent;
	}
	.slider::-moz-range-track {
		height: 20px;
		background: transparent;
	}
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-blue);
		border-radius: 50%;
		background: #fff;
	}
	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border: 2px solid var(--color-blue);
		border-radius: 50%;
		background: #fff;
	}
	.slider:focus-visible {
		outline: 2px solid var(--color-blue);
		outline-offset: 4px;
		border-radius: 4px;
	}
</style>
