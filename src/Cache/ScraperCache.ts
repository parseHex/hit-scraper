import * as ifc from 'ifc';
import Core from 'Core';
import Settings from 'Settings';

import Cache from './Cache';
import TOCache from './TOCache';

export default class ScraperCache extends Cache<ifc.HITData> {
	private toCache: TOCache;

	constructor(limit = 500) {
		super(limit);
		this.toCache = new TOCache();
	}

	set(key: string, value: ifc.HITData) {
		if (
			Settings.user.cacheTO &&
			!value.TO &&
			value.requester.id &&
			this.toCache.has(value.requester.id)
		) {
			value.TO = this.toCache.get(value.requester.id);
		}

		const isFirstScrape = !Core.lastScrape;
		if (this.get(key)) { // exists
			const age = Math.floor((Date.now() - this.cache[key].discovery) / 1000);
			const obj = {
				isNew: false,
				shine: this.cache[key].shine && age < Settings.user.shine && !isFirstScrape,
			};

			value.discovery = this.cache[key].discovery;
			return (this.cache[key] = Object.assign(value, obj));
		} else { // new
			const obj = {
				isNew: !isFirstScrape,
				shine: !isFirstScrape,
			};

			return this.update(key, Object.assign(value, obj));
		}
	}

	filter(callback: (v: ifc.HITData, k: string, c: ifc.ListOfHITs) => boolean) {
		const results: ifc.HITData[] = [];
		const keys = Object.keys(this.cache);

		keys.forEach((key) => {
			const val = this.get(key);

			if (callback(val, key, this.cache)) {
				results.push(val);
			}
		});

		return results;
	}
	filterRIDs(callback: (v: ifc.HITData, k: string, c: ifc.ListOfHITs) => boolean) {
		const results: string[] = [];
		const keys = Object.keys(this.cache);

		keys.forEach((key) => {
			const val = this.get(key);

			if (callback(val, key, this.cache)) {
				results.push(val.requester.id);
			}
		});

		return results;
	}

	updateTOData(reviews: ifc.ListOfReviews) {
		this.toCache.setBatch(reviews);

		this.filter(v => v.current && v.TO === null).forEach((group) => {
			if (this.toCache.has(group.requester.id)) {
				this.cache[group.groupId].TO = this.toCache.get(group.requester.id);
			}
		});
	}
}
