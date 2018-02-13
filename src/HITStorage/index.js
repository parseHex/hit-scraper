class HITStorage {
	constructor() {
		this.db = null;
	}
	attach(name) {
		var dbh = window.indexedDB.open(name);
		dbh.onversionchange = e => {
			e.target.result.close();
			console.info('DB connection closed by external source');
		};
		dbh.onsuccess = e => this.db = e.target.result;
	}
	test(node) {
		if (!this.db || !this.db.objectStoreNames.contains('HIT')) return;
		this.db.transaction('HIT', 'readonly').objectStore('HIT').index(node.dataset.index).get(node.dataset.value)
			.onsuccess = e => { if (e.target.result) node.className = node.className.replace(/no/, ''); };
	}
	query(node) {
		var range = window.IDBKeyRange.only(node.dataset.value), results = [];
		return new Promise((a, r) => {
			if (!this.db || !this.db.objectStoreNames.contains('HIT')) r(0);
			this.db.transaction('HIT', 'readonly').objectStore('HIT').index(node.dataset.index).openCursor(range)
				.onsuccess = e => {
					if (e.target.result) {
						results.push(e.target.result.value);
						e.target.result.continue();
					} else
						a(results.sort((a, b) => a.date > b.date ? 1 : -1));
				};
		});
	}
}
export default new HITStorage();
