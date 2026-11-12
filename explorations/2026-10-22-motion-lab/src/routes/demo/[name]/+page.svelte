<script lang="ts">
	import { page } from '$app/state';
	import PickButton from '#lib/PickButton.svelte';
	import { allEntries, entry, frameGroup } from '#lib/lab.ts';

	// Full screen, one demo at a time (the old demo.html): back to its card, previous / next through every demo, the pick.
	const all = allEntries();
	const name = $derived(page.params.name ?? '');
	const e = $derived(entry(name) ?? all[0]);
	const i = $derived(all.indexOf(e));
	const prev = $derived(all[(i - 1 + all.length) % all.length]);
	const next = $derived(all[(i + 1) % all.length]);
	let frame = $state<HTMLDivElement>();

	$effect(() => {
		if (!frame) return;
		document.title = e.d.title + ' · Iframely Motion Lab';
		const un = window.DEMOS.mount(frame, e.d.name);
		return () => un();
	});
	const back = (ev: KeyboardEvent) => {
		if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return;
		if (ev.key === 'ArrowLeft' && ev.altKey) location.href = `/demo/${prev.d.name}`;
		if (ev.key === 'ArrowRight' && ev.altKey) location.href = `/demo/${next.d.name}`;
	};
</script>

<svelte:window onkeydown={back} />

<div class="full">
	<nav class="nav">
		<a href={`/${e.page.id}#${e.d.name}`}>← {e.page.title}</a>
		<a href={`/demo/${prev.d.name}`} title="previous (Alt ←)">‹</a>
		<span><code>{e.code}</code> {e.d.title}</span>
		<a href={`/demo/${next.d.name}`} title="next (Alt →)">›</a>
		<PickButton name={e.d.name} />
	</nav>
	{#key e.d.name}
		<div class="frame g-{frameGroup(e)}" bind:this={frame}></div>
	{/key}
</div>

<style>
	:global(body) { overflow-x: hidden; }
	.nav { position: fixed; top: 12px; left: 12px; z-index: 9; display: flex; gap: 6px; align-items: center; font: 12px var(--mono); }
	.nav a, .nav span { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 7px; background: rgba(255, 253, 249, .85); border: 1px solid var(--line); color: var(--ink); text-decoration: none; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
	.nav a:hover { border-color: var(--ink3); }
	.nav code { color: var(--accent); }
	.frame { position: relative; height: 100vh; height: 100svh; container-type: inline-size; }
	.frame.g-pd { height: auto; min-height: 100svh; display: flex; align-items: center; padding: 60px max(16px, env(safe-area-inset-right, 0px)) 60px max(16px, env(safe-area-inset-left, 0px)); }
	.frame.g-pd :global(.demo) { width: 100%; max-width: 1200px; margin: 0 auto; }
	.frame.g-ill, .frame.g-wm, .frame.g-dt, .frame.g-dta, .frame.g-dts, .frame.g-dtx, .frame.g-cv, .frame.g-pg, .frame.g-pdw, .frame.g-sec, .frame.g-pal { height: auto; min-height: 100svh; padding: 60px max(16px, env(safe-area-inset-right, 0px)) 40px; background: #fff; }
	.frame.g-sec, .frame.g-pal { padding: 0; }
	.frame.g-cv, .frame.g-pg { background: #fafafa; }
	.frame.g-ill :global(.demo), .frame.g-wm :global(.demo), .frame.g-dt :global(.demo), .frame.g-dta :global(.demo), .frame.g-dts :global(.demo), .frame.g-dtx :global(.demo), .frame.g-cv :global(.demo), .frame.g-pg :global(.demo), .frame.g-pdw :global(.demo), .frame.g-sec :global(.demo), .frame.g-pal :global(.demo) { max-width: 1200px; margin: 0 auto; }
	.frame.g-pd, .frame.g-pdp, .frame.g-pdw, .frame.g-sec, .frame.g-pal { overflow-x: auto; }
	.frame.g-pd :global(.demo), .frame.g-pdp :global(.demo), .frame.g-pdw :global(.demo), .frame.g-sec :global(.demo), .frame.g-pal :global(.demo) { min-width: 1200px; }
</style>
