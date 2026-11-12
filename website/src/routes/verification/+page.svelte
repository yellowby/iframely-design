<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Section from '#lib/components/Section.svelte';
	import Button from '#lib/components/Button.svelte';
	import Code from '#lib/components/Code.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import Table from '#lib/components/Table.svelte';
	import Badge from '#lib/components/Badge.svelte';
	import Cta from '#lib/components/Cta.svelte';

	const keyDirectory = 'https://iframely.com/.well-known/http-message-signatures-directory';

	const sampleHeaders = `User-Agent: Iframely-Processing/1.3.1 (+https://iframely.com/docs/about-processing) customer=ExampleApp mode=assist use=reference
Signature-Agent: "https://iframely.com"
Signature-Input: sig1=("@authority" "signature-agent");created=1792070000;keyid="iframely-2026";tag="web-bot-auth"
Signature: sig1=:c2FtcGxlLXNpZ25hdHVyZQ==:
Forwarded: for="ExampleApp"`;

	let headers = $state(sampleHeaders);
	let verdict = $state<null | { ok: boolean; agent?: string; lines: string[] }>(null);

	// Sample logic only: looks for the expected header shapes, does not verify cryptographically.
	function check() {
		const h = headers.toLowerCase();
		const lines: string[] = [];
		const ua = headers.match(/User-Agent:\s*(Iframely[-\w]*)/i);
		const hasSig = h.includes('signature:') && h.includes('signature-input:');
		const agentHeader = h.includes('signature-agent: "https://iframely.com"');
		const tag = h.includes('tag="web-bot-auth"');
		lines.push(ua ? `User agent names ${ua[1]}` : 'No Iframely user agent found');
		lines.push(hasSig ? 'Signature and Signature-Input present' : 'No signature headers');
		lines.push(agentHeader ? 'Signature-Agent points to iframely.com' : 'Signature-Agent missing or not iframely.com');
		lines.push(tag ? 'Tagged web-bot-auth' : 'Not tagged web-bot-auth');
		const ok = !!ua && hasSig && agentHeader && tag;
		verdict = { ok, agent: ua?.[1], lines };
	}
</script>

<PageMeta
	title="Verify Iframely's agents: signatures, IP ranges, reverse DNS | Iframely"
	description="Every Iframely request is signed with Web Bot Auth. Check our key directory, IP ranges, reverse DNS and user agents, or paste a request's headers into the self-check."
/>

<Hero
	eyebrow="Verification"
	title="Verify that a request came from Iframely"
	sub="Anyone can copy a user agent. Our signatures can't be copied. Here is everything a security team needs to tell our agents from imitations, and to allow-list them."
>
	<Button href="#self-check">Check a request</Button>
	<Button href="/publishers" variant="secondary">For publishers</Button>
</Hero>

<Section id="signatures" eyebrow="1 · Signatures" title="Web Bot Auth on every request">
	<div class="grid gap-10 lg:grid-cols-2">
		<div class="space-y-4 text-ink-700">
			<p>
				Each request carries <code>Signature</code>, <code>Signature-Input</code> and <code>Signature-Agent</code>
				headers (HTTP Message Signatures, RFC 9421, with the Web Bot Auth profile). Verify them against the public keys in
				our directory.
			</p>
			<p>Keys rotate on a published schedule; old keys stay in the directory until every signature made with them has expired.</p>
		</div>
		<Code code={keyDirectory} label="Key directory" />
	</div>
</Section>

<Section id="network" tone="muted" eyebrow="2 · Network" title="IP ranges and reverse DNS">
	<div class="grid gap-6 md:grid-cols-2">
		<div class="rounded-xl border border-ink-100 bg-white p-5">
			<h3 class="font-semibold">IP ranges</h3>
			<p class="mt-2 text-ink-600">A JSON file of the ranges our agents fetch from, with a last-changed date. Poll it daily.</p>
			<p class="mt-3 font-mono text-sm text-brand-700">https://iframely.com/agents/ip-ranges.json</p>
		</div>
		<div class="rounded-xl border border-ink-100 bg-white p-5">
			<h3 class="font-semibold">Reverse DNS</h3>
			<p class="mt-2 text-ink-600">Every agent IP resolves to a host under <code>iframely.com</code>, and that host resolves back to the same IP.</p>
			<p class="mt-3 font-mono text-sm text-ink-700">host 203.0.113.10 → agent-10.iframely.com</p>
		</div>
	</div>
