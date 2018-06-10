import { ThemeColors, ThemeName } from './theme';

export interface SettingsConfig {
	themes: {
		name: ThemeName;
		colors: { [T in ThemeName]: ThemeColors };
	};

	colorType: 'sim' | 'adj';
	sortType: 'sim' | 'adj';
	toWeights: {
		comm: number;
		pay: number;
		fair: number;
		fast: number;
		[index: string]: number;
	};
	asyncTO: boolean;
	cacheTO: boolean;
	toTimeout: number;

	exportVb: boolean;
	exportIrc: boolean;
	exportHwtf: boolean;
	exportPcp: boolean;
	exportPco: boolean;
	exportPcCustomTitle: boolean;
	exportExternal: boolean;
	externalNoBlocked: boolean;

	notifySound: [boolean, SoundName];
	notifyBlink: boolean;
	notifyTaskbar: boolean;
	volume: {
		ding: number;
		squee: number;
	};
	wildblocks: boolean;
	showCheckboxes: boolean;
	hitColor: 'link' | 'cell';
	fontSize: number;
	shineOffset: number;

	blockColumn: boolean;
	requesterColumn: boolean;
	availableColumn: boolean;
	durationColumn: boolean;
	topayColumn: boolean;
	mastersColumn: boolean;
	notqualifiedColumn: boolean;

	pcQueue: boolean;
	pcQueueMin: number;

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
	search: string;
	hideBlock: boolean;
	onlyIncludes: boolean;
	shineInc: boolean;
	sortAsc: boolean;
	sortDsc: boolean;
	gbatch: boolean;
	bubbleNew: boolean;
	hidePanel: boolean;

	vbTemplate: string;
	vbSym: string;
}
export type SoundName = 'ding' | 'squee';
