<script lang="ts">
	// The figure of the "For developers" block on /embeds: "connect once" as a drawing, straight on the page (no
	// paper, no card). On the left five links, each a provider's mark in a white tile (block 04's tiles) with its URL;
	// thin lines run from all five into one node, the endpoint; one line leaves the node for a window with the embed
	// of the link picked. The picked link's line is blue, the others grey.
	// The links take turns on their own (every TURN seconds; not while the pointer or the keyboard's focus is in the
	// figure, nor out of view, nor with reduced motion); pointing at one, or pressing it, picks it. A tile of the
	// hero's wall names its provider on its way here (lib/endpoint.svelte.ts), and that one is picked.
	// Under lg the figure stands upright: the tiles in a row with the picked link's URL under them, the node, the
	// window; short stems for the lines.
	// (A sample, 2026-11-24. Before it: a scene that works, components/EndpointDemo.svelte, kept in its file: the
	// providers, the request, the embed with a form of its options, the answer in tabs. Its previews are drawn here
	// again, as they are with no option changed.)
	// The links are real ones, popular in 2026 (but Figma's, an invented file), and what the window says of each (its
	// title, its author, how it is sized, its options) is from the API's answers for them, asked 2026-11-24. The
	// previews are drawn, not fetched. (They were the URLs of EndpointDemo, the docs' old samples.)
	import { onMount } from 'svelte';
	import { wanted } from '#lib/endpoint.svelte.ts';

	// (Tried 2026-11-24 and taken back: the block's three texts under the figure as switches for it, each for the part
	// it stands under. The editor's framed the links as "Your editor"; oEmbed's made the node iframe.ly/api/oembed
	// with oEmbed's fields under it; embed.js's put the embed's markup, a link and the script, in the window.)

	// (the logos are SVGs, but The Verge's: its own site icon, a PNG of 512px)
	const SRC = import.meta.glob('../assets/providers/*.{svg,png}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`] ?? SRC[`../assets/providers/${id}.png`];

	// id (the logo's file), name, the URL sent (without its scheme), and how its embed is sized, for the right end of
	// the window's bar: responsive or of a fixed height, and its ratio or its measure. (The measures alone stood
	// there, as "16:9", "352px tall", "up to 550px wide", after the provider's name.)
	const ITEMS = [
		// Justice's "Flower In A Hurricane" video (of 2026-10-15), from Grand Theft Auto VI's score: among the most
		// viewed of this year's by European artists (about 30 million views by chartslist.com's count on 2026-11-24),
		// picked by the site's owner. (It was Jungle's "Back On 74", youtube.com/watch?v=q3lX2p_Uy9I; and for a
		// moment Taylor Swift's "Patient Zero", youtube.com/watch?v=mw3kSNIxjqo.)
		['youtube', 'YouTube', 'youtube.com/watch?v=5dPwBWvmcbQ', 'responsive · 16:9'],
		// The album of Grand Theft Auto VI, of 2026-11-20: the link the site's owner gave (without its ?si= part, which
		// names who shared it). (It was The Weeknd's "Starboy", open.spotify.com/album/2ODvWsOgouMbaA5xf0RkJe; and for
		// a moment Olivia Rodrigo's album of 2026, open.spotify.com/album/3WZZF72ihlKPZBS4zSsNHl.)
		['spotify', 'Spotify', 'open.spotify.com/album/5BYKG4MHfySZthe2W6r7n4', 'fixed height · 352px'],
		// Erling Haaland's post of 2026-07-05, the most liked post of an athlete on X (about 2.6 million likes by
		// 2026-07-08, by Wikipedia's list). (It was an invented post, x.com/norafield/status/…; before it the post our
		// docs show, and for a while the hero wall's NASA post.)
		['x', 'X', 'x.com/Erling/status/2073901686410608901', 'responsive · up to 550px'],
		// (an invented file, "3D transforms playground": its key is made up. It was the docs' "Figma Basics" file,
		// figma.com/file/zCl6dPZyG0DWoIOvetwBMG/Figma-Basics, a real one, last edited five years ago.)
		['figma', 'Figma', 'figma.com/design/Qp7WmZk2TtY4xN8rLhVb3c/3D-transforms-playground', 'fixed height · 450px'],
		// An article, for the summary card any page gets: The Verge's review of the iPhone Duo (of 2026-10-21), the link
		// the site's owner gave, as its logo is (the site's own icon, assets/providers/theverge.png; a page was drawn in
		// its tile before, as it still is for a link with no logo). (It was Game Informer's review
		// of Grand Theft Auto VI, gameinformer.com/review/grand-theft-auto-vi/outrageous-fortune, a third sample
		// about that game; and before it an Instagram post stood here, instagram.com/p/CaUsPbUquKV/.)
		// (Its bar says "responsive" only: the card's measure, a 3:2 picture and 120px of text under it, was there too.)
		['theverge', 'The Verge', 'theverge.com/tech/1015028/iphone-duo-review', 'responsive']
	];
	// (The window had a foot with each URL's options, as the API answered them: start time, end time, captions; track
	// list, on; hide media, max width; layout, height; small card. It is gone: options are the next block's matter.)
	const TURN = 4;
	// The drawing's measures, in px: a link's row, and so the figure's height and the node's level (its middle).
	const ROW = 68;
	const H = ROW * ITEMS.length;
	const y = (i: number) => ROW / 2 + ROW * i;
	// a line from a link's row to the node, across the lines' box (100 wide, stretched to its column)
	const path = (i: number) => `M0 ${y(i)}C55 ${y(i)} 45 ${H / 2} 100 ${H / 2}`;

	let active = $state(0);
	const [id, name, , size] = $derived(ITEMS[active]);
	$effect(() => {
		const i = ITEMS.findIndex((p) => p[0] === wanted.id);
		if (i < 0) return;
		active = i;
		wanted.id = '';
	});

	let box: HTMLDivElement;
	let seen = $state(false);
	let held = $state(false);
	onMount(() => {
		const io = new IntersectionObserver((es) => (seen = es[0].isIntersecting), { threshold: 0.35 });
		io.observe(box);
		return () => io.disconnect();
	});
	$effect(() => {
		if (!seen || held || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const t = setInterval(() => (active = (active + 1) % ITEMS.length), TURN * 1000);
		return () => clearInterval(t);
	});
	// The answer's line under the node is decoded with every link: its letters are others at first, and from 0.2s
	// (when the line in has reached the node) they turn into the text from the left, in 12 steps of 30ms. The
	// spaces stand, and the letters are of one width, so the line keeps its shape. (It only faded in before.)
	const BACK = '{ html, meta, links, options }';
	const GLYPHS = 'abcdefghijklmnopqrstuvwxyz{}[]:,"';
	const STEPS = 12;
	let back = $state(BACK);
	$effect(() => {
		void active;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let step = 0;
		let tick: ReturnType<typeof setInterval> | undefined;
		const mix = () =>
			(back = [...BACK]
				.map((c, i) => (c === ' ' || i < (step / STEPS) * BACK.length ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
				.join(''));
		mix();
		const wait = setTimeout(() => {
			tick = setInterval(() => {
				step++;
				mix();
				if (step >= STEPS) clearInterval(tick);
			}, 30);
		}, 200);
		return () => {
			clearTimeout(wait);
			clearInterval(tick);
		};
	});
</script>

{#snippet triangle(size: number, fill = '#fff')}
	<svg width={size} height={size} viewBox="0 0 14 14" {fill}><path d="M3 1.5v11l9-5.5z" /></svg>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={box}
	class="hub grid items-center gap-y-0 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
	style="--h:{H}px;--row:{ROW}px"
	onpointerenter={() => (held = true)}
	onpointerleave={() => (held = false)}
	onfocusin={() => (held = true)}
	onfocusout={() => (held = false)}
>
	<!-- Three parts from lg up: what goes in, the node, what comes out. The two sides are one width, so the node is in
	     the middle of the page. (They were five columns, the links' as wide as its longest URL, and the node stood
	     right of the middle.) Under lg the sides are no boxes: their things stand one under another. -->
	<div class="side">
	<!-- the links: a provider's mark in a tile, and its URL -->
	<div class="links">
		{#each ITEMS as [pid, pname, url], i (pid)}
			<button type="button" class="link" aria-pressed={i === active} aria-label={pname} onpointerenter={() => (active = i)} onclick={() => (active = i)}>
				<span class="mark">
					{#if logo(pid)}
						<img src={logo(pid)} alt="" width="18" height="18" />
					{:else}
						<!-- (a link with no logo of ours, the article: a page with a picture and lines) -->
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#131316" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.700" y="1.700" width="12.600" height="14.600" rx="2" /><path d="M5.700 5.200h6.600v3.300H5.700zM5.700 11h6.600M5.700 13.300h4" /></svg>
					{/if}
				</span>
				<span class="url">{url}</span>
			</button>
		{/each}
	</div>
	<!-- (under lg: the picked link's URL, under the row of tiles) -->
	<p class="one-url lg:hidden">{ITEMS[active][2]}</p>
	<span class="stem lg:hidden" aria-hidden="true"></span>

	<!-- the lines from the links into the node: all five in grey, the picked one drawn over them in blue -->
	<!-- (two drawings, one on the other: the blue line's is wiped in from the left. A dash drawn along the line does
	     not work here: the lines keep their width while their box is stretched, and then dashes are measured on the
	     screen, not along the line.) -->
	<div class="fan max-lg:hidden" aria-hidden="true">
		<svg viewBox="0 0 100 {H}" preserveAspectRatio="none" fill="none">
			{#each ITEMS as [pid], i (pid)}<path d={path(i)} />{/each}
		</svg>
		{#key active}
			<svg class="on" viewBox="0 0 100 {H}" preserveAspectRatio="none" fill="none"><path d={path(active)} /></svg>
		{/key}
	</div>
	</div>

	<!-- the node: the one endpoint; and under it, small, what it answers with: the status and the answer's parts by
	     their names in the JSON, "html" (what the window shows) darker than the rest. The figure had no sign of the
	     answer before: a link went in and an embed came out, as in the hero. From lg up the line hangs under the
	     node and takes no room; under lg it stands between the node and the stem to the window. -->
	<div class="mid">
		<p class="node"><span class="verb">GET</span>iframe.ly/api/iframely<span class="text-mute">?url=</span></p>
		<!-- (keyed: with every link it is gone, and comes back as the link's line reaches the node) -->
		{#key active}
			<p class="back" aria-hidden="true"><span class="code">200</span>{back.slice(0, 2)}<b>{back.slice(2, 6)}</b>{back.slice(6)}</p>
		{/key}
	</div>

	<div class="side">
	<!-- the line out of the node -->
	{#key active}<span class="out max-lg:hidden" aria-hidden="true"></span>{/key}
	<span class="stem lg:hidden" aria-hidden="true"></span>

	<!-- the embed that comes back -->
	<div class="win overflow-hidden rounded-md bg-white" aria-hidden="true">
		<!-- the bar: whose embed it is, and how it is sized (the left end said "html", the answer's field) -->
		<div class="bar"><b>{name}</b><span class="ml-auto text-mute">{size}</span></div>
		{#key active}
			<div class="swap grid place-items-center p-5">
				{#if id === 'youtube'}
					<div class="tint relative aspect-video w-full overflow-hidden rounded-sm">
						<!-- (the video's title is long, and is cut at the player's edge, as YouTube's own player cuts it; it is
						     without its first words, "Justice - ", which the channel's name under it says again) -->
						<div class="absolute top-3 right-3 left-3 flex items-center gap-2">
							<span class="tint2 size-6 shrink-0 rounded-full"></span>
							<span class="min-w-0 text-[11px] leading-[1.25] font-medium text-fg"><span class="block truncate">Flower In A Hurricane (ft Tame Impala, SZA, King Gizzard & the Lizard Wizard) [from GTAVI]</span><span class="font-normal text-mute">Justice</span></span>
						</div>
						<!-- YouTube's own play button, its shape and its red (as block 02's first scene; it was in the page's blue) -->
						<svg class="centre" width="54" height="38" viewBox="0 0 68 48">
							<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00" />
							<path d="M45 24 27 14v20z" fill="#fff" />
						</svg>
						<span class="absolute bottom-3 left-3 font-mono text-[11px] leading-none text-mute">0:00 / 3:45</span>
						<span class="tint2 absolute inset-x-0 bottom-0 h-[3px]"></span>
					</div>
				{:else if id === 'spotify'}
					<!-- (grey, as the other embeds here. For a moment the player was in the colours of the album's cover, a
					     sunset: violet into pink, with white words. Taken back.) -->
					<div class="tint w-full overflow-hidden rounded-md">
						<div class="flex items-center gap-3 p-3">
							<span class="tint2 size-16 shrink-0 rounded-sm"></span>
							<!-- (the album, its artist as Spotify names it, and its first three songs with their lengths, as its player lists them) -->
							<span class="grow text-[13px] leading-[1.3] font-medium text-fg">Grand Theft Auto VI: The Album<br /><span class="text-[11px] font-normal text-mute">Grand Theft Auto VI</span></span>
							<!-- Spotify's own play button: its green disc with a black mark (it was in the page's blue, with a white one) -->
							<span class="play green size-9">{@render triangle(11, '#000')}</span>
						</div>
						{#each [['Starting From Zero (feat. Michael McDonald)', '03:09'], ['That’s It (feat. Future & Metro Boomin)', '02:41'], ['AHH YEA', '02:00']] as [title, length], n (title)}
							<div class="line flex h-8 items-center gap-3 px-3 text-[11px] leading-none text-fg">
								<span class="w-2 text-mute">{n + 1}</span><span class="min-w-0 grow truncate leading-[1.4]">{title}</span><span class="font-mono text-mute">{length}</span>
							</div>
						{/each}
					</div>
				{:else if id === 'x'}
					<!-- A post in the card of the hero wall's X tile (components/EmbedWallHero.svelte): a head, the words, a
					     picture, the row of actions. What is in it is a real post, Erling Haaland's of 2026-07-05: its
					     author, handle, date and words are the post's own; a grey disc for the avatar and a plain grey
					     box for its photo. Of the counts two are known: the likes (about 2.6 million by 2026-07-08, by
					     Wikipedia's list) and the views (over 90 million, as hitc.com reported). The replies and the
					     reposts are NOT known: 24K and 310K are our guesses, of the size such a post has (the row had
					     no numbers for them at first). Nothing in it is pressed here. (For a while it was the hero's
					     post itself, NASA's drawn avatar and the Webb mirror, the same thing twice on a page; then the
					     real post our docs show, Reza Zadeh's of 2020, with made-up counts on it; then an invented
					     post, "Nora Field" on a slow train.) -->
					<!-- (228px at most, as it was with the foot under it: taller, its grey box was too big) -->
					<div class="card flex h-full max-h-[228px] w-full max-w-[300px] flex-col rounded-md p-3.5">
						<div class="flex items-center gap-2">
							<span class="tint2 size-7 flex-none rounded-full"></span>
							<div>
								<div class="text-[12px] leading-[1.3] font-semibold text-fg">Erling Haaland</div>
								<div class="text-[11px] leading-[1.3] text-mute">@Erling · Jul 5</div>
							</div>
						</div>
						<div class="my-2.5 text-[13px] leading-[1.45] text-fg">Well well well 😂</div>
						<div class="min-h-[48px] flex-1 rounded-sm bg-[#e9e9eb]"></div>
						<!-- the row of actions, as X draws it: reply, repost, like and views with their counts, then bookmark and share -->
						<div class="mt-2.5 flex items-center gap-3 text-[11px] leading-none text-mute">
							{#each [['M4 5h16v11H10.500L6 19.500V16H4z', '24K'], ['M7 7h10v8M17 15l-2.500-2.500M17 15l2.500-2.500M17 17H7V9M7 9l-2.500 2.500M7 9l2.500 2.500', '310K'], ['M12 20s-7.500-4.600-7.500-10A4.200 4.200 0 0 1 12 7.500 4.200 4.200 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10z', '2.6M'], ['M5 20v-6M10 20V9M15 20v-9M20 20V4', '90M']] as [d, n] (d)}
								<span class="flex items-center gap-1">
									<svg class="flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path {d} /></svg>
									{n}
								</span>
							{/each}
							<svg class="ml-auto flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v16l-6-4.500L6 20z" /></svg>
							<svg class="-ml-2 flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M12 4 8 8M12 4l4 4M5 14v5h14v-5" /></svg>
						</div>
					</div>
				{:else if id === 'figma'}
					<div class="card flex w-full flex-col overflow-hidden rounded-sm">
						<div class="tint flex h-[150px] items-center justify-center gap-1.5 px-3">
							<!-- the first artboard, the file's cover: a plain grey box, a little wider than the rest (it was
							     near-black, too loud here; and for a while a small cube was drawn on it, grey sides and a
							     blue top: more than it needs) -->
							<span class="h-7 w-9 shrink-0 rounded-[2px] bg-black/20"></span>
							{#each Array(7) as _, k (k)}<span class="card h-7 w-6 shrink-0 rounded-[2px]"></span>{/each}
						</div>
						<div class="flex h-7 shrink-0 items-center gap-2 px-3 text-[11px] leading-none text-fg">
							<!-- (when it was edited is said in days ago and not as a date, so it is never old: under two weeks on any day) -->
							<img src={logo('figma')} alt="" width="10" height="10" />3D transforms playground<span class="ml-auto text-[10px] text-mute">Edited 3 days ago</span>
						</div>
					</div>
				{:else}
					<!-- the article's summary card, as block 02's card: a grey box for its picture, then the site, the title
					     and the description, which are the page's own (cut to two lines each) -->
					<div class="card flex h-full max-h-[228px] w-full max-w-[320px] flex-col overflow-hidden rounded-md">
						<div class="tint min-h-[56px] flex-1"></div>
						<div class="shrink-0 p-3">
							<p class="flex items-center gap-1.5 text-[10px] leading-none text-mute"><img src={logo('theverge')} alt="" width="10" height="10" />The Verge</p>
							<p class="mt-2 line-clamp-2 text-[13px] leading-[1.3] font-medium text-fg">The iPhone Duo is a messy, expensive good time</p>
							<p class="mt-1 line-clamp-2 text-[11px] leading-[1.4] text-mute">The iPhone Duo is the riskiest Apple product in years.</p>
						</div>
					</div>
				{/if}
			</div>
		{/key}
	</div>
	</div>
</div>

<style>
	/* a side of the node: in a row from lg up (the links and their lines; the line out and the window), and no box
	   under lg, where its things are the figure's own, one under another */
	.side {
		display: contents;
	}
	@media (min-width: 1024px) {
		.side {
			display: flex;
			align-items: center;
			min-width: 0;
		}
		.links {
			flex: none;
		}
		.fan {
			flex: 1 0 40px;
		}
		.out {
			flex: 1 0 32px;
		}
		.win {
			flex: 0 1 400px;
			min-width: 0;
		}
	}
	/* a link: its mark's tile, then its URL; the row is --row tall, so the lines' ends are level with the tiles */
	.link {
		display: flex;
		align-items: center;
		gap: 12px;
		height: var(--row);
		cursor: pointer;
		text-align: left;
	}
	/* the tile of block 04's timeline: white, a hairline round it; the picked one has that block's soft blue ring */
	.mark {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 9px;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.1);
		transition: box-shadow 0.2s;
	}
	@supports (corner-shape: squircle) {
		.mark {
			border-radius: 14px;
			corner-shape: squircle;
		}
	}
	.link[aria-pressed='true'] .mark {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.1),
			0 0 0 4px color-mix(in srgb, var(--color-rich) 16%, transparent);
	}
	.link:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
		border-radius: 4px;
	}
	.url,
	.one-url {
		overflow: hidden;
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	/* (a URL is cut short, so that the links' side has room for its lines: it was up to 300px. A narrower column
	   still, URLs of 190px at most, was tried and taken back.) */
	.url {
		max-width: 190px;
		padding-right: 12px;
		color: var(--color-mute);
		transition: color 0.2s;
	}
	@media (min-width: 1280px) {
		.url {
			max-width: 240px;
		}
	}
	.link[aria-pressed='true'] .url {
		color: var(--color-fg);
	}
	/* the lines: hairlines, whatever the width their box is stretched to; the picked one is wiped in, in blue */
	.fan {
		position: relative;
		height: var(--h);
	}
	.fan svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.fan path {
		stroke: rgb(0 0 0 / 0.14);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	/* (The change takes under half a second in all: the line in in 0.2s, the line out right after, then the embed.
	   It took 0.8s, the line alone 0.4s: too slow.) */
	.fan .on {
		animation: wipe 0.2s ease-out both;
	}
	.fan .on path {
		stroke: var(--color-rich);
		stroke-width: 1.5;
	}
	@keyframes wipe {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0);
		}
	}
	/* the node: the endpoint, in the type of the windows' bars */
	/* the node and the line of its answer: the node alone is the box's height from lg up, so it stays on the lines' level */
	.mid {
		position: relative;
		display: grid;
		justify-items: center;
		justify-self: center;
	}
	/* (it comes at 0.2s, when the line in has reached the node: the answer follows the request. It stood still at
	   first, 12px under the node.) */
	.back {
		margin-top: 16px;
		animation: swap 0.1s ease-out 0.2s both;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
		white-space: nowrap;
	}
	.back b {
		font-weight: inherit;
		color: var(--color-fg);
	}
	.code {
		margin-right: 8px;
		padding: 3px 5px;
		border-radius: 4px;
		background: rgb(0 0 0 / 0.05);
		color: var(--color-body);
	}
	@media (min-width: 1024px) {
		.back {
			position: absolute;
			top: 100%;
			left: 50%;
			margin-top: 20px;
			translate: -50%;
		}
	}
	.node {
		display: flex;
		align-items: center;
		justify-self: center;
		height: 40px;
		padding: 0 14px 0 10px;
		border-radius: 8px;
		background: #fff;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.1),
			0 0 0 4px color-mix(in srgb, var(--color-rich) 10%, transparent);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
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
	/* the line out of the node, drawn after the line into it */
	.out {
		height: 1.5px;
		background: var(--color-rich);
		transform-origin: left;
		animation: grow 0.12s ease-out 0.17s both;
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		align-items: center;
		height: 36px;
		padding: 0 16px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
	}
	.bar b {
		font-weight: inherit;
		color: var(--color-rich);
	}
	/* the embed comes in after its lines; its box is one height (the figure's, less the bar), so the window is too:
	   as tall as the links' column. (It was 36px less, for the foot with the options.) */
	.swap {
		height: calc(var(--h) - 36px);
		animation: swap 0.2s ease-out 0.25s both;
	}
	@keyframes swap {
		from {
			opacity: 0;
		}
	}
	/* what the previews are drawn with */
	.tint {
		background: rgb(0 0 0 / 0.07);
	}
	.tint2 {
		background: rgb(0 0 0 / 0.13);
	}
	.card {
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.12);
	}
	.line {
		border-top: 1px solid rgb(0 0 0 / 0.07);
	}
	.play {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		border-radius: 999px;
		background: var(--color-rich);
	}
	/* Spotify's green, for its own play button */
	.play.green {
		background: #1ed760;
	}
	.centre {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}
	/* under lg, upright: the tiles in a row, the picked URL, a stem, the node, a stem, the window */
	@media (max-width: 1023.98px) {
		.links {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 12px;
		}
		.link {
			height: auto;
		}
		.url {
			display: none;
		}
		.one-url {
			margin-top: 16px;
			color: var(--color-fg);
			text-align: center;
		}
		.stem {
			justify-self: center;
			width: 1.5px;
			height: 24px;
			margin: 8px 0;
			background: var(--color-rich);
		}
		.swap {
			height: 248px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fan .on,
		.out,
		.back,
		.swap {
			animation: none;
		}
		.mark,
		.url {
			transition: none;
		}
	}
</style>
