import * as ifc from 'ifc';

import Cache from './Cache';

export default class TOCache extends Cache<ifc.ReviewData> {
	setBatch(reviews: ifc.ListOfReviews) {
		if (!reviews) return null;

		Object.keys(reviews).forEach((rid) => this.update(rid, reviews[rid]));
		return reviews;
	}
}
