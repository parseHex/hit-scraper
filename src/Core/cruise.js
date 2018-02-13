import Interface from '../Interface/index';

export default function () {
	if (!this.active) return;

	if (--this.cooldown === 0) {
		this.run(true);
	} else {
		Interface.Status.edit('scraping-again', this.cooldown);
		this.timer = setTimeout(this.cruise.bind(this), 1000);
	}
}
