import { cleanTemplate } from '../../lib/util';

import general from './general/index';
import appearance from './appearance';
import to from './to/index';
import blocks from './blocks';
import notify from './notify';
import utils from './utils';

export default function () {
	return cleanTemplate(`
		<div style="top:0;left:0;margin:0;text-align:right;padding:0px;border:none;width:100%">
			<label id="settingsClose" class="close" title="Close">
				&#160;&#10008;&#160;
			</label>
		</div>
		<div id="settingsSidebar">
			<span class="settingsSelected">
				General
			</span>
			<span>
				Turkopticon
			</span>
			<span>
				Appearance
			</span>
			<span>
				Blocklist
			</span>
			<span>
				Notifications
			</span>
			<span>
				Utilities
			</span>
		</div>
		<div id="panelContainer" style="margin-left:10px;border:none;overflow:auto;width:auto;height:92%">
			<div id="General" class="settingsPanel">
				${general.apply(this)}
			</div>
			<div id="Turkopticon" class="settingsPanel">
				${to.apply(this)}
			</div>
			<div id="Appearance" class="settingsPanel">
				${appearance.apply(this)}
			</div>
			<div id="Blocklist" class="settingsPanel">
				${blocks.apply(this)}
			</div>
			<div id="Notifications" class="settingsPanel">
				${notify.apply(this)}
			</div>
			<div id="Utilities" class="settingsPanel">
				${utils.apply(this)}
			</div>
		</div>
	`);
}
