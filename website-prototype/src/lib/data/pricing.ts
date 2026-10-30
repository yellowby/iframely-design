// Pricing data. Hit plans use today's fees and overage
// (iframely.com/pricing, 2026-10-12) under the proposed buyer names; overage changes
// after the billing export. The Data API list is the proposal in research/iframely-new-products-ai-agents.md, Section 6.

export type Tier = { upTo: number; per1000: number };

export type HitPlan = {
	id: string;
	name: string;
	formerly: string;
	who: string;
	fee: number;
	included: number;
	overage: Tier[]; // per 1,000 hits above `included`, by cumulative hit count
	points: string[];
};

export const hitPlans: HitPlan[] = [
	{
		id: 'starter',
		name: 'Starter',
		formerly: 'Starter',
		who: 'One product or site in production, up to one brand.',
		fee: 0,
		included: 2000,
		overage: [{ upTo: Infinity, per1000: 4 }],
		points: ['Production use allowed, one brand', 'All API endpoints and 1,900 providers', '"Powered by" icon on cards']
	},
	{
		id: 'product',
		name: 'Product',
		formerly: 'Business',
		who: 'An app or SaaS product that shows previews and embeds to its users.',
		fee: 49,
		included: 25000,
		overage: [
			{ upTo: 100000, per1000: 3 },
			{ upTo: Infinity, per1000: 2 }
		],
		points: ['No "Powered by" icon', 'Content IDs: embeds survive cancellation, batch refresh', 'Email support']
	},
	{
		id: 'publisher',
		name: 'Publisher',
		formerly: 'Editorial',
		who: 'Newsrooms, CMS vendors and agencies with several brands and a back catalogue.',
		fee: 149,
		included: 100000,
		overage: [
			{ upTo: 500000, per1000: 2 },
			{ upTo: Infinity, per1000: 1 }
		],
		points: ['Multiple brands', 'Caching delegation for evergreen embeds', 'Priority email support']
	},
	{
		id: 'enterprise',
		name: 'Enterprise',
		formerly: 'Enterprise',
		who: 'Platforms at volume that need white-label delivery and a named contact.',
		fee: 399,
		included: 500000,
		overage: [{ upTo: Infinity, per1000: 1 }],
		points: ['White-label CDN, bring your own', 'Priority support', 'Higher rate limits on request']
	}
];

export function planCost(plan: HitPlan, hits: number): number {
	let cost = plan.fee;
	let counted = plan.included;
	for (const t of plan.overage) {
		if (hits <= counted) break;
		const slice = Math.min(hits, t.upTo) - counted;
		if (slice > 0) {
			cost += (slice / 1000) * t.per1000;
			counted += slice;
		}
	}
	return cost;
}

export function cheapestPlan(hits: number) {
	return hitPlans
		.map((p) => ({ plan: p, cost: planCost(p, hits) }))
		.sort((a, b) => a.cost - b.cost)[0];
}

// Data API list: free monthly allowance, then graduated per 1,000 reads.
export const dataApiFree = 1000;
export const dataApiTiers: Tier[] = [
	{ upTo: 100000, per1000: 1.0 },
	{ upTo: 500000, per1000: 0.8 },
	{ upTo: Infinity, per1000: 0.6 }
];

export function perRequestCost(requests: number, rateFactor = 1): number {
	let remaining = Math.max(0, requests - dataApiFree);
	let counted = dataApiFree;
	let cost = 0;
	for (const t of dataApiTiers) {
		if (remaining <= 0) break;
		const slice = Math.min(remaining, t.upTo - counted);
		cost += (slice / 1000) * t.per1000 * rateFactor;
		remaining -= slice;
		counted += slice;
	}
	return cost;
}

export const usd = (n: number) =>
	n < 10 && n % 1 ? `$${n.toFixed(2)}` : `$${Math.round(n).toLocaleString('en-US')}`;
export const num = (n: number) => Math.round(n).toLocaleString('en-US');
