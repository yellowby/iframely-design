<script lang="ts">
	import Code from '#lib/components/Code.svelte';
	import Button from '#lib/components/Button.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';

	let helpful = $state<null | boolean>(null);

	const iframe = `<iframe
  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=43&end=90"
  title="YouTube video" allowfullscreen
  style="aspect-ratio:16/9;width:100%;border:0"></iframe>`;
</script>

<PageMeta
	title="How to start a YouTube embed at a specific time (and end it) | Iframely"
	description="Add ?start=SECONDS to the YouTube embed URL, and &end=SECONDS to stop. For a watch link, use &t=. Or set start and end in the free YouTube embed generator."
/>

<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<nav class="text-sm text-ink-500"><a href="/docs">Docs</a> / <a href="/docs#guides">Guides</a> / YouTube start and end time</nav>
	<h1 class="t-hero mt-3">How to start a YouTube embed at a specific time</h1>
	<p class="mt-1 text-sm text-ink-500">Last updated 2026-10-15 · 2 minute read</p>

	<div class="mt-6 rounded-lg border-l-4 border-brand-500 bg-brand-50 p-4 text-ink-800">
		<p><b>Short answer:</b> add <code>start</code> in seconds to the embed URL, for example <code>?start=43</code>. To stop the video, add <code>end</code>: <code>?start=43&amp;end=90</code>.</p>
		<p class="mt-2">For a link rather than an embed, use <code>t</code> on the watch URL: <code>youtube.com/watch?v=ID&amp;t=43s</code>.</p>
	</div>

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">The embed code</h2>
	<p class="mt-2 text-ink-700">Minutes become seconds: 1:15 is 75. <code>end</code> counts from the start of the video, not from <code>start</code>.</p>
	<Code code={iframe} label="HTML" class="mt-4" />

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">Or set it without editing code</h2>
	<p class="mt-2 text-ink-700">Paste the video link in the YouTube embed generator, set Start and End, and copy the code. Free, no sign-up.</p>
	<div class="mt-4"><Button href="/domains/youtube">Open the YouTube embed generator</Button></div>

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">If you use Iframely in your app</h2>
	<p class="mt-2 text-ink-700">
		Pass the link with <code>t</code> to the API and the embed starts there. To let your users pick start and end in the
		editor, use <a href="/docs/reference" class="text-brand-700">per-use options</a>.
	</p>

	<h2 class="mt-8 text-xl font-display tracking-[-0.02em]">Why it might not work</h2>
	<ul class="mt-2 list-disc space-y-1 pl-5 text-ink-700">
		<li>Shorts ignore <code>start</code>.</li>
		<li>Autoplay with sound is blocked by browsers: add <code>mute=1</code>.</li>
		<li>An Android WebView shows error 153: see <a href="/domains/youtube" class="text-brand-700">known YouTube problems</a>.</li>
	</ul>

	<div class="mt-10 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6 text-sm">
		{#if helpful === null}
			<span class="text-ink-600">Did this answer your question?</span>
			<button type="button" onclick={() => (helpful = true)} class="rounded-md px-3 py-1 ring-1 ring-ink-200">Yes</button>
			<button type="button" onclick={() => (helpful = false)} class="rounded-md px-3 py-1 ring-1 ring-ink-200">No</button>
		{:else}
			<span class="text-ink-600">Thanks for telling us.</span>
		{/if}
	</div>

	<div class="mt-8">
		<p class="text-sm font-semibold">Related</p>
		<ul class="mt-2 space-y-1 text-sm">
			<li><a href="/tools" class="text-brand-700">Make any iframe responsive</a></li>
			<li><a href="/domains/youtube" class="text-brand-700">YouTube embeds: privacy and consent</a></li>
			<li><a href="/try" class="text-brand-700">Embed code generator for any link</a></li>
		</ul>
	</div>
</article>
