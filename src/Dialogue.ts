import Interface from 'Interface';
import Settings from 'Settings';
import { kb, IGNORE_KEY } from 'lib/constants';
import { cleanTemplate } from 'lib/util';
import state from 'lib/state';

export default class Dialogue {
	caller: HTMLInputElement;
	node: HTMLElement;

	constructor(caller: HTMLInputElement) {
		this.caller = caller;

		Interface.toggleOverflow('on');

		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.style.cssText = cleanTemplate(`
			position: fixed;
			z-index: 20;
			top: 15%;
			left: 50%;
			width: 320px;
			padding: 20px;
			transform: translate(-50%);
			background: #000;
			color: #fff;
			box-shadow: 0px 0px 6px 1px #fff;
		`);

		let blockType;
		if (this.caller.textContent === 'R') blockType = 'requester';
		else if (this.caller.textContent === 'T') blockType = 'title';
		else if (this.caller.textContent === 'ID') blockType = 'Group ID';

		this.node.innerHTML = cleanTemplate(`
			<p>
				<b>Add this ${blockType} to the blocklist?</b>
			</p>
			<p>
				"${this.caller.value}"
			</p>
      <div style="text-align:right;margin-right:30px;margin-top:10px;padding-top:10px">
				<button id="confirm" style="font-weight:bold;padding:7px;width:65px">
					OK
				</button>
				<button id="cancel" style="padding:7px;width:65px;">
					Cancel
				</button>
			</div>
		`);

		const confirmBtn = <HTMLButtonElement>this.node.querySelector('#confirm');
		const cancelBtn = <HTMLButtonElement>this.node.querySelector('#cancel');

		confirmBtn.onclick = this.confirm.bind(this);
		cancelBtn.onclick = this.die.bind(this);
		this.node.addEventListener('keydown', e => {
			if (e.keyCode === kb.ESC)
				this.die();
		}, true);
		confirmBtn.focus();
	}
	die() {
		Interface.toggleOverflow('off');
		this.node.remove();
	}
	confirm() {
		const { value } = this.caller;
		const blockStr = value.toLowerCase().replace(/\s+/g, ' ');

		let blocklist = localStorage.getItem(IGNORE_KEY);
		if (!blocklist) {
			blocklist = blockStr;
		} else if (blocklist.slice(-1) === '^') {
			blocklist += blockStr;
		} else {
			blocklist += '^' + blockStr;
		}

		localStorage.setItem(IGNORE_KEY, blocklist);

		Array.from(document.querySelectorAll('#resultsTable tbody tr')).forEach((v: HTMLTableRowElement) => {
			const gid = (<HTMLElement>v.querySelector('.ex')).dataset.gid;
			const rName = state.scraperHistory.get(gid).requester.name;
			const title = state.scraperHistory.get(gid).title;

			if (
				v.classList.contains('blocklisted') ||
				!eq(rName, value) && !eq(title, value) && !eq(gid, value)
			) return;

			state.scraperHistory.get(gid).blocked = true;

			v.cells[0].firstElementChild.remove();
			return v.classList.add('blocklisted') || Settings.user.hideBlock && v.classList.add('hidden');
		});
		this.die();
	}
}
function eq(str1: string, str2: string) {
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();
	return str1 === str2;
}
