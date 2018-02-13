import { cleanTemplate, pad } from '../lib/util';

import makeTitle from '../lib/make-title';

export default function (type) {
	const msgData = {
		time: (new Date()).getTime(),
		command: 'add' + type + 'Job',
		data: {
			groupId: this.record.groupId,
			title: makeTitle(convertObj(this.record)),
			requesterName: this.record.requester.name,
			requesterId: this.record.requester.id,
			pay: +this.record.pay.replace('+', '').replace('$', ''),
			duration: this.record.timeStr,
			hitsAvailable: this.record.numHits,
		},
	};
	localStorage.setItem('JR_message_pandacrazy', JSON.stringify(msgData));

	this.die();
}

function convertObj(hit) {
	// returns an obj in the format that makeTitle expects
	const now = new Date();
	const month = pad(2, now.getMonth() + 1);
	const day = pad(2, now.getDate());
	const year = now.getFullYear();

	const hour = pad(2, now.getHours());
	const minute = pad(2, now.getMinutes());

	const dateStr = `${month} ${day}, ${year} ${hour}:${minute}`;

	const newObj = {
		title: hit.title,
		pay: hit.pay + (/bonus/i.test(hit.title) ? '+' : ''), // check if bonus in title
		time: hit.timeStr,
		timeMS: hit.time * 1000, // hit.time is in seconds; x1000 to get ms
		formattedPostDate: dateStr,
	};

	return newObj;
}
