<script lang="ts">
	// The "For product teams" block on /embeds as a timeline, not three columns of cards: one blue line across the
	// page from 2012 to this year, with what happened to providers along it, and under it the block's three texts as
	// plain columns. No cards, no windows, no paper.
	// (/embeds-3 has this block as one sheet of three columns, a drawn scene over each text.)
	//
	// DRAFT CONTENT, to be confirmed. The events are public ones picked for the draft, not a record of Iframely's own
	// history:
	//   2012  the start: the site's "Serving since 2012" (so the comment reads 14 years in 2026, not the 15 of the
	//         block's old closing line)
	//   2017  Vine shut down (January 2017)
	//   2019  Google+ shut down (April 2019)
	//   2020  Facebook and Instagram embeds began to require an access token (October 2020)
	//   2023  Twitter became X (July 2023)
	//   2026  rebrands of this year, two of the three the block's copy names (mermaid.ai, dailymail.com; not ardsounds.de)
	// An event is placed by its date along the line. Its label hangs on a thin stem, above the line or under it, turn
	// about, so neighbours do not run into each other. Under lg the line stands upright and the events are a list.
	// When the block comes into view the line draws itself from the left and the events come in after it.
	import { onMount } from 'svelte';
	import { parts } from '#lib/copy.ts';

	// items: the block's three texts as [heading, text]. A text may have links in it, written [as this](/docs/ids)
	// (lib/copy.ts).
	let { items }: { items: string[][] } = $props();

	const FROM = 2012;
	const TO = 2026;
	// The providers' marks, next to their events. Facebook, Instagram and X are the site's own provider logos; the
	// two of 2026 are those sites' favicons (fetched 2026-11-20); Vine, Google+ and the Twitter bird are Simple Icons'
	// one-colour drawings (CC0), tinted with each brand's colour.
	import facebook from '../assets/providers/facebook.svg';
	import instagram from '../assets/providers/instagram.svg';
	import x from '../assets/providers/x.svg';
	import mermaid from '../assets/timeline/mermaid.png';
	import dailymail from '../assets/timeline/dailymail.png';
	import vine from '../assets/timeline/vine.svg';
	import googleplus from '../assets/timeline/googleplus.svg';
	import twitter from '../assets/timeline/twitter.svg';
	// Twitch and Storify are Simple Icons' drawings too; Gfycat's is its last favicon, from the Internet Archive.
	// Justin.tv and Musical.ly have no mark here: their events show what they became.
	import twitch from '../assets/timeline/twitch.svg';
	import storify from '../assets/timeline/storify.svg';
	import gfycat from '../assets/timeline/gfycat.png';
	import tiktok from '../assets/providers/tiktok.svg';
	// Iframely's own: the favicon of iframely.com as it is in production (fetched 2026-11-20)
	import iframely from '../assets/timeline/iframely.svg';
	// a mark: [file] as it is, or [file, colour] for a one-colour drawing to tint
	type Mark = [string] | [string, string];

	// when (a year, with a fraction for the month), the year shown, what happened, the marks.
	// The last one stands for several rebrands of the year; two are shown (mermaid.ai, dailymail.com).
	// Two marks share one tile, in the order they are read: for Twitter and X, the old one first, as in its diff.
	// What is shown of an event is its change, as lines of a diff: '-' for what went (grey, struck), '+' for what came
	// (blue), '#' for a comment (grey). A rebrand is the old domain over the new one (the old ones of 2026 are
	// DevCover's). (The last event showed its new domains only for a moment, to keep its label short; the old ones
	// are back, and the room for the label comes from the events' spacing, see at().) The first event's comment is the line's length: it stands for the block's old closing sentence
	// ("We've seen plenty of providers come and go. Iframely is 15 years strong, and carrying on."). The sentence is for screen readers only.
	// Last comes the tooltip's explanation (DRAFT wording, to be confirmed with the dates).
	const EVENTS: [number, string, string, Mark[], string[], string][] = [
		[2012, '2012', 'Iframely starts', [[iframely]], ['+ iframely.com', `# ${TO - FROM} years and counting`], 'The first embeds are served. Today it is over 1,900 providers.'],
		[2014.6, '2014', 'Justin.tv becomes Twitch', [[twitch, '#9146ff']], ['- justin.tv', '+ twitch.tv'], 'Justin.tv closes and the company carries on as Twitch. Streams live on a new domain.'],
		[2017, '2017', 'Vine shuts down', [[vine, '#00b488']], ['- vine.co'], 'Twitter closes Vine. No new loops, and the old ones move to an archive.'],
		[2018.4, '2018', 'Storify shuts down', [[storify, '#3a98d9']], ['- storify.com'], 'Storify closes and deletes its stories. Every embed of one goes dark.'],
		[2018.6, '2018', 'Musical.ly becomes TikTok', [[tiktok]], ['- musical.ly', '+ tiktok.com'], 'Musical.ly is merged into TikTok. Every video link changes its domain.'],
		[2019.25, '2019', 'Google+ shuts down', [[googleplus, '#dc4e41']], ['- plus.google.com'], 'Google closes Google+ for consumers. Embedded posts stop loading.'],
		[2020.8, '2020', 'Facebook and Instagram embeds need a token', [[facebook], [instagram]], ['+ access_token'], 'Facebook and Instagram retire their open oEmbed. Every request now needs an app access token.'],
		[2023.5, '2023', 'Twitter becomes X', [[twitter, '#1da1f2'], [x]], ['- twitter.com', '+ x.com'], 'Twitter renames itself X and moves to x.com. Links to posts now come in both forms.'],
		[2023.7, '2023', 'Gfycat shuts down', [[gfycat]], ['- gfycat.com'], 'Gfycat closes and takes all of its GIFs offline.'],
		[2026, '2026', 'Multiple rebrands this year', [[mermaid], [dailymail]], ['- mermaidchart.com', '+ mermaid.ai', '- dailymail.co.uk', '+ dailymail.com'], 'Multiple providers moved to new domains this year. Embeds of their old links carry on working.']
	];
	// The events stand at steps along the line, in order of time, not at their dates: several fall within months
	// of each other (two in 2018, two in 2023) and would sit on top of one another.
	// The steps are even, but for the last two, which are fixed: TAIL px from the last event back to the one two
	// before it, the one between them half-way. The last event's label hangs to the left of its stem, on the same
	// side of the line as the label of the event two before it, and on one row the two meet: "− twitter.com" (106px
	// from its stem) and "− mermaidchart.com" (150px from the line's end) need 256px, and TAIL leaves 20px between
	// them. With even steps all the way they were 10px apart on a 1200px line and ran into each other on any
	// narrower one (a desktop screen under about 1240px). On a 1200px line the other steps come to 132px, as good as
	// the even 133px; on a narrower line they close up and the last two keep their room.
	const TAIL = 276;
	const at = (i: number) => {
		const n = EVENTS.length;
		return i < n - 2 ? `calc((100% - ${TAIL}px) * ${i / (n - 3)})` : `calc(100% - ${((n - 1 - i) * TAIL) / 2}px)`;
	};

	let line: HTMLOListElement;
	let seen = $state(false);

	// The event whose tooltip shows (-1: none). The whole timeline is one area for the pointer, at its full height,
	// and the pointer picks by nearness: an event it is on (its tile, its year, its diff; not the empty parts of its
	// box, which lie over its neighbours: see .ev in the styles), or else the nearest one,
	// measured along the line to the tiles' middles (under lg, where the events are a list, down the list to the
	// events' rows). So on the way from one tile to the next the first one's tooltip stays up until the pointer is
	// nearer the second, and it goes out only when the pointer leaves the timeline. (It showed only while its own
	// event was pointed at, and went out between two tiles.)
	let active = $state(-1);
	const index = (el: Element | null) => (el ? +(el.closest<HTMLElement>('.ev')?.dataset.i ?? -1) : -1);
	function point(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		const own = index(e.target as Element);
		if (own >= 0) return void (active = own);
		const across = matchMedia('(min-width: 1024px)').matches;
		let near = -1;
		let least = Infinity;
		for (const el of line.querySelectorAll(across ? '.marks' : '.ev')) {
			const r = el.getBoundingClientRect();
			const d = across ? Math.abs(e.clientX - (r.left + r.right) / 2) : Math.max(r.top - e.clientY, e.clientY - r.bottom, 0);
			if (d < least) [least, near] = [d, index(el)];
		}
		active = near;
	}
	// a finger has no hover: a touch on an event shows its tooltip, a touch anywhere off the timeline hides it
	function tap(e: PointerEvent) {
		if (e.pointerType === 'touch' && index(e.target as Element) >= 0) active = index(e.target as Element);
	}

	onMount(() => {
		const io = new IntersectionObserver((es) => es[0].isIntersecting && ((seen = true), io.disconnect()), { threshold: 0.4 });
		io.observe(line);
		const off = (e: PointerEvent) => e.pointerType === 'touch' && !line.contains(e.target as Node) && (active = -1);
		addEventListener('pointerdown', off);
		return () => (io.disconnect(), removeEventListener('pointerdown', off));
	});
