<script lang="ts">
	import { onMount } from 'svelte';
	import { cta, CTA_BG } from '#lib/tweaks.svelte.ts';

	// X01 in the motion lab (Dither sections, "Glyph clusters, dissolving edge") with its default copy, the Publisher
	// Console: a section on the brand blue with //:<> glyph clusters in the top-right corner and down the left edge,
	// faint dot patches between them, and the ground dissolving into the page through a Bayer edge of 8px cells.
	// The copy is live HTML in the site's type roles; the art is a canvas behind it, drawn to the section's size.
	//
	// The lab samples its fields with a WebGL shader (demos/dither-set.js) and lays the type out in
	// demos/dither-stills2.js. This is the same maths for the three fields X01 uses (radial, clouds, linear), on the CPU,
	// so the page needs none of the lab's scripts. Seed 1, as the lab's card.
	// the ground: the brand blue, or the colour picked in the Tweakpane panel (lib/tweaks.svelte.ts)
	const BLUE = $derived(CTA_BG[cta.bg]);
	$effect(() => {
		void BLUE;
		draw();
	});
	const SEED = 1;
	const FS = 20; // glyph size; a cell is one JetBrains Mono advance (.6 em) by 1.25 em
	const CW = FS * 0.6;
	const CH = FS * 1.25;
	const BASE = (0.5 * 1.25 + 0.3) * FS; // baseline from the cell top
	const EDGE = { up: 32, down: 40, cell: 8 }; // the Bayer band: 32px into the section, 40px past it

	// The copy defaults to the Publisher Console (home); a page passes its own. buttons: [label, href], the first is the main one.
	let {
		title = 'Start with one URL',
		sub,
		text,
		note,
		buttons = [
			['Get API key', '#signup'],
			['Check URL', '/try']
		]
	}: { title?: string; sub?: string; text?: string; note?: string; buttons?: [string, string][] } = $props();

	let sec = $state<HTMLElement>();
	let cv = $state<HTMLCanvasElement>();

	// ---- the shader's noise, in JS
	const fract = (v: number) => v - Math.floor(v);
	const smooth = (a: number, b: number, v: number) => {
		const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
		return t * t * (3 - 2 * t);
	};
	function hash2(x: number, y: number) {
		x = fract(x * 123.34);
		y = fract(y * 456.21);
		const d = x * (x + 45.32) + y * (y + 45.32);
		return fract((x + d) * (y + d));
	}
	function vnoise(x: number, y: number) {
		const ix = Math.floor(x), iy = Math.floor(y);
		let fx = x - ix, fy = y - iy;
		fx = fx * fx * (3 - 2 * fx);
		fy = fy * fy * (3 - 2 * fy);
		const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
		return a + (b - a) * fx + (c + (d - c) * fx - (a + (b - a) * fx)) * fy;
	}
	function fbm(x: number, y: number) {
		let v = 0, a = 0.5;
		for (let i = 0; i < 4; i++) {
			v += a * vnoise(x, y);
			x = x * 2.03 + 17.1;
			y = y * 2.03 + 17.1;
			a *= 0.5;
		}
		return v;
	}
	// 8×8 ordered dither threshold, and the per-cell pick of a character
	function bayer(x: number, y: number) {
		x &= 7;
		y &= 7;
		let v = 0;
		for (let i = 0; i < 3; i++) {
			const xb = (x >> i) & 1, yb = (y >> i) & 1;
			v = v * 4 + ((xb ^ yb) * 2 + yb);
		}
		return (v + 0.5) / 64;
	}
	const pick = (i: number, j: number) => fract(Math.sin(i * 127.1 + j * 311.7 + SEED * 74.7) * 43758.5453);

	// ---- fields: uv.y runs up (1 at the top), q is uv with x in aspect units
	// a cluster: 1 at its centre, falling to 0 at radius r, its rim broken by noise
	const radial = (qx: number, qy: number, asp: number, cx: number, cy: number, r: number, pow: number, rough: number) => {
		const d = Math.hypot(qx - cx * asp, qy - (cy + 0.05)) + (fbm(qx * 2.5 + SEED, qy * 2.5 + SEED) - 0.5) * rough;
		return Math.pow(Math.max(1 - smooth(0, r, d), 0), pow);
	};
	const clouds = (qx: number, qy: number) => smooth(0.5, 0.8, fbm(qx * 2.6 + SEED, qy * 2.6 + SEED)) * 0.5;

	// glyph levels 1–5: [characters, weight, the stronger ink]
	type Level = [string[], number, boolean];
	const MARKS = ['/', '/', '<', '>'];
	const BRAND: Level[] = [[['.'], 400, false], [[':'], 400, false], [MARKS, 400, false], [MARKS, 600, false], [MARKS, 800, true]];
	const DOTS: Level[] = [[['.'], 400, false], [['.'], 700, false], [[':'], 400, false], [[':'], 700, false], [[':'], 800, true]];

	function draw() {
		if (!sec || !cv) return;
		const W = sec.clientWidth, H = sec.clientHeight;
		if (!W || !H) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2), total = H + EDGE.down;
		cv.width = Math.round(W * dpr);
		cv.height = Math.round(total * dpr);
		cv.style.width = W + 'px';
		cv.style.height = total + 'px';
		const x = cv.getContext('2d')!;
		x.setTransform(dpr, 0, 0, dpr, 0, 0);
		x.clearRect(0, 0, W, total);

		// the ground, down to where the edge takes over
		const hh = H - EDGE.up;
		x.fillStyle = BLUE;
		x.fillRect(0, 0, W, hh);

		// the type: per cell the strongest of the three fields owns it, Bayer picks its level, its set writes the character
		const asp = W / hh, cols = Math.ceil(W / CW), rows = Math.ceil(hh / CH);
		// The clusters are sized in heights, as in the lab. A phone's section is tall and narrow, so there they shrink
		// with the aspect, and the left one (which would sit under the body copy) is left out.
		const k = Math.min(1, asp / 1.6), narrow = W < 640;
		x.textAlign = 'center';
		x.textBaseline = 'alphabetic';
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < cols; i++) {
				const px = Math.min(W - 1, Math.floor((i + 0.5) * CW)), py = Math.min(hh - 1, Math.floor((j + 0.5) * CH));
				const qx = (px / W) * asp, qy = 1 - py / hh;
				const a = radial(qx, qy, asp, 1.0, 1.04, 0.62 * k, 1.25, 0.4 * k); // top-right corner
				const b = narrow ? 0 : radial(qx, qy, asp, -0.02, 0.4, 0.42 * k, 1.3, 0.45 * k); // left edge
				const c = narrow ? clouds(qx, qy) * 0.6 : clouds(qx, qy); // dot patches, fainter under a phone's copy
				const v = Math.min(1, Math.max(a, b, c)), lv = v * 5, fl = Math.floor(lv);
				const level = Math.min(5, fl + (lv - fl >= bayer(i, j) ? 1 : 0));
				if (!level) continue;
				const [chars, weight, strong] = (c > a && c > b ? DOTS : BRAND)[level - 1];
				x.font = `${weight} ${FS}px "JetBrains Mono", ui-monospace, monospace`;
				x.fillStyle = strong ? 'rgba(255,255,255,.58)' : 'rgba(255,255,255,.3)';
				x.fillText(chars[Math.floor(pick(i, j) * chars.length)], (i + 0.5) * CW, j * CH + BASE);
			}
		}

		// the edge: blue cells where a top-to-bottom gradient, broken by noise, beats the Bayer matrix; the top row is solid
		const bandH = EDGE.up + EDGE.down, easp = W / bandH, bcols = Math.ceil(W / EDGE.cell), brows = Math.ceil(bandH / EDGE.cell);
		x.fillStyle = BLUE;
		for (let j = 0; j < brows; j++) {
			for (let i = 0; i < bcols; i++) {
				const ux = Math.min(W - 1, (i + 0.5) * EDGE.cell) / W, uy = 1 - Math.min(bandH - 1, (j + 0.5) * EDGE.cell) / bandH;
				const v = smooth(0, 1, uy + (fbm(ux * easp * 3 + SEED, uy * 3 + SEED) - 0.5) * 0.22);
				if (j === 0 || v > bayer(i, j)) x.fillRect(i * EDGE.cell, hh + j * EDGE.cell, EDGE.cell, EDGE.cell);
			}
		}
	}

	onMount(() => {
		draw();
		// the glyphs need JetBrains Mono in three weights; draw again when they are in
		const fonts = [400, 600, 800].map((w) => document.fonts.load(`${w} ${FS}px "JetBrains Mono"`));
		Promise.all(fonts).then(draw, () => {});
		const ro = new ResizeObserver(draw);
		ro.observe(sec!);
		return () => ro.disconnect();
	});
