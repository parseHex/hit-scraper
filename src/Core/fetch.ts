import * as ifc from '../ifc';
import { entries } from '../lib/util';
import { Core } from '.';

export interface FetchRequest {
	url: string;
	responseType?: XMLHttpRequestResponseType;
	payload?: ifc.BasicObject;
	timeout?: number;
}

export default function (this: Core, opts: FetchRequest) {
	opts.responseType = opts.responseType || 'document';

	if (opts.payload) {
		opts.url += '?' + entries(opts.payload).map(stringify).join('&');
	}

	return new Promise(function (resolve, reject) {
		// good for debugging (errors immediately, set to https otherwise):
		// url = 'http://httpstat.us/200?sleep=50000';

		const timeout = opts.timeout !== undefined ? opts.timeout : 3 * 1000;

		const xhr = new XMLHttpRequest();
		xhr.open('GET', opts.url, true);
		xhr.responseType = opts.responseType;
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
			reject(new Error('Request timed out - ' + opts.url));
			console.log('timeout: ', this);
		};
	});
}

const enc = encodeURIComponent;
function stringify(v: [string, any]): string {
	const predicate = typeof v[1] !== 'string' && !(v[1] instanceof Array) ? entries(v[1]) : null;
	if (predicate.length) {
		return predicate.map(vp => (vp[0] = enc(`${v[0]}[${vp[0]}]`)) && vp) // 0 = o[i] => o%5Bi%5D
			.map(stringify)
			.join('&');
	}
	return `${v[0]}=${enc(v[1])}`;
}
