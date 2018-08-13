import { SettingsConfig } from 'ifc';
import Settings from 'Settings';

export default function (key: keyof SettingsConfig) {
	return Settings.user[key];
}
