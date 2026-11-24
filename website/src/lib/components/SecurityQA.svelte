<script lang="ts">
	// The "For security teams" block on /embeds as a security questionnaire already filled in, not four
	// cards: on the left the questions a security team sends a vendor, each with its answer under it, all four open at
	// once and straight on the page; on the right, on grey paper, the evidence for the question pointed at.
	// (/embeds-3 has this block as a bento of four cards.)
	//   Q1, Q2: the two working scenes of components/SecurityDemo.svelte (the iframe, the consent question).
	//   Q3:     the page's Content-Security-Policy as a diff: every provider's domain struck out, one line put in.
	//           A before/after switch over it: the list as it stood, the diff, the diff with your own domain (Enterprise).
	//   Q4:     "Security and compliance": the AICPA's SOC badge with the report's name, then, under a hairline, links
	//           to Security, Trust center and GDPR.
	// DRAFT wording: the questions are new, the answers are the cards' texts. The policy's domains are illustrative.
	// Pressing a question shows its evidence (pointing at it does not); left alone, the questions take turns.
	import { onMount } from 'svelte';
	import SecurityDemo from './SecurityDemo.svelte';
	import aicpa from '../assets/security/aicpa-soc.png';

	// question, the answer's first word(s), the rest of the answer
	const QA = [
		['Does third-party code run on our page?', 'No.', 'Every embed runs in our iframe, apart from your page and its code.'],
		['Does anything load before the reader consents?', 'No.', 'Readers give their consent before any third-party cookie loads.'],
		['Which domains do we have to allow?', 'One.', 'Ours, or your own: we can serve everything from your CDN.'],
		['Who audits you?', 'An independent auditor.', 'Iframely is SOC 2 Type II audited.']
	];
	// The questions take turns: the blue rule at the left of the one shown fills from the top in TURN seconds, then the
	// next one is shown, round and round. It stands still while the pointer is over the block, while the keyboard's
	// focus is in it and while the block is out of view, and starts again after a click in the scene. With reduced
	// motion nothing takes turns.
	const TURN = 9;
	let on = $state(0);
	let run = $state(0); // goes up to start the rule again
	let box: HTMLDivElement;
	let seen = $state(false);
	onMount(() => {
		const io = new IntersectionObserver((es) => (seen = es[0].isIntersecting), { threshold: 0.35 });
		io.observe(box);
		return () => io.disconnect();
	});
	const pick = (i: number) => {
		if (i === on) return;
		on = i;
		run++;
	};
	// How the scenes change places (since 2026-11-24): the window and its tabs stand still, and only what is in the
	// window changes, through white: the old scene's fades out in OUT ms, then the new one's fades in (0.2s, the
	// styles below). So the paper shows `shown`, which follows `on` after the fade out. The tabs do not fade: to and
	// from Q4, which has one tab of its own, they change at once, with the scene. (For some hours they faded then.)
	// (Before: the old scene was gone at once and the new one's tabs and window came in together, fading and rising
	// 6px in 0.35s; the paper was bare for a moment at every turn.)
	const OUT = 120;
	let shown = $state(0);
	let out = $state(false);
	$effect(() => {
		if (on === shown) {
			out = false;
			return;
		}
		const next = on;
		const swap = () => {
			shown = next;
			out = false;
		};
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
		out = true;
		const t = setTimeout(swap, OUT);
		return () => clearTimeout(t);
	});
	// Q3: the policy before Iframely, after, and after with your own domain (Enterprise)
	let csp = $state<'before' | 'after'>('after');
	let own = $state(false);
	// Q4: where to read more (the live site's pages): name, address, the icon's path (16px box, thin line): a shield,
	// a ticked circle, a ring of dots
	const DOCS = [
		['Security', 'https://iframely.com/security', 'M8 1.75 13 3.6v3.9c0 3.1-1.9 5.4-5 6.75-3.1-1.35-5-3.65-5-6.75V3.6L8 1.75Z'],
		['Trust center', 'https://trust.iframely.com/', 'M5.4 8.2l1.8 1.8 3.4-3.7M14.25 8A6.25 6.25 0 1 1 1.75 8a6.25 6.25 0 0 1 12.5 0Z'],
		// (no path: a ring of twelve dots, after the EU's flag, drawn in the markup)
		['GDPR', 'https://iframely.com/legal/gdpr', '']
	];
	const GONE = ['*.youtube.com *.vimeo.com', '*.x.com *.instagram.com', '*.tiktok.com *.spotify.com'];
