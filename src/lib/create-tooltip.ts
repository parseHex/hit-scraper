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
		/*<table style="margin-top:6px;width:100%;font-size:10px"><tr><td>Adjusted Pay</td><td>${obj.attrs.adjPay}</td>
		<td>${getClassFromValue(obj.attrs.adjPay, 'adj').slice(2)}</td></tr><tr><td>Weighted Score</td><td>${obj.attrs.qual}</td>
		<td>${getClassFromValue(obj.attrs.qual, 'sim').slice(2)}</td></tr><tr><td>Adjusted Score</td><td>${obj.attrs.adjQual}</td>
		<td>${getClassFromValue(obj.attrs.adjQual, 'adj').slice(2)}</td></tr></table></div>;*/
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
function genMeters(attrs: ifc.TOAttributes) {
	const attrmap: { [index: string]: string } = {
		comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness',
	};
	var html: string[] = [];
	for (var k in attrmap) {
		if (attrmap.hasOwnProperty(k)) {
			html.push(`<meter min="0.8" low="2.5" high="3.4" optimum="5" max="5" value=${attrs[k]} data-attr=${attrmap[k]}></meter>`);
		}
	}
	if (ENV.ISFF) { // firefox is shitty and doesn't support ::after/::before pseudo-elements on meter elements
		html.forEach((v, i, a) => a[i] = '<div style="position:relative">' + v +
			`<span class="ffmb">${attrmap[Object.keys(attrmap)[i]]}</span>` +
			`<span class="ffma">${attrs[Object.keys(attrmap)[i]]}</span></div>`);
	}

	return html.join('');
}
