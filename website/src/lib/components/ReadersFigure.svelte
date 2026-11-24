<script lang="ts">
	// The "For readers" block on /embeds as one annotated figure, not four cards: a tall article window in the middle
	// of the page, and the block's four texts in the margins as notes, each joined to the part of the article it is
	// about by a thin blue line (the hero wall's measures).
	// Down the article: a video behind a light cover (click-to-play), a post's place held before it loads (predictive
	// height), three players of which one plays (one video at a time), and last the edge of the screen with an embed
	// loading under it (stays out of the way). The cover and the three players can be pressed.
	// The article and the notes share four rows (a subgrid), so a note stands level with its part whatever the texts'
	// lengths. Pointing at a note or at its part marks both.
	// Under lg there are no margins: the window, then the notes as a list.
	// The file name and the sizes are illustrative.

	import { parts } from '#lib/copy.ts';

	// items: the block's four cards as [title, text]: click-to-play, lazy loading, predictive height, one at a time.
	// A text may have links in it, written [as this](/docs/lazy-load) (lib/copy.ts).
	let { items }: { items: string[][] } = $props();
	// the order down the article, as indices of items
	const ORDER = [0, 2, 3, 1];
	// a note's place: the left margin or the right one, turn about
	const PLACE = ['lg:col-start-1 lg:row-start-1', 'lg:col-start-3 lg:row-start-2', 'lg:col-start-1 lg:row-start-3', 'lg:col-start-3 lg:row-start-4'];

	let hot = $state(-1);
	// the one player that plays, of the article's four: 0 to 2 are the three small ones, COVER the click-to-play
	// video, -1 none. Pressing one stops whichever was playing.
	const COVER = 9;
	let playing = $state(1);
	const played = $derived(playing === COVER);
</script>

