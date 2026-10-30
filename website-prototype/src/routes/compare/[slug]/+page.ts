import { error } from '@sveltejs/kit';
import { competitors, competitorBySlug } from '#lib/data/compare.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => competitors.map((c) => ({ slug: c.slug }));

export const load: PageLoad = ({ params }) => {
	const competitor = competitorBySlug(params.slug);
	if (!competitor) error(404, 'Not found');
	return { competitor };
};
