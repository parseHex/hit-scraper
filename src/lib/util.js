// helpers
export function on(target, type, handler) {
	target.addEventListener(type, handler);
}

export function delegate(target, selector, type, handler) {
	function dispatcher(event) {
		const targets = target.querySelectorAll(selector);
		let i = targets.length;

		while (i--) {
			if (event.target === targets[i]) {
				handler(event);
				break;
			}
		}
	}

	on(target, type, dispatcher);
}

Object.entries = Object.entries || function (obj) {
	const props = Object.keys(obj);
	let i = props.length;
	const objArray = new Array(i);
	while (i--) objArray[i] = [props[i], obj[props[i]]];
	return objArray;
};

export function cleanTemplate(str, opts = {}) {
	str = str.trim(); // remove whitespace from beginning and end
	str = str.replace(/^[\t ]+/gm, ''); // remove indents
	if (!opts.ignoreNewline) {
		str = str.replace(/\n/g, '').replace(/\r/g, ''); // remove newlines
	}
	str = str.replace(/&nbsp;/g, ''); // remove &nbsp; (helps to add spaces to end of lines)

	return str;
}
export function pad(width, n, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
