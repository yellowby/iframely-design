<script lang="ts">
	import Pill from './Pill.svelte';

	// Pricing block above the closing CTA, after G19 in the motion lab (Page content): the heading and line, then two plans
	// with only the basic facts (name, price, one line, one button); Enterprise is left to /pricing. Facts from the new
	// price list (iframely-marketing plans/website/12-pricing-volumes.md, D41–D45; D42 still proposed): 2,000 hits a month
	// free, then $4 per 1,000; monthly volumes from $30 (10,000 hits at $3.00 per 1,000).
	// The /pricing page itself still shows the older plans. No "/pricing" path line above the heading.
</script>

<section class="wrap py-24">
	<div class="grid gap-5 md:grid-cols-3">
		<div class="md:pr-3">
			<h2 class="t-h2 text-fg">Pricing</h2>
			<p class="t-body mt-4 text-body">Usage-based, one price list for every API. You&nbsp;pay only for results.</p>
		</div>

		<div class="flex min-h-[300px] flex-col rounded-xl bg-white p-7 ring-1 ring-black/8 ring-inset">
			<p class="t-body text-fg">Pay as you go</p>
			<p class="price mt-7 text-fg">$0<span class="unit">/mo</span></p>
			<p class="t-note mt-3.5 text-mute">2,000 hits a month free,<br />then $4 per 1,000</p>
			<div class="mt-auto pt-7"><Pill href="#signup">Start free</Pill></div>
		</div>

		<div class="flex min-h-[300px] flex-col rounded-xl bg-blue p-7 text-white">
			<p class="t-body">Monthly volumes from</p>
			<p class="price mt-7">$30<span class="unit">/mo</span></p>
			<p class="t-note mt-3.5 text-white/80">10,000 hits a month at $3 per 1,000,<br />down to $0.70 at higher volumes</p>
			<div class="mt-auto pt-7">
				<a href="/pricing" class="t-button inline-flex items-center rounded-full bg-white px-5 py-2 text-blue transition-colors hover:bg-white/85"
					>See pricing</a
				>
			</div>
		</div>
	</div>
</section>

<style>
	.price {
		display: flex;
		align-items: baseline;
		font-family: var(--ff-heading);
		font-size: 56px;
		line-height: 1;
		letter-spacing: -0.035em;
	}
	.unit {
		margin-left: 3px;
		font-family: var(--ff-base);
		font-size: 18px;
		letter-spacing: 0;
		opacity: 0.75;
	}
</style>
