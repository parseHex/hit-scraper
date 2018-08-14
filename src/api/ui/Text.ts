export class Text {
	public element: HTMLSpanElement;
	public style: CSSStyleDeclaration;

	constructor() {
		this.element = document.createElement('span');
		this.style = this.element.style;
	}

	public get text() {
		return this.element.textContent;
	}
	public set text(newValue: string) {
		this.element.textContent = newValue;
	}
}
