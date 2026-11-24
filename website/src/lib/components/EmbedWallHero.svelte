<script lang="ts">
	// The /embeds hero visual: a fork of EmbedWallIcons.svelte (which /embeds-3 keeps as it was), changed so that the
	// wall does not say what the page's blocks say after it:
	//   - the measures are that wall's six, word for word (the gist's, "runs in our iframe", is the design file's
	//     here), and more, so that every gap between tiles has one (the wall's foot has none: it had two for a
	//     while). From the API's answers (asked 2026-11-23): the post's max-width of 550px, the map's shape
	//     (its option gives landscape, portrait or square: "wide, tall or square" here, "orientation by option"
	//     before, which read strangely) and the design file's fixed height or aspect ratio (options), the video's allowfullscreen. Not checked
	//     there: that the table scrolls inside its frame (the share link asked with was not a real one). No measure
	//     names an aspect ratio: the drawings do not have them (the video's picture is not 16:9 here). (For a
	//     while only two measures were left, since four say what blocks 03 and 05 say: the wall was the poorer
	//     for it.)
	//   - the code tile (a gist with the call to our API: block 01 is that call, working) is a Figma file;
	//   - the summary card (Wikipedia's: that is the Preview API, block 06) is a booking page, after Calendly's;
	//   - one player at a time, as block 03 says: starting the film stops the track, and the other way round;
	//   - a tile whose provider is in block 01's scene too has its host as a link: it goes to that block, with that
	//     provider chosen there (lib/endpoint.svelte.ts).
	// And the pictures are drawn here, flat, in grey, near-black and the blue, where that wall has photographs:
	//   - the video's cover is a light drawing of the top of a moon, close (the film itself still plays, as it is), and the player's
	//     play button and progress line are in the blue, not YouTube's red;
	//   - the post is NASA's as it was by its handle (the words are ours, plain facts), its avatar is drawn after
	//     NASA's insignia in the wall's blue, and its picture is a drawing of what the words are about: the Webb
	//     telescope's honeycomb mirror on its sunshield, in greys and whites with one small blue accent (the
	//     covers are greys and whites only; the blue on them is small);
	//   - the slides (Canva's, four stills of the same film) are gone: in their place is a table, after Airtable's.
	// The tiles do not share a subject (for a while they did: one cinema's film, post, programme and tickets).
	// The wall is not that component's grid of equal rows: it is two columns of tiles, each tile with a height of its
	// own (the design file has room for its frames; the post and the map are tall, the track's player low). The
	// two columns' last tiles, the table and the booking page, are of one height and stand on one line.
	// What follows is that component's own note (its summary card, its code tile, its slides and its photographs
	// are not here).
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
	// (Here the poster is not that still: it is drawn in the markup.)
	import { wanted } from '#lib/endpoint.svelte.ts';
	// (the post's avatar is drawn in the markup, after NASA's insignia; the insignia itself, assets/hero/nasa-logo.svg,
	// is not used here)
	// The post's picture: the centres of the telescope mirror's 18 six-sided segments, in five columns of 3, 4, 4
	// (the middle one, less the hole at its centre), 4 and 3. A segment is 20 wide; the columns are 15 apart.
	const SEGMENTS = [3, 4, 5, 4, 3]
		.flatMap((n, i) => Array.from({ length: n }, (_, j) => [150 + (i - 2) * 15, Math.round((66 + (j - (n - 1) / 2) * 17.32) * 100) / 100]))
		.filter(([x, y]) => x !== 150 || y !== 66);
	// the video tile plays only after its button is pressed, and loops until it is pressed again
	let playing = $state(false);
	let player = $state<HTMLVideoElement>();
	let at = $state(0);
	let length = $state(0);
	const toggle = () => (player?.paused ? player.play() : player?.pause());
	// the drawn poster is up until the film is first started
	const cover = $derived(!playing && at === 0);
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
	// The map tile: the roads, buildings, parks, woods and car parks for about 600 m around Space Center Houston
	// (its visitor centre, 29.55184, -95.09794: the east wing, so the exhibits beside it are in view), from OpenStreetMap data (Overpass, ways with highway, building,
	// leisure=park|garden, natural=water|wood and amenity=parking; © OpenStreetMap contributors, ODbL), drawn as a
	// 600×600 SVG with the visitor centre in its middle. A place of the wall's own subject, as the film and NASA's
	// post are. pan: how far it is dragged from there, kept so that the map always covers the tile; zoom: its scale.
	// Its small details, as the metro's marks on the Montreuil map: the outline of the shuttle carrier aircraft on
	// show beside the centre in a stronger tone ("Independence", the shuttle on its back), a rocket mark on the Falcon 9 and on the
	// Saturn V in Rocket Park (the second is a drag away), and a P on the car park.
	// (Until 2026-11-24 it was Montreuil around the cinema Le Méliès, 48.86178, 2.44269, after the film in the video
	// tile: assets/hero/map-montreuil.svg, drawn the same way, with the metro's marks; /embeds-3's wall has it.
	// Times Square, 40.7580, -73.9855, was tried the same day: a known place, but an even grey grid with nothing to
	// look at.)
	import streets from '../assets/hero/map-space-center-houston.svg';
	let mapBox = $state<HTMLDivElement>();
	// As the tile opens the map is a little closer (1.2) and the pin is 32px under the tile's middle, which is the
	// middle of what the place card leaves free; 24px left of it too, so the pin, the aircraft and the Falcon 9 with
	// its label sit in the tile as one group.
	// (Until 2026-11-24: zoom 1, the pin in the tile's very middle, half under the card's shadow.)
	let pan = $state({ x: -24, y: 32 });
	let zoom = $state(1.2);
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
	// The table tile's rows: a task, its status while it is not done, and the day it is due (all made up: a team's
	// list for an offsite). done: which of them are ticked.
	const ROWS = [
		['Book the venue', 'In progress', 'Dec 2'],
		['Send the invites', 'In progress', 'Dec 4'],
		['Order lunch', 'To do', 'Dec 9'],
		['Print the badges', 'To do', 'Dec 11']
	];
	let done = $state([true, false, false, false]);
	// the X post's like
	let liked = $state(false);
	// The design tile's frames: name, width and height of its drawing (shown about twice that size on the full wall,
	// less where the canvas is narrower: see .frame), and the size Figma would give for it. All three are made up.
	const FRAMES: [string, number, number, string][] = [
		['Poster', 38, 54, '760 × 1080'],
		['Ticket', 124, 54, '1240 × 540'],
		['Logo', 54, 54, '512 × 512']
	];
	let frame = $state(1);
	// The canvas can be dragged about and zoomed, as the map (and as Figma's own embed, whose buttons these are after).
	// view: how far the frames are dragged from the middle of the canvas; scale: their zoom, 1 as the tile opens.
	// The frames get larger by their unit (.frame's --u), not by a transform: their names, outline and size label
	// stay the size they are, as in Figma. grip: a pointer held down on the canvas; it is a drag only once it has
	// moved 4px (till then a press on a frame is a click, and selects it).
	let board = $state<HTMLDivElement>();
	let view = $state({ x: 0, y: 0 });
	let scale = $state(1);
	let grip = $state<{ x: number; y: number; sx: number; sy: number; moved: boolean } | null>(null);
	// (the frames' row is 244 units by 54; the unit is .frame's --u, in px here: at least 48px by 32px of the row
	// stays on the canvas)
	const keep = (p: { x: number; y: number }, z = scale) => {
		const w = board?.clientWidth ?? 0;
		const u = Math.max(0.88, Math.min(1.6, w / 360)) * z;
		const mx = Math.max(0, w / 2 + 122 * u - 48);
		const my = Math.max(0, (board?.clientHeight ?? 0) / 2 + 27 * u - 32);
		return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
	};
	const scaleBy = (f: number) => {
		const z = Math.max(0.5, Math.min(4, scale * f));
		view = keep({ x: (view.x * z) / scale, y: (view.y * z) / scale }, z);
		scale = z;
	};
	// The booking tile: the days on offer, the times of a day, and which of them are taken (a made-up pattern). The
	// days are plain weekdays with a date, of no month.
	const DAYS = [
		['Tue', '24'],
		['Wed', '25'],
		['Thu', '26'],
		['Fri', '27'],
		['Mon', '30']
	];
	const TIMES = ['10:00', '11:30', '14:00', '16:30'];
	const taken = (d: number, t: number) => (d + t) % 3 === 0;
	let day = $state(1);
	let time = $state(-1);
	let booked = $state(false);
	const when = $derived(time < 0 ? '' : `${DAYS[day][0]} ${DAYS[day][1]}, ${TIMES[time]}`);
	// (The post's photograph, the slides' stills and the summary card's picture are not used here: the notes on the
	// NASA pictures tried, and on the others, are in EmbedWallIcons.svelte.)
