import * as ifc from 'ifc';
import Settings from 'Settings';

export default function setRowColor(hit: ifc.HITData) {
	var ct = Settings.user.colorType;
	if (!hit.TO || (ct === 'adj' && hit.TO.reviews < 5)) {
		// if using adjusted color type, require at least 5 reviews
		return 'toNone';
	}

	const toVal = ct === 'sim' ? hit.TO.attrs.qual : hit.TO.attrs.adjQual;

	return getClassFromValue(+toVal, ct);
}

function getClassFromValue(toVal: number, type: 'sim' | 'adj') {
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
