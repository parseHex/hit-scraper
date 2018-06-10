import * as ifc from '../ifc';
import state from '../lib/state';
import Settings from '../Settings/index';
import Interface from '../Interface/index';
import { Core } from '.';
import { ScrapeInfo } from './scrape';

export default function (this: Core, info: ScrapeInfo) {
	switch (type) {
		case 'internal': {
			Interface.Status.hide('correcting-skips');
			this.scrape(<ifc.MTSearchResponse>src);
			break;
		}
		case 'control': {
			const numBlocked = state.scraperHistory.filter(v => v.current && v.blocked).length;
			const _rpp = Settings.user.resultsPerPage;
			const skiplimit = 5; // max number of pages to skip

			// i tried to make the below mess more readable. don't know if i rewrote it correctly
			// leaving the original for reference
			// const pagelimit = Settings.user.skips
			// 	? ((Settings.user.pages + Math.floor(numBlocked / _rpp) + (numBlocked % _rpp > 0.66 * _rpp
			// 		? 1
			// 		: 0)) || 3)
			// 	: (Settings.user.pages || 3);

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
				(pagelimit - Settings.user.pages) >= skiplimit ||
				(Interface.isLoggedout && info.page === 20)
			) {
				// we're done scraping
				Interface.Status.hide('processing');

				if (Settings.user.disableTO) {
					this.meld();
				} else {
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
					}).then(function () {
						// TODO
					}).catch(() => {
						// TODO
					});
				}, 250);
			}
			break;
		}
	}
}
