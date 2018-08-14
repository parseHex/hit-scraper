import { Button } from "./Button";
import { Text } from "./Text";

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
	public get title() {
		// trim off ':' at the end
		return this.titleEl.textContent.substr(0, -1);
	}
	public set title(newTitle: string) {
		this.titleEl.textContent = newTitle + ':';
	}

	public addButton() {
		const btn = new Button();
		this.divEl.appendChild(btn.element);
		return btn;
	}
	public addText() {
		const text = new Text();
		this.divEl.appendChild(text.element);
		return text;
	}
}
