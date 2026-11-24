// Links in a block's copy. A text kept as a plain string (the pages' arrays of cards and notes) may have links in
// it, written [as this](/docs/ids). parts() gives the text as its parts in order: [words] for plain text,
// [words, address] for a link. A component draws them as text and as <a class="copy-link"> (the taglines' link,
// routes/layout.css):
//   {#each parts(text) as [words, href], n (n)}{#if href}<a class="copy-link" {href}>{words}</a>{:else}{words}{/if}{/each}
export const parts = (text: string): string[][] =>
	text
		.split(/(\[[^\]]+\]\([^)]+\))/)
		.filter(Boolean)
		.map((p) => {
			const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
			return m ? [m[1], m[2]] : [p];
		});
