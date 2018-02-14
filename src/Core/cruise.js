import Interface from '../Interface/index';
import Settings from '../Settings/index';

export default function (firstTick) {
	if (!this.active) return;

	if (!firstTick) this.cooldown--;

	let noTimer = false;

	if (this.cooldown === 0 && Settings.user.pcQueue && !queueEmpty()) {
		if (Settings.user.pcQueueWaitTime === 0) {
			reset.apply(this);
		} else {
			noTimer = true;
			setTimeout(this.cruise.bind(this), Settings.user.pcQueueWaitTime);
		}

		Interface.Status.show('queue-wait');
	}

	if (this.cooldown === 0) {
		Interface.Status.hide('queue-wait');
		this.run(true);
	} else if (!noTimer) {
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
