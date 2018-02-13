import Settings from '../Settings/index';

import resetTitle from './reset-title';
import toggleOverflow from './toggle-overflow';
import draw from './draw';
import init from './init';

class Interface {
	constructor() {
		this.user = Settings.user;
		this.time = Date.now();
		this.focused = true;
		this.blackhole = {};
		this.isLoggedout = false; // TODO broken on new site; looking for alternative

		this.resetTitle = resetTitle.bind(this);
		this.toggleOverflow = toggleOverflow.bind(this);
		this.draw = draw.bind(this);
		this.init = init.bind(this);
	}
}
export default new Interface();
