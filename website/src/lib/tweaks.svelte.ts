// Design switches set from the Tweakpane panel (components/TypeTweaks.svelte) and read by the pages they change.
// cards: the four product cards on the home page ("Connecting developers and publishers, one URL at a time").
//   cover: 'tint' is the product colour's light tint with the icon and clouds in the colour; 'solid' is the inverse,
//          the full colour as the ground with white ink.
//   fit:   'inset' sets the cover 8px inside the card; 'flush' runs it to the card's edges.
// cta: the closing block with the glyph clusters (components/GlyphSection.svelte). bg is its ground: one of the four
//      product colours (rich is the brand blue, as shipped) or black.
// look: site-wide switches. corners: 'rounded' is the design as built; 'square' removes every rounded corner (buttons,
//       cards, pills, the product scenes, circles too) through html[data-corners='square'] in routes/layout.css.
//       shadows: 'on' is the design as built; 'off' removes every drop shadow (cards, panels, the product scenes) and
//       keeps outlines and rings, through html[data-shadows='off'] and --drop in routes/layout.css.
//       tag: the tag over a product hero's heading (components/Hero.svelte, on pages marked `product`: /embeds,
//       /preview-api, /data-api and /publishers; the last has no endpoint, so 'endpoint' leaves it the measure line). 'measure' is the name on a blueprint measure line; 'badge' is the name in a light blue pill;
//       'endpoint' is the product's API call ("GET iframe.ly/api/iframely?url=…") instead of its name;
//       'outline' is the name in a thin square-cornered frame; 'regular' is the plain blue tag, as over the
//       home page's sections and the heroes of the pages that are not products.
export const look = $state<{
	corners: 'rounded' | 'square';
	shadows: 'on' | 'off';
	accent: 'on' | 'off'; // 'off' sets the headings' blue words in the heading's colour (html[data-accent='off'] in routes/layout.css); "one URL at a time" on the home page stays
	heroCta: 'on' | 'off'; // 'off' removes the blue call-to-action window under the product heroes (html[data-hero-cta='off'] in routes/layout.css)
	tag: 'regular' | 'measure' | 'badge' | 'endpoint' | 'outline' | 'off'; // 'off' hides the tag
}>({
	corners: 'rounded',
	shadows: 'on',
	accent: 'on',
	heroCta: 'on',
	tag: 'measure'
});
export const CTA_BG ={ rich: '#0055ff', preview: '#6a3bff', data: '#a52fd0', pub: '#c81d77', black: '#000000' };
export const cta = $state<{ bg: keyof typeof CTA_BG }>({ bg: 'rich' });
export const cards = $state<{ cover: 'tint' | 'solid'; fit: 'inset' | 'flush' }>({ cover: 'tint', fit: 'inset' });
