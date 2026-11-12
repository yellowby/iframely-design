<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Placeholder from '#lib/components/Placeholder.svelte';
	import Stats from '#lib/components/Stats.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Table from '#lib/components/Table.svelte';
	import Code from '#lib/components/Code.svelte';
	import Cta from '#lib/components/Cta.svelte';

	const boilerplate =
		'Iframely is the URL layer behind products where people share links: previews, embeds and readable content for any URL, built to work with publishers rather than around them. Independent since 2012, it serves 6.5 billion requests a month for more than 6,000 products.';

	const commitments = [
		['Verified identity for every request', 'Signed with Web Bot Auth, checkable against our key directory.', '/verification', 'Verification'],
		['One URL per request, never crawling', 'We fetch what a customer sends us, for the purpose they declare.', '/publishers#agents', 'The three agents'],
		['Publisher controls per domain and path', 'A free Console and a public content policy.', '/publishers#control', 'Publisher Console'],
		['No end-user data retained', 'We process URLs, not the people who share them.', '#privacy', 'Privacy'],
		['Declared purpose for automated processing', 'Every Data API request names a mode; misrepresenting it breaks our terms.', '#automated-processing', 'Automated Processing Terms'],
		['Open-source engine', 'The parser behind Iframely is on GitHub, 1,651 stars.', '#github', 'GitHub']
	];

	const timeline = [
		['2008', 'Itteco Software Corp. founded in Ottawa, Canada'],
		['2012', 'Iframely launches: one API for embeds from any site'],
		['2013', 'The engine is open-sourced on GitHub'],
		['20xx', 'oEmbed2 proposal; WordPress plugin'],
		['20xx', 'Notion, GitBook and others adopt Iframely for link previews'],
		['May 2026', 'SOC 2 Type II'],
		['July 2026', 'Publisher Console (beta)'],
		['October 2026', 'Data API for automated processing']
	];
</script>

<PageMeta
	title="About Iframely: the URL layer, independent since 2012"
	description="Iframely provides previews, embeds and readable content for any URL, built to work with publishers. Independent since 2012, 6.5 billion requests a month for 6,000+ products."
/>

<Hero
	eyebrow="About"
	title="The URL layer, built to work with publishers"
	tagline="Holding the web together since 2012"
	sub={boilerplate}
>
	<Button href="#principles">How we work with the web</Button>
	<Button href="/careers" variant="secondary">Careers</Button>
	{#snippet after()}
	{/snippet}
</Hero>

<Section id="why" eyebrow="Why we exist" title="Every product was rebuilding the same fragile code" narrow>
	<div class="space-y-4 text-lg text-ink-700">
		<p>
			In 2012 every product that let people share links wrote its own embed code: a parser for YouTube, another for
			Twitter, a third for whatever was popular that month. Each broke whenever a platform changed its rules.
		</p>
		<p>
			We built one API instead, and kept it working. Fourteen years and 1,900 providers later, that is still most of the
			job: when X, Meta or TikTok change, we change, so our customers don't have to.
		</p>
		<p>
			Publishers lost control along the way. Their links were rendered by tools they had never heard of, and lately read by
			agents that would not say who they were. We took the other side: we name ourselves, sign every request, and ask.
		</p>
		<p>
			In 2026 that became products: a free Console where publishers set what each agent receives, and a Data API that
			returns how their signals and settings were applied, with every result.
		</p>
	</div>
</Section>

<Section id="principles" tone="muted" eyebrow="How we work with the web" title="Commitments you can check">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each commitments as [title, text, href, cta] (title)}
			<a {href} class="rounded-xl border border-ink-100 bg-white p-5 hover:border-brand-300">
				<h3 class="font-semibold">{title}</h3>
				<p class="mt-2 text-[15px] text-ink-600">{text}</p>
				<p class="mt-3 text-sm font-medium text-brand-700">{cta} →</p>
			</a>
		{/each}
	</div>
</Section>

