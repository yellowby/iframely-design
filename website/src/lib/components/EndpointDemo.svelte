<script lang="ts">
	// The scene of the "For developers" block on /embeds: the block's argument, "send a URL, get the embed back", as
	// one window on grey paper that works. (A fork of components/OembedDemo.svelte, which /embeds-3 keeps: that one
	// shows the JSON answer beside its html field rendered.)
	// On the paper, from the top: the providers (each sends another URL to the same endpoint), the request as a strip,
	// then two windows. (It was one window of three columns under the request.)
	// The request goes to Iframely's own API. (It was the oEmbed endpoint, and before that a switch of the two.)
	// The first window is the embed and its form, in two columns:
	//   the embed, rendered;
	//   the provider's own options for this URL, as the form an editor would be given (/docs/options): a change adds
	//     its parameter to the request, and changes the embed and its code.
	// The second window is the answer, in tabs: the embed code; its meta and links (FACTS); its JSON, cut to its shape,
	// with the options written out as they are now.
	// The last option is the same for every provider and is kept from one to the next: the theme, light or dark (the
	// API's own theme parameter). It stands in for X's own "Use dark theme" (_theme), which is not listed.
	//
	// The URLs, the options (names, labels, defaults) and the embed codes are the real ones: the
	// options as the API answers them for these URLs (asked 2026-11-23), the codes as the app's "Embed code" tab shows
	// them (the provider's own code; Instagram's as Iframely's hosted iframe, "Avoid third-party scripts"). TikTok is
	// not here: it has no options to show.
	// Nothing is fetched. What is drawn, not real:
	//   - the previews, and how the theme and each option change them;
	//   - how an option changes the code (YouTube's start, end and cc_load_policy; X's data-cards and data-width; Figma's box; Instagram's parameter in the iframe's address), and Spotify's height without its
	//     playlist (152px), and what the dark theme changes in each code (X's data-theme and Figma's theme=dark are
	//     their own; Spotify's theme=0 and the hosted iframe's theme=dark are guesses; YouTube's code has no theme): TO BE
	//     CONFIRMED;
	//   - the codes are cut: long style and allow attributes are "…", and the API key is not shown.
	import { wanted } from '#lib/endpoint.svelte.ts';

	const SRC = import.meta.glob('../assets/providers/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`];

	// An option, as in the API's answer. check: on or off, sent as true or false. pick: one of `values` (the value
	// sent, and its name here). `def` is its value as the answer gives it: only what differs from it goes into the
	// request. `only`: shown only while another option has that value.
	// Nothing is typed in this scene: where the real form has a text field (YouTube's Start from and End on, X's
	// Adjust width, Figma's Adjust height), the option here is a pick of three values, its default among them.
	type Opt = {
		key: string;
		label: string;
		kind: 'check' | 'pick';
		def: string | boolean;
		values?: [string, string][];
		only?: [string, string];
	};
	// id (the logo's file), name, the URL sent, its options
	const ITEMS: { id: string; name: string; url: string; opts: Opt[] }[] = [
		{
			id: 'spotify',
			name: 'Spotify',
			url: 'https://open.spotify.com/album/2ODvWsOgouMbaA5xf0RkJe',
			opts: [{ key: '_playlist', label: 'Include playlist', kind: 'check', def: true }]
		},
		{
			id: 'youtube',
			name: 'YouTube',
			url: 'https://www.youtube.com/watch?v=q3lX2p_Uy9I',
			opts: [
				{ key: '_start', label: 'Start from', kind: 'pick', def: '', values: [['', '0:00'], ['42', '0:42'], ['1m10s', '1:10']] },
				{ key: '_end', label: 'End on', kind: 'pick', def: '', values: [['2m', '2:00'], ['3m', '3:00'], ['', '4:01']] },
				{ key: '_cc_load_policy', label: 'Closed captions', kind: 'check', def: false }
			]
		},
		{
			id: 'x',
			name: 'X/Twitter',
			url: 'https://twitter.com/Reza_Zadeh/status/1344009123004747778',
			opts: [
				{ key: '_hide_media', label: 'Hide photos, videos, and cards', kind: 'check', def: false },
				{ key: '_maxwidth', label: 'Adjust width', kind: 'pick', def: '', values: [['350', '350px'], ['450', '450px'], ['', 'Auto']] }
			]
		},
		{
			id: 'figma',
			name: 'Figma',
			url: 'https://www.figma.com/file/zCl6dPZyG0DWoIOvetwBMG/Figma-Basics',
			opts: [
				{ key: '_layout', label: 'Layout', kind: 'pick', def: 'horizontal', values: [['responsive', 'Aspect ratio 16:9'], ['horizontal', 'Fixed height']] },
				{ key: '_height', label: 'Adjust height', kind: 'pick', def: '450', values: [['300', '300px'], ['450', '450px'], ['600', '600px']], only: ['_layout', 'horizontal'] }
			]
		},
		{
			id: 'instagram',
			name: 'Instagram',
			url: 'https://www.instagram.com/p/CaUsPbUquKV/',
			opts: [{ key: '_showcaption', label: "Show author's text caption", kind: 'check', def: false }]
		}
	];
	// What the API's answer has for each URL besides the embed code (asked 2026-11-23; a pick of it): its meta fields,
	// and its links by rel, each with its type and size.
	const FACTS: Record<string, { meta: string[][]; links: string[][] }> = {
		youtube: {
			meta: [['title', 'Jungle - Back On 74 (Official Video)'], ['author', 'Jungle4eva'], ['site', 'YouTube'], ['date', '2023-08-10'], ['duration', '241'], ['medium', 'video']],
			links: [['player', 'text/html · 16:9'], ['thumbnail', 'image/jpg · 1280×720'], ['icon', 'image/png · 144×144']]
		},
		spotify: {
			meta: [['title', 'Listen to Starboy - Album by The Weeknd | Spotify'], ['description', 'The Weeknd · album · 2016 · 18 songs'], ['site', 'Spotify'], ['date', '2016-11-25'], ['medium', 'playlist']],
			links: [['player', 'text/html · 352px tall'], ['thumbnail', 'image · 640×640'], ['icon', 'image/png · 32×32']]
		},
		x: {
			meta: [['title', 'Reza Zadeh on Twitter / X'], ['author', 'Reza Zadeh'], ['author_url', 'https://x.com/Reza_Zadeh'], ['site', 'X'], ['description', "It's pretty awesome how dancing makes robots less intimidating. Looking forward to seeing more nontrivial Machine Learning on these robots."]],
			links: [['app', 'text/html · up to 550px wide'], ['thumbnail', 'image/png · 1200×675'], ['icon', 'image/png · 192×192']]
		},
		figma: {
			meta: [['title', 'Figma Basics'], ['description', 'Created with Figma'], ['site', 'Figma'], ['date', '2020-11-19'], ['medium', 'article'], ['category', 'Design']],
			links: [['app', 'text/html · 450px tall'], ['thumbnail', 'image/png · 640×51'], ['icon', 'image · 192×192']]
		},
		instagram: {
			meta: [['title', 'Tom Holland on Instagram: "😏😏😏"'], ['description', '25M likes, 129K comments - tomholland2013 on February 23, 2022: "😏😏😏".'], ['site', 'Instagram'], ['canonical', 'https://www.instagram.com/tomholland2013/p/CaUsPbUquKV/']],
			links: [['app', 'text/html · up to 660px wide'], ['thumbnail', 'image/jpg · 598×598'], ['icon', 'image · 192×192']]
		}
	};
	const THEMES = [
		['light', 'Light'],
		['dark', 'Dark']
	];
	// the answer's tabs
	const TABS = [
		['code', 'Embed code'],
		['meta', 'Meta & links'],
		['json', 'JSON']
	];

	let active = $state(0);
	let tab = $state('code');
	// a provider asked for by a tile of the hero's wall, on its way here (lib/endpoint.svelte.ts)
	$effect(() => {
		const i = ITEMS.findIndex((p) => p.id === wanted.id);
		if (i < 0) return;
		active = i;
		wanted.id = '';
	});
	let theme = $state('light');
	const dark = $derived(theme === 'dark');
	// the options changed, by provider: each provider keeps its own while another is shown
	let vals = $state<Record<string, string | boolean>>({});
	const it = $derived(ITEMS[active]);
	const get = (key: string) => vals[`${it.id}:${key}`] ?? it.opts.find((o) => o.key === key)!.def;
	const set = (key: string, v: string | boolean) => (vals[`${it.id}:${key}`] = v);
	const str = (key: string) => String(get(key)).trim();
	const shown = $derived(it.opts.filter((o) => !o.only || get(o.only[0]) === o.only[1]));
	// the provider's options that differ from what the answer gave
	const asked = $derived(
		shown.flatMap((o) => {
			const v = get(o.key);
			return v === o.def ? [] : [`${o.key}=${v}`];
		})
	);

	// the request's parameters: those options, then the theme
	const query = $derived([...asked, ...(dark ? ['theme=dark'] : [])]);

	// "42" or "1m10s" as seconds; 0 for anything else
	const secs = (v: string) => {
		const m = /^(?:(\d+)m)?(?:(\d+)s?)?$/.exec(v);
		return m && (m[1] || m[2]) ? +(m[1] ?? 0) * 60 + +(m[2] ?? 0) : 0;
	};
	const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
	const px = (v: string, lo: number, hi: number, or: number) => (/^\d+$/.test(v) ? Math.min(hi, Math.max(lo, +v)) : or);
	const LENGTH = 241; // the video's length, in seconds

	// what the previews and the codes are drawn from
	const yt = $derived({ start: Math.min(secs(str('_start')), LENGTH), end: Math.min(secs(str('_end')), LENGTH), cc: get('_cc_load_policy') === true });
	const x = $derived({ bare: get('_hide_media') === true, width: px(str('_maxwidth'), 220, 550, 0) });
	const figma = $derived({ fixed: get('_layout') === 'horizontal', height: px(str('_height'), 200, 900, 450) });
	const playlist = $derived(get('_playlist') === true);
	const caption = $derived(get('_showcaption') === true);

	// The embed code, as lines: how deep a line is set in, then its parts. A part is plain text, or [text, 'em'] for
	// what an option has changed (blue), or [text, 'i'] for the page's URL (grey).
	type Part = string | [string, 'em' | 'i'];
	type Line = [number, ...Part[]];
	const em = (text: string, changed = true): Part => (changed ? [text, 'em'] : text);
	const FRAME = 'style="…" allowfullscreen';
	const code = $derived.by((): Line[] => {
		if (it.id === 'youtube')
			return [
				[0, '<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">'],
				[1, '<iframe src="https://www.youtube.com/embed/q3lX2p_Uy9I?rel=0&hl=en-US', ...(yt.start ? [em(`&start=${yt.start}`)] : []), ...(yt.end ? [em(`&end=${yt.end}`)] : []), ...(yt.cc ? [em('&cc_load_policy=1')] : []), '"'],
				[2, `${FRAME} scrolling="no" allow="…"></iframe>`],
				[0, '</div>']
			];
		if (it.id === 'spotify')
			return [
				[0, '<div style="left: 0; width: 100%; ', em(`height: ${playlist ? 352 : 152}px;`, !playlist), ' position: relative;">'],
				[1, '<iframe src="https://open.spotify.com/embed/album/2ODvWsOgouMbaA5xf0RkJe?utm_source=oembed', ...(dark ? [em('&theme=0')] : []), '"'],
				[2, 'style="… border-radius: 12px;" allowfullscreen allow="…"></iframe>'],
				[0, '</div>']
			];
		if (it.id === 'x')
			return [
				[0, '<blockquote class="twitter-tweet" data-dnt="true" align="center" data-lang="en"', ...(x.bare ? [em(' data-cards="hidden"')] : []), ...(dark ? [em(' data-theme="dark"')] : []), ...(x.width ? [em(` data-width="${x.width}"`)] : []), '>'],
				[1, '<p lang="en" dir="ltr">It&#39;s pretty awesome how dancing makes robots less intimidating. …</p>'],
				[1, '&mdash; Reza Zadeh (@Reza_Zadeh) <a href="', ['https://twitter.com/Reza_Zadeh/…', 'i'], '">December 29, 2020</a>'],
				[0, '</blockquote>'],
				[0, '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>']
			];
		if (it.id === 'figma')
			return [
				[0, '<div style="left: 0; width: 100%; ', em(figma.fixed ? `height: ${figma.height}px;` : 'height: 0;', !figma.fixed || figma.height !== 450), ' position: relative;', ...(figma.fixed ? [] : [em(' padding-bottom: 56.25%;')]), '">'],
				[1, '<iframe src="https://embed.figma.com/file/zCl6dPZyG0DWoIOvetwBMG/Figma-Basics?embed-host=iframely&node-id=0%3A286&page-selector=1&', em(`theme=${theme}`, dark), '"'],
				[2, `${FRAME}></iframe>`],
				[0, '</div>']
			];
		return [
			[0, '<div style="max-width: 660px;">'],
			[1, '<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 63%; padding-top: 284px;">'],
			[2, '<iframe src="https://cdn.iframe.ly/api/iframe?app=1&url=', ['https%3A%2F%2Fwww.instagram.com%2Fp%2FCaUsPbUquKV%2F', 'i'], '&key=…', ...(dark ? [em('&theme=dark')] : []), ...(caption ? [em('&_showcaption=true')] : []), '"'],
			[3, `${FRAME}></iframe>`],
			[1, '</div>'],
			[0, '</div>'],
			[0, '<script async src="https://cdn.iframe.ly/embed.js" charset="utf-8"><\/script>']
		];
	});

	// The answer as JSON, cut to its shape: a line for each of its parts (each cut at the window's edge: html is the
	// embed code above, whole), but the options, which are written out (their labels left out, so a line never wraps), with
	// their values as they are now (blue once changed).
	const facts = $derived(FACTS[it.id]);
	const json = $derived.by((): Line[] => [
		[0, '{'],
		[1, `"url": ${JSON.stringify(it.url)},`],
		[1, `"meta": { ${facts.meta.map(([k, v]) => `"${k}": ${JSON.stringify(v)}`).join(', ')} },`],
		[1, `"links": { ${facts.links.map(([rel]) => `"${rel}": […]`).join(', ')} },`],
		[1, `"html": ${JSON.stringify(code.map(([, ...parts]) => parts.map((p) => (typeof p === 'string' ? p : p[0])).join('')).join(' ').replaceAll('> <', '><'))},`],
		[1, '"options": {'],
		...shown.map((o, n): Line => {
			const v = get(o.key);
			// (a number stays a number: Figma's height)
			const text = typeof v === 'boolean' || (/^\d+$/.test(v) && /^\d+$/.test(String(o.def))) ? String(v) : JSON.stringify(v);
			return [2, `"${o.key}": { "label": …, "value": `, em(text, v !== o.def), ` }${n < shown.length - 1 ? ',' : ''}`];
		}),
		[1, '}'],
		[0, '}']
	]);
</script>

<!-- a group of the answer's facts: its name, then a line for each, the key and its value -->
{#snippet rows(name: string, list: string[][])}
	<p>{name}</p>
	{#each list as [k, v] (k)}
		<div><span>{k}</span><span class="truncate">{v}</span></div>
	{/each}
{/snippet}

<!-- an option's left side: its label, and under it its parameter, blue once the option is changed -->
{#snippet title(label: string, key: string, changed: boolean)}
	<span class="name"><span>{label}</span><span class="param" class:set={changed}>{key}</span></span>
{/snippet}

{#snippet triangle(size: number)}
	<svg width={size} height={size} viewBox="0 0 14 14" fill="#fff"><path d="M3 1.5v11l9-5.5z" /></svg>
{/snippet}

<div class="paper h-full rounded-md p-4 sm:p-6">
	<!-- the providers, as tabs on the paper above the window: each sends another URL to the same endpoint -->
	<div class="mb-4 flex flex-wrap items-center gap-2">
		{#each ITEMS as p, i (p.id)}
			<button type="button" class="chip" aria-pressed={i === active} onclick={() => (active = i)}>
				<img src={logo(p.id)} alt="" width="16" height="16" />{p.name}
			</button>
		{/each}
	</div>
	<!-- the request, a strip of its own: the options changed and the theme follow the URL, in blue -->
	<div class="win bar rounded-md bg-white">
		<span class="verb">GET</span>
		<span class="shrink-0">iframe.ly/api/iframely</span>
		<span class="truncate">?url=<b>{it.url}</b>{#each query as q (q)}<em>&amp;{q}</em>{/each}</span>
	</div>
	<div class="mt-3 grid gap-3 lg:grid-cols-[1.9fr_1.1fr]">
		<!-- the first window: the embed and its form -->
		<div class="win grid overflow-hidden rounded-md bg-white sm:grid-cols-[1.05fr_0.85fr]">
			<!-- 1: the embed, rendered -->
			<div class="col stage" aria-hidden="true">
				<p class="label">Embed preview</p>
				{#key active}
					<!-- a fixed height, so the window does not change size from one provider to the next -->
					<div class="swap grid h-[240px] place-items-center">
						{#if it.id === 'youtube'}
							<div class="base relative aspect-video w-full overflow-hidden rounded-sm" class:night={dark}>
								<div class="absolute top-3 left-3 flex items-center gap-2">
									<span class="tint2 size-6 shrink-0 rounded-full"></span>
									<span class="ink text-[11px] leading-[1.25] font-medium">Jungle - Back On 74 (Official Video)<br /><span class="dim font-normal">Jungle4eva</span></span>
								</div>
								<!-- YouTube's own play button shape, in the page's blue (as blocks 02 and 03) -->
								<svg class="mark" width="54" height="38" viewBox="0 0 68 48">
									<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="var(--color-rich)" />
									<path d="M45 24 27 14v20z" fill="#fff" />
								</svg>
								{#if yt.cc}<span class="cc">[music playing]</span>{/if}
								<span class="dim absolute bottom-3 left-3 font-mono text-[11px] leading-none">{clock(yt.start)}{yt.end ? ` / ${clock(yt.end)}` : ''}</span>
								<!-- the track: blue up to where the video starts, and a mark where it ends -->
								<span class="tint2 absolute inset-x-0 bottom-0 h-[3px]">
									<span class="fill" style:width="{(yt.start / LENGTH) * 100}%"></span>
									{#if yt.end}<span class="inkbg absolute inset-y-0 w-[2px]" style:left="{(yt.end / LENGTH) * 100}%"></span>{/if}
								</span>
							</div>
						{:else if it.id === 'spotify'}
							<div class="base w-full overflow-hidden rounded-md" class:night={dark}>
								<div class="flex items-center gap-3 p-3">
									<span class="tint2 size-16 shrink-0 rounded-sm"></span>
									<span class="ink grow text-[13px] leading-[1.3] font-medium">Starboy<br /><span class="dim text-[11px] font-normal">The Weeknd</span></span>
									<span class="play static! translate-none! size-9!">{@render triangle(11)}</span>
								</div>
								{#if playlist}
									{#each [['Starboy', '03:50'], ['Party Monster', '04:09'], ['False Alarm', '03:40']] as [title, length], n (title)}
										<div class="row ink flex h-8 items-center gap-3 px-3 text-[11px] leading-none">
											<span class="dim w-2">{n + 1}</span><span class="grow">{title}</span><span class="dim font-mono">{length}</span>
										</div>
									{/each}
								{/if}
							</div>
						{:else if it.id === 'x'}
							<!-- as wide as "Adjust width" makes it: 300px here stands for the post's full 550 -->
							<div class="card ink tone w-full rounded-md p-3" class:night={dark} style:max-width="{((x.width || 550) / 550) * 300}px">
								<div class="flex items-center gap-2">
									<span class="tint2 size-7 shrink-0 rounded-full"></span>
									<span class="text-[11px] leading-[1.25] font-medium">Reza Zadeh<br /><span class="dim font-normal">@Reza_Zadeh</span></span>
								</div>
								<p class="mt-2 line-clamp-2 text-[11px] leading-[1.35]">It's pretty awesome how dancing makes robots less intimidating. Looking forward to seeing more.</p>
								{#if !x.bare}
									<div class="tint relative mt-2 h-[78px] rounded-sm"><span class="play size-7!">{@render triangle(9)}</span></div>
								{/if}
								<p class="dim mt-2 text-[10px] leading-none">8:55 PM · Dec 29, 2020</p>
							</div>
						{:else if it.id === 'figma'}
							<!-- the file's frame: at a fixed height it is as wide as its column and as tall as "Adjust height" makes
							     it (450px is drawn 150px tall); at 16:9 it takes its height from its width -->
							<div class="card flex flex-col overflow-hidden rounded-sm {figma.fixed ? 'w-full' : 'aspect-video h-[200px] max-w-full'}" class:night={dark}>
								<div class="tint frame flex items-center justify-center gap-1.5 px-3 {figma.fixed ? '' : 'grow'}" style:height={figma.fixed ? `${Math.min(206, (figma.height / 450) * 150)}px` : undefined}>
									<span class="inkbg h-5 w-6 shrink-0 rounded-[2px]"></span>
									{#each Array(7) as _, k (k)}<span class="card h-7 w-6 shrink-0 rounded-[2px]"></span>{/each}
								</div>
								<div class="ink flex h-7 shrink-0 items-center gap-2 px-3 text-[11px] leading-none">
									<img src={logo('figma')} alt="" width="10" height="10" />Figma Basics<span class="dim ml-auto text-[10px]">Edited 5 years ago</span>
								</div>
							</div>
						{:else}
							<div class="card w-[200px] overflow-hidden rounded-sm" class:night={dark}>
								<div class="flex h-9 items-center gap-2 px-2">
									<span class="tint2 size-5 shrink-0 rounded-full"></span>
									<span class="ink text-[11px] leading-none font-medium">tomholland2013</span>
									<span class="ml-auto rounded-sm bg-rich px-1.5 py-1 text-[9px] leading-none font-medium text-white">View profile</span>
								</div>
								<div class="tint {caption ? 'h-[136px]' : 'h-[166px]'}"></div>
								{#if caption}
									<div class="space-y-1.5 p-2">
										<div class="h-1.5 w-[85%] rounded-full tint2"></div>
										<div class="h-1.5 w-[55%] rounded-full tint2"></div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<!-- 2: the provider's options for this URL, as a small form -->
			<div class="col">
				<p class="label">{it.name} options</p>
				{#key active}
					<div class="swap">
						{#each shown as o (o.key)}
							{#if o.kind === 'check'}
								<!-- (the whole row is the switch) -->
								<button type="button" class="opt" role="switch" aria-checked={get(o.key) === true} onclick={() => set(o.key, get(o.key) !== true)}>
									{@render title(o.label, o.key, get(o.key) !== o.def)}
									<span class="knob" aria-hidden="true"></span>
								</button>
							{:else}
								<div class="opt" role="group" aria-label={o.label}>
									{@render title(o.label, o.key, get(o.key) !== o.def)}
									<span class="seg">
										{#each o.values ?? [] as [value, text] (value)}
											<button type="button" aria-pressed={get(o.key) === value} onclick={() => set(o.key, value)}>{text}</button>
										{/each}
									</span>
								</div>
							{/if}
						{/each}
						<!-- the theme: the one option every provider has, kept from one provider to the next -->
						<div class="opt" role="group" aria-label="Theme">
							{@render title('Theme', 'theme', dark)}
							<span class="seg">
								{#each THEMES as [t, text] (t)}
									<button type="button" aria-pressed={theme === t} onclick={() => (theme = t)}>{text}</button>
								{/each}
							</span>
						</div>
					</div>
				{/key}
			</div>

		</div>

		<!-- the second window: the answer, in tabs. What the theme or an option changed in it is blue. -->
		<div class="win overflow-hidden rounded-md bg-white">
			<div class="col">
				<div class="tabs" role="tablist" aria-label="The answer">
					{#each TABS as [id, name] (id)}
						<button type="button" role="tab" aria-selected={tab === id} onclick={() => (tab = id)}>{name}</button>
					{/each}
				</div>
				{#key `${active}:${tab}`}
					{#if tab === 'meta'}
						<div class="kv swap">
							{@render rows('meta', facts.meta)}
							{@render rows('links', facts.links)}
						</div>
					{:else}
						<!-- (of the JSON only the options are written out whole: its other lines are cut at the window's edge) -->
						<div class="code swap">
							{#each tab === 'json' ? json : code as [depth, ...parts], n (n)}
								<span class:cut={tab === 'json' && depth < 2} style="--d:{depth}">{#each parts as part, k (k)}{#if typeof part === 'string'}{part}{:else if part[1] === 'em'}<wbr /><em>{part[0]}</em>{:else}<i>{part[0]}</i>{/if}{/each}</span>
							{/each}
						</div>
					{/if}
				{/key}
			</div>
		</div>
	</div>
</div>

<style>
	/* the grey of the cards' covers, plain: no pattern */
	.paper {
		background-color: #fafafa;
	}
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 16px;
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	.bar b {
		font-weight: inherit;
		color: var(--color-mute);
	}
	/* an option in the request, and what it changed in the embed code */
	.bar em,
	.code em {
		font-style: normal;
		color: var(--color-rich);
	}
	.verb {
		margin-right: 8px;
		padding: 3px 6px;
		border-radius: 4px;
		background: color-mix(in srgb, var(--color-rich) 10%, white);
		color: var(--color-rich);
		font-weight: 600;
		font-size: 11px;
	}
	/* an option's values to pick from, in a row: the chosen one as the verb's chip, the others grey */
	.seg {
		display: inline-flex;
		flex-shrink: 0;
		border-radius: 5px;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
		font-size: 12px;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.seg button {
		padding: 6px 9px;
		border-radius: 5px;
		font: inherit;
		color: var(--color-mute);
		cursor: pointer;
		transition:
			color 0.15s,
			background-color 0.15s;
	}
	.seg button:hover {
		color: var(--color-fg);
	}
	.seg button[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-rich) 10%, white);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-rich) 35%, white);
		color: var(--color-rich);
	}
	.seg button:focus-visible,
	button.opt:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 1px;
	}
	/* a column of the answer: its name in small grey type, then the thing; hairlines between the columns */
	.col {
		min-width: 0;
		padding: 14px 16px 16px;
	}
	.col + .col {
		border-top: 1px solid rgb(0 0 0 / 0.07);
	}
	@media (min-width: 640px) {
		.col + .col {
			border-top: 0;
			border-left: 1px solid rgb(0 0 0 / 0.07);
		}
	}
	.label {
		margin-bottom: 12px;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
	}
	/* The preview's colours: the drawings are made of these, so the theme changes a whole embed at once. .night, on
	   an embed, is the dark set: the embed goes dark, the column it stands in does not. */
	.stage {
		--ink: var(--color-fg);
		--dim: var(--color-mute);
		--base: rgb(0 0 0 / 0.07);
		--tint: rgb(0 0 0 / 0.07);
		--tint2: rgb(0 0 0 / 0.13);
		--card: #fff;
		--edge: rgb(0 0 0 / 0.12);
	}
	.night {
		--ink: #fff;
		--dim: rgb(255 255 255 / 0.55);
		--base: #1d1d1f;
		--tint: rgb(255 255 255 / 0.1);
		--tint2: rgb(255 255 255 / 0.2);
		--card: #1d1d1f;
		--edge: rgb(255 255 255 / 0.14);
	}
	/* (an embed with no card of its own: a grey ground, or the dark one) */
	.base {
		background: var(--base);
		transition: background-color 0.2s;
	}
	.ink {
		color: var(--ink);
	}
	.dim {
		color: var(--dim);
	}
	.tint {
		background: var(--tint);
	}
	.tint2 {
		background: var(--tint2);
	}
	.inkbg {
		background: var(--ink);
	}
	.card {
		background: var(--card);
		box-shadow: 0 0 0 1px var(--edge);
	}
	.row {
		border-top: 1px solid var(--tint);
	}
	@media (prefers-reduced-motion: reduce) {
		.base {
			transition: none;
		}
	}
	/* An option of the form, a row, the same for every option: at its left its label with its parameter under it (blue
	   once the option is changed), at its right its control, a switch (on or off) or a few values to pick from.
	   Hairlines between the rows. Where a row is too narrow for both sides, the control goes under the label. */
	.opt {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		width: 100%;
		padding: 10px 0;
		font-size: 13px;
		line-height: 1.25;
		color: var(--color-body);
		text-align: left;
	}
	.opt:first-child {
		padding-top: 4px;
	}
	.opt + .opt {
		border-top: 1px solid rgb(0 0 0 / 0.06);
	}
	button.opt {
		cursor: pointer;
	}
	.name {
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		gap: 5px;
		min-width: min-content;
	}
	/* the switch: a track with a knob, grey and at the left while off, blue and at the right while on */
	.knob {
		position: relative;
		flex-shrink: 0;
		width: 30px;
		height: 18px;
		border-radius: 999px;
		background: rgb(0 0 0 / 0.16);
		transition: background-color 0.15s;
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 999px;
		background: #fff;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
		transition: translate 0.15s;
	}
	button.opt:hover .knob {
		background: rgb(0 0 0 / 0.26);
	}
	.opt[aria-checked='true'] .knob,
	.opt[aria-checked='true']:hover .knob {
		background: var(--color-rich);
	}
	.opt[aria-checked='true'] .knob::after {
		translate: 12px 0;
	}
	.param {
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
		color: var(--color-soft);
		transition: color 0.15s;
	}
	.param.set {
		color: var(--color-rich);
	}
	/* The embed code: a line may wrap, and its rest hangs two characters in from its start. As tall as the preview at
	   least, so the window is one height whatever the provider. */
	.code {
		min-height: 240px;
		font:
			11.5px/1.7 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
	}
	.code span {
		display: block;
		padding-left: calc(var(--d) * 2ch + 2ch);
		text-indent: -2ch;
		overflow-wrap: anywhere;
	}
	.code i {
		font-style: normal;
		color: var(--color-mute);
	}
	/* (a line of the JSON that is not written out whole: one line, cut at the window's edge) */
	.code .cut {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	/* The answer's tabs, where the other columns have their names, in the same small type: the one shown is blue. */
	.tabs {
		display: flex;
		gap: 16px;
		margin-bottom: 12px;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
	}
	.tabs button {
		margin: -6px 0;
		padding: 6px 0;
		font: inherit;
		color: var(--color-mute);
		cursor: pointer;
		transition: color 0.15s;
	}
	.tabs button:hover {
		color: var(--color-fg);
	}
	.tabs button[aria-selected='true'] {
		color: var(--color-rich);
	}
	.tabs button:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
		border-radius: 2px;
	}
	/* The meta and the links: a group's name, then its lines set in under it, the key in grey and the value after it,
	   cut at the window's edge. In the code's type, and as tall as the code at least. */
	.kv {
		min-height: 240px;
		font:
			11.5px/1.7 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
	}
	.kv p {
		font-weight: 600;
	}
	.kv div + p {
		margin-top: 8px;
	}
	.kv div {
		display: grid;
		grid-template-columns: 12ch minmax(0, 1fr);
		padding-left: 2ch;
	}
	.kv div span:first-child {
		color: var(--color-mute);
	}
	/* (what an option changed goes to the next line whole, not broken in the middle) */
	.code em {
		white-space: nowrap;
	}
	/* a new provider's answer comes in softly */
	.swap {
		animation: swap 0.3s ease-out;
	}
	@keyframes swap {
		from {
			opacity: 0;
		}
	}
	.play,
	.mark {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}
	.play {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		background: var(--color-rich);
	}
	/* the video's progress: it jumps to where the video starts */
	.fill {
		display: block;
		height: 100%;
		background: var(--color-rich);
		transition: width 0.3s ease;
	}
	/* closed captions, over the video's foot */
	.cc {
		position: absolute;
		bottom: 30px;
		left: 50%;
		padding: 4px 7px;
		translate: -50% 0;
		border-radius: 3px;
		background: rgb(0 0 0 / 0.7);
		font-size: 11px;
		line-height: 1;
		white-space: nowrap;
		color: #fff;
	}
	/* an embed that takes a theme or a size changes softly */
	.tone,
	.frame {
		transition:
			background-color 0.2s,
			color 0.2s,
			box-shadow 0.2s,
			max-width 0.25s ease,
			height 0.25s ease;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 6px 12px 6px 9px;
		border-radius: 999px;
		background: #fff;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
		font-size: 13px;
		line-height: 1;
		font-weight: 500;
		color: var(--color-body);
		cursor: pointer;
		transition:
			background-color 0.2s,
			box-shadow 0.2s,
			color 0.2s;
	}
	.chip:hover {
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.28);
	}
	.chip:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	.chip[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-rich) 8%, white);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-rich) 45%, white);
		color: var(--color-rich);
	}
	@media (prefers-reduced-motion: reduce) {
		.swap {
			animation: none;
		}
		.chip,
		.fill,
		.tone,
		.frame,
		.knob,
		.knob::after,
		.param,
		.seg button {
			transition: none;
		}
	}
</style>
