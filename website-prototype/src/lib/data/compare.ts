// Comparison data for /compare. Prices from research/iframely-pricing-analysis.md and
// research/sources/18 (vendor pages read 2026-08 to 2026-10). Re-check before publishing.

export type Competitor = {
	slug: string;
	name: string;
	kind: 'reader' | 'preview';
	oneLine: string;
	theyAreGoodAt: string[];
	chooseIframelyWhen: string[];
	chooseThemWhen: string[];
	rows: [string, string, string][]; // feature, Iframely, them
	priceNote: string;
};

const readerRows = (them: Partial<Record<string, string>>): [string, string, string][] => [
	['Unit and list price', 'Per read: $1.00 per 1,000, $0.80 above 100,000, $0.60 above 500,000', them.price ?? 'See their pricing page'],
	['Free allowance', '1,000 reads a month', them.free ?? 'See their pricing page'],
	['Declared purpose per request', 'Required: <code>mode</code> and optional <code>use</code>', them.purpose ?? 'Not part of the API'],
	['Publisher decision returned with the result', 'Yes, the <code>access</code> object per content type', them.access ?? 'No'],
	['robots.txt for automated reads', 'Obeyed per RFC 9309 by the Processing Agent', them.robots ?? 'Not documented as a guarantee'],
	['Content Signals, RSL, Creative Commons', 'Read and applied; shown in <code>signals</code>', them.signals ?? 'Not documented'],
	['Signed requests (Web Bot Auth)', 'Yes, key directory published', them.signed ?? 'Not documented'],
	['Proxies or fingerprint rotation', 'Never', them.proxies ?? 'See their docs'],
	['Crawling', 'No: one URL per request', them.crawl ?? 'Yes, crawl and map endpoints'],
	['Embeds and previews from the same vendor', 'Yes, 1,900 providers', them.embeds ?? 'No'],
	['MCP server', 'Hosted and npm; keyless for unfurl and embed', them.mcp ?? 'Yes'],
	['SOC 2 Type II', 'Yes (2026)', them.soc2 ?? 'See their trust page']
];

const previewRows = (them: Partial<Record<string, string>>): [string, string, string][] => [
	['Entry paid plan', '$49 a month, 25,000 hits (a hit covers one URL for an hour)', them.price ?? 'See their pricing page'],
	['Free tier', '2,000 hits a month, production use on one brand', them.free ?? 'See their pricing page'],
	['Providers with rich embeds', '1,900, maintained as platforms change', them.providers ?? 'See their docs'],
	['Hosted iframes and Content IDs', 'Yes', them.hosted ?? 'No'],
	['Click-to-play, consent gate, lazy load', 'Yes, all three', them.interactives ?? 'No'],
	['Readable content and permissions', 'Data API with the <code>access</code> object', them.data ?? 'No permission layer'],
	['Signed, publisher-allow-listed fetcher', 'Yes', them.signed ?? 'Not documented'],
	['SOC 2 Type II', 'Yes (2026)', them.soc2 ?? 'See their trust page']
];

