import Interface from '../Interface/index';
import Settings from '../Settings/index';
import state from '../lib/state';
import { TO_API } from '../lib/constants';

export default function () {
	const ids = state.scraperHistory.filter(v => v.current && !v.TO && !v.blocked && v.requester.id, true)
		.filter((v, i, a) => a.indexOf(v) === i).join();

	if (!ids.length) return this.meld({});

	if (Settings.user.asyncTO) {
		// go ahead and show the results without ratings
		this.meld({ loading: true });
	}

	Interface.Status.show('retrieving-to');

	this.fetch(TO_API + ids, null, 'json');
}
