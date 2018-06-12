import * as ifc from '../ifc';

export function on(target: HTMLElement, eventType: string, handler: ifc.EventHandler) {
	target.addEventListener(eventType, handler);
}

export function delegate(target: HTMLElement, selector: string, eventType: string, handler: ifc.EventHandler) {
	function dispatcher(event: Event) {
		const targets = target.querySelectorAll(selector);
		let i = targets.length;

		while (i--) {
			if (event.target === targets[i]) {
				handler(event);
				break;
			}
		}
	}

	on(target, eventType, dispatcher);
}

export function entries(obj: ifc.BasicObject): [string, any][] {
	const props = Object.keys(obj);
	let i = props.length;
	const objArray = new Array(i);
	while (i--) objArray[i] = [props[i], obj[props[i]]];
	return objArray;
}

interface TemplateOptions {
	preformatted?: boolean; // leaves newlines untouched
	titleMode?: boolean; // replace newlines with &#013;
}
export function cleanTemplate(str: string, opts: TemplateOptions = {}) {
	str = str.trim(); // remove whitespace from beginning and end
	str = str.replace(/^[\t ]+/gm, ''); // remove indents
	if (opts.titleMode) {
		str = str.replace(/\n/g, '&#013;');
	} else if (!opts.preformatted) {
		str = str.replace(/\n/g, '').replace(/\r/g, ''); // remove newlines
	}
	str = str.replace(/&nbsp;/g, ''); // remove &nbsp; (used to add spaces to end of lines)

	return str;
}
export function pad(width: number, val: number, padWith: string = '0') {
	let valStr = val + '';
	return valStr.length >= width ? val + '' : new Array(width - valStr.length + 1).join(padWith) + val;
}
