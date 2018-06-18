import Interface from 'Interface';

export function start() {
	if (Interface.buttons.main.textContent === 'Stop') return;

	Interface.buttons.main.click();
}
export function stop() {
	if (Interface.buttons.main.textContent === 'Start') return;

	Interface.buttons.main.click();
}
