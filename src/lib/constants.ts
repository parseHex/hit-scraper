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

export const DOC_TITLE = 'HIT Scraper';

export * from './constants-defaults';

export const kb = { ESC: 27, ENTER: 13 };

const local = location.hostname === 'localhost';
const prefix = local ? 'http://localhost:8080' : 'https://parsehex.github.io/hit-scraper';

export const res = {
	css: prefix + '/assets/style.css',
	icon: prefix + '/assets/icon.png',
	ding: prefix + '/assets/ding.ogg',
	squee: prefix + '/assets/squee.mp3',
};
