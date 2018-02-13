import main from './html/main';

export default function () {
	const _main = main.apply(this);

	this.main = document.body.appendChild(document.createElement('DIV'));
	this.main.id = 'settingsMain';
	this.main.innerHTML = _main;
	return this;
}
