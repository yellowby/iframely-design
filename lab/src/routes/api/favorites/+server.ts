import { json } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Picks live in favorites.json at the lab's root (the folder `npm run dev` runs in). Dev server only.
const FILE = path.resolve('favorites.json');
export const prerender = false;

import type { RequestHandler } from './$types';

export async function GET() {
	try {
		const j = JSON.parse(await fs.readFile(FILE, 'utf8'));
		return json({ exists: true, items: j.items ?? {} });
	} catch {
		return json({ exists: false, items: {} });
	}
}

export const PUT: RequestHandler = async ({ request }) => {
	const { items } = await request.json();
	await fs.writeFile(FILE, JSON.stringify({ updated: new Date().toISOString(), items }, null, '\t') + '\n');
	return json({ ok: true });
};
