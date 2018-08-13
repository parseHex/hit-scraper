export class Button {
	public element: HTMLButtonElement;

	constructor() {
		this.element = document.createElement('button');
		this.element.type = 'button';
	}

	public get text() {
		return this.element.textContent;
	}
	public set text(newValue: string) {
		this.element.textContent = newValue;
	}

	public disable() {
		this.element.disabled = true;
	}
	public enable() {
		this.element.disabled = false;
	}

	public onClick(callback: (event: MouseEvent) => void) {
		this.element.addEventListener('click', callback);
	}
}
