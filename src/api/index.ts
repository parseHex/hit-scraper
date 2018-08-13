import * as ifc from 'ifc';

import * as search from './search';
import * as settings from './settings';

const api: ifc.HIT_Scraper_API = {
	search,
	settings,
	version: '1.1.0',
};
// Object.defineProperty(api, 'searching', { get: () => Core.active });
// Object.defineProperty(api, 'cruising', { get: () => Core.cruising });
// Object.defineProperty(api, 'running', { get: () => Core.active || Core.cruising });

// @ts-ignore
unsafeWindow.HS_API = Object.freeze(api);
