import { HIT_Scraper_API } from '../src/ifc/api';

type MouseEventListener = (event: MouseEvent) => void;

interface Text {
	element: HTMLSpanElement;

	/** Reference to Text.element.style */
	style: CSSStyleDeclaration;

	/** Getter/Setter for `Text.element.textContent` */
	text: string;
}

interface Button {
	element: HTMLButtonElement;
	disable: () => void;
	enable: () => void;
	onClick: (handler: MouseEventListener) => void;

	/** Reference to Button.element.style */
	style: CSSStyleDeclaration;

	/** Getter/Setter for `Button.element.textContent` */
	text: string;
}

interface Section {
	type: 'block' | 'inline';
	title: string;
	addButton: () => Button;
	addText: () => Text;
}

interface Modal {
	element: HTMLDivElement;
	show: () => void;
	hide: () => void;

	/**
	 * Get a callback when the modal is hidden.
	 *
	 * Modal can be hidden by clicking the Modal's X, pressing Escape,
	 * or by calling `Modal.hide`.
	 */
	onHide: (callback: () => void) => void;

	/** Reference to Modal.element.style */
	style: CSSStyleDeclaration;
}

export interface HS_API extends HIT_Scraper_API {
	ui: {
		createSection: (type: 'block' | 'inline') => Section;
		createModal: () => Modal;
	};
}
