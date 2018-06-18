/**
 * NOTE: this is going to be a mess
 */
import * as ifc from 'ifc';
import Settings from 'Settings';

export const settingsList = [
	// booleans
	'asyncTO', 'cacheTO',
	'skips', 'qual', 'monly',
	'mhide', 'hideNoTO', 'onlyViable',
	'disableTO', 'hideBlock', 'onlyIncludes',

	// numbers
	'toTimeout',
	'refresh', 'pages', 'resultsPerPage',
	'batch', 'reward', 'minTOPay',

	// strings
	'search',
];

export function setSetting(key: keyof ifc.SettingsConfig, value: any) {
	// the api is accessible from any script running on the same page as HS
	// so do type checking at runtime
	switch (key) {
		// booleans
		case 'asyncTO':
		case 'cacheTO': {
			if (isBoolean(key, value)) Settings.user[key] = value;
			break;
		}
		// numbers:
		case 'toTimeout': {
			if (isNumber(key, value)) Settings.user[key] = value;
			break;
		}

		// string:
		case 'search': {
			if (isString(key, value)) updateInput(key, value);
			break;
		}
		// numbers:
		case 'refresh':
		case 'pages':
		case 'resultsPerPage':
		case 'batch':
		case 'reward':
		case 'minTOPay': {
			if (isNumber(key, value)) updateInput(key, value);
			break;
		}
		// booleans:
		case 'skips':
		case 'qual':
		case 'monly':
		case 'mhide':
		case 'hideNoTO':
		case 'onlyViable':
		case 'disableTO':
		case 'hideBlock':
		case 'onlyIncludes': {
			if (isBoolean(key, value)) updateInput(key, value);
			break;
		}

		default: {
			throw new Error(`${key} is not a settable setting`);
		}
	}

	// onChange doesn't trigger when values are change programmatically
	// so save manually (Settings handles checking if autosave is off)
	Settings.save();
}

function updateInput(id: string, val: any) {
	Settings.user[id] = val;

	const input = (<HTMLInputElement>document.getElementById(id));
	if (typeof val === 'boolean') {
		input.checked = val;
	} else {
		input.value = val;
	}
}

function isBoolean(key: string, val: any): val is boolean {
	if (typeof val !== 'boolean') {
		throw new Error(`${key} must be a boolean`);
	}
	return true;
}
function isString(key: string, val: any): val is string {
	if (typeof val !== 'string') {
		throw new Error(`${key} must be a string`);
	}
	return true;
}
function isNumber(key: string, val: any): val is number {
	if (typeof val !== 'number') {
		throw new Error(`${key} must be a number`);
	}
	return true;
}
