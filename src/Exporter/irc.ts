import Core from 'Core';
import { TO_REPORTS } from 'lib/constants';
import { cleanTemplate } from 'lib/util';

import { Exporter } from './index';

export default function (this: Exporter) {
	// custom MTurk/TO url shortener courtesy of Tjololo
	var api = 'https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959',
		urlArr = [], payload, sym = '\u2022', // sym = bullet
		getTO = () => {
			var _to = this.record.TO;
			if (!_to) return 'Unavailable';
			else return `Pay=${_to.attrs.pay} Fair=${_to.attrs.fair} Comm=${_to.attrs.comm}`;
		};

	urlArr.push(encodeURIComponent(this.record.requester.link));
	urlArr.push(encodeURIComponent(this.record.hit.preview));
	urlArr.push(encodeURIComponent(TO_REPORTS + this.record.requester.id));
	urlArr.push(encodeURIComponent(this.record.hit.panda));
	payload = '&urls[]=' + urlArr.join('&urls[]=');

	this.node.innerHTML = '<span style="font-size:16px">Shortening URLs... <i class="spinner"></i></span>';
	Core.fetch({
		url: api + payload,
		responseType: 'text',
	}).then((r: string) => {
		urlArr = r.split(';').slice(0, 4);
		this.node.innerHTML = cleanTemplate(`
			<p>IRC Export</p>
			<textarea style="display:block;padding:2px;margin:auto;height:130px;width:500px" tabindex="1">
				${(/masters/i.test(this.record.quals.join()) ? `MASTERS ${sym} ` : '')} &nbsp;
				Requester: ${this.record.requester.name} ${urlArr[0]} ${sym} HIT: ${this.record.title} &nbsp;
				${urlArr[1]} ${sym} Pay: ${this.record.pay} ${sym} Avail: ${this.record.numHits} ${sym} &nbsp;
				Limit: ${this.record.time} ${sym} TO: ${getTO()} ${urlArr[2]} ${sym} PandA: ${urlArr[3]}
			</textarea>
			<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>
		`);
		this.node.querySelector('textarea').select();
		const closeBtn = <HTMLButtonElement>this.node.querySelector('#exClose');
		closeBtn.onclick = this.die.bind(this);
	}, (err: Error) => {
		console.error(err);
		this.die();
	});
}
