<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Cards from '#lib/components/Cards.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="Iframely for publishers and newsrooms: embeds in your stories, control over your links | Iframely"
	description="Consent-ready embeds for X, Instagram, TikTok and YouTube in your articles, and a free Publisher Console to control how your own links appear and what AI agents may use."
/>

<Hero
	eyebrow="Publishers and newsrooms"
	title="Embeds in your stories. Control over your own links."
	sub="Two jobs, one vendor. Put posts, videos and audio into articles without slowing the page or breaking consent rules. And decide how your own articles appear in 6,000 other products, and what their AI features may read."
>
	<Button href="/embeds">Embeds for your CMS</Button>
	<Button href="/publishers" variant="secondary">Control your links</Button>
</Hero>

<Section eyebrow="In your articles" title="Embeds that respect your readers and your page speed">
	<div class="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
		<Cards
			cols={2}
			items={[
				{ title: 'Consent first', text: 'Third-party embeds wait for the reader\'s consent, then load. GDPR-ready.' },
				{ title: 'Click-to-play', text: 'Videos load their players only when tapped. No 500 KB player on every view.' },
				{ title: 'Survives platform changes', text: 'When providers change their embed code, we update ours. Your stories need no edits.'},
				{ title: 'Your archive keeps working', text: 'Content IDs refresh years-old embeds without editing a story.' }
			]}
		/>
		<Placeholder label="Article with an X post and a YouTube video behind consent and click-to-play covers" class="aspect-[4/3]" />
	</div>
</Section>

<Section tone="muted" eyebrow="Your own links" title="See who previews your articles, and set the rules">
	<Cards
		items={[
			{ title: 'Who is fetching', text: 'Which customer apps request your pages, through which agent, and how often.', href: '/publishers#agents', cta: 'The three agents' },
			{ title: 'What each agent may use', text: 'Previews yes, assistants an excerpt, training no. Per domain or per path.', href: '/publishers#console', cta: 'Publisher Console' },
			{ title: 'Signals we honour', text: 'robots.txt, Content Signals, RSL, max-snippet. Generate the lines in a click.', href: '/publishers#signals', cta: 'Signals' }
		]}
	/>
</Section>

<Section eyebrow="Proof" title="Allow-listed by name">
	<p class="max-w-3xl text-ink-700">
		WSJ and Reuters list Iframely's agents in their public robots.txt files. Every request is signed with Web Bot
		Auth and can be checked against our key directory.
	</p>
	<div class="mt-6"><Button href="/verification" variant="secondary">Verify our agents</Button></div>
</Section>

<Cta title="Two free starting points" text="A publisher account costs nothing. Embeds start on the free plan.">
	<Button href="/publishers">Claim your domain</Button>
	<Button href="/wordpress" variant="invert">WordPress plugin</Button>
</Cta>
