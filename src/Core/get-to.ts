import * as ifc from 'ifc';
import Interface from 'Interface';
import Settings from 'Settings';
import state from 'lib/state';
import { TO_API } from 'lib/constants';
import prepReviews from 'lib/prep-reviews';

import { Core } from './index';
import { updateHits } from 'api/listen';

// it would be a litle too complicated to have "empty" reviews so just keep track of which IDs have no reviews
const noReviewIDs: string[] = [];

export default function (this: Core) {
	const ids = state.scraperHistory.filterRIDs(hit => {
		// we only want current hits without TO data, not blocked, and with a requester id
		// (and if cacheTO is on we want IDs that (may) have been reviewed already)
		return (
			hit.current &&
			!hit.TO &&
			!hit.blocked &&
			Boolean(hit.requester.id) &&
			(!Settings.user.cacheTO || noReviewIDs.indexOf(hit.requester.id) === -1)
		);
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
		blacklistEmpties(reviews);
		const updatedHits = state.scraperHistory.updateTOData(prepReviews(reviews));
		updateHits(updatedHits);
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

function blacklistEmpties(reviews: ifc.ListOfReviews) {
	// push RIDs with no reviews into noReviewIDs
	const rids = Object.keys(reviews);
	for (let i = 0; i < rids.length; i++) {
		if (typeof reviews[rids[i]] === 'string') {
			noReviewIDs.push(rids[i]);
		}
	}
}
