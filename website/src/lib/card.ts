// The site's card: a white box with a border and a short shadow under it. On hover the border takes the colour in
// --m with a 3px ring in --t and a wide soft shadow (as the home hero's four windows); a card that sets neither gets a
// grey border and ring. Add layout classes (flex, padding) where it is used.
// PANEL is the same box without the hover, for a card that is not a link.
export const PANEL =
	'relative rounded-xl bg-white shadow-[0_6px_8px_-6px_rgb(0_0_0/0.07)] ' +
	// the border is drawn inside the card, over its content, so on a tinted cover the translucent black darkens the tint
	'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-black/14';
export const CARD =
	PANEL +
	' transition-shadow duration-300 hover:shadow-[0_0_0_3px_var(--t,rgb(0_0_0/0.05)),0_12px_32px_rgb(23_23_23/0.06)] after:transition-colors after:duration-300 hover:after:border-[var(--m,rgb(0_0_0/0.32))]';
