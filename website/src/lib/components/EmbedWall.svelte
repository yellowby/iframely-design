<script lang="ts">
	// The /embeds hero visual, after V15 in the motion lab ("Rich Media hero: a wall of working embeds"): the kinds of
	// embeds the 1,900 providers return, each drawn as its interface (a video player, an audio track with its waveform,
	// a social post, a map, a code gist, a slide deck, a summary card), with the provider and the kind in its bar.
	// Styled as the page's card covers (DevCover): white windows (straight on the page, no ground of their own), flat grey pictures, blue only
	// for the accents. Shapes only, no screenshots; the content is sample data. Four columns, two on a phone.

	type Side = 'top' | 'right' | 'bottom';

	// the audio tile's waveform: 64 bars, the first 22 played
	const hs = (i: number, s: number) => {
		const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
		return x - Math.floor(x);
	};
	const wave = Array.from({ length: 64 }, (_, i) => {
		const h = 6 + Math.round((Math.sin(i * 0.45) * 0.5 + 0.5) * 18 + hs(i, 3) * 14);
		return { x: i * 5, y: (44 - h) / 2, h, played: i < 22 };
	});
</script>

{#snippet play(size: number, fill: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" class="block" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" {fill} /></svg>
{/snippet}

<!-- A tile is a white window, as the covers of the page's "For your developers" and "Performance" cards: a hairline
     ring and a soft shadow, a mono bar (the provider, and the kind in grey), then the embed. -->
<!-- notes: engineering measures drawn outside the window, in the gaps of the wall, as on a blueprint: a blue dimension
     line with end ticks along one side of the tile, and what Iframely does there written across it. -->
{#snippet tile(span: string, host: string, kind: string, body: import('svelte').Snippet, notes: [Side, string][] = [])}
	<div class="relative min-h-0 {span}">
		<div class="win flex h-full flex-col overflow-hidden rounded-lg bg-white">
			<div class="bar"><span class="truncate">{host}</span><span class="ml-auto text-mute">{kind}</span></div>
			<div class="relative min-h-0 flex-1 overflow-hidden">{@render body()}</div>
		</div>
		{#each notes as [side, text] (side)}
			<div class="dim {side}"><span>{text}</span></div>
		{/each}
	</div>
{/snippet}

<div class="embed-wall" role="img" aria-label="Kinds of embeds: a video, an audio track, a social post, a map, code, slides and a summary card">
	{#snippet video()}
		<div class="art absolute inset-4 rounded-md">
			<div class="absolute top-3 left-3.5 font-mono text-[11px] leading-none text-mute">Never Gonna Give You Up</div>
			<div class="absolute top-1/2 left-1/2 grid size-14 -translate-1/2 place-items-center rounded-full bg-rich">{@render play(26, '#fff')}</div>
			<div class="absolute right-3.5 bottom-3.5 left-3.5 h-[3px] rounded-sm bg-black/10"><div class="h-full w-[30%] rounded-sm bg-rich"></div></div>
		</div>
	{/snippet}
	{@render tile('col-span-2 row-span-2', 'youtube.com', 'video', video, [
		['top', '16 : 9 · aspect ratio kept'],
		['right', 'height reserved before load']
	])}

	{#snippet audio()}
		<div class="flex h-full items-center gap-3.5 px-4 py-3.5">
			<div class="grid size-11 flex-none place-items-center rounded-full bg-rich">{@render play(20, '#fff')}</div>
			<div class="min-w-0 flex-1">
				<div class="text-[13px] leading-[1.3] font-semibold text-fg">Field recordings, part 2</div>
				<div class="mt-0.5 mb-1.5 text-[11px] leading-[1.3] text-mute">Ambient · 3:21</div>
				<!-- stretched to the tile's width: the bars widen with it, their heights stay -->
				<svg viewBox="0 0 318 44" preserveAspectRatio="none" class="block h-[34px] w-full" aria-hidden="true">
					{#each wave as b (b.x)}<rect x={b.x} y={b.y} width="3" height={b.h} rx="1.5" class={b.played ? 'fill-rich' : 'fill-black/12'} />{/each}
				</svg>
			</div>
		</div>
	{/snippet}
	{@render tile('col-span-2', 'soundcloud.com', 'audio', audio, [['top', '100% width · responsive']])}

	{#snippet post()}
		<div class="flex h-full flex-col p-3.5">
			<div class="flex items-center gap-2">
				<i class="size-7 flex-none rounded-full bg-black/10"></i>
				<div>
					<div class="text-[12px] leading-[1.3] font-semibold text-fg">Iframely</div>
					<div class="text-[11px] leading-[1.3] text-mute">@iframely · 2h</div>
				</div>
			</div>
			<div class="my-2.5 text-[13px] leading-[1.45] text-fg">We make URLs work inside other products.</div>
			<div class="art min-h-[60px] flex-1 rounded-md"></div>
			<div class="mt-2.5 flex gap-3.5 text-[11px] leading-[1.3] text-mute"><span>12 replies</span><span>48 reposts</span></div>
		</div>
	{/snippet}
	{@render tile('row-span-2', 'x.com', 'post', post, [['bottom', 'layout shift 0']])}

	{#snippet map()}
		<svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" class="absolute inset-0 size-full" aria-hidden="true">
			<rect width="200" height="140" fill="#f2f2f2" />
			<path d="M0 95 C60 80 90 120 200 70" stroke="#e4e4e4" stroke-width="14" fill="none" />
			<g stroke="#fff" stroke-width="4" fill="none"><path d="M0 40 L200 55M40 0 L70 140M130 0 L120 140M0 120 L200 110" /></g>
			<g stroke="#fff" stroke-width="1.5" fill="none"><path d="M0 20 L200 30M95 0 L100 140M160 0 L170 140" /></g>
<!-- the pin: a small round head tapering to a point, a white edge to lift it off the roads, its shadow on the ground -->
			<ellipse cx="104" cy="79" rx="4.5" ry="1.6" fill="#000" opacity=".12" />
			<path d="M104 79c-1.6-2.8-8-10.2-8-16.6a8 8 0 1 1 16 0c0 6.4-6.4 13.8-8 16.6z" class="fill-rich" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
			<circle cx="104" cy="62.4" r="2.8" fill="#fff" />
		</svg>
	{/snippet}
	{@render tile('row-span-2', 'google.com/maps', 'map', map, [['bottom', 'loads before scroll']])}

	{#snippet code()}
		<pre class="m-0 overflow-hidden px-4 py-3 font-mono text-[12px] leading-[1.7] text-fg"><span class="text-rich">const</span> r = <span class="text-rich">await</span> fetch(
  api + <span class="text-mute">'?url='</span> + url)
<span class="text-rich">const</span> {'{'} html {'}'} = <span class="text-rich">await</span> r.json()</pre>
	{/snippet}
	{@render tile('col-span-2', 'gist.github.com', 'code', code, [['bottom', 'runs in our iframe, apart from your page']])}

	{#snippet slides()}
		<div class="grid h-full grid-cols-2">
			<div class="flex flex-col justify-between p-4">
				<div class="text-[18px] leading-[1.15] font-semibold text-fg">Q3 review:<br />embeds at scale</div>
				<div class="font-mono text-[11px] leading-[1.3] font-medium text-mute">‹ 4 / 18 ›</div>
			</div>
			<div class="art m-4 ml-0 rounded-md"></div>
		</div>
	{/snippet}
	{@render tile('col-span-2', 'docs.google.com', 'slides', slides)}

	{#snippet summary()}
		<div class="grid h-full grid-cols-[110px_1fr]">
			<div class="art m-4 mr-0 rounded-md"></div>
			<div class="px-4 py-3.5">
				<div class="text-[14px] leading-[1.3] font-semibold text-fg">oEmbed</div>
				<div class="mt-1 line-clamp-3 text-[12px] leading-[1.45] text-mute">oEmbed is a format for allowing an embedded representation of a URL on third-party sites.</div>
			</div>
		</div>
	{/snippet}
	{@render tile('col-span-2', 'en.wikipedia.org', 'summary card', summary)}
</div>

<style>
	.embed-wall {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		grid-auto-rows: 148px;
		grid-auto-flow: dense;
		/* gaps wide enough to carry a dimension line, and the same room above the top row for its measures */
		gap: 28px;
		padding-top: 28px;
	}
	/* A measure: 14px thick, centred in the 28px gap beside its tile. Two line segments run from the tile's corners to
	   the label, each closed by a tick at its outer end; the label has no ground of its own. */
	.dim {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-rich);
		font:
			10px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
		pointer-events: none;
	}
	.dim::before,
	.dim::after {
		content: '';
		flex: 1;
		opacity: 0.45;
		background: linear-gradient(currentColor, currentColor) center no-repeat;
	}
	.dim.top,
	.dim.bottom {
		left: 0;
		right: 0;
		height: 14px;
	}
	.dim.top {
		top: -21px;
	}
	.dim.bottom {
		bottom: -21px;
	}
	.dim.top::before,
	.dim.bottom::before,
	.dim.top::after,
	.dim.bottom::after {
		height: 8px;
		background-size: 100% 1px;
	}
	.dim.top::before,
	.dim.bottom::before {
		border-left: 1px solid;
	}
	.dim.top::after,
	.dim.bottom::after {
		border-right: 1px solid;
	}
	.dim.top span,
	.dim.bottom span {
		padding: 0 8px;
	}
	.dim.right {
		top: 0;
		bottom: 0;
		right: -21px;
		width: 14px;
		flex-direction: column;
	}
	.dim.right::before,
	.dim.right::after {
		width: 8px;
		background-size: 1px 100%;
	}
	.dim.right::before {
		border-top: 1px solid;
	}
	.dim.right::after {
		border-bottom: 1px solid;
	}
	.dim.right span {
		padding: 8px 0;
		writing-mode: vertical-rl;
		rotate: 180deg;
	}
	@media (max-width: 760px) {
		.embed-wall {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-auto-rows: 140px;
			gap: 12px;
			padding-top: 0;
		}
		/* a phone's 12px gaps have no room for measures */
		.dim {
			display: none;
		}
	}
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 16px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	/* the placeholder picture: flat light grey, as the players in the covers */
	.art {
		background: rgb(0 0 0 / 0.07);
	}
</style>
