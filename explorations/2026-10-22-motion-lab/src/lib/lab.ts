// Read-only access to the classic lab: pages and codes from static/lib/site.js (window.LAB), demos from the
// registry in static/lib/demos.js (window.DEMOS). Everything here runs in the browser only (ssr is off).

export type Page = { id: string; title: string; groups: string[]; intro: string };
export type Demo = { name: string; title: string; blurb: string; group: string; alias?: string; pick?: string };
export type Entry = { d: Demo; group: string; code: string; page: Page };

export const pages = (): Page[] => window.LAB.PAGES;
export const pageById = (id: string) => pages().find((p) => p.id === id);

/* every card on a page, in the order and with the code (G42, V21…) the gallery has always shown */
export function entriesOf(page: Page): Entry[] {
	const out: Entry[] = [];
	let i = 0;
	for (const g of page.groups)
		for (const d of window.DEMOS.list(g) as Demo[]) {
			i++;
			out.push({ d, group: g, page, code: (window.LAB.CODE[g] || '?') + String(i).padStart(2, '0') });
		}
	return out;
}

let index: Map<string, Entry> | null = null;
/* demo name → its entry (page, code); built once */
export function entry(name: string): Entry | undefined {
	if (!index) {
		index = new Map();
		for (const p of pages()) for (const e of entriesOf(p)) index.set(e.d.name, e);
	}
	return index.get(name);
}
export const allEntries = (): Entry[] => pages().flatMap(entriesOf);

/* the frame class decides the frame's layout and ground (g-cv, g-pg… in lab.css); an alias shows another demo */
export const frameGroup = (e: Entry) => (e.d.alias && window.DEMOS.get(e.d.alias)?.group) || e.group;
