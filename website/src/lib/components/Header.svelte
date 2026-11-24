<script lang="ts">
	import { page } from '$app/state';
	import { header } from '#lib/data/nav.ts';
	import { ICONS } from '#lib/data/icons.ts';

	// Home01 header: 72px, the 1200px container, //iframely, Products and Resources as two-column dropdowns, Domains,
	// Pricing; an outlined Log in pill and a black Start free pill on the right. Sticky on the page ground, no rule.
	let open = $state<string | null>(null);
	let mobile = $state(false);

	// top-level items: a very light fill on hover and while the dropdown is open; the current page's item is not marked
	// the nav has an 8px gap; each item's hover area reaches 4px past its fill on both sides (the ::after), so the areas
	// touch and the pointer is always over one of them
	const item = 't-nav relative rounded-md px-3 py-1.5 after:absolute after:inset-y-0 after:-inset-x-1 text-body transition-colors hover:bg-fg/5 hover:text-fg';
	const on = 'bg-fg/5 text-fg';

	// The dropdowns share one panel. show() places it under the button and gives it the menu's size; `anim` is on only
	// when it goes from one open menu to another, so the move, the resize and the cross-fade are animated then, and a
	// menu opened from closed appears in place (with the drop-in).
	const menus = header.filter((g) => g.columns);
	const MOVE = 'duration-130 ease-out motion-reduce:transition-none';
	const layers: Record<string, HTMLElement> = $state({});
	let anim = $state(false);
	let box = $state({ x: 0, w: 0, h: 0 });
	const at = $derived(menus.findIndex((g) => g.label === open));
	function show(label: string, button: HTMLElement) {
		if (open === label) return;
		const el = layers[label];
		anim = open !== null;
		box = { x: button.offsetLeft - 8, w: el.offsetWidth, h: el.offsetHeight };
		open = label;
		// the product whose page this is (or one of its earlier drafts: /embeds-3 is Rich Media's), or else the first
		const here = PRODUCTS.findIndex((p) => page.url.pathname === p.href || page.url.pathname.startsWith(p.href + '-') || page.url.pathname.startsWith(p.href + '/'));
		sel = Math.max(here, 0);
	}
	const PRODUCTS = header.flatMap((g) => g.columns ?? []).flatMap((c) => c.items).filter((i) => i.icon);

	// The Product dropdown: the four products on the left, and on the right a grey area with a small scene of the one
	// that is selected. A product is selected by pointing at it or by the keyboard's focus; when the menu opens it is
	// the first. Its tile is in the product's colour, the icon on an 8% tint of it: the same icon and colour as the
	// product's card on the home page. (2026-11-24. The tiles had gone to greys, pale grey with a dark icon and black
	// with a white icon when selected: the black was too loud, and four grey tiles told the products apart no better
	// than no tiles.)
	const TILE = { rich: 'bg-rich/8 text-rich', preview: 'bg-preview/8 text-preview', data: 'bg-data/8 text-data', pub: 'bg-pub/8 text-pub' };
	// the selected row's tile: half as much tint again (on the row's grey fill 8% was all but lost; 16% was a bit much)
	const TILE_ON = { rich: 'bg-rich/12 text-rich', preview: 'bg-preview/12 text-preview', data: 'bg-data/12 text-data', pub: 'bg-pub/12 text-pub' };
	let sel = $state(0);
	const SCENES = ['rich', 'preview', 'data', 'pub'] as const;
	const glyph = (d: string) =>
		`<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-linecap="square"/>`;
	const GLYPH = { rich: glyph(ICONS.rich), preview: glyph(ICONS.preview), data: glyph(ICONS.data), pub: glyph(ICONS.pub) };

	$effect(() => {
		// close menus on navigation
		page.url.pathname;
		open = null;
		mobile = false;
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = null)} />

