// Design switches set from the Tweakpane panel (components/TypeTweaks.svelte) and read by the pages they change.
// cards: the four product cards on the home page ("Connecting developers and publishers, one URL at a time").
//   cover: 'tint' is the product colour's light tint with the icon and clouds in the colour; 'solid' is the inverse,
//          the full colour as the ground with white ink.
//   fit:   'inset' sets the cover 8px inside the card; 'flush' runs it to the card's edges.
// cta: the closing block with the glyph clusters (components/GlyphSection.svelte). bg is its ground: one of the four
//      product colours (rich is the brand blue, as shipped) or black.
export const CTA_BG = { rich: '#0055ff', preview: '#6a3bff', data: '#a52fd0', pub: '#c81d77', black: '#000000' };
export const cta = $state<{ bg: keyof typeof CTA_BG }>({ bg: 'rich' });
export const cards = $state<{ cover: 'tint' | 'solid'; fit: 'inset' | 'flush' }>({ cover: 'tint', fit: 'inset' });
