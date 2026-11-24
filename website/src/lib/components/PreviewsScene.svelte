<script lang="ts">
	import { onDestroy } from 'svelte';

	// The cover of /embeds's block 06 ("Plus, previews for the rest of the web"): the cover the block had as a sheet,
	// kept as one piece: three cards lying side by side on pale grey paper, one for each kind of link the text names.
	// Each card hangs from the link it was made from (a small mono chip, joined to the card by a short blue line) and
	// has its kind's own shape: the article a wide picture (a city in the evening) and a headline, the product a photo
	// of the thing (a lamp), its name and a price, the repository no picture but its name, a description and its
	// language. All of it is a drawing: made-up hosts, each card's title in words and grey lines for the rest of the
	// text, one fact per card as a blue badge. The three cards are one height.
	// Two of the cards answer the pointer: the product's lamp hops and looks at the reader, and the article's picture
	// shifts in depth.
	// kind, the link, where it is from, the fact its card shows
	const KINDS = [
		['article', 'news.example/story', 'news site', '5 min read'],
		['product', 'shop.example/lamp', 'shop', '$48'],
		['repository', 'git.example/acme', 'code host', '★ 2.1k']
	];
	// the titles of the two cards with a picture: the article's headline and the product's name (drafts; the
	// repository's name is in its own part of the markup)
	const TITLES: Record<string, string> = {
		article: 'Night trams return to the city centre',
		product: 'Desk lamp'
	};
	// The product's lamp hops when its card is pointed at: one run of the animation, which ends in the pose it began
	// in, so it is left to finish when the pointer goes (nothing snaps back). Then it turns its head to look at the
	// reader, and keeps looking while the pointer is on the card; it turns back when the pointer goes (after a moment,
	// if the pointer went before the hop was over, so a passing pointer gets the look too).
	let hop = $state(false);
	let look = $state(false);
	let over = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	function enter() {
		over = true;
		clearTimeout(timer);
		if (hop || look) return;
		// with reduced motion there is no hop (and its end would never come): the head just faces the reader
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) look = true;
		else hop = true;
	}
	function leave() {
		over = false;
		if (look) timer = setTimeout(() => (look = false), 150);
	}
	function landed() {
		if (!hop) return; // the rig's four animations end together: the first one does it
		hop = false;
		look = true;
		if (!over) timer = setTimeout(() => (look = false), 1400);
	}
	onDestroy(() => clearTimeout(timer));

	// The article's picture has depth: as the pointer moves over the card, its three layers shift against it by
	// different amounts. The pointer's place in the card, from -1 to 1 each way, goes to the card as --px and --py
	// (the layers' styles do the rest); when the pointer goes, the picture levels out.
	function drift(e: PointerEvent) {
		const card = e.currentTarget as HTMLElement;
		const r = card.getBoundingClientRect();
		card.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
		card.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
	}
	function level(e: PointerEvent) {
		const card = e.currentTarget as HTMLElement;
		card.style.removeProperty('--px');
		card.style.removeProperty('--py');
	}
</script>

