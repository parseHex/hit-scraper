import * as ifc from '../ifc';
import { Settings } from '.';
import Themes from '../Themes/index';

export default function (this: Settings, e: Event) {
	const target = <HTMLInputElement>e.target;
	var tag = target.tagName, type = target.type, id = target.id,
		isChecked = target.checked, name = target.name, value = target.value;

	switch (tag) {
		case 'SELECT': {
			//get('#thedit').textContent = value === 'random' ? 'Re-roll!' : 'Edit Current Theme';
			this.user.themes.name = <ifc.ThemeName>value;
			Themes.apply(value, this.user.hitColor);
			break;
		}
		case 'INPUT': {
			switch (type) {
				case 'radio': {
					if (name === 'checkbox') {
						this.user.showCheckboxes = (value === 'true');
						Array.from(document.querySelectorAll('#controlpanel input[type=checkbox],#controlpanel input[type=radio]'))
							.forEach(v => v.classList.toggle('hidden'));
					}
					else this.user[name] = value;
					if (name === 'hitColor') Themes.apply(this.user.themes.name, value);
					break;
				}
				case 'checkbox': {
					this.user[id] = isChecked;
					if (name === 'export') {
						Array.from(document.querySelectorAll(`button.${value}`))
							.forEach((v: HTMLElement) => v.style.display = isChecked ? 'inline' : 'none');
					}
					/*
						typescript 2.9 has an incorrect definition for Notifcation
						TODO remove the cast to any once 3.0 lands
					*/
					if (id === 'notifyTaskbar' && isChecked && (<any>Notification).permission === 'default') {
						Notification.requestPermission();
					}
					if (name === 'tableColumn') {
						const columnName = id.replace('Column', '');
						const display = isChecked ? 'table-cell' : 'none';

						Array.from(document.querySelectorAll(`.${columnName}-tc`))
							.forEach((el: HTMLElement) => el.style.display = display);
					}
					break;
				}
				case 'number': {
					const valueNum = +value;

					const fontStylesheet = <HTMLStyleElement>document.head.querySelector('#lazyfont');
					const sheet = <CSSStyleSheet>fontStylesheet.sheet;
					if (name === 'fontSize') {
						(<CSSStyleRule>sheet.cssRules[0]).style.fontSize = valueNum + 'px';
					} else if (name === 'shineOffset') {
						(<CSSStyleRule>sheet.cssRules[1]).style.fontSize = +this.user.fontSize + valueNum + 'px';
					}

					if (name === 'TOW') {
						this.user.toWeights[id] = value;
					} else {
						this.user[name] = value;
					}
					break;
				}
				case 'range': {
					this.user.volume[name] = value;
					const audio = <HTMLAudioElement>document.querySelector(`#${name}`);
					audio.volume = +value;
					audio.play();
					break;
				}
				case 'text': {
					this.user[id] = value;
					break;
				}
			}
			break;
		}
	}
	this.save();
}
