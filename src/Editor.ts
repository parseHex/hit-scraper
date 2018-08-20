import Interface from 'Interface';
import Settings from 'Settings';
import { Exporter } from 'Exporter';
import { cleanTemplate } from 'lib/util';
import { IGNORE_KEY } from 'lib/constants';

function setDefaultBlocks() {
	// TODO seems like this should go under Settings? (make static method for it)
	return localStorage.setItem(IGNORE_KEY,
		'oscar smith^diamond tip research llc^jonathan weber^jerry torres^' +
		'crowdsource^we-pay-you-fast^turk experiment^jon brelig^p9r^scoutit');
}

export const EditorDefault = {
	setDefaultBlocks,
};

export class Editor {
	node: HTMLElement;
	type: string;
	caller: HTMLElement;

	constructor(type: 'include' | 'ignore' | 'vbTemplate', caller?: HTMLElement) {
		Interface.toggleOverflow('on');
		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.classList.add('pop');
		this.type = type;
		this.caller = caller || null;

		switch (type) {
			case 'include':
			case 'ignore': {
				if (type === 'ignore' && !localStorage.getItem(IGNORE_KEY)) setDefaultBlocks();

				const btnStyle = 'margin:5px auto;width:50%;color:white;background:black;';

				const blocklist = cleanTemplate(`
					<b>BLOCKLIST</b> - &nbsp;
					Edit the blocklist with what you want to ignore/hide. &nbsp;
					Separate requester names and HIT titles with the &nbsp;
					<code>^</code> character. &nbsp;
					After clicking "Save", you'll need to scrape again to apply the changes.
					<br />
					<button id="clearIds">
						Clear HIT IDs
					</button>
				`);
				const includelist = cleanTemplate(`
					<b>INCLUDELIST</b> - &nbsp;
					Focus the results on your favorite requesters. &nbsp;
					Separate requester names and HIT titles with the ' +
					'<code>^</code> character. When the "Restrict to includelist" option is selected, ' +
					'HIT Scraper only shows results matching the includelist.'
				`);
				var titleText = type === 'ignore' ? blocklist : includelist;

				this.node.innerHTML = cleanTemplate(`
					<div style="width:500px">
						${titleText}
					</div>
					<textarea style="display:block;height:200px;width:500px;font:12px monospace" placeholder="nothing here yet">
						${localStorage.getItem(IGNORE_KEY.replace('ignore', type)) || ''}
					</textarea>
					<button id="edSave" style="${btnStyle}">
						Save
					</button>
					<button id="edCancel" style="${btnStyle}">
						Cancel
					</button>
				`);
				if (type === 'ignore') {
					this.node.querySelector('#clearIds').addEventListener('click', () => {
						const textarea = this.node.querySelector('textarea');
						textarea.value = textarea.value.replace(/\^\w{30}/g, '');
					});
				}
				this.node.querySelector('#edSave').addEventListener('click', () => {
					localStorage.setItem(IGNORE_KEY.replace('ignore', type), this.node.querySelector('textarea').value.trim());
					this.die();
				});
				break;
			}
			// TODO remove
			case 'vbTemplate': {
				this.node.innerHTML = '<b>VBULLETIN TEMPLATE</b><div style="float:right;margin-bottom:5px">Ratings Symbol: ' +
					`<input style="text-align:center" type="text" size="1" maxlength="1" value="${Settings.user.vbSym}" /></div>` +
					'<textarea style="display:block;height:200px;width:500px;font:12px monospace">' +
					Settings.user.vbTemplate + '</textarea>' +
					'<button id="edSave" style="margin:5px auto;width:33%;color:white;background:black">Save</button>' +
					'<button id="edDefault" style="margin:5px auto;width:33%;color:white;background:black">Restore Default</button>' +
					'<button id="edCancel" style="margin:5px auto;width:33%;color:white;background:black">Cancel</button>';
				this.node.querySelector('#edDefault').addEventListener('click', () => {
					this.node.querySelector('textarea').value = Settings.defaults.vbTemplate;
					(<HTMLButtonElement>this.node.querySelector('#edSave')).click();
				});
				this.node.querySelector('#edSave').addEventListener('click', () => {
					Settings.user.vbTemplate = this.node.querySelector('textarea').value.trim();
					Settings.user.vbSym = this.node.querySelector('input').value;
					Settings.save();
					this.die();
					new Exporter(<any>{ target: this.caller });
				});
				break;
			}
		}
		this.node.querySelector('#edCancel').addEventListener('click', () => this.die());
	}
	die() {
		Interface.toggleOverflow('off');
		this.node.remove();
	}
}
