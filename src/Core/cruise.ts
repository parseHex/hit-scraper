import Interface from '../Interface/index';
import Settings from '../Settings/index';
import { Core } from '.';

export default function (this: Core, firstTick: boolean, tryAgain: boolean) {
	if (!this.active) return;

	if (!firstTick && !tryAgain) this.cooldown--;

	if (
		(this.cooldown === 0 || tryAgain) &&
		Settings.user.pcQueue &&
		!queueEmpty()
	) {
		reset.call(this);
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
	const pcDataJSON = localStorage.getItem('JR_QUEUE_StoreData');
	if (!pcDataJSON) return true;
	const pcData = JSON.parse(pcDataJSON);

	const now = Date.now();
	if (now - pcData.date > 30) {
		// pcData is more than 30 seconds old so panda crazy probably isnt open
		return true;
	}

	return pcData.queue.length < Settings.user.pcQueueMin;
}

function reset() {
	this.cooldown = Settings.user.refresh;
	this.timer = clearTimeout(this.timer);
	Interface.resetTitle();
	Interface.Status.clear();
}
