import Settings from 'Settings';
import state from 'lib/state';

import { Core } from '../index';

import bubbleNewHits from './bubble-new-hits';
import setRowColor from './set-row-color';
import addRowHTML from './add-row-html';

export interface HITCounts {
	total: number;
	new: number;
	newVis: number;
	ignored: number;
	blocked: number;
	included: number;
	includedNew: number;
};

// TODO this function should ONLY render the current state, nthing else
export default function (this: Core) {
	const table = (<HTMLTableElement>document.querySelector('#resultsTable')).tBodies[0];
	const html = [];
	const results = state.scraperHistory.filter((hit) => {
		if (!hit.current) return false;
		if (Settings.user.mhide && hit.masters) return false;

		return true;
	});

	// sorting
	if (
		!Settings.user.disableTO &&
		Settings.user.sortPay !== Settings.user.sortAll
	) {
		let field: string;
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
	const counts: HITCounts = {
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
			(Settings.user.minTOPay && hitRow.TO && +hitRow.TO.attrs.pay < Settings.user.minTOPay)
		);

		counts.new += hitRow.isNew ? 1 : 0;
		counts.newVis += hitRow.isNew && !shouldHide ? 1 : 0;
		counts.ignored += shouldHide ? 1 : 0;
		counts.blocked += hitRow.blocked ? 1 : 0;
		counts.included += hitRow.included ? 1 : 0;
		counts.includedNew += hitRow.included && hitRow.isNew ? 1 : 0;
		const rowColor = setRowColor(hitRow);
		html.push(addRowHTML(hitRow, shouldHide, this.reviewsError, this.reviewsLoading, rowColor));
	}
	table.innerHTML = html.join('');
	if (!this.reviewsError) this.notify(counts, this.reviewsLoading);
}
