import defaults from './defaults';
import save from './save';
import draw from './draw';
import init from './init';
import die from './die';

class Settings {
	constructor() {
		this.defaults = defaults;
		this.user = {};

		this.save = save.bind(this);
		this.draw = draw.bind(this);
		this.init = init.bind(this);
		this.die = die.bind(this);
	}
}
export default new Settings();
