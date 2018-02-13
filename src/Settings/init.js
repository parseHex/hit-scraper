import Themes from '../Themes/index';
import FileHandler from '../FileHandler/index';
import Editor from '../Editor/index';

export default function () {
	var get = (q, all) => this.main['querySelector' + (all ? 'All' : '')](q),
		sidebarFn = function (e) {
			if (e.target.classList.contains('settingsSelected')) return;
			get('#' + get('.settingsSelected').textContent).style.display = 'none';
			get('.settingsSelected').classList.toggle('settingsSelected');
			e.target.classList.toggle('settingsSelected');
			get('#' + e.target.textContent).style.display = 'block';
		}.bind(this),
		sliderFn = function (e) {
			e.target.nextElementSibling.textContent = Math.floor(e.target.value * 100) + '%';
		},
		optChangeFn = function (e) {
			var tag = e.target.tagName, type = e.target.type, id = e.target.id,
				isChecked = e.target.checked, name = e.target.name, value = e.target.value;

			switch (tag) {
				case 'SELECT':
					//get('#thedit').textContent = value === 'random' ? 'Re-roll!' : 'Edit Current Theme';
					this.user.themes.name = value;
					Themes.apply(value, this.user.hitColor);
					break;
				case 'INPUT':
					switch (type) {
						case 'radio':
							if (name === 'checkbox') {
								this.user.showCheckboxes = (value === 'true');
								Array.from(document.querySelectorAll('#controlpanel input[type=checkbox],#controlpanel input[type=radio]'))
									.forEach(v => v.classList.toggle('hidden'));
							}
							else this.user[name] = value;
							if (name === 'hitColor') Themes.apply(this.user.themes.name, value);
							break;
						case 'checkbox':
							this.user[id] = isChecked;
							if (name === 'export') {
								Array.from(document.querySelectorAll(`button.${value}`))
									.forEach(v => v.style.display = isChecked ? 'inline' : 'none');
							}
							if (id === 'notifyTaskbar' && isChecked && Notification.permission === 'default') {
								Notification.requestPermission();
							}
							break;
						case 'number':
							if (name === 'fontSize')
								document.head.querySelector('#lazyfont').sheet.cssRules[0].style.fontSize = value + 'px';
							else if (name === 'shineOffset')
								document.head.querySelector('#lazyfont').sheet.cssRules[1].style.fontSize = +this.user.fontSize + (+value) + 'px';
							if (name === 'TOW') this.user.toWeights[id] = value;
							else this.user[name] = value;
							break;
						case 'range':
							this.user.volume[name] = value;
							let audio = document.querySelector(`#${name}`);
							audio.volume = value;
							audio.play();
							break;
					}
					break;
			}
			this.save();
		}.bind(this);

	get('#settingsClose').onclick = this.die.bind(this);
	get('#General').style.display = 'block';
	Array.from(get('#settingsSidebar span', true)).forEach(v => v.onclick = sidebarFn);
	Array.from(get('input:not([type=file]),select', true)).forEach(v => v.onchange = optChangeFn);
	Array.from(get('input[type=range]', true)).forEach(v => v.oninput = sliderFn);
	get('#thedit').onclick = () => {
		this.die.call(this);
		new Editor('theme');
	};
	get('#sexport').onclick = FileHandler.exports;
	get('#simport').onclick = () => {
		get('#fsimport').value = '';
		get('#eisStatus').innerHTML = '';
		get('#fsimport').click();
	};
	get('#fsimport').onchange = FileHandler.imports;
}
