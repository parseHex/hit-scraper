import { TO_REPORTS } from '../lib/constants';
import { Exporter } from '.';
import { cleanTemplate } from '../lib/util';

export default function (this: Exporter) {
	var _location = 'ICA';
	var _quals;
	var _masters = '';
	var _title;
	var _r = this.record;
	var tIndex;

	// format qualifications string
	_quals = _r.quals.map(v => {
		if (/(is US|: US$)/.test(v)) {
			_location = 'US';
		} else if (/Masters/.test(v)) {
			_masters = `[${v.match(/.*Masters/)[0].toUpperCase()}]`;
		} else if (/approv[aled]+ (rate|HITs)/.test(v)) {
			return v.replace(/.+ is (.+) than (\d+)/, (_, p1, p2) => {
				if (/^(not g|less)/.test(p1)) {
					return '<' + p2 + (/%/.test(_) ? '%' : '');
				} else if (/^(not l|greater)/.test(p1)) {
					return '>' + p2 + (/%/.test(_) ? '%' : '');
				} else {
					console.error('match error', [_, p1, p2]);
					return _;
				}
			});
		} else {
			return v;
		}
	}).filter(v => v).sort(a => /[><]/.test(a) ? -1 : 1);

	_title = `${_location} - ${_r.title} - ${_r.requester.name} - ${_r.pay}/COMTIME - (${_quals.join(', ') || 'None'}) ${_masters}`;
	tIndex = _title.search(/COMTIME/);
	this.node.style.whiteSpace = 'nowrap';
	this.node.innerHTML = cleanTemplate(`
		<p style="width:500px;white-space:normal">
			/r/HitsWorthTurkingFor Export: Use the buttons on the left for single-click copying. &nbsp;
			Before you post, please remember to replace "COMTIME" with how long it took you to complete the HIT.
		</p>

		<button class="exhwtf" style="height:65px">Title</button>
		<textarea style="padding:2px;margin:auto;height:60px;width:430px;resize:none" tabindex="1" autofocus>
			${_title}
		</textarea>
		<br />

		<button class="exhwtf" style="height:35px">Preview</button>
		<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="2">
			Preview: ${_r.hit.preview}
		</textarea>
		<br />

		<button class="exhwtf" style="height:35px;">Req</button>
		<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="3">
			Req: ${_r.requester.link}
		</textarea>
		<br />

		<button class="exhwtf" style="height:35px;">PandA</button>
		<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="4">
			PandA: ${_r.hit.panda}
		</textarea>
		<br />

		<button class="exhwtf" style="height:35px;">TO</button>
		<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="5">
			TO: ${TO_REPORTS + _r.requester.id}
		</textarea>
		<br />

		<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>
	`);

	var copyfn = function (e: MouseEvent) {
		const btn = <HTMLElement>e.target;
		const textarea = <HTMLTextAreaElement>btn.nextElementSibling;
		textarea.select();
		document.execCommand('copy');
	};
	Array.from(this.node.querySelectorAll('.exhwtf')).forEach((v: HTMLElement) => v.onclick = copyfn);
	this.node.querySelector('textarea').setSelectionRange(tIndex, tIndex + 7);
	const closeBtn = <HTMLButtonElement>this.node.querySelector('#exClose')
	closeBtn.onclick = this.die.bind(this);
}
