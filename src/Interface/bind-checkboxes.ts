import * as dom from 'lib/dom-util';

import { Interface } from './index';

export default function (this: Interface) {
	dom.get('#disableTO').addEventListener('change', (e) => {
		if ((<HTMLInputElement>e.target).checked) {
			this.Status.hide('to-error');
		}
	});
	dom.get('#hideBlock').addEventListener('change', () => {
		Array.from(dom.getAll('.blocklisted')).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
	dom.get('#hideNoTO').addEventListener('change', () => {
		Array.from(dom.getAll('.toNone')).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
}
