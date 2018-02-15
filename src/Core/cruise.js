import Interface from '../Interface/index';
import Settings from '../Settings/index';

export default function (firstTick, tryAgain) {
	if (!this.active) return;

	if (!firstTick && !tryAgain) this.cooldown--;

	if (
		(this.cooldown === 0 || tryAgain) &&
		Settings.user.pcQueue &&
		!queueEmpty()
	) {
		reset.apply(this);
		Interface.Status.show('queue-wait');

		tryAgain = false;
	}

	if (this.cooldown === 0 || tryAgain) {
		Interface.Status.hide('queue-wait');
		this.run(true);
	} else {
		Interface.Status.edit('scraping-again', this.cooldown);
		Interface.Status.show('scraping-again');

		this.timer = setTimeout(this.cruise.bind(this), 1000);
	}
}

function queueEmpty() {
	let pcData = localStorage.getItem('JR_QUEUE_StoreData');
	if (!pcData) return true;
	pcData = JSON.parse(pcData);
	return pcData.queue.length < Settings.user.pcQueueMin;
}

function reset() {
	this.cooldown = Settings.user.refresh;
	this.timer = clearTimeout(this.timer);
	Interface.resetTitle();
	Interface.Status.clear();
}
