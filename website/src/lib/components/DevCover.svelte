<script lang="ts">
	// Mini product scenes for the covers of the "For your developers" and "Performance" cards on /embeds: one white window per card on the
	// cover's grey, set in from the top and sides and running off the foot of the card, so it holds at any width.
	//   oembed:   the oEmbed request and its JSON answer
	//   editor:   an editor where a pasted link became a player
	//   script:   a Content-Security-Policy allowlist, a row of provider scripts replaced by one
	//   template: the HTML template with embed.js, no server involved
	//   play:     click-to-play, the light cover and its weight against the full player's
	//   lazy:     an embed below the screen edge, loading in the background
	//   height:   a post's place held on the page before it loads
	//   single:   three players in a feed, one playing
	// and for the "For your product team" sub-sections on /embeds-2:
	//   update:   an old post still playing, its embed code swapped for the provider's new one overnight
	//   rebrand:  providers that changed their domain, the old one struck out and the new one followed
	//   keep:     a Content ID answering after the account is closed, and the open-source engine on your own server
	// and for the "Privacy and security" cards on /embeds-2:
	//   frame:    a page with our iframe in it, the provider's scripts and cookies kept inside
	//   consent:  a post waiting behind a question, no cookies set yet
	//   audit:    the SOC 2 Type II report, with its seal
	//   domain:   the embed served from the customer's own domain in place of ours
	// Decorative: the card's own text says what it shows.
	export type DevScene =
		| 'oembed' | 'editor' | 'script' | 'template' | 'play' | 'lazy' | 'height' | 'single'
		| 'update' | 'rebrand' | 'keep'
		| 'frame' | 'consent' | 'audit' | 'domain';
	// the three providers of the 'rebrand' scene: the old domain, the new one
	const MOVED = [
		['mermaidchart.com', 'mermaid.ai'],
		['ardaudiothek.de', 'ardsounds.de'],
		['dailymail.co.uk', 'dailymail.com']
	];
	// bare: the cover at the top of a card, over the text (the "For your developers" cards on /embeds, drawn as the
	// windows of the hero wall): a fixed 232px, the window set in by 24px, as the card's text.
	// pattern: the bare cover's ground, one of four drawing papers: 0 squared, 1 dotted, 2 graph (every fourth line
	// darker), 3 small crosses.
	// n: how many squares the bare cover's paper has across, for a cover narrower than the developers' cards (a third
	// of the page wants about 32); the cover's height and the window's inset follow the square.
	// ground: the cover sits in a near-black or blue card: its paper is dropped, so the white window lies straight on
	// the card's colour.
	let {
		scene,
		bare = false,
		pattern = 0,
		n,
		ground,
		whole = false
	}: { scene: DevScene; bare?: boolean; pattern?: number; n?: number; ground?: 'dark' | 'blue'; whole?: boolean } = $props();
	// whole: the window shown whole on its paper, not cut by the cover's foot; a coloured ground always has it whole

	const OUT =['platform.twitter.com', 'www.instagram.com', 'www.tiktok.com', 'embed.reddit.com'];
</script>

