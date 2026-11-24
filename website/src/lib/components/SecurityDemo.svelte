<script lang="ts">
	// The two working scenes of the "Privacy and security" block on /embeds-3, each a window on drawing paper with the
	// switches that change it at its foot.
	//   frame:   where third-party code runs. Through Iframely, the provider's script, cookies, trackers and ads sit
	//            inside our iframe and the page has only its own files; with the provider's raw code they are loose in
	//            the page, next to its own.
	//   consent: a post waiting behind a question, nothing loaded and no cookies set. Allow loads it (and the provider
	//            sets its cookies); Not now leaves a plain link. Either answer can be taken back.
	// The file names, the cookie count and the post's URL are illustrative.
	// top: the frame scene's switches are out of the window, on the paper over it, not at the window's foot (the
	// questionnaire on /embeds, components/SecurityQA.svelte)
	let { scene, top = false }: { scene: 'frame' | 'consent'; top?: boolean } = $props();

	// frame
	let framed = $state(true);
	const OWN = ['app.js', 'styles.css'];
	const THEIRS = ['player.js', 'cookies', 'trackers', 'ads'];
	// consent
	let answer = $state<'' | 'yes' | 'no'>('');
	// consent, with the tabs on top: with Iframely the post is gated behind the question; without, it is not
	let gated = $state(true);
	// an answer stays for a few seconds, then the question is asked again
	$effect(() => {
		if (!answer) return;
		const t = setTimeout(() => (answer = ''), 5000);
		return () => clearTimeout(t);
	});
</script>

