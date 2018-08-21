import Interface from 'Interface';
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

	constructor(type: 'include' | 'ignore', caller?: HTMLElement) {
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
		}
		this.node.querySelector('#edCancel').addEventListener('click', () => this.die());
	}
	die() {
		Interface.toggleOverflow('off');
		this.node.remove();
	}
}
