<script lang="ts">
	import { onMount } from 'svelte';
	import { cta, CTA_BG } from '#lib/tweaks.svelte.ts';

	// The closing block: a section on the brand blue with the ground dissolving into the page through a Bayer edge of
	// 8px cells (X01 in the motion lab, Dither sections). The copy is live HTML in the site's type roles.
	//
	// Its texture is the noise of the home page's four product cards (components/DitherHead.svelte, after the lab's
	// D14): clouds, Bayer-dithered in 2.5px cells, growing out of the bottom-right corner, in the cards' "solid" ink (a
	// tint of the ground). Unlike the cards they stand still, with no hover: one frame, from a random seed, so every
	// page load has its own pattern. (The block used to carry X01's //:<> glyph clusters, hence the name.)
	// Two canvases behind the copy, both drawn once per size: the ground with its edge, and the clouds, one canvas pixel
	// per dither cell, scaled up unsmoothed.
	// the ground: the brand blue, or the colour picked in the Tweakpane panel (lib/tweaks.svelte.ts)
	const BLUE = $derived(CTA_BG[cta.bg]);
	$effect(() => {
		void BLUE;
		draw();
	});
	const SEED = 1;
	const CELL = 2.5; // CSS px of one dither cell of the clouds, as on the cards
	const TWO = 0.55; // above this value the second ink (white) takes over
	const REACH = 0.6; // how far the clouds reach from the corner, of the block's width (the cards: about 1.2 heights)
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
		],
		noise = true
	}: {
		title?: string;
		sub?: string;
		text?: string;
		note?: string;
		buttons?: [string, string][];
		/* the clouds in the bottom-right corner; false leaves the plain ground and its edge */
		noise?: boolean;
	} = $props();

	let sec = $state<HTMLElement>();
	let cv = $state<HTMLCanvasElement>();
	let nz = $state<HTMLCanvasElement>(); // the clouds

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

	// ---- the clouds: the cards' field (DitherHead), one canvas pixel per cell
	const rgb = (c: string) => {
		const n = parseInt(c.slice(1), 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	};
	const tint = (c: string, k: number) => rgb(c).map((v) => Math.round(v + (255 - v) * k));
	let cols = 0, rows = 0, cw = 0, ch = 0; // cells, and the clouds' size in CSS px
	let img: ImageData | undefined;
	let cloudSeed = SEED; // a new pattern on every page load (set on mount)
	let edge = new Uint8Array(0), ecols = 0, erows = 0; // the edge band's 8px squares: 1 where blue
	// is the CSS-px point (x, y) on blue? Always on the ground; in the band, where its square is blue
	const onBlue = (x: number, y: number) => {
		if (y < ch) return true;
		const i = Math.floor(x / EDGE.cell), j = Math.floor((y - ch) / EDGE.cell);
		return i >= 0 && i < ecols && j < erows && edge[j * ecols + i] === 1;
	};

	// the edge: is its 8px cell (i, j), counted from the top of the band, a blue one? A top-to-bottom gradient, broken by
	// noise, against the Bayer matrix; the top row is solid.
	function edgeBlue(i: number, j: number, W: number) {
		if (j === 0) return true;
		const bandH = EDGE.up + EDGE.down, easp = W / bandH;
		const ux = Math.min(W - 1, (i + 0.5) * EDGE.cell) / W, uy = 1 - Math.min(bandH - 1, (j + 0.5) * EDGE.cell) / bandH;
		return smooth(0, 1, uy + (fbm(ux * easp * 3 + SEED, uy * 3 + SEED) - 0.5) * 0.22) > bayer(i, j);
	}

	// The clouds cover the ground and the edge band under it, so they run on into the dissolving squares instead of
	// stopping at a straight line above them; in the band a cloud cell shows only where its square is blue.
	function layoutClouds(W: number, hh: number) {
		if (!nz) return;
		cw = W;
		ch = hh;
		cols = Math.ceil(W / CELL);
		rows = Math.ceil((hh + EDGE.up + EDGE.down) / CELL);
		// the edge's squares, once per size
		ecols = Math.ceil(W / EDGE.cell);
		erows = Math.ceil((EDGE.up + EDGE.down) / EDGE.cell);
		edge = new Uint8Array(ecols * erows);
		for (let j = 0; j < erows; j++) for (let i = 0; i < ecols; i++) edge[j * ecols + i] = edgeBlue(i, j, W) ? 1 : 0;
		nz.width = cols;
		nz.height = rows;
		nz.style.width = cols * CELL + 'px';
		nz.style.height = rows * CELL + 'px';
		img = nz.getContext('2d')!.createImageData(cols, rows);
	}

	function paint() {
		if (!img || !nz) return;
		// the cards' "solid" inks: a tint of the ground, then white
		const A = tint(BLUE, 0.32), B = [255, 255, 255];
		// The cards measure the corner's reach in heights. This block is wide and short, so the reach is a share of its
		// width instead: sx squeezes the horizontal distance so the clouds end REACH of the width from the corner.
		const asp = cw / ch, sx = 1.2 / (REACH * asp), d = img.data;
		for (let j = 0; j < rows; j++) {
			const y0 = j * CELL, y1 = y0 + CELL - 0.01, uy = (y0 + CELL / 2) / ch; // from the top; past 1 in the edge band
			const band = y1 >= ch;
			for (let i = 0; i < cols; i++) {
				const ux = (i + 0.5) / cols, o = (j * cols + i) * 4, x0 = i * CELL, x1 = x0 + CELL - 0.01;
				const w = 1 - smooth(0.2, 1.2, Math.hypot((1 - ux) * asp * sx, 1 - uy));
				// in the band a cell is kept only if all four of its corners are on blue squares, so none spills onto the page
				if (w <= 0 || (band && !(onBlue(x0, y0) && onBlue(x1, y0) && onBlue(x0, y1) && onBlue(x1, y1)))) {
					d[o + 3] = 0;
					continue;
				}
				let v = smooth(0.4, 0.85, fbm(ux * asp * 2.2 + cloudSeed * 13.7, (1 - uy) * 2.2 + cloudSeed * 7.3) + 0.15 * w);
				v *= w * 0.55;
				const th = bayer(i, rows - 1 - j);
				const c = (v - TWO) / (1 - TWO) > th ? B : v > th ? A : null;
				if (c) {
					d[o] = c[0];
					d[o + 1] = c[1];
					d[o + 2] = c[2];
					d[o + 3] = 255;
				} else d[o + 3] = 0;
			}
		}
		nz.getContext('2d')!.putImageData(img, 0, 0);
	}

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
		// Drawn in device pixels, every edge rounded to a whole one: at a fractional display scale (125%) CSS-px
		// rectangles end between pixels, and their soft edges show as faint lines where the ground meets the band and
		// between the band's rows.
		x.setTransform(1, 0, 0, 1, 0, 0);
		x.clearRect(0, 0, cv.width, cv.height);
		const px = (v: number) => Math.round(v * dpr);
		const rect = (x0: number, y0: number, w: number, h: number) => x.fillRect(px(x0), px(y0), px(x0 + w) - px(x0), px(y0 + h) - px(y0));

		// the ground, down to where the edge takes over
		const hh = H - EDGE.up;
		x.fillStyle = BLUE;
		rect(0, 0, W, hh);

		// the clouds: on the ground and on into the edge's blue squares
		layoutClouds(W, hh);
		paint();

		// the edge: blue cells where a top-to-bottom gradient, broken by noise, beats the Bayer matrix; the top row is solid
		const bandH = EDGE.up + EDGE.down, bcols = Math.ceil(W / EDGE.cell), brows = Math.ceil(bandH / EDGE.cell);
		x.fillStyle = BLUE;
		for (let j = 0; j < brows; j++) {
			for (let i = 0; i < bcols; i++) {
				if (edgeBlue(i, j, W)) rect(i * EDGE.cell, hh + j * EDGE.cell, EDGE.cell, EDGE.cell);
			}
		}
	}

	onMount(() => {
		cloudSeed = Math.random() * 100; // still, and different on every load
		draw();
		const ro = new ResizeObserver(draw);
		ro.observe(sec!);
		return () => ro.disconnect();
	});
</script>

<!-- the margin leaves room for the 40px of edge that dissolves past the section -->
<section bind:this={sec} class="relative mb-10 text-white">
	<canvas bind:this={cv} class="pointer-events-none absolute top-0 left-0 block" aria-hidden="true"></canvas>
	<!-- the clouds: over the ground and the edge band (40px past the section), clipped at the section's sides -->
	{#if noise}
		<div class="pointer-events-none absolute inset-x-0 top-0 overflow-hidden" style:bottom="{-EDGE.down}px" aria-hidden="true">
			<canvas bind:this={nz} class="absolute top-0 left-0 block max-w-none [image-rendering:pixelated]"></canvas>
		</div>
	{/if}
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
