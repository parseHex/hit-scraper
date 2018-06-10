import Interface from '../Interface/index';
import Settings from '../Settings/index';
import state from '../lib/state';
import { TO_API } from '../lib/constants';
import { Core } from '.';
import prepReviews from '../lib/prep-reviews';

export default function (this: Core) {
	const ids = state.scraperHistory.filterRIDs(hit => {
		// we only want current hits without TO data, not blocked, and with a requester id
		return hit.current && !hit.TO && !hit.blocked && Boolean(hit.requester.id);
	}).filter((v, i, a) => {
		// filter out duplicates (leave only 1)
		return a.indexOf(v) === i;
	}).join();

	if (ids.length === 0) return this.meld();

	if (Settings.user.asyncTO) {
		// go ahead and show the results, will re-meld once reviews are loaded
		this.reviewsLoading = true;
		this.meld();
	}

	Interface.Status.show('retrieving-to');

	this.fetch({
		url: TO_API + ids,
		responseType: 'json',
		timeout: Settings.user.toTimeout * 1000,
	}).then((reviews) => {
		state.scraperHistory.updateTOData(prepReviews(reviews));
	}).catch(err => {
		console.warn(err);

		Interface.Status.hide('retrieving-to');
		Interface.Status.show('to-error');
		this.reviewsError = true;

		this.meld();
	});
}
