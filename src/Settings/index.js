import Interface from '../Interface/index';
import htmlGenerator from './html/main';
import { SETTINGS_KEY } from '../lib/constants';

import defaults from './defaults';
import init from './init';

class Settings {
	constructor() {
		this.defaults = defaults;
		this.user = {};
		this.mainEl = null;

		this.init = init.bind(this);
	}

	die() {
		Interface.toggleOverflow('off');
		this.mainEl.remove();
	}

	draw() {
		const html = htmlGenerator.apply(this);

		this.mainEl = document.body.appendChild(document.createElement('DIV'));
		this.mainEl.id = 'settingsMain';
		this.mainEl.innerHTML = html;

		return this;
	}

	save() {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.user));
	}
}
export default new Settings();
