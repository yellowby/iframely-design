<script lang="ts">
	// Simple data table; cells may contain inline HTML. First column is emphasised.
	let { head, rows, caption }: { head: string[]; rows: string[][]; caption?: string } = $props();
</script>

<div class="overflow-x-auto rounded-lg border border-ink-100 bg-white">
	<table class="w-full min-w-[36rem] text-left text-sm">
		{#if caption}<caption class="px-4 pt-3 text-left text-xs text-ink-500">{caption}</caption>{/if}
		<thead class="border-b border-ink-100 bg-ink-50 text-ink-600">
			<tr>
				{#each head as h, i (i)}<th class="px-4 py-2.5 font-medium">{h}</th>{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-ink-100">
			{#each rows as row, i (i)}
				<tr class="align-top">
					{#each row as cell, j (j)}
						<td class="prose-links px-4 py-3 {j === 0 ? 'font-medium text-ink-950' : 'text-ink-700'}">{@html cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
