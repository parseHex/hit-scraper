import { defaults } from '../lib/constants';
import generateCSS from './generate-css';
import tune from './tune';
import getBrightness from './get-brightness';
import apply from './apply';

class Themes {
	constructor() {
		this.default = defaults.themes;

		this.generateCSS = generateCSS.bind(this);
		this.tune = tune.bind(this);
		this.getBrightness = getBrightness.bind(this);
		this.apply = apply.bind(this);
	}
}
export default new Themes();