</script>

<!-- The whole timeline, at its full height, is one area for the pointer (point(), above): the event nearest the
     pointer is marked .on, and that one's tooltip and ring show until another is nearer or the pointer leaves. -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<ol bind:this={line} class="line" class:seen onpointermove={point} onpointerdown={tap} onpointerleave={(e) => e.pointerType !== 'touch' && (active = -1)}>
	{#each EVENTS as [when, year, name, marks, diff, why], i (when)}
		<li class="ev" class:on={active === i} data-i={i} class:has={marks.length > 0} class:down={i % 2 === 1} class:last={i === EVENTS.length - 1} style="--x:{at(i)};--i:{i};--n:{marks.length}">
			<p class="font-mono text-[12px] leading-none text-mute">{year}</p>
			{#if marks.length}
				<!-- From lg up the marks sit on the line itself, where the event's dot was, in a white tile: one tile for
				     an event, as wide as its marks, two marks side by side in it. (Each mark had a tile of its own, and
				     an event's two tiles overlapped, the second half under the first.) Under lg the tile stays in the
				     label, over the name. -->
				<!-- The tile is also what the event's tooltip is anchored to (CSS anchor positioning): each event names
				     its own anchor, and the tooltip, on the top layer of the page (position: fixed), places itself by it. -->
				<button type="button" class="marks" aria-label={name} aria-describedby="tl-tip-{i}" style="anchor-name:--tl-{i}">
					{#each marks as [src, tint] (src)}
						{#if tint}
							<!-- (the file may arrive inlined as a data: address with single quotes in it, so the url is in double ones) -->
							<i class="tint size-[18px]" style:background={tint} style:mask-image={`url("${src}")`} style:-webkit-mask-image={`url("${src}")`}></i>
						{:else}
							<img class="size-[18px] rounded-[4px]" {src} alt="" width="18" height="18" loading="lazy" />
						{/if}
					{/each}
				</button>
				<span class="tip" role="tooltip" id="tl-tip-{i}" style="position-anchor:--tl-{i}"><b>{name}</b>{why}</span>
			{/if}
			<p class="diff" aria-hidden="true">
				{#each diff as l (l)}
					{#if l[0] === '#'}
						<span class="note">{l}</span>
					{:else}
						<span class={l[0] === '+' ? 'add' : 'del'}>{l[0] === '+' ? '+' : '−'} <i>{l.slice(2)}</i></span>
					{/if}
				{/each}
			</p>
		</li>
	{/each}
</ol>

<div class="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-3">
	{#each items as [name, body] (name)}
		<div>
			<h3 class="text-[18px] leading-[1.35] font-medium text-fg">{name}</h3>
			<!-- (a text may carry links, see parts(); they are the taglines' links: routes/layout.css, .copy-link) -->
			<p class="t-small mt-1.5 text-[15px]! text-pretty text-mute">{#each parts(body) as [text, href], n (n)}{#if href}<a class="copy-link" {href}>{text}</a>{:else}{text}{/if}{/each}</p>
		</div>
	{/each}
</div>

<style>
	/* under lg: the line stands upright at the left, the events are a list along it */
	.line {
		position: relative;
		display: grid;
		gap: 28px;
		padding-left: 24px;
		border-left: 1px solid var(--color-rich);
	}
	.ev {
		position: relative;
		/* For the pointer an event is its own things only (its tile, its year, the lines of its diff), not its whole
		   box: the box's empty parts are open, and there the nearest event is picked (point(), in the script). The
		   boxes overlap where the line lies across the page: the last event's, which hangs to the left, lay over
		   the lower half of the tile before it and over the space under that tile, and took both for its own. */
		pointer-events: none;
	}
	.ev > :not(.tip) {
		pointer-events: auto;
	}
	/* (the year is as wide as its figures, not as its event's box) */
	.ev > p:first-child {
		width: fit-content;
	}
	/* An event's marks stand in one white tile with a hairline round it: 32px square for one mark, wider for two,
	   which lie side by side with 6px between them. */
	.marks {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		margin: 10px 0 0;
		padding: 0 7px;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.1);
		cursor: default;
	}
	/* a squircle where the browser can draw one (an app icon's shape, as the "Ask AI" tiles of the page's closing
	   block, components/AskStrip.svelte), the rounded corners above elsewhere */
	@supports (corner-shape: squircle) {
		.marks {
			border-radius: 13px;
			corner-shape: squircle;
		}
	}
	.marks:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	/* The tooltip: what happened, in a sentence or two. It is placed by CSS anchor positioning: centred under its
	   event's marks, and where that does not fit the screen, over them, or to one side. Shown while the event is
	   the picked one (.on, set by the pointer: see point() in the script) or its marks have the focus. */
	.tip {
		position: fixed;
		position-area: bottom;
		position-try-fallbacks:
			flip-block,
			bottom span-right,
			bottom span-left,
			top span-right,
			top span-left;
		z-index: 30;
		width: max-content;
		max-width: 248px;
		margin: 10px 0;
		padding: 12px 14px;
		border-radius: 6px;
		background: #fff;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / 0.1);
		font-size: 13px;
		line-height: 1.45;
		color: var(--color-body);
		text-align: left;
		text-wrap: pretty;
		pointer-events: none;
		/* Not laid out at all while closed (display, not visibility): a browser keeps the last placement that fitted,
		   and a hidden tooltip placed while the block was still under the screen's edge would stay flipped. */
		display: none;
		/* It comes in with a small lift and a fade: it starts 4px nearer its tile (--from: up, for one that opens under
		   the line; the ones over the line set it the other way) and settles as it clears; it goes out the same way,
		   a little faster. (It only faded, in 0.12s.) */
		opacity: 0;
		translate: 0 var(--from, -4px);
		transition:
			opacity 0.12s ease-in,
			translate 0.12s ease-in,
			display 0.12s allow-discrete;
	}
	.tip b {
		display: block;
		margin-bottom: 2px;
		font-weight: 500;
		color: var(--color-fg);
	}
	.ev.on .tip,
	.marks:focus-visible + .tip {
		display: block;
		opacity: 1;
		translate: 0 0;
		transition:
			opacity 0.18s ease-out,
			translate 0.18s cubic-bezier(0.2, 0.7, 0.3, 1),
			display 0.18s allow-discrete;
		@starting-style {
			opacity: 0;
			translate: 0 var(--from, -4px);
		}
	}
	/* a browser without anchor positioning: the tooltip hangs under the event's label */
	@supports not (position-area: bottom) {
		.tip {
			position: absolute;
			top: 100%;
			left: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tip {
			transition: none;
		}
	}
	/* an event's change, as lines of a diff */
	.diff {
		display: inline-block;
		margin-top: 10px;
		font:
			12px/1.6 var(--ff-mono),
			ui-monospace,
			monospace;
		text-align: left;
		white-space: nowrap;
	}
	.diff span {
		display: block;
	}
	.diff i {
		font-style: normal;
	}
	.diff .add {
		color: var(--color-rich);
	}
	.diff .del,
	.diff .note {
		color: var(--color-mute);
	}
	.diff .del i {
		text-decoration: line-through;
	}
	/* the picked event (.on, the one whose tooltip shows): a thick, half-transparent blue ring round its tile,
	   outside the hairline */
	.ev.on .marks {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.1),
			0 0 0 4px color-mix(in srgb, var(--color-rich) 16%, transparent);
	}
	/* a one-colour mark, cut out of its brand's colour */
	.tint {
		display: block;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
	}
	/* an event's dot on the line */
	.ev::before {
		position: absolute;
		top: 3px;
		left: -28px;
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--color-rich);
		content: '';
	}
	@media (min-width: 1024px) {
		/* the line lies across the page, from the first event's mark to the last one's */
		.line {
			display: block;
			height: 276px;
			padding: 0;
			border: 0;
		}
		.line::before {
			position: absolute;
			top: 50%;
			right: 0;
			left: 0;
			height: 1px;
			background: var(--color-rich);
			content: '';
			transform-origin: left;
		}
		/* a label hangs on a stem: its own left border, from the line up to its first line of text (or down) */
		.ev {
			position: absolute;
			bottom: 50%;
			left: var(--x);
			/* (no wider than the step between two events, so the one before the last stays inside the page's column) */
			width: 130px;
			padding: 0 0 34px 12px;
			border-left: 1px solid color-mix(in srgb, var(--color-rich) 40%, transparent);
		}
		.ev.down {
			top: 50%;
			bottom: auto;
			padding: 34px 0 0 12px;
		}
		/* the last one is at the line's end, so it hangs to the left of its stem */
		.ev.last {
			right: 0;
			left: auto;
			width: 150px;
			padding-right: 12px;
			padding-left: 0;
			border-right: 1px solid color-mix(in srgb, var(--color-rich) 40%, transparent);
			border-left: 0;
			text-align: right;
		}
		/* the tile on the line: its middle on the event's point, whatever its width, so the label's stem leaves it
		   from the middle (between the two marks of a pair); an event with marks has no dot. (The first mark's
		   middle was on the point, a second mark after it, so a pair's stem stood over its first mark.) */
		.marks {
			position: absolute;
			bottom: -16px;
			left: 0;
			margin: 0;
			transform: translateX(-50%);
		}
		.ev.down .marks {
			top: -16px;
			bottom: auto;
		}
		/* The last event's stem is its right side, at the line's end. A single tile there reaches 16px past the
		   page's column, as the first event's does on the left; a pair would reach 28px, more than the page's
		   gutter, so the event stands a little inside the column and its pair reaches 20px past it (--n is the
		   number of its marks). The line ends under the tile. */
		.ev.last {
			right: max(0px, (var(--n) - 1) * 12px - 4px);
		}
		.ev.last .marks {
			right: 0;
			left: auto;
			transform: translateX(50%);
		}
		/* (its year, now only as wide as its figures, keeps to the right) */
		.ev.last > p:first-child {
			margin-left: auto;
		}
		.ev.has::before {
			display: none;
		}
		/* the tooltip opens on the side of the line the label is not on */
		.ev.down .tip {
			position-area: top;
			--from: 4px; /* over the line, so it rises out of its tile */
		}
		/* At the line's two ends the tooltip is not centred on its tile but set flush with it: the first event's has
		   its left side on the tile's left side, the last one's its right side on the tile's right side. (Centred,
		   they hung out past the tiles, or were pushed to wherever the screen let them fit.) */
		.ev:first-child .tip {
			position-area: bottom span-right;
		}
		.ev.last .tip {
			position-area: top span-left;
		}
		.ev::before {
			top: auto;
			bottom: -4px;
			left: -4px;
		}
		.ev.down::before {
			top: -3px;
			bottom: auto;
		}
		.ev.last::before {
			right: -4px;
			left: auto;
		}
		/* coming into view: the line draws itself, then the events appear one after another */
		@media (prefers-reduced-motion: no-preference) {
			.line::before {
				transform: scaleX(0);
				transition: transform 1.4s cubic-bezier(0.3, 0, 0.2, 1);
			}
			.line.seen::before {
				transform: none;
			}
			.ev {
				opacity: 0;
				transition: opacity 0.4s ease-out calc(0.2s + var(--i) * 0.12s);
			}
			.line.seen .ev {
				opacity: 1;
			}
		}
	}
</style>
