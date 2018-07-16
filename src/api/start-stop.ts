export function start() {
	const mainBtn = <HTMLButtonElement>document.getElementById('main');

	if (mainBtn.textContent === 'Stop') return;

	mainBtn.click();
}
export function stop() {
	const mainBtn = <HTMLButtonElement>document.getElementById('main');

	if (mainBtn.textContent === 'Start') return;

	mainBtn.click();
}
