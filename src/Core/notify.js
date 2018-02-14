import Interface from '../Interface/index';
import Settings from '../Settings/index';
import { DOC_TITLE } from '../lib/constants';

export default function (c, loading) {
	var s = [];
	s.push(c.total > 0 ? `${c.total} HIT${c.total > 1 ? 's' : ''}` : '<b>No HITs found.</b>');
	if (c.new) s.push(`<i></i>${c.new} new`);
	if (c.newVis !== c.new) s.push(` (${c.newVis} shown)`);
	if (c.included) s.push(`<i></i><b>${c.included} from includelist</b>`);
	if (c.ignored) s.push(`<i></i>${c.ignored} hidden -- `);
	if (c.blocked) s.push(`${c.ignored ? '' : '<i></i>'}${c.blocked} from blocklist`);
	if (c.ignored - c.blocked > 0) s.push(`${c.blocked
		? '<i></i>'
		: ''}${c.ignored - c.blocked} below TO threshold`);

	Interface.Status.show('scrape-complete');
	Interface.Status.edit('scrape-complete', s.join(''));

	if (c.newVis && Settings.user.notifySound[0] && !loading) {
		document.getElementById(Settings.user.notifySound[1]).play();
	}
	if (!c.newVis || Interface.focused || loading) return;

	document.title = `[${c.newVis} new]` + DOC_TITLE;
	if (Settings.user.notifyBlink) Interface.blackhole.blink =
		setInterval(() => document.title = /scraper/i.test(document.title)
			? `${c.newVis} new HITs`
			: DOC_TITLE, 1000);
	if (Settings.user.notifyTaskbar && Notification.permission === 'granted') {
		var inc = c.incNew ? ` (${c.incNew} from includelist)` : '',
			n = new Notification('HITScraper found ' + c.newVis + ' new HITs' + inc);
		n.onclick = n.close;
		setTimeout(n.close.bind(n), 5000);
	}
}
