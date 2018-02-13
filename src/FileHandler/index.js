import Settings from '../Settings/index';
import initialize from '../index';

export default class FileHandler {
	static exports() {
		var obj = {
			settings: JSON.stringify(Settings.user),
			ignore_list: localStorage.getItem('scraper_ignore_list') || '',
			include_list: localStorage.getItem('scraper_include_list') || ''
		},
			blob = new Blob([JSON.stringify(obj)], { type: 'application/json' }),
			a = document.body.appendChild(document.createElement('a'));
		a.href = URL.createObjectURL(blob);
		a.download = 'hitscraper_settings.json';
		a.click();
		a.remove();
	}
	static imports(e) {
		var f = e.target.files,
			invalid = () => Settings.main.querySelector('#eisStatus').textContent = 'Invalid file.';
		if (!f.length) return;
		if (!f[0].name.includes('json')) return invalid();
		var reader = new FileReader();
		reader.readAsText(f[0]);
		reader.onload = function () {
			var obj;
			try { obj = JSON.parse(this.result); } catch (err) { return invalid(); }
			for (var key of ['settings', 'ignore_list', 'include_list']) {
				if (key in obj && typeof obj[key] === 'string')
					localStorage.setItem('scraper_' + key, obj[key]);
			}
			initialize();
		};
	}
}
