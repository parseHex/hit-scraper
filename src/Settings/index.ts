import * as ifc from 'ifc';
import FileHandler from 'FileHandler';
import Interface from 'Interface';
import { SETTINGS_KEY } from 'lib/constants';

import defaults from './defaults';
import htmlGenerator from './html/main';
import optionChange from './option-change';
import sliderChange from './slider-change';
import sidebarClick from './sidebar-click';

export class Settings {
	defaults: ifc.SettingsConfig;
	user: ifc.SettingsConfig;
	mainEl: HTMLElement;
	get: (s: string) => HTMLElement;
	getAll: (s: string) => NodeListOf<HTMLElement>;
	autosave: boolean = true;

	constructor() {
		this.defaults = defaults;
		this.user = <ifc.SettingsConfig>{};
	}

	die() {
		Interface.toggleOverflow('off');
		this.mainEl.remove();
	}

	draw() {
		const html: string = htmlGenerator.call(this);

		this.mainEl = document.body.appendChild(document.createElement('DIV'));
		this.mainEl.id = 'settingsMain';
		this.mainEl.innerHTML = html;
		this.get = this.mainEl.querySelector.bind(this.mainEl);
		this.getAll = this.mainEl.querySelectorAll.bind(this.mainEl);

		return this;
	}

	save() {
		if (!this.autosave) return;

		localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.user));
	}

	init() {
		this.get('#settingsClose').onclick = this.die.bind(this);
		this.get('#settings-general').style.display = 'block';
		Array.from(this.getAll('#settingsSidebar span')).forEach(v => v.onclick = sidebarClick.bind(this));
		Array.from(this.getAll('input:not([type=file]),select')).forEach(v => v.onchange = optionChange.bind(this));
		Array.from(this.getAll('input[type=range]')).forEach(v => v.oninput = sliderChange);
		this.get('#sexport').onclick = FileHandler.exports;
		this.get('#simport').onclick = () => {
			(<HTMLInputElement>this.get('#fsimport')).value = '';
			this.get('#eisStatus').innerHTML = '';
			this.get('#fsimport').click();
		};
		this.get('#fsimport').onchange = FileHandler.imports;
	}
}
export default new Settings();
