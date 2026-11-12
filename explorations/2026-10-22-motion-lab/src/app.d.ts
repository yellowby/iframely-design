// The classic lab scripts in static/ register everything on window globals.
declare global {
	interface Window {
		DEMOS: any;
		LAB: { PAGES: { id: string; title: string; groups: string[]; intro: string }[]; CODE: Record<string, string> };
		FontLab: any;
		FONTLAB_LOCAL: any[];
		Motion: any;
	}
	namespace App {}
}

export {};
