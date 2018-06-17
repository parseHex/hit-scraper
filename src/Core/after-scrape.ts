import state from 'lib/state';
import Settings from 'Settings';
import Interface from 'Interface';

import { Core } from './index';
import { ScrapeInfo } from './scrape';

export default function (this: Core, info: ScrapeInfo) {
	const numBlocked = state.scraperHistory.filter(v => v.current && v.blocked).length;
	const _rpp = Settings.user.resultsPerPage;
	const skiplimit = 5; // max number of pages to skip

	let pagelimit;
	if (Settings.user.skips) {
		const magicNumber = (numBlocked % _rpp > 0.66 * _rpp ? 1 : 0);

		pagelimit = Settings.user.pages + Math.floor(numBlocked / _rpp) + magicNumber;
		pagelimit = pagelimit || 3;
	} else {
		pagelimit = Settings.user.pages || 3;
	}

	if (
		!this.active ||
		!info.nextPageURL ||
		info.page >= pagelimit ||
		(pagelimit - Settings.user.pages) >= skiplimit
	) {
		// we're done scraping
		Interface.Status.hide('processing');

		this.lastScrape = Date.now();

		// see if we should get reviews
		if (Settings.user.disableTO) {
			this.meld();
			this.finishedSearch();
		} else {
			if (Settings.user.asyncTO) {
				// this is a little silly repeating this but oh well
				// treat TO as async so show the results before reviews are loaded
				this.meld();
			}
			this.getTO();
		}
	} else {
		// still more to scrape
		Interface.Status.edit('processing', (+info.page + 1) + '');
		Interface.Status.show('processing');

		if (+info.page + 1 > Settings.user.pages) {
			Interface.Status.show('correcting-skips');
		}

		setTimeout(() => {
			this.fetch({
				url: info.nextPageURL,
				responseType: info.responseType,
				payload: info,
			})
				.then(function (src) {
					Interface.Status.hide('correcting-skips');
					this.scrape(src);
				})
				.catch(this.scrapeError.bind(this));
		}, 250);
	}
}
