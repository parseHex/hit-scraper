import Settings from 'Settings';
import {
	DOC_TITLE, ico,
} from 'lib/constants';

import css from '../../build/style.css';
import body from './html/index';
import { Interface } from '.';

export default function (this: Interface) {
	var user = this.user = Settings.user,
		fCss =
			`#resultsTable tbody {font-size:${user.fontSize}px;}` +
			`.shine td {border:1px dotted #fff; font-size:${(+user.fontSize) + (+user.shineOffset)}px; font-weight:bold}`,
		head = `<title>${DOC_TITLE}</title>` +
			`<style type="text/css" id="lazyfont">${fCss}</style>` +
			`<style type="text/css">${css}</style>` +
			`<link rel="icon" type="image/png" href="${ico}" /><link rel="stylesheet" type="text/css" />`;

	document.head.innerHTML = head;
	document.body.innerHTML = body.call(this);
	return this;
}
