import Settings from 'Settings';
import { cleanTemplate } from 'lib/util';
import {
	audio0, audio1,
} from 'lib/constants';

import controlpanel from './controlpanel';
import table from './table';
import status from './status';

export default function () {
	const _u0 = new Uint8Array(Array.prototype.map.call(window.atob(audio0), (v: string) => v.charCodeAt(0)));
	const _u1 = new Uint8Array(Array.prototype.map.call(window.atob(audio1), (v: string) => v.charCodeAt(0)));
	const ding = URL.createObjectURL(new Blob([_u0], { type: 'audio/ogg' }));
	const squee = URL.createObjectURL(new Blob([_u1], { type: 'audio/mp3' }));

	return cleanTemplate(`
		<audio id="ding">
			<source src="${ding}">
		</audio>
		<audio id="squee">
			<source src="${squee}">
		</audio>
		<div id="curtain" style="position:fixed;width:100%;height:100%;display:none;z-index:10"></div>
		${controlpanel.call(this)}
		<div id="controlbuttons" class="controlpanel">
			<button id="main">
				Start
			</button>
			<button id="hide">
				${Settings.user.hidePanel ? 'Show Panel' : 'Hide Panel'}
			</button>
			<button id="blocks">
				Edit Blocklist
			</button>
			<button id="incs">
				Edit Includelist
			</button>
			<button id="ignores">
				Toggle Ignored HITs
			</button> &nbsp;
			<button id="settings">
				Settings
			</button>
		</div>
		${status}
		${table.call(this)}
	`);
}
