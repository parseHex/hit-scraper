import { kb } from '../lib/constants';
import Settings from '../Settings/index';
import Themes from '../Themes/index';
import Editor from '../Editor/index';
import Core from '../Core/index';

export default function () {
	this.panel = {};
	this.buttons = {};
	var get = (q, all) => document['querySelector' + (all ? 'All' : '')](q),
		sortdirs = get('#sortdirs'),
		moveSortdirs = function (node) {
			if (!node.checked) {
				sortdirs.style.display = 'none';
				return;
			}
			sortdirs.style.display = 'inline';
			sortdirs.remove();
			node.parentNode.insertBefore(sortdirs, node.nextSibling);
		},
		kdFn = e => { if (e.keyCode === kb.ENTER) setTimeout(() => this.buttons.main.click(), 30); },
		optChangeFn = function (e) {
			var tag = e.target.tagName, type = e.target.type, id = e.target.id,
				isChecked = e.target.checked, name = e.target.name, value = e.target.value;

			switch (tag) {
				case 'SELECT': {
					if (id === 'soundSelect')
						this.user.notifySound[1] = e.target.value;
					else
						this.user[id] = e.target.selectedIndex;
					break;
				}
				case 'INPUT': {
					switch (type) {
						case 'number': {
							this.user[id] = +value;
							break;
						}
						case 'text': {
							this.user[id] = value;
							break;
						}
						case 'radio': {
							Array.from(get(`input[name=${name}]`, true))
								.forEach(v => {
									this.user[v.id] = v.checked;
									get(`label[for=${v.id}]`).classList.toggle('checked');
								});
							break;
						}
						case 'checkbox': {
							if (name === 'sort') {
								Array.from(get(`input[name=${name}]`, true)).forEach(v => {
									if (e.target !== v) v.checked = false;
									get(`label[for=${v.id}]`).className = v.checked ? 'checked' : '';
									this.user[v.id] = v.checked;
								});
								moveSortdirs(e.target);
								break;
							} else if (id === 'sound') {
								this.user.notifySound[0] = isChecked;
								e.target.nextElementSibling.style.display = isChecked ? 'inline' : 'none';
							}
							this.user[id] = isChecked;
							get(`label[for=${id}]`).classList.toggle('checked');
							break;
						}
					}
					break;
				}
			}
			Settings.save();
		}.bind(this);

	'ding squee'.split(' ').forEach(v => get(`#${v}`).volume = this.user.volume[v]);

	Themes.apply(this.user.themes.name);
	if (this.isLoggedout) get('#loggedout').textContent = 'you are currently logged out of mturk';
	// get references to control panel elements and set up click events
	this.Status = {
		node: get('#status'),
		show: function (name) {
			this.node.querySelector(`#status-${name}`).classList.remove('hidden');
		},
		hide: function (name) {
			this.node.querySelector(`#status-${name}`).classList.add('hidden');
		},
		edit: function (name, value) {
			this.node.querySelector(`#status-${name} span`).innerHTML = value;
		},
		clear: function () {
			Array.from(this.node.querySelectorAll('[id^="status-"]')).forEach(function (el) {
				el.classList.add('hidden');
			});
		},
	};
	for (var k of this.elkeys) {
		if (k === 'mainlink') continue;
		this.panel[k] = document.getElementById(k);
		this.panel[k].onchange = optChangeFn;
		if (k === 'pay' || k === 'search') this.panel[k].onkeydown = kdFn;
		if ((k === 'sortPay' || k === 'sortAll') && this.panel[k].checked) moveSortdirs(this.panel[k]);
	}

	// get references to buttons
	Array.from(get('button', true)).forEach(v => this.buttons[v.id.slice(3).toLowerCase()] = v);
	// set up button click events
	this.buttons.main.onclick = function (e) {
		e.target.textContent = e.target.textContent === 'Start' ? 'Stop' : 'Start';
		Core.run();
	};
	this.buttons.retryto.onclick = function (e) {
		if (!Core.canRetryTO) return;
		Core.canRetryTO = false;

		e.target.classList.add('disabled');
		Core.getTO();
		setTimeout(function () {
			Core.canRetryTO = true;
			e.target.classList.remove('disabled');
		}, 3000);
	};
	this.buttons.hide.onclick = function (e) {
		get('#controlpanel').classList.toggle('hiddenpanel');
		e.target.textContent = e.target.textContent === 'Hide Panel' ? 'Show Panel' : 'Hide Panel';

		Settings.user.hidePanel = !Settings.user.hidePanel;
		Settings.save();
	};
	this.buttons.blocks.onclick = () => {
		this.toggleOverflow('on'); // TODO what does this do?
		new Editor('ignore');
	};
	this.buttons.incs.onclick = () => {
		this.toggleOverflow('on');
		new Editor('include');
	};
	this.buttons.ignores.onclick = () => {
		Array.from(get('.ignored:not(.blocklisted)', true)).forEach(v => {
			v.classList.toggle('hidden');
		});
	};
	this.buttons.settings.onclick = () => {
		this.toggleOverflow('on');
		Settings.draw().init();
	};
	get('#disableTO').addEventListener('change', (e) => {
		if (e.target.checked) {
			this.Status.hide('to-error');
		}
	});
	get('#hideBlock').addEventListener('change', () => {
		Array.from(get('.blocklisted', true)).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
	get('#hideNoTO').addEventListener('change', () => {
		Array.from(get('.toNone', true)).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
	document.body.onblur = () => this.focused = false;
	document.body.onfocus = () => {
		this.focused = true;
		this.resetTitle();
	};
}
