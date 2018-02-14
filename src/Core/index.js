import getPayload from './get-payload';
import run from './run';
import cruise from './cruise';
import dispatch from './dispatch';
import scrapeNext from './scrape-next';
import scrape from './scrape';
import meld from './meld/index';
import getHash from './get-hash';
import fetch from './fetch';
import crossRef from './cross-ref';
import notify from './notify';
import getTO from './get-to';

class Core {
	constructor() {
		this.active = false;
		this.timer = null;
		this.cooldown = null;
		this.lastScrape = null;
		this.canRetryTO = true;

		this.getPayload = getPayload.bind(this);
		this.run = run.bind(this);
		this.cruise = cruise.bind(this);
		this.dispatch = dispatch.bind(this);
		this.scrapeNext = scrapeNext.bind(this);
		this.scrape = scrape.bind(this);
		this.meld = meld.bind(this);
		this.getHash = getHash.bind(this);
		this.fetch = fetch.bind(this);
		this.crossRef = crossRef.bind(this);
		this.notify = notify.bind(this);
		this.getTO = getTO.bind(this);
	}
}
export default new Core();
