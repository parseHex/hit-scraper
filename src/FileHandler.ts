import Settings from './Settings/index';
import initialize from './index';
import { IGNORE_KEY, INCLUDE_KEY } from './lib/constants';

export default class FileHandler {
	static exports() {
		var obj = {
			settings: JSON.stringify(Settings.user),
			ignore_list: localStorage.getItem(IGNORE_KEY) || '',
			include_list: localStorage.getItem(INCLUDE_KEY) || ''
		};
		var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
		var a = document.body.appendChild(document.createElement('a'));
		a.href = URL.createObjectURL(blob);
		a.download = 'hitscraper_settings.json';
		a.click();
		a.remove();
	}
	static imports(e: Event) {
		const target = <HTMLInputElement>e.target;
		var f = target.files;
		var invalid = () => Settings.mainEl.querySelector('#eisStatus').textContent = 'Invalid file.';
		if (!f.length) return;
		if (!f[0].name.includes('json')) return invalid();
		var reader = new FileReader();
		reader.readAsText(f[0]);
		reader.onload = function () {
			var obj;
			try { obj = JSON.parse(this.result); } catch (err) { return invalid(); }
			for (var key of ['settings', 'ignore_list', 'include_list']) {
				if (key in obj && typeof obj[key] === 'string')
					localStorage.setItem(IGNORE_KEY.replace('ignore_list', key), obj[key]);
			}
			initialize();
		};
	}
}