</script>

<div bind:this={box} class="box grid gap-x-16 gap-y-8 lg:grid-cols-2" class:idle={!seen} style="--turn:{TURN}s">
	<!-- both sides start at the top: the first question's line is level with the tabs in the paper (its middle on
	     theirs), not with the paper's edge -->
	<ol class="self-start lg:mt-2">
		{#each QA as [q, lead, rest], i (q)}
			<li>
				<button type="button" class="q" class:on={i === on} aria-pressed={i === on} onclick={() => pick(i)}>
					{#if i === on}
						{#key run}<span class="rule" aria-hidden="true"><span onanimationend={() => ((on = (on + 1) % QA.length), run++)}></span></span>{/key}
					{/if}
					<span class="n">Q{i + 1}</span>
					<span class="block text-[18px] leading-[1.35] font-medium text-fg">{q}</span>
					<span class="t-small mt-1.5 block text-[15px]! text-pretty text-mute"><span class="text-fg">{lead}</span> {rest}</span>
				</button>
			</li>
		{/each}
	</ol>

	<!-- The paper: one height for every scene (the tallest scene's, Q1's), from the top. It reaches 24px (its padding)
	     to the left of its column, so the window in it starts where the section's intro text starts, above. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scene self-start lg:-ml-6 lg:h-[392px]" class:out onclick={() => run++}>
		{#if shown < 2}
			{#key shown}<SecurityDemo scene={shown === 0 ? 'frame' : 'consent'} top />{/key}
		{:else}
			<!-- the window fills the paper under the switch's row, as SecurityDemo's: the same size in every scene -->
			<div class="flex h-full flex-col rounded-md bg-[#f4f4f5] p-4 sm:p-6">
				{#if shown === 2}
					<!-- the with/without tabs, as Q1's (SecurityDemo) -->
					<div class="seg" role="group" aria-label="The page's policy, without and with Iframely">
						<button type="button" aria-pressed={csp === 'after'} onclick={() => (csp = 'after')}>With Iframely</button>
						<button type="button" aria-pressed={csp === 'before'} onclick={() => (csp = 'before')}>Without</button>
					</div>
					<div class="win flex w-full grow flex-col overflow-hidden rounded-md rounded-tl-none bg-white">
						<!-- (in a span: what is in a bar fades with its scene, the bar itself and its hairline do not) -->
						<div class="bar"><span>Content-Security-Policy</span></div>
						<!-- before: the list as it stands. After: the list struck out and the one line put in. -->
						<pre class="policy" class:before={csp === 'before'} aria-label="Before, a rule for every provider; after, one rule"><span class="text-fg">frame-src 'self'</span>
{#each GONE as g (g)}<span class="del">{csp === 'before' ? '+' : '−'}   <s>{g}</s></span>
{/each}<span class="del">{csp === 'before' ? '+' : '−'}   <s>… 1,900 more{csp === 'before' ? ';' : ''}</s></span>
<span class="add">+   {own ? 'media.your-app.com' : 'iframely.net'};</span></pre>
						<!-- with Iframely only: a switch at the window's foot puts your own domain in the one line -->
						{#if csp === 'after'}
							<label class="own">
								<button type="button" role="switch" aria-checked={own} aria-label="Serve from your own domain" class="sw" onclick={() => (own = !own)}><span></span></button>
								<span class="font-mono text-[12px] leading-none text-fg">Serve from your own domain</span>
								<!-- the plan, as a badge: the section tag's chip -->
								<span class="ml-auto rounded-sm bg-rich/10 px-1.5 py-1 font-mono text-[11px] leading-none text-rich">Enterprise</span>
							</label>
						{/if}
					</div>
				{:else}
					<!-- no switch here: the window's name stands on it as the one tab, in the others' place, and the window
					     has no bar -->
					<div class="seg"><p class="solo">Security and compliance</p></div>
					<div class="win flex w-full grow flex-col overflow-hidden rounded-md rounded-tl-none bg-white">
					<!-- Two parts with a hairline between them: the attestation, then where to read more.
					     The AICPA's SOC badge and the auditor's mark are both cut from the banner of the live site's
					     announcement (iframely.com/updates/409200-…); the badge is cut round by its own edge. -->
					<!-- one group in the middle of the window, no foot: the badge, the report's name, and the links as pills -->
					<!-- the bar: the report as the added line (blue, with a plus), and its state as a badge like Q3's Enterprise -->
					<div class="bar">
						<span class="text-rich">+ SOC 2 Type II</span><span
							class="ml-auto rounded-sm bg-rich/10 px-1.5 py-1 font-mono text-[11px] leading-none text-rich">independently audited</span
						>
					</div>
					<!-- the body as the other scenes': a grey inset. The badge is a seal in the middle of it, on a white disc,
					     with faint blue rings going out from it to the inset's edges; the links are white pills at its foot. -->
					<div class="flex grow p-4">
					<div class="stage">
						<!-- one card, drawn like the post in Q2: the badge, and beside it the three places to read more -->
						<div class="flex w-[min(320px,88%)] items-center gap-5 rounded-sm bg-white p-4 ring-1 ring-black/10">
							<img src={aicpa} alt="AICPA SOC" width="90" height="90" class="size-[90px] shrink-0 rounded-full" />
						<p class="docs">
							{#each DOCS as [label, href, d] (label)}
								<a {href}><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">{#if d}<path {d} stroke="var(--color-rich)" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round" />{:else}{#each Array(12) as _, k (k)}<circle cx={8 + 5.9 * Math.sin((k * Math.PI) / 6)} cy={8 - 5.9 * Math.cos((k * Math.PI) / 6)} r="0.95" fill="var(--color-rich)" />{/each}{/if}</svg>{label}<svg class="go" width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.99988 3.99995L19.9998 3.99996L19.9999 16M19.5 4.5L4.99991 18.9999" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" /></svg></a>
							{/each}
						</p>
						</div>
					</div>
					</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* a question with its answer: the whole of it is the switch. The one shown has a blue rule at its left and a blue
	   number. */
	.q {
		position: relative;
		display: block;
		width: 100%;
		padding: 18px 0 18px 56px;
		text-align: left;
		cursor: pointer;
	}
	/* Pointing at a question that is not the one shown: a light grey bar at its left edge, where its blue rule would
	   be; as long as the rule, and as thin (as block 02's items, components/CustomizeList.svelte) */
	.q::after {
		content: '';
		position: absolute;
		top: 14px;
		bottom: 14px;
		left: 0;
		width: 2px;
		background: rgb(0 0 0 / 0.07);
		opacity: 0;
		transition: opacity 0.15s;
	}
	@media (hover: hover) {
		.q:not(.on):hover::after {
			opacity: 1;
		}
	}
	/* the rule: a faint blue track, filling with blue from the top while the question has its turn */
	.rule {
		position: absolute;
		top: 14px;
		bottom: 14px;
		left: 0;
		width: 2px;
		background: color-mix(in srgb, var(--color-rich) 20%, transparent);
	}
	.rule span {
		display: block;
		height: 100%;
		background: var(--color-rich);
		transform-origin: top;
		animation: fill var(--turn) linear forwards;
	}
	@keyframes fill {
		from {
			transform: scaleY(0);
		}
	}
	.box.idle .rule span,
	.box:has(:focus-visible) .rule span {
		animation-play-state: paused;
	}
	@media (hover: hover) {
		.box:hover .rule span {
			animation-play-state: paused;
		}
	}
	/* A scene's change (see `shown`): what is in the window fades out, then the next scene's fades in; the window, the
	   tabs and the paper stand still. The tabs never fade: Q4's one tab and the others' two change places at once.
	   The rules reach into components/SecurityDemo.svelte, Q1's and Q2's scenes. */
	/* (The window's bar stands still too, with its hairline: what is in the bar fades, and what is under the bar,
	   as in block 02. At first the bar faded whole with the rest.) */
	.scene :global(.win > .bar > *),
	.scene :global(.win > :not(.bar)) {
		animation: scene-in 0.2s ease-out;
	}
	.scene.out :global(.win > .bar > *),
	.scene.out :global(.win > :not(.bar)) {
		opacity: 0;
		transition: opacity 0.12s ease-in;
	}
	@keyframes scene-in {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rule span,
		.scene :global(.win > .bar > *),
		.scene :global(.win > :not(.bar)) {
			animation: none;
			transition: none;
		}
	}
	.q:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
		border-radius: 4px;
	}
	.n {
		position: absolute;
		top: 24px;
		left: 20px;
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
	}
	.q.on .n {
		color: var(--color-rich);
	}
	/* the window of Q3, as SecurityDemo's */
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		align-items: center;
		height: 36px;
		padding: 0 16px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
	}
	.policy {
		margin: 0;
		padding: 16px;
		overflow: hidden;
		font:
			12px/1.9 var(--ff-mono),
			ui-monospace,
			monospace;
	}
	.policy .del {
		color: var(--color-mute);
	}
	/* Q4's body: a grey inset, as the player's and the post's in the other scenes */
	.stage {
		position: relative;
		display: grid;
		flex-grow: 1;
		place-items: center;
		overflow: hidden;
		border-radius: 4px;
		background: rgb(0 0 0 / 0.05);
	}
	/* Q4: where to read more, three links as outlined pills under the report's name */
	.docs {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}
	.docs a {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 30px; /* three rows, 90px: the badge's height, so the card's padding is the same on every side of it */
		font-size: 13px;
		line-height: 1;
		font-weight: 500;
		color: var(--color-fg);
		transition: color 0.15s;
	}
	.docs a + a {
		border-top: 1px solid rgb(0 0 0 / 0.07);
	}
	.docs .go {
		margin-left: auto;
		color: rgb(0 0 0 / 0.35);
		transition: color 0.15s;
	}
	.docs a:hover,
	.docs a:hover .go {
		color: var(--color-rich);
	}
	/* the foot of the policy's window: a switch, its name, and the plan it comes with */
	.own {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: auto;
		padding: 14px 16px;
		border-top: 1px solid rgb(0 0 0 / 0.07);
		cursor: pointer;
	}
	.sw {
		flex-shrink: 0;
		width: 30px;
		height: 18px;
		padding: 2px;
		border-radius: 999px;
		background: rgb(0 0 0 / 0.16);
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.sw span {
		display: block;
		width: 14px;
		height: 14px;
		border-radius: 999px;
		background: #fff;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
		transition: transform 0.15s;
	}
	.sw[aria-checked='true'] {
		background: var(--color-rich);
	}
	.sw[aria-checked='true'] span {
		transform: translateX(12px);
	}
	.sw:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	/* without Iframely: every source is a line you add yourself, "+" in the tabs' magenta; the one line of the other
	   tab keeps its place, unseen */
	.policy.before .del {
		color: var(--color-pub);
	}
	.policy.before .del s {
		text-decoration: none;
	}
	.policy.before .add {
		visibility: hidden;
	}
	.policy .add {
		display: block;
		margin: 0 -16px;
		padding: 0 16px;
		background: color-mix(in srgb, var(--color-rich) 10%, transparent);
		color: var(--color-rich);
	}
	/* the before/after switch (also in SecurityDemo.svelte) */
	.seg {
		display: flex;
		position: relative;
		z-index: 1;
		gap: 4px;
		/* no room over the tabs: the paper's padding is the same on all four sides. The first tab starts at the
		   window's left edge (the window's corner there is square). */
		height: 28px;
	}
	/* a tab standing on the window: the chosen one is white and one piece with the window, the others faint grey */
	.seg button {
		position: relative;
		height: 28px;
		padding: 0 12px;
		border-radius: 6px 6px 0 0;
		background: rgb(0 0 0 / 0.04);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
		color: var(--color-mute);
		cursor: pointer;
		transition:
			color 0.15s,
			background-color 0.15s;
	}
	.seg button:not([aria-pressed='true']):hover {
		background: rgb(0 0 0 / 0.08);
	}
	.seg button[aria-pressed='true'] {
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
	}
	/* Q4's one tab: the chosen tab's shape and its black, and not a button */
	.seg .solo {
		position: relative;
		display: flex;
		align-items: center;
		height: 28px;
		padding: 0 12px;
		border-radius: 6px 6px 0 0;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
	}
	/* (no line between the chosen tab and the window) */
	.seg .solo::after,
	.seg button[aria-pressed='true']::after {
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		height: 2px;
		background: #fff;
		content: '';
	}
	.seg button:hover {
		color: var(--color-fg);
	}
	/* the chosen part: in black, as Q4's one tab (it was blue for Iframely's and red for the one without, and the
	   tabs were worded "+ with Iframely", "− without Iframely"; see components/SecurityDemo.svelte) */
	.seg button[aria-pressed='true'] {
		color: var(--color-fg);
	}
	.seg button:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 1px;
	}
</style>
