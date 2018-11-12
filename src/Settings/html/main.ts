import { cleanTemplate } from 'lib/util';

import general from './general';
import appearance from './appearance';
import pandaCrazy from './panda-crazy';
import to from './to';
import blocks from './blocks';
import notify from './notify';
import utils from './utils';
import { SettingsConfig } from 'ifc';

export default function (user: SettingsConfig) {
	const self = { user };

	return cleanTemplate(`
		<div id="settings-close-btn-container">
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
		</div>
		<div id="panelContainer">
			<div id="settings-general" class="settingsPanel">
				${general.call(self)}
			</div>
			<div id="settings-to" class="settingsPanel">
				${to.call(self)}
			</div>
			<div id="settings-pc" class="settingsPanel">
				${pandaCrazy.call(self)}
			</div>
			<div id="settings-appearance" class="settingsPanel">
				${appearance.call(self)}
			</div>
			<div id="settings-blocklist" class="settingsPanel">
				${blocks.call(self)}
			</div>
			<div id="settings-notify" class="settingsPanel">
				${notify.call(self)}
			</div>
			<div id="settings-utils" class="settingsPanel">
				${utils.call(self)}
			</div>
		</div>
	`);
}
