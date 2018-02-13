import * as util from './util';
import * as timeUtil from './time-util';

export default function makeTitle(hit) {
	let deleteTime = '';
	let time = '';

	if (hit.time) {
		const now = new Date();

		const deleteDate = new Date();
		deleteDate.setHours(+hit.formattedPostDate.substr(-5, 2));
		deleteDate.setMinutes(+hit.formattedPostDate.substr(-2, 2));

		// should delete watcher after 2.25 times the hit's duration since it was posted
		deleteDate.setMilliseconds(hit.timeMS * 2.25);

		let day = '';
		if (deleteDate.getDate() !== now.getDate()) {
			day = `${deleteDate.getMonth() + 1}/${deleteDate.getDate()}-`;
		}

		const hours = util.pad(2, timeUtil.time24To12(deleteDate.getHours()));
		const minutes = util.pad(2, deleteDate.getMinutes());
		const ampm = timeUtil.amORpm(deleteDate.getHours());

		deleteTime = `[${day}${hours}:${minutes} ${ampm}] -- `;
	}

	let pay = '';
	if (hit.pay) {
		pay = hit.pay + ' -- ';
	}

	let title = hit.title.trim();
	// let title = hit.title.substr(0, 35).trim();
	if (title.length < hit.title.length) {
		title += '...';
	}

	return deleteTime + pay + title;
}
