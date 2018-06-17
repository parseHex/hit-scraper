import * as ifc from 'ifc';
import { defaults } from 'lib/constants';

import generateCSS from './generate-css';
import tune from './tune';
import getBrightness from './get-brightness';
import apply from './apply';

export class Themes {
	default: { [T in ifc.ThemeName]: ifc.ThemeColors };
	generateCSS: (this: Themes, theme: string, mode: string) => string;
	tune: (this: Themes, fg: string, bg: string) => string;
	getBrightness: (hex: string) => number;
	apply: (this: Themes, theme: string, mode?: string) => void;

	constructor() {
		this.default = defaults.themes;

		this.generateCSS = generateCSS.bind(this);
		this.tune = tune.bind(this);
		this.getBrightness = getBrightness;
		this.apply = apply.bind(this);
	}
}
export default new Themes();
