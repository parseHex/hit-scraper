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

	if (ids.length === 0) {
		// no reviews to get
		this.meld();
		this.finishedSearch();
		return;
	}

	if (Settings.user.asyncTO) {
		this.reviewsLoading = true;
	}

	Interface.Status.show('retrieving-to');

	const lastScrape = this.lastScrape;

	this.fetch({
		url: TO_API + ids,
		responseType: 'json',
		timeout: Settings.user.toTimeout * 1000,
	}).then((reviews) => {
		this.reviewsLoading = false;
		state.scraperHistory.updateTOData(prepReviews(reviews));
	}).catch(err => {
		console.warn(err);

		Interface.Status.show('to-error');
		this.reviewsError = true;
		this.reviewsLoading = false;
	}).then(() => {
		if (lastScrape !== this.lastScrape) {
			// we don't want to trigger a rerender if there's been a scrape since we started the request
			// the reviews will still be added to cache (if enabled)
			return;
		}

		// meld new state regardless whether error or success
		Interface.Status.hide('retrieving-to');
		this.meld();
		this.finishedSearch();
	});
}
