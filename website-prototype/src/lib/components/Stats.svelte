<script lang="ts">
	let { items, dark = false }: { items: { value: string; label: string }[]; dark?: boolean } = $props();
</script>

<dl class="grid grid-cols-2 gap-6 md:grid-cols-4">
	{#each items as s (s.label)}
		<div>
			<dt class="text-sm {dark ? 'text-ink-400' : 'text-ink-500'}">{s.label}</dt>
			<dd class="mt-1 text-3xl font-semibold tracking-tight {dark ? 'text-white' : 'text-ink-950'}">{s.value}</dd>
		</div>
	{/each}
</dl>
