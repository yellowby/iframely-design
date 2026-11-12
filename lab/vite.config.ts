import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// The lab is a client-side app over the classic demo scripts in static/ (they register on window.DEMOS).
// Picks are saved to favorites.json through a dev-server endpoint; a static build falls back to localStorage.
export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			adapter: adapter({ fallback: '200.html', strict: false })
		})
	],
	server: { port: 5192 }
});
