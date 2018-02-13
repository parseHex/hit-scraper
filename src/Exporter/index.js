import { TO_BASE, TO_REPORTS } from '../lib/constants';
import Interface from '../Interface/index';
import Settings from '../Settings/index';
import Editor from '../Editor/index';
import Core from '../Core/index';
import { cleanTemplate } from '../lib/util';
import state from '../lib/state';

import hwtf from './hwtf';
import vb from './vb';
import irc from './irc';
import pandaCrazy from './panda-crazy';

export default class Exporter {
	constructor(e) {
		Interface.toggleOverflow('on');

		this.target = e.target;
		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.classList.add('pop');
		this.record = state.scraperHistory.get(this.target.dataset.gid);

		if (Interface.isLoggedout) return this.die();

		const exports = {
			hwtf: hwtf.bind(this),
			vb: vb.bind(this),
			irc: irc.bind(this),
			'pc-p': pandaCrazy.bind(this, ''), // Panda mode
			'pc-o': pandaCrazy.bind(this, 'Once'), // Once mode
		};
		const exportName = this.target.dataset.exporter;
		exports[exportName]();
	}
	die() {
		Interface.toggleOverflow('off');
		this.node.remove();
	}
}
