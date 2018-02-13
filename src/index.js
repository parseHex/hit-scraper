import HITStorage from './HITStorage/index';
import { delegate } from './lib/util';
import Exporter from './Exporter/index';
import Dialogue from './Dialogue/index';
import DBQuery from './DBQuery/index';
import state from './lib/state';
import Settings from './Settings/index';
import Interface from './Interface/index';
import ScraperCache from './Cache/ScraperCache';

console.log('HS hook');
if (!document.getElementById('control_panel')) {
	initialize();
	HITStorage.attach('HITDB');
	const rt = document.getElementById('resultsTable');
	delegate(rt, 'tr:not(hidden) .toLink, tr:not(hidden) .hit-title', 'mouseover', tomouseover);
	delegate(rt, 'tr:not(hidden) .toLink, tr:not(hidden) .hit-title', 'mouseout', tomouseout);
	delegate(rt, 'tr:not(hidden) .ex', 'click', e => new Exporter(e));
	delegate(rt, 'tr:not(hidden) button[name=block]', 'click', ({ target }) => new Dialogue(target));
	delegate(rt, 'tr:not(hidden) .db', 'click', ({ target }) => new DBQuery(target));
}

export default function initialize() {
	Settings.user = Object.assign({}, Settings.defaults, JSON.parse(localStorage.getItem('scraper_settings')));
	Interface.draw().init();
	state.scraperHistory = new ScraperCache(650);
}

function tomouseover(e) {
	const tt = e.target.parentElement.querySelector('.tooltip');
	tt.style.display = 'block';
	const rect = tt.getBoundingClientRect();
	if (rect.height > (window.innerHeight - e.clientY)) {
		tt.style.transform = 'translateY(calc(-100% + 22px))';
	}
	if (rect.x < 0) {
		const width = +tt.style.width.replace('px', '') - 3;
		tt.style.width = (width + rect.x) + 'px';
	} else {
		tt.style.width = '300px';
	}
}

function tomouseout(e) {
	const tt = e.target.parentElement.querySelector('.tooltip');
	if (!tt) return;

	tt.style.transform = '';
	tt.style.display = 'none';
}
