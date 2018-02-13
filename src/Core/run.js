import Settings from '../Settings/index';
import Interface from '../Interface/index';
import { ENV } from '../lib/constants';

export default function (skiptoggle) {
	if (!skiptoggle) this.active = !this.active;

	this.cooldown = Settings.user.refresh;
	this.timer = clearTimeout(this.timer);
	Interface.resetTitle();

	if (this.active) {
		Interface.Status.clear();
		Interface.Status.edit('processing', 1);
		Interface.Status.show('processing');

		const next = ENV.HOST === ENV.NEXT;
		const path = next ? '/' : '/mturk/searchbar';
		const resType = next ? 'json' : 'document';
		this.fetch(path, this.getPayload(), resType);
	}
}
