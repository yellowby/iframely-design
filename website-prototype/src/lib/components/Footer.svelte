<script lang="ts">
	import { footer } from '#lib/data/nav.ts';

	// Footer after G25 in the motion lab (Page content, "the logo as the floor"), in the site's own type and colours: the
	// logo, blurb and badges on the left, five link columns (Products, Free tools, Developers, Company, Legal; G25 has no
	// Solutions column) and the copyright row. G25's giant logo cut by the bottom edge is left out.
	// On the page ground with a hairline on top; text in the Small role, greys from the theme, blue only on the //.
	const COLS = ['Products', 'Free tools', 'Developers', 'Company', 'Legal'];
	const cols = COLS.map((label) => footer.find((c) => c.label === label)!);
	const BADGES = ['SOC 2 Type II', 'GDPR', '99.99% uptime'];
</script>

<footer class="overflow-hidden bg-page text-fg">
	<div class="wrap grid grid-cols-2 gap-x-8 gap-y-10 pt-18 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))]">
		<div class="col-span-full lg:col-span-1">
			<a href="/" class="logo" aria-label="Iframely"><b>//</b>iframely</a>
			<p class="t-small mt-4 max-w-[30ch] text-body">Holding the web together since 2012.</p>
			<ul class="mt-4 flex flex-wrap gap-1.5">
				{#each BADGES as badge (badge)}
					<li class="rounded-[5px] px-2 py-1 text-[12px] leading-[1.3] text-mute ring-1 ring-black/10 ring-inset">{badge}</li>
				{/each}
			</ul>
		</div>

		{#each cols as col (col.label)}
			<nav aria-label={col.label}>
				<p class="t-small font-medium! text-fg">{col.label}</p>
				<ul class="mt-3.5 grid gap-2">
					{#each col.items as item (item.label)}
						<li><a href={item.href} class="t-small leading-[1.4]! text-body underline-offset-2 hover:text-black hover:underline">{item.label}</a></li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>

	<div class="wrap mt-12">
		<div class="flex flex-wrap justify-between gap-x-6 gap-y-1 py-5 text-[13px] leading-[1.5] text-mute">
			<p>© 2012–2026 Itteco Software Corp. Ottawa, Canada.</p>
		</div>
	</div>
</footer>

<style>
	/* //iframely as in the header: JetBrains Mono 20, the slashes ExtraBold in Iframely blue, the word Bold */
	.logo {
		font: 700 20px/26px 'JetBrains Mono', ui-monospace, monospace;
		color: #000;
	}
	.logo b {
		font-weight: 800;
		color: var(--color-blue);
	}
</style>
