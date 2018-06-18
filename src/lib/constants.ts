export const ENV = Object.freeze({
	LEGACY: 'www.mturk.com',
	NEXT: 'worker.mturk.com',
	HOST: window.location.hostname,
	ORIGIN: window.location.origin,
	ISFF: Boolean((<any>window).sidebar), // sidebar is a firefox variable
	VERSION: '5.2.0',
});
export const INCLUDE_KEY = 'new_scraper_include_list';
export const IGNORE_KEY = 'new_scraper_ignore_list';
export const SETTINGS_KEY = 'new_scraper_settings';

export const URL_SELF = 'https://greasyfork.org/en/scripts/10615-hit-scraper-with-export#ugTop';
export const DOC_TITLE = 'HIT Scraper';

export * from './constants-data';
export * from './constants-defaults';

export const kb = { ESC: 27, ENTER: 13 };
