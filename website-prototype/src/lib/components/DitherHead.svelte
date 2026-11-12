<script lang="ts">
	import { onMount } from 'svelte';
	import { ICONS, type IconName } from '#lib/data/icons.ts';

	// The cover of a product card, after D14 in the motion lab (Dither, "Product card headers"): the product's icon
	// dithered in the product colour over a faint, drifting cloud texture in its tint. The icon is dense at the foot and
	// dissolves a little upwards. At rest the icon is the plain outline; hovering the card thickens the clouds and
	// turns the icon into its dithered version (the lab's pointer lamp is left out).
	//
	// The lab renders it with a WebGL shader (demos/dither-set.js: field clouds, method bayer, cell 2.5, two inks, the
	// text as a max mask). This is the same maths on the CPU, one canvas pixel per (fine) dither cell, scaled up unsmoothed.
	// Here the symbol is the product's icon from the header's Product dropdown, not the lab's // <> {:} :/, and the
	// clouds grow out of the bottom-right corner, with their own pattern per card (seed).
	// invert: the full colour as the ground with white ink, instead of the tint with the colour as ink.
	// pad: CSS px of the icon from the bottom and left edges (16 on a cover set 8px inside the card, 24 on a flush one).
	let { color, icon, seed = 0, invert = false, pad = 16 }: { color: string; icon: IconName; seed?: number; invert?: boolean; pad?: number } = $props();
	let repaint = () => {}; // set on mount: lay out and paint again
	$effect(() => {
		void invert;
		void pad;
		repaint();
	});

	const CELL = 2.5; // CSS px of one dither cell of the clouds
	const FINE = 2; // the icon's cells are this many times finer (1.25px), so its small details hold
	const SIZE = 0.34; // the icon's size, of the cover's height
	const STROKE = 1.2; // its stroke, in the icon's 24-unit grid: about the plain outline's 2px, plus the dither's loss
	const FADE = 0.45; // how much the icon dissolves towards its top (the lab's symbols: .7; an outline needs less)
	const TWO = 0.55; // above this value the second, full-colour ink takes over

	let box = $state<HTMLDivElement>();
	let cv = $state<HTMLCanvasElement>();
	let hot = $state(false); // the card is hovered: the crisp icon gives way to the dithered one

	const rgb = (c: string) => {
		const n = parseInt(c.slice(1), 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	};
	const tint = (c: string, k: number) => rgb(c).map((v) => Math.round(v + (255 - v) * k));
	// A stronger tint than the lab's (12% of the product colour, not 4.5%): the clouds are a deeper tint of it, and the
	// icon is in the full colour. Inverted: the ground is the colour, the inks tint(color, .32) and white, the icon white.
	const ground = $derived(invert ? color : `rgb(${tint(color, 0.88).join(' ')})`);

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

	onMount(() => {
		const ctx = cv!.getContext('2d')!;
		const INKS = { tint: [tint(color, 0.64), rgb(color)], solid: [tint(color, 0.32), [255, 255, 255]] };
		let cols = 0, rows = 0, W = 0, H = 0;
		let fc = 0, fr = 0; // the canvas: FINE × FINE pixels per cloud cell, one per icon cell
		let mask = new Float32Array(0); // the icon per fine cell, already graded: 1 at its foot, less at its top
		let img: ImageData | undefined;

		// the icon, stroked at the fine cells' resolution
		function layout() {
			W = box!.clientWidth;
			H = box!.clientHeight;
			if (!W || !H) return;
			cols = Math.ceil(W / CELL);
			rows = Math.ceil(H / CELL);
			fc = cols * FINE;
			fr = rows * FINE;
			cv!.width = fc;
			cv!.height = fr;
			img = ctx.createImageData(fc, fr);
			const m = document.createElement('canvas');
			m.width = fc;
			m.height = fr;
			const x = m.getContext('2d')!;
			// in the bottom-left corner, inset by the card's padding; the card's tag line sits above it, at the top left
			const px = FINE / CELL; // fine cells per CSS px
			const size = H * SIZE * px, s = size / 24, foot = (H - pad) * px, top = foot - size;
			x.translate(pad * px, top);
			x.scale(s, s);
			x.strokeStyle = '#fff';
			x.lineWidth = STROKE;
			x.lineCap = 'square';
			x.stroke(new Path2D(ICONS[icon]));
			x.resetTransform();
			const d = x.getImageData(0, 0, fc, fr).data;
			mask = new Float32Array(fc * fr);
			for (let j = 0; j < fr; j++) {
				const g = Math.min(1, Math.max(0, (foot - (j + 0.5)) / Math.max(1e-3, foot - top)));
				for (let i = 0; i < fc; i++) mask[j * fc + i] = (d[(j * fc + i) * 4 + 3] / 255) * (1 - FADE * g);
			}
		}

		// pointer over the card (the link around this cover): hover eases to 1 and back
		const card = box!.closest('a') ?? box!;
		let inside = false, hover = 0;
		const enter = () => (hot = inside = true);
		const leave = () => (hot = inside = false);
		card.addEventListener('pointerenter', enter);
		card.addEventListener('pointerleave', leave);

		function paint(t: number) {
			if (!img) return;
			hover += ((inside ? 1 : 0) - hover) * 0.12;
			if (hover < 0.003) hover = 0;
			const asp = W / H, tt = t * 0.4, d = img.data, [A, B] = invert ? INKS.solid : INKS.tint;
			for (let j = 0; j < rows; j++) {
				const uy = (j + 0.5) / rows; // from the top
				for (let i = 0; i < cols; i++) {
					const ux = (i + 0.5) / cols;
					// clouds growing out of the bottom-right corner (w: 1 at the corner, 0 from about 1.2 heights away), so the
					// icon and the tag line on the left stay on clean ground; each card has its own pattern (seed)
					// On hover the clouds thicken and reach further across the cover, and the icon fills in.
					const w = 1 - smooth(0.2, 1.2 + 0.5 * hover, Math.hypot((1 - ux) * asp, 1 - uy));
					let v = smooth(0.4, 0.85, fbm(ux * asp * 2.2 + tt * 0.6 + seed * 13.7, (1 - uy) * 2.2 - tt * 0.4 + seed * 7.3) + (0.15 + 0.1 * hover) * w);
					v *= w * (0.55 + 0.3 * hover);
					const lift = hover * 0.3; // added to the icon only
					// the clouds dither in this cell; where the icon is the stronger of the two, it dithers in its own finer cells
					const th = bayer(i, rows - 1 - j);
					for (let b = 0; b < FINE; b++) {
						for (let a = 0; a < FINE; a++) {
							const fi = i * FINE + a, fj = j * FINE + b, m = mask[fj * fc + fi], o = (fj * fc + fi) * 4;
							const mi = m * hover; // the dithered icon is there only while the card is hovered
							const val = mi > v ? mi + lift : v, t2 = mi > v ? bayer(fi, fr - 1 - fj) : th;
							const c = (val - TWO) / (1 - TWO) > t2 ? B : val > t2 ? A : null;
							if (c) {
								d[o] = c[0];
								d[o + 1] = c[1];
								d[o + 2] = c[2];
								d[o + 3] = 255;
							} else d[o + 3] = 0;
						}
					}
				}
			}
			ctx.putImageData(img, 0, 0);
		}

		// ~30 fps, only on screen; one still frame with reduced motion
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let raf = 0, last = 0, seen = false, now = 0;
		const frame = (ms: number) => {
			raf = requestAnimationFrame(frame);
			if (ms - last < 33) return;
			last = ms;
			now = ms / 1000;
			paint(now);
		};
		const start = () => {
			if (!raf && seen && !still) raf = requestAnimationFrame(frame);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};
		const io = new IntersectionObserver(([e]) => {
			seen = e.isIntersecting;
			if (seen) start();
			else stop();
		});
		io.observe(box!);
		const redo = () => {
			layout();
			paint(now);
		};
		const ro = new ResizeObserver(redo);
		ro.observe(box!);
		redo();
		repaint = redo;

		return () => {
			stop();
			io.disconnect();
			ro.disconnect();
			card.removeEventListener('pointerenter', enter);
			card.removeEventListener('pointerleave', leave);
		};
	});
</script>

<div bind:this={box} class="relative aspect-[16/8.5]" style:background={ground} aria-hidden="true">
	<canvas bind:this={cv} class="absolute inset-0 block size-full [image-rendering:pixelated]"></canvas>
	<!-- the icon as drawn, in the place and size of its dithered version, which replaces it on hover -->
	<svg
		class="absolute aspect-square transition-opacity duration-300 {hot ? 'opacity-0' : ''}"
		style="bottom:{pad}px;left:{pad}px;height:{SIZE * 100}%;color:{invert ? '#fff' : color}"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="square"
	>
		<path d={ICONS[icon]} vector-effect="non-scaling-stroke" />
	</svg>
</div>
