import { HIT_Scraper_API } from '../src/ifc/api';

export type EventListener = (event: MouseEvent) => void;

export interface Text {
	element: HTMLSpanElement;
	style: CSSStyleDeclaration;
	text: string;
}

export interface Button {
	element: HTMLButtonElement;
	style: CSSStyleDeclaration;
	text: string;
	disable: () => void;
	enable: () => void;
	onClick: (handler: EventListener) => void;
}

export interface Section {
	type: 'block' | 'inline';
	title: string;
	addButton: () => Button;
	addText: () => Text;
}

export interface HS_API extends HIT_Scraper_API {
	ui: {
		createSection: (type: 'block' | 'inline') => Section;
	};
}
