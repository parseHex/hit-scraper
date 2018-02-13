import { cleanTemplate } from '../../lib/util';

import general from './general';
import appearance from './appearance';
import to from './to';
import blocks from './blocks';
import notify from './notify';
import utils from './utils';

export default function () {
	const _general = general.apply(this);
	const _to = to.apply(this);
	const _appearance = appearance.apply(this);
	const _blocks = blocks.apply(this);
	const _notify = notify.apply(this);
	const _utils = utils.apply(this);

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
				${_general}
			</div>
			<div id="Turkopticon" class="settingsPanel">
				${_to}
			</div>
			<div id="Appearance" class="settingsPanel">
				${_appearance}
			</div>
			<div id="Blocklist" class="settingsPanel">
				${_blocks}
			</div>
			<div id="Notifications" class="settingsPanel">
				${_notify}
			</div>
			<div id="Utilities" class="settingsPanel">
				${_utils}
			</div>
		</div>
	`);
}

export function secTitle(text) {
	return `<span><b>${text}</b></span>`;
}

export function desc(descriptions) {
	let html = '<div class="column opts-dsc">';

	descriptions.forEach(function (d) {
		let title = '';
		if (d.title) {
			title = `
				<span class="dsc-title">
					${d.title}
				</span>
			`;
		}

		html += cleanTemplate(`
			<section>
				${title}
				${d.content}
			</section>
		`);
	});

	html += '</div>';

	return html;
}