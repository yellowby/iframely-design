// Sample embed-code generator for the demo: resolves a pasted URL to a provider from
// providers.ts and builds the provider's native code from the chosen options. No network.

import { providers, type Provider } from '#lib/data/providers.ts';

export type OptionValues = Record<string, string | boolean>;

export type Result = {
	url: string;
	provider: Provider | null;
	kind: 'native' | 'hosted';
	line: string;
	ratio: string;
};

export const exampleChips = [
	{ label: 'YouTube video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
	{ label: 'X post', url: 'https://x.com/iframely/status/1' },
	{ label: 'Instagram post', url: 'https://www.instagram.com/p/sample/' },
	{ label: 'TikTok', url: 'https://www.tiktok.com/@sample/video/1' },
	{ label: 'Spotify track', url: 'https://open.spotify.com/track/sample' },
	{ label: 'SoundCloud track', url: 'https://soundcloud.com/sample/track' },
	{ label: 'Google Doc', url: 'https://docs.google.com/document/d/sample/edit' },
	{ label: 'News article', url: 'https://www.example-news.com/2026/10/15/city-council-votes' }
];

function hostOf(url: string) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return '';
	}
}

export function findProvider(url: string): Provider | null {
	const host = hostOf(url.trim());
	if (!host) return null;
	return (
		providers.find((p) => {
			const hosts = [p.domain.split('/')[0], ...(p.aliases ?? []).filter((a) => a.includes('.'))];
			if (p.slug === 'x') hosts.push('twitter.com');
			return hosts.some((h) => host === h || host.endsWith('.' + h));
		}) ?? null
	);
}

const kindWord: Record<string, string> = {
	player: 'player',
	rich: 'post',
	photo: 'photo',
	card: 'card'
};

export function resolve(url: string, opts: OptionValues = {}): Result {
	const provider = findProvider(url);
	if (!provider || !provider.native) {
		return {
			url,
			provider,
			kind: 'hosted',
			line: provider
				? `${provider.name}, no native embed code, hosted by Iframely`
				: `${hostOf(url) || 'Web page'}, article summary card, hosted by Iframely`,
			ratio: 'card'
		};
	}
	const ratio = ratioFor(provider, opts);
	return {
		url,
		provider,
		kind: 'native',
		line: `${provider.name} ${kindWord[provider.media[0]] ?? 'embed'}, native embed, ${
			ratio === 'auto' ? 'height set by the provider' : `responsive ${ratio}`
		}`,
		ratio
	};
}

function ratioFor(p: Provider, o: OptionValues) {
	switch (p.slug) {
		case 'youtube':
			return o.ratio === '9:16 Shorts' ? '9:16' : '16:9';
		case 'vimeo':
			return '16:9';
		case 'tiktok':
			return '9:16';
		case 'spotify':
			return o.compact ? '80 px tall' : '152 px tall';
		case 'soundcloud':
			return o.visual ? '300 px tall' : '166 px tall';
		case 'google-drive':
			return '4:3';
		default:
			return 'auto';
	}
}

function seconds(v: unknown) {
	if (typeof v !== 'string' || !v.trim()) return 0;
	return v
		.split(':')
		.map(Number)
		.reduce((acc, n) => acc * 60 + (Number.isFinite(n) ? n : 0), 0);
}

const responsive = (src: string, pad: string, extra = '') =>
	`<div style="position:relative;width:100%;height:0;padding-bottom:${pad};">
  <iframe src="${src}"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;"
    loading="lazy"${extra} allowfullscreen></iframe>
</div>`;

