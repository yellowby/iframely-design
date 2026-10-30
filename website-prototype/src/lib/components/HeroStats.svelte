<script lang="ts">
	// A quiet row of proof points: a thin line icon, the value on the first line, a grey label on the second.
	type Icon = 'gauge' | 'shield' | 'lock' | 'eu' | 'activity';
	// EU mark: the flag's ring of twelve, as dots (stars are unreadable at this size)
	const euRing = Array.from({ length: 12 }, (_, i) => {
		const a = (i * Math.PI) / 6;
		return [+(12 + 8.2 * Math.cos(a)).toFixed(2), +(12 + 8.2 * Math.sin(a)).toFixed(2)];
	});
	let {
		items = [
			{ icon: 'gauge', value: '99.99%', label: 'uptime' },
			{ icon: 'shield', value: 'SOC 2', label: 'Type II' },
			{ icon: 'lock', value: 'GDPR', label: 'compliant' },
			{ icon: 'activity', value: '6.5 billion', label: 'requests / mo' }
		],
		class: cls = ''
	}: { items?: { icon: Icon; value: string; label: string }[]; class?: string } = $props();
</script>

<ul class="flex flex-wrap items-center gap-x-8 gap-y-3 {cls}">
	{#each items as item (item.value)}
		<li class="flex items-center gap-2.5">
			<svg
				viewBox="0 0 24 24"
				class="size-6 shrink-0 text-ink-400"
				fill="none"
				stroke="currentColor"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				{#if item.icon === 'gauge'}
					<path d="m12 14 4-4" />
					<path d="M3.34 19a10 10 0 1 1 17.32 0" />
				{:else if item.icon === 'shield'}
					<path
						d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.3-2.7a1 1 0 0 1 1.4 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"
					/>
					<path d="m9 12 2 2 4-4" />
				{:else if item.icon === 'lock'}
					<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
					<path d="M7 11V7a5 5 0 0 1 10 0v4" />
				{:else if item.icon === 'eu'}
					<g fill="currentColor" stroke="none">
						{#each euRing as [cx, cy] (cx + ',' + cy)}<circle {cx} {cy} r="1.35" />{/each}
					</g>
				{:else}
					<path d="M2 12h4l3-8 4 16 3-8h6" />
				{/if}
			</svg>
			<p class="text-[13px] leading-snug">
				<span class="block font-medium text-ink-900">{item.value}</span>
				<span class="block text-ink-500">{item.label}</span>
			</p>
		</li>
	{/each}
</ul>
