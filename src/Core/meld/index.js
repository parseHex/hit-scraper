import Interface from '../../Interface/index';
import Settings from '../../Settings/index';
import state from '../../lib/state';
import prepReviews from '../../lib/prep-reviews';
import HITStorage from '../../HITStorage/index';

import bubbleNewHits from './bubble-new-hits';
import setRowColor from './set-row-color';
import addRowHTML from './add-row-html';

export default function (reviews) {
	if (reviews) state.scraperHistory.updateTOData(prepReviews(reviews));

	let noReviews = false;
	if (isEmptyObj(reviews)) noReviews = true;

	const table = document.querySelector('#resultsTable').tBodies[0];
	const html = [];
	const results = state.scraperHistory.filter((hit) => { // only keep hit.current hits
		if (!hit.current) return false;
		if (Settings.user.mhide && hit.masters) {
			hit.current = false;

			return false;
		}

		if (
			Settings.user.disableTO ||
			(Settings.user.asyncTO && reviews && !noReviews)
		) {
			hit.current = false;
		}

		return true;
	});

	// sorting
	if (
		!Interface.isLoggedout &&
		!Settings.user.disableTO &&
		Settings.user.sortPay !== Settings.user.sortAll
	) {
		let field;

		if (Settings.user.sortPay) {
			field = Settings.user.sortType === 'sim' ? 'pay' : 'adjPay';
		} else if (Settings.user.sortAll) {
			field = Settings.user.sortType === 'sim' ? 'qual' : 'adjQual';
		}

		results.sort((hitRow1, hitRow2) => {
			const hitRow1SortVal = hitRow1.TO ? +hitRow1.TO.attrs[field] : 0;
			const hitRow2SortVal = hitRow2.TO ? +hitRow2.TO.attrs[field] : 0;

			return hitRow2SortVal - hitRow1SortVal;
		});

		if (Settings.user.sortAsc) results.reverse();
	} else {
		results.sort((a, b) => a.index - b.index);
	}

	// populating
	const counts = {
		total: results.length,
		new: 0,
		newVis: 0,
		ignored: 0,
		blocked: 0,
		included: 0,
		includedNew: 0,
	};
	for (let hitRow of (Settings.user.bubbleNew ? bubbleNewHits(results) : results)) {
		const shouldHide = Boolean(
			(Settings.user.hideBlock && hitRow.blocked) ||
			(Settings.user.hideNoTO && !hitRow.TO) ||
			(Settings.user.minTOPay && hitRow.TO && +hitRow.TO.attrs.pay < +Settings.user.minTOPay)
		);

		counts.new += hitRow.isNew ? 1 : 0;
		counts.newVis += hitRow.isNew && !shouldHide ? 1 : 0;
		counts.ignored += shouldHide ? 1 : 0;
		counts.blocked += hitRow.blocked ? 1 : 0;
		counts.included += hitRow.included ? 1 : 0;
		counts.includedNew += hitRow.included && hitRow.isNew ? 1 : 0;
		setRowColor(hitRow);
		html.push(addRowHTML(hitRow, shouldHide, noReviews));
	}
	table.innerHTML = html.join('');
	if (!Settings.user.asyncTO || noReviews) this.notify(counts);

	Array.from(table.querySelectorAll('.db')).forEach(el => HITStorage.test(el));

	if (this.active) {
		if (this.cooldown === 0) {
			Interface.buttons.main.click();
		} else if (!this.timer && (!Settings.user.asyncTO || noReviews)) {
			this.timer = setTimeout(this.cruise.bind(this), 1000);

			Interface.Status.edit('scraping-again', this.cooldown);
			Interface.Status.show('scraping-again');
		}
	}

	if (Settings.user.asyncTO && !noReviews) return; // lastScrape isn't set when reviews are loaded async

	this.lastScrape = Date.now();
}

function isEmptyObj(val) {
	if (typeof val !== 'object' || Array.isArray(val)) return false;

	return Object.keys(val).length === 0;
}
