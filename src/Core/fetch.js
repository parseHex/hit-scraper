import { ENV } from '../lib/constants';
import Settings from '../Settings/index';
import Interface from '../Interface/index';

export default function (url, payload, responseType, inline = true) {
	const enc = window.encodeURIComponent;
	responseType = responseType || 'document';

	if (payload) {
		const key = ENV.HOST === ENV.NEXT ? 'next' : 'legacy';
		payload = payload[key];
		url += '?' + Object.entries(payload).map(stringify).join('&');
	}

	const isTO = url.split('?')[0].includes('turkopticon');

	function stringify(v) {
		const predicate = typeof v[1] !== 'string' && !(v[1] instanceof Array) ? Object.entries(v[1]) : '';
		if (predicate.length)
			return predicate.map(vp => (vp[0] = enc(`${v[0]}[${vp[0]}]`)) && vp) // 0 = o[i] => o%5Bi%5D
				.map(stringify)
				.join('&');
		return `${v[0]}=${enc(v[1])}`;
	}

	const _p = new Promise(function (resolve, reject) {
		let timeout = 3 * 1000;
		if (isTO) {
			timeout = Settings.user.toTimeout * 1000;

			// good for debugging (errors immediately, set to https otherwise):
			// url = 'http://httpstat.us/200?sleep=50000';
		}

		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = responseType;
		xhr.timeout = timeout;
		xhr.send();
		xhr.onload = function () {
			if (this.status === 200) {
				resolve(this.response);
			} else {
				reject(new Error(this.status + ' - ' + this.statusText));
			}
		};
		xhr.onerror = function () {
			reject(new Error(this.status + ' - ' + this.statusText));
			console.log('error: ', this);
		};
		xhr.ontimeout = function () {
			reject(new Error('Request timed out - ' + url));
			console.log('timeout: ', this);
		};
	});

	if (inline) {
		const type = isTO ? 'external' : 'internal';

		_p.then(this.dispatch.bind(this, type), err => {
			console.warn(err);

			Interface.Status.hide('retrieving-to');
			Interface.Status.show('to-error');

			this.meld.apply(this, [{ error: true }]);
		});
	} else {
		return _p;
	}
}
