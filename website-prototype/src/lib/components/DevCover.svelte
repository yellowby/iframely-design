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
	// Decorative: the card's own text says what it shows.
	export type DevScene = 'oembed' | 'editor' | 'script' | 'template' | 'play' | 'lazy' | 'height' | 'single';
	let { scene }: { scene: DevScene } = $props();

	const OUT = ['platform.twitter.com', 'www.instagram.com', 'www.tiktok.com', 'embed.reddit.com'];
</script>

<!-- 5:2 as the placeholder it replaces; on a phone that is too low for the scene's key line, so the cover is 230px there -->
<div class="relative h-[230px] overflow-hidden bg-[#f2f2f2] md:aspect-[5/2] md:h-auto" aria-hidden="true">
	<div class="win absolute inset-x-6 top-6 bottom-[-40px] overflow-hidden rounded-t-lg bg-white">
		{#if scene === 'oembed'}
			<div class="bar"><span class="verb">GET</span><span class="truncate">iframe.ly/api/oembed?url=<b>https://youtu.be/9bZkp7q19f0</b></span></div>
			<pre class="code">{'{'}
  <i>"type"</i>: "video",
  <i>"provider_name"</i>: "YouTube",
  <i>"title"</i>: "PSY - GANGNAM STYLE",
  <i>"html"</i>: <b>"&lt;iframe src=… allowfullscreen&gt;&lt;/iframe&gt;"</b>
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
				<div class="relative mt-3! h-40 overflow-hidden rounded-md bg-[#111]">
					<span class="absolute top-2.5 left-3 font-mono text-[11px] text-white/60">vimeo.com/76979871</span>
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
			<div class="flex gap-5 p-4">
				<!-- the light cover: a picture and a play button, no player behind it yet -->
				<div class="relative h-[104px] w-[36%] shrink-0 rounded-md bg-black/7">
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
				<div class="mt-4 flex h-28 items-start justify-center gap-2 rounded-md bg-black/5 pt-5 font-mono text-[11px] leading-none text-mute">
					<span class="spin size-3 rounded-full border-[1.5px] border-rich/25 border-t-rich"></span>loading in the background
				</div>
			</div>
		{:else if scene === 'height'}
			<div class="bar"><span class="truncate">article.html</span><span class="ml-auto text-mute">layout shift 0</span></div>
			<div class="px-4 pt-4">
				<div class="h-2 w-[70%] rounded-full bg-black/8"></div>
				<!-- the post's place, held before it loads -->
				<div class="mt-3 grid h-24 place-items-center rounded-md border border-dashed border-rich/60 bg-rich/5 font-mono text-[11px] leading-none text-rich">
					↕ 512px reserved
				</div>
				<div class="mt-3 h-2 w-[84%] rounded-full bg-black/8"></div>
				<div class="mt-2 h-2 w-[52%] rounded-full bg-black/8"></div>
			</div>
		{:else if scene === 'single'}
			<div class="bar"><span class="truncate">feed</span><span class="ml-auto text-mute">one at a time</span></div>
			<div class="grid grid-cols-3 gap-3 p-4">
				{#each [0, 1, 2] as n (n)}
					<div>
						<div class="relative h-[88px] overflow-hidden rounded-md {n === 1 ? 'bg-[#111]' : 'bg-black/7'}">
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
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / 0.06);
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
