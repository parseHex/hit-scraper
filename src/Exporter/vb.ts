import Settings from 'Settings';
import { Editor } from 'Editor';
import { TO_BASE } from 'lib/constants';

import { Exporter } from './index';

/*
	this seems to be more of a mess than most of the other code, and i don't use this,
	so i'm mostly just going to get typescript to be quiet about this file
*/

export default function (this: Exporter) {
	var getColor = (attr: number) => {
		switch (attr) {
			case 5:
			case 4:
				return 'green';
			case 3:
				return 'yellow';
			case 2:
				return 'orange';
			case 1:
				return 'red';
			default:
				return 'white';
		}
	};
	var templateVars: any = {
		title: this.record.title,
		requesterName: this.record.requester.name,
		requesterLink: this.record.requester.link,
		requesterId: this.record.requester.id,
		description: this.record.desc,
		reward: this.record.pay,
		quals: this.record.quals.join(';').replace(/(;?)(\w* ?Masters.+?)(;?)/g, '$1[COLOR=red][b]$2[/b][/COLOR]$3'),
		previewLink: this.record.hit.preview,
		pandaLink: this.record.hit.panda,
		time: this.record.time,
		numHits: this.record.numHits,
		toImg: '', // deprecated
		toText: null,
		toCompact: (function () {
			var _to = this.record.TO, txt = ['[b]'], color;
			if (!_to) return 'TO Unavailable';
			for (var a of ['comm', 'pay', 'fair', 'fast']) {
				color = getColor(Math.floor(_to.attrs[a]));
				txt.push(`[ ${a}: [COLOR=${color}]${_to.attrs[a]}[/COLOR] ]`);
			}
			return txt.join('') + '[/b]';
		}).call(this),// toCompact
		toVerbose: (function () {
			var _to = this.record.TO, txt = [], color, _attr, sym = Settings.user.vbSym,
				_long: any = { comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness' };
			if (!_to) return 'TO Unavailable';
			for (var a of ['comm', 'pay', 'fair', 'fast']) {
				_attr = Math.floor(_to.attrs[a]);
				color = getColor(_attr);
				txt.push((_attr > 0 ? (`[COLOR=${color}]${sym.repeat(_attr)}[/COLOR]` + (_attr < 5
					? `[COLOR=white]${sym.repeat(5 - _attr)}[/COLOR]`
					: ''))
					: '[COLOR=white]' + sym.repeat(5) + '[/COLOR]') + ` ${_to.attrs[a]} ${_long[a]}`);
			}
			return txt.join('\n');
		}).call(this),// toText
		toFoot: (function () {
			var _to = this.record.TO,
				payload = `requester[amzn_id]=${this.record.requester.id}&requester[amzn_name]=${this.record.requester.name}`,
				newReview = `[URL="${TO_BASE + 'report?' + payload}"]Submit a new TO review[/URL]`;
			if (!_to) return newReview;
			return `Number of Reviews: ${_to.reviews} | TOS Flags: ${_to.tos_flags}\n` + newReview;
		}).call(this)// toFoot
	};
	var createTemplate = function (str: string) {
		// TODO: find a concise way to dynamically generate a template without using eval
		var _str = str.replace(/\$\{ *([-\w\d.]+) *\}/g, (_, p1) => `\$\{vars.${p1}\}`);
		return new Function('vars', `try {return \`${_str}\`} catch(e) {return "Error in template: "+e.message}`);
	};
	templateVars.toText = templateVars.toVerbose; // temporary backwards compatibility
	this.node.innerHTML = '<p>vB Export</p>' +
		'<textarea style="display:block;padding:2px;margin:auto;height:250px;width:500px" tabindex="1">' +
		createTemplate(Settings.user.vbTemplate)(templateVars) + '</textarea>' +
		'<button id="exTemplate" style="margin-top:5px;width:50%;color:white;background:black">Edit Template</button>' +
		'<button id="exClose" style="margin-top:5px;width:50%;color:white;background:black">Close</button>';
	(<HTMLElement>this.node.querySelector('#exTemplate')).onclick = () => {
		this.die();
		new Editor('vbTemplate', this.target);
	};
	(<HTMLElement>this.node.querySelector('#exClose')).onclick = this.die.bind(this);
	this.node.querySelector('textarea').select();
}
