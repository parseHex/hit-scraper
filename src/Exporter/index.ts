import * as ifc from 'ifc';
import Interface from 'Interface';
import state from 'lib/state';

import pandaCrazy from './panda-crazy';

type ExportName = 'pc-p' | 'pc-o';
type Exports = { [N in ExportName]: () => void };

export class Exporter {
	target: HTMLElement;
	node: HTMLElement;
	record: ifc.HITData;

	constructor(e: Event) {
		Interface.toggleOverflow('on');

		this.target = <HTMLElement>e.target;
		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.classList.add('pop');
		this.record = state.scraperHistory.get(this.target.dataset.gid);

		const exports: Exports = {
			'pc-p': pandaCrazy.bind(this, ''), // Panda mode
			'pc-o': pandaCrazy.bind(this, 'Once'), // Once mode
		};
		const exportName = <ExportName>this.target.dataset.exporter;

		exports[exportName]();
	}

	die() {
		Interface.toggleOverflow('off');
		this.node.remove();
	}
}
