import { kb } from '../lib/constants';
import Themes from '../Themes/index';
import { Interface } from '.';
import * as dom from '../lib/dom-util';
import optionChange from './option-change';
import titles from './titles';
import moveSortdirs from './move-sort-dirs';
import bindButtons from './bind-buttons';
import bindCheckboxes from './bind-checkboxes';
import { StatusManager } from './status-manager';

export default function (this: Interface) {
	var kdFn = (e: KeyboardEvent) => { if (e.keyCode === kb.ENTER) setTimeout(() => this.buttons.main.click(), 30); };

	(<HTMLAudioElement>dom.get(`#ding`)).volume = this.user.volume.ding;
	(<HTMLAudioElement>dom.get(`#squee`)).volume = this.user.volume.squee;

	Themes.apply(this.user.themes.name);

	// this must run after this.draw
	this.buttons = {
		main: document.querySelector('button#main'),
		retryTO: document.querySelector('button#retryTO'),
		retryQueue: document.querySelector('button#retryQueue'),
		hide: document.querySelector('button#hide'),
		blocks: document.querySelector('button#blocks'),
		incs: document.querySelector('button#incs'),
		ignores: document.querySelector('button#ignores'),
		settings: document.querySelector('button#settings'),
	};
	bindButtons.call(this);
	bindCheckboxes.call(this);
	this.Status = new StatusManager();

	const panelKeys = Object.keys(titles);
	for (var k of panelKeys) {
		// TODO figure this out
		this.panel[k] = document.getElementById(k);
		this.panel[k].onchange = optionChange.bind(this);
		if (k === 'pay' || k === 'search') this.panel[k].addEventListener('keydown', kdFn);
		if ((k === 'sortPay' || k === 'sortAll') && this.panel[k].checked) moveSortdirs(this.panel[k]);
	}
}