{#snippet chips()}
	<button type="button" class="chip" aria-pressed={framed} onclick={() => (framed = true)}><span class="dot" aria-hidden="true"></span>In our iframe</button>
	<button type="button" class="chip" aria-pressed={!framed} onclick={() => (framed = false)}><span class="dot" aria-hidden="true"></span>Provider's raw code</button>
{/snippet}

<!-- top: the window fills the paper under the switch's row, so every scene's window is the same size in the same place
     (a scene with no switch keeps the row, empty) -->
<div class="paper flex h-full flex-col {top ? '' : 'justify-center'} rounded-md p-4 sm:p-6" class:top class:dots={scene === 'consent'}>
	<!-- top: the switches are out of the window, on the paper over it, with no label -->
	<!-- a with/without switch, as tabs standing on the window: the chosen tab is white and one piece with the window,
	     its words in black; the other is faint grey. With Iframely comes first and is the one shown to begin with.
	     (Until 2026-11-24 they were worded as two lines of a diff, "+ with Iframely" in blue and "− without Iframely"
	     in magenta: too much, with the window's own blue and magenta under them, and Q3's window is a diff itself.) -->
	{#if top && scene === 'frame'}
		<div class="seg" role="group" aria-label="The same embed, without and with Iframely">
			<button type="button" aria-pressed={framed} onclick={() => (framed = true)}>With Iframely</button>
			<button type="button" aria-pressed={!framed} onclick={() => (framed = false)}>Without</button>
		</div>
	{:else if top}
		<!-- the consent scene's tabs: with Iframely the post waits behind the question; without, it is loaded at once -->
		<div class="seg" role="group" aria-label="The same post, without and with Iframely">
			<button type="button" aria-pressed={gated} onclick={() => (gated = true)}>With Iframely</button>
			<button type="button" aria-pressed={!gated} onclick={() => (gated = false)}>Without</button>
		</div>
	{/if}
	<div class="win w-full overflow-hidden rounded-md bg-white {top ? 'flex grow flex-col' : ''} {top ? 'rounded-tl-none' : ''}">
		{#if scene === 'frame'}
			<div class="bar">
				<span class="truncate">your-page.html</span>
				<span class="ml-auto {framed ? 'text-rich' : 'theirs text-amber-800'}">{framed ? 'nothing of theirs on your page' : `${THEIRS.length} of theirs on your page`}</span>
			</div>
			<div class="p-4">
				<!-- what runs in the page itself -->
				<p class="group">Runs in your page</p>
				<!-- (room for two rows of tags in the card; one row in the questionnaire's wider window) -->
				<p class="mt-2.5 flex {top ? 'min-h-[30px]' : 'min-h-[58px]'} flex-wrap content-start gap-1.5">
					{#each OWN as t (t)}<span class="tag">{t}</span>{/each}
					{#if !framed}{#each THEIRS as t (t)}<span class="tag loose">{t}</span>{/each}{/if}
				</p>
				<!-- the embed: in our iframe, or the provider's own code straight in the page -->
				<div class="embed mt-3" class:framed>
					<p class="font-mono text-[11px] leading-none {framed ? 'text-rich' : top ? 'theirs' : 'text-mute'}">
						{framed ? (top ? '<iframe src="//iframely.net/…">' : '<iframe src="cdn.iframe.ly/…">') : top ? '<script src="//provider.com/embed.js">' : '<script src="provider.com/embed.js">'}
					</p>
					<!-- (the player is shorter with the switches on top: the questionnaire's panel is lower than the card) -->
					<div class="relative mt-3 {top ? 'h-[99px]' : 'h-[150px]'} overflow-hidden rounded-sm bg-black/7">
						<span class="play"><svg width="12" height="12" viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" /></svg></span>
					</div>
					<!-- (top: the row is as tall as a tag, so these are the same size as the page's own tags above) -->
					<p class="mt-3 flex {top ? 'min-h-[23px] items-start' : 'min-h-[26px]'} flex-wrap gap-1.5">
						{#if framed}{#each THEIRS as t (t)}<span class="tag">{t}</span>{/each}{/if}
					</p>
				</div>
			</div>
			{#if !top}
				<div class="controls">
					<p class="group">Where the provider's code runs</p>
					<div class="mt-2.5 flex flex-wrap gap-2">{@render chips()}</div>
				</div>
			{/if}
		{:else}
			<div class="bar">
				<span class="truncate">instagram.com/p/CxY2abc</span>
				<span class="ml-auto {!gated ? 'theirs' : answer === 'yes' ? 'text-fg' : 'text-rich'}">{!gated ? '3 cookies set, nobody asked' : answer === 'yes' ? '3 cookies set' : '0 cookies set'}</span>
			</div>
			<div class="p-4 {top ? 'flex grow flex-col' : ''}">
				<div class="grid {top ? 'grow' : 'h-[132px]'} place-items-center rounded-sm bg-black/5">
					{#if answer === 'yes' || !gated}
						<!-- the post, loaded (without Iframely: at once, with no question) -->
						<!-- (bigger in the questionnaire's taller window) -->
						<!-- (allowed through Iframely, its avatar and picture are tinted blue) -->
						<div class="{top ? 'h-[196px] w-[min(280px,80%)] p-3' : 'w-[min(240px,80%)] p-2.5'} rounded-sm bg-white ring-1 ring-black/10">
							<div class="flex items-center gap-2">
								<span class="{top ? 'size-7' : 'size-6'} rounded-full {top && gated ? 'bg-rich/25' : 'bg-black/12'}"></span><span
									class="h-2 w-20 rounded-full bg-black/12"
								></span>
							</div>
							<div class="mt-2.5 {top ? 'h-[100px]' : 'h-12'} rounded-sm {top && gated ? 'bg-rich/10' : 'bg-black/7'}"></div>
							<div class="mt-2.5 h-2 w-[70%] rounded-full bg-black/8"></div>
							{#if top}<div class="mt-2 h-2 w-[45%] rounded-full bg-black/8"></div>{/if}
						</div>
					{:else if answer === 'no'}
						<p class="font-mono text-[12px] leading-none text-mute">instagram.com/p/CxY2abc ↗ <span class="text-fg">a plain link, nothing loaded</span></p>
					{:else}
						<!-- (in the questionnaire the question is a card of exactly the post's size, 280 × 196px: the height is known
						     before the post loads, so nothing moves on Allow) -->
						<div class="text-center {top ? 'grid h-[196px] w-[min(280px,80%)] place-content-center rounded-sm bg-white px-5 ring-1 ring-black/10' : ''}">
							<p class="text-[13px] leading-none font-medium text-fg">Show this post from Instagram?</p>
							<p class="mt-3.5 flex justify-center gap-2">
								<button type="button" class="ask yes" onclick={() => (answer = 'yes')}>Allow</button>
								<button type="button" class="ask" onclick={() => (answer = 'no')}>Not now</button>
							</p>
						</div>
					{/if}
				</div>
			</div>
			<!-- no foot under this scene: the question is the whole of it. An answer is shown for a few seconds, then the
			     question comes back by itself. -->
		{/if}
	</div>
</div>

<style>
	/* drawing paper: squared, or dotted for the consent scene */
	.paper {
		--ln: rgb(0 0 0 / 0.035);
		background-color: #fafafa;
		background-image: linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px);
		background-size: 12px 12px;
		background-position: -1px -1px;
	}
	.paper.dots {
		background-image: radial-gradient(circle, rgb(0 0 0 / 0.1) 1px, transparent 1.5px);
		background-position: 0 0;
	}
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 16px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	/* the before/after switch (also in SecurityQA.svelte) */
	.seg {
		display: flex;
		position: relative;
		z-index: 1;
		gap: 4px;
		/* no room over the tabs: the paper's padding is the same on all four sides. The first tab starts at the
		   window's left edge (the window's corner there is square). */
		height: 28px;
	}
	/* a tab standing on the window: the chosen one is white and one piece with the window, the others faint grey */
	.seg button {
		position: relative;
		height: 28px;
		padding: 0 12px;
		border-radius: 6px 6px 0 0;
		background: rgb(0 0 0 / 0.04);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
		cursor: pointer;
		transition:
			color 0.15s,
			background-color 0.15s;
	}
	.seg button:not([aria-pressed='true']):hover {
		background: rgb(0 0 0 / 0.08);
	}
	.seg button[aria-pressed='true'] {
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
	}
	/* (no line between the chosen tab and the window) */
	.seg button[aria-pressed='true']::after {
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		height: 2px;
		background: #fff;
		content: '';
	}
	.seg button:hover {
		color: var(--color-fg);
	}
	/* the chosen half: in black, whichever it is (it was blue for Iframely's and magenta for the one without) */
	.seg button[aria-pressed='true'] {
		color: var(--color-fg);
	}
	/* with the switch on top, what is loose in the page is red (the home page's fourth accent), not amber */
	.paper {
		--no: var(--color-pub); /* the home page's fourth accent */
	}
	.top .tag.loose {
		background: color-mix(in srgb, var(--no) 10%, white);
		color: var(--no);
	}
	.top .theirs {
		color: var(--no);
	}
	.seg button:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 1px;
	}
	.controls {
		padding: 16px 16px 20px;
		border-top: 1px solid rgb(0 0 0 / 0.07);
	}
	.group {
		font:
			11px/1.3 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
	}
	/* a file or a thing a provider brings */
	.tag {
		padding: 6px 8px;
		border-radius: 999px;
		background: #fff;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
		animation: tag-in 0.3s ease-out;
	}
	/* a provider's thing loose in the page */
	.tag.loose {
		background: var(--color-amber-100);
		box-shadow: none;
		color: var(--color-amber-800);
	}
	@keyframes tag-in {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
	}
	/* the embed's box: a dashed outline for raw code (no boundary), our iframe's solid blue one */
	.embed {
		padding: 12px;
		border: 1px dashed rgb(0 0 0 / 0.2);
		border-radius: 4px;
		transition:
			border-color 0.25s,
			background-color 0.25s;
	}
	.embed.framed {
		border: 1px solid color-mix(in srgb, var(--color-rich) 60%, white);
		background: color-mix(in srgb, var(--color-rich) 5%, white);
	}
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		translate: -50% -50%;
		border-radius: 999px;
		background: var(--color-rich);
	}
	.ask {
		padding: 8px 14px;
		border-radius: 999px;
		background: #fff;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
		font-size: 12px;
		line-height: 1;
		font-weight: 500;
		color: var(--color-body);
		cursor: pointer;
	}
	.ask:hover {
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.28);
	}
	.ask.yes {
		background: var(--color-rich);
		box-shadow: none;
		color: #fff;
	}
	.ask.yes:hover {
		background: color-mix(in srgb, var(--color-rich) 88%, black);
	}
	.chip {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: 7px;
		padding: 7px 12px 7px 10px;
		border-radius: 999px;
		background: #fff;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
		font-size: 13px;
		line-height: 1;
		font-weight: 500;
		color: var(--color-body);
		cursor: pointer;
		transition:
			background-color 0.2s,
			box-shadow 0.2s,
			color 0.2s,
			opacity 0.2s;
	}
	.chip:not(:has(.dot)) {
		padding-left: 12px;
	}
	.chip:hover:not(:disabled) {
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.28);
	}
	.chip:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.chip:focus-visible,
	.ask:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		box-shadow: inset 0 0 0 1.5px rgb(0 0 0 / 0.25);
	}
	.chip[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-rich) 8%, white);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-rich) 45%, white);
		color: var(--color-rich);
	}
	.chip[aria-pressed='true'] .dot {
		background: var(--color-rich);
		box-shadow: none;
	}
	/* top (/embeds, block 05): how a question's scene comes in and goes is components/SecurityQA.svelte's matter: the
	   window and the tabs stand still, and what is in the window fades. (Here the tabs and the window came in
	   together, fading and rising 6px in 0.35s, as block 02's window does, components/OptionsDemo.svelte.) */
	@media (prefers-reduced-motion: reduce) {
		.tag {
			animation: none;
		}
		.embed,
		.chip {
			transition: none;
		}
	}
</style>
