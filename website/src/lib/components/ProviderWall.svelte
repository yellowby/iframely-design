<script lang="ts">
	// The provider wall on /embeds: our take on iframely.com's "Rich media people like and share" block (three marquee
	// rows of logo tiles in a grey panel). Here the rows are sorted by kind of media, and each carries its kinds as
	// words between the logos, so the wall reads as the copy does: video, music, social posts, documents, design files…
	// The rows run edge to edge of the container, fade at both ends, drift in alternating directions and stop on hover.
	// Logos: the live site's set (publicly, src/lib/ui-covers/domains/assets), copied to lib/assets/providers.
	const SRC = import.meta.glob('../assets/providers/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`];

	// a row: kinds of media (the words) and providers [file, name]; a word goes in after every few logos
	type Row = { kinds: string[]; items: [string, string][] };
	const ROWS: Row[] = [
		{
			kinds: ['video', 'music', 'podcasts'],
			items: [['youtube', 'YouTube'], ['spotify', 'Spotify'], ['tiktok', 'TikTok'], ['apple-music', 'Apple Music'], ['loom', 'Loom'], ['bandcamp', 'Bandcamp'], ['mixcloud', 'Mixcloud'], ['giphy', 'Giphy'], ['genius', 'Genius'], ['bandsintown', 'Bandsintown']]
		},
		{
			kinds: ['social posts', 'documents', 'slides'],
			items: [['x', 'X'], ['instagram', 'Instagram'], ['notion', 'Notion'], ['facebook', 'Facebook'], ['reddit', 'Reddit'], ['coda', 'Coda'], ['pinterest', 'Pinterest'], ['airtable', 'Airtable'], ['issuu', 'Issuu'], ['google-calendar', 'Google Calendar']]
		},
		{
			kinds: ['design files', 'maps', 'forms', 'code'],
			items: [['figma', 'Figma'], ['canva', 'Canva'], ['google-maps', 'Google Maps'], ['miro', 'Miro'], ['calendly', 'Calendly'], ['github', 'GitHub'], ['lucid', 'Lucid'], ['gumroad', 'Gumroad'], ['kickstarter', 'Kickstarter'], ['monday', 'Monday']]
		}
	];
	// the row as it runs: a word, then its share of the logos, and so on
	type Cell = { kind: string } | { id: string; name: string };
	const cells = (r: Row): Cell[] => {
		const per = Math.ceil(r.items.length / r.kinds.length);
		return r.kinds.flatMap((kind, k) => [{ kind }, ...r.items.slice(k * per, (k + 1) * per).map(([id, name]) => ({ id, name }))]);
	};
</script>

<div class="wall space-y-3" aria-label="Some of the 1,900 providers">
	{#each ROWS as row, r (r)}
		<div class="row flex overflow-hidden">
			<!-- two copies of the row side by side; the track moves by one copy's width, so the loop has no seam -->
			{#each [0, 1] as copy (copy)}
				<div class="track flex shrink-0 gap-3 pr-3" class:back={r % 2 === 1} aria-hidden={copy === 1}>
					{#each cells(row) as c ('kind' in c ? c.kind : c.id)}
						{#if 'kind' in c}
							<span class="t-tag grid h-[72px] shrink-0 place-items-center rounded-xl px-5 text-rich ring-1 ring-rich/25 ring-inset">{c.kind}</span>
						{:else}
							<span class="grid size-[72px] shrink-0 place-items-center rounded-xl bg-white ring-1 ring-black/8 ring-inset" title={c.name}>
								<img src={logo(c.id)} alt={copy ? '' : c.name} width="32" height="32" loading="lazy" />
							</span>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.wall {
		/* fade both ends into the page */
		mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
	}
	.track {
		animation: run 70s linear infinite;
	}
	.track.back {
		animation-direction: reverse;
	}
	.wall:hover .track {
		animation-play-state: paused;
	}
	@keyframes run {
		to {
			transform: translateX(-100%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
	}
</style>
