import Settings from '../Settings/index';
import {
	ENV, DOC_TITLE, ico,
} from '../lib/constants';

import css from './css/index';
import titles from './titles';
import body from './html/index';

export default function () {
	var user = this.user = Settings.user,
		fCss =
			`#resultsTable tbody {font-size:${user.fontSize}px;}` +
			`.shine td {border:1px dotted #fff; font-size:${(+user.fontSize) + (+user.shineOffset)}px; font-weight:bold}`,
		head = `<title>${DOC_TITLE}</title>` +
			`<style type="text/css" id="lazyfont">${fCss}</style>` +
			`<style type="text/css">${css}</style>` +
			`<link rel="icon" type="image/png" href="${ico}" /><link rel="stylesheet" type="text/css" />`;

	document.head.innerHTML = head;
	document.body.innerHTML = body.apply(this);
	this.elkeys = Object.keys(titles);
	return this;
}
