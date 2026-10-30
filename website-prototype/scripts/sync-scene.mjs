// Copies the product scenes' scripts from the motion lab into src/lib/scene. Run by hand (npm run scene:sync) after the
// scene changes in the lab; the build only uses the copies, so the site builds without the lab next to it.
// On the way, sec.js loses the lab's blue-tinted greys: each becomes the pure grey of the same luminance, so contrast
// stays as designed. Illustration colours (the video sky, the map) and product colours are left alone.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const lab = fileURLToPath(new URL('../../explorations/2026-10-22-motion-lab/', import.meta.url));
const out = fileURLToPath(new URL('../src/lib/scene/', import.meta.url));
const FILES = ['lib/demos.js', 'demos/logo.js', 'demos/logo14.js', 'demos/sec.js'];

// The lab's UI greys (ink, text, rules, fills, skeletons, shadows)
const TINTED = ['#0b1533', '#2b3550', '#5b6680', '#8a93a8', '#b4bccb', '#cfd5e1', '#e3e7ef', '#eef0f4', '#eef1f6', '#f6f7fa', '#f8f9fb'];

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const enc = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
// pure grey with the same relative luminance, as 0–255
const grey = ([r, g, b]) => {
	const y = 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
	return Math.round(enc(y) * 255);
};

function neutral(src) {
	for (const hex of TINTED) {
		const v = grey(rgb(hex));
		const to = '#' + v.toString(16).padStart(2, '0').repeat(3);
		src = src.replaceAll(new RegExp(hex, 'gi'), to);
		const [r, g, b] = rgb(hex);
		src = src.replaceAll(new RegExp(`rgba\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${b}\\s*,`, 'g'), `rgba(${v},${v},${v},`);
	}
	return src;
}

mkdirSync(out, { recursive: true });
for (const f of FILES) {
	const src = readFileSync(lab + f, 'utf8');
	// the lab's classic scripts are not typed: keep svelte-check out of them
	writeFileSync(out + f.split('/').pop(), '// @ts-nocheck\n' + (f === 'demos/sec.js' ? neutral(src) : src));
	console.log('copied', f);
}
