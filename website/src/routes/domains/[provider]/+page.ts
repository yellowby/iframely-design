import { error } from '@sveltejs/kit';
import { providers, providerBySlug } from '#lib/data/providers.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => providers.map((p) => ({ provider: p.slug }));

export const load: PageLoad = ({ params }) => {
	const provider = providerBySlug(params.provider);
	if (!provider) error(404, 'Provider not found');
	const related = providers.filter((p) => p.category === provider.category && p.slug !== provider.slug).slice(0, 4);
	return { provider, related };
};
