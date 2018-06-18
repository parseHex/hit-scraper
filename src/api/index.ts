import * as ifc from 'ifc';
import Settings from 'Settings';

import { setSetting, settingsList } from './set';
import { start, stop } from './start-stop';
import { listenForHITs, HITs } from './listen';

function getSetting(key: keyof ifc.SettingsConfig) {
	return Settings.user[key];
}

// need hooks for .listen and .hits
// want .listen to fire for a batch at a time instead of one at a time
const api: any = {
	getSetting, setSetting,
	settingsList: Object.freeze(settingsList),
	HITs, listenForHITs,
	start, stop,
	version: '1.0.0',
};
Object.defineProperty(api, 'autosave', {
	get: () => Settings.autosave,
	set: (v: boolean) => Settings.autosave = v,
});

(<any>window).HS_API = Object.freeze(api);
