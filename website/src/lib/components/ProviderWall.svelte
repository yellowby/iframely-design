<script lang="ts">
	// The provider block on /embeds: a sheet of squared paper (the developers' cards' cover) in the page's card box, with
	// the providers stuck on it as stickers: each a white label with the logo and the name, a little askew and a little
	// off its line. They drop onto the paper one by one when the block comes into view, straighten under the
	// pointer, and can be dragged about with a mouse (they stay where they are left). The last sticker is the blue one:
	// the rest of the 1,900, the link to the full list. The closing line is the sheet's foot.
	// They run in order of kind: video and music, posts and documents, design files, maps, forms and code.
	// Logos: the live site's set (publicly, src/lib/ui-covers/domains/assets), copied to lib/assets/providers.
	import { onMount } from 'svelte';

	const SRC = import.meta.glob('../assets/providers/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`];

	// [file, name]
	const ITEMS: [string, string][] = [
		['youtube', 'YouTube'], ['spotify', 'Spotify'], ['tiktok', 'TikTok'], ['apple-music', 'Apple Music'], ['loom', 'Loom'], ['bandcamp', 'Bandcamp'], ['mixcloud', 'Mixcloud'], ['giphy', 'Giphy'], ['genius', 'Genius'], ['bandsintown', 'Bandsintown'],
		['x', 'X/Twitter'], ['instagram', 'Instagram'], ['notion', 'Notion'], ['facebook', 'Facebook'], ['reddit', 'Reddit'], ['coda', 'Coda'], ['pinterest', 'Pinterest'], ['airtable', 'Airtable'], ['issuu', 'Issuu'], ['google-calendar', 'Google Calendar'],
		['figma', 'Figma'], ['canva', 'Canva'], ['google-maps', 'Google Maps'], ['miro', 'Miro'], ['calendly', 'Calendly'], ['github', 'GitHub'], ['lucid', 'Lucid'], ['gumroad', 'Gumroad'], ['kickstarter', 'Kickstarter'], ['monday', 'Monday']
	];
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

	// dragging, with a mouse only (a finger on a sticker scrolls the page as anywhere else)
	let top = 1;
	function grab(e: PointerEvent) {
		if (e.pointerType !== 'mouse' || e.button !== 0) return;
		const el = e.currentTarget as HTMLElement;
		e.preventDefault();
		const x0 = e.clientX - +(el.dataset.x ?? 0);
		const y0 = e.clientY - +(el.dataset.y ?? 0);
		el.setPointerCapture(e.pointerId);
		el.classList.add('drag');
		el.style.zIndex = String(++top);
		const move = (m: PointerEvent) => {
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
</script>

<div class="flow-root rounded-lg bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_8px_24px_rgb(0_0_0/calc(0.06*var(--drop,1)))]">
	<div bind:this={sheet} class="paper" class:seen>
		<ul class="stickers" aria-label="Some of the 1,900 providers">
			{#each ITEMS as [id, name], i (id)}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li class="sticker" style="--r:{TILT[i % TILT.length]}deg;--oy:{STEP[i % STEP.length]}px;--i:{i}" onpointerdown={grab}>
					<img src={logo(id)} alt="" loading="lazy" draggable="false" />{name}
				</li>
			{/each}
			<li class="sticker more" style="--r:-3deg;--oy:2px;--i:{ITEMS.length}">
				<a href="/domains"
					>+ 1,900 more<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" /></svg></a
				>
			</li>
		</ul>
	</div>
	<p class="t-small px-6 pt-2 pb-5 text-center text-[15px]! text-mute md:px-9">Whatever your users paste tomorrow, chances are it already works today.</p>
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
	.more svg {
		width: 0.85em;
		height: 0.85em;
		transition: transform 0.2s;
	}
	.more:hover svg {
		transform: translateX(0.15em);
	}
	@media (prefers-reduced-motion: reduce) {
		.sticker,
		.seen .sticker {
			transition: none;
			animation: none;
		}
	}
</style>
