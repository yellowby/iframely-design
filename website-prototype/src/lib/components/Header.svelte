<script lang="ts">
	import { page } from '$app/state';
	import { header } from '#lib/data/nav.ts';
	import { ICONS } from '#lib/data/icons.ts';

	// Home01 header: 72px, the 1200px container, //iframely, Products and Resources as two-column dropdowns, Domains,
	// Pricing; Log in and a black Start free pill on the right. Sticky on the page ground, no rule.
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
	}

	// product tiles in the Product dropdown: the product colour at 8% as the ground (as the ring around the hero's
	// windows), and the icon in the solid colour
	const TILE = {
		rich: 'bg-rich/8 text-rich',
		preview: 'bg-preview/8 text-preview',
		data: 'bg-data/8 text-data',
		pub: 'bg-pub/8 text-pub'
	};
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
						class="relative box-content overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_12px_32px_rgba(17,17,17,0.08)] {anim ? MOVE + ' transition-[width,height]' : ''}"
						class:drop={open !== null && !anim}
						style="width:{box.w}px;height:{box.h}px"
					>
						{#each menus as group, gi (group.label)}
							<div
								bind:this={layers[group.label]}
								inert={open !== group.label}
								class="absolute top-0 left-0 flex w-max gap-2 p-2 pb-3.5{anim ? MOVE + ' transition-[opacity,translate]' : ''} {open === group.label ? '' : 'opacity-0 ' + (gi < at ? '-translate-x-4' : 'translate-x-4')}"
							>
									{#each group.columns ?? [] as col, i (i)}
										<div class={col.items.some((i) => i.icon) ? 'w-[23rem]' : col.items.some((i) => i.note) ? 'w-[19rem]' : 'w-56'}>
											{#if col.title}<p class="{col.items.some((i) => i.icon) ? 'px-2' : 'px-3'} pt-1 pb-1 text-[13px] leading-[1.5] font-medium text-faint">{col.title}</p>{/if}
											{#each col.items as item (item.href)}
												{#if item.icon}
													<!-- a product: its tile in the product colour, then the name and the note -->
													<a href={item.href} class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-fg/[0.035]">
														<span class="grid size-9 shrink-0 place-items-center rounded-lg {TILE[item.icon]}">
															<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html GLYPH[item.icon]}</svg>
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
									{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</nav>

		<div class="ml-auto hidden items-center gap-1 lg:flex">
			<a href="#login" class={item}>Log in</a>
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
				<a href="#login" class="t-nav rounded-full px-3.5 py-1.5 font-medium! text-body ring-1 ring-fg/20">Log in</a>
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