</script>

{#snippet play(size: number, fill: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" class="block" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" {fill} /></svg>
{/snippet}

<!-- A tile is a white window: a hairline ring and a soft shadow, a mono bar (the provider's favicon and host, and the
     kind in grey), then the embed. notes: the measures drawn outside the window, as in EmbedWall. -->
<!-- to: the provider's id in block 01's scene, where it has one: the host is then a link to that block, and the
     scene there shows that provider. -->
<!-- size: the tile's height on the full wall (--h) and on a phone (--hp), and its place in the phone's one column
     (--o), as a style. -->
{#snippet tile(size: string, icon: string, host: string, kind: string, body: import('svelte').Snippet, notes: [Side, string][] = [], to = '')}
	<div class="cell relative min-h-0 min-w-0" style={size}>
		<div class="win flex h-full flex-col overflow-hidden rounded-lg bg-white">
			<div class="bar">
				<img class="size-4 flex-none" src={logo(icon)} alt="" width="16" height="16" />
				{#if to}
					<a class="go truncate" href="#developers" title="See the API call for it" onclick={() => (wanted.id = to)}>{host}</a>
				{:else}
					<span class="truncate">{host}</span>
				{/if}
				<span class="ml-auto text-mute">{kind}</span>
			</div>
			<div class="relative min-h-0 flex-1 overflow-hidden">{@render body()}</div>
		</div>
		{#each notes as [side, text] (side)}
			<div class="dim {side}"><span>{text}</span></div>
		{/each}
	</div>
{/snippet}

<div class="embed-wall" role="group" aria-label="Kinds of embeds: a video, an audio track, a social post, a map, a design file, a table and a booking page">
	{#snippet video()}
		<!-- a short film, small and much compressed, black and white so it sits with the grey pictures around it -->
		<!-- A drawn player, not YouTube's: its poster until the button is pressed, then the film runs in a loop and the
		     button, title and progress line are gone; a press on the playing picture stops it again. -->
		<button type="button" class="art group absolute inset-4 block cursor-pointer overflow-hidden rounded-sm" aria-label={playing ? 'Pause the video' : 'Play the video'} onclick={toggle}>
			<video
				bind:this={player}
				bind:currentTime={at}
				bind:duration={length}
				class="absolute inset-0 size-full object-cover {cover ? 'invisible' : ''}"
				muted
				loop
				playsinline
				preload="metadata"
				onplay={() => {
					// (one player at a time: the track stops)
					playing = true;
					tune?.pause();
				}}
				onpause={() => (playing = false)}
			>
				<source src={filmAv1} type="video/mp4; codecs=av01.0.00M.08" />
				<source src={film} type="video/mp4" />
			</video>
			<!-- the poster, as a picture over the film until the first play (the video's own poster attribute is dropped as
			     soon as the time binding touches the film) -->
			<!-- (Here the poster is drawn, light, as the post's picture: a white moon with grey craters and a grey shade
			     along one side, on a light grey sky with a few stars. The blue on it is the play button's.
			     (It had a face, the film's rocket in the blue and a near-black sky for a while: too childish, too
			     black.) -->
			<!-- (While the poster is up the film under it is hidden: its dark first frame showed as a hairline along the
			     poster's right and bottom edges.) -->
			{#if cover}
				<!-- (The moon is seen close: only its top, a wide arc along the foot of the poster, in the middle, under the
				     play button. The drawing is held by its foot, so a box of another shape cuts the sky, not the moon.
				     It was a whole small moon in the middle, behind the button, before.) -->
				<!-- (It was shown a little closer, by 1.15, for a moment: rolled back.) -->
				<svg class="absolute inset-0 size-full" viewBox="0 0 480 270" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
					<defs><clipPath id="wall-moon"><circle cx="240" cy="518" r="320" /></clipPath></defs>
					<rect width="480" height="270" fill="var(--cover)" />
					<g fill="#c4c4cb"><circle cx="52" cy="122" r="2" /><circle cx="176" cy="128" r="2.500" /><circle cx="136" cy="98" r="1.500" /><circle cx="400" cy="158" r="2" /><circle cx="426" cy="110" r="2.500" /><circle cx="352" cy="96" r="1.500" /><circle cx="448" cy="170" r="1.500" /><circle cx="28" cy="174" r="1.500" /></g>
					<!-- A ship in orbit, white and grey: its path is a dotted arc about the moon's own centre, a little out
					     from the ground (it runs behind the play button in the middle), and the ship is on it to the
					     left, nose along the path, toward the light. It recalls the film's: a cannon shell, short and fat,
					     with a pointed nose, a flat back with a rim, riveted bands around the body and a porthole; its
					     underside is shaded. (It had an engine bell and a pair of solar panels before.) -->
					<circle cx="240" cy="518" r="350" fill="none" stroke="#cbcbd2" stroke-dasharray="1.500 5" stroke-linecap="round" />
					<defs><clipPath id="wall-shell"><path d="M-13-7.500H7Q16-6.500 20 0 16 6.500 7 7.500h-20z" /></clipPath></defs>
					<g transform="translate(130 185.700) rotate(-18.300) scale(1.350)" stroke-linejoin="round">
						<path d="M-13-7.500H7Q16-6.500 20 0 16 6.500 7 7.500h-20z" fill="#fff" />
						<rect x="-13" y="2.800" width="34" height="5" fill="#dcdce1" clip-path="url(#wall-shell)" />
						<path d="M-13-7.500H7Q16-6.500 20 0 16 6.500 7 7.500h-20z" fill="none" stroke="#a9a9b3" stroke-width="0.700" />
						<rect x="-15" y="-8.300" width="2.600" height="16.600" rx="0.800" fill="#c4c4cb" stroke="#a9a9b3" stroke-width="0.700" />
						<path d="M-6.500-7.500v15M7-7.500v15" stroke="#a9a9b3" stroke-width="0.700" />
						<g fill="#a9a9b3"><circle cx="-8.300" cy="-4.800" r="0.450" /><circle cx="-8.300" cy="0" r="0.450" /><circle cx="-8.300" cy="4.800" r="0.450" /><circle cx="5.200" cy="-4.800" r="0.450" /><circle cx="5.200" cy="0" r="0.450" /><circle cx="5.200" cy="4.800" r="0.450" /><circle cx="8.800" cy="-4.600" r="0.450" /><circle cx="8.800" cy="0" r="0.450" /><circle cx="8.800" cy="4.600" r="0.450" /></g>
						<circle cx="-0.700" cy="-1" r="2.700" fill="#c4c4cb" stroke="#a9a9b3" stroke-width="0.700" />
						<circle cx="-0.700" cy="-1" r="1.300" fill="#8f8f9a" />
					</g>
					<!-- The light is from the upper right. The shade along the left of the arc is in two steps (a grey edge,
					     then a paler band), and the lit ground fades a little toward it. A crater is a grey patch with a
					     paler floor set off toward the lower left, so its shaded wall is a crescent on the side of the
					     light; the smallest are plain dots. All of them are flattened, as on ground seen at a slant, and
					     some run off the foot. Three pale patches are the seas. -->
					<defs>
						<radialGradient id="wall-moon-lit" cx="0.62" cy="0" r="0.5">
							<stop offset="0" stop-color="#fff" />
							<stop offset="0.5" stop-color="#fbfbfc" />
							<stop offset="1" stop-color="#ededf0" />
						</radialGradient>
					</defs>
					{#snippet crater(x: number, y: number, r: number)}
						<ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill="#d5d5dc" />
						<ellipse cx={x - r * 0.17} cy={y + r * 0.12} rx={r * 0.85} ry={r * 0.5} fill="#ebebef" />
					{/snippet}
					<circle cx="240" cy="518" r="320" fill="#d2d2d9" />
					<g clip-path="url(#wall-moon)">
						<circle cx="260" cy="515" r="320" fill="#e3e3e8" />
						<circle cx="280" cy="512" r="320" fill="url(#wall-moon-lit)" />
						<g fill="#f1f1f4">
							<ellipse cx="262" cy="244" rx="48" ry="13" transform="rotate(-4 262 244)" />
							<ellipse cx="158" cy="252" rx="30" ry="9" transform="rotate(8 158 252)" />
							<ellipse cx="352" cy="252" rx="28" ry="8" transform="rotate(-8 352 252)" />
						</g>
						{@render crater(302, 246, 20)}
						{@render crater(176, 252, 15)}
						{@render crater(236, 226, 9)}
						{@render crater(372, 258, 12)}
						{@render crater(118, 264, 11)}
						{@render crater(258, 268, 8)}
						{@render crater(338, 230, 5)}
						{@render crater(208, 264, 6)}
						{@render crater(146, 236, 4.5)}
						{@render crater(414, 264, 5)}
						<g fill="#dcdce2"><ellipse cx="270" cy="213" rx="2.500" ry="1.600" /><ellipse cx="200" cy="222" rx="2.500" ry="1.600" /><ellipse cx="322" cy="220" rx="2" ry="1.300" /><ellipse cx="250" cy="246" rx="2.500" ry="1.600" /><ellipse cx="148" cy="262" rx="2" ry="1.300" /><ellipse cx="344" cy="264" rx="2.500" ry="1.600" /><ellipse cx="392" cy="246" rx="2" ry="1.300" /><ellipse cx="104" cy="246" rx="2" ry="1.300" /><ellipse cx="222" cy="248" rx="2" ry="1.300" /><ellipse cx="290" cy="222" rx="2" ry="1.300" /><ellipse cx="84" cy="258" rx="2.500" ry="1.600" /></g>
					</g>
				</svg>
			{/if}
			<!-- a light dark veil over the film, so the play button and the progress line read on any frame -->
			<!-- (it is a little darker while the film is on hold; the drawn poster needs none) -->
			<div class="absolute inset-0 transition-colors duration-200 {playing ? 'bg-black/10' : cover ? '' : 'bg-black/35'}"></div>
			<!-- stopped, the player shows the video's title across its top, as YouTube's does, and YouTube's own play button:
			     the rounded tile with a white triangle (here in the blue, not YouTube's red) -->
			<!-- (the title, with a made-up channel's avatar, also comes back while the pointer is over the playing film) -->
			<!-- (on the light poster the title is dark and has no shade behind it; over the film it is white on a shade) -->
			<span class="absolute inset-x-0 top-0 flex items-center gap-2.5 px-3.5 pt-3 pb-9 text-left transition-opacity duration-200 {cover ? '' : 'bg-linear-to-b from-black/60 to-transparent'} {playing ? 'opacity-0 group-hover:opacity-100' : ''}">
				<i class="grid size-7 flex-none place-items-center rounded-full font-serif text-[15px] leading-none font-semibold not-italic {cover ? 'bg-fg text-white' : 'bg-white text-black'}">M</i>
				<!-- (a line of 1.5: with a line of 1 the cut-off for long titles also cut the letters' tails and accents) -->
				<span class="truncate text-[14px] leading-[1.5] font-medium {cover ? 'text-fg' : 'text-white'}">A Trip to the Moon (1902) - Georges Méliès</span>
			</span>
			{#if !playing}
				<svg class="absolute top-1/2 left-1/2 -translate-1/2" width="68" height="48" viewBox="0 0 68 48" aria-hidden="true">
					<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.950-1.480-16.260z" fill="var(--color-rich)" />
					<path d="M45 24 27 14v20z" fill="#fff" />
				</svg>
			{/if}
			<!-- Once the film has been started: the progress line, in the blue as the play button, running while it plays, and under it the
			     player's controls (drawn, they do nothing). Both show while it is on hold, and while the pointer is over
			     the playing film; with the pointer away the playing film is bare. -->
			{#if playing || at > 0}
				<span class="absolute inset-x-0 bottom-0 block bg-linear-to-t from-black/70 to-transparent px-3.5 pt-9 pb-2.5 text-left transition-opacity duration-200 {playing ? 'opacity-0 group-hover:opacity-100' : ''}">
					<span class="block h-[3px] rounded-sm bg-white/35"><span class="run block h-full rounded-sm bg-rich" style="width:{length ? (at / length) * 100 : 0}%"></span></span>
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
							onplay={() => {
								// (one player at a time: the film stops)
								tuneOn = true;
								player?.pause();
							}}
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
						<!-- (the words have no room where the wall's two columns are narrow) -->
						<span class="min-[761px]:max-[1100px]:hidden">Save on Spotify</span>
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
	{#snippet post()}
		<div class="flex h-full flex-col p-3.5">
			<div class="flex items-center gap-2">
				<!-- the avatar: drawn here after NASA's insignia, not the insignia itself: a disc in our blue with a few
				     stars, a white orbit, a near-black wing where theirs is red, and the four letters -->
				<svg class="size-7 flex-none" viewBox="0 0 28 28" aria-hidden="true">
					<circle cx="14" cy="14" r="14" fill="var(--color-rich)" />
					<g fill="#fff"><circle cx="7" cy="7.500" r="0.700" /><circle cx="11.500" cy="4.500" r="0.500" /><circle cx="21" cy="6" r="0.600" /><circle cx="22.500" cy="20" r="0.700" /><circle cx="6" cy="20.500" r="0.600" /><circle cx="16" cy="24" r="0.500" /></g>
					<ellipse cx="14" cy="14" rx="11.500" ry="4.200" transform="rotate(-24 14 14)" fill="none" stroke="#fff" stroke-width="0.800" />
					<path d="M3.500 20 19.500 5l-3.600 8.600 8.600-4.400" fill="none" stroke="#131316" stroke-width="1.300" stroke-linecap="round" stroke-linejoin="round" />
					<!-- (the letters have an edge in the disc's blue, so the wing and the orbit stop short of them) -->
					<text x="14" y="16.700" text-anchor="middle" font-size="7.400" font-weight="800" letter-spacing="-0.200" fill="#fff" stroke="var(--color-rich)" stroke-width="1.400" stroke-linejoin="round" paint-order="stroke">NASA</text>
				</svg>
				<div>
					<div class="text-[12px] leading-[1.3] font-semibold text-fg">NASA</div>
					<div class="text-[11px] leading-[1.3] text-mute">@NASA · Jul 12</div>
				</div>
			</div>
			<!-- the words are ours, plain facts about the telescope (18 segments, 6.5 m across): not a post of NASA's -->
			<div class="my-2.5 text-[13px] leading-[1.45] text-fg">The Webb telescope’s primary mirror: 18 hexagonal segments, 6.5 meters across.</div>
			<div class="cover relative min-h-[60px] flex-1 overflow-hidden rounded-sm">
				<!-- the picture, drawn in greys and whites only, as the video's poster: the Webb telescope from the front,
				     its honeycomb mirror standing on the sunshield. The one blue in it is small: one segment of the
				     mirror. (Before it, each for other words: a capsule under three parachutes, striped in the blue
				     and then grey, "still not happy"; the Earth's limb with the Moon and a part of the Station, where
				     the Earth in the blue looked bad and white it was the video's moon again.) All of it is in the
				     middle of the drawing: the picture's box is nearly square on the full wall and low and wide on a
				     phone, and shows the middle only. -->
				<!-- (Its lines are thin and pale: the edges of the segments and of the sunshield and the struts were darker
				     and thicker at first, and too prominent. It was shown closer for a while, by 1.15 and then by 1.3
				     with the sunshield's ends running off the sides; then the whole drawing again, and a step further
				     out, by 0.87. Now it is closer again, by 1.18 (1.3 was a little too close, 1.07 too far), and
				     held by its foot, which cuts the telescope's lower part: the box below takes 254 by 136 of the
				     drawing's 300 by 160 and ends at 134 (at 128 the telescope stood too low), through the front of
				     the sunshield, so the mirror is whole and the sunshield runs off the foot and, on the full wall,
				     the two sides.) -->
				<svg class="absolute inset-0 size-full" viewBox="23 -2 254 136" preserveAspectRatio="xMidYMax slice" role="img" aria-label="A drawing: a space telescope, its mirror of eighteen six-sided segments standing on a wide sunshield">
					<defs>
						<linearGradient id="wall-mirror" gradientUnits="userSpaceOnUse" x1="190" y1="24" x2="112" y2="108">
							<stop offset="0" stop-color="#fff" />
							<stop offset="1" stop-color="#f4f4f6" />
						</linearGradient>
					</defs>
					<g fill="#c4c4cb"><circle cx="78" cy="30" r="1.300" /><circle cx="96" cy="72" r="1" /><circle cx="214" cy="34" r="1.300" /><circle cx="228" cy="84" r="1" /><circle cx="196" cy="14" r="1" /><circle cx="70" cy="98" r="1" /></g>
					<!-- the sunshield: a long six-cornered sheet seen at a slant, three layers of it one under another, the
					     top one with a grey edge, a shaded left end (the light is from the upper right, as on the video's
					     poster) and two faint folds -->
					<path d="M65 123l63-17h44l63 17-63 17h-44z" fill="#cbcbd2" />
					<path d="M65 120.500l63-17h44l63 17-63 17h-44z" fill="#dadadf" />
					<path d="M65 118l63-17h44l63 17-63 17h-44z" fill="#f6f6f8" />
					<path d="M65 118l63-17v34z" fill="#e6e6ea" />
					<path d="M128 101v34M172 101v34" stroke="#dcdce1" stroke-width="0.500" />
					<path d="M65 118l63-17h44l63 17-63 17h-44z" fill="none" stroke="#c8c8cf" stroke-width="0.500" stroke-linejoin="round" />
					<!-- the mirror stands on it, on a grey foot: the segments, lit from the upper right, with the dark hole in
					     the middle; one of them is in the blue (the picture's one accent) -->
					<path d="M139 106h22l3 8h-28z" fill="#b9b9c0" />
					<path d="M140.700 66l4.650-8.050h9.300l4.650 8.050-4.650 8.050h-9.300z" fill="#c4c4cb" />
					{#each SEGMENTS as [x, y] (x + ' ' + y)}
						<path d="M{x - 9.3} {y}l4.650-8.050h9.300l4.650 8.050-4.650 8.050h-9.300z" fill={x === 165 && y < 60 && y > 50 ? 'var(--color-rich)' : 'url(#wall-mirror)'} stroke="#c8c8cf" stroke-width="0.500" stroke-linejoin="round" />
					{/each}
					<!-- the small second mirror, held before the middle on three thin struts -->
					<path d="M150 23v43M130.350 100 150 66M169.650 100 150 66" fill="none" stroke="#a9a9b3" stroke-width="0.600" stroke-linecap="round" />
					<circle cx="150" cy="66" r="4.200" fill="#9a9aa4" />
					<circle cx="150" cy="66" r="1.600" fill="#e3e3e8" />
				</svg>
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
						<!-- (the views, the last of the four, and the two marks after them have no room in a narrow tile) -->
						<span class="flex items-center gap-1 {i === 3 ? 'max-[1100px]:hidden' : ''}">
							<svg class="flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path {d} /></svg>
							{n}
						</span>
					{/if}
				{/each}
				<svg class="ml-auto flex-none max-[1100px]:hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4.500L6 20z" /></svg>
				<svg class="-ml-2 flex-none max-[1100px]:hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M12 4 8 8M12 4l4 4M5 14v5h14v-5" /></svg>
			</div>
		</div>
	{/snippet}
	{#snippet map()}
		<!-- A real map, drawn flat in our blue-greys: the roads (the main ones named), buildings, footpaths, parks,
		     woods and car parks around Space Center Houston, from OpenStreetMap (hence the credit in the corner).
		     It can be dragged about, and the + and − buttons zoom it; the place card is drawn after Google's and
		     does nothing. -->
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
				<div class="text-[12px] leading-[1.3] font-semibold text-fg">Space Center Houston</div>
				<div class="text-[11px] leading-[1.35] text-mute">1601 E NASA Pkwy, Houston, TX</div>
				<div class="mt-0.5 text-[11px] leading-[1.35] font-medium text-rich">View larger map</div>
			</div>
			<div class="absolute right-2.5 bottom-2.5 grid overflow-hidden rounded-sm bg-white shadow-[0_1px_4px_rgb(0_0_0/0.18)]">
				<button type="button" class="zoom grid size-7 cursor-pointer place-items-center border-b border-black/10 text-[16px] leading-none text-fg hover:bg-black/5" aria-label="Zoom in" onclick={() => zoomBy(1.4)}>+</button>
				<button type="button" class="zoom grid size-7 cursor-pointer place-items-center text-[16px] leading-none text-fg hover:bg-black/5" aria-label="Zoom out" onclick={() => zoomBy(1 / 1.4)}>−</button>
			</div>
			<div class="pointer-events-none absolute bottom-0 left-0 rounded-tr-sm bg-white/75 px-1.5 py-0.5 text-[9px] leading-[1.3] text-mute">© OpenStreetMap</div>
		</div>
	{/snippet}
	{#snippet design()}
		<!-- A Figma file, drawn: three frames on its grey canvas, each with its name over it. One is selected, as in
		     Figma: a blue outline with handles, its name in blue and its size under it. A press on another frame
		     selects that one. The canvas can be dragged about; the + and − buttons zoom it, and the button in the top
		     corner puts it back as it was. -->
		<!-- (the canvas is a size container: the frames are drawn as large as its width lets them, see .frame) -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={board}
			class="canvas absolute inset-3 touch-none overflow-hidden rounded-sm select-none {grip?.moved ? 'held cursor-grabbing' : 'cursor-grab'}"
			onpointerdown={(e) => {
				if ((e.target as HTMLElement).closest('.ctl')) return;
				grip = { x: e.clientX - view.x, y: e.clientY - view.y, sx: e.clientX, sy: e.clientY, moved: false };
			}}
			onpointermove={(e) => {
				if (!grip) return;
				if (!e.buttons && e.pointerType === 'mouse') return void (grip = null);
				if (!grip.moved) {
					if (Math.hypot(e.clientX - grip.sx, e.clientY - grip.sy) < 4) return;
					grip.moved = true;
					e.currentTarget.setPointerCapture(e.pointerId);
				}
				view = keep({ x: e.clientX - grip.x, y: e.clientY - grip.y });
			}}
			onpointerup={() => (grip = null)}
			onpointercancel={() => (grip = null)}
		>
			<!-- The zoom buttons, after Figma's embed (not the map's): one small white rounded block with a soft shadow in
			     the bottom corner, + over − in thin lines, with no line between. The canvas is a flat grey (the wall's --cover, as the video's poster and the post's picture), set
			     in from the tile's edges as the other tiles' pictures (for a while it filled the tile). -->
			<!-- Figma's full-screen button, in the top corner: here it puts the canvas back as the tile opens (in Figma's
			     embed it opens the file). It is as small as the zoom buttons. (It was dropped for a while.) -->
			<div class="ctl fig absolute top-2.5 right-2.5 z-10">
				<button
					type="button"
					aria-label="Put the canvas back"
					onclick={() => {
						view = { x: 0, y: 0 };
						scale = 1;
					}}
				>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 2h3v3M10 2 6.800 5.200M5 10H2V7M2 10l3.200-3.200" /></svg>
				</button>
			</div>
			<div class="ctl fig absolute right-2.5 bottom-2.5 z-10">
				<button type="button" aria-label="Zoom in" onclick={() => scaleBy(1.4)}>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true"><path d="M6 2v8M2 6h8" /></svg>
				</button>
				<button type="button" aria-label="Zoom out" onclick={() => scaleBy(1 / 1.4)}>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true"><path d="M2 6h8" /></svg>
				</button>
			</div>
			<!-- the frames' row, hung by its middle on the middle of the canvas, then moved by view -->
			<div class="absolute top-1/2 left-1/2 flex items-center {grip?.moved ? '' : 'transition-transform duration-200'}" style="--z:{scale};transform:translate(calc(-50% + {view.x}px),calc(-50% + {view.y}px))">
			{#each FRAMES as [name, w, h, size], i (name)}
				<button type="button" class="frame" class:picked={i === frame} style="--w:{w};--t:{h}" aria-pressed={i === frame} aria-label="Select the frame {name}" onclick={() => (frame = i)}>
					<span class="tag">{name}</span>
					<svg viewBox="0 0 {w} {h}" aria-hidden="true">
						<!-- the mark all three frames carry: a pinwheel of four quarter discs about a point, in the blue,
						     near-black, a paler blue and grey (the frames had a blue disc and an app's icon with a crescent) -->
						<!-- (blue: the mark for a blue ground, its blues in white) -->
						{#snippet wheel(x: number, y: number, r: number, blue = false)}
							<path d="M{x - r} {y}v{-r}a{r} {r} 0 0 1 {r} {r}z" fill={blue ? '#fff' : 'var(--color-rich)'} />
							<path d="M{x} {y - r}h{r}a{r} {r} 0 0 1 {-r} {r}z" fill="#131316" />
							<path d="M{x + r} {y}v{r}a{r} {r} 0 0 1 {-r} {-r}z" fill={blue ? '#fff' : 'var(--color-rich)'} opacity="0.45" />
							<path d="M{x} {y + r}h{-r}a{r} {r} 0 0 1 {r} {-r}z" fill={blue ? '#fff' : '#c9c9ce'} opacity={blue ? 0.75 : 1} />
						{/snippet}
						{#if i === 0}
							<!-- the poster: on a blue ground, the page's blue, so the track's blue player at the wall's other corner
							     is not the wall's only block of colour (2026-11-24). The mark, larger and without a picture's box
							     about it, the title in white, two lines and a near-black label.
							     (It was a white sheet: a grey picture with the mark in it, a black title, grey lines and a blue label:
							     rect 4 4 30 22 #ececef, wheel(19, 15, 5), the title #131316, the lines #c9c9ce, the label blue.) -->
							<rect width={w} height={h} fill="var(--color-rich)" />
							{@render wheel(19, 16, 8, true)}
							<rect x="4" y="31" width="30" height="3" fill="#fff" />
							<rect x="4" y="37" width="22" height="2" fill="#fff" opacity="0.5" />
							<rect x="4" y="41.500" width="26" height="2" fill="#fff" opacity="0.5" />
							<rect x="4" y="47" width="12" height="3" fill="#131316" />
						{:else if i === 1}
							<!-- the ticket: a stub with the mark, torn off along a dashed line; the title, two lines and a bar code -->
							{@render wheel(17, 20, 6.5)}
							<rect x="9" y="36" width="16" height="2.500" fill="#c9c9ce" />
							<rect x="11" y="41.500" width="12" height="2.500" fill="#c9c9ce" />
							<path d="M34 0v54" stroke="#c9c9ce" stroke-width="1" stroke-dasharray="3 3" />
							<rect x="43" y="10" width="52" height="5" fill="#131316" />
							<rect x="43" y="20" width="38" height="3" fill="#c9c9ce" />
							<rect x="43" y="27" width="46" height="3" fill="#c9c9ce" />
							<path d="M43 37v9M46 37v9M48 37v9M52 37v9M55 37v9M57 37v9M61 37v9M63 37v9M67 37v9M70 37v9M72 37v9M76 37v9M79 37v9M81 37v9M85 37v9M88 37v9M90 37v9M94 37v9M97 37v9M99 37v9M103 37v9M106 37v9M108 37v9M112 37v9" stroke="#131316" stroke-width="1.5" />
						{:else}
							<!-- the logo: the mark alone -->
							{@render wheel(27, 27, 14)}
						{/if}
					</svg>
					{#if i === frame}<span class="size">{size}</span>{/if}
				</button>
			{/each}
			</div>
		</div>
	{/snippet}
	{#snippet table()}
		<!-- A table, drawn after an Airtable grid view: a head and four rows of a task, its status and its due day, with
		     hairlines between rows and columns. The tick at a row's left works: a ticked task is struck out and its
		     status is "Done", in the blue. -->
		<!-- (Canva's slides were here.) -->
		<div class="sheet absolute inset-3 overflow-hidden rounded-sm bg-white" role="table" aria-label="Offsite tasks">
			<div class="line head" role="row">
				<span role="columnheader" aria-label="Done"></span>
				<span role="columnheader">Task</span>
				<span role="columnheader">Status</span>
				<span role="columnheader">Due</span>
			</div>
			{#each ROWS as [name, status, due], r (name)}
				<div class="line" class:done={done[r]} role="row">
					<span role="cell">
						<button type="button" class="tick" role="checkbox" aria-checked={done[r]} aria-label="Done: {name}" onclick={() => (done[r] = !done[r])}>
							<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.500 6.500 5 9l4.500-6" /></svg>
						</button>
					</span>
					<span class="task truncate" role="cell">{name}</span>
					<span role="cell"><i class="pill" class:on={done[r]} class:idle={!done[r] && status === 'To do'}>{done[r] ? 'Done' : status}</i></span>
					<span class="due" role="cell">{due}</span>
				</div>
			{/each}
		</div>
	{/snippet}

	<!-- The wall: two columns of tiles; the post and the map share a row of the second. (On a phone it is one column:
	     the tiles go by their --o, and the post and the map still share a row.) -->
	<div class="col">
		{@render tile('--h:324px;--hp:292px;--o:1', 'youtube', 'youtube.com', 'video', video, [['top', 'aspect ratio kept'], ['right', 'height reserved before load'], ['bottom', 'fullscreen allowed']], 'youtube')}
		{@render tile('--h:232px;--hp:204px;--o:4', 'figma', 'figma.com', 'design', design, [['right', 'fixed height or aspect ratio'], ['bottom', 'runs in our iframe, apart from your page']], 'figma')}
		{@render tile('--h:184px;--hp:184px;--o:5', 'airtable', 'airtable.com', 'table', table, [['right', 'scrolls inside its frame']])}
	</div>
	<div class="col">
		{@render tile('--h:148px;--hp:148px;--o:2', 'spotify', 'spotify.com', 'audio', audio, [['top', '100% width · responsive']], 'spotify')}
		<div class="pair" style="--o:3">
			{@render tile('--h:408px;--hp:292px', 'x', 'x.com', 'post', post, [['top', 'max-width 550px'], ['right', 'height set by the post'], ['bottom', 'layout shift 0']], 'x')}
			{@render tile('--h:408px;--hp:292px', 'google-maps', 'google.com/maps', 'map', map, [['top', 'wide, tall or square'], ['bottom', 'loads before scroll']])}
		</div>
		{@render tile('--h:184px;--hp:180px;--o:6', 'calendly', 'calendly.com', 'booking', booking)}
	</div>

	{#snippet booking()}
		<!-- A booking page, drawn after Calendly's: what is booked at the left; at the right the days, the chosen day's
		     times (some are taken), and a foot that names the choice and confirms it. It all works, and nothing is
		     sent anywhere. -->
		<div class="grid h-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
			<div class="flex min-w-0 flex-col p-4">
				<!-- (what is booked is an everyday thing, with a made-up host: it was a tour of the map tile's cinema) -->
				<div class="truncate font-mono text-[10px] leading-[1.3] text-mute">Alex Morgan</div>
				<div class="mt-1 text-[16px] leading-[1.2] font-semibold text-fg">Intro call</div>
				<div class="mt-auto flex items-center gap-1.5 text-[11px] leading-none text-mute">
					<svg class="flex-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
					30 min · video call
				</div>
			</div>
			<div class="flex min-w-0 flex-col gap-2 border-l border-black/7 p-3.5">
				{#if booked}
					<div class="m-auto text-center" aria-live="polite">
						<div class="text-[14px] leading-[1.3] font-semibold text-fg">You are booked</div>
						<div class="mt-0.5 text-[12px] leading-[1.4] text-mute">{when}</div>
						<button
							type="button"
							class="zoom mt-2 cursor-pointer rounded-xs px-1 text-[11px] leading-[1.6] font-medium text-rich"
							onclick={() => {
								booked = false;
								time = -1;
							}}>Pick another time</button
						>
					</div>
				{:else}
					<div class="grid grid-cols-5 gap-1.5" role="group" aria-label="Day">
						{#each DAYS as [name, date], d (date)}
							<button
								type="button"
								class="day"
								aria-pressed={d === day}
								onclick={() => {
									day = d;
									time = -1;
								}}><span>{name}</span>{date}</button
							>
						{/each}
					</div>
					<div class="grid grid-cols-4 gap-1.5" role="group" aria-label="Time">
						{#each TIMES as t, s (t)}
							<button type="button" class="slot" disabled={taken(day, s)} aria-pressed={s === time} onclick={() => (time = s)}>{t}</button>
						{/each}
					</div>
					<div class="mt-auto flex items-center justify-between gap-2">
						<span class="truncate text-[11px] leading-none text-mute" aria-live="polite">{when || 'Pick a time'}</span>
						<button type="button" class="confirm" disabled={time < 0} onclick={() => (booked = true)}>Confirm</button>
					</div>
				{/if}
			</div>
		</div>
	{/snippet}
</div>

<style>
	/* two columns of tiles, each tile as high as its --h; the two columns' heights add up to the same */
	.embed-wall {
		/* the one grey behind the drawn pictures: the video's poster, the post's picture and the design file's canvas */
		/* (the greys of those drawings lean a little to the blue, as the map's beside them do; plain greys were
		   tried and put back) */
		--cover: #e9e9eb;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		/* gaps wide enough to carry a dimension line, and the same room above the top row for its measures */
		gap: 28px;
		padding-top: 28px;
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 28px;
		min-width: 0;
	}
	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 28px;
	}
	.cell {
		height: var(--h);
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
	/* a phone: one column, the tiles in the order of their --o and as high as their --hp */
	@media (max-width: 760px) {
		.embed-wall {
			display: flex;
			flex-direction: column;
			gap: 12px;
			padding-top: 0;
		}
		.col {
			display: contents;
		}
		.pair {
			gap: 12px;
		}
		.cell,
		.pair {
			order: var(--o);
		}
		.cell {
			height: var(--hp);
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
	/* a tile's host, where it is a link to block 01: as the plain host until the pointer is on it */
	.go {
		text-decoration: underline transparent;
		text-underline-offset: 3px;
		transition:
			color 0.15s,
			text-decoration-color 0.15s;
	}
	.go:hover {
		color: var(--color-rich);
		text-decoration-color: currentColor;
	}
	.go:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
		border-radius: 2px;
	}
	/* The design tile's frames: white sheets on the canvas, each with its name over its left corner. The one selected
	   has Figma's blue outline with a handle on each corner (drawn as one layer of eight squares, white on blue),
	   and its size on a blue label under it. */
	/* Their size: a frame's drawing is --w by --t units, and a unit (--u) is as large as the canvas's width lets it
	   be (the three frames and the two gaps between them are 244 units wide, and take about two thirds of the
	   canvas: 360), at most 1.6px and at least 0.88px, times the zoom (--z, set on their row). The script's keep()
	   has the same sum. */
	.canvas {
		container-type: inline-size;
	}
	.canvas,
	.cover {
		background: var(--cover);
	}
	.fig {
		display: grid;
		overflow: hidden;
		border-radius: 6px;
		background: #fff;
		box-shadow:
			0 1px 2px rgb(0 0 0 / 0.08),
			0 3px 10px rgb(0 0 0 / 0.08);
		color: var(--color-fg);
	}
	.fig button {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.fig button:hover {
		background: rgb(0 0 0 / 0.05);
	}
	.fig button:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: -2px;
		border-radius: 6px;
	}
	.frame {
		--u: calc(clamp(0.88px, 100cqw / 360, 1.6px) * var(--z, 1));
		width: calc(var(--u) * var(--w));
		height: calc(var(--u) * var(--t));
		position: relative;
		flex: none;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
		cursor: pointer;
		transition:
			width 0.2s,
			height 0.2s,
			margin-left 0.2s;
	}
	.canvas.held .frame {
		cursor: grabbing;
	}
	@media (prefers-reduced-motion: reduce) {
		.frame {
			transition: none;
		}
	}
	.frame svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.frame + .frame {
		margin-left: calc(var(--u) * 14);
	}
	.frame:hover {
		box-shadow: 0 0 0 1px var(--color-rich);
	}
	.frame.picked {
		box-shadow: 0 0 0 1.5px var(--color-rich);
	}
	.frame.picked::before {
		content: '';
		position: absolute;
		inset: -3.5px;
		pointer-events: none;
		background:
			linear-gradient(#fff, #fff) left 1px top 1px / 4px 4px no-repeat,
			linear-gradient(#fff, #fff) right 1px top 1px / 4px 4px no-repeat,
			linear-gradient(#fff, #fff) left 1px bottom 1px / 4px 4px no-repeat,
			linear-gradient(#fff, #fff) right 1px bottom 1px / 4px 4px no-repeat,
			linear-gradient(var(--color-rich), var(--color-rich)) left top / 6px 6px no-repeat,
			linear-gradient(var(--color-rich), var(--color-rich)) right top / 6px 6px no-repeat,
			linear-gradient(var(--color-rich), var(--color-rich)) left bottom / 6px 6px no-repeat,
			linear-gradient(var(--color-rich), var(--color-rich)) right bottom / 6px 6px no-repeat;
	}
	.tag,
	.size {
		position: absolute;
		font:
			9px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		white-space: nowrap;
	}
	.tag {
		bottom: calc(100% + 5px);
		left: 0;
		color: var(--color-mute);
	}
	.frame.picked .tag {
		color: var(--color-rich);
	}
	.size {
		top: calc(100% + 5px);
		left: 50%;
		padding: 2px 4px;
		translate: -50% 0;
		border-radius: 2px;
		background: var(--color-rich);
		color: #fff;
	}
	/* The booking tile: a day (its weekday in small type over its date), a time, and the button that confirms. The
	   chosen day is pale blue, the chosen time blue; a taken time is struck out. */
	.day,
	.slot {
		border-radius: 4px;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
		color: var(--color-fg);
		cursor: pointer;
		transition:
			background-color 0.15s,
			box-shadow 0.15s,
			color 0.15s;
	}
	.day {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 4px;
		height: 40px;
		font-size: 13px;
		line-height: 1;
		font-weight: 600;
	}
	.day span {
		font:
			400 9px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
	}
	.slot {
		height: 26px;
		font:
			11px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		font-variant-numeric: tabular-nums;
	}
	.day:hover,
	.slot:hover:enabled {
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.3);
	}
	.day[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-rich) 8%, white);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-rich) 45%, white);
		color: var(--color-rich);
	}
	.day[aria-pressed='true'] span {
		color: inherit;
	}
	.slot[aria-pressed='true'] {
		background: var(--color-rich);
		box-shadow: none;
		color: #fff;
	}
	.slot:disabled {
		background: rgb(0 0 0 / 0.04);
		box-shadow: none;
		color: var(--color-soft);
		text-decoration: line-through;
		cursor: default;
	}
	.confirm {
		flex: none;
		height: 26px;
		padding: 0 12px;
		border-radius: 4px;
		background: var(--color-rich);
		font-size: 12px;
		line-height: 1;
		font-weight: 500;
		color: #fff;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}
	.confirm:disabled {
		background: rgb(0 0 0 / 0.07);
		color: var(--color-soft);
		cursor: default;
	}
	.frame:focus-visible,
	.day:focus-visible,
	.slot:focus-visible,
	.confirm:focus-visible,
	.tick:focus-visible {
		outline: 2px solid var(--color-rich);
		outline-offset: 2px;
	}
	/* The table tile: a sheet with a hairline ring, five lines of equal height (the head and four rows) of four cells:
	   the tick, the task, its status (a pill) and its due day. Hairlines part the lines and the cells. */
	.sheet {
		display: grid;
		grid-auto-rows: minmax(0, 1fr);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.1);
		font-size: 12px;
		line-height: 1;
		color: var(--color-fg);
	}
	.line {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr) 96px 64px;
	}
	.line + .line {
		border-top: 1px solid rgb(0 0 0 / 0.07);
	}
	.line > span {
		display: flex;
		align-items: center;
		min-width: 0;
		padding: 0 10px;
	}
	.line > span + span {
		border-left: 1px solid rgb(0 0 0 / 0.07);
	}
	.line > span:first-child {
		justify-content: center;
		padding: 0;
	}
	.line > .task {
		display: block;
		align-content: center;
		line-height: 1.3;
	}
	.head {
		background: rgb(0 0 0 / 0.025);
	}
	.head > span,
	.due {
		font:
			10px/1 var(--ff-mono),
			ui-monospace,
			monospace;
		color: var(--color-mute);
	}
	.tick {
		display: grid;
		place-items: center;
		width: 14px;
		height: 14px;
		border-radius: 3px;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.25);
		color: transparent;
		cursor: pointer;
		transition:
			background-color 0.15s,
			box-shadow 0.15s;
	}
	.tick:hover {
		box-shadow: inset 0 0 0 1px var(--color-rich);
	}
	.tick[aria-checked='true'] {
		background: var(--color-rich);
		box-shadow: none;
		color: #fff;
	}
	.line.done .task {
		color: var(--color-mute);
		text-decoration: line-through;
	}
	.pill {
		padding: 4px 7px;
		border-radius: 999px;
		background: rgb(0 0 0 / 0.06);
		font-size: 11px;
		line-height: 1;
		font-style: normal;
		white-space: nowrap;
		color: var(--color-fg);
	}
	.pill.idle {
		background: none;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
		color: var(--color-mute);
	}
	.pill.on {
		background: color-mix(in srgb, var(--color-rich) 10%, white);
		color: var(--color-rich);
	}
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
