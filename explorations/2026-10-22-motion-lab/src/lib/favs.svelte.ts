import { entry, allEntries } from './lab.ts';

// Picks: one record per demo, saved to favorites.json in the lab folder through /api/favorites while the dev server
// runs (so the file can be read, diffed and committed), with localStorage as the fallback for a static build.
// Each record keeps the code, title and page at the time of picking, so a pick survives a rename or a move.

export type Fav = { at: string; code: string; title: string; page: string; note?: string };
const LS = 'motion-lab-favorites';

class Favs {
	items = $state<Record<string, Fav>>({});
	ready = $state(false);
	where = $state<'file' | 'browser'>('file');

	async load() {
		try {
			const r = await fetch('/api/favorites');
			if (!r.ok) throw new Error(String(r.status));
			const j = await r.json();
			if (j.exists) this.items = j.items;
			else {
				this.items = this.seed();
				await this.save();
			}
		} catch {
			this.where = 'browser';
			try {
				this.items = JSON.parse(localStorage.getItem(LS) || 'null') ?? this.seed();
			} catch {
				this.items = this.seed();
			}
		}
		this.ready = true;
	}

	/* first run: the picks that were hard-coded in the demo files (pick: 'pick · header', 'maybe'…) */
	seed(): Record<string, Fav> {
		const out: Record<string, Fav> = {};
		for (const e of allEntries())
			if (e.d.pick) out[e.d.name] = { ...this.meta(e.d.name), at: new Date().toISOString(), note: e.d.pick === 'pick' ? '' : e.d.pick };
		return out;
	}

	meta(name: string) {
		const e = entry(name);
		return { code: e?.code ?? '', title: e?.d.title ?? name, page: e?.page.id ?? '' };
	}

	has = (name: string) => name in this.items;

	toggle(name: string) {
		if (this.has(name)) delete this.items[name];
		else this.items[name] = { ...this.meta(name), at: new Date().toISOString() };
		this.save();
	}

	note(name: string, text: string) {
		if (!this.items[name]) return;
		this.items[name].note = text;
		this.save();
	}

	/* picks on one page (by where the demo is now, else where it was when picked), or all */
	count = (pageId?: string) =>
		Object.entries(this.items).filter(([k, f]) => !pageId || (entry(k)?.page.id ?? f.page) === pageId).length;

	private timer: ReturnType<typeof setTimeout> | undefined;
	save() {
		const snap = JSON.parse(JSON.stringify(this.items));
		try {
			localStorage.setItem(LS, JSON.stringify(snap));
		} catch {}
		if (this.where !== 'file') return Promise.resolve();
		clearTimeout(this.timer);
		return new Promise<void>((res) => {
			this.timer = setTimeout(async () => {
				try {
					await fetch('/api/favorites', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: snap }) });
				} catch {
					this.where = 'browser';
				}
				res();
			}, 250);
		});
	}
}

export const favs = new Favs();
