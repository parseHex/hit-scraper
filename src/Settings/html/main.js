import { cleanTemplate } from '../../lib/util';

import general from './general/index';
import appearance from './appearance/index';
import pandaCrazy from './panda-crazy/index';
import to from './to/index';
import blocks from './blocks/index';
import notify from './notify/index';
import utils from './utils/index';
import advanced from './advanced/index';

export default function () {
	return cleanTemplate(`
		<div style="top:0;left:0;margin:0;text-align:right;padding:0px;border:none;width:100%">
			<label id="settingsClose" class="close" title="Close">
				&#160;&#10008;&#160;
			</label>
		</div>
		<div id="settingsSidebar">
			<span data-target="general" class="settingsSelected">
				General
			</span>
			<span data-target="to">Turkopticon</span>
			<span data-target="pc">Panda Crazy</span>
			<span data-target="appearance">Appearance</span>
			<span data-target="blocklist">Blocklist</span>
			<span data-target="notify">Notifications</span>
			<span data-target="utils">Utilities</span>
			<span data-target="advanced">Advanced</span>
		</div>
		<div id="panelContainer" style="margin-left:10px;border:none;overflow:auto;width:auto;height:92%">
			<div id="settings-general" class="settingsPanel">
				${general.apply(this)}
			</div>
			<div id="settings-to" class="settingsPanel">
				${to.apply(this)}
			</div>
			<div id="settings-pc" class="settingsPanel">
				${pandaCrazy.apply(this)}
			</div>
			<div id="settings-appearance" class="settingsPanel">
				${appearance.apply(this)}
			</div>
			<div id="settings-blocklist" class="settingsPanel">
				${blocks.apply(this)}
			</div>
			<div id="settings-notify" class="settingsPanel">
				${notify.apply(this)}
			</div>
			<div id="settings-utils" class="settingsPanel">
				${utils.apply(this)}
			</div>
			<div id="settings-advanced" class="settingsPanel">
				${advanced.apply(this)}
			</div>
		</div>
	`);
}
