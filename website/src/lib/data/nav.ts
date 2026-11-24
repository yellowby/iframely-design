// Header and footer navigation.

// icon: the product whose tile (product colour, white glyph) stands before the row in the header dropdown
export type NavLink = { label: string; href: string; note?: string; divider?: boolean; icon?: 'rich' | 'preview' | 'data' | 'pub' };
export type NavColumn = { title?: string; items: NavLink[] };
export type NavGroup = { label: string; href?: string; columns?: NavColumn[] };

// Home01 header: Product (the four products, with a small scene of the one pointed at on the right, drawn in
// components/Header.svelte), Resources (developers, then company), Domains, Pricing
// (Product had two columns with headings, "Features" and "Solutions"; the Solutions pages are still in the footer:
//  /for/agents "AI agents and RAG", /for/chat-apps "Chat and collaboration apps", /for/cms "CMS, editors and site
//  builders", /for/newsrooms "Publishers and newsrooms")
export const header: NavGroup[] = [
	{
		label: 'Product',
		columns: [
			{
				// (no heading. "Features" was back for an hour on 2026-11-24, without the Solutions column beside it: with
				// one column it separated nothing, and it cost the menu 32px.)
				items: [
					{ label: 'Rich Media', href: '/embeds', icon: 'rich', note: 'Embeds for 1,900 providers, kept up to date' },
					{ label: 'Preview API', href: '/preview-api', icon: 'preview', note: 'Link previews and metadata for any URL' },
					{ label: 'Data API', href: '/data-api', icon: 'data', note: 'Readable content, with publisher permissions' },
					{ label: 'Publisher Console', href: '/publishers', icon: 'pub', note: 'Set what each app receives from your pages' }
				]
			}
		]
	},
	{
		label: 'Resources',
		columns: [
			{
				title: 'Developers',
				items: [
					{ label: 'Docs', href: '/docs' },
					{ label: 'API reference', href: '/docs/reference' },
					{ label: 'MCP server', href: '/mcp' },
					{ label: 'SDKs and integrations', href: '/integrations' },
					{ label: 'Changelog and provider news', href: '/updates' },
					{ label: 'URL debugger', href: '/tools/url-debugger' },
					{ label: 'Status', href: '#status' }
				]
			},
			{
				title: 'Company',
				items: [
					{ label: 'Compare', href: '/compare' },
					{ label: 'Help center', href: '/help' },
					{ label: 'About', href: '/about' },
					{ label: 'Trust center', href: '#trust' }
				]
			}
		]
	},
	{ label: 'Domains', href: '/domains' },
	{ label: 'Pricing', href: '/pricing' }
];

export const footer: { label: string; items: NavLink[] }[] = [
	{
		label: 'Product',
		items: [
			{ label: 'Rich Media', href: '/embeds' },
			{ label: 'Preview API', href: '/preview-api' },
			{ label: 'Data API', href: '/data-api' },
			{ label: 'Publisher Console', href: '/publishers' },
			{ label: 'Pricing', href: '/pricing' }
		]
	},
	{
		// same pages as the header's Solutions column (G42 footer, motion lab), under short names that fit a footer
		// column on one line (they were "AI agents and RAG", "Chat and collaboration apps", "CMS, editors and site
		// builders", "Publishers and newsrooms")
		label: 'Solutions',
		items: [
			{ label: 'AI agents', href: '/for/agents' },
			{ label: 'Chat apps', href: '/for/chat-apps' },
			{ label: 'CMS and editors', href: '/for/cms' },
			{ label: 'Newsrooms', href: '/for/newsrooms' }
		]
	},
	{
		label: 'Free tools',
		items: [
			{ label: 'Embed code generator', href: '/try' },
			{ label: 'URL debugger', href: '/tools/url-debugger' },
			{ label: 'Supported providers', href: '/domains' },
			{ label: 'Domains widget', href: '/docs/domains-widget' },
			{ label: 'All free tools', href: '/tools' }
		]
	},
	{
		// (Integrations and the WordPress plugin came from Products; "For agents" went, it is Solutions' "AI agents";
		// the help center is under Company)
		label: 'Developers',
		items: [
			{ label: 'Docs', href: '/docs' },
			{ label: 'MCP server', href: '/mcp' },
			{ label: 'Integrations', href: '/integrations' },
			{ label: 'WordPress plugin', href: '/wordpress' },
			{ label: 'Changelog', href: '/updates' }, // (the header's "Changelog and provider news", short enough for one line)
			{ label: 'Verify our agents', href: '/verification' },
			{ label: 'Status', href: '#status' }
		]
	},
	{
		// (Security and the Trust center came from Legal; "Contact support", /help#contact, went: the help center has it)
		label: 'Company',
		items: [
			{ label: 'About', href: '/about' },
			{ label: 'Help center', href: '/help' },
			{ label: 'Security', href: '#security' },
			{ label: 'Trust center', href: '#trust' }
		]
	},
	{
		label: 'Legal',
		items: [
			{ label: 'Terms of use', href: '#terms' },
			{ label: 'Automated processing', href: '#automated-processing' },
			{ label: 'Privacy policy', href: '#privacy' },
			{ label: 'Publisher policy', href: '#publisher-policy' },
			{ label: 'GDPR', href: '#gdpr' }
		]
	}
];
