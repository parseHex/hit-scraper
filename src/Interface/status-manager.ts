import * as ifc from 'ifc';
import * as dom from 'lib/dom-util';

export class StatusManager {
	node: HTMLElement;

	constructor() {
		this.node = dom.get('#status');
	}

	show(name: ifc.StatusMessageID) {
		this.node.querySelector(`#status-${name}`).classList.remove('hidden');
	}
	hide(name: ifc.StatusMessageID) {
		this.node.querySelector(`#status-${name}`).classList.add('hidden');
	}
	edit(name: ifc.StatusMessageID, newText: string) {
		this.node.querySelector(`#status-${name} span`).innerHTML = newText;
	}
	clear() {
		Array.from(this.node.querySelectorAll('[id^="status-"]')).forEach(function (el: HTMLElement) {
			el.classList.add('hidden');
		});
	}
}
