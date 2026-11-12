// Pricing from plans/website/12-pricing-volumes.md (D41 to D45): one price list for every product.
// Preview API and Rich Media count one hit per URL-hour, the Data API one hit per request.
// Volumes are on top of the 2,000 free hits; every hit on a volume, including hits above it, costs its rate.

export const freeHits = 2000;
export const paygPer1000 = 4;
export const enterpriseFrom = 2_000_000;
export const floorPer1000 = 0.5;

export type Volume = { hits: number; per1000: number };

export const volumes: Volume[] = [
	{ hits: 10_000, per1000: 3.0 },
	{ hits: 20_000, per1000: 2.5 },
	{ hits: 50_000, per1000: 2.0 },
	{ hits: 100_000, per1000: 1.5 },
	{ hits: 200_000, per1000: 1.2 },
	{ hits: 500_000, per1000: 0.9 },
	{ hits: 1_000_000, per1000: 0.8 },
	{ hits: 2_000_000, per1000: 0.7 }
];

export const minVolume = volumes[0].hits;

// Hits that count against a volume or pay as you go: usage above the free 2,000.
export const paidHits = (hits: number) => Math.max(0, hits - freeHits);

export const volumePrice = (v: Volume) => (v.hits / 1000) * v.per1000;

// Annual billing, any volume: the rate changes evenly between two rows of the table.
export function customRate(volume: number): number {
	const v = Math.min(Math.max(volume, minVolume), enterpriseFrom);
	for (let i = 1; i < volumes.length; i++) {
		const a = volumes[i - 1];
		const b = volumes[i];
		if (v <= b.hits) return a.per1000 + ((b.per1000 - a.per1000) * (v - a.hits)) / (b.hits - a.hits);
	}
	return volumes[volumes.length - 1].per1000;
}

export const customPrice = (volume: number) => (volume / 1000) * customRate(volume);

export const paygCost = (hits: number) => (paidHits(hits) / 1000) * paygPer1000;

// A monthly volume billed for a month of usage: the volume, plus extra hits at the same rate.
export const volumeCost = (v: Volume, hits: number) => (Math.max(v.hits, paidHits(hits)) / 1000) * v.per1000;

// The cheapest way to pay for a month without an annual commitment: pay as you go or the best volume.
export function cheapestMonthly(hits: number): { volume: Volume | null; cost: number } {
	let best: { volume: Volume | null; cost: number } = { volume: null, cost: paygCost(hits) };
	for (const v of volumes) {
		const cost = volumeCost(v, hits);
		if (cost < best.cost) best = { volume: v, cost };
	}
	return best;
}

export const usd = (n: number) =>
	n < 10 && n % 1 ? `$${n.toFixed(2)}` : `$${Math.round(n).toLocaleString('en-US')}`;
export const cents = (n: number) =>
	`$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const rate = (n: number) => `$${n.toFixed(2)}`;
export const num = (n: number) => Math.round(n).toLocaleString('en-US');
