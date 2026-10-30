// Type system for the prototype: three family slots (headings, base, mono) and one role per kind of text on the page.
// The values are Home01 in Figma (Design 2027, Wireframes, 2026-10-30). typeCss() writes them as CSS variables and one
// class per role (.t-hero, .t-h2, …), which the root layout inlines; change a value here to change it everywhere.

export type Slot = 'heading' | 'base' | 'mono';
export type Family = { id: string; name: string; stack: string; weights: number[] };
export type Role = { id: string; label: string; slot: Slot; size: number; weight: number; lh: number; ls: number };

const range = (a: number, b: number) => Array.from({ length: (b - a) / 100 + 1 }, (_, i) => a + i * 100);

// Every family in use on the page, plus Inter (swap one into a slot in SLOTS to try it). Aeonik Fono is a self-hosted trial (static/fonts/AeonikFono); the others
// load from Google Fonts in the root layout.
export const FAMILIES: Family[] = [
	{ id: 'aeonik-fono', name: 'Aeonik Fono', stack: "'Aeonik Fono', 'Geist Mono', ui-monospace, monospace", weights: [100, 200, 300, 400, 500, 600, 700, 900] },
	{ id: 'geist', name: 'Geist', stack: "Geist, Inter, ui-sans-serif, system-ui, sans-serif", weights: range(100, 900) },
	{ id: 'inter', name: 'Inter', stack: "Inter, ui-sans-serif, system-ui, sans-serif", weights: range(100, 900) },
	{ id: 'geist-mono', name: 'Geist Mono', stack: "'Geist Mono', ui-monospace, Menlo, monospace", weights: range(100, 900) },
	{ id: 'jetbrains-mono', name: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, Menlo, monospace", weights: range(100, 800) }
];

export const SLOTS: { id: Slot; label: string; family: string }[] = [
	{ id: 'heading', label: 'Headings', family: 'aeonik-fono' },
	{ id: 'base', label: 'Base', family: 'geist' },
	{ id: 'mono', label: 'Mono', family: 'geist-mono' }
];

// size in px, lh unitless, ls in em
export const ROLES: Role[] = [
	{ id: 'hero', label: 'Hero', slot: 'heading', size: 40, weight: 400, lh: 1.1, ls: -0.02 },
	{ id: 'h2', label: 'Section heading', slot: 'heading', size: 32, weight: 400, lh: 1.2, ls: -0.02 },
	{ id: 'lead', label: 'Hero text', slot: 'base', size: 18, weight: 400, lh: 1.5, ls: 0 },
	{ id: 'body', label: 'Body', slot: 'base', size: 18, weight: 400, lh: 1.5, ls: 0 },
	{ id: 'note', label: 'Note', slot: 'base', size: 16, weight: 400, lh: 1.5, ls: 0 },
	{ id: 'tag', label: 'Path tag', slot: 'mono', size: 16, weight: 500, lh: 1.3, ls: 0 },
	{ id: 'label', label: 'Label', slot: 'base', size: 15, weight: 400, lh: 1.5, ls: 0 },
	{ id: 'small', label: 'Small', slot: 'base', size: 14, weight: 400, lh: 1.5, ls: 0 },
	{ id: 'nav', label: 'Navigation', slot: 'base', size: 15, weight: 400, lh: 1.33, ls: 0 },
	{ id: 'button', label: 'Button', slot: 'base', size: 15, weight: 500, lh: 1.33, ls: 0 }
];

export const family = (id: string) => FAMILIES.find((f) => f.id === id) ?? FAMILIES[1];

export const roleVars = (r: Pick<Role, 'id' | 'slot' | 'size' | 'weight' | 'lh' | 'ls'>): Record<string, string> => ({
	[`--t-${r.id}-ff`]: `var(--ff-${r.slot})`,
	[`--t-${r.id}-fs`]: `${r.size}px`,
	[`--t-${r.id}-fw`]: String(r.weight),
	[`--t-${r.id}-lh`]: String(r.lh),
	[`--t-${r.id}-ls`]: `${r.ls}em`
});

export function typeCss(): string {
	const vars: Record<string, string> = {};
	for (const s of SLOTS) vars[`--ff-${s.id}`] = family(s.family).stack;
	for (const r of ROLES) Object.assign(vars, roleVars(r));
	const root = `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}`;
	const classes = ROLES.map(
		(r) => `.t-${r.id}{font-family:var(--t-${r.id}-ff);font-size:var(--t-${r.id}-fs);font-weight:var(--t-${r.id}-fw);line-height:var(--t-${r.id}-lh);letter-spacing:var(--t-${r.id}-ls)}`
	).join('');
	return root + classes;
}
