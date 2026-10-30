<script lang="ts">
	import Code from './Code.svelte';

	// Code samples in language tabs (curl / Node / Python and similar).
	let { tabs }: { tabs: { label: string; code: string }[] } = $props();
	let active = $state(0);
</script>

<div class="min-w-0">
	<div class="flex flex-wrap gap-1 text-sm" role="tablist">
		{#each tabs as t, i (t.label)}
			<button
				type="button"
				role="tab"
				aria-selected={active === i}
				onclick={() => (active = i)}
				class="rounded-t-md px-3 py-1.5 {active === i ? 'bg-ink-950 text-white' : 'text-ink-500 hover:text-ink-900'}"
				>{t.label}</button
			>
		{/each}
	</div>
	<Code code={tabs[active].code} label={tabs[active].label} class="rounded-tl-none" />
</div>
