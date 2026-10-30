<script lang="ts">
	import Badge from './Badge.svelte';
	import Code from './Code.svelte';
	import Button from './Button.svelte';
	import { resolve, nativeCode, defaultOptions, findProvider, type OptionValues } from '#lib/generator.ts';

	// Embed-code generator with sample results.
	// Native code for providers that publish it; the hosted path is preview-only behind the account gate.
	let {
		initialUrl,
		chips = [],
		showOptions = true,
		onCheck
	}: {
		initialUrl: string;
		chips?: { label: string; url: string }[];
		showOptions?: boolean;
		onCheck?: (url: string) => void;
	} = $props();

	// svelte-ignore state_referenced_locally
	let input = $state(initialUrl);
	// svelte-ignore state_referenced_locally
	let url = $state(initialUrl);
	// svelte-ignore state_referenced_locally
	let opts = $state<OptionValues>(defaultOptions(findProvider(initialUrl)));
	let device = $state<'desktop' | 'mobile'>('desktop');

	const result = $derived(resolve(url, opts));
	const code = $derived(result.kind === 'native' ? nativeCode(result, opts) : '');
	const options = $derived(showOptions && result.kind === 'native' ? (result.provider?.options ?? []) : []);

	export function check(next: string) {
		input = next;
		url = next.trim();
		opts = defaultOptions(findProvider(url));
		onCheck?.(url);
	}

	const previewClass = $derived(
		{
			'16:9': 'aspect-video',
			'9:16': 'aspect-[9/16] max-h-[28rem] mx-auto',
			'4:3': 'aspect-[4/3]',
			card: 'aspect-[16/7]',
			auto: 'aspect-[4/3]'
		}[result.ratio] ?? 'h-36'
	);
</script>

<div class="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm md:p-6">
	<form
		class="flex flex-col gap-2 sm:flex-row"
		onsubmit={(e) => {
			e.preventDefault();
			check(input);
		}}
	>
		<label class="sr-only" for="gen-url">Link to embed</label>
		<input
			id="gen-url"
			type="url"
			bind:value={input}
			placeholder="Paste a link: YouTube, X, Instagram, TikTok, Spotify, a news article…"
			class="min-w-0 flex-1 rounded-md border border-ink-200 px-3 py-2.5 text-[15px] focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
		/>
		<button type="submit" class="rounded-md bg-fg px-5 py-2.5 font-medium text-white hover:bg-body"
			>Get embed code</button
		>
	</form>

	{#if chips.length}
		<div class="mt-3 flex flex-wrap items-center gap-2 text-sm">
			<span class="text-ink-500">Try:</span>
			{#each chips as chip (chip.url)}
				<button
					type="button"
					onclick={() => check(chip.url)}
					class="rounded-full px-3 py-1 ring-1 {url === chip.url
						? 'bg-brand-50 text-brand-800 ring-brand-300'
						: 'text-ink-700 ring-ink-200 hover:ring-ink-400'}">{chip.label}</button
				>
			{/each}
		</div>
	{/if}

	<div class="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
		<div class="min-w-0">
			<div class="mb-3 flex flex-wrap items-center gap-2">
				<p class="text-sm font-medium text-ink-900">{result.line}</p>
				{#if result.kind === 'native'}
					<Badge tone="good">native code</Badge>
				{:else}
					<Badge tone="brand">hosted by Iframely</Badge>
				{/if}
				<div class="ml-auto inline-flex rounded-md bg-ink-100 p-0.5 text-xs">
					{#each ['desktop', 'mobile'] as d (d)}
						<button
							type="button"
							onclick={() => (device = d as 'desktop' | 'mobile')}
							class="rounded px-2.5 py-1 capitalize {device === d ? 'bg-white shadow-sm' : 'text-ink-500'}"
							>{d}</button
						>
					{/each}
				</div>
			</div>
			<div class="rounded-lg bg-ink-50 p-3 {device === 'mobile' ? 'mx-auto max-w-[340px]' : ''}">
				<div
					class="relative flex items-center justify-center rounded-md border-2 border-dashed border-ink-200 bg-ink-100 {previewClass}"
				>
					<span class="grid size-14 place-items-center rounded-full bg-ink-900/80 text-xl text-white">▶</span>
					<span class="absolute bottom-2 left-3 text-[11px] font-medium tracking-wide text-ink-400 uppercase">
						{result.kind === 'native' ? 'Preview: click-to-play cover' : 'Preview: Iframely summary card'}
					</span>
				</div>
			</div>
			<p class="mt-2 text-xs text-ink-500">
				The preview loads nothing from {result.provider?.name ?? 'the site'} until you press play.
			</p>
		</div>

		<div class="min-w-0 space-y-4">
			{#if options.length}
				<fieldset class="rounded-lg border border-ink-100 p-4">
					<legend class="px-1 text-sm font-medium">{result.provider?.name} options</legend>
					<div class="grid gap-x-4 gap-y-2 sm:grid-cols-2">
						{#each options as opt (opt.key)}
							{#if opt.type === 'toggle'}
								<label class="flex items-center gap-2 text-sm text-ink-700">
									<input type="checkbox" bind:checked={opts[opt.key] as boolean} class="accent-brand-600" />
									{opt.label}
								</label>
							{:else if opt.type === 'time'}
								<label class="flex items-center gap-2 text-sm text-ink-700">
									<span class="w-16 shrink-0">{opt.label}</span>
									<input
										type="text"
										placeholder="m:ss"
										bind:value={opts[opt.key] as string}
										class="w-20 rounded border border-ink-200 px-2 py-1"
									/>
								</label>
							{:else}
								<label class="flex items-center gap-2 text-sm text-ink-700 sm:col-span-2">
									<span class="shrink-0">{opt.label}</span>
									<select bind:value={opts[opt.key] as string} class="rounded border border-ink-200 px-2 py-1">
										{#each opt.choices ?? [] as c (c)}<option>{c}</option>{/each}
									</select>
								</label>
							{/if}
						{/each}
					</div>
				</fieldset>
			{/if}

			{#if result.kind === 'native'}
				<Code {code} label="Native embed code · paste into your page" />
				<p class="text-xs text-ink-500">
					This is {result.provider?.name}'s own embed code. It loads from {result.provider?.domain}, not from Iframely,
					and is free to use under {result.provider?.name}'s terms.
				</p>
			{:else}
				<div class="rounded-lg border border-brand-200 bg-brand-50 p-5">
					<p class="font-semibold text-ink-950">This embed is hosted by Iframely</p>
					<p class="mt-2 text-sm text-ink-700">
						{result.provider?.name ?? 'This site'} does not publish its own embed code, so Iframely builds and hosts
						one: it updates itself when the page changes, loads lazily, supports click-to-play and asks for consent
						where the law requires it.
					</p>
					<div class="mt-4 flex flex-wrap gap-2">
						<Button href="#signup" size="sm">Get this embed, free account</Button>
						<Button href="/embeds" variant="secondary" size="sm">How hosted embeds work</Button>
					</div>
					<p class="mt-3 text-xs text-ink-500">Free Starter plan: 2,000 hits a month. No code leaves this page without an account.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
