import { SectionType, Section } from 'api/ui/Section';

import { SettingsConfig } from './settings-config';
import { HITData } from './data';

type SearchListener = (HITs: HITData[], eventType: 'add' | 'update') => void;

export interface HIT_Scraper_API {
	settings: {
		get: (key: keyof SettingsConfig) => any;
		set: (key: keyof SettingsConfig, newValue: any) => void;
		disableAutosave: () => void;
		enableAutosave: () => void;
		list: ReadonlyArray<string>;
	};
	search: {
		HITs: HITData[];
		listen: (handler: SearchListener) => void;
		start: () => void;
		stop: () => void;
		isCruising: () => boolean;
	};
	ui: {
		createSection: (type: SectionType) => Section;
	};
	version: string;
}
