/* The demo scripts, in load order (kits before the files that use them). The SvelteKit shell writes one <script> per
   entry while the page parses, so they run in order before the app starts. Add new demo files here.
   (The legacy static/index.html and static/demo.html keep their own lists.) */
window.LAB_SCRIPTS = [
  'hero-stack', 'hero-shape', 'hero-paste', 'hero-terminal', 'hero-window', 'hero-blocks-url', 'hero-globe',
  'bg-dither', 'bg-ascii', 'bg-halftone', 'bg-blobs', 'bg-ripple', 'bg-marquee', 'bg-teeth', 'bg-grid', 'bg-contours', 'bg-hatch',
  'bg-moire', 'bg-tape', 'bg-network', 'bg-filings', 'bg-river', 'bg-ridges',
  'pd-one-url', 'pd-camera', 'pd-lifecycle', 'pd-publisher', 'pd-extract', 'pd-formats', 'pd-terminal', 'pd-pastel',
  'logo', 'logo2', 'logo3', 'logo4', 'logo5', 'logo6', 'logo7', 'logo8', 'logo9', 'logo10', 'logo11', 'logo12', 'logo13', 'logo14', 'logo15',
  'wordmark', 'dither-set', 'dither-stills', 'dither-stills2',
  'dither-sections', 'dither-sections2', 'dither-sections3', 'dither-sections4', 'dither-sections5',
  'content-visuals', 'content-visuals2', 'content-visuals3', 'content-visuals4', 'content-human',
  'pages-pricing', 'pages-cta', 'pages-price-block', 'pages-footer', 'pages-footer2', 'pages-footer3',
  'ill', 'ill2', 'ill3', 'ill4', 'ill5', 'prod', 'sec', 'pal'
];
for (const s of window.LAB_SCRIPTS) document.write('<script src="/demos/' + s + '.js"><\/script>');
document.write('<script src="/lib/site.js"><\/script>');
