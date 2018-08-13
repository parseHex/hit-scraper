import Settings from 'Settings';
import { IGNORE_KEY, INCLUDE_KEY, SETTINGS_KEY } from 'lib/constants';

import initialize from './index';

interface SettingsObject {
	settings: string; // SettingsConfig
	ignore_list: string;
	include_list: string;
}

export default class FileHandler {
	static exports() {
		const obj: SettingsObject = {
			settings: JSON.stringify(Settings.user),
			ignore_list: localStorage.getItem(IGNORE_KEY) || '',
			include_list: localStorage.getItem(INCLUDE_KEY) || ''
		};

		const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
		const a = document.body.appendChild(document.createElement('a'));
		a.href = URL.createObjectURL(blob);
		a.download = 'hitscraper_settings.json';
		a.click();
		a.remove();
	}
	static imports(e: Event) {
		const target = <HTMLInputElement>e.target;
		const files = target.files;

		if (!files.length) return;
		if (!files[0].name.includes('json')) {
			return invalid();
		}

		const reader = new FileReader();
		reader.readAsText(files[0]);
		reader.addEventListener('load', function () {
			const result = <string>reader.result;
			let obj: Partial<SettingsObject>;
			try {
				obj = JSON.parse(result);
			} catch (err) {
				return invalid();
			}

			if (obj.ignore_list) {
				localStorage.setItem(IGNORE_KEY, obj.ignore_list);
			}
			if (obj.include_list) {
				localStorage.setItem(INCLUDE_KEY, obj.include_list);
			}
			if (obj.settings) {
				localStorage.setItem(SETTINGS_KEY, obj.settings);
			}
			initialize();
		});
	}
}
function invalid() {
	Settings.mainEl.querySelector('#eisStatus').textContent = 'Invalid file.';
}
