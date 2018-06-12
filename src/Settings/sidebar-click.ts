import { Settings } from '.';

export default function (this: Settings, e: Event) {
	const target = <HTMLElement>e.target;

	if (target.classList.contains('settingsSelected')) return; // already selected

	this.get('#settings-' + this.get('.settingsSelected').dataset.target).style.display = 'none';
	this.get('.settingsSelected').classList.toggle('settingsSelected');
	target.classList.toggle('settingsSelected');
	this.get('#settings-' + target.dataset.target).style.display = 'block';
}
