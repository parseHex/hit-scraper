// helpers
type EventHandler = (e: Event) => void;
type BasicObject = {
	[index: string]: any;
};

export function on(target: HTMLElement, eventType: string, handler: EventHandler) {
	target.addEventListener(eventType, handler);
}

export function delegate(target: HTMLElement, selector: string, eventType: string, handler: EventHandler) {
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

export function entries(obj: BasicObject) {
	const props = Object.keys(obj);
	let i = props.length;
	const objArray = new Array(i);
	while (i--) objArray[i] = [props[i], obj[props[i]]];
	return objArray;
}

// TODO should be a TemplateOptions type
export function cleanTemplate(str: string, opts: BasicObject = {}) {
	str = str.trim(); // remove whitespace from beginning and end
	str = str.replace(/^[\t ]+/gm, ''); // remove indents
	if (!opts.ignoreNewline) {
		str = str.replace(/\n/g, '').replace(/\r/g, ''); // remove newlines
	}
	str = str.replace(/&nbsp;/g, ''); // remove &nbsp; (helps to add spaces to end of lines)

	return str;
}
export function pad(width: number, val: number, padWith: string) {
	padWith = padWith || '0';
	let valStr = val + '';
	return valStr.length >= width ? val : new Array(width - valStr.length + 1).join(padWith) + val;
}
