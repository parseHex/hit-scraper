import Interface from 'Interface';
import Settings from 'Settings';

import { DOC_TITLE } from 'lib/constants';
import { HITCounts } from './meld';

export default function (counts: HITCounts, loading: boolean) {
	var s = [];
	s.push(counts.total > 0 ? `${counts.total} HIT${counts.total > 1 ? 's' : ''}` : '<b>No HITs found.</b>');
	if (counts.new) s.push(`<i></i>${counts.new} new`);
	if (counts.newVis !== counts.new) s.push(` (${counts.newVis} shown)`);
	if (counts.included) s.push(`<i></i><b>${counts.included} from includelist</b>`);
	if (counts.ignored) s.push(`<i></i>${counts.ignored} hidden -- `);
	if (counts.blocked) s.push(`${counts.ignored ? '' : '<i></i>'}${counts.blocked} from blocklist`);
	if (counts.ignored - counts.blocked > 0) s.push(`${counts.blocked
		? '<i></i>'
		: ''}${counts.ignored - counts.blocked} below TO threshold`);

	Interface.Status.show('scrape-complete');
	Interface.Status.edit('scrape-complete', s.join(''));

	if (counts.newVis && Settings.user.notifySound[0] && !loading) {
		(<HTMLAudioElement>document.getElementById(Settings.user.notifySound[1])).play();
	}
	if (!counts.newVis || Interface.focused || loading) return;

	document.title = `[${counts.newVis} new]` + DOC_TITLE;
	if (Settings.user.notifyBlink) Interface.blackhole.blink =
		setInterval(() => document.title = /scraper/i.test(document.title)
			? `${counts.newVis} new HITs`
			: DOC_TITLE, 1000);
	// TODO remove cast to any once typescript is at 3.0
	if (Settings.user.notifyTaskbar && (<any>Notification).permission === 'granted') {
		var inc = counts.includedNew ? ` (${counts.includedNew} from includelist)` : '',
			n = new Notification('HITScraper found ' + counts.newVis + ' new HITs' + inc);
		n.onclick = n.close;
		setTimeout(n.close.bind(n), 5000);
	}
}
