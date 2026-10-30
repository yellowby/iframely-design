<script lang="ts">
	// FAQ list; answers may contain inline HTML links.
	let { items }: { items: { q: string; a: string }[] } = $props();
</script>

<div class="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
	{#each items as item (item.q)}
		<details class="group p-5">
			<summary class="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-ink-900">
				{item.q}
				<span class="mt-0.5 text-ink-400 transition group-open:rotate-45">+</span>
			</summary>
			<p class="prose-links mt-3 text-ink-600">{@html item.a}</p>
		</details>
	{/each}
</div>
