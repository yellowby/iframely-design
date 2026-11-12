<script lang="ts">
	// Stand-in for graphics: the demo is copy-first, so every image is a labelled box.
	let { label, class: cls = 'aspect-video' }: { label: string; class?: string } = $props();
</script>

<div
	class="flex items-center justify-center rounded-lg border-2 border-dashed border-ink-200 bg-ink-100 p-4 text-center text-xs font-medium tracking-wide text-ink-400 uppercase {cls}"
>
	{label}
</div>
