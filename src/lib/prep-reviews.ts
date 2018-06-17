import * as ifc from 'ifc';
import Settings from 'Settings';

export default function prepReviews(reviews: ifc.ListOfReviews) {
	const adj = (x: number, n: number) => ((x * n + 15) / (n + 5)) - 1.645 * Math.sqrt((Math.pow(1.0693 * x, 2) - Math.pow(x, 2)) / (n + 5));
	Object.keys(reviews).forEach(rid => {
		if (typeof reviews[rid] === 'string') return delete reviews[rid]; // no reviews yet

		//adjust ratings
		let n = 0, d = 0;
		Object.keys(reviews[rid].attrs).forEach(attr => {
			n += +reviews[rid].attrs[attr] * Settings.user.toWeights[attr];
			d += Settings.user.toWeights[attr];
		});
		reviews[rid].attrs.qual = (n / d).toPrecision(4);
		reviews[rid].attrs.adjQual = adj(n / d, +reviews[rid].reviews).toPrecision(4);
		reviews[rid].attrs.adjPay = adj(+reviews[rid].attrs.pay, +reviews[rid].reviews).toPrecision(4);
	});
	return reviews;
}
