// A provider asked for from elsewhere on /embeds: a tile of the hero's wall (components/EmbedWallHero.svelte) sets
// its id here on its way to block 01, and that block's scene (components/EndpointDemo.svelte) shows that provider
// and empties it again.
export const wanted = $state({ id: '' });
