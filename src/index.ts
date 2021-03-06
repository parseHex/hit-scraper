import { Exporter } from 'Exporter';
import Dialogue from 'Dialogue';
import Settings from 'Settings';
import Interface from 'Interface';
import ScraperCache from 'Cache/ScraperCache';
import state from 'lib/state';
import { delegate } from 'lib/util';
import { SETTINGS_KEY } from 'lib/constants';
import 'api';

console.log('HS hook');
console.time('load');
(async function () {
	if (!document.getElementById('control_panel')) {
		await initialize();

		const rt = document.getElementById('resultsTable');
		delegate(rt, 'tr:not(hidden) .toLink, tr:not(hidden) .hit-title', 'mouseover', tomouseover);
		delegate(rt, 'tr:not(hidden) .toLink, tr:not(hidden) .hit-title', 'mouseout', tomouseout);
		delegate(rt, 'tr:not(hidden) .ex', 'click', e => new Exporter(e));
		delegate(rt, 'tr:not(hidden) button[name=block]', 'click', ({ target }) => {
			new Dialogue(<HTMLInputElement>target);
		});
		console.timeEnd('load');
	}
})();

export default function initialize() {
	Settings.user = Object.assign({}, Settings.defaults, JSON.parse(localStorage.getItem(SETTINGS_KEY)));
	Interface.draw();
	Interface.init();
	state.scraperHistory = new ScraperCache(650);
}

// tooltips
function tomouseover(e: MouseEvent) {
	const target = <HTMLElement>e.target;

	const tooltip: HTMLElement = target.parentElement.querySelector('.tooltip');
	tooltip.style.display = 'block';
	const rect = <DOMRect>tooltip.getBoundingClientRect();

	if (rect.height > (window.innerHeight - e.clientY)) {
		tooltip.style.transform = 'translateY(calc(-100% + 22px))';
	}

	if (rect.x < 0) {
		const width = +tooltip.style.width.replace('px', '') - 3;
		tooltip.style.width = (width + rect.x) + 'px';
	} else {
		tooltip.style.width = '300px';
	}
}

// tooltips
function tomouseout(e: MouseEvent) {
	const target = <HTMLElement>e.target;
	const tooltip: HTMLElement = target.parentElement.querySelector('.tooltip');
	if (!tooltip) return;

	tooltip.style.transform = '';
	tooltip.style.display = 'none';
}
