import * as ifc from '../ifc';
import { Interface } from '.';
import * as dom from '../lib/dom-util';
import Settings from '../Settings/index';
import moveSortdirs from './move-sort-dirs';

// TODO make a generic option-change function/class that accepts custom handling

export default function (this: Interface, e: Event) {
	const target = <HTMLElement>e.target;
	const tag = target.tagName;
	const id = target.id;

	switch (tag) {
		case 'SELECT': {
			const selectEl = <HTMLSelectElement>target;
			if (id === 'soundSelect')
				this.user.notifySound[1] = <ifc.SoundName>selectEl.value;
			else
				this.user[id] = selectEl.selectedIndex;
			break;
		}
		case 'INPUT': {
			const inputEl = <HTMLInputElement>target;
			switch (inputEl.type) {
				case 'number': {
					this.user[id] = +inputEl.value;
					break;
				}
				case 'text': {
					this.user[id] = inputEl.value;
					break;
				}
				case 'radio': {
					Array.from(dom.getAll(`input[name=${name}]`))
						.forEach((v: HTMLInputElement) => {
							this.user[v.id] = v.checked;
							dom.get(`label[for=${v.id}]`).classList.toggle('checked');
						});
					break;
				}
				case 'checkbox': {
					if (name === 'sort') {
						Array.from(dom.getAll(`input[name=${name}]`)).forEach((v: HTMLInputElement) => {
							if (target !== v) v.checked = false;
							dom.get(`label[for=${v.id}]`).className = v.checked ? 'checked' : '';
							this.user[v.id] = v.checked;
						});
						moveSortdirs(inputEl);
						break;
					} else if (id === 'sound') {
						this.user.notifySound[0] = inputEl.checked;
						(<HTMLElement>inputEl.nextElementSibling).style.display = inputEl.checked ? 'inline' : 'none';
					}
					this.user[id] = inputEl.checked;
					dom.get(`label[for=${id}]`).classList.toggle('checked');
					break;
				}
			}
			break;
		}
	}
	Settings.save();
}