export function nativeCode(r: Result, o: OptionValues = {}): string {
	const p = r.provider;
	if (!p) return '';
	const url = r.url;
	switch (p.slug) {
		case 'youtube': {
			const id = (url.match(/[?&]v=([\w-]+)/) ?? url.match(/youtu\.be\/([\w-]+)/) ?? url.match(/shorts\/([\w-]+)/))?.[1] ?? 'VIDEO_ID';
			const q = new URLSearchParams();
			const start = seconds(o.start);
			const end = seconds(o.end);
			if (start) q.set('start', String(start));
			if (end) q.set('end', String(end));
			if (o.autoplay) q.set('autoplay', '1');
			if (o.mute) q.set('mute', '1');
			if (o.loop) {
				q.set('loop', '1');
				q.set('playlist', id);
			}
			if (o.captions) q.set('cc_load_policy', '1');
			const host = o.nocookie ? 'www.youtube-nocookie.com' : 'www.youtube.com';
			const qs = q.toString() ? `?${q}` : '';
			return responsive(
				`https://${host}/embed/${id}${qs}`,
				o.ratio === '9:16 Shorts' ? '177.78%' : '56.25%',
				`\n    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"`
			);
		}
		case 'x': {
			const attrs = [
				o.dark ? ' data-theme="dark"' : '',
				o.hideThread ? ' data-conversation="none"' : '',
				o.hideMedia ? ' data-cards="hidden"' : '',
				o.dnt ? ' data-dnt="true"' : ''
			].join('');
			return `<blockquote class="twitter-tweet"${attrs}>
  <a href="${url.replace('x.com', 'twitter.com')}"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js"></script>`;
		}
		case 'instagram':
			return `<blockquote class="instagram-media"${o.caption ? ' data-instgrm-captioned' : ''}
  data-instgrm-permalink="${url}" data-instgrm-version="14"
  style="max-width:540px;width:100%;"></blockquote>
<script async src="https://www.instagram.com/embed.js"></script>`;
		case 'facebook':
			return `<div class="fb-post" data-href="${url}" data-width="500"
  data-show-text="${o.showText ? 'true' : 'false'}"></div>
<script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0"></script>`;
		case 'soundcloud': {
			const color = o.color === 'Black' ? '000000' : o.color === 'Custom' ? '5b4bdb' : 'ff5500';
			const q = new URLSearchParams({
				url,
				color: `#${color}`,
				auto_play: o.autoplay ? 'true' : 'false',
				show_related: o.hideRelated ? 'false' : 'true',
				visual: o.visual ? 'true' : 'false'
			});
			return `<iframe width="100%" height="${o.visual ? 300 : 166}" scrolling="no" frameborder="no"
  allow="autoplay" loading="lazy"
  src="https://w.soundcloud.com/player/?${q}"></iframe>`;
		}
		case 'tiktok': {
			const id = url.match(/video\/(\w+)/)?.[1] ?? 'VIDEO_ID';
			return `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${id}"
  style="max-width:605px;min-width:325px;aspect-ratio:9/16;">
  <section></section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>`;
		}
		case 'spotify': {
			const path = url.replace(/^https?:\/\/open\.spotify\.com\//, '');
			return `<iframe src="https://open.spotify.com/embed/${path}${o.theme === 'Dark' ? '?theme=0' : ''}"
  width="100%" height="${o.compact ? 80 : 152}" frameborder="0" loading="lazy"
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
		}
		case 'google-drive': {
			const id = url.match(/\/d\/([\w-]+)/)?.[1] ?? 'FILE_ID';
			const src = url.includes('docs.google.com/document')
				? `https://docs.google.com/document/d/${id}/preview`
				: `https://drive.google.com/file/d/${id}/preview`;
			return responsive(src, '75%');
		}
		case 'vimeo': {
			const id = url.match(/vimeo\.com\/(\d+)/)?.[1] ?? 'VIDEO_ID';
			return responsive(`https://player.vimeo.com/video/${id}`, '56.25%', `\n    allow="autoplay; fullscreen; picture-in-picture"`);
		}
		case 'giphy': {
			const id = url.split('/').pop() ?? 'GIF_ID';
			return responsive(`https://giphy.com/embed/${id}`, '75%');
		}
		case 'codepen': {
			const embed = url.replace('/pen/', '/embed/');
			return `<iframe height="400" style="width:100%;border:0;" loading="lazy"
  src="${embed}?default-tab=result" allowfullscreen></iframe>`;
		}
		default:
			return '';
	}
}

export function defaultOptions(p: Provider | null): OptionValues {
	const o: OptionValues = {};
	for (const opt of p?.options ?? []) {
		o[opt.key] = opt.type === 'toggle' ? false : opt.type === 'select' ? (opt.choices?.[0] ?? '') : '';
	}
	return o;
}
