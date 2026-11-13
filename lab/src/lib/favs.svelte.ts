import { entry, allEntries } from './lab.ts';

// Marks on demos, one record per demo: picks (favs) and the trash. Each list is saved to its own JSON file in the lab
// folder through /api/<name> while the dev server runs (so the file can be read, diffed and committed), with
// localStorage as the fallback for a static build.
// Each record keeps the code, title and page at the time of marking, so a mark survives a rename or a move.
//   favs   favorites.json   ☆ Pick on a card; listed on /favorites
//   trash  trash.json       Trash on a card: the card leaves its page, the sidebar and the search, and waits on /trash,
//                           where it can be restored. Nothing is deleted from the demo files. Trashing a card unpicks it.

export type Fav = { at: string; code: string; title: string; page: string; note?: string };

class Marks {
	items = $state<Record<string, Fav>>({});
	ready = $state(false);
	where = $state<'file' | 'browser'>('file');

	/* api: the dev-server endpoint; ls: the localStorage key; seeded: start from the demos' pick: notes */
	constructor(
		private api: string,
		private ls: string,
		private seeded = false
	) {}

	async load() {
		try {
			const r = await fetch(this.api);
			if (!r.ok) throw new Error(String(r.status));
			const j = await r.json();
			if (j.exists) this.items = j.items;
			else {
				this.items = this.seed();
				if (this.seeded) await this.save();
			}
		} catch {
			this.where = 'browser';
			try {
				this.items = JSON.parse(localStorage.getItem(this.ls) || 'null') ?? this.seed();
			} catch {
				this.items = this.seed();
			}
		}
		this.ready = true;
	}

	/* first run: the picks that were hard-coded in the demo files (pick: 'pick · header', 'maybe'…) */
	seed(): Record<string, Fav> {
		const out: Record<string, Fav> = {};
		if (!this.seeded) return out;
		for (const e of allEntries())
			if (e.d.pick) out[e.d.name] = { ...this.meta(e.d.name), at: new Date().toISOString(), note: e.d.pick === 'pick' ? '' : e.d.pick };
		return out;
	}

	meta(name: string) {
		const e = entry(name);
		return { code: e?.code ?? '', title: e?.d.title ?? name, page: e?.page.id ?? '' };
	}

	has = (name: string) => name in this.items;

	add(name: string) {
		if (this.has(name)) return;
		this.items[name] = { ...this.meta(name), at: new Date().toISOString() };
		this.save();
	}

	remove(name: string) {
		if (!this.has(name)) return;
		delete this.items[name];
		this.save();
	}

	toggle(name: string) {
		if (this.has(name)) this.remove(name);
		else this.add(name);
	}

	clear() {
		this.items = {};
		this.save();
	}

	note(name: string, text: string) {
		if (!this.items[name]) return;
		this.items[name].note = text;
		this.save();
	}

	/* marks on one page (by where the demo is now, else where it was when marked), or all */
	count = (pageId?: string) =>
		Object.entries(this.items).filter(([k, f]) => !pageId || (entry(k)?.page.id ?? f.page) === pageId).length;

	private timer: ReturnType<typeof setTimeout> | undefined;
	save() {
		const snap = JSON.parse(JSON.stringify(this.items));
		try {
			localStorage.setItem(this.ls, JSON.stringify(snap));
		} catch {}
		if (this.where !== 'file') return Promise.resolve();
		clearTimeout(this.timer);
		return new Promise<void>((res) => {
			this.timer = setTimeout(async () => {
				try {
					await fetch(this.api, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: snap }) });
				} catch {
					this.where = 'browser';
				}
				res();
			}, 250);
		});
	}
}

export const favs = new Marks('/api/favorites', 'motion-lab-favorites', true);
export const trash = new Marks('/api/trash', 'motion-lab-trash');

/* to the trash and back; a trashed card is no longer a pick */
export function toTrash(name: string) {
	trash.add(name);
	favs.remove(name);
}
export const restore = (name: string) => trash.remove(name);
