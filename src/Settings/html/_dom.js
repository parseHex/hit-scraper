import { cleanTemplate } from '../../lib/util';

export function sectionTitle(text) {
	return `<span class="sec-title">${text}</span>`;
}
export function descriptionTitle(text) {
	return `<span class="dsc-title">${text}</span>`;
}

export function label(text, htmlFor) {
	if (htmlFor) htmlFor = `for="${htmlFor}"`;

	return `<label ${htmlFor}>${text}</label>`;
}

export function select(options, value) {
	let html = '<select>';

	options.forEach(function (opt) {
		let selected = '';
		if (opt.value === value) selected = 'selected';

		html += `
			<option value="${opt.value}" ${selected}>
				${opt.text}
			</option>
		`;
	});

	html += '</select>';

	return html;
}

export function input(type, opts) {
	return cleanTemplate(`
		<input &nbsp;
			type="${type}"
			${parseAttr(opts)}
		/>
	`);
}


function parseAttr(attrs) {
	let returnAttr = '';
	Object.keys(attrs).forEach(function (key) {
		if (attrs[key] === false) return;

		let val = '';
		if (attrs[key] !== true) val = `="${attrs[key]}"`;

		returnAttr += ` ${key}${val}`;
	});
	return returnAttr;
}