<div class="grid h-full grid-cols-3 gap-3 rounded-md bg-[#f4f4f5] px-4 py-8 sm:gap-4 sm:px-6" aria-hidden="true">
	{#each KINDS as [kind, link, host, fact] (kind)}
		<div class="flex min-w-0 flex-col items-center">
			<!-- the link as it was pasted -->
			<span class="max-w-full shrink-0 truncate rounded-full bg-white px-2.5 py-1.5 font-mono text-[11px] leading-none text-mute ring-1 ring-black/10">{link}</span>
			<span class="h-4 w-px shrink-0 bg-rich"></span>
			<!-- the card it becomes: raised, as the objects lying on the page's papers are -->
			<!-- pointing at the product's card wakes its lamp; moving the pointer over the article's shifts its picture -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="card flex w-full grow flex-col overflow-hidden rounded-md bg-white"
				onpointerenter={kind === 'product' ? enter : undefined}
				onpointermove={kind === 'article' ? drift : undefined}
				onpointerleave={kind === 'product' ? leave : kind === 'article' ? level : undefined}
			>
				{#if kind === 'repository'}
					<!-- no picture: the kind, the repository's name, what it is, its language -->
					<div class="px-3 pt-2.5">
						<span class="block font-mono text-[11px] leading-none text-mute">{kind}</span>
						<p class="mt-4 truncate font-mono text-[12px] leading-none font-medium text-fg">acme/widgets</p>
						<div class="mt-3.5 h-2 rounded-full bg-black/12"></div>
						<div class="mt-2 h-2 w-[88%] rounded-full bg-black/12"></div>
						<div class="mt-2 h-2 w-[50%] rounded-full bg-black/12"></div>
						<p class="mt-4 flex items-center gap-1.5 font-mono text-[11px] leading-none text-mute">
							<i class="size-2 rounded-full bg-rich"></i>TypeScript
						</p>
					</div>
				{:else}
					<!-- the picture: a small drawing in flat greys, no blue (the card's one blue thing is its fact). The article's
					     is a news photo of something, a city in the evening; the product's is the thing its link names, a desk
					     lamp, switched on, standing on a shelf. (The article's was an empty grey box, the product's a grey
					     square in the middle of one.) -->
					<div class="relative aspect-[16/10] bg-[#ededed]">
						<svg class="absolute inset-0 size-full" viewBox="0 0 160 100" preserveAspectRatio="xMidYMax slice">
							{#if kind === 'article'}
								<!-- A city in the evening, the moon over it: a few large buildings in two rows, with gaps between
								     the near ones, and nothing on them. Three depths, which shift against the pointer as it moves
								     over the card, the near one most (the styles are below): the moon, the far row, the near row.
								     Both rows run on past the picture's edges, so a shift uncovers nothing.
								     (Tried and taken back: two peaks and a sun, which read as the sign for "an image" and not as a
								     picture; the city with twice the buildings, lit windows and a mast, the busiest thing in the
								     scene; the city in outline; and, for a moment, no drawing at all.) -->
								<circle class="far" cx="136" cy="26" r="7" fill="#e0e0e0" />
								<path class="mid" d="M-10 112V60h34V48h20v16h38V44h18v16h24V50h26v12h22v50z" fill="#e3e3e3" />
								<path class="near" d="M-16 112V76h30v10h8V62h28v24h10V72h36v14h8V58h28v28h10V70h38v42z" fill="#d4d4d4" />
							{:else}
								<!-- A desk lamp with a jointed arm, switched on. It is a rig: the lower arm turns on the foot, the
								     upper arm on the elbow, the head (shade, bulb, light) on the arm's end, each group inside the one
								     before. Pointing at the card makes it hop twice (the keyframes are below), then turn its head to
								     the reader. The head is drawn twice: from the side (the shade, the bulb's edge, the light falling
								     on the shelf) and from the front (the shade's rim as a ring round the lit bulb, in a soft glow);
								     turning is the first folding away as the second opens. The shelf is drawn last, over the light
								     that falls past it. -->
								<g class="lamp" class:go={hop} class:look onanimationend={landed}>
									<g class="lower">
										<path d="M72 80 58 56" stroke="#bdbdbd" stroke-width="2.5" stroke-linecap="round" />
										<g class="upper">
											<path d="M58 56 82 40" stroke="#bdbdbd" stroke-width="2.5" stroke-linecap="round" />
											<g class="head">
												<g class="side">
													<path d="M69 58h26l70 140H-1z" fill="#fff" fill-opacity=".5" />
													<path d="M78 41h8l9 17H69z" fill="#cfcfcf" stroke="#cfcfcf" stroke-width="2.5" stroke-linejoin="round" />
													<ellipse cx="82" cy="58.6" rx="6" ry="2" fill="#fff" fill-opacity=".9" />
												</g>
												<circle cx="82" cy="40" r="3" fill="#bdbdbd" />
												<g class="front">
													<circle cx="82" cy="49" r="18" fill="#fff" fill-opacity=".4" />
													<circle cx="82" cy="49" r="11.5" fill="#cfcfcf" />
													<circle cx="82" cy="49" r="8.5" fill="#fff" fill-opacity=".8" />
													<circle cx="82" cy="49" r="3.4" fill="#fff" />
												</g>
											</g>
										</g>
										<circle cx="58" cy="56" r="2.6" fill="#bdbdbd" />
									</g>
									<rect x="59" y="80" width="26" height="4" rx="2" fill="#bdbdbd" />
								</g>
								<path d="M0 84h160v16H0z" fill="#e3e3e3" />
							{/if}
						</svg>
						<span class="absolute top-2.5 left-3 font-mono text-[11px] leading-none text-mute">{kind}</span>
					</div>
					<div class="px-3 pt-3">
						<!-- The card's title in words, as the repository has its name: the article's headline, two lines at
						     most, and the product's name, one line. The wording is a draft (TITLES, above). (Both were grey
						     lines, two for the headline and one for the name. Tried and taken back: pointing at the article
						     turned its lines into a headline about the lamp next door, "Desk lamp seen hopping in shop", and
						     set the lamp off.) -->
						<p class="line-clamp-2 text-[12px] leading-4 font-medium text-balance text-fg">{TITLES[kind]}</p>
					</div>
				{/if}
				<p class="mt-auto flex items-center justify-between gap-2 p-3 font-mono text-[11px] leading-none text-mute">
					<span class="truncate">{host}</span><span class="shrink-0 rounded-sm bg-rich/10 px-1.5 py-1 text-rich">{fact}</span>
				</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.card {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}

	/* The article's picture, in the drawing's own units: each layer shifts against the pointer (--px and --py, from
	   -1 to 1, set on the card), the near buildings by up to 6 across and 2 up or down, the far ones by half of that,
	   the moon hardly at all. The shift is eased, so the picture follows the pointer softly and levels out when it goes. */
	.far,
	.mid,
	.near {
		transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.3, 1);
	}
	.far {
		transform: translate(calc(var(--px, 0) * -1px), calc(var(--py, 0) * -0.4px));
	}
	.mid {
		transform: translate(calc(var(--px, 0) * -3px), calc(var(--py, 0) * -1px));
	}
	.near {
		transform: translate(calc(var(--px, 0) * -6px), calc(var(--py, 0) * -2px));
	}

	/* The lamp's joints, in the drawing's own units (the svg's viewBox): the foot, the elbow, the arm's end. At rest
	   the head looks down at the shelf, to the right. */
	.lower {
		transform-origin: 72px 80px;
	}
	.upper {
		transform-origin: 58px 56px;
	}
	.head {
		transform-origin: 82px 40px;
		transform: rotate(-30deg);
	}
	/* The head's two drawings: the side one folds along the head's own axis, from the arm's end; the front one opens
	   from its middle. At rest the side one shows. */
	.side {
		transform-origin: 82px 40px;
	}
	.front {
		transform-origin: 82px 49px;
		transform: scale(0.5);
		opacity: 0;
	}
	/* Looking at the reader (after the hop; the component sets .look): the head turns to the front and the arm
	   straightens a little, as a neck does. These are transitions, so the lamp turns back the same way. */
	.lower,
	.upper,
	.head,
	.side,
	.front {
		transition:
			transform 0.32s cubic-bezier(0.3, 0.7, 0.3, 1),
			opacity 0.22s;
	}
	.lamp.look .lower {
		transform: rotate(5deg);
	}
	.lamp.look .upper {
		transform: rotate(-10deg);
	}
	.lamp.look .head {
		transform: rotate(-22deg);
	}
	.lamp.look .side {
		transform: scaleY(0.4);
		opacity: 0;
	}
	.lamp.look .front {
		transform: scale(1);
		opacity: 1;
	}
	/* The hop, one run of 1.9s: it crouches, hops, lands, hops again a little lower and settles in the pose it began
	   in. The arm folds as a spring before a hop and on landing, and straightens in the air; the head counters the
	   arm, so it dips with a crouch and looks ahead in a hop. */
	.lamp.go {
		animation: lamp-hop 1.9s both;
	}
	.lamp.go .lower {
		animation: lamp-lower 1.9s both;
	}
	.lamp.go .upper {
		animation: lamp-upper 1.9s both;
	}
	.lamp.go .head {
		animation: lamp-head 1.9s both;
	}
	/* up fast and slowing, down gathering speed */
	@keyframes lamp-hop {
		0%, 10% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
		26% { transform: translateY(-15px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); }
		38%, 54% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
		69% { transform: translateY(-11px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); }
		82%, 100% { transform: translateY(0); }
	}
	@keyframes lamp-lower {
		0% { transform: rotate(0deg); }
		10% { transform: rotate(-14deg); }
		26% { transform: rotate(10deg); }
		38% { transform: rotate(-18deg); }
		46% { transform: rotate(-4deg); }
		54% { transform: rotate(-12deg); }
		69% { transform: rotate(8deg); }
		82% { transform: rotate(-14deg); }
		92% { transform: rotate(3deg); }
		100% { transform: rotate(0deg); }
	}
	@keyframes lamp-upper {
		0% { transform: rotate(0deg); }
		10% { transform: rotate(22deg); }
		26% { transform: rotate(-14deg); }
		38% { transform: rotate(28deg); }
		46% { transform: rotate(6deg); }
		54% { transform: rotate(18deg); }
		69% { transform: rotate(-12deg); }
		82% { transform: rotate(22deg); }
		92% { transform: rotate(-4deg); }
		100% { transform: rotate(0deg); }
	}
	@keyframes lamp-head {
		0% { transform: rotate(-30deg); }
		10% { transform: rotate(-28deg); }
		26% { transform: rotate(-52deg); }
		38% { transform: rotate(-26deg); }
		46% { transform: rotate(-30deg); }
		54% { transform: rotate(-30deg); }
		69% { transform: rotate(-50deg); }
		82% { transform: rotate(-26deg); }
		92% { transform: rotate(-32deg); }
		100% { transform: rotate(-30deg); }
	}
	@media (prefers-reduced-motion: reduce) {
		.lamp.go,
		.lamp.go * {
			animation: none;
		}
		.lower,
		.upper,
		.head,
		.side,
		.front {
			transition: none;
		}
		/* and the article's picture stays level */
		.far,
		.mid,
		.near {
			transform: none;
		}
	}
</style>
