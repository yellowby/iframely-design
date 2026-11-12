// Entries for /updates. Dates and facts from iframely.com/updates and
// github.com/itteco/iframely as recorded in research/sources/16; summaries rewritten in the new template's voice.

export type Stream = 'changelog' | 'provider';

export type Entry = {
	date: string;
	stream: Stream;
	title: string;
	summary: string;
	tags: string[];
	href?: string;
	imported?: boolean; // from GitHub releases
};

export const entries: Entry[] = [
	{ date: '2026-10-12', stream: 'changelog', title: 'Open-source engine v26.10.12', summary: 'Provider fixes and dependency updates.', tags: ['open source'], imported: true },
	{ date: '2026-10-08', stream: 'changelog', title: 'Open-source engine v26.10.08', summary: 'YouPlay removed from known players.', tags: ['open source'], imported: true },
	{
		date: '2026-10-01',
		stream: 'changelog',
		title: 'Data API: readable content with the publisher\'s permissions',
		summary: 'New endpoint for automated processing with five processing modes, the access object, and domain claiming, content policy and per-customer rules for publishers.',
		tags: ['Data API', 'publishers'],
		href: '/data-api'
	},
	{
		date: '2026-10-01',
		stream: 'provider',
		title: 'Dailymotion now requires a partner player id',
		summary: 'Dailymotion embeds need a player id from your Dailymotion partner account. Hosted Iframely embeds are updated; raw embed codes without one may stop working.',
		tags: ['Dailymotion', 'Preview API']
	},
	{ date: '2026-10-01', stream: 'provider', title: 'Naver TV endpoint removed', summary: 'Naver TV no longer serves embeds; links fall back to summary cards.', tags: ['Naver TV'] },
	{ date: '2026-09-11', stream: 'changelog', title: 'Open-source engine: default SSRF protection', summary: 'A default config now blocks requests to private networks. Self-hosted instances should update.', tags: ['open source', 'security'], imported: true },
	{
		date: '2026-07-14',
		stream: 'changelog',
		title: 'HTTP deprecated, legacy CDN retired',
		summary: 'Hosted iframes move from cdn.iframe.ly to iframely.net. HTTP requests will be forwarded to HTTPS. /api/iframely and /api/oembed stay on iframe.ly.',
		tags: ['deprecation', 'hosted embeds']
	},
	{
		date: '2026-07-09',
		stream: 'changelog',
		title: 'Publisher Console in beta',
		summary: 'Publishers can see requests to their domains and set what Iframely\'s agents may use. Sign in and switch to Publish mode.',
		tags: ['publishers'],
		href: '/publishers'
	},
	{ date: '2026-05-21', stream: 'changelog', title: 'SOC 2 Type II', summary: 'Our SOC 2 Type II report is available to customers on request through the Trust Center.', tags: ['compliance'] },
	{
		date: '2025-12-11',
		stream: 'changelog',
		title: 'Consent withdrawal form moves onto your site',
		summary: 'Chrome storage partitioning means the consent-withdrawal page must now be embedded as a form on your own site.',
		tags: ['consent', 'action required']
	},
	{ date: '2025-11-10', stream: 'provider', title: 'Instagram profile embeds for everyone', summary: 'Instagram profile links now embed as a profile card on every plan.', tags: ['Instagram'] },
	{
		date: '2025-11-03',
		stream: 'provider',
		title: 'Instagram and Facebook oEmbed no longer return thumbnails or authors',
		summary: 'What changed on 3 November 2025, what Iframely does to keep images, and what to do if you call Meta\'s oEmbed directly.',
		tags: ['Instagram', 'Facebook', 'action required'],
		href: '/updates/meta-oembed-thumbnails'
	}
];