</Section>

<Section id="user-agents" eyebrow="3 · User agents" title="Three agents, three strings">
	<Table
		head={['Agent', 'User agent', 'Purpose']}
		rows={[
			['Preview Agent', '<code>Iframely/1.3.1 (+https://iframely.com/docs/about)</code>', 'Metadata for a link a person shared'],
			['Processing Agent', '<code>Iframely-Processing/1.3.1 (+https://iframely.com/docs/about-processing)</code>', 'Assist, discover, search, AI input; declares mode and use'],
			['Training Agent', '<code>Iframely-Training (+https://iframely.com/docs/about-training)</code>', 'Training, only where the publisher opts in']
		]}
	/>
	<p class="mt-4 text-ink-600">Each string is followed by the customer's name; MCP requests add <code>mcp</code>.</p>
</Section>

<Section id="self-check" tone="muted" eyebrow="4 · Self-check" title="Paste a request's headers">
	<div class="grid gap-6 lg:grid-cols-2">
		<div>
			<textarea
				bind:value={headers}
				rows="8"
				class="w-full rounded-lg border border-ink-200 bg-white p-3 font-mono text-xs"
				aria-label="Request headers"
			></textarea>
			<div class="mt-3 flex gap-3">
				<button type="button" onclick={check} class="rounded-md bg-fg px-4 py-2 text-sm font-medium text-white hover:bg-body">Check</button>
				<button type="button" onclick={() => { headers = ''; verdict = null; }} class="rounded-md px-4 py-2 text-sm ring-1 ring-ink-200">Clear</button>
			</div>
		</div>
		<div class="rounded-xl border border-ink-100 bg-white p-5">
			<p class="mb-3"><Badge tone="warn">Sample logic</Badge> <span class="text-xs text-ink-500">The demo checks header shapes only. The live tool verifies the signature against the key directory.</span></p>
			{#if verdict}
				<p class="text-lg font-semibold {verdict.ok ? 'text-emerald-700' : 'text-rose-700'}">
					{verdict.ok ? `Looks like Iframely (${verdict.agent})` : 'Not verified as Iframely'}
				</p>
				<ul class="mt-3 space-y-1 text-sm text-ink-700">
					{#each verdict.lines as l (l)}<li>· {l}</li>{/each}
				</ul>
			{:else}
				<p class="text-ink-500">The verdict appears here.</p>
			{/if}
		</div>
	</div>
</Section>

<Section id="allow-list" eyebrow="5 · Allow-listing" title="Let our agents through your CDN">
	<div class="grid gap-6 md:grid-cols-3">
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">Cloudflare</h3>
			<ol class="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-ink-700">
				<li>Iframely is a verified bot and signs with Web Bot Auth.</li>
				<li>In Security → Bots, allow verified bots, or add a WAF skip rule for <code>cf.verified_bot_category</code>.</li>
				<li>In AI Crawl Control, set the Processing and Training Agents separately.</li>
			</ol>
		</div>
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">Akamai</h3>
			<ol class="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-ink-700">
				<li>In Bot Manager, find Iframely in the known-bot directory.</li>
				<li>Set the action to Allow for the Preview Agent, and choose per agent for the others.</li>
			</ol>
		</div>
		<div class="rounded-xl border border-ink-100 p-5">
			<h3 class="font-semibold">Fastly</h3>
			<ol class="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-ink-700">
				<li>Import the IP ranges file into an ACL.</li>
				<li>Allow requests from the ACL whose user agent starts with <code>Iframely</code>.</li>
			</ol>
		</div>
	</div>
</Section>

<Cta title="Control what each agent receives" text="Verification tells you it's us. The Publisher Console decides what we get.">
	<Button href="/publishers">For publishers</Button>
	<Button href="#trust" variant="invert">Trust center</Button>
</Cta>