<!-- 5:2 as the placeholder it replaces; on a phone that is too low for the scene's key line, so the cover is 230px there -->
<div class="relative overflow-hidden {bare ? 'paper mx-3 mb-3 rounded-md' : 'h-[230px] bg-[#f2f2f2] md:aspect-[5/2] md:h-auto'}" class:dark={ground === 'dark'} class:blue={ground === 'blue'} class:whole={bare && (whole || !!ground)} style={n ? `--n:${n}` : undefined} aria-hidden="true">
	{#if bare}<div class="squared" class:dots={pattern === 1} class:graph={pattern === 2} class:plus={pattern === 3}></div>{/if}
	<div class="win absolute overflow-hidden rounded-t-md bg-white {bare ? 'on-paper' : 'inset-x-8 top-8 bottom-[-40px]'}">
		{#if scene === 'oembed'}
			<div class="bar"><span class="verb">GET</span><span class="truncate">iframe.ly/api/oembed?url=<b>https://youtu.be/9bZkp7q19f0</b></span></div>
			<pre class="code">{'{'}
  <i>type</i>: 'video',
  <i>provider_name</i>: 'YouTube',
  <i>title</i>: 'PSY - GANGNAM STYLE',
  <i>html</i>: <b>'&lt;iframe src=… allowfullscreen&gt;&lt;/iframe&gt;'</b>
{'}'}</pre>
		{:else if scene === 'editor'}
			<div class="bar gap-3!">
				<span class="font-bold">B</span><span class="italic">I</span><span class="underline">U</span>
				<span class="h-3.5 w-px bg-black/10"></span>
				<span class="tool"></span><span class="tool"></span><span class="tool"></span>
				<span class="ml-auto text-mute">Draft</span>
			</div>
			<div class="space-y-2 px-4 pt-4">
				<div class="h-2 w-[72%] rounded-full bg-black/8"></div>
				<div class="h-2 w-[54%] rounded-full bg-black/8"></div>
				<!-- the pasted link, now a player -->
				<div class="relative mt-3! h-40 overflow-hidden rounded-sm bg-black/7">
					<span class="absolute top-2.5 left-3 font-mono text-[11px] text-mute">vimeo.com/76979871</span>
					<span class="absolute top-[42px] left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full bg-rich">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="#fff"><path d="M3 1.5v11l9-5.5z" /></svg>
					</span>
				</div>
			</div>
		{:else if scene === 'script'}
			<div class="bar"><span class="truncate">Content-Security-Policy</span><span class="ml-auto text-mute">script-src</span></div>
			<pre class="code">{#each OUT as host (host)}<s>− {host}</s>
{/each}<b>+ cdn.iframe.ly</b></pre>
		{:else if scene === 'play'}
			<div class="bar"><span class="truncate">youtube.com/watch?v=9bZkp7q19f0</span><span class="ml-auto text-mute">click-to-play</span></div>
			<div class="flex gap-5 px-4 pt-4">
				<!-- the light cover: a picture and a play button, no player behind it yet -->
				<div class="relative h-[104px] w-[36%] shrink-0 rounded-sm bg-black/7">
					<span class="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-rich">
						<svg width="12" height="12" viewBox="0 0 14 14" fill="#fff"><path d="M3 1.5v11l9-5.5z" /></svg>
					</span>
				</div>
				<div class="grow space-y-3 pt-1 font-mono text-[12px] leading-none text-fg">
					<p class="flex justify-between"><span>Cover</span><span class="text-rich">40 KB</span></p>
					<div class="h-2 w-[8%] rounded-full bg-rich"></div>
					<p class="flex justify-between pt-2"><span>Full player</span><span class="text-mute">540 KB</span></p>
					<div class="h-2 w-full rounded-full bg-black/10"></div>
				</div>
			</div>
		{:else if scene === 'lazy'}
			<div class="bar"><span class="truncate">article.html</span><span class="ml-auto text-mute">loads off-screen</span></div>
			<div class="px-4 pt-4">
				<div class="space-y-2">
					<div class="h-2 w-[78%] rounded-full bg-black/8"></div>
					<div class="h-2 w-[61%] rounded-full bg-black/8"></div>
				</div>
				<!-- where the reader's screen ends: the embed under it is already loading -->
				<p class="mt-4 flex items-center gap-2 font-mono text-[11px] leading-none text-rich">
					<span class="h-px grow border-t border-dashed border-rich/60"></span>screen edge<span class="h-px grow border-t border-dashed border-rich/60"></span>
				</p>
				<div class="load mt-4 flex h-28 items-start justify-center gap-2 rounded-sm bg-black/5 pt-5 font-mono text-[11px] leading-none text-mute">
					<span class="spin size-3 rounded-full border-[1.5px] border-rich/25 border-t-rich"></span>loading in the background
				</div>
			</div>
		{:else if scene === 'height'}
			<div class="bar"><span class="truncate">article.html</span><span class="ml-auto text-mute">layout shift 0</span></div>
			<div class="px-4 pt-4">
				<div class="h-2 w-[70%] rounded-full bg-black/8"></div>
				<!-- the post's place, held before it loads -->
				<div class="mt-3 grid h-24 place-items-center rounded-sm border border-dashed border-rich/60 bg-rich/5 font-mono text-[11px] leading-none text-rich">
					↕ 512px reserved
				</div>
				<div class="mt-3 h-2 w-[84%] rounded-full bg-black/8"></div>
				<div class="mt-2 h-2 w-[52%] rounded-full bg-black/8"></div>
			</div>
		{:else if scene === 'single'}
			<div class="bar"><span class="truncate">feed</span><span class="ml-auto text-mute">one at a time</span></div>
			<div class="grid grid-cols-3 gap-3 px-4 pt-4">
				{#each [0, 1, 2] as n (n)}
					<div>
						<div class="relative h-[88px] overflow-hidden rounded-sm bg-black/7">
							<span class="absolute top-1/2 left-1/2 grid size-8 -translate-1/2 place-items-center rounded-full {n === 1 ? 'bg-rich' : 'bg-black/15'}">
								<svg width="11" height="11" viewBox="0 0 14 14" fill="#fff"><path d={n === 1 ? 'M3 2h3v10H3zM8 2h3v10H8z' : 'M3 1.5v11l9-5.5z'} /></svg>
							</span>
							{#if n === 1}<span class="absolute bottom-0 left-0 h-[3px] w-[42%] bg-rich"></span>{/if}
						</div>
						<div class="mt-2.5 h-2 w-[80%] rounded-full bg-black/8"></div>
						<div class="mt-2 h-2 w-[55%] rounded-full bg-black/8"></div>
					</div>
				{/each}
			</div>
		{:else if scene === 'update'}
			<div class="bar"><span class="truncate">Posted in 2016</span><span class="ml-auto text-rich">still playing</span></div>
			<div class="px-4 pt-4">
				<!-- the old post's player, playing -->
				<div class="relative h-[76px] overflow-hidden rounded-sm bg-black/7">
					<span class="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-rich">
						<svg width="12" height="12" viewBox="0 0 14 14" fill="#fff"><path d="M3 2h3v10H3zM8 2h3v10H8z" /></svg>
					</span>
					<span class="absolute bottom-0 left-0 h-[3px] w-[38%] bg-rich"></span>
				</div>
			</div>
			<!-- under it, last night's change to its code -->
			<pre class="code pt-2.5!"><s>− &lt;iframe src="…/player/v2"&gt;</s>
<b>+ &lt;iframe src="…/embed/v3"&gt;</b></pre>
		{:else if scene === 'rebrand'}
			<div class="bar"><span class="truncate">Providers on the move</span><span class="ml-auto text-mute">this year</span></div>
			<div class="px-4 font-mono text-[12px] leading-none text-fg">
				{#each MOVED as [was, now] (now)}
					<div class="border-b border-black/7 py-2.5 last:border-0">
						<p class="text-mute/75 line-through">{was}</p>
						<p class="mt-1.5 flex items-center gap-1.5"><span class="text-rich">→</span>{now}<svg class="ml-auto text-rich" width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.5 5.5 10.5 11.5 4" /></svg></p>
					</div>
				{/each}
			</div>
		{:else if scene === 'keep'}
			<div class="bar"><span class="verb">GET</span><span class="truncate">iframe.ly/<b>aB3xK9</b></span><span class="ml-auto text-mute">account closed</span></div>
			<div class="px-4 pt-4">
				<!-- the Content ID still answers with its player -->
				<div class="relative h-[76px] overflow-hidden rounded-sm bg-black/7">
					<span class="absolute top-2.5 left-3 font-mono text-[11px] leading-none text-rich">200 OK</span>
					<span class="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-rich">
						<svg width="12" height="12" viewBox="0 0 14 14" fill="#fff"><path d="M3 1.5v11l9-5.5z" /></svg>
					</span>
				</div>
			</div>
			<!-- and the engine is open source -->
			<pre class="code pt-2.5!"><i>$</i> git clone <b>github.com/itteco/iframely</b>
<i># open source, on your own servers</i></pre>
		{:else if scene === 'frame'}
			<div class="bar"><span class="truncate">your-page.html</span><span class="ml-auto text-mute">kept apart</span></div>
			<div class="px-4 pt-4">
				<div class="h-2 w-[70%] rounded-full bg-black/8"></div>
				<!-- our iframe: what the provider brings stays inside it -->
				<div class="mt-3 rounded-sm border border-rich/60 bg-rich/5 px-3 pt-2.5 pb-3 font-mono text-[11px] leading-none">
					<p class="text-rich">&lt;iframe src="cdn.iframe.ly/…"&gt;</p>
					<p class="mt-3 flex flex-wrap gap-1.5 text-mute">
						{#each ['player.js', 'cookies', 'trackers', 'ads'] as t (t)}<span class="rounded-full bg-white px-2 py-1.5 ring-1 ring-black/8">{t}</span>{/each}
					</p>
				</div>
				<div class="mt-3 h-2 w-[84%] rounded-full bg-black/8"></div>
				<div class="mt-2 h-2 w-[52%] rounded-full bg-black/8"></div>
			</div>
		{:else if scene === 'consent'}
			<div class="bar"><span class="truncate">instagram.com/p/CxY2abc</span><span class="ml-auto text-mute">0 cookies set</span></div>
			<div class="px-4 pt-4">
				<!-- the post's place, with the question in it; nothing from the provider has loaded -->
				<div class="grid h-[132px] place-items-center rounded-sm bg-black/5">
					<div class="text-center">
						<p class="text-[13px] leading-none font-medium text-fg">Show this post from Instagram?</p>
						<p class="mt-3.5 flex justify-center gap-2 text-[12px] leading-none font-medium">
							<span class="rounded-full bg-rich px-3.5 py-2 text-white">Allow</span>
							<span class="rounded-full bg-white px-3.5 py-2 text-body ring-1 ring-black/10">Not now</span>
						</p>
					</div>
				</div>
			</div>
		{:else if scene === 'audit'}
			<div class="bar"><span class="truncate">Audit report</span><span class="ml-auto text-rich">SOC 2 Type II</span></div>
			<div class="flex items-start gap-5 px-4 pt-5">
				<!-- the seal -->
				<span class="grid size-[72px] shrink-0 place-items-center rounded-full bg-rich/8 ring-1 ring-rich/50">
					<svg width="26" height="26" viewBox="0 0 14 14" fill="none" stroke="var(--color-rich)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.5 5.5 10.5 11.5 4" /></svg>
				</span>
				<div class="grow pt-1.5">
					<p class="font-mono text-[12px] leading-none text-fg">Iframely</p>
					<p class="mt-2.5 font-mono text-[12px] leading-none text-mute">Independent auditor's report</p>
					<div class="mt-5 h-2 w-[88%] rounded-full bg-black/8"></div>
					<div class="mt-2 h-2 w-[64%] rounded-full bg-black/8"></div>
					<div class="mt-2 h-2 w-[76%] rounded-full bg-black/8"></div>
				</div>
			</div>
		{:else if scene === 'domain'}
			<div class="bar"><span class="verb">GET</span><span class="truncate">media.your-site.com/<b>aB3xK9</b></span><span class="ml-auto text-mute">your CDN</span></div>
			<pre class="code"><i># embeds load from</i>
<s>− cdn.iframe.ly</s>
<b>+ media.your-site.com</b></pre>
		{:else}
			<div class="bar"><span class="truncate">post.html</span><span class="ml-auto text-mute">no server</span></div>
			<pre class="code"><i>&lt;div</i> class="iframely-embed"<i>&gt;</i>
  <i>&lt;a</i> data-iframely-url href="https://…"<i>&gt;&lt;/a&gt;</i>
<i>&lt;/div&gt;</i>
<b>&lt;script async src="//cdn.iframe.ly/embed.js"&gt;&lt;/script&gt;</b></pre>
		{/if}
	</div>
</div>

<style>
	/* the bare cover's ground: squared paper, thin grey lines on a near-white. The squares fit the cover a whole number
	   of times: --n of them across (about 12px each), 19 down, and the window sits on the lines, two squares in from
	   the top and the sides (about 24px, the card's text inset). */
	.paper {
		container-type: inline-size;
		--n: 28;
		--c: calc(100cqw / var(--n));
	}
	@media (min-width: 768px) {
		.paper {
			--n: 48;
		}
	}
	.squared {
		/* the papers are matched by eye, not by value: full lines carry far more ink than dots or crosses, so the
		   lines are the lightest (--ln) and the small marks are a little stronger (--mark; the crosses' SVG repeats it) */
		--ln: rgb(0 0 0 / 0.035);
		--mark: rgb(0 0 0 / 0.1);
		height: calc(var(--c) * 19);
		background-color: #fafafa;
		background-image: linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px);
		background-size: var(--c) var(--c);
		/* up by the line's 1px: no line along the cover's top edge, the first one is a square down */
		background-position: 0 -1px;
		/* and none along the left and right edges: the ground's colour over the outermost pixel on each side (the
		   squares are a fraction of a pixel wide, so a line could otherwise show at the right edge) */
		box-shadow:
			inset 1px 0 #fafafa,
			inset -1px 0 #fafafa;
	}
	/* the other papers, on the same squares */
	/* dotted: a dot in the middle of each square */
	.squared.dots {
		background-image: radial-gradient(circle, var(--mark) 1px, transparent 1.5px);
		background-position: 0 0;
	}
	/* graph: lighter squared lines, with every fourth one drawn twice, so it reads a step darker; lighter overall, as
	   its heavier lines would otherwise make it the darkest paper */
	.squared.graph {
		--ln: rgb(0 0 0 / 0.025);
		background-image:
			linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px),
			linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px);
		background-size:
			calc(var(--c) * 4) calc(var(--c) * 4),
			calc(var(--c) * 4) calc(var(--c) * 4),
			var(--c) var(--c),
			var(--c) var(--c);
	}
	/* crosses: a small plus where every second pair of lines would cross */
	.squared.plus {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 12.5h7M12.5 9v7' stroke='%23000' stroke-opacity='.1' fill='none'/%3E%3C/svg%3E");
		background-size: calc(var(--c) * 2) calc(var(--c) * 2);
		background-position: 0 0;
	}
	/* the coloured grounds (a near-black or blue card): no paper at all, the window sits straight on the card's colour */
	.dark .squared,
	.blue .squared {
		display: none;
	}
	/* whole: the window is not cut by the cover's foot. It is in the flow, as tall as its scene (or as the row's
	   tallest card makes it), all four corners round, the same gap under it as beside it; the paper, where there is
	   one, lies behind it at whatever height that comes to. */
	.whole {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}
	.whole .squared {
		position: absolute;
		inset: 0;
		height: auto;
	}
	.whole .on-paper {
		position: relative;
		inset: auto;
		flex-grow: 1;
		margin: calc(var(--c) * 2);
		padding-bottom: 16px;
		border-radius: 6px;
	}
	/* on a coloured card the cover's own bottom margin (12px) is already part of that gap */
	.dark .on-paper,
	.blue .on-paper {
		margin-bottom: calc(var(--c) * 2 - 12px);
	}
	/* the loading embed ran off the cropped window's foot; whole, it is lower */
	.whole .load {
		height: 68px;
	}
	/* no shadow on a coloured card: on black it cannot be seen */
	.dark .win,
	.blue .win {
		box-shadow: none;
	}
	.on-paper {
		inset: calc(var(--c) * 2) calc(var(--c) * 2) -40px;
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
	.bar b {
		font-weight: inherit;
		color: var(--color-mute);
	}
	.verb {
		padding: 3px 6px;
		border-radius: 4px;
		background: color-mix(in srgb, var(--color-rich) 10%, white);
		color: var(--color-rich);
		font-weight: 600;
		font-size: 11px;
	}
	.spin {
		animation: spin 1.1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation: none;
		}
	}
	.tool {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		background: rgb(0 0 0 / 0.08);
	}
	.code {
		margin: 0;
		padding: 14px 16px;
		font:
			12.5px/1.75 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: pre;
	}
	.code i {
		font-style: normal;
		color: var(--color-mute);
	}
	.code b {
		font-weight: 500;
		color: var(--color-rich);
	}
	.code s {
		color: var(--color-mute);
		opacity: 0.75;
	}
</style>
