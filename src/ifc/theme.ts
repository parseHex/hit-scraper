export interface ThemeColors {
	highlight: string;
	background: string;
	accent: string;
	bodytable: string;
	cpBackground: string;
	toHigh: string;
	toGood: string;
	toAverage: string;
	toLow: string;
	toPoor: string;
	hitDB: string;
	nohitDB: string;
	unqualified: string;
	reqmaster: string;
	nomaster: string;
	defaultText: string;
	inputText: string;
	secondText: string;
	link: string;
	vlink: string;
	toNone: string;
	export: string;
	hover: string;
	[index: string]: string;
}
export type ThemeName = 'classic' | 'whisper' | 'solDark' | 'solLight' | 'deluge';