{#snippet lines(a: number, b: number)}
	<div class="h-2 rounded-full bg-black/10" style="width:{a}%"></div>
	<div class="mt-2 h-2 rounded-full bg-black/10" style="width:{b}%"></div>
{/snippet}

<div class="grid gap-y-10 lg:grid-cols-[1fr_minmax(0,460px)_1fr] lg:gap-y-0">
	<div class="win overflow-hidden rounded-md bg-white lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:grid lg:grid-rows-subgrid">
		<!-- 0: click-to-play -->
		<div>
			<div class="bar">article.html</div>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="z" class:hot={hot === 0} onmouseenter={() => (hot = 0)} onmouseleave={() => (hot = -1)}>
				{@render lines(92, 64)}
				<button type="button" class="cover" aria-label={played ? 'Pause' : 'Play'} aria-pressed={played} onclick={() => (playing = played ? -1 : COVER)}>
					<span class="tagline {played ? 'text-mute' : 'text-rich'}">{played ? 'full player · 540 KB' : 'cover · 40 KB'}</span>
					<!-- YouTube's own play button shape (as the hero's video tile and the menu's scene), in the page's blue -->
					<svg class="yt" width="58" height="41" viewBox="0 0 68 48" aria-hidden="true">
						<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.950-1.480-16.260z" fill="var(--color-rich)" />
						<path d={played ? 'M26 15h6v18h-6zM36 15h6v18h-6z' : 'M45 24 27 14v20z'} fill="#fff" />
					</svg>
					{#if played}<span class="track"><span class="fill"></span></span>{/if}
				</button>
			</div>
		</div>
		<!-- 1: predictive height -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="z" class:hot={hot === 1} onmouseenter={() => (hot = 1)} onmouseleave={() => (hot = -1)}>
			{@render lines(84, 48)}
			<div class="mt-4 grid h-[112px] place-items-center rounded-sm border border-dashed border-rich/50 bg-rich/5 font-mono text-[11px] leading-none text-rich">↕ 512px reserved</div>
			<div class="mt-4">{@render lines(96, 70)}</div>
		</div>
		<!-- 2: one video at a time -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="z" class:hot={hot === 2} onmouseenter={() => (hot = 2)} onmouseleave={() => (hot = -1)}>
			{@render lines(78, 52)}
			<div class="mt-4 grid grid-cols-3 gap-3">
				{#each [0, 1, 2] as i (i)}
					<button type="button" class="mini" aria-label={playing === i ? 'Pause' : 'Play'} aria-pressed={playing === i} onclick={() => (playing = playing === i ? -1 : i)}>
						<span class="play small" class:idle={playing !== i}><svg width="10" height="10" viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d={playing === i ? 'M3 2h3v10H3zM8 2h3v10H8z' : 'M3 1.5v11l9-5.5z'} /></svg></span>
						{#if playing === i}<span class="track"><span class="fill"></span></span>{/if}
					</button>
				{/each}
			</div>
		</div>
		<!-- 3: the edge of the screen, and an embed loading under it -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="z" class:hot={hot === 3} onmouseenter={() => (hot = 3)} onmouseleave={() => (hot = -1)}>
			<p class="fold">screen edge</p>
			<div class="mt-4 flex h-[104px] items-center justify-center gap-2 rounded-sm bg-black/5 font-mono text-[11px] leading-none text-mute">
				<span class="spin" aria-hidden="true"></span>loading in the background
			</div>
		</div>
	</div>

	{#each ORDER as k, z (k)}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="note flex items-center {PLACE[z]} {z % 2 ? 'lg:flex-row-reverse' : ''}" class:hot={hot === z} onmouseenter={() => (hot = z)} onmouseleave={() => (hot = -1)}>
			<div class="lg:w-[72%]">
				<h3 class="text-[18px] leading-[1.35] font-medium text-fg">{items[k][0]}</h3>
				<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">{#each parts(items[k][1]) as [words, href], n (n)}{#if href}<a class="copy-link" {href}>{words}</a>{:else}{words}{/if}{/each}</p>
			</div>
			<span class="lead max-lg:hidden" class:r={z % 2 === 1} aria-hidden="true"></span>
		</div>
	{/each}
</div>

<style>
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		align-items: center;
		height: 36px;
		padding: 0 20px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	/* a part of the article */
	.z {
		position: relative;
		padding: 20px;
		transition: background-color 0.2s;
	}
	.z.hot {
		background: color-mix(in srgb, var(--color-rich) 4%, white);
	}
	/* the measure: a blue rule at the window's edge, on the side of the part's note (left, right, left, right) */
	.z::before {
		position: absolute;
		top: 14px;
		bottom: 14px;
		left: 0;
		width: 2px;
		background: var(--color-rich);
		content: '';
	}
	.win > :nth-child(even) > .z::before,
	.win > .z:nth-child(even)::before {
		right: 0;
		left: auto;
	}
	/* the note's line to the window: a dot at the text, then a hairline */
	.lead {
		position: relative;
		flex-grow: 1;
		height: 1px;
		margin-left: 16px;
		background: color-mix(in srgb, var(--color-rich) 40%, transparent);
		transition: background-color 0.2s;
	}
	.lead.r {
		margin-right: 16px;
		margin-left: 0;
	}
	.lead::before {
		position: absolute;
		top: -2px;
		left: 0;
		width: 5px;
		height: 5px;
		border-radius: 999px;
		background: var(--color-rich);
		content: '';
	}
	.lead.r::before {
		right: 0;
		left: auto;
	}
	.note.hot .lead {
		background: var(--color-rich);
	}
	/* (a marked note's heading stays black: it turned blue. The mark is the note's line and its part of the article.) */
	/* the video's cover, and the three small players */
	.cover,
	.mini {
		position: relative;
		display: block;
		width: 100%;
		overflow: hidden;
		border-radius: 4px;
		background: rgb(0 0 0 / 0.07);
		cursor: pointer;
	}
	.cover {
		aspect-ratio: 2 / 1;
		margin-top: 16px;
	}
	.mini {
		aspect-ratio: 4 / 3;
	}
	.cover:focus-visible,
	.mini:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	.tagline {
		position: absolute;
		top: 12px;
		left: 14px;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
	}
	.yt {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		translate: -50% -50%;
		border-radius: 999px;
		background: var(--color-rich);
		transition: background-color 0.2s;
	}
	.play.small {
		width: 30px;
		height: 30px;
	}
	.play.idle {
		background: rgb(0 0 0 / 0.25);
	}
	.track {
		position: absolute;
		inset: auto 0 0;
		height: 3px;
		background: rgb(0 0 0 / 0.1);
	}
	.fill {
		display: block;
		width: 12%;
		height: 100%;
		background: var(--color-rich);
		animation: run 30s linear infinite;
	}
	@keyframes run {
		to {
			width: 100%;
		}
	}
	/* the edge of the screen: a dashed blue line with its name in the middle */
	.fold {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0 -20px;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-rich);
		white-space: nowrap;
	}
	.fold::before,
	.fold::after {
		flex-grow: 1;
		border-top: 1px dashed color-mix(in srgb, var(--color-rich) 55%, transparent);
		content: '';
	}
	.spin {
		width: 12px;
		height: 12px;
		border: 1.5px solid rgb(0 0 0 / 0.15);
		border-top-color: var(--color-rich);
		border-radius: 999px;
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			rotate: 360deg;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fill,
		.spin {
			animation: none;
		}
		.z,
		.lead,
		.play {
			transition: none;
		}
	}
</style>