{#snippet chevron()}
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" class="transition-transform"
		><path d="M9 5L6 8 3 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" /></svg
	>
{/snippet}

<!-- Not sticky for now (2026-11-12): to stick it again, replace "relative" with "sticky top-0" and add "bg-page/90 backdrop-blur-md" -->
<header class="relative z-40">
	<div class="wrap flex h-(--header-h) items-center">
		<a href="/" class="logo shrink-0" aria-label="Iframely"><b>//</b>iframely</a>

		<nav class="ml-9 hidden lg:block" aria-label="Main">
			<div class="relative flex items-center gap-2" role="presentation" onmouseleave={() => (open = null)}>
				{#each header as group (group.label)}
					{#if group.columns}
						<button
							type="button"
							class="{item} flex items-center gap-[5px] pr-2 {open === group.label ? on + ' [&_svg]:rotate-180' : ''}"
							aria-expanded={open === group.label}
							onclick={(e) => (open === group.label ? (open = null) : show(group.label, e.currentTarget))}
							onmouseenter={(e) => show(group.label, e.currentTarget)}>{group.label}{@render chevron()}</button
						>
					{:else}
						<a href={group.href} class={item} onmouseenter={() => (open = null)}>{group.label}</a>
					{/if}
				{/each}

				<!-- One panel for all the dropdowns. It stays open from one menu to the next: it slides under the new button,
				     takes the new menu's size, and the two menus cross-fade. Opened from closed, it only drops in. -->
				<div
					class="absolute top-full left-0 pt-3 {open ? '' : 'invisible'} {anim ? MOVE + ' transition-transform' : ''}"
					style="transform:translateX({box.x}px)"
				>
					<div
						class="relative box-content overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_12px_32px_rgb(17_17_17/calc(0.08*var(--drop,1)))] {anim ? MOVE + ' transition-[width,height]' : ''}"
						class:drop={open !== null && !anim}
						style="width:{box.w}px;height:{box.h}px"
					>
						{#each menus as group, gi (group.label)}
							<div
								bind:this={layers[group.label]}
								inert={open !== group.label}
								class="absolute top-0 left-0 flex w-max gap-2 p-2 {group.columns?.[0].items[0].icon ? '' : 'pb-3.5'} {anim ? MOVE + ' transition-[opacity,translate]' : ''} {open === group.label ? '' : 'opacity-0 ' + (gi < at ? '-translate-x-4' : 'translate-x-4')}"
							>
									{#each group.columns ?? [] as col, i (i)}
										<!-- the products' column is as wide as its longest line of text (it was a fixed 23rem) -->
										<div class={col.items.some((i) => i.icon) ? 'whitespace-nowrap' : col.items.some((i) => i.note) ? 'w-[19rem]' : 'w-56'}>
											{#if col.title}<p class="{col.items.some((i) => i.icon) ? 'px-2' : 'px-3'} pt-1 pb-1 text-[13px] leading-[1.5] font-medium text-faint">{col.title}</p>{/if}
											{#each col.items as item, n (item.href)}
												{#if item.icon}
													<!-- a product: its tile (in the product's colour), then the name and the note -->
													<a
														href={item.href}
														class="flex items-center gap-3 rounded-md p-3 pr-5 pl-[13px] {n === sel ? 'bg-fg/[0.045]' : ''}"
														onmouseenter={() => (sel = n)}
														onfocus={() => (sel = n)}
													>
														<!-- no transition on the row or the tile: the selection changes at once; the scene on the right cross-fades -->
														<!-- (2026-11-24: the selected tile was black with a white icon, the loudest thing in the menu. Now the row's pale fill alone says which is selected, and the tile is in its product's colour, selected or not.) -->
														<span class="grid size-9 shrink-0 place-items-center rounded-lg {(n === sel ? TILE_ON : TILE)[item.icon]}">
															<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html GLYPH[item.icon]}</svg>
														</span>
														<span class="min-w-0">
															<span class="t-nav block font-medium! text-fg">{item.label}</span>
															{#if item.note}<span class="t-small block text-[13px]! text-soft">{item.note}</span>{/if}
														</span>
													</a>
												{:else}
													<a href={item.href} class="block rounded-md px-3 py-2 transition-colors hover:bg-fg/[0.035]">
														<span class="t-nav block font-medium! text-fg">{item.label}</span>
														{#if item.note}<span class="t-small block text-[13px]! text-soft">{item.note}</span>{/if}
													</a>
												{/if}
											{/each}
										</div>
										{#if col.items[0].icon}
											<!-- the grey area: a small scene of the selected product, the four of them stacked and cross-fading -->
											<!-- The whole area is a link to the selected product (it had a line under the scene, "Explore Rich
											     Media →"). It is the same link as the row's, so it is kept from the keyboard and screen readers. -->
											<a href={col.items[sel].href} tabindex="-1" aria-hidden="true" class="pane group/pane flex w-[20rem] flex-col self-stretch rounded-lg bg-[#f4f4f5]">
												<div class="relative m-5 grow">
												{#each SCENES as s, n (s)}
													<!-- the scene coming in rises a few pixels as it fades in; the windows are all one height -->
													<div class="absolute inset-0 transition-[opacity,translate] duration-130 ease-out motion-reduce:transition-none {n === sel ? '' : 'translate-y-2 opacity-0'}">
														<div class="win flex h-full w-full flex-col overflow-hidden rounded-md bg-white">
															{#if s === 'rich'}
																<!-- an embed: a player -->
																<div class="bar">youtu.be/9bZkp7q19f0</div>
																<div class="flex grow flex-col p-2.5">
																	<div class="relative grow overflow-hidden rounded-sm bg-black/7">
																		<!-- YouTube's own play button shape (as in the hero's video tile), in the page's blue, not its red -->
																		<svg class="absolute top-1/2 left-1/2 -translate-1/2 text-rich" width="44" height="31" viewBox="0 0 68 48">
																			<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.950-1.480-16.260z" fill="currentColor" />
																			<path d="M45 24 27 14v20z" fill="#fff" />
																		</svg>
																		<span class="absolute inset-x-0 bottom-0 h-[3px] bg-black/10"><span class="block h-full w-[34%] bg-rich"></span></span>
																	</div>
																</div>
															{:else if s === 'preview'}
																<!-- a link's card: the picture, the title, where it is from -->
																<!-- (a skeleton: grey bars for the title; it had a written title and a line of text) -->
																<!-- on the picture, barely there: the data the card is made from (JSON5; illustrative) -->
																<div class="relative grow overflow-hidden bg-black/7">
																	<pre class="absolute inset-0 m-0 px-3 py-2.5 font-mono text-[10px] leading-[1.55] text-fg/25">{'{'}
  title: 'Page title',
  description: 'A short…',
  site: 'example.com',
  thumbnail: {'{'} … {'}'}
{'}'}</pre>
																</div>
																<div class="p-3">
																	<div class="h-2 w-[88%] rounded-full bg-black/12"></div>
																	<div class="mt-2 h-2 w-[60%] rounded-full bg-black/12"></div>
																	<!-- the one blue detail: the site's icon before its name -->
																	<p class="mt-3 flex items-center gap-1.5 font-mono text-[11px] leading-none text-mute"><i class="size-2.5 rounded-[3px] bg-rich"></i>example.com</p>
																</div>
															{:else if s === 'data'}
																<!-- the Data API's answer: the content itself (the title, the excerpt, the full text as
																     Markdown: that whole line on a pale blue band, as an added line in a diff), and one line of the access part: the decision on the full text. In the
																     shape of the site's own sample (lib/data/samples.ts); not yet checked against a live
																     response. Written as JSON5, as all the answers shown on the site: keys without quotes. -->
																<div class="bar">GET iframe.ly/api/data<span class="text-mute">?url=…</span></div>
																<pre class="m-0 px-3 py-2.5 font-mono text-[11px] leading-[1.5] text-mute">{'{'}
  meta: {'{'} title: <span class="text-fg">'Page title'</span> {'}'},
  entities: {'{'} … {'}'},
  excerpt: <span class="text-fg">'A short summary…'</span>,
<span class="-mx-3 block bg-rich/10 px-3 text-rich">  fulltext: '# Page title…',</span>  access: {'{'} decision: {'{'}
    fulltext: {'{'} allowed: <span class="text-fg">true</span> {'}'}
  {'}'} {'}'}
{'}'}</pre>
															{:else}
																<!-- a publisher's settings: what each kind of app receives -->
																<!-- After the /publishers hero scene (lib/scene/sec.js, pubStage): the window's bar (the domain,
																     here the reader's own, and "DNS verified" with a tick) and its content policy as three
																     rules by path, in the scene's own words: a path, a processing mode (Assist, AI-Input,
																     AI-Train) and the content types allowed (Meta, Links, Fulltext).
																     (It was a list of switches: Link previews, Excerpts, Full text, AI training.) -->
																<div class="bar">your-site.com<span class="ml-auto flex items-center gap-1 text-mute"><svg class="text-rich" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.3 5 8.8l4.5-5.3" /></svg>DNS verified</span></div>
																<div class="flex grow flex-col px-3 pt-2.5">
																	<p class="font-mono text-[10px] leading-none text-mute">Content policy</p>
																	<div class="mt-1 flex grow flex-col divide-y divide-black/7">
																		<!-- a rule: a path, a processing mode, and the content types that mode is allowed there -->
																		{#each [['/blog/*', 'Assist', 'Fulltext'], ['/members/*', 'AI-Input', 'Meta · Links'], ['/*', 'AI-Train', 'No access']] as [path, mode, gets], k (path)}
																			<p class="flex grow items-center gap-2 text-[12px] leading-none">
																				<code class="rounded-sm bg-black/6 px-1.5 py-1 font-mono text-[11px] text-fg">{path}</code>
																				<span class="ml-auto text-mute">{mode}</span>
																				<!-- what it receives, as the console's select -->
																				<span class="flex w-[98px] items-center justify-between rounded-sm px-2 py-1.5 ring-1 ring-black/12 ring-inset {k ? 'text-fg' : 'text-rich'}">
																					{gets}<svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" class="text-mute"><path d="M9 4.5 6 7.5 3 4.5" /></svg>
																				</span>
																			</p>
																		{/each}
																	</div>
																</div>
															{/if}
														</div>
													</div>
												{/each}
												</div>
											</a>
										{/if}
									{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</nav>

		<!-- (Log in is an outlined pill beside the black one since 2026-11-24, in the look of the secondary button
		     beside a black one in the pages' calls to action (Button.svelte): body-grey words, a black ring that
		     darkens to 40% under the pointer; the ring is 8% here, a little lighter than the button's 12%. It was a plain nav item: class={item}, the pair 4px apart.) -->
		<div class="ml-auto hidden items-center gap-2 lg:flex">
			<a href="#login" class="t-nav rounded-full px-3.5 py-1.5 font-medium! text-body ring-1 ring-black/8 transition-colors ring-inset hover:ring-black/40">Log in</a>
			<a href="#signup" class="t-nav rounded-full bg-fg px-3.5 py-1.5 font-medium! text-white hover:bg-body">Start free</a>
		</div>

		<button
			type="button"
			class="t-nav ml-auto rounded-full px-3.5 py-1.5 ring-1 ring-fg/15 lg:hidden"
			aria-expanded={mobile}
			onclick={() => (mobile = !mobile)}>{mobile ? 'Close' : 'Menu'}</button
		>
	</div>

	{#if mobile}
		<nav class="wrap max-h-[80vh] overflow-y-auto pb-6 lg:hidden" aria-label="Mobile">
			{#each header as group (group.label)}
				<div class="border-b border-rule py-3">
					{#if group.columns}
						{#each group.columns as col, i (i)}
							{#if col.title}<p class="t-small pt-2 text-faint">{col.title}</p>{/if}
							{#each col.items as item (item.href)}
								<a href={item.href} class="t-nav block py-1.5 text-fg">{item.label}</a>
							{/each}
						{/each}
					{:else}
						<a href={group.href} class="t-nav block py-1.5 text-fg">{group.label}</a>
					{/if}
				</div>
			{/each}
			<div class="flex gap-2 pt-4">
				<a href="#signup" class="t-nav rounded-full bg-fg px-3.5 py-1.5 font-medium! text-white">Start free</a>
				<a href="#login" class="t-nav rounded-full px-3.5 py-1.5 font-medium! text-body ring-1 ring-black/8 ring-inset">Log in</a>
			</div>
		</nav>
	{/if}
</header>

<style>
	/* //iframely: JetBrains Mono 20, the slashes ExtraBold in Iframely blue, the word Bold */
	.logo {
		font: 700 20px/26px 'JetBrains Mono', ui-monospace, monospace;
		color: #000;
	}
	/* the scenes in the Product dropdown's grey area: a window as the pages' scenes have, with a mono bar */
	.pane .win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.pane .bar {
		display: flex;
		align-items: center;
		height: 30px;
		padding: 0 12px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	/* dropdowns slide down a few pixels as they fade in (off when reduced motion is set) */
	.drop {
		animation: drop 0.2s cubic-bezier(0.2, 0.7, 0.3, 1);
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.drop {
			animation: none;
		}
	}
	.logo b {
		font-weight: 800;
		color: var(--color-blue);
	}
</style>
