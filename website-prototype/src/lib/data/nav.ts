// Header and footer navigation.

export type NavLink = { label: string; href: string; note?: string; divider?: boolean };
export type NavColumn = { title: string; items: NavLink[] };
export type NavGroup = { label: string; href?: string; columns?: NavColumn[] };

// Home01 header: Products (two columns, Features and Solutions), Resources (developers, then company), Domains, Pricing
export const header: NavGroup[] = [
	{
		label: 'Products',
		columns: [
			{
				title: 'Features',
				items: [
					{ label: 'Rich Media', href: '/embeds', note: 'Embeds for 1,900 providers that keep working as platforms change' },
					{ label: 'Preview API', href: '/preview-api', note: 'Link previews, cards and metadata for any URL, with rich media on or off' },
					{ label: 'Data API', href: '/data-api', note: "Readable content and structured data for any URL, with the publisher's permissions attached" },
					{ label: 'Publisher Console', href: '/publishers', note: 'See who fetches your pages and set what each app receives' }
				]
			},
			{
				title: 'Solutions',
				items: [
					{ label: 'AI agents and RAG', href: '/for/agents', note: 'Ground assistants on URLs you are allowed to use' },
					{ label: 'Chat and collaboration apps', href: '/for/chat-apps', note: 'Link previews people trust, at chat volume' },
					{ label: 'CMS, editors and site builders', href: '/for/cms', note: 'Paste a URL, get an embed that keeps working' },
					{ label: 'Publishers and newsrooms', href: '/for/newsrooms', note: 'Embeds in your stories, control over your own links' }
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
			{ label: 'Trust center', href: '#trust' },
			{ label: 'Contact support', href: '/help#contact' }
		]
	},
	{
		label: 'Legal',
		items: [
			{ label: 'Terms', href: '#terms' },
			{ label: 'Automated Processing Terms', href: '#automated-processing' },
			{ label: 'Privacy', href: '#privacy' },
			{ label: 'GDPR', href: '#gdpr' }
		]
	}
];
