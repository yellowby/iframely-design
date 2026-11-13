<script lang="ts">
	// A very light grey blueprint drawing, used as a ground under icons (BlueprintCards) and product scenes (DevCover).
	// Four patterns, picked by n % 4: drawing grid, target, section hatch, construction arcs. Drawn on a 144 square;
	// it covers whatever box it is given (cropping the overflow), and the lines stay 1px at any scale.
	let { n = 0, class: cls = '' }: { n?: number; class?: string } = $props();
</script>

<svg class="blueprint text-black/[0.1] {cls}" viewBox="0 0 144 144" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
	{#if n % 4 === 0}
		<!-- drawing grid: fine squares, heavier lines every fourth, registration crosses -->
		<path d="M0 18.5H144M0 36.5H144M0 54.5H144M0 90.5H144M0 108.5H144M0 126.5H144M18.5 0V144M36.5 0V144M54.5 0V144M90.5 0V144M108.5 0V144M126.5 0V144" stroke-opacity=".55" />
		<path d="M0 72.5H144M72.5 0V144" />
		<path d="M32.5 36.5H40.5M36.5 32.5V40.5M104.5 36.5H112.5M108.5 32.5V40.5M32.5 108.5H40.5M36.5 104.5V112.5M104.5 108.5H112.5M108.5 104.5V112.5" stroke-width="1.5" />
	{:else if n % 4 === 1}
		<!-- target: concentric circles on centre lines, with degree ticks -->
		<circle cx="72" cy="72" r="26" /><circle cx="72" cy="72" r="44" stroke-dasharray="2 4" /><circle cx="72" cy="72" r="62" /><circle cx="72" cy="72" r="84" stroke-opacity=".55" />
		<path d="M0 72.5H144M72.5 0V144" stroke-dasharray="10 3 2 3" stroke-opacity=".8" />
		<path d="M25.3 25.3L31 31M118.7 25.3L113 31M25.3 118.7L31 113M118.7 118.7L113 113" stroke-width="1.5" />
	{:else if n % 4 === 2}
		<!-- section hatch: 45° lines, a part outline and a dimension line -->
		<path d="M-12 36L36 -12M-12 60L60 -12M-12 84L84 -12M-12 108L108 -12M-12 132L132 -12M-12 156L156 -12M12 156L156 12M36 156L156 36M60 156L156 60M84 156L156 84M108 156L156 108" stroke-opacity=".55" />
		<path d="M28.5 28.5H115.5V101.5H28.5Z" />
		<path d="M28.5 108V124M115.5 108V124M28.5 118.5H115.5M33 115L28.5 118.5L33 122M111 115L115.5 118.5L111 122" stroke-width="1.2" />
	{:else}
		<!-- construction: arcs swung from the lower-left corner over ruled lines and radial guides -->
		<path d="M0 24.5H144M0 48.5H144M0 96.5H144M0 120.5H144" stroke-opacity=".55" />
		<circle cx="0" cy="144" r="48" /><circle cx="0" cy="144" r="84" /><circle cx="0" cy="144" r="120" stroke-dasharray="2 4" /><circle cx="0" cy="144" r="156" />
		<path d="M0 144L144 105.4M0 144L144 60.9M0 144L144 0M0 144L83.1 0M0 144L38.6 0" stroke-opacity=".7" />
	{/if}
</svg>

<style>
	.blueprint :global(*) {
		vector-effect: non-scaling-stroke;
	}
</style>
