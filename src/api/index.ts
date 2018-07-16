import * as ifc from 'ifc';
import Settings from 'Settings';

import { setSetting, settingsList } from './set';
import { start, stop } from './start-stop';
import { listenForHITs, HITs } from './listen';
import Core from 'Core';

function getSetting(key: keyof ifc.SettingsConfig) {
	return Settings.user[key];
}

const api: any = {
	getSetting, setSetting,
	settingsList: Object.freeze(settingsList),
	HITs, listenForHITs,
	start, stop,
	version: '1.0.1',
};
Object.defineProperty(api, 'autosave', {
	get: () => Settings.autosave,
	set: (v: boolean) => Settings.autosave = v,
});
Object.defineProperty(api, 'searching', { get: () => Core.active });
Object.defineProperty(api, 'cruising', { get: () => Core.cruising });
Object.defineProperty(api, 'running', { get: () => Core.active || Core.cruising });

// @ts-ignore
unsafeWindow.HS_API = Object.freeze(api);
