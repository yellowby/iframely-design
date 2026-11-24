<script lang="ts">
	import { onMount } from 'svelte';
	import { footer } from '#lib/data/nav.ts';

	// Footer after G25 in the motion lab (Page content), in the site's own type and colours: six link columns
	// (Product, Solutions, Free tools, Developers, Company, Legal), then the //iframely logo as text on a line of its
	// own, then the copyright row with the site's line at its right end. (It had a first column with the logo, that
	// line and three badges, SOC 2 Type II, GDPR and 99.99% uptime, and no Solutions column.)
	// On the page ground; text in the Small role, greys from the theme, blue only on the //.
	const COLS = ['Product', 'Solutions', 'Free tools', 'Developers', 'Company', 'Legal'];
	const cols = COLS.map((label) => footer.find((c) => c.label === label)!);

	// The logo's slashes run the home hero's spinner (the URL line of S41, lib/scene/sec.js): not turning glyphs but a
	// terminal's spinner, the two characters stepping through / - \ | with the second one frame ahead, 110ms a frame,
	// and settling back into //. Here it goes ROUNDS times round when the logo scrolls into view (the reader has
	// reached the bottom), and again every AGAIN ms while it stays in view. Not at all with reduced motion.
	// ("Ask about Iframely", the AI assistants' tiles, was at the right of the copyright row; it is a strip of its own
	// now, components/AskStrip.svelte)

	const SPIN = ['/', '-', '\\', '|'];
	const ROUNDS = 3;
	const AGAIN = 9000;
	let logo: HTMLAnchorElement;
	let q = $state(-1); // the frame; -1 is at rest
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let timer: ReturnType<typeof setInterval> | undefined;
		let frames: ReturnType<typeof setInterval> | undefined;
		const spin = () => {
			if (q >= 0) return;
			q = 0;
			frames = setInterval(() => {
				if (++q < ROUNDS * 4) return;
				clearInterval(frames);
				q = -1;
			}, 110);
		};
		const io = new IntersectionObserver(
			([e]) => {
				clearInterval(timer);
				if (!e.isIntersecting) return;
				spin();
				timer = setInterval(spin, AGAIN);
			},
			{ threshold: 1 }
		);
		io.observe(logo);
		return () => {
			io.disconnect();
			clearInterval(timer);
			clearInterval(frames);
		};
	});
</script>

<footer class="overflow-hidden bg-page text-fg">
	<div class="wrap grid grid-cols-2 gap-x-8 gap-y-10 pt-18 sm:grid-cols-3 lg:grid-cols-6">
		{#each cols as col (col.label)}
			<nav aria-label={col.label}>
				<p class="t-small font-medium! text-fg">{col.label}</p>
				<ul class="mt-3.5 grid gap-2">
					{#each col.items as item (item.label)}
						<li><a href={item.href} class="t-small leading-[1.4]! text-body underline-offset-2 hover:text-black hover:underline">{item.label}</a></li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>

	<div class="wrap mt-14">
		<!-- the logo on a line of its own, then the copyright at the left and the site's line at the right -->
		<a bind:this={logo} href="/" class="logo" aria-label="Iframely"
			><b aria-hidden="true"><i>{q < 0 ? '/' : SPIN[q % 4]}</i><i>{q < 0 ? '/' : SPIN[(q + 1) % 4]}</i></b>iframely</a
		>
		<div class="mt-2 flex flex-wrap justify-between gap-x-8 gap-y-1 pb-6 text-[13px] leading-[1.5] text-mute">
			<p>© 2012–2026 Itteco Software Corp. Ottawa, Canada.</p>
			<p>Holding the web together.</p>
		</div>
	</div>
</footer>

<style>
	/* //iframely as in the header (JetBrains Mono, the slashes ExtraBold in Iframely blue, the word Bold), but small:
	   14px here, 20px there */
	.logo {
		display: inline-block;
		font: 700 14px/18px 'JetBrains Mono', ui-monospace, monospace;
		color: #000;
	}
	.logo b {
		font-weight: 800;
		color: var(--color-blue);
	}
	/* The slashes are two glyphs here, one cell each, so the spinner's characters swap in place. Set apart they would
	   stand wider than the font's "//" ligature of the header's logo (its ink starts 0.069em further into each cell),
	   so each is moved that much towards the other. */
	.logo i {
		display: inline-block;
		width: 0.6em;
		font-style: normal;
		translate: 0.069em;
	}
	.logo i + i {
		translate: -0.069em;
	}
</style>
