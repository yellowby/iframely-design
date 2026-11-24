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
	// (Later on 2026-11-24, a try: no product colours in the menu, the one accent is the site's blue. The four tiles
	// are the same pale blue, and the scenes' labels, lines and ticks are blue too. Until then each row had its
	// product's colour: 'bg-rich/8 text-rich', 'bg-preview/8 text-preview', 'bg-data/8 text-data', 'bg-pub/8
	// text-pub', and /12 when selected; the scenes followed. The maps are kept by product, to go back in one line.)
	const TILE = { rich: 'bg-blue/8 text-blue', preview: 'bg-blue/8 text-blue', data: 'bg-blue/8 text-blue', pub: 'bg-blue/8 text-blue' };
	// (The selected row's tile had half as much tint again, a TILE_ON map at /12, after tries at /8, "all but lost" on
	// the row's grey fill, and /16, "a bit much". Dropped on the user's word, 2026-11-24: the tile is the same,
	// selected or not, and the row's fill alone says which is selected.)
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
											<!-- The products' rows are on one grid (2026-11-24). A row is 56px: a 40px tile with 8px over, under
											     and before it, 12px to the text, 16px after the text. The text is as tall as the tile: the name and
											     the note are a 20px line each. A heading, if the column has one, starts on the tile's left edge and
											     is 32px (4px, a 20px line, 8px).
											     (The tile had 12px on its three sides at first, a row of 64px: the menu was too tall. Then 8px over
											     and under and 12px before it, which put its left edge on the "Product" label's in the bar above:
											     now it is 4px left of that, for the same 8px on all three sides.
											     Before the grid: a 36px tile 13px in, 20px after the text, lines of 19.5px, a row of 62px.) -->
											{#if col.title}<p class="{col.items.some((i) => i.icon) ? 'px-2 pt-1 pb-2 leading-5' : 'px-3 pt-1 pb-1 leading-[1.5]'} text-[13px] font-medium text-faint">{col.title}</p>{/if}
											{#each col.items as item, n (item.href)}
												{#if item.icon}
													<!-- a product: its tile (in the product's colour), then the name and the note -->
													<a
														href={item.href}
														class="flex items-center gap-3 rounded-md p-2 pr-4 {n === sel ? 'bg-fg/[0.045]' : ''}"
														onmouseenter={() => (sel = n)}
														onfocus={() => (sel = n)}
													>
														<!-- no transition on the row or the tile: the selection changes at once; the scene on the right cross-fades -->
														<!-- (2026-11-24: the selected tile was black with a white icon, the loudest thing in the menu. Now the row's pale fill alone says which is selected, and the tile is in its product's colour, selected or not.) -->
														<span class="grid size-10 shrink-0 place-items-center rounded-lg {TILE[item.icon]}">
															<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html GLYPH[item.icon]}</svg>
														</span>
														<span class="min-w-0">
															<span class="t-nav block leading-5! font-medium! text-fg">{item.label}</span>
															{#if item.note}<span class="t-small block text-[13px]! leading-5! text-soft">{item.note}</span>{/if}
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
												<!-- (12px of grey around the window, as the rows have before their tiles. It was 20px while the rows
												     were taller: in a menu of four 56px rows that left the window 184px, and the Data API's answer
												     needs 195px: its bar was squeezed.) -->
												<div class="relative m-3 grow">
												<!-- The window itself (white, with its outline and shadow) stands still: one for the four scenes, which
												     are all its size. Only what is in it changes: the scene going out fades in 150ms, the one coming
												     in fades in over 250ms and starts 75ms later, so the two are hardly seen at once.
												     (Until 2026-11-24 each scene was a window of its own, and the windows cross-faded in 130ms, each
												     moving 8px down as it went and up as it came: the white dipped to grey midway and the frame
												     jumped.) -->
												<div class="win absolute inset-0 rounded-md bg-white"></div>
												{#each SCENES as s, n (s)}
													<div class="absolute inset-0 transition-opacity ease-out motion-reduce:transition-none {n === sel ? 'delay-75 duration-250' : 'opacity-0 duration-150'}">
														<div class="flex h-full w-full flex-col overflow-hidden rounded-md">
															{#if s === 'rich'}
																<!-- Rich Media and the Preview API are one API (2026-11-24): the two scenes are a pair, the same box over the
																     same 44px foot. Here the box is a supported provider's embed, ready to show: its player, and in the
																     foot the provider's own options, as the chips of /embeds' options block (two of them on).
																     (It had the link in a bar over the player and a progress line under it.) -->
																<div class="flex grow flex-col px-3 pt-3">
																	<div class="relative grow overflow-hidden rounded-sm bg-black/7">
																		<!-- YouTube's own play button shape (as in the hero's video tile), in the page's blue, not its red -->
																		<svg class="absolute top-1/2 left-1/2 -translate-1/2 text-rich" width="44" height="31" viewBox="0 0 68 48">
																			<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.950-1.480-16.260z" fill="currentColor" />
																			<path d="M45 24 27 14v20z" fill="#fff" />
																		</svg>
																		<!-- (no progress line) -->
																	</div>
																</div>
																<div class="mx-3 mt-2.5 mb-3 flex h-11 flex-none flex-col justify-between">
																	<p class="font-mono text-[10px] leading-none text-mute"><span class="text-fg">youtube.com</span> · options</p>
																	<p class="flex gap-1.5">
																		<!-- (quiet chips: grey words in a grey outline, and only the dot says which are on. At first the two
																		     that are on were blue, tint, outline and words: too much beside the play button. The first was
																		     "Start at 0:42"; a third, "Dark theme", switched off, went the same day.) -->
																		<!-- (Then the user's: the tick of the other scenes' chips, not a dot, and Captions not ticked. An
																		     option that is off has no mark and paler words. Both were on, each with a blue dot.) -->
																		{#each [['Player controls', true], ['Captions', false]] as [label, on] (label)}
																			<span class="flex items-center gap-[5px] rounded-full py-[5px] text-[11px] leading-none ring-1 ring-black/10 ring-inset {on ? 'pr-2 pl-1.5 text-mute' : 'px-2 text-faint'}">
																				{#if on}<svg class="text-blue" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.3 5 8.8l4.5-5.3" /></svg>{/if}{label}
																			</span>
																		{/each}
																	</p>
																</div>
															{:else if s === 'preview'}
																<!-- The Preview API gives the metadata of any link, and the customer makes a card of their own from it.
																     So the card here is not made: an outline of its parts, each named by the field it comes from
																     (thumbnail, title, description, site), the names in the product's colour.
																     (It was a made card, a grey picture with the fields' JSON barely seen on it: decoration.) -->
																<div class="mx-3 mt-3 grid grow place-items-center rounded-sm border border-dashed border-black/20 bg-black/[0.03]">
																	<span class="font-mono text-[10px] leading-none text-blue">thumbnail</span>
																</div>
																<div class="mx-3 mt-2.5 mb-3 flex h-11 flex-none flex-col justify-between font-mono text-[10px] leading-none text-blue">
																	<!-- a part of the card as a grey bar, and after it the field it is made from -->
																	<p class="flex h-3 items-center"><i class="h-2 w-[46%] rounded-full bg-black/12"></i><span class="ml-auto">title</span></p>
																	<p class="flex h-3 items-center"><i class="h-2 w-[64%] rounded-full bg-black/12"></i><span class="ml-auto">description</span></p>
																	<p class="flex h-3 items-center gap-1.5"><i class="size-2.5 rounded-[3px] bg-black/20"></i><i class="h-2 w-[22%] rounded-full bg-black/12"></i><span class="ml-auto">site</span></p>
																</div>
															{:else if s === 'data'}
																<!-- the Data API's answer: the content itself (the title, the excerpt, the full text as
																     Markdown: that whole line on a pale blue band, as an added line in a diff), and one line of the access part: the decision on the full text. In the
																     shape of the site's own sample (lib/data/samples.ts); not yet checked against a live
																     response. Written as JSON5, as all the answers shown on the site: keys without quotes. -->
																<!-- (2026-11-24: one of the family. The Data API is the Preview API with one more layer, the page's full
																     text, given where its publisher allows it. So: the box is that layer, lines of text in the product's
																     colour under the field's name; the foot names the Preview API's fields, which come too, and has
																     the publisher's consent as a chip, as the options of the Rich Media scene.
																     Until then it was the answer written out: a request bar and nine lines of JSON5.) -->
																<div class="mx-3 mt-3 flex grow flex-col justify-center gap-[7px] rounded-sm bg-black/[0.04] px-3">
																	<!-- (Later still: a grey box, the excerpt in greys, as the Preview API's bars, and only the full text
																	     in blue: the layer that is the point. The whole box was tinted, and both parts in the accent. The blue lines are 25% on the grey; they
																	     were 15% on the tint.) -->
																	<!-- (In the product's own words, the user's on 2026-11-24: excerpt, content policy, Content Signals.
																	     The box has the two layers the Data API adds, the excerpt and under it the full text. The foot
																	     says what the reading is for and what allowed it: the page's Content Signals and the
																	     site's robots.txt, as quiet chips with a tick in the product's colour, as the Rich
																	     Media scene's options.
																	     Before: "fulltext" alone over six lines; the foot listed the Preview API's fields, "thumbnail ·
																	     title · description · site", and had one tinted chip, "Publisher allows full text".) -->
																	<span class="font-mono text-[10px] leading-none text-mute">excerpt</span>
																	{#each [96, 62] as w (w)}<i class="h-1.5 rounded-full bg-black/12" style="width:{w}%"></i>{/each}
																	<span class="mt-1.5 font-mono text-[10px] leading-none text-blue">fulltext</span>
																	{#each [94, 100, 58] as w (w)}<i class="h-1.5 rounded-full bg-blue/25" style="width:{w}%"></i>{/each}
																</div>
																<div class="mx-3 mt-2.5 mb-3 flex h-11 flex-none flex-col justify-between">
																	<!-- (the user, the same day: metadata is not what the Data API is about; it is automated processing
																	     and the publisher's signals and consent. So the line has the declared purpose of the reading,
																	     the request's mode, and no domain: "example.com" stood there for a minute.) -->
																	<p class="font-mono text-[10px] leading-none text-mute"><span class="text-fg">mode=ai-input</span> · allowed by</p>
																	<p class="flex gap-1.5">
																		<!-- (the second was "Content policy" until the user asked for robots.txt, the same day) -->
																		{#each ['Content Signals', 'robots.txt'] as label (label)}
																			<span class="flex items-center gap-[5px] rounded-full py-[5px] pr-2 pl-1.5 text-[11px] leading-none text-mute ring-1 ring-black/10 ring-inset">
																				<svg class="text-blue" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.3 5 8.8l4.5-5.3" /></svg>{label}
																			</span>
																		{/each}
																	</p>
																</div>
															{:else}
																<!-- a publisher's settings: what each kind of app receives -->
																<!-- After the /publishers hero scene (lib/scene/sec.js, pubStage): the window's bar (the domain,
																     here the reader's own, and "DNS verified" with a tick) and its content policy as three
																     rules by path, in the scene's own words: a path, a processing mode (Assist, AI-Input,
																     AI-Train) and the content types allowed (Meta, Links, Fulltext).
																     (It was a list of switches: Link previews, Excerpts, Full text, AI training.) -->
																<!-- (2026-11-24, one of the family: the rules are the box, and the domain and "DNS verified" went from a bar
																     over them to the foot, the second as a chip. Gone: the "Content policy" label over the rules and
																     the processing mode in each, Assist, AI-Input, AI-Train.) -->
																<!-- (Later the same day, "too busy": it was the console's own controls, each path in a grey code chip,
																     each answer in an outlined select with a chevron, hairlines between the rules, and a tinted
																     "DNS verified" chip. Now it is drawn as the Data API's box beside it: a tinted box, the
																     policy's name in the product's colour, and three plain lines, a path and what is given there.
																     The second rule gives an excerpt, in the Data API scene's word; it was "Meta · Links".
																     The foot's chip is quiet, as the others'.) -->
																<!-- (Then, the user's: a grey box as the other three, and another layout. Each rule is a white row on
																     the grey, as a row of settings: the path, and at its end what is given there; only "Fulltext" is
																     blue, as the full text of the Data API's scene. The policy's name went back to the foot.
																     It was a tinted box with "content policy" in blue over three bare lines, the path at one edge
																     and the answer at the other with nothing to hold them together.) -->
																<div class="mx-3 mt-3 flex grow flex-col justify-center gap-1.5 rounded-sm bg-black/[0.04] px-3">
																	<!-- a rule: a path, and what the apps receive there -->
																	{#each [['/blog/*', 'Fulltext'], ['/members/*', 'Excerpt'], ['/*', 'No access']] as [path, gets], k (path)}
																		<!-- (the first rule, the one that gives the full text, is the blue of the scene: the whole row, a
																		     pale blue in place of the white, with its path and its answer in blue. Only the word
																		     "Fulltext" was blue: too little to be seen as the accent.) -->
																		<p class="flex items-center justify-between rounded-sm px-2 py-2 text-[11px] leading-none bg-white">
																			<!-- (the first row is white again, on the user's word: for a while it had a pale blue fill, 10% of
																			     the blue on white. Its path and its answer stay blue.) -->
																			<!-- (a span, not code: the site's code has a grey chip of its own) -->
																			<span class="font-mono {k ? 'text-fg' : 'text-blue'}">{path}</span>
																			<span class={k ? 'text-mute' : 'font-medium text-blue'}>{gets}</span>
																		</p>
																	{/each}
																</div>
																<div class="mx-3 mt-2.5 mb-3 flex h-11 flex-none flex-col justify-between">
																	<p class="font-mono text-[10px] leading-none text-mute"><span class="text-fg">your-site.com</span> · content policy</p>
																	<p class="flex">
																		<span class="flex items-center gap-[5px] rounded-full py-[5px] pr-2 pl-1.5 text-[11px] leading-none text-mute ring-1 ring-black/10 ring-inset">
																			<svg class="text-blue" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.3 5 8.8l4.5-5.3" /></svg>DNS verified
																		</span>
																	</p>
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
		flex: none; /* a scene too tall for the window is cut at its foot: the bar is not squeezed */
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
