import Settings from '../Settings/index';
import Interface from '../Interface/index';
import { Core } from '.';

export default function (this: Core, skipToggle?: boolean) {
	if (!skipToggle) this.active = !this.active;

	clearTimeout(this.timer);
	this.cooldown = Settings.user.refresh;
	this.timer = null;
	Interface.resetTitle();

	if (this.active) {
		Interface.Status.clear();
		Interface.Status.edit('processing', '1');
		Interface.Status.show('processing');

		this.fetch({
			url: 'https://worker.mturk.com/',
			responseType: 'json',
			payload: this.getPayload(),
		})
			.then(this.scrape.bind(this))
			.catch(this.scrapeError.bind(this));
	}
}
