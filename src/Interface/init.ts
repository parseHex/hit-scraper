import { kb } from '../lib/constants';
import Themes from '../Themes/index';
import { Interface } from '.';
import * as dom from '../lib/dom-util';
import optionChange from '../Settings/option-change';
import titles from './titles';
import moveSortdirs from './move-sort-dirs';

export default function (this: Interface) {
	var kdFn = (e: KeyboardEvent) => { if (e.keyCode === kb.ENTER) setTimeout(() => this.buttons.main.click(), 30); };

	(<HTMLAudioElement>dom.get(`#ding`)).volume = this.user.volume.ding;
	(<HTMLAudioElement>dom.get(`#squee`)).volume = this.user.volume.squee;

	Themes.apply(this.user.themes.name);

	const panelKeys = Object.keys(titles);
	for (var k of panelKeys) {
		// TODO figure this out
		this.panel[k] = document.getElementById(k);
		this.panel[k].onchange = optionChange.bind(this);
		if (k === 'pay' || k === 'search') this.panel[k].addEventListener('keydown', kdFn);
		if ((k === 'sortPay' || k === 'sortAll') && this.panel[k].checked) moveSortdirs(this.panel[k]);
	}
}