<Section id="proof" eyebrow="Proof" title="The numbers, and where to check them">
	<Stats
		items={[
			{ value: '2012', label: 'Serving since' },
			{ value: '6,000+', label: 'Customers' },
			{ value: '6.5B', label: 'Requests a month' },
			{ value: '99.99%', label: 'Uptime' }
		]}
	/>
	<ul class="prose-links mt-8 grid gap-2 text-ink-700 md:grid-cols-2">
		<li>SOC 2 Type II (2026), GDPR page and <a href="#trust">Trust Center</a></li>
		<li>Allow-listed by name in <a href="/publishers#proof">WSJ and Reuters robots.txt</a></li>
		<li>Named in <a href="/embeds#proof">Notion's and GitBook's help pages</a></li>
		<li><a href="#automated-processing">Automated Processing Terms</a>, public</li>
	</ul>
	<div class="mt-8 grid grid-cols-3 gap-3 md:grid-cols-6">
		{#each Array(6) as _, i (i)}<Placeholder label="Customer logo" class="h-14" />{/each}
	</div>
</Section>

<Section id="timeline" tone="muted" eyebrow="Timeline" title="Fourteen years, one link at a time">
	<ol class="relative space-y-5 border-l border-ink-200 pl-6">
		{#each timeline as [year, text], i (i)}
			<li>
				<span class="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-fg"></span>
				<p class="text-sm font-semibold text-brand-700">{year}</p>
				<p class="text-ink-700">{text}</p>
			</li>
		{/each}
	</ol>
</Section>

<Section id="team" eyebrow="Team" title="Remote-first, headquartered in Ottawa, Canada">
	<div class="grid gap-6 md:grid-cols-3">
		{#each ['Founder and CEO', 'Co-founder, Technology', 'Head of Product'] as role (role)}
			<div class="flex gap-4">
				<Placeholder label="Photo" class="size-20 shrink-0 rounded-full!" />
				<div>
					<p class="font-semibold">Name to add</p>
					<p class="text-sm text-brand-700">{role}</p>
					<p class="mt-1 text-sm text-ink-600">Two-line bio to add: background and what they own at Iframely.</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-10 grid grid-cols-3 gap-4 md:grid-cols-7">
		{#each ['Product', 'Technology', 'Engineering', 'Experience', 'Quality', 'Platform', 'Support'] as r (r)}
			<div class="text-center">
				<Placeholder label="Photo" class="aspect-square rounded-full!" />
				<p class="mt-2 text-sm font-medium">First name</p>
				<p class="text-xs text-ink-500">{r}</p>
			</div>
		{/each}
	</div>
</Section>

<Section id="facts" tone="muted" eyebrow="Company facts" title="For procurement, legal and press">
	<Table
		head={['', '']}
		rows={[
			['Legal name', 'Itteco Software Corp.'],
			['Jurisdiction', 'Canada (to confirm with counsel)'],
			['Headquarters', 'Ottawa, Canada; team works remotely'],
			['Company founded', '2008'],
			['Iframely launched', '2012'],
			['Ownership', 'Independent, founder-owned (to confirm)'],
			['Support', '<a href="/help#contact">Support form</a>'],
			['Security', 'security@ address to add'],
			['Press', 'press@ address to add']
		]}
	/>
</Section>

<Section id="press" eyebrow="Press and brand" title="Describing Iframely">
	<div class="grid gap-10 lg:grid-cols-2">
		<div>
			<Code code={boilerplate} label="Boilerplate" />
			<p class="mt-4 text-ink-700">Write it <b>Iframely</b>: one word, capital I. Not iFramely, not IFramely.</p>
		</div>
		<div class="space-y-3">
			<Placeholder label="Logo kit: SVG and PNG, light and dark" class="aspect-[16/7]" />
			<Button href="#logo-kit" variant="secondary">Download the logo kit</Button>
		</div>
	</div>
</Section>

<Cta title="Work with us" text="We hire people who take the lead and work well in writing.">
	<Button href="/careers">See open roles</Button>
	<Button href="/help#contact" variant="invert">Contact us</Button>
</Cta>

