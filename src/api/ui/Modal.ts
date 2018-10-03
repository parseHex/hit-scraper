import Interface from 'Interface';

export class Modal {
	public element: HTMLDivElement;
	public style: CSSStyleDeclaration;
	public hidden = true;

	private container: HTMLDivElement;
	private hideListeners: (() => void)[] = [];

	get width() {
		return +this.style.width.replace('px', '');
	}
	set width(w) {
		this.style.width = w + 'px';
	}

	constructor() {
		this.container = document.createElement('div');
		this.container.className = 'plugin-modal';

		const closeContainer = document.createElement('div');
		closeContainer.className = 'close-container';

		// it's a label disguised as a button
		const closeBtn = document.createElement('label');
		closeBtn.title = 'Close';
		closeBtn.className = 'close';
		closeBtn.innerHTML = '&#160;&#10008;&#160;';
		closeBtn.addEventListener('click', this.hide.bind(this));
		closeContainer.appendChild(closeBtn);
		this.container.appendChild(closeContainer);

		this.element = document.createElement('div');
		this.element.className = 'plugin-content';
		this.style = this.element.style;
		this.container.appendChild(this.element);

		this.hide();

		const pluginsDiv = document.getElementById('plugins');
		pluginsDiv.appendChild(this.container);

		window.addEventListener('keyup', (e) => {
			if (e.key === 'Escape') {
				this.hide();
			}
		});
		Interface.onCurtainClick(() => {
			if (this.hidden) return;
			this.hide();
		});
	}

	public show() {
		Interface.toggleOverflow('on');
		this.container.style.display = 'block';
		this.hidden = false;
	}
	public hide() {
		Interface.toggleOverflow('off');
		this.container.style.display = 'none';
		this.hidden = true;

		for (let i = 0; i < this.hideListeners.length; i++) {
			if (!this.hideListeners[i]) {
				this.hideListeners.splice(i, 1);
				i--;
			}

			this.hideListeners[i]();
		}
	}
	public onHide(callback: () => void) {
		this.hideListeners.push(callback);
	}
}
