import Settings from 'Settings';
import {
	DOC_TITLE, res,
} from 'lib/constants';

import body from './html/index';
import { Interface } from '.';
import { cleanTemplate } from 'lib/util';

export default function (this: Interface) {
	this.user = Settings.user; // TODO this shouldn't be necessary
	document.head.innerHTML = cleanTemplate(`
		<title>${DOC_TITLE}</title>
	`);

	loadCSS();

	document.body.innerHTML = body.call(this);

	// will grab and apply css async
}

function loadCSS() {
	const fCss = cleanTemplate(`
		#resultsTable tbody {
			font-size: ${Settings.user.fontSize}px;
		}
		.shine td {
			border: 1px dotted #fff;
			font-size: ${(+Settings.user.fontSize) + (+Settings.user.shineOffset)}px;
			font-weight: bold;
		}
	`);
	const fontStyle = document.createElement('style');
	fontStyle.type = 'text/css';
	fontStyle.id = 'lazyfont';
	fontStyle.textContent = fCss;

	const icoLink = document.createElement('link');
	icoLink.rel = 'icon';
	icoLink.type = 'image/png';
	icoLink.href = res.icon;

	const mainStyle = document.createElement('link');
	mainStyle.type = 'text/css';
	mainStyle.rel = 'stylesheet';
	mainStyle.href = res.css;

	document.head.appendChild(fontStyle);
	document.head.appendChild(icoLink);
	document.head.appendChild(mainStyle);
}
