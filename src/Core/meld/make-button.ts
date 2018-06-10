import Settings from '../../Settings/index';
import { cleanTemplate } from '../../lib/util';

export default function makeButton(settingName: string, shortName: string, longName: string, data = {}, label = shortName) {
	const settingHidden = Settings.user['export' + settingName] ? '' : 'hidden';

	const className = `ex ${shortName.toLowerCase()} ${settingHidden}`;

	data.exporter = shortName.toLowerCase();

	let dataAttr = '';
	Object.keys(data).forEach((key) => {
		const val = data[key];

		dataAttr += `data-${key}="${val}" `;
	});

	return cleanTemplate(`
		<button class="${className}" title="Export HIT to ${longName}" ${dataAttr}>
			${label}
		</button>
	`);
}
