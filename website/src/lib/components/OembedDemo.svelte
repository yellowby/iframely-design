<script lang="ts">
	// The lead scene of the "For developers" block on /embeds-2: the block's whole argument, "send a URL, get HTML
	// back", as one window on squared paper that works. The bar is the request; under it, side by side, the JSON answer
	// and its html field rendered (a player, an audio bar, a post, a canvas). The row of providers above the window sends
	// another URL to the same endpoint: the request, the answer and the embed change, the endpoint does not.
	// The answers are written here, not fetched; the titles and ids are illustrative. They are shown as JSON5 (keys
	// without quotes, strings in single quotes), as all the answers on the site.
	const SRC = import.meta.glob('../assets/providers/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`];

	type Kind = 'video' | 'audio' | 'post' | 'canvas';
	// id (the logo's file), name, the URL sent, the answer's type and title, what the html renders as
	const ITEMS: { id: string; name: string; url: string; type: string; title: string; kind: Kind }[] = [
		{ id: 'youtube', name: 'YouTube', url: 'https://youtu.be/9bZkp7q19f0', type: 'video', title: 'PSY - GANGNAM STYLE', kind: 'video' },
		{ id: 'spotify', name: 'Spotify', url: 'https://open.spotify.com/track/4uLU6h…', type: 'rich', title: 'Never Gonna Give You Up', kind: 'audio' },
		{ id: 'x', name: 'X/Twitter', url: 'https://x.com/NASA/status/18392…', type: 'rich', title: 'NASA on X', kind: 'post' },
		{ id: 'figma', name: 'Figma', url: 'https://figma.com/design/k3Yp…/App', type: 'rich', title: 'App – Figma', kind: 'canvas' }
	];
	let active = $state(0);
	const it = $derived(ITEMS[active]);
</script>

<div class="paper h-full rounded-md p-4 sm:p-6">
	<!-- the providers, as tabs on the paper above the window: each sends another URL to the same endpoint -->
	<div class="mb-4 flex flex-wrap items-center gap-2">
		{#each ITEMS as p, i (p.id)}
			<button type="button" class="chip" aria-pressed={i === active} onclick={() => (active = i)}>
				<img src={logo(p.id)} alt="" width="16" height="16" />{p.name}
			</button>
		{/each}
	</div>
	<div class="win overflow-hidden rounded-md bg-white">
		<div class="bar"><span class="verb">GET</span><span class="truncate">iframe.ly/api/oembed?url=<b>{it.url}</b></span></div>
		<div class="grid sm:grid-cols-[1fr_1.1fr]">
			{#key active}
				<pre class="code swap">{'{'}
  <i>type</i>: '{it.type}',
  <i>provider_name</i>: '{it.name}',
  <i>title</i>: '{it.title}',
  <i>html</i>: <b>'&lt;iframe src=…&gt;&lt;/iframe&gt;'</b>
{'}'}</pre>
				<!-- the html field, rendered -->
				<div class="swap flex flex-col border-t border-black/7 p-4 sm:border-t-0 sm:border-l" aria-hidden="true">
					<!-- a fixed height, so the window does not change size from one answer to the next -->
					<div class="grid h-[210px] place-items-center">
						{#if it.kind === 'video'}
							<div class="relative aspect-video h-full max-w-full overflow-hidden rounded-sm bg-black/7">
								<span class="play"><svg width="12" height="12" viewBox="0 0 14 14" fill="#fff"><path d="M3 1.5v11l9-5.5z" /></svg></span>
								<span class="absolute inset-x-0 bottom-0 h-[3px] bg-black/10"></span>
							</div>
						{:else if it.kind === 'audio'}
							<div class="flex w-full items-center gap-3 rounded-sm bg-black/7 p-3">
								<span class="size-14 shrink-0 rounded-sm bg-black/12"></span>
								<div class="grow">
									<div class="h-2 w-[80%] rounded-full bg-black/15"></div>
									<div class="mt-2 h-2 w-[50%] rounded-full bg-black/10"></div>
									<div class="mt-3.5 h-[3px] rounded-full bg-black/10"><div class="h-full w-[30%] rounded-full bg-rich"></div></div>
								</div>
								<span class="play static! translate-none! size-8!"><svg width="10" height="10" viewBox="0 0 14 14" fill="#fff"><path d="M3 1.5v11l9-5.5z" /></svg></span>
							</div>
						{:else if it.kind === 'post'}
							<div class="w-full rounded-sm p-3 ring-1 ring-black/12">
								<div class="flex items-center gap-2">
									<span class="size-7 rounded-full bg-black/12"></span>
									<div class="grow">
										<div class="h-2 w-20 rounded-full bg-black/15"></div>
										<div class="mt-1.5 h-1.5 w-12 rounded-full bg-black/8"></div>
									</div>
								</div>
								<div class="mt-3 h-2 w-[92%] rounded-full bg-black/8"></div>
								<div class="mt-2 h-2 w-[78%] rounded-full bg-black/8"></div>
								<div class="mt-2 h-2 w-[40%] rounded-full bg-rich/40"></div>
							</div>
						{:else}
							<div class="relative aspect-video h-full max-w-full overflow-hidden rounded-sm bg-black/5 ring-1 ring-black/8">
								<span class="absolute top-[18%] left-[10%] h-[46%] w-[34%] rounded-sm bg-rich/15 ring-1 ring-rich/50"></span>
								<span class="absolute top-[30%] left-[52%] size-[26%] rounded-full bg-black/10"></span>
								<span class="absolute bottom-[14%] left-[52%] h-[14%] w-[36%] rounded-sm ring-1 ring-black/20"></span>
							</div>
						{/if}
					</div>
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	/* the grey of the cards' covers, plain: no pattern */
	.paper {
		background-color: #fafafa;
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
	.code {
		margin: 0;
		padding: 14px 16px;
		overflow: hidden;
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
	/* a new answer comes in softly */
	.swap {
		animation: swap 0.3s ease-out;
	}
	@keyframes swap {
		from {
			opacity: 0;
		}
	}
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 40px;
		height: 40px;
		translate: -50% -50%;
		border-radius: 999px;
		background: var(--color-rich);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 6px 12px 6px 9px;
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
			color 0.2s;
	}
	.chip:hover {
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.28);
	}
	.chip:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	.chip[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-rich) 8%, white);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-rich) 45%, white);
		color: var(--color-rich);
	}
	@media (prefers-reduced-motion: reduce) {
		.swap {
			animation: none;
		}
		.chip {
			transition: none;
		}
	}
</style>
