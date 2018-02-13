import { pad } from './util';

export const months = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
export function timeToMS(time) {
	if (time === null) return;

	let days = time.match(/(\d+) days?/);
	let hours = time.match(/(\d+) hours?/);
	let minutes = time.match(/(\d+) minutes?/);
	let seconds = time.match(/(\d+) seconds?/);

	let total = 0;

	if (days) {
		days = +days[1];
		total += days * 86400000;
	}
	if (hours) {
		hours = +hours[1];
		total += hours * 3600000;
	}
	if (minutes) {
		minutes = +minutes[1];
		total += minutes * 60000;
	}
	if (seconds) {
		seconds = +seconds[1];
		total += seconds * 1000;
	}

	if (total === 0 && /\d/.test(time)) {
		// time might not have time units, assume number is seconds
		total += (+time) * 1000;

		time = (time / 60) + ' minutes';
	}

	if (Number.isNaN(total)) {
		// time is probably messed up for some reason; just default to 60 minutes
		console.log('malformed time');

		total = 3600000;
	}

	return total;
}
export function time12to24(time12h) {
	const [time, modifier] = time12h.split(' ');
	let [hours, minutes] = time.split(':');

	if (hours === '12') {
		hours = '00';
	}
	if (modifier === 'PM') {
		hours = parseInt(hours, 10) + 12;
	}

	return hours + ':' + minutes;
}
export function time24To12(hours) {
	return ((hours + 11) % 12 + 1);
}
export function amORpm(hour) {
	if (hour >= 12) return 'PM';

	return 'AM';
}

/**
 * Returns a formatted date
 */
export function formatDate(dateStr) {
	for (let k = 0; k < months.length; k++) {
		dateStr = dateStr.replace(months[k], pad(2, k + 1));
	}

	let dayRegex;

	const date = new Date();

	if (/today/i.test(dateStr)) {
		dayRegex = /today/i;
	} else if (/yesterday/i.test(dateStr)) {
		dayRegex = /yesterday/i;
		date.setDate(date.getDate() - 1);
	}
	const day = pad(2, date.getDate());
	const month = pad(2, date.getMonth() + 1);
	const year = date.getFullYear();

	dateStr = dateStr.replace(dayRegex, `${month}-${day}-${year}`);

	let hour = dateStr.match(/(\D)(\d)(\:\d\d [ap]m$)/i);
	if (hour !== null) {
		hour = pad(2, hour[2]);
		dateStr = dateStr.replace(/(\D)(\d)(\:\d\d [ap]m$)/i, '$1' + hour + '$3');
	}

	dateStr = dateStr.replace(/^(\d\d).(\d\d).+(\d{4}).+(\d\d)\:(\d\d).([ap]m)$/i, '$3-$1-$2T$4:$5 $6');
	let ct = time12to24(dateStr.substr(-8));
	dateStr = dateStr.substring(0, 11) + ct;

	return dateStr;
}

export function getWeek(date) {
	var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	var dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function diffInMinutes(dateString1, dateString2) {
	// https://stackoverflow.com/a/3224854
	const date1 = new Date(dateString1);
	const date2 = new Date(dateString2);

	const msDiff = Math.abs(date2.getTime() - date1.getTime());
	const minutesDiff = Math.ceil(msDiff / (1000 * 60));

	return minutesDiff;
}
