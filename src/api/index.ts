import * as ifc from 'ifc';

import * as search from './search';
import * as settings from './settings';
import * as ui from './ui';

const api: ifc.HIT_Scraper_API = {
	search,
	settings,
	ui,
	version: '1.1.1',
};

// @ts-ignore
unsafeWindow.HS_API = Object.freeze(api);
