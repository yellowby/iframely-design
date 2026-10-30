<script lang="ts">
	let { code, label, class: cls = '' }: { code: string; label?: string; class?: string } = $props();
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// clipboard unavailable
		}
	}
</script>

<div class="overflow-hidden rounded-lg bg-ink-950 text-ink-100 ring-1 ring-ink-800 {cls}">
	<div class="flex items-center justify-between border-b border-ink-800 px-3 py-1.5 text-xs text-ink-400">
		<span>{label ?? ''}</span>
		<button type="button" onclick={copy} class="rounded px-2 py-0.5 hover:bg-ink-800 hover:text-white">
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>
	<pre class="max-h-[32rem] overflow-auto p-4 text-[13px] leading-relaxed"><code>{code}</code></pre>
</div>
