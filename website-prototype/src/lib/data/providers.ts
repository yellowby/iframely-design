// Provider data file: one record drives every /domains page.
// Clicks are organic clicks from Search Console, 16 months to 2026-10-08; everything else is sample data.

export type Tier = 'A' | 'B' | 'C';

export type Provider = {
	slug: string;
	name: string;
	domain: string;
	aliases?: string[];
	category: string;
	tier: Tier;
	clicks?: number;
	definition: string;
	media: string[]; // player, card, photo, rich
	native: boolean; // provider publishes its own embed code
	clickToPlay?: boolean;
	consent?: boolean;
	sampleUrl: string;
	options?: { key: string; label: string; type: 'toggle' | 'time' | 'select'; choices?: string[] }[];
	quirks?: { title: string; text: string; date: string }[];
	privacy?: string;
	updated: string;
};

export const categories = [
	'Video',
	'Audio and podcasts',
	'Social',
	'Images and GIFs',
	'Maps',
	'Documents and files',
	'Code and data',
	'Products and commerce',
	'News and articles',
	'Events and calendars',
	'3D and design',
	'Education'
];

export const providers: Provider[] = [
	{
		slug: 'youtube',
		name: 'YouTube',
		domain: 'youtube.com',
		aliases: ['youtu.be', 'shorts'],
		category: 'Video',
		tier: 'A',
		clicks: 66777,
		definition: 'Video platform. A YouTube embed is an inline player in an iframe, 16:9 for videos and 9:16 for Shorts.',
		media: ['player'],
		native: true,
		clickToPlay: true,
		consent: true,
		sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		options: [
			{ key: 'start', label: 'Start at', type: 'time' },
			{ key: 'end', label: 'End at', type: 'time' },
			{ key: 'autoplay', label: 'Autoplay', type: 'toggle' },
			{ key: 'mute', label: 'Mute', type: 'toggle' },
			{ key: 'loop', label: 'Loop', type: 'toggle' },
			{ key: 'captions', label: 'Captions on', type: 'toggle' },
			{ key: 'nocookie', label: 'Privacy-enhanced domain (youtube-nocookie.com)', type: 'toggle' },
			{ key: 'ratio', label: 'Aspect ratio', type: 'select', choices: ['16:9 video', '9:16 Shorts'] }
		],
		quirks: [
			{
				title: 'Error 153 in Android WebView',
				text: 'YouTube refuses playback without a valid referrer. Set a referrer policy and a base URL on the WebView.',
				date: '2026-05'
			},
			{
				title: 'Autoplay is blocked with sound',
				text: 'Browsers allow autoplay only when muted. Turn on Mute together with Autoplay.',
				date: '2026-02'
			}
		],
		privacy:
			'The standard player sets cookies and loads about 500 KB of scripts on page load. The privacy-enhanced domain sets no cookies until the visitor presses play; the hosted Iframely version can also wait for consent.',
		updated: '2026-10-01'
	},
	{
		slug: 'x',
		name: 'X (Twitter)',
		domain: 'x.com',
		aliases: ['twitter', 'twitter.com', 'tweet'],
		category: 'Social',
		tier: 'A',
		clicks: 52335,
		definition: 'Social network. An X embed is a blockquote that X\'s widgets.js turns into a post card.',
		media: ['rich'],
		native: true,
		consent: true,
		sampleUrl: 'https://x.com/iframely/status/1',
		options: [
			{ key: 'dark', label: 'Dark theme', type: 'toggle' },
			{ key: 'hideThread', label: 'Hide conversation', type: 'toggle' },
			{ key: 'hideMedia', label: 'Hide media', type: 'toggle' },
			{ key: 'dnt', label: 'Do not track', type: 'toggle' }
		],
		quirks: [
			{
				title: 'Posts do not render in some regions',
				text: 'widgets.js is blocked in some countries and by tracker blockers. The hosted version falls back to a static card.',
				date: '2026-07'
			}
		],
		privacy: 'widgets.js loads X\'s tracking unless data-dnt is set. The consent-gated hosted version loads nothing until the visitor agrees.',
		updated: '2026-09-18'
	},
	{
		slug: 'instagram',
		name: 'Instagram',
		domain: 'instagram.com',
		category: 'Social',
		tier: 'A',
		clicks: 25160,
		definition: 'Photo and video sharing. An Instagram embed is a blockquote rendered by Instagram\'s embed.js.',
		media: ['rich', 'photo'],
		native: true,
		consent: true,
		sampleUrl: 'https://www.instagram.com/p/sample/',
		options: [{ key: 'caption', label: 'Include caption', type: 'toggle' }],
		quirks: [
			{
				title: 'Thumbnails and author names missing from oEmbed',
				text: 'Since 3 November 2025 Meta\'s oEmbed returns no thumbnail or author. Iframely fills them from the page where it can.',
				date: '2025-11'
			},
			{
				title: 'Images expire',
				text: 'Instagram image URLs are signed and expire after a few days. Hosted embeds refresh them; copied image URLs break.',
				date: '2026-03'
			}
		],
		updated: '2026-08-30'
	},
	{
		slug: 'facebook',
		name: 'Facebook',
		domain: 'facebook.com',
		category: 'Social',
		tier: 'A',
		clicks: 20462,
		definition: 'Social network. Facebook embeds are posts and videos rendered by the Facebook SDK.',
		media: ['rich', 'player'],
		native: true,
		consent: true,
		sampleUrl: 'https://www.facebook.com/sample/posts/1',
		options: [{ key: 'showText', label: 'Show text', type: 'toggle' }],
		updated: '2026-08-30'
	},
	{
		slug: 'soundcloud',
		name: 'SoundCloud',
		domain: 'soundcloud.com',
		category: 'Audio and podcasts',
		tier: 'A',
		clicks: 17308,
		definition: 'Audio platform. A SoundCloud embed is a waveform player, compact or visual.',
		media: ['player'],
		native: true,
		clickToPlay: true,
		sampleUrl: 'https://soundcloud.com/sample/track',
		options: [
			{ key: 'visual', label: 'Visual player', type: 'toggle' },
			{ key: 'autoplay', label: 'Autoplay', type: 'toggle' },
			{ key: 'hideRelated', label: 'Hide related', type: 'toggle' },
			{ key: 'color', label: 'Colour', type: 'select', choices: ['Orange', 'Black', 'Custom'] }
		],
		updated: '2026-06-12'
	},
	{
		slug: 'tiktok',
		name: 'TikTok',
		domain: 'tiktok.com',
		category: 'Video',
		tier: 'A',
		clicks: 11812,
		definition: 'Short video platform. A TikTok embed is a 9:16 player loaded by TikTok\'s embed script.',
		media: ['player'],
		native: true,
		consent: true,
		sampleUrl: 'https://www.tiktok.com/@sample/video/1',
		quirks: [
			{
				title: 'Script loads after the page and shifts layout',
				text: 'Reserve a 9:16 box before the script runs. The hosted version predicts the height.',
				date: '2026-04'
			}
		],
		updated: '2026-09-02'
	},
	{
		slug: 'spotify',
		name: 'Spotify',
		domain: 'open.spotify.com',
		category: 'Audio and podcasts',
		tier: 'A',
		clicks: 7773,
		definition: 'Music and podcasts. Spotify embeds are players for tracks, albums, playlists and episodes.',
		media: ['player'],
		native: true,
		sampleUrl: 'https://open.spotify.com/track/sample',
		options: [
			{ key: 'compact', label: 'Compact (80 px)', type: 'toggle' },
			{ key: 'theme', label: 'Theme', type: 'select', choices: ['Auto', 'Dark'] }
		],
		quirks: [
			{
				title: 'Heights differ by content type',
				text: 'Tracks are 152 px, playlists 352 px. Fixed heights crop the player.',
				date: '2026-01'
			}
		],
		updated: '2026-07-21'
	},
	{
		slug: 'google-drive',
		name: 'Google Drive',
		domain: 'drive.google.com',
		aliases: ['docs', 'google docs', 'sheets', 'slides', 'docs.google.com'],
		category: 'Documents and files',
		tier: 'A',
		clicks: 6532,
		definition: 'Files, Docs, Sheets and Slides. Shared files embed as a preview iframe.',
		media: ['rich'],
		native: true,
		sampleUrl: 'https://drive.google.com/file/d/sample/view',
		updated: '2026-05-03'
	},
	{
		slug: 'vimeo',
		name: 'Vimeo',
		domain: 'vimeo.com',
		category: 'Video',
		tier: 'B',
		clicks: 2100,
		definition: 'Video hosting. Vimeo embeds are responsive iframe players.',
		media: ['player'],
		native: true,
		clickToPlay: true,
		consent: true,
		sampleUrl: 'https://vimeo.com/1',
		updated: '2026-04-10'
	},
	{
		slug: 'giphy',
		name: 'GIPHY',
		domain: 'giphy.com',
		category: 'Images and GIFs',
		tier: 'B',
		clicks: 1450,
		definition: 'GIF search. GIPHY embeds play as a looping video or an image.',
		media: ['player', 'photo'],
		native: true,
		sampleUrl: 'https://giphy.com/gifs/sample',
		updated: '2026-03-15'
	},
	{
		slug: 'google-maps',
		name: 'Google Maps',
		domain: 'google.com/maps',
		category: 'Maps',
		tier: 'B',
		clicks: 980,
		definition: 'Maps and places. A map embed is an interactive iframe for a place or a route.',
		media: ['rich'],
		native: false,
		sampleUrl: 'https://maps.google.com/?q=Ottawa',
		updated: '2026-02-20'
	},
	{
		slug: 'codepen',
		name: 'CodePen',
		domain: 'codepen.io',
		category: 'Code and data',
		tier: 'B',
		clicks: 610,
		definition: 'Front-end playground. A CodePen embed shows a live pen with code and result tabs.',
		media: ['rich'],
		native: true,
		clickToPlay: true,
		sampleUrl: 'https://codepen.io/sample/pen/1',
		updated: '2026-01-11'
	},
	{
		slug: 'calendly',
		name: 'Calendly',
		domain: 'calendly.com',
		category: 'Events and calendars',
		tier: 'C',
		clicks: 530,
		definition: 'Scheduling. Calendly links render as a booking card or an inline scheduler.',
		media: ['rich', 'card'],
		native: false,
		sampleUrl: 'https://calendly.com/sample/30min',
		updated: '2026-06-01'
	},
	{
		slug: 'sketchfab',
		name: 'Sketchfab',
		domain: 'sketchfab.com',
		category: '3D and design',
		tier: 'C',
		clicks: 120,
		definition: '3D models. A Sketchfab embed is an interactive 3D viewer.',
		media: ['player'],
		native: false,
		clickToPlay: true,
		sampleUrl: 'https://sketchfab.com/3d-models/sample',
		updated: '2025-12-04'
	},
	{
		slug: 'itemfix',
		name: 'ItemFix',
		domain: 'itemfix.com',
		category: 'Video',
		tier: 'C',
		clicks: 113,
		definition: 'Video sharing site. ItemFix videos embed as a player.',
		media: ['player'],
		native: false,
		sampleUrl: 'https://www.itemfix.com/v?t=sample',
		updated: '2025-10-20'
	}
];

export const providerBySlug = (slug: string) => providers.find((p) => p.slug === slug);