export const competitors: Competitor[] = [
	{
		slug: 'firecrawl',
		name: 'Firecrawl',
		kind: 'reader',
		oneLine: 'A web scraping and crawling API that returns Markdown or HTML for agents.',
		theyAreGoodAt: ['Crawling whole sites and mapping URLs', 'Low price per page at volume', 'Many SDKs and a keyless MCP tier'],
		chooseIframelyWhen: [
			'You need to show a legal or publisher-relations team why each page was read and what you may do with it',
			'Your product also renders link previews or embeds',
			'You read URLs a person asked about, one at a time'
		],
		chooseThemWhen: ['You need to crawl a whole site', 'Price per page is the only criterion and permissions are your own problem'],
		rows: readerRows({
			price: 'Credits: $83 a month for 100,000 (annual billing), $0.60 per 1,000 at the Scale plan',
			free: '1,000 credits a month',
			crawl: 'Yes, crawl and map endpoints'
		}),
		priceNote: 'Firecrawl prices from firecrawl.dev/pricing, read 2026-10; annual-billed figures.'
	},
	{
		slug: 'jina',
		name: 'Jina Reader',
		kind: 'reader',
		oneLine: 'A reader endpoint that turns a URL into LLM-friendly Markdown, priced in tokens.',
		theyAreGoodAt: ['A no-key endpoint for quick tests', 'Simple URL-prefix interface', 'Token pricing that is cheap for short pages'],
		chooseIframelyWhen: [
			'You need a per-request record of the publisher\'s signals',
			'You need predictable per-read pricing rather than tokens',
			'You also need embeds and previews'
		],
		chooseThemWhen: ['You want the cheapest Markdown for short pages and handle compliance yourself'],
		rows: readerRows({
			price: 'Tokens: about $0.05 per million output tokens (secondary source); prices not shown on jina.ai',
			free: '10 million tokens once per key, non-commercial',
			crawl: 'Reader reads one URL; search is separate'
		}),
		priceNote: 'Jina prices from a secondary source captured 2026-08-27; jina.ai/pricing returned 404.'
	},
	{
		slug: 'exa',
		name: 'Exa',
		kind: 'reader',
		oneLine: 'A search engine for AI with a contents endpoint that returns page text.',
		theyAreGoodAt: ['Neural search and retrieval', 'Signs its requests and publishes a key directory', 'Enterprise customer list'],
		chooseIframelyWhen: [
			'You already have the URLs and need their content with the publisher\'s decision',
			'You need previews and embeds from the same vendor'
		],
		chooseThemWhen: ['You need search, not just reading', 'Price at 25,000 to 250,000 reads is decisive'],
		rows: readerRows({
			price: 'Contents: $1 per 1,000 pages per content type, pay as you go',
			free: '$10 of credits a month',
			signed: 'Yes, HTTP Message Signatures with a key directory',
			crawl: 'Search and contents; no site crawl'
		}),
		priceNote: 'Exa prices from exa.ai/pricing, read 2026-10.'
	},
	{
		slug: 'tavily',
		name: 'Tavily',
		kind: 'reader',
		oneLine: 'A search and extract API built for agents, priced in credits.',
		theyAreGoodAt: ['Search tuned for agents', 'x402 payments for some calls', 'agents.md and skills for coding agents'],
		chooseIframelyWhen: ['You need the publisher\'s decision per read', 'You need embeds and previews too'],
		chooseThemWhen: ['You need search results more than page content'],
		rows: readerRows({
			price: 'Extract: 1 credit per 5 URLs; about $1.50 per 1,000 URLs at the Project plan',
			free: '1,000 credits a month',
			crawl: 'Map and crawl endpoints'
		}),
		priceNote: 'Tavily prices from tavily.com/pricing and its credits docs, read 2026-10.'
	},
	{
		slug: 'embedly',
		name: 'Embedly',
		kind: 'preview',
		oneLine: 'An embeds and link-preview API, one of the first in the category.',
		theyAreGoodAt: ['Long-standing embed and extract API', 'Cards product'],
		chooseIframelyWhen: [
			'Price at any volume: Iframely is lower from 25,000 to 1 million requests',
			'You need a free tier, consent gates or click-to-play'
		],
		chooseThemWhen: ['You depend on Embedly Extract or Display specifically'],
		rows: previewRows({
			price: '$119 a month: 10,000 Embed, 10,000 Extract, 25,000 Display',
			free: '30-day trial'
		}),
		priceNote: 'Embedly prices from embed.ly/pricing, read 2026-10.'
	},
	{
		slug: 'microlink',
		name: 'Microlink',
		kind: 'preview',
		oneLine: 'A browser-as-a-service API for previews, screenshots, PDFs and Markdown.',
		theyAreGoodAt: ['Screenshots and PDF generation', 'Cache hits are free', 'Browser rendering of any page'],
		chooseIframelyWhen: [
			'You need rich embeds for X, Instagram, TikTok and Facebook rather than generic Open Graph',
			'The same URL is requested many times an hour: one hit covers them all',
			'You need production traffic not to pause at quota'
		],
		chooseThemWhen: ['You need screenshots or PDFs', 'You fetch each URL once and render embeds yourself'],
		rows: previewRows({
			price: '$49 a month for 46,000 requests; about $1.07 per 1,000 at every step',
			free: '25 requests a day (also stated as 100 a month on the same page)',
			providers: 'About 300 oEmbed providers',
			data: 'Markdown output; no permission layer'
		}),
		priceNote: 'Microlink prices from microlink.io/pricing, read 2026-10; upper steps derived from EUR.'
	}
];

export const competitorBySlug = (slug: string) => competitors.find((c) => c.slug === slug);
