import Settings from 'Settings';
import { cleanTemplate } from 'lib/util';

import controlpanel from './controlpanel';
import table from './table';
import status from './status';
import { res } from 'lib/constants';

export default function () {
	// TODO update URLs
	return cleanTemplate(`
		<audio id="ding" preload="auto">
			<source src="${res.ding}" type="audio/ogg">
		</audio>
		<audio id="squee" preload="auto">
			<source src="${res.squee}" type="audio/mp3">
		</audio>
		<div id="curtain"></div>
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
		<div id="plugins"></div>
		${status}
		${table.call(this)}
	`);
}
