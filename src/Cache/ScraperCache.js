import Cache from './Cache';
import TOCache from './TOCache';
import Core from '../Core/index';
import Settings from '../Settings/index';

export default class ScraperCache extends Cache {
	constructor(limit = 500) {
		super(limit);
		this._toCache = new TOCache();
	}

	set(key, value) {
		if (
			Settings.user.cacheTO &&
			!value.TO &&
			value.requester.id &&
			this._toCache.has(value.requester.id)
		) {
			value.TO = this._toCache.get(value.requester.id);
		}

		exportData(value);

		const isFirstScrape = !Core.lastScrape;
		if (this.get(key)) { // exists
			const age = Math.floor((Date.now() - this._cache[key].discovery) / 1000);
			const obj = {
				isNew: false,
				shine: this._cache[key].shine && age < Settings.user.shine && !isFirstScrape,
			};

			value.discovery = this._cache[key].discovery;
			return (this._cache[key] = Object.assign(value, obj));
		} else { // new
			const obj = {
				isNew: !isFirstScrape,
				shine: !isFirstScrape,
			};

			return this._update(key, Object.assign(value, obj));
		}
	}

	filter(callback, rids = false) {
		const results = [];
		const keys = Object.keys(this._cache);

		Object.keys(this._cache).forEach((key) => {
			const val = this.get(key);

			if (callback(val, key, this._cache)) {
				results.push(rids ? val.requester.id : val);
			}
		});

		return results;
	}

	updateTOData(reviews) {
		this._toCache.setBatch(reviews);

		this.filter(v => v.current && v.TO === null).forEach((group) => {
			if (this._toCache.has(group.requester.id)) {
				this._cache[group.groupId].TO = this._toCache.get(group.requester.id);

				exportData(this._cache[group.groupId]);
			}
		});
	}
}

function exportData(hit) {
	if (!Settings.user.exportExternal) return;
	if (Settings.user.externalNoBlocked && hit.blocked) return;

	const hitData = {
		title: hit.title,
		groupID: hit.groupId,
		requesterName: hit.requester.name,
		requesterID: hit.requester.id,
		description: hit.desc,
		quals: hit.quals,
		pay: hit.payRaw,
		time: hit.time,
		timeStr: hit.timeStr,
		TO: hit.TO === null ? {} : hit.TO,
		qualified: hit.qualified,
		masters: hit.masters,
		numHITs: hit.numHits,
		blocked: hit.blocked,
		ignored: hit.ignored,
		included: hit.included,
	};

	window.postMessage({
		from: 'hit-scraper',
		hitData,
	}, '*');
}
