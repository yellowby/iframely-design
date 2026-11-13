<script lang="ts">
	import { onMount } from 'svelte';
	import { ROLES, SLOTS, family, type Slot } from '#lib/type/type.ts';
	import { cards, cta, look } from '#lib/tweaks.svelte.ts';

	// A Tweakpane panel for trying type on the live site: fixed in the bottom-right corner, collapsed by default.
	// For the heading and the base slot: the family (the current one, Geist or Inter) and the weight, size, line height
	// and letter spacing. It writes the type system's CSS variables (lib/type/type.ts) on <html>, so every role follows.
	//
	// A slot has several roles of different sizes (headings: hero 40, section heading 32). The controls show the slot's
	// main role (the section heading; the body text) at its current values; the other roles of the slot keep their
	// proportion to it (size) or their difference from it (weight, line height, spacing).
	// Values are kept in localStorage, so they survive a reload; Reset puts the defaults back.
	const KEY = 'type-tweaks';
	const CARDS = { ...cards }; // the product cards' switches as shipped, for Reset
	// The third group is the tag (the small mono line above headings and on cards): the one role of the mono slot. Its
	// family is set on the role (--t-tag-ff), not the slot, so code samples keep their mono font.
	type Group = 'heading' | 'base' | 'tag';
	const GROUPS: [Group, string][] = [['heading', 'Heading font'], ['base', 'Base font'], ['tag', 'Tag font']];
	const MAIN: Record<Group, string> = { heading: 'h2', base: 'body', tag: 'tag' };
	const SLOT: Record<Group, Slot> = { heading: 'heading', base: 'base', tag: 'mono' };
	const FONTS = (g: Group) => {
		const now = SLOTS.find((s) => s.id === SLOT[g])!.family;
		return [...new Set(g === 'tag' ? [now, 'geist-mono', 'aeonik-fono'] : [now, 'geist', 'inter'])];
	};
	const role = (id: string) => ROLES.find((r) => r.id === id)!;

	type Vals = { font: string; weight: number; size: number; line: number; spacing: number };
	const defaults = (g: Group): Vals => {
		const m = role(MAIN[g]);
		return { font: SLOTS.find((s) => s.id === SLOT[g])!.family, weight: m.weight, size: m.size, line: m.lh, spacing: m.ls };
	};

	let host = $state<HTMLDivElement>();

	function apply(slot: Group, v: Vals) {
		const css = document.documentElement.style, m = role(MAIN[slot]);
		css.setProperty(slot === 'tag' ? '--t-tag-ff' : `--ff-${slot}`, family(v.font).stack);
		for (const r of ROLES.filter((x) => x.slot === SLOT[slot])) {
			css.setProperty(`--t-${r.id}-fw`, String(Math.min(900, Math.max(100, r.weight + v.weight - m.weight))));
			css.setProperty(`--t-${r.id}-fs`,`${+((r.size * v.size) / m.size).toFixed(2)}px`);
			css.setProperty(`--t-${r.id}-lh`, String(+(r.lh + v.line - m.lh).toFixed(3)));
			css.setProperty(`--t-${r.id}-ls`, `${+(r.ls + v.spacing - m.ls).toFixed(4)}em`);
		}
	}

	onMount(() => {
		const state = { heading: defaults('heading'), base: defaults('base'), tag: defaults('tag') };
		try {
			const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
			if (saved) for (const [g] of GROUPS) Object.assign(state[g], saved[g]);
			if (saved?.cards) Object.assign(cards, saved.cards);
			if (saved?.cta) Object.assign(cta, saved.cta);
			if (saved?.look) Object.assign(look, saved.look);
			// a saved tag variant that no longer exists (the dropped "leader" and "corners") falls back to the default
			if (!['regular', 'measure', 'badge', 'endpoint', 'outline', 'off'].includes(look.tag)) look.tag = 'measure';
		} catch {
			// no storage, or nothing usable in it: the defaults stand
		}
		const sync = () => {
			for (const [g] of GROUPS) apply(g, state[g]);
			// corners: the rule that squares everything lives in routes/layout.css
			document.documentElement.dataset.corners = look.corners;
			document.documentElement.dataset.shadows = look.shadows;
			document.documentElement.dataset.accent = look.accent;
			document.documentElement.dataset.heroCta = look.heroCta;
			try {
				localStorage.setItem(KEY, JSON.stringify({ ...state, cards, cta, look }));
			} catch {
				// not kept; the page still follows
			}
		};

		let dead = false, pane: { dispose(): void } | undefined;
		Promise.all([import('tweakpane'), import('@tweakpane/plugin-essentials')]).then(([{ Pane }, Essentials]) => {
			if (dead || !host) return;
			const p = new Pane({ container: host, title: 'Type', expanded: false });
			p.registerPlugin(Essentials);
			pane = p;
			for (const [slot, title] of GROUPS) {
				const f = p.addFolder({ title, expanded: false }), v = state[slot];
				// the family as a row of switches (the essentials plugin's radio grid), not a dropdown
				const fonts = FONTS(slot);
				f.addBinding(v, 'font', {
					label: undefined,
					view: 'radiogrid',
					groupName: `${slot}-font`,
					size: [fonts.length, 1],
					cells: (x: number) => ({ title: family(fonts[x]).name, value: fonts[x] })
				});
				if (slot === 'tag') continue; // the tag: the family only
				f.addBinding(v, 'weight', { label: 'weight', min: 100, max: 900, step: 100 });
				f.addBinding(v, 'size', { label: 'size', min: slot === 'heading' ? 20 : 12, max: slot === 'heading' ? 56 : 24, step: 0.5 });
				f.addBinding(v, 'line', { label: 'line', min: 0.9, max: 2, step: 0.01 });
				f.addBinding(v, 'spacing', { label: 'spacing', min: -0.08, max: 0.08, step: 0.005, format: (n: number) => n.toFixed(3) });
			}
			// every rounded corner on the site (buttons, cards, pills, the product scenes), or none
			const CORNERS: [string, string][] = [['Rounded', 'rounded'], ['Square', 'square']];
			p.addFolder({ title: 'Corners' }).addBinding(look, 'corners', {
				label: undefined,
				view: 'radiogrid',
				groupName: 'look-corners',
				size: [CORNERS.length, 1],
				cells: (x: number) => ({ title: CORNERS[x][0], value: CORNERS[x][1] })
			});
			// every drop shadow on the site (cards, panels, the product scenes), or none; outlines and rings stay
			const SHADOWS: [string, string][] = [['On', 'on'], ['Off', 'off']];
			p.addFolder({ title: 'Shadows' }).addBinding(look, 'shadows', {
				label: undefined,
				view: 'radiogrid',
				groupName: 'look-shadows',
				size: [SHADOWS.length, 1],
				cells: (x: number) => ({ title: SHADOWS[x][0], value: SHADOWS[x][1] })
			});
			// the blue words in the page headings, or none ("one URL at a time" on the home page stays blue)
			p.addFolder({ title: 'Heading highlight' }).addBinding(look, 'accent', {
				label: undefined,
				view: 'radiogrid',
				groupName: 'look-accent',
				size: [SHADOWS.length, 1],
				cells: (x: number) => ({ title: SHADOWS[x][0], value: SHADOWS[x][1] })
			});
			// the blue call-to-action window under the product heroes' scenes, or none
			p.addFolder({ title: 'Hero CTA' }).addBinding(look, 'heroCta', {
				label: undefined,
				view: 'radiogrid',
				groupName: 'look-hero-cta',
				size: [SHADOWS.length, 1],
				cells: (x: number) => ({ title: SHADOWS[x][0], value: SHADOWS[x][1] })
			});
			// the tag over a product hero's heading (/embeds): a light blue pill, a numbered blueprint measure line, or the API call
			// (in two rows of three: Regular is the plain blue tag the home page's sections have)
			const TAG: [string, string][] = [['Regular', 'regular'], ['Badge', 'badge'], ['Measure', 'measure'], ['Endpoint', 'endpoint'], ['Outline', 'outline'], ['Off', 'off']];
			p.addFolder({ title: 'Hero tag' }).addBinding(look, 'tag', {
				label: undefined,
				view: 'radiogrid',
				groupName: 'look-tag',
				size: [3, 2],
				cells: (x: number, y: number) => ({ title: TAG[y * 3 + x][0], value: TAG[y * 3 + x][1] })
			});
			// the home page's four product cards: the cover's colours and how it sits in the card
			const c = p.addFolder({ title: 'Product cards' });
			const grid = (key: 'cover' | 'fit', opts: [string, string][]) =>
				c.addBinding(cards, key, {
					label: key,
					view: 'radiogrid',
					groupName: `cards-${key}`,
					size: [opts.length, 1],
					cells: (x: number) => ({ title: opts[x][0], value: opts[x][1] })
				});
			grid('cover', [['Tint', 'tint'], ['Solid', 'solid']]);
			grid('fit', [['Inset', 'inset'], ['Flush', 'flush']]);
			// the closing blue block: its ground, one of the product colours or black
			const BG: [string, string][] = [['Rich', 'rich'], ['Prev', 'preview'], ['Data', 'data'], ['Pub', 'pub'], ['Black', 'black']];
			p.addFolder({ title: 'Bottom CTA' }).addBinding(cta, 'bg', {
				label: undefined,
				view: 'radiogrid',
				groupName: 'cta-bg',
				size: [BG.length, 1],
				cells: (x: number) => ({ title: BG[x][0], value: BG[x][1] })
			});
			p.addButton({ title: 'Reset' }).on('click', () => {
				Object.assign(cards, CARDS);
				cta.bg = 'rich';
				look.corners = 'rounded';
				look.shadows = 'on';
				look.accent = 'on';
				look.heroCta = 'on';
				look.tag = 'measure';
				for (const [g] of GROUPS) Object.assign(state[g], defaults(g));
				p.refresh();
				sync();
			});
			p.on('change', sync);
		});
		sync();

		return () => {
			dead = true;
			pane?.dispose();
		};
	});
</script>

<!-- .tweaks-pane keeps the panel's own corners when the site's are switched to square (routes/layout.css) -->
<div bind:this={host} class="tweaks-pane fixed right-4 bottom-4 z-50 w-64 print:hidden"></div>
