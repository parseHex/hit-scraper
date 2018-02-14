import state from '../lib/state';
import Settings from '../Settings/index';
import Interface from '../Interface/index';

export default function (type, src) {
	switch (type) {
		case 'external':
			Interface.Status.hide('retrieving-to');
			Interface.Status.hide('to-error');
			this.meld(src);
			break;
		case 'internal':
			// if (ENV.HOST === ENV.LEGACY) {
			// 	const error = src.querySelector('td[class="error_title"]');
			// 	if (error && /page request/.test(error.textContent)) {
			// 		return setTimeout(this.fetch.bind(this), 3000, src.documentURI);
			// 	}
			// }
			this.scrapeNext(src);
			break;
		case 'control':
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
				!src.nextPageURL ||
				src.page >= pagelimit ||
				(pagelimit - Settings.user.pages) >= skiplimit ||
				(Interface.isLoggedout && src.page === 20)
			) {
				Interface.Status.hide('processing');

				if (Settings.user.disableTO) {
					this.meld({});
				} else {
					this.getTO();
				}
			} else {
				Interface.Status.edit('processing', +src.page + 1);
				Interface.Status.show('processing');

				if (+src.page + 1 > Settings.user.pages) {
					Interface.Status.show('correcting-skips');
				}

				setTimeout(this.fetch.bind(this), 250, src.nextPageURL, src.payload, src.responseType);
			}
			break;
	}
}
