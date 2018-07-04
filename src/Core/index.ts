import * as ifc from 'ifc';

import getPayload from './get-payload';
import run from './run';
import cruise from './cruise';
import afterScrape from './after-scrape';
import scrapeNext, { ScrapeInfo } from './scrape';
import meld, { HITCounts } from './meld/index';
import getHash from './get-hash';
import fetch, { FetchRequest } from './fetch';
import crossRef from './cross-ref';
import notify from './notify';
import getTO from './get-to';
import Interface from '../Interface';
import Settings from '../Settings';

export class Core {
	active: boolean;
	timer: number;
	reviewsError: boolean;
	reviewsLoading: boolean;
	canRetryTO: boolean;
	_cruising: boolean;
	cooldown: number;
	lastScrape: number;

	getPayload: (page?: number) => ifc.MTSearchPayload;
	run: (this: Core, skipToggle?: boolean) => void;
	cruise: (this: Core, firstTick: boolean, tryAgain?: boolean) => void;
	afterScrape: (this: Core, info: ScrapeInfo) => void;
	scrape: (this: Core, src: ifc.MTSearchResponse) => void;
	meld: (this: Core) => void;
	getHash: (str: string) => void; // TODO safe to remove? (can't find anything using it)
	fetch: (this: Core, opts: FetchRequest) => Promise<any>;
	crossRef: (...needles: string[]) => [boolean, boolean];
	notify: (counts: HITCounts, loading: boolean) => void; // TODO
	getTO: (this: Core) => void;

	constructor() {
		this.active = false;
		this.timer = null;
		this.cooldown = null;
		this.lastScrape = null;
		this.canRetryTO = true;
		this.reviewsError = false;
		this.reviewsLoading = false;
		this._cruising = false;

		this.getPayload = getPayload.bind(this);
		this.run = run.bind(this);
		this.cruise = cruise.bind(this);
		this.afterScrape = afterScrape.bind(this);
		this.scrape = scrapeNext.bind(this);
		this.meld = meld.bind(this);
		this.getHash = getHash.bind(this);
		this.fetch = fetch.bind(this);
		this.crossRef = crossRef.bind(this);
		this.notify = notify.bind(this);
		this.getTO = getTO.bind(this);
	}

	get cruising() { return this._cruising; }
	set cruising(newValue) {
		this._cruising = newValue;
	}

	finishedSearch() {
		if (this.active) {
			if (this.cooldown === 0) {
				Interface.buttons.main.click();
			} else if (!this.timer && Settings.user.asyncTO) {
				this.cruise(true);
			}
		}
	}

	scrapeError(err?: any) {
		if (err) console.error(err);

		if (this.cruising) {
			Interface.Status.show('scrape-error-disabled-search');
			Interface.buttons.main.click();
		} else {
			Interface.Status.clear();
			Interface.Status.show('scrape-error');
		}
	}
}
export default new Core();
