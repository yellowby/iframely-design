<script lang="ts">
	// The provider block on /embeds: a sheet of squared paper (the developers' cards' cover) in the page's card box, with
	// the providers stuck on it as stickers: each a white label with the logo and the name, a little askew and a little
	// off its line. They drop onto the paper one by one when the block comes into view, straighten under the
	// pointer, and can be dragged about with a mouse (they stay where they are left). The last sticker is the blue one:
	// the link to the full list of 1,900. The closing line is the sheet's foot.
	// They run in order of kind: video and music, posts and documents, design files, maps, forms and code.
	// Logos: the live site's set (publicly, src/lib/ui-covers/domains/assets), copied to lib/assets/providers.
	import { onMount } from 'svelte';
	import { providerBySlug } from '#lib/data/providers.ts';

	const SRC = import.meta.glob('../assets/providers/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`];

	// [file, name, accent]: the accent is the logo's main colour, for the glow under the pointer (bare). The black
	// logos (X, Notion, GitHub, Lucid, Typeform, CodePen) have a blue-grey: black would be a smudge.
	const INK = '#6b7a99';
	const BLUE = '#0055ff'; // the last sticker's: the site's blue, as a plain colour (the glow's colour is animated)
	const ITEMS: [string, string, string][] = [
		['youtube', 'YouTube', '#ff0000'], ['vimeo', 'Vimeo', '#1ab7ea'], ['spotify', 'Spotify', '#1ed760'], ['soundcloud', 'SoundCloud', '#ff5500'], ['tiktok', 'TikTok', '#fe2c55'], ['twitch', 'Twitch', '#6441a5'], ['apple-music', 'Apple Music', '#fa243c'], ['loom', 'Loom', '#625df5'], ['ted-talks', 'TED Talks', '#e62b1e'], ['bandcamp', 'Bandcamp', '#629aa9'], ['mixcloud', 'Mixcloud', '#5000ff'], ['giphy', 'Giphy', '#9933ff'], ['genius', 'Genius', '#f5e000'], ['bandsintown', 'Bandsintown', '#00cec8'],
		['x', 'X/Twitter', INK], ['instagram', 'Instagram', '#e1306c'], ['notion', 'Notion', INK], ['facebook', 'Facebook', '#0866ff'], ['reddit', 'Reddit', '#ff4500'], ['coda', 'Coda', '#f46a54'], ['pinterest', 'Pinterest', '#e60023'], ['airtable', 'Airtable', '#fcb400'], ['issuu', 'Issuu', '#f36d5d'], ['google-docs', 'Google Docs', '#4285f4'], ['google-calendar', 'Google Calendar', '#4285f4'],
		['figma', 'Figma', '#a259ff'], ['canva', 'Canva', '#00c4cc'], ['google-maps', 'Google Maps', '#34a853'], ['miro', 'Miro', '#ffd02f'], ['calendly', 'Calendly', '#006bff'], ['typeform', 'Typeform', INK], ['github', 'GitHub', INK], ['codepen', 'CodePen', INK], ['lucid', 'Lucid', INK], ['gumroad', 'Gumroad', '#ff90e8'], ['kickstarter', 'Kickstarter', '#05ce78'], ['monday', 'Monday', '#ff3d57']
	];
	// (37 since 2026-11-24. Seven came, each of them in the live list at iframely.com/domains, under the name it has
	// there: Vimeo, SoundCloud, Twitch, TED Talks, Google Docs, Typeform and CodePen, so that the last row is not
	// the blue sticker alone. Their logos are from the same hand as the others: C:\web\domains-icons\dist.)
	// each sticker's tilt (degrees) and its step off the line (px): fixed, so the sheet looks the same on every visit
	const TILT = [-5, 3, -2, 6, -4, 2, 5, -6, 1, -3, 4];
	const STEP = [-4, 6, 0, 8, -6, 3, -2];

	let sheet: HTMLDivElement;
	let seen = $state(false);
	onMount(() => {
		const io = new IntersectionObserver(
			(es) => {
				if (!es.some((e) => e.isIntersecting)) return;
				// Each sticker falls from just above the paper's top edge, on its own: it lets go at a random moment (the
				// lower ones tend to go first, so there is something to land on), a longer fall takes longer, and the
				// knock from a neighbour comes a random moment after it has landed. No two land together.
				const h = sheet.offsetHeight;
				for (const el of sheet.querySelectorAll<HTMLElement>('.sticker')) {
					const fall = el.offsetTop + el.offsetHeight + 30;
					const at = (1 - el.offsetTop / h) * 450 + Math.random() * 1100;
					const dur = 520 + 330 * Math.sqrt(fall / 300) + Math.random() * 120;
					el.style.setProperty('--fall', fall + 'px');
					el.style.setProperty('--at', at + 'ms');
					el.style.setProperty('--dur', dur + 'ms');
					el.style.setProperty('--kn', at + dur * 0.52 + 120 + Math.random() * 500 + 'ms');
				}
				seen = true;
				io.disconnect();
			},
			{ threshold: 0.25 }
		);
		io.observe(sheet);
		return () => io.disconnect();
	});

	// links: each sticker is a link to its provider's page under /domains (to the full list where the prototype has no
	// page for it yet). foot: the sheet's closing line.
	// tame: the quiet sheet of /embeds-2, in line with that page's straight windows: the stickers are smaller labels in
	// even rows, with no tilt and no step off the line; they rise into place one after another, lift a little under
	// the pointer and cannot be dragged. The logos keep their colours.
	let {
		links = false,
		tame = false,
		foot = 'Whatever your users paste tomorrow, chances are it already works today.',
		flat = false,
		bare = false
	}: { links?: boolean; tame?: boolean; foot?: string; flat?: boolean; bare?: boolean } = $props();
	// flat: the sheet as a hairline outline, with no drop shadow (/embeds-3)
	// bare (/embeds, 2026-11-24): no white card about the paper and no closing line under it: the stickers on the
	// paper alone, straight on the page, as the papers of that page's blocks 02, 05 and 06. (The card, the paper in
	// it and the stickers on that were three boxes one in another, for a list of names.) The way to the full list is
	// the last sticker, as before. Bare, a sticker under the pointer does not lift as the tame ones do: a glow under
	// the pointer takes its provider's colour (below).
	const to = (id: string) => (providerBySlug(id) ? `/domains/${id}` : '/domains');

	// bare: the glow. A soft blob of colour on the paper, under the stickers, that follows the pointer (a mouse):
	// its middle is where the pointer is. A sticker gives it only its colour, the provider's: the blob lights when
	// the pointer first comes over a sticker, keeps the colour of the sticker pointed at last while the pointer is
	// anywhere over the paper (between the stickers too), and goes out only when the pointer leaves the paper.
	// With the keyboard there is no pointer: the blob is behind the sticker in focus.
	// (Tried first, the same day: the blob at the paper's edge nearest to the sticker pointed at, level with it, going
	// out as soon as the pointer left the sticker.)
	let glow = $state({ x: 0, y: 0, c: INK });
	let lit = $state(false);
	let inside = false; // the pointer is over the paper
	function follow(e: PointerEvent) {
		if (!bare || e.pointerType !== 'mouse') return;
		const p = sheet.getBoundingClientRect();
		inside = true;
		glow.x = e.clientX - p.left;
		glow.y = e.clientY - p.top;
	}
	function over(e: PointerEvent, c: string) {
		if (!bare || e.pointerType !== 'mouse') return;
		follow(e);
		glow.c = c;
		lit = true;
	}
	function focus(el: HTMLElement, c: string) {
		if (!bare) return;
		if (!inside) {
			const p = sheet.getBoundingClientRect();
			const r = el.getBoundingClientRect();
			glow.x = r.left + r.width / 2 - p.left;
			glow.y = r.top + r.height / 2 - p.top;
		}
		glow.c = c;
		lit = true;
	}
	// the pointer leaves the paper: the glow goes out
	const out = () => ((inside = false), (lit = false));
	// the keyboard's focus leaves the stickers: the glow goes out, unless the pointer holds it
	const blur = (e: FocusEvent) => !inside && !sheet.contains(e.relatedTarget as Node | null) && (lit = false);

	// dragging, with a mouse only (a finger on a sticker scrolls the page as anywhere else). A sticker that is a link is
	// picked up only once the pointer has moved a little (SLOP), so a plain click still follows the link; the click that
	// ends a drag does not.
	const SLOP = 4;
	let top = 1;
	function grab(e: PointerEvent) {
		if (tame || e.pointerType !== 'mouse' || e.button !== 0) return;
		const el = e.currentTarget as HTMLElement;
		e.preventDefault();
		const x0 = e.clientX - +(el.dataset.x ?? 0);
		const y0 = e.clientY - +(el.dataset.y ?? 0);
		let held = false;
		const hold = () => {
			held = true;
			try {
				el.setPointerCapture(e.pointerId);
			} catch {
				/* the pointer is already gone: the drag just ends at the sticker's edge */
			}
			el.classList.add('drag');
			el.style.zIndex = String(++top);
		};
		delete el.dataset.moved;
		if (!links) hold();
		const move = (m: PointerEvent) => {
			if (!held) {
				if (Math.hypot(m.clientX - e.clientX, m.clientY - e.clientY) < SLOP) return;
				el.dataset.moved = '1';
				hold();
			}
			el.dataset.x = String(m.clientX - x0);
			el.dataset.y = String(m.clientY - y0);
			el.style.setProperty('--dx', el.dataset.x + 'px');
			el.style.setProperty('--dy', el.dataset.y + 'px');
		};
		const drop = () => {
			el.classList.remove('drag');
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerup', drop);
			el.removeEventListener('pointercancel', drop);
		};
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerup', drop);
		el.addEventListener('pointercancel', drop);
	}
	// the click that comes at the end of a drag is not a visit
	function click(e: MouseEvent) {
		const el = e.currentTarget as HTMLElement;
		if (el.dataset.moved) e.preventDefault();
		delete el.dataset.moved;
	}
</script>

<div
	class="flow-root {bare
		? ''
		: flat
			? 'rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08)]'
			: 'rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]'}"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={sheet} class="paper" class:seen class:tame class:bare onpointermove={follow} onpointerleave={out}>
		{#if bare}<span class="glow" class:lit style="--gx:{glow.x}px;--gy:{glow.y}px;--pw-glow:{glow.c}" aria-hidden="true"></span>{/if}
		<ul class="stickers" aria-label="Some of the 1,900 providers">
			{#each ITEMS as [id, name, accent], i (id)}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
				<li
					class="sticker"
					class:link={links}
					style="--r:{TILT[i % TILT.length]}deg;--oy:{STEP[i % STEP.length]}px;--i:{i}"
					onpointerdown={grab}
					onclickcapture={click}
					onpointerenter={(e) => over(e, accent)}
					onfocusin={(e) => focus(e.currentTarget, accent)}
					onfocusout={blur}
				>
					{#if links}
						<a href={to(id)} draggable="false"><img src={logo(id)} alt="" loading="lazy" draggable="false" />{name}</a>
					{:else}
						<img src={logo(id)} alt="" loading="lazy" draggable="false" />{name}
					{/if}
				</li>
			{/each}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<li
				class="sticker more"
				style="--r:-3deg;--oy:2px;--i:{ITEMS.length}"
				onpointerenter={(e) => over(e, BLUE)}
				onfocusin={(e) => focus(e.currentTarget, BLUE)}
				onfocusout={blur}
			>
				<!-- (bare: no arrow after the words, /embeds 2026-11-24) -->
				<a href="/domains"
					>See all 1,900+{#if !bare}<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" /></svg>{/if}</a
				>
			</li>
		</ul>
	</div>
	{#if !bare}<p class="t-small px-6 pt-2 pb-5 text-center text-[15px]! text-mute md:px-9">{foot}</p>{/if}
</div>

<style>
	/* the squared paper of DevCover's bare covers: 12px inside the card, squares that fit the width a whole number of
	   times (28 across, 48 from md) */
	.paper {
		container-type: inline-size;
		--n: 28;
		--c: calc(100cqw / var(--n));
		--ln: rgb(0 0 0 / 0.035);
		position: relative;
		margin: 12px;
		border-radius: 6px;
		overflow: hidden;
		background-color: #fafafa;
		background-image: linear-gradient(to right, var(--ln) 1px, transparent 1px), linear-gradient(to bottom, var(--ln) 1px, transparent 1px);
		background-size: var(--c) var(--c);
		background-position: 0 -1px;
	}
	@media (min-width: 768px) {
		.paper {
			--n: 48;
		}
	}
	/* bare: the paper is the whole of the block, with no card to be set in: it is as wide as the page's column */
	.paper.bare {
		margin: 0;
	}
	/* bare: the glow (see the script): a soft oval of the colour of the provider pointed at last, its middle under
	   the pointer, cut by the paper's edges. Under the stickers. It trails the pointer a little, and its colour
	   turns into the next one: the colour is a registered property, so that it can. */
	@property --pw-glow {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	.glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 720px;
		height: 440px;
		margin: -220px 0 0 -360px;
		border-radius: 50%;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--pw-glow) 21%, transparent),
			color-mix(in srgb, var(--pw-glow) 9%, transparent) 45%,
			transparent
		); /* (30% and 13% at first: a bit much) */
		translate: var(--gx) var(--gy);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.4s,
			translate 0.25s cubic-bezier(0.2, 0.7, 0.2, 1),
			--pw-glow 0.35s;
	}
	.glow.lit {
		opacity: 1;
		transition:
			opacity 0.25s,
			translate 0.25s cubic-bezier(0.2, 0.7, 0.2, 1),
			--pw-glow 0.35s;
	}
	/* bare: a sticker under the pointer does not lift (the glow answers the pointer): its outline darkens, no more */
	@media (hover: hover) {
		.tame.bare.seen .sticker:hover {
			transform: none;
			box-shadow:
				0 0 0 1px rgb(0 0 0 / 0.2),
				0 1px 2px rgb(0 0 0 / calc(0.05 * var(--drop, 1)));
		}
		.tame.bare.seen .sticker.more:hover {
			box-shadow: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.glow,
		.glow.lit {
			transition: none;
		}
	}
	.stickers {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px 10px;
		padding: calc(var(--c) * 2) var(--c);
	}
	.sticker {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em 0.9em 0.5em 0.6em;
		border-radius: 10px;
		background: #fff;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 2px 6px rgb(0 0 0 / calc(0.08 * var(--drop, 1)));
		font-size: clamp(14px, 1.45vw, 19px);
		line-height: 1.3;
		font-weight: 500;
		letter-spacing: -0.02em;
		white-space: nowrap;
		color: var(--color-fg);
		cursor: grab;
		user-select: none;
		/* invisible until the sheet is seen */
		opacity: 0;
		transform: translate(var(--dx, 0px), calc(var(--dy, 0px) + var(--oy))) rotate(var(--r));
		transition:
			transform 0.25s,
			box-shadow 0.2s;
	}
	/* Seen: the stickers fall in from above the paper's top edge, one by one at times the script sets (--at, --dur,
	   --kn). A sticker speeds up as it falls, hits its place, hops once or twice and settles; a moment later, as
	   another comes down next to it, it takes a small knock (the second animation, on translate and rotate, which add
	   to the transform). */
	.seen .sticker {
		opacity: 1;
		animation:
			drop var(--dur, 0.85s) var(--at, 0s) backwards,
			knock 0.4s var(--kn, 0.8s) ease-out;
	}
	@keyframes drop {
		0% {
			transform: translate(0, calc(var(--oy) - var(--fall))) rotate(calc(var(--r) * -2.5));
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		52% {
			transform: translate(0, var(--oy)) rotate(calc(var(--r) * 0.4));
			animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
		}
		68% {
			transform: translate(0, calc(var(--oy) - 13px)) rotate(calc(var(--r) * 1.7));
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		84% {
			transform: translate(0, var(--oy)) rotate(calc(var(--r) * 0.8));
			animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
		}
		92% {
			transform: translate(0, calc(var(--oy) - 3px)) rotate(var(--r));
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		100% {
			transform: translate(0, var(--oy)) rotate(var(--r));
		}
	}
	@keyframes knock {
		30% {
			translate: calc(var(--r) * 0.3px) 4px;
			rotate: calc(var(--r) * -0.5);
		}
		65% {
			translate: 0 -1px;
			rotate: calc(var(--r) * 0.15);
		}
	}
	.sticker img {
		width: 1.25em;
		height: 1.25em;
		pointer-events: none;
	}
	/* under the pointer a sticker straightens and lifts; while dragged it follows the pointer at once */
	@media (hover: hover) {
		.seen .sticker:hover {
			transform: translate(var(--dx, 0px), calc(var(--dy, 0px) + var(--oy) - 3px)) rotate(0deg) scale(1.06);
			box-shadow:
				0 0 0 1px rgb(0 0 0 / 0.1),
				0 10px 22px rgb(0 0 0 / calc(0.14 * var(--drop, 1)));
			z-index: 999;
		}
	}
	.seen .sticker:global(.drag) {
		transition: none;
		cursor: grabbing;
	}
	/* a sticker that is a link: the link fills it, so the whole label takes the click */
	.sticker.link {
		padding: 0;
		cursor: pointer;
	}
	.sticker.link a {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em 0.9em 0.5em 0.6em;
		border-radius: inherit;
	}
	.sticker.link a:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	.sticker.more {
		padding: 0;
		background: var(--color-blue);
		box-shadow: 0 2px 6px rgb(0 85 255 / calc(0.3 * var(--drop, 1)));
		color: #fff;
		cursor: pointer;
	}
	.more a {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		padding: 0.5em 0.8em 0.5em 0.9em;
	}
	/* (bare: without the arrow the words have the same room on both sides) */
	.bare .more a {
		padding: 0.5em 0.9em;
	}
	.more svg {
		width: 0.85em;
		height: 0.85em;
		transition: transform 0.2s;
	}
	.more:hover svg {
		transform: translateX(0.15em);
	}
	/* The tame sheet: straight labels in even rows, the size of the page's other small controls. */
	.tame .stickers {
		gap: 10px 8px;
	}
	.tame .sticker {
		/* the page's scale: card 8px, paper and what lies on it 6px, blocks inside 4px */
		border-radius: 6px;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 1px 2px rgb(0 0 0 / calc(0.05 * var(--drop, 1)));
		font-size: 16.5px;
		letter-spacing: -0.01em;
		transform: none;
		cursor: default;
	}
	/* bare (/embeds): the names a step quieter, so the logos lead: regular weight in the body grey, 15px.
	   (They were as on the card: medium, in the headings' black, 16.5px. 2026-11-24.) The blue "See all" keeps
	   its medium white words. */
	.tame.bare .sticker:not(.more) {
		font-size: 15px;
		font-weight: 400;
		color: var(--color-body);
	}
	.tame.bare .sticker.more {
		font-size: 15px;
	}
	/* bare: the boxes' insides in whole pixels, mostly on the page's 4px steps (2026-11-24). A sticker is 36px tall: a
	   20px line with 8px over and under it, 10px before the 18px logo, 8px between the logo and the name, 12px
	   after the name (with 14px a row took nine, not ten, and the last row was Monday and the blue one). (In ems of the 15px they came to 34.5px tall: 7.5px, 9px, an 18.75px logo, 7.5px, 13.5px.)
	   The paper has 40px over and under the rows and 32px at the sides. (It was two of its squares and one: 50px
	   and 25px, heavier above and below than the rows' own 10px called for, and tight at the sides.) */
	.tame.bare .stickers {
		padding: 40px 32px;
	}
	.tame.bare .sticker {
		line-height: 20px;
	}
	.tame.bare .sticker.link a {
		gap: 8px;
		padding: 8px 12px 8px 10px;
	}
	.tame.bare .sticker img {
		width: 18px;
		height: 18px;
	}
	.tame.bare .more a {
		padding: 8px 12px;
	}
	.tame .sticker.link,
	.tame .sticker.more {
		cursor: pointer;
	}
	.tame .sticker.more {
		box-shadow: none;
	}
	/* seen: they rise into place one after another, in reading order */
	.tame.seen .sticker {
		animation: rise 0.45s calc(var(--i) * 18ms) ease-out backwards;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	@media (hover: hover) {
		.tame.seen .sticker:hover {
			transform: translateY(-1px);
			box-shadow:
				0 0 0 1px rgb(0 0 0 / 0.2),
				0 4px 10px rgb(0 0 0 / calc(0.08 * var(--drop, 1)));
		}
		.tame.seen .sticker.more:hover {
			box-shadow: 0 4px 10px rgb(0 85 255 / calc(0.3 * var(--drop, 1)));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sticker,
		.seen .sticker,
		.tame.seen .sticker {
			transition: none;
			animation: none;
		}
	}
</style>
