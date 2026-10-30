<script lang="ts">
	import { footer } from '#lib/data/nav.ts';
	import Logo from './Logo.svelte';
</script>

<footer class="border-t border-ink-200 bg-ink-50">
	<div class="wrap py-14">
		<div class="grid gap-10 md:grid-cols-[1.3fr_repeat(5,1fr)]">
			<div>
				<Logo />
				<p class="mt-3 text-sm text-ink-600">
					Iframely connects products and publishers through rich media, previews and URL data.
				</p>
				<p class="mt-2 text-sm text-ink-400">Holding the web together since 2012.</p>
				<div class="mt-4 flex flex-wrap gap-2 text-xs text-ink-500">
					<span class="rounded border border-ink-200 px-2 py-1">SOC 2 Type II</span>
					<span class="rounded border border-ink-200 px-2 py-1">GDPR</span>
					<span class="rounded border border-ink-200 px-2 py-1">99.99% uptime</span>
				</div>
			</div>
			{#each footer as col (col.label)}
				<div>
					<p class="text-sm font-semibold text-ink-950">{col.label}</p>
					<ul class="mt-3 space-y-2 text-sm">
						{#each col.items as item (item.label)}
							<li><a href={item.href} class="text-ink-600 hover:text-ink-950">{item.label}</a></li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
		<div
			class="mt-10 flex flex-wrap justify-between gap-4 border-t border-ink-200 pt-6 text-xs text-ink-500"
		>
			<p>© 2012–2026 Itteco Software Corp. Ottawa, Canada.</p>
			<p>
				Every page is also available as Markdown: <a href="#llms" class="underline">llms.txt</a> ·
				<a href="#pricing-md" class="underline">pricing.md</a> · <a href="#openapi" class="underline">OpenAPI</a>
			</p>
		</div>
	</div>
</footer>
