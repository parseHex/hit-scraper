export default class Cache {
	constructor(limit = 500) {
		this.limit = limit;
		this._length = 0;
		this._cache = Object.create(null);
		this._tmp = Object.create(null);
	}

	get(key) {
		let val = this._cache[key];

		if (val) {
			return val;
		} else if (this._tmp[key]) {
			val = this._tmp[key];

			return this._update(key, val);
		} else {
			return null;
		}
	}

	set(key, value) {
		if (this._cache[key]) {
			// key is already in cache; change it
			this._cache[key] = value;

			return this._cache[key];
		} else {
			// key isn't in cache yet
			this._update(key, value);
		}
	}

	has(key) {
		return !!this.get(key);
	}

	_update(key, value) {
		this._cache[key] = value;
		this._length++;

		if (this._length > this.limit) {
			this._tmp = this._cache;
			this._cache = Object.create(null);
			this._length = 0;
		}

		return value;
	}
}
