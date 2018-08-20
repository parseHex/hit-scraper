export * from './api';
export * from './data';
export * from './generics';
export * from './http';
export * from './settings-config';

export type StatusMessageID = 'stopped' | 'processing' | 'correcting-skips' |
	'retrieving-to' | 'to-error' | 'scrape-complete' |
	'queue-wait' | 'scraping-again' | 'scrape-error' |
	'scrape-error-disabled-search';

export interface InterfaceButtons {
	main: HTMLButtonElement;
	retryTO: HTMLButtonElement;
	retryQueue: HTMLButtonElement;
	hide: HTMLButtonElement;
	blocks: HTMLButtonElement;
	incs: HTMLButtonElement;
	ignores: HTMLButtonElement;
	settings: HTMLButtonElement;
}
