import { Button } from "./Button";

export type SectionType = 'block' | 'inline';

export class Section {
	type: SectionType;

	private divEl: HTMLDivElement;
	private titleEl: HTMLSpanElement;

	constructor(type = <SectionType>'inline') {
		this.type = type;

		this.make();

		const pluginsDiv = document.getElementById('plugins');
		pluginsDiv.appendChild(this.divEl);
	}

	private make() {
		this.divEl = document.createElement('div');
		this.divEl.style.display = this.type;

		this.titleEl = document.createElement('span');
		this.titleEl.style.marginRight = '3px';
		this.titleEl.title = 'HIT Scraper Plugin';
		this.divEl.appendChild(this.titleEl);
	}

	public updateTitle(newTitle: string) {
		this.titleEl.textContent = newTitle + ':';
	}

	public addButton() {
		const btn = new Button();
		this.divEl.appendChild(btn.element);
		return btn;
	}
}
