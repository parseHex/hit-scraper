import { cleanTemplate } from "../../lib/util";

export function sectionTitle(text) {
	return `<span><b>${text}</b></span>`;
}

export function label(text, htmlFor) {
	if (htmlFor) htmlFor = `for="${htmlFor}"`;

	return `<label ${htmlFor}>${text}</label>`;
}

export function input(type, opts) {
	return cleanTemplate(`
		<input &nbsp;
			type="${type}"
			${parseAttr(opts)}
		/>
	`);
}

export function descriptionTitle(text) {
	return `<span class="dsc-title">${text}</span>`;
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
