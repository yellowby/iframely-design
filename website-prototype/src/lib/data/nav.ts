// Header and footer navigation.

// icon: the product whose tile (product colour, white glyph) stands before the row in the header dropdown
export type NavLink = { label: string; href: string; note?: string; divider?: boolean; icon?: 'rich' | 'preview' | 'data' | 'pub' };
export type NavColumn = { title?: string; items: NavLink[] };
export type NavGroup = { label: string; href?: string; columns?: NavColumn[] };

// Home01 header: Product (two columns, Features and Solutions), Resources (developers, then company), Domains, Pricing
export const header: NavGroup[] = [
	{
		label: 'Product',
		columns: [
			{
				title: 'Features',
				items: [
					{ label: 'Rich Media', href: '/embeds', icon: 'rich', note: 'Embeds for 1,900 providers, kept up to date' },
					{ label: 'Preview API', href: '/preview-api', icon: 'preview', note: 'Link previews and metadata for any URL' },
					{ label: 'Data API', href: '/data-api', icon: 'data', note: 'Readable content, with publisher permissions' },
					{ label: 'Publisher Console', href: '/publishers', icon: 'pub', note: 'Set what each app receives from your pages' }
				]
			},
			{
				title: 'Solutions',
				items: [
					{ label: 'AI agents and RAG', href: '/for/agents', note: 'Ground assistants on URLs you may use' },
					{ label: 'Chat and collaboration apps', href: '/for/chat-apps', note: 'Link previews people trust, at chat volume' },
					{ label: 'CMS, editors and site builders', href: '/for/cms', note: 'Paste a URL, get an embed that lasts' },
					{ label: 'Publishers and newsrooms', href: '/for/newsrooms', note: 'Embeds in stories, control over your links' }
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
		label: 'Products',
		items: [
			{ label: 'Rich Media', href: '/embeds' },
			{ label: 'Preview API', href: '/preview-api' },
			{ label: 'Data API', href: '/data-api' },
			{ label: 'Publisher Console', href: '/publishers' },
			{ label: 'Integrations', href: '/integrations' },
			{ label: 'WordPress plugin', href: '/wordpress' },
			{ label: 'Pricing', href: '/pricing' }
		]
	},
	{
		// same pages as the header's Solutions column (G42 footer, motion lab)
		label: 'Solutions',
		items: [
			{ label: 'AI agents and RAG', href: '/for/agents' },
			{ label: 'Chat and collaboration apps', href: '/for/chat-apps' },
			{ label: 'CMS, editors and site builders', href: '/for/cms' },
			{ label: 'Publishers and newsrooms', href: '/for/newsrooms' }
		]
	},
	{
		label: 'Free tools',
		items: [
			{ label: 'Embed code generator', href: '/try' },
			{ label: 'URL debugger', href: '/tools/url-debugger' },
			{ label: 'All free tools', href: '/tools' },
			{ label: 'Supported providers', href: '/domains' },
			{ label: 'Domains widget', href: '/docs/domains-widget' }
		]
	},
	{
		label: 'Developers',
		items: [
			{ label: 'Docs', href: '/docs' },
			{ label: 'For agents', href: '/for/agents' },
			{ label: 'MCP server', href: '/mcp' },
			{ label: 'Changelog and provider news', href: '/updates' },
			{ label: 'Verify our agents', href: '/verification' },
			{ label: 'Help center', href: '/help' },
			{ label: 'Status', href: '#status' }
		]
	},
	{
		label: 'Company',
		items: [
			{ label: 'About', href: '/about' },
			{ label: 'Careers', href: '/careers' },
			{ label: 'Compare', href: '/compare' },
			{ label: 'Contact support', href: '/help#contact' }
		]
	},
	{
		label: 'Legal',
		items: [
			{ label: 'Terms of use', href: '#terms' },
			{ label: 'Automated processing', href: '#automated-processing' },
			{ label: 'Privacy policy', href: '#privacy' },
			{ label: 'Publisher policy', href: '#publisher-policy' },
			{ label: 'Security', href: '#security' },
			{ label: 'GDPR', href: '#gdpr' },
			{ label: 'Trust center', href: '#trust' }
		]
	}
];
