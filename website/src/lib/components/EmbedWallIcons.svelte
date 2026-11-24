<script lang="ts">
	// The /embeds-3 hero visual: EmbedWall.svelte (a wall of working embeds drawn as flat grey shapes with blue accents,
	// and blueprint measures in its gaps) with one addition: each window's bar starts with its provider's favicon. Two
	// tiles changed provider for that, to ones whose logos are in assets/providers: the audio track is Spotify's and the
	// slides are Canva's. Wikipedia has no logo file, so its W is set in type.
	// The video tile's film: 7.6s of Georges Méliès's "Le Voyage dans la Lune" (1902, public domain), the rocket
	// landing in the moon's eye and then on its ground. Source: the black-and-white copy on archive.org
	// (levoyagedanslalune_georgesmelies), 7:16 to 7:21 and 7:26 to 7:28, cropped to 16:9, 12 frames a second, lightly
	// denoised, shrunk to 480×270 and made grey. It is shown as it is (it was once drawn as a dither).
	// The poster has no lettering: it is a frame of the same film (7:21, the rocket in the moon's eye), with the same
	// crop, as an AVIF still of 960×540. (It was once a YouTube upload's thumbnail with the title on it; that picture
	// is still in the folder as trip-to-the-moon-poster.jpg, unused.)
	// Two encodings of the film: AV1 (libaom, crf 50, 98 KB) for browsers that play it, and H.264 (crf 32, 142 KB) for
	// the rest.
	import filmAv1 from '../assets/hero/trip-to-the-moon.av1.mp4';
	import film from '../assets/hero/trip-to-the-moon.mp4';
	// (trip-to-the-moon-faded.avif, a faded print of it with black lifted to 42% grey, was tried and is unused)
	import poster from '../assets/hero/trip-to-the-moon.avif';
	// the video tile plays only after its button is pressed, and loops until it is pressed again
	let playing = $state(false);
	let player = $state<HTMLVideoElement>();
	let at = $state(0);
	let length = $state(0);
	const toggle = () => (player?.paused ? player.play() : player?.pause());
	const clock = (s: number) => `0:${String(Math.floor(s || 0)).padStart(2, '0')}`;

	const SRC = import.meta.glob('../assets/providers/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const logo = (id: string) => SRC[`../assets/providers/${id}.svg`];

	type Side = 'top' | 'right' | 'bottom';

	// The audio tile's track: Scott Joplin's "Maple Leaf Rag", 2:34 in the public-domain recording by Zachary
	// Brewster-Geisz (archive.org/details/MapleLeafRag). The player plays a preview of it, as Spotify's does for a
	// visitor who is not signed in: the first 30 seconds, faded out at the end (mono MP3, 48 kb/s, 180 KB), fetched
	// only when the button is first pressed. The progress line and the time follow the sound; at the end it stops
	// and goes back to the start.
	import preview from '../assets/hero/maple-leaf-rag-preview.mp3';
	const TUNE = 30;
	let tune = $state<HTMLAudioElement>();
	let tuneOn = $state(false);
	let tuneAt = $state(0);
	$effect(() => {
		if (!tuneOn) return;
		let frame = requestAnimationFrame(function loop() {
			if (tune) tuneAt = Math.min(TUNE, tune.currentTime);
			frame = requestAnimationFrame(loop);
		});
		return () => cancelAnimationFrame(frame);
	});
	const tuneTo = (s: number) => {
		tuneAt = Math.min(TUNE - 0.5, Math.max(0, s));
		if (tune) tune.currentTime = tuneAt;
	};
	// The map tile: the streets and parks of Montreuil for about 600 m around the cinema Le Méliès (48.86178,
	// 2.44269), from OpenStreetMap data (Overpass, ways with highway and leisure=park|garden; © OpenStreetMap
	// contributors, ODbL), drawn as a 600×600 SVG with the cinema in its middle. pan: how far it is dragged from
	// there, kept so that the map always covers the tile; zoom: its scale.
	import streets from '../assets/hero/map-montreuil.svg';
	let mapBox = $state<HTMLDivElement>();
	let pan = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let held = $state<{ x: number; y: number } | null>(null);
	const fit = (p: { x: number; y: number }, z = zoom) => {
		const mx = Math.max(0, 300 * z - (mapBox?.clientWidth ?? 0) / 2);
		const my = Math.max(0, 300 * z - (mapBox?.clientHeight ?? 0) / 2);
		return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
	};
	const zoomBy = (f: number) => {
		const least = Math.max(0.7, (mapBox?.clientWidth ?? 0) / 600, (mapBox?.clientHeight ?? 0) / 600);
		const z = Math.max(least, Math.min(2.75, zoom * f));
		pan = fit({ x: (pan.x * z) / zoom, y: (pan.y * z) / zoom }, z);
		zoom = z;
	};
	const seek = (e: MouseEvent) => {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		tuneTo(((e.clientX - r.left) / r.width) * TUNE);
	};
	const mins = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	// the slides tile's deck: four scenes of the same film, each with a still from it (480×270 AVIF, grey)
	import cannon from '../assets/hero/slide-cannon.avif';
	import moonFace from '../assets/hero/slide-moon.avif';
	import landing from '../assets/hero/slide-landing.avif';
	import sleep from '../assets/hero/slide-sleep.avif';
	const DECK = [
		['The cannon is loaded', cannon],
		['The Moon looks on', moonFace],
		['Landing on the Moon', landing],
		['The astronomers sleep', sleep]
	];
	let slide = $state(0);
	// the X post's like
	let liked = $state(false);
	// the post's picture: NASA's "Earth in View" (art002e023506, 2 April 2026, credit NASA), the Earth through an
	// Orion window on the second day of Artemis II, cut in close so the Earth fills it, in its own blue and white.
	// (The two before it, nasa-earthset.avif and nasa-crescent-earth.avif, are still in the folder, unused.)
	// Now: "Shadows Across Vavilov Crater" (art002e009282, 6 April 2026, credit NASA), a close-up of the Moon's
	// surface, grey all over. nasa-earth-in-view.avif is unused too.
	// Now: "Artemis II Splashdown" (KSC-20260410-PH-JNV01_0001, 10 April 2026, credit NASA), Orion's three red and
	// white parachutes on a pale blue sky, cut to the parachutes (the capsule hangs below the cut).
	// nasa-vavilov-crater.avif is unused too.
	// (Its sky's blue is turned toward the accent blue: ffmpeg huesaturation on the cyans and blues only.)
	// nasa-splashdown-sea.avif, tried after it, is unused too.
	// (The parachutes are the one to come back to: nasa-splashdown-parachutes.avif, with the text "Artemis II
	// splashdown: Orion’s parachutes deploy over the Pacific Ocean near San Diego." and the date Apr 10.)
	// Now on trial: "Artemis II on Launch Pad 39B" (KSC-01282026-Artemis II_Moon Shots-10, 28 January 2026, credit
	// NASA), the top of the rocket, white on a deep blue sky.
	// Then: "Artemis II Crew Recovery" (JB5_0814, 10 April 2026, credit NASA), a Navy helicopter hoisting an
	// astronaut over a dark blue, rippled sea. nasa-rocket-on-pad.avif is unused too.
	// Then: Apollo 11's lunar module coming back from the Moon, the Earth over the horizon (AS11-44-6642, 21 July
	// 1969, credit NASA): spacecraft, Moon and Earth in one frame. nasa-crew-recovery.avif is unused too.
	// Then: "View of Moonset" (iss061e003881, 5 October 2019, credit NASA), a first quarter Moon just above the
	// Earth's blue limb, from the Space Station. nasa-apollo11-lunar-module.avif is unused too.
	// Then: "Moon setting" (iss040e092688, 13 August 2014, credit NASA), the Moon over the Earth's limb and clouds,
	// by the Expedition 40 crew. nasa-moonset.avif (text "Moonset: a first quarter Moon pictured from the
	// International Space Station, just above Earth’s limb.", Oct 5) is unused too.
	// Then: the Moon over the Earth's limb with a station solar array (iss037e017170, 19 October 2013, credit NASA).
	// nasa-moon-setting.avif (text "The Moon setting over Earth’s limb, as seen by the Expedition 40 crew aboard the
	// International Space Station.", Aug 13) is unused too.
	// Back to the very first one: "Earthset", the Earth setting behind the Moon's far side on Artemis II (6 April
	// 2026, credit NASA). nasa-station-moon.avif (text "A distant Moon over Earth’s limb, with a solar array in
	// view, from the International Space Station.", Oct 19) is unused too.
	// Then the second one: a crescent Earth on the Moon's limb. nasa-earthset.avif (text "Earthset: the Artemis II
	// crew captured Earth setting as they passed behind the Moon’s far side.", Apr 6, 880×520) is unused again.
	// Then the third one: "Earth in View". nasa-crescent-earth.avif (text "Peeking at the Earth: the Artemis II crew
	// captured a crescent Earth setting on the Moon’s limb.", Apr 6) is unused again.
	// Then the fourth one: Vavilov Crater. nasa-earth-in-view.avif (text "Earth in view: taken by an Artemis II crew
	// member through an Orion window on day two of the mission.", Apr 2) is unused again.
	// Then the fifth one: the splashdown parachutes. nasa-vavilov-crater.avif (text "Shadows across Vavilov Crater:
	// a close-up of the Moon taken by the Artemis II crew.", Apr 6) is unused again.
	// Then the sixth one: the capsule on the sea (parachutes unused again; their text is noted above).
	// Then the seventh one: the rocket on the pad. nasa-splashdown-sea.avif (text "Artemis II splashdown: Orion and
	// its crew afloat in the Pacific Ocean near San Diego.", Apr 10) is unused again.
	// Then the eighth one: the crew recovery. nasa-rocket-on-pad.avif (text "Artemis II on Launch Pad 39B: the Orion
	// spacecraft and its launch abort system atop the SLS rocket.", Jan 28) is unused again.
	// Then the ninth one: the Apollo 11 lunar module. nasa-crew-recovery.avif (text "Artemis II crew recovery:
	// astronauts are lifted from the raft to the recovery ship after leaving Orion.", Apr 10) is unused again.
	// Then the tenth one: the half Moon over the blue limb. nasa-apollo11-lunar-module.avif (text "On this day in
	// 1969: Apollo 11’s lunar module returns from the Moon, with a half-Earth in the background.", Jul 21, 880×454)
	// is unused again.
	// Then number 11 on the sheet of all twelve: the Moon setting over the clouds. nasa-moonset.avif (text "Moonset:
	// a first quarter Moon pictured from the International Space Station, just above Earth’s limb.", Oct 5) is
	// unused again.
	import earthset from '../assets/hero/nasa-moon-setting.avif';
	// the post's avatar: NASA's insignia (commons.wikimedia.org, NASA_logo.svg). NASA sets rules for its use.
	import nasa from '../assets/hero/nasa-logo.svg';
	// the summary card's picture, in colour: a frame from the only surviving hand-coloured print of the film, the
	// rocket in the moon's eye (commons.wikimedia.org, "Melies color Voyage dans la lune.jpg", public domain), cut
	// square around the moon. (The two before it, wikipedia-trip-to-the-moon.avif and wikipedia-astronomers.avif,
	// are still in the folder, unused.)
	// Now: Méliès's own drawing of that scene, "en plein dans l'œil!!" (commons.wikimedia.org, "Le voyage dans la
	// lune drawing.jpg", public domain), in its sepia, cut square. wikipedia-moon-colour.avif is unused too.
	// Now: the film's smiling moon (7:15, our own still), cut square and coloured in three stops, dark navy to the
	// accent blue to white (baked into the file with ffmpeg curves). wikipedia-melies-drawing.avif is unused too.
	// Now: Méliès's drawing again, coloured the same way. wikipedia-moon-blue.avif is unused too.
	import titleCard from '../assets/hero/wikipedia-drawing-blue.avif';
</script>

{#snippet play(size: number, fill: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" class="block" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" {fill} /></svg>
{/snippet}

<!-- A tile is a white window: a hairline ring and a soft shadow, a mono bar (the provider's favicon and host, and the
     kind in grey), then the embed. notes: the measures drawn outside the window, as in EmbedWall. -->
{#snippet tile(span: string, icon: string, host: string, kind: string, body: import('svelte').Snippet, notes: [Side, string][] = [])}
	<div class="relative min-h-0 {span}">
		<div class="win flex h-full flex-col overflow-hidden rounded-lg bg-white">
			<div class="bar">
				{#if icon === 'wikipedia'}
					<span class="grid size-4 flex-none place-items-center font-serif text-[15px] leading-none text-fg">W</span>
				{:else}
					<img class="size-4 flex-none" src={logo(icon)} alt="" width="16" height="16" />
				{/if}
				<span class="truncate">{host}</span><span class="ml-auto text-mute">{kind}</span>
			</div>
			<div class="relative min-h-0 flex-1 overflow-hidden">{@render body()}</div>
		</div>
		{#each notes as [side, text] (side)}
			<div class="dim {side}"><span>{text}</span></div>
		{/each}
	</div>
{/snippet}

<div class="embed-wall" role="group" aria-label="Kinds of embeds: a video, an audio track, a social post, a map, code, slides and a summary card">
	{#snippet video()}
		<!-- a short film, small and much compressed, black and white so it sits with the grey pictures around it -->
		<!-- A drawn player, not YouTube's: its poster until the button is pressed, then the film runs in a loop and the
		     button, title and progress line are gone; a press on the playing picture stops it again. -->
		<button type="button" class="art group absolute inset-4 block cursor-pointer overflow-hidden rounded-sm" aria-label={playing ? 'Pause the video' : 'Play the video'} onclick={toggle}>
			<video
				bind:this={player}
				bind:currentTime={at}
				bind:duration={length}
				class="absolute inset-0 size-full object-cover"
				muted
				loop
				playsinline
				preload="metadata"
				onplay={() => (playing = true)}
				onpause={() => (playing = false)}
			>
				<source src={filmAv1} type="video/mp4; codecs=av01.0.00M.08" />
				<source src={film} type="video/mp4" />
			</video>
			<!-- the poster, as a picture over the film until the first play (the video's own poster attribute is dropped as
			     soon as the time binding touches the film) -->
			{#if !playing && at === 0}
				<img class="absolute inset-0 size-full object-cover" src={poster} alt="" width="960" height="540" />
			{/if}
			<!-- a light dark veil over the film, so the play button and the progress line read on any frame -->
			<!-- (it is a little darker while the film is still: on its poster and on hold) -->
			<div class="absolute inset-0 transition-colors duration-200 {playing ? 'bg-black/10' : 'bg-black/35'}"></div>
			<!-- stopped, the player shows the video's title across its top, as YouTube's does, and YouTube's own play button:
			     the red rounded tile with a white triangle -->
			<!-- (the title, with a made-up channel's avatar, also comes back while the pointer is over the playing film) -->
			<span class="absolute inset-x-0 top-0 flex items-center gap-2.5 bg-linear-to-b from-black/60 to-transparent px-3.5 pt-3 pb-9 text-left transition-opacity duration-200 {playing ? 'opacity-0 group-hover:opacity-100' : ''}">
				<i class="grid size-7 flex-none place-items-center rounded-full bg-white font-serif text-[15px] leading-none font-semibold text-black not-italic">M</i>
				<span class="truncate text-[14px] leading-none font-medium text-white">A Trip to the Moon (1902) - Georges Méliès</span>
			</span>
			{#if !playing}
				<svg class="absolute top-1/2 left-1/2 -translate-1/2" width="68" height="48" viewBox="0 0 68 48" aria-hidden="true">
					<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.950-1.480-16.260z" fill="#f00" />
					<path d="M45 24 27 14v20z" fill="#fff" />
				</svg>
			{/if}
			<!-- Once the film has been started: the progress line, in YouTube's red, running while it plays, and under it the
			     player's controls (drawn, they do nothing). Both show while it is on hold, and while the pointer is over
			     the playing film; with the pointer away the playing film is bare. -->
			{#if playing || at > 0}
				<span class="absolute inset-x-0 bottom-0 block bg-linear-to-t from-black/70 to-transparent px-3.5 pt-9 pb-2.5 text-left transition-opacity duration-200 {playing ? 'opacity-0 group-hover:opacity-100' : ''}">
					<span class="block h-[3px] rounded-sm bg-white/35"><span class="run block h-full rounded-sm bg-[#f00]" style="width:{length ? (at / length) * 100 : 0}%"></span></span>
					<span class="mt-2 flex items-center gap-3 text-white">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							{#if playing}<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />{:else}<path d="M8 5.5v13l10.5-6.500z" />{/if}
						</svg>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9.500v5h3.500L12 19V5L7.500 9.500zM14.500 8.200v7.600a4.300 4.300 0 0 0 0-7.600z" /></svg>
						<span class="font-mono text-[11px] leading-none tabular-nums">{clock(at)} / {clock(length)}</span>
						<!-- settings: a cog wheel -->
						<svg class="ml-auto" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.140 12.940c.040-.300.060-.610.060-.940 0-.320-.020-.640-.070-.940l2.030-1.580a.490.490 0 0 0 .120-.610l-1.920-3.320a.488.488 0 0 0-.590-.220l-2.390.960c-.500-.380-1.030-.700-1.620-.940l-.360-2.540a.484.484 0 0 0-.480-.410h-3.840c-.240 0-.430.170-.470.410l-.360 2.540c-.590.240-1.130.570-1.620.940l-2.390-.960c-.220-.080-.470 0-.590.220L2.740 8.870c-.120.210-.080.470.120.610l2.030 1.580c-.050.300-.090.630-.090.940s.020.640.070.940l-2.030 1.580a.490.490 0 0 0-.120.610l1.920 3.320c.120.220.370.290.590.220l2.390-.960c.500.380 1.030.700 1.620.940l.360 2.540c.050.240.240.410.480.410h3.840c.240 0 .440-.170.470-.410l.360-2.540c.590-.240 1.130-.560 1.620-.940l2.390.960c.220.080.470 0 .590-.220l1.920-3.320c.120-.220.070-.470-.120-.610l-2.010-1.580zM12 15.600c-1.980 0-3.600-1.620-3.600-3.600s1.620-3.600 3.600-3.600 3.600 1.620 3.600 3.600-1.620 3.600-3.600 3.600z" /></svg>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" /></svg>
					</span>
				</span>
			{/if}
		</button>
	{/snippet}
	{@render tile('col-span-2 row-span-2', 'youtube', 'youtube.com', 'video', video, [
		['top', 'aspect ratio kept'],
		['right', 'height reserved before load']
	])}

	{#snippet audio()}
		<!-- Spotify's compact player, drawn (its play button and progress line work, and play a real preview of the track): a rounded card in our accent blue (theirs takes the cover's colour) with the cover at its left; the title
		     and the artist, Spotify's mark in the corner; and a foot row of "Save on Spotify", the progress line with
		     the time, the menu dots and the white round play button. The cover is made up: piano keys, for a rag. -->
		<div class="tune-card absolute inset-3 flex gap-3 rounded-sm bg-rich p-2.5 text-white">
			<svg viewBox="0 0 40 40" class="aspect-square h-full flex-none rounded-xs" aria-hidden="true">
				<rect width="40" height="40" fill="#e9e9e9" />
				<g fill="none" stroke="#bdbdbd" stroke-width="0.6"><path d="M8 0v40M16 0v40M24 0v40M32 0v40" /></g>
				<g fill="#131316"><rect x="5.500" width="5" height="25" /><rect x="13.500" width="5" height="25" /><rect x="29.500" width="5" height="25" /></g>
			</svg>
			<div class="flex min-w-0 flex-1 flex-col">
				<div class="flex items-start gap-2">
					<div class="min-w-0 flex-1">
						<div class="truncate text-[14px] leading-[1.25] font-semibold">Maple Leaf Rag</div>
						<div class="flex items-center gap-1.5 text-[12px] leading-[1.3] text-white/70">
							<span class="rounded-xs bg-white/20 px-1 text-[9px] leading-[1.5] font-semibold tracking-wide text-white uppercase">Preview</span>
							<span class="truncate">Scott Joplin</span>
						</div>
						<audio
							bind:this={tune}
							src={preview}
							preload="none"
							onplay={() => (tuneOn = true)}
							onpause={() => (tuneOn = false)}
							onended={() => {
								tuneOn = false;
								tuneTo(0);
							}}
						></audio>
					</div>
					<img class="size-[18px] flex-none brightness-0 invert" src={logo('spotify')} alt="" width="18" height="18" />
				</div>
				<div class="mt-auto flex items-center gap-2.5">
					<span class="flex flex-none items-center gap-1 text-[11px] leading-none font-medium text-white/85">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>
						Save on Spotify
					</span>
					<!-- the progress line is a slider: a press on it (it takes presses a little above and below the line too)
					     moves the clock there, and the arrow keys move it five seconds -->
					<span
						class="seek flex h-5 min-w-0 flex-1 cursor-pointer items-center"
						role="slider"
						tabindex="0"
						aria-label="Place in the track"
						aria-valuemin="0"
						aria-valuemax={TUNE}
						aria-valuenow={Math.floor(tuneAt)}
						aria-valuetext={mins(tuneAt)}
						onclick={seek}
						onkeydown={(e) => {
							const step = e.key === 'ArrowRight' ? 5 : e.key === 'ArrowLeft' ? -5 : 0;
							if (!step) return;
							e.preventDefault();
							tuneTo(tuneAt + step);
						}}
					>
						<span class="h-[3px] w-full rounded-full bg-white/25"><span class="block h-full rounded-full bg-white" style="width:{(tuneAt / TUNE) * 100}%"></span></span>
					</span>
					<span class="flex-none font-mono text-[10px] leading-none text-white/70 tabular-nums">{mins(tuneAt)}</span>
					<svg class="flex-none text-white/70" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.800" /><circle cx="12" cy="12" r="1.800" /><circle cx="19" cy="12" r="1.800" /></svg>
					<button type="button" class="tune grid size-8 flex-none cursor-pointer place-items-center rounded-full bg-white transition-transform hover:scale-105" aria-label={tuneOn ? 'Pause the track' : 'Play the track'} onclick={() => (tune?.paused ? tune.play() : tune?.pause())}>
						{#if tuneOn}
							<svg width="18" height="18" viewBox="0 0 24 24" class="block" aria-hidden="true"><path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z" fill="#000" /></svg>
						{:else}
							{@render play(18, '#000')}
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/snippet}
	{@render tile('col-span-2', 'spotify', 'spotify.com', 'audio', audio, [['top', '100% width · responsive']])}

	{#snippet post()}
		<div class="flex h-full flex-col p-3.5">
			<div class="flex items-center gap-2">
				<img class="size-7 flex-none object-contain" src={nasa} alt="" width="28" height="28" />
				<div>
					<div class="text-[12px] leading-[1.3] font-semibold text-fg">NASA</div>
					<div class="text-[11px] leading-[1.3] text-mute">@NASA · Aug 13</div>
				</div>
			</div>
			<!-- the words are cut from NASA's own caption of the picture, not from a post of theirs -->
			<div class="my-2.5 text-[13px] leading-[1.45] text-fg">The Moon setting over Earth’s limb, as seen by the Expedition 40 crew aboard the International Space Station.</div>
			<div class="art relative min-h-[60px] flex-1 overflow-hidden rounded-sm">
				<img class="absolute inset-0 size-full object-cover" src={earthset} alt="The Moon above the thin blue edge of the Earth, white clouds below" width="880" height="456" />
			</div>
			<!-- the post's row of actions, as X draws it: reply, repost, like and views with their counts, then bookmark
			     and share at the far end (drawn; only the like works; the counts are made up) -->
			<div class="mt-2.5 flex items-center gap-3 text-[11px] leading-none text-mute">
				{#each [['M4 5h16v11H10.500L6 19.500V16H4z', '1.2K'], ['M7 7h10v8M17 15l-2.500-2.500M17 15l2.500-2.500M17 17H7V9M7 9l-2.500 2.500M7 9l2.500 2.500', '9.8K'], ['M12 20s-7.500-4.600-7.500-10A4.200 4.200 0 0 1 12 7.500 4.200 4.200 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10z', '86K'], ['M5 20v-6M10 20V9M15 20v-9M20 20V4', '4.1M']] as [d, n], i (n)}
					{#if i === 2}
						<!-- the like works, as on X: the heart fills in X's pink with a small pop, the count takes the same pink;
						     on hover a pale pink disc appears behind the heart. Pressed again, it is taken back. -->
						<button type="button" class="like flex items-center gap-1" class:liked aria-pressed={liked} aria-label="Like" onclick={() => (liked = !liked)}>
							<span class="heart"><svg class="flex-none" width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path {d} /></svg></span>
							{n}
						</button>
					{:else}
						<span class="flex items-center gap-1">
							<svg class="flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path {d} /></svg>
							{n}
						</span>
					{/if}
				{/each}
				<svg class="ml-auto flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4.500L6 20z" /></svg>
				<svg class="-ml-2 flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M12 4 8 8M12 4l4 4M5 14v5h14v-5" /></svg>
			</div>
		</div>
	{/snippet}
	{@render tile('row-span-2', 'x', 'x.com', 'post', post, [['bottom', 'layout shift 0']])}

	{#snippet map()}
		<!-- A real map, drawn flat in our blue-greys: the streets (the main ones named), buildings, footpaths, parks and
		     metro stations of Montreuil around the cinema Le Méliès, from OpenStreetMap
		     (hence the credit in the corner). It can be dragged about, and the + and − buttons zoom it; the place card
		     is drawn after Google's and does nothing. -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={mapBox}
			class="absolute inset-3 touch-none overflow-hidden rounded-sm bg-[#eef1f7] select-none {held ? 'cursor-grabbing' : 'cursor-grab'}"
			onpointerdown={(e) => {
				if ((e.target as HTMLElement).closest('button')) return;
				held = { x: e.clientX - pan.x, y: e.clientY - pan.y };
				e.currentTarget.setPointerCapture(e.pointerId);
			}}
			onpointermove={(e) => held && (pan = fit({ x: e.clientX - held.x, y: e.clientY - held.y }))}
			onpointerup={() => (held = null)}
			onpointercancel={() => (held = null)}
		>
			<!-- the layer is hung by the pin's place (the middle of the map) on the middle of the tile, then moved by pan -->
			<div class="absolute top-1/2 left-1/2 {held ? '' : 'transition-transform duration-200'}" style="transform:translate({pan.x}px,{pan.y}px)">
				<img class="absolute -top-[300px] -left-[300px] size-[600px] max-w-none transition-transform duration-200" style="transform:scale({zoom})" src={streets} alt="" width="600" height="600" draggable="false" />
				<!-- the marker: a blue dot with a white rim, in a pale blue halo -->
				<span class="absolute -top-5 -left-5 size-10 rounded-full bg-rich/15"></span>
				<span class="absolute -top-2 -left-2 size-4 rounded-full border-[3px] border-white bg-rich shadow-[0_1px_3px_rgb(0_40_140/0.35)]"></span>
			</div>
			<div class="pointer-events-none absolute top-2.5 left-2.5 max-w-[calc(100%-20px)] rounded-sm bg-white px-2.5 py-2 shadow-[0_1px_4px_rgb(0_0_0/0.18)]">
				<div class="text-[12px] leading-[1.3] font-semibold text-fg">Le Méliès</div>
				<div class="text-[11px] leading-[1.35] text-mute">12 Square Jean Jaurès, Montreuil</div>
				<div class="mt-0.5 text-[11px] leading-[1.35] font-medium text-rich">View larger map</div>
			</div>
			<div class="absolute right-2.5 bottom-2.5 grid overflow-hidden rounded-sm bg-white shadow-[0_1px_4px_rgb(0_0_0/0.18)]">
				<button type="button" class="zoom grid size-7 cursor-pointer place-items-center border-b border-black/10 text-[16px] leading-none text-fg hover:bg-black/5" aria-label="Zoom in" onclick={() => zoomBy(1.4)}>+</button>
				<button type="button" class="zoom grid size-7 cursor-pointer place-items-center text-[16px] leading-none text-fg hover:bg-black/5" aria-label="Zoom out" onclick={() => zoomBy(1 / 1.4)}>−</button>
			</div>
			<div class="pointer-events-none absolute bottom-0 left-0 rounded-tr-sm bg-white/75 px-1.5 py-0.5 text-[9px] leading-[1.3] text-mute">© OpenStreetMap</div>
		</div>
	{/snippet}
	{@render tile('row-span-2', 'google-maps', 'google.com/maps', 'map', map, [['bottom', 'loads before scroll']])}

	{#snippet code()}
		<!-- Iframely's own call: the iframely endpoint of iframe.ly/api with the page's URL and the account's API key
		     (masked, as a key would be in a public gist), which answers with JSON that has the embed's html. Keywords
		     are blue and strings grey; one more colour, the brand's purple, is used once, for the endpoint. -->
		<pre class="m-0 overflow-hidden px-4 py-3 font-mono text-[12px] leading-[1.7] text-fg"><span class="text-rich">const</span> res = <span class="text-rich">await</span> fetch(<span class="text-mute">'<a class="api underline decoration-mute/30 underline-offset-2 hover:text-rich hover:decoration-rich/60" href="https://iframely.com/docs/iframely-api">https://iframe.ly/api/iframely</a>'</span>
  + <span class="text-mute">'?url='</span> + encodeURIComponent(url)
  + <span class="text-mute">'&amp;api_key=••••••••••••3f9a'</span>)
<span class="text-rich">const</span> {'{'} html {'}'} = <span class="text-rich">await</span> res.json()</pre>
	{/snippet}
	{@render tile('col-span-2', 'github', 'gist.github.com', 'code', code, [['bottom', 'runs in our iframe, apart from your page']])}

	{#snippet slides()}
		<!-- A deck of four slides, each a scene of the film with a real still from it; the arrows turn the slides. -->
		<div class="grid h-full grid-cols-2">
			<div class="flex min-w-0 flex-col justify-between p-4">
				<div>
					<div class="truncate font-mono text-[10px] leading-[1.3] text-mute">A Trip to the Moon, scene by scene</div>
					<div class="mt-1 text-[18px] leading-[1.15] font-semibold text-fg">{DECK[slide][0]}</div>
				</div>
				<div class="flex items-center gap-1 font-mono text-[11px] leading-none font-medium text-mute">
					<button type="button" class="zoom -ml-1.5 grid size-6 cursor-pointer place-items-center rounded-xs hover:bg-black/5 hover:text-fg" aria-label="Previous slide" onclick={() => (slide = (slide + DECK.length - 1) % DECK.length)}>‹</button>
					<span aria-live="polite">{slide + 1} / {DECK.length}</span>
					<button type="button" class="zoom grid size-6 cursor-pointer place-items-center rounded-xs hover:bg-black/5 hover:text-fg" aria-label="Next slide" onclick={() => (slide = (slide + 1) % DECK.length)}>›</button>
				</div>
			</div>
			<!-- a press on the picture turns to the next slide too (the › button is the same thing for the keyboard) -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="art relative m-4 ml-0 cursor-pointer overflow-hidden rounded-sm" onclick={() => (slide = (slide + 1) % DECK.length)}>
				{#each DECK as [name, src], i (src)}
					<img class="absolute inset-0 size-full object-cover transition-opacity duration-200 {i === slide ? '' : 'opacity-0'}" {src} alt={i === slide ? `A still from the film: ${name}` : ''} width="480" height="270" loading="lazy" />
				{/each}
			</div>
		</div>
	{/snippet}
	{@render tile('col-span-2', 'canva', 'canva.com', 'slides', slides)}

	{#snippet summary()}
		<div class="grid h-full grid-cols-[110px_1fr]">
			<!-- Wikipedia's own summary of the article (its REST API, page/summary/A_Trip_to_the_Moon): the title, the
			     short description, the lead's first sentences (CC BY-SA, cut by the card to two lines) and the
			     picture: a hand-coloured frame of the film from Wikimedia Commons (public domain) -->
			<div class="art relative m-4 mr-0 overflow-hidden rounded-sm">
				<img class="absolute inset-0 size-full object-cover" src={titleCard} alt="Georges Méliès's drawing, toned blue: a rocket striking the eye of the Moon's startled face" width="330" height="330" />
			</div>
			<div class="px-4 py-3.5">
				<div class="text-[14px] leading-[1.3] font-semibold text-fg">A Trip to the Moon</div>
				<div class="text-[11px] leading-[1.4] text-mute">1902 French short film by Georges Méliès</div>
				<div class="mt-1 line-clamp-2 text-[12px] leading-[1.45] text-mute">
					A Trip to the Moon is a 1902 French science-fiction adventure trick film written, directed and produced by Georges Méliès. Inspired by the
					Jules Verne novel From the Earth to the Moon (1865) and its sequel Around the Moon (1870), the film follows a group of astronomers who
					travel to the Moon in a cannon-propelled capsule, explore the Moon's surface, escape from an underground group of Selenites, and return to
					Earth with a captive Selenite.
				</div>
			</div>
		</div>
	{/snippet}
	{@render tile('col-span-2', 'wikipedia', 'en.wikipedia.org', 'summary card', summary)}
</div>

<style>
	.embed-wall {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		grid-auto-rows: 148px;
		grid-auto-flow: dense;
		/* gaps wide enough to carry a dimension line, and the same room above the top row for its measures */
		gap: 28px;
		padding-top: 28px;
	}
	/* A measure: 14px thick, centred in the 28px gap beside its tile. Two line segments run from the tile's corners to
	   the label, each closed by a tick at its outer end; the label has no ground of its own. */
	.dim {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-rich);
		font:
			10px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
		pointer-events: none;
	}
	.dim::before,
	.dim::after {
		content: '';
		flex: 1;
		opacity: 0.45;
		background: linear-gradient(currentColor, currentColor) center no-repeat;
	}
	.dim.top,
	.dim.bottom {
		left: 0;
		right: 0;
		height: 14px;
	}
	.dim.top {
		top: -21px;
	}
	.dim.bottom {
		bottom: -21px;
	}
	.dim.top::before,
	.dim.bottom::before,
	.dim.top::after,
	.dim.bottom::after {
		height: 8px;
		background-size: 100% 1px;
	}
	.dim.top::before,
	.dim.bottom::before {
		border-left: 1px solid;
	}
	.dim.top::after,
	.dim.bottom::after {
		border-right: 1px solid;
	}
	.dim.top span,
	.dim.bottom span {
		padding: 0 8px;
	}
	.dim.right {
		top: 0;
		bottom: 0;
		right: -21px;
		width: 14px;
		flex-direction: column;
	}
	.dim.right::before,
	.dim.right::after {
		width: 8px;
		background-size: 1px 100%;
	}
	.dim.right::before {
		border-top: 1px solid;
	}
	.dim.right::after {
		border-bottom: 1px solid;
	}
	.dim.right span {
		padding: 8px 0;
		writing-mode: vertical-rl;
		rotate: 180deg;
	}
	/* on the four-column wall the last row (the slides and the summary card) is a little taller than the others */
	@media (min-width: 761px) {
		.embed-wall {
			grid-template-rows: repeat(3, 148px) 184px;
		}
	}
	@media (max-width: 760px) {
		.embed-wall {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-auto-rows: 140px;
			gap: 12px;
			padding-top: 0;
		}
		/* a phone's 12px gaps have no room for measures */
		.dim {
			display: none;
		}
	}
	.win {
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.08),
			0 8px 24px rgb(0 0 0 / calc(0.06 * var(--drop, 1)));
	}
	.bar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 16px 0 12px;
		border-bottom: 1px solid rgb(0 0 0 / 0.07);
		font:
			12px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-fg);
		white-space: nowrap;
	}
	/* the film reports its place about four times a second; the line glides between the reports */
	.run {
		transition: width 0.25s linear;
	}
	/* the X post's like, in X's pink (#f91880) */
	.like {
		cursor: pointer;
		font: inherit;
		color: inherit;
		transition: color 0.15s;
	}
	.like:hover,
	.like.liked {
		color: #f91880;
	}
	.heart {
		position: relative;
		display: grid;
	}
	.heart::before {
		content: '';
		position: absolute;
		inset: -6px;
		border-radius: 999px;
		background: rgb(249 24 128 / 0.1);
		opacity: 0;
		transition: opacity 0.15s;
	}
	.like:hover .heart::before {
		opacity: 1;
	}
	.like.liked .heart svg {
		animation: like-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	@keyframes like-pop {
		0% {
			transform: scale(0.4);
		}
		60% {
			transform: scale(1.3);
		}
	}
	.like:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 3px;
		border-radius: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.like.liked .heart svg {
			animation: none;
		}
	}
	.api:focus-visible,
	.zoom:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: -2px;
	}
	.seek:focus-visible,
	.tune:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}
	.art:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	/* the placeholder picture: flat light grey, as the players in the covers */
	.art {
		background: rgb(0 0 0 / 0.07);
	}
</style>
