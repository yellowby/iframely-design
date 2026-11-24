<script lang="ts">
	// The scenes of the "For editors and apps" block on /embeds-2 (components/CustomizeSheet.svelte picks which one is
	// shown): a window on a sheet of squared paper with the thing itself on top and the switches that change it under
	// it, and it does change as they are pressed.
	//   0 options: an editor's options for one link: where it starts, captions, the theme. They go into the link's
	//              query string, shown in the window's bar.
	//   1 api:     three players from three providers answering the same player.js calls: play, mute.
	//   2 brand:   an app's settings for every player: its own play button, no "Powered by", its own domain.
	//   3 tuned:   one provider's post adjusted on request by our team: no caption, rounder corners, the app's colour.
	// Each scene keeps its state while another is shown. The query parameter names are illustrative.
	// plain (/embeds-3): the paper is one flat pale grey with no squares, and the players' corners are 4px
	// max (/embeds): the window's greatest width in px, for a paper wider than the window should be; it stands in
	// the paper's middle
	// yt (/embeds): scene 0's player has YouTube's own play button, its shape and its red, not the round blue one (so
	// has scene 2's until the app's own button is switched on, and that one is a blue pill with a word on it); captions are picked to
	// begin with, next to the start time; and the player has no "Powered by Iframely" in its corner (scene 2, where
	// that line is one of the switches, keeps it)
	// one (/embeds): scene 1's players play one at a time and can be pressed (see below), and each time the scene is
	// opened the first one plays and the others stand at their start; without it all three play and pause together,
	// each from some way in, as on /embeds-2 and /embeds-3
	import { untrack } from 'svelte';
	// unmarked (/embeds): no player has the "Powered by Iframely" line, and scene 2 has no switch for it (two switches
	// there: the play button and the domain). The block does not bring that line up.
	// low (/embeds): the window is lower, so that with the paper's margin it is no taller than the copy next to it
	// (four short texts): the player's box is 9 to 4, not 16 to 9, and scene 1's three players are square
	// card (/embeds): scene 3 is not a named provider's post but the summary card of a made-up one (provider.example:
	// a picture, where it is from, a title, a line of text), and its three switches are the card's layout (the picture
	// on top, or to the left), the app's colours and rounder corners
	let {
		scene = 0,
		plain = false,
		max,
		yt = false,
		one = false,
		unmarked = false,
		low = false,
		card = false
	}: { scene?: number; plain?: boolean; max?: number; yt?: boolean; one?: boolean; unmarked?: boolean; low?: boolean; card?: boolean } = $props();

	// 0
	let start = $state(true);
	// (picked to begin with on /embeds only: yt as it is when the scene is made)
	let captions = $state(untrack(() => yt));
	let dark = $state(false);
	const query = $derived([start && '_start=42', captions && '_cc=1', dark && 'theme=dark'].filter(Boolean).join('&'));
	// 1: with one, one plays at a time, as the three players of block 03 (components/ReadersFigure.svelte): pressing
	// one stops whichever was playing. The first plays to begin with. Without it all three play while current is not
	// -1, and only the Play switch under them starts and stops them.
	// (with one the three are all video players: the third was SoundCloud there too)
	const PLAYERS = $derived(['YouTube', 'Vimeo', one ? 'Wistia' : 'SoundCloud']);
	let current = $state(0); // the one that plays; -1: none
	let last = $state(0); // the one the last call went to
	let muted = $state(false);
	let call = $state('play');
	const press = (i: number) => {
		call = current === i ? 'pause' : 'play';
		current = current === i ? -1 : i;
		last = i;
	};
	// With one, the scene begins anew each time it is opened: the first player plays, and all three bars start from
	// nothing (the window is made again for each scene, so the bars' animations start over with it).
	$effect.pre(() => {
		if (scene === 1 && one) untrack(() => ((current = 0), (last = 0), (call = 'play')));
	});
	// 2
	let brand = $state(true);
	let unbranded = $state(false);
	let domain = $state(false);
	// 3
	let bare = $state(true);
	let round = $state(false);
	let accent = $state(false);
	const tuned = $derived(+bare + +round + +accent);
	// 3, with card: the picture to the left of the words (off: on top of them), the app's colours, rounder corners
	let across = $state(true);
	let ours = $state(true);
	let soft = $state(false);
	const carded = $derived(+across + +ours + +soft);
</script>

