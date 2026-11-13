<script lang="ts">
	import Badge from '#lib/components/Badge.svelte';
	import Code from '#lib/components/Code.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';

	const summary: [string, string][] = [
		['What changed', 'Meta\'s oEmbed for Instagram and Facebook stopped returning author_name, author_url and thumbnail fields.'],
		['Who is affected', 'Preview API and hosted embeds: handled by Iframely. Your own code calling Meta\'s oEmbed directly: affected.'],
		['Since', '3 November 2025'],
		['Action required', 'None if you use Iframely. If you call Meta\'s oEmbed yourself, stop reading thumbnail_url and fall back as below.']
	];

	const fallback = `const data = await iframely(url);           // or your own oEmbed call
const image = data.links?.thumbnail?.[0]?.href  // filled by Iframely where available
           ?? null;                          // render a text-only card, never a broken image`;
</script>

<PageMeta
	title="Instagram and Facebook oEmbed no longer return thumbnails or authors: what changed and how to keep images | Iframely"
	description="Since 3 November 2025 Meta's oEmbed drops author and thumbnail fields. What happened, how Iframely keeps images in previews, and what to do if you call oEmbed directly."
/>

<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<nav class="text-sm text-ink-500"><a href="/updates">Changelog and provider news</a> / Provider news</nav>
	<div class="mt-3 flex flex-wrap gap-2">
		<Badge tone="warn">Provider news</Badge><Badge>Instagram</Badge><Badge>Facebook</Badge><Badge tone="bad">action required</Badge>
	</div>
	<h1 class="t-hero mt-3">
		Instagram and Facebook oEmbed no longer return thumbnails or authors: what changed and how to keep images
	</h1>
	<p class="mt-2 text-sm text-ink-500">Published 2025-10-08 · Updated 2026-10-15 · By the Iframely team (author and role)</p>

	<dl class="mt-6 grid gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 sm:grid-cols-2">
		{#each summary as [k, v] (k)}
			<div class="bg-white p-4">
				<dt class="text-xs font-semibold tracking-wide text-ink-400 uppercase">{k}</dt>
				<dd class="mt-1 text-[15px] text-ink-800">{v}</dd>
			</div>
		{/each}
	</dl>

	<h2 class="mt-10 text-xl font-display tracking-[-0.02em]">What happened</h2>
	<p class="mt-2 text-ink-700">
		Meta announced that from 3 November 2025 its oEmbed Read endpoint would drop <code>author_name</code>,
		<code>author_url</code> and all <code>thumbnail_*</code> fields, and it did. The embed HTML still works; anything that
		built a preview card from those fields lost its image and byline.
	</p>

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">What we did</h2>
	<ul class="mt-2 list-disc space-y-1 pl-5 text-ink-700">
		<li>Iframely reads the image and author from the public page where Meta exposes them, and returns them in <code>links.thumbnail</code> and <code>meta.author</code> as before.</li>
		<li>Where the page has no usable image, the card renders text-only rather than with a broken image.</li>
		<li>Hosted embeds refresh signed image URLs before they expire.</li>
	</ul>

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">What you should do</h2>
	<p class="mt-2 text-ink-700">Using Iframely: nothing. Calling Meta's oEmbed yourself: stop relying on <code>thumbnail_url</code> and handle a missing image.</p>
	<Code code={fallback} label="JavaScript" class="mt-4" />

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">Updates</h2>
	<ol class="mt-2 space-y-3 border-l-2 border-ink-100 pl-4 text-[15px] text-ink-700">
		<li><b>2026-05-15</b> Meta: Instagram oEmbed can now be called without an access token. Our integration is unaffected.</li>
		<li><b>2025-11-03</b> Change in effect. Image coverage from page fallback: most public posts (figure to confirm).</li>
		<li><b>2025-10-08</b> First published.</li>
	</ol>

	<div class="mt-10 rounded-xl bg-ink-50 p-5">
		<p class="text-sm font-semibold">Related</p>
		<ul class="mt-2 grid gap-1 text-sm sm:grid-cols-2">
			<li><a href="/domains/instagram" class="text-brand-700">Instagram embeds: known problems</a></li>
			<li><a href="/domains/facebook" class="text-brand-700">Facebook embeds</a></li>
			<li><a href="/tools/url-debugger" class="text-brand-700">Check your embeds now in the URL debugger</a></li>
			<li><a href="/docs/reference" class="text-brand-700">Preview API: thumbnails</a></li>
		</ul>
	</div>

	<div class="mt-8 flex justify-between text-sm text-ink-600">
		<span>← Instagram profile embeds for everyone</span>
		<a href="/updates">All updates →</a>
	</div>
</article>
