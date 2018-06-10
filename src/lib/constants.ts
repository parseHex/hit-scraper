export const ENV = Object.freeze({
	LEGACY: 'www.mturk.com',
	NEXT: 'worker.mturk.com',
	HOST: window.location.hostname,
	ORIGIN: window.location.origin,
	ISFF: Boolean((<any>window).sidebar), // sidebar is a firefox variable
	VERSION: '4.2.1',
});
export const INCLUDE_KEY = 'new_scraper_include_list';
export const IGNORE_KEY = 'new_scraper_ignore_list';
export const SETTINGS_KEY = 'new_scraper_settings';

export const URL_SELF = 'https://greasyfork.org/en/scripts/10615-hit-scraper-with-export#ugTop';
export const DOC_TITLE = 'HIT Scraper';
export const TO_BASE = 'https://turkopticon.ucsd.edu/';
export const TO_REPORTS = TO_BASE + 'reports?id=';
export const TO_API = TO_BASE + 'api/multi-attrs.php?ids=';

export { ico, audio0, audio1 } from './constants-data';
export { defaults } from './constants-defaults';

export const kb = { ESC: 27, ENTER: 13 };
