import * as ifc from 'ifc';
import Settings from 'Settings/index';
import { DOC_TITLE } from 'lib/constants';

import { StatusManager } from './status-manager';
import draw from './draw';
import init from './init';

export class Interface {
	user: ifc.SettingsConfig;
	time: number;
	focused: boolean = true;
	blackhole: { // TODO what is this?
		blink: number;
	};
	panel: ifc.BasicObject;
	buttons: ifc.InterfaceButtons;
	Status: StatusManager;

	draw: (this: Interface) => this;
	init: (this: Interface) => void;

	constructor() {
		this.user = Settings.user;
		this.time = Date.now();
		this.blackhole = {
			blink: null,
		};
		this.panel = {};

		document.body.onblur = () => this.focused = false;
		document.body.onfocus = () => {
			this.focused = true;
			this.resetTitle();
		};

		this.draw = draw.bind(this);
		this.init = init.bind(this);
	}

	resetTitle() {
		if (this.blackhole.blink) clearInterval(this.blackhole.blink);
		document.title = DOC_TITLE;
	}

	toggleOverflow(state: 'on' | 'off') {
		const curtain = <HTMLElement>document.body.querySelector('#curtain');
		curtain.style.display = state === 'on' ? 'block' : 'none';
		document.body.style.overflow = state === 'on' ? 'hidden' : 'auto';
	}
}
export default new Interface();
