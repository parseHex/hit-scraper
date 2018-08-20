import * as ifc from 'ifc';
import Settings from 'Settings';

import { ENV } from './constants';
import { cleanTemplate } from './util';

interface Options {
	data?: ifc.HITData | ifc.ReviewData;
	loading?: boolean;
	error?: boolean;
}

function isReviewData(data: ifc.HITData | ifc.ReviewData): data is ifc.ReviewData {
	return data.hasOwnProperty('tos_flags') && data.hasOwnProperty('reviews');
}

export default function createTooltip(opts: Options) {
	let html;
	let reason;
	if (opts.data) {
		// data is present so skip these ifs
	} else if (Settings.user.disableTO) {
		reason = bullet('TO disabled in user settings');
	} else if (opts.loading) {
		reason = bullet('Loading reviews...');
	} else if (opts.error) {
		reason = bullet('Invalid response from server');
	} else {
		reason = bullet('Requester has not been reviewed yet');
	}

	if (reason) {
		html = cleanTemplate(`
			<div class="tooltip" style="width:260px;">
				<p style="padding-left:5px">
					Turkopticon data unavailable:
					${reason}
				</p>
			</div>
		`);
	} else if (isReviewData(opts.data)) {
		html = cleanTemplate(`
			<div class="tooltip" style="width:260px">
				<p style="padding-left:5px">
					<b>${opts.data.name}</b>
					<br />
					Reviews: ${opts.data.reviews} | TOS Flags: ${opts.data.tos_flags}
				</p>
				${genMeters(opts.data.attrs)}
			</div>
		`);
	} else {
		html = cleanTemplate(`
			<div class="tooltip" style="width:300px">
				<dl>
					<dt>description</dt>
					<dd>${opts.data.desc}</dd>
					<dt>qualifications</dt>
					<dd>${opts.data.quals.join(';')}</dd>
				</dl>
			</div>
		`);
	}

	return html;
}
function bullet(li: string) {
	return `<ul><li>${li}</li></ul>`;
}

const attrmap: { [index: string]: string } = {
	comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness',
};
const attrKeys = Object.keys(attrmap);
function genMeters(attrs: ifc.TOAttributes) {
	const html: string[] = [];
	for (let i = 0; i < attrKeys.length; i++) {
		const key = attrKeys[i];
		const value = attrs[key];
		const name = attrmap[key];
		html.push(`<meter min="0.8" low="2.5" high="3.4" optimum="5" max="5" value=${value} data-attr=${name}></meter>`);
	}
	if (ENV.ISFF) {
		// firefox doesn't support :before/:after on <meter>s
		for (let i = 0; i < html.length; i++) {
			const key = attrKeys[i];
			const value = attrs[key];
			const name = attrmap[key];

			html[i] = cleanTemplate(`
				<div style="position:relative">
					${html[i]}
					<span class="ffmb">${name}</span>
					<span class="ffma">${value}</span>
				</div>
			`);
		}
	}

	return html.join('');
}
