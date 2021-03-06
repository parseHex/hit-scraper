import * as ifc from 'ifc';
import Settings from 'Settings';
import { pad } from 'lib/util';
import makeTitle from 'lib/make-title';

import { Exporter } from './index';

export default function (this: Exporter, type: string) {
	let msgData = {
		time: (new Date()).getTime(),
		command: 'add' + type + 'Job',
		data: {
			groupId: this.record.groupId,
			title: this.record.title,
			requesterName: this.record.requester.name,
			requesterId: this.record.requester.id,
			pay: +this.record.pay.replace('+', '').replace('$', ''),
			duration: this.record.timeStr,
			hitsAvailable: this.record.numHits,
		},
	};

	if (Settings.user.exportPcCustomTitle) {
		msgData.data.title = makeTitle(convertObj(this.record));
	}

	localStorage.setItem('JR_message_pandacrazy', JSON.stringify(msgData));

	this.die();
}

function convertObj(hit: ifc.HITData) {
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
		pay: '$' + hit.pay + (/bonus/i.test(hit.title) ? '+' : ''), // check if bonus in title
		time: hit.timeStr,
		timeMS: hit.time * 1000, // hit.time is in seconds; x1000 to get ms
		formattedPostDate: dateStr,
	};

	return newObj;
}
