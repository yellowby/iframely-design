<script lang="ts">
	import { onMount } from 'svelte';

	// A product scene from the motion lab, mounted from copies of the lab's scripts in #lib/scene (refresh them with
	// npm run scene:sync; the build never reads the lab). Client only; the box keeps the scene's height so nothing moves
	// when it mounts.
	//   home: S41, the hero band (URL line with the // spinner, the gradient progress line, the four windows, chat in
	//         Preview API); onCycle runs after the last window answers.
	//   rich: the /embeds block's scene (S03 reworked: a post written as you watch, its links turning into hosted
	//         embeds, the URL's embed options, the provider marquee).
	//   preview, data, pub: S05, S07 and S09 for the /preview-api, /data-api and /console blocks.
	// Runs only in the viewport: the scripts load and the scene mounts when the box comes within 300px of the screen,
	// and from then on the scene's root goes .off whenever it is out of view (or the tab is hidden), which holds its
	// timeline and the // spinner (in the scripts) and its CSS animations (the rule below).
	// The box also keeps the tallest height the scene has reached at this width, so the page under it never moves
	// (S03 holds a constant height of its own: richBand sizes it for its tallest embed).
	type SceneName = 'home' | 'rich' | 'preview' | 'data' | 'pub';
	let { scene, onCycle, class: cls = '' }: { scene: SceneName; onCycle?: () => void; class?: string } = $props();
	let host: HTMLDivElement;

	onMount(() => {
		let un: (() => void) | undefined;
		let gone = false;
		const mount = async () => {
			await import('#lib/scene/demos.js');
			await import('#lib/scene/logo.js');
			await import('#lib/scene/logo14.js'); // favicons for the cards
			await import('#lib/scene/sec.js');
			if (gone) return;
			const kit = (globalThis as any).DEMOS.secKit;
			un =
				scene === 'home'
					? kit.homeBand(host, { onCycle: () => onCycle?.() })
					: scene === 'rich'
						? kit.richBand(host)
						: kit.sceneBand(host, { prod: scene });
		};
		const near = new IntersectionObserver(
			(es) => {
				if (!es.some((e) => e.isIntersecting)) return;
				near.disconnect();
				mount().catch((e) => console.warn(`Scene ${scene} failed`, e));
			},
			{ rootMargin: '300px 0px' }
		);
		near.observe(host);
		let max = 0;
		let width = 0;
		const keep = new ResizeObserver(() => {
			if (host.offsetWidth !== width) {
				// a new width: let the scene find its height again
				width = host.offsetWidth;
				max = 0;
				host.style.minHeight = '';
			}
			if (host.offsetHeight > max) {
				max = host.offsetHeight;
				host.style.minHeight = max + 'px';
			}
		});
		keep.observe(host);
		return () => {
			gone = true;
			near.disconnect();
			keep.disconnect();
			un?.();
		};
	});
</script>

<div bind:this={host} class="grid {cls}"></div>

<style>
	/* The lab scenes were built on the lab's base (15px / 1.5, browser-default margins, inline images), not on Tailwind's
	   preflight. These zero-specificity rules put that base back inside the scenes only; the lab's own rules still win. */
	:global(:where(.hx-embed, .sx-embed, .sx-band)) {
		font-size: 15px;
		line-height: 1.5;
	}
	:global(:where(.hx-embed, .sx-embed, .sx-band) :where(img, svg, video, canvas)) {
		display: inline;
		vertical-align: baseline;
		max-width: none;
	}
	:global(:where(.hx-embed, .sx-embed, .sx-band) :where(p, h1, h2, h3, h4, h5, h6, blockquote, dl, dd, figure, pre, ul, ol)) {
		margin: revert;
	}
	:global(:where(.hx-embed, .sx-embed, .sx-band) :where(h1, h2, h3, h4, h5, h6)) {
		font-size: revert;
		font-weight: revert;
	}
	/* Out of view a scene holds its CSS animations too (the lab has this rule in lib/demos.css, which the site doesn't
	   load) */
	:global(.demo.off),
	:global(.demo.off *),
	:global(.demo.off *::before),
	:global(.demo.off *::after) {
		animation-play-state: paused !important;
	}
	/* S41's URL line (the // and the typed URL) a step up from the lab's 14.5px */
	:global(.hx-embed .hx-band.bare .cx-cmd),
	:global(.hx-embed .hx-mark) {
		font-size: 16px;
	}
	/* S41's windows here are 286px wide, 254px in the lab: keep the media at the lab's 125px (222px × 9/16) so the embed
	   code under it stays inside the 196px body */
	:global(.hx-embed .cx-pl) {
		aspect-ratio: auto;
		height: 125px;
	}
</style>