{#snippet chip(label: string, on: boolean, toggle: () => void)}
	<button type="button" class="chip" aria-pressed={on} onclick={toggle}>
		<span class="dot" aria-hidden="true"></span>{label}
	</button>
{/snippet}

<!-- one player: o says what is switched on -->
{#snippet player(o: { start?: boolean; captions?: boolean; dark?: boolean; brand?: boolean; unbranded?: boolean; yt?: boolean; own?: boolean; time?: boolean; name?: string })}
	<div class="player" class:dark={o.dark}>
		<!-- whose player it is: the provider's name on /embeds, as on scene 1's three players (elsewhere a link to a
		     video, which was a real one's) -->
		<span class="absolute top-3 left-3.5 font-mono text-[11px] leading-none opacity-60">{o.name ?? 'youtu.be/9bZkp7q19f0'}</span>
		{#if o.yt}
			<!-- yt: the provider's own player, so YouTube's play button: its shape (as block 03's cover,
			     components/ReadersFigure.svelte) and its own red (it was in the page's blue) -->
			<svg class="yt" width="64" height="45" viewBox="0 0 68 48" aria-hidden="true">
				<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00" />
				<path d="M45 24 27 14v20z" fill="#fff" />
			</svg>
		{:else if o.own}
			<!-- own: the app's own button, plainly not a provider's: a pill in the page's blue with the word on it and
			     a soft ring around it -->
			<span class="own">
				<svg width="13" height="13" viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" /></svg>Watch
			</span>
		{:else}
			<span class="play" class:brand={o.brand}>
				<svg width="15" height="15" viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" /></svg>
			</span>
		{/if}
		{#if o.captions}<span class="cc">[music playing]</span>{/if}
		<!-- (time: false leaves the time out: scene 2 on /embeds, where it stood at 0:00 and said nothing) -->
		{#if o.time !== false}<span class="absolute bottom-3.5 left-3.5 font-mono text-[11px] leading-none">{o.start ? '0:42' : '0:00'}</span>{/if}
		{#if !o.unbranded}<span class="absolute right-3.5 bottom-3.5 text-[11px] leading-none opacity-60">Powered by Iframely</span>{/if}
		<span class="track"><span class="fill" class:brand={o.brand} style="width:{o.start ? 34 : 0}%"></span></span>
	</div>
{/snippet}

<!-- the window stands in the middle of the paper, which is as tall as the copy next to it -->
<div class="paper flex h-full items-center justify-center rounded-md p-4 sm:p-6" class:plain class:low>
	{#key scene}
		<div class="win w-full overflow-hidden rounded-md bg-white" style:max-width={max ? `${max}px` : undefined}>
			{#if scene === 0}
				<!-- the link, with the editor's options in its query string -->
				<div class="bar"><span class="truncate">iframe.ly/aB3xK9{#if query}<b>?{query}</b>{/if}</span></div>
				<div class="p-4">{@render player({ start, captions, dark, yt, unbranded: yt, name: yt ? 'YouTube' : undefined })}</div>
				<div class="controls">
					<p class="group">Your editors choose, per link</p>
					<div class="mt-2.5 flex flex-wrap gap-2">
						{@render chip('Start at 0:42', start, () => (start = !start))}
						{@render chip('Captions', captions, () => (captions = !captions))}
						{@render chip('Dark theme', dark, () => (dark = !dark))}
					</div>
				</div>
			{:else if scene === 1}
				<!-- the last call made: player.play(), whichever provider's player it went to (with one it named the
				     provider for a while, youtube.play(): the point is that the call is the same) -->
				<div class="bar"><span class="truncate">player.<b>{call}()</b></span><span class="ml-auto text-mute">player.js</span></div>
				<div class="p-4">
					<div class="stage grid grid-cols-3 content-center gap-3">
						{#each PLAYERS as name, i (name)}
							{@const playing = one ? current === i : current >= 0}
							<div>
								<!-- (a button only where the players can be pressed) -->
								<svelte:element
									this={one ? 'button' : 'div'}
									type={one ? 'button' : undefined}
									class="mini"
									class:playing
									aria-label={one ? `${playing ? 'Pause' : 'Play'} ${name}` : undefined}
									aria-pressed={one ? playing : undefined}
									onclick={one ? () => press(i) : undefined}
								>
									<span class="absolute top-2 left-2.5 font-mono text-[10px] leading-none text-mute">{name}</span>
									<span class="play small" class:idle={one && !playing}>
										<svg width="11" height="11" viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d={playing ? 'M3 2h3v10H3zM8 2h3v10H8z' : 'M3 1.5v11l9-5.5z'} /></svg>
									</span>
									<!-- the speaker, crossed out when muted (with one it is 18px, not 14px: it was hard to make out) -->
									<svg class="absolute right-2 bottom-2.5 text-mute" width={one ? 18 : 14} height={one ? 18 : 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width={one ? 1.1 : 1.2} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M2 5.5h2L7 3v8L4 8.5H2z" />
										{#if muted}<path d="M9.5 5.5l3 3M12.5 5.5l-3 3" />{:else}<path d="M9.5 5a3 3 0 0 1 0 4" />{/if}
									</svg>
									<span class="track"><span class="fill run" style="--from:{one ? 0 : [22, 48, 9][i]}%;--dur:{[26, 34, 30][i]}s"></span></span>
								</svelte:element>
								<div class="mt-2.5 h-2 w-[80%] rounded-full bg-black/8"></div>
								<div class="mt-2 h-2 w-[55%] rounded-full bg-black/8"></div>
							</div>
						{/each}
					</div>
				</div>
				<div class="controls">
					<p class="group">The same calls, whoever the provider</p>
					<div class="mt-2.5 flex flex-wrap gap-2">
						<!-- Play: whether one is playing; switching it off pauses that one, on plays the last one again -->
						{@render chip('Play', current >= 0, () => press(current >= 0 ? current : last))}
						{@render chip('Mute', muted, () => ((muted = !muted), (call = muted ? 'mute' : 'unmute')))}
					</div>
				</div>
			{:else if scene === 2}
				<!-- where the player is served from: our domain, or the app's own -->
				<div class="bar"><span class="truncate"><b>{domain ? 'media.your-app.com' : 'cdn.iframe.ly'}</b>/aB3xK9</span></div>
				<!-- (with yt: the player as the provider made it has YouTube's own red button, as scene 0's, and the app's
				     own button is a pill in the page's blue with a word on it; without yt the round blue one is the
				     provider's and the app's own is orange, with the bar under it) -->
				<div class="p-4">{@render player({ brand: brand && !yt, unbranded: unbranded || unmarked, yt: yt && !brand, own: yt && brand, time: !yt, name: yt ? 'YouTube' : undefined })}</div>
				<div class="controls">
					<p class="group">Your app sets, for every player</p>
					<div class="mt-2.5 flex flex-wrap gap-2">
						{@render chip('Your play button', brand, () => (brand = !brand))}
						{#if !unmarked}{@render chip('No “Powered by”', unbranded, () => (unbranded = !unbranded))}{/if}
						{@render chip('Your domain', domain, () => (domain = !domain))}
					</div>
				</div>
			{:else if card}
				<!-- a made-up provider (.example is a name kept for examples), and its summary card: the card is ours, so
				     with nothing switched on it is our default one -->
				<div class="bar">
					<span class="truncate">provider.example/article/7301</span>{#if carded}<span class="ml-auto text-rich">{carded} adjusted for you</span>{/if}
				</div>
				<div class="p-4">
					<!-- fit: the card is never taller than the box, so the window keeps its height on a phone too -->
					<div class="stage fit grid place-items-center">
						<div class="card" class:across class:ours class:soft>
							<!-- its picture: a plain grey placeholder, as the blocks in the other scenes. (Drawn pictures were tried:
							     hills and a sun, two bars for a build time, a lighthouse; none landed.) -->
							<div class="thumb"></div>
							<div class="body">
								<p class="site"><span class="fav" aria-hidden="true"></span>provider.example</p>
								<p class="title">A beginner's guide to slow travel</p>
								<p class="desc">Fewer places, longer stays, and what you notice on the way.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="controls">
					<!-- Our team sets, for all of an app's links, what the provider itself offers: no more (the switches are
					     the made-up provider's options). (It was "Ask, and our team adjusts it", as the TikTok scene below
					     still has, then "Tuned to your design", which claimed more than the provider allows.) -->
					<p class="group">Set for you, from the provider's options</p>
					<div class="mt-2.5 flex flex-wrap gap-2">
						<!-- (short names: the three stand on one row wherever scene 0's three do) -->
						{@render chip('Horizontal', across, () => (across = !across))}
						{@render chip('Accent color', ours, () => (ours = !ours))}
						{@render chip('Round corners', soft, () => (soft = !soft))}
					</div>
				</div>
			{:else}
				<div class="bar">
					<span class="truncate">tiktok.com/@studio/video/73…</span><span class="ml-auto {tuned ? 'text-rich' : 'text-mute'}">{tuned ? `${tuned} adjusted for you` : 'as the provider made it'}</span>
				</div>
				<div class="p-4">
					<div class="stage grid place-items-center">
						<!-- one provider's post -->
						<div class="post" class:round>
							<div class="flex items-center gap-2 p-2.5">
								<span class="size-6 rounded-full bg-black/12"></span>
								<span class="h-2 w-20 rounded-full bg-black/12"></span>
								<span class="follow ml-auto" class:accent>Follow</span>
							</div>
							<div class="media"><span class="play small" class:brand={accent}><svg width="11" height="11" viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" /></svg></span></div>
							{#if !bare}
								<div class="space-y-1.5 p-2.5">
									<div class="h-2 w-[85%] rounded-full bg-black/8"></div>
									<div class="h-2 w-[50%] rounded-full bg-black/8"></div>
								</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="controls">
					<p class="group">Ask, and our team adjusts it</p>
					<div class="mt-2.5 flex flex-wrap gap-2">
						{@render chip('Hide the caption', bare, () => (bare = !bare))}
						{@render chip('Rounder corners', round, () => (round = !round))}
						{@render chip('Your colour', accent, () => (accent = !accent))}
					</div>
				</div>
			{/if}
		</div>
	{/key}
</div>

<style>
	/* the squared paper of the provider wall and the cards' covers */
	.paper {
		--ln: rgb(0 0 0 / 0.035);
		--own: #ff5a1f; /* stands for the customer's own colour */
		background-color: #fafafa;
		background-image: linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px);
		background-size: 12px 12px;
		background-position: -1px -1px;
	}
	/* plain: no squares, one flat pale grey */
	.paper.plain {
		background-color: #f4f4f5;
		background-image: none;
	}
	/* the page's scale of corners: a block inside a window is 4px */
	.plain .player,
	.plain .mini {
		border-radius: 4px;
	}
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
		animation: scene-in 0.35s ease-out;
	}
	@keyframes scene-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 16px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	.bar b {
		font-weight: inherit;
		color: var(--color-rich);
	}
	.controls {
		padding: 16px 16px 20px;
		border-top: 1px solid rgb(0 0 0 / 0.07);
	}
	/* every scene's top part has the player's box, so the window keeps its height from scene to scene */
	.player,
	.stage {
		aspect-ratio: 16 / 9;
	}
	/* low: a lower box in every scene, and scene 1's three players are square, to fit it */
	.low .player,
	.low .stage {
		aspect-ratio: 9 / 4;
	}
	.low .mini {
		aspect-ratio: 1;
	}
	.player,
	.mini,
	.media {
		position: relative;
		overflow: hidden;
		border-radius: 6px;
		background: rgb(0 0 0 / 0.07);
		color: var(--color-fg);
		transition:
			background-color 0.25s,
			color 0.25s;
	}
	.player.dark {
		background: #1b1b1f;
		color: #fff;
	}
	.mini {
		aspect-ratio: 4 / 5;
	}
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		translate: -50% -50%;
		border-radius: 999px;
		background: var(--color-rich);
		transition:
			background-color 0.25s,
			border-radius 0.25s;
	}
	.play.small {
		width: 34px;
		height: 34px;
	}
	/* a player that is not the one playing: its button is grey (as block 03's three players) */
	.play.idle {
		background: rgb(0 0 0 / 0.25);
	}
	/* scene 1's players, where they can be pressed (one) */
	button.mini {
		display: block;
		width: 100%;
		cursor: pointer;
	}
	button.mini:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	/* YouTube's own play button, shape and red (scene 0) */
	.yt {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}
	/* the app's own play button on /embeds: a pill with a word on it and a soft ring (scene 2 with yt) */
	.own {
		position: absolute;
		top: 50%;
		left: 50%;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding: 0 20px 0 16px;
		translate: -50% -50%;
		border-radius: 999px;
		background: var(--color-rich);
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-rich) 16%, transparent);
		color: #fff;
		font-size: 15px;
		line-height: 1;
		font-weight: 500;
	}
	/* the app's own play button: its colour and its shape */
	.play.brand {
		border-radius: 14px;
		background: var(--own);
	}
	.play.small.brand {
		border-radius: 999px;
	}
	.cc {
		position: absolute;
		bottom: 34px;
		left: 50%;
		translate: -50% 0;
		padding: 5px 8px;
		border-radius: 4px;
		background: rgb(0 0 0 / 0.75);
		color: #fff;
		font-size: 12px;
		line-height: 1;
		white-space: nowrap;
	}
	.track {
		position: absolute;
		inset: auto 0 0;
		height: 3px;
		background: rgb(128 128 128 / 0.25);
	}
	.fill {
		display: block;
		height: 100%;
		background: var(--color-rich);
		transition:
			width 0.35s,
			background-color 0.25s;
	}
	.fill.brand {
		background: var(--own);
	}
	/* a playing player's bar moves on, and stands still when paused */
	.fill.run {
		width: var(--from);
		animation: run var(--dur) linear infinite paused;
	}
	.playing .fill.run {
		animation-play-state: running;
	}
	@keyframes run {
		to {
			width: 100%;
		}
	}
	/* The summary card (scene 3 with card). Its box is a size container, so the card is measured against it: upright,
	   the card is as tall as the box at most and its picture takes what the words leave. */
	.stage.fit {
		container-type: size;
	}
	.card {
		display: flex;
		flex-direction: column;
		width: min(212px, 64cqw);
		height: min(208px, 100cqh);
		overflow: hidden;
		border-radius: 3px;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.12);
		text-align: left;
		transition:
			border-radius 0.25s,
			background-color 0.25s,
			box-shadow 0.25s;
	}
	/* across: the picture to the left, the words to the right; as tall as the words */
	.card.across {
		flex-direction: row;
		width: min(384px, 100cqw);
		height: auto;
	}
	.card.soft {
		border-radius: 16px;
	}
	/* the app's colours: the page's blue stands for them, as the app's own play button in scene 2 */
	.card.ours {
		background: color-mix(in srgb, var(--color-rich) 6%, white);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-rich) 35%, white);
	}
	.thumb {
		position: relative;
		flex: 1 1 0;
		min-height: 0;
		background: #e9e9eb;
	}
	.across .thumb {
		flex: 0 0 min(120px, 30%);
	}
	.body {
		min-width: 0;
		padding: 10px 12px 12px;
	}
	.across .body {
		flex: 1;
		padding: 14px 16px;
	}
	.site {
		display: flex;
		align-items: center;
		gap: 6px;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
		transition: color 0.25s;
	}
	.fav {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		background: rgb(0 0 0 / 0.3);
		transition: background-color 0.25s;
	}
	.ours .site {
		color: var(--color-rich);
	}
	.ours .fav {
		background: var(--color-rich);
	}
	.title,
	.desc {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	.title {
		margin-top: 8px;
		font-size: 14px;
		line-height: 1.3;
		font-weight: 500;
		color: var(--color-fg);
	}
	.desc {
		margin-top: 4px;
		font-size: 12px;
		line-height: 1.4;
		color: var(--color-mute);
	}
	/* a low box (a phone): the upright card drops its line of text, to keep some picture */
	@container (height < 170px) {
		.card:not(.across) .desc {
			display: none;
		}
	}
	/* the provider's post */
	.post {
		width: min(250px, 72%);
		overflow: hidden;
		border-radius: 3px;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.12);
		transition: border-radius 0.25s;
	}
	.post.round {
		border-radius: 16px;
	}
	.post .media {
		height: 128px;
		border-radius: 0;
	}
	.follow {
		padding: 5px 9px;
		border-radius: 999px;
		background: var(--color-fg);
		color: #fff;
		font-size: 11px;
		line-height: 1;
		font-weight: 500;
		transition: background-color 0.25s;
	}
	.follow.accent {
		background: var(--own);
	}
	.group {
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 7px 12px 7px 10px;
		border-radius: 999px;
		background: #fff;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
		font-size: 13px;
		line-height: 1;
		font-weight: 500;
		color: var(--color-body);
		cursor: pointer;
		transition:
			background-color 0.2s,
			box-shadow 0.2s,
			color 0.2s;
	}
	.chip:hover {
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.28);
	}
	.chip:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		box-shadow: inset 0 0 0 1.5px rgb(0 0 0 / 0.25);
		transition:
			background-color 0.2s,
			box-shadow 0.2s;
	}
	.chip[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-rich) 8%, white);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-rich) 45%, white);
		color: var(--color-rich);
	}
	.chip[aria-pressed='true'] .dot {
		background: var(--color-rich);
		box-shadow: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.win,
		.fill.run {
			animation: none;
		}
		.player,
		.play,
		.fill,
		.post,
		.follow,
		.card,
		.site,
		.fav,
		.chip,
		.dot {
			transition: none;
		}
	}
</style>
