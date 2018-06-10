import { Interface } from '.';
import Core from '../Core';
import Settings from '../Settings';
import { Editor } from '../Editor';
import * as dom from '../lib/dom-util';

export default function (this: Interface) {
	this.buttons.main.addEventListener('click', (e) => {
		const target = <HTMLElement>e.target;
		Core.cruising = !Core.cruising;
		target.textContent = Core.cruising ? 'Stop' : 'Start';
		Core.run();
	});
	this.buttons.retryTO.addEventListener('click', (e) => {
		if (!Core.canRetryTO) return;
		Core.canRetryTO = false;

		const target = <HTMLElement>e.target;

		target.classList.add('disabled');
		Core.getTO();
		setTimeout(function () {
			Core.canRetryTO = true;
			target.classList.remove('disabled');
		}, 3000);
	});
	this.buttons.retryQueue.addEventListener('click', () => {
		if (!Settings.user.pcQueue) return;

		Core.cruise(false, true);
	});
	this.buttons.hide.addEventListener('click', (e) => {
		const target = <HTMLElement>e.target;
		dom.get('#controlpanel').classList.toggle('hiddenpanel');
		target.textContent = target.textContent === 'Hide Panel' ? 'Show Panel' : 'Hide Panel';

		Settings.user.hidePanel = !Settings.user.hidePanel;
		Settings.save();
	});
	this.buttons.blocks.addEventListener('click', () => {
		this.toggleOverflow('on'); // TODO what does this do?
		new Editor('ignore');
	});
	this.buttons.incs.addEventListener('click', () => {
		this.toggleOverflow('on');
		new Editor('include');
	});
	this.buttons.ignores.addEventListener('click', () => {
		Array.from(dom.getAll('.ignored:not(.blocklisted)')).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
	this.buttons.settings.addEventListener('click', () => {
		this.toggleOverflow('on');
		Settings.draw().init();
	});
}
