import { TO_REPORTS } from "../lib/constants";
import Core from '../Core/index';

export default function () {
	// custom MTurk/TO url shortener courtesy of Tjololo
	var api = 'https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959',
		urlArr = [], payload, sym = '\u2022', // sym = bullet
		getTO = () => {
			var _to = this.record.TO;
			if (!_to) return 'Unavailable';
			else return `Pay=${_to.attrs.pay} Fair=${_to.attrs.fair} Comm=${_to.attrs.comm}`;
		};

	urlArr.push(window.encodeURIComponent(this.record.requester.link));
	urlArr.push(window.encodeURIComponent(this.record.hit.preview));
	urlArr.push(window.encodeURIComponent(TO_REPORTS + this.record.requester.id));
	urlArr.push(window.encodeURIComponent(this.record.hit.panda));
	payload = '&urls[]=' + urlArr.join('&urls[]=');

	this.node.innerHTML = '<span style="font-size:16px">Shortening URLs... <i class="spinner"></i></span>';
	Core.fetch(api + payload, null, 'text', false).then(r => {
		urlArr = r.split(';').slice(0, 4);
		this.node.innerHTML = '<p>IRC Export</p>' +
			'<textarea style="display:block;padding:2px;margin:auto;height:130px;width:500px" tabindex="1">' +
			(/masters/i.test(this.record.quals.join()) ? `MASTERS ${sym} ` : '') +
			`Requester: ${this.record.requester.name} ${urlArr[0]} ${sym} HIT: ${this.record.title} ` +
			`${urlArr[1]} ${sym} Pay: ${this.record.pay} ${sym} Avail: ${this.record.numHits} ${sym} ` +
			`Limit: ${this.record.time} ${sym} TO: ${getTO()} ${urlArr[2]} ${sym} PandA: ${urlArr[3]}</textarea>` +
			'<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>';
		this.node.querySelector('textarea').select();
		this.node.querySelector('#exClose').onclick = this.die.bind(this);
	}, err => {
		console.error(err);
		this.die();
	});
}
