import Settings from '../../Settings/index';

export default function setRowColor(hitRow) {
	var ct = Settings.user.colorType;
	if (!hitRow.TO || (ct === 'adj' && hitRow.TO.reviews < 5)) {
		// if using adjusted color type, require at least 5 reviews
		hitRow.rowColor = 'toNone';
		return;
	}
	hitRow.rowColor = getClassFromValue(ct === 'sim' ? hitRow.TO.attrs.qual : hitRow.TO.attrs.adjQual, ct);
}

function getClassFromValue(toVal, type) {
	if (type === 'sim') {
		if (toVal > 4) {
			return 'toHigh';
		} else if (toVal > 3) {
			return 'toGood';
		} else if (toVal > 2) {
			return 'toAverage';
		} else {
			return 'toPoor';
		}
	} else {
		if (toVal > 4.05) {
			return 'toHigh';
		} else if (toVal > 3.06) {
			return 'toGood';
		} else if (toVal > 2.4) {
			return 'toAverage';
		} else {
			return 'toPoor';
		}
	}
}
