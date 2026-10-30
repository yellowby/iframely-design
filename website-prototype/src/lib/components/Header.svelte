<script lang="ts">
	import { page } from '$app/state';
	import { header } from '#lib/data/nav.ts';

	// Home01 header: 72px, the 1200px container, //iframely, Products and Resources as two-column dropdowns, Domains,
	// Pricing; Log in and a black Start free pill on the right. Sticky on the page ground, no rule.
	let open = $state<string | null>(null);
	let mobile = $state(false);

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

<header class="sticky top-0 z-40 bg-page/90 backdrop-blur-md">
	<div class="wrap flex h-(--header-h) items-center">
		<a href="/" class="logo shrink-0" aria-label="Iframely"><b>//</b>iframely</a>

		<nav class="ml-12 hidden items-center gap-8 lg:flex" aria-label="Main">
			{#each header as group (group.label)}
				{#if group.columns}
					<div class="relative" role="presentation" onmouseleave={() => (open = null)}>
						<button
							type="button"
							class="t-nav flex items-center gap-[5px] py-2 text-body hover:text-fg {open === group.label ? 'text-fg [&_svg]:rotate-180' : ''}"
							aria-expanded={open === group.label}
							onclick={() => (open = open === group.label ? null : group.label)}
							onmouseenter={() => (open = group.label)}>{group.label}{@render chevron()}</button
						>
						{#if open === group.label}
							<div class="absolute top-full -left-4 pt-3">
								<div class="flex gap-2 rounded-2xl border border-rule bg-white p-2 shadow-[0_12px_32px_rgba(17,17,17,0.08)]">
									{#each group.columns as col (col.title)}
										<div class={col.items.some((i) => i.note) ? 'w-[19rem]' : 'w-56'}>
											<p class="t-small px-3 pt-2 pb-1 text-faint">{col.title}</p>
											{#each col.items as item (item.href)}
												<a href={item.href} class="block rounded-lg px-3 py-2 hover:bg-page">
													<span class="t-nav block text-fg">{item.label}</span>
													{#if item.note}<span class="t-small block text-soft">{item.note}</span>{/if}
												</a>
											{/each}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<a href={group.href} class="t-nav py-2 text-body hover:text-fg">{group.label}</a>
				{/if}
			{/each}
		</nav>

		<div class="ml-auto hidden items-center gap-4 lg:flex">
			<a href="#login" class="t-nav text-body hover:text-fg">Log in</a>
			<a href="#signup" class="t-button rounded-full bg-fg px-3.5 py-1.5 text-white hover:bg-body">Start free</a>
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
						{#each group.columns as col (col.title)}
							<p class="t-small pt-2 text-faint">{col.title}</p>
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
				<a href="#signup" class="t-button rounded-full bg-fg px-3.5 py-1.5 text-white">Start free</a>
				<a href="#login" class="t-button rounded-full px-3.5 py-1.5 text-body ring-1 ring-fg/20">Log in</a>
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
	.logo b {
		font-weight: 800;
		color: var(--color-blue);
	}
</style>
