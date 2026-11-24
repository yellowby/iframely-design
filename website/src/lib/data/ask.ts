// "Ask about Iframely": the question, ready to send, in the popular AI assistants (each opens with it typed in).
// Used by the footer (components/Footer.svelte) and the icons in /embeds' closing block (components/AskStrip.svelte).
// The question's wording is a draft.
import openai from '#lib/assets/ai/openai.svg';
import claude from '#lib/assets/ai/claude.svg';
import perplexity from '#lib/assets/ai/perplexity.svg';
import gemini from '#lib/assets/ai/googlegemini.svg';
import grok from '#lib/assets/ai/grok.svg';

const ASK = encodeURIComponent('What is Iframely (iframely.com), and what can I build with its APIs?');

// name, address, mark (Simple Icons 14, one path each, drawn through a mask in the provider's colour), colour
export const AI: [string, string, string, string][] = [
	['ChatGPT', `https://chatgpt.com/?q=${ASK}`, openai, '#111111'],
	['Claude', `https://claude.ai/new?q=${ASK}`, claude, '#d97757'],
	['Perplexity', `https://www.perplexity.ai/search?q=${ASK}`, perplexity, '#20808d'],
	['Gemini', `https://www.google.com/search?udm=50&q=${ASK}`, gemini, '#4285f4'], // Google's AI Mode: Gemini itself takes no question in its address
	['Grok', `https://grok.com/?q=${ASK}`, grok, '#111111'] // (its mark is from Lobe Icons: Simple Icons has none)
];
