import Interface from '../Interface/index';
import Settings from '../Settings/index';
import { kb } from '../lib/constants';
import { cleanTemplate } from '../lib/util';
import state from '../lib/state';

export default class Dialogue {
	constructor(caller) {
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

		this.node.querySelector('#confirm').onclick = this.confirm.bind(this);
		this.node.querySelector('#cancel').onclick = this.die.bind(this);
		this.node.addEventListener('keydown', e => {
			if (e.keyCode === kb.ESC)
				this.die();
		}, true);
		this.node.querySelector('#confirm').focus();
	}
	die() {
		Interface.toggleOverflow('off');
		this.node.remove();
	}
	confirm() {
		const blockStr = this.caller.value.toLowerCase().replace(/\s+/g, ' ');

		let blocklist = localStorage.getItem('scraper_ignore_list');
		if (!blocklist) {
			blocklist = blockStr;
		} else if (blocklist.slice(-1) === '^') {
			blocklist += blockStr;
		} else {
			blocklist += '^' + blockStr;
		}

		localStorage.setItem('scraper_ignore_list', blocklist);

		Array.from(document.getElementById('resultsTable').tBodies[0].rows).forEach(v => {
			var c0 = v.cells[0].lastChild.textContent;
			var c1 = v.cells[1].lastChild.textContent.trim();
			var c2 = v.cells[1].querySelector('.ex').dataset.gid;

			if (
				v.classList.contains('blocklisted') ||
				c0 !== this.caller.value && c1 !== this.caller.value && c2 !== this.caller.value
			) return;

			state.scraperHistory.get(c2).blocked = true;

			v.cells[0].firstChild.remove();
			return v.classList.add('blocklisted') || Settings.user.hideBlock && v.classList.add('hidden');
		});
		this.die();
	}
}
