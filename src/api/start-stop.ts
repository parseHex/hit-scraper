import Core from 'Core';

export function start() {
	const mainBtn = <HTMLButtonElement>document.getElementById('main');

	if (mainBtn.textContent === 'Stop') return;

	Core.cruising = true;
	mainBtn.textContent = 'Stop';
	Core.run();
}
export function stop() {
	const mainBtn = <HTMLButtonElement>document.getElementById('main');

	if (mainBtn.textContent === 'Start') return;

	Core.cruising = false;
	mainBtn.textContent = 'Start';
	Core.run();
}
