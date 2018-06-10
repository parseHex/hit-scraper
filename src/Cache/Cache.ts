export default class Cache<T> {
	limit: number;
	length: number;
	cache: { [index: string]: T };
	tmp: { [index: string]: T };

	constructor(limit = 500) {
		this.limit = limit;
		this.length = 0;
		this.cache = Object.create(null);
		this.tmp = Object.create(null);
	}

	get(key: string) {
		let val = this.cache[key];

		if (val) {
			return val;
		} else if (this.tmp[key]) {
			val = this.tmp[key];

			return this.update(key, val);
		} else {
			return null;
		}
	}

	set(key: string, value: T) {
		if (this.cache[key]) {
			// key is already in cache; change it
			this.cache[key] = value;

			return this.cache[key];
		} else {
			// key isn't in cache yet
			return this.update(key, value);
		}
	}

	has(key: string) {
		return !!this.get(key);
	}

	protected update(key: string, value: T) {
		this.cache[key] = value;
		this.length++;

		if (this.length > this.limit) {
			this.tmp = this.cache;
			this.cache = Object.create(null);
			this.length = 0;
		}

		return value;
	}
}