</script>

<!-- the margin leaves room for the 40px of edge that dissolves past the section -->
<section bind:this={sec} class="relative mb-10 text-white">
	<canvas bind:this={cv} class="pointer-events-none absolute top-0 left-0 block" aria-hidden="true"></canvas>
	<div class="relative grid gap-x-12 gap-y-6 px-6 pt-8 pb-14 md:grid-cols-2 md:px-10 md:pt-10 md:pb-16">
		{#snippet cta(cls: string)}
			<div class="flex flex-wrap content-start gap-2 {cls}">
				{#each buttons as [label, to], i (label)}
					<a
						href={to}
						style:color={i ? undefined : BLUE}
						class="t-button inline-flex items-center rounded-full px-5 py-2 transition-colors {i
							? 'ring-1 ring-white/35 ring-inset hover:ring-white/70'
							: 'bg-white hover:bg-white/85'}">{label}</a
					>
				{/each}
			</div>
		{/snippet}
		<!-- with body copy the buttons sit under the title; without it they take the right column -->
		<div>
			<h2 class="t-h2">{title}</h2>
			{#if sub}<p class="t-body mt-3 max-w-[44ch] text-white/85">{sub}</p>{/if}
			{#if text || note}{@render cta('mt-8')}{/if}
		</div>
		{#if !text && !note}{@render cta('md:flex-row-reverse md:pt-0.5')}{/if}
		{#if text || note}
			<div class="md:pt-1">
				{#if text}<p class="t-body max-w-[48ch]">{text}</p>{/if}
				{#if note}<p class="t-note mt-5 text-white/85">{note}</p>{/if}
			</div>
		{/if}
	</div>
</section>
