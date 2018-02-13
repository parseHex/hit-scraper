import Cache from './Cache';

export default class TOCache extends Cache {
	setBatch(reviews) {
		if (!reviews) return null;

		Object.keys(reviews).forEach((rid) => this._update(rid, reviews[rid]));
		return reviews;
	}
}
