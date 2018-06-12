import { ThemeColors, ThemeName } from './theme';

// input element ids will be formatted to point to nested props
// example prop: config.settings.notifySound.volume.ding
// example id: 'settings-notifySound-volume-ding'
// types are enforced with different input types:
// string = input[type="text"]
// boolean = input[type="checkbox"]
// union = select
// number = input[type="number"]
// TODO need to figure out how to keep strong typing when rendering and changing values
export interface SettingsConfig {
	settings: {
		themes: {
			name: ThemeName;
			colors: { [T in ThemeName]: ThemeColors };
		};
		colorType: 'sim' | 'adj';
		sortType: 'sim' | 'adj';
		to: {
			weights: {
				comm: number;
				pay: number;
				fair: number;
				fast: number;
				[index: string]: number;
			};
			async: boolean;
			cache: boolean;
			timeout: number;
		};
		exports: {
			vb: boolean;
			irc: boolean;
			hwtf: boolean;
			pco: boolean;
			pcp: boolean;
			pcCustomTitle: boolean;
			external: {
				enable: boolean;
				noBlocked: boolean;
			};
		};
		notifySound: {
			enable: boolean;
			sound: SoundName;
			blink: boolean;
			taskbar: boolean;
			volume: {
				[S in SoundName]: number;
			};
		};
		wildBlocks: boolean;
		showCheckboxes: boolean;
		hitColor: 'link' | 'cell';
		fontSize: number;
		shineOffset: number;
		columns: {
			block: boolean;
			requester: boolean;
			available: boolean;
			duration: boolean;
			topay: boolean;
			masters: boolean;
			notqualified: boolean;
		};
		pandacrazy: {
			queue: {
				enable: boolean;
				min: number;
			};
		};
		vbTemplate: string;
		vbSym: string;
	};
	search: {
		refresh: number;
		pages: number;
		skips: boolean;
		resultsPerPage: number;
		batch: number;
		reward: number;
		qual: boolean;
		monly: boolean;
		mhide: boolean;
		searchBy: number;
		invert: boolean;
		shine: number;
		minTOPay: number;
		hideNoTO: boolean;
		onlyViable: boolean;
		disableTO: boolean;
		sortPay: boolean;
		sortAll: boolean;
		terms: string;
		hideBlock: boolean;
		onlyIncludes: boolean;
		shineInc: boolean;
		sortAsc: boolean;
		sortDsc: boolean;
		gbatch: boolean;
		bubbleNew: boolean;
		hidePanel: boolean;
	};
}
export type SoundName = 'ding' | 'squee';
